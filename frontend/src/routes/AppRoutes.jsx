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

import SystemSettings from "../components/admin/system-administration/SystemSettings";
import NotificationSettings from "../components/admin/system-administration/NotificationSettings";
import SecuritySettings from "../components/admin/system-administration/SecuritySettings";

// ============================================================
// MANAGER
// ============================================================

import ManagerLayout from "../layouts/ManagerLayout";
import ManagerDashboard from "../pages/manager/ManagerDashboard";
import ProjectManagement from "../pages/manager/ProjectManagement";
import SprintManagement from "../pages/manager/SprintManagement";
import TaskManagement from "../pages/manager/TaskManagement";

// ============================================================
// CONTRIBUTOR
// ============================================================

import ContributorDashboard from "../pages/contributor/ContributorDashboard";

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
                element={
                    <LandingPage />
                }
            />

            <Route
                path="/login"
                element={
                    <Login />
                }
            />

            <Route
                path="/logout"
                element={
                    <Logout />
                }
            />

            <Route
                path="/change-password"
                element={
                    <ChangePassword />
                }
            />

            {/* ==================================================
                AUTHENTICATED ROUTES
            ================================================== */}

            <Route
                element={
                    <ProtectedRoute />
                }
            >

                {/* ==================================================
                    ADMIN
                ================================================== */}

                <Route
                    path="/admin"
                    element={
                        <AdminLayout />
                    }
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
                            <AdminDashboard />
                        }
                    />

                    <Route
                        path="users"
                        element={
                            <AdminUsers />
                        }
                    />

                    <Route
                        path="teams"
                        element={
                            <TeamManagement />
                        }
                    />

                    <Route
                        path="projects"
                        element={
                            <ProjectOversight />
                        }
                    />

                    <Route
                        path="reports"
                        element={
                            <Reports />
                        }
                    />

                    <Route
                        path="ai-admin"
                        element={
                            <AIAdministration />
                        }
                    />

                    <Route
                        path="system-admin"
                        element={
                            <SystemAdministration />
                        }
                    />

                    <Route
                        path="system/settings"
                        element={
                            <SystemSettings />
                        }
                    />

                    <Route
                        path="system/notifications"
                        element={
                            <NotificationSettings />
                        }
                    />

                    <Route
                        path="system/security"
                        element={
                            <SecuritySettings />
                        }
                    />

                    <Route
                        path="profile"
                        element={
                            <ProfileManagement />
                        }
                    />

                    <Route
                        path="settings"
                        element={
                            <Settings />
                        }
                    />

                </Route>

                {/* ==================================================
                    MANAGER
                ================================================== */}

                <Route
                    path="/manager"
                    element={
                        <ManagerLayout />
                    }
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
                            <ManagerDashboard />
                        }
                    />

                    <Route
                        path="projects"
                        element={
                            <ProjectManagement />
                        }
                    />

                    <Route
                        path="sprints"
                        element={
                            <SprintManagement />
                        }
                    />

                    <Route
                        path="tasks"
                        element={
                            <TaskManagement />
                        }
                    />

                </Route>

                {/* ==================================================
                    CONTRIBUTOR
                ================================================== */}

                <Route
                    path="/contributor/dashboard"
                    element={
                        <ContributorDashboard />
                    }
                />

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