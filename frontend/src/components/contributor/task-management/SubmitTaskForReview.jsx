
import { useMemo, useState } from "react";
import {
    AlertCircle,
    CalendarDays,
    CheckCircle2,
    CircleUserRound,
    File,
    FileText,
    FolderKanban,
    Paperclip,
    RefreshCw,
    Send,
    ShieldCheck,
    Upload,
    X,
} from "lucide-react";



const CURRENT_CONTRIBUTOR = {
    id: "USER-003",
    name: "Hana Nigussie",
    role: "Contributor",
};



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
        status: "Done",
        progress: 100,
        dueDate: "2026-08-30",
        requirements: [
            "Dashboard layout completed",
            "Contributor navigation implemented",
            "Required project features connected",
        ],
        requiredAttachment: true,
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
        status: "In Progress",
        progress: 85,
        dueDate: "2026-08-28",
        requirements: [
            "Project participation page completed",
            "Project components connected",
            "Contributor actions implemented",
        ],
        requiredAttachment: true,
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
        status: "Done",
        progress: 100,
        dueDate: "2026-08-25",
        requirements: [
            "Documentation completed",
            "Documents reviewed",
            "Final documentation attached",
        ],
        requiredAttachment: true,
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
        status: "Blocked",
        progress: 60,
        dueDate: "2026-09-02",
        requirements: [
            "Database schema completed",
            "Backend connection completed",
            "Database testing completed",
        ],
        requiredAttachment: true,
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
        status: "Done",
        progress: 100,
        dueDate: "2026-09-10",
        requirements: [
            "Report interface completed",
            "Report data connected",
            "Report export tested",
        ],
        requiredAttachment: false,
    },
];

// ============================================================
// STATUS
// ============================================================

