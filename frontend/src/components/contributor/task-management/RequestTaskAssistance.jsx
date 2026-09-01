import { useMemo, useState } from "react";
import {
    AlertCircle,
    CheckCircle2,
    CircleUserRound,
   
    HelpCircle,
    MessageSquareText,
    Send,
    X,
} from "lucide-react";

// ============================================================
// CONT-TASK SUPPORT COMPONENT
// Request Task Assistance
// ============================================================

const CURRENT_CONTRIBUTOR = {
    id: "USER-003",
    name: "Hana Nigussie",
    role: "Contributor",
};

const INITIAL_TASKS = [
    {
        id: "TASK-001",
        title: "Implement Contributor Dashboard",
        projectName: "AI Powered Management System",
        assigneeId: "USER-003",
        assigneeName: "Hana Nigussie",
        status: "In Progress",
    },
    {
        id: "TASK-002",
        title: "Implement Project Participation",
        projectName: "AI Powered Management System",
        assigneeId: "USER-003",
        assigneeName: "Hana Nigussie",
        status: "In Progress",
    },
    {
        id: "TASK-003",
        title: "Prepare Project Documentation",
        projectName: "AI Powered Management System",
        assigneeId: "USER-004",
        assigneeName: "Team Member",
        status: "Backlog",
    },
    {
        id: "TASK-004",
        title: "Database Integration",
        projectName: "AI Powered Management System",
        assigneeId: "USER-003",
        assigneeName: "Hana Nigussie",
        status: "Blocked",
    },
];

