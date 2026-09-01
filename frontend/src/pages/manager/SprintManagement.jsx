
// ============================================================
// AIPMS — MANAGER SPRINT MANAGEMENT
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
//
// Colorful Professional UI
// ============================================================

import React, { useMemo, useState } from "react";

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
} from "lucide-react";

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
// COMPONENT
// ============================================================

function SprintManagement() {
    // ========================================================
    // CURRENT MANAGER
    // ========================================================

    const currentManager = {
        id: "current-manager",
        name: "Current Manager",
    };

    // ========================================================
    // SPRINT DATA
    // ========================================================

    const [sprints, setSprints] = useState([
        {
            id: 1,
            name: "Sprint 01",
            goal: "Implement authentication and user management.",
            status: "Planning",
            progress: 0,
            team: "AIPMS Development Team",
            teamId: 1,
            projectId: 1,
            projectName: "AI-Powered Project Management System",
            managerId: "current-manager",
            startDate: "August 10, 2026",
            endDate: "August 17, 2026",

            tasks: [
                {
                    id: 1,
                    title: "Create authentication service",
                    status: "Completed",
                    priority: "High",
                    assignee: "Developer 1",
                },
                {
                    id: 2,
                    title: "Create login page",
                    status: "In Progress",
                    priority: "High",
                    assignee: "Developer 2",
                },
                {
                    id: 3,
                    title: "Implement role permissions",
                    status: "Todo",
                    priority: "Medium",
                    assignee: "Developer 3",
                },
            ],
        },

        {
            id: 2,
            name: "Sprint 02",
            goal: "Develop project and task management features.",
            status: "Active",
            progress: 65,
            team: "AIPMS Development Team",
            teamId: 1,
            projectId: 1,
            projectName: "AI-Powered Project Management System",
            managerId: "current-manager",
            startDate: "August 18, 2026",
            endDate: "August 25, 2026",

            tasks: [
                {
                    id: 4,
                    title: "Create project management page",
                    status: "Completed",
                    priority: "High",
                    assignee: "Developer 1",
                },
                {
                    id: 5,
                    title: "Create task management page",
                    status: "In Progress",
                    priority: "High",
                    assignee: "Developer 2",
                },
                {
                    id: 6,
                    title: "Implement task assignment",
                    status: "In Progress",
                    priority: "Medium",
                    assignee: "Developer 3",
                },
                {
                    id: 7,
                    title: "Create task status workflow",
                    status: "Todo",
                    priority: "Medium",
                    assignee: "Developer 4",
                },
            ],
        },

        {
            id: 3,
            name: "Sprint 03",
            goal: "Implement reports, monitoring and AI features.",
            status: "Completed",
            progress: 100,
            team: "AIPMS Development Team",
            teamId: 1,
            projectId: 1,
            projectName: "AI-Powered Project Management System",
            managerId: "current-manager",
            startDate: "July 20, 2026",
            endDate: "August 5, 2026",

            tasks: [
                {
                    id: 8,
                    title: "Create reports dashboard",
                    status: "Completed",
                    priority: "High",
                    assignee: "Developer 1",
                },
                {
                    id: 9,
                    title: "Implement monitoring",
                    status: "Completed",
                    priority: "High",
                    assignee: "Developer 2",
                },
                {
                    id: 10,
                    title: "Create AI insights",
                    status: "Completed",
                    priority: "Medium",
                    assignee: "Developer 3",
                },
            ],
        },
    ]);

    // ========================================================
    // MODAL STATE
    // ========================================================

    const [selectedSprint, setSelectedSprint] = useState(null);
    const [modalMode, setModalMode] = useState(null);

    // ========================================================
    // CREATE SPRINT MODAL
    // ========================================================

    const [showCreateForm, setShowCreateForm] = useState(false);

    // ========================================================
    // MONITOR SPRINT PROGRESS
    // ========================================================

    const [showProgress, setShowProgress] = useState(false);

    // ========================================================
    // ASSIGN SPRINT TO TEAM
    // ========================================================

    const [showAssignTeam, setShowAssignTeam] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState("");

    // ========================================================
    // MESSAGES
    // ========================================================

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // ========================================================
    // ASSIGNED SPRINTS
    // ========================================================

    const assignedSprints = useMemo(() => {
        return sprints.filter(
            (sprint) =>
                sprint.managerId === currentManager.id
        );
    }, [sprints, currentManager.id]);

    // ========================================================
    // STATISTICS
    // ========================================================

    const sprintStats = useMemo(() => {
        const total = assignedSprints.length;

        const active = assignedSprints.filter(
            (sprint) =>
                String(sprint.status).toLowerCase() === "active"
        ).length;

        const completed = assignedSprints.filter(
            (sprint) =>
                String(sprint.status).toLowerCase() === "completed"
        ).length;

        const planning = assignedSprints.filter(
            (sprint) =>
                String(sprint.status).toLowerCase() === "planning"
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
    // CREATE SPRINT
    // ========================================================

    const handleCreateSprint = (sprintData) => {
        clearMessages();

        if (!sprintData) {
            showError(
                "Sprint information is required."
            );
            return;
        }

        const name =
            String(sprintData.name || "").trim();

        const goal =
            String(sprintData.goal || "").trim();

        const team =
            String(sprintData.team || "").trim();

        const startDate =
            sprintData.startDate || "";

        const endDate =
            sprintData.endDate || "";

        if (
            !name ||
            !goal ||
            !team ||
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

        const duplicate = assignedSprints.some(
            (sprint) =>
                String(sprint.name)
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

        const newStart =
            new Date(startDate);

        const newEnd =
            new Date(endDate);

        const hasConflict =
            assignedSprints.some(
                (sprint) => {
                    if (
                        !sprint.startDate ||
                        !sprint.endDate
                    ) {
                        return false;
                    }

                    const existingStart =
                        new Date(
                            sprint.startDate
                        );

                    const existingEnd =
                        new Date(
                            sprint.endDate
                        );

                    return (
                        newStart <= existingEnd &&
                        newEnd >= existingStart
                    );
                }
            );

        if (hasConflict) {
            showError(
                "The selected sprint dates conflict with an existing sprint."
            );

            return;
        }

        const newId =
            sprints.length > 0
                ? Math.max(
                      ...sprints.map(
                          (sprint) =>
                              Number(sprint.id)
                      )
                  ) + 1
                : 1;

        const newSprint = {
            id: newId,
            name,
            goal,
            status: "Planning",
            progress: 0,
            team,
            teamId: null,
            projectId: 1,
            projectName:
                "AI-Powered Project Management System",
            managerId: currentManager.id,
            startDate,
            endDate,
            tasks: [],
        };

        setSprints(
            (previousSprints) => [
                ...previousSprints,
                newSprint,
            ]
        );

        setShowCreateForm(false);

        showSuccess(
            "Sprint created successfully."
        );
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
            String(sprint.status).toLowerCase();

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
            String(sprint.status).toLowerCase();

        if (status !== "planning") {
            showError(
                "Only a planning sprint can be started."
            );

            return;
        }

        const activeSprint =
            assignedSprints.find(
                (item) =>
                    item.id !== sprint.id &&
                    String(item.status).toLowerCase() ===
                        "active"
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
            String(sprint.status).toLowerCase() !==
            "active"
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

    const handleMonitorProgress = (sprint) => {
        clearMessages();

        if (!sprint) {
            showError(
                "The selected sprint could not be found."
            );

            return;
        }

        setSelectedSprint(sprint);
        setShowProgress(true);
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
            sprint.team || ""
        );
        setShowAssignTeam(true);
    };

    // ========================================================
    // SAVE TEAM ASSIGNMENT
    // ========================================================

    const handleSaveTeamAssignment = () => {
        clearMessages();

        if (!selectedSprint) {
            showError(
                "No sprint has been selected."
            );

            return;
        }

        const team =
            selectedTeam.trim();

        if (!team) {
            showError(
                "Please enter a team name."
            );

            return;
        }

        setSprints(
            (previousSprints) =>
                previousSprints.map(
                    (sprint) =>
                        sprint.id ===
                        selectedSprint.id
                            ? {
                                  ...sprint,
                                  team,
                              }
                            : sprint
                )
        );

        closeAssignTeam();

        showSuccess(
            "Sprint assigned to the team successfully."
        );
    };

    // ========================================================
    // SPRINT UPDATED
    // ========================================================

    const handleSprintUpdated = (
        sprintId,
        updatedSprint
    ) => {
        if (
            !sprintId ||
            !updatedSprint
        ) {
            showError(
                "The sprint could not be updated."
            );

            return;
        }

        setSprints(
            (previousSprints) =>
                previousSprints.map(
                    (sprint) =>
                        sprint.id === sprintId
                            ? {
                                  ...sprint,
                                  ...updatedSprint,
                              }
                            : sprint
                )
        );

        closeModal();

        showSuccess(
            "Sprint updated successfully."
        );
    };

    // ========================================================
    // SPRINT DELETED
    // ========================================================

    const handleSprintDeleted = (
        sprintId
    ) => {
        if (!sprintId) {
            showError(
                "The sprint could not be deleted."
            );

            return;
        }

        setSprints(
            (previousSprints) =>
                previousSprints.filter(
                    (sprint) =>
                        sprint.id !==
                        sprintId
                )
        );

        closeModal();

        showSuccess(
            "Sprint deleted successfully."
        );
    };

    // ========================================================
    // SPRINT STARTED
    // ========================================================

    const handleSprintStarted = (
        sprintId
    ) => {
        if (!sprintId) {
            showError(
                "The sprint could not be started."
            );

            return;
        }

        setSprints(
            (previousSprints) =>
                previousSprints.map(
                    (sprint) =>
                        sprint.id === sprintId
                            ? {
                                  ...sprint,
                                  status: "Active",
                              }
                            : sprint
                )
        );

        closeModal();

        showSuccess(
            "Sprint started successfully."
        );
    };

    // ========================================================
    // SPRINT COMPLETED
    // ========================================================

    const handleSprintCompleted = (
        sprintId
    ) => {
        if (!sprintId) {
            showError(
                "The sprint could not be completed."
            );

            return;
        }

        setSprints(
            (previousSprints) =>
                previousSprints.map(
                    (sprint) =>
                        sprint.id === sprintId
                            ? {
                                  ...sprint,
                                  status: "Completed",
                                  progress: 100,
                              }
                            : sprint
                )
        );

        closeModal();

        showSuccess(
            "Sprint completed successfully."
        );
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">

            <main className="min-h-screen">

                <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">

                    {/* ==================================================
                        COLORFUL HEADER
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

                            <button
                                type="button"
                                onClick={() => {
                                    clearMessages();
                                    setShowCreateForm(true);
                                }}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-violet-700 shadow-md transition hover:bg-slate-50 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-violet-600"
                            >
                                <Plus size={18} />
                                Create Sprint
                            </button>

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
                        COLORFUL STATISTICS
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

                                {assignedSprints.length === 1
                                    ? "Sprint"
                                    : "Sprints"}

                            </div>

                        </div>

                        {assignedSprints.length ===
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

                                            {/* Color accent based on sprint status */}

                                            <div
                                                className={
                                                    String(
                                                        sprint.status
                                                    ).toLowerCase() ===
                                                    "active"
                                                        ? "absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-emerald-400 to-green-600"
                                                        : String(
                                                              sprint.status
                                                          ).toLowerCase() ===
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

            {/* ==========================================================
                CREATE SPRINT
            ========================================================== */}

            {showCreateForm && (
                <CreateSprintModal
                    onClose={() =>
                        setShowCreateForm(false)
                    }
                    onCreated={
                        handleCreateSprint
                    }
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
                                            selectedSprint.tasks?.length ||
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
                                    Team
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
                                    placeholder="Enter team name"
                                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />

                                <p className="mt-2 text-xs leading-5 text-slate-500">
                                    Assign this sprint to the team responsible for completing its backlog.
                                </p>

                            </div>

                            <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4">

                                <button
                                    type="button"
                                    onClick={
                                        closeAssignTeam
                                    }
                                    className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        handleSaveTeamAssignment
                                    }
                                    className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:from-cyan-600 hover:to-blue-700 hover:shadow-md"
                                >
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

