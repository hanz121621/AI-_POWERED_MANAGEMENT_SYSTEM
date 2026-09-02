
import { useEffect, useMemo, useState } from "react";
import {
    AlertCircle,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Eye,
    Filter,
    FolderKanban,
    ListTodo,
    Loader2,
    Search,
    UserRound,
    X,
    Zap,
} from "lucide-react";



const DEMO_TASKS = [
    {
        id: 1,
        title: "Design Login Interface",
        description:
            "Create the login interface according to the approved system design.",
        assignee: "Hana Nigusse",
        assigneeType: "Developer",
        priority: "High",
        status: "In Progress",
        sprint: "Sprint 1",
        dueDate: "2026-08-28",
        progress: 65,
    },
    {
        id: 2,
        title: "Create Authentication API",
        description:
            "Implement authentication endpoints for login and user authentication.",
        assignee: "Meron Tesfaye",
        assigneeType: "Developer",
        priority: "High",
        status: "Review",
        sprint: "Sprint 1",
        dueDate: "2026-08-29",
        progress: 90,
    },
    {
        id: 3,
        title: "Prepare User Documentation",
        description:
            "Prepare documentation for user registration and account management.",
        assignee: "Sara Alemu",
        assigneeType: "Staff",
        priority: "Medium",
        status: "In Progress",
        sprint: "Sprint 2",
        dueDate: "2026-09-02",
        progress: 45,
    },
    {
        id: 4,
        title: "Project Database Design",
        description:
            "Review and document the project database structure.",
        assignee: "Abebe Kebede",
        assigneeType: "Team Leader",
        priority: "Medium",
        status: "Backlog",
        sprint: "Sprint 2",
        dueDate: "2026-09-05",
        progress: 0,
    },
    {
        id: 5,
        title: "API Integration Testing",
        description:
            "Test communication between the frontend and backend APIs.",
        assignee: "Hana Nigusse",
        assigneeType: "Developer",
        priority: "Critical",
        status: "Blocked",
        sprint: "Sprint 2",
        dueDate: "2026-09-01",
        progress: 35,
    },
    {
        id: 6,
        title: "Prepare Project Report",
        description:
            "Prepare the current project progress report.",
        assignee: "Sara Alemu",
        assigneeType: "Staff",
        priority: "Low",
        status: "Done",
        sprint: "Sprint 1",
        dueDate: "2026-08-25",
        progress: 100,
    },
];

// ============================================================
// OPTIONS
// ============================================================

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
    "Critical",
    "High",
    "Medium",
    "Low",
];

const SPRINT_OPTIONS = [
    "All",
    "Sprint 1",
    "Sprint 2",
];

// ============================================================
// STATUS STYLES
// ============================================================

function getStatusClasses(status) {
    switch (status) {
        case "Done":
            return "bg-green-50 text-green-700 border-green-200";

        case "In Progress":
            return "bg-blue-50 text-blue-700 border-blue-200";

        case "Review":
            return "bg-purple-50 text-purple-700 border-purple-200";

        case "Blocked":
            return "bg-red-50 text-red-700 border-red-200";

        case "Backlog":
            return "bg-slate-100 text-slate-700 border-slate-200";

        default:
            return "bg-slate-100 text-slate-700 border-slate-200";
    }
}

// ============================================================
// PRIORITY STYLES
// ============================================================

function getPriorityClasses(priority) {
    switch (priority) {
        case "Critical":
            return "bg-red-50 text-red-700 border-red-200";

        case "High":
            return "bg-orange-50 text-orange-700 border-orange-200";

        case "Medium":
            return "bg-yellow-50 text-yellow-700 border-yellow-200";

        case "Low":
            return "bg-green-50 text-green-700 border-green-200";

        default:
            return "bg-slate-100 text-slate-700 border-slate-200";
    }
}

// ============================================================
// PROGRESS COLOR
// ============================================================

