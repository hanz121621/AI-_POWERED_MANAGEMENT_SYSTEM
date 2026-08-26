CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL,
    CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId")
);

START TRANSACTION;
CREATE TABLE "Users" (
    "Id" uuid NOT NULL,
    "FullName" character varying(100) NOT NULL,
    "Email" character varying(150) NOT NULL,
    "PasswordHash" text NOT NULL,
    "Role" integer NOT NULL,
    "IsActive" boolean NOT NULL,
    "PhoneNumber" character varying(20),
    "ProfileImage" text,
    "Bio" character varying(500),
    "PasswordResetToken" text,
    "PasswordResetTokenExpiry" timestamp with time zone,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_Users" PRIMARY KEY ("Id")
);

CREATE TABLE "RefreshTokens" (
    "Id" uuid NOT NULL,
    "Token" text NOT NULL,
    "ExpiresAt" timestamp with time zone NOT NULL,
    "IsRevoked" boolean NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UserId" uuid NOT NULL,
    CONSTRAINT "PK_RefreshTokens" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_RefreshTokens_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
);

CREATE INDEX "IX_RefreshTokens_UserId" ON "RefreshTokens" ("UserId");

CREATE UNIQUE INDEX "IX_Users_Email" ON "Users" ("Email");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260803164910_InitialCreate', '10.0.11');

COMMIT;

START TRANSACTION;
CREATE TABLE "Projects" (
    "Id" uuid NOT NULL,
    "Title" character varying(200) NOT NULL,
    "Description" text NOT NULL,
    "ClientName" character varying(150) NOT NULL,
    "Budget" numeric NOT NULL,
    "StartDate" timestamp with time zone NOT NULL,
    "EndDate" timestamp with time zone NOT NULL,
    "Status" integer NOT NULL,
    "Priority" integer NOT NULL,
    "CreatedBy" uuid NOT NULL,
    "AssignedManagerId" uuid,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_Projects" PRIMARY KEY ("Id")
);

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260806072712_AddProjectModule', '10.0.11');

COMMIT;

START TRANSACTION;
CREATE TABLE "Sprints" (
    "Id" uuid NOT NULL,
    "ProjectId" uuid NOT NULL,
    "Name" character varying(150) NOT NULL,
    "Goal" character varying(500) NOT NULL,
    "StartDate" timestamp with time zone NOT NULL,
    "EndDate" timestamp with time zone NOT NULL,
    "Status" integer NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_Sprints" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_Sprints_Projects_ProjectId" FOREIGN KEY ("ProjectId") REFERENCES "Projects" ("Id") ON DELETE CASCADE
);

CREATE INDEX "IX_Sprints_ProjectId" ON "Sprints" ("ProjectId");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260806115804_AddSprintModule', '10.0.11');

COMMIT;

START TRANSACTION;
ALTER TABLE "Sprints" ADD "Priority" timestamp with time zone;

CREATE TABLE "Tasks" (
    "Id" uuid NOT NULL,
    "SprintId" uuid NOT NULL,
    "Title" character varying(200) NOT NULL,
    "Description" character varying(1000) NOT NULL,
    "AssignedDeveloperId" uuid,
    "Priority" integer NOT NULL,
    "Status" integer NOT NULL,
    "EstimatedHours" integer NOT NULL,
    "ActualHours" integer NOT NULL,
    "DueDate" timestamp with time zone NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_Tasks" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_Tasks_Sprints_SprintId" FOREIGN KEY ("SprintId") REFERENCES "Sprints" ("Id") ON DELETE CASCADE
);

CREATE UNIQUE INDEX "IX_Users_PhoneNumber" ON "Users" ("PhoneNumber");

CREATE INDEX "IX_Tasks_SprintId" ON "Tasks" ("SprintId");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260808142638_MakePhoneNumberUnique', '10.0.11');

COMMIT;

START TRANSACTION;
ALTER TABLE "Sprints"
DROP COLUMN "Priority";

ALTER TABLE "Sprints" ADD "Priority" integer NOT NULL DEFAULT 2;

ALTER TABLE "Tasks" ADD "CreatedBy" uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';

ALTER TABLE "Sprints" ADD "CreatedBy" uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';

ALTER TABLE "Sprints" ADD "IsDeleted" boolean NOT NULL DEFAULT FALSE;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260813085535_UpdateSprintModule', '10.0.11');

COMMIT;

START TRANSACTION;
ALTER TABLE "Users" ADD "ContributorTypeDefinitionId" uuid;

ALTER TABLE "Users" ADD "DeveloperSpecializationId" uuid;

ALTER TABLE "Users" ADD "StaffSpecializationId" uuid;

CREATE TABLE "ContributorTypeDefinitions" (
    "Id" uuid NOT NULL,
    "Name" character varying(100) NOT NULL,
    "Description" character varying(500),
    "IsActive" boolean NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_ContributorTypeDefinitions" PRIMARY KEY ("Id")
);

