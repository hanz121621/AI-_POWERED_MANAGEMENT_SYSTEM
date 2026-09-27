import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    FolderKanban,
    CheckCircle2,
    Clock3,
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
    Sparkles,
    ArrowRight,
    Settings2,
} from "lucide-react";

// ============================================================
// AI MODALS
// ============================================================

import AiRecommendationsModal from "../../components/manager/project/AiRecommendationsModal";
import AiBottlenecksModal from "../../components/manager/project/AiBottlenecksModal";
import AiProjectSummaryModal from "../../components/manager/project/AiProjectSummaryModal";
import AiTeamPerformanceModal from "../../components/manager/project/AiTeamPerformanceModal";
import AiProgressPredictionModal from "../../components/manager/project/AiProgressPredictionModal";
import AiSprintPlanningModal from "../../components/manager/project/AiSprintPlanningModal";
import AiDeadlinePredictionModal from "../../components/manager/project/AiDeadlinePredictionModal";

// ============================================================
// PROJECT / MANAGER MODALS
// ============================================================

import CreateProjectSpecificationModal from "../../components/manager/project/CreateProjectSpecificationModal";
import UpdateProjectSpecificationModal from "../../components/manager/project/UpdateProjectSpecificationModal";
import DeleteProjectSpecificationModal from "../../components/manager/project/DeleteProjectSpecificationModal";
import ViewAssignedProjectModal from "../../components/manager/project/ViewAssignedProjectModal";
import UpdateTimelineProjectModal from "../../components/manager/project/UpdateTimelineProjectModal";
import SetUpdateProjectDeadlineModal from "../../components/manager/project/SetUpdateProjectDeadlineModal";
import ManageProjectStatusModal from "../../components/manager/project/ManageProjectStatusModal";

// ============================================================
// UI
// ============================================================

import { Button } from "@/components/ui/button";

// ============================================================
// SERVICES
// ============================================================

import {
    getMyProjects,
    getProjectSpecification,
} from "../../services/projectService";

import { getTeams } from "../../services/teamService";

import {
    getCurrentUser,
    getAllUsers,
} from "../../services/authService";

// ============================================================
// HELPERS
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

    if (Array.isArray(response?.results)) {
        return response.results;
    }

    if (Array.isArray(response?.data?.results)) {
        return response.data.results;
    }

    return [];
};

const getEntityId = (entity) => {
    if (!entity) {
        return null;
    }

    return (
        entity.id ??
        entity.userId ??
        entity.teamId ??
        entity.projectId ??
        entity.Id ??
        entity.UserId ??
        entity.TeamId ??
        entity.ProjectId ??
        null
    );
};

const getEntityName = (entity, fallback = null) => {
    if (!entity) {
        return fallback;
    }

    return (
        entity.name ??
        entity.fullName ??
        entity.teamName ??
        entity.projectName ??
        entity.title ??
        entity.Name ??
        entity.FullName ??
        entity.TeamName ??
        entity.ProjectName ??
        entity.Title ??
        fallback
    );
};

const normalizeId = (value) => {
    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value)
        .trim()
        .toLowerCase();
};

const getErrorMessage = (
    error,
    fallback = "An unexpected error occurred."
) => {
    const responseData =
        error?.response?.data;

    if (typeof responseData === "string") {
        return responseData;
    }

    if (responseData?.message) {
        return responseData.message;
    }

    if (responseData?.title) {
        return responseData.title;
    }

    if (responseData?.error) {
        return responseData.error;
    }

    if (responseData?.errors) {
        if (Array.isArray(responseData.errors)) {
            return responseData.errors.join(", ");
        }

        if (
            typeof responseData.errors ===
            "object"
        ) {
            return Object.values(
                responseData.errors
            )
                .flat()
                .join(", ");
        }
    }

    return (
        error?.message ||
        fallback
    );
};

const getProjectStatus = (project) => {
    return String(
        project?.statusName ??
            project?.status ??
            project?.StatusName ??
            project?.Status ??
            ""
    )
        .trim()
        .toLowerCase();
};

const getProjectProgress = (project) => {
    const value = Number(
        project?.progress ??
            project?.Progress ??
            0
    );

    if (Number.isNaN(value)) {
        return 0;
    }

    return Math.min(
        100,
        Math.max(0, value)
    );
};

const formatDate = (dateValue) => {
    if (!dateValue) {
        return "Not set";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "Not set";
    }

    return date.toLocaleDateString(
        undefined,
        {
            year: "numeric",
            month: "short",
            day: "numeric",
        }
    );
};

// ============================================================
// STATUS STYLE
// ============================================================

const getStatusStyle = (status) => {
    const normalized =
        String(status || "")
            .trim()
            .toLowerCase();

    if (
        normalized.includes("complete") ||
        normalized.includes("done")
    ) {
        return {
            container:
                "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
            dot: "bg-emerald-500",
        };
    }

    if (
        normalized.includes("active") ||
        normalized.includes("progress") ||
        normalized.includes("ongoing")
    ) {
        return {
            container:
                "bg-primary/10 text-primary border border-primary/20",
            dot: "bg-primary",
        };
    }

    if (
        normalized.includes("hold") ||
        normalized.includes("blocked") ||
        normalized.includes("planning")
    ) {
        return {
            container:
                "bg-amber-500/10 text-amber-600 border border-amber-500/20",
            dot: "bg-amber-500",
        };
    }

    if (
        normalized.includes("cancel") ||
        normalized.includes("archive")
    ) {
        return {
            container:
                "bg-destructive/10 text-destructive border border-destructive/20",
            dot: "bg-destructive",
        };
    }

    return {
        container:
            "bg-muted text-muted-foreground border border-border",
        dot: "bg-muted-foreground",
    };
};

// ============================================================
// NORMALIZE PROJECT
// ============================================================