const ASSISTANCE_TYPES = [
    "Technical assistance",
    "Requirement clarification",
    "Dependency assistance",
    "Access / permission issue",
    "Review assistance",
    "Other",
];

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function RequestTaskAssistance() {
    const [tasks] = useState(INITIAL_TASKS);

    const [selectedTask, setSelectedTask] = useState(null);

    const [assistanceType, setAssistanceType] = useState(
        "Technical assistance"
    );

    const [description, setDescription] = useState("");

    const [urgency, setUrgency] = useState("Normal");

    const [notification, setNotification] = useState(null);

    const [submitting, setSubmitting] = useState(false);

    const assignedTasks = useMemo(() => {
        return tasks.filter(
            (task) =>
                task.assigneeId === CURRENT_CONTRIBUTOR.id
        );
    }, [tasks]);

    // ============================================================
    // OPEN TASK
    // ============================================================

    const openTask = (task) => {
        setSelectedTask(task);
        setDescription("");
        setAssistanceType("Technical assistance");
        setUrgency("Normal");
        setNotification(null);
    };

    // ============================================================
    // CLOSE
    // ============================================================

    const closeForm = () => {
        setSelectedTask(null);
        setNotification(null);
    };

    // ============================================================
    // SUBMIT ASSISTANCE REQUEST
    // ============================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!selectedTask) {
            return;
        }

        if (!description.trim()) {
            setNotification({
                type: "error",
                message: "Please describe the assistance you need.",
            });

            return;
        }

        try {
            setSubmitting(true);
            setNotification(null);

            const request = {
                id: `ASSIST-${crypto.randomUUID()}`,
                taskId: selectedTask.id,
                taskTitle: selectedTask.title,
                projectName: selectedTask.projectName,
                contributorId: CURRENT_CONTRIBUTOR.id,
                contributorName: CURRENT_CONTRIBUTOR.name,
                assistanceType,
                urgency,
                description: description.trim(),
                status: "Open",
                createdAt: new Date().toISOString(),
            };

            const existingRequests = JSON.parse(
                localStorage.getItem(
                    "aipms_task_assistance_requests"
                ) || "[]"
            );

            localStorage.setItem(
                "aipms_task_assistance_requests",
                JSON.stringify([
                    ...existingRequests,
                    request,
                ])
            );

            const activity = {
                id: `ACT-${crypto.randomUUID()}`,
                type: "TASK_ASSISTANCE_REQUESTED",
                taskId: selectedTask.id,
                taskTitle: selectedTask.title,
                userId: CURRENT_CONTRIBUTOR.id,
                userName: CURRENT_CONTRIBUTOR.name,
                description: `Assistance requested for task "${selectedTask.title}".`,
                timestamp: request.createdAt,
            };

            const activities = JSON.parse(
                localStorage.getItem(
                    "aipms_task_activities"
                ) || "[]"
            );

            localStorage.setItem(
                "aipms_task_activities",
                JSON.stringify([
                    ...activities,
                    activity,
                ])
            );

            await new Promise((resolve) =>
                setTimeout(resolve, 400)
            );

            setNotification({
                type: "success",
                message:
                    "Assistance request submitted successfully.",
            });

            setDescription("");
        } catch (error) {
            console.error(
                "Unable to submit assistance request:",
                error
            );

            setNotification({
                type: "error",
                message:
                    "Unable to submit assistance request.",
            });
        } finally {
            setSubmitting(false);
        }
    };

    // ============================================================
    // TASK SELECTION
    // ============================================================

    if (!selectedTask) {
        return (
            <div className="min-h-screen bg-slate-50 p-6">
                <div className="mx-auto max-w-6xl">

                    <div className="mb-6">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
                                <HelpCircle size={25} />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">
                                    Request Task Assistance
                                </h1>

                                <p className="text-sm text-slate-500">
                                    Request help when you cannot continue
                                    a task without assistance.
                                </p>
                            </div>
                        </div>
                    </div>

                    {notification && (
                        <Notification
                            notification={notification}
                            onClose={() =>
                                setNotification(null)
                            }
                        />
                    )}

                    <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-white p-3 text-blue-600">
                                <CircleUserRound size={21} />
                            </div>

                            <div>
                                <p className="text-xs font-medium text-blue-600">
                                    Contributor
                                </p>

                                <p className="font-semibold text-blue-900">
                                    {CURRENT_CONTRIBUTOR.name}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        {assignedTasks.map((task) => (
                            <div
                                key={task.id}
                                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-xs font-semibold text-blue-600">
                                            {task.id}
                                        </p>

                                        <h2 className="mt-1 text-lg font-bold text-slate-900">
                                            {task.title}
                                        </h2>
                                    </div>

                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                        {task.status}
                                    </span>
                                </div>

                                <p className="mt-2 text-sm text-slate-500">
                                    {task.projectName}
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        openTask(task)
                                    }
                                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                                >
                                    <HelpCircle size={17} />
                                    Request Assistance
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // ============================================================
    // ASSISTANCE FORM
    // ============================================================

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="mx-auto max-w-4xl">

                <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold text-blue-600">
                            {selectedTask.id}
                        </p>

                        <h1 className="text-2xl font-bold text-slate-900">
                            Request Assistance
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            {selectedTask.title}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={closeForm}
                        className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 hover:bg-slate-100"
                    >
                        <X size={19} />
                    </button>
                </div>

                {notification && (
                    <Notification
                        notification={notification}
                        onClose={() =>
                            setNotification(null)
                        }
                    />
                )}

                <form
                    onSubmit={handleSubmit}
                    className="rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                    <div className="border-b border-slate-100 p-6">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                                <MessageSquareText size={21} />
                            </div>

                            <div>
                                <h2 className="font-bold text-slate-900">
                                    Assistance Details
                                </h2>

                                <p className="text-sm text-slate-500">
                                    Provide enough information for the
                                    team to understand your request.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 p-6">

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Assistance Type
                            </label>

                            <select
                                value={assistanceType}
                                onChange={(event) =>
                                    setAssistanceType(
                                        event.target.value
                                    )
                                }
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            >
                                {ASSISTANCE_TYPES.map(
                                    (type) => (
                                        <option
                                            key={type}
                                            value={type}
                                        >
                                            {type}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Urgency
                            </label>

                            <select
                                value={urgency}
                                onChange={(event) =>
                                    setUrgency(
                                        event.target.value
                                    )
                                }
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
                            >
                                <option value="Low">
                                    Low
                                </option>

                                <option value="Normal">
                                    Normal
                                </option>

                                <option value="High">
                                    High
                                </option>

                                <option value="Critical">
                                    Critical
                                </option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Describe the Assistance Needed
                            </label>

                            <textarea
                                value={description}
                                onChange={(event) =>
                                    setDescription(
                                        event.target.value
                                    )
                                }
                                rows={7}
                                placeholder="Explain what you are trying to do, what problem you encountered, and what assistance you need..."
                                className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm leading-6 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                            <p className="mt-2 text-xs text-slate-400">
                                {description.length} characters
                            </p>
                        </div>

                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                            <div className="flex items-start gap-3">
                                <AlertCircle
                                    size={19}
                                    className="mt-0.5 shrink-0 text-amber-600"
                                />

                                <div>
                                    <p className="text-sm font-semibold text-amber-800">
                                        Before submitting
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-amber-700">
                                        Explain the problem clearly so
                                        the Team Leader or Manager can
                                        provide appropriate assistance.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col-reverse gap-3 border-t border-slate-100 p-6 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={closeForm}
                            className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                        >
                            {submitting ? (
                                <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Send size={17} />
                                    Submit Request
                                </>
                            )}
                        </button>
                    </div>
                </form>
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
    const success =
        notification.type === "success";

    return (
        <div
            className={`mb-5 flex items-center justify-between gap-4 rounded-xl border p-4 ${
                success
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-red-200 bg-red-50 text-red-700"
            }`}
        >
            <div className="flex items-center gap-2">
                {success ? (
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
                className="rounded-lg p-1 hover:bg-black/5"
            >
                <X size={17} />
            </button>
        </div>
    );
}