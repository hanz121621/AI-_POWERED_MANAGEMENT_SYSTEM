
import { NavLink } from "react-router-dom";

import {
    BarChart3,
    CalendarRange,
    ClipboardList,
    LayoutDashboard,
    MessageSquare,
    Settings,
    UserRound,
    BriefcaseBusiness,
} from "lucide-react";

// ============================================================
// TEAM LEADER SIDEBAR
// ============================================================
//
// Main navigation:
//
// 1. Dashboard
// 2. Task Management
// 3. Profile Management
// 4. Project Participation
// 5. Sprint Participation
// 6. Communication
// 7. Reports
// 8. Settings & Preferences
//
// IMPORTANT:
// - No dropdown menus
// - No nested navigation
// - Each item is a direct parent module
// - Keep paths synchronized with AppRoutes.jsx
//
// ============================================================
function TeamLeaderSidebar({
    isOpen = false,
    onClose,
}) {
    // ========================================================
    // MAIN NAVIGATION
    // ========================================================

    const navigation = [
        {
            label: "Dashboard",
            path: "/team-leader/dashboard",
            icon: LayoutDashboard,
            end: true,
        },

        {
            label: "Task Management",
            path: "/team-leader/task-management",
            icon: ClipboardList,
        },

        {
            label: "Profile Management",
            path: "/team-leader/profile-management",
            icon: UserRound,
        },

        {
            label: "Project Participation",
            path: "/team-leader/project-participation",
            icon: BriefcaseBusiness,
        },

        {
            label: "Sprint Participation",
            path: "/team-leader/sprint-participation",
            icon: CalendarRange,
        },

        {
            label: "Communication",
            path: "/team-leader/communication",
            icon: MessageSquare,
        },

        {
            label: "Reports",
            path: "/team-leader/reports",
            icon: BarChart3,
        },

        {
            label: "Settings & Preferences",
            path: "/team-leader/settings",
            icon: Settings,
        },
    ];

    // ========================================================
    // NAVIGATION ITEM CLASS
    // ========================================================

    const navItemClass = ({ isActive }) =>
        `
        group
        flex
        w-full
        items-center
        gap-3
        rounded-xl
        px-3
        py-3
        text-sm
        font-medium
        transition-all
        duration-200

        ${
            isActive
                ? `
                    bg-blue-600
                    text-white
                    shadow-sm
                  `
                : `
                    text-slate-300
                    hover:bg-blue-950/70
                    hover:text-white
                  `
        }
        `;

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <>
            {/* ==================================================
                MOBILE BACKDROP
            ================================================== */}

            {isOpen && (
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
                    inset-y-0
                    left-0
                    z-50
                    flex
                    min-h-screen
                    w-72
                    shrink-0
                    flex-col
                    border-r
                    border-blue-900/70
                    bg-[#081b33]
                    text-white
                    shadow-xl
                    transition-transform
                    duration-300

                    lg:z-50 lg:translate-x-0

                    ${
                        isOpen
                            ? "translate-x-0"
                            : "-translate-x-full"
                    }
                `}
            >
                {/* ==================================================
                    HEADER
                ================================================== */}

                <div
                    className="
                        flex
                        h-16
                        shrink-0
                        items-center
                        justify-between
                        border-b
                        border-blue-900/70
                        px-5
                    "
                >
                    <div className="flex items-center gap-3">

                        {/* LOGO */}

                        <div
                            className="
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-blue-600
                                text-white
                                shadow-sm
                            "
                        >
                            <UserRound className="h-5 w-5" />
                        </div>

                        {/* TITLE */}

                        <div className="min-w-0">
                            <p
                                className="
                                    text-sm
                                    font-bold
                                    leading-tight
                                    text-white
                                "
                            >
                                AI-PMS
                            </p>

                            <p
                                className="
                                    mt-0.5
                                    text-[10px]
                                    font-medium
                                    text-slate-400
                                "
                            >
                                Team Leader Portal
                            </p>
                        </div>
                    </div>

                    {/* MOBILE CLOSE */}

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close sidebar"
                        className="
                            rounded-lg
                            p-2
                            text-slate-400
                            transition
                            hover:bg-blue-950/70
                            hover:text-white
                            lg:hidden
                        "
                    >
                        <span className="sr-only">
                            Close sidebar
                        </span>

                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="h-5 w-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* ==================================================
                    NAVIGATION
                ================================================== */}

                <nav
                    className="
                        min-h-0
                        flex-1
                        overflow-y-auto
                        px-3
                        py-5
                    "
                >
                    {/* SECTION TITLE */}

                    <div className="mb-4 px-3">
                        <p
                            className="
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-[0.16em]
                                text-slate-500
                            "
                        >
                            Team Leader
                        </p>
                    </div>

                    {/* MAIN NAVIGATION */}

                    <div className="space-y-2">
                        {navigation.map((item) => {
                            const Icon = item.icon;

                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    end={item.end}
                                    onClick={onClose}
                                    className={navItemClass}
                                >
                                    <Icon
                                        className="
                                            h-5
                                            w-5
                                            shrink-0
                                        "
                                    />

                                    <span className="truncate">
                                        {item.label}
                                    </span>
                                </NavLink>
                            );
                        })}
                    </div>
                </nav>

                {/* ==================================================
                    FOOTER
                ================================================== */}

                <div
                    className="
                        shrink-0
                        border-t
                        border-blue-900/70
                        px-4
                        py-4
                    "
                >
                    <div
                        className="
                            rounded-xl
                            border
                            border-blue-900/60
                            bg-blue-950/40
                            px-3
                            py-3
                        "
                    >
                        <div className="flex items-center gap-3">

                            {/* AVATAR */}

                            <div
                                className="
                                    flex
                                    h-9
                                    w-9
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-blue-600
                                    text-white
                                "
                            >
                                <UserRound className="h-4 w-4" />
                            </div>

                            {/* USER INFO */}

                            <div className="min-w-0">
                                <p
                                    className="
                                        truncate
                                        text-xs
                                        font-semibold
                                        text-white
                                    "
                                >
                                    Team Leader
                                </p>

                                <p
                                    className="
                                        mt-0.5
                                        truncate
                                        text-[10px]
                                        text-slate-400
                                    "
                                >
                                    Team Leader Workspace
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}

export default TeamLeaderSidebar;

