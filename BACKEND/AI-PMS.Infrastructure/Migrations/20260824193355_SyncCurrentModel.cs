using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AI_PMS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SyncCurrentModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TeamMembers_ContributorSubTypes_ContributorSubTypeId1",
                table: "TeamMembers");

            migrationBuilder.DropIndex(
                name: "IX_TeamMembers_ContributorSubTypeId1",
                table: "TeamMembers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DashboardPreferences",
                table: "DashboardPreferences");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AIPreferences",
                table: "AIPreferences");

            migrationBuilder.DropColumn(
                name: "ContributorSubTypeId1",
                table: "TeamMembers");

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

            migrationBuilder.RenameColumn(
                name: "RiskAnalysisEnabled",
                table: "AIPreference",
                newName: "IsAIEnabled");

            migrationBuilder.RenameColumn(
                name: "RecommendationsEnabled",
                table: "AIPreference",
                newName: "EnableRiskAnalysis");

            migrationBuilder.RenameColumn(
                name: "AIEnabled",
                table: "AIPreference",
                newName: "EnableRecommendations");

            migrationBuilder.RenameColumn(
                name: "AIAlertsEnabled",
                table: "AIPreference",
                newName: "EnableNotifications");

            migrationBuilder.RenameIndex(
                name: "IX_AIPreferences_UserId",
                table: "AIPreference",
                newName: "IX_AIPreference_UserId");

            migrationBuilder.AlterColumn<string>(
                name: "DefaultView",
                table: "DashboardPreference",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "DefaultFilter",
                table: "DashboardPreference",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "SuggestionApprovalMode",
                table: "AIPreference",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddPrimaryKey(
                name: "PK_DashboardPreference",
                table: "DashboardPreference",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AIPreference",
                table: "AIPreference",
                column: "Id");

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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AIPreference_Users_UserId",
                table: "AIPreference");

            migrationBuilder.DropForeignKey(
                name: "FK_DashboardPreference_Users_UserId",
                table: "DashboardPreference");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DashboardPreference",
                table: "DashboardPreference");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AIPreference",
                table: "AIPreference");

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

            migrationBuilder.RenameColumn(
                name: "IsAIEnabled",
                table: "AIPreferences",
                newName: "RiskAnalysisEnabled");

            migrationBuilder.RenameColumn(
                name: "EnableRiskAnalysis",
                table: "AIPreferences",
                newName: "RecommendationsEnabled");

            migrationBuilder.RenameColumn(
                name: "EnableRecommendations",
                table: "AIPreferences",
                newName: "AIEnabled");

            migrationBuilder.RenameColumn(
                name: "EnableNotifications",
                table: "AIPreferences",
                newName: "AIAlertsEnabled");

            migrationBuilder.RenameIndex(
                name: "IX_AIPreference_UserId",
                table: "AIPreferences",
                newName: "IX_AIPreferences_UserId");

            migrationBuilder.AddColumn<Guid>(
                name: "ContributorSubTypeId1",
                table: "TeamMembers",
                type: "uuid",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "DefaultView",
                table: "DashboardPreferences",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(50)",
                oldMaxLength: 50);

            migrationBuilder.AlterColumn<string>(
                name: "DefaultFilter",
                table: "DashboardPreferences",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(50)",
                oldMaxLength: 50);

            migrationBuilder.AlterColumn<string>(
                name: "SuggestionApprovalMode",
                table: "AIPreferences",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(50)",
                oldMaxLength: 50);

            migrationBuilder.AddPrimaryKey(
                name: "PK_DashboardPreferences",
                table: "DashboardPreferences",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AIPreferences",
                table: "AIPreferences",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_TeamMembers_ContributorSubTypeId1",
                table: "TeamMembers",
                column: "ContributorSubTypeId1");

            migrationBuilder.AddForeignKey(
                name: "FK_TeamMembers_ContributorSubTypes_ContributorSubTypeId1",
                table: "TeamMembers",
                column: "ContributorSubTypeId1",
                principalTable: "ContributorSubTypes",
                principalColumn: "Id");
        }
    }
}
