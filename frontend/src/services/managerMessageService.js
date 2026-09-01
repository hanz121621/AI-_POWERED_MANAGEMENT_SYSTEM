// ============================================================
// AIPMS MANAGER MESSAGE SERVICE
// COMM-002 — Send Message to Team Leader
//
// Manager
//   ↓
// Project
//   ↓
// Team
//   ↓
// Team Leader
//   ↓
// Message
//   ↓
// Team Leader Notification
// ============================================================

const USERS_KEY = "aipms_users";
const CURRENT_USER_KEY = "aipms_current_user";
const LEGACY_CURRENT_USER_KEY = "currentUser";

const PROJECT_KEYS = [
    "aipms_projects",
    "projects",
];

const TEAM_KEYS = [
    "aipms_teams",
    "teams",
];

const MESSAGES_KEY =
    "aipms_manager_teamleader_messages";

const NOTIFICATIONS_KEY =
    "aipms_notifications";

const TEAM_LEADER_NOTIFICATION_KEY =
    "aipms_team_leader_notifications";

// ============================================================
// SAFE STORAGE
// ============================================================

function readArray(key) {
    try {
        const raw =
            localStorage.getItem(key);

        if (!raw) {
            return [];
        }

        const parsed =
            JSON.parse(raw);

        return Array.isArray(parsed)
            ? parsed
            : [];
    } catch (error) {
        console.error(
            `Unable to read ${key}:`,
            error
        );

        return [];
    }
}

function writeArray(key, value) {
    try {
        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

        return true;
    } catch (error) {
        console.error(
            `Unable to write ${key}:`,
            error
        );

        return false;
    }
}

// ============================================================
// NORMALIZATION
// ============================================================

function normalizeId(value) {
    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value).trim();
}

function getName(item) {
    if (!item) {
        return "";
    }

    return (
        item.fullName ||
        item.name ||
        item.userName ||
        item.username ||
        item.displayName ||
        item.title ||
        ""
    );
}

function getEmail(item) {
    if (!item) {
        return "";
    }

    return (
        item.email ||
        item.userEmail ||
        ""
    );
}

// ============================================================
// CURRENT USER
// ============================================================

export function getCurrentManager() {
    let currentUser = null;

    try {
        const raw =
            localStorage.getItem(
                CURRENT_USER_KEY
            );

        if (raw) {
            currentUser =
                JSON.parse(raw);
        }
    } catch {
        currentUser = null;
    }

    if (!currentUser) {
        try {
            const raw =
                localStorage.getItem(
                    LEGACY_CURRENT_USER_KEY
                );

            if (raw) {
                currentUser =
                    JSON.parse(raw);
            }
        } catch {
            currentUser = null;
        }
    }

    if (!currentUser) {
        return null;
    }

    const role =
        String(
            currentUser.role ||
            currentUser.accountCategory ||
            ""
        )
            .trim()
            .toLowerCase();

    if (
        role !== "manager" &&
        role !== "project manager" &&
        role !== "department manager" &&
        role !== "team manager"
    ) {
        /*
         * Some existing AIPMS users may have:
         *
         * role = "Manager"
         * accountCategory = "Manager"
         *
         * We don't reject a user if their
         * accountCategory confirms Manager.
         */
        const category =
            String(
                currentUser.accountCategory ||
                ""
            )
                .trim()
                .toLowerCase();

        if (category !== "manager") {
            return null;
        }
    }

    return currentUser;
}

// ============================================================
// USERS
// ============================================================

function getAllUsers() {
    return readArray(USERS_KEY);
}

// ============================================================
// PROJECTS
// ============================================================

function getAllProjects() {
    for (const key of PROJECT_KEYS) {
        const projects =
            readArray(key);

        if (projects.length > 0) {
            return projects;
        }
    }

    return [];
}

// ============================================================
// TEAMS
// ============================================================

function getAllTeams() {
    for (const key of TEAM_KEYS) {
        const teams =
            readArray(key);

        if (teams.length > 0) {
            return teams;
        }
    }

    return [];
}

// ============================================================
// FIND VALUE
// ============================================================

function firstValue(
    object,
    keys
) {
    if (!object) {
        return null;
    }

    for (const key of keys) {
        if (
            object[key] !==
                undefined &&
            object[key] !== null &&
            String(object[key]).trim() !== ""
        ) {
            return object[key];
        }
    }

    return null;
}