CREATE TABLE "DeveloperSpecializations" (
    "Id" uuid NOT NULL,
    "Name" character varying(150) NOT NULL,
    "Description" character varying(500),
    "IsActive" boolean NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_DeveloperSpecializations" PRIMARY KEY ("Id")
);

CREATE TABLE "Permissions" (
    "Id" uuid NOT NULL,
    "Name" character varying(150) NOT NULL,
    "Description" character varying(500),
    "IsActive" boolean NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_Permissions" PRIMARY KEY ("Id")
);

CREATE TABLE "StaffSpecializations" (
    "Id" uuid NOT NULL,
    "Name" character varying(150) NOT NULL,
    "Description" character varying(500),
    "IsActive" boolean NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_StaffSpecializations" PRIMARY KEY ("Id")
);

CREATE TABLE "SubTasks" (
    "Id" uuid NOT NULL,
    "TaskId" uuid NOT NULL,
    "Title" character varying(200) NOT NULL,
    "Description" character varying(1000) NOT NULL,
    "EstimatedHours" integer NOT NULL,
    "IsAIGenerated" boolean NOT NULL,
    "IsApproved" boolean NOT NULL,
    "IsDeleted" boolean NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    "DeletedAt" timestamp with time zone,
    CONSTRAINT "PK_SubTasks" PRIMARY KEY ("Id")
);

CREATE TABLE "Teams" (
    "Id" uuid NOT NULL,
    "Name" character varying(100) NOT NULL,
    "Description" character varying(500),
    "ManagerId" uuid,
    "IsActive" boolean NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_Teams" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_Teams_Users_ManagerId" FOREIGN KEY ("ManagerId") REFERENCES "Users" ("Id") ON DELETE SET NULL
);

CREATE TABLE "RolePermissions" (
    "Id" uuid NOT NULL,
    "Role" integer NOT NULL,
    "PermissionId" uuid NOT NULL,
    "IsEnabled" boolean NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_RolePermissions" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_RolePermissions_Permissions_PermissionId" FOREIGN KEY ("PermissionId") REFERENCES "Permissions" ("Id") ON DELETE CASCADE
);

CREATE TABLE "UserPermissions" (
    "Id" uuid NOT NULL,
    "UserId" uuid NOT NULL,
    "PermissionId" uuid NOT NULL,
    "IsEnabled" boolean NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_UserPermissions" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_UserPermissions_Permissions_PermissionId" FOREIGN KEY ("PermissionId") REFERENCES "Permissions" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_UserPermissions_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
);

CREATE TABLE "TeamMembers" (
    "Id" uuid NOT NULL,
    "TeamId" uuid NOT NULL,
    "UserId" uuid NOT NULL,
    "JoinedAt" timestamp with time zone NOT NULL,
    "IsActive" boolean NOT NULL,
    CONSTRAINT "PK_TeamMembers" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_TeamMembers_Teams_TeamId" FOREIGN KEY ("TeamId") REFERENCES "Teams" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_TeamMembers_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE RESTRICT
);

CREATE INDEX "IX_Users_ContributorTypeDefinitionId" ON "Users" ("ContributorTypeDefinitionId");

CREATE INDEX "IX_Users_DeveloperSpecializationId" ON "Users" ("DeveloperSpecializationId");

CREATE INDEX "IX_Users_StaffSpecializationId" ON "Users" ("StaffSpecializationId");

CREATE UNIQUE INDEX "IX_ContributorTypeDefinitions_Name" ON "ContributorTypeDefinitions" ("Name");

CREATE UNIQUE INDEX "IX_DeveloperSpecializations_Name" ON "DeveloperSpecializations" ("Name");

CREATE UNIQUE INDEX "IX_Permissions_Name" ON "Permissions" ("Name");

CREATE INDEX "IX_RolePermissions_PermissionId" ON "RolePermissions" ("PermissionId");

CREATE UNIQUE INDEX "IX_RolePermissions_Role_PermissionId" ON "RolePermissions" ("Role", "PermissionId");

CREATE UNIQUE INDEX "IX_StaffSpecializations_Name" ON "StaffSpecializations" ("Name");

CREATE UNIQUE INDEX "IX_TeamMembers_TeamId_UserId" ON "TeamMembers" ("TeamId", "UserId");

CREATE INDEX "IX_TeamMembers_UserId" ON "TeamMembers" ("UserId");

CREATE INDEX "IX_Teams_ManagerId" ON "Teams" ("ManagerId");

CREATE UNIQUE INDEX "IX_Teams_Name" ON "Teams" ("Name");

CREATE INDEX "IX_UserPermissions_PermissionId" ON "UserPermissions" ("PermissionId");

CREATE UNIQUE INDEX "IX_UserPermissions_UserId_PermissionId" ON "UserPermissions" ("UserId", "PermissionId");

