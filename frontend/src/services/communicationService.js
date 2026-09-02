
// ============================================================
// AIPMS COMMUNICATION SERVICE
// ============================================================
//
// Manager Communication Use Cases
//
// COMM-001 — View Notifications
// COMM-002 — Send Message to Team Leader
// COMM-003 — Mention Team Leader
// COMM-004 — View Activity Feed
// COMM-005 — Send Project Announcement
//
// IMPORTANT
// - No hard-coded project IDs
// - No hard-coded team IDs
// - No hard-coded user IDs
// - Uses authenticated API requests
// - Backend is responsible for authorization
// - Data is retrieved dynamically
// - Uses the shared AIPMS API client
// ============================================================

import api from "@/services/api";

// ============================================================
// ERROR HANDLER
// ============================================================

function handleApiError(error) {
    console.error(
        "Communication API error:",
        error
    );

    if (error?.response) {
        const responseData =
            error.response.data;

        if (typeof responseData === "string") {
            throw new Error(responseData);
        }

        throw new Error(
            responseData?.message ||
                responseData?.error ||
                responseData?.title ||
                `Request failed with status ${error.response.status}.`
        );
    }

    if (error?.request) {
        throw new Error(
            "Unable to connect to the server. Please check that the backend API is running."
        );
    }

    throw new Error(
        error?.message ||
            "Communication request failed."
    );
}

// ============================================================
// RESPONSE NORMALIZER
// ============================================================

function getResponseData(response) {
    return (
        response?.data?.data ??
        response?.data ??
        []
    );
}

// ============================================================
// ARRAY NORMALIZER
// ============================================================

function normalizeArray(
    result,
    propertyNames = []
) {
    if (Array.isArray(result)) {
        return result;
    }

    for (const property of propertyNames) {
        if (
            Array.isArray(
                result?.[property]
            )
        ) {
            return result[property];
        }
    }

    return [];
}

// ============================================================
// COMM-001
// VIEW MANAGER NOTIFICATIONS
// ============================================================
//
// Backend:
// GET /api/notifications
//
// Backend controller:
// [Authorize(Roles = "Manager,Contributor")]
// ============================================================

export async function getManagerNotifications() {
    try {
        const response =
            await api.get(
                "/notifications"
            );

        const data =
            getResponseData(response);

        return normalizeArray(data, [
            "notifications",
            "items",
            "data",
        ]);
    } catch (error) {
        handleApiError(error);
    }
}

// ============================================================
// GET SINGLE NOTIFICATION
// ============================================================
//
// Backend:
// GET /api/notifications/{id}
// ============================================================

export async function getManagerNotificationById(
    notificationId
) {
    if (!notificationId) {
        throw new Error(
            "Notification ID is required."
        );
    }

    try {
        const response =
            await api.get(
                `/notifications/${notificationId}`
            );

        return getResponseData(response);
    } catch (error) {
        handleApiError(error);
    }
}

// ============================================================
// MARK ONE NOTIFICATION AS READ
// ============================================================
//
// Backend:
// PATCH /api/notifications/{id}/read
// ============================================================

export async function markManagerNotificationAsRead(
    notificationId
) {
    if (!notificationId) {
        throw new Error(
            "Notification ID is required."
        );
    }

    try {
        const response =
            await api.patch(
                `/notifications/${notificationId}/read`
            );

        return response?.data ?? null;
    } catch (error) {
        handleApiError(error);
    }
}

// ============================================================
// GET UNREAD NOTIFICATION COUNT
// ============================================================
//
// Backend:
// GET /api/notifications/unread-count
// ============================================================

export async function getManagerUnreadNotificationCount() {
    try {
        const response =
            await api.get(
                "/notifications/unread-count"
            );

        return (
            response?.data?.unreadCount ??
            0
        );
    } catch (error) {
        handleApiError(error);
    }
}

// ============================================================
// MARK ALL MANAGER NOTIFICATIONS AS READ
// ============================================================
//
// IMPORTANT:
// The backend DOES NOT provide:
//
// PATCH /api/notifications/manager/read-all
//
// Therefore we retrieve the user's notifications and
// individually call:
//
// PATCH /api/notifications/{id}/read
//
// ============================================================

