
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

import TeamLeaderLayout
    from "../layouts/TeamLeaderLayout";

import TeamLeaderDashboard
    from "../pages/contributor/team-leader/TeamLeaderDashboard";

import TeamLeader
    from "../pages/contributor/team-leader/TeamLeader";

// ============================================================
// TEAM LEADER - TEAM MANAGEMENT
// ============================================================

import ViewAssignedTeam
    from "../components/contributor/teamleader/team-management/ViewAssignedTeam";

import ViewTeamTasks
    from "../components/contributor/teamleader/team-management/ViewTeamTasks";

import MonitorTeamProgress
    from "../components/contributor/teamleader/team-management/MonitorTeamProgress";

import CoordinateTeamWork
    from "../components/contributor/teamleader/team-management/CoordinateTeamWork";

import ViewTeamPerformance
    from "../components/contributor/teamleader/team-management/ViewTeamPerformance";

// ============================================================
// TEAM LEADER - COMMUNICATION
// ============================================================

import CommunicateWithManager
    from "../components/contributor/teamleader/communication/CommunicateWithManager";

// ============================================================
// ROLE HELPERS
// ============================================================

function normalizeRole(role) {

    if (
        role === 1 ||
        role === "1" ||
        String(role ?? "")
            .trim()
            .toLowerCase() === "admin"
    ) {
        return "Admin";
    }

    if (
        role === 2 ||
        role === "2" ||
        String(role ?? "")
            .trim()
            .toLowerCase() === "manager"
    ) {
        return "Manager";
    }

    if (
        role === 3 ||
        role === "3" ||
        String(role ?? "")
            .trim()
            .toLowerCase() === "contributor"
    ) {
        return "Contributor";
    }

    return "";
}

// ============================================================
// CONTRIBUTOR TYPE HELPERS
// ============================================================

function normalizeClassification(value) {

    return String(value ?? "")
        .trim()
        .toLowerCase()
        .replace(/[_-]+/g, " ")
        .replace(/\s+/g, " ");
}

function getContributorClassifications(user) {

    return [
        user?.contributorTypeName,
        user?.ContributorTypeName,

        user?.contributorSubTypeName,
        user?.ContributorSubTypeName,

        user?.contributorType,
        user?.ContributorType,

        user?.contributorSubType,
        user?.ContributorSubType,
    ]
        .filter(Boolean)
        .map(normalizeClassification);
}

// ============================================================
// ROLE GUARD
// ============================================================