ALTER TABLE "Users" ADD CONSTRAINT "FK_Users_ContributorTypeDefinitions_ContributorTypeDefinitionId" FOREIGN KEY ("ContributorTypeDefinitionId") REFERENCES "ContributorTypeDefinitions" ("Id") ON DELETE SET NULL;

ALTER TABLE "Users" ADD CONSTRAINT "FK_Users_DeveloperSpecializations_DeveloperSpecializationId" FOREIGN KEY ("DeveloperSpecializationId") REFERENCES "DeveloperSpecializations" ("Id") ON DELETE SET NULL;

ALTER TABLE "Users" ADD CONSTRAINT "FK_Users_StaffSpecializations_StaffSpecializationId" FOREIGN KEY ("StaffSpecializationId") REFERENCES "StaffSpecializations" ("Id") ON DELETE SET NULL;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260816073354_AddPermissionAndContributorModule', '10.0.11');

COMMIT;

START TRANSACTION;
ALTER TABLE "TeamMembers" ADD "ContributorSubTypeId" uuid;

ALTER TABLE "TeamMembers" ADD "ContributorTypeId" uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';

CREATE TABLE "ContributorTypes" (
    "Id" uuid NOT NULL,
    "Name" character varying(100) NOT NULL,
    "Description" character varying(500),
    "IsActive" boolean NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_ContributorTypes" PRIMARY KEY ("Id")
);

CREATE TABLE "ContributorSubTypes" (
    "Id" uuid NOT NULL,
    "Name" character varying(100) NOT NULL,
    "Description" character varying(500),
    "ContributorTypeId" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_ContributorSubTypes" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_ContributorSubTypes_ContributorTypes_ContributorTypeId" FOREIGN KEY ("ContributorTypeId") REFERENCES "ContributorTypes" ("Id") ON DELETE CASCADE
);

CREATE INDEX "IX_TeamMembers_ContributorSubTypeId" ON "TeamMembers" ("ContributorSubTypeId");

CREATE INDEX "IX_TeamMembers_ContributorTypeId" ON "TeamMembers" ("ContributorTypeId");

CREATE INDEX "IX_ContributorSubTypes_ContributorTypeId" ON "ContributorSubTypes" ("ContributorTypeId");

ALTER TABLE "TeamMembers" ADD CONSTRAINT "FK_TeamMembers_ContributorSubTypes_ContributorSubTypeId" FOREIGN KEY ("ContributorSubTypeId") REFERENCES "ContributorSubTypes" ("Id") ON DELETE RESTRICT;

ALTER TABLE "TeamMembers" ADD CONSTRAINT "FK_TeamMembers_ContributorTypes_ContributorTypeId" FOREIGN KEY ("ContributorTypeId") REFERENCES "ContributorTypes" ("Id") ON DELETE RESTRICT;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260816120156_AddTeamContributorTypes', '10.0.11');

COMMIT;

START TRANSACTION;
ALTER TABLE "Projects" DROP COLUMN "Budget";

ALTER TABLE "Projects" DROP COLUMN "ClientName";

ALTER TABLE "Projects" DROP COLUMN "Status";

ALTER TABLE "Projects" RENAME COLUMN "Title" TO "Name";

ALTER TABLE "Projects" RENAME COLUMN "EndDate" TO "Deadline";

ALTER TABLE "Projects" RENAME COLUMN "CreatedBy" TO "StatusId";

ALTER TABLE "Projects" RENAME COLUMN "AssignedManagerId" TO "TeamId";

ALTER TABLE "Projects" ALTER COLUMN "Description" TYPE character varying(2000);
ALTER TABLE "Projects" ALTER COLUMN "Description" DROP NOT NULL;

ALTER TABLE "Projects" ADD "ArchivedAt" timestamp with time zone;

ALTER TABLE "Projects" ADD "CompletedAt" timestamp with time zone;

ALTER TABLE "Projects" ADD "ManagerId" uuid;

ALTER TABLE "Projects" ADD "ProgressPercentage" numeric(5,2) NOT NULL DEFAULT 0.0;

CREATE TABLE "ProjectStatusDefinitions" (
    "Id" uuid NOT NULL,
    "Name" character varying(100) NOT NULL,
    "Description" character varying(500),
    "IsActive" boolean NOT NULL DEFAULT TRUE,
    "DisplayOrder" integer NOT NULL,
    "IsInitialStatus" boolean NOT NULL DEFAULT FALSE,
    "IsApprovedStatus" boolean NOT NULL,
    "IsRejectedStatus" boolean NOT NULL,
    "IsCompletedStatus" boolean NOT NULL DEFAULT FALSE,
    "IsArchivedStatus" boolean NOT NULL DEFAULT FALSE,
    "IsCancelledStatus" boolean NOT NULL DEFAULT FALSE,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_ProjectStatusDefinitions" PRIMARY KEY ("Id")
);

