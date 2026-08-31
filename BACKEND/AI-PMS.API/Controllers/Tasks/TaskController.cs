using AI_PMS.Application.DTOs.Tasks;
using AI_PMS.Application.Interfaces.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AI_PMS.API.Controllers.Tasks
{
    [ApiController]
    [Route("api/tasks")]
    [Authorize]
    public class TaskController : ControllerBase
    {
        private readonly ITaskService _taskService;
        private readonly ITeamLeaderTaskService _teamLeaderTaskService;

        public TaskController(
            ITaskService taskService,
            ITeamLeaderTaskService teamLeaderTaskService)
        {
            _taskService = taskService;
            _teamLeaderTaskService = teamLeaderTaskService;
        }


        // =====================================================
        // CREATE TASK
        // Manager only
        // =====================================================

        // POST: api/tasks
        [HttpPost]
        [Authorize(Roles = "Manager")]
        public async Task<IActionResult> CreateTask(
            [FromBody] CreateTaskDto dto)
        {
            var userIdClaim =
                User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
            {
                return Unauthorized(new
                {
                    message = "Invalid user."
                });
            }

            var managerId =
                Guid.Parse(userIdClaim.Value);

            try
            {
                var success =
                    await _taskService.CreateTaskAsync(
                        managerId,
                        dto);

                if (!success)
                {
                    return BadRequest(new
                    {
                        message = "Sprint not found."
                    });
                }

                return Ok(new
                {
                    message = "Task created successfully."
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


        // =====================================================
        // GET ALL TASKS
        // =====================================================

        // GET: api/tasks
        [HttpGet]
        public async Task<IActionResult> GetAllTasks()
        {
            var tasks =
                await _taskService.GetAllTasksAsync();

            return Ok(tasks);
        }


        // =====================================================
        // MY WORK
        // Developer / Staff Contributor
        // =====================================================

        // GET: api/tasks/my-work
        [HttpGet("my-work")]
        [Authorize(Roles = "Contributor")]
        public async Task<IActionResult> GetMyWork()
        {
            var userIdClaim =
                User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null ||
                !Guid.TryParse(
                    userIdClaim.Value,
                    out var contributorSDId))
            {
                return Unauthorized(new
                {
                    message = "Invalid user."
                });
            }

            try
            {
                var tasks =
                    await _taskService.GetMyWorkAsync(
                        contributorSDId);

                return Ok(tasks);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }


        // =====================================================
        // VIEW MY SPRINT TASKS
        // Developer / Staff
        // =====================================================

        // GET: api/tasks/my-sprint/{sprintId}
        [HttpGet("my-sprint/{sprintId}")]
        [Authorize(Roles = "Contributor")]
        public async Task<IActionResult> GetMySprintTasks(
            Guid sprintId)
        {
            var userIdClaim =
                User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
            {
                return Unauthorized(new
                {
                    message = "Invalid user."
                });
            }

            if (!Guid.TryParse(
                    userIdClaim.Value,
                    out var userId))
            {
                return Unauthorized(new
                {
                    message = "Invalid user ID."
                });
            }

            try
            {
                var result =
                    await _taskService.GetMySprintTasksAsync(
                        userId,
                        sprintId);

                if (result == null)
                {
                    return NotFound(new
                    {
                        message =
                            "Sprint not found or unavailable."
                    });
                }

                return Ok(result);
            }
            catch
            {
                return StatusCode(500, new
                {
                    message =
                        "Unable to load sprint information. Please try again."
                });
            }
        }


        // =====================================================
        // UPDATE MY TASK STATUS
        // Developer / Staff Contributor
        // =====================================================

        // PUT: api/tasks/{id}/status
        [HttpPut("{id}/status")]
        [Authorize(Roles = "Contributor")]
        public async Task<IActionResult> UpdateMyTaskStatus(
            Guid id,
            [FromBody] UpdateTaskStatusDto dto)
        {
            var userIdClaim =
                User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null ||
                !Guid.TryParse(
                    userIdClaim.Value,
                    out var userId))
            {
                return Unauthorized(new
                {
                    message = "Invalid user."
                });
            }

            if (dto == null)
            {
                return BadRequest(new
                {
                    message =
                        "Status information is required."
                });
            }

            try
            {
                var result =
                    await _taskService.UpdateMyTaskStatusAsync(
                        userId,
                        id,
                        dto);

                if (result.Message == "Task not found.")
                {
                    return NotFound(new
                    {
                        message = result.Message
                    });
                }

                if (result.Message == "Contributor not found.")
                {
                    return Unauthorized(new
                    {
                        message = result.Message
                    });
                }

                if (result.Message ==
                    "Contributor account is inactive.")
                {
                    return Forbid();
                }

                if (result.Message ==
                    "You cannot update this task.")
                {
                    return Forbid();
                }

                if (result.Message ==
                    "This task cannot be modified.")
                {
                    return Conflict(new
                    {
                        message = result.Message
                    });
                }

                if (result.Message ==
                    "Invalid task status.")
                {
                    return BadRequest(new
                    {
                        message = result.Message
                    });
                }

                if (result.Message ==
                    "This status change is not allowed.")
                {
                    return BadRequest(new
                    {
                        message = result.Message
                    });
                }

                if (result.Message ==
                    "The task already has this status.")
                {
                    return Ok(new
                    {
                        message = result.Message,
                        task = result.Task
                    });
                }

                if (result.Task != null)
                {
                    return Ok(new
                    {
                        message = result.Message,
                        task = result.Task
                    });
                }

                return BadRequest(new
                {
                    message = result.Message
                });
            }
            catch (Exception)
            {
                return StatusCode(500, new
                {
                    message =
                        "Unable to update task status. Please try again."
                });
            }
        }


        // =====================================================
        // VIEW TASK BY ID
        // =====================================================

        // GET: api/tasks/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTaskById(
            Guid id)
        {
            var task =
                await _taskService.GetTaskByIdAsync(id);

            if (task == null)
            {
                return NotFound(new
                {
                    message = "Task not found."
                });
            }

            if (User.IsInRole("Contributor"))
            {
                var userIdClaim =
                    User.FindFirst(
                        ClaimTypes.NameIdentifier);

                if (userIdClaim == null ||
                    !Guid.TryParse(
                        userIdClaim.Value,
                        out var userId))
                {
                    return Unauthorized(new
                    {
                        message = "Invalid user."
                    });
                }

                if (task.AssignedContributorSDId != userId)
                {
                    return Forbid();
                }
            }

            return Ok(task);
        }


        // =====================================================
        // GET CONTRIBUTOR TASKS
        // =====================================================

        // GET: api/tasks/developer/{developerId}
        [HttpGet("developer/{developerId}")]
        public async Task<IActionResult> GetContributorTasks(
            Guid developerId)
        {
            var tasks =
                await _taskService.GetContributorSDTasksAsync(
                    developerId);

            return Ok(tasks);
        }


        // =====================================================
        // UPDATE TASK
        // Manager only
        // =====================================================

        // PUT: api/tasks/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Manager")]
        public async Task<IActionResult> UpdateTask(
            Guid id,
            [FromBody] UpdateTaskDto dto)
        {
            var result =
                await _taskService.UpdateTaskAsync(
                    id,
                    dto);

            if (result.Message == "Task not found.")
            {
                return NotFound(new
                {
                    message = result.Message
                });
            }

            if (result.Task == null)
            {
                return Conflict(new
                {
                    message = result.Message
                });
            }

            return Ok(new
            {
                message = result.Message,
                task = result.Task
            });
        }


        // =====================================================
        // DELETE TASK
        // Manager only
        // =====================================================

        // DELETE: api/tasks/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Manager")]
        public async Task<IActionResult> DeleteTask(
            Guid id)
        {
            var success =
                await _taskService.DeleteTaskAsync(id);

            if (!success)
            {
                return NotFound("Task not found.");
            }

            return Ok(new
            {
                message =
                    "Task deleted successfully."
            });
        }


        // =====================================================
        // GET ASSIGNABLE CONTRIBUTORS
        // Manager only
        // =====================================================

        // GET: api/tasks/assignable-users
        [HttpGet("assignable-users")]
        [Authorize(Roles = "Manager")]
        public async Task<IActionResult> GetAssignableUsers()
        {
            var users =
                await _taskService.GetAssignableUsersAsync();

            return Ok(users);
        }


        // =========================================================
        // TASK-003
        // DELETE TASK
        // TEAM LEADER
        // =========================================================

        // DELETE:
        // api/tasks/team-leader/{taskId}
        [HttpDelete("team-leader/{taskId:guid}")]
        [Authorize(Roles = "TeamLeader")]
        public async Task<IActionResult> TeamLeaderDeleteTask(
            Guid taskId)
        {
            var userIdClaim =
                User.FindFirst(
                    ClaimTypes.NameIdentifier);

            if (userIdClaim == null ||
                !Guid.TryParse(
                    userIdClaim.Value,
                    out var teamLeaderId))
            {
                return Unauthorized(new
                {
                    message = "Invalid user."
                });
            }

            try
            {
                var result =
                    await _teamLeaderTaskService
                        .DeleteTaskAsync(
                            teamLeaderId,
                            taskId);

                if (result.Message == "Task not found.")
                {
                    return NotFound(new
                    {
                        message = result.Message
                    });
                }

                if (result.Message ==
                    "Completed tasks cannot be deleted. Archive the task instead.")
                {
                    return Conflict(new
                    {
                        message = result.Message
                    });
                }

                if (result.Message ==
                    "You are not authorised to delete this task.")
                {
                    return Forbid();
                }

                if (result.Success)
                {
                    return Ok(new
                    {
                        message = result.Message
                    });
                }

                return BadRequest(new
                {
                    message = result.Message
                });
            }
            catch (Exception)
            {
                return StatusCode(500, new
                {
                    message =
                        "Unable to delete task. Please try again."
                });
            }
        }
                          
                  // =========================================================
// TASK-005
// SET TASK PRIORITY
// TEAM LEADER
// =========================================================

// PUT: api/team-leader/tasks/{taskId}/priority
[HttpPut("{taskId:guid}/priority")]
public async Task<IActionResult> SetTaskPriority(
    Guid taskId,
    [FromBody] SetTaskPriorityDto dto)
{
    // -----------------------------------------------------
    // 1. Get logged-in Team Leader
    // -----------------------------------------------------

    var userIdClaim =
        User.FindFirst(ClaimTypes.NameIdentifier);

    if (userIdClaim == null ||
        !Guid.TryParse(
            userIdClaim.Value,
            out var teamLeaderId))
    {
        return Unauthorized(new
        {
            message = "Invalid user."
        });
    }

    // -----------------------------------------------------
    // 2. Validate request
    // -----------------------------------------------------

    if (dto == null)
    {
        return BadRequest(new
        {
            message = "Invalid priority value."
        });
    }

    try
    {
        // -------------------------------------------------
        // 3. Set task priority
        // -------------------------------------------------

        var result =
            await _teamLeaderTaskService
                .SetTaskPriorityAsync(
                    teamLeaderId,
                    taskId,
                    dto);

        // -------------------------------------------------
        // Task not found
        // -------------------------------------------------

        if (result.Message == "Task not found.")
        {
            return NotFound(new
            {
                message = result.Message
            });
        }

        // -------------------------------------------------
        // Invalid priority
        // -------------------------------------------------

        if (result.Message == "Invalid priority value.")
        {
            return BadRequest(new
            {
                message = result.Message
            });
        }

        // -------------------------------------------------
        // Unauthorized
        // -------------------------------------------------

        if (result.Message ==
            "You are not authorised to change this task priority.")
        {
            return Forbid();
        }

        // -------------------------------------------------
        // Same priority
        // -------------------------------------------------

        if (result.Message ==
            "The task already has this priority.")
        {
            return Ok(new
            {
                message = result.Message,
                task = result.Task
            });
        }

        // -------------------------------------------------
        // Success
        // -------------------------------------------------

        if (result.Success &&
            result.Task != null)
        {
            return Ok(new
            {
                message = result.Message,
                task = result.Task
            });
        }

        // -------------------------------------------------
        // Unexpected business response
        // -------------------------------------------------

        return BadRequest(new
        {
            message = result.Message
        });
    }
    catch (Exception)
    {
        return StatusCode(500, new
        {
            message =
                "Unable to update task priority. Please try again."
        });
    }
}        
              // =========================================================
// TASK-006
// SET TASK DEADLINE
// TEAM LEADER
// =========================================================

// PUT: api/tasks/team-leader/{taskId}/deadline
[HttpPut("team-leader/{taskId:guid}/deadline")]
[Authorize(Roles = "TeamLeader")]
public async Task<IActionResult> SetTaskDeadline(
    Guid taskId,
    [FromBody] SetTaskDeadlineDto dto)
{
    // -----------------------------------------------------
    // 1. Get logged-in Team Leader
    // -----------------------------------------------------

    var userIdClaim =
        User.FindFirst(ClaimTypes.NameIdentifier);

    if (userIdClaim == null ||
        !Guid.TryParse(
            userIdClaim.Value,
            out var teamLeaderId))
    {
        return Unauthorized(new
        {
            message = "Invalid user."
        });
    }

    // -----------------------------------------------------
    // 2. Validate request
    // -----------------------------------------------------

    if (dto == null)
    {
        return BadRequest(new
        {
            message = "Invalid deadline date."
        });
    }

    try
    {
        // -------------------------------------------------
        // 3. Set task deadline
        // -------------------------------------------------

        var result =
            await _teamLeaderTaskService
                .SetTaskDeadlineAsync(
                    teamLeaderId,
                    taskId,
                    dto);

        // -------------------------------------------------
        // Task not found
        // -------------------------------------------------

        if (result.Message == "Task not found.")
        {
            return NotFound(new
            {
                message = result.Message
            });
        }

        // -------------------------------------------------
        // Invalid deadline
        // -------------------------------------------------

        if (result.Message == "Invalid deadline date.")
        {
            return BadRequest(new
            {
                message = result.Message
            });
        }

        // -------------------------------------------------
        // Sprint schedule conflict
        // -------------------------------------------------

        if (result.Message ==
            "Task deadline conflicts with sprint schedule.")
        {
            return BadRequest(new
            {
                message = result.Message
            });
        }

        // -------------------------------------------------
        // Unauthorized
        // -------------------------------------------------

        if (result.Message ==
            "You are not authorised to update this task deadline.")
        {
            return Forbid();
        }

        // -------------------------------------------------
        // Same deadline
        // -------------------------------------------------

        if (result.Message ==
            "The task already has this deadline.")
        {
            return Ok(new
            {
                message = result.Message,
                task = result.Task
            });
        }

        // -------------------------------------------------
        // Success
        // -------------------------------------------------

        if (result.Success &&
            result.Task != null)
        {
            return Ok(new
            {
                message = result.Message,
                task = result.Task
            });
        }

        // -------------------------------------------------
        // Unexpected business response
        // -------------------------------------------------

        return BadRequest(new
        {
            message = result.Message
        });
    }
    catch (Exception)
    {
        return StatusCode(500, new
        {
            message =
                "Unable to update task deadline. Please try again."
        });
    }
}                             
// =========================================================
// TASK-007
// VIEW TASKS
// TEAM LEADER
// =========================================================

// GET: api/tasks/team-leader/sprint/{sprintId}
[HttpGet("team-leader/sprint/{sprintId:guid}")]
[Authorize(Roles = "TeamLeader")]
public async Task<IActionResult> GetTeamLeaderTasks(
    Guid sprintId)
{
    // ---------------------------------------------------------
    // 1. Get logged-in Team Leader
    // ---------------------------------------------------------

    var userIdClaim =
        User.FindFirst(ClaimTypes.NameIdentifier);

    if (userIdClaim == null ||
        !Guid.TryParse(
            userIdClaim.Value,
            out var teamLeaderId))
    {
        return Unauthorized(new
        {
            message = "Invalid user."
        });
    }

    try
    {
        // -----------------------------------------------------
        // 2. Get Team Leader tasks
        // -----------------------------------------------------

        var result =
            await _teamLeaderTaskService
                .GetTeamLeaderTasksAsync(
                    teamLeaderId,
                    sprintId);

        // -----------------------------------------------------
        // 3. Access denied
        // -----------------------------------------------------

        if (result.Message == "Access denied.")
        {
            return Forbid();
        }

        // -----------------------------------------------------
        // 4. No tasks
        // -----------------------------------------------------

        if (result.Message == "No tasks found.")
        {
            return Ok(new
            {
                message = result.Message,
                tasks = result.Tasks
            });
        }

        // -----------------------------------------------------
        // 5. Success
        // -----------------------------------------------------

        if (result.Success)
        {
            return Ok(new
            {
                message = result.Message,
                tasks = result.Tasks
            });
        }

        return BadRequest(new
        {
            message = result.Message
        });
    }
    catch (Exception)
    {
        return StatusCode(500, new
        {
            message =
                "Unable to load tasks. Please try again."
        });
    }
}

// =========================================================
// TASK-008
// UPDATE TASK STATUS
// TEAM LEADER
// =========================================================

// PUT: api/tasks/team-leader/{taskId}/status
[HttpPut("team-leader/{taskId:guid}/status")]
[Authorize(Roles = "TeamLeader")]
public async Task<IActionResult> UpdateTaskStatus(
    Guid taskId,
    [FromBody] UpdateTaskStatusDto dto)
{
    // ---------------------------------------------------------
    // 1. Get logged-in Team Leader
    // ---------------------------------------------------------

    var userIdClaim =
        User.FindFirst(ClaimTypes.NameIdentifier);

    if (userIdClaim == null ||
        !Guid.TryParse(
            userIdClaim.Value,
            out var teamLeaderId))
    {
        return Unauthorized(new
        {
            message = "Invalid user."
        });
    }

    // ---------------------------------------------------------
    // 2. Validate request
    // ---------------------------------------------------------

    if (dto == null)
    {
        return BadRequest(new
        {
            message =
                "This status change is not allowed."
        });
    }

    try
    {
        // -----------------------------------------------------
        // 3. Update task status
        // -----------------------------------------------------

        var result =
            await _teamLeaderTaskService
                .UpdateTaskStatusAsync(
                    teamLeaderId,
                    taskId,
                    dto);

        // -----------------------------------------------------
        // 4. Task not found
        // -----------------------------------------------------

        if (result.Message == "Task not found.")
        {
            return NotFound(new
            {
                message = result.Message
            });
        }

        // -----------------------------------------------------
        // 5. Invalid transition
        // -----------------------------------------------------

        if (result.Message ==
            "This status change is not allowed.")
        {
            return BadRequest(new
            {
                message = result.Message
            });
        }

        // -----------------------------------------------------
        // 6. Unauthorized
        // -----------------------------------------------------

        if (result.Message ==
            "You are not authorised to update this task status.")
        {
            return Forbid();
        }

        // -----------------------------------------------------
        // 7. Same status
        // -----------------------------------------------------

        if (result.Message ==
            "The task already has this status.")
        {
            return Ok(new
            {
                message = result.Message,
                task = result.Task
            });
        }

        // -----------------------------------------------------
        // 8. Success
        // -----------------------------------------------------

        if (result.Success &&
            result.Task != null)
        {
            return Ok(new
            {
                message = result.Message,
                task = result.Task
            });
        }

        // -----------------------------------------------------
        // 9. Unexpected business response
        // -----------------------------------------------------

        return BadRequest(new
        {
            message = result.Message
        });
    }
    catch (Exception)
    {
        return StatusCode(500, new
        {
            message =
                "Unable to update task status. Please try again."
        });
    }
}

        // =========================================================
        // TASK-004
        // ASSIGN TASK TO CONTRIBUTOR
        // TEAM LEADER
        // =========================================================

        // PUT:
        // api/tasks/team-leader/{taskId}/assign/{contributorId}
        [HttpPut(
            "team-leader/{taskId:guid}/assign/{contributorId:guid}")]
        [Authorize(Roles = "TeamLeader")]
        public async Task<IActionResult> TeamLeaderAssignTask(
            Guid taskId,
            Guid contributorId)
        {
            var userIdClaim =
                User.FindFirst(
                    ClaimTypes.NameIdentifier);

            if (userIdClaim == null ||
                !Guid.TryParse(
                    userIdClaim.Value,
                    out var teamLeaderId))
            {
                return Unauthorized(new
                {
                    message = "Invalid user."
                });
            }

            try
            {
                var result =
                    await _teamLeaderTaskService
                        .AssignTaskAsync(
                            teamLeaderId,
                            taskId,
                            contributorId);

                if (result.Message == "Task not found.")
                {
                    return NotFound(new
                    {
                        message = result.Message
                    });
                }

                if (result.Message ==
                    "Team member not found.")
                {
                    return NotFound(new
                    {
                        message = result.Message
                    });
                }

                if (result.Message ==
                    "The selected team member is inactive.")
                {
                    return BadRequest(new
                    {
                        message = result.Message
                    });
                }

                if (result.Message ==
                    "The selected user must be a contributor.")
                {
                    return BadRequest(new
                    {
                        message = result.Message
                    });
                }

                if (result.Message ==
                    "Contributor is not assigned to your team.")
                {
                    return BadRequest(new
                    {
                        message = result.Message
                    });
                }

                if (result.Message ==
                    "You are not authorised to assign this task.")
                {
                    return Forbid();
                }

                if (result.Message ==
                    "This task is already assigned to this contributor.")
                {
                    return Conflict(new
                    {
                        message = result.Message,
                        task = result.Task
                    });
                }

                if (result.Success &&
                    result.Task != null)
                {
                    return Ok(new
                    {
                        message = result.Message,
                        task = result.Task
                    });
                }

                return BadRequest(new
                {
                    message = result.Message
                });
            }
            catch (Exception)
            {
                return StatusCode(500, new
                {
                    message =
                        "Unable to assign task. Please try again."
                });
            }
        }
    }
}