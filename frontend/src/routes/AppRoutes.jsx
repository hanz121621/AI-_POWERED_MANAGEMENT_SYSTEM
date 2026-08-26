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
import TeamManagementPage from "../pages/manager/TeamManagement";

// ============================================================
// MANAGER REPORTS
// REPORT-001: View Project Dashboard
// ============================================================

import ManagerReports
    from "../pages/manager/Reports";

// ============================================================
// AI - MANAGER
// ============================================================

// ============================================================
// AI-001
// View AI Recommendations
// ============================================================

import AIFeatures
    from "../pages/manager/AIFeatures";

// ============================================================
// AI-002
// Predict Project Risk
// ============================================================

import AIPredictRisk
    from "../components/manager/ai/AIPredictRisk";

// ============================================================
// AI-003
// Generate Project Recommendations
// ============================================================

import AIGenerateRecommendations
    from "../components/manager/ai/AIGenerateRecommendations";

// ============================================================
// AI-004
// Analyze Team Performance Using AI
// ============================================================

import AITeamPerformance
    from "../components/manager/ai/AITeamPerformance";

// ============================================================
// AI-005
// Predict Project Progress
// ============================================================

import AIPredictProgress
    from "../components/manager/ai/AIPredictProgress";

// ============================================================
// AI-006
// AI Deadline Prediction and Delay Warning
// ============================================================

import AIDeadlinePrediction
    from "../components/manager/ai/AIDeadlinePrediction";

// ============================================================
// AI-007
// Generate Sprint Planning Suggestions
// ============================================================

import AISprintPlanning
    from "../components/manager/ai/AISprintPlanning";

// ============================================================
// AI-008
// Generate Automated Project Summary
// ============================================================

import AIAutomatedProjectSummary
    from "../components/manager/ai/AIAutomatedProjectSummary";

// ============================================================
// AI-009
// Detect Project Bottlenecks
// ============================================================

import AIDetectBottlenecks
    from "../components/manager/ai/AIDetectBottlenecks";

// ============================================================
// CONTRIBUTOR
// ============================================================

