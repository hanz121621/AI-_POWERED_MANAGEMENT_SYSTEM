using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AI_PMS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddTeamContributorTypes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "ContributorSubTypeId",
                table: "TeamMembers",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ContributorTypeId",
                table: "TeamMembers",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "ContributorTypes",
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
                    table.PrimaryKey("PK_ContributorTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ContributorSubTypes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    ContributorTypeId = table.Column<Guid>(type: "uuid", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContributorSubTypes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ContributorSubTypes_ContributorTypes_ContributorTypeId",
                        column: x => x.ContributorTypeId,
                        principalTable: "ContributorTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TeamMembers_ContributorSubTypeId",
                table: "TeamMembers",
                column: "ContributorSubTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_TeamMembers_ContributorTypeId",
                table: "TeamMembers",
                column: "ContributorTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_ContributorSubTypes_ContributorTypeId",
                table: "ContributorSubTypes",
                column: "ContributorTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_TeamMembers_ContributorSubTypes_ContributorSubTypeId",
                table: "TeamMembers",
                column: "ContributorSubTypeId",
                principalTable: "ContributorSubTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TeamMembers_ContributorTypes_ContributorTypeId",
                table: "TeamMembers",
                column: "ContributorTypeId",
                principalTable: "ContributorTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TeamMembers_ContributorSubTypes_ContributorSubTypeId",
                table: "TeamMembers");

            migrationBuilder.DropForeignKey(
                name: "FK_TeamMembers_ContributorTypes_ContributorTypeId",
                table: "TeamMembers");

            migrationBuilder.DropTable(
                name: "ContributorSubTypes");

            migrationBuilder.DropTable(
                name: "ContributorTypes");

            migrationBuilder.DropIndex(
                name: "IX_TeamMembers_ContributorSubTypeId",
                table: "TeamMembers");

            migrationBuilder.DropIndex(
                name: "IX_TeamMembers_ContributorTypeId",
                table: "TeamMembers");

            migrationBuilder.DropColumn(
                name: "ContributorSubTypeId",
                table: "TeamMembers");

            migrationBuilder.DropColumn(
                name: "ContributorTypeId",
                table: "TeamMembers");
        }
    }
}
