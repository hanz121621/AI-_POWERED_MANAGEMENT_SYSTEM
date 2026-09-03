
import { useMemo, useState } from "react";
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
} from "lucide-react";

// ============================================================
// STORAGE KEY
// ============================================================

const NOTIFICATIONS_KEY = "aipms_staff_notifications";

// ============================================================
// DEFAULT NOTIFICATION
// ============================================================

const DEFAULT_NOTIFICATIONS = [
    {
        id: "welcome-notification",
        title: "Welcome to AI-PMS",
        message:
            "You are now connected to the Staff Communication notification center.",
        type: "system",
        createdAt: new Date().toISOString(),
        read: false,
    },
];

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
// HELPERS
// ============================================================

function getStoredNotifications() {
    try {
        const stored = localStorage.getItem(
            NOTIFICATIONS_KEY
        );

        if (!stored) {
            return DEFAULT_NOTIFICATIONS;
        }

        const parsed = JSON.parse(stored);

        if (!Array.isArray(parsed)) {
            return DEFAULT_NOTIFICATIONS;
        }

        return parsed;
    } catch {
        return DEFAULT_NOTIFICATIONS;
    }
}

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
// MAIN COMPONENT
// ============================================================

function ViewNotifications() {
    const [notifications, setNotifications] =
        useState(getStoredNotifications);

    const [searchTerm, setSearchTerm] =
        useState("");

    const [filter, setFilter] = useState("all");

    const [statusMessage, setStatusMessage] =
        useState("");

    // ========================================================
    // FILTER
    // ========================================================

    const filteredNotifications = useMemo(() => {
        const search = searchTerm
            .trim()
            .toLowerCase();

        return notifications.filter(
            (notification) => {
                const matchesFilter =
                    filter === "all" ||
                    (filter === "unread" &&
                        !notification.read) ||
                    (filter === "read" &&
                        notification.read);

                if (!matchesFilter) {
                    return false;
                }

                if (!search) {
                    return true;
                }

                const title = String(
                    notification.title || ""
                ).toLowerCase();

                const message = String(
                    notification.message || ""
                ).toLowerCase();

                const type = String(
                    notification.type || ""
                ).toLowerCase();

                return (
                    title.includes(search) ||
                    message.includes(search) ||
                    type.includes(search)
                );
            }
        );
    }, [notifications, searchTerm, filter]);

    // ========================================================
    // SUMMARY
    // ========================================================

    const totalNotifications =
        notifications.length;

    const unreadNotifications =
        notifications.filter(
            (notification) => !notification.read
        ).length;

    const readNotifications =
        notifications.filter(
            (notification) => notification.read
        ).length;

    // ========================================================
    // SAVE
    // ========================================================

    const saveNotifications = (
        updatedNotifications
    ) => {
        localStorage.setItem(
            NOTIFICATIONS_KEY,
            JSON.stringify(updatedNotifications)
        );
    };

    // ========================================================
    // STATUS
    // ========================================================

    const showStatus = (text) => {
        setStatusMessage(text);

        setTimeout(() => {
            setStatusMessage("");
        }, 2500);
    };

    // ========================================================
    // REFRESH
    // ========================================================

    const handleRefresh = () => {
        setNotifications(
            getStoredNotifications()
        );

        showStatus("Notifications refreshed.");
    };

    // ========================================================
    // MARK AS READ
    // ========================================================

    const handleMarkAsRead = (notificationId) => {
        const updatedNotifications =
            notifications.map((notification) =>
                notification.id === notificationId
                    ? {
                          ...notification,
                          read: true,
                      }
                    : notification
            );

        setNotifications(updatedNotifications);
        saveNotifications(updatedNotifications);

        showStatus("Notification marked as read.");
    };

    // ========================================================
    // MARK ALL AS READ
    // ========================================================

    const handleMarkAllAsRead = () => {
        const updatedNotifications =
            notifications.map((notification) => ({
                ...notification,
                read: true,
            }));

        setNotifications(updatedNotifications);
        saveNotifications(updatedNotifications);

        showStatus(
            "All notifications marked as read."
        );
    };

    // ========================================================
    // DELETE
    // ========================================================

    const handleDelete = (notificationId) => {
        const updatedNotifications =
            notifications.filter(
                (notification) =>
                    notification.id !== notificationId
            );

        setNotifications(updatedNotifications);
        saveNotifications(updatedNotifications);

        showStatus("Notification deleted.");
    };

    // ========================================================
    // CLEAR ALL
    // ========================================================

    const handleClearAll = () => {
        setNotifications([]);
        saveNotifications([]);

        showStatus("All notifications cleared.");
    };

    // ========================================================
    // UI
    // ========================================================

    return (
        <div className="w-full space-y-6 text-foreground">
            {/* HEADER */}

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
                    <button
                        type="button"
                        onClick={handleRefresh}
                        className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
                    >
                        <RefreshCw size={16} />
                        Refresh
                    </button>

                    {unreadNotifications > 0 && (
                        <button
                            type="button"
                            onClick={
                                handleMarkAllAsRead
                            }
                            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                        >
                            <CheckCheck size={16} />
                            Mark All Read
                        </button>
                    )}

                    {totalNotifications > 0 && (
                        <button
                            type="button"
                            onClick={handleClearAll}
                            className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted/80 hover:text-foreground"
                        >
                            <Trash2 size={16} />
                            Clear All
                        </button>
                    )}
                </div>
            </div>

            {/* STATUS */}

            {statusMessage && (
                <div className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
                    <CheckCircle2 size={18} />
                    {statusMessage}
                </div>
            )}

            {/* SUMMARY */}

            <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-border bg-card p-4">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                        Total
                    </p>

                    <p className="mt-2 text-2xl font-bold text-card-foreground">
                        {totalNotifications}
                    </p>
                </div>

                <div className="rounded-xl border border-border bg-card p-4">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                        Unread
                    </p>

                    <p className="mt-2 text-2xl font-bold text-primary">
                        {unreadNotifications}
                    </p>
                </div>

                <div className="rounded-xl border border-border bg-card p-4">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                        Read
                    </p>

                    <p className="mt-2 text-2xl font-bold text-primary">
                        {readNotifications}
                    </p>
                </div>
            </div>

            {/* SEARCH + FILTER */}

            <div className="rounded-2xl border border-border bg-card p-4">
                <div className="flex flex-col gap-4 md:flex-row">
                    <div className="relative flex-1">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        />

                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(event) =>
                                setSearchTerm(
                                    event.target.value
                                )
                            }
                            placeholder="Search notifications..."
                            className="w-full rounded-lg border border-border bg-muted py-2.5 pl-10 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
                        />
                    </div>

                    <div className="flex rounded-lg border border-border bg-muted p-1">
                        {[
                            ["all", "All"],
                            ["unread", "Unread"],
                            ["read", "Read"],
                        ].map(([value, label]) => (
                            <button
                                key={value}
                                type="button"
                                onClick={() =>
                                    setFilter(value)
                                }
                                className={`rounded-md px-4 py-2 text-sm transition ${
                                    filter === value
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-card hover:text-foreground"
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* NOTIFICATIONS */}

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
                                notifications matching the
                                current filter.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredNotifications.map(
                                (notification) => (
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

                                                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                                                            {
                                                                notification.message
                                                            }
                                                        </p>

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
                                                        {!notification.read && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleMarkAsRead(
                                                                        notification.id
                                                                    )
                                                                }
                                                                className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-xs font-medium text-primary transition hover:bg-primary/20"
                                                            >
                                                                <Check
                                                                    size={
                                                                        14
                                                                    }
                                                                />
                                                                Mark Read
                                                            </button>
                                                        )}

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
