import { useEffect, useMemo, useState } from "react";

import {
    AlertCircle,
    CalendarDays,
    CheckCircle2,
    ClipboardList,
    Eye,
    FileText,
    FolderKanban,
    Search,
    X,
} from "lucide-react";

import api from "@/services/api";

/* ============================================================
   STAFF — CONT-STAFF-001
   VIEW ASSIGNED WORK
   ============================================================ */

const STATUS_OPTIONS = [
    "All",
    "Backlog",
    "In Progress",
    "Review",
    "Blocked",
    "Done",
];

const STATUS_MAP = {
    1: "Backlog",
    2: "In Progress",
    3: "Review",
    4: "Done",
    5: "Blocked",
};

const PRIORITY_MAP = {
    1: "Low",
    2: "Medium",
    3: "High",
};

function normalizeStatus(status) {
    if (typeof status === "number") {
        return STATUS_MAP[status] || "Backlog";
    }

    if (typeof status === "string") {
        const normalized = status.trim().toLowerCase();

        if (normalized === "todo") return "Backlog";
        if (normalized === "inprogress") return "In Progress";
        if (normalized === "in review") return "Review";
        if (normalized === "inreview") return "Review";
        if (normalized === "blocked") return "Blocked";
        if (normalized === "completed") return "Done";

        return status;
    }

    return "Backlog";
}

function normalizePriority(priority) {
    if (typeof priority === "number") {
        return PRIORITY_MAP[priority] || "Medium";
    }

    if (typeof priority === "string") {
        const normalized = priority.trim().toLowerCase();

        if (normalized === "low") return "Low";
        if (normalized === "medium") return "Medium";
        if (normalized === "high") return "High";

        return priority;
    }

    return "Medium";
}

function normalizeTask(task) {
    if (!task) {
        return null;
    }

    return {
        id: task.id,
        title: task.title || "Untitled Task",
        description: task.description || "No description provided.",
        project: task.project || "—",
        sprint: task.sprint || (
            task.sprintId
                ? `Sprint ${String(task.sprintId).slice(0, 8)}`
                : "—"
        ),
        priority: normalizePriority(task.priority),
        status: normalizeStatus(task.status),
        dueDate: task.dueDate
            ? new Date(task.dueDate).toLocaleDateString()
            : "—",
        progress:
            typeof task.progress === "number"
                ? task.progress
                : task.status === 4 || task.status === "Completed"
                    ? 100
                    : task.status === 2 || task.status === "InProgress"
                        ? 50
                        : 0,
        files:
            typeof task.files === "number"
                ? task.files
                : 0,
        comments:
            typeof task.comments === "number"
                ? task.comments
                : 0,
    };
}

function getApiErrorMessage(error, fallback) {
    return (
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        fallback
    );
}

