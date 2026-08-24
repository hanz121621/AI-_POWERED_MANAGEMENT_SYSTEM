using AI_PMS.Application.DTOs.Sprints;
using AI_PMS.Application.Interfaces.Sprints;
using AI_PMS.Application.Interfaces.Projects;
using AI_PMS.Domain.Entities.Sprints;

namespace AI_PMS.Application.Services.Sprints
{
    public class SprintService : ISprintService
    {
        private readonly ISprintRepository _sprintRepository;
        private readonly IProjectRepository _projectRepository;

        public SprintService(
            ISprintRepository sprintRepository,
            IProjectRepository projectRepository)
        {
            _sprintRepository = sprintRepository;
            _projectRepository = projectRepository;
        }

        // =========================================================
        // CREATE SPRINT
        // =========================================================
        public async Task<(bool Success, string Message)>
            CreateSprintAsync(
                Guid managerId,
                CreateSprintDto dto)
        {
            // Validate Project
            var project =
                await _projectRepository.GetByIdAsync(
                    dto.ProjectId);

            if (project == null)
            {
                return (
                    false,
                    "Project not found."
                );
            }

            // Validate Name
            if (string.IsNullOrWhiteSpace(dto.Name))
            {
                return (
                    false,
                    "Sprint name is required."
                );
            }

            // Validate Dates
            if (dto.EndDate < dto.StartDate)
            {
                return (
                    false,
                    "End date cannot be earlier than start date."
                );
            }

            // Check duplicate name
            var existingSprint =
                await _sprintRepository.GetByNameAsync(
                    dto.ProjectId,
                    dto.Name);

            if (existingSprint != null)
            {
                return (
                    false,
                    "A sprint with this name already exists in this project."
                );
            }

            // Create Sprint
            var sprint = new Sprint
            {
                ProjectId = dto.ProjectId,

                // Logged-in Manager ID from JWT
                CreatedBy = managerId,

                Name = dto.Name.Trim(),

                Goal = dto.Goal?.Trim()
                    ?? string.Empty,

                StartDate = dto.StartDate,

                EndDate = dto.EndDate,

                Priority = dto.Priority,

                IsDeleted = false
            };

            await _sprintRepository.AddAsync(sprint);

            return (
                true,
                "Sprint created successfully."
            );
        }

        // =========================================================
        // GET ALL SPRINTS
        // =========================================================
        public async Task<IEnumerable<SprintDto>>
            GetAllSprintsAsync()
        {
            var sprints =
                await _sprintRepository.GetAllAsync();

            return sprints.Select(MapToDto);
        }

        // =========================================================
        // GET SPRINT BY ID
        // =========================================================
        public async Task<SprintDto?>
            GetSprintByIdAsync(Guid id)
        {
            var sprint =
                await _sprintRepository.GetByIdAsync(id);

            if (sprint == null)
                return null;

            return MapToDto(sprint);
        }

        // =========================================================
        // GET SPRINTS BY PROJECT
        // =========================================================
        public async Task<IEnumerable<SprintDto>>
            GetProjectSprintsAsync(
                Guid projectId)
        {
            var sprints =
                await _sprintRepository
                    .GetProjectSprintsAsync(projectId);

            return sprints.Select(MapToDto);
        }

        // =========================================================
        // UPDATE SPRINT
        // =========================================================
        public async Task<(bool Success, string Message)>
            UpdateSprintAsync(
                Guid id,
                UpdateSprintDto dto)
        {
            // Find Sprint
            var sprint =
                await _sprintRepository.GetByIdAsync(id);

            if (sprint == null)
            {
                return (
                    false,
                    "Sprint not found."
                );
            }

            // Validate Name
            if (string.IsNullOrWhiteSpace(dto.Name))
            {
                return (
                    false,
                    "Sprint name is required."
                );
            }

            // Validate Dates
            if (dto.EndDate < dto.StartDate)
            {
                return (
                    false,
                    "End date cannot be earlier than start date."
                );
            }

            var newName =
                dto.Name.Trim();

            var newGoal =
                dto.Goal?.Trim()
                ?? string.Empty;

            // Check duplicate name
            var existingSprint =
                await _sprintRepository.GetByNameAsync(
                    sprint.ProjectId,
                    newName);

            if (existingSprint != null &&
                existingSprint.Id != id)
            {
                return (
                    false,
                    "A sprint with this name already exists in this project."
                );
            }

            // =====================================================
            // CHECK CHANGES
            // =====================================================

            bool nameChanged =
                !string.Equals(
                    sprint.Name.Trim(),
                    newName,
                    StringComparison.OrdinalIgnoreCase);

            bool goalChanged =
                !string.Equals(
                    sprint.Goal?.Trim()
                        ?? string.Empty,
                    newGoal,
                    StringComparison.Ordinal);

            bool startDateChanged =
                sprint.StartDate != dto.StartDate;

            bool endDateChanged =
                sprint.EndDate != dto.EndDate;

            bool priorityChanged =
                sprint.Priority != dto.Priority;

            bool anythingChanged =
                nameChanged ||
                goalChanged ||
                startDateChanged ||
                endDateChanged ||
                priorityChanged;

            // =====================================================
            // NO CHANGES
            // =====================================================

            if (!anythingChanged)
            {
                return (
                    false,
                    "No changes detected. The sprint already contains these values."
                );
            }

            // =====================================================
            // UPDATE
            // =====================================================

            sprint.Name = newName;
            sprint.Goal = newGoal;
            sprint.StartDate = dto.StartDate;
            sprint.EndDate = dto.EndDate;
            sprint.Priority = dto.Priority;
            sprint.UpdatedAt = DateTime.UtcNow;

            await _sprintRepository.UpdateAsync(sprint);

            return (
                true,
                "Sprint updated successfully."
            );
        }

        // =========================================================
        // SOFT DELETE SPRINT
        // =========================================================
        public async Task<bool>
            DeleteSprintAsync(Guid id)
        {
            var sprint =
                await _sprintRepository.GetByIdAsync(id);

            if (sprint == null)
                return false;

            // NEVER physically delete.
            sprint.IsDeleted = true;
            sprint.UpdatedAt = DateTime.UtcNow;

            await _sprintRepository.UpdateAsync(sprint);

            return true;
        }

        // =========================================================
        // ENTITY -> DTO
        // =========================================================
        private static SprintDto MapToDto(
            Sprint sprint)
        {
            return new SprintDto
            {
                Id = sprint.Id,

                ProjectId = sprint.ProjectId,

                CreatedBy = sprint.CreatedBy,

                Name = sprint.Name,

                Goal = sprint.Goal,

                StartDate = sprint.StartDate,

                EndDate = sprint.EndDate,

                Status = sprint.Status,

                Priority = sprint.Priority,

                CreatedAt = sprint.CreatedAt,

                UpdatedAt = sprint.UpdatedAt
            };
        }
    }
}