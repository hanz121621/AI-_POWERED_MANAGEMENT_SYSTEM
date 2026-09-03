import { useEffect, useMemo, useState } from "react";
import {
    Activity,
    AlertCircle,
    CheckCircle2,
    Clock3,
    Loader2,
    Target,
    TrendingUp,
    UserRound,
    XCircle,
} from "lucide-react";

import api from "@/services/api";

const STATUS = {
    TODO: 1,
    IN_PROGRESS: 2,
    IN_REVIEW: 3,
    COMPLETED: 4,
    BLOCKED: 5,
};

const STATUS_CONFIG = {
    [STATUS.TODO]: {
        label: "To Do",
        icon: Clock3,
    },
    [STATUS.IN_PROGRESS]: {
        label: "In Progress",
        icon: Activity,
    },
    [STATUS.IN_REVIEW]: {
        label: "In Review",
        icon: Target,
    },
    [STATUS.COMPLETED]: {
        label: "Completed",
        icon: CheckCircle2,
    },
    [STATUS.BLOCKED]: {
        label: "Blocked",
        icon: XCircle,
    },
};

function getValue(object, ...keys) {
    for (const key of keys) {
        if (
            object &&
            object[key] !== undefined &&
            object[key] !== null
        ) {
            return object[key];
        }
    }

    return undefined;
}

function getTasksFromResponse(response) {
    const data = response?.data;

    if (Array.isArray(data)) {
        return data;
    }

    if (Array.isArray(data?.items)) {
        return data.items;
    }

    if (Array.isArray(data?.tasks)) {
        return data.tasks;
    }

    if (Array.isArray(data?.data)) {
        return data.data;
    }

    if (Array.isArray(data?.results)) {
        return data.results;
    }

    return [];
}

function normalizeTask(task) {
    const rawStatus = getValue(task, "status", "Status");

    const status =
        typeof rawStatus === "object"
            ? Number(
                  getValue(
                      rawStatus,
                      "value",
                      "Value",
                      "id",
                      "Id"
                  )
              )
            : Number(rawStatus);

    const estimatedHours = Number(
        getValue(
            task,
            "estimatedHours",
            "EstimatedHours"
        ) ?? 0
    );

    const actualHours = Number(
        getValue(
            task,
            "actualHours",
            "ActualHours"
        ) ?? 0
    );

    const createdAt = getValue(
        task,
        "createdAt",
        "CreatedAt"
    );

    const updatedAt = getValue(
        task,
        "updatedAt",
        "UpdatedAt"
    );

    const dueDate = getValue(
        task,
        "dueDate",
        "DueDate"
    );

    return {
        id: getValue(task, "id", "Id"),
        title:
            getValue(task, "title", "Title") ||
            "Untitled Task",

        description:
            getValue(
                task,
                "description",
                "Description"
            ) || "",

        status: Number.isFinite(status) ? status : 0,

        priority: getValue(
            task,
            "priority",
            "Priority"
        ),

        estimatedHours,
        actualHours,

        dueDate,
        createdAt,
        updatedAt,

        sprintId: getValue(
            task,
            "sprintId",
            "SprintId"
        ),

        projectId: getValue(
            task,
            "projectId",
            "ProjectId"
        ),

        projectName:
            getValue(
                task,
                "projectName",
                "ProjectName"
            ) || "Project",

        sprintName:
            getValue(
                task,
                "sprintName",
                "SprintName"
            ) || "Sprint",
    };
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

function getStatusLabel(status) {
    return (
        STATUS_CONFIG[status]?.label ||
        "Unknown"
    );
}

function getPriorityLabel(priority) {
    const value =
        typeof priority === "object"
            ? getValue(
                  priority,
                  "value",
                  "Value",
                  "id",
                  "Id"
              )
            : priority;

    const numericPriority = Number(value);

    switch (numericPriority) {
        case 0:
            return "Critical";

        case 1:
            return "High";

        case 2:
            return "Medium";

        case 3:
            return "Low";

        default:
            return priority || "Normal";
    }
}

function getStatusClasses(status) {
    switch (status) {
        case STATUS.COMPLETED:
            return "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400";

        case STATUS.IN_PROGRESS:
            return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400";

        case STATUS.IN_REVIEW:
            return "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400";

        case STATUS.BLOCKED:
            return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400";

        default:
            return "bg-muted text-muted-foreground";
    }
}

function getPriorityClasses(priority) {
    const label = getPriorityLabel(priority);

    switch (label) {
        case "Critical":
            return "text-red-600 dark:text-red-400";

        case "High":
            return "text-orange-600 dark:text-orange-400";

        case "Medium":
            return "text-yellow-600 dark:text-yellow-400";

        case "Low":
            return "text-green-600 dark:text-green-400";

        default:
            return "text-muted-foreground";
    }
}

function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
}) {
    return (
        <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">
                        {title}
                    </p>

                    <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                        {value}
                    </p>

                    {subtitle && (
                        <p className="mt-1 text-xs text-muted-foreground">
                            {subtitle}
                        </p>
                    )}
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                </div>
            </div>
        </div>
    );
}

