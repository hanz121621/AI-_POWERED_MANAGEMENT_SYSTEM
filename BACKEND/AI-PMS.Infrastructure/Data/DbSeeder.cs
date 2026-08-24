using AI_PMS.Domain.Entities.Permissions;
using AI_PMS.Domain.Entities.Users;
using AI_PMS.Domain.Enums;

using AI_PMS.Infrastructure.Security;

using Microsoft.EntityFrameworkCore;

namespace AI_PMS.Infrastructure.Data
{
    public static class DbSeeder
    {
        public static async Task SeedAsync(
            ApplicationDbContext context,
            PasswordHasher passwordHasher)
        {
            // =====================================================
            // 1. SEED PERMISSIONS
            // =====================================================

            var permissionDefinitions =
                new Dictionary<string, string>
                {
                    // Users
                    ["Users.View"] =
                        "View users",

                    ["Users.Create"] =
                        "Create users",

                    ["Users.Update"] =
                        "Update users",

                    ["Users.Delete"] =
                        "Delete users",

                    ["Users.Activate"] =
                        "Activate or deactivate users",

                    ["Users.ChangeRole"] =
                        "Change user roles",

                    // Permissions
                    ["Permissions.View"] =
                        "View permissions",

                    ["Permissions.Create"] =
                        "Create permissions",

                    ["Permissions.Update"] =
                        "Update permissions",

                    ["Permissions.Delete"] =
                        "Delete permissions",

                    // Role permissions
                    ["RolePermissions.View"] =
                        "View role permissions",

                    ["RolePermissions.Assign"] =
                        "Assign permissions to roles",

                    ["RolePermissions.Delete"] =
                        "Delete role permissions",

                    // User permissions
                    ["UserPermissions.View"] =
                        "View user permission overrides",

                    ["UserPermissions.Assign"] =
                        "Assign user permission overrides",

                    ["UserPermissions.Delete"] =
                        "Delete user permission overrides",

                    // Profile
                    ["Profile.View"] =
                        "View own profile",

                    ["Profile.Update"] =
                        "Update own profile"
                };

            foreach (var definition in permissionDefinitions)
            {
                var permission =
                    await context.Permissions
                        .FirstOrDefaultAsync(
                            p => p.Name == definition.Key);

                if (permission == null)
                {
                    permission = new Permission
                    {
                        Id = Guid.NewGuid(),

                        Name = definition.Key,

                        Description = definition.Value,

                        IsActive = true,

                        CreatedAt = DateTime.UtcNow
                    };

                    await context.Permissions
                        .AddAsync(permission);
                }
                else
                {
                    // Make sure existing seeded permissions
                    // remain active.
                    permission.IsActive = true;
                }
            }

            await context.SaveChangesAsync();

            // =====================================================
            // 2. SEED ADMIN
            // =====================================================

            var admin =
                await context.Users
                    .FirstOrDefaultAsync(
                        u => u.Role == Role.Admin);

            if (admin == null)
            {
                admin = new User
                {
                    Id = Guid.NewGuid(),

                    FullName =
                        "System Administrator",

                    Email =
                        "Admin@gmail.com",

                    PasswordHash =
                        passwordHasher.HashPassword(
                            "Admin@123"),

                    Role =
                        Role.Admin,

                    IsActive =
                        true,

                    CreatedAt =
                        DateTime.UtcNow
                };

                await context.Users.AddAsync(admin);

                await context.SaveChangesAsync();
            }

            // =====================================================
            // 3. GET ALL SEEDED PERMISSIONS
            // =====================================================

            var permissions =
                await context.Permissions
                    .Where(p =>
                        p.IsActive &&
                        permissionDefinitions.Keys
                            .Contains(p.Name))
                    .ToListAsync();

            // =====================================================
            // 4. ADMIN GETS ALL PERMISSIONS
            // =====================================================

            foreach (var permission in permissions)
            {
                var exists =
                    await context.RolePermissions
                        .AnyAsync(x =>
                            x.Role == Role.Admin &&
                            x.PermissionId ==
                                permission.Id);

                if (!exists)
                {
                    await context.RolePermissions.AddAsync(
                        new RolePermission
                        {
                            Id = Guid.NewGuid(),

                            Role =
                                Role.Admin,

                            PermissionId =
                                permission.Id,

                            IsEnabled =
                                true,

                            CreatedAt =
                                DateTime.UtcNow
                        });
                }
                else
                {
                    var rolePermission =
                        await context.RolePermissions
                            .FirstAsync(x =>
                                x.Role == Role.Admin &&
                                x.PermissionId ==
                                    permission.Id);

                    rolePermission.IsEnabled = true;
                    rolePermission.UpdatedAt =
                        DateTime.UtcNow;
                }
            }

            await context.SaveChangesAsync();

            // =====================================================
            // 5. MANAGER PERMISSIONS
            // =====================================================

            var managerPermissions =
                new[]
                {
                    "Users.View",

                    "Users.Create",

                    "Users.Update",

                    "Users.Activate",

                    "Profile.View",

                    "Profile.Update"
                };

            await SeedRolePermissionsAsync(
                context,
                Role.Manager,
                managerPermissions);

            // =====================================================
            // 6. CONTRIBUTOR PERMISSIONS
            // =====================================================

            var contributorPermissions =
                new[]
                {
                    "Profile.View",

                    "Profile.Update"
                };

            await SeedRolePermissionsAsync(
                context,
                Role.Contributor,
                contributorPermissions);
        }

        // =========================================================
        // SEED ROLE PERMISSIONS
        // =========================================================

        private static async Task SeedRolePermissionsAsync(
            ApplicationDbContext context,
            Role role,
            IEnumerable<string> permissionNames)
        {
            var permissions =
                await context.Permissions
                    .Where(p =>
                        p.IsActive &&
                        permissionNames.Contains(p.Name))
                    .ToListAsync();

            foreach (var permission in permissions)
            {
                var existing =
                    await context.RolePermissions
                        .FirstOrDefaultAsync(x =>
                            x.Role == role &&
                            x.PermissionId ==
                                permission.Id);

                if (existing == null)
                {
                    await context.RolePermissions.AddAsync(
                        new RolePermission
                        {
                            Id = Guid.NewGuid(),

                            Role =
                                role,

                            PermissionId =
                                permission.Id,

                            IsEnabled =
                                true,

                            CreatedAt =
                                DateTime.UtcNow
                        });
                }
                else
                {
                    existing.IsEnabled = true;
                    existing.UpdatedAt =
                        DateTime.UtcNow;
                }
            }

            await context.SaveChangesAsync();
        }

        // =========================================================
        // BACKWARD COMPATIBILITY
        // =========================================================

        public static async Task SeedAdminAsync(
            ApplicationDbContext context,
            PasswordHasher passwordHasher)
        {
            await SeedAsync(
                context,
                passwordHasher);
        }
    }
}