// ============================================================
// PROJECT MANAGER MATCHING
// ============================================================

function projectBelongsToManager(
    project,
    manager
) {
    if (!project || !manager) {
        return false;
    }

    const managerId =
        normalizeId(manager.id);

    const managerEmail =
        String(
            manager.email || ""
        )
            .trim()
            .toLowerCase();

    const projectManagerId =
        firstValue(project, [
            "managerId",
            "projectManagerId",
            "assignedManagerId",
            "managerUserId",
            "projectManagerUserId",
        ]);

    if (
        projectManagerId !== null &&
        managerId
    ) {
        if (
            normalizeId(
                projectManagerId
            ) === managerId
        ) {
            return true;
        }
    }

    const projectManagerEmail =
        firstValue(project, [
            "managerEmail",
            "projectManagerEmail",
            "assignedManagerEmail",
        ]);

    if (
        projectManagerEmail &&
        managerEmail
    ) {
        if (
            String(
                projectManagerEmail
            )
                .trim()
                .toLowerCase() ===
            managerEmail
        ) {
            return true;
        }
    }

    const projectManager =
        project.manager ||
        project.projectManager ||
        project.assignedManager;

    if (
        projectManager &&
        typeof projectManager ===
            "object"
    ) {
        const nestedId =
            normalizeId(
                projectManager.id ||
                projectManager.userId
            );

        const nestedEmail =
            String(
                projectManager.email ||
                ""
            )
                .trim()
                .toLowerCase();

        if (
            nestedId &&
            nestedId === managerId
        ) {
            return true;
        }

        if (
            nestedEmail &&
            nestedEmail === managerEmail
        ) {
            return true;
        }
    }

    /*
     * Some existing frontend project objects
     * store the manager directly as a string.
     */

    if (
        typeof project.manager ===
        "string"
    ) {
        const value =
            project.manager
                .trim()
                .toLowerCase();

        if (
            value ===
                managerEmail ||
            value ===
                String(
                    getName(manager)
                )
                    .trim()
                    .toLowerCase()
        ) {
            return true;
        }
    }

    if (
        typeof project.projectManager ===
        "string"
    ) {
        const value =
            project.projectManager
                .trim()
                .toLowerCase();

        if (
            value ===
                managerEmail ||
            value ===
                String(
                    getName(manager)
                )
                    .trim()
                    .toLowerCase()
        ) {
            return true;
        }
    }

    return false;
}

// ============================================================
// GET MANAGER PROJECTS
// ============================================================

export function getManagerProjects(
    manager
) {
    if (!manager) {
        return [];
    }

    const projects =
        getAllProjects();

    /*
     * First use actual manager relationships.
     */

    const assignedProjects =
        projects.filter((project) =>
            projectBelongsToManager(
                project,
                manager
            )
        );

    if (
        assignedProjects.length > 0
    ) {
        return assignedProjects;
    }

    /*
     * If the current project structure uses
     * manager.projects or manager.projectIds,
     * resolve them.
     */

    const managerProjectIds =
        Array.isArray(
            manager.projectIds
        )
            ? manager.projectIds.map(
                  normalizeId
              )
            : [];

    if (
        managerProjectIds.length > 0
    ) {
        return projects.filter(
            (project) =>
                managerProjectIds.includes(
                    normalizeId(
                        project.id
                    )
                )
        );
    }

    /*
     * Do NOT expose another manager's
     * projects.
     */

    return [];
}

// ============================================================
// PROJECT TEAM ID
// ============================================================

function getProjectTeamId(
    project
) {
    return firstValue(project, [
        "teamId",
        "assignedTeamId",
        "projectTeamId",
    ]);
}

// ============================================================
// PROJECT TEAM
// ============================================================

function getProjectTeam(
    project
) {
    const teams =
        getAllTeams();

    const teamId =
        getProjectTeamId(project);

    if (teamId) {
        const found =
            teams.find(
                (team) =>
                    normalizeId(
                        team.id
                    ) ===
                    normalizeId(teamId)
            );

        if (found) {
            return found;
        }
    }

    /*
     * Some project objects embed the team.
     */

    const embeddedTeam =
        project.team ||
        project.assignedTeam;

    if (
        embeddedTeam &&
        typeof embeddedTeam ===
            "object"
    ) {
        return embeddedTeam;
    }

    return null;
}

