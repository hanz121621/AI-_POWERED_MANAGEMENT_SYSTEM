// ==========================================================
// AIPMS — CREATE SPRINT MODAL
//
// SP-001 — Create Sprint
//
// Location:
// src/components/manager/sprint/CreateSprintModal.jsx
//
// UI:
// Matches AIPMS Admin / Manager design system
//
// Compatible with:
// SprintManagement.jsx
// ==========================================================

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
    projectId = "",
    teamId = "",
    teams = [],
}) {
    // ========================================================
    // FORM STATE
    // ========================================================

    const [formData, setFormData] = useState({
        name: "",
        teamId: "",
        teamName: "",
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

            const selectedTeam = teams.find(
                (team) =>
                    team.id === teamId ||
                    team.Id === teamId
            );

            const defaultTeamName = selectedTeam
                ? selectedTeam.name ||
                  selectedTeam.Name ||
                  "Unknown Team"
                : "";

            setFormData({
                name: "",
                teamId: teamId || "",
                teamName: defaultTeamName,
                startDate: "",
                endDate: "",
                goal: "",
            });
        }
    }, [isOpen, teamId, teams]);

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
        const name = (formData.name || "").trim();
        const selectedTeamId = (formData.teamId || "").trim();
        const goal = (formData.goal || "").trim();

        if (!name) {
            return "Sprint name is required.";
        }

        if (!selectedTeamId) {
            return "Please select a team.";
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
            teamId: selectedTeamId,
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
            setError("Create sprint handler is not available.");
            return;
        }

        // ====================================================
        // BACKEND PAYLOAD
        // ====================================================

        const newSprintData = {
            projectId: projectId,
            teamId: result.teamId,
            name: result.name,
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
        // RESET FORM
        // ====================================================

        setFormData({
            name: "",
            teamId: "",
            teamName: "",
            startDate: "",
            endDate: "",
            goal: "",
        });

        // ====================================================
        // CLOSE MODAL
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
            className="
                fixed
                inset-0
                z-[100]
                flex
                items-center
                justify-center
                bg-black/50
                px-4
                py-6
                backdrop-blur-sm
            "
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
                className="
                    max-h-[90vh]
                    w-full
                    max-w-lg
                    overflow-y-auto
                    rounded-xl
                    border
                    border-border
                    bg-card
                    text-foreground
                    shadow-xl
                "
                role="dialog"
                aria-modal="true"
                aria-labelledby="create-sprint-title"
            >
                {/* ==================================================
                    HEADER
                ================================================== */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        border-b
                        border-border
                        px-6
                        py-5
                    "
                >
                    <div className="flex items-center gap-3">
                        <div
                            className="
                                flex
                                h-11
                                w-11
                                items-center
                                justify-center
                                rounded-xl
                                bg-primary/10
                                text-primary
                            "
                        >
                            <CalendarDays size={21} />
                        </div>

                        <div>
                            <h2
                                id="create-sprint-title"
                                className="
                                    text-lg
                                    font-semibold
                                    tracking-tight
                                    text-foreground
                                "
                            >
                                Create Sprint
                            </h2>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-muted-foreground
                                "
                            >
                                Create a new sprint for your
                                project team.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close create sprint dialog"
                        className="
                            rounded-lg
                            p-2
                            text-muted-foreground
                            transition-colors
                            hover:bg-muted
                            hover:text-foreground
                            focus:outline-none
                            focus:ring-2
                            focus:ring-primary/30
                        "
                    >
                        <X size={19} />
                    </button>
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
                            className="
                                flex
                                items-start
                                gap-2
                                rounded-lg
                                border
                                border-destructive/20
                                bg-destructive/10
                                px-4
                                py-3
                                text-sm
                                font-medium
                                text-destructive
                            "
                        >
                            <AlertTriangle
                                size={18}
                                className="mt-0.5 shrink-0"
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
                            className="
                                mb-1.5
                                block
                                text-sm
                                font-medium
                                text-foreground
                            "
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
                            className="
                                w-full
                                rounded-lg
                                border
                                border-input
                                bg-background
                                px-3
                                py-2.5
                                text-sm
                                text-foreground
                                outline-none
                                transition-colors
                                placeholder:text-muted-foreground
                                focus:border-primary
                                focus:ring-2
                                focus:ring-primary/20
                            "
                        />
                    </div>

                    {/* ==================================================
                        TEAM
                    ================================================== */}

                    <div>
                        <label
                            htmlFor="create-sprint-team"
                            className="
                                mb-1.5
                                block
                                text-sm
                                font-medium
                                text-foreground
                            "
                        >
                            Team
                        </label>

                        <select
                            id="create-sprint-team"
                            name="teamId"
                            value={formData.teamId}
                            onChange={handleChange}
                            className="
                                w-full
                                rounded-lg
                                border
                                border-input
                                bg-background
                                px-3
                                py-2.5
                                text-sm
                                text-foreground
                                outline-none
                                transition-colors
                                focus:border-primary
                                focus:ring-2
                                focus:ring-primary/20
                            "
                        >
                            <option value="">
                                {teams.length === 0
                                    ? "Loading teams..."
                                    : "Select a team"}
                            </option>

                            {teams.map((team) => {
                                const id =
                                    team.id || team.Id;

                                const name =
                                    team.name ||
                                    team.Name ||
                                    "Unnamed Team";

                                return (
                                    <option
                                        key={id}
                                        value={id}
                                    >
                                        {name}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    {/* ==================================================
                        DATES
                    ================================================== */}

                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-4
                            sm:grid-cols-2
                        "
                    >
                        {/* START DATE */}

                        <div>
                            <label
                                htmlFor="create-sprint-start-date"
                                className="
                                    mb-1.5
                                    block
                                    text-sm
                                    font-medium
                                    text-foreground
                                "
                            >
                                Start Date
                            </label>

                            <input
                                id="create-sprint-start-date"
                                name="startDate"
                                type="date"
                                value={formData.startDate}
                                onChange={handleChange}
                                className="
                                    w-full
                                    rounded-lg
                                    border
                                    border-input
                                    bg-background
                                    px-3
                                    py-2.5
                                    text-sm
                                    text-foreground
                                    outline-none
                                    transition-colors
                                    focus:border-primary
                                    focus:ring-2
                                    focus:ring-primary/20
                                "
                            />
                        </div>

                        {/* END DATE */}

                        <div>
                            <label
                                htmlFor="create-sprint-end-date"
                                className="
                                    mb-1.5
                                    block
                                    text-sm
                                    font-medium
                                    text-foreground
                                "
                            >
                                End Date
                            </label>

                            <input
                                id="create-sprint-end-date"
                                name="endDate"
                                type="date"
                                value={formData.endDate}
                                onChange={handleChange}
                                className="
                                    w-full
                                    rounded-lg
                                    border
                                    border-input
                                    bg-background
                                    px-3
                                    py-2.5
                                    text-sm
                                    text-foreground
                                    outline-none
                                    transition-colors
                                    focus:border-primary
                                    focus:ring-2
                                    focus:ring-primary/20
                                "
                            />
                        </div>
                    </div>

                    {/* ==================================================
                        SPRINT GOAL
                    ================================================== */}

                    <div>
                        <label
                            htmlFor="create-sprint-goal"
                            className="
                                mb-1.5
                                flex
                                items-center
                                gap-2
                                text-sm
                                font-medium
                                text-foreground
                            "
                        >
                            <Target
                                size={16}
                                className="text-primary"
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
                            className="
                                w-full
                                resize-none
                                rounded-lg
                                border
                                border-input
                                bg-background
                                px-3
                                py-2.5
                                text-sm
                                text-foreground
                                outline-none
                                transition-colors
                                placeholder:text-muted-foreground
                                focus:border-primary
                                focus:ring-2
                                focus:ring-primary/20
                            "
                        />
                    </div>

                    {/* ==================================================
                        ACTIONS
                    ================================================== */}

                    <div
                        className="
                            flex
                            justify-end
                            gap-3
                            border-t
                            border-border
                            pt-5
                        "
                    >
                        <button
                            type="button"
                            onClick={onClose}
                            className="
                                rounded-lg
                                border
                                border-border
                                bg-background
                                px-4
                                py-2.5
                                text-sm
                                font-medium
                                text-foreground
                                transition-colors
                                hover:bg-muted
                                focus:outline-none
                                focus:ring-2
                                focus:ring-primary/20
                            "
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="
                                flex
                                items-center
                                gap-2
                                rounded-lg
                                bg-primary
                                px-5
                                py-2.5
                                text-sm
                                font-semibold
                                text-primary-foreground
                                shadow-sm
                                transition-colors
                                hover:bg-primary/90
                                focus:outline-none
                                focus:ring-2
                                focus:ring-primary/30
                                focus:ring-offset-2
                            "
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