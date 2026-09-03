import api from "@/services/api";

/**
 * ============================================================
 * AIPMS COMMUNICATION SERVICE
 * ============================================================
 *
 * Shared communication service for:
 * - Manager communication
 * - Contributor communication
 * - Notifications
 * - Messages
 * - Mentions
 * - Activity feed
 * - Project announcements
 *
 * Uses the shared API client so authentication and JWT handling
 * remain centralized in api.js.
 * ============================================================
 */

/* ============================================================
   HELPERS
   ============================================================ */

/**
 * Convert API errors into a consistent Error object.
 */
const handleApiError = (error, fallbackMessage = "Communication request failed.") => {
    console.error("Communication API error:", error);

    const responseData = error?.response?.data;

    let message = fallbackMessage;

    if (typeof responseData === "string" && responseData.trim()) {
        message = responseData;
    } else if (responseData?.message) {
        message = responseData.message;
    } else if (responseData?.error) {
        message = responseData.error;
    } else if (error?.message) {
        message = error.message;
    }

    const normalizedError = new Error(message);

    normalizedError.status = error?.response?.status;
    normalizedError.response = error?.response;

    throw normalizedError;
};

/**
 * Safely return Axios response data.
 */
const getResponseData = (response) => {
    return response?.data ?? null;
};

/**
 * Normalize common API collection response formats.
 */
const normalizeArray = (value, propertyNames = []) => {
    if (Array.isArray(value)) {
        return value;
    }

    for (const property of propertyNames) {
        if (Array.isArray(value?.[property])) {
            return value[property];
        }
    }

    if (Array.isArray(value?.data)) {
        return value.data;
    }

    if (Array.isArray(value?.items)) {
        return value.items;
    }

    if (Array.isArray(value?.results)) {
        return value.results;
    }

    return [];
};


/* ============================================================
   MANAGER NOTIFICATIONS
   ============================================================ */

/**
 * Get manager notifications.
 *
 * GET /api/notifications
 */
export const getManagerNotifications = async () => {
    try {
        const response = await api.get("/notifications");

        return normalizeArray(
            getResponseData(response),
            ["notifications", "items", "data"]
        );
    } catch (error) {
        return handleApiError(
            error,
            "Failed to load manager notifications."
        );
    }
};


/**
 * Get one manager notification.
 *
 * GET /api/notifications/{notificationId}
 */
export const getManagerNotificationById = async (notificationId) => {
    if (!notificationId) {
        throw new Error("Notification ID is required.");
    }

    try {
        const response = await api.get(
            `/notifications/${notificationId}`
        );

        return getResponseData(response);
    } catch (error) {
        return handleApiError(
            error,
            "Failed to load notification."
        );
    }
};


/**
 * Mark one notification as read.
 *
 * PATCH /api/notifications/{notificationId}/read
 */
export const markManagerNotificationAsRead = async (
    notificationId
) => {
    if (!notificationId) {
        throw new Error("Notification ID is required.");
    }

    try {
        const response = await api.patch(
            `/notifications/${notificationId}/read`
        );

        return getResponseData(response);
    } catch (error) {
        return handleApiError(
            error,
            "Failed to mark notification as read."
        );
    }
};


/**
 * Get unread notification count.
 *
 * GET /api/notifications/unread-count
 */
export const getManagerUnreadNotificationCount = async () => {
    try {
        const response = await api.get(
            "/notifications/unread-count"
        );

        const data = getResponseData(response);

        if (typeof data === "number") {
            return data;
        }

        if (typeof data?.unreadCount === "number") {
            return data.unreadCount;
        }

        if (typeof data?.count === "number") {
            return data.count;
        }

        return 0;
    } catch (error) {
        return handleApiError(
            error,
            "Failed to load unread notification count."
        );
    }
};


/**
 * Mark all manager notifications as read.
 *
 * The backend does not require a dedicated read-all endpoint.
 * We retrieve unread notifications and mark each one individually.
 */
export const markAllManagerNotificationsAsRead = async () => {
    try {
        const notifications = await getManagerNotifications();

        const unreadNotifications = notifications.filter(
            (notification) =>
                notification &&
                !notification.isRead &&
                notification.id
        );

        if (unreadNotifications.length === 0) {
            return {
                success: true,
                count: 0,
                message: "There are no unread notifications.",
            };
        }

        await Promise.all(
            unreadNotifications.map((notification) =>
                markManagerNotificationAsRead(notification.id)
            )
        );

        return {
            success: true,
            count: unreadNotifications.length,
            message: "All notifications marked as read.",
        };
    } catch (error) {
        return handleApiError(
            error,
            "Failed to mark all notifications as read."
        );
    }
};


