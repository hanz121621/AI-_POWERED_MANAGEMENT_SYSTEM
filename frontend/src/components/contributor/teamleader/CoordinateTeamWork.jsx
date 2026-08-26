import { useMemo, useState } from "react";

import {
    AlertCircle,
    ArrowUpRight,
    CheckCircle2,
    ChevronDown,
    Clock3,
    Flag,
    Info,
    MessageSquare,
    RefreshCw,
    Send,
    ShieldAlert,
    UserCheck,
    UserRound,
    UserX,
    Users,
    X,
    Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";

/* ============================================================
   CONT-LEADER-004
   COORDINATE TEAM WORK

   Primary Actor:
   Team Leader

   Purpose:
   Allow the Team Leader to coordinate communication and
   work activities among assigned team members without
   taking over Manager-level project authority.
============================================================ */

/* ============================================================
   CONSTANTS
============================================================ */

const COORDINATION_TYPES = {
    INSTRUCTION: "Coordination Instruction",
    INFORMATION: "Information Sharing",
    BLOCKER: "Blocker",
    PROGRESS_REQUEST: "Progress Update Request",
    TASK_COMMUNICATION: "Task Communication",
    DEPENDENCY: "Dependency",
    ESCALATION: "Manager Escalation",
};

const PRIORITIES = {
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High",
    URGENT: "Urgent",
};

const MEMBER_STATUS = {
    AVAILABLE: "Available",
    BUSY: "Busy",
    AWAY: "Away",
    OFFLINE: "Offline",
};

const ACTIVITY_STATUS = {
    SENT: "Sent",
    PENDING: "Pending",
    ESCALATED: "Escalated",
};

/* ============================================================
   DEMO DATA

   Replace this data later with:

   GET /api/teams/my-team
   GET /api/teams/my-team/activities
   POST /api/team-coordination

============================================================ */

const DEMO_TEAM = {
    id: 1,
    name: "AI Development Team",
    description:
        "Coordinates frontend, backend, testing, and documentation activities for AI-PMS.",
    manager: {
        id: 101,
        fullName: "Project Manager",
        email: "manager@example.com",
    },

    members: [
        {
            id: 201,
            fullName: "Abebe Kebede",
            email: "abebe@example.com",
            contributorType: "Developer",
            specialization: "Frontend Developer",
            status: MEMBER_STATUS.AVAILABLE,
            currentTask: "Develop Project Dashboard",
            project: "AI-PMS",
            progress: 70,
        },
        {
            id: 202,
            fullName: "Sara Mohammed",
            email: "sara@example.com",
            contributorType: "Developer",
            specialization: "Backend Developer",
            status: MEMBER_STATUS.BUSY,
            currentTask: "Implement Team API",
            project: "AI-PMS Backend",
            progress: 55,
        },
        {
            id: 203,
            fullName: "Dawit Tesfaye",
            email: "dawit@example.com",
            contributorType: "Developer",
            specialization: "QA / Tester",
            status: MEMBER_STATUS.AVAILABLE,
            currentTask: "Test Team Management",
            project: "AI-PMS Testing",
            progress: 90,
        },
        {
            id: 204,
            fullName: "Mekdes Alemu",
            email: "mekdes@example.com",
            contributorType: "Staff",
            specialization: "Project Assistant",
            status: MEMBER_STATUS.AWAY,
            currentTask: "Update Project Documentation",
            project: "AI-PMS Documentation",
            progress: 20,
        },
    ],
};

const INITIAL_ACTIVITIES = [
    {
        id: 1,
        type: COORDINATION_TYPES.PROGRESS_REQUEST,
        recipientId: 201,
        recipientName: "Abebe Kebede",
        message:
            "Please provide an update on the Project Dashboard task.",
        priority: PRIORITIES.MEDIUM,
        status: ACTIVITY_STATUS.SENT,
        createdAt: "2026-08-24T09:30:00",
    },
    {
        id: 2,
        type: COORDINATION_TYPES.BLOCKER,
        recipientId: 202,
        recipientName: "Sara Mohammed",
        message:
            "Backend API dependency is blocking frontend integration.",
        priority: PRIORITIES.HIGH,
        status: ACTIVITY_STATUS.ESCALATED,
        createdAt: "2026-08-24T11:15:00",
    },
];

/* ============================================================
   HELPER FUNCTIONS
============================================================ */

function getInitials(name) {
    if (!name) {
        return "U";
    }

    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("");
}

function formatDateTime(value) {
    if (!value) {
        return "Unknown";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString();
}

function getStatusClass(status) {
    switch (status) {
        case MEMBER_STATUS.AVAILABLE:
            return "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400";

        case MEMBER_STATUS.BUSY:
            return "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400";

        case MEMBER_STATUS.AWAY:
            return "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400";

        default:
            return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
    }
}

function getStatusIcon(status) {
    switch (status) {
        case MEMBER_STATUS.AVAILABLE:
            return (
                <UserCheck className="h-4 w-4 text-green-500" />
            );

        case MEMBER_STATUS.BUSY:
            return (
                <Clock3 className="h-4 w-4 text-orange-500" />
            );

        case MEMBER_STATUS.AWAY:
            return (
                <UserRound className="h-4 w-4 text-yellow-500" />
            );

        default:
            return (
                <UserX className="h-4 w-4 text-slate-400" />
            );
    }
}

function getPriorityClass(priority) {
    switch (priority) {
        case PRIORITIES.URGENT:
            return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400";

        case PRIORITIES.HIGH:
            return "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400";

        case PRIORITIES.MEDIUM:
            return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400";

        default:
            return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
    }
}

function getActivityIcon(type) {
    switch (type) {
        case COORDINATION_TYPES.BLOCKER:
            return (
                <AlertCircle className="h-4 w-4 text-red-500" />
            );

        case COORDINATION_TYPES.PROGRESS_REQUEST:
            return (
                <RefreshCw className="h-4 w-4 text-blue-500" />
            );

        case COORDINATION_TYPES.INSTRUCTION:
            return (
                <Zap className="h-4 w-4 text-purple-500" />
            );

        case COORDINATION_TYPES.INFORMATION:
            return (
                <Info className="h-4 w-4 text-cyan-500" />
            );

        case COORDINATION_TYPES.DEPENDENCY:
            return (
                <Flag className="h-4 w-4 text-orange-500" />
            );

        case COORDINATION_TYPES.ESCALATION:
            return (
                <ArrowUpRight className="h-4 w-4 text-red-600" />
            );

        default:
            return (
                <MessageSquare className="h-4 w-4 text-blue-500" />
            );
    }
}

/* ============================================================
   MAIN COMPONENT
============================================================ */

function CoordinateTeamWork({
    team: teamProp = null,
    loading: externalLoading = false,
    error: externalError = null,
    onRetry,
    onCoordinate,
}) {
    const team = teamProp || DEMO_TEAM;

    const [isLoading, setIsLoading] =
        useState(externalLoading);

    const [error, setError] =
        useState(externalError);

    const [selectedMemberId, setSelectedMemberId] =
        useState("");

    const [coordinationType, setCoordinationType] =
        useState(COORDINATION_TYPES.INSTRUCTION);

    const [priority, setPriority] =
        useState(PRIORITIES.MEDIUM);

    const [message, setMessage] =
        useState("");

    const [activities, setActivities] =
        useState(INITIAL_ACTIVITIES);

    const [showEscalation, setShowEscalation] =
        useState(false);

    const [showHistory, setShowHistory] =
        useState(false);

    const [successMessage, setSuccessMessage] =
        useState("");

    const [actionError, setActionError] =
        useState("");

    /* ========================================================
       MEMBERS
    ======================================================== */

    const members = useMemo(
        () => team?.members || [],
        [team]
    );

    /* ========================================================
       SELECTED MEMBER
    ======================================================== */

    const selectedMember = useMemo(() => {
        return (
            members.find(
                (member) =>
                    String(member.id) ===
                    String(selectedMemberId)
            ) || null
        );
    }, [members, selectedMemberId]);

    /* ========================================================
       TEAM STATISTICS
    ======================================================== */

    const statistics = useMemo(() => {
        return {
            members: members.length,

            available: members.filter(
                (member) =>
                    member.status ===
                    MEMBER_STATUS.AVAILABLE
            ).length,

            busy: members.filter(
                (member) =>
                    member.status ===
                    MEMBER_STATUS.BUSY
            ).length,

            blocked: activities.filter(
                (activity) =>
                    activity.type ===
                    COORDINATION_TYPES.BLOCKER
            ).length,
        };
    }, [members, activities]);

    /* ========================================================
       VALIDATION
    ======================================================== */

    const validateMessage = () => {
        if (!selectedMemberId) {
            return "Please select a team member.";
        }

        if (!coordinationType) {
            return "Please select a coordination type.";
        }

        if (!priority) {
            return "Please select a priority.";
        }

        if (!message.trim()) {
            return "Coordination message cannot be empty.";
        }

        if (message.trim().length < 5) {
            return "Coordination message must contain at least 5 characters.";
        }

        return "";
    };

    /* ========================================================
       SEND COORDINATION
    ======================================================== */

    const handleSendCoordination = async () => {
        setActionError("");
        setSuccessMessage("");

        const validationError = validateMessage();

        if (validationError) {
            setActionError(validationError);
            return;
        }

        if (!selectedMember) {
            setActionError(
                "The selected team member could not be found."
            );
            return;
        }

        try {
            setIsLoading(true);

            const newActivity = {
                id: Date.now(),
                type: coordinationType,
                recipientId: selectedMember.id,
                recipientName: selectedMember.fullName,
                message: message.trim(),
                priority,
                status: ACTIVITY_STATUS.SENT,
                createdAt: new Date().toISOString(),
            };

            /*
             * Backend integration point.

             * Later:
             *
             * await teamService.createCoordination({
             *     teamId: team.id,
             *     recipientId: selectedMember.id,
             *     type: coordinationType,
             *     priority,
             *     message: message.trim()
             * });
             */

            if (onCoordinate) {
                await onCoordinate(newActivity);
            }

            setActivities((current) => [
                newActivity,
                ...current,
            ]);

            setMessage("");

            setSuccessMessage(
                "Coordination activity recorded successfully."
            );
        } catch (coordinateError) {
            console.error(
                "Coordination failed:",
                coordinateError
            );

            setActionError(
                "Unable to send coordination message. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    /* ========================================================
       ESCALATE TO MANAGER
    ======================================================== */

    const handleEscalateToManager = async () => {
        setActionError("");
        setSuccessMessage("");

        if (!message.trim()) {
            setActionError(
                "Please enter the issue before escalating it to the Manager."
            );
            return;
        }

        if (!team?.manager) {
            setActionError(
                "No Manager is currently available for escalation."
            );
            return;
        }

        try {
            setIsLoading(true);

            const escalation = {
                id: Date.now(),
                type: COORDINATION_TYPES.ESCALATION,
                recipientId: team.manager.id,
                recipientName: team.manager.fullName,
                message: message.trim(),
                priority,
                status: ACTIVITY_STATUS.ESCALATED,
                createdAt: new Date().toISOString(),
            };

            /*
             * Backend integration point:

             * await teamService.escalateToManager({
             *     teamId: team.id,
             *     managerId: team.manager.id,
             *     message: message.trim(),
             *     priority
             * });
             */

            setActivities((current) => [
                escalation,
                ...current,
            ]);

            setMessage("");
            setShowEscalation(false);

            setSuccessMessage(
                "The issue has been escalated to the Manager."
            );
        } catch (escalationError) {
            console.error(
                "Manager escalation failed:",
                escalationError
            );

            setActionError(
                "Unable to escalate the issue. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    /* ========================================================
       RETRY
    ======================================================== */

    const handleRetry = async () => {
        setError(null);
        setActionError("");
        setSuccessMessage("");

        if (onRetry) {
            try {
                setIsLoading(true);
                await onRetry();
            } catch (retryError) {
                console.error(
                    "Unable to reload team:",
                    retryError
                );

                setError(
                    "Unable to load team information. Please try again."
                );
            } finally {
                setIsLoading(false);
            }

            return;
        }

        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
        }, 500);
    };

    /* ========================================================
       LOADING
    ======================================================== */

    if (isLoading && !team) {
        return (
            <LoadingState />
        );
    }

    /* ========================================================
       ERROR
    ======================================================== */

    if (error) {
        return (
            <ErrorState
                message={error}
                onRetry={handleRetry}
            />
        );
    }

    /* ========================================================
       NO TEAM
    ======================================================== */

    if (!team) {
        return (
            <EmptyTeamState />
        );
    }

    return (
        <div className="space-y-5">
            {/* ==================================================
                HEADER
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
                        lg:flex-row
                        lg:items-center
                        lg:justify-between
                    "
                >
                    <div className="flex items-start gap-3">
                        <div
                            className="
                                flex
                                h-11
                                w-11
                                shrink-0
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
                            <h2
                                className="
                                    text-lg
                                    font-semibold
                                    text-slate-900
                                    dark:text-white
                                "
                            >
                                Coordinate Team Work
                            </h2>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                {team.name}
                            </p>
                        </div>
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
                            Team Leader Workspace
                        </p>

                        <p
                            className="
                                mt-1
                                text-xs
                                text-blue-700
                                dark:text-blue-300
                            "
                        >
                            Coordination only — Manager
                            authority remains protected.
                        </p>
                    </div>
                </div>

                {/* ==================================================
                    STATISTICS
                ================================================== */}

                <div
                    className="
                        mt-5
                        grid
                        grid-cols-2
                        gap-3
                        md:grid-cols-4
                    "
                >
                    <StatisticCard
                        icon={
                            <Users className="h-4 w-4" />
                        }
                        label="Team Members"
                        value={statistics.members}
                    />

                    <StatisticCard
                        icon={
                            <UserCheck className="h-4 w-4" />
                        }
                        label="Available"
                        value={statistics.available}
                    />

                    <StatisticCard
                        icon={
                            <Clock3 className="h-4 w-4" />
                        }
                        label="Busy"
                        value={statistics.busy}
                    />

                    <StatisticCard
                        icon={
                            <AlertCircle className="h-4 w-4" />
                        }
                        label="Blockers"
                        value={statistics.blocked}
                    />
                </div>
            </div>

            {/* ==================================================
                SUCCESS MESSAGE
            ================================================== */}

            {successMessage && (
                <div
                    className="
                        flex
                        items-start
                        gap-3
                        rounded-xl
                        border
                        border-green-200
                        bg-green-50
                        p-4
                        dark:border-green-900/60
                        dark:bg-green-950/20
                    "
                >
                    <CheckCircle2
                        className="
                            mt-0.5
                            h-5
                            w-5
                            shrink-0
                            text-green-600
                        "
                    />

                    <div className="flex-1">
                        <p
                            className="
                                text-sm
                                font-medium
                                text-green-700
                                dark:text-green-400
                            "
                        >
                            {successMessage}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            setSuccessMessage("")
                        }
                        className="text-green-500"
                        aria-label="Close success message"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {/* ==================================================
                ACTION ERROR
            ================================================== */}

            {actionError && (
                <div
                    className="
                        flex
                        items-start
                        gap-3
                        rounded-xl
                        border
                        border-red-200
                        bg-red-50
                        p-4
                        dark:border-red-900/60
                        dark:bg-red-950/20
                    "
                >
                    <AlertCircle
                        className="
                            mt-0.5
                            h-5
                            w-5
                            shrink-0
                            text-red-600
                        "
                    />

                    <p
                        className="
                            flex-1
                            text-sm
                            text-red-700
                            dark:text-red-400
                        "
                    >
                        {actionError}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            setActionError("")
                        }
                        className="text-red-500"
                        aria-label="Close error message"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {/* ==================================================
                MAIN COORDINATION WORKSPACE
            ================================================== */}

            <div
                className="
                    grid
                    grid-cols-1
                    gap-5
                    xl:grid-cols-[1fr_380px]
                "
            >
                {/* ==================================================
                    LEFT — TEAM MEMBERS
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
                    <div className="mb-4">
                        <h3
                            className="
                                text-base
                                font-semibold
                                text-slate-900
                                dark:text-white
                            "
                        >
                            Team Workspace
                        </h3>

                        <p
                            className="
                                mt-1
                                text-xs
                                text-slate-500
                                dark:text-slate-400
                            "
                        >
                            Review current team activities
                            and select a member to coordinate
                            with.
                        </p>
                    </div>

                    {members.length === 0 ? (
                        <div
                            className="
                                rounded-lg
                                border
                                border-dashed
                                border-slate-300
                                px-5
                                py-10
                                text-center
                                dark:border-blue-900/70
                            "
                        >
                            <Users
                                className="
                                    mx-auto
                                    h-9
                                    w-9
                                    text-slate-400
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
                                No team members are
                                available.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {members.map((member) => {
                                const selected =
                                    String(
                                        selectedMemberId
                                    ) ===
                                    String(member.id);

                                return (
                                    <button
                                        key={member.id}
                                        type="button"
                                        onClick={() =>
                                            setSelectedMemberId(
                                                member.id
                                            )
                                        }
                                        className={`
                                            w-full
                                            rounded-xl
                                            border
                                            p-4
                                            text-left
                                            transition
                                            ${
                                                selected
                                                    ? "border-blue-400 bg-blue-50 dark:border-blue-700 dark:bg-blue-950/30"
                                                    : "border-slate-200 bg-slate-50 hover:border-blue-200 dark:border-blue-900/70 dark:bg-[#132f52]"
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
                                                    text-sm
                                                    font-semibold
                                                    text-blue-600
                                                    dark:bg-blue-950/70
                                                    dark:text-blue-400
                                                "
                                            >
                                                {getInitials(
                                                    member.fullName
                                                )}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div
                                                    className="
                                                        flex
                                                        flex-col
                                                        gap-2
                                                        sm:flex-row
                                                        sm:items-center
                                                        sm:justify-between
                                                    "
                                                >
                                                    <div>
                                                        <p
                                                            className="
                                                                text-sm
                                                                font-semibold
                                                                text-slate-900
                                                                dark:text-white
                                                            "
                                                        >
                                                            {
                                                                member.fullName
                                                            }
                                                        </p>

                                                        <p
                                                            className="
                                                                mt-0.5
                                                                text-xs
                                                                text-slate-500
                                                                dark:text-slate-400
                                                            "
                                                        >
                                                            {
                                                                member.specialization
                                                            }
                                                        </p>
                                                    </div>

                                                    <span
                                                        className={`
                                                            inline-flex
                                                            w-fit
                                                            items-center
                                                            gap-1.5
                                                            rounded-full
                                                            px-2.5
                                                            py-1
                                                            text-[11px]
                                                            font-medium
                                                            ${getStatusClass(
                                                                member.status
                                                            )}
                                                        `}
                                                    >
                                                        {getStatusIcon(
                                                            member.status
                                                        )}

                                                        {
                                                            member.status
                                                        }
                                                    </span>
                                                </div>

                                                <div
                                                    className="
                                                        mt-3
                                                        grid
                                                        grid-cols-1
                                                        gap-2
                                                        sm:grid-cols-2
                                                    "
                                                >
                                                    <div>
                                                        <p className="text-[10px] text-slate-400">
                                                            Current Task
                                                        </p>

                                                        <p
                                                            className="
                                                                mt-1
                                                                truncate
                                                                text-xs
                                                                font-medium
                                                                text-slate-700
                                                                dark:text-slate-200
                                                            "
                                                        >
                                                            {
                                                                member.currentTask
                                                            }
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="text-[10px] text-slate-400">
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
                                                            {
                                                                member.progress
                                                            }
                                                            %
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* ==================================================
                    RIGHT — COORDINATION FORM
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
                    <div className="mb-5">
                        <div className="flex items-center gap-2">
                            <MessageSquare className="h-5 w-5 text-blue-500" />

                            <h3
                                className="
                                    text-base
                                    font-semibold
                                    text-slate-900
                                    dark:text-white
                                "
                            >
                                Coordinate Work
                            </h3>
                        </div>

                        <p
                            className="
                                mt-1
                                text-xs
                                text-slate-500
                                dark:text-slate-400
                            "
                        >
                            Send coordination instructions,
                            updates, requests, or blocker
                            information.
                        </p>
                    </div>

                    {/* SELECT MEMBER */}

                    <div className="space-y-2">
                        <label
                            htmlFor="coordination-member"
                            className="
                                text-xs
                                font-medium
                                text-slate-700
                                dark:text-slate-300
                            "
                        >
                            Team Member
                        </label>

                        <div className="relative">
                            <select
                                id="coordination-member"
                                value={selectedMemberId}
                                onChange={(event) =>
                                    setSelectedMemberId(
                                        event.target.value
                                    )
                                }
                                className="
                                    w-full
                                    appearance-none
                                    rounded-lg
                                    border
                                    border-slate-200
                                    bg-white
                                    px-3
                                    py-2.5
                                    pr-9
                                    text-sm
                                    text-slate-800
                                    outline-none
                                    focus:border-blue-400
                                    dark:border-blue-900/70
                                    dark:bg-[#132f52]
                                    dark:text-white
                                "
                            >
                                <option value="">
                                    Select team member
                                </option>

                                {members.map((member) => (
                                    <option
                                        key={member.id}
                                        value={member.id}
                                    >
                                        {member.fullName} —{" "}
                                        {member.status}
                                    </option>
                                ))}
                            </select>

                            <ChevronDown
                                className="
                                    pointer-events-none
                                    absolute
                                    right-3
                                    top-1/2
                                    h-4
                                    w-4
                                    -translate-y-1/2
                                    text-slate-400
                                "
                            />
                        </div>
                    </div>

                    {/* SELECTED MEMBER INFO */}

                    {selectedMember && (
                        <div
                            className="
                                mt-4
                                rounded-lg
                                border
                                border-blue-100
                                bg-blue-50
                                p-3
                                dark:border-blue-900/60
                                dark:bg-blue-950/30
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
                                        rounded-full
                                        bg-blue-100
                                        text-xs
                                        font-bold
                                        text-blue-600
                                        dark:bg-blue-950/70
                                        dark:text-blue-400
                                    "
                                >
                                    {getInitials(
                                        selectedMember.fullName
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
                                        {
                                            selectedMember.fullName
                                        }
                                    </p>

                                    <p
                                        className="
                                            text-xs
                                            text-slate-500
                                            dark:text-slate-400
                                        "
                                    >
                                        {
                                            selectedMember.specialization
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* COORDINATION TYPE */}

                    <div className="mt-4 space-y-2">
                        <label
                            htmlFor="coordination-type"
                            className="
                                text-xs
                                font-medium
                                text-slate-700
                                dark:text-slate-300
                            "
                        >
                            Coordination Type
                        </label>

                        <select
                            id="coordination-type"
                            value={coordinationType}
                            onChange={(event) =>
                                setCoordinationType(
                                    event.target.value
                                )
                            }
                            className="
                                w-full
                                rounded-lg
                                border
                                border-slate-200
                                bg-white
                                px-3
                                py-2.5
                                text-sm
                                text-slate-800
                                outline-none
                                focus:border-blue-400
                                dark:border-blue-900/70
                                dark:bg-[#132f52]
                                dark:text-white
                            "
                        >
                            {Object.values(
                                COORDINATION_TYPES
                            )
                                .filter(
                                    (type) =>
                                        type !==
                                        COORDINATION_TYPES.ESCALATION
                                )
                                .map((type) => (
                                    <option
                                        key={type}
                                        value={type}
                                    >
                                        {type}
                                    </option>
                                ))}
                        </select>
                    </div>

                    {/* PRIORITY */}

                    <div className="mt-4 space-y-2">
                        <label
                            htmlFor="coordination-priority"
                            className="
                                text-xs
                                font-medium
                                text-slate-700
                                dark:text-slate-300
                            "
                        >
                            Priority
                        </label>

                        <select
                            id="coordination-priority"
                            value={priority}
                            onChange={(event) =>
                                setPriority(
                                    event.target.value
                                )
                            }
                            className="
                                w-full
                                rounded-lg
                                border
                                border-slate-200
                                bg-white
                                px-3
                                py-2.5
                                text-sm
                                text-slate-800
                                outline-none
                                focus:border-blue-400
                                dark:border-blue-900/70
                                dark:bg-[#132f52]
                                dark:text-white
                            "
                        >
                            {Object.values(PRIORITIES).map(
                                (item) => (
                                    <option
                                        key={item}
                                        value={item}
                                    >
                                        {item}
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    {/* MESSAGE */}

                    <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between">
                            <label
                                htmlFor="coordination-message"
                                className="
                                    text-xs
                                    font-medium
                                    text-slate-700
                                    dark:text-slate-300
                                "
                            >
                                Coordination Message
                            </label>

                            <span
                                className="
                                    text-[10px]
                                    text-slate-400
                                "
                            >
                                {message.length}/1000
                            </span>
                        </div>

                        <textarea
                            id="coordination-message"
                            value={message}
                            onChange={(event) => {
                                if (
                                    event.target.value
                                        .length <= 1000
                                ) {
                                    setMessage(
                                        event.target.value
                                    );
                                }
                            }}
                            rows={6}
                            placeholder="Write coordination instructions, share information, report a blocker, request a progress update, or coordinate task-related communication..."
                            className="
                                w-full
                                resize-none
                                rounded-lg
                                border
                                border-slate-200
                                bg-white
                                px-3
                                py-3
                                text-sm
                                text-slate-800
                                outline-none
                                placeholder:text-slate-400
                                focus:border-blue-400
                                dark:border-blue-900/70
                                dark:bg-[#132f52]
                                dark:text-white
                            "
                        />
                    </div>

                    {/* SEND */}

                    <Button
                        type="button"
                        disabled={
                            isLoading ||
                            !selectedMemberId ||
                            !message.trim()
                        }
                        onClick={handleSendCoordination}
                        className="
                            mt-4
                            w-full
                            bg-blue-600
                            hover:bg-blue-700
                        "
                    >
                        {isLoading ? (
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Send className="mr-2 h-4 w-4" />
                        )}

                        Send Coordination
                    </Button>

                    {/* ESCALATE */}

                    <Button
                        type="button"
                        variant="outline"
                        disabled={
                            isLoading ||
                            !message.trim()
                        }
                        onClick={() =>
                            setShowEscalation(
                                (current) => !current
                            )
                        }
                        className="
                            mt-2
                            w-full
                            border-orange-200
                            text-orange-600
                            hover:bg-orange-50
                            dark:border-orange-900/60
                            dark:text-orange-400
                            dark:hover:bg-orange-950/20
                        "
                    >
                        <ArrowUpRight className="mr-2 h-4 w-4" />

                        Escalate to Manager
                    </Button>
                </div>
            </div>

            {/* ==================================================
                ESCALATION PANEL
            ================================================== */}

            {showEscalation && (
                <div
                    className="
                        rounded-xl
                        border
                        border-orange-200
                        bg-orange-50
                        p-5
                        dark:border-orange-900/60
                        dark:bg-orange-950/20
                    "
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
                                bg-orange-100
                                text-orange-600
                                dark:bg-orange-950/50
                                dark:text-orange-400
                            "
                        >
                            <ShieldAlert className="h-5 w-5" />
                        </div>

                        <div className="flex-1">
                            <h3
                                className="
                                    text-sm
                                    font-semibold
                                    text-orange-800
                                    dark:text-orange-300
                                "
                            >
                                Escalate Issue to Manager
                            </h3>

                            <p
                                className="
                                    mt-1
                                    text-xs
                                    leading-5
                                    text-orange-700
                                    dark:text-orange-400
                                "
                            >
                                This sends the coordination
                                issue to the assigned Manager.
                                The Team Leader cannot make
                                Manager-level decisions or
                                override Manager authority.
                            </p>

                            {team.manager && (
                                <div
                                    className="
                                        mt-3
                                        rounded-lg
                                        border
                                        border-orange-200
                                        bg-white
                                        p-3
                                        dark:border-orange-900/60
                                        dark:bg-[#132f52]
                                    "
                                >
                                    <p className="text-[10px] text-slate-400">
                                        Manager
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-sm
                                            font-semibold
                                            text-slate-800
                                            dark:text-white
                                        "
                                    >
                                        {
                                            team.manager
                                                .fullName
                                        }
                                    </p>

                                    <p
                                        className="
                                            mt-0.5
                                            text-xs
                                            text-slate-500
                                            dark:text-slate-400
                                        "
                                    >
                                        {
                                            team.manager
                                                .email
                                        }
                                    </p>
                                </div>
                            )}

                            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                                <Button
                                    type="button"
                                    onClick={
                                        handleEscalateToManager
                                    }
                                    disabled={isLoading}
                                    className="
                                        bg-orange-600
                                        hover:bg-orange-700
                                    "
                                >
                                    <ArrowUpRight className="mr-2 h-4 w-4" />
                                    Confirm Escalation
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        setShowEscalation(
                                            false
                                        )
                                    }
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ==================================================
                CURRENT TEAM ACTIVITY
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
                        gap-3
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
                >
                    <div>
                        <h3
                            className="
                                text-base
                                font-semibold
                                text-slate-900
                                dark:text-white
                            "
                        >
                            Coordination Activity
                        </h3>

                        <p
                            className="
                                mt-1
                                text-xs
                                text-slate-500
                                dark:text-slate-400
                            "
                        >
                            Recent coordination and team
                            communication activity.
                        </p>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            setShowHistory(
                                (current) => !current
                            )
                        }
                    >
                        {showHistory
                            ? "Hide History"
                            : "View History"}
                    </Button>
                </div>

                {/* ACTIVITY PREVIEW */}

                <div className="mt-5 space-y-3">
                    {activities
                        .slice(
                            0,
                            showHistory
                                ? activities.length
                                : 3
                        )
                        .map((activity) => (
                            <ActivityItem
                                key={activity.id}
                                activity={activity}
                            />
                        ))}
                </div>

                {activities.length === 0 && (
                    <div
                        className="
                            mt-5
                            rounded-lg
                            border
                            border-dashed
                            border-slate-300
                            px-5
                            py-8
                            text-center
                            dark:border-blue-900/70
                        "
                    >
                        <MessageSquare
                            className="
                                mx-auto
                                h-8
                                w-8
                                text-slate-400
                            "
                        />

                        <p
                            className="
                                mt-3
                                text-sm
                                text-slate-500
                                dark:text-slate-400
                            "
                        >
                            No coordination activity
                            recorded yet.
                        </p>
                    </div>
                )}
            </div>

            {/* ==================================================
                AUTHORITY BOUNDARY
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
                            text-blue-600
                            dark:bg-blue-950/60
                            dark:text-blue-400
                        "
                    >
                        <ShieldAlert className="h-5 w-5" />
                    </div>

                    <div>
                        <h3
                            className="
                                text-sm
                                font-semibold
                                text-slate-900
                                dark:text-white
                            "
                        >
                            Team Leader Authority Boundary
                        </h3>

                        <p
                            className="
                                mt-1
                                text-xs
                                leading-5
                                text-slate-500
                                dark:text-slate-400
                            "
                        >
                            The Team Leader can coordinate
                            communication, identify blockers,
                            request updates, and escalate
                            issues. The Team Leader cannot
                            create projects, change project
                            ownership, assign people to teams,
                            change contributor types,
                            change specializations, approve
                            final work, or override Manager
                            decisions.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ============================================================
   ACTIVITY ITEM
============================================================ */

function ActivityItem({ activity }) {
    return (
        <div
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
            <div className="flex items-start gap-3">
                <div
                    className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-white
                        dark:bg-[#0f2747]
                    "
                >
                    {getActivityIcon(activity.type)}
                </div>

                <div className="min-w-0 flex-1">
                    <div
                        className="
                            flex
                            flex-col
                            gap-2
                            sm:flex-row
                            sm:items-start
                            sm:justify-between
                        "
                    >
                        <div>
                            <p
                                className="
                                    text-sm
                                    font-semibold
                                    text-slate-800
                                    dark:text-white
                                "
                            >
                                {activity.type}
                            </p>

                            <p
                                className="
                                    mt-0.5
                                    text-xs
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                To:{" "}
                                {activity.recipientName}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <span
                                className={`
                                    rounded-full
                                    px-2.5
                                    py-1
                                    text-[10px]
                                    font-medium
                                    ${getPriorityClass(
                                        activity.priority
                                    )}
                                `}
                            >
                                {activity.priority}
                            </span>

                            <span
                                className="
                                    rounded-full
                                    bg-green-100
                                    px-2.5
                                    py-1
                                    text-[10px]
                                    font-medium
                                    text-green-700
                                    dark:bg-green-950/40
                                    dark:text-green-400
                                "
                            >
                                {activity.status}
                            </span>
                        </div>
                    </div>

                    <p
                        className="
                            mt-3
                            text-sm
                            leading-6
                            text-slate-600
                            dark:text-slate-300
                        "
                    >
                        {activity.message}
                    </p>

                    <p
                        className="
                            mt-3
                            text-[10px]
                            text-slate-400
                        "
                    >
                        {formatDateTime(
                            activity.createdAt
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}

/* ============================================================
   STATISTIC CARD
============================================================ */

function StatisticCard({
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
                <span className="text-blue-500">
                    {icon}
                </span>

                <span
                    className="
                        text-xs
                        text-slate-500
                        dark:text-slate-400
                    "
                >
                    {label}
                </span>
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
   LOADING STATE
============================================================ */

function LoadingState() {
    return (
        <div
            className="
                flex
                min-h-[250px]
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
                <RefreshCw
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
                    Loading team workspace...
                </p>
            </div>
        </div>
    );
}

/* ============================================================
   ERROR STATE
============================================================ */

function ErrorState({
    message,
    onRetry,
}) {
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
            <AlertCircle
                className="
                    mx-auto
                    h-9
                    w-9
                    text-red-500
                "
            />

            <h3
                className="
                    mt-3
                    text-base
                    font-semibold
                    text-red-700
                    dark:text-red-400
                "
            >
                Unable to Load Team Workspace
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
                {message ||
                    "Unable to load team information. Please try again."}
            </p>

            <Button
                type="button"
                variant="outline"
                onClick={onRetry}
                className="
                    mt-4
                    border-red-200
                    text-red-600
                    dark:border-red-900/60
                    dark:text-red-400
                "
            >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
            </Button>
        </div>
    );
}

/* ============================================================
   EMPTY TEAM STATE
============================================================ */

function EmptyTeamState() {
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
                No Team Assigned
            </h3>

            <p
                className="
                    mt-1
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

export default CoordinateTeamWork;