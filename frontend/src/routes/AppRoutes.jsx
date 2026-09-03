import {
    Routes,
    Route,
    Navigate,
    Outlet,
} from "react-router-dom";

import {
    getCurrentUser,
} from "@/services/authService";

// ============================================================
// PUBLIC
// ============================================================

import LandingPage from "../pages/Auth/LandingPage";
import Login from "../pages/Auth/Login";
import Logout from "../pages/Auth/Logout";
import ChangePassword from "../pages/Auth/ChangePassword";

// ============================================================
// PROTECTION
// ============================================================

import ProtectedRoute from "./ProtectedRoute";

// ============================================================
// ADMIN
// ============================================================

import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminTeamManagement from "../pages/admin/TeamManagement";
import ProjectOversight from "../pages/admin/ProjectOversight";
import Reports from "../pages/admin/Reports";
import AIAdministration from "../pages/admin/AIAdministration";
import SystemAdministration from "../pages/admin/SystemAdministration";
import ProfileManagement from "../pages/admin/ProfileManagement";
import Settings from "../pages/admin/Settings";

// ============================================================
// ADMIN - SYSTEM ADMINISTRATION
// ============================================================

import SystemSettings
    from "../components/admin/system-administration/SystemSettings";

import NotificationSettings
    from "../components/admin/system-administration/NotificationSettings";

import SecuritySettings
    from "../components/admin/system-administration/SecuritySettings";

// ============================================================
// MANAGER
// ============================================================

import ManagerLayout
    from "../layouts/ManagerLayout";

import ManagerDashboard
    from "../pages/manager/ManagerDashboard";

import ProjectManagement
    from "../pages/manager/ProjectManagement";

import SprintManagement
    from "../pages/manager/SprintManagement";

import ManagerTeamManagement
    from "../pages/manager/TeamManagement";

// ============================================================
// MANAGER - COMMUNICATION
// ============================================================

import Notifications
    from "../pages/manager/Notifications";

import ManagerMessages
    from "../pages/manager/ManagerMessages";

import ActivityFeed
    from "../pages/manager/ActivityFeed";

import SendProjectAnnouncement
    from "../components/manager/notification/SendProjectAnnouncement";

// ============================================================
// MANAGER - REPORTS
// ============================================================

import ManagerReports
    from "../pages/manager/ReportsPage";

// ============================================================
// MANAGER - PROFILE
// ============================================================

import ManagerProfile
    from "../components/manager/profile/ManagerProfile";

// ============================================================
// MANAGER - SETTINGS
// ============================================================

import ManagerSettings
    from "../pages/manager/ManagerSettings";

// ============================================================
// MANAGER - AI
// ============================================================

import AIFeatures
    from "../pages/manager/AIFeatures";

import AIPredictRisk
    from "../components/manager/ai/AIPredictRisk";

import AIGenerateRecommendations
    from "../components/manager/ai/AIGenerateRecommendations";

import AITeamPerformance
    from "../components/manager/ai/AITeamPerformance";

import AIPredictProgress
    from "../components/manager/ai/AIPredictProgress";

import AIDeadlinePrediction
    from "../components/manager/ai/AIDeadlinePrediction";

import AISprintPlanning
    from "../components/manager/ai/AISprintPlanning";

import AIAutomatedProjectSummary
    from "../components/manager/ai/AIAutomatedProjectSummary";

import AIDetectBottlenecks
    from "../components/manager/ai/AIDetectBottlenecks";

// ============================================================
// STAFF
// ============================================================

import StaffLayout
    from "../layouts/StaffLayout";

import StaffDashboard
    from "../pages/contributor/staff/StaffDashboard";

import StaffProfileManagement
    from "../pages/contributor/staff/ProfileManagement";

import StaffProjectParticipation
    from "../pages/contributor/staff/ProjectParticipation";

import StaffTaskManagement
    from "../pages/contributor/staff/TaskManagement";

import StaffSprintParticipation
    from "../pages/contributor/staff/SprintParticipation";

import StaffCommunication
    from "../pages/contributor/staff/Communication";

import StaffReports
    from "../pages/contributor/staff/Reports";

import StaffSettings
    from "../pages/contributor/staff/Settings";

// ============================================================
// DEVELOPER
// ============================================================

import DeveloperLayout
    from "../layouts/DeveloperLayout";

import DeveloperDashboard
    from "../pages/contributor/developer/DeveloperDashboard";

