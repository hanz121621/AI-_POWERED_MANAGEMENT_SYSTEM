using AI_PMS.Application.DTOs.Projects;
using AI_PMS.Application.Interfaces.Projects;
using AI_PMS.Domain.Entities.Projects;


namespace AI_PMS.Application.Services.Projects
{
    public class ProjectService : IProjectService
    {
        private readonly IProjectRepository _projectRepository;
        

        public ProjectService(IProjectRepository projectRepository)
        {
            _projectRepository = projectRepository;
        }

        // =========================================================
        // CREATE
        // =========================================================

        public async Task<ProjectDto?> CreateAsync(
            CreateProjectDto dto,
            Guid createdBy)
        {
            if (dto == null)
                throw new ArgumentNullException(nameof(dto));

            if (string.IsNullOrWhiteSpace(dto.Name))
                return null;

            if (dto.StartDate > dto.Deadline)
                return null;

            var nameExists =
                await _projectRepository.NameExistsAsync(dto.Name);

            if (nameExists)
                return null;

            ProjectStatusDefinition? status;

            // Use selected status when provided.
            if (dto.StatusId.HasValue)
            {
                status =
                    await _projectRepository.GetStatusByIdAsync(
                        dto.StatusId.Value);

                if (status == null || !status.IsActive)
                    return null;
            }
            else
            {
                // Otherwise use configured initial status.
                status =
                    await _projectRepository.GetInitialStatusAsync();

                if (status == null)
                    return null;
            }

            var project = new Project
            {
                Id = Guid.NewGuid(),

                Name = dto.Name.Trim(),

                Description =
                    string.IsNullOrWhiteSpace(dto.Description)
                        ? null
                        : dto.Description.Trim(),

                StatusId = status.Id,

                ManagerId = dto.ManagerId,

                TeamId = dto.TeamId,

                StartDate = dto.StartDate,

                Deadline = dto.Deadline,

                ProgressPercentage = 0,

                CreatedAt = DateTime.UtcNow,

                UpdatedAt = null,

                CompletedAt = null,

                ArchivedAt = null
            };

            await _projectRepository.AddAsync(project);

            return await GetByIdAsync(project.Id);
        }
// =========================================================
// PM-004
// VIEW ASSIGNED PROJECTS
// =========================================================

public async Task<IEnumerable<ProjectDto>> GetAssignedProjectsAsync(
    Guid managerId)
{
    if (managerId == Guid.Empty)
        throw new UnauthorizedAccessException(
            "Invalid manager identity.");

    var projects =
        await _projectRepository.GetByManagerAsync(managerId);

    var result = new List<ProjectDto>();

    foreach (var project in projects)
    {
        result.Add(new ProjectDto
        {
            Id = project.Id,

            Name = project.Name,

            Description = project.Description,

            StatusId = project.StatusId,

            StatusName =
                project.Status?.Name ?? string.Empty,

            IsStatusActive =
                project.Status?.IsActive ?? false,

            IsCompletedStatus =
                project.Status?.IsCompletedStatus ?? false,

            IsArchivedStatus =
                project.Status?.IsArchivedStatus ?? false,

            IsCancelledStatus =
                project.Status?.IsCancelledStatus ?? false,

            ManagerId = project.ManagerId,

            TeamId = project.TeamId,

            PriorityId =
                (int)project.Priority,

            PriorityName =
                project.Priority.ToString(),

            StartDate = project.StartDate,

            Deadline = project.Deadline,

            ProgressPercentage =
                project.ProgressPercentage,

            CreatedAt = project.CreatedAt,

            UpdatedAt = project.UpdatedAt,

            CompletedAt = project.CompletedAt,

            ArchivedAt = project.ArchivedAt,

            IsCompleted =
                project.Status?.IsCompletedStatus ?? false,

            IsArchived =
                project.Status?.IsArchivedStatus ?? false
        });
    }

    return result;
}
// =========================================================
// GET ALLOWED NEXT STATUSES
// =========================================================
public async Task<IEnumerable<ProjectStatusDto>> GetAllowedNextStatusesAsync(
    Guid projectId)
{
    var project = await _projectRepository.GetByIdAsync(projectId);

    if (project == null)
        return Enumerable.Empty<ProjectStatusDto>();

    var statuses =
        await _projectRepository.GetAllowedNextStatusesAsync(project.StatusId);

    return statuses.Select(status => new ProjectStatusDto
    {
        Id = status.Id,
        Name = status.Name,
        Description = status.Description,
        IsActive = status.IsActive,
        DisplayOrder = status.DisplayOrder,
        IsInitialStatus = status.IsInitialStatus,
        IsCompletedStatus = status.IsCompletedStatus,
        IsArchivedStatus = status.IsArchivedStatus,
        IsCancelledStatus = status.IsCancelledStatus
    });
}

// =========================================================
// PM-005
// UPDATE PROJECT TIMELINE
// =========================================================

public async Task<ProjectDto?> UpdateTimelineAsync(
    Guid projectId,
    UpdateProjectTimelineDto dto,
    Guid managerId)
{
    // ---------------------------------------------------------
    // Validate authenticated manager
    // ---------------------------------------------------------

    if (managerId == Guid.Empty)
    {
        throw new UnauthorizedAccessException(
            "Invalid manager identity.");
    }

    // ---------------------------------------------------------
    // Validate project ID
    // ---------------------------------------------------------

    if (projectId == Guid.Empty)
    {
        throw new KeyNotFoundException(
            "Invalid project ID.");
    }

    // ---------------------------------------------------------
    // Validate dates
    // ---------------------------------------------------------

    if (dto.StartDate >= dto.Deadline)
    {
        throw new InvalidOperationException(
            "Project start date must be earlier than the deadline.");
    }

    // ---------------------------------------------------------
    // Get project dynamically from database
    // ---------------------------------------------------------

    var project =
        await _projectRepository.GetByIdAsync(projectId);

    if (project == null)
    {
        throw new KeyNotFoundException(
            "Project not found.");
    }

    // ---------------------------------------------------------
    // SECURITY
    // Manager must be assigned to this project
    // ---------------------------------------------------------

    if (!project.ManagerId.HasValue ||
        project.ManagerId.Value != managerId)
    {
        throw new UnauthorizedAccessException(
            "You are not authorized to update this project's timeline.");
    }

    // ---------------------------------------------------------
    // Check Sprint conflicts
    // ---------------------------------------------------------

    var hasConflict =
        await _projectRepository.HasTimelineConflictAsync(
            projectId,
            dto.StartDate,
            dto.Deadline);

    if (hasConflict)
    {
        throw new InvalidOperationException(
            "The proposed project timeline conflicts with an existing Sprint.");
    }

    // ---------------------------------------------------------
    // Update ONLY project timeline
    //
    // Do NOT automatically modify Sprint or Task dates.
    // ---------------------------------------------------------

    project.StartDate = dto.StartDate;
    project.Deadline = dto.Deadline;
    project.UpdatedAt = DateTime.UtcNow;

    // ---------------------------------------------------------
    // Save database changes
    // ---------------------------------------------------------

    await _projectRepository.UpdateTimelineAsync(project);

    // ---------------------------------------------------------
    // Return updated project
    // ---------------------------------------------------------

    var updatedProject =
        await _projectRepository.GetByIdAsync(projectId);

    if (updatedProject == null)
    {
        throw new KeyNotFoundException(
            "Project could not be retrieved after updating the timeline.");
    }

    return MapToDto(updatedProject);

    
}
 // =========================================================
// PM-006
// SET / UPDATE PROJECT DEADLINE
// =========================================================

// =========================================================
// PM-006
// SET / UPDATE PROJECT DEADLINE
// =========================================================

public async Task<ProjectUpdateResultDto> UpdateDeadlineAsync(
    Guid projectId,
    UpdateProjectDeadlineDto dto,
    Guid managerId)
{
    // =====================================================
    // 1. VALIDATE INPUT
    // =====================================================

    if (projectId == Guid.Empty)
    {
        return new ProjectUpdateResultDto
        {
            Success = false,
            Message = "Invalid project ID."
        };
    }

    if (managerId == Guid.Empty)
    {
        throw new UnauthorizedAccessException(
            "Invalid manager identity.");
    }

    if (dto == null)
    {
        return new ProjectUpdateResultDto
        {
            Success = false,
            Message = "Deadline information is required."
        };
    }

    // =====================================================
    // 2. GET PROJECT
    // =====================================================

    var project =
        await _projectRepository.GetByIdAsync(projectId);

    if (project == null)
    {
        return new ProjectUpdateResultDto
        {
            Success = false,
            Message = "Project not found."
        };
    }

    // =====================================================
    // 3. CHECK MANAGER ASSIGNMENT
    // =====================================================

    if (!project.ManagerId.HasValue ||
        project.ManagerId.Value != managerId)
    {
        throw new UnauthorizedAccessException(
            "You are not authorized to update this project's deadline.");
    }

    // =====================================================
    // 4. VALIDATE DEADLINE
    // =====================================================

    if (dto.Deadline < project.StartDate)
    {
        return new ProjectUpdateResultDto
        {
            Success = false,
            Message =
                "Project deadline cannot be earlier than the project start date.",
            Project = MapToDto(project)
        };
    }

    // =====================================================
    // 5. CHECK SPRINT CONFLICT
    // =====================================================

    var hasConflict =
        await _projectRepository.HasDeadlineConflictAsync(
            projectId,
            dto.Deadline);

    if (hasConflict)
    {
        return new ProjectUpdateResultDto
        {
            Success = false,
            Message =
                "The proposed deadline conflicts with one or more existing Sprints.",
            Project = MapToDto(project)
        };
    }

    // =====================================================
    // 6. VALIDATE MILESTONES
    // =====================================================

    if (dto.Milestones != null)
    {
        foreach (var milestone in dto.Milestones)
        {
            if (milestone.Date > dto.Deadline)
            {
                return new ProjectUpdateResultDto
                {
                    Success = false,
                    Message =
                        $"Milestone '{milestone.Name}' cannot be later than the project deadline.",
                    Project = MapToDto(project)
                };
            }

            if (milestone.Date < project.StartDate)
            {
                return new ProjectUpdateResultDto
                {
                    Success = false,
                    Message =
                        $"Milestone '{milestone.Name}' cannot be earlier than the project start date.",
                    Project = MapToDto(project)
                };
            }
        }
    }

    // =====================================================
    // 7. REASON REQUIRED WHEN DEADLINE CHANGES
    // =====================================================

    if (project.Deadline != dto.Deadline &&
        string.IsNullOrWhiteSpace(dto.Reason))
    {
        return new ProjectUpdateResultDto
        {
            Success = false,
            Message =
                "A reason is required when changing the project deadline.",
            Project = MapToDto(project)
        };
    }

    // =====================================================
    // 8. CHECK IF THERE IS ACTUALLY A CHANGE
    // =====================================================

    if (project.Deadline == dto.Deadline)
    {
        return new ProjectUpdateResultDto
        {
            Success = false,
            Message =
                "No deadline change detected.",
            Project = MapToDto(project)
        };
    }

    // =====================================================
    // 9. UPDATE OFFICIAL DEADLINE
    // =====================================================

    project.Deadline = dto.Deadline;
    project.UpdatedAt = DateTime.UtcNow;

    // IMPORTANT:
    // This only changes the official project deadline.
    // AI predicted completion date remains separate.

    // =====================================================
    // 10. SAVE
    // =====================================================

    await _projectRepository.UpdateDeadlineAsync(project);

    // =====================================================
    // 11. GET UPDATED PROJECT
    // =====================================================

    var updatedProject =
        await _projectRepository.GetByIdAsync(projectId);

    if (updatedProject == null)
    {
        return new ProjectUpdateResultDto
        {
            Success = false,
            Message =
                "Project could not be retrieved after updating the deadline."
        };
    }

    // =====================================================
    // 12. RETURN
    // =====================================================

    return new ProjectUpdateResultDto
    {
        Success = true,
        Message = "Project deadline updated successfully.",
        Project = MapToDto(updatedProject)
    };
}// =========================================================
// ARCHIVE PROJECT
// =========================================================
public async Task<ProjectUpdateResultDto> ArchiveAsync(Guid id)
{
    var project = await _projectRepository.GetByIdAsync(id);

    if (project == null)
    {
        return new ProjectUpdateResultDto
        {
            Success = false,
            Message = "Project not found.",
            Project = null
        };
    }

    if (project.Status == null)
    {
        return new ProjectUpdateResultDto
        {
            Success = false,
            Message = "Project status not found.",
            Project = null
        };
    }

    if (project.Status.IsArchivedStatus)
    {
        return new ProjectUpdateResultDto
        {
            Success = false,
            Message = "Project is already archived.",
            Project = MapToDto(project)
        };
    }

    var archivedStatus = await _projectRepository.GetArchivedStatusAsync();

    if (archivedStatus == null)
    {
        return new ProjectUpdateResultDto
        {
            Success = false,
            Message = "No active archived status is configured.",
            Project = MapToDto(project)
        };
    }

    project.StatusId = archivedStatus.Id;
    project.Status = archivedStatus;
    project.ArchivedAt = DateTime.UtcNow;
    project.UpdatedAt = DateTime.UtcNow;

    await _projectRepository.UpdateAsync(project);

    return new ProjectUpdateResultDto
    {
        Success = true,
        Message = "Project archived successfully.",
        Project = MapToDto(project)
    };
}// =========================================================
// RESTORE PROJECT
// =========================================================
public async Task<ProjectUpdateResultDto> RestoreAsync(Guid id)
{
    var project = await _projectRepository.GetByIdAsync(id);

    if (project == null)
    {
        return new ProjectUpdateResultDto
        {
            Success = false,
            Message = "Project not found.",
            Project = null
        };
    }

    if (project.Status == null)
    {
        return new ProjectUpdateResultDto
        {
            Success = false,
            Message = "Project status not found.",
            Project = null
        };
    }

    if (!project.Status.IsArchivedStatus)
    {
        return new ProjectUpdateResultDto
        {
            Success = false,
            Message = "Project is not archived.",
            Project = MapToDto(project)
        };
    }

    var initialStatus = await _projectRepository.GetInitialStatusAsync();

    if (initialStatus == null)
    {
        return new ProjectUpdateResultDto
        {
            Success = false,
            Message = "No active initial status is configured.",
            Project = MapToDto(project)
        };
    }

    project.StatusId = initialStatus.Id;
    project.Status = initialStatus;
    project.ArchivedAt = null;
    project.UpdatedAt = DateTime.UtcNow;

    await _projectRepository.UpdateAsync(project);

    return new ProjectUpdateResultDto
    {
        Success = true,
        Message = "Project restored successfully.",
        Project = MapToDto(project)
    };
}
        // =========================================================
        // GET ALL
        // =========================================================