CREATE TABLE "ProjectStatusTransitions" (
    "Id" uuid NOT NULL,
    "FromStatusId" uuid NOT NULL,
    "ToStatusId" uuid NOT NULL,
    "IsAllowed" boolean NOT NULL DEFAULT TRUE,
    "Description" character varying(500),
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    "ProjectId" uuid,
    CONSTRAINT "PK_ProjectStatusTransitions" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_ProjectStatusTransitions_ProjectStatusDefinitions_FromStatu~" FOREIGN KEY ("FromStatusId") REFERENCES "ProjectStatusDefinitions" ("Id") ON DELETE RESTRICT,
    CONSTRAINT "FK_ProjectStatusTransitions_ProjectStatusDefinitions_ToStatusId" FOREIGN KEY ("ToStatusId") REFERENCES "ProjectStatusDefinitions" ("Id") ON DELETE RESTRICT,
    CONSTRAINT "FK_ProjectStatusTransitions_Projects_ProjectId" FOREIGN KEY ("ProjectId") REFERENCES "Projects" ("Id")
);

CREATE INDEX "IX_Projects_ManagerId" ON "Projects" ("ManagerId");

CREATE UNIQUE INDEX "IX_Projects_Name" ON "Projects" ("Name");

CREATE INDEX "IX_Projects_StatusId" ON "Projects" ("StatusId");

CREATE INDEX "IX_Projects_TeamId" ON "Projects" ("TeamId");

CREATE INDEX "IX_ProjectStatusDefinitions_DisplayOrder" ON "ProjectStatusDefinitions" ("DisplayOrder");

CREATE INDEX "IX_ProjectStatusDefinitions_IsActive" ON "ProjectStatusDefinitions" ("IsActive");

CREATE INDEX "IX_ProjectStatusDefinitions_IsInitialStatus" ON "ProjectStatusDefinitions" ("IsInitialStatus");

CREATE UNIQUE INDEX "IX_ProjectStatusDefinitions_Name" ON "ProjectStatusDefinitions" ("Name");

CREATE INDEX "IX_ProjectStatusTransitions_FromStatusId" ON "ProjectStatusTransitions" ("FromStatusId");

CREATE UNIQUE INDEX "IX_ProjectStatusTransitions_FromStatusId_ToStatusId" ON "ProjectStatusTransitions" ("FromStatusId", "ToStatusId");

CREATE INDEX "IX_ProjectStatusTransitions_IsAllowed" ON "ProjectStatusTransitions" ("IsAllowed");

CREATE INDEX "IX_ProjectStatusTransitions_ProjectId" ON "ProjectStatusTransitions" ("ProjectId");

CREATE INDEX "IX_ProjectStatusTransitions_ToStatusId" ON "ProjectStatusTransitions" ("ToStatusId");

ALTER TABLE "Projects" ADD CONSTRAINT "FK_Projects_ProjectStatusDefinitions_StatusId" FOREIGN KEY ("StatusId") REFERENCES "ProjectStatusDefinitions" ("Id") ON DELETE RESTRICT;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260817095855_AddWhateverWeChanged', '10.0.11');

COMMIT;

START TRANSACTION;
CREATE TABLE "SystemSettings" (
    "Id" uuid NOT NULL,
    "SystemName" text NOT NULL,
    "DefaultLanguage" text NOT NULL,
    "DateTimeFormat" text NOT NULL,
    "AllowUserRegistration" boolean NOT NULL,
    "SessionTimeoutMinutes" integer NOT NULL,
    "MaxFileUploadSizeMb" bigint NOT NULL,
    "MaintenanceMode" boolean NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_SystemSettings" PRIMARY KEY ("Id")
);

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260818204307_AddSystemSettings', '10.0.11');

COMMIT;

START TRANSACTION;
CREATE TABLE "NotificationSettings" (
    "Id" uuid NOT NULL,
    "NotificationsEnabled" boolean NOT NULL,
    "EmailNotificationsEnabled" boolean NOT NULL,
    "InSystemNotificationsEnabled" boolean NOT NULL,
    "TaskAssignmentAlertsEnabled" boolean NOT NULL,
    "ProjectDeadlineRemindersEnabled" boolean NOT NULL,
    "SprintUpdateNotificationsEnabled" boolean NOT NULL,
    "AiRecommendationAlertsEnabled" boolean NOT NULL,
    "UserActivityNotificationsEnabled" boolean NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_NotificationSettings" PRIMARY KEY ("Id")
);

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260818223507_AddNotificationSettings', '10.0.11');

COMMIT;

START TRANSACTION;
CREATE TABLE "SecuritySettings" (
    "Id" uuid NOT NULL,
    "PasswordComplexityEnabled" boolean NOT NULL,
    "MinimumPasswordLength" integer NOT NULL,
    "RequireUppercase" boolean NOT NULL,
    "RequireLowercase" boolean NOT NULL,
    "RequireNumber" boolean NOT NULL,
    "RequireSpecialCharacter" boolean NOT NULL,
    "SessionTimeoutMinutes" integer NOT NULL,
    "MaxLoginAttempts" integer NOT NULL,
    "AccountLockoutEnabled" boolean NOT NULL,
    "AccountLockoutMinutes" integer NOT NULL,
    "TwoFactorAuthenticationEnabled" boolean NOT NULL,
    "ApiSecurityEnabled" boolean NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_SecuritySettings" PRIMARY KEY ("Id")
);

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260818224658_AddSecuritySettings', '10.0.11');

