import api from "./api";

/**
 * ============================================================
 * Communication Service
 * ============================================================
 *
 * Uses the shared API client from ./api.js.
 *
 * This ensures:
 * - Same backend URL
 * - Same JWT token handling
 * - Same Axios interceptors
 * - Same authentication configuration
 *
 * Backend:
 * http://localhost:5043/api
 */

/* ============================================================
   Helpers
   ============================================================ */

/**
 * Convert Axios errors into a consistent Error object.
 */
const handleApiError = (error, fallbackMessage) => {
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
 * Safely get response data.
 */
const getResponseData = (response) => {
    return response?.data ?? null;
};

/**
 * Normalize API array responses.
 *
 * Supports:
 * - []
 * - { data: [] }
 * - { items: [] }
 * - { results: [] }
 * - null
 */
const normalizeArray = (value) => {
    if (Array.isArray(value)) {
        return value;
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
   MANAGER COMMUNICATION
   ============================================================ */

/**
 * Get manager notifications.
 *
 * GET /api/notifications/manager
 */
export const getManagerNotifications = async () => {
    try {
        const response = await api.get("/notifications/manager");

        return normalizeArray(getResponseData(response));
    } catch (error) {
        return handleApiError(
            error,
            "Failed to load manager notifications."
        );
    }
};


/**
 * Mark one manager notification as read.
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
 * Mark all manager notifications as read.
 *
 * PATCH /api/notifications/manager/read-all
 */
export const markAllManagerNotificationsAsRead = async () => {
    try {
        const response = await api.patch(
            "/notifications/manager/read-all"
        );

        return getResponseData(response);
    } catch (error) {
        return handleApiError(
            error,
            "Failed to mark all notifications as read."
        );
    }
};


/**
 * Get projects belonging to the current manager.
 *
 * GET /api/projects/manager
 */
export const getManagerProjects = async () => {
    try {
        const response = await api.get("/projects/manager");

        return normalizeArray(getResponseData(response));
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

        return normalizeArray(getResponseData(response));
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

        return normalizeArray(getResponseData(response));
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

        return normalizeArray(getResponseData(response));
    } catch (error) {
        return handleApiError(
            error,
            "Failed to load communication recipients."
        );
    }
};


/**
 * Send a message to a team leader.
 *
 * POST /api/communications/messages
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
export const getTeamLeaderConversation = async (params = {}) => {
    try {
        const response = await api.get(
            "/communications/messages",
            {
                params,
            }
        );

        return normalizeArray(getResponseData(response));
    } catch (error) {
        return handleApiError(
            error,
            "Failed to load team leader conversation."
        );
    }
};


/**
 * Alias.
 */
export const getTeamLeaderMessages =
    getTeamLeaderConversation;


/**
 * Alias.
 */
export const getConversation =
    getTeamLeaderConversation;


/**
 * Alias.
 */
export const sendMessage =
    sendMessageToTeamLeader;


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


/**
 * Get manager activity feed.
 *
 * GET /api/activities/manager
 */
export const getManagerActivityFeed = async () => {
    try {
        const response = await api.get(
            "/activities/manager"
        );

        return normalizeArray(getResponseData(response));
    } catch (error) {
        return handleApiError(
            error,
            "Failed to load manager activity."
        );
    }
};


/**
 * Alias.
 */
export const getActivityFeed =
    getManagerActivityFeed;


/**
 * Alias.
 */
export const getManagerActivityById =
    getManagerActivityFeed;


/**
 * Alias.
 */
export const getActivityById =
    getManagerActivityFeed;


/**
 * Send project announcement.
 *
 * POST /api/communications/announcements
 */
export const sendProjectAnnouncement = async (payload) => {
    if (!payload) {
        throw new Error("Announcement payload is required.");
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
 * Alias.
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

        return normalizeArray(getResponseData(response));
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
 * Get messages received by the current contributor.
 *
 * BACKEND:
 * GET /api/communication/messages/inbox
 */
export const getMyMessages = async () => {
    try {
        const response = await api.get(
            "/communication/messages/inbox"
        );

        return normalizeArray(getResponseData(response));
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
 * BACKEND:
 * GET /api/communication/messages/inbox/{messageId}
 */
export const getMyMessageById = async (messageId) => {
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
 * BACKEND:
 * PATCH /api/communication/messages/inbox/{messageId}/read
 */
export const markMessageAsRead = async (messageId) => {
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
 * Get unread message count.
 *
 * BACKEND:
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
 * BACKEND:
 * GET /api/communication/messages/project/{projectId}
 */
export const getProjectConversation = async (projectId) => {
    if (!projectId) {
        throw new Error("Project ID is required.");
    }

    try {
        const response = await api.get(
            `/communication/messages/project/${projectId}`
        );

        return normalizeArray(getResponseData(response));
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
 * BACKEND:
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
        throw new Error("Task comment ID is required.");
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

        return normalizeArray(getResponseData(response));
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

        return normalizeArray(getResponseData(response));
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
    /* Manager */
    getManagerNotifications,
    markManagerNotificationAsRead,
    markAllManagerNotificationsAsRead,

    getManagerProjects,
    getProjectTeams,
    getProjectTeam,
    getTeamLeader,
    getTeamMembers,
    getProjectRecipients,

    sendMessageToTeamLeader,
    getTeamLeaderConversation,
    getTeamLeaderMessages,
    getConversation,
    sendMessage,

    mentionTeamLeader,
    createTeamLeaderMention,

    getManagerActivityFeed,
    getActivityFeed,
    getManagerActivityById,
    getActivityById,

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