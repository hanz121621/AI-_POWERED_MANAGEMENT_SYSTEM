import {
    useEffect,
    useMemo,
    useState,
} from "react";

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
    ClipboardList,
    X,
} from "lucide-react";

import api from "@/services/api";

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

/*
|--------------------------------------------------------------------------
| Backend enum values
|--------------------------------------------------------------------------
| ProjectTaskStatus:
|
| Todo       = 1
| InProgress = 2
| InReview   = 3
| Completed  = 4
| Blocked    = 5
|--------------------------------------------------------------------------
*/
const BACKEND_STATUS_VALUES = {
    Todo: 1,
    InProgress: 2,
    InReview: 3,
    Completed: 4,
    Blocked: 5,
};

const normalizeStatus = (status) => {
    if (typeof status === "number") {
        switch (status) {
            case 1:
                return "To Do";

            case 2:
                return "In Progress";

            case 3:
                return "Review";

            case 4:
                return "Completed";

            case 5:
                return "Blocked";

            default:
                return "To Do";
        }
    }

    const normalized = String(status ?? "")
        .trim()
        .toLowerCase()
        .replace(/[_-]/g, " ");

    switch (normalized) {
        case "todo":
        case "to do":
            return "To Do";

        case "inprogress":
        case "in progress":
            return "In Progress";

        case "inreview":
        case "in review":
        case "review":
            return "Review";

        case "completed":
        case "complete":
            return "Completed";

        case "blocked":
            return "Blocked";

        default:
            return "To Do";
    }
};

const normalizePriority = (priority) => {
    if (typeof priority === "number") {
        switch (priority) {
            case 0:
                return "Critical";

            case 1:
                return "High";

            case 2:
                return "Medium";

            case 3:
                return "Low";

            default:
                return "Medium";
        }
    }

    const normalized = String(priority ?? "")
        .trim()
        .toLowerCase();

    switch (normalized) {
        case "critical":
            return "Critical";

        case "high":
            return "High";

        case "medium":
            return "Medium";

        case "low":
            return "Low";

        default:
            return "Medium";
    }
};

const formatDate = (value) => {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return date.toLocaleDateString();
};

const shortId = (value) => {
    if (!value) {
        return "—";
    }

    const stringValue = String(value);

    if (stringValue.length <= 8) {
        return stringValue;
    }

    return stringValue.slice(0, 8);
};

const mapBackendTask = (task) => {
    const estimatedHours = Number(
        task?.estimatedHours ?? 0
    );

    const actualHours = Number(
        task?.actualHours ?? 0
    );

    const progress =
        estimatedHours > 0
            ? Math.min(
                  100,
                  Math.round(
                      (actualHours / estimatedHours) * 100
                  )
              )
            : 0;

    return {
        id: task?.id,
        title: task?.title || "Untitled Task",
        description: task?.description || "",

        status: normalizeStatus(task?.status),
        priority: normalizePriority(task?.priority),

        project: "—",
        sprint: shortId(task?.sprintId),

        dueDate: task?.dueDate,
        creator: shortId(task?.createdBy),

        estimatedHours,
        actualHours,

        subtasks: 0,
        completedSubtasks: 0,
        comments: 0,
        files: 0,

        progress,

        sprintId: task?.sprintId,
        createdBy: task?.createdBy,
        assignedContributorSDId:
            task?.assignedContributorSDId,

        createdAt: task?.createdAt,
        updatedAt: task?.updatedAt,
    };
};

const getApiErrorMessage = (
    error,
    fallback = "Something went wrong."
) => {
    return (
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.response?.data?.title ||
        error?.message ||
        fallback
    );
};

