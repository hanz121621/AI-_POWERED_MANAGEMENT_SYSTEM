import { useMemo, useState } from "react";
import {
    AlertCircle,
    CalendarDays,
    CheckCircle2,
    CircleUserRound,
    Clock3,
    FileText,
    FolderKanban,
    GitBranch,
    MessageSquare,
    Paperclip,
    Play,
    RefreshCw,
    ShieldAlert,
    Timer,
    X,
} from "lucide-react";

// ============================================================
// CONT-TASK SUPPORT COMPONENT
// View Task Details
// ============================================================

const CURRENT_CONTRIBUTOR = {
    id: "USER-003",
    name: "Hana Nigussie",
    role: "Contributor",
};

const INITIAL_TASKS = [
    {
        id: "TASK-001",
        title: "Implement Contributor Dashboard",
        description:
            "Develop the contributor dashboard and connect the required project management features.",
        projectId: "PROJ-001",
        projectName: "AI Powered Management System",
        sprintId: "SPRINT-004",
        sprintName: "Sprint 4",
        assigneeId: "USER-003",
        assigneeName: "Hana Nigussie",
        priority: "High",
        status: "In Progress",
        progress: 35,
        startTime: "2026-08-22T09:30:00",
        dueDate: "2026-08-30",
    },
    {
        id: "TASK-002",
        title: "Implement Project Participation",
        description:
            "Implement the contributor project participation page and its project-related functionality.",
        projectId: "PROJ-001",
        projectName: "AI Powered Management System",
        sprintId: "SPRINT-004",
        sprintName: "Sprint 4",
        assigneeId: "USER-003",
        assigneeName: "Hana Nigussie",
        priority: "High",
        status: "In Progress",
        progress: 35,
        startTime: "2026-08-22T09:30:00",
        dueDate: "2026-08-28",
    },
    {
        id: "TASK-004",
        title: "Database Integration",
        description:
            "Integrate the project database with the application backend.",
        projectId: "PROJ-001",
        projectName: "AI Powered Management System",
        sprintId: "SPRINT-004",
        sprintName: "Sprint 4",
        assigneeId: "USER-003",
        assigneeName: "Hana Nigussie",
        priority: "High",
        status: "Blocked",
        progress: 20,
        startTime: null,
        dueDate: "2026-09-02",
    },
];

// ============================================================
// HELPERS
// ============================================================

function formatDate(date) {
    if (!date) {
        return "Not available";
    }

    return new Date(date).toLocaleDateString(
        undefined,
        {
            year: "numeric",
            month: "short",
            day: "numeric",
        }
    );
}

function formatDateTime(date) {
    if (!date) {
        return "Not started";
    }

    return new Date(date).toLocaleString(
        undefined,
        {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }
    );
}

function statusClasses(status) {
    switch (status) {
        case "In Progress":
            return "bg-blue-100 text-blue-700";

        case "Completed":
        case "Done":
            return "bg-emerald-100 text-emerald-700";

        case "Review":
            return "bg-purple-100 text-purple-700";

        case "Blocked":
            return "bg-red-100 text-red-700";

        default:
            return "bg-slate-100 text-slate-700";
    }
}

