import { useMemo, useState } from "react";

import {
    Activity,
    AlertCircle,
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    CircleUserRound,
    Clock3,
    FileText,
    Filter,
    History,
    MessageSquare,
    Paperclip,
    RefreshCw,
    Search,
    Send,
    ShieldCheck,
    Tag,
    UserRound,
    X,
} from "lucide-react";

// ============================================================
// CONT-TASK-010
// VIEW TASK HISTORY
// ============================================================
//
// Primary Actor:
// Contributor
//
// Supported Contributor Types:
// - Team Leader
// - Staff
// - Developer
//
// This component allows a contributor to view:
// - Status changes
// - Progress updates
// - Comments
// - Attachments
// - Submissions
// - Review feedback
// - Activity timestamps
//
// The component does NOT provide:
// - Task creation
// - Task reassignment
// - Task deletion
// - Task approval
//
// Those permissions remain outside this component.
// ============================================================

// ============================================================
// CURRENT CONTRIBUTOR
// ============================================================

const CURRENT_CONTRIBUTOR = {
    id: "USER-003",
    name: "Hana Nigussie",
    role: "Developer",
};

// ============================================================
// PERMITTED CONTRIBUTOR TYPES
// ============================================================

const ALLOWED_CONTRIBUTOR_ROLES = [
    "Team Leader",
    "Staff",
    "Developer",
    "Contributor",
];

// ============================================================
// SAMPLE TASKS
//
// In the real system these should come from the backend.
// ============================================================

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
        status: "In Progress",
        progress: 65,
        priority: "High",
        dueDate: "2026-08-30",
    },
    {
        id: "TASK-002",
        title: "Implement Project Participation",
        description:
            "Implement contributor project participation functionality.",
        projectId: "PROJ-001",
        projectName: "AI Powered Management System",
        sprintId: "SPRINT-004",
        sprintName: "Sprint 4",
        assigneeId: "USER-003",
        assigneeName: "Hana Nigussie",
        status: "Review",
        progress: 100,
        priority: "High",
        dueDate: "2026-08-28",
    },
    {
        id: "TASK-003",
        title: "Prepare Project Documentation",
        description:
            "Prepare and organize project documentation.",
        projectId: "PROJ-001",
        projectName: "AI Powered Management System",
        sprintId: "SPRINT-004",
        sprintName: "Sprint 4",
        assigneeId: "USER-004",
        assigneeName: "Team Member",
        status: "In Progress",
        progress: 50,
        priority: "Medium",
        dueDate: "2026-08-25",
    },
];

// ============================================================
// SAMPLE TASK HISTORY
//
// The history structure represents the events that the backend
// can later return from the Task History API.
// ============================================================

