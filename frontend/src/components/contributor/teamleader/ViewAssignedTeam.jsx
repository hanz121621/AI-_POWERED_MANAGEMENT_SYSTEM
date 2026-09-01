import { useMemo, useState } from "react";

import {
    Users,
    UserRound,
    FolderKanban,
    ClipboardList,
    CircleCheck,
    CircleDot,
    Clock3,
    AlertCircle,
    UserCheck,
    UserX,
    RefreshCw,
    Eye,
    ShieldCheck,
    Code2,
    Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

/* ============================================================
   STATUS CONFIGURATION
============================================================ */

const TASK_STATUS = {
    COMPLETED: "Completed",
    IN_PROGRESS: "In Progress",
    TODO: "To Do",
    BLOCKED: "Blocked",
    REVIEW: "Awaiting Review",
};

const AVAILABILITY_STATUS = {
    AVAILABLE: "Available",
    BUSY: "Busy",
    AWAY: "Away",
    OFFLINE: "Offline",
};

/* ============================================================
   DEMO TEAM DATA
============================================================ */

const DEMO_TEAM = {
    id: 1,
    teamName: "AI Development Team",
    name: "AI Development Team",

    description:
        "Responsible for developing and maintaining AI-powered project management features.",

    manager: {
        id: 101,
        fullName: "Project Manager",
        email: "manager@example.com",
    },

    teamLeader: {
        id: 102,
        fullName: "Team Leader",
        email: "leader@example.com",
    },

    members: [
        {
            id: 201,
            userId: 201,
            fullName: "Abebe Kebede",
            email: "abebe@example.com",
            phone: "+251 900 000 001",

            contributorType: "Developer",
            contributorSubType: "Frontend Developer",

            availabilityStatus:
                AVAILABILITY_STATUS.AVAILABLE,

            assignedProjects: [
                {
                    id: 301,
                    name: "AI-PMS",
                },
            ],

            assignedTasks: [
                {
                    id: 401,
                    title: "Develop Project Dashboard",
                    project: "AI-PMS",
                    sprint: "Sprint 3",
                    status: TASK_STATUS.IN_PROGRESS,
                    progress: 70,
                    dueDate: "2026-09-01",
                },
                {
                    id: 402,
                    title: "Implement Project Filters",
                    project: "AI-PMS",
                    sprint: "Sprint 3",
                    status: TASK_STATUS.COMPLETED,
                    progress: 100,
                    dueDate: "2026-08-28",
                },
            ],
        },

        {
            id: 202,
            userId: 202,
            fullName: "Sara Mohammed",
            email: "sara@example.com",
            phone: "+251 900 000 002",

            contributorType: "Developer",
            contributorSubType: "Backend Developer",

            availabilityStatus:
                AVAILABILITY_STATUS.BUSY,

            assignedProjects: [
                {
                    id: 302,
                    name: "AI-PMS Backend",
                },
            ],

            assignedTasks: [
                {
                    id: 403,
                    title: "Implement Team API",
                    project: "AI-PMS Backend",
                    sprint: "Sprint 2",
                    status: TASK_STATUS.IN_PROGRESS,
                    progress: 55,
                    dueDate: "2026-09-03",
                },
            ],
        },

        {
            id: 203,
            userId: 203,
            fullName: "Dawit Tesfaye",
            email: "dawit@example.com",
            phone: "+251 900 000 003",

            contributorType: "Developer",
            contributorSubType: "QA/Tester",

            availabilityStatus:
                AVAILABILITY_STATUS.AVAILABLE,

            assignedProjects: [
                {
                    id: 303,
                    name: "AI-PMS Testing",
                },
            ],

            assignedTasks: [
                {
                    id: 404,
                    title: "Test Team Management",
                    project: "AI-PMS Testing",
                    sprint: "Sprint 4",
                    status: TASK_STATUS.REVIEW,
                    progress: 90,
                    dueDate: "2026-09-05",
                },
            ],
        },

        {
            id: 204,
            userId: 204,
            fullName: "Mekdes Alemu",
            email: "mekdes@example.com",
            phone: "+251 900 000 004",

            contributorType: "Staff",
            contributorSubType: "Project Assistant",

            availabilityStatus:
                AVAILABILITY_STATUS.AWAY,

            assignedProjects: [
                {
                    id: 304,
                    name: "AI-PMS Documentation",
                },
            ],

            assignedTasks: [
                {
                    id: 405,
                    title: "Update Project Documentation",
                    project: "AI-PMS Documentation",
                    sprint: "Sprint 2",
                    status: TASK_STATUS.TODO,
                    progress: 20,
                    dueDate: "2026-09-07",
                },
            ],
        },
    ],
};

/* ============================================================
   HELPER FUNCTIONS
============================================================ */

function getStatusIcon(status) {
    switch (status) {
        case TASK_STATUS.COMPLETED:
            return (
                <CircleCheck className="h-4 w-4 text-green-500" />
            );

        case TASK_STATUS.IN_PROGRESS:
            return (
                <CircleDot className="h-4 w-4 text-blue-500" />
            );

        case TASK_STATUS.BLOCKED:
            return (
                <AlertCircle className="h-4 w-4 text-red-500" />
            );

        case TASK_STATUS.REVIEW:
            return (
                <Clock3 className="h-4 w-4 text-orange-500" />
            );

        default:
            return (
                <Clock3 className="h-4 w-4 text-slate-400" />
            );
    }
}

function getAvailabilityIcon(status) {
    switch (status) {
        case AVAILABILITY_STATUS.AVAILABLE:
            return (
                <UserCheck className="h-4 w-4 text-green-500" />
            );

        case AVAILABILITY_STATUS.BUSY:
            return (
                <Clock3 className="h-4 w-4 text-orange-500" />
            );

        case AVAILABILITY_STATUS.AWAY:
            return (
                <UserRound className="h-4 w-4 text-yellow-500" />
            );

        default:
            return (
                <UserX className="h-4 w-4 text-slate-400" />
            );
    }
}

function getStatusBadgeClass(status) {
    switch (status) {
        case TASK_STATUS.COMPLETED:
            return "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400";

        case TASK_STATUS.IN_PROGRESS:
            return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400";

        case TASK_STATUS.BLOCKED:
            return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400";

        case TASK_STATUS.REVIEW:
            return "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400";

        default:
            return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
    }
}

function getAvailabilityClass(status) {
    switch (status) {
        case AVAILABILITY_STATUS.AVAILABLE:
            return "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400";

        case AVAILABILITY_STATUS.BUSY:
            return "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400";

        case AVAILABILITY_STATUS.AWAY:
            return "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400";

        default:
            return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
    }
}

function getInitials(name) {
    if (!name) {
        return "U";
    }

    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) =>
            part.charAt(0).toUpperCase()
        )
        .join("");
}

