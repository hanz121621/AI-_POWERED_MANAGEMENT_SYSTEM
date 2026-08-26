import { useMemo, useState } from "react";
import {
    AlertCircle,
    CheckCircle2,
    CircleUserRound,
    FileText,
    FolderKanban,
    Link2,
    MessageSquareWarning,
    Paperclip,
    Send,
    ShieldAlert,
    UsersRound,
    X,
} from "lucide-react";

// ============================================================
// CONT-TASK-007
// REPORT BLOCKED TASK
// ============================================================
//
// Primary Actor: Contributor
//
// Goal:
// Allow a Contributor to identify a task that cannot continue
// because of a dependency, missing information, technical issue,
// or another blocker.
//
// Main Success Scenario:
// 1. Open task
// 2. Select Report Blocker
// 3. Display blocker form
// 4. Provide blocker information
// 5. Submit blocker
// 6. Validate information
// 7. Change task status to Blocked
// 8. Notify Team Leader
// 9. Notify Manager when escalation is necessary
// 10. Record blocker
//
// Alternative Flows:
// A1. Missing blocker information
//     "Please describe the blocker."
//
// A2. Blocker submission fails
//     "Unable to report blocker."
//
// Postconditions:
// - Task is marked Blocked where appropriate
// - Team Leader is notified
// - Blocker is stored in task history
// ============================================================

// ============================================================
// CURRENT CONTRIBUTOR
// ============================================================

const CURRENT_CONTRIBUTOR = {
    id: "USER-003",
    name: "Hana Nigussie",
    role: "Contributor",
};

// ============================================================
// MOCK ASSIGNED TASKS
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
        progress: 35,
        dueDate: "2026-08-30",
    },
    {
        id: "TASK-002",
        title: "Implement Project Participation",
        description:
            "Implement the contributor project participation page and project-related functionality.",
        projectId: "PROJ-001",
        projectName: "AI Powered Management System",
        sprintId: "SPRINT-004",
        sprintName: "Sprint 4",
        assigneeId: "USER-003",
        assigneeName: "Hana Nigussie",
        priority: "High",
        status: "In Progress",
        progress: 50,
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
        progress: 85,
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
        status: "In Progress",
        progress: 20,
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
        status: "In Progress",
        progress: 40,
        dueDate: "2026-09-10",
    },
    {
        id: "TASK-006",
        title: "API Authentication Integration",
        description:
            "Connect the frontend authentication flow with the backend authentication API.",
        projectId: "PROJ-001",
        projectName: "AI Powered Management System",
        sprintId: "SPRINT-004",
        sprintName: "Sprint 4",
        assigneeId: "USER-004",
        assigneeName: "Team Member",
        priority: "High",
        status: "In Progress",
        progress: 30,
        dueDate: "2026-08-29",
    },
];

// ============================================================
// BLOCKER IMPACT OPTIONS
// ============================================================

const IMPACT_OPTIONS = [
    {
        value: "Low",
        label: "Low",
        description:
            "Minor impact. Work can continue with a small delay.",
    },
    {
        value: "Medium",
        label: "Medium",
        description:
            "Work is partially affected and may be delayed.",
    },
    {
        value: "High",
        label: "High",
        description:
            "Work cannot continue normally.",
    },
    {
        value: "Critical",
        label: "Critical",
        description:
            "Project delivery may be seriously affected.",
    },
];

// ============================================================
// RELATED DEPENDENCY OPTIONS
// ============================================================

