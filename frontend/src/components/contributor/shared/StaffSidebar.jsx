
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
//
// IMPORTANT:
// - Component name unchanged
// - Props unchanged
// - Staff routes unchanged
// - Staff navigation items unchanged
// - Logout functionality unchanged
// - Only the visual design has been aligned with AdminSidebar
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
                MOBILE OVERLAY
            ================================================== */}

            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* ==================================================
                SIDEBAR
            ================================================== */}

            <aside
                className={`
                    fixed
                    inset-y-0
                    left-0
                    z-50
                    flex
                    h-screen
                    min-h-screen
                    w-64
                    shrink-0
                    flex-col
                    bg-sidebar
                    text-sidebar-foreground
                    shadow-xl
                    transition-transform
                    duration-300
                    ease-in-out

                    lg:relative
                    lg:translate-x-0

                    ${
                        sidebarOpen
                            ? "translate-x-0"
                            : "-translate-x-full"
                    }
                `}
            >
                {/* ==================================================
                    LOGO / BRAND
                ================================================== */}

                <div className="flex items-center justify-between border-b border-sidebar-border px-5 py-6">
                    <button
                        type="button"
                        onClick={() =>
                            handleNavigation(
                                "/staff/dashboard"
                            )
                        }
                        className="flex items-center gap-3"
                    >
                        {/* LOGO */}

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shadow-md">
                            <ShieldCheck className="h-5 w-5" />
                        </div>

                        {/* BRAND */}

                        <div className="text-left">
                            <h1 className="text-xl font-bold text-sidebar-foreground">
                                Africom AI-PMS
                            </h1>

                            <p className="mt-1 text-sm text-sidebar-foreground/60">
                                Staff Panel
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
                            h-9
                            w-9
                            text-sidebar-foreground/60
                            hover:bg-sidebar-accent
                            hover:text-sidebar-accent-foreground
                            md:hidden
                        "
                        aria-label="Close sidebar"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* ==================================================
                    MAIN NAVIGATION
                ================================================== */}

                <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
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
                                    gap-3
                                    rounded-lg
                                    px-4
                                    py-3
                                    text-left
                                    transition-all
                                    duration-200

                                    ${
                                        active
                                            ? `
                                                bg-sidebar-primary
                                                text-sidebar-primary-foreground
                                                shadow-md
                                                shadow-black/10
                                              `
                                            : `
                                                text-sidebar-foreground/75
                                                hover:bg-sidebar-accent
                                                hover:text-sidebar-accent-foreground
                                                hover:translate-x-1
                                              `
                                    }
                                `}
                            >
                                <Icon
                                    size={20}
                                    className={`
                                        shrink-0
                                        transition-transform
                                        duration-200
                                        group-hover:scale-110
                                    `}
                                />

                                <span className="text-sm font-medium">
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </nav>

                {/* ==================================================
                    STAFF FOOTER
                ================================================== */}

                <div className="border-t border-sidebar-border bg-sidebar p-4">
                    {/* USER ROLE */}

                    <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-primary font-bold text-sidebar-primary-foreground shadow-md">
                            ST
                        </div>

                        <div className="min-w-0">
                            <h3 className="truncate text-sm font-semibold text-sidebar-foreground">
                                Staff
                            </h3>

                            <p className="truncate text-xs text-sidebar-foreground/60">
                                Work Execution
                            </p>
                        </div>
                    </div>

                    {/* SETTINGS */}

                    <button
                        type="button"
                        onClick={() =>
                            handleNavigation(
                                "/staff/settings"
                            )
                        }
                        className={`
                            group
                            mb-1
                            flex
                            w-full
                            items-center
                            gap-3
                            rounded-lg
                            px-4
                            py-3
                            text-left
                            transition-all
                            duration-200

                            ${
                                isActive(
                                    "/staff/settings"
                                )
                                    ? `
                                        bg-sidebar-primary
                                        text-sidebar-primary-foreground
                                        shadow-md
                                        shadow-black/10
                                      `
                                    : `
                                        text-sidebar-foreground/75
                                        hover:bg-sidebar-accent
                                        hover:text-sidebar-accent-foreground
                                        hover:translate-x-1
                                      `
                            }
                        `}
                    >
                        <Settings
                            size={20}
                            className="transition-transform duration-200 group-hover:scale-110"
                        />

                        <span className="text-sm font-medium">
                            Settings
                        </span>
                    </button>

                    {/* LOGOUT */}

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="
                            group
                            flex
                            w-full
                            items-center
                            gap-3
                            rounded-lg
                            px-4
                            py-3
                            text-red-400
                            transition-all
                            duration-200
                            hover:translate-x-1
                            hover:bg-red-500/10
                            hover:text-red-300
                        "
                    >
                        <LogOut
                            size={20}
                            className="transition-transform duration-200 group-hover:scale-110"
                        />

                        <span className="text-sm font-medium">
                            Sign Out
                        </span>
                    </button>
                </div>
            </aside>
        </>
    );
}

export default StaffSidebar;

