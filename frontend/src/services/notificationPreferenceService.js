// ============================================================
// AIPMS NOTIFICATION PREFERENCES SERVICE
//
// SET-001 — Manage Notification Preferences
//
// Primary Actor:
// Project Manager
//
// Responsibilities:
// - Retrieve authenticated Manager notification preferences
// - Update notification preferences
// - Validate preference values
// - Reset notification preferences to defaults
//
// IMPORTANT:
// The authenticated Manager is determined by the backend
// authentication token. Do not send a Manager/user ID from
// the frontend to identify the owner of these preferences.
// ============================================================

import api from "@/services/api";

// ============================================================
// API ENDPOINT
// ============================================================

const NOTIFICATION_PREFERENCES_ENDPOINT =
    "/NotificationPreferences";

// ============================================================
// DEFAULT NOTIFICATION PREFERENCES
// ============================================================

export const DEFAULT_NOTIFICATION_PREFERENCES = {
    taskAssigned: true,
    taskUpdated: true,
    taskCompleted: true,
    projectUpdates: true,
    sprintUpdates: true,
    riskAlerts: true,
    deadlineAlerts: true,
    teamActivity: true,
    emailNotifications: true,
    inAppNotifications: true,
};

// ============================================================
// NOTIFICATION PREFERENCE NAMES
// ============================================================

export const NOTIFICATION_PREFERENCE_NAMES = [
    "taskAssigned",
    "taskUpdated",
    "taskCompleted",
    "projectUpdates",
    "sprintUpdates",
    "riskAlerts",
    "deadlineAlerts",
    "teamActivity",
    "emailNotifications",
    "inAppNotifications",
];

// ============================================================
// NORMALIZE PREFERENCES
// ============================================================

export function normalizeNotificationPreferences(
    data
) {
    if (!data || typeof data !== "object") {
        return {
            ...DEFAULT_NOTIFICATION_PREFERENCES,
        };
    }

    return {
        taskAssigned:
            typeof data.taskAssigned === "boolean"
                ? data.taskAssigned
                : DEFAULT_NOTIFICATION_PREFERENCES.taskAssigned,

        taskUpdated:
            typeof data.taskUpdated === "boolean"
                ? data.taskUpdated
                : DEFAULT_NOTIFICATION_PREFERENCES.taskUpdated,

        taskCompleted:
            typeof data.taskCompleted === "boolean"
                ? data.taskCompleted
                : DEFAULT_NOTIFICATION_PREFERENCES.taskCompleted,

        projectUpdates:
            typeof data.projectUpdates === "boolean"
                ? data.projectUpdates
                : DEFAULT_NOTIFICATION_PREFERENCES.projectUpdates,

        sprintUpdates:
            typeof data.sprintUpdates === "boolean"
                ? data.sprintUpdates
                : DEFAULT_NOTIFICATION_PREFERENCES.sprintUpdates,

        riskAlerts:
            typeof data.riskAlerts === "boolean"
                ? data.riskAlerts
                : DEFAULT_NOTIFICATION_PREFERENCES.riskAlerts,

        deadlineAlerts:
            typeof data.deadlineAlerts === "boolean"
                ? data.deadlineAlerts
                : DEFAULT_NOTIFICATION_PREFERENCES.deadlineAlerts,

        teamActivity:
            typeof data.teamActivity === "boolean"
                ? data.teamActivity
                : DEFAULT_NOTIFICATION_PREFERENCES.teamActivity,

        emailNotifications:
            typeof data.emailNotifications === "boolean"
                ? data.emailNotifications
                : DEFAULT_NOTIFICATION_PREFERENCES.emailNotifications,

        inAppNotifications:
            typeof data.inAppNotifications === "boolean"
                ? data.inAppNotifications
                : DEFAULT_NOTIFICATION_PREFERENCES.inAppNotifications,
    };
}

// ============================================================
// VALIDATE PREFERENCES
// ============================================================

