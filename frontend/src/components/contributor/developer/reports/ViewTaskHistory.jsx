import { useEffect, useMemo, useState } from "react";
import {
    AlertCircle,
    CalendarDays,
    CheckCircle2,
    Clock3,
    FileText,
    Filter,
    FolderKanban,
    History,
    Loader2,
    RefreshCw,
    Search,
    Target,
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

const STATUS_OPTIONS = [
    { value: "all", label: "All Statuses" },
    { value: "1", label: "To Do" },
    { value: "2", label: "In Progress" },
    { value: "3", label: "Under Review" },
    { value: "4", label: "Completed" },
    { value: "5", label: "Blocked" },
];

const PRIORITY_LABELS = {
    0: "Critical",
    1: "High",
    2: "Medium",
    3: "Low",
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

    return null;
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
    const status = Number(
        getValue(
            task,
            "status",
            "Status",
            "taskStatus",
            "TaskStatus"
        )
    );

    const priority = Number(
        getValue(task, "priority", "Priority")
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

        status: Number.isFinite(status)
            ? status
            : null,

        priority: Number.isFinite(priority)
            ? priority
            : null,

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

        sprintId: getValue(
            task,
            "sprintId",
            "SprintId"
        ),

        sprintName:
            getValue(
                task,
                "sprintName",
                "SprintName"
            ) || "Sprint",

        dueDate: getValue(
            task,
            "dueDate",
            "DueDate"
        ),

        createdAt: getValue(
            task,
            "createdAt",
            "CreatedAt"
        ),

        updatedAt: getValue(
            task,
            "updatedAt",
            "UpdatedAt"
        ),

        actualHours: Number(
            getValue(
                task,
                "actualHours",
                "ActualHours"
            ) || 0
        ),

        estimatedHours: Number(
            getValue(
                task,
                "estimatedHours",
                "EstimatedHours"
            ) || 0
        ),

        assignedContributorId: getValue(
            task,
            "assignedContributorSDId",
            "AssignedContributorSDId"
        ),

        submitted:
            task?.submitted === true ||
            task?.Submitted === true ||
            task?.workSubmitted === true ||
            task?.WorkSubmitted === true,

        comments: Array.isArray(task?.comments)
            ? task.comments
            : Array.isArray(task?.Comments)
                ? task.Comments
                : [],
    };
}

function formatDate(date) {
    if (!date) return "—";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
        return "—";
    }

    return parsed.toLocaleDateString([], {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function formatDateTime(date) {
    if (!date) return "—";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
        return "—";
    }

    return parsed.toLocaleString([], {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function getStatusLabel(status) {
    switch (Number(status)) {
        case STATUS.TODO:
            return "To Do";

        case STATUS.IN_PROGRESS:
            return "In Progress";

        case STATUS.IN_REVIEW:
            return "Under Review";

        case STATUS.COMPLETED:
            return "Completed";

        case STATUS.BLOCKED:
            return "Blocked";

        default:
            return "Unknown";
    }
}

function getStatusClass(status) {
    switch (Number(status)) {
        case STATUS.COMPLETED:
            return "bg-emerald-50 text-emerald-700 border-emerald-200";

        case STATUS.IN_PROGRESS:
            return "bg-blue-50 text-blue-700 border-blue-200";

        case STATUS.IN_REVIEW:
            return "bg-amber-50 text-amber-700 border-amber-200";

        case STATUS.BLOCKED:
            return "bg-red-50 text-red-700 border-red-200";

        case STATUS.TODO:
            return "bg-slate-50 text-slate-700 border-slate-200";

        default:
            return "bg-slate-50 text-slate-600 border-slate-200";
    }
}

function getPriorityClass(priority) {
    switch (Number(priority)) {
        case 0:
            return "bg-red-50 text-red-700 border-red-200";

        case 1:
            return "bg-orange-50 text-orange-700 border-orange-200";

        case 2:
            return "bg-blue-50 text-blue-700 border-blue-200";

        case 3:
            return "bg-slate-50 text-slate-700 border-slate-200";

        default:
            return "bg-slate-50 text-slate-600 border-slate-200";
    }
}

function getPriorityLabel(priority) {
    return (
        PRIORITY_LABELS[Number(priority)] ||
        "Not Set"
    );
}

function getStatusIcon(status) {
    switch (Number(status)) {
        case STATUS.COMPLETED:
            return CheckCircle2;

        case STATUS.BLOCKED:
            return XCircle;

        case STATUS.IN_PROGRESS:
            return Clock3;

        case STATUS.IN_REVIEW:
            return Target;

        default:
            return FileText;
    }
}

function StatCard({
    title,
    value,
    icon: Icon,
    description,
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">
                        {title}
                    </p>

                    <h3 className="mt-2 text-3xl font-bold text-slate-900">
                        {value}
                    </h3>

                    {description && (
                        <p className="mt-1 text-xs text-slate-500">
                            {description}
                        </p>
                    )}
                </div>

                <div className="rounded-xl bg-slate-100 p-3">
                    <Icon className="h-5 w-5 text-slate-700" />
                </div>
            </div>
        </div>
    );
}

export default function ViewTaskHistory() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [projectFilter, setProjectFilter] = useState("all");
    const [sprintFilter, setSprintFilter] = useState("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [selectedTask, setSelectedTask] = useState(null);

    const loadTaskHistory = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                "/tasks/my-work"
            );

            const backendTasks =
                getTasksFromResponse(response);

            const normalizedTasks = backendTasks
                .map(normalizeTask)
                .filter(
                    (task) => task.id !== null
                );

            setTasks(normalizedTasks);
        } catch (err) {
            console.error(
                "Failed to load task history:",
                err
            );

            setError(
                err?.response?.data?.message ||
                err?.response?.data?.title ||
                "Unable to load your task history. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    /*
     * Initial API request.
     *
     * The request is started asynchronously so the
     * React Hooks lint rule does not detect a synchronous
     * state update directly from the effect.
     */
    useEffect(() => {
        let cancelled = false;

        const request = api.get(
            "/tasks/my-work"
        );

        request
            .then((response) => {
                if (cancelled) {
                    return;
                }

                const backendTasks =
                    getTasksFromResponse(response);

                const normalizedTasks =
                    backendTasks
                        .map(normalizeTask)
                        .filter(
                            (task) =>
                                task.id !== null
                        );

                setTasks(normalizedTasks);
                setError("");
            })
            .catch((err) => {
                if (cancelled) {
                    return;
                }

                console.error(
                    "Failed to load task history:",
                    err
                );

                setError(
                    err?.response?.data?.message ||
                    err?.response?.data?.title ||
                    "Unable to load your task history. Please try again."
                );
            })
            .finally(() => {
                if (!cancelled) {
                    setLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const projectOptions = useMemo(() => {
        const map = new Map();

        tasks.forEach((task) => {
            const id =
                task.projectId !== null &&
                task.projectId !== undefined
                    ? String(task.projectId)
                    : "unknown-project";

            if (!map.has(id)) {
                map.set(id, {
                    id,
                    name:
                        task.projectName ||
                        "Project",
                });
            }
        });

        return Array.from(
            map.values()
        ).sort((a, b) =>
            a.name.localeCompare(b.name)
        );
    }, [tasks]);

    const sprintOptions = useMemo(() => {
        const map = new Map();

        tasks.forEach((task) => {
            const id =
                task.sprintId !== null &&
                task.sprintId !== undefined
                    ? String(task.sprintId)
                    : "unknown-sprint";

            if (!map.has(id)) {
                map.set(id, {
                    id,
                    name:
                        task.sprintName ||
                        "Sprint",
                });
            }
        });

        return Array.from(
            map.values()
        ).sort((a, b) =>
            a.name.localeCompare(b.name)
        );
    }, [tasks]);

    const filteredTasks = useMemo(() => {
        const normalizedSearch = search
            .trim()
            .toLowerCase();

        return tasks
            .filter((task) => {
                if (!normalizedSearch) {
                    return true;
                }

                return (
                    task.title
                        .toLowerCase()
                        .includes(
                            normalizedSearch
                        ) ||
                    task.description
                        .toLowerCase()
                        .includes(
                            normalizedSearch
                        ) ||
                    task.projectName
                        .toLowerCase()
                        .includes(
                            normalizedSearch
                        ) ||
                    task.sprintName
                        .toLowerCase()
                        .includes(
                            normalizedSearch
                        )
                );
            })
            .filter((task) => {
                if (statusFilter === "all") {
                    return true;
                }

                return (
                    String(task.status) ===
                    statusFilter
                );
            })
            .filter((task) => {
                if (projectFilter === "all") {
                    return true;
                }

                return (
                    String(task.projectId) ===
                    projectFilter
                );
            })
            .filter((task) => {
                if (sprintFilter === "all") {
                    return true;
                }

                return (
                    String(task.sprintId) ===
                    sprintFilter
                );
            })
            .filter((task) => {
                if (!startDate) {
                    return true;
                }

                const taskDate = new Date(
                    task.updatedAt ||
                    task.createdAt
                );

                const fromDate = new Date(
                    `${startDate}T00:00:00`
                );

                return taskDate >= fromDate;
            })
            .filter((task) => {
                if (!endDate) {
                    return true;
                }

                const taskDate = new Date(
                    task.updatedAt ||
                    task.createdAt
                );

                const toDate = new Date(
                    `${endDate}T23:59:59`
                );

                return taskDate <= toDate;
            })
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
            });
    }, [
        tasks,
        search,
        statusFilter,
        projectFilter,
        sprintFilter,
        startDate,
        endDate,
    ]);

    const statistics = useMemo(() => {
        const completed = tasks.filter(
            (task) =>
                Number(task.status) ===
                STATUS.COMPLETED
        ).length;

        const inProgress = tasks.filter(
            (task) =>
                Number(task.status) ===
                STATUS.IN_PROGRESS
        ).length;

        const blocked = tasks.filter(
            (task) =>
                Number(task.status) ===
                STATUS.BLOCKED
        ).length;

        const review = tasks.filter(
            (task) =>
                Number(task.status) ===
                STATUS.IN_REVIEW
        ).length;

        return {
            total: tasks.length,
            completed,
            inProgress,
            blocked,
            review,
        };
    }, [tasks]);

    const clearFilters = () => {
        setSearch("");
        setStatusFilter("all");
        setProjectFilter("all");
        setSprintFilter("all");
        setStartDate("");
        setEndDate("");
    };

    if (loading) {
        return (
            <div className="flex min-h-100 items-center justify-center">
                <div className="text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-slate-600" />

                    <p className="mt-3 text-sm text-slate-500">
                        Loading task history...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 text-red-600" />

                    <div className="flex-1">
                        <h2 className="font-semibold text-red-800">
                            Unable to load task history
                        </h2>

                        <p className="mt-1 text-sm text-red-700">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={
                                loadTaskHistory
                            }
                            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-slate-900 p-3">
                            <History className="h-6 w-6 text-white" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">
                                Task History
                            </h1>

                            <p className="text-sm text-slate-500">
                                Review your assigned
                                tasks, project activity,
                                status, priority, and
                                recent updates.
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={
                        loadTaskHistory
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                </button>
            </div>

            {/* Statistics */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <StatCard
                    title="Total Tasks"
                    value={
                        statistics.total
                    }
                    icon={FileText}
                    description="Your assigned tasks"
                />

                <StatCard
                    title="Completed"
                    value={
                        statistics.completed
                    }
                    icon={CheckCircle2}
                    description="Completed tasks"
                />

                <StatCard
                    title="In Progress"
                    value={
                        statistics.inProgress
                    }
                    icon={Clock3}
                    description="Active work"
                />

                <StatCard
                    title="Under Review"
                    value={
                        statistics.review
                    }
                    icon={Target}
                    description="Awaiting review"
                />

                <StatCard
                    title="Blocked"
                    value={
                        statistics.blocked
                    }
                    icon={XCircle}
                    description="Needs attention"
                />
            </div>

            {/* Filters */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Filter className="h-5 w-5 text-slate-700" />

                        <h2 className="font-semibold text-slate-900">
                            Filter Task History
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={
                            clearFilters
                        }
                        className="text-sm font-medium text-slate-500 hover:text-slate-900"
                    >
                        Clear filters
                    </button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {/* Search */}
                    <div className="lg:col-span-3">
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Search
                        </label>

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                            <input
                                type="text"
                                value={search}
                                onChange={(
                                    event
                                ) =>
                                    setSearch(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                placeholder="Search task, project, sprint, or description..."
                                className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                            />
                        </div>
                    </div>

                    {/* Project */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Project
                        </label>

                        <div className="relative">
                            <FolderKanban className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                            <select
                                value={
                                    projectFilter
                                }
                                onChange={(
                                    event
                                ) =>
                                    setProjectFilter(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                className="w-full appearance-none rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                            >
                                <option value="all">
                                    All Projects
                                </option>

                                {projectOptions.map(
                                    (
                                        project
                                    ) => (
                                        <option
                                            key={
                                                project.id
                                            }
                                            value={
                                                project.id
                                            }
                                        >
                                            {
                                                project.name
                                            }
                                        </option>
                                    )
                                )}
                            </select>
                        </div>
                    </div>

                    {/* Sprint */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Sprint
                        </label>

                        <div className="relative">
                            <Target className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                            <select
                                value={
                                    sprintFilter
                                }
                                onChange={(
                                    event
                                ) =>
                                    setSprintFilter(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                className="w-full appearance-none rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                            >
                                <option value="all">
                                    All Sprints
                                </option>

                                {sprintOptions.map(
                                    (
                                        sprint
                                    ) => (
                                        <option
                                            key={
                                                sprint.id
                                            }
                                            value={
                                                sprint.id
                                            }
                                        >
                                            {
                                                sprint.name
                                            }
                                        </option>
                                    )
                                )}
                            </select>
                        </div>
                    </div>

                    {/* Status */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Status
                        </label>

                        <select
                            value={
                                statusFilter
                            }
                            onChange={(
                                event
                            ) =>
                                setStatusFilter(
                                    event
                                        .target
                                        .value
                                )
                            }
                            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                        >
                            {STATUS_OPTIONS.map(
                                (
                                    status
                                ) => (
                                    <option
                                        key={
                                            status.value
                                        }
                                        value={
                                            status.value
                                        }
                                    >
                                        {
                                            status.label
                                        }
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    {/* Start Date */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            From Date
                        </label>

                        <div className="relative">
                            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                            <input
                                type="date"
                                value={
                                    startDate
                                }
                                onChange={(
                                    event
                                ) =>
                                    setStartDate(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                            />
                        </div>
                    </div>

                    {/* End Date */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            To Date
                        </label>

                        <div className="relative">
                            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                            <input
                                type="date"
                                value={
                                    endDate
                                }
                                onChange={(
                                    event
                                ) =>
                                    setEndDate(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Result count */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                        Task Activity
                    </h2>

                    <p className="text-sm text-slate-500">
                        Showing{" "}
                        {
                            filteredTasks.length
                        }{" "}
                        of{" "}
                        {tasks.length}{" "}
                        tasks
                    </p>
                </div>
            </div>

            {/* Task table */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {filteredTasks.length ===
                0 ? (
                    <div className="p-12 text-center">
                        <Search className="mx-auto h-10 w-10 text-slate-400" />

                        <h3 className="mt-4 text-lg font-semibold text-slate-900">
                            No tasks found
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            Try changing your
                            search or filter
                            criteria.
                        </p>

                        <button
                            type="button"
                            onClick={
                                clearFilters
                            }
                            className="mt-4 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="border-b border-slate-200 bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Task
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Project
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Sprint
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Status
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Priority
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Updated
                                    </th>

                                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {filteredTasks.map(
                                    (task) => {
                                        const StatusIcon =
                                            getStatusIcon(
                                                task.status
                                            );

                                        return (
                                            <tr
                                                key={
                                                    task.id
                                                }
                                                className="transition hover:bg-slate-50"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="max-w-xs">
                                                        <div className="flex items-center gap-2">
                                                            <StatusIcon className="h-4 w-4 shrink-0 text-slate-500" />

                                                            <p className="truncate font-medium text-slate-900">
                                                                {
                                                                    task.title
                                                                }
                                                            </p>
                                                        </div>

                                                        {task.description && (
                                                            <p className="mt-1 truncate text-xs text-slate-500">
                                                                {
                                                                    task.description
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <FolderKanban className="h-4 w-4 text-slate-400" />

                                                        <span className="text-sm text-slate-700">
                                                            {
                                                                task.projectName
                                                            }
                                                        </span>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-slate-600">
                                                        {
                                                            task.sprintName
                                                        }
                                                    </span>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClass(
                                                            task.status
                                                        )}`}
                                                    >
                                                        {getStatusLabel(
                                                            task.status
                                                        )}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${getPriorityClass(
                                                            task.priority
                                                        )}`}
                                                    >
                                                        {getPriorityLabel(
                                                            task.priority
                                                        )}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                                        <Clock3 className="h-4 w-4 text-slate-400" />

                                                        {formatDate(
                                                            task.updatedAt ||
                                                            task.createdAt
                                                        )}
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setSelectedTask(
                                                                task
                                                            )
                                                        }
                                                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                                                    >
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    }
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Activity Timeline */}
            {filteredTasks.length >
                0 && (
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 p-6">
                        <div className="flex items-center gap-3">
                            <History className="h-5 w-5 text-slate-700" />

                            <div>
                                <h2 className="font-semibold text-slate-900">
                                    Recent Activity
                                    Timeline
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Most recently
                                    updated tasks.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {filteredTasks
                            .slice(0, 5)
                            .map((task) => {
                                const StatusIcon =
                                    getStatusIcon(
                                        task.status
                                    );

                                return (
                                    <div
                                        key={`activity-${task.id}`}
                                        className="flex gap-4 p-5"
                                    >
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                                            <StatusIcon className="h-5 w-5 text-slate-700" />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-col justify-between gap-1 sm:flex-row">
                                                <h3 className="font-medium text-slate-900">
                                                    {
                                                        task.title
                                                    }
                                                </h3>

                                                <span className="text-xs text-slate-400">
                                                    {formatDateTime(
                                                        task.updatedAt ||
                                                        task.createdAt
                                                    )}
                                                </span>
                                            </div>

                                            <p className="mt-1 text-sm text-slate-500">
                                                Status:{" "}
                                                <span className="font-medium text-slate-700">
                                                    {getStatusLabel(
                                                        task.status
                                                    )}
                                                </span>
                                                {" · "}
                                                {
                                                    task.projectName
                                                }
                                                {" · "}
                                                {
                                                    task.sprintName
                                                }
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            )}

            {/* Task Details Modal */}
            {selectedTask && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
                    onMouseDown={(
                        event
                    ) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            setSelectedTask(
                                null
                            );
                        }
                    }}
                >
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-xl">
                        <div className="flex items-start justify-between border-b border-slate-200 p-6">
                            <div className="flex items-start gap-3">
                                <div className="rounded-xl bg-slate-100 p-3">
                                    <FileText className="h-5 w-5 text-slate-700" />
                                </div>

                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900">
                                        {
                                            selectedTask.title
                                        }
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Task ID:{" "}
                                        {
                                            selectedTask.id
                                        }
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedTask(
                                        null
                                    )
                                }
                                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                            >
                                <XCircle className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-6 p-6">
                            {/* Description */}
                            <div>
                                <h3 className="text-sm font-semibold text-slate-900">
                                    Description
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    {selectedTask.description ||
                                        "No description available."}
                                </p>
                            </div>

                            {/* Status / Priority */}
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                        Status
                                    </p>

                                    <span
                                        className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getStatusClass(
                                            selectedTask.status
                                        )}`}
                                    >
                                        {getStatusLabel(
                                            selectedTask.status
                                        )}
                                    </span>
                                </div>

                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                        Priority
                                    </p>

                                    <span
                                        className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getPriorityClass(
                                            selectedTask.priority
                                        )}`}
                                    >
                                        {getPriorityLabel(
                                            selectedTask.priority
                                        )}
                                    </span>
                                </div>
                            </div>

                            {/* Project / Sprint */}
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-xl border border-slate-200 p-4">
                                    <div className="flex items-center gap-2">
                                        <FolderKanban className="h-4 w-4 text-slate-500" />

                                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                            Project
                                        </p>
                                    </div>

                                    <p className="mt-2 text-sm font-medium text-slate-900">
                                        {
                                            selectedTask.projectName
                                        }
                                    </p>
                                </div>

                                <div className="rounded-xl border border-slate-200 p-4">
                                    <div className="flex items-center gap-2">
                                        <Target className="h-4 w-4 text-slate-500" />

                                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                            Sprint
                                        </p>
                                    </div>

                                    <p className="mt-2 text-sm font-medium text-slate-900">
                                        {
                                            selectedTask.sprintName
                                        }
                                    </p>
                                </div>
                            </div>

                            {/* Dates */}
                            <div className="grid gap-4 sm:grid-cols-3">
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                        Created
                                    </p>

                                    <p className="mt-1 text-sm text-slate-700">
                                        {formatDate(
                                            selectedTask.createdAt
                                        )}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                        Updated
                                    </p>

                                    <p className="mt-1 text-sm text-slate-700">
                                        {formatDate(
                                            selectedTask.updatedAt
                                        )}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                        Due Date
                                    </p>

                                    <p className="mt-1 text-sm text-slate-700">
                                        {formatDate(
                                            selectedTask.dueDate
                                        )}
                                    </p>
                                </div>
                            </div>

                            {/* Hours */}
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-xl border border-slate-200 p-4">
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                        Estimated Hours
                                    </p>

                                    <p className="mt-2 text-2xl font-bold text-slate-900">
                                        {
                                            selectedTask.estimatedHours
                                        }
                                    </p>
                                </div>

                                <div className="rounded-xl border border-slate-200 p-4">
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                        Actual Hours
                                    </p>

                                    <p className="mt-2 text-2xl font-bold text-slate-900">
                                        {
                                            selectedTask.actualHours
                                        }
                                    </p>
                                </div>
                            </div>

                            {/* Available activity information */}
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <div className="flex items-center gap-2">
                                    <UserRound className="h-4 w-4 text-slate-500" />

                                    <h3 className="text-sm font-semibold text-slate-900">
                                        Work Activity
                                    </h3>
                                </div>

                                <div className="mt-3 space-y-2 text-sm text-slate-600">
                                    <p>
                                        Work
                                        submitted:{" "}
                                        <span className="font-medium text-slate-900">
                                            {selectedTask.submitted
                                                ? "Yes"
                                                : "No"}
                                        </span>
                                    </p>

                                    <p>
                                        Comments
                                        available:{" "}
                                        <span className="font-medium text-slate-900">
                                            {
                                                selectedTask
                                                    .comments
                                                    .length
                                            }
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-slate-200 bg-slate-50 p-4 text-right">
                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedTask(
                                        null
                                    )
                                }
                                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}