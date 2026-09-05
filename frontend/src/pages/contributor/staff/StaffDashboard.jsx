import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    BriefcaseBusiness,
    CheckCircle2,
    Clock3,
    AlertCircle,
    ClipboardList,
    FileText,
    MessageSquare,
    Upload,
    Send,
    ArrowRight,
    CalendarDays,
    FolderKanban,
    UserRound,
    Award,
    CircleDot,
    Search,
    Filter,
    X,
} from "lucide-react";

// ============================================================
// API CLIENT
// ============================================================
//
// Adjust this import path if your api.js is located elsewhere.
//
// Example:
// src/services/api.js
//
// If StaffDashboard.jsx is:
// src/components/contributor/staff/StaffDashboard.jsx
//
// then use:
// ../../../services/api
//
// ============================================================

import api from "../../../services/api";

// ============================================================
// STATUS CONFIG
// ============================================================

const STATUS_CONFIG = {
    Backlog: {
        className:
            "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
        icon: CircleDot,
    },

    "In Progress": {
        className:
            "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
        icon: Clock3,
    },

    Review: {
        className:
            "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300",
        icon: FileText,
    },

    Blocked: {
        className:
            "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300",
        icon: AlertCircle,
    },

    Done: {
        className:
            "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300",
        icon: CheckCircle2,
    },
};

// ============================================================
// PRIORITY CONFIG
// ============================================================

const PRIORITY_CONFIG = {
    High: "text-red-600 dark:text-red-400",
    Medium: "text-orange-600 dark:text-orange-400",
    Low: "text-green-600 dark:text-green-400",
};

// ============================================================
// HELPER
// ============================================================

