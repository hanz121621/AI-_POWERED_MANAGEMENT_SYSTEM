
import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

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

// IMPORTANT:
// TeamManagement.jsx is inside:
// src/pages/manager/
//
// teamService.js is inside:
// src/services/
//
// Therefore ../../services/teamService is required.
import teamService from "../../services/teamService";

// ============================================================
// COMPONENT
// ============================================================

function TeamManagement() {

    // ========================================================
    // STATE
    // ========================================================

    const [team, setTeam] = useState(null);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [selectedMember, setSelectedMember] =
        useState(null);

    const [showAddRequest, setShowAddRequest] =
        useState(false);

    const [showRemoveRequest, setShowRemoveRequest] =
        useState(false);

    const [showLeaderWork, setShowLeaderWork] =
        useState(false);

    const [requestReason, setRequestReason] =
        useState("");

    const [selectedUserId, setSelectedUserId] =
        useState("");

    const [availableMembers, setAvailableMembers] =
        useState([]);

    const [loadingAvailableMembers, setLoadingAvailableMembers] =
        useState(false);

    const [successMessage, setSuccessMessage] =
        useState("");

    const [errorMessage, setErrorMessage] =
        useState("");

    // ========================================================
    // CURRENT MANAGER
    // ========================================================

    const [currentManager, setCurrentManager] =
        useState(null);

    // ========================================================
    // LOAD CURRENT MANAGER
    // ========================================================

    useEffect(() => {

        let mounted = true;

        async function loadCurrentManager() {

            try {

                if (
                    typeof teamService.getCurrentUser ===
                    "function"
                ) {

                    const manager =
                        await teamService.getCurrentUser();

                    if (mounted) {
                        setCurrentManager(
                            manager
                        );
                    }

                }

            } catch (error) {

                console.error(
                    "Unable to load current manager:",
                    error
                );

            }

        }

        loadCurrentManager();

        return () => {
            mounted = false;
        };

    }, []);

    // ========================================================
    // NORMALIZE TEAM DATA FOR UI
    // ========================================================

    const normalizeTeamForPage = (
        rawTeam
    ) => {

        if (!rawTeam) {
            return null;
        }

        const normalized =
            typeof teamService.normalizeTeam ===
            "function"
                ? teamService.normalizeTeam(
                    rawTeam
                )
                : rawTeam;

        const members =
            Array.isArray(
                normalized?.members
            )
                ? normalized.members
                : [];

        const teamLeader =
            normalized?.teamLeader ||
            normalized?.leader ||
            normalized?.teamLeaderUser ||
            null;

        const sprints =
            Array.isArray(
                normalized?.sprints
            )
                ? normalized.sprints
                : [];

        return {
            ...normalized,

            id:
                normalized?.id ??
                normalized?.teamId,

            name:
                normalized?.name ||
                normalized?.teamName ||
                "Team",

            projectId:
                normalized?.projectId,

            projectName:
                normalized?.projectName ||
                normalized?.project?.name ||
                "Assigned Project",

            managerId:
                normalized?.managerId,

            managerName:
                normalized?.managerName,

            teamLeader:
                teamLeader
                    ? {
                        id:
                            teamLeader.id ??
                            teamLeader.userId ??
                            teamLeader.UserId,

                        name:
                            teamLeader.name ??
                            teamLeader.fullName ??
                            teamLeader.userName ??
                            "Team Leader",

                        role:
                            teamLeader.role ||
                            "Team Leader",

                        contributorType:
                            teamLeader.contributorType ||
                            teamLeader.contributorTypeName ||
                            "Developer",

                        specialization:
                            teamLeader.specialization ||
                            teamLeader.specializationName ||
                            "Software Development",
                    }
                    : null,

            members,

            sprints,
        };

    };

    // ========================================================
    // LOAD ASSIGNED TEAM
    // ========================================================

    const loadTeam = async (
        showRefresh = false
    ) => {

        try {

            if (showRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            clearMessages();

            const teams =
                await teamService.getTeams();

            const normalizedTeams =
                Array.isArray(teams)
                    ? teams
                        .map(
                            (item) =>
                                normalizeTeamForPage(
                                    item
                                )
                        )
                        .filter(Boolean)
                    : [];

            if (
                normalizedTeams.length === 0
            ) {

                setTeam(null);

                return;
            }

            // ------------------------------------------------
            // Prefer a team assigned to the current manager.
            // ------------------------------------------------

            const managerId =
                currentManager?.id ??
                currentManager?.userId ??
                currentManager?.Id ??
                currentManager?.UserId;

            let selectedTeam = null;

            if (managerId) {

                selectedTeam =
                    normalizedTeams.find(
                        (item) =>
                            String(
                                item.managerId
                            ) ===
                            String(managerId)
                    );
            }

            // ------------------------------------------------
            // If the service/API already returns the
            // manager's authorized team, use the first one.
            // ------------------------------------------------

            if (!selectedTeam) {

                selectedTeam =
                    normalizedTeams.find(
                        (item) =>
                            item.managerId
                    ) ||
                    normalizedTeams[0];
            }

            // ------------------------------------------------
            // Get full team details when possible.
            // ------------------------------------------------

            if (
                selectedTeam?.id
            ) {

                try {

                    const detailedTeam =
                        await teamService.getTeamById(
                            selectedTeam.id
                        );

                    if (detailedTeam) {

                        selectedTeam =
                            normalizeTeamForPage(
                                detailedTeam
                            );

                    }

                } catch (detailError) {

                    console.warn(
                        "Unable to load detailed team. Using team list data:",
                        detailError
                    );

                }

            }

            // ------------------------------------------------
            // Get members directly from member endpoint.
            // ------------------------------------------------

            if (
                selectedTeam?.id &&
                typeof teamService.getTeamMembers ===
                "function"
            ) {

                try {

                    const members =
                        await teamService.getTeamMembers(
                            selectedTeam.id
                        );

                    selectedTeam = {
                        ...selectedTeam,

                        members:
                            Array.isArray(
                                members
                            )
                                ? members
                                : selectedTeam.members ||
                                [],
                    };

                } catch (memberError) {

                    console.warn(
                        "Unable to load team members:",
                        memberError
                    );

                }

            }

            setTeam(
                selectedTeam
            );

        } catch (error) {

            console.error(
                "Unable to load team:",
                error
            );

            setTeam(null);

            showError(
                error?.message ||
                "Unable to load team management data."
            );

        } finally {

            setLoading(false);
            setRefreshing(false);

        }

    };

    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {

        loadTeam();

    }, []);

    // ========================================================
    // RELOAD WHEN CURRENT MANAGER BECOMES AVAILABLE
    // ========================================================

    useEffect(() => {

        if (currentManager) {
            loadTeam();
        }

    }, [currentManager]);

    // ========================================================
    // CLEAR MESSAGES
    // ========================================================

    const clearMessages = () => {

        setSuccessMessage("");
        setErrorMessage("");

    };

    // ========================================================
    // SUCCESS MESSAGE
    // ========================================================

    const showSuccess = (
        message
    ) => {

        setErrorMessage("");
        setSuccessMessage(
            message
        );

        window.setTimeout(() => {

            setSuccessMessage("");

        }, 4000);

    };

    // ========================================================
    // ERROR MESSAGE
    // ========================================================

    const showError = (
        message
    ) => {

        setSuccessMessage("");
        setErrorMessage(
            message
        );

    };

    // ========================================================
    // TEAM MEMBERS
    // ========================================================

    const members = useMemo(() => {

        return Array.isArray(
            team?.members
        )
            ? team.members
            : [];

    }, [team]);

    // ========================================================
    // ALL SPRINT TASKS
    // ========================================================

    const allTasks = useMemo(() => {

        if (!team) {
            return [];
        }

        return (
            team.sprints || []
        ).flatMap(
            (sprint) =>
                (
                    sprint.tasks ||
                    []
                ).map(
                    (task) => ({
                        ...task,

                        sprintId:
                            sprint.id,

                        sprintName:
                            sprint.name,
                    })
                )
        );

    }, [team]);

    // ========================================================
    // ACTIVE SPRINT
    // ========================================================

    const activeSprint = useMemo(() => {

        return (
            team?.sprints || []
        ).find(
            (sprint) =>
                String(
                    sprint.status
                ).toLowerCase() ===
                "active"
        );

    }, [team]);

    // ========================================================
    // TASK STATS
    // ========================================================

    const taskStats = useMemo(() => {

        const completed =
            allTasks.filter(
                (task) =>
                    String(
                        task.status
                    ).toLowerCase() ===
                    "completed"
            ).length;

        const inProgress =
            allTasks.filter(
                (task) =>
                    String(
                        task.status
                    ).toLowerCase() ===
                    "in progress"
            ).length;

        const blocked =
            allTasks.filter(
                (task) =>
                    String(
                        task.status
                    ).toLowerCase() ===
                    "blocked"
            ).length;

        const remaining =
            allTasks.filter(
                (task) =>
                    String(
                        task.status
                    ).toLowerCase() !==
                    "completed"
            ).length;

        return {

            total:
                allTasks.length,

            completed,

            inProgress,

            blocked,

            remaining,

        };

    }, [allTasks]);

    // ========================================================
    // OVERDUE TASKS
    // ========================================================

    const overdueTasks = useMemo(() => {

        const now =
            new Date();

        return allTasks.filter(
            (task) => {

                if (
                    String(
                        task.status
                    ).toLowerCase() ===
                    "completed"
                ) {
                    return false;
                }

                if (
                    !task.deadline
                ) {
                    return false;
                }

                const deadline =
                    new Date(
                        task.deadline
                    );

                return (
                    !Number.isNaN(
                        deadline.getTime()
                    ) &&
                    deadline < now
                );

            }
        );

    }, [allTasks]);

    // ========================================================
    // TEAM COMPLETION
    // ========================================================

    const teamCompletion = useMemo(() => {

        if (
            !allTasks.length
        ) {
            return null;
        }

        return Math.round(
            (
                taskStats.completed /
                allTasks.length
            ) * 100
        );

    }, [
        allTasks.length,
        taskStats.completed,
    ]);

    // ========================================================
    // SPRINT PROGRESS
    // ========================================================

    const sprintProgress = useMemo(() => {

        if (!activeSprint) {
            return null;
        }

        const tasks =
            activeSprint.tasks ||
            [];

        if (
            !tasks.length
        ) {
            return null;
        }

        const completed =
            tasks.filter(
                (task) =>
                    String(
                        task.status
                    ).toLowerCase() ===
                    "completed"
            ).length;

        return Math.round(
            (
                completed /
                tasks.length
            ) * 100
        );

    }, [activeSprint]);

    // ========================================================
    // MEMBER WORKLOAD
    // ========================================================

    const memberWorkload = useMemo(() => {

        return members.map(
            (member) => {

                const memberId =
                    member.userId ??
                    member.id ??
                    member.UserId ??
                    member.Id;

                const memberName =
                    member.name ??
                    member.fullName ??
                    member.userName ??
                    "Unknown Member";

                const tasks =
                    allTasks.filter(
                        (task) => {

                            const assigneeId =
                                task.assigneeId ??
                                task.userId ??
                                task.assignedToId;

                            if (
                                assigneeId &&
                                memberId
                            ) {

                                return (
                                    String(
                                        assigneeId
                                    ) ===
                                    String(
                                        memberId
                                    )
                                );

                            }

                            return (
                                String(
                                    task.assignee
                                ).toLowerCase() ===
                                String(
                                    memberName
                                ).toLowerCase()
                            );

                        }
                    );

                const activeTasks =
                    tasks.filter(
                        (task) =>
                            String(
                                task.status
                            ).toLowerCase() !==
                            "completed"
                    );

                return {

                    ...member,

                    id:
                        memberId,

                    userId:
                        memberId,

                    name:
                        memberName,

                    role:
                        member.role ||
                        member.roleName ||
                        "Contributor",

                    contributorType:
                        member.contributorType ||
                        member.contributorTypeName ||
                        "Contributor",

                    specialization:
                        member.specialization ||
                        member.specializationName ||
                        "—",

                    active:
                        member.active ??
                        member.isActive ??
                        true,

                    totalTasks:
                        tasks.length,

                    activeTasks:
                        activeTasks.length,

                };

            }
        );

    }, [
        members,
        allTasks,
    ]);

    // ========================================================
    // TEAM LEADER WORK
    // ========================================================

    const teamLeaderWork = useMemo(() => {

        const leader =
            team?.teamLeader;

        if (!leader) {

            return {

                createdTasks: 0,
                assignedTasks: 0,
                completedTasks: 0,
                inProgressTasks: 0,
                blockedTasks: 0,
                overdueTasks: 0,

            };

        }

        const leaderId =
            leader.id ??
            leader.userId;

        const leaderName =
            leader.name ||
            "";

        const createdTasks =
            allTasks.filter(
                (task) => {

                    const createdById =
                        task.createdById ??
                        task.creatorId;

                    if (
                        createdById &&
                        leaderId
                    ) {

                        return (
                            String(
                                createdById
                            ) ===
                            String(
                                leaderId
                            )
                        );

                    }

                    return (
                        String(
                            task.createdBy
                        ).toLowerCase() ===
                        String(
                            leaderName
                        ).toLowerCase()
                    );

                }
            );

        const completedTasks =
            createdTasks.filter(
                (task) =>
                    String(
                        task.status
                    ).toLowerCase() ===
                    "completed"
            );

        const inProgressTasks =
            createdTasks.filter(
                (task) =>
                    String(
                        task.status
                    ).toLowerCase() ===
                    "in progress"
            );

        const blockedTasks =
            createdTasks.filter(
                (task) =>
                    String(
                        task.status
                    ).toLowerCase() ===
                    "blocked"
            );

        const overdue =
            createdTasks.filter(
                (task) =>
                    overdueTasks.includes(
                        task
                    )
            );

        const assignedTasks =
            createdTasks.filter(
                (task) =>
                    Boolean(
                        task.assignee ||
                        task.assigneeId ||
                        task.userId ||
                        task.assignedToId
                    )
            );

        return {

            createdTasks:
                createdTasks.length,

            assignedTasks:
                assignedTasks.length,

            completedTasks:
                completedTasks.length,

            inProgressTasks:
                inProgressTasks.length,

            blockedTasks:
                blockedTasks.length,

            overdueTasks:
                overdue.length,

        };

    }, [
        team,
        allTasks,
        overdueTasks,
    ]);

    // ========================================================
    // LOAD AVAILABLE MEMBERS
    // ========================================================

    const loadAvailableMembers =
        async () => {

            if (!team?.id) {
                return;
            }

            try {

                setLoadingAvailableMembers(
                    true
                );

                let users = [];

                if (
                    typeof teamService.getAvailableTeamMembers ===
                    "function"
                ) {

                    users =
                        await teamService.getAvailableTeamMembers(
                            team.id
                        );

                } else if (
                    typeof teamService.getTeamMemberCandidates ===
                    "function"
                ) {

                    users =
                        await teamService.getTeamMemberCandidates(
                            team.id
                        );

                }

                setAvailableMembers(
                    Array.isArray(users)
                        ? users
                        : []
                );

            } catch (error) {

                console.error(
                    "Unable to load available team members:",
                    error
                );

                showError(
                    error?.message ||
                    "Unable to load available users."
                );

                setAvailableMembers([]);

            } finally {

                setLoadingAvailableMembers(
                    false
                );

            }

        };

    // ========================================================
    // OPEN ADD MEMBER MODAL
    // ========================================================

    const openAddMemberModal =
        async () => {

            clearMessages();

            setRequestReason("");
            setSelectedUserId("");
            setShowAddRequest(true);

            await loadAvailableMembers();

        };

    // ========================================================
    // ADD MEMBER
    //
    // This now uses the actual team service.
    // ========================================================

    const handleAddRequest =
        async () => {

            clearMessages();

            if (!team?.id) {

                showError(
                    "No team is currently assigned to this manager."
                );

                return;
            }

            if (!selectedUserId) {

                showError(
                    "Please select a user."
                );

                return;
            }

            if (!requestReason.trim()) {

                showError(
                    "Please provide a reason for the request."
                );

                return;
            }

            const selectedUser =
                availableMembers.find(
                    (user) =>
                        String(
                            user.id ??
                            user.userId
                        ) ===
                        String(
                            selectedUserId
                        )
                );

            if (!selectedUser) {

                showError(
                    "The selected user could not be found."
                );

                return;
            }

            try {

                // ------------------------------------------------
                // IMPORTANT:
                // Your current teamService.addMemberToTeam()
                // performs the actual POST:
                //
                // POST /teams/{teamId}/members
                //
                // Therefore this is a real add operation,
                // not merely a conceptual pending request.
                // ------------------------------------------------

                const result =
                    await teamService.addMemberToTeam(
                        team.id,
                        selectedUserId
                    );

                if (!result?.success) {

                    showError(
                        result?.message ||
                        "Unable to add member."
                    );

                    return;
                }

                showSuccess(
                    "Team member added successfully."
                );

                setShowAddRequest(false);
                setSelectedUserId("");
                setRequestReason("");

                await loadTeam(true);

            } catch (error) {

                console.error(
                    "Unable to add team member:",
                    error
                );

                showError(
                    error?.message ||
                    "Unable to add member. Please try again."
                );

            }

        };

    // ========================================================
    // REMOVE MEMBER
    //
    // Uses actual teamService.removeMemberFromTeam()
    // ========================================================

    const handleRemoveRequest =
        async () => {

            clearMessages();

            if (!team?.id) {

                showError(
                    "No team is currently assigned to this manager."
                );

                return;
            }

            if (!selectedMember) {

                showError(
                    "Please select a team member."
                );

                return;
            }

            if (!requestReason.trim()) {

                showError(
                    "Please provide a reason for the removal."
                );

                return;
            }

            const userId =
                selectedMember.userId ??
                selectedMember.id;

            if (!userId) {

                showError(
                    "Unable to identify the selected member."
                );

                return;
            }

            try {

                const result =
                    await teamService.removeMemberFromTeam(
                        team.id,
                        userId
                    );

                if (!result?.success) {

                    showError(
                        result?.message ||
                        "Unable to remove member."
                    );

                    return;
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
                    error?.message ||
                    "Unable to remove member. Please try again."
                );

            }

        };

    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {

        return (
            <div className="min-h-screen bg-slate-50">

                <main className="min-h-screen">

                    <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">

                        <div className="flex min-h-[500px] items-center justify-center">

                            <div className="text-center">

                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100">

                                    <RefreshCw
                                        size={27}
                                        className="animate-spin text-violet-600"
                                    />

                                </div>

                                <h2 className="mt-4 text-lg font-bold text-slate-900">
                                    Loading Team Management
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Loading your assigned team and current workload...
                                </p>

                            </div>

                        </div>

                    </div>

                </main>

            </div>
        );

    }

    // ========================================================
    // NO TEAM
    // ========================================================

    if (!team) {

        return (
            <div className="min-h-screen bg-slate-50 text-slate-900">

                <main className="min-h-screen">

                    <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">

                        <div className="mb-8 rounded-2xl bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 p-7 text-white shadow-lg">

                            <div className="flex items-center gap-4">

                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">

                                    <UsersRound
                                        size={28}
                                    />

                                </div>

                                <div>

                                    <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-white/70">
                                        Team Workspace
                                    </p>

                                    <h1 className="text-3xl font-bold">
                                        Team Management and Monitoring
                                    </h1>

                                    <p className="mt-1 text-sm text-white/80">
                                        View your assigned team, monitor workload and progress, and manage team membership.
                                    </p>

                                </div>

                            </div>

                        </div>

                        {errorMessage && (

                            <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">

                                <AlertTriangle
                                    size={19}
                                />

                                {errorMessage}

                            </div>

                        )}

                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">

                            <UsersRound
                                size={40}
                                className="mx-auto text-slate-400"
                            />

                            <h2 className="mt-4 text-xl font-bold text-slate-900">
                                No Assigned Team
                            </h2>

                            <p className="mx-auto mt-2 max-w-lg text-sm text-slate-500">
                                No team is currently assigned to this Manager. Once a team is assigned, its members, Team Leader, Sprint progress, and workload will appear here.
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    loadTeam(true)
                                }
                                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-violet-700"
                            >

                                <RefreshCw
                                    size={17}
                                />

                                Refresh

                            </button>

                        </div>

                    </div>

                </main>

            </div>
        );

    }

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

                    <div className="mb-8 rounded-2xl bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 p-7 text-white shadow-lg">

                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                            <div className="flex items-center gap-4">

                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">

                                    <UsersRound
                                        size={28}
                                    />

                                </div>

                                <div>

                                    <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-white/70">
                                        Team Workspace
                                    </p>

                                    <h1 className="text-3xl font-bold">
                                        Team Management and Monitoring
                                    </h1>

                                    <p className="mt-1 text-sm text-white/80">
                                        View your assigned team, monitor workload and progress, and manage team membership.
                                    </p>

                                </div>

                            </div>

                            <div className="flex items-center gap-3">

                                <div className="rounded-xl bg-white/10 px-4 py-3 ring-1 ring-white/20">

                                    <p className="text-xs text-white/70">
                                        Project
                                    </p>

                                    <p className="mt-1 text-sm font-bold">
                                        {
                                            team.projectName
                                        }
                                    </p>

                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        loadTeam(true)
                                    }
                                    disabled={
                                        refreshing
                                    }
                                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-white ring-1 ring-white/20 transition hover:bg-white/20 disabled:opacity-50"
                                    title="Refresh"
                                >

                                    <RefreshCw
                                        size={19}
                                        className={
                                            refreshing
                                                ? "animate-spin"
                                                : ""
                                        }
                                    />

                                </button>

                            </div>

                        </div>

                    </div>

                    {/* ==================================================
                        SUCCESS
                    ================================================== */}

                    {successMessage && (

                        <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">

                            <CheckCircle2
                                size={19}
                            />

                            {successMessage}

                        </div>

                    )}

                    {/* ==================================================
                        ERROR
                    ================================================== */}

                    {errorMessage && (

                        <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">

                            <AlertTriangle
                                size={19}
                            />

                            {errorMessage}

                        </div>

                    )}

                    {/* ==================================================
                        TEAM OVERVIEW
                    ================================================== */}

                    <section className="mb-8">

                        <div className="mb-5">

                            <h2 className="text-xl font-bold text-slate-900">
                                Assigned Team
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Current team relationship for your authorized project.
                            </p>

                        </div>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

                            {/* TEAM */}

                            <div className="rounded-2xl border border-violet-200 bg-white p-5 shadow-sm">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100">

                                    <UsersRound
                                        size={22}
                                        className="text-violet-600"
                                    />

                                </div>

                                <p className="mt-4 text-sm text-slate-500">
                                    Team
                                </p>

                                <p className="mt-1 text-lg font-bold text-slate-900">
                                    {
                                        team.name
                                    }
                                </p>

                            </div>

                            {/* MEMBERS */}

                            <div className="rounded-2xl border border-blue-200 bg-white p-5 shadow-sm">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">

                                    <UserRound
                                        size={22}
                                        className="text-blue-600"
                                    />

                                </div>

                                <p className="mt-4 text-sm text-slate-500">
                                    Team Members
                                </p>

                                <p className="mt-1 text-3xl font-bold">
                                    {
                                        members.length
                                    }
                                </p>

                            </div>

                            {/* WORKLOAD */}

                            <div className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100">

                                    <BriefcaseBusiness
                                        size={22}
                                        className="text-amber-600"
                                    />

                                </div>

                                <p className="mt-4 text-sm text-slate-500">
                                    Current Workload
                                </p>

                                <p className="mt-1 text-3xl font-bold">
                                    {
                                        taskStats.remaining
                                    }
                                </p>

                                <p className="mt-1 text-xs text-slate-400">
                                    Active assigned tasks
                                </p>

                            </div>

                            {/* COMPLETION */}

                            <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100">

                                    <Activity
                                        size={22}
                                        className="text-emerald-600"
                                    />

                                </div>

                                <p className="mt-4 text-sm text-slate-500">
                                    Team Completion
                                </p>

                                <p className="mt-1 text-3xl font-bold">
                                    {
                                        teamCompletion ===
                                            null
                                            ? "—"
                                            : `${teamCompletion}%`
                                    }
                                </p>

                            </div>

                        </div>

                    </section>

                    {/* ==================================================
                        TEAM LEADER
                    ================================================== */}

                    <section className="mb-8">

                        <div className="mb-5 flex items-end justify-between">

                            <div>

                                <h2 className="text-xl font-bold">
                                    Team Leader
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Current Team Leader identified from the team relationship.
                                </p>

                            </div>

                            {team.teamLeader && (

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowLeaderWork(
                                            true
                                        )
                                    }
                                    className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-violet-700"
                                >

                                    <Eye
                                        size={17}
                                    />

                                    Monitor Work

                                </button>

                            )}

                        </div>

                        {team.teamLeader ? (

                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                                    <div className="flex items-center gap-4">

                                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-100">

                                            <ShieldCheck
                                                size={27}
                                                className="text-violet-600"
                                            />

                                        </div>

                                        <div>

                                            <h3 className="text-lg font-bold">
                                                {
                                                    team.teamLeader.name
                                                }
                                            </h3>

                                            <p className="text-sm text-slate-500">
                                                {
                                                    team.teamLeader.role
                                                }
                                            </p>

                                            <div className="mt-2 flex flex-wrap gap-2">

                                                <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                                                    {
                                                        team.teamLeader
                                                            .contributorType
                                                    }
                                                </span>

                                                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                                    {
                                                        team.teamLeader
                                                            .specialization
                                                    }
                                                </span>

                                            </div>

                                        </div>

                                    </div>

                                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">

                                        <div>

                                            <p className="text-xs text-slate-400">
                                                Created
                                            </p>

                                            <p className="mt-1 text-lg font-bold">
                                                {
                                                    teamLeaderWork.createdTasks
                                                }
                                            </p>

                                        </div>

                                        <div>

                                            <p className="text-xs text-slate-400">
                                                Completed
                                            </p>

                                            <p className="mt-1 text-lg font-bold text-emerald-600">
                                                {
                                                    teamLeaderWork.completedTasks
                                                }
                                            </p>

                                        </div>

                                        <div>

                                            <p className="text-xs text-slate-400">
                                                In Progress
                                            </p>

                                            <p className="mt-1 text-lg font-bold text-blue-600">
                                                {
                                                    teamLeaderWork.inProgressTasks
                                                }
                                            </p>

                                        </div>

                                        <div>

                                            <p className="text-xs text-slate-400">
                                                Blocked
                                            </p>

                                            <p className="mt-1 text-lg font-bold text-red-600">
                                                {
                                                    teamLeaderWork.blockedTasks
                                                }
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        ) : (

                            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">

                                <ShieldCheck
                                    size={32}
                                    className="mx-auto text-slate-400"
                                />

                                <h3 className="mt-3 font-bold">
                                    No Team Leader Assigned
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                    This team currently has no Team Leader.
                                </p>

                            </div>

                        )}

                    </section>

                    {/* ==================================================
                        MEMBERS
                    ================================================== */}

                    <section className="mb-8">

                        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

                            <div>

                                <h2 className="text-xl font-bold">
                                    Team Members
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Developers and Staff with their current contributor classifications and workload.
                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={
                                    openAddMemberModal
                                }
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:from-violet-700 hover:to-blue-700"
                            >

                                <Plus
                                    size={17}
                                />

                                Add Member

                            </button>

                        </div>

                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                            <div className="overflow-x-auto">

                                <table className="w-full min-w-[850px]">

                                    <thead className="border-b border-slate-200 bg-slate-50">

                                        <tr>

                                            <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                                Member
                                            </th>

                                            <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                                Type
                                            </th>

                                            <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                                Specialization
                                            </th>

                                            <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                                Workload
                                            </th>

                                            <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                                Status
                                            </th>

                                            <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                                                Action
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody className="divide-y divide-slate-100">

                                        {memberWorkload.length > 0 ? (

                                            memberWorkload.map(
                                                (member) => (

                                                    <tr
                                                        key={
                                                            member.id
                                                        }
                                                        className="transition hover:bg-slate-50"
                                                    >

                                                        <td className="px-5 py-4">

                                                            <div className="flex items-center gap-3">

                                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">

                                                                    <UserRound
                                                                        size={18}
                                                                        className="text-blue-600"
                                                                    />

                                                                </div>

                                                                <div>

                                                                    <p className="font-semibold text-slate-900">
                                                                        {
                                                                            member.name
                                                                        }
                                                                    </p>

                                                                    <p className="text-xs text-slate-500">
                                                                        {
                                                                            member.role
                                                                        }
                                                                    </p>

                                                                </div>

                                                            </div>

                                                        </td>

                                                        <td className="px-5 py-4">

                                                            <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                                                                {
                                                                    member.contributorType
                                                                }
                                                            </span>

                                                        </td>

                                                        <td className="px-5 py-4 text-sm text-slate-600">
                                                            {
                                                                member.specialization
                                                            }
                                                        </td>

                                                        <td className="px-5 py-4">

                                                            <div className="flex items-center gap-3">

                                                                <span className="font-bold text-slate-900">
                                                                    {
                                                                        member.activeTasks
                                                                    }
                                                                </span>

                                                                <span className="text-xs text-slate-400">
                                                                    active
                                                                </span>

                                                            </div>

                                                        </td>

                                                        <td className="px-5 py-4">

                                                            <span
                                                                className={
                                                                    member.active
                                                                        ? "inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
                                                                        : "inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
                                                                }
                                                            >

                                                                <CircleDot
                                                                    size={11}
                                                                />

                                                                {
                                                                    member.active
                                                                        ? "Active"
                                                                        : "Inactive"
                                                                }

                                                            </span>

                                                        </td>

                                                        <td className="px-5 py-4 text-right">

                                                            <button
                                                                type="button"
                                                                onClick={() => {

                                                                    clearMessages();

                                                                    setSelectedMember(
                                                                        member
                                                                    );

                                                                    setRequestReason(
                                                                        ""
                                                                    );

                                                                    setShowRemoveRequest(
                                                                        true
                                                                    );

                                                                }}
                                                                className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50"
                                                            >

                                                                <UserMinus
                                                                    size={15}
                                                                />

                                                                Remove

                                                            </button>

                                                        </td>

                                                    </tr>

                                                )
                                            )

                                        ) : (

                                            <tr>

                                                <td
                                                    colSpan="6"
                                                    className="px-5 py-12 text-center"
                                                >

                                                    <UsersRound
                                                        size={32}
                                                        className="mx-auto text-slate-400"
                                                    />

                                                    <p className="mt-3 font-semibold text-slate-700">
                                                        No team members
                                                    </p>

                                                    <p className="mt-1 text-sm text-slate-500">
                                                        This team currently has no members.
                                                    </p>

                                                </td>

                                            </tr>

                                        )}

                                    </tbody>

                                </table>

                            </div>

                        </div>

                    </section>

                    {/* ==================================================
                        PROGRESS
                    ================================================== */}

                    <section className="mb-8">

                        <div className="mb-5">

                            <h2 className="text-xl font-bold">
                                Team Progress
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Calculated from current Sprint and task records.
                            </p>

                        </div>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

                            <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">

                                <CheckCircle2
                                    size={23}
                                    className="text-emerald-600"
                                />

                                <p className="mt-4 text-sm text-slate-500">
                                    Team Completion
                                </p>

                                <p className="mt-1 text-3xl font-bold">
                                    {
                                        teamCompletion ===
                                            null
                                            ? "—"
                                            : `${teamCompletion}%`
                                    }
                                </p>

                            </div>

                            <div className="rounded-2xl border border-blue-200 bg-white p-5 shadow-sm">

                                <CheckCircle2
                                    size={23}
                                    className="text-blue-600"
                                />

                                <p className="mt-4 text-sm text-slate-500">
                                    Completed Tasks
                                </p>

                                <p className="mt-1 text-3xl font-bold">
                                    {
                                        taskStats.completed
                                    }
                                </p>

                            </div>

                            <div className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">

                                <Clock
                                    size={23}
                                    className="text-amber-600"
                                />

                                <p className="mt-4 text-sm text-slate-500">
                                    Remaining Tasks
                                </p>

                                <p className="mt-1 text-3xl font-bold">
                                    {
                                        taskStats.remaining
                                    }
                                </p>

                            </div>

                            <div className="rounded-2xl border border-red-200 bg-white p-5 shadow-sm">

                                <AlertTriangle
                                    size={23}
                                    className="text-red-600"
                                />

                                <p className="mt-4 text-sm text-slate-500">
                                    Blocked Tasks
                                </p>

                                <p className="mt-1 text-3xl font-bold">
                                    {
                                        taskStats.blocked
                                    }
                                </p>

                            </div>

                        </div>

                    </section>

                    {/* ==================================================
                        CURRENT SPRINT
                    ================================================== */}

                    <section>

                        <div className="mb-5">

                            <h2 className="text-xl font-bold">
                                Current Sprint
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Sprint progress for the assigned Team.
                            </p>

                        </div>

                        {activeSprint ? (

                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                                    <div>

                                        <div className="flex items-center gap-2">

                                            <Target
                                                size={20}
                                                className="text-violet-600"
                                            />

                                            <h3 className="text-lg font-bold">
                                                {
                                                    activeSprint.name
                                                }
                                            </h3>

                                            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                                                Active
                                            </span>

                                        </div>

                                        <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">

                                            <span className="flex items-center gap-1.5">

                                                <CalendarDays
                                                    size={15}
                                                />

                                                {
                                                    activeSprint.startDate ||
                                                    activeSprint.startDateTime ||
                                                    "—"
                                                }

                                            </span>

                                            <span>
                                                →
                                            </span>

                                            <span>
                                                {
                                                    activeSprint.endDate ||
                                                    activeSprint.endDateTime ||
                                                    "—"
                                                }
                                            </span>

                                        </div>

                                    </div>

                                    <div className="w-full max-w-sm">

                                        <div className="mb-2 flex items-center justify-between">

                                            <span className="text-sm font-semibold text-slate-600">
                                                Sprint Progress
                                            </span>

                                            <span className="text-sm font-bold text-violet-600">
                                                {
                                                    sprintProgress ===
                                                        null
                                                        ? "—"
                                                        : `${sprintProgress}%`
                                                }
                                            </span>

                                        </div>

                                        <div className="h-3 overflow-hidden rounded-full bg-slate-100">

                                            {sprintProgress !==
                                                null && (

                                                    <div
                                                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-600 transition-all"
                                                        style={{
                                                            width: `${sprintProgress}%`,
                                                        }}
                                                    />

                                                )}

                                        </div>

                                    </div>

                                </div>

                            </div>

                        ) : (

                            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">

                                <ListChecks
                                    size={32}
                                    className="mx-auto text-slate-400"
                                />

                                <h3 className="mt-3 font-bold">
                                    No Active Sprint
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                    There is currently no active Sprint assigned to this Team.
                                </p>

                            </div>

                        )}

                    </section>

                </div>

            </main>

            {/* ==========================================================
                ADD MEMBER MODAL
            ========================================================== */}

            {showAddRequest && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">

                    <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

                            <div>

                                <h2 className="text-lg font-bold">
                                    Add Team Member
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Select an eligible Developer or Staff member.
                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowAddRequest(
                                        false
                                    )
                                }
                                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                            >

                                <X
                                    size={19}
                                />

                            </button>

                        </div>

                        <div className="space-y-5 px-6 py-6">

                            <div>

                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                    Available User
                                </label>

                                {loadingAvailableMembers ? (

                                    <div className="flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-3 text-sm text-slate-500">

                                        <RefreshCw
                                            size={16}
                                            className="animate-spin"
                                        />

                                        Loading eligible users...

                                    </div>

                                ) : (

                                    <select
                                        value={
                                            selectedUserId
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setSelectedUserId(
                                                event.target.value
                                            )
                                        }
                                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                                    >

                                        <option value="">
                                            Select user
                                        </option>

                                        {availableMembers.map(
                                            (user) => {

                                                const id =
                                                    user.id ??
                                                    user.userId;

                                                const name =
                                                    user.name ??
                                                    user.fullName ??
                                                    user.userName ??
                                                    "Unknown User";

                                                const type =
                                                    user.contributorType ??
                                                    user.contributorTypeName ??
                                                    user.role ??
                                                    "Contributor";

                                                return (

                                                    <option
                                                        key={
                                                            id
                                                        }
                                                        value={
                                                            id
                                                        }
                                                    >
                                                        {name} — {type}
                                                    </option>

                                                );

                                            }
                                        )}

                                    </select>

                                )}

                                {!loadingAvailableMembers &&
                                    availableMembers.length ===
                                    0 && (

                                        <p className="mt-2 text-xs text-slate-500">
                                            No eligible users are currently available for this team.
                                        </p>

                                    )}

                            </div>

                            <div>

                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                    Reason
                                </label>

                                <textarea
                                    rows={4}
                                    value={
                                        requestReason
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setRequestReason(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Explain why this user should be added to the team..."
                                    className="w-full resize-none rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                                />

                            </div>

                        </div>

                        <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">

                            <button
                                type="button"
                                onClick={() =>
                                    setShowAddRequest(
                                        false
                                    )
                                }
                                className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={
                                    handleAddRequest
                                }
                                disabled={
                                    loadingAvailableMembers ||
                                    !selectedUserId
                                }
                                className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >

                                <Send
                                    size={17}
                                />

                                Add Member

                            </button>

                        </div>

                    </div>

                </div>

            )}

            {/* ==========================================================
                REMOVE MEMBER MODAL
            ========================================================== */}

            {showRemoveRequest &&
                selectedMember && (

                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">

                        <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

                            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

                                <div>

                                    <h2 className="text-lg font-bold">
                                        Remove Team Member
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        This action removes the member from the current team.
                                    </p>

                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowRemoveRequest(
                                            false
                                        )
                                    }
                                    className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                                >

                                    <X
                                        size={19}
                                    />

                                </button>

                            </div>

                            <div className="px-6 py-6">

                                <div className="rounded-xl border border-red-200 bg-red-50 p-4">

                                    <div className="flex items-center gap-3">

                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">

                                            <UserMinus
                                                size={19}
                                                className="text-red-600"
                                            />

                                        </div>

                                        <div>

                                            <p className="font-bold text-slate-900">
                                                {
                                                    selectedMember.name
                                                }
                                            </p>

                                            <p className="text-sm text-slate-500">
                                                {
                                                    selectedMember.contributorType
                                                }
                                            </p>

                                        </div>

                                    </div>

                                </div>

                                <div className="mt-5">

                                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                        Reason
                                    </label>

                                    <textarea
                                        rows={4}
                                        value={
                                            requestReason
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setRequestReason(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Explain why removal is required..."
                                        className="w-full resize-none rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                    />

                                </div>

                            </div>

                            <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowRemoveRequest(
                                            false
                                        )
                                    }
                                    className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        handleRemoveRequest
                                    }
                                    className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-red-700"
                                >

                                    <UserMinus
                                        size={17}
                                    />

                                    Remove Member

                                </button>

                            </div>

                        </div>

                    </div>

                )}

            {/* ==========================================================
                TEAM LEADER MONITORING MODAL
            ========================================================== */}

            {showLeaderWork && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">

                    <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">

                        <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">

                            <div>

                                <h2 className="text-lg font-bold">
                                    Monitor Team Leader Work
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Monitoring only — task assignment remains the Team Leader's responsibility.
                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowLeaderWork(
                                        false
                                    )
                                }
                                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                            >

                                <X
                                    size={19}
                                />

                            </button>

                        </div>

                        <div className="space-y-6 px-6 py-6">

                            {/* WORKFLOW */}

                            <div className="rounded-xl border border-violet-200 bg-violet-50 p-4">

                                <p className="text-xs font-bold uppercase tracking-wide text-violet-600">
                                    Management Workflow
                                </p>

                                <div className="mt-4 flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-700">

                                    <span>
                                        Manager
                                    </span>

                                    <ChevronRight
                                        size={16}
                                    />

                                    <span>
                                        Sprint
                                    </span>

                                    <ChevronRight
                                        size={16}
                                    />

                                    <span>
                                        Team
                                    </span>

                                    <ChevronRight
                                        size={16}
                                    />

                                    <span>
                                        Team Leader
                                    </span>

                                    <ChevronRight
                                        size={16}
                                    />

                                    <span>
                                        Tasks
                                    </span>

                                    <ChevronRight
                                        size={16}
                                    />

                                    <span>
                                        Developer / Staff
                                    </span>

                                </div>

                            </div>

                            {/* STATS */}

                            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">

                                <LeaderStat
                                    label="Tasks Created"
                                    value={
                                        teamLeaderWork.createdTasks
                                    }
                                />

                                <LeaderStat
                                    label="Tasks Assigned"
                                    value={
                                        teamLeaderWork.assignedTasks
                                    }
                                />

                                <LeaderStat
                                    label="Completed"
                                    value={
                                        teamLeaderWork.completedTasks
                                    }
                                />

                                <LeaderStat
                                    label="In Progress"
                                    value={
                                        teamLeaderWork.inProgressTasks
                                    }
                                />

                                <LeaderStat
                                    label="Blocked"
                                    value={
                                        teamLeaderWork.blockedTasks
                                    }
                                />

                                <LeaderStat
                                    label="Overdue"
                                    value={
                                        teamLeaderWork.overdueTasks
                                    }
                                />

                            </div>

                            {/* ACTIVE SPRINT */}

                            <div>

                                <h3 className="mb-3 font-bold">
                                    Active Sprint
                                </h3>

                                {activeSprint ? (

                                    <div className="rounded-xl border border-slate-200 p-4">

                                        <div className="flex items-center justify-between">

                                            <div>

                                                <p className="font-bold">
                                                    {
                                                        activeSprint.name
                                                    }
                                                </p>

                                                <p className="mt-1 text-sm text-slate-500">
                                                    {
                                                        activeSprint.tasks?.length ||
                                                        0
                                                    }{" "}
                                                    tasks
                                                </p>

                                            </div>

                                            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                                                Active
                                            </span>

                                        </div>

                                    </div>

                                ) : (

                                    <div className="rounded-xl bg-slate-50 p-5 text-sm text-slate-500">
                                        No active Sprint.
                                    </div>

                                )}

                            </div>

                            {/* TASK LIST */}

                            <div>

                                <h3 className="mb-3 font-bold">
                                    Team Leader Managed Tasks
                                </h3>

                                <div className="space-y-2">

                                    {allTasks
                                        .filter(
                                            (task) => {

                                                const leader =
                                                    team.teamLeader;

                                                if (
                                                    !leader
                                                ) {
                                                    return false;
                                                }

                                                const leaderId =
                                                    leader.id ??
                                                    leader.userId;

                                                const creatorId =
                                                    task.createdById ??
                                                    task.creatorId;

                                                if (
                                                    creatorId &&
                                                    leaderId
                                                ) {

                                                    return (
                                                        String(
                                                            creatorId
                                                        ) ===
                                                        String(
                                                            leaderId
                                                        )
                                                    );

                                                }

                                                return (
                                                    String(
                                                        task.createdBy
                                                    ).toLowerCase() ===
                                                    String(
                                                        leader.name
                                                    ).toLowerCase()
                                                );

                                            }
                                        )
                                        .map(
                                            (task) => (

                                                <div
                                                    key={
                                                        task.id
                                                    }
                                                    className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 md:flex-row md:items-center md:justify-between"
                                                >

                                                    <div>

                                                        <p className="font-semibold">
                                                            {
                                                                task.title
                                                            }
                                                        </p>

                                                        <p className="mt-1 text-xs text-slate-500">
                                                            Sprint:{" "}
                                                            {
                                                                task.sprintName
                                                            }
                                                        </p>

                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-2">

                                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                                            {
                                                                task.assignee ||
                                                                "Unassigned"
                                                            }
                                                        </span>

                                                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                                            {
                                                                task.status ||
                                                                "Unknown"
                                                            }
                                                        </span>

                                                    </div>

                                                </div>

                                            )
                                        )}

                                    {allTasks.filter(
                                        (task) => {

                                            const leader =
                                                team.teamLeader;

                                            if (
                                                !leader
                                            ) {
                                                return false;
                                            }

                                            const leaderId =
                                                leader.id ??
                                                leader.userId;

                                            const creatorId =
                                                task.createdById ??
                                                task.creatorId;

                                            if (
                                                creatorId &&
                                                leaderId
                                            ) {

                                                return (
                                                    String(
                                                        creatorId
                                                    ) ===
                                                    String(
                                                        leaderId
                                                    )
                                                );

                                            }

                                            return (
                                                String(
                                                    task.createdBy
                                                ).toLowerCase() ===
                                                String(
                                                    leader.name
                                                ).toLowerCase()
                                            );

                                        }
                                    ).length ===
                                        0 && (

                                            <div className="rounded-xl bg-slate-50 p-5 text-sm text-slate-500">
                                                No Team Leader managed tasks found.
                                            </div>

                                        )}

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

// ============================================================
// LEADER STAT
// ============================================================

function LeaderStat({
    label,
    value,
}) {

    return (

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

            <p className="text-xs font-medium text-slate-500">
                {label}
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
                {value}
            </p>

        </div>

    );

}

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default TeamManagement;

