
import { useMemo, useState } from "react";
import {
    AlertCircle,
    CalendarDays,
    CheckCircle2,
    CircleUserRound,
    Clock3,
    FolderKanban,
    MessageSquareText,
    RefreshCw,
    ShieldAlert,
    Timer,
    X,
} from "lucide-react";


const CURRENT_CONTRIBUTOR = {
    id: "USER-003",
    name: "Hana Nigussie",
    role: "Contributor",
};


// ============================================================
// ALLOWED STATUS TRANSITIONS
// ============================================================

const STATUS_TRANSITIONS = {
    Backlog: ["In Progress"],

    "To Do": ["In Progress"],

    Todo: ["In Progress"],

    Ready: ["In Progress"],

    "In Progress": ["Review", "Blocked"],

    Review: ["Done"],

    Blocked: ["In Progress"],

    Done: [],

    Completed: [],
};


// ============================================================
// CLOSED STATUSES
// ============================================================

const CLOSED_STATUSES = [
    "Done",
    "Completed",
];


// ============================================================
// MOCK TASKS
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
        priority: "High",
        status: "Backlog",
        progress: 0,
        startTime: null,
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
        id: "TASK-003",
        title: "Prepare Project Documentation",
        description:
            "Prepare and organize the required project documentation.",
        projectId: "PROJ-001",
        projectName: "AI Powered Management System",
        sprintId: "SPRINT-004",
        sprintName: "Sprint 4",
        assigneeId: "USER-003",
        assigneeName: "Hana Nigussie",
        priority: "Medium",
        status: "Review",
        progress: 90,
        startTime: "2026-08-20T10:00:00",
        dueDate: "2026-08-25",
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
        startTime: "2026-08-18T08:30:00",
        dueDate: "2026-09-02",
    },

    {
        id: "TASK-005",
        title: "Create FieldSync Reports",
        description:
            "Create reporting functionality for the FieldSync project.",
        projectId: "PROJ-002",
        projectName: "FieldSync",
        sprintId: "SPRINT-002",
        sprintName: "Sprint 2",
        assigneeId: "USER-003",
        assigneeName: "Hana Nigussie",
        priority: "Medium",
        status: "To Do",
        progress: 0,
        startTime: null,
        dueDate: "2026-09-10",
    },

    {
        id: "TASK-006",
        title: "Finalize Authentication",
        description:
            "Finalize authentication functionality and verify the login workflow.",
        projectId: "PROJ-001",
        projectName: "AI Powered Management System",
        sprintId: "SPRINT-004",
        sprintName: "Sprint 4",
        assigneeId: "USER-004",
        assigneeName: "Team Member",
        priority: "High",
        status: "In Progress",
        progress: 50,
        startTime: "2026-08-21T11:00:00",
        dueDate: "2026-08-29",
    },

    {
        id: "TASK-007",
        title: "Completed API Documentation",
        description:
            "Document the completed backend API endpoints.",
        projectId: "PROJ-001",
        projectName: "AI Powered Management System",
        sprintId: "SPRINT-004",
        sprintName: "Sprint 4",
        assigneeId: "USER-003",
        assigneeName: "Hana Nigussie",
        priority: "Low",
        status: "Done",
        progress: 100,
        startTime: "2026-08-15T09:00:00",
        dueDate: "2026-08-20",
    },
];


// ============================================================
// HELPERS
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
        case "Ready":
            return "bg-slate-100 text-slate-700";

        default:
            return "bg-slate-100 text-slate-700";
    }
}


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
// PROGRESS BY STATUS
// ============================================================
//
// Status changes should also update relevant progress
// information.
//
// These are minimum logical progress values.
// Existing higher progress is preserved when appropriate.
// ============================================================

function getProgressForStatus(status, currentProgress) {
    switch (status) {
        case "Backlog":
        case "To Do":
        case "Todo":
        case "Ready":
            return 0;

        case "In Progress":
            return Math.max(currentProgress, 1);

        case "Review":
            return Math.max(currentProgress, 90);

        case "Blocked":
            return currentProgress;

        case "Done":
        case "Completed":
            return 100;

        default:
            return currentProgress;
    }
}