COMMIT;

START TRANSACTION;
ALTER TABLE "Users" ADD "LanguagePreference" character varying(20) NOT NULL DEFAULT '';

ALTER TABLE "Users" ADD "ThemePreference" character varying(20) NOT NULL DEFAULT '';

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260819000548_AddUserPreferences', '10.0.11');

COMMIT;

START TRANSACTION;
CREATE TABLE "AIPreferences" (
    "Id" uuid NOT NULL,
    "UserId" uuid NOT NULL,
    "AIEnabled" boolean NOT NULL,
    "RecommendationsEnabled" boolean NOT NULL,
    "RiskAnalysisEnabled" boolean NOT NULL,
    "AIAlertsEnabled" boolean NOT NULL,
    "SuggestionApprovalMode" text NOT NULL,
    "AllowAIDataUsage" boolean NOT NULL,
    "AnalysisFrequencyMinutes" integer NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_AIPreferences" PRIMARY KEY ("Id")
);

CREATE TABLE "DashboardPreferences" (
    "Id" uuid NOT NULL,
    "UserId" uuid NOT NULL,
    "ShowProjectMetrics" boolean NOT NULL,
    "ShowTaskMetrics" boolean NOT NULL,
    "ShowSprintMetrics" boolean NOT NULL,
    "ShowTeamMetrics" boolean NOT NULL,
    "ShowAIAlerts" boolean NOT NULL,
    "DefaultView" text NOT NULL,
    "DefaultFilter" text NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_DashboardPreferences" PRIMARY KEY ("Id")
);

CREATE UNIQUE INDEX "IX_AIPreferences_UserId" ON "AIPreferences" ("UserId");

CREATE UNIQUE INDEX "IX_DashboardPreferences_UserId" ON "DashboardPreferences" ("UserId");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260819020118_AddDashboardAndAIPreferences', '10.0.11');

COMMIT;

START TRANSACTION;
ALTER TABLE "ContributorSubTypes" DROP CONSTRAINT "FK_ContributorSubTypes_ContributorTypes_ContributorTypeId";

ALTER TABLE "TeamMembers" DROP CONSTRAINT "FK_TeamMembers_ContributorSubTypes_ContributorSubTypeId";

ALTER TABLE "ContributorSubTypes" ADD CONSTRAINT "FK_ContributorSubTypes_ContributorTypes_ContributorTypeId" FOREIGN KEY ("ContributorTypeId") REFERENCES "ContributorTypes" ("Id") ON DELETE RESTRICT;

ALTER TABLE "TeamMembers" ADD CONSTRAINT "FK_TeamMembers_ContributorSubTypes_ContributorSubTypeId" FOREIGN KEY ("ContributorSubTypeId") REFERENCES "ContributorSubTypes" ("Id");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260821082408_AddContributorTypes', '10.0.11');

COMMIT;

START TRANSACTION;
INSERT INTO "ContributorTypes" ("Id", "CreatedAt", "Description", "IsActive", "Name", "UpdatedAt")
VALUES ('11111111-1111-1111-1111-111111111111', TIMESTAMPTZ '2026-01-01T00:00:00Z', 'Software development contributor', TRUE, 'Developer', NULL);
INSERT INTO "ContributorTypes" ("Id", "CreatedAt", "Description", "IsActive", "Name", "UpdatedAt")
VALUES ('22222222-2222-2222-2222-222222222222', TIMESTAMPTZ '2026-01-01T00:00:00Z', 'Non-developer project staff', TRUE, 'Staff', NULL);