/* ============================================================
   MANAGER PROJECTS / TEAMS
   ============================================================ */

/**
 * Get projects belonging to the current manager.
 *
 * GET /api/projects/manager
 */
export const getManagerProjects = async () => {
    try {
        const response = await api.get(
            "/projects/manager"
        );

        return normalizeArray(
            getResponseData(response),
            ["projects", "items", "data"]
        );
    } catch (error) {
        return handleApiError(
            error,
            "Failed to load manager projects."
        );
    }
};


/**
 * Get teams for a project.
 *
 * GET /api/projects/{projectId}/teams
 */
export const getProjectTeams = async (projectId) => {
    if (!projectId) {
        throw new Error("Project ID is required.");
    }

    try {
        const response = await api.get(
            `/projects/${projectId}/teams`
        );

        return normalizeArray(
            getResponseData(response),
            ["teams", "items", "data"]
        );
    } catch (error) {
        return handleApiError(
            error,
            "Failed to load project teams."
        );
    }
};


/**
 * Get one project team.
 *
 * GET /api/projects/{projectId}/teams/{teamId}
 */
export const getProjectTeam = async (
    projectId,
    teamId
) => {
    if (!projectId) {
        throw new Error("Project ID is required.");
    }

    if (!teamId) {
        throw new Error("Team ID is required.");
    }

    try {
        const response = await api.get(
            `/projects/${projectId}/teams/${teamId}`
        );

        return getResponseData(response);
    } catch (error) {
        return handleApiError(
            error,
            "Failed to load project team."
        );
    }
};


/**
 * Get team leader.
 *
 * GET /api/teams/{teamId}/leader
 */
export const getTeamLeader = async (teamId) => {
    if (!teamId) {
        throw new Error("Team ID is required.");
    }

    try {
        const response = await api.get(
            `/teams/${teamId}/leader`
        );

        return getResponseData(response);
    } catch (error) {
        return handleApiError(
            error,
            "Failed to load team leader."
        );
    }
};


/**
 * Get team members.
 *
 * GET /api/teams/{teamId}/members
 */
export const getTeamMembers = async (teamId) => {
    if (!teamId) {
        throw new Error("Team ID is required.");
    }

    try {
        const response = await api.get(
            `/teams/${teamId}/members`
        );

        return normalizeArray(
            getResponseData(response),
            ["members", "users", "items", "data"]
        );
    } catch (error) {
        return handleApiError(
            error,
            "Failed to load team members."
        );
    }
};


/**
 * Get communication recipients for a project.
 *
 * GET /api/projects/{projectId}/communication-recipients
 */
export const getProjectRecipients = async (projectId) => {
    if (!projectId) {
        throw new Error("Project ID is required.");
    }

    try {
        const response = await api.get(
            `/projects/${projectId}/communication-recipients`
        );

        return normalizeArray(
            getResponseData(response),
            [
                "recipients",
                "members",
                "users",
                "items",
                "data",
            ]
        );
    } catch (error) {
        return handleApiError(
            error,
            "Failed to load communication recipients."
        );
    }
};


/* ============================================================
   MANAGER MESSAGES
   ============================================================ */

/**
 * Send a message to a team leader.
 *
 * POST /api/communications/messages
 *
 * payload may contain:
 * {
 *   projectId,
 *   teamId,
 *   teamLeaderId / recipientId,
 *   message
 * }
 */
export const sendMessageToTeamLeader = async (payload) => {
    if (!payload) {
        throw new Error("Message payload is required.");
    }

    try {
        const response = await api.post(
            "/communications/messages",
            payload
        );

        return getResponseData(response);
    } catch (error) {
        return handleApiError(
            error,
            "Failed to send message to team leader."
        );
    }
};


/**
 * Get team leader conversation.
 *
 * GET /api/communications/messages
 */
export const getTeamLeaderConversation = async (
    params = {}
) => {
    try {
        const response = await api.get(
            "/communications/messages",
            {
                params,
            }
        );

        return normalizeArray(
            getResponseData(response),
            [
                "messages",
                "conversation",
                "items",
                "data",
            ]
        );
    } catch (error) {
        return handleApiError(
            error,
            "Failed to load team leader conversation."
        );
    }
};


/**
 * Compatibility function.
 */