export async function markAllManagerNotificationsAsRead() {
    try {
        const notifications =
            await getManagerNotifications();

        const unreadNotifications =
            notifications.filter(
                (notification) =>
                    notification &&
                    !notification.isRead &&
                    notification.id
            );

        if (
            unreadNotifications.length ===
            0
        ) {
            return {
                success: true,
                count: 0,
                message:
                    "There are no unread notifications.",
            };
        }

        const results =
            await Promise.all(
                unreadNotifications.map(
                    (notification) =>
                        markManagerNotificationAsRead(
                            notification.id
                        )
                )
            );

        return {
            success: true,
            count: results.length,
            message:
                "All notifications marked as read.",
        };
    } catch (error) {
        console.error(
            "Failed to mark all manager notifications as read:",
            error
        );

        throw error;
    }
}

// ============================================================
// GET MANAGER PROJECTS
// ============================================================
//
// Backend expected:
// GET /api/projects/manager
//
// Uses shared api.js:
// http://localhost:5043/api
// ============================================================

export async function getManagerProjects() {
    try {
        const response =
            await api.get(
                "/projects/manager"
            );

        const data =
            getResponseData(response);

        return normalizeArray(data, [
            "projects",
            "items",
            "data",
        ]);
    } catch (error) {
        handleApiError(error);
    }
}

// ============================================================
// GET ALL TEAMS FOR A PROJECT
// ============================================================

export async function getProjectTeams(
    projectId
) {
    if (!projectId) {
        throw new Error(
            "Project ID is required."
        );
    }

    try {
        const response =
            await api.get(
                `/projects/${projectId}/teams`
            );

        const data =
            getResponseData(response);

        return normalizeArray(data, [
            "teams",
            "items",
            "data",
        ]);
    } catch (error) {
        handleApiError(error);
    }
}

// ============================================================
// GET SINGLE PROJECT TEAM
// ============================================================

export async function getProjectTeam(
    projectId,
    teamId
) {
    if (!projectId) {
        throw new Error(
            "Project ID is required."
        );
    }

    if (!teamId) {
        throw new Error(
            "Team ID is required."
        );
    }

    try {
        const response =
            await api.get(
                `/projects/${projectId}/teams/${teamId}`
            );

        return getResponseData(response);
    } catch (error) {
        handleApiError(error);
    }
}

// ============================================================
// GET TEAM LEADER
// ============================================================

export async function getTeamLeader(
    teamId
) {
    if (!teamId) {
        throw new Error(
            "Team ID is required."
        );
    }

    try {
        const response =
            await api.get(
                `/teams/${teamId}/leader`
            );

        return getResponseData(response);
    } catch (error) {
        handleApiError(error);
    }
}

// ============================================================
// GET TEAM MEMBERS
// ============================================================

export async function getTeamMembers(
    teamId
) {
    if (!teamId) {
        throw new Error(
            "Team ID is required."
        );
    }

    try {
        const response =
            await api.get(
                `/teams/${teamId}/members`
            );

        const data =
            getResponseData(response);

        return normalizeArray(data, [
            "members",
            "users",
            "items",
            "data",
        ]);
    } catch (error) {
        handleApiError(error);
    }
}

// ============================================================
// GET PROJECT RECIPIENTS
// ============================================================

export async function getProjectRecipients(
    projectId
) {
    if (!projectId) {
        throw new Error(
            "Project ID is required."
        );
    }

    try {
        const response =
            await api.get(
                `/projects/${projectId}/communication-recipients`
            );

        const data =
            getResponseData(response);

        return normalizeArray(data, [
            "recipients",
            "members",
            "users",
            "items",
            "data",
        ]);
    } catch (error) {
        handleApiError(error);
    }
}

// ============================================================
// COMM-002
// SEND MESSAGE TO TEAM LEADER
// ============================================================

export async function sendMessageToTeamLeader({
    projectId,
    teamId,
    teamLeaderId,
    message,
}) {
    if (!projectId) {
        throw new Error(
            "Project is required."
        );
    }

    if (!teamId) {
        throw new Error(
            "Team is required."
        );
    }

    if (!teamLeaderId) {
        throw new Error(
            "Team Leader is required."
        );
    }

    if (
        !message ||
        !String(message).trim()
    ) {
        throw new Error(
            "Message cannot be empty."
        );
    }

    try {
        const response =
            await api.post(
                "/communications/messages",
                {
                    projectId,
                    teamId,
                    recipientId:
                        teamLeaderId,
                    message:
                        String(
                            message
                        ).trim(),
                }
            );

        return getResponseData(response);
    } catch (error) {
        handleApiError(error);
    }
}

