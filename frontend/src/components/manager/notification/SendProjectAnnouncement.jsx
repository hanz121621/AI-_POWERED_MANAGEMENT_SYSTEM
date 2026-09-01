
import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Megaphone,
    Send,
    RefreshCw,
    AlertTriangle,
    CheckCircle2,
    Users,
    FolderKanban,
    X,
    Info,
    UserCheck,
    RotateCcw,
    ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { getManagerProjects } from "@/services/aiService";
import { getCurrentUser } from "@/services/authService";

// ============================================================
// COMM-005 — SEND PROJECT ANNOUNCEMENT
// ============================================================
//
// Manager sends an announcement to authorized members of a
// team assigned to a manager project.
//
// IMPORTANT
// ------------------------------------------------------------
// - Projects come from getManagerProjects().
// - Teams can come from the project relationship OR existing
//   team-management data.
// - Recipients come only from the selected team.
// - Only active team members can receive announcements.
// - No project/team/member IDs are hard-coded.
// - Announcements are stored locally until a backend endpoint
//   is available.
// ============================================================

const ANNOUNCEMENTS_KEY =
    "aipms_project_announcements";

const ACTIVITY_KEY =
    "aipms_activity_logs";

const TEAM_STORAGE_KEYS = [
    "aipms_teams",
    "aipms_team_data",
    "aipms_manager_teams",
    "teams",
];

const PRIORITY_STORAGE_KEYS = [
    "aipms_announcement_priorities",
    "announcement_priorities",
    "aipms_notification_priorities",
];

const DEFAULT_PRIORITY_OPTIONS = [
    {
        value: "High",
        label: "High",
    },
    {
        value: "Medium",
        label: "Medium",
    },
    {
        value: "Low",
        label: "Low",
    },
];

// ============================================================
// STORAGE HELPERS
// ============================================================

function readStorageArray(key) {
    try {
        const raw = localStorage.getItem(key);

        if (!raw) {
            return [];
        }

        const parsed = JSON.parse(raw);

        return Array.isArray(parsed)
            ? parsed
            : [];
    } catch (error) {
        console.error(
            `Unable to read localStorage key "${key}":`,
            error
        );

        return [];
    }
}

function readFirstAvailableArray(keys) {
    for (const key of keys) {
        const data = readStorageArray(key);

        if (data.length > 0) {
            return data;
        }
    }

    return [];
}

function writeStorageArray(key, value) {
    try {
        localStorage.setItem(
            key,
            JSON.stringify(value)
        );
    } catch (error) {
        console.error(
            `Unable to write localStorage key "${key}":`,
            error
        );

        throw new Error(
            "Unable to save the announcement locally."
        );
    }
}

// ============================================================
// ID
// ============================================================

function createId(prefix = "announcement") {
    if (
        typeof crypto !== "undefined" &&
        typeof crypto.randomUUID === "function"
    ) {
        return crypto.randomUUID();
    }

    return `${prefix}_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 10)}`;
}

// ============================================================
// PROJECT HELPERS
// ============================================================

function getProjectId(project) {
    if (!project) {
        return null;
    }

    return (
        project.id ??
        project.projectId ??
        project.projectID ??
        project.ProjectId ??
        project.ProjectID ??
        null
    );
}

function getProjectName(project) {
    if (!project) {
        return "Unnamed Project";
    }

    return (
        project.name ||
        project.title ||
        project.projectName ||
        project.projectTitle ||
        "Unnamed Project"
    );
}

// ============================================================
// TEAM HELPERS
// ============================================================

function getTeamId(team) {
    if (!team) {
        return null;
    }

    return (
        team.id ??
        team.teamId ??
        team.teamID ??
        team.TeamId ??
        team.TeamID ??
        null
    );
}

function getTeamName(team) {
    if (!team) {
        return "Unnamed Team";
    }

    return (
        team.name ||
        team.teamName ||
        team.title ||
        team.teamTitle ||
        "Unnamed Team"
    );
}

// ============================================================
// MEMBER HELPERS
// ============================================================

function getMemberId(member) {
    if (!member) {
        return null;
    }

    return (
        member.id ??
        member.userId ??
        member.userID ??
        member.memberId ??
        member.memberID ??
        member.UserId ??
        member.UserID ??
        member.user?.id ??
        null
    );
}

function getMemberName(member) {
    if (!member) {
        return "Unnamed User";
    }

    const firstName =
        member.firstName ||
        member.user?.firstName ||
        "";

    const lastName =
        member.lastName ||
        member.user?.lastName ||
        "";

    const fullName =
        `${firstName} ${lastName}`.trim();

    return (
        member.fullName ||
        member.name ||
        member.displayName ||
        member.userName ||
        member.username ||
        member.user?.fullName ||
        member.user?.name ||
        fullName ||
        member.email ||
        member.user?.email ||
        "Unnamed User"
    );
}

function getMemberEmail(member) {
    if (!member) {
        return "";
    }

    return (
        member.email ||
        member.emailAddress ||
        member.user?.email ||
        member.user?.emailAddress ||
        ""
    );
}

// ============================================================
// ACTIVE MEMBER
// ============================================================

function isMemberActive(member) {
    if (!member) {
        return false;
    }

    const status = String(
        member.status ??
            member.accountStatus ??
            member.user?.status ??
            member.user?.accountStatus ??
            ""
    )
        .trim()
        .toLowerCase();

    if (
        status === "inactive" ||
        status === "disabled" ||
        status === "suspended" ||
        status === "deactivated"
    ) {
        return false;
    }

    if (
        member.isActive === false ||
        member.active === false ||
        member.user?.isActive === false ||
        member.user?.active === false
    ) {
        return false;
    }

    return true;
}