export const getTeamLeaderMessages = async ({
    projectId,
    teamId,
    teamLeaderId,
} = {}) => {
    return getTeamLeaderConversation({
        projectId,
        teamId,
        teamLeaderId,
    });
};


/**
 * Get conversation alias.
 */
export const getConversation = async ({
    projectId,
    teamId,
    teamLeaderId,
} = {}) => {
    return getTeamLeaderConversation({
        projectId,
        teamId,
        teamLeaderId,
    });
};


/**
 * Send message alias.
 */
export const sendMessage = async ({
    projectId,
    teamId,
    teamLeaderId,
    message,
    recipientId,
} = {}) => {
    return sendMessageToTeamLeader({
        projectId,
        teamId,
        teamLeaderId,
        recipientId,
        message,
    });
};


/* ============================================================
   MANAGER MENTIONS
   ============================================================ */

/**
 * Mention a team leader.
 *
 * POST /api/communications/mentions
 */
export const mentionTeamLeader = async (payload) => {
    if (!payload) {
        throw new Error("Mention payload is required.");
    }

    try {
        const response = await api.post(
            "/communications/mentions",
            payload
        );

        return getResponseData(response);
    } catch (error) {
        return handleApiError(
            error,
            "Failed to mention team leader."
        );
    }
};


/**
 * Alias.
 */
export const createTeamLeaderMention =
    mentionTeamLeader;


/* ============================================================
   MANAGER ACTIVITY FEED
   ============================================================ */

/**
 * Get manager activity feed.
 *
 * GET /api/activities/manager
 */
export const getManagerActivityFeed = async (
    filters = {}
) => {
    try {
        const params = {
            projectId:
                filters.projectId || undefined,

            teamId:
                filters.teamId || undefined,

            activityType:
                filters.activityType || undefined,

            startDate:
                filters.startDate || undefined,

            endDate:
                filters.endDate || undefined,

            search:
                filters.search || undefined,

            page:
                filters.page || undefined,

            pageSize:
                filters.pageSize || undefined,
        };

        const response = await api.get(
            "/activities/manager",
            {
                params,
            }
        );

        const data = getResponseData(response);

        return normalizeArray(
            data,
            ["activities", "items", "results", "data"]
        );
    } catch (error) {
        return handleApiError(
            error,
            "Failed to load manager activity."
        );
    }
};


/**
 * Activity feed alias.
 */
export const getActivityFeed = async (
    filters = {}
) => {
    return getManagerActivityFeed(filters);
};


/**
 * Get one activity.
 *
 * GET /api/activities/{activityId}
 */
export const getManagerActivityById = async (
    activityId
) => {
    if (!activityId) {
        throw new Error("Activity ID is required.");
    }

    try {
        const response = await api.get(
            `/activities/${activityId}`
        );

        return getResponseData(response);
    } catch (error) {
        return handleApiError(
            error,
            "Failed to load activity."
        );
    }
};


/**
 * Activity by ID alias.
 */
export const getActivityById = async (
    activityId
) => {
    return getManagerActivityById(activityId);
};


/* ============================================================
   PROJECT ANNOUNCEMENTS
   ============================================================ */

/**
 * Send project announcement.
 *
 * POST /api/communications/announcements
 */
export const sendProjectAnnouncement = async (
    payload
) => {
    if (!payload) {
        throw new Error(
            "Announcement payload is required."
        );
    }

    try {
        const response = await api.post(
            "/communications/announcements",
            payload
        );

        return getResponseData(response);
    } catch (error) {
        return handleApiError(
            error,
            "Failed to send project announcement."
        );
    }
};


/**
 * Announcement alias.
 */
export const createProjectAnnouncement =
    sendProjectAnnouncement;


/**
 * Get announcement priorities.
 *
 * GET /api/communications/announcement-priorities
 */
export const getAnnouncementPriorities = async () => {
    try {
        const response = await api.get(
            "/communications/announcement-priorities"
        );

        return normalizeArray(
            getResponseData(response)
        );
    } catch (error) {
        return handleApiError(
            error,
            "Failed to load announcement priorities."
        );
    }
};


/* ============================================================
   CONTRIBUTOR COMMUNICATION
   ============================================================ */

/**
 * Get messages received by current contributor.
 *
 * GET /api/communication/messages/inbox
 */
export const getMyMessages = async () => {
    try {
        const response = await api.get(
            "/communication/messages/inbox"
        );

        return normalizeArray(
            getResponseData(response)
        );
    } catch (error) {
        return handleApiError(
            error,
            "Failed to load messages."
        );
    }
};


/**
 * Get one received message.
 *
 * GET /api/communication/messages/inbox/{messageId}
 */