const normalizeManagerProject = (
    project = {}
) => {
    const team =
        project.team ??
        project.Team ??
        null;

    const manager =
        project.manager ??
        project.Manager ??
        null;

    const teamLeader =
        project.teamLeader ??
        project.TeamLeader ??
        null;

    const projectId =
        project.id ??
        project.projectId ??
        project.Id ??
        project.ProjectId ??
        null;

    const specification =
        project.specification ??
        project.Specification ??
        null;

    const explicitMemberCount =
        project.teamMemberCount ??
        project.memberCount ??
        project.TeamMemberCount ??
        project.MemberCount ??
        null;

    const calculatedMemberCount =
        Array.isArray(team?.members)
            ? team.members.length
            : 0;

    return {
        ...project,

        id: projectId,

        projectId,

        name:
            project.name ??
            project.projectName ??
            project.Name ??
            project.ProjectName ??
            "Unnamed Project",

        description:
            project.description ??
            project.Description ??
            "",

        status:
            project.statusName ??
            project.status ??
            project.StatusName ??
            project.Status ??
            "Planning",

        statusName:
            project.statusName ??
            project.status ??
            project.StatusName ??
            project.Status ??
            "Planning",

        progress: getProjectProgress(
            project
        ),

        startDate:
            project.startDate ??
            project.StartDate ??
            null,

        deadline:
            project.deadline ??
            project.Deadline ??
            project.endDate ??
            project.EndDate ??
            null,

        managerId:
            project.managerId ??
            project.ManagerId ??
            getEntityId(manager) ??
            null,

        managerName:
            project.managerName ??
            project.ManagerName ??
            project.managerFullName ??
            project.ManagerFullName ??
            manager?.fullName ??
            manager?.name ??
            manager?.FullName ??
            null,

        teamId:
            project.teamId ??
            project.TeamId ??
            getEntityId(team) ??
            null,

        teamName:
            project.teamName ??
            project.TeamName ??
            team?.name ??
            team?.teamName ??
            team?.Name ??
            null,

        teamLeaderId:
            project.teamLeaderId ??
            project.TeamLeaderId ??
            getEntityId(teamLeader) ??
            null,

        teamLeaderName:
            project.teamLeaderName ??
            project.TeamLeaderName ??
            teamLeader?.fullName ??
            teamLeader?.name ??
            teamLeader?.FullName ??
            null,

        teamMemberCount:
            explicitMemberCount ??
            calculatedMemberCount,

        tasks:
            project.tasks ??
            project.taskCount ??
            project.Tasks ??
            project.TaskCount ??
            0,

        activeTasks:
            project.activeTasks ??
            project.ActiveTasks ??
            0,

        sprints:
            project.sprints ??
            project.sprintCount ??
            project.Sprints ??
            project.SprintCount ??
            0,

        createdAt:
            project.createdAt ??
            project.CreatedAt ??
            null,

        updatedAt:
            project.updatedAt ??
            project.UpdatedAt ??
            null,

        completedAt:
            project.completedAt ??
            project.CompletedAt ??
            null,

        completionNote:
            project.completionNote ??
            project.CompletionNote ??
            "",

        aiRiskCount:
            project.aiRiskCount ??
            project.AIRiskCount ??
            project.riskCount ??
            project.RiskCount ??
            0,

        hasSpecification:
            Boolean(
                project.hasSpecification ??
                    project.HasSpecification ??
                    specification
            ),

        specification,

        hasActiveSprint:
            Boolean(
                project.hasActiveSprint ??
                    project.HasActiveSprint
            ),
    };
};

// ============================================================
// MAIN COMPONENT
// ============================================================

