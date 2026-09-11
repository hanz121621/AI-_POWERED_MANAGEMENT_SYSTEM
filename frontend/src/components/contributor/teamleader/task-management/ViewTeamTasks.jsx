
import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import api from "@/services/api";

const getTaskId = (task) => {
    if (!task) return null;

    return (
        task.id ??
        task.taskId ??
        task.Id ??
        task.TaskId ??
        null
    );
};

const getTaskTitle = (task) => {
    return (
        task?.title ??
        task?.taskTitle ??
        task?.name ??
        task?.Title ??
        "Untitled Task"
    );
};

const getTaskDescription = (task) => {
    return (
        task?.description ??
        task?.taskDescription ??
        task?.Description ??
        ""
    );
};

const getTaskProject = (task) => {
    if (!task) return "No Project";

    if (typeof task.project === "string") {
        return task.project;
    }

    if (task.project?.name) {
        return task.project.name;
    }

    if (task.project?.title) {
        return task.project.title;
    }

    return (
        task.projectName ??
        task.projectTitle ??
        "No Project"
    );
};

const getTaskSprint = (task) => {
    if (!task) return "No Sprint";

    if (typeof task.sprint === "string") {
        return task.sprint;
    }

    if (task.sprint?.name) {
        return task.sprint.name;
    }

    if (task.sprint?.title) {
        return task.sprint.title;
    }

    return (
        task.sprintName ??
        task.sprintTitle ??
        "No Sprint"
    );
};

const getTaskPriority = (task) => {
    return (
        task?.priority ??
        task?.priorityName ??
        task?.Priority ??
        "Medium"
    );
};

const getTaskStatus = (task) => {
    return (
        task?.status ??
        task?.taskStatus ??
        task?.Status ??
        "Not Started"
    );
};

const getTaskAssignee = (task) => {
    if (!task) return "Unassigned";

    if (typeof task.assignedTo === "string") {
        return task.assignedTo;
    }

    if (task.assignedTo?.fullName) {
        return task.assignedTo.fullName;
    }

    if (task.assignee?.fullName) {
        return task.assignee.fullName;
    }

    if (task.assignedUser?.fullName) {
        return task.assignedUser.fullName;
    }

    return (
        task.assignedToName ??
        task.assigneeName ??
        task.assignedUserName ??
        "Unassigned"
    );
};

const getTaskAssigneeRole = (task) => {
    if (!task) return "";

    const assigned =
        task.assignedTo ??
        task.assignee ??
        task.assignedUser;

    if (
        assigned &&
        typeof assigned === "object"
    ) {
        return (
            assigned.role ??
            assigned.contributorType ??
            assigned.contributorTypeName ??
            ""
        );
    }

    return (
        task.assigneeRole ??
        task.assignedToRole ??
        task.contributorType ??
        ""
    );
};

const getTaskDeadline = (task) => {
    return (
        task?.deadline ??
        task?.dueDate ??
        task?.endDate ??
        task?.Deadline ??
        task?.DueDate ??
        null
    );
};

const getEstimatedEffort = (task) => {
    return (
        task?.estimatedEffort ??
        task?.effort ??
        task?.storyPoints ??
        task?.EstimatedEffort ??
        "—"
    );
};

const getTaskType = (task) => {
    return (
        task?.taskType ??
        task?.type ??
        task?.TaskType ??
        "Task"
    );
};

const isAiGenerated = (task) => {
    return Boolean(
        task?.isAiGenerated ??
        task?.aiGenerated ??
        task?.isAIgenerated ??
        task?.IsAiGenerated ??
        false
    );
};

const getProgress = (task) => {
    const value =
        task?.progress ??
        task?.progressPercentage ??
        task?.completionPercentage ??
        task?.Progress ??
        0;

    const number = Number(value);

    if (Number.isNaN(number)) {
        return 0;
    }

    return Math.max(
        0,
        Math.min(100, number)
    );
};

const formatDate = (value) => {
    if (!value) return "No deadline";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "No deadline";
    }

    return date.toLocaleDateString(
        undefined,
        {
            year: "numeric",
            month: "short",
            day: "numeric",
        }
    );
};