// ============================================================
// TEAM LEADER CHECK
// ============================================================

function isTeamLeader(user) {
    if (!user) {
        return false;
    }

    const role =
        String(
            user.role ||
            ""
        )
            .trim()
            .toLowerCase();

    const contributorType =
        String(
            user.contributorType ||
            user.accountCategory ||
            ""
        )
            .trim()
            .toLowerCase();

    const contributorSubType =
        String(
            user.contributorSubType ||
            user.contributorSubtype ||
            ""
        )
            .trim()
            .toLowerCase();

    return (
        role === "team leader" ||
        contributorType === "team leader" ||
        contributorSubType ===
            "team leader"
    );
}

// ============================================================
// FIND TEAM LEADER FROM TEAM
// ============================================================

function getTeamLeaderFromTeam(
    team,
    users
) {
    if (!team) {
        return null;
    }

    /*
     * 1. teamLeaderId
     */

    const leaderId =
        firstValue(team, [
            "teamLeaderId",
            "leaderId",
            "teamLeaderUserId",
            "leaderUserId",
        ]);

    if (leaderId) {
        const user =
            users.find(
                (item) =>
                    normalizeId(
                        item.id
                    ) ===
                    normalizeId(
                        leaderId
                    )
            );

        if (
            user &&
            isTeamLeader(user)
        ) {
            return user;
        }
    }

    /*
     * 2. teamLeader object
     */

    const embeddedLeader =
        team.teamLeader ||
        team.leader;

    if (
        embeddedLeader &&
        typeof embeddedLeader ===
            "object"
    ) {
        return embeddedLeader;
    }

    /*
     * 3. teamLeader stored as email
     */

    const leaderEmail =
        firstValue(team, [
            "teamLeaderEmail",
            "leaderEmail",
        ]);

    if (leaderEmail) {
        const user =
            users.find(
                (item) =>
                    String(
                        item.email || ""
                    )
                        .trim()
                        .toLowerCase() ===
                    String(
                        leaderEmail
                    )
                        .trim()
                        .toLowerCase()
            );

        if (user) {
            return user;
        }
    }

    /*
     * 4. Team members
     */

    const members =
        Array.isArray(team.members)
            ? team.members
            : [];

    for (const member of members) {
        if (
            isTeamLeader(member)
        ) {
            const memberId =
                member.id ||
                member.userId;

            if (memberId) {
                const actualUser =
                    users.find(
                        (user) =>
                            normalizeId(
                                user.id
                            ) ===
                            normalizeId(
                                memberId
                            )
                    );

                if (actualUser) {
                    return actualUser;
                }
            }

            return member;
        }
    }

    /*
     * 5. Search all users by team ID.
     */

    const teamId =
        normalizeId(team.id);

    const matchingUser =
        users.find((user) => {
            if (
                !isTeamLeader(user)
            ) {
                return false;
            }

            const userTeamId =
                firstValue(user, [
                    "teamId",
                    "assignedTeamId",
                ]);

            return (
                userTeamId &&
                normalizeId(
                    userTeamId
                ) === teamId
            );
        });

    return (
        matchingUser ||
        null
    );
}

// ============================================================
// GET TEAM LEADERS FOR PROJECT
// ============================================================

export function getProjectTeamLeaders(
    projectId
) {
    const projects =
        getAllProjects();

    const project =
        projects.find(
            (item) =>
                normalizeId(
                    item.id
                ) ===
                normalizeId(
                    projectId
                )
        );

    if (!project) {
        return [];
    }

    const teams =
        getAllTeams();

    const users =
        getAllUsers();

    const team =
        getProjectTeam(project);

    /*
     * If project has team ID but teams
     * are stored separately.
     */

    let resolvedTeam = team;

    if (!resolvedTeam) {
        const teamId =
            getProjectTeamId(project);

        if (teamId) {
            resolvedTeam =
                teams.find(
                    (item) =>
                        normalizeId(
                            item.id
                        ) ===
                        normalizeId(
                            teamId
                        )
                ) || null;
        }
    }

    if (!resolvedTeam) {
        return [];
    }

    const leader =
        getTeamLeaderFromTeam(
            resolvedTeam,
            users
        );

    if (!leader) {
        return [];
    }

    return [leader];
}

