
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
//
// ACTUAL STRUCTURE:
//
// src/pages/contributor/team-leader/
//     TeamLeader.jsx
//     TeamLeaderDashboard.jsx
//
// src/components/contributor/teamleader/
//     communication/
//     profile/
//     project-participation/
//     reports/
//     settings/
//     sprint-participation/
//     task-management/
//
// src/components/contributor/shared/
//     TeamLeaderNavbar.jsx
//     TeamLeaderSidebar.jsx
// ============================================================

import TeamLeaderLayout
    from "../layouts/TeamLeaderLayout";

import TeamLeaderDashboard
    from "../pages/contributor/team-leader/TeamLeaderDashboard";

import TeamLeader
    from "../pages/contributor/team-leader/TeamLeader";

// ============================================================
// TEAM LEADER - PROJECT PARTICIPATION
// ============================================================

import ViewAssignedProjects
    from "../components/contributor/teamleader/project-participation/ViewAssignedProjects";

import ViewProjectDetails
    from "../components/contributor/teamleader/project-participation/ViewProjectDetails";

// ============================================================
// TEAM LEADER - TASK MANAGEMENT
// ============================================================

import ViewTeamTasks
    from "../components/contributor/teamleader/task-management/ViewTeamTasks";

import CreateTeamTask
    from "../components/contributor/teamleader/task-management/CreateTeamTask";

import AssignTaskToContributor
    from "../components/contributor/teamleader/task-management/AssignTaskToContributor";

import DeleteTeamTask
    from "../components/contributor/teamleader/task-management/DeleteTeamTask";

import ReviewCompletedTasks
    from "../components/contributor/teamleader/task-management/ReviewCompletedTasks";

import SetTaskDeadline
    from "../components/contributor/teamleader/task-management/SetTaskDeadline";

import SetTaskPriority
    from "../components/contributor/teamleader/task-management/SetTaskPriority";

import UpdateTeamTask
    from "../components/contributor/teamleader/task-management/UpdateTeamTask";

import TeamLeaderUpdateTaskStatus
    from "../components/contributor/teamleader/task-management/UpdateTaskStatus";

// ============================================================
// TEAM LEADER - COMMUNICATION
// ============================================================

import MentionTeamMembers
    from "../components/contributor/teamleader/communication/MentionTeamMembers";

import ReceiveMessages
    from "../components/contributor/teamleader/communication/ReceiveMessages";

import TaskComments
    from "../components/contributor/teamleader/communication/TaskComments";

import ViewNotifications
    from "../components/contributor/teamleader/communication/ViewNotifications";

// ============================================================
// TEAM LEADER - REPORTS
// ============================================================

import TeamPerformanceReport
    from "../components/contributor/teamleader/reports/TeamPerformanceReport";

import TeamTaskHistory
    from "../components/contributor/teamleader/reports/TeamTaskHistory";

// ============================================================
// TEAM LEADER - SPRINT PARTICIPATION
// ============================================================

import ViewSprintProgress
    from "../components/contributor/teamleader/sprint-participation/ViewSprintProgress";

import ViewSprintTasks
    from "../components/contributor/teamleader/sprint-participation/ViewSprintTasks";

// ============================================================
// TEAM LEADER - PROFILE
// ============================================================

import ViewTeamLeaderProfile
    from "../components/contributor/teamleader/profile/ViewTeamLeaderProfile";

import UpdateTeamLeaderProfile
    from "../components/contributor/teamleader/profile/UpdateTeamLeaderProfile";

// ============================================================
// TEAM LEADER - SETTINGS
// ============================================================

import TeamLeaderAIPreferences
    from "../components/contributor/teamleader/settings/AIPreferences";

import TeamLeaderLanguagePreferences
    from "../components/contributor/teamleader/settings/LanguagePreferences";

import TeamLeaderNotificationPreferences
    from "../components/contributor/teamleader/settings/NotificationPreferences";

