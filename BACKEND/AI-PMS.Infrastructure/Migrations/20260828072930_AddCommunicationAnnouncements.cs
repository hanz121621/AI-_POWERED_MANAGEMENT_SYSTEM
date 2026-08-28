using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AI_PMS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCommunicationAnnouncements : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ProjectAnnouncements",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ProjectId = table.Column<Guid>(type: "uuid", nullable: false),
                    TeamId = table.Column<Guid>(type: "uuid", nullable: true),
                    SenderId = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Message = table.Column<string>(type: "character varying(5000)", maxLength: 5000, nullable: false),
                    PriorityId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectAnnouncements", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProjectAnnouncements_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProjectAnnouncements_Teams_TeamId",
                        column: x => x.TeamId,
                        principalTable: "Teams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_ProjectAnnouncements_Users_SenderId",
                        column: x => x.SenderId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ProjectAnnouncementRecipients",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    AnnouncementId = table.Column<Guid>(type: "uuid", nullable: false),
                    RecipientUserId = table.Column<Guid>(type: "uuid", nullable: false),
                    NotificationSent = table.Column<bool>(type: "boolean", nullable: false),
                    NotificationSentAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectAnnouncementRecipients", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProjectAnnouncementRecipients_ProjectAnnouncements_Announce~",
                        column: x => x.AnnouncementId,
                        principalTable: "ProjectAnnouncements",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProjectAnnouncementRecipients_Users_RecipientUserId",
                        column: x => x.RecipientUserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAnnouncementRecipients_AnnouncementId_RecipientUserId",
                table: "ProjectAnnouncementRecipients",
                columns: new[] { "AnnouncementId", "RecipientUserId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAnnouncementRecipients_RecipientUserId",
                table: "ProjectAnnouncementRecipients",
                column: "RecipientUserId");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAnnouncements_ProjectId",
                table: "ProjectAnnouncements",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAnnouncements_SenderId",
                table: "ProjectAnnouncements",
                column: "SenderId");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAnnouncements_TeamId",
                table: "ProjectAnnouncements",
                column: "TeamId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProjectAnnouncementRecipients");

            migrationBuilder.DropTable(
                name: "ProjectAnnouncements");
        }
    }
}
