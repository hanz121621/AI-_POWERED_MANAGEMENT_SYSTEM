using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AI_PMS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddTeamLeaderToTeamMembers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProjectSpecifications_Projects_ProjectId1",
                table: "ProjectSpecifications");

            migrationBuilder.DropIndex(
                name: "IX_ProjectSpecifications_ProjectId1",
                table: "ProjectSpecifications");

            migrationBuilder.DropColumn(
                name: "ProjectId1",
                table: "ProjectSpecifications");

            migrationBuilder.AddColumn<bool>(
                name: "IsTeamLeader",
                table: "TeamMembers",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsTeamLeader",
                table: "TeamMembers");

            migrationBuilder.AddColumn<Guid>(
                name: "ProjectId1",
                table: "ProjectSpecifications",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProjectSpecifications_ProjectId1",
                table: "ProjectSpecifications",
                column: "ProjectId1",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectSpecifications_Projects_ProjectId1",
                table: "ProjectSpecifications",
                column: "ProjectId1",
                principalTable: "Projects",
                principalColumn: "Id");
        }
    }
}