function ProjectManagement() {
    // ========================================================
    // MANAGER
    // ========================================================

    const [
        currentManager,
        setCurrentManager,
    ] = useState(null);

    // ========================================================
    // DATA
    // ========================================================

    const [projects, setProjects] =
        useState([]);

    const [users, setUsers] =
        useState([]);

    const [teams, setTeams] =
        useState([]);

    // ========================================================
    // LOADING
    // ========================================================

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    // ========================================================
    // MESSAGES
    // ========================================================

    const [
        successMessage,
        setSuccessMessage,
    ] = useState("");

    const [
        errorMessage,
        setErrorMessage,
    ] = useState("");

    // ========================================================
    // AI MODAL STATE
    // ========================================================

    const [
        summaryOpen,
        setSummaryOpen,
    ] = useState(false);

    const [
        summaryProject,
        setSummaryProject,
    ] = useState(null);

    const [
        recommendationsOpen,
        setRecommendationsOpen,
    ] = useState(false);

    const [
        recommendationsProject,
        setRecommendationsProject,
    ] = useState(null);

    const [
        bottlenecksOpen,
        setBottlenecksOpen,
    ] = useState(false);

    const [
        bottlenecksProject,
        setBottlenecksProject,
    ] = useState(null);

    const [
        deadlineOpen,
        setDeadlineOpen,
    ] = useState(false);

    const [
        deadlineProject,
        setDeadlineProject,
    ] = useState(null);

    const [
        teamPerformanceOpen,
        setTeamPerformanceOpen,
    ] = useState(false);

    const [
        teamPerformanceProject,
        setTeamPerformanceProject,
    ] = useState(null);

    const [
        progressPredictionOpen,
        setProgressPredictionOpen,
    ] = useState(false);

    const [
        progressPredictionProject,
        setProgressPredictionProject,
    ] = useState(null);

    const [
        sprintPlanningOpen,
        setSprintPlanningOpen,
    ] = useState(false);

    const [
        sprintPlanningProject,
        setSprintPlanningProject,
    ] = useState(null);

    // ========================================================
    // PROJECT MODAL STATE
    // ========================================================

    const [
        selectedProject,
        setSelectedProject,
    ] = useState(null);

    const [
        modalType,
        setModalType,
    ] = useState(null);

    // ========================================================
    // MESSAGE HELPERS
    // ========================================================

    const clearMessages =
        useCallback(() => {
            setSuccessMessage("");
            setErrorMessage("");
        }, []);

    const showSuccess =
        useCallback((message) => {
            setErrorMessage("");
            setSuccessMessage(message);

            window.setTimeout(() => {
                setSuccessMessage("");
            }, 4000);
        }, []);

    const handleProjectError =
        useCallback(
            (error, fallback) => {
                console.error(error);

                setSuccessMessage("");

                setErrorMessage(
                    getErrorMessage(
                        error,
                        fallback
                    )
                );
            },
            []
        );

    // ========================================================
    // LOAD CURRENT MANAGER
    // ========================================================

    const loadCurrentManager =
        useCallback(async () => {
            const user =
                await getCurrentUser();

            const manager = {
                id:
                    user?.id ??
                    user?.userId ??
                    user?.Id,

                fullName:
                    user?.fullName ??
                    user?.name ??
                    user?.FullName ??
                    "Manager",

                email:
                    user?.email ??
                    user?.Email ??
                    "",
            };

            if (!manager.id) {
                throw new Error(
                    "Unable to identify the current manager."
                );
            }

            setCurrentManager(manager);

            return manager;
        }, []);

    // ========================================================
    // LOAD SUPPORTING DATA
    // ========================================================

    const loadSupportingData =
        useCallback(async () => {
            const [
                teamsResult,
                usersResult,
            ] =
                await Promise.allSettled([
                    getTeams(),
                    getAllUsers(),
                ]);

            if (
                teamsResult.status ===
                "fulfilled"
            ) {
                setTeams(
                    extractArray(
                        teamsResult.value,
                        ["teams"]
                    )
                );
            } else {
                console.warn(
                    "Unable to load teams.",
                    teamsResult.reason
                );

                setTeams([]);
            }

            if (
                usersResult.status ===
                "fulfilled"
            ) {
                setUsers(
                    extractArray(
                        usersResult.value,
                        ["users"]
                    )
                );
            } else {
                console.warn(
                    "Unable to load users.",
                    usersResult.reason
                );

                setUsers([]);
            }
        }, []);

    // ========================================================
    // LOAD PROJECTS
    // ========================================================

    const loadProjects =
        useCallback(
            async (isRefresh = false) => {
                try {
                    if (isRefresh) {
                        setRefreshing(true);
                    } else {
                        setLoading(true);
                    }

                    clearMessages();

                    const manager =
                        await loadCurrentManager();

                    // ------------------------------------------------
                    // MANAGER PROJECTS
                    // ------------------------------------------------

                    const response =
                        await getMyProjects();

                    const projectData =
                        extractArray(
                            response,
                            ["projects"]
                        );

                    const normalizedProjects =
                        projectData.map(
                            normalizeManagerProject
                        );

                    // ------------------------------------------------
                    // PROJECT SPECIFICATIONS
                    // ------------------------------------------------

                    const projectsWithSpecifications =
                        await Promise.all(
                            normalizedProjects.map(
                                async (project) => {
                                    try {
                                        const projectId =
                                            project.id ??
                                            project.projectId;

                                        if (
                                            !projectId
                                        ) {
                                            return project;
                                        }

                                        const specificationResponse =
                                            await getProjectSpecification(
                                                projectId
                                            );

                                        const specification =
                                            specificationResponse?.data ??
                                            specificationResponse;

                                        return {
                                            ...project,

                                            specification,

                                            hasSpecification:
                                                Boolean(
                                                    specification
                                                ),
                                        };
                                    } catch (
                                        specificationError
                                    ) {
                                        console.warn(
                                            `Could not load specification for project ${project.id}`,
                                            specificationError
                                        );

                                        return project;
                                    }
                                }
                            )
                        );

                    // ------------------------------------------------
                    // MANAGER OWNERSHIP
                    // ------------------------------------------------

                    const managerProjects =
                        projectsWithSpecifications.filter(
                            (project) => {
                                if (
                                    !project.managerId ||
                                    !manager?.id
                                ) {
                                    return false;
                                }

                                return (
                                    normalizeId(
                                        project.managerId
                                    ) ===
                                    normalizeId(
                                        manager.id
                                    )
                                );
                            }
                        );

                    setProjects(
                        managerProjects
                    );

                    // ------------------------------------------------
                    // SUPPORTING DATA
                    // ------------------------------------------------

                    await loadSupportingData();
                } catch (error) {
                    handleProjectError(
                        error,
                        "Unable to load manager projects."
                    );

                    setProjects([]);
                } finally {
                    setLoading(false);
                    setRefreshing(false);
                }
            },
            [
                clearMessages,
                handleProjectError,
                loadCurrentManager,
                loadSupportingData,
            ]
        );

    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {
        loadProjects(false);
    }, [loadProjects]);

    // ========================================================
    // ENRICH PROJECTS
    // ========================================================

    const assignedProjects =
        useMemo(() => {
            return projects.map(
                (project) => {
                    const projectTeamId =
                        project.teamId ??
                        project.team?.id ??
                        project.team?.teamId;

                    const projectTeamLeaderId =
                        project.teamLeaderId;

                    const matchingTeam =
                        teams.find(
                            (team) => {
                                const teamId =
                                    getEntityId(
                                        team
                                    );

                                return (
                                    projectTeamId &&
                                    teamId &&
                                    normalizeId(
                                        teamId
                                    ) ===
                                        normalizeId(
                                            projectTeamId
                                        )
                                );
                            }
                        );

                    const matchingTeamLeader =
                        users.find(
                            (user) => {
                                const userId =
                                    getEntityId(
                                        user
                                    );

                                return (
                                    projectTeamLeaderId &&
                                    userId &&
                                    normalizeId(
                                        userId
                                    ) ===
                                        normalizeId(
                                            projectTeamLeaderId
                                        )
                                );
                            }
                        );

                    const matchingManager =
                        users.find(
                            (user) => {
                                const userId =
                                    getEntityId(
                                        user
                                    );

                                return (
                                    project.managerId &&
                                    userId &&
                                    normalizeId(
                                        userId
                                    ) ===
                                        normalizeId(
                                            project.managerId
                                        )
                                );
                            }
                        );

                    const explicitMemberCount =
                        Number(
                            project.teamMemberCount
                        );

                    const teamMemberCount =
                        Number.isFinite(
                            explicitMemberCount
                        ) &&
                        explicitMemberCount >= 0
                            ? explicitMemberCount
                            : Number(
                                  matchingTeam?.memberCount ??
                                      0
                              );

                    return {
                        ...project,

                        managerName:
                            project.managerName ??
                            getEntityName(
                                matchingManager
                            ) ??
                            currentManager?.fullName ??
                            "Current Manager",

                        teamName:
                            project.teamName ??
                            getEntityName(
                                matchingTeam
                            ) ??
                            "No Team Assigned",

                        teamLeaderName:
                            project.teamLeaderName ??
                            getEntityName(
                                matchingTeamLeader
                            ) ??
                            "Not Assigned",

                        teamMemberCount:
                            teamMemberCount,
                    };
                }
            );
        }, [
            projects,
            teams,
            users,
            currentManager,
        ]);

    // ========================================================
    // STATISTICS
    // ========================================================

    const projectStats =
        useMemo(() => {
            const total =
                assignedProjects.length;

            const active =
                assignedProjects.filter(
                    (project) => {
                        const status =
                            getProjectStatus(
                                project
                            );

                        return (
                            status.includes(
                                "active"
                            ) ||
                            status.includes(
                                "progress"
                            ) ||
                            status.includes(
                                "ongoing"
                            )
                        );
                    }
                ).length;

            const completed =
                assignedProjects.filter(
                    (project) => {
                        const status =
                            getProjectStatus(
                                project
                            );

                        return (
                            status.includes(
                                "complete"
                            ) ||
                            status.includes(
                                "done"
                            )
                        );
                    }
                ).length;

            const aiRisks =
                assignedProjects.reduce(
                    (totalRisk, project) => {
                        const risk =
                            Number(
                                project.aiRiskCount ??
                                    project.riskCount ??
                                    project.aiRisks ??
                                    0
                            );

                        return (
                            totalRisk +
                            (Number.isFinite(
                                risk
                            )
                                ? risk
                                : 0)
                        );
                    },
                    0
                );

            return {
                total,
                active,
                completed,
                aiRisks,
            };
        }, [assignedProjects]);

    // ========================================================
    // AUTHORIZATION
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
                    normalizeId(
                        project.managerId
                    ) ===
                    normalizeId(
                        currentManager.id
                    )
                );
            },
            [currentManager]
        );

    const ensureManagerProject =
        useCallback(
            (project, action) => {
                clearMessages();

                if (!project) {
                    handleProjectError(
                        null,
                        "Project information is missing."
                    );

                    return false;
                }

                if (
                    !isCurrentManagerProject(
                        project
                    )
                ) {
                    handleProjectError(
                        null,
                        `You are not authorised to ${action}.`
                    );

                    return false;
                }

                return true;
            },
            [
                clearMessages,
                handleProjectError,
                isCurrentManagerProject,
            ]
        );

    // ========================================================
    // AI PROJECT SUMMARY
    // ========================================================

    const handleOpenSummary =
        useCallback(
            (project) => {
                if (
                    !ensureManagerProject(
                        project,
                        "view the AI project summary"
                    )
                ) {
                    return;
                }

                setSummaryProject(project);
                setSummaryOpen(true);
            },
            [ensureManagerProject]
        );

    // ========================================================
    // AI RECOMMENDATIONS
    // ========================================================

    const handleOpenRecommendations =
        useCallback(
            (project) => {
                if (
                    !ensureManagerProject(
                        project,
                        "view AI recommendations"
                    )
                ) {
                    return;
                }

                setRecommendationsProject(
                    project
                );

                setRecommendationsOpen(
                    true
                );
            },
            [ensureManagerProject]
        );

    // ========================================================
    // AI BOTTLENECKS
    // ========================================================

    const handleOpenBottlenecks =
        useCallback(
            (project) => {
                if (
                    !ensureManagerProject(
                        project,
                        "view AI bottlenecks"
                    )
                ) {
                    return;
                }

                setBottlenecksProject(
                    project
                );

                setBottlenecksOpen(true);
            },
            [ensureManagerProject]
        );

    // ========================================================
    // AI DEADLINE
    // ========================================================

    const handleOpenDeadline =
        useCallback(
            (project) => {
                if (
                    !ensureManagerProject(
                        project,
                        "view AI deadline prediction"
                    )
                ) {
                    return;
                }

                setDeadlineProject(project);
                setDeadlineOpen(true);
            },
            [ensureManagerProject]
        );

    // ========================================================
    // AI TEAM PERFORMANCE
    // ========================================================

    const handleOpenTeamPerformance =
        useCallback(
            (project) => {
                if (
                    !ensureManagerProject(
                        project,
                        "view AI team performance"
                    )
                ) {
                    return;
                }

                setTeamPerformanceProject(
                    project
                );

                setTeamPerformanceOpen(
                    true
                );
            },
            [ensureManagerProject]
        );

    // ========================================================
    // AI PROGRESS PREDICTION
    // ========================================================

    const handleOpenProgressPrediction =
        useCallback(
            (project) => {
                if (
                    !ensureManagerProject(
                        project,
                        "view AI progress prediction"
                    )
                ) {
                    return;
                }

                setProgressPredictionProject(
                    project
                );

                setProgressPredictionOpen(
                    true
                );
            },
            [ensureManagerProject]
        );

    // ========================================================
    // AI SPRINT PLANNING
    // ========================================================

    const handleOpenSprintPlanning =
        useCallback(
            (project) => {
                if (
                    !ensureManagerProject(
                        project,
                        "view AI sprint planning"
                    )
                ) {
                    return;
                }

                setSprintPlanningProject(
                    project
                );

                setSprintPlanningOpen(
                    true
                );
            },
            [ensureManagerProject]
        );

    // ========================================================
    // CREATE SPECIFICATION
    // ========================================================

    const handleOpenCreateSpecification =
        (project) => {
            if (
                !ensureManagerProject(
                    project,
                    "create a project specification"
                )
            ) {
                return;
            }

            setSelectedProject(project);

            setModalType(
                "createSpecification"
            );
        };

    // ========================================================
    // UPDATE SPECIFICATION
    // ========================================================

    const handleOpenUpdateSpecification =
        (project) => {
            if (
                !ensureManagerProject(
                    project,
                    "update the project specification"
                )
            ) {
                return;
            }

            setSelectedProject(project);

            setModalType(
                "updateSpecification"
            );
        };

    // ========================================================
    // DELETE SPECIFICATION
    // ========================================================

    const handleOpenDeleteSpecification =
        (project) => {
            if (
                !ensureManagerProject(
                    project,
                    "delete the project specification"
                )
            ) {
                return;
            }

            setSelectedProject(project);

            setModalType(
                "deleteSpecification"
            );
        };

    // ========================================================
    // VIEW PROJECT
    // ========================================================

    const handleOpenViewProject =
        (project) => {
            if (
                !ensureManagerProject(
                    project,
                    "view this project"
                )
            ) {
                return;
            }

            setSelectedProject(project);
            setModalType("viewProject");
        };

    // ========================================================
    // UPDATE TIMELINE
    // ========================================================

    const handleOpenTimeline =
        (project) => {
            if (
                !ensureManagerProject(
                    project,
                    "update the project timeline"
                )
            ) {
                return;
            }

            setSelectedProject(project);
            setModalType("timeline");
        };

    // ========================================================
    // UPDATE DEADLINE
    // ========================================================

    const handleOpenUpdateDeadline =
        (project) => {
            if (
                !ensureManagerProject(
                    project,
                    "update the project deadline"
                )
            ) {
                return;
            }

            setSelectedProject(project);
            setModalType("deadline");
        };

    // ========================================================
    // MANAGE STATUS
    // ========================================================

    const handleOpenStatus =
        (project) => {
            if (
                !ensureManagerProject(
                    project,
                    "manage the project status"
                )
            ) {
                return;
            }

            setSelectedProject(project);
            setModalType("status");
        };

    // ========================================================
    // CLOSE PROJECT MODAL
    // ========================================================

    const closeProjectModal =
        useCallback(() => {
            setSelectedProject(null);
            setModalType(null);
        }, []);

    // ========================================================
    // SPECIFICATION CREATED
    // ========================================================

    const handleSpecificationCreated =
        async () => {
            closeProjectModal();

            showSuccess(
                "Project specification created successfully."
            );

            await loadProjects(true);
        };

    // ========================================================
    // SPECIFICATION UPDATED
    // ========================================================

    const handleSpecificationUpdated =
        async () => {
            closeProjectModal();

            showSuccess(
                "Project specification updated successfully."
            );

            await loadProjects(true);
        };

    // ========================================================
    // SPECIFICATION DELETED
    // ========================================================

    const handleSpecificationDeleted =
        async () => {
            closeProjectModal();

            showSuccess(
                "Project specification deleted successfully."
            );

            await loadProjects(true);
        };

    // ========================================================
    // TIMELINE UPDATED
    // ========================================================

    const handleTimelineUpdated =
        async () => {
            closeProjectModal();

            showSuccess(
                "Project timeline updated successfully."
            );

            await loadProjects(true);
        };

    // ========================================================
    // DEADLINE UPDATED
    // ========================================================

    const handleDeadlineUpdated =
        async () => {
            closeProjectModal();

            showSuccess(
                "Project deadline updated successfully."
            );

            await loadProjects(true);
        };

    // ========================================================
    // STATUS UPDATED
    // ========================================================

    const handleStatusUpdated =
        async () => {
            closeProjectModal();

            showSuccess(
                "Project status updated successfully."
            );

            await loadProjects(true);
        };

    // ========================================================
    // REFRESH
    // ========================================================

    const handleRefresh = async () => {
        await loadProjects(true);
    };

    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {
        return (
            <div className="min-h-full bg-background text-foreground">
                <div className="mx-auto w-full max-w-[1800px]">
                    <div className="flex min-h-[500px] items-center justify-center">
                        <div className="text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                                <RefreshCw
                                    size={30}
                                    className="animate-spin text-primary"
                                />
                            </div>

                            <h2 className="mt-5 text-lg font-bold text-foreground">
                                Loading Project Management
                            </h2>

                            <p className="mt-2 text-sm text-muted-foreground">
                                Loading your projects and project data...
                            </p>
                        </div>
                    </div>
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

                <section className="mb-6 rounded-xl border border-border bg-card p-6 shadow-sm">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                        <div className="flex items-center gap-4">

                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <FolderKanban size={28} />
                            </div>

                            <div>
                                <div className="mb-1 flex items-center gap-2">
                                    <Sparkles
                                        size={15}
                                        className="text-primary"
                                    />

                                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Manager Workspace
                                    </span>
                                </div>

                                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                    Project Management
                                </h1>

                                <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                                    Manage and monitor your assigned projects,
                                    project progress, timelines, specifications
                                    and AI-powered project intelligence.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">

                            <Button
                                type="button"
                                variant="outline"
                                onClick={
                                    handleRefresh
                                }
                                disabled={
                                    refreshing
                                }
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
                            </Button>

                        </div>
                    </div>
                </section>

                {/* ==================================================
                    MESSAGES
                ================================================== */}

                {successMessage && (
                    <section className="mb-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                        <div className="flex items-center gap-3">
                            <CheckCircle2
                                size={20}
                                className="text-emerald-600"
                            />

                            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                                {successMessage}
                            </p>
                        </div>
                    </section>
                )}

                {errorMessage && (
                    <section className="mb-6 rounded-xl border border-destructive/30 bg-destructive/5 p-5">
                        <div className="flex items-start gap-3">
                            <AlertTriangle
                                size={21}
                                className="mt-0.5 shrink-0 text-destructive"
                            />

                            <div>
                                <h3 className="font-semibold text-foreground">
                                    Unable to complete request
                                </h3>

                                <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">
                                    {errorMessage}
                                </p>
                            </div>
                        </div>
                    </section>
                )}

                {/* ==================================================
                    PROJECT STATISTICS
                ================================================== */}

                <section className="mb-6">

                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">
                                Project Overview
                            </h2>

                            <p className="text-sm text-muted-foreground">
                                Summary of projects assigned to you.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                        {/* TOTAL */}

                        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                            <div className="flex items-start justify-between">

                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Total Projects
                                    </p>

                                    <p className="mt-2 text-3xl font-bold text-foreground">
                                        {projectStats.total}
                                    </p>
                                </div>

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <FolderKanban size={21} />
                                </div>

                            </div>

                            <p className="mt-3 text-xs leading-5 text-muted-foreground">
                                Projects assigned to you
                            </p>
                        </div>

                        {/* ACTIVE */}

                        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                            <div className="flex items-start justify-between">

                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Active Projects
                                    </p>

                                    <p className="mt-2 text-3xl font-bold text-foreground">
                                        {projectStats.active}
                                    </p>
                                </div>

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <Clock3 size={21} />
                                </div>

                            </div>

                            <p className="mt-3 text-xs leading-5 text-muted-foreground">
                                Projects currently in progress
                            </p>
                        </div>

                        {/* COMPLETED */}

                        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                            <div className="flex items-start justify-between">

                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Completed Projects
                                    </p>

                                    <p className="mt-2 text-3xl font-bold text-foreground">
                                        {projectStats.completed}
                                    </p>
                                </div>

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                                    <CheckCircle2 size={21} />
                                </div>

                            </div>

                            <p className="mt-3 text-xs leading-5 text-muted-foreground">
                                Projects successfully completed
                            </p>
                        </div>

                        {/* AI RISKS */}

                        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                            <div className="flex items-start justify-between">

                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        AI Risks
                                    </p>

                                    <p className="mt-2 text-3xl font-bold text-foreground">
                                        {projectStats.aiRisks}
                                    </p>
                                </div>

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                                    <AlertTriangle size={21} />
                                </div>

                            </div>

                            <p className="mt-3 text-xs leading-5 text-muted-foreground">
                                AI risk information available from project data
                            </p>
                        </div>

                    </div>
                </section>

                {/* ==================================================
                    ASSIGNED PROJECTS
                ================================================== */}

                <section className="mb-6 rounded-xl border border-border bg-card shadow-sm">

                    {/* HEADER */}

                    <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <FolderKanban size={20} />
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold text-foreground">
                                    Assigned Projects
                                </h2>

                                <p className="text-sm text-muted-foreground">
                                    Projects currently assigned to you as manager.
                                </p>
                            </div>

                        </div>

                        <div className="rounded-lg bg-muted px-3 py-2 text-sm font-semibold text-muted-foreground">
                            {assignedProjects.length}{" "}
                            {assignedProjects.length ===
                            1
                                ? "Project"
                                : "Projects"}
                        </div>

                    </div>

                    {/* ==================================================
                        EMPTY
                    ================================================== */}

                    {assignedProjects.length ===
                    0 ? (
                        <div className="p-6">
                            <div className="rounded-lg border border-dashed border-border bg-muted/30 px-6 py-14 text-center">

                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                                    <FolderKanban
                                        size={28}
                                    />
                                </div>

                                <h3 className="mt-4 text-lg font-semibold text-foreground">
                                    No assigned projects
                                </h3>

                                <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                                    There are currently no projects assigned to your manager account.
                                </p>

                            </div>
                        </div>
                    ) : (

                        <div className="divide-y divide-border">

                            {assignedProjects.map(
                                (project) => {
                                    const projectId =
                                        project.id ??
                                        project.projectId;

                                    const progress =
                                        getProjectProgress(
                                            project
                                        );

                                    const statusStyle =
                                        getStatusStyle(
                                            project.statusName ??
                                                project.status
                                        );

                                    return (
                                        <div
                                            key={
                                                projectId
                                            }
                                            className="p-5 transition-colors hover:bg-muted/20"
                                        >

                                            {/* ==========================================
                                                PROJECT HEADER
                                            ========================================== */}

                                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                                                <div className="min-w-0">

                                                    <div className="mb-2 flex flex-wrap items-center gap-2">

                                                        <h3 className="text-xl font-semibold tracking-tight text-foreground">
                                                            {
                                                                project.name
                                                            }
                                                        </h3>

                                                        <span
                                                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle.container}`}
                                                        >
                                                            <span
                                                                className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`}
                                                            />

                                                            {project.statusName ??
                                                                project.status ??
                                                                "Planning"}
                                                        </span>

                                                    </div>

                                                    <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                                                        {project.description ||
                                                            "No project description available."}
                                                    </p>

                                                </div>

                                                <div className="flex flex-wrap gap-2">

                                                    <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-xs font-medium text-muted-foreground">
                                                        <Users size={15} />

                                                        {
                                                            project.teamName
                                                        }
                                                    </div>

                                                    <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-xs font-medium text-muted-foreground">
                                                        <Users size={15} />

                                                        {
                                                            project.teamMemberCount
                                                        }{" "}
                                                        members
                                                    </div>

                                                </div>

                                            </div>

                                            {/* ==========================================
                                                PROJECT CARD
                                            ========================================== */}

                                            <div className="my-5">
                                                <ProjectCard
                                                    project={
                                                        project
                                                    }
                                                />
                                            </div>

                                            {/* ==========================================
                                                PROJECT INFORMATION
                                            ========================================== */}

                                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

                                                {/* START DATE */}

                                                <div className="rounded-lg border border-border bg-muted/30 p-4">

                                                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                                        <CalendarDays
                                                            size={
                                                                16
                                                            }
                                                        />

                                                        Start Date
                                                    </div>

                                                    <p className="mt-2 text-sm font-semibold text-foreground">
                                                        {formatDate(
                                                            project.startDate
                                                        )}
                                                    </p>

                                                </div>

                                                {/* DEADLINE */}

                                                <div className="rounded-lg border border-border bg-muted/30 p-4">

                                                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                                        <CalendarClock
                                                            size={
                                                                16
                                                            }
                                                        />

                                                        Deadline
                                                    </div>

                                                    <p className="mt-2 text-sm font-semibold text-foreground">
                                                        {formatDate(
                                                            project.deadline
                                                        )}
                                                    </p>

                                                </div>

                                                {/* PROGRESS */}

                                                <div className="rounded-lg border border-border bg-muted/30 p-4">

                                                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                                        <TrendingUp
                                                            size={
                                                                16
                                                            }
                                                        />

                                                        Progress
                                                    </div>

                                                    <p className="mt-2 text-sm font-semibold text-foreground">
                                                        {
                                                            progress
                                                        }
                                                        %
                                                    </p>

                                                </div>

                                                {/* TEAM LEADER */}

                                                <div className="rounded-lg border border-border bg-muted/30 p-4">

                                                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                                        <CircleDot
                                                            size={
                                                                16
                                                            }
                                                        />

                                                        Team Leader
                                                    </div>

                                                    <p className="mt-2 truncate text-sm font-semibold text-foreground">
                                                        {
                                                            project.teamLeaderName
                                                        }
                                                    </p>

                                                </div>

                                            </div>

                                            {/* ==========================================
                                                PROGRESS
                                            ========================================== */}

                                            <div className="mt-5">

                                                <div className="mb-2 flex items-center justify-between">

                                                    <div className="flex items-center gap-2">
                                                        <TrendingUp
                                                            size={
                                                                15
                                                            }
                                                            className="text-muted-foreground"
                                                        />

                                                        <span className="text-xs font-medium text-muted-foreground">
                                                            Project Progress
                                                        </span>
                                                    </div>

                                                    <span className="text-xs font-semibold text-primary">
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

                                            {/* ==========================================
                                                ACTIONS
                                            ========================================== */}

                                            <div className="mt-5 rounded-xl border border-border bg-muted/20 p-4">

                                                <div className="mb-4 flex items-center gap-2">

                                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                        <Settings2
                                                            size={
                                                                16
                                                            }
                                                        />
                                                    </div>

                                                    <div>
                                                        <h4 className="text-sm font-semibold text-foreground">
                                                            AI & Project Actions
                                                        </h4>

                                                        <p className="text-xs text-muted-foreground">
                                                            Manage and analyze this project.
                                                        </p>
                                                    </div>

                                                </div>

                                                <div className="flex flex-wrap gap-2">

                                                    {/* VIEW */}

                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleOpenViewProject(
                                                                project
                                                            )
                                                        }
                                                    >
                                                        <Eye
                                                            size={
                                                                15
                                                            }
                                                        />

                                                        View
                                                    </Button>

                                                    {/* AI SUMMARY */}

                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleOpenSummary(
                                                                project
                                                            )
                                                        }
                                                    >
                                                        <FileText
                                                            size={
                                                                15
                                                            }
                                                        />

                                                        AI Summary
                                                    </Button>

                                                    {/* RECOMMENDATIONS */}

                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleOpenRecommendations(
                                                                project
                                                            )
                                                        }
                                                    >
                                                        <Lightbulb
                                                            size={
                                                                15
                                                            }
                                                        />

                                                        Recommendations
                                                    </Button>

                                                    {/* BOTTLENECKS */}

                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleOpenBottlenecks(
                                                                project
                                                            )
                                                        }
                                                    >
                                                        <AlertTriangle
                                                            size={
                                                                15
                                                            }
                                                        />

                                                        Bottlenecks
                                                    </Button>

                                                    {/* AI DEADLINE */}

                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleOpenDeadline(
                                                                project
                                                            )
                                                        }
                                                    >
                                                        <CalendarRange
                                                            size={
                                                                15
                                                            }
                                                        />

                                                        AI Deadline
                                                    </Button>

                                                    {/* TEAM PERFORMANCE */}

                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleOpenTeamPerformance(
                                                                project
                                                            )
                                                        }
                                                    >
                                                        <Users
                                                            size={
                                                                15
                                                            }
                                                        />

                                                        Team Performance
                                                    </Button>

                                                    {/* PROGRESS PREDICTION */}

                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleOpenProgressPrediction(
                                                                project
                                                            )
                                                        }
                                                    >
                                                        <TrendingUp
                                                            size={
                                                                15
                                                            }
                                                        />

                                                        Progress Prediction
                                                    </Button>

                                                    {/* SPRINT PLANNING */}

                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleOpenSprintPlanning(
                                                                project
                                                            )
                                                        }
                                                    >
                                                        <CalendarDays
                                                            size={
                                                                15
                                                            }
                                                        />

                                                        Sprint Planning
                                                    </Button>

                                                    {/* SPECIFICATION DIVIDER */}

                                                    <div className="hidden h-8 w-px bg-border lg:block" />

                                                    {/* CREATE SPECIFICATION */}

                                                    {!project.hasSpecification && (
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleOpenCreateSpecification(
                                                                    project
                                                                )
                                                            }
                                                        >
                                                            <FilePlus2
                                                                size={
                                                                    15
                                                                }
                                                            />

                                                            Create Specification
                                                        </Button>
                                                    )}

                                                    {/* UPDATE SPECIFICATION */}

                                                    {project.hasSpecification && (
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleOpenUpdateSpecification(
                                                                    project
                                                                )
                                                            }
                                                        >
                                                            <FilePenLine
                                                                size={
                                                                    15
                                                                }
                                                            />

                                                            Edit Specification
                                                        </Button>
                                                    )}

                                                    {/* DELETE SPECIFICATION */}

                                                    {project.hasSpecification && (
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-destructive hover:text-destructive"
                                                            onClick={() =>
                                                                handleOpenDeleteSpecification(
                                                                    project
                                                                )
                                                            }
                                                        >
                                                            <Trash2
                                                                size={
                                                                    15
                                                                }
                                                            />

                                                            Delete Specification
                                                        </Button>
                                                    )}

                                                    {/* TIMELINE */}

                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleOpenTimeline(
                                                                project
                                                            )
                                                        }
                                                    >
                                                        <CalendarRange
                                                            size={
                                                                15
                                                            }
                                                        />

                                                        Update Timeline
                                                    </Button>

                                                    {/* DEADLINE */}

                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleOpenUpdateDeadline(
                                                                project
                                                            )
                                                        }
                                                    >
                                                        <CalendarClock
                                                            size={
                                                                15
                                                            }
                                                        />

                                                        Set Deadline
                                                    </Button>

                                                    {/* STATUS */}

                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleOpenStatus(
                                                                project
                                                            )
                                                        }
                                                    >
                                                        <CircleDot
                                                            size={
                                                                15
                                                            }
                                                        />

                                                        Manage Status
                                                    </Button>

                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    )}
                </section>

                {/* ==================================================
                    PROJECT MODALS
                ================================================== */}

                {modalType ===
                    "createSpecification" && (
                    <CreateProjectSpecificationModal
                        project={
                            selectedProject
                        }
                        onClose={
                            closeProjectModal
                        }
                        onSuccess={
                            handleSpecificationCreated
                        }
                    />
                )}

                {modalType ===
                    "updateSpecification" && (
                    <UpdateProjectSpecificationModal
                        project={
                            selectedProject
                        }
                        onClose={
                            closeProjectModal
                        }
                        onSuccess={
                            handleSpecificationUpdated
                        }
                    />
                )}

                {modalType ===
                    "deleteSpecification" && (
                    <DeleteProjectSpecificationModal
                        project={
                            selectedProject
                        }
                        onClose={
                            closeProjectModal
                        }
                        onSuccess={
                            handleSpecificationDeleted
                        }
                    />
                )}

                {modalType ===
                    "viewProject" && (
                    <ViewAssignedProjectModal
                        project={
                            selectedProject
                        }
                        onClose={
                            closeProjectModal
                        }
                    />
                )}

                {modalType === "timeline" && (
                    <UpdateTimelineProjectModal
                        project={
                            selectedProject
                        }
                        onClose={
                            closeProjectModal
                        }
                        onSuccess={
                            handleTimelineUpdated
                        }
                    />
                )}

                {modalType === "deadline" && (
                    <SetUpdateProjectDeadlineModal
                        project={
                            selectedProject
                        }
                        onClose={
                            closeProjectModal
                        }
                        onSuccess={
                            handleDeadlineUpdated
                        }
                    />
                )}

                {modalType === "status" && (
                    <ManageProjectStatusModal
                        project={
                            selectedProject
                        }
                        onClose={
                            closeProjectModal
                        }
                        onSuccess={
                            handleStatusUpdated
                        }
                    />
                )}

                {/* ==================================================
                    AI MODALS
                ================================================== */}

                {summaryOpen && (
                    <AiProjectSummaryModal
                        project={
                            summaryProject
                        }
                        open={summaryOpen}
                        onClose={() => {
                            setSummaryOpen(
                                false
                            );
                            setSummaryProject(
                                null
                            );
                        }}
                    />
                )}

                {recommendationsOpen && (
                    <AiRecommendationsModal
                        project={
                            recommendationsProject
                        }
                        open={
                            recommendationsOpen
                        }
                        onClose={() => {
                            setRecommendationsOpen(
                                false
                            );
                            setRecommendationsProject(
                                null
                            );
                        }}
                    />
                )}

                {bottlenecksOpen && (
                    <AiBottlenecksModal
                        project={
                            bottlenecksProject
                        }
                        open={
                            bottlenecksOpen
                        }
                        onClose={() => {
                            setBottlenecksOpen(
                                false
                            );
                            setBottlenecksProject(
                                null
                            );
                        }}
                    />
                )}

                {deadlineOpen && (
                    <AiDeadlinePredictionModal
                        project={
                            deadlineProject
                        }
                        open={deadlineOpen}
                        onClose={() => {
                            setDeadlineOpen(
                                false
                            );
                            setDeadlineProject(
                                null
                            );
                        }}
                    />
                )}

                {teamPerformanceOpen && (
                    <AiTeamPerformanceModal
                        project={
                            teamPerformanceProject
                        }
                        open={
                            teamPerformanceOpen
                        }
                        onClose={() => {
                            setTeamPerformanceOpen(
                                false
                            );
                            setTeamPerformanceProject(
                                null
                            );
                        }}
                    />
                )}

                {progressPredictionOpen && (
                    <AiProgressPredictionModal
                        project={
                            progressPredictionProject
                        }
                        open={
                            progressPredictionOpen
                        }
                        onClose={() => {
                            setProgressPredictionOpen(
                                false
                            );
                            setProgressPredictionProject(
                                null
                            );
                        }}
                    />
                )}

                {sprintPlanningOpen && (
                    <AiSprintPlanningModal
                        project={
                            sprintPlanningProject
                        }
                        open={
                            sprintPlanningOpen
                        }
                        onClose={() => {
                            setSprintPlanningOpen(
                                false
                            );
                            setSprintPlanningProject(
                                null
                            );
                        }}
                    />
                )}
            </div>
        </div>
    );
}

export default ProjectManagement;