export function validateNotificationPreferences(
    preferences
) {
    if (
        !preferences ||
        typeof preferences !== "object"
    ) {
        return {
            valid: false,
            error:
                "Notification preferences are required.",
        };
    }

    for (
        const preferenceName of
        NOTIFICATION_PREFERENCE_NAMES
    ) {
        if (
            typeof preferences[
                preferenceName
            ] !== "boolean"
        ) {
            return {
                valid: false,
                error:
                    `${preferenceName} must be true or false.`,
            };
        }
    }

    return {
        valid: true,
        error: "",
    };
}

// ============================================================
// GET NOTIFICATION PREFERENCES
// ============================================================
//
// Retrieves preferences for the authenticated Manager.
//
// ============================================================

export async function getNotificationPreferences() {
    try {
        const response = await api.get(
            NOTIFICATION_PREFERENCES_ENDPOINT
        );

        const data = response?.data;

        // Support both:
        //
        // { ...preferences }
        //
        // and:
        //
        // { preferences: { ... } }

        const preferences =
            data?.preferences &&
            typeof data.preferences === "object"
                ? data.preferences
                : data;

        return normalizeNotificationPreferences(
            preferences
        );
    } catch (error) {
        console.error(
            "GET NOTIFICATION PREFERENCES ERROR:",
            error
        );

        // ----------------------------------------------------
        // NEW MANAGER / NO SAVED PREFERENCES
        // ----------------------------------------------------

        if (
            error?.response?.status === 404
        ) {
            return {
                ...DEFAULT_NOTIFICATION_PREFERENCES,
            };
        }

        throw new Error(
            error?.response?.data?.message ||
            error?.response?.data?.detail ||
            "Unable to load notification preferences."
        );
    }
}

// ============================================================
// UPDATE NOTIFICATION PREFERENCES
// ============================================================
//
// Saves preferences for the authenticated Manager.
//
// ============================================================

export async function updateNotificationPreferences(
    preferences
) {
    const normalizedPreferences =
        normalizeNotificationPreferences(
            preferences
        );

    const validation =
        validateNotificationPreferences(
            normalizedPreferences
        );

    if (!validation.valid) {
        return {
            success: false,
            error: validation.error,
        };
    }

    try {
        const response = await api.put(
            NOTIFICATION_PREFERENCES_ENDPOINT,
            normalizedPreferences
        );

        return {
            success: true,

            data:
                response?.data ||
                normalizedPreferences,

            message:
                response?.data?.message ||
                "Notification preferences updated successfully.",
        };
    } catch (error) {
        console.error(
            "UPDATE NOTIFICATION PREFERENCES ERROR:",
            error
        );

        return {
            success: false,

            error:
                error?.response?.data?.message ||
                error?.response?.data?.detail ||
                "Unable to update notification preferences.",

            status:
                error?.response?.status,

            details:
                error?.response?.data,
        };
    }
}

// ============================================================
// RESET NOTIFICATION PREFERENCES
// ============================================================
//
// Restores the authenticated Manager's preferences to
// the default configuration.
//
// ============================================================

export async function resetNotificationPreferences() {
    return updateNotificationPreferences({
        ...DEFAULT_NOTIFICATION_PREFERENCES,
    });
}

// ============================================================
// UPDATE SINGLE PREFERENCE
// ============================================================
//
// Example:
//
// updateNotificationPreference(
//     "riskAlerts",
//     false
// )
//
// ============================================================

export async function updateNotificationPreference(
    preferenceName,
    value
) {
    if (
        !NOTIFICATION_PREFERENCE_NAMES.includes(
            preferenceName
        )
    ) {
        return {
            success: false,
            error:
                "The selected notification preference is not supported.",
        };
    }

    if (typeof value !== "boolean") {
        return {
            success: false,
            error:
                "Notification preference value must be true or false.",
        };
    }

    let currentPreferences;

    try {
        currentPreferences =
            await getNotificationPreferences();
    } catch (error) {
        return {
            success: false,
            error:
                error?.message ||
                "Unable to load current notification preferences.",
        };
    }

    const updatedPreferences = {
        ...currentPreferences,

        [preferenceName]:
            value,
    };

    return updateNotificationPreferences(
        updatedPreferences
    );
}

