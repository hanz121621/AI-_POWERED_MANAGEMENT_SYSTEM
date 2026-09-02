import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
    Activity,
    BarChart3,
    Bell,
    BookOpen,
   
    
    ClipboardCheck,
    Code2,
    FolderKanban,
   
    History,
    Languages,
    ListTodo,
    MessageSquare,
    MessageSquareCode,
   
    PanelLeftClose,
    PanelLeftOpen,
    Send,
    Settings2,
    ShieldCheck,
    Sparkles,
    Sun,
    UserRound,
    UsersRound,
    Wrench,
    X,
} from "lucide-react";

import { Button } from "@/components/ui/button";

// ============================================================
// DEVELOPER SIDEBAR
// ============================================================
//
// Developer modules:
//
// 1. Dashboard
// 2. Profile Management
// 3. Project Participation
// 4. Task Management
// 5. Sprint Participation
// 6. Communication
// 7. Reports & Monitoring
// 8. Settings & Preferences
//
// ============================================================


// ============================================================
// STORAGE KEYS
// ============================================================

const USER_STORAGE_KEYS = [
    "user",
    "aipms_user",
    "currentUser",
    "authUser",
];


// ============================================================
// DEFAULT USER
// ============================================================

const DEFAULT_USER = {
    id: null,
    fullName: "Developer",
    name: "Developer",
    email: "developer@example.com",
    role: "Developer",
    accountCategory: "Developer",
    specialization: "Development",
    avatar: null,
};


// ============================================================
// GET STORED USER
// ============================================================

function getStoredUser() {
    for (const key of USER_STORAGE_KEYS) {
        try {
            const storedUser = localStorage.getItem(key);

            if (!storedUser) {
                continue;
            }

            const parsedUser = JSON.parse(storedUser);

            if (
                parsedUser &&
                typeof parsedUser === "object"
            ) {
                return parsedUser;
            }
        } catch (error) {
            console.error(
                `Unable to read ${key} from localStorage:`,
                error
            );
        }
    }

    return null;
}


// ============================================================
// USER HELPERS
// ============================================================

function getUserName(user) {
    return (
        user?.fullName ||
        user?.name ||
        user?.username ||
        user?.displayName ||
        "Developer"
    );
}


function getUserRole(user) {
    return (
        user?.role ||
        user?.accountCategory ||
        user?.userRole ||
        "Developer"
    );
}


function getUserSpecialization(user) {
    return (
        user?.specialization ||
        user?.specializationName ||
        user?.speciality ||
        "Development"
    );
}


function getInitials(name) {
    if (!name) {
        return "DV";
    }

    const parts = name
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (parts.length === 1) {
        return parts[0]
            .substring(0, 2)
            .toUpperCase();
    }

    return (
        parts[0].charAt(0) +
        parts[parts.length - 1].charAt(0)
    ).toUpperCase();
}


// ============================================================
// MAIN NAVIGATION
// ============================================================
//
// IMPORTANT:
// These paths should match AppRoutes.jsx.
//
// ============================================================

const MAIN_NAVIGATION = [

    // ========================================================
    // DASHBOARD
    // ========================================================

    {
        label: "Dashboard",
        path: "/developer/dashboard",
        icon: BarChart3,
        exact: true,
    },


    // ========================================================
    // PROFILE MANAGEMENT
    // ========================================================

    {
        label: "My Profile",
        path: "/developer/profile",
        icon: UserRound,
        exact: false,
    },


    // ========================================================
    // PROJECT PARTICIPATION
    // ========================================================

    {
        label: "Projects",
        path: "/developer/projects",
        icon: FolderKanban,
        exact: false,
    },


    // ========================================================
    // TASK MANAGEMENT
    // ========================================================

    {
        label: "Tasks",
        path: "/developer/tasks",
        icon: ListTodo,
        exact: false,
    },


    // ========================================================
    // SPRINT PARTICIPATION
    // ========================================================

    {
        label: "Sprint Participation",
        path: "/developer/sprint-participation",
        icon: Activity,
        exact: false,
    },


    // ========================================================
    // COMMUNICATION
    // ========================================================

    {
        label: "Communication",
        path: "/developer/communication",
        icon: MessageSquare,
        exact: false,
    },


    // ========================================================
    // REPORTS & MONITORING
    // ========================================================

    {
        label: "Reports & Monitoring",
        path: "/developer/reports",
        icon: BarChart3,
        exact: false,
    },


    // ========================================================
    // SETTINGS & PREFERENCES
    // ========================================================

    {
        label: "Settings",
        path: "/developer/settings",
        icon: Settings2,
        exact: false,
    },
];


