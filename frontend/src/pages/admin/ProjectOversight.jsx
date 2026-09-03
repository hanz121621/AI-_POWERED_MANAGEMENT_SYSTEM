import { useCallback, useEffect, useMemo, useState } from "react";
import CreateProjectModal from "@/components/admin/projects/CreateProjectModal";
import EditProjectModal from "@/components/admin/projects/EditProjectModal";
import DeleteProjectDialog from "@/components/admin/projects/DeleteProjectDialog";

import api from "@/services/api";
import {
    Archive,
    ArchiveRestore,
    CalendarDays,
    CheckCircle2,
    Clock3,
    FolderKanban,
    ListTodo,
    Plus,
    Search,
    Trash2,
    UserRound,
    UsersRound,
    X,
    XCircle,
    UserCog,
    ListChecks,
    CalendarPlus,
    Trophy,
    Loader2,
    RefreshCw,
} from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    getProjects,
    createProject,
    updateProject,
    deleteProject,
    archiveProject,
    restoreProject,
} from "@/services/projectService";
import { getTeams } from "@/services/teamService";
import { getAllUsers } from "@/services/userService";

function ProjectOversight() {
   
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    const [actionLoading, setActionLoading] =
        useState(false);
    const [createProjectOpen, setCreateProjectOpen] =
        useState(false);
    const [editProject, setEditProject] =
        useState(null);
    const [deleteProjectState, setDeleteProjectState] =
        useState(null);
    const [teams, setTeams] = useState([]);
    const [managers, setManagers] = useState([]);
const [teamLeaders, setTeamLeaders] =
    useState([]);
    // ========================================================
    // SEARCH
    // ========================================================

    const [searchTerm, setSearchTerm] =
        useState("");

    // ========================================================
    // STATUS FILTER
    // ========================================================

    const [statusFilter, setStatusFilter] =
        useState("All");

    // ========================================================
    // SELECTED PROJECT
    // ========================================================

    const [selectedProject, setSelectedProject] =
        useState(null);

    // ========================================================
    // DIALOG TYPE
    // ========================================================

    const [dialogType, setDialogType] =
        useState(null);

    // ========================================================
    // MESSAGE
    // ========================================================

    const [message, setMessage] =
        useState(null);
  // ========================================================
    // NORMALIZE PROJECT
    //
    // Supports common .NET naming conventions:
    //
    // id / projectId / ProjectId
    // name / projectName / ProjectName
    // manager / managerName
    // team / teamName
    // etc.
    // ========================================================

    const normalizeProject = useCallback(
        (project) => {
            if (!project) {
                return null;
            }

            return {
                ...project,

                id:
                    project?.id ??
                    project?.projectId ??
                    project?.ProjectId,

                projectId:
                    project?.projectId ??
                    project?.id ??
                    project?.ProjectId,

                name:
                    project?.name ??
                    project?.projectName ??
                    project?.ProjectName ??
                    "",

                description:
                    project?.description ??
                    project?.Description ??
                    "",

                manager:
                    project?.manager ??
                    project?.managerName ??
                    project?.ManagerName ??
                    project?.projectManager ??
                    "Not assigned",

                team:
                    project?.team ??
                    project?.teamName ??
                    project?.TeamName ??
                    "No team assigned",

                teamLeader:
                    project?.teamLeader ??
                    project?.teamLeaderName ??
                    project?.TeamLeaderName ??
                    "Not assigned",

                status:
                    project?.status ??
                    project?.Status ??
                    "Planning",

                startDate:
                    project?.startDate ??
                    project?.StartDate ??
                    "",

                deadline:
                    project?.deadline ??
                    project?.endDate ??
                    project?.Deadline ??
                    project?.EndDate ??
                    "",

                progress:
                    Number(
                        project?.progress ??
                        project?.progressPercentage ??
                        project?.Progress ??
                        project?.ProgressPercentage ??
                        0
                    ),

                tasks:
                    Number(
                        project?.tasks ??
                        project?.taskCount ??
                        project?.Tasks ??
                        project?.TaskCount ??
                        0
                    ),

                activeTasks:
                    Number(
                        project?.activeTasks ??
                        project?.activeTaskCount ??
                        project?.ActiveTasks ??
                        project?.ActiveTaskCount ??
                        0
                    ),

                sprints:
                    Number(
                        project?.sprints ??
                        project?.sprintCount ??
                        project?.Sprints ??
                        project?.SprintCount ??
                        0
                    ),

                createdAt:
                    project?.createdAt ??
                    project?.creationDate ??
                    project?.CreatedAt ??
                    project?.CreationDate ??
                    "",

                completedAt:
                    project?.completedAt ??
                    project?.completionDate ??
                    project?.CompletedAt ??
                    project?.CompletionDate ??
                    null,

                completionNote:
                    project?.completionNote ??
                    project?.completionInformation ??
                    project?.CompletionNote ??
                    project?.CompletionInformation ??
                    null,
            };
        },
        []
    );

    // ========================================================
    // EXTRACT PROJECT ARRAY
    //
    // Supports:
    //
    // [...]
    // { data: [...] }
    // { projects: [...] }
    // { items: [...] }
    // ========================================================

    const extractProjects = useCallback(
        (response) => {
            const data =
                response?.data ??
                response;

            if (Array.isArray(data)) {
                return data;
            }

            if (Array.isArray(data?.projects)) {
                return data.projects;
            }

            if (Array.isArray(data?.items)) {
                return data.items;
            }

            if (Array.isArray(data?.data)) {
                return data.data;
            }

            return [];
        },
        []
    );
    // ========================================================
// LOAD TEAMS FROM BACKEND
// ========================================================

const loadTeams = useCallback(
    async () => {
        try {
            console.log(
                "========== GET TEAMS =========="
            );

            const result =
                await getTeams();

            console.log(
                "GET TEAMS RESULT:",
                result
            );

            const data =
                Array.isArray(result)
                    ? result
                    : Array.isArray(result?.data)
                        ? result.data
                        : Array.isArray(result?.teams)
                            ? result.teams
                            : Array.isArray(result?.items)
                                ? result.items
                                : [];

            setTeams(data);

            console.log(
                "PROJECT TEAMS:",
                data
            );

            return data;
        } catch (error) {
            console.error(
                "LOAD TEAMS ERROR:",
                error
            );

            setTeams([]);

            return [];
        }
    },
    []
);
const loadTeamLeadersAndManagers = useCallback(
  async () => {
    try {
      console.log("========== LOAD TEAM LEADERS & MANAGERS ==========");
      const users = await getAllUsers();
      console.log("ALL DATABASE USERS:", users);
      
      // 1. Filter real Team Leaders
      const leaders = Array.isArray(users)
        ? users.filter((user) => {
            const contributorType = String(user?.contributorType || "").trim().toLowerCase();
            return user?.isActive !== false && contributorType === "team leader";
          })
        : [];
      console.log("DATABASE TEAM LEADERS:", leaders);
      setTeamLeaders(leaders);

      // 🌟 2. Filter REAL Managers and format them for the dropdown
      const realManagers = Array.isArray(users)
        ? users
            .filter((user) => user?.role === "Manager" || user?.role === 2)
            .map((user) => ({
              id: user.id, // This is the REAL database GUID!
              name: user.fullName || user.name || "Unknown Manager",
            }))
        : [];
      console.log("REAL MANAGERS:", realManagers);
      setManagers(realManagers);

    } catch (error) {
      console.error("LOAD USERS ERROR:", error);
      setTeamLeaders([]);
      setManagers([]);
    }
  },
  []
);
// ========================================================
// LOAD PROJECTS FROM BACKEND
// ========================================================
const loadProjects = useCallback(
  async () => {
    try {
      setLoading(true);
      setMessage(null);
      console.log("========== GET PROJECTS ==========");
      const response = await getProjects();
      console.log("RAW PROJECTS RESPONSE:", response);
      const projectList = extractProjects(response);
      
      const normalizedProjects = projectList
        .map((project) => normalizeProject(project))
        .filter(Boolean);
        
      console.log("NORMALIZED PROJECTS:", normalizedProjects);
      setProjects(normalizedProjects);
    } catch (error) {
      console.error("GET PROJECTS ERROR:", error);
      setProjects([]);
      setMessage({
        type: "error",
        text: error?.message || "Unable to load projects from the server.",
      });
    } finally {
      setLoading(false);
    }
  },
  [extractProjects, normalizeProject] // 🌟 REMOVED teamLeaders to prevent infinite loop
);
    

// ========================================================
// LOAD DATA WHEN PAGE OPENS
// ========================================================
useEffect(() => {
  loadProjects();
  loadTeams();
  loadTeamLeadersAndManagers(); // 🌟 Updated function name
}, [
  loadProjects,
  loadTeams,
  loadTeamLeadersAndManagers,
]);
// ========================================================
// ENRICH PROJECTS WITH TEAM LEADER NAMES
// ========================================================
useEffect(() => {
  if (projects.length > 0 && teamLeaders.length > 0) {
    setProjects((currentProjects) =>
      currentProjects.map((project) => {
        // If the team leader is missing or says "Not assigned", but we have an ID, find the name
        if ((!project.teamLeader || project.teamLeader === "Not assigned") && project.teamLeaderId) {
          const leader = teamLeaders.find((l) => String(l.id) === String(project.teamLeaderId));
          if (leader) {
            return {
              ...project,
              teamLeader: leader.fullName || leader.name || "Not assigned",
            };
          }
        }
        return project; // Return unchanged if no match
      })
    );
  }
}, [teamLeaders]); // 🌟 This safely updates the names when teamLeaders loads, without looping
    // ========================================================
    // CREATE PROJECT
    // ========================================================

    const handleCreateProject = () => {
        setMessage(null);
        setCreateProjectOpen(true);
    };

    // ========================================================
    // CLOSE CREATE PROJECT
    // ========================================================

    const handleCloseCreateProject = () => {
        if (actionLoading) {
            return;
        }

        setCreateProjectOpen(false);
    };

    // ========================================================
    // SAVE CREATED PROJECT
    //
    // IMPORTANT:
    // The project is now sent to the backend.
    // It is NOT only saved in React state.
    // ========================================================

    const handleSaveProject = async (
        newProject
    ) => {
        if (!newProject) {
            return;
        }

        const projectName =
            String(
                newProject.name || ""
            )
                .trim()
                .toLowerCase();

        if (!projectName) {
            setMessage({
                type: "error",
                text:
                    "Please complete all required fields.",
            });

            return;
        }

        // ----------------------------------------------------
        // Frontend duplicate check
        // ----------------------------------------------------

        const projectAlreadyExists =
            projects.some(
                (project) =>
                    String(
                        project.name || ""
                    )
                        .trim()
                        .toLowerCase() ===
                    projectName
            );

        if (projectAlreadyExists) {
            setMessage({
                type: "error",
                text:
                    "Project already exists.",
            });

            return;
        }

        try {
            setActionLoading(true);
            setMessage(null);

            const selectedTeam =
                teams.find(
                    (team) =>
                        team.name ===
                        newProject.team
                );

            // ------------------------------------------------
            // Backend request
            //
            // Keep this object compatible with projectService.
            // ------------------------------------------------

const requestData = {
    name: String(newProject.name || "").trim(),
    description: String(newProject.description || "").trim(),
    statusId: newProject.statusId || "a1b2c3d4-e5f6-7890-abcd-ef1234567890", 
    priorityId: newProject.priorityId || 1, 
    managerId: newProject.managerId || null,
    teamId: newProject.teamId ?? selectedTeam?.id ?? selectedTeam?.teamId ?? null,
    teamLeaderId: newProject.teamLeaderId || null,
    
    // ✅ FIX: Provide valid default date strings, NOT null
    startDate: newProject.startDate || "2026-09-02", 
    deadline: newProject.deadline || "2026-10-01",   
};

            console.log(
                "CREATE PROJECT REQUEST:",
                requestData
            );

            const response =
                await createProject(
                    requestData
                );

            console.log(
                "CREATE PROJECT RESPONSE:",
                response
            );

            setCreateProjectOpen(
                false
            );

            setMessage({
                type: "success",
                text:
                    response?.message ||
                    "Project created successfully.",
            });

            // ------------------------------------------------
            // Reload from backend.
            //
            // This guarantees that the UI displays the actual
            // database record created by the backend.
            // ------------------------------------------------

            await loadProjects();
        } catch (error) {
            console.error(
                "CREATE PROJECT ERROR:",
                error
            );

            setMessage({
                type: "error",
                text:
                    error?.message ||
                    "Unable to create project.",
            });
        } finally {
            setActionLoading(false);
        }
    };
    // ========================================================
// AI INSIGHTS (AI-002: Predict Project Risk)
// ========================================================
const [loadingAi, setLoadingAi] = useState(false);
const [aiInsightData, setAiInsightData] = useState(null);
const [aiInsightOpen, setAiInsightOpen] = useState(false);

const handleGetAiInsight = async (project) => {
  if (!project?.id) return;
  
  setLoadingAi(true);
  setAiInsightData(null);
  setAiInsightOpen(true);
  
  try {
    // We use the main api instance to call our new AI-002 endpoint
    const response = await api.get(`/projects/${project.id}/ai-risk`);
    
    if (response.data?.success) {
      setAiInsightData(response.data.data);
    } else {
      setAiInsightData({ error: response.data?.message || "Failed to get AI insight." });
    }
  }catch (error) {
    console.error("AI INSIGHT ERROR:", error);
    // 🌟 FIX: Show the detailed error from the backend instead of the generic one
    const detailedError = error.response?.data?.error || error.response?.data?.message || "AI service is currently unavailable.";
    setAiInsightData({ error: detailedError });
  } finally {
    setLoadingAi(false);
  }
};
    // ========================================================
    // EDIT PROJECT
    // ========================================================

    const handleEditProject = (
        project
    ) => {
        if (!project) {
            setMessage({
                type: "error",
                text:
                    "Project not found.",
            });

            return;
        }

        setMessage(null);
        setEditProject(project);
    };

    // ========================================================
    // CLOSE EDIT PROJECT
    // ========================================================

    const handleCloseEditProject = () => {
        if (actionLoading) {
            return;
        }

        setEditProject(null);
    };

    // ========================================================
    // SAVE EDITED PROJECT
    // ========================================================

    const handleUpdateProject =
        async (updatedProject) => {
            if (!updatedProject) {
                return;
            }

            const projectId =
                updatedProject.id ??
                updatedProject.projectId;

            if (!projectId) {
                setMessage({
                    type: "error",
                    text:
                        "Project ID is required.",
                });

                return;
            }

            const existingProject =
                projects.find(
                    (project) =>
                        project.id ===
                        projectId
                );

            if (!existingProject) {
                setEditProject(null);

                setMessage({
                    type: "error",
                    text:
                        "Project not found.",
                });

                return;
            }

            const updatedName =
                String(
                    updatedProject.name ||
                        ""
                ).trim();

            if (!updatedName) {
                setMessage({
                    type: "error",
                    text:
                        "Project name is required.",
                });

                return;
            }

            const duplicateProject =
                projects.some(
                    (project) =>
                        project.id !==
                            projectId &&
                        String(
                            project.name ||
                                ""
                        )
                            .trim()
                            .toLowerCase() ===
                            updatedName.toLowerCase()
                );

            if (duplicateProject) {
                setMessage({
                    type: "error",
                    text:
                        "Another project with this name already exists.",
                });

                return;
            }

            try {
                setActionLoading(true);
                setMessage(null);

                const selectedTeam =
                    teams.find(
                        (team) =>
                            team.name ===
                            updatedProject.team
                    );

                const requestData = {
                    ...updatedProject,

                    id: projectId,

                    projectId,

                    name: updatedName,

                    description:
                        String(
                            updatedProject.description ||
                                ""
                        ).trim(),

                    manager:
                        updatedProject.manager ||
                        "Not assigned",

                    team:
                        updatedProject.team ||
                        "No team assigned",

                    teamLeader:
                        updatedProject.teamLeader ||
                        selectedTeam?.teamLeader ||
                        existingProject.teamLeader ||
                        "Not assigned",

                    status:
                        updatedProject.status ||
                        existingProject.status ||
                        "Planning",

                    startDate:
                        updatedProject.startDate ||
                        null,

                    deadline:
                        updatedProject.deadline ||
                        null,

                    progress:
                        Number(
                            updatedProject.progress
                        ) || 0,

                    tasks:
                        Number(
                            updatedProject.tasks
                        ) || 0,

                    activeTasks:
                        Number(
                            updatedProject.activeTasks
                        ) || 0,

                    sprints:
                        Number(
                            updatedProject.sprints
                        ) || 0,

                    completedAt:
                        updatedProject.completedAt ??
                        existingProject.completedAt ??
                        null,

                    completionNote:
                        updatedProject.completionNote ??
                        existingProject.completionNote ??
                        null,
                };

                console.log(
                    "UPDATE PROJECT REQUEST:",
                    requestData
                );

                const response =
                    await updateProject(
                        projectId,
                        requestData
                    );

                console.log(
                    "UPDATE PROJECT RESPONSE:",
                    response
                );

                setEditProject(
                    null
                );

                setMessage({
                    type: "success",
                    text:
                        response?.message ||
                        "Project updated successfully.",
                });

                await loadProjects();
            } catch (error) {
                console.error(
                    "UPDATE PROJECT ERROR:",
                    error
                );

                setMessage({
                    type: "error",
                    text:
                        error?.message ||
                        "Unable to update project.",
                });
            } finally {
                setActionLoading(false);
            }
        };

    // ========================================================
    // OPEN DELETE DIALOG
    // ========================================================

    const handleOpenDeleteProject =
        (project) => {
            if (!project) {
                setMessage({
                    type: "error",
                    text:
                        "Project not found.",
                });

                return;
            }

            setMessage(null);
            setDeleteProjectState(
                project
            );
        };

    // ========================================================
    // CLOSE DELETE DIALOG
    // ========================================================

    const handleCloseDeleteProject =
        () => {
            if (actionLoading) {
                return;
            }

            setDeleteProjectState(
                null
            );
        };

    // ========================================================
    // DELETE PROJECT
    //
    // BACKEND VERSION
    // ========================================================

    const handleDeleteProject =
        async (
            projectToDelete = null
        ) => {
            const targetProject =
                projectToDelete ||
                deleteProjectState;

            if (!targetProject) {
                setMessage({
                    type: "error",
                    text:
                        "No project selected for deletion.",
                });

                return;
            }

            const targetId =
                targetProject.id ??
                targetProject.projectId;

            if (!targetId) {
                setMessage({
                    type: "error",
                    text:
                        "Project ID is required.",
                });

                return;
            }

            const existingProject =
                projects.find(
                    (project) =>
                        project.id ===
                        targetId
                );

            if (!existingProject) {
                setDeleteProjectState(
                    null
                );

                setMessage({
                    type: "error",
                    text:
                        "Project could not be found.",
                });

                return;
            }

            try {
                setActionLoading(true);
                setMessage(null);

                console.log(
                    "DELETE PROJECT ID:",
                    targetId
                );

                const response =
                    await deleteProject(
                        targetId
                    );

                console.log(
                    "DELETE PROJECT RESPONSE:",
                    response
                );

                setDeleteProjectState(
                    null
                );

                setSelectedProject(
                    null
                );

                setDialogType(null);

                setMessage({
                    type: "success",
                    text:
                        response?.message ||
                        `"${existingProject.name}" deleted successfully.`,
                });

                await loadProjects();
            } catch (error) {
                console.error(
                    "DELETE PROJECT ERROR:",
                    error
                );

                setMessage({
                    type: "error",
                    text:
                        error?.message ||
                        "Unable to delete project.",
                });
            } finally {
                setActionLoading(false);
            }
        };

    // ========================================================
    // FILTER PROJECTS
    // ========================================================

    const filteredProjects =
        useMemo(() => {
            const search =
                searchTerm
                    .toLowerCase()
                    .trim();

            return projects.filter(
                (project) => {
                    const searchableFields =
                        [
                            project.name,
                            project.manager,
                            project.team,
                            project.teamLeader,
                            project.description,
                            project.status,
                        ];

                    const matchesSearch =
                        searchableFields.some(
                            (field) =>
                                String(
                                    field ||
                                        ""
                                )
                                    .toLowerCase()
                                    .includes(
                                        search
                                    )
                        );

                    const matchesStatus =
                        statusFilter ===
                            "All" ||
                        project.status ===
                            statusFilter;

                    return (
                        matchesSearch &&
                        matchesStatus
                    );
                }
            );
        }, [
            projects,
            searchTerm,
            statusFilter,
        ]);

    // ========================================================
    // PROJECT STATISTICS
    // ========================================================

    const totalProjects =
        projects.length;

    const activeProjects =
        projects.filter(
            (project) =>
                project.status ===
                "Active"
        ).length;

    const completedProjects =
        projects.filter(
            (project) =>
                project.status ===
                "Completed"
        ).length;

    const archivedProjects =
        projects.filter(
            (project) =>
                project.status ===
                "Archived"
        ).length;

    // ========================================================
    // OPEN PROJECT DIALOG
    // ========================================================

    const openProjectDialog = (
        project,
        type
    ) => {
        if (!project) {
            return;
        }

        setSelectedProject(
            project
        );

        setDialogType(type);
        setMessage(null);
    };

    // ========================================================
    // CLOSE PROJECT DIALOG
    // ========================================================

    const closeProjectDialog = () => {
        if (actionLoading) {
            return;
        }

        setSelectedProject(null);
        setDialogType(null);
    };

    // ========================================================
    // ARCHIVE PROJECT
    //
    // BACKEND VERSION
    // ========================================================

    const handleArchive =
        async () => {
            if (!selectedProject) {
                return;
            }

            const projectId =
                selectedProject.id ??
                selectedProject.projectId;

            if (!projectId) {
                setMessage({
                    type: "error",
                    text:
                        "Project ID is required.",
                });

                return;
            }

            if (
                Number(
                    selectedProject.activeTasks
                ) > 0
            ) {
                setMessage({
                    type: "error",
                    text:
                        "Complete or reassign active tasks before archiving.",
                });

                closeProjectDialog();

                return;
            }

            try {
                setActionLoading(true);
                setMessage(null);

                console.log(
                    "ARCHIVE PROJECT ID:",
                    projectId
                );

                const response =
                    await archiveProject(
                        projectId
                    );

                console.log(
                    "ARCHIVE PROJECT RESPONSE:",
                    response
                );

                setMessage({
                    type: "success",
                    text:
                        response?.message ||
                        "Project archived successfully.",
                });

                closeProjectDialog();

                await loadProjects();
            } catch (error) {
                console.error(
                    "ARCHIVE PROJECT ERROR:",
                    error
                );

                setMessage({
                    type: "error",
                    text:
                        error?.message ||
                        "Unable to archive project.",
                });
            } finally {
                setActionLoading(false);
            }
        };

    // ========================================================
    // RESTORE PROJECT
    //
    // BACKEND VERSION
    // ========================================================

    const handleRestore =
        async () => {
            if (!selectedProject) {
                return;
            }

            const projectId =
                selectedProject.id ??
                selectedProject.projectId;

            if (!projectId) {
                setMessage({
                    type: "error",
                    text:
                        "Project ID is required.",
                });

                return;
            }

            try {
                setActionLoading(true);
                setMessage(null);

                console.log(
                    "RESTORE PROJECT ID:",
                    projectId
                );

                const response =
                    await restoreProject(
                        projectId
                    );

                console.log(
                    "RESTORE PROJECT RESPONSE:",
                    response
                );

                setMessage({
                    type: "success",
                    text:
                        response?.message ||
                        "Project restored successfully.",
                });

                closeProjectDialog();

                await loadProjects();
            } catch (error) {
                console.error(
                    "RESTORE PROJECT ERROR:",
                    error
                );

                setMessage({
                    type: "error",
                    text:
                        error?.message ||
                        "Unable to restore project.",
                });
            } finally {
                setActionLoading(false);
            }
        };

    // ========================================================
    // STATUS STYLE
    // ========================================================

    const getStatusStyle = (
        status
    ) => {
        switch (status) {
            case "Active":
                return `
                    border-emerald-500/30
                    bg-emerald-500/10
                    text-emerald-600
                    dark:text-emerald-300
                `;

            case "Planning":
                return `
                    border-blue-500/30
                    bg-blue-500/10
                    text-blue-600
                    dark:text-blue-300
                `;

            case "Completed":
                return `
                    border-violet-500/30
                    bg-violet-500/10
                    text-violet-600
                    dark:text-violet-300
                `;

            case "Archived":
                return `
                    border-slate-400/40
                    bg-slate-500/10
                    text-slate-600
                    dark:text-slate-300
                `;

            case "On Hold":
                return `
                    border-amber-500/30
                    bg-amber-500/10
                    text-amber-600
                    dark:text-amber-300
                `;

            default:
                return `
                    border-blue-500/30
                    bg-blue-500/10
                    text-blue-600
                    dark:text-blue-300
                `;
        }
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div
            className="
                min-h-screen
                bg-background
                p-4
                text-foreground
                transition-colors
                duration-300
                md:p-6
            "
        >
            {/* ==================================================
                PAGE HEADER
            ================================================== */}

            <div
                className="
                    mb-6
                    flex
                    flex-col
                    gap-4
                    md:flex-row
                    md:items-center
                    md:justify-between
                "
            >
                <div>
                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >
                        <div
                            className="
                                flex
                                h-12
                                w-12
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-blue-200
                                bg-blue-50
                                text-blue-600
                                shadow-sm
                                transition-all
                                duration-300
                                hover:-translate-y-1
                                hover:scale-105
                                hover:border-cyan-400
                                hover:bg-cyan-50
                                hover:text-cyan-600
                                dark:border-blue-700
                                dark:bg-blue-900/60
                                dark:text-blue-200
                                dark:hover:bg-blue-800
                                dark:hover:text-white
                            "
                        >
                            <FolderKanban size={23} />
                        </div>

                        <div>
                            <h1
                                className="
                                    text-2xl
                                    font-bold
                                    text-foreground
                                "
                            >
                                Project Oversight
                            </h1>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-muted-foreground
                                "
                            >
                                Create, edit, delete and
                                monitor all organization
                                projects.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={loadProjects}
                        disabled={
                            loading ||
                            actionLoading
                        }
                        className="
                            h-11
                            rounded-xl
                            border-border
                            bg-background
                            px-4
                            text-foreground
                            transition-all
                            duration-300
                            hover:border-cyan-400
                            hover:bg-cyan-500/10
                            hover:text-cyan-600
                        "
                    >
                        <RefreshCw
                            size={17}
                            className={
                                loading
                                    ? "mr-2 animate-spin"
                                    : "mr-2"
                            }
                        />

                        Refresh
                    </Button>

                    <Button
                        type="button"
                        onClick={
                            handleCreateProject
                        }
                        disabled={
                            actionLoading
                        }
                        className="
                            h-11
                            rounded-xl
                            border
                            border-blue-600
                            bg-blue-600
                            px-5
                            text-sm
                            font-semibold
                            text-white
                            shadow-md
                            transition-all
                            duration-300
                            hover:-translate-y-0.5
                            hover:scale-[1.02]
                            hover:border-cyan-400
                            hover:bg-blue-700
                            hover:shadow-lg
                            hover:shadow-cyan-500/20
                            dark:border-blue-500
                            dark:bg-blue-700
                            dark:hover:bg-blue-600
                        "
                    >
                        <Plus
                            size={18}
                            className="mr-2"
                        />

                        Create Project
                    </Button>
                </div>
            </div>

            {/* ==================================================
                MESSAGE
            ================================================== */}

            {message && (
                <div
                    className={`
                        mb-6
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        border
                        px-4
                        py-3
                        text-sm
                        font-medium

                        ${
                            message.type ===
                            "success"
                                ? `
                                    border-emerald-500/30
                                    bg-emerald-500/10
                                    text-emerald-700
                                    dark:text-emerald-300
                                `
                                : `
                                    border-red-500/30
                                    bg-red-500/10
                                    text-red-700
                                    dark:text-red-300
                                `
                        }
                    `}
                >
                    {message.type ===
                    "success" ? (
                        <CheckCircle2
                            size={18}
                        />
                    ) : (
                        <XCircle
                            size={18}
                        />
                    )}

                    <span className="flex-1 whitespace-pre-line">
                        {message.text}
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            setMessage(
                                null
                            )
                        }
                        className="
                            rounded-md
                            p-1
                            transition-colors
                            hover:bg-black/5
                            dark:hover:bg-white/10
                        "
                    >
                        <X size={17} />
                    </button>
                </div>
            )}

            {/* ==================================================
                SUMMARY CARDS
            ================================================== */}

            <div
                className="
                    mb-6
                    grid
                    grid-cols-1
                    gap-4
                    md:grid-cols-2
                    xl:grid-cols-4
                "
            >
                {/* TOTAL */}

                <div
                    className="
                        group
                        rounded-2xl
                        border
                        border-border
                        bg-card
                        p-5
                        shadow-sm
                        transition-all
                        duration-300
                        hover:-translate-y-1
                        hover:border-cyan-400/60
                        hover:shadow-lg
                        hover:shadow-cyan-500/10
                    "
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Total Projects
                            </p>

                            <p className="mt-2 text-3xl font-bold text-foreground">
                                {loading
                                    ? "—"
                                    : totalProjects}
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                                All organization projects
                            </p>
                        </div>

                        <div
                            className="
                                flex
                                h-12
                                w-12
                                items-center
                                justify-center
                                rounded-xl
                                bg-cyan-500/10
                                text-cyan-600
                                ring-1
                                ring-cyan-500/20
                                transition-all
                                duration-300
                                group-hover:bg-cyan-500
                                group-hover:text-white
                                dark:text-cyan-400
                            "
                        >
                            <FolderKanban size={22} />
                        </div>
                    </div>
                </div>

                {/* ACTIVE */}

                <div
                    className="
                        group
                        rounded-2xl
                        border
                        border-border
                        bg-card
                        p-5
                        shadow-sm
                        transition-all
                        duration-300
                        hover:-translate-y-1
                        hover:border-emerald-400/60
                        hover:shadow-lg
                        hover:shadow-emerald-500/10
                    "
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Active Projects
                            </p>

                            <p className="mt-2 text-3xl font-bold text-foreground">
                                {loading
                                    ? "—"
                                    : activeProjects}
                            </p>

                            <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-300">
                                Currently active
                            </p>
                        </div>

                        <div
                            className="
                                flex
                                h-12
                                w-12
                                items-center
                                justify-center
                                rounded-xl
                                bg-emerald-500/10
                                text-emerald-600
                                ring-1
                                ring-emerald-500/20
                                transition-all
                                duration-300
                                group-hover:bg-emerald-500
                                group-hover:text-white
                                dark:text-emerald-400
                            "
                        >
                            <CheckCircle2 size={22} />
                        </div>
                    </div>
                </div>

                {/* COMPLETED */}

                <div
                    className="
                        group
                        rounded-2xl
                        border
                        border-border
                        bg-card
                        p-5
                        shadow-sm
                        transition-all
                        duration-300
                        hover:-translate-y-1
                        hover:border-violet-400/60
                        hover:shadow-lg
                        hover:shadow-violet-500/10
                    "
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Completed Projects
                            </p>

                            <p className="mt-2 text-3xl font-bold text-foreground">
                                {loading
                                    ? "—"
                                    : completedProjects}
                            </p>

                            <p className="mt-1 text-xs text-violet-600 dark:text-violet-300">
                                Successfully completed
                            </p>
                        </div>

                        <div
                            className="
                                flex
                                h-12
                                w-12
                                items-center
                                justify-center
                                rounded-xl
                                bg-violet-500/10
                                text-violet-600
                                ring-1
                                ring-violet-500/20
                                transition-all
                                duration-300
                                group-hover:bg-violet-500
                                group-hover:text-white
                                dark:text-violet-400
                            "
                        >
                            <CheckCircle2 size={22} />
                        </div>
                    </div>
                </div>

                {/* ARCHIVED */}

                <div
                    className="
                        group
                        rounded-2xl
                        border
                        border-border
                        bg-card
                        p-5
                        shadow-sm
                        transition-all
                        duration-300
                        hover:-translate-y-1
                        hover:border-slate-400/60
                        hover:shadow-lg
                    "
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Archived Projects
                            </p>

                            <p className="mt-2 text-3xl font-bold text-foreground">
                                {loading
                                    ? "—"
                                    : archivedProjects}
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                                Stored projects
                            </p>
                        </div>

                        <div
                            className="
                                flex
                                h-12
                                w-12
                                items-center
                                justify-center
                                rounded-xl
                                bg-slate-500/10
                                text-slate-600
                                ring-1
                                ring-slate-400/20
                                transition-all
                                duration-300
                                group-hover:bg-slate-500
                                group-hover:text-white
                                dark:text-slate-300
                            "
                        >
                            <Archive size={22} />
                        </div>
                    </div>
                </div>
            </div>

            {/* ==================================================
                PROJECT SECTION
            ================================================== */}

            <div
                className="
                    overflow-hidden
                    rounded-2xl
                    border
                    border-border
                    bg-card
                    shadow-sm
                "
            >
                <div
                    className="
                        border-b
                        border-border
                        bg-muted/30
                        px-5
                        py-5
                    "
                >
                    <div
                        className="
                            flex
                            flex-col
                            gap-4
                            lg:flex-row
                            lg:items-center
                            lg:justify-between
                        "
                    >
                        <div>
                            <div className="flex items-center gap-2">
                                <FolderKanban
                                    size={19}
                                    className="text-blue-600 dark:text-blue-300"
                                />

                                <h2
                                    className="
                                        text-base
                                        font-semibold
                                        text-foreground
                                    "
                                >
                                    Organization Projects
                                </h2>
                            </div>

                            <p
                                className="
                                    mt-1
                                    text-xs
                                    text-muted-foreground
                                "
                            >
                                View and manage every
                                project with all project
                                information in one place.
                            </p>
                        </div>

                        <div
                            className="
                                relative
                                w-full
                                lg:max-w-sm
                            "
                        >
                            <Search
                                size={18}
                                className="
                                    pointer-events-none
                                    absolute
                                    left-3
                                    top-1/2
                                    z-10
                                    -translate-y-1/2
                                    text-muted-foreground
                                "
                            />

                            <Input
                                type="text"
                                value={
                                    searchTerm
                                }
                                onChange={(
                                    event
                                ) =>
                                    setSearchTerm(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                placeholder="Search projects..."
                                className="
                                    h-10
                                    w-full
                                    border-border
                                    bg-background
                                    pl-10
                                    text-sm
                                    text-foreground
                                    placeholder:text-muted-foreground
                                    transition-all
                                    duration-300
                                    hover:border-blue-400
                                    focus:border-cyan-400
                                    focus:ring-2
                                    focus:ring-cyan-400/20
                                "
                            />
                        </div>
                    </div>

                    {/* STATUS FILTER */}

                    <div
                        className="
                            mt-4
                            flex
                            flex-wrap
                            gap-2
                        "
                    >
                        {[
                            "All",
                            "Planning",
                            "Active",
                            "Completed",
                            "Archived",
                        ].map(
                            (status) => (
                                <button
                                    key={
                                        status
                                    }
                                    type="button"
                                    onClick={() =>
                                        setStatusFilter(
                                            status
                                        )
                                    }
                                    className={`rounded-lg border px-4 py-2 text-xs font-semibold transition-all duration-300 ${
                                        statusFilter ===
                                        status
                                            ? "border-blue-500 bg-blue-600 text-white shadow-md"
                                            : "border-border bg-background text-muted-foreground hover:border-blue-400 hover:bg-blue-500/5 hover:text-blue-600 dark:hover:text-blue-300"
                                    }`}
                                >
                                    {
                                        status
                                    }
                                </button>
                            )
                        )}
                    </div>
                </div>

                {/* ==================================================
                    LOADING
                ================================================== */}

                {loading ? (
                    <div
                        className="
                            flex
                            min-h-[350px]
                            flex-col
                            items-center
                            justify-center
                            bg-background/40
                            p-8
                        "
                    >
                        <Loader2
                            size={42}
                            className="
                                animate-spin
                                text-cyan-500
                            "
                        />

                        <p className="mt-4 text-sm font-medium text-foreground">
                            Loading projects...
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                            Connecting to the project
                            server.
                        </p>
                    </div>
                ) : (
                    /* ==================================================
                        PROJECT CARDS
                    ================================================== */

                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-5
                            bg-background/40
                            p-5
                            lg:grid-cols-2
                        "
                    >
                        {filteredProjects.length >
                        0 ? (
                            filteredProjects.map(
                                (
                                    project
                                ) => (
                                    <div
                                        key={
                                            project.id
                                        }
                                        className="
                                            group
                                            relative
                                            overflow-hidden
                                            rounded-2xl
                                            border
                                            border-border
                                            bg-card
                                            p-5
                                            shadow-sm
                                            transition-all
                                            duration-300
                                            hover:-translate-y-1
                                            hover:border-cyan-400/60
                                            hover:shadow-xl
                                            hover:shadow-cyan-500/10
                                        "
                                    >
                                        <div
                                            className="
                                                pointer-events-none
                                                absolute
                                                inset-x-0
                                                top-0
                                                h-px
                                                bg-gradient-to-r
                                                from-transparent
                                                via-cyan-400
                                                to-transparent
                                                opacity-0
                                                transition-opacity
                                                duration-300
                                                group-hover:opacity-100
                                            "
                                        />

                                        {/* HEADER */}

                                        <div
                                            className="
                                                flex
                                                flex-col
                                                gap-4
                                                border-b
                                                border-border
                                                pb-5
                                                sm:flex-row
                                                sm:items-start
                                                sm:justify-between
                                            "
                                        >
                                            <div className="min-w-0">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openProjectDialog(
                                                            project,
                                                            "view"
                                                        )
                                                    }
                                                    className="
                                                        block
                                                        max-w-full
                                                        truncate
                                                        text-left
                                                        text-xl
                                                        font-bold
                                                        text-foreground
                                                        transition-all
                                                        duration-300
                                                        hover:text-cyan-600
                                                        dark:hover:text-cyan-300
                                                    "
                                                >
                                                    {
                                                        project.name
                                                    }
                                                </button>

                                                <p
                                                    className="
                                                        mt-2
                                                        line-clamp-2
                                                        text-sm
                                                        leading-6
                                                        text-muted-foreground
                                                    "
                                                >
                                                    {
                                                        project.description
                                                    }
                                                </p>
                                            </div>

                                            <span
                                                className={`
                                                    inline-flex
                                                    shrink-0
                                                    items-center
                                                    rounded-full
                                                    border
                                                    px-3
                                                    py-1.5
                                                    text-xs
                                                    font-semibold
                                                    ${getStatusStyle(
                                                        project.status
                                                    )}
                                                `}
                                            >
                                                {
                                                    project.status
                                                }
                                            </span>
                                        </div>

                                        {/* INFORMATION */}

                                        <div
                                            className="
                                                mt-5
                                                grid
                                                grid-cols-1
                                                gap-4
                                                sm:grid-cols-2
                                            "
                                        >
                                            <div
                                                className="
                                                    rounded-xl
                                                    border
                                                    border-border
                                                    bg-muted/30
                                                    p-4
                                                "
                                            >
                                                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                                    <UserRound
                                                        size={
                                                            15
                                                        }
                                                        className="text-cyan-500"
                                                    />
                                                    Project
                                                    Manager
                                                </div>

                                                <p className="mt-2 truncate text-sm font-semibold text-foreground">
                                                    {
                                                        project.manager
                                                    }
                                                </p>
                                            </div>

                                            <div
                                                className="
                                                    rounded-xl
                                                    border
                                                    border-border
                                                    bg-muted/30
                                                    p-4
                                                "
                                            >
                                                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                                    <UsersRound
                                                        size={
                                                            15
                                                        }
                                                        className="text-blue-500"
                                                    />
                                                    Assigned
                                                    Team
                                                </div>

                                                <p className="mt-2 truncate text-sm font-semibold text-foreground">
                                                    {
                                                        project.team
                                                    }
                                                </p>
                                            </div>

                                            <div
                                                className="
                                                    rounded-xl
                                                    border
                                                    border-border
                                                    bg-muted/30
                                                    p-4
                                                "
                                            >
                                                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                                    <UserCog
                                                        size={
                                                            15
                                                        }
                                                        className="text-violet-500"
                                                    />
                                                    Team
                                                    Leader
                                                </div>

                                                <p className="mt-2 truncate text-sm font-semibold text-foreground">
                                                    {
                                                        project.teamLeader
                                                    }
                                                </p>
                                            </div>

                                            <div
                                                className="
                                                    rounded-xl
                                                    border
                                                    border-border
                                                    bg-muted/30
                                                    p-4
                                                "
                                            >
                                                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                                    <Clock3
                                                        size={
                                                            15
                                                        }
                                                        className="text-cyan-500"
                                                    />
                                                    Start
                                                    Date
                                                </div>

                                                <p className="mt-2 text-sm font-semibold text-foreground">
                                                    {
                                                        project.startDate ||
                                                        "Not set"
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        {/* PROGRESS */}

                                        <div
                                            className="
                                                mt-5
                                                rounded-xl
                                                border
                                                border-border
                                                bg-muted/30
                                                p-4
                                            "
                                        >
                                            <div className="mb-3 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle2
                                                        size={
                                                            16
                                                        }
                                                        className="text-cyan-500"
                                                    />

                                                    <span className="text-sm font-semibold text-foreground">
                                                        Project
                                                        Progress
                                                    </span>
                                                </div>

                                                <span className="text-sm font-bold text-cyan-600 dark:text-cyan-300">
                                                    {
                                                        project.progress
                                                    }
                                                    %
                                                </span>
                                            </div>

                                            <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                                                <div
                                                    className="
                                                        h-full
                                                        rounded-full
                                                        bg-cyan-500
                                                        transition-all
                                                        duration-500
                                                    "
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

                                        {/* TASK / SPRINT */}

                                        <div
                                            className="
                                                mt-4
                                                grid
                                                grid-cols-2
                                                gap-4
                                            "
                                        >
                                            <div
                                                className="
                                                    rounded-xl
                                                    border
                                                    border-border
                                                    bg-muted/30
                                                    p-4
                                                "
                                            >
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <ListTodo
                                                        size={
                                                            15
                                                        }
                                                        className="text-blue-500"
                                                    />
                                                    Total
                                                    Tasks
                                                </div>

                                                <p className="mt-2 text-2xl font-bold text-foreground">
                                                    {
                                                        project.tasks
                                                    }
                                                </p>
                                            </div>

                                            <div
                                                className="
                                                    rounded-xl
                                                    border
                                                    border-border
                                                    bg-muted/30
                                                    p-4
                                                "
                                            >
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <ListChecks
                                                        size={
                                                            15
                                                        }
                                                        className="text-violet-500"
                                                    />
                                                    Sprints
                                                </div>

                                                <p className="mt-2 text-2xl font-bold text-foreground">
                                                    {
                                                        project.sprints
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        {/* ACTIONS */}

                                        <div
                                            className="
                                                mt-5
                                                flex
                                                flex-col
                                                gap-2
                                                border-t
                                                border-border
                                                pt-5
                                                sm:flex-row
                                                sm:flex-wrap
                                            "
                                        >
                                         <Button
    type="button"
    variant="outline"
    onClick={() => handleGetAiInsight(project)}
    disabled={actionLoading || loadingAi}
    className="flex-1 gap-2 border-violet-500/50 bg-background text-violet-600 hover:border-violet-400 hover:bg-violet-500/10 dark:text-violet-300"
  >
    {loadingAi ? (
      <Loader2 size={16} className="animate-spin" />
    ) : (
      <Trophy size={16} />
    )}
    AI Insights
  </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    openProjectDialog(
                                                        project,
                                                        "view"
                                                    )
                                                }
                                                className="
                                                    flex-1
                                                    gap-2
                                                    border-border
                                                    bg-background
                                                    text-foreground
                                                    hover:border-cyan-400
                                                    hover:bg-cyan-500/10
                                                    hover:text-cyan-600
                                                    dark:hover:text-cyan-300
                                                "
                                            >
                                                <FolderKanban
                                                    size={
                                                        16
                                                    }
                                                />
                                                View
                                            </Button>

                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    handleEditProject(
                                                        project
                                                    )
                                                }
                                                disabled={
                                                    actionLoading
                                                }
                                                className="
                                                    flex-1
                                                    border-border
                                                    bg-background
                                                    text-foreground
                                                    hover:border-cyan-400
                                                    hover:bg-cyan-500/10
                                                    hover:text-cyan-600
                                                "
                                            >
                                                Edit
                                            </Button>

                                            {project.status !==
                                                "Archived" && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() =>
                                                        openProjectDialog(
                                                            project,
                                                            "archive"
                                                        )
                                                    }
                                                    disabled={
                                                        actionLoading
                                                    }
                                                    className="
                                                        flex-1
                                                        gap-2
                                                        border-border
                                                        bg-background
                                                        text-foreground
                                                        hover:border-amber-400
                                                        hover:bg-amber-500/10
                                                        hover:text-amber-600
                                                    "
                                                >
                                                    <Archive
                                                        size={
                                                            16
                                                        }
                                                    />
                                                    Archive
                                                </Button>
                                            )}

                                            {project.status ===
                                                "Archived" && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() =>
                                                        openProjectDialog(
                                                            project,
                                                            "restore"
                                                        )
                                                    }
                                                    disabled={
                                                        actionLoading
                                                    }
                                                    className="
                                                        flex-1
                                                        gap-2
                                                        border-border
                                                        bg-background
                                                        text-foreground
                                                        hover:border-cyan-400
                                                        hover:bg-cyan-500/10
                                                        hover:text-cyan-600
                                                    "
                                                >
                                                    <ArchiveRestore
                                                        size={
                                                            16
                                                        }
                                                    />
                                                    Restore
                                                </Button>
                                            )}

                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    handleOpenDeleteProject(
                                                        project
                                                    )
                                                }
                                                disabled={
                                                    actionLoading
                                                }
                                                className="
                                                    flex-1
                                                    gap-2
                                                    border-red-500/50
                                                    bg-background
                                                    text-red-600
                                                    hover:border-red-400
                                                    hover:bg-red-500/10
                                                    dark:text-red-300
                                                "
                                            >
                                                <Trash2
                                                    size={
                                                        16
                                                    }
                                                />
                                                Delete
                                            </Button>
                                        </div>
                                        {/* ==================================================
    AI INSIGHT MODAL (AI-002: Predict Project Risk)
================================================== */}
<Dialog open={aiInsightOpen} onOpenChange={setAiInsightOpen}>
  <DialogContent className="max-w-2xl border-violet-500/30 bg-background">
    <DialogHeader>
      <DialogTitle className="flex items-center gap-2 text-violet-600">
        <Trophy size={20} />
        AI Project Risk Analysis
      </DialogTitle>
      <DialogDescription>
        AI-generated risk assessment for: <strong>{selectedProject?.name || "Selected Project"}</strong>
      </DialogDescription>
    </DialogHeader>

    {loadingAi ? (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 size={32} className="animate-spin text-violet-500" />
        <p className="mt-4 text-sm text-muted-foreground">Analyzing project data...</p>
      </div>
    ) : aiInsightData?.error ? (
      <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-600">
        {aiInsightData.error}
      </div>
    ) : aiInsightData ? (
      <div className="space-y-4">
        {/* Risk Level & Score */}
        <div className="flex items-center gap-4 rounded-xl border border-border bg-muted/30 p-4">
          <div className={`flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold ${
            aiInsightData.riskLevel === 'High' ? 'bg-red-500/10 text-red-600' :
            aiInsightData.riskLevel === 'Medium' ? 'bg-amber-500/10 text-amber-600' :
            'bg-emerald-500/10 text-emerald-600'
          }`}>
            {aiInsightData.riskScore}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Overall Risk Level</p>
            <p className="text-xl font-bold text-foreground">{aiInsightData.riskLevel} Risk</p>
          </div>
        </div>

        {/* Summary */}
        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <p className="text-sm font-semibold text-foreground">AI Summary</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{aiInsightData.summary}</p>
        </div>

        {/* Supporting Factors */}
        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <p className="text-sm font-semibold text-foreground">Supporting Factors</p>
          <ul className="mt-2 space-y-2">
            {aiInsightData.supportingFactors?.map((factor, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />
                {factor}
              </li>
            ))}
          </ul>
        </div>
      </div>
    ) : null}

    <DialogFooter>
      <Button onClick={() => setAiInsightOpen(false)} className="bg-violet-600 text-white hover:bg-violet-700">
        Close
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
                                    </div>
                                )
                            )
                        ) : (
                            <div
                                className="
                                    col-span-full
                                    rounded-2xl
                                    border
                                    border-border
                                    bg-card
                                    px-6
                                    py-16
                                    text-center
                                "
                            >
                                <FolderKanban
                                    size={44}
                                    className="mx-auto text-muted-foreground"
                                />

                                <h3 className="mt-4 font-semibold text-foreground">
                                    No projects found
                                </h3>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Try changing your
                                    search or status
                                    filter.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ==================================================
                CREATE PROJECT MODAL
            ================================================== */}

        <CreateProjectModal
    open={createProjectOpen}
    onClose={handleCloseCreateProject}
    onSave={handleSaveProject}
    existingProjects={projects}
    managers={managers} // 🌟 ADD THIS LINE
    teams={teams}
    teamLeaders={teamLeaders}