// ============================================================
// ENABLE / DISABLE HELPERS
// ============================================================

export async function enableTaskAssignedNotifications() {
    return updateNotificationPreference(
        "taskAssigned",
        true
    );
}

export async function disableTaskAssignedNotifications() {
    return updateNotificationPreference(
        "taskAssigned",
        false
    );
}

export async function enableTaskUpdatedNotifications() {
    return updateNotificationPreference(
        "taskUpdated",
        true
    );
}

export async function disableTaskUpdatedNotifications() {
    return updateNotificationPreference(
        "taskUpdated",
        false
    );
}

export async function enableTaskCompletedNotifications() {
    return updateNotificationPreference(
        "taskCompleted",
        true
    );
}

export async function disableTaskCompletedNotifications() {
    return updateNotificationPreference(
        "taskCompleted",
        false
    );
}

export async function enableProjectUpdateNotifications() {
    return updateNotificationPreference(
        "projectUpdates",
        true
    );
}

export async function disableProjectUpdateNotifications() {
    return updateNotificationPreference(
        "projectUpdates",
        false
    );
}

export async function enableSprintUpdateNotifications() {
    return updateNotificationPreference(
        "sprintUpdates",
        true
    );
}

export async function disableSprintUpdateNotifications() {
    return updateNotificationPreference(
        "sprintUpdates",
        false
    );
}

export async function enableRiskAlerts() {
    return updateNotificationPreference(
        "riskAlerts",
        true
    );
}

export async function disableRiskAlerts() {
    return updateNotificationPreference(
        "riskAlerts",
        false
    );
}

export async function enableDeadlineAlerts() {
    return updateNotificationPreference(
        "deadlineAlerts",
        true
    );
}

export async function disableDeadlineAlerts() {
    return updateNotificationPreference(
        "deadlineAlerts",
        false
    );
}

export async function enableTeamActivityNotifications() {
    return updateNotificationPreference(
        "teamActivity",
        true
    );
}

export async function disableTeamActivityNotifications() {
    return updateNotificationPreference(
        "teamActivity",
        false
    );
}

export async function enableEmailNotifications() {
    return updateNotificationPreference(
        "emailNotifications",
        true
    );
}

export async function disableEmailNotifications() {
    return updateNotificationPreference(
        "emailNotifications",
        false
    );
}

export async function enableInAppNotifications() {
    return updateNotificationPreference(
        "inAppNotifications",
        true
    );
}

export async function disableInAppNotifications() {
    return updateNotificationPreference(
        "inAppNotifications",
        false
    );
}

// ============================================================
// DEFAULT EXPORT
// ============================================================

const notificationPreferenceService = {
    getNotificationPreferences,
    updateNotificationPreferences,
    updateNotificationPreference,
    resetNotificationPreferences,

    enableTaskAssignedNotifications,
    disableTaskAssignedNotifications,

    enableTaskUpdatedNotifications,
    disableTaskUpdatedNotifications,

    enableTaskCompletedNotifications,
    disableTaskCompletedNotifications,

    enableProjectUpdateNotifications,
    disableProjectUpdateNotifications,

    enableSprintUpdateNotifications,
    disableSprintUpdateNotifications,

    enableRiskAlerts,
    disableRiskAlerts,

    enableDeadlineAlerts,
    disableDeadlineAlerts,

    enableTeamActivityNotifications,
    disableTeamActivityNotifications,

    enableEmailNotifications,
    disableEmailNotifications,

    enableInAppNotifications,
    disableInAppNotifications,

    normalizeNotificationPreferences,
    validateNotificationPreferences,

    DEFAULT_NOTIFICATION_PREFERENCES,
    NOTIFICATION_PREFERENCE_NAMES,
};

export default notificationPreferenceService;