import TeamLeaderThemePreferences
    from "../components/contributor/teamleader/settings/ThemePreferences";

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
                        element={<DeveloperDashboard />}
                    />

                    <Route
                        path="work"
                        element={<Developer />}
                    />

                    <Route
                        path="communication"
                        element={<DeveloperCommunication />}
                    />

                    <Route
                        path="profile"
                        element={<DeveloperProfile />}
                    />

                    <Route
                        path="projects"
                        element={<DeveloperProjects />}
                    />

                    <Route
                        path="reports"
                        element={<DeveloperReports />}
                    />

                    <Route
                        path="settings"
                        element={<DeveloperSettings />}
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

                {/* ==================================================
                    TEAM LEADER
                ================================================== */}

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
                        DASHBOARD
                    ================================================== */}

                    <Route
                        path="dashboard"
                        element={
                            <TeamLeaderDashboard />
                        }
                    />

                    {/* ==================================================
                        MAIN WORK
                    ================================================== */}

                    <Route
                        path="work"
                        element={<TeamLeader />}
                    />

                    {/* ==================================================
                        PROJECT PARTICIPATION
                    ================================================== */}

                    <Route
                        path="assigned-team"
                        element={
                            <ViewAssignedProjects />
                        }
                    />

                    <Route
                        path="project-details"
                        element={
                            <ViewProjectDetails />
                        }
                    />

                    {/* ==================================================
                        TASK MANAGEMENT
                    ================================================== */}

                    <Route
                        path="team-tasks"
                        element={
                            <ViewTeamTasks />
                        }
                    />

                    <Route
                        path="create-team-task"
                        element={
                            <CreateTeamTask />
                        }
                    />

                    <Route
                        path="assign-task"
                        element={
                            <AssignTaskToContributor />
                        }
                    />

                    <Route
                        path="delete-team-task"
                        element={
                            <DeleteTeamTask />
                        }
                    />

                    <Route
                        path="review-completed-tasks"
                        element={
                            <ReviewCompletedTasks />
                        }
                    />

                    <Route
                        path="set-task-deadline"
                        element={
                            <SetTaskDeadline />
                        }
                    />

                    <Route
                        path="set-task-priority"
                        element={
                            <SetTaskPriority />
                        }
                    />

                    <Route
                        path="update-team-task"
                        element={
                            <UpdateTeamTask />
                        }
                    />

                    <Route
                        path="update-task-status"
                        element={
                            <TeamLeaderUpdateTaskStatus />
                        }
                    />

                    {/* ==================================================
                        COMMUNICATION
                    ================================================== */}

                    <Route
                        path="communication/mention"
                        element={
                            <MentionTeamMembers />
                        }
                    />

                    <Route
                        path="communication/messages"
                        element={
                            <ReceiveMessages />
                        }
                    />

                    <Route
                        path="communication/comments"
                        element={
                            <TaskComments />
                        }
                    />

                    <Route
                        path="communication/notifications"
                        element={
                            <ViewNotifications />
                        }
                    />

                    {/* ==================================================
                        REPORTS
                    ================================================== */}

                    <Route
                        path="team-progress"
                        element={
                            <TeamPerformanceReport />
                        }
                    />

                    <Route
                        path="team-performance"
                        element={
                            <TeamPerformanceReport />
                        }
                    />

                    <Route
                        path="team-task-history"
                        element={
                            <TeamTaskHistory />
                        }
                    />

                    {/* ==================================================
                        SPRINT PARTICIPATION
                    ================================================== */}

                    <Route
                        path="sprint-progress"
                        element={
                            <ViewSprintProgress />
                        }
                    />

                    <Route
                        path="sprint-tasks"
                        element={
                            <ViewSprintTasks />
                        }
                    />

                    {/* ==================================================
                        PROFILE
                    ================================================== */}

                    <Route
                        path="profile"
                        element={
                            <ViewTeamLeaderProfile />
                        }
                    />

                    <Route
                        path="profile/update"
                        element={
                            <UpdateTeamLeaderProfile />
                        }
                    />

                    {/* ==================================================
                        SETTINGS
                    ================================================== */}

                    <Route
                        path="settings/ai"
                        element={
                            <TeamLeaderAIPreferences />
                        }
                    />

                    <Route
                        path="settings/language"
                        element={
                            <TeamLeaderLanguagePreferences />
                        }
                    />

                    <Route
                        path="settings/notifications"
                        element={
                            <TeamLeaderNotificationPreferences />
                        }
                    />

                    <Route
                        path="settings/theme"
                        element={
                            <TeamLeaderThemePreferences />
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

export default AppRoutes;
