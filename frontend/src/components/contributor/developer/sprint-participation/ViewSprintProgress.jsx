import { useEffect, useMemo, useState } from "react";
import {
    Activity,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Flag,
    ListTodo,
    Target,
    Timer,
    TrendingUp,
} from "lucide-react";

import api from "@/services/api";

const STATUS_LABELS = {
    1: "To Do",
    2: "In Progress",
    3: "Review",
    4: "Completed",
    5: "Blocked",
};

const PRIORITY_LABELS = {
    0: "Critical",
    1: "High",
    2: "Medium",
    3: "Low",
};

const STATUS_CLASSES = {
    1: "bg-muted text-muted-foreground",
    2: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
    3: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-300",
    4: "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300",
    5: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300",
};

const PRIORITY_CLASSES = {
    0: "text-red-600 dark:text-red-400",
    1: "text-orange-600 dark:text-orange-400",
    2: "text-yellow-600 dark:text-yellow-400",
    3: "text-green-600 dark:text-green-400",
};

function getStatusLabel(status) {
    if (typeof status === "number") {
        return STATUS_LABELS[status] || "Unknown";
    }

    if (typeof status === "string") {
        const numericStatus = Number(status);

        if (!Number.isNaN(numericStatus) && STATUS_LABELS[numericStatus]) {
            return STATUS_LABELS[numericStatus];
        }

        const normalized = status.toLowerCase();

        if (normalized === "todo") return "To Do";
        if (normalized === "inprogress") return "In Progress";
        if (normalized === "inreview") return "Review";
        if (normalized === "completed") return "Completed";
        if (normalized === "blocked") return "Blocked";

        return status;
    }

    return "Unknown";
}

function getPriorityLabel(priority) {
    if (typeof priority === "number") {
        return PRIORITY_LABELS[priority] || "Unknown";
    }

    if (typeof priority === "string") {
        const numericPriority = Number(priority);

        if (
            !Number.isNaN(numericPriority) &&
            PRIORITY_LABELS[numericPriority]
        ) {
            return PRIORITY_LABELS[numericPriority];
        }

        return priority;
    }

    return "Unknown";
}

function getStatusClass(status) {
    const numericStatus =
        typeof status === "number" ? status : Number(status);

    return (
        STATUS_CLASSES[numericStatus] ||
        "bg-muted text-muted-foreground"
    );
}

function getPriorityClass(priority) {
    const numericPriority =
        typeof priority === "number" ? priority : Number(priority);

    return (
        PRIORITY_CLASSES[numericPriority] ||
        "text-muted-foreground"
    );
}

function getProgress(task) {
    const status =
        typeof task?.status === "number"
            ? task.status
            : Number(task?.status);

    if (status === 4) {
        return 100;
    }

    const estimated = Number(task?.estimatedHours || 0);
    const actual = Number(task?.actualHours || 0);

    if (estimated <= 0) {
        return 0;
    }

    return Math.min(
        100,
        Math.max(0, Math.round((actual / estimated) * 100))
    );
}

