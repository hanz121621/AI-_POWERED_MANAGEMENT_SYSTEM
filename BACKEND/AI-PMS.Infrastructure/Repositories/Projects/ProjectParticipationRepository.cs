using AI_PMS.Application.DTOs.Projects;
using AI_PMS.Application.Interfaces.Repositories.Projects;
using AI_PMS.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AI_PMS.Infrastructure.Repositories.Projects
{
    public class ProjectParticipationRepository
        : IProjectParticipationRepository
    {
        private readonly ApplicationDbContext _context;

        public ProjectParticipationRepository(
            ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================================================
        // GET ASSIGNED PROJECTS
        // DEV-PROJECT-001
        // STAFF-PROJECT-001
        // =========================================================

        public async Task<IEnumerable<ProjectParticipationDto>>
    GetAssignedProjectsAsync(
        Guid userId)
        {
            if (userId == Guid.Empty)
            {
                return new List<ProjectParticipationDto>();
            }

            var memberships =
                await _context.TeamMembers
                    .AsNoTracking()
                    .Include(tm => tm.User)
                    .Include(tm => tm.Team)
                    .Include(tm => tm.ContributorType)
                    .Include(tm => tm.ContributorSubType)
                    .Where(tm =>
                        tm.UserId == userId &&
                        tm.IsActive &&
                        tm.Team != null &&
                        tm.Team.IsActive)
                    .ToListAsync();

            if (!memberships.Any())
            {
                return new List<ProjectParticipationDto>();
            }

            var teamIds =
                memberships
                    .Select(m => m.TeamId)
                    .Distinct()
                    .ToList();

            var projects =
                await _context.Projects
                    .AsNoTracking()
                    .Include(p => p.Status)
                    .Where(p =>
                        p.TeamId.HasValue &&
                        teamIds.Contains(p.TeamId.Value) &&
                        !p.IsDeleted)
                    .OrderBy(p => p.Name)
                    .ToListAsync();

            if (!projects.Any())
            {
                return new List<ProjectParticipationDto>();
            }

            var projectIds =
                projects
                    .Select(p => p.Id)
                    .ToList();

            var managerIds =
                projects
                    .Where(p => p.ManagerId.HasValue)
                    .Select(p => p.ManagerId!.Value)
                    .Distinct()
                    .ToList();

            var managers =
                await _context.Users
                    .AsNoTracking()
                    .Where(u => managerIds.Contains(u.Id))
                    .ToDictionaryAsync(
                        u => u.Id,
                        u => u.FullName);

            var projectTeamIds =
                projects
                    .Where(p => p.TeamId.HasValue)
                    .Select(p => p.TeamId!.Value)
                    .Distinct()
                    .ToList();

            var allTeamMembers =
                await _context.TeamMembers
                    .AsNoTracking()
                    .Include(tm => tm.User)
                    .Include(tm => tm.ContributorType)
                    .Include(tm => tm.ContributorSubType)
                    .Where(tm =>
                        projectTeamIds.Contains(tm.TeamId) &&
                        tm.IsActive)
                    .ToListAsync();

            var teamLeaders =
                allTeamMembers
                    .Where(tm => tm.IsTeamLeader)
                    .GroupBy(tm => tm.TeamId)
                    .ToDictionary(
                        g => g.Key,
                        g => g.First());

            var sprints =
                await _context.Sprints
                    .AsNoTracking()
                    .Where(s =>
                        projectIds.Contains(s.ProjectId) &&
                        !s.IsDeleted)
                    .OrderByDescending(s => s.StartDate)
                    .ToListAsync();

            var taskCounts =
                await _context.Tasks
                    .AsNoTracking()
                    .Where(t =>
                        projectIds.Contains(
                            _context.Sprints
                                .Where(s => s.Id == t.SprintId)
                                .Select(s => s.ProjectId)
                                .FirstOrDefault()))
                    .GroupBy(t =>
                        _context.Sprints
                            .Where(s => s.Id == t.SprintId)
                            .Select(s => s.ProjectId)
                            .FirstOrDefault())
                    .Select(g => new
                    {
                        ProjectId = g.Key,
                        Count = g.Count()
                    })
                    .ToDictionaryAsync(
                        x => x.ProjectId,
                        x => x.Count);

            var sprintCounts =
                sprints
                    .GroupBy(s => s.ProjectId)
                    .ToDictionary(
                        g => g.Key,
                        g => g.Count());

            var result =
                new List<ProjectParticipationDto>();

            foreach (var project in projects)
            {
                if (!project.TeamId.HasValue)
                {
                    continue;
                }

                var membership =
                    memberships.FirstOrDefault(
                        m => m.TeamId == project.TeamId.Value);

                if (membership == null)
                {
                    continue;
                }

                teamLeaders.TryGetValue(
                    project.TeamId.Value,
                    out var leader);

                var currentSprint =
                    sprints
                        .Where(s =>
                            s.ProjectId == project.Id &&
                            s.StartDate <= DateTime.UtcNow &&
                            s.EndDate >= DateTime.UtcNow)
                        .OrderByDescending(s => s.StartDate)
                        .FirstOrDefault();

                result.Add(
                    new ProjectParticipationDto
                    {
                        ProjectId = project.Id,

                        ProjectName =
                            project.Name,

                        Description =
                            project.Description,

                        StatusId =
                            project.StatusId,

                        StatusName =
                            project.Status?.Name
                            ?? string.Empty,

                        ProgressPercentage =
                            project.ProgressPercentage,

                        ParticipantId =
                            userId,

                        ParticipantName =
                            membership.User?.FullName
                            ?? string.Empty,

                        AssignedRole =
                            membership.ContributorType?.Name
                            ?? string.Empty,

                        AssignedRoleSubType =
                            membership.ContributorSubType?.Name,

                        ManagerId =
                            project.ManagerId,

                        ManagerName =
                            project.ManagerId.HasValue &&
                            managers.TryGetValue(
                                project.ManagerId.Value,
                                out var managerName)
                                ? managerName
                                : null,

                        TeamId =
                            project.TeamId,

                        TeamName =
                            membership.Team?.Name,

                        TeamLeaderId =
                            leader?.UserId,

                        TeamLeaderName =
                            leader?.User?.FullName,

                        CurrentSprintId =
                            currentSprint?.Id,

                        CurrentSprintName =
                            currentSprint?.Name,

                        CurrentSprintGoal =
                            currentSprint?.Goal,

                        StartDate =
                            project.StartDate,

                        Deadline =
                            project.Deadline,

                        TaskCount =
                            taskCounts.TryGetValue(
                                project.Id,
                                out var taskCount)
                                ? taskCount
                                : 0,

                        SprintCount =
                            sprintCounts.TryGetValue(
                                project.Id,
                                out var sprintCount)
                                ? sprintCount
                                : 0
                    });
            }

            return result;
        }


        // =========================================================
        // GET PROJECT DETAILS
        // DEV-PROJECT-002
        // STAFF-PROJECT-002
        // =========================================================

        public async Task<ProjectParticipationDetailsDto?>
            GetProjectDetailsAsync(
                Guid projectId,
                Guid userId)
        {
            if (projectId == Guid.Empty ||
                userId == Guid.Empty)
            {
                return null;
            }

            // -----------------------------------------------------
            // PROJECT
            // -----------------------------------------------------

            var project =
                await _context.Projects
                    .AsNoTracking()
                    .Include(p => p.Status)
                    .Include(p => p.Specification)
                    .FirstOrDefaultAsync(p =>
                        p.Id == projectId &&
                        !p.IsDeleted);

            if (project == null)
            {
                return null;
            }

            // -----------------------------------------------------
            // AUTHORIZATION THROUGH TEAM MEMBERSHIP
            // -----------------------------------------------------

            if (!project.TeamId.HasValue)
            {
                return null;
            }

            var membership =
                await _context.TeamMembers
                    .AsNoTracking()
                    .Include(tm => tm.User)
                    .Include(tm => tm.Team)
                    .Include(tm => tm.ContributorType)
                    .Include(tm => tm.ContributorSubType)
                    .FirstOrDefaultAsync(tm =>
                        tm.TeamId == project.TeamId.Value &&
                        tm.UserId == userId &&
                        tm.IsActive);

            if (membership == null)
            {
                return null;
            }

            // -----------------------------------------------------
            // MANAGER
            // -----------------------------------------------------

            string? managerName = null;

            if (project.ManagerId.HasValue)
            {
                managerName =
                    await _context.Users
                        .AsNoTracking()
                        .Where(u =>
                            u.Id == project.ManagerId.Value)
                        .Select(u => u.FullName)
                        .FirstOrDefaultAsync();
            }

            // -----------------------------------------------------
            // TEAM MEMBERS
            // -----------------------------------------------------

            var teamMembers =
                await _context.TeamMembers
                    .AsNoTracking()
                    .Include(tm => tm.User)
                    .Include(tm => tm.ContributorType)
                    .Include(tm => tm.ContributorSubType)
                    .Where(tm =>
                        tm.TeamId == project.TeamId.Value &&
                        tm.IsActive)
                    .OrderBy(tm => tm.JoinedAt)
                    .ToListAsync();

            var teamMemberDtos =
                teamMembers
                    .Select(tm =>
                        new ProjectParticipantMemberDto
                        {
                            UserId =
                                tm.UserId,

                            FullName =
                                tm.User?.FullName
                                ?? string.Empty,

                            AssignedRole =
                                tm.ContributorType?.Name
                                ?? string.Empty,

                            AssignedRoleSubType =
                                tm.ContributorSubType?.Name,

                            IsTeamLeader =
                                tm.IsTeamLeader,

                            IsActive =
                                tm.IsActive
                        })
                    .ToList();

            var teamLeader =
                teamMembers
                    .FirstOrDefault(
                        tm => tm.IsTeamLeader);

            // -----------------------------------------------------
            // SPRINTS
            // -----------------------------------------------------

            var sprints =
                await _context.Sprints
                    .AsNoTracking()
                    .Where(s =>
                        s.ProjectId == projectId &&
                        !s.IsDeleted)
                    .OrderByDescending(s => s.StartDate)
                    .ToListAsync();

            var currentSprint =
                sprints
                    .Where(s =>
                        s.StartDate <= DateTime.UtcNow &&
                        s.EndDate >= DateTime.UtcNow)
                    .OrderByDescending(s => s.StartDate)
                    .FirstOrDefault();

            // -----------------------------------------------------
            // TASK COUNT
            // -----------------------------------------------------

            var sprintIds =
                sprints
                    .Select(s => s.Id)
                    .ToList();

            var taskCount = 0;

            if (sprintIds.Any())
            {
                taskCount =
    await _context.Tasks
        .AsNoTracking()
        .CountAsync(t =>
            sprintIds.Contains(
                t.SprintId));
            }

            // -----------------------------------------------------
            // RECENT ACTIVITIES
            // -----------------------------------------------------

            var recentActivities =
                await _context.ActivityLogs
                    .AsNoTracking()
                    .Where(a =>
                        a.ProjectId == projectId)
                    .OrderByDescending(a => a.CreatedAt)
                    .Take(10)
                    .Join(
                        _context.Users,
                        activity => activity.UserId,
                        user => user.Id,
                        (activity, user) =>
                            new ProjectParticipationActivityDto
                            {
                                Id =
                                    activity.Id,

                                UserId =
                                    activity.UserId,

                                UserName =
                                    user.FullName,

                                Action =
                                    activity.Action,

                                ActivityType =
                                    activity.ActivityType,

                                Description =
                                    activity.Description,

                                CreatedAt =
                                    activity.CreatedAt
                            })
                    .ToListAsync();

            // -----------------------------------------------------
            // BUILD SPECIFICATION DTO
            // -----------------------------------------------------

            ProjectParticipationSpecificationDto?
                specification = null;

            if (project.Specification != null)
            {
                specification =
                    new ProjectParticipationSpecificationDto
                    {
                        Id =
                            project.Specification.Id,

                        Objectives =
                            project.Specification.Objectives,

                        Scope =
                            project.Specification.Scope,

                        FunctionalRequirements =
                            project.Specification
                                .FunctionalRequirements,

                        NonFunctionalRequirements =
                            project.Specification
                                .NonFunctionalRequirements,

                        Deliverables =
                            project.Specification
                                .Deliverables,

                        TechnologyStack =
                            project.Specification
                                .TechnologyStack,

                        Assumptions =
                            project.Specification.Assumptions,

                        Constraints =
                            project.Specification.Constraints
                    };
            }

            // -----------------------------------------------------
            // BUILD CURRENT SPRINT DTO
            // -----------------------------------------------------

            ProjectParticipationSprintDto?
                currentSprintDto = null;

            if (currentSprint != null)
            {
                currentSprintDto =
                    new ProjectParticipationSprintDto
                    {
                        Id =
                            currentSprint.Id,

                        Name =
                            currentSprint.Name,

                        Goal =
                            currentSprint.Goal,

                        StartDate =
                            currentSprint.StartDate,

                        EndDate =
                            currentSprint.EndDate,

                        Status =
                            currentSprint.Status.ToString(),

                        Priority =
                            currentSprint.Priority.ToString()
                    };
            }

            // -----------------------------------------------------
            // RETURN DETAILS
            // -----------------------------------------------------

            return new ProjectParticipationDetailsDto
            {
                ProjectId =
                    project.Id,

                ProjectName =
                    project.Name,

                Description =
                    project.Description,

                StatusId =
                    project.StatusId,

                StatusName =
                    project.Status?.Name
                    ?? string.Empty,

                IsStatusActive =
                    project.Status?.IsActive
                    ?? false,

                IsCompletedStatus =
                    project.Status?.IsCompletedStatus
                    ?? false,

                IsArchivedStatus =
                    project.Status?.IsArchivedStatus
                    ?? false,

                IsCancelledStatus =
                    project.Status?.IsCancelledStatus
                    ?? false,

                ProgressPercentage =
                    project.ProgressPercentage,

                StartDate =
                    project.StartDate,

                Deadline =
                    project.Deadline,

                ParticipantId =
                    userId,

                ParticipantName =
                    membership.User?.FullName
                    ?? string.Empty,

                AssignedRole =
                    membership.ContributorType?.Name
                    ?? string.Empty,

                AssignedRoleSubType =
                    membership.ContributorSubType?.Name,

                ManagerId =
                    project.ManagerId,

                ManagerName =
                    managerName,

                TeamId =
                    project.TeamId,

                TeamName =
                    membership.Team?.Name,

                TeamLeaderId =
                    teamLeader?.UserId,

                TeamLeaderName =
                    teamLeader?.User?.FullName,

                TeamMembers =
                    teamMemberDtos,

                Specification =
                    specification,

                CurrentSprint =
                    currentSprintDto,

                TaskCount =
                    taskCount,

                SprintCount =
                    sprints.Count,

                // Authorized project activities
                CanViewTasks = true,

                CanViewSprints = true,

                CanViewTeamMembers = true,

                CanParticipateInDiscussions = true,

                CanViewResources = true,

                // Reports are not automatically granted
                CanViewReports = false,

                RecentActivities =
                    recentActivities
            };
        }
    }
}