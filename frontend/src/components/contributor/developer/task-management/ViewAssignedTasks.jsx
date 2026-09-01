import { useMemo, useState } from "react";
import {
    Search,
    Filter,
    Eye,
    CalendarDays,
    FolderKanban,
    Flag,
    CheckCircle2,
    Clock3,
    CircleDot,
    AlertTriangle,
    X,
} from "lucide-react";

const INITIAL_TASKS = [
    {
        id: 1,
        title: "Implement User Authentication",
        description:
            "Develop login, logout, authentication validation, and protected route functionality.",
        status: "In Progress",
        priority: "High",
        project: "AI-Powered Management System",
        sprint: "Sprint 3",
        dueDate: "2026-09-05",
        creator: "Team Leader",
        subtasks: 4,
        completedSubtasks: 2,
        comments: 3,
        files: 2,
    },
    {
        id: 2,
        title: "Create Developer Dashboard",
        description:
            "Build the developer dashboard with task, sprint, project, and notification information.",
        status: "Review",
        priority: "High",
        project: "AI-Powered Management System",
        sprint: "Sprint 3",
        dueDate: "2026-09-03",
        creator: "Manager",
        subtasks: 5,
        completedSubtasks: 5,
        comments: 5,
        files: 4,
    },
    {
        id: 3,
        title: "Implement Task Comments",
        description:
            "Allow developers to add comments and communicate with project team members.",
        status: "To Do",
        priority: "Medium",
        project: "AI-Powered Management System",
        sprint: "Sprint 4",
        dueDate: "2026-09-12",
        creator: "Team Leader",
        subtasks: 3,
        completedSubtasks: 0,
        comments: 0,
        files: 0,
    },
    {
        id: 4,
        title: "Fix Notification Service",
        description:
            "Investigate and resolve notification delivery issues.",
        status: "Blocked",
        priority: "Critical",
        project: "AI-Powered Management System",
        sprint: "Sprint 3",
        dueDate: "2026-09-02",
        creator: "Team Leader",
        subtasks: 2,
        completedSubtasks: 1,
        comments: 2,
        files: 1,
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

const PRIORITY_OPTIONS = [
    "All",
    "Critical",
    "High",
    "Medium",
    "Low",
];

function statusIcon(status) {
    switch (status) {
        case "Completed":
            return <CheckCircle2 className="h-4 w-4" />;
        case "In Progress":
            return <Clock3 className="h-4 w-4" />;
        case "Review":
            return <CircleDot className="h-4 w-4" />;
        case "Blocked":
            return <AlertTriangle className="h-4 w-4" />;
        default:
            return <CircleDot className="h-4 w-4" />;
    }
}

function statusClasses(status) {
    switch (status) {
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

function priorityClasses(priority) {
    switch (priority) {
        case "Critical":
            return "bg-red-100 text-red-700";
        case "High":
            return "bg-orange-100 text-orange-700";
        case "Medium":
            return "bg-yellow-100 text-yellow-700";
        default:
            return "bg-green-100 text-green-700";
    }
}

function calculateProgress(task) {
    if (!task.subtasks) return 0;
    return Math.round((task.completedSubtasks / task.subtasks) * 100);
}

export default function ViewAssignedTasks() {
    const [tasks, setTasks] = useState(INITIAL_TASKS);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");
    const [priority, setPriority] = useState("All");
    const [selectedTask, setSelectedTask] = useState(null);

    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => {
            const searchText = search.toLowerCase();

            const matchesSearch =
                task.title.toLowerCase().includes(searchText) ||
                task.description.toLowerCase().includes(searchText) ||
                task.project.toLowerCase().includes(searchText);

            const matchesStatus =
                status === "All" || task.status === status;

            const matchesPriority =
                priority === "All" || task.priority === priority;

            return matchesSearch && matchesStatus && matchesPriority;
        });
    }, [tasks, search, status, priority]);

    const updateTask = (updatedTask) => {
        setTasks((current) =>
            current.map((task) =>
                task.id === updatedTask.id ? updatedTask : task
            )
        );

        setSelectedTask(updatedTask);
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-6">
            <div className="mx-auto max-w-7xl space-y-6">

                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        Assigned Tasks
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        View and manage tasks assigned to you.
                    </p>
                </div>

                {/* Summary */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl bg-white p-5 shadow-sm border">
                        <p className="text-sm text-slate-500">Total Tasks</p>
                        <p className="mt-2 text-2xl font-bold">
                            {tasks.length}
                        </p>
                    </div>

                    <div className="rounded-xl bg-white p-5 shadow-sm border">
                        <p className="text-sm text-slate-500">In Progress</p>
                        <p className="mt-2 text-2xl font-bold text-blue-600">
                            {tasks.filter(
                                (task) => task.status === "In Progress"
                            ).length}
                        </p>
                    </div>

                    <div className="rounded-xl bg-white p-5 shadow-sm border">
                        <p className="text-sm text-slate-500">Review</p>
                        <p className="mt-2 text-2xl font-bold text-purple-600">
                            {tasks.filter(
                                (task) => task.status === "Review"
                            ).length}
                        </p>
                    </div>

                    <div className="rounded-xl bg-white p-5 shadow-sm border">
                        <p className="text-sm text-slate-500">Blocked</p>
                        <p className="mt-2 text-2xl font-bold text-red-600">
                            {tasks.filter(
                                (task) => task.status === "Blocked"
                            ).length}
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="rounded-xl border bg-white p-4 shadow-sm">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />

                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search tasks..."
                                className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 outline-none focus:border-blue-500"
                            />
                        </div>

                        <div className="relative">
                            <Filter className="absolute left-3 top-3 h-5 w-5 text-slate-400" />

                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full appearance-none rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 outline-none focus:border-blue-500"
                            >
                                {STATUS_OPTIONS.map((option) => (
                                    <option key={option}>{option}</option>
                                ))}
                            </select>
                        </div>

                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500"
                        >
                            {PRIORITY_OPTIONS.map((option) => (
                                <option key={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Task list */}
                <div className="space-y-4">
                    {filteredTasks.length === 0 ? (
                        <div className="rounded-xl border bg-white p-12 text-center shadow-sm">
                            <FolderKanban className="mx-auto h-12 w-12 text-slate-300" />

                            <h3 className="mt-4 font-semibold text-slate-800">
                                No assigned tasks available.
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                Try changing your search or filters.
                            </p>
                        </div>
                    ) : (
                        filteredTasks.map((task) => {
                            const progress = calculateProgress(task);

                            return (
                                <div
                                    key={task.id}
                                    className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md"
                                >
                                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h2 className="text-lg font-semibold text-slate-900">
                                                    {task.title}
                                                </h2>

                                                <span
                                                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${statusClasses(
                                                        task.status
                                                    )}`}
                                                >
                                                    {statusIcon(task.status)}
                                                    {task.status}
                                                </span>

                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-medium ${priorityClasses(
                                                        task.priority
                                                    )}`}
                                                >
                                                    {task.priority}
                                                </span>
                                            </div>

                                            <p className="mt-2 text-sm text-slate-600">
                                                {task.description}
                                            </p>

                                            <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-slate-500 sm:grid-cols-2 lg:grid-cols-4">
                                                <div className="flex items-center gap-2">
                                                    <FolderKanban className="h-4 w-4" />
                                                    {task.project}
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <CircleDot className="h-4 w-4" />
                                                    {task.sprint}
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <CalendarDays className="h-4 w-4" />
                                                    {task.dueDate}
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Flag className="h-4 w-4" />
                                                    {task.creator}
                                                </div>
                                            </div>

                                            <div className="mt-5">
                                                <div className="mb-2 flex justify-between text-xs">
                                                    <span className="text-slate-500">
                                                        Subtask Progress
                                                    </span>

                                                    <span className="font-medium">
                                                        {progress}%
                                                    </span>
                                                </div>

                                                <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                                                    <div
                                                        className="h-full rounded-full bg-blue-600"
                                                        style={{
                                                            width: `${progress}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
                                                <span>
                                                    {task.completedSubtasks}/
                                                    {task.subtasks} subtasks
                                                </span>

                                                <span>
                                                    {task.comments} comments
                                                </span>

                                                <span>
                                                    {task.files} files
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() =>
                                                setSelectedTask(task)
                                            }
                                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
                                        >
                                            <Eye className="h-4 w-4" />
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Details modal */}
            {selectedTask && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">

                        <div className="flex items-center justify-between border-b p-5">
                            <h2 className="text-xl font-bold">
                                Task Details
                            </h2>

                            <button
                                onClick={() => setSelectedTask(null)}
                                className="rounded-lg p-2 hover:bg-slate-100"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-5 p-6">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">
                                    {selectedTask.title}
                                </h3>

                                <p className="mt-2 text-sm text-slate-600">
                                    {selectedTask.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-slate-500">
                                        Status
                                    </p>
                                    <p className="mt-1 font-medium">
                                        {selectedTask.status}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-slate-500">
                                        Priority
                                    </p>
                                    <p className="mt-1 font-medium">
                                        {selectedTask.priority}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-slate-500">
                                        Project
                                    </p>
                                    <p className="mt-1 font-medium">
                                        {selectedTask.project}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-slate-500">
                                        Sprint
                                    </p>
                                    <p className="mt-1 font-medium">
                                        {selectedTask.sprint}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-slate-500">
                                        Due Date
                                    </p>
                                    <p className="mt-1 font-medium">
                                        {selectedTask.dueDate}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-slate-500">
                                        Created By
                                    </p>
                                    <p className="mt-1 font-medium">
                                        {selectedTask.creator}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    const updated = {
                                        ...selectedTask,
                                        status: "In Progress",
                                    };

                                    updateTask(updated);
                                }}
                                className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700"
                            >
                                Mark In Progress
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}