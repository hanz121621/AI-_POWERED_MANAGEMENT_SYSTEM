
// ============================================================
// AIPMS PROJECT ANNOUNCEMENT SERVICE
// COMM-005 — Send Project Announcement
//
// Project Manager
//      ↓
// Assigned Project
//      ↓
// Authorized Project Team
//      ↓
// Selected Recipients
//      ↓
// Project Announcement
//      ↓
// Notifications
//      ↓
// Activity Feed
//
// BUSINESS RULES
// ------------------------------------------------------------
// 1. Manager must be authenticated.
// 2. Manager must be assigned to the project.
// 3. Recipients must belong to the authorized project/team scope.
// 4. Recipients are retrieved dynamically.
// 5. Priority must come from configured values.
// 6. Announcement must be stored.
// 7. Notifications are created for authorized recipients.
// 8. Announcement is recorded in Activity Feed.
// 9. IDs are never hard-coded.
// 10. Announcement does not modify project/sprint/task data.
// ============================================================

import {
    getCurrentUser,
} from "@/services/authService";

// ============================================================
// STORAGE KEYS
// ============================================================

const USERS_KEY = "aipms_users";

const PROJECT_KEYS = [
    "aipms_projects",
    "projects",
];

const TEAM_KEYS = [
    "aipms_teams",
    "teams",
];

const ANNOUNCEMENTS_KEY =
    "aipms_project_announcements";

const NOTIFICATIONS_KEY =
    "aipms_notifications";

const ACTIVITY_KEY =
    "aipms_activity_logs";

// ============================================================
// CONFIGURED PRIORITIES
//
// These are the configured announcement priorities.
// The UI should retrieve these instead of hard-coding
// priority values in the form.
// ============================================================

const ANNOUNCEMENT_PRIORITIES = [
    "Low",
    "Normal",
    "High",
    "Urgent",
];

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
// ID NORMALIZATION
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

// ============================================================
// GENERATE ID
// ============================================================

function generateId(prefix) {
    if (
        typeof crypto !== "undefined" &&
        crypto.randomUUID
    ) {
        return crypto.randomUUID();
    }

    return `${prefix}-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}`;
}

// ============================================================
// FIRST VALUE
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
            object[key] !== undefined &&
            object[key] !== null &&
            String(object[key]).trim() !== ""
        ) {
            return object[key];
        }
    }

    return null;
}

// ============================================================
// NAME
// ============================================================

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
        item.projectName ||
        item.teamName ||
        item.title ||
        ""
    );
}

// ============================================================
// EMAIL
// ============================================================

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
// GET CONFIGURED PRIORITIES
// ============================================================

