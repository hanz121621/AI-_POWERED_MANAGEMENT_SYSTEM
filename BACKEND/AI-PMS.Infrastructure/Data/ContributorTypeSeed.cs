using AI_PMS.Domain.Entities.Teams;
using Microsoft.EntityFrameworkCore;

namespace AI_PMS.Infrastructure.Data
{
    public static class ContributorTypeSeed
    {
        public static void Seed(ModelBuilder modelBuilder)
        {
            var seedDate = new DateTime(
                2026,
                1,
                1,
                0,
                0,
                0,
                DateTimeKind.Utc
            );

            // Existing IDs
            var developerTypeId = Guid.Parse("11111111-1111-1111-1111-111111111111");
            var staffTypeId = Guid.Parse("22222222-2222-2222-2222-222222222222");

            var frontendDeveloperId = Guid.Parse("11111111-1111-1111-1111-111111111112");
            var backendDeveloperId = Guid.Parse("11111111-1111-1111-1111-111111111113");
            var fullStackDeveloperId = Guid.Parse("11111111-1111-1111-1111-111111111114");
            var developerOtherId = Guid.Parse("11111111-1111-1111-1111-111111111115");

            var hrStaffId = Guid.Parse("22222222-2222-2222-2222-222222222223");
            var financeStaffId = Guid.Parse("22222222-2222-2222-2222-222222222224");
            var administrationStaffId = Guid.Parse("22222222-2222-2222-2222-222222222225");
            var staffOtherId = Guid.Parse("22222222-2222-2222-2222-222222222226");

            // ➕ NEW: Team Leader ID (No subtype needed)
            var teamLeaderTypeId = Guid.Parse("33333333-3333-3333-3333-333333333333");

            modelBuilder.Entity<ContributorType>().HasData(
                new ContributorType
                {
                    Id = developerTypeId,
                    Name = "Developer",
                    Description = "Software development and technical roles.",
                    IsActive = true,
                    CreatedAt = seedDate
                },
                new ContributorType
                {
                    Id = staffTypeId,
                    Name = "Staff",
                    Description = "Administrative and support roles.",
                    IsActive = true,
                    CreatedAt = seedDate
                },
                // ➕ NEW: Team Leader Contributor Type
                new ContributorType
                {
                    Id = teamLeaderTypeId,
                    Name = "Team Leader",
                    Description = "Responsible for managing and leading a project team.",
                    IsActive = true,
                    CreatedAt = seedDate
                }
            );

            // SubTypes remain exactly as they were (Developer and Staff only)
            modelBuilder.Entity<ContributorSubType>().HasData(
                new ContributorSubType
                {
                    Id = frontendDeveloperId,
                    ContributorTypeId = developerTypeId,
                    Name = "Frontend Developer",
                    Description = "Develops user interfaces and frontend applications.",
                    IsActive = true,
                    CreatedAt = seedDate
                },
                new ContributorSubType
                {
                    Id = backendDeveloperId,
                    ContributorTypeId = developerTypeId,
                    Name = "Backend Developer",
                    Description = "Develops APIs, services, databases and backend systems.",
                    IsActive = true,
                    CreatedAt = seedDate
                },
                new ContributorSubType
                {
                    Id = fullStackDeveloperId,
                    ContributorTypeId = developerTypeId,
                    Name = "Full Stack Developer",
                    Description = "Works across frontend and backend development.",
                    IsActive = true,
                    CreatedAt = seedDate
                },
                new ContributorSubType
                {
                    Id = developerOtherId,
                    ContributorTypeId = developerTypeId,
                    Name = "Other",
                    Description = "Other developer specialization.",
                    IsActive = true,
                    CreatedAt = seedDate
                },
                new ContributorSubType
                {
                    Id = hrStaffId,
                    ContributorTypeId = staffTypeId,
                    Name = "Human Resources",
                    Description = "Human resources and employee management.",
                    IsActive = true,
                    CreatedAt = seedDate
                },
                new ContributorSubType
                {
                    Id = financeStaffId,
                    ContributorTypeId = staffTypeId,
                    Name = "Finance",
                    Description = "Financial and accounting responsibilities.",
                    IsActive = true,
                    CreatedAt = seedDate
                },
                new ContributorSubType
                {
                    Id = administrationStaffId,
                    ContributorTypeId = staffTypeId,
                    Name = "Administration",
                    Description = "Administrative and organizational responsibilities.",
                    IsActive = true,
                    CreatedAt = seedDate
                },
                new ContributorSubType
                {
                    Id = staffOtherId,
                    ContributorTypeId = staffTypeId,
                    Name = "Other",
                    Description = "Other staff specialization.",
                    IsActive = true,
                    CreatedAt = seedDate
                }
            );
        }
    }
}