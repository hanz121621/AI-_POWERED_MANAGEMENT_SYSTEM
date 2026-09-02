
import { useMemo, useState } from "react";

import {
    ListChecks,
    Search,
    RefreshCw,
    CalendarDays,
    Flag,
    CircleCheck,
    Clock3,
    AlertCircle,
} from "lucide-react";

// ============================================================
// STAFF - VIEW SPRINT TASKS
// STAFF-SPRINT-001
// ============================================================

// ============================================================
// LOAD TASKS FROM LOCAL STORAGE
// ============================================================

const getStoredTasks = () => {
    try {
        const stored =
            localStorage.getItem("aipms_staff_tasks") ||
            localStorage.getItem("staffTasks");

        if (!stored) {
            return [];
        }

        const parsed = JSON.parse(stored);

        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error("Failed to load sprint tasks:", error);
        return [];
    }
};

// ============================================================
// COMPONENT
// ============================================================

function ViewSprintTasks() {
    const [tasks, setTasks] = useState(getStoredTasks);
    const [searchTerm, setSearchTerm] = useState("");

    // ========================================================
    // FILTER TASKS
    // ========================================================

    const filteredTasks = useMemo(() => {
        const search = searchTerm.trim().toLowerCase();

        if (!search) {
            return tasks;
        }

        return tasks.filter((task) => {
            const title = String(
                task.title ||
                    task.taskTitle ||
                    ""
            ).toLowerCase();

            const description = String(
                task.description || ""
            ).toLowerCase();

            const project = String(
                task.projectName ||
                    task.project ||
                    ""
            ).toLowerCase();

            const sprint = String(
                task.sprintName ||
                    task.sprint ||
                    ""
            ).toLowerCase();

            const status = String(
                task.status ||
                    task.taskStatus ||
                    ""
            ).toLowerCase();

            const priority = String(
                task.priority || ""
            ).toLowerCase();

            return (
                title.includes(search) ||
                description.includes(search) ||
                project.includes(search) ||
                sprint.includes(search) ||
                status.includes(search) ||
                priority.includes(search)
            );
        });
    }, [tasks, searchTerm]);

    // ========================================================
    // REFRESH TASKS
    // ========================================================

    const refreshTasks = () => {
        setTasks(getStoredTasks());
    };

    // ========================================================
    // STATUS STYLE
    // ========================================================

    const getStatusClass = (status) => {
        switch (String(status).toLowerCase()) {
            case "completed":
                return "bg-green-500/10 text-green-400 border-green-500/20";

            case "in progress":
                return "bg-blue-500/10 text-blue-400 border-blue-500/20";

            case "blocked":
                return "bg-red-500/10 text-red-400 border-red-500/20";

            case "cancelled":
            case "canceled":
                return "bg-slate-500/10 text-slate-400 border-slate-500/20";

            default:
                return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
        }
    };

    // ========================================================
    // PRIORITY STYLE
    // ========================================================

    const getPriorityClass = (priority) => {
        switch (String(priority).toLowerCase()) {
            case "high":
            case "urgent":
                return "text-red-400";

            case "medium":
                return "text-yellow-400";

            case "low":
                return "text-green-400";

            default:
                return "text-slate-400";
        }
    };

    // ========================================================
    // STATUS ICON
    // ========================================================

    const getStatusIcon = (status) => {
        switch (String(status).toLowerCase()) {
            case "completed":
                return (
                    <CircleCheck
                        size={16}
                        className="text-green-400"
                    />
                );

            case "in progress":
                return (
                    <Clock3
                        size={16}
                        className="text-blue-400"
                    />
                );

            case "blocked":
                return (
                    <AlertCircle
                        size={16}
                        className="text-red-400"
                    />
                );

            default:
                return (
                    <Clock3
                        size={16}
                        className="text-yellow-400"
                    />
                );
        }
    };

    // ========================================================
    // DATE FORMATTER
    // ========================================================

    const formatDate = (date) => {
        if (!date) {
            return "Not set";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "Not set";
        }

        return parsedDate.toLocaleDateString();
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="space-y-6">
            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10">
                            <ListChecks
                                size={25}
                                className="text-blue-400"
                            />
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-white">
                                Sprint Tasks
                            </h2>

                            <p className="mt-1 text-sm text-slate-400">
                                STAFF-SPRINT-001
                            </p>
                        </div>
                    </div>

                    <p className="mt-3 text-sm text-slate-400">
                        View the tasks assigned to you within the
                        current sprint.
                    </p>
                </div>

                {/* REFRESH */}
                <button
                    type="button"
                    onClick={refreshTasks}
                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
                >
                    <RefreshCw size={17} />

                    Refresh
                </button>
            </div>

            {/* ==================================================
                SEARCH
            ================================================== */}

            <div className="relative">
                <Search
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) =>
                        setSearchTerm(event.target.value)
                    }
                    placeholder="Search sprint tasks..."
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-500 transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
            </div>

            {/* ==================================================
                SUMMARY
            ================================================== */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {/* TOTAL */}
                <div className="rounded-2xl border border-slate-700 bg-slate-950 p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400">
                                Sprint Tasks
                            </p>

                            <p className="mt-2 text-3xl font-bold text-white">
                                {filteredTasks.length}
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10">
                            <ListChecks
                                size={22}
                                className="text-blue-400"
                            />
                        </div>
                    </div>
                </div>

                {/* COMPLETED */}
                <div className="rounded-2xl border border-slate-700 bg-slate-950 p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400">
                                Completed
                            </p>

                            <p className="mt-2 text-3xl font-bold text-green-400">
                                {
                                    filteredTasks.filter(
                                        (task) =>
                                            String(
                                                task.status ||
                                                    task.taskStatus ||
                                                    ""
                                            ).toLowerCase() ===
                                            "completed"
                                    ).length
                                }
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/10">
                            <CircleCheck
                                size={22}
                                className="text-green-400"
                            />
                        </div>
                    </div>
                </div>

                {/* IN PROGRESS */}
                <div className="rounded-2xl border border-slate-700 bg-slate-950 p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400">
                                In Progress
                            </p>

                            <p className="mt-2 text-3xl font-bold text-blue-400">
                                {
                                    filteredTasks.filter(
                                        (task) =>
                                            String(
                                                task.status ||
                                                    task.taskStatus ||
                                                    ""
                                            ).toLowerCase() ===
                                            "in progress"
                                    ).length
                                }
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10">
                            <Clock3
                                size={22}
                                className="text-blue-400"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* ==================================================
                TASK LIST
            ================================================== */}

            {filteredTasks.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-10 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-800">
                        <ListChecks
                            size={30}
                            className="text-slate-500"
                        />
                    </div>

                    <h3 className="mt-5 text-lg font-semibold text-white">
                        No sprint tasks found
                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                        {searchTerm
                            ? "No tasks match your search."
                            : "No tasks are currently assigned to you in the sprint."}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredTasks.map((task, index) => {
                        const taskId =
                            task.id ||
                            task.taskId ||
                            index;

                        const taskTitle =
                            task.title ||
                            task.taskTitle ||
                            `Task ${index + 1}`;

                        const description =
                            task.description ||
                            "No task description available.";

                        const status =
                            task.status ||
                            task.taskStatus ||
                            "Pending";

                        const priority =
                            task.priority ||
                            "Normal";

                        const project =
                            task.projectName ||
                            task.project ||
                            "No project";

                        const sprint =
                            task.sprintName ||
                            task.sprint ||
                            "Current sprint";

                        const dueDate =
                            task.dueDate ||
                            task.deadline ||
                            null;

                        return (
                            <div
                                key={taskId}
                                className="rounded-2xl border border-slate-700 bg-slate-950 p-5 transition hover:border-blue-500/50"
                            >
                                {/* TASK TOP */}
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                    {/* LEFT */}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="text-lg font-semibold text-white">
                                                {taskTitle}
                                            </h3>

                                            <span
                                                className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusClass(
                                                    status
                                                )}`}
                                            >
                                                {status}
                                            </span>
                                        </div>

                                        <p className="mt-3 text-sm leading-6 text-slate-400">
                                            {description}
                                        </p>
                                    </div>

                                    {/* RIGHT */}
                                    <div className="flex items-center gap-2">
                                        {getStatusIcon(status)}

                                        <span className="text-sm text-slate-400">
                                            {status}
                                        </span>
                                    </div>
                                </div>

                                {/* TASK DETAILS */}
                                <div className="mt-5 grid grid-cols-1 gap-3 border-t border-slate-800 pt-5 sm:grid-cols-2 lg:grid-cols-4">
                                    {/* PROJECT */}
                                    <div className="rounded-xl bg-slate-900 p-3">
                                        <p className="text-xs text-slate-500">
                                            Project
                                        </p>

                                        <p className="mt-1 truncate text-sm font-medium text-slate-300">
                                            {project}
                                        </p>
                                    </div>

                                    {/* SPRINT */}
                                    <div className="rounded-xl bg-slate-900 p-3">
                                        <p className="text-xs text-slate-500">
                                            Sprint
                                        </p>

                                        <p className="mt-1 truncate text-sm font-medium text-slate-300">
                                            {sprint}
                                        </p>
                                    </div>

                                    {/* PRIORITY */}
                                    <div className="rounded-xl bg-slate-900 p-3">
                                        <p className="text-xs text-slate-500">
                                            Priority
                                        </p>

                                        <div className="mt-1 flex items-center gap-2">
                                            <Flag
                                                size={15}
                                                className={getPriorityClass(
                                                    priority
                                                )}
                                            />

                                            <span
                                                className={`text-sm font-medium ${getPriorityClass(
                                                    priority
                                                )}`}
                                            >
                                                {priority}
                                            </span>
                                        </div>
                                    </div>

                                    {/* DUE DATE */}
                                    <div className="rounded-xl bg-slate-900 p-3">
                                        <p className="text-xs text-slate-500">
                                            Due Date
                                        </p>

                                        <div className="mt-1 flex items-center gap-2">
                                            <CalendarDays
                                                size={15}
                                                className="text-slate-400"
                                            />

                                            <span className="text-sm font-medium text-slate-300">
                                                {formatDate(
                                                    dueDate
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* TASK ID */}
                                {(task.id || task.taskId) && (
                                    <div className="mt-4 text-xs text-slate-600">
                                        Task ID:{" "}
                                        {task.id || task.taskId}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default ViewSprintTasks;