// ============================================================
// PROJECT RESPONSE
// ============================================================

function extractProjectList(result) {
    if (Array.isArray(result)) {
        return result;
    }

    if (Array.isArray(result?.projects)) {
        return result.projects;
    }

    if (Array.isArray(result?.data)) {
        return result.data;
    }

    if (Array.isArray(result?.items)) {
        return result.items;
    }

    if (Array.isArray(result?.data?.projects)) {
        return result.data.projects;
    }

    return [];
}

// ============================================================
// PRIORITY
// ============================================================

function normalizePriorityOptions(value) {
    if (!Array.isArray(value)) {
        return [];
    }

    return Array.from(
        new Map(
            value
                .map((item) => {
                    if (typeof item === "string") {
                        return {
                            value: item,
                            label: item,
                        };
                    }

                    if (
                        !item ||
                        typeof item !== "object"
                    ) {
                        return null;
                    }

                    const value =
                        item.value ??
                        item.id ??
                        item.name ??
                        item.code;

                    const label =
                        item.label ??
                        item.name ??
                        item.value ??
                        item.code;

                    if (
                        value === undefined ||
                        value === null ||
                        String(value).trim() === ""
                    ) {
                        return null;
                    }

                    return {
                        value,
                        label:
                            label ||
                            String(value),
                    };
                })
                .filter(Boolean)
                .map((item) => [
                    String(item.value),
                    item,
                ])
        ).values()
    );
}

// ============================================================
// TEAM RELATIONSHIP HELPERS
// ============================================================

function getTeamsFromProject(project) {
    if (!project) {
        return [];
    }

    const collections = [
        project.teams,
        project.projectTeams,
        project.assignedTeams,
        project.teamAssignments,
        project.projectTeamAssignments,
    ];

    for (const collection of collections) {
        if (Array.isArray(collection)) {
            return collection;
        }
    }

    if (
        project.team &&
        typeof project.team === "object"
    ) {
        return [project.team];
    }

    if (
        project.teamId !== undefined &&
        project.teamId !== null
    ) {
        return [
            {
                id: project.teamId,
                name:
                    project.teamName ||
                    "Project Team",
                members:
                    project.members ||
                    project.teamMembers ||
                    project.users ||
                    [],
            },
        ];
    }

    return [];
}

// ============================================================
// TEAM PROJECT HELPERS
// ============================================================

function getProjectsFromTeam(team) {
    if (!team) {
        return [];
    }

    const collections = [
        team.projects,
        team.assignedProjects,
        team.projectAssignments,
        team.projectTeams,
    ];

    for (const collection of collections) {
        if (Array.isArray(collection)) {
            return collection;
        }
    }

    return [];
}

// ============================================================
// TEAM MEMBER HELPERS
// ============================================================

function getMembersFromTeam(team) {
    if (!team) {
        return [];
    }

    const collections = [
        team.members,
        team.teamMembers,
        team.users,
        team.contributors,
        team.memberships,
        team.usersInTeam,
    ];

    for (const collection of collections) {
        if (Array.isArray(collection)) {
            return collection;
        }
    }

    return [];
}

// ============================================================
// CHECK WHETHER TEAM BELONGS TO PROJECT
// ============================================================

function teamBelongsToProject(team, project) {
    if (!team || !project) {
        return false;
    }

    const projectId =
        getProjectId(project);

    const projectName =
        getProjectName(project)
            .trim()
            .toLowerCase();

    const teamProjects =
        getProjectsFromTeam(team);

    if (teamProjects.length > 0) {
        const matchingProject =
            teamProjects.some((item) => {
                if (
                    item === null ||
                    item === undefined
                ) {
                    return false;
                }

                if (
                    typeof item !== "object"
                ) {
                    return (
                        String(item)
                            .trim()
                            .toLowerCase() ===
                        projectName
                    );
                }

                const itemId =
                    item.id ??
                    item.projectId ??
                    item.projectID ??
                    item.ProjectId ??
                    item.ProjectID;

                const itemName =
                    item.name ||
                    item.title ||
                    item.projectName ||
                    item.projectTitle;

                if (
                    itemId !== undefined &&
                    itemId !== null &&
                    projectId !== null &&
                    projectId !== undefined
                ) {
                    if (
                        String(itemId) ===
                        String(projectId)
                    ) {
                        return true;
                    }
                }

                if (
                    itemName &&
                    String(itemName)
                        .trim()
                        .toLowerCase() ===
                    projectName
                ) {
                    return true;
                }

                return false;
            });

        if (matchingProject) {
            return true;
        }
    }

    const projectIds = [
        team.projectId,
        team.projectID,
        team.ProjectId,
        team.ProjectID,
    ].filter(
        (value) =>
            value !== undefined &&
            value !== null
    );

    if (
        projectIds.some(
            (id) =>
                projectId !== null &&
                String(id) ===
                    String(projectId)
        )
    ) {
        return true;
    }

    const teamProjectName =
        team.projectName ||
        team.projectTitle;

    if (
        teamProjectName &&
        String(teamProjectName)
            .trim()
            .toLowerCase() ===
        projectName
    ) {
        return true;
    }

    const members =
        getMembersFromTeam(team);

    const memberHasProject =
        members.some((member) => {
            const assignedProjects =
                Array.isArray(
                    member.assignedProjects
                )
                    ? member.assignedProjects
                    : [];

            return assignedProjects.some(
                (assignedProject) => {
                    if (
                        assignedProject ===
                        null
                    ) {
                        return false;
                    }

                    if (
                        typeof assignedProject ===
                        "object"
                    ) {
                        const id =
                            assignedProject.id ??
                            assignedProject.projectId;

                        const name =
                            assignedProject.name ||
                            assignedProject.projectName;

                        if (
                            id !== undefined &&
                            projectId !== null &&
                            String(id) ===
                                String(projectId)
                        ) {
                            return true;
                        }

                        if (
                            name &&
                            String(name)
                                .trim()
                                .toLowerCase() ===
                            projectName
                        ) {
                            return true;
                        }

                        return false;
                    }

                    return (
                        String(
                            assignedProject
                        )
                            .trim()
                            .toLowerCase() ===
                        projectName
                    );
                }
            );
        });

    return memberHasProject;
}