function getProgressClasses(progress) {
    if (progress >= 100) {
        return "bg-green-500";
    }

    if (progress >= 70) {
        return "bg-blue-500";
    }

    if (progress >= 40) {
        return "bg-yellow-500";
    }

    return "bg-slate-400";
}

// ============================================================
// COMPONENT
// ============================================================

export default function ViewProjectTasks({
    projectId,
    projectName = "My Project",
    tasks = DEMO_TASKS,
}) {
    const [taskList, setTaskList] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");

    const [statusFilter, setStatusFilter] = useState("All");

    const [priorityFilter, setPriorityFilter] = useState("All");

    const [sprintFilter, setSprintFilter] = useState("All");

    const [selectedTask, setSelectedTask] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    // ========================================================
    // LOAD PROJECT TASKS
    // ========================================================

    useEffect(() => {
        let mounted = true;

        const loadTasks = async () => {
            try {
                setLoading(true);
                setError("");

                // ------------------------------------------------
                // BACKEND INTEGRATION PLACE
                // ------------------------------------------------
                //
                // Later replace this with:
                //
                // const response =
                //     await projectService.getProjectTasks(projectId);
                //
                // setTaskList(response.data);
                //
                // ------------------------------------------------

                await new Promise((resolve) =>
                    setTimeout(resolve, 300)
                );

                if (mounted) {
                    setTaskList(
                        Array.isArray(tasks)
                            ? tasks
                            : []
                    );
                }
            } catch (err) {
                console.error(
                    "Unable to load project tasks:",
                    err
                );

                if (mounted) {
                    setError(
                        "Unable to load project tasks. Please try again."
                    );
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        loadTasks();

        return () => {
            mounted = false;
        };
    }, [projectId, tasks]);

    // ========================================================
    // FILTER TASKS
    // ========================================================

    const filteredTasks = useMemo(() => {
        const search = searchTerm
            .trim()
            .toLowerCase();

        return taskList.filter((task) => {
            const matchesSearch =
                !search ||
                task.title
                    ?.toLowerCase()
                    .includes(search) ||
                task.description
                    ?.toLowerCase()
                    .includes(search) ||
                task.assignee
                    ?.toLowerCase()
                    .includes(search) ||
                task.sprint
                    ?.toLowerCase()
                    .includes(search);

            const matchesStatus =
                statusFilter === "All" ||
                task.status === statusFilter;

            const matchesPriority =
                priorityFilter === "All" ||
                task.priority === priorityFilter;

            const matchesSprint =
                sprintFilter === "All" ||
                task.sprint === sprintFilter;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesPriority &&
                matchesSprint
            );
        });
    }, [
        taskList,
        searchTerm,
        statusFilter,
        priorityFilter,
        sprintFilter,
    ]);

    // ========================================================
    // RESET FILTERS
    // ========================================================

    const handleResetFilters = () => {
        setSearchTerm("");
        setStatusFilter("All");
        setPriorityFilter("All");
        setSprintFilter("All");
    };

    // ========================================================
    // VIEW TASK
    // ========================================================

    const handleViewTask = (task) => {
        setSelectedTask(task);
    };

    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {
        return (
            <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-slate-200 bg-white">
                <div className="flex items-center gap-3 text-slate-600">
                    <Loader2 className="h-5 w-5 animate-spin" />

                    <span>
                        Loading project tasks...
                    </span>
                </div>
            </div>
        );
    }

    // ========================================================
    // ERROR
    // ========================================================

    if (error) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 text-red-600" />

                    <div>
                        <h3 className="font-semibold text-red-800">
                            Unable to load project tasks
                        </h3>

                        <p className="mt-1 text-sm text-red-700">
                            {error}
                        </p>
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

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                    <div className="flex items-start gap-4">

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                            <ListTodo className="h-6 w-6 text-blue-600" />
                        </div>

                        <div>
                            <h1 className="text-xl font-bold text-slate-900">
                                Project Tasks
                            </h1>

                            <p className="mt-1 text-sm text-slate-500">
                                {projectName}
                            </p>
                        </div>

                    </div>

                    <div className="rounded-lg bg-slate-50 px-4 py-2">

                        <span className="text-sm text-slate-500">
                            Tasks
                        </span>

                        <span className="ml-2 font-semibold text-slate-900">
                            {taskList.length}
                        </span>

                    </div>

                </div>
            </div>

            {/* =================================================
                FILTER SECTION
            ================================================= */}

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                <div className="mb-4 flex items-center justify-between">

                    <div className="flex items-center gap-2">
                        <Filter className="h-5 w-5 text-slate-500" />

                        <h2 className="font-semibold text-slate-900">
                            Filter Tasks
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={handleResetFilters}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                        Reset
                    </button>

                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

                    {/* SEARCH */}

                    <div className="relative">

                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(event) =>
                                setSearchTerm(
                                    event.target.value
                                )
                            }
                            placeholder="Search tasks..."
                            className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                    </div>

                    {/* STATUS */}

                    <select
                        value={statusFilter}
                        onChange={(event) =>
                            setStatusFilter(
                                event.target.value
                            )
                        }
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                        {STATUS_OPTIONS.map((status) => (
                            <option
                                key={status}
                                value={status}
                            >
                                Status: {status}
                            </option>
                        ))}
                    </select>

                    {/* PRIORITY */}

                    <select
                        value={priorityFilter}
                        onChange={(event) =>
                            setPriorityFilter(
                                event.target.value
                            )
                        }
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                        {PRIORITY_OPTIONS.map(
                            (priority) => (
                                <option
                                    key={priority}
                                    value={priority}
                                >
                                    Priority: {priority}
                                </option>
                            )
                        )}
                    </select>

                    {/* SPRINT */}

                    <select
                        value={sprintFilter}
                        onChange={(event) =>
                            setSprintFilter(
                                event.target.value
                            )
                        }
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                        {SPRINT_OPTIONS.map(
                            (sprint) => (
                                <option
                                    key={sprint}
                                    value={sprint}
                                >
                                    Sprint: {sprint}
                                </option>
                            )
                        )}
                    </select>

                </div>
            </div>

            {/* =================================================
                NO TASKS
            ================================================= */}

            {taskList.length === 0 && (
                <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">

                    <ListTodo className="mx-auto h-10 w-10 text-slate-400" />

                    <h3 className="mt-4 font-semibold text-slate-800">
                        No project tasks available
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                        There are currently no authorized tasks
                        available for this project.
                    </p>

                </div>
            )}

            {/* =================================================
                NO FILTER RESULTS
            ================================================= */}

            {taskList.length > 0 &&
                filteredTasks.length === 0 && (
                    <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">

                        <Search className="mx-auto h-10 w-10 text-slate-400" />

                        <h3 className="mt-4 font-semibold text-slate-800">
                            No matching tasks
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                            Try changing your search or filters.
                        </p>

                    </div>
                )}

            {/* =================================================
                TASK TABLE
            ================================================= */}

            {filteredTasks.length > 0 && (
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[1100px]">

                            <thead className="bg-slate-50">

                                <tr className="border-b border-slate-200">

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Task
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Assignee
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Priority
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Status
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Sprint
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Due Date
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Progress
                                    </th>

                                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Action
                                    </th>

                                </tr>

                            </thead>

                            <tbody className="divide-y divide-slate-100">

                                {filteredTasks.map(
                                    (task) => (
                                        <tr
                                            key={task.id}
                                            className="transition hover:bg-slate-50"
                                        >

                                            {/* TASK */}

                                            <td className="px-6 py-4">

                                                <div className="flex items-start gap-3">

                                                    <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                                                        <FolderKanban className="h-4 w-4 text-blue-600" />
                                                    </div>

                                                    <div>
                                                        <p className="font-medium text-slate-900">
                                                            {task.title}
                                                        </p>

                                                        <p className="mt-1 max-w-[260px] truncate text-xs text-slate-500">
                                                            {
                                                                task.description
                                                            }
                                                        </p>
                                                    </div>

                                                </div>

                                            </td>

                                            {/* ASSIGNEE */}

                                            <td className="px-6 py-4">

                                                <div className="flex items-center gap-2">

                                                    <UserRound className="h-4 w-4 text-slate-400" />

                                                    <div>
                                                        <p className="text-sm font-medium text-slate-700">
                                                            {
                                                                task.assignee
                                                            }
                                                        </p>

                                                        <p className="text-xs text-slate-500">
                                                            {
                                                                task.assigneeType
                                                            }
                                                        </p>
                                                    </div>

                                                </div>

                                            </td>

                                            {/* PRIORITY */}

                                            <td className="px-6 py-4">

                                                <span
                                                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getPriorityClasses(
                                                        task.priority
                                                    )}`}
                                                >
                                                    {
                                                        task.priority
                                                    }
                                                </span>

                                            </td>

                                            {/* STATUS */}

                                            <td className="px-6 py-4">

                                                <span
                                                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getStatusClasses(
                                                        task.status
                                                    )}`}
                                                >
                                                    {
                                                        task.status
                                                    }
                                                </span>

                                            </td>

                                            {/* SPRINT */}

                                            <td className="px-6 py-4">

                                                <span className="text-sm text-slate-700">
                                                    {
                                                        task.sprint
                                                    }
                                                </span>

                                            </td>

                                            {/* DUE DATE */}

                                            <td className="px-6 py-4">

                                                <div className="flex items-center gap-2 text-sm text-slate-600">

                                                    <CalendarDays className="h-4 w-4 text-slate-400" />

                                                    {
                                                        task.dueDate
                                                    }

                                                </div>

                                            </td>

                                            {/* PROGRESS */}

                                            <td className="px-6 py-4">

                                                <div className="w-28">

                                                    <div className="mb-1 flex items-center justify-between">

                                                        <span className="text-xs text-slate-500">
                                                            Progress
                                                        </span>

                                                        <span className="text-xs font-medium text-slate-700">
                                                            {
                                                                task.progress
                                                            }
                                                            %
                                                        </span>

                                                    </div>

                                                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                                                        <div
                                                            className={`h-full rounded-full transition-all ${getProgressClasses(
                                                                task.progress
                                                            )}`}
                                                            style={{
                                                                width: `${Math.min(
                                                                    Math.max(
                                                                        task.progress,
                                                                        0
                                                                    ),
                                                                    100
                                                                )}%`,
                                                            }}
                                                        />

                                                    </div>

                                                </div>

                                            </td>

                                            {/* VIEW */}

                                            <td className="px-6 py-4 text-right">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleViewTask(
                                                            task
                                                        )
                                                    }
                                                    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                                >
                                                    <Eye className="h-4 w-4" />

                                                    View
                                                </button>

                                            </td>

                                        </tr>
                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                </div>
            )}

            {/* =================================================
                TASK DETAILS MODAL
            ================================================= */}

            {selectedTask && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">

                        {/* MODAL HEADER */}

                        <div className="sticky top-0 flex items-start justify-between border-b border-slate-200 bg-white p-6">

                            <div className="flex items-start gap-3">

                                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50">
                                    <ListTodo className="h-5 w-5 text-blue-600" />
                                </div>

                                <div>

                                    <h2 className="text-lg font-bold text-slate-900">
                                        {
                                            selectedTask.title
                                        }
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Project task details
                                    </p>

                                </div>

                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedTask(null)
                                }
                                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                                aria-label="Close"
                            >
                                <X className="h-5 w-5" />
                            </button>

                        </div>

                        {/* MODAL BODY */}

                        <div className="space-y-6 p-6">

                            {/* DESCRIPTION */}

                            <div>

                                <h3 className="mb-2 text-sm font-semibold text-slate-900">
                                    Description
                                </h3>

                                <p className="text-sm leading-6 text-slate-600">
                                    {
                                        selectedTask.description
                                    }
                                </p>

                            </div>

                            {/* DETAILS */}

                            <div className="grid gap-4 sm:grid-cols-2">

                                <div className="rounded-lg bg-slate-50 p-4">

                                    <div className="flex items-center gap-2">

                                        <UserRound className="h-4 w-4 text-slate-500" />

                                        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                            Assignee
                                        </span>

                                    </div>

                                    <p className="mt-2 text-sm font-medium text-slate-900">
                                        {
                                            selectedTask.assignee
                                        }
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        {
                                            selectedTask.assigneeType
                                        }
                                    </p>

                                </div>

                                <div className="rounded-lg bg-slate-50 p-4">

                                    <div className="flex items-center gap-2">

                                        <Zap className="h-4 w-4 text-slate-500" />

                                        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                            Priority
                                        </span>

                                    </div>

                                    <span
                                        className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getPriorityClasses(
                                            selectedTask.priority
                                        )}`}
                                    >
                                        {
                                            selectedTask.priority
                                        }
                                    </span>

                                </div>

                                <div className="rounded-lg bg-slate-50 p-4">

                                    <div className="flex items-center gap-2">

                                        <Clock3 className="h-4 w-4 text-slate-500" />

                                        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                            Status
                                        </span>

                                    </div>

                                    <span
                                        className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getStatusClasses(
                                            selectedTask.status
                                        )}`}
                                    >
                                        {
                                            selectedTask.status
                                        }
                                    </span>

                                </div>

                                <div className="rounded-lg bg-slate-50 p-4">

                                    <div className="flex items-center gap-2">

                                        <FolderKanban className="h-4 w-4 text-slate-500" />

                                        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                            Sprint
                                        </span>

                                    </div>

                                    <p className="mt-2 text-sm font-medium text-slate-900">
                                        {
                                            selectedTask.sprint
                                        }
                                    </p>

                                </div>

                                <div className="rounded-lg bg-slate-50 p-4">

                                    <div className="flex items-center gap-2">

                                        <CalendarDays className="h-4 w-4 text-slate-500" />

                                        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                            Due Date
                                        </span>

                                    </div>

                                    <p className="mt-2 text-sm font-medium text-slate-900">
                                        {
                                            selectedTask.dueDate
                                        }
                                    </p>

                                </div>

                                <div className="rounded-lg bg-slate-50 p-4">

                                    <div className="flex items-center gap-2">

                                        <CheckCircle2 className="h-4 w-4 text-slate-500" />

                                        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                            Progress
                                        </span>

                                    </div>

                                    <p className="mt-2 text-sm font-medium text-slate-900">
                                        {
                                            selectedTask.progress
                                        }
                                        %
                                    </p>

                                </div>

                            </div>

                            {/* PROGRESS */}

                            <div>

                                <div className="mb-2 flex items-center justify-between">

                                    <h3 className="text-sm font-semibold text-slate-900">
                                        Task Progress
                                    </h3>

                                    <span className="text-sm font-medium text-slate-700">
                                        {
                                            selectedTask.progress
                                        }
                                        %
                                    </span>

                                </div>

                                <div className="h-3 overflow-hidden rounded-full bg-slate-100">

                                    <div
                                        className={`h-full rounded-full ${getProgressClasses(
                                            selectedTask.progress
                                        )}`}
                                        style={{
                                            width: `${Math.min(
                                                Math.max(
                                                    selectedTask.progress,
                                                    0
                                                ),
                                                100
                                            )}%`,
                                        }}
                                    />

                                </div>

                            </div>

                            {/* PERMISSION NOTICE */}

                            <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">

                                <p className="text-sm leading-6 text-blue-800">
                                    You are viewing this task as a
                                    project Contributor. Task
                                    management actions such as
                                    creating, deleting, or
                                    reassigning tasks are not
                                    available here.
                                </p>

                            </div>

                        </div>

                        {/* MODAL FOOTER */}

                        <div className="flex justify-end border-t border-slate-200 p-5">

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedTask(null)
                                }
                                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
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
