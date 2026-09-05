
// ============================================================
// AIPMS — MANAGER SPRINT MANAGEMENT
//
// Backend driven version
//
// Sprint Use Cases
// - Create Sprint
// - Update Sprint
// - Delete Sprint
// - Start Sprint
// - Complete Sprint
// - View Sprint Backlog
// - Monitor Sprint Progress
// - Assign Sprint to Team
// ============================================================

import React, { useCallback, useEffect, useMemo, useState } from "react";

import {
    ListChecks,
    Activity,
    CheckCircle2,
    Clock,
    Plus,
    AlertTriangle,
    X,
    UsersRound,
    Sparkles,
    RefreshCw,
} from "lucide-react";

// ============================================================
// SPRINT SERVICE
// ============================================================

import sprintService from "../../services/sprintService";
import api from "../../services/api"; // 🌟 ADD THIS (or wherever your api.js is)
// ============================================================
// SPRINT COMPONENTS
// ============================================================

import SprintCard from "../../components/manager/sprint/SprintCard";
import CreateSprintModal from "../../components/manager/sprint/CreateSprintModal";
import UpdateSprintModal from "../../components/manager/sprint/UpdateSprintModal";
import DeleteSprintModal from "../../components/manager/sprint/DeleteSprintModal";
import StartSprintModal from "../../components/manager/sprint/StartSprintModal";
import CompleteSprintModal from "../../components/manager/sprint/CompleteSprintModal";
import SprintBacklogModal from "../../components/manager/sprint/SprintBacklogModal";

// ============================================================
// HELPERS
// ============================================================

const getValue = (object, ...keys) => {
    for (const key of keys) {
        if (
            object &&
            object[key] !== undefined &&
            object[key] !== null
        ) {
            return object[key];
        }
    }

    return undefined;
};

// ============================================================
// NORMALIZE SPRINT RESPONSE
//
// This allows the UI to work with common backend DTO naming
// conventions such as:
// Id / id
// Name / name
// Status / status
// Progress / progress
// etc.
// ============================================================

const normalizeSprint = (sprint) => {
    if (!sprint) {
        return null;
    }

    const id = getValue(sprint, "id", "Id", "sprintId", "SprintId");

    const name = getValue(
        sprint,
        "name",
        "Name",
        "sprintName",
        "SprintName"
    );

    const goal = getValue(
        sprint,
        "goal",
        "Goal",
        "sprintGoal",
        "SprintGoal"
    );

    const status = getValue(
        sprint,
        "status",
        "Status"
    );

    const progress = getValue(
        sprint,
        "progress",
        "Progress",
        "progressPercentage",
        "ProgressPercentage"
    );

    const teamId = getValue(
        sprint,
        "teamId",
        "TeamId"
    );

    const team = getValue(
        sprint,
        "team",
        "Team",
        "teamName",
        "TeamName"
    );

    const projectId = getValue(
        sprint,
        "projectId",
        "ProjectId"
    );

    const projectName = getValue(
        sprint,
        "projectName",
        "ProjectName"
    );

    const managerId = getValue(
        sprint,
        "managerId",
        "ManagerId",
        "createdById",
        "CreatedById"
    );

    const startDate = getValue(
        sprint,
        "startDate",
        "StartDate"
    );

    const endDate = getValue(
        sprint,
        "endDate",
        "EndDate"
    );

    const tasks = getValue(
        sprint,
        "tasks",
        "Tasks",
        "sprintTasks",
        "SprintTasks"
    );

    return {
        ...sprint,

        id,
        name: name || "Unnamed Sprint",
        goal: goal || "",
        status: status || "Planning",
        progress: Number(progress) || 0,

        teamId: teamId ?? null,
        team:
            typeof team === "object"
                ? getValue(team, "name", "Name")
                : team || "",

        projectId: projectId ?? null,
        projectName:
            projectName ||
            "Project",

        managerId: managerId ?? null,

        startDate:
            startDate || "",

        endDate:
            endDate || "",

        tasks:
            Array.isArray(tasks)
                ? tasks
                : [],
    };
};

// ============================================================
// STATUS HELPER
// ============================================================

const normalizeStatus = (status) =>
    String(status || "")
        .trim()
        .toLowerCase();

// ============================================================
// COMPONENT
// ============================================================

