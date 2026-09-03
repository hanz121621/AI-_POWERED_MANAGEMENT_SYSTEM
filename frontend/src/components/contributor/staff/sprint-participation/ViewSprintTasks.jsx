
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
        const normalizedStatus = String(status)
            .toLowerCase()
            .trim();

        switch (normalizedStatus) {
            case "completed":
                return "bg-primary/10 text-primary border-primary/30";

            case "in progress":
                return "bg-primary/10 text-primary border-primary/30";

            case "blocked":
                return "bg-muted text-muted-foreground border-border";

            case "cancelled":
            case "canceled":
                return "bg-muted text-muted-foreground border-border";

            default:
                return "bg-muted text-muted-foreground border-border";
        }
    };

    // ========================================================
    // PRIORITY STYLE
    // ========================================================

    const getPriorityClass = (priority) => {
        const normalizedPriority = String(priority)
            .toLowerCase()
            .trim();

        switch (normalizedPriority) {
            case "high":
            case "urgent":
                return "text-primary";

            case "medium":
                return "text-primary";

            case "low":
                return "text-primary";

            default:
                return "text-muted-foreground";
        }
    };

    // ========================================================
    // STATUS ICON
    // ========================================================

    const getStatusIcon = (status) => {
        const normalizedStatus = String(status)
            .toLowerCase()
            .trim();

        switch (normalizedStatus) {
            case "completed":
                return (
                    <CircleCheck
                        size={16}
                        className="text-primary"
                    />
                );

            case "in progress":
                return (
                    <Clock3
                        size={16}
                        className="text-primary"
                    />
                );

            case "blocked":
                return (
                    <AlertCircle
                        size={16}
                        className="text-muted-foreground"
                    />
                );

            default:
                return (
                    <Clock3
                        size={16}
                        className="text-muted-foreground"
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
        <div className="w-full space-y-6">
            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                            <ListChecks
                                size={25}
                                className="text-primary"
                            />
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-foreground">
                                Sprint Tasks
                            </h2>

                            <p className="mt-1 text-sm text-muted-foreground">
                                STAFF-SPRINT-001
                            </p>
                        </div>
                    </div>

                    <p className="mt-3 text-sm text-muted-foreground">
                        View the tasks assigned to you within the
                        current sprint.
                    </p>
                </div>

                {/* REFRESH */}
                <button
                    type="button"
                    onClick={refreshTasks}
                    className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted"
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
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                />

                <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) =>
                        setSearchTerm(event.target.value)
                    }
                    placeholder="Search sprint tasks..."
                    className="w-full rounded-xl border border-border bg-card py-3 pl-11 pr-4 text-sm text-foreground outline-none placeholder:text-muted-foreground transition focus:border-primary focus:ring-1 focus:ring-primary"
                />
            </div>

            {/* ==================================================
                SUMMARY
            ================================================== */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {/* TOTAL */}
                <div className="rounded-2xl border border-border bg-card p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Sprint Tasks
                            </p>

                            <p className="mt-2 text-3xl font-bold text-foreground">
                                {filteredTasks.length}
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                            <ListChecks
                                size={22}
                                className="text-primary"
                            />
                        </div>
                    </div>
                </div>

                {/* COMPLETED */}
                <div className="rounded-2xl border border-border bg-card p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Completed
                            </p>

                            <p className="mt-2 text-3xl font-bold text-primary">
                                {
                                    filteredTasks.filter(
                                        (task) =>
                                            String(
                                                task.status ||
                                                    task.taskStatus ||
                                                    ""
                                            )
                                                .toLowerCase()
                                                .trim() ===
                                            "completed"
                                    ).length
                                }
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                            <CircleCheck
                                size={22}
                                className="text-primary"
                            />
                        </div>
                    </div>
                </div>

                {/* IN PROGRESS */}
                <div className="rounded-2xl border border-border bg-card p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                In Progress
                            </p>

                            <p className="mt-2 text-3xl font-bold text-primary">
                                {
                                    filteredTasks.filter(
                                        (task) =>
                                            String(
                                                task.status ||
                                                    task.taskStatus ||
                                                    ""
                                            )
                                                .toLowerCase()
                                                .trim() ===
                                            "in progress"
                                    ).length
                                }
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                            <Clock3
                                size={22}
                                className="text-primary"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* ==================================================
                TASK LIST
            ================================================== */}

            {filteredTasks.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                        <ListChecks
                            size={30}
                            className="text-muted-foreground"
                        />
                    </div>

                    <h3 className="mt-5 text-lg font-semibold text-foreground">
                        No sprint tasks found
                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
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
                                className="rounded-2xl border border-border bg-card p-5 transition hover:border-primary/50"
                            >
                                {/* TASK TOP */}
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                    {/* LEFT */}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="text-lg font-semibold text-foreground">
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

                                        <p className="mt-3 text-sm leading-6 text-muted-foreground">
                                            {description}
                                        </p>
                                    </div>

                                    {/* RIGHT */}
                                    <div className="flex items-center gap-2">
                                        {getStatusIcon(status)}

                                        <span className="text-sm text-muted-foreground">
                                            {status}
                                        </span>
                                    </div>
                                </div>

                                {/* TASK DETAILS */}
                                <div className="mt-5 grid grid-cols-1 gap-3 border-t border-border pt-5 sm:grid-cols-2 lg:grid-cols-4">
                                    {/* PROJECT */}
                                    <div className="rounded-xl bg-muted p-3">
                                        <p className="text-xs text-muted-foreground">
                                            Project
                                        </p>

                                        <p className="mt-1 truncate text-sm font-medium text-card-foreground">
                                            {project}
                                        </p>
                                    </div>

                                    {/* SPRINT */}
                                    <div className="rounded-xl bg-muted p-3">
                                        <p className="text-xs text-muted-foreground">
                                            Sprint
                                        </p>

                                        <p className="mt-1 truncate text-sm font-medium text-card-foreground">
                                            {sprint}
                                        </p>
                                    </div>

                                    {/* PRIORITY */}
                                    <div className="rounded-xl bg-muted p-3">
                                        <p className="text-xs text-muted-foreground">
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
                                    <div className="rounded-xl bg-muted p-3">
                                        <p className="text-xs text-muted-foreground">
                                            Due Date
                                        </p>

                                        <div className="mt-1 flex items-center gap-2">
                                            <CalendarDays
                                                size={15}
                                                className="text-muted-foreground"
                                            />

                                            <span className="text-sm font-medium text-card-foreground">
                                                {formatDate(
                                                    dueDate
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* TASK ID */}
                                {(task.id || task.taskId) && (
                                    <div className="mt-4 text-xs text-muted-foreground">
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
