import { useMemo, useState } from "react";
import {
    CalendarDays,
    CheckCircle2,
    Clock3,
    AlertCircle,
    Search,
    Target,
    ListTodo,
    CircleDot,
    Eye,
    X,
} from "lucide-react";

const SAMPLE_SPRINT = {
    id: "SPR-001",
    name: "Sprint 1 - Core Development",
    goal: "Complete the core development tasks for the current project phase.",
    startDate: "2026-08-25",
    endDate: "2026-09-08",
    status: "Active",
};

const INITIAL_TASKS = [
    {
        id: "TASK-001",
        title: "Implement user authentication",
        description:
            "Develop login and authentication functionality for the application.",
        status: "In Progress",
        priority: "High",
        dueDate: "2026-09-03",
        project: "AI-Powered Management System",
        sprint: "Sprint 1 - Core Development",
        progress: 70,
    },
    {
        id: "TASK-002",
        title: "Create dashboard interface",
        description:
            "Build the main dashboard interface and connect the required components.",
        status: "To Do",
        priority: "High",
        dueDate: "2026-09-05",
        project: "AI-Powered Management System",
        sprint: "Sprint 1 - Core Development",
        progress: 0,
    },
    {
        id: "TASK-003",
        title: "Implement project management",
        description:
            "Implement project listing, project details, and project assignment functionality.",
        status: "Review",
        priority: "Medium",
        dueDate: "2026-09-06",
        project: "AI-Powered Management System",
        sprint: "Sprint 1 - Core Development",
        progress: 90,
    },
    {
        id: "TASK-004",
        title: "Prepare technical documentation",
        description:
            "Prepare documentation for the completed development work.",
        status: "Completed",
        priority: "Low",
        dueDate: "2026-08-30",
        project: "AI-Powered Management System",
        sprint: "Sprint 1 - Core Development",
        progress: 100,
    },
];

const STATUS_OPTIONS = [
    "All",
    "To Do",
    "In Progress",
    "Review",
    "Completed",
    "Blocked",
];

const PRIORITY_OPTIONS = ["All", "High", "Medium", "Low"];

function getStatusIcon(status) {
    switch (status) {
        case "Completed":
            return <CheckCircle2 className="h-4 w-4" />;
        case "In Progress":
            return <Clock3 className="h-4 w-4" />;
        case "Blocked":
            return <AlertCircle className="h-4 w-4" />;
        case "Review":
            return <Eye className="h-4 w-4" />;
        default:
            return <CircleDot className="h-4 w-4" />;
    }
}

function getStatusClasses(status) {
    switch (status) {
        case "Completed":
            return "bg-green-100 text-green-700 border-green-200";
        case "In Progress":
            return "bg-blue-100 text-blue-700 border-blue-200";
        case "Review":
            return "bg-purple-100 text-purple-700 border-purple-200";
        case "Blocked":
            return "bg-red-100 text-red-700 border-red-200";
        default:
            return "bg-gray-100 text-gray-700 border-gray-200";
    }
}

function getPriorityClasses(priority) {
    switch (priority) {
        case "High":
            return "bg-red-50 text-red-700 border-red-200";
        case "Medium":
            return "bg-yellow-50 text-yellow-700 border-yellow-200";
        default:
            return "bg-green-50 text-green-700 border-green-200";
    }
}

