using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AI_PMS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAISubTaskStatusAndProgress : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Progress",
                table: "SubTasks",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "SubTasks",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Progress",
                table: "SubTasks");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "SubTasks");
        }
    }
}
