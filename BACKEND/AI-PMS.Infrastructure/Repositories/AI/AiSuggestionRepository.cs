using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AI_PMS.Application.DTOs.AI;
using AI_PMS.Application.Interfaces.Repositories.AI;
using AI_PMS.Domain.Entities.AI;
using AI_PMS.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using AI_PMS.Domain.Entities.Tasks;

namespace AI_PMS.Infrastructure.Repositories.AI
{
    public class AiSuggestionRepository : IAiSuggestionRepository
    {
        private readonly ApplicationDbContext _context;

        public AiSuggestionRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(AiSuggestion suggestion)
        {
            await _context.AiSuggestions.AddAsync(suggestion);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

        public async Task<AiSettings> GetAiSettingsAsync()
        {
            return await _context.AiSettings.FirstOrDefaultAsync();
        }

        public async Task UpdateAiSettingsAsync(AiSettings settings)
        {
            var existing = await _context.AiSettings.FirstOrDefaultAsync();
            
            if (existing == null)
            {
                settings.Id = Guid.NewGuid();
                settings.UpdatedAt = DateTime.UtcNow;
                await _context.AiSettings.AddAsync(settings);
            }
            else
            {
                existing.ModelName = settings.ModelName;
                existing.Endpoint = settings.Endpoint;
                existing.IsAiEnabled = settings.IsAiEnabled;
                existing.UpdatedAt = DateTime.UtcNow;
            }
            
            await _context.SaveChangesAsync();
        }

        public async Task<AiUsageLog> LogAiUsageAsync(AiUsageLog usageLog)
        {
            await _context.AiUsageLogs.AddAsync(usageLog);
            await _context.SaveChangesAsync();
            return usageLog;
        }

        public async Task<List<AiUsageLog>> GetAiUsageLogsAsync(DateTime? startDate = null, DateTime? endDate = null, string? featureType = null, Guid? projectId = null)
        {
            var query = _context.AiUsageLogs.AsQueryable();

            if (startDate.HasValue)
                query = query.Where(l => l.CreatedAt >= startDate.Value);

            if (endDate.HasValue)
                query = query.Where(l => l.CreatedAt <= endDate.Value);

            if (!string.IsNullOrWhiteSpace(featureType))
                query = query.Where(l => l.FeatureType == featureType);

            if (projectId.HasValue)
                query = query.Where(l => l.ProjectId == projectId.Value);

            return await query.OrderByDescending(l => l.CreatedAt).ToListAsync();
        }

        // 🌟 UPDATED METHOD WITH ADMIN/MANAGER AUTHORIZATION CHECK 🌟
                public async Task<ProjectAiContextDto> GetProjectContextAsync(Guid projectId, Guid userId)
        {
            // 1. Fetch the user to check their role
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
            {
                throw new UnauthorizedAccessException("User not found.");
            }

            // 🌟 FIX: Cast the Role enum to int before comparing to 1 (Admin)
            bool isAdmin = (int)user.Role == 1; 

            // 2. Fetch the project
            var project = await _context.Projects.FirstOrDefaultAsync(p => p.Id == projectId);

            if (project == null)
            {
                throw new KeyNotFoundException("Project not found.");
            }

            // 3. Verify Authorization
            // Admins can view any project. Managers can only view their assigned projects.
            if (!isAdmin && project.ManagerId != userId)
            {
                throw new UnauthorizedAccessException("You are not authorized to view this project's AI analysis.");
            }

            // 4. Gather Sprint Metrics
            var sprints = await _context.Sprints.Where(s => s.ProjectId == projectId).ToListAsync();
            var activeSprint = sprints.FirstOrDefault(s => s.Status.ToString() == "Active" || s.Status.ToString() == "InProgress");

            // 5. Gather Task Metrics 
            var sprintIds = sprints.Select(s => s.Id).ToList();
            
            var tasks = new List<TaskItem>(); 
            
            if (sprintIds.Any())
            {
                tasks = await _context.Set<TaskItem>()
                                      .Where(t => sprintIds.Contains(t.SprintId))
                                      .ToListAsync();
            }

            var completedTasks = tasks.Count(t => t.Status.ToString() == "Completed" || t.Status.ToString() == "Done");
            var blockedTasks = tasks.Count(t => t.Status.ToString() == "Blocked");
            var overdueTasks = tasks.Count(t => (t.Status.ToString() != "Completed" && t.Status.ToString() != "Done") && t.DueDate < DateTime.UtcNow);

            // 6. Gather Team Metrics
            var teamMembersCount = await _context.TeamMembers.CountAsync(tm => tm.TeamId == project.TeamId);

            return new ProjectAiContextDto
            {
                ProjectId = project.Id,
                ProjectName = project.Name,
                CurrentStatus = "Active",
                Deadline = project.Deadline.ToString("yyyy-MM-dd"),
                Description = project.Description ?? "No description provided.",
                TotalSprints = sprints.Count,
                ActiveSprints = activeSprint != null ? 1 : 0,
                ActiveSprintName = activeSprint?.Name ?? "None",
                TotalTasks = tasks.Count,
                CompletedTasks = completedTasks,
                BlockedTasks = blockedTasks,
                OverdueTasks = overdueTasks,
                TotalTeamMembers = teamMembersCount
            };
        }
    }}