function RoleRoute({ allowedRoles }) {

    const user = getCurrentUser();

    const userRole = normalizeRole(
        user?.role ??
        user?.Role ??
        user?.roleId
    );

    const allowed = allowedRoles.includes(userRole);

    if (!allowed) {

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

function ContributorTypeRoute({ allowedTypes }) {

    const user = getCurrentUser();

    const userRole = normalizeRole(
        user?.role ??
        user?.Role ??
        user?.roleId
    );

    // --------------------------------------------------------
    // User must be a Contributor
    // --------------------------------------------------------

    if (userRole !== "Contributor") {

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    // --------------------------------------------------------
    // Get contributor classifications
    // --------------------------------------------------------

    const classifications =
        getContributorClassifications(user);

    // --------------------------------------------------------
    // Check allowed contributor type
    // --------------------------------------------------------

    const allowed =
        classifications.some(
            (classification) =>
                allowedTypes.includes(
                    classification
                )
        );

    if (!allowed) {

        console.warn(
            "Contributor dashboard access denied.",
            {
                user,
                classifications,
                allowedTypes,
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
                PUBLIC ROUTES
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
                AUTHENTICATION PROTECTION
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

                        {/* ==============================
                            DASHBOARD
                        ============================== */}

                        <Route
                            path="dashboard"
                            element={<ManagerDashboard />}
                        />

                        {/* ==============================
                            PROJECTS
                        ============================== */}

                        <Route
                            path="projects"
                            element={<ProjectManagement />}
                        />

                        {/* ==============================
                            SPRINTS
                        ============================== */}

                        <Route
                            path="sprints"
                            element={<SprintManagement />}
                        />

                        {/* ==============================
                            TEAM
                        ============================== */}

                        <Route
                            path="team"
                            element={<ManagerTeamManagement />}
                        />

                        {/* ==============================
                            COMMUNICATION
                        ============================== */}

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
                            element={<SendProjectAnnouncement />}
                        />

                        {/* ==============================
                            AI
                        ============================== */}

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
                            element={<AITeamPerformance />}
                        />

                        <Route
                            path="ai-progress"
                            element={<AIPredictProgress />}
                        />

                        <Route
                            path="ai-deadline"
                            element={<AIDeadlinePrediction />}
                        />

                        <Route
                            path="ai-sprint-planning"
                            element={<AISprintPlanning />}
                        />

                        <Route
                            path="ai-project-summary"
                            element={
                                <AIAutomatedProjectSummary />
                            }
                        />

                        <Route
                            path="ai-bottlenecks"
                            element={<AIDetectBottlenecks />}
                        />

                        {/* ==============================
                            REPORTS
                        ============================== */}

                        <Route
                            path="reports"
                            element={<ManagerReports />}
                        />

                        {/* ==============================
                            PROFILE
                        ============================== */}

                        <Route
                            path="profile"
                            element={<ManagerProfile />}
                        />

                        {/* ==============================
                            SETTINGS
                        ============================== */}

                        <Route
                            path="settings"
                            element={<ManagerSettings />}
                        />

                        {/* ==============================
                            HELP
                        ============================== */}

                        <Route
                            path="help"
                            element={
                                <div className="p-6">
                                    Help
                                </div>
                            }
                        />

                        {/* ==============================
                            LOGOUT
                        ============================== */}

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
                            allowedTypes={[
                                "staff",
                            ]}
                        />
                    }
                >

                    <Route
                        path="/staff"
                        element={<StaffLayout />}
                    >

                        {/* ==============================
                            DEFAULT
                        ============================== */}

                        <Route
                            index
                            element={
                                <Navigate
                                    to="dashboard"
                                    replace
                                />
                            }
                        />

                        {/* ==============================
                            DASHBOARD
                        ============================== */}

                        <Route
                            path="dashboard"
                            element={<StaffDashboard />}
                        />

                        {/* ==============================
                            STAFF WORK
                        ============================== */}

                       

                        {/* ==============================
                            PROFILE MANAGEMENT
                        ============================== */}

                        <Route
                            path="profile"
                            element={
                                <StaffProfileManagement />
                            }
                        />

                        {/* ==============================
                            PROJECT PARTICIPATION
                        ============================== */}

                        <Route
                            path="projects"
                            element={
                                <StaffProjectParticipation />
                            }
                        />

                        {/* ==============================
                            TASK MANAGEMENT
                        ============================== */}

                        <Route
                            path="tasks"
                            element={
                                <StaffTaskManagement />
                            }
                        />

                        {/* ==============================
                            SPRINT PARTICIPATION
                        ============================== */}

                        <Route
                            path="sprint-participation"
                            element={
                                <StaffSprintParticipation />
                            }
                        />

                        {/* ==============================
                            COMMUNICATION
                        ============================== */}

                        <Route
                            path="communication"
                            element={
                                <StaffCommunication />
                            }
                        />

                        {/* ==============================
                            REPORTS
                        ============================== */}

                        <Route
                            path="reports"
                            element={
                                <StaffReports />
                            }
                        />

                        {/* ==============================
                            SETTINGS
                        ============================== */}

                        <Route
                            path="settings"
                            element={
                                <StaffSettings />
                            }
                        />

                    </Route>

                </Route>

                {/* ==================================================
                    DEVELOPER
                ================================================== */}

                <Route
                    element={
                        <ContributorTypeRoute
                            allowedTypes={[
                                "developer",
                            ]}
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

                        {/* ==============================
                            DASHBOARD
                        ============================== */}

                        <Route
                            path="dashboard"
                            element={<DeveloperDashboard />}
                        />

                        {/* ==============================
                            MAIN DEVELOPER WORK
                        ============================== */}

                        <Route
                            path="work"
                            element={<Developer />}
                        />

                        {/* ==============================
                            COMMUNICATION
                        ============================== */}

                        <Route
                            path="communication"
                            element={
                                <DeveloperCommunication />
                            }
                        />

                        {/* ==============================
                            PROFILE
                        ============================== */}

                        <Route
                            path="profile"
                            element={<DeveloperProfile />}
                        />

                        {/* ==============================
                            PROJECTS
                        ============================== */}

                        <Route
                            path="projects"
                            element={<DeveloperProjects />}
                        />

                        {/* ==============================
                            REPORTS
                        ============================== */}

                        <Route
                            path="reports"
                            element={<DeveloperReports />}
                        />

                        {/* ==============================
                            SETTINGS
                        ============================== */}

                        <Route
                            path="settings"
                            element={<DeveloperSettings />}
                        />

                        {/* ==============================
                            SPRINT PARTICIPATION
                        ============================== */}

                        <Route
                            path="sprint-participation"
                            element={
                                <DeveloperSprintParticipation />
                            }
                        />

                        {/* ==============================
                            TASK MANAGEMENT
                        ============================== */}

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
                            allowedTypes={[
                                "team leader",
                            ]}
                        />
                    }
                >

                    <Route
                        path="/team-leader"
                        element={<TeamLeaderLayout />}
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

                        {/* ==============================
                            DASHBOARD
                        ============================== */}

                        <Route
                            path="dashboard"
                            element={
                                <TeamLeaderDashboard />
                            }
                        />

                        {/* ==============================
                            MAIN WORK
                        ============================== */}

                        <Route
                            path="work"
                            element={<TeamLeader />}
                        />

                        {/* ==============================
                            TEAM MANAGEMENT
                        ============================== */}

                        <Route
                            path="assigned-team"
                            element={<ViewAssignedTeam />}
                        />

                        <Route
                            path="team-tasks"
                            element={<ViewTeamTasks />}
                        />

                        <Route
                            path="team-progress"
                            element={
                                <MonitorTeamProgress />
                            }
                        />

                        <Route
                            path="coordinate-work"
                            element={
                                <CoordinateTeamWork />
                            }
                        />

                        <Route
                            path="team-performance"
                            element={
                                <ViewTeamPerformance />
                            }
                        />

                        {/* ==============================
                            COMMUNICATION
                        ============================== */}

                        <Route
                            path="manager-communication"
                            element={
                                <CommunicateWithManager />
                            }
                        />

                    </Route>

                </Route>

            </Route>

            {/* ==================================================
                404
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
