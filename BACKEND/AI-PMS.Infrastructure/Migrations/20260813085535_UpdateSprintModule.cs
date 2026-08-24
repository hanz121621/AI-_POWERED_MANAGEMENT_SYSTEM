using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AI_PMS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateSprintModule : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Priority was previously stored as timestamp.
            // Existing values are NULL, so safely replace the column with integer.
            migrationBuilder.Sql(
                """
                ALTER TABLE "Sprints"
                DROP COLUMN "Priority";
                """);

            migrationBuilder.AddColumn<int>(
                name: "Priority",
                table: "Sprints",
                type: "integer",
                nullable: false,
                defaultValue: 2);

            migrationBuilder.AddColumn<Guid>(
                name: "CreatedBy",
                table: "Tasks",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "CreatedBy",
                table: "Sprints",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Sprints",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Priority",
                table: "Sprints");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Tasks");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Sprints");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Sprints");

            migrationBuilder.AddColumn<DateTime>(
                name: "Priority",
                table: "Sprints",
                type: "timestamp with time zone",
                nullable: true);
        }
    }
}