import Developer
    from "../pages/contributor/developer/Developer";

import DeveloperCommunication
    from "../pages/contributor/developer/Communication";

import DeveloperProfile
    from "../pages/contributor/developer/Profile";

import DeveloperProjects
    from "../pages/contributor/developer/Projects";

import DeveloperReports
    from "../pages/contributor/developer/Reports";

import DeveloperSettings
    from "../pages/contributor/developer/Settings";

import DeveloperSprintParticipation
    from "../pages/contributor/developer/SprintParticipation";

import DeveloperTasks
    from "../pages/contributor/developer/Tasks";

// ============================================================
// TEAM LEADER
// ============================================================
//
// Team Leader page structure:
//
// src/pages/contributor/team-leader/
//
// ├── TeamLeader.jsx
// ├── TaskManagement.jsx
// ├── ProfileManagement.jsx
// ├── ProjectParticipation.jsx
// ├── SprintParticipation.jsx
// ├── Communication.jsx
// ├── Reports.jsx
// └── Settings.jsx
//
// These 8 pages are the top-level Team Leader modules.
//
// Their child use-case components are located under:
//
// src/components/contributor/teamleader/
//
// and are imported/used by the corresponding page.
// ============================================================

import TeamLeaderLayout
    from "../layouts/TeamLeaderLayout";

import TeamLeader
    from "../pages/contributor/team-leader/TeamLeader";

import TeamLeaderTaskManagement
    from "../pages/contributor/team-leader/TaskManagement";

import TeamLeaderProfileManagement
    from "../pages/contributor/team-leader/ProfileManagement";

import TeamLeaderProjectParticipation
    from "../pages/contributor/team-leader/ProjectParticipation";

import TeamLeaderSprintParticipation
    from "../pages/contributor/team-leader/SprintParticipation";

import TeamLeaderCommunication
    from "../pages/contributor/team-leader/Communication";

import TeamLeaderReports
    from "../pages/contributor/team-leader/Reports";

import TeamLeaderSettings
    from "../pages/contributor/team-leader/Settings";

// ============================================================
// ROLE HELPERS
// ============================================================

function normalizeRole(role) {
    const normalized = String(role ?? "")
        .trim()
        .toLowerCase()
        .replace(/[_-]+/g, " ")
        .replace(/\s+/g, " ");

    if (
        role === 1 ||
        role === "1" ||
        normalized === "admin"
    ) {
        return "Admin";
    }

    if (
        role === 2 ||
        role === "2" ||
        normalized === "manager"
    ) {
        return "Manager";
    }

    if (
        role === 3 ||
        role === "3" ||
        normalized === "contributor"
    ) {
        return "Contributor";
    }

    return "";
}

// ============================================================
// CLASSIFICATION NORMALIZATION
// ============================================================

function normalizeClassification(value) {
    const normalized = String(value ?? "")
        .trim()
        .toLowerCase()
        .replace(/[_-]+/g, " ")
        .replace(/\s+/g, " ");

    if (
        normalized === "teamleader" ||
        normalized === "team leader"
    ) {
        return "team leader";
    }

    return normalized;
}

// ============================================================
// EXTRACT CLASSIFICATION VALUE
// ============================================================

function extractClassificationValue(value) {
    if (
        value === null ||
        value === undefined
    ) {
        return null;
    }

    if (
        typeof value === "string" ||
        typeof value === "number"
    ) {
        return value;
    }

    if (typeof value === "object") {
        return (
            value.name ??
            value.Name ??
            value.displayName ??
            value.DisplayName ??
            value.title ??
            value.Title ??
            value.label ??
            value.Label ??
            null
        );
    }

    return null;
}

// ============================================================
// GET CONTRIBUTOR CLASSIFICATIONS
// ============================================================