INSERT INTO "ContributorSubTypes" ("Id", "ContributorTypeId", "CreatedAt", "Description", "IsActive", "Name", "UpdatedAt")
VALUES ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', TIMESTAMPTZ '2026-01-01T00:00:00Z', 'Responsible for frontend development', TRUE, 'Frontend Developer', NULL);
INSERT INTO "ContributorSubTypes" ("Id", "ContributorTypeId", "CreatedAt", "Description", "IsActive", "Name", "UpdatedAt")
VALUES ('44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', TIMESTAMPTZ '2026-01-01T00:00:00Z', 'Responsible for backend development', TRUE, 'Backend Developer', NULL);
INSERT INTO "ContributorSubTypes" ("Id", "ContributorTypeId", "CreatedAt", "Description", "IsActive", "Name", "UpdatedAt")
VALUES ('55555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', TIMESTAMPTZ '2026-01-01T00:00:00Z', 'Responsible for frontend and backend development', TRUE, 'Full Stack Developer', NULL);
INSERT INTO "ContributorSubTypes" ("Id", "ContributorTypeId", "CreatedAt", "Description", "IsActive", "Name", "UpdatedAt")
VALUES ('66666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', TIMESTAMPTZ '2026-01-01T00:00:00Z', 'Responsible for mobile application development', TRUE, 'Mobile Developer', NULL);
INSERT INTO "ContributorSubTypes" ("Id", "ContributorTypeId", "CreatedAt", "Description", "IsActive", "Name", "UpdatedAt")
VALUES ('77777777-7777-7777-7777-777777777777', '22222222-2222-2222-2222-222222222222', TIMESTAMPTZ '2026-01-01T00:00:00Z', 'Responsible for quality assurance and testing', TRUE, 'QA', NULL);
INSERT INTO "ContributorSubTypes" ("Id", "ContributorTypeId", "CreatedAt", "Description", "IsActive", "Name", "UpdatedAt")
VALUES ('88888888-8888-8888-8888-888888888888', '22222222-2222-2222-2222-222222222222', TIMESTAMPTZ '2026-01-01T00:00:00Z', 'Responsible for user interface and experience design', TRUE, 'UI/UX Designer', NULL);
INSERT INTO "ContributorSubTypes" ("Id", "ContributorTypeId", "CreatedAt", "Description", "IsActive", "Name", "UpdatedAt")
VALUES ('99999999-9999-9999-9999-999999999999', '22222222-2222-2222-2222-222222222222', TIMESTAMPTZ '2026-01-01T00:00:00Z', 'Responsible for requirements and business analysis', TRUE, 'Business Analyst', NULL);

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260821093203_SyncContributorSeed', '10.0.11');

COMMIT;

START TRANSACTION;
ALTER TABLE "TeamMembers" DROP CONSTRAINT "FK_TeamMembers_ContributorSubTypes_ContributorSubTypeId";

ALTER TABLE "Users" DROP CONSTRAINT "FK_Users_ContributorTypeDefinitions_ContributorTypeDefinitionId";

ALTER TABLE "Users" DROP CONSTRAINT "FK_Users_DeveloperSpecializations_DeveloperSpecializationId";

ALTER TABLE "Users" DROP CONSTRAINT "FK_Users_StaffSpecializations_StaffSpecializationId";

DROP TABLE "ContributorTypeDefinitions";

DROP TABLE "DeveloperSpecializations";

DROP TABLE "StaffSpecializations";

DROP INDEX "IX_Users_ContributorTypeDefinitionId";

DROP INDEX "IX_ContributorSubTypes_ContributorTypeId";

ALTER TABLE "Users" DROP COLUMN "ContributorTypeDefinitionId";

ALTER TABLE "Users" RENAME COLUMN "StaffSpecializationId" TO "ContributorTypeId";

ALTER TABLE "Users" RENAME COLUMN "DeveloperSpecializationId" TO "ContributorSubTypeId";

ALTER INDEX "IX_Users_StaffSpecializationId" RENAME TO "IX_Users_ContributorTypeId";

ALTER INDEX "IX_Users_DeveloperSpecializationId" RENAME TO "IX_Users_ContributorSubTypeId";

ALTER TABLE "TeamMembers" ADD "ContributorSubTypeId1" uuid;

CREATE INDEX "IX_TeamMembers_ContributorSubTypeId1" ON "TeamMembers" ("ContributorSubTypeId1");

CREATE UNIQUE INDEX "IX_ContributorTypes_Name" ON "ContributorTypes" ("Name");

CREATE UNIQUE INDEX "IX_ContributorSubTypes_ContributorTypeId_Name" ON "ContributorSubTypes" ("ContributorTypeId", "Name");

ALTER TABLE "TeamMembers" ADD CONSTRAINT "FK_TeamMembers_ContributorSubTypes_ContributorSubTypeId" FOREIGN KEY ("ContributorSubTypeId") REFERENCES "ContributorSubTypes" ("Id") ON DELETE RESTRICT;

ALTER TABLE "TeamMembers" ADD CONSTRAINT "FK_TeamMembers_ContributorSubTypes_ContributorSubTypeId1" FOREIGN KEY ("ContributorSubTypeId1") REFERENCES "ContributorSubTypes" ("Id");

ALTER TABLE "Users" ADD CONSTRAINT "FK_Users_ContributorSubTypes_ContributorSubTypeId" FOREIGN KEY ("ContributorSubTypeId") REFERENCES "ContributorSubTypes" ("Id") ON DELETE SET NULL;

ALTER TABLE "Users" ADD CONSTRAINT "FK_Users_ContributorTypes_ContributorTypeId" FOREIGN KEY ("ContributorTypeId") REFERENCES "ContributorTypes" ("Id") ON DELETE SET NULL;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260822150702_InitialUserSystem', '10.0.11');

COMMIT;

START TRANSACTION;
DELETE FROM "ContributorSubTypes"
WHERE "Id" = '33333333-3333-3333-3333-333333333333';

