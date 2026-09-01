import { useState } from "react";
import { NavLink } from "react-router-dom";

import {
    BarChart3,
    ChevronDown,
    ClipboardList,
    Gauge,
    LayoutDashboard,
    MessageSquare,
    UsersRound,
    Workflow,
    X,
} from "lucide-react";

function TeamLeaderSidebar({
    isOpen = true,
    onClose,
}) {
    const [teamLeaderOpen, setTeamLeaderOpen] =
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

                IMPORTANT:
                - relative instead of fixed
                - min-h-screen instead of h-screen

                This allows the sidebar to move together with
                the main page when the page itself is scrolled.
            ================================================== */}

            <aside
                className={`
                    relative
                    z-50
                    flex
                    min-h-screen
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
                        {/* LOGO */}

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
                            <UsersRound
                                className="h-5 w-5"
                            />
                        </div>

                        {/* TITLE */}

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

                    IMPORTANT:
                    Removed overflow-y-auto so the sidebar does
                    not have its own separate scrollbar.
                ================================================== */}

                <nav
                    className="
                        flex-1
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
                        {/* DROPDOWN BUTTON */}

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
                            <span className="flex items-center gap-3">
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
                            DROPDOWN CONTENT
                        ================================================== */}

                        {teamLeaderOpen && (
                            <div
                                className="
                                    mt-1
                                    ml-5
                                    space-y-1
                                    border-l
                                    border-blue-900
                                    pl-2
                                "
                            >
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
                                <UsersRound
                                    className="h-4 w-4"
                                />
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