function formatDate(date) {
    if (!date) return "-";

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function TaskDetailsModal({ task, onClose }) {
    if (!task) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b px-6 py-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                            {task.id}
                        </p>
                        <h2 className="mt-1 text-xl font-bold text-gray-900">
                            {task.title}
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="space-y-5 p-6">
                    <div>
                        <h3 className="mb-2 text-sm font-semibold text-gray-900">
                            Description
                        </h3>

                        <p className="text-sm leading-6 text-gray-600">
                            {task.description}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="rounded-xl bg-gray-50 p-4">
                            <p className="text-xs text-gray-500">Status</p>
                            <div className="mt-2">
                                <span
                                    className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                                        task.status
                                    )}`}
                                >
                                    {getStatusIcon(task.status)}
                                    {task.status}
                                </span>
                            </div>
                        </div>

                        <div className="rounded-xl bg-gray-50 p-4">
                            <p className="text-xs text-gray-500">Priority</p>
                            <div className="mt-2">
                                <span
                                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getPriorityClasses(
                                        task.priority
                                    )}`}
                                >
                                    {task.priority}
                                </span>
                            </div>
                        </div>

                        <div className="rounded-xl bg-gray-50 p-4">
                            <p className="text-xs text-gray-500">Due Date</p>
                            <p className="mt-1 text-sm font-semibold text-gray-800">
                                {formatDate(task.dueDate)}
                            </p>
                        </div>

                        <div className="rounded-xl bg-gray-50 p-4">
                            <p className="text-xs text-gray-500">Progress</p>
                            <p className="mt-1 text-sm font-semibold text-gray-800">
                                {task.progress}%
                            </p>
                        </div>
                    </div>

                    <div>
                        <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-800">
                                Task Progress
                            </span>

                            <span className="text-sm font-semibold text-blue-600">
                                {task.progress}%
                            </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                            <div
                                className="h-full rounded-full bg-blue-600 transition-all"
                                style={{ width: `${task.progress}%` }}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end border-t bg-gray-50 px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function ViewSprintTasks() {
    const [tasks] = useState(INITIAL_TASKS);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [priorityFilter, setPriorityFilter] = useState("All");
    const [selectedTask, setSelectedTask] = useState(null);

    const filteredTasks = useMemo(() => {
        const search = searchTerm.trim().toLowerCase();

        return tasks.filter((task) => {
            const matchesSearch =
                !search ||
                task.title.toLowerCase().includes(search) ||
                task.id.toLowerCase().includes(search) ||
                task.description.toLowerCase().includes(search);

            const matchesStatus =
                statusFilter === "All" || task.status === statusFilter;

            const matchesPriority =
                priorityFilter === "All" || task.priority === priorityFilter;

            return matchesSearch && matchesStatus && matchesPriority;
        });
    }, [tasks, searchTerm, statusFilter, priorityFilter]);

    const taskCounts = useMemo(() => {
        return {
            total: tasks.length,
            completed: tasks.filter((task) => task.status === "Completed").length,
            inProgress: tasks.filter((task) => task.status === "In Progress")
                .length,
            review: tasks.filter((task) => task.status === "Review").length,
            blocked: tasks.filter((task) => task.status === "Blocked").length,
        };
    }, [tasks]);

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="mx-auto max-w-7xl space-y-6">
                {/* Header */}
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <div className="mb-2 flex items-center gap-2 text-blue-600">
                                <ListTodo className="h-5 w-5" />
                                <span className="text-sm font-semibold">
                                    Sprint Participation
                                </span>
                            </div>

                            <h1 className="text-2xl font-bold text-gray-900">
                                Sprint Tasks
                            </h1>

                            <p className="mt-1 text-sm text-gray-500">
                                View your assigned tasks, priorities, deadlines,
                                and current sprint progress.
                            </p>
                        </div>

                        <div className="rounded-xl border bg-gray-50 px-5 py-4">
                            <p className="text-xs font-medium text-gray-500">
                                Current Sprint
                            </p>
                            <p className="mt-1 font-semibold text-gray-900">
                                {SAMPLE_SPRINT.name}
                            </p>
                            <span className="mt-2 inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                {SAMPLE_SPRINT.status}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Sprint information */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                                <Target className="h-5 w-5" />
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">
                                    Sprint Goal
                                </p>
                                <p className="mt-1 text-sm font-semibold text-gray-800">
                                    {SAMPLE_SPRINT.goal}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
                                <CalendarDays className="h-5 w-5" />
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">
                                    Sprint Duration
                                </p>
                                <p className="mt-1 text-sm font-semibold text-gray-800">
                                    {formatDate(SAMPLE_SPRINT.startDate)} -{" "}
                                    {formatDate(SAMPLE_SPRINT.endDate)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-green-50 p-3 text-green-600">
                                <CheckCircle2 className="h-5 w-5" />
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">
                                    Sprint Tasks
                                </p>
                                <p className="mt-1 text-2xl font-bold text-gray-900">
                                    {taskCounts.total}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Task statistics */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                    <div className="rounded-xl border bg-white p-4">
                        <p className="text-xs text-gray-500">Total</p>
                        <p className="mt-1 text-2xl font-bold text-gray-900">
                            {taskCounts.total}
                        </p>
                    </div>

                    <div className="rounded-xl border bg-white p-4">
                        <p className="text-xs text-gray-500">To Do</p>
                        <p className="mt-1 text-2xl font-bold text-gray-700">
                            {tasks.filter((task) => task.status === "To Do").length}
                        </p>
                    </div>

                    <div className="rounded-xl border bg-white p-4">
                        <p className="text-xs text-gray-500">In Progress</p>
                        <p className="mt-1 text-2xl font-bold text-blue-600">
                            {taskCounts.inProgress}
                        </p>
                    </div>

                    <div className="rounded-xl border bg-white p-4">
                        <p className="text-xs text-gray-500">Review</p>
                        <p className="mt-1 text-2xl font-bold text-purple-600">
                            {taskCounts.review}
                        </p>
                    </div>

                    <div className="rounded-xl border bg-white p-4">
                        <p className="text-xs text-gray-500">Completed</p>
                        <p className="mt-1 text-2xl font-bold text-green-600">
                            {taskCounts.completed}
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="rounded-2xl bg-white p-5 shadow-sm">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(event) =>
                                    setSearchTerm(event.target.value)
                                }
                                placeholder="Search sprint tasks..."
                                className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(event.target.value)
                            }
                            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            {STATUS_OPTIONS.map((status) => (
                                <option key={status} value={status}>
                                    Status: {status}
                                </option>
                            ))}
                        </select>

                        <select
                            value={priorityFilter}
                            onChange={(event) =>
                                setPriorityFilter(event.target.value)
                            }
                            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            {PRIORITY_OPTIONS.map((priority) => (
                                <option key={priority} value={priority}>
                                    Priority: {priority}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Tasks */}
                <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
                    <div className="border-b px-5 py-4">
                        <h2 className="font-bold text-gray-900">
                            Assigned Sprint Tasks
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            {filteredTasks.length} task
                            {filteredTasks.length !== 1 ? "s" : ""} found
                        </p>
                    </div>

                    {filteredTasks.length === 0 ? (
                        <div className="p-12 text-center">
                            <ListTodo className="mx-auto h-10 w-10 text-gray-300" />
                            <h3 className="mt-3 font-semibold text-gray-800">
                                No sprint tasks found
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                No tasks match your current filters.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {filteredTasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="p-5 transition hover:bg-gray-50"
                                >
                                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="text-xs font-semibold text-blue-600">
                                                    {task.id}
                                                </span>

                                                <span
                                                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusClasses(
                                                        task.status
                                                    )}`}
                                                >
                                                    {getStatusIcon(task.status)}
                                                    {task.status}
                                                </span>

                                                <span
                                                    className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${getPriorityClasses(
                                                        task.priority
                                                    )}`}
                                                >
                                                    {task.priority}
                                                </span>
                                            </div>

                                            <h3 className="mt-2 text-base font-bold text-gray-900">
                                                {task.title}
                                            </h3>

                                            <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                                                {task.description}
                                            </p>

                                            <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <CalendarDays className="h-3.5 w-3.5" />
                                                    Due: {formatDate(task.dueDate)}
                                                </span>

                                                <span>
                                                    Project: {task.project}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="w-full lg:w-56">
                                            <div className="mb-2 flex justify-between">
                                                <span className="text-xs font-medium text-gray-500">
                                                    Progress
                                                </span>

                                                <span className="text-xs font-bold text-gray-700">
                                                    {task.progress}%
                                                </span>
                                            </div>

                                            <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                                                <div
                                                    className="h-full rounded-full bg-blue-600"
                                                    style={{
                                                        width: `${task.progress}%`,
                                                    }}
                                                />
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setSelectedTask(task)
                                                }
                                                className="mt-3 inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                                            >
                                                <Eye className="h-4 w-4" />
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <TaskDetailsModal
                task={selectedTask}
                onClose={() => setSelectedTask(null)}
            />
        </div>
    );
}