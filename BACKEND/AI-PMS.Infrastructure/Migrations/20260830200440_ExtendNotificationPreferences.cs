using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AI_PMS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ExtendNotificationPreferences : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "CommentAndMentionNotificationsEnabled",
                table: "NotificationSettings",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ProjectAnnouncementNotificationsEnabled",
                table: "NotificationSettings",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ReviewRequestNotificationsEnabled",
                table: "NotificationSettings",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "TaskStatusUpdateNotificationsEnabled",
                table: "NotificationSettings",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "TeamLeaderMessageNotificationsEnabled",
                table: "NotificationSettings",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CommentAndMentionNotificationsEnabled",
                table: "NotificationSettings");

            migrationBuilder.DropColumn(
                name: "ProjectAnnouncementNotificationsEnabled",
                table: "NotificationSettings");

            migrationBuilder.DropColumn(
                name: "ReviewRequestNotificationsEnabled",
                table: "NotificationSettings");

            migrationBuilder.DropColumn(
                name: "TaskStatusUpdateNotificationsEnabled",
                table: "NotificationSettings");

            migrationBuilder.DropColumn(
                name: "TeamLeaderMessageNotificationsEnabled",
                table: "NotificationSettings");
        }
    }
}
