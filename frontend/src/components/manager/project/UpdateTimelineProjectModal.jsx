
import React, { useState } from "react";
import {
    X,
    Save,
    CalendarDays,
    AlertCircle,
} from "lucide-react";

function UpdateProjectTimeline({
    project,
    currentManager,
    onClose,
    onUpdated,
}) {
    const [startDate, setStartDate] = useState(
        project?.timeline?.startDate ||
            project?.startDate ||
            ""
    );

    const [endDate, setEndDate] = useState(
        project?.timeline?.endDate ||
            project?.deadline ||
            ""
    );

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
        // REQUIRED DATES
        // --------------------------------------------------------

        if (!startDate || !endDate) {
            setError(
                "Please provide both the project start date and deadline."
            );

            return;
        }

        // --------------------------------------------------------
        // DATE VALIDATION
        // --------------------------------------------------------

        if (
            new Date(startDate) >
            new Date(endDate)
        ) {
            setError(
                "The project start date cannot be later than the project deadline."
            );

            return;
        }

        try {
            setSaving(true);

            const timeline = {
                startDate,
                endDate,
                updatedBy: currentManager.id,
                updatedAt: new Date().toISOString(),
            };

            /*
             * Temporary local implementation.
             *
             * Replace later with:
             *
             * await projectService.updateTimeline(...)
             */

            await new Promise((resolve) =>
                setTimeout(resolve, 300)
            );

            onUpdated(project.id, timeline);
        } catch (submitError) {
            console.error(
                "Failed to update project timeline:",
                submitError
            );

            setError(
                "Unable to update the project timeline. Please try again."
            );
        } finally {
            setSaving(false);
        }
    };

    // ============================================================
    // RENDER
    // ============================================================

    if (!project) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">

            <div className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">

                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600">
                            <CalendarDays size={20} />
                        </div>

                        <div>
                            <h2 className="text-lg font-bold text-slate-900">
                                Update Project Timeline
                            </h2>

                            <p className="mt-0.5 text-sm text-slate-500">
                                {project.name}
                            </p>
                        </div>

                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Close"
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

                                <span>{error}</span>

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

                            {project.description && (
                                <p className="mt-1 text-sm leading-5 text-slate-500">
                                    {project.description}
                                </p>
                            )}

                        </div>

                        {/* START DATE */}

                        <div>

                            <label
                                htmlFor="project-start-date"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                Project Start Date

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
                                    id="project-start-date"
                                    type="date"
                                    value={startDate}
                                    max={
                                        endDate ||
                                        undefined
                                    }
                                    onChange={(event) => {
                                        setStartDate(
                                            event.target.value
                                        );
                                        setError("");
                                    }}
                                    disabled={saving}
                                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 pl-10 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                                />

                            </div>

                            <p className="mt-1.5 text-xs text-slate-400">
                                Select the date when the project begins.
                            </p>

                        </div>

                        {/* DEADLINE */}

                        <div>

                            <label
                                htmlFor="project-end-date"
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
                                    id="project-end-date"
                                    type="date"
                                    value={endDate}
                                    min={
                                        startDate ||
                                        undefined
                                    }
                                    onChange={(event) => {
                                        setEndDate(
                                            event.target.value
                                        );
                                        setError("");
                                    }}
                                    disabled={saving}
                                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 pl-10 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                                />

                            </div>

                            <p className="mt-1.5 text-xs text-slate-400">
                                The deadline cannot be earlier than the project start date.
                            </p>

                        </div>

                        {/* TIMELINE SUMMARY */}

                        {startDate && endDate && (
                            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">

                                <div className="flex items-start gap-3">

                                    <CalendarDays
                                        size={18}
                                        className="mt-0.5 shrink-0 text-blue-600"
                                    />

                                    <div>

                                        <p className="text-sm font-semibold text-blue-900">
                                            Project Timeline
                                        </p>

                                        <p className="mt-1 text-sm text-blue-700">
                                            {startDate} → {endDate}
                                        </p>

                                    </div>

                                </div>

                            </div>
                        )}

                    </div>

                    {/* ==================================================
                        FOOTER ACTIONS
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
                                : "Save Changes"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default UpdateProjectTimeline;

