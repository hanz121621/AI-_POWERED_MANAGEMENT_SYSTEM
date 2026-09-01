
// ============================================================
// MANAGER NOTIFICATION SERVICE
// AIPMS
//
// COMM-001 — View Notifications
//
// Uses the existing AIPMS authentication system.
// NO notification localStorage.
// NO fake notification records.
//
// Authentication:
// - Uses getCurrentUser() from authService
// - Uses the existing api service
// - api.js handles the Bearer token/interceptor
// ============================================================

import api from "@/services/api";

import {
    getCurrentUser,
    normalizeUserRole,
} from "@/services/authService";

// ============================================================
// ENDPOINTS
// ============================================================
//
// IMPORTANT:
// api.js already has "/api" in its base configuration.
//
// Therefore DO NOT write:
//     /api/notifications/manager
//
// Use:
//     /notifications/manager
//
// Final request:
//     http://localhost:5043/api/notifications/manager
// ============================================================

const MANAGER_NOTIFICATIONS_ENDPOINT =
    "/notifications/manager";

const MARK_ALL_READ_ENDPOINT =
    "/notifications/manager/read-all";

const MARK_READ_ENDPOINT = (notificationId) =>
    `/notifications/${encodeURIComponent(
        notificationId
    )}/read`;

// ============================================================
// VALIDATE MANAGER
// ============================================================

function validateManager() {
    const currentUser = getCurrentUser();

    if (!currentUser) {
        throw new Error(
            "AUTHENTICATION_REQUIRED"
        );
    }

    const role = normalizeUserRole(
        currentUser.role ??
        currentUser.Role ??
        currentUser.roleId ??
        currentUser.RoleId
    );

    if (role !== "Manager") {
        throw new Error(
            "ACCESS_DENIED"
        );
    }

    return currentUser;
}

// ============================================================
// GET MANAGER NOTIFICATIONS
// ============================================================
//
// Backend:
// GET /api/notifications/manager
//
// api.js automatically provides:
// /api
//
// Therefore this service calls:
// /notifications/manager
// ============================================================

export async function getManagerNotifications() {
    validateManager();

    try {
        const response = await api.get(
            MANAGER_NOTIFICATIONS_ENDPOINT
        );

        const data = response.data;

        // ----------------------------------------------------
        // Support common backend response formats
        // ----------------------------------------------------

        if (Array.isArray(data)) {
            return data;
        }

        if (
            Array.isArray(
                data?.notifications
            )
        ) {
            return data.notifications;
        }

        if (
            Array.isArray(data?.items)
        ) {
            return data.items;
        }

        if (
            Array.isArray(data?.data)
        ) {
            return data.data;
        }

        return [];
    } catch (error) {
        console.error(
            "GET MANAGER NOTIFICATIONS ERROR:",
            error
        );

        // ----------------------------------------------------
        // Authentication
        // ----------------------------------------------------

        if (
            error?.response?.status === 401
        ) {
            throw new Error(
                "AUTHENTICATION_REQUIRED"
            );
        }

        // ----------------------------------------------------
        // Authorization
        // ----------------------------------------------------

        if (
            error?.response?.status === 403
        ) {
            throw new Error(
                "ACCESS_DENIED"
            );
        }

        throw error;
    }
}

// ============================================================
// MARK NOTIFICATION AS READ
// ============================================================
//
// Backend:
// PATCH /api/notifications/{id}/read
//
// Actual service path:
// PATCH /notifications/{id}/read
// ============================================================

export async function markManagerNotificationAsRead(
    notificationId
) {
    if (!notificationId) {
        throw new Error(
            "NOTIFICATION_ID_REQUIRED"
        );
    }

    validateManager();

    try {
        const response = await api.patch(
            MARK_READ_ENDPOINT(
                notificationId
            )
        );

        return (
            response.data ?? {
                success: true,
            }
        );
    } catch (error) {
        console.error(
            "MARK MANAGER NOTIFICATION READ ERROR:",
            error
        );

        if (
            error?.response?.status === 401
        ) {
            throw new Error(
                "AUTHENTICATION_REQUIRED"
            );
        }

        if (
            error?.response?.status === 403
        ) {
            throw new Error(
                "ACCESS_DENIED"
            );
        }

        throw error;
    }
}

// ============================================================
// MARK ALL MANAGER NOTIFICATIONS AS READ
// ============================================================
//
// Backend:
// PATCH /api/notifications/manager/read-all
//
// Actual service path:
// PATCH /notifications/manager/read-all
// ============================================================

export async function markAllManagerNotificationsAsRead() {
    validateManager();

    try {
        const response = await api.patch(
            MARK_ALL_READ_ENDPOINT
        );

        return (
            response.data ?? {
                success: true,
            }
        );
    } catch (error) {
        console.error(
            "MARK ALL MANAGER NOTIFICATIONS READ ERROR:",
            error
        );

        if (
            error?.response?.status === 401
        ) {
            throw new Error(
                "AUTHENTICATION_REQUIRED"
            );
        }

        if (
            error?.response?.status === 403
        ) {
            throw new Error(
                "ACCESS_DENIED"
            );
        }

        throw error;
    }
}

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
    getManagerNotifications,
    markManagerNotificationAsRead,
    markAllManagerNotificationsAsRead,
};

