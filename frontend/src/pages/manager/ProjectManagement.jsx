
// ============================================================
// AIPMS — MANAGER PROJECT MANAGEMENT
//
// PM-001 — Create Project Specification
// PM-002 — Update Project Specification
// PM-003 — Delete Project Specification
// PM-004 — View Assigned Projects
// PM-005 — Update Project Timeline
// PM-006 — Set / Update Project Deadline
// PM-007 — Manage Project Status
//
// REAL BACKEND VERSION
// ============================================================

import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    FolderKanban,
    CheckCircle,
    Clock,
    AlertTriangle,
    Eye,
    FilePlus2,
    FilePenLine,
    Trash2,
    CalendarRange,
    CalendarClock,
    CircleDot,
    RefreshCw,
    Loader2,
} from "lucide-react";

// ============================================================
// SERVICES
// ============================================================

import {
    getMyProjects,
    getProjectSpecification,
} from "../../services/projectService";

// Use the existing authentication service if available.
import {
    getCurrentUser,
} from "../../services/authService";

// ============================================================
// PROJECT COMPONENTS
// ============================================================

import ProjectStatsCard from "../../components/manager/project/ProjectStatsCard";
import ProjectCard from "../../components/manager/project/ProjectCard";

// ============================================================
// PROJECT USE CASE MODALS
// ============================================================

import CreateProjectSpecificationModal from "../../components/manager/project/CreateProjectSpecificationModal";
import UpdateProjectSpecificationModal from "../../components/manager/project/UpdateProjectSpecificationModal";
import DeleteProjectSpecificationModal from "../../components/manager/project/DeleteProjectSpecificationModal";
import ViewAssignedProjectModal from "../../components/manager/project/ViewAssignedProjectModal";
import UpdateTimelineProjectModal from "../../components/manager/project/UpdateTimelineProjectModal";
import SetUpdateProjectDeadlineModal from "../../components/manager/project/SetUpdateProjectDeadlineModal";
import ManageProjectStatusModal from "../../components/manager/project/ManageProjectStatusModal";

// ============================================================
// COMPONENT
// ============================================================