// ============================================================
// GET TEAM LEADER CONVERSATION
// ============================================================

export async function getTeamLeaderConversation({
    projectId,
    teamId,
    teamLeaderId,
} = {}) {
    if (!projectId) {
        throw new Error(
            "Project ID is required."
        );
    }

    if (!teamId) {
        throw new Error(
            "Team ID is required."
        );
    }

    try {
        const params = {
            projectId,
            teamId,
        };

        if (teamLeaderId) {
            params.teamLeaderId =
                teamLeaderId;
        }

        const response =
            await api.get(
                "/communications/messages",
                {
                    params,
                }
            );

        const data =
            getResponseData(response);

        return normalizeArray(data, [
            "messages",
            "conversation",
            "items",
            "data",
        ]);
    } catch (error) {
        handleApiError(error);
    }
}

// ============================================================
// COMM-002 COMPATIBILITY FUNCTION
// ============================================================

export async function getTeamLeaderMessages({
    projectId,
    teamId,
    teamLeaderId,
} = {}) {
    return getTeamLeaderConversation({
        projectId,
        teamId,
        teamLeaderId,
    });
}

// ============================================================
// ALIAS: GET CONVERSATION
// ============================================================

export async function getConversation({
    projectId,
    teamId,
    teamLeaderId,
} = {}) {
    return getTeamLeaderConversation({
        projectId,
        teamId,
        teamLeaderId,
    });
}

// ============================================================
// ALIAS: SEND MESSAGE
// ============================================================

export async function sendMessage({
    projectId,
    teamId,
    teamLeaderId,
    message,
}) {
    return sendMessageToTeamLeader({
        projectId,
        teamId,
        teamLeaderId,
        message,
    });
}

// ============================================================
// COMM-003
// MENTION TEAM LEADER
// ============================================================

export async function mentionTeamLeader({
    projectId,
    teamId,
    teamLeaderId,
    content,
    activityId = null,
}) {
    if (!projectId) {
        throw new Error(
            "Project is required."
        );
    }

    if (!teamId) {
        throw new Error(
            "Team is required."
        );
    }

    if (!teamLeaderId) {
        throw new Error(
            "Team Leader is required."
        );
    }

    if (
        !content ||
        !String(content).trim()
    ) {
        throw new Error(
            "Message or comment cannot be empty."
        );
    }

    try {
        const response =
            await api.post(
                "/communications/mentions",
                {
                    projectId,
                    teamId,
                    teamLeaderId,
                    content:
                        String(
                            content
                        ).trim(),
                    activityId,
                }
            );

        return getResponseData(response);
    } catch (error) {
        handleApiError(error);
    }
}

// ============================================================
// ALIAS: CREATE MENTION
// ============================================================

export async function createTeamLeaderMention(
    data
) {
    return mentionTeamLeader(data);
}

// ============================================================
// COMM-004
// VIEW MANAGER ACTIVITY FEED
// ============================================================

export async function getManagerActivityFeed(
    filters = {}
) {
    try {
        const response =
            await api.get(
                "/activities/manager",
                {
                    params: {
                        projectId:
                            filters.projectId ||
                            undefined,

                        teamId:
                            filters.teamId ||
                            undefined,

                        activityType:
                            filters.activityType ||
                            undefined,

                        startDate:
                            filters.startDate ||
                            undefined,

                        endDate:
                            filters.endDate ||
                            undefined,

                        search:
                            filters.search ||
                            undefined,

                        page:
                            filters.page ||
                            undefined,

                        pageSize:
                            filters.pageSize ||
                            undefined,
                    },
                }
            );

        return getResponseData(
            response
        );
    } catch (error) {
        handleApiError(error);
    }
}

// ============================================================
// ALIAS: GET ACTIVITY FEED
// ============================================================

export async function getActivityFeed(
    filters = {}
) {
    return getManagerActivityFeed(
        filters
    );
}

// ============================================================
// GET SINGLE ACTIVITY
// ============================================================

