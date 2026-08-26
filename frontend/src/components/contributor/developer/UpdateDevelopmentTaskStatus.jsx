import { useState } from "react";
import {
    AlertCircle,
    CheckCircle2,
    Clock3,
    Lock,
    MessageSquareText,
    Save,
    X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import api from "@/services/api";

// ============================================================
// CONT-DEV-003
// UPDATE DEVELOPMENT TASK STATUS
// ============================================================

const STATUS_OPTIONS = [
    {
        value: "Backlog",
        label: "Backlog",
        description: "Task has not started yet.",
        icon: Clock3,
    },
    {
        value: "In Progress",
        label: "In Progress",
        description: "Development work is currently active.",
        icon: Clock3,
    },
    {
        value: "Review",
        label: "Review",
        description: "Development work is ready for review.",
        icon: CheckCircle2,
    },
    {
        value: "Done",
        label: "Done",
        description: "Development task has been completed.",
        icon: CheckCircle2,
    },
    {
        value: "Blocked",
        label: "Blocked",
        description: "A technical issue is preventing progress.",
        icon: AlertCircle,
    },
];

// ============================================================
// STATUS TRANSITIONS
// ============================================================

const ALLOWED_TRANSITIONS = {
    Backlog: ["In Progress"],
    "In Progress": ["Review", "Blocked"],
    Blocked: ["In Progress"],
    Review: ["Done", "In Progress"],
    Done: [],
};

// ============================================================
// COMPONENT
// ============================================================

function UpdateDevelopmentTaskStatus({
    task,
    onClose,
    onUpdated,
}) {
    const [selectedStatus, setSelectedStatus] = useState(
        task?.status || "Backlog"
    );

    const [progressNote, setProgressNote] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    // --------------------------------------------------------
    // No task
    // --------------------------------------------------------

    if (!task) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-900/40 dark:bg-red-950/20">
                <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600" />

                    <p className="text-sm font-medium text-red-700 dark:text-red-400">
                        Task not found.
                    </p>
                </div>
            </div>
        );
    }

    // --------------------------------------------------------
    // Current status
    // --------------------------------------------------------

    const currentStatus =
        task.status || "Backlog";

    // --------------------------------------------------------
    // Allowed next statuses
    // --------------------------------------------------------

    const allowedStatuses =
        ALLOWED_TRANSITIONS[currentStatus] || [];

    // --------------------------------------------------------
    // Submit
    // --------------------------------------------------------

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        // ----------------------------------------------------
        // Task closed
        // ----------------------------------------------------

        if (
            currentStatus === "Done" ||
            task.isClosed === true ||
            task.closed === true
        ) {
            setError(
                "This task cannot be modified."
            );

            return;
        }

        // ----------------------------------------------------
        // No status selected
        // ----------------------------------------------------

        if (!selectedStatus) {
            setError(
                "Please select a status."
            );

            return;
        }

        // ----------------------------------------------------
        // Same status
        // ----------------------------------------------------

        if (
            selectedStatus === currentStatus
        ) {
            setError(
                "Please select a different status."
            );

            return;
        }

        // ----------------------------------------------------
        // Validate transition
        // ----------------------------------------------------

        if (
            !allowedStatuses.includes(
                selectedStatus
            )
        ) {
            setError(
                "This status transition is not allowed."
            );

            return;
        }

        try {
            setLoading(true);

            // ------------------------------------------------
            // Backend payload
            // ------------------------------------------------

            const payload = {
                status: selectedStatus,
                progressNote:
                    progressNote.trim() || null,
            };

            // ------------------------------------------------
            // Task ID
            // ------------------------------------------------

            const taskId =
                task.taskId ??
                task.id ??
                task.TaskId;

            if (!taskId) {
                setError(
                    "Task ID is missing."
                );

                return;
            }

            // ------------------------------------------------
            // API request
            // ------------------------------------------------
            //
            // Adjust this endpoint if your backend controller
            // uses a different route.
            //

            await api.put(
                `/Tasks/${taskId}/status`,
                payload
            );

            // ------------------------------------------------
            // Success
            // ------------------------------------------------

            setSuccess(
                "Development task status updated successfully."
            );

            // ------------------------------------------------
            // Notify parent component
            // ------------------------------------------------

            if (onUpdated) {
                onUpdated({
                    ...task,
                    status: selectedStatus,
                    progressNote:
                        progressNote.trim() || null,
                });
            }

            // ------------------------------------------------
            // Close after successful update
            // ------------------------------------------------

            setTimeout(() => {
                if (onClose) {
                    onClose();
                }
            }, 900);
        } catch (requestError) {
            console.error(
                "Update development task status error:",
                requestError
            );

            const status =
                requestError?.response?.status;

            // ------------------------------------------------
            // 403
            // ------------------------------------------------

            if (status === 403) {
                setError(
                    "You cannot update this task."
                );

                return;
            }

            // ------------------------------------------------
            // 404
            // ------------------------------------------------

            if (status === 404) {
                setError(
                    "Task not found."
                );

                return;
            }

            // ------------------------------------------------
            // 409
            // ------------------------------------------------

            if (status === 409) {
                setError(
                    "This status transition is not allowed."
                );

                return;
            }

            // ------------------------------------------------
            // General failure
            // ------------------------------------------------

            setError(
                requestError?.response?.data?.message ||
                    "Unable to update task status. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // ========================================================
    // UI
    // ========================================================

    return (
        <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-[#0b223d]">
            {/* ------------------------------------------------ */}
            {/* HEADER */}
            {/* ------------------------------------------------ */}

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-700">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                        Update Development Task Status
                    </h2>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Update the progress of your assigned development task.
                    </p>
                </div>

                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>

            {/* ------------------------------------------------ */}
            {/* TASK INFORMATION */}
            {/* ------------------------------------------------ */}

            <div className="px-6 pt-6">
                <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900/50">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Task
                    </p>

                    <p className="mt-1 text-base font-semibold text-slate-900 dark:text-white">
                        {task.title ||
                            task.taskTitle ||
                            "Untitled Task"}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                            Current: {currentStatus}
                        </span>

                        {task.projectName && (
                            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                {task.projectName}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* ------------------------------------------------ */}
            {/* FORM */}
            {/* ------------------------------------------------ */}

            <form
                onSubmit={handleSubmit}
                className="space-y-6 p-6"
            >
                {/* -------------------------------------------- */}
                {/* ERROR */}
                {/* -------------------------------------------- */}

                {error && (
                    <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/40 dark:bg-red-950/20">
                        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />

                        <p className="text-sm text-red-700 dark:text-red-300">
                            {error}
                        </p>
                    </div>
                )}

                {/* -------------------------------------------- */}
                {/* SUCCESS */}
                {/* -------------------------------------------- */}

                {success && (
                    <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />

                        <p className="text-sm text-emerald-700 dark:text-emerald-300">
                            {success}
                        </p>
                    </div>
                )}

                {/* -------------------------------------------- */}
                {/* STATUS */}
                {/* -------------------------------------------- */}

                <div>
                    <label className="mb-3 block text-sm font-semibold text-slate-900 dark:text-white">
                        Select New Status
                    </label>

                    <div className="space-y-3">
                        {STATUS_OPTIONS.map(
                            (option) => {
                                const Icon =
                                    option.icon;

                                const isCurrent =
                                    option.value ===
                                    currentStatus;

                                const isAllowed =
                                    allowedStatuses.includes(
                                        option.value
                                    );

                                const disabled =
                                    isCurrent ||
                                    !isAllowed ||
                                    loading;

                                return (
                                    <button
                                        key={
                                            option.value
                                        }
                                        type="button"
                                        disabled={
                                            disabled
                                        }
                                        onClick={() =>
                                            setSelectedStatus(
                                                option.value
                                            )
                                        }
                                        className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${
                                            selectedStatus ===
                                            option.value
                                                ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/30"
                                                : "border-slate-200 bg-white hover:border-blue-300 dark:border-slate-700 dark:bg-slate-900/30"
                                        } ${
                                            disabled
                                                ? "cursor-not-allowed opacity-50"
                                                : "cursor-pointer"
                                        }`}
                                    >
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                                            <Icon className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="font-medium text-slate-900 dark:text-white">
                                                {
                                                    option.label
                                                }

                                                {isCurrent && (
                                                    <span className="ml-2 text-xs text-slate-500">
                                                        Current
                                                    </span>
                                                )}
                                            </p>

                                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                                {
                                                    option.description
                                                }
                                            </p>
                                        </div>
                                    </button>
                                );
                            }
                        )}
                    </div>
                </div>

                {/* -------------------------------------------- */}
                {/* PROGRESS NOTE */}
                {/* -------------------------------------------- */}

                <div>
                    <label
                        htmlFor="progressNote"
                        className="mb-2 block text-sm font-semibold text-slate-900 dark:text-white"
                    >
                        Progress Note
                        <span className="ml-1 font-normal text-slate-500">
                            (Optional)
                        </span>
                    </label>

                    <div className="relative">
                        <MessageSquareText className="absolute left-3 top-3 h-5 w-5 text-slate-400" />

                        <textarea
                            id="progressNote"
                            value={progressNote}
                            onChange={(event) =>
                                setProgressNote(
                                    event.target.value
                                )
                            }
                            rows={4}
                            maxLength={1000}
                            disabled={loading}
                            placeholder="Describe the progress or reason for the status change..."
                            className="w-full resize-none rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                        />
                    </div>

                    <p className="mt-1 text-right text-xs text-slate-400">
                        {progressNote.length}/1000
                    </p>
                </div>

                {/* -------------------------------------------- */}
                {/* WORKFLOW INFO */}
                {/* -------------------------------------------- */}

                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/40 dark:bg-blue-950/20">
                    <div className="flex items-start gap-3">
                        <Lock className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />

                        <div>
                            <p className="text-sm font-semibold text-blue-900 dark:text-blue-200">
                                Development Workflow
                            </p>

                            <p className="mt-1 text-xs leading-5 text-blue-700 dark:text-blue-300">
                                Backlog → In Progress → Review → Done
                                <br />
                                In Progress → Blocked
                            </p>
                        </div>
                    </div>
                </div>

                {/* -------------------------------------------- */}
                {/* ACTIONS */}
                {/* -------------------------------------------- */}

                <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end dark:border-slate-700">
                    {onClose && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                    )}

                    <Button
                        type="submit"
                        disabled={
                            loading ||
                            !selectedStatus ||
                            selectedStatus ===
                                currentStatus
                        }
                        className="gap-2"
                    >
                        <Save className="h-4 w-4" />

                        {loading
                            ? "Updating..."
                            : "Update Status"}
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default UpdateDevelopmentTaskStatus;