function formatDate(value) {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function getDaysRemaining(endDate) {
    if (!endDate) {
        return null;
    }

    const end = new Date(endDate);

    if (Number.isNaN(end.getTime())) {
        return null;
    }

    const today = new Date();

    today.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const difference = end.getTime() - today.getTime();

    return Math.ceil(
        difference / (1000 * 60 * 60 * 24)
    );
}

function normalizeSprints(response) {
    if (Array.isArray(response?.data)) {
        return response.data;
    }

    if (Array.isArray(response?.data?.sprints)) {
        return response.data.sprints;
    }

    if (Array.isArray(response?.sprints)) {
        return response.sprints;
    }

    if (Array.isArray(response)) {
        return response;
    }

    return [];
}

function normalizeProgress(response) {
    return response?.data ?? response ?? null;
}

function normalizeTasks(response) {
    const data = response?.data ?? response;

    if (Array.isArray(data)) {
        return data;
    }

    if (Array.isArray(data?.Tasks)) {
        return data.Tasks;
    }

    if (Array.isArray(data?.tasks)) {
        return data.tasks;
    }

    return [];
}

function normalizeSprintFromTaskResponse(response) {
    const data = response?.data ?? response;

    return data?.Sprint || data?.sprint || null;
}

export default function ViewSprintProgress() {
    const [sprints, setSprints] = useState([]);
    const [selectedSprintId, setSelectedSprintId] = useState("");
    const [sprint, setSprint] = useState(null);
    const [tasks, setTasks] = useState([]);

    const [progress, setProgress] = useState(null);

    const [loadingSprints, setLoadingSprints] = useState(true);
    const [loadingProgress, setLoadingProgress] = useState(false);
    const [error, setError] = useState("");

    /*
     * Load the contributor's sprints.
     *
     * Existing backend endpoint:
     * GET /api/Sprint/my-sprints
     */
    useEffect(() => {
        let cancelled = false;

        const loadSprints = async () => {
            setLoadingSprints(true);
            setError("");

            try {
                const response = await api.get("/Sprint/my-sprints");

                if (cancelled) {
                    return;
                }

                const loadedSprints = normalizeSprints(response);

                setSprints(loadedSprints);

                if (loadedSprints.length > 0) {
                    const firstSprint = loadedSprints[0];

                    setSelectedSprintId(
                        String(firstSprint.id)
                    );
                }
            } catch (err) {
                if (cancelled) {
                    return;
                }

                console.error(
                    "Failed to load contributor sprints:",
                    err
                );

                setSprints([]);
                setError(
                    err?.response?.data?.message ||
                        "Unable to load sprint information. Please try again."
                );
            } finally {
                if (!cancelled) {
                    setLoadingSprints(false);
                }
            }
        };

        loadSprints();

        return () => {
            cancelled = true;
        };
    }, []);

    /*
     * The selected sprint is derived from the sprint list.
     *
     * This avoids calling setState synchronously when
     * selectedSprintId changes and fixes:
     *
     * react-hooks/set-state-in-effect
     */
    const selectedSprint = useMemo(() => {
        if (!selectedSprintId) {
            return null;
        }

        return (
            sprints.find(
                (item) =>
                    String(item.id) ===
                    String(selectedSprintId)
            ) || null
        );
    }, [sprints, selectedSprintId]);

    /*
     * Load the selected sprint's tasks.
     *
     * Existing backend endpoint:
     * GET /api/Sprint/my-sprints/{sprintId}
     */
    useEffect(() => {
        if (!selectedSprintId) {
            return;
        }

        let cancelled = false;

        const loadSprintTasks = async () => {
            setLoadingProgress(true);

            try {
                const response = await api.get(
                    `/Sprint/my-sprints/${selectedSprintId}`
                );

                if (cancelled) {
                    return;
                }

                const loadedTasks = normalizeTasks(response);
                const returnedSprint =
                    normalizeSprintFromTaskResponse(response);

                setTasks(loadedTasks);

                if (returnedSprint) {
                    setSprint(returnedSprint);
                }
            } catch (err) {
                if (cancelled) {
                    return;
                }

                console.error(
                    "Failed to load sprint tasks:",
                    err
                );

                setTasks([]);

                /*
                 * Do not overwrite the main page error
                 * for a missing task list. The progress
                 * endpoint below provides the main state.
                 */
            }
        };

        loadSprintTasks();

        return () => {
            cancelled = true;
        };
    }, [selectedSprintId]);

    /*
     * Load selected sprint progress.
     *
     * Existing backend endpoint:
     * GET /api/Sprint/my-sprints/{sprintId}/progress
     */
    useEffect(() => {
        if (!selectedSprintId) {
            return;
        }

        let cancelled = false;

        const loadProgress = async () => {
            setLoadingProgress(true);
            setError("");

            try {
                const response = await api.get(
                    `/Sprint/my-sprints/${selectedSprintId}/progress`
                );

                if (cancelled) {
                    return;
                }

                const loadedProgress =
                    normalizeProgress(response);

                setProgress(loadedProgress);

                /*
                 * The progress response contains the
                 * authoritative sprint information.
                 */
                if (loadedProgress) {
                    setSprint((currentSprint) => ({
                        ...(currentSprint || {}),
                        id:
                            loadedProgress.sprintId ||
                            currentSprint?.id,

                        projectId:
                            loadedProgress.projectId ??
                            currentSprint?.projectId,

                        name:
                            loadedProgress.sprintName ||
                            currentSprint?.name,

                        goal:
                            loadedProgress.goal ??
                            currentSprint?.goal,

                        status:
                            loadedProgress.status ??
                            currentSprint?.status,

                        teamId:
                            loadedProgress.teamId ??
                            currentSprint?.teamId,
                    }));
                }
            } catch (err) {
                if (cancelled) {
                    return;
                }

                console.error(
                    "Failed to load sprint progress:",
                    err
                );

                setProgress(null);

                setError(
                    err?.response?.data?.message ||
                        "Unable to load sprint progress. Please try again."
                );
            } finally {
                if (!cancelled) {
                    setLoadingProgress(false);
                }
            }
        };

        loadProgress();

        return () => {
            cancelled = true;
        };
    }, [selectedSprintId]);

    /*
     * Use the sprint returned by the API when available.
     * Otherwise use the selected sprint from the list.
     */
    const displayedSprint = useMemo(() => {
        if (sprint) {
            return {
                ...selectedSprint,
                ...sprint,
            };
        }

        return selectedSprint;
    }, [sprint, selectedSprint]);

    const statistics = useMemo(() => {
        if (progress) {
            return {
                total:
                    Number(progress.totalTasks) || 0,

                completed:
                    Number(progress.completedTasks) || 0,

                inProgress:
                    Number(progress.inProgressTasks) || 0,

                pending:
                    Number(progress.pendingTasks) || 0,

                review:
                    Number(progress.inReviewTasks) || 0,

                blocked:
                    Number(progress.blockedTasks) || 0,

                overdue:
                    Number(progress.overdueTasks) || 0,

                completion:
                    Number(
                        progress.completionPercentage
                    ) || 0,

                teamProgress:
                    Number(
                        progress.teamProgressPercentage
                    ) || 0,
            };
        }

        const total = tasks.length;

        const completed = tasks.filter(
            (task) =>
                Number(task.status) === 4 ||
                String(task.status).toLowerCase() ===
                    "completed"
        ).length;

        const inProgress = tasks.filter(
            (task) =>
                Number(task.status) === 2 ||
                String(task.status).toLowerCase() ===
                    "inprogress"
        ).length;

        const pending = tasks.filter(
            (task) =>
                Number(task.status) === 1 ||
                String(task.status).toLowerCase() ===
                    "todo"
        ).length;

        const review = tasks.filter(
            (task) =>
                Number(task.status) === 3 ||
                String(task.status).toLowerCase() ===
                    "inreview"
        ).length;

        const blocked = tasks.filter(
            (task) =>
                Number(task.status) === 5 ||
                String(task.status).toLowerCase() ===
                    "blocked"
        ).length;

        const overdue = tasks.filter((task) => {
            if (!task.dueDate) {
                return false;
            }

            const dueDate = new Date(task.dueDate);

            return (
                dueDate < new Date() &&
                Number(task.status) !== 4
            );
        }).length;

        const completion =
            total === 0
                ? 0
                : Math.round(
                      (completed / total) * 100
                  );

        return {
            total,
            completed,
            inProgress,
            pending,
            review,
            blocked,
            overdue,
            completion,
            teamProgress: completion,
        };
    }, [progress, tasks]);

    const daysRemaining = useMemo(() => {
        return getDaysRemaining(
            displayedSprint?.endDate
        );
    }, [displayedSprint?.endDate]);

    const sprintStatus = getStatusLabel(
        displayedSprint?.status
    );

    const hasSprints = sprints.length > 0;

    if (loadingSprints) {
        return (
            <div className="flex min-h-75 items-center justify-center rounded-xl border border-border/70 bg-card shadow-sm">
                <div className="flex items-center gap-3 text-muted-foreground">
                    <Activity className="h-5 w-5 animate-pulse" />
                    <span>Loading sprint progress...</span>
                </div>
            </div>
        );
    }

    if (!hasSprints) {
        return (
            <div className="rounded-xl border border-border/70 bg-card p-8 shadow-sm">
                <div className="mx-auto flex max-w-70 flex-col items-center text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                        <Timer className="h-7 w-7 text-primary" />
                    </div>

                    <h3 className="text-lg font-semibold text-foreground">
                        No active sprint available
                    </h3>

                    <p className="mt-2 text-sm text-muted-foreground">
                        You currently do not have any sprint
                        tasks assigned to you.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Sprint selector */}
            <div className="rounded-xl border border-border/70 bg-card p-4 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <Timer className="h-5 w-5 text-primary" />

                            <h3 className="font-semibold text-foreground">
                                Sprint Progress
                            </h3>
                        </div>

                        <p className="mt-1 text-sm text-muted-foreground">
                            View your assigned sprint progress
                            and current sprint status.
                        </p>
                    </div>

                    <select
                        value={selectedSprintId}
                        onChange={(event) =>
                            setSelectedSprintId(
                                event.target.value
                            )
                        }
                        className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                        {sprints.map((item) => (
                            <option
                                key={item.id}
                                value={item.id}
                            >
                                {item.name || "Sprint"}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
                    {error}
                </div>
            )}

            {/* Sprint header */}
            <div className="rounded-xl border border-border/70 bg-card p-6 shadow-sm">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                                Sprint
                            </span>

                            <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                                {sprintStatus}
                            </span>
                        </div>

                        <h2 className="text-2xl font-bold tracking-tight text-foreground">
                            {displayedSprint?.name ||
                                "Current Sprint"}
                        </h2>

                        <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                            {displayedSprint?.goal ||
                                "No sprint goal has been provided."}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        <div className="rounded-lg border border-border/70 bg-background px-4 py-3">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <CalendarDays className="h-4 w-4" />
                                Start
                            </div>

                            <p className="mt-1 text-sm font-semibold text-foreground">
                                {formatDate(
                                    displayedSprint?.startDate
                                )}
                            </p>
                        </div>

                        <div className="rounded-lg border border-border/70 bg-background px-4 py-3">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Flag className="h-4 w-4" />
                                End
                            </div>

                            <p className="mt-1 text-sm font-semibold text-foreground">
                                {formatDate(
                                    displayedSprint?.endDate
                                )}
                            </p>
                        </div>

                        <div className="rounded-lg border border-border/70 bg-background px-4 py-3">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock3 className="h-4 w-4" />
                                Remaining
                            </div>

                            <p className="mt-1 text-sm font-semibold text-foreground">
                                {daysRemaining === null
                                    ? "—"
                                    : daysRemaining < 0
                                    ? "Ended"
                                    : `${daysRemaining} day${
                                          daysRemaining ===
                                          1
                                              ? ""
                                              : "s"
                                      }`}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary cards */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <ListTodo className="h-5 w-5 text-primary" />
                        </div>

                        <span className="text-xs text-muted-foreground">
                            Total
                        </span>
                    </div>

                    <p className="mt-4 text-2xl font-bold text-foreground">
                        {statistics.total}
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Sprint tasks
                    </p>
                </div>

                <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-950/40">
                            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>

                        <span className="text-xs text-muted-foreground">
                            Completed
                        </span>
                    </div>

                    <p className="mt-4 text-2xl font-bold text-foreground">
                        {statistics.completed}
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Finished tasks
                    </p>
                </div>

                <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950/40">
                            <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>

                        <span className="text-xs text-muted-foreground">
                            In Progress
                        </span>
                    </div>

                    <p className="mt-4 text-2xl font-bold text-foreground">
                        {statistics.inProgress}
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Active tasks
                    </p>
                </div>

                <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <Target className="h-5 w-5 text-primary" />
                        </div>

                        <span className="text-xs text-muted-foreground">
                            Completion
                        </span>
                    </div>

                    <p className="mt-4 text-2xl font-bold text-foreground">
                        {Math.round(
                            statistics.completion
                        )}
                        %
                    </p>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                        <div
                            className="h-full rounded-full bg-primary transition-all duration-500"
                            style={{
                                width: `${Math.min(
                                    100,
                                    Math.max(
                                        0,
                                        statistics.completion
                                    )
                                )}%`,
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Progress overview */}
            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-xl border border-border/70 bg-card p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-foreground">
                                Sprint Completion
                            </h3>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Overall progress based on sprint
                                tasks.
                            </p>
                        </div>

                        <div className="text-right">
                            <p className="text-2xl font-bold text-primary">
                                {Math.round(
                                    statistics.completion
                                )}
                                %
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 h-3 overflow-hidden rounded-full bg-muted">
                        <div
                            className="h-full rounded-full bg-primary transition-all duration-500"
                            style={{
                                width: `${Math.min(
                                    100,
                                    Math.max(
                                        0,
                                        statistics.completion
                                    )
                                )}%`,
                            }}
                        />
                    </div>

                    <div className="mt-4 flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                            {statistics.completed} of{" "}
                            {statistics.total} completed
                        </span>

                        <span className="font-medium text-foreground">
                            {Math.max(
                                0,
                                statistics.total -
                                    statistics.completed
                            )}{" "}
                            remaining
                        </span>
                    </div>
                </div>

                <div className="rounded-xl border border-border/70 bg-card p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-foreground">
                                Team Progress
                            </h3>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Progress reported by the sprint
                                backend.
                            </p>
                        </div>

                        <div className="text-right">
                            <p className="text-2xl font-bold text-primary">
                                {Math.round(
                                    statistics.teamProgress
                                )}
                                %
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 h-3 overflow-hidden rounded-full bg-muted">
                        <div
                            className="h-full rounded-full bg-primary transition-all duration-500"
                            style={{
                                width: `${Math.min(
                                    100,
                                    Math.max(
                                        0,
                                        statistics.teamProgress
                                    )
                                )}%`,
                            }}
                        />
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                        <Activity className="h-4 w-4" />
                        <span>
                            Team progress is based on the sprint
                            task completion returned by the
                            backend.
                        </span>
                    </div>
                </div>
            </div>

            {/* Task breakdown */}
            <div className="rounded-xl border border-border/70 bg-card p-6 shadow-sm">
                <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />

                    <div>
                        <h3 className="font-semibold text-foreground">
                            Task Breakdown
                        </h3>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Current sprint task distribution.
                        </p>
                    </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="flex items-center justify-between rounded-lg border border-border/70 bg-background px-4 py-3">
                        <span className="text-sm text-muted-foreground">
                            To Do
                        </span>

                        <span className="font-semibold text-foreground">
                            {statistics.pending}
                        </span>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-border/70 bg-background px-4 py-3">
                        <span className="text-sm text-muted-foreground">
                            In Progress
                        </span>

                        <span className="font-semibold text-foreground">
                            {statistics.inProgress}
                        </span>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-border/70 bg-background px-4 py-3">
                        <span className="text-sm text-muted-foreground">
                            Review
                        </span>

                        <span className="font-semibold text-foreground">
                            {statistics.review}
                        </span>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-border/70 bg-background px-4 py-3">
                        <span className="text-sm text-muted-foreground">
                            Completed
                        </span>

                        <span className="font-semibold text-green-600 dark:text-green-400">
                            {statistics.completed}
                        </span>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-border/70 bg-background px-4 py-3">
                        <span className="text-sm text-muted-foreground">
                            Blocked
                        </span>

                        <span className="font-semibold text-red-600 dark:text-red-400">
                            {statistics.blocked}
                        </span>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-border/70 bg-background px-4 py-3">
                        <span className="text-sm text-muted-foreground">
                            Overdue
                        </span>

                        <span className="font-semibold text-orange-600 dark:text-orange-400">
                            {statistics.overdue}
                        </span>
                    </div>
                </div>
            </div>

            {/* Assigned tasks */}
            <div className="rounded-xl border border-border/70 bg-card shadow-sm">
                <div className="border-b border-border/70 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-foreground">
                                My Sprint Tasks
                            </h3>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Tasks assigned to you in this
                                sprint.
                            </p>
                        </div>

                        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                            {tasks.length} task
                            {tasks.length === 1 ? "" : "s"}
                        </span>
                    </div>
                </div>

                {loadingProgress ? (
                    <div className="flex min-h-75 items-center justify-center">
                        <div className="flex items-center gap-3 text-muted-foreground">
                            <Activity className="h-5 w-5 animate-pulse" />
                            <span>
                                Loading sprint progress...
                            </span>
                        </div>
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="p-8 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                            <ListTodo className="h-6 w-6 text-muted-foreground" />
                        </div>

                        <h4 className="mt-4 font-medium text-foreground">
                            No sprint tasks assigned
                        </h4>

                        <p className="mt-1 text-sm text-muted-foreground">
                            No tasks are currently assigned to
                            you for this sprint.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-border/70">
                        {tasks.map((task) => {
                            const taskProgress =
                                getProgress(task);

                            return (
                                <div
                                    key={task.id}
                                    className="p-5 transition-colors hover:bg-muted/30"
                                >
                                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h4 className="font-medium text-foreground">
                                                    {task.title ||
                                                        "Untitled task"}
                                                </h4>

                                                <span
                                                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
                                                        task.status
                                                    )}`}
                                                >
                                                    {getStatusLabel(
                                                        task.status
                                                    )}
                                                </span>
                                            </div>

                                            {task.description && (
                                                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                                                    {
                                                        task.description
                                                    }
                                                </p>
                                            )}

                                            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
                                                <span>
                                                    Priority:{" "}
                                                    <strong
                                                        className={getPriorityClass(
                                                            task.priority
                                                        )}
                                                    >
                                                        {getPriorityLabel(
                                                            task.priority
                                                        )}
                                                    </strong>
                                                </span>

                                                <span>
                                                    Due:{" "}
                                                    <strong className="font-medium text-foreground">
                                                        {formatDate(
                                                            task.dueDate
                                                        )}
                                                    </strong>
                                                </span>

                                                <span>
                                                    Hours:{" "}
                                                    <strong className="font-medium text-foreground">
                                                        {Number(
                                                            task.actualHours ||
                                                                0
                                                        )}
                                                        /
                                                        {Number(
                                                            task.estimatedHours ||
                                                                0
                                                        )}
                                                    </strong>
                                                </span>
                                            </div>
                                        </div>

                                        <div className="w-full lg:max-w-70">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-muted-foreground">
                                                    Progress
                                                </span>

                                                <span className="font-medium text-foreground">
                                                    {
                                                        taskProgress
                                                    }
                                                    %
                                                </span>
                                            </div>

                                            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                                                <div
                                                    className="h-full rounded-full bg-primary transition-all duration-500"
                                                    style={{
                                                        width: `${taskProgress}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Sprint details */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <CalendarDays className="h-5 w-5 text-primary" />
                        </div>

                        <div>
                            <p className="text-xs text-muted-foreground">
                                Sprint Duration
                            </p>

                            <p className="mt-1 text-sm font-semibold text-foreground">
                                {formatDate(
                                    displayedSprint?.startDate
                                )}{" "}
                                –{" "}
                                {formatDate(
                                    displayedSprint?.endDate
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950/40">
                            <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>

                        <div>
                            <p className="text-xs text-muted-foreground">
                                Sprint Status
                            </p>

                            <p className="mt-1 text-sm font-semibold text-foreground">
                                {sprintStatus}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-950/40">
                            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>

                        <div>
                            <p className="text-xs text-muted-foreground">
                                Completed Work
                            </p>

                            <p className="mt-1 text-sm font-semibold text-foreground">
                                {statistics.completed} of{" "}
                                {statistics.total} tasks
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}