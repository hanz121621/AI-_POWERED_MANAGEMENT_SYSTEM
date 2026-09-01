
// ==========================================================
// AIPMS — CREATE SPRINT MODAL
//
// SP-001 — Create Sprint
//
// Location:
// src/components/manager/sprint/CreateSprintModal.jsx
//
// Compatible with:
// SprintManagement.jsx
// ============================================================

import React, { useEffect, useState } from "react";

import {
    X,
    Plus,
    AlertTriangle,
    CalendarDays,
    Target,
} from "lucide-react";

// ============================================================
// COMPONENT
// ============================================================

function CreateSprintModal({
    isOpen = true,
    onClose,
    onCreated,
}) {
    // ========================================================
    // FORM STATE
    // ========================================================

    const [formData, setFormData] = useState({
        name: "",
        team: "AIPMS Development Team",
        startDate: "",
        endDate: "",
        goal: "",
    });

    // ========================================================
    // ERROR STATE
    // ========================================================

    const [error, setError] = useState("");

    // ========================================================
    // RESET FORM WHEN OPENED
    // ========================================================

    useEffect(() => {
        if (isOpen) {
            setError("");

            setFormData({
                name: "",
                team: "AIPMS Development Team",
                startDate: "",
                endDate: "",
                goal: "",
            });
        }
    }, [isOpen]);

    // ========================================================
    // DO NOT RENDER WHEN CLOSED
    // ========================================================

    if (!isOpen) {
        return null;
    }

    // ========================================================
    // HANDLE CHANGE
    // ========================================================

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setError("");
    };

    // ========================================================
    // VALIDATE
    // ========================================================

    const validateForm = () => {
        const name = formData.name.trim();
        const team = formData.team.trim();
        const goal = formData.goal.trim();

        if (!name) {
            return "Sprint name is required.";
        }

        if (!team) {
            return "Team is required.";
        }

        if (!formData.startDate) {
            return "Start date is required.";
        }

        if (!formData.endDate) {
            return "End date is required.";
        }

        const startDate = new Date(
            `${formData.startDate}T00:00:00`
        );

        const endDate = new Date(
            `${formData.endDate}T00:00:00`
        );

        if (Number.isNaN(startDate.getTime())) {
            return "Start date is invalid.";
        }

        if (Number.isNaN(endDate.getTime())) {
            return "End date is invalid.";
        }

        if (endDate <= startDate) {
            return "Sprint end date must be after the start date.";
        }

        if (!goal) {
            return "Sprint goal is required.";
        }

        return {
            name,
            team,
            startDate: formData.startDate,
            endDate: formData.endDate,
            goal,
        };
    };

    // ========================================================
    // SUBMIT
    // ========================================================

    const handleSubmit = (event) => {
        event.preventDefault();

        setError("");

        const result = validateForm();

        if (typeof result === "string") {
            setError(result);
            return;
        }

        if (typeof onCreated !== "function") {
            setError(
                "Create sprint handler is not available."
            );
            return;
        }

        // ====================================================
        // SEND DATA TO SprintManagement.jsx
        // ====================================================

        const newSprintData = {
            name: result.name,
            team: result.team,
            startDate: result.startDate,
            endDate: result.endDate,
            goal: result.goal,
        };

        try {
            onCreated(newSprintData);
        } catch (submitError) {
            console.error(
                "Failed to create sprint:",
                submitError
            );

            setError(
                submitError?.message ||
                    "Failed to create the sprint."
            );

            return;
        }

        // ====================================================
        // RESET
        // ====================================================

        setFormData({
            name: "",
            team: "AIPMS Development Team",
            startDate: "",
            endDate: "",
            goal: "",
        });

        // ====================================================
        // CLOSE
        // ====================================================

        if (typeof onClose === "function") {
            onClose();
        }
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 py-6 backdrop-blur-sm"
            onMouseDown={(event) => {
                if (
                    event.target === event.currentTarget &&
                    typeof onClose === "function"
                ) {
                    onClose();
                }
            }}
        >
            <div
                className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl"
                role="dialog"
                aria-modal="true"
                aria-labelledby="create-sprint-title"
            >
                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 px-6 py-5 text-white">

                    <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/10" />

                    <div className="absolute -bottom-12 right-20 h-24 w-24 rounded-full bg-white/10" />

                    <div className="relative flex items-start justify-between">

                        <div className="flex items-center gap-3">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20">

                                <CalendarDays
                                    size={21}
                                    className="text-white"
                                />

                            </div>

                            <div>

                                <h2
                                    id="create-sprint-title"
                                    className="text-lg font-bold"
                                >
                                    Create Sprint
                                </h2>

                                <p className="mt-1 text-sm text-white/80">
                                    Create a new sprint for your project team.
                                </p>

                            </div>

                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close create sprint dialog"
                            className="rounded-lg p-2 text-white/80 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                        >
                            <X size={19} />
                        </button>

                    </div>

                </div>

                {/* ==================================================
                    FORM
                ================================================== */}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 px-6 py-6"
                >

                    {/* ==================================================
                        ERROR
                    ================================================== */}

                    {error && (
                        <div
                            role="alert"
                            className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
                        >
                            <AlertTriangle
                                size={18}
                                className="mt-0.5 shrink-0 text-red-600"
                            />

                            <span>{error}</span>
                        </div>
                    )}

                    {/* ==================================================
                        SPRINT NAME
                    ================================================== */}

                    <div>

                        <label
                            htmlFor="create-sprint-name"
                            className="mb-1.5 block text-sm font-semibold text-slate-700"
                        >
                            Sprint Name
                        </label>

                        <input
                            id="create-sprint-name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Sprint 04"
                            autoFocus
                            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                        />

                    </div>

                    {/* ==================================================
                        TEAM
                    ================================================== */}

                    <div>

                        <label
                            htmlFor="create-sprint-team"
                            className="mb-1.5 block text-sm font-semibold text-slate-700"
                        >
                            Team
                        </label>

                        <input
                            id="create-sprint-team"
                            name="team"
                            type="text"
                            value={formData.team}
                            onChange={handleChange}
                            placeholder="Enter team name"
                            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                        />

                    </div>

                    {/* ==================================================
                        DATES
                    ================================================== */}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                        {/* START DATE */}

                        <div>

                            <label
                                htmlFor="create-sprint-start-date"
                                className="mb-1.5 block text-sm font-semibold text-slate-700"
                            >
                                Start Date
                            </label>

                            <input
                                id="create-sprint-start-date"
                                name="startDate"
                                type="date"
                                value={formData.startDate}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                            />

                        </div>

                        {/* END DATE */}

                        <div>

                            <label
                                htmlFor="create-sprint-end-date"
                                className="mb-1.5 block text-sm font-semibold text-slate-700"
                            >
                                End Date
                            </label>

                            <input
                                id="create-sprint-end-date"
                                name="endDate"
                                type="date"
                                value={formData.endDate}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                            />

                        </div>

                    </div>

                    {/* ==================================================
                        SPRINT GOAL
                    ================================================== */}

                    <div>

                        <label
                            htmlFor="create-sprint-goal"
                            className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-700"
                        >
                            <Target
                                size={16}
                                className="text-violet-600"
                            />

                            Sprint Goal
                        </label>

                        <textarea
                            id="create-sprint-goal"
                            name="goal"
                            rows={4}
                            value={formData.goal}
                            onChange={handleChange}
                            placeholder="Describe what this sprint should accomplish..."
                            className="w-full resize-none rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                        />

                    </div>

                    {/* ==================================================
                        ACTIONS
                    ================================================== */}

                    <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">

                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:from-violet-700 hover:to-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2"
                        >
                            <Plus size={17} />

                            Create Sprint
                        </button>

                    </div>

                </form>

            </div>
        </div>
    );
}

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default CreateSprintModal;

