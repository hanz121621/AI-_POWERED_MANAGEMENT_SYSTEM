
import { useMemo, useState } from "react";

import {
    AlertCircle,
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    CircleUserRound,
    ClipboardList,
    Clock3,
    FileText,
    FolderKanban,
    MessageSquare,
    Paperclip,
    RefreshCw,
    ShieldAlert,
    UserRound,
    UsersRound,
    X,
} from "lucide-react";



const MOCK_ASSIGNED_TASKS = [
    {
        id: "TASK-001",

        title: "Implement Contributor Dashboard",

        description:
            "Develop the contributor dashboard interface according to the approved project requirements. The dashboard should allow contributors to view their projects, assigned tasks, progress, communication, files, and relevant project information.",

        project: {
            id: "PROJ-001",
            name: "AI Powered Management System",
        },

        sprint: {
            id: "SPRINT-004",
            name: "Sprint 4",
        },

        priority: "High",

        status: "In Progress",

        dueDate: "2026-08-30",

        progress: 75,

        assignee: {
            id: "USER-003",
            name: "Hana Nigussie",
            role: "Developer",
        },

        dependencies: [
            {
                id: "DEP-001",
                title: "Complete authentication integration",
                status: "Completed",
            },
            {
                id: "DEP-002",
                title: "Connect contributor project API",
                status: "In Progress",
            },
        ],

        comments: [
            {
                id: "COMMENT-001",
                author: "Team Leader",
                role: "Team Leader",
                message:
                    "Please make sure the dashboard displays only information the contributor is authorized to access.",
                date: "2026-08-20 09:30",
            },
            {
                id: "COMMENT-002",
                author: "Project Manager",
                role: "Manager",
                message:
                    "Update the task progress after completing each major dashboard section.",
                date: "2026-08-21 14:15",
            },
        ],

        attachments: [
            {
                id: "FILE-001",
                name: "Contributor Dashboard Requirements.pdf",
                type: "PDF",
                size: "2.4 MB",
                uploadedBy: "Project Manager",
                uploadedDate: "2026-08-01",
            },
            {
                id: "FILE-002",
                name: "Contributor Dashboard UI.png",
                type: "Image",
                size: "1.1 MB",
                uploadedBy: "Team Leader",
                uploadedDate: "2026-08-05",
            },
        ],

        requirements: [
            "Contributor dashboard must display assigned projects.",
            "Contributor dashboard must display assigned tasks.",
            "Contributor must only access authorized project information.",
            "Task progress must be visible.",
            "Task status must be visible.",
        ],
    },

    {
        id: "TASK-002",

        title: "Implement Project Participation",

        description:
            "Implement the contributor project participation page and connect the contributor project use cases.",

        project: {
            id: "PROJ-001",
            name: "AI Powered Management System",
        },

        sprint: {
            id: "SPRINT-004",
            name: "Sprint 4",
        },

        priority: "High",

        status: "In Progress",

        dueDate: "2026-08-28",

        progress: 60,

        assignee: {
            id: "USER-003",
            name: "Hana Nigussie",
            role: "Developer",
        },

        dependencies: [
            {
                id: "DEP-003",
                title: "Project participation use cases",
                status: "Completed",
            },
        ],

        comments: [
            {
                id: "COMMENT-003",
                author: "Team Leader",
                role: "Team Leader",
                message:
                    "Make sure all project participation use cases are represented.",
                date: "2026-08-22 10:00",
            },
        ],

        attachments: [
            {
                id: "FILE-003",
                name: "Project Participation Use Cases.pdf",
                type: "PDF",
                size: "3.2 MB",
                uploadedBy: "Project Manager",
                uploadedDate: "2026-08-10",
            },
        ],

        requirements: [
            "Display assigned projects.",
            "Display project details.",
            "Display authorized project team.",
            "Display project tasks.",
            "Display project progress.",
            "Support project communication.",
            "Display authorized project files.",
            "Allow project assistance requests.",
        ],
    },
];

