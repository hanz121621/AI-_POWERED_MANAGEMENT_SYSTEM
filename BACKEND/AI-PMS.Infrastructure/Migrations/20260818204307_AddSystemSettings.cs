using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AI_PMS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddSystemSettings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SystemSettings",
                columns: table => new
                {
                    Id = table.Column<Guid>(
                        type: "uuid",
                        nullable: false),

                    SystemName = table.Column<string>(
                        type: "text",
                        nullable: false),

                    DefaultLanguage = table.Column<string>(
                        type: "text",
                        nullable: false),

                    DateTimeFormat = table.Column<string>(
                        type: "text",
                        nullable: false),

                    AllowUserRegistration = table.Column<bool>(
                        type: "boolean",
                        nullable: false),

                    SessionTimeoutMinutes = table.Column<int>(
                        type: "integer",
                        nullable: false),

                    MaxFileUploadSizeMb = table.Column<long>(
                        type: "bigint",
                        nullable: false),

                    MaintenanceMode = table.Column<bool>(
                        type: "boolean",
                        nullable: false),

                    CreatedAt = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: false),

                    UpdatedAt = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey(
                        "PK_SystemSettings",
                        x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SystemSettings");
        }
    }
}