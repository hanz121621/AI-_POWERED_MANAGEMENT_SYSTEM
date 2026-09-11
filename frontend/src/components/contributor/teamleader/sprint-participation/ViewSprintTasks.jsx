import { useEffect, useMemo, useState } from "react";

import {
    Search,
    ListChecks,
    Filter,
    CalendarDays,
    UserRound,
    Flag,
    CheckCircle2,
    Clock3,
    CircleDot,
    AlertTriangle,
    ChevronDown,
    Eye,
    Target,
} from "lucide-react";

import api from "@/services/api";

const STATUS_OPTIONS = [
    "All",
    "Not Started",
    "In Progress",
    "In Review",
    "Completed",
    "Blocked",
];

const PRIORITY_OPTIONS = [
    "All",
    "Low",
    "Medium",
    "High",
    "Critical",
];

function normalizeStatus(status) {
    const value = String(status ?? "").trim().toLowerCase();

    if (
        value === "completed" ||
        value === "complete" ||
        value === "done" ||
        value === "4"
    ) {
        return "Completed";
    }

    if (
        value === "in review" ||
        value === "review" ||
        value === "inreview" ||
        value === "3"
    ) {
        return "In Review";
    }

    if (
        value === "in progress" ||
        value === "inprogress" ||
        value === "2"
    ) {
        return "In Progress";
    }

    if (
        value === "blocked" ||
        value === "5"
    ) {
        return "Blocked";
    }

    return "Not Started";
}

function normalizePriority(priority) {
    const value = String(priority ?? "").trim().toLowerCase();

    if (value === "critical" || value === "4") {
        return "Critical";
    }

    if (value === "high" || value === "3") {
        return "High";
    }

    if (value === "medium" || value === "2") {
        return "Medium";
    }

    return "Low";
}

function getStatusIcon(status) {
    switch (status) {
        case "Completed":
            return CheckCircle2;
        case "In Progress":
            return Clock3;
        case "In Review":
            return CircleDot;
        case "Blocked":
            return AlertTriangle;
        default:
            return CircleDot;
    }
}

function getStatusClass(status) {
    switch (status) {
        case "Completed":
            return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400";

        case "In Progress":
            return "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400";

        case "In Review":
            return "bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400";

        case "Blocked":
            return "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400";

        default:
            return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";
    }
}

function getPriorityClass(priority) {
    switch (priority) {
        case "Critical":
            return "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400";

        case "High":
            return "bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400";

        case "Medium":
            return "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400";

        default:
            return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";
    }
}

function getProgress(status) {
    switch (status) {
        case "Completed":
            return 100;
        case "In Review":
            return 75;
        case "In Progress":
            return 50;
        case "Blocked":
            return 0;
        default:
            return 0;
    }
}

function formatDate(value) {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value).split("T")[0];
    }

    return date.toLocaleDateString();
}

function normalizeTask(task) {
    const status = normalizeStatus(
        task?.status ??
        task?.Status
    );

    const priority = normalizePriority(
        task?.priority ??
        task?.Priority
    );

    const assignedContributor =
        task?.assignedContributor ??
        task?.AssignedContributor ??
        task?.assignedContributorSD ??
        task?.AssignedContributorSD ??
        task?.contributor ??
        task?.Contributor ??
        task?.assignedUser ??
        task?.AssignedUser ??
        task?.user ??
        task?.User ??
        null;

    const contributorName =
        typeof assignedContributor === "string"
            ? assignedContributor
            : assignedContributor?.fullName ??
              assignedContributor?.FullName ??
              assignedContributor?.name ??
              assignedContributor?.Name ??
              assignedContributor?.userName ??
              assignedContributor?.UserName ??
              task?.contributorName ??
              task?.ContributorName ??
              task?.assignedContributorName ??
              task?.AssignedContributorName ??
              "Unassigned";

    const contributorRole =
        typeof assignedContributor === "object" && assignedContributor
            ? assignedContributor?.role ??
              assignedContributor?.Role ??
              assignedContributor?.contributorType ??
              assignedContributor?.ContributorType ??
              ""
            : task?.role ??
              task?.Role ??
              task?.contributorRole ??
              task?.ContributorRole ??
              "";

    const id =
        task?.id ??
        task?.Id ??
        task?.taskId ??
        task?.TaskId;

    const title =
        task?.title ??
        task?.Title ??
        "Untitled Task";

    const description =
        task?.description ??
        task?.Description ??
        "";

    const dueDate =
        task?.dueDate ??
        task?.DueDate ??
        task?.deadline ??
        task?.Deadline;

    const sprintId =
        task?.sprintId ??
        task?.SprintId;

    return {
        ...task,
        id,
        title,
        description,
        contributor: contributorName,
        role: contributorRole || "Contributor",
        priority,
        status,
        deadline: formatDate(dueDate),
        rawDeadline: dueDate,
        progress: getProgress(status),
        sprintId,
    };
}

