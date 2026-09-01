import { useMemo, useState } from "react";
import {
    AlertCircle,
    CalendarDays,
    CheckCircle2,
    CircleUserRound,
    Clock3,
    FileText,
    FolderKanban,
    MessageSquareText,
    RefreshCw,
    Save,
    Timer,
    X,
} from "lucide-react";

// ============================================================
// CONT-TASK-003
// UPDATE TASK PROGRESS
// ============================================================

const CURRENT_CONTRIBUTOR = {
    id: "USER-003",
    name: "Hana Nigussie",
    role: "Contributor",
};

// ============================================================
// ACTIVE TASK STATUSES
// Closed/completed tasks cannot be updated.
// ============================================================

const ACTIVE_TASK_STATUSES = [
    "In Progress",
    "Review",
    "Backlog",
    "To Do",
    "Todo",
    "Ready",
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
        status: "In Progress",
        progress: 25,
        startTime: "2026-08-22T09:30:00",
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
        assigneeId: "USER-004",
        assigneeName: "Team Member",
        priority: "Medium",
        status: "In Progress",
        progress: 50,
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
        startTime: null,
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
        title: "Finalize Authentication Module",
        description:
            "Complete authentication testing and finalize the authentication module.",
        projectId: "PROJ-001",
        projectName: "AI Powered Management System",
        sprintId: "SPRINT-004",
        sprintName: "Sprint 4",
        assigneeId: "USER-003",
        assigneeName: "Hana Nigussie",
        priority: "High",
        status: "Done",
        progress: 100,
        startTime: "2026-08-18T08:30:00",
        dueDate: "2026-08-22",
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

function formatDateTime(date) {
    if (!date) {
        return "Not started";
    }

    return new Date(date).toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function getStatusClasses(status) {
    switch (status) {
        case "In Progress":
            return "bg-blue-100 text-blue-700";

        case "Completed":
        case "Done":
            return "bg-emerald-100 text-emerald-700";

        case "Blocked":
            return "bg-red-100 text-red-700";

        case "Review":
            return "bg-purple-100 text-purple-700";

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
// MAIN COMPONENT
// ============================================================

export default function UpdateTaskProgress() {
    // ========================================================
    // TASK STATE
    // ========================================================

    const [tasks, setTasks] = useState(INITIAL_TASKS);

    const [selectedTask, setSelectedTask] = useState(null);

    // ========================================================
    // SEARCH
    // ========================================================

    const [search, setSearch] = useState("");

    // ========================================================
    // STATUS FILTER
    // ========================================================

    const [statusFilter, setStatusFilter] = useState("All");

    // ========================================================
    // PROGRESS INPUT
    // ========================================================

    const [progress, setProgress] = useState("");

    // ========================================================
    // PROGRESS NOTE
    // ========================================================

    const [progressNote, setProgressNote] = useState("");

    // ========================================================
    // VALIDATION ERROR
    // ========================================================

    const [validationError, setValidationError] = useState("");

    // ========================================================
    // NOTIFICATION
    // ========================================================

    const [notification, setNotification] = useState(null);

    // ========================================================
    // SAVING STATE
    // ========================================================

    const [savingTaskId, setSavingTaskId] = useState(null);

    // ========================================================
    // FILTER ASSIGNED TASKS
    // ========================================================

    const filteredTasks = useMemo(() => {
        const searchValue = search.trim().toLowerCase();

        return tasks.filter((task) => {
            // ------------------------------------------------
            // Only show tasks assigned to current contributor.
            // ------------------------------------------------

            if (
                task.assigneeId !==
                CURRENT_CONTRIBUTOR.id
            ) {
                return false;
            }

            const matchesSearch =
                !searchValue ||
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
                    .includes(searchValue);

            const matchesStatus =
                statusFilter === "All" ||
                task.status === statusFilter;

            return (
                matchesSearch &&
                matchesStatus
            );
        });
    }, [
        tasks,
        search,
        statusFilter,
    ]);

    // ========================================================
    // OPEN TASK
    //
    // USE CASE STEP 1
    // Contributor opens the task.
    // ========================================================

    const openTask = (task) => {
        setSelectedTask(task);

        setProgress(
            String(task.progress)
        );

        setProgressNote("");

        setValidationError("");

        setNotification(null);
    };

    // ========================================================
    // CLOSE TASK
    // ========================================================

    const closeTask = () => {
        setSelectedTask(null);

        setProgress("");

        setProgressNote("");

        setValidationError("");

        setNotification(null);
    };

    // ========================================================
    // OPEN UPDATE PROGRESS
    //
    // USE CASE STEP 2
    // Contributor selects Update Progress.
    // ========================================================

    const openUpdateProgress = (task) => {
        setSelectedTask(task);

        // ----------------------------------------------------
        // STEP 3
        // Display current progress.
        // ----------------------------------------------------

        setProgress(
            String(task.progress)
        );

        setProgressNote("");

        setValidationError("");

        setNotification(null);
    };

    // ========================================================
    // UPDATE PROJECT / SPRINT PROGRESS
    //
    // USE CASE STEP 9
    // ========================================================

    const updateProjectAndSprintProgress = (
        task,
        updatedProgress,
        updatedAt
    ) => {
        const projectUpdate = {
            projectId: task.projectId,
            projectName: task.projectName,
            taskId: task.id,
            taskProgress: updatedProgress,
            updatedAt,
        };

        const sprintUpdate = {
            sprintId: task.sprintId,
            sprintName: task.sprintName,
            taskId: task.id,
            taskProgress: updatedProgress,
            updatedAt,
        };

        // ----------------------------------------------------
        // Temporary local storage.
        //
        // Replace later with:
        //
        // await projectService.updateTaskProgress(...)
        // await sprintService.updateTaskProgress(...)
        // ----------------------------------------------------

        const existingProjectUpdates =
            JSON.parse(
                localStorage.getItem(
                    "aipms_project_progress_updates"
                ) || "[]"
            );

        const existingSprintUpdates =
            JSON.parse(
                localStorage.getItem(
                    "aipms_sprint_progress_updates"
                ) || "[]"
            );

        localStorage.setItem(
            "aipms_project_progress_updates",
            JSON.stringify([
                ...existingProjectUpdates,
                projectUpdate,
            ])
        );

        localStorage.setItem(
            "aipms_sprint_progress_updates",
            JSON.stringify([
                ...existingSprintUpdates,
                sprintUpdate,
            ])
        );
    };

    // ========================================================
    // RECORD ACTIVITY
    //
    // USE CASE STEP 10
    // System records activity.
    //
    // IMPORTANT:
    // We use crypto.randomUUID() inside the event handler,
    // not during component render.
    //
    // This avoids the React purity error caused by Date.now().
    // ========================================================

    const recordProgressActivity = (
        task,
        updatedProgress,
        note,
        updatedAt
    ) => {
        const activity = {
            id:
                typeof crypto !== "undefined" &&
                crypto.randomUUID
                    ? crypto.randomUUID()
                    : `ACT-${Math.random()
                          .toString(36)
                          .slice(2)}`,

            type: "TASK_PROGRESS_UPDATED",

            taskId: task.id,

            taskTitle: task.title,

            projectId: task.projectId,

            projectName: task.projectName,

            sprintId: task.sprintId,

            sprintName: task.sprintName,

            userId:
                CURRENT_CONTRIBUTOR.id,

            userName:
                CURRENT_CONTRIBUTOR.name,

            previousProgress:
                task.progress,

            newProgress:
                updatedProgress,

            progressNote: note.trim(),

            timestamp: updatedAt,

            description: `Task "${task.title}" progress was updated from ${task.progress}% to ${updatedProgress}%.`,
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

    // ========================================================
    // NOTIFY RELEVANT USERS
    //
    // USE CASE STEP 11
    // Relevant users are notified when necessary.
    // ========================================================

    const notifyRelevantUsers = (
        task,
        updatedProgress,
        note,
        updatedAt
    ) => {
        const notificationRecord = {
            id:
                typeof crypto !== "undefined" &&
                crypto.randomUUID
                    ? crypto.randomUUID()
                    : `NOTIF-${Math.random()
                          .toString(36)
                          .slice(2)}`,

            type:
                "TASK_PROGRESS_UPDATED",

            taskId: task.id,

            taskTitle: task.title,

            projectId: task.projectId,

            projectName:
                task.projectName,

            sprintId: task.sprintId,

            sprintName:
                task.sprintName,

            contributorId:
                CURRENT_CONTRIBUTOR.id,

            contributorName:
                CURRENT_CONTRIBUTOR.name,

            progress:
                updatedProgress,

            note: note.trim(),

            createdAt: updatedAt,

            message: `${CURRENT_CONTRIBUTOR.name} updated "${task.title}" progress to ${updatedProgress}%.`,
        };

        const existingNotifications =
            JSON.parse(
                localStorage.getItem(
                    "aipms_notifications"
                ) || "[]"
            );

        localStorage.setItem(
            "aipms_notifications",
            JSON.stringify([
                ...existingNotifications,
                notificationRecord,
            ])
        );

        return notificationRecord;
    };

    // ========================================================
    // HANDLE PROGRESS UPDATE
    //
    // CONT-TASK-003
    //
    // MAIN SUCCESS SCENARIO:
    //
    // 1. Open task
    // 2. Select Update Progress
    // 3. Display current progress
    // 4. Enter updated progress
    // 5. Add optional note
    // 6. Submit
    // 7. Validate
    // 8. Save progress
    // 9. Update project/sprint
    // 10. Record activity
    // 11. Notify relevant users
    // ========================================================

    const handleUpdateProgress = async () => {
        // ----------------------------------------------------
        // Make sure a task is selected.
        // ----------------------------------------------------

        if (!selectedTask) {
            return;
        }

        // ----------------------------------------------------
        // Validate assignment.
        // ----------------------------------------------------

        if (
            selectedTask.assigneeId !==
            CURRENT_CONTRIBUTOR.id
        ) {
            setNotification({
                type: "error",
                message:
                    "You cannot update this task.",
            });

            return;
        }

        // ----------------------------------------------------
        // A2
        // Closed tasks cannot be updated.
        // ----------------------------------------------------

        const isClosedTask =
            selectedTask.status ===
                "Done" ||
            selectedTask.status ===
                "Completed" ||
            selectedTask.status ===
                "Closed";

        if (isClosedTask) {
            setValidationError(
                "Closed tasks cannot be updated."
            );

            setNotification({
                type: "error",
                message:
                    "Closed tasks cannot be updated.",
            });

            return;
        }

        // ----------------------------------------------------
        // STEP 7
        // Validate progress.
        // ----------------------------------------------------

        const progressValue =
            Number(progress);

        if (
            progress === "" ||
            !Number.isFinite(
                progressValue
            ) ||
            progressValue < 0 ||
            progressValue > 100
        ) {
            setValidationError(
                "Progress must be between 0% and 100%."
            );

            return;
        }

        // ----------------------------------------------------
        // Only allow whole-number percentage.
        // ----------------------------------------------------

        if (
            !Number.isInteger(
                progressValue
            )
        ) {
            setValidationError(
                "Progress must be a whole number between 0% and 100%."
            );

            return;
        }

        // ----------------------------------------------------
        // Clear previous validation.
        // ----------------------------------------------------

        setValidationError("");

        try {
            setSavingTaskId(
                selectedTask.id
            );

            // ------------------------------------------------
            // STEP 8
            // Save progress.
            //
            // Event-handler timestamp is safe.
            // ------------------------------------------------

            const updatedAt =
                new Date().toISOString();

            const updatedTask = {
                ...selectedTask,

                progress:
                    progressValue,

                progressNote:
                    progressNote.trim(),

                updatedAt,
            };

            // ------------------------------------------------
            // If progress reaches 100%, mark completed.
            //
            // This keeps task state consistent.
            // ------------------------------------------------

            if (
                progressValue === 100
            ) {
                updatedTask.status =
                    "Completed";
            }

            // ------------------------------------------------
            // Update local task state.
            // ------------------------------------------------

            setTasks(
                (previousTasks) =>
                    previousTasks.map(
                        (task) =>
                            task.id ===
                            selectedTask.id
                                ? updatedTask
                                : task
                    )
            );

            // ------------------------------------------------
            // STEP 9
            // Update project/sprint progress.
            // ------------------------------------------------

            updateProjectAndSprintProgress(
                selectedTask,
                progressValue,
                updatedAt
            );

            // ------------------------------------------------
            // STEP 10
            // Record activity.
            // ------------------------------------------------

            recordProgressActivity(
                selectedTask,
                progressValue,
                progressNote,
                updatedAt
            );

            // ------------------------------------------------
            // STEP 11
            // Notify relevant users.
            // ------------------------------------------------

            notifyRelevantUsers(
                selectedTask,
                progressValue,
                progressNote,
                updatedAt
            );

            // ------------------------------------------------
            // Simulate backend request.
            //
            // Later replace with:
            //
            // await taskService.updateProgress(
            //     selectedTask.id,
            //     progressValue,
            //     progressNote
            // );
            // ------------------------------------------------

            await new Promise(
                (resolve) =>
                    setTimeout(
                        resolve,
                        500
                    )
            );

            // ------------------------------------------------
            // Update selected task.
            // ------------------------------------------------

            setSelectedTask(
                updatedTask
            );

            // ------------------------------------------------
            // Clear note after successful save.
            // ------------------------------------------------

            setProgressNote("");

            // ------------------------------------------------
            // Success notification.
            // ------------------------------------------------

            setNotification({
                type: "success",
                message:
                    "Task progress updated successfully.",
            });
        } catch (error) {
            console.error(
                "Unable to update task progress:",
                error
            );

            setNotification({
                type: "error",
                message:
                    "Unable to update task progress. Please try again.",
            });
        } finally {
            setSavingTaskId(null);
        }
    };

    // ========================================================
    // TASK LIST VIEW
    // ========================================================

    if (!selectedTask) {
        return (
            <div className="min-h-screen bg-slate-50 p-6">
                <div className="mx-auto max-w-7xl">

                    {/* HEADER */}

                    <div className="mb-6">
                        <div className="flex items-center gap-3">

                            <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
                                <RefreshCw
                                    size={25}
                                />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">
                                    Update Task Progress
                                </h1>

                                <p className="text-sm text-slate-500">
                                    Keep your assigned task progress up to date.
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

                    {/* SEARCH / FILTER */}

                    <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                        <div className="flex flex-col gap-3 md:flex-row">

                            <input
                                type="text"
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
                                placeholder="Search assigned tasks..."
                                className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
                            >
                                <option value="All">
                                    All Statuses
                                </option>

                                <option value="In Progress">
                                    In Progress
                                </option>

                                <option value="Backlog">
                                    Backlog
                                </option>

                                <option value="To Do">
                                    To Do
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

                    {/* CONTRIBUTOR */}

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
                                    {
                                        CURRENT_CONTRIBUTOR.name
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* TASKS */}

                    {filteredTasks.length ===
                    0 ? (
                        <EmptyTasks />
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
                                        onUpdate={() =>
                                            openUpdateProgress(
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
    // TASK DETAIL / UPDATE VIEW
    // ========================================================

    const taskIsAssigned =
        selectedTask.assigneeId ===
        CURRENT_CONTRIBUTOR.id;

    const isClosedTask =
        selectedTask.status ===
            "Done" ||
        selectedTask.status ===
            "Completed" ||
        selectedTask.status ===
            "Closed";

    const taskIsActive =
        ACTIVE_TASK_STATUSES.includes(
            selectedTask.status
        );

    const canUpdate =
        taskIsAssigned &&
        !isClosedTask &&
        taskIsActive;

    return (
        <div className="min-h-screen bg-slate-50 p-6">

            <div className="mx-auto max-w-5xl">

                {/* TOP */}

                <div className="mb-6 flex items-center justify-between gap-4">

                    <button
                        type="button"
                        onClick={
                            closeTask
                        }
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
                        {
                            selectedTask.status
                        }
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

                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

                    {/* TASK HEADER */}

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

                    {/* INFORMATION */}

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
                                <Timer
                                    size={18}
                                />
                            }
                            label="Start Time"
                            value={formatDateTime(
                                selectedTask.startTime
                            )}
                        />

                        <InfoCard
                            icon={
                                <Clock3
                                    size={18}
                                />
                            }
                            label="Current Progress"
                            value={`${selectedTask.progress}%`}
                        />
                    </div>

                    {/* CURRENT PROGRESS */}

                    <div className="border-b border-slate-100 p-6">

                        <div className="mb-2 flex items-center justify-between">

                            <span className="text-sm font-semibold text-slate-700">
                                Current Task Progress
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

                    {/* UPDATE SECTION */}

                    <div className="p-6">

                        <div
                            className={`rounded-2xl border p-6 ${
                                canUpdate
                                    ? "border-blue-100 bg-blue-50"
                                    : "border-slate-200 bg-slate-50"
                            }`}
                        >

                            <div className="mb-6 flex items-start gap-3">

                                <div
                                    className={`rounded-xl p-3 ${
                                        canUpdate
                                            ? "bg-blue-100 text-blue-600"
                                            : "bg-slate-200 text-slate-500"
                                    }`}
                                >
                                    <RefreshCw
                                        size={22}
                                    />
                                </div>

                                <div>

                                    <h2 className="font-bold text-slate-900">
                                        Update Progress
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Enter the latest completion percentage for this task.
                                    </p>
                                </div>
                            </div>

                            {/* VALIDATION ERROR */}

                            {validationError && (
                                <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">

                                    <AlertCircle
                                        size={19}
                                        className="mt-0.5 shrink-0"
                                    />

                                    <div>

                                        <p className="text-sm font-semibold">
                                            Invalid progress
                                        </p>

                                        <p className="mt-1 text-xs">
                                            {
                                                validationError
                                            }
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* PROGRESS INPUT */}

                            <div className="mb-5">

                                <label
                                    htmlFor="task-progress"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Updated Progress
                                </label>

                                <div className="relative">

                                    <input
                                        id="task-progress"
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="1"
                                        value={
                                            progress
                                        }
                                        disabled={
                                            !canUpdate ||
                                            savingTaskId ===
                                                selectedTask.id
                                        }
                                        onChange={(
                                            event
                                        ) => {
                                            setProgress(
                                                event
                                                    .target
                                                    .value
                                            );

                                            setValidationError(
                                                ""
                                            );
                                        }}
                                        placeholder="Enter progress percentage"
                                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-12 text-sm font-medium outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                                    />

                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                                        %
                                    </span>
                                </div>

                                <p className="mt-2 text-xs text-slate-400">
                                    Enter a value from 0% to
                                    100%.
                                </p>
                            </div>

                            {/* PROGRESS PREVIEW */}

                            <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4">

                                <div className="mb-2 flex items-center justify-between">

                                    <span className="text-xs font-medium text-slate-500">
                                        Updated Progress Preview
                                    </span>

                                    <span className="text-sm font-bold text-blue-600">
                                        {progress ===
                                        ""
                                            ? "0"
                                            : progress}
                                        %
                                    </span>
                                </div>

                                <div className="h-3 overflow-hidden rounded-full bg-slate-100">

                                    <div
                                        className="h-full rounded-full bg-blue-600 transition-all duration-300"
                                        style={{
                                            width: `${Math.min(
                                                Math.max(
                                                    Number(
                                                        progress
                                                    ) ||
                                                        0,
                                                    0
                                                ),
                                                100
                                            )}%`,
                                        }}
                                    />
                                </div>
                            </div>

                            {/* NOTE */}

                            <div className="mb-6">

                                <label
                                    htmlFor="progress-note"
                                    className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"
                                >
                                    <MessageSquareText
                                        size={17}
                                    />
                                    Progress Note
                                    <span className="font-normal text-slate-400">
                                        (Optional)
                                    </span>
                                </label>

                                <textarea
                                    id="progress-note"
                                    rows="4"
                                    value={
                                        progressNote
                                    }
                                    disabled={
                                        !canUpdate ||
                                        savingTaskId ===
                                            selectedTask.id
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setProgressNote(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    placeholder="Add a note about the work completed, remaining work, blockers, or other progress information..."
                                    className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                                />

                                <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                                    <FileText
                                        size={14}
                                    />
                                    This note will be included in the task activity.
                                </div>
                            </div>

                            {/* SUBMIT */}

                            <button
                                type="button"
                                disabled={
                                    !canUpdate ||
                                    savingTaskId ===
                                        selectedTask.id
                                }
                                onClick={
                                    handleUpdateProgress
                                }
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                            >
                                {savingTaskId ===
                                selectedTask.id ? (
                                    <>
                                        <RefreshCw
                                            size={17}
                                            className="animate-spin"
                                        />
                                        Saving Progress...
                                    </>
                                ) : (
                                    <>
                                        <Save
                                            size={17}
                                        />
                                        Update Progress
                                    </>
                                )}
                            </button>
                        </div>

                        {/* CLOSED TASK */}

                        {isClosedTask && (
                            <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">

                                <AlertCircle
                                    size={19}
                                    className="mt-0.5 shrink-0"
                                />

                                <div>

                                    <p className="text-sm font-semibold">
                                        Task is closed
                                    </p>

                                    <p className="mt-1 text-xs leading-5">
                                        Closed tasks cannot be updated.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* ASSIGNMENT WARNING */}

                        {!taskIsAssigned && (
                            <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">

                                <AlertCircle
                                    size={19}
                                    className="mt-0.5 shrink-0"
                                />

                                <div>

                                    <p className="text-sm font-semibold">
                                        Task assignment required
                                    </p>

                                    <p className="mt-1 text-xs leading-5">
                                        This task is assigned to another contributor.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* INACTIVE WARNING */}

                        {taskIsAssigned &&
                            !isClosedTask &&
                            !taskIsActive && (
                                <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-700">

                                    <AlertCircle
                                        size={19}
                                        className="mt-0.5 shrink-0"
                                    />

                                    <div>

                                        <p className="text-sm font-semibold">
                                            Task is not active
                                        </p>

                                        <p className="mt-1 text-xs leading-5">
                                            This task cannot currently be updated because its status is{" "}
                                            <strong>
                                                {
                                                    selectedTask.status
                                                }
                                            </strong>
                                            .
                                        </p>
                                    </div>
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================================
// TASK CARD
// ============================================================

function TaskCard({
    task,
    onOpen,
    onUpdate,
}) {
    const isClosed =
        task.status === "Done" ||
        task.status === "Completed" ||
        task.status === "Closed";

    const isActive =
        ACTIVE_TASK_STATUSES.includes(
            task.status
        );

    const canUpdate =
        task.assigneeId ===
            CURRENT_CONTRIBUTOR.id &&
        !isClosed &&
        isActive;

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
                        !canUpdate
                    }
                    onClick={onUpdate}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                    <RefreshCw
                        size={16}
                    />

                    {isClosed
                        ? "Closed"
                        : canUpdate
                        ? "Update Progress"
                        : "Unavailable"}
                </button>
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
// EMPTY TASKS
// ============================================================

function EmptyTasks() {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <FileText
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