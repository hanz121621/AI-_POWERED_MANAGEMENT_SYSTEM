using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AI_PMS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddWhateverWeChanged : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Budget",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "ClientName",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Projects");

            migrationBuilder.RenameColumn(
                name: "Title",
                table: "Projects",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "EndDate",
                table: "Projects",
                newName: "Deadline");

            migrationBuilder.RenameColumn(
                name: "CreatedBy",
                table: "Projects",
                newName: "StatusId");

            migrationBuilder.RenameColumn(
                name: "AssignedManagerId",
                table: "Projects",
                newName: "TeamId");

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Projects",
                type: "character varying(2000)",
                maxLength: 2000,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<DateTime>(
                name: "ArchivedAt",
                table: "Projects",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CompletedAt",
                table: "Projects",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ManagerId",
                table: "Projects",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "ProgressPercentage",
                table: "Projects",
                type: "numeric(5,2)",
                precision: 5,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.CreateTable(
                name: "ProjectStatusDefinitions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    DisplayOrder = table.Column<int>(type: "integer", nullable: false),
                    IsInitialStatus = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    IsApprovedStatus = table.Column<bool>(type: "boolean", nullable: false),
                    IsRejectedStatus = table.Column<bool>(type: "boolean", nullable: false),
                    IsCompletedStatus = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    IsArchivedStatus = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    IsCancelledStatus = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectStatusDefinitions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ProjectStatusTransitions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    FromStatusId = table.Column<Guid>(type: "uuid", nullable: false),
                    ToStatusId = table.Column<Guid>(type: "uuid", nullable: false),
                    IsAllowed = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ProjectId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectStatusTransitions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProjectStatusTransitions_ProjectStatusDefinitions_FromStatu~",
                        column: x => x.FromStatusId,
                        principalTable: "ProjectStatusDefinitions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ProjectStatusTransitions_ProjectStatusDefinitions_ToStatusId",
                        column: x => x.ToStatusId,
                        principalTable: "ProjectStatusDefinitions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ProjectStatusTransitions_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Projects_ManagerId",
                table: "Projects",
                column: "ManagerId");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_Name",
                table: "Projects",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Projects_StatusId",
                table: "Projects",
                column: "StatusId");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_TeamId",
                table: "Projects",
                column: "TeamId");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStatusDefinitions_DisplayOrder",
                table: "ProjectStatusDefinitions",
                column: "DisplayOrder");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStatusDefinitions_IsActive",
                table: "ProjectStatusDefinitions",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStatusDefinitions_IsInitialStatus",
                table: "ProjectStatusDefinitions",
                column: "IsInitialStatus");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStatusDefinitions_Name",
                table: "ProjectStatusDefinitions",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStatusTransitions_FromStatusId",
                table: "ProjectStatusTransitions",
                column: "FromStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStatusTransitions_FromStatusId_ToStatusId",
                table: "ProjectStatusTransitions",
                columns: new[] { "FromStatusId", "ToStatusId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStatusTransitions_IsAllowed",
                table: "ProjectStatusTransitions",
                column: "IsAllowed");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStatusTransitions_ProjectId",
                table: "ProjectStatusTransitions",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStatusTransitions_ToStatusId",
                table: "ProjectStatusTransitions",
                column: "ToStatusId");

            migrationBuilder.AddForeignKey(
                name: "FK_Projects_ProjectStatusDefinitions_StatusId",
                table: "Projects",
                column: "StatusId",
                principalTable: "ProjectStatusDefinitions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Projects_ProjectStatusDefinitions_StatusId",
                table: "Projects");

            migrationBuilder.DropTable(
                name: "ProjectStatusTransitions");

            migrationBuilder.DropTable(
                name: "ProjectStatusDefinitions");

            migrationBuilder.DropIndex(
                name: "IX_Projects_ManagerId",
                table: "Projects");

            migrationBuilder.DropIndex(
                name: "IX_Projects_Name",
                table: "Projects");

            migrationBuilder.DropIndex(
                name: "IX_Projects_StatusId",
                table: "Projects");

            migrationBuilder.DropIndex(
                name: "IX_Projects_TeamId",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "ArchivedAt",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "CompletedAt",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "ManagerId",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "ProgressPercentage",
                table: "Projects");

            migrationBuilder.RenameColumn(
                name: "TeamId",
                table: "Projects",
                newName: "AssignedManagerId");

            migrationBuilder.RenameColumn(
                name: "StatusId",
                table: "Projects",
                newName: "CreatedBy");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Projects",
                newName: "Title");

            migrationBuilder.RenameColumn(
                name: "Deadline",
                table: "Projects",
                newName: "EndDate");

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Projects",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "character varying(2000)",
                oldMaxLength: 2000,
                oldNullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Budget",
                table: "Projects",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "ClientName",
                table: "Projects",
                type: "character varying(150)",
                maxLength: 150,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Projects",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
