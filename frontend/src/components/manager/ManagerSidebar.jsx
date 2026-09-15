
// ============================================================
// AIPMS - MANAGER SIDEBAR
// src/components/manager/ManagerSidebar.jsx
// ============================================================

import {
    LayoutDashboard,
    FolderKanban,
    ListTodo,
    UsersRound,
    Sparkles,
    BarChart3,
    Users,
    Settings,
    HelpCircle,
    LogOut,
    X,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

function ManagerSidebar({ isMobileOpen, onCloseMobile }) {
    const navigate = useNavigate();

    const menuItems = [
        {
            name: "Dashboard",
            icon: LayoutDashboard,
            path: "/manager/dashboard",
        },
        {
            name: "Projects",
            icon: FolderKanban,
            path: "/manager/projects",
        },
        {
            name: "Sprint",
            icon: ListTodo,
            path: "/manager/sprints",
        },
        {
            name: "Team",
            icon: UsersRound,
            path: "/manager/team",
        },
        {
            name: "AI Features",
            icon: Sparkles,
            path: "/manager/ai-features",
        },
        {
            name: "Reports",
            icon: BarChart3,
            path: "/manager/reports",
        },
        {
            name: "Profile Management",
            icon: Users,
            path: "/manager/profile",
        },
    ];

    return (
        <aside
            className={`
                fixed inset-y-0 left-0 z-50
                flex h-screen min-h-screen w-64 shrink-0 flex-col
                bg-sidebar text-sidebar-foreground
                transition-transform duration-300 ease-in-out
                md:relative md:translate-x-0
                ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
            `}
        >
            {/* ==================================================
                LOGO / BRAND
            ================================================== */}

            <div className="flex items-center justify-between border-b border-sidebar-border px-5 py-6">
                <div>
                    <h1 className="text-xl font-bold text-sidebar-foreground">
                        Africom AI-PMS
                    </h1>

                    <p className="mt-1 text-sm text-sidebar-foreground/60">
                        Manager Panel
                    </p>
                </div>

                {/* Mobile close button */}
                <button
                    type="button"
                    onClick={onCloseMobile}
                    className="text-sidebar-foreground/60 hover:text-sidebar-foreground md:hidden"
                    aria-label="Close sidebar"
                >
                    <X size={24} />
                </button>
            </div>

            {/* ==================================================
                NAVIGATION
            ================================================== */}

            <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
                {menuItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            onClick={onCloseMobile}
                            className={({ isActive }) =>
                                `group flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200 ${
                                    isActive
                                        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md shadow-black/10"
                                        : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:translate-x-1"
                                }`
                            }
                        >
                            <Icon
                                size={20}
                                className="shrink-0 transition-transform duration-200 group-hover:scale-110"
                            />

                            <span className="text-sm font-medium">
                                {item.name}
                            </span>
                        </NavLink>
                    );
                })}
            </nav>

            {/* ==================================================
                BOTTOM MANAGER SECTION
            ================================================== */}

            <div className="border-t border-sidebar-border bg-sidebar p-4">
                {/* Manager identity */}
                <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-primary font-bold text-sidebar-primary-foreground shadow-md">
                        M
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-sidebar-foreground">
                            Manager
                        </h3>

                        <p className="text-xs text-sidebar-foreground/60">
                            Project Manager
                        </p>
                    </div>
                </div>

                {/* Settings */}
                <NavLink
                    to="/manager/settings"
                    onClick={onCloseMobile}
                    className={({ isActive }) =>
                        `group mb-1 flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200 ${
                            isActive
                                ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md shadow-black/10"
                                : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:translate-x-1"
                        }`
                    }
                >
                    <Settings
                        size={20}
                        className="transition-transform duration-200 group-hover:scale-110"
                    />

                    <span className="text-sm font-medium">
                        Settings
                    </span>
                </NavLink>

                {/* Help */}
                <NavLink
                    to="/manager/help"
                    onClick={onCloseMobile}
                    className="group mb-1 flex items-center gap-3 rounded-lg px-4 py-3 text-sidebar-foreground/75 transition-all duration-200 hover:translate-x-1 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                    <HelpCircle
                        size={20}
                        className="transition-transform duration-200 group-hover:scale-110"
                    />

                    <span className="text-sm font-medium">
                        Help
                    </span>
                </NavLink>

                {/* Logout */}
                <button
                    type="button"
                    onClick={() => navigate("/logout")}
                    className="group flex w-full items-center gap-3 rounded-lg px-4 py-3 text-red-400 transition-all duration-200 hover:translate-x-1 hover:bg-red-500/10 hover:text-red-300"
                >
                    <LogOut
                        size={20}
                        className="transition-transform duration-200 group-hover:scale-110"
                    />

                    <span className="text-sm font-medium">
                        Logout
                    </span>
                </button>
            </div>
        </aside>
    );
}

export default ManagerSidebar;