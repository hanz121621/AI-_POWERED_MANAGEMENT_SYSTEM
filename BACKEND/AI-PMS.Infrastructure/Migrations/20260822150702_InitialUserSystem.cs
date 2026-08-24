using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AI_PMS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialUserSystem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TeamMembers_ContributorSubTypes_ContributorSubTypeId",
                table: "TeamMembers");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_ContributorTypeDefinitions_ContributorTypeDefinitionId",
                table: "Users");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_DeveloperSpecializations_DeveloperSpecializationId",
                table: "Users");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_StaffSpecializations_StaffSpecializationId",
                table: "Users");

            migrationBuilder.DropTable(
                name: "ContributorTypeDefinitions");

            migrationBuilder.DropTable(
                name: "DeveloperSpecializations");

            migrationBuilder.DropTable(
                name: "StaffSpecializations");

            migrationBuilder.DropIndex(
                name: "IX_Users_ContributorTypeDefinitionId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_ContributorSubTypes_ContributorTypeId",
                table: "ContributorSubTypes");

            migrationBuilder.DropColumn(
                name: "ContributorTypeDefinitionId",
                table: "Users");

            migrationBuilder.RenameColumn(
                name: "StaffSpecializationId",
                table: "Users",
                newName: "ContributorTypeId");

            migrationBuilder.RenameColumn(
                name: "DeveloperSpecializationId",
                table: "Users",
                newName: "ContributorSubTypeId");

            migrationBuilder.RenameIndex(
                name: "IX_Users_StaffSpecializationId",
                table: "Users",
                newName: "IX_Users_ContributorTypeId");

            migrationBuilder.RenameIndex(
                name: "IX_Users_DeveloperSpecializationId",
                table: "Users",
                newName: "IX_Users_ContributorSubTypeId");

            migrationBuilder.AddColumn<Guid>(
                name: "ContributorSubTypeId1",
                table: "TeamMembers",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_TeamMembers_ContributorSubTypeId1",
                table: "TeamMembers",
                column: "ContributorSubTypeId1");

            migrationBuilder.CreateIndex(
                name: "IX_ContributorTypes_Name",
                table: "ContributorTypes",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ContributorSubTypes_ContributorTypeId_Name",
                table: "ContributorSubTypes",
                columns: new[] { "ContributorTypeId", "Name" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_TeamMembers_ContributorSubTypes_ContributorSubTypeId",
                table: "TeamMembers",
                column: "ContributorSubTypeId",
                principalTable: "ContributorSubTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TeamMembers_ContributorSubTypes_ContributorSubTypeId1",
                table: "TeamMembers",
                column: "ContributorSubTypeId1",
                principalTable: "ContributorSubTypes",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_ContributorSubTypes_ContributorSubTypeId",
                table: "Users",
                column: "ContributorSubTypeId",
                principalTable: "ContributorSubTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_ContributorTypes_ContributorTypeId",
                table: "Users",
                column: "ContributorTypeId",
                principalTable: "ContributorTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TeamMembers_ContributorSubTypes_ContributorSubTypeId",
                table: "TeamMembers");

            migrationBuilder.DropForeignKey(
                name: "FK_TeamMembers_ContributorSubTypes_ContributorSubTypeId1",
                table: "TeamMembers");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_ContributorSubTypes_ContributorSubTypeId",
                table: "Users");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_ContributorTypes_ContributorTypeId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_TeamMembers_ContributorSubTypeId1",
                table: "TeamMembers");

            migrationBuilder.DropIndex(
                name: "IX_ContributorTypes_Name",
                table: "ContributorTypes");

            migrationBuilder.DropIndex(
                name: "IX_ContributorSubTypes_ContributorTypeId_Name",
                table: "ContributorSubTypes");

            migrationBuilder.DropColumn(
                name: "ContributorSubTypeId1",
                table: "TeamMembers");

            migrationBuilder.RenameColumn(
                name: "ContributorTypeId",
                table: "Users",
                newName: "StaffSpecializationId");

            migrationBuilder.RenameColumn(
                name: "ContributorSubTypeId",
                table: "Users",
                newName: "DeveloperSpecializationId");

            migrationBuilder.RenameIndex(
                name: "IX_Users_ContributorTypeId",
                table: "Users",
                newName: "IX_Users_StaffSpecializationId");

            migrationBuilder.RenameIndex(
                name: "IX_Users_ContributorSubTypeId",
                table: "Users",
                newName: "IX_Users_DeveloperSpecializationId");

            migrationBuilder.AddColumn<Guid>(
                name: "ContributorTypeDefinitionId",
                table: "Users",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ContributorTypeDefinitions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContributorTypeDefinitions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DeveloperSpecializations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    Name = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DeveloperSpecializations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "StaffSpecializations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    Name = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StaffSpecializations", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Users_ContributorTypeDefinitionId",
                table: "Users",
                column: "ContributorTypeDefinitionId");

            migrationBuilder.CreateIndex(
                name: "IX_ContributorSubTypes_ContributorTypeId",
                table: "ContributorSubTypes",
                column: "ContributorTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_ContributorTypeDefinitions_Name",
                table: "ContributorTypeDefinitions",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DeveloperSpecializations_Name",
                table: "DeveloperSpecializations",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_StaffSpecializations_Name",
                table: "StaffSpecializations",
                column: "Name",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_TeamMembers_ContributorSubTypes_ContributorSubTypeId",
                table: "TeamMembers",
                column: "ContributorSubTypeId",
                principalTable: "ContributorSubTypes",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_ContributorTypeDefinitions_ContributorTypeDefinitionId",
                table: "Users",
                column: "ContributorTypeDefinitionId",
                principalTable: "ContributorTypeDefinitions",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_DeveloperSpecializations_DeveloperSpecializationId",
                table: "Users",
                column: "DeveloperSpecializationId",
                principalTable: "DeveloperSpecializations",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_StaffSpecializations_StaffSpecializationId",
                table: "Users",
                column: "StaffSpecializationId",
                principalTable: "StaffSpecializations",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
