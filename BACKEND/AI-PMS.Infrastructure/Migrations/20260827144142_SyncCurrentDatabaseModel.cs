using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AI_PMS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SyncCurrentDatabaseModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AIPreference_Users_UserId",
                table: "AIPreference");

            migrationBuilder.DropForeignKey(
                name: "FK_DashboardPreference_Users_UserId",
                table: "DashboardPreference");

            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_NotificationTypes_NotificationTypeId",
                table: "Notifications");

            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_Projects_ProjectId",
                table: "Notifications");

            migrationBuilder.DropForeignKey(
                name: "FK_ProjectStatusTransitions_Projects_ProjectId",
                table: "ProjectStatusTransitions");

            migrationBuilder.DropForeignKey(
                name: "FK_RiskIssues_RiskIssuePriorities_PriorityId",
                table: "RiskIssues");

            migrationBuilder.DropForeignKey(
                name: "FK_RiskIssues_RiskIssueSeverities_SeverityId",
                table: "RiskIssues");

            migrationBuilder.DropForeignKey(
                name: "FK_RiskIssues_RiskIssueStatuses_StatusId",
                table: "RiskIssues");

            migrationBuilder.DropForeignKey(
                name: "FK_RiskIssues_RiskIssueTypes_TypeId",
                table: "RiskIssues");

            migrationBuilder.DropForeignKey(
                name: "FK_RiskIssues_Sprints_SprintId",
                table: "RiskIssues");

            migrationBuilder.DropForeignKey(
                name: "FK_RiskIssues_Tasks_TaskId",
                table: "RiskIssues");

            migrationBuilder.DropForeignKey(
                name: "FK_RiskIssues_Users_ReportedById",
                table: "RiskIssues");

            migrationBuilder.DropForeignKey(
                name: "FK_RiskIssues_Users_ResolvedById",
                table: "RiskIssues");

            migrationBuilder.DropIndex(
                name: "IX_TeamMemberRequests_TeamId_UserId_Status",
                table: "TeamMemberRequests");

            migrationBuilder.DropIndex(
                name: "IX_RiskIssues_ReportedAt",
                table: "RiskIssues");

            migrationBuilder.DropIndex(
                name: "IX_ProjectStatusTransitions_ProjectId",
                table: "ProjectStatusTransitions");

            migrationBuilder.DropIndex(
                name: "IX_NotificationTypes_Name",
                table: "NotificationTypes");

            migrationBuilder.DropIndex(
                name: "IX_Notifications_UserId_IsRead_CreatedAt",
                table: "Notifications");

            migrationBuilder.DropPrimaryKey(
                name: "PK_RiskIssueTypes",
                table: "RiskIssueTypes");

            migrationBuilder.DropIndex(
                name: "IX_RiskIssueTypes_Name",
                table: "RiskIssueTypes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_RiskIssueStatuses",
                table: "RiskIssueStatuses");

            migrationBuilder.DropIndex(
                name: "IX_RiskIssueStatuses_Name",
                table: "RiskIssueStatuses");

            migrationBuilder.DropPrimaryKey(
                name: "PK_RiskIssueSeverities",
                table: "RiskIssueSeverities");

            migrationBuilder.DropIndex(
                name: "IX_RiskIssueSeverities_Name",
                table: "RiskIssueSeverities");

            migrationBuilder.DropPrimaryKey(
                name: "PK_RiskIssuePriorities",
                table: "RiskIssuePriorities");

            migrationBuilder.DropIndex(
                name: "IX_RiskIssuePriorities_Name",
                table: "RiskIssuePriorities");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DashboardPreference",
                table: "DashboardPreference");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AIPreference",
                table: "AIPreference");

            migrationBuilder.DropColumn(
                name: "ProjectId",
                table: "ProjectStatusTransitions");

            migrationBuilder.RenameTable(
                name: "RiskIssueTypes",
                newName: "RiskIssueType");

            migrationBuilder.RenameTable(
                name: "RiskIssueStatuses",
                newName: "RiskIssueStatus");

            migrationBuilder.RenameTable(
                name: "RiskIssueSeverities",
                newName: "RiskIssueSeverity");

            migrationBuilder.RenameTable(
                name: "RiskIssuePriorities",
                newName: "RiskIssuePriority");

            migrationBuilder.RenameTable(
                name: "DashboardPreference",
                newName: "DashboardPreferences");

            migrationBuilder.RenameTable(
                name: "AIPreference",
                newName: "AIPreferences");

            migrationBuilder.RenameIndex(
                name: "IX_DashboardPreference_UserId",
                table: "DashboardPreferences",
                newName: "IX_DashboardPreferences_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_AIPreference_UserId",
                table: "AIPreferences",
                newName: "IX_AIPreferences_UserId");

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                table: "Projects",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Projects",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<Guid>(
                name: "ProjectId",
                table: "ActivityLogs",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "TeamId",
                table: "ActivityLogs",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_RiskIssueType",
                table: "RiskIssueType",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_RiskIssueStatus",
                table: "RiskIssueStatus",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_RiskIssueSeverity",
                table: "RiskIssueSeverity",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_RiskIssuePriority",
                table: "RiskIssuePriority",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_DashboardPreferences",
                table: "DashboardPreferences",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AIPreferences",
                table: "AIPreferences",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "MessageMentions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    MessageId = table.Column<Guid>(type: "uuid", nullable: false),
                    MentionedUserId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MessageMentions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MessageMentions_Messages_MessageId",
                        column: x => x.MessageId,
                        principalTable: "Messages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MessageMentions_Users_MentionedUserId",
                        column: x => x.MentionedUserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_UserId",
                table: "Notifications",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_MessageMentions_MentionedUserId",
                table: "MessageMentions",
                column: "MentionedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_MessageMentions_MessageId",
                table: "MessageMentions",
                column: "MessageId");

            migrationBuilder.AddForeignKey(
                name: "FK_AIPreferences_Users_UserId",
                table: "AIPreferences",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DashboardPreferences_Users_UserId",
                table: "DashboardPreferences",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_NotificationTypes_NotificationTypeId",
                table: "Notifications",
                column: "NotificationTypeId",
                principalTable: "NotificationTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_Projects_ProjectId",
                table: "Notifications",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_RiskIssues_RiskIssuePriority_PriorityId",
                table: "RiskIssues",
                column: "PriorityId",
                principalTable: "RiskIssuePriority",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_RiskIssues_RiskIssueSeverity_SeverityId",
                table: "RiskIssues",
                column: "SeverityId",
                principalTable: "RiskIssueSeverity",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_RiskIssues_RiskIssueStatus_StatusId",
                table: "RiskIssues",
                column: "StatusId",
                principalTable: "RiskIssueStatus",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_RiskIssues_RiskIssueType_TypeId",
                table: "RiskIssues",
                column: "TypeId",
                principalTable: "RiskIssueType",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_RiskIssues_Sprints_SprintId",
                table: "RiskIssues",
                column: "SprintId",
                principalTable: "Sprints",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_RiskIssues_Tasks_TaskId",
                table: "RiskIssues",
                column: "TaskId",
                principalTable: "Tasks",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_RiskIssues_Users_ReportedById",
                table: "RiskIssues",
                column: "ReportedById",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_RiskIssues_Users_ResolvedById",
                table: "RiskIssues",
                column: "ResolvedById",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AIPreferences_Users_UserId",
                table: "AIPreferences");

            migrationBuilder.DropForeignKey(
                name: "FK_DashboardPreferences_Users_UserId",
                table: "DashboardPreferences");

            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_NotificationTypes_NotificationTypeId",
                table: "Notifications");

            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_Projects_ProjectId",
                table: "Notifications");

            migrationBuilder.DropForeignKey(
                name: "FK_RiskIssues_RiskIssuePriority_PriorityId",
                table: "RiskIssues");

            migrationBuilder.DropForeignKey(
                name: "FK_RiskIssues_RiskIssueSeverity_SeverityId",
                table: "RiskIssues");

            migrationBuilder.DropForeignKey(
                name: "FK_RiskIssues_RiskIssueStatus_StatusId",
                table: "RiskIssues");

            migrationBuilder.DropForeignKey(
                name: "FK_RiskIssues_RiskIssueType_TypeId",
                table: "RiskIssues");

            migrationBuilder.DropForeignKey(
                name: "FK_RiskIssues_Sprints_SprintId",
                table: "RiskIssues");

            migrationBuilder.DropForeignKey(
                name: "FK_RiskIssues_Tasks_TaskId",
                table: "RiskIssues");

            migrationBuilder.DropForeignKey(
                name: "FK_RiskIssues_Users_ReportedById",
                table: "RiskIssues");

            migrationBuilder.DropForeignKey(
                name: "FK_RiskIssues_Users_ResolvedById",
                table: "RiskIssues");

            migrationBuilder.DropTable(
                name: "MessageMentions");

            migrationBuilder.DropIndex(
                name: "IX_Notifications_UserId",
                table: "Notifications");

            migrationBuilder.DropPrimaryKey(
                name: "PK_RiskIssueType",
                table: "RiskIssueType");

            migrationBuilder.DropPrimaryKey(
                name: "PK_RiskIssueStatus",
                table: "RiskIssueStatus");

            migrationBuilder.DropPrimaryKey(
                name: "PK_RiskIssueSeverity",
                table: "RiskIssueSeverity");

            migrationBuilder.DropPrimaryKey(
                name: "PK_RiskIssuePriority",
                table: "RiskIssuePriority");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DashboardPreferences",
                table: "DashboardPreferences");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AIPreferences",
                table: "AIPreferences");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "ProjectId",
                table: "ActivityLogs");

            migrationBuilder.DropColumn(
                name: "TeamId",
                table: "ActivityLogs");

            migrationBuilder.RenameTable(
                name: "RiskIssueType",
                newName: "RiskIssueTypes");

            migrationBuilder.RenameTable(
                name: "RiskIssueStatus",
                newName: "RiskIssueStatuses");

            migrationBuilder.RenameTable(
                name: "RiskIssueSeverity",
                newName: "RiskIssueSeverities");

            migrationBuilder.RenameTable(
                name: "RiskIssuePriority",
                newName: "RiskIssuePriorities");

            migrationBuilder.RenameTable(
                name: "DashboardPreferences",
                newName: "DashboardPreference");

            migrationBuilder.RenameTable(
                name: "AIPreferences",
                newName: "AIPreference");

            migrationBuilder.RenameIndex(
                name: "IX_DashboardPreferences_UserId",
                table: "DashboardPreference",
                newName: "IX_DashboardPreference_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_AIPreferences_UserId",
                table: "AIPreference",
                newName: "IX_AIPreference_UserId");

            migrationBuilder.AddColumn<Guid>(
                name: "ProjectId",
                table: "ProjectStatusTransitions",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_RiskIssueTypes",
                table: "RiskIssueTypes",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_RiskIssueStatuses",
                table: "RiskIssueStatuses",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_RiskIssueSeverities",
                table: "RiskIssueSeverities",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_RiskIssuePriorities",
                table: "RiskIssuePriorities",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_DashboardPreference",
                table: "DashboardPreference",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AIPreference",
                table: "AIPreference",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_TeamMemberRequests_TeamId_UserId_Status",
                table: "TeamMemberRequests",
                columns: new[] { "TeamId", "UserId", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_RiskIssues_ReportedAt",
                table: "RiskIssues",
                column: "ReportedAt");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStatusTransitions_ProjectId",
                table: "ProjectStatusTransitions",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_NotificationTypes_Name",
                table: "NotificationTypes",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_UserId_IsRead_CreatedAt",
                table: "Notifications",
                columns: new[] { "UserId", "IsRead", "CreatedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_RiskIssueTypes_Name",
                table: "RiskIssueTypes",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_RiskIssueStatuses_Name",
                table: "RiskIssueStatuses",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_RiskIssueSeverities_Name",
                table: "RiskIssueSeverities",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_RiskIssuePriorities_Name",
                table: "RiskIssuePriorities",
                column: "Name",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_AIPreference_Users_UserId",
                table: "AIPreference",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DashboardPreference_Users_UserId",
                table: "DashboardPreference",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_NotificationTypes_NotificationTypeId",
                table: "Notifications",
                column: "NotificationTypeId",
                principalTable: "NotificationTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_Projects_ProjectId",
                table: "Notifications",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectStatusTransitions_Projects_ProjectId",
                table: "ProjectStatusTransitions",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_RiskIssues_RiskIssuePriorities_PriorityId",
                table: "RiskIssues",
                column: "PriorityId",
                principalTable: "RiskIssuePriorities",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_RiskIssues_RiskIssueSeverities_SeverityId",
                table: "RiskIssues",
                column: "SeverityId",
                principalTable: "RiskIssueSeverities",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_RiskIssues_RiskIssueStatuses_StatusId",
                table: "RiskIssues",
                column: "StatusId",
                principalTable: "RiskIssueStatuses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_RiskIssues_RiskIssueTypes_TypeId",
                table: "RiskIssues",
                column: "TypeId",
                principalTable: "RiskIssueTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_RiskIssues_Sprints_SprintId",
                table: "RiskIssues",
                column: "SprintId",
                principalTable: "Sprints",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_RiskIssues_Tasks_TaskId",
                table: "RiskIssues",
                column: "TaskId",
                principalTable: "Tasks",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_RiskIssues_Users_ReportedById",
                table: "RiskIssues",
                column: "ReportedById",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_RiskIssues_Users_ResolvedById",
                table: "RiskIssues",
                column: "ResolvedById",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
