
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

import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    ListChecks,
    Activity,
    CheckCircle2,
    Clock,
    Plus,
    AlertTriangle,
    X,
    UsersRound,
    RefreshCw,
    CalendarDays,
    Target,
} from "lucide-react";

// ============================================================
// SERVICES
// ============================================================

import sprintService from "../../services/sprintService";
import { getTeams } from "../../services/teamService";
import { getMyProjects } from "../../services/projectService";

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
// EXTRACT ARRAY
// ============================================================

const extractArray = (response, keys = []) => {
    if (Array.isArray(response)) {
        return response;
    }

    if (Array.isArray(response?.data)) {
        return response.data;
    }

    for (const key of keys) {
        if (Array.isArray(response?.[key])) {
            return response[key];
        }

        if (Array.isArray(response?.data?.[key])) {
            return response.data[key];
        }
    }

    if (Array.isArray(response?.items)) {
        return response.items;
    }

    if (Array.isArray(response?.data?.items)) {
        return response.data.items;
    }

    return [];
};

// ============================================================
// NORMALIZE SPRINT
// ============================================================

const normalizeSprint = (sprint) => {
    if (!sprint) {
        return null;
    }

    const id = getValue(
        sprint,
        "id",
        "Id",
        "sprintId",
        "SprintId"
    );

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
        "Status",
        "statusName",
        "StatusName"
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

        name:
            name ||
            "Unnamed Sprint",

        goal:
            goal ||
            "",

        status:
            status ||
            "Planning",

        progress:
            Number(progress) || 0,

        teamId:
            teamId ??
            null,

        team:
            typeof team === "object"
                ? getValue(
                      team,
                      "name",
                      "Name",
                      "teamName",
                      "TeamName"
                  )
                : team || "",

        projectId:
            projectId ??
            null,

        projectName:
            projectName ||
            "Project",

        managerId:
            managerId ??
            null,

        startDate:
            startDate ||
            "",

        endDate:
            endDate ||
            "",

        tasks:
            Array.isArray(tasks)
                ? tasks
                : [],
    };
};

// ============================================================
// STATUS HELPERS
// ============================================================

const normalizeStatus = (status) =>
    String(status || "")
        .trim()
        .toLowerCase();

const getStatusStyle = (status) => {
    const normalized = normalizeStatus(status);

    if (
        normalized === "active" ||
        normalized === "in progress"
    ) {
        return {
            wrapper:
                "border-primary/20 bg-primary/10 text-primary",
            dot:
                "bg-primary",
        };
    }

    if (
        normalized === "completed" ||
        normalized === "complete" ||
        normalized === "done"
    ) {
        return {
            wrapper:
                "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
            dot:
                "bg-emerald-500",
        };
    }

    if (
        normalized === "planning" ||
        normalized === "planned"
    ) {
        return {
            wrapper:
                "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
            dot:
                "bg-amber-500",
        };
    }

    return {
        wrapper:
            "border-border bg-muted text-muted-foreground",
        dot:
            "bg-muted-foreground",
    };
};

// ============================================================
// DATE FORMATTER
// ============================================================

const formatDate = (date) => {
    if (!date) {
        return "Not set";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "Not set";
    }

    return parsedDate.toLocaleDateString();
};

// ============================================================
// COMPONENT
// ============================================================

