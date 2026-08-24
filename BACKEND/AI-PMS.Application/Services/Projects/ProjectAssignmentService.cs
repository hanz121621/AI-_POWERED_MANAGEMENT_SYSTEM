using AI_PMS.Application.DTOs.Projects;
using AI_PMS.Application.Interfaces.Projects;
using AI_PMS.Application.Interfaces.Repositories.Users;
using AI_PMS.Application.Interfaces.Security;




namespace AI_PMS.Application.Services.Projects
{
    public class ProjectAssignmentService
        : IProjectAssignmentService
    {
        private readonly IProjectRepository _projectRepository;
        private readonly IUserRepository _userRepository;

        public ProjectAssignmentService(
            IProjectRepository projectRepository,
            IUserRepository userRepository)
        {
            _projectRepository = projectRepository;
            _userRepository = userRepository;
        }

        // =========================================================
        // ASSIGN MANAGER
        // =========================================================

        public async Task<bool> AssignProjectAsync(
            AssignProjectDto dto)
        {
            var project =
                await _projectRepository.GetByIdAsync(
                    dto.ProjectId);

            if (project == null)
                return false;

            // A project can only receive one manager
            // through the initial assignment operation.
            if (project.ManagerId.HasValue)
                return false;

            var manager =
                await _userRepository.GetByIdAsync(
                    dto.ManagerId);

            if (manager == null)
                return false;

            // IMPORTANT:
            // The manager's role/permission must come from
            // stored user/role data.
            if (manager.Role != Domain.Enums.Role.Manager)
                return false;

            if (!manager.IsActive)
                return false;

            project.ManagerId = dto.ManagerId;
            project.UpdatedAt = DateTime.UtcNow;

            await _projectRepository.UpdateAsync(project);

            return true;
        }


        // =========================================================
        // CHANGE MANAGER
        // =========================================================

        public async Task<bool> ChangeManagerAsync(
            AssignProjectDto dto)
        {
            var project =
                await _projectRepository.GetByIdAsync(
                    dto.ProjectId);

            if (project == null)
                return false;

            var manager =
                await _userRepository.GetByIdAsync(
                    dto.ManagerId);

            if (manager == null)
                return false;

            if (manager.Role != Domain.Enums.Role.Manager)
                return false;

            if (!manager.IsActive)
                return false;

            project.ManagerId = dto.ManagerId;
            project.UpdatedAt = DateTime.UtcNow;

            await _projectRepository.UpdateAsync(project);

            return true;
        }


        // =========================================================
        // GET ASSIGNED MANAGER
        // =========================================================

        public async Task<Guid?> GetAssignedManagerAsync(
            Guid projectId)
        {
            var project =
                await _projectRepository.GetByIdAsync(
                    projectId);

            if (project == null)
                return null;

            return project.ManagerId;
        }


        // =========================================================
        // GET MANAGER PROJECTS
        // =========================================================

        public async Task<IEnumerable<Guid>>
            GetManagerProjectsAsync(Guid managerId)
        {
            var projects =
                await _projectRepository
                    .GetByManagerAsync(managerId);

            return projects
                .Select(project => project.Id)
                .ToList();
        }
    }
}