/>

            {/* ==================================================
                EDIT PROJECT MODAL
            ================================================== */}

            <EditProjectModal
                open={Boolean(
                    editProject
                )}
                project={
                    editProject
                }
                onClose={
                    handleCloseEditProject
                }
                onSave={
                    handleUpdateProject
                }
                existingProjects={
                    projects
                }
                managers={managers}
                teams={teams}
            />

            {/* ==================================================
                DELETE PROJECT DIALOG
            ================================================== */}

            <DeleteProjectDialog
                open={Boolean(
                    deleteProjectState
                )}
                project={
                    deleteProjectState
                }
                onClose={
                    handleCloseDeleteProject
                }
                onDelete={() =>
                    handleDeleteProject(
                        deleteProjectState
                    )
                }
            />

            {/* ==================================================
                VIEW / ARCHIVE / RESTORE DIALOG
            ================================================== */}

            <Dialog
                open={Boolean(
                    selectedProject
                )}
                onOpenChange={(
                    open
                ) => {
                    if (
                        !open &&
                        !actionLoading
                    ) {
                        closeProjectDialog();
                    }
                }}
            >
                <DialogContent
                    className="
                        max-h-[90vh]
                        overflow-y-auto
                        border-border
                        bg-background
                        text-foreground
                        shadow-2xl
                        sm:max-w-2xl
                    "
                >
                    {/* ==================================================
                        VIEW
                    ================================================== */}

                    {dialogType ===
                        "view" && (
                        <>
                            <DialogHeader>
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <DialogTitle
                                            className="
                                                text-2xl
                                                font-bold
                                                text-foreground
                                            "
                                        >
                                            {
                                                selectedProject?.name
                                            }
                                        </DialogTitle>

                                        <DialogDescription
                                            className="
                                                mt-2
                                                text-muted-foreground
                                            "
                                        >
                                            Complete project
                                            information and
                                            current project
                                            status.
                                        </DialogDescription>
                                    </div>

                                    {selectedProject && (
                                        <span
                                            className={`
                                                inline-flex
                                                shrink-0
                                                rounded-full
                                                border
                                                px-3
                                                py-1.5
                                                text-xs
                                                font-semibold
                                                ${getStatusStyle(
                                                    selectedProject.status
                                                )}
                                            `}
                                        >
                                            {
                                                selectedProject.status
                                            }
                                        </span>
                                    )}
                                </div>
                            </DialogHeader>

                            <div className="space-y-5">
                                {/* DESCRIPTION */}

                                <div
                                    className="
                                        rounded-xl
                                        border
                                        border-border
                                        bg-muted/30
                                        p-5
                                    "
                                >
                                    <div className="flex items-center gap-2">
                                        <FolderKanban
                                            size={
                                                17
                                            }
                                            className="text-cyan-500"
                                        />

                                        <p
                                            className="
                                                text-xs
                                                font-semibold
                                                uppercase
                                                tracking-wide
                                                text-muted-foreground
                                            "
                                        >
                                            Project
                                            Description
                                        </p>
                                    </div>

                                    <p
                                        className="
                                            mt-3
                                            text-sm
                                            leading-6
                                            text-foreground
                                        "
                                    >
                                        {selectedProject?.description ||
                                            "No description provided."}
                                    </p>
                                </div>

                                {/* OWNERSHIP */}

                                <div>
                                    <h3 className="mb-3 text-sm font-semibold text-foreground">
                                        Project Ownership
                                    </h3>

                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                        <div className="rounded-xl border border-border bg-muted/30 p-4">
                                            <div className="flex items-center gap-2">
                                                <UserRound
                                                    size={
                                                        16
                                                    }
                                                    className="text-cyan-500"
                                                />

                                                <p className="text-xs text-muted-foreground">
                                                    Project
                                                    Manager
                                                </p>
                                            </div>

                                            <p className="mt-2 text-sm font-semibold text-foreground">
                                                {
                                                    selectedProject?.manager
                                                }
                                            </p>
                                        </div>

                                        <div className="rounded-xl border border-border bg-muted/30 p-4">
                                            <div className="flex items-center gap-2">
                                                <UsersRound
                                                    size={
                                                        16
                                                    }
                                                    className="text-blue-500"
                                                />

                                                <p className="text-xs text-muted-foreground">
                                                    Assigned
                                                    Team
                                                </p>
                                            </div>

                                            <p className="mt-2 text-sm font-semibold text-foreground">
                                                {
                                                    selectedProject?.team
                                                }
                                            </p>
                                        </div>

                                        <div className="rounded-xl border border-border bg-muted/30 p-4">
                                            <div className="flex items-center gap-2">
                                                <UserCog
                                                    size={
                                                        16
                                                    }
                                                    className="text-violet-500"
                                                />

                                                <p className="text-xs text-muted-foreground">
                                                    Team
                                                    Leader
                                                </p>
                                            </div>

                                            <p className="mt-2 text-sm font-semibold text-foreground">
                                                {
                                                    selectedProject?.teamLeader
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* DATES */}

                                <div>
                                    <h3 className="mb-3 text-sm font-semibold text-foreground">
                                        Project Timeline
                                    </h3>

                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                        <div className="rounded-xl border border-border bg-muted/30 p-4">
                                            <div className="flex items-center gap-2">
                                                <Clock3
                                                    size={
                                                        16
                                                    }
                                                    className="text-cyan-500"
                                                />

                                                <p className="text-xs text-muted-foreground">
                                                    Start
                                                    Date
                                                </p>
                                            </div>

                                            <p className="mt-2 text-sm font-semibold text-foreground">
                                                {
                                                    selectedProject?.startDate ||
                                                    "Not set"
                                                }
                                            </p>
                                        </div>

                                        <div className="rounded-xl border border-border bg-muted/30 p-4">
                                            <div className="flex items-center gap-2">
                                                <CalendarDays
                                                    size={
                                                        16
                                                    }
                                                    className="text-amber-500"
                                                />

                                                <p className="text-xs text-muted-foreground">
                                                    Deadline
                                                </p>
                                            </div>

                                            <p className="mt-2 text-sm font-semibold text-foreground">
                                                {
                                                    selectedProject?.deadline ||
                                                    "Not set"
                                                }
                                            </p>
                                        </div>

                                        <div className="rounded-xl border border-border bg-muted/30 p-4">
                                            <div className="flex items-center gap-2">
                                                <CalendarPlus
                                                    size={
                                                        16
                                                    }
                                                    className="text-blue-500"
                                                />

                                                <p className="text-xs text-muted-foreground">
                                                    Created
                                                    Date
                                                </p>
                                            </div>

                                            <p className="mt-2 text-sm font-semibold text-foreground">
                                                {
                                                    selectedProject?.createdAt ||
                                                    "Not available"
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* STATUS */}

                                <div className="rounded-xl border border-border bg-muted/30 p-5">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                Project
                                                Status
                                            </p>

                                            <div className="mt-2">
                                                <span
                                                    className={`
                                                        inline-flex
                                                        rounded-full
                                                        border
                                                        px-3
                                                        py-1.5
                                                        text-xs
                                                        font-semibold
                                                        ${getStatusStyle(
                                                            selectedProject?.status
                                                        )}
                                                    `}
                                                >
                                                    {
                                                        selectedProject?.status
                                                    }
                                                </span>
                                            </div>
                                        </div>

                                        <CheckCircle2
                                            size={
                                                28
                                            }
                                            className="text-cyan-500"
                                        />
                                    </div>
                                </div>

                                {/* PROGRESS */}

                                <div className="rounded-xl border border-border bg-muted/30 p-5">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                Progress
                                                Percentage
                                            </p>

                                            <p className="mt-1 text-2xl font-bold text-foreground">
                                                {
                                                    selectedProject?.progress
                                                }
                                                %
                                            </p>
                                        </div>

                                        <CheckCircle2
                                            size={
                                                25
                                            }
                                            className="text-cyan-500"
                                        />
                                    </div>

                                    <div className="mt-4 h-3 overflow-hidden rounded-full bg-muted">
                                        <div
                                            className="h-full rounded-full bg-cyan-500 transition-all duration-500"
                                            style={{
                                                width: `${Math.min(
                                                    Math.max(
                                                        Number(
                                                            selectedProject?.progress
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

                                {/* TASKS / SPRINTS */}

                                <div>
                                    <h3 className="mb-3 text-sm font-semibold text-foreground">
                                        Project Work
                                        Statistics
                                    </h3>

                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                        <div className="rounded-xl border border-border bg-muted/30 p-4">
                                            <div className="flex items-center gap-2">
                                                <ListTodo
                                                    size={
                                                        17
                                                    }
                                                    className="text-blue-500"
                                                />

                                                <p className="text-xs text-muted-foreground">
                                                    Number
                                                    of Tasks
                                                </p>
                                            </div>

                                            <p className="mt-2 text-2xl font-bold text-foreground">
                                                {
                                                    selectedProject?.tasks
                                                }
                                            </p>
                                        </div>

                                        <div className="rounded-xl border border-border bg-muted/30 p-4">
                                            <div className="flex items-center gap-2">
                                                <Clock3
                                                    size={
                                                        17
                                                    }
                                                    className="text-amber-500"
                                                />

                                                <p className="text-xs text-muted-foreground">
                                                    Active
                                                    Tasks
                                                </p>
                                            </div>

                                            <p className="mt-2 text-2xl font-bold text-foreground">
                                                {
                                                    selectedProject?.activeTasks
                                                }
                                            </p>
                                        </div>

                                        <div className="rounded-xl border border-border bg-muted/30 p-4">
                                            <div className="flex items-center gap-2">
                                                <ListChecks
                                                    size={
                                                        17
                                                    }
                                                    className="text-violet-500"
                                                />

                                                <p className="text-xs text-muted-foreground">
                                                    Number
                                                    of Sprints
                                                </p>
                                            </div>

                                            <p className="mt-2 text-2xl font-bold text-foreground">
                                                {
                                                    selectedProject?.sprints
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* COMPLETION */}

                                <div className="rounded-xl border border-border bg-muted/30 p-5">
                                    <div className="flex items-center gap-2">
                                        <Trophy
                                            size={
                                                18
                                            }
                                            className={
                                                selectedProject?.status ===
                                                "Completed"
                                                    ? "text-emerald-500"
                                                    : "text-muted-foreground"
                                            }
                                        />

                                        <h3 className="text-sm font-semibold text-foreground">
                                            Project
                                            Completion
                                        </h3>
                                    </div>

                                    {selectedProject?.status ===
                                        "Completed" ||
                                    selectedProject?.completedAt ? (
                                        <div className="mt-4 space-y-3">
                                            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
                                                <p className="text-xs text-muted-foreground">
                                                    Completion
                                                    Date
                                                </p>

                                                <p className="mt-1 text-sm font-semibold text-foreground">
                                                    {
                                                        selectedProject?.completedAt
                                                    }
                                                </p>
                                            </div>

                                            <div className="rounded-lg border border-border bg-background p-4">
                                                <p className="text-xs text-muted-foreground">
                                                    Completion
                                                    Information
                                                </p>

                                                <p className="mt-1 text-sm leading-6 text-foreground">
                                                    {
                                                        selectedProject?.completionNote ||
                                                        "Project completed successfully."
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mt-4 rounded-lg border border-border bg-background p-4">
                                            <p className="text-sm text-muted-foreground">
                                                This
                                                project
                                                has not
                                                been
                                                completed
                                                yet.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <DialogFooter>
                                <Button
                                    type="button"
                                    onClick={
                                        closeProjectDialog
                                    }
                                    disabled={
                                        actionLoading
                                    }
                                    className="
                                        bg-blue-600
                                        text-white
                                        hover:bg-blue-700
                                    "
                                >
                                    Close
                                </Button>
                            </DialogFooter>
                        </>
                    )}

                    {/* ==================================================
                        ARCHIVE
                    ================================================== */}

                    {dialogType ===
                        "archive" && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2 text-foreground">
                                    <Archive
                                        size={
                                            20
                                        }
                                        className="text-amber-500"
                                    />

                                    Archive Project
                                </DialogTitle>

                                <DialogDescription className="leading-6 text-muted-foreground">
                                    Are you sure you
                                    want to archive{" "}
                                    <strong className="text-foreground">
                                        {
                                            selectedProject?.name
                                        }
                                    </strong>
                                    ?
                                </DialogDescription>
                            </DialogHeader>

                            {Number(
                                selectedProject?.activeTasks
                            ) >
                                0 && (
                                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-700 dark:text-amber-300">
                                    This project still
                                    has active tasks.
                                    Complete or
                                    reassign them before
                                    archiving.
                                </div>
                            )}

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={
                                        closeProjectDialog
                                    }
                                    disabled={
                                        actionLoading
                                    }
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="button"
                                    onClick={
                                        handleArchive
                                    }
                                    disabled={
                                        actionLoading ||
                                        Number(
                                            selectedProject?.activeTasks
                                        ) >
                                            0
                                    }
                                    className="
                                        bg-amber-600
                                        text-white
                                        hover:bg-amber-700
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                    "
                                >
                                    {actionLoading ? (
                                        <Loader2
                                            size={
                                                16
                                            }
                                            className="mr-2 animate-spin"
                                        />
                                    ) : (
                                        <Archive
                                            size={
                                                16
                                            }
                                            className="mr-2"
                                        />
                                    )}

                                    Archive Project
                                </Button>
                            </DialogFooter>
                        </>
                    )}

                    {/* ==================================================
                        RESTORE
                    ================================================== */}

                    {dialogType ===
                        "restore" && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2 text-foreground">
                                    <ArchiveRestore
                                        size={
                                            20
                                        }
                                        className="text-cyan-500"
                                    />

                                    Restore Project
                                </DialogTitle>

                                <DialogDescription className="leading-6 text-muted-foreground">
                                    Restore{" "}
                                    <strong className="text-foreground">
                                        {
                                            selectedProject?.name
                                        }
                                    </strong>{" "}
                                    to the active
                                    project list?
                                </DialogDescription>
                            </DialogHeader>

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={
                                        closeProjectDialog
                                    }
                                    disabled={
                                        actionLoading
                                    }
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="button"
                                    onClick={
                                        handleRestore
                                    }
                                    disabled={
                                        actionLoading
                                    }
                                    className="
                                        bg-blue-600
                                        text-white
                                        hover:bg-blue-700
                                    "
                                >
                                    {actionLoading ? (
                                        <Loader2
                                            size={
                                                16
                                            }
                                            className="mr-2 animate-spin"
                                        />
                                    ) : (
                                        <ArchiveRestore
                                            size={
                                                16
                                            }
                                            className="mr-2"
                                        />
                                    )}

                                    Restore Project
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default ProjectOversight;