// ============================================================
// COMPONENT
// ============================================================

function SendProjectAnnouncement({
    onClose,
    onSuccess,
}) {
    const currentUser = useMemo(() => {
        try {
            return getCurrentUser();
        } catch (error) {
            console.error(
                "Unable to get current user:",
                error
            );

            return null;
        }
    }, []);

    // ========================================================
    // PROJECTS
    // ========================================================

    const [projects, setProjects] =
        useState([]);

    const [loadingProjects, setLoadingProjects] =
        useState(true);

    // ========================================================
    // TEAMS
    // ========================================================

    const [allTeams, setAllTeams] =
        useState([]);

    const [loadingTeams, setLoadingTeams] =
        useState(true);

    // ========================================================
    // SELECTION
    // ========================================================

    const [
        selectedProjectId,
        setSelectedProjectId,
    ] = useState("");

    const [
        selectedTeamId,
        setSelectedTeamId,
    ] = useState("");

    const [
        selectedRecipientIds,
        setSelectedRecipientIds,
    ] = useState([]);

    // ========================================================
    // FORM
    // ========================================================

    const [title, setTitle] =
        useState("");

    const [message, setMessage] =
        useState("");

    const [priority, setPriority] =
        useState("High");

    // ========================================================
    // PRIORITIES
    // ========================================================

    const [
        priorityOptions,
        setPriorityOptions,
    ] = useState(
        DEFAULT_PRIORITY_OPTIONS
    );

    const [
        loadingPriorities,
        setLoadingPriorities,
    ] = useState(false);

    // ========================================================
    // STATUS
    // ========================================================

    const [sending, setSending] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    // ========================================================
    // LOAD PROJECTS
    // ========================================================

    const loadProjects = async () => {
        try {
            setLoadingProjects(true);

            const result =
                await getManagerProjects();

            const projectList =
                extractProjectList(result);

            const validProjects =
                projectList.filter(
                    (project) => {
                        const id =
                            getProjectId(
                                project
                            );

                        return (
                            id !== null &&
                            id !== undefined
                        );
                    }
                );

            setProjects(
                validProjects
            );

            if (
                validProjects.length > 0
            ) {
                setSelectedProjectId(
                    (current) => {
                        const stillExists =
                            validProjects.some(
                                (project) =>
                                    String(
                                        getProjectId(
                                            project
                                        )
                                    ) ===
                                    String(
                                        current
                                    )
                            );

                        if (
                            stillExists
                        ) {
                            return current;
                        }

                        return String(
                            getProjectId(
                                validProjects[0]
                            )
                        );
                    }
                );
            } else {
                setSelectedProjectId("");
            }
        } catch (err) {
            console.error(
                "Failed to load manager projects:",
                err
            );

            setProjects([]);

            setError(
                err?.message ||
                    "Unable to load your assigned projects."
            );
        } finally {
            setLoadingProjects(false);
        }
    };

    // ========================================================
    // LOAD TEAMS
    // ========================================================

    const loadTeams = () => {
        try {
            setLoadingTeams(true);

            const teamsFromProjects =
                projects.flatMap(
                    (project) =>
                        getTeamsFromProject(
                            project
                        )
                );

            const storedTeams =
                readFirstAvailableArray(
                    TEAM_STORAGE_KEYS
                );

            const combined = [
                ...teamsFromProjects,
                ...storedTeams,
            ];

            const validTeams =
                combined.filter(
                    (team) => {
                        const id =
                            getTeamId(team);

                        return (
                            id !== null &&
                            id !== undefined
                        );
                    }
                );

            const uniqueTeams =
                Array.from(
                    new Map(
                        validTeams.map(
                            (team) => [
                                String(
                                    getTeamId(
                                        team
                                    )
                                ),
                                team,
                            ]
                        )
                    ).values()
                );

            setAllTeams(
                uniqueTeams
            );
        } catch (err) {
            console.error(
                "Failed to load project teams:",
                err
            );

            setAllTeams([]);
        } finally {
            setLoadingTeams(false);
        }
    };

    // ========================================================
    // LOAD PRIORITIES
    // ========================================================

    const loadPriorities = () => {
        try {
            setLoadingPriorities(true);

            const configured =
                readFirstAvailableArray(
                    PRIORITY_STORAGE_KEYS
                );

            const normalized =
                normalizePriorityOptions(
                    configured
                );

            if (
                normalized.length > 0
            ) {
                setPriorityOptions(
                    normalized
                );

                setPriority(
                    (current) =>
                        normalized.some(
                            (option) =>
                                String(
                                    option.value
                                ) ===
                                String(
                                    current
                                )
                        )
                            ? current
                            : normalized[0]
                                  .value
                );
            } else {
                setPriorityOptions(
                    DEFAULT_PRIORITY_OPTIONS
                );
            }
        } catch (err) {
            console.error(
                "Failed to load priorities:",
                err
            );

            setPriorityOptions(
                DEFAULT_PRIORITY_OPTIONS
            );
        } finally {
            setLoadingPriorities(false);
        }
    };

    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {
        loadProjects();
        loadPriorities();
    }, []);

    // ========================================================
    // LOAD TEAMS AFTER PROJECTS
    // ========================================================

    useEffect(() => {
        loadTeams();
    }, [projects]);

    // ========================================================
    // SELECTED PROJECT
    // ========================================================

    const selectedProject = useMemo(() => {
        if (!selectedProjectId) {
            return null;
        }

        return (
            projects.find(
                (project) =>
                    String(
                        getProjectId(
                            project
                        )
                    ) ===
                    String(
                        selectedProjectId
                    )
            ) || null
        );
    }, [
        projects,
        selectedProjectId,
    ]);

    // ========================================================
    // PROJECT TEAMS
    // ========================================================

    const projectTeams = useMemo(() => {
        if (!selectedProject) {
            return [];
        }

        const directTeams =
            getTeamsFromProject(
                selectedProject
            );

        const relatedTeams =
            allTeams.filter(
                (team) =>
                    teamBelongsToProject(
                        team,
                        selectedProject
                    )
            );

        const combined = [
            ...directTeams,
            ...relatedTeams,
        ];

        const validTeams =
            combined.filter(
                (team) => {
                    const id =
                        getTeamId(team);

                    return (
                        id !== null &&
                        id !== undefined
                    );
                }
            );

        return Array.from(
            new Map(
                validTeams.map(
                    (team) => [
                        String(
                            getTeamId(
                                team
                            )
                        ),
                        team,
                    ]
                )
            ).values()
        );
    }, [
        selectedProject,
        allTeams,
    ]);

    // ========================================================
    // SELECTED TEAM
    // ========================================================

    const selectedTeam = useMemo(() => {
        if (!selectedTeamId) {
            return null;
        }

        return (
            projectTeams.find(
                (team) =>
                    String(
                        getTeamId(team)
                    ) ===
                    String(
                        selectedTeamId
                    )
            ) || null
        );
    }, [
        projectTeams,
        selectedTeamId,
    ]);

    // ========================================================
    // RECIPIENTS
    // ========================================================

    const recipients = useMemo(() => {
        if (!selectedTeam) {
            return [];
        }

        const members =
            getMembersFromTeam(
                selectedTeam
            );

        const activeMembers =
            members.filter(
                (member) => {
                    const id =
                        getMemberId(
                            member
                        );

                    if (
                        id === null ||
                        id === undefined
                    ) {
                        return false;
                    }

                    return isMemberActive(
                        member
                    );
                }
            );

        return Array.from(
            new Map(
                activeMembers.map(
                    (member) => [
                        String(
                            getMemberId(
                                member
                            )
                        ),
                        member,
                    ]
                )
            ).values()
        );
    }, [selectedTeam]);

    // ========================================================
    // AUTOMATIC TEAM SELECTION
    // ========================================================

    useEffect(() => {
        if (
            projectTeams.length === 0
        ) {
            setSelectedTeamId("");
            setSelectedRecipientIds([]);
            return;
        }

        setSelectedTeamId(
            (current) => {
                const exists =
                    projectTeams.some(
                        (team) =>
                            String(
                                getTeamId(
                                    team
                                )
                            ) ===
                            String(
                                current
                            )
                    );

                return exists
                    ? current
                    : String(
                          getTeamId(
                              projectTeams[0]
                          )
                      );
            }
        );
    }, [projectTeams]);

    // ========================================================
    // SELECTED RECIPIENT COUNT
    // ========================================================

    const selectedRecipientCount =
        selectedRecipientIds.length;

    // ========================================================
    // PROJECT CHANGE
    // ========================================================

    const handleProjectChange = (
        event
    ) => {
        const projectId =
            event.target.value;

        setSelectedProjectId(
            projectId
        );

        setSelectedTeamId("");
        setSelectedRecipientIds([]);

        setError("");
        setSuccess("");
    };

    // ========================================================
    // TEAM CHANGE
    // ========================================================

    const handleTeamChange = (
        event
    ) => {
        const teamId =
            event.target.value;

        setSelectedTeamId(
            teamId
        );

        setSelectedRecipientIds([]);

        setError("");
        setSuccess("");
    };

    // ========================================================
    // RECIPIENT TOGGLE
    // ========================================================

    const handleRecipientToggle = (
        memberId
    ) => {
        if (
            memberId === null ||
            memberId === undefined
        ) {
            return;
        }

        setSelectedRecipientIds(
            (current) => {
                const id =
                    String(memberId);

                const exists =
                    current.some(
                        (item) =>
                            String(
                                item
                            ) === id
                    );

                if (exists) {
                    return current.filter(
                        (item) =>
                            String(
                                item
                            ) !== id
                    );
                }

                return [
                    ...current,
                    memberId,
                ];
            }
        );

        setError("");
        setSuccess("");
    };

    // ========================================================
    // SELECT ALL
    // ========================================================

    const handleSelectAll = () => {
        const ids =
            recipients
                .map(
                    getMemberId
                )
                .filter(
                    (id) =>
                        id !== null &&
                        id !== undefined
                );

        setSelectedRecipientIds(
            ids
        );

        setError("");
        setSuccess("");
    };

    // ========================================================
    // CLEAR
    // ========================================================

    const handleClearRecipients =
        () => {
            setSelectedRecipientIds(
                []
            );

            setError("");
            setSuccess("");
        };

    // ========================================================
    // VALIDATION
    // ========================================================

    const validateForm = () => {
        if (!currentUser) {
            return (
                "You must be signed in to send a project announcement."
            );
        }

        if (!selectedProject) {
            return "Please select a project.";
        }

        if (
            projectTeams.length === 0
        ) {
            return (
                "No authorized team is currently assigned to this project."
            );
        }

        if (!selectedTeam) {
            return "Please select a project team.";
        }

        if (recipients.length === 0) {
            return (
                "No active recipients are available in the selected team."
            );
        }

        if (
            selectedRecipientIds.length ===
            0
        ) {
            return (
                "Please select at least one recipient."
            );
        }

        if (!title.trim()) {
            return (
                "Please enter an announcement title."
            );
        }

        if (
            title.trim().length > 200
        ) {
            return (
                "Announcement title cannot exceed 200 characters."
            );
        }

        if (!message.trim()) {
            return (
                "Please enter an announcement message."
            );
        }

        if (
            message.trim().length > 5000
        ) {
            return (
                "Announcement message cannot exceed 5000 characters."
            );
        }

        if (!priority) {
            return (
                "Please select an announcement priority."
            );
        }

        const validPriority =
            priorityOptions.some(
                (option) =>
                    String(
                        option.value
                    ) ===
                    String(priority)
            );

        if (!validPriority) {
            return (
                "The selected announcement priority is not valid."
            );
        }

        const authorizedIds =
            recipients.map(
                getMemberId
            );

        const unauthorized =
            selectedRecipientIds.some(
                (id) =>
                    !authorizedIds.some(
                        (authorizedId) =>
                            String(
                                authorizedId
                            ) ===
                            String(id)
                    )
            );

        if (unauthorized) {
            return (
                "One or more selected recipients are not authorized for this project team."
            );
        }

        return null;
    };

    // ========================================================
    // SAVE ANNOUNCEMENT
    // ========================================================

    const saveAnnouncement = (
        announcement
    ) => {
        const announcements =
            readStorageArray(
                ANNOUNCEMENTS_KEY
            );

        announcements.unshift(
            announcement
        );

        writeStorageArray(
            ANNOUNCEMENTS_KEY,
            announcements
        );
    };

    // ========================================================
    // ACTIVITY LOG
    // ========================================================

    const createActivityLog = ({
        project,
        team,
        recipientIds,
        announcement,
    }) => {
        const logs =
            readStorageArray(
                ACTIVITY_KEY
            );

        logs.unshift({
            id: createId(
                "activity"
            ),

            action:
                "PROJECT_ANNOUNCEMENT_SENT",

            type:
                "PROJECT_ANNOUNCEMENT",

            title:
                announcement.title,

            details:
                `Project announcement "${announcement.title}" was sent to ${recipientIds.length} recipient(s) in ${getTeamName(team)}.`,

            projectId:
                getProjectId(
                    project
                ),

            projectName:
                getProjectName(
                    project
                ),

            teamId:
                getTeamId(team),

            teamName:
                getTeamName(team),

            recipientIds:
                [...recipientIds],

            performedBy:
                currentUser?.fullName ||
                currentUser?.name ||
                currentUser?.username ||
                currentUser?.email ||
                "Manager",

            performedByUserId:
                currentUser?.id ||
                currentUser?.userId ||
                null,

            createdAt:
                new Date().toISOString(),
        });

        writeStorageArray(
            ACTIVITY_KEY,
            logs
        );
    };

    // ========================================================
    // SUBMIT
    // ========================================================

    const handleSubmit = async (
        event
    ) => {
        event.preventDefault();

        if (sending) {
            return;
        }

        setError("");
        setSuccess("");

        const validationError =
            validateForm();

        if (validationError) {
            setError(
                validationError
            );

            return;
        }

        try {
            setSending(true);

            const authorizedRecipients =
                recipients.filter(
                    (member) =>
                        selectedRecipientIds.some(
                            (id) =>
                                String(
                                    id
                                ) ===
                                String(
                                    getMemberId(
                                        member
                                    )
                                )
                        )
                );

            if (
                authorizedRecipients.length !==
                selectedRecipientIds.length
            ) {
                throw new Error(
                    "Recipient authorization changed. Please select the recipients again."
                );
            }

            const announcement = {
                id: createId(
                    "announcement"
                ),

                projectId:
                    getProjectId(
                        selectedProject
                    ),

                projectName:
                    getProjectName(
                        selectedProject
                    ),

                teamId:
                    getTeamId(
                        selectedTeam
                    ),

                teamName:
                    getTeamName(
                        selectedTeam
                    ),

                recipientIds:
                    [...selectedRecipientIds],

                recipients:
                    authorizedRecipients.map(
                        (member) => ({
                            id:
                                getMemberId(
                                    member
                                ),

                            name:
                                getMemberName(
                                    member
                                ),

                            email:
                                getMemberEmail(
                                    member
                                ),
                        })
                    ),

                title:
                    title.trim(),

                message:
                    message.trim(),

                priority,

                senderId:
                    currentUser?.id ||
                    currentUser?.userId ||
                    null,

                senderName:
                    currentUser?.fullName ||
                    currentUser?.name ||
                    currentUser?.username ||
                    currentUser?.email ||
                    "Manager",

                createdAt:
                    new Date().toISOString(),

                status: "Sent",
            };

            saveAnnouncement(
                announcement
            );

            createActivityLog({
                project:
                    selectedProject,

                team:
                    selectedTeam,

                recipientIds:
                    selectedRecipientIds,

                announcement,
            });

            setSuccess(
                `Project announcement sent successfully to ${selectedRecipientIds.length} recipient${
                    selectedRecipientIds.length ===
                    1
                        ? ""
                        : "s"
                }.`
            );

            if (
                typeof onSuccess ===
                "function"
            ) {
                onSuccess(
                    announcement
                );
            }

            setTitle("");
            setMessage("");
            setSelectedRecipientIds([]);
        } catch (err) {
            console.error(
                "Send project announcement error:",
                err
            );

            setError(
                err?.message ||
                    "The announcement could not be sent."
            );
        } finally {
            setSending(false);
        }
    };

    // ========================================================
    // RESET
    // ========================================================

    const handleReset = () => {
        setSelectedProjectId("");
        setSelectedTeamId("");
        setSelectedRecipientIds([]);

        setTitle("");
        setMessage("");

        setPriority(
            priorityOptions.length > 0
                ? priorityOptions[0].value
                : "High"
        );

        setError("");
        setSuccess("");
    };

    // ========================================================
    // REFRESH
    // ========================================================

    const handleRefresh = async () => {
        if (sending) {
            return;
        }

        setError("");
        setSuccess("");

        await loadProjects();
        loadPriorities();
    };

    // ========================================================
    // CLOSE
    // ========================================================

    const handleClose = () => {
        if (sending) {
            return;
        }

        if (
            typeof onClose ===
            "function"
        ) {
            onClose();
        }
    };

    // ========================================================
    // PRIORITY STYLING
    // ========================================================

    const getPriorityClasses = (
        value
    ) => {
        const normalized =
            String(value)
                .toLowerCase();

        if (
            normalized === "high"
        ) {
            return "border-red-200 bg-red-50 text-red-700";
        }

        if (
            normalized === "medium"
        ) {
            return "border-amber-200 bg-amber-50 text-amber-700";
        }

        if (
            normalized === "low"
        ) {
            return "border-emerald-200 bg-emerald-50 text-emerald-700";
        }

        return "border-slate-200 bg-white text-slate-700";
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="min-h-full bg-white px-4 py-6 md:px-8 md:py-8">
            <div className="mx-auto max-w-5xl">

                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="mb-8 flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-200">
                            <Megaphone className="h-7 w-7" />
                        </div>

                        <div>
                            <div className="mb-1 flex items-center gap-2">
                                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                                    COMM-005
                                </span>

                                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                    Manager
                                </span>
                            </div>

                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                Send Project Announcement
                            </h1>

                            <p className="mt-1 text-sm text-slate-500">
                                Send an important announcement to authorized project team members.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={
                                handleRefresh
                            }
                            disabled={
                                sending ||
                                loadingProjects ||
                                loadingTeams
                            }
                            className="gap-2 border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                        >
                            <RefreshCw
                                className={`h-4 w-4 ${
                                    loadingProjects ||
                                    loadingTeams
                                        ? "animate-spin"
                                        : ""
                                }`}
                            />

                            Refresh
                        </Button>

                        {onClose && (
                            <button
                                type="button"
                                onClick={
                                    handleClose
                                }
                                disabled={
                                    sending
                                }
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed"
                                aria-label="Close"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                </div>

                {/* ==================================================
                    INFORMATION
                ================================================== */}

                <div className="mb-6 overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 via-indigo-50 to-violet-50">
                    <div className="flex gap-4 p-5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                            <Info className="h-5 w-5" />
                        </div>

                        <div>
                            <p className="font-bold text-blue-900">
                                Project announcement
                            </p>

                            <p className="mt-1 text-sm leading-6 text-blue-700">
                                Announcements are sent only to recipients who belong to the selected authorized project team.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ==================================================
                    ERROR
                ================================================== */}

                {error && (
                    <div className="mb-6 flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                        </div>

                        <div className="pt-1">
                            <p className="font-semibold">
                                Unable to send announcement
                            </p>

                            <p className="mt-1">
                                {error}
                            </p>
                        </div>
                    </div>
                )}

                {/* ==================================================
                    SUCCESS
                ================================================== */}

                {success && (
                    <div className="mb-6 flex gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        </div>

                        <div className="pt-1">
                            <p className="font-semibold">
                                Announcement sent
                            </p>

                            <p className="mt-1">
                                {success}
                            </p>
                        </div>
                    </div>
                )}

                <form
                    onSubmit={
                        handleSubmit
                    }
                    className="space-y-6"
                >
                    {/* ==================================================
                        PROJECT + TEAM
                    ================================================== */}

                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                                    <FolderKanban className="h-5 w-5" />
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">
                                        Project & Team
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Select the authorized project and team receiving the announcement.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-5 p-6 md:grid-cols-2">
                            {/* PROJECT */}

                            <div>
                                <label
                                    htmlFor="announcement-project"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Project
                                    <span className="ml-1 text-red-500">
                                        *
                                    </span>
                                </label>

                                <select
                                    id="announcement-project"
                                    value={
                                        selectedProjectId
                                    }
                                    onChange={
                                        handleProjectChange
                                    }
                                    disabled={
                                        loadingProjects ||
                                        sending
                                    }
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                                >
                                    <option value="">
                                        {loadingProjects
                                            ? "Loading projects..."
                                            : projects.length ===
                                              0
                                            ? "No assigned projects"
                                            : "Select a project"}
                                    </option>

                                    {projects.map(
                                        (
                                            project
                                        ) => {
                                            const id =
                                                getProjectId(
                                                    project
                                                );

                                            return (
                                                <option
                                                    key={String(
                                                        id
                                                    )}
                                                    value={
                                                        id
                                                    }
                                                >
                                                    {getProjectName(
                                                        project
                                                    )}
                                                </option>
                                            );
                                        }
                                    )}
                                </select>
                            </div>

                            {/* TEAM */}

                            <div>
                                <label
                                    htmlFor="announcement-team"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Project Team
                                    <span className="ml-1 text-red-500">
                                        *
                                    </span>
                                </label>

                                <select
                                    id="announcement-team"
                                    value={
                                        selectedTeamId
                                    }
                                    onChange={
                                        handleTeamChange
                                    }
                                    disabled={
                                        !selectedProjectId ||
                                        projectTeams.length ===
                                            0 ||
                                        sending
                                    }
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                                >
                                    <option value="">
                                        {!selectedProjectId
                                            ? "Select a project first"
                                            : loadingTeams
                                            ? "Loading teams..."
                                            : projectTeams.length ===
                                              0
                                            ? "No team assigned"
                                            : "Select a team"}
                                    </option>

                                    {projectTeams.map(
                                        (
                                            team
                                        ) => {
                                            const id =
                                                getTeamId(
                                                    team
                                                );

                                            return (
                                                <option
                                                    key={String(
                                                        id
                                                    )}
                                                    value={
                                                        id
                                                    }
                                                >
                                                    {getTeamName(
                                                        team
                                                    )}
                                                </option>
                                            );
                                        }
                                    )}
                                </select>

                                {selectedProject &&
                                    projectTeams.length >
                                        0 && (
                                        <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
                                            <ShieldCheck className="h-4 w-4" />

                                            <span>
                                                {
                                                    projectTeams.length
                                                }{" "}
                                                authorized team
                                                {projectTeams.length ===
                                                1
                                                    ? ""
                                                    : "s"}{" "}
                                                available.
                                            </span>
                                        </div>
                                    )}
                            </div>
                        </div>
                    </section>

                    {/* ==================================================
                        RECIPIENTS
                    ================================================== */}

                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-5">
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                                        <Users className="h-5 w-5" />
                                    </div>

                                    <div>
                                        <h2 className="text-lg font-bold text-slate-900">
                                            Recipients
                                        </h2>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Select authorized team members who should receive this announcement.
                                        </p>
                                    </div>
                                </div>

                                {recipients.length >
                                    0 && (
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={
                                                handleSelectAll
                                            }
                                            disabled={
                                                sending
                                            }
                                            className="border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50"
                                        >
                                            Select All
                                        </Button>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={
                                                handleClearRecipients
                                            }
                                            disabled={
                                                sending
                                            }
                                            className="border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
                                        >
                                            Clear
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-6">
                            {!selectedTeamId ? (
                                <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-10 text-center">
                                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                                        <Users className="h-7 w-7" />
                                    </div>

                                    <p className="text-sm font-semibold text-slate-700">
                                        Select a project team to view recipients.
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        Only authorized members of the selected team can receive the announcement.
                                    </p>
                                </div>
                            ) : recipients.length ===
                              0 ? (
                                <div className="rounded-2xl border-2 border-dashed border-amber-200 bg-amber-50 p-10 text-center">
                                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                                        <Users className="h-7 w-7" />
                                    </div>

                                    <p className="text-sm font-semibold text-amber-800">
                                        No valid recipients available.
                                    </p>

                                    <p className="mt-1 text-xs text-amber-700">
                                        The selected team currently has no active members.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                                            <UserCheck className="h-4 w-4 text-emerald-600" />

                                            <span>
                                                {
                                                    recipients.length
                                                }{" "}
                                                active team member
                                                {recipients.length ===
                                                1
                                                    ? ""
                                                    : "s"}
                                            </span>
                                        </div>

                                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                            {
                                                selectedRecipientCount
                                            }{" "}
                                            selected
                                        </span>
                                    </div>

                                    <div className="grid gap-3 sm:grid-cols-2">
                                        {recipients.map(
                                            (
                                                member
                                            ) => {
                                                const memberId =
                                                    getMemberId(
                                                        member
                                                    );

                                                const checked =
                                                    selectedRecipientIds.some(
                                                        (
                                                            id
                                                        ) =>
                                                            String(
                                                                id
                                                            ) ===
                                                            String(
                                                                memberId
                                                            )
                                                    );

                                                return (
                                                    <label
                                                        key={String(
                                                            memberId
                                                        )}
                                                        className={`group flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                                                            checked
                                                                ? "border-blue-400 bg-blue-50 shadow-sm"
                                                                : "border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50"
                                                        }`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                checked
                                                            }
                                                            onChange={() =>
                                                                handleRecipientToggle(
                                                                    memberId
                                                                )
                                                            }
                                                            disabled={
                                                                sending
                                                            }
                                                            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                        />

                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-sm font-bold text-blue-700">
                                                            {getMemberName(
                                                                member
                                                            )
                                                                .charAt(
                                                                    0
                                                                )
                                                                .toUpperCase()}
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p className="truncate text-sm font-semibold text-slate-900">
                                                                {getMemberName(
                                                                    member
                                                                )}
                                                            </p>

                                                            {getMemberEmail(
                                                                member
                                                            ) && (
                                                                <p className="truncate text-xs text-slate-500">
                                                                    {getMemberEmail(
                                                                        member
                                                                    )}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </label>
                                                );
                                            }
                                        )}
                                    </div>
                                </>
                            )}

                            {selectedRecipientCount >
                                0 && (
                                <div className="mt-5 flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">
                                    <CheckCircle2 className="h-4 w-4" />

                                    {
                                        selectedRecipientCount
                                    }{" "}
                                    recipient
                                    {selectedRecipientCount ===
                                    1
                                        ? ""
                                        : "s"}{" "}
                                    selected.
                                </div>
                            )}
                        </div>
                    </section>

                    {/* ==================================================
                        ANNOUNCEMENT DETAILS
                    ================================================== */}

                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-100 bg-gradient-to-r from-violet-50 to-fuchsia-50 px-6 py-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                                    <Megaphone className="h-5 w-5" />
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">
                                        Announcement Details
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Provide the information that should be communicated to the selected recipients.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 p-6">
                            {/* TITLE */}

                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <label
                                        htmlFor="announcement-title"
                                        className="block text-sm font-semibold text-slate-700"
                                    >
                                        Announcement Title
                                        <span className="ml-1 text-red-500">
                                            *
                                        </span>
                                    </label>

                                    <span
                                        className={`text-xs font-medium ${
                                            title.length >=
                                            180
                                                ? "text-red-500"
                                                : "text-slate-400"
                                        }`}
                                    >
                                        {title.length}/200
                                    </span>
                                </div>

                                <input
                                    id="announcement-title"
                                    type="text"
                                    value={title}
                                    onChange={(
                                        event
                                    ) =>
                                        setTitle(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    maxLength={
                                        200
                                    }
                                    placeholder="Enter announcement title"
                                    disabled={
                                        sending
                                    }
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                                />
                            </div>

                            {/* PRIORITY */}

                            <div>
                                <label
                                    htmlFor="announcement-priority"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Priority
                                    <span className="ml-1 text-red-500">
                                        *
                                    </span>
                                </label>

                                <select
                                    id="announcement-priority"
                                    value={
                                        priority
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setPriority(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    disabled={
                                        loadingPriorities ||
                                        sending
                                    }
                                    className={`w-full rounded-xl border px-4 py-3 text-sm font-medium shadow-sm outline-none transition focus:ring-4 disabled:cursor-not-allowed disabled:bg-slate-100 ${getPriorityClasses(
                                        priority
                                    )}`}
                                >
                                    <option value="">
                                        Select priority
                                    </option>

                                    {priorityOptions.map(
                                        (
                                            option
                                        ) => (
                                            <option
                                                key={String(
                                                    option.value
                                                )}
                                                value={
                                                    option.value
                                                }
                                            >
                                                {
                                                    option.label
                                                }
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            {/* MESSAGE */}

                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <label
                                        htmlFor="announcement-message"
                                        className="block text-sm font-semibold text-slate-700"
                                    >
                                        Message
                                        <span className="ml-1 text-red-500">
                                            *
                                        </span>
                                    </label>

                                    <span
                                        className={`text-xs font-medium ${
                                            message.length >=
                                            4500
                                                ? "text-red-500"
                                                : "text-slate-400"
                                        }`}
                                    >
                                        {
                                            message.length
                                        }
                                        /5000
                                    </span>
                                </div>

                                <textarea
                                    id="announcement-message"
                                    value={
                                        message
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setMessage(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    rows={8}
                                    maxLength={
                                        5000
                                    }
                                    placeholder="Write the project announcement..."
                                    disabled={
                                        sending
                                    }
                                    className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                                />
                            </div>
                        </div>
                    </section>

                    {/* ==================================================
                        SUMMARY
                    ================================================== */}

                    {selectedProject &&
                        selectedTeam && (
                            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <div className="border-b border-slate-100 bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4">
                                    <h3 className="text-sm font-bold text-slate-900">
                                        Announcement Summary
                                    </h3>
                                </div>

                                <div className="grid gap-4 p-6 sm:grid-cols-3">
                                    <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                                        <p className="text-xs font-medium text-blue-600">
                                            Project
                                        </p>

                                        <p className="mt-1 truncate text-sm font-bold text-slate-900">
                                            {getProjectName(
                                                selectedProject
                                            )}
                                        </p>
                                    </div>

                                    <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                                        <p className="text-xs font-medium text-emerald-600">
                                            Team
                                        </p>

                                        <p className="mt-1 truncate text-sm font-bold text-slate-900">
                                            {getTeamName(
                                                selectedTeam
                                            )}
                                        </p>
                                    </div>

                                    <div className="rounded-xl border border-violet-100 bg-violet-50 p-4">
                                        <p className="text-xs font-medium text-violet-600">
                                            Recipients
                                        </p>

                                        <p className="mt-1 text-xl font-bold text-slate-900">
                                            {
                                                selectedRecipientCount
                                            }
                                        </p>
                                    </div>
                                </div>
                            </section>
                        )}

                    {/* ==================================================
                        ACTIONS
                    ================================================== */}

                    <div className="flex flex-col-reverse gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={
                                handleReset
                            }
                            disabled={
                                sending
                            }
                            className="gap-2 border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                        >
                            <RotateCcw className="h-4 w-4" />
                            Reset
                        </Button>

                        {onClose && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={
                                    handleClose
                                }
                                disabled={
                                    sending
                                }
                                className="border-slate-300 bg-white text-slate-700 hover:bg-red-50 hover:text-red-600"
                            >
                                Cancel
                            </Button>
                        )}

                        <Button
                            type="submit"
                            disabled={
                                sending ||
                                loadingProjects ||
                                loadingTeams ||
                                loadingPriorities
                            }
                            className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-200 transition hover:from-blue-700 hover:to-indigo-700"
                        >
                            {sending ? (
                                <>
                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send className="h-4 w-4" />
                                    Send Announcement
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SendProjectAnnouncement;