export async function getManagerActivityById(
    activityId
) {
    if (!activityId) {
        throw new Error(
            "Activity ID is required."
        );
    }

    try {
        const response =
            await api.get(
                `/activities/${activityId}`
            );

        return getResponseData(
            response
        );
    } catch (error) {
        handleApiError(error);
    }
}

// ============================================================
// ALIAS: GET ACTIVITY BY ID
// ============================================================

export async function getActivityById(
    activityId
) {
    return getManagerActivityById(
        activityId
    );
}

// ============================================================
// COMM-005
// SEND PROJECT ANNOUNCEMENT
// ============================================================

export async function sendProjectAnnouncement({
    projectId,
    teamId,
    title,
    message,
    priority,
    recipientIds = [],
}) {
    if (!projectId) {
        throw new Error(
            "Project is required."
        );
    }

    if (
        !title ||
        !String(title).trim()
    ) {
        throw new Error(
            "Announcement title is required."
        );
    }

    if (
        !message ||
        !String(message).trim()
    ) {
        throw new Error(
            "Announcement message is required."
        );
    }

    if (!priority) {
        throw new Error(
            "Announcement priority is required."
        );
    }

    if (
        !Array.isArray(
            recipientIds
        ) ||
        recipientIds.length === 0
    ) {
        throw new Error(
            "No valid recipients available."
        );
    }

    try {
        const response =
            await api.post(
                "/communications/announcements",
                {
                    projectId,

                    teamId:
                        teamId || null,

                    title:
                        String(
                            title
                        ).trim(),

                    message:
                        String(
                            message
                        ).trim(),

                    priority,

                    recipientIds,
                }
            );

        return getResponseData(
            response
        );
    } catch (error) {
        handleApiError(error);
    }
}

// ============================================================
// ALIAS: CREATE PROJECT ANNOUNCEMENT
// ============================================================

export async function createProjectAnnouncement(
    data
) {
    return sendProjectAnnouncement(
        data
    );
}

// ============================================================
// GET ANNOUNCEMENT PRIORITIES
// ============================================================

export async function getAnnouncementPriorities() {
    try {
        const response =
            await api.get(
                "/communications/announcement-priorities"
            );

        const data =
            getResponseData(response);

        return normalizeArray(data, [
            "priorities",
            "items",
            "data",
        ]);
    } catch (error) {
        handleApiError(error);
    }
}

// ============================================================
// GET COMMUNICATION TYPES
// ============================================================

export async function getCommunicationTypes() {
    try {
        const response =
            await api.get(
                "/communications/types"
            );

        const data =
            getResponseData(response);

        return normalizeArray(data, [
            "types",
            "items",
            "data",
        ]);
    } catch (error) {
        handleApiError(error);
    }
}

// ============================================================
// DEFAULT EXPORT
// ============================================================

const communicationService = {
    // --------------------------------------------------------
    // COMM-001
    // --------------------------------------------------------

    getManagerNotifications,
    getManagerNotificationById,
    markManagerNotificationAsRead,
    markAllManagerNotificationsAsRead,
    getManagerUnreadNotificationCount,

    // --------------------------------------------------------
    // PROJECTS / TEAMS
    // --------------------------------------------------------

    getManagerProjects,
    getProjectTeams,
    getProjectTeam,
    getTeamLeader,
    getTeamMembers,
    getProjectRecipients,

    // --------------------------------------------------------
    // COMM-002
    // --------------------------------------------------------

    sendMessageToTeamLeader,
    getTeamLeaderConversation,
    getTeamLeaderMessages,
    getConversation,
    sendMessage,

    // --------------------------------------------------------
    // COMM-003
    // --------------------------------------------------------

    mentionTeamLeader,
    createTeamLeaderMention,

    // --------------------------------------------------------
    // COMM-004
    // --------------------------------------------------------

    getManagerActivityFeed,
    getActivityFeed,
    getManagerActivityById,
    getActivityById,

    // --------------------------------------------------------
    // COMM-005
    // --------------------------------------------------------

    sendProjectAnnouncement,
    createProjectAnnouncement,
    getAnnouncementPriorities,

    // --------------------------------------------------------
    // COMMUNICATION CONFIGURATION
    // --------------------------------------------------------

    getCommunicationTypes,
};

// ============================================================
// EXPORT DEFAULT
// ============================================================

export default communicationService;

