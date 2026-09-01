import { useMemo, useState } from "react";
import {
    AlertCircle,
    CheckCircle2,
    CircleUserRound,
    Clock3,
    FileText,
    MessageCircle,
    RefreshCw,
    Send,
    ShieldAlert,
    UserRound,
    X,
} from "lucide-react";

// ============================================================
// CONT-TASK-009
// RESPOND TO REVIEW FEEDBACK
// ============================================================

const CURRENT_CONTRIBUTOR = {
    id: "USER-003",
    name: "Hana Nigussie",
    role: "Contributor",
};

// ============================================================
// MOCK TASKS
// ============================================================

const INITIAL_TASKS = [
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
        status: "Review",
        progress: 100,
        reviewerId: "USER-001",
        reviewerName: "Project Manager",
        reviewFeedback: [
            {
                id: "FEEDBACK-001",
                reviewerId: "USER-001",
                reviewerName: "Project Manager",
                message:
                    "Please improve the project participation validation and make sure the task state is correctly displayed.",
                createdAt: "2026-08-23T10:30:00",
                resolved: false,
            },
            {
                id: "FEEDBACK-002",
                reviewerId: "USER-002",
                reviewerName: "Team Leader",
                message:
                    "Please check the responsive layout and make sure the action buttons work correctly on smaller screens.",
                createdAt: "2026-08-24T14:20:00",
                resolved: false,
            },
        ],
        requiredChanges: [
            "Improve project participation validation.",
            "Correct the task state display.",
            "Check responsive layout.",
            "Verify action buttons on smaller screens.",
        ],
        lastSubmissionAt: "2026-08-23T09:00:00",
    },
    {
        id: "TASK-006",
        title: "Fix Task Management Validation",
        description:
            "Review and improve validation rules in the contributor task management module.",
        projectId: "PROJ-001",
        projectName: "AI Powered Management System",
        sprintId: "SPRINT-004",
        sprintName: "Sprint 4",
        assigneeId: "USER-003",
        assigneeName: "Hana Nigussie",
        status: "Review",
        progress: 100,
        reviewerId: "USER-001",
        reviewerName: "Project Manager",
        reviewFeedback: [
            {
                id: "FEEDBACK-003",
                reviewerId: "USER-001",
                reviewerName: "Project Manager",
                message:
                    "Please update the validation messages and test the invalid transition scenario.",
                createdAt: "2026-08-24T09:15:00",
                resolved: false,
            },
        ],
        requiredChanges: [
            "Update validation messages.",
            "Test invalid status transition.",
        ],
        lastSubmissionAt: "2026-08-24T08:00:00",
    },
    {
        id: "TASK-007",
        title: "Database Integration",
        description:
            "Integrate the project database with the application backend.",
        projectId: "PROJ-001",
        projectName: "AI Powered Management System",
        sprintId: "SPRINT-004",
        sprintName: "Sprint 4",
        assigneeId: "USER-004",
        assigneeName: "Team Member",
        status: "Review",
        progress: 100,
        reviewerId: "USER-001",
        reviewerName: "Project Manager",
        reviewFeedback: [
            {
                id: "FEEDBACK-004",
                reviewerId: "USER-001",
                reviewerName: "Project Manager",
                message:
                    "Please verify the database connection configuration.",
                createdAt: "2026-08-24T11:00:00",
                resolved: false,
            },
        ],
        requiredChanges: [
            "Verify database connection configuration.",
        ],
        lastSubmissionAt: "2026-08-24T10:00:00",
    },
];

// ============================================================
// HELPERS
// ============================================================

