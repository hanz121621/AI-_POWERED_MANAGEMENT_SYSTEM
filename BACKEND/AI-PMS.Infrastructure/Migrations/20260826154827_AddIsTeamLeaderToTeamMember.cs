using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AI_PMS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddIsTeamLeaderToTeamMember : Migration
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
