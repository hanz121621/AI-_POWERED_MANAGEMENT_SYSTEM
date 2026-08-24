import {
    LayoutDashboard,
    Users,
    UsersRound,
    FolderKanban,
    BarChart3,
    BrainCircuit,
    Settings,
    HelpCircle,
    LogOut,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

function AdminSidebar() {
    const navigate = useNavigate();

    const menuItems = [
        {
            name: "Dashboard",
            icon: LayoutDashboard,
            path: "/admin/dashboard",
        },
        {
            name: "Users",
            icon: Users,
            path: "/admin/users",
        },
        {
            name: "Teams",
            icon: UsersRound,
            path: "/admin/teams",
        },
        {
            name: "Projects",
            icon: FolderKanban,
            path: "/admin/projects",
        },
        {
            name: "Reports",
            icon: BarChart3,
            path: "/admin/reports",
        },
        {
            name: "AI Administration",
            icon: BrainCircuit,
            path: "/admin/ai-admin",
        },
        {
            name: "System Administration",
            icon: Settings,
            path: "/admin/system-admin",
        },
        {
            name: "Profile Management",
            icon: Users,
            path: "/admin/profile",
        },
    ];

    return (
        <aside
            className="
                sticky
                top-0
                flex
                h-screen
                min-h-screen
                w-64
                shrink-0
                flex-col
                bg-sidebar
                text-sidebar-foreground
                transition-colors
                duration-300
            "
        >

            {/* =================================================
                LOGO / BRAND
            ================================================== */}

            <div
                className="
                    border-b
                    border-sidebar-border
                    px-5
                    py-6
                "
            >
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
                    Admin Panel
                </p>
            </div>


            {/* =================================================
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


            {/* =================================================
                BOTTOM ADMIN SECTION
            ================================================== */}

            <div
                className="
                    border-t
                    border-sidebar-border
                    bg-sidebar
                    p-4
                "
            >

                {/* =================================================
                    ADMIN USER
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
                        AD
                    </div>

                    <div>
                        <h3
                            className="
                                text-sm
                                font-semibold
                                text-sidebar-foreground
                            "
                        >
                            Admin
                        </h3>

                        <p
                            className="
                                text-xs
                                text-sidebar-foreground/60
                            "
                        >
                            System Administrator
                        </p>
                    </div>
                </div>


                {/* =================================================
                    SETTINGS
                ================================================== */}

                <NavLink
                    to="/admin/settings"
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


                {/* =================================================
                    HELP
                ================================================== */}

                <NavLink
                    to="/admin/help"
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


                {/* =================================================
                    LOGOUT
                ================================================== */}

                <button
                    type="button"
                    onClick={() => navigate("/logout")}
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
    );
}

export default AdminSidebar;