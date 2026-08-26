import { useMemo, useState } from "react";

import {
    AlertCircle,
    CalendarDays,
    CheckCircle2,
    ChevronDown,
    CircleDot,
    Clock3,
    Eye,
    Filter,
    FolderKanban,
    ListFilter,
    Loader2,
    RefreshCw,
    Search,
    ShieldCheck,
    ClipboardList,
    Users,
    X,
    Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/* ============================================================
   CONSTANTS
============================================================ */

const TASK_STATUS = {
    COMPLETED: "Completed",
    IN_PROGRESS: "In Progress",
    TODO: "To Do",
    BLOCKED: "Blocked",
    REVIEW: "Awaiting Review",
};

const PRIORITIES = {
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High",
    CRITICAL: "Critical",
};

/* ============================================================
   DEMO DATA
   ------------------------------------------------------------
   Frontend development data.

   Later replace this with:

   teamService.getMyTeamTasks()

   or your actual .NET endpoint.
============================================================ */

const DEMO_TASKS = [
    {
        id: 401,
        title: "Develop Project Dashboard",

        assignedContributor: {
            id: 201,
            fullName: "Abebe Kebede",
            email: "abebe@example.com",
            contributorType: "Developer",
            specialization: "Frontend Developer",
        },

        project: {
            id: 301,
            name: "AI-PMS",
        },

        sprint: {
            id: 501,
            name: "Sprint 3",
        },

        priority: PRIORITIES.HIGH,

        status: TASK_STATUS.IN_PROGRESS,

        dueDate: "2026-09-01",

        progress: 70,

        description:
            "Develop the project dashboard interface including statistics, project information and progress visualization.",

        createdAt: "2026-08-10",
    },

    {
        id: 402,
        title: "Implement Project Filters",

        assignedContributor: {
            id: 201,
            fullName: "Abebe Kebede",
            email: "abebe@example.com",
            contributorType: "Developer",
            specialization: "Frontend Developer",
        },

        project: {
            id: 301,
            name: "AI-PMS",
        },

        sprint: {
            id: 501,
            name: "Sprint 3",
        },

        priority: PRIORITIES.MEDIUM,

        status: TASK_STATUS.COMPLETED,

        dueDate: "2026-08-28",

        progress: 100,

        description:
            "Implement project filtering and sorting functionality.",

        createdAt: "2026-08-08",
    },

    {
        id: 403,
        title: "Implement Team API",

        assignedContributor: {
            id: 202,
            fullName: "Sara Mohammed",
            email: "sara@example.com",
            contributorType: "Developer",
            specialization: "Backend Developer",
        },

        project: {
            id: 302,
            name: "AI-PMS Backend",
        },

        sprint: {
            id: 502,
            name: "Sprint 2",
        },

        priority: PRIORITIES.CRITICAL,

        status: TASK_STATUS.IN_PROGRESS,

        dueDate: "2026-09-03",

        progress: 55,

        description:
            "Implement backend APIs required for team management and team leader functionality.",

        createdAt: "2026-08-06",
    },

    {
        id: 404,
        title: "Test Team Management",

        assignedContributor: {
            id: 203,
            fullName: "Dawit Tesfaye",
            email: "dawit@example.com",
            contributorType: "Developer",
            specialization: "QA/Tester",
        },

        project: {
            id: 303,
            name: "AI-PMS Testing",
        },

        sprint: {
            id: 503,
            name: "Sprint 4",
        },

        priority: PRIORITIES.HIGH,

        status: TASK_STATUS.REVIEW,

        dueDate: "2026-09-05",

        progress: 90,

        description:
            "Test team management functionality and verify expected system behavior.",

        createdAt: "2026-08-12",
    },

    {
        id: 405,
        title: "Update Project Documentation",

        assignedContributor: {
            id: 204,
            fullName: "Mekdes Alemu",
            email: "mekdes@example.com",
            contributorType: "Staff",
            specialization: "Project Assistant",
        },

        project: {
            id: 304,
            name: "AI-PMS Documentation",
        },

        sprint: {
            id: 502,
            name: "Sprint 2",
        },

        priority: PRIORITIES.LOW,

        status: TASK_STATUS.TODO,

        dueDate: "2026-09-07",

        progress: 20,

        description:
            "Update project documentation and ensure project information is complete.",

        createdAt: "2026-08-15",
    },

    {
        id: 406,
        title: "Fix Authentication Issue",

        assignedContributor: {
            id: 202,
            fullName: "Sara Mohammed",
            email: "sara@example.com",
            contributorType: "Developer",
            specialization: "Backend Developer",
        },

        project: {
            id: 302,
            name: "AI-PMS Backend",
        },

        sprint: {
            id: 502,
            name: "Sprint 2",
        },

        priority: PRIORITIES.CRITICAL,

        status: TASK_STATUS.BLOCKED,

        dueDate: "2026-08-30",

        progress: 35,

        description:
            "Investigate and resolve the authentication issue affecting the backend.",

        createdAt: "2026-08-14",
    },
];

/* ============================================================
   HELPER FUNCTIONS
============================================================ */

function getInitials(name) {
    if (!name) {
        return "U";
    }

    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("");
}

function formatDate(value) {
    if (!value) {
        return "Not specified";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString();
}

function isOverdue(task) {
    if (!task?.dueDate) {
        return false;
    }

    if (
        task.status === TASK_STATUS.COMPLETED
    ) {
        return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    return dueDate < today;
}

/* ============================================================
   STATUS STYLES
============================================================ */

function getStatusClass(status) {
    switch (status) {
        case TASK_STATUS.COMPLETED:
            return "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400";

        case TASK_STATUS.IN_PROGRESS:
            return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400";

        case TASK_STATUS.BLOCKED:
            return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400";

        case TASK_STATUS.REVIEW:
            return "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400";

        default:
            return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
    }
}

/* ============================================================
   PRIORITY STYLES
============================================================ */

function getPriorityClass(priority) {
    switch (priority) {
        case PRIORITIES.CRITICAL:
            return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400";

        case PRIORITIES.HIGH:
            return "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400";

        case PRIORITIES.MEDIUM:
            return "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400";

        default:
            return "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400";
    }
}

/* ============================================================
   STATUS ICON
============================================================ */

function StatusIcon({ status }) {
    switch (status) {
        case TASK_STATUS.COMPLETED:
            return (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
            );

        case TASK_STATUS.IN_PROGRESS:
            return (
                <CircleDot className="h-4 w-4 text-blue-500" />
            );

        case TASK_STATUS.BLOCKED:
            return (
                <AlertCircle className="h-4 w-4 text-red-500" />
            );

        case TASK_STATUS.REVIEW:
            return (
                <Clock3 className="h-4 w-4 text-orange-500" />
            );

        default:
            return (
                <Clock3 className="h-4 w-4 text-slate-400" />
            );
    }
}

/* ============================================================
   MAIN COMPONENT
============================================================ */

function ViewTeamTasks({
    tasks: tasksProp = null,
    loading: externalLoading = false,
    error: externalError = null,
    unauthorized: externalUnauthorized = false,
    teamAssigned = true,
    onRetry,
}) {
    /* ========================================================
       LOCAL STATE
    ======================================================== */

    const [tasks, setTasks] = useState(
        tasksProp || DEMO_TASKS
    );

    const [isLoading, setIsLoading] =
        useState(externalLoading);

    const [error, setError] =
        useState(externalError);

    const [isUnauthorized, setIsUnauthorized] =
        useState(externalUnauthorized);

    const [searchTerm, setSearchTerm] =
        useState("");

    const [selectedContributor, setSelectedContributor] =
        useState("all");

    const [selectedStatus, setSelectedStatus] =
        useState("all");

    const [selectedPriority, setSelectedPriority] =
        useState("all");

    const [selectedProject, setSelectedProject] =
        useState("all");

    const [selectedSprint, setSelectedSprint] =
        useState("all");

    const [selectedDueDate, setSelectedDueDate] =
        useState("all");

    const [selectedTask, setSelectedTask] =
        useState(null);

    const [filtersOpen, setFiltersOpen] =
        useState(false);

    /* ========================================================
       UPDATE FROM PARENT PROPS
       --------------------------------------------------------
       We intentionally do not use useEffect + setState here.
       This avoids the React set-state-in-effect ESLint error.
    ======================================================== */

    const displayedTasks =
        tasksProp !== null
            ? tasksProp
            : tasks;

    const currentLoading =
        externalLoading || isLoading;

    const currentError =
        externalError || error;

    const currentUnauthorized =
        externalUnauthorized || isUnauthorized;

    /* ========================================================
       UNIQUE FILTER OPTIONS
    ======================================================== */

    const contributors = useMemo(() => {
        const map = new Map();

        displayedTasks.forEach((task) => {
            const contributor =
                task.assignedContributor;

            if (contributor?.id) {
                map.set(
                    String(contributor.id),
                    contributor
                );
            }
        });

        return Array.from(map.values());
    }, [displayedTasks]);

    const projects = useMemo(() => {
        const map = new Map();

        displayedTasks.forEach((task) => {
            if (task.project?.id) {
                map.set(
                    String(task.project.id),
                    task.project
                );
            }
        });

        return Array.from(map.values());
    }, [displayedTasks]);

    const sprints = useMemo(() => {
        const map = new Map();

        displayedTasks.forEach((task) => {
            if (task.sprint?.id) {
                map.set(
                    String(task.sprint.id),
                    task.sprint
                );
            }
        });

        return Array.from(map.values());
    }, [displayedTasks]);

    /* ========================================================
       FILTER TASKS
    ======================================================== */

    const filteredTasks = useMemo(() => {
        const normalizedSearch =
            searchTerm.trim().toLowerCase();

        return displayedTasks.filter((task) => {
            /* SEARCH */

            const matchesSearch =
                !normalizedSearch ||
                task.title
                    ?.toLowerCase()
                    .includes(normalizedSearch) ||
                task.assignedContributor?.fullName
                    ?.toLowerCase()
                    .includes(normalizedSearch) ||
                task.project?.name
                    ?.toLowerCase()
                    .includes(normalizedSearch) ||
                task.sprint?.name
                    ?.toLowerCase()
                    .includes(normalizedSearch);

            /* CONTRIBUTOR */

            const matchesContributor =
                selectedContributor === "all" ||
                String(
                    task.assignedContributor?.id
                ) === String(selectedContributor);

            /* STATUS */

            const matchesStatus =
                selectedStatus === "all" ||
                task.status === selectedStatus;

            /* PRIORITY */

            const matchesPriority =
                selectedPriority === "all" ||
                task.priority === selectedPriority;

            /* PROJECT */

            const matchesProject =
                selectedProject === "all" ||
                String(task.project?.id) ===
                    String(selectedProject);

            /* SPRINT */

            const matchesSprint =
                selectedSprint === "all" ||
                String(task.sprint?.id) ===
                    String(selectedSprint);

            /* DUE DATE */

            let matchesDueDate = true;

            if (selectedDueDate === "overdue") {
                matchesDueDate = isOverdue(task);
            }

            if (selectedDueDate === "today") {
                const today = new Date();

                const taskDate = new Date(
                    task.dueDate
                );

                matchesDueDate =
                    taskDate.toDateString() ===
                    today.toDateString();
            }

            if (selectedDueDate === "upcoming") {
                matchesDueDate =
                    !isOverdue(task) &&
                    task.status !==
                        TASK_STATUS.COMPLETED;
            }

            return (
                matchesSearch &&
                matchesContributor &&
                matchesStatus &&
                matchesPriority &&
                matchesProject &&
                matchesSprint &&
                matchesDueDate
            );
        });
    }, [
        displayedTasks,
        searchTerm,
        selectedContributor,
        selectedStatus,
        selectedPriority,
        selectedProject,
        selectedSprint,
        selectedDueDate,
    ]);

    /* ========================================================
       STATISTICS
    ======================================================== */

    const statistics = useMemo(() => {
        const allTasks = displayedTasks;

        return {
            total: allTasks.length,

            completed: allTasks.filter(
                (task) =>
                    task.status ===
                    TASK_STATUS.COMPLETED
            ).length,

            inProgress: allTasks.filter(
                (task) =>
                    task.status ===
                    TASK_STATUS.IN_PROGRESS
            ).length,

            blocked: allTasks.filter(
                (task) =>
                    task.status ===
                    TASK_STATUS.BLOCKED
            ).length,

            review: allTasks.filter(
                (task) =>
                    task.status ===
                    TASK_STATUS.REVIEW
            ).length,

            overdue: allTasks.filter((task) =>
                isOverdue(task)
            ).length,
        };
    }, [displayedTasks]);

    /* ========================================================
       CLEAR FILTERS
    ======================================================== */

    const clearFilters = () => {
        setSearchTerm("");
        setSelectedContributor("all");
        setSelectedStatus("all");
        setSelectedPriority("all");
        setSelectedProject("all");
        setSelectedSprint("all");
        setSelectedDueDate("all");
    };

    const hasActiveFilters =
        searchTerm.trim() !== "" ||
        selectedContributor !== "all" ||
        selectedStatus !== "all" ||
        selectedPriority !== "all" ||
        selectedProject !== "all" ||
        selectedSprint !== "all" ||
        selectedDueDate !== "all";

    /* ========================================================
       RETRY
    ======================================================== */

    const handleRetry = async () => {
        setError(null);
        setIsUnauthorized(false);
        setIsLoading(true);

        if (onRetry) {
            try {
                await onRetry();
            } catch (retryError) {
                console.error(
                    "Unable to load team tasks:",
                    retryError
                );

                setError(
                    "Unable to load team tasks. Please try again."
                );
            } finally {
                setIsLoading(false);
            }

            return;
        }

        /*
         * Temporary frontend retry.
         * Replace with API request later.
         */

        setTimeout(() => {
            setTasks(DEMO_TASKS);
            setIsLoading(false);
        }, 500);
    };

    /* ========================================================
       LOADING
    ======================================================== */

    if (currentLoading) {
        return (
            <LoadingState />
        );
    }

    /* ========================================================
       UNAUTHORIZED
    ======================================================== */

    if (currentUnauthorized) {
        return (
            <UnauthorizedState />
        );
    }

    /* ========================================================
       ERROR
    ======================================================== */

    if (currentError) {
        return (
            <ErrorState
                error={currentError}
                onRetry={handleRetry}
            />
        );
    }

    /* ========================================================
       NO TEAM
    ======================================================== */

    if (!teamAssigned) {
        return (
            <NoTeamState />
        );
    }

    /* ========================================================
       NO TASKS
    ======================================================== */

    if (displayedTasks.length === 0) {
        return (
            <NoTasksState
                onRetry={handleRetry}
            />
        );
    }

    /* ========================================================
       MAIN UI
    ======================================================== */

    return (
        <div className="space-y-5">
            {/* ==================================================
                HEADER
            ================================================== */}

            <div
                className="
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    p-5
                    dark:border-blue-900/70
                    dark:bg-[#0f2747]
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
                                dark:bg-blue-950/60
                                dark:text-blue-400
                            "
                        >
                            <ClipboardIcon />
                        </div>

                        <div>
                            <h2
                                className="
                                    text-lg
                                    font-semibold
                                    text-slate-900
                                    dark:text-white
                                "
                            >
                                Team Tasks
                            </h2>

                            <p
                                className="
                                    mt-1
                                    text-xs
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                Monitor tasks assigned to
                                members of your team.
                            </p>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleRetry}
                    >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Refresh
                    </Button>
                </div>

                {/* ==================================================
                    STATISTICS
                ================================================== */}

                <div
                    className="
                        mt-5
                        grid
                        grid-cols-2
                        gap-3
                        md:grid-cols-3
                        lg:grid-cols-6
                    "
                >
                    <StatCard
                        label="Total"
                        value={statistics.total}
                        icon={
                            <Users className="h-4 w-4" />
                        }
                    />

                    <StatCard
                        label="Completed"
                        value={statistics.completed}
                        icon={
                            <CheckCircle2 className="h-4 w-4" />
                        }
                    />

                    <StatCard
                        label="In Progress"
                        value={statistics.inProgress}
                        icon={
                            <CircleDot className="h-4 w-4" />
                        }
                    />

                    <StatCard
                        label="Blocked"
                        value={statistics.blocked}
                        icon={
                            <AlertCircle className="h-4 w-4" />
                        }
                    />

                    <StatCard
                        label="Review"
                        value={statistics.review}
                        icon={
                            <Clock3 className="h-4 w-4" />
                        }
                    />

                    <StatCard
                        label="Overdue"
                        value={statistics.overdue}
                        icon={
                            <CalendarDays className="h-4 w-4" />
                        }
                    />
                </div>
            </div>

            {/* ==================================================
                SEARCH + FILTER
            ================================================== */}

            <div
                className="
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    p-4
                    dark:border-blue-900/70
                    dark:bg-[#0f2747]
                "
            >
                <div
                    className="
                        flex
                        flex-col
                        gap-3
                        lg:flex-row
                    "
                >
                    <div className="relative flex-1">
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

                        <Input
                            value={searchTerm}
                            onChange={(event) =>
                                setSearchTerm(
                                    event.target.value
                                )
                            }
                            placeholder="Search task, contributor, project or sprint..."
                            className="pl-9"
                        />
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                            setFiltersOpen(
                                (current) => !current
                            )
                        }
                    >
                        <Filter className="mr-2 h-4 w-4" />

                        Filters

                        {hasActiveFilters && (
                            <span
                                className="
                                    ml-2
                                    rounded-full
                                    bg-blue-100
                                    px-2
                                    py-0.5
                                    text-[10px]
                                    text-blue-700
                                "
                            >
                                Active
                            </span>
                        )}
                    </Button>

                    {hasActiveFilters && (
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={clearFilters}
                        >
                            <X className="mr-2 h-4 w-4" />
                            Clear
                        </Button>
                    )}
                </div>

                {/* ==================================================
                    FILTER PANEL
                ================================================== */}

                {filtersOpen && (
                    <div
                        className="
                            mt-4
                            grid
                            grid-cols-1
                            gap-3
                            border-t
                            border-slate-200
                            pt-4
                            sm:grid-cols-2
                            lg:grid-cols-3
                        "
                    >
                        <FilterSelect
                            label="Contributor"
                            value={selectedContributor}
                            onChange={
                                setSelectedContributor
                            }
                            options={[
                                {
                                    value: "all",
                                    label: "All Contributors",
                                },
                                ...contributors.map(
                                    (contributor) => ({
                                        value: String(
                                            contributor.id
                                        ),
                                        label:
                                            contributor.fullName,
                                    })
                                ),
                            ]}
                        />

                        <FilterSelect
                            label="Status"
                            value={selectedStatus}
                            onChange={setSelectedStatus}
                            options={[
                                {
                                    value: "all",
                                    label: "All Statuses",
                                },
                                ...Object.values(
                                    TASK_STATUS
                                ).map((status) => ({
                                    value: status,
                                    label: status,
                                })),
                            ]}
                        />

                        <FilterSelect
                            label="Priority"
                            value={selectedPriority}
                            onChange={
                                setSelectedPriority
                            }
                            options={[
                                {
                                    value: "all",
                                    label: "All Priorities",
                                },
                                ...Object.values(
                                    PRIORITIES
                                ).map((priority) => ({
                                    value: priority,
                                    label: priority,
                                })),
                            ]}
                        />

                        <FilterSelect
                            label="Project"
                            value={selectedProject}
                            onChange={setSelectedProject}
                            options={[
                                {
                                    value: "all",
                                    label: "All Projects",
                                },
                                ...projects.map(
                                    (project) => ({
                                        value: String(
                                            project.id
                                        ),
                                        label:
                                            project.name,
                                    })
                                ),
                            ]}
                        />

                        <FilterSelect
                            label="Sprint"
                            value={selectedSprint}
                            onChange={setSelectedSprint}
                            options={[
                                {
                                    value: "all",
                                    label: "All Sprints",
                                },
                                ...sprints.map(
                                    (sprint) => ({
                                        value: String(
                                            sprint.id
                                        ),
                                        label:
                                            sprint.name,
                                    })
                                ),
                            ]}
                        />

                        <FilterSelect
                            label="Due Date"
                            value={selectedDueDate}
                            onChange={setSelectedDueDate}
                            options={[
                                {
                                    value: "all",
                                    label: "All Due Dates",
                                },
                                {
                                    value: "today",
                                    label: "Due Today",
                                },
                                {
                                    value: "upcoming",
                                    label: "Upcoming",
                                },
                                {
                                    value: "overdue",
                                    label: "Overdue",
                                },
                            ]}
                        />
                    </div>
                )}
            </div>

            {/* ==================================================
                RESULT SUMMARY
            ================================================== */}

            <div
                className="
                    flex
                    flex-col
                    gap-2
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >
                <div className="flex items-center gap-2">
                    <ListFilter className="h-4 w-4 text-blue-500" />

                    <p
                        className="
                            text-sm
                            font-medium
                            text-slate-700
                            dark:text-slate-200
                        "
                    >
                        {filteredTasks.length} task
                        {filteredTasks.length !== 1
                            ? "s"
                            : ""}{" "}
                        found
                    </p>
                </div>

                <p
                    className="
                        text-xs
                        text-slate-500
                        dark:text-slate-400
                    "
                >
                    Showing tasks belonging to your
                    assigned team
                </p>
            </div>

            {/* ==================================================
                EMPTY FILTER RESULT
            ================================================== */}

            {filteredTasks.length === 0 ? (
                <FilteredEmptyState
                    onClear={clearFilters}
                />
            ) : (
                /* ==================================================
                   TASK LIST
                ================================================== */

                <div
                    className="
                        overflow-hidden
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        dark:border-blue-900/70
                        dark:bg-[#0f2747]
                    "
                >
                    {/* DESKTOP TABLE */}

                    <div className="hidden overflow-x-auto lg:block">
                        <table className="w-full text-sm">
                            <thead>
                                <tr
                                    className="
                                        border-b
                                        border-slate-200
                                        bg-slate-50
                                        dark:border-blue-900/70
                                        dark:bg-[#132f52]
                                    "
                                >
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                                        Task
                                    </th>

                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                                        Contributor
                                    </th>

                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                                        Project
                                    </th>

                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                                        Sprint
                                    </th>

                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                                        Priority
                                    </th>

                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                                        Status
                                    </th>

                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                                        Due Date
                                    </th>

                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                                        Progress
                                    </th>

                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredTasks.map(
                                    (task) => (
                                        <TaskTableRow
                                            key={task.id}
                                            task={task}
                                            onView={() =>
                                                setSelectedTask(
                                                    task
                                                )
                                            }
                                        />
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* MOBILE / TABLET CARDS */}

                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-3
                            p-3
                            lg:hidden
                        "
                    >
                        {filteredTasks.map(
                            (task) => (
                                <TaskMobileCard
                                    key={task.id}
                                    task={task}
                                    onView={() =>
                                        setSelectedTask(
                                            task
                                        )
                                    }
                                />
                            )
                        )}
                    </div>
                </div>
            )}

            {/* ==================================================
                TASK DETAILS
            ================================================== */}

            {selectedTask && (
                <TaskDetailsDialog
                    task={selectedTask}
                    onClose={() =>
                        setSelectedTask(null)
                    }
                />
            )}
        </div>
    );
}

/* ============================================================
   CLIPBOARD ICON
============================================================ */

function ClipboardIcon() {
    return (
        <ClipboardList className="h-5 w-5" />
    );
}

/* ============================================================
   STAT CARD
============================================================ */

function StatCard({
    label,
    value,
    icon,
}) {
    return (
        <div
            className="
                rounded-lg
                border
                border-slate-200
                bg-slate-50
                p-3
                dark:border-blue-900/70
                dark:bg-[#132f52]
            "
        >
            <div className="flex items-center gap-2">
                <span className="text-blue-500">
                    {icon}
                </span>

                <span
                    className="
                        text-xs
                        text-slate-500
                        dark:text-slate-400
                    "
                >
                    {label}
                </span>
            </div>

            <p
                className="
                    mt-2
                    text-lg
                    font-bold
                    text-slate-900
                    dark:text-white
                "
            >
                {value}
            </p>
        </div>
    );
}

/* ============================================================
   FILTER SELECT
============================================================ */

function FilterSelect({
    label,
    value,
    onChange,
    options,
}) {
    return (
        <div>
            <label
                className="
                    mb-1.5
                    block
                    text-xs
                    font-medium
                    text-slate-600
                    dark:text-slate-300
                "
            >
                {label}
            </label>

            <div className="relative">
                <select
                    value={value}
                    onChange={(event) =>
                        onChange(event.target.value)
                    }
                    className="
                        h-10
                        w-full
                        appearance-none
                        rounded-md
                        border
                        border-slate-200
                        bg-white
                        px-3
                        pr-9
                        text-sm
                        text-slate-700
                        outline-none
                        focus:border-blue-500
                        focus:ring-2
                        focus:ring-blue-500/20
                        dark:border-blue-900/70
                        dark:bg-[#132f52]
                        dark:text-slate-200
                    "
                >
                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                        >
                            {option.label}
                        </option>
                    ))}
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
        </div>
    );
}

/* ============================================================
   TABLE ROW
============================================================ */

function TaskTableRow({
    task,
    onView,
}) {
    const contributor =
        task.assignedContributor;

    const overdue = isOverdue(task);

    return (
        <tr
            className="
                border-b
                border-slate-100
                transition
                hover:bg-slate-50
                dark:border-blue-900/40
                dark:hover:bg-blue-950/20
            "
        >
            {/* TASK */}

            <td className="px-4 py-4">
                <div className="flex min-w-[210px] items-start gap-2">
                    <StatusIcon
                        status={task.status}
                    />

                    <div>
                        <p
                            className="
                                font-semibold
                                text-slate-800
                                dark:text-white
                            "
                        >
                            {task.title}
                        </p>

                        <p
                            className="
                                mt-1
                                text-xs
                                text-slate-400
                            "
                        >
                            Task #{task.id}
                        </p>
                    </div>
                </div>
            </td>

            {/* CONTRIBUTOR */}

            <td className="px-4 py-4">
                <div className="flex items-center gap-2">
                    <div
                        className="
                            flex
                            h-8
                            w-8
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-blue-100
                            text-xs
                            font-semibold
                            text-blue-600
                            dark:bg-blue-950/60
                            dark:text-blue-400
                        "
                    >
                        {getInitials(
                            contributor?.fullName
                        )}
                    </div>

                    <div className="min-w-0">
                        <p
                            className="
                                whitespace-nowrap
                                text-xs
                                font-semibold
                                text-slate-800
                                dark:text-white
                            "
                        >
                            {contributor?.fullName ||
                                "Unassigned"}
                        </p>

                        <p
                            className="
                                mt-0.5
                                whitespace-nowrap
                                text-[11px]
                                text-slate-400
                            "
                        >
                            {contributor?.specialization ||
                                contributor?.contributorType ||
                                "Contributor"}
                        </p>
                    </div>
                </div>
            </td>

            {/* PROJECT */}

            <td className="px-4 py-4">
                <div className="flex items-center gap-1.5">
                    <FolderKanban className="h-4 w-4 text-blue-500" />

                    <span
                        className="
                            whitespace-nowrap
                            text-xs
                            text-slate-700
                            dark:text-slate-300
                        "
                    >
                        {task.project?.name ||
                            "No Project"}
                    </span>
                </div>
            </td>

            {/* SPRINT */}

            <td className="px-4 py-4">
                <span
                    className="
                        whitespace-nowrap
                        text-xs
                        text-slate-600
                        dark:text-slate-300
                    "
                >
                    {task.sprint?.name ||
                        "No Sprint"}
                </span>
            </td>

            {/* PRIORITY */}

            <td className="px-4 py-4">
                <span
                    className={`
                        inline-flex
                        rounded-full
                        px-2.5
                        py-1
                        text-[11px]
                        font-medium
                        ${getPriorityClass(
                            task.priority
                        )}
                    `}
                >
                    {task.priority || "Not set"}
                </span>
            </td>

            {/* STATUS */}

            <td className="px-4 py-4">
                <span
                    className={`
                        inline-flex
                        items-center
                        gap-1.5
                        whitespace-nowrap
                        rounded-full
                        px-2.5
                        py-1
                        text-[11px]
                        font-medium
                        ${getStatusClass(
                            task.status
                        )}
                    `}
                >
                    <StatusIcon
                        status={task.status}
                    />

                    {task.status}
                </span>
            </td>

            {/* DUE DATE */}

            <td className="px-4 py-4">
                <span
                    className={`
                        whitespace-nowrap
                        text-xs
                        font-medium
                        ${
                            overdue
                                ? "text-red-600 dark:text-red-400"
                                : "text-slate-600 dark:text-slate-300"
                        }
                    `}
                >
                    {formatDate(
                        task.dueDate
                    )}

                    {overdue && (
                        <span className="ml-1 text-[10px]">
                            (Overdue)
                        </span>
                    )}
                </span>
            </td>

            {/* PROGRESS */}

            <td className="px-4 py-4">
                <div className="w-24">
                    <div
                        className="
                            mb-1
                            flex
                            justify-between
                            text-[10px]
                            text-slate-400
                        "
                    >
                        <span>Progress</span>
                        <span>
                            {task.progress ?? 0}%
                        </span>
                    </div>

                    <ProgressBar
                        value={task.progress}
                    />
                </div>
            </td>

            {/* ACTION */}

            <td className="px-4 py-4 text-right">
                <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={onView}
                >
                    <Eye className="mr-1.5 h-4 w-4" />
                    View
                </Button>
            </td>
        </tr>
    );
}

/* ============================================================
   MOBILE TASK CARD
============================================================ */

function TaskMobileCard({
    task,
    onView,
}) {
    const contributor =
        task.assignedContributor;

    const overdue = isOverdue(task);

    return (
        <div
            className="
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                p-4
                dark:border-blue-900/70
                dark:bg-[#132f52]
            "
        >
            <div className="flex items-start gap-3">
                <StatusIcon
                    status={task.status}
                />

                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <p
                                className="
                                    text-sm
                                    font-semibold
                                    text-slate-900
                                    dark:text-white
                                "
                            >
                                {task.title}
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-[11px]
                                    text-slate-400
                                "
                            >
                                Task #{task.id}
                            </p>
                        </div>

                        <span
                            className={`
                                shrink-0
                                rounded-full
                                px-2
                                py-1
                                text-[10px]
                                font-medium
                                ${getPriorityClass(
                                    task.priority
                                )}
                            `}
                        >
                            {task.priority}
                        </span>
                    </div>

                    {/* CONTRIBUTOR */}

                    <div
                        className="
                            mt-4
                            flex
                            items-center
                            gap-2
                        "
                    >
                        <div
                            className="
                                flex
                                h-8
                                w-8
                                items-center
                                justify-center
                                rounded-full
                                bg-blue-100
                                text-xs
                                font-semibold
                                text-blue-600
                                dark:bg-blue-950/60
                                dark:text-blue-400
                            "
                        >
                            {getInitials(
                                contributor?.fullName
                            )}
                        </div>

                        <div>
                            <p
                                className="
                                    text-xs
                                    font-medium
                                    text-slate-800
                                    dark:text-white
                                "
                            >
                                {contributor?.fullName ||
                                    "Unassigned"}
                            </p>

                            <p
                                className="
                                    text-[10px]
                                    text-slate-400
                                "
                            >
                                {contributor?.specialization ||
                                    contributor?.contributorType ||
                                    "Contributor"}
                            </p>
                        </div>
                    </div>

                    {/* PROJECT + SPRINT */}

                    <div
                        className="
                            mt-4
                            grid
                            grid-cols-2
                            gap-3
                        "
                    >
                        <InfoSmall
                            label="Project"
                            value={
                                task.project?.name ||
                                "No Project"
                            }
                        />

                        <InfoSmall
                            label="Sprint"
                            value={
                                task.sprint?.name ||
                                "No Sprint"
                            }
                        />
                    </div>

                    {/* STATUS + DUE */}

                    <div
                        className="
                            mt-4
                            flex
                            flex-wrap
                            items-center
                            gap-2
                        "
                    >
                        <span
                            className={`
                                inline-flex
                                items-center
                                gap-1
                                rounded-full
                                px-2.5
                                py-1
                                text-[10px]
                                font-medium
                                ${getStatusClass(
                                    task.status
                                )}
                            `}
                        >
                            <StatusIcon
                                status={task.status}
                            />

                            {task.status}
                        </span>

                        <span
                            className={`
                                text-[11px]
                                ${
                                    overdue
                                        ? "font-semibold text-red-600 dark:text-red-400"
                                        : "text-slate-500 dark:text-slate-400"
                                }
                            `}
                        >
                            Due:{" "}
                            {formatDate(
                                task.dueDate
                            )}
                        </span>
                    </div>

                    {/* PROGRESS */}

                    <div className="mt-4">
                        <div
                            className="
                                mb-1
                                flex
                                justify-between
                                text-[10px]
                                text-slate-400
                            "
                        >
                            <span>
                                Progress
                            </span>

                            <span>
                                {task.progress ??
                                    0}
                                %
                            </span>
                        </div>

                        <ProgressBar
                            value={task.progress}
                        />
                    </div>

                    {/* VIEW */}

                    <Button
                        type="button"
                        variant="outline"
                        className="mt-4 w-full"
                        onClick={onView}
                    >
                        <Eye className="mr-2 h-4 w-4" />
                        View Task Details
                    </Button>
                </div>
            </div>
        </div>
    );
}

/* ============================================================
   PROGRESS BAR
============================================================ */

function ProgressBar({
    value = 0,
}) {
    const safeValue = Math.min(
        Math.max(Number(value) || 0, 0),
        100
    );

    return (
        <div
            className="
                h-1.5
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
                    bg-blue-500
                    transition-all
                "
                style={{
                    width: `${safeValue}%`,
                }}
            />
        </div>
    );
}

/* ============================================================
   SMALL INFO
============================================================ */

function InfoSmall({
    label,
    value,
}) {
    return (
        <div>
            <p
                className="
                    text-[10px]
                    text-slate-400
                "
            >
                {label}
            </p>

            <p
                className="
                    mt-1
                    truncate
                    text-xs
                    font-medium
                    text-slate-700
                    dark:text-slate-200
                "
            >
                {value}
            </p>
        </div>
    );
}

/* ============================================================
   TASK DETAILS
============================================================ */

function TaskDetailsDialog({
    task,
    onClose,
}) {
    const contributor =
        task.assignedContributor;

    const overdue = isOverdue(task);

    return (
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
            role="dialog"
            aria-modal="true"
            aria-label="Task details"
            onMouseDown={(event) => {
                if (
                    event.target ===
                    event.currentTarget
                ) {
                    onClose();
                }
            }}
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
                    shadow-xl
                    dark:border-blue-900/70
                    dark:bg-[#0f2747]
                "
            >
                {/* HEADER */}

                <div
                    className="
                        sticky
                        top-0
                        z-10
                        flex
                        items-start
                        justify-between
                        gap-4
                        border-b
                        border-slate-200
                        bg-white
                        p-5
                        dark:border-blue-900/70
                        dark:bg-[#0f2747]
                    "
                >
                    <div className="flex items-start gap-3">
                        <div
                            className="
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                bg-blue-100
                                text-blue-600
                                dark:bg-blue-950/60
                                dark:text-blue-400
                            "
                        >
                            <Zap className="h-5 w-5" />
                        </div>

                        <div>
                            <h3
                                className="
                                    text-base
                                    font-semibold
                                    text-slate-900
                                    dark:text-white
                                "
                            >
                                {task.title}
                            </h3>

                            <p
                                className="
                                    mt-1
                                    text-xs
                                    text-slate-400
                                "
                            >
                                Task #{task.id}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            rounded-md
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
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="space-y-6 p-5">
                    {/* STATUS */}

                    <div className="flex flex-wrap gap-2">
                        <span
                            className={`
                                inline-flex
                                items-center
                                gap-1.5
                                rounded-full
                                px-3
                                py-1.5
                                text-xs
                                font-medium
                                ${getStatusClass(
                                    task.status
                                )}
                            `}
                        >
                            <StatusIcon
                                status={task.status}
                            />

                            {task.status}
                        </span>

                        <span
                            className={`
                                rounded-full
                                px-3
                                py-1.5
                                text-xs
                                font-medium
                                ${getPriorityClass(
                                    task.priority
                                )}
                            `}
                        >
                            Priority:{" "}
                            {task.priority}
                        </span>

                        {overdue && (
                            <span
                                className="
                                    rounded-full
                                    bg-red-100
                                    px-3
                                    py-1.5
                                    text-xs
                                    font-medium
                                    text-red-700
                                    dark:bg-red-950/40
                                    dark:text-red-400
                                "
                            >
                                Overdue
                            </span>
                        )}
                    </div>

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
                            Task Description
                        </h4>

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
                                "No description available."}
                        </p>
                    </div>

                    {/* ASSIGNED CONTRIBUTOR */}

                    <div>
                        <h4
                            className="
                                mb-3
                                text-sm
                                font-semibold
                                text-slate-900
                                dark:text-white
                            "
                        >
                            Assigned Contributor
                        </h4>

                        <div
                            className="
                                flex
                                items-center
                                gap-3
                                rounded-xl
                                border
                                border-slate-200
                                bg-slate-50
                                p-4
                                dark:border-blue-900/70
                                dark:bg-[#132f52]
                            "
                        >
                            <div
                                className="
                                    flex
                                    h-11
                                    w-11
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-blue-100
                                    font-semibold
                                    text-blue-600
                                    dark:bg-blue-950/60
                                    dark:text-blue-400
                                "
                            >
                                {getInitials(
                                    contributor?.fullName
                                )}
                            </div>

                            <div>
                                <p
                                    className="
                                        text-sm
                                        font-semibold
                                        text-slate-900
                                        dark:text-white
                                    "
                                >
                                    {contributor?.fullName ||
                                        "Unassigned"}
                                </p>

                                <p
                                    className="
                                        mt-1
                                        text-xs
                                        text-slate-500
                                        dark:text-slate-400
                                    "
                                >
                                    {contributor?.email ||
                                        "No email"}
                                </p>

                                <div className="mt-2 flex flex-wrap gap-2">
                                    <span
                                        className="
                                            rounded-full
                                            bg-blue-100
                                            px-2
                                            py-1
                                            text-[10px]
                                            font-medium
                                            text-blue-700
                                            dark:bg-blue-950/50
                                            dark:text-blue-300
                                        "
                                    >
                                        {contributor?.contributorType ||
                                            "Contributor"}
                                    </span>

                                    <span
                                        className="
                                            rounded-full
                                            bg-slate-100
                                            px-2
                                            py-1
                                            text-[10px]
                                            font-medium
                                            text-slate-700
                                            dark:bg-slate-800
                                            dark:text-slate-300
                                        "
                                    >
                                        {contributor?.specialization ||
                                            "No specialization"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* WORK INFORMATION */}

                    <div>
                        <h4
                            className="
                                mb-3
                                text-sm
                                font-semibold
                                text-slate-900
                                dark:text-white
                            "
                        >
                            Work Information
                        </h4>

                        <div
                            className="
                                grid
                                grid-cols-1
                                gap-3
                                sm:grid-cols-2
                            "
                        >
                            <DetailItem
                                label="Project"
                                value={
                                    task.project?.name
                                }
                                icon={
                                    <FolderKanban className="h-4 w-4" />
                                }
                            />

                            <DetailItem
                                label="Sprint"
                                value={
                                    task.sprint?.name
                                }
                                icon={
                                    <ListFilter className="h-4 w-4" />
                                }
                            />

                            <DetailItem
                                label="Due Date"
                                value={formatDate(
                                    task.dueDate
                                )}
                                icon={
                                    <CalendarDays className="h-4 w-4" />
                                }
                            />

                            <DetailItem
                                label="Progress"
                                value={`${task.progress ?? 0}%`}
                                icon={
                                    <CircleDot className="h-4 w-4" />
                                }
                            />
                        </div>
                    </div>

                    {/* PROGRESS */}

                    <div>
                        <div className="mb-2 flex justify-between">
                            <h4
                                className="
                                    text-sm
                                    font-semibold
                                    text-slate-900
                                    dark:text-white
                                "
                            >
                                Task Progress
                            </h4>

                            <span
                                className="
                                    text-sm
                                    font-semibold
                                    text-blue-600
                                    dark:text-blue-400
                                "
                            >
                                {task.progress ?? 0}%
                            </span>
                        </div>

                        <ProgressBar
                            value={task.progress}
                        />
                    </div>

                    {/* BUSINESS RULE */}

                    <div
                        className="
                            rounded-xl
                            border
                            border-blue-200
                            bg-blue-50
                            p-4
                            dark:border-blue-900/70
                            dark:bg-blue-950/20
                        "
                    >
                        <div className="flex gap-3">
                            <ShieldCheck
                                className="
                                    mt-0.5
                                    h-5
                                    w-5
                                    shrink-0
                                    text-blue-500
                                "
                            />

                            <div>
                                <p
                                    className="
                                        text-sm
                                        font-semibold
                                        text-blue-800
                                        dark:text-blue-300
                                    "
                                >
                                    Team Leader Access
                                </p>

                                <p
                                    className="
                                        mt-1
                                        text-xs
                                        leading-5
                                        text-blue-700
                                        dark:text-blue-400
                                    "
                                >
                                    You can view authorized
                                    task information for
                                    members of your assigned
                                    team. Manager-level
                                    actions such as final
                                    approval, reassignment
                                    and project-level
                                    decisions remain outside
                                    this use case.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FOOTER */}

                <div
                    className="
                        flex
                        justify-end
                        border-t
                        border-slate-200
                        p-4
                        dark:border-blue-900/70
                    "
                >
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                    >
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
}

/* ============================================================
   DETAIL ITEM
============================================================ */

function DetailItem({
    label,
    value,
    icon,
}) {
    return (
        <div
            className="
                rounded-lg
                border
                border-slate-200
                bg-slate-50
                p-3
                dark:border-blue-900/70
                dark:bg-[#132f52]
            "
        >
            <div className="flex items-center gap-2">
                <span className="text-blue-500">
                    {icon}
                </span>

                <span
                    className="
                        text-xs
                        text-slate-500
                        dark:text-slate-400
                    "
                >
                    {label}
                </span>
            </div>

            <p
                className="
                    mt-2
                    text-sm
                    font-medium
                    text-slate-800
                    dark:text-white
                "
            >
                {value || "Not specified"}
            </p>
        </div>
    );
}

/* ============================================================
   LOADING STATE
============================================================ */

function LoadingState() {
    return (
        <div
            className="
                flex
                min-h-[300px]
                items-center
                justify-center
                rounded-xl
                border
                border-slate-200
                bg-white
                dark:border-blue-900/70
                dark:bg-[#0f2747]
            "
        >
            <div className="text-center">
                <Loader2
                    className="
                        mx-auto
                        h-8
                        w-8
                        animate-spin
                        text-blue-500
                    "
                />

                <p
                    className="
                        mt-3
                        text-sm
                        font-medium
                        text-slate-700
                        dark:text-slate-200
                    "
                >
                    Loading team tasks...
                </p>

                <p
                    className="
                        mt-1
                        text-xs
                        text-slate-500
                        dark:text-slate-400
                    "
                >
                    Please wait.
                </p>
            </div>
        </div>
    );
}

/* ============================================================
   UNAUTHORIZED STATE
============================================================ */

function UnauthorizedState() {
    return (
        <div
            className="
                rounded-xl
                border
                border-red-200
                bg-red-50
                p-8
                text-center
                dark:border-red-900/60
                dark:bg-red-950/20
            "
        >
            <div
                className="
                    mx-auto
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-full
                    bg-red-100
                    text-red-600
                    dark:bg-red-950/50
                    dark:text-red-400
                "
            >
                <ShieldCheck className="h-6 w-6" />
            </div>

            <h3
                className="
                    mt-4
                    text-base
                    font-semibold
                    text-red-700
                    dark:text-red-400
                "
            >
                Access Denied
            </h3>

            <p
                className="
                    mt-1
                    text-sm
                    text-red-600
                    dark:text-red-400
                "
            >
                You are not authorized to view team
                tasks.
            </p>
        </div>
    );
}

/* ============================================================
   ERROR STATE
============================================================ */

function ErrorState({
    error,
    onRetry,
}) {
    return (
        <div
            className="
                rounded-xl
                border
                border-red-200
                bg-red-50
                p-8
                text-center
                dark:border-red-900/60
                dark:bg-red-950/20
            "
        >
            <div
                className="
                    mx-auto
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-full
                    bg-red-100
                    text-red-600
                    dark:bg-red-950/50
                    dark:text-red-400
                "
            >
                <AlertCircle className="h-6 w-6" />
            </div>

            <h3
                className="
                    mt-4
                    text-base
                    font-semibold
                    text-red-700
                    dark:text-red-400
                "
            >
                Unable to Load Team Tasks
            </h3>

            <p
                className="
                    mx-auto
                    mt-1
                    max-w-md
                    text-sm
                    text-red-600
                    dark:text-red-400
                "
            >
                {error ||
                    "Unable to load team tasks. Please try again."}
            </p>

            <Button
                type="button"
                variant="outline"
                onClick={onRetry}
                className="
                    mt-4
                    border-red-200
                    text-red-600
                    hover:bg-red-100
                    dark:border-red-900/70
                    dark:text-red-400
                    dark:hover:bg-red-950/40
                "
            >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
            </Button>
        </div>
    );
}

/* ============================================================
   NO TEAM STATE
============================================================ */

function NoTeamState() {
    return (
        <div
            className="
                rounded-xl
                border
                border-dashed
                border-slate-300
                bg-white
                px-6
                py-12
                text-center
                dark:border-blue-900/70
                dark:bg-[#0f2747]
            "
        >
            <Users
                className="
                    mx-auto
                    h-10
                    w-10
                    text-slate-400
                "
            />

            <h3
                className="
                    mt-4
                    text-base
                    font-semibold
                    text-slate-800
                    dark:text-white
                "
            >
                No Team Assigned
            </h3>

            <p
                className="
                    mx-auto
                    mt-1
                    max-w-md
                    text-sm
                    text-slate-500
                    dark:text-slate-400
                "
            >
                No team is currently assigned to you.
            </p>
        </div>
    );
}

/* ============================================================
   NO TASKS STATE
============================================================ */

function NoTasksState({
    onRetry,
}) {
    return (
        <div
            className="
                rounded-xl
                border
                border-dashed
                border-slate-300
                bg-white
                px-6
                py-12
                text-center
                dark:border-blue-900/70
                dark:bg-[#0f2747]
            "
        >
            <ClipboardList
                className="
                    mx-auto
                    h-10
                    w-10
                    text-slate-400
                "
            />

            <h3
                className="
                    mt-4
                    text-base
                    font-semibold
                    text-slate-800
                    dark:text-white
                "
            >
                No Team Tasks
            </h3>

            <p
                className="
                    mx-auto
                    mt-1
                    max-w-md
                    text-sm
                    text-slate-500
                    dark:text-slate-400
                "
            >
                No team tasks are currently
                available.
            </p>

            <Button
                type="button"
                variant="outline"
                onClick={onRetry}
                className="mt-4"
            >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
            </Button>
        </div>
    );
}

/* ============================================================
   FILTERED EMPTY STATE
============================================================ */

function FilteredEmptyState({
    onClear,
}) {
    return (
        <div
            className="
                rounded-xl
                border
                border-dashed
                border-slate-300
                bg-white
                px-6
                py-12
                text-center
                dark:border-blue-900/70
                dark:bg-[#0f2747]
            "
        >
            <Search
                className="
                    mx-auto
                    h-10
                    w-10
                    text-slate-400
                "
            />

            <h3
                className="
                    mt-4
                    text-base
                    font-semibold
                    text-slate-800
                    dark:text-white
                "
            >
                No Matching Tasks
            </h3>

            <p
                className="
                    mx-auto
                    mt-1
                    max-w-md
                    text-sm
                    text-slate-500
                    dark:text-slate-400
                "
            >
                No team tasks match your current
                search and filters.
            </p>

            <Button
                type="button"
                variant="outline"
                onClick={onClear}
                className="mt-4"
            >
                <X className="mr-2 h-4 w-4" />
                Clear Filters
            </Button>
        </div>
    );
}

/* ============================================================
   EXPORT
============================================================ */

export default ViewTeamTasks;