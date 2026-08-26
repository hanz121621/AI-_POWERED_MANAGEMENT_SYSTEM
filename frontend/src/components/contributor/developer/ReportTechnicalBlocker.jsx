import { useState } from "react";

import {
    AlertCircle,
    CheckCircle2,
    FileText,
    Link2,
    Send,
    X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import api from "@/services/api";

// ============================================================
// CONT-DEV-004
// REPORT TECHNICAL BLOCKER
// ============================================================

function ReportTechnicalBlocker({
    task,
    onClose,
    onSubmitted,
}) {
    // ========================================================
    // FORM STATE
    // ========================================================

    const [blockerDescription, setBlockerDescription] =
        useState("");

    const [impact, setImpact] = useState("");

    const [requiredAssistance, setRequiredAssistance] =
        useState("");

    const [attachment, setAttachment] =
        useState(null);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    // ========================================================
    // TASK VALIDATION
    // ========================================================

    if (!task) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-900/40 dark:bg-red-950/20">
                <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />

                    <p className="text-sm font-medium text-red-700 dark:text-red-300">
                        Task not found.
                    </p>
                </div>
            </div>
        );
    }

    // ========================================================
    // HANDLE FILE
    // ========================================================

    const handleFileChange = (event) => {
        const file =
            event.target.files?.[0];

        setError("");

        if (!file) {
            setAttachment(null);
            return;
        }

        // ----------------------------------------------------
        // Maximum file size: 10 MB
        // ----------------------------------------------------

        const MAX_FILE_SIZE =
            10 * 1024 * 1024;

        if (file.size > MAX_FILE_SIZE) {
            setError(
                "File size exceeds the allowed limit of 10 MB."
            );

            event.target.value = "";
            setAttachment(null);

            return;
        }

        setAttachment(file);
    };

    // ========================================================
    // SUBMIT BLOCKER
    // ========================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        // ----------------------------------------------------
        // Required blocker description
        // ----------------------------------------------------

        if (
            !blockerDescription.trim()
        ) {
            setError(
                "Please describe the blocker."
            );

            return;
        }

        // ----------------------------------------------------
        // Get task ID
        // ----------------------------------------------------

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

        try {
            setLoading(true);

            // ------------------------------------------------
            // Prepare form data
            // ------------------------------------------------

            const formData =
                new FormData();

            formData.append(
                "taskId",
                String(taskId)
            );

            formData.append(
                "blockerDescription",
                blockerDescription.trim()
            );

            formData.append(
                "impact",
                impact.trim()
            );

            formData.append(
                "requiredAssistance",
                requiredAssistance.trim()
            );

            if (attachment) {
                formData.append(
                    "attachment",
                    attachment
                );
            }

            // ------------------------------------------------
            // Submit blocker
            // ------------------------------------------------

            await api.post(
                `/Tasks/${taskId}/blockers`,
                formData,
                {
                    headers: {
                        "Content-Type":
                            "multipart/form-data",
                    },
                }
            );

            // ------------------------------------------------
            // Success
            // ------------------------------------------------

            setSuccess(
                "Technical blocker reported successfully."
            );

            // ------------------------------------------------
            // Notify parent
            // ------------------------------------------------

            if (onSubmitted) {
                onSubmitted({
                    taskId,
                    blockerDescription:
                        blockerDescription.trim(),
                    impact: impact.trim(),
                    requiredAssistance:
                        requiredAssistance.trim(),
                    attachment,
                });
            }

            // ------------------------------------------------
            // Reset form
            // ------------------------------------------------

            setBlockerDescription("");
            setImpact("");
            setRequiredAssistance("");
            setAttachment(null);

            // ------------------------------------------------
            // Close after success
            // ------------------------------------------------

            setTimeout(() => {
                if (onClose) {
                    onClose();
                }
            }, 1000);
        } catch (requestError) {
            console.error(
                "Report technical blocker error:",
                requestError
            );

            const status =
                requestError?.response?.status;

            // ------------------------------------------------
            // Permission
            // ------------------------------------------------

            if (status === 403) {
                setError(
                    "You do not have permission to report a blocker for this task."
                );

                return;
            }

            // ------------------------------------------------
            // Task not found
            // ------------------------------------------------

            if (status === 404) {
                setError(
                    "Task not found."
                );

                return;
            }

            // ------------------------------------------------
            // General failure
            // ------------------------------------------------

            setError(
                requestError?.response?.data?.message ||
                    "Unable to report blocker. Please try again."
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

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-700">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                        Report Technical Blocker
                    </h2>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Report an issue that is preventing progress on your development task.
                    </p>
                </div>

                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-white"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>

            {/* ================================================= */}
            {/* TASK INFORMATION */}
            {/* ================================================= */}

            <div className="px-6 pt-6">
                <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900/50">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Affected Task
                    </p>

                    <p className="mt-1 text-base font-semibold text-slate-900 dark:text-white">
                        {task.title ||
                            task.taskTitle ||
                            "Untitled Task"}
                    </p>

                    {task.projectName && (
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Project:{" "}
                            {task.projectName}
                        </p>
                    )}
                </div>
            </div>

            {/* ================================================= */}
            {/* FORM */}
            {/* ================================================= */}

            <form
                onSubmit={handleSubmit}
                className="space-y-6 p-6"
            >
                {/* ================================================= */}
                {/* ERROR */}
                {/* ================================================= */}

                {error && (
                    <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/40 dark:bg-red-950/20">
                        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />

                        <p className="text-sm text-red-700 dark:text-red-300">
                            {error}
                        </p>
                    </div>
                )}

                {/* ================================================= */}
                {/* SUCCESS */}
                {/* ================================================= */}

                {success && (
                    <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />

                        <p className="text-sm text-emerald-700 dark:text-emerald-300">
                            {success}
                        </p>
                    </div>
                )}

                {/* ================================================= */}
                {/* BLOCKER DESCRIPTION */}
                {/* ================================================= */}

                <div>
                    <label
                        htmlFor="blockerDescription"
                        className="mb-2 block text-sm font-semibold text-slate-900 dark:text-white"
                    >
                        Blocker Description
                        <span className="ml-1 text-red-500">
                            *
                        </span>
                    </label>

                    <div className="relative">
                        <FileText className="absolute left-3 top-3 h-5 w-5 text-slate-400" />

                        <textarea
                            id="blockerDescription"
                            value={
                                blockerDescription
                            }
                            onChange={(event) =>
                                setBlockerDescription(
                                    event.target.value
                                )
                            }
                            rows={5}
                            maxLength={2000}
                            disabled={loading}
                            placeholder="Describe the technical issue that is preventing you from progressing..."
                            className="w-full resize-none rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                        />
                    </div>

                    <p className="mt-1 text-right text-xs text-slate-400">
                        {
                            blockerDescription.length
                        }
                        /2000
                    </p>
                </div>

                {/* ================================================= */}
                {/* IMPACT */}
                {/* ================================================= */}

                <div>
                    <label
                        htmlFor="blockerImpact"
                        className="mb-2 block text-sm font-semibold text-slate-900 dark:text-white"
                    >
                        Impact
                        <span className="ml-1 font-normal text-slate-500">
                            (Optional)
                        </span>
                    </label>

                    <textarea
                        id="blockerImpact"
                        value={impact}
                        onChange={(event) =>
                            setImpact(
                                event.target.value
                            )
                        }
                        rows={3}
                        maxLength={1000}
                        disabled={loading}
                        placeholder="Explain how this blocker affects the task, sprint, or project..."
                        className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                    />
                </div>

                {/* ================================================= */}
                {/* REQUIRED ASSISTANCE */}
                {/* ================================================= */}

                <div>
                    <label
                        htmlFor="requiredAssistance"
                        className="mb-2 block text-sm font-semibold text-slate-900 dark:text-white"
                    >
                        Required Assistance
                        <span className="ml-1 font-normal text-slate-500">
                            (Optional)
                        </span>
                    </label>

                    <textarea
                        id="requiredAssistance"
                        value={
                            requiredAssistance
                        }
                        onChange={(event) =>
                            setRequiredAssistance(
                                event.target.value
                            )
                        }
                        rows={3}
                        maxLength={1000}
                        disabled={loading}
                        placeholder="Describe the help or decision you need from the Team Leader or Manager..."
                        className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                    />
                </div>

                {/* ================================================= */}
                {/* ATTACHMENT */}
                {/* ================================================= */}

                <div>
                    <label
                        htmlFor="blockerAttachment"
                        className="mb-2 block text-sm font-semibold text-slate-900 dark:text-white"
                    >
                        Attachment
                        <span className="ml-1 font-normal text-slate-500">
                            (Optional)
                        </span>
                    </label>

                    <div className="rounded-xl border border-dashed border-slate-300 p-4 dark:border-slate-600">
                        <div className="flex items-center gap-3">
                            <Link2 className="h-5 w-5 text-slate-400" />

                            <div className="min-w-0 flex-1">
                                <p className="text-sm text-slate-600 dark:text-slate-300">
                                    Attach an error log, screenshot, report, or other supporting file.
                                </p>

                                <p className="mt-1 text-xs text-slate-400">
                                    Maximum file size: 10 MB
                                </p>
                            </div>

                            <label className="cursor-pointer rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800">
                                Choose File

                                <input
                                    id="blockerAttachment"
                                    type="file"
                                    onChange={
                                        handleFileChange
                                    }
                                    disabled={loading}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        {attachment && (
                            <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600 dark:bg-slate-900/50 dark:text-slate-300">
                                Selected:{" "}
                                <span className="font-medium">
                                    {
                                        attachment.name
                                    }
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* ================================================= */}
                {/* WORKFLOW NOTICE */}
                {/* ================================================= */}

                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />

                        <div>
                            <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                                Technical Blocker Workflow
                            </p>

                            <p className="mt-1 text-xs leading-5 text-amber-700 dark:text-amber-300">
                                The blocker is reported to the Team Leader.
                                The task may be moved to Blocked when appropriate.
                                The Manager may be notified when escalation is required.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ================================================= */}
                {/* ACTIONS */}
                {/* ================================================= */}

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
                            !blockerDescription.trim()
                        }
                        className="gap-2"
                    >
                        <Send className="h-4 w-4" />

                        {loading
                            ? "Reporting..."
                            : "Report Blocker"}
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default ReportTechnicalBlocker;