const isOverdue = (task) => {
    const deadline =
        getTaskDeadline(task);

    if (!deadline) return false;

    const status = String(
        getTaskStatus(task)
    ).toLowerCase();

    if (
        status.includes("completed") ||
        status.includes("done")
    ) {
        return false;
    }

    const deadlineDate =
        new Date(deadline);

    if (
        Number.isNaN(
            deadlineDate.getTime()
        )
    ) {
        return false;
    }

    return deadlineDate < new Date();
};

const normalizeTasks = (value) => {
    if (Array.isArray(value)) {
        return value;
    }

    if (Array.isArray(value?.items)) {
        return value.items;
    }

    if (Array.isArray(value?.data)) {
        return value.data;
    }

    if (Array.isArray(value?.tasks)) {
        return value.tasks;
    }

    if (Array.isArray(value?.data?.tasks)) {
        return value.data.tasks;
    }

    return [];
};

const getBackendError = (error) => {
    return (
        error?.response?.data?.message ??
        error?.response?.data?.error ??
        error?.response?.data?.title ??
        error?.message ??
        "Unable to load tasks."
    );
};

export default function ViewTeamTasks({
    tasks: initialTasks = [],
    loadTasks,
    onRefresh,
    onTaskSelect,
    onCreateTask,
    onUpdateTask,
    onDeleteTask,
    onAssignTask,
    onSetPriority,
    onSetDeadline,
    canViewTasks = true,
    initialProject = "all",
    initialSprint = "all",
    sprintId = "",
}) {
    const [tasks, setTasks] = useState(
        normalizeTasks(initialTasks)
    );

    const [searchTerm, setSearchTerm] =
        useState("");

    const [projectFilter, setProjectFilter] =
        useState(initialProject);

    const [sprintFilter, setSprintFilter] =
        useState(initialSprint);

    const [statusFilter, setStatusFilter] =
        useState("all");

    const [priorityFilter, setPriorityFilter] =
        useState("all");

    const [sortBy, setSortBy] =
        useState("deadline");

    const [sortDirection, setSortDirection] =
        useState("asc");

    const [selectedTask, setSelectedTask] =
        useState(null);

    const [showDetails, setShowDetails] =
        useState(false);

    const [isLoading, setIsLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    useEffect(() => {
        setTasks(
            normalizeTasks(
                initialTasks
            )
        );
    }, [initialTasks]);

    useEffect(() => {
        if (
            sprintId &&
            !loadTasks &&
            canViewTasks
        ) {
            loadTeamLeaderTasks();
        }
    }, [
        sprintId,
        loadTasks,
        canViewTasks,
    ]);

    const loadTeamLeaderTasks = async () => {
        if (!sprintId) {
            setTasks([]);
            return;
        }

        setIsLoading(true);
        setError("");
        setSuccess("");

        try {
            const response =
                await api.get(
                    `/tasks/team-leader/sprint/${sprintId}`
                );

            setTasks(
                normalizeTasks(
                    response.data
                )
            );
        } catch (err) {
            console.error(
                "Load Team Leader Tasks Error:",
                err
            );

            const status =
                err?.response?.status;

            if (status === 403) {
                setError(
                    "You are not authorized to view these team tasks."
                );
            } else if (status === 404) {
                setError(
                    "No tasks were found for this sprint."
                );
            } else {
                setError(
                    getBackendError(err)
                );
            }
        } finally {
            setIsLoading(false);
        }
    };

    const refreshTasks = async () => {
        setError("");
        setSuccess("");
        setIsLoading(true);

        try {
            let loaded = false;

            if (loadTasks) {
                const result =
                    await Promise.resolve(
                        loadTasks()
                    );

                if (result !== undefined) {
                    setTasks(
                        normalizeTasks(
                            result
                        )
                    );

                    loaded = true;
                }
            }

            if (
                onRefresh &&
                !loaded
            ) {
                const result =
                    await Promise.resolve(
                        onRefresh()
                    );

                if (result !== undefined) {
                    setTasks(
                        normalizeTasks(
                            result
                        )
                    );

                    loaded = true;
                }
            }

            if (
                !loaded &&
                sprintId
            ) {
                const response =
                    await api.get(
                        `/tasks/team-leader/sprint/${sprintId}`
                    );

                setTasks(
                    normalizeTasks(
                        response.data
                    )
                );
            }

            setSuccess(
                "Tasks refreshed successfully."
            );

            setTimeout(() => {
                setSuccess("");
            }, 2000);
        } catch (err) {
            console.error(
                "View Team Tasks Error:",
                err
            );

            const status =
                err?.response?.status;

            if (status === 403) {
                setError(
                    "You are not authorized to view these team tasks."
                );
            } else {
                setError(
                    getBackendError(err)
                );
            }
        } finally {
            setIsLoading(false);
        }
    };

    const projectOptions = useMemo(() => {
        const values = tasks
            .map((task) =>
                getTaskProject(task)
            )
            .filter(
                (value) =>
                    value &&
                    value !== "No Project"
            );

        return [
            ...new Set(values),
        ].sort();
    }, [tasks]);

    const sprintOptions = useMemo(() => {
        const values = tasks
            .map((task) =>
                getTaskSprint(task)
            )
            .filter(
                (value) =>
                    value &&
                    value !== "No Sprint"
            );

        return [
            ...new Set(values),
        ].sort();
    }, [tasks]);

    const statusOptions = useMemo(() => {
        const values = tasks
            .map((task) =>
                getTaskStatus(task)
            )
            .filter(Boolean);

        return [
            ...new Set(values),
        ].sort();
    }, [tasks]);

    const filteredTasks = useMemo(() => {
        const search =
            searchTerm
                .trim()
                .toLowerCase();

        const result = tasks.filter(
            (task) => {
                const title =
                    getTaskTitle(
                        task
                    ).toLowerCase();

                const description =
                    getTaskDescription(
                        task
                    ).toLowerCase();

                const project =
                    getTaskProject(
                        task
                    ).toLowerCase();

                const sprint =
                    getTaskSprint(
                        task
                    ).toLowerCase();

                const assignee =
                    getTaskAssignee(
                        task
                    ).toLowerCase();

                const priority =
                    String(
                        getTaskPriority(
                            task
                        )
                    ).toLowerCase();

                const status =
                    String(
                        getTaskStatus(
                            task
                        )
                    ).toLowerCase();

                const matchesSearch =
                    !search ||
                    title.includes(search) ||
                    description.includes(search) ||
                    project.includes(search) ||
                    sprint.includes(search) ||
                    assignee.includes(search);

                const matchesProject =
                    projectFilter === "all" ||
                    getTaskProject(task) ===
                        projectFilter;

                const matchesSprint =
                    sprintFilter === "all" ||
                    getTaskSprint(task) ===
                        sprintFilter;

                const matchesStatus =
                    statusFilter === "all" ||
                    status ===
                        statusFilter.toLowerCase();

                const matchesPriority =
                    priorityFilter === "all" ||
                    priority ===
                        priorityFilter.toLowerCase();

                return (
                    matchesSearch &&
                    matchesProject &&
                    matchesSprint &&
                    matchesStatus &&
                    matchesPriority
                );
            }
        );

        return result.sort(
            (a, b) => {
                let valueA;
                let valueB;

                switch (sortBy) {
                    case "title":
                        valueA =
                            getTaskTitle(
                                a
                            ).toLowerCase();

                        valueB =
                            getTaskTitle(
                                b
                            ).toLowerCase();

                        break;

                    case "priority": {
                        const order = {
                            critical: 4,
                            high: 3,
                            medium: 2,
                            low: 1,
                        };

                        valueA =
                            order[
                                String(
                                    getTaskPriority(
                                        a
                                    )
                                ).toLowerCase()
                            ] ?? 0;

                        valueB =
                            order[
                                String(
                                    getTaskPriority(
                                        b
                                    )
                                ).toLowerCase()
                            ] ?? 0;

                        break;
                    }

                    case "progress":
                        valueA =
                            getProgress(a);

                        valueB =
                            getProgress(b);

                        break;

                    case "deadline": {
                        const dateA =
                            getTaskDeadline(a);

                        const dateB =
                            getTaskDeadline(b);

                        valueA = dateA
                            ? new Date(
                                dateA
                            ).getTime()
                            : Number.MAX_SAFE_INTEGER;

                        valueB = dateB
                            ? new Date(
                                dateB
                            ).getTime()
                            : Number.MAX_SAFE_INTEGER;

                        break;
                    }

                    default:
                        valueA = 0;
                        valueB = 0;
                }

                if (valueA < valueB) {
                    return sortDirection ===
                        "asc"
                        ? -1
                        : 1;
                }

                if (valueA > valueB) {
                    return sortDirection ===
                        "asc"
                        ? 1
                        : -1;
                }

                return 0;
            }
        );
    }, [
        tasks,
        searchTerm,
        projectFilter,
        sprintFilter,
        statusFilter,
        priorityFilter,
        sortBy,
        sortDirection,
    ]);

    const statistics = useMemo(() => {
        const total =
            tasks.length;

        const completed =
            tasks.filter(
                (task) => {
                    const status =
                        String(
                            getTaskStatus(
                                task
                            )
                        ).toLowerCase();

                    return (
                        status.includes(
                            "completed"
                        ) ||
                        status.includes(
                            "done"
                        )
                    );
                }
            ).length;

        const inProgress =
            tasks.filter(
                (task) =>
                    String(
                        getTaskStatus(
                            task
                        )
                    )
                        .toLowerCase()
                        .includes(
                            "progress"
                        )
            ).length;

        const overdue =
            tasks.filter(
                (task) =>
                    isOverdue(task)
            ).length;

        const unassigned =
            tasks.filter(
                (task) =>
                    getTaskAssignee(
                        task
                    ) ===
                    "Unassigned"
            ).length;

        const aiGenerated =
            tasks.filter(
                (task) =>
                    isAiGenerated(task)
            ).length;

        return {
            total,
            completed,
            inProgress,
            overdue,
            unassigned,
            aiGenerated,
        };
    }, [tasks]);

    const handleViewTask = (task) => {
        setSelectedTask(task);
        setShowDetails(true);

        if (onTaskSelect) {
            onTaskSelect(task);
        }
    };

    const clearFilters = () => {
        setSearchTerm("");
        setProjectFilter("all");
        setSprintFilter("all");
        setStatusFilter("all");
        setPriorityFilter("all");
    };

    const PriorityBadge = ({
        priority,
    }) => {
        const value =
            String(
                priority
            ).toLowerCase();

        let classes =
            "bg-gray-100 text-gray-700";

        if (value === "critical") {
            classes =
                "bg-red-100 text-red-700";
        } else if (value === "high") {
            classes =
                "bg-orange-100 text-orange-700";
        } else if (value === "medium") {
            classes =
                "bg-yellow-100 text-yellow-700";
        } else if (value === "low") {
            classes =
                "bg-green-100 text-green-700";
        }

        return (
            <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${classes}`}
            >
                {priority}
            </span>
        );
    };

    const StatusBadge = ({
        status,
    }) => {
        const value =
            String(
                status
            ).toLowerCase();

        let classes =
            "bg-gray-100 text-gray-700";

        if (
            value.includes("completed") ||
            value.includes("done")
        ) {
            classes =
                "bg-green-100 text-green-700";
        } else if (
            value.includes("progress") ||
            value.includes("active")
        ) {
            classes =
                "bg-blue-100 text-blue-700";
        } else if (
            value.includes("blocked")
        ) {
            classes =
                "bg-red-100 text-red-700";
        } else if (
            value.includes("review")
        ) {
            classes =
                "bg-purple-100 text-purple-700";
        }

        return (
            <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${classes}`}
            >
                {status}
            </span>
        );
    };

    if (!canViewTasks) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                <div className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                        !
                    </div>

                    <div>
                        <h2 className="font-semibold text-red-800">
                            Access Denied
                        </h2>

                        <p className="mt-1 text-sm text-red-700">
                            You are not authorized to
                            view these team tasks.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        Team Tasks
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                        View and monitor tasks assigned to
                        your team across projects and
                        sprints.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={refreshTasks}
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-4 w-4 ${
                                isLoading
                                    ? "animate-spin"
                                    : ""
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 4v5h5M20 20v-5h-5M5.64 18.36A9 9 0 1018.36 5.64"
                            />
                        </svg>

                        {isLoading
                            ? "Refreshing..."
                            : "Refresh"}
                    </button>

                    {onCreateTask && (
                        <button
                            type="button"
                            onClick={onCreateTask}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>

                            Create Task
                        </button>
                    )}
                </div>
            </div>

            {success && (
                <div
                    role="status"
                    className="rounded-lg border border-green-200 bg-green-50 p-4"
                >
                    <p className="text-sm font-medium text-green-700">
                        {success}
                    </p>
                </div>
            )}

            {error && (
                <div
                    role="alert"
                    className="rounded-lg border border-red-200 bg-red-50 p-4"
                >
                    <div className="flex items-center justify-between gap-4">
                        <p className="text-sm text-red-700">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                setError("")
                            }
                            className="text-sm font-medium text-red-700 hover:text-red-900"
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Total
                    </p>

                    <p className="mt-2 text-2xl font-bold text-gray-900">
                        {statistics.total}
                    </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Completed
                    </p>

                    <p className="mt-2 text-2xl font-bold text-green-600">
                        {statistics.completed}
                    </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        In Progress
                    </p>

                    <p className="mt-2 text-2xl font-bold text-blue-600">
                        {statistics.inProgress}
                    </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Overdue
                    </p>

                    <p className="mt-2 text-2xl font-bold text-red-600">
                        {statistics.overdue}
                    </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Unassigned
                    </p>

                    <p className="mt-2 text-2xl font-bold text-amber-600">
                        {statistics.unassigned}
                    </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        AI Generated
                    </p>

                    <p className="mt-2 text-2xl font-bold text-purple-600">
                        {statistics.aiGenerated}
                    </p>
                </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
                    <div className="lg:col-span-2">
                        <label
                            htmlFor="team-task-search"
                            className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-500"
                        >
                            Search
                        </label>

                        <div className="relative">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>

                            <input
                                id="team-task-search"
                                type="text"
                                value={searchTerm}
                                onChange={(event) =>
                                    setSearchTerm(
                                        event.target.value
                                    )
                                }
                                placeholder="Search tasks, projects, sprints..."
                                className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="task-project-filter"
                            className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-500"
                        >
                            Project
                        </label>

                        <select
                            id="task-project-filter"
                            value={projectFilter}
                            onChange={(event) =>
                                setProjectFilter(
                                    event.target.value
                                )
                            }
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="all">
                                All Projects
                            </option>

                            {projectOptions.map(
                                (project) => (
                                    <option
                                        key={project}
                                        value={project}
                                    >
                                        {project}
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="task-sprint-filter"
                            className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-500"
                        >
                            Sprint
                        </label>

                        <select
                            id="task-sprint-filter"
                            value={sprintFilter}
                            onChange={(event) =>
                                setSprintFilter(
                                    event.target.value
                                )
                            }
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="all">
                                All Sprints
                            </option>

                            {sprintOptions.map(
                                (sprint) => (
                                    <option
                                        key={sprint}
                                        value={sprint}
                                    >
                                        {sprint}
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="task-status-filter"
                            className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-500"
                        >
                            Status
                        </label>

                        <select
                            id="task-status-filter"
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(
                                    event.target.value
                                )
                            }
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="all">
                                All Statuses
                            </option>

                            {statusOptions.map(
                                (status) => (
                                    <option
                                        key={status}
                                        value={status}
                                    >
                                        {status}
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="task-priority-filter"
                            className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-500"
                        >
                            Priority
                        </label>

                        <select
                            id="task-priority-filter"
                            value={priorityFilter}
                            onChange={(event) =>
                                setPriorityFilter(
                                    event.target.value
                                )
                            }
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="all">
                                All Priorities
                            </option>

                            <option value="Critical">
                                Critical
                            </option>

                            <option value="High">
                                High
                            </option>

                            <option value="Medium">
                                Medium
                            </option>

                            <option value="Low">
                                Low
                            </option>
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="task-sort"
                            className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-500"
                        >
                            Sort By
                        </label>

                        <select
                            id="task-sort"
                            value={sortBy}
                            onChange={(event) =>
                                setSortBy(
                                    event.target.value
                                )
                            }
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="deadline">
                                Deadline
                            </option>

                            <option value="title">
                                Title
                            </option>

                            <option value="priority">
                                Priority
                            </option>

                            <option value="progress">
                                Progress
                            </option>
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="task-sort-direction"
                            className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-500"
                        >
                            Order
                        </label>

                        <select
                            id="task-sort-direction"
                            value={sortDirection}
                            onChange={(event) =>
                                setSortDirection(
                                    event.target.value
                                )
                            }
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="asc">
                                Ascending
                            </option>

                            <option value="desc">
                                Descending
                            </option>
                        </select>
                    </div>

                    <div className="flex items-end">
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-gray-600">
                    Showing{" "}
                    <strong className="text-gray-900">
                        {filteredTasks.length}
                    </strong>{" "}
                    of{" "}
                    <strong className="text-gray-900">
                        {tasks.length}
                    </strong>{" "}
                    tasks
                </p>
            </div>

            {isLoading ? (
                <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
                    <svg
                        className="mx-auto h-8 w-8 animate-spin text-blue-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />

                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                    </svg>

                    <p className="mt-3 text-sm text-gray-600">
                        Loading team tasks...
                    </p>
                </div>
            ) : filteredTasks.length === 0 ? (
                <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-7 w-7"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"
                            />

                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 5a3 3 0 016 0v1H9V5z"
                            />
                        </svg>
                    </div>

                    <h3 className="mt-4 text-lg font-semibold text-gray-900">
                        No tasks found
                    </h3>

                    <p className="mx-auto mt-1 max-w-md text-sm text-gray-600">
                        No team tasks match the current
                        filters. Try changing your search
                        or filters.
                    </p>

                    <button
                        type="button"
                        onClick={clearFilters}
                        className="mt-5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Clear Filters
                    </button>
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="hidden overflow-x-auto lg:block">
                        <table className="w-full">
                            <thead className="border-b border-gray-200 bg-gray-50">
                                <tr>
                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Task
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Project / Sprint
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Priority
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Status
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Assigned To
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Deadline
                                    </th>

                                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {filteredTasks.map(
                                    (task, index) => {
                                        const taskId =
                                            getTaskId(task);

                                        const overdue =
                                            isOverdue(task);

                                        return (
                                            <tr
                                                key={
                                                    taskId ??
                                                    `task-${index}`
                                                }
                                                className="transition hover:bg-gray-50"
                                            >
                                                <td className="px-5 py-4">
                                                    <div className="max-w-xs">
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleViewTask(
                                                                        task
                                                                    )
                                                                }
                                                                className="text-left text-sm font-semibold text-gray-900 hover:text-blue-600"
                                                            >
                                                                {getTaskTitle(
                                                                    task
                                                                )}
                                                            </button>

                                                            {isAiGenerated(
                                                                task
                                                            ) && (
                                                                <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-semibold text-purple-700">
                                                                    AI
                                                                </span>
                                                            )}
                                                        </div>

                                                        <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                                                            {getTaskDescription(
                                                                task
                                                            ) ||
                                                                "No description"}
                                                        </p>
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {getTaskProject(
                                                                task
                                                            )}
                                                        </p>

                                                        <p className="mt-1 text-xs text-gray-500">
                                                            {getTaskSprint(
                                                                task
                                                            )}
                                                        </p>
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <PriorityBadge
                                                        priority={getTaskPriority(
                                                            task
                                                        )}
                                                    />
                                                </td>

                                                <td className="px-5 py-4">
                                                    <StatusBadge
                                                        status={getTaskStatus(
                                                            task
                                                        )}
                                                    />
                                                </td>

                                                <td className="px-5 py-4">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {getTaskAssignee(
                                                                task
                                                            )}
                                                        </p>

                                                        {getTaskAssigneeRole(
                                                            task
                                                        ) && (
                                                            <p className="mt-1 text-xs text-gray-500">
                                                                {getTaskAssigneeRole(
                                                                    task
                                                                )}
                                                            </p>
                                                        )}
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <p
                                                        className={`text-sm font-medium ${
                                                            overdue
                                                                ? "text-red-600"
                                                                : "text-gray-900"
                                                        }`}
                                                    >
                                                        {formatDate(
                                                            getTaskDeadline(
                                                                task
                                                            )
                                                        )}
                                                    </p>

                                                    {overdue && (
                                                        <p className="mt-1 text-xs font-medium text-red-500">
                                                            Overdue
                                                        </p>
                                                    )}
                                                </td>

                                                <td className="px-5 py-4 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleViewTask(
                                                                task
                                                            )
                                                        }
                                                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                                                    >
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    }
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="divide-y divide-gray-200 lg:hidden">
                        {filteredTasks.map(
                            (task, index) => {
                                const taskId =
                                    getTaskId(task);

                                const overdue =
                                    isOverdue(task);

                                const progress =
                                    getProgress(task);

                                return (
                                    <div
                                        key={
                                            taskId ??
                                            `mobile-task-${index}`
                                        }
                                        className="p-5"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleViewTask(
                                                                task
                                                            )
                                                        }
                                                        className="text-left text-sm font-semibold text-gray-900 hover:text-blue-600"
                                                    >
                                                        {getTaskTitle(
                                                            task
                                                        )}
                                                    </button>

                                                    {isAiGenerated(
                                                        task
                                                    ) && (
                                                        <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-semibold text-purple-700">
                                                            AI
                                                        </span>
                                                    )}
                                                </div>

                                                <p className="mt-1 text-xs text-gray-500">
                                                    {getTaskProject(
                                                        task
                                                    )}{" "}
                                                    /{" "}
                                                    {getTaskSprint(
                                                        task
                                                    )}
                                                </p>
                                            </div>

                                            <StatusBadge
                                                status={getTaskStatus(
                                                    task
                                                )}
                                            />
                                        </div>

                                        <p className="mt-3 text-sm text-gray-600">
                                            {getTaskDescription(
                                                task
                                            ) ||
                                                "No description available."}
                                        </p>

                                        <div className="mt-4 grid grid-cols-2 gap-3">
                                            <div>
                                                <p className="text-xs text-gray-500">
                                                    Priority
                                                </p>

                                                <div className="mt-1">
                                                    <PriorityBadge
                                                        priority={getTaskPriority(
                                                            task
                                                        )}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <p className="text-xs text-gray-500">
                                                    Assigned To
                                                </p>

                                                <p className="mt-1 text-sm font-medium text-gray-900">
                                                    {getTaskAssignee(
                                                        task
                                                    )}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-gray-500">
                                                    Deadline
                                                </p>

                                                <p
                                                    className={`mt-1 text-sm font-medium ${
                                                        overdue
                                                            ? "text-red-600"
                                                            : "text-gray-900"
                                                    }`}
                                                >
                                                    {formatDate(
                                                        getTaskDeadline(
                                                            task
                                                        )
                                                    )}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-gray-500">
                                                    Effort
                                                </p>

                                                <p className="mt-1 text-sm font-medium text-gray-900">
                                                    {getEstimatedEffort(
                                                        task
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-gray-500">
                                                    Progress
                                                </span>

                                                <span className="font-semibold text-gray-700">
                                                    {progress}%
                                                </span>
                                            </div>

                                            <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
                                                <div
                                                    className="h-full rounded-full bg-blue-600 transition-all"
                                                    style={{
                                                        width: `${progress}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleViewTask(
                                                    task
                                                )
                                            }
                                            className="mt-4 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                        >
                                            View Task Details
                                        </button>
                                    </div>
                                );
                            }
                        )}
                    </div>
                </div>
            )}

            {showDetails &&
                selectedTask && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                        <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-2xl">
                            <div className="flex items-start justify-between border-b border-gray-200 px-6 py-5">
                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h2 className="text-xl font-bold text-gray-900">
                                            {getTaskTitle(
                                                selectedTask
                                            )}
                                        </h2>

                                        {isAiGenerated(
                                            selectedTask
                                        ) && (
                                            <span className="rounded-full bg-purple-100 px-2.5 py-1 text-xs font-semibold text-purple-700">
                                                AI Generated
                                            </span>
                                        )}
                                    </div>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Task ID:{" "}
                                        {getTaskId(
                                            selectedTask
                                        )}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowDetails(
                                            false
                                        );
                                        setSelectedTask(
                                            null
                                        );
                                    }}
                                    className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                                    aria-label="Close"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-6 p-6">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900">
                                        Description
                                    </h3>

                                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-600">
                                        {getTaskDescription(
                                            selectedTask
                                        ) ||
                                            "No description available."}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="rounded-lg border border-gray-200 p-4">
                                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                            Project
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-gray-900">
                                            {getTaskProject(
                                                selectedTask
                                            )}
                                        </p>
                                    </div>

                                    <div className="rounded-lg border border-gray-200 p-4">
                                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                            Sprint
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-gray-900">
                                            {getTaskSprint(
                                                selectedTask
                                            )}
                                        </p>
                                    </div>

                                    <div className="rounded-lg border border-gray-200 p-4">
                                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                            Priority
                                        </p>

                                        <div className="mt-2">
                                            <PriorityBadge
                                                priority={getTaskPriority(
                                                    selectedTask
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className="rounded-lg border border-gray-200 p-4">
                                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                            Status
                                        </p>

                                        <div className="mt-2">
                                            <StatusBadge
                                                status={getTaskStatus(
                                                    selectedTask
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className="rounded-lg border border-gray-200 p-4">
                                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                            Assigned To
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-gray-900">
                                            {getTaskAssignee(
                                                selectedTask
                                            )}
                                        </p>

                                        {getTaskAssigneeRole(
                                            selectedTask
                                        ) && (
                                            <p className="mt-1 text-xs text-gray-500">
                                                {getTaskAssigneeRole(
                                                    selectedTask
                                                )}
                                            </p>
                                        )}
                                    </div>

                                    <div className="rounded-lg border border-gray-200 p-4">
                                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                            Deadline
                                        </p>

                                        <p
                                            className={`mt-1 text-sm font-semibold ${
                                                isOverdue(
                                                    selectedTask
                                                )
                                                    ? "text-red-600"
                                                    : "text-gray-900"
                                            }`}
                                        >
                                            {formatDate(
                                                getTaskDeadline(
                                                    selectedTask
                                                )
                                            )}
                                        </p>

                                        {isOverdue(
                                            selectedTask
                                        ) && (
                                            <p className="mt-1 text-xs font-medium text-red-500">
                                                This task is overdue.
                                            </p>
                                        )}
                                    </div>

                                    <div className="rounded-lg border border-gray-200 p-4">
                                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                            Estimated Effort
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-gray-900">
                                            {getEstimatedEffort(
                                                selectedTask
                                            )}
                                        </p>
                                    </div>

                                    <div className="rounded-lg border border-gray-200 p-4">
                                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                            Task Type
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-gray-900">
                                            {getTaskType(
                                                selectedTask
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-semibold text-gray-900">
                                            Progress
                                        </h3>

                                        <span className="text-sm font-semibold text-gray-700">
                                            {getProgress(
                                                selectedTask
                                            )}
                                            %
                                        </span>
                                    </div>

                                    <div className="mt-2 h-3 overflow-hidden rounded-full bg-gray-200">
                                        <div
                                            className="h-full rounded-full bg-blue-600 transition-all"
                                            style={{
                                                width: `${getProgress(
                                                    selectedTask
                                                )}%`,
                                            }}
                                        />
                                    </div>
                                </div>

                                {isAiGenerated(
                                    selectedTask
                                ) && (
                                    <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
                                        <div className="flex gap-3">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-700">
                                                AI
                                            </div>

                                            <div>
                                                <p className="text-sm font-semibold text-purple-900">
                                                    AI-Generated
                                                    Task
                                                </p>

                                                <p className="mt-1 text-xs leading-5 text-purple-700">
                                                    This task was
                                                    generated or
                                                    assisted by the
                                                    AIPMS AI
                                                    automation
                                                    system. The
                                                    Team Leader
                                                    remains
                                                    responsible for
                                                    reviewing and
                                                    managing it.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-wrap justify-end gap-2 border-t border-gray-200 px-6 py-5">
                                {onUpdateTask && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            onUpdateTask(
                                                selectedTask
                                            )
                                        }
                                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Update
                                    </button>
                                )}

                                {onAssignTask && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            onAssignTask(
                                                selectedTask
                                            )
                                        }
                                        className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
                                    >
                                        Assign
                                    </button>
                                )}

                                {onSetPriority && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            onSetPriority(
                                                selectedTask
                                            )
                                        }
                                        className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 hover:bg-amber-100"
                                    >
                                        Priority
                                    </button>
                                )}

                                {onSetDeadline && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            onSetDeadline(
                                                selectedTask
                                            )
                                        }
                                        className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
                                    >
                                        Deadline
                                    </button>
                                )}

                                {onDeleteTask && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            onDeleteTask(
                                                selectedTask
                                            )
                                        }
                                        className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
                                    >
                                        Delete
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowDetails(
                                            false
                                        );
                                        setSelectedTask(
                                            null
                                        );
                                    }}
                                    className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
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