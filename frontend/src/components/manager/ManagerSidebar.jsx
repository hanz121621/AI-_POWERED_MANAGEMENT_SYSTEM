import React from "react";
import {
    LayoutDashboard,
    FolderKanban,
    ListTodo,
    UsersRound,
    Sparkles,
    FileBarChart,
    UserRound,
    Settings,
    CircleHelp,
    LogOut,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

// ============================================================
// MANAGER SIDEBAR
// ============================================================

function ManagerSidebar() {
    const navigate = useNavigate();

    // ============================================================
    // MAIN NAVIGATION
    // ============================================================

    const navigationItems = [
        {
            label: "Dashboard",
            path: "/manager/dashboard",
            icon: LayoutDashboard,
        },
        {
            label: "Projects",
            path: "/manager/projects",
            icon: FolderKanban,
        },
        {
            label: "Sprint",
            path: "/manager/sprints",
            icon: ListTodo,
        },
        {
            label: "Team",
            path: "/manager/team",
            icon: UsersRound,
        },
        {
            label: "AI Features",
            path: "/manager/ai-features",
            icon: Sparkles,
        },
        {
            label: "Report",
            path: "/manager/reports",
            icon: FileBarChart,
        },
        {
            label: "Profile Management",
            path: "/manager/profile",
            icon: UserRound,
        },
    ];

    // ============================================================
    // BOTTOM NAVIGATION
    // ============================================================

    const bottomNavigationItems = [
        {
            label: "Settings",
            path: "/manager/settings",
            icon: Settings,
        },
        {
            label: "Help",
            path: "/manager/help",
            icon: CircleHelp,
        },
    ];

    // ============================================================
    // LOGOUT
    // ============================================================

    const handleLogout = () => {
        navigate("/logout");
    };

    // ============================================================
    // NAVIGATION ITEM
    // ============================================================

    const renderNavigationItem = (item) => {
        const Icon = item.icon;

        return (
            <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                    [
                        "group",
                        "flex",
                        "items-center",
                        "gap-3",
                        "w-full",
                        "px-4",
                        "py-3",
                        "rounded-xl",
                        "text-sm",
                        "font-medium",
                        "transition-all",
                        "duration-200",

                        isActive
                            ? "bg-slate-800 text-white shadow-sm"
                            : "text-slate-400 hover:bg-slate-800/70 hover:text-white",
                    ].join(" ")
                }
            >
                {({ isActive }) => (
                    <>
                        <Icon
                            size={20}
                            strokeWidth={isActive ? 2.3 : 2}
                            className={
                                isActive
                                    ? "text-white"
                                    : "text-slate-400 group-hover:text-white"
                            }
                        />

                        <span>{item.label}</span>
                    </>
                )}
            </NavLink>
        );
    };

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <aside
            className="
                fixed
                left-0
                top-0
                z-40
                flex
                h-screen
                w-64
                flex-col
                border-r
                border-slate-800
                bg-slate-950
                text-white
            "
        >
            {/* ==================================================
                LOGO / BRAND
            ================================================== */}

            <div className="flex h-20 shrink-0 items-center border-b border-slate-800 px-6">
                <div className="flex items-center gap-3">
                    <div
                        className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            bg-slate-800
                            text-white
                        "
                    >
                        <Sparkles
                            size={21}
                            strokeWidth={2}
                        />
                    </div>

                    <div>
                        <h1 className="text-base font-bold tracking-wide">
                            AIPMS
                        </h1>

                        <p className="text-xs text-slate-500">
                            Manager
                        </p>
                    </div>
                </div>
            </div>

            {/* ==================================================
                NAVIGATION
            ================================================== */}

            <nav className="flex-1 overflow-y-auto px-3 py-5">
                {/* MAIN ITEMS */}

                <div className="space-y-1">
                    {navigationItems.map(renderNavigationItem)}
                </div>

                {/* ==================================================
                    SEPARATOR
                ================================================== */}

                <div className="my-5 px-3">
                    <div className="h-px bg-slate-800" />
                </div>

                {/* ==================================================
                    BOTTOM ITEMS
                ================================================== */}

                <div className="space-y-1">
                    {bottomNavigationItems.map(renderNavigationItem)}
                </div>

                {/* ==================================================
                    LOGOUT
                ================================================== */}

                <button
                    type="button"
                    onClick={handleLogout}
                    className="
                        group
                        mt-1
                        flex
                        w-full
                        items-center
                        gap-3
                        rounded-xl
                        px-4
                        py-3
                        text-left
                        text-sm
                        font-medium
                        text-slate-400
                        transition-all
                        duration-200
                        hover:bg-red-500/10
                        hover:text-red-400
                    "
                >
                    <LogOut
                        size={20}
                        strokeWidth={2}
                        className="
                            text-slate-400
                            transition-colors
                            group-hover:text-red-400
                        "
                    />

                    <span>Logout</span>
                </button>
            </nav>

            {/* ==================================================
                FOOTER
            ================================================== */}

            <div className="shrink-0 border-t border-slate-800 px-5 py-4">
                <p className="text-center text-xs text-slate-600">
                    AI-Powered Project Management
                </p>
            </div>
        </aside>
    );
}

export default ManagerSidebar;