using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AI_PMS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddNotifications : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "RequestType",
                table: "TeamMemberRequests",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "NotificationTypes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NotificationTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RiskIssuePriorities",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RiskIssuePriorities", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RiskIssueSeverities",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RiskIssueSeverities", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RiskIssueStatuses",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    IsResolved = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RiskIssueStatuses", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RiskIssueTypes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RiskIssueTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Notifications",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    NotificationTypeId = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Message = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: false),
                    IsRead = table.Column<bool>(type: "boolean", nullable: false),
                    ReadAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ProjectId = table.Column<Guid>(type: "uuid", nullable: true),
                    TeamId = table.Column<Guid>(type: "uuid", nullable: true),
                    SprintId = table.Column<Guid>(type: "uuid", nullable: true),
                    RelatedEntityId = table.Column<Guid>(type: "uuid", nullable: true),
                    RelatedEntityType = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notifications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Notifications_NotificationTypes_NotificationTypeId",
                        column: x => x.NotificationTypeId,
                        principalTable: "NotificationTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Notifications_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Notifications_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RiskIssues",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ProjectId = table.Column<Guid>(type: "uuid", nullable: false),
                    TypeId = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    SeverityId = table.Column<Guid>(type: "uuid", nullable: false),
                    PriorityId = table.Column<Guid>(type: "uuid", nullable: false),
                    StatusId = table.Column<Guid>(type: "uuid", nullable: false),
                    ReportedById = table.Column<Guid>(type: "uuid", nullable: false),
                    SprintId = table.Column<Guid>(type: "uuid", nullable: true),
                    TaskId = table.Column<Guid>(type: "uuid", nullable: true),
                    ResolutionInformation = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    ResolvedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ResolvedById = table.Column<Guid>(type: "uuid", nullable: true),
                    ReportedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RiskIssues", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RiskIssues_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RiskIssues_RiskIssuePriorities_PriorityId",
                        column: x => x.PriorityId,
                        principalTable: "RiskIssuePriorities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_RiskIssues_RiskIssueSeverities_SeverityId",
                        column: x => x.SeverityId,
                        principalTable: "RiskIssueSeverities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_RiskIssues_RiskIssueStatuses_StatusId",
                        column: x => x.StatusId,
                        principalTable: "RiskIssueStatuses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_RiskIssues_RiskIssueTypes_TypeId",
                        column: x => x.TypeId,
                        principalTable: "RiskIssueTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_RiskIssues_Sprints_SprintId",
                        column: x => x.SprintId,
                        principalTable: "Sprints",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_RiskIssues_Tasks_TaskId",
                        column: x => x.TaskId,
                        principalTable: "Tasks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_RiskIssues_Users_ReportedById",
                        column: x => x.ReportedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_RiskIssues_Users_ResolvedById",
                        column: x => x.ResolvedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TeamMemberRequests_ManagerId",
                table: "TeamMemberRequests",
                column: "ManagerId");

            migrationBuilder.CreateIndex(
                name: "IX_TeamMemberRequests_ProjectId",
                table: "TeamMemberRequests",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_TeamMemberRequests_ReviewedByAdminId",
                table: "TeamMemberRequests",
                column: "ReviewedByAdminId");

            migrationBuilder.CreateIndex(
                name: "IX_TeamMemberRequests_TeamId_UserId_Status_RequestType",
                table: "TeamMemberRequests",
                columns: new[] { "TeamId", "UserId", "Status", "RequestType" });

            migrationBuilder.CreateIndex(
                name: "IX_TeamMemberRequests_UserId",
                table: "TeamMemberRequests",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_NotificationTypeId",
                table: "Notifications",
                column: "NotificationTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_ProjectId",
                table: "Notifications",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_UserId_IsRead_CreatedAt",
                table: "Notifications",
                columns: new[] { "UserId", "IsRead", "CreatedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_NotificationTypes_Name",
                table: "NotificationTypes",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_RiskIssuePriorities_Name",
                table: "RiskIssuePriorities",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_RiskIssues_PriorityId",
                table: "RiskIssues",
                column: "PriorityId");

            migrationBuilder.CreateIndex(
                name: "IX_RiskIssues_ProjectId",
                table: "RiskIssues",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_RiskIssues_ReportedAt",
                table: "RiskIssues",
                column: "ReportedAt");

            migrationBuilder.CreateIndex(
                name: "IX_RiskIssues_ReportedById",
                table: "RiskIssues",
                column: "ReportedById");

            migrationBuilder.CreateIndex(
                name: "IX_RiskIssues_ResolvedById",
                table: "RiskIssues",
                column: "ResolvedById");

            migrationBuilder.CreateIndex(
                name: "IX_RiskIssues_SeverityId",
                table: "RiskIssues",
                column: "SeverityId");

            migrationBuilder.CreateIndex(
                name: "IX_RiskIssues_SprintId",
                table: "RiskIssues",
                column: "SprintId");

            migrationBuilder.CreateIndex(
                name: "IX_RiskIssues_StatusId",
                table: "RiskIssues",
                column: "StatusId");

            migrationBuilder.CreateIndex(
                name: "IX_RiskIssues_TaskId",
                table: "RiskIssues",
                column: "TaskId");

            migrationBuilder.CreateIndex(
                name: "IX_RiskIssues_TypeId",
                table: "RiskIssues",
                column: "TypeId");

            migrationBuilder.CreateIndex(
                name: "IX_RiskIssueSeverities_Name",
                table: "RiskIssueSeverities",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_RiskIssueStatuses_Name",
                table: "RiskIssueStatuses",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_RiskIssueTypes_Name",
                table: "RiskIssueTypes",
                column: "Name",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_TeamMemberRequests_Projects_ProjectId",
                table: "TeamMemberRequests",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TeamMemberRequests_Users_ManagerId",
                table: "TeamMemberRequests",
                column: "ManagerId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TeamMemberRequests_Users_ReviewedByAdminId",
                table: "TeamMemberRequests",
                column: "ReviewedByAdminId",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_TeamMemberRequests_Users_UserId",
                table: "TeamMemberRequests",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TeamMemberRequests_Projects_ProjectId",
                table: "TeamMemberRequests");

            migrationBuilder.DropForeignKey(
                name: "FK_TeamMemberRequests_Users_ManagerId",
                table: "TeamMemberRequests");

            migrationBuilder.DropForeignKey(
                name: "FK_TeamMemberRequests_Users_ReviewedByAdminId",
                table: "TeamMemberRequests");

            migrationBuilder.DropForeignKey(
                name: "FK_TeamMemberRequests_Users_UserId",
                table: "TeamMemberRequests");

            migrationBuilder.DropTable(
                name: "Notifications");

            migrationBuilder.DropTable(
                name: "RiskIssues");

            migrationBuilder.DropTable(
                name: "NotificationTypes");

            migrationBuilder.DropTable(
                name: "RiskIssuePriorities");

            migrationBuilder.DropTable(
                name: "RiskIssueSeverities");

            migrationBuilder.DropTable(
                name: "RiskIssueStatuses");

            migrationBuilder.DropTable(
                name: "RiskIssueTypes");

            migrationBuilder.DropIndex(
                name: "IX_TeamMemberRequests_ManagerId",
                table: "TeamMemberRequests");

            migrationBuilder.DropIndex(
                name: "IX_TeamMemberRequests_ProjectId",
                table: "TeamMemberRequests");

            migrationBuilder.DropIndex(
                name: "IX_TeamMemberRequests_ReviewedByAdminId",
                table: "TeamMemberRequests");

            migrationBuilder.DropIndex(
                name: "IX_TeamMemberRequests_TeamId_UserId_Status_RequestType",
                table: "TeamMemberRequests");

            migrationBuilder.DropIndex(
                name: "IX_TeamMemberRequests_UserId",
                table: "TeamMemberRequests");

            migrationBuilder.DropColumn(
                name: "RequestType",
                table: "TeamMemberRequests");
        }
    }
}
