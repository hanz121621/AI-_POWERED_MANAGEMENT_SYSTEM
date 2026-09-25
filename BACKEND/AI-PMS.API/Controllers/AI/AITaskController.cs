using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using AI_PMS.Application.DTOs.AI;
using AI_PMS.Application.DTOs.Tasks;
using AI_PMS.Application.Interfaces.AI;
using AI_PMS.Application.Interfaces.Tasks;
using AI_PMS.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace AI_PMS.API.Controllers.AI
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin,Manager,Contributor")] // Allows Team Leaders (Contributors)
    public class AITaskController : ControllerBase
    {
        private readonly IAIService _aiService;
        private readonly IAiSuggestionService _aiSuggestionService; // 🌟 ADDED THIS
        private readonly ITaskService _taskService;
        private readonly ILogger<AITaskController> _logger;

        public AITaskController(
            IAIService aiService,
            IAiSuggestionService aiSuggestionService, // 🌟 ADDED THIS
            ITaskService taskService,
            ILogger<AITaskController> logger)
        {
            _aiService = aiService;
            _aiSuggestionService = aiSuggestionService; // 🌟 ADDED THIS
            _taskService = taskService;
            _logger = logger;
        }

        // =========================================================
        // 1. GENERATE TASK BREAKDOWN
        // =========================================================
        [HttpPost("generate-task-breakdown")]
        public async Task<IActionResult> GenerateTaskBreakdown(
            [FromBody] GenerateTaskBreakdownRequest request,
            CancellationToken cancellationToken)
        {
            try
            {
                _logger.LogInformation("Generating AI task breakdown for sprint: {SprintGoal}", request.SprintGoal);

                var result = await _aiService.GenerateTaskBreakdownAsync(
                    request.SprintGoal,
                    request.SprintDescription,
                    cancellationToken);

                return Ok(new
                {
                    Success = true,
                    Message = "Task breakdown generated successfully.",
                    Data = result.Tasks
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to generate task breakdown");
                return StatusCode(500, new
                {
                    Success = false,
                    Message = "Failed to generate AI task breakdown.",
                    Error = ex.Message
                });
            }
        }

        // =========================================================
        // 🌟 NEW ENDPOINT: GENERATE AI STATUS UPDATE
        // =========================================================
        [HttpPost("generate-status-update")]
        [Authorize(Roles = "Admin,Manager,Contributor")] 
        public async Task<IActionResult> GenerateStatusUpdate(
            [FromBody] GenerateStatusUpdateRequest request,
            CancellationToken cancellationToken)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.UserBriefNote))
                {
                    return BadRequest(new { Success = false, Message = "Please provide a brief note for the AI to expand." });
                }

                _logger.LogInformation("Generating AI status update for task: {TaskTitle}", request.TaskTitle);

                string prompt = $@"
You are an expert Agile Software Developer. 
Expand the following brief developer note into a professional, clear, and detailed task status update.

Task Title: {request.TaskTitle}
Task Description: {request.TaskDescription}
Current Status: {request.CurrentStatus}
Developer's Brief Note: ""{request.UserBriefNote}""

Requirements:
1. Write in the first person (e.g., ""I have completed..."").
2. Keep it professional, concise, and action-oriented.
3. Mention any implied testing or validation based on the brief note.
4. Do NOT use markdown formatting (no ** or #). Just plain text.
5. Keep it under 150 words.

Professional Status Update:";

                // 🌟 Call the AI Service. 
                // Note: If your IAiSuggestionService uses a different method name (like TestAiConnectionAsync), 
                // change 'GenerateAsync' to match your actual method.
              var aiResponse = await _aiSuggestionService.TestAiConnectionAsync(prompt); 

                return Ok(new
                {
                    Success = true,
                    Message = "Status update generated successfully.",
                    Data = new { GeneratedUpdate = aiResponse }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to generate AI status update");
                return StatusCode(500, new
                {
                    Success = false,
                    Message = "Failed to generate AI status update.",
                    Error = ex.Message
                });
            }
        }
        // =========================================================
// 🌟 NEW ENDPOINT: AI STATUS UPDATE ENHANCER (For Devs/Staff)
// =========================================================
[HttpPost("enhance-status-update")]
[Authorize(Roles = "Admin,Manager,Contributor")] 
public async Task<IActionResult> EnhanceStatusUpdate(
    [FromBody] EnhanceStatusUpdateRequest request,
    CancellationToken cancellationToken)
{
    try
    {
        if (string.IsNullOrWhiteSpace(request.BriefNote))
        {
            return BadRequest(new { Success = false, Message = "Please provide a brief note to enhance." });
        }

        _logger.LogInformation("Enhancing status update for task: {TaskTitle}", request.TaskTitle);

        // 🌟 The AI Prompt
        string prompt = $@"
You are an expert Agile Software Developer. 
Rewrite the following brief developer note into a professional, clear, and detailed task status update.

Task Title: {request.TaskTitle}
Current Status: {request.CurrentStatus}
Developer's Brief Note: ""{request.BriefNote}""

Requirements:
1. Write in the first person (e.g., ""I have completed..."").
2. Keep it professional, concise, and action-oriented.
3. Mention implied testing or validation based on the note.
4. Do NOT use markdown formatting (no ** or #). Just plain text.
5. Keep it under 100 words.

Professional Status Update:";

        // Call your AI service (using the same method name that worked for task breakdown)
        var aiResponse = await _aiSuggestionService.TestAiConnectionAsync(prompt); 

        return Ok(new
        {
            Success = true,
            Message = "Status update enhanced successfully.",
            Data = new { EnhancedUpdate = aiResponse }
        });
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Failed to enhance status update");
        return StatusCode(500, new { Success = false, Message = "Failed to enhance update.", Error = ex.Message });
    }
}

// 🌟 Add this DTO at the bottom of the file with the others
public class EnhanceStatusUpdateRequest
{
    public string TaskTitle { get; set; } = string.Empty;
    public string CurrentStatus { get; set; } = string.Empty;
    public string BriefNote { get; set; } = string.Empty;
}

// =========================================================
// 🌟 NEW ENDPOINT: AI BLOCKER RESOLUTION ASSISTANT
// =========================================================
[HttpPost("resolve-blocker")]
[Authorize(Roles = "Admin,Manager,Contributor")] // Developers/Staff are Contributors
public async Task<IActionResult> ResolveBlocker(
    [FromBody] ResolveBlockerRequest request,
    CancellationToken cancellationToken)
{
    try
    {
        if (string.IsNullOrWhiteSpace(request.BlockerDescription))
        {
            return BadRequest(new { Success = false, Message = "Please describe the blocker." });
        }

        _logger.LogInformation("Generating AI blocker resolution for task: {TaskTitle}", request.TaskTitle);

        // 🌟 The AI Prompt
        string prompt = $@"
You are an expert Senior Software Engineer and Technical Lead.
A developer is blocked on a task and needs immediate troubleshooting steps.

Task Title: {request.TaskTitle}
Task Description: {request.TaskDescription}
Developer's Blocker Note: ""{request.BlockerDescription}""

Requirements:
1. Provide exactly 3 clear, actionable troubleshooting steps to resolve this issue.
2. Write in a supportive, professional tone.
3. Do NOT use markdown formatting (no ** or #). Just plain text with numbered steps (1., 2., 3.).
4. Keep the total response under 150 words.

Troubleshooting Steps:";

        // Call your AI Service (using the same method name you used before)
        var aiResponse = await _aiSuggestionService.TestAiConnectionAsync(prompt); 

        return Ok(new
        {
            Success = true,
            Message = "AI suggestions generated successfully.",
            Data = new { Suggestions = aiResponse }
        });
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Failed to generate blocker resolution");
        return StatusCode(500, new { Success = false, Message = "Failed to get AI help.", Error = ex.Message });
    }
}

// 🌟 Add this DTO at the bottom with the others
public class ResolveBlockerRequest
{
    public string TaskTitle { get; set; } = string.Empty;
    public string TaskDescription { get; set; } = string.Empty;
    public string BlockerDescription { get; set; } = string.Empty;
}

        // =========================================================
        // 2. SAVE AI GENERATED TASKS
        // =========================================================
        [HttpPost("save-generated-tasks")]
        public async Task<IActionResult> SaveGeneratedTasks(
            [FromBody] BulkCreateAiTasksRequest request,
            CancellationToken cancellationToken)
        {
            try
            {
                if (request.Tasks == null || !request.Tasks.Any())
                {
                    return BadRequest(new { Success = false, Message = "No tasks provided to save." });
                }

                var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(currentUserId) || !Guid.TryParse(currentUserId, out var managerId))
                {
                    return Unauthorized(new { Success = false, Message = "Invalid user identity." });
                }

                _logger.LogInformation("Saving {Count} AI-generated tasks for Sprint {SprintId}", 
                    request.Tasks.Count, request.SprintId);

                var createdTasks = new List<object>();

                foreach (var aiTask in request.Tasks)
                {
                    var createTaskDto = new CreateTaskDto
                    {
                        SprintId = request.SprintId,
                        ProjectId = request.ProjectId,
                        ParentTaskId = request.ParentTaskId,
                        
                        Title = aiTask.Title,
                        Description = aiTask.Description,
                        EstimatedHours = aiTask.EstimatedHours,
                        DueDate = DateTime.UtcNow.AddDays(7), 
                        Priority = TaskPriority.Medium,
                        
                        IsAiGenerated = true,
                        AiMetadata = $"AI Recommended Role: {aiTask.RecommendedRole}"
                    };

                    var success = await _taskService.CreateTaskAsync(managerId, createTaskDto);
                    
                    if (success)
                    {
                        createdTasks.Add(new { aiTask.Title, aiTask.Description });
                    }
                }

                return Ok(new
                {
                    Success = true,
                    Message = $"{createdTasks.Count} tasks successfully saved to the Sprint.",
                    Data = createdTasks
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to save AI-generated tasks");
                return StatusCode(500, new
                {
                    Success = false,
                    Message = "An error occurred while saving the tasks.",
                    Error = ex.Message
                });
            }
        }
    }

    // =========================================================
    // REQUEST DTOs
    // =========================================================
    public class GenerateTaskBreakdownRequest
    {
        public string SprintGoal { get; set; } = string.Empty;
        public string SprintDescription { get; set; } = string.Empty;
    }

    public class BulkCreateAiTasksRequest
    {
        public Guid ProjectId { get; set; }
        public Guid SprintId { get; set; }
        public Guid? ParentTaskId { get; set; } 
        public List<AISuggestedTask> Tasks { get; set; } = new();
    }

    public class AISuggestedTask
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int EstimatedHours { get; set; }
        public string RecommendedRole { get; set; } = string.Empty;
    }

    public class GenerateStatusUpdateRequest
    {
        public string TaskTitle { get; set; } = string.Empty;
        public string TaskDescription { get; set; } = string.Empty;
        public string CurrentStatus { get; set; } = string.Empty;
        public string UserBriefNote { get; set; } = string.Empty;
    }
}