using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AI_PMS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddNotificationSettings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "NotificationSettings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    NotificationsEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    EmailNotificationsEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    InSystemNotificationsEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    TaskAssignmentAlertsEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    ProjectDeadlineRemindersEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    SprintUpdateNotificationsEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    AiRecommendationAlertsEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    UserActivityNotificationsEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NotificationSettings", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "NotificationSettings");
        }
    }
}
