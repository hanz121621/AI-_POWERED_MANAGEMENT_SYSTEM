using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AI_PMS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddSecuritySettings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SecuritySettings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PasswordComplexityEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    MinimumPasswordLength = table.Column<int>(type: "integer", nullable: false),
                    RequireUppercase = table.Column<bool>(type: "boolean", nullable: false),
                    RequireLowercase = table.Column<bool>(type: "boolean", nullable: false),
                    RequireNumber = table.Column<bool>(type: "boolean", nullable: false),
                    RequireSpecialCharacter = table.Column<bool>(type: "boolean", nullable: false),
                    SessionTimeoutMinutes = table.Column<int>(type: "integer", nullable: false),
                    MaxLoginAttempts = table.Column<int>(type: "integer", nullable: false),
                    AccountLockoutEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    AccountLockoutMinutes = table.Column<int>(type: "integer", nullable: false),
                    TwoFactorAuthenticationEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    ApiSecurityEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SecuritySettings", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SecuritySettings");
        }
    }
}