function formatDate(dateString) {
    if (!dateString) {
        return "No date";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return "No date";
    }

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

// ============================================================
// NORMALIZE BACKEND STATUS
// ============================================================
//
// Backend enum:
//
// Todo
// InProgress
// InReview
// Blocked
// Completed
//
// Frontend UI:
//
// Backlog
// In Progress
// Review
// Blocked
// Done
//
// ============================================================

function normalizeStatus(status) {
    if (typeof status === "string") {
        const normalized = status
            .trim()
            .toLowerCase()
            .replace(/[\s_-]/g, "");

        switch (normalized) {
            case "todo":
                return "Backlog";

            case "inprogress":
                return "In Progress";

            case "inreview":
                return "Review";

            case "blocked":
                return "Blocked";

            case "completed":
            case "done":
                return "Done";

            case "backlog":
                return "Backlog";

            case "review":
                return "Review";

            default:
                return "Backlog";
        }
    }

    // Fallback for numeric enum serialization.
    //
    // IMPORTANT:
    // These numeric values assume the enum declaration
    // follows the expected order.
    //
    // String enum serialization is preferred.

    switch (status) {
        case 0:
            return "Backlog";

        case 1:
            return "In Progress";

        case 2:
            return "Review";

        case 3:
            return "Blocked";

        case 4:
            return "Done";

        default:
            return "Backlog";
    }
}

// ============================================================
// NORMALIZE BACKEND PRIORITY
// ============================================================

function normalizePriority(priority) {
    if (typeof priority === "string") {
        const normalized = priority
            .trim()
            .toLowerCase();

        switch (normalized) {
            case "high":
                return "High";

            case "medium":
                return "Medium";

            case "low":
                return "Low";

            default:
                return priority;
        }
    }

    // Fallback for numeric enum serialization.
    switch (priority) {
        case 0:
            return "Low";

        case 1:
            return "Medium";

        case 2:
            return "High";

        default:
            return "Low";
    }
}

// ============================================================
// CALCULATE PROGRESS
// ============================================================
//
// TaskDto currently does not have a Progress property.
//
// Therefore, for now:
//
// ActualHours / EstimatedHours * 100
//
// Completed task = 100%
//
// ============================================================

function calculateProgress(
    actualHours,
    estimatedHours,
    status
) {
    if (status === "Done") {
        return 100;
    }

    const estimated =
        Number(estimatedHours) || 0;

    const actual =
        Number(actualHours) || 0;

    if (estimated <= 0) {
        return 0;
    }

    return Math.min(
        100,
        Math.max(
            0,
            Math.round(
                (actual / estimated) * 100
            )
        )
    );
}

// ============================================================
// MAP BACKEND TASK TO FRONTEND TASK
// ============================================================

function mapBackendTask(task) {
    const status = normalizeStatus(
        task.status
    );

    const priority = normalizePriority(
        task.priority
    );

    return {
        // Backend
        id: task.id,

        title:
            task.title ||
            "Untitled Task",

        description:
            task.description ||
            "",

        sprintId:
            task.sprintId,

        priority,

        status,

        dueDate:
            task.dueDate,

        estimatedHours:
            Number(task.estimatedHours) || 0,

        actualHours:
            Number(task.actualHours) || 0,

        assignedContributorSDId:
            task.assignedContributorSDId,

        createdBy:
            task.createdBy,

        createdAt:
            task.createdAt,

        updatedAt:
            task.updatedAt,

        // ----------------------------------------------------
        // FRONTEND DISPLAY VALUES
        // ----------------------------------------------------
        //
        // These values are not currently provided by TaskDto.
        //
        // We keep placeholders until the backend DTO is expanded.
        //

        project: "Project",

        sprint: task.sprintId
            ? `Sprint ${String(task.sprintId).substring(0, 8)}`
            : "Sprint",

        specialization:
            "Not specified",

        progress:
            calculateProgress(
                task.actualHours,
                task.estimatedHours,
                status
            ),
    };
}

// ============================================================
// STAT CARD
// ============================================================

function StatCard({
    title,
    value,
    description,
    icon: Icon,
    iconClass,
}) {
    return (
        <div
            className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
                transition
                hover:shadow-md

                dark:border-blue-900/60
                dark:bg-[#0b2038]
            "
        >
            <div className="flex items-start justify-between">
                <div>
                    <p
                        className="
                            text-sm
                            font-medium
                            text-slate-500
                            dark:text-slate-400
                        "
                    >
                        {title}
                    </p>

                    <h3
                        className="
                            mt-2
                            text-3xl
                            font-bold
                            text-slate-900
                            dark:text-white
                        "
                    >
                        {value}
                    </h3>

                    <p
                        className="
                            mt-1
                            text-xs
                            text-slate-400
                            dark:text-slate-500
                        "
                    >
                        {description}
                    </p>
                </div>

                <div
                    className={`
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-xl
                        ${iconClass}
                    `}
                >
                    <Icon className="h-5 w-5" />
                </div>
            </div>
        </div>
    );
}

// ============================================================
// STATUS BADGE
// ============================================================

function StatusBadge({ status }) {
    const config =
        STATUS_CONFIG[status] ||
        STATUS_CONFIG.Backlog;

    const Icon = config.icon;

    return (
        <span
            className={`
                inline-flex
                items-center
                gap-1.5
                rounded-full
                px-2.5
                py-1
                text-xs
                font-semibold
                ${config.className}
            `}
        >
            <Icon className="h-3.5 w-3.5" />

            {status}
        </span>
    );
}

// ============================================================
// PRIORITY BADGE
// ============================================================

function PriorityBadge({ priority }) {
    return (
        <span
            className={`
                text-xs
                font-semibold
                ${
                    PRIORITY_CONFIG[priority] ||
                    PRIORITY_CONFIG.Low
                }
            `}
        >
            {priority}
        </span>
    );
}

// ============================================================
// TASK DETAILS MODAL
// ============================================================

function TaskDetailsModal({
    task,
    onClose,
    onUpdateStatus,
    onAddComment,
    onUpload,
    onSubmit,
}) {
    const [comment, setComment] = useState("");

    const [status, setStatus] =
        useState(task?.status || "Backlog");

    if (!task) {
        return null;
    }

    const handleStatusUpdate = () => {
        onUpdateStatus(
            task.id,
            status
        );
    };

    const handleComment = () => {
        if (!comment.trim()) {
            alert(
                "Comment cannot be empty."
            );

            return;
        }

        onAddComment(
            task.id,
            comment
        );

        setComment("");
    };

    const handleUpload = () => {
        onUpload(task.id);
    };

    const handleSubmit = () => {
        onSubmit(task.id);
    };

    return (
        <div
            className="
                fixed
                inset-0
                z-[100]
                flex
                items-center
                justify-center
                bg-slate-950/60
                p-4
                backdrop-blur-sm
            "
        >
            <div
                className="
                    max-h-[90vh]
                    w-full
                    max-w-3xl
                    overflow-y-auto
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    shadow-2xl

                    dark:border-blue-900/60
                    dark:bg-[#0b2038]
                "
            >
                {/* HEADER */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        border-b
                        border-slate-200
                        px-6
                        py-5

                        dark:border-blue-900/60
                    "
                >
                    <div>
                        <p
                            className="
                                text-xs
                                font-semibold
                                uppercase
                                tracking-wider
                                text-blue-600
                                dark:text-blue-400
                            "
                        >
                            {task.id}
                        </p>

                        <h2
                            className="
                                mt-1
                                text-xl
                                font-bold
                                text-slate-900
                                dark:text-white
                            "
                        >
                            {task.title}
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            rounded-lg
                            p-2
                            text-slate-500
                            transition
                            hover:bg-slate-100
                            hover:text-slate-700

                            dark:hover:bg-blue-950/50
                            dark:hover:text-white
                        "
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* BODY */}

                <div className="space-y-6 p-6">

                    {/* DESCRIPTION */}

                    <div>
                        <h3
                            className="
                                text-sm
                                font-semibold
                                text-slate-900
                                dark:text-white
                            "
                        >
                            Description
                        </h3>

                        <p
                            className="
                                mt-2
                                text-sm
                                leading-6
                                text-slate-600
                                dark:text-slate-300
                            "
                        >
                            {task.description ||
                                "No description provided."}
                        </p>
                    </div>

                    {/* DETAILS */}

                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-4
                            sm:grid-cols-2
                        "
                    >
                        <div>
                            <p className="text-xs text-slate-400">
                                Project
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    font-semibold
                                    text-slate-800
                                    dark:text-white
                                "
                            >
                                {task.project}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-slate-400">
                                Sprint
                            </p>

                            <p
                                className="
                                    mt-1
                                    break-all
                                    text-sm
                                    font-semibold
                                    text-slate-800
                                    dark:text-white
                                "
                            >
                                {task.sprint}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-slate-400">
                                Specialization
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    font-semibold
                                    text-slate-800
                                    dark:text-white
                                "
                            >
                                {task.specialization}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-slate-400">
                                Due Date
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    font-semibold
                                    text-slate-800
                                    dark:text-white
                                "
                            >
                                {formatDate(
                                    task.dueDate
                                )}
                            </p>
                        </div>
                    </div>

                    {/* PROGRESS */}

                    <div>
                        <div className="flex items-center justify-between">
                            <span
                                className="
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                    dark:text-slate-200
                                "
                            >
                                Progress
                            </span>

                            <span
                                className="
                                    text-sm
                                    font-bold
                                    text-blue-600
                                    dark:text-blue-400
                                "
                            >
                                {task.progress}%
                            </span>
                        </div>

                        <div
                            className="
                                mt-2
                                h-2
                                overflow-hidden
                                rounded-full
                                bg-slate-100

                                dark:bg-slate-800
                            "
                        >
                            <div
                                className="
                                    h-full
                                    rounded-full
                                    bg-blue-600
                                    transition-all
                                "
                                style={{
                                    width: `${task.progress}%`,
                                }}
                            />
                        </div>
                    </div>

                    {/* STATUS */}

                    <div>
                        <label
                            className="
                                text-sm
                                font-semibold
                                text-slate-700
                                dark:text-slate-200
                            "
                        >
                            Update Task Status
                        </label>

                        <div className="mt-2 flex gap-2">
                            <select
                                value={status}
                                onChange={(event) =>
                                    setStatus(
                                        event.target.value
                                    )
                                }
                                className="
                                    flex-1
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    px-3
                                    py-2.5
                                    text-sm
                                    text-slate-700
                                    outline-none
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-500/20

                                    dark:border-blue-900/60
                                    dark:bg-[#132f52]
                                    dark:text-white
                                "
                            >
                                <option value="Backlog">
                                    Backlog
                                </option>

                                <option value="In Progress">
                                    In Progress
                                </option>

                                <option value="Review">
                                    Review
                                </option>

                                <option value="Blocked">
                                    Blocked
                                </option>

                                <option value="Done">
                                    Done
                                </option>
                            </select>

                            <button
                                type="button"
                                onClick={
                                    handleStatusUpdate
                                }
                                className="
                                    rounded-xl
                                    bg-blue-600
                                    px-4
                                    py-2
                                    text-sm
                                    font-semibold
                                    text-white
                                    transition
                                    hover:bg-blue-700
                                "
                            >
                                Update
                            </button>
                        </div>
                    </div>

                    {/* COMMENT */}

                    <div>
                        <div className="flex items-center gap-2">
                            <MessageSquare
                                className="
                                    h-4
                                    w-4
                                    text-blue-600
                                "
                            />

                            <h3
                                className="
                                    text-sm
                                    font-semibold
                                    text-slate-900
                                    dark:text-white
                                "
                            >
                                Add Task Comment
                            </h3>
                        </div>

                        <textarea
                            value={comment}
                            onChange={(event) =>
                                setComment(
                                    event.target.value
                                )
                            }
                            placeholder="Write your progress update or comment..."
                            rows={4}
                            className="
                                mt-3
                                w-full
                                resize-none
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                p-3
                                text-sm
                                text-slate-700
                                outline-none
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-500/20

                                dark:border-blue-900/60
                                dark:bg-[#132f52]
                                dark:text-white
                            "
                        />

                        <button
                            type="button"
                            onClick={handleComment}
                            className="
                                mt-2
                                inline-flex
                                items-center
                                gap-2
                                rounded-xl
                                border
                                border-blue-200
                                bg-blue-50
                                px-4
                                py-2
                                text-sm
                                font-semibold
                                text-blue-700
                                transition
                                hover:bg-blue-100

                                dark:border-blue-900/60
                                dark:bg-blue-950/40
                                dark:text-blue-300
                            "
                        >
                            <MessageSquare className="h-4 w-4" />

                            Post Comment
                        </button>
                    </div>

                    {/* ACTIONS */}

                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-3
                            sm:grid-cols-3
                        "
                    >
                        <button
                            type="button"
                            onClick={
                                handleUpload
                            }
                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                border
                                border-slate-200
                                px-4
                                py-3
                                text-sm
                                font-semibold
                                text-slate-700
                                transition
                                hover:bg-slate-50

                                dark:border-blue-900/60
                                dark:text-slate-200
                                dark:hover:bg-blue-950/40
                            "
                        >
                            <Upload className="h-4 w-4" />

                            Upload File
                        </button>

                        <button
                            type="button"
                            onClick={
                                handleSubmit
                            }
                            disabled={
                                task.status ===
                                "Done"
                            }
                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-blue-600
                                px-4
                                py-3
                                text-sm
                                font-semibold
                                text-white
                                transition
                                hover:bg-blue-700
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            <Send className="h-4 w-4" />

                            Submit for Review
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                border
                                border-slate-200
                                px-4
                                py-3
                                text-sm
                                font-semibold
                                text-slate-600
                                transition
                                hover:bg-slate-50

                                dark:border-blue-900/60
                                dark:text-slate-300
                                dark:hover:bg-blue-950/40
                            "
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================================
// STAFF DASHBOARD
// ============================================================

function StaffDashboard() {

    // ========================================================
    // TASK STATE
    // ========================================================

    const [tasks, setTasks] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [selectedTask, setSelectedTask] =
        useState(null);

    const [search, setSearch] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("All");

    // ========================================================
    // CURRENT STAFF
    // ========================================================

    const currentUser = (() => {
        try {
            const storedUser =
                localStorage.getItem("user");

            if (!storedUser) {
                return null;
            }

            return JSON.parse(
                storedUser
            );
        } catch (error) {
            console.error(
                "Failed to read current user:",
                error
            );

            return null;
        }
    })();

    // ========================================================
    // LOAD MY ASSIGNED WORK
    // ========================================================

    useEffect(() => {
        let isMounted = true;

        const loadMyWork = async () => {
            try {
                setLoading(true);
                setError("");

                console.log(
                    "========== STAFF MY WORK =========="
                );

                console.log(
                    "Loading assigned tasks..."
                );

                const response =
                    await api.get(
                        "/tasks/my-work"
                    );

                console.log(
                    "My Work API response:",
                    response.data
                );

                const backendTasks =
                    Array.isArray(
                        response.data
                    )
                        ? response.data
                        : [];

                const mappedTasks =
                    backendTasks.map(
                        mapBackendTask
                    );

                console.log(
                    "Mapped Staff tasks:",
                    mappedTasks
                );

                if (isMounted) {
                    setTasks(
                        mappedTasks
                    );
                }
            } catch (error) {
                console.error(
                    "Failed to load Staff assigned tasks:",
                    error
                );

                if (!isMounted) {
                    return;
                }

                let message =
                    "Unable to load your assigned tasks.";

                if (
                    error?.response?.status ===
                    401
                ) {
                    message =
                        "You are not authenticated. Please log in again.";
                } else if (
                    error?.response?.status ===
                    403
                ) {
                    message =
                        "You do not have permission to access your assigned tasks.";
                } else if (
                    error?.response?.data
                        ?.message
                ) {
                    message =
                        error.response.data.message;
                } else if (
                    error?.message
                ) {
                    message =
                        error.message;
                }

                setError(message);
                setTasks([]);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadMyWork();

        return () => {
            isMounted = false;
        };
    }, []);

    // ========================================================
    // STATISTICS
    // ========================================================

    const statistics = useMemo(() => {
        const total =
            tasks.length;

        const completed =
            tasks.filter(
                (task) =>
                    task.status ===
                    "Done"
            ).length;

        const inProgress =
            tasks.filter(
                (task) =>
                    task.status ===
                    "In Progress"
            ).length;

        const blocked =
            tasks.filter(
                (task) =>
                    task.status ===
                    "Blocked"
            ).length;

        const review =
            tasks.filter(
                (task) =>
                    task.status ===
                    "Review"
            ).length;

        const progress =
            total === 0
                ? 0
                : Math.round(
                      tasks.reduce(
                          (
                              sum,
                              task
                          ) =>
                              sum +
                              (
                                  Number(
                                      task.progress
                                  ) ||
                                  0
                              ),
                          0
                      ) / total
                  );

        return {
            total,
            completed,
            inProgress,
            blocked,
            review,
            progress,
        };
    }, [tasks]);

    // ========================================================
    // FILTER TASKS
    // ========================================================

    const filteredTasks =
        useMemo(() => {
            const normalizedSearch =
                search
                    .toLowerCase()
                    .trim();

            return tasks.filter(
                (task) => {
                    const matchesSearch =
                        task.title
                            .toLowerCase()
                            .includes(
                                normalizedSearch
                            ) ||
                        task.project
                            .toLowerCase()
                            .includes(
                                normalizedSearch
                            ) ||
                        task.id
                            .toLowerCase()
                            .includes(
                                normalizedSearch
                            );

                    const matchesStatus =
                        statusFilter ===
                            "All" ||
                        task.status ===
                            statusFilter;

                    return (
                        matchesSearch &&
                        matchesStatus
                    );
                }
            );
        }, [
            tasks,
            search,
            statusFilter,
        ]);

    // ========================================================
    // UPDATE STATUS
    // ========================================================
    //
    // NOTE:
    // This is still local UI state for now.
    //
    // Backend connection will be added later using:
    //
    // PUT /api/tasks/{id}/status
    //
    // ========================================================

    const handleUpdateStatus = (
        taskId,
        newStatus
    ) => {
        setTasks(
            (previousTasks) =>
                previousTasks.map(
                    (task) =>
                        task.id ===
                        taskId
                            ? {
                                  ...task,
                                  status:
                                      newStatus,
                                  progress:
                                      newStatus ===
                                      "Done"
                                          ? 100
                                          : task.progress,
                              }
                            : task
                )
        );

        setSelectedTask(
            (previousTask) =>
                previousTask
                    ? {
                          ...previousTask,
                          status:
                              newStatus,
                          progress:
                              newStatus ===
                              "Done"
                                  ? 100
                                  : previousTask.progress,
                      }
                    : previousTask
        );

        alert(
            "Task status updated successfully."
        );
    };

    // ========================================================
    // ADD COMMENT
    // ========================================================

    const handleAddComment = (
        taskId,
        comment
    ) => {
        console.log(
            "Comment:",
            {
                taskId,
                comment,
            }
        );

        alert(
            "Comment added successfully."
        );
    };

    // ========================================================
    // UPLOAD
    // ========================================================

    const handleUpload = (
        taskId
    ) => {
        console.log(
            "Upload file for:",
            taskId
        );

        alert(
            "File upload interface will be connected to the backend here."
        );
    };

    // ========================================================
    // SUBMIT COMPLETED WORK
    // ========================================================

    const handleSubmit = (
        taskId
    ) => {
        const task =
            tasks.find(
                (item) =>
                    item.id ===
                    taskId
            );

        if (!task) {
            return;
        }

        if (
            task.progress < 100
        ) {
            alert(
                "Please complete the task before submitting it for review."
            );

            return;
        }

        setTasks(
            (previousTasks) =>
                previousTasks.map(
                    (item) =>
                        item.id ===
                        taskId
                            ? {
                                  ...item,
                                  status:
                                      "Review",
                              }
                            : item
                )
        );

        setSelectedTask(
            (previousTask) =>
                previousTask
                    ? {
                          ...previousTask,
                          status:
                              "Review",
                      }
                    : previousTask
        );

        alert(
            "Work submitted successfully for review."
        );
    };

    // ========================================================
    // OPEN TASK
    // ========================================================

    const handleOpenTask = (
        task
    ) => {
        setSelectedTask(task);
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div
            className="
                min-h-screen
                bg-slate-50
                p-4
                sm:p-6
                lg:p-8

                dark:bg-[#071a2d]
            "
        >
            <div className="mx-auto max-w-7xl">

                {/* ==================================================
                    HEADER
                ================================================== */}

                <div
                    className="
                        mb-8
                        flex
                        flex-col
                        gap-5
                        lg:flex-row
                        lg:items-center
                        lg:justify-between
                    "
                >
                    <div>
                        <div className="flex items-center gap-3">
                            <div
                                className="
                                    flex
                                    h-12
                                    w-12
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    bg-blue-600
                                    text-white
                                    shadow-lg
                                    shadow-blue-600/20
                                "
                            >
                                <BriefcaseBusiness className="h-6 w-6" />
                            </div>

                            <div>
                                <p
                                    className="
                                        text-xs
                                        font-bold
                                        uppercase
                                        tracking-widest
                                        text-blue-600
                                        dark:text-blue-400
                                    "
                                >
                                    Staff Workspace
                                </p>

                                <h1
                                    className="
                                        text-2xl
                                        font-bold
                                        text-slate-900
                                        dark:text-white
                                    "
                                >
                                    My Work
                                </h1>
                            </div>
                        </div>

                        <p
                            className="
                                mt-3
                                max-w-2xl
                                text-sm
                                text-slate-500
                                dark:text-slate-400
                            "
                        >
                            Manage your assigned work, update task
                            progress, communicate with your team,
                            and submit completed work for review.
                        </p>
                    </div>

                    {/* USER */}

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            px-4
                            py-3
                            shadow-sm

                            dark:border-blue-900/60
                            dark:bg-[#0b2038]
                        "
                    >
                        <div
                            className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-xl
                                bg-blue-100
                                text-blue-600

                                dark:bg-blue-950/50
                                dark:text-blue-400
                            "
                        >
                            <UserRound className="h-5 w-5" />
                        </div>

                        <div>
                            <p
                                className="
                                    text-sm
                                    font-semibold
                                    text-slate-800
                                    dark:text-white
                                "
                            >
                                {currentUser?.name ||
                                    currentUser?.fullName ||
                                    "Staff Member"}
                            </p>

                            <p
                                className="
                                    text-xs
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                {currentUser?.specialization ||
                                    "Staff"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ==================================================
                    STATISTICS
                ================================================== */}

                <div
                    className="
                        grid
                        grid-cols-1
                        gap-4
                        sm:grid-cols-2
                        xl:grid-cols-5
                    "
                >
                    <StatCard
                        title="Assigned Tasks"
                        value={statistics.total}
                        description="Your current work"
                        icon={ClipboardList}
                        iconClass="
                            bg-blue-100
                            text-blue-600
                            dark:bg-blue-950/50
                            dark:text-blue-400
                        "
                    />

                    <StatCard
                        title="In Progress"
                        value={statistics.inProgress}
                        description="Currently working"
                        icon={Clock3}
                        iconClass="
                            bg-indigo-100
                            text-indigo-600
                            dark:bg-indigo-950/50
                            dark:text-indigo-400
                        "
                    />

                    <StatCard
                        title="Awaiting Review"
                        value={statistics.review}
                        description="Submitted work"
                        icon={FileText}
                        iconClass="
                            bg-purple-100
                            text-purple-600
                            dark:bg-purple-950/50
                            dark:text-purple-400
                        "
                    />

                    <StatCard
                        title="Blocked"
                        value={statistics.blocked}
                        description="Needs attention"
                        icon={AlertCircle}
                        iconClass="
                            bg-red-100
                            text-red-600
                            dark:bg-red-950/50
                            dark:text-red-400
                        "
                    />

                    <StatCard
                        title="Completed"
                        value={statistics.completed}
                        description="Finished tasks"
                        icon={CheckCircle2}
                        iconClass="
                            bg-green-100
                            text-green-600
                            dark:bg-green-950/50
                            dark:text-green-400
                        "
                    />
                </div>

                {/* ==================================================
                    WORK SUMMARY
                ================================================== */}

                <div
                    className="
                        mt-6
                        grid
                        grid-cols-1
                        gap-6
                        lg:grid-cols-3
                    "
                >
                    {/* PROGRESS */}

                    <div
                        className="
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            p-6
                            shadow-sm

                            dark:border-blue-900/60
                            dark:bg-[#0b2038]
                        "
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p
                                    className="
                                        text-sm
                                        font-semibold
                                        text-slate-900
                                        dark:text-white
                                    "
                                >
                                    My Work Progress
                                </p>

                                <p
                                    className="
                                        mt-1
                                        text-xs
                                        text-slate-500
                                        dark:text-slate-400
                                    "
                                >
                                    Average progress across assigned tasks
                                </p>
                            </div>

                            <Award
                                className="
                                    h-5
                                    w-5
                                    text-blue-600
                                    dark:text-blue-400
                                "
                            />
                        </div>

                        <div className="mt-6">
                            <div className="flex items-end justify-between">
                                <span
                                    className="
                                        text-4xl
                                        font-bold
                                        text-slate-900
                                        dark:text-white
                                    "
                                >
                                    {statistics.progress}%
                                </span>

                                <span
                                    className="
                                        text-xs
                                        text-slate-500
                                        dark:text-slate-400
                                    "
                                >
                                    Overall
                                </span>
                            </div>

                            <div
                                className="
                                    mt-3
                                    h-3
                                    overflow-hidden
                                    rounded-full
                                    bg-slate-100
                                    dark:bg-slate-800
                                "
                            >
                                <div
                                    className="
                                        h-full
                                        rounded-full
                                        bg-blue-600
                                        transition-all
                                    "
                                    style={{
                                        width: `${statistics.progress}%`,
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* SPECIALIZATION */}

                    <div
                        className="
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            p-6
                            shadow-sm

                            dark:border-blue-900/60
                            dark:bg-[#0b2038]
                        "
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className="
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-purple-100
                                    text-purple-600

                                    dark:bg-purple-950/50
                                    dark:text-purple-400
                                "
                            >
                                <Award className="h-5 w-5" />
                            </div>

                            <div>
                                <p
                                    className="
                                        text-xs
                                        text-slate-500
                                        dark:text-slate-400
                                    "
                                >
                                    My Specialization
                                </p>

                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        font-bold
                                        text-slate-900
                                        dark:text-white
                                    "
                                >
                                    {currentUser?.specialization ||
                                        "Not specified"}
                                </p>
                            </div>
                        </div>

                        <p
                            className="
                                mt-5
                                text-xs
                                leading-5
                                text-slate-500
                                dark:text-slate-400
                            "
                        >
                            Your specialization helps the system
                            identify suitable work and supports
                            better task assignment.
                        </p>
                    </div>

                    {/* QUICK ACTIONS */}

                    <div
                        className="
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            p-6
                            shadow-sm

                            dark:border-blue-900/60
                            dark:bg-[#0b2038]
                        "
                    >
                        <p
                            className="
                                text-sm
                                font-semibold
                                text-slate-900
                                dark:text-white
                            "
                        >
                            Quick Actions
                        </p>

                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() =>
                                    document
                                        .getElementById(
                                            "my-work"
                                        )
                                        ?.scrollIntoView({
                                            behavior:
                                                "smooth",
                                        })
                                }
                                className="
                                    rounded-xl
                                    border
                                    border-blue-100
                                    bg-blue-50
                                    px-3
                                    py-3
                                    text-xs
                                    font-semibold
                                    text-blue-700
                                    transition
                                    hover:bg-blue-100

                                    dark:border-blue-900/60
                                    dark:bg-blue-950/30
                                    dark:text-blue-300
                                "
                            >
                                <ClipboardList className="mx-auto mb-1 h-4 w-4" />

                                My Work
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    alert(
                                        "Comments and communication will be connected to the backend."
                                    )
                                }
                                className="
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-slate-50
                                    px-3
                                    py-3
                                    text-xs
                                    font-semibold
                                    text-slate-700
                                    transition
                                    hover:bg-slate-100

                                    dark:border-blue-900/60
                                    dark:bg-blue-950/30
                                    dark:text-slate-300
                                "
                            >
                                <MessageSquare className="mx-auto mb-1 h-4 w-4" />

                                Communication
                            </button>
                        </div>
                    </div>
                </div>

                {/* ==================================================
                    MY WORK
                ================================================== */}

                <div
                    id="my-work"
                    className="
                        mt-6
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        shadow-sm

                        dark:border-blue-900/60
                        dark:bg-[#0b2038]
                    "
                >
                    {/* HEADER */}

                    <div
                        className="
                            border-b
                            border-slate-200
                            p-5

                            dark:border-blue-900/60
                        "
                    >
                        <div
                            className="
                                flex
                                flex-col
                                gap-4
                                lg:flex-row
                                lg:items-center
                                lg:justify-between
                            "
                        >
                            <div>
                                <h2
                                    className="
                                        text-lg
                                        font-bold
                                        text-slate-900
                                        dark:text-white
                                    "
                                >
                                    My Assigned Work
                                </h2>

                                <p
                                    className="
                                        mt-1
                                        text-xs
                                        text-slate-500
                                        dark:text-slate-400
                                    "
                                >
                                    Tasks assigned to you by the
                                    project management workflow.
                                </p>
                            </div>

                            {/* FILTERS */}

                            <div
                                className="
                                    flex
                                    flex-col
                                    gap-2
                                    sm:flex-row
                                "
                            >
                                <div className="relative">
                                    <Search
                                        className="
                                            pointer-events-none
                                            absolute
                                            left-3
                                            top-1/2
                                            h-4
                                            w-4
                                            -translate-y-1/2
                                            text-slate-400
                                        "
                                    />

                                    <input
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
                                        placeholder="Search work..."
                                        className="
                                            w-full
                                            rounded-xl
                                            border
                                            border-slate-200
                                            bg-white
                                            py-2.5
                                            pl-9
                                            pr-3
                                            text-sm
                                            outline-none
                                            focus:border-blue-500
                                            focus:ring-2
                                            focus:ring-blue-500/20

                                            dark:border-blue-900/60
                                            dark:bg-[#132f52]
                                            dark:text-white

                                            sm:w-56
                                        "
                                    />
                                </div>

                                <div className="relative">
                                    <Filter
                                        className="
                                            pointer-events-none
                                            absolute
                                            left-3
                                            top-1/2
                                            h-4
                                            w-4
                                            -translate-y-1/2
                                            text-slate-400
                                        "
                                    />

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
                                        className="
                                            w-full
                                            appearance-none
                                            rounded-xl
                                            border
                                            border-slate-200
                                            bg-white
                                            py-2.5
                                            pl-9
                                            pr-8
                                            text-sm
                                            outline-none
                                            focus:border-blue-500

                                            dark:border-blue-900/60
                                            dark:bg-[#132f52]
                                            dark:text-white

                                            sm:w-44
                                        "
                                    >
                                        <option value="All">
                                            All Status
                                        </option>

                                        <option value="Backlog">
                                            Backlog
                                        </option>

                                        <option value="In Progress">
                                            In Progress
                                        </option>

                                        <option value="Review">
                                            Review
                                        </option>

                                        <option value="Blocked">
                                            Blocked
                                        </option>

                                        <option value="Done">
                                            Done
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* TASK LIST */}

                    <div className="p-5">

                        {/* LOADING */}

                        {loading ? (
                            <div
                                className="
                                    rounded-xl
                                    border
                                    border-dashed
                                    border-slate-300
                                    p-10
                                    text-center

                                    dark:border-blue-900/60
                                "
                            >
                                <ClipboardList
                                    className="
                                        mx-auto
                                        h-10
                                        w-10
                                        animate-pulse
                                        text-blue-500
                                    "
                                />

                                <h3
                                    className="
                                        mt-3
                                        text-sm
                                        font-semibold
                                        text-slate-700
                                        dark:text-slate-200
                                    "
                                >
                                    Loading your assigned work...
                                </h3>

                                <p
                                    className="
                                        mt-1
                                        text-xs
                                        text-slate-400
                                    "
                                >
                                    Please wait while we load your tasks.
                                </p>
                            </div>
                        ) : error ? (

                            /* ERROR */

                            <div
                                className="
                                    rounded-xl
                                    border
                                    border-red-200
                                    bg-red-50
                                    p-10
                                    text-center

                                    dark:border-red-900/60
                                    dark:bg-red-950/20
                                "
                            >
                                <AlertCircle
                                    className="
                                        mx-auto
                                        h-10
                                        w-10
                                        text-red-500
                                    "
                                />

                                <h3
                                    className="
                                        mt-3
                                        text-sm
                                        font-semibold
                                        text-red-700
                                        dark:text-red-300
                                    "
                                >
                                    Unable to load your work
                                </h3>

                                <p
                                    className="
                                        mt-1
                                        text-xs
                                        text-red-500
                                        dark:text-red-400
                                    "
                                >
                                    {error}
                                </p>
                            </div>
                        ) : filteredTasks.length === 0 ? (

                            /* EMPTY */

                            <div
                                className="
                                    rounded-xl
                                    border
                                    border-dashed
                                    border-slate-300
                                    p-10
                                    text-center

                                    dark:border-blue-900/60
                                "
                            >
                                <ClipboardList
                                    className="
                                        mx-auto
                                        h-10
                                        w-10
                                        text-slate-300
                                        dark:text-slate-600
                                    "
                                />

                                <h3
                                    className="
                                        mt-3
                                        text-sm
                                        font-semibold
                                        text-slate-700
                                        dark:text-slate-200
                                    "
                                >
                                    No assigned work available.
                                </h3>

                                <p
                                    className="
                                        mt-1
                                        text-xs
                                        text-slate-400
                                    "
                                >
                                    Try changing your search or
                                    status filter.
                                </p>
                            </div>
                        ) : (

                            /* TASKS */

                            <div className="space-y-3">
                                {filteredTasks.map(
                                    (task) => (
                                        <div
                                            key={
                                                task.id
                                            }
                                            className="
                                                rounded-2xl
                                                border
                                                border-slate-200
                                                p-4
                                                transition
                                                hover:border-blue-200
                                                hover:shadow-sm

                                                dark:border-blue-900/60
                                                dark:hover:border-blue-700
                                            "
                                        >
                                            <div
                                                className="
                                                    flex
                                                    flex-col
                                                    gap-4
                                                    xl:flex-row
                                                    xl:items-center
                                                    xl:justify-between
                                                "
                                            >
                                                {/* TASK INFO */}

                                                <div className="min-w-0 flex-1">
                                                    <div
                                                        className="
                                                            flex
                                                            flex-wrap
                                                            items-center
                                                            gap-2
                                                        "
                                                    >
                                                        <span
                                                            className="
                                                                text-[10px]
                                                                font-bold
                                                                uppercase
                                                                tracking-wider
                                                                text-slate-400
                                                            "
                                                        >
                                                            {
                                                                task.id
                                                            }
                                                        </span>

                                                        <StatusBadge
                                                            status={
                                                                task.status
                                                            }
                                                        />
                                                    </div>

                                                    <h3
                                                        className="
                                                            mt-2
                                                            text-sm
                                                            font-bold
                                                            text-slate-900
                                                            dark:text-white
                                                        "
                                                    >
                                                        {
                                                            task.title
                                                        }
                                                    </h3>

                                                    <p
                                                        className="
                                                            mt-1
                                                            line-clamp-2
                                                            text-xs
                                                            leading-5
                                                            text-slate-500
                                                            dark:text-slate-400
                                                        "
                                                    >
                                                        {
                                                            task.description
                                                        }
                                                    </p>

                                                    {/* META */}

                                                    <div
                                                        className="
                                                            mt-3
                                                            flex
                                                            flex-wrap
                                                            gap-x-5
                                                            gap-y-2
                                                        "
                                                    >
                                                        <span
                                                            className="
                                                                inline-flex
                                                                items-center
                                                                gap-1.5
                                                                text-xs
                                                                text-slate-500
                                                                dark:text-slate-400
                                                            "
                                                        >
                                                            <FolderKanban className="h-3.5 w-3.5" />

                                                            {
                                                                task.project
                                                            }
                                                        </span>

                                                        <span
                                                            className="
                                                                inline-flex
                                                                items-center
                                                                gap-1.5
                                                                text-xs
                                                                text-slate-500
                                                                dark:text-slate-400
                                                            "
                                                        >
                                                            <CalendarDays className="h-3.5 w-3.5" />

                                                            {formatDate(
                                                                task.dueDate
                                                            )}
                                                        </span>

                                                        <span
                                                            className="
                                                                inline-flex
                                                                items-center
                                                                gap-1.5
                                                                text-xs
                                                            "
                                                        >
                                                            <span className="text-slate-400">
                                                                Priority:
                                                            </span>

                                                            <PriorityBadge
                                                                priority={
                                                                    task.priority
                                                                }
                                                            />
                                                        </span>

                                                        <span
                                                            className="
                                                                inline-flex
                                                                items-center
                                                                gap-1.5
                                                                text-xs
                                                                text-slate-500
                                                                dark:text-slate-400
                                                            "
                                                        >
                                                            <Award className="h-3.5 w-3.5" />

                                                            {
                                                                task.specialization
                                                            }
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* PROGRESS */}

                                                <div
                                                    className="
                                                        w-full
                                                        xl:w-48
                                                    "
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span
                                                            className="
                                                                text-xs
                                                                font-medium
                                                                text-slate-500
                                                            "
                                                        >
                                                            Progress
                                                        </span>

                                                        <span
                                                            className="
                                                                text-xs
                                                                font-bold
                                                                text-blue-600
                                                                dark:text-blue-400
                                                            "
                                                        >
                                                            {
                                                                task.progress
                                                            }%
                                                        </span>
                                                    </div>

                                                    <div
                                                        className="
                                                            mt-2
                                                            h-2
                                                            overflow-hidden
                                                            rounded-full
                                                            bg-slate-100
                                                            dark:bg-slate-800
                                                        "
                                                    >
                                                        <div
                                                            className="
                                                                h-full
                                                                rounded-full
                                                                bg-blue-600
                                                                transition-all
                                                            "
                                                            style={{
                                                                width: `${task.progress}%`,
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                                {/* VIEW */}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleOpenTask(
                                                            task
                                                        )
                                                    }
                                                    className="
                                                        inline-flex
                                                        items-center
                                                        justify-center
                                                        gap-2
                                                        rounded-xl
                                                        bg-blue-600
                                                        px-4
                                                        py-2.5
                                                        text-sm
                                                        font-semibold
                                                        text-white
                                                        transition
                                                        hover:bg-blue-700
                                                        xl:w-auto
                                                    "
                                                >
                                                    View Task

                                                    <ArrowRight className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* ==================================================
                    STAFF RESPONSIBILITY
                ================================================== */}

                <div
                    className="
                        mt-6
                        rounded-2xl
                        border
                        border-blue-100
                        bg-blue-50
                        p-5

                        dark:border-blue-900/60
                        dark:bg-blue-950/20
                    "
                >
                    <div className="flex gap-4">
                        <div
                            className="
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-blue-600
                                text-white
                            "
                        >
                            <BriefcaseBusiness className="h-5 w-5" />
                        </div>

                        <div>
                            <h3
                                className="
                                    text-sm
                                    font-bold
                                    text-blue-900
                                    dark:text-blue-200
                                "
                            >
                                Staff Work Responsibility
                            </h3>

                            <p
                                className="
                                    mt-1
                                    text-xs
                                    leading-5
                                    text-blue-700
                                    dark:text-blue-300
                                "
                            >
                                You are responsible for executing
                                assigned work according to your
                                specialization, keeping task progress
                                updated, communicating blockers,
                                attaching required files, and
                                submitting completed work for Manager
                                review.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ==================================================
                TASK MODAL
            ================================================== */}

            {selectedTask && (
                <TaskDetailsModal
                    task={selectedTask}
                    onClose={() =>
                        setSelectedTask(null)
                    }
                    onUpdateStatus={
                        handleUpdateStatus
                    }
                    onAddComment={
                        handleAddComment
                    }
                    onUpload={
                        handleUpload
                    }
                    onSubmit={
                        handleSubmit
                    }
                />
            )}
        </div>
    );
}

export default StaffDashboard;