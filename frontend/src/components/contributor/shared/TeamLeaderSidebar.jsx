import { useState } from "react";
import { NavLink } from "react-router-dom";

import {
    BarChart3,
    ChevronDown,
    ClipboardList,
    FileText,
    Gauge,
    HelpCircle,
    LayoutDashboard,
    MessageSquare,
    UsersRound,
    Workflow,
    FolderKanban,
    X,
} from "lucide-react";

function TeamLeaderSidebar({
    isOpen = true,
    onClose,
}) {
    const [teamLeaderOpen, setTeamLeaderOpen] =
        useState(true);

    const [projectParticipationOpen, setProjectParticipationOpen] =
        useState(true);

    /* ========================================================
       TEAM LEADER MENU
    ======================================================== */

    const teamLeaderItems = [
        {
            label: "View Assigned Team",
            path: "/team-leader/assigned-team",
            icon: UsersRound,
        },
        {
            label: "View Team Tasks",
            path: "/team-leader/team-tasks",
            icon: ClipboardList,
        },
        {
            label: "Monitor Team Progress",
            path: "/team-leader/team-progress",
            icon: Gauge,
        },
        {
            label: "Coordinate Team Work",
            path: "/team-leader/coordinate-work",
            icon: Workflow,
        },
        {
            label: "Communicate with Manager",
            path: "/team-leader/manager-communication",
            icon: MessageSquare,
        },
        {
            label: "View Team Performance",
            path: "/team-leader/team-performance",
            icon: BarChart3,
        },
    ];

    /* ========================================================
       PROJECT PARTICIPATION SUB MENU
    ======================================================== */

    const projectParticipationItems = [
        {
            label: "View Assigned Projects",
            icon: FolderKanban,
            section: "assigned-projects",
        },
        {
            label: "View Project Details",
            icon: FileText,
            section: "details",
        },
        {
            label: "View Project Team",
            icon: UsersRound,
            section: "team",
        },
        {
            label: "View Project Tasks",
            icon: ClipboardList,
            section: "tasks",
        },
        {
            label: "View Project Progress",
            icon: Gauge,
            section: "progress",
        },
        {
            label: "Participate in Project Communication",
            icon: MessageSquare,
            section: "communication",
        },
        {
            label: "View Project Files",
            icon: FileText,
            section: "files",
        },
        {
            label: "Request Project Assistance",
            icon: HelpCircle,
            section: "assistance",
        },
    ];

    /* ========================================================
       NAV ITEM CLASS
    ======================================================== */

    const navItemClass = ({ isActive }) =>
        `
        group
        flex
        w-full
        items-center
        gap-3
        rounded-lg
        px-3
        py-2.5
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

    /* ========================================================
       SUB ITEM CLASS
    ======================================================== */

    const subItemClass = ({ isActive }) =>
        `
        group
        flex
        w-full
        items-center
        gap-3
        rounded-lg
        px-3
        py-2.5
        text-sm
        transition-all
        duration-200

        ${
            isActive
                ? `
                    bg-blue-600/90
                    text-white
                    shadow-sm
                  `
                : `
                    text-slate-400
                    hover:bg-blue-950/60
                    hover:text-white
                  `
        }
        `;

    /* ========================================================
       PROJECT SUB ITEM CLASS
    ======================================================== */

    const projectSubItemClass =
        `
        group
        flex
        w-full
        items-center
        gap-3
        rounded-lg
        px-3
        py-2
        text-xs
        transition-all
        duration-200
        text-slate-400
        hover:bg-blue-950/60
        hover:text-white
        `;

    /* ========================================================
       PROJECT PARTICIPATION MAIN BUTTON
    ======================================================== */

    const isProjectParticipationPage =
        window.location.pathname ===
            "/team-leader/project-participation";

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
                    left-0
                    top-0
                    z-50
                    flex
                    h-screen
                    w-72
                    flex-col
                    border-r
                    border-blue-900/70
                    bg-[#081b33]
                    text-white
                    shadow-xl
                    transition-transform
                    duration-300

                    lg:static
                    lg:z-auto
                    lg:translate-x-0

                    ${
                        isOpen
                            ? "translate-x-0"
                            : "-translate-x-full"
                    }
                `}
            >
                {/* ==================================================
                    SIDEBAR HEADER
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

                        <div
                            className="
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-lg
                                bg-blue-600
                                text-white
                                shadow-sm
                            "
                        >
                            <UsersRound className="h-5 w-5" />
                        </div>

                        <div>
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
                            hover:bg-blue-950/70
                            hover:text-white
                            lg:hidden
                        "
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* ==================================================
                    NAVIGATION
                ================================================== */}

                <nav
                    className="
                        flex-1
                        overflow-y-auto
                        px-3
                        py-5
                    "
                >
                    {/* ==================================================
                        DASHBOARD
                    ================================================== */}

                    <div className="mb-2">
                        <NavLink
                            to="/team-leader"
                            end
                            onClick={onClose}
                            className={navItemClass}
                        >
                            <LayoutDashboard
                                className="
                                    h-5
                                    w-5
                                    shrink-0
                                "
                            />

                            <span>
                                Dashboard
                            </span>
                        </NavLink>
                    </div>

                    {/* ==================================================
                        SECTION LABEL
                    ================================================== */}

                    <div
                        className="
                            mb-2
                            mt-6
                            px-3
                        "
                    >
                        <p
                            className="
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-[0.14em]
                                text-slate-500
                            "
                        >
                            Team Leader
                        </p>
                    </div>

                    {/* ==================================================
                        TEAM LEADER DROPDOWN
                    ================================================== */}

                    <div>

                        {/* TEAM LEADER BUTTON */}

                        <button
                            type="button"
                            onClick={() =>
                                setTeamLeaderOpen(
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
                                px-3
                                py-2.5
                                text-sm
                                font-semibold
                                text-slate-200
                                transition
                                hover:bg-blue-950/70
                                hover:text-white
                            "
                            aria-expanded={
                                teamLeaderOpen
                            }
                        >
                            <span
                                className="
                                    flex
                                    items-center
                                    gap-3
                                "
                            >
                                <UsersRound
                                    className="
                                        h-5
                                        w-5
                                        shrink-0
                                        text-blue-400
                                    "
                                />

                                <span>
                                    Team Leader
                                </span>
                            </span>

                            <ChevronDown
                                className={`
                                    h-4
                                    w-4
                                    text-slate-400
                                    transition-transform
                                    duration-200

                                    ${
                                        teamLeaderOpen
                                            ? "rotate-180"
                                            : ""
                                    }
                                `}
                            />
                        </button>

                        {/* ==================================================
                            TEAM LEADER CONTENT
                        ================================================== */}

                        {teamLeaderOpen && (
                            <div
                                className="
                                    mt-1
                                    space-y-1
                                    border-l
                                    border-blue-900
                                    ml-5
                                    pl-2
                                "
                            >
                                {/* ==================================================
                                    TEAM LEADER FEATURES
                                ================================================== */}

                                {teamLeaderItems.map(
                                    (item) => {
                                        const Icon =
                                            item.icon;

                                        return (
                                            <NavLink
                                                key={
                                                    item.path
                                                }
                                                to={
                                                    item.path
                                                }
                                                onClick={
                                                    onClose
                                                }
                                                className={
                                                    subItemClass
                                                }
                                            >
                                                <Icon
                                                    className="
                                                        h-4
                                                        w-4
                                                        shrink-0
                                                    "
                                                />

                                                <span>
                                                    {
                                                        item.label
                                                    }
                                                </span>
                                            </NavLink>
                                        );
                                    }
                                )}

                                {/* ==================================================
                                    PROJECT PARTICIPATION
                                ================================================== */}

                                <div className="pt-1">

                                    {/* PROJECT PARTICIPATION BUTTON */}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setProjectParticipationOpen(
                                                (current) =>
                                                    !current
                                            )
                                        }
                                        className={`
                                            flex
                                            w-full
                                            items-center
                                            justify-between
                                            rounded-lg
                                            px-3
                                            py-2.5
                                            text-sm
                                            font-semibold
                                            transition-all
                                            duration-200

                                            ${
                                                isProjectParticipationPage
                                                    ? "bg-blue-600 text-white"
                                                    : "text-slate-300 hover:bg-blue-950/70 hover:text-white"
                                            }
                                        `}
                                        aria-expanded={
                                            projectParticipationOpen
                                        }
                                    >
                                        <span
                                            className="
                                                flex
                                                items-center
                                                gap-3
                                            "
                                        >
                                            <FolderKanban
                                                className="
                                                    h-4
                                                    w-4
                                                    shrink-0
                                                    text-blue-400
                                                "
                                            />

                                            <span>
                                                Project Participation
                                            </span>
                                        </span>

                                        <ChevronDown
                                            className={`
                                                h-4
                                                w-4
                                                text-slate-400
                                                transition-transform
                                                duration-200

                                                ${
                                                    projectParticipationOpen
                                                        ? "rotate-180"
                                                        : ""
                                                }
                                            `}
                                        />
                                    </button>

                                    {/* ==================================================
                                        PROJECT PARTICIPATION SUB MENU
                                    ================================================== */}

                                    {projectParticipationOpen && (
                                        <div
                                            className="
                                                ml-5
                                                mt-1
                                                space-y-1
                                                border-l
                                                border-blue-900
                                                pl-2
                                            "
                                        >
                                            {/* ==================================================
                                                MAIN PROJECT PARTICIPATION PAGE
                                            ================================================== */}

                                            <NavLink
                                                to="/team-leader/project-participation"
                                                onClick={onClose}
                                                className={`
                                                    ${projectSubItemClass}

                                                    ${
                                                        isProjectParticipationPage
                                                            ? "bg-blue-600/80 text-white"
                                                            : ""
                                                    }
                                                `}
                                            >
                                                <FolderKanban
                                                    className="
                                                        h-4
                                                        w-4
                                                        shrink-0
                                                    "
                                                />

                                                <span>
                                                    Project Participation
                                                </span>
                                            </NavLink>

                                            {/* ==================================================
                                                8 PROJECT USE CASES
                                            ================================================== */}

                                            {projectParticipationItems.map(
                                                (item) => {
                                                    const Icon =
                                                        item.icon;

                                                    return (
                                                        <NavLink
                                                            key={
                                                                item.section
                                                            }
                                                            to={`/team-leader/project-participation?section=${item.section}`}
                                                            onClick={
                                                                onClose
                                                            }
                                                            className={
                                                                projectSubItemClass
                                                            }
                                                        >
                                                            <Icon
                                                                className="
                                                                    h-3.5
                                                                    w-3.5
                                                                    shrink-0
                                                                "
                                                            />

                                                            <span>
                                                                {
                                                                    item.label
                                                                }
                                                            </span>
                                                        </NavLink>
                                                    );
                                                }
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </nav>

                {/* ==================================================
                    SIDEBAR FOOTER
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
                            rounded-lg
                            bg-blue-950/50
                            px-3
                            py-3
                        "
                    >
                        <div
                            className="
                                flex
                                items-center
                                gap-3
                            "
                        >
                            <div
                                className="
                                    flex
                                    h-9
                                    w-9
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-blue-600
                                "
                            >
                                <UsersRound className="h-4 w-4" />
                            </div>

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
                                        truncate
                                        text-[10px]
                                        text-slate-400
                                    "
                                >
                                    Team Management
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