import ContributorDashboard
    from "../pages/contributor/ContributorDashboard";

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

                {/* /admin → /admin/dashboard */}

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
                    ADMIN DASHBOARD
                ================================================== */}

                <Route
                    path="dashboard"
                    element={<AdminDashboard />}
                />

                {/* ==================================================
                    USER MANAGEMENT
                ================================================== */}

                <Route
                    path="users"
                    element={<AdminUsers />}
                />

                {/* ==================================================
                    TEAM MANAGEMENT
                ================================================== */}

                <Route
                    path="teams"
                    element={<TeamManagement />}
                />

                {/* ==================================================
                    PROJECT OVERSIGHT
                ================================================== */}

                <Route
                    path="projects"
                    element={<ProjectOversight />}
                />

                {/* ==================================================
                    REPORTS
                ================================================== */}

                <Route
                    path="reports"
                    element={<Reports />}
                />

                {/* ==================================================
                    AI ADMINISTRATION
                ================================================== */}

                <Route
                    path="ai-admin"
                    element={<AIAdministration />}
                />

                {/* ==================================================
                    SYSTEM ADMINISTRATION
                ================================================== */}

                <Route
                    path="system-admin"
                    element={<SystemAdministration />}
                />

                {/* ==================================================
                    SYSTEM SETTINGS
                ================================================== */}

                <Route
                    path="system/settings"
                    element={<SystemSettings />}
                />

                {/* ==================================================
                    NOTIFICATION SETTINGS
                ================================================== */}

                <Route
                    path="system/notifications"
                    element={<NotificationSettings />}
                />

                {/* ==================================================
                    SECURITY SETTINGS
                ================================================== */}

                <Route
                    path="system/security"
                    element={<SecuritySettings />}
                />

                {/* ==================================================
                    ADMIN PROFILE
                ================================================== */}

                <Route
                    path="profile"
                    element={<ProfileManagement />}
                />

                {/* ==================================================
                    ADMIN SETTINGS
                ================================================== */}

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

                {/* /manager → /manager/dashboard */}

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
                    REPORT-001
                    View Project Dashboard
                ================================================== */}

                <Route
                    path="dashboard"
                    element={<ManagerDashboard />}
                />

                {/* ==================================================
                    2. PROJECTS
                ================================================== */}

                <Route
                    path="projects"
                    element={<ProjectManagement />}
                />

                {/* ==================================================
                    3. SPRINT
                ================================================== */}

                <Route
                    path="sprints"
                    element={<SprintManagement />}
                />

                {/* ==================================================
                    4. TEAM
                ================================================== */}

                <Route
                    path="team"
                    element={<TeamManagementPage />}
                />

                {/* ==================================================
                    5. AI FEATURES
                    AI-001
                ================================================== */}

                <Route
                    path="ai-features"
                    element={<AIFeatures />}
                />

                {/* ==================================================
                    AI-002
                    Predict Project Risk
                ================================================== */}

                <Route
                    path="ai-risk"
                    element={<AIPredictRisk />}
                />

                {/* ==================================================
                    AI-003
                    Generate Project Recommendations
                ================================================== */}

                <Route
                    path="ai-recommendations"
                    element={
                        <AIGenerateRecommendations />
                    }
                />

                {/* ==================================================
                    AI-004
                    Analyze Team Performance
                ================================================== */}

                <Route
                    path="ai-team-performance"
                    element={
                        <AITeamPerformance />
                    }
                />

                {/* ==================================================
                    AI-005
                    Predict Project Progress
                ================================================== */}

                <Route
                    path="ai-progress"
                    element={
                        <AIPredictProgress />
                    }
                />

                {/* ==================================================
                    AI-006
                    Deadline Prediction
                ================================================== */}

                <Route
                    path="ai-deadline"
                    element={
                        <AIDeadlinePrediction />
                    }
                />

                {/* ==================================================
                    AI-007
                    Sprint Planning
                ================================================== */}

                <Route
                    path="ai-sprint-planning"
                    element={
                        <AISprintPlanning />
                    }
                />

                {/* ==================================================
                    AI-008
                    Automated Project Summary
                ================================================== */}

                <Route
                    path="ai-project-summary"
                    element={
                        <AIAutomatedProjectSummary />
                    }
                />

                {/* ==================================================
                    AI-009
                    Detect Project Bottlenecks
                ================================================== */}

                <Route
                    path="ai-bottlenecks"
                    element={
                        <AIDetectBottlenecks />
                    }
                />

                {/* ==================================================
                    6. REPORT
                    REPORT-001
                    View Project Dashboard
                ================================================== */}

                <Route
                    path="reports"
                    element={
                        <ManagerReports />
                    }
                />

                {/* ==================================================
                    7. PROFILE MANAGEMENT
                ================================================== */}

                <Route
                    path="profile"
                    element={
                        <div className="p-6">
                            Profile Management
                        </div>
                    }
                />

                {/* ==================================================
                    8. SETTINGS
                ================================================== */}

                <Route
                    path="settings"
                    element={
                        <div className="p-6">
                            Settings
                        </div>
                    }
                />

                {/* ==================================================
                    9. HELP
                ================================================== */}

                <Route
                    path="help"
                    element={
                        <div className="p-6">
                            Help
                        </div>
                    }
                />

                {/* ==================================================
                    LOGOUT
                ================================================== */}

                <Route
                    path="logout"
                    element={
                        <Logout />
                    }
                />

            </Route>

            {/* ==================================================
                CONTRIBUTOR ROUTES
            ================================================== */}

            <Route
                path="/contributor/dashboard"
                element={
                    <ContributorDashboard />
                }
            />

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

export default AppRoutes;