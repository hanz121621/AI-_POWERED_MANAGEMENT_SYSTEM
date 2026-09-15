// ============================================================
// AIPMS — MANAGER TEAM MANAGEMENT
//
// Purpose:
// - View the manager's team
// - View team members and workload
// - Monitor Team Leader work
// - Add/remove team members
// - Monitor team progress and current sprint
//
// UI:
// - Matches Admin / Manager design system
// - Uses theme tokens
// - No decorative gradients
// - No hard-coded blue/violet page styling
// ============================================================

import React, { useEffect, useMemo, useState } from "react";

import {
    UsersRound,
    UserRound,
    ShieldCheck,
    BriefcaseBusiness,
    CheckCircle2,
    Clock,
    AlertTriangle,
    CircleDot,
    Plus,
    UserMinus,
    X,
    Send,
    Target,
    ListChecks,
    Activity,
    CalendarDays,
    Eye,
    ChevronRight,
    RefreshCw,
} from "lucide-react";

import teamService from "../../services/teamService";
import api from "@/services/api";

function TeamManagement() {
    // ============================================================
    // STATE
    // ============================================================

    const [team, setTeam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [selectedMember, setSelectedMember] = useState(null);

    const [showAddRequest, setShowAddRequest] = useState(false);
    const [showRemoveRequest, setShowRemoveRequest] = useState(false);
    const [showLeaderWork, setShowLeaderWork] = useState(false);

    // Team Overview popup
    const [selectedOverview, setSelectedOverview] = useState(null);

    const [requestReason, setRequestReason] = useState("");
    const [selectedUserId, setSelectedUserId] = useState("");

    const [availableMembers, setAvailableMembers] = useState([]);
    const [loadingAvailableMembers, setLoadingAvailableMembers] =
        useState(false);

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const [currentManager, setCurrentManager] = useState(null);

    // ============================================================
    // CURRENT MANAGER
    // ============================================================

    useEffect(() => {
        const loadCurrentManager = async () => {
            try {
                if (typeof teamService.getCurrentUser === "function") {
                    const result = await teamService.getCurrentUser();

                    if (result?.success !== false) {
                        setCurrentManager(result?.data || result);
                    }
                }
            } catch (error) {
                console.error("Unable to load current manager:", error);
            }
        };

        loadCurrentManager();
    }, []);

    // ============================================================
    // HELPERS
    // ============================================================

    const clearMessages = () => {
        setSuccessMessage("");
        setErrorMessage("");
    };

    const showSuccess = (message) => {
        setSuccessMessage(message);
        setErrorMessage("");

        setTimeout(() => {
            setSuccessMessage("");
        }, 4000);
    };

    const showError = (message) => {
        setErrorMessage(message);
        setSuccessMessage("");
    };

    const getUserId = (user) =>
        user?.userId ||
        user?.id ||
        user?.user?.id ||
        user?.UserId ||
        user?.User?.Id ||
        null;

    const getUserName = (user) =>
        user?.fullName ||
        user?.name ||
        user?.userName ||
        user?.username ||
        user?.user?.fullName ||
        user?.User?.FullName ||
        "Unknown User";

    const normalizeStatus = (status) =>
        String(status || "")
            .trim()
            .toLowerCase();

    // ============================================================
    // TEAM NORMALIZATION
    // ============================================================

    const normalizeTeamForPage = (rawTeam) => {
        let normalized = rawTeam;

        try {
            if (typeof teamService.normalizeTeam === "function") {
                normalized = teamService.normalizeTeam(rawTeam);
            }
        } catch (error) {
            console.warn("Unable to normalize team:", error);
            normalized = rawTeam;
        }

        const members = Array.isArray(normalized?.members)
            ? normalized.members
            : [];

        let teamLeader =
            normalized?.teamLeader ||
            normalized?.leader ||
            normalized?.teamLeaderUser ||
            null;

        if (!teamLeader) {
            teamLeader = members.find(
                (member) =>
                    member?.isTeamLeader === true ||
                    normalizeStatus(member?.contributorTypeName) ===
                        "team leader" ||
                    normalizeStatus(member?.contributorType) === "team leader"
            );
        }

        const sprints = Array.isArray(normalized?.sprints)
            ? normalized.sprints
            : [];

        return {
            ...normalized,

            id:
                normalized?.id ||
                normalized?.teamId ||
                normalized?.TeamId,

            name:
                normalized?.name ||
                normalized?.teamName ||
                normalized?.TeamName ||
                "Team",

            projectId:
                normalized?.projectId ||
                normalized?.ProjectId ||
                null,

            projectName:
                normalized?.projectName ||
                normalized?.ProjectName ||
                "No Project",

            managerId:
                normalized?.managerId ||
                normalized?.ManagerId ||
                null,

            managerName:
                normalized?.managerName ||
                normalized?.ManagerName ||
                getUserName(currentManager),

            teamLeader: teamLeader
                ? {
                      ...teamLeader,
                      id: getUserId(teamLeader),
                      name: getUserName(teamLeader),
                      role:
                          teamLeader?.role ||
                          teamLeader?.roleName ||
                          "Team Leader",
                      contributorType:
                          teamLeader?.contributorType ||
                          teamLeader?.contributorTypeName ||
                          "Developer",
                      specialization:
                          teamLeader?.specialization ||
                          teamLeader?.specializationName ||
                          "Software Development",
                  }
                : null,

            members,

            sprints,
        };
    };

    // ============================================================
    // LOAD TEAM
    // ============================================================

    const loadTeam = async (showRefresh = false) => {
        try {
            if (showRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            clearMessages();

            const teamsResult = await teamService.getTeams();

            const rawTeams =
                teamsResult?.data ||
                teamsResult?.teams ||
                teamsResult ||
                [];

            const teams = Array.isArray(rawTeams) ? rawTeams : [];

            if (teams.length === 0) {
                setTeam(null);
                return;
            }

            const normalizedTeams = teams.map(normalizeTeamForPage);

            // ----------------------------------------------------
            // Try to determine the manager's project/team first
            // ----------------------------------------------------

            let projectTeams = [];

            try {
                const projectResponse = await api.get(
                    "/projects/my-projects"
                );

                const projects =
                    projectResponse?.data?.data ||
                    projectResponse?.data ||
                    [];

                if (Array.isArray(projects)) {
                    projectTeams = projects;
                }
            } catch (projectError) {
                console.warn(
                    "Unable to load manager projects:",
                    projectError
                );
            }

            let selectedTeam = null;

            // Match project team
            if (projectTeams.length > 0) {
                const projectWithTeam = projectTeams.find(
                    (project) =>
                        project?.teamId ||
                        project?.TeamId
                );

                const projectTeamId =
                    projectWithTeam?.teamId ||
                    projectWithTeam?.TeamId;

                if (projectTeamId) {
                    selectedTeam = normalizedTeams.find(
                        (item) =>
                            String(item.id) ===
                            String(projectTeamId)
                    );
                }
            }

            // Match manager ID
            if (!selectedTeam && currentManager) {
                const managerId = getUserId(currentManager);

                if (managerId) {
                    selectedTeam = normalizedTeams.find(
                        (item) =>
                            String(item.managerId) ===
                            String(managerId)
                    );
                }
            }

            // Fallback to a team with a manager
            if (!selectedTeam) {
                selectedTeam =
                    normalizedTeams.find(
                        (item) => item.managerId
                    ) || normalizedTeams[0];
            }

            // ----------------------------------------------------
            // Load complete members if available
            // ----------------------------------------------------

            if (
                selectedTeam?.id &&
                typeof teamService.getTeamMembers === "function"
            ) {
                try {
                    const membersResult =
                        await teamService.getTeamMembers(
                            selectedTeam.id
                        );

                    const loadedMembers =
                        membersResult?.data ||
                        membersResult?.members ||
                        membersResult ||
                        [];

                    if (Array.isArray(loadedMembers)) {
                        selectedTeam = {
                            ...selectedTeam,
                            members: loadedMembers,
                        };
                    }
                } catch (memberError) {
                    console.warn(
                        "Unable to load complete team members:",
                        memberError
                    );
                }
            }

            setTeam(selectedTeam);
        } catch (error) {
            console.error("Unable to load team:", error);

            showError(
                error?.response?.data?.message ||
                    error?.message ||
                    "Unable to load Team Management."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadTeam();
    }, []);

    useEffect(() => {
        if (currentManager) {
            loadTeam();
        }
    }, [currentManager]);

    // ============================================================
    // DERIVED DATA
    // ============================================================

    const members = useMemo(
        () => (Array.isArray(team?.members) ? team.members : []),
        [team]
    );

    const allTasks = useMemo(() => {
        if (!Array.isArray(team?.sprints)) {
            return [];
        }

        return team.sprints.flatMap((sprint) => {
            const tasks = Array.isArray(sprint?.tasks)
                ? sprint.tasks
                : [];

            return tasks.map((task) => ({
                ...task,
                sprintId:
                    task?.sprintId ||
                    sprint?.id ||
                    sprint?.sprintId,
                sprintName:
                    sprint?.name ||
                    sprint?.sprintName ||
                    "Sprint",
            }));
        });
    }, [team]);

    const activeSprint = useMemo(
        () =>
            (team?.sprints || []).find(
                (sprint) =>
                    normalizeStatus(sprint?.status) ===
                    "active"
            ),
        [team]
    );

    const taskStats = useMemo(() => {
        const completed = allTasks.filter(
            (task) =>
                normalizeStatus(task?.status) ===
                    "completed" ||
                normalizeStatus(task?.status) === "done"
        ).length;

        const inProgress = allTasks.filter(
            (task) =>
                normalizeStatus(task?.status) ===
                    "in progress" ||
                normalizeStatus(task?.status) ===
                    "in_progress"
        ).length;

        const blocked = allTasks.filter(
            (task) =>
                normalizeStatus(task?.status) ===
                "blocked"
        ).length;

        const total = allTasks.length;

        return {
            completed,
            inProgress,
            blocked,
            remaining: Math.max(
                total - completed,
                0
            ),
            total,
        };
    }, [allTasks]);

    const overdueTasks = useMemo(() => {
        const now = new Date();

        return allTasks.filter((task) => {
            const status = normalizeStatus(
                task?.status
            );

            const isCompleted =
                status === "completed" ||
                status === "done";

            if (isCompleted || !task?.deadline) {
                return false;
            }

            const deadline = new Date(task.deadline);

            return (
                !Number.isNaN(deadline.getTime()) &&
                deadline < now
            );
        });
    }, [allTasks]);

    const teamCompletion = useMemo(() => {
        if (allTasks.length === 0) {
            return null;
        }

        return Math.round(
            (taskStats.completed / allTasks.length) * 100
        );
    }, [allTasks.length, taskStats.completed]);

    const sprintProgress = useMemo(() => {
        if (!activeSprint) {
            return null;
        }

        const sprintTasks = Array.isArray(
            activeSprint?.tasks
        )
            ? activeSprint.tasks
            : [];

        if (sprintTasks.length === 0) {
            return null;
        }

        const completed = sprintTasks.filter(
            (task) => {
                const status = normalizeStatus(
                    task?.status
                );

                return (
                    status === "completed" ||
                    status === "done"
                );
            }
        ).length;

        return Math.round(
            (completed / sprintTasks.length) * 100
        );
    }, [activeSprint]);

    const memberWorkload = useMemo(() => {
        return members.map((member) => {
            const memberId = getUserId(member);
            const memberName = getUserName(member);

            const memberTasks = allTasks.filter(
                (task) => {
                    const taskUserId =
                        task?.assignedDeveloperId ||
                        task?.assignedUserId ||
                        task?.assigneeId ||
                        task?.developerId ||
                        task?.userId;

                    const taskAssigneeName =
                        task?.assignedDeveloperName ||
                        task?.assigneeName ||
                        task?.developerName ||
                        task?.assignedToName;

                    return (
                        (memberId &&
                            taskUserId &&
                            String(memberId) ===
                                String(taskUserId)) ||
                        (memberName &&
                            taskAssigneeName &&
                            String(memberName).toLowerCase() ===
                                String(
                                    taskAssigneeName
                                ).toLowerCase())
                    );
                }
            );

            const activeTasks = memberTasks.filter(
                (task) => {
                    const status = normalizeStatus(
                        task?.status
                    );

                    return (
                        status !== "completed" &&
                        status !== "done"
                    );
                }
            );

            return {
                ...member,
                memberId,
                memberName,
                role:
                    member?.role ||
                    member?.roleName ||
                    "Member",
                contributorType:
                    member?.contributorType ||
                    member?.contributorTypeName ||
                    "Contributor",
                specialization:
                    member?.specialization ||
                    member?.specializationName ||
                    "—",
                active:
                    member?.isActive ??
                    member?.active ??
                    true,
                totalTasks: memberTasks.length,
                activeTasks: activeTasks.length,
            };
        });
    }, [members, allTasks]);

    const teamLeaderWork = useMemo(() => {
        const leader = team?.teamLeader;

        if (!leader) {
            return {
                created: 0,
                assigned: 0,
                completed: 0,
                inProgress: 0,
                blocked: 0,
                overdue: 0,
            };
        }

        const leaderId = getUserId(leader);
        const leaderName = getUserName(leader);

        const leaderTasks = allTasks.filter((task) => {
            const creatorId =
                task?.createdById ||
                task?.creatorId ||
                task?.createdBy;

            const creatorName =
                task?.createdByName ||
                task?.creatorName;

            return (
                (leaderId &&
                    creatorId &&
                    String(leaderId) ===
                        String(creatorId)) ||
                (leaderName &&
                    creatorName &&
                    String(leaderName).toLowerCase() ===
                        String(
                            creatorName
                        ).toLowerCase())
            );
        });

        const completed = leaderTasks.filter((task) => {
            const status = normalizeStatus(
                task?.status
            );

            return (
                status === "completed" ||
                status === "done"
            );
        }).length;

        const inProgress = leaderTasks.filter((task) => {
            const status = normalizeStatus(
                task?.status
            );

            return (
                status === "in progress" ||
                status === "in_progress"
            );
        }).length;

        const blocked = leaderTasks.filter(
            (task) =>
                normalizeStatus(task?.status) ===
                "blocked"
        ).length;

        const overdue = leaderTasks.filter((task) =>
            overdueTasks.some(
                (overdueTask) =>
                    String(
                        overdueTask?.id ||
                            overdueTask?.taskId
                    ) ===
                    String(
                        task?.id ||
                            task?.taskId
                    )
            )
        ).length;

        return {
            created: leaderTasks.length,
            assigned: leaderTasks.length,
            completed,
            inProgress,
            blocked,
            overdue,
        };
    }, [team, allTasks, overdueTasks]);

    // ============================================================
    // AVAILABLE MEMBERS
    // ============================================================

    const loadAvailableMembers = async () => {
        if (!team?.id) {
            return;
        }

        try {
            setLoadingAvailableMembers(true);

            let result;

            if (
                typeof teamService.getAvailableTeamMembers ===
                "function"
            ) {
                result =
                    await teamService.getAvailableTeamMembers(
                        team.id
                    );
            } else if (
                typeof teamService.getTeamMemberCandidates ===
                "function"
            ) {
                result =
                    await teamService.getTeamMemberCandidates(
                        team.id
                    );
            }

            const candidates =
                result?.data ||
                result?.members ||
                result ||
                [];

            setAvailableMembers(
                Array.isArray(candidates)
                    ? candidates
                    : []
            );
        } catch (error) {
            console.error(
                "Unable to load available members:",
                error
            );

            showError(
                error?.response?.data?.message ||
                    error?.message ||
                    "Unable to load available team members."
            );
        } finally {
            setLoadingAvailableMembers(false);
        }
    };

    // ============================================================
    // ADD MEMBER
    // ============================================================

    const openAddMemberModal = () => {
        clearMessages();
        setRequestReason("");
        setSelectedUserId("");
        setShowAddRequest(true);

        loadAvailableMembers();
    };

    const handleAddRequest = async () => {
        if (!team?.id) {
            showError("Team information is missing.");
            return;
        }

        if (!selectedUserId) {
            showError("Please select a team member.");
            return;
        }

        if (!requestReason.trim()) {
            showError(
                "Please provide a reason for adding the member."
            );
            return;
        }

        try {
            const selectedUser =
                availableMembers.find(
                    (user) =>
                        String(getUserId(user)) ===
                        String(selectedUserId)
                );

            const result =
                await teamService.addMemberToTeam(
                    team.id,
                    selectedUserId
                );

            if (result?.success === false) {
                throw new Error(
                    result?.message ||
                        "Unable to add team member."
                );
            }

            showSuccess(
                `${
                    selectedUser
                        ? getUserName(selectedUser)
                        : "Team member"
                } added successfully.`
            );

            setShowAddRequest(false);
            setRequestReason("");
            setSelectedUserId("");

            await loadTeam(true);
        } catch (error) {
            console.error(
                "Unable to add team member:",
                error
            );

            showError(
                error?.response?.data?.message ||
                    error?.message ||
                    "Unable to add team member."
            );
        }
    };

    // ============================================================
    // REMOVE MEMBER
    // ============================================================

    const openRemoveMemberModal = (member) => {
        clearMessages();
        setSelectedMember(member);
        setRequestReason("");
        setShowRemoveRequest(true);
    };

    const handleRemoveRequest = async () => {
        if (!team?.id) {
            showError("Team information is missing.");
            return;
        }

        if (!selectedMember) {
            showError("No team member selected.");
            return;
        }

        if (!requestReason.trim()) {
            showError(
                "Please provide a reason for removing the member."
            );
            return;
        }

        const userId = getUserId(selectedMember);

        if (!userId) {
            showError(
                "Unable to determine the selected member."
            );
            return;
        }

        try {
            const result =
                await teamService.removeMemberFromTeam(
                    team.id,
                    userId
                );

            if (result?.success === false) {
                throw new Error(
                    result?.message ||
                        "Unable to remove team member."
                );
            }

            showSuccess(
                "Team member removed successfully."
            );

            setShowRemoveRequest(false);
            setSelectedMember(null);
            setRequestReason("");

            await loadTeam(true);
        } catch (error) {
            console.error(
                "Unable to remove team member:",
                error
            );

            showError(
                error?.response?.data?.message ||
                    error?.message ||
                    "Unable to remove team member."
            );
        }
    };

    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {
        return (
            <div className="flex min-h-full items-center justify-center py-16">
                <div className="flex flex-col items-center text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <RefreshCw
                            size={26}
                            className="animate-spin"
                        />
                    </div>

                    <h2 className="mt-4 text-lg font-semibold text-foreground">
                        Loading Team Management
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Please wait while your team information
                        is loaded.
                    </p>
                </div>
            </div>
        );
    }

    // ============================================================
    // NO TEAM
    // ============================================================

    if (!team) {
        return (
            <div className="space-y-6">
                <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <UsersRound size={24} />
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    Team Workspace
                                </p>

                                <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                                    Team Management
                                </h1>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Manage your team members,
                                    workload, and progress.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => loadTeam(true)}
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
                            disabled={refreshing}
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
                    </div>
                </section>

                {errorMessage && (
                    <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                        {errorMessage}
                    </div>
                )}

                <section className="rounded-xl border border-dashed border-border bg-card p-10 text-center shadow-sm">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                        <UsersRound size={26} />
                    </div>

                    <h2 className="mt-4 text-lg font-semibold text-foreground">
                        No team found
                    </h2>

                    <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                        There is currently no team associated
                        with your manager account.
                    </p>
                </section>
            </div>
        );
    }

    // ============================================================
    // MAIN UI
    // ============================================================

    return (
        <div className="space-y-6 pb-8">
            {/* ================================================== */}
            {/* PAGE HEADER */}
            {/* ================================================== */}

            <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <UsersRound size={24} />
                        </div>

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Team Workspace
                            </p>

                            <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                                {team.name}
                            </h1>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Team Management and Monitoring
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="rounded-lg border border-border bg-background px-4 py-3">
                            <p className="text-xs font-medium text-muted-foreground">
                                Project
                            </p>

                            <p className="mt-1 text-sm font-semibold text-foreground">
                                {team.projectName ||
                                    "No Project"}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => loadTeam(true)}
                            disabled={refreshing}
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
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
                    </div>
                </div>
            </section>

            {/* ================================================== */}
            {/* MESSAGES */}
            {/* ================================================== */}

            {successMessage && (
                <div className="flex items-start gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2
                        size={18}
                        className="mt-0.5 shrink-0"
                    />
                    <span>{successMessage}</span>
                </div>
            )}

            {errorMessage && (
                <div className="flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    <AlertTriangle
                        size={18}
                        className="mt-0.5 shrink-0"
                    />
                    <span>{errorMessage}</span>
                </div>
            )}

            {/* ================================================== */}
            {/* TEAM OVERVIEW */}
            {/* ================================================== */}

            <section>
                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-foreground">
                        Team Overview
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        A quick overview of your team's current
                        state.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {/* Team */}
                    <button
                        type="button"
                        onClick={() =>
                            setSelectedOverview("team")
                        }
                        className="w-full rounded-xl border border-border bg-card p-5 text-left shadow-sm transition hover:border-primary/40 hover:shadow-md"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Team
                                </p>

                                <p className="mt-2 text-xl font-bold tracking-tight text-foreground">
                                    {team.name}
                                </p>

                                <p className="mt-1 text-xs text-muted-foreground">
                                    {team.projectName ||
                                        "No Project"}
                                </p>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <UsersRound size={24} />
                            </div>
                        </div>
                    </button>

                    {/* Members */}
                    <button
                        type="button"
                        onClick={() =>
                            setSelectedOverview("members")
                        }
                        className="w-full rounded-xl border border-border bg-card p-5 text-left shadow-sm transition hover:border-primary/40 hover:shadow-md"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Team Members
                                </p>

                                <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                                    {members.length}
                                </p>

                                <p className="mt-1 text-xs text-muted-foreground">
                                    Active team members
                                </p>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <UserRound size={24} />
                            </div>
                        </div>
                    </button>

                    {/* Workload */}
                    <button
                        type="button"
                        onClick={() =>
                            setSelectedOverview("workload")
                        }
                        className="w-full rounded-xl border border-border bg-card p-5 text-left shadow-sm transition hover:border-primary/40 hover:shadow-md"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Current Workload
                                </p>

                                <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                                    {taskStats.remaining}
                                </p>

                                <p className="mt-1 text-xs text-muted-foreground">
                                    Open tasks
                                </p>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <ListChecks size={24} />
                            </div>
                        </div>
                    </button>

                    {/* Completion */}
                    <button
                        type="button"
                        onClick={() =>
                            setSelectedOverview("completion")
                        }
                        className="w-full rounded-xl border border-border bg-card p-5 text-left shadow-sm transition hover:border-primary/40 hover:shadow-md"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Team Completion
                                </p>

                                <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                                    {teamCompletion !== null
                                        ? `${teamCompletion}%`
                                        : "—"}
                                </p>

                                <p className="mt-1 text-xs text-muted-foreground">
                                    Overall task progress
                                </p>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <CheckCircle2 size={24} />
                            </div>
                        </div>
                    </button>
                </div>
            </section>

            {/* ================================================== */}
            {/* TEAM LEADER */}
            {/* ================================================== */}

            <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-foreground">
                            Team Leader
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Monitor the Team Leader's task
                            activity and progress.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            clearMessages();
                            setShowLeaderWork(true);
                        }}
                        disabled={!team.teamLeader}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Eye size={17} />
                        Monitor Work
                    </button>
                </div>

                {team.teamLeader ? (
                    <div className="mt-5 rounded-xl border border-border bg-background p-5">
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <ShieldCheck
                                        size={24}
                                    />
                                </div>

                                <div>
                                    <h3 className="font-semibold text-foreground">
                                        {team.teamLeader.name}
                                    </h3>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {
                                            team.teamLeader
                                                .role
                                        }
                                    </p>

                                    <div className="mt-2 flex flex-wrap gap-2">
                                        <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
                                            {
                                                team.teamLeader
                                                    .contributorType
                                            }
                                        </span>

                                        <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
                                            {
                                                team.teamLeader
                                                    .specialization
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                <div className="rounded-lg border border-border bg-card px-4 py-3">
                                    <p className="text-xs text-muted-foreground">
                                        Tasks
                                    </p>

                                    <p className="mt-1 text-lg font-bold text-foreground">
                                        {
                                            teamLeaderWork.created
                                        }
                                    </p>
                                </div>

                                <div className="rounded-lg border border-border bg-card px-4 py-3">
                                    <p className="text-xs text-muted-foreground">
                                        Completed
                                    </p>

                                    <p className="mt-1 text-lg font-bold text-foreground">
                                        {
                                            teamLeaderWork.completed
                                        }
                                    </p>
                                </div>

                                <div className="rounded-lg border border-border bg-card px-4 py-3">
                                    <p className="text-xs text-muted-foreground">
                                        In Progress
                                    </p>

                                    <p className="mt-1 text-lg font-bold text-foreground">
                                        {
                                            teamLeaderWork.inProgress
                                        }
                                    </p>
                                </div>

                                <div className="rounded-lg border border-border bg-card px-4 py-3">
                                    <p className="text-xs text-muted-foreground">
                                        Blocked
                                    </p>

                                    <p className="mt-1 text-lg font-bold text-foreground">
                                        {
                                            teamLeaderWork.blocked
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="mt-5 rounded-xl border border-dashed border-border bg-background p-8 text-center">
                        <ShieldCheck
                            size={28}
                            className="mx-auto text-muted-foreground"
                        />

                        <p className="mt-3 text-sm font-medium text-foreground">
                            No Team Leader assigned
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                            A Team Leader will appear here once
                            assigned to the team.
                        </p>
                    </div>
                )}
            </section>

            {/* ================================================== */}
            {/* TEAM MEMBERS */}
            {/* ================================================== */}

            <section className="rounded-xl border border-border bg-card shadow-sm">
                <div className="flex flex-col gap-4 border-b border-border p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-foreground">
                            Team Members
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                            View members, roles, specializations,
                            and current workload.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openAddMemberModal}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                    >
                        <Plus size={17} />
                        Add Member
                    </button>
                </div>

                {memberWorkload.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px]">
                            <thead>
                                <tr className="border-b border-border bg-muted/50 text-left">
                                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                        Member
                                    </th>

                                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                        Role
                                    </th>

                                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                        Type
                                    </th>

                                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                        Specialization
                                    </th>

                                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                        Tasks
                                    </th>

                                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                        Active
                                    </th>

                                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {memberWorkload.map(
                                    (member, index) => {
                                        const memberId =
                                            member.memberId ||
                                            `member-${index}`;

                                        return (
                                            <tr
                                                key={memberId}
                                                className="border-b border-border last:border-b-0 transition hover:bg-muted/50"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                            <UserRound
                                                                size={
                                                                    18
                                                                }
                                                            />
                                                        </div>

                                                        <div>
                                                            <p className="font-medium text-foreground">
                                                                {
                                                                    member.memberName
                                                                }
                                                            </p>

                                                            <p className="mt-0.5 text-xs text-muted-foreground">
                                                                Member
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4 text-sm text-foreground">
                                                    {
                                                        member.role
                                                    }
                                                </td>

                                                <td className="px-6 py-4">
                                                    <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
                                                        {
                                                            member.contributorType
                                                        }
                                                    </span>
                                                </td>

                                                <td className="px-6 py-4 text-sm text-muted-foreground">
                                                    {
                                                        member.specialization
                                                    }
                                                </td>

                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <ListChecks
                                                            size={
                                                                16
                                                            }
                                                            className="text-muted-foreground"
                                                        />

                                                        <span className="text-sm font-medium text-foreground">
                                                            {
                                                                member.totalTasks
                                                            }
                                                        </span>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
                                                        {
                                                            member.activeTasks
                                                        }
                                                    </span>
                                                </td>

                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openRemoveMemberModal(
                                                                member
                                                            )
                                                        }
                                                        className="inline-flex items-center gap-2 rounded-lg border border-destructive/20 px-3 py-2 text-sm font-medium text-destructive transition hover:bg-destructive/10"
                                                    >
                                                        <UserMinus
                                                            size={
                                                                16
                                                            }
                                                        />
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    }
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-10 text-center">
                        <UsersRound
                            size={30}
                            className="mx-auto text-muted-foreground"
                        />

                        <p className="mt-3 font-medium text-foreground">
                            No team members found
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Add members to begin managing the
                            team.
                        </p>
                    </div>
                )}
            </section>

            {/* ================================================== */}
            {/* TEAM PROGRESS */}
            {/* ================================================== */}

            <section>
                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-foreground">
                        Team Progress
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Current task status across the team.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Total Tasks
                                </p>

                                <p className="mt-2 text-3xl font-bold text-foreground">
                                    {taskStats.total}
                                </p>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <ListChecks size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Completed
                                </p>

                                <p className="mt-2 text-3xl font-bold text-foreground">
                                    {taskStats.completed}
                                </p>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <CheckCircle2 size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    In Progress
                                </p>

                                <p className="mt-2 text-3xl font-bold text-foreground">
                                    {taskStats.inProgress}
                                </p>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <Activity size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Blocked
                                </p>

                                <p className="mt-2 text-3xl font-bold text-foreground">
                                    {taskStats.blocked}
                                </p>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <AlertTriangle
                                    size={24}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {overdueTasks.length > 0 && (
                    <div className="mt-4 flex items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                        <AlertTriangle size={18} />
                        <span>
                            {overdueTasks.length}{" "}
                            {overdueTasks.length === 1
                                ? "task is"
                                : "tasks are"}{" "}
                            overdue.
                        </span>
                    </div>
                )}
            </section>

            {/* ================================================== */}
            {/* CURRENT SPRINT */}
            {/* ================================================== */}

            <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-5">
                    <h2 className="text-lg font-semibold text-foreground">
                        Current Sprint
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Monitor the team's active sprint and
                        progress.
                    </p>
                </div>

                {activeSprint ? (
                    <div className="rounded-xl border border-border bg-background p-5">
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <Target size={24} />
                                </div>

                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="text-lg font-semibold text-foreground">
                                            {activeSprint.name ||
                                                activeSprint.sprintName ||
                                                "Active Sprint"}
                                        </h3>

                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                                            <CircleDot
                                                size={12}
                                            />
                                            Active
                                        </span>
                                    </div>

                                    <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                                        {activeSprint.startDate && (
                                            <span className="inline-flex items-center gap-1.5">
                                                <CalendarDays
                                                    size={
                                                        15
                                                    }
                                                />
                                                Started{" "}
                                                {new Date(
                                                    activeSprint.startDate
                                                ).toLocaleDateString()}
                                            </span>
                                        )}

                                        <span className="inline-flex items-center gap-1.5">
                                            <ListChecks
                                                size={15}
                                            />
                                            {
                                                (
                                                    activeSprint.tasks ||
                                                    []
                                                ).length
                                            }{" "}
                                            tasks
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="min-w-[220px]">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-muted-foreground">
                                        Progress
                                    </span>

                                    <span className="text-sm font-semibold text-foreground">
                                        {sprintProgress !==
                                        null
                                            ? `${sprintProgress}%`
                                            : "—"}
                                    </span>
                                </div>

                                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-muted">
                                    <div
                                        className="h-full rounded-full bg-primary transition-all duration-500"
                                        style={{
                                            width: `${
                                                sprintProgress ||
                                                0
                                            }%`,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-xl border border-dashed border-border bg-background p-8 text-center">
                        <Clock
                            size={30}
                            className="mx-auto text-muted-foreground"
                        />

                        <p className="mt-3 font-medium text-foreground">
                            No active sprint
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                            The team currently has no sprint in
                            active status.
                        </p>
                    </div>
                )}
            </section>

            {/* ================================================== */}
            {/* TEAM OVERVIEW POPUP */}
            {/* ================================================== */}

            {selectedOverview && (
                <div
                    className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm"
                    onClick={() =>
                        setSelectedOverview(null)
                    }
                >
                    <div
                        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-border bg-card text-foreground shadow-xl"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        {/* Popup Header */}
                        <div className="flex items-center justify-between border-b border-border px-6 py-4">
                            <div>
                                <h2 className="text-lg font-semibold">
                                    {selectedOverview ===
                                        "team" &&
                                        "Team Details"}

                                    {selectedOverview ===
                                        "members" &&
                                        "Team Members"}

                                    {selectedOverview ===
                                        "workload" &&
                                        "Current Workload"}

                                    {selectedOverview ===
                                        "completion" &&
                                        "Team Completion"}
                                </h2>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    {selectedOverview ===
                                        "team" &&
                                        "Overview of your team and project information."}

                                    {selectedOverview ===
                                        "members" &&
                                        "Current members and their task workload."}

                                    {selectedOverview ===
                                        "workload" &&
                                        "Current task workload across the team."}

                                    {selectedOverview ===
                                        "completion" &&
                                        "Detailed information about overall team progress."}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedOverview(
                                        null
                                    )
                                }
                                className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                            >
                                <X size={19} />
                            </button>
                        </div>

                        {/* Popup Content */}
                        <div className="space-y-5 p-6">
                            {/* TEAM DETAILS */}
                            {selectedOverview ===
                                "team" && (
                                <>
                                    <div className="flex items-center gap-4 rounded-xl border border-border bg-background p-5">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                            <UsersRound
                                                size={
                                                    24
                                                }
                                            />
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                                Team
                                            </p>

                                            <h3 className="mt-1 text-xl font-semibold text-foreground">
                                                {
                                                    team.name
                                                }
                                            </h3>

                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {
                                                    team.projectName
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <OverviewDetail
                                            label="Project"
                                            value={
                                                team.projectName ||
                                                "No Project"
                                            }
                                            icon={
                                                BriefcaseBusiness
                                            }
                                        />

                                        <OverviewDetail
                                            label="Manager"
                                            value={
                                                team.managerName ||
                                                getUserName(
                                                    currentManager
                                                )
                                            }
                                            icon={
                                                UserRound
                                            }
                                        />

                                        <OverviewDetail
                                            label="Team Leader"
                                            value={
                                                team
                                                    .teamLeader
                                                    ?.name ||
                                                "Not assigned"
                                            }
                                            icon={
                                                ShieldCheck
                                            }
                                        />

                                        <OverviewDetail
                                            label="Team Members"
                                            value={
                                                members.length
                                            }
                                            icon={
                                                UsersRound
                                            }
                                        />

                                        <OverviewDetail
                                            label="Total Tasks"
                                            value={
                                                taskStats.total
                                            }
                                            icon={
                                                ListChecks
                                            }
                                        />

                                        <OverviewDetail
                                            label="Active Sprint"
                                            value={
                                                activeSprint
                                                    ? activeSprint.name ||
                                                      activeSprint.sprintName ||
                                                      "Active Sprint"
                                                    : "None"
                                            }
                                            icon={
                                                Target
                                            }
                                        />
                                    </div>
                                </>
                            )}

                            {/* MEMBERS */}
                            {selectedOverview ===
                                "members" && (
                                <>
                                    {memberWorkload.length >
                                    0 ? (
                                        <div className="space-y-3">
                                            {memberWorkload.map(
                                                (
                                                    member,
                                                    index
                                                ) => (
                                                    <div
                                                        key={
                                                            member.memberId ||
                                                            `overview-member-${index}`
                                                        }
                                                        className="rounded-xl border border-border bg-background p-4"
                                                    >
                                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                                    <UserRound
                                                                        size={
                                                                            18
                                                                        }
                                                                    />
                                                                </div>

                                                                <div>
                                                                    <p className="font-semibold text-foreground">
                                                                        {
                                                                            member.memberName
                                                                        }
                                                                    </p>

                                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                                        {
                                                                            member.role
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                                                <MiniOverviewStat
                                                                    label="Tasks"
                                                                    value={
                                                                        member.totalTasks
                                                                    }
                                                                />

                                                                <MiniOverviewStat
                                                                    label="Active"
                                                                    value={
                                                                        member.activeTasks
                                                                    }
                                                                />

                                                                <MiniOverviewStat
                                                                    label="Type"
                                                                    value={
                                                                        member.contributorType
                                                                    }
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="mt-3 flex flex-wrap gap-2">
                                                            <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
                                                                {
                                                                    member.contributorType
                                                                }
                                                            </span>

                                                            <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
                                                                {
                                                                    member.specialization
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    ) : (
                                        <div className="rounded-xl border border-dashed border-border bg-background p-8 text-center">
                                            <UsersRound
                                                size={
                                                    28
                                                }
                                                className="mx-auto text-muted-foreground"
                                            />

                                            <p className="mt-3 font-medium text-foreground">
                                                No team members
                                            </p>

                                            <p className="mt-1 text-sm text-muted-foreground">
                                                There are
                                                currently no
                                                members in
                                                this team.
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* WORKLOAD */}
                            {selectedOverview ===
                                "workload" && (
                                <>
                                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                        <OverviewDetail
                                            label="Total"
                                            value={
                                                taskStats.total
                                            }
                                            icon={
                                                ListChecks
                                            }
                                        />

                                        <OverviewDetail
                                            label="Open"
                                            value={
                                                taskStats.remaining
                                            }
                                            icon={
                                                Clock
                                            }
                                        />

                                        <OverviewDetail
                                            label="In Progress"
                                            value={
                                                taskStats.inProgress
                                            }
                                            icon={
                                                Activity
                                            }
                                        />

                                        <OverviewDetail
                                            label="Blocked"
                                            value={
                                                taskStats.blocked
                                            }
                                            icon={
                                                AlertTriangle
                                            }
                                        />
                                    </div>

                                    <div className="rounded-xl border border-border bg-background p-5">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-semibold text-foreground">
                                                    Open Work
                                                </p>

                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    Tasks that are
                                                    not completed.
                                                </p>
                                            </div>

                                            <span className="text-2xl font-bold text-foreground">
                                                {
                                                    taskStats.remaining
                                                }
                                            </span>
                                        </div>

                                        <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-muted">
                                            <div
                                                className="h-full rounded-full bg-primary transition-all duration-500"
                                                style={{
                                                    width: `${
                                                        taskStats
                                                            .total >
                                                        0
                                                            ? Math.round(
                                                                  (taskStats.remaining /
                                                                      taskStats.total) *
                                                                      100
                                                              )
                                                            : 0
                                                    }%`,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {overdueTasks.length >
                                        0 && (
                                        <div className="flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                                            <AlertTriangle
                                                size={
                                                    18
                                                }
                                                className="mt-0.5 shrink-0"
                                            />

                                            <div>
                                                <p className="font-medium">
                                                    Overdue
                                                    tasks
                                                </p>

                                                <p className="mt-1">
                                                    {
                                                        overdueTasks.length
                                                    }{" "}
                                                    {overdueTasks.length ===
                                                    1
                                                        ? "task is"
                                                        : "tasks are"}{" "}
                                                    currently
                                                    overdue.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* COMPLETION */}
                            {selectedOverview ===
                                "completion" && (
                                <>
                                    <div className="rounded-xl border border-border bg-background p-6">
                                        <div className="flex flex-col items-center text-center">
                                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                <CheckCircle2
                                                    size={
                                                        30
                                                    }
                                                />
                                            </div>

                                            <p className="mt-4 text-sm font-medium text-muted-foreground">
                                                Overall Completion
                                            </p>

                                            <p className="mt-1 text-4xl font-bold tracking-tight text-foreground">
                                                {teamCompletion !==
                                                null
                                                    ? `${teamCompletion}%`
                                                    : "—"}
                                            </p>
                                        </div>

                                        <div className="mt-6 h-3 overflow-hidden rounded-full bg-muted">
                                            <div
                                                className="h-full rounded-full bg-primary transition-all duration-500"
                                                style={{
                                                    width: `${
                                                        teamCompletion ||
                                                        0
                                                    }%`,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                        <OverviewDetail
                                            label="Completed"
                                            value={
                                                taskStats.completed
                                            }
                                            icon={
                                                CheckCircle2
                                            }
                                        />

                                        <OverviewDetail
                                            label="Remaining"
                                            value={
                                                taskStats.remaining
                                            }
                                            icon={
                                                Clock
                                            }
                                        />

                                        <OverviewDetail
                                            label="Blocked"
                                            value={
                                                taskStats.blocked
                                            }
                                            icon={
                                                AlertTriangle
                                            }
                                        />
                                    </div>

                                    <div className="rounded-xl border border-border bg-background p-5">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-semibold text-foreground">
                                                    Task Summary
                                                </p>

                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    Team task
                                                    completion
                                                    status.
                                                </p>
                                            </div>

                                            <span className="text-sm font-semibold text-foreground">
                                                {
                                                    taskStats.completed
                                                }{" "}
                                                /{" "}
                                                {
                                                    taskStats.total
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Popup Footer */}
                        <div className="flex justify-end border-t border-border bg-muted/30 px-6 py-4">
                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedOverview(
                                        null
                                    )
                                }
                                className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ================================================== */}
            {/* ADD MEMBER MODAL */}
            {/* ================================================== */}

            {showAddRequest && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm">
                    <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-border bg-card text-foreground shadow-xl">
                        <div className="flex items-center justify-between border-b border-border px-6 py-4">
                            <div>
                                <h2 className="text-lg font-semibold">
                                    Add Team Member
                                </h2>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Add an available contributor to
                                    this team.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowAddRequest(false)
                                }
                                className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                            >
                                <X size={19} />
                            </button>
                        </div>

                        <div className="space-y-5 p-6">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">
                                    Team Member
                                </label>

                                <select
                                    value={selectedUserId}
                                    onChange={(event) =>
                                        setSelectedUserId(
                                            event.target.value
                                        )
                                    }
                                    disabled={
                                        loadingAvailableMembers
                                    }
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <option value="">
                                        {loadingAvailableMembers
                                            ? "Loading available members..."
                                            : "Select a member"}
                                    </option>

                                    {availableMembers.map(
                                        (member, index) => {
                                            const memberId =
                                                getUserId(
                                                    member
                                                );

                                            return (
                                                <option
                                                    key={
                                                        memberId ||
                                                        index
                                                    }
                                                    value={
                                                        memberId
                                                    }
                                                >
                                                    {getUserName(
                                                        member
                                                    )}
                                                </option>
                                            );
                                        }
                                    )}
                                </select>

                                {!loadingAvailableMembers &&
                                    availableMembers.length ===
                                        0 && (
                                        <p className="mt-2 text-xs text-muted-foreground">
                                            No available members
                                            were found.
                                        </p>
                                    )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">
                                    Reason
                                </label>

                                <textarea
                                    value={requestReason}
                                    onChange={(event) =>
                                        setRequestReason(
                                            event.target.value
                                        )
                                    }
                                    rows={4}
                                    placeholder="Enter the reason for adding this member..."
                                    className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col-reverse gap-3 border-t border-border bg-muted/30 px-6 py-4 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() =>
                                    setShowAddRequest(false)
                                }
                                className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleAddRequest}
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                            >
                                <Send size={16} />
                                Add Member
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ================================================== */}
            {/* REMOVE MEMBER MODAL */}
            {/* ================================================== */}

            {showRemoveRequest && selectedMember && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm">
                    <div className="w-full max-w-lg rounded-xl border border-border bg-card text-foreground shadow-xl">
                        <div className="flex items-center justify-between border-b border-border px-6 py-4">
                            <div>
                                <h2 className="text-lg font-semibold">
                                    Remove Team Member
                                </h2>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Remove this contributor from
                                    the team.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowRemoveRequest(false)
                                }
                                className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                            >
                                <X size={19} />
                            </button>
                        </div>

                        <div className="space-y-5 p-6">
                            <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle
                                        size={19}
                                        className="mt-0.5 shrink-0 text-destructive"
                                    />

                                    <div>
                                        <p className="text-sm font-semibold text-foreground">
                                            {
                                                getUserName(
                                                    selectedMember
                                                )
                                            }
                                        </p>

                                        <p className="mt-1 text-sm text-muted-foreground">
                                            This member will be
                                            removed from{" "}
                                            {team.name}.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">
                                    Reason
                                </label>

                                <textarea
                                    value={requestReason}
                                    onChange={(event) =>
                                        setRequestReason(
                                            event.target.value
                                        )
                                    }
                                    rows={4}
                                    placeholder="Enter the reason for removing this member..."
                                    className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col-reverse gap-3 border-t border-border bg-muted/30 px-6 py-4 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() =>
                                    setShowRemoveRequest(false)
                                }
                                className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleRemoveRequest}
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-destructive px-4 py-2.5 text-sm font-medium text-destructive-foreground transition hover:bg-destructive/90"
                            >
                                <UserMinus size={16} />
                                Remove Member
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ================================================== */}
            {/* TEAM LEADER MONITORING MODAL */}
            {/* ================================================== */}

            {showLeaderWork && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm">
                    <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-xl border border-border bg-card text-foreground shadow-xl">
                        <div className="flex items-center justify-between border-b border-border px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <ShieldCheck
                                        size={20}
                                    />
                                </div>

                                <div>
                                    <h2 className="text-lg font-semibold">
                                        Team Leader Monitoring
                                    </h2>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {
                                            team.teamLeader
                                                ?.name
                                        }
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowLeaderWork(false)
                                }
                                className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                            >
                                <X size={19} />
                            </button>
                        </div>

                        <div className="space-y-6 p-6">
                            {/* Leader information */}
                            <div className="rounded-xl border border-border bg-background p-5">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <UserRound
                                            size={22}
                                        />
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-foreground">
                                            {
                                                team.teamLeader
                                                    ?.name
                                            }
                                        </h3>

                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {
                                                team.teamLeader
                                                    ?.role
                                            }
                                        </p>

                                        <div className="mt-2 flex flex-wrap gap-2">
                                            <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
                                                {
                                                    team
                                                        .teamLeader
                                                        ?.contributorType
                                                }
                                            </span>

                                            <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
                                                {
                                                    team
                                                        .teamLeader
                                                        ?.specialization
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Workflow */}
                            <div>
                                <div className="mb-3">
                                    <h3 className="text-base font-semibold text-foreground">
                                        Work Summary
                                    </h3>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Current activity handled by
                                        the Team Leader.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    <LeaderStat
                                        label="Created / Managed"
                                        value={
                                            teamLeaderWork.created
                                        }
                                    />

                                    <LeaderStat
                                        label="Assigned"
                                        value={
                                            teamLeaderWork.assigned
                                        }
                                    />

                                    <LeaderStat
                                        label="Completed"
                                        value={
                                            teamLeaderWork.completed
                                        }
                                    />

                                    <LeaderStat
                                        label="In Progress"
                                        value={
                                            teamLeaderWork.inProgress
                                        }
                                    />

                                    <LeaderStat
                                        label="Blocked"
                                        value={
                                            teamLeaderWork.blocked
                                        }
                                    />

                                    <LeaderStat
                                        label="Overdue"
                                        value={
                                            teamLeaderWork.overdue
                                        }
                                    />
                                </div>
                            </div>

                            {/* Active sprint */}
                            <div>
                                <div className="mb-3">
                                    <h3 className="text-base font-semibold text-foreground">
                                        Active Sprint
                                    </h3>
                                </div>

                                {activeSprint ? (
                                    <div className="rounded-xl border border-border bg-background p-5">
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <h4 className="font-semibold text-foreground">
                                                    {activeSprint.name ||
                                                        activeSprint.sprintName ||
                                                        "Active Sprint"}
                                                </h4>

                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    {
                                                        (
                                                            activeSprint.tasks ||
                                                            []
                                                        ).length
                                                    }{" "}
                                                    tasks
                                                </p>
                                            </div>

                                            <div className="w-full sm:max-w-xs">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-medium text-muted-foreground">
                                                        Progress
                                                    </span>

                                                    <span className="text-xs font-semibold text-foreground">
                                                        {sprintProgress !==
                                                        null
                                                            ? `${sprintProgress}%`
                                                            : "—"}
                                                    </span>
                                                </div>

                                                <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                                                    <div
                                                        className="h-full rounded-full bg-primary"
                                                        style={{
                                                            width: `${
                                                                sprintProgress ||
                                                                0
                                                            }%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="rounded-xl border border-dashed border-border bg-background p-6 text-center">
                                        <Clock
                                            size={24}
                                            className="mx-auto text-muted-foreground"
                                        />

                                        <p className="mt-2 text-sm font-medium text-foreground">
                                            No active sprint
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Task list */}
                            <div>
                                <div className="mb-3 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-base font-semibold text-foreground">
                                            Team Leader Tasks
                                        </h3>

                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Tasks currently associated
                                            with the Team Leader.
                                        </p>
                                    </div>
                                </div>

                                <div className="overflow-hidden rounded-xl border border-border">
                                    {allTasks.length > 0 ? (
                                        <div className="divide-y divide-border">
                                            {allTasks
                                                .filter(
                                                    (task) => {
                                                        const leaderId =
                                                            getUserId(
                                                                team.teamLeader
                                                            );

                                                        const leaderName =
                                                            getUserName(
                                                                team.teamLeader
                                                            );

                                                        const assignedId =
                                                            task?.assignedDeveloperId ||
                                                            task?.assignedUserId ||
                                                            task?.assigneeId ||
                                                            task?.developerId ||
                                                            task?.userId;

                                                        const assignedName =
                                                            task?.assignedDeveloperName ||
                                                            task?.assigneeName ||
                                                            task?.developerName ||
                                                            task?.assignedToName;

                                                        return (
                                                            (leaderId &&
                                                                assignedId &&
                                                                String(
                                                                    leaderId
                                                                ) ===
                                                                    String(
                                                                        assignedId
                                                                    )) ||
                                                            (leaderName &&
                                                                assignedName &&
                                                                String(
                                                                    leaderName
                                                                ).toLowerCase() ===
                                                                    String(
                                                                        assignedName
                                                                    ).toLowerCase())
                                                        );
                                                    }
                                                )
                                                .slice(0, 10)
                                                .map(
                                                    (
                                                        task,
                                                        index
                                                    ) => {
                                                        const taskStatus =
                                                            normalizeStatus(
                                                                task?.status
                                                            );

                                                        const taskTitle =
                                                            task?.title ||
                                                            task?.name ||
                                                            task?.taskName ||
                                                            "Untitled Task";

                                                        return (
                                                            <div
                                                                key={
                                                                    task?.id ||
                                                                    task?.taskId ||
                                                                    `leader-task-${index}`
                                                                }
                                                                className="flex flex-col gap-3 bg-card px-5 py-4 transition hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between"
                                                            >
                                                                <div className="flex min-w-0 items-start gap-3">
                                                                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                                        <ListChecks
                                                                            size={
                                                                                17
                                                                            }
                                                                        />
                                                                    </div>

                                                                    <div className="min-w-0">
                                                                        <p className="truncate font-medium text-foreground">
                                                                            {
                                                                                taskTitle
                                                                            }
                                                                        </p>

                                                                        <p className="mt-1 text-xs text-muted-foreground">
                                                                            {
                                                                                task.sprintName
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-center gap-3">
                                                                    <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium capitalize text-foreground">
                                                                        {taskStatus ||
                                                                            "Unknown"}
                                                                    </span>

                                                                    <ChevronRight
                                                                        size={
                                                                            17
                                                                        }
                                                                        className="text-muted-foreground"
                                                                    />
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                )}
                                        </div>
                                    ) : (
                                        <div className="p-8 text-center">
                                            <ListChecks
                                                size={28}
                                                className="mx-auto text-muted-foreground"
                                            />

                                            <p className="mt-3 text-sm font-medium text-foreground">
                                                No tasks found
                                            </p>

                                            <p className="mt-1 text-sm text-muted-foreground">
                                                There are currently no
                                                tasks to display.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end border-t border-border bg-muted/30 px-6 py-4">
                            <button
                                type="button"
                                onClick={() =>
                                    setShowLeaderWork(false)
                                }
                                className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ============================================================
// OVERVIEW DETAIL
// ============================================================

function OverviewDetail({
    label,
    value,
    icon: Icon,
}) {
    return (
        <div className="rounded-xl border border-border bg-background p-4">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon size={18} />
                </div>

                <div className="min-w-0">
                    <p className="text-xs font-medium text-muted-foreground">
                        {label}
                    </p>

                    <p className="mt-1 truncate text-sm font-semibold text-foreground">
                        {value}
                    </p>
                </div>
            </div>
        </div>
    );
}

// ============================================================
// MINI OVERVIEW STAT
// ============================================================

function MiniOverviewStat({ label, value }) {
    return (
        <div className="min-w-[70px] rounded-lg border border-border bg-card px-3 py-2">
            <p className="text-[11px] font-medium text-muted-foreground">
                {label}
            </p>

            <p className="mt-1 text-sm font-semibold text-foreground">
                {value}
            </p>
        </div>
    );
}

// ============================================================
// LEADER STAT
// ============================================================

function LeaderStat({ label, value }) {
    return (
        <div className="rounded-xl border border-border bg-muted/30 p-4">
            <p className="text-xs font-medium text-muted-foreground">
                {label}
            </p>

            <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                {value}
            </p>
        </div>
    );
}

export default TeamManagement;