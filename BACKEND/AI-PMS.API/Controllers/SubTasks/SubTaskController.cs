using AI_PMS.Application.DTOs.SubTasks;
using AI_PMS.Application.Interfaces.SubTasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AI_PMS.API.Controllers.SubTasks
{
    [ApiController]
    [Route("api/subtasks")]
    [Authorize(Roles = "Manager")]
    public class SubTaskController : ControllerBase
    {
        private readonly ISubTaskService _subTaskService;

        public SubTaskController(ISubTaskService subTaskService)
        {
            _subTaskService = subTaskService;
        }

        // =========================================================
        // GET ALL SUBTASKS
        // GET: api/subtasks
        // Manager only
        // =========================================================
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var subtasks =
                await _subTaskService.GetAllSubTasksAsync();

            return Ok(subtasks);
        }

        // =========================================================
        // GET SUBTASK BY ID
        // GET: api/subtasks/{id}
        // Manager only
        // =========================================================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var subtask =
                await _subTaskService.GetSubTaskByIdAsync(id);

            if (subtask == null)
            {
                return NotFound(new
                {
                    message = "Subtask not found."
                });
            }

            return Ok(subtask);
        }

        // =========================================================
        // GET SUBTASKS BY TASK
        // GET: api/subtasks/task/{taskId}
        // Manager only
        // =========================================================
        [HttpGet("task/{taskId}")]
        public async Task<IActionResult> GetByTask(Guid taskId)
        {
            var subtasks =
                await _subTaskService.GetTaskSubTasksAsync(taskId);

            return Ok(subtasks);
        }

        // =========================================================
        // CREATE SUBTASK
        // POST: api/subtasks
        // Manager only
        // =========================================================
        [HttpPost]
        public async Task<IActionResult> Create(
            [FromBody] CreateSubTaskDto dto)
        {
            try
            {
                var result =
                    await _subTaskService.CreateSubTaskAsync(dto);

                if (!result.Success)
                {
                    return Conflict(new
                    {
                        message = result.Message
                    });
                }

                return Ok(new
                {
                    message = result.Message,
                    subtask = result.SubTask
                });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new
                {
                    message = ex.Message
                });
            }
        }

        // =========================================================
        // APPROVE SUBTASK
        // PUT: api/subtasks/{id}/approve
        // Manager only
        // =========================================================
        [HttpPut("{id}/approve")]
        public async Task<IActionResult> Approve(Guid id)
        {
            var result =
                await _subTaskService.ApproveSubTaskAsync(id);

            if (!result.Success)
            {
                if (result.Message == "Subtask not found.")
                {
                    return NotFound(new
                    {
                        message = result.Message
                    });
                }

                return Conflict(new
                {
                    message = result.Message
                });
            }

            return Ok(new
            {
                message = result.Message
            });
        }

        // =========================================================
        // UPDATE SUBTASK
        // PUT: api/subtasks/{id}
        // Manager only
        // =========================================================
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(
            Guid id,
            [FromBody] UpdateSubTaskDto dto)
        {
            var result =
                await _subTaskService.UpdateSubTaskAsync(
                    id,
                    dto);

            if (!result.Success)
            {
                if (result.Message == "Subtask not found.")
                {
                    return NotFound(new
                    {
                        message = result.Message
                    });
                }

                return Conflict(new
                {
                    message = result.Message,
                    subtask = result.SubTask
                });
            }

            return Ok(new
            {
                message = result.Message,
                subtask = result.SubTask
            });
        }

        // =========================================================
        // DELETE / ARCHIVE SUBTASK
        // DELETE: api/subtasks/{id}
        // Manager only
        // =========================================================
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result =
                await _subTaskService.DeleteSubTaskAsync(id);

            if (!result.Success)
            {
                if (result.Message == "Subtask not found.")
                {
                    return NotFound(new
                    {
                        message = result.Message
                    });
                }

                return Conflict(new
                {
                    message = result.Message
                });
            }

            return Ok(new
            {
                message = result.Message
            });
        }
    }
}