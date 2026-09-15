
// ============================================================
// AIPMS — MANAGER NOTIFICATIONS
//
// COMM-001 — View Notifications
// Primary Actor: Project Manager
//
// Features:
// - View Manager's own notifications
// - All / Unread filtering
// - Mark notification as read
// - Mark all as read
// - View related project/activity
// - AI notifications clearly identified
// - Refresh notifications
// - Empty state
// - Error state
//
// File:
// src/components/manager/notification/ViewNotification.jsx
// ============================================================

import { useEffect, useMemo, useState } from "react";

import {
    Bell,
    Check,
    CheckCheck,
    RefreshCw,
    AlertCircle,
    CalendarDays,
    FolderKanban,
    UsersRound,
    Bot,
    AlertTriangle,
    ListChecks,
    Megaphone,
    Clock3,
    X,
    ExternalLink,
} from "lucide-react";

import {
    getManagerNotifications,
    markManagerNotificationAsRead,
    markAllManagerNotificationsAsRead,
} from "@/services/managerNotificationService";

// ============================================================
// NOTIFICATION TYPE CONFIGURATION
// ============================================================

const NOTIFICATION_TYPE_CONFIG = {
    sprintAssignment: {
        label: "Sprint Assignment",
        icon: ListChecks,
    },

    sprintStatusChange: {
        label: "Sprint Update",
        icon: ListChecks,
    },

    teamMemberRequest: {
        label: "Team Member Request",
        icon: UsersRound,
    },

    teamLeaderUpdate: {
        label: "Team Leader Update",
        icon: UsersRound,
    },

    projectAnnouncement: {
        label: "Project Announcement",
        icon: Megaphone,
    },

    deadlineWarning: {
        label: "Deadline Warning",
        icon: Clock3,
    },

    riskWarning: {
        label: "Risk Warning",
        icon: AlertTriangle,
    },

    aiRecommendation: {
        label: "AI Recommendation",
        icon: Bot,
    },

    default: {
        label: "Notification",
        icon: Bell,
    },
};

// ============================================================
// HELPERS
// ============================================================

function getNotificationType(notification) {
    return (
        notification?.type ||
        notification?.notificationType ||
        notification?.category ||
        "default"
    );
}

function getNotificationConfig(notification) {
    const type = getNotificationType(notification);

    return (
        NOTIFICATION_TYPE_CONFIG[type] ||
        NOTIFICATION_TYPE_CONFIG.default
    );
}

function getNotificationTitle(notification) {
    return (
        notification?.title ||
        notification?.subject ||
        notification?.name ||
        "Notification"
    );
}

function getNotificationMessage(notification) {
    return (
        notification?.message ||
        notification?.description ||
        notification?.content ||
        notification?.body ||
        "You have a new notification."
    );
}

function isNotificationRead(notification) {
    return (
        notification?.isRead === true ||
        notification?.read === true ||
        String(notification?.status || "").toLowerCase() === "read"
    );
}

function getNotificationDate(notification) {
    return (
        notification?.createdAt ||
        notification?.createdDate ||
        notification?.timestamp ||
        notification?.date
    );
}

function getNotificationId(notification) {
    return (
        notification?.id ||
        notification?.notificationId ||
        notification?._id
    );
}

