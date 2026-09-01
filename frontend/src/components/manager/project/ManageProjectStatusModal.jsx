
import React, { useState } from "react";

import {
    X,
    Save,
    Activity,
    CheckCircle2,
    AlertTriangle,
    Sparkles,
} from "lucide-react";

// ============================================================
// AIPMS — MANAGE PROJECT STATUS
//
// Design:
// - Matches Sprint Management page
// - Colorful violet / blue / cyan gradient
// - Slate-50 background
// - Rounded 2xl cards
// - Professional status management modal
// ============================================================

function ManageProjectStatus({
    project,
    currentManager,
    statuses = [],
    onClose,
    onUpdated,
}) {
    const [status, setStatus] = useState(
        project?.status || ""
    );

    const [notes, setNotes] = useState("");
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    // ========================================================
    // SUBMIT
    // ========================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        // ----------------------------------------------------
        // MANAGER AUTHORIZATION
        // ----------------------------------------------------

        if (
            !currentManager ||
            project.managerId !== currentManager.id
        ) {
            setError(
                "You are not authorised to manage this project."
            );

            return;
        }

        // ----------------------------------------------------
        // STATUS VALIDATION
        // ----------------------------------------------------

        if (!status) {
            setError(
                "Please select a project status."
            );

            return;
        }

        // ----------------------------------------------------
        // SAVE
        // ----------------------------------------------------

        try {
            setSaving(true);

            /*
             * Replace with backend service later:
             *
             * await projectService.updateStatus(
             *     project.id,
             *     status,
             *     notes
             * );
             */

            await new Promise((resolve) =>
                setTimeout(resolve, 300)
            );

            onUpdated(
                project.id,
                status,
                notes
            );
        } catch (saveError) {
            console.error(
                "Failed to update project status:",
                saveError
            );

            setError(
                "Unable to update the project status. Please try again."
            );
        } finally {
            setSaving(false);
        }
    };

    // ========================================================
    // STATUS STYLE
    // ========================================================

    const getStatusStyle = (value) => {
        const normalized =
            String(value || "").toLowerCase();

        if (normalized === "active") {
            return {
                wrapper:
                    "border-emerald-200 bg-emerald-50",
                icon:
                    "bg-emerald-100 text-emerald-600",
                text:
                    "text-emerald-700",
            };
        }

        if (normalized === "completed") {
            return {
                wrapper:
                    "border-blue-200 bg-blue-50",
                icon:
                    "bg-blue-100 text-blue-600",
                text:
                    "text-blue-700",
            };
        }

        if (normalized === "onhold") {
            return {
                wrapper:
                    "border-amber-200 bg-amber-50",
                icon:
                    "bg-amber-100 text-amber-600",
                text:
                    "text-amber-700",
            };
        }

        if (normalized === "cancelled") {
            return {
                wrapper:
                    "border-red-200 bg-red-50",
                icon:
                    "bg-red-100 text-red-600",
                text:
                    "text-red-700",
            };
        }

        return {
            wrapper:
                "border-violet-200 bg-violet-50",
            icon:
                "bg-violet-100 text-violet-600",
            text:
                "text-violet-700",
        };
    };

    const currentStatusStyle =
        getStatusStyle(status);

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">

            <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

                {/* ==================================================
                    COLORFUL HEADER
                ================================================== */}

                <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 px-6 py-5 text-white">

                    <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10" />

                    <div className="absolute -bottom-16 right-24 h-32 w-32 rounded-full bg-white/10" />

                    <div className="relative flex items-center justify-between">

                        <div className="flex items-center gap-3">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20 backdrop-blur-sm">

                                <Activity
                                    size={22}
                                    className="text-white"
                                />

                            </div>

                            <div>

                                <div className="mb-0.5 flex items-center gap-2">

                                    <Sparkles
                                        size={14}
                                        className="text-cyan-200"
                                    />

                                    <span className="text-xs font-semibold uppercase tracking-wider text-white/75">
                                        Project Management
                                    </span>

                                </div>

                                <h2 className="text-lg font-bold">
                                    Manage Project Status
                                </h2>

                                <p className="mt-0.5 text-sm text-white/80">
                                    Update the current project state
                                </p>

                            </div>

                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            aria-label="Close"
                            className="rounded-lg p-2 text-white/80 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <X size={19} />
                        </button>

                    </div>

                </div>

                {/* ==================================================
                    FORM
                ================================================== */}

                <form onSubmit={handleSubmit}>

                    <div className="space-y-5 px-6 py-6">

                        {/* PROJECT */}

                        <div className="rounded-xl border border-violet-100 bg-violet-50 p-4">

                            <div className="flex items-center justify-between gap-3">

                                <div>

                                    <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">
                                        Project
                                    </p>

                                    <p className="mt-1 font-bold text-slate-900">
                                        {project?.name ||
                                            "Unnamed Project"}
                                    </p>

                                </div>

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-violet-600 shadow-sm">

                                    <Activity size={19} />

                                </div>

                            </div>

                        </div>

                        {/* ERROR */}

                        {error && (
                            <div
                                role="alert"
                                className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
                            >

                                <AlertTriangle
                                    size={18}
                                    className="mt-0.5 shrink-0 text-red-600"
                                />

                                <span>
                                    {error}
                                </span>

                            </div>
                        )}

                        {/* STATUS */}

                        <div>

                            <label
                                htmlFor="project-status"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                Project Status
                                <span className="ml-1 text-red-500">
                                    *
                                </span>
                            </label>

                            <select
                                id="project-status"
                                value={status}
                                onChange={(event) => {
                                    setStatus(
                                        event.target.value
                                    );
                                    setError("");
                                }}
                                disabled={saving}
                                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                            >

                                <option value="">
                                    Select status
                                </option>

                                {statuses.map(
                                    (item) => {
                                        const value =
                                            typeof item ===
                                            "string"
                                                ? item
                                                : item.value;

                                        const label =
                                            typeof item ===
                                            "string"
                                                ? item
                                                : item.label;

                                        return (
                                            <option
                                                key={value}
                                                value={value}
                                            >
                                                {label}
                                            </option>
                                        );
                                    }
                                )}

                            </select>

                        </div>

                        {/* SELECTED STATUS PREVIEW */}

                        {status && (
                            <div
                                className={`rounded-xl border p-4 ${currentStatusStyle.wrapper}`}
                            >

                                <div className="flex items-center gap-3">

                                    <div
                                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${currentStatusStyle.icon}`}
                                    >

                                        <CheckCircle2
                                            size={19}
                                        />

                                    </div>

                                    <div>

                                        <p
                                            className={`text-xs font-semibold uppercase tracking-wide ${currentStatusStyle.text}`}
                                        >
                                            Selected Status
                                        </p>

                                        <p className="mt-1 font-bold text-slate-900">
                                            {status}
                                        </p>

                                    </div>

                                </div>

                            </div>
                        )}

                        {/* NOTES */}

                        <div>

                            <label
                                htmlFor="project-status-notes"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                Notes
                            </label>

                            <textarea
                                id="project-status-notes"
                                value={notes}
                                onChange={(event) =>
                                    setNotes(
                                        event.target.value
                                    )
                                }
                                disabled={saving}
                                rows={4}
                                placeholder="Optional status update notes."
                                className="w-full resize-y rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                            />

                            <p className="mt-1.5 text-xs text-slate-400">
                                Add a short explanation for this
                                status change if needed.
                            </p>

                        </div>

                    </div>

                    {/* ==================================================
                        FOOTER ACTIONS
                    ================================================== */}

                    <div className="flex flex-col-reverse gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:from-violet-700 hover:to-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                        >

                            <Save size={17} />

                            {saving
                                ? "Saving..."
                                : "Save Status"}

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default ManageProjectStatus;