const INITIAL_HISTORY = {
    "TASK-001": [
        {
            id: "HIST-001",
            taskId: "TASK-001",
            type: "TASK_CREATED",
            title: "Task created",
            description:
                'Task "Implement Contributor Dashboard" was created.',
            userId: "USER-001",
            userName: "Project Manager",
            userRole: "Manager",
            timestamp: "2026-08-18T08:30:00",
        },
        {
            id: "HIST-002",
            taskId: "TASK-001",
            type: "TASK_ASSIGNED",
            title: "Task assigned",
            description:
                "Task was assigned to Hana Nigussie.",
            userId: "USER-001",
            userName: "Project Manager",
            userRole: "Manager",
            timestamp: "2026-08-18T09:00:00",
        },
        {
            id: "HIST-003",
            taskId: "TASK-001",
            type: "STATUS_CHANGED",
            title: "Status changed",
            description:
                "Task status changed from Backlog to In Progress.",
            oldValue: "Backlog",
            newValue: "In Progress",
            userId: "USER-003",
            userName: "Hana Nigussie",
            userRole: "Developer",
            timestamp: "2026-08-19T10:15:00",
        },
        {
            id: "HIST-004",
            taskId: "TASK-001",
            type: "PROGRESS_UPDATED",
            title: "Progress updated",
            description:
                "Task progress was updated from 1% to 35%.",
            oldValue: "1%",
            newValue: "35%",
            userId: "USER-003",
            userName: "Hana Nigussie",
            userRole: "Developer",
            timestamp: "2026-08-20T11:20:00",
        },
        {
            id: "HIST-005",
            taskId: "TASK-001",
            type: "COMMENT_ADDED",
            title: "Comment added",
            description:
                "Dashboard implementation is progressing well. Authentication integration is completed.",
            userId: "USER-003",
            userName: "Hana Nigussie",
            userRole: "Developer",
            timestamp: "2026-08-21T13:10:00",
        },
        {
            id: "HIST-006",
            taskId: "TASK-001",
            type: "ATTACHMENT_UPLOADED",
            title: "Attachment uploaded",
            description:
                "contributor-dashboard-preview.pdf was attached to the task.",
            fileName: "contributor-dashboard-preview.pdf",
            userId: "USER-003",
            userName: "Hana Nigussie",
            userRole: "Developer",
            timestamp: "2026-08-21T14:05:00",
        },
        {
            id: "HIST-007",
            taskId: "TASK-001",
            type: "PROGRESS_UPDATED",
            title: "Progress updated",
            description:
                "Task progress was updated from 35% to 65%.",
            oldValue: "35%",
            newValue: "65%",
            userId: "USER-003",
            userName: "Hana Nigussie",
            userRole: "Developer",
            timestamp: "2026-08-23T09:40:00",
        },
    ],

    "TASK-002": [
        {
            id: "HIST-008",
            taskId: "TASK-002",
            type: "TASK_CREATED",
            title: "Task created",
            description:
                'Task "Implement Project Participation" was created.',
            userId: "USER-001",
            userName: "Project Manager",
            userRole: "Manager",
            timestamp: "2026-08-19T08:00:00",
        },
        {
            id: "HIST-009",
            taskId: "TASK-002",
            type: "TASK_ASSIGNED",
            title: "Task assigned",
            description:
                "Task was assigned to Hana Nigussie.",
            userId: "USER-001",
            userName: "Project Manager",
            userRole: "Manager",
            timestamp: "2026-08-19T08:15:00",
        },
        {
            id: "HIST-010",
            taskId: "TASK-002",
            type: "STATUS_CHANGED",
            title: "Status changed",
            description:
                "Task status changed from Backlog to In Progress.",
            oldValue: "Backlog",
            newValue: "In Progress",
            userId: "USER-003",
            userName: "Hana Nigussie",
            userRole: "Developer",
            timestamp: "2026-08-20T09:30:00",
        },
        {
            id: "HIST-011",
            taskId: "TASK-002",
            type: "PROGRESS_UPDATED",
            title: "Progress updated",
            description:
                "Task progress was updated from 35% to 100%.",
            oldValue: "35%",
            newValue: "100%",
            userId: "USER-003",
            userName: "Hana Nigussie",
            userRole: "Developer",
            timestamp: "2026-08-24T10:30:00",
        },
        {
            id: "HIST-012",
            taskId: "TASK-002",
            type: "COMMENT_ADDED",
            title: "Completion comment added",
            description:
                "All required project participation features have been implemented.",
            userId: "USER-003",
            userName: "Hana Nigussie",
            userRole: "Developer",
            timestamp: "2026-08-24T11:00:00",
        },
        {
            id: "HIST-013",
            taskId: "TASK-002",
            type: "ATTACHMENT_UPLOADED",
            title: "Attachment uploaded",
            description:
                "project-participation-final.zip was attached to the task.",
            fileName: "project-participation-final.zip",
            userId: "USER-003",
            userName: "Hana Nigussie",
            userRole: "Developer",
            timestamp: "2026-08-24T11:10:00",
        },
        {
            id: "HIST-014",
            taskId: "TASK-002",
            type: "SUBMITTED_FOR_REVIEW",
            title: "Submitted for review",
            description:
                "Task was submitted to the Manager for review.",
            userId: "USER-003",
            userName: "Hana Nigussie",
            userRole: "Developer",
            timestamp: "2026-08-24T11:30:00",
        },
        {
            id: "HIST-015",
            taskId: "TASK-002",
            type: "REVIEW_FEEDBACK",
            title: "Review feedback received",
            description:
                "Please verify the project communication section before final approval.",
            userId: "USER-001",
            userName: "Project Manager",
            userRole: "Manager",
            timestamp: "2026-08-24T15:20:00",
        },
    ],
};

// ============================================================
// HELPERS
// ============================================================

