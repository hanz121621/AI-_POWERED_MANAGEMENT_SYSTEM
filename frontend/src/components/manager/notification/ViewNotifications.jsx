
import { useEffect, useMemo, useState } from "react";

import {
    Bell,
    Check,
    CheckCheck,
    Clock,
    ExternalLink,
    RefreshCw,
    AlertCircle,
    Info,
} from "lucide-react";

import { Button } from "@/components/ui/button";

// ============================================================
// COMM-001 — VIEW NOTIFICATIONS
// ============================================================
//
// Primary Actor:
// Project Manager
//
// Goal:
// Allow the Manager to view notifications related to:
// - Assigned projects
// - Sprints
// - Teams
// - Project activities
//
// IMPORTANT:
// - Notifications must come from the backend.
// - No hard-coded notifications.
// - No hard-coded user IDs.
// - Only the authenticated Manager's notifications
//   should be returned by the backend.
// - Read/unread state must be persisted by the backend.
// ============================================================

// ------------------------------------------------------------
// SERVICE IMPORT
// ------------------------------------------------------------
//
// Connect these functions to your communication API service:
//
// getManagerNotifications()
// markNotificationAsRead(notificationId)
//
// Example service location:
// src/services/notificationService.js
//
// ------------------------------------------------------------

import {
    getManagerNotifications,
    markNotificationAsRead,
} from "@/services/notificationService";