function getContributorClassifications(user) {
    const values = [
        // --------------------------------------------------------
        // Contributor Type
        // --------------------------------------------------------

        user?.contributorTypeName,
        user?.ContributorTypeName,
        user?.contributorType,
        user?.ContributorType,

        // --------------------------------------------------------
        // Contributor Subtype
        // --------------------------------------------------------

        user?.contributorSubTypeName,
        user?.ContributorSubTypeName,
        user?.contributorSubType,
        user?.ContributorSubType,

        // --------------------------------------------------------
        // Nested Contributor Type
        // --------------------------------------------------------

        user?.contributorType?.name,
        user?.contributorType?.Name,
        user?.contributorType?.displayName,
        user?.contributorType?.DisplayName,
        user?.contributorType?.title,
        user?.contributorType?.Title,

        user?.ContributorType?.name,
        user?.ContributorType?.Name,
        user?.ContributorType?.displayName,
        user?.ContributorType?.DisplayName,
        user?.ContributorType?.title,
        user?.ContributorType?.Title,

        // --------------------------------------------------------
        // Nested Contributor Subtype
        // --------------------------------------------------------

        user?.contributorSubType?.name,
        user?.contributorSubType?.Name,
        user?.contributorSubType?.displayName,
        user?.contributorSubType?.DisplayName,
        user?.contributorSubType?.title,
        user?.contributorSubType?.Title,

        user?.ContributorSubType?.name,
        user?.ContributorSubType?.Name,
        user?.ContributorSubType?.displayName,
        user?.ContributorSubType?.DisplayName,
        user?.ContributorSubType?.title,
        user?.ContributorSubType?.Title,

        // --------------------------------------------------------
        // Alternative API Names
        // --------------------------------------------------------

        user?.contributorClassification,
        user?.ContributorClassification,

        user?.contributorClassificationName,
        user?.ContributorClassificationName,
    ];

    return values
        .map(extractClassificationValue)
        .filter(
            (value) =>
                value !== null &&
                value !== undefined &&
                String(value).trim() !== ""
        )
        .map(normalizeClassification)
        .filter(Boolean);
}

// ============================================================
// ROLE GUARD
// ============================================================

