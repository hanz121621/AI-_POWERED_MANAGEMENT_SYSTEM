// ============================================================
// AIPMS - MANAGER SIDEBAR
// src/components/manager/ManagerSidebar.jsx
// ============================================================

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

function ManagerSidebar({ isMobileOpen, onCloseMobile }) {
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
                onClick={onCloseMobile}
                className={({ isActive }) =>
                    [
                        "group",
                        "flex",
                        "w-full",
                        "items-center",
                        "gap-3",
                        "rounded-xl",
                        "px-4",
                        "py-3",
                        "text-sm",
                        "font-medium",
                        "transition-all",
                        "duration-200",

                        isActive
                            ? [
                                  "bg-slate-100",
                                  "text-slate-900",
                                  "shadow-sm",
                                  "dark:bg-slate-800",
                                  "dark:text-slate-100",
                              ].join(" ")
                            : [
                                  "text-slate-600",
                                  "hover:bg-slate-100",
                                  "hover:text-slate-900",
                                  "dark:text-slate-400",
                                  "dark:hover:bg-slate-800",
                                  "dark:hover:text-slate-100",
                              ].join(" "),
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
                                    ? "text-slate-900 dark:text-slate-100"
                                    : "text-slate-500 group-hover:text-slate-900 dark:text-slate-500 dark:group-hover:text-slate-100"
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
            className={`
                fixed
                inset-y-0
                left-0
                z-50
                flex
                h-screen
                w-64
                flex-col
                border-r
                border-slate-200
                bg-white
                text-slate-900
                shadow-xl
                transition-transform
                duration-300
                ease-in-out
                dark:border-slate-800
                dark:bg-slate-900
                dark:text-slate-100

                ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}

                md:translate-x-0
            `}
        >
            {/* ==================================================
                LOGO / BRAND
            ================================================== */}

            <div
                className="
                    relative
                    flex
                    h-20
                    shrink-0
                    items-center
                    border-b
                    border-slate-200
                    px-6
                    dark:border-slate-800
                "
            >
                <div className="flex items-center gap-3">
                    {/* LOGO ICON */}

                    <div
                        className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            bg-slate-100
                            text-slate-700
                            dark:bg-slate-800
                            dark:text-slate-200
                        "
                    >
                        <Sparkles size={21} strokeWidth={2} />
                    </div>

                    {/* BRAND */}

                    <div>
                        <h1
                            className="
                                text-base
                                font-bold
                                tracking-wide
                                text-slate-900
                                dark:text-slate-100
                            "
                        >
                            AIPMS
                        </h1>

                        <p
                            className="
                                text-xs
                                text-slate-500
                                dark:text-slate-400
                            "
                        >
                            Manager
                        </p>
                    </div>
                </div>

                {/* MOBILE CLOSE BUTTON */}

                <button
                    type="button"
                    onClick={onCloseMobile}
                    className="
                        absolute
                        right-3
                        top-3
                        rounded-lg
                        p-2
                        text-slate-500
                        hover:bg-slate-100
                        hover:text-slate-900
                        md:hidden
                        dark:text-slate-400
                        dark:hover:bg-slate-800
                        dark:hover:text-slate-100
                    "
                    aria-label="Close sidebar"
                >
                    ✕
                </button>
            </div>

            {/* ==================================================
                NAVIGATION
            ================================================== */}

            <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-5">
                {/* MAIN ITEMS */}

                <div className="space-y-1">
                    {navigationItems.map(renderNavigationItem)}
                </div>

                {/* ==================================================
                    SEPARATOR
                ================================================== */}

                <div className="my-5 px-3">
                    <div
                        className="
                            h-px
                            bg-slate-200
                            dark:bg-slate-800
                        "
                    />
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
                        text-slate-600
                        transition-all
                        duration-200
                        hover:bg-red-50
                        hover:text-red-600
                        dark:text-slate-400
                        dark:hover:bg-red-950/40
                        dark:hover:text-red-400
                    "
                >
                    <LogOut
                        size={20}
                        strokeWidth={2}
                        className="
                            text-slate-500
                            transition-colors
                            group-hover:text-red-600
                            dark:text-slate-500
                            dark:group-hover:text-red-400
                        "
                    />

                    <span>Logout</span>
                </button>
            </nav>

            {/* ==================================================
                FOOTER
            ================================================== */}

            <div
                className="
                    shrink-0
                    border-t
                    border-slate-200
                    bg-white
                    px-5
                    py-4
                    dark:border-slate-800
                    dark:bg-slate-900
                "
            >
                <p
                    className="
                        text-center
                        text-xs
                        text-slate-500
                        dark:text-slate-400
                    "
                >
                    AI-Powered Project Management
                </p>
            </div>
        </aside>
    );
}

export default ManagerSidebar;