const DEPENDENCY_OPTIONS = [
    "None",
    "TASK-001",
    "TASK-002",
    "TASK-003",
    "TASK-004",
    "TASK-005",
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
        return "Not available";
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
        case "Blocked":
            return "bg-red-100 text-red-700";

        case "In Progress":
            return "bg-blue-100 text-blue-700";

        case "Review":
            return "bg-purple-100 text-purple-700";

        case "Done":
        case "Completed":
            return "bg-emerald-100 text-emerald-700";

        case "Backlog":
        case "To Do":
        case "Todo":
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

function getImpactClasses(impact) {
    switch (impact) {
        case "Critical":
            return "border-red-300 bg-red-50 text-red-700";

        case "High":
            return "border-orange-300 bg-orange-50 text-orange-700";

        case "Medium":
            return "border-amber-300 bg-amber-50 text-amber-700";

        case "Low":
            return "border-emerald-300 bg-emerald-50 text-emerald-700";

        default:
            return "border-slate-200 bg-slate-50 text-slate-700";
    }
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function ReportTaskIssue() {
    // ----------------------------------------------------------
    // TASK STATE
    // ----------------------------------------------------------

    const [tasks, setTasks] = useState(INITIAL_TASKS);

    const [selectedTask, setSelectedTask] = useState(null);

    // ----------------------------------------------------------
    // SEARCH
    // ----------------------------------------------------------

    const [search, setSearch] = useState("");

    // ----------------------------------------------------------
    // STATUS FILTER
    // ----------------------------------------------------------

    const [statusFilter, setStatusFilter] = useState("All");

    // ----------------------------------------------------------
    // NOTIFICATION
    // ----------------------------------------------------------

    const [notification, setNotification] = useState(null);

    // ----------------------------------------------------------
    // SUBMITTING STATE
    // ----------------------------------------------------------

    const [submitting, setSubmitting] = useState(false);

    // ----------------------------------------------------------
    // BLOCKER FORM
    // ----------------------------------------------------------

    const [blockerDescription, setBlockerDescription] =
        useState("");

    const [impact, setImpact] = useState("Medium");

    const [relatedDependency, setRelatedDependency] =
        useState("None");

    const [assistanceRequired, setAssistanceRequired] =
        useState("");

    const [attachment, setAttachment] = useState(null);

    // ============================================================
    // FILTER TASKS
    // ============================================================

    const filteredTasks = useMemo(() => {
        const searchValue = search.trim().toLowerCase();

        return tasks.filter((task) => {
            const assignedToContributor =
                task.assigneeId === CURRENT_CONTRIBUTOR.id;

            if (!assignedToContributor) {
                return false;
            }

            const matchesSearch =
                !searchValue ||
                task.id.toLowerCase().includes(searchValue) ||
                task.title.toLowerCase().includes(searchValue) ||
                task.projectName
                    .toLowerCase()
                    .includes(searchValue) ||
                task.sprintName
                    .toLowerCase()
                    .includes(searchValue);

            const matchesStatus =
                statusFilter === "All" ||
                task.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [tasks, search, statusFilter]);

    // ============================================================
    // RESET FORM
    // ============================================================

    const resetForm = () => {
        setBlockerDescription("");
        setImpact("Medium");
        setRelatedDependency("None");
        setAssistanceRequired("");
        setAttachment(null);
        setNotification(null);
    };

    // ============================================================
    // OPEN TASK
    //
    // MAIN SUCCESS SCENARIO - STEP 1
    // ============================================================

    const openTask = (task) => {
        setSelectedTask(task);
        resetForm();
    };

    // ============================================================
    // CLOSE TASK
    // ============================================================

    const closeTask = () => {
        setSelectedTask(null);
        resetForm();
    };

    // ============================================================
    // HANDLE FILE
    //
    // STEP 4:
    // Contributor may provide optional attachment.
    // ============================================================

    const handleAttachmentChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            setAttachment(null);
            return;
        }

        setAttachment(file);
    };

    // ============================================================
    // VALIDATE ATTACHMENT
    // ============================================================

    const validateAttachment = () => {
        if (!attachment) {
            return {
                valid: true,
            };
        }

        // --------------------------------------------------------
        // Allowed file types
        // --------------------------------------------------------

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "text/plain",
            "text/csv",
            "application/zip",
        ];

        if (!allowedTypes.includes(attachment.type)) {
            return {
                valid: false,
                message:
                    "This file type is not allowed.",
            };
        }

        // --------------------------------------------------------
        // Maximum file size: 10 MB
        // --------------------------------------------------------

        const maxSize = 10 * 1024 * 1024;

        if (attachment.size > maxSize) {
            return {
                valid: false,
                message:
                    "File exceeds the allowed size.",
            };
        }

        return {
            valid: true,
        };
    };

    // ============================================================
    // RECORD BLOCKER
    //
    // MAIN SUCCESS SCENARIO - STEP 10
    // ============================================================

    const recordBlocker = (
        task,
        blocker,
        timestamp
    ) => {
        const blockerRecord = {
            id: `BLOCKER-${crypto.randomUUID()}`,

            type: "TASK_BLOCKER_REPORTED",

            taskId: task.id,

            taskTitle: task.title,

            projectId: task.projectId,

            projectName: task.projectName,

            sprintId: task.sprintId,

            sprintName: task.sprintName,

            contributorId: CURRENT_CONTRIBUTOR.id,

            contributorName:
                CURRENT_CONTRIBUTOR.name,

            description:
                blocker.description,

            impact: blocker.impact,

            relatedDependency:
                blocker.relatedDependency,

            assistanceRequired:
                blocker.assistanceRequired,

            attachmentName:
                blocker.attachmentName,

            status: "Open",

            timestamp,

            activityDescription:
                `Contributor reported a blocker for task "${task.title}".`,
        };

        // --------------------------------------------------------
        // Temporary local storage.
        //
        // Replace later with:
        //
        // await taskService.reportBlocker(...)
        // --------------------------------------------------------

        const existingBlockers = JSON.parse(
            localStorage.getItem(
                "aipms_task_blockers"
            ) || "[]"
        );

        localStorage.setItem(
            "aipms_task_blockers",
            JSON.stringify([
                ...existingBlockers,
                blockerRecord,
            ])
        );

        return blockerRecord;
    };

    // ============================================================
    // NOTIFY TEAM LEADER
    //
    // MAIN SUCCESS SCENARIO - STEP 8
    // ============================================================

    const notifyTeamLeader = (
        task,
        blocker,
        timestamp
    ) => {
        const notificationRecord = {
            id: `NOTIFY-${crypto.randomUUID()}`,

            recipientRole: "Team Leader",

            recipientId: "TEAM-LEADER-001",

            type: "TASK_BLOCKED",

            taskId: task.id,

            taskTitle: task.title,

            projectId: task.projectId,

            projectName: task.projectName,

            impact: blocker.impact,

            message:
                `Task "${task.title}" has been reported as blocked.`,

            createdBy:
                CURRENT_CONTRIBUTOR.name,

            timestamp,

            read: false,
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

    // ============================================================
    // NOTIFY MANAGER
    //
    // MAIN SUCCESS SCENARIO - STEP 9
    //
    // Manager is notified when escalation is necessary.
    //
    // Escalation rule:
    // Critical or High impact.
    // ============================================================

    const notifyManagerIfNecessary = (
        task,
        blocker,
        timestamp
    ) => {
        const escalationRequired =
            blocker.impact === "Critical" ||
            blocker.impact === "High";

        if (!escalationRequired) {
            return null;
        }

        const notificationRecord = {
            id: `NOTIFY-${crypto.randomUUID()}`,

            recipientRole: "Manager",

            recipientId: "MANAGER-001",

            type: "TASK_BLOCKER_ESCALATED",

            taskId: task.id,

            taskTitle: task.title,

            projectId: task.projectId,

            projectName: task.projectName,

            impact: blocker.impact,

            message:
                `Task "${task.title}" requires escalation because of a ${blocker.impact.toLowerCase()} impact blocker.`,

            createdBy:
                CURRENT_CONTRIBUTOR.name,

            timestamp,

            read: false,

            escalationRequired: true,
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

    // ============================================================
    // UPDATE PROJECT / SPRINT
    //
    // MAIN SUCCESS SCENARIO:
    // Task status becomes Blocked.
    // ============================================================

    const updateProjectAndSprintProgress = (
        task,
        timestamp
    ) => {
        const projectUpdate = {
            id: `PROJECT-UPDATE-${crypto.randomUUID()}`,

            projectId: task.projectId,

            projectName: task.projectName,

            taskId: task.id,

            taskStatus: "Blocked",

            taskProgress: task.progress,

            reason: "TASK_BLOCKED",

            updatedBy:
                CURRENT_CONTRIBUTOR.id,

            updatedAt: timestamp,
        };

        const sprintUpdate = {
            id: `SPRINT-UPDATE-${crypto.randomUUID()}`,

            sprintId: task.sprintId,

            sprintName: task.sprintName,

            taskId: task.id,

            taskStatus: "Blocked",

            taskProgress: task.progress,

            reason: "TASK_BLOCKED",

            updatedBy:
                CURRENT_CONTRIBUTOR.id,

            updatedAt: timestamp,
        };

        const projectUpdates =
            JSON.parse(
                localStorage.getItem(
                    "aipms_project_task_updates"
                ) || "[]"
            );

        const sprintUpdates =
            JSON.parse(
                localStorage.getItem(
                    "aipms_sprint_task_updates"
                ) || "[]"
            );

        localStorage.setItem(
            "aipms_project_task_updates",
            JSON.stringify([
                ...projectUpdates,
                projectUpdate,
            ])
        );

        localStorage.setItem(
            "aipms_sprint_task_updates",
            JSON.stringify([
                ...sprintUpdates,
                sprintUpdate,
            ])
        );
    };

    // ============================================================
    // REPORT BLOCKER
    //
    // CONT-TASK-007
    //
    // ============================================================

    const handleReportBlocker = async (event) => {
        event.preventDefault();

        if (!selectedTask) {
            return;
        }

        // ========================================================
        // ASSIGNMENT VALIDATION
        // ========================================================

        if (
            selectedTask.assigneeId !==
            CURRENT_CONTRIBUTOR.id
        ) {
            setNotification({
                type: "error",
                message:
                    "You cannot report a blocker for this task.",
            });

            return;
        }

        // ========================================================
        // A1
        //
        // Missing blocker information
        // ========================================================

        if (!blockerDescription.trim()) {
            setNotification({
                type: "error",
                message:
                    "Please describe the blocker.",
            });

            return;
        }

        // ========================================================
        // TASK STATUS VALIDATION
        //
        // Closed tasks should not be modified.
        // ========================================================

        const closedStatuses = [
            "Done",
            "Completed",
            "Closed",
        ];

        if (
            closedStatuses.includes(
                selectedTask.status
            )
        ) {
            setNotification({
                type: "error",
                message:
                    "This task cannot be modified.",
            });

            return;
        }

        // ========================================================
        // FILE VALIDATION
        // ========================================================

        const attachmentValidation =
            validateAttachment();

        if (!attachmentValidation.valid) {
            setNotification({
                type: "error",
                message:
                    attachmentValidation.message,
            });

            return;
        }

        try {
            setSubmitting(true);
            setNotification(null);

            // ====================================================
            // STEP 4
            // Collect blocker information.
            // ====================================================

            const timestamp =
                new Date().toISOString();

            const blockerData = {
                description:
                    blockerDescription.trim(),

                impact,

                relatedDependency,

                assistanceRequired:
                    assistanceRequired.trim(),

                attachmentName:
                    attachment?.name || null,
            };

            // ====================================================
            // STEP 6
            // Validation completed.
            // ====================================================

            // ====================================================
            // STEP 7
            // Change task status to Blocked.
            // ====================================================

            const updatedTask = {
                ...selectedTask,

                status: "Blocked",

                blockedAt: timestamp,

                blockerImpact: impact,

                blockerDescription:
                    blockerDescription.trim(),

                relatedDependency,

                assistanceRequired:
                    assistanceRequired.trim(),
            };

            setTasks((previousTasks) =>
                previousTasks.map((task) =>
                    task.id === selectedTask.id
                        ? updatedTask
                        : task
                )
            );

            // ====================================================
            // STEP 8
            // Notify Team Leader.
            // ====================================================

            notifyTeamLeader(
                selectedTask,
                blockerData,
                timestamp
            );

            // ====================================================
            // STEP 9
            // Notify Manager if escalation is necessary.
            // ====================================================

            notifyManagerIfNecessary(
                selectedTask,
                blockerData,
                timestamp
            );

            // ====================================================
            // UPDATE PROJECT / SPRINT
            // ====================================================

            updateProjectAndSprintProgress(
                selectedTask,
                timestamp
            );

            // ====================================================
            // STEP 10
            // Record blocker.
            // ====================================================

            recordBlocker(
                selectedTask,
                blockerData,
                timestamp
            );

            // ====================================================
            // Simulate backend request.
            //
            // Replace later with:
            //
            // await taskService.reportBlocker(...)
            // ====================================================

            await new Promise((resolve) =>
                setTimeout(resolve, 500)
            );

            // ====================================================
            // Update selected task.
            // ====================================================

            setSelectedTask(updatedTask);

            // ====================================================
            // SUCCESS
            // ====================================================

            setNotification({
                type: "success",
                message:
                    "Task blocker reported successfully.",
            });

            // ====================================================
            // Clear form after successful submission.
            // ====================================================

            setBlockerDescription("");
            setImpact("Medium");
            setRelatedDependency("None");
            setAssistanceRequired("");
            setAttachment(null);
        } catch (error) {
            console.error(
                "Unable to report blocker:",
                error
            );

            // ====================================================
            // A2
            // ====================================================

            setNotification({
                type: "error",
                message:
                    "Unable to report blocker.",
            });
        } finally {
            setSubmitting(false);
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
                            <div className="rounded-xl bg-red-100 p-3 text-red-700">
                                <MessageSquareWarning
                                    size={25}
                                />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">
                                    Report Blocked Task
                                </h1>

                                <p className="text-sm text-slate-500">
                                    Report a blocker affecting your
                                    assigned task.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* NOTIFICATION */}
                    {notification && (
                        <Notification
                            notification={notification}
                            onClose={() =>
                                setNotification(null)
                            }
                        />
                    )}

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
                                value={statusFilter}
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

                    {/* TASKS */}
                    {filteredTasks.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <div className="grid gap-5 lg:grid-cols-2">
                            {filteredTasks.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onOpen={() =>
                                        openTask(task)
                                    }
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // ============================================================
    // DETAIL / BLOCKER FORM
    // ============================================================

    const isAssigned =
        selectedTask.assigneeId ===
        CURRENT_CONTRIBUTOR.id;

    const isClosed =
        ["Done", "Completed", "Closed"].includes(
            selectedTask.status
        );

    const canReport =
        isAssigned && !isClosed;

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
                        notification={notification}
                        onClose={() =>
                            setNotification(null)
                        }
                    />
                )}

                {/* TASK INFORMATION */}
                <div className="mb-6 rounded-2xl border border-slate-200 bg-white shadow-sm">

                    {/* TASK HEADER */}
                    <div className="border-b border-slate-100 p-6">
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div>
                                <p className="text-xs font-semibold text-blue-600">
                                    {selectedTask.id}
                                </p>

                                <h1 className="mt-1 text-2xl font-bold text-slate-900">
                                    {selectedTask.title}
                                </h1>

                                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
                                    {selectedTask.description}
                                </p>
                            </div>

                            <span
                                className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${getPriorityClasses(
                                    selectedTask.priority
                                )}`}
                            >
                                {selectedTask.priority} Priority
                            </span>
                        </div>
                    </div>

                    {/* TASK DETAILS */}
                    <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">

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
                                <Link2 size={18} />
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
                                <FileText size={18} />
                            }
                            label="Due Date"
                            value={formatDate(
                                selectedTask.dueDate
                            )}
                        />

                        <InfoCard
                            icon={
                                <MessageSquareWarning
                                    size={18}
                                />
                            }
                            label="Current Status"
                            value={
                                selectedTask.status
                            }
                        />

                        <InfoCard
                            icon={
                                <AlertCircle
                                    size={18}
                                />
                            }
                            label="Progress"
                            value={`${selectedTask.progress}%`}
                        />
                    </div>
                </div>

                {/* ASSIGNMENT WARNING */}
                {!isAssigned && (
                    <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
                        <ShieldAlert
                            size={20}
                            className="mt-0.5 shrink-0"
                        />

                        <div>
                            <p className="font-semibold">
                                Task assignment required
                            </p>

                            <p className="mt-1 text-sm">
                                You cannot report a blocker for
                                this task because it is assigned
                                to another contributor.
                            </p>
                        </div>
                    </div>
                )}

                {/* CLOSED TASK WARNING */}
                {isAssigned && isClosed && (
                    <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-700">
                        <AlertCircle
                            size={20}
                            className="mt-0.5 shrink-0"
                        />

                        <div>
                            <p className="font-semibold">
                                Task is closed
                            </p>

                            <p className="mt-1 text-sm">
                                This task cannot be modified.
                            </p>
                        </div>
                    </div>
                )}

                {/* BLOCKER FORM */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

                    {/* FORM HEADER */}
                    <div className="border-b border-slate-100 p-6">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-red-100 p-3 text-red-600">
                                <MessageSquareWarning
                                    size={22}
                                />
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-slate-900">
                                    Report Blocker
                                </h2>

                                <p className="text-sm text-slate-500">
                                    Tell your team what is preventing
                                    this task from continuing.
                                </p>
                            </div>
                        </div>
                    </div>

                    <form
                        onSubmit={handleReportBlocker}
                        className="p-6"
                    >
                        {/* BLOCKER DESCRIPTION */}
                        <div className="mb-6">
                            <label
                                htmlFor="blocker-description"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                Blocker Description
                                <span className="ml-1 text-red-500">
                                    *
                                </span>
                            </label>

                            <textarea
                                id="blocker-description"
                                value={
                                    blockerDescription
                                }
                                onChange={(event) =>
                                    setBlockerDescription(
                                        event.target.value
                                    )
                                }
                                disabled={!canReport || submitting}
                                rows={5}
                                placeholder="Describe what is preventing you from continuing this task..."
                                className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                            />

                            <div className="mt-1 flex justify-between">
                                <p className="text-xs text-slate-400">
                                    Clearly explain the problem.
                                </p>

                                <p className="text-xs text-slate-400">
                                    {
                                        blockerDescription.length
                                    }{" "}
                                    characters
                                </p>
                            </div>
                        </div>

                        {/* IMPACT */}
                        <div className="mb-6">
                            <label className="mb-3 block text-sm font-semibold text-slate-700">
                                Impact
                                <span className="ml-1 text-red-500">
                                    *
                                </span>
                            </label>

                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                {IMPACT_OPTIONS.map(
                                    (option) => {
                                        const selected =
                                            impact ===
                                            option.value;

                                        return (
                                            <button
                                                key={
                                                    option.value
                                                }
                                                type="button"
                                                disabled={
                                                    !canReport ||
                                                    submitting
                                                }
                                                onClick={() =>
                                                    setImpact(
                                                        option.value
                                                    )
                                                }
                                                className={`rounded-xl border p-4 text-left transition ${
                                                    selected
                                                        ? getImpactClasses(
                                                              option.value
                                                          )
                                                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                                } disabled:cursor-not-allowed disabled:opacity-60`}
                                            >
                                                <p className="text-sm font-bold">
                                                    {
                                                        option.label
                                                    }
                                                </p>

                                                <p className="mt-1 text-xs leading-5 opacity-80">
                                                    {
                                                        option.description
                                                    }
                                                </p>
                                            </button>
                                        );
                                    }
                                )}
                            </div>
                        </div>

                        {/* DEPENDENCY */}
                        <div className="mb-6">
                            <label
                                htmlFor="related-dependency"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                Related Dependency
                            </label>

                            <select
                                id="related-dependency"
                                value={
                                    relatedDependency
                                }
                                onChange={(event) =>
                                    setRelatedDependency(
                                        event.target.value
                                    )
                                }
                                disabled={
                                    !canReport ||
                                    submitting
                                }
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                            >
                                {DEPENDENCY_OPTIONS.map(
                                    (dependency) => (
                                        <option
                                            key={
                                                dependency
                                            }
                                            value={
                                                dependency
                                            }
                                        >
                                            {dependency ===
                                            "None"
                                                ? "No related dependency"
                                                : dependency}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        {/* ASSISTANCE REQUIRED */}
                        <div className="mb-6">
                            <label
                                htmlFor="assistance-required"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                Assistance Required
                            </label>

                            <textarea
                                id="assistance-required"
                                value={
                                    assistanceRequired
                                }
                                onChange={(event) =>
                                    setAssistanceRequired(
                                        event.target.value
                                    )
                                }
                                disabled={
                                    !canReport ||
                                    submitting
                                }
                                rows={4}
                                placeholder="Explain what assistance you need from the Team Leader or Manager..."
                                className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                            />
                        </div>

                        {/* ATTACHMENT */}
                        <div className="mb-6">
                            <label
                                htmlFor="blocker-attachment"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                Optional Attachment
                            </label>

                            <label
                                htmlFor="blocker-attachment"
                                className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 p-6 text-center transition hover:border-blue-400 hover:bg-blue-50 ${
                                    !canReport ||
                                    submitting
                                        ? "cursor-not-allowed opacity-60"
                                        : ""
                                }`}
                            >
                                <Paperclip
                                    size={25}
                                    className="text-slate-400"
                                />

                                <p className="mt-2 text-sm font-semibold text-slate-700">
                                    Select a file
                                </p>

                                <p className="mt-1 text-xs text-slate-400">
                                    PDF, Word, Excel, image, TXT,
                                    CSV or ZIP
                                </p>

                                <input
                                    id="blocker-attachment"
                                    type="file"
                                    disabled={
                                        !canReport ||
                                        submitting
                                    }
                                    onChange={
                                        handleAttachmentChange
                                    }
                                    className="hidden"
                                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.webp,.txt,.csv,.zip"
                                />
                            </label>

                            {attachment && (
                                <div className="mt-3 flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50 p-3">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="rounded-lg bg-white p-2 text-blue-600">
                                            <Paperclip
                                                size={17}
                                            />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-slate-800">
                                                {
                                                    attachment.name
                                                }
                                            </p>

                                            <p className="text-xs text-slate-500">
                                                {(
                                                    attachment.size /
                                                    1024 /
                                                    1024
                                                ).toFixed(
                                                    2
                                                )}{" "}
                                                MB
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setAttachment(
                                                null
                                            )
                                        }
                                        className="rounded-lg p-2 text-slate-500 transition hover:bg-white hover:text-red-600"
                                        aria-label="Remove attachment"
                                    >
                                        <X size={17} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* NOTIFICATION INFO */}
                        <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 p-4">
                            <div className="flex items-start gap-3">
                                <UsersRound
                                    size={20}
                                    className="mt-0.5 shrink-0 text-blue-600"
                                />

                                <div>
                                    <p className="text-sm font-semibold text-blue-900">
                                        Notification
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-blue-700">
                                        The Team Leader will be
                                        notified when you report this
                                        blocker. High and Critical
                                        impact blockers will also be
                                        escalated to the Manager.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={closeTask}
                                disabled={submitting}
                                className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={
                                    !canReport ||
                                    submitting
                                }
                                className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                            >
                                {submitting ? (
                                    <>
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        Reporting...
                                    </>
                                ) : (
                                    <>
                                        <Send size={17} />
                                        Report Blocker
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* LAST BLOCKER INFORMATION */}
                {selectedTask.status ===
                    "Blocked" &&
                    selectedTask.blockedAt && (
                        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5">
                            <div className="flex items-start gap-3">
                                <CheckCircle2
                                    size={20}
                                    className="mt-0.5 text-red-600"
                                />

                                <div>
                                    <p className="font-semibold text-red-900">
                                        Task is currently
                                        blocked
                                    </p>

                                    <p className="mt-1 text-sm text-red-700">
                                        Blocker reported on{" "}
                                        {formatDateTime(
                                            selectedTask.blockedAt
                                        )}
                                    </p>

                                    <p className="mt-3 text-sm leading-6 text-red-800">
                                        {
                                            selectedTask.blockerDescription
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
            </div>
        </div>
    );
}

// ============================================================
// TASK CARD
// ============================================================

function TaskCard({ task, onOpen }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-red-200 hover:shadow-md">

            {/* HEADER */}
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
                        <FolderKanban size={16} />
                    }
                    label="Project"
                    value={task.projectName}
                />

                <SmallInfo
                    icon={<Link2 size={16} />}
                    label="Sprint"
                    value={task.sprintName}
                />

                <SmallInfo
                    icon={
                        <AlertCircle size={16} />
                    }
                    label="Progress"
                    value={`${task.progress}%`}
                />

                <SmallInfo
                    icon={
                        <FileText size={16} />
                    }
                    label="Due Date"
                    value={formatDate(
                        task.dueDate
                    )}
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

            {/* ACTION */}
            <div className="mt-5 border-t border-slate-100 pt-4">
                <button
                    type="button"
                    onClick={onOpen}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                    <MessageSquareWarning
                        size={17}
                    />
                    Report Blocker
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
                    <CheckCircle2 size={19} />
                ) : (
                    <AlertCircle size={19} />
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

function EmptyState() {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <MessageSquareWarning
                    size={27}
                />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-slate-800">
                No assigned tasks found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
                There are no tasks matching your search
                or filter.
            </p>
        </div>
    );
}