// ============================================================
// STATUS COLORS
// ============================================================

function getStatusClasses(status) {
    switch (status) {
        case "Completed":
        case "Done":
            return "bg-emerald-100 text-emerald-700";

        case "In Progress":
            return "bg-blue-100 text-blue-700";

        case "Review":
            return "bg-purple-100 text-purple-700";

        case "Blocked":
            return "bg-red-100 text-red-700";

        case "Backlog":
            return "bg-slate-100 text-slate-700";

        default:
            return "bg-slate-100 text-slate-700";
    }
}

// ============================================================
// PRIORITY COLORS
// ============================================================

function getPriorityClasses(priority) {
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
// DATE FORMATTER
// ============================================================

function formatDate(date) {
    if (!date) {
        return "Not available";
    }

    return new Date(date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function ViewAssignedTask({
    taskId = null,
    currentUserId = "USER-003",
    onBack,
}) {
    // --------------------------------------------------------
    // STATE
    // --------------------------------------------------------

    const [tasks] = useState(MOCK_ASSIGNED_TASKS);

    const [selectedTaskId, setSelectedTaskId] = useState(taskId);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState(null);

    const [selectedFile, setSelectedFile] = useState(null);

    // --------------------------------------------------------
    // FIND SELECTED TASK
    // --------------------------------------------------------

    const selectedTask = useMemo(() => {
        if (!selectedTaskId) {
            return null;
        }

        return tasks.find((task) => task.id === selectedTaskId) || null;
    }, [selectedTaskId, tasks]);

    // ========================================================
    // LOAD TASK
    // ========================================================

    const loadTask = async (id) => {
        setLoading(true);
        setError(null);

        try {
            // ------------------------------------------------
            // API INTEGRATION WILL BE ADDED HERE
            //
            // Example later:
            //
            // const response = await getAssignedTask(id);
            //
            // ------------------------------------------------

            await new Promise((resolve) =>
                setTimeout(resolve, 300)
            );

            const task = tasks.find((item) => item.id === id);

            // ------------------------------------------------
            // A1: TASK DOES NOT EXIST
            // ------------------------------------------------

            if (!task) {
                setError("Task not found.");
                return;
            }

            // ------------------------------------------------
            // A2: TASK IS NOT ASSIGNED TO CONTRIBUTOR
            // ------------------------------------------------

            if (task.assignee.id !== currentUserId) {
                setError(
                    "You do not have permission to access this task."
                );

                return;
            }

            setSelectedTaskId(id);

            // ------------------------------------------------
            // ACCESS RECORDING
            // ------------------------------------------------
            //
            // Later this should call the backend activity log:
            //
            // recordTaskAccess(task.id);
            //
        } catch {
            // ------------------------------------------------
            // A3: TASK INFORMATION CANNOT BE LOADED
            // ------------------------------------------------

            setError("Unable to load task information.");
        } finally {
            setLoading(false);
        }
    };

    // ========================================================
    // OPEN TASK
    // ========================================================

    const handleOpenTask = (id) => {
        loadTask(id);
    };

    // ========================================================
    // CLOSE TASK
    // ========================================================

    const handleCloseTask = () => {
        setSelectedTaskId(null);
        setError(null);
        setSelectedFile(null);

        if (onBack) {
            onBack();
        }
    };

    // ========================================================
    // RETRY
    // ========================================================

    const handleRetry = () => {
        if (selectedTaskId) {
            loadTask(selectedTaskId);
        }
    };

    // ========================================================
    // PERMITTED ACTION PLACEHOLDER
    // ========================================================
    //
    // CONT-TASK-001 says the Contributor can perform permitted
    // task actions.
    //
    // We do NOT approve, delete, reassign, or create tasks here.
    // Those responsibilities belong to other use cases/roles.
    //
    // These buttons can later connect to:
    // CONT-TASK-003 Update Task Progress
    // CONT-TASK-004 Update Task Status
    // CONT-TASK-005 Add Task Comment
    // CONT-TASK-006 Upload Task Attachment
    // etc.
    // ========================================================

    const handlePermittedAction = (action) => {
        console.log(`Permitted task action: ${action}`);
    };

    // ========================================================
    // TASK LIST VIEW
    // ========================================================

    if (!selectedTaskId) {
        return (
            <div className="min-h-screen bg-slate-50 p-6">
                <div className="mx-auto max-w-7xl">

                    {/* HEADER */}
                    <div className="mb-6">
                        <div className="flex items-center gap-3">

                            <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
                                <ClipboardList size={25} />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">
                                    My Tasks
                                </h1>

                                <p className="text-sm text-slate-500">
                                    View tasks assigned to you.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ERROR */}
                    {error && (
                        <ErrorMessage
                            message={error}
                            onClose={() => setError(null)}
                            onRetry={handleRetry}
                        />
                    )}

                    {/* LOADING */}
                    {loading && (
                        <LoadingMessage />
                    )}

                    {/* TASK LIST */}
                    {!loading && (
                        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                            {tasks
                                .filter(
                                    (task) =>
                                        task.assignee.id ===
                                        currentUserId
                                )
                                .map((task) => (
                                    <button
                                        key={task.id}
                                        type="button"
                                        onClick={() =>
                                            handleOpenTask(task.id)
                                        }
                                        className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
                                    >
                                        {/* TOP */}
                                        <div className="mb-4 flex items-start justify-between gap-3">

                                            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                                                <ClipboardList size={22} />
                                            </div>

                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                                                    task.status
                                                )}`}
                                            >
                                                {task.status}
                                            </span>
                                        </div>

                                        {/* TASK */}
                                        <h2 className="text-lg font-bold text-slate-900">
                                            {task.title}
                                        </h2>

                                        <p className="mt-1 text-xs text-slate-400">
                                            {task.id}
                                        </p>

                                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                                            {task.description}
                                        </p>

                                        {/* INFORMATION */}
                                        <div className="mt-5 space-y-3">

                                            <TaskListInfo
                                                icon={
                                                    <FolderKanban
                                                        size={16}
                                                    />
                                                }
                                                label="Project"
                                                value={
                                                    task.project.name
                                                }
                                            />

                                            <TaskListInfo
                                                icon={
                                                    <ClipboardList
                                                        size={16}
                                                    />
                                                }
                                                label="Sprint"
                                                value={
                                                    task.sprint.name
                                                }
                                            />

                                            <TaskListInfo
                                                icon={
                                                    <CalendarDays
                                                        size={16}
                                                    />
                                                }
                                                label="Due Date"
                                                value={formatDate(
                                                    task.dueDate
                                                )}
                                            />
                                        </div>

                                        {/* PRIORITY */}
                                        <div className="mt-4">

                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${getPriorityClasses(
                                                    task.priority
                                                )}`}
                                            >
                                                {task.priority} Priority
                                            </span>
                                        </div>

                                        {/* PROGRESS */}
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

                                        {/* FOOTER */}
                                        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">

                                            <span className="text-xs text-slate-500">
                                                Assigned to you
                                            </span>

                                            <span className="text-sm font-semibold text-blue-600">
                                                View Task →
                                            </span>
                                        </div>
                                    </button>
                                ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // ========================================================
    // ERROR STATE
    // ========================================================

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 p-6">
                <div className="mx-auto max-w-3xl">

                    <button
                        type="button"
                        onClick={handleCloseTask}
                        className="mb-5 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                    >
                        <ArrowLeft size={18} />
                        Back to My Tasks
                    </button>

                    <ErrorMessage
                        message={error}
                        onClose={() => setError(null)}
                        onRetry={handleRetry}
                    />
                </div>
            </div>
        );
    }

    // ========================================================
    // LOADING STATE
    // ========================================================

    if (loading || !selectedTask) {
        return (
            <div className="min-h-screen bg-slate-50 p-6">
                <div className="mx-auto max-w-7xl">
                    <LoadingMessage />
                </div>
            </div>
        );
    }

    // ========================================================
    // TASK DETAIL VIEW
    // ========================================================

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="mx-auto max-w-7xl">

                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                    <div className="flex items-center gap-3">

                        <button
                            type="button"
                            onClick={handleCloseTask}
                            className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:bg-slate-100"
                            title="Back to My Tasks"
                        >
                            <ArrowLeft size={20} />
                        </button>

                        <div>
                            <div className="flex items-center gap-2">

                                <h1 className="text-2xl font-bold text-slate-900">
                                    {selectedTask.title}
                                </h1>

                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                                        selectedTask.status
                                    )}`}
                                >
                                    {selectedTask.status}
                                </span>
                            </div>

                            <p className="mt-1 text-sm text-slate-500">
                                {selectedTask.id} · Assigned Task
                            </p>
                        </div>
                    </div>

                    {/* PERMITTED ACTIONS */}
                    <div className="flex flex-wrap gap-2">

                        <button
                            type="button"
                            onClick={() =>
                                handlePermittedAction(
                                    "Update Progress"
                                )
                            }
                            className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            Update Progress
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                handlePermittedAction(
                                    "Change Status"
                                )
                            }
                            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            Change Status
                        </button>
                    </div>
                </div>

                {/* ==================================================
                    MAIN GRID
                ================================================== */}

                <div className="grid gap-6 lg:grid-cols-3">

                    {/* =================================================
                        LEFT / MAIN CONTENT
                    ================================================= */}

                    <div className="space-y-6 lg:col-span-2">

                        {/* TASK DESCRIPTION */}
                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                            <div className="flex items-center gap-3">

                                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                                    <FileText size={21} />
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">
                                        Task Description
                                    </h2>

                                    <p className="text-sm text-slate-500">
                                        Task requirements and information.
                                    </p>
                                </div>
                            </div>

                            <p className="mt-5 text-sm leading-7 text-slate-600">
                                {selectedTask.description}
                            </p>
                        </section>

                        {/* TASK REQUIREMENTS */}
                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                            <div className="flex items-center gap-3">

                                <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                                    <CheckCircle2 size={21} />
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">
                                        Task Requirements
                                    </h2>

                                    <p className="text-sm text-slate-500">
                                        Requirements to review before
                                        performing the task.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5 space-y-3">

                                {selectedTask.requirements.map(
                                    (requirement, index) => (
                                        <div
                                            key={`${selectedTask.id}-requirement-${index}`}
                                            className="flex items-start gap-3 rounded-xl bg-slate-50 p-4"
                                        >
                                            <CheckCircle2
                                                size={18}
                                                className="mt-0.5 shrink-0 text-emerald-600"
                                            />

                                            <p className="text-sm leading-6 text-slate-700">
                                                {requirement}
                                            </p>
                                        </div>
                                    )
                                )}
                            </div>
                        </section>

                        {/* DEPENDENCIES */}
                        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

                            <div className="border-b border-slate-100 p-6">

                                <div className="flex items-center gap-3">

                                    <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
                                        <RefreshCw size={21} />
                                    </div>

                                    <div>
                                        <h2 className="text-lg font-bold text-slate-900">
                                            Dependencies
                                        </h2>

                                        <p className="text-sm text-slate-500">
                                            Tasks or requirements this task
                                            depends on.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="divide-y divide-slate-100">

                                {selectedTask.dependencies.length ===
                                0 ? (
                                    <div className="p-6 text-center text-sm text-slate-500">
                                        No dependencies.
                                    </div>
                                ) : (
                                    selectedTask.dependencies.map(
                                        (dependency) => (
                                            <div
                                                key={dependency.id}
                                                className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
                                            >
                                                <div>
                                                    <p className="font-semibold text-slate-800">
                                                        {
                                                            dependency.title
                                                        }
                                                    </p>

                                                    <p className="mt-1 text-xs text-slate-400">
                                                        {dependency.id}
                                                    </p>
                                                </div>

                                                <span
                                                    className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                                                        dependency.status
                                                    )}`}
                                                >
                                                    {
                                                        dependency.status
                                                    }
                                                </span>
                                            </div>
                                        )
                                    )
                                )}
                            </div>
                        </section>

                        {/* COMMENTS */}
                        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

                            <div className="border-b border-slate-100 p-6">

                                <div className="flex items-center gap-3">

                                    <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
                                        <MessageSquare size={21} />
                                    </div>

                                    <div>
                                        <h2 className="text-lg font-bold text-slate-900">
                                            Comments
                                        </h2>

                                        <p className="text-sm text-slate-500">
                                            Task-related communication.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="divide-y divide-slate-100">

                                {selectedTask.comments.length === 0 ? (
                                    <div className="p-6 text-center text-sm text-slate-500">
                                        No comments available.
                                    </div>
                                ) : (
                                    selectedTask.comments.map(
                                        (comment) => (
                                            <div
                                                key={comment.id}
                                                className="p-5"
                                            >
                                                <div className="flex items-start gap-3">

                                                    <div className="rounded-full bg-slate-100 p-2.5 text-slate-600">
                                                        <CircleUserRound
                                                            size={19}
                                                        />
                                                    </div>

                                                    <div className="min-w-0 flex-1">

                                                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

                                                            <div className="flex items-center gap-2">

                                                                <span className="text-sm font-semibold text-slate-900">
                                                                    {
                                                                        comment.author
                                                                    }
                                                                </span>

                                                                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                                                                    {
                                                                        comment.role
                                                                    }
                                                                </span>
                                                            </div>

                                                            <span className="text-xs text-slate-400">
                                                                {
                                                                    comment.date
                                                                }
                                                            </span>
                                                        </div>

                                                        <p className="mt-2 text-sm leading-6 text-slate-600">
                                                            {
                                                                comment.message
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    )
                                )}
                            </div>

                            <div className="border-t border-slate-100 p-5">

                                <button
                                    type="button"
                                    onClick={() =>
                                        handlePermittedAction(
                                            "Add Task Comment"
                                        )
                                    }
                                    className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-100"
                                >
                                    <MessageSquare size={17} />
                                    Add Comment
                                </button>
                            </div>
                        </section>

                        {/* ATTACHMENTS */}
                        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

                            <div className="border-b border-slate-100 p-6">

                                <div className="flex items-center gap-3">

                                    <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                                        <Paperclip size={21} />
                                    </div>

                                    <div>
                                        <h2 className="text-lg font-bold text-slate-900">
                                            Attachments
                                        </h2>

                                        <p className="text-sm text-slate-500">
                                            Files associated with this task.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="divide-y divide-slate-100">

                                {selectedTask.attachments.length ===
                                0 ? (
                                    <div className="p-6 text-center text-sm text-slate-500">
                                        No attachments available.
                                    </div>
                                ) : (
                                    selectedTask.attachments.map(
                                        (attachment) => (
                                            <div
                                                key={attachment.id}
                                                className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between"
                                            >
                                                <div className="flex items-center gap-3">

                                                    <div className="rounded-xl bg-slate-100 p-3 text-slate-600">
                                                        <FileText
                                                            size={20}
                                                        />
                                                    </div>

                                                    <div>
                                                        <p className="font-semibold text-slate-800">
                                                            {
                                                                attachment.name
                                                            }
                                                        </p>

                                                        <p className="mt-1 text-xs text-slate-500">
                                                            {
                                                                attachment.type
                                                            }{" "}
                                                            ·{" "}
                                                            {
                                                                attachment.size
                                                            }{" "}
                                                            · Uploaded by{" "}
                                                            {
                                                                attachment.uploadedBy
                                                            }
                                                        </p>

                                                        <p className="mt-1 text-xs text-slate-400">
                                                            {
                                                                attachment.uploadedDate
                                                            }
                                                        </p>
                                                    </div>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedFile(
                                                            attachment
                                                        )
                                                    }
                                                    className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-100"
                                                >
                                                    View Attachment
                                                </button>
                                            </div>
                                        )
                                    )
                                )}
                            </div>

                            <div className="border-t border-slate-100 p-5">

                                <button
                                    type="button"
                                    onClick={() =>
                                        handlePermittedAction(
                                            "Upload Task Attachment"
                                        )
                                    }
                                    className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-100"
                                >
                                    <Paperclip size={17} />
                                    Upload Attachment
                                </button>
                            </div>
                        </section>
                    </div>

                    {/* =================================================
                        RIGHT SIDEBAR
                    ================================================= */}

                    <div className="space-y-6">

                        {/* TASK INFORMATION */}
                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                            <h2 className="text-lg font-bold text-slate-900">
                                Task Information
                            </h2>

                            <div className="mt-5 space-y-4">

                                <InfoRow
                                    icon={
                                        <FolderKanban size={18} />
                                    }
                                    label="Project"
                                    value={
                                        selectedTask.project.name
                                    }
                                />

                                <InfoRow
                                    icon={
                                        <ClipboardList size={18} />
                                    }
                                    label="Sprint"
                                    value={
                                        selectedTask.sprint.name
                                    }
                                />

                                <InfoRow
                                    icon={
                                        <ShieldAlert size={18} />
                                    }
                                    label="Priority"
                                    value={selectedTask.priority}
                                    badge
                                    badgeClass={getPriorityClasses(
                                        selectedTask.priority
                                    )}
                                />

                                <InfoRow
                                    icon={
                                        <CheckCircle2 size={18} />
                                    }
                                    label="Status"
                                    value={selectedTask.status}
                                    badge
                                    badgeClass={getStatusClasses(
                                        selectedTask.status
                                    )}
                                />

                                <InfoRow
                                    icon={
                                        <CalendarDays size={18} />
                                    }
                                    label="Due Date"
                                    value={formatDate(
                                        selectedTask.dueDate
                                    )}
                                />
                            </div>
                        </section>

                        {/* PROGRESS */}
                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                            <div className="flex items-center justify-between">

                                <h2 className="text-lg font-bold text-slate-900">
                                    Progress
                                </h2>

                                <span className="text-2xl font-bold text-blue-600">
                                    {selectedTask.progress}%
                                </span>
                            </div>

                            <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">

                                <div
                                    className="h-full rounded-full bg-blue-600"
                                    style={{
                                        width: `${selectedTask.progress}%`,
                                    }}
                                />
                            </div>

                            <p className="mt-3 text-xs text-slate-500">
                                Current task completion.
                            </p>
                        </section>

                        {/* ASSIGNEE */}
                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                            <h2 className="text-lg font-bold text-slate-900">
                                Assignee
                            </h2>

                            <div className="mt-5 flex items-center gap-3">

                                <div className="rounded-full bg-blue-50 p-3 text-blue-600">
                                    <UserRound size={21} />
                                </div>

                                <div>

                                    <p className="font-semibold text-slate-900">
                                        {
                                            selectedTask.assignee
                                                .name
                                        }
                                    </p>

                                    <p className="text-sm text-slate-500">
                                        {
                                            selectedTask.assignee
                                                .role
                                        }
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* ACCESS INFORMATION */}
                        <section className="rounded-2xl border border-blue-100 bg-blue-50 p-6">

                            <div className="flex items-start gap-3">

                                <div className="rounded-xl bg-white p-3 text-blue-600">
                                    <UsersRound size={20} />
                                </div>

                                <div>

                                    <h2 className="font-bold text-blue-900">
                                        Authorized Access
                                    </h2>

                                    <p className="mt-2 text-sm leading-6 text-blue-700">
                                        This task is assigned to you.
                                        You can review the task
                                        requirements and perform
                                        permitted contributor actions.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* ACTIVITY */}
                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                            <div className="flex items-center gap-3">

                                <Clock3
                                    size={19}
                                    className="text-slate-500"
                                />

                                <div>
                                    <h2 className="font-bold text-slate-900">
                                        Task Access
                                    </h2>

                                    <p className="mt-1 text-xs text-slate-500">
                                        Access is recorded where
                                        required.
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            {/* ========================================================
                ATTACHMENT MODAL
            ======================================================== */}

            {selectedFile && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">

                    <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

                        <div className="flex items-center justify-between border-b border-slate-100 p-5">

                            <div>
                                <h2 className="font-bold text-slate-900">
                                    Attachment
                                </h2>

                                <p className="mt-1 text-xs text-slate-500">
                                    Authorized task attachment
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedFile(null)
                                }
                                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                            >
                                <X size={19} />
                            </button>
                        </div>

                        <div className="p-6">

                            <div className="rounded-xl bg-slate-50 p-5">

                                <div className="flex items-center gap-4">

                                    <div className="rounded-xl bg-white p-3 text-blue-600 shadow-sm">
                                        <FileText size={25} />
                                    </div>

                                    <div>
                                        <p className="font-semibold text-slate-900">
                                            {selectedFile.name}
                                        </p>

                                        <p className="mt-1 text-sm text-slate-500">
                                            {selectedFile.type} ·{" "}
                                            {selectedFile.size}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <p className="mt-4 text-sm text-slate-500">
                                File viewing/download integration will
                                connect to the backend file service.
                            </p>
                        </div>

                        <div className="flex justify-end border-t border-slate-100 p-5">

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedFile(null)
                                }
                                className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
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
// INFO ROW
// ============================================================

