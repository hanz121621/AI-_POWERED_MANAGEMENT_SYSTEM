
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
    FileText,
    Lightbulb,
    Users,
    TrendingUp,
    CalendarDays,
} from "lucide-react";

// ============================================================
// SERVICES
// ============================================================

import AiRecommendationsModal from "../../components/manager/project/AiRecommendationsModal";
import AiBottlenecksModal from "../../components/manager/project/AiBottlenecksModal";
import AiProjectSummaryModal from "../../components/manager/project/AiProjectSummaryModal";
import AiTeamPerformanceModal from "../../components/manager/project/AiTeamPerformanceModal";
import AiProgressPredictionModal from "../../components/manager/project/AiProgressPredictionModal";
import AiSprintPlanningModal from "../../components/manager/project/AiSprintPlanningModal";
import AiDeadlinePredictionModal from "../../components/manager/project/AiDeadlinePredictionModal";

import { getTeams } from "../../services/teamService";

import {
    getMyProjects,
    getProjectSpecification,
} from "../../services/projectService";

import { getCurrentUser } from "../../services/authService";

// ============================================================
// PROJECT COMPONENTS
// ============================================================

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

    const [currentManager, setCurrentManager] = useState(null);

    // ========================================================
    // PROJECTS
    // ========================================================

    const [projects, setProjects] = useState([]);
    const [teams, setTeams] = useState([]);

    // ========================================================
    // AI MODAL STATE
    // ========================================================

    const [summaryOpen, setSummaryOpen] = useState(false);
    const [summaryProject, setSummaryProject] = useState(null);

    const [recommendationsOpen, setRecommendationsOpen] = useState(false);
    const [recommendationsProject, setRecommendationsProject] = useState(null);

    const [bottlenecksOpen, setBottlenecksOpen] = useState(false);
    const [bottlenecksProject, setBottlenecksProject] = useState(null);

    const [deadlineOpen, setDeadlineOpen] = useState(false);
    const [deadlineProject, setDeadlineProject] = useState(null);

    const [teamPerformanceOpen, setTeamPerformanceOpen] = useState(false);
    const [teamPerformanceProject, setTeamPerformanceProject] = useState(null);

    const [progressPredictionOpen, setProgressPredictionOpen] = useState(false);
    const [progressPredictionProject, setProgressPredictionProject] =
        useState(null);

    const [sprintPlanningOpen, setSprintPlanningOpen] = useState(false);
    const [sprintPlanningProject, setSprintPlanningProject] = useState(null);

    // ========================================================
    // LOADING
    // ========================================================

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // ========================================================
    // PROJECT ACTION MODAL STATE
    // ========================================================

    const [selectedProject, setSelectedProject] = useState(null);
    const [modalType, setModalType] = useState(null);

    // ========================================================
    // MESSAGES
    // ========================================================

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

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

    const handleProjectError = useCallback((message) => {
        setSuccessMessage("");
        setErrorMessage(
            message || "An unexpected error occurred."
        );
    }, []);

    // ========================================================
    // FORMAT DATE
    // ========================================================

    const formatDate = useCallback((value) => {
        if (!value) {
            return "Not set";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return String(value);
        }

        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    }, []);

    // ========================================================
    // NORMALIZE PROJECT
    // ========================================================

    const normalizeManagerProject = useCallback((project) => {
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

            progress: Number(
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
                project.teamName ??
                project.team ??
                project.team?.name ??
                "No team assigned",

            teamName:
                project.teamName ??
                project.TeamName ??
                project.team?.name ??
                "",

            teamMemberCount:
                project.teamMemberCount ??
                project.memberCount ??
                project.MemberCount ??
                project.team?.memberCount ??
                project.team?.members?.length ??
                0,

            hasSpecification: Boolean(
                project.hasSpecification ??
                    project.specification ??
                    false
            ),

            specification:
                project.specification ??
                null,

            hasActiveSprint: Boolean(
                project.hasActiveSprint ??
                    project.activeSprint ??
                    false
            ),
        };
    }, []);

    // ========================================================
    // LOAD CURRENT MANAGER
    // ========================================================

    const loadCurrentManager = useCallback(async () => {
        try {
            const user = await getCurrentUser();

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

                const apiProjects = await getMyProjects();

                const normalizedProjects =
                    Array.isArray(apiProjects)
                        ? apiProjects
                              .map(normalizeManagerProject)
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

                                    if (status === 404) {
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

                // ------------------------------------------------
                // LOAD TEAMS
                // ------------------------------------------------

                try {
                    const teamsResult = await getTeams();

                    const teamsData = Array.isArray(
                        teamsResult
                    )
                        ? teamsResult
                        : Array.isArray(
                              teamsResult?.data
                          )
                        ? teamsResult.data
                        : [];

                    setTeams(teamsData);
                } catch (error) {
                    console.error(
                        "LOAD TEAMS ERROR:",
                        error
                    );
                }
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

                // ------------------------------------------------
                // LOAD TEAMS
                // ------------------------------------------------

                try {
                    const teamsResult =
                        await getTeams();

                    const teamsData =
                        Array.isArray(
                            teamsResult
                        )
                            ? teamsResult
                            : Array.isArray(
                                  teamsResult?.data
                              )
                            ? teamsResult.data
                            : [];

                    if (mounted) {
                        setTeams(teamsData);
                    }
                } catch (error) {
                    console.error(
                        "LOAD TEAMS ERROR (INITIAL):",
                        error
                    );
                }
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
    // ENRICH PROJECTS WITH TEAM MEMBER COUNTS
    // ========================================================

    useEffect(() => {
        if (
            projects.length === 0 ||
            teams.length === 0
        ) {
            return;
        }

        setProjects((currentProjects) =>
            currentProjects.map((project) => {
                const matchingTeam =
                    teams.find(
                        (team) =>
                            String(team?.id) ===
                                String(
                                    project?.teamId
                                ) ||
                            String(
                                team?.teamId
                            ) ===
                                String(
                                    project?.teamId
                                ) ||
                            String(
                                team?.name
                            ) ===
                                String(
                                    project?.teamName
                                ) ||
                            String(
                                team?.name
                            ) ===
                                String(
                                    project?.team
                                )
                    );

                if (!matchingTeam) {
                    return project;
                }

                const memberCount =
                    matchingTeam?.memberCount ??
                    matchingTeam?.members
                        ?.length ??
                    0;

                const teamName =
                    matchingTeam?.name ||
                    project?.teamName ||
                    project?.team ||
                    "No team assigned";

                return {
                    ...project,
                    teamMemberCount:
                        memberCount,
                    team: teamName,
                    teamName: teamName,
                };
            })
        );
    }, [projects.length, teams]);

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
    }, [projects, currentManager]);

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
    // CLOSE PROJECT MODAL
    // ========================================================

    const closeModal = useCallback(() => {
        setSelectedProject(null);
        setModalType(null);
    }, []);

    // ========================================================
    // FIND PROJECT
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

    // Keep helper available for future project actions.
    void findProject;

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
    // AI-008: PROJECT SUMMARY
    // ========================================================

    const handleOpenSummary =
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
                        "You are not authorised to view this project's AI summary."
                    );
                    return;
                }

                setSummaryProject(project);
                setSummaryOpen(true);
            },
            [
                clearMessages,
                handleProjectError,
                isCurrentManagerProject,
            ]
        );

    // ========================================================
    // AI-003: RECOMMENDATIONS
    // ========================================================

    const handleOpenRecommendations =
        useCallback((project) => {
            setRecommendationsProject(project);
            setRecommendationsOpen(true);
        }, []);

    // ========================================================
    // AI-009: BOTTLENECKS
    // ========================================================

    const handleOpenBottlenecks =
        useCallback((project) => {
            setBottlenecksProject(project);
            setBottlenecksOpen(true);
        }, []);

    // ========================================================
    // AI-004: TEAM PERFORMANCE
    // ========================================================

    const handleOpenTeamPerformance =
        useCallback((project) => {
            setTeamPerformanceProject(project);
            setTeamPerformanceOpen(true);
        }, []);

    // ========================================================
    // AI-005: PROGRESS PREDICTION
    // ========================================================

    const handleOpenProgressPrediction =
        useCallback((project) => {
            setProgressPredictionProject(
                project
            );
            setProgressPredictionOpen(true);
        }, []);

    // ========================================================
    // AI-007: SPRINT PLANNING
    // ========================================================

    const handleOpenSprintPlanning =
        useCallback((project) => {
            setSprintPlanningProject(project);
            setSprintPlanningOpen(true);
        }, []);

    // ========================================================
    // AI DEADLINE PREDICTION
    // ========================================================

    const handleOpenDeadline =
        useCallback((project) => {
            setDeadlineProject(project);
            setDeadlineOpen(true);
        }, []);

    // ========================================================
    // PM-001: CREATE SPECIFICATION
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
    // PM-002: UPDATE SPECIFICATION
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
    // PM-003: DELETE SPECIFICATION
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
    // PM-004: VIEW PROJECT
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
    // PM-005: UPDATE TIMELINE
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
    // PM-006: UPDATE DEADLINE
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
    // PM-007: MANAGE STATUS
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
    // PROJECT STATUS
    // ========================================================

    const getStatusStyle = useCallback(
        (status) => {
            switch (
                String(status || "")
                    .toLowerCase()
            ) {
                case "active":
                    return {
                        badge:
                            "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
                        dot: "bg-emerald-500",
                    };

                case "planning":
                    return {
                        badge:
                            "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
                        dot: "bg-amber-500",
                    };

                case "completed":
                    return {
                        badge:
                            "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-300",
                        dot: "bg-sky-500",
                    };

                case "on hold":
                    return {
                        badge:
                            "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950/40 dark:text-orange-300",
                        dot: "bg-orange-500",
                    };

                case "cancelled":
                    return {
                        badge:
                            "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300",
                        dot: "bg-red-500",
                    };

                case "archived":
                    return {
                        badge:
                            "border-border bg-muted text-muted-foreground",
                        dot: "bg-muted-foreground",
                    };

                default:
                    return {
                        badge:
                            "border-border bg-muted text-muted-foreground",
                        dot: "bg-muted-foreground",
                    };
            }
        },
        []
    );

    // ========================================================
    // LOADING STATE
    // ========================================================

    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center bg-background text-foreground">
                <div className="text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                        <Loader2
                            size={28}
                            className="animate-spin"
                        />
                    </div>

                    <h2 className="mt-5 text-lg font-semibold text-foreground">
                        Loading Project Management
                    </h2>

                    <p className="mt-2 text-sm text-muted-foreground">
                        Loading your assigned projects...
                    </p>
                </div>
            </div>
        );
    }

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="min-h-full bg-background text-foreground">
            <div className="mx-auto w-full max-w-[1800px]">

                {/* ==================================================
                    PAGE HEADER
                ================================================== */}

                <section className="mb-6 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex min-w-0 items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                                <FolderKanban size={24} />
                            </div>

                            <div className="min-w-0">
                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Manager Workspace
                                </p>

                                <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                    Project Management
                                </h1>

                                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                                    Manage assigned projects,
                                    specifications, timelines,
                                    deadlines and project status.
                                </p>

                                {currentManager && (
                                    <p className="mt-2 text-sm font-medium text-muted-foreground">
                                        Manager:{" "}
                                        <span className="text-foreground">
                                            {currentManager.name}
                                        </span>
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex shrink-0 flex-wrap items-center gap-3">
                            <button
                                type="button"
                                onClick={() =>
                                    loadProjects(true)
                                }
                                disabled={refreshing}
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <RefreshCw
                                    size={16}
                                    className={
                                        refreshing
                                            ? "animate-spin"
                                            : ""
                                    }
                                />

                                Refresh
                            </button>

                            <div className="rounded-lg border border-border bg-muted/50 px-4 py-2.5">
                                <p className="text-xs text-muted-foreground">
                                    Assigned Projects
                                </p>

                                <p className="mt-0.5 text-xl font-bold text-foreground">
                                    {
                                        assignedProjects.length
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ==================================================
                    SUCCESS MESSAGE
                ================================================== */}

                {successMessage && (
                    <div
                        role="status"
                        className="mb-6 flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300"
                    >
                        <CheckCircle
                            size={18}
                            className="shrink-0"
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
                        className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300"
                    >
                        <AlertTriangle
                            size={18}
                            className="shrink-0"
                        />

                        <span>
                            {errorMessage}
                        </span>
                    </div>
                )}

                {/* ==================================================
                    PROJECT STATISTICS
                ================================================== */}

                <section className="mb-8">
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-foreground">
                            Project Overview
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Quick summary of your project portfolio.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {projectStats.map(
                            (item) => {
                                const Icon =
                                    item.icon;

                                return (
                                    <div
                                        key={
                                            item.title
                                        }
                                        className="rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                                    >
                                        <div className="flex items-center justify-between gap-4">
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">
                                                    {
                                                        item.title
                                                    }
                                                </p>

                                                <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                                                    {
                                                        item.value
                                                    }
                                                </p>
                                            </div>

                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-muted text-primary">
                                                <Icon
                                                    size={
                                                        21
                                                    }
                                                />
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
                    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <FolderKanban
                                    size={20}
                                    className="text-primary"
                                />

                                <h2 className="text-xl font-semibold text-foreground">
                                    Assigned Projects
                                </h2>
                            </div>

                            <p className="mt-1.5 text-sm text-muted-foreground">
                                Projects currently assigned to you.
                            </p>
                        </div>

                        <div className="w-fit rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm font-medium text-muted-foreground">
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
                        <div className="rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                                <FolderKanban
                                    size={28}
                                />
                            </div>

                            <h3 className="mt-5 text-lg font-semibold text-foreground">
                                No Assigned Projects
                            </h3>

                            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                                You currently have no projects assigned to you.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                            {assignedProjects.map(
                                (project) => {
                                    const statusStyle =
                                        getStatusStyle(
                                            project.status
                                        );

                                    const progress =
                                        Math.min(
                                            Math.max(
                                                Number(
                                                    project.progress
                                                ) || 0,
                                                0
                                            ),
                                            100
                                        );

                                    return (
                                        <article
                                            key={
                                                project.id
                                            }
                                            className="overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-200 hover:shadow-md"
                                        >
                                            {/* PROJECT HEADER */}

                                            <div className="border-b border-border p-5">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex min-w-0 items-start gap-3">
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-primary">
                                                            <FolderKanban
                                                                size={
                                                                    20
                                                                }
                                                            />
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                                                Project
                                                            </p>

                                                            <h3 className="mt-1 truncate text-lg font-semibold text-foreground">
                                                                {
                                                                    project.name
                                                                }
                                                            </h3>

                                                            {project.description && (
                                                                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                                                                    {
                                                                        project.description
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div
                                                        className={`flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyle.badge}`}
                                                    >
                                                        <span
                                                            className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`}
                                                        />

                                                        {project.status ||
                                                            "Unknown"}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* PROJECT INFORMATION */}

                                            <div className="p-5">
                                                <div className="rounded-lg border border-border bg-muted/30 p-3">
                                                    <ProjectCard
                                                        project={
                                                            project
                                                        }
                                                    />
                                                </div>

                                                {/* PROGRESS */}

                                                <div className="mt-5">
                                                    <div className="mb-2 flex items-center justify-between">
                                                        <span className="text-sm font-medium text-muted-foreground">
                                                            Project Progress
                                                        </span>

                                                        <span className="text-sm font-semibold text-foreground">
                                                            {
                                                                progress
                                                            }
                                                            %
                                                        </span>
                                                    </div>

                                                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                                                        <div
                                                            className="h-full rounded-full bg-primary transition-all duration-500"
                                                            style={{
                                                                width: `${progress}%`,
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                                {/* PROJECT META */}

                                                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                                    <div className="rounded-lg border border-border bg-muted/30 p-3">
                                                        <div className="flex items-center gap-2">
                                                            <CalendarRange
                                                                size={
                                                                    16
                                                                }
                                                                className="text-muted-foreground"
                                                            />

                                                            <span className="text-xs font-medium text-muted-foreground">
                                                                Start Date
                                                            </span>
                                                        </div>

                                                        <p className="mt-1 text-sm font-semibold text-foreground">
                                                            {formatDate(
                                                                project.startDate
                                                            )}
                                                        </p>
                                                    </div>

                                                    <div className="rounded-lg border border-border bg-muted/30 p-3">
                                                        <div className="flex items-center gap-2">
                                                            <CalendarClock
                                                                size={
                                                                    16
                                                                }
                                                                className="text-muted-foreground"
                                                            />

                                                            <span className="text-xs font-medium text-muted-foreground">
                                                                Deadline
                                                            </span>
                                                        </div>

                                                        <p className="mt-1 text-sm font-semibold text-foreground">
                                                            {formatDate(
                                                                project.deadline
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* TEAM */}

                                                <div className="mt-3 flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2.5">
                                                    <div className="flex items-center gap-2">
                                                        <Users
                                                            size={
                                                                16
                                                            }
                                                            className="text-muted-foreground"
                                                        />

                                                        <span className="text-sm text-muted-foreground">
                                                            Team
                                                        </span>
                                                    </div>

                                                    <span className="text-sm font-medium text-foreground">
                                                        {project.team ||
                                                            project.teamName ||
                                                            "No team assigned"}
                                                    </span>
                                                </div>

                                                {/* ==================================================
                                                    ACTIONS
                                                ================================================== */}

                                                <div className="mt-6 border-t border-border pt-5">
                                                    <div className="mb-3 flex items-center gap-2">
                                                        <CircleDot
                                                            size={
                                                                16
                                                            }
                                                            className="text-muted-foreground"
                                                        />

                                                        <span className="text-sm font-semibold text-foreground">
                                                            Project Actions
                                                        </span>
                                                    </div>

                                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">

                                                        {/* AI SUMMARY */}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleOpenSummary(
                                                                    project
                                                                )
                                                            }
                                                            className="flex min-h-10 items-center justify-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                                                        >
                                                            <FileText
                                                                size={
                                                                    16
                                                                }
                                                            />

                                                            AI Project Summary
                                                        </button>

                                                        {/* AI RECOMMENDATIONS */}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleOpenRecommendations(
                                                                    project
                                                                )
                                                            }
                                                            className="flex min-h-10 items-center justify-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                                                        >
                                                            <Lightbulb
                                                                size={
                                                                    16
                                                                }
                                                            />

                                                            AI Recommendations
                                                        </button>

                                                        {/* AI BOTTLENECKS */}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleOpenBottlenecks(
                                                                    project
                                                                )
                                                            }
                                                            className="flex min-h-10 items-center justify-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                                                        >
                                                            <AlertTriangle
                                                                size={
                                                                    16
                                                                }
                                                            />

                                                            AI Bottlenecks
                                                        </button>

                                                        {/* AI DEADLINE */}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleOpenDeadline(
                                                                    project
                                                                )
                                                            }
                                                            className="flex min-h-10 items-center justify-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                                                        >
                                                            <CalendarClock
                                                                size={
                                                                    16
                                                                }
                                                            />

                                                            AI Deadline Prediction
                                                        </button>

                                                        {/* AI TEAM PERFORMANCE */}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleOpenTeamPerformance(
                                                                    project
                                                                )
                                                            }
                                                            className="flex min-h-10 items-center justify-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                                                        >
                                                            <Users
                                                                size={
                                                                    16
                                                                }
                                                            />

                                                            AI Team Performance
                                                        </button>

                                                        {/* AI PROGRESS */}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleOpenProgressPrediction(
                                                                    project
                                                                )
                                                            }
                                                            className="flex min-h-10 items-center justify-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                                                        >
                                                            <TrendingUp
                                                                size={
                                                                    16
                                                                }
                                                            />

                                                            AI Progress Prediction
                                                        </button>

                                                        {/* AI SPRINT */}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleOpenSprintPlanning(
                                                                    project
                                                                )
                                                            }
                                                            className="flex min-h-10 items-center justify-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                                                        >
                                                            <CalendarDays
                                                                size={
                                                                    16
                                                                }
                                                            />

                                                            AI Sprint Planning
                                                        </button>

                                                        {/* CREATE SPECIFICATION */}

                                                        {!project.hasSpecification && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleCreateSpecification(
                                                                        project
                                                                    )
                                                                }
                                                                className="flex min-h-10 items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                                                            >
                                                                <FilePlus2
                                                                    size={
                                                                        16
                                                                    }
                                                                />

                                                                Create Project Specification
                                                            </button>
                                                        )}

                                                        {/* UPDATE SPECIFICATION */}

                                                        {project.hasSpecification && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleUpdateSpecification(
                                                                        project
                                                                    )
                                                                }
                                                                className="flex min-h-10 items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                                                            >
                                                                <FilePenLine
                                                                    size={
                                                                        16
                                                                    }
                                                                />

                                                                Update Project Specification
                                                            </button>
                                                        )}

                                                        {/* DELETE SPECIFICATION */}

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
                                                                className="flex min-h-10 items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                                                            >
                                                                <Trash2
                                                                    size={
                                                                        16
                                                                    }
                                                                />

                                                                {project.hasActiveSprint
                                                                    ? "Specification In Use"
                                                                    : "Delete Project Specification"}
                                                            </button>
                                                        )}

                                                        {/* VIEW PROJECT */}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleViewProject(
                                                                    project
                                                                )
                                                            }
                                                            className="flex min-h-10 items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                                                        >
                                                            <Eye
                                                                size={
                                                                    16
                                                                }
                                                            />

                                                            View Assigned Project
                                                        </button>

                                                        {/* UPDATE TIMELINE */}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleUpdateTimeline(
                                                                    project
                                                                )
                                                            }
                                                            className="flex min-h-10 items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                                                        >
                                                            <CalendarRange
                                                                size={
                                                                    16
                                                                }
                                                            />

                                                            Update Project Timeline
                                                        </button>

                                                        {/* UPDATE DEADLINE */}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleUpdateDeadline(
                                                                    project
                                                                )
                                                            }
                                                            className="flex min-h-10 items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                                                        >
                                                            <CalendarClock
                                                                size={
                                                                    16
                                                                }
                                                            />

                                                            Set / Update Project Deadline
                                                        </button>

                                                        {/* MANAGE STATUS */}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleManageStatus(
                                                                    project
                                                                )
                                                            }
                                                            className="flex min-h-10 items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                                                        >
                                                            <CircleDot
                                                                size={
                                                                    16
                                                                }
                                                            />

                                                            Manage Project Status
                                                        </button>
                                                    </div>
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

            {/* ============================================================
                PM-001 — CREATE SPECIFICATION
            ============================================================ */}

            {selectedProject &&
                modalType === "create" && (
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
                modalType === "update" && (
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
                modalType === "delete" && (
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
                modalType === "view" && (
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
                modalType === "timeline" && (
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
                modalType === "deadline" && (
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
                modalType === "status" && (
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

            {/* ============================================================
                AI-008 — AI PROJECT SUMMARY
            ============================================================ */}

            {summaryOpen &&
                summaryProject && (
                    <AiProjectSummaryModal
                        project={
                            summaryProject
                        }
                        currentManager={
                            currentManager
                        }
                        onClose={() =>
                            setSummaryOpen(
                                false
                            )
                        }
                        onError={(msg) => {
                            handleProjectError(
                                msg
                            );
                            setSummaryOpen(
                                false
                            );
                        }}
                    />
                )}

            {/* ============================================================
                AI-003 — AI RECOMMENDATIONS
            ============================================================ */}

            {recommendationsOpen &&
                recommendationsProject && (
                    <AiRecommendationsModal
                        project={
                            recommendationsProject
                        }
                        currentManager={
                            currentManager
                        }
                        onClose={() =>
                            setRecommendationsOpen(
                                false
                            )
                        }
                        onError={(msg) => {
                            handleProjectError(
                                msg
                            );
                            setRecommendationsOpen(
                                false
                            );
                        }}
                    />
                )}

            {/* ============================================================
                AI DEADLINE PREDICTION
            ============================================================ */}

            {deadlineOpen &&
                deadlineProject && (
                    <AiDeadlinePredictionModal
                        project={
                            deadlineProject
                        }
                        currentManager={
                            currentManager
                        }
                        onClose={() =>
                            setDeadlineOpen(
                                false
                            )
                        }
                        onError={(msg) => {
                            handleProjectError(
                                msg
                            );
                            setDeadlineOpen(
                                false
                            );
                        }}
                    />
                )}

            {/* ============================================================
                AI-004 — AI TEAM PERFORMANCE
            ============================================================ */}

            {teamPerformanceOpen &&
                teamPerformanceProject && (
                    <AiTeamPerformanceModal
                        project={
                            teamPerformanceProject
                        }
                        currentManager={
                            currentManager
                        }
                        onClose={() =>
                            setTeamPerformanceOpen(
                                false
                            )
                        }
                        onError={(msg) => {
                            handleProjectError(
                                msg
                            );
                            setTeamPerformanceOpen(
                                false
                            );
                        }}
                    />
                )}

            {/* ============================================================
                AI-005 — AI PROGRESS PREDICTION
            ============================================================ */}

            {progressPredictionOpen &&
                progressPredictionProject && (
                    <AiProgressPredictionModal
                        project={
                            progressPredictionProject
                        }
                        currentManager={
                            currentManager
                        }
                        onClose={() =>
                            setProgressPredictionOpen(
                                false
                            )
                        }
                        onError={(msg) => {
                            handleProjectError(
                                msg
                            );
                            setProgressPredictionOpen(
                                false
                            );
                        }}
                    />
                )}

            {/* ============================================================
                AI-007 — AI SPRINT PLANNING
            ============================================================ */}

            {sprintPlanningOpen &&
                sprintPlanningProject && (
                    <AiSprintPlanningModal
                        project={
                            sprintPlanningProject
                        }
                        currentManager={
                            currentManager
                        }
                        onClose={() =>
                            setSprintPlanningOpen(
                                false
                            )
                        }
                        onError={(msg) => {
                            handleProjectError(
                                msg
                            );
                            setSprintPlanningOpen(
                                false
                            );
                        }}
                    />
                )}

            {/* ============================================================
                AI-009 — AI BOTTLENECKS
            ============================================================ */}

            {bottlenecksOpen &&
                bottlenecksProject && (
                    <AiBottlenecksModal
                        project={
                            bottlenecksProject
                        }
                        currentManager={
                            currentManager
                        }
                        onClose={() =>
                            setBottlenecksOpen(
                                false
                            )
                        }
                        onError={(msg) => {
                            handleProjectError(
                                msg
                            );
                            setBottlenecksOpen(
                                false
                            );
                        }}
                    />
                )}
        </div>
    );
}

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default ProjectManagement;