function formatDate(dateValue) {
    if (!dateValue) {
        return "Not specified";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return dateValue;
    }

    return date.toLocaleDateString();
}

/* ============================================================
   COMPONENT
============================================================ */

function ViewAssignedTeam({
    team: teamProp = null,
    loading: externalLoading = false,
    error: externalError = null,
    onRetry,
}) {
    /*
     * IMPORTANT:
     *
     * We no longer store teamProp in state and synchronize it
     * inside useEffect.
     *
     * This avoids:
     *
     * react-hooks/set-state-in-effect
     *
     * The team is derived directly from the props.
     */

    const team = teamProp || DEMO_TEAM;

    /*
     * Only loading/error states that can actually change locally
     * remain in state.
     */

    const [retryLoading, setRetryLoading] =
        useState(false);

    const [retryError, setRetryError] =
        useState(null);

    const [selectedMemberId, setSelectedMemberId] =
        useState(null);

    const [isUnauthorized, setIsUnauthorized] =
        useState(false);

    /* ========================================================
       LOADING
    ======================================================== */

    const isLoading =
        externalLoading || retryLoading;

    /* ========================================================
       ERROR
    ======================================================== */

    const error =
        externalError || retryError;

    /* ========================================================
       TEAM MEMBERS
    ======================================================== */

    const members = team?.members || [];

    /* ========================================================
       SELECTED MEMBER
       --------------------------------------------------------
       No useEffect required.
    ======================================================== */

    const selectedMember = useMemo(() => {
        if (!members.length) {
            return null;
        }

        const selected = members.find(
            (member) =>
                String(
                    member.id || member.userId
                ) === String(selectedMemberId)
        );

        return selected || members[0];
    }, [members, selectedMemberId]);

    /* ========================================================
       TEAM STATISTICS
    ======================================================== */

    const teamStatistics = useMemo(() => {
        const tasks = members.flatMap(
            (member) =>
                member.assignedTasks || []
        );

        const projects = members.flatMap(
            (member) =>
                member.assignedProjects || []
        );

        const uniqueProjectIds = new Set(
            projects.map(
                (project) =>
                    project.id || project.name
            )
        );

        return {
            members: members.length,

            tasks: tasks.length,

            projects: uniqueProjectIds.size,

            completedTasks:
                tasks.filter(
                    (task) =>
                        task.status ===
                        TASK_STATUS.COMPLETED
                ).length,

            inProgressTasks:
                tasks.filter(
                    (task) =>
                        task.status ===
                        TASK_STATUS.IN_PROGRESS
                ).length,

            blockedTasks:
                tasks.filter(
                    (task) =>
                        task.status ===
                        TASK_STATUS.BLOCKED
                ).length,
        };
    }, [members]);

    /* ========================================================
       RETRY
    ======================================================== */

    const handleRetry = async () => {
        setRetryError(null);
        setIsUnauthorized(false);

        if (onRetry) {
            try {
                setRetryLoading(true);

                await onRetry();
            } catch (retryError) {
                console.error(
                    "Unable to reload team information:",
                    retryError
                );

                setRetryError(
                    "Unable to load team information. Please try again."
                );
            } finally {
                setRetryLoading(false);
            }

            return;
        }

        /*
         * Temporary frontend retry.
         *
         * Once the .NET API is connected, this section
         * should call the real team service.
         */

        setRetryLoading(true);

        window.setTimeout(() => {
            setRetryLoading(false);
        }, 500);
    };

    /* ========================================================
       LOADING STATE
    ======================================================== */

    if (isLoading) {
        return (
            <div
                className="
                    flex
                    min-h-[220px]
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    dark:border-blue-900/70
                    dark:bg-[#0f2747]
                "
            >
                <div className="text-center">
                    <Loader2
                        className="
                            mx-auto
                            h-8
                            w-8
                            animate-spin
                            text-blue-500
                        "
                    />

                    <p
                        className="
                            mt-3
                            text-sm
                            font-medium
                            text-slate-700
                            dark:text-slate-200
                        "
                    >
                        Loading team information...
                    </p>

                    <p
                        className="
                            mt-1
                            text-xs
                            text-slate-500
                            dark:text-slate-400
                        "
                    >
                        Please wait.
                    </p>
                </div>
            </div>
        );
    }

    /* ========================================================
       UNAUTHORIZED
    ======================================================== */

    if (isUnauthorized) {
        return (
            <div
                className="
                    rounded-xl
                    border
                    border-red-200
                    bg-red-50
                    p-8
                    text-center
                    dark:border-red-900/60
                    dark:bg-red-950/20
                "
            >
                <div
                    className="
                        mx-auto
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-full
                        bg-red-100
                        text-red-600
                        dark:bg-red-950/50
                        dark:text-red-400
                    "
                >
                    <ShieldCheck className="h-6 w-6" />
                </div>

                <h3
                    className="
                        mt-4
                        text-base
                        font-semibold
                        text-red-700
                        dark:text-red-400
                    "
                >
                    Access Denied
                </h3>

                <p
                    className="
                        mt-1
                        text-sm
                        text-red-600
                        dark:text-red-400
                    "
                >
                    You do not have permission to view
                    this team.
                </p>
            </div>
        );
    }

    /* ========================================================
       LOAD ERROR
    ======================================================== */

    if (error) {
        return (
            <div
                className="
                    rounded-xl
                    border
                    border-red-200
                    bg-red-50
                    p-8
                    text-center
                    dark:border-red-900/60
                    dark:bg-red-950/20
                "
            >
                <div
                    className="
                        mx-auto
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-full
                        bg-red-100
                        text-red-600
                        dark:bg-red-950/50
                        dark:text-red-400
                    "
                >
                    <AlertCircle className="h-6 w-6" />
                </div>

                <h3
                    className="
                        mt-4
                        text-base
                        font-semibold
                        text-red-700
                        dark:text-red-400
                    "
                >
                    Unable to Load Team
                </h3>

                <p
                    className="
                        mx-auto
                        mt-1
                        max-w-md
                        text-sm
                        text-red-600
                        dark:text-red-400
                    "
                >
                    {error ||
                        "Unable to load team information. Please try again."}
                </p>

                <Button
                    type="button"
                    variant="outline"
                    onClick={handleRetry}
                    className="
                        mt-4
                        border-red-200
                        text-red-600
                        hover:bg-red-100
                        dark:border-red-900/70
                        dark:text-red-400
                        dark:hover:bg-red-950/40
                    "
                >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                </Button>
            </div>
        );
    }

    /* ========================================================
       NO TEAM ASSIGNED
    ======================================================== */

    if (!team) {
        return (
            <div
                className="
                    rounded-xl
                    border
                    border-dashed
                    border-slate-300
                    bg-white
                    px-6
                    py-10
                    text-center
                    dark:border-blue-900/70
                    dark:bg-[#0f2747]
                "
            >
                <div
                    className="
                        mx-auto
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-full
                        bg-blue-100
                        text-blue-600
                        dark:bg-blue-950/60
                        dark:text-blue-400
                    "
                >
                    <Users className="h-6 w-6" />
                </div>

                <h3
                    className="
                        mt-4
                        text-base
                        font-semibold
                        text-slate-800
                        dark:text-white
                    "
                >
                    No Team Assigned
                </h3>

                <p
                    className="
                        mx-auto
                        mt-1
                        max-w-md
                        text-sm
                        text-slate-500
                        dark:text-slate-400
                    "
                >
                    No team is currently assigned to you.
                </p>
            </div>
        );
    }

    /* ========================================================
       TEAM MEMBERS
    ======================================================== */

    return (
        <div className="space-y-5">

            {/* ==================================================
                TEAM SUMMARY
            ================================================== */}

            <div
                className="
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    p-5
                    dark:border-blue-900/70
                    dark:bg-[#0f2747]
                "
            >
                <div
                    className="
                        flex
                        flex-col
                        gap-4
                        md:flex-row
                        md:items-start
                        md:justify-between
                    "
                >
                    <div>
                        <div className="flex items-center gap-3">

                            <div
                                className="
                                    flex
                                    h-11
                                    w-11
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-blue-100
                                    text-blue-600
                                    dark:bg-blue-950/60
                                    dark:text-blue-400
                                "
                            >
                                <Users className="h-5 w-5" />
                            </div>

                            <div>
                                <h3
                                    className="
                                        text-lg
                                        font-semibold
                                        text-slate-900
                                        dark:text-white
                                    "
                                >
                                    {team.teamName ||
                                        team.name ||
                                        "My Team"}
                                </h3>

                                <p
                                    className="
                                        mt-1
                                        text-xs
                                        text-slate-500
                                        dark:text-slate-400
                                    "
                                >
                                    Assigned Team
                                </p>
                            </div>
                        </div>

                        {team.description && (
                            <p
                                className="
                                    mt-4
                                    max-w-2xl
                                    text-sm
                                    leading-6
                                    text-slate-600
                                    dark:text-slate-300
                                "
                            >
                                {team.description}
                            </p>
                        )}
                    </div>

                    <div
                        className="
                            rounded-lg
                            border
                            border-blue-100
                            bg-blue-50
                            px-4
                            py-3
                            dark:border-blue-900/60
                            dark:bg-blue-950/30
                        "
                    >
                        <p
                            className="
                                text-xs
                                text-blue-600
                                dark:text-blue-400
                            "
                        >
                            Team Members
                        </p>

                        <p
                            className="
                                mt-1
                                text-2xl
                                font-bold
                                text-blue-700
                                dark:text-blue-300
                            "
                        >
                            {teamStatistics.members}
                        </p>
                    </div>
                </div>

                {/* TEAM STATISTICS */}

                <div
                    className="
                        mt-5
                        grid
                        grid-cols-2
                        gap-3
                        md:grid-cols-4
                    "
                >
                    <SummaryCard
                        icon={
                            <Users className="h-4 w-4" />
                        }
                        label="Members"
                        value={teamStatistics.members}
                    />

                    <SummaryCard
                        icon={
                            <FolderKanban className="h-4 w-4" />
                        }
                        label="Projects"
                        value={teamStatistics.projects}
                    />

                    <SummaryCard
                        icon={
                            <ClipboardList className="h-4 w-4" />
                        }
                        label="Tasks"
                        value={teamStatistics.tasks}
                    />

                    <SummaryCard
                        icon={
                            <CircleCheck className="h-4 w-4" />
                        }
                        label="Completed"
                        value={
                            teamStatistics.completedTasks
                        }
                    />
                </div>
            </div>

            {/* ==================================================
                NO MEMBERS
            ================================================== */}

            {members.length === 0 ? (
                <div
                    className="
                        rounded-xl
                        border
                        border-dashed
                        border-slate-300
                        bg-white
                        px-6
                        py-10
                        text-center
                        dark:border-blue-900/70
                        dark:bg-[#0f2747]
                    "
                >
                    <Users
                        className="
                            mx-auto
                            h-10
                            w-10
                            text-slate-400
                        "
                    />

                    <h3
                        className="
                            mt-4
                            text-base
                            font-semibold
                            text-slate-800
                            dark:text-white
                        "
                    >
                        No Team Members
                    </h3>

                    <p
                        className="
                            mt-1
                            text-sm
                            text-slate-500
                            dark:text-slate-400
                        "
                    >
                        No team members are currently
                        assigned.
                    </p>
                </div>
            ) : (
                <>
                    {/* ==========================================
                        MEMBERS LIST
                    ========================================== */}

                    <div
                        className="
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            p-5
                            dark:border-blue-900/70
                            dark:bg-[#0f2747]
                        "
                    >
                        <div className="mb-4">
                            <h3
                                className="
                                    text-base
                                    font-semibold
                                    text-slate-900
                                    dark:text-white
                                "
                            >
                                Team Members
                            </h3>

                            <p
                                className="
                                    mt-1
                                    text-xs
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                Select a team member to view
                                authorized information.
                            </p>
                        </div>

                        <div
                            className="
                                grid
                                grid-cols-1
                                gap-3
                                md:grid-cols-2
                            "
                        >
                            {members.map((member) => {
                                const memberId =
                                    member.id ||
                                    member.userId;

                                const isSelected =
                                    String(
                                        selectedMemberId
                                    ) === String(memberId);

                                return (
                                    <button
                                        key={memberId}
                                        type="button"
                                        onClick={() =>
                                            setSelectedMemberId(
                                                memberId
                                            )
                                        }
                                        className={`
                                            rounded-xl
                                            border
                                            p-4
                                            text-left
                                            transition
                                            ${
                                                isSelected
                                                    ? "border-blue-400 bg-blue-50 dark:border-blue-700 dark:bg-blue-950/30"
                                                    : "border-slate-200 bg-slate-50 hover:border-blue-200 hover:bg-blue-50/50 dark:border-blue-900/70 dark:bg-[#132f52] dark:hover:bg-blue-950/20"
                                            }
                                        `}
                                    >
                                        <div className="flex items-start gap-3">

                                            <div
                                                className="
                                                    flex
                                                    h-10
                                                    w-10
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-full
                                                    bg-blue-100
                                                    font-semibold
                                                    text-blue-600
                                                    dark:bg-blue-950/70
                                                    dark:text-blue-400
                                                "
                                            >
                                                {getInitials(
                                                    member.fullName ||
                                                        member.name
                                                )}
                                            </div>

                                            <div className="min-w-0 flex-1">

                                                <div
                                                    className="
                                                        flex
                                                        items-start
                                                        justify-between
                                                        gap-2
                                                    "
                                                >
                                                    <div>
                                                        <p
                                                            className="
                                                                truncate
                                                                text-sm
                                                                font-semibold
                                                                text-slate-900
                                                                dark:text-white
                                                            "
                                                        >
                                                            {member.fullName ||
                                                                member.name ||
                                                                member.email ||
                                                                "Unknown User"}
                                                        </p>

                                                        <p
                                                            className="
                                                                mt-0.5
                                                                truncate
                                                                text-xs
                                                                text-slate-500
                                                                dark:text-slate-400
                                                            "
                                                        >
                                                            {member.email ||
                                                                "No email available"}
                                                        </p>
                                                    </div>

                                                    <Eye
                                                        className={`
                                                            h-4
                                                            w-4
                                                            shrink-0
                                                            ${
                                                                isSelected
                                                                    ? "text-blue-500"
                                                                    : "text-slate-400"
                                                            }
                                                        `}
                                                    />
                                                </div>

                                                <div
                                                    className="
                                                        mt-3
                                                        flex
                                                        flex-wrap
                                                        gap-2
                                                    "
                                                >
                                                    <span
                                                        className="
                                                            inline-flex
                                                            items-center
                                                            gap-1
                                                            rounded-full
                                                            bg-slate-100
                                                            px-2.5
                                                            py-1
                                                            text-[11px]
                                                            font-medium
                                                            text-slate-700
                                                            dark:bg-slate-800
                                                            dark:text-slate-300
                                                        "
                                                    >
                                                        {member.contributorType ||
                                                            "Contributor"}
                                                    </span>

                                                    {member.contributorSubType && (
                                                        <span
                                                            className="
                                                                inline-flex
                                                                items-center
                                                                gap-1
                                                                rounded-full
                                                                bg-blue-100
                                                                px-2.5
                                                                py-1
                                                                text-[11px]
                                                                font-medium
                                                                text-blue-700
                                                                dark:bg-blue-950/50
                                                                dark:text-blue-300
                                                            "
                                                        >
                                                            {
                                                                member.contributorSubType
                                                            }
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* SELECTED MEMBER */}

                    {selectedMember && (
                        <MemberDetails
                            member={selectedMember}
                        />
                    )}
                </>
            )}
        </div>
    );
}

/* ============================================================
   SUMMARY CARD
============================================================ */

function SummaryCard({
    icon,
    label,
    value,
}) {
    return (
        <div
            className="
                rounded-lg
                border
                border-slate-200
                bg-slate-50
                p-3
                dark:border-blue-900/70
                dark:bg-[#132f52]
            "
        >
            <div className="flex items-center gap-2">
                <div className="text-blue-500">
                    {icon}
                </div>

                <p
                    className="
                        text-xs
                        text-slate-500
                        dark:text-slate-400
                    "
                >
                    {label}
                </p>
            </div>

            <p
                className="
                    mt-2
                    text-lg
                    font-bold
                    text-slate-900
                    dark:text-white
                "
            >
                {value}
            </p>
        </div>
    );
}

/* ============================================================
   MEMBER DETAILS
============================================================ */

function MemberDetails({ member }) {
    const tasks = member.assignedTasks || [];
    const projects =
        member.assignedProjects || [];

    return (
        <div
            className="
                overflow-hidden
                rounded-xl
                border
                border-slate-200
                bg-white
                dark:border-blue-900/70
                dark:bg-[#0f2747]
            "
        >
            {/* MEMBER HEADER */}

            <div
                className="
                    border-b
                    border-slate-200
                    bg-slate-50
                    p-5
                    dark:border-blue-900/70
                    dark:bg-[#132f52]
                "
            >
                <div
                    className="
                        flex
                        flex-col
                        gap-4
                        md:flex-row
                        md:items-center
                        md:justify-between
                    "
                >
                    <div className="flex items-center gap-3">

                        <div
                            className="
                                flex
                                h-12
                                w-12
                                items-center
                                justify-center
                                rounded-full
                                bg-blue-100
                                text-sm
                                font-bold
                                text-blue-600
                                dark:bg-blue-950/70
                                dark:text-blue-400
                            "
                        >
                            {getInitials(
                                member.fullName ||
                                    member.name
                            )}
                        </div>

                        <div>
                            <h3
                                className="
                                    text-base
                                    font-semibold
                                    text-slate-900
                                    dark:text-white
                                "
                            >
                                {member.fullName ||
                                    member.name ||
                                    "Unknown User"}
                            </h3>

                            <p
                                className="
                                    mt-1
                                    text-xs
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                {member.email ||
                                    "No email available"}
                            </p>
                        </div>
                    </div>

                    <div
                        className={`
                            inline-flex
                            w-fit
                            items-center
                            gap-2
                            rounded-full
                            px-3
                            py-1.5
                            text-xs
                            font-medium
                            ${getAvailabilityClass(
                                member.availabilityStatus
                            )}
                        `}
                    >
                        {getAvailabilityIcon(
                            member.availabilityStatus
                        )}

                        {member.availabilityStatus ||
                            "Status unavailable"}
                    </div>
                </div>
            </div>

            {/* MEMBER INFORMATION */}

            <div className="space-y-6 p-5">

                {/* CONTRIBUTOR INFORMATION */}

                <div>
                    <h4
                        className="
                            mb-3
                            text-sm
                            font-semibold
                            text-slate-900
                            dark:text-white
                        "
                    >
                        Contributor Information
                    </h4>

                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-3
                            sm:grid-cols-2
                            lg:grid-cols-3
                        "
                    >
                        <InformationItem
                            label="Contributor Type"
                            value={
                                member.contributorType
                            }
                            icon={
                                <UserRound className="h-4 w-4" />
                            }
                        />

                        <InformationItem
                            label="Specialization"
                            value={
                                member.contributorSubType ||
                                "Not applicable"
                            }
                            icon={
                                <Code2 className="h-4 w-4" />
                            }
                        />

                        <InformationItem
                            label="Availability"
                            value={
                                member.availabilityStatus ||
                                "Not specified"
                            }
                            icon={
                                <UserCheck className="h-4 w-4" />
                            }
                        />
                    </div>
                </div>

                {/* ASSIGNED PROJECTS */}

                <div>
                    <div
                        className="
                            mb-3
                            flex
                            items-center
                            justify-between
                        "
                    >
                        <div className="flex items-center gap-2">

                            <FolderKanban className="h-4 w-4 text-blue-500" />

                            <h4
                                className="
                                    text-sm
                                    font-semibold
                                    text-slate-900
                                    dark:text-white
                                "
                            >
                                Assigned Projects
                            </h4>
                        </div>

                        <span
                            className="
                                rounded-full
                                bg-blue-100
                                px-2.5
                                py-1
                                text-[11px]
                                font-medium
                                text-blue-700
                                dark:bg-blue-950/50
                                dark:text-blue-300
                            "
                        >
                            {projects.length}
                        </span>
                    </div>

                    {projects.length === 0 ? (
                        <EmptyInformation
                            message="No projects are currently assigned."
                        />
                    ) : (
                        <div
                            className="
                                grid
                                grid-cols-1
                                gap-3
                                sm:grid-cols-2
                            "
                        >
                            {projects.map(
                                (project) => (
                                    <div
                                        key={
                                            project.id ||
                                            project.name
                                        }
                                        className="
                                            rounded-lg
                                            border
                                            border-slate-200
                                            bg-slate-50
                                            p-3
                                            dark:border-blue-900/70
                                            dark:bg-[#132f52]
                                        "
                                    >
                                        <div className="flex items-center gap-2">

                                            <FolderKanban
                                                className="
                                                    h-4
                                                    w-4
                                                    text-blue-500
                                                "
                                            />

                                            <p
                                                className="
                                                    text-sm
                                                    font-medium
                                                    text-slate-800
                                                    dark:text-white
                                                "
                                            >
                                                {project.name ||
                                                    "Unnamed Project"}
                                            </p>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>

                {/* ASSIGNED TASKS */}

                <div>
                    <div
                        className="
                            mb-3
                            flex
                            items-center
                            justify-between
                        "
                    >
                        <div className="flex items-center gap-2">

                            <ClipboardList className="h-4 w-4 text-blue-500" />

                            <h4
                                className="
                                    text-sm
                                    font-semibold
                                    text-slate-900
                                    dark:text-white
                                "
                            >
                                Assigned Tasks
                            </h4>
                        </div>

                        <span
                            className="
                                rounded-full
                                bg-blue-100
                                px-2.5
                                py-1
                                text-[11px]
                                font-medium
                                text-blue-700
                                dark:bg-blue-950/50
                                dark:text-blue-300
                            "
                        >
                            {tasks.length}
                        </span>
                    </div>

                    {tasks.length === 0 ? (
                        <EmptyInformation
                            message="No tasks are currently assigned."
                        />
                    ) : (
                        <div className="space-y-3">

                            {tasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="
                                        rounded-lg
                                        border
                                        border-slate-200
                                        bg-slate-50
                                        p-4
                                        dark:border-blue-900/70
                                        dark:bg-[#132f52]
                                    "
                                >
                                    <div
                                        className="
                                            flex
                                            flex-col
                                            gap-3
                                            lg:flex-row
                                            lg:items-start
                                            lg:justify-between
                                        "
                                    >
                                        <div className="min-w-0">

                                            <div className="flex items-start gap-2">

                                                <div className="mt-0.5">
                                                    {getStatusIcon(
                                                        task.status
                                                    )}
                                                </div>

                                                <div>
                                                    <p
                                                        className="
                                                            text-sm
                                                            font-semibold
                                                            text-slate-800
                                                            dark:text-white
                                                        "
                                                    >
                                                        {task.title ||
                                                            "Untitled Task"}
                                                    </p>

                                                    <p
                                                        className="
                                                            mt-1
                                                            text-xs
                                                            text-slate-500
                                                            dark:text-slate-400
                                                        "
                                                    >
                                                        {task.project ||
                                                            "No project"}{" "}
                                                        •{" "}
                                                        {task.sprint ||
                                                            "No sprint"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <span
                                            className={`
                                                inline-flex
                                                w-fit
                                                shrink-0
                                                items-center
                                                gap-1.5
                                                rounded-full
                                                px-2.5
                                                py-1
                                                text-[11px]
                                                font-medium
                                                ${getStatusBadgeClass(
                                                    task.status
                                                )}
                                            `}
                                        >
                                            {getStatusIcon(
                                                task.status
                                            )}

                                            {task.status ||
                                                "Unknown"}
                                        </span>
                                    </div>

                                    <div
                                        className="
                                            mt-4
                                            grid
                                            grid-cols-2
                                            gap-3
                                            sm:grid-cols-3
                                        "
                                    >
                                        <div>
                                            <p className="text-[11px] text-slate-400">
                                                Progress
                                            </p>

                                            <p
                                                className="
                                                    mt-1
                                                    text-xs
                                                    font-semibold
                                                    text-slate-700
                                                    dark:text-slate-200
                                                "
                                            >
                                                {task.progress ??
                                                    0}
                                                %
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-[11px] text-slate-400">
                                                Due Date
                                            </p>

                                            <p
                                                className="
                                                    mt-1
                                                    text-xs
                                                    font-semibold
                                                    text-slate-700
                                                    dark:text-slate-200
                                                "
                                            >
                                                {formatDate(
                                                    task.dueDate
                                                )}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-[11px] text-slate-400">
                                                Status
                                            </p>

                                            <p
                                                className="
                                                    mt-1
                                                    text-xs
                                                    font-semibold
                                                    text-slate-700
                                                    dark:text-slate-200
                                                "
                                            >
                                                {task.status ||
                                                    "Unknown"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* PROGRESS BAR */}

                                    <div className="mt-3">
                                        <div
                                            className="
                                                h-1.5
                                                overflow-hidden
                                                rounded-full
                                                bg-slate-200
                                                dark:bg-slate-700
                                            "
                                        >
                                            <div
                                                className="
                                                    h-full
                                                    rounded-full
                                                    bg-blue-500
                                                    transition-all
                                                "
                                                style={{
                                                    width: `${Math.min(
                                                        Math.max(
                                                            Number(
                                                                task.progress ||
                                                                    0
                                                            ),
                                                            0
                                                        ),
                                                        100
                                                    )}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ============================================================
   INFORMATION ITEM
============================================================ */

function InformationItem({
    label,
    value,
    icon,
}) {
    return (
        <div
            className="
                rounded-lg
                border
                border-slate-200
                bg-slate-50
                p-3
                dark:border-blue-900/70
                dark:bg-[#132f52]
            "
        >
            <div className="flex items-center gap-2">

                <span className="text-blue-500">
                    {icon}
                </span>

                <p
                    className="
                        text-xs
                        text-slate-500
                        dark:text-slate-400
                    "
                >
                    {label}
                </p>
            </div>

            <p
                className="
                    mt-2
                    text-sm
                    font-medium
                    text-slate-800
                    dark:text-white
                "
            >
                {value || "Not specified"}
            </p>
        </div>
    );
}

/* ============================================================
   EMPTY INFORMATION
============================================================ */

function EmptyInformation({ message }) {
    return (
        <div
            className="
                rounded-lg
                border
                border-dashed
                border-slate-300
                bg-slate-50
                px-4
                py-6
                text-center
                dark:border-blue-900/70
                dark:bg-[#132f52]
            "
        >
            <p
                className="
                    text-xs
                    text-slate-500
                    dark:text-slate-400
                "
            >
                {message}
            </p>
        </div>
    );
}

export default ViewAssignedTeam;