function ProgressBar({ value }) {
    const safeValue = Math.max(
        0,
        Math.min(100, Number(value) || 0)
    );

    return (
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{
                    width: `${safeValue}%`,
                }}
            />
        </div>
    );
}

export default function ViewPersonalPerformance() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let mounted = true;

        async function loadPerformance() {
            try {
                setLoading(true);
                setError("");

                const response =
                    await api.get("/tasks/my-work");

                const taskData =
                    getTasksFromResponse(response)
                        .map(normalizeTask);

                if (mounted) {
                    setTasks(taskData);
                }
            } catch (err) {
                console.error(
                    "Failed to load personal performance:",
                    err
                );

                if (mounted) {
                    setError(
                        err?.response?.data?.message ||
                            err?.response?.data?.title ||
                            "Unable to load your performance report."
                    );
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        loadPerformance();

        return () => {
            mounted = false;
        };
    }, []);

    const statistics = useMemo(() => {
        const total = tasks.length;

        const completed = tasks.filter(
            (task) =>
                task.status === STATUS.COMPLETED
        ).length;

        const inProgress = tasks.filter(
            (task) =>
                task.status === STATUS.IN_PROGRESS
        ).length;

        const inReview = tasks.filter(
            (task) =>
                task.status === STATUS.IN_REVIEW
        ).length;

        const blocked = tasks.filter(
            (task) =>
                task.status === STATUS.BLOCKED
        ).length;

        const todo = tasks.filter(
            (task) =>
                task.status === STATUS.TODO
        ).length;

        const completionRate =
            total > 0
                ? Math.round(
                      (completed / total) * 100
                  )
                : 0;

        const estimatedHours = tasks.reduce(
            (sum, task) =>
                sum +
                (Number(task.estimatedHours) || 0),
            0
        );

        const actualHours = tasks.reduce(
            (sum, task) =>
                sum +
                (Number(task.actualHours) || 0),
            0
        );

        const remainingHours = Math.max(
            estimatedHours - actualHours,
            0
        );

        const sprintIds = [
            ...new Set(
                tasks
                    .map((task) => task.sprintId)
                    .filter(
                        (value) =>
                            value !== undefined &&
                            value !== null
                    )
            ),
        ];

        const projectIds = [
            ...new Set(
                tasks
                    .map((task) => task.projectId)
                    .filter(
                        (value) =>
                            value !== undefined &&
                            value !== null
                    )
            ),
        ];

        return {
            total,
            completed,
            inProgress,
            inReview,
            blocked,
            todo,
            completionRate,
            estimatedHours,
            actualHours,
            remainingHours,
            sprintCount: sprintIds.length,
            projectCount: projectIds.length,
        };
    }, [tasks]);

    const recentCompletedTasks = useMemo(() => {
        return tasks
            .filter(
                (task) =>
                    task.status === STATUS.COMPLETED
            )
            .sort((a, b) => {
                const dateA = new Date(
                    a.updatedAt ||
                        a.createdAt ||
                        0
                ).getTime();

                const dateB = new Date(
                    b.updatedAt ||
                        b.createdAt ||
                        0
                ).getTime();

                return dateB - dateA;
            })
            .slice(0, 5);
    }, [tasks]);

    const recentTasks = useMemo(() => {
        return [...tasks]
            .sort((a, b) => {
                const dateA = new Date(
                    a.updatedAt ||
                        a.createdAt ||
                        0
                ).getTime();

                const dateB = new Date(
                    b.updatedAt ||
                        b.createdAt ||
                        0
                ).getTime();

                return dateB - dateA;
            })
            .slice(0, 8);
    }, [tasks]);

    const workloadPercentage = useMemo(() => {
        if (
            statistics.estimatedHours <= 0
        ) {
            return 0;
        }

        return Math.min(
            Math.round(
                (statistics.actualHours /
                    statistics.estimatedHours) *
                    100
            ),
            100
        );
    }, [statistics]);

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />

                    <p className="text-sm">
                        Loading your performance report...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
                <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                        <AlertCircle className="h-5 w-5" />
                    </div>

                    <div>
                        <h3 className="font-semibold text-foreground">
                            Unable to load performance
                            report
                        </h3>

                        <p className="mt-1 text-sm text-muted-foreground">
                            {error}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="rounded-xl border border-border/70 bg-card p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <UserRound className="h-6 w-6" />
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-foreground">
                                    Personal Performance
                                </h2>

                                <p className="text-sm text-muted-foreground">
                                    Your work activity,
                                    progress and task
                                    performance
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg bg-primary/5 px-4 py-3">
                        <p className="text-xs font-medium text-muted-foreground">
                            Overall Completion
                        </p>

                        <p className="text-2xl font-bold text-primary">
                            {
                                statistics.completionRate
                            }
                            %
                        </p>
                    </div>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Assigned Tasks"
                    value={statistics.total}
                    subtitle={`${statistics.projectCount} project${
                        statistics.projectCount ===
                        1
                            ? ""
                            : "s"
                    }`}
                    icon={Target}
                />

                <StatCard
                    title="Completed"
                    value={statistics.completed}
                    subtitle={`${statistics.completionRate}% completion rate`}
                    icon={CheckCircle2}
                />

                <StatCard
                    title="In Progress"
                    value={statistics.inProgress}
                    subtitle={`${statistics.inReview} awaiting review`}
                    icon={Activity}
                />

                <StatCard
                    title="Blocked"
                    value={statistics.blocked}
                    subtitle={`${statistics.todo} still to do`}
                    icon={AlertCircle}
                />
            </div>

            {/* Performance + Workload */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Performance */}
                <div className="rounded-xl border border-border/70 bg-card p-6 shadow-sm">
                    <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <TrendingUp className="h-5 w-5" />
                        </div>

                        <div>
                            <h3 className="font-semibold text-foreground">
                                Performance Overview
                            </h3>

                            <p className="text-xs text-muted-foreground">
                                Current task status distribution
                            </p>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <span className="text-sm font-medium text-foreground">
                                    Completion Rate
                                </span>

                                <span className="text-sm font-semibold text-primary">
                                    {
                                        statistics.completionRate
                                    }
                                    %
                                </span>
                            </div>

                            <ProgressBar
                                value={
                                    statistics.completionRate
                                }
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {[
                                {
                                    label: "To Do",
                                    value:
                                        statistics.todo,
                                    status:
                                        STATUS.TODO,
                                },
                                {
                                    label:
                                        "In Progress",
                                    value:
                                        statistics.inProgress,
                                    status:
                                        STATUS.IN_PROGRESS,
                                },
                                {
                                    label:
                                        "In Review",
                                    value:
                                        statistics.inReview,
                                    status:
                                        STATUS.IN_REVIEW,
                                },
                                {
                                    label:
                                        "Completed",
                                    value:
                                        statistics.completed,
                                    status:
                                        STATUS.COMPLETED,
                                },
                            ].map((item) => {
                                const Icon =
                                    STATUS_CONFIG[
                                        item.status
                                    ]?.icon ||
                                    Activity;

                                return (
                                    <div
                                        key={
                                            item.label
                                        }
                                        className="rounded-lg border border-border/60 p-3"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Icon className="h-4 w-4 text-muted-foreground" />

                                                <span className="text-xs text-muted-foreground">
                                                    {
                                                        item.label
                                                    }
                                                </span>
                                            </div>

                                            <span className="font-semibold text-foreground">
                                                {
                                                    item.value
                                                }
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Workload */}
                <div className="rounded-xl border border-border/70 bg-card p-6 shadow-sm">
                    <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                            <Clock3 className="h-5 w-5" />
                        </div>

                        <div>
                            <h3 className="font-semibold text-foreground">
                                Workload Summary
                            </h3>

                            <p className="text-xs text-muted-foreground">
                                Estimated versus recorded work
                            </p>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    Work Recorded
                                </span>

                                <span className="text-sm font-semibold text-foreground">
                                    {
                                        statistics.actualHours
                                    }
                                    h /{" "}
                                    {
                                        statistics.estimatedHours
                                    }
                                    h
                                </span>
                            </div>

                            <ProgressBar
                                value={
                                    workloadPercentage
                                }
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-lg bg-muted/50 p-4">
                                <p className="text-xs text-muted-foreground">
                                    Estimated Hours
                                </p>

                                <p className="mt-1 text-lg font-bold text-foreground">
                                    {
                                        statistics.estimatedHours
                                    }
                                    h
                                </p>
                            </div>

                            <div className="rounded-lg bg-muted/50 p-4">
                                <p className="text-xs text-muted-foreground">
                                    Actual Hours
                                </p>

                                <p className="mt-1 text-lg font-bold text-foreground">
                                    {
                                        statistics.actualHours
                                    }
                                    h
                                </p>
                            </div>

                            <div className="rounded-lg bg-muted/50 p-4">
                                <p className="text-xs text-muted-foreground">
                                    Remaining
                                </p>

                                <p className="mt-1 text-lg font-bold text-foreground">
                                    {
                                        statistics.remainingHours
                                    }
                                    h
                                </p>
                            </div>

                            <div className="rounded-lg bg-muted/50 p-4">
                                <p className="text-xs text-muted-foreground">
                                    Sprints
                                </p>

                                <p className="mt-1 text-lg font-bold text-foreground">
                                    {
                                        statistics.sprintCount
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recently Completed */}
            <div className="rounded-xl border border-border/70 bg-card shadow-sm">
                <div className="border-b border-border/70 p-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10 text-green-600 dark:text-green-400">
                            <CheckCircle2 className="h-5 w-5" />
                        </div>

                        <div>
                            <h3 className="font-semibold text-foreground">
                                Recently Completed
                            </h3>

                            <p className="text-xs text-muted-foreground">
                                Your latest completed tasks
                            </p>
                        </div>
                    </div>
                </div>

                {recentCompletedTasks.length ===
                0 ? (
                    <div className="p-8 text-center">
                        <CheckCircle2 className="mx-auto h-8 w-8 text-muted-foreground/50" />

                        <p className="mt-3 text-sm text-muted-foreground">
                            No completed tasks yet.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-border/60">
                        {recentCompletedTasks.map(
                            (task) => (
                                <div
                                    key={
                                        task.id ||
                                        task.title
                                    }
                                    className="flex flex-col gap-3 p-5 transition-colors hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />

                                            <p className="truncate font-medium text-foreground">
                                                {
                                                    task.title
                                                }
                                            </p>
                                        </div>

                                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                            <span>
                                                {
                                                    task.projectName
                                                }
                                            </span>

                                            <span>
                                                {
                                                    task.sprintName
                                                }
                                            </span>

                                            <span>
                                                Updated{" "}
                                                {
                                                    formatDate(
                                                        task.updatedAt
                                                    )
                                                }
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <span className="text-xs text-muted-foreground">
                                            {
                                                task.actualHours
                                            }
                                            h
                                        </span>

                                        <span
                                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                                                task.status
                                            )}`}
                                        >
                                            Completed
                                        </span>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                )}
            </div>

            {/* Task Activity */}
            <div className="rounded-xl border border-border/70 bg-card shadow-sm">
                <div className="border-b border-border/70 p-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Activity className="h-5 w-5" />
                        </div>

                        <div>
                            <h3 className="font-semibold text-foreground">
                                Recent Task Activity
                            </h3>

                            <p className="text-xs text-muted-foreground">
                                Latest updates from your assigned work
                            </p>
                        </div>
                    </div>
                </div>

                {recentTasks.length === 0 ? (
                    <div className="p-8 text-center">
                        <Target className="mx-auto h-8 w-8 text-muted-foreground/50" />

                        <p className="mt-3 text-sm text-muted-foreground">
                            No assigned tasks found.
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                            Tasks assigned to you will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[700px]">
                            <thead>
                                <tr className="border-b border-border/60 bg-muted/30">
                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                        Task
                                    </th>

                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                        Project
                                    </th>

                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                        Status
                                    </th>

                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                        Priority
                                    </th>

                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                        Due Date
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {recentTasks.map(
                                    (task) => (
                                        <tr
                                            key={
                                                task.id ||
                                                task.title
                                            }
                                            className="border-b border-border/50 last:border-0 hover:bg-muted/20"
                                        >
                                            <td className="px-5 py-4">
                                                <div>
                                                    <p className="max-w-[280px] truncate text-sm font-medium text-foreground">
                                                        {
                                                            task.title
                                                        }
                                                    </p>

                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        {
                                                            task.sprintName
                                                        }
                                                    </p>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4 text-sm text-muted-foreground">
                                                {
                                                    task.projectName
                                                }
                                            </td>

                                            <td className="px-5 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                                                        task.status
                                                    )}`}
                                                >
                                                    {getStatusLabel(
                                                        task.status
                                                    )}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4">
                                                <span
                                                    className={`text-sm font-medium ${getPriorityClasses(
                                                        task.priority
                                                    )}`}
                                                >
                                                    {getPriorityLabel(
                                                        task.priority
                                                    )}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4 text-sm text-muted-foreground">
                                                {formatDate(
                                                    task.dueDate
                                                )}
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Empty-state note */}
            {tasks.length === 0 && (
                <div className="rounded-xl border border-border/70 bg-card p-6 text-center shadow-sm">
                    <UserRound className="mx-auto h-9 w-9 text-muted-foreground/50" />

                    <h3 className="mt-3 font-semibold text-foreground">
                        No performance data yet
                    </h3>

                    <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
                        Your personal performance report
                        will automatically populate when
                        tasks are assigned to you.
                    </p>
                </div>
            )}
        </div>
    );
}