const SUBMITTABLE_STATUSES = [
    "Done",
    "Completed",
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
        case "Done":
        case "Completed":
            return "bg-emerald-100 text-emerald-700";

        case "Review":
            return "bg-purple-100 text-purple-700";

        case "In Progress":
            return "bg-blue-100 text-blue-700";

        case "Blocked":
            return "bg-red-100 text-red-700";

        default:
            return "bg-slate-100 text-slate-700";
    }
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function SubmitTaskForReview() {
    // ----------------------------------------------------------
    // TASKS
    // ----------------------------------------------------------

    const [tasks, setTasks] = useState(INITIAL_TASKS);

    // ----------------------------------------------------------
    // SELECTED TASK
    // ----------------------------------------------------------

    const [selectedTask, setSelectedTask] = useState(null);

    // ----------------------------------------------------------
    // SEARCH
    // ----------------------------------------------------------

    const [search, setSearch] = useState("");

    // ----------------------------------------------------------
    // NOTIFICATION
    // ----------------------------------------------------------

    const [notification, setNotification] = useState(null);

    // ----------------------------------------------------------
    // SUBMISSION STATE
    // ----------------------------------------------------------

    const [submittingTaskId, setSubmittingTaskId] = useState(null);

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
                task.projectName.toLowerCase().includes(searchValue) ||
                task.sprintName.toLowerCase().includes(searchValue);

            return matchesSearch;
        });
    }, [tasks, search]);

    // ============================================================
    // OPEN TASK
    //
    // MAIN SUCCESS SCENARIO - STEP 1
    // Contributor opens completed task.
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
        setNotification(null);
    };

    // ============================================================
    // HANDLE SUBMISSION
    //
    // CONT-TASK-008
    // ============================================================

    const handleSubmitForReview = async ({
        task,
        completionNotes,
        attachments,
    }) => {
        // ========================================================
        // PRECONDITION:
        // Contributor must own task.
        // ========================================================

        if (task.assigneeId !== CURRENT_CONTRIBUTOR.id) {
            setNotification({
                type: "error",
                message:
                    "You cannot submit this task for review.",
            });

            return;
        }

        // ========================================================
        // A1:
        // Required work must be complete.
        // ========================================================

        if (
            !SUBMITTABLE_STATUSES.includes(task.status) ||
            task.progress < 100
        ) {
            setNotification({
                type: "error",
                message:
                    "The task cannot be submitted because required work is incomplete.",
            });

            return;
        }

        // ========================================================
        // A2:
        // Required attachment must exist.
        // ========================================================

        if (
            task.requiredAttachment &&
            attachments.length === 0
        ) {
            setNotification({
                type: "error",
                message:
                    "Please attach the required files.",
            });

            return;
        }

        // ========================================================
        // VALIDATE COMPLETION NOTES
        // ========================================================

        if (!completionNotes.trim()) {
            setNotification({
                type: "error",
                message:
                    "Please provide completion notes before submitting.",
            });

            return;
        }

        try {
            setSubmittingTaskId(task.id);

            // ====================================================
            // STEP 6:
            // System validates submission.
            // ====================================================

            const submissionTime =
                new Date().toISOString();

            // ====================================================
            // STEP 7:
            // Change status to Review.
            // ====================================================

            const updatedTask = {
                ...task,
                status: "Review",
                progress: 100,
                submittedForReviewAt: submissionTime,
                completionNotes:
                    completionNotes.trim(),
                attachments,
                reviewer: "Manager / Authorized Reviewer",
            };

            setTasks((previousTasks) =>
                previousTasks.map((currentTask) =>
                    currentTask.id === task.id
                        ? updatedTask
                        : currentTask
                )
            );

            // ====================================================
            // STEP 8:
            // Notify appropriate reviewer / Manager.
            // ====================================================

            const notificationRecord = {
                id: `NOTIFY-${Date.now()}`,
                type: "TASK_SUBMITTED_FOR_REVIEW",
                taskId: task.id,
                taskTitle: task.title,
                projectId: task.projectId,
                projectName: task.projectName,
                recipientRole:
                    "Manager / Authorized Reviewer",
                senderId:
                    CURRENT_CONTRIBUTOR.id,
                senderName:
                    CURRENT_CONTRIBUTOR.name,
                message: `Task "${task.title}" has been submitted for review.`,
                createdAt: submissionTime,
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

            // ====================================================
            // STEP 9:
            // Record submission.
            // ====================================================

            const submissionRecord = {
                id: `SUBMISSION-${Date.now()}`,
                type: "TASK_SUBMITTED_FOR_REVIEW",
                taskId: task.id,
                taskTitle: task.title,
                projectId: task.projectId,
                projectName: task.projectName,
                sprintId: task.sprintId,
                sprintName: task.sprintName,
                contributorId:
                    CURRENT_CONTRIBUTOR.id,
                contributorName:
                    CURRENT_CONTRIBUTOR.name,
                completionNotes:
                    completionNotes.trim(),
                attachments,
                previousStatus: task.status,
                newStatus: "Review",
                submittedAt: submissionTime,
            };

            const existingSubmissions =
                JSON.parse(
                    localStorage.getItem(
                        "aipms_task_review_submissions"
                    ) || "[]"
                );

            localStorage.setItem(
                "aipms_task_review_submissions",
                JSON.stringify([
                    ...existingSubmissions,
                    submissionRecord,
                ])
            );

            // ====================================================
            // RECORD ACTIVITY
            // ====================================================

            const activity = {
                id: `ACT-${Date.now()}`,
                type: "TASK_SUBMITTED_FOR_REVIEW",
                taskId: task.id,
                taskTitle: task.title,
                projectId: task.projectId,
                projectName: task.projectName,
                userId:
                    CURRENT_CONTRIBUTOR.id,
                userName:
                    CURRENT_CONTRIBUTOR.name,
                timestamp: submissionTime,
                description: `Task "${task.title}" was submitted for review.`,
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

            // ====================================================
            // SIMULATED BACKEND REQUEST
            //
            // Replace later with:
            //
            // await taskService.submitTaskForReview(
            //     task.id,
            //     completionNotes,
            //     attachments
            // );
            // ====================================================

            await new Promise((resolve) =>
                setTimeout(resolve, 600)
            );

            setSelectedTask(updatedTask);

            // ====================================================
            // STEP 10:
            // Required success message.
            // ====================================================

            setNotification({
                type: "success",
                message:
                    "Task submitted for review.",
            });
        } catch (error) {
            console.error(
                "Unable to submit task for review:",
                error
            );

            setNotification({
                type: "error",
                message:
                    "Unable to submit task for review.",
            });
        } finally {
            setSubmittingTaskId(null);
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

                            <div className="rounded-xl bg-purple-100 p-3 text-purple-700">
                                <Send size={25} />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">
                                    Submit Task for Review
                                </h1>

                                <p className="text-sm text-slate-500">
                                    Submit completed tasks to the Manager or authorized reviewer.
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

                    <div className="mb-6 rounded-2xl border border-purple-100 bg-purple-50 p-5">

                        <div className="flex items-center gap-3">

                            <div className="rounded-full bg-white p-3 text-purple-600">
                                <CircleUserRound
                                    size={21}
                                />
                            </div>

                            <div>
                                <p className="text-xs font-medium text-purple-600">
                                    Logged-in Contributor
                                </p>

                                <p className="font-semibold text-purple-900">
                                    {CURRENT_CONTRIBUTOR.name}
                                </p>
                            </div>

                        </div>

                    </div>

                    {/* SEARCH */}

                    <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Search your tasks..."
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                        />

                    </div>

                    {/* TASK LIST */}

                    {filteredTasks.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <div className="grid gap-5 lg:grid-cols-2">

                            {filteredTasks.map(
                                (task) => (
                                    <TaskCard
                                        key={task.id}
                                        task={task}
                                        onOpen={() =>
                                            openTask(
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

    const taskCompleted =
        SUBMITTABLE_STATUSES.includes(
            selectedTask.status
        ) &&
        selectedTask.progress >= 100;

    const isAlreadyInReview =
        selectedTask.status === "Review";

    return (
        <div className="min-h-screen bg-slate-50 p-6">

            <div className="mx-auto max-w-5xl">

                {/* HEADER */}

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

                {/* MAIN CARD */}

                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

                    {/* TASK HEADER */}

                    <div className="border-b border-slate-100 p-6">

                        <p className="text-xs font-semibold text-purple-600">
                            {selectedTask.id}
                        </p>

                        <h1 className="mt-1 text-2xl font-bold text-slate-900">
                            {selectedTask.title}
                        </h1>

                        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
                            {selectedTask.description}
                        </p>

                    </div>

                    {/* TASK INFORMATION */}

                    <div className="grid gap-4 border-b border-slate-100 p-6 sm:grid-cols-2 lg:grid-cols-3">

                        <InfoCard
                            icon={
                                <FolderKanban size={18} />
                            }
                            label="Project"
                            value={
                                selectedTask.projectName
                            }
                        />

                        <InfoCard
                            icon={
                                <RefreshCw size={18} />
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
                            label="Contributor"
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
                                <CheckCircle2
                                    size={18}
                                />
                            }
                            label="Progress"
                            value={`${selectedTask.progress}%`}
                        />

                        <InfoCard
                            icon={
                                <ShieldCheck
                                    size={18}
                                />
                            }
                            label="Reviewer"
                            value={
                                selectedTask.reviewer ||
                                "Manager / Authorized Reviewer"
                            }
                        />

                    </div>

                    {/* REQUIREMENTS */}

                    <div className="border-b border-slate-100 p-6">

                        <div className="mb-4 flex items-center gap-2">

                            <FileText
                                size={19}
                                className="text-purple-600"
                            />

                            <h2 className="font-bold text-slate-900">
                                Task Requirements
                            </h2>

                        </div>

                        <div className="space-y-2">

                            {selectedTask.requirements?.map(
                                (
                                    requirement,
                                    index
                                ) => (
                                    <div
                                        key={`${selectedTask.id}-requirement-${index}`}
                                        className="flex items-center gap-3 rounded-xl bg-slate-50 p-3"
                                    >
                                        <CheckCircle2
                                            size={18}
                                            className="shrink-0 text-emerald-600"
                                        />

                                        <span className="text-sm text-slate-700">
                                            {
                                                requirement
                                            }
                                        </span>
                                    </div>
                                )
                            )}

                        </div>

                    </div>

                    {/* ALREADY REVIEW */}

                    {isAlreadyInReview ? (
                        <div className="p-6">

                            <div className="rounded-2xl border border-purple-200 bg-purple-50 p-5">

                                <div className="flex items-start gap-3">

                                    <ShieldCheck
                                        size={22}
                                        className="mt-0.5 shrink-0 text-purple-600"
                                    />

                                    <div>

                                        <h2 className="font-bold text-purple-900">
                                            Task submitted for review
                                        </h2>

                                        <p className="mt-1 text-sm leading-6 text-purple-700">
                                            This task is now awaiting review by the Manager or authorized reviewer.
                                        </p>

                                        {selectedTask.submittedForReviewAt && (
                                            <p className="mt-2 text-xs text-purple-600">
                                                Submitted:{" "}
                                                {formatDateTime(
                                                    selectedTask.submittedForReviewAt
                                                )}
                                            </p>
                                        )}

                                    </div>

                                </div>

                            </div>

                            {/* IMPORTANT RULE */}

                            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">

                                <div className="flex items-start gap-3">

                                    <AlertCircle
                                        size={19}
                                        className="mt-0.5 shrink-0 text-amber-600"
                                    />

                                    <div>

                                        <p className="text-sm font-semibold text-amber-800">
                                            Review responsibility
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-amber-700">
                                            The Contributor cannot approve their own task. Approval must be performed by the Manager or an authorized reviewer.
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>
                    ) : (
                        <SubmissionForm
                            task={selectedTask}
                            isOwner={isOwner}
                            taskCompleted={taskCompleted}
                            submitting={
                                submittingTaskId ===
                                selectedTask.id
                            }
                            onSubmit={
                                handleSubmitForReview
                            }
                        />
                    )}

                </div>

            </div>

        </div>
    );
}

// ============================================================
// SUBMISSION FORM
// ============================================================

function SubmissionForm({
    task,
    isOwner,
    taskCompleted,
    submitting,
    onSubmit,
}) {
    const [completionNotes, setCompletionNotes] =
        useState("");

    const [files, setFiles] = useState([]);

    const [localError, setLocalError] =
        useState("");

    // ============================================================
    // FILE VALIDATION
    // ============================================================

    const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/zip",
        "image/png",
        "image/jpeg",
        "text/plain",
    ];

    const MAX_FILE_SIZE =
        10 * 1024 * 1024;

    const handleFileChange = (event) => {
        setLocalError("");

        const selectedFiles = Array.from(
            event.target.files || []
        );

        const validFiles = [];

        for (const file of selectedFiles) {
            if (
                !allowedTypes.includes(
                    file.type
                )
            ) {
                setLocalError(
                    "This file type is not allowed."
                );

                continue;
            }

            if (
                file.size > MAX_FILE_SIZE
            ) {
                setLocalError(
                    "File exceeds the allowed size."
                );

                continue;
            }

            validFiles.push({
                id: `${file.name}-${file.lastModified}`,
                name: file.name,
                size: file.size,
                type: file.type,
            });
        }

        setFiles((previousFiles) => [
            ...previousFiles,
            ...validFiles,
        ]);

        event.target.value = "";
    };

    const removeFile = (fileId) => {
        setFiles((previousFiles) =>
            previousFiles.filter(
                (file) =>
                    file.id !== fileId
            )
        );
    };

    // ============================================================
    // SUBMIT
    // ============================================================

    const submit = (event) => {
        event.preventDefault();

        setLocalError("");

        if (!isOwner) {
            setLocalError(
                "You cannot submit this task for review."
            );

            return;
        }

        if (!taskCompleted) {
            setLocalError(
                "The task cannot be submitted because required work is incomplete."
            );

            return;
        }

        if (!completionNotes.trim()) {
            setLocalError(
                "Please provide completion notes before submitting."
            );

            return;
        }

        if (
            task.requiredAttachment &&
            files.length === 0
        ) {
            setLocalError(
                "Please attach the required files."
            );

            return;
        }

        onSubmit({
            task,
            completionNotes,
            attachments: files,
        });
    };

    // ============================================================
    // FORM
    // ============================================================

    return (
        <form
            onSubmit={submit}
            className="p-6"
        >

            {/* COMPLETION STATUS */}

            <div
                className={`rounded-2xl border p-5 ${
                    taskCompleted
                        ? "border-emerald-200 bg-emerald-50"
                        : "border-amber-200 bg-amber-50"
                }`}
            >

                <div className="flex items-start gap-3">

                    {taskCompleted ? (
                        <CheckCircle2
                            size={22}
                            className="mt-0.5 shrink-0 text-emerald-600"
                        />
                    ) : (
                        <AlertCircle
                            size={22}
                            className="mt-0.5 shrink-0 text-amber-600"
                        />
                    )}

                    <div>

                        <h2
                            className={`font-bold ${
                                taskCompleted
                                    ? "text-emerald-900"
                                    : "text-amber-900"
                            }`}
                        >
                            {taskCompleted
                                ? "Task is ready for review"
                                : "Required work is incomplete"}
                        </h2>

                        <p
                            className={`mt-1 text-sm leading-6 ${
                                taskCompleted
                                    ? "text-emerald-700"
                                    : "text-amber-700"
                            }`}
                        >
                            {taskCompleted
                                ? "Review the requirements, provide completion notes, attach the required work, and submit the task."
                                : "Complete all required work before submitting the task for review."}
                        </p>

                    </div>

                </div>

            </div>

            {/* ERROR */}

            {localError && (
                <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">

                    <AlertCircle
                        size={19}
                        className="mt-0.5 shrink-0"
                    />

                    <p className="text-sm font-medium">
                        {localError}
                    </p>

                </div>
            )}

            {/* COMPLETION NOTES */}

            <div className="mt-6">

                <label
                    htmlFor="completion-notes"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                >
                    Completion Notes
                </label>

                <textarea
                    id="completion-notes"
                    value={completionNotes}
                    onChange={(event) =>
                        setCompletionNotes(
                            event.target.value
                        )
                    }
                    placeholder="Describe the work you completed, important implementation details, testing performed, and anything the reviewer should know..."
                    rows={6}
                    disabled={submitting}
                    className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm leading-6 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100 disabled:bg-slate-100"
                />

                <p className="mt-1 text-xs text-slate-400">
                    Completion notes help the reviewer understand the submitted work.
                </p>

            </div>

            {/* ATTACHMENTS */}

            <div className="mt-6">

                <div className="mb-2 flex items-center justify-between">

                    <label className="block text-sm font-semibold text-slate-800">
                        Required Work / Attachments
                    </label>

                    {task.requiredAttachment && (
                        <span className="text-xs font-medium text-red-500">
                            Required
                        </span>
                    )}

                </div>

                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6">

                    <div className="text-center">

                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-purple-600 shadow-sm">

                            <Upload size={22} />

                        </div>

                        <p className="mt-3 text-sm font-semibold text-slate-700">
                            Attach your completed work
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                            PDF, Word, Excel, ZIP, PNG, JPG, or TXT — maximum 10 MB per file.
                        </p>

                        <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700">

                            <Paperclip size={17} />

                            Upload File

                            <input
                                type="file"
                                multiple
                                onChange={
                                    handleFileChange
                                }
                                disabled={submitting}
                                className="hidden"
                            />

                        </label>

                    </div>

                    {/* FILE LIST */}

                    {files.length > 0 && (
                        <div className="mt-5 space-y-2">

                            {files.map(
                                (file) => (
                                    <div
                                        key={file.id}
                                        className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3"
                                    >

                                        <div className="flex min-w-0 items-center gap-3">

                                            <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
                                                <File
                                                    size={18}
                                                />
                                            </div>

                                            <div className="min-w-0">

                                                <p className="truncate text-sm font-semibold text-slate-700">
                                                    {file.name}
                                                </p>

                                                <p className="text-xs text-slate-400">
                                                    {formatFileSize(
                                                        file.size
                                                    )}
                                                </p>

                                            </div>

                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeFile(
                                                    file.id
                                                )
                                            }
                                            disabled={
                                                submitting
                                            }
                                            className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed"
                                            aria-label={`Remove ${file.name}`}
                                        >
                                            <X
                                                size={
                                                    17
                                                }
                                            />
                                        </button>

                                    </div>
                                )
                            )}

                        </div>
                    )}

                </div>

            </div>

            {/* REVIEW RESPONSIBILITY */}

            <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4">

                <div className="flex items-start gap-3">

                    <ShieldCheck
                        size={20}
                        className="mt-0.5 shrink-0 text-blue-600"
                    />

                    <div>

                        <p className="text-sm font-semibold text-blue-900">
                            Review responsibility
                        </p>

                        <p className="mt-1 text-xs leading-5 text-blue-700">
                            After submission, the task moves to Review. The Manager or an authorized reviewer will decide whether to approve the task or request changes. Contributors cannot approve their own tasks.
                        </p>

                    </div>

                </div>

            </div>

            {/* SUBMIT */}

            <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">

                <button
                    type="submit"
                    disabled={
                        submitting ||
                        !isOwner ||
                        !taskCompleted
                    }
                    className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >

                    {submitting ? (
                        <>
                            <RefreshCw
                                size={17}
                                className="animate-spin"
                            />

                            Submitting...
                        </>
                    ) : (
                        <>
                            <Send size={17} />

                            Submit for Review
                        </>
                    )}

                </button>

            </div>

        </form>
    );
}

// ============================================================
// TASK CARD
// ============================================================

function TaskCard({
    task,
    onOpen,
}) {
    const canSubmit =
        SUBMITTABLE_STATUSES.includes(
            task.status
        ) &&
        task.progress >= 100;

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-purple-200 hover:shadow-md">

            {/* HEADER */}

            <div className="flex items-start justify-between gap-3">

                <div>

                    <p className="text-xs font-semibold text-purple-600">
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

            {/* INFO */}

            <div className="mt-5 grid gap-3 sm:grid-cols-2">

                <SmallInfo
                    label="Project"
                    value={task.projectName}
                />

                <SmallInfo
                    label="Sprint"
                    value={task.sprintName}
                />

                <SmallInfo
                    label="Due Date"
                    value={formatDate(
                        task.dueDate
                    )}
                />

                <SmallInfo
                    label="Progress"
                    value={`${task.progress}%`}
                />

            </div>

            {/* PROGRESS */}

            <div className="mt-5">

                <div className="mb-2 flex items-center justify-between">

                    <span className="text-xs text-slate-500">
                        Completion
                    </span>

                    <span className="text-xs font-bold text-slate-700">
                        {task.progress}%
                    </span>

                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                    <div
                        className="h-full rounded-full bg-purple-600 transition-all"
                        style={{
                            width: `${task.progress}%`,
                        }}
                    />

                </div>

            </div>

            {/* REQUIREMENT INDICATOR */}

            <div className="mt-4 flex items-center gap-2 text-xs">

                {task.requiredAttachment ? (
                    <>
                        <Paperclip
                            size={14}
                            className="text-amber-500"
                        />

                        <span className="text-amber-600">
                            Required attachment
                        </span>
                    </>
                ) : (
                    <>
                        <CheckCircle2
                            size={14}
                            className="text-emerald-500"
                        />

                        <span className="text-emerald-600">
                            No required attachment
                        </span>
                    </>
                )}

            </div>

            {/* ACTION */}

            <div className="mt-5 border-t border-slate-100 pt-4">

                <button
                    type="button"
                    onClick={onOpen}
                    className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                        canSubmit
                            ? "bg-purple-600 text-white hover:bg-purple-700"
                            : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                    }`}
                >

                    {canSubmit ? (
                        <>
                            <Send size={16} />
                            Open & Submit for Review
                        </>
                    ) : (
                        <>
                            <FileText size={16} />
                            View Task
                        </>
                    )}

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
    label,
    value,
}) {
    return (
        <div className="rounded-xl bg-slate-50 p-3">

            <p className="text-[11px] text-slate-400">
                {label}
            </p>

            <p className="mt-1 truncate text-xs font-semibold text-slate-700">
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
                <FileText size={26} />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-slate-800">
                No assigned tasks found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
                There are no tasks assigned to you matching your search.
            </p>

        </div>
    );
}

// ============================================================
// FILE SIZE
// ============================================================

function formatFileSize(bytes) {
    if (!bytes) {
        return "0 Bytes";
    }

    const units = [
        "Bytes",
        "KB",
        "MB",
        "GB",
    ];

    const index = Math.floor(
        Math.log(bytes) /
            Math.log(1024)
    );

    return `${parseFloat(
        (bytes /
            Math.pow(
                1024,
                index
            )).toFixed(2)
    )} ${units[index]}`;
}
