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

            migrationBuilder.DropColumn(
                name: "ContributorSubTypeId1",
                table: "TeamMembers");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "ContributorSubTypeId1",
                table: "TeamMembers",
                type: "uuid",
                nullable: true);

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