function formatDateTime(value) {
    if (!value) {
        return "Not available";
    }

    return new Date(value).toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function getStatusClasses(status) {
    switch (status) {
        case "Review":
            return "bg-purple-100 text-purple-700";

        case "In Progress":
            return "bg-blue-100 text-blue-700";

        case "Done":
        case "Completed":
            return "bg-emerald-100 text-emerald-700";

        case "Blocked":
            return "bg-red-100 text-red-700";

        default:
            return "bg-slate-100 text-slate-700";
    }
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function RespondReviewFeedback() {
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
    // RESPONSE
    // ----------------------------------------------------------

    const [response, setResponse] = useState("");

    // ----------------------------------------------------------
    // CHANGE SUMMARY
    // ----------------------------------------------------------

    const [changeSummary, setChangeSummary] = useState("");

    // ----------------------------------------------------------
    // RESOLVED FEEDBACK
    // ----------------------------------------------------------

    const [resolvedFeedbackIds, setResolvedFeedbackIds] =
        useState([]);

    // ----------------------------------------------------------
    // SUBMITTING
    // ----------------------------------------------------------

    const [submitting, setSubmitting] = useState(false);

    // ----------------------------------------------------------
    // CLARIFICATION
    // ----------------------------------------------------------

    const [clarificationOpen, setClarificationOpen] =
        useState(false);

    const [clarificationMessage, setClarificationMessage] =
        useState("");

    const [sendingClarification, setSendingClarification] =
        useState(false);

    // ----------------------------------------------------------
    // ASSISTANCE
    // ----------------------------------------------------------

    const [assistanceOpen, setAssistanceOpen] =
        useState(false);

    const [assistanceMessage, setAssistanceMessage] =
        useState("");

    const [sendingAssistance, setSendingAssistance] =
        useState(false);

    // ============================================================
    // FILTER REVIEW TASKS
    // ============================================================

    const filteredTasks = useMemo(() => {
        const searchValue = search.trim().toLowerCase();

        return tasks.filter((task) => {
            const belongsToContributor =
                task.assigneeId === CURRENT_CONTRIBUTOR.id;

            const isReviewTask =
                task.status === "Review";

            const matchesSearch =
                !searchValue ||
                task.id.toLowerCase().includes(searchValue) ||
                task.title.toLowerCase().includes(searchValue) ||
                task.projectName
                    .toLowerCase()
                    .includes(searchValue);

            return (
                belongsToContributor &&
                isReviewTask &&
                matchesSearch
            );
        });
    }, [tasks, search]);

    // ============================================================
    // OPEN TASK
    //
    // MAIN SUCCESS SCENARIO - STEP 2
    // Contributor opens the task.
    // ============================================================

    const openTask = (task) => {
        setSelectedTask(task);
        setResponse("");
        setChangeSummary("");
        setNotification(null);
        setResolvedFeedbackIds([]);
        setClarificationOpen(false);
        setAssistanceOpen(false);
    };

    // ============================================================
    // CLOSE TASK
    // ============================================================

    const closeTask = () => {
        setSelectedTask(null);
        setNotification(null);
        setResponse("");
        setChangeSummary("");
        setResolvedFeedbackIds([]);
    };

    // ============================================================
    // TOGGLE FEEDBACK AS RESOLVED
    // ============================================================

    const toggleFeedbackResolved = (feedbackId) => {
        setResolvedFeedbackIds((previous) => {
            if (previous.includes(feedbackId)) {
                return previous.filter(
                    (id) => id !== feedbackId
                );
            }

            return [...previous, feedbackId];
        });
    };

    // ============================================================
    // RECORD ACTIVITY
    //
    // MAIN SUCCESS SCENARIO - STEP 9
    // System records the new submission.
    // ============================================================

    const recordReviewActivity = (
        task,
        submission
    ) => {
        const activity = {
            id:
                typeof crypto !== "undefined" &&
                crypto.randomUUID
                    ? `ACT-${crypto.randomUUID()}`
                    : `ACT-${Math.random().toString(36).slice(2)}`,

            type: "REVIEW_FEEDBACK_RESPONSE",

            taskId: task.id,
            taskTitle: task.title,

            projectId: task.projectId,
            projectName: task.projectName,

            sprintId: task.sprintId,
            sprintName: task.sprintName,

            userId: CURRENT_CONTRIBUTOR.id,
            userName: CURRENT_CONTRIBUTOR.name,

            response: submission.response,
            changeSummary:
                submission.changeSummary,

            timestamp: submission.submittedAt,

            description:
                `Contributor responded to review feedback for task "${task.title}".`,
        };

        const existingActivities = JSON.parse(
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
    // NOTIFY REVIEWER
    //
    // MAIN SUCCESS SCENARIO - STEP 8
    // Notify Manager / authorized reviewer.
    // ============================================================

    const notifyReviewer = (
        task,
        submission
    ) => {
        const notification = {
            id:
                typeof crypto !== "undefined" &&
                crypto.randomUUID
                    ? `NOTIFY-${crypto.randomUUID()}`
                    : `NOTIFY-${Math.random()
                          .toString(36)
                          .slice(2)}`,

            type: "TASK_REVIEW_RESUBMITTED",

            recipientId: task.reviewerId,
            recipientName:
                task.reviewerName,

            taskId: task.id,
            taskTitle: task.title,

            senderId: CURRENT_CONTRIBUTOR.id,
            senderName:
                CURRENT_CONTRIBUTOR.name,

            message:
                `Task "${task.title}" has been resubmitted after addressing review feedback.`,

            createdAt:
                submission.submittedAt,

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
                notification,
            ])
        );

        return notification;
    };

    // ============================================================
    // SUBMIT RESPONSE
    //
    // CONT-TASK-009
    //
    // MAIN SUCCESS SCENARIO:
    //
    // 1. Receive feedback
    // 2. Open task
    // 3. Display feedback
    // 4. Review requested changes
    // 5. Make changes
    // 6. Update task
    // 7. Respond
    // 8. Resubmit
    // 9. Record submission
    // ============================================================

    const handleSubmitResponse = async () => {
        if (!selectedTask) {
            return;
        }

        // --------------------------------------------------------
        // Validate contributor ownership
        // --------------------------------------------------------

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

        // --------------------------------------------------------
        // Validate response
        // --------------------------------------------------------

        if (!response.trim()) {
            setNotification({
                type: "error",
                message:
                    "Please provide a response to the reviewer.",
            });

            return;
        }

        // --------------------------------------------------------
        // Validate change summary
        // --------------------------------------------------------

        if (!changeSummary.trim()) {
            setNotification({
                type: "error",
                message:
                    "Please describe the changes you made.",
            });

            return;
        }

        // --------------------------------------------------------
        // Validate feedback resolution
        // --------------------------------------------------------

        const unresolvedFeedback =
            selectedTask.reviewFeedback.filter(
                (feedback) =>
                    !resolvedFeedbackIds.includes(
                        feedback.id
                    )
            );

        if (unresolvedFeedback.length > 0) {
            setNotification({
                type: "error",
                message:
                    "Please address all requested review changes before resubmitting.",
            });

            return;
        }

        try {
            setSubmitting(true);
            setNotification(null);

            // ----------------------------------------------------
            // STEP 8
            // Submit the work again.
            // ----------------------------------------------------

            const submittedAt =
                new Date().toISOString();

            const submission = {
                response: response.trim(),

                changeSummary:
                    changeSummary.trim(),

                submittedAt,

                contributorId:
                    CURRENT_CONTRIBUTOR.id,

                contributorName:
                    CURRENT_CONTRIBUTOR.name,

                taskId: selectedTask.id,

                feedbackIds:
                    selectedTask.reviewFeedback.map(
                        (feedback) =>
                            feedback.id
                    ),
            };

            // ----------------------------------------------------
            // Mark feedback as resolved.
            // ----------------------------------------------------

            const updatedFeedback =
                selectedTask.reviewFeedback.map(
                    (feedback) => ({
                        ...feedback,
                        resolved:
                            resolvedFeedbackIds.includes(
                                feedback.id
                            ),
                        resolvedAt:
                            resolvedFeedbackIds.includes(
                                feedback.id
                            )
                                ? submittedAt
                                : feedback.resolvedAt,
                    })
                );

            // ----------------------------------------------------
            // Update task.
            //
            // The task remains Review because it has been
            // resubmitted to the Manager / authorized reviewer.
            //
            // Contributor cannot approve the task.
            // ----------------------------------------------------

            const updatedTask = {
                ...selectedTask,

                status: "Review",

                reviewFeedback:
                    updatedFeedback,

                lastSubmissionAt:
                    submittedAt,

                latestSubmission: submission,
            };

            // ----------------------------------------------------
            // Save task state.
            // ----------------------------------------------------

            setTasks((previousTasks) =>
                previousTasks.map((task) =>
                    task.id === selectedTask.id
                        ? updatedTask
                        : task
                )
            );

            // ----------------------------------------------------
            // Save submission history.
            // ----------------------------------------------------

            const existingSubmissions =
                JSON.parse(
                    localStorage.getItem(
                        "aipms_review_submissions"
                    ) || "[]"
                );

            localStorage.setItem(
                "aipms_review_submissions",
                JSON.stringify([
                    ...existingSubmissions,
                    submission,
                ])
            );

            // ----------------------------------------------------
            // Notify reviewer.
            // ----------------------------------------------------

            notifyReviewer(
                selectedTask,
                submission
            );

            // ----------------------------------------------------
            // Record activity.
            // ----------------------------------------------------

            recordReviewActivity(
                selectedTask,
                submission
            );

            // ----------------------------------------------------
            // Simulate backend request.
            //
            // Replace later with:
            //
            // await taskService.respondToReview(...)
            // ----------------------------------------------------

            await new Promise((resolve) =>
                setTimeout(resolve, 500)
            );

            setSelectedTask(updatedTask);

            setResponse("");
            setChangeSummary("");
            setResolvedFeedbackIds([]);

            // ----------------------------------------------------
            // Required successful result.
            // ----------------------------------------------------

            setNotification({
                type: "success",
                message:
                    "Review response submitted successfully.",
            });
        } catch (error) {
            console.error(
                "Unable to respond to review feedback:",
                error
            );

            setNotification({
                type: "error",
                message:
                    "Unable to submit the review response.",
            });
        } finally {
            setSubmitting(false);
        }
    };

    // ============================================================
    // ALTERNATIVE FLOW A1
    //
    // Feedback is unclear.
    //
    // Contributor can request clarification.
    // ============================================================

    const handleRequestClarification = async () => {
        if (!clarificationMessage.trim()) {
            setNotification({
                type: "error",
                message:
                    "Please describe what needs clarification.",
            });

            return;
        }

        try {
            setSendingClarification(true);

            const clarification = {
                id:
                    typeof crypto !== "undefined" &&
                    crypto.randomUUID
                        ? `CLAR-${crypto.randomUUID()}`
                        : `CLAR-${Math.random()
                              .toString(36)
                              .slice(2)}`,

                type: "REVIEW_CLARIFICATION",

                taskId: selectedTask.id,
                taskTitle: selectedTask.title,

                senderId:
                    CURRENT_CONTRIBUTOR.id,

                senderName:
                    CURRENT_CONTRIBUTOR.name,

                recipientId:
                    selectedTask.reviewerId,

                recipientName:
                    selectedTask.reviewerName,

                message:
                    clarificationMessage.trim(),

                createdAt:
                    new Date().toISOString(),
            };

            const existingClarifications =
                JSON.parse(
                    localStorage.getItem(
                        "aipms_review_clarifications"
                    ) || "[]"
                );

            localStorage.setItem(
                "aipms_review_clarifications",
                JSON.stringify([
                    ...existingClarifications,
                    clarification,
                ])
            );

            await new Promise((resolve) =>
                setTimeout(resolve, 400)
            );

            setClarificationMessage("");
            setClarificationOpen(false);

            setNotification({
                type: "success",
                message:
                    "Clarification request sent to the reviewer.",
            });
        } catch (error) {
            console.error(
                "Unable to send clarification:",
                error
            );

            setNotification({
                type: "error",
                message:
                    "Unable to request clarification.",
            });
        } finally {
            setSendingClarification(false);
        }
    };

    // ============================================================
    // ALTERNATIVE FLOW A2
    //
    // Contributor cannot resolve the issue.
    //
    // Contributor requests assistance.
    // ============================================================

    const handleRequestAssistance = async () => {
        if (!assistanceMessage.trim()) {
            setNotification({
                type: "error",
                message:
                    "Please describe the assistance you need.",
            });

            return;
        }

        try {
            setSendingAssistance(true);

            const assistanceRequest = {
                id:
                    typeof crypto !== "undefined" &&
                    crypto.randomUUID
                        ? `HELP-${crypto.randomUUID()}`
                        : `HELP-${Math.random()
                              .toString(36)
                              .slice(2)}`,

                type: "REVIEW_ASSISTANCE_REQUEST",

                taskId: selectedTask.id,
                taskTitle: selectedTask.title,

                contributorId:
                    CURRENT_CONTRIBUTOR.id,

                contributorName:
                    CURRENT_CONTRIBUTOR.name,

                projectId:
                    selectedTask.projectId,

                projectName:
                    selectedTask.projectName,

                message:
                    assistanceMessage.trim(),

                createdAt:
                    new Date().toISOString(),

                status: "Open",
            };

            const existingRequests =
                JSON.parse(
                    localStorage.getItem(
                        "aipms_task_assistance_requests"
                    ) || "[]"
                );

            localStorage.setItem(
                "aipms_task_assistance_requests",
                JSON.stringify([
                    ...existingRequests,
                    assistanceRequest,
                ])
            );

            await new Promise((resolve) =>
                setTimeout(resolve, 400)
            );

            setAssistanceMessage("");
            setAssistanceOpen(false);

            setNotification({
                type: "success",
                message:
                    "Assistance request sent successfully.",
            });
        } catch (error) {
            console.error(
                "Unable to request assistance:",
                error
            );

            setNotification({
                type: "error",
                message:
                    "Unable to request assistance.",
            });
        } finally {
            setSendingAssistance(false);
        }
    };

    // ============================================================
    // LIST VIEW
    // ============================================================

    if (!selectedTask) {
        return (
            <div className="min-h-screen bg-slate-50 p-6">
                <div className="mx-auto max-w-7xl">

                    {/* HEADER */}
                    <div className="mb-6">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-purple-100 p-3 text-purple-700">
                                <MessageCircle size={25} />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">
                                    Respond to Review Feedback
                                </h1>

                                <p className="text-sm text-slate-500">
                                    Review requested changes,
                                    respond to the reviewer,
                                    and resubmit your work.
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
                                    {
                                        CURRENT_CONTRIBUTOR.name
                                    }
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
                            placeholder="Search tasks awaiting review..."
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                        />
                    </div>

                    {/* TASKS */}
                    {filteredTasks.length === 0 ? (
                        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                                <FileText size={26} />
                            </div>

                            <h2 className="mt-4 text-lg font-semibold text-slate-800">
                                No review feedback
                            </h2>

                            <p className="mt-2 text-sm text-slate-500">
                                You currently have no assigned
                                tasks waiting for a review response.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-5 lg:grid-cols-2">
                            {filteredTasks.map(
                                (task) => (
                                    <ReviewTaskCard
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
    // DETAIL VIEW
    // ============================================================

    const feedbackCount =
        selectedTask.reviewFeedback.length;

    const resolvedCount =
        selectedTask.reviewFeedback.filter(
            (feedback) =>
                resolvedFeedbackIds.includes(
                    feedback.id
                )
        ).length;

    const allFeedbackResolved =
        feedbackCount > 0 &&
        resolvedCount === feedbackCount;

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
                        Back
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
                            setNotification(null)
                        }
                    />
                )}

                {/* TASK */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    {/* TASK HEADER */}
                    <div className="border-b border-slate-100 p-6">
                        <p className="text-xs font-semibold text-purple-600">
                            {selectedTask.id}
                        </p>

                        <h1 className="mt-1 text-2xl font-bold text-slate-900">
                            {selectedTask.title}
                        </h1>

                        <p className="mt-3 text-sm leading-6 text-slate-500">
                            {selectedTask.description}
                        </p>
                    </div>

                    {/* TASK INFORMATION */}
                    <div className="grid gap-4 border-b border-slate-100 p-6 sm:grid-cols-2 lg:grid-cols-4">
                        <InfoCard
                            icon={
                                <FileText size={18} />
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
                                <UserRound size={18} />
                            }
                            label="Reviewer"
                            value={
                                selectedTask.reviewerName
                            }
                        />

                        <InfoCard
                            icon={
                                <Clock3 size={18} />
                            }
                            label="Last Submission"
                            value={formatDateTime(
                                selectedTask.lastSubmissionAt
                            )}
                        />
                    </div>

                    {/* ====================================================
                        REVIEW FEEDBACK
                    ==================================================== */}

                    <div className="border-b border-slate-100 p-6">
                        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    Reviewer Feedback
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Review each requested change
                                    before resubmitting.
                                </p>
                            </div>

                            <div className="rounded-full bg-purple-100 px-3 py-1.5 text-xs font-semibold text-purple-700">
                                {resolvedCount}/
                                {feedbackCount} addressed
                            </div>
                        </div>

                        <div className="space-y-4">
                            {selectedTask.reviewFeedback.map(
                                (feedback) => {
                                    const resolved =
                                        resolvedFeedbackIds.includes(
                                            feedback.id
                                        );

                                    return (
                                        <div
                                            key={
                                                feedback.id
                                            }
                                            className={`rounded-2xl border p-5 transition ${
                                                resolved
                                                    ? "border-emerald-200 bg-emerald-50"
                                                    : "border-slate-200 bg-slate-50"
                                            }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div
                                                    className={`rounded-xl p-2.5 ${
                                                        resolved
                                                            ? "bg-emerald-100 text-emerald-600"
                                                            : "bg-purple-100 text-purple-600"
                                                    }`}
                                                >
                                                    {resolved ? (
                                                        <CheckCircle2
                                                            size={
                                                                19
                                                            }
                                                        />
                                                    ) : (
                                                        <MessageCircle
                                                            size={
                                                                19
                                                            }
                                                        />
                                                    )}
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <p className="font-semibold text-slate-800">
                                                            {
                                                                feedback.reviewerName
                                                            }
                                                        </p>

                                                        <span className="text-xs text-slate-400">
                                                            {formatDateTime(
                                                                feedback.createdAt
                                                            )}
                                                        </span>
                                                    </div>

                                                    <p className="mt-3 text-sm leading-6 text-slate-700">
                                                        {
                                                            feedback.message
                                                        }
                                                    </p>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            toggleFeedbackResolved(
                                                                feedback.id
                                                            )
                                                        }
                                                        className={`mt-4 rounded-xl px-4 py-2 text-xs font-semibold transition ${
                                                            resolved
                                                                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                                                : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                                                        }`}
                                                    >
                                                        {resolved
                                                            ? "Change Addressed"
                                                            : "Mark as Addressed"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    </div>

                    {/* ====================================================
                        REQUIRED CHANGES
                    ==================================================== */}

                    <div className="border-b border-slate-100 p-6">
                        <h2 className="text-lg font-bold text-slate-900">
                            Required Changes
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Review the changes requested by the
                            reviewer.
                        </p>

                        <div className="mt-4 space-y-3">
                            {selectedTask.requiredChanges.map(
                                (change, index) => (
                                    <div
                                        key={`${selectedTask.id}-change-${index}`}
                                        className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4"
                                    >
                                        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-700">
                                            {index + 1}
                                        </div>

                                        <p className="text-sm leading-6 text-slate-700">
                                            {change}
                                        </p>
                                    </div>
                                )
                            )}
                        </div>
                    </div>

                    {/* ====================================================
                        CHANGE SUMMARY
                    ==================================================== */}

                    <div className="border-b border-slate-100 p-6">
                        <label
                            htmlFor="change-summary"
                            className="text-sm font-semibold text-slate-800"
                        >
                            Changes Made
                        </label>

                        <p className="mt-1 text-xs text-slate-500">
                            Describe the changes you made to address
                            the review feedback.
                        </p>

                        <textarea
                            id="change-summary"
                            value={changeSummary}
                            onChange={(event) =>
                                setChangeSummary(
                                    event.target.value
                                )
                            }
                            rows={5}
                            placeholder="Example: Updated validation, corrected task state display, and fixed responsive action buttons..."
                            className="mt-3 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                        />
                    </div>

                    {/* ====================================================
                        RESPONSE
                    ==================================================== */}

                    <div className="border-b border-slate-100 p-6">
                        <label
                            htmlFor="review-response"
                            className="text-sm font-semibold text-slate-800"
                        >
                            Response to Reviewer
                        </label>

                        <p className="mt-1 text-xs text-slate-500">
                            Explain how you addressed the review
                            feedback.
                        </p>

                        <textarea
                            id="review-response"
                            value={response}
                            onChange={(event) =>
                                setResponse(
                                    event.target.value
                                )
                            }
                            rows={5}
                            placeholder="Write your response to the reviewer..."
                            className="mt-3 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                        />
                    </div>

                    {/* ====================================================
                        ALTERNATIVE FLOWS
                    ==================================================== */}

                    <div className="grid gap-4 border-b border-slate-100 p-6 md:grid-cols-2">

                        {/* A1 */}
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                            <div className="flex items-start gap-3">
                                <div className="rounded-xl bg-amber-100 p-2.5 text-amber-700">
                                    <AlertCircle
                                        size={19}
                                    />
                                </div>

                                <div>
                                    <h3 className="font-semibold text-amber-900">
                                        Feedback is unclear?
                                    </h3>

                                    <p className="mt-1 text-xs leading-5 text-amber-700">
                                        Request clarification from
                                        the reviewer or Team Leader.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setClarificationOpen(
                                        true
                                    )
                                }
                                className="mt-4 w-full rounded-xl border border-amber-300 bg-white px-4 py-2.5 text-sm font-semibold text-amber-800 transition hover:bg-amber-100"
                            >
                                Request Clarification
                            </button>
                        </div>

                        {/* A2 */}
                        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
                            <div className="flex items-start gap-3">
                                <div className="rounded-xl bg-red-100 p-2.5 text-red-700">
                                    <ShieldAlert
                                        size={19}
                                    />
                                </div>

                                <div>
                                    <h3 className="font-semibold text-red-900">
                                        Cannot resolve the issue?
                                    </h3>

                                    <p className="mt-1 text-xs leading-5 text-red-700">
                                        Report a blocker or request
                                        assistance.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setAssistanceOpen(
                                        true
                                    )
                                }
                                className="mt-4 w-full rounded-xl border border-red-300 bg-white px-4 py-2.5 text-sm font-semibold text-red-800 transition hover:bg-red-100"
                            >
                                Request Assistance
                            </button>
                        </div>
                    </div>

                    {/* ====================================================
                        SUBMIT
                    ==================================================== */}

                    <div className="p-6">
                        <div className="rounded-2xl border border-purple-100 bg-purple-50 p-5">
                            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <h2 className="font-bold text-slate-900">
                                        Resubmit for Review
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Your task will remain in
                                        <strong> Review </strong>
                                        and return to the Manager /
                                        authorized reviewer.
                                    </p>

                                    <p className="mt-2 text-xs font-medium text-purple-700">
                                        Contributor cannot approve
                                        their own task.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    disabled={
                                        submitting ||
                                        !allFeedbackResolved
                                    }
                                    onClick={
                                        handleSubmitResponse
                                    }
                                    className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                                >
                                    {submitting ? (
                                        <>
                                            <RefreshCw
                                                size={17}
                                                className="animate-spin"
                                            />
                                            Resubmitting...
                                        </>
                                    ) : (
                                        <>
                                            <Send
                                                size={17}
                                            />
                                            Submit for Review
                                        </>
                                    )}
                                </button>
                            </div>

                            {!allFeedbackResolved && (
                                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
                                    Please mark all review feedback
                                    items as addressed before
                                    resubmitting.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ============================================================
                CLARIFICATION MODAL
            ============================================================ */}

            {clarificationOpen && (
                <Modal
                    title="Request Clarification"
                    icon={
                        <AlertCircle size={20} />
                    }
                    onClose={() =>
                        setClarificationOpen(
                            false
                        )
                    }
                >
                    <p className="mb-4 text-sm text-slate-500">
                        Ask the reviewer or Team Leader to clarify
                        the requested change.
                    </p>

                    <textarea
                        value={
                            clarificationMessage
                        }
                        onChange={(event) =>
                            setClarificationMessage(
                                event.target.value
                            )
                        }
                        rows={5}
                        placeholder="Explain what is unclear..."
                        className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                    />

                    <div className="mt-4 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() =>
                                setClarificationOpen(
                                    false
                                )
                            }
                            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            disabled={
                                sendingClarification
                            }
                            onClick={
                                handleRequestClarification
                            }
                            className="flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 disabled:bg-slate-300"
                        >
                            {sendingClarification ? (
                                <>
                                    <RefreshCw
                                        size={16}
                                        className="animate-spin"
                                    />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send size={16} />
                                    Send Request
                                </>
                            )}
                        </button>
                    </div>
                </Modal>
            )}

            {/* ============================================================
                ASSISTANCE MODAL
            ============================================================ */}

            {assistanceOpen && (
                <Modal
                    title="Request Assistance"
                    icon={
                        <ShieldAlert size={20} />
                    }
                    onClose={() =>
                        setAssistanceOpen(
                            false
                        )
                    }
                >
                    <p className="mb-4 text-sm text-slate-500">
                        Describe the issue you cannot resolve so the
                        Team Leader or Manager can assist you.
                    </p>

                    <textarea
                        value={
                            assistanceMessage
                        }
                        onChange={(event) =>
                            setAssistanceMessage(
                                event.target.value
                            )
                        }
                        rows={5}
                        placeholder="Describe the issue and assistance you need..."
                        className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                    />

                    <div className="mt-4 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() =>
                                setAssistanceOpen(
                                    false
                                )
                            }
                            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            disabled={
                                sendingAssistance
                            }
                            onClick={
                                handleRequestAssistance
                            }
                            className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:bg-slate-300"
                        >
                            {sendingAssistance ? (
                                <>
                                    <RefreshCw
                                        size={16}
                                        className="animate-spin"
                                    />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send size={16} />
                                    Request Assistance
                                </>
                            )}
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
}

// ============================================================
// REVIEW TASK CARD
// ============================================================

function ReviewTaskCard({
    task,
    onOpen,
}) {
    const feedbackCount =
        task.reviewFeedback.length;

    const unresolvedCount =
        task.reviewFeedback.filter(
            (feedback) => !feedback.resolved
        ).length;

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-purple-200 hover:shadow-md">

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

            <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
                {task.description}
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <SmallInfo
                    icon={
                        <FileText size={16} />
                    }
                    label="Project"
                    value={task.projectName}
                />

                <SmallInfo
                    icon={
                        <UserRound size={16} />
                    }
                    label="Reviewer"
                    value={task.reviewerName}
                />

                <SmallInfo
                    icon={
                        <MessageCircle size={16} />
                    }
                    label="Feedback"
                    value={`${feedbackCount} item${
                        feedbackCount !== 1
                            ? "s"
                            : ""
                    }`}
                />

                <SmallInfo
                    icon={
                        <AlertCircle size={16} />
                    }
                    label="Unresolved"
                    value={`${unresolvedCount}`}
                />
            </div>

            <div className="mt-5 flex items-center justify-between rounded-xl bg-purple-50 p-3">
                <span className="text-xs font-medium text-purple-700">
                    Review feedback requires your response
                </span>

                <span className="text-xs font-bold text-purple-700">
                    {task.progress}%
                </span>
            </div>

            <button
                type="button"
                onClick={onOpen}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
            >
                <MessageCircle size={17} />
                Respond to Feedback
            </button>
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
// MODAL
// ============================================================

function Modal({
    title,
    icon,
    children,
    onClose,
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

                <div className="flex items-center justify-between border-b border-slate-100 p-5">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-slate-100 p-2.5 text-slate-700">
                            {icon}
                        </div>

                        <h2 className="font-bold text-slate-900">
                            {title}
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                        aria-label="Close modal"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="p-5">
                    {children}
                </div>
            </div>
        </div>
    );
}