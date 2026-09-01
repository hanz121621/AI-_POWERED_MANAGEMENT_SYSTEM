
// ============================================================
// AIPMS — MANAGER TEAM MANAGEMENT
//
// Team Management and Monitoring
//
// Use Cases:
// TEAM-M-001 — View Assigned Team
// TEAM-M-002 — Request Team Member Addition
// TEAM-M-003 — Request Team Member Removal
// TEAM-M-004 — Monitor Team Leader Work
// TEAM-M-005 — Review Team Progress
//
// IMPORTANT:
// Manager can MONITOR team information.
// Manager does NOT directly:
// - Add team members
// - Remove team members
// - Assign individual tasks
// - Reassign tasks
//
// ============================================================

import React, { useMemo, useState } from "react";

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
} from "lucide-react";

// ============================================================
// COMPONENT
// ============================================================

function TeamManagement() {

    // ========================================================
    // CURRENT MANAGER
    // ========================================================

    const currentManager = {
        id: "current-manager",
        name: "Current Manager",
        role: "Manager",
    };

    // ========================================================
    // ASSIGNED TEAM DATA
    //
    // In the final backend version this data should come from
    // the authenticated Manager's authorized project/team scope.
    // ========================================================

    const [team, setTeam] = useState({
        id: 1,
        name: "AIPMS Development Team",

        projectId: 1,
        projectName:
            "AI-Powered Project Management System",

        teamLeader: {
            id: 101,
            name: "Team Leader",
            role: "Team Leader",
            contributorType: "Developer",
            specialization: "Software Development",
        },

        members: [
            {
                id: 102,
                name: "Developer 1",
                role: "Developer",
                contributorType: "Developer",
                specialization: "Frontend Development",
                active: true,
            },
            {
                id: 103,
                name: "Developer 2",
                role: "Developer",
                contributorType: "Developer",
                specialization: "Backend Development",
                active: true,
            },
            {
                id: 104,
                name: "Developer 3",
                role: "Developer",
                contributorType: "Developer",
                specialization: "Full Stack Development",
                active: true,
            },
            {
                id: 105,
                name: "Staff 1",
                role: "Staff",
                contributorType: "Staff",
                specialization: "QA / Testing",
                active: true,
            },
        ],

        sprints: [
            {
                id: 1,
                name: "Sprint 01",
                status: "Planning",
                startDate: "August 10, 2026",
                endDate: "August 17, 2026",

                tasks: [
                    {
                        id: 1,
                        title:
                            "Create authentication service",
                        status: "Completed",
                        priority: "High",
                        assignee: "Developer 1",
                        createdBy: "Team Leader",
                        deadline: "August 15, 2026",
                    },
                    {
                        id: 2,
                        title:
                            "Create login page",
                        status: "In Progress",
                        priority: "High",
                        assignee: "Developer 2",
                        createdBy: "Team Leader",
                        deadline: "September 5, 2026",
                    },
                    {
                        id: 3,
                        title:
                            "Implement role permissions",
                        status: "Todo",
                        priority: "Medium",
                        assignee: "Developer 3",
                        createdBy: "Team Leader",
                        deadline: "September 8, 2026",
                    },
                ],
            },

            {
                id: 2,
                name: "Sprint 02",
                status: "Active",
                startDate: "August 18, 2026",
                endDate: "September 5, 2026",

                tasks: [
                    {
                        id: 4,
                        title:
                            "Create project management page",
                        status: "Completed",
                        priority: "High",
                        assignee: "Developer 1",
                        createdBy: "Team Leader",
                        deadline: "August 25, 2026",
                    },
                    {
                        id: 5,
                        title:
                            "Create task management page",
                        status: "In Progress",
                        priority: "High",
                        assignee: "Developer 2",
                        createdBy: "Team Leader",
                        deadline: "September 2, 2026",
                    },
                    {
                        id: 6,
                        title:
                            "Implement task assignment",
                        status: "In Progress",
                        priority: "Medium",
                        assignee: "Developer 3",
                        createdBy: "Team Leader",
                        deadline: "September 3, 2026",
                    },
                    {
                        id: 7,
                        title:
                            "Create task status workflow",
                        status: "Blocked",
                        priority: "Medium",
                        assignee: "Staff 1",
                        createdBy: "Team Leader",
                        deadline: "August 28, 2026",
                    },
                ],
            },
        ],
    });

    // ========================================================
    // UI STATE
    // ========================================================

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

    const [successMessage, setSuccessMessage] =
        useState("");

    const [errorMessage, setErrorMessage] =
        useState("");

    // ========================================================
    // HELPERS
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
    // ALL TEAM TASKS
    //
    // Calculated from actual sprint task records.
    // ========================================================

    const allTasks = useMemo(() => {
        return team.sprints.flatMap(
            (sprint) =>
                (sprint.tasks || []).map((task) => ({
                    ...task,
                    sprintId: sprint.id,
                    sprintName: sprint.name,
                }))
        );
    }, [team.sprints]);

    // ========================================================
    // ACTIVE SPRINT
    // ========================================================

    const activeSprint = useMemo(() => {
        return team.sprints.find(
            (sprint) =>
                String(sprint.status).toLowerCase() ===
                "active"
        );
    }, [team.sprints]);

    // ========================================================
    // TASK COUNTS
    // ========================================================

    const taskStats = useMemo(() => {

        const completed = allTasks.filter(
            (task) =>
                String(task.status).toLowerCase() ===
                "completed"
        ).length;

        const inProgress = allTasks.filter(
            (task) =>
                String(task.status).toLowerCase() ===
                "in progress"
        ).length;

        const blocked = allTasks.filter(
            (task) =>
                String(task.status).toLowerCase() ===
                "blocked"
        ).length;

        const remaining = allTasks.filter(
            (task) =>
                String(task.status).toLowerCase() !==
                "completed"
        ).length;

        return {
            total: allTasks.length,
            completed,
            inProgress,
            blocked,
            remaining,
        };

    }, [allTasks]);

    // ========================================================
    // OVERDUE TASKS
    //
    // Uses current system date.
    // ========================================================

    const overdueTasks = useMemo(() => {

        const now = new Date();

        return allTasks.filter((task) => {

            if (
                String(task.status).toLowerCase() ===
                "completed"
            ) {
                return false;
            }

            if (!task.deadline) {
                return false;
            }

            const deadline = new Date(
                task.deadline
            );

            return (
                !Number.isNaN(
                    deadline.getTime()
                ) &&
                deadline < now
            );
        });

    }, [allTasks]);

    // ========================================================
    // TEAM COMPLETION
    // ========================================================

    const teamCompletion = useMemo(() => {

        if (!allTasks.length) {
            return null;
        }

        return Math.round(
            (taskStats.completed /
                allTasks.length) *
                100
        );

    }, [allTasks.length, taskStats.completed]);

    // ========================================================
    // SPRINT PROGRESS
    // ========================================================

    const sprintProgress = useMemo(() => {

        if (!activeSprint) {
            return null;
        }

        const tasks =
            activeSprint.tasks || [];

        if (!tasks.length) {
            return null;
        }

        const completed =
            tasks.filter(
                (task) =>
                    String(task.status)
                        .toLowerCase() ===
                    "completed"
            ).length;

        return Math.round(
            (completed / tasks.length) *
                100
        );

    }, [activeSprint]);

    // ========================================================
    // TEAM WORKLOAD
    //
    // Current workload = active/non-completed assigned tasks.
    // ========================================================

    const memberWorkload = useMemo(() => {

        return team.members.map((member) => {

            const tasks = allTasks.filter(
                (task) =>
                    String(task.assignee)
                        .toLowerCase() ===
                    String(member.name)
                        .toLowerCase()
            );

            const activeTasks =
                tasks.filter(
                    (task) =>
                        String(task.status)
                            .toLowerCase() !==
                        "completed"
                );

            return {
                ...member,
                totalTasks: tasks.length,
                activeTasks:
                    activeTasks.length,
            };
        });

    }, [team.members, allTasks]);

    // ========================================================
    // TEAM LEADER WORK
    // ========================================================

    const teamLeaderWork = useMemo(() => {

        const createdTasks =
            allTasks.filter(
                (task) =>
                    String(task.createdBy)
                        .toLowerCase() ===
                    String(
                        team.teamLeader.name
                    ).toLowerCase()
            );

        const assignedTasks =
            allTasks.filter(
                (task) =>
                    task.assignee
            );

        const completedTasks =
            createdTasks.filter(
                (task) =>
                    String(task.status)
                        .toLowerCase() ===
                    "completed"
            );

        const inProgressTasks =
            createdTasks.filter(
                (task) =>
                    String(task.status)
                        .toLowerCase() ===
                    "in progress"
            );

        const blockedTasks =
            createdTasks.filter(
                (task) =>
                    String(task.status)
                        .toLowerCase() ===
                    "blocked"
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
                overdueTasks.filter(
                    (task) =>
                        String(task.createdBy)
                            .toLowerCase() ===
                        String(
                            team.teamLeader.name
                        ).toLowerCase()
                ).length,
        };

    }, [
        allTasks,
        overdueTasks,
        team.teamLeader.name,
    ]);

    // ========================================================
    // ELIGIBLE USERS
    //
    // In backend implementation this must be retrieved
    // dynamically from users database.
    // ========================================================

    const eligibleUsers = [
        {
            id: 201,
            name: "Available Developer",
            role: "Contributor",
            contributorType: "Developer",
            active: true,
        },
        {
            id: 202,
            name: "Available Staff",
            role: "Contributor",
            contributorType: "Staff",
            active: true,
        },
    ];

    // ========================================================
    // REQUEST ADD MEMBER
    // ========================================================

    const handleAddRequest = () => {

        clearMessages();

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

        const user =
            eligibleUsers.find(
                (item) =>
                    String(item.id) ===
                    String(selectedUserId)
            );

        if (!user) {
            showError(
                "The selected user could not be found."
            );
            return;
        }

        if (!user.active) {
            showError(
                "The selected user is inactive."
            );
            return;
        }

        const alreadyMember =
            team.members.some(
                (member) =>
                    String(member.id) ===
                    String(user.id)
            );

        if (alreadyMember) {
            showError(
                "This user is already a member of the team."
            );
            return;
        }

        // IMPORTANT:
        // Do NOT add the member here.
        // This creates a pending request conceptually.
        showSuccess(
            "Team member addition request submitted and is pending Admin approval."
        );

        setShowAddRequest(false);
        setSelectedUserId("");
        setRequestReason("");
    };

    // ========================================================
    // REQUEST REMOVE MEMBER
    // ========================================================

    const handleRemoveRequest = () => {

        clearMessages();

        if (!selectedMember) {
            showError(
                "Please select a team member."
            );
            return;
        }

        if (!requestReason.trim()) {
            showError(
                "Please provide a reason for the removal request."
            );
            return;
        }

        // IMPORTANT:
        // Do NOT remove the member.
        // The member remains until Admin approval.

        showSuccess(
            "Team member removal request submitted and is pending Admin approval."
        );

        setShowRemoveRequest(false);
        setSelectedMember(null);
        setRequestReason("");
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
                                        View your assigned team, monitor workload and progress, and submit member requests.
                                    </p>

                                </div>

                            </div>

                            <div className="rounded-xl bg-white/10 px-4 py-3 ring-1 ring-white/20">

                                <p className="text-xs text-white/70">
                                    Project
                                </p>

                                <p className="mt-1 text-sm font-bold">
                                    {team.projectName}
                                </p>

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

                                <div className="flex items-center justify-between">

                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100">

                                        <UsersRound
                                            size={22}
                                            className="text-violet-600"
                                        />

                                    </div>

                                </div>

                                <p className="mt-4 text-sm text-slate-500">
                                    Team
                                </p>

                                <p className="mt-1 text-lg font-bold text-slate-900">
                                    {team.name}
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
                                    {team.members.length}
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
                                        allTasks.filter(
                                            (task) =>
                                                String(
                                                    task.status
                                                ).toLowerCase() !==
                                                "completed"
                                        ).length
                                    }
                                </p>

                                <p className="mt-1 text-xs text-slate-400">
                                    Active assigned tasks
                                </p>

                            </div>

                            {/* PROGRESS */}

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
                                    {teamCompletion === null
                                        ? "—"
                                        : `${teamCompletion}%`}
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

                            <button
                                type="button"
                                onClick={() =>
                                    setShowLeaderWork(true)
                                }
                                className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-violet-700"
                            >
                                <Eye size={17} />
                                Monitor Work
                            </button>

                        </div>

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
                                            {team.teamLeader.name}
                                        </h3>

                                        <p className="text-sm text-slate-500">
                                            {team.teamLeader.role}
                                        </p>

                                        <div className="mt-2 flex flex-wrap gap-2">

                                            <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                                                {
                                                    team
                                                        .teamLeader
                                                        .contributorType
                                                }
                                            </span>

                                            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                                {
                                                    team
                                                        .teamLeader
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
                                onClick={() => {
                                    clearMessages();
                                    setRequestReason("");
                                    setSelectedUserId("");
                                    setShowAddRequest(true);
                                }}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:from-violet-700 hover:to-blue-700"
                            >
                                <Plus size={17} />
                                Request Add Member
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

                                        {memberWorkload.map(
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

                                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">

                                                            <CircleDot
                                                                size={11}
                                                            />

                                                            {member.active
                                                                ? "Active"
                                                                : "Inactive"}

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

                                                            Request Removal
                                                        </button>

                                                    </td>

                                                </tr>
                                            )
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

                            {/* COMPLETION */}

                            <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">

                                <CheckCircle2
                                    size={23}
                                    className="text-emerald-600"
                                />

                                <p className="mt-4 text-sm text-slate-500">
                                    Team Completion
                                </p>

                                <p className="mt-1 text-3xl font-bold">
                                    {teamCompletion === null
                                        ? "—"
                                        : `${teamCompletion}%`}
                                </p>

                            </div>

                            {/* COMPLETED */}

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

                            {/* REMAINING */}

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

                            {/* BLOCKED */}

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
                        ACTIVE SPRINT
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
                                                    activeSprint.startDate
                                                }
                                            </span>

                                            <span>
                                                →
                                            </span>

                                            <span>
                                                {
                                                    activeSprint.endDate
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
                                                {sprintProgress === null
                                                    ? "—"
                                                    : `${sprintProgress}%`}
                                            </span>

                                        </div>

                                        <div className="h-3 overflow-hidden rounded-full bg-slate-100">

                                            {sprintProgress !== null && (
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
                ADD MEMBER REQUEST MODAL
            ========================================================== */}

            {showAddRequest && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">

                    <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

                            <div>

                                <h2 className="text-lg font-bold">
                                    Request Team Member Addition
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Admin approval is required before the user is added.
                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowAddRequest(false)
                                }
                                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                            >
                                <X size={19} />
                            </button>

                        </div>

                        <div className="space-y-5 px-6 py-6">

                            <div>

                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                    Eligible User
                                </label>

                                <select
                                    value={selectedUserId}
                                    onChange={(event) =>
                                        setSelectedUserId(
                                            event.target.value
                                        )
                                    }
                                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                                >

                                    <option value="">
                                        Select user
                                    </option>

                                    {eligibleUsers.map(
                                        (user) => (
                                            <option
                                                key={
                                                    user.id
                                                }
                                                value={
                                                    user.id
                                                }
                                            >
                                                {user.name} —{" "}
                                                {
                                                    user.contributorType
                                                }
                                            </option>
                                        )
                                    )}

                                </select>

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
                                            event
                                                .target
                                                .value
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
                                    setShowAddRequest(false)
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
                                className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-violet-700"
                            >
                                <Send size={17} />
                                Submit Request
                            </button>

                        </div>

                    </div>

                </div>
            )}

            {/* ==========================================================
                REMOVE MEMBER REQUEST MODAL
            ========================================================== */}

            {showRemoveRequest &&
                selectedMember && (

                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">

                        <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

                            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

                                <div>

                                    <h2 className="text-lg font-bold">
                                        Request Team Member Removal
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        The member remains on the team until Admin approval.
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
                                    <X size={19} />
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
                                                event
                                                    .target
                                                    .value
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
                                    <Send size={17} />
                                    Submit Request
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
                                <X size={19} />
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
                                            (task) =>
                                                String(
                                                    task.createdBy
                                                ).toLowerCase() ===
                                                String(
                                                    team.teamLeader.name
                                                ).toLowerCase()
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
                                                                task.assignee
                                                            }
                                                        </span>

                                                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                                            {
                                                                task.status
                                                            }
                                                        </span>

                                                    </div>

                                                </div>
                                            )
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