export function getAnnouncementPriorities() {
    return [
        ...ANNOUNCEMENT_PRIORITIES,
    ];
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
        normalizeId(
            manager.id ||
            manager.userId
        );

    const managerEmail =
        String(
            manager.email || ""
        )
            .trim()
            .toLowerCase();

    // --------------------------------------------------------
    // Manager ID
    // --------------------------------------------------------

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
        managerId &&
        normalizeId(
            projectManagerId
        ) === managerId
    ) {
        return true;
    }

    // --------------------------------------------------------
    // Manager Email
    // --------------------------------------------------------

    const projectManagerEmail =
        firstValue(project, [
            "managerEmail",
            "projectManagerEmail",
            "assignedManagerEmail",
        ]);

    if (
        projectManagerEmail &&
        managerEmail &&
        String(
            projectManagerEmail
        )
            .trim()
            .toLowerCase() ===
            managerEmail
    ) {
        return true;
    }

    // --------------------------------------------------------
    // Embedded Manager Object
    // --------------------------------------------------------

    const embeddedManager =
        project.manager ||
        project.projectManager ||
        project.assignedManager;

    if (
        embeddedManager &&
        typeof embeddedManager === "object"
    ) {
        const nestedId =
            normalizeId(
                embeddedManager.id ||
                embeddedManager.userId
            );

        const nestedEmail =
            String(
                embeddedManager.email || ""
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

    // --------------------------------------------------------
    // String Manager
    // --------------------------------------------------------

    if (
        typeof project.manager ===
        "string"
    ) {
        const value =
            project.manager
                .trim()
                .toLowerCase();

        if (
            value === managerEmail ||
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
            value === managerEmail ||
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
    manager = getCurrentUser()
) {
    if (!manager) {
        return [];
    }

    const projects =
        getAllProjects();

    // --------------------------------------------------------
    // Primary relationship
    // --------------------------------------------------------

    const assignedProjects =
        projects.filter(
            (project) =>
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

    // --------------------------------------------------------
    // Manager projectIds fallback
    // --------------------------------------------------------

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

    return [];
}

// ============================================================
// FIND PROJECT
// ============================================================

export function getProjectById(
    projectId
) {
    if (!projectId) {
        return null;
    }

    const projects =
        getAllProjects();

    return (
        projects.find(
            (project) =>
                normalizeId(
                    project.id
                ) ===
                normalizeId(
                    projectId
                )
        ) || null
    );
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
// GET PROJECT TEAM
// ============================================================

export function getProjectTeam(
    project
) {
    if (!project) {
        return null;
    }

    const teams =
        getAllTeams();

    const teamId =
        getProjectTeamId(project);

    // --------------------------------------------------------
    // Team ID relationship
    // --------------------------------------------------------

    if (teamId) {
        const team =
            teams.find(
                (item) =>
                    normalizeId(
                        item.id
                    ) ===
                    normalizeId(
                        teamId
                    )
            );

        if (team) {
            return team;
        }
    }

    // --------------------------------------------------------
    // Embedded team
    // --------------------------------------------------------

    const embeddedTeam =
        project.team ||
        project.assignedTeam;

    if (
        embeddedTeam &&
        typeof embeddedTeam === "object"
    ) {
        return embeddedTeam;
    }

    return null;
}

// ============================================================
// GET TEAM MEMBER IDS
// ============================================================

function getTeamMemberIds(
    team
) {
    if (!team) {
        return [];
    }

    const ids = [];

    // --------------------------------------------------------
    // members
    // --------------------------------------------------------

    if (
        Array.isArray(
            team.members
        )
    ) {
        team.members.forEach(
            (member) => {
                if (
                    member &&
                    typeof member ===
                        "object"
                ) {
                    const id =
                        member.id ||
                        member.userId;

                    if (id) {
                        ids.push(
                            normalizeId(id)
                        );
                    }
                } else if (
                    member !== null &&
                    member !== undefined
                ) {
                    ids.push(
                        normalizeId(
                            member
                        )
                    );
                }
            }
        );
    }

    // --------------------------------------------------------
    // memberIds
    // --------------------------------------------------------

    if (
        Array.isArray(
            team.memberIds
        )
    ) {
        team.memberIds.forEach(
            (id) => {
                if (id) {
                    ids.push(
                        normalizeId(id)
                    );
                }
            }
        );
    }

    // --------------------------------------------------------
    // userIds
    // --------------------------------------------------------

    if (
        Array.isArray(
            team.userIds
        )
    ) {
        team.userIds.forEach(
            (id) => {
                if (id) {
                    ids.push(
                        normalizeId(id)
                    );
                }
            }
        );
    }

    return [
        ...new Set(ids),
    ];
}

// ============================================================
// GET PROJECT AUTHORIZED RECIPIENTS
// ============================================================
//
// Recipients are dynamically resolved from the current
// project/team relationships.
//
// This prevents arbitrary users from being selected.
// ============================================================

export function getProjectAuthorizedRecipients(
    projectId,
    manager = getCurrentUser()
) {
    if (!manager) {
        return [];
    }

    const project =
        getProjectById(
            projectId
        );

    if (!project) {
        return [];
    }

    // --------------------------------------------------------
    // Security: project must belong to manager
    // --------------------------------------------------------

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
                    projectId
                )
        );

    if (!authorizedProject) {
        return [];
    }

    const users =
        getAllUsers();

    const team =
        getProjectTeam(
            project
        );

    if (!team) {
        return [];
    }

    const memberIds =
        getTeamMemberIds(
            team
        );

    // --------------------------------------------------------
    // Resolve team members from users
    // --------------------------------------------------------

    const recipients =
        users.filter(
            (user) =>
                memberIds.includes(
                    normalizeId(
                        user.id ||
                        user.userId
                    )
                )
        );

    // --------------------------------------------------------
    // Also support users directly associated with team
    // --------------------------------------------------------

    const teamId =
        normalizeId(
            team.id
        );

    users.forEach(
        (user) => {
            const userTeamId =
                firstValue(
                    user,
                    [
                        "teamId",
                        "assignedTeamId",
                    ]
                );

            if (
                userTeamId &&
                normalizeId(
                    userTeamId
                ) === teamId
            ) {
                const userId =
                    normalizeId(
                        user.id ||
                        user.userId
                    );

                if (
                    userId &&
                    !recipients.some(
                        (item) =>
                            normalizeId(
                                item.id ||
                                item.userId
                            ) ===
                            userId
                    )
                ) {
                    recipients.push(
                        user
                    );
                }
            }
        }
    );

    // --------------------------------------------------------
    // Remove current manager from recipient list
    //
    // Manager is sender, not an announcement recipient.
    // --------------------------------------------------------

    const managerId =
        normalizeId(
            manager.id ||
            manager.userId
        );

    return recipients.filter(
        (user) =>
            normalizeId(
                user.id ||
                user.userId
            ) !== managerId &&
            user.isActive !== false
    );
}

// ============================================================
// GET RECIPIENT BY ID
// ============================================================

export function getAuthorizedRecipient(
    projectId,
    recipientId,
    manager = getCurrentUser()
) {
    const recipients =
        getProjectAuthorizedRecipients(
            projectId,
            manager
        );

    return (
        recipients.find(
            (recipient) =>
                normalizeId(
                    recipient.id ||
                    recipient.userId
                ) ===
                normalizeId(
                    recipientId
                )
        ) || null
    );
}

// ============================================================
// VALIDATE RECIPIENTS
// ============================================================

function validateRecipients({
    projectId,
    recipientIds,
    manager,
}) {
    const authorizedRecipients =
        getProjectAuthorizedRecipients(
            projectId,
            manager
        );

    if (
        authorizedRecipients.length ===
        0
    ) {
        throw new Error(
            "No valid recipients available."
        );
    }

    const authorizedIds =
        new Set(
            authorizedRecipients.map(
                (recipient) =>
                    normalizeId(
                        recipient.id ||
                        recipient.userId
                    )
            )
        );

    const cleanRecipientIds = [
        ...new Set(
            (Array.isArray(
                recipientIds
            )
                ? recipientIds
                : []
            )
                .map(normalizeId)
                .filter(Boolean)
        ),
    ];

    if (
        cleanRecipientIds.length === 0
    ) {
        throw new Error(
            "No valid recipients available."
        );
    }

    const unauthorizedIds =
        cleanRecipientIds.filter(
            (id) =>
                !authorizedIds.has(id)
        );

    if (
        unauthorizedIds.length > 0
    ) {
        throw new Error(
            "One or more selected recipients are not authorized for this project."
        );
    }

    return authorizedRecipients.filter(
        (recipient) =>
            cleanRecipientIds.includes(
                normalizeId(
                    recipient.id ||
                    recipient.userId
                )
            )
    );
}

// ============================================================
// CREATE NOTIFICATION
// ============================================================

function createAnnouncementNotification({
    announcement,
    recipient,
}) {
    const now =
        new Date().toISOString();

    return {
        id: generateId(
            "announcement-notification"
        ),

        recipientId:
            recipient.id ||
            recipient.userId ||
            null,

        recipientUserId:
            recipient.id ||
            recipient.userId ||
            null,

        recipientEmail:
            getEmail(recipient),

        userId:
            recipient.id ||
            recipient.userId ||
            null,

        type:
            "PROJECT_ANNOUNCEMENT",

        notificationType:
            "PROJECT_ANNOUNCEMENT",

        category:
            "Communication",

        title:
            announcement.title,

        message:
            announcement.message,

        body:
            announcement.message,

        priority:
            announcement.priority,

        senderId:
            announcement.managerId,

        senderName:
            announcement.managerName,

        senderEmail:
            announcement.managerEmail,

        managerId:
            announcement.managerId,

        projectId:
            announcement.projectId,

        projectName:
            announcement.projectName,

        teamId:
            announcement.teamId,

        announcementId:
            announcement.id,

        relatedProjectId:
            announcement.projectId,

        relatedActivityType:
            "PROJECT_ANNOUNCEMENT",

        read: false,

        isRead: false,

        createdAt: now,

        updatedAt: now,
    };
}

// ============================================================
// CREATE ACTIVITY FEED ENTRY
// ============================================================

function createActivityFeedEntry({
    announcement,
    recipientIds,
}) {
    return {
        id: generateId(
            "activity"
        ),

        action:
            "PROJECT_ANNOUNCEMENT_SENT",

        type:
            "PROJECT_ANNOUNCEMENT",

        category:
            "Communication",

        targetType:
            "Project",

        targetId:
            announcement.projectId,

        targetName:
            announcement.projectName,

        projectId:
            announcement.projectId,

        projectName:
            announcement.projectName,

        teamId:
            announcement.teamId,

        announcementId:
            announcement.id,

        title:
            announcement.title,

        message:
            announcement.message,

        priority:
            announcement.priority,

        performedBy:
            announcement.managerId,

        performedByUserId:
            announcement.managerId,

        performedByName:
            announcement.managerName,

        performedByEmail:
            announcement.managerEmail,

        recipientIds: [
            ...recipientIds,
        ],

        recipientCount:
            recipientIds.length,

        details:
            `Project announcement "${announcement.title}" was sent to ${recipientIds.length} authorized recipient(s).`,

        createdAt:
            announcement.createdAt,

        updatedAt:
            announcement.updatedAt,
    };
}

// ============================================================
// GET ALL ANNOUNCEMENTS
// ============================================================

export function getAllAnnouncements() {
    return readArray(
        ANNOUNCEMENTS_KEY
    );
}

// ============================================================
// GET MANAGER ANNOUNCEMENTS
// ============================================================

export function getManagerAnnouncements(
    managerId
) {
    return getAllAnnouncements()
        .filter(
            (announcement) =>
                normalizeId(
                    announcement.managerId
                ) ===
                normalizeId(
                    managerId
                )
        )
        .sort(
            (a, b) =>
                new Date(
                    b.createdAt
                ).getTime() -
                new Date(
                    a.createdAt
                ).getTime()
        );
}

// ============================================================
// GET PROJECT ANNOUNCEMENTS
// ============================================================

export function getProjectAnnouncements(
    projectId
) {
    return getAllAnnouncements()
        .filter(
            (announcement) =>
                normalizeId(
                    announcement.projectId
                ) ===
                normalizeId(
                    projectId
                )
        )
        .sort(
            (a, b) =>
                new Date(
                    b.createdAt
                ).getTime() -
                new Date(
                    a.createdAt
                ).getTime()
        );
}

// ============================================================
// SEND PROJECT ANNOUNCEMENT
// ============================================================

export function sendProjectAnnouncement({
    manager = getCurrentUser(),
    projectId,
    title,
    message,
    priority,
    recipientIds,
}) {
    // ========================================================
    // A1 — AUTHENTICATION
    // ========================================================

    if (!manager) {
        throw new Error(
            "Manager authentication information could not be found."
        );
    }

    // ========================================================
    // ROLE VALIDATION
    // ========================================================

    const normalizedRole =
        String(
            manager.role || ""
        )
            .trim()
            .toLowerCase();

    if (
        normalizedRole !==
        "manager"
    ) {
        throw new Error(
            "Only an authenticated Project Manager can send project announcements."
        );
    }

    // ========================================================
    // REQUIRED PROJECT
    // ========================================================

    if (!projectId) {
        throw new Error(
            "Project is required."
        );
    }

    // ========================================================
    // PROJECT EXISTENCE
    // ========================================================

    const project =
        getProjectById(
            projectId
        );

    if (!project) {
        throw new Error(
            "Project not found."
        );
    }

    // ========================================================
    // BUSINESS RULE 1
    // Manager must be assigned to project.
    // ========================================================

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
                    projectId
                )
        );

    if (!authorizedProject) {
        throw new Error(
            "You are not authorized to send announcements for this project."
        );
    }

    // ========================================================
    // A1 — TITLE
    // ========================================================

    const cleanTitle =
        String(
            title || ""
        ).trim();

    if (!cleanTitle) {
        throw new Error(
            "Announcement title is required."
        );
    }

    // ========================================================
    // A1 — MESSAGE
    // ========================================================

    const cleanMessage =
        String(
            message || ""
        ).trim();

    if (!cleanMessage) {
        throw new Error(
            "Announcement message is required."
        );
    }

    // ========================================================
    // PRIORITY VALIDATION
    // ========================================================

    const cleanPriority =
        String(
            priority || ""
        ).trim();

    if (
        !ANNOUNCEMENT_PRIORITIES.includes(
            cleanPriority
        )
    ) {
        throw new Error(
            "Invalid announcement priority."
        );
    }

    // ========================================================
    // PROJECT TEAM
    // ========================================================

    const team =
        getProjectTeam(
            project
        );

    if (!team) {
        throw new Error(
            "No active Team or authorized recipients available."
        );
    }

    // ========================================================
    // A2 / A3 — RECIPIENT VALIDATION
    // ========================================================

    const recipients =
        validateRecipients({
            projectId,
            recipientIds,
            manager,
        });

    if (
        recipients.length === 0
    ) {
        throw new Error(
            "No valid recipients available."
        );
    }

    // ========================================================
    // CREATE ANNOUNCEMENT
    // ========================================================

    const now =
        new Date().toISOString();

    const announcement = {
        id: generateId(
            "announcement"
        ),

        managerId:
            manager.id ||
            manager.userId ||
            null,

        managerName:
            getName(manager),

        managerEmail:
            getEmail(manager),

        projectId:
            project.id,

        projectName:
            getName(project),

        teamId:
            team.id ||
            getProjectTeamId(
                project
            ) ||
            null,

        teamName:
            getName(team),

        title:
            cleanTitle,

        message:
            cleanMessage,

        priority:
            cleanPriority,

        recipientIds:
            recipients.map(
                (recipient) =>
                    recipient.id ||
                    recipient.userId
            ),

        recipientCount:
            recipients.length,

        recipientNames:
            recipients.map(
                getName
            ),

        recipientEmails:
            recipients.map(
                getEmail
            ),

        status:
            "Sent",

        deliveryStatus:
            "Delivered",

        createdAt:
            now,

        updatedAt:
            now,
    };

    // ========================================================
    // STORE ANNOUNCEMENT
    // ========================================================

    const announcements =
        getAllAnnouncements();

    announcements.unshift(
        announcement
    );

    const savedAnnouncement =
        writeArray(
            ANNOUNCEMENTS_KEY,
            announcements
        );

    if (!savedAnnouncement) {
        throw new Error(
            "Unable to store the project announcement."
        );
    }

    // ========================================================
    // SEND NOTIFICATIONS
    // ========================================================

    const notifications =
        readArray(
            NOTIFICATIONS_KEY
        );

    const createdNotifications =
        [];

    recipients.forEach(
        (recipient) => {
            const notification =
                createAnnouncementNotification({
                    announcement,
                    recipient,
                });

            notifications.unshift(
                notification
            );

            createdNotifications.push(
                notification
            );
        }
    );

    const savedNotifications =
        writeArray(
            NOTIFICATIONS_KEY,
            notifications
        );

    // ========================================================
    // A4 — DELIVERY FAILURE
    // ========================================================

    if (!savedNotifications) {
        // The announcement itself has already been stored.
        // Update its delivery status so the UI can report
        // that storage succeeded but notification delivery failed.

        const updatedAnnouncements =
            getAllAnnouncements().map(
                (item) => {
                    if (
                        normalizeId(
                            item.id
                        ) !==
                        normalizeId(
                            announcement.id
                        )
                    ) {
                        return item;
                    }

                    return {
                        ...item,
                        deliveryStatus:
                            "Failed",
                        status:
                            "Stored",
                        updatedAt:
                            new Date().toISOString(),
                    };
                }
            );

        writeArray(
            ANNOUNCEMENTS_KEY,
            updatedAnnouncements
        );

        throw new Error(
            "The announcement was stored, but could not be delivered to recipients."
        );
    }

    // ========================================================
    // ACTIVITY FEED
    // ========================================================

    const activityEntry =
        createActivityFeedEntry({
            announcement,
            recipientIds:
                announcement.recipientIds,
        });

    const activityLogs =
        readArray(
            ACTIVITY_KEY
        );

    activityLogs.unshift(
        activityEntry
    );

    const savedActivity =
        writeArray(
            ACTIVITY_KEY,
            activityLogs
        );

    if (!savedActivity) {
        console.warn(
            "Announcement was sent successfully, but Activity Feed recording failed."
        );
    }

    // ========================================================
    // RETURN RESULT
    // ========================================================

    return {
        success: true,

        announcement,

        notifications:
            createdNotifications,

        activity:
            activityEntry,

        message:
            "Project announcement sent successfully.",
    };
}

// ============================================================
// DELETE / CLEAR ANNOUNCEMENTS
//
// Optional administrative/testing helper.
// This does NOT delete projects, teams, tasks, or users.
// ============================================================

export function deleteAnnouncement(
    announcementId,
    manager = getCurrentUser()
) {
    if (!manager) {
        return {
            success: false,
            error:
                "Authentication required.",
        };
    }

    const announcements =
        getAllAnnouncements();

    const announcement =
        announcements.find(
            (item) =>
                normalizeId(
                    item.id
                ) ===
                normalizeId(
                    announcementId
                )
        );

    if (!announcement) {
        return {
            success: false,
            error:
                "Announcement not found.",
        };
    }

    if (
        normalizeId(
            announcement.managerId
        ) !==
        normalizeId(
            manager.id ||
            manager.userId
        )
    ) {
        return {
            success: false,
            error:
                "You are not authorized to delete this announcement.",
        };
    }

    const updated =
        announcements.filter(
            (item) =>
                normalizeId(
                    item.id
                ) !==
                normalizeId(
                    announcementId
                )
        );

    const saved =
        writeArray(
            ANNOUNCEMENTS_KEY,
            updated
        );

    if (!saved) {
        return {
            success: false,
            error:
                "Unable to delete announcement.",
        };
    }

    return {
        success: true,
        message:
            "Announcement deleted successfully.",
    };
}

// ============================================================
// DEFAULT EXPORT
// ============================================================

const projectAnnouncementService = {
    getAnnouncementPriorities,
    getManagerProjects,
    getProjectById,
    getProjectTeam,
    getProjectAuthorizedRecipients,
    getAuthorizedRecipient,
    getAllAnnouncements,
    getManagerAnnouncements,
    getProjectAnnouncements,
    sendProjectAnnouncement,
    deleteAnnouncement,
};

export default projectAnnouncementService;