export const getMyMessageById = async (
    messageId
) => {
    if (!messageId) {
        throw new Error("Message ID is required.");
    }

    try {
        const response = await api.get(
            `/communication/messages/inbox/${messageId}`
        );

        return getResponseData(response);
    } catch (error) {
        return handleApiError(
            error,
            "Failed to load message."
        );
    }
};


/**
 * Mark contributor message as read.
 *
 * PATCH /api/communication/messages/inbox/{messageId}/read
 */
export const markMessageAsRead = async (
    messageId
) => {
    if (!messageId) {
        throw new Error("Message ID is required.");
    }

    try {
        const response = await api.patch(
            `/communication/messages/inbox/${messageId}/read`
        );

        return getResponseData(response);
    } catch (error) {
        return handleApiError(
            error,
            "Failed to mark message as read."
        );
    }
};


/**
 * Get unread contributor message count.
 *
 * GET /api/communication/messages/unread-count
 */
export const getUnreadMessageCount = async () => {
    try {
        const response = await api.get(
            "/communication/messages/unread-count"
        );

        const data = getResponseData(response);

        if (typeof data === "number") {
            return data;
        }

        if (typeof data?.count === "number") {
            return data.count;
        }

        if (typeof data?.unreadCount === "number") {
            return data.unreadCount;
        }

        return 0;
    } catch (error) {
        return handleApiError(
            error,
            "Failed to load unread message count."
        );
    }
};


/**
 * Get conversation for a project.
 *
 * GET /api/communication/messages/project/{projectId}
 */
export const getProjectConversation = async (
    projectId
) => {
    if (!projectId) {
        throw new Error("Project ID is required.");
    }

    try {
        const response = await api.get(
            `/communication/messages/project/${projectId}`
        );

        return normalizeArray(
            getResponseData(response)
        );
    } catch (error) {
        return handleApiError(
            error,
            "Failed to load project conversation."
        );
    }
};


/**
 * Mention team members in a task comment.
 *
 * POST /api/communication/mentions/task-comment/{taskCommentId}
 *
 * Body:
 * [
 *   "user-guid-1",
 *   "user-guid-2"
 * ]
 */
export const mentionTaskComment = async (
    taskCommentId,
    mentionedUserIds
) => {
    if (!taskCommentId) {
        throw new Error(
            "Task comment ID is required."
        );
    }

    if (!Array.isArray(mentionedUserIds)) {
        throw new Error(
            "Mentioned user IDs must be an array."
        );
    }

    try {
        const response = await api.post(
            `/communication/mentions/task-comment/${taskCommentId}`,
            mentionedUserIds
        );

        return normalizeArray(
            getResponseData(response)
        );
    } catch (error) {
        return handleApiError(
            error,
            "Failed to mention team members."
        );
    }
};


/* ============================================================
   COMMUNICATION TYPES
   ============================================================ */

/**
 * Get communication types.
 *
 * GET /api/communications/types
 */
export const getCommunicationTypes = async () => {
    try {
        const response = await api.get(
            "/communications/types"
        );

        return normalizeArray(
            getResponseData(response),
            ["types", "items", "data"]
        );
    } catch (error) {
        return handleApiError(
            error,
            "Failed to load communication types."
        );
    }
};


/* ============================================================
   DEFAULT EXPORT
   ============================================================ */

export default {
    /* Manager notifications */
    getManagerNotifications,
    getManagerNotificationById,
    markManagerNotificationAsRead,
    markAllManagerNotificationsAsRead,
    getManagerUnreadNotificationCount,

    /* Manager projects / teams */
    getManagerProjects,
    getProjectTeams,
    getProjectTeam,
    getTeamLeader,
    getTeamMembers,
    getProjectRecipients,

    /* Manager messages */
    sendMessageToTeamLeader,
    getTeamLeaderConversation,
    getTeamLeaderMessages,
    getConversation,
    sendMessage,

    /* Manager mentions */
    mentionTeamLeader,
    createTeamLeaderMention,

    /* Manager activity */
    getManagerActivityFeed,
    getActivityFeed,
    getManagerActivityById,
    getActivityById,

    /* Announcements */
    sendProjectAnnouncement,
    createProjectAnnouncement,
    getAnnouncementPriorities,

    /* Contributor */
    getMyMessages,
    getMyMessageById,
    markMessageAsRead,
    getUnreadMessageCount,
    getProjectConversation,
    mentionTaskComment,

    /* Shared */
    getCommunicationTypes,
};