function SprintManagement() {
    // ========================================================
    // SPRINT DATA
    // ========================================================

    const [sprints, setSprints] = useState([]);
    const [teams, setTeams] = useState([]);
    // ========================================================
    // LOADING
    // ========================================================

    const [loading, setLoading] = useState(true);

    const [actionLoading, setActionLoading] =
        useState(false);

    // ========================================================
    // MODAL STATE
    // ========================================================

    const [selectedSprint, setSelectedSprint] =
        useState(null);

    const [modalMode, setModalMode] =
        useState(null);

    // ========================================================
    // CREATE SPRINT MODAL
    // ========================================================

    const [showCreateForm, setShowCreateForm] =
        useState(false);

    // ========================================================
    // MONITOR SPRINT PROGRESS
    // ========================================================

    const [showProgress, setShowProgress] =
        useState(false);

    // ========================================================
    // ASSIGN SPRINT TO TEAM
    // ========================================================

    const [showAssignTeam, setShowAssignTeam] =
        useState(false);

    const [selectedTeam, setSelectedTeam] =
        useState("");

    // ========================================================
    // MESSAGES
    // ========================================================

    const [successMessage, setSuccessMessage] =
        useState("");

    const [errorMessage, setErrorMessage] =
        useState("");



            const loadTeams = useCallback(async () => {
        try {
            // 🌟 Use the existing api service which automatically handles the Bearer token!
            const response = await api.get("/Team");
            
            // The api interceptor usually returns the data directly in response.data
            const teamData = Array.isArray(response.data) ? response.data : [];
            setTeams(teamData);
        } catch (error) {
            console.error("Failed to load teams:", error);
        }
    }, []);




    // ===============
    //=========================================
    // LOAD SPRINTS
    // ========================================================

    const loadSprints = useCallback(async () => {
        try {
            setLoading(true);
            setErrorMessage("");

            const response =
                await sprintService.getAllSprints();

            const data =
                Array.isArray(response)
                    ? response
                    : Array.isArray(response?.data)
                    ? response.data
                    : Array.isArray(response?.items)
                    ? response.items
                    : [];

            const normalized =
                data
                    .map(normalizeSprint)
                    .filter(Boolean);

            setSprints(normalized);
        } catch (error) {
            console.error(
                "Failed to load sprints:",
                error
            );

            setErrorMessage(
                error?.response?.data?.message ||
                    error?.response?.data?.title ||
                    "Failed to load sprints from the server."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    // ========================================================
    // INITIAL LOAD
    // ========================================================

         useEffect(() => {
        loadSprints();
        loadTeams(); // 🌟 This will now work perfectly
    }, [loadSprints, loadTeams]);

    // ========================================================
    // MESSAGE HELPERS
    // ========================================================

    const clearMessages = () => {
        setSuccessMessage("");
        setErrorMessage("");
    };

    const showSuccess = (message) => {
        setErrorMessage("");
        setSuccessMessage(message);

        window.setTimeout(() => {
            setSuccessMessage("");
        }, 4000);
    };

    const showError = (message) => {
        setSuccessMessage("");
        setErrorMessage(message);
    };

    // ========================================================
    // CLOSE STANDARD MODAL
    // ========================================================

    const closeModal = () => {
        setSelectedSprint(null);
        setModalMode(null);
    };

    // ========================================================
    // CLOSE PROGRESS MODAL
    // ========================================================

    const closeProgress = () => {
        setShowProgress(false);
        setSelectedSprint(null);
    };

    // ========================================================
    // CLOSE ASSIGN TEAM MODAL
    // ========================================================

    const closeAssignTeam = () => {
        setShowAssignTeam(false);
        setSelectedSprint(null);
        setSelectedTeam("");
    };

    // ========================================================
    // SPRINTS
    //
    // Backend authorization is responsible for ensuring that
    // the manager only receives/manages permitted sprints.
    // ========================================================

    const assignedSprints = useMemo(() => {
        return sprints;
    }, [sprints]);

    // ========================================================
    // STATISTICS
    // ========================================================

    const sprintStats = useMemo(() => {
        const total =
            assignedSprints.length;

        const active =
            assignedSprints.filter(
                (sprint) =>
                    normalizeStatus(
                        sprint.status
                    ) === "active"
            ).length;

        const completed =
            assignedSprints.filter(
                (sprint) =>
                    normalizeStatus(
                        sprint.status
                    ) === "completed"
            ).length;

        const planning =
            assignedSprints.filter(
                (sprint) =>
                    normalizeStatus(
                        sprint.status
                    ) === "planning"
            ).length;

        return [
            {
                title: "Total Sprints",
                value: total,
                icon: ListChecks,
                color:
                    "from-violet-500 to-purple-600",
                iconBg:
                    "bg-violet-100",
                iconColor:
                    "text-violet-600",
            },
            {
                title: "Active Sprints",
                value: active,
                icon: Activity,
                color:
                    "from-emerald-500 to-green-600",
                iconBg:
                    "bg-emerald-100",
                iconColor:
                    "text-emerald-600",
            },
            {
                title: "Completed",
                value: completed,
                icon: CheckCircle2,
                color:
                    "from-blue-500 to-cyan-600",
                iconBg:
                    "bg-blue-100",
                iconColor:
                    "text-blue-600",
            },
            {
                title: "Planning",
                value: planning,
                icon: Clock,
                color:
                    "from-amber-500 to-orange-600",
                iconBg:
                    "bg-amber-100",
                iconColor:
                    "text-amber-600",
            },
        ];
    }, [assignedSprints]);

    // ========================================================
    // CREATE SPRINT
    // ========================================================

    const handleCreateSprint = async (
        sprintData
    ) => {
        clearMessages();

        if (!sprintData) {
            showError(
                "Sprint information is required."
            );
            return;
        }

        const name =
            String(
                sprintData.name || ""
            ).trim();

        const goal =
            String(
                sprintData.goal || ""
            ).trim();

        const startDate =
            sprintData.startDate || "";

        const endDate =
            sprintData.endDate || "";

        if (
            !name ||
            !goal ||
            !startDate ||
            !endDate
        ) {
            showError(
                "Please complete all sprint fields."
            );

            return;
        }

        if (
            new Date(endDate) <=
            new Date(startDate)
        ) {
            showError(
                "Sprint end date must be after the start date."
            );

            return;
        }

        const duplicate =
            assignedSprints.some(
                (sprint) =>
                    String(
                        sprint.name
                    )
                        .trim()
                        .toLowerCase() ===
                    name.toLowerCase()
            );

        if (duplicate) {
            showError(
                "A sprint with this name already exists."
            );

            return;
        }

        try {
            setActionLoading(true);

            // Keep the complete object returned by
            // CreateSprintModal and send it to the API.
            await sprintService.createSprint(
                sprintData
            );

            setShowCreateForm(false);

            await loadSprints();

            showSuccess(
                "Sprint created successfully."
            );
        } catch (error) {
            console.error(
                "Create sprint failed:",
                error
            );

            showError(
                error?.response?.data?.message ||
                    error?.response?.data?.title ||
                    "Failed to create sprint."
            );
        } finally {
            setActionLoading(false);
        }
    };

    // ========================================================
    // UPDATE SPRINT
    // ========================================================

    const handleUpdate = (sprint) => {
        clearMessages();

        if (!sprint) {
            showError(
                "The selected sprint could not be found."
            );

            return;
        }

        setSelectedSprint(sprint);
        setModalMode("update");
    };

    // ========================================================
    // UPDATE COMPLETED
    // ========================================================

    const handleSprintUpdated = async (
        sprintId,
        updatedSprint
    ) => {
        clearMessages();

        if (!sprintId) {
            showError(
                "The sprint could not be updated."
            );

            return;
        }

        try {
            setActionLoading(true);

            // If the modal already returns the complete
            // update payload, send it directly.
            await sprintService.updateSprint(
                sprintId,
                updatedSprint
            );

            closeModal();

            await loadSprints();

            showSuccess(
                "Sprint updated successfully."
            );
        } catch (error) {
            console.error(
                "Update sprint failed:",
                error
            );

            showError(
                error?.response?.data?.message ||
                    error?.response?.data?.title ||
                    "Failed to update sprint."
            );
        } finally {
            setActionLoading(false);
        }
    };

    // ========================================================
    // DELETE SPRINT
    // ========================================================

    const handleDelete = (sprint) => {
        clearMessages();

        if (!sprint) {
            showError(
                "The selected sprint could not be found."
            );

            return;
        }

        const status =
            normalizeStatus(
                sprint.status
            );

        if (status === "active") {
            showError(
                "An active sprint cannot be deleted."
            );

            return;
        }

        if (status === "completed") {
            showError(
                "A completed sprint cannot be deleted."
            );

            return;
        }

        setSelectedSprint(sprint);
        setModalMode("delete");
    };

    // ========================================================
    // DELETE COMPLETED
    // ========================================================

    const handleSprintDeleted = async (
        sprintId
    ) => {
        clearMessages();

        if (!sprintId) {
            showError(
                "The sprint could not be deleted."
            );

            return;
        }

        try {
            setActionLoading(true);

            await sprintService.deleteSprint(
                sprintId
            );

            closeModal();

            await loadSprints();

            showSuccess(
                "Sprint deleted successfully."
            );
        } catch (error) {
            console.error(
                "Delete sprint failed:",
                error
            );

            showError(
                error?.response?.data?.message ||
                    error?.response?.data?.title ||
                    "Failed to delete sprint."
            );
        } finally {
            setActionLoading(false);
        }
    };

    // ========================================================
    // START SPRINT
    // ========================================================

    const handleStart = (sprint) => {
        clearMessages();

        if (!sprint) {
            showError(
                "The selected sprint could not be found."
            );

            return;
        }

        const status =
            normalizeStatus(
                sprint.status
            );

        if (status !== "planning") {
            showError(
                "Only a planning sprint can be started."
            );

            return;
        }

        const activeSprint =
            assignedSprints.find(
                (item) =>
                    String(item.id) !==
                        String(sprint.id) &&
                    normalizeStatus(
                        item.status
                    ) === "active"
            );

        if (activeSprint) {
            showError(
                `${activeSprint.name} is already active. Complete it before starting another sprint.`
            );

            return;
        }

        setSelectedSprint(sprint);
        setModalMode("start");
    };

    // ========================================================
    // START COMPLETED
    // ========================================================

    const handleSprintStarted = async (
        sprintId
    ) => {
        clearMessages();

        if (!sprintId) {
            showError(
                "The sprint could not be started."
            );

            return;
        }

        try {
            setActionLoading(true);

            await sprintService.startSprint(
                sprintId
            );

            closeModal();

            await loadSprints();

            showSuccess(
                "Sprint started successfully."
            );
        } catch (error) {
            console.error(
                "Start sprint failed:",
                error
            );

            showError(
                error?.response?.data?.message ||
                    error?.response?.data?.title ||
                    "Failed to start sprint."
            );
        } finally {
            setActionLoading(false);
        }
    };

    // ========================================================
    // COMPLETE SPRINT
    // ========================================================

    const handleComplete = (sprint) => {
        clearMessages();

        if (!sprint) {
            showError(
                "The selected sprint could not be found."
            );

            return;
        }

        if (
            normalizeStatus(
                sprint.status
            ) !== "active"
        ) {
            showError(
                "Only an active sprint can be completed."
            );

            return;
        }

        setSelectedSprint(sprint);
        setModalMode("complete");
    };

    // ========================================================
    // COMPLETE COMPLETED
    // ========================================================

    const handleSprintCompleted = async (
        sprintId
    ) => {
        clearMessages();

        if (!sprintId) {
            showError(
                "The sprint could not be completed."
            );

            return;
        }

        try {
            setActionLoading(true);

            await sprintService.completeSprint(
                sprintId
            );

            closeModal();

            await loadSprints();

            showSuccess(
                "Sprint completed successfully."
            );
        } catch (error) {
            console.error(
                "Complete sprint failed:",
                error
            );

            showError(
                error?.response?.data?.message ||
                    error?.response?.data?.title ||
                    "Failed to complete sprint."
            );
        } finally {
            setActionLoading(false);
        }
    };

    // ========================================================
    // VIEW BACKLOG
    // ========================================================

    const handleViewBacklog = (sprint) => {
        clearMessages();

        if (!sprint) {
            showError(
                "The selected sprint could not be found."
            );

            return;
        }

        setSelectedSprint(sprint);
        setModalMode("backlog");
    };

    // ========================================================
    // MONITOR SPRINT PROGRESS
    // ========================================================

    const handleMonitorProgress = async (
        sprint
    ) => {
        clearMessages();

        if (!sprint) {
            showError(
                "The selected sprint could not be found."
            );

            return;
        }

        try {
            setActionLoading(true);

            // Get the latest progress from backend.
            const response =
                await sprintService.getSprintProgressReport(
                    sprint.projectId,
                    sprint.id
                );

            const report =
                response?.data ||
                response;

            const progress =
                getValue(
                    report,
                    "progress",
                    "Progress",
                    "progressPercentage",
                    "ProgressPercentage"
                );

            setSelectedSprint({
                ...sprint,

                ...(report || {}),

                progress:
                    progress !== undefined
                        ? Number(progress)
                        : sprint.progress,
            });

            setShowProgress(true);
        } catch (error) {
            console.error(
                "Load sprint progress failed:",
                error
            );

            // We still open the monitor using the
            // currently loaded sprint data.
            setSelectedSprint(sprint);
            setShowProgress(true);

            showError(
                error?.response?.data?.message ||
                    "Unable to load the latest sprint progress."
            );
        } finally {
            setActionLoading(false);
        }
    };

    // ========================================================
    // ASSIGN SPRINT TO TEAM
    // ========================================================

    const handleAssignTeam = (sprint) => {
        clearMessages();

        if (!sprint) {
            showError(
                "The selected sprint could not be found."
            );

            return;
        }

        setSelectedSprint(sprint);

        setSelectedTeam(
            sprint.teamId ??
                sprint.team ??
                ""
        );

        setShowAssignTeam(true);
    };

    // ========================================================
    // SAVE TEAM ASSIGNMENT
    // ========================================================

    const handleSaveTeamAssignment =
        async () => {
            clearMessages();

            if (!selectedSprint) {
                showError(
                    "No sprint has been selected."
                );

                return;
            }

            const teamValue =
                String(
                    selectedTeam || ""
                ).trim();

            if (!teamValue) {
                showError(
                    "Please enter the team ID."
                );

                return;
            }

            try {
                setActionLoading(true);

                /*
                 * assignSprintToTeam requires:
                 *
                 * sprintId
                 * teamId
                 *
                 * The existing modal uses a text field.
                 * Therefore the value entered here is sent
                 * directly as the team ID.
                 */
                await sprintService.assignSprintToTeam(
                    selectedSprint.id,
                    teamValue
                );

                closeAssignTeam();

                await loadSprints();

                showSuccess(
                    "Sprint assigned to the team successfully."
                );
            } catch (error) {
                console.error(
                    "Assign sprint to team failed:",
                    error
                );

                showError(
                    error?.response?.data?.message ||
                        error?.response?.data?.title ||
                        "Failed to assign sprint to team."
                );
            } finally {
                setActionLoading(false);
            }
        };

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">

            <main className="min-h-screen">

                <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">

                    {/* ==================================================
                        HEADER
                    ================================================== */}

                    <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 p-7 text-white shadow-lg">

                        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10" />

                        <div className="absolute -bottom-20 right-24 h-44 w-44 rounded-full bg-white/10" />

                        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                            <div className="flex items-center gap-4">

                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20 backdrop-blur-sm">

                                    <ListChecks
                                        size={28}
                                        className="text-white"
                                    />

                                </div>

                                <div>

                                    <div className="mb-1 flex items-center gap-2">

                                        <Sparkles
                                            size={16}
                                            className="text-cyan-200"
                                        />

                                        <span className="text-xs font-semibold uppercase tracking-wider text-white/80">
                                            Sprint Workspace
                                        </span>

                                    </div>

                                    <h1 className="text-3xl font-bold tracking-tight">
                                        Sprint Management
                                    </h1>

                                    <p className="mt-1 max-w-2xl text-sm text-white/80">
                                        Create, manage, monitor and assign project sprints.
                                    </p>

                                </div>

                            </div>

                            <div className="flex items-center gap-2">

                                <button
                                    type="button"
                                    onClick={
                                        loadSprints
                                    }
                                    disabled={
                                        loading ||
                                        actionLoading
                                    }
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <RefreshCw
                                        size={17}
                                        className={
                                            loading
                                                ? "animate-spin"
                                                : ""
                                        }
                                    />

                                    Refresh
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        clearMessages();
                                        setShowCreateForm(
                                            true
                                        );
                                    }}
                                    disabled={
                                        actionLoading
                                    }
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-violet-700 shadow-md transition hover:bg-slate-50 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <Plus size={18} />
                                    Create Sprint
                                </button>

                            </div>

                        </div>

                    </div>

                    {/* ==================================================
                        SUCCESS MESSAGE
                    ================================================== */}

                    {successMessage && (
                        <div
                            role="status"
                            className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 shadow-sm"
                        >
                            <CheckCircle2
                                size={19}
                                className="shrink-0 text-emerald-600"
                            />

                            <span>
                                {successMessage}
                            </span>
                        </div>
                    )}

                    {/* ==================================================
                        ERROR MESSAGE
                    ================================================== */}

                    {errorMessage && (
                        <div
                            role="alert"
                            className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 shadow-sm"
                        >
                            <AlertTriangle
                                size={19}
                                className="mt-0.5 shrink-0 text-red-600"
                            />

                            <span>
                                {errorMessage}
                            </span>

                        </div>
                    )}

                    {/* ==================================================
                        STATISTICS
                    ================================================== */}

                    <section className="mb-10">

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

                            {sprintStats.map(
                                (item) => {

                                    const Icon =
                                        item.icon;

                                    return (
                                        <div
                                            key={
                                                item.title
                                            }
                                            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
                                        >

                                            <div
                                                className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${item.color}`}
                                            />

                                            <div className="flex items-center justify-between">

                                                <div>

                                                    <p className="text-sm font-medium text-slate-500">
                                                        {
                                                            item.title
                                                        }
                                                    </p>

                                                    <p className="mt-2 text-3xl font-bold text-slate-900">
                                                        {
                                                            item.value
                                                        }
                                                    </p>

                                                </div>

                                                <div
                                                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.iconBg}`}
                                                >

                                                    <Icon
                                                        size={22}
                                                        className={
                                                            item.iconColor
                                                        }
                                                    />

                                                </div>

                                            </div>

                                            <div
                                                className={`mt-4 h-1 w-16 rounded-full bg-gradient-to-r ${item.color}`}
                                            />

                                        </div>
                                    );
                                }
                            )}

                        </div>

                    </section>

                    {/* ==================================================
                        SPRINT LIST
                    ================================================== */}

                    <section>

                        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

                            <div>

                                <div className="flex items-center gap-2">

                                    <div className="h-2.5 w-2.5 rounded-full bg-violet-500" />

                                    <h2 className="text-xl font-bold text-slate-900">
                                        Project Sprints
                                    </h2>

                                </div>

                                <p className="mt-1 text-sm text-slate-500">
                                    Manage the sprints assigned to your project teams.
                                </p>

                            </div>

                            <div className="rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-bold text-violet-700">

                                {assignedSprints.length}{" "}

                                {assignedSprints.length ===
                                1
                                    ? "Sprint"
                                    : "Sprints"}

                            </div>

                        </div>

                        {/* ==================================================
                            LOADING
                        ================================================== */}

                        {loading ? (
                            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">

                                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100">

                                    <RefreshCw
                                        size={30}
                                        className="animate-spin text-violet-600"
                                    />

                                </div>

                                <h3 className="text-lg font-bold text-slate-900">
                                    Loading Sprints
                                </h3>

                                <p className="mt-2 text-sm text-slate-500">
                                    Fetching sprint information from the server...
                                </p>

                            </div>
                        ) : assignedSprints.length ===
                          0 ? (
                            <div className="rounded-2xl border border-dashed border-violet-300 bg-white px-6 py-16 text-center shadow-sm">

                                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100">

                                    <ListChecks
                                        size={32}
                                        className="text-violet-600"
                                    />

                                </div>

                                <h3 className="text-lg font-bold text-slate-900">
                                    No Sprints
                                </h3>

                                <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                                    No sprints have been created yet.
                                </p>

                                <button
                                    type="button"
                                    onClick={() => {
                                        clearMessages();

                                        setShowCreateForm(
                                            true
                                        );
                                    }}
                                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:from-violet-700 hover:to-blue-700 hover:shadow-md"
                                >
                                    <Plus size={17} />
                                    Create Sprint
                                </button>

                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

                                {assignedSprints.map(
                                    (sprint) => (
                                        <div
                                            key={
                                                sprint.id
                                            }
                                            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-1 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                                        >

                                            {/* Status accent */}

                                            <div
                                                className={
                                                    normalizeStatus(
                                                        sprint.status
                                                    ) ===
                                                    "active"
                                                        ? "absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-emerald-400 to-green-600"
                                                        : normalizeStatus(
                                                              sprint.status
                                                          ) ===
                                                          "completed"
                                                        ? "absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-blue-400 to-cyan-600"
                                                        : "absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-amber-400 to-orange-500"
                                                }
                                            />

                                            <div className="rounded-xl bg-white p-4">

                                                <SprintCard
                                                    sprint={
                                                        sprint
                                                    }
                                                    onViewBacklog={
                                                        handleViewBacklog
                                                    }
                                                    onStart={
                                                        handleStart
                                                    }
                                                    onComplete={
                                                        handleComplete
                                                    }
                                                    onUpdate={
                                                        handleUpdate
                                                    }
                                                    onDelete={
                                                        handleDelete
                                                    }
                                                    onMonitorProgress={
                                                        handleMonitorProgress
                                                    }
                                                    onAssignTeam={
                                                        handleAssignTeam
                                                    }
                                                />

                                            </div>

                                        </div>
                                    )
                                )}

                            </div>
                        )}

                    </section>

                </div>

            </main>

                      {showCreateForm && (
                <CreateSprintModal
                    isOpen={showCreateForm}
                    onClose={() => setShowCreateForm(false)}
                    onCreated={handleCreateSprint}
                    projectId="4a66be10-c9b6-44d5-bc8e-94de161b5fc3" 
                    teamId="bd2b9476-e01b-4911-99c1-3a89a2d8a010"   
                    teams={teams} // 🌟 PASS THE FETCHED TEAMS HERE
                />
            )}

            {/* ==========================================================
                UPDATE SPRINT
            ========================================================== */}

            {selectedSprint &&
                modalMode === "update" && (
                    <UpdateSprintModal
                        sprint={
                            selectedSprint
                        }
                        onClose={
                            closeModal
                        }
                        onUpdated={
                            handleSprintUpdated
                        }
                    />
                )}

            {/* ==========================================================
                DELETE SPRINT
            ========================================================== */}

            {selectedSprint &&
                modalMode === "delete" && (
                    <DeleteSprintModal
                        sprint={
                            selectedSprint
                        }
                        onClose={
                            closeModal
                        }
                        onDeleted={
                            handleSprintDeleted
                        }
                    />
                )}

            {/* ==========================================================
                START SPRINT
            ========================================================== */}

            {selectedSprint &&
                modalMode === "start" && (
                    <StartSprintModal
                        sprint={
                            selectedSprint
                        }
                        onClose={
                            closeModal
                        }
                        onStarted={
                            handleSprintStarted
                        }
                    />
                )}

            {/* ==========================================================
                COMPLETE SPRINT
            ========================================================== */}

            {selectedSprint &&
                modalMode === "complete" && (
                    <CompleteSprintModal
                        sprint={
                            selectedSprint
                        }
                        onClose={
                            closeModal
                        }
                        onCompleted={
                            handleSprintCompleted
                        }
                    />
                )}

            {/* ==========================================================
                VIEW SPRINT BACKLOG
            ========================================================== */}

            {selectedSprint &&
                modalMode === "backlog" && (
                    <SprintBacklogModal
                        sprint={
                            selectedSprint
                        }
                        onClose={
                            closeModal
                        }
                    />
                )}

            {/* ==========================================================
                MONITOR SPRINT PROGRESS
            ========================================================== */}

            {showProgress &&
                selectedSprint && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">

                        <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

                            <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-5 text-white">

                                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/10" />

                                <div className="relative flex items-center justify-between">

                                    <div>

                                        <h2 className="text-lg font-bold">
                                            Monitor Sprint Progress
                                        </h2>

                                        <p className="mt-1 text-sm text-white/80">
                                            {
                                                selectedSprint.name
                                            }
                                        </p>

                                    </div>

                                    <button
                                        type="button"
                                        onClick={
                                            closeProgress
                                        }
                                        className="rounded-lg p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
                                    >
                                        <X size={19} />
                                    </button>

                                </div>

                            </div>

                            <div className="space-y-5 px-6 py-6">

                                <div className="text-center">

                                    <p className="text-sm font-medium text-slate-500">
                                        Current Progress
                                    </p>

                                    <p className="mt-2 bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-5xl font-extrabold text-transparent">
                                        {
                                            selectedSprint.progress
                                        }
                                        %
                                    </p>

                                </div>

                                <div>

                                    <div className="h-3 overflow-hidden rounded-full bg-slate-100">

                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-500 transition-all"
                                            style={{
                                                width: `${Math.min(
                                                    Math.max(
                                                        Number(
                                                            selectedSprint.progress
                                                        ) ||
                                                            0,
                                                        0
                                                    ),
                                                    100
                                                )}%`,
                                            }}
                                        />

                                    </div>

                                </div>

                                <div className="grid grid-cols-2 gap-3">

                                    <div className="rounded-xl border border-violet-100 bg-violet-50 p-4">

                                        <p className="text-xs font-semibold text-violet-600">
                                            Status
                                        </p>

                                        <p className="mt-1 font-bold text-slate-900">
                                            {
                                                selectedSprint.status
                                            }
                                        </p>

                                    </div>

                                    <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">

                                        <p className="text-xs font-semibold text-blue-600">
                                            Team
                                        </p>

                                        <p className="mt-1 font-bold text-slate-900">
                                            {
                                                selectedSprint.team ||
                                                "Not assigned"
                                            }
                                        </p>

                                    </div>

                                </div>

                                <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">

                                    <p className="text-sm font-semibold text-emerald-700">
                                        Sprint Goal
                                    </p>

                                    <p className="mt-1 text-sm leading-6 text-slate-600">
                                        {
                                            selectedSprint.goal ||
                                            "No sprint goal specified."
                                        }
                                    </p>

                                </div>

                                <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">

                                    <p className="text-sm font-semibold text-amber-700">
                                        Backlog
                                    </p>

                                    <p className="mt-1 text-sm text-slate-600">
                                        {
                                            selectedSprint
                                                .tasks
                                                ?.length ||
                                            0
                                        }{" "}
                                        tasks in this sprint.
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>
                )}

            {/* ==========================================================
                ASSIGN SPRINT TO TEAM
            ========================================================== */}

            {showAssignTeam &&
                selectedSprint && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">

                        <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

                            <div className="relative overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-5 text-white">

                                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/10" />

                                <div className="relative flex items-center justify-between">

                                    <div className="flex items-center gap-3">

                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">

                                            <UsersRound
                                                size={19}
                                                className="text-white"
                                            />

                                        </div>

                                        <div>

                                            <h2 className="text-lg font-bold">
                                                Assign Sprint to Team
                                            </h2>

                                            <p className="text-sm text-white/80">
                                                {
                                                    selectedSprint.name
                                                }
                                            </p>

                                        </div>

                                    </div>

                                    <button
                                        type="button"
                                        onClick={
                                            closeAssignTeam
                                        }
                                        className="rounded-lg p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
                                    >
                                        <X size={19} />
                                    </button>

                                </div>

                            </div>

                            <div className="px-6 py-5">

                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                    Team ID
                                </label>

                                <input
                                    type="text"
                                    value={
                                        selectedTeam
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setSelectedTeam(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    placeholder="Enter team ID"
                                    disabled={
                                        actionLoading
                                    }
                                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                                />

                                <p className="mt-2 text-xs leading-5 text-slate-500">
                                    Enter the team ID that should be responsible for this sprint.
                                </p>

                            </div>

                            <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4">

                                <button
                                    type="button"
                                    onClick={
                                        closeAssignTeam
                                    }
                                    disabled={
                                        actionLoading
                                    }
                                    className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        handleSaveTeamAssignment
                                    }
                                    disabled={
                                        actionLoading
                                    }
                                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:from-cyan-600 hover:to-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {actionLoading && (
                                        <RefreshCw
                                            size={16}
                                            className="animate-spin"
                                        />
                                    )}

                                    Assign Team
                                </button>

                            </div>

                        </div>

                    </div>
                )}

        </div>
    );
}

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default SprintManagement;