// ============================================================
// GET MESSAGES
// ============================================================

function getAllMessages() {
    return readArray(
        MESSAGES_KEY
    );
}

// ============================================================
// GET CONVERSATION
// ============================================================

export function getConversation({
    managerId,
    teamLeaderId,
    projectId,
}) {
    const messages =
        getAllMessages();

    return messages
        .filter((item) => {
            return (
                normalizeId(
                    item.managerId
                ) ===
                    normalizeId(
                        managerId
                    ) &&
                normalizeId(
                    item.teamLeaderId
                ) ===
                    normalizeId(
                        teamLeaderId
                    ) &&
                normalizeId(
                    item.projectId
                ) ===
                    normalizeId(
                        projectId
                    )
            );
        })
        .sort(
            (a, b) =>
                new Date(
                    a.createdAt
                ).getTime() -
                new Date(
                    b.createdAt
                ).getTime()
        );
}

// ============================================================
// CREATE TEAM LEADER NOTIFICATION
// ============================================================

function createTeamLeaderNotification({
    message,
    manager,
    project,
    teamLeader,
}) {
    const notification = {
        id:
            typeof crypto !==
            "undefined" &&
            crypto.randomUUID
                ? crypto.randomUUID()
                : `notification-${Date.now()}-${Math.random()
                      .toString(36)
                      .slice(2)}`,

        recipientId:
            teamLeader.id || null,

        recipientUserId:
            teamLeader.id || null,

        recipientEmail:
            getEmail(teamLeader),

        userId:
            teamLeader.id || null,

        type: "MESSAGE",

        notificationType:
            "TEAM_LEADER_MESSAGE",

        category:
            "Communication",

        title:
            "New message from Manager",

        message: `${getName(
            manager
        ) || "Project Manager"} sent you a message regarding ${
            getName(project) ||
            "your project"
        }.`,

        body:
            message,

        senderId:
            manager.id || null,

        senderEmail:
            getEmail(manager),

        senderName:
            getName(manager),

        managerId:
            manager.id || null,

        projectId:
            project.id || null,

        projectName:
            getName(project),

        teamId:
            getProjectTeamId(
                project
            ) || null,

        teamLeaderId:
            teamLeader.id || null,

        relatedProjectId:
            project.id || null,

        relatedActivityType:
            "MANAGER_MESSAGE",

        read: false,

        isRead: false,

        createdAt:
            new Date().toISOString(),

        updatedAt:
            new Date().toISOString(),
    };

    /*
     * Main notification collection.
     */

    const notifications =
        readArray(
            NOTIFICATIONS_KEY
        );

    notifications.unshift(
        notification
    );

    writeArray(
        NOTIFICATIONS_KEY,
        notifications
    );

    /*
     * Dedicated Team Leader
     * notification collection.
     */

    const teamLeaderNotifications =
        readArray(
            TEAM_LEADER_NOTIFICATION_KEY
        );

    teamLeaderNotifications.unshift(
        notification
    );

    writeArray(
        TEAM_LEADER_NOTIFICATION_KEY,
        teamLeaderNotifications
    );

    return notification;
}

// ============================================================
// SEND MESSAGE
// ============================================================