// ============================================================
// PROFILE SUB NAVIGATION
// ============================================================

const PROFILE_NAVIGATION = [
    {
        label: "View Profile",
        path: "/developer/profile",
        icon: UserRound,
        exact: true,
    },
    {
        label: "Update Profile",
        path: "/developer/profile/update",
        icon: Wrench,
        exact: true,
    },
];


// ============================================================
// PROJECT SUB NAVIGATION
// ============================================================

const PROJECT_NAVIGATION = [
    {
        label: "Assigned Projects",
        path: "/developer/projects",
        icon: FolderKanban,
        exact: true,
    },
    {
        label: "Project Details",
        path: "/developer/projects/details",
        icon: BookOpen,
        exact: false,
    },
];


// ============================================================
// TASK SUB NAVIGATION
// ============================================================

const TASK_NAVIGATION = [
    {
        label: "Assigned Tasks",
        path: "/developer/tasks",
        icon: ListTodo,
        exact: true,
    },
    {
        label: "Update Task Status",
        path: "/developer/tasks/status",
        icon: Activity,
        exact: false,
    },
    {
        label: "Add Task Comment",
        path: "/developer/tasks/comments",
        icon: MessageSquareCode,
        exact: false,
    },
    {
        label: "Submit Completed Work",
        path: "/developer/tasks/submit",
        icon: Send,
        exact: false,
    },
    {
        label: "Upload Task Files",
        path: "/developer/tasks/files",
        icon: ClipboardCheck,
        exact: false,
    },
];


// ============================================================
// SPRINT SUB NAVIGATION
// ============================================================

const SPRINT_NAVIGATION = [
    {
        label: "Sprint Tasks",
        path: "/developer/sprints/tasks",
        icon: ListTodo,
        exact: false,
    },
    {
        label: "Sprint Progress",
        path: "/developer/sprints/progress",
        icon: Activity,
        exact: false,
    },
];


// ============================================================
// COMMUNICATION SUB NAVIGATION
// ============================================================

const COMMUNICATION_NAVIGATION = [
    {
        label: "Messages",
        path: "/developer/communication/messages",
        icon: MessageSquare,
        exact: false,
    },
    {
        label: "Task Comments",
        path: "/developer/communication/comments",
        icon: MessageSquareCode,
        exact: false,
    },
    {
        label: "Mentions",
        path: "/developer/communication/mentions",
        icon: UsersRound,
        exact: false,
    },
    {
        label: "Notifications",
        path: "/developer/communication/notifications",
        icon: Bell,
        exact: false,
    },
];


// ============================================================
// REPORTS SUB NAVIGATION
// ============================================================

const REPORT_NAVIGATION = [
    {
        label: "Personal Performance",
        path: "/developer/reports/performance",
        icon: BarChart3,
        exact: false,
    },
    {
        label: "Task History",
        path: "/developer/reports/history",
        icon: History,
        exact: false,
    },
];


// ============================================================
// SETTINGS SUB NAVIGATION
// ============================================================

const SETTINGS_NAVIGATION = [
    {
        label: "Notification Preferences",
        path: "/developer/settings/notifications",
        icon: Bell,
        exact: false,
    },
    {
        label: "Language Preferences",
        path: "/developer/settings/language",
        icon: Languages,
        exact: false,
    },
    {
        label: "Theme Preferences",
        path: "/developer/settings/theme",
        icon: Sun,
        exact: false,
    },
    {
        label: "AI Preferences",
        path: "/developer/settings/ai",
        icon: Sparkles,
        exact: false,
    },
];


