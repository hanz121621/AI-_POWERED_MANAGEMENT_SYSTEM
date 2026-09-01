
// ============================================================
// APP ROUTES
// AIPMS
//
// Application Routing
//
// Roles:
// - Public
// - Admin
// - Manager
// - Staff
// - Developer
// - Team Leader
// ============================================================

import {
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

// ============================================================
// PUBLIC
// ============================================================

import LandingPage from "../pages/Auth/LandingPage";
import Login from "../pages/Auth/Login";
import Logout from "../pages/Auth/Logout";
import ChangePassword from "../pages/Auth/ChangePassword";

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

import ManagerLayout from "../layouts/ManagerLayout";
import ManagerDashboard from "../pages/manager/ManagerDashboard";
import ProjectManagement from "../pages/manager/ProjectManagement";
import SprintManagement from "../pages/manager/SprintManagement";

import ManagerTeamManagement
    from "../pages/manager/TeamManagement";

// ============================================================
// MANAGER NOTIFICATIONS
// COMM-001 — View Notifications
// ============================================================

import Notifications
    from "../pages/manager/Notifications";

// ============================================================
// MANAGER MESSAGES
// COMM-002 — Send Message to Team Leader
// ============================================================

import ManagerMessages
    from "../pages/manager/ManagerMessages";

// ============================================================
// MANAGER ACTIVITY FEED
// COMM-004 — View Activity Feed
// ============================================================

import ActivityFeed
    from "../pages/manager/ActivityFeed";

// ============================================================
// MANAGER PROJECT ANNOUNCEMENT
// COMM-005 — Send Project Announcement
// ============================================================

import SendProjectAnnouncement
    from "../components/manager/notification/SendProjectAnnouncement";

// ============================================================
// MANAGER REPORTS
// ============================================================

import ManagerReports
    from "../pages/manager/ReportsPage";

// ============================================================
// MANAGER PROFILE
// ============================================================

import ManagerProfile
    from "../components/manager/profile/ManagerProfile";

// ============================================================
// MANAGER SETTINGS
// ============================================================

import ManagerSettings
    from "../pages/manager/ManagerSettings";

// ============================================================
// AI - MANAGER
// ============================================================

// AI-001 — View AI Features
import AIFeatures
    from "../pages/manager/AIFeatures";

// AI-002 — Predict Project Risk
import AIPredictRisk
    from "../components/manager/ai/AIPredictRisk";

// AI-003 — Generate Project Recommendations
import AIGenerateRecommendations
    from "../components/manager/ai/AIGenerateRecommendations";

// AI-004 — Analyze Team Performance
import AITeamPerformance
    from "../components/manager/ai/AITeamPerformance";

// AI-005 — Predict Project Progress
import AIPredictProgress
    from "../components/manager/ai/AIPredictProgress";

// AI-006 — AI Deadline Prediction
import AIDeadlinePrediction
    from "../components/manager/ai/AIDeadlinePrediction";

// AI-007 — AI Sprint Planning
import AISprintPlanning
    from "../components/manager/ai/AISprintPlanning";

// AI-008 — Automated Project Summary
import AIAutomatedProjectSummary
    from "../components/manager/ai/AIAutomatedProjectSummary";

// AI-009 — Detect Project Bottlenecks
import AIDetectBottlenecks
    from "../components/manager/ai/AIDetectBottlenecks";

// ============================================================
// STAFF
// ============================================================

import StaffLayout
    from "../layouts/StaffLayout";

import StaffDashboard
    from "../pages/contributor/staff/StaffDashboard";

import AddTaskComment
    from "../components/contributor/staff/AddTaskComment";

import PerformSpecializedWork
    from "../components/contributor/staff/PerformSpecializedWork";

import SubmitCompletedWork
    from "../components/contributor/staff/SubmitCompletedWork";

import UpdateTaskStatus
    from "../components/contributor/staff/UpdateTaskStatus";

import UploadWorkFiles
    from "../components/contributor/staff/UploadWorkFiles";

import ViewMyWork
    from "../components/contributor/staff/ViewMyWork";

// ============================================================
// DEVELOPER
// ============================================================

import DeveloperLayout
    from "../layouts/DeveloperLayout";

import DeveloperDashboard
    from "../pages/contributor/developer/DeveloperDashboard";

import Developer
    from "../pages/contributor/developer/Developer";

// ============================================================
// TEAM LEADER
// ============================================================

import TeamLeaderLayout
    from "../layouts/TeamLeaderLayout";

import TeamLeaderDashboard
    from "../pages/contributor/team-leader/TeamLeaderDashboard";

import TeamLeader
    from "../pages/contributor/team-leader/TeamLeader";

import ViewAssignedTeam
    from "../components/contributor/teamleader/ViewAssignedTeam";

import ViewTeamTasks
    from "../components/contributor/teamleader/ViewTeamTasks";

import MonitorTeamProgress
    from "../components/contributor/teamleader/MonitorTeamProgress";

import CoordinateTeamWork
    from "../components/contributor/teamleader/CoordinateTeamWork";

import CommunicateWithManager
    from "../components/contributor/teamleader/CommunicateWithManager";

import ViewTeamPerformance
    from "../components/contributor/teamleader/ViewTeamPerformance";

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
                ADMIN ROUTES
            ================================================== */}

            <Route
                path="/admin"
                element={<AdminLayout />}
            >
                {/* ADMIN DEFAULT */}

                <Route
                    index
                    element={
                        <Navigate
                            to="dashboard"
                            replace
                        />
                    }
                />

                {/* ADMIN DASHBOARD */}

                <Route
                    path="dashboard"
                    element={<AdminDashboard />}
                />

                {/* ADMIN USERS */}

                <Route
                    path="users"
                    element={<AdminUsers />}
                />

                {/* ADMIN TEAM MANAGEMENT */}

                <Route
                    path="teams"
                    element={<AdminTeamManagement />}
                />

                {/* ADMIN PROJECT OVERSIGHT */}

                <Route
                    path="projects"
                    element={<ProjectOversight />}
                />

                {/* ADMIN REPORTS */}

                <Route
                    path="reports"
                    element={<Reports />}
                />

                {/* ADMIN AI */}

                <Route
                    path="ai-admin"
                    element={<AIAdministration />}
                />

                {/* SYSTEM ADMINISTRATION */}

                <Route
                    path="system-admin"
                    element={<SystemAdministration />}
                />

                {/* SYSTEM SETTINGS */}

                <Route
                    path="system/settings"
                    element={<SystemSettings />}
                />

                {/* NOTIFICATION SETTINGS */}

                <Route
                    path="system/notifications"
                    element={<NotificationSettings />}
                />

                {/* SECURITY SETTINGS */}

                <Route
                    path="system/security"
                    element={<SecuritySettings />}
                />

                {/* PROFILE */}

                <Route
                    path="profile"
                    element={<ProfileManagement />}
                />

                {/* ADMIN SETTINGS */}

                <Route
                    path="settings"
                    element={<Settings />}
                />
            </Route>

            {/* ==================================================
                MANAGER ROUTES
            ================================================== */}

            <Route
                path="/manager"
                element={<ManagerLayout />}
            >
                {/* MANAGER DEFAULT */}

                <Route
                    index
                    element={
                        <Navigate
                            to="dashboard"
                            replace
                        />
                    }
                />

                {/* MANAGER DASHBOARD */}

                <Route
                    path="dashboard"
                    element={<ManagerDashboard />}
                />

                {/* PROJECT MANAGEMENT */}

                <Route
                    path="projects"
                    element={<ProjectManagement />}
                />

                {/* SPRINT MANAGEMENT */}

                <Route
                    path="sprints"
                    element={<SprintManagement />}
                />

                {/* TEAM MANAGEMENT */}

                <Route
                    path="team"
                    element={<ManagerTeamManagement />}
                />

                {/* NOTIFICATIONS */}

                <Route
                    path="notifications"
                    element={<Notifications />}
                />

                {/* MESSAGES */}

                <Route
                    path="messages"
                    element={<ManagerMessages />}
                />

                {/* ACTIVITY FEED */}

                <Route
                    path="activity-feed"
                    element={<ActivityFeed />}
                />

                {/* PROJECT ANNOUNCEMENT */}

                <Route
                    path="project-announcement"
                    element={<SendProjectAnnouncement />}
                />

                {/* AI FEATURES */}

                <Route
                    path="ai-features"
                    element={<AIFeatures />}
                />

                {/* AI PROJECT RISK */}

                <Route
                    path="ai-risk"
                    element={<AIPredictRisk />}
                />

                {/* AI RECOMMENDATIONS */}

                <Route
                    path="ai-recommendations"
                    element={<AIGenerateRecommendations />}
                />

                {/* AI TEAM PERFORMANCE */}

                <Route
                    path="ai-team-performance"
                    element={<AITeamPerformance />}
                />

                {/* AI PROJECT PROGRESS */}

                <Route
                    path="ai-progress"
                    element={<AIPredictProgress />}
                />

                {/* AI DEADLINE */}

                <Route
                    path="ai-deadline"
                    element={<AIDeadlinePrediction />}
                />

                {/* AI SPRINT PLANNING */}

                <Route
                    path="ai-sprint-planning"
                    element={<AISprintPlanning />}
                />

                {/* AI PROJECT SUMMARY */}

                <Route
                    path="ai-project-summary"
                    element={<AIAutomatedProjectSummary />}
                />

                {/* AI BOTTLENECKS */}

                <Route
                    path="ai-bottlenecks"
                    element={<AIDetectBottlenecks />}
                />

                {/* MANAGER REPORTS */}

                <Route
                    path="reports"
                    element={<ManagerReports />}
                />

                {/* MANAGER PROFILE */}

                <Route
                    path="profile"
                    element={<ManagerProfile />}
                />

                {/* MANAGER SETTINGS */}

                <Route
                    path="settings"
                    element={<ManagerSettings />}
                />

                {/* MANAGER HELP */}

                <Route
                    path="help"
                    element={
                        <div className="p-6">
                            Help
                        </div>
                    }
                />

                {/* MANAGER LOGOUT */}

                <Route
                    path="logout"
                    element={<Logout />}
                />
            </Route>

            {/* ==================================================
                STAFF ROUTES
            ================================================== */}

            <Route
                path="/staff"
                element={<StaffLayout />}
            >
                {/* STAFF DEFAULT */}

                <Route
                    index
                    element={
                        <Navigate
                            to="dashboard"
                            replace
                        />
                    }
                />

                {/* STAFF DASHBOARD */}

                <Route
                    path="dashboard"
                    element={<StaffDashboard />}
                />

                {/* MY WORK */}

                <Route
                    path="my-work"
                    element={<ViewMyWork />}
                />

                {/* TASK COMMENTS */}

                <Route
                    path="task-comments"
                    element={<AddTaskComment />}
                />

                {/* SPECIALIZED WORK */}

                <Route
                    path="specialized-work"
                    element={<PerformSpecializedWork />}
                />

                {/* SUBMIT COMPLETED WORK */}

                <Route
                    path="submit-work"
                    element={<SubmitCompletedWork />}
                />

                {/* UPDATE TASK STATUS */}

                <Route
                    path="update-task-status"
                    element={<UpdateTaskStatus />}
                />

                {/* UPLOAD WORK FILES */}

                <Route
                    path="upload-files"
                    element={<UploadWorkFiles />}
                />
            </Route>

            {/* ==================================================
                DEVELOPER ROUTES
            ================================================== */}

            <Route
                path="/developer"
                element={<DeveloperLayout />}
            >
                {/* DEVELOPER DEFAULT */}

                <Route
                    index
                    element={
                        <Navigate
                            to="dashboard"
                            replace
                        />
                    }
                />

                {/* DEVELOPER DASHBOARD */}

                <Route
                    path="dashboard"
                    element={<DeveloperDashboard />}
                />

                {/* DEVELOPER WORK */}

                <Route
                    path="work"
                    element={<Developer />}
                />
            </Route>

            {/* ==================================================
                TEAM LEADER ROUTES
            ================================================== */}

            <Route
                path="/team-leader"
                element={<TeamLeaderLayout />}
            >
                {/* TEAM LEADER DEFAULT */}

                <Route
                    index
                    element={
                        <Navigate
                            to="dashboard"
                            replace
                        />
                    }
                />

                {/* TEAM LEADER DASHBOARD */}

                <Route
                    path="dashboard"
                    element={<TeamLeaderDashboard />}
                />

                {/* TEAM LEADER WORK */}

                <Route
                    path="work"
                    element={<TeamLeader />}
                />

                {/* ASSIGNED TEAM */}

                <Route
                    path="assigned-team"
                    element={<ViewAssignedTeam />}
                />

                {/* TEAM TASKS */}

                <Route
                    path="team-tasks"
                    element={<ViewTeamTasks />}
                />

                {/* TEAM PROGRESS */}

                <Route
                    path="team-progress"
                    element={<MonitorTeamProgress />}
                />

                {/* COORDINATE TEAM WORK */}

                <Route
                    path="coordinate-work"
                    element={<CoordinateTeamWork />}
                />

                {/* MANAGER COMMUNICATION */}

                <Route
                    path="manager-communication"
                    element={<CommunicateWithManager />}
                />

                {/* TEAM PERFORMANCE */}

                <Route
                    path="team-performance"
                    element={<ViewTeamPerformance />}
                />
            </Route>

            {/* ==================================================
                404 / UNKNOWN ROUTES
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
