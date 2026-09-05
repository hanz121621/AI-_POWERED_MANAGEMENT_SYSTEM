using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AI_PMS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddTaskItemAndPendingChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RiskIssues_Tasks_TaskId",
                table: "RiskIssues");

            migrationBuilder.DropForeignKey(
                name: "FK_Tasks_Sprints_SprintId",
                table: "Tasks");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Tasks",
                table: "Tasks");

            migrationBuilder.RenameTable(
                name: "Tasks",
                newName: "TaskItem");

            migrationBuilder.RenameIndex(
                name: "IX_Tasks_SprintId",
                table: "TaskItem",
                newName: "IX_TaskItem_SprintId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TaskItem",
                table: "TaskItem",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_RiskIssues_TaskItem_TaskId",
                table: "RiskIssues",
                column: "TaskId",
                principalTable: "TaskItem",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_TaskItem_Sprints_SprintId",
                table: "TaskItem",
                column: "SprintId",
                principalTable: "Sprints",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RiskIssues_TaskItem_TaskId",
                table: "RiskIssues");

            migrationBuilder.DropForeignKey(
                name: "FK_TaskItem_Sprints_SprintId",
                table: "TaskItem");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TaskItem",
                table: "TaskItem");

            migrationBuilder.RenameTable(
                name: "TaskItem",
                newName: "Tasks");

            migrationBuilder.RenameIndex(
                name: "IX_TaskItem_SprintId",
                table: "Tasks",
                newName: "IX_Tasks_SprintId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Tasks",
                table: "Tasks",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_RiskIssues_Tasks_TaskId",
                table: "RiskIssues",
                column: "TaskId",
                principalTable: "Tasks",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Tasks_Sprints_SprintId",
                table: "Tasks",
                column: "SprintId",
                principalTable: "Sprints",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
