import { useEffect, useMemo, useState } from "react";

import {
    Bell,
    BellRing,
    Check,
    CheckCheck,
    Trash2,
    Search,
    RefreshCw,
    AlertCircle,
    Info,
    CheckCircle2,
    AlertTriangle,
    CalendarDays,
    Loader2,
} from "lucide-react";

import api from "../../../../services/api";

// ============================================================
// HELPERS
// ============================================================

function getMessageId(message) {
    return (
        message?.id ??
        message?.Id ??
        ""
    );
}

function getTitle(message) {
    return (
        message?.title ??
        message?.Title ??
        "Message"
    );
}

function getMessageContent(message) {
    return (
        message?.message ??
        message?.Message ??
        message?.content ??
        message?.Content ??
        ""
    );
}

function getCreatedAt(message) {
    return (
        message?.createdAt ??
        message?.CreatedAt ??
        null
    );
}

function getIsRead(message) {
    return (
        message?.isRead ??
        message?.IsRead ??
        false
    );
}

function getSenderName(message) {
    return (
        message?.senderName ??
        message?.SenderName ??
        "Unknown User"
    );
}

function getReceiverName(message) {
    return (
        message?.receiverName ??
        message?.ReceiverName ??
        "Unknown User"
    );
}

// ============================================================
// NOTIFICATION TYPE
//
// Communication messages are represented as "message"
// notifications because the current backend Message entity
// does not contain a notification type.
// ============================================================

function getNotificationType() {
    return "message";
}

// ============================================================
// NOTIFICATION ICON
// ============================================================

function NotificationTypeIcon({ type }) {
    if (type === "success") {
        return (
            <CheckCircle2
                size={20}
                className="text-primary"
            />
        );
    }

    if (type === "warning") {
        return (
            <AlertTriangle
                size={20}
                className="text-primary"
            />
        );
    }

    if (type === "error") {
        return (
            <AlertCircle
                size={20}
                className="text-primary"
            />
        );
    }

    if (type === "task") {
        return (
            <Check
                size={20}
                className="text-primary"
            />
        );
    }

    if (type === "message") {
        return (
            <BellRing
                size={20}
                className="text-primary"
            />
        );
    }

    return (
        <Info
            size={20}
            className="text-primary"
        />
    );
}

// ============================================================
// FORMAT DATE
// ============================================================

function formatDate(dateValue) {
    if (!dateValue) {
        return "Unknown date";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "Unknown date";
    }

    return date.toLocaleString();
}

// ============================================================
// TYPE LABEL
// ============================================================

function getTypeLabel(type) {
    const labels = {
        task: "Task",
        message: "Message",
        success: "Success",
        warning: "Warning",
        error: "Error",
        system: "System",
        info: "Information",
    };

    return labels[type] || "Notification";
}

// ============================================================
// API ERROR MESSAGE
// ============================================================

function getApiErrorMessage(error, fallback) {
    return (
        error?.response?.data?.message ||
        error?.response?.data?.title ||
        error?.message ||
        fallback
    );
}

// ============================================================
// CONVERT BACKEND MESSAGE TO UI NOTIFICATION
// ============================================================

function mapMessageToNotification(message) {
    return {
        id: getMessageId(message),

        title: getTitle(message),

        message: getMessageContent(message),

        type: getNotificationType(message),

        createdAt: getCreatedAt(message),

        read: getIsRead(message),

        senderName: getSenderName(message),

        receiverName: getReceiverName(message),

        projectId:
            message?.projectId ??
            message?.ProjectId ??
            null,

        teamId:
            message?.teamId ??
            message?.TeamId ??
            null,

        taskId:
            message?.taskId ??
            message?.TaskId ??
            null,
    };
}

// ============================================================
// MAIN COMPONENT
// ============================================================