DELETE FROM "ContributorSubTypes"
WHERE "Id" = '44444444-4444-4444-4444-444444444444';

DELETE FROM "ContributorSubTypes"
WHERE "Id" = '55555555-5555-5555-5555-555555555555';

DELETE FROM "ContributorSubTypes"
WHERE "Id" = '66666666-6666-6666-6666-666666666666';

DELETE FROM "ContributorSubTypes"
WHERE "Id" = '77777777-7777-7777-7777-777777777777';

DELETE FROM "ContributorSubTypes"
WHERE "Id" = '88888888-8888-8888-8888-888888888888';

DELETE FROM "ContributorSubTypes"
WHERE "Id" = '99999999-9999-9999-9999-999999999999';

INSERT INTO "ContributorSubTypes" ("Id", "ContributorTypeId", "CreatedAt", "Description", "IsActive", "Name", "UpdatedAt")
VALUES ('11111111-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111111', TIMESTAMPTZ '2026-01-01T00:00:00Z', 'Develops user interfaces and frontend applications.', TRUE, 'Frontend Developer', NULL);
INSERT INTO "ContributorSubTypes" ("Id", "ContributorTypeId", "CreatedAt", "Description", "IsActive", "Name", "UpdatedAt")
VALUES ('11111111-1111-1111-1111-111111111113', '11111111-1111-1111-1111-111111111111', TIMESTAMPTZ '2026-01-01T00:00:00Z', 'Develops APIs, services, databases and backend systems.', TRUE, 'Backend Developer', NULL);
INSERT INTO "ContributorSubTypes" ("Id", "ContributorTypeId", "CreatedAt", "Description", "IsActive", "Name", "UpdatedAt")
VALUES ('11111111-1111-1111-1111-111111111114', '11111111-1111-1111-1111-111111111111', TIMESTAMPTZ '2026-01-01T00:00:00Z', 'Works across frontend and backend development.', TRUE, 'Full Stack Developer', NULL);
INSERT INTO "ContributorSubTypes" ("Id", "ContributorTypeId", "CreatedAt", "Description", "IsActive", "Name", "UpdatedAt")
VALUES ('11111111-1111-1111-1111-111111111115', '11111111-1111-1111-1111-111111111111', TIMESTAMPTZ '2026-01-01T00:00:00Z', 'Other developer specialization.', TRUE, 'Other', NULL);
INSERT INTO "ContributorSubTypes" ("Id", "ContributorTypeId", "CreatedAt", "Description", "IsActive", "Name", "UpdatedAt")
VALUES ('22222222-2222-2222-2222-222222222223', '22222222-2222-2222-2222-222222222222', TIMESTAMPTZ '2026-01-01T00:00:00Z', 'Human resources and employee management.', TRUE, 'Human Resources', NULL);
INSERT INTO "ContributorSubTypes" ("Id", "ContributorTypeId", "CreatedAt", "Description", "IsActive", "Name", "UpdatedAt")
VALUES ('22222222-2222-2222-2222-222222222224', '22222222-2222-2222-2222-222222222222', TIMESTAMPTZ '2026-01-01T00:00:00Z', 'Financial and accounting responsibilities.', TRUE, 'Finance', NULL);
INSERT INTO "ContributorSubTypes" ("Id", "ContributorTypeId", "CreatedAt", "Description", "IsActive", "Name", "UpdatedAt")
VALUES ('22222222-2222-2222-2222-222222222225', '22222222-2222-2222-2222-222222222222', TIMESTAMPTZ '2026-01-01T00:00:00Z', 'Administrative and organizational responsibilities.', TRUE, 'Administration', NULL);
INSERT INTO "ContributorSubTypes" ("Id", "ContributorTypeId", "CreatedAt", "Description", "IsActive", "Name", "UpdatedAt")
VALUES ('22222222-2222-2222-2222-222222222226', '22222222-2222-2222-2222-222222222222', TIMESTAMPTZ '2026-01-01T00:00:00Z', 'Other staff specialization.', TRUE, 'Other', NULL);

UPDATE "ContributorTypes" SET "Description" = 'Software development and technical roles.'
WHERE "Id" = '11111111-1111-1111-1111-111111111111';

UPDATE "ContributorTypes" SET "Description" = 'Administrative and support roles.'
WHERE "Id" = '22222222-2222-2222-2222-222222222222';

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260823105832_CreateActivityLogs', '10.0.11');

COMMIT;

START TRANSACTION;
INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260823122625_AddPermissionSystem', '10.0.11');

COMMIT;

START TRANSACTION;
ALTER TABLE "TeamMembers" DROP CONSTRAINT "FK_TeamMembers_ContributorSubTypes_ContributorSubTypeId1";

DROP INDEX "IX_TeamMembers_ContributorSubTypeId1";

ALTER TABLE "DashboardPreferences" DROP CONSTRAINT "PK_DashboardPreferences";

ALTER TABLE "AIPreferences" DROP CONSTRAINT "PK_AIPreferences";

