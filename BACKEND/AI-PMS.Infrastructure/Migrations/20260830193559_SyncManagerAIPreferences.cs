using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AI_PMS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SyncManagerAIPreferences : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MessageMentions_Users_MentionedUserId",
                table: "MessageMentions");

            migrationBuilder.AlterColumn<Guid>(
                name: "MessageId",
                table: "MessageMentions",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AddColumn<Guid>(
                name: "TaskCommentId",
                table: "MessageMentions",
                type: "uuid",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "AINotificationPriority",
                table: "AIPreferences",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.CreateIndex(
                name: "IX_MessageMentions_TaskCommentId",
                table: "MessageMentions",
                column: "TaskCommentId");

            migrationBuilder.AddForeignKey(
                name: "FK_MessageMentions_TaskComments_TaskCommentId",
                table: "MessageMentions",
                column: "TaskCommentId",
                principalTable: "TaskComments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MessageMentions_Users_MentionedUserId",
                table: "MessageMentions",
                column: "MentionedUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MessageMentions_TaskComments_TaskCommentId",
                table: "MessageMentions");

            migrationBuilder.DropForeignKey(
                name: "FK_MessageMentions_Users_MentionedUserId",
                table: "MessageMentions");

            migrationBuilder.DropIndex(
                name: "IX_MessageMentions_TaskCommentId",
                table: "MessageMentions");

            migrationBuilder.DropColumn(
                name: "TaskCommentId",
                table: "MessageMentions");

            migrationBuilder.AlterColumn<Guid>(
                name: "MessageId",
                table: "MessageMentions",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "AINotificationPriority",
                table: "AIPreferences",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(20)",
                oldMaxLength: 20);

            migrationBuilder.AddForeignKey(
                name: "FK_MessageMentions_Users_MentionedUserId",
                table: "MessageMentions",
                column: "MentionedUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
