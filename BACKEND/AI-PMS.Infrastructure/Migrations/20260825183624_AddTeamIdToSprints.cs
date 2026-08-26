using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AI_PMS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddTeamIdToSprints : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "TeamId",
                table: "Sprints",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ProjectSpecifications",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ProjectId = table.Column<Guid>(type: "uuid", nullable: false),
                    Objectives = table.Column<string>(type: "character varying(5000)", maxLength: 5000, nullable: false),
                    Scope = table.Column<string>(type: "character varying(5000)", maxLength: 5000, nullable: false),
                    FunctionalRequirements = table.Column<string>(type: "character varying(10000)", maxLength: 10000, nullable: false),
                    NonFunctionalRequirements = table.Column<string>(type: "character varying(10000)", maxLength: 10000, nullable: false),
                    Deliverables = table.Column<string>(type: "character varying(5000)", maxLength: 5000, nullable: false),
                    TechnologyStack = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: false),
                    Assumptions = table.Column<string>(type: "character varying(5000)", maxLength: 5000, nullable: true),
                    Constraints = table.Column<string>(type: "character varying(5000)", maxLength: 5000, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ProjectId1 = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectSpecifications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProjectSpecifications_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProjectSpecifications_Projects_ProjectId1",
                        column: x => x.ProjectId1,
                        principalTable: "Projects",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProjectSpecifications_ProjectId",
                table: "ProjectSpecifications",
                column: "ProjectId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProjectSpecifications_ProjectId1",
                table: "ProjectSpecifications",
                column: "ProjectId1",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProjectSpecifications");

            migrationBuilder.DropColumn(
                name: "TeamId",
                table: "Sprints");
        }
    }
}
