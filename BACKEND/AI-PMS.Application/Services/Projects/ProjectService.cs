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

        public async Task<ProjectUpdateResultDto> ChangeStatusAsync(
            Guid projectId,
            Guid statusId)
        {
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

            var targetStatus =
                await _projectRepository.GetStatusByIdAsync(statusId);

            if (targetStatus == null || !targetStatus.IsActive)
            {
                return new ProjectUpdateResultDto
                {
                    Success = false,
                    Message = "Invalid project status.",
                    Project = MapToDto(project)
                };
            }

            if (project.StatusId == statusId)
            {
                return new ProjectUpdateResultDto
                {
                    Success = false,
                    Message =
                        "The project is already using this status.",
                    Project = MapToDto(project)
                };
            }

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

            project.StatusId = statusId;
            project.UpdatedAt = DateTime.UtcNow;

            if (targetStatus.IsCompletedStatus)
            {
                project.CompletedAt = DateTime.UtcNow;
                project.ProgressPercentage = 100;
            }
            else
            {
                project.CompletedAt = null;
            }

            if (targetStatus.IsArchivedStatus)
            {
                project.ArchivedAt = DateTime.UtcNow;
            }
            else
            {
                project.ArchivedAt = null;
            }

            await _projectRepository.UpdateAsync(project);

            return new ProjectUpdateResultDto
            {
                Success = true,
                Message = "Project status updated successfully.",
                Project = MapToDto(project)
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

                ManagerId = project.ManagerId,

                TeamId = project.TeamId,

                StartDate = project.StartDate,

                Deadline = project.Deadline,

                ProgressPercentage =
                    project.ProgressPercentage,

                CreatedAt = project.CreatedAt,

                UpdatedAt = project.UpdatedAt,

                CompletedAt = project.CompletedAt,

                ArchivedAt = project.ArchivedAt,

                IsArchived =
                    project.Status?.IsArchivedStatus ?? false,

                IsCompleted =
                    project.Status?.IsCompletedStatus ?? false
            };
        }
    }
} 