
import {
    LayoutDashboard,
    UserRound,
    FolderKanban,
    ListTodo,
    Activity,
    MessageSquare,
    BarChart3,
    Settings,
    HelpCircle,
    LogOut,
    Code2,
    X,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

// ============================================================
// DEVELOPER SIDEBAR
// ============================================================
//
// Developer navigation follows the same visual structure as
// the AdminSidebar.
//
// Developer-specific routes are preserved.
//
// ============================================================

function DeveloperSidebar({
    isMobileOpen,
    onCloseMobile,
}) {
    const navigate = useNavigate();

    // ========================================================
    // DEVELOPER MENU ITEMS
    // ========================================================

    const menuItems = [
        {
            name: "Dashboard",
            icon: LayoutDashboard,
            path: "/developer/dashboard",
        },
        {
            name: "My Profile",
            icon: UserRound,
            path: "/developer/profile",
        },
        {
            name: "Projects",
            icon: FolderKanban,
            path: "/developer/projects",
        },
        {
            name: "Tasks",
            icon: ListTodo,
            path: "/developer/tasks",
        },
        {
            name: "Sprint Participation",
            icon: Activity,
            path: "/developer/sprint-participation",
        },
        {
            name: "Communication",
            icon: MessageSquare,
            path: "/developer/communication",
        },
        {
            name: "Reports & Monitoring",
            icon: BarChart3,
            path: "/developer/reports",
        },
    ];

    return (
        <>
            {/* ==================================================
                MOBILE OVERLAY
            ================================================== */}

            {isMobileOpen && (
                <div
                    className="
                        fixed
                        inset-0
                        z-40
                        bg-black/50
                        md:hidden
                    "
                    onClick={onCloseMobile}
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

                    transition-transform
                    duration-300
                    ease-in-out

                    md:relative
                    md:translate-x-0

                    ${
                        isMobileOpen
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
                    <div className="flex items-center gap-3">
                        <div
                            className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-xl
                                bg-sidebar-primary
                                text-sidebar-primary-foreground
                                shadow-md
                            "
                        >
                            <Code2 size={20} />
                        </div>

                        <div>
                            <h1
                                className="
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
                                Developer Panel
                            </p>
                        </div>
                    </div>

                    {/* ==================================================
                        MOBILE CLOSE
                    ================================================== */}

                    <button
                        type="button"
                        onClick={onCloseMobile}
                        className="
                            text-sidebar-foreground/60
                            transition-colors
                            hover:text-sidebar-foreground
                            md:hidden
                        "
                        aria-label="Close developer sidebar"
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
                    aria-label="Developer navigation"
                >
                    {menuItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                onClick={onCloseMobile}
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
                                {({ isActive }) => (
                                    <>
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
                                                text-sm
                                                font-medium
                                            "
                                        >
                                            {item.name}
                                        </span>
                                    </>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* ==================================================
                    BOTTOM DEVELOPER SECTION
                ================================================== */}

                <div
                    className="
                        border-t
                        border-sidebar-border
                        bg-sidebar
                        p-4
                    "
                >
                    {/* ==================================================
                        DEVELOPER PROFILE
                    ================================================== */}

                    <div
                        className="
                            mb-4
                            flex
                            items-center
                            gap-3
                        "
                    >
                        <div
                            className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-full
                                bg-sidebar-primary
                                font-bold
                                text-sidebar-primary-foreground
                                shadow-md
                            "
                        >
                            DV
                        </div>

                        <div>
                            <h3
                                className="
                                    text-sm
                                    font-semibold
                                    text-sidebar-foreground
                                "
                            >
                                Developer
                            </h3>

                            <p
                                className="
                                    text-xs
                                    text-sidebar-foreground/60
                                "
                            >
                                Software Developer
                            </p>
                        </div>
                    </div>

                    {/* ==================================================
                        SETTINGS
                    ================================================== */}

                    <NavLink
                        to="/developer/settings"
                        onClick={onCloseMobile}
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

                        <span
                            className="
                                text-sm
                                font-medium
                            "
                        >
                            Settings
                        </span>
                    </NavLink>

                    {/* ==================================================
                        HELP
                    ================================================== */}

                    <NavLink
                        to="/developer/help"
                        onClick={onCloseMobile}
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

                        <span
                            className="
                                text-sm
                                font-medium
                            "
                        >
                            Help
                        </span>
                    </NavLink>

                    {/* ==================================================
                        LOGOUT
                    ================================================== */}

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

                        <span
                            className="
                                text-sm
                                font-medium
                            "
                        >
                            Logout
                        </span>
                    </button>
                </div>
            </aside>
        </>
    );
}

export default DeveloperSidebar;