function formatDateTime(value) {
    if (!value) {
        return "Not available";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Not available";
    }

    return date.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function formatDate(value) {
    if (!value) {
        return "Not available";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Not available";
    }

    return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

// ============================================================
// STATUS COLORS
// ============================================================

function getStatusClasses(status) {
    switch (status) {
        case "In Progress":
            return "bg-blue-100 text-blue-700";

        case "Review":
            return "bg-purple-100 text-purple-700";

        case "Done":
        case "Completed":
            return "bg-emerald-100 text-emerald-700";

        case "Blocked":
            return "bg-red-100 text-red-700";

        case "Backlog":
        case "To Do":
        case "Todo":
            return "bg-slate-100 text-slate-700";

        default:
            return "bg-slate-100 text-slate-700";
    }
}

// ============================================================
// HISTORY TYPE CONFIGURATION
// ============================================================

function getHistoryConfig(type) {
    switch (type) {
        case "STATUS_CHANGED":
            return {
                icon: <RefreshCw size={18} />,
                label: "Status Change",
                classes:
                    "bg-blue-100 text-blue-700",
            };

        case "PROGRESS_UPDATED":
            return {
                icon: <Activity size={18} />,
                label: "Progress Update",
                classes:
                    "bg-indigo-100 text-indigo-700",
            };

        case "COMMENT_ADDED":
            return {
                icon: <MessageSquare size={18} />,
                label: "Comment",
                classes:
                    "bg-emerald-100 text-emerald-700",
            };

        case "ATTACHMENT_UPLOADED":
            return {
                icon: <Paperclip size={18} />,
                label: "Attachment",
                classes:
                    "bg-amber-100 text-amber-700",
            };

        case "SUBMITTED_FOR_REVIEW":
            return {
                icon: <Send size={18} />,
                label: "Submission",
                classes:
                    "bg-purple-100 text-purple-700",
            };

        case "REVIEW_FEEDBACK":
            return {
                icon: <ShieldCheck size={18} />,
                label: "Review Feedback",
                classes:
                    "bg-orange-100 text-orange-700",
            };

        case "TASK_ASSIGNED":
            return {
                icon: <UserRound size={18} />,
                label: "Assignment",
                classes:
                    "bg-cyan-100 text-cyan-700",
            };

        case "TASK_CREATED":
            return {
                icon: <FileText size={18} />,
                label: "Task Created",
                classes:
                    "bg-slate-100 text-slate-700",
            };

        default:
            return {
                icon: <History size={18} />,
                label: "Activity",
                classes:
                    "bg-slate-100 text-slate-700",
            };
    }
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function ViewTaskHistory() {
    // ========================================================
    // TASK STATE
    // ========================================================

    const [tasks] = useState(INITIAL_TASKS);

    // ========================================================
    // HISTORY STATE
    // ========================================================

    const [history] = useState(INITIAL_HISTORY);

    // ========================================================
    // SELECTED TASK
    // ========================================================

    const [selectedTask, setSelectedTask] = useState(null);

    // ========================================================
    // SEARCH
    // ========================================================

    const [search, setSearch] = useState("");

    // ========================================================
    // HISTORY FILTER
    // ========================================================

    const [historyFilter, setHistoryFilter] =
        useState("All");

    // ========================================================
    // EXPANDED HISTORY ITEM
    // ========================================================

    const [expandedItem, setExpandedItem] =
        useState(null);

    // ========================================================
    // NOTIFICATION
    // ========================================================

    const [notification, setNotification] =
        useState(null);

    // ========================================================
    // PERMISSION CHECK
    //
    // CONT-TASK-010
    //
    // Team Leader / Staff / Developer / Contributor
    // can view task history.
    // ========================================================

    const hasHistoryPermission =
        ALLOWED_CONTRIBUTOR_ROLES.includes(
            CURRENT_CONTRIBUTOR.role
        );

    // ========================================================
    // ASSIGNED TASKS
    //
    // A contributor should only view history for tasks
    // assigned to them.
    // ========================================================

    const assignedTasks = useMemo(() => {
        return tasks.filter(
            (task) =>
                task.assigneeId ===
                CURRENT_CONTRIBUTOR.id
        );
    }, [tasks]);

    // ========================================================
    // FILTER TASKS
    // ========================================================

    const filteredTasks = useMemo(() => {
        const searchValue =
            search.trim().toLowerCase();

        if (!searchValue) {
            return assignedTasks;
        }

        return assignedTasks.filter((task) => {
            return (
                task.id
                    .toLowerCase()
                    .includes(searchValue) ||
                task.title
                    .toLowerCase()
                    .includes(searchValue) ||
                task.projectName
                    .toLowerCase()
                    .includes(searchValue) ||
                task.sprintName
                    .toLowerCase()
                    .includes(searchValue)
            );
        });
    }, [assignedTasks, search]);

    // ========================================================
    // SELECT TASK
    //
    // MAIN SUCCESS SCENARIO - STEP 1
    // Contributor opens Task Details.
    // ========================================================

    const openTaskHistory = (task) => {
        if (!hasHistoryPermission) {
            setNotification({
                type: "error",
                message:
                    "You do not have permission to view task history.",
            });

            return;
        }

        if (
            task.assigneeId !==
            CURRENT_CONTRIBUTOR.id
        ) {
            setNotification({
                type: "error",
                message:
                    "You cannot view this task history.",
            });

            return;
        }

        setSelectedTask(task);
        setNotification(null);
        setHistoryFilter("All");
        setExpandedItem(null);
    };

    // ========================================================
    // CLOSE HISTORY
    // ========================================================

    const closeHistory = () => {
        setSelectedTask(null);
        setExpandedItem(null);
        setNotification(null);
    };

    // ========================================================
    // GET CURRENT TASK HISTORY
    // ========================================================

    const selectedHistory = useMemo(() => {
        if (!selectedTask) {
            return [];
        }

        return history[selectedTask.id] || [];
    }, [history, selectedTask]);

    // ========================================================
    // FILTER HISTORY
    // ========================================================

    const filteredHistory = useMemo(() => {
        if (historyFilter === "All") {
            return selectedHistory;
        }

        return selectedHistory.filter(
            (item) =>
                item.type === historyFilter
        );
    }, [
        selectedHistory,
        historyFilter,
    ]);

    // ========================================================
    // HISTORY COUNTS
    // ========================================================

    const historyCounts = useMemo(() => {
        const counts = {
            All: selectedHistory.length,
            STATUS_CHANGED: 0,
            PROGRESS_UPDATED: 0,
            COMMENT_ADDED: 0,
            ATTACHMENT_UPLOADED: 0,
            SUBMITTED_FOR_REVIEW: 0,
            REVIEW_FEEDBACK: 0,
        };

        selectedHistory.forEach((item) => {
            if (
                Object.prototype.hasOwnProperty.call(
                    counts,
                    item.type
                )
            ) {
                counts[item.type] += 1;
            }
        });

        return counts;
    }, [selectedHistory]);

    // ========================================================
    // TOGGLE HISTORY ITEM
    // ========================================================

    const toggleHistoryItem = (historyId) => {
        setExpandedItem((current) =>
            current === historyId
                ? null
                : historyId
        );
    };

    // ========================================================
    // PERMISSION BLOCK
    // ========================================================

    if (!hasHistoryPermission) {
        return (
            <div className="min-h-screen bg-slate-50 p-6">
                <div className="mx-auto max-w-3xl">
                    <div className="rounded-2xl border border-red-200 bg-white p-10 text-center shadow-sm">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
                            <ShieldCheck size={30} />
                        </div>

                        <h1 className="mt-5 text-xl font-bold text-slate-900">
                            Access Denied
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            You do not have permission to view
                            task history.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // ========================================================
    // TASK LIST
    // ========================================================

    if (!selectedTask) {
        return (
            <div className="min-h-screen bg-slate-50 p-6">
                <div className="mx-auto max-w-7xl">

                    {/* ====================================================
                        HEADER
                    ==================================================== */}

                    <div className="mb-6">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
                                <History size={25} />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">
                                    Task History
                                </h1>

                                <p className="text-sm text-slate-500">
                                    View the history of changes made
                                    to your assigned tasks.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ====================================================
                        NOTIFICATION
                    ==================================================== */}

                    {notification && (
                        <Notification
                            notification={
                                notification
                            }
                            onClose={() =>
                                setNotification(
                                    null
                                )
                            }
                        />
                    )}

                    {/* ====================================================
                        CONTRIBUTOR INFORMATION
                    ==================================================== */}

                    <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-white p-3 text-blue-600">
                                    <CircleUserRound
                                        size={21}
                                    />
                                </div>

                                <div>
                                    <p className="text-xs font-medium text-blue-600">
                                        Logged-in Contributor
                                    </p>

                                    <p className="font-semibold text-blue-900">
                                        {
                                            CURRENT_CONTRIBUTOR.name
                                        }
                                    </p>
                                </div>
                            </div>

                            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-blue-700">
                                {
                                    CURRENT_CONTRIBUTOR.role
                                }
                            </span>
                        </div>
                    </div>

                    {/* ====================================================
                        SEARCH
                    ==================================================== */}

                    <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="relative">
                            <Search
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target
                                            .value
                                    )
                                }
                                placeholder="Search assigned tasks..."
                                className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>
                    </div>

                    {/* ====================================================
                        TASK LIST
                    ==================================================== */}

                    {filteredTasks.length === 0 ? (
                        <EmptyState
                            title="No assigned tasks found"
                            description="There are no assigned tasks matching your search."
                        />
                    ) : (
                        <div className="grid gap-5 lg:grid-cols-2">
                            {filteredTasks.map(
                                (task) => (
                                    <TaskHistoryCard
                                        key={
                                            task.id
                                        }
                                        task={
                                            task
                                        }
                                        historyCount={
                                            (
                                                history[
                                                    task
                                                        .id
                                                ] ||
                                                []
                                            ).length
                                        }
                                        onOpen={() =>
                                            openTaskHistory(
                                                task
                                            )
                                        }
                                    />
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // ========================================================
    // TASK HISTORY DETAIL
    // ========================================================

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="mx-auto max-w-6xl">

                {/* ====================================================
                    TOP BAR
                ==================================================== */}

                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                    <button
                        type="button"
                        onClick={
                            closeHistory
                        }
                        className="flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                        <ArrowLeft
                            size={18}
                        />
                        Back to Tasks
                    </button>

                    <div className="flex items-center gap-2">
                        <span
                            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                                selectedTask.status
                            )}`}
                        >
                            {
                                selectedTask.status
                            }
                        </span>

                        <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm">
                            {
                                selectedHistory.length
                            } activities
                        </span>
                    </div>
                </div>

                {/* ====================================================
                    NOTIFICATION
                ==================================================== */}

                {notification && (
                    <Notification
                        notification={
                            notification
                        }
                        onClose={() =>
                            setNotification(
                                null
                            )
                        }
                    />
                )}

                {/* ====================================================
                    TASK SUMMARY
                ==================================================== */}

                <div className="mb-6 rounded-2xl border border-slate-200 bg-white shadow-sm">

                    <div className="border-b border-slate-100 p-6">
                        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">

                            <div>
                                <p className="text-xs font-semibold text-blue-600">
                                    {
                                        selectedTask.id
                                    }
                                </p>

                                <h1 className="mt-1 text-2xl font-bold text-slate-900">
                                    {
                                        selectedTask.title
                                    }
                                </h1>

                                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
                                    {
                                        selectedTask.description
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ====================================================
                        TASK INFORMATION
                    ==================================================== */}

                    <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">

                        <InfoCard
                            icon={
                                <FileText
                                    size={18}
                                />
                            }
                            label="Task"
                            value={
                                selectedTask.id
                            }
                        />

                        <InfoCard
                            icon={
                                <Tag
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
                                <Activity
                                    size={18}
                                />
                            }
                            label="Current Progress"
                            value={`${selectedTask.progress}%`}
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
                    </div>
                </div>

                {/* ====================================================
                    HISTORY FILTERS
                ==================================================== */}

                <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                    <div className="mb-4 flex items-center gap-2">
                        <Filter
                            size={18}
                            className="text-slate-500"
                        />

                        <h2 className="font-semibold text-slate-800">
                            Filter History
                        </h2>
                    </div>

                    <div className="flex flex-wrap gap-2">

                        <HistoryFilterButton
                            label="All"
                            count={
                                historyCounts.All
                            }
                            active={
                                historyFilter ===
                                "All"
                            }
                            onClick={() =>
                                setHistoryFilter(
                                    "All"
                                )
                            }
                        />

                        <HistoryFilterButton
                            label="Status Changes"
                            count={
                                historyCounts.STATUS_CHANGED
                            }
                            active={
                                historyFilter ===
                                "STATUS_CHANGED"
                            }
                            onClick={() =>
                                setHistoryFilter(
                                    "STATUS_CHANGED"
                                )
                            }
                        />

                        <HistoryFilterButton
                            label="Progress"
                            count={
                                historyCounts.PROGRESS_UPDATED
                            }
                            active={
                                historyFilter ===
                                "PROGRESS_UPDATED"
                            }
                            onClick={() =>
                                setHistoryFilter(
                                    "PROGRESS_UPDATED"
                                )
                            }
                        />

                        <HistoryFilterButton
                            label="Comments"
                            count={
                                historyCounts.COMMENT_ADDED
                            }
                            active={
                                historyFilter ===
                                "COMMENT_ADDED"
                            }
                            onClick={() =>
                                setHistoryFilter(
                                    "COMMENT_ADDED"
                                )
                            }
                        />

                        <HistoryFilterButton
                            label="Attachments"
                            count={
                                historyCounts.ATTACHMENT_UPLOADED
                            }
                            active={
                                historyFilter ===
                                "ATTACHMENT_UPLOADED"
                            }
                            onClick={() =>
                                setHistoryFilter(
                                    "ATTACHMENT_UPLOADED"
                                )
                            }
                        />

                        <HistoryFilterButton
                            label="Submissions"
                            count={
                                historyCounts.SUBMITTED_FOR_REVIEW
                            }
                            active={
                                historyFilter ===
                                "SUBMITTED_FOR_REVIEW"
                            }
                            onClick={() =>
                                setHistoryFilter(
                                    "SUBMITTED_FOR_REVIEW"
                                )
                            }
                        />

                        <HistoryFilterButton
                            label="Review Feedback"
                            count={
                                historyCounts.REVIEW_FEEDBACK
                            }
                            active={
                                historyFilter ===
                                "REVIEW_FEEDBACK"
                            }
                            onClick={() =>
                                setHistoryFilter(
                                    "REVIEW_FEEDBACK"
                                )
                            }
                        />
                    </div>
                </div>

                {/* ====================================================
                    HISTORY CONTENT
                ==================================================== */}

                {filteredHistory.length ===
                0 ? (
                    <EmptyState
                        title="No history found"
                        description="There are no history records for the selected filter."
                    />
                ) : (
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                        <div className="mb-6 flex items-center gap-3">
                            <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
                                <History
                                    size={22}
                                />
                            </div>

                            <div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    Task History
                                </h2>

                                <p className="text-sm text-slate-500">
                                    Historical activity for{" "}
                                    {
                                        selectedTask.id
                                    }
                                </p>
                            </div>
                        </div>

                        <div className="relative">

                            {/* TIMELINE LINE */}

                            <div className="absolute bottom-0 left-[23px] top-0 w-px bg-slate-200" />

                            <div className="space-y-5">
                                {filteredHistory.map(
                                    (
                                        item,
                                        index
                                    ) => (
                                        <HistoryItem
                                            key={
                                                item.id
                                            }
                                            item={
                                                item
                                            }
                                            index={
                                                index
                                            }
                                            expanded={
                                                expandedItem ===
                                                item.id
                                            }
                                            onToggle={() =>
                                                toggleHistoryItem(
                                                    item.id
                                                )
                                            }
                                        />
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ====================================================
                    PERMISSION INFORMATION
                ==================================================== */}

                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-start gap-3">
                        <div className="rounded-xl bg-slate-100 p-3 text-slate-600">
                            <ShieldCheck
                                size={20}
                            />
                        </div>

                        <div>
                            <h3 className="text-sm font-bold text-slate-800">
                                History Access
                            </h3>

                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                You can view historical
                                information for tasks assigned
                                to you. Task creation,
                                reassignment, deletion, and
                                task approval are not available
                                from this contributor feature.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================================
// TASK HISTORY CARD
// ============================================================

function TaskHistoryCard({
    task,
    historyCount,
    onOpen,
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md">

            {/* HEADER */}

            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold text-blue-600">
                        {task.id}
                    </p>

                    <h2 className="mt-1 text-lg font-bold text-slate-900">
                        {task.title}
                    </h2>
                </div>

                <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                        task.status
                    )}`}
                >
                    {task.status}
                </span>
            </div>

            {/* DESCRIPTION */}

            <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
                {task.description}
            </p>

            {/* TASK META */}

            <div className="mt-5 grid gap-3 sm:grid-cols-2">

                <SmallInfo
                    icon={
                        <Tag size={16} />
                    }
                    label="Project"
                    value={
                        task.projectName
                    }
                />

                <SmallInfo
                    icon={
                        <RefreshCw
                            size={16}
                        />
                    }
                    label="Sprint"
                    value={
                        task.sprintName
                    }
                />

                <SmallInfo
                    icon={
                        <Activity
                            size={16}
                        />
                    }
                    label="Progress"
                    value={`${task.progress}%`}
                />

                <SmallInfo
                    icon={
                        <History
                            size={16}
                        />
                    }
                    label="History"
                    value={`${historyCount} activities`}
                />
            </div>

            {/* PROGRESS */}

            <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                        Current Progress
                    </span>

                    <span className="font-semibold text-slate-700">
                        {task.progress}%
                    </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                        className="h-full rounded-full bg-blue-600 transition-all"
                        style={{
                            width: `${task.progress}%`,
                        }}
                    />
                </div>
            </div>

            {/* ACTION */}

            <div className="mt-5 border-t border-slate-100 pt-4">
                <button
                    type="button"
                    onClick={onOpen}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                    <History
                        size={17}
                    />
                    View Task History
                </button>
            </div>
        </div>
    );
}

// ============================================================
// HISTORY ITEM
// ============================================================

function HistoryItem({
    item,
    expanded,
    onToggle,
}) {
    const config =
        getHistoryConfig(item.type);

    return (
        <div className="relative pl-14">

            {/* TIMELINE ICON */}

            <div
                className={`absolute left-0 top-0 z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 border-white ${config.classes}`}
            >
                {config.icon}
            </div>

            {/* HISTORY CARD */}

            <div className="rounded-2xl border border-slate-200 bg-white transition hover:border-slate-300">

                {/* HEADER */}

                <button
                    type="button"
                    onClick={onToggle}
                    className="flex w-full items-start justify-between gap-4 p-5 text-left"
                >
                    <div className="min-w-0 flex-1">

                        <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-slate-900">
                                {item.title}
                            </h3>

                            <span
                                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${config.classes}`}
                            >
                                {
                                    config.label
                                }
                            </span>
                        </div>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            {
                                item.description
                            }
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-400">

                            <span className="flex items-center gap-1.5">
                                <UserRound
                                    size={
                                        13
                                    }
                                />

                                {
                                    item.userName
                                }
                            </span>

                            <span className="flex items-center gap-1.5">
                                <Clock3
                                    size={
                                        13
                                    }
                                />

                                {formatDateTime(
                                    item.timestamp
                                )}
                            </span>
                        </div>
                    </div>

                    <div className="shrink-0 rounded-lg p-1 text-slate-400">
                        {expanded ? (
                            <ChevronUp
                                size={18}
                            />
                        ) : (
                            <ChevronDown
                                size={18}
                            />
                        )}
                    </div>
                </button>

                {/* EXPANDED CONTENT */}

                {expanded && (
                    <div className="border-t border-slate-100 bg-slate-50 p-5">

                        <div className="grid gap-4 sm:grid-cols-2">

                            <DetailValue
                                label="Activity Type"
                                value={
                                    config.label
                                }
                            />

                            <DetailValue
                                label="Performed By"
                                value={
                                    item.userName
                                }
                            />

                            <DetailValue
                                label="Role"
                                value={
                                    item.userRole
                                }
                            />

                            <DetailValue
                                label="Date & Time"
                                value={formatDateTime(
                                    item.timestamp
                                )}
                            />

                            {item.oldValue && (
                                <DetailValue
                                    label="Previous Value"
                                    value={
                                        item.oldValue
                                    }
                                />
                            )}

                            {item.newValue && (
                                <DetailValue
                                    label="New Value"
                                    value={
                                        item.newValue
                                    }
                                />
                            )}

                            {item.fileName && (
                                <DetailValue
                                    label="Attachment"
                                    value={
                                        item.fileName
                                    }
                                />
                            )}
                        </div>

                        {/* ACTIVITY DESCRIPTION */}

                        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Activity Details
                            </p>

                            <p className="mt-2 text-sm leading-6 text-slate-700">
                                {
                                    item.description
                                }
                            </p>
                        </div>

                        {/* STATUS CHANGE */}

                        {item.type ===
                            "STATUS_CHANGED" &&
                            item.oldValue &&
                            item.newValue && (
                                <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">

                                    <span
                                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                                            item.oldValue
                                        )}`}
                                    >
                                        {
                                            item.oldValue
                                        }
                                    </span>

                                    <span className="text-slate-400">
                                        →
                                    </span>

                                    <span
                                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                                            item.newValue
                                        )}`}
                                    >
                                        {
                                            item.newValue
                                        }
                                    </span>
                                </div>
                            )}

                        {/* PROGRESS CHANGE */}

                        {item.type ===
                            "PROGRESS_UPDATED" &&
                            item.oldValue &&
                            item.newValue && (
                                <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50 p-4">

                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-indigo-700">
                                            Progress Change
                                        </span>

                                        <span className="text-sm font-bold text-indigo-700">
                                            {
                                                item.newValue
                                            }
                                        </span>
                                    </div>

                                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                                        <div
                                            className="h-full rounded-full bg-indigo-600"
                                            style={{
                                                width:
                                                    parseInt(
                                                        item.newValue,
                                                        10
                                                    ) || 0,
                                            }}
                                        />
                                    </div>

                                    <p className="mt-2 text-xs text-indigo-600">
                                        Previous progress:{" "}
                                        {
                                            item.oldValue
                                        }
                                    </p>
                                </div>
                            )}

                        {/* ATTACHMENT */}

                        {item.type ===
                            "ATTACHMENT_UPLOADED" &&
                            item.fileName && (
                                <div className="mt-4 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">

                                    <div className="rounded-lg bg-white p-2 text-amber-600">
                                        <Paperclip
                                            size={
                                                18
                                            }
                                        />
                                    </div>

                                    <div>
                                        <p className="text-xs font-medium text-amber-600">
                                            Attached File
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-amber-900">
                                            {
                                                item.fileName
                                            }
                                        </p>
                                    </div>
                                </div>
                            )}
                    </div>
                )}
            </div>
        </div>
    );
}

// ============================================================
// HISTORY FILTER BUTTON
// ============================================================

function HistoryFilterButton({
    label,
    count,
    active,
    onClick,
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                active
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
            }`}
        >
            {label} ({count})
        </button>
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
                    <p className="text-xs font-medium text-slate-400">
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
// SMALL INFO
// ============================================================

function SmallInfo({
    icon,
    label,
    value,
}) {
    return (
        <div className="flex items-center gap-2">
            <div className="text-slate-400">
                {icon}
            </div>

            <div className="min-w-0">
                <p className="text-[11px] text-slate-400">
                    {label}
                </p>

                <p className="truncate text-xs font-semibold text-slate-700">
                    {value}
                </p>
            </div>
        </div>
    );
}

// ============================================================
// DETAIL VALUE
// ============================================================

function DetailValue({
    label,
    value,
}) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-medium text-slate-400">
                {label}
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-800">
                {value}
            </p>
        </div>
    );
}

// ============================================================
// NOTIFICATION
// ============================================================

function Notification({
    notification,
    onClose,
}) {
    const isSuccess =
        notification.type === "success";

    return (
        <div
            className={`mb-5 flex items-center justify-between gap-4 rounded-xl border p-4 ${
                isSuccess
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-red-200 bg-red-50 text-red-700"
            }`}
        >
            <div className="flex items-center gap-2">
                {isSuccess ? (
                    <CheckCircle2
                        size={19}
                    />
                ) : (
                    <AlertCircle
                        size={19}
                    />
                )}

                <span className="text-sm font-medium">
                    {notification.message}
                </span>
            </div>

            <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1 transition hover:bg-black/5"
                aria-label="Close notification"
            >
                <X size={17} />
            </button>
        </div>
    );
}

// ============================================================
// EMPTY STATE
// ============================================================

function EmptyState({
    title,
    description,
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <History size={26} />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-slate-800">
                {title}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
                {description}
            </p>
        </div>
    );
}