ALTER TABLE "TeamMembers" DROP COLUMN "ContributorSubTypeId1";

ALTER TABLE "DashboardPreferences" RENAME TO "DashboardPreference";

ALTER TABLE "AIPreferences" RENAME TO "AIPreference";

ALTER INDEX "IX_DashboardPreferences_UserId" RENAME TO "IX_DashboardPreference_UserId";

ALTER TABLE "AIPreference" RENAME COLUMN "RiskAnalysisEnabled" TO "IsAIEnabled";

ALTER TABLE "AIPreference" RENAME COLUMN "RecommendationsEnabled" TO "EnableRiskAnalysis";

ALTER TABLE "AIPreference" RENAME COLUMN "AIEnabled" TO "EnableRecommendations";

ALTER TABLE "AIPreference" RENAME COLUMN "AIAlertsEnabled" TO "EnableNotifications";

ALTER INDEX "IX_AIPreferences_UserId" RENAME TO "IX_AIPreference_UserId";

ALTER TABLE "DashboardPreference" ALTER COLUMN "DefaultView" TYPE character varying(50);

ALTER TABLE "DashboardPreference" ALTER COLUMN "DefaultFilter" TYPE character varying(50);

ALTER TABLE "AIPreference" ALTER COLUMN "SuggestionApprovalMode" TYPE character varying(50);

ALTER TABLE "DashboardPreference" ADD CONSTRAINT "PK_DashboardPreference" PRIMARY KEY ("Id");

ALTER TABLE "AIPreference" ADD CONSTRAINT "PK_AIPreference" PRIMARY KEY ("Id");

ALTER TABLE "AIPreference" ADD CONSTRAINT "FK_AIPreference_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE;

ALTER TABLE "DashboardPreference" ADD CONSTRAINT "FK_DashboardPreference_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260824193355_SyncCurrentModel', '10.0.11');

COMMIT;

START TRANSACTION;
INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260824203241_YourMigrationName', '10.0.11');

COMMIT;

START TRANSACTION;
ALTER TABLE "Sprints" ADD "TeamId" uuid;

CREATE TABLE "ProjectSpecifications" (
    "Id" uuid NOT NULL,
    "ProjectId" uuid NOT NULL,
    "Objectives" character varying(5000) NOT NULL,
    "Scope" character varying(5000) NOT NULL,
    "FunctionalRequirements" character varying(10000) NOT NULL,
    "NonFunctionalRequirements" character varying(10000) NOT NULL,
    "Deliverables" character varying(5000) NOT NULL,
    "TechnologyStack" character varying(2000) NOT NULL,
    "Assumptions" character varying(5000),
    "Constraints" character varying(5000),
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    "ProjectId1" uuid,
    CONSTRAINT "PK_ProjectSpecifications" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_ProjectSpecifications_Projects_ProjectId" FOREIGN KEY ("ProjectId") REFERENCES "Projects" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_ProjectSpecifications_Projects_ProjectId1" FOREIGN KEY ("ProjectId1") REFERENCES "Projects" ("Id")
);

CREATE UNIQUE INDEX "IX_ProjectSpecifications_ProjectId" ON "ProjectSpecifications" ("ProjectId");

CREATE UNIQUE INDEX "IX_ProjectSpecifications_ProjectId1" ON "ProjectSpecifications" ("ProjectId1");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260825183624_AddTeamIdToSprints', '10.0.11');

COMMIT;

START TRANSACTION;
ALTER TABLE "ProjectSpecifications" DROP CONSTRAINT "FK_ProjectSpecifications_Projects_ProjectId1";

DROP INDEX "IX_ProjectSpecifications_ProjectId1";

ALTER TABLE "ProjectSpecifications" DROP COLUMN "ProjectId1";

ALTER TABLE "TeamMembers" ADD "IsTeamLeader" boolean NOT NULL DEFAULT FALSE;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260825194237_AddTeamLeaderToTeamMembers', '10.0.11');

COMMIT;

START TRANSACTION;
CREATE TABLE "TeamMemberRequests" (
    "Id" uuid NOT NULL,
    "ProjectId" uuid NOT NULL,
    "TeamId" uuid NOT NULL,
    "ManagerId" uuid NOT NULL,
    "UserId" uuid NOT NULL,
    "Reason" character varying(1000),
    "Status" integer NOT NULL,
    "ReviewedByAdminId" uuid,
    "ReviewedAt" timestamp with time zone,
    "ReviewComment" character varying(1000),
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_TeamMemberRequests" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_TeamMemberRequests_Teams_TeamId" FOREIGN KEY ("TeamId") REFERENCES "Teams" ("Id") ON DELETE CASCADE
);

CREATE INDEX "IX_TeamMemberRequests_TeamId_UserId_Status" ON "TeamMemberRequests" ("TeamId", "UserId", "Status");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260826072427_AddTeamMemberRequest', '10.0.11');

COMMIT;

