import { useMemo, useState } from "react";

import {
    AlertCircle,
    AlertTriangle,
    BarChart3,
    CalendarClock,
    CheckCircle2,
    ChevronDown,
    CircleDot,
    ClipboardList,
    Clock3,
   
    Filter,
  
    Loader2,
    RefreshCw,
    Search,
    TrendingUp,
 
    Users,
    X,
    Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";

/* ============================================================
   TEAM LEADER — USE CASE 003
   ------------------------------------------------------------
   CONT-LEADER-003
   Monitor Team Progress

   Goal:
   Allow the Team Leader to monitor the progress of
   team members' assigned work.

   Important:
   The Team Leader can monitor and identify issues,
   but cannot:
   - assign tasks
   - change deadlines
   - approve completed work
   - override Manager decisions
============================================================ */

/* ============================================================
   TASK STATUS
============================================================ */

const TASK_STATUS = {
    COMPLETED: "Completed",
    IN_PROGRESS: "In Progress",
    TODO: "To Do",
    BLOCKED: "Blocked",
    REVIEW: "Awaiting Review",
};

/* ============================================================
   DEMO TEAM DATA
   ------------------------------------------------------------
   Replace this later with:
   GET /api/teams/my-team/progress
============================================================ */

const DEMO_PROGRESS_DATA = {
    team: {
        id: 1,
        name: "AI Development Team",
        description:
            "Responsible for developing and maintaining AI-powered project management features.",
    },

    members: [
        {
            id: 201,
            fullName: "Abebe Kebede",
            email: "abebe@example.com",
            contributorType: "Developer",
            specialization: "Frontend Developer",
            availability: "Available",

            tasks: [
                {
                    id: 401,
                    title: "Develop Project Dashboard",
                    project: "AI-PMS",
                    sprint: "Sprint 3",
                    status: TASK_STATUS.IN_PROGRESS,
                    priority: "High",
                    progress: 70,
                    dueDate: "2026-09-01",
                },
                {
                    id: 402,
                    title: "Implement Project Filters",
                    project: "AI-PMS",
                    sprint: "Sprint 3",
                    status: TASK_STATUS.COMPLETED,
                    priority: "Medium",
                    progress: 100,
                    dueDate: "2026-08-28",
                },
                {
                    id: 403,
                    title: "Improve Dashboard Responsiveness",
                    project: "AI-PMS",
                    sprint: "Sprint 3",
                    status: TASK_STATUS.IN_PROGRESS,
                    priority: "Medium",
                    progress: 45,
                    dueDate: "2026-09-04",
                },
            ],
        },

        {
            id: 202,
            fullName: "Sara Mohammed",
            email: "sara@example.com",
            contributorType: "Developer",
            specialization: "Backend Developer",
            availability: "Busy",

            tasks: [
                {
                    id: 404,
                    title: "Implement Team API",
                    project: "AI-PMS Backend",
                    sprint: "Sprint 2",
                    status: TASK_STATUS.IN_PROGRESS,
                    priority: "High",
                    progress: 55,
                    dueDate: "2026-09-03",
                },
                {
                    id: 405,
                    title: "Implement User Permissions API",
                    project: "AI-PMS Backend",
                    sprint: "Sprint 2",
                    status: TASK_STATUS.BLOCKED,
                    priority: "High",
                    progress: 35,
                    dueDate: "2026-08-29",
                },
            ],
        },

        {
            id: 203,
            fullName: "Dawit Tesfaye",
            email: "dawit@example.com",
            contributorType: "Developer",
            specialization: "QA / Tester",
            availability: "Available",

            tasks: [
                {
                    id: 406,
                    title: "Test Team Management",
                    project: "AI-PMS Testing",
                    sprint: "Sprint 4",
                    status: TASK_STATUS.REVIEW,
                    priority: "High",
                    progress: 90,
                    dueDate: "2026-09-05",
                },
                {
                    id: 407,
                    title: "Regression Testing",
                    project: "AI-PMS Testing",
                    sprint: "Sprint 4",
                    status: TASK_STATUS.COMPLETED,
                    priority: "Medium",
                    progress: 100,
                    dueDate: "2026-08-30",
                },
            ],
        },

        {
            id: 204,
            fullName: "Mekdes Alemu",
            email: "mekdes@example.com",
            contributorType: "Staff",
            specialization: "Project Assistant",
            availability: "Away",

            tasks: [
                {
                    id: 408,
                    title: "Update Project Documentation",
                    project: "AI-PMS Documentation",
                    sprint: "Sprint 2",
                    status: TASK_STATUS.TODO,
                    priority: "Low",
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

function getPriorityClass(priority) {
    switch (priority) {
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

function getStatusIcon(status) {
    switch (status) {
        case TASK_STATUS.COMPLETED:
            return (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
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
   DATE / OVERDUE HELPERS
============================================================ */

function isOverdue(task) {
    if (!task?.dueDate) {
        return false;
    }

    if (task.status === TASK_STATUS.COMPLETED) {
        return false;
    }

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(task.dueDate);

    if (Number.isNaN(dueDate.getTime())) {
        return false;
    }

    dueDate.setHours(0, 0, 0, 0);

    return dueDate < today;
}

function isApproachingDeadline(task) {
    if (!task?.dueDate) {
        return false;
    }

    if (task.status === TASK_STATUS.COMPLETED) {
        return false;
    }

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(task.dueDate);

    if (Number.isNaN(dueDate.getTime())) {
        return false;
    }

    dueDate.setHours(0, 0, 0, 0);

    const difference =
        dueDate.getTime() - today.getTime();

    const days =
        difference / (1000 * 60 * 60 * 24);

    return days >= 0 && days <= 3;
}

/* ============================================================
   MAIN COMPONENT
============================================================ */

function MonitorTeamProgress({
    progressData: externalData = null,
    loading: externalLoading = false,
    error: externalError = null,
    unauthorized = false,
    onRetry,
}) {
    const [isLoading, setIsLoading] =
        useState(externalLoading);

    const [error, setError] =
        useState(externalError);

    const [isUnauthorized, setIsUnauthorized] =
        useState(unauthorized);

    const [progressData, setProgressData] =
        useState(externalData || DEMO_PROGRESS_DATA);

    const [searchTerm, setSearchTerm] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("All");

    const [memberFilter, setMemberFilter] =
        useState("All");

    const [priorityFilter, setPriorityFilter] =
        useState("All");

    const [selectedMemberId, setSelectedMemberId] =
        useState(null);

    const [showAttentionOnly, setShowAttentionOnly] =
        useState(false);

    /* ========================================================
       UPDATE EXTERNAL DATA

       This does NOT use useEffect intentionally.
       The component can receive fresh data from the parent
       through props.
    ======================================================== */

    const activeData =
        externalData || progressData;

    const members =
        activeData?.members || [];

    /* ========================================================
       FLATTEN TASKS
    ======================================================== */

    const allTasks = useMemo(() => {
        return members.flatMap((member) =>
            (member.tasks || []).map((task) => ({
                ...task,
                memberId: member.id,
                memberName: member.fullName,
                memberEmail: member.email,
                contributorType:
                    member.contributorType,
                specialization:
                    member.specialization,
            }))
        );
    }, [members]);

    /* ========================================================
       TEAM PROGRESS CALCULATION
    ======================================================== */

    const statistics = useMemo(() => {
        const totalTasks = allTasks.length;

        const completedTasks =
            allTasks.filter(
                (task) =>
                    task.status ===
                    TASK_STATUS.COMPLETED
            ).length;

        const inProgressTasks =
            allTasks.filter(
                (task) =>
                    task.status ===
                    TASK_STATUS.IN_PROGRESS
            ).length;

        const blockedTasks =
            allTasks.filter(
                (task) =>
                    task.status ===
                    TASK_STATUS.BLOCKED
            ).length;

        const reviewTasks =
            allTasks.filter(
                (task) =>
                    task.status ===
                    TASK_STATUS.REVIEW
            ).length;

        const overdueTasks =
            allTasks.filter(isOverdue).length;

        const approachingDeadlineTasks =
            allTasks.filter(
                isApproachingDeadline
            ).length;

        const averageProgress =
            totalTasks > 0
                ? Math.round(
                      allTasks.reduce(
                          (sum, task) =>
                              sum +
                              Number(
                                  task.progress || 0
                              ),
                          0
                      ) / totalTasks
                  )
                : 0;

        return {
            totalTasks,
            completedTasks,
            inProgressTasks,
            blockedTasks,
            reviewTasks,
            overdueTasks,
            approachingDeadlineTasks,
            averageProgress,
        };
    }, [allTasks]);

    /* ========================================================
       MEMBER PROGRESS
    ======================================================== */

    const memberProgress = useMemo(() => {
        return members.map((member) => {
            const tasks =
                member.tasks || [];

            const total =
                tasks.length;

            const completed =
                tasks.filter(
                    (task) =>
                        task.status ===
                        TASK_STATUS.COMPLETED
                ).length;

            const inProgress =
                tasks.filter(
                    (task) =>
                        task.status ===
                        TASK_STATUS.IN_PROGRESS
                ).length;

            const blocked =
                tasks.filter(
                    (task) =>
                        task.status ===
                        TASK_STATUS.BLOCKED
                ).length;

            const review =
                tasks.filter(
                    (task) =>
                        task.status ===
                        TASK_STATUS.REVIEW
                ).length;

            const overdue =
                tasks.filter(isOverdue).length;

            const progress =
                total > 0
                    ? Math.round(
                          tasks.reduce(
                              (sum, task) =>
                                  sum +
                                  Number(
                                      task.progress ||
                                          0
                                  ),
                              0
                          ) / total
                      )
                    : 0;

            return {
                ...member,
                total,
                completed,
                inProgress,
                blocked,
                review,
                overdue,
                progress,
            };
        });
    }, [members]);

    /* ========================================================
       FILTER TASKS
    ======================================================== */

    const filteredTasks = useMemo(() => {
        return allTasks.filter((task) => {
            const matchesSearch =
                !searchTerm ||
                task.title
                    ?.toLowerCase()
                    .includes(
                        searchTerm.toLowerCase()
                    ) ||
                task.project
                    ?.toLowerCase()
                    .includes(
                        searchTerm.toLowerCase()
                    ) ||
                task.memberName
                    ?.toLowerCase()
                    .includes(
                        searchTerm.toLowerCase()
                    );

            const matchesStatus =
                statusFilter === "All" ||
                task.status === statusFilter;

            const matchesMember =
                memberFilter === "All" ||
                String(task.memberId) ===
                    String(memberFilter);

            const matchesPriority =
                priorityFilter === "All" ||
                task.priority === priorityFilter;

            const matchesAttention =
                !showAttentionOnly ||
                task.status ===
                    TASK_STATUS.BLOCKED ||
                isOverdue(task) ||
                isApproachingDeadline(task) ||
                Number(task.progress || 0) < 40;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesMember &&
                matchesPriority &&
                matchesAttention
            );
        });
    }, [
        allTasks,
        searchTerm,
        statusFilter,
        memberFilter,
        priorityFilter,
        showAttentionOnly,
    ]);

    /* ========================================================
       SELECTED MEMBER
    ======================================================== */

    const selectedMember = useMemo(() => {
        if (!selectedMemberId) {
            return null;
        }

        return (
            memberProgress.find(
                (member) =>
                    String(member.id) ===
                    String(selectedMemberId)
            ) || null
        );
    }, [
        memberProgress,
        selectedMemberId,
    ]);

    /* ========================================================
       RETRY
    ======================================================== */

    const handleRetry = async () => {
        setIsLoading(true);
        setError(null);
        setIsUnauthorized(false);

        if (onRetry) {
            try {
                await onRetry();
            } catch (retryError) {
                console.error(
                    "Unable to reload team progress:",
                    retryError
                );

                setError(
                    "Unable to calculate team progress. Please try again."
                );
            } finally {
                setIsLoading(false);
            }

            return;
        }

        /*
         * Frontend development fallback.
         *
         * Later this will be replaced by:
         *
         * const response =
         *     await teamService.getTeamProgress();
         *
         * setProgressData(response.data);
         */

        window.setTimeout(() => {
            setProgressData(
                DEMO_PROGRESS_DATA
            );

            setIsLoading(false);
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
                            font-semibold
                            text-slate-700
                            dark:text-slate-200
                        "
                    >
                        Loading team progress...
                    </p>

                    <p
                        className="
                            mt-1
                            text-xs
                            text-slate-500
                            dark:text-slate-400
                        "
                    >
                        Calculating current team activity.
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
                    your team's progress.
                </p>
            </div>
        );
    }

    /* ========================================================
       ERROR STATE
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
                    <AlertTriangle className="h-6 w-6" />
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
                    Unable to Calculate Progress
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
       NO PROGRESS DATA
    ======================================================== */

    if (!activeData || members.length === 0) {
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
                    No Team Progress Data
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
                    No team progress data is currently
                    available.
                </p>
            </div>
        );
    }

    /* ========================================================
       MAIN UI
    ======================================================== */

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
                            <TrendingUp className="h-5 w-5" />
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
                                Monitor Team Progress
                            </h2>

                            <p
                                className="
                                    mt-1
                                    text-xs
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                {activeData.team?.name ||
                                    "My Team"}{" "}
                                • Team Leader View
                            </p>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleRetry}
                        className="
                            w-full
                            sm:w-auto
                        "
                    >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Refresh Progress
                    </Button>
                </div>

                {activeData.team?.description && (
                    <p
                        className="
                            mt-4
                            max-w-3xl
                            text-sm
                            leading-6
                            text-slate-600
                            dark:text-slate-300
                        "
                    >
                        {activeData.team.description}
                    </p>
                )}
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
                        gap-4
                        md:flex-row
                        md:items-center
                        md:justify-between
                    "
                >
                    <div>
                        <div className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-blue-500" />

                            <h3
                                className="
                                    text-base
                                    font-semibold
                                    text-slate-900
                                    dark:text-white
                                "
                            >
                                Overall Team Progress
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
                            Average progress across all assigned
                            team tasks.
                        </p>
                    </div>

                    <div
                        className="
                            text-left
                            md:text-right
                        "
                    >
                        <p
                            className="
                                text-3xl
                                font-bold
                                text-blue-600
                                dark:text-blue-400
                            "
                        >
                            {statistics.averageProgress}%
                        </p>

                        <p
                            className="
                                text-xs
                                text-slate-500
                                dark:text-slate-400
                            "
                        >
                            Overall progress
                        </p>
                    </div>
                </div>

                <div
                    className="
                        mt-5
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
                            width: `${statistics.averageProgress}%`,
                        }}
                    />
                </div>
            </div>

            {/* ==================================================
                STATISTICS
            ================================================== */}

            <div
                className="
                    grid
                    grid-cols-1
                    gap-3
                    sm:grid-cols-2
                    lg:grid-cols-3
                    xl:grid-cols-6
                "
            >
                <ProgressStatCard
                    icon={
                        <ClipboardList className="h-5 w-5" />
                    }
                    label="Assigned Tasks"
                    value={statistics.totalTasks}
                    description="Total team tasks"
                />

                <ProgressStatCard
                    icon={
                        <CheckCircle2 className="h-5 w-5" />
                    }
                    label="Completed"
                    value={statistics.completedTasks}
                    description="Completed tasks"
                />

                <ProgressStatCard
                    icon={
                        <CircleDot className="h-5 w-5" />
                    }
                    label="In Progress"
                    value={statistics.inProgressTasks}
                    description="Active tasks"
                />

                <ProgressStatCard
                    icon={
                        <AlertCircle className="h-5 w-5" />
                    }
                    label="Blocked"
                    value={statistics.blockedTasks}
                    description="Blocked tasks"
                    danger={
                        statistics.blockedTasks > 0
                    }
                />

                <ProgressStatCard
                    icon={
                        <Clock3 className="h-5 w-5" />
                    }
                    label="Awaiting Review"
                    value={statistics.reviewTasks}
                    description="Need review"
                />

                <ProgressStatCard
                    icon={
                        <CalendarClock className="h-5 w-5" />
                    }
                    label="Overdue"
                    value={statistics.overdueTasks}
                    description="Past due date"
                    danger={
                        statistics.overdueTasks > 0
                    }
                />
            </div>

            {/* ==================================================
                ATTENTION SUMMARY
            ================================================== */}

            {(statistics.blockedTasks > 0 ||
                statistics.overdueTasks > 0 ||
                statistics.approachingDeadlineTasks >
                    0) && (
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
                            <AlertTriangle className="h-5 w-5" />
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
                                Team Attention Required
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
                                There are{" "}
                                {statistics.blockedTasks}{" "}
                                blocked task
                                {statistics.blockedTasks !==
                                1
                                    ? "s"
                                    : ""}
                                ,{" "}
                                {statistics.overdueTasks}{" "}
                                overdue task
                                {statistics.overdueTasks !==
                                1
                                    ? "s"
                                    : ""}
                                , and{" "}
                                {
                                    statistics.approachingDeadlineTasks
                                }{" "}
                                task
                                {statistics.approachingDeadlineTasks !==
                                1
                                    ? "s"
                                    : ""}{" "}
                                approaching its deadline.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* ==================================================
                MEMBER PROGRESS
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
                    <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-blue-500" />

                        <h3
                            className="
                                text-base
                                font-semibold
                                text-slate-900
                                dark:text-white
                            "
                        >
                            Individual Contributor Progress
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
                        Review each contributor's current work
                        progress and identify areas requiring
                        attention.
                    </p>
                </div>

                <div
                    className="
                        grid
                        grid-cols-1
                        gap-4
                        lg:grid-cols-2
                    "
                >
                    {memberProgress.map((member) => (
                        <MemberProgressCard
                            key={member.id}
                            member={member}
                            selected={
                                String(
                                    selectedMemberId
                                ) ===
                                String(member.id)
                            }
                            onSelect={() =>
                                setSelectedMemberId(
                                    member.id
                                )
                            }
                        />
                    ))}
                </div>
            </div>

            {/* ==================================================
                FILTERS
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
                        lg:flex-row
                        lg:items-center
                        lg:justify-between
                    "
                >
                    <div className="flex items-center gap-2">
                        <Filter className="h-5 w-5 text-blue-500" />

                        <div>
                            <h3
                                className="
                                    text-base
                                    font-semibold
                                    text-slate-900
                                    dark:text-white
                                "
                            >
                                Team Work Activity
                            </h3>

                            <p
                                className="
                                    mt-1
                                    text-xs
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                Filter tasks to identify delays,
                                blockers, and work requiring
                                attention.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            setShowAttentionOnly(
                                (current) => !current
                            )
                        }
                        className={`
                            inline-flex
                            w-fit
                            items-center
                            gap-2
                            rounded-lg
                            border
                            px-3
                            py-2
                            text-xs
                            font-medium
                            transition
                            ${
                                showAttentionOnly
                                    ? "border-orange-300 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950/30 dark:text-orange-400"
                                    : "border-slate-200 bg-white text-slate-600 dark:border-blue-900/70 dark:bg-[#132f52] dark:text-slate-300"
                            }
                        `}
                    >
                        <AlertTriangle className="h-4 w-4" />
                        Attention Required
                    </button>
                </div>

                <div
                    className="
                        mt-5
                        grid
                        grid-cols-1
                        gap-3
                        md:grid-cols-2
                        lg:grid-cols-4
                    "
                >
                    {/* SEARCH */}

                    <div className="relative">
                        <Search
                            className="
                                pointer-events-none
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
                            placeholder="Search tasks, projects, contributors..."
                            className="
                                h-10
                                w-full
                                rounded-lg
                                border
                                border-slate-200
                                bg-white
                                pl-9
                                pr-3
                                text-sm
                                outline-none
                                transition
                                focus:border-blue-400
                                focus:ring-2
                                focus:ring-blue-100
                                dark:border-blue-900/70
                                dark:bg-[#132f52]
                                dark:text-white
                                dark:focus:ring-blue-950/50
                            "
                        />
                    </div>

                    {/* STATUS */}

                    <FilterSelect
                        value={statusFilter}
                        onChange={setStatusFilter}
                        options={[
                            "All",
                            TASK_STATUS.COMPLETED,
                            TASK_STATUS.IN_PROGRESS,
                            TASK_STATUS.TODO,
                            TASK_STATUS.BLOCKED,
                            TASK_STATUS.REVIEW,
                        ]}
                    />

                    {/* MEMBER */}

                    <FilterSelect
                        value={memberFilter}
                        onChange={setMemberFilter}
                        options={[
                            "All",
                            ...members.map(
                                (member) =>
                                    String(member.id)
                            ),
                        ]}
                        labels={{
                            All: "All Contributors",
                            ...Object.fromEntries(
                                members.map(
                                    (member) => [
                                        String(
                                            member.id
                                        ),
                                        member.fullName,
                                    ]
                                )
                            ),
                        }}
                    />

                    {/* PRIORITY */}

                    <FilterSelect
                        value={priorityFilter}
                        onChange={setPriorityFilter}
                        options={[
                            "All",
                            "High",
                            "Medium",
                            "Low",
                        ]}
                    />
                </div>
            </div>

            {/* ==================================================
                TASK TABLE
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
                        flex
                        items-center
                        justify-between
                        border-b
                        border-slate-200
                        px-5
                        py-4
                        dark:border-blue-900/70
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
                            Team Tasks
                        </h3>

                        <p
                            className="
                                mt-1
                                text-xs
                                text-slate-500
                                dark:text-slate-400
                            "
                        >
                            Showing {filteredTasks.length} of{" "}
                            {allTasks.length} tasks
                        </p>
                    </div>

                    {(searchTerm ||
                        statusFilter !== "All" ||
                        memberFilter !== "All" ||
                        priorityFilter !== "All" ||
                        showAttentionOnly) && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearchTerm("");
                                setStatusFilter("All");
                                setMemberFilter("All");
                                setPriorityFilter("All");
                                setShowAttentionOnly(
                                    false
                                );
                            }}
                            className="
                                inline-flex
                                items-center
                                gap-1
                                rounded-lg
                                px-2.5
                                py-1.5
                                text-xs
                                font-medium
                                text-slate-500
                                hover:bg-slate-100
                                dark:text-slate-400
                                dark:hover:bg-slate-800
                            "
                        >
                            <X className="h-3.5 w-3.5" />
                            Clear Filters
                        </button>
                    )}
                </div>

                {filteredTasks.length === 0 ? (
                    <div
                        className="
                            px-6
                            py-12
                            text-center
                        "
                    >
                        <ClipboardList
                            className="
                                mx-auto
                                h-10
                                w-10
                                text-slate-400
                            "
                        />

                        <h4
                            className="
                                mt-4
                                text-sm
                                font-semibold
                                text-slate-800
                                dark:text-white
                            "
                        >
                            No Matching Tasks
                        </h4>

                        <p
                            className="
                                mt-1
                                text-xs
                                text-slate-500
                                dark:text-slate-400
                            "
                        >
                            No tasks match the selected
                            filters.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1000px]">
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
                                    <TableHeader>
                                        Task
                                    </TableHeader>

                                    <TableHeader>
                                        Contributor
                                    </TableHeader>

                                    <TableHeader>
                                        Project / Sprint
                                    </TableHeader>

                                    <TableHeader>
                                        Priority
                                    </TableHeader>

                                    <TableHeader>
                                        Status
                                    </TableHeader>

                                    <TableHeader>
                                        Progress
                                    </TableHeader>

                                    <TableHeader>
                                        Due Date
                                    </TableHeader>

                                    <TableHeader>
                                        Attention
                                    </TableHeader>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredTasks.map(
                                    (task) => (
                                        <TaskRow
                                            key={task.id}
                                            task={task}
                                            onViewMember={() =>
                                                setSelectedMemberId(
                                                    task.memberId
                                                )
                                            }
                                        />
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ==================================================
                SELECTED MEMBER DETAIL
            ================================================== */}

            {selectedMember && (
                <SelectedMemberPanel
                    member={selectedMember}
                    onClose={() =>
                        setSelectedMemberId(null)
                    }
                />
            )}

            {/* ==================================================
                AUTHORITY NOTICE
            ================================================== */}

            <div
                className="
                    rounded-xl
                    border
                    border-blue-200
                    bg-blue-50
                    p-4
                    dark:border-blue-900/60
                    dark:bg-blue-950/20
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
                            text-blue-600
                            dark:bg-blue-950/60
                            dark:text-blue-400
                        "
                    >
                        <Zap className="h-4 w-4" />
                    </div>

                    <div>
                        <p
                            className="
                                text-xs
                                font-semibold
                                text-blue-800
                                dark:text-blue-300
                            "
                        >
                            Team Leader Monitoring Authority
                        </p>

                        <p
                            className="
                                mt-1
                                text-xs
                                leading-5
                                text-blue-700
                                dark:text-blue-400
                            "
                        >
                            This module is for monitoring team
                            progress and identifying blockers,
                            delays, and work requiring attention.
                            Project-level decisions, task
                            assignment, deadlines, final approval,
                            and Manager overrides remain outside
                            Team Leader authority.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ============================================================
   PROGRESS STAT CARD
============================================================ */

function ProgressStatCard({
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
            <div className="flex items-center justify-between gap-2">
                <div
                    className={`
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-lg
                        ${
                            danger
                                ? "bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400"
                                : "bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400"
                        }
                    `}
                >
                    {icon}
                </div>

                <p
                    className={`
                        text-2xl
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

            <p
                className="
                    mt-3
                    text-xs
                    font-semibold
                    text-slate-800
                    dark:text-slate-200
                "
            >
                {label}
            </p>

            <p
                className="
                    mt-0.5
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
   MEMBER PROGRESS CARD
============================================================ */

function MemberProgressCard({
    member,
    selected,
    onSelect,
}) {
    return (
        <button
            type="button"
            onClick={onSelect}
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
                        : "border-slate-200 bg-slate-50 hover:border-blue-200 hover:bg-blue-50/50 dark:border-blue-900/70 dark:bg-[#132f52] dark:hover:bg-blue-950/20"
                }
            `}
        >
            <div
                className="
                    flex
                    items-start
                    gap-3
                "
            >
                <div
                    className="
                        flex
                        h-11
                        w-11
                        shrink-0
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

                <div className="min-w-0 flex-1">
                    <div
                        className="
                            flex
                            items-start
                            justify-between
                            gap-3
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
                                {member.fullName}
                            </p>

                            <p
                                className="
                                    mt-0.5
                                    text-xs
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                {member.specialization ||
                                    member.contributorType ||
                                    "Contributor"}
                            </p>
                        </div>

                        <span
                            className="
                                shrink-0
                                text-lg
                                font-bold
                                text-blue-600
                                dark:text-blue-400
                            "
                        >
                            {member.progress}%
                        </span>
                    </div>

                    <div
                        className="
                            mt-3
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
                                transition-all
                            "
                            style={{
                                width: `${member.progress}%`,
                            }}
                        />
                    </div>

                    <div
                        className="
                            mt-3
                            grid
                            grid-cols-2
                            gap-2
                            sm:grid-cols-5
                        "
                    >
                        <MiniMetric
                            label="Tasks"
                            value={member.total}
                        />

                        <MiniMetric
                            label="Done"
                            value={member.completed}
                        />

                        <MiniMetric
                            label="Active"
                            value={member.inProgress}
                        />

                        <MiniMetric
                            label="Blocked"
                            value={member.blocked}
                        />

                        <MiniMetric
                            label="Overdue"
                            value={member.overdue}
                        />
                    </div>
                </div>
            </div>
        </button>
    );
}

/* ============================================================
   MINI METRIC
============================================================ */

function MiniMetric({
    label,
    value,
}) {
    return (
        <div
            className="
                rounded-md
                bg-white
                px-2
                py-1.5
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
                    mt-0.5
                    text-xs
                    font-bold
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
   FILTER SELECT
============================================================ */

function FilterSelect({
    value,
    onChange,
    options,
    labels = {},
}) {
    return (
        <div className="relative">
            <select
                value={value}
                onChange={(event) =>
                    onChange(event.target.value)
                }
                className="
                    h-10
                    w-full
                    appearance-none
                    rounded-lg
                    border
                    border-slate-200
                    bg-white
                    px-3
                    pr-9
                    text-sm
                    text-slate-700
                    outline-none
                    focus:border-blue-400
                    focus:ring-2
                    focus:ring-blue-100
                    dark:border-blue-900/70
                    dark:bg-[#132f52]
                    dark:text-slate-200
                    dark:focus:ring-blue-950/50
                "
            >
                {options.map((option) => (
                    <option
                        key={option}
                        value={option}
                    >
                        {labels[option] ||
                            option}
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
    );
}

/* ============================================================
   TABLE HEADER
============================================================ */

function TableHeader({ children }) {
    return (
        <th
            className="
                px-4
                py-3
                text-left
                text-[11px]
                font-semibold
                uppercase
                tracking-wide
                text-slate-500
                dark:text-slate-400
            "
        >
            {children}
        </th>
    );
}

/* ============================================================
   TASK ROW
============================================================ */

function TaskRow({
    task,
    onViewMember,
}) {
    const overdue = isOverdue(task);

    const approaching =
        isApproachingDeadline(task);

    const needsAttention =
        task.status ===
            TASK_STATUS.BLOCKED ||
        overdue ||
        approaching ||
        Number(task.progress || 0) < 40;

    return (
        <tr
            className="
                border-b
                border-slate-100
                last:border-b-0
                dark:border-blue-900/50
            "
        >
            <td className="px-4 py-4">
                <div className="flex items-start gap-2">
                    {getStatusIcon(
                        task.status
                    )}

                    <div>
                        <p
                            className="
                                max-w-[240px]
                                text-xs
                                font-semibold
                                text-slate-800
                                dark:text-white
                            "
                        >
                            {task.title}
                        </p>
                    </div>
                </div>
            </td>

            <td className="px-4 py-4">
                <button
                    type="button"
                    onClick={onViewMember}
                    className="
                        flex
                        items-center
                        gap-2
                        text-left
                        hover:text-blue-600
                        dark:hover:text-blue-400
                    "
                >
                    <div
                        className="
                            flex
                            h-7
                            w-7
                            items-center
                            justify-center
                            rounded-full
                            bg-blue-100
                            text-[10px]
                            font-bold
                            text-blue-600
                            dark:bg-blue-950/70
                            dark:text-blue-400
                        "
                    >
                        {getInitials(
                            task.memberName
                        )}
                    </div>

                    <div>
                        <p
                            className="
                                text-xs
                                font-medium
                                text-slate-700
                                dark:text-slate-200
                            "
                        >
                            {task.memberName}
                        </p>

                        <p
                            className="
                                text-[10px]
                                text-slate-400
                            "
                        >
                            {task.specialization ||
                                task.contributorType ||
                                "Contributor"}
                        </p>
                    </div>
                </button>
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
                    {task.project ||
                        "No project"}
                </p>

                <p
                    className="
                        mt-0.5
                        text-[10px]
                        text-slate-400
                    "
                >
                    {task.sprint ||
                        "No sprint"}
                </p>
            </td>

            <td className="px-4 py-4">
                <span
                    className={`
                        inline-flex
                        rounded-full
                        px-2.5
                        py-1
                        text-[10px]
                        font-medium
                        ${getPriorityClass(
                            task.priority
                        )}
                    `}
                >
                    {task.priority ||
                        "Not specified"}
                </span>
            </td>

            <td className="px-4 py-4">
                <span
                    className={`
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-full
                        px-2.5
                        py-1
                        text-[10px]
                        font-medium
                        ${getStatusClass(
                            task.status
                        )}
                    `}
                >
                    {getStatusIcon(
                        task.status
                    )}

                    {task.status}
                </span>
            </td>

            <td className="px-4 py-4">
                <div className="w-[110px]">
                    <div
                        className="
                            flex
                            items-center
                            justify-between
                        "
                    >
                        <span
                            className="
                                text-[10px]
                                text-slate-400
                            "
                        >
                            Progress
                        </span>

                        <span
                            className="
                                text-[10px]
                                font-bold
                                text-slate-700
                                dark:text-slate-200
                            "
                        >
                            {task.progress || 0}%
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
            </td>

            <td className="px-4 py-4">
                <p
                    className={`
                        text-xs
                        font-medium
                        ${
                            overdue
                                ? "text-red-600 dark:text-red-400"
                                : approaching
                                ? "text-orange-600 dark:text-orange-400"
                                : "text-slate-700 dark:text-slate-200"
                        }
                    `}
                >
                    {formatDate(
                        task.dueDate
                    )}
                </p>

                {overdue && (
                    <p
                        className="
                            mt-0.5
                            text-[10px]
                            text-red-500
                        "
                    >
                        Overdue
                    </p>
                )}

                {!overdue &&
                    approaching && (
                        <p
                            className="
                                mt-0.5
                                text-[10px]
                                text-orange-500
                            "
                        >
                            Approaching
                        </p>
                    )}
            </td>

            <td className="px-4 py-4">
                {needsAttention ? (
                    <span
                        className="
                            inline-flex
                            items-center
                            gap-1
                            rounded-full
                            bg-orange-100
                            px-2
                            py-1
                            text-[10px]
                            font-medium
                            text-orange-700
                            dark:bg-orange-950/40
                            dark:text-orange-400
                        "
                    >
                        <AlertTriangle className="h-3 w-3" />
                        Attention
                    </span>
                ) : (
                    <span
                        className="
                            text-[10px]
                            text-slate-400
                        "
                    >
                        Normal
                    </span>
                )}
            </td>
        </tr>
    );
}

/* ============================================================
   SELECTED MEMBER PANEL
============================================================ */

function SelectedMemberPanel({
    member,
    onClose,
}) {
    const tasks = member.tasks || [];

    return (
        <div
            className="
                overflow-hidden
                rounded-xl
                border
                border-blue-200
                bg-white
                dark:border-blue-800
                dark:bg-[#0f2747]
            "
        >
            <div
                className="
                    flex
                    flex-col
                    gap-4
                    border-b
                    border-blue-100
                    bg-blue-50
                    p-5
                    dark:border-blue-900/70
                    dark:bg-blue-950/20
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
                        <p
                            className="
                                text-base
                                font-semibold
                                text-slate-900
                                dark:text-white
                            "
                        >
                            {member.fullName}
                        </p>

                        <p
                            className="
                                mt-1
                                text-xs
                                text-slate-500
                                dark:text-slate-400
                            "
                        >
                            {member.specialization ||
                                member.contributorType ||
                                "Contributor"}
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-lg
                        text-slate-400
                        hover:bg-white
                        hover:text-slate-700
                        dark:hover:bg-slate-800
                        dark:hover:text-white
                    "
                    aria-label="Close member details"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            <div className="space-y-5 p-5">
                <div
                    className="
                        grid
                        grid-cols-2
                        gap-3
                        sm:grid-cols-4
                    "
                >
                    <DetailMetric
                        label="Progress"
                        value={`${member.progress}%`}
                    />

                    <DetailMetric
                        label="Completed"
                        value={member.completed}
                    />

                    <DetailMetric
                        label="Blocked"
                        value={member.blocked}
                    />

                    <DetailMetric
                        label="Overdue"
                        value={member.overdue}
                    />
                </div>

                <div>
                    <div className="mb-3 flex items-center gap-2">
                        <ClipboardList className="h-4 w-4 text-blue-500" />

                        <h4
                            className="
                                text-sm
                                font-semibold
                                text-slate-900
                                dark:text-white
                            "
                        >
                            Contributor Tasks
                        </h4>
                    </div>

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
                                                {task.title}
                                            </p>

                                            <p
                                                className="
                                                    mt-0.5
                                                    text-[10px]
                                                    text-slate-400
                                                "
                                            >
                                                {task.project}{" "}
                                                •{" "}
                                                {task.sprint}
                                            </p>
                                        </div>
                                    </div>

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                        "
                                    >
                                        <span
                                            className="
                                                text-xs
                                                font-bold
                                                text-blue-600
                                                dark:text-blue-400
                                            "
                                        >
                                            {task.progress ||
                                                0}
                                            %
                                        </span>

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
                                            {task.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ============================================================
   DETAIL METRIC
============================================================ */

function DetailMetric({
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
                    text-lg
                    font-bold
                    text-slate-800
                    dark:text-white
                "
            >
                {value}
            </p>
        </div>
    );
}

export default MonitorTeamProgress;