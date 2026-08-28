using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AI_PMS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FixDashboardPreferenceRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ShowTeamMetrics",
                table: "DashboardPreferences",
                newName: "ShowTeamProgress");

            migrationBuilder.RenameColumn(
                name: "ShowTaskMetrics",
                table: "DashboardPreferences",
                newName: "ShowSprintProgress");

            migrationBuilder.RenameColumn(
                name: "ShowSprintMetrics",
                table: "DashboardPreferences",
                newName: "ShowRisksAndIssues");

            migrationBuilder.RenameColumn(
                name: "ShowProjectMetrics",
                table: "DashboardPreferences",
                newName: "ShowRecentActivity");

            migrationBuilder.RenameColumn(
                name: "ShowAIAlerts",
                table: "DashboardPreferences",
                newName: "ShowProjectTimeline");

            migrationBuilder.AddColumn<bool>(
                name: "ShowAIRecommendations",
                table: "DashboardPreferences",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ShowAIRiskPrediction",
                table: "DashboardPreferences",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ShowDeadlineInformation",
                table: "DashboardPreferences",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ShowNotifications",
                table: "DashboardPreferences",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ShowProjectProgress",
                table: "DashboardPreferences",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "DashboardPreferenceWidgets",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    DashboardPreferenceId = table.Column<Guid>(type: "uuid", nullable: false),
                    WidgetKey = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    IsVisible = table.Column<bool>(type: "boolean", nullable: false),
                    DisplayOrder = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DashboardPreferenceWidgets", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DashboardPreferenceWidgets_DashboardPreferences_DashboardPr~",
                        column: x => x.DashboardPreferenceId,
                        principalTable: "DashboardPreferences",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DashboardPreferenceWidgets_DashboardPreferenceId_DisplayOrd~",
                table: "DashboardPreferenceWidgets",
                columns: new[] { "DashboardPreferenceId", "DisplayOrder" });

            migrationBuilder.CreateIndex(
                name: "IX_DashboardPreferenceWidgets_DashboardPreferenceId_WidgetKey",
                table: "DashboardPreferenceWidgets",
                columns: new[] { "DashboardPreferenceId", "WidgetKey" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DashboardPreferenceWidgets");

            migrationBuilder.DropColumn(
                name: "ShowAIRecommendations",
                table: "DashboardPreferences");

            migrationBuilder.DropColumn(
                name: "ShowAIRiskPrediction",
                table: "DashboardPreferences");

            migrationBuilder.DropColumn(
                name: "ShowDeadlineInformation",
                table: "DashboardPreferences");

            migrationBuilder.DropColumn(
                name: "ShowNotifications",
                table: "DashboardPreferences");

            migrationBuilder.DropColumn(
                name: "ShowProjectProgress",
                table: "DashboardPreferences");

            migrationBuilder.RenameColumn(
                name: "ShowTeamProgress",
                table: "DashboardPreferences",
                newName: "ShowTeamMetrics");

            migrationBuilder.RenameColumn(
                name: "ShowSprintProgress",
                table: "DashboardPreferences",
                newName: "ShowTaskMetrics");

            migrationBuilder.RenameColumn(
                name: "ShowRisksAndIssues",
                table: "DashboardPreferences",
                newName: "ShowSprintMetrics");

            migrationBuilder.RenameColumn(
                name: "ShowRecentActivity",
                table: "DashboardPreferences",
                newName: "ShowProjectMetrics");

            migrationBuilder.RenameColumn(
                name: "ShowProjectTimeline",
                table: "DashboardPreferences",
                newName: "ShowAIAlerts");
        }
    }
}
