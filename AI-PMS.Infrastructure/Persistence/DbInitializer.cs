using AI_PMS.Domain.Entities;
using AI_PMS.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace AI_PMS.Infrastructure.Persistence;

public static class DbInitializer
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        // Make sure the database exists and migrations are applied.
        await context.Database.MigrateAsync();

        // ---------------------------------------------------------
        // Organization
        // ---------------------------------------------------------

        var organization = await context.Organizations
            .FirstOrDefaultAsync();

        if (organization == null)
        {
            organization = new Organization
            {
                Id = Guid.NewGuid(),
                Name = "AI-PMS Test Organization"
            };

            context.Organizations.Add(organization);
            await context.SaveChangesAsync();
        }

        // ---------------------------------------------------------
        // User
        // ---------------------------------------------------------

        var user = await context.Users
            .FirstOrDefaultAsync();

        if (user == null)
        {
            user = new User
            {
                Id = Guid.NewGuid(),
                FirstName = "Test",
                LastName = "Developer",
                Email = "developer@aipms.local",
                PasswordHash = "TEST_ONLY",
                Role = Role.Developer,
                OrganizationId = organization.Id
            };

            context.Users.Add(user);
            await context.SaveChangesAsync();
        }

        // ---------------------------------------------------------
        // Project
        // ---------------------------------------------------------

        var project = await context.Projects
            .FirstOrDefaultAsync();

        if (project == null)
        {
            project = new Project
            {
                Id = Guid.NewGuid(),
                Name = "E-Commerce Platform",
                Description = "Test project for AI bottleneck detection.",
                OrganizationId = organization.Id,
                ProjectManagerId = user.Id
            };

            context.Projects.Add(project);
            await context.SaveChangesAsync();
        }

        // ---------------------------------------------------------
        // Tasks
        // ---------------------------------------------------------

        var taskCount = await context.Tasks
            .CountAsync(t => t.ProjectId == project.Id);

        if (taskCount == 0)
        {
            var tasks = new List<TaskItem>
            {
                new TaskItem
                {
                    Id = Guid.NewGuid(),
                    Title = "Implement user authentication",
                    Description = "Implement registration, login and authentication.",
                    Status = TaskState.InProgress,
                    Priority = Priority.High,
                    EstimatedHours = 24,
                    ProjectId = project.Id,
                    AssignedUserId = user.Id
                },

                new TaskItem
                {
                    Id = Guid.NewGuid(),
                    Title = "Implement payment integration",
                    Description = "Integrate the payment provider.",
                    Status = TaskState.InProgress,
                    Priority = Priority.High,
                    EstimatedHours = 40,
                    ProjectId = project.Id,
                    AssignedUserId = user.Id
                },

                new TaskItem
                {
                    Id = Guid.NewGuid(),
                    Title = "Create product catalog",
                    Description = "Create the product catalog module.",
                    Status = TaskState.InProgress,
                    Priority = Priority.Medium,
                    EstimatedHours = 20,
                    ProjectId = project.Id,
                    AssignedUserId = user.Id
                },

                new TaskItem
                {
                    Id = Guid.NewGuid(),
                    Title = "Implement order management",
                    Description = "Implement order processing and management.",
                    Status = TaskState.Blocked,
                    Priority = Priority.High,
                    EstimatedHours = 32,
                    ProjectId = project.Id,
                    AssignedUserId = user.Id
                },

                new TaskItem
                {
                    Id = Guid.NewGuid(),
                    Title = "Create admin dashboard",
                    Description = "Create the administration dashboard.",
                    Status = TaskState.Backlog,
                    Priority = Priority.Medium,
                    EstimatedHours = 16,
                    ProjectId = project.Id,
                    AssignedUserId = user.Id
                }
            };

            context.Tasks.AddRange(tasks);
            await context.SaveChangesAsync();
        }
    }
}