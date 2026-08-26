import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Activity,
    AlertCircle,
    AlertTriangle,
    BarChart3,
    Calendar,
    CheckCircle2,
    Clock,
    FolderKanban,
    Loader2,
    RefreshCw,
    Users,
    UserRound,
    XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
    getAuthorizedManagerProjects,
    getProjectDashboard,
} from "@/services/projectReportService";

// ============================================================
// SMALL HELPERS
// ============================================================

const formatDate = (value) => {
    if (!value) {
        return "Unavailable";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Unavailable";
    }

    return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

const formatDateTime = (value) => {
    if (!value) {
        return "Unavailable";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Unavailable";
    }

    return date.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const getCurrentUser = () => {
    try {
        const value = localStorage.getItem(
            "aipms_current_user"
        );

        return value
            ? JSON.parse(value)
            : null;
    } catch (error) {
        console.error(
            "Failed to read current user:",
            error
        );

        return null;
    }
};

const getId = (item) => {
    if (!item) {
        return "";
    }

    return (
        item.id ??
        item._id ??
        item.projectId ??
        item.userId ??
        ""
    );
};

const getProjectName = (project) => {
    return (
        project?.name ||
        project?.title ||
        project?.projectName ||
        "Unnamed Project"
    );
};

const getProgressValue = (value) => {
    if (
        value === null ||
        value === undefined ||
        Number.isNaN(Number(value))
    ) {
        return null;
    }

    return Math.max(
        0,
        Math.min(
            100,
            Number(value)
        )
    );
};

// ============================================================
// STATUS BADGE
// ============================================================

function StatusBadge({
    status,
}) {
    const normalized = String(
        status || "Unknown"
    ).toLowerCase();

    let classes =
        "bg-slate-700 text-slate-200";

    if (
        normalized === "active" ||
        normalized === "in progress" ||
        normalized === "in-progress"
    ) {
        classes =
            "bg-blue-500/15 text-blue-300 border-blue-500/30";
    }

    if (
        normalized === "completed" ||
        normalized === "complete" ||
        normalized === "done"
    ) {
        classes =
            "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
    }

    if (
        normalized === "blocked" ||
        normalized === "cancelled" ||
        normalized === "canceled"
    ) {
        classes =
            "bg-red-500/15 text-red-300 border-red-500/30";
    }

    if (
        normalized === "planning" ||
        normalized === "pending"
    ) {
        classes =
            "bg-amber-500/15 text-amber-300 border-amber-500/30";
    }

    return (
        <span
            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${classes}`}
        >
            {status || "Unknown"}
        </span>
    );
}

// ============================================================
// PROGRESS BAR
// ============================================================

function ProgressBar({
    value,
    label = true,
}) {
    const progress =
        getProgressValue(value);

    if (progress === null) {
        return (
            <div className="text-xs text-slate-400">
                Insufficient data
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="mb-1 flex items-center justify-between">
                {label && (
                    <span className="text-xs text-slate-400">
                        Progress
                    </span>
                )}

                <span className="text-xs font-semibold text-white">
                    {progress}%
                </span>
            </div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-700">
                <div
                    className="h-full rounded-full bg-blue-500 transition-all duration-500"
                    style={{
                        width: `${progress}%`,
                    }}
                />
            </div>
        </div>
    );
}

// ============================================================
// METRIC CARD
// ============================================================

function MetricCard({
    title,
    value,
    icon: Icon,
    description,
    danger = false,
}) {
    return (
        <div className="rounded-xl border border-slate-700 bg-slate-800/70 p-5 shadow-lg">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-slate-400">
                        {title}
                    </p>

                    <p
                        className={`mt-2 text-3xl font-bold ${
                            danger
                                ? "text-red-400"
                                : "text-white"
                        }`}
                    >
                        {value ?? "—"}
                    </p>

                    {description && (
                        <p className="mt-1 text-xs text-slate-500">
                            {description}
                        </p>
                    )}
                </div>

                <div
                    className={`rounded-lg p-3 ${
                        danger
                            ? "bg-red-500/10 text-red-400"
                            : "bg-blue-500/10 text-blue-400"
                    }`}
                >
                    <Icon size={21} />
                </div>
            </div>
        </div>
    );
}

// ============================================================
// EMPTY STATE
// ============================================================

function EmptyState({
    icon: Icon = AlertCircle,
    title,
    description,
}) {
    return (
        <div className="flex min-h-[160px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-800/30 p-6 text-center">
            <Icon
                size={30}
                className="mb-3 text-slate-500"
            />

            <h3 className="text-sm font-semibold text-slate-300">
                {title}
            </h3>

            {description && (
                <p className="mt-1 max-w-md text-xs text-slate-500">
                    {description}
                </p>
            )}
        </div>
    );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function ViewProjectDashboard() {
    const [currentUser, setCurrentUser] =
        useState(null);

    const [
        projects,
        setProjects,
    ] = useState([]);

    const [
        selectedProjectId,
        setSelectedProjectId,
    ] = useState("");

    const [
        dashboard,
        setDashboard,
    ] = useState(null);

    const [
        loadingProjects,
        setLoadingProjects,
    ] = useState(true);

    const [
        loadingDashboard,
        setLoadingDashboard,
    ] = useState(false);

    const [
        error,
        setError,
    ] = useState("");

    const [
        lastUpdated,
        setLastUpdated,
    ] = useState(null);

    // ========================================================
    // LOAD AUTHORIZED PROJECTS
    // ========================================================

    const loadProjects = useCallback(
        async () => {
            setLoadingProjects(true);
            setError("");

            try {
                const user =
                    getCurrentUser();

                setCurrentUser(user);

                const result =
                    getAuthorizedManagerProjects({
                        currentUser:
                            user,
                    });

                if (
                    !result?.success
                ) {
                    setProjects([]);

                    setError(
                        result?.error ||
                            "Unable to load authorized projects."
                    );

                    return;
                }

                const authorizedProjects =
                    Array.isArray(
                        result.data
                    )
                        ? result.data
                        : [];

                setProjects(
                    authorizedProjects
                );

                // ------------------------------------------------
                // Keep existing selection if it is still valid.
                // Otherwise select the first authorized project.
                // ------------------------------------------------

                setSelectedProjectId(
                    (previous) => {
                        const stillExists =
                            authorizedProjects.some(
                                (project) =>
                                    String(
                                        getId(
                                            project
                                        )
                                    ) ===
                                    String(
                                        previous
                                    )
                            );

                        if (
                            stillExists
                        ) {
                            return previous;
                        }

                        return authorizedProjects
                            .length
                            ? String(
                                  getId(
                                      authorizedProjects[0]
                                  )
                              )
                            : "";
                    }
                );
            } catch (err) {
                console.error(
                    "Failed to load manager projects:",
                    err
                );

                setProjects([]);

                setError(
                    "Unable to load authorized projects."
                );
            } finally {
                setLoadingProjects(false);
            }
        },
        []
    );

    // ========================================================
    // LOAD DASHBOARD
    // ========================================================

    const loadDashboard =
        useCallback(
            async (
                projectId
            ) => {
                if (!projectId) {
                    setDashboard(null);
                    return;
                }

                setLoadingDashboard(
                    true
                );
                setError("");

                try {
                    const result =
                        getProjectDashboard(
                            projectId,
                            {
                                currentUser,
                            }
                        );

                    if (
                        !result?.success
                    ) {
                        setDashboard(null);

                        setError(
                            result?.error ||
                                "Unable to load project dashboard."
                        );

                        return;
                    }

                    setDashboard(
                        result.data
                    );

                    setLastUpdated(
                        result.data
                            ?.generatedAt ||
                            new Date().toISOString()
                    );
                } catch (err) {
                    console.error(
                        "Failed to load project dashboard:",
                        err
                    );

                    setDashboard(null);

                    setError(
                        "Unable to load project dashboard."
                    );
                } finally {
                    setLoadingDashboard(
                        false
                    );
                }
            },
            [currentUser]
        );

    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {
        loadProjects();
    }, [loadProjects]);

    // ========================================================
    // LOAD SELECTED PROJECT
    // ========================================================

    useEffect(() => {
        if (
            selectedProjectId &&
            currentUser
        ) {
            loadDashboard(
                selectedProjectId
            );
        }
    }, [
        selectedProjectId,
        currentUser,
        loadDashboard,
    ]);

    // ========================================================
    // REFRESH EVERYTHING
    // ========================================================

    const handleRefresh =
        async () => {
            await loadProjects();

            if (
                selectedProjectId
            ) {
                await loadDashboard(
                    selectedProjectId
                );
            }
        };

    // ========================================================
    // SELECTED PROJECT
    // ========================================================

    const selectedProject =
        useMemo(
            () =>
                projects.find(
                    (project) =>
                        String(
                            getId(
                                project
                            )
                        ) ===
                        String(
                            selectedProjectId
                        )
                ),
            [
                projects,
                selectedProjectId,
            ]
        );

    // ========================================================
    // DASHBOARD DATA
    // ========================================================

    const taskStats =
        dashboard?.tasks || {};

    const activeSprint =
        dashboard?.activeSprint;

    const team =
        dashboard?.team;

    const teamLeader =
        dashboard?.teamLeader;

    const workload =
        dashboard?.teamWorkload;

    const deadlines =
        dashboard?.upcomingDeadlines ||
        [];

    const overdueTasks =
        dashboard?.overdueTasks
            ?.data || [];

    const blockedTasks =
        dashboard?.blockedTasks
            ?.data || [];

    const activities =
        dashboard?.projectActivity
            ?.recent || [];

    const sprintProgress =
        dashboard?.sprintProgress ||
        [];

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="min-h-screen bg-slate-950 p-4 text-white md:p-6">
            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
                            <FolderKanban
                                size={24}
                            />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold">
                                View Project Dashboard
                            </h1>

                            <p className="mt-1 text-sm text-slate-400">
                                REPORT-001 · Project performance overview
                            </p>
                        </div>
                    </div>
                </div>

                <Button
                    type="button"
                    onClick={
                        handleRefresh
                    }
                    disabled={
                        loadingProjects ||
                        loadingDashboard
                    }
                    className="gap-2"
                >
                    <RefreshCw
                        size={16}
                        className={
                            loadingDashboard
                                ? "animate-spin"
                                : ""
                        }
                    />

                    Refresh
                </Button>
            </div>

            {/* ==================================================
                ACCESS ERROR
            ================================================== */}

            {error && (
                <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
                    <AlertCircle
                        size={20}
                        className="mt-0.5 shrink-0"
                    />

                    <div>
                        <p className="font-semibold">
                            Unable to load dashboard
                        </p>

                        <p className="mt-1 text-sm text-red-300/80">
                            {error}
                        </p>
                    </div>
                </div>
            )}

            {/* ==================================================
                PROJECT SELECTOR
            ================================================== */}

            <div className="mb-6 rounded-xl border border-slate-700 bg-slate-800/70 p-5">
                <div className="mb-3 flex items-center gap-2">
                    <FolderKanban
                        size={18}
                        className="text-blue-400"
                    />

                    <h2 className="font-semibold">
                        Authorized Projects
                    </h2>
                </div>

                {loadingProjects ? (
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Loader2
                            size={17}
                            className="animate-spin"
                        />

                        Loading authorized projects...
                    </div>
                ) : projects.length ===
                  0 ? (
                    <EmptyState
                        icon={
                            FolderKanban
                        }
                        title="No authorized projects"
                        description="No project dashboard is available for the current Manager."
                    />
                ) : (
                    <select
                        value={
                            selectedProjectId
                        }
                        onChange={(event) =>
                            setSelectedProjectId(
                                event.target
                                    .value
                            )
                        }
                        className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-blue-500 lg:max-w-xl"
                    >
                        {projects.map(
                            (
                                project
                            ) => (
                                <option
                                    key={String(
                                        getId(
                                            project
                                        )
                                    )}
                                    value={String(
                                        getId(
                                            project
                                        )
                                    )}
                                >
                                    {getProjectName(
                                        project
                                    )}
                                </option>
                            )
                        )}
                    </select>
                )}
            </div>

            {/* ==================================================
                LOADING DASHBOARD
            ================================================== */}

            {loadingDashboard && (
                <div className="mb-6 flex items-center justify-center rounded-xl border border-slate-700 bg-slate-800/50 p-10">
                    <div className="flex items-center gap-3 text-slate-400">
                        <Loader2
                            size={22}
                            className="animate-spin"
                        />

                        Loading project dashboard...
                    </div>
                </div>
            )}

            {/* ==================================================
                NO DASHBOARD
            ================================================== */}

            {!loadingDashboard &&
                !dashboard &&
                projects.length >
                    0 && (
                    <EmptyState
                        icon={
                            BarChart3
                        }
                        title="Select a project"
                        description="Choose an authorized project to view its current dashboard."
                    />
                )}

            {/* ==================================================
                DASHBOARD
            ================================================== */}

            {!loadingDashboard &&
                dashboard && (
                    <>
                        {/* ======================================
                            PROJECT HEADER
                        ====================================== */}

                        <div className="mb-6 rounded-xl border border-slate-700 bg-slate-800/70 p-6">
                            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                                <div>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h2 className="text-2xl font-bold">
                                            {
                                                dashboard
                                                    .project
                                                    ?.name
                                            }
                                        </h2>

                                        <StatusBadge
                                            status={
                                                dashboard
                                                    .project
                                                    ?.status
                                            }
                                        />
                                    </div>

                                    {dashboard
                                        .project
                                        ?.description && (
                                        <p className="mt-2 max-w-3xl text-sm text-slate-400">
                                            {
                                                dashboard
                                                    .project
                                                    .description
                                            }
                                        </p>
                                    )}

                                    <div className="mt-4 flex flex-wrap gap-5 text-xs text-slate-400">
                                        <span>
                                            Start:{" "}
                                            <strong className="text-slate-300">
                                                {formatDate(
                                                    dashboard
                                                        .project
                                                        ?.startDate
                                                )}
                                            </strong>
                                        </span>

                                        <span>
                                            End:{" "}
                                            <strong className="text-slate-300">
                                                {formatDate(
                                                    dashboard
                                                        .project
                                                        ?.endDate
                                                )}
                                            </strong>
                                        </span>
                                    </div>
                                </div>

                                <div className="min-w-[220px]">
                                    <p className="mb-2 text-sm text-slate-400">
                                        Overall Project Progress
                                    </p>

                                    <ProgressBar
                                        value={
                                            dashboard.overallProgress
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ======================================
                            TOP METRICS
                        ====================================== */}

                        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            <MetricCard
                                title="Total Tasks"
                                value={
                                    taskStats.total
                                }
                                icon={
                                    BarChart3
                                }
                                description="Current project task records"
                            />

                            <MetricCard
                                title="Completed Tasks"
                                value={
                                    taskStats.completed
                                }
                                icon={
                                    CheckCircle2
                                }
                                description="Completed from current task data"
                            />

                            <MetricCard
                                title="Overdue Tasks"
                                value={
                                    dashboard
                                        .overdueTasks
                                        ?.total
                                }
                                icon={
                                    Clock
                                }
                                danger
                                description="Based on current date/time"
                            />

                            <MetricCard
                                title="Blocked Tasks"
                                value={
                                    dashboard
                                        .blockedTasks
                                        ?.total
                                }
                                icon={
                                    XCircle
                                }
                                danger
                                description="Current blocked task records"
                            />
                        </div>

                        {/* ======================================
                            TASK STATISTICS + ACTIVE SPRINT
                        ====================================== */}

                        <div className="mb-6 grid gap-6 lg:grid-cols-2">
                            {/* Task Statistics */}

                            <div className="rounded-xl border border-slate-700 bg-slate-800/70 p-6">
                                <div className="mb-5 flex items-center gap-2">
                                    <BarChart3
                                        size={19}
                                        className="text-blue-400"
                                    />

                                    <h2 className="font-semibold">
                                        Task Statistics
                                    </h2>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="rounded-lg bg-slate-900/70 p-4">
                                        <p className="text-xs text-slate-500">
                                            Completed
                                        </p>

                                        <p className="mt-1 text-xl font-bold text-emerald-400">
                                            {
                                                taskStats.completed
                                            }
                                        </p>
                                    </div>

                                    <div className="rounded-lg bg-slate-900/70 p-4">
                                        <p className="text-xs text-slate-500">
                                            In Progress
                                        </p>

                                        <p className="mt-1 text-xl font-bold text-blue-400">
                                            {
                                                taskStats.inProgress
                                            }
                                        </p>
                                    </div>

                                    <div className="rounded-lg bg-slate-900/70 p-4">
                                        <p className="text-xs text-slate-500">
                                            Pending
                                        </p>

                                        <p className="mt-1 text-xl font-bold text-amber-400">
                                            {
                                                taskStats.pending
                                            }
                                        </p>
                                    </div>

                                    <div className="rounded-lg bg-slate-900/70 p-4">
                                        <p className="text-xs text-slate-500">
                                            Incomplete
                                        </p>

                                        <p className="mt-1 text-xl font-bold text-slate-300">
                                            {
                                                taskStats.incomplete
                                            }
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-5">
                                    <ProgressBar
                                        value={
                                            taskStats.completionPercentage
                                        }
                                    />
                                </div>
                            </div>

                            {/* Active Sprint */}

                            <div className="rounded-xl border border-slate-700 bg-slate-800/70 p-6">
                                <div className="mb-5 flex items-center gap-2">
                                    <Calendar
                                        size={19}
                                        className="text-blue-400"
                                    />

                                    <h2 className="font-semibold">
                                        Active Sprint
                                    </h2>
                                </div>

                                {!activeSprint ? (
                                    <EmptyState
                                        icon={
                                            Calendar
                                        }
                                        title="No active sprint"
                                        description="There is currently no sprint configured with an active status for this project."
                                    />
                                ) : (
                                    <div>
                                        <div className="mb-4 flex items-center justify-between gap-3">
                                            <div>
                                                <h3 className="font-semibold text-white">
                                                    {
                                                        activeSprint.name
                                                    }
                                                </h3>

                                                <p className="mt-1 text-xs text-slate-500">
                                                    {
                                                        activeSprint.totalTasks
                                                    }{" "}
                                                    tasks
                                                </p>
                                            </div>

                                            <StatusBadge
                                                status={
                                                    activeSprint.status
                                                }
                                            />
                                        </div>

                                        <ProgressBar
                                            value={
                                                activeSprint.progressPercentage
                                            }
                                        />

                                        <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                                            <div>
                                                <p className="text-slate-500">
                                                    Start
                                                </p>

                                                <p className="mt-1 text-slate-300">
                                                    {formatDate(
                                                        activeSprint.startDate
                                                    )}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-slate-500">
                                                    End
                                                </p>

                                                <p className="mt-1 text-slate-300">
                                                    {formatDate(
                                                        activeSprint.endDate
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ======================================
                            SPRINT PROGRESS
                        ====================================== */}

                        <div className="mb-6 rounded-xl border border-slate-700 bg-slate-800/70 p-6">
                            <div className="mb-5 flex items-center gap-2">
                                <Calendar
                                    size={19}
                                    className="text-blue-400"
                                />

                                <h2 className="font-semibold">
                                    Sprint Progress
                                </h2>
                            </div>

                            {sprintProgress.length ===
                            0 ? (
                                <EmptyState
                                    icon={
                                        Calendar
                                    }
                                    title="No sprint data"
                                    description="No sprint records are currently associated with this project."
                                />
                            ) : (
                                <div className="space-y-4">
                                    {sprintProgress.map(
                                        (
                                            sprint
                                        ) => (
                                            <div
                                                key={String(
                                                    sprint.id
                                                )}
                                                className="rounded-lg border border-slate-700 bg-slate-900/50 p-4"
                                            >
                                                <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                                    <div>
                                                        <h3 className="font-medium">
                                                            {
                                                                sprint.name
                                                            }
                                                        </h3>

                                                        <p className="mt-1 text-xs text-slate-500">
                                                            {
                                                                sprint.completedTasks
                                                            }{" "}
                                                            /{" "}
                                                            {
                                                                sprint.totalTasks
                                                            }{" "}
                                                            tasks completed
                                                        </p>
                                                    </div>

                                                    <StatusBadge
                                                        status={
                                                            sprint.status
                                                        }
                                                    />
                                                </div>

                                                <ProgressBar
                                                    value={
                                                        sprint.progressPercentage
                                                    }
                                                />
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                        </div>

                        {/* ======================================
                            TEAM + TEAM LEADER
                        ====================================== */}

                        <div className="mb-6 grid gap-6 lg:grid-cols-2">
                            {/* Team */}

                            <div className="rounded-xl border border-slate-700 bg-slate-800/70 p-6">
                                <div className="mb-5 flex items-center gap-2">
                                    <Users
                                        size={19}
                                        className="text-blue-400"
                                    />

                                    <h2 className="font-semibold">
                                        Team Progress
                                    </h2>
                                </div>

                                {!team?.available ? (
                                    <EmptyState
                                        icon={
                                            Users
                                        }
                                        title="Team information unavailable"
                                        description="This project does not currently have sufficient team relationship data."
                                    />
                                ) : (
                                    <>
                                        <div className="mb-4 flex items-center justify-between">
                                            <div>
                                                <h3 className="font-semibold">
                                                    {
                                                        team.name
                                                    }
                                                </h3>

                                                <p className="mt-1 text-xs text-slate-500">
                                                    {
                                                        team.totalMembers
                                                    }{" "}
                                                    members
                                                </p>
                                            </div>

                                            <span className="text-lg font-bold text-white">
                                                {team.progress !==
                                                null
                                                    ? `${team.progress}%`
                                                    : "—"}
                                            </span>
                                        </div>

                                        <ProgressBar
                                            value={
                                                team.progress
                                            }
                                        />
                                    </>
                                )}
                            </div>

                            {/* Team Leader */}

                            <div className="rounded-xl border border-slate-700 bg-slate-800/70 p-6">
                                <div className="mb-5 flex items-center gap-2">
                                    <UserRound
                                        size={19}
                                        className="text-blue-400"
                                    />

                                    <h2 className="font-semibold">
                                        Team Leader Progress
                                    </h2>
                                </div>

                                {!teamLeader?.available ? (
                                    <EmptyState
                                        icon={
                                            UserRound
                                        }
                                        title="Team leader information unavailable"
                                        description="No authorized team leader relationship is currently available."
                                    />
                                ) : (
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
                                            <UserRound
                                                size={22}
                                            />
                                        </div>

                                        <div>
                                            <h3 className="font-semibold">
                                                {
                                                    teamLeader.name
                                                }
                                            </h3>

                                            <p className="text-xs text-slate-500">
                                                {
                                                    teamLeader.email
                                                }
                                            </p>

                                            <p className="mt-2 text-xs text-slate-400">
                                                Project activities:{" "}
                                                <span className="font-semibold text-slate-200">
                                                    {
                                                        teamLeader.activityCount
                                                    }
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ======================================
                            TEAM WORKLOAD
                        ====================================== */}

                        <div className="mb-6 rounded-xl border border-slate-700 bg-slate-800/70 p-6">
                            <div className="mb-5 flex items-center gap-2">
                                <Users
                                    size={19}
                                    className="text-blue-400"
                                />

                                <h2 className="font-semibold">
                                    Team Workload
                                </h2>
                            </div>

                            {!workload?.available ? (
                                <EmptyState
                                    icon={
                                        Users
                                    }
                                    title="Workload unavailable"
                                    description="Team workload cannot be calculated because team assignment data is unavailable."
                                />
                            ) : workload
                                  .memberWorkload
                                  ?.length ===
                              0 ? (
                                <EmptyState
                                    icon={
                                        Users
                                    }
                                    title="No team members"
                                    description="No current team members are available for workload calculation."
                                />
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[650px] text-left text-sm">
                                        <thead>
                                            <tr className="border-b border-slate-700 text-xs uppercase text-slate-500">
                                                <th className="px-3 py-3">
                                                    Member
                                                </th>

                                                <th className="px-3 py-3">
                                                    Assigned
                                                </th>

                                                <th className="px-3 py-3">
                                                    Completed
                                                </th>

                                                <th className="px-3 py-3">
                                                    Overdue
                                                </th>

                                                <th className="px-3 py-3">
                                                    Blocked
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {workload.memberWorkload.map(
                                                (
                                                    member
                                                ) => (
                                                    <tr
                                                        key={String(
                                                            member.id
                                                        )}
                                                        className="border-b border-slate-800"
                                                    >
                                                        <td className="px-3 py-4">
                                                            <div className="font-medium text-slate-200">
                                                                {
                                                                    member.name
                                                                }
                                                            </div>

                                                            {member.email && (
                                                                <div className="text-xs text-slate-500">
                                                                    {
                                                                        member.email
                                                                    }
                                                                </div>
                                                            )}
                                                        </td>

                                                        <td className="px-3 py-4 text-slate-300">
                                                            {
                                                                member.assignedTasks
                                                            }
                                                        </td>

                                                        <td className="px-3 py-4 text-emerald-400">
                                                            {
                                                                member.completedTasks
                                                            }
                                                        </td>

                                                        <td className="px-3 py-4 text-red-400">
                                                            {
                                                                member.overdueTasks
                                                            }
                                                        </td>

                                                        <td className="px-3 py-4 text-amber-400">
                                                            {
                                                                member.blockedTasks
                                                            }
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* ======================================
                            UPCOMING DEADLINES
                        ====================================== */}

                        <div className="mb-6 grid gap-6 lg:grid-cols-2">
                            <div className="rounded-xl border border-slate-700 bg-slate-800/70 p-6">
                                <div className="mb-5 flex items-center gap-2">
                                    <Clock
                                        size={19}
                                        className="text-amber-400"
                                    />

                                    <h2 className="font-semibold">
                                        Upcoming Deadlines
                                    </h2>
                                </div>

                                {deadlines.length ===
                                0 ? (
                                    <EmptyState
                                        icon={
                                            Clock
                                        }
                                        title="No upcoming deadlines"
                                        description="No upcoming project, sprint, or task deadlines were found."
                                    />
                                ) : (
                                    <div className="space-y-3">
                                        {deadlines.map(
                                            (
                                                item,
                                                index
                                            ) => (
                                                <div
                                                    key={`${item.type}-${item.id}-${index}`}
                                                    className="flex items-center justify-between gap-4 rounded-lg bg-slate-900/60 p-4"
                                                >
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <span className="rounded bg-slate-700 px-2 py-1 text-[10px] uppercase text-slate-400">
                                                                {
                                                                    item.type
                                                                }
                                                            </span>

                                                            <p className="truncate text-sm font-medium text-slate-200">
                                                                {
                                                                    item.name
                                                                }
                                                            </p>
                                                        </div>

                                                        <p className="mt-1 text-xs text-slate-500">
                                                            {formatDateTime(
                                                                item.deadline
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* ==================================
                                OVERDUE TASKS
                            ================================== */}

                            <div className="rounded-xl border border-slate-700 bg-slate-800/70 p-6">
                                <div className="mb-5 flex items-center gap-2">
                                    <AlertTriangle
                                        size={19}
                                        className="text-red-400"
                                    />

                                    <h2 className="font-semibold">
                                        Overdue Tasks
                                    </h2>
                                </div>

                                {overdueTasks.length ===
                                0 ? (
                                    <EmptyState
                                        icon={
                                            CheckCircle2
                                        }
                                        title="No overdue tasks"
                                        description="No incomplete tasks have passed their actual deadline."
                                    />
                                ) : (
                                    <div className="space-y-3">
                                        {overdueTasks
                                            .slice(
                                                0,
                                                8
                                            )
                                            .map(
                                                (
                                                    task,
                                                    index
                                                ) => (
                                                    <div
                                                        key={`${getId(task)}-${index}`}
                                                        className="rounded-lg border border-red-500/20 bg-red-500/5 p-4"
                                                    >
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div>
                                                                <p className="font-medium text-slate-200">
                                                                    {task?.title ||
                                                                        task?.name ||
                                                                        task?.taskName ||
                                                                        "Unnamed Task"}
                                                                </p>

                                                                <p className="mt-1 text-xs text-red-400">
                                                                    Deadline:{" "}
                                                                    {formatDate(
                                                                        task?.deadline ??
                                                                            task?.dueDate ??
                                                                            task?.endDate
                                                                    )}
                                                                </p>
                                                            </div>

                                                            <StatusBadge
                                                                status={
                                                                    task?.status
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ======================================
                            BLOCKED TASKS
                        ====================================== */}

                        <div className="mb-6 rounded-xl border border-slate-700 bg-slate-800/70 p-6">
                            <div className="mb-5 flex items-center gap-2">
                                <XCircle
                                    size={19}
                                    className="text-red-400"
                                />

                                <h2 className="font-semibold">
                                    Blocked Tasks
                                </h2>
                            </div>

                            {blockedTasks.length ===
                            0 ? (
                                <EmptyState
                                    icon={
                                        CheckCircle2
                                    }
                                    title="No blocked tasks"
                                    description="No tasks are currently marked as blocked."
                                />
                            ) : (
                                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                                    {blockedTasks.map(
                                        (
                                            task,
                                            index
                                        ) => (
                                            <div
                                                key={`${getId(task)}-${index}`}
                                                className="rounded-lg border border-red-500/20 bg-red-500/5 p-4"
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <p className="font-medium text-slate-200">
                                                        {task?.title ||
                                                            task?.name ||
                                                            task?.taskName ||
                                                            "Unnamed Task"}
                                                    </p>

                                                    <XCircle
                                                        size={17}
                                                        className="shrink-0 text-red-400"
                                                    />
                                                </div>

                                                <div className="mt-3">
                                                    <StatusBadge
                                                        status={
                                                            task?.status
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                        </div>

                        {/* ======================================
                            PROJECT ACTIVITY
                        ====================================== */}

                        <div className="mb-6 rounded-xl border border-slate-700 bg-slate-800/70 p-6">
                            <div className="mb-5 flex items-center gap-2">
                                <Activity
                                    size={19}
                                    className="text-blue-400"
                                />

                                <h2 className="font-semibold">
                                    Project Activity
                                </h2>
                            </div>

                            {activities.length ===
                            0 ? (
                                <EmptyState
                                    icon={
                                        Activity
                                    }
                                    title="No project activity"
                                    description="No activity or audit records are currently associated with this project."
                                />
                            ) : (
                                <div className="space-y-3">
                                    {activities.map(
                                        (
                                            activity,
                                            index
                                        ) => (
                                            <div
                                                key={`${activity?.id || "activity"}-${index}`}
                                                className="flex gap-4 rounded-lg bg-slate-900/60 p-4"
                                            >
                                                <div className="mt-1 rounded-full bg-blue-500/10 p-2 text-blue-400">
                                                    <Activity
                                                        size={
                                                            15
                                                        }
                                                    />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                                        <p className="font-medium text-slate-200">
                                                            {activity?.action ||
                                                                "Activity"}
                                                        </p>

                                                        <span className="text-xs text-slate-500">
                                                            {formatDateTime(
                                                                activity?.createdAt ??
                                                                    activity?.timestamp
                                                            )}
                                                        </span>
                                                    </div>

                                                    <p className="mt-1 text-sm text-slate-400">
                                                        {activity
                                                            ?.details
                                                            ?.description ||
                                                            activity?.description ||
                                                            `Performed by ${
                                                                activity?.performedBy ||
                                                                "Unknown User"
                                                            }`}
                                                    </p>

                                                    {activity?.performedBy && (
                                                        <p className="mt-2 text-xs text-slate-500">
                                                            Performed by:{" "}
                                                            <span className="text-slate-400">
                                                                {
                                                                    activity.performedBy
                                                                }
                                                            </span>
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                        </div>

                        {/* ======================================
                            LAST UPDATED
                        ====================================== */}

                        <div className="flex items-center justify-between border-t border-slate-800 pt-4 text-xs text-slate-500">
                            <span>
                                Dashboard is read-only and does not modify project data.
                            </span>

                            <span>
                                Last updated:{" "}
                                {formatDateTime(
                                    lastUpdated
                                )}
                            </span>
                        </div>
                    </>
                )}
        </div>
    );
}