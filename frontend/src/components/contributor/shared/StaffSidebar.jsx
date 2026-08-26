
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
    LayoutDashboard,
    BriefcaseBusiness,
    ChevronDown,
    ChevronRight,
    ListTodo,
    MessageSquare,
    Upload,
    Send,
    Wrench,
    UserRound,
    Settings,
    LogOut,
    X,
    ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";

/* ============================================================
   STAFF SIDEBAR
   ------------------------------------------------------------
   STAFF AUTHORITY:

   MANAGER
       ↓
   Assigns Work
       ↓
   TEAM LEADER
       ↓
   Coordinates
       ↓
   STAFF
       ↓
   Performs Work
       ↓
   Submit for Review
       ↓
   MANAGER
       ↓
   Final Approval
============================================================ */

/* ============================================================
   STAFF MENU
============================================================ */

const STAFF_MENU_ITEMS = [
    {
        label: "My Work",
        path: "/staff/my-work",
        icon: ListTodo,
    },
    {
        label: "Update Task Status",
        path: "/staff/update-task-status",
        icon: Wrench,
    },
    {
        label: "Add Task Comments",
        path: "/staff/task-comments",
        icon: MessageSquare,
    },
    {
        label: "Upload Work Files",
        path: "/staff/upload-files",
        icon: Upload,
    },
    {
        label: "Submit Completed Work",
        path: "/staff/submit-work",
        icon: Send,
    },
    {
        label: "Perform Specialized Work",
        path: "/staff/specialized-work",
        icon: BriefcaseBusiness,
    },
];

/* ============================================================
   COMPONENT
============================================================ */

function StaffSidebar({
    sidebarOpen = true,
    onClose,
}) {
    const navigate = useNavigate();
    const location = useLocation();

    const [staffMenuOpen, setStaffMenuOpen] =
        useState(true);

    /* ========================================================
       ACTIVE ROUTE
    ======================================================== */

    const isActive = (path) => {
        if (location.pathname === path) {
            return true;
        }

        return location.pathname.startsWith(
            `${path}/`
        );
    };

    /* ========================================================
       NAVIGATION
    ======================================================== */

    const handleNavigation = (path) => {
        navigate(path);

        if (onClose) {
            onClose();
        }
    };

    const handleDashboard = () => {
        navigate("/staff");

        if (onClose) {
            onClose();
        }
    };

    const handleProfile = () => {
        navigate("/profile");

        if (onClose) {
            onClose();
        }
    };

    const handleSettings = () => {
        navigate("/settings");

        if (onClose) {
            onClose();
        }
    };

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

    /* ========================================================
       RENDER
    ======================================================== */

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
                        onClick={handleDashboard}
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
                            <ShieldCheck
                                className="h-4 w-4"
                            />
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
                    NAVIGATION
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
                        DASHBOARD
                    ================================================== */}

                    <button
                        type="button"
                        onClick={handleDashboard}
                        className={`
                            group
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
                            transition

                            ${
                                location.pathname ===
                                "/staff"
                                    ? `
                                        bg-blue-600
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
                        <LayoutDashboard
                            className="
                                h-4
                                w-4
                                shrink-0
                            "
                        />

                        <span>
                            Dashboard
                        </span>
                    </button>

                    {/* ==================================================
                        STAFF SECTION
                    ================================================== */}

                    <div className="mt-3">
                        {/* SECTION HEADER */}

                        <button
                            type="button"
                            onClick={() =>
                                setStaffMenuOpen(
                                    (current) =>
                                        !current
                                )
                            }
                            className="
                                flex
                                w-full
                                items-center
                                justify-between
                                rounded-lg
                                px-2.5
                                py-2
                                text-left
                                transition
                                hover:bg-slate-100
                                dark:hover:bg-blue-950/50
                            "
                        >
                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2.5
                                "
                            >
                                <BriefcaseBusiness
                                    className="
                                        h-4
                                        w-4
                                        text-blue-600
                                        dark:text-blue-400
                                    "
                                />

                                <span
                                    className="
                                        text-[10px]
                                        font-bold
                                        uppercase
                                        tracking-wider
                                        text-slate-500
                                        dark:text-slate-400
                                    "
                                >
                                    Staff
                                </span>
                            </div>

                            {staffMenuOpen ? (
                                <ChevronDown
                                    className="
                                        h-3.5
                                        w-3.5
                                        text-slate-400
                                    "
                                />
                            ) : (
                                <ChevronRight
                                    className="
                                        h-3.5
                                        w-3.5
                                        text-slate-400
                                    "
                                />
                            )}
                        </button>

                        {/* ==================================================
                            STAFF SUBMENU
                        ================================================== */}

                        {staffMenuOpen && (
                            <div
                                className="
                                    mt-0.5
                                    space-y-0.5
                                    pl-1
                                "
                            >
                                {STAFF_MENU_ITEMS.map(
                                    (item) => {
                                        const Icon =
                                            item.icon;

                                        const active =
                                            isActive(
                                                item.path
                                            );

                                        return (
                                            <button
                                                type="button"
                                                key={
                                                    item.path
                                                }
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
                                                    py-2
                                                    text-left
                                                    text-[11px]
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
                                                                text-slate-600
                                                                hover:bg-slate-100
                                                                hover:text-blue-700
                                                                dark:text-slate-400
                                                                dark:hover:bg-blue-950/50
                                                                dark:hover:text-white
                                                              `
                                                    }
                                                `}
                                            >
                                                <Icon
                                                    className={`
                                                        h-3.5
                                                        w-3.5
                                                        shrink-0

                                                        ${
                                                            active
                                                                ? "text-white"
                                                                : "text-slate-400 group-hover:text-blue-600 dark:text-slate-500 dark:group-hover:text-blue-400"
                                                        }
                                                    `}
                                                />

                                                <span className="truncate">
                                                    {
                                                        item.label
                                                    }
                                                </span>
                                            </button>
                                        );
                                    }
                                )}
                            </div>
                        )}
                    </div>

                    {/* ==================================================
                        DIVIDER
                    ================================================== */}

                    <div
                        className="
                            my-3
                            border-t
                            border-slate-200
                            dark:border-blue-900/70
                        "
                    />

                    {/* ==================================================
                        PROFILE
                    ================================================== */}

                    <button
                        type="button"
                        onClick={handleProfile}
                        className={`
                            flex
                            w-full
                            items-center
                            gap-2.5
                            rounded-lg
                            px-2.5
                            py-2
                            text-left
                            text-xs
                            transition

                            ${
                                isActive("/profile")
                                    ? `
                                        bg-blue-600
                                        font-semibold
                                        text-white
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
                        <UserRound className="h-4 w-4" />

                        <span>
                            My Profile
                        </span>
                    </button>

                    {/* ==================================================
                        SETTINGS
                    ================================================== */}

                    <button
                        type="button"
                        onClick={handleSettings}
                        className={`
                            mt-0.5
                            flex
                            w-full
                            items-center
                            gap-2.5
                            rounded-lg
                            px-2.5
                            py-2
                            text-left
                            text-xs
                            transition

                            ${
                                isActive("/settings")
                                    ? `
                                        bg-blue-600
                                        font-semibold
                                        text-white
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
                        <Settings className="h-4 w-4" />

                        <span>
                            Settings
                        </span>
                    </button>
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