function RoleRoute({ allowedRoles }) {
    const user = getCurrentUser();

    const rawRole =
        user?.role ??
        user?.Role ??
        user?.roleName ??
        user?.RoleName ??
        user?.roleId ??
        user?.RoleId;

    const userRole = normalizeRole(rawRole);

    if (!allowedRoles.includes(userRole)) {
        console.warn(
            "AIPMS RoleRoute access denied.",
            {
                user,
                rawRole,
                userRole,
                allowedRoles,
            }
        );

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    return <Outlet />;
}

// ============================================================
// CONTRIBUTOR TYPE GUARD
// ============================================================

function ContributorTypeRoute({
    allowedTypes,
}) {
    const user = getCurrentUser();

    const rawRole =
        user?.role ??
        user?.Role ??
        user?.roleName ??
        user?.RoleName ??
        user?.roleId ??
        user?.RoleId;

    const userRole = normalizeRole(rawRole);

    const classifications =
        getContributorClassifications(user);

    const normalizedAllowedTypes =
        allowedTypes.map(
            normalizeClassification
        );

    // --------------------------------------------------------
    // DEBUG
    // --------------------------------------------------------

    console.log(
        "AIPMS Contributor Route Check:",
        {
            rawRole,
            userRole,
            classifications,
            normalizedAllowedTypes,
        }
    );

    // --------------------------------------------------------
    // MUST BE CONTRIBUTOR
    // --------------------------------------------------------

    if (userRole !== "Contributor") {
        console.warn(
            "AIPMS access denied: not a Contributor.",
            {
                rawRole,
                userRole,
            }
        );

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    // --------------------------------------------------------
    // MUST MATCH CONTRIBUTOR TYPE
    // --------------------------------------------------------

    const allowed =
        classifications.some(
            (classification) =>
                normalizedAllowedTypes.includes(
                    classification
                )
        );

    if (!allowed) {
        console.warn(
            "AIPMS access denied: contributor classification mismatch.",
            {
                classifications,
                normalizedAllowedTypes,
            }
        );

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    return <Outlet />;
}

// ============================================================
// APP ROUTES
// ============================================================

function AppRoutes() {
    return (
        <Routes>

            {/* ==================================================
                PUBLIC
            ================================================== */}

            <Route
                path="/"
                element={<LandingPage />}
            />

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/logout"
                element={<Logout />}
            />

            <Route
                path="/change-password"
                element={<ChangePassword />}
            />

            {/* ==================================================
                AUTHENTICATED
            ================================================== */}

            <Route element={<ProtectedRoute />}>

                {/* ==================================================
                    ADMIN
                ================================================== */}

                <Route
                    element={
                        <RoleRoute
                            allowedRoles={["Admin"]}
                        />
                    }
                >
                    <Route
                        path="/admin"
                        element={<AdminLayout />}
                    >
                        <Route
                            index
                            element={
                                <Navigate
                                    to="dashboard"
                                    replace
                                />
                            }
                        />

                        <Route
                            path="dashboard"
                            element={<AdminDashboard />}
                        />

                        <Route
                            path="users"
                            element={<AdminUsers />}
                        />

                        <Route
                            path="teams"
                            element={<AdminTeamManagement />}
                        />

                        <Route
                            path="projects"
                            element={<ProjectOversight />}
                        />

                        <Route
                            path="reports"
                            element={<Reports />}
                        />

                        <Route
                            path="ai-admin"
                            element={<AIAdministration />}
                        />

                        <Route
                            path="system-admin"
                            element={<SystemAdministration />}
                        />

                        <Route
                            path="system/settings"
                            element={<SystemSettings />}
                        />

                        <Route
                            path="system/notifications"
                            element={<NotificationSettings />}
                        />

                        <Route
                            path="system/security"
                            element={<SecuritySettings />}
                        />

                        <Route
                            path="profile"
                            element={<ProfileManagement />}
                        />

                        <Route
                            path="settings"
                            element={<Settings />}
                        />
                    </Route>
                </Route>

                {/* ==================================================
                    MANAGER
                ================================================== */}

                <Route
                    element={
                        <RoleRoute
                            allowedRoles={["Manager"]}
                        />
                    }
                >
                    <Route
                        path="/manager"
                        element={<ManagerLayout />}
                    >
                        <Route
                            index
                            element={
                                <Navigate
                                    to="dashboard"
                                    replace
                                />
                            }
                        />

                        <Route
                            path="dashboard"
                            element={<ManagerDashboard />}
                        />

                        <Route
                            path="projects"
                            element={<ProjectManagement />}
                        />

                        <Route
                            path="sprints"
                            element={<SprintManagement />}
                        />

                        <Route
                            path="team"
                            element={<ManagerTeamManagement />}
                        />

                        <Route
                            path="notifications"
                            element={<Notifications />}
                        />

                        <Route
                            path="messages"
                            element={<ManagerMessages />}
                        />

                        <Route
                            path="activity-feed"
                            element={<ActivityFeed />}
                        />

                        <Route
                            path="project-announcement"
                            element={
                                <SendProjectAnnouncement />
                            }
                        />

                        <Route
                            path="ai-features"
                            element={<AIFeatures />}
                        />

                        <Route
                            path="ai-risk"
                            element={<AIPredictRisk />}
                        />

                        <Route
                            path="ai-recommendations"
                            element={
                                <AIGenerateRecommendations />
                            }
                        />

                        <Route
                            path="ai-team-performance"
                            element={
                                <AITeamPerformance />
                            }
                        />

                        <Route
                            path="ai-progress"
                            element={
                                <AIPredictProgress />
                            }
                        />

                        <Route
                            path="ai-deadline"
                            element={
                                <AIDeadlinePrediction />
                            }
                        />

                        <Route
                            path="ai-sprint-planning"
                            element={
                                <AISprintPlanning />
                            }
                        />

                        <Route
                            path="ai-project-summary"
                            element={
                                <AIAutomatedProjectSummary />
                            }
                        />

                        <Route
                            path="ai-bottlenecks"
                            element={
                                <AIDetectBottlenecks />
                            }
                        />

                        <Route
                            path="reports"
                            element={<ManagerReports />}
                        />

                        <Route
                            path="profile"
                            element={<ManagerProfile />}
                        />

                        <Route
                            path="settings"
                            element={<ManagerSettings />}
                        />

                        <Route
                            path="help"
                            element={
                                <div className="p-6">
                                    Help
                                </div>
                            }
                        />

                        <Route
                            path="logout"
                            element={<Logout />}
                        />
                    </Route>
                </Route>

                {/* ==================================================
                    STAFF
                ================================================== */}

                <Route
                    element={
                        <ContributorTypeRoute
                            allowedTypes={["staff"]}
                        />
                    }
                >
                    <Route
                        path="/staff"
                        element={<StaffLayout />}
                    >
                        <Route
                            index
                            element={
                                <Navigate
                                    to="dashboard"
                                    replace
                                />
                            }
                        />

                        <Route
                            path="dashboard"
                            element={<StaffDashboard />}
                        />

                        <Route
                            path="profile"
                            element={
                                <StaffProfileManagement />
                            }
                        />

                        <Route
                            path="projects"
                            element={
                                <StaffProjectParticipation />
                            }
                        />

                        <Route
                            path="tasks"
                            element={
                                <StaffTaskManagement />
                            }
                        />

                        <Route
                            path="sprint-participation"
                            element={
                                <StaffSprintParticipation />
                            }
                        />

                        <Route
                            path="communication"
                            element={
                                <StaffCommunication />
                            }
                        />

                        <Route
                            path="reports"
                            element={<StaffReports />}
                        />

                        <Route
                            path="settings"
                            element={<StaffSettings />}
                        />
                    </Route>
                </Route>

                {/* ==================================================
                    DEVELOPER
                ================================================== */}

                <Route
                    element={
                        <ContributorTypeRoute
                            allowedTypes={["developer"]}
                        />
                    }
                >
                    <Route
                        path="/developer"
                        element={<DeveloperLayout />}
                    >
                        <Route
                            index
                            element={
                                <Navigate
                                    to="dashboard"
                                    replace
                                />
                            }
                        />

                        <Route
                            path="dashboard"
                            element={
                                <DeveloperDashboard />
                            }
                        />

                        <Route
                            path="work"
                            element={<Developer />}
                        />

                        <Route
                            path="communication"
                            element={
                                <DeveloperCommunication />
                            }
                        />

                        <Route
                            path="profile"
                            element={
                                <DeveloperProfile />
                            }
                        />

                        <Route
                            path="projects"
                            element={
                                <DeveloperProjects />
                            }
                        />

                        <Route
                            path="reports"
                            element={
                                <DeveloperReports />
                            }
                        />

                        <Route
                            path="settings"
                            element={
                                <DeveloperSettings />
                            }
                        />

                        <Route
                            path="sprint-participation"
                            element={
                                <DeveloperSprintParticipation />
                            }
                        />

                        <Route
                            path="tasks"
                            element={<DeveloperTasks />}
                        />
                    </Route>
                </Route>

                {/* ==================================================
                    TEAM LEADER
                ================================================== */}

                <Route
                    element={
                        <ContributorTypeRoute
                            allowedTypes={["team leader"]}
                        />
                    }
                >
                    <Route
                        path="/team-leader"
                        element={<TeamLeaderLayout />}
                    >

                        {/* ==================================================
                            DEFAULT
                        ================================================== */}

                        <Route
                            index
                            element={
                                <Navigate
                                    to="dashboard"
                                    replace
                                />
                            }
                        />

                        {/* ==================================================
                            1. DASHBOARD
                        ================================================== */}

                        <Route
                            path="dashboard"
                            element={
                                <TeamLeader />
                            }
                        />

                        {/* ==================================================
                            2. TASK MANAGEMENT
                        ================================================== */}

                        <Route
                            path="task-management"
                            element={
                                <TeamLeaderTaskManagement />
                            }
                        />

                        {/* ==================================================
                            3. PROFILE MANAGEMENT
                        ================================================== */}

                        <Route
                            path="profile-management"
                            element={
                                <TeamLeaderProfileManagement />
                            }
                        />

                        {/* ==================================================
                            4. PROJECT PARTICIPATION
                        ================================================== */}

                        <Route
                            path="project-participation"
                            element={
                                <TeamLeaderProjectParticipation />
                            }
                        />

                        {/* ==================================================
                            5. SPRINT PARTICIPATION
                        ================================================== */}

                        <Route
                            path="sprint-participation"
                            element={
                                <TeamLeaderSprintParticipation />
                            }
                        />

                        {/* ==================================================
                            6. COMMUNICATION
                        ================================================== */}

                        <Route
                            path="communication"
                            element={
                                <TeamLeaderCommunication />
                            }
                        />

                        {/* ==================================================
                            7. REPORTS
                        ================================================== */}

                        <Route
                            path="reports"
                            element={
                                <TeamLeaderReports />
                            }
                        />

                        {/* ==================================================
                            8. SETTINGS & PREFERENCES
                        ================================================== */}

                        <Route
                            path="settings"
                            element={
                                <TeamLeaderSettings />
                            }
                        />

                    </Route>
                </Route>

            </Route>

            {/* ==================================================
                CATCH-ALL
            ================================================== */}

            <Route
                path="*"
                element={
                    <Navigate
                        to="/login"
                        replace
                    />
                }
            />

        </Routes>
    );
}

// ============================================================
// EXPORT
// ============================================================

export default AppRoutes;