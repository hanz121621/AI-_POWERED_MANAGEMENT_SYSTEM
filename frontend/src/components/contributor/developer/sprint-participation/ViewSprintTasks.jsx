import { useEffect, useMemo, useState } from "react";
import {
    Target,
    CalendarDays,
    CheckCircle2,
    Clock3,
    AlertCircle,
    Eye,
    TrendingUp,
    ListTodo,
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

function getStatusLabel(status) {
    if (typeof status === "number") {
        return STATUS_LABELS[status] || "Unknown";
    }

    if (typeof status === "string") {
        const numericStatus = Number(status);

        if (
            !Number.isNaN(numericStatus) &&
            STATUS_LABELS[numericStatus]
        ) {
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

function getStatusClasses(status) {
    switch (getStatusLabel(status)) {
        case "Completed":
            return "bg-green-100 text-green-700";

        case "In Progress":
            return "bg-blue-100 text-blue-700";

        case "Review":
            return "bg-purple-100 text-purple-700";

        case "Blocked":
            return "bg-red-100 text-red-700";

        default:
            return "bg-gray-100 text-gray-700";
    }
}

function formatDate(date) {
    if (!date) {
        return "—";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "—";
    }

    return parsedDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function calculateTaskProgress(task) {
    const status =
        typeof task?.status === "number"
            ? task.status
            : Number(task?.status);

    if (status === 4) {
        return 100;
    }

    const estimatedHours = Number(task?.estimatedHours || 0);
    const actualHours = Number(task?.actualHours || 0);

    if (estimatedHours <= 0) {
        return 0;
    }

    return Math.min(
        100,
        Math.max(
            0,
            Math.round(
                (actualHours / estimatedHours) * 100
            )
        )
    );
}

function normalizeSprints(response) {
    const data = response?.data ?? response;

    if (Array.isArray(data)) {
        return data;
    }

    if (Array.isArray(data?.sprints)) {
        return data.sprints;
    }

    return [];
}

function normalizeSprintDetails(response) {
    const data = response?.data ?? response;

    return {
        sprint:
            data?.Sprint ||
            data?.sprint ||
            null,

        tasks:
            Array.isArray(data?.Tasks)
                ? data.Tasks
                : Array.isArray(data?.tasks)
                    ? data.tasks
                    : [],
    };
}

export default function ViewSprintTask() {
    const [sprints, setSprints] = useState([]);
    const [selectedSprintId, setSelectedSprintId] =
        useState("");

    const [sprint, setSprint] = useState(null);
    const [tasks, setTasks] = useState([]);

    const [loadingSprints, setLoadingSprints] =
        useState(true);

    const [loadingTasks, setLoadingTasks] =
        useState(false);

    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function loadSprints() {
            setLoadingSprints(true);
            setError("");

            try {
                const response = await api.get(
                    "/Sprint/my-sprints"
                );

                if (cancelled) {
                    return;
                }

                const loadedSprints =
                    normalizeSprints(response);

                setSprints(loadedSprints);

                if (loadedSprints.length > 0) {
                    setSelectedSprintId(
                        String(loadedSprints[0].id)
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
        }

        loadSprints();

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (!selectedSprintId) {
            return;
        }

        let cancelled = false;

        async function loadSprintTasks() {
            setLoadingTasks(true);
            setError("");

            try {
                const response = await api.get(
                    `/Sprint/my-sprints/${selectedSprintId}`
                );

                if (cancelled) {
                    return;
                }

                const {
                    sprint: loadedSprint,
                    tasks: loadedTasks,
                } = normalizeSprintDetails(response);

                setSprint(loadedSprint);
                setTasks(loadedTasks);
            } catch (err) {
                if (cancelled) {
                    return;
                }

                console.error(
                    "Failed to load sprint tasks:",
                    err
                );

                setSprint(null);
                setTasks([]);

                setError(
                    err?.response?.data?.message ||
                        "Unable to load sprint information. Please try again."
                );
            } finally {
                if (!cancelled) {
                    setLoadingTasks(false);
                }
            }
        }

        loadSprintTasks();

        return () => {
            cancelled = true;
        };
    }, [selectedSprintId]);

    const selectedSprintFromList = useMemo(() => {
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

    const displayedSprint = sprint || selectedSprintFromList;

    const statistics = useMemo(() => {
        const total = tasks.length;

        const completed = tasks.filter(
            (task) =>
                getStatusLabel(task.status) ===
                "Completed"
        ).length;

        const inProgress = tasks.filter(
            (task) =>
                getStatusLabel(task.status) ===
                "In Progress"
        ).length;

        const blocked = tasks.filter(
            (task) =>
                getStatusLabel(task.status) ===
                "Blocked"
        ).length;

        const review = tasks.filter(
            (task) =>
                getStatusLabel(task.status) ===
                "Review"
        ).length;

        const averageProgress =
            total === 0
                ? 0
                : Math.round(
                      tasks.reduce(
                          (sum, task) =>
                              sum +
                              calculateTaskProgress(
                                  task
                              ),
                          0
                      ) / total
                  );

        const remaining = total - completed;

        return {
            total,
            completed,
            inProgress,
            blocked,
            review,
            remaining,
            averageProgress,
        };
    }, [tasks]);

    if (loadingSprints) {
        return (
            <div className="min-h-75 bg-gray-50 p-4 md:p-6">
                <div className="mx-auto flex max-w-7xl items-center justify-center rounded-2xl bg-white p-10 shadow-sm">
                    <div className="flex items-center gap-3 text-gray-500">
                        <TrendingUp className="h-5 w-5 animate-pulse" />

                        <span>
                            Loading sprint tasks...
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    if (sprints.length === 0) {
        return (
            <div className="min-h-75 bg-gray-50 p-4 md:p-6">
                <div className="mx-auto max-w-7xl">
                    <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50">
                            <Target className="h-7 w-7 text-blue-600" />
                        </div>

                        <h2 className="mt-4 text-xl font-bold text-gray-900">
                            No active sprint available
                        </h2>

                        <p className="mx-auto mt-2 max-w-70 text-sm text-gray-500">
                            You currently do not have any sprint
                            tasks assigned to you.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const sprintStatus = getStatusLabel(
        displayedSprint?.status
    );

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="mx-auto max-w-7xl space-y-6">

                {/* Header */}
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                        <div>
                            <div className="mb-2 flex items-center gap-2 text-blue-600">
                                <TrendingUp className="h-5 w-5" />

                                <span className="text-sm font-semibold">
                                    Sprint Participation
                                </span>
                            </div>

                            <h1 className="text-2xl font-bold text-gray-900">
                                Sprint Tasks
                            </h1>

                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                View your assigned sprint tasks,
                                priorities, status, progress, and
                                sprint objectives.
                            </p>
                        </div>

                        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">

                            {sprints.length > 1 && (
                                <select
                                    value={selectedSprintId}
                                    onChange={(event) =>
                                        setSelectedSprintId(
                                            event.target.value
                                        )
                                    }
                                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                >
                                    {sprints.map(
                                        (item) => (
                                            <option
                                                key={item.id}
                                                value={item.id}
                                            >
                                                {item.name ||
                                                    "Sprint"}
                                            </option>
                                        )
                                    )}
                                </select>
                            )}

                            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                                <span className="h-2 w-2 rounded-full bg-green-500" />

                                {sprintStatus}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
                        <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />

                        <span>{error}</span>
                    </div>
                )}

                {/* Sprint details */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

                    <div className="rounded-2xl bg-white p-5 shadow-sm lg:col-span-2">
                        <div className="flex items-start gap-4">

                            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                                <Target className="h-6 w-6" />
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                                    Sprint Goal
                                </p>

                                <h2 className="mt-1 text-xl font-bold text-gray-900">
                                    {displayedSprint?.name ||
                                        "Current Sprint"}
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-gray-600">
                                    {displayedSprint?.goal ||
                                        "No sprint goal has been provided."}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <div className="flex items-start gap-3">

                            <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
                                <CalendarDays className="h-5 w-5" />
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">
                                    Sprint Timeline
                                </p>

                                <p className="mt-1 text-sm font-semibold text-gray-900">
                                    {formatDate(
                                        displayedSprint?.startDate
                                    )}
                                </p>

                                <p className="text-xs text-gray-500">
                                    to{" "}
                                    {formatDate(
                                        displayedSprint?.endDate
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main progress */}
                <div className="rounded-2xl bg-white p-6 shadow-sm">

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                        <div>
                            <p className="text-sm font-semibold text-gray-700">
                                Sprint Completion
                            </p>

                            <p className="mt-1 text-4xl font-bold text-gray-900">
                                {statistics.averageProgress}%
                            </p>
                        </div>

                        <p className="text-sm text-gray-500">
                            Based on your assigned sprint task
                            progress
                        </p>
                    </div>

                    <div className="mt-5 h-4 overflow-hidden rounded-full bg-gray-200">
                        <div
                            className="h-full rounded-full bg-blue-600 transition-all"
                            style={{
                                width: `${statistics.averageProgress}%`,
                            }}
                        />
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">

                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <ListTodo className="h-5 w-5 text-gray-500" />

                            <span className="text-2xl font-bold text-gray-900">
                                {statistics.total}
                            </span>
                        </div>

                        <p className="mt-3 text-xs font-medium text-gray-500">
                            Total Tasks
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />

                            <span className="text-2xl font-bold text-green-600">
                                {statistics.completed}
                            </span>
                        </div>

                        <p className="mt-3 text-xs font-medium text-gray-500">
                            Completed
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <Clock3 className="h-5 w-5 text-blue-600" />

                            <span className="text-2xl font-bold text-blue-600">
                                {statistics.inProgress}
                            </span>
                        </div>

                        <p className="mt-3 text-xs font-medium text-gray-500">
                            In Progress
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <Eye className="h-5 w-5 text-purple-600" />

                            <span className="text-2xl font-bold text-purple-600">
                                {statistics.review}
                            </span>
                        </div>

                        <p className="mt-3 text-xs font-medium text-gray-500">
                            Under Review
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <AlertCircle className="h-5 w-5 text-red-600" />

                            <span className="text-2xl font-bold text-red-600">
                                {statistics.blocked}
                            </span>
                        </div>

                        <p className="mt-3 text-xs font-medium text-gray-500">
                            Blocked
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <Target className="h-5 w-5 text-orange-600" />

                            <span className="text-2xl font-bold text-orange-600">
                                {statistics.remaining}
                            </span>
                        </div>

                        <p className="mt-3 text-xs font-medium text-gray-500">
                            Remaining
                        </p>
                    </div>
                </div>

                {/* Task Progress */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                    <div className="rounded-2xl bg-white p-6 shadow-sm">

                        <h2 className="font-bold text-gray-900">
                            Task Progress
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Progress of your assigned sprint tasks.
                        </p>

                        {loadingTasks ? (
                            <div className="flex min-h-75 items-center justify-center">
                                <div className="flex items-center gap-3 text-gray-500">
                                    <TrendingUp className="h-5 w-5 animate-pulse" />

                                    <span>
                                        Loading tasks...
                                    </span>
                                </div>
                            </div>
                        ) : tasks.length === 0 ? (
                            <div className="py-10 text-center">
                                <ListTodo className="mx-auto h-8 w-8 text-gray-400" />

                                <p className="mt-3 text-sm font-medium text-gray-700">
                                    No sprint tasks assigned
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                    No tasks are currently assigned
                                    to you for this sprint.
                                </p>
                            </div>
                        ) : (
                            <div className="mt-5 space-y-5">
                                {tasks.map((task) => {
                                    const progress =
                                        calculateTaskProgress(
                                            task
                                        );

                                    return (
                                        <div key={task.id}>

                                            <div className="flex items-center justify-between gap-3">

                                                <div className="min-w-0">

                                                    <p className="truncate text-sm font-semibold text-gray-800">
                                                        {task.title ||
                                                            "Untitled task"}
                                                    </p>

                                                    <p className="mt-1 text-xs text-gray-500">
                                                        {task.id} ·{" "}
                                                        {getPriorityLabel(
                                                            task.priority
                                                        )}{" "}
                                                        priority
                                                    </p>

                                                </div>

                                                <span className="text-sm font-bold text-gray-700">
                                                    {progress}%
                                                </span>

                                            </div>

                                            <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
                                                <div
                                                    className="h-full rounded-full bg-blue-600 transition-all"
                                                    style={{
                                                        width: `${progress}%`,
                                                    }}
                                                />
                                            </div>

                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Current priorities */}
                    <div className="rounded-2xl bg-white p-6 shadow-sm">

                        <h2 className="font-bold text-gray-900">
                            Current Priorities
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Areas requiring attention during this sprint.
                        </p>

                        <div className="mt-5 space-y-3">

                            {statistics.blocked > 0 && (
                                <div className="flex gap-3 rounded-xl border border-red-100 bg-red-50 p-4">

                                    <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />

                                    <div>
                                        <p className="text-sm font-semibold text-red-800">
                                            Blocked work
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-red-700">
                                            Review blocked tasks and
                                            communicate blockers with
                                            your Team Leader.
                                        </p>
                                    </div>

                                </div>
                            )}

                            {statistics.inProgress > 0 && (
                                <div className="flex gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">

                                    <Clock3 className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />

                                    <div>
                                        <p className="text-sm font-semibold text-blue-800">
                                            Continue active work
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-blue-700">
                                            Focus on your in-progress
                                            tasks and keep their
                                            progress information
                                            updated.
                                        </p>
                                    </div>

                                </div>
                            )}

                            {statistics.review > 0 && (
                                <div className="flex gap-3 rounded-xl border border-purple-100 bg-purple-50 p-4">

                                    <Eye className="mt-0.5 h-5 w-5 flex-shrink-0 text-purple-600" />

                                    <div>
                                        <p className="text-sm font-semibold text-purple-800">
                                            Tasks under review
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-purple-700">
                                            Monitor review results and
                                            respond to modification
                                            requests when necessary.
                                        </p>
                                    </div>

                                </div>
                            )}

                            {statistics.remaining > 0 && (
                                <div className="flex gap-3 rounded-xl border border-orange-100 bg-orange-50 p-4">

                                    <Target className="mt-0.5 h-5 w-5 flex-shrink-0 text-orange-600" />

                                    <div>
                                        <p className="text-sm font-semibold text-orange-800">
                                            Remaining work
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-orange-700">
                                            Prioritize remaining tasks
                                            according to their priority
                                            and deadlines.
                                        </p>
                                    </div>

                                </div>
                            )}

                            {statistics.total === 0 && (
                                <div className="flex gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4">

                                    <ListTodo className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-500" />

                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">
                                            No assigned work
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-gray-600">
                                            You currently have no tasks
                                            assigned in this sprint.
                                        </p>
                                    </div>

                                </div>
                            )}

                        </div>
                    </div>
                </div>

                {/* Task status table */}
                <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

                    <div className="border-b px-6 py-4">

                        <h2 className="font-bold text-gray-900">
                            Sprint Task Summary
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Overview of your assigned sprint tasks.
                        </p>

                    </div>

                    {loadingTasks ? (
                        <div className="p-10 text-center text-sm text-gray-500">
                            Loading sprint tasks...
                        </div>
                    ) : tasks.length === 0 ? (
                        <div className="p-10 text-center">

                            <ListTodo className="mx-auto h-8 w-8 text-gray-400" />

                            <p className="mt-3 text-sm font-medium text-gray-700">
                                No sprint tasks assigned
                            </p>

                        </div>
                    ) : (
                        <div className="overflow-x-auto">

                            <table className="w-full min-w-175">

                                <thead className="bg-gray-50">
                                    <tr>

                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Task
                                        </th>

                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Priority
                                        </th>

                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Status
                                        </th>

                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Progress
                                        </th>

                                    </tr>
                                </thead>

                                <tbody className="divide-y">

                                    {tasks.map((task) => {
                                        const progress =
                                            calculateTaskProgress(
                                                task
                                            );

                                        return (
                                            <tr
                                                key={task.id}
                                                className="hover:bg-gray-50"
                                            >

                                                <td className="px-6 py-4">

                                                    <div>

                                                        <p className="text-sm font-semibold text-gray-900">
                                                            {task.title ||
                                                                "Untitled task"}
                                                        </p>

                                                        <p className="mt-1 text-xs text-gray-500">
                                                            {task.id}
                                                        </p>

                                                    </div>

                                                </td>

                                                <td className="px-6 py-4">

                                                    <span className="text-sm text-gray-700">
                                                        {getPriorityLabel(
                                                            task.priority
                                                        )}
                                                    </span>

                                                </td>

                                                <td className="px-6 py-4">

                                                    <span
                                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                                                            task.status
                                                        )}`}
                                                    >
                                                        {getStatusLabel(
                                                            task.status
                                                        )}
                                                    </span>

                                                </td>

                                                <td className="px-6 py-4">

                                                    <div className="flex items-center gap-3">

                                                        <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-200">

                                                            <div
                                                                className="h-full rounded-full bg-blue-600 transition-all"
                                                                style={{
                                                                    width: `${progress}%`,
                                                                }}
                                                            />

                                                        </div>

                                                        <span className="text-xs font-semibold text-gray-700">
                                                            {progress}%
                                                        </span>

                                                    </div>

                                                </td>

                                            </tr>
                                        );
                                    })}

                                </tbody>
                            </table>

                        </div>
                    )}

                </div>

            </div>
        </div>
    );
}