function ViewMyWork() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedTask, setSelectedTask] = useState(null);

    /* ========================================================
       LOAD ASSIGNED WORK FROM BACKEND
       ======================================================== */

    useEffect(() => {
        let cancelled = false;

        const loadMyWork = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get("/tasks/my-work");

                if (cancelled) {
                    return;
                }

                const responseData = response.data;

                const data = Array.isArray(responseData)
                    ? responseData
                    : Array.isArray(responseData?.data)
                        ? responseData.data
                        : [];

                const normalizedTasks = data
                    .map(normalizeTask)
                    .filter(Boolean);

                setTasks(normalizedTasks);
            } catch (requestError) {
                if (cancelled) {
                    return;
                }

                console.error(
                    "VIEW MY WORK - LOAD ERROR:",
                    requestError
                );

                setTasks([]);
                setError(
                    getApiErrorMessage(
                        requestError,
                        "Unable to load your assigned work."
                    )
                );
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadMyWork();

        return () => {
            cancelled = true;
        };
    }, []);

    /* ========================================================
       FILTER TASKS
       ======================================================== */

    const filteredTasks = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();

        return tasks.filter((task) => {
            const matchesSearch =
                !term ||
                task.title.toLowerCase().includes(term) ||
                task.description.toLowerCase().includes(term) ||
                task.project.toLowerCase().includes(term);

            const matchesStatus =
                statusFilter === "All" ||
                task.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [tasks, searchTerm, statusFilter]);

    /* ========================================================
       STATUS STYLE
       ======================================================== */

    function getStatusClass(status) {
        switch (status) {
            case "Done":
                return "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400";

            case "In Progress":
                return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400";

            case "Review":
                return "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400";

            case "Blocked":
                return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400";

            default:
                return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
        }
    }

    /* ========================================================
       PRIORITY STYLE
       ======================================================== */

    function getPriorityClass(priority) {
        switch (priority) {
            case "High":
                return "text-red-600 dark:text-red-400";

            case "Medium":
                return "text-orange-600 dark:text-orange-400";

            case "Low":
                return "text-green-600 dark:text-green-400";

            default:
                return "text-slate-600 dark:text-slate-400";
        }
    }

    /* ========================================================
       LOADING
       ======================================================== */

    if (loading) {
        return (
            <div className="space-y-6">

                <div>
                    <div className="flex items-center gap-3">

                        <div
                            className="
                                flex
                                h-11
                                w-11
                                items-center
                                justify-center
                                rounded-xl
                                bg-blue-100
                                text-blue-600
                                dark:bg-blue-950/50
                                dark:text-blue-400
                            "
                        >
                            <ClipboardList className="h-6 w-6" />
                        </div>

                        <div>
                            <h2
                                className="
                                    text-2xl
                                    font-bold
                                    text-slate-900
                                    dark:text-white
                                "
                            >
                                My Work
                            </h2>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                View and manage work assigned
                                to you based on your team,
                                projects, and specialization.
                            </p>
                        </div>

                    </div>
                </div>

                <div
                    className="
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-10
                        text-center
                        shadow-sm
                        dark:border-slate-700
                        dark:bg-[#0d2745]
                    "
                >
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Loading your assigned work...
                    </p>
                </div>

            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div>
                <div className="flex items-center gap-3">

                    <div
                        className="
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-xl
                            bg-blue-100
                            text-blue-600
                            dark:bg-blue-950/50
                            dark:text-blue-400
                        "
                    >
                        <ClipboardList className="h-6 w-6" />
                    </div>

                    <div>
                        <h2
                            className="
                                text-2xl
                                font-bold
                                text-slate-900
                                dark:text-white
                            "
                        >
                            My Work
                        </h2>

                        <p
                            className="
                                mt-1
                                text-sm
                                text-slate-500
                                dark:text-slate-400
                            "
                        >
                            View and manage work assigned
                            to you based on your team,
                            projects, and specialization.
                        </p>
                    </div>

                </div>
            </div>

            {/* ==================================================
                SEARCH AND FILTER
            ================================================== */}

            <div
                className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-4
                    shadow-sm
                    dark:border-slate-700
                    dark:bg-[#0d2745]
                "
            >

                <div className="flex flex-col gap-4 lg:flex-row">

                    <div className="relative flex-1">

                        <Search
                            className="
                                absolute
                                left-3
                                top-1/2
                                h-5
                                w-5
                                -translate-y-1/2
                                text-slate-400
                            "
                        />

                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(event) =>
                                setSearchTerm(event.target.value)
                            }
                            placeholder="Search your work..."
                            className="
                                w-full
                                rounded-xl
                                border
                                border-slate-300
                                bg-white
                                py-2.5
                                pl-10
                                pr-4
                                text-sm
                                outline-none
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-500/20
                                dark:border-slate-600
                                dark:bg-[#081b33]
                                dark:text-white
                            "
                        />

                    </div>

                    <select
                        value={statusFilter}
                        onChange={(event) =>
                            setStatusFilter(event.target.value)
                        }
                        className="
                            rounded-xl
                            border
                            border-slate-300
                            bg-white
                            px-4
                            py-2.5
                            text-sm
                            outline-none
                            focus:border-blue-500
                            dark:border-slate-600
                            dark:bg-[#081b33]
                            dark:text-white
                        "
                    >
                        {STATUS_OPTIONS.map((status) => (
                            <option
                                key={status}
                                value={status}
                            >
                                {status === "All"
                                    ? "All Statuses"
                                    : status}
                            </option>
                        ))}
                    </select>

                </div>

            </div>

            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (

                <div
                    className="
                        flex
                        items-start
                        gap-3
                        rounded-2xl
                        border
                        border-red-200
                        bg-red-50
                        p-4
                        dark:border-red-900/50
                        dark:bg-red-950/20
                    "
                >
                    <AlertCircle
                        className="
                            mt-0.5
                            h-5
                            w-5
                            shrink-0
                            text-red-600
                            dark:text-red-400
                        "
                    />

                    <p
                        className="
                            text-sm
                            text-red-700
                            dark:text-red-400
                        "
                    >
                        {error}
                    </p>
                </div>
            )}

            {/* ==================================================
                NO WORK
            ================================================== */}

            {!error && filteredTasks.length === 0 && (

                <div
                    className="
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-10
                        text-center
                        dark:border-slate-700
                        dark:bg-[#0d2745]
                    "
                >
                    <AlertCircle
                        className="
                            mx-auto
                            mb-3
                            h-10
                            w-10
                            text-slate-400
                        "
                    />

                    <h3
                        className="
                            text-lg
                            font-semibold
                            text-slate-900
                            dark:text-white
                        "
                    >
                        No assigned work available.
                    </h3>

                    <p
                        className="
                            mt-1
                            text-sm
                            text-slate-500
                            dark:text-slate-400
                        "
                    >
                        No tasks match your current
                        search or filter.
                    </p>
                </div>
            )}

            {/* ==================================================
                TASK LIST
            ================================================== */}

            {filteredTasks.length > 0 && (

                <div className="grid gap-4">

                    {filteredTasks.map((task) => (

                        <div
                            key={task.id}
                            className="
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                p-5
                                shadow-sm
                                transition
                                hover:shadow-md
                                dark:border-slate-700
                                dark:bg-[#0d2745]
                            "
                        >

                            <div
                                className="
                                    flex
                                    flex-col
                                    gap-4
                                    lg:flex-row
                                    lg:items-start
                                    lg:justify-between
                                "
                            >

                                <div className="flex-1">

                                    <div
                                        className="
                                            flex
                                            flex-wrap
                                            items-center
                                            gap-2
                                        "
                                    >

                                        <h3
                                            className="
                                                text-lg
                                                font-semibold
                                                text-slate-900
                                                dark:text-white
                                            "
                                        >
                                            {task.title}
                                        </h3>

                                        <span
                                            className={`
                                                rounded-full
                                                px-2.5
                                                py-1
                                                text-xs
                                                font-medium
                                                ${getStatusClass(task.status)}
                                            `}
                                        >
                                            {task.status}
                                        </span>

                                    </div>

                                    <p
                                        className="
                                            mt-2
                                            text-sm
                                            text-slate-600
                                            dark:text-slate-400
                                        "
                                    >
                                        {task.description}
                                    </p>

                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelectedTask(task)
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
                                        font-medium
                                        text-white
                                        transition
                                        hover:bg-blue-700
                                    "
                                >
                                    <Eye className="h-4 w-4" />
                                    View Details
                                </button>

                            </div>

                            <div
                                className="
                                    mt-5
                                    grid
                                    gap-4
                                    sm:grid-cols-2
                                    lg:grid-cols-4
                                "
                            >

                                <div className="flex items-center gap-2">

                                    <FolderKanban
                                        className="
                                            h-4
                                            w-4
                                            text-blue-500
                                        "
                                    />

                                    <div>
                                        <p className="text-xs text-slate-400">
                                            Project
                                        </p>

                                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                            {task.project}
                                        </p>
                                    </div>

                                </div>

                                <div className="flex items-center gap-2">

                                    <ClipboardList
                                        className="
                                            h-4
                                            w-4
                                            text-purple-500
                                        "
                                    />

                                    <div>
                                        <p className="text-xs text-slate-400">
                                            Sprint
                                        </p>

                                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                            {task.sprint}
                                        </p>
                                    </div>

                                </div>

                                <div className="flex items-center gap-2">

                                    <CalendarDays
                                        className="
                                            h-4
                                            w-4
                                            text-orange-500
                                        "
                                    />

                                    <div>
                                        <p className="text-xs text-slate-400">
                                            Due Date
                                        </p>

                                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                            {task.dueDate}
                                        </p>
                                    </div>

                                </div>

                                <div>

                                    <p className="text-xs text-slate-400">
                                        Priority
                                    </p>

                                    <p
                                        className={`
                                            text-sm
                                            font-semibold
                                            ${getPriorityClass(task.priority)}
                                        `}
                                    >
                                        {task.priority}
                                    </p>

                                </div>

                            </div>

                            <div className="mt-5">

                                <div className="mb-2 flex justify-between">

                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                        Progress
                                    </span>

                                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        {task.progress}%
                                    </span>

                                </div>

                                <div
                                    className="
                                        h-2
                                        overflow-hidden
                                        rounded-full
                                        bg-slate-200
                                        dark:bg-slate-700
                                    "
                                >
                                    <div
                                        className="
                                            h-full
                                            rounded-full
                                            bg-blue-600
                                        "
                                        style={{
                                            width: `${task.progress}%`,
                                        }}
                                    />
                                </div>

                            </div>

                            <div
                                className="
                                    mt-4
                                    flex
                                    items-center
                                    gap-5
                                    text-xs
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >

                                <span className="flex items-center gap-1.5">
                                    <FileText className="h-4 w-4" />
                                    {task.files} files
                                </span>

                                <span>
                                    {task.comments} comments
                                </span>

                            </div>

                        </div>

                    ))}

                </div>
            )}

            {/* ==================================================
                TASK DETAILS MODAL
            ================================================== */}

            {selectedTask && (

                <div
                    className="
                        fixed
                        inset-0
                        z-50
                        flex
                        items-center
                        justify-center
                        bg-black/50
                        p-4
                    "
                    onClick={() => setSelectedTask(null)}
                >

                    <div
                        className="
                            max-h-[90vh]
                            w-full
                            max-w-2xl
                            overflow-y-auto
                            rounded-2xl
                            bg-white
                            p-6
                            shadow-xl
                            dark:bg-[#0d2745]
                        "
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <div
                            className="
                                flex
                                items-start
                                justify-between
                                gap-4
                            "
                        >

                            <div>

                                <h3
                                    className="
                                        text-xl
                                        font-bold
                                        text-slate-900
                                        dark:text-white
                                    "
                                >
                                    {selectedTask.title}
                                </h3>

                                <span
                                    className={`
                                        mt-2
                                        inline-flex
                                        rounded-full
                                        px-2.5
                                        py-1
                                        text-xs
                                        font-medium
                                        ${getStatusClass(
                                            selectedTask.status
                                        )}
                                    `}
                                >
                                    {selectedTask.status}
                                </span>

                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedTask(null)
                                }
                                className="
                                    rounded-lg
                                    p-2
                                    text-slate-400
                                    hover:bg-slate-100
                                    hover:text-slate-700
                                    dark:hover:bg-slate-800
                                    dark:hover:text-white
                                "
                            >
                                <X className="h-5 w-5" />
                            </button>

                        </div>

                        <div className="mt-6">

                            <h4
                                className="
                                    text-sm
                                    font-semibold
                                    text-slate-900
                                    dark:text-white
                                "
                            >
                                Requirements / Description
                            </h4>

                            <p
                                className="
                                    mt-2
                                    text-sm
                                    leading-6
                                    text-slate-600
                                    dark:text-slate-400
                                "
                            >
                                {selectedTask.description}
                            </p>

                        </div>

                        <div
                            className="
                                mt-6
                                grid
                                gap-4
                                sm:grid-cols-2
                            "
                        >

                            <div>
                                <p className="text-xs text-slate-400">
                                    Project
                                </p>

                                <p className="mt-1 text-sm font-medium text-slate-900 dark:text-white">
                                    {selectedTask.project}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-400">
                                    Sprint
                                </p>

                                <p className="mt-1 text-sm font-medium text-slate-900 dark:text-white">
                                    {selectedTask.sprint}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-400">
                                    Priority
                                </p>

                                <p
                                    className={`
                                        mt-1
                                        text-sm
                                        font-semibold
                                        ${getPriorityClass(
                                            selectedTask.priority
                                        )}
                                    `}
                                >
                                    {selectedTask.priority}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-400">
                                    Due Date
                                </p>

                                <p className="mt-1 text-sm font-medium text-slate-900 dark:text-white">
                                    {selectedTask.dueDate}
                                </p>
                            </div>

                        </div>

                        <div className="mt-6">

                            <div className="mb-2 flex justify-between">

                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Progress
                                </span>

                                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                    {selectedTask.progress}%
                                </span>

                            </div>

                            <div
                                className="
                                    h-2.5
                                    overflow-hidden
                                    rounded-full
                                    bg-slate-200
                                    dark:bg-slate-700
                                "
                            >
                                <div
                                    className="
                                        h-full
                                        rounded-full
                                        bg-blue-600
                                    "
                                    style={{
                                        width: `${selectedTask.progress}%`,
                                    }}
                                />
                            </div>

                        </div>

                        <div
                            className="
                                mt-6
                                flex
                                items-center
                                gap-2
                                rounded-xl
                                bg-green-50
                                p-4
                                dark:bg-green-950/20
                            "
                        >

                            <CheckCircle2
                                className="
                                    h-5
                                    w-5
                                    text-green-600
                                    dark:text-green-400
                                "
                            />

                            <p
                                className="
                                    text-sm
                                    text-green-700
                                    dark:text-green-400
                                "
                            >
                                This task is assigned to you.
                                Review the requirements and
                                complete the assigned work.
                            </p>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}

export default ViewMyWork;