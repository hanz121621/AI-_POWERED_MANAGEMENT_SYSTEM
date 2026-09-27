
import React, { useEffect, useState } from "react";
import {
    X,
    Plus,
    AlertTriangle,
    CalendarDays,
    Target,
} from "lucide-react";

function CreateSprintModal({
    isOpen = true,
    onClose,
    onCreated,
    projects = [],
    teams = [],
    submitting = false,
}) {
    // ============================================================
    // INITIAL FORM
    // ============================================================

    const INITIAL_FORM = {
        projectId: "",
        teamId: "",
        name: "",
        startDate: "",
        endDate: "",
        goal: "",
    };

    // ============================================================
    // STATE
    // ============================================================

    const [formData, setFormData] = useState(INITIAL_FORM);
    const [error, setError] = useState("");

    // ============================================================
    // HELPERS
    // ============================================================

    const getId = (item) =>
        item?.id ??
        item?.Id ??
        item?.projectId ??
        item?.ProjectId ??
        item?.teamId ??
        item?.TeamId ??
        "";

    const getName = (item, fallback = "Unnamed") =>
        item?.name ??
        item?.Name ??
        item?.projectName ??
        item?.ProjectName ??
        item?.teamName ??
        item?.TeamName ??
        fallback;

    // ============================================================
    // RESET WHEN MODAL OPENS
    // ============================================================

    useEffect(() => {
        if (isOpen) {
            setFormData(INITIAL_FORM);
            setError("");
        }
    }, [isOpen]);

    // ============================================================
    // NORMALIZE PROJECTS
    // ============================================================

    const normalizedProjects = Array.isArray(projects)
        ? projects
              .map((project) => ({
                  id: String(getId(project)),
                  name: getName(project, "Unnamed Project"),
              }))
              .filter((project) => project.id)
        : [];

    // ============================================================
    // NORMALIZE TEAMS
    // ============================================================

    const normalizedTeams = Array.isArray(teams)
        ? teams
              .map((team) => ({
                  id: String(getId(team)),
                  name: getName(team, "Unnamed Team"),
                  projectId: String(
                      team?.projectId ??
                          team?.ProjectId ??
                          team?.project?.id ??
                          team?.project?.Id ??
                          ""
                  ),
              }))
              .filter((team) => team.id)
        : [];

    // ============================================================
    // AVAILABLE TEAMS
    // ============================================================

    const availableTeams = normalizedTeams.filter((team) => {
        if (!formData.projectId) {
            return true;
        }

        if (!team.projectId) {
            return true;
        }

        return team.projectId === String(formData.projectId);
    });

    // ============================================================
    // HANDLE CHANGE
    // ============================================================

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,

            ...(name === "projectId"
                ? {
                      teamId: "",
                  }
                : {}),
        }));

        setError("");
    };

    // ============================================================
    // VALIDATE
    // ============================================================

    const validateForm = () => {
        const projectId = String(formData.projectId || "").trim();
        const teamId = String(formData.teamId || "").trim();
        const name = String(formData.name || "").trim();
        const goal = String(formData.goal || "").trim();

        if (!projectId) {
            return "Please select a project.";
        }

        if (!name) {
            return "Sprint name is required.";
        }

        if (!teamId) {
            return "Please select a team.";
        }

        if (!formData.startDate) {
            return "Start date is required.";
        }

        if (!formData.endDate) {
            return "End date is required.";
        }

        if (!goal) {
            return "Sprint goal is required.";
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

        return {
            projectId,
            teamId,
            name,
            startDate: formData.startDate,
            endDate: formData.endDate,
            goal,
        };
    };

    // ============================================================
    // SUBMIT
    // ============================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (submitting) {
            return;
        }

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

        const newSprintData = {
            projectId: result.projectId,
            teamId: result.teamId,
            name: result.name,
            startDate: result.startDate,
            endDate: result.endDate,
            goal: result.goal,
        };

        try {
            await onCreated(newSprintData);

            setFormData(INITIAL_FORM);
        } catch (submitError) {
            console.error(
                "Failed to create sprint:",
                submitError
            );

            const message =
                submitError?.response?.data?.message ||
                submitError?.response?.data?.title ||
                submitError?.message ||
                "Failed to create the sprint.";

            setError(message);
        }
    };

    // ============================================================
    // CLOSE
    // ============================================================

    const handleClose = () => {
        if (submitting) {
            return;
        }

        setFormData(INITIAL_FORM);
        setError("");

        if (typeof onClose === "function") {
            onClose();
        }
    };

    // ============================================================
    // RENDER
    // ============================================================

    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-5"
            onMouseDown={(event) => {
                if (
                    event.target === event.currentTarget &&
                    !submitting
                ) {
                    handleClose();
                }
            }}
        >
            {/* ====================================================
                COMPACT ADMIN-STYLE MODAL
            ==================================================== */}

            <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto overflow-hidden rounded-xl bg-white shadow-2xl">

                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                    <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100">
                            <CalendarDays
                                size={18}
                                className="text-violet-600"
                            />
                        </div>

                        <div>
                            <h2 className="text-base font-semibold text-slate-900">
                                Create Sprint
                            </h2>

                            <p className="mt-0.5 text-xs text-slate-500">
                                Create a new sprint for your project team.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={submitting}
                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* ==================================================
                    FORM
                ================================================== */}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4 px-5 py-5"
                >
                    {/* ==================================================
                        ERROR
                    ================================================== */}

                    {error && (
                        <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5">
                            <AlertTriangle
                                size={16}
                                className="mt-0.5 shrink-0 text-red-600"
                            />

                            <p className="text-xs font-medium text-red-700">
                                {error}
                            </p>
                        </div>
                    )}

                    {/* ==================================================
                        PROJECT
                    ================================================== */}

                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-700">
                            Project{" "}
                            <span className="text-red-500">*</span>
                        </label>

                        <select
                            name="projectId"
                            value={formData.projectId}
                            onChange={handleChange}
                            disabled={submitting}
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                        >
                            <option value="">
                                Select a project...
                            </option>

                            {normalizedProjects.map((project) => (
                                <option
                                    key={project.id}
                                    value={project.id}
                                >
                                    {project.name}
                                </option>
                            ))}
                        </select>

                        {normalizedProjects.length === 0 && (
                            <p className="mt-1 text-[11px] text-slate-500">
                                No projects available.
                            </p>
                        )}
                    </div>

                    {/* ==================================================
                        SPRINT NAME
                    ================================================== */}

                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-700">
                            Sprint Name{" "}
                            <span className="text-red-500">*</span>
                        </label>

                        <input
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. Sprint 1: Core Setup"
                            disabled={submitting}
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                        />
                    </div>

                    {/* ==================================================
                        TEAM
                    ================================================== */}

                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-700">
                            Team{" "}
                            <span className="text-red-500">*</span>
                        </label>

                        <select
                            name="teamId"
                            value={formData.teamId}
                            onChange={handleChange}
                            disabled={
                                submitting ||
                                !formData.projectId
                            }
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                        >
                            <option value="">
                                {!formData.projectId
                                    ? "Select a project first..."
                                    : "Select a team..."}
                            </option>

                            {availableTeams.map((team) => (
                                <option
                                    key={team.id}
                                    value={team.id}
                                >
                                    {team.name}
                                </option>
                            ))}
                        </select>

                        {formData.projectId &&
                            availableTeams.length === 0 && (
                                <p className="mt-1 text-[11px] text-amber-600">
                                    No teams available for this project.
                                </p>
                            )}
                    </div>

                    {/* ==================================================
                        DATES
                    ================================================== */}

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                        <div>
                            <label className="mb-1 block text-xs font-medium text-slate-700">
                                Start Date{" "}
                                <span className="text-red-500">*</span>
                            </label>

                            <input
                                name="startDate"
                                type="date"
                                value={formData.startDate}
                                onChange={handleChange}
                                disabled={submitting}
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-medium text-slate-700">
                                End Date{" "}
                                <span className="text-red-500">*</span>
                            </label>

                            <input
                                name="endDate"
                                type="date"
                                value={formData.endDate}
                                onChange={handleChange}
                                min={
                                    formData.startDate ||
                                    undefined
                                }
                                disabled={submitting}
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                            />
                        </div>
                    </div>

                    {/* ==================================================
                        SPRINT GOAL
                    ================================================== */}

                    <div>
                        <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-700">
                            <Target
                                size={14}
                                className="text-violet-600"
                            />

                            Sprint Goal{" "}
                            <span className="text-red-500">*</span>
                        </label>

                        <textarea
                            name="goal"
                            rows={3}
                            value={formData.goal}
                            onChange={handleChange}
                            placeholder="Describe what this sprint should accomplish..."
                            disabled={submitting}
                            className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                        />
                    </div>

                    {/* ==================================================
                        FOOTER
                    ================================================== */}

                    <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-4">

                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={submitting}
                            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Plus size={16} />

                            {submitting
                                ? "Creating..."
                                : "Create Sprint"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateSprintModal;