        public async Task<IEnumerable<ProjectDto>> GetAllAsync()
        {
            var projects =
                await _projectRepository.GetAllAsync();

            return projects
                .Select(MapToDto)
                .ToList();
        }


        // =========================================================
        // GET BY ID
        // =========================================================

        public async Task<ProjectDto?> GetByIdAsync(Guid id)
        {
            var project =
                await _projectRepository.GetByIdAsync(id);

            if (project == null)
                return null;

            return MapToDto(project);
        }


        // =========================================================
        // GET ACTIVE
        // =========================================================

        public async Task<IEnumerable<ProjectDto>> GetActiveAsync()
        {
            var projects =
                await _projectRepository.GetActiveAsync();

            return projects
                .Select(MapToDto)
                .ToList();
        }


        // =========================================================
        // GET ARCHIVED
        // =========================================================

        public async Task<IEnumerable<ProjectDto>> GetArchivedAsync()
        {
            var projects =
                await _projectRepository.GetArchivedAsync();

            return projects
                .Select(MapToDto)
                .ToList();
        }


        // =========================================================
        // UPDATE
        // =========================================================

        public async Task<ProjectUpdateResultDto> UpdateAsync(
            Guid id,
            UpdateProjectDto dto)
        {
            if (dto == null)
            {
                return new ProjectUpdateResultDto
                {
                    Success = false,
                    Message = "Invalid project information."
                };
            }

            var project =
                await _projectRepository.GetByIdAsync(id);

            if (project == null)
            {
                return new ProjectUpdateResultDto
                {
                    Success = false,
                    Message = "Project not found."
                };
            }

            if (dto.StartDate > dto.Deadline)
            {
                return new ProjectUpdateResultDto
                {
                    Success = false,
                    Message = "Invalid project dates.",
                    Project = MapToDto(project)
                };
            }

            var nameExists =
                await _projectRepository.NameExistsAsync(
                    dto.Name,
                    id);

            if (nameExists)
            {
                return new ProjectUpdateResultDto
                {
                    Success = false,
                    Message = "Project name already exists.",
                    Project = MapToDto(project)
                };
            }

            var newStatus =
                await _projectRepository.GetStatusByIdAsync(
                    dto.StatusId);

            if (newStatus == null || !newStatus.IsActive)
            {
                return new ProjectUpdateResultDto
                {
                    Success = false,
                    Message = "Invalid project status.",
                    Project = MapToDto(project)
                };
            }

            // Validate configured transition when status changes.
            if (project.StatusId != dto.StatusId)
            {
                var allowed =
                    await _projectRepository
                        .IsStatusTransitionAllowedAsync(
                            project.StatusId,
                            dto.StatusId);

                if (!allowed)
                {
                    return new ProjectUpdateResultDto
                    {
                        Success = false,
                        Message =
                            "This project status change is not allowed.",
                        Project = MapToDto(project)
                    };
                }
            }

            var newName = dto.Name.Trim();

            var newDescription =
                string.IsNullOrWhiteSpace(dto.Description)
                    ? null
                    : dto.Description.Trim();

            bool noChanges =
                string.Equals(
                    project.Name.Trim(),
                    newName,
                    StringComparison.OrdinalIgnoreCase)
                &&
                string.Equals(
                    project.Description ?? string.Empty,
                    newDescription ?? string.Empty,
                    StringComparison.Ordinal)
                &&
                project.ManagerId == dto.ManagerId
                &&
                project.TeamId == dto.TeamId
                &&
                project.StartDate == dto.StartDate
                &&
                project.Deadline == dto.Deadline
                &&
                project.StatusId == dto.StatusId;

            if (noChanges)
            {
                return new ProjectUpdateResultDto
                {
                    Success = false,
                    Message =
                        "No changes detected. The project already contains these values.",
                    Project = MapToDto(project)
                };
            }

            project.Name = newName;
            project.Description = newDescription;

            project.ManagerId = dto.ManagerId;
            project.TeamId = dto.TeamId;

            project.StartDate = dto.StartDate;
            project.Deadline = dto.Deadline;

            project.StatusId = dto.StatusId;

            project.UpdatedAt = DateTime.UtcNow;

            if (newStatus.IsCompletedStatus)
            {
                project.CompletedAt ??= DateTime.UtcNow;
                project.ProgressPercentage = 100;
            }
            else
            {
                project.CompletedAt = null;
            }

            if (newStatus.IsArchivedStatus)
            {
                project.ArchivedAt ??= DateTime.UtcNow;
            }
            else
            {
                project.ArchivedAt = null;
            }

            await _projectRepository.UpdateAsync(project);

            return new ProjectUpdateResultDto
            {
                Success = true,
                Message = "Project updated successfully.",
                Project = MapToDto(project)
            };
        }