export default function ViewAssignedTasks({
    selectedTask: controlledSelectedTask,
    onSelectTask,
}) {
    /*
    |--------------------------------------------------------------------------
    | Selected task
    |--------------------------------------------------------------------------
    */

    const [
        localSelectedTask,
        setLocalSelectedTask,
    ] = useState(null);

    const isControlled =
        typeof onSelectTask === "function";

    const selectedTask = isControlled
        ? controlledSelectedTask
        : localSelectedTask;

    const selectTask = (task) => {
        if (isControlled) {
            onSelectTask(task);
        } else {
            setLocalSelectedTask(task);
        }
    };

    const clearSelectedTask = () => {
        if (isControlled) {
            onSelectTask(null);
        } else {
            setLocalSelectedTask(null);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Task state
    |--------------------------------------------------------------------------
    */

    const [tasks, setTasks] = useState([]);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");
    const [priority, setPriority] = useState("All");

    const [loading, setLoading] = useState(true);
    const [updatingStatus, setUpdatingStatus] =
        useState(false);

    const [error, setError] = useState("");

    /*
    |--------------------------------------------------------------------------
    | Load developer's assigned tasks
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        let isMounted = true;

        const loadMyWork = async () => {
            setLoading(true);
            setError("");

            try {
                const response = await api.get(
                    "/tasks/my-work"
                );

                const responseData = response?.data;

                let backendTasks = [];

                if (Array.isArray(responseData)) {
                    backendTasks = responseData;
                } else if (
                    Array.isArray(responseData?.data)
                ) {
                    backendTasks = responseData.data;
                } else if (
                    Array.isArray(responseData?.tasks)
                ) {
                    backendTasks = responseData.tasks;
                }

                if (isMounted) {
                    setTasks(
                        backendTasks.map(
                            mapBackendTask
                        )
                    );
                }
            } catch (error) {
                console.error(
                    "GET MY WORK ERROR:",
                    error
                );

                if (isMounted) {
                    setError(
                        getApiErrorMessage(
                            error,
                            "Unable to load your assigned tasks."
                        )
                    );
                }
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

    /*
    |--------------------------------------------------------------------------
    | Filter tasks
    |--------------------------------------------------------------------------
    */

    const filteredTasks = useMemo(() => {
        const searchValue = search
            .trim()
            .toLowerCase();

        return tasks.filter((task) => {
            const matchesSearch =
                !searchValue ||
                task.title
                    .toLowerCase()
                    .includes(searchValue) ||
                task.description
                    .toLowerCase()
                    .includes(searchValue) ||
                task.id
                    ?.toString()
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
    }, [
        tasks,
        search,
        status,
        priority,
    ]);

    /*
    |--------------------------------------------------------------------------
    | Update task in local list
    |--------------------------------------------------------------------------
    */

    const updateTask = (updatedTask) => {
        if (!updatedTask) {
            return;
        }

        const mappedTask =
            mapBackendTask(updatedTask);

        setTasks((currentTasks) =>
            currentTasks.map((task) =>
                task.id === mappedTask.id
                    ? mappedTask
                    : task
            )
        );

        selectTask(mappedTask);
    };

    /*
    |--------------------------------------------------------------------------
    | Mark selected task as In Progress
    |--------------------------------------------------------------------------
    */

    const handleMarkInProgress = async () => {
        if (!selectedTask?.id) {
            return;
        }

        setUpdatingStatus(true);
        setError("");

        try {
            const response = await api.put(
                `/tasks/${selectedTask.id}/status`,
                {
                    status:
                        BACKEND_STATUS_VALUES.InProgress,

                    progressNote: null,
                    comment: null,
                }
            );

            const responseData = response?.data;

            const updatedBackendTask =
                responseData?.task ||
                responseData?.data ||
                responseData;

            if (
                updatedBackendTask &&
                typeof updatedBackendTask ===
                    "object"
            ) {
                updateTask(updatedBackendTask);
            } else {
                /*
                |--------------------------------------------------------------------------
                | API returned only a success message.
                |--------------------------------------------------------------------------
                */

                const locallyUpdatedTask = {
                    ...selectedTask,
                    status: "In Progress",
                };

                setTasks((currentTasks) =>
                    currentTasks.map((task) =>
                        task.id ===
                        locallyUpdatedTask.id
                            ? locallyUpdatedTask
                            : task
                    )
                );

                selectTask(locallyUpdatedTask);
            }
        } catch (error) {
            console.error(
                "UPDATE TASK STATUS ERROR:",
                error
            );

            setError(
                getApiErrorMessage(
                    error,
                    "Unable to update task status."
                )
            );
        } finally {
            setUpdatingStatus(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Summary counts
    |--------------------------------------------------------------------------
    */

    const totalTasks = tasks.length;

    const inProgressCount = tasks.filter(
        (task) =>
            task.status === "In Progress"
    ).length;

    const reviewCount = tasks.filter(
        (task) =>
            task.status === "Review"
    ).length;

    const blockedCount = tasks.filter(
        (task) =>
            task.status === "Blocked"
    ).length;

    /*
    |--------------------------------------------------------------------------
    | Status icon
    |--------------------------------------------------------------------------
    */

    const getStatusIcon = (taskStatus) => {
        switch (taskStatus) {
            case "Completed":
                return (
                    <CheckCircle2 className="h-4 w-4" />
                );

            case "In Progress":
                return (
                    <Clock3 className="h-4 w-4" />
                );

            case "Review":
                return (
                    <CircleDot className="h-4 w-4" />
                );

            case "Blocked":
                return (
                    <AlertTriangle className="h-4 w-4" />
                );

            default:
                return (
                    <CircleDot className="h-4 w-4" />
                );
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Status styling
    |--------------------------------------------------------------------------
    */

    const getStatusClasses = (taskStatus) => {
        switch (taskStatus) {
            case "Completed":
                return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300";

            case "In Progress":
                return "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300";

            case "Review":
                return "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300";

            case "Blocked":
                return "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300";

            default:
                return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Priority styling
    |--------------------------------------------------------------------------
    */

    const getPriorityClasses = (taskPriority) => {
        switch (taskPriority) {
            case "Critical":
                return "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300";

            case "High":
                return "bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300";

            case "Medium":
                return "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-300";

            case "Low":
                return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";

            default:
                return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
        }
    };

    return (
        <div className="space-y-5">

            {/* =========================================================
                ERROR
            ========================================================= */}

            {error && (
                <div
                    className="
                        rounded-xl
                        border
                        border-red-200
                        bg-red-50
                        px-4
                        py-3
                        text-sm
                        text-red-700
                        dark:border-red-900/60
                        dark:bg-red-950/20
                        dark:text-red-300
                    "
                >
                    {error}
                </div>
            )}

            {/* =========================================================
                SUMMARY
            ========================================================= */}

            <div
                className="
                    grid
                    grid-cols-2
                    gap-3
                    sm:grid-cols-4
                "
            >

                {/* TOTAL */}

                <div
                    className="
                        rounded-xl
                        border
                        border-slate-200
                        bg-slate-50
                        p-4
                        dark:border-blue-900/60
                        dark:bg-[#071a33]
                    "
                >
                    <p
                        className="
                            text-xs
                            font-medium
                            text-slate-500
                            dark:text-slate-400
                        "
                    >
                        Total
                    </p>

                    <p
                        className="
                            mt-1
                            text-2xl
                            font-bold
                            text-slate-900
                            dark:text-white
                        "
                    >
                        {totalTasks}
                    </p>
                </div>

                {/* IN PROGRESS */}

                <div
                    className="
                        rounded-xl
                        border
                        border-blue-200
                        bg-blue-50
                        p-4
                        dark:border-blue-900/60
                        dark:bg-blue-950/20
                    "
                >
                    <p
                        className="
                            text-xs
                            font-medium
                            text-blue-600
                            dark:text-blue-400
                        "
                    >
                        In Progress
                    </p>

                    <p
                        className="
                            mt-1
                            text-2xl
                            font-bold
                            text-blue-700
                            dark:text-blue-300
                        "
                    >
                        {inProgressCount}
                    </p>
                </div>

                {/* REVIEW */}

                <div
                    className="
                        rounded-xl
                        border
                        border-purple-200
                        bg-purple-50
                        p-4
                        dark:border-purple-900/60
                        dark:bg-purple-950/20
                    "
                >
                    <p
                        className="
                            text-xs
                            font-medium
                            text-purple-600
                            dark:text-purple-400
                        "
                    >
                        Review
                    </p>

                    <p
                        className="
                            mt-1
                            text-2xl
                            font-bold
                            text-purple-700
                            dark:text-purple-300
                        "
                    >
                        {reviewCount}
                    </p>
                </div>

                {/* BLOCKED */}

                <div
                    className="
                        rounded-xl
                        border
                        border-red-200
                        bg-red-50
                        p-4
                        dark:border-red-900/60
                        dark:bg-red-950/20
                    "
                >
                    <p
                        className="
                            text-xs
                            font-medium
                            text-red-600
                            dark:text-red-400
                        "
                    >
                        Blocked
                    </p>

                    <p
                        className="
                            mt-1
                            text-2xl
                            font-bold
                            text-red-700
                            dark:text-red-300
                        "
                    >
                        {blockedCount}
                    </p>
                </div>

            </div>

            {/* =========================================================
                FILTERS
            ========================================================= */}

            <div
                className="
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    p-4
                    dark:border-blue-900/60
                    dark:bg-[#071a33]
                "
            >

                <div
                    className="
                        mb-3
                        flex
                        items-center
                        gap-2
                    "
                >
                    <Filter
                        className="
                            h-4
                            w-4
                            text-slate-500
                            dark:text-slate-400
                        "
                    />

                    <span
                        className="
                            text-sm
                            font-semibold
                            text-slate-700
                            dark:text-slate-300
                        "
                    >
                        Filters
                    </span>
                </div>

                <div
                    className="
                        grid
                        grid-cols-1
                        gap-3
                        md:grid-cols-3
                    "
                >

                    {/* SEARCH */}

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
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Search tasks..."
                            className="
                                w-full
                                rounded-lg
                                border
                                border-slate-200
                                bg-white
                                py-2.5
                                pl-9
                                pr-3
                                text-sm
                                text-slate-900
                                outline-none
                                transition
                                focus:border-blue-400
                                focus:ring-2
                                focus:ring-blue-100
                                dark:border-blue-900/60
                                dark:bg-[#0b2344]
                                dark:text-white
                                dark:focus:ring-blue-950/50
                            "
                        />

                    </div>

                    {/* STATUS */}

                    <select
                        value={status}
                        onChange={(event) =>
                            setStatus(
                                event.target.value
                            )
                        }
                        className="
                            w-full
                            rounded-lg
                            border
                            border-slate-200
                            bg-white
                            px-3
                            py-2.5
                            text-sm
                            text-slate-900
                            outline-none
                            transition
                            focus:border-blue-400
                            focus:ring-2
                            focus:ring-blue-100
                            dark:border-blue-900/60
                            dark:bg-[#0b2344]
                            dark:text-white
                            dark:focus:ring-blue-950/50
                        "
                    >
                        {STATUS_OPTIONS.map(
                            (option) => (
                                <option
                                    key={option}
                                    value={option}
                                >
                                    Status: {option}
                                </option>
                            )
                        )}
                    </select>

                    {/* PRIORITY */}

                    <select
                        value={priority}
                        onChange={(event) =>
                            setPriority(
                                event.target.value
                            )
                        }
                        className="
                            w-full
                            rounded-lg
                            border
                            border-slate-200
                            bg-white
                            px-3
                            py-2.5
                            text-sm
                            text-slate-900
                            outline-none
                            transition
                            focus:border-blue-400
                            focus:ring-2
                            focus:ring-blue-100
                            dark:border-blue-900/60
                            dark:bg-[#0b2344]
                            dark:text-white
                            dark:focus:ring-blue-950/50
                        "
                    >
                        {PRIORITY_OPTIONS.map(
                            (option) => (
                                <option
                                    key={option}
                                    value={option}
                                >
                                    Priority: {option}
                                </option>
                            )
                        )}
                    </select>

                </div>

            </div>

            {/* =========================================================
                TASK LIST
            ========================================================= */}

            <div className="space-y-3">

                {loading ? (
                    <div
                        className="
                            rounded-xl
                            border
                            border-slate-200
                            bg-slate-50
                            p-8
                            text-center
                            dark:border-blue-900/60
                            dark:bg-[#071a33]
                        "
                    >
                        <div
                            className="
                                mx-auto
                                mb-3
                                h-6
                                w-6
                                animate-spin
                                rounded-full
                                border-2
                                border-slate-300
                                border-t-blue-600
                                dark:border-blue-900
                                dark:border-t-blue-400
                            "
                        />

                        <p
                            className="
                                text-sm
                                text-slate-500
                                dark:text-slate-400
                            "
                        >
                            Loading your assigned tasks...
                        </p>
                    </div>
                ) : filteredTasks.length === 0 ? (
                    <div
                        className="
                            rounded-xl
                            border
                            border-dashed
                            border-slate-300
                            bg-slate-50
                            p-8
                            text-center
                            dark:border-blue-900/60
                            dark:bg-[#071a33]
                        "
                    >
                        <ClipboardList
                            className="
                                mx-auto
                                h-8
                                w-8
                                text-slate-400
                                dark:text-slate-500
                            "
                        />

                        <p
                            className="
                                mt-3
                                text-sm
                                font-medium
                                text-slate-700
                                dark:text-slate-300
                            "
                        >
                            No assigned tasks found.
                        </p>

                        <p
                            className="
                                mt-1
                                text-xs
                                text-slate-500
                                dark:text-slate-400
                            "
                        >
                            Try changing your search or filters.
                        </p>
                    </div>
                ) : (
                    filteredTasks.map((task) => (
                        <div
                            key={task.id}
                            className="
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                p-4
                                shadow-sm
                                transition
                                hover:-translate-y-0.5
                                hover:border-blue-200
                                hover:shadow-md
                                dark:border-blue-900/60
                                dark:bg-[#071a33]
                                dark:hover:border-blue-800
                            "
                        >

                            {/* TOP */}

                            <div
                                className="
                                    flex
                                    flex-col
                                    gap-3
                                    sm:flex-row
                                    sm:items-start
                                    sm:justify-between
                                "
                            >

                                <div className="min-w-0">

                                    <div
                                        className="
                                            flex
                                            flex-wrap
                                            items-center
                                            gap-2
                                        "
                                    >

                                        <h4
                                            className="
                                                text-sm
                                                font-bold
                                                text-slate-900
                                                dark:text-white
                                            "
                                        >
                                            {task.title}
                                        </h4>

                                        <span
                                            className={`
                                                inline-flex
                                                items-center
                                                gap-1
                                                rounded-full
                                                px-2
                                                py-1
                                                text-[10px]
                                                font-semibold
                                                ${getStatusClasses(
                                                    task.status
                                                )}
                                            `}
                                        >
                                            {getStatusIcon(
                                                task.status
                                            )}

                                            {task.status}
                                        </span>

                                        <span
                                            className={`
                                                rounded-full
                                                px-2
                                                py-1
                                                text-[10px]
                                                font-semibold
                                                ${getPriorityClasses(
                                                    task.priority
                                                )}
                                            `}
                                        >
                                            {task.priority}
                                        </span>

                                    </div>

                                    <p
                                        className="
                                            mt-2
                                            line-clamp-2
                                            text-xs
                                            leading-5
                                            text-slate-500
                                            dark:text-slate-400
                                        "
                                    >
                                        {task.description ||
                                            "No task description available."}
                                    </p>

                                </div>

                                {/* VIEW DETAILS */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        selectTask(task)
                                    }
                                    className="
                                        inline-flex
                                        shrink-0
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-lg
                                        border
                                        border-slate-200
                                        bg-white
                                        px-3
                                        py-2
                                        text-xs
                                        font-semibold
                                        text-slate-700
                                        transition
                                        hover:border-blue-200
                                        hover:bg-blue-50
                                        hover:text-blue-700
                                        dark:border-blue-900/60
                                        dark:bg-[#0b2344]
                                        dark:text-slate-300
                                        dark:hover:bg-blue-950/40
                                        dark:hover:text-blue-300
                                    "
                                >
                                    <Eye className="h-4 w-4" />
                                    View Details
                                </button>

                            </div>

                            {/* META */}

                            <div
                                className="
                                    mt-4
                                    grid
                                    grid-cols-1
                                    gap-2
                                    sm:grid-cols-3
                                "
                            >

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        text-xs
                                        text-slate-500
                                        dark:text-slate-400
                                    "
                                >
                                    <FolderKanban
                                        className="
                                            h-4
                                            w-4
                                            text-blue-500
                                        "
                                    />

                                    <span>
                                        Sprint {task.sprint}
                                    </span>
                                </div>

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        text-xs
                                        text-slate-500
                                        dark:text-slate-400
                                    "
                                >
                                    <CalendarDays
                                        className="
                                            h-4
                                            w-4
                                            text-orange-500
                                        "
                                    />

                                    <span>
                                        Due{" "}
                                        {formatDate(
                                            task.dueDate
                                        )}
                                    </span>
                                </div>

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        text-xs
                                        text-slate-500
                                        dark:text-slate-400
                                    "
                                >
                                    <Flag
                                        className="
                                            h-4
                                            w-4
                                            text-purple-500
                                        "
                                    />

                                    <span>
                                        {task.actualHours}h /{" "}
                                        {task.estimatedHours}h
                                    </span>
                                </div>

                            </div>

                            {/* PROGRESS */}

                            <div className="mt-4">

                                <div
                                    className="
                                        mb-1.5
                                        flex
                                        items-center
                                        justify-between
                                    "
                                >
                                    <span
                                        className="
                                            text-[11px]
                                            font-medium
                                            text-slate-500
                                            dark:text-slate-400
                                        "
                                    >
                                        Progress
                                    </span>

                                    <span
                                        className="
                                            text-[11px]
                                            font-semibold
                                            text-slate-700
                                            dark:text-slate-300
                                        "
                                    >
                                        {task.progress}%
                                    </span>
                                </div>

                                <div
                                    className="
                                        h-2
                                        overflow-hidden
                                        rounded-full
                                        bg-slate-100
                                        dark:bg-blue-950/60
                                    "
                                >
                                    <div
                                        className="
                                            h-full
                                            rounded-full
                                            bg-blue-600
                                            transition-all
                                            dark:bg-blue-500
                                        "
                                        style={{
                                            width: `${task.progress}%`,
                                        }}
                                    />
                                </div>

                            </div>

                        </div>
                    ))
                )}

            </div>

            {/* =========================================================
                TASK DETAILS MODAL
            ========================================================= */}

            {selectedTask && (
                <div
                    className="
                        fixed
                        inset-0
                        z-50
                        flex
                        items-center
                        justify-center
                        bg-slate-950/50
                        p-4
                        backdrop-blur-sm
                    "
                    onClick={clearSelectedTask}
                >

                    <div
                        className="
                            max-h-[90vh]
                            w-full
                            max-w-2xl
                            overflow-y-auto
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            shadow-2xl
                            dark:border-blue-900/60
                            dark:bg-[#0b2344]
                        "
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        {/* MODAL HEADER */}

                        <div
                            className="
                                flex
                                items-start
                                justify-between
                                border-b
                                border-slate-200
                                px-5
                                py-4
                                dark:border-blue-900/60
                            "
                        >

                            <div className="min-w-0 pr-4">

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
                                            font-bold
                                            text-slate-900
                                            dark:text-white
                                        "
                                    >
                                        {selectedTask.title}
                                    </h3>

                                    <span
                                        className={`
                                            inline-flex
                                            items-center
                                            gap-1
                                            rounded-full
                                            px-2
                                            py-1
                                            text-[10px]
                                            font-semibold
                                            ${getStatusClasses(
                                                selectedTask.status
                                            )}
                                        `}
                                    >
                                        {getStatusIcon(
                                            selectedTask.status
                                        )}

                                        {selectedTask.status}
                                    </span>

                                </div>

                                <p
                                    className="
                                        mt-1
                                        text-xs
                                        text-slate-500
                                        dark:text-slate-400
                                    "
                                >
                                    Task ID: {selectedTask.id}
                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={clearSelectedTask}
                                className="
                                    rounded-lg
                                    p-2
                                    text-slate-400
                                    transition
                                    hover:bg-slate-100
                                    hover:text-slate-700
                                    dark:hover:bg-blue-950/50
                                    dark:hover:text-slate-200
                                "
                                aria-label="Close task details"
                            >
                                <X className="h-5 w-5" />
                            </button>

                        </div>

                        {/* MODAL CONTENT */}

                        <div className="space-y-5 p-5">

                            {/* DESCRIPTION */}

                            <div>

                                <h4
                                    className="
                                        text-sm
                                        font-semibold
                                        text-slate-900
                                        dark:text-white
                                    "
                                >
                                    Description
                                </h4>

                                <p
                                    className="
                                        mt-2
                                        whitespace-pre-wrap
                                        text-sm
                                        leading-6
                                        text-slate-600
                                        dark:text-slate-300
                                    "
                                >
                                    {selectedTask.description ||
                                        "No task description available."}
                                </p>

                            </div>

                            {/* TASK INFORMATION */}

                            <div
                                className="
                                    grid
                                    grid-cols-1
                                    gap-3
                                    sm:grid-cols-2
                                "
                            >

                                <div
                                    className="
                                        rounded-xl
                                        bg-slate-50
                                        p-3
                                        dark:bg-[#071a33]
                                    "
                                >
                                    <p
                                        className="
                                            text-[11px]
                                            text-slate-500
                                            dark:text-slate-400
                                        "
                                    >
                                        Priority
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-sm
                                            font-semibold
                                            text-slate-900
                                            dark:text-white
                                        "
                                    >
                                        {selectedTask.priority}
                                    </p>
                                </div>

                                <div
                                    className="
                                        rounded-xl
                                        bg-slate-50
                                        p-3
                                        dark:bg-[#071a33]
                                    "
                                >
                                    <p
                                        className="
                                            text-[11px]
                                            text-slate-500
                                            dark:text-slate-400
                                        "
                                    >
                                        Due Date
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-sm
                                            font-semibold
                                            text-slate-900
                                            dark:text-white
                                        "
                                    >
                                        {formatDate(
                                            selectedTask.dueDate
                                        )}
                                    </p>
                                </div>

                                <div
                                    className="
                                        rounded-xl
                                        bg-slate-50
                                        p-3
                                        dark:bg-[#071a33]
                                    "
                                >
                                    <p
                                        className="
                                            text-[11px]
                                            text-slate-500
                                            dark:text-slate-400
                                        "
                                    >
                                        Estimated Hours
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-sm
                                            font-semibold
                                            text-slate-900
                                            dark:text-white
                                        "
                                    >
                                        {selectedTask.estimatedHours}h
                                    </p>
                                </div>

                                <div
                                    className="
                                        rounded-xl
                                        bg-slate-50
                                        p-3
                                        dark:bg-[#071a33]
                                    "
                                >
                                    <p
                                        className="
                                            text-[11px]
                                            text-slate-500
                                            dark:text-slate-400
                                        "
                                    >
                                        Actual Hours
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-sm
                                            font-semibold
                                            text-slate-900
                                            dark:text-white
                                        "
                                    >
                                        {selectedTask.actualHours}h
                                    </p>
                                </div>

                            </div>

                            {/* PROGRESS */}

                            <div>

                                <div
                                    className="
                                        mb-2
                                        flex
                                        items-center
                                        justify-between
                                    "
                                >
                                    <h4
                                        className="
                                            text-sm
                                            font-semibold
                                            text-slate-900
                                            dark:text-white
                                        "
                                    >
                                        Progress
                                    </h4>

                                    <span
                                        className="
                                            text-sm
                                            font-bold
                                            text-blue-600
                                            dark:text-blue-400
                                        "
                                    >
                                        {selectedTask.progress}%
                                    </span>

                                </div>

                                <div
                                    className="
                                        h-2.5
                                        overflow-hidden
                                        rounded-full
                                        bg-slate-100
                                        dark:bg-blue-950/60
                                    "
                                >
                                    <div
                                        className="
                                            h-full
                                            rounded-full
                                            bg-blue-600
                                            transition-all
                                            dark:bg-blue-500
                                        "
                                        style={{
                                            width: `${selectedTask.progress}%`,
                                        }}
                                    />
                                </div>

                            </div>

                            {/* TASK METADATA */}

                            <div
                                className="
                                    rounded-xl
                                    border
                                    border-slate-200
                                    p-4
                                    dark:border-blue-900/60
                                "
                            >

                                <div
                                    className="
                                        grid
                                        grid-cols-1
                                        gap-3
                                        sm:grid-cols-2
                                    "
                                >

                                    <div>

                                        <p
                                            className="
                                                text-[11px]
                                                text-slate-500
                                                dark:text-slate-400
                                            "
                                        >
                                            Sprint
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                text-sm
                                                font-medium
                                                text-slate-900
                                                dark:text-white
                                            "
                                        >
                                            {selectedTask.sprint}
                                        </p>

                                    </div>

                                    <div>

                                        <p
                                            className="
                                                text-[11px]
                                                text-slate-500
                                                dark:text-slate-400
                                            "
                                        >
                                            Created By
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                text-sm
                                                font-medium
                                                text-slate-900
                                                dark:text-white
                                            "
                                        >
                                            {selectedTask.creator}
                                        </p>

                                    </div>

                                    <div>

                                        <p
                                            className="
                                                text-[11px]
                                                text-slate-500
                                                dark:text-slate-400
                                            "
                                        >
                                            Created
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                text-sm
                                                font-medium
                                                text-slate-900
                                                dark:text-white
                                            "
                                        >
                                            {formatDate(
                                                selectedTask.createdAt
                                            )}
                                        </p>

                                    </div>

                                    <div>

                                        <p
                                            className="
                                                text-[11px]
                                                text-slate-500
                                                dark:text-slate-400
                                            "
                                        >
                                            Last Updated
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                text-sm
                                                font-medium
                                                text-slate-900
                                                dark:text-white
                                            "
                                        >
                                            {formatDate(
                                                selectedTask.updatedAt
                                            )}
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* MODAL FOOTER */}

                        <div
                            className="
                                flex
                                flex-col-reverse
                                gap-3
                                border-t
                                border-slate-200
                                px-5
                                py-4
                                sm:flex-row
                                sm:justify-end
                                dark:border-blue-900/60
                            "
                        >

                            <button
                                type="button"
                                onClick={clearSelectedTask}
                                className="
                                    rounded-lg
                                    border
                                    border-slate-200
                                    bg-white
                                    px-4
                                    py-2.5
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                    transition
                                    hover:bg-slate-50
                                    dark:border-blue-900/60
                                    dark:bg-[#071a33]
                                    dark:text-slate-300
                                    dark:hover:bg-blue-950/40
                                "
                            >
                                Close
                            </button>

                            {selectedTask.status ===
                                "To Do" && (
                                <button
                                    type="button"
                                    onClick={
                                        handleMarkInProgress
                                    }
                                    disabled={
                                        updatingStatus
                                    }
                                    className="
                                        rounded-lg
                                        bg-blue-600
                                        px-4
                                        py-2.5
                                        text-sm
                                        font-semibold
                                        text-white
                                        transition
                                        hover:bg-blue-700
                                        disabled:cursor-not-allowed
                                        disabled:opacity-60
                                    "
                                >
                                    {updatingStatus
                                        ? "Updating..."
                                        : "Mark In Progress"}
                                </button>
                            )}

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}