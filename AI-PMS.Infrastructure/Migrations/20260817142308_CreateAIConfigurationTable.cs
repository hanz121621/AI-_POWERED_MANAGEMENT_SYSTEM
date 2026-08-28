using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AI_PMS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class CreateAIConfigurationTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AIConfigurations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    IsAIEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    EnableRecommendations = table.Column<bool>(type: "boolean", nullable: false),
                    EnableRiskPrediction = table.Column<bool>(type: "boolean", nullable: false),
                    AnalysisFrequencyMinutes = table.Column<int>(type: "integer", nullable: false),
                    EnableNotifications = table.Column<bool>(type: "boolean", nullable: false),
                    Model = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AIConfigurations", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AIConfigurations");
        }
    }
}
