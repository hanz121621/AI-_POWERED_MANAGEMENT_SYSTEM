// ============================================================
// AIPMS — ASSIGN SPRINT TO TEAM MODAL
//
// Sprint Management
// Use Case: Assign Sprint to Team
//
// Manager can assign an existing sprint to an available team.
// ============================================================

import React, { useEffect, useState } from "react";

import {
    UsersRound,
    X,
    CheckCircle,
    AlertTriangle,
    Save,
} from "lucide-react";

// ============================================================
// COMPONENT
// ============================================================

function AssignSprintToTeamModal({
    sprint,
    teams = [],
    currentManager,
    onClose,
    onAssigned,
    onError,
}) {
    // ========================================================
    // STATE
    // ========================================================

    const [selectedTeamId, setSelectedTeamId] = useState(
        sprint?.teamId || ""
    );

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");

    // ========================================================
    // INITIAL VALIDATION
    // ========================================================

    useEffect(() => {
        if (!sprint) {
            const message = "The selected sprint could not be found.";

            setErrorMessage(message);

            if (onError) {
                onError(message);
            }
        }
    }, [sprint, onError]);

    // ========================================================
    // CLOSE
    // ========================================================

    const handleClose = () => {
        if (isSubmitting) {
            return;
        }

        onClose();
    };

    // ========================================================
    // TEAM CHANGE
    // ========================================================

    const handleTeamChange = (event) => {
        setSelectedTeamId(event.target.value);
        setErrorMessage("");
    };

    // ========================================================
    // ASSIGN SPRINT
    // ========================================================

    const handleAssign = () => {
        setErrorMessage("");

        // ----------------------------------------------------
        // Sprint validation
        // ----------------------------------------------------

        if (!sprint) {
            const message =
                "The selected sprint could not be found.";

            setErrorMessage(message);

            if (onError) {
                onError(message);
            }

            return;
        }

        // ----------------------------------------------------
        // Manager validation
        // ----------------------------------------------------

        if (!currentManager?.id) {
            const message =
                "You must be authenticated as a manager.";

            setErrorMessage(message);

            if (onError) {
                onError(message);
            }

            return;
        }

        // ----------------------------------------------------
        // Team validation
        // ----------------------------------------------------

        if (!selectedTeamId) {
            const message =
                "Please select a team before assigning the sprint.";

            setErrorMessage(message);

            return;
        }

        // ----------------------------------------------------
        // Find selected team
        // ----------------------------------------------------

        const selectedTeam = teams.find(
            (team) =>
                String(team.id) ===
                String(selectedTeamId)
        );

        if (!selectedTeam) {
            const message =
                "The selected team could not be found.";

            setErrorMessage(message);

            if (onError) {
                onError(message);
            }

            return;
        }

        // ----------------------------------------------------
        // Authorization
        //
        // If the team has a managerId, verify that the current
        // manager is responsible for the team.
        // ----------------------------------------------------

        if (
            selectedTeam.managerId &&
            String(selectedTeam.managerId) !==
                String(currentManager.id)
        ) {
            const message =
                "You are not authorised to assign a sprint to this team.";

            setErrorMessage(message);

            if (onError) {
                onError(message);
            }

            return;
        }

        // ----------------------------------------------------
        // Prevent duplicate assignment
        // ----------------------------------------------------

        if (
            sprint.teamId &&
            String(sprint.teamId) ===
                String(selectedTeam.id)
        ) {
            const message =
                "This sprint is already assigned to the selected team.";

            setErrorMessage(message);

            return;
        }

        // ----------------------------------------------------
        // Submit
        // ----------------------------------------------------

        setIsSubmitting(true);

        try {
            const assignment = {
                sprintId: sprint.id,
                teamId: selectedTeam.id,
                teamName:
                    selectedTeam.name ||
                    selectedTeam.teamName ||
                    "Selected Team",
                assignedBy:
                    currentManager.email ||
                    currentManager.name ||
                    currentManager.id,
                assignedAt: new Date().toISOString(),
            };

            if (onAssigned) {
                onAssigned(
                    sprint.id,
                    selectedTeam,
                    assignment
                );
            }
        } catch (error) {
            console.error(
                "Failed to assign sprint to team:",
                error
            );

            const message =
                "Failed to assign the sprint to the selected team.";

            setErrorMessage(message);

            if (onError) {
                onError(message);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // ========================================================
    // NO SPRINT
    // ========================================================

    if (!sprint) {
        return null;
    }

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="assign-sprint-title"
        >
            <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white shadow-xl">

                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">

                    <div className="flex items-start gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
                            <UsersRound
                                size={20}
                                className="text-slate-700"
                            />
                        </div>

                        <div>
                            <h2
                                id="assign-sprint-title"
                                className="text-lg font-semibold text-slate-900"
                            >
                                Assign Sprint to Team
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Assign this sprint to a team managed by
                                you.
                            </p>
                        </div>

                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Close dialog"
                    >
                        <X size={20} />
                    </button>

                </div>

                {/* ==================================================
                    CONTENT
                ================================================== */}

                <div className="space-y-5 px-6 py-6">

                    {/* ==================================================
                        SPRINT INFORMATION
                    ================================================== */}

                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">

                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            Sprint
                        </p>

                        <p className="mt-1 text-base font-semibold text-slate-900">
                            {sprint.name ||
                                sprint.title ||
                                `Sprint ${sprint.id}`}
                        </p>

                        {sprint.description && (
                            <p className="mt-1 text-sm text-slate-500">
                                {sprint.description}
                            </p>
                        )}

                    </div>

                    {/* ==================================================
                        ERROR
                    ================================================== */}

                    {errorMessage && (
                        <div
                            role="alert"
                            className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                        >
                            <AlertTriangle
                                size={18}
                                className="mt-0.5 shrink-0"
                            />

                            <span>
                                {errorMessage}
                            </span>
                        </div>
                    )}

                    {/* ==================================================
                        TEAM SELECT
                    ================================================== */}

                    <div>

                        <label
                            htmlFor="sprint-team"
                            className="mb-2 block text-sm font-semibold text-slate-700"
                        >
                            Select Team
                        </label>

                        <select
                            id="sprint-team"
                            value={selectedTeamId}
                            onChange={handleTeamChange}
                            disabled={isSubmitting}
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-100"
                        >
                            <option value="">
                                Select a team
                            </option>

                            {teams.map((team) => (
                                <option
                                    key={team.id}
                                    value={team.id}
                                >
                                    {team.name ||
                                        team.teamName ||
                                        `Team ${team.id}`}
                                </option>
                            ))}
                        </select>

                        {teams.length === 0 && (
                            <p className="mt-2 text-sm text-slate-500">
                                No teams are currently available.
                            </p>
                        )}

                    </div>

                    {/* ==================================================
                        SELECTED TEAM PREVIEW
                    ================================================== */}

                    {selectedTeamId && (
                        <div className="rounded-lg border border-slate-200 bg-white p-4">

                            <div className="flex items-center gap-3">

                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                                    <UsersRound
                                        size={18}
                                        className="text-slate-600"
                                    />
                                </div>

                                <div>

                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                        Selected Team
                                    </p>

                                    <p className="text-sm font-semibold text-slate-900">
                                        {
                                            teams.find(
                                                (team) =>
                                                    String(
                                                        team.id
                                                    ) ===
                                                    String(
                                                        selectedTeamId
                                                    )
                                            )?.name ||
                                                teams.find(
                                                    (team) =>
                                                        String(
                                                            team.id
                                                        ) ===
                                                        String(
                                                            selectedTeamId
                                                        )
                                                )?.teamName ||
                                                "Selected Team"
                                        }
                                    </p>

                                </div>

                            </div>

                        </div>
                    )}

                </div>

                {/* ==================================================
                    FOOTER
                ================================================== */}

                <div className="flex flex-col-reverse gap-2 border-t border-slate-200 px-6 py-4 sm:flex-row sm:justify-end">

                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleAssign}
                        disabled={
                            isSubmitting ||
                            !selectedTeamId ||
                            teams.length === 0
                        }
                        className="flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <>
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                Assigning...
                            </>
                        ) : (
                            <>
                                <Save size={17} />
                                Assign Sprint
                            </>
                        )}
                    </button>

                </div>

            </div>
        </div>
    );
}

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default AssignSprintToTeamModal;