function priorityClasses(priority) {
    switch (priority) {
        case "High":
            return "bg-red-100 text-red-700";

        case "Medium":
            return "bg-amber-100 text-amber-700";

        case "Low":
            return "bg-emerald-100 text-emerald-700";

        default:
            return "bg-slate-100 text-slate-700";
    }
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function ViewTaskDetails() {
    const [tasks] = useState(INITIAL_TASKS);

    const [selectedTask, setSelectedTask] =
        useState(null);

    const [search, setSearch] = useState("");

    const assignedTasks = useMemo(() => {
        return tasks.filter(
            (task) =>
                task.assigneeId ===
                CURRENT_CONTRIBUTOR.id
        );
    }, [tasks]);

    const filteredTasks = useMemo(() => {
        const value = search
            .trim()
            .toLowerCase();

        if (!value) {
            return assignedTasks;
        }

        return assignedTasks.filter(
            (task) =>
                task.id
                    .toLowerCase()
                    .includes(value) ||
                task.title
                    .toLowerCase()
                    .includes(value) ||
                task.projectName
                    .toLowerCase()
                    .includes(value)
        );
    }, [assignedTasks, search]);

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="mx-auto max-w-7xl">

                {/* HEADER */}
                <div className="mb-6">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
                            <FileText size={25} />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">
                                Task Details
                            </h1>

                            <p className="text-sm text-slate-500">
                                View detailed information about your
                                assigned tasks.
                            </p>
                        </div>
                    </div>
                </div>

                {/* SEARCH */}
                <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <input
                        type="text"
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                        placeholder="Search your assigned tasks..."
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                {/* TASKS */}
                <div className="grid gap-5 lg:grid-cols-2">
                    {filteredTasks.map((task) => (
                        <TaskSummaryCard
                            key={task.id}
                            task={task}
                            onView={() =>
                                setSelectedTask(
                                    task
                                )
                            }
                        />
                    ))}
                </div>

                {filteredTasks.length === 0 && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
                        <FileText
                            size={35}
                            className="mx-auto text-slate-300"
                        />

                        <h2 className="mt-4 font-semibold text-slate-800">
                            No assigned tasks found
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Try a different search term.
                        </p>
                    </div>
                )}
            </div>

            {/* ====================================================
                DETAILS MODAL
            ==================================================== */}

            {selectedTask && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
                    <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white shadow-xl">

                        {/* MODAL HEADER */}
                        <div className="flex items-start justify-between border-b border-slate-100 p-6">
                            <div>
                                <p className="text-xs font-semibold text-blue-600">
                                    {selectedTask.id}
                                </p>

                                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                                    {selectedTask.title}
                                </h2>

                                <p className="mt-2 text-sm text-slate-500">
                                    {selectedTask.projectName}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedTask(
                                        null
                                    )
                                }
                                className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* STATUS / PRIORITY */}
                        <div className="flex flex-wrap gap-3 border-b border-slate-100 p-6">
                            <span
                                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusClasses(
                                    selectedTask.status
                                )}`}
                            >
                                {selectedTask.status}
                            </span>

                            <span
                                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${priorityClasses(
                                    selectedTask.priority
                                )}`}
                            >
                                {selectedTask.priority} Priority
                            </span>
                        </div>

                        {/* DESCRIPTION */}
                        <div className="border-b border-slate-100 p-6">
                            <h3 className="mb-3 font-bold text-slate-900">
                                Description
                            </h3>

                            <p className="text-sm leading-7 text-slate-600">
                                {selectedTask.description}
                            </p>
                        </div>

                        {/* INFORMATION */}
                        <div className="grid gap-4 border-b border-slate-100 p-6 sm:grid-cols-2 lg:grid-cols-3">

                            <InfoCard
                                icon={
                                    <FolderKanban
                                        size={18}
                                    />
                                }
                                label="Project"
                                value={
                                    selectedTask.projectName
                                }
                            />

                            <InfoCard
                                icon={
                                    <RefreshCw
                                        size={18}
                                    />
                                }
                                label="Sprint"
                                value={
                                    selectedTask.sprintName
                                }
                            />

                            <InfoCard
                                icon={
                                    <CircleUserRound
                                        size={18}
                                    />
                                }
                                label="Assigned To"
                                value={
                                    selectedTask.assigneeName
                                }
                            />

                            <InfoCard
                                icon={
                                    <CalendarDays
                                        size={18}
                                    />
                                }
                                label="Due Date"
                                value={formatDate(
                                    selectedTask.dueDate
                                )}
                            />

                            <InfoCard
                                icon={
                                    <Clock3
                                        size={18}
                                    />
                                }
                                label="Start Time"
                                value={formatDateTime(
                                    selectedTask.startTime
                                )}
                            />

                            <InfoCard
                                icon={
                                    <Timer size={18} />
                                }
                                label="Progress"
                                value={`${selectedTask.progress}%`}
                            />
                        </div>

                        {/* PROGRESS */}
                        <div className="border-b border-slate-100 p-6">
                            <div className="mb-2 flex items-center justify-between">
                                <span className="text-sm font-semibold text-slate-700">
                                    Task Progress
                                </span>

                                <span className="font-bold text-blue-600">
                                    {selectedTask.progress}%
                                </span>
                            </div>

                            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                                <div
                                    className="h-full rounded-full bg-blue-600 transition-all"
                                    style={{
                                        width: `${selectedTask.progress}%`,
                                    }}
                                />
                            </div>
                        </div>

                        {/* TASK CAPABILITIES */}
                        <div className="p-6">
                            <h3 className="mb-4 font-bold text-slate-900">
                                Task Information
                            </h3>

                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                <Capability
                                    icon={
                                        <Play size={17} />
                                    }
                                    label="Task Workflow"
                                    value={
                                        selectedTask.status
                                    }
                                />

                                <Capability
                                    icon={
                                        <GitBranch
                                            size={17}
                                        />
                                    }
                                    label="Dependencies"
                                    value="View dependencies"
                                />

                                <Capability
                                    icon={
                                        <MessageSquare
                                            size={17}
                                        />
                                    }
                                    label="Comments"
                                    value="Task communication"
                                />

                                <Capability
                                    icon={
                                        <Paperclip
                                            size={17}
                                        />
                                    }
                                    label="Attachments"
                                    value="Work files"
                                />

                                <Capability
                                    icon={
                                        <ShieldAlert
                                            size={17}
                                        />
                                    }
                                    label="Blocker"
                                    value="Report issue"
                                />

                                <Capability
                                    icon={
                                        <CheckCircle2
                                            size={17}
                                        />
                                    }
                                    label="Review"
                                    value="Submit when complete"
                                />
                            </div>
                        </div>

                        {/* WARNING */}
                        {selectedTask.status ===
                            "Blocked" && (
                            <div className="mx-6 mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                                <AlertCircle
                                    size={19}
                                    className="mt-0.5 shrink-0 text-red-600"
                                />

                                <div>
                                    <p className="text-sm font-semibold text-red-800">
                                        Task is blocked
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-red-700">
                                        This task currently cannot
                                        continue until its blocker or
                                        dependency is resolved.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* CLOSE */}
                        <div className="flex justify-end border-t border-slate-100 p-6">
                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedTask(
                                        null
                                    )
                                }
                                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
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