function formatNotificationTime(dateValue) {
    if (!dateValue) {
        return "Recently";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "Recently";
    }

    const now = new Date();

    const difference = Math.max(
        0,
        now.getTime() - date.getTime()
    );

    const minutes = Math.floor(
        difference / (1000 * 60)
    );

    if (minutes < 1) {
        return "Just now";
    }

    if (minutes < 60) {
        return `${minutes} minute${
            minutes === 1 ? "" : "s"
        } ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
        return `${hours} hour${
            hours === 1 ? "" : "s"
        } ago`;
    }

    const days = Math.floor(hours / 24);

    if (days < 7) {
        return `${days} day${
            days === 1 ? "" : "s"
        } ago`;
    }

    return date.toLocaleDateString();
}

// ============================================================
// COMPONENT
// ============================================================

function ViewNotification() {
    // ========================================================
    // STATE
    // ========================================================

    const [notifications, setNotifications] = useState([]);

    const [activeFilter, setActiveFilter] =
        useState("all");

    const [selectedNotification, setSelectedNotification] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] =
        useState("");

    const [actionError, setActionError] =
        useState("");

    const [markingRead, setMarkingRead] =
        useState(null);

    const [markingAllRead, setMarkingAllRead] =
        useState(false);

    // ========================================================
    // LOAD NOTIFICATIONS
    // ========================================================

    const loadNotifications = async (options = {}) => {
        const isRefresh =
            options.refresh === true;

        if (isRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        setError("");

        try {
            const result =
                await getManagerNotifications();

            const data =
                Array.isArray(result)
                    ? result
                    : result?.data ||
                      result?.notifications ||
                      result?.items ||
                      [];

            if (!Array.isArray(data)) {
                throw new Error(
                    "Invalid notification data received."
                );
            }

            setNotifications(data);
        } catch (err) {
            console.error(
                "Failed to load Manager notifications:",
                err
            );

            setError(
                err?.message ||
                    "Unable to retrieve notifications. Please try again."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {
        loadNotifications();
    }, []);

    // ========================================================
    // UNREAD COUNT
    // ========================================================

    const unreadCount = useMemo(() => {
        return notifications.filter(
            (notification) =>
                !isNotificationRead(notification)
        ).length;
    }, [notifications]);

    // ========================================================
    // FILTERED NOTIFICATIONS
    // ========================================================

    const filteredNotifications = useMemo(() => {
        if (activeFilter === "unread") {
            return notifications.filter(
                (notification) =>
                    !isNotificationRead(notification)
            );
        }

        return notifications;
    }, [notifications, activeFilter]);

    // ========================================================
    // SELECT NOTIFICATION
    // ========================================================

    const handleSelectNotification = async (
        notification
    ) => {
        setSelectedNotification(notification);
        setActionError("");

        if (!isNotificationRead(notification)) {
            await handleMarkAsRead(
                notification,
                false
            );
        }
    };

    // ========================================================
    // MARK AS READ
    // ========================================================

    const handleMarkAsRead = async (
        notification,
        closeDetails = false
    ) => {
        const notificationId =
            getNotificationId(notification);

        if (!notificationId) {
            setActionError(
                "This notification does not have a valid ID."
            );
            return;
        }

        setMarkingRead(notificationId);
        setActionError("");

        try {
            await markManagerNotificationAsRead(
                notificationId
            );

            setNotifications((previous) =>
                previous.map((item) =>
                    getNotificationId(item) ===
                    notificationId
                        ? {
                              ...item,
                              isRead: true,
                              read: true,
                              status: "read",
                          }
                        : item
                )
            );

            if (
                selectedNotification &&
                getNotificationId(
                    selectedNotification
                ) === notificationId
            ) {
                setSelectedNotification((previous) => ({
                    ...previous,
                    isRead: true,
                    read: true,
                    status: "read",
                }));
            }

            if (closeDetails) {
                setSelectedNotification(null);
            }
        } catch (err) {
            console.error(
                "Failed to mark notification as read:",
                err
            );

            setActionError(
                err?.message ||
                    "Unable to mark the notification as read."
            );
        } finally {
            setMarkingRead(null);
        }
    };

    // ========================================================
    // MARK ALL AS READ
    // ========================================================

    const handleMarkAllAsRead = async () => {
        if (unreadCount === 0) {
            return;
        }

        setMarkingAllRead(true);
        setActionError("");

        try {
            await markAllManagerNotificationsAsRead();

            setNotifications((previous) =>
                previous.map((notification) => ({
                    ...notification,
                    isRead: true,
                    read: true,
                    status: "read",
                }))
            );

            if (selectedNotification) {
                setSelectedNotification((previous) => ({
                    ...previous,
                    isRead: true,
                    read: true,
                    status: "read",
                }));
            }
        } catch (err) {
            console.error(
                "Failed to mark all notifications as read:",
                err
            );

            setActionError(
                err?.message ||
                    "Unable to mark all notifications as read."
            );
        } finally {
            setMarkingAllRead(false);
        }
    };

    // ========================================================
    // NOTIFICATION ICON
    // ========================================================

    const renderNotificationIcon = (
        notification
    ) => {
        const config =
            getNotificationConfig(notification);

        const Icon = config.icon;

        const type =
            getNotificationType(notification);

        const isAI =
            type === "aiRecommendation" ||
            notification?.isAI === true ||
            String(
                notification?.source || ""
            ).toLowerCase() === "ai";

        return (
            <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${
                    isAI
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                }`}
            >
                <Icon className="h-5 w-5" />
            </div>
        );
    };

    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {
        return (
            <div className="rounded-xl border border-border bg-card p-12">
                <div className="flex min-h-[300px] items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <RefreshCw className="h-6 w-6 animate-spin text-primary" />

                        <p className="text-sm text-muted-foreground">
                            Loading notifications...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // ========================================================
    // MAIN RENDER
    // ========================================================

    return (
        <>
            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Bell className="h-5 w-5" />
                    </div>

                    <div>

                        <div className="flex flex-wrap items-center gap-2">

                            <h2 className="text-lg font-semibold text-foreground">
                                Notifications
                            </h2>

                            {unreadCount > 0 && (
                                <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                                    {unreadCount} unread
                                </span>
                            )}

                        </div>

                        <p className="mt-1 text-sm text-muted-foreground">
                            View notifications related to your
                            projects, sprints, teams, and activities.
                        </p>

                    </div>

                </div>

                <div className="flex flex-wrap items-center gap-2">

                    {/* REFRESH */}

                    <button
                        type="button"
                        onClick={() =>
                            loadNotifications({
                                refresh: true,
                            })
                        }
                        disabled={refreshing}
                        className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <RefreshCw
                            className={`h-4 w-4 ${
                                refreshing
                                    ? "animate-spin"
                                    : ""
                            }`}
                        />

                        {refreshing
                            ? "Refreshing..."
                            : "Refresh"}
                    </button>

                    {/* MARK ALL READ */}

                    {unreadCount > 0 && (
                        <button
                            type="button"
                            onClick={
                                handleMarkAllAsRead
                            }
                            disabled={markingAllRead}
                            className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <CheckCheck className="h-4 w-4" />

                            {markingAllRead
                                ? "Updating..."
                                : "Mark all read"}
                        </button>
                    )}

                </div>

            </div>

            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (
                <div className="mb-5 flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">

                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />

                    <div className="flex-1">

                        <p className="font-semibold text-foreground">
                            Unable to load notifications
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                            {error}
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            loadNotifications()
                        }
                        className="text-sm font-medium text-primary hover:underline"
                    >
                        Try again
                    </button>

                </div>
            )}

            {/* ==================================================
                ACTION ERROR
            ================================================== */}

            {actionError && (
                <div className="mb-5 flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">

                    <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />

                    <span className="flex-1 text-sm text-foreground">
                        {actionError}
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            setActionError("")
                        }
                        className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                        <X className="h-4 w-4" />
                    </button>

                </div>
            )}

            {/* ==================================================
                FILTERS
            ================================================== */}

            <div className="mb-5 flex items-center gap-1 border-b border-border">

                <button
                    type="button"
                    onClick={() =>
                        setActiveFilter("all")
                    }
                    className={`border-b-2 px-4 py-3 text-sm font-medium transition ${
                        activeFilter === "all"
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                >
                    All
                </button>

                <button
                    type="button"
                    onClick={() =>
                        setActiveFilter("unread")
                    }
                    className={`border-b-2 px-4 py-3 text-sm font-medium transition ${
                        activeFilter === "unread"
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                >
                    Unread

                    {unreadCount > 0 && (
                        <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                            {unreadCount}
                        </span>
                    )}

                </button>

            </div>

            {/* ==================================================
                EMPTY STATE
            ================================================== */}

            {!error &&
                filteredNotifications.length ===
                    0 && (
                    <div className="rounded-xl border border-border bg-card p-12 text-center">

                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                            <Bell className="h-6 w-6 text-muted-foreground" />
                        </div>

                        <h2 className="mt-4 text-lg font-semibold text-foreground">
                            No notifications available
                        </h2>

                        <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
                            {activeFilter ===
                            "unread"
                                ? "You have no unread notifications."
                                : "You currently have no notifications related to your projects, sprints, teams, or activities."}
                        </p>

                    </div>
                )}

            {/* ==================================================
                NOTIFICATION LIST
            ================================================== */}

            <div className="space-y-3">

                {filteredNotifications.map(
                    (notification) => {

                        const id =
                            getNotificationId(
                                notification
                            );

                        const read =
                            isNotificationRead(
                                notification
                            );

                        const config =
                            getNotificationConfig(
                                notification
                            );

                        const type =
                            getNotificationType(
                                notification
                            );

                        const isAI =
                            type ===
                                "aiRecommendation" ||
                            notification?.isAI === true ||
                            String(
                                notification?.source ||
                                    ""
                            ).toLowerCase() ===
                                "ai";

                        return (
                            <button
                                key={
                                    id ||
                                    `${getNotificationTitle(
                                        notification
                                    )}-${getNotificationDate(
                                        notification
                                    )}`
                                }
                                type="button"
                                onClick={() =>
                                    handleSelectNotification(
                                        notification
                                    )
                                }
                                className={`w-full rounded-xl border p-4 text-left transition ${
                                    read
                                        ? "border-border bg-card hover:bg-muted/40"
                                        : "border-primary/30 bg-primary/5 hover:bg-primary/10"
                                }`}
                            >

                                <div className="flex items-start gap-4">

                                    {renderNotificationIcon(
                                        notification
                                    )}

                                    <div className="min-w-0 flex-1">

                                        <div className="flex flex-wrap items-center gap-2">

                                            <h3
                                                className={`text-sm ${
                                                    read
                                                        ? "font-medium"
                                                        : "font-semibold"
                                                } text-foreground`}
                                            >
                                                {getNotificationTitle(
                                                    notification
                                                )}
                                            </h3>

                                            {!read && (
                                                <span className="h-2 w-2 rounded-full bg-primary" />
                                            )}

                                            {isAI && (
                                                <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                                                    <Bot className="h-3 w-3" />
                                                    AI
                                                </span>
                                            )}

                                        </div>

                                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                                            {getNotificationMessage(
                                                notification
                                            )}
                                        </p>

                                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">

                                            <span className="font-medium text-primary">
                                                {config.label}
                                            </span>

                                            {notification?.projectName && (
                                                <span className="inline-flex items-center gap-1">
                                                    <FolderKanban className="h-3.5 w-3.5" />
                                                    {
                                                        notification.projectName
                                                    }
                                                </span>
                                            )}

                                            {notification?.sprintName && (
                                                <span className="inline-flex items-center gap-1">
                                                    <ListChecks className="h-3.5 w-3.5" />
                                                    {
                                                        notification.sprintName
                                                    }
                                                </span>
                                            )}

                                            {notification?.teamName && (
                                                <span className="inline-flex items-center gap-1">
                                                    <UsersRound className="h-3.5 w-3.5" />
                                                    {
                                                        notification.teamName
                                                    }
                                                </span>
                                            )}

                                            <span className="inline-flex items-center gap-1">
                                                <CalendarDays className="h-3.5 w-3.5" />

                                                {formatNotificationTime(
                                                    getNotificationDate(
                                                        notification
                                                    )
                                                )}
                                            </span>

                                        </div>

                                    </div>

                                    {!read && (
                                        <div className="shrink-0">

                                            <span className="rounded-md bg-primary px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground">
                                                Unread
                                            </span>

                                        </div>
                                    )}

                                </div>

                            </button>
                        );
                    }
                )}

            </div>

            {/* ==================================================
                NOTIFICATION DETAILS MODAL
            ================================================== */}

            {selectedNotification && (
                <div
                    className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-4"
                    onMouseDown={(event) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            setSelectedNotification(
                                null
                            );
                        }
                    }}
                >

                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-border bg-card shadow-xl">

                        {/* MODAL HEADER */}

                        <div className="flex items-start justify-between border-b border-border p-5">

                            <div className="flex items-start gap-3">

                                {renderNotificationIcon(
                                    selectedNotification
                                )}

                                <div>

                                    <div className="flex flex-wrap items-center gap-2">

                                        <h2 className="text-lg font-semibold text-foreground">
                                            {getNotificationTitle(
                                                selectedNotification
                                            )}
                                        </h2>

                                        {(
                                            getNotificationType(
                                                selectedNotification
                                            ) ===
                                                "aiRecommendation" ||
                                            selectedNotification?.isAI ===
                                                true ||
                                            String(
                                                selectedNotification?.source ||
                                                    ""
                                            ).toLowerCase() ===
                                                "ai"
                                        ) && (
                                            <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                                                <Bot className="h-3 w-3" />
                                                AI Recommendation
                                            </span>
                                        )}

                                    </div>

                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {formatNotificationTime(
                                            getNotificationDate(
                                                selectedNotification
                                            )
                                        )}
                                    </p>

                                </div>

                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedNotification(
                                        null
                                    )
                                }
                                className="rounded-md p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                            >
                                <X className="h-5 w-5" />
                            </button>

                        </div>

                        {/* MODAL CONTENT */}

                        <div className="space-y-5 p-5">

                            <p className="whitespace-pre-wrap text-sm leading-6 text-foreground">
                                {getNotificationMessage(
                                    selectedNotification
                                )}
                            </p>

                            {/* PROJECT */}

                            {selectedNotification?.projectName && (
                                <div className="rounded-lg border border-border bg-muted/30 p-4">

                                    <div className="flex items-center gap-3">

                                        <FolderKanban className="h-5 w-5 text-primary" />

                                        <div>

                                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                                Related Project
                                            </p>

                                            <p className="mt-1 text-sm font-semibold text-foreground">
                                                {
                                                    selectedNotification.projectName
                                                }
                                            </p>

                                        </div>

                                    </div>

                                </div>
                            )}

                            {/* SPRINT */}

                            {selectedNotification?.sprintName && (
                                <div className="rounded-lg border border-border bg-muted/30 p-4">

                                    <div className="flex items-center gap-3">

                                        <ListChecks className="h-5 w-5 text-primary" />

                                        <div>

                                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                                Related Sprint
                                            </p>

                                            <p className="mt-1 text-sm font-semibold text-foreground">
                                                {
                                                    selectedNotification.sprintName
                                                }
                                            </p>

                                        </div>

                                    </div>

                                </div>
                            )}

                            {/* TEAM */}

                            {selectedNotification?.teamName && (
                                <div className="rounded-lg border border-border bg-muted/30 p-4">

                                    <div className="flex items-center gap-3">

                                        <UsersRound className="h-5 w-5 text-primary" />

                                        <div>

                                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                                Related Team
                                            </p>

                                            <p className="mt-1 text-sm font-semibold text-foreground">
                                                {
                                                    selectedNotification.teamName
                                                }
                                            </p>

                                        </div>

                                    </div>

                                </div>
                            )}

                            {/* ACTIVITY */}

                            {selectedNotification?.activityId && (
                                <div className="rounded-lg border border-border p-4">

                                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                        Activity Reference
                                    </p>

                                    <p className="mt-1 break-all text-sm font-medium text-foreground">
                                        {
                                            selectedNotification.activityId
                                        }
                                    </p>

                                </div>
                            )}

                            {/* RELATED LINK */}

                            {selectedNotification?.link && (
                                <a
                                    href={
                                        selectedNotification.link
                                    }
                                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                                >
                                    Open related activity

                                    <ExternalLink className="h-4 w-4" />
                                </a>
                            )}

                            {/* ACTIONS */}

                            <div className="flex justify-end gap-2 border-t border-border pt-5">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelectedNotification(
                                            null
                                        )
                                    }
                                    className="rounded-md border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted"
                                >
                                    Close
                                </button>

                                {!isNotificationRead(
                                    selectedNotification
                                ) && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleMarkAsRead(
                                                selectedNotification
                                            )
                                        }
                                        disabled={
                                            markingRead ===
                                            getNotificationId(
                                                selectedNotification
                                            )
                                        }
                                        className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <Check className="h-4 w-4" />

                                        {markingRead ===
                                        getNotificationId(
                                            selectedNotification
                                        )
                                            ? "Updating..."
                                            : "Mark as read"}
                                    </button>
                                )}

                            </div>

                        </div>

                    </div>

                </div>
            )}
        </>
    );
}

export default ViewNotification;

