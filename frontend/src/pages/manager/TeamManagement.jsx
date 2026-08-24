
import React, {
    useMemo,
    useState,
} from "react";

import {
    Users,
    Activity,
    CheckCircle2,
    Clock3,
    AlertTriangle,
    Search,
    UserPlus,
    UserMinus,
    X,
    BriefcaseBusiness,
    ListTodo,
    TrendingUp,
    RefreshCw,
    ShieldCheck,
    CalendarDays,
    Target,
    Send,
    FileText,
    Check,
    XCircle,
    Bell,
} from "lucide-react";

import TeamMemberCard from "../../components/manager/team/TeamMemberCard";

function TeamManagement() {

    /*
    ============================================================
    DEMO TEAM DATA
    ============================================================
    Existing structure preserved.
    ============================================================
    */

    const initialTeams = [
        {
            id: 1,

            name: "AI Development Team",

            description:
                "Team responsible for developing AI-powered project management features.",

            manager: "Manager",

            projects: [
                {
                    id: 1,
                    name: "AI-Powered Project Management System",
                },
            ],

            members: [
                {
                    id: 101,
                    name: "Abebe Kebede",
                    email: "abebe@africom.com",
                    phone: "+251 911 000 001",

                    role: "Developer",
                    teamRole: "Developer",

                    active: true,
                    status: "Active",

                    workload: 75,

                    skills: [
                        "React",
                        "ASP.NET Core",
                        "PostgreSQL",
                    ],

                    assignedProjects: [
                        "AI-Powered Project Management System",
                    ],

                    tasks: [
                        {
                            id: 1001,
                            title: "Implement Authentication API",
                            status: "In Progress",
                            priority: "High",
                            dueDate: "2026-08-20",
                        },
                        {
                            id: 1002,
                            title: "Build User Management",
                            status: "Pending",
                            priority: "Medium",
                            dueDate: "2026-08-23",
                        },
                    ],
                },

                {
                    id: 102,
                    name: "Hana Tesfaye",
                    email: "hana@africom.com",
                    phone: "+251 911 000 002",

                    role: "Contributor",
                    teamRole: "Contributor",

                    active: true,
                    status: "Active",

                    workload: 60,

                    skills: [
                        "React",
                        "Tailwind CSS",
                        "UI Design",
                    ],

                    assignedProjects: [
                        "AI-Powered Project Management System",
                        "FieldSync",
                    ],

                    tasks: [
                        {
                            id: 1003,
                            title: "Design Manager Dashboard",
                            status: "Completed",
                            priority: "High",
                            dueDate: "2026-08-10",
                        },
                        {
                            id: 1004,
                            title: "Create Team Management UI",
                            status: "In Progress",
                            priority: "Medium",
                            dueDate: "2026-08-18",
                        },
                    ],
                },

                {
                    id: 103,
                    name: "Dawit Solomon",
                    email: "dawit@africom.com",
                    phone: "+251 911 000 003",

                    role: "Developer",
                    teamRole: "Developer",

                    active: true,
                    status: "Active",

                    workload: 85,

                    skills: [
                        "Node.js",
                        "PostgreSQL",
                        "API Development",
                    ],

                    assignedProjects: [
                        "FieldSync",
                    ],

                    tasks: [
                        {
                            id: 1005,
                            title: "Implement Offline Sync API",
                            status: "In Progress",
                            priority: "High",
                            dueDate: "2026-08-17",
                        },
                        {
                            id: 1006,
                            title: "Create Sync Audit Service",
                            status: "Overdue",
                            priority: "High",
                            dueDate: "2026-08-05",
                        },
                        {
                            id: 1007,
                            title: "Database Optimization",
                            status: "Pending",
                            priority: "Medium",
                            dueDate: "2026-08-22",
                        },
                    ],
                },

                {
                    id: 104,
                    name: "Marta Bekele",
                    email: "marta@africom.com",
                    phone: "+251 911 000 004",

                    role: "Contributor",
                    teamRole: "Contributor",

                    active: true,
                    status: "Active",

                    workload: 35,

                    skills: [
                        "Testing",
                        "Documentation",
                        "QA",
                    ],

                    assignedProjects: [
                        "AI-Powered Project Management System",
                    ],

                    tasks: [],
                },
            ],
        },

        {
            id: 2,

            name: "FieldSync Team",

            description:
                "Team responsible for the FieldSync offline-first rural reporting platform.",

            manager: "Manager",

            projects: [
                {
                    id: 2,
                    name: "FieldSync",
                },
            ],

            members: [
                {
                    id: 201,
                    name: "Samuel Girma",
                    email: "samuel@africom.com",
                    phone: "+251 911 000 005",

                    role: "Developer",
                    teamRole: "Developer",

                    active: true,
                    status: "Active",

                    workload: 55,

                    skills: [
                        "React",
                        "PWA",
                        "IndexedDB",
                    ],

                    assignedProjects: [
                        "FieldSync",
                    ],

                    tasks: [
                        {
                            id: 2001,
                            title: "Build Offline Registration",
                            status: "In Progress",
                            priority: "High",
                            dueDate: "2026-08-20",
                        },
                    ],
                },

                {
                    id: 202,
                    name: "Meron Ali",
                    email: "meron@africom.com",
                    phone: "+251 911 000 006",

                    role: "Contributor",
                    teamRole: "Contributor",

                    active: true,
                    status: "Active",

                    workload: 40,

                    skills: [
                        "Testing",
                        "Reporting",
                    ],

                    assignedProjects: [
                        "FieldSync",
                    ],

                    tasks: [
                        {
                            id: 2002,
                            title: "Test Registration Flow",
                            status: "Pending",
                            priority: "Medium",
                            dueDate: "2026-08-21",
                        },
                    ],
                },
            ],
        },
    ];

    /*
    ============================================================
    STATE
    ============================================================
    */

    const [teams, setTeams] =
        useState(initialTeams);

    const [selectedTeamId, setSelectedTeamId] =
        useState(initialTeams[0].id);

    const [searchTerm, setSearchTerm] =
        useState("");

    const [activeSection, setActiveSection] =
        useState("members");

    const [selectedMember, setSelectedMember] =
        useState(null);

    const [assignMember, setAssignMember] =
        useState(null);

    const [removeMember, setRemoveMember] =
        useState(null);

    const [selectedTaskId, setSelectedTaskId] =
        useState("");

    const [message, setMessage] =
        useState(null);

    const [loading, setLoading] =
        useState(false);

    /*
    ============================================================
    TEAM-005 / TEAM-006 STATE
    ============================================================
    */

    const [permissionRequests, setPermissionRequests] =
        useState([]);

    const [activityLogs, setActivityLogs] =
        useState([]);

    const [requestType, setRequestType] =
        useState(null);

    const [requestMember, setRequestMember] =
        useState(null);

    const [requestProjectId, setRequestProjectId] =
        useState("");

    const [requestReason, setRequestReason] =
        useState("");

    /*
    ============================================================
    SELECTED TEAM
    ============================================================
    */

    const selectedTeam = useMemo(() => {
        return teams.find(
            (team) =>
                String(team.id) ===
                String(selectedTeamId)
        );
    }, [teams, selectedTeamId]);

    /*
    ============================================================
    FILTER MEMBERS
    ============================================================
    */

    const filteredMembers = useMemo(() => {

        if (!selectedTeam?.members) {
            return [];
        }

        const search =
            searchTerm
                .trim()
                .toLowerCase();

        if (!search) {
            return selectedTeam.members;
        }

        return selectedTeam.members.filter(
            (member) => {

                const name =
                    member.name ||
                    member.fullName ||
                    "";

                const email =
                    member.email || "";

                const role =
                    member.role ||
                    member.teamRole ||
                    "";

                return (
                    name
                        .toLowerCase()
                        .includes(search) ||
                    email
                        .toLowerCase()
                        .includes(search) ||
                    role
                        .toLowerCase()
                        .includes(search)
                );
            }
        );
    }, [
        selectedTeam,
        searchTerm,
    ]);

    /*
    ============================================================
    TEAM PERFORMANCE
    ============================================================
    */

    const performance = useMemo(() => {

        const members =
            selectedTeam?.members || [];

        const tasks = members.flatMap(
            (member) =>
                Array.isArray(member.tasks)
                    ? member.tasks
                    : []
        );

        const completed =
            tasks.filter(
                (task) =>
                    task.status ===
                    "Completed"
            ).length;

        const pending =
            tasks.filter(
                (task) =>
                    task.status ===
                    "Pending"
            ).length;

        const inProgress =
            tasks.filter(
                (task) =>
                    task.status ===
                    "In Progress"
            ).length;

        const overdue =
            tasks.filter(
                (task) =>
                    task.status ===
                    "Overdue"
            ).length;

        const totalTasks =
            tasks.length;

        const completionRate =
            totalTasks > 0
                ? Math.round(
                      (completed /
                          totalTasks) *
                          100
                  )
                : 0;

        const averageWorkload =
            members.length > 0
                ? Math.round(
                      members.reduce(
                          (
                              total,
                              member
                          ) =>
                              total +
                              Number(
                                  member.workload ||
                                      0
                              ),
                          0
                      ) /
                          members.length
                  )
                : 0;

        return {
            totalTasks,
            completed,
            pending,
            inProgress,
            overdue,
            completionRate,
            averageWorkload,
        };

    }, [selectedTeam]);

    /*
    ============================================================
    SHOW MESSAGE
    ============================================================
    */

    const showMessage = (
        type,
        text
    ) => {

        setMessage({
            type,
            text,
        });

        setTimeout(() => {
            setMessage(null);
        }, 4000);
    };

    /*
    ============================================================
    CHANGE TEAM
    ============================================================
    */

    const handleTeamChange = (
        event
    ) => {

        setSelectedTeamId(
            Number(event.target.value)
        );

        setSelectedMember(null);

        setSearchTerm("");

        setActiveSection(
            "members"
        );
    };

    /*
    ============================================================
    VIEW MEMBER
    ============================================================
    */

    const handleViewMember = (
        member
    ) => {

        setSelectedMember(member);
    };

    /*
    ============================================================
    OPEN ASSIGN MODAL
    ============================================================
    */

    const handleOpenAssign = (
        member
    ) => {

        if (!member) {
            return;
        }

        if (
            member.active === false ||
            member.status ===
                "Inactive"
        ) {
            showMessage(
                "error",
                "Contributor cannot be assigned because the member is inactive."
            );

            return;
        }

        if (
            Number(
                member.workload || 0
            ) >= 80
        ) {
            showMessage(
                "error",
                "Contributor has exceeded workload capacity."
            );

            return;
        }

        setAssignMember(member);

        setSelectedTaskId("");
    };

    /*
    ============================================================
    ASSIGN CONTRIBUTOR
    ============================================================
    */

    const handleAssignContributor =
        () => {

            if (!assignMember) {
                return;
            }

            if (!selectedTaskId) {
                showMessage(
                    "error",
                    "Please select a task."
                );

                return;
            }

            const taskId =
                Number(
                    selectedTaskId
                );

            let assignedTask = null;

            const updatedTeams =
                teams.map((team) => {

                    if (
                        team.id !==
                        selectedTeam.id
                    ) {
                        return team;
                    }

                    const updatedMembers =
                        team.members.map(
                            (member) => {

                                if (
                                    member.id !==
                                    assignMember.id
                                ) {
                                    return member;
                                }

                                const existingTasks =
                                    Array.isArray(
                                        member.tasks
                                    )
                                        ? member.tasks
                                        : [];

                                const alreadyAssigned =
                                    existingTasks.some(
                                        (task) =>
                                            Number(
                                                task.id
                                            ) ===
                                            taskId
                                    );

                                if (
                                    alreadyAssigned
                                ) {
                                    return member;
                                }

                                const task =
                                    team.members
                                        .flatMap(
                                            (
                                                item
                                            ) =>
                                                item.tasks ||
                                                []
                                        )
                                        .find(
                                            (
                                                item
                                            ) =>
                                                Number(
                                                    item.id
                                                ) ===
                                                taskId
                                        );

                                if (!task) {
                                    return member;
                                }

                                assignedTask =
                                    task;

                                return {
                                    ...member,

                                    tasks: [
                                        ...existingTasks,
                                        {
                                            ...task,
                                            assignedByManager:
                                                true,
                                        },
                                    ],

                                    workload:
                                        Math.min(
                                            Number(
                                                member.workload ||
                                                    0
                                            ) + 10,
                                            100
                                        ),
                                };
                            }
                        );

                    return {
                        ...team,
                        members:
                            updatedMembers,
                    };
                });

            if (!assignedTask) {

                showMessage(
                    "error",
                    "Task not found."
                );

                return;
            }

            setTeams(
                updatedTeams
            );

            setAssignMember(
                null
            );

            setSelectedTaskId(
                ""
            );

            showMessage(
                "success",
                "Contributor assigned successfully."
            );
        };

    /*
    ============================================================
    OPEN REMOVE MODAL
    ============================================================
    */

    const handleOpenRemove = (
        member
    ) => {

        if (!member) {
            return;
        }

        const tasks =
            Array.isArray(member.tasks)
                ? member.tasks
                : [];

        if (tasks.length === 0) {

            showMessage(
                "error",
                "Contributor assignment not found."
            );

            return;
        }

        setRemoveMember(
            member
        );

        setSelectedTaskId("");
    };

    /*
    ============================================================
    REMOVE CONTRIBUTOR
    ============================================================
    */

    const handleRemoveContributor =
        () => {

            if (!removeMember) {
                return;
            }

            if (!selectedTaskId) {

                showMessage(
                    "error",
                    "Please select the task from which the contributor should be removed."
                );

                return;
            }

            const taskId =
                Number(
                    selectedTaskId
                );

            let foundAssignment =
                false;

            const updatedTeams =
                teams.map((team) => {

                    if (
                        team.id !==
                        selectedTeam.id
                    ) {
                        return team;
                    }

                    const updatedMembers =
                        team.members.map(
                            (member) => {

                                if (
                                    member.id !==
                                    removeMember.id
                                ) {
                                    return member;
                                }

                                const existingTasks =
                                    Array.isArray(
                                        member.tasks
                                    )
                                        ? member.tasks
                                        : [];

                                const taskExists =
                                    existingTasks.some(
                                        (task) =>
                                            Number(
                                                task.id
                                            ) ===
                                            taskId
                                    );

                                if (
                                    !taskExists
                                ) {
                                    return member;
                                }

                                foundAssignment =
                                    true;

                                const updatedTasks =
                                    existingTasks.filter(
                                        (task) =>
                                            Number(
                                                task.id
                                            ) !==
                                            taskId
                                    );

                                const newWorkload =
                                    Math.max(
                                        Number(
                                            member.workload ||
                                                0
                                        ) - 10,
                                        0
                                    );

                                return {
                                    ...member,

                                    tasks:
                                        updatedTasks,

                                    workload:
                                        newWorkload,
                                };
                            }
                        );

                    return {
                        ...team,
                        members:
                            updatedMembers,
                    };
                });

            if (!foundAssignment) {

                showMessage(
                    "error",
                    "Contributor assignment not found."
                );

                return;
            }

            setTeams(
                updatedTeams
            );

            setRemoveMember(
                null
            );

            setSelectedTaskId(
                ""
            );

            showMessage(
                "success",
                "Contributor removed successfully."
            );
        };

    /*
    ============================================================
    TEAM-005
    OPEN REQUEST ADD CONTRIBUTOR
    ============================================================
    */

    const handleOpenRequestAdd = (
        member = null
    ) => {

        setRequestType(
            "add"
        );

        setRequestMember(
            member
        );

        setRequestProjectId(
            selectedTeam?.projects?.[0]?.id
                ? String(
                      selectedTeam.projects[0].id
                  )
                : ""
        );

        setRequestReason("");

        setActiveSection(
            "requests"
        );
    };

    /*
    ============================================================
    TEAM-005
    OPEN REQUEST REMOVE CONTRIBUTOR
    ============================================================
    */

    const handleOpenRequestRemove = (
        member
    ) => {

        if (!member) {
            return;
        }

        setRequestType(
            "remove"
        );

        setRequestMember(
            member
        );

        const firstProject =
            selectedTeam?.projects?.find(
                (project) =>
                    member.assignedProjects?.includes(
                        project.name
                    )
            ) ||
            selectedTeam?.projects?.[0];

        setRequestProjectId(
            firstProject?.id
                ? String(
                      firstProject.id
                  )
                : ""
        );

        setRequestReason("");

        setActiveSection(
            "requests"
        );
    };

    /*
    ============================================================
    AVAILABLE CONTRIBUTORS
    TEAM-005
    ============================================================
    */

    const availableContributors =
        useMemo(() => {

            if (!selectedTeam) {
                return [];
            }

            return selectedTeam.members.filter(
                (member) =>
                    member.active !== false &&
                    member.status !==
                        "Inactive" &&
                    (
                        member.role ===
                            "Contributor" ||
                        member.teamRole ===
                            "Contributor"
                    )
            );

        }, [selectedTeam]);

    /*
    ============================================================
    SELECTED PROJECT
    ============================================================
    */

    const selectedRequestProject =
        useMemo(() => {

            return (
                selectedTeam?.projects?.find(
                    (project) =>
                        String(
                            project.id
                        ) ===
                        String(
                            requestProjectId
                        )
                ) || null
            );

        }, [
            selectedTeam,
            requestProjectId,
        ]);

    /*
    ============================================================
    CHECK PENDING REQUEST
    ============================================================
    */

    const hasPendingRequest = (
        type,
        memberId,
        projectId
    ) => {

        return permissionRequests.some(
            (request) =>
                request.type === type &&
                request.memberId ===
                    memberId &&
                request.projectId ===
                    Number(projectId) &&
                request.status ===
                    "Pending"
        );
    };

    /*
    ============================================================
    TEAM-005 / TEAM-006
    SUBMIT PERMISSION REQUEST
    ============================================================
    */

    const handleSubmitPermissionRequest =
        () => {

            if (!requestType) {
                return;
            }

            if (!requestProjectId) {

                showMessage(
                    "error",
                    "Please select a project."
                );

                return;
            }

            if (!requestMember) {

                showMessage(
                    "error",
                    requestType === "add"
                        ? "Please select a contributor."
                        : "Please select a project member."
                );

                return;
            }

            if (
                !requestReason.trim()
            ) {

                showMessage(
                    "error",
                    "Please provide a reason for this request."
                );

                return;
            }

            if (
                !selectedRequestProject
            ) {

                showMessage(
                    "error",
                    "Project not found."
                );

                return;
            }

            /*
            ====================================================
            TEAM-005
            ALREADY ASSIGNED
            ====================================================
            */

            if (
                requestType === "add"
            ) {

                const alreadyAssigned =
                    requestMember.assignedProjects?.includes(
                        selectedRequestProject.name
                    );

                if (
                    alreadyAssigned
                ) {

                    showMessage(
                        "error",
                        "Contributor is already part of this project."
                    );

                    return;
                }
            }

            /*
            ====================================================
            TEAM-006
            MEMBER MUST BE ASSIGNED
            ====================================================
            */

            if (
                requestType === "remove"
            ) {

                const isAssigned =
                    requestMember.assignedProjects?.includes(
                        selectedRequestProject.name
                    );

                if (
                    !isAssigned
                ) {

                    showMessage(
                        "error",
                        "Contributor is not assigned to this project."
                    );

                    return;
                }
            }

            /*
            ====================================================
            DUPLICATE REQUEST
            ====================================================
            */

            if (
                hasPendingRequest(
                    requestType,
                    requestMember.id,
                    requestProjectId
                )
            ) {

                showMessage(
                    "error",
                    requestType === "add"
                        ? "A request for this contributor is already pending."
                        : "A removal request for this contributor is already pending."
                );

                return;
            }

            /*
            ====================================================
            CREATE REQUEST
            ====================================================
            */

            const newRequest = {
                id:
                    Date.now(),

                type:
                    requestType,

                memberId:
                    requestMember.id,

                memberName:
                    requestMember.name,

                memberEmail:
                    requestMember.email,

                projectId:
                    Number(
                        requestProjectId
                    ),

                projectName:
                    selectedRequestProject.name,

                reason:
                    requestReason.trim(),

                requestedBy:
                    "Manager",

                status:
                    "Pending",

                createdAt:
                    new Date().toLocaleString(),

                notificationSent:
                    true,
            };

            setPermissionRequests(
                (previous) => [
                    newRequest,
                    ...previous,
                ]
            );

            /*
            ====================================================
            ACTIVITY LOG
            ====================================================
            */

            const activity = {
                id:
                    Date.now() + 1,

                type:
                    requestType === "add"
                        ? "Contributor Addition Request"
                        : "Contributor Removal Request",

                message:
                    requestType === "add"
                        ? `Manager requested permission to add ${requestMember.name} to ${selectedRequestProject.name}.`
                        : `Manager requested permission to remove ${requestMember.name} from ${selectedRequestProject.name}.`,

                date:
                    new Date().toLocaleString(),

                status:
                    "Pending",
            };

            setActivityLogs(
                (previous) => [
                    activity,
                    ...previous,
                ]
            );

            /*
            ====================================================
            RESET
            ====================================================
            */

            setRequestType(
                null
            );

            setRequestMember(
                null
            );

            setRequestProjectId(
                ""
            );

            setRequestReason(
                ""
            );

            /*
            ====================================================
            SUCCESS MESSAGE
            ====================================================
            */

            showMessage(
                "success",
                requestType === "add"
                    ? "Contributor addition request sent successfully."
                    : "Contributor removal request sent successfully."
            );
        };

    /*
    ============================================================
    CANCEL PERMISSION REQUEST
    ============================================================
    */

    const handleCancelPermissionRequest =
        () => {

            setRequestType(
                null
            );

            setRequestMember(
                null
            );

            setRequestProjectId(
                ""
            );

            setRequestReason(
                ""
            );

            setActiveSection(
                "members"
            );
        };

    /*
    ============================================================
    ALL AVAILABLE TASKS
    ============================================================
    */

    const availableTasks =
        useMemo(() => {

            if (!selectedTeam) {
                return [];
            }

            const tasks =
                selectedTeam.members.flatMap(
                    (member) =>
                        member.tasks || []
                );

            const uniqueTasks =
                tasks.filter(
                    (
                        task,
                        index,
                        array
                    ) =>
                        index ===
                        array.findIndex(
                            (item) =>
                                Number(
                                    item.id
                                ) ===
                                Number(
                                    task.id
                                )
                        )
                );

            return uniqueTasks;

        }, [selectedTeam]);

    /*
    ============================================================
    UNASSIGNED TASKS
    ============================================================
    */

    const tasksForAssignment =
        useMemo(() => {

            return [
                {
                    id: 3001,
                    title:
                        "Implement AI Risk Analysis",
                    priority: "High",
                    status: "Pending",
                },
                {
                    id: 3002,
                    title:
                        "Create Sprint Dashboard",
                    priority: "Medium",
                    status: "Pending",
                },
                {
                    id: 3003,
                    title:
                        "Implement Notification Service",
                    priority: "Medium",
                    status: "Pending",
                },
            ];

        }, []);

    /*
    ============================================================
    LOADING
    ============================================================
    */

    if (loading) {
        return (
            <div className="flex min-h-[500px] items-center justify-center rounded-2xl border border-slate-700 bg-slate-900">

                <div className="text-center">

                    <RefreshCw
                        className="mx-auto animate-spin text-blue-400"
                        size={35}
                    />

                    <p className="mt-4 text-sm text-slate-400">
                        Loading team management...
                    </p>

                </div>

            </div>
        );
    }

    /*
    ============================================================
    RENDER
    ============================================================
    */

    return (
        <div className="min-h-screen w-full bg-slate-950 p-4 sm:p-6 lg:p-8">

            {/* ==================================================
                MESSAGE
            ================================================== */}

            {message && (
                <div
                    className={`
                        fixed
                        right-5
                        top-5
                        z-[100]
                        flex
                        max-w-md
                        items-center
                        gap-3
                        rounded-xl
                        border
                        px-4
                        py-3
                        shadow-2xl
                        ${
                            message.type ===
                            "success"
                                ? "border-emerald-500/30 bg-emerald-950/95 text-emerald-300"
                                : "border-red-500/30 bg-red-950/95 text-red-300"
                        }
                    `}
                >

                    {message.type ===
                    "success" ? (
                        <CheckCircle2
                            size={20}
                        />
                    ) : (
                        <AlertTriangle
                            size={20}
                        />
                    )}

                    <span className="text-sm font-medium">
                        {message.text}
                    </span>

                </div>
            )}

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="mb-6 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

                <div>

                    <div className="flex items-center gap-3">

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">

                            <Users
                                size={26}
                                className="text-blue-400"
                            />

                        </div>

                        <div>

                            <h1 className="text-2xl font-bold text-white sm:text-3xl">
                                Team Management
                            </h1>

                            <p className="mt-1 text-sm text-slate-400">
                                Manage team members,
                                monitor performance
                                and manage task
                                assignments.
                            </p>

                        </div>

                    </div>

                </div>

                <div className="min-w-[260px]">

                    <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500">
                        Select Team
                    </label>

                    <select
                        value={
                            selectedTeamId
                        }
                        onChange={
                            handleTeamChange
                        }
                        className="
                            w-full
                            rounded-xl
                            border
                            border-slate-700
                            bg-slate-900
                            px-4
                            py-3
                            text-sm
                            font-medium
                            text-white
                            outline-none
                            transition
                            focus:border-blue-500
                        "
                    >

                        {teams.map(
                            (team) => (
                                <option
                                    key={
                                        team.id
                                    }
                                    value={
                                        team.id
                                    }
                                >
                                    {team.name}
                                </option>
                            )
                        )}

                    </select>

                </div>

            </div>

            {/* ==================================================
                TEAM INFORMATION
            ================================================== */}

            {selectedTeam && (
                <div className="mb-6 rounded-2xl border border-slate-700 bg-slate-900/80 p-5 shadow-xl sm:p-6">

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                        <div>

                            <div className="flex items-center gap-3">

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10">

                                    <BriefcaseBusiness
                                        size={24}
                                        className="text-indigo-400"
                                    />

                                </div>

                                <div>

                                    <h2 className="text-xl font-semibold text-white">
                                        {
                                            selectedTeam.name
                                        }
                                    </h2>

                                    <p className="mt-1 max-w-2xl text-sm text-slate-400">
                                        {
                                            selectedTeam.description
                                        }
                                    </p>

                                </div>

                            </div>

                        </div>

                        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2">

                            <ShieldCheck
                                size={17}
                                className="text-emerald-400"
                            />

                            <span className="text-sm font-medium text-emerald-400">
                                Manager Access
                            </span>

                        </div>

                    </div>

                </div>
            )}

            {/* ==================================================
                NAVIGATION
            ================================================== */}

            <div className="mb-6 overflow-x-auto rounded-2xl border border-slate-700 bg-slate-900/80 p-2">

                <div className="flex min-w-max gap-2">

                    <button
                        type="button"
                        onClick={() =>
                            setActiveSection(
                                "members"
                            )
                        }
                        className={`
                            flex
                            items-center
                            gap-2
                            rounded-xl
                            px-4
                            py-3
                            text-sm
                            font-medium
                            transition
                            ${
                                activeSection ===
                                "members"
                                    ? "bg-blue-600 text-white"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            }
                        `}
                    >

                        <Users size={17} />

                        View Team Members

                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            setActiveSection(
                                "performance"
                            )
                        }
                        className={`
                            flex
                            items-center
                            gap-2
                            rounded-xl
                            px-4
                            py-3
                            text-sm
                            font-medium
                            transition
                            ${
                                activeSection ===
                                "performance"
                                    ? "bg-blue-600 text-white"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            }
                        `}
                    >

                        <TrendingUp
                            size={17}
                        />

                        Team Performance

                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            setActiveSection(
                                "assign"
                            )
                        }
                        className={`
                            flex
                            items-center
                            gap-2
                            rounded-xl
                            px-4
                            py-3
                            text-sm
                            font-medium
                            transition
                            ${
                                activeSection ===
                                "assign"
                                    ? "bg-blue-600 text-white"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            }
                        `}
                    >

                        <UserPlus
                            size={17}
                        />

                        Assign Contributors

                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            setActiveSection(
                                "remove"
                            )
                        }
                        className={`
                            flex
                            items-center
                            gap-2
                            rounded-xl
                            px-4
                            py-3
                            text-sm
                            font-medium
                            transition
                            ${
                                activeSection ===
                                "remove"
                                    ? "bg-red-600 text-white"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            }
                        `}
                    >

                        <UserMinus
                            size={17}
                        />

                        Remove Contributors

                    </button>

                    {/* TEAM-005 / TEAM-006 */}

                    <button
                        type="button"
                        onClick={() =>
                            setActiveSection(
                                "requests"
                            )
                        }
                        className={`
                            flex
                            items-center
                            gap-2
                            rounded-xl
                            px-4
                            py-3
                            text-sm
                            font-medium
                            transition
                            ${
                                activeSection ===
                                "requests"
                                    ? "bg-indigo-600 text-white"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            }
                        `}
                    >

                        <ShieldCheck
                            size={17}
                        />

                        Permission Requests

                        {permissionRequests.filter(
                            (request) =>
                                request.status ===
                                "Pending"
                        ).length >
                            0 && (
                            <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-slate-950">
                                {
                                    permissionRequests.filter(
                                        (
                                            request
                                        ) =>
                                            request.status ===
                                            "Pending"
                                    ).length
                                }
                            </span>
                        )}

                    </button>

                </div>

            </div>

            {/* ==================================================
                TEAM MEMBER VIEW
                TEAM-001
            ================================================== */}

            {activeSection ===
                "members" && (
                <>

                    <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div>

                            <h2 className="text-lg font-semibold text-white">
                                Team Members
                            </h2>

                            <p className="mt-1 text-sm text-slate-400">
                                View team members,
                                roles, projects
                                and workloads.
                            </p>

                        </div>

                        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">

                            <button
                                type="button"
                                onClick={() =>
                                    handleOpenRequestAdd()
                                }
                                className="
                                    flex
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    bg-indigo-600
                                    px-4
                                    py-3
                                    text-sm
                                    font-medium
                                    text-white
                                    transition
                                    hover:bg-indigo-500
                                "
                            >

                                <Send
                                    size={17}
                                />

                                Request Add Contributor

                            </button>

                            <div className="relative w-full sm:w-80">

                                <Search
                                    size={17}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                                />

                                <input
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
                                    placeholder="Search members..."
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-slate-700
                                        bg-slate-900
                                        py-3
                                        pl-10
                                        pr-4
                                        text-sm
                                        text-white
                                        outline-none
                                        placeholder:text-slate-500
                                        focus:border-blue-500
                                    "
                                />

                            </div>

                        </div>

                    </div>

                    {filteredMembers.length ===
                    0 ? (
                        <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-12 text-center">

                            <Users
                                size={42}
                                className="mx-auto text-slate-600"
                            />

                            <h3 className="mt-4 text-lg font-semibold text-white">
                                No team members available
                            </h3>

                            <p className="mt-2 text-sm text-slate-400">
                                No members match
                                your search.
                            </p>

                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">

                            {filteredMembers.map(
                                (member) => (
                                    <div
                                        key={
                                            member.id
                                        }
                                        className="space-y-3"
                                    >

                                        <TeamMemberCard
                                            member={
                                                member
                                            }
                                            onView={
                                                handleViewMember
                                            }
                                            onAssign={
                                                handleOpenAssign
                                            }
                                            onRemove={
                                                handleOpenRemove
                                            }
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleOpenRequestRemove(
                                                    member
                                                )
                                            }
                                            disabled={
                                                !member.assignedProjects?.length
                                            }
                                            className="
                                                flex
                                                w-full
                                                items-center
                                                justify-center
                                                gap-2
                                                rounded-xl
                                                border
                                                border-red-500/30
                                                bg-red-500/10
                                                px-4
                                                py-2.5
                                                text-xs
                                                font-medium
                                                text-red-400
                                                transition
                                                hover:bg-red-500/20
                                                disabled:cursor-not-allowed
                                                disabled:opacity-40
                                            "
                                        >

                                            <Send
                                                size={14}
                                            />

                                            Request Remove Contributor

                                        </button>

                                    </div>
                                )
                            )}

                        </div>
                    )}

                </>
            )}

            {/* ==================================================
                TEAM PERFORMANCE
                TEAM-002
            ================================================== */}

            {activeSection ===
                "performance" && (
                <div className="space-y-6">

                    <div>

                        <h2 className="text-xl font-semibold text-white">
                            Team Performance
                        </h2>

                        <p className="mt-1 text-sm text-slate-400">
                            Monitor productivity,
                            task progress and
                            contributor workload.
                        </p>

                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">

                        <PerformanceCard
                            title="Completed"
                            value={
                                performance.completed
                            }
                            icon={
                                CheckCircle2
                            }
                            iconClass="text-emerald-400"
                        />

                        <PerformanceCard
                            title="Pending"
                            value={
                                performance.pending
                            }
                            icon={
                                Clock3
                            }
                            iconClass="text-amber-400"
                        />

                        <PerformanceCard
                            title="In Progress"
                            value={
                                performance.inProgress
                            }
                            icon={
                                Activity
                            }
                            iconClass="text-blue-400"
                        />

                        <PerformanceCard
                            title="Overdue"
                            value={
                                performance.overdue
                            }
                            icon={
                                AlertTriangle
                            }
                            iconClass="text-red-400"
                        />

                        <PerformanceCard
                            title="Completion Rate"
                            value={`${performance.completionRate}%`}
                            icon={
                                Target
                            }
                            iconClass="text-indigo-400"
                        />

                    </div>

                    <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-6">

                        <div className="mb-5 flex items-center justify-between">

                            <div>

                                <h3 className="font-semibold text-white">
                                    Contributor Workload
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                    Current workload
                                    across the
                                    selected team.
                                </p>

                            </div>

                            <Activity
                                className="text-blue-400"
                            />

                        </div>

                        <div className="space-y-5">

                            {selectedTeam?.members?.map(
                                (member) => {

                                    const workload =
                                        Math.min(
                                            Math.max(
                                                Number(
                                                    member.workload ||
                                                        0
                                                ),
                                                0
                                            ),
                                            100
                                        );

                                    return (
                                        <div
                                            key={
                                                member.id
                                            }
                                        >

                                            <div className="mb-2 flex items-center justify-between">

                                                <div className="flex items-center gap-2">

                                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-xs font-semibold text-blue-400">

                                                        {member.name
                                                            ?.charAt(
                                                                0
                                                            )
                                                            ?.toUpperCase()}

                                                    </div>

                                                    <span className="text-sm font-medium text-white">
                                                        {
                                                            member.name
                                                        }
                                                    </span>

                                                </div>

                                                <span className="text-sm text-slate-400">
                                                    {
                                                        workload
                                                    }
                                                    %
                                                </span>

                                            </div>

                                            <div className="h-2 overflow-hidden rounded-full bg-slate-800">

                                                <div
                                                    className={`
                                                        h-full
                                                        rounded-full
                                                        ${
                                                            workload >=
                                                            80
                                                                ? "bg-red-500"
                                                                : workload >=
                                                                  60
                                                                ? "bg-amber-500"
                                                                : "bg-emerald-500"
                                                        }
                                                    `}
                                                    style={{
                                                        width: `${workload}%`,
                                                    }}
                                                />

                                            </div>

                                        </div>
                                    );
                                }
                            )}

                        </div>

                    </div>

                    <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-6">

                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">

                                <Activity
                                    size={20}
                                    className="text-blue-400"
                                />

                            </div>

                            <div>

                                <h3 className="font-semibold text-white">
                                    Team Activity
                                </h3>

                                <p className="text-sm text-slate-500">
                                    Recent performance
                                    overview.
                                </p>

                            </div>

                        </div>

                        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">

                            <ActivityItem
                                title="Tasks Completed"
                                value={
                                    performance.completed
                                }
                                description="Completed by team"
                            />

                            <ActivityItem
                                title="Active Work"
                                value={
                                    performance.inProgress
                                }
                                description="Tasks currently in progress"
                            />

                            <ActivityItem
                                title="Average Workload"
                                value={`${performance.averageWorkload}%`}
                                description="Across team members"
                            />

                        </div>

                    </div>

                </div>
            )}

            {/* ==================================================
                ASSIGN CONTRIBUTORS
                TEAM-003
            ================================================== */}

            {activeSection ===
                "assign" && (
                <div className="space-y-6">

                    <div>

                        <h2 className="text-xl font-semibold text-white">
                            Assign Contributors to Tasks
                        </h2>

                        <p className="mt-1 text-sm text-slate-400">
                            Select an available
                            contributor and assign
                            them to a task.
                        </p>

                    </div>

                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

                        {filteredMembers.map(
                            (member) => (
                                <div
                                    key={
                                        member.id
                                    }
                                    className="rounded-2xl border border-slate-700 bg-slate-900/80 p-5"
                                >

                                    <div className="flex items-center justify-between">

                                        <div className="flex items-center gap-3">

                                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">

                                                <Users
                                                    size={21}
                                                />

                                            </div>

                                            <div>

                                                <h3 className="font-semibold text-white">
                                                    {
                                                        member.name
                                                    }
                                                </h3>

                                                <p className="text-sm text-slate-500">
                                                    {
                                                        member.role
                                                    }
                                                </p>

                                            </div>

                                        </div>

                                        <span className="text-sm font-medium text-slate-300">
                                            {
                                                member.workload
                                            }
                                            %
                                        </span>

                                    </div>

                                    <div className="mt-4">

                                        <div className="h-2 rounded-full bg-slate-800">

                                            <div
                                                className={`
                                                    h-full
                                                    rounded-full
                                                    ${
                                                        Number(
                                                            member.workload
                                                        ) >=
                                                        80
                                                            ? "bg-red-500"
                                                            : "bg-emerald-500"
                                                    }
                                                `}
                                                style={{
                                                    width: `${Math.min(
                                                        Number(
                                                            member.workload ||
                                                                0
                                                        ),
                                                        100
                                                    )}%`,
                                                }}
                                            />

                                        </div>

                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleOpenAssign(
                                                member
                                            )
                                        }
                                        disabled={
                                            member.active ===
                                                false ||
                                            member.status ===
                                                "Inactive" ||
                                            Number(
                                                member.workload ||
                                                    0
                                            ) >= 80
                                        }
                                        className="
                                            mt-4
                                            flex
                                            w-full
                                            items-center
                                            justify-center
                                            gap-2
                                            rounded-xl
                                            bg-blue-600
                                            px-4
                                            py-3
                                            text-sm
                                            font-medium
                                            text-white
                                            transition
                                            hover:bg-blue-500
                                            disabled:cursor-not-allowed
                                            disabled:opacity-40
                                        "
                                    >

                                        <UserPlus
                                            size={17}
                                        />

                                        Assign Contributor

                                    </button>

                                </div>
                            )
                        )}

                    </div>

                </div>
            )}

            {/* ==================================================
                REMOVE CONTRIBUTORS
                TEAM-004
            ================================================== */}

            {activeSection ===
                "remove" && (
                <div className="space-y-6">

                    <div>

                        <h2 className="text-xl font-semibold text-white">
                            Remove Contributors from Tasks
                        </h2>

                        <p className="mt-1 text-sm text-slate-400">
                            Select a contributor and
                            remove their task
                            assignment.
                        </p>

                    </div>

                    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">

                        {selectedTeam?.members
                            ?.filter(
                                (member) =>
                                    Array.isArray(
                                        member.tasks
                                    ) &&
                                    member.tasks
                                        .length >
                                        0
                            )
                            .map(
                                (member) => (
                                    <div
                                        key={
                                            member.id
                                        }
                                        className="rounded-2xl border border-slate-700 bg-slate-900/80 p-5"
                                    >

                                        <div className="flex items-center justify-between">

                                            <div className="flex items-center gap-3">

                                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10">

                                                    <UserMinus
                                                        size={
                                                            21
                                                        }
                                                        className="text-red-400"
                                                    />

                                                </div>

                                                <div>

                                                    <h3 className="font-semibold text-white">
                                                        {
                                                            member.name
                                                        }
                                                    </h3>

                                                    <p className="text-sm text-slate-500">
                                                        {
                                                            member.email
                                                        }
                                                    </p>

                                                </div>

                                            </div>

                                            <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-400">
                                                {
                                                    member
                                                        .tasks
                                                        .length
                                                }{" "}
                                                tasks
                                            </span>

                                        </div>

                                        <div className="mt-4 space-y-2">

                                            {member.tasks.map(
                                                (
                                                    task
                                                ) => (
                                                    <div
                                                        key={
                                                            task.id
                                                        }
                                                        className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3"
                                                    >

                                                        <div>

                                                            <p className="text-sm font-medium text-white">
                                                                {
                                                                    task.title
                                                                }
                                                            </p>

                                                            <p className="mt-1 text-xs text-slate-500">
                                                                {
                                                                    task.status
                                                                }
                                                            </p>

                                                        </div>

                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setRemoveMember(
                                                                    member
                                                                );

                                                                setSelectedTaskId(
                                                                    String(
                                                                        task.id
                                                                    )
                                                                );
                                                            }}
                                                            className="
                                                                flex
                                                                items-center
                                                                gap-1.5
                                                                rounded-lg
                                                                border
                                                                border-red-500/30
                                                                bg-red-500/10
                                                                px-3
                                                                py-2
                                                                text-xs
                                                                font-medium
                                                                text-red-400
                                                                transition
                                                                hover:bg-red-500/20
                                                            "
                                                        >

                                                            <UserMinus
                                                                size={
                                                                    14
                                                                }
                                                            />

                                                            Remove

                                                        </button>

                                                    </div>
                                                )
                                            )}

                                        </div>

                                    </div>
                                )
                            )}

                    </div>

                </div>
            )}

            {/* ==================================================
                TEAM-005 / TEAM-006
                PERMISSION REQUESTS
            ================================================== */}

            {activeSection ===
                "requests" && (
                <div className="space-y-6">

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                        <div>

                            <h2 className="text-xl font-semibold text-white">
                                Permission Requests
                            </h2>

                            <p className="mt-1 text-sm text-slate-400">
                                Request Admin approval
                                before adding or
                                removing contributors
                                from projects.
                            </p>

                        </div>

                        <div className="flex gap-3">

                            <button
                                type="button"
                                onClick={() =>
                                    handleOpenRequestAdd()
                                }
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    rounded-xl
                                    bg-indigo-600
                                    px-4
                                    py-3
                                    text-sm
                                    font-medium
                                    text-white
                                    hover:bg-indigo-500
                                "
                            >

                                <UserPlus
                                    size={17}
                                />

                                Request Add

                            </button>

                        </div>

                    </div>

                    {/* REQUEST HISTORY */}

                    {permissionRequests.length ===
                    0 ? (
                        <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-12 text-center">

                            <ShieldCheck
                                size={42}
                                className="mx-auto text-slate-600"
                            />

                            <h3 className="mt-4 text-lg font-semibold text-white">
                                No permission requests
                            </h3>

                            <p className="mt-2 text-sm text-slate-400">
                                Your contributor
                                addition and removal
                                requests will appear
                                here.
                            </p>

                        </div>
                    ) : (
                        <div className="space-y-4">

                            {permissionRequests.map(
                                (request) => (
                                    <div
                                        key={
                                            request.id
                                        }
                                        className="rounded-2xl border border-slate-700 bg-slate-900/80 p-5"
                                    >

                                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                                            <div className="flex gap-4">

                                                <div
                                                    className={`
                                                        flex
                                                        h-11
                                                        w-11
                                                        shrink-0
                                                        items-center
                                                        justify-center
                                                        rounded-xl
                                                        ${
                                                            request.type ===
                                                            "add"
                                                                ? "bg-indigo-500/10 text-indigo-400"
                                                                : "bg-red-500/10 text-red-400"
                                                        }
                                                    `}
                                                >

                                                    {request.type ===
                                                    "add" ? (
                                                        <UserPlus
                                                            size={
                                                                20
                                                            }
                                                        />
                                                    ) : (
                                                        <UserMinus
                                                            size={
                                                                20
                                                            }
                                                        />
                                                    )}

                                                </div>

                                                <div>

                                                    <div className="flex flex-wrap items-center gap-2">

                                                        <h3 className="font-semibold text-white">
                                                            {request.type ===
                                                            "add"
                                                                ? "Add Contributor Request"
                                                                : "Remove Contributor Request"}
                                                        </h3>

                                                        <span
                                                            className={`
                                                                rounded-full
                                                                px-2.5
                                                                py-1
                                                                text-[10px]
                                                                font-semibold
                                                                uppercase
                                                                ${
                                                                    request.status ===
                                                                    "Pending"
                                                                        ? "bg-amber-500/10 text-amber-400"
                                                                        : request.status ===
                                                                          "Approved"
                                                                        ? "bg-emerald-500/10 text-emerald-400"
                                                                        : "bg-red-500/10 text-red-400"
                                                                }
                                                            `}
                                                        >
                                                            {
                                                                request.status
                                                            }
                                                        </span>

                                                    </div>

                                                    <p className="mt-1 text-sm text-slate-400">

                                                        <span className="font-medium text-white">
                                                            {
                                                                request.memberName
                                                            }
                                                        </span>

                                                        {" → "}

                                                        {
                                                            request.projectName
                                                        }

                                                    </p>

                                                    <p className="mt-3 max-w-2xl text-sm text-slate-500">
                                                        {
                                                            request.reason
                                                        }
                                                    </p>

                                                    <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-600">

                                                        <span>
                                                            Requested by:{" "}
                                                            {
                                                                request.requestedBy
                                                            }
                                                        </span>

                                                        <span>
                                                            {
                                                                request.createdAt
                                                            }
                                                        </span>

                                                        {request.notificationSent && (
                                                            <span className="flex items-center gap-1 text-blue-400">
                                                                <Bell
                                                                    size={
                                                                        12
                                                                    }
                                                                />
                                                                Admin notified
                                                            </span>
                                                        )}

                                                    </div>

                                                </div>

                                            </div>

                                        </div>

                                    </div>
                                )
                            )}

                        </div>
                    )}

                    {/* ACTIVITY LOG */}

                    {activityLogs.length >
                        0 && (
                        <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-6">

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">

                                    <Activity
                                        size={20}
                                        className="text-blue-400"
                                    />

                                </div>

                                <div>

                                    <h3 className="font-semibold text-white">
                                        Request Activity Log
                                    </h3>

                                    <p className="text-sm text-slate-500">
                                        Recent permission
                                        request activity.
                                    </p>

                                </div>

                            </div>

                            <div className="mt-5 space-y-3">

                                {activityLogs.map(
                                    (activity) => (
                                        <div
                                            key={
                                                activity.id
                                            }
                                            className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-4"
                                        >

                                            <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10">

                                                <FileText
                                                    size={
                                                        15
                                                    }
                                                    className="text-indigo-400"
                                                />

                                            </div>

                                            <div className="min-w-0 flex-1">

                                                <p className="text-sm text-slate-300">
                                                    {
                                                        activity.message
                                                    }
                                                </p>

                                                <p className="mt-1 text-xs text-slate-600">
                                                    {
                                                        activity.date
                                                    }
                                                </p>

                                            </div>

                                            <span className="rounded-full bg-amber-500/10 px-2 py-1 text-[10px] text-amber-400">
                                                Pending
                                            </span>

                                        </div>
                                    )
                                )}

                            </div>

                        </div>
                    )}

                </div>
            )}

            {/* ==================================================
                MEMBER DETAILS MODAL
                ==================================================
            */}

            {selectedMember && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">

                        <div className="flex items-center justify-between border-b border-slate-700 p-5">

                            <div>

                                <h2 className="text-lg font-semibold text-white">
                                    Member Details
                                </h2>

                                <p className="text-sm text-slate-500">
                                    Team member information
                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedMember(
                                        null
                                    )
                                }
                                className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
                            >

                                <X
                                    size={20}
                                />

                            </button>

                        </div>

                        <div className="p-5">

                            <div className="flex items-center gap-4">

                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-xl font-bold text-blue-400">

                                    {selectedMember.name
                                        ?.charAt(
                                            0
                                        )
                                        ?.toUpperCase()}

                                </div>

                                <div>

                                    <h3 className="text-xl font-semibold text-white">
                                        {
                                            selectedMember.name
                                        }
                                    </h3>

                                    <p className="mt-1 text-sm text-slate-400">
                                        {
                                            selectedMember.email
                                        }
                                    </p>

                                </div>

                            </div>

                            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">

                                <InfoBox
                                    label="Role"
                                    value={
                                        selectedMember.role
                                    }
                                    icon={
                                        BriefcaseBusiness
                                    }
                                />

                                <InfoBox
                                    label="Status"
                                    value={
                                        selectedMember.active
                                            ? "Active"
                                            : "Inactive"
                                    }
                                    icon={
                                        ShieldCheck
                                    }
                                />

                                <InfoBox
                                    label="Workload"
                                    value={`${selectedMember.workload}%`}
                                    icon={
                                        Activity
                                    }
                                />

                                <InfoBox
                                    label="Assigned Tasks"
                                    value={
                                        selectedMember
                                            .tasks
                                            ?.length ||
                                        0
                                    }
                                    icon={
                                        ListTodo
                                    }
                                />

                            </div>

                            <div className="mt-5">

                                <h3 className="mb-3 text-sm font-semibold text-white">
                                    Skills
                                </h3>

                                <div className="flex flex-wrap gap-2">

                                    {selectedMember.skills?.length >
                                    0 ? (
                                        selectedMember.skills.map(
                                            (
                                                skill
                                            ) => (
                                                <span
                                                    key={
                                                        skill
                                                    }
                                                    className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300"
                                                >
                                                    {
                                                        skill
                                                    }
                                                </span>
                                            )
                                        )
                                    ) : (
                                        <span className="text-sm text-slate-500">
                                            No skills
                                            available.
                                        </span>
                                    )}

                                </div>

                            </div>

                        </div>

                    </div>

                </div>
            )}

            {/* ==================================================
                ASSIGN MODAL
                TEAM-003
            ================================================== */}

            {assignMember && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

                    <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">

                        <div className="flex items-center justify-between border-b border-slate-700 p-5">

                            <div>

                                <h2 className="text-lg font-semibold text-white">
                                    Assign Contributor
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Assign a task to{" "}
                                    <span className="text-blue-400">
                                        {
                                            assignMember.name
                                        }
                                    </span>
                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setAssignMember(
                                        null
                                    )
                                }
                                className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
                            >
                                <X size={20} />
                            </button>

                        </div>

                        <div className="p-5">

                            <div className="mb-5 rounded-xl border border-blue-500/20 bg-blue-500/10 p-4">

                                <div className="flex items-center justify-between">

                                    <span className="text-sm text-slate-400">
                                        Current workload
                                    </span>

                                    <span className="font-semibold text-blue-400">
                                        {
                                            assignMember.workload
                                        }
                                        %
                                    </span>

                                </div>

                            </div>

                            <label className="mb-2 block text-sm font-medium text-slate-300">
                                Select Task
                            </label>

                            <select
                                value={
                                    selectedTaskId
                                }
                                onChange={(
                                    event
                                ) =>
                                    setSelectedTaskId(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-slate-700
                                    bg-slate-950
                                    px-4
                                    py-3
                                    text-sm
                                    text-white
                                    outline-none
                                    focus:border-blue-500
                                "
                            >

                                <option value="">
                                    Select a task...
                                </option>

                                {tasksForAssignment.map(
                                    (task) => (
                                        <option
                                            key={
                                                task.id
                                            }
                                            value={
                                                task.id
                                            }
                                        >
                                            {
                                                task.title
                                            }{" "}
                                            —{" "}
                                            {
                                                task.priority
                                            }
                                        </option>
                                    )
                                )}

                            </select>

                            <div className="mt-5 flex gap-3">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setAssignMember(
                                            null
                                        )
                                    }
                                    className="
                                        flex-1
                                        rounded-xl
                                        border
                                        border-slate-700
                                        bg-slate-800
                                        px-4
                                        py-3
                                        text-sm
                                        font-medium
                                        text-slate-300
                                        hover:bg-slate-700
                                    "
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        handleAssignContributor
                                    }
                                    className="
                                        flex-1
                                        rounded-xl
                                        bg-blue-600
                                        px-4
                                        py-3
                                        text-sm
                                        font-medium
                                        text-white
                                        hover:bg-blue-500
                                    "
                                >
                                    Assign Contributor
                                </button>

                            </div>

                        </div>

                    </div>

                </div>
            )}

            {/* ==================================================
                REMOVE MODAL
                TEAM-004
            ================================================== */}

            {removeMember && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

                    <div className="w-full max-w-lg rounded-2xl border border-red-500/20 bg-slate-900 shadow-2xl">

                        <div className="flex items-center justify-between border-b border-slate-700 p-5">

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10">

                                    <UserMinus
                                        size={20}
                                        className="text-red-400"
                                    />

                                </div>

                                <div>

                                    <h2 className="text-lg font-semibold text-white">
                                        Remove Contributor
                                    </h2>

                                    <p className="text-sm text-slate-500">
                                        Remove task assignment
                                    </p>

                                </div>

                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setRemoveMember(
                                        null
                                    )
                                }
                                className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
                            >
                                <X size={20} />
                            </button>

                        </div>

                        <div className="p-5">

                            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">

                                <p className="text-sm text-slate-300">

                                    You are about to remove{" "}

                                    <span className="font-semibold text-white">
                                        {
                                            removeMember.name
                                        }
                                    </span>{" "}

                                    from a task.

                                </p>

                                <p className="mt-2 text-xs text-slate-500">
                                    The contributor will no
                                    longer be assigned to
                                    the selected task.
                                </p>

                            </div>

                            <label className="mt-5 mb-2 block text-sm font-medium text-slate-300">
                                Task
                            </label>

                            <select
                                value={
                                    selectedTaskId
                                }
                                onChange={(
                                    event
                                ) =>
                                    setSelectedTaskId(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-slate-700
                                    bg-slate-950
                                    px-4
                                    py-3
                                    text-sm
                                    text-white
                                    outline-none
                                    focus:border-red-500
                                "
                            >

                                <option value="">
                                    Select assigned task...
                                </option>

                                {removeMember.tasks?.map(
                                    (task) => (
                                        <option
                                            key={
                                                task.id
                                            }
                                            value={
                                                task.id
                                            }
                                        >
                                            {
                                                task.title
                                            }
                                        </option>
                                    )
                                )}

                            </select>

                            <div className="mt-5 flex gap-3">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setRemoveMember(
                                            null
                                        )
                                    }
                                    className="
                                        flex-1
                                        rounded-xl
                                        border
                                        border-slate-700
                                        bg-slate-800
                                        px-4
                                        py-3
                                        text-sm
                                        font-medium
                                        text-slate-300
                                        hover:bg-slate-700
                                    "
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        handleRemoveContributor
                                    }
                                    className="
                                        flex-1
                                        rounded-xl
                                        bg-red-600
                                        px-4
                                        py-3
                                        text-sm
                                        font-medium
                                        text-white
                                        hover:bg-red-500
                                    "
                                >
                                    Confirm Removal
                                </button>

                            </div>

                        </div>

                    </div>

                </div>
            )}

            {/* ==================================================
                TEAM-005 / TEAM-006 REQUEST MODAL
            ================================================== */}

            {requestType && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

                    <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">

                        <div className="flex items-center justify-between border-b border-slate-700 p-5">

                            <div className="flex items-center gap-3">

                                <div
                                    className={`
                                        flex
                                        h-11
                                        w-11
                                        items-center
                                        justify-center
                                        rounded-xl
                                        ${
                                            requestType ===
                                            "add"
                                                ? "bg-indigo-500/10 text-indigo-400"
                                                : "bg-red-500/10 text-red-400"
                                        }
                                    `}
                                >

                                    {requestType ===
                                    "add" ? (
                                        <UserPlus
                                            size={
                                                21
                                            }
                                        />
                                    ) : (
                                        <UserMinus
                                            size={
                                                21
                                            }
                                        />
                                    )}

                                </div>

                                <div>

                                    <h2 className="text-lg font-semibold text-white">

                                        {requestType ===
                                        "add"
                                            ? "Request Add Contributor"
                                            : "Request Remove Contributor"}

                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">

                                        {requestType ===
                                        "add"
                                            ? "Admin approval is required before adding a contributor."
                                            : "Admin approval is required before removing a contributor."}

                                    </p>

                                </div>

                            </div>

                            <button
                                type="button"
                                onClick={
                                    handleCancelPermissionRequest
                                }
                                className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
                            >

                                <X
                                    size={20}
                                />

                            </button>

                        </div>

                        <div className="space-y-5 p-5">

                            {/* PROJECT */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-slate-300">
                                    Project
                                </label>

                                <select
                                    value={
                                        requestProjectId
                                    }
                                    onChange={(
                                        event
                                    ) => {

                                        setRequestProjectId(
                                            event
                                                .target
                                                .value
                                        );

                                        if (
                                            requestType ===
                                            "add"
                                        ) {
                                            setRequestMember(
                                                null
                                            );
                                        }

                                    }}
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-slate-700
                                        bg-slate-950
                                        px-4
                                        py-3
                                        text-sm
                                        text-white
                                        outline-none
                                        focus:border-indigo-500
                                    "
                                >

                                    <option value="">
                                        Select project...
                                    </option>

                                    {selectedTeam?.projects?.map(
                                        (
                                            project
                                        ) => (
                                            <option
                                                key={
                                                    project.id
                                                }
                                                value={
                                                    project.id
                                                }
                                            >
                                                {
                                                    project.name
                                                }
                                            </option>
                                        )
                                    )}

                                </select>

                            </div>

                            {/* MEMBER */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-slate-300">

                                    {requestType ===
                                    "add"
                                        ? "Available Contributor"
                                        : "Project Member"}

                                </label>

                                {requestType ===
                                "add" ? (
                                    <select
                                        value={
                                            requestMember?.id ||
                                            ""
                                        }
                                        onChange={(
                                            event
                                        ) => {

                                            const member =
                                                availableContributors.find(
                                                    (
                                                        item
                                                    ) =>
                                                        String(
                                                            item.id
                                                        ) ===
                                                        String(
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                );

                                            setRequestMember(
                                                member ||
                                                    null
                                            );

                                        }}
                                        className="
                                            w-full
                                            rounded-xl
                                            border
                                            border-slate-700
                                            bg-slate-950
                                            px-4
                                            py-3
                                            text-sm
                                            text-white
                                            outline-none
                                            focus:border-indigo-500
                                        "
                                    >

                                        <option value="">
                                            Select contributor...
                                        </option>

                                        {availableContributors.map(
                                            (
                                                member
                                            ) => {

                                                const alreadyAssigned =
                                                    member.assignedProjects?.includes(
                                                        selectedRequestProject?.name
                                                    );

                                                const pending =
                                                    hasPendingRequest(
                                                        "add",
                                                        member.id,
                                                        requestProjectId
                                                    );

                                                return (
                                                    <option
                                                        key={
                                                            member.id
                                                        }
                                                        value={
                                                            member.id
                                                        }
                                                        disabled={
                                                            alreadyAssigned ||
                                                            pending
                                                        }
                                                    >
                                                        {
                                                            member.name
                                                        }{" "}
                                                        —{" "}
                                                        {
                                                            member.email
                                                        }
                                                        {alreadyAssigned
                                                            ? " (Already assigned)"
                                                            : pending
                                                            ? " (Request pending)"
                                                            : ""}
                                                    </option>
                                                );
                                            }
                                        )}

                                    </select>
                                ) : (
                                    <select
                                        value={
                                            requestMember?.id ||
                                            ""
                                        }
                                        onChange={(
                                            event
                                        ) => {

                                            const member =
                                                selectedTeam?.members?.find(
                                                    (
                                                        item
                                                    ) =>
                                                        String(
                                                            item.id
                                                        ) ===
                                                        String(
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                );

                                            setRequestMember(
                                                member ||
                                                    null
                                            );

                                        }}
                                        className="
                                            w-full
                                            rounded-xl
                                            border
                                            border-slate-700
                                            bg-slate-950
                                            px-4
                                            py-3
                                            text-sm
                                            text-white
                                            outline-none
                                            focus:border-red-500
                                        "
                                    >

                                        <option value="">
                                            Select project member...
                                        </option>

                                        {selectedTeam?.members
                                            ?.filter(
                                                (
                                                    member
                                                ) =>
                                                    member.assignedProjects?.includes(
                                                        selectedRequestProject?.name
                                                    )
                                            )
                                            .map(
                                                (
                                                    member
                                                ) => {

                                                    const pending =
                                                        hasPendingRequest(
                                                            "remove",
                                                            member.id,
                                                            requestProjectId
                                                        );

                                                    return (
                                                        <option
                                                            key={
                                                                member.id
                                                            }
                                                            value={
                                                                member.id
                                                            }
                                                            disabled={
                                                                pending
                                                            }
                                                        >
                                                            {
                                                                member.name
                                                            }{" "}
                                                            —{" "}
                                                            {
                                                                member.role
                                                            }
                                                            {pending
                                                                ? " (Request pending)"
                                                                : ""}
                                                        </option>
                                                    );
                                                }
                                            )}

                                    </select>
                                )}

                            </div>

                            {/* SELECTED MEMBER */}

                            {requestMember && (
                                <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-4">

                                    <div className="flex items-center gap-3">

                                        <div
                                            className={`
                                                flex
                                                h-11
                                                w-11
                                                items-center
                                                justify-center
                                                rounded-xl
                                                ${
                                                    requestType ===
                                                    "add"
                                                        ? "bg-indigo-500/10 text-indigo-400"
                                                        : "bg-red-500/10 text-red-400"
                                                }
                                            `}
                                        >

                                            {requestMember.name
                                                ?.charAt(
                                                    0
                                                )
                                                ?.toUpperCase()}

                                        </div>

                                        <div>

                                            <p className="font-semibold text-white">
                                                {
                                                    requestMember.name
                                                }
                                            </p>

                                            <p className="text-sm text-slate-500">
                                                {
                                                    requestMember.email
                                                }
                                            </p>

                                        </div>

                                    </div>

                                </div>
                            )}

                            {/* REASON */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-slate-300">
                                    Reason for Request
                                </label>

                                <textarea
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
                                    rows={
                                        5
                                    }
                                    placeholder={
                                        requestType ===
                                        "add"
                                            ? "Explain why this contributor should be added to the project..."
                                            : "Explain why this contributor should be removed from the project..."
                                    }
                                    className="
                                        w-full
                                        resize-none
                                        rounded-xl
                                        border
                                        border-slate-700
                                        bg-slate-950
                                        px-4
                                        py-3
                                        text-sm
                                        text-white
                                        outline-none
                                        placeholder:text-slate-600
                                        focus:border-indigo-500
                                    "
                                />

                                <div className="mt-2 flex items-center justify-between">

                                    <p className="text-xs text-slate-600">
                                        Admin will review
                                        this request.
                                    </p>

                                    <span className="text-xs text-slate-600">
                                        {
                                            requestReason.length
                                        }
                                        /500
                                    </span>

                                </div>

                            </div>

                            {/* NOTICE */}

                            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">

                                <div className="flex gap-3">

                                    <ShieldCheck
                                        size={19}
                                        className="mt-0.5 shrink-0 text-amber-400"
                                    />

                                    <div>

                                        <p className="text-sm font-medium text-amber-300">
                                            Admin approval required
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-slate-500">

                                            The contributor will
                                            not be added or
                                            removed immediately.
                                            The Admin must approve
                                            this permission request
                                            first.

                                        </p>

                                    </div>

                                </div>

                            </div>

                            {/* ACTIONS */}

                            <div className="flex gap-3">

                                <button
                                    type="button"
                                    onClick={
                                        handleCancelPermissionRequest
                                    }
                                    className="
                                        flex-1
                                        rounded-xl
                                        border
                                        border-slate-700
                                        bg-slate-800
                                        px-4
                                        py-3
                                        text-sm
                                        font-medium
                                        text-slate-300
                                        transition
                                        hover:bg-slate-700
                                    "
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        handleSubmitPermissionRequest
                                    }
                                    className={`
                                        flex
                                        flex-1
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-xl
                                        px-4
                                        py-3
                                        text-sm
                                        font-medium
                                        text-white
                                        transition
                                        ${
                                            requestType ===
                                            "add"
                                                ? "bg-indigo-600 hover:bg-indigo-500"
                                                : "bg-red-600 hover:bg-red-500"
                                        }
                                    `}
                                >

                                    <Send
                                        size={
                                            17
                                        }
                                    />

                                    Send Request

                                </button>

                            </div>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}

/*
================================================================
PERFORMANCE CARD
================================================================
*/

function PerformanceCard({
    title,
    value,
    icon: Icon,
    iconClass,
}) {
    return (
        <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-5">

            <div className="flex items-center justify-between">

                <div>

                    <p className="text-xs uppercase tracking-wide text-slate-500">
                        {title}
                    </p>

                    <p className="mt-2 text-2xl font-bold text-white">
                        {value}
                    </p>

                </div>

                <Icon
                    size={23}
                    className={iconClass}
                />

            </div>

        </div>
    );
}

/*
================================================================
ACTIVITY ITEM
================================================================
*/

function ActivityItem({
    title,
    value,
    description,
}) {
    return (
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">

            <p className="text-xs uppercase tracking-wide text-slate-500">
                {title}
            </p>

            <p className="mt-2 text-2xl font-bold text-white">
                {value}
            </p>

            <p className="mt-1 text-xs text-slate-500">
                {description}
            </p>

        </div>
    );
}

/*
================================================================
INFO BOX
================================================================
*/

function InfoBox({
    label,
    value,
    icon: Icon,
}) {
    return (
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">

            <div className="flex items-center gap-2 text-xs text-slate-500">

                <Icon size={14} />

                {label}

            </div>

            <p className="mt-2 text-sm font-semibold text-white">
                {value}
            </p>

        </div>
    );
}

export default TeamManagement;