// ============================================================
// MAIN COMPONENT
// ============================================================

export default function UpdateTaskStatus() {
    const [tasks, setTasks] = useState(INITIAL_TASKS);

    const [selectedTask, setSelectedTask] = useState(null);

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] = useState("All");

    const [notification, setNotification] = useState(null);

    const [isSaving, setIsSaving] = useState(false);

    // ----------------------------------------------------------
    // STATUS MODAL STATE
    // ----------------------------------------------------------

    const [statusModalOpen, setStatusModalOpen] = useState(false);

    const [newStatus, setNewStatus] = useState("");

    const [statusComment, setStatusComment] = useState("");

    // ============================================================
    // FILTER ASSIGNED TASKS
    // ============================================================

    const filteredTasks = useMemo(() => {
        const searchValue = search.trim().toLowerCase();

        return tasks.filter((task) => {
            const isAssignedToContributor =
                task.assigneeId === CURRENT_CONTRIBUTOR.id;

            if (!isAssignedToContributor) {
                return false;
            }

            const matchesSearch =
                !searchValue ||
                task.id.toLowerCase().includes(searchValue) ||
                task.title.toLowerCase().includes(searchValue) ||
                task.projectName.toLowerCase().includes(searchValue) ||
                task.sprintName.toLowerCase().includes(searchValue);

            const matchesStatus =
                statusFilter === "All" ||
                task.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [tasks, search, statusFilter]);


    // ============================================================
    // OPEN TASK
    // ============================================================

    const openTask = (task) => {
        setSelectedTask(task);
        setNotification(null);
    };


    // ============================================================
    // CLOSE TASK
    // ============================================================

    const closeTask = () => {
        setSelectedTask(null);
        setStatusModalOpen(false);
        setNotification(null);
    };


    // ============================================================
    // OPEN CHANGE STATUS
    //
    // USE CASE STEP 2:
    // Contributor selects Change Status.
    //
    // USE CASE STEP 3:
    // System displays allowed status transitions.
    // ============================================================

    const openStatusModal = (task) => {
        setNotification(null);

        // --------------------------------------------------------
        // A3: Contributor does not own task.
        // --------------------------------------------------------

        if (
            task.assigneeId !==
            CURRENT_CONTRIBUTOR.id
        ) {
            setNotification({
                type: "error",
                message: "You cannot update this task.",
            });

            return;
        }

        // --------------------------------------------------------
        // A2: Task is closed.
        // --------------------------------------------------------

        if (
            CLOSED_STATUSES.includes(
                task.status
            )
        ) {
            setNotification({
                type: "error",
                message: "This task cannot be modified.",
            });

            return;
        }

        const allowedStatuses =
            STATUS_TRANSITIONS[task.status] || [];

        // --------------------------------------------------------
        // No transition available.
        // --------------------------------------------------------

        if (allowedStatuses.length === 0) {
            setNotification({
                type: "error",
                message:
                    "This status transition is not allowed.",
            });

            return;
        }

        setNewStatus(allowedStatuses[0]);
        setStatusComment("");
        setStatusModalOpen(true);
    };


    // ============================================================
    // RECORD STATUS ACTIVITY
    //
    // USE CASE STEP 10
    // The system records the status change.
    //
    // IMPORTANT:
    // Date is created ONLY when the event actually happens.
    // It is NOT created during render.
    // ============================================================

    const recordStatusActivity = ({
        task,
        oldStatus,
        updatedStatus,
        comment,
        timestamp,
    }) => {
        const activity = {
            id: `ACT-${crypto.randomUUID()}`,

            type: "TASK_STATUS_CHANGED",

            taskId: task.id,

            taskTitle: task.title,

            projectId: task.projectId,

            projectName: task.projectName,

            sprintId: task.sprintId,

            sprintName: task.sprintName,

            userId: CURRENT_CONTRIBUTOR.id,

            userName: CURRENT_CONTRIBUTOR.name,

            oldStatus,

            newStatus: updatedStatus,

            comment: comment.trim(),

            timestamp,

            description:
                `Task "${task.title}" status changed from "${oldStatus}" to "${updatedStatus}".`,
        };

        const existingActivities =
            JSON.parse(
                localStorage.getItem(
                    "aipms_task_activities"
                ) || "[]"
            );

        localStorage.setItem(
            "aipms_task_activities",
            JSON.stringify([
                ...existingActivities,
                activity,
            ])
        );

        return activity;
    };


    // ============================================================
    // UPDATE PROJECT AND SPRINT
    //
    // USE CASE STEP 8
    // The system updates relevant progress information.
    // ============================================================

    const updateProjectAndSprintInformation = (
        task,
        updatedTask
    ) => {
        const projectUpdate = {
            id: crypto.randomUUID(),

            projectId: task.projectId,

            projectName: task.projectName,

            taskId: task.id,

            taskTitle: task.title,

            taskStatus: updatedTask.status,

            taskProgress: updatedTask.progress,

            updatedBy:
                CURRENT_CONTRIBUTOR.id,

            updatedAt: updatedTask.updatedAt,
        };


        const sprintUpdate = {
            id: crypto.randomUUID(),

            sprintId: task.sprintId,

            sprintName: task.sprintName,

            taskId: task.id,

            taskTitle: task.title,

            taskStatus: updatedTask.status,

            taskProgress: updatedTask.progress,

            updatedBy:
                CURRENT_CONTRIBUTOR.id,

            updatedAt: updatedTask.updatedAt,
        };


        const existingProjectUpdates =
            JSON.parse(
                localStorage.getItem(
                    "aipms_project_task_updates"
                ) || "[]"
            );


        const existingSprintUpdates =
            JSON.parse(
                localStorage.getItem(
                    "aipms_sprint_task_updates"
                ) || "[]"
            );


        localStorage.setItem(
            "aipms_project_task_updates",
            JSON.stringify([
                ...existingProjectUpdates,
                projectUpdate,
            ])
        );


        localStorage.setItem(
            "aipms_sprint_task_updates",
            JSON.stringify([
                ...existingSprintUpdates,
                sprintUpdate,
            ])
        );
    };


    // ============================================================
    // NOTIFY RELEVANT USERS
    //
    // USE CASE STEP 9
    // Relevant users are notified.
    //
    // Temporary local notification storage.
    // Replace with backend notification service later.
    // ============================================================

    const notifyRelevantUsers = ({
        task,
        oldStatus,
        newStatus: updatedStatus,
        comment,
        timestamp,
    }) => {
        const notificationRecord = {
            id: crypto.randomUUID(),

            type: "TASK_STATUS_CHANGED",

            taskId: task.id,

            taskTitle: task.title,

            projectId: task.projectId,

            projectName: task.projectName,

            sprintId: task.sprintId,

            sprintName: task.sprintName,

            recipientRole: "Project/Sprint Relevant Users",

            actorId:
                CURRENT_CONTRIBUTOR.id,

            actorName:
                CURRENT_CONTRIBUTOR.name,

            oldStatus,

            newStatus: updatedStatus,

            comment: comment.trim(),

            createdAt: timestamp,

            read: false,
        };


        const existingNotifications =
            JSON.parse(
                localStorage.getItem(
                    "aipms_task_notifications"
                ) || "[]"
            );


        localStorage.setItem(
            "aipms_task_notifications",
            JSON.stringify([
                ...existingNotifications,
                notificationRecord,
            ])
        );
    };


    // ============================================================
    // HANDLE STATUS UPDATE
    //
    // CONT-TASK-004
    //
    // MAIN SUCCESS SCENARIO:
    // 1. Open task
    // 2. Select Change Status
    // 3. Display allowed transitions
    // 4. Select new status
    // 5. Add optional comment
    // 6. Validate transition
    // 7. Update task
    // 8. Update progress information
    // 9. Notify relevant users
    // 10. Record status change
    // ============================================================

    const handleStatusUpdate = async () => {
        if (!selectedTask) {
            return;
        }

        // --------------------------------------------------------
        // A3: Contributor does not own task.
        // --------------------------------------------------------

        if (
            selectedTask.assigneeId !==
            CURRENT_CONTRIBUTOR.id
        ) {
            setNotification({
                type: "error",
                message: "You cannot update this task.",
            });

            setStatusModalOpen(false);

            return;
        }


        // --------------------------------------------------------
        // A2: Task is closed.
        // --------------------------------------------------------

        if (
            CLOSED_STATUSES.includes(
                selectedTask.status
            )
        ) {
            setNotification({
                type: "error",
                message: "This task cannot be modified.",
            });

            setStatusModalOpen(false);

            return;
        }


        // --------------------------------------------------------
        // Get allowed transitions.
        // --------------------------------------------------------

        const allowedTransitions =
            STATUS_TRANSITIONS[
                selectedTask.status
            ] || [];


        // --------------------------------------------------------
        // A1: Invalid transition.
        // --------------------------------------------------------

        if (
            !newStatus ||
            !allowedTransitions.includes(
                newStatus
            )
        ) {
            setNotification({
                type: "error",
                message:
                    "This status transition is not allowed.",
            });

            return;
        }


        // --------------------------------------------------------
        // Prevent selecting the same status.
        // --------------------------------------------------------

        if (
            newStatus ===
            selectedTask.status
        ) {
            setNotification({
                type: "error",
                message:
                    "This status transition is not allowed.",
            });

            return;
        }


        try {
            setIsSaving(true);


            // ----------------------------------------------------
            // Event timestamp.
            //
            // Created here because the status-change event is
            // actually occurring here.
            // ----------------------------------------------------

            const updatedAt =
                new Date().toISOString();


            // ----------------------------------------------------
            // Calculate progress.
            // ----------------------------------------------------

            const updatedProgress =
                getProgressForStatus(
                    newStatus,
                    selectedTask.progress
                );


            // ----------------------------------------------------
            // Create updated task.
            // ----------------------------------------------------

            const updatedTask = {
                ...selectedTask,

                status: newStatus,

                progress: updatedProgress,

                updatedAt,
            };


            // ----------------------------------------------------
            // STEP 7
            // Update task.
            // ----------------------------------------------------

            setTasks((previousTasks) =>
                previousTasks.map(
                    (task) =>
                        task.id ===
                        selectedTask.id
                            ? updatedTask
                            : task
                )
            );


            // ----------------------------------------------------
            // STEP 8
            // Update relevant progress information.
            // ----------------------------------------------------

            updateProjectAndSprintInformation(
                selectedTask,
                updatedTask
            );


            // ----------------------------------------------------
            // STEP 9
            // Notify relevant users.
            // ----------------------------------------------------

            notifyRelevantUsers({
                task: selectedTask,

                oldStatus:
                    selectedTask.status,

                newStatus,

                comment: statusComment,

                timestamp: updatedAt,
            });


            // ----------------------------------------------------
            // STEP 10
            // Record status change.
            // ----------------------------------------------------

            recordStatusActivity({
                task: selectedTask,

                oldStatus:
                    selectedTask.status,

                updatedStatus: newStatus,

                comment: statusComment,

                timestamp: updatedAt,
            });


            // ----------------------------------------------------
            // Simulated backend request.
            //
            // Replace later with:
            //
            // await taskService.updateTaskStatus(...)
            // ----------------------------------------------------

            await new Promise(
                (resolve) =>
                    setTimeout(resolve, 400)
            );


            // ----------------------------------------------------
            // Update selected task.
            // ----------------------------------------------------

            setSelectedTask(updatedTask);


            // ----------------------------------------------------
            // Close modal.
            // ----------------------------------------------------

            setStatusModalOpen(false);

            setStatusComment("");


            // ----------------------------------------------------
            // Success notification.
            // ----------------------------------------------------

            setNotification({
                type: "success",

                message:
                    `Task status updated to "${newStatus}".`,
            });
        } catch (error) {
            console.error(
                "Unable to update task status:",
                error
            );

            setNotification({
                type: "error",

                message:
                    "Unable to update task status. Please try again.",
            });
        } finally {
            setIsSaving(false);
        }
    };


    // ============================================================
    // TASK LIST
    // ============================================================

    if (!selectedTask) {
        return (
            <div className="min-h-screen bg-slate-50 p-6">
                <div className="mx-auto max-w-7xl">

                    {/* HEADER */}

                    <div className="mb-6">
                        <div className="flex items-center gap-3">

                            <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
                                <RefreshCw size={25} />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">
                                    Update Task Status
                                </h1>

                                <p className="text-sm text-slate-500">
                                    Update the status of tasks assigned to you.
                                </p>
                            </div>

                        </div>
                    </div>


                    {/* NOTIFICATION */}

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


                    {/* CONTRIBUTOR INFORMATION */}

                    <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">

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
                                    {CURRENT_CONTRIBUTOR.name}
                                </p>
                            </div>

                        </div>

                    </div>


                    {/* SEARCH / FILTER */}

                    <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                        <div className="flex flex-col gap-3 md:flex-row">

                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                                placeholder="Search assigned tasks..."
                                className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                            <select
                                value={
                                    statusFilter
                                }
                                onChange={(event) =>
                                    setStatusFilter(
                                        event.target.value
                                    )
                                }
                                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
                            >

                                <option value="All">
                                    All Statuses
                                </option>

                                <option value="Backlog">
                                    Backlog
                                </option>

                                <option value="To Do">
                                    To Do
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


                    {/* TASK LIST */}

                    {filteredTasks.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <div className="grid gap-5 lg:grid-cols-2">

                            {filteredTasks.map(
                                (task) => (
                                    <TaskCard
                                        key={
                                            task.id
                                        }
                                        task={
                                            task
                                        }
                                        onOpen={() =>
                                            openTask(
                                                task
                                            )
                                        }
                                        onChangeStatus={() =>
                                            openStatusModal(
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


    // ============================================================
    // TASK DETAIL
    // ============================================================

    const isOwner =
        selectedTask.assigneeId ===
        CURRENT_CONTRIBUTOR.id;


    const isClosed =
        CLOSED_STATUSES.includes(
            selectedTask.status
        );


    const allowedTransitions =
        STATUS_TRANSITIONS[
            selectedTask.status
        ] || [];


    const canChangeStatus =
        isOwner &&
        !isClosed &&
        allowedTransitions.length > 0;


    return (
        <div className="min-h-screen bg-slate-50 p-6">

            <div className="mx-auto max-w-5xl">

                {/* TOP BAR */}

                <div className="mb-6 flex items-center justify-between gap-4">

                    <button
                        type="button"
                        onClick={closeTask}
                        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                        <X size={18} />
                        Close
                    </button>


                    <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                            selectedTask.status
                        )}`}
                    >
                        {selectedTask.status}
                    </span>

                </div>


                {/* NOTIFICATION */}

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


                {/* TASK CARD */}

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    {/* HEADER */}

                    <div className="border-b border-slate-100 p-6">

                        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">

                            <div>

                                <p className="text-xs font-semibold text-blue-600">
                                    {selectedTask.id}
                                </p>

                                <h1 className="mt-1 text-2xl font-bold text-slate-900">
                                    {selectedTask.title}
                                </h1>

                                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
                                    {
                                        selectedTask.description
                                    }
                                </p>

                            </div>


                            <span
                                className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${getPriorityClasses(
                                    selectedTask.priority
                                )}`}
                            >
                                {
                                    selectedTask.priority
                                }{" "}
                                Priority
                            </span>

                        </div>

                    </div>


                    {/* TASK INFORMATION */}

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
                                <Timer size={18} />
                            }
                            label="Current Status"
                            value={
                                selectedTask.status
                            }
                        />

                        <InfoCard
                            icon={
                                <Clock3
                                    size={18}
                                />
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

                            <span className="text-sm font-bold text-blue-600">
                                {
                                    selectedTask.progress
                                }
                                %
                            </span>

                        </div>


                        <div className="h-3 overflow-hidden rounded-full bg-slate-100">

                            <div
                                className="h-full rounded-full bg-blue-600 transition-all duration-500"
                                style={{
                                    width: `${selectedTask.progress}%`,
                                }}
                            />

                        </div>

                    </div>


                    {/* STATUS WORKFLOW */}

                    <div className="border-b border-slate-100 p-6">

                        <h2 className="mb-4 text-sm font-bold text-slate-800">
                            Task Workflow
                        </h2>

                        <div className="flex flex-wrap items-center gap-2">

                            {[
                                "Backlog",
                                "In Progress",
                                "Review",
                                "Done",
                            ].map(
                                (
                                    status,
                                    index,
                                    array
                                ) => (
                                    <div
                                        key={
                                            status
                                        }
                                        className="flex items-center gap-2"
                                    >

                                        <span
                                            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                                                selectedTask.status ===
                                                status
                                                    ? getStatusClasses(
                                                          status
                                                      )
                                                    : "bg-slate-100 text-slate-500"
                                            }`}
                                        >
                                            {
                                                status
                                            }
                                        </span>

                                        {index <
                                            array.length -
                                                1 && (
                                            <span className="text-slate-300">
                                                →
                                            </span>
                                        )}

                                    </div>
                                )
                            )}

                        </div>


                        {selectedTask.status ===
                            "In Progress" && (
                            <div className="mt-3">

                                <span className="text-xs text-slate-500">
                                    The task may also move to{" "}
                                    <strong>
                                        Blocked
                                    </strong>
                                    .
                                </span>

                            </div>
                        )}

                    </div>


                    {/* CHANGE STATUS */}

                    <div className="p-6">

                        <div
                            className={`rounded-2xl border p-5 ${
                                canChangeStatus
                                    ? "border-blue-100 bg-blue-50"
                                    : "border-slate-200 bg-slate-50"
                            }`}
                        >

                            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                                <div>

                                    <div className="flex items-center gap-3">

                                        <div
                                            className={`rounded-xl p-3 ${
                                                canChangeStatus
                                                    ? "bg-blue-100 text-blue-600"
                                                    : "bg-slate-200 text-slate-500"
                                            }`}
                                        >
                                            <RefreshCw
                                                size={
                                                    22
                                                }
                                            />
                                        </div>


                                        <div>

                                            <h2 className="font-bold text-slate-900">
                                                Change Status
                                            </h2>

                                            <p className="mt-1 text-sm text-slate-500">
                                                {canChangeStatus
                                                    ? `Allowed next status: ${allowedTransitions.join(
                                                          ", "
                                                      )}`
                                                    : isClosed
                                                    ? "This task cannot be modified."
                                                    : !isOwner
                                                    ? "You cannot update this task."
                                                    : "No status transition is currently available."}
                                            </p>

                                        </div>

                                    </div>

                                </div>


                                <button
                                    type="button"
                                    disabled={
                                        !canChangeStatus
                                    }
                                    onClick={() =>
                                        openStatusModal(
                                            selectedTask
                                        )
                                    }
                                    className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                                >
                                    <RefreshCw
                                        size={17}
                                    />
                                    Change Status
                                </button>

                            </div>

                        </div>


                        {/* OWNER WARNING */}

                        {!isOwner && (
                            <WarningBox
                                type="error"
                                icon={
                                    <ShieldAlert
                                        size={19}
                                    />
                                }
                                title="Task ownership required"
                                message="You cannot update this task because it is assigned to another contributor."
                            />
                        )}


                        {/* CLOSED WARNING */}

                        {isOwner &&
                            isClosed && (
                                <WarningBox
                                    type="error"
                                    icon={
                                        <ShieldAlert
                                            size={19}
                                        />
                                    }
                                    title="Task is closed"
                                    message="This task cannot be modified."
                                />
                            )}


                        {/* NO TRANSITION WARNING */}

                        {isOwner &&
                            !isClosed &&
                            allowedTransitions.length ===
                                0 && (
                                <WarningBox
                                    type="warning"
                                    icon={
                                        <AlertCircle
                                            size={19}
                                        />
                                    }
                                    title="No status transition available"
                                    message="This status transition is not allowed."
                                />
                            )}

                    </div>

                </div>

            </div>


            {/* STATUS MODAL */}

            {statusModalOpen && (
                <StatusModal
                    task={selectedTask}
                    newStatus={newStatus}
                    setNewStatus={setNewStatus}
                    comment={statusComment}
                    setComment={
                        setStatusComment
                    }
                    allowedStatuses={
                        allowedTransitions
                    }
                    isSaving={isSaving}
                    onCancel={() =>
                        setStatusModalOpen(
                            false
                        )
                    }
                    onSubmit={
                        handleStatusUpdate
                    }
                />
            )}

        </div>
    );
}


// ============================================================
// TASK CARD
// ============================================================

function TaskCard({
    task,
    onOpen,
    onChangeStatus,
}) {
    const allowedTransitions =
        STATUS_TRANSITIONS[
            task.status
        ] || [];

    const isClosed =
        CLOSED_STATUSES.includes(
            task.status
        );

    const isOwner =
        task.assigneeId ===
        CURRENT_CONTRIBUTOR.id;

    const canChange =
        isOwner &&
        !isClosed &&
        allowedTransitions.length > 0;


    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md">

            {/* TOP */}

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


            {/* PROJECT / SPRINT */}

            <div className="mt-5 grid gap-3 sm:grid-cols-2">

                <SmallInfo
                    icon={
                        <FolderKanban
                            size={16}
                        />
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
                        <CalendarDays
                            size={16}
                        />
                    }
                    label="Due Date"
                    value={formatDate(
                        task.dueDate
                    )}
                />

                <SmallInfo
                    icon={
                        <Timer size={16} />
                    }
                    label="Progress"
                    value={`${task.progress}%`}
                />

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
                        className="h-full rounded-full bg-blue-600 transition-all"
                        style={{
                            width: `${task.progress}%`,
                        }}
                    />

                </div>

            </div>


            {/* ACTIONS */}

            <div className="mt-5 flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row">

                <button
                    type="button"
                    onClick={onOpen}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                    View Task
                </button>


                <button
                    type="button"
                    disabled={
                        !canChange
                    }
                    onClick={
                        onChangeStatus
                    }
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                    <RefreshCw
                        size={16}
                    />

                    {isClosed
                        ? "Closed"
                        : canChange
                        ? "Change Status"
                        : !isOwner
                        ? "Not Your Task"
                        : "No Transition"}
                </button>

            </div>

        </div>
    );
}


// ============================================================
// STATUS MODAL
// ============================================================

function StatusModal({
    task,
    newStatus,
    setNewStatus,
    comment,
    setComment,
    allowedStatuses,
    isSaving,
    onCancel,
    onSubmit,
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

            <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">

                {/* HEADER */}

                <div className="flex items-center justify-between border-b border-slate-100 p-5">

                    <div className="flex items-center gap-3">

                        <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                            <RefreshCw
                                size={20}
                            />
                        </div>

                        <div>

                            <h2 className="font-bold text-slate-900">
                                Change Task Status
                            </h2>

                            <p className="text-xs text-slate-500">
                                {task.id} —{" "}
                                {task.title}
                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isSaving}
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed"
                        aria-label="Close"
                    >
                        <X size={19} />
                    </button>

                </div>


                {/* BODY */}

                <div className="space-y-5 p-5">

                    {/* CURRENT STATUS */}

                    <div className="rounded-xl bg-slate-50 p-4">

                        <p className="text-xs font-medium text-slate-400">
                            Current Status
                        </p>

                        <div className="mt-2">

                            <span
                                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                                    task.status
                                )}`}
                            >
                                {task.status}
                            </span>

                        </div>

                    </div>


                    {/* ALLOWED TRANSITIONS */}

                    <div>

                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            New Status
                        </label>

                        <select
                            value={
                                newStatus
                            }
                            onChange={(
                                event
                            ) =>
                                setNewStatus(
                                    event.target
                                        .value
                                )
                            }
                            disabled={
                                isSaving
                            }
                            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                        >

                            {allowedStatuses.map(
                                (
                                    status
                                ) => (
                                    <option
                                        key={
                                            status
                                        }
                                        value={
                                            status
                                        }
                                    >
                                        {
                                            status
                                        }
                                    </option>
                                )
                            )}

                        </select>

                    </div>


                    {/* OPTIONAL COMMENT */}

                    <div>

                        <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">

                            <MessageSquareText
                                size={17}
                            />

                            Comment{" "}
                            <span className="font-normal text-slate-400">
                                (Optional)
                            </span>

                        </label>


                        <textarea
                            value={comment}
                            onChange={(
                                event
                            ) =>
                                setComment(
                                    event.target
                                        .value
                                )
                            }
                            disabled={
                                isSaving
                            }
                            rows={4}
                            maxLength={500}
                            placeholder="Add a comment about this status change..."
                            className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                        />


                        <p className="mt-1 text-right text-xs text-slate-400">
                            {comment.length}/500
                        </p>

                    </div>


                    {/* WORKFLOW NOTE */}

                    <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">

                        <p className="text-xs font-semibold text-blue-700">
                            Allowed workflow
                        </p>

                        <p className="mt-1 text-xs leading-5 text-blue-600">
                            {task.status} →{" "}
                            {allowedStatuses.join(
                                " / "
                            )}
                        </p>

                    </div>

                </div>


                {/* FOOTER */}

                <div className="flex flex-col-reverse gap-2 border-t border-slate-100 p-5 sm:flex-row sm:justify-end">

                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isSaving}
                        className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancel
                    </button>


                    <button
                        type="button"
                        onClick={onSubmit}
                        disabled={
                            isSaving ||
                            !newStatus
                        }
                        className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                    >

                        {isSaving ? (
                            <>
                                <RefreshCw
                                    size={16}
                                    className="animate-spin"
                                />

                                Updating...
                            </>
                        ) : (
                            <>
                                <CheckCircle2
                                    size={16}
                                />

                                Update Status
                            </>
                        )}

                    </button>

                </div>

            </div>

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
// WARNING BOX
// ============================================================

function WarningBox({
    type,
    icon,
    title,
    message,
}) {
    const isError = type === "error";

    return (
        <div
            className={`mt-4 flex items-start gap-3 rounded-xl border p-4 ${
                isError
                    ? "border-red-200 bg-red-50 text-red-700"
                    : "border-amber-200 bg-amber-50 text-amber-700"
            }`}
        >

            <div className="mt-0.5 shrink-0">
                {icon}
            </div>

            <div>

                <p className="text-sm font-semibold">
                    {title}
                </p>

                <p className="mt-1 text-xs leading-5">
                    {message}
                </p>

            </div>

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
        notification.type ===
        "success";

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
                    {
                        notification.message
                    }
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

function EmptyState() {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <RefreshCw
                    size={26}
                />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-slate-800">
                No assigned tasks found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
                There are no tasks matching your search or filter.
            </p>

        </div>
    );
}