function ViewSprintTasks({
    sprintId,
    tasks: providedTasks,
    onTaskSelect,
    onRefresh,
}) {
    const [tasks, setTasks] = useState(
        Array.isArray(providedTasks)
            ? providedTasks.map(normalizeTask)
            : []
    );

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");
    const [priority, setPriority] = useState("All");
    const [selectedTask, setSelectedTask] = useState(null);

    const [loading, setLoading] = useState(
        !Array.isArray(providedTasks)
    );

    const [error, setError] = useState("");

    const loadTasks = async () => {
        if (!sprintId) {
            setTasks([]);
            setError("No sprint was selected.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                `/tasks/team-leader/sprint/${sprintId}`
            );

            const responseData = response?.data;

            const rawTasks =
                Array.isArray(responseData)
                    ? responseData
                    : Array.isArray(responseData?.tasks)
                        ? responseData.tasks
                        : Array.isArray(responseData?.Tasks)
                            ? responseData.Tasks
                            : Array.isArray(responseData?.data)
                                ? responseData.data
                                : Array.isArray(responseData?.Data)
                                    ? responseData.Data
                                    : [];

            setTasks(rawTasks.map(normalizeTask));
        } catch (err) {
            console.error(
                "Failed to load sprint tasks:",
                err
            );

            setError(
                err?.response?.data?.message ||
                err?.response?.data?.Message ||
                "Failed to load sprint tasks."
            );

            setTasks([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (Array.isArray(providedTasks)) {
            setTasks(providedTasks.map(normalizeTask));
            setLoading(false);
            setError("");
            return;
        }

        loadTasks();
    }, [sprintId, providedTasks]);

    const sprint = useMemo(() => {
        const firstTask = tasks.find(
            (task) => task.sprintId
        );

        return {
            name:
                firstTask?.sprint?.name ??
                firstTask?.sprint?.Name ??
                firstTask?.sprintName ??
                firstTask?.SprintName ??
                "Current Sprint",

            goal:
                firstTask?.sprint?.goal ??
                firstTask?.sprint?.Goal ??
                firstTask?.sprintGoal ??
                firstTask?.SprintGoal ??
                "Tasks assigned to members of your team.",

            startDate:
                firstTask?.sprint?.startDate ??
                firstTask?.sprint?.StartDate ??
                firstTask?.sprintStartDate ??
                firstTask?.SprintStartDate,

            endDate:
                firstTask?.sprint?.endDate ??
                firstTask?.sprint?.EndDate ??
                firstTask?.sprintEndDate ??
                firstTask?.SprintEndDate,
        };
    }, [tasks]);

    const filteredTasks = useMemo(() => {
        const searchValue = search.trim().toLowerCase();

        return tasks.filter((task) => {
            const matchesSearch =
                !searchValue ||
                String(task.title ?? "")
                    .toLowerCase()
                    .includes(searchValue) ||
                String(task.contributor ?? "")
                    .toLowerCase()
                    .includes(searchValue) ||
                String(task.id ?? "")
                    .toLowerCase()
                    .includes(searchValue) ||
                String(task.description ?? "")
                    .toLowerCase()
                    .includes(searchValue) ||
                String(task.status ?? "")
                    .toLowerCase()
                    .includes(searchValue) ||
                String(task.priority ?? "")
                    .toLowerCase()
                    .includes(searchValue);

            const matchesStatus =
                status === "All" ||
                task.status === status;

            const matchesPriority =
                priority === "All" ||
                task.priority === priority;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesPriority
            );
        });
    }, [tasks, search, status, priority]);

    const completedCount = tasks.filter(
        (task) => task.status === "Completed"
    ).length;

    const activeCount = tasks.filter(
        (task) => task.status === "In Progress"
    ).length;

    const blockedCount = tasks.filter(
        (task) => task.status === "Blocked"
    ).length;

    const handleTaskSelect = (task) => {
        setSelectedTask(task);
        onTaskSelect?.(task);
    };

    const handleRefresh = async () => {
        if (Array.isArray(providedTasks)) {
            await onRefresh?.();
            return;
        }

        await loadTasks();
        await onRefresh?.();
    };

    return (
        <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#0d2747]">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-950/40">
                            <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-purple-600 dark:text-purple-400">
                                Current Sprint
                            </p>

                            <h3 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                                {sprint.name}
                            </h3>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                                {sprint.goal}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">
                        <CalendarDays className="h-4 w-4 text-slate-500 dark:text-slate-400" />

                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                            {sprint.startDate
                                ? formatDate(sprint.startDate)
                                : "—"}{" "}
                            —{" "}
                            {sprint.endDate
                                ? formatDate(sprint.endDate)
                                : "—"}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <SummaryCard
                    icon={ListChecks}
                    title="Total Tasks"
                    value={tasks.length}
                    description="Tasks in this sprint"
                />

                <SummaryCard
                    icon={CheckCircle2}
                    title="Completed"
                    value={completedCount}
                    description="Finished tasks"
                />

                <SummaryCard
                    icon={Clock3}
                    title="In Progress"
                    value={activeCount}
                    description="Active tasks"
                />

                <SummaryCard
                    icon={AlertTriangle}
                    title="Blocked"
                    value={blockedCount}
                    description="Needs attention"
                />
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-[#0d2747]">
                <div className="border-b border-slate-200 px-5 py-5 dark:border-slate-700">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                                Sprint Tasks
                            </h3>

                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Tasks assigned to members of your team.
                            </p>
                        </div>

                        <div className="flex items-center gap-2 rounded-lg bg-purple-50 px-3 py-2 dark:bg-purple-950/30">
                            <Clock3 className="h-4 w-4 text-purple-600 dark:text-purple-400" />

                            <span className="text-sm font-medium text-purple-700 dark:text-purple-400">
                                {sprint.name}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="border-b border-slate-200 bg-slate-50/70 p-4 dark:border-slate-700 dark:bg-slate-900/30">
                    <div className="flex flex-col gap-3 lg:flex-row">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search tasks or team members..."
                                className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-[#081b33] dark:text-white dark:focus:ring-blue-950"
                            />
                        </div>

                        <div className="relative">
                            <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                            <select
                                value={status}
                                onChange={(event) =>
                                    setStatus(event.target.value)
                                }
                                className="appearance-none rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-9 text-sm text-slate-700 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-[#081b33] dark:text-slate-200"
                            >
                                {STATUS_OPTIONS.map((option) => (
                                    <option
                                        key={option}
                                        value={option}
                                    >
                                        {option}
                                    </option>
                                ))}
                            </select>

                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        </div>

                        <div className="relative">
                            <Flag className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                            <select
                                value={priority}
                                onChange={(event) =>
                                    setPriority(event.target.value)
                                }
                                className="appearance-none rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-9 text-sm text-slate-700 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-[#081b33] dark:text-slate-200"
                            >
                                {PRIORITY_OPTIONS.map((option) => (
                                    <option
                                        key={option}
                                        value={option}
                                    >
                                        {option}
                                    </option>
                                ))}
                            </select>

                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center px-5 py-16">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />

                        <p className="mt-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                            Loading sprint tasks...
                        </p>
                    </div>
                ) : error ? (
                    <div className="px-5 py-12 text-center">
                        <AlertTriangle className="mx-auto mb-3 h-8 w-8 text-red-400" />

                        <p className="text-sm font-medium text-red-600 dark:text-red-400">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={loadTasks}
                            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            Try Again
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[950px] text-left">
                            <thead className="bg-slate-50 dark:bg-slate-900/40">
                                <tr className="border-b border-slate-200 dark:border-slate-700">
                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Task
                                    </th>

                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Contributor
                                    </th>

                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Priority
                                    </th>

                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Status
                                    </th>

                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Deadline
                                    </th>

                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Progress
                                    </th>

                                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {filteredTasks.length > 0 ? (
                                    filteredTasks.map((task) => {
                                        const StatusIcon =
                                            getStatusIcon(task.status);

                                        return (
                                            <tr
                                                key={task.id}
                                                className="transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                            >
                                                <td className="px-5 py-4">
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                                            {task.title}
                                                        </p>

                                                        <p className="mt-1 max-w-xs truncate text-xs text-slate-500 dark:text-slate-400">
                                                            {task.description ||
                                                                "No description"}
                                                        </p>

                                                        <p className="mt-1 text-xs font-medium text-slate-400">
                                                            {task.id}
                                                        </p>
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                                                            <UserRound className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                                                        </div>

                                                        <div>
                                                            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                                                {task.contributor}
                                                            </p>

                                                            <p className="text-xs text-slate-400">
                                                                {task.role}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span
                                                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getPriorityClass(
                                                            task.priority
                                                        )}`}
                                                    >
                                                        {task.priority}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
                                                            task.status
                                                        )}`}
                                                    >
                                                        <StatusIcon className="h-3.5 w-3.5" />
                                                        {task.status}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                                        <CalendarDays className="h-4 w-4 text-slate-400" />
                                                        {task.deadline}
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <div className="w-28">
                                                        <div className="mb-1 flex justify-between">
                                                            <span className="text-xs text-slate-400">
                                                                Progress
                                                            </span>

                                                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                                {task.progress}%
                                                            </span>
                                                        </div>

                                                        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                                            <div
                                                                className="h-full rounded-full bg-blue-600 transition-all"
                                                                style={{
                                                                    width: `${task.progress}%`,
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleTaskSelect(
                                                                task
                                                            )
                                                        }
                                                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
                                                    >
                                                        <Eye className="h-3.5 w-3.5" />
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-5 py-12 text-center"
                                        >
                                            <div className="flex flex-col items-center">
                                                <ListChecks className="mb-3 h-8 w-8 text-slate-300" />

                                                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    No sprint tasks found.
                                                </p>

                                                <p className="mt-1 text-xs text-slate-400">
                                                    Try changing your search or filters.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {selectedTask && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setSelectedTask(null);
                        }
                    }}
                >
                    <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl dark:bg-[#0d2747]">
                        <div className="flex items-start justify-between border-b border-slate-200 p-5 dark:border-slate-700">
                            <div>
                                <p className="text-xs font-medium text-slate-400">
                                    {selectedTask.id}
                                </p>

                                <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
                                    {selectedTask.title}
                                </h3>
                            </div>

                            <button
                                type="button"
                                onClick={() => setSelectedTask(null)}
                                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                                aria-label="Close task details"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-5 p-5">
                            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                                {selectedTask.description ||
                                    "No description available."}
                            </p>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <DetailItem
                                    label="Contributor"
                                    value={selectedTask.contributor}
                                />

                                <DetailItem
                                    label="Role"
                                    value={selectedTask.role}
                                />

                                <DetailItem
                                    label="Priority"
                                    value={selectedTask.priority}
                                />

                                <DetailItem
                                    label="Status"
                                    value={selectedTask.status}
                                />

                                <DetailItem
                                    label="Deadline"
                                    value={selectedTask.deadline}
                                />

                                <DetailItem
                                    label="Sprint"
                                    value={sprint.name}
                                />
                            </div>

                            <div>
                                <div className="mb-2 flex justify-between">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Task progress
                                    </span>

                                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                        {selectedTask.progress}%
                                    </span>
                                </div>

                                <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                    <div
                                        className="h-full rounded-full bg-blue-600 transition-all"
                                        style={{
                                            width: `${selectedTask.progress}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end border-t border-slate-200 p-5 dark:border-slate-700">
                            <button
                                type="button"
                                onClick={() => setSelectedTask(null)}
                                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700"
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

function SummaryCard({
    icon: Icon,
    title,
    value,
    description,
}) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-[#0d2747]">
            <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                    <Icon className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                </div>

                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                    {value}
                </span>
            </div>

            <p className="mt-4 text-sm font-semibold text-slate-800 dark:text-slate-200">
                {title}
            </p>

            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                {description}
            </p>
        </div>
    );
}

function DetailItem({ label, value }) {
    return (
        <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
            <p className="text-xs text-slate-400">
                {label}
            </p>

            <p className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-200">
                {value || "—"}
            </p>
        </div>
    );
}

export default ViewSprintTasks;