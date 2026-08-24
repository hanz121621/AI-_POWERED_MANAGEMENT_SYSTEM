using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AI_PMS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddDashboardAndAIPreferences : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AIPreferences",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    AIEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    RecommendationsEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    RiskAnalysisEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    AIAlertsEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    SuggestionApprovalMode = table.Column<string>(type: "text", nullable: false),
                    AllowAIDataUsage = table.Column<bool>(type: "boolean", nullable: false),
                    AnalysisFrequencyMinutes = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AIPreferences", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DashboardPreferences",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    ShowProjectMetrics = table.Column<bool>(type: "boolean", nullable: false),
                    ShowTaskMetrics = table.Column<bool>(type: "boolean", nullable: false),
                    ShowSprintMetrics = table.Column<bool>(type: "boolean", nullable: false),
                    ShowTeamMetrics = table.Column<bool>(type: "boolean", nullable: false),
                    ShowAIAlerts = table.Column<bool>(type: "boolean", nullable: false),
                    DefaultView = table.Column<string>(type: "text", nullable: false),
                    DefaultFilter = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DashboardPreferences", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AIPreferences_UserId",
                table: "AIPreferences",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DashboardPreferences_UserId",
                table: "DashboardPreferences",
                column: "UserId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AIPreferences");

            migrationBuilder.DropTable(
                name: "DashboardPreferences");
        }
    }
}
