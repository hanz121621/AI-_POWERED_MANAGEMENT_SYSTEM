
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
// IMPORTANT:
//
// Actual developer pages:
//
// src/pages/contributor/developer/
//     Developer.jsx
//     DeveloperDashboard.jsx
//
// Actual developer components:
//
// src/components/contributor/developer/
//     AddTechnicalComments.jsx
//     ParticipateTechnicalReview.jsx
//     PerformDevelopmentTask.jsx
//     PerformSpecializedDevelopmentWork.jsx
//     ReportTechnicalBlocker.jsx
//     SubmitDevelopmentWork.jsx
//     UpdateDevelopmentTaskStatus.jsx
//     ViewDevelopmentWork.jsx
//
// Do NOT import nonexistent DeveloperProfileManagement,
// DeveloperProjectParticipation, DeveloperTaskManagement,
// DeveloperSprintParticipation, DeveloperCommunication,
// ReportsMonitoring or SettingPreferences pages.
// ============================================================

import DeveloperLayout
    from "../layouts/DeveloperLayout";

import DeveloperDashboard
    from "../pages/contributor/developer/DeveloperDashboard";

import Developer
    from "../pages/contributor/developer/Developer";

// ============================================================
// DEVELOPER COMPONENTS
// ============================================================

import ViewDevelopmentWork
    from "../components/contributor/developer/ViewDevelopmentWork";

import PerformDevelopmentTask
    from "../components/contributor/developer/PerformDevelopmentTask";

import UpdateDevelopmentTaskStatus
    from "../components/contributor/developer/UpdateDevelopmentTaskStatus";

import ReportTechnicalBlocker
    from "../components/contributor/developer/ReportTechnicalBlocker";

import SubmitDevelopmentWork
    from "../components/contributor/developer/SubmitDevelopmentWork";

import ParticipateTechnicalReview
    from "../components/contributor/developer/ParticipateTechnicalReview";

import AddTechnicalComments
    from "../components/contributor/developer/AddTechnicalComments";

import PerformSpecializedDevelopmentWork
    from "../components/contributor/developer/PerformSpecializedDevelopmentWork";

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

                    {/* ==================================================
                        DEVELOPER DEFAULT
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
                        DEVELOPER DASHBOARD
                        /developer/dashboard
                    ================================================== */}

                    <Route
                        path="dashboard"
                        element={<DeveloperDashboard />}
                    />

                    {/* ==================================================
                        DEVELOPER MAIN WORK PAGE
                        /developer/work
                    ================================================== */}

                    <Route
                        path="work"
                        element={<Developer />}
                    />

                    {/* ==================================================
                        DEVELOPER - VIEW DEVELOPMENT WORK
                        /developer/view-work
                    ================================================== */}

                    <Route
                        path="view-work"
                        element={<ViewDevelopmentWork />}
                    />

                    {/* ==================================================
                        DEVELOPER - PERFORM DEVELOPMENT TASK
                        /developer/development-task
                    ================================================== */}

                    <Route
                        path="development-task"
                        element={<PerformDevelopmentTask />}
                    />

                    {/* ==================================================
                        DEVELOPER - UPDATE DEVELOPMENT TASK STATUS
                        /developer/update-task-status
                    ================================================== */}

                    <Route
                        path="update-task-status"
                        element={<UpdateDevelopmentTaskStatus />}
                    />

                    {/* ==================================================
                        DEVELOPER - REPORT TECHNICAL BLOCKER
                        /developer/report-blocker
                    ================================================== */}

                    <Route
                        path="report-blocker"
                        element={<ReportTechnicalBlocker />}
                    />

                    {/* ==================================================
                        DEVELOPER - SUBMIT DEVELOPMENT WORK
                        /developer/submit-work
                    ================================================== */}

                    <Route
                        path="submit-work"
                        element={<SubmitDevelopmentWork />}
                    />

                    {/* ==================================================
                        DEVELOPER - TECHNICAL REVIEW
                        /developer/technical-review
                    ================================================== */}

                    <Route
                        path="technical-review"
                        element={<ParticipateTechnicalReview />}
                    />

                    {/* ==================================================
                        DEVELOPER - TECHNICAL COMMENTS
                        /developer/technical-comments
                    ================================================== */}

                    <Route
                        path="technical-comments"
                        element={<AddTechnicalComments />}
                    />

                    {/* ==================================================
                        DEVELOPER - SPECIALIZED DEVELOPMENT WORK
                        /developer/specialized-work
                    ================================================== */}

                    <Route
                        path="specialized-work"
                        element={<PerformSpecializedDevelopmentWork />}
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
                        element={<TeamLeaderDashboard />}
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
                        element={<CommunicateWithManager />}
                    />

                    <Route
                        path="team-performance"
                        element={<ViewTeamPerformance />}
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