function ViewNotifications() {
    // ========================================================
    // STATE
    // ========================================================

    const [notifications, setNotifications] = useState([]);

    const [loading, setLoading] = useState(true);

    const [refreshing, setRefreshing] = useState(false);

    const [error, setError] = useState("");

    const [selectedNotification, setSelectedNotification] =
        useState(null);

    const [filter, setFilter] = useState("all");

    const [markingRead, setMarkingRead] = useState(null);

    // ========================================================
    // LOAD NOTIFICATIONS
    // ========================================================

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        try {
            setLoading(true);
            setError("");

            const result =
                await getManagerNotifications();

            const notificationList =
                Array.isArray(result)
                    ? result
                    : result?.notifications || [];

            setNotifications(notificationList);
        } catch (error) {
            console.error(
                "Notification loading error:",
                error
            );

            setError(
                error?.message ||
                    "Unable to retrieve notifications."
            );
        } finally {
            setLoading(false);
        }
    };

    // ========================================================
    // REFRESH
    // ========================================================

    const handleRefresh = async () => {
        try {
            setRefreshing(true);
            setError("");

            const result =
                await getManagerNotifications();

            const notificationList =
                Array.isArray(result)
                    ? result
                    : result?.notifications || [];

            setNotifications(notificationList);
        } catch (error) {
            console.error(
                "Notification refresh error:",
                error
            );

            setError(
                error?.message ||
                    "Unable to refresh notifications."
            );
        } finally {
            setRefreshing(false);
        }
    };

    // ========================================================
    // NORMALIZE NOTIFICATION
    // ========================================================

    const normalizeNotification = (
        notification
    ) => {
        return {
            id:
                notification?.id ??
                notification?.notificationId,

            title:
                notification?.title ||
                notification?.subject ||
                "Notification",

            message:
                notification?.message ||
                notification?.content ||
                notification?.description ||
                "",

            type:
                notification?.type ||
                notification?.notificationType ||
                "Notification",

            isRead:
                Boolean(
                    notification?.isRead ??
                        notification?.read ??
                        false
                ),

            createdAt:
                notification?.createdAt ||
                notification?.createdDate ||
                notification?.timestamp ||
                null,

            projectId:
                notification?.projectId ??
                null,

            projectName:
                notification?.projectName ||
                "",

            activityId:
                notification?.activityId ??
                null,

            relatedEntityType:
                notification?.relatedEntityType ||
                notification?.entityType ||
                "",

            relatedEntityId:
                notification?.relatedEntityId ??
                notification?.entityId ??
                null,
        };
    };

    // ========================================================
    // NORMALIZED NOTIFICATIONS
    // ========================================================

    const normalizedNotifications = useMemo(() => {
        return notifications.map(
            normalizeNotification
        );
    }, [notifications]);

    // ========================================================
    // FILTER NOTIFICATIONS
    // ========================================================

    const filteredNotifications =
        useMemo(() => {
            if (filter === "unread") {
                return normalizedNotifications.filter(
                    (notification) =>
                        !notification.isRead
                );
            }

            if (filter === "read") {
                return normalizedNotifications.filter(
                    (notification) =>
                        notification.isRead
                );
            }

            return normalizedNotifications;
        }, [
            normalizedNotifications,
            filter,
        ]);

    // ========================================================
    // UNREAD COUNT
    // ========================================================

    const unreadCount = useMemo(() => {
        return normalizedNotifications.filter(
            (notification) =>
                !notification.isRead
        ).length;
    }, [normalizedNotifications]);

    // ========================================================
    // MARK AS READ
    // ========================================================

    const handleMarkAsRead = async (
        notification
    ) => {
        if (
            !notification?.id ||
            notification.isRead
        ) {
            return;
        }

        try {
            setMarkingRead(notification.id);
            setError("");

            await markNotificationAsRead(
                notification.id
            );

            setNotifications((previous) =>
                previous.map((item) => {
                    const itemId =
                        item?.id ??
                        item?.notificationId;

                    if (
                        String(itemId) !==
                        String(notification.id)
                    ) {
                        return item;
                    }

                    return {
                        ...item,
                        isRead: true,
                        read: true,
                    };
                })
            );

            setSelectedNotification(
                (previous) => {
                    if (!previous) {
                        return previous;
                    }

                    return {
                        ...previous,
                        isRead: true,
                    };
                }
            );
        } catch (error) {
            console.error(
                "Mark notification as read error:",
                error
            );

            setError(
                error?.message ||
                    "Unable to mark notification as read."
            );
        } finally {
            setMarkingRead(null);
        }
    };

    // ========================================================
    // SELECT NOTIFICATION
    // ========================================================

    const handleSelectNotification = async (
        notification
    ) => {
        setSelectedNotification(
            notification
        );

        if (!notification.isRead) {
            await handleMarkAsRead(
                notification
            );
        }
    };

    // ========================================================
    // NOTIFICATION ICON
    // ========================================================

    const getNotificationIcon = (
        type
    ) => {
        const normalized =
            String(type || "")
                .trim()
                .toLowerCase();

        if (
            normalized.includes("warning") ||
            normalized.includes("deadline") ||
            normalized.includes("risk")
        ) {
            return (
                <AlertCircle className="h-5 w-5 text-amber-600" />
            );
        }

        if (
            normalized.includes("ai") ||
            normalized.includes("recommend")
        ) {
            return (
                <Info className="h-5 w-5 text-indigo-600" />
            );
        }

        if (
            normalized.includes("sprint") ||
            normalized.includes("team") ||
            normalized.includes("project")
        ) {
            return (
                <Bell className="h-5 w-5 text-sky-600" />
            );
        }

        return (
            <Bell className="h-5 w-5 text-gray-600" />
        );
    };

    // ========================================================
    // DATE FORMAT
    // ========================================================

    const formatDate = (value) => {
        if (!value) {
            return "Date unavailable";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return String(value);
        }

        return date.toLocaleString();
    };

    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {
        return (
            <div className="min-h-full bg-gray-50 p-4 md:p-6">
                <div className="mx-auto max-w-7xl">
                    <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
                        <RefreshCw className="mx-auto mb-4 h-10 w-10 animate-spin text-indigo-600" />

                        <h2 className="text-lg font-semibold text-gray-900">
                            Loading notifications...
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            Retrieving your notifications.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="min-h-full bg-gray-50 p-4 md:p-6">
            <div className="mx-auto max-w-7xl">

                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                            <Bell className="h-6 w-6" />
                        </div>

                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                                    Notifications
                                </h1>

                                {unreadCount > 0 && (
                                    <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                                        {unreadCount} unread
                                    </span>
                                )}
                            </div>

                            <p className="mt-1 text-sm text-gray-500">
                                View notifications related to your
                                assigned projects, Sprints, Teams,
                                and project activities.
                            </p>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="gap-2 bg-white"
                    >
                        <RefreshCw
                            className={`h-4 w-4 ${
                                refreshing
                                    ? "animate-spin"
                                    : ""
                            }`}
                        />

                        Refresh
                    </Button>
                </div>

                {/* ==================================================
                    ERROR
                ================================================== */}

                {error && (
                    <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

                        <div>
                            {error}
                        </div>
                    </div>
                )}

                {/* ==================================================
                    FILTERS
                ================================================== */}

                <div className="mb-6 flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() =>
                            setFilter("all")
                        }
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                            filter === "all"
                                ? "bg-gray-900 text-white"
                                : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                        All
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            setFilter("unread")
                        }
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                            filter === "unread"
                                ? "bg-gray-900 text-white"
                                : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                        Unread
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            setFilter("read")
                        }
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                            filter === "read"
                                ? "bg-gray-900 text-white"
                                : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                        Read
                    </button>
                </div>

                {/* ==================================================
                    NO NOTIFICATIONS
                ================================================== */}

                {filteredNotifications.length === 0 && (
                    <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
                        <Bell className="mx-auto mb-4 h-12 w-12 text-gray-300" />

                        <h2 className="text-lg font-semibold text-gray-900">
                            No notifications available.
                        </h2>

                        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-gray-500">
                            There are currently no notifications
                            matching your selected filter.
                        </p>
                    </div>
                )}

                {/* ==================================================
                    NOTIFICATION LIST
                ================================================== */}

                {filteredNotifications.length > 0 && (
                    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">

                        {/* LIST */}

                        <div className="space-y-3">
                            {filteredNotifications.map(
                                (notification) => (
                                    <button
                                        key={
                                            notification.id
                                        }
                                        type="button"
                                        onClick={() =>
                                            handleSelectNotification(
                                                notification
                                            )
                                        }
                                        className={`w-full rounded-2xl border p-5 text-left transition hover:shadow-sm ${
                                            notification.isRead
                                                ? "border-gray-200 bg-white"
                                                : "border-indigo-200 bg-indigo-50/40"
                                        }`}
                                    >
                                        <div className="flex gap-4">

                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                                                {getNotificationIcon(
                                                    notification.type
                                                )}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-start justify-between gap-2">
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900">
                                                            {
                                                                notification.title
                                                            }
                                                        </h3>

                                                        <span className="mt-1 inline-block rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                                                            {
                                                                notification.type
                                                            }
                                                        </span>
                                                    </div>

                                                    {!notification.isRead && (
                                                        <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
                                                    )}
                                                </div>

                                                <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600">
                                                    {
                                                        notification.message
                                                    }
                                                </p>

                                                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-400">
                                                    <span className="flex items-center gap-1.5">
                                                        <Clock className="h-3.5 w-3.5" />

                                                        {formatDate(
                                                            notification.createdAt
                                                        )}
                                                    </span>

                                                    {notification.projectName && (
                                                        <span>
                                                            {
                                                                notification.projectName
                                                            }
                                                        </span>
                                                    )}

                                                    {notification.isRead && (
                                                        <span className="flex items-center gap-1 text-emerald-600">
                                                            <CheckCheck className="h-3.5 w-3.5" />

                                                            Read
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                )
                            )}
                        </div>

                        {/* ==================================================
                            DETAILS
                        ================================================== */}

                        <div className="lg:sticky lg:top-6 lg:self-start">
                            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                                {!selectedNotification ? (
                                    <div className="py-10 text-center">
                                        <Bell className="mx-auto mb-4 h-10 w-10 text-gray-300" />

                                        <h3 className="font-semibold text-gray-900">
                                            Notification Details
                                        </h3>

                                        <p className="mt-2 text-sm text-gray-500">
                                            Select a notification
                                            to view its related
                                            project or activity
                                            information.
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                                                    {
                                                        selectedNotification.type
                                                    }
                                                </span>

                                                <h2 className="mt-3 text-lg font-bold text-gray-900">
                                                    {
                                                        selectedNotification.title
                                                    }
                                                </h2>
                                            </div>

                                            {selectedNotification.isRead && (
                                                <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-emerald-600">
                                                    <Check className="h-4 w-4" />

                                                    Read
                                                </span>
                                            )}
                                        </div>

                                        <div className="mt-5 border-t border-gray-100 pt-5">
                                            <p className="text-sm leading-7 text-gray-600">
                                                {
                                                    selectedNotification.message
                                                }
                                            </p>
                                        </div>

                                        {selectedNotification.projectName && (
                                            <div className="mt-5 rounded-xl bg-gray-50 p-4">
                                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                                    Related Project
                                                </p>

                                                <p className="mt-1 text-sm font-semibold text-gray-900">
                                                    {
                                                        selectedNotification.projectName
                                                    }
                                                </p>
                                            </div>
                                        )}

                                        <div className="mt-5 flex items-center gap-2 text-xs text-gray-400">
                                            <Clock className="h-4 w-4" />

                                            {formatDate(
                                                selectedNotification.createdAt
                                            )}
                                        </div>

                                        {selectedNotification.relatedEntityId && (
                                            <div className="mt-5 flex items-center gap-2 text-xs text-gray-500">
                                                <ExternalLink className="h-4 w-4" />

                                                Related activity available
                                            </div>
                                        )}

                                        {!selectedNotification.isRead && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="mt-6 w-full gap-2"
                                                disabled={
                                                    markingRead ===
                                                    selectedNotification.id
                                                }
                                                onClick={() =>
                                                    handleMarkAsRead(
                                                        selectedNotification
                                                    )
                                                }
                                            >
                                                <Check className="h-4 w-4" />

                                                {markingRead ===
                                                selectedNotification.id
                                                    ? "Marking as read..."
                                                    : "Mark as read"}
                                            </Button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ViewNotifications;