export function sendManagerMessage({
    manager,
    project,
    teamLeader,
    message,
}) {
    if (!manager) {
        throw new Error(
            "Manager authentication information could not be found."
        );
    }

    if (!project) {
        throw new Error(
            "Project not found."
        );
    }

    if (!teamLeader) {
        throw new Error(
            "No Team Leader is currently assigned to this Team."
        );
    }

    const cleanMessage =
        String(
            message || ""
        ).trim();

    if (!cleanMessage) {
        throw new Error(
            "Please enter a message before sending."
        );
    }

    /*
     * Verify that the manager actually
     * owns the project.
     */

    const managerProjects =
        getManagerProjects(
            manager
        );

    const authorizedProject =
        managerProjects.find(
            (item) =>
                normalizeId(
                    item.id
                ) ===
                normalizeId(
                    project.id
                )
        );

    if (!authorizedProject) {
        throw new Error(
            "You are not authorized to message the Team Leader for this project."
        );
    }

    /*
     * Verify Team Leader belongs to
     * selected project team.
     */

    const authorizedLeaders =
        getProjectTeamLeaders(
            project.id
        );

    const authorizedLeader =
        authorizedLeaders.find(
            (leader) =>
                normalizeId(
                    leader.id
                ) ===
                normalizeId(
                    teamLeader.id
                )
        );

    if (!authorizedLeader) {
        throw new Error(
            "This Team Leader is not associated with the selected project Team."
        );
    }

    const now =
        new Date().toISOString();

    const newMessage = {
        id:
            typeof crypto !==
            "undefined" &&
            crypto.randomUUID
                ? crypto.randomUUID()
                : `message-${Date.now()}-${Math.random()
                      .toString(36)
                      .slice(2)}`,

        managerId:
            manager.id || null,

        managerName:
            getName(manager),

        managerEmail:
            getEmail(manager),

        senderId:
            manager.id || null,

        senderName:
            getName(manager),

        senderEmail:
            getEmail(manager),

        recipientId:
            teamLeader.id || null,

        recipientName:
            getName(teamLeader),

        recipientEmail:
            getEmail(teamLeader),

        teamLeaderId:
            teamLeader.id || null,

        teamLeaderName:
            getName(teamLeader),

        teamLeaderEmail:
            getEmail(teamLeader),

        projectId:
            project.id || null,

        projectName:
            getName(project),

        teamId:
            getProjectTeamId(
                project
            ) || null,

        message:
            cleanMessage,

        createdAt: now,

        updatedAt: now,

        status: "Sent",

        deliveryStatus:
            "Delivered",
    };

    /*
     * Store message.
     */

    const messages =
        getAllMessages();

    messages.push(
        newMessage
    );

    const saved =
        writeArray(
            MESSAGES_KEY,
            messages
        );

    if (!saved) {
        throw new Error(
            "Unable to store the message."
        );
    }

    /*
     * Create notification for Team Leader.
     */

    createTeamLeaderNotification({
        message: cleanMessage,
        manager,
        project,
        teamLeader,
    });

    return newMessage;
}

// ============================================================
// UNREAD TEAM LEADER NOTIFICATIONS
// ============================================================

export function getTeamLeaderNotifications(
    teamLeaderId
) {
    return readArray(
        TEAM_LEADER_NOTIFICATION_KEY
    ).filter(
        (notification) =>
            normalizeId(
                notification.recipientId
            ) ===
            normalizeId(
                teamLeaderId
            )
    );
}

// ============================================================
// MARK MESSAGE NOTIFICATION READ
// ============================================================

export function markTeamLeaderNotificationRead(
    notificationId
) {
    const notifications =
        readArray(
            NOTIFICATIONS_KEY
        );

    const updated =
        notifications.map(
            (notification) => {
                if (
                    normalizeId(
                        notification.id
                    ) !==
                    normalizeId(
                        notificationId
                    )
                ) {
                    return notification;
                }

                return {
                    ...notification,
                    read: true,
                    isRead: true,
                    readAt:
                        new Date().toISOString(),
                };
            }
        );

    writeArray(
        NOTIFICATIONS_KEY,
        updated
    );

    const dedicated =
        readArray(
            TEAM_LEADER_NOTIFICATION_KEY
        );

    const updatedDedicated =
        dedicated.map(
            (notification) => {
                if (
                    normalizeId(
                        notification.id
                    ) !==
                    normalizeId(
                        notificationId
                    )
                ) {
                    return notification;
                }

                return {
                    ...notification,
                    read: true,
                    isRead: true,
                    readAt:
                        new Date().toISOString(),
                };
            }
        );

    writeArray(
        TEAM_LEADER_NOTIFICATION_KEY,
        updatedDedicated
    );

    return true;
}

// ============================================================
// EXPORT DEFAULT
// ============================================================

const managerMessageService = {
    getCurrentManager,
    getManagerProjects,
    getProjectTeamLeaders,
    getConversation,
    sendManagerMessage,
    getTeamLeaderNotifications,
    markTeamLeaderNotificationRead,
};

export default managerMessageService;