function ViewNotifications() {
    // ========================================================
    // STATE
    // ========================================================

    const [notifications, setNotifications] =
        useState([]);

    const [searchTerm, setSearchTerm] =
        useState("");

    const [filter, setFilter] =
        useState("all");

    const [statusMessage, setStatusMessage] =
        useState("");

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [markingReadId, setMarkingReadId] =
        useState(null);

    const [markingAllRead, setMarkingAllRead] =
        useState(false);

    // ========================================================
    // STATUS MESSAGE
    // ========================================================

    const showStatus = (text) => {
        setStatusMessage(text);

        setTimeout(() => {
            setStatusMessage("");
        }, 2500);
    };

    // ========================================================
    // LOAD NOTIFICATIONS
    //
    // GET:
    // /api/communication/messages/inbox
    // ========================================================

    const loadNotifications = async () => {
        setError("");

        try {
            const response =
                await api.get(
                    "/communication/messages/inbox"
                );

            // Backend currently returns:
            //
            // [
            //     {
            //         id,
            //         senderId,
            //         senderName,
            //         receiverId,
            //         receiverName,
            //         projectId,
            //         teamId,
            //         taskId,
            //         title,
            //         message,
            //         isRead,
            //         readAt,
            //         createdAt
            //     }
            // ]

            const data =
                response?.data?.data ??
                response?.data;

            const backendMessages =
                Array.isArray(data)
                    ? data
                    : [];

            const mappedNotifications =
                backendMessages.map(
                    mapMessageToNotification
                );

            setNotifications(
                mappedNotifications
            );

            return mappedNotifications;
        } catch (err) {
            console.error(
                "Failed to load notifications:",
                err
            );

            setError(
                getApiErrorMessage(
                    err,
                    "Failed to load notifications."
                )
            );

            return [];
        }
    };

    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {
        const initialize = async () => {
            setLoading(true);

            await loadNotifications();

            setLoading(false);
        };

        initialize();
    }, []);

    // ========================================================
    // REFRESH
    // ========================================================

    const handleRefresh = async () => {
        setRefreshing(true);
        setError("");
        setStatusMessage("");

        await loadNotifications();

        setRefreshing(false);

        showStatus(
            "Notifications refreshed."
        );
    };

    // ========================================================
    // MARK ONE AS READ
    //
    // PATCH:
    // /api/communication/messages/inbox/{messageId}/read
    // ========================================================

    const handleMarkAsRead = async (
        notificationId
    ) => {
        if (!notificationId) {
            return;
        }

        setError("");
        setMarkingReadId(
            notificationId
        );

        try {
            await api.patch(
                `/communication/messages/inbox/${notificationId}/read`
            );

            setNotifications(
                (previous) =>
                    previous.map(
                        (notification) =>
                            String(
                                notification.id
                            ) ===
                            String(
                                notificationId
                            )
                                ? {
                                      ...notification,
                                      read: true,
                                  }
                                : notification
                    )
            );

            showStatus(
                "Notification marked as read."
            );
        } catch (err) {
            console.error(
                "Failed to mark notification as read:",
                err
            );

            setError(
                getApiErrorMessage(
                    err,
                    "Failed to mark notification as read."
                )
            );
        } finally {
            setMarkingReadId(null);
        }
    };

    // ========================================================
    // MARK ALL AS READ
    //
    // The current backend exposes mark-one-as-read,
    // but does NOT expose a mark-all endpoint.
    //
    // Therefore we call the existing backend endpoint for
    // every unread message.
    // ========================================================

    const handleMarkAllAsRead = async () => {
        const unread =
            notifications.filter(
                (notification) =>
                    !notification.read
            );

        if (unread.length === 0) {
            return;
        }

        setError("");
        setMarkingAllRead(true);

        try {
            await Promise.all(
                unread.map(
                    (notification) =>
                        api.patch(
                            `/communication/messages/inbox/${notification.id}/read`
                        )
                )
            );

            setNotifications(
                (previous) =>
                    previous.map(
                        (notification) => ({
                            ...notification,
                            read: true,
                        })
                    )
            );

            showStatus(
                "All notifications marked as read."
            );
        } catch (err) {
            console.error(
                "Failed to mark all notifications as read:",
                err
            );

            setError(
                getApiErrorMessage(
                    err,
                    "Failed to mark all notifications as read."
                )
            );

            // Reload from backend so the UI reflects
            // the actual database state.
            await loadNotifications();
        } finally {
            setMarkingAllRead(false);
        }
    };

    // ========================================================
    // DELETE
    //
    // IMPORTANT:
    // Your current backend does NOT provide a delete-message
    // endpoint.
    //
    // Therefore we do NOT fake deletion with localStorage
    // or remove it only from React state.
    //
    // This action is intentionally not performed against
    // the database until a backend delete endpoint exists.
    // ========================================================

    const handleDelete = () => {
        setError(
            "Delete notification is not available because the backend does not currently provide a delete-message endpoint."
        );
    };

    // ========================================================
    // CLEAR ALL
    //
    // Same reason as DELETE:
    // there is currently no backend endpoint for clearing
    // messages.
    // ========================================================

    const handleClearAll = () => {
        setError(
            "Clear all notifications is not available because the backend does not currently provide a clear-messages endpoint."
        );
    };

    // ========================================================
    // FILTER
    // ========================================================

    const filteredNotifications =
        useMemo(() => {
            const search =
                searchTerm
                    .trim()
                    .toLowerCase();

            return notifications.filter(
                (notification) => {
                    const matchesFilter =
                        filter === "all" ||
                        (filter ===
                            "unread" &&
                            !notification.read) ||
                        (filter ===
                            "read" &&
                            notification.read);

                    if (!matchesFilter) {
                        return false;
                    }

                    if (!search) {
                        return true;
                    }

                    const title =
                        String(
                            notification.title ||
                                ""
                        ).toLowerCase();

                    const message =
                        String(
                            notification.message ||
                                ""
                        ).toLowerCase();

                    const type =
                        String(
                            notification.type ||
                                ""
                        ).toLowerCase();

                    const sender =
                        String(
                            notification.senderName ||
                                ""
                        ).toLowerCase();

                    const receiver =
                        String(
                            notification.receiverName ||
                                ""
                        ).toLowerCase();

                    return (
                        title.includes(search) ||
                        message.includes(search) ||
                        type.includes(search) ||
                        sender.includes(search) ||
                        receiver.includes(search)
                    );
                }
            );
        }, [
            notifications,
            searchTerm,
            filter,
        ]);

    // ========================================================
    // SUMMARY
    // ========================================================

    const totalNotifications =
        notifications.length;

    const unreadNotifications =
        notifications.filter(
            (notification) =>
                !notification.read
        ).length;

    const readNotifications =
        notifications.filter(
            (notification) =>
                notification.read
        ).length;

    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center text-foreground">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Loader2
                        size={20}
                        className="animate-spin"
                    />

                    Loading notifications...
                </div>
            </div>
        );
    }

    // ========================================================
    // UI
    // ========================================================

    return (
        <div className="w-full space-y-6 text-foreground">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div className="flex items-center gap-3">

                    <div className="rounded-xl bg-primary/10 p-3">
                        <Bell
                            size={24}
                            className="text-primary"
                        />
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-foreground">
                            View Notifications
                        </h2>

                        <p className="text-sm text-muted-foreground">
                            View task, project, sprint, and
                            system notifications.
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">

                    {/* REFRESH */}

                    <button
                        type="button"
                        onClick={
                            handleRefresh
                        }
                        disabled={
                            refreshing
                        }
                        className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <RefreshCw
                            size={16}
                            className={
                                refreshing
                                    ? "animate-spin"
                                    : ""
                            }
                        />

                        {refreshing
                            ? "Refreshing..."
                            : "Refresh"}
                    </button>

                    {/* MARK ALL READ */}

                    {unreadNotifications >
                        0 && (
                        <button
                            type="button"
                            onClick={
                                handleMarkAllAsRead
                            }
                            disabled={
                                markingAllRead
                            }
                            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {markingAllRead ? (
                                <Loader2
                                    size={16}
                                    className="animate-spin"
                                />
                            ) : (
                                <CheckCheck
                                    size={16}
                                />
                            )}

                            {markingAllRead
                                ? "Marking..."
                                : "Mark All Read"}
                        </button>
                    )}

                    {/* CLEAR ALL */}

                    {totalNotifications >
                        0 && (
                        <button
                            type="button"
                            onClick={
                                handleClearAll
                            }
                            className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted/80 hover:text-foreground"
                        >
                            <Trash2
                                size={16}
                            />

                            Clear All
                        </button>
                    )}
                </div>
            </div>

            {/* ==================================================
                STATUS
            ================================================== */}

            {statusMessage && (
                <div className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
                    <CheckCircle2
                        size={18}
                    />

                    {statusMessage}
                </div>
            )}

            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (
                <div className="flex items-start gap-2 rounded-xl border border-border bg-muted px-4 py-3 text-sm text-muted-foreground">

                    <AlertCircle
                        size={18}
                        className="mt-0.5 shrink-0"
                    />

                    <span>
                        {error}
                    </span>
                </div>
            )}

            {/* ==================================================
                SUMMARY
            ================================================== */}

            <div className="grid gap-4 sm:grid-cols-3">

                <div className="rounded-xl border border-border bg-card p-4">

                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                        Total
                    </p>

                    <p className="mt-2 text-2xl font-bold text-card-foreground">
                        {
                            totalNotifications
                        }
                    </p>
                </div>

                <div className="rounded-xl border border-border bg-card p-4">

                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                        Unread
                    </p>

                    <p className="mt-2 text-2xl font-bold text-primary">
                        {
                            unreadNotifications
                        }
                    </p>
                </div>

                <div className="rounded-xl border border-border bg-card p-4">

                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                        Read
                    </p>

                    <p className="mt-2 text-2xl font-bold text-primary">
                        {
                            readNotifications
                        }
                    </p>
                </div>
            </div>

            {/* ==================================================
                SEARCH + FILTER
            ================================================== */}

            <div className="rounded-2xl border border-border bg-card p-4">

                <div className="flex flex-col gap-4 md:flex-row">

                    <div className="relative flex-1">

                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        />

                        <input
                            type="text"
                            value={
                                searchTerm
                            }
                            onChange={(
                                event
                            ) =>
                                setSearchTerm(
                                    event.target
                                        .value
                                )
                            }
                            placeholder="Search notifications..."
                            className="w-full rounded-lg border border-border bg-muted py-2.5 pl-10 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
                        />
                    </div>

                    <div className="flex rounded-lg border border-border bg-muted p-1">

                        {[
                            [
                                "all",
                                "All",
                            ],
                            [
                                "unread",
                                "Unread",
                            ],
                            [
                                "read",
                                "Read",
                            ],
                        ].map(
                            ([
                                value,
                                label,
                            ]) => (
                                <button
                                    key={
                                        value
                                    }
                                    type="button"
                                    onClick={() =>
                                        setFilter(
                                            value
                                        )
                                    }
                                    className={`rounded-md px-4 py-2 text-sm transition ${
                                        filter ===
                                        value
                                            ? "bg-primary text-primary-foreground"
                                            : "text-muted-foreground hover:bg-card hover:text-foreground"
                                    }`}
                                >
                                    {
                                        label
                                    }
                                </button>
                            )
                        )}
                    </div>
                </div>
            </div>

            {/* ==================================================
                NOTIFICATIONS
            ================================================== */}

            <div className="rounded-2xl border border-border bg-card">

                <div className="border-b border-border p-5">

                    <h3 className="font-semibold text-card-foreground">
                        Notifications
                    </h3>

                </div>

                <div className="p-4">

                    {filteredNotifications.length ===
                    0 ? (
                        <div className="py-16 text-center">

                            <Bell
                                size={38}
                                className="mx-auto mb-4 text-muted-foreground"
                            />

                            <h3 className="font-semibold text-card-foreground">
                                No notifications
                            </h3>

                            <p className="mt-2 text-sm text-muted-foreground">
                                You don't have any
                                notifications matching
                                the current filter.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">

                            {filteredNotifications.map(
                                (
                                    notification
                                ) => (
                                    <div
                                        key={
                                            notification.id
                                        }
                                        className={`rounded-xl border p-4 transition ${
                                            notification.read
                                                ? "border-border bg-card"
                                                : "border-primary/30 bg-primary/10"
                                        }`}
                                    >

                                        <div className="flex items-start gap-4">

                                            {/* ICON */}

                                            <div
                                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                                                    notification.read
                                                        ? "bg-muted"
                                                        : "bg-primary/10"
                                                }`}
                                            >
                                                <NotificationTypeIcon
                                                    type={
                                                        notification.type
                                                    }
                                                />
                                            </div>

                                            {/* CONTENT */}

                                            <div className="min-w-0 flex-1">

                                                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">

                                                    <div>

                                                        <div className="flex flex-wrap items-center gap-2">

                                                            <h4
                                                                className={`font-semibold ${
                                                                    notification.read
                                                                        ? "text-muted-foreground"
                                                                        : "text-foreground"
                                                                }`}
                                                            >
                                                                {
                                                                    notification.title
                                                                }
                                                            </h4>

                                                            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                                                                {getTypeLabel(
                                                                    notification.type
                                                                )}
                                                            </span>

                                                            {!notification.read && (
                                                                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                                                                    Unread
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* SENDER */}

                                                        <p className="mt-2 text-xs text-muted-foreground">
                                                            From:{" "}
                                                            <span className="font-medium text-foreground">
                                                                {
                                                                    notification.senderName
                                                                }
                                                            </span>
                                                        </p>

                                                        {/* MESSAGE */}

                                                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                                                            {
                                                                notification.message
                                                            }
                                                        </p>

                                                        {/* DATE */}

                                                        <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">

                                                            <CalendarDays
                                                                size={
                                                                    13
                                                                }
                                                            />

                                                            {formatDate(
                                                                notification.createdAt
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* ACTIONS */}

                                                    <div className="flex shrink-0 items-center gap-2">

                                                        {/* MARK READ */}

                                                        {!notification.read && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleMarkAsRead(
                                                                        notification.id
                                                                    )
                                                                }
                                                                disabled={
                                                                    markingReadId ===
                                                                    notification.id
                                                                }
                                                                className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-xs font-medium text-primary transition hover:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                                                            >
                                                                {markingReadId ===
                                                                notification.id ? (
                                                                    <Loader2
                                                                        size={
                                                                            14
                                                                        }
                                                                        className="animate-spin"
                                                                    />
                                                                ) : (
                                                                    <Check
                                                                        size={
                                                                            14
                                                                        }
                                                                    />
                                                                )}

                                                                {markingReadId ===
                                                                notification.id
                                                                    ? "Marking..."
                                                                    : "Mark Read"}
                                                            </button>
                                                        )}

                                                        {/* DELETE */}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    notification.id
                                                                )
                                                            }
                                                            className="inline-flex items-center justify-center rounded-lg border border-border bg-muted p-2 text-muted-foreground transition hover:bg-muted/80 hover:text-foreground"
                                                            title="Delete notification"
                                                        >
                                                            <Trash2
                                                                size={
                                                                    15
                                                                }
                                                            />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ViewNotifications;