import { useEffect, useMemo, useState } from "react";

import {
    AlertCircle,
    CalendarDays,
    
    ChevronDown,
    ClipboardList,
  
    FileText,
    FolderKanban,
    GitBranch,
    MessageSquare,
    Search,
   
    UserRound,
    XCircle,
} from "lucide-react";

import api from "@/services/api";


const STATUS_OPTIONS = [
    "All",
    "Backlog",
    "In Progress",
    "Review",
    "Blocked",
    "Done",
];

const PRIORITY_OPTIONS = [
    "All",
    "Low",
    "Medium",
    "High",
    "Critical",
];

function ViewDevelopmentWork() {
    // ========================================================
    // STATE
    // ========================================================

    const [tasks, setTasks] = useState([]);

    const [selectedTask, setSelectedTask] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [searchTerm, setSearchTerm] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("All");

    const [priorityFilter, setPriorityFilter] =
        useState("All");

    const [developer, setDeveloper] =
        useState({
            name: "Developer",
            team: "Not assigned",
            specialization: "Not assigned",
            projects: [],
        });

    // ========================================================
    // LOAD ASSIGNED DEVELOPMENT WORK
    // ========================================================

    useEffect(() => {
        loadDevelopmentWork();
    }, []);

    async function loadDevelopmentWork() {
        try {
            setLoading(true);
            setError("");

            // ------------------------------------------------
            // Try to load assigned tasks from backend.
            //
            // Keep this endpoint centralized so we can change
            // it later if your backend controller uses another
            // route.
            // ------------------------------------------------

            const response =
                await api.get(
                    "/Tasks/my-tasks"
                );

            const data =
                response?.data;

            const taskList =
                Array.isArray(data)
                    ? data
                    : Array.isArray(data?.tasks)
                        ? data.tasks
                        : [];

            setTasks(
                taskList.map(
                    normalizeTask
                )
            );

            // ------------------------------------------------
            // Developer information
            // ------------------------------------------------

            const storedUser =
                localStorage.getItem(
                    "user"
                );

            if (storedUser) {
                try {
                    const user =
                        JSON.parse(
                            storedUser
                        );

                    setDeveloper({
                        name:
                            user?.name ||
                            user?.fullName ||
                            user?.username ||
                            "Developer",

                        team:
                            user?.teamName ||
                            user?.team ||
                            "Not assigned",

                        specialization:
                            user?.specialization ||
                            user?.specialisation ||
                            "Not assigned",

                        projects:
                            Array.isArray(
                                user?.projects
                            )
                                ? user.projects
                                : [],
                    });
                } catch {
                    // Keep default developer information.
                }
            }
        } catch (requestError) {
            console.error(
                "Unable to load development work:",
                requestError
            );

            const status =
                requestError?.response?.status;

            if (status === 401) {
                setError(
                    "Access denied."
                );
            } else {
                setError(
                    "Unable to load development work. Please try again."
                );
            }
        } finally {
            setLoading(false);
        }
    }

    // ========================================================
    // NORMALIZE TASK
    // ========================================================

    function normalizeTask(task) {
        return {
            id:
                task?.taskId ??
                task?.id ??
                task?.TaskId,

            title:
                task?.title ??
                task?.taskTitle ??
                task?.name ??
                "Untitled Task",

            description:
                task?.description ??
                task?.taskDescription ??
                "No description available.",

            project:
                task?.projectName ??
                task?.project?.name ??
                task?.project?.projectName ??
                "No project",

            sprint:
                task?.sprintName ??
                task?.sprint?.name ??
                task?.sprint?.sprintName ??
                "No sprint",

            priority:
                task?.priority ??
                "Medium",

            status:
                task?.status ??
                "Backlog",

            dueDate:
                task?.dueDate ??
                task?.deadline ??
                null,

            progress:
                Number(
                    task?.progress ??
                    task?.progressPercentage ??
                    0
                ),

            dependencies:
                Array.isArray(
                    task?.dependencies
                )
                    ? task.dependencies
                    : [],

            files:
                Array.isArray(
                    task?.files
                )
                    ? task.files
                    : [],

            comments:
                Array.isArray(
                    task?.comments
                )
                    ? task.comments
                    : [],
        };
    }

    // ========================================================
    // FILTER TASKS
    // ========================================================

    const filteredTasks =
        useMemo(() => {
            const search =
                searchTerm
                    .trim()
                    .toLowerCase();

            return tasks.filter(
                (task) => {
                    const matchesSearch =
                        !search ||
                        task.title
                            .toLowerCase()
                            .includes(search) ||
                        task.description
                            .toLowerCase()
                            .includes(search) ||
                        task.project
                            .toLowerCase()
                            .includes(search) ||
                        task.sprint
                            .toLowerCase()
                            .includes(search);

                    const matchesStatus =
                        statusFilter ===
                            "All" ||
                        task.status ===
                            statusFilter;

                    const matchesPriority =
                        priorityFilter ===
                            "All" ||
                        task.priority ===
                            priorityFilter;

                    return (
                        matchesSearch &&
                        matchesStatus &&
                        matchesPriority
                    );
                }
            );
        }, [
            tasks,
            searchTerm,
            statusFilter,
            priorityFilter,
        ]);

    // ========================================================
    // FORMAT DATE
    // ========================================================

    function formatDate(date) {
        if (!date) {
            return "No due date";
        }

        const parsedDate =
            new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return "No due date";
        }

        return parsedDate.toLocaleDateString();
    }

    // ========================================================
    // STATUS STYLE
    // ========================================================

    function getStatusClass(status) {
        switch (status) {
            case "Done":
                return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400";

            case "In Progress":
                return "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400";

            case "Review":
                return "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400";

            case "Blocked":
                return "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400";

            case "Backlog":
            default:
                return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
        }
    }

    // ========================================================
    // PRIORITY STYLE
    // ========================================================

    function getPriorityClass(priority) {
        switch (priority) {
            case "Critical":
                return "text-red-600 dark:text-red-400";

            case "High":
                return "text-orange-600 dark:text-orange-400";

            case "Medium":
                return "text-yellow-600 dark:text-yellow-400";

            case "Low":
                return "text-green-600 dark:text-green-400";

            default:
                return "text-slate-600 dark:text-slate-400";
        }
    }

    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {
        return (
            <div
                className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-8
                    shadow-sm
                    dark:border-slate-700
                    dark:bg-[#0d2745]
                "
            >
                <div className="flex items-center justify-center gap-3">
                    <div
                        className="
                            h-5
                            w-5
                            animate-spin
                            rounded-full
                            border-2
                            border-blue-500
                            border-t-transparent
                        "
                    />

                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Loading development work...
                    </p>
                </div>
            </div>
        );
    }

    // ========================================================
    // ERROR
    // ========================================================

    if (error) {
        return (
            <div
                className="
                    rounded-2xl
                    border
                    border-red-200
                    bg-red-50
                    p-6
                    dark:border-red-900/50
                    dark:bg-red-950/20
                "
            >
                <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 text-red-500" />

                    <div>
                        <h3 className="font-semibold text-red-700 dark:text-red-400">
                            Unable to Load Development Work
                        </h3>

                        <p className="mt-1 text-sm text-red-600 dark:text-red-300">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={loadDevelopmentWork}
                            className="
                                mt-4
                                rounded-lg
                                bg-red-600
                                px-4
                                py-2
                                text-sm
                                font-medium
                                text-white
                                transition
                                hover:bg-red-700
                            "
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ========================================================
    // MAIN UI
    // ========================================================

    return (
        <div className="space-y-6">

            {/* ==================================================
                DEVELOPER INFORMATION
            ================================================== */}

            <div
                className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-5
                    shadow-sm
                    dark:border-slate-700
                    dark:bg-[#0d2745]
                "
            >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                    <div className="flex items-center gap-4">
                        <div
                            className="
                                flex
                                h-12
                                w-12
                                items-center
                                justify-center
                                rounded-xl
                                bg-blue-100
                                text-blue-600
                                dark:bg-blue-950/60
                                dark:text-blue-400
                            "
                        >
                            <UserRound className="h-6 w-6" />
                        </div>

                        <div>
                            <h3 className="font-semibold text-slate-900 dark:text-white">
                                {developer.name}
                            </h3>

                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Developer
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

                        <InfoItem
                            label="Team"
                            value={developer.team}
                        />

                        <InfoItem
                            label="Specialization"
                            value={
                                developer.specialization
                            }
                        />

                        <InfoItem
                            label="Assigned Projects"
                            value={
                                developer.projects
                                    ?.length ||
                                0
                            }
                        />

                    </div>
                </div>
            </div>

            {/* ==================================================
                SEARCH + FILTERS
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
                <div className="grid gap-3 lg:grid-cols-[1fr_200px_200px]">

                    {/* SEARCH */}

                    <div className="relative">
                        <Search
                            className="
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
                            value={searchTerm}
                            onChange={(event) =>
                                setSearchTerm(
                                    event.target.value
                                )
                            }
                            placeholder="Search development work..."
                            className="
                                w-full
                                rounded-xl
                                border
                                border-slate-200
                                bg-slate-50
                                py-2.5
                                pl-10
                                pr-4
                                text-sm
                                text-slate-900
                                outline-none
                                transition
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-500/20
                                dark:border-slate-700
                                dark:bg-[#081b33]
                                dark:text-white
                            "
                        />
                    </div>

                    {/* STATUS */}

                    <FilterSelect
                        value={statusFilter}
                        onChange={setStatusFilter}
                        options={STATUS_OPTIONS}
                    />

                    {/* PRIORITY */}

                    <FilterSelect
                        value={priorityFilter}
                        onChange={setPriorityFilter}
                        options={PRIORITY_OPTIONS}
                    />

                </div>
            </div>

            {/* ==================================================
                NO WORK
            ================================================== */}

            {tasks.length === 0 ? (
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
                    <ClipboardList className="mx-auto h-10 w-10 text-slate-400" />

                    <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
                        No assigned development work available.
                    </h3>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Development tasks assigned to you will appear here.
                    </p>
                </div>
            ) : filteredTasks.length === 0 ? (
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
                    <Search className="mx-auto h-10 w-10 text-slate-400" />

                    <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
                        No matching development work
                    </h3>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Try changing your search or filters.
                    </p>
                </div>
            ) : (
                /* ==================================================
                   TASK LIST
                ================================================== */

                <div className="grid gap-4 xl:grid-cols-2">

                    {filteredTasks.map(
                        (task) => (
                            <button
                                type="button"
                                key={task.id}
                                onClick={() =>
                                    setSelectedTask(
                                        task
                                    )
                                }
                                className="
                                    rounded-2xl
                                    border
                                    border-slate-200
                                    bg-white
                                    p-5
                                    text-left
                                    shadow-sm
                                    transition
                                    hover:-translate-y-0.5
                                    hover:border-blue-300
                                    hover:shadow-md
                                    dark:border-slate-700
                                    dark:bg-[#0d2745]
                                    dark:hover:border-blue-700
                                "
                            >
                                <div className="flex items-start justify-between gap-4">

                                    <div className="min-w-0">
                                        <h3 className="truncate font-semibold text-slate-900 dark:text-white">
                                            {task.title}
                                        </h3>

                                        <p className="mt-2 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                                            {task.description}
                                        </p>
                                    </div>

                                    <span
                                        className={`
                                            shrink-0
                                            rounded-full
                                            px-3
                                            py-1
                                            text-xs
                                            font-medium
                                            ${getStatusClass(
                                                task.status
                                            )}
                                        `}
                                    >
                                        {task.status}
                                    </span>
                                </div>

                                <div className="mt-5 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">

                                    <TaskMeta
                                        icon={
                                            <FolderKanban className="h-4 w-4" />
                                        }
                                        label="Project"
                                        value={
                                            task.project
                                        }
                                    />

                                    <TaskMeta
                                        icon={
                                            <GitBranch className="h-4 w-4" />
                                        }
                                        label="Sprint"
                                        value={
                                            task.sprint
                                        }
                                    />

                                    <TaskMeta
                                        icon={
                                            <CalendarDays className="h-4 w-4" />
                                        }
                                        label="Due"
                                        value={formatDate(
                                            task.dueDate
                                        )}
                                    />

                                    <TaskMeta
                                        icon={
                                            <AlertCircle className="h-4 w-4" />
                                        }
                                        label="Priority"
                                        value={
                                            task.priority
                                        }
                                        valueClass={
                                            getPriorityClass(
                                                task.priority
                                            )
                                        }
                                    />

                                </div>

                                {/* PROGRESS */}

                                <div className="mt-5">
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                            Progress
                                        </span>

                                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                            {task.progress}%
                                        </span>
                                    </div>

                                    <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                        <div
                                            className="h-full rounded-full bg-blue-500 transition-all"
                                            style={{
                                                width: `${Math.min(
                                                    100,
                                                    Math.max(
                                                        0,
                                                        task.progress
                                                    )
                                                )}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </button>
                        )
                    )}

                </div>
            )}

            {/* ==================================================
                TASK DETAILS
            ================================================== */}

            {selectedTask && (
                <TaskDetails
                    task={selectedTask}
                    onClose={() =>
                        setSelectedTask(
                            null
                        )
                    }
                    formatDate={
                        formatDate
                    }
                    getStatusClass={
                        getStatusClass
                    }
                    getPriorityClass={
                        getPriorityClass
                    }
                />
            )}
        </div>
    );
}

// ============================================================
// INFO ITEM
// ============================================================

function InfoItem({
    label,
    value,
}) {
    return (
        <div
            className="
                rounded-xl
                bg-slate-50
                px-4
                py-3
                dark:bg-[#081b33]
            "
        >
            <p className="text-xs text-slate-500 dark:text-slate-400">
                {label}
            </p>

            <p className="mt-1 truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                {value}
            </p>
        </div>
    );
}

// ============================================================
// FILTER SELECT
// ============================================================

function FilterSelect({
    value,
    onChange,
    options,
}) {
    return (
        <div className="relative">
            <select
                value={value}
                onChange={(event) =>
                    onChange(
                        event.target.value
                    )
                }
                className="
                    w-full
                    appearance-none
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-4
                    py-2.5
                    pr-10
                    text-sm
                    text-slate-900
                    outline-none
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-500/20
                    dark:border-slate-700
                    dark:bg-[#081b33]
                    dark:text-white
                "
            >
                {options.map(
                    (option) => (
                        <option
                            key={option}
                            value={option}
                        >
                            {option}
                        </option>
                    )
                )}
            </select>

            <ChevronDown
                className="
                    pointer-events-none
                    absolute
                    right-3
                    top-1/2
                    h-4
                    w-4
                    -translate-y-1/2
                    text-slate-400
                "
            />
        </div>
    );
}

// ============================================================
// TASK META
// ============================================================

function TaskMeta({
    icon,
    label,
    value,
    valueClass = "",
}) {
    return (
        <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-slate-400">
                {icon}

                <span className="text-xs">
                    {label}
                </span>
            </div>

            <p
                className={`
                    mt-1
                    truncate
                    text-xs
                    font-medium
                    ${valueClass || "text-slate-700 dark:text-slate-300"}
                `}
            >
                {value}
            </p>
        </div>
    );
}

// ============================================================
// TASK DETAILS
// ============================================================

function TaskDetails({
    task,
    onClose,
    formatDate,
    getStatusClass,
    getPriorityClass,
}) {
    return (
        <div
            className="
                rounded-2xl
                border
                border-blue-200
                bg-white
                p-6
                shadow-sm
                dark:border-blue-900/60
                dark:bg-[#0d2745]
            "
        >
            <div className="flex items-start justify-between gap-4">

                <div>
                    <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                            {task.title}
                        </h2>

                        <span
                            className={`
                                rounded-full
                                px-3
                                py-1
                                text-xs
                                font-medium
                                ${getStatusClass(
                                    task.status
                                )}
                            `}
                        >
                            {task.status}
                        </span>
                    </div>

                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        Complete authorized development task details
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="
                        rounded-lg
                        p-2
                        text-slate-400
                        transition
                        hover:bg-slate-100
                        hover:text-slate-700
                        dark:hover:bg-slate-800
                        dark:hover:text-white
                    "
                    aria-label="Close task details"
                >
                    <XCircle className="h-5 w-5" />
                </button>

            </div>

            {/* DESCRIPTION */}

            <div className="mt-6">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Description
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {task.description}
                </p>
            </div>

            {/* DETAILS GRID */}

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                <DetailCard
                    icon={
                        <FolderKanban className="h-4 w-4" />
                    }
                    label="Project"
                    value={task.project}
                />

                <DetailCard
                    icon={
                        <GitBranch className="h-4 w-4" />
                    }
                    label="Sprint"
                    value={task.sprint}
                />

                <DetailCard
                    icon={
                        <AlertCircle className="h-4 w-4" />
                    }
                    label="Priority"
                    value={task.priority}
                    valueClass={
                        getPriorityClass(
                            task.priority
                        )
                    }
                />

                <DetailCard
                    icon={
                        <CalendarDays className="h-4 w-4" />
                    }
                    label="Due Date"
                    value={formatDate(
                        task.dueDate
                    )}
                />

            </div>

            {/* PROGRESS */}

            <div className="mt-6">
                <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                        Progress
                    </h3>

                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                        {task.progress}%
                    </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                        className="h-full rounded-full bg-blue-500"
                        style={{
                            width: `${Math.min(
                                100,
                                Math.max(
                                    0,
                                    task.progress
                                )
                            )}%`,
                        }}
                    />
                </div>
            </div>

            {/* DEPENDENCIES */}

            <DetailSection
                icon={
                    <GitBranch className="h-5 w-5" />
                }
                title="Dependencies"
                emptyMessage="No dependencies recorded."
            >
                {task.dependencies.map(
                    (dependency, index) => (
                        <div
                            key={
                                dependency?.id ??
                                dependency?.taskId ??
                                index
                            }
                            className="
                                rounded-lg
                                bg-slate-50
                                px-3
                                py-2
                                text-sm
                                text-slate-700
                                dark:bg-[#081b33]
                                dark:text-slate-300
                            "
                        >
                            {dependency?.title ??
                                dependency?.name ??
                                dependency?.taskTitle ??
                                `Dependency ${index + 1}`}
                        </div>
                    )
                )}
            </DetailSection>

            {/* FILES */}

            <DetailSection
                icon={
                    <FileText className="h-5 w-5" />
                }
                title="Related Files"
                emptyMessage="No related files available."
            >
                {task.files.map(
                    (file, index) => (
                        <div
                            key={
                                file?.id ??
                                file?.fileId ??
                                index
                            }
                            className="
                                flex
                                items-center
                                gap-3
                                rounded-lg
                                bg-slate-50
                                px-3
                                py-2
                                dark:bg-[#081b33]
                            "
                        >
                            <FileText className="h-4 w-4 text-blue-500" />

                            <span className="truncate text-sm text-slate-700 dark:text-slate-300">
                                {file?.name ??
                                    file?.fileName ??
                                    `File ${index + 1}`}
                            </span>
                        </div>
                    )
                )}
            </DetailSection>

            {/* COMMENTS */}

            <DetailSection
                icon={
                    <MessageSquare className="h-5 w-5" />
                }
                title="Comments"
                emptyMessage="No comments available."
            >
                {task.comments.map(
                    (comment, index) => (
                        <div
                            key={
                                comment?.id ??
                                comment?.commentId ??
                                index
                            }
                            className="
                                rounded-lg
                                bg-slate-50
                                p-3
                                dark:bg-[#081b33]
                            "
                        >
                            <p className="text-sm text-slate-700 dark:text-slate-300">
                                {comment?.text ??
                                    comment?.content ??
                                    comment?.comment ??
                                    "No comment content."}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                                {comment?.authorName ??
                                    comment?.createdBy ??
                                    "Team member"}
                            </p>
                        </div>
                    )
                )}
            </DetailSection>
        </div>
    );
}

// ============================================================
// DETAIL CARD
// ============================================================

function DetailCard({
    icon,
    label,
    value,
    valueClass = "",
}) {
    return (
        <div
            className="
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                p-4
                dark:border-slate-700
                dark:bg-[#081b33]
            "
        >
            <div className="flex items-center gap-2 text-slate-400">
                {icon}

                <span className="text-xs">
                    {label}
                </span>
            </div>

            <p
                className={`
                    mt-2
                    text-sm
                    font-semibold
                    ${valueClass || "text-slate-800 dark:text-slate-200"}
                `}
            >
                {value}
            </p>
        </div>
    );
}

// ============================================================
// DETAIL SECTION
// ============================================================

function DetailSection({
    icon,
    title,
    children,
    emptyMessage,
}) {
    const hasChildren =
        Array.isArray(children)
            ? children.length > 0
            : Boolean(children);

    return (
        <div className="mt-6">

            <div className="mb-3 flex items-center gap-2">
                <span className="text-blue-500">
                    {icon}
                </span>

                <h3 className="font-semibold text-slate-900 dark:text-white">
                    {title}
                </h3>
            </div>

            {hasChildren ? (
                <div className="space-y-2">
                    {children}
                </div>
            ) : (
                <div
                    className="
                        rounded-lg
                        border
                        border-dashed
                        border-slate-200
                        p-4
                        text-sm
                        text-slate-500
                        dark:border-slate-700
                        dark:text-slate-400
                    "
                >
                    {emptyMessage}
                </div>
            )}
        </div>
    );
}

export default ViewDevelopmentWork;