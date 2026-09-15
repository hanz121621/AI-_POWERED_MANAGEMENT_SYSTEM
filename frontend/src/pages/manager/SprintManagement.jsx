
import { useEffect, useMemo, useState } from "react";

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
} from "lucide-react";

// ============================================================
// SERVICES
// ============================================================

// IMPORTANT:
// sprintService.js uses:
// export default sprintService;
//
// Therefore we must use a DEFAULT import here.
import sprintService from "../../services/sprintService";
import api from "../../services/api";

// ============================================================
// COMPONENTS
//
// Actual structure:
//
// src/components/manager/sprint/
//
// SprintCard.jsx
// CreateSprintModal.jsx
// UpdateSprintModal.jsx
// DeleteSprintModal.jsx
// StartSprintModal.jsx
// CompleteSprintModal.jsx
// SprintBacklogModal.jsx
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

const getValue = (obj, ...keys) => {
    for (const key of keys) {
        if (
            obj?.[key] !== undefined &&
            obj?.[key] !== null
        ) {
            return obj[key];
        }
    }

    return null;
};

// ============================================================
// NORMALIZE STATUS
// ============================================================

const normalizeStatus = (status) => {
    if (!status) return "planning";

    return String(status)
        .trim()
        .toLowerCase()
        .replace(/[\s_-]+/g, "");
};

// ============================================================
// NORMALIZE SPRINT
// ============================================================

const normalizeSprint = (sprint) => {
    if (!sprint) return null;

    return {
        ...sprint,

        id: getValue(
            sprint,
            "Id",
            "id"
        ),

        name:
            getValue(
                sprint,
                "Name",
                "name"
            ) || "Unnamed Sprint",

        goal:
            getValue(
                sprint,
                "Goal",
                "goal"
            ) || "",

        status:
            getValue(
                sprint,
                "Status",
                "status"
            ) || "Planning",

        progress: Number(
            getValue(
                sprint,
                "Progress",
                "progress"
            ) || 0
        ),

        teamId: getValue(
            sprint,
            "TeamId",
            "teamId"
        ),

        teamName:
            getValue(
                sprint,
                "Team",
                "teamName",
                "TeamName"
            ) || "",

        projectId: getValue(
            sprint,
            "ProjectId",
            "projectId"
        ),

        projectName:
            getValue(
                sprint,
                "ProjectName",
                "projectName"
            ) || "",

        managerId: getValue(
            sprint,
            "ManagerId",
            "managerId",
            "CreatedById",
            "createdById"
        ),

        startDate: getValue(
            sprint,
            "StartDate",
            "startDate"
        ),

        endDate: getValue(
            sprint,
            "EndDate",
            "endDate"
        ),

        tasks:
            getValue(
                sprint,
                "Tasks",
                "tasks"
            ) || [],
    };
};

// ============================================================
// COMPONENT
// ============================================================

