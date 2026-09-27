
import {
    LayoutDashboard,
    ClipboardList,
    UserRound,
    BriefcaseBusiness,
    CalendarRange,
    MessageSquare,
    BarChart3,
    Settings,
    HelpCircle,
    LogOut,
    X,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

// ============================================================
// TEAM LEADER SIDEBAR
// ============================================================
//
// UI is synchronized with AdminSidebar.
//
// IMPORTANT:
// - Navigation contents are NOT changed
// - Paths are NOT changed
// - No dropdown navigation
// - No nested navigation
// - Responsive mobile sidebar
// - Same visual structure as AdminSidebar
//
// ============================================================

function TeamLeaderSidebar({
    isOpen = false,
    onClose,
}) {
    const navigate = useNavigate();

    // ========================================================
    // MAIN NAVIGATION
    // ========================================================

    const menuItems = [
        {
            name: "Dashboard",
            icon: LayoutDashboard,
            path: "/team-leader/dashboard",
            end: true,
        },
        {
            name: "Task Management",
            icon: ClipboardList,
            path: "/team-leader/task-management",
        },
        {
            name: "Profile Management",
            icon: UserRound,
            path: "/team-leader/profile-management",
        },
        {
            name: "Project Participation",
            icon: BriefcaseBusiness,
            path: "/team-leader/project-participation",
        },
        {
            name: "Sprint Participation",
            icon: CalendarRange,
            path: "/team-leader/sprint-participation",
        },
        {
            name: "Communication",
            icon: MessageSquare,
            path: "/team-leader/communication",
        },
        {
            name: "Reports",
            icon: BarChart3,
            path: "/team-leader/reports",
        },
    ];

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <>
            {/* ==================================================
                MOBILE OVERLAY
            ================================================== */}

            {isOpen && (
                <div
                    className="
                        fixed
                        inset-0
                        z-40
                        bg-black/50
                        md:hidden
                    "
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

                    md:relative
                    md:translate-x-0

                    ${
                        isOpen
                            ? "translate-x-0"
                            : "-translate-x-full"
                    }
                `}
            >
                {/* ==================================================
                    LOGO / BRAND
                ================================================== */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        border-b
                        border-sidebar-border
                        px-5
                        py-6
                    "
                >
                    <div className="min-w-0">
                        <h1
                            className="
                                truncate
                                text-xl
                                font-bold
                                text-sidebar-foreground
                            "
                        >
                            Africom AI-PMS
                        </h1>

                        <p
                            className="
                                mt-1
                                text-sm
                                text-sidebar-foreground/60
                            "
                        >
                            Team Leader Panel
                        </p>
                    </div>

                    {/* MOBILE CLOSE */}

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close sidebar"
                        className="
                            rounded-lg
                            p-1
                            text-sidebar-foreground/60
                            transition-colors
                            hover:bg-sidebar-accent
                            hover:text-sidebar-accent-foreground
                            md:hidden
                        "
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* ==================================================
                    NAVIGATION
                ================================================== */}

                <nav
                    className="
                        flex-1
                        space-y-2
                        overflow-y-auto
                        px-4
                        py-6
                    "
                >
                    {menuItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                end={item.end}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `
                                    group
                                    flex
                                    items-center
                                    gap-3
                                    rounded-lg
                                    px-4
                                    py-3
                                    transition-all
                                    duration-200

                                    ${
                                        isActive
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
                                    `
                                }
                            >
                                <Icon
                                    size={20}
                                    className="
                                        shrink-0
                                        transition-transform
                                        duration-200
                                        group-hover:scale-110
                                    "
                                />

                                <span
                                    className="
                                        truncate
                                        text-sm
                                        font-medium
                                    "
                                >
                                    {item.name}
                                </span>
                            </NavLink>
                        );
                    })}
                </nav>

                {/* ==================================================
                    BOTTOM TEAM LEADER SECTION
                ================================================== */}

                <div
                    className="
                        border-t
                        border-sidebar-border
                        bg-sidebar
                        p-4
                    "
                >
                    {/* USER INFORMATION */}

                    <div className="mb-4 flex items-center gap-3">
                        <div
                            className="
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                bg-sidebar-primary
                                font-bold
                                text-sidebar-primary-foreground
                                shadow-md
                            "
                        >
                            TL
                        </div>

                        <div className="min-w-0">
                            <h3
                                className="
                                    truncate
                                    text-sm
                                    font-semibold
                                    text-sidebar-foreground
                                "
                            >
                                Team Leader
                            </h3>

                            <p
                                className="
                                    truncate
                                    text-xs
                                    text-sidebar-foreground/60
                                "
                            >
                                Team Leader Workspace
                            </p>
                        </div>
                    </div>

                    {/* SETTINGS */}

                    <NavLink
                        to="/team-leader/settings"
                        onClick={onClose}
                        className={({ isActive }) =>
                            `
                            group
                            mb-1
                            flex
                            items-center
                            gap-3
                            rounded-lg
                            px-4
                            py-3
                            transition-all
                            duration-200

                            ${
                                isActive
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
                            `
                        }
                    >
                        <Settings
                            size={20}
                            className="
                                transition-transform
                                duration-200
                                group-hover:scale-110
                            "
                        />

                        <span className="text-sm font-medium">
                            Settings
                        </span>
                    </NavLink>

                    {/* HELP */}

                    <NavLink
                        to="/team-leader/help"
                        onClick={onClose}
                        className="
                            group
                            mb-1
                            flex
                            items-center
                            gap-3
                            rounded-lg
                            px-4
                            py-3
                            text-sidebar-foreground/75
                            transition-all
                            duration-200
                            hover:translate-x-1
                            hover:bg-sidebar-accent
                            hover:text-sidebar-accent-foreground
                        "
                    >
                        <HelpCircle
                            size={20}
                            className="
                                transition-transform
                                duration-200
                                group-hover:scale-110
                            "
                        />

                        <span className="text-sm font-medium">
                            Help
                        </span>
                    </NavLink>

                    {/* LOGOUT */}

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/logout")
                        }
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
                            className="
                                transition-transform
                                duration-200
                                group-hover:scale-110
                            "
                        />

                        <span className="text-sm font-medium">
                            Logout
                        </span>
                    </button>
                </div>
            </aside>
        </>
    );
}

export default TeamLeaderSidebar;
