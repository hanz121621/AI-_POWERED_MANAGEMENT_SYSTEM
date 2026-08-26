import { useMemo, useState } from "react";

import {
    AlertCircle,
    ArrowDown,
    ArrowUp,
    BarChart3,
    CheckCircle2,
    ChevronDown,
    Clock3,
    Filter,

    ListChecks,
    MessageSquare,
    RefreshCw,
    Search,
    ShieldCheck,
    Target,
    TrendingUp,
  
    Users,
    XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";



const TASK_STATUS = {
    COMPLETED: "Completed",
    IN_PROGRESS: "In Progress",
    BLOCKED: "Blocked",
    TODO: "To Do",
    REVIEW: "Awaiting Review",
};

const SORT_DIRECTION = {
    ASC: "asc",
    DESC: "desc",
};

const SORT_FIELD = {
    NAME: "name",
    TASKS: "tasks",
    COMPLETED: "completed",
    PROGRESS: "progress",
    OVERDUE: "overdue",
};

const ATTENTION_LEVEL = {
    HIGH: "High",
    MEDIUM: "Medium",
    LOW: "Low",
    NONE: "None",
};

/* ============================================================
   DEMO PERFORMANCE DATA
   ------------------------------------------------------------
   Temporary frontend data.

   Later replace this with:

   teamLeaderService.getTeamPerformance()

   or:

   GET /api/teams/my-team/performance
============================================================ */

const DEMO_TEAM_PERFORMANCE = {
    teamId: 1,

    teamName: "AI Development Team",

    generatedAt: "2026-08-25T10:30:00",

    members: [
        {
            id: 201,
            fullName: "Abebe Kebede",
            email: "abebe@example.com",
            contributorType: "Developer",
            specialization: "Frontend Developer",

            assignedTasks: 8,
            completedTasks: 5,
            inProgressTasks: 2,
            blockedTasks: 0,
            awaitingReviewTasks: 1,
            overdueTasks: 1,

            progress: 78,

            workload: "High",

            tasks: [
                {
                    id: 1001,
                    title: "Develop Project Dashboard",
                    status: TASK_STATUS.IN_PROGRESS,
                    progress: 70,
                    dueDate: "2026-09-01",
                },
                {
                    id: 1002,
                    title: "Implement Project Filters",
                    status: TASK_STATUS.COMPLETED,
                    progress: 100,
                    dueDate: "2026-08-20",
                },
            ],
        },

        {
            id: 202,
            fullName: "Sara Mohammed",
            email: "sara@example.com",
            contributorType: "Developer",
            specialization: "Backend Developer",

            assignedTasks: 6,
            completedTasks: 3,
            inProgressTasks: 2,
            blockedTasks: 1,
            awaitingReviewTasks: 0,
            overdueTasks: 2,

            progress: 61,

            workload: "High",

            tasks: [
                {
                    id: 1003,
                    title: "Implement Team API",
                    status: TASK_STATUS.IN_PROGRESS,
                    progress: 55,
                    dueDate: "2026-08-24",
                },
                {
                    id: 1004,
                    title: "Fix Authentication Endpoint",
                    status: TASK_STATUS.BLOCKED,
                    progress: 30,
                    dueDate: "2026-08-23",
                },
            ],
        },

        {
            id: 203,
            fullName: "Dawit Tesfaye",
            email: "dawit@example.com",
            contributorType: "Developer",
            specialization: "QA / Tester",

            assignedTasks: 7,
            completedTasks: 6,
            inProgressTasks: 1,
            blockedTasks: 0,
            awaitingReviewTasks: 1,
            overdueTasks: 0,

            progress: 91,

            workload: "Medium",

            tasks: [
                {
                    id: 1005,
                    title: "Test Team Management",
                    status: TASK_STATUS.REVIEW,
                    progress: 90,
                    dueDate: "2026-09-05",
                },
            ],
        },

        {
            id: 204,
            fullName: "Mekdes Alemu",
            email: "mekdes@example.com",
            contributorType: "Staff",
            specialization: "Project Assistant",

            assignedTasks: 5,
            completedTasks: 2,
            inProgressTasks: 2,
            blockedTasks: 0,
            awaitingReviewTasks: 1,
            overdueTasks: 1,

            progress: 48,

            workload: "Medium",

            tasks: [
                {
                    id: 1006,
                    title: "Update Project Documentation",
                    status: TASK_STATUS.IN_PROGRESS,
                    progress: 45,
                    dueDate: "2026-08-27",
                },
            ],
        },
    ],
};

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

function getCompletionRate(completed, assigned) {
    if (!assigned) {
        return 0;
    }

    return Math.round((completed / assigned) * 100);
}

function getWorkloadClass(workload) {
    switch (workload) {
        case "High":
            return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400";

        case "Medium":
            return "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400";

        case "Low":
            return "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400";

        default:
            return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
    }
}

function getStatusClass(status) {
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

function getStatusIcon(status) {
    switch (status) {
        case TASK_STATUS.COMPLETED:
            return (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
            );

        case TASK_STATUS.IN_PROGRESS:
            return (
                <TrendingUp className="h-4 w-4 text-blue-500" />
            );

        case TASK_STATUS.BLOCKED:
            return (
                <XCircle className="h-4 w-4 text-red-500" />
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

function getAttentionLevel(member) {
    if (
        member.blockedTasks > 0 ||
        member.overdueTasks >= 2 ||
        member.progress < 50
    ) {
        return ATTENTION_LEVEL.HIGH;
    }

    if (
        member.overdueTasks > 0 ||
        member.progress < 70 ||
        member.awaitingReviewTasks > 0
    ) {
        return ATTENTION_LEVEL.MEDIUM;
    }

    if (member.progress < 85) {
        return ATTENTION_LEVEL.LOW;
    }

    return ATTENTION_LEVEL.NONE;
}

function getAttentionClass(level) {
    switch (level) {
        case ATTENTION_LEVEL.HIGH:
            return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400";

        case ATTENTION_LEVEL.MEDIUM:
            return "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400";

        case ATTENTION_LEVEL.LOW:
            return "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400";

        default:
            return "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400";
    }
}

function formatDate(dateValue) {
    if (!dateValue) {
        return "Not available";
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

function ViewTeamPerformance({
    performance: performanceProp = null,
    loading: externalLoading = false,
    error: externalError = null,
    unauthorized = false,
    onRetry,
    onCommunicateManager,
}) {
    const [performance, setPerformance] = useStateSafe(
        performanceProp
    );

    const [isLoading, setIsLoading] =
        useStateSafe(externalLoading);

    const [error, setError] =
        useStateSafe(externalError);

    const [isUnauthorized, setIsUnauthorized] =
        useStateSafe(unauthorized);

    const [searchTerm, setSearchTerm] =
        useStateSafe("");

    const [workloadFilter, setWorkloadFilter] =
        useStateSafe("All");

    const [attentionFilter, setAttentionFilter] =
        useStateSafe("All");

    const [sortField, setSortField] =
        useStateSafe(SORT_FIELD.PROGRESS);

    const [sortDirection, setSortDirection] =
        useStateSafe(SORT_DIRECTION.DESC);

    const [selectedMemberId, setSelectedMemberId] =
        useStateSafe(null);

    const [showFilters, setShowFilters] =
        useStateSafe(false);

    const [communicationMember, setCommunicationMember] =
        useStateSafe(null);

    /*
     * ========================================================
     * DEVELOPMENT MODE
     * ========================================================
     *
     * This initializes demo data without useEffect.
     *
     * When connecting the .NET API, pass performance data
     * through the `performance` prop or replace this logic
     * with your service call.
     */

    const activePerformance =
        performance || DEMO_TEAM_PERFORMANCE;

    /*
     * ========================================================
     * DERIVED TEAM METRICS
     * ========================================================
     */

    const teamMetrics = useMemo(() => {
        const members =
            activePerformance?.members || [];

        const assignedTasks = members.reduce(
            (total, member) =>
                total +
                Number(member.assignedTasks || 0),
            0
        );

        const completedTasks = members.reduce(
            (total, member) =>
                total +
                Number(member.completedTasks || 0),
            0
        );

        const inProgressTasks = members.reduce(
            (total, member) =>
                total +
                Number(member.inProgressTasks || 0),
            0
        );

        const blockedTasks = members.reduce(
            (total, member) =>
                total +
                Number(member.blockedTasks || 0),
            0
        );

        const overdueTasks = members.reduce(
            (total, member) =>
                total +
                Number(member.overdueTasks || 0),
            0
        );

        const awaitingReviewTasks = members.reduce(
            (total, member) =>
                total +
                Number(member.awaitingReviewTasks || 0),
            0
        );

        const overallProgress =
            members.length > 0
                ? Math.round(
                      members.reduce(
                          (total, member) =>
                              total +
                              Number(
                                  member.progress || 0
                              ),
                          0
                      ) / members.length
                  )
                : 0;

        const completionRate =
            getCompletionRate(
                completedTasks,
                assignedTasks
            );

        return {
            members: members.length,
            assignedTasks,
            completedTasks,
            inProgressTasks,
            blockedTasks,
            overdueTasks,
            awaitingReviewTasks,
            overallProgress,
            completionRate,
        };
    }, [activePerformance]);

    /*
     * ========================================================
     * FILTER + SORT MEMBERS
     * ========================================================
     */

    const filteredMembers = useMemo(() => {
        const members =
            activePerformance?.members || [];

        const filtered = members.filter((member) => {
            const search =
                searchTerm.trim().toLowerCase();

            const matchesSearch =
                !search ||
                member.fullName
                    ?.toLowerCase()
                    .includes(search) ||
                member.email
                    ?.toLowerCase()
                    .includes(search) ||
                member.specialization
                    ?.toLowerCase()
                    .includes(search);

            const matchesWorkload =
                workloadFilter === "All" ||
                member.workload === workloadFilter;

            const attention =
                getAttentionLevel(member);

            const matchesAttention =
                attentionFilter === "All" ||
                attention === attentionFilter;

            return (
                matchesSearch &&
                matchesWorkload &&
                matchesAttention
            );
        });

        return [...filtered].sort((a, b) => {
            let valueA;
            let valueB;

            switch (sortField) {
                case SORT_FIELD.NAME:
                    valueA =
                        a.fullName?.toLowerCase() || "";
                    valueB =
                        b.fullName?.toLowerCase() || "";

                    break;

                case SORT_FIELD.TASKS:
                    valueA =
                        Number(a.assignedTasks) || 0;
                    valueB =
                        Number(b.assignedTasks) || 0;

                    break;

                case SORT_FIELD.COMPLETED:
                    valueA =
                        Number(a.completedTasks) || 0;
                    valueB =
                        Number(b.completedTasks) || 0;

                    break;

                case SORT_FIELD.OVERDUE:
                    valueA =
                        Number(a.overdueTasks) || 0;
                    valueB =
                        Number(b.overdueTasks) || 0;

                    break;

                case SORT_FIELD.PROGRESS:
                default:
                    valueA =
                        Number(a.progress) || 0;
                    valueB =
                        Number(b.progress) || 0;
                    break;
            }

            if (valueA < valueB) {
                return sortDirection ===
                    SORT_DIRECTION.ASC
                    ? -1
                    : 1;
            }

            if (valueA > valueB) {
                return sortDirection ===
                    SORT_DIRECTION.ASC
                    ? 1
                    : -1;
            }

            return 0;
        });
    }, [
        activePerformance,
        searchTerm,
        workloadFilter,
        attentionFilter,
        sortField,
        sortDirection,
    ]);

    /*
     * ========================================================
     * ATTENTION MEMBERS
     * ========================================================
     */

    const attentionMembers = useMemo(() => {
        return (
            activePerformance?.members || []
        ).filter(
            (member) =>
                getAttentionLevel(member) ===
                    ATTENTION_LEVEL.HIGH ||
                getAttentionLevel(member) ===
                    ATTENTION_LEVEL.MEDIUM
        );
    }, [activePerformance]);

    /*
     * ========================================================
     * HANDLE RETRY
     * ========================================================
     */

    const handleRetry = async () => {
        if (!onRetry) {
            setIsLoading(true);
            setError(null);
            setIsUnauthorized(false);

            setTimeout(() => {
                setPerformance(
                    DEMO_TEAM_PERFORMANCE
                );
                setIsLoading(false);
            }, 500);

            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            setIsUnauthorized(false);

            const result = await onRetry();

            if (result?.data) {
                setPerformance(result.data);
            }
        } catch (retryError) {
            console.error(
                "Unable to load team performance:",
                retryError
            );

            setError(
                "Unable to generate team performance information."
            );
        } finally {
            setIsLoading(false);
        }
    };

    /*
     * ========================================================
     * SORT HANDLER
     * ========================================================
     */

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection((current) =>
                current === SORT_DIRECTION.ASC
                    ? SORT_DIRECTION.DESC
                    : SORT_DIRECTION.ASC
            );

            return;
        }

        setSortField(field);
        setSortDirection(
            SORT_DIRECTION.DESC
        );
    };

    /*
     * ========================================================
     * CLEAR FILTERS
     * ========================================================
     */

    const clearFilters = () => {
        setSearchTerm("");
        setWorkloadFilter("All");
        setAttentionFilter("All");
        setSortField(SORT_FIELD.PROGRESS);
        setSortDirection(
            SORT_DIRECTION.DESC
        );
    };

    /*
     * ========================================================
     * LOADING STATE
     * ========================================================
     */

    if (isLoading) {
        return (
            <div
                className="
                    flex
                    min-h-[260px]
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
                        Loading team performance...
                    </p>

                    <p
                        className="
                            mt-1
                            text-xs
                            text-slate-500
                            dark:text-slate-400
                        "
                    >
                        Calculating team progress and
                        performance indicators.
                    </p>
                </div>
            </div>
        );
    }

    /*
     * ========================================================
     * UNAUTHORIZED
     * ========================================================
     */

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
                    team performance information.
                </p>
            </div>
        );
    }

    /*
     * ========================================================
     * ERROR STATE
     * ========================================================
     */

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
                <AlertCircle
                    className="
                        mx-auto
                        h-10
                        w-10
                        text-red-500
                    "
                />

                <h3
                    className="
                        mt-4
                        text-base
                        font-semibold
                        text-red-700
                        dark:text-red-400
                    "
                >
                    Unable to Generate Performance
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
                    {error}
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
                    "
                >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                </Button>
            </div>
        );
    }

    /*
     * ========================================================
     * NO PERFORMANCE DATA
     * A1
     * ========================================================
     */

    if (
        !activePerformance ||
        !activePerformance.members ||
        activePerformance.members.length === 0
    ) {
        return (
            <div
                className="
                    rounded-xl
                    border
                    border-dashed
                    border-slate-300
                    bg-white
                    px-6
                    py-12
                    text-center
                    dark:border-blue-900/70
                    dark:bg-[#0f2747]
                "
            >
                <BarChart3
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
                    No Team Performance Data
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
                    No team performance data is
                    available.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            {/* ==================================================
                PAGE HEADER
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
                    <div className="flex items-start gap-3">
                        <div
                            className="
                                flex
                                h-12
                                w-12
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
                            <BarChart3 className="h-6 w-6" />
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
                                Team Performance
                            </h2>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                {activePerformance.teamName ||
                                    "My Team"}
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-xs
                                    text-slate-400
                                "
                            >
                                Review team progress,
                                workload, completion,
                                blockers, and overdue work.
                            </p>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleRetry}
                        className="
                            w-full
                            md:w-auto
                        "
                    >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* ==================================================
                PERFORMANCE SUMMARY
            ================================================== */}

            <div
                className="
                    grid
                    grid-cols-1
                    gap-3
                    sm:grid-cols-2
                    lg:grid-cols-4
                "
            >
                <PerformanceCard
                    icon={
                        <ListChecks className="h-5 w-5" />
                    }
                    label="Assigned Tasks"
                    value={teamMetrics.assignedTasks}
                    description="Total team workload"
                />

                <PerformanceCard
                    icon={
                        <CheckCircle2 className="h-5 w-5" />
                    }
                    label="Completed Tasks"
                    value={teamMetrics.completedTasks}
                    description={`${teamMetrics.completionRate}% completion rate`}
                />

                <PerformanceCard
                    icon={
                        <TrendingUp className="h-5 w-5" />
                    }
                    label="In Progress"
                    value={teamMetrics.inProgressTasks}
                    description="Active team work"
                />

                <PerformanceCard
                    icon={
                        <XCircle className="h-5 w-5" />
                    }
                    label="Blocked Tasks"
                    value={teamMetrics.blockedTasks}
                    description="Requires attention"
                    danger={
                        teamMetrics.blockedTasks > 0
                    }
                />
            </div>

            {/* ==================================================
                SECONDARY METRICS
            ================================================== */}

            <div
                className="
                    grid
                    grid-cols-2
                    gap-3
                    lg:grid-cols-4
                "
            >
                <MetricBox
                    label="Overdue"
                    value={teamMetrics.overdueTasks}
                    icon={
                        <AlertCircle className="h-4 w-4" />
                    }
                    danger={
                        teamMetrics.overdueTasks > 0
                    }
                />

                <MetricBox
                    label="Awaiting Review"
                    value={
                        teamMetrics.awaitingReviewTasks
                    }
                    icon={
                        <Clock3 className="h-4 w-4" />
                    }
                />

                <MetricBox
                    label="Team Progress"
                    value={`${teamMetrics.overallProgress}%`}
                    icon={
                        <Target className="h-4 w-4" />
                    }
                />

                <MetricBox
                    label="Team Members"
                    value={teamMetrics.members}
                    icon={
                        <Users className="h-4 w-4" />
                    }
                />
            </div>

            {/* ==================================================
                OVERALL PROGRESS
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
                                text-sm
                                font-semibold
                                text-slate-900
                                dark:text-white
                            "
                        >
                            Overall Team Progress
                        </h3>

                        <p
                            className="
                                mt-1
                                text-xs
                                text-slate-500
                                dark:text-slate-400
                            "
                        >
                            Average progress across all
                            team members.
                        </p>
                    </div>

                    <span
                        className="
                            text-2xl
                            font-bold
                            text-blue-600
                            dark:text-blue-400
                        "
                    >
                        {teamMetrics.overallProgress}%
                    </span>
                </div>

                <div
                    className="
                        mt-4
                        h-3
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
                            width: `${teamMetrics.overallProgress}%`,
                        }}
                    />
                </div>
            </div>

            {/* ==================================================
                AREAS REQUIRING ATTENTION
            ================================================== */}

            {attentionMembers.length > 0 && (
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
                    <div
                        className="
                            flex
                            flex-col
                            gap-3
                            md:flex-row
                            md:items-start
                            md:justify-between
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
                                <AlertCircle className="h-5 w-5" />
                            </div>

                            <div>
                                <h3
                                    className="
                                        text-sm
                                        font-semibold
                                        text-orange-800
                                        dark:text-orange-300
                                    "
                                >
                                    Areas Requiring Attention
                                </h3>

                                <p
                                    className="
                                        mt-1
                                        text-xs
                                        text-orange-700
                                        dark:text-orange-400
                                    "
                                >
                                    Review delayed, blocked,
                                    overdue, or low-progress
                                    work.
                                </p>
                            </div>
                        </div>

                        <span
                            className="
                                w-fit
                                rounded-full
                                bg-orange-100
                                px-3
                                py-1
                                text-xs
                                font-semibold
                                text-orange-700
                                dark:bg-orange-950/50
                                dark:text-orange-300
                            "
                        >
                            {attentionMembers.length} member
                            {attentionMembers.length !== 1
                                ? "s"
                                : ""}
                        </span>
                    </div>

                    <div
                        className="
                            mt-4
                            grid
                            grid-cols-1
                            gap-3
                            md:grid-cols-2
                        "
                    >
                        {attentionMembers.map(
                            (member) => {
                                const attention =
                                    getAttentionLevel(
                                        member
                                    );

                                return (
                                    <div
                                        key={member.id}
                                        className="
                                            rounded-lg
                                            border
                                            border-orange-200
                                            bg-white
                                            p-3
                                            dark:border-orange-900/50
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
                                                    bg-blue-100
                                                    text-xs
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
                                                        items-start
                                                        justify-between
                                                        gap-2
                                                    "
                                                >
                                                    <p
                                                        className="
                                                            truncate
                                                            text-sm
                                                            font-semibold
                                                            text-slate-800
                                                            dark:text-white
                                                        "
                                                    >
                                                        {
                                                            member.fullName
                                                        }
                                                    </p>

                                                    <span
                                                        className={`
                                                            shrink-0
                                                            rounded-full
                                                            px-2
                                                            py-0.5
                                                            text-[10px]
                                                            font-semibold
                                                            ${getAttentionClass(
                                                                attention
                                                            )}
                                                        `}
                                                    >
                                                        {attention}
                                                    </span>
                                                </div>

                                                <p
                                                    className="
                                                        mt-1
                                                        text-xs
                                                        text-slate-500
                                                        dark:text-slate-400
                                                    "
                                                >
                                                    {
                                                        member.specialization
                                                    }
                                                </p>

                                                <div
                                                    className="
                                                        mt-3
                                                        grid
                                                        grid-cols-3
                                                        gap-2
                                                    "
                                                >
                                                    <SmallStat
                                                        label="Progress"
                                                        value={`${member.progress}%`}
                                                    />

                                                    <SmallStat
                                                        label="Overdue"
                                                        value={
                                                            member.overdueTasks
                                                        }
                                                    />

                                                    <SmallStat
                                                        label="Blocked"
                                                        value={
                                                            member.blockedTasks
                                                        }
                                                    />
                                                </div>

                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        setCommunicationMember(
                                                            member
                                                        )
                                                    }
                                                    className="
                                                        mt-3
                                                        w-full
                                                        text-xs
                                                    "
                                                >
                                                    <MessageSquare className="mr-2 h-3.5 w-3.5" />
                                                    Communicate Issue
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                        )}
                    </div>
                </div>
            )}

            {/* ==================================================
                FILTERS
            ================================================== */}

            <div
                className="
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    dark:border-blue-900/70
                    dark:bg-[#0f2747]
                "
            >
                <div
                    className="
                        flex
                        flex-col
                        gap-3
                        p-4
                        lg:flex-row
                        lg:items-center
                        lg:justify-between
                    "
                >
                    <div>
                        <h3
                            className="
                                text-sm
                                font-semibold
                                text-slate-900
                                dark:text-white
                            "
                        >
                            Contributor Performance
                        </h3>

                        <p
                            className="
                                mt-1
                                text-xs
                                text-slate-500
                                dark:text-slate-400
                            "
                        >
                            Monitor individual contributor
                            performance.
                        </p>
                    </div>

                    <div
                        className="
                            flex
                            flex-col
                            gap-2
                            sm:flex-row
                        "
                    >
                        <div className="relative">
                            <Search
                                className="
                                    absolute
                                    left-3
                                    top-1/2
                                    h-4
                                    w-4
                                    -translate-y-1/2
                                    text-slate-400
                                "
                            />

                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(event) =>
                                    setSearchTerm(
                                        event.target.value
                                    )
                                }
                                placeholder="Search contributor..."
                                className="
                                    h-9
                                    w-full
                                    rounded-lg
                                    border
                                    border-slate-200
                                    bg-white
                                    pl-9
                                    pr-3
                                    text-xs
                                    outline-none
                                    focus:border-blue-400
                                    sm:w-56
                                    dark:border-blue-900/70
                                    dark:bg-[#132f52]
                                    dark:text-white
                                "
                            />
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                setShowFilters(
                                    (current) =>
                                        !current
                                )
                            }
                        >
                            <Filter className="mr-2 h-4 w-4" />
                            Filters
                        </Button>
                    </div>
                </div>

                {showFilters && (
                    <div
                        className="
                            border-t
                            border-slate-200
                            p-4
                            dark:border-blue-900/70
                        "
                    >
                        <div
                            className="
                                grid
                                grid-cols-1
                                gap-3
                                md:grid-cols-3
                            "
                        >
                            <FilterSelect
                                label="Workload"
                                value={
                                    workloadFilter
                                }
                                onChange={
                                    setWorkloadFilter
                                }
                                options={[
                                    "All",
                                    "High",
                                    "Medium",
                                    "Low",
                                ]}
                            />

                            <FilterSelect
                                label="Attention"
                                value={
                                    attentionFilter
                                }
                                onChange={
                                    setAttentionFilter
                                }
                                options={[
                                    "All",
                                    "High",
                                    "Medium",
                                    "Low",
                                    "None",
                                ]}
                            />

                            <div>
                                <label
                                    className="
                                        mb-1.5
                                        block
                                        text-xs
                                        font-medium
                                        text-slate-600
                                        dark:text-slate-300
                                    "
                                >
                                    Sort By
                                </label>

                                <select
                                    value={sortField}
                                    onChange={(event) =>
                                        setSortField(
                                            event.target
                                                .value
                                        )
                                    }
                                    className="
                                        h-9
                                        w-full
                                        rounded-lg
                                        border
                                        border-slate-200
                                        bg-white
                                        px-3
                                        text-xs
                                        outline-none
                                        dark:border-blue-900/70
                                        dark:bg-[#132f52]
                                        dark:text-white
                                    "
                                >
                                    <option value="progress">
                                        Progress
                                    </option>

                                    <option value="name">
                                        Name
                                    </option>

                                    <option value="tasks">
                                        Assigned Tasks
                                    </option>

                                    <option value="completed">
                                        Completed Tasks
                                    </option>

                                    <option value="overdue">
                                        Overdue Tasks
                                    </option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-3 flex justify-end">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={clearFilters}
                            >
                                Clear Filters
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* ==================================================
                PERFORMANCE TABLE
            ================================================== */}

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
                <div
                    className="
                        overflow-x-auto
                    "
                >
                    <table className="w-full min-w-[1050px]">
                        <thead>
                            <tr
                                className="
                                    border-b
                                    border-slate-200
                                    bg-slate-50
                                    dark:border-blue-900/70
                                    dark:bg-[#132f52]
                                "
                            >
                                <SortableHeader
                                    label="Contributor"
                                    field={
                                        SORT_FIELD.NAME
                                    }
                                    activeField={
                                        sortField
                                    }
                                    direction={
                                        sortDirection
                                    }
                                    onSort={
                                        handleSort
                                    }
                                />

                                <th
                                    className="
                                        px-4
                                        py-3
                                        text-left
                                        text-xs
                                        font-semibold
                                        text-slate-500
                                        dark:text-slate-300
                                    "
                                >
                                    Type / Specialization
                                </th>

                                <SortableHeader
                                    label="Assigned"
                                    field={
                                        SORT_FIELD.TASKS
                                    }
                                    activeField={
                                        sortField
                                    }
                                    direction={
                                        sortDirection
                                    }
                                    onSort={
                                        handleSort
                                    }
                                />

                                <SortableHeader
                                    label="Completed"
                                    field={
                                        SORT_FIELD.COMPLETED
                                    }
                                    activeField={
                                        sortField
                                    }
                                    direction={
                                        sortDirection
                                    }
                                    onSort={
                                        handleSort
                                    }
                                />

                                <th
                                    className="
                                        px-4
                                        py-3
                                        text-left
                                        text-xs
                                        font-semibold
                                        text-slate-500
                                        dark:text-slate-300
                                    "
                                >
                                    In Progress
                                </th>

                                <th
                                    className="
                                        px-4
                                        py-3
                                        text-left
                                        text-xs
                                        font-semibold
                                        text-slate-500
                                        dark:text-slate-300
                                    "
                                >
                                    Blocked
                                </th>

                                <SortableHeader
                                    label="Overdue"
                                    field={
                                        SORT_FIELD.OVERDUE
                                    }
                                    activeField={
                                        sortField
                                    }
                                    direction={
                                        sortDirection
                                    }
                                    onSort={
                                        handleSort
                                    }
                                />

                                <SortableHeader
                                    label="Progress"
                                    field={
                                        SORT_FIELD.PROGRESS
                                    }
                                    activeField={
                                        sortField
                                    }
                                    direction={
                                        sortDirection
                                    }
                                    onSort={
                                        handleSort
                                    }
                                />

                                <th
                                    className="
                                        px-4
                                        py-3
                                        text-left
                                        text-xs
                                        font-semibold
                                        text-slate-500
                                        dark:text-slate-300
                                    "
                                >
                                    Workload
                                </th>

                                <th
                                    className="
                                        px-4
                                        py-3
                                        text-left
                                        text-xs
                                        font-semibold
                                        text-slate-500
                                        dark:text-slate-300
                                    "
                                >
                                    Attention
                                </th>

                                <th
                                    className="
                                        px-4
                                        py-3
                                        text-right
                                        text-xs
                                        font-semibold
                                        text-slate-500
                                        dark:text-slate-300
                                    "
                                >
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredMembers.length ===
                            0 ? (
                                <tr>
                                    <td
                                        colSpan={11}
                                        className="
                                            px-6
                                            py-10
                                            text-center
                                        "
                                    >
                                        <Search
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
                                                font-medium
                                                text-slate-700
                                                dark:text-slate-200
                                            "
                                        >
                                            No contributors
                                            found
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                text-xs
                                                text-slate-500
                                                dark:text-slate-400
                                            "
                                        >
                                            Try changing
                                            your filters.
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                filteredMembers.map(
                                    (member) => {
                                        const attention =
                                            getAttentionLevel(
                                                member
                                            );

                                        const completionRate =
                                            getCompletionRate(
                                                member.completedTasks,
                                                member.assignedTasks
                                            );

                                        return (
                                            <tr
                                                key={
                                                    member.id
                                                }
                                                className="
                                                    border-b
                                                    border-slate-100
                                                    last:border-b-0
                                                    hover:bg-slate-50
                                                    dark:border-blue-900/40
                                                    dark:hover:bg-[#132f52]
                                                "
                                            >
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="
                                                                flex
                                                                h-9
                                                                w-9
                                                                shrink-0
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
                                                                member.fullName
                                                            )}
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p
                                                                className="
                                                                    truncate
                                                                    text-sm
                                                                    font-semibold
                                                                    text-slate-800
                                                                    dark:text-white
                                                                "
                                                            >
                                                                {
                                                                    member.fullName
                                                                }
                                                            </p>

                                                            <p
                                                                className="
                                                                    truncate
                                                                    text-xs
                                                                    text-slate-500
                                                                    dark:text-slate-400
                                                                "
                                                            >
                                                                {
                                                                    member.email
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-4 py-4">
                                                    <p
                                                        className="
                                                            text-xs
                                                            font-medium
                                                            text-slate-700
                                                            dark:text-slate-200
                                                        "
                                                    >
                                                        {
                                                            member.contributorType
                                                        }
                                                    </p>

                                                    <p
                                                        className="
                                                            mt-1
                                                            text-[11px]
                                                            text-slate-500
                                                            dark:text-slate-400
                                                        "
                                                    >
                                                        {
                                                            member.specialization
                                                        }
                                                    </p>
                                                </td>

                                                <td className="px-4 py-4">
                                                    <MetricValue
                                                        value={
                                                            member.assignedTasks
                                                        }
                                                    />
                                                </td>

                                                <td className="px-4 py-4">
                                                    <MetricValue
                                                        value={
                                                            member.completedTasks
                                                        }
                                                        success
                                                    />

                                                    <p
                                                        className="
                                                            mt-1
                                                            text-[10px]
                                                            text-slate-400
                                                        "
                                                    >
                                                        {
                                                            completionRate
                                                        }
                                                        %
                                                    </p>
                                                </td>

                                                <td className="px-4 py-4">
                                                    <MetricValue
                                                        value={
                                                            member.inProgressTasks
                                                        }
                                                    />
                                                </td>

                                                <td className="px-4 py-4">
                                                    <MetricValue
                                                        value={
                                                            member.blockedTasks
                                                        }
                                                        danger={
                                                            member.blockedTasks >
                                                            0
                                                        }
                                                    />
                                                </td>

                                                <td className="px-4 py-4">
                                                    <MetricValue
                                                        value={
                                                            member.overdueTasks
                                                        }
                                                        danger={
                                                            member.overdueTasks >
                                                            0
                                                        }
                                                    />
                                                </td>

                                                <td className="px-4 py-4">
                                                    <div className="w-28">
                                                        <div className="flex items-center justify-between">
                                                            <span
                                                                className="
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
                                                            </span>
                                                        </div>

                                                        <div
                                                            className="
                                                                mt-1.5
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
                                                                "
                                                                style={{
                                                                    width: `${Math.min(
                                                                        Math.max(
                                                                            Number(
                                                                                member.progress ||
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
                                                </td>

                                                <td className="px-4 py-4">
                                                    <span
                                                        className={`
                                                            inline-flex
                                                            rounded-full
                                                            px-2.5
                                                            py-1
                                                            text-[11px]
                                                            font-medium
                                                            ${getWorkloadClass(
                                                                member.workload
                                                            )}
                                                        `}
                                                    >
                                                        {
                                                            member.workload
                                                        }
                                                    </span>
                                                </td>

                                                <td className="px-4 py-4">
                                                    <span
                                                        className={`
                                                            inline-flex
                                                            rounded-full
                                                            px-2.5
                                                            py-1
                                                            text-[11px]
                                                            font-medium
                                                            ${getAttentionClass(
                                                                attention
                                                            )}
                                                        `}
                                                    >
                                                        {attention ===
                                                        ATTENTION_LEVEL.NONE
                                                            ? "Good"
                                                            : attention}
                                                    </span>
                                                </td>

                                                <td className="px-4 py-4 text-right">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            setSelectedMemberId(
                                                                member.id
                                                            )
                                                        }
                                                    >
                                                        View
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    }
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ==================================================
                SELECTED CONTRIBUTOR DETAIL
            ================================================== */}

            {selectedMemberId && (
                <ContributorPerformanceDetails
                    member={
                        activePerformance.members.find(
                            (item) =>
                                String(item.id) ===
                                String(
                                    selectedMemberId
                                )
                        )
                    }
                    onClose={() =>
                        setSelectedMemberId(null)
                    }
                    onCommunicate={(member) =>
                        setCommunicationMember(
                            member
                        )
                    }
                />
            )}

            {/* ==================================================
                COMMUNICATION MODAL
            ================================================== */}

            {communicationMember && (
                <CommunicationDialog
                    member={communicationMember}
                    onClose={() =>
                        setCommunicationMember(
                            null
                        )
                    }
                    onSend={(message) => {
                        if (
                            onCommunicateManager
                        ) {
                            onCommunicateManager({
                                member:
                                    communicationMember,
                                message,
                            });
                        }

                        setCommunicationMember(
                            null
                        );
                    }}
                />
            )}
        </div>
    );
}

/* ============================================================
   SAFE STATE HELPER
   ------------------------------------------------------------
   This is only a local wrapper around useState.
============================================================ */

function useStateSafe(initialValue) {
    const ReactState = useState;

    return ReactState(initialValue);
}

/* ============================================================
   PERFORMANCE CARD
============================================================ */

function PerformanceCard({
    icon,
    label,
    value,
    description,
    danger = false,
}) {
    return (
        <div
            className={`
                rounded-xl
                border
                p-4
                ${
                    danger
                        ? "border-red-200 bg-red-50 dark:border-red-900/60 dark:bg-red-950/20"
                        : "border-slate-200 bg-white dark:border-blue-900/70 dark:bg-[#0f2747]"
                }
            `}
        >
            <div className="flex items-center gap-3">
                <div
                    className={`
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-lg
                        ${
                            danger
                                ? "bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400"
                                : "bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400"
                        }
                    `}
                >
                    {icon}
                </div>

                <div>
                    <p
                        className="
                            text-xs
                            text-slate-500
                            dark:text-slate-400
                        "
                    >
                        {label}
                    </p>

                    <p
                        className="
                            mt-1
                            text-2xl
                            font-bold
                            text-slate-900
                            dark:text-white
                        "
                    >
                        {value}
                    </p>
                </div>
            </div>

            <p
                className="
                    mt-3
                    text-[11px]
                    text-slate-500
                    dark:text-slate-400
                "
            >
                {description}
            </p>
        </div>
    );
}

/* ============================================================
   METRIC BOX
============================================================ */

function MetricBox({
    label,
    value,
    icon,
    danger = false,
}) {
    return (
        <div
            className="
                rounded-lg
                border
                border-slate-200
                bg-white
                p-4
                dark:border-blue-900/70
                dark:bg-[#0f2747]
            "
        >
            <div className="flex items-center gap-2">
                <span
                    className={
                        danger
                            ? "text-red-500"
                            : "text-blue-500"
                    }
                >
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
                className={`
                    mt-2
                    text-xl
                    font-bold
                    ${
                        danger
                            ? "text-red-600 dark:text-red-400"
                            : "text-slate-900 dark:text-white"
                    }
                `}
            >
                {value}
            </p>
        </div>
    );
}

/* ============================================================
   SMALL STAT
============================================================ */

function SmallStat({ label, value }) {
    return (
        <div
            className="
                rounded-md
                bg-slate-50
                p-2
                dark:bg-[#0f2747]
            "
        >
            <p
                className="
                    text-[10px]
                    text-slate-400
                "
            >
                {label}
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
                {value}
            </p>
        </div>
    );
}

/* ============================================================
   METRIC VALUE
============================================================ */

function MetricValue({
    value,
    success = false,
    danger = false,
}) {
    return (
        <span
            className={`
                text-sm
                font-semibold
                ${
                    danger
                        ? "text-red-600 dark:text-red-400"
                        : success
                        ? "text-green-600 dark:text-green-400"
                        : "text-slate-700 dark:text-slate-200"
                }
            `}
        >
            {value}
        </span>
    );
}

/* ============================================================
   SORTABLE HEADER
============================================================ */

function SortableHeader({
    label,
    field,
    activeField,
    direction,
    onSort,
}) {
    const isActive = field === activeField;

    return (
        <th className="px-4 py-3 text-left">
            <button
                type="button"
                onClick={() => onSort(field)}
                className="
                    inline-flex
                    items-center
                    gap-1
                    text-xs
                    font-semibold
                    text-slate-500
                    hover:text-blue-600
                    dark:text-slate-300
                    dark:hover:text-blue-400
                "
            >
                {label}

                {isActive ? (
                    direction ===
                    SORT_DIRECTION.ASC ? (
                        <ArrowUp className="h-3.5 w-3.5" />
                    ) : (
                        <ArrowDown className="h-3.5 w-3.5" />
                    )
                ) : (
                    <ChevronDown className="h-3.5 w-3.5 opacity-40" />
                )}
            </button>
        </th>
    );
}

/* ============================================================
   FILTER SELECT
============================================================ */

function FilterSelect({
    label,
    value,
    onChange,
    options,
}) {
    return (
        <div>
            <label
                className="
                    mb-1.5
                    block
                    text-xs
                    font-medium
                    text-slate-600
                    dark:text-slate-300
                "
            >
                {label}
            </label>

            <select
                value={value}
                onChange={(event) =>
                    onChange(event.target.value)
                }
                className="
                    h-9
                    w-full
                    rounded-lg
                    border
                    border-slate-200
                    bg-white
                    px-3
                    text-xs
                    outline-none
                    dark:border-blue-900/70
                    dark:bg-[#132f52]
                    dark:text-white
                "
            >
                {options.map((option) => (
                    <option
                        key={option}
                        value={option}
                    >
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
}

/* ============================================================
   CONTRIBUTOR PERFORMANCE DETAILS
============================================================ */

function ContributorPerformanceDetails({
    member,
    onClose,
    onCommunicate,
}) {
    if (!member) {
        return null;
    }

    const attention =
        getAttentionLevel(member);

    const completionRate =
        getCompletionRate(
            member.completedTasks,
            member.assignedTasks
        );

    const tasks = member.tasks || [];

    return (
        <div
            className="
                overflow-hidden
                rounded-xl
                border
                border-blue-200
                bg-white
                dark:border-blue-800/70
                dark:bg-[#0f2747]
            "
        >
            {/* HEADER */}

            <div
                className="
                    border-b
                    border-slate-200
                    bg-blue-50
                    p-5
                    dark:border-blue-900/70
                    dark:bg-blue-950/20
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
                                member.fullName
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
                                {
                                    member.fullName
                                }
                            </h3>

                            <p
                                className="
                                    mt-1
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
                    </div>

                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                onCommunicate(
                                    member
                                )
                            }
                        >
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Communicate
                        </Button>

                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </div>

            {/* METRICS */}

            <div
                className="
                    grid
                    grid-cols-2
                    gap-3
                    p-5
                    sm:grid-cols-4
                "
            >
                <MetricBox
                    label="Assigned"
                    value={
                        member.assignedTasks
                    }
                    icon={
                        <ListChecks className="h-4 w-4" />
                    }
                />

                <MetricBox
                    label="Completed"
                    value={
                        member.completedTasks
                    }
                    icon={
                        <CheckCircle2 className="h-4 w-4" />
                    }
                />

                <MetricBox
                    label="Progress"
                    value={`${member.progress}%`}
                    icon={
                        <TrendingUp className="h-4 w-4" />
                    }
                />

                <MetricBox
                    label="Completion"
                    value={`${completionRate}%`}
                    icon={
                        <Target className="h-4 w-4" />
                    }
                />
            </div>

            {/* DETAILS */}

            <div className="space-y-5 px-5 pb-5">
                <div
                    className="
                        grid
                        grid-cols-2
                        gap-3
                        md:grid-cols-5
                    "
                >
                    <SmallStat
                        label="In Progress"
                        value={
                            member.inProgressTasks
                        }
                    />

                    <SmallStat
                        label="Blocked"
                        value={
                            member.blockedTasks
                        }
                    />

                    <SmallStat
                        label="Awaiting Review"
                        value={
                            member.awaitingReviewTasks
                        }
                    />

                    <SmallStat
                        label="Overdue"
                        value={
                            member.overdueTasks
                        }
                    />

                    <div
                        className="
                            rounded-md
                            bg-slate-50
                            p-2
                            dark:bg-[#132f52]
                        "
                    >
                        <p
                            className="
                                text-[10px]
                                text-slate-400
                            "
                        >
                            Attention
                        </p>

                        <span
                            className={`
                                mt-1
                                inline-flex
                                rounded-full
                                px-2
                                py-0.5
                                text-[10px]
                                font-semibold
                                ${getAttentionClass(
                                    attention
                                )}
                            `}
                        >
                            {attention ===
                            ATTENTION_LEVEL.NONE
                                ? "Good"
                                : attention}
                        </span>
                    </div>
                </div>

                {/* PROGRESS */}

                <div>
                    <div className="flex justify-between">
                        <p
                            className="
                                text-xs
                                font-medium
                                text-slate-600
                                dark:text-slate-300
                            "
                        >
                            Individual Progress
                        </p>

                        <span
                            className="
                                text-xs
                                font-semibold
                                text-blue-600
                                dark:text-blue-400
                            "
                        >
                            {member.progress}%
                        </span>
                    </div>

                    <div
                        className="
                            mt-2
                            h-2
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
                            "
                            style={{
                                width: `${Math.min(
                                    Math.max(
                                        Number(
                                            member.progress ||
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

                {/* TASKS */}

                <div>
                    <div className="mb-3 flex items-center gap-2">
                        <ListChecks className="h-4 w-4 text-blue-500" />

                        <h4
                            className="
                                text-sm
                                font-semibold
                                text-slate-900
                                dark:text-white
                            "
                        >
                            Current Work
                        </h4>
                    </div>

                    {tasks.length === 0 ? (
                        <div
                            className="
                                rounded-lg
                                border
                                border-dashed
                                border-slate-300
                                p-5
                                text-center
                                dark:border-blue-900/70
                            "
                        >
                            <p
                                className="
                                    text-xs
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                No task details are
                                available.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {tasks.map((task) => (
                                <div
                                    key={task.id}
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
                                        <div className="flex items-start gap-2">
                                            {getStatusIcon(
                                                task.status
                                            )}

                                            <div>
                                                <p
                                                    className="
                                                        text-xs
                                                        font-semibold
                                                        text-slate-800
                                                        dark:text-white
                                                    "
                                                >
                                                    {
                                                        task.title
                                                    }
                                                </p>

                                                <p
                                                    className="
                                                        mt-1
                                                        text-[11px]
                                                        text-slate-500
                                                        dark:text-slate-400
                                                    "
                                                >
                                                    Due:{" "}
                                                    {formatDate(
                                                        task.dueDate
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`
                                                    rounded-full
                                                    px-2
                                                    py-1
                                                    text-[10px]
                                                    font-medium
                                                    ${getStatusClass(
                                                        task.status
                                                    )}
                                                `}
                                            >
                                                {
                                                    task.status
                                                }
                                            </span>

                                            <span
                                                className="
                                                    text-xs
                                                    font-semibold
                                                    text-blue-600
                                                    dark:text-blue-400
                                                "
                                            >
                                                {
                                                    task.progress
                                                }
                                                %
                                            </span>
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
   COMMUNICATION DIALOG
   ------------------------------------------------------------
   This supports the use-case requirement:

   "The Team Leader communicates important issues to
   the Manager."
============================================================ */

function CommunicationDialog({
    member,
    onClose,
    onSend,
}) {
    const [message, setMessage] =
        useStateSafe("");

    const [sending, setSending] =
        useStateSafe(false);

    const [messageError, setMessageError] =
        useStateSafe("");

    const handleSend = async () => {
        const trimmed =
            message.trim();

        if (!trimmed) {
            setMessageError(
                "Message cannot be empty."
            );

            return;
        }

        try {
            setSending(true);
            setMessageError("");

            /*
             * Backend-ready:
             *
             * await communicationService.sendToManager({
             *     memberId: member.id,
             *     message: trimmed,
             * });
             */

            await new Promise((resolve) =>
                setTimeout(resolve, 500)
            );

            onSend(trimmed);
        } catch (error) {
            console.error(
                "Unable to send message:",
                error
            );

            setMessageError(
                "Unable to send message. Please try again."
            );
        } finally {
            setSending(false);
        }
    };

    return (
        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-black/50
                p-4
            "
            role="dialog"
            aria-modal="true"
            aria-label="Communicate with Manager"
        >
            <div
                className="
                    w-full
                    max-w-lg
                    overflow-hidden
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    shadow-xl
                    dark:border-blue-900/70
                    dark:bg-[#0f2747]
                "
            >
                <div
                    className="
                        border-b
                        border-slate-200
                        p-5
                        dark:border-blue-900/70
                    "
                >
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h3
                                className="
                                    text-base
                                    font-semibold
                                    text-slate-900
                                    dark:text-white
                                "
                            >
                                Communicate with Manager
                            </h3>

                            <p
                                className="
                                    mt-1
                                    text-xs
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                Report an important team
                                performance issue.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="
                                text-slate-400
                                hover:text-slate-700
                                dark:hover:text-white
                            "
                            aria-label="Close"
                        >
                            ×
                        </button>
                    </div>
                </div>

                <div className="space-y-4 p-5">
                    <div
                        className="
                            rounded-lg
                            bg-slate-50
                            p-3
                            dark:bg-[#132f52]
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
                                        member.fullName
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
                                        member.specialization
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="manager-message"
                            className="
                                mb-1.5
                                block
                                text-xs
                                font-medium
                                text-slate-700
                                dark:text-slate-300
                            "
                        >
                            Message
                        </label>

                        <textarea
                            id="manager-message"
                            value={message}
                            onChange={(event) => {
                                setMessage(
                                    event.target
                                        .value
                                );

                                if (
                                    event.target.value.trim()
                                ) {
                                    setMessageError(
                                        ""
                                    );
                                }
                            }}
                            placeholder="Describe the blocker, delay, risk, dependency, or important team update..."
                            rows={5}
                            className="
                                w-full
                                resize-none
                                rounded-lg
                                border
                                border-slate-200
                                bg-white
                                p-3
                                text-sm
                                outline-none
                                focus:border-blue-400
                                dark:border-blue-900/70
                                dark:bg-[#132f52]
                                dark:text-white
                            "
                        />

                        {messageError && (
                            <p
                                className="
                                    mt-1.5
                                    text-xs
                                    text-red-500
                                "
                            >
                                {messageError}
                            </p>
                        )}
                    </div>
                </div>

                <div
                    className="
                        flex
                        justify-end
                        gap-2
                        border-t
                        border-slate-200
                        p-4
                        dark:border-blue-900/70
                    "
                >
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={sending}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        onClick={handleSend}
                        disabled={sending}
                    >
                        {sending ? (
                            <>
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            <>
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Send to Manager
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default ViewTeamPerformance;