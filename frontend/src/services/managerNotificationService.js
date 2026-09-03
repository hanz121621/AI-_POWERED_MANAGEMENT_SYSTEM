import api from "@/services/api";

// ============================================================
// MANAGER NOTIFICATION SERVICE
// Backend:
// GET   /api/notifications
// GET   /api/notifications/{id}
// PATCH /api/notifications/{id}/read
// GET   /api/notifications/unread-count
// ============================================================

// ============================================================
// GET MY NOTIFICATIONS
// ============================================================

export async function getManagerNotifications() {
    try {
        const response = await api.get("/notifications");

        // Backend response:
        // {
        //   success: true,
        //   message: "...",
        //   data: [...]
        // }

        return response?.data?.data ?? [];
    } catch (error) {
        console.error(
            "Failed to load manager notifications:",
            error
        );

        throw error;
    }
}

// ============================================================
// GET ONE NOTIFICATION
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
        const response = await api.get(
            `/notifications/${notificationId}`
        );

        return response?.data?.data ?? null;
    } catch (error) {
        console.error(
            "Failed to load notification:",
            error
        );

        throw error;
    }
}

// ============================================================
// MARK ONE NOTIFICATION AS READ
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
        const response = await api.patch(
            `/notifications/${notificationId}/read`
        );

        return response?.data ?? null;
    } catch (error) {
        console.error(
            "Failed to mark notification as read:",
            error
        );

        throw error;
    }
}

// ============================================================
// GET UNREAD NOTIFICATION COUNT
// ============================================================

export async function getManagerUnreadNotificationCount() {
    try {
        const response = await api.get(
            "/notifications/unread-count"
        );

        return response?.data?.unreadCount ?? 0;
    } catch (error) {
        console.error(
            "Failed to load unread notification count:",
            error
        );

        throw error;
    }
}

// ============================================================
// MARK ALL NOTIFICATIONS AS READ
//
// The backend currently does NOT expose a mark-all endpoint.
// Therefore we intentionally do NOT invent an API route.
//
// This function uses the existing GET + PATCH endpoints:
// 1. Get the user's notifications.
// 2. Find unread notifications.
// 3. Mark each unread notification as read.
//
// This keeps the frontend compatible with the backend
// that currently exists.
// ============================================================

export async function markAllManagerNotificationsAsRead() {
    try {
        const notifications =
            await getManagerNotifications();

        const unreadNotifications =
            notifications.filter(
                (notification) =>
                    !notification?.isRead
            );

        if (unreadNotifications.length === 0) {
            return {
                success: true,
                count: 0,
                message:
                    "There are no unread notifications.",
            };
        }

        const results = await Promise.all(
            unreadNotifications
                .filter(
                    (notification) =>
                        notification?.id
                )
                .map((notification) =>
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