function InfoRow({
    icon,
    label,
    value,
    badge = false,
    badgeClass = "",
}) {
    return (
        <div className="flex items-start gap-3">

            <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                {icon}
            </div>

            <div className="min-w-0 flex-1">

                <p className="text-xs font-medium text-slate-400">
                    {label}
                </p>

                {badge ? (
                    <span
                        className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${badgeClass}`}
                    >
                        {value}
                    </span>
                ) : (
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                        {value}
                    </p>
                )}
            </div>
        </div>
    );
}

// ============================================================
// TASK LIST INFO
// ============================================================

function TaskListInfo({ icon, label, value }) {
    return (
        <div className="flex items-center gap-2">

            <span className="text-slate-400">
                {icon}
            </span>

            <span className="text-xs text-slate-500">
                {label}:
            </span>

            <span className="truncate text-xs font-semibold text-slate-700">
                {value}
            </span>
        </div>
    );
}

// ============================================================
// ERROR MESSAGE
// ============================================================

function ErrorMessage({
    message,
    onClose,
    onRetry,
}) {
    return (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">

            <div className="flex items-start gap-3">

                <div className="rounded-xl bg-white p-3 text-red-600">
                    <AlertCircle size={21} />
                </div>

                <div className="flex-1">

                    <h2 className="font-bold text-red-800">
                        Unable to access task
                    </h2>

                    <p className="mt-1 text-sm text-red-700">
                        {message}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">

                        {onRetry && (
                            <button
                                type="button"
                                onClick={onRetry}
                                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                            >
                                Try Again
                            </button>
                        )}

                        {onClose && (
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
                            >
                                Close
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================================
// LOADING MESSAGE
// ============================================================

function LoadingMessage() {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">

                <RefreshCw
                    size={24}
                    className="animate-spin"
                />
            </div>

            <h2 className="font-semibold text-slate-800">
                Loading task information...
            </h2>

            <p className="mt-2 text-sm text-slate-500">
                Please wait while the assigned task is loaded.
            </p>
        </div>
    );
}
