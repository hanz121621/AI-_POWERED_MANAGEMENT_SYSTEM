using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace AI_PMS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class CreateActivityLogs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "ContributorSubTypes",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333333"));

            migrationBuilder.DeleteData(
                table: "ContributorSubTypes",
                keyColumn: "Id",
                keyValue: new Guid("44444444-4444-4444-4444-444444444444"));

            migrationBuilder.DeleteData(
                table: "ContributorSubTypes",
                keyColumn: "Id",
                keyValue: new Guid("55555555-5555-5555-5555-555555555555"));

            migrationBuilder.DeleteData(
                table: "ContributorSubTypes",
                keyColumn: "Id",
                keyValue: new Guid("66666666-6666-6666-6666-666666666666"));

            migrationBuilder.DeleteData(
                table: "ContributorSubTypes",
                keyColumn: "Id",
                keyValue: new Guid("77777777-7777-7777-7777-777777777777"));

            migrationBuilder.DeleteData(
                table: "ContributorSubTypes",
                keyColumn: "Id",
                keyValue: new Guid("88888888-8888-8888-8888-888888888888"));

            migrationBuilder.DeleteData(
                table: "ContributorSubTypes",
                keyColumn: "Id",
                keyValue: new Guid("99999999-9999-9999-9999-999999999999"));

            migrationBuilder.InsertData(
                table: "ContributorSubTypes",
                columns: new[] { "Id", "ContributorTypeId", "CreatedAt", "Description", "IsActive", "Name", "UpdatedAt" },
                values: new object[,]
                {
                    { new Guid("11111111-1111-1111-1111-111111111112"), new Guid("11111111-1111-1111-1111-111111111111"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Develops user interfaces and frontend applications.", true, "Frontend Developer", null },
                    { new Guid("11111111-1111-1111-1111-111111111113"), new Guid("11111111-1111-1111-1111-111111111111"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Develops APIs, services, databases and backend systems.", true, "Backend Developer", null },
                    { new Guid("11111111-1111-1111-1111-111111111114"), new Guid("11111111-1111-1111-1111-111111111111"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Works across frontend and backend development.", true, "Full Stack Developer", null },
                    { new Guid("11111111-1111-1111-1111-111111111115"), new Guid("11111111-1111-1111-1111-111111111111"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Other developer specialization.", true, "Other", null },
                    { new Guid("22222222-2222-2222-2222-222222222223"), new Guid("22222222-2222-2222-2222-222222222222"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Human resources and employee management.", true, "Human Resources", null },
                    { new Guid("22222222-2222-2222-2222-222222222224"), new Guid("22222222-2222-2222-2222-222222222222"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Financial and accounting responsibilities.", true, "Finance", null },
                    { new Guid("22222222-2222-2222-2222-222222222225"), new Guid("22222222-2222-2222-2222-222222222222"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Administrative and organizational responsibilities.", true, "Administration", null },
                    { new Guid("22222222-2222-2222-2222-222222222226"), new Guid("22222222-2222-2222-2222-222222222222"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Other staff specialization.", true, "Other", null }
                });

            migrationBuilder.UpdateData(
                table: "ContributorTypes",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "Description",
                value: "Software development and technical roles.");

            migrationBuilder.UpdateData(
                table: "ContributorTypes",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222222"),
                column: "Description",
                value: "Administrative and support roles.");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "ContributorSubTypes",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111112"));

            migrationBuilder.DeleteData(
                table: "ContributorSubTypes",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111113"));

            migrationBuilder.DeleteData(
                table: "ContributorSubTypes",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111114"));

            migrationBuilder.DeleteData(
                table: "ContributorSubTypes",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111115"));

            migrationBuilder.DeleteData(
                table: "ContributorSubTypes",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222223"));

            migrationBuilder.DeleteData(
                table: "ContributorSubTypes",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222224"));

            migrationBuilder.DeleteData(
                table: "ContributorSubTypes",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222225"));

            migrationBuilder.DeleteData(
                table: "ContributorSubTypes",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222226"));

            migrationBuilder.InsertData(
                table: "ContributorSubTypes",
                columns: new[] { "Id", "ContributorTypeId", "CreatedAt", "Description", "IsActive", "Name", "UpdatedAt" },
                values: new object[,]
                {
                    { new Guid("33333333-3333-3333-3333-333333333333"), new Guid("11111111-1111-1111-1111-111111111111"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Responsible for frontend development", true, "Frontend Developer", null },
                    { new Guid("44444444-4444-4444-4444-444444444444"), new Guid("11111111-1111-1111-1111-111111111111"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Responsible for backend development", true, "Backend Developer", null },
                    { new Guid("55555555-5555-5555-5555-555555555555"), new Guid("11111111-1111-1111-1111-111111111111"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Responsible for frontend and backend development", true, "Full Stack Developer", null },
                    { new Guid("66666666-6666-6666-6666-666666666666"), new Guid("11111111-1111-1111-1111-111111111111"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Responsible for mobile application development", true, "Mobile Developer", null },
                    { new Guid("77777777-7777-7777-7777-777777777777"), new Guid("22222222-2222-2222-2222-222222222222"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Responsible for quality assurance and testing", true, "QA", null },
                    { new Guid("88888888-8888-8888-8888-888888888888"), new Guid("22222222-2222-2222-2222-222222222222"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Responsible for user interface and experience design", true, "UI/UX Designer", null },
                    { new Guid("99999999-9999-9999-9999-999999999999"), new Guid("22222222-2222-2222-2222-222222222222"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Responsible for requirements and business analysis", true, "Business Analyst", null }
                });

            migrationBuilder.UpdateData(
                table: "ContributorTypes",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "Description",
                value: "Software development contributor");

            migrationBuilder.UpdateData(
                table: "ContributorTypes",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222222"),
                column: "Description",
                value: "Non-developer project staff");
        }
    }
}
