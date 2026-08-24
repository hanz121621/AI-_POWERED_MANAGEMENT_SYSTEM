import React, { useState } from "react";
import {
    AlertTriangle,
    UserRound,
    Mail,
    X,
    Trash2,
    Loader2,
    CheckCircle2,
} from "lucide-react";

function RemoveContributor({
    contributor,
    task,
    open = false,
    onClose,
    onConfirm,
    loading = false,
}) {
    const [error, setError] = useState("");

    if (!open || !contributor) {
        return null;
    }

    const contributorName =
        contributor.fullName ||
        contributor.name ||
        "Unknown Contributor";

    const contributorEmail =
        contributor.email ||
        "No email available";

    const taskName =
        task?.name ||
        task?.title ||
        "Selected Task";

    const handleConfirm = async () => {
        setError("");

        try {
            if (onConfirm) {
                await onConfirm(contributor, task);
            }
        } catch (err) {
            setError(
                err?.message ||
                    "Unable to remove contributor. Please try again."
            );
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-700 px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10">
                            <Trash2 className="h-5 w-5 text-red-400" />
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-white">
                                Remove Contributor
                            </h2>

                            <p className="text-sm text-slate-400">
                                Remove this contributor from the task
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="space-y-5 p-6">

                    {/* Warning */}
                    <div className="flex gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
                        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />

                        <div>
                            <p className="text-sm font-medium text-amber-300">
                                Confirm contributor removal
                            </p>

                            <p className="mt-1 text-xs leading-5 text-amber-200/70">
                                Removing this contributor will remove their
                                assignment from the selected task. The action
                                will also be recorded in the activity log.
                            </p>
                        </div>
                    </div>

                    {/* Contributor */}
                    <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-4">
                        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-500">
                            Contributor
                        </p>

                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400">
                                <UserRound className="h-5 w-5" />
                            </div>

                            <div className="min-w-0">
                                <p className="truncate font-medium text-white">
                                    {contributorName}
                                </p>

                                <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-400">
                                    <Mail className="h-3.5 w-3.5" />

                                    <span className="truncate">
                                        {contributorEmail}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Task */}
                    <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-4">
                        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                            Assigned Task
                        </p>

                        <p className="text-sm font-medium text-white">
                            {taskName}
                        </p>

                        {task?.description && (
                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                {task.description}
                            </p>
                        )}
                    </div>

                    {/* A3 warning */}
                    {task?.requiresReassignment && (
                        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4">
                            <div className="flex gap-3">
                                <AlertTriangle className="h-5 w-5 shrink-0 text-red-400" />

                                <div>
                                    <p className="text-sm font-medium text-red-300">
                                        Reassignment required
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-red-300/70">
                                        This task requires reassignment before
                                        the contributor can be removed.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
                            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />

                            <p className="text-sm text-red-300">
                                {error}
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex flex-col-reverse gap-3 border-t border-slate-700 bg-slate-950/40 px-6 py-4 sm:flex-row sm:justify-end">

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-xl border border-slate-700 bg-slate-800 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={
                            loading ||
                            task?.requiresReassignment
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Removing...
                            </>
                        ) : (
                            <>
                                <Trash2 className="h-4 w-4" />
                                Remove Contributor
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RemoveContributor;