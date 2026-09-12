import { useLocation, useNavigate } from "react-router-dom";

import {
    LayoutDashboard,
    FolderKanban,
    ListTodo,
    MessageSquare,
    BarChart3,
    Settings,
    UserRound,
    LogOut,
    X,
    ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";

// ============================================================
// STAFF SIDEBAR
// Navigation only
// ============================================================

function StaffSidebar({
    sidebarOpen = false,
    onClose,
}) {
    const navigate = useNavigate();
    const location = useLocation();

    // ========================================================
    // STAFF NAVIGATION ITEMS
    // ========================================================

    const navigationItems = [
        {
            label: "Dashboard",
            path: "/staff/dashboard",
            icon: LayoutDashboard,
        },
        {
            label: "Profile Management",
            path: "/staff/profile",
            icon: UserRound,
        },
        {
            label: "Project Participation",
            path: "/staff/projects",
            icon: FolderKanban,
        },
        {
            label: "Task Management",
            path: "/staff/tasks",
            icon: ListTodo,
        },
        {
            label: "Sprint Participation",
            path: "/staff/sprint-participation",
            icon: BarChart3,
        },
        {
            label: "Communication",
            path: "/staff/communication",
            icon: MessageSquare,
        },
        {
            label: "Reports & Monitoring",
            path: "/staff/reports",
            icon: BarChart3,
        },
        {
            label: "Settings & Preferences",
            path: "/staff/settings",
            icon: Settings,
        },
    ];

    // ========================================================
    // ACTIVE ROUTE
    // ========================================================

    const isActive = (path) => {
        if (location.pathname === path) {
            return true;
        }

        return location.pathname.startsWith(`${path}/`);
    };

    // ========================================================
    // NAVIGATION
    // ========================================================

    const handleNavigation = (path) => {
        navigate(path);

        if (onClose) {
            onClose();
        }
    };

    // ========================================================
    // LOGOUT
    // ========================================================

    const handleLogout = () => {
        const keysToRemove = [
            "user",
            "token",
            "refreshToken",
            "aipms_user",
            "currentUser",
            "authUser",
        ];

        keysToRemove.forEach((key) => {
            try {
                localStorage.removeItem(key);
            } catch (error) {
                console.error(
                    `Unable to remove ${key}:`,
                    error
                );
            }
        });

        navigate("/login", {
            replace: true,
        });

        if (onClose) {
            onClose();
        }
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <>
            {/* ==================================================
                MOBILE BACKDROP
            ================================================== */}

            {sidebarOpen && (
                <button
                    type="button"
                    aria-label="Close sidebar"
                    onClick={onClose}
                    className="
                        fixed
                        inset-0
                        z-40
                        bg-black/40
                        lg:hidden
                    "
                />
            )}

            {/* ==================================================
                SIDEBAR
            ================================================== */}

            <aside
                className={`
                    fixed
                    left-0
                    top-0
                    z-50
                    flex
                    h-screen
                    w-64
                    flex-col
                    border-r
                    border-slate-200
                    bg-white
                    shadow-xl
                    transition-transform
                    duration-300
                    dark:border-blue-900/70
                    dark:bg-[#081b33]

                    ${
                        sidebarOpen
                            ? "translate-x-0"
                            : "-translate-x-full"
                    }

                    lg:translate-x-0
                `}
            >
                {/* ==================================================
                    SIDEBAR HEADER
                ================================================== */}

                <div
                    className="
                        flex
                        h-14
                        shrink-0
                        items-center
                        justify-between
                        border-b
                        border-slate-200
                        px-3
                        dark:border-blue-900/70
                    "
                >
                    {/* BRAND */}

                    <button
                        type="button"
                        onClick={() =>
                            handleNavigation(
                                "/staff/dashboard"
                            )
                        }
                        className="
                            flex
                            items-center
                            gap-2.5
                        "
                    >
                        {/* LOGO */}

                        <div
                            className="
                                flex
                                h-8
                                w-8
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                bg-blue-600
                                text-white
                                shadow-sm
                            "
                        >
                            <ShieldCheck className="h-4 w-4" />
                        </div>

                        {/* BRAND TEXT */}

                        <div className="text-left">
                            <p
                                className="
                                    text-xs
                                    font-bold
                                    leading-tight
                                    text-slate-900
                                    dark:text-white
                                "
                            >
                                AI-PMS
                            </p>

                            <p
                                className="
                                    text-[9px]
                                    font-medium
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                Staff Portal
                            </p>
                        </div>
                    </button>

                    {/* MOBILE CLOSE */}

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="
                            h-8
                            w-8
                            text-slate-500
                            hover:bg-slate-100
                            dark:text-slate-300
                            dark:hover:bg-blue-950/60
                            lg:hidden
                        "
                        aria-label="Close sidebar"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* ==================================================
                    MAIN NAVIGATION
                ================================================== */}

                <nav
                    className="
                        flex-1
                        overflow-y-auto
                        px-2
                        py-3
                    "
                >
                    {/* ==================================================
                        NAVIGATION LIST
                    ================================================== */}

                    <div className="space-y-0.5">
                        {navigationItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.path);

                            return (
                                <button
                                    type="button"
                                    key={item.path}
                                    onClick={() =>
                                        handleNavigation(
                                            item.path
                                        )
                                    }
                                    className={`
                                        group
                                        flex
                                        w-full
                                        items-center
                                        gap-2.5
                                        rounded-lg
                                        px-2.5
                                        py-2.5
                                        text-left
                                        text-xs
                                        transition

                                        ${
                                            active
                                                ? `
                                                    bg-blue-600
                                                    font-semibold
                                                    text-white
                                                    shadow-sm
                                                  `
                                                : `
                                                    text-slate-700
                                                    hover:bg-slate-100
                                                    hover:text-blue-700
                                                    dark:text-slate-300
                                                    dark:hover:bg-blue-950/50
                                                    dark:hover:text-white
                                                  `
                                        }
                                    `}
                                >
                                    <Icon
                                        className={`
                                            h-4
                                            w-4
                                            shrink-0

                                            ${
                                                active
                                                    ? "text-white"
                                                    : "text-slate-400 group-hover:text-blue-600 dark:text-slate-500 dark:group-hover:text-blue-400"
                                            }
                                        `}
                                    />

                                    <span className="truncate">
                                        {item.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </nav>

                {/* ==================================================
                    SIDEBAR FOOTER
                ================================================== */}

                <div
                    className="
                        shrink-0
                        border-t
                        border-slate-200
                        p-2
                        dark:border-blue-900/70
                    "
                >
                    {/* USER ROLE */}

                    <div
                        className="
                            mb-1.5
                            rounded-lg
                            bg-slate-50
                            px-2.5
                            py-2
                            dark:bg-[#0f2747]
                        "
                    >
                        <div
                            className="
                                flex
                                items-center
                                gap-2.5
                            "
                        >
                            <div
                                className="
                                    flex
                                    h-7
                                    w-7
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-blue-600
                                    text-[9px]
                                    font-bold
                                    text-white
                                "
                            >
                                ST
                            </div>

                            <div className="min-w-0">
                                <p
                                    className="
                                        truncate
                                        text-[10px]
                                        font-semibold
                                        text-slate-800
                                        dark:text-white
                                    "
                                >
                                    Staff
                                </p>

                                <p
                                    className="
                                        truncate
                                        text-[9px]
                                        text-slate-500
                                        dark:text-slate-400
                                    "
                                >
                                    Work Execution
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* LOGOUT */}

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="
                            flex
                            w-full
                            items-center
                            gap-2.5
                            rounded-lg
                            px-2.5
                            py-2
                            text-left
                            text-xs
                            font-medium
                            text-red-600
                            transition
                            hover:bg-red-50
                            dark:text-red-400
                            dark:hover:bg-red-950/30
                        "
                    >
                        <LogOut className="h-4 w-4" />

                        <span>
                            Sign Out
                        </span>
                    </button>
                </div>
            </aside>
        </>
    );
}

export default StaffSidebar;