        // =========================================================
        // DELETE
        // =========================================================

        public async Task<bool> DeleteAsync(Guid id)
        {
            var project =
                await _projectRepository.GetByIdAsync(id);

            if (project == null)
                return false;

            await _projectRepository.DeleteAsync(project);

            return true;
        }


        // =========================================================
        // APPROVE
        // =========================================================

        public async Task<bool> ApproveAsync(Guid id)
        {
            var project =
                await _projectRepository.GetByIdAsync(id);

            if (project == null)
                return false;

            var approvedStatus =
                await _projectRepository.GetApprovedStatusAsync();

            if (approvedStatus == null)
                return false;

            if (project.StatusId == approvedStatus.Id)
                return false;

            var allowed =
                await _projectRepository
                    .IsStatusTransitionAllowedAsync(
                        project.StatusId,
                        approvedStatus.Id);

            if (!allowed)
                return false;

            project.StatusId = approvedStatus.Id;
            project.UpdatedAt = DateTime.UtcNow;

            await _projectRepository.UpdateAsync(project);

            return true;
        }


        // =========================================================
        // REJECT
        // =========================================================

        public async Task<bool> RejectAsync(Guid id)
        {
            var project =
                await _projectRepository.GetByIdAsync(id);

            if (project == null)
                return false;

            var rejectedStatus =
                await _projectRepository.GetRejectedStatusAsync();

            if (rejectedStatus == null)
                return false;

            if (project.StatusId == rejectedStatus.Id)
                return false;

            var allowed =
                await _projectRepository
                    .IsStatusTransitionAllowedAsync(
                        project.StatusId,
                        rejectedStatus.Id);

            if (!allowed)
                return false;

            project.StatusId = rejectedStatus.Id;
            project.UpdatedAt = DateTime.UtcNow;

            await _projectRepository.UpdateAsync(project);

            return true;
        }