// ============================================================
// TASK SUMMARY CARD
// ============================================================

function TaskSummaryCard({
    task,
    onView,
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md">

            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-xs font-semibold text-blue-600">
                        {task.id}
                    </p>

                    <h2 className="mt-1 text-lg font-bold text-slate-900">
                        {task.title}
                    </h2>
                </div>

                <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses(
                        task.status
                    )}`}
                >
                    {task.status}
                </span>
            </div>

            <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
                {task.description}
            </p>

            <div className="mt-5">
                <div className="mb-2 flex justify-between text-xs">
                    <span className="text-slate-500">
                        Progress
                    </span>

                    <span className="font-semibold text-slate-700">
                        {task.progress}%
                    </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                        className="h-full rounded-full bg-blue-600"
                        style={{
                            width: `${task.progress}%`,
                        }}
                    />
                </div>
            </div>

            <button
                type="button"
                onClick={onView}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
                <FileText size={17} />
                View Task Details
            </button>
        </div>
    );
}

// ============================================================
// INFO CARD
// ============================================================

function InfoCard({
    icon,
    label,
    value,
}) {
    return (
        <div className="rounded-xl bg-slate-50 p-4">
            <div className="flex items-start gap-3">
                <div className="rounded-lg bg-white p-2 text-slate-600 shadow-sm">
                    {icon}
                </div>

                <div className="min-w-0">
                    <p className="text-xs text-slate-400">
                        {label}
                    </p>

                    <p className="mt-1 truncate text-sm font-semibold text-slate-800">
                        {value}
                    </p>
                </div>
            </div>
        </div>
    );
}

// ============================================================
// CAPABILITY
// ============================================================

function Capability({
    icon,
    label,
    value,
}) {
    return (
        <div className="rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
                <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                    {icon}
                </div>

                <div>
                    <p className="text-xs text-slate-400">
                        {label}
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                        {value}
                    </p>
                </div>
            </div>
        </div>
    );
}