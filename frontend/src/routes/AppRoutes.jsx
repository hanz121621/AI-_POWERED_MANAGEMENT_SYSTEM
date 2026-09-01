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

import ManagerLayout from "../layouts/ManagerLayout";
import ManagerDashboard from "../pages/manager/ManagerDashboard";
import ProjectManagement from "../pages/manager/ProjectManagement";
import SprintManagement from "../pages/manager/SprintManagement";

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
//
// ACTUAL FILE STRUCTURE:
//
// src/pages/contributor/developer/
//
//     Communication.jsx
//     Developer.jsx
//     DeveloperDashboard.jsx
//     DeveloperSettings.jsx
//     Profile.jsx
//     Projects.jsx
//     Reports.jsx
//     Settings.jsx
//     SprintParticipation.jsx
//     Tasks.jsx
//
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

import ViewAssignedTeam from "../components/contributor/teamleader/team-management/ViewAssignedTeam";
import ViewTeamTasks from "../components/contributor/teamleader/team-management/ViewTeamTasks";
import MonitorTeamProgress from "../components/contributor/teamleader/team-management/MonitorTeamProgress";
import CoordinateTeamWork from "../components/contributor/teamleader/team-management/CoordinateTeamWork";
import ViewTeamPerformance from "../components/contributor/teamleader/team-management/ViewTeamPerformance";
import CommunicateWithManager from "../components/contributor/teamleader/communication/CommunicateWithManager";
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
                PROTECTED ROUTES
            ================================================== */}

            <Route element={<ProtectedRoute />}>

                {/* ==================================================
                    ADMIN
                ================================================== */}

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

                {/* ==================================================
                    MANAGER
                ================================================== */}

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
                        element={<AIGenerateRecommendations />}
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
                        element={<AIAutomatedProjectSummary />}
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

                {/* ==================================================
                    STAFF
                ================================================== */}

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
                        path="my-work"
                        element={<ViewMyWork />}
                    />

                    <Route
                        path="task-comments"
                        element={<AddTaskComment />}
                    />

                    <Route
                        path="specialized-work"
                        element={<PerformSpecializedWork />}
                    />

                    <Route
                        path="submit-work"
                        element={<SubmitCompletedWork />}
                    />

                    <Route
                        path="update-task-status"
                        element={<UpdateTaskStatus />}
                    />

                    <Route
                        path="upload-files"
                        element={<UploadWorkFiles />}
                    />

                </Route>

                {/* ==================================================
                    DEVELOPER
                ================================================== */}

                <Route
                    path="/developer"
                    element={<DeveloperLayout />}
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
                        /developer/dashboard
                    ============================== */}

                    <Route
                        path="dashboard"
                        element={<DeveloperDashboard />}
                    />

                    {/* ==============================
                        MAIN DEVELOPER WORK
                        /developer/work
                    ============================== */}

                    <Route
                        path="work"
                        element={<Developer />}
                    />

                    {/* ==============================
                        COMMUNICATION
                        /developer/communication
                    ============================== */}

                    <Route
                        path="communication"
                        element={<DeveloperCommunication />}
                    />

                    {/* ==============================
                        PROFILE
                        /developer/profile
                    ============================== */}

                    <Route
                        path="profile"
                        element={<DeveloperProfile />}
                    />

                    {/* ==============================
                        PROJECTS
                        /developer/projects
                    ============================== */}

                    <Route
                        path="projects"
                        element={<DeveloperProjects />}
                    />

                    {/* ==============================
                        REPORTS
                        /developer/reports
                    ============================== */}

                    <Route
                        path="reports"
                        element={<DeveloperReports />}
                    />

                    {/* ==============================
                        SETTINGS
                        /developer/settings
                    ============================== */}

                    <Route
                        path="settings"
                        element={<DeveloperSettings />}
                    />

                    {/* ==============================
                        SPRINT PARTICIPATION
                        /developer/sprint-participation
                    ============================== */}

                    <Route
                        path="sprint-participation"
                        element={
                            <DeveloperSprintParticipation />
                        }
                    />

                    {/* ==============================
                        TASK MANAGEMENT
                        /developer/tasks
                    ============================== */}

                    <Route
                        path="tasks"
                        element={<DeveloperTasks />}
                    />

                </Route>

                {/* ==================================================
                    TEAM LEADER
                ================================================== */}

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

                    <Route
                        path="dashboard"
                        element={
                            <TeamLeaderDashboard />
                        }
                    />

                    <Route
                        path="work"
                        element={<TeamLeader />}
                    />

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
                        element={<MonitorTeamProgress />}
                    />

                    <Route
                        path="coordinate-work"
                        element={<CoordinateTeamWork />}
                    />

                    <Route
                        path="manager-communication"
                        element={
                            <CommunicateWithManager />
                        }
                    />

                    <Route
                        path="team-performance"
                        element={
                            <ViewTeamPerformance />
                        }
                    />

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