using System.Security.Claims;
using AI_PMS.Application.DTOs.SubTasks;
using AI_PMS.Application.Interfaces.SubTasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AI_PMS.API.Controllers.SubTasks
{
    [ApiController]
    [Route("api/subtasks")]
    [Authorize]
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
        // Manager / TeamLeader
        // =========================================================
        [HttpGet]
        [Authorize(Roles = "Manager,TeamLeader")]
        public async Task<IActionResult> GetAll()
        {
            var subtasks = await _subTaskService.GetAllSubTasksAsync();

            return Ok(subtasks);
        }

        // =========================================================
        // GET SUBTASK BY ID
        // GET: api/subtasks/{id}
        // Manager / TeamLeader / Contributor
        //
        // Contributor access must be ownership-checked.
        // =========================================================
        [HttpGet("{id:guid}")]
        [Authorize(Roles = "Manager,TeamLeader,Contributor")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var subtask = await _subTaskService.GetSubTaskByIdAsync(id);

            if (subtask == null)
            {
                return NotFound(new
                {
                    message = "Subtask not found."
                });
            }

            // Contributors may only access subtasks belonging
            // to their assigned parent task.
            if (User.IsInRole("Contributor"))
            {
                var userIdClaim =
                    User.FindFirstValue(ClaimTypes.NameIdentifier);

                if (!Guid.TryParse(userIdClaim, out var userId))
                {
                    return Unauthorized(new
                    {
                        message = "Invalid user identity."
                    });
                }

                var authorized =
                    await _subTaskService.CanContributorAccessSubTaskAsync(
                        userId,
                        id);

                if (!authorized)
                {
                    return Forbid();
                }
            }

            return Ok(subtask);
        }

        // =========================================================
        // GET SUBTASKS BY TASK
        // GET: api/subtasks/task/{taskId}
        //
        // Manager / TeamLeader / Contributor
        //
        // Contributor can ONLY see subtasks of a task assigned
        // to them.
        // =========================================================
        [HttpGet("task/{taskId:guid}")]
        [Authorize(Roles = "Manager,TeamLeader,Contributor")]
        public async Task<IActionResult> GetByTask(Guid taskId)
        {
            if (User.IsInRole("Contributor"))
            {
                var userIdClaim =
                    User.FindFirstValue(ClaimTypes.NameIdentifier);

                if (!Guid.TryParse(userIdClaim, out var userId))
                {
                    return Unauthorized(new
                    {
                        message = "Invalid user identity."
                    });
                }

                var result =
                    await _subTaskService.GetMyTaskSubTasksAsync(
                        userId,
                        taskId);

                if (!result.Success)
                {
                    if (result.Message == "Contributor not found.")
                    {
                        return Unauthorized(new
                        {
                            message = result.Message
                        });
                    }

                    if (result.Message == "Contributor account is inactive.")
                    {
                        return Forbid();
                    }

                    if (result.Message == "You cannot access this task.")
                    {
                        return Forbid();
                    }

                    if (result.Message == "Task not found.")
                    {
                        return NotFound(new
                        {
                            message = result.Message
                        });
                    }

                    return BadRequest(new
                    {
                        message = result.Message
                    });
                }

                return Ok(result.SubTasks);
            }

            var subtasks =
                await _subTaskService.GetTaskSubTasksAsync(taskId);

            return Ok(subtasks);
        }

        // =========================================================
        // CREATE SUBTASK
        // POST: api/subtasks
        // TeamLeader
        // =========================================================
        [HttpPost]
        [Authorize(Roles = "TeamLeader")]
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
        // UPDATE SUBTASK DEFINITION
        // PUT: api/subtasks/{id}
        // TeamLeader
        //
        // Contributor CANNOT use this endpoint.
        // =========================================================
        [HttpPut("{id:guid}")]
        [Authorize(Roles = "TeamLeader")]
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
        // UPDATE AI SUBTASK STATUS / PROGRESS
        // PUT: api/subtasks/{id}/status
        // Contributor ONLY
        // =========================================================
        [HttpPut("{id:guid}/status")]
        [Authorize(Roles = "Contributor")]
        public async Task<IActionResult> UpdateMyAISubTaskStatus(
            Guid id,
            [FromBody] UpdateAISubTaskStatusDto dto)
        {
            var userIdClaim =
                User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new
                {
                    message = "Invalid user identity."
                });
            }

            var result =
                await _subTaskService.UpdateMyAISubTaskStatusAsync(
                    userId,
                    id,
                    dto);

            if (result.SubTask == null)
            {
                return result.Message switch
                {
                    "Contributor not found."
                        => Unauthorized(new
                        {
                            message = result.Message
                        }),

                    "Contributor account is inactive."
                        => Forbid(),

                    "Subtask not found."
                        => NotFound(new
                        {
                            message = result.Message
                        }),

                    "Task not found."
                        => NotFound(new
                        {
                            message = result.Message
                        }),

                    "You cannot update this subtask."
                        => Forbid(),

                    "This subtask cannot be modified."
                        => Conflict(new
                        {
                            message = result.Message
                        }),

                    "Invalid subtask status."
                        => BadRequest(new
                        {
                            message = result.Message
                        }),

                    "Progress must be between 0 and 100."
                        => BadRequest(new
                        {
                            message = result.Message
                        }),

                    "This status change is not allowed."
                        => BadRequest(new
                        {
                            message = result.Message
                        }),

                    _ => BadRequest(new
                    {
                        message = result.Message
                    })
                };
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
        // TeamLeader
        //
        // Contributor CANNOT delete.
        // =========================================================
        [HttpDelete("{id:guid}")]
        [Authorize(Roles = "TeamLeader")]
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