// ============================================================
// COMPONENT
// ============================================================

function DeveloperSidebar({
    open = true,
    onClose,
    collapsed = false,
    onToggleCollapse,
}) {
    const navigate = useNavigate();
    const location = useLocation();


    // ========================================================
    // USER
    // ========================================================

    const user = useMemo(
        () => getStoredUser() || DEFAULT_USER,
        []
    );

    const userName = useMemo(
        () => getUserName(user),
        [user]
    );

    const userRole = useMemo(
        () => getUserRole(user),
        [user]
    );

    const specialization = useMemo(
        () => getUserSpecialization(user),
        [user]
    );

    const initials = useMemo(
        () => getInitials(userName),
        [userName]
    );


    // ========================================================
    // ACTIVE LINK
    // ========================================================

    const isActive = (item) => {
        if (item.exact) {
            return location.pathname === item.path;
        }

        return (
            location.pathname === item.path ||
            location.pathname.startsWith(
                `${item.path}/`
            )
        );
    };


    // ========================================================
    // NAVIGATION
    // ========================================================

    const handleNavigation = (path) => {
        if (!path) {
            return;
        }

        navigate(path);

        if (onClose) {
            onClose();
        }
    };


    // ========================================================
    // RENDER NAVIGATION ITEM
    // ========================================================

    const renderNavigationItem = (item) => {
        const Icon = item.icon;
        const active = isActive(item);

        return (
            <button
                key={item.path}
                type="button"
                onClick={() =>
                    handleNavigation(item.path)
                }
                title={
                    collapsed
                        ? item.label
                        : undefined
                }
                aria-current={
                    active
                        ? "page"
                        : undefined
                }
                className={`
                    group
                    flex
                    w-full
                    items-center
                    gap-2.5
                    rounded-md
                    px-2.5
                    py-2
                    text-left
                    text-xs
                    font-medium
                    transition-all
                    duration-200

                    ${
                        collapsed
                            ? "justify-center"
                            : ""
                    }

                    ${
                        active
                            ? `
                                bg-blue-600
                                text-white
                                shadow-sm
                            `
                            : `
                                text-slate-700
                                hover:bg-slate-100
                                hover:text-slate-900

                                dark:text-slate-300
                                dark:hover:bg-blue-950/60
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
                                : "text-slate-500 dark:text-slate-400"
                        }
                    `}
                />

                {!collapsed && (
                    <span className="truncate">
                        {item.label}
                    </span>
                )}

                {!collapsed && active && (
                    <span
                        className="
                            ml-auto
                            h-1
                            w-1
                            shrink-0
                            rounded-full
                            bg-white
                        "
                    />
                )}
            </button>
        );
    };


    // ========================================================
    // RENDER SUB NAVIGATION
    // ========================================================

    const renderSubNavigation = (
        items,
        title
    ) => {
        if (collapsed) {
            return null;
        }

        return (
            <div className="mt-2 mb-3">
                <p
                    className="
                        mb-1
                        px-3
                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-wider
                        text-slate-400
                        dark:text-slate-500
                    "
                >
                    {title}
                </p>

                <div className="space-y-0.5">
                    {items.map((item) =>
                        renderNavigationItem(item)
                    )}
                </div>
            </div>
        );
    };


    // ========================================================
    // DETERMINE CURRENT MODULE
    // ========================================================

    const currentModule = useMemo(() => {
        const path = location.pathname;

        if (path.startsWith("/developer/profile")) {
            return "profile";
        }

        if (path.startsWith("/developer/projects")) {
            return "projects";
        }

        if (path.startsWith("/developer/tasks")) {
            return "tasks";
        }

        if (path.startsWith("/developer/sprints")) {
            return "sprints";
        }

        if (
            path.startsWith(
                "/developer/communication"
            )
        ) {
            return "communication";
        }

        if (path.startsWith("/developer/reports")) {
            return "reports";
        }

        if (path.startsWith("/developer/settings")) {
            return "settings";
        }

        return null;
    }, [location.pathname]);


    // ========================================================
    // RENDER
    // ========================================================

    return (
        <>
            {/* ==================================================
                MOBILE BACKDROP
            ================================================== */}

            {open && (
                <button
                    type="button"
                    aria-label="Close developer sidebar"
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
                    flex-col

                    border-r
                    border-slate-200
                    bg-white
                    shadow-lg

                    transition-all
                    duration-300

                    dark:border-blue-900/70
                    dark:bg-[#0b1f3a]

                    ${
                        collapsed
                            ? "w-16"
                            : "w-64"
                    }

                    ${
                        open
                            ? "translate-x-0"
                            : "-translate-x-full"
                    }

                    lg:translate-x-0
                `}
            >

                {/* ==================================================
                    HEADER
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

                    {/* LOGO */}

                    <button
                        type="button"
                        onClick={() =>
                            handleNavigation(
                                "/developer/dashboard"
                            )
                        }
                        className={`
                            flex
                            items-center
                            gap-2.5

                            ${
                                collapsed
                                    ? "mx-auto"
                                    : ""
                            }
                        `}
                    >
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
                            <Code2 className="h-4 w-4" />
                        </div>

                        {!collapsed && (
                            <div className="text-left">
                                <p
                                    className="
                                        text-sm
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
                                    Developer Portal
                                </p>
                            </div>
                        )}
                    </button>


                    {/* DESKTOP COLLAPSE */}

                    {onToggleCollapse && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={
                                onToggleCollapse
                            }
                            className="
                                hidden
                                h-8
                                w-8
                                text-slate-500
                                hover:bg-slate-100
                                dark:text-slate-300
                                dark:hover:bg-blue-950/60
                                lg:flex
                            "
                            aria-label={
                                collapsed
                                    ? "Expand sidebar"
                                    : "Collapse sidebar"
                            }
                        >
                            {collapsed ? (
                                <PanelLeftOpen className="h-4 w-4" />
                            ) : (
                                <PanelLeftClose className="h-4 w-4" />
                            )}
                        </Button>
                    )}


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
                    USER PROFILE
                ================================================== */}

                <div
                    className={`
                        border-b
                        border-slate-200
                        p-3

                        dark:border-blue-900/70

                        ${
                            collapsed
                                ? "flex justify-center"
                                : ""
                        }
                    `}
                >
                    <button
                        type="button"
                        onClick={() =>
                            handleNavigation(
                                "/developer/profile"
                            )
                        }
                        className={`
                            flex
                            w-full
                            items-center
                            gap-2.5
                            rounded-lg
                            p-1.5
                            transition

                            hover:bg-slate-100
                            dark:hover:bg-blue-950/50

                            ${
                                collapsed
                                    ? "justify-center"
                                    : ""
                            }
                        `}
                    >

                        {/* AVATAR */}

                        {user?.avatar ? (
                            <img
                                src={user.avatar}
                                alt={userName}
                                className="
                                    h-8
                                    w-8
                                    shrink-0
                                    rounded-full
                                    object-cover
                                "
                            />
                        ) : (
                            <div
                                className="
                                    flex
                                    h-8
                                    w-8
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-blue-600
                                    text-[10px]
                                    font-bold
                                    text-white
                                "
                            >
                                {initials}
                            </div>
                        )}


                        {!collapsed && (
                            <div
                                className="
                                    min-w-0
                                    flex-1
                                    text-left
                                "
                            >
                                <p
                                    className="
                                        truncate
                                        text-xs
                                        font-semibold
                                        text-slate-900
                                        dark:text-white
                                    "
                                >
                                    {userName}
                                </p>

                                <p
                                    className="
                                        truncate
                                        text-[10px]
                                        text-slate-500
                                        dark:text-slate-400
                                    "
                                >
                                    {userRole}
                                </p>

                                <div className="mt-0.5">
                                    <span
                                        className="
                                            inline-flex
                                            max-w-full
                                            truncate
                                            rounded-full
                                            bg-blue-100
                                            px-1.5
                                            py-0.5
                                            text-[8px]
                                            font-semibold
                                            text-blue-700

                                            dark:bg-blue-950/60
                                            dark:text-blue-300
                                        "
                                    >
                                        {specialization}
                                    </span>
                                </div>
                            </div>
                        )}
                    </button>
                </div>


                {/* ==================================================
                    NAVIGATION
                ================================================== */}

                <div
                    className="
                        flex-1
                        overflow-y-auto
                        px-2
                        py-3
                    "
                >

                    {/* WORKSPACE */}

                    {!collapsed && (
                        <p
                            className="
                                mb-1.5
                                px-2.5
                                text-[9px]
                                font-bold
                                uppercase
                                tracking-wider
                                text-slate-400
                                dark:text-slate-500
                            "
                        >
                            Developer Workspace
                        </p>
                    )}


                    {/* MAIN NAVIGATION */}

                    <nav
                        className="space-y-0.5"
                        aria-label="Developer navigation"
                    >
                        {MAIN_NAVIGATION.map(
                            renderNavigationItem
                        )}
                    </nav>


                    {/* ==================================================
                        PROFILE
                    ================================================== */}

                    {currentModule === "profile" &&
                        renderSubNavigation(
                            PROFILE_NAVIGATION,
                            "Profile Management"
                        )}


                    {/* ==================================================
                        PROJECTS
                    ================================================== */}

                    {currentModule === "projects" &&
                        renderSubNavigation(
                            PROJECT_NAVIGATION,
                            "Project Participation"
                        )}


                    {/* ==================================================
                        TASKS
                    ================================================== */}

                    {currentModule === "tasks" &&
                        renderSubNavigation(
                            TASK_NAVIGATION,
                            "Task Management"
                        )}


                    {/* ==================================================
                        SPRINTS
                    ================================================== */}

                    {currentModule === "sprints" &&
                        renderSubNavigation(
                            SPRINT_NAVIGATION,
                            "Sprint Participation"
                        )}


                    {/* ==================================================
                        COMMUNICATION
                    ================================================== */}

                    {currentModule === "communication" &&
                        renderSubNavigation(
                            COMMUNICATION_NAVIGATION,
                            "Communication"
                        )}


                    {/* ==================================================
                        REPORTS
                    ================================================== */}

                    {currentModule === "reports" &&
                        renderSubNavigation(
                            REPORT_NAVIGATION,
                            "Reports & Monitoring"
                        )}


                    {/* ==================================================
                        SETTINGS
                    ================================================== */}

                    {currentModule === "settings" &&
                        renderSubNavigation(
                            SETTINGS_NAVIGATION,
                            "Settings & Preferences"
                        )}
                </div>


                {/* ==================================================
                    FOOTER
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

                    {!collapsed ? (
                        <div
                            className="
                                rounded-lg
                                border
                                border-blue-100
                                bg-blue-50
                                p-2.5

                                dark:border-blue-900/60
                                dark:bg-blue-950/30
                            "
                        >
                            <div className="flex items-center gap-2.5">

                                <div
                                    className="
                                        flex
                                        h-7
                                        w-7
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-md
                                        bg-blue-600
                                        text-white
                                    "
                                >
                                    <ShieldCheck className="h-3.5 w-3.5" />
                                </div>

                                <div className="min-w-0">

                                    <p
                                        className="
                                            truncate
                                            text-[10px]
                                            font-semibold
                                            text-blue-900
                                            dark:text-blue-200
                                        "
                                    >
                                        Developer Access
                                    </p>

                                    <p
                                        className="
                                            mt-0.5
                                            text-[8px]
                                            leading-3
                                            text-blue-700
                                            dark:text-blue-300
                                        "
                                    >
                                        Technical work permissions
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <div
                                className="
                                    flex
                                    h-8
                                    w-8
                                    items-center
                                    justify-center
                                    rounded-md
                                    bg-blue-600
                                    text-white
                                "
                                title="Developer Access"
                            >
                                <ShieldCheck className="h-4 w-4" />
                            </div>
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
}


export default DeveloperSidebar;