function ProjectManagement() {
    // ========================================================
    // CURRENT MANAGER
    // ========================================================

    const [currentManager, setCurrentManager] =
        useState(null);

    // ========================================================
    // PROJECTS
    // ========================================================

    const [projects, setProjects] = useState([]);

    // ========================================================
    // LOADING
    // ========================================================

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    // ========================================================
    // MODAL STATE
    // ========================================================

    const [selectedProject, setSelectedProject] =
        useState(null);

    const [modalType, setModalType] =
        useState(null);

    // ========================================================
    // MESSAGES
    // ========================================================

    const [successMessage, setSuccessMessage] =
        useState("");

    const [errorMessage, setErrorMessage] =
        useState("");

    // ========================================================
    // CLEAR MESSAGES
    // ========================================================

    const clearMessages = useCallback(() => {
        setSuccessMessage("");
        setErrorMessage("");
    }, []);

    // ========================================================
    // SHOW SUCCESS
    // ========================================================

    const showSuccess = useCallback((message) => {
        setErrorMessage("");
        setSuccessMessage(message);

        window.setTimeout(() => {
            setSuccessMessage("");
        }, 4000);
    }, []);

    // ========================================================
    // ERROR HANDLER
    // ========================================================

    const handleProjectError = useCallback(
        (message) => {
            setSuccessMessage("");
            setErrorMessage(
                message ||
                    "An unexpected error occurred."
            );
        },
        []
    );

    // ========================================================
    // FORMAT DATE
    // ========================================================

    const formatDate = useCallback((value) => {
        if (!value) {
            return "";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return String(value);
        }

        return date.toLocaleDateString(
            "en-US",
            {
                year: "numeric",
                month: "long",
                day: "numeric",
            }
        );
    }, []);

    // ========================================================
    // NORMALIZE PROJECT FOR THIS PAGE
    // ========================================================

    const normalizeManagerProject =
        useCallback(
            (project) => {
                if (!project) {
                    return null;
                }

                const projectId =
                    project.id ??
                    project.projectId ??
                    project.ProjectId ??
                    null;

                const managerId =
                    project.managerId ??
                    project.ManagerId ??
                    project.manager?.id ??
                    project.manager?.userId ??
                    null;

                const status =
                    project.statusName ??
                    project.status ??
                    project.Status ??
                    "";

                return {
                    ...project,

                    id: projectId,

                    projectId,

                    name:
                        project.name ??
                        project.projectName ??
                        "",

                    description:
                        project.description ??
                        "",

                    status,

                    statusName: status,

                    progress:
                        Number(
                            project.progress ??
                                project.Progress ??
                                0
                        ),

                    startDate:
                        project.startDate ??
                        project.StartDate ??
                        null,

                    deadline:
                        project.deadline ??
                        project.Deadline ??
                        null,

                    managerId,

                    managerName:
                        project.managerName ??
                        project.ManagerName ??
                        project.manager?.fullName ??
                        project.manager?.name ??
                        "",

                    team:
                        project.team ??
                        project.teamSize ??
                        project.teamCount ??
                        0,

                    teamName:
                        project.teamName ??
                        project.TeamName ??
                        project.team?.name ??
                        "",

                    hasSpecification:
                        Boolean(
                            project.hasSpecification ??
                                project.specification ??
                                false
                        ),

                    specification:
                        project.specification ??
                        null,

                    hasActiveSprint:
                        Boolean(
                            project.hasActiveSprint ??
                                project.activeSprint ??
                                false
                        ),
                };
            },
            []
        );

    // ========================================================
    // LOAD CURRENT MANAGER
    // ========================================================

    const loadCurrentManager =
        useCallback(async () => {
            try {
                const user =
                    await getCurrentUser();

                if (!user) {
                    throw new Error(
                        "Unable to determine the current manager."
                    );
                }

                const manager = {
                    id:
                        user.id ??
                        user.userId ??
                        user.Id ??
                        user.UserId,

                    name:
                        user.fullName ??
                        user.name ??
                        user.FullName ??
                        "Manager",
                };

                if (!manager.id) {
                    throw new Error(
                        "Current manager ID was not found."
                    );
                }

                setCurrentManager(manager);

                return manager;
            } catch (error) {
                console.error(
                    "LOAD CURRENT MANAGER ERROR:",
                    error
                );

                throw error;
            }
        }, []);

    // ========================================================
    // LOAD PROJECTS
    // ========================================================

    const loadProjects = useCallback(
        async (showRefresh = false) => {
            try {
                if (showRefresh) {
                    setRefreshing(true);
                } else {
                    setLoading(true);
                }

                clearMessages();

                const manager =
                    currentManager ||
                    (await loadCurrentManager());

                // ------------------------------------------------
                // Get projects assigned to authenticated manager
                // ------------------------------------------------

                const apiProjects =
                    await getMyProjects();

                const normalizedProjects =
                    Array.isArray(apiProjects)
                        ? apiProjects
                              .map(
                                  normalizeManagerProject
                              )
                              .filter(Boolean)
                        : [];

                // ------------------------------------------------
                // Load project specifications
                // ------------------------------------------------

                const projectsWithSpecifications =
                    await Promise.all(
                        normalizedProjects.map(
                            async (project) => {
                                try {
                                    const specification =
                                        await getProjectSpecification(
                                            project.id
                                        );

                                    return {
                                        ...project,

                                        hasSpecification:
                                            Boolean(
                                                specification
                                            ),

                                        specification:
                                            specification ||
                                            null,
                                    };
                                } catch (error) {
                                    const status =
                                        error?.cause
                                            ?.response
                                            ?.status ??
                                        error?.response
                                            ?.status;

                                    // 404 means the project simply
                                    // does not have a specification.
                                    if (
                                        status ===
                                        404
                                    ) {
                                        return {
                                            ...project,

                                            hasSpecification:
                                                false,

                                            specification:
                                                null,
                                        };
                                    }

                                    console.warn(
                                        `Unable to load specification for project ${project.id}:`,
                                        error
                                    );

                                    return project;
                                }
                            }
                        )
                    );

                // ------------------------------------------------
                // Keep only projects belonging to this manager.
                // The backend should already enforce this through
                // /my-projects, but this is an additional frontend
                // safety check.
                // ------------------------------------------------

                const assigned =
                    projectsWithSpecifications.filter(
                        (project) =>
                            String(
                                project.managerId
                            ).toLowerCase() ===
                            String(
                                manager.id
                            ).toLowerCase()
                    );

                setProjects(assigned);
            } catch (error) {
                console.error(
                    "LOAD MANAGER PROJECTS ERROR:",
                    error
                );

                handleProjectError(
                    error?.message ||
                        "Unable to load your assigned projects."
                );
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [
            currentManager,
            loadCurrentManager,
            normalizeManagerProject,
            clearMessages,
            handleProjectError,
        ]
    );

    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {
        let mounted = true;

        const initialize = async () => {
            try {
                setLoading(true);

                const manager =
                    await loadCurrentManager();

                if (!mounted) {
                    return;
                }

                const apiProjects =
                    await getMyProjects();

                if (!mounted) {
                    return;
                }

                const normalizedProjects =
                    Array.isArray(apiProjects)
                        ? apiProjects
                              .map(
                                  normalizeManagerProject
                              )
                              .filter(Boolean)
                        : [];

                const projectsWithSpecifications =
                    await Promise.all(
                        normalizedProjects.map(
                            async (project) => {
                                try {
                                    const specification =
                                        await getProjectSpecification(
                                            project.id
                                        );

                                    return {
                                        ...project,

                                        hasSpecification:
                                            Boolean(
                                                specification
                                            ),

                                        specification:
                                            specification ||
                                            null,
                                    };
                                } catch (error) {
                                    const status =
                                        error?.cause
                                            ?.response
                                            ?.status ??
                                        error?.response
                                            ?.status;

                                    if (
                                        status ===
                                        404
                                    ) {
                                        return {
                                            ...project,

                                            hasSpecification:
                                                false,

                                            specification:
                                                null,
                                        };
                                    }

                                    return project;
                                }
                            }
                        )
                    );

                if (!mounted) {
                    return;
                }

                const assigned =
                    projectsWithSpecifications.filter(
                        (project) =>
                            String(
                                project.managerId
                            ).toLowerCase() ===
                            String(
                                manager.id
                            ).toLowerCase()
                    );

                setProjects(assigned);
            } catch (error) {
                console.error(
                    "INITIALIZE PROJECT MANAGEMENT ERROR:",
                    error
                );

                if (mounted) {
                    handleProjectError(
                        error?.message ||
                            "Unable to load project management data."
                    );
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        initialize();

        return () => {
            mounted = false;
        };
    }, [
        loadCurrentManager,
        normalizeManagerProject,
        handleProjectError,
    ]);

    // ========================================================
    // ASSIGNED PROJECTS
    // ========================================================

    const assignedProjects = useMemo(() => {
        if (!currentManager?.id) {
            return projects;
        }

        return projects.filter(
            (project) =>
                String(
                    project.managerId
                ).toLowerCase() ===
                String(
                    currentManager.id
                ).toLowerCase()
        );
    }, [
        projects,
        currentManager,
    ]);

    // ========================================================
    // PROJECT STATISTICS
    // ========================================================

    const projectStats = useMemo(() => {
        const total =
            assignedProjects.length;

        const active =
            assignedProjects.filter(
                (project) =>
                    String(
                        project.statusName ||
                            project.status ||
                            ""
                    ).toLowerCase() ===
                    "active"
            ).length;

        const completed =
            assignedProjects.filter(
                (project) =>
                    String(
                        project.statusName ||
                            project.status ||
                            ""
                    ).toLowerCase() ===
                    "completed"
            ).length;

        return [
            {
                title: "Total Projects",
                value: total,
                icon: FolderKanban,
            },
            {
                title: "Active Projects",
                value: active,
                icon: Clock,
            },
            {
                title: "Completed",
                value: completed,
                icon: CheckCircle,
            },
            {
                title: "AI Risks",
                value: 0,
                icon: AlertTriangle,
            },
        ];
    }, [assignedProjects]);

    // ========================================================
    // CLOSE MODAL
    // ========================================================

    const closeModal = useCallback(() => {
        setSelectedProject(null);
        setModalType(null);
    }, []);

    // ========================================================
    // FIND CURRENT PROJECT
    // ========================================================

    const findProject = useCallback(
        (projectId) => {
            return projects.find(
                (project) =>
                    String(project.id) ===
                    String(projectId)
            );
        },
        [projects]
    );

    // ========================================================
    // MANAGER AUTHORIZATION
    // ========================================================

    const isCurrentManagerProject =
        useCallback(
            (project) => {
                if (
                    !project ||
                    !currentManager?.id
                ) {
                    return false;
                }

                return (
                    String(
                        project.managerId
                    ).toLowerCase() ===
                    String(
                        currentManager.id
                    ).toLowerCase()
                );
            },
            [currentManager]
        );

    // ========================================================
    // PM-001
    // CREATE PROJECT SPECIFICATION
    // ========================================================

    const handleCreateSpecification =
        useCallback(
            (project) => {
                clearMessages();

                if (!project) {
                    handleProjectError(
                        "The selected project could not be found."
                    );
                    return;
                }

                if (
                    !isCurrentManagerProject(
                        project
                    )
                ) {
                    handleProjectError(
                        "You are not authorised to manage this project."
                    );
                    return;
                }

                if (
                    project.hasSpecification ||
                    project.specification
                ) {
                    handleProjectError(
                        "A project specification already exists. Please update it instead."
                    );
                    return;
                }

                setSelectedProject(project);
                setModalType("create");
            },
            [
                clearMessages,
                handleProjectError,
                isCurrentManagerProject,
            ]
        );

    // ========================================================
    // PM-002
    // UPDATE PROJECT SPECIFICATION
    // ========================================================

    const handleUpdateSpecification =
        useCallback(
            (project) => {
                clearMessages();

                if (!project) {
                    handleProjectError(
                        "The selected project could not be found."
                    );
                    return;
                }

                if (
                    !isCurrentManagerProject(
                        project
                    )
                ) {
                    handleProjectError(
                        "You are not authorised to manage this project."
                    );
                    return;
                }

                if (
                    !project.hasSpecification ||
                    !project.specification
                ) {
                    handleProjectError(
                        "A project specification does not exist. Please create it first."
                    );
                    return;
                }

                setSelectedProject(project);
                setModalType("update");
            },
            [
                clearMessages,
                handleProjectError,
                isCurrentManagerProject,
            ]
        );

    // ========================================================
    // PM-003
    // DELETE PROJECT SPECIFICATION
    // ========================================================

    const handleDeleteSpecification =
        useCallback(
            (project) => {
                clearMessages();

                if (!project) {
                    handleProjectError(
                        "The selected project could not be found."
                    );
                    return;
                }

                if (
                    !isCurrentManagerProject(
                        project
                    )
                ) {
                    handleProjectError(
                        "You are not authorised to manage this project."
                    );
                    return;
                }

                if (
                    !project.hasSpecification ||
                    !project.specification
                ) {
                    handleProjectError(
                        "A project specification does not exist."
                    );
                    return;
                }

                if (project.hasActiveSprint) {
                    handleProjectError(
                        "This project specification is currently being used by an active Sprint and cannot be deleted."
                    );
                    return;
                }

                setSelectedProject(project);
                setModalType("delete");
            },
            [
                clearMessages,
                handleProjectError,
                isCurrentManagerProject,
            ]
        );

    // ========================================================
    // PM-004
    // VIEW ASSIGNED PROJECT
    // ========================================================

    const handleViewProject =
        useCallback(
            (project) => {
                clearMessages();

                if (!project) {
                    handleProjectError(
                        "The selected project could not be found."
                    );
                    return;
                }

                if (
                    !isCurrentManagerProject(
                        project
                    )
                ) {
                    handleProjectError(
                        "You are not authorised to view this project."
                    );
                    return;
                }

                setSelectedProject(project);
                setModalType("view");
            },
            [
                clearMessages,
                handleProjectError,
                isCurrentManagerProject,
            ]
        );

    // ========================================================
    // PM-005
    // UPDATE PROJECT TIMELINE
    // ========================================================

    const handleUpdateTimeline =
        useCallback(
            (project) => {
                clearMessages();

                if (!project) {
                    handleProjectError(
                        "The selected project could not be found."
                    );
                    return;
                }

                if (
                    !isCurrentManagerProject(
                        project
                    )
                ) {
                    handleProjectError(
                        "You are not authorised to manage this project."
                    );
                    return;
                }

                setSelectedProject(project);
                setModalType("timeline");
            },
            [
                clearMessages,
                handleProjectError,
                isCurrentManagerProject,
            ]
        );

    // ========================================================
    // PM-006
    // SET / UPDATE PROJECT DEADLINE
    // ========================================================

    const handleUpdateDeadline =
        useCallback(
            (project) => {
                clearMessages();

                if (!project) {
                    handleProjectError(
                        "The selected project could not be found."
                    );
                    return;
                }

                if (
                    !isCurrentManagerProject(
                        project
                    )
                ) {
                    handleProjectError(
                        "You are not authorised to manage this project."
                    );
                    return;
                }

                setSelectedProject(project);
                setModalType("deadline");
            },
            [
                clearMessages,
                handleProjectError,
                isCurrentManagerProject,
            ]
        );

    // ========================================================
    // PM-007
    // MANAGE PROJECT STATUS
    // ========================================================

    const handleManageStatus =
        useCallback(
            (project) => {
                clearMessages();

                if (!project) {
                    handleProjectError(
                        "The selected project could not be found."
                    );
                    return;
                }

                if (
                    !isCurrentManagerProject(
                        project
                    )
                ) {
                    handleProjectError(
                        "You are not authorised to manage this project."
                    );
                    return;
                }

                setSelectedProject(project);
                setModalType("status");
            },
            [
                clearMessages,
                handleProjectError,
                isCurrentManagerProject,
            ]
        );

    // ========================================================
    // PM-001 SUCCESS
    // ========================================================

    const handleSpecificationCreated =
        useCallback(
            async (
                projectId,
                specification
            ) => {
                setProjects(
                    (previousProjects) =>
                        previousProjects.map(
                            (project) =>
                                String(
                                    project.id
                                ) ===
                                String(
                                    projectId
                                )
                                    ? {
                                          ...project,

                                          hasSpecification:
                                              true,

                                          specification,
                                      }
                                    : project
                        )
                );

                closeModal();

                showSuccess(
                    "Project specification created successfully."
                );

                // Refresh from backend
                await loadProjects(true);
            },
            [
                closeModal,
                showSuccess,
                loadProjects,
            ]
        );

    // ========================================================
    // PM-002 SUCCESS
    // ========================================================

    const handleSpecificationUpdated =
        useCallback(
            async (
                projectId,
                specification
            ) => {
                setProjects(
                    (previousProjects) =>
                        previousProjects.map(
                            (project) =>
                                String(
                                    project.id
                                ) ===
                                String(
                                    projectId
                                )
                                    ? {
                                          ...project,

                                          hasSpecification:
                                              true,

                                          specification,
                                      }
                                    : project
                        )
                );

                closeModal();

                showSuccess(
                    "Project specification updated successfully."
                );

                await loadProjects(true);
            },
            [
                closeModal,
                showSuccess,
                loadProjects,
            ]
        );

    // ========================================================
    // PM-003 SUCCESS
    // ========================================================

    const handleSpecificationDeleted =
        useCallback(
            async (projectId) => {
                setProjects(
                    (previousProjects) =>
                        previousProjects.map(
                            (project) =>
                                String(
                                    project.id
                                ) ===
                                String(
                                    projectId
                                )
                                    ? {
                                          ...project,

                                          hasSpecification:
                                              false,

                                          specification:
                                              null,
                                      }
                                    : project
                        )
                );

                closeModal();

                showSuccess(
                    "Project specification deleted successfully."
                );

                await loadProjects(true);
            },
            [
                closeModal,
                showSuccess,
                loadProjects,
            ]
        );

    // ========================================================
    // PM-005 SUCCESS
    // ========================================================

    const handleTimelineUpdated =
        useCallback(
            async (
                projectId,
                timeline
            ) => {
                setProjects(
                    (previousProjects) =>
                        previousProjects.map(
                            (project) =>
                                String(
                                    project.id
                                ) ===
                                String(
                                    projectId
                                )
                                    ? {
                                          ...project,
                                          ...timeline,
                                      }
                                    : project
                        )
                );

                closeModal();

                showSuccess(
                    "Project timeline updated successfully."
                );

                await loadProjects(true);
            },
            [
                closeModal,
                showSuccess,
                loadProjects,
            ]
        );

    // ========================================================
    // PM-006 SUCCESS
    // ========================================================

    const handleDeadlineUpdated =
        useCallback(
            async (
                projectId,
                deadline
            ) => {
                setProjects(
                    (previousProjects) =>
                        previousProjects.map(
                            (project) =>
                                String(
                                    project.id
                                ) ===
                                String(
                                    projectId
                                )
                                    ? {
                                          ...project,
                                          deadline,
                                      }
                                    : project
                        )
                );

                closeModal();

                showSuccess(
                    "Project deadline updated successfully."
                );

                await loadProjects(true);
            },
            [
                closeModal,
                showSuccess,
                loadProjects,
            ]
        );

    // ========================================================
    // PM-007 SUCCESS
    // ========================================================

    const handleStatusUpdated =
        useCallback(
            async (
                projectId,
                status
            ) => {
                setProjects(
                    (previousProjects) =>
                        previousProjects.map(
                            (project) =>
                                String(
                                    project.id
                                ) ===
                                String(
                                    projectId
                                )
                                    ? {
                                          ...project,
                                          status,
                                          statusName:
                                              status,
                                      }
                                    : project
                        )
                );

                closeModal();

                showSuccess(
                    "Project status updated successfully."
                );

                await loadProjects(true);
            },
            [
                closeModal,
                showSuccess,
                loadProjects,
            ]
        );

    // ========================================================
    // PROJECT STATUS STYLE
    // ========================================================

    const getStatusStyle = (status) => {
        switch (
            String(status || "")
                .toLowerCase()
        ) {
            case "active":
                return {
                    badge:
                        "border-emerald-200 bg-emerald-50 text-emerald-700",
                    dot: "bg-emerald-500",
                };

            case "planning":
                return {
                    badge:
                        "border-amber-200 bg-amber-50 text-amber-700",
                    dot: "bg-amber-500",
                };

            case "completed":
                return {
                    badge:
                        "border-blue-200 bg-blue-50 text-blue-700",
                    dot: "bg-blue-500",
                };

            case "on hold":
                return {
                    badge:
                        "border-orange-200 bg-orange-50 text-orange-700",
                    dot: "bg-orange-500",
                };

            case "cancelled":
                return {
                    badge:
                        "border-red-200 bg-red-50 text-red-700",
                    dot: "bg-red-500",
                };

            case "archived":
                return {
                    badge:
                        "border-slate-300 bg-slate-100 text-slate-600",
                    dot: "bg-slate-500",
                };

            default:
                return {
                    badge:
                        "border-slate-200 bg-slate-50 text-slate-600",
                    dot: "bg-slate-400",
                };
        }
    };

    // ========================================================
    // LOADING STATE
    // ========================================================

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 text-slate-900">

                <main className="flex min-h-screen items-center justify-center px-6">

                    <div className="text-center">

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">

                            <Loader2
                                size={30}
                                className="animate-spin text-white"
                            />

                        </div>

                        <h2 className="mt-5 text-lg font-bold text-slate-800">
                            Loading Project Management
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                            Loading your assigned projects...
                        </p>

                    </div>

                </main>

            </div>
        );
    }

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 text-slate-900">

            <main className="min-h-screen">

                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

                    {/* ==================================================
                        HEADER
                    ================================================== */}

                    <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-6 text-white shadow-xl shadow-blue-200/50">

                        <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-white/10" />

                        <div className="absolute -bottom-24 right-28 h-64 w-64 rounded-full bg-white/5" />

                        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                            <div className="flex items-center gap-4">

                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 shadow-lg ring-1 ring-white/20 backdrop-blur-sm">

                                    <FolderKanban
                                        size={28}
                                        className="text-white"
                                    />

                                </div>

                                <div>

                                    <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-blue-100">
                                        Manager Workspace
                                    </p>

                                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                        Project Management
                                    </h1>

                                    <p className="mt-1 max-w-2xl text-sm text-blue-100">
                                        Manage assigned projects,
                                        specifications, timelines,
                                        deadlines and project status.
                                    </p>

                                    {currentManager && (
                                        <p className="mt-2 text-xs font-semibold text-blue-100">
                                            Manager:{" "}
                                            {
                                                currentManager.name
                                            }
                                        </p>
                                    )}

                                </div>

                            </div>

                            <div className="flex items-center gap-3">

                                <button
                                    type="button"
                                    onClick={() =>
                                        loadProjects(
                                            true
                                        )
                                    }
                                    disabled={
                                        refreshing
                                    }
                                    className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-bold backdrop-blur-sm transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
                                >

                                    <RefreshCw
                                        size={17}
                                        className={
                                            refreshing
                                                ? "animate-spin"
                                                : ""
                                        }
                                    />

                                    Refresh

                                </button>

                                <div className="w-fit rounded-xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm">

                                    <p className="text-xs font-medium text-blue-100">
                                        Assigned Projects
                                    </p>

                                    <p className="mt-1 text-2xl font-bold">
                                        {
                                            assignedProjects.length
                                        }
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* ==================================================
                        SUCCESS MESSAGE
                    ================================================== */}

                    {successMessage && (
                        <div
                            role="status"
                            className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 px-4 py-4 text-sm font-semibold text-emerald-700 shadow-sm"
                        >

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100">

                                <CheckCircle
                                    size={19}
                                    className="text-emerald-600"
                                />

                            </div>

                            <span>
                                {
                                    successMessage
                                }
                            </span>

                        </div>
                    )}

                    {/* ==================================================
                        ERROR MESSAGE
                    ================================================== */}

                    {errorMessage && (
                        <div
                            role="alert"
                            className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-gradient-to-r from-red-50 to-rose-50 px-4 py-4 text-sm font-semibold text-red-700 shadow-sm"
                        >

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100">

                                <AlertTriangle
                                    size={19}
                                    className="text-red-600"
                                />

                            </div>

                            <span>
                                {errorMessage}
                            </span>

                        </div>
                    )}

                    {/* ==================================================
                        PROJECT STATISTICS
                    ================================================== */}

                    <section className="mb-10">

                        <div className="mb-5 flex items-center justify-between">

                            <div>

                                <h2 className="text-lg font-bold text-slate-800">
                                    Project Overview
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Quick summary of your project portfolio.
                                </p>

                            </div>

                        </div>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

                            {projectStats.map(
                                (
                                    item,
                                    index
                                ) => {
                                    const styles =
                                        [
                                            {
                                                border:
                                                    "border-blue-200",
                                                bg:
                                                    "bg-gradient-to-br from-blue-50 to-indigo-50",
                                                iconBg:
                                                    "bg-blue-600",
                                            },
                                            {
                                                border:
                                                    "border-amber-200",
                                                bg:
                                                    "bg-gradient-to-br from-amber-50 to-orange-50",
                                                iconBg:
                                                    "bg-amber-500",
                                            },
                                            {
                                                border:
                                                    "border-emerald-200",
                                                bg:
                                                    "bg-gradient-to-br from-emerald-50 to-green-50",
                                                iconBg:
                                                    "bg-emerald-600",
                                            },
                                            {
                                                border:
                                                    "border-violet-200",
                                                bg:
                                                    "bg-gradient-to-br from-violet-50 to-purple-50",
                                                iconBg:
                                                    "bg-violet-600",
                                            },
                                        ][
                                            index
                                        ];

                                    return (
                                        <div
                                            key={
                                                item.title
                                            }
                                            className={`overflow-hidden rounded-2xl border ${styles.border} ${styles.bg} shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg`}
                                        >

                                            <div className="h-1.5 bg-gradient-to-r from-current to-transparent opacity-70" />

                                            <div className="p-5">

                                                <div className="flex items-center justify-between">

                                                    <div>

                                                        <p className="text-sm font-semibold text-slate-500">
                                                            {
                                                                item.title
                                                            }
                                                        </p>

                                                        <p className="mt-2 text-3xl font-extrabold text-slate-900">
                                                            {
                                                                item.value
                                                            }
                                                        </p>

                                                    </div>

                                                    <div
                                                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${styles.iconBg} shadow-md`}
                                                    >

                                                        <item.icon
                                                            size={
                                                                23
                                                            }
                                                            className="text-white"
                                                        />

                                                    </div>

                                                </div>

                                            </div>

                                        </div>
                                    );
                                }
                            )}

                        </div>

                    </section>

                    {/* ==================================================
                        ASSIGNED PROJECTS
                    ================================================== */}

                    <section>

                        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                            <div>

                                <div className="flex items-center gap-2">

                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100">

                                        <FolderKanban
                                            size={19}
                                            className="text-indigo-600"
                                        />

                                    </div>

                                    <h2 className="text-xl font-bold text-slate-800">
                                        Assigned Projects
                                    </h2>

                                </div>

                                <p className="mt-2 text-sm text-slate-500">
                                    Projects currently assigned to you.
                                </p>

                            </div>

                            <div className="w-fit rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-blue-50 px-4 py-2.5 text-sm font-bold text-indigo-700 shadow-sm">

                                {
                                    assignedProjects.length
                                }{" "}

                                {assignedProjects.length ===
                                1
                                    ? "Project"
                                    : "Projects"}

                            </div>

                        </div>

                        {/* ==================================================
                            EMPTY STATE
                        ================================================== */}

                        {assignedProjects.length ===
                        0 ? (
                            <div className="rounded-2xl border border-dashed border-indigo-200 bg-gradient-to-br from-white to-indigo-50 px-6 py-16 text-center shadow-sm">

                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100">

                                    <FolderKanban
                                        className="text-indigo-500"
                                        size={32}
                                    />

                                </div>

                                <h3 className="mt-5 text-lg font-bold text-slate-800">
                                    No Assigned Projects
                                </h3>

                                <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                                    You currently have no projects
                                    assigned to you.
                                </p>

                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

                                {assignedProjects.map(
                                    (
                                        project,
                                        projectIndex
                                    ) => {
                                        const statusStyle =
                                            getStatusStyle(
                                                project.status
                                            );

                                        const projectAccent =
                                            projectIndex %
                                                3 ===
                                            0
                                                ? "from-blue-500 via-indigo-500 to-violet-500"
                                                : projectIndex %
                                                      3 ===
                                                  1
                                                ? "from-emerald-500 via-teal-500 to-cyan-500"
                                                : "from-orange-500 via-amber-500 to-yellow-500";

                                        return (
                                            <div
                                                key={
                                                    project.id
                                                }
                                                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl"
                                            >

                                                <div
                                                    className={`h-2 bg-gradient-to-r ${projectAccent}`}
                                                />

                                                <div className="p-5">

                                                    {/* PROJECT TOP */}

                                                    <div className="mb-5 flex items-start justify-between gap-4">

                                                        <div className="min-w-0">

                                                            <div className="mb-2 flex items-center gap-2">

                                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 shadow-sm">

                                                                    <FolderKanban
                                                                        size={
                                                                            18
                                                                        }
                                                                        className="text-white"
                                                                    />

                                                                </div>

                                                                <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">
                                                                    Project
                                                                </span>

                                                            </div>

                                                            <h3 className="text-lg font-bold leading-snug text-slate-900">
                                                                {
                                                                    project.name
                                                                }
                                                            </h3>

                                                        </div>

                                                        <div
                                                            className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${statusStyle.badge}`}
                                                        >

                                                            <span
                                                                className={`h-2 w-2 rounded-full ${statusStyle.dot}`}
                                                            />

                                                            {
                                                                project.status ||
                                                                    "Unknown"
                                                            }

                                                        </div>

                                                    </div>

                                                    {/* PROJECT CARD */}

                                                    <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">

                                                        <ProjectCard
                                                            project={
                                                                project
                                                            }
                                                        />

                                                    </div>

                                                    {/* PROJECT PROGRESS */}

                                                    <div className="mt-5">

                                                        <div className="mb-2 flex items-center justify-between">

                                                            <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                                                                Project Progress
                                                            </span>

                                                            <span className="text-sm font-extrabold text-indigo-600">
                                                                {
                                                                    project.progress
                                                                }
                                                                %
                                                            </span>

                                                        </div>

                                                        <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">

                                                            <div
                                                                className={`h-full rounded-full bg-gradient-to-r ${projectAccent} transition-all duration-500`}
                                                                style={{
                                                                    width: `${Math.min(
                                                                        Math.max(
                                                                            Number(
                                                                                project.progress
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

                                                    {/* PROJECT INFORMATION */}

                                                    <div className="mt-5 grid grid-cols-2 gap-3">

                                                        <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">

                                                            <div className="flex items-center gap-2">

                                                                <CalendarRange
                                                                    size={
                                                                        16
                                                                    }
                                                                    className="text-blue-600"
                                                                />

                                                                <span className="text-xs font-semibold text-blue-700">
                                                                    Start Date
                                                                </span>

                                                            </div>

                                                            <p className="mt-1 text-sm font-bold text-slate-800">
                                                                {
                                                                    formatDate(
                                                                        project.startDate
                                                                    )
                                                                }
                                                            </p>

                                                        </div>

                                                        <div className="rounded-xl border border-orange-100 bg-orange-50 p-3">

                                                            <div className="flex items-center gap-2">

                                                                <CalendarClock
                                                                    size={
                                                                        16
                                                                    }
                                                                    className="text-orange-600"
                                                                />

                                                                <span className="text-xs font-semibold text-orange-700">
                                                                    Deadline
                                                                </span>

                                                            </div>

                                                            <p className="mt-1 text-sm font-bold text-slate-800">
                                                                {
                                                                    formatDate(
                                                                        project.deadline
                                                                    )
                                                                }
                                                            </p>

                                                        </div>

                                                    </div>

                                                    {/* ACTION SECTION */}

                                                    <div className="mt-6 border-t border-slate-100 pt-5">

                                                        <div className="mb-3 flex items-center gap-2">

                                                            <CircleDot
                                                                size={
                                                                    16
                                                                }
                                                                className="text-indigo-500"
                                                            />

                                                            <span className="text-sm font-bold text-slate-700">
                                                                Project Actions
                                                            </span>

                                                        </div>

                                                        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">

                                                            {/* PM-001 */}

                                                            {!project.hasSpecification && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleCreateSpecification(
                                                                            project
                                                                        )
                                                                    }
                                                                    className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 hover:shadow-md"
                                                                >

                                                                    <FilePlus2
                                                                        size={
                                                                            17
                                                                        }
                                                                    />

                                                                    Create Project Specification

                                                                </button>
                                                            )}

                                                            {/* PM-002 */}

                                                            {project.hasSpecification && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleUpdateSpecification(
                                                                            project
                                                                        )
                                                                    }
                                                                    className="group flex items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-bold text-indigo-700 transition hover:-translate-y-0.5 hover:bg-indigo-100 hover:shadow-sm"
                                                                >

                                                                    <FilePenLine
                                                                        size={
                                                                            17
                                                                        }
                                                                    />

                                                                    Update Project Specification

                                                                </button>
                                                            )}

                                                            {/* PM-003 */}

                                                            {project.hasSpecification && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleDeleteSpecification(
                                                                            project
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        project.hasActiveSprint
                                                                    }
                                                                    className={
                                                                        project.hasActiveSprint
                                                                            ? "flex cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-bold text-slate-400"
                                                                            : "flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700 transition hover:-translate-y-0.5 hover:bg-red-100 hover:shadow-sm"
                                                                    }
                                                                >

                                                                    <Trash2
                                                                        size={
                                                                            17
                                                                        }
                                                                    />

                                                                    {project.hasActiveSprint
                                                                        ? "Specification In Use"
                                                                        : "Delete Project Specification"}

                                                                </button>
                                                            )}

                                                            {/* PM-004 */}

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleViewProject(
                                                                        project
                                                                    )
                                                                }
                                                                className="flex items-center justify-center gap-2 rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm font-bold text-cyan-700 transition hover:-translate-y-0.5 hover:bg-cyan-100 hover:shadow-sm"
                                                            >

                                                                <Eye
                                                                    size={
                                                                        17
                                                                    }
                                                                />

                                                                View Assigned Project

                                                            </button>

                                                            {/* PM-005 */}

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleUpdateTimeline(
                                                                        project
                                                                    )
                                                                }
                                                                className="flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 transition hover:-translate-y-0.5 hover:bg-emerald-100 hover:shadow-sm"
                                                            >

                                                                <CalendarRange
                                                                    size={
                                                                        17
                                                                    }
                                                                />

                                                                Update Project Timeline

                                                            </button>

                                                            {/* PM-006 */}

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleUpdateDeadline(
                                                                        project
                                                                    )
                                                                }
                                                                className="flex items-center justify-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700 transition hover:-translate-y-0.5 hover:bg-orange-100 hover:shadow-sm"
                                                            >

                                                                <CalendarClock
                                                                    size={
                                                                        17
                                                                    }
                                                                />

                                                                Set / Update Project Deadline

                                                            </button>

                                                            {/* PM-007 */}

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleManageStatus(
                                                                        project
                                                                    )
                                                                }
                                                                className="flex items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm font-bold text-violet-700 transition hover:-translate-y-0.5 hover:bg-violet-100 hover:shadow-sm"
                                                            >

                                                                <CircleDot
                                                                    size={
                                                                        17
                                                                    }
                                                                />

                                                                Manage Project Status

                                                            </button>

                                                        </div>

                                                    </div>

                                                </div>

                                            </div>
                                        );
                                    }
                                )}

                            </div>
                        )}

                    </section>

                </div>

            </main>

            {/* ============================================================
                PM-001 — CREATE SPECIFICATION
            ============================================================ */}

            {selectedProject &&
                modalType ===
                    "create" && (
                    <CreateProjectSpecificationModal
                        project={
                            selectedProject
                        }
                        currentManager={
                            currentManager
                        }
                        onClose={
                            closeModal
                        }
                        onCreated={
                            handleSpecificationCreated
                        }
                        onError={
                            handleProjectError
                        }
                    />
                )}

            {/* ============================================================
                PM-002 — UPDATE SPECIFICATION
            ============================================================ */}

            {selectedProject &&
                modalType ===
                    "update" && (
                    <UpdateProjectSpecificationModal
                        project={
                            selectedProject
                        }
                        currentManager={
                            currentManager
                        }
                        onClose={
                            closeModal
                        }
                        onUpdated={
                            handleSpecificationUpdated
                        }
                        onError={
                            handleProjectError
                        }
                    />
                )}

            {/* ============================================================
                PM-003 — DELETE SPECIFICATION
            ============================================================ */}

            {selectedProject &&
                modalType ===
                    "delete" && (
                    <DeleteProjectSpecificationModal
                        project={
                            selectedProject
                        }
                        currentManager={
                            currentManager
                        }
                        onClose={
                            closeModal
                        }
                        onDeleted={
                            handleSpecificationDeleted
                        }
                        onError={
                            handleProjectError
                        }
                    />
                )}

            {/* ============================================================
                PM-004 — VIEW ASSIGNED PROJECT
            ============================================================ */}

            {selectedProject &&
                modalType ===
                    "view" && (
                    <ViewAssignedProjectModal
                        project={
                            selectedProject
                        }
                        currentManager={
                            currentManager
                        }
                        onClose={
                            closeModal
                        }
                        onError={
                            handleProjectError
                        }
                    />
                )}

            {/* ============================================================
                PM-005 — UPDATE PROJECT TIMELINE
            ============================================================ */}

            {selectedProject &&
                modalType ===
                    "timeline" && (
                    <UpdateTimelineProjectModal
                        project={
                            selectedProject
                        }
                        currentManager={
                            currentManager
                        }
                        onClose={
                            closeModal
                        }
                        onUpdated={
                            handleTimelineUpdated
                        }
                        onError={
                            handleProjectError
                        }
                    />
                )}

            {/* ============================================================
                PM-006 — SET / UPDATE PROJECT DEADLINE
            ============================================================ */}

            {selectedProject &&
                modalType ===
                    "deadline" && (
                    <SetUpdateProjectDeadlineModal
                        project={
                            selectedProject
                        }
                        currentManager={
                            currentManager
                        }
                        onClose={
                            closeModal
                        }
                        onUpdated={
                            handleDeadlineUpdated
                        }
                        onError={
                            handleProjectError
                        }
                    />
                )}

            {/* ============================================================
                PM-007 — MANAGE PROJECT STATUS
            ============================================================ */}

            {selectedProject &&
                modalType ===
                    "status" && (
                    <ManageProjectStatusModal
                        project={
                            selectedProject
                        }
                        currentManager={
                            currentManager
                        }
                        onClose={
                            closeModal
                        }
                        onUpdated={
                            handleStatusUpdated
                        }
                        onError={
                            handleProjectError
                        }
                    />
                )}

        </div>
    );
}

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default ProjectManagement;
