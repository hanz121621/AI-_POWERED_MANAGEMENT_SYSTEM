
import React, { useState } from "react";
import {
    X,
    Save,
    Timer,
    AlertCircle,
    CalendarDays,
} from "lucide-react";
import { updateProjectDeadline } from "@/services/projectService";
function SetUpdateProjectDeadline({
    project,
    currentManager,
    onClose,
    onUpdated,
}) {
    const [deadline, setDeadline] = useState(
        project?.deadline || ""
    );

    const [reason, setReason] = useState("");
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    // ============================================================
    // SUBMIT
    // ============================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        // --------------------------------------------------------
        // AUTHORISATION
        // --------------------------------------------------------

        if (
            !currentManager ||
            project.managerId !== currentManager.id
        ) {
            setError(
                "You are not authorised to manage this project."
            );

            return;
        }

        // --------------------------------------------------------
        // DEADLINE VALIDATION
        // --------------------------------------------------------

        if (!deadline) {
            setError(
                "Please provide a valid project deadline."
            );

            return;
        }

        // --------------------------------------------------------
        // START DATE VALIDATION
        // --------------------------------------------------------

        if (
            project.startDate &&
            new Date(deadline) <
                new Date(project.startDate)
        ) {
            setError(
                "The deadline cannot be earlier than the project start date."
            );

            return;
        }

        // --------------------------------------------------------
        // SAVE
        // --------------------------------------------------------

               try {
            setSaving(true);

            // 🌟 REAL BACKEND CALL
            await updateProjectDeadline(project.id, {
                deadline,
                notes: reason,
            });

            onUpdated(project.id, deadline, reason);
        } catch (submitError) {
            console.error("Failed to update project deadline:", submitError);
            setError(submitError?.response?.data?.message || "Unable to update the project deadline. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    // ============================================================
    // NO PROJECT
    // ============================================================

    if (!project) {
        return null;
    }

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">

            <div className="flex w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">

                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600">
                            <Timer size={20} />
                        </div>

                        <div className="min-w-0">

                            <h2 className="text-lg font-bold text-slate-900">
                                Set / Update Project Deadline
                            </h2>

                            <p className="mt-0.5 truncate text-sm text-slate-500">
                                {project.name}
                            </p>

                        </div>

                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        aria-label="Close"
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <X size={20} />
                    </button>

                </div>

                {/* ==================================================
                    FORM
                ================================================== */}

                <form onSubmit={handleSubmit}>

                    <div className="space-y-5 px-6 py-6">

                        {/* ERROR */}

                        {error && (
                            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

                                <AlertCircle
                                    size={18}
                                    className="mt-0.5 shrink-0"
                                />

                                <span>
                                    {error}
                                </span>

                            </div>
                        )}

                        {/* PROJECT INFORMATION */}

                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Project
                            </p>

                            <p className="mt-1 text-sm font-semibold text-slate-900">
                                {project.name}
                            </p>

                            {project.startDate && (
                                <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">

                                    <CalendarDays
                                        size={14}
                                    />

                                    <span>
                                        Start Date:
                                    </span>

                                    <span className="font-medium text-slate-700">
                                        {project.startDate}
                                    </span>

                                </div>
                            )}

                        </div>

                        {/* DEADLINE */}

                        <div>

                            <label
                                htmlFor="project-deadline"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                Project Deadline

                                <span className="ml-1 text-red-500">
                                    *
                                </span>
                            </label>

                            <div className="relative">

                                <CalendarDays
                                    size={18}
                                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    id="project-deadline"
                                    type="date"
                                    value={deadline}
                                    min={
                                        project.startDate ||
                                        undefined
                                    }
                                    onChange={(event) => {
                                        setDeadline(
                                            event.target.value
                                        );
                                        setError("");
                                    }}
                                    disabled={saving}
                                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 pl-10 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                                />

                            </div>

                            <p className="mt-1.5 text-xs text-slate-400">
                                The deadline cannot be earlier than
                                the project start date.
                            </p>

                        </div>

                        {/* REASON / NOTES */}

                        <div>

                            <label
                                htmlFor="deadline-reason"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                Reason / Notes

                                <span className="ml-1 text-xs font-normal text-slate-400">
                                    Optional
                                </span>
                            </label>

                            <textarea
                                id="deadline-reason"
                                value={reason}
                                onChange={(event) => {
                                    setReason(
                                        event.target.value
                                    );
                                    setError("");
                                }}
                                disabled={saving}
                                rows={4}
                                placeholder="Explain why the project deadline is being changed."
                                className="w-full resize-y rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                            />

                        </div>

                    </div>

                    {/* ==================================================
                        FOOTER
                    ================================================== */}

                    <div className="flex flex-col-reverse gap-2 border-t border-slate-200 bg-white px-6 py-4 sm:flex-row sm:justify-end">

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Save size={17} />

                            {saving
                                ? "Saving..."
                                : "Save Deadline"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default SetUpdateProjectDeadline;