function SprintManagement() {
    // ========================================================
    // DATA
    // ========================================================

    const [sprints, setSprints] = useState([]);
    const [teams, setTeams] = useState([]);
    const [projects, setProjects] = useState([]);

    // ========================================================
    // LOADING
    // ========================================================

    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    // ========================================================
    // MODAL
    // ========================================================

    const [selectedSprint, setSelectedSprint] = useState(null);
    const [modalMode, setModalMode] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);

    // ========================================================
    // PROGRESS
    // ========================================================

    const [showProgress, setShowProgress] = useState(false);

    // ========================================================
    // ASSIGN TEAM
    // ========================================================

    const [showAssignTeam, setShowAssignTeam] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState("");

    // ========================================================
    // MESSAGES
    // ========================================================

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // ========================================================
    // MESSAGE HELPERS
    // ========================================================

    const clearMessages = useCallback(() => {
        setSuccessMessage("");
        setErrorMessage("");
    }, []);

    const showSuccess = useCallback((message) => {
        setErrorMessage("");
        setSuccessMessage(message);

        window.setTimeout(() => {
            setSuccessMessage("");
        }, 4000);
    }, []);

    const showError = useCallback((message) => {
        setSuccessMessage("");
        setErrorMessage(message);
    }, []);

    // ========================================================
    // LOAD TEAMS
    // ========================================================

    const loadTeams = useCallback(async () => {
        try {
            const response = await getTeams();

            const teamData = extractArray(
                response,
                ["teams"]
            );

            setTeams(teamData);
        } catch (error) {
            console.error(
                "Failed to load teams:",
                error
            );

            setTeams([]);
        }
    }, []);

    // ========================================================
    // LOAD MANAGER PROJECTS
    // ========================================================

    const loadProjects = useCallback(async () => {
        try {
            const response = await getMyProjects();

            const projectData = extractArray(
                response,
                ["projects"]
            );

            setProjects(projectData);
        } catch (error) {
            console.error(
                "Failed to load projects:",
                error
            );

            setProjects([]);
        }
    }, []);

    // ========================================================
    // LOAD SPRINTS
    // ========================================================

    const loadSprints = useCallback(async () => {
        try {
            setLoading(true);
            setErrorMessage("");

            const response =
                await sprintService.getAllSprints();

            const data = extractArray(
                response,
                ["sprints"]
            );

            const normalized = data
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
        const initialize = async () => {
            await Promise.all([
                loadSprints(),
                loadTeams(),
                loadProjects(),
            ]);
        };

        initialize();
    }, [
        loadSprints,
        loadTeams,
        loadProjects,
    ]);

    // ========================================================
    // ENRICH SPRINTS
    // ========================================================

    const assignedSprints = useMemo(() => {
        return sprints.map((sprint) => {
            const matchedTeam = teams.find((team) => {
                const teamId =
                    team?.id ??
                    team?.Id ??
                    team?.teamId ??
                    team?.TeamId;

                return (
                    sprint.teamId &&
                    teamId &&
                    String(teamId).toLowerCase() ===
                        String(sprint.teamId).toLowerCase()
                );
            });

            const matchedProject = projects.find(
                (project) => {
                    const projectId =
                        project?.id ??
                        project?.Id ??
                        project?.projectId ??
                        project?.ProjectId;

                    return (
                        sprint.projectId &&
                        projectId &&
                        String(projectId).toLowerCase() ===
                            String(sprint.projectId).toLowerCase()
                    );
                }
            );

            const teamName =
                matchedTeam?.name ??
                matchedTeam?.Name ??
                matchedTeam?.teamName ??
                matchedTeam?.TeamName ??
                sprint.team ??
                "Not assigned";

            const projectName =
                matchedProject?.name ??
                matchedProject?.Name ??
                matchedProject?.projectName ??
                matchedProject?.ProjectName ??
                sprint.projectName ??
                "Project";

            return {
                ...sprint,

                teamName,

                team: teamName,

                projectName,
            };
        });
    }, [
        sprints,
        teams,
        projects,
    ]);

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

        return {
            total,
            active,
            completed,
            planning,
        };
    }, [
        assignedSprints,
    ]);

    // ========================================================
    // CLOSE STANDARD MODAL
    // ========================================================

    const closeModal = () => {
        setSelectedSprint(null);
        setModalMode(null);
    };

    // ========================================================
    // CLOSE PROGRESS
    // ========================================================

    const closeProgress = () => {
        setShowProgress(false);
        setSelectedSprint(null);
    };

    // ========================================================
    // CLOSE ASSIGN TEAM
    // ========================================================

    const closeAssignTeam = () => {
        setShowAssignTeam(false);
        setSelectedSprint(null);
        setSelectedTeam("");
    };

    // ========================================================
    // CREATE SPRINT
    // ========================================================

    const handleCreateSprint = async (sprintData) => {
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

            await sprintService.createSprint(
                sprintData
            );

            setShowCreateForm(false);

            await Promise.all([
                loadSprints(),
                loadTeams(),
                loadProjects(),
            ]);

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
    // UPDATE
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
    // DELETE
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
    // START
    // ========================================================

    const handleStart = (sprint) => {
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
            ) !== "planning"
        ) {
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
    // COMPLETE
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
    // BACKLOG
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
    // MONITOR PROGRESS
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
    // ASSIGN TEAM
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
            sprint.teamId ||
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
                    "Please select a team."
                );

                return;
            }

            try {
                setActionLoading(true);

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
    // REFRESH
    // ========================================================

    const handleRefresh = async () => {
        clearMessages();

        await Promise.all([
            loadSprints(),
            loadTeams(),
            loadProjects(),
        ]);
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="min-h-full bg-background text-foreground">

            <main>
                <div className="mx-auto w-full max-w-[1800px] px-4 py-6 sm:px-6 lg:px-8">

                    {/* ==================================================
                        HEADER
                    ================================================== */}

                    <section className="rounded-xl border border-border bg-card p-6 shadow-sm">

                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                            <div className="flex items-start gap-4">

                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <ListChecks className="h-6 w-6" />
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Manager Workspace
                                    </p>

                                    <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                        Sprint Management
                                    </h1>

                                    <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                                        Create, manage and monitor project
                                        sprints across your assigned teams.
                                    </p>
                                </div>

                            </div>

                            <div className="flex flex-wrap items-center gap-3">

                                <button
                                    type="button"
                                    onClick={handleRefresh}
                                    disabled={
                                        loading ||
                                        actionLoading
                                    }
                                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <RefreshCw
                                        className={`h-4 w-4 ${
                                            loading
                                                ? "animate-spin"
                                                : ""
                                        }`}
                                    />

                                    Refresh
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        clearMessages();
                                        setShowCreateForm(true);
                                    }}
                                    disabled={
                                        actionLoading
                                    }
                                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <Plus className="h-4 w-4" />

                                    Create Sprint
                                </button>

                            </div>

                        </div>

                    </section>

                    {/* ==================================================
                        MESSAGES
                    ================================================== */}

                    {successMessage && (
                        <div className="mt-5 flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="h-5 w-5 shrink-0" />

                            <span>
                                {successMessage}
                            </span>
                        </div>
                    )}

                    {errorMessage && (
                        <div className="mt-5 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">
                            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />

                            <span>
                                {errorMessage}
                            </span>
                        </div>
                    )}

                    {/* ==================================================
                        OVERVIEW
                    ================================================== */}

                    <section className="mt-6">

                        <div className="mb-4">
                            <h2 className="text-lg font-semibold text-foreground">
                                Sprint Overview
                            </h2>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Current sprint status across your projects.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                            {/* TOTAL */}

                            <div className="rounded-xl border border-border bg-card p-5 shadow-sm transition hover:border-primary/40 hover:shadow-md">

                                <div className="flex items-center justify-between">

                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Total Sprints
                                        </p>

                                        <p className="mt-2 text-2xl font-bold text-foreground">
                                            {sprintStats.total}
                                        </p>
                                    </div>

                                    <div className="rounded-lg bg-primary/10 p-3 text-primary">
                                        <ListChecks className="h-5 w-5" />
                                    </div>

                                </div>

                            </div>

                            {/* ACTIVE */}

                            <div className="rounded-xl border border-border bg-card p-5 shadow-sm transition hover:border-primary/40 hover:shadow-md">

                                <div className="flex items-center justify-between">

                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Active Sprints
                                        </p>

                                        <p className="mt-2 text-2xl font-bold text-foreground">
                                            {sprintStats.active}
                                        </p>
                                    </div>

                                    <div className="rounded-lg bg-primary/10 p-3 text-primary">
                                        <Activity className="h-5 w-5" />
                                    </div>

                                </div>

                            </div>

                            {/* COMPLETED */}

                            <div className="rounded-xl border border-border bg-card p-5 shadow-sm transition hover:border-primary/40 hover:shadow-md">

                                <div className="flex items-center justify-between">

                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Completed
                                        </p>

                                        <p className="mt-2 text-2xl font-bold text-foreground">
                                            {sprintStats.completed}
                                        </p>
                                    </div>

                                    <div className="rounded-lg bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400">
                                        <CheckCircle2 className="h-5 w-5" />
                                    </div>

                                </div>

                            </div>

                            {/* PLANNING */}

                            <div className="rounded-xl border border-border bg-card p-5 shadow-sm transition hover:border-primary/40 hover:shadow-md">

                                <div className="flex items-center justify-between">

                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Planning
                                        </p>

                                        <p className="mt-2 text-2xl font-bold text-foreground">
                                            {sprintStats.planning}
                                        </p>
                                    </div>

                                    <div className="rounded-lg bg-amber-500/10 p-3 text-amber-600 dark:text-amber-400">
                                        <Clock className="h-5 w-5" />
                                    </div>

                                </div>

                            </div>

                        </div>

                    </section>

                    {/* ==================================================
                        SPRINT LIST
                    ================================================== */}

                    <section className="mt-6 overflow-hidden rounded-xl border border-border bg-card shadow-sm">

                        <div className="border-b border-border px-5 py-4">

                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                                <div>

                                    <div className="flex items-center gap-2">

                                        <ListChecks className="h-5 w-5 text-primary" />

                                        <h2 className="text-lg font-semibold text-foreground">
                                            Project Sprints
                                        </h2>

                                    </div>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Manage sprints assigned to your
                                        project teams.
                                    </p>

                                </div>

                                <div className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm font-medium text-muted-foreground">
                                    {assignedSprints.length}{" "}
                                    {assignedSprints.length === 1
                                        ? "Sprint"
                                        : "Sprints"}
                                </div>

                            </div>

                        </div>

                        {/* ==================================================
                            LOADING
                        ================================================== */}

                        {loading ? (
                            <div className="flex min-h-[320px] items-center justify-center p-6">

                                <div className="flex flex-col items-center gap-3">

                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                                        <RefreshCw className="h-6 w-6 animate-spin text-primary" />
                                    </div>

                                    <p className="text-sm font-medium text-muted-foreground">
                                        Loading sprints...
                                    </p>

                                </div>

                            </div>
                        ) : assignedSprints.length === 0 ? (

                            /* ==================================================
                               EMPTY
                            ================================================== */

                            <div className="p-6 sm:p-10">

                                <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 px-6 text-center">

                                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-background text-muted-foreground shadow-sm">
                                        <ListChecks className="h-7 w-7" />
                                    </div>

                                    <h3 className="text-base font-semibold text-foreground">
                                        No sprints found
                                    </h3>

                                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                                        Create a sprint to start organizing
                                        work for your project team.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            clearMessages();
                                            setShowCreateForm(true);
                                        }}
                                        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
                                    >
                                        <Plus className="h-4 w-4" />

                                        Create Sprint
                                    </button>

                                </div>

                            </div>

                        ) : (

                            /* ==================================================
                               SPRINT CARDS
                            ================================================== */

                            <div className="space-y-4 p-5">

                                {assignedSprints.map(
                                    (sprint) => {

                                        const statusStyle =
                                            getStatusStyle(
                                                sprint.status
                                            );

                                        return (
                                            <article
                                                key={
                                                    sprint.id
                                                }
                                                className="rounded-xl border border-border bg-background p-5 transition hover:border-primary/30 hover:shadow-sm"
                                            >

                                                {/* ==================================================
                                                    TOP INFORMATION
                                                ================================================== */}

                                                <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">

                                                    <div className="min-w-0">

                                                        <div className="mb-2 flex flex-wrap items-center gap-2">

                                                            <h3 className="text-lg font-semibold text-foreground">
                                                                {
                                                                    sprint.name
                                                                }
                                                            </h3>

                                                            <span
                                                                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyle.wrapper}`}
                                                            >
                                                                <span
                                                                    className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`}
                                                                />

                                                                {
                                                                    sprint.status
                                                                }
                                                            </span>

                                                        </div>

                                                        {sprint.goal && (
                                                            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                                                                {
                                                                    sprint.goal
                                                                }
                                                            </p>
                                                        )}

                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-2">

                                                        <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-muted-foreground">

                                                            <Target className="h-4 w-4 text-primary" />

                                                            <span className="max-w-[220px] truncate">
                                                                {
                                                                    sprint.projectName
                                                                }
                                                            </span>

                                                        </div>

                                                        <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-muted-foreground">

                                                            <UsersRound className="h-4 w-4 text-primary" />

                                                            <span className="max-w-[180px] truncate">
                                                                {
                                                                    sprint.team
                                                                }
                                                            </span>

                                                        </div>

                                                    </div>

                                                </div>

                                                {/* ==================================================
                                                    SPRINT CARD
                                                ================================================== */}

                                                <SprintCard
                                                    sprint={sprint}
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

                                                {/* ==================================================
                                                    SPRINT META
                                                ================================================== */}

                                                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

                                                    <div className="rounded-lg border border-border bg-muted/20 p-3">

                                                        <div className="mb-1 flex items-center gap-2 text-xs font-medium text-muted-foreground">

                                                            <CalendarDays className="h-4 w-4" />

                                                            Start Date

                                                        </div>

                                                        <p className="text-sm font-medium text-foreground">
                                                            {
                                                                formatDate(
                                                                    sprint.startDate
                                                                )
                                                            }
                                                        </p>

                                                    </div>

                                                    <div className="rounded-lg border border-border bg-muted/20 p-3">

                                                        <div className="mb-1 flex items-center gap-2 text-xs font-medium text-muted-foreground">

                                                            <CalendarDays className="h-4 w-4" />

                                                            End Date

                                                        </div>

                                                        <p className="text-sm font-medium text-foreground">
                                                            {
                                                                formatDate(
                                                                    sprint.endDate
                                                                )
                                                            }
                                                        </p>

                                                    </div>

                                                    <div className="rounded-lg border border-border bg-muted/20 p-3">

                                                        <div className="mb-1 text-xs font-medium text-muted-foreground">
                                                            Progress
                                                        </div>

                                                        <p className="text-sm font-semibold text-foreground">
                                                            {
                                                                sprint.progress
                                                            }%
                                                        </p>

                                                    </div>

                                                    <div className="rounded-lg border border-border bg-muted/20 p-3">

                                                        <div className="mb-1 text-xs font-medium text-muted-foreground">
                                                            Tasks
                                                        </div>

                                                        <p className="text-sm font-semibold text-foreground">
                                                            {
                                                                sprint.tasks?.length ||
                                                                0
                                                            }
                                                        </p>

                                                    </div>

                                                </div>

                                                {/* ==================================================
                                                    PROGRESS
                                                ================================================== */}

                                                <div className="mt-5">

                                                    <div className="mb-2 flex items-center justify-between">

                                                        <span className="text-xs font-medium text-muted-foreground">
                                                            Sprint Progress
                                                        </span>

                                                        <span className="text-xs font-semibold text-foreground">
                                                            {
                                                                sprint.progress
                                                            }%
                                                        </span>

                                                    </div>

                                                    <div className="h-2 overflow-hidden rounded-full bg-muted">

                                                        <div
                                                            className="h-full rounded-full bg-primary transition-all duration-500"
                                                            style={{
                                                                width: `${Math.min(
                                                                    100,
                                                                    Math.max(
                                                                        0,
                                                                        Number(
                                                                            sprint.progress
                                                                        ) || 0
                                                                    )
                                                                )}%`,
                                                            }}
                                                        />

                                                    </div>

                                                </div>

                                            </article>
                                        );
                                    }
                                )}

                            </div>

                        )}

                    </section>

                </div>
            </main>

            {/* ==========================================================
                CREATE
            ========================================================== */}

            {showCreateForm && (
                <CreateSprintModal
                    isOpen={
                        showCreateForm
                    }
                    onClose={() =>
                        setShowCreateForm(false)
                    }
                    onCreated={
                        handleCreateSprint
                    }
                    projects={
                        projects
                    }
                    teams={
                        teams
                    }
                />
            )}

            {/* ==========================================================
                UPDATE
            ========================================================== */}

            {selectedSprint &&
                modalMode ===
                    "update" && (
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
                DELETE
            ========================================================== */}

            {selectedSprint &&
                modalMode ===
                    "delete" && (
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
                START
            ========================================================== */}

            {selectedSprint &&
                modalMode ===
                    "start" && (
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
                COMPLETE
            ========================================================== */}

            {selectedSprint &&
                modalMode ===
                    "complete" && (
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
                BACKLOG
            ========================================================== */}

            {selectedSprint &&
                modalMode ===
                    "backlog" && (
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
                PROGRESS MODAL
            ========================================================== */}

            {showProgress &&
                selectedSprint && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 px-4 backdrop-blur-sm">

                        <div className="w-full max-w-lg overflow-hidden rounded-xl border border-border bg-card shadow-2xl">

                            <div className="flex items-center justify-between border-b border-border px-5 py-4">

                                <div>
                                    <h2 className="text-lg font-semibold text-foreground">
                                        Sprint Progress
                                    </h2>

                                    <p className="mt-1 text-sm text-muted-foreground">
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
                                    className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                                >
                                    <X className="h-5 w-5" />
                                </button>

                            </div>

                            <div className="space-y-5 px-5 py-6">

                                <div className="text-center">

                                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <Activity className="h-7 w-7" />
                                    </div>

                                    <p className="mt-4 text-sm font-medium text-muted-foreground">
                                        Current Progress
                                    </p>

                                    <p className="mt-1 text-4xl font-bold text-foreground">
                                        {
                                            selectedSprint.progress
                                        }%
                                    </p>

                                </div>

                                <div className="h-3 overflow-hidden rounded-full bg-muted">

                                    <div
                                        className="h-full rounded-full bg-primary transition-all"
                                        style={{
                                            width: `${Math.min(
                                                100,
                                                Math.max(
                                                    0,
                                                    Number(
                                                        selectedSprint.progress
                                                    ) || 0
                                                )
                                            )}%`,
                                        }}
                                    />

                                </div>

                                <div className="grid grid-cols-2 gap-3">

                                    <div className="rounded-lg border border-border bg-muted/20 p-4">

                                        <p className="text-xs font-medium text-muted-foreground">
                                            Status
                                        </p>

                                        <p className="mt-1 font-semibold text-foreground">
                                            {
                                                selectedSprint.status
                                            }
                                        </p>

                                    </div>

                                    <div className="rounded-lg border border-border bg-muted/20 p-4">

                                        <p className="text-xs font-medium text-muted-foreground">
                                            Team
                                        </p>

                                        <p className="mt-1 truncate font-semibold text-foreground">
                                            {
                                                selectedSprint.team ||
                                                "Not assigned"
                                            }
                                        </p>

                                    </div>

                                </div>

                                <div className="rounded-lg border border-border bg-muted/20 p-4">

                                    <p className="text-xs font-medium text-muted-foreground">
                                        Sprint Goal
                                    </p>

                                    <p className="mt-1 text-sm leading-6 text-foreground">
                                        {
                                            selectedSprint.goal ||
                                            "No sprint goal specified."
                                        }
                                    </p>

                                </div>

                                <div className="rounded-lg border border-border bg-muted/20 p-4">

                                    <p className="text-xs font-medium text-muted-foreground">
                                        Backlog
                                    </p>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {
                                            selectedSprint.tasks
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
                ASSIGN TEAM
            ========================================================== */}

            {showAssignTeam &&
                selectedSprint && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 px-4 backdrop-blur-sm">

                        <div className="w-full max-w-md overflow-hidden rounded-xl border border-border bg-card shadow-2xl">

                            <div className="flex items-center justify-between border-b border-border px-5 py-4">

                                <div>
                                    <h2 className="text-lg font-semibold text-foreground">
                                        Assign Sprint to Team
                                    </h2>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {
                                            selectedSprint.name
                                        }
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={
                                        closeAssignTeam
                                    }
                                    className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                                >
                                    <X className="h-5 w-5" />
                                </button>

                            </div>

                            <div className="px-5 py-5">

                                <label className="mb-2 block text-sm font-medium text-foreground">
                                    Team
                                </label>

                                <select
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
                                    disabled={
                                        actionLoading
                                    }
                                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-muted"
                                >

                                    <option value="">
                                        Select a team
                                    </option>

                                    {teams.map(
                                        (team) => {

                                            const teamId =
                                                team?.id ??
                                                team?.Id ??
                                                team?.teamId ??
                                                team?.TeamId;

                                            const teamName =
                                                team?.name ??
                                                team?.Name ??
                                                team?.teamName ??
                                                team?.TeamName ??
                                                "Unnamed Team";

                                            return (
                                                <option
                                                    key={
                                                        teamId
                                                    }
                                                    value={
                                                        teamId
                                                    }
                                                >
                                                    {
                                                        teamName
                                                    }
                                                </option>
                                            );
                                        }
                                    )}

                                </select>

                                {teams.length ===
                                    0 && (
                                    <p className="mt-2 text-xs text-muted-foreground">
                                        No teams are currently available.
                                    </p>
                                )}

                            </div>

                            <div className="flex justify-end gap-2 border-t border-border bg-muted/20 px-5 py-4">

                                <button
                                    type="button"
                                    onClick={
                                        closeAssignTeam
                                    }
                                    disabled={
                                        actionLoading
                                    }
                                    className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted disabled:opacity-60"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        handleSaveTeamAssignment
                                    }
                                    disabled={
                                        actionLoading ||
                                        !selectedTeam
                                    }
                                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                                >

                                    {actionLoading && (
                                        <RefreshCw className="h-4 w-4 animate-spin" />
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
// EXPORT
// ============================================================

export default SprintManagement;