        // =========================================================
        // CHANGE STATUS
        // =========================================================
// =========================================================
// PM-007
// MANAGE PROJECT STATUS
// =========================================================

public async Task<ProjectUpdateResultDto> ChangeStatusAsync(
    Guid projectId,
    Guid statusId,
    Guid managerId,
    string? notes = null)
{
    // =====================================================
    // 1. VALIDATE IDENTITIES
    // =====================================================

    if (projectId == Guid.Empty)
    {
        return new ProjectUpdateResultDto
        {
            Success = false,
            Message = "Invalid project ID."
        };
    }

    if (managerId == Guid.Empty)
    {
        throw new UnauthorizedAccessException(
            "Invalid manager identity.");
    }

    if (statusId == Guid.Empty)
    {
        return new ProjectUpdateResultDto
        {
            Success = false,
            Message = "Invalid project status."
        };
    }

    // =====================================================
    // 2. GET PROJECT
    // =====================================================

    var project =
        await _projectRepository.GetByIdAsync(projectId);

    if (project == null)
    {
        return new ProjectUpdateResultDto
        {
            Success = false,
            Message = "Project not found."
        };
    }

    // =====================================================
    // 3. SECURITY
    // MANAGER MUST BE ASSIGNED TO PROJECT
    // =====================================================

    if (!project.ManagerId.HasValue ||
        project.ManagerId.Value != managerId)
    {
        throw new UnauthorizedAccessException(
            "You are not authorized to change the status of this project.");
    }

    // =====================================================
    // 4. GET TARGET STATUS FROM DATABASE
    // =====================================================

    var targetStatus =
        await _projectRepository.GetStatusByIdAsync(statusId);

    if (targetStatus == null)
    {
        return new ProjectUpdateResultDto
        {
            Success = false,
            Message = "Project status not found.",
            Project = MapToDto(project)
        };
    }

    if (!targetStatus.IsActive)
    {
        return new ProjectUpdateResultDto
        {
            Success = false,
            Message = "The selected project status is inactive.",
            Project = MapToDto(project)
        };
    }

    // =====================================================
    // 5. CHECK CURRENT STATUS
    // =====================================================

    if (project.StatusId == statusId)
    {
        return new ProjectUpdateResultDto
        {
            Success = false,
            Message = "The project is already using this status.",
            Project = MapToDto(project)
        };
    }

    // =====================================================
    // 6. VALIDATE CONFIGURED TRANSITION
    // =====================================================

    var allowed =
        await _projectRepository
            .IsStatusTransitionAllowedAsync(
                project.StatusId,
                statusId);

    if (!allowed)
    {
        return new ProjectUpdateResultDto
        {
            Success = false,
            Message =
                "This project status transition is not allowed.",
            Project = MapToDto(project)
        };
    }

    // =====================================================
    // 7. NORMALIZE OPTIONAL NOTES
    // =====================================================

    notes = string.IsNullOrWhiteSpace(notes)
        ? null
        : notes.Trim();

    // =====================================================
    // 8. UPDATE PROJECT STATUS
    // =====================================================

    project.StatusId = statusId;

    // Keep navigation property synchronized
    project.Status = targetStatus;

    project.UpdatedAt = DateTime.UtcNow;

    // =====================================================
    // 9. COMPLETED STATUS
    // =====================================================

    if (targetStatus.IsCompletedStatus)
    {
        project.CompletedAt ??= DateTime.UtcNow;

        project.ProgressPercentage = 100;
    }
    else
    {
        project.CompletedAt = null;
    }

    // =====================================================
    // 10. ARCHIVED STATUS
    // =====================================================

    if (targetStatus.IsArchivedStatus)
    {
        project.ArchivedAt ??= DateTime.UtcNow;
    }
    else
    {
        project.ArchivedAt = null;
    }

    // =====================================================
    // 11. SAVE PROJECT
    // =====================================================

    await _projectRepository.UpdateAsync(project);

    // =====================================================
    // 12. RETRIEVE UPDATED PROJECT
    // =====================================================

    var updatedProject =
        await _projectRepository.GetByIdAsync(projectId);

    if (updatedProject == null)
    {
        return new ProjectUpdateResultDto
        {
            Success = false,
            Message =
                "Project could not be retrieved after status update."
        };
    }

    // =====================================================
    // 13. RETURN RESULT
    // =====================================================

    return new ProjectUpdateResultDto
    {
        Success = true,
        Message = "Project status updated successfully.",
        Project = MapToDto(updatedProject)
    };
}
        // =========================================================
        // ASSIGN MANAGER
        // =========================================================