function SprintManagement() {
    // ========================================================
    // STATE
    // ========================================================

    const [sprints, setSprints] = useState([]);
    const [teams, setTeams] = useState([]);

    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const [selectedSprint, setSelectedSprint] =
        useState(null);

    const [modalMode, setModalMode] =
        useState(null);

    const [showCreateForm, setShowCreateForm] =
        useState(false);

    const [showProgress, setShowProgress] =
        useState(false);

    const [showAssignTeam, setShowAssignTeam] =
        useState(false);

    const [selectedTeam, setSelectedTeam] =
        useState("");

    const [successMessage, setSuccessMessage] =
        useState("");

    const [errorMessage, setErrorMessage] =
        useState("");

    // ========================================================
    // STATISTICS POPUP
    // ========================================================

    const [selectedStat, setSelectedStat] =
        useState(null);

    // ========================================================
    // MESSAGES
    // ========================================================

    const clearMessages = () => {
        setSuccessMessage("");
        setErrorMessage("");
    };

    // ========================================================
    // LOAD TEAMS
    // ========================================================

    const loadTeams = async () => {
        try {
            const response = await api.get("/Team");

            const data = response?.data;

            if (Array.isArray(data)) {
                setTeams(data);
            } else if (Array.isArray(data?.items)) {
                setTeams(data.items);
            } else if (Array.isArray(data?.data)) {
                setTeams(data.data);
            } else {
                setTeams([]);
            }
        } catch (error) {
            console.error(
                "Failed to load teams:",
                error
            );
        }
    };

    // ========================================================
    // LOAD SPRINTS
    // ========================================================

    const loadSprints = async () => {
        try {
            setLoading(true);

            const response =
                await sprintService.getAllSprints();

            const data =
                response?.data ??
                response;

            let sprintList = [];

            if (Array.isArray(data)) {
                sprintList = data;
            } else if (
                Array.isArray(data?.items)
            ) {
                sprintList = data.items;
            } else if (
                Array.isArray(data?.data)
            ) {
                sprintList = data.data;
            }

            setSprints(
                sprintList
                    .map(normalizeSprint)
                    .filter(Boolean)
            );
        } catch (error) {
            console.error(
                "Failed to load sprints:",
                error
            );

            setErrorMessage(
                error?.response?.data?.message ||
                "Unable to load sprints."
            );
        } finally {
            setLoading(false);
        }
    };

    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {
        loadSprints();
        loadTeams();
    }, []);

    // ========================================================
    // SPRINT STATISTICS
    // ========================================================

    const sprintStats = useMemo(() => {
        const total = sprints.length;

        const active = sprints.filter(
            (sprint) =>
                normalizeStatus(
                    sprint.status
                ) === "active"
        ).length;

        const completed = sprints.filter(
            (sprint) =>
                normalizeStatus(
                    sprint.status
                ) === "completed"
        ).length;

        const planning = sprints.filter(
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
            },
            {
                title: "Active Sprints",
                value: active,
                icon: Activity,
            },
            {
                title: "Completed",
                value: completed,
                icon: CheckCircle2,
            },
            {
                title: "Planning",
                value: planning,
                icon: Clock,
            },
        ];
    }, [sprints]);

    // ========================================================
    // GET SPRINTS FOR STATISTICS POPUP
    // ========================================================

    const getSprintsForStat = (statTitle) => {
        switch (statTitle) {
            case "Total Sprints":
                return sprints;

            case "Active Sprints":
                return sprints.filter(
                    (sprint) =>
                        normalizeStatus(
                            sprint.status
                        ) === "active"
                );

            case "Completed":
                return sprints.filter(
                    (sprint) =>
                        normalizeStatus(
                            sprint.status
                        ) === "completed"
                );

            case "Planning":
                return sprints.filter(
                    (sprint) =>
                        normalizeStatus(
                            sprint.status
                        ) === "planning"
                );

            default:
                return [];
        }
    };

    // ========================================================
    // CREATE SPRINT
    // ========================================================

    const handleCreateSprint = async (formData) => {
        try {
            clearMessages();
            setActionLoading(true);

            const name = String(
                formData?.name || ""
            ).trim();

            const goal = String(
                formData?.goal || ""
            ).trim();

            const startDate =
                formData?.startDate;

            const endDate =
                formData?.endDate;

            if (!name) {
                setErrorMessage(
                    "Sprint name is required."
                );
                return;
            }

            if (!goal) {
                setErrorMessage(
                    "Sprint goal is required."
                );
                return;
            }

            if (!startDate || !endDate) {
                setErrorMessage(
                    "Start date and end date are required."
                );
                return;
            }

            if (
                new Date(startDate) >
                new Date(endDate)
            ) {
                setErrorMessage(
                    "Start date cannot be after the end date."
                );
                return;
            }

            const duplicate =
                sprints.some(
                    (sprint) =>
                        sprint.name.toLowerCase() ===
                        name.toLowerCase()
                );

            if (duplicate) {
                setErrorMessage(
                    "A sprint with this name already exists."
                );
                return;
            }

            await sprintService.createSprint(
                formData
            );

            setSuccessMessage(
                "Sprint created successfully."
            );

            setShowCreateForm(false);

            await loadSprints();
        } catch (error) {
            console.error(
                "Failed to create sprint:",
                error
            );

            setErrorMessage(
                error?.response?.data?.message ||
                "Failed to create sprint."
            );
        } finally {
            setActionLoading(false);
        }
    };

    // ========================================================
    // UPDATE SPRINT
    // ========================================================

    const handleUpdateSprint = (sprint) => {
        clearMessages();

        setSelectedSprint(sprint);
        setModalMode("update");
    };

    const handleSprintUpdated = async (
        formData
    ) => {
        if (!selectedSprint?.id) {
            return;
        }

        try {
            clearMessages();
            setActionLoading(true);

            await sprintService.updateSprint(
                selectedSprint.id,
                formData
            );

            setSuccessMessage(
                "Sprint updated successfully."
            );

            setSelectedSprint(null);
            setModalMode(null);

            await loadSprints();
        } catch (error) {
            console.error(
                "Failed to update sprint:",
                error
            );

            setErrorMessage(
                error?.response?.data?.message ||
                "Failed to update sprint."
            );
        } finally {
            setActionLoading(false);
        }
    };

    // ========================================================
    // DELETE SPRINT
    // ========================================================

    const handleDeleteSprint = (sprint) => {
        clearMessages();

        const status =
            normalizeStatus(
                sprint.status
            );

        if (
            status === "active" ||
            status === "completed"
        ) {
            setErrorMessage(
                "Active or completed sprints cannot be deleted."
            );

            return;
        }

        setSelectedSprint(sprint);
        setModalMode("delete");
    };

    const handleConfirmDelete =
        async () => {
            if (!selectedSprint?.id) {
                return;
            }

            try {
                clearMessages();
                setActionLoading(true);

                await sprintService.deleteSprint(
                    selectedSprint.id
                );

                setSuccessMessage(
                    "Sprint deleted successfully."
                );

                setSelectedSprint(null);
                setModalMode(null);

                await loadSprints();
            } catch (error) {
                console.error(
                    "Failed to delete sprint:",
                    error
                );

                setErrorMessage(
                    error?.response?.data?.message ||
                    "Failed to delete sprint."
                );
            } finally {
                setActionLoading(false);
            }
        };

    // ========================================================
    // START SPRINT
    // ========================================================

    const handleStartSprint = (sprint) => {
        clearMessages();

        const status =
            normalizeStatus(
                sprint.status
            );

        if (status !== "planning") {
            setErrorMessage(
                "Only planning sprints can be started."
            );

            return;
        }

        const activeSprint =
            sprints.find(
                (item) =>
                    normalizeStatus(
                        item.status
                    ) === "active"
            );

        if (activeSprint) {
            setErrorMessage(
                "Another sprint is already active."
            );

            return;
        }

        setSelectedSprint(sprint);
        setModalMode("start");
    };

    const handleConfirmStart =
        async () => {
            if (!selectedSprint?.id) {
                return;
            }

            try {
                clearMessages();
                setActionLoading(true);

                await sprintService.startSprint(
                    selectedSprint.id
                );

                setSuccessMessage(
                    "Sprint started successfully."
                );

                setSelectedSprint(null);
                setModalMode(null);

                await loadSprints();
            } catch (error) {
                console.error(
                    "Failed to start sprint:",
                    error
                );

                setErrorMessage(
                    error?.response?.data?.message ||
                    "Failed to start sprint."
                );
            } finally {
                setActionLoading(false);
            }
        };

    // ========================================================
    // COMPLETE SPRINT
    // ========================================================

    const handleCompleteSprint = (
        sprint
    ) => {
        clearMessages();

        const status =
            normalizeStatus(
                sprint.status
            );

        if (status !== "active") {
            setErrorMessage(
                "Only active sprints can be completed."
            );

            return;
        }

        setSelectedSprint(sprint);
        setModalMode("complete");
    };

    const handleConfirmComplete =
        async () => {
            if (!selectedSprint?.id) {
                return;
            }

            try {
                clearMessages();
                setActionLoading(true);

                await sprintService.completeSprint(
                    selectedSprint.id
                );

                setSuccessMessage(
                    "Sprint completed successfully."
                );

                setSelectedSprint(null);
                setModalMode(null);

                await loadSprints();
            } catch (error) {
                console.error(
                    "Failed to complete sprint:",
                    error
                );

                setErrorMessage(
                    error?.response?.data?.message ||
                    "Failed to complete sprint."
                );
            } finally {
                setActionLoading(false);
            }
        };

    // ========================================================
    // VIEW BACKLOG
    // ========================================================

    const handleViewBacklog = (
        sprint
    ) => {
        clearMessages();

        setSelectedSprint(sprint);
        setModalMode("backlog");
    };

    // ========================================================
    // MONITOR PROGRESS
    // ========================================================

    const handleMonitorProgress =
        async (sprint) => {
            try {
                clearMessages();
                setActionLoading(true);

                const report =
                    await sprintService.getSprintProgressReport(
                        sprint.projectId,
                        sprint.id
                    );

                const reportData =
                    report?.data ??
                    report;

                setSelectedSprint({
                    ...sprint,
                    ...reportData,
                });

                setShowProgress(true);
            } catch (error) {
                console.error(
                    "Failed to load sprint progress:",
                    error
                );

                setErrorMessage(
                    error?.response?.data?.message ||
                    "Unable to load sprint progress."
                );
            } finally {
                setActionLoading(false);
            }
        };

    // ========================================================
    // ASSIGN TEAM
    // ========================================================

    const handleAssignTeam = (
        sprint
    ) => {
        clearMessages();

        setSelectedSprint(sprint);

        setSelectedTeam(
            sprint.teamId || ""
        );

        setShowAssignTeam(true);
    };

    const handleConfirmAssignTeam =
        async () => {
            if (!selectedSprint?.id) {
                return;
            }

            if (!selectedTeam) {
                setErrorMessage(
                    "Please select a team."
                );

                return;
            }

            try {
                clearMessages();
                setActionLoading(true);

                await sprintService.assignSprintToTeam(
                    selectedSprint.id,
                    selectedTeam
                );

                setSuccessMessage(
                    "Sprint assigned to team successfully."
                );

                setShowAssignTeam(false);
                setSelectedSprint(null);
                setSelectedTeam("");

                await loadSprints();
            } catch (error) {
                console.error(
                    "Failed to assign sprint:",
                    error
                );

                setErrorMessage(
                    error?.response?.data?.message ||
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
        ]);
    };

    // ========================================================
    // CLOSE MODAL
    // ========================================================

    const closeModal = () => {
        if (actionLoading) {
            return;
        }

        setSelectedSprint(null);
        setModalMode(null);
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="space-y-6">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Sprint Management
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Create, manage, monitor, and assign project sprints.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">

                    <button
                        type="button"
                        onClick={handleRefresh}
                        disabled={loading}
                        className="
                            inline-flex
                            h-10
                            items-center
                            justify-center
                            gap-2
                            rounded-md
                            border
                            border-border
                            bg-background
                            px-4
                            text-sm
                            font-medium
                            text-foreground
                            transition-colors
                            hover:bg-muted
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        <RefreshCw
                            className={
                                loading
                                    ? "h-4 w-4 animate-spin"
                                    : "h-4 w-4"
                            }
                        />

                        Refresh
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            clearMessages();
                            setShowCreateForm(true);
                        }}
                        className="
                            inline-flex
                            h-10
                            items-center
                            justify-center
                            gap-2
                            rounded-md
                            bg-primary
                            px-4
                            text-sm
                            font-medium
                            text-primary-foreground
                            shadow-sm
                            transition-colors
                            hover:bg-primary/90
                        "
                    >
                        <Plus className="h-4 w-4" />

                        Create Sprint
                    </button>

                </div>
            </div>

            {/* ==================================================
                SUCCESS
            ================================================== */}

            {successMessage && (
                <div
                    className="
                        flex
                        items-start
                        justify-between
                        gap-4
                        rounded-lg
                        border
                        border-green-200
                        bg-green-50
                        px-4
                        py-3
                        text-sm
                        text-green-800
                        dark:border-green-900
                        dark:bg-green-950/30
                        dark:text-green-300
                    "
                >
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />

                        <span>
                            {successMessage}
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            setSuccessMessage("")
                        }
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {/* ==================================================
                ERROR
            ================================================== */}

            {errorMessage && (
                <div
                    className="
                        flex
                        items-start
                        justify-between
                        gap-4
                        rounded-lg
                        border
                        border-destructive/20
                        bg-destructive/10
                        px-4
                        py-3
                        text-sm
                        text-destructive
                    "
                >
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 shrink-0" />

                        <span>
                            {errorMessage}
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            setErrorMessage("")
                        }
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {/* ==================================================
                STATISTICS
            ================================================== */}

            <section>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                    {sprintStats.map((item) => {
                        const Icon = item.icon;

                        return (
                            <button
                                key={item.title}
                                type="button"
                                onClick={() =>
                                    setSelectedStat(
                                        item.title
                                    )
                                }
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-border
                                    bg-card
                                    p-5
                                    text-left
                                    shadow-sm
                                    transition-all
                                    duration-200
                                    hover:-translate-y-0.5
                                    hover:border-primary/40
                                    hover:shadow-md
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-primary/30
                                "
                            >
                                <div className="flex items-center justify-between">

                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            {item.title}
                                        </p>

                                        <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                                            {item.value}
                                        </p>

                                        <p className="mt-2 text-xs text-muted-foreground">
                                            Click to view details
                                        </p>
                                    </div>

                                    <div
                                        className="
                                            flex
                                            h-12
                                            w-12
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-xl
                                            bg-primary/10
                                            text-primary
                                        "
                                    >
                                        <Icon size={24} />
                                    </div>

                                </div>
                            </button>
                        );
                    })}

                </div>
            </section>

            {/* ==================================================
                SPRINT LIST
            ================================================== */}

            <section className="space-y-4">

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                        <h2 className="text-lg font-semibold text-foreground">
                            Sprints
                        </h2>

                        <p className="text-sm text-muted-foreground">
                            Manage your project sprint lifecycle.
                        </p>
                    </div>

                    <div
                        className="
                            inline-flex
                            w-fit
                            items-center
                            gap-2
                            rounded-full
                            border
                            border-border
                            bg-muted/50
                            px-3
                            py-1
                            text-xs
                            font-medium
                            text-muted-foreground
                        "
                    >
                        <ListChecks className="h-3.5 w-3.5" />

                        {sprints.length}{" "}
                        {sprints.length === 1
                            ? "Sprint"
                            : "Sprints"}
                    </div>

                </div>

                {loading ? (
                    <div
                        className="
                            flex
                            min-h-[240px]
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-border
                            bg-card
                            shadow-sm
                        "
                    >
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <RefreshCw className="h-5 w-5 animate-spin" />

                            Loading sprints...
                        </div>
                    </div>
                ) : sprints.length === 0 ? (
                    <div
                        className="
                            flex
                            min-h-[240px]
                            flex-col
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-dashed
                            border-border
                            bg-card
                            px-6
                            text-center
                            shadow-sm
                        "
                    >
                        <div
                            className="
                                flex
                                h-12
                                w-12
                                items-center
                                justify-center
                                rounded-xl
                                bg-muted
                                text-muted-foreground
                            "
                        >
                            <ListChecks className="h-6 w-6" />
                        </div>

                        <h3 className="mt-4 text-base font-semibold text-foreground">
                            No sprints found
                        </h3>

                        <p className="mt-1 max-w-md text-sm text-muted-foreground">
                            Create your first sprint to begin
                            planning and managing project work.
                        </p>

                        <button
                            type="button"
                            onClick={() => {
                                clearMessages();
                                setShowCreateForm(true);
                            }}
                            className="
                                mt-4
                                inline-flex
                                h-9
                                items-center
                                gap-2
                                rounded-md
                                bg-primary
                                px-4
                                text-sm
                                font-medium
                                text-primary-foreground
                                transition-colors
                                hover:bg-primary/90
                            "
                        >
                            <Plus className="h-4 w-4" />

                            Create Sprint
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">

                        {sprints.map((sprint) => (
                            <SprintCard
                                key={sprint.id}
                                sprint={sprint}
                                onUpdate={() =>
                                    handleUpdateSprint(
                                        sprint
                                    )
                                }
                                onDelete={() =>
                                    handleDeleteSprint(
                                        sprint
                                    )
                                }
                                onStart={() =>
                                    handleStartSprint(
                                        sprint
                                    )
                                }
                                onComplete={() =>
                                    handleCompleteSprint(
                                        sprint
                                    )
                                }
                                onViewBacklog={() =>
                                    handleViewBacklog(
                                        sprint
                                    )
                                }
                                onMonitorProgress={() =>
                                    handleMonitorProgress(
                                        sprint
                                    )
                                }
                                onAssignTeam={() =>
                                    handleAssignTeam(
                                        sprint
                                    )
                                }
                            />
                        ))}

                    </div>
                )}

            </section>

            {/* ==================================================
                CREATE
            ================================================== */}

            {showCreateForm && (
                <CreateSprintModal
                    projectId="4a66be10-c9b6-44d5-bc8e-94de161b5fc3"
                    teamId="bd2b9476-e01b-4911-99c1-3a89a2d8a010"
                    teams={teams}
                    onClose={() => {
                        if (!actionLoading) {
                            setShowCreateForm(false);
                        }
                    }}
                    onSubmit={handleCreateSprint}
                    loading={actionLoading}
                />
            )}

            {/* ==================================================
                UPDATE
            ================================================== */}

            {modalMode === "update" &&
                selectedSprint && (
                    <UpdateSprintModal
                        sprint={selectedSprint}
                        onClose={closeModal}
                        onSubmit={handleSprintUpdated}
                        loading={actionLoading}
                    />
                )}

            {/* ==================================================
                DELETE
            ================================================== */}

            {modalMode === "delete" &&
                selectedSprint && (
                    <DeleteSprintModal
                        sprint={selectedSprint}
                        onClose={closeModal}
                        onConfirm={handleConfirmDelete}
                        loading={actionLoading}
                    />
                )}

            {/* ==================================================
                START
            ================================================== */}

            {modalMode === "start" &&
                selectedSprint && (
                    <StartSprintModal
                        sprint={selectedSprint}
                        onClose={closeModal}
                        onConfirm={handleConfirmStart}
                        loading={actionLoading}
                    />
                )}

            {/* ==================================================
                COMPLETE
            ================================================== */}

            {modalMode === "complete" &&
                selectedSprint && (
                    <CompleteSprintModal
                        sprint={selectedSprint}
                        onClose={closeModal}
                        onConfirm={handleConfirmComplete}
                        loading={actionLoading}
                    />
                )}

            {/* ==================================================
                BACKLOG
            ================================================== */}

            {modalMode === "backlog" &&
                selectedSprint && (
                    <SprintBacklogModal
                        sprint={selectedSprint}
                        onClose={closeModal}
                    />
                )}

            {/* ==================================================
                SPRINT STATISTICS POPUP
            ================================================== */}

            {selectedStat && (
                <div
                    className="
                        fixed
                        inset-0
                        z-[110]
                        flex
                        items-center
                        justify-center
                        bg-black/50
                        p-4
                    "
                    onClick={() =>
                        setSelectedStat(null)
                    }
                >
                    <div
                        className="
                            flex
                            max-h-[85vh]
                            w-full
                            max-w-2xl
                            flex-col
                            overflow-hidden
                            rounded-xl
                            border
                            border-border
                            bg-background
                            shadow-xl
                        "
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        {/* POPUP HEADER */}

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                border-b
                                border-border
                                px-6
                                py-4
                            "
                        >
                            <div>
                                <h2 className="text-lg font-semibold text-foreground">
                                    {selectedStat}
                                </h2>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    {
                                        getSprintsForStat(
                                            selectedStat
                                        ).length
                                    }{" "}
                                    {
                                        getSprintsForStat(
                                            selectedStat
                                        ).length === 1
                                            ? "sprint"
                                            : "sprints"
                                    }{" "}
                                    found
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedStat(null)
                                }
                                className="
                                    rounded-md
                                    p-2
                                    text-muted-foreground
                                    transition-colors
                                    hover:bg-muted
                                    hover:text-foreground
                                "
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* POPUP CONTENT */}

                        <div className="flex-1 overflow-y-auto p-6">

                            {getSprintsForStat(
                                selectedStat
                            ).length === 0 ? (
                                <div
                                    className="
                                        flex
                                        min-h-[180px]
                                        flex-col
                                        items-center
                                        justify-center
                                        rounded-lg
                                        border
                                        border-dashed
                                        border-border
                                        bg-muted/30
                                        px-6
                                        text-center
                                    "
                                >
                                    <div
                                        className="
                                            flex
                                            h-12
                                            w-12
                                            items-center
                                            justify-center
                                            rounded-xl
                                            bg-muted
                                            text-muted-foreground
                                        "
                                    >
                                        <ListChecks className="h-6 w-6" />
                                    </div>

                                    <h3 className="mt-4 text-sm font-semibold text-foreground">
                                        No sprints found
                                    </h3>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        There are no sprints in this category.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">

                                    {getSprintsForStat(
                                        selectedStat
                                    ).map(
                                        (sprint) => (
                                            <div
                                                key={sprint.id}
                                                className="
                                                    rounded-lg
                                                    border
                                                    border-border
                                                    bg-card
                                                    p-4
                                                    transition-colors
                                                    hover:bg-muted/40
                                                "
                                            >

                                                {/* SPRINT NAME + STATUS */}

                                                <div className="flex items-start justify-between gap-4">

                                                    <div className="min-w-0">

                                                        <h3 className="truncate text-sm font-semibold text-foreground">
                                                            {sprint.name}
                                                        </h3>

                                                        {sprint.goal && (
                                                            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                                                                {sprint.goal}
                                                            </p>
                                                        )}

                                                    </div>

                                                    <span
                                                        className="
                                                            shrink-0
                                                            rounded-full
                                                            border
                                                            border-border
                                                            bg-muted
                                                            px-2.5
                                                            py-1
                                                            text-xs
                                                            font-medium
                                                            capitalize
                                                            text-foreground
                                                        "
                                                    >
                                                        {sprint.status ||
                                                            "Planning"}
                                                    </span>

                                                </div>

                                                {/* DETAILS */}

                                                <div
                                                    className="
                                                        mt-4
                                                        grid
                                                        grid-cols-1
                                                        gap-3
                                                        sm:grid-cols-3
                                                    "
                                                >

                                                    <div>
                                                        <p className="text-xs text-muted-foreground">
                                                            Team
                                                        </p>

                                                        <p className="mt-1 text-sm font-medium text-foreground">
                                                            {sprint.teamName ||
                                                                "Not assigned"}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="text-xs text-muted-foreground">
                                                            Start Date
                                                        </p>

                                                        <p className="mt-1 text-sm font-medium text-foreground">
                                                            {sprint.startDate
                                                                ? new Date(
                                                                    sprint.startDate
                                                                ).toLocaleDateString()
                                                                : "Not set"}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="text-xs text-muted-foreground">
                                                            End Date
                                                        </p>

                                                        <p className="mt-1 text-sm font-medium text-foreground">
                                                            {sprint.endDate
                                                                ? new Date(
                                                                    sprint.endDate
                                                                ).toLocaleDateString()
                                                                : "Not set"}
                                                        </p>
                                                    </div>

                                                </div>

                                                {/* PROGRESS */}

                                                <div className="mt-4">

                                                    <div className="mb-1.5 flex items-center justify-between">

                                                        <span className="text-xs text-muted-foreground">
                                                            Progress
                                                        </span>

                                                        <span className="text-xs font-semibold text-foreground">
                                                            {Number(
                                                                sprint.progress ||
                                                                    0
                                                            )}
                                                            %
                                                        </span>

                                                    </div>

                                                    <div className="h-2 overflow-hidden rounded-full bg-muted">

                                                        <div
                                                            className="
                                                                h-full
                                                                rounded-full
                                                                bg-primary
                                                                transition-all
                                                            "
                                                            style={{
                                                                width: `${Math.min(
                                                                    Math.max(
                                                                        Number(
                                                                            sprint.progress ||
                                                                                0
                                                                        ),
                                                                        0
                                                                    ),
                                                                    100
                                                                )}%`,
                                                            }}
                                                        />

                                                    </div>

                                                </div>

                                            </div>
                                        )
                                    )}

                                </div>
                            )}

                        </div>

                        {/* POPUP FOOTER */}

                        <div
                            className="
                                flex
                                justify-end
                                border-t
                                border-border
                                px-6
                                py-4
                            "
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedStat(null)
                                }
                                className="
                                    inline-flex
                                    h-9
                                    items-center
                                    justify-center
                                    rounded-md
                                    border
                                    border-border
                                    bg-background
                                    px-4
                                    text-sm
                                    font-medium
                                    text-foreground
                                    transition-colors
                                    hover:bg-muted
                                "
                            >
                                Close
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {/* ==================================================
                MONITOR PROGRESS
            ================================================== */}

            {showProgress &&
                selectedSprint && (
                    <div
                        className="
                            fixed
                            inset-0
                            z-[100]
                            flex
                            items-center
                            justify-center
                            bg-black/50
                            p-4
                        "
                        onClick={() => {
                            if (!actionLoading) {
                                setShowProgress(false);
                                setSelectedSprint(null);
                            }
                        }}
                    >
                        <div
                            className="
                                w-full
                                max-w-2xl
                                rounded-xl
                                border
                                border-border
                                bg-background
                                shadow-xl
                            "
                            onClick={(event) =>
                                event.stopPropagation()
                            }
                        >

                            <div className="flex items-center justify-between border-b border-border px-6 py-4">

                                <div>
                                    <h2 className="text-lg font-semibold text-foreground">
                                        Sprint Progress
                                    </h2>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {selectedSprint.name}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowProgress(false);
                                        setSelectedSprint(null);
                                    }}
                                    className="
                                        rounded-md
                                        p-2
                                        text-muted-foreground
                                        hover:bg-muted
                                        hover:text-foreground
                                    "
                                >
                                    <X className="h-5 w-5" />
                                </button>

                            </div>

                            <div className="space-y-6 p-6">

                                <div>
                                    <div className="mb-2 flex items-center justify-between">

                                        <span className="text-sm font-medium text-foreground">
                                            Overall Progress
                                        </span>

                                        <span className="text-sm font-semibold text-primary">
                                            {Number(
                                                selectedSprint.progress ||
                                                    0
                                            )}
                                            %
                                        </span>

                                    </div>

                                    <div className="h-2 overflow-hidden rounded-full bg-muted">

                                        <div
                                            className="h-full rounded-full bg-primary transition-all"
                                            style={{
                                                width: `${Math.min(
                                                    Math.max(
                                                        Number(
                                                            selectedSprint.progress ||
                                                                0
                                                        ),
                                                        0
                                                    ),
                                                    100
                                                )}%`,
                                            }}
                                        />

                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                    <div className="rounded-lg border border-border bg-muted/40 p-4">
                                        <p className="text-xs font-medium text-muted-foreground">
                                            Status
                                        </p>

                                        <p className="mt-1 text-sm font-semibold capitalize text-foreground">
                                            {selectedSprint.status ||
                                                "Planning"}
                                        </p>
                                    </div>

                                    <div className="rounded-lg border border-border bg-muted/40 p-4">
                                        <p className="text-xs font-medium text-muted-foreground">
                                            Team
                                        </p>

                                        <div className="mt-1 flex items-center gap-2">

                                            <UsersRound className="h-4 w-4 text-primary" />

                                            <p className="text-sm font-semibold text-foreground">
                                                {selectedSprint.teamName ||
                                                    "Not assigned"}
                                            </p>

                                        </div>
                                    </div>

                                    <div className="rounded-lg border border-border bg-muted/40 p-4">
                                        <p className="text-xs font-medium text-muted-foreground">
                                            Start Date
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-foreground">
                                            {selectedSprint.startDate
                                                ? new Date(
                                                    selectedSprint.startDate
                                                ).toLocaleDateString()
                                                : "Not set"}
                                        </p>
                                    </div>

                                    <div className="rounded-lg border border-border bg-muted/40 p-4">
                                        <p className="text-xs font-medium text-muted-foreground">
                                            End Date
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-foreground">
                                            {selectedSprint.endDate
                                                ? new Date(
                                                    selectedSprint.endDate
                                                ).toLocaleDateString()
                                                : "Not set"}
                                        </p>
                                    </div>

                                </div>

                                {Array.isArray(
                                    selectedSprint.tasks
                                ) && (
                                    <div className="rounded-lg border border-border bg-muted/40 p-4">

                                        <div className="flex items-center justify-between">

                                            <div>
                                                <p className="text-xs font-medium text-muted-foreground">
                                                    Sprint Tasks
                                                </p>

                                                <p className="mt-1 text-2xl font-bold text-foreground">
                                                    {
                                                        selectedSprint
                                                            .tasks
                                                            .length
                                                    }
                                                </p>
                                            </div>

                                            <ListChecks className="h-6 w-6 text-primary" />

                                        </div>

                                    </div>
                                )}

                            </div>

                            <div className="flex justify-end border-t border-border px-6 py-4">

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowProgress(false);
                                        setSelectedSprint(null);
                                    }}
                                    className="
                                        inline-flex
                                        h-9
                                        items-center
                                        justify-center
                                        rounded-md
                                        border
                                        border-border
                                        bg-background
                                        px-4
                                        text-sm
                                        font-medium
                                        text-foreground
                                        hover:bg-muted
                                    "
                                >
                                    Close
                                </button>

                            </div>
                        </div>
                    </div>
                )}

            {/* ==================================================
                ASSIGN TEAM
            ================================================== */}

            {showAssignTeam &&
                selectedSprint && (
                    <div
                        className="
                            fixed
                            inset-0
                            z-[100]
                            flex
                            items-center
                            justify-center
                            bg-black/50
                            p-4
                        "
                        onClick={() => {
                            if (!actionLoading) {
                                setShowAssignTeam(false);
                                setSelectedSprint(null);
                                setSelectedTeam("");
                            }
                        }}
                    >
                        <div
                            className="
                                w-full
                                max-w-md
                                rounded-xl
                                border
                                border-border
                                bg-background
                                shadow-xl
                            "
                            onClick={(event) =>
                                event.stopPropagation()
                            }
                        >

                            <div className="flex items-center justify-between border-b border-border px-6 py-4">

                                <div>
                                    <h2 className="text-lg font-semibold text-foreground">
                                        Assign Team
                                    </h2>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Assign a team to{" "}
                                        {selectedSprint.name}.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        if (!actionLoading) {
                                            setShowAssignTeam(false);
                                            setSelectedSprint(null);
                                            setSelectedTeam("");
                                        }
                                    }}
                                    className="
                                        rounded-md
                                        p-2
                                        text-muted-foreground
                                        hover:bg-muted
                                        hover:text-foreground
                                    "
                                >
                                    <X className="h-5 w-5" />
                                </button>

                            </div>

                            <div className="space-y-4 p-6">

                                <div>

                                    <label
                                        htmlFor="sprint-team"
                                        className="mb-2 block text-sm font-medium text-foreground"
                                    >
                                        Team
                                    </label>

                                    <select
                                        id="sprint-team"
                                        value={selectedTeam}
                                        onChange={(event) =>
                                            setSelectedTeam(
                                                event.target.value
                                            )
                                        }
                                        disabled={actionLoading}
                                        className="
                                            h-10
                                            w-full
                                            rounded-md
                                            border
                                            border-input
                                            bg-background
                                            px-3
                                            text-sm
                                            text-foreground
                                            outline-none
                                            focus:border-primary
                                            focus:ring-2
                                            focus:ring-primary/20
                                        "
                                    >
                                        <option value="">
                                            Select a team
                                        </option>

                                        {teams.map(
                                            (team) => {
                                                const teamId =
                                                    getValue(
                                                        team,
                                                        "Id",
                                                        "id"
                                                    );

                                                const teamName =
                                                    getValue(
                                                        team,
                                                        "Name",
                                                        "name"
                                                    ) ||
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

                                </div>

                            </div>

                            <div className="flex justify-end gap-2 border-t border-border px-6 py-4">

                                <button
                                    type="button"
                                    disabled={
                                        actionLoading
                                    }
                                    onClick={() => {
                                        setShowAssignTeam(false);
                                        setSelectedSprint(null);
                                        setSelectedTeam("");
                                    }}
                                    className="
                                        inline-flex
                                        h-9
                                        items-center
                                        justify-center
                                        rounded-md
                                        border
                                        border-border
                                        bg-background
                                        px-4
                                        text-sm
                                        font-medium
                                        text-foreground
                                        hover:bg-muted
                                        disabled:opacity-50
                                    "
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    disabled={
                                        actionLoading ||
                                        !selectedTeam
                                    }
                                    onClick={
                                        handleConfirmAssignTeam
                                    }
                                    className="
                                        inline-flex
                                        h-9
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-md
                                        bg-primary
                                        px-4
                                        text-sm
                                        font-medium
                                        text-primary-foreground
                                        hover:bg-primary/90
                                        disabled:opacity-50
                                    "
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

export default SprintManagement;