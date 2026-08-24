using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AI_PMS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddContributorTypes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ContributorSubTypes_ContributorTypes_ContributorTypeId",
                table: "ContributorSubTypes");

            migrationBuilder.DropForeignKey(
                name: "FK_TeamMembers_ContributorSubTypes_ContributorSubTypeId",
                table: "TeamMembers");

            migrationBuilder.AddForeignKey(
                name: "FK_ContributorSubTypes_ContributorTypes_ContributorTypeId",
                table: "ContributorSubTypes",
                column: "ContributorTypeId",
                principalTable: "ContributorTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TeamMembers_ContributorSubTypes_ContributorSubTypeId",
                table: "TeamMembers",
                column: "ContributorSubTypeId",
                principalTable: "ContributorSubTypes",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ContributorSubTypes_ContributorTypes_ContributorTypeId",
                table: "ContributorSubTypes");

            migrationBuilder.DropForeignKey(
                name: "FK_TeamMembers_ContributorSubTypes_ContributorSubTypeId",
                table: "TeamMembers");

            migrationBuilder.AddForeignKey(
                name: "FK_ContributorSubTypes_ContributorTypes_ContributorTypeId",
                table: "ContributorSubTypes",
                column: "ContributorTypeId",
                principalTable: "ContributorTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TeamMembers_ContributorSubTypes_ContributorSubTypeId",
                table: "TeamMembers",
                column: "ContributorSubTypeId",
                principalTable: "ContributorSubTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