        public async Task<bool> AssignManagerAsync(
            Guid projectId,
            Guid managerId)
        {
            var project =
                await _projectRepository.GetByIdAsync(projectId);

            if (project == null)
                return false;

            if (project.ManagerId.HasValue)
                return false;

            project.ManagerId = managerId;
            project.UpdatedAt = DateTime.UtcNow;

            await _projectRepository.UpdateAsync(project);

            return true;
        }


        // =========================================================
        // ENTITY → DTO
        // =========================================================

       private static ProjectDto MapToDto(Project project)
{
    return new ProjectDto
    {
        Id = project.Id,

        Name = project.Name,

        Description =
            project.Description ?? string.Empty,

        StatusId = project.StatusId,

        StatusName =
            project.Status?.Name ?? string.Empty,

        IsStatusActive =
            project.Status?.IsActive ?? false,

        IsCompletedStatus =
            project.Status?.IsCompletedStatus ?? false,

        IsArchivedStatus =
            project.Status?.IsArchivedStatus ?? false,

        IsCancelledStatus =
            project.Status?.IsCancelledStatus ?? false,

        ManagerId = project.ManagerId,

        TeamId = project.TeamId,

        PriorityId =
            (int)project.Priority,

        PriorityName =
            project.Priority.ToString(),

        StartDate = project.StartDate,

        Deadline = project.Deadline,

        ProgressPercentage =
            project.ProgressPercentage,

        CreatedAt = project.CreatedAt,

        UpdatedAt = project.UpdatedAt,

        CompletedAt = project.CompletedAt,

        ArchivedAt = project.ArchivedAt,

        IsCompleted =
            project.Status?.IsCompletedStatus ?? false,

        IsArchived =
            project.Status?.IsArchivedStatus ?? false
    };
}
    }
} 