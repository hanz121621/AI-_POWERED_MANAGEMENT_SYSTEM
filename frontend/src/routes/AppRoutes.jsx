
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
import TeamManagement from "../pages/admin/TeamManagement";
import ProjectOversight from "../pages/admin/ProjectOversight";
import Reports from "../pages/admin/Reports";
import AIAdministration from "../pages/admin/AIAdministration";
import SystemAdministration from "../pages/admin/SystemAdministration";
import ProfileManagement from "../pages/admin/ProfileManagement";
import Settings from "../pages/admin/Settings";

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
import TaskManagement from "../pages/manager/TaskManagement";

// ============================================================
// STAFF / CONTRIBUTOR
// ============================================================

import StaffLayout from "../layouts/StaffLayout";

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

import AddTechnicalComments
    from "../components/contributor/developer/AddTechnicalComments";

import ParticipateTechnicalReview
    from "../components/contributor/developer/ParticipateTechnicalReview";

import PerformDevelopmentTask
    from "../components/contributor/developer/PerformDevelopmentTask";

import ReportTechnicalBlocker
    from "../components/contributor/developer/ReportTechnicalBlocker";

import SubmitDevelopmentWork
    from "../components/contributor/developer/SubmitDevelopmentWork";

import UpdateDevelopmentTaskStatus
    from "../components/contributor/developer/UpdateDevelopmentTaskStatus";

import ViewDevelopmentWork
    from "../components/contributor/developer/ViewDevelopmentWork";

// ============================================================
// TEAM LEADER
// ============================================================

import TeamLeaderLayout
    from "../layouts/TeamLeaderLayout";

import TeamLeaderDashboard
    from "../pages/contributor/team-leader/TeamLeaderDashboard";

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
// PROJECT PARTICIPATION
// ============================================================

// Main Project Participation page
import ProjectParticipation
    from "../pages/contributor/team-leader/ProjectParticipation";

// ============================================================
// PROJECT PARTICIPATION COMPONENTS
// Actual folder:
// src/components/contributor/teamleader/project/
// ============================================================

// CONT-PROJECT-001
import ViewAssignedProjects
    from "../components/contributor/teamleader/project/ViewAssignedProjects";

// CONT-PROJECT-002
import ViewProjectDetails
    from "../components/contributor/teamleader/project/ViewProjectDetails";

// CONT-PROJECT-003
import ViewProjectTeam
    from "../components/contributor/teamleader/project/ViewProjectTeam";

// CONT-PROJECT-004
import ViewProjectTasks
    from "../components/contributor/teamleader/project/ViewProjectTasks";

// CONT-PROJECT-005
import ViewProjectProgress
    from "../components/contributor/teamleader/project/ViewProjectProgress";

// CONT-PROJECT-006
import ParticipateProjectCommunication
    from "../components/contributor/teamleader/project/ParticipateProjectCommunication";

// CONT-PROJECT-007
import ViewProjectFiles
    from "../components/contributor/teamleader/project/ViewProjectFiles";

// CONT-PROJECT-008
import RequestProjectAssistance
    from "../components/contributor/teamleader/project/RequestProjectAssistance";

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
                                to="/admin/dashboard"
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
                        element={<TeamManagement />}
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
                                to="/manager/dashboard"
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
                        path="tasks"
                        element={<TaskManagement />}
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
                                to="/staff/dashboard"
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
                                to="/developer/dashboard"
                                replace
                            />
                        }
                    />

                    <Route
                        path="dashboard"
                        element={<DeveloperDashboard />}
                    />

                    <Route
                        path="my-work"
                        element={<ViewDevelopmentWork />}
                    />

                    <Route
                        path="tasks"
                        element={<PerformDevelopmentTask />}
                    />

                    <Route
                        path="task-status"
                        element={
                            <UpdateDevelopmentTaskStatus />
                        }
                    />

                    <Route
                        path="blockers"
                        element={
                            <ReportTechnicalBlocker />
                        }
                    />

                    <Route
                        path="submissions"
                        element={
                            <SubmitDevelopmentWork />
                        }
                    />

                    <Route
                        path="reviews"
                        element={
                            <ParticipateTechnicalReview />
                        }
                    />

                    <Route
                        path="comments"
                        element={
                            <AddTechnicalComments />
                        }
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
                        TEAM LEADER ROOT
                    ================================================== */}

                    <Route
                        index
                        element={
                            <Navigate
                                to="/team-leader/dashboard"
                                replace
                            />
                        }
                    />

                    {/* ==================================================
                        DASHBOARD
                    ================================================== */}

                    <Route
                        path="dashboard"
                        element={<TeamLeaderDashboard />}
                    />

                    {/* ==================================================
                        TEAM LEADER FEATURES
                    ================================================== */}

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

                    {/* ==================================================
                        PROJECT PARTICIPATION MAIN PAGE
                    ================================================== */}

                    <Route
                        path="project-participation"
                        element={<ProjectParticipation />}
                    />

                    {/* ==================================================
                        CONT-PROJECT-001
                        VIEW ASSIGNED PROJECTS
                    ================================================== */}

                    <Route
                        path="project-participation/assigned-projects"
                        element={<ViewAssignedProjects />}
                    />

                    {/* ==================================================
                        CONT-PROJECT-002
                        VIEW PROJECT DETAILS
                    ================================================== */}

                    <Route
                        path="project-participation/details"
                        element={<ViewProjectDetails />}
                    />

                    {/* ==================================================
                        CONT-PROJECT-003
                        VIEW PROJECT TEAM
                    ================================================== */}

                    <Route
                        path="project-participation/team"
                        element={<ViewProjectTeam />}
                    />

                    {/* ==================================================
                        CONT-PROJECT-004
                        VIEW PROJECT TASKS
                    ================================================== */}

                    <Route
                        path="project-participation/tasks"
                        element={<ViewProjectTasks />}
                    />

                    {/* ==================================================
                        CONT-PROJECT-005
                        VIEW PROJECT PROGRESS
                    ================================================== */}

                    <Route
                        path="project-participation/progress"
                        element={<ViewProjectProgress />}
                    />

                    {/* ==================================================
                        CONT-PROJECT-006
                        PARTICIPATE IN PROJECT COMMUNICATION
                    ================================================== */}

                    <Route
                        path="project-participation/communication"
                        element={
                            <ParticipateProjectCommunication />
                        }
                    />

                    {/* ==================================================
                        CONT-PROJECT-007
                        VIEW PROJECT FILES
                    ================================================== */}

                    <Route
                        path="project-participation/files"
                        element={<ViewProjectFiles />}
                    />

                    {/* ==================================================
                        CONT-PROJECT-008
                        REQUEST PROJECT ASSISTANCE
                    ================================================== */}

                    <Route
                        path="project-participation/assistance"
                        element={
                            <RequestProjectAssistance />
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
