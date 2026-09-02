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

const NOTIFICATIONS_KEY =
    "aipms_staff_notifications";

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
                className="text-emerald-400"
            />
        );
    }

    if (type === "warning") {
        return (
            <AlertTriangle
                size={20}
                className="text-yellow-400"
            />
        );
    }

    if (type === "error") {
        return (
            <AlertCircle
                size={20}
                className="text-red-400"
            />
        );
    }

    if (type === "task") {
        return (
            <Check
                size={20}
                className="text-blue-400"
            />
        );
    }

    if (type === "message") {
        return (
            <BellRing
                size={20}
                className="text-purple-400"
            />
        );
    }

    return (
        <Info
            size={20}
            className="text-cyan-400"
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
        <div className="space-y-6 text-white">
            {/* HEADER */}

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-yellow-500/10 p-3">
                        <Bell
                            size={24}
                            className="text-yellow-400"
                        />
                    </div>

                    <div>
                        <h2 className="text-xl font-bold">
                            View Notifications
                        </h2>

                        <p className="text-sm text-slate-400">
                            View task, project, sprint, and
                            system notifications.
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={handleRefresh}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
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
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
                        >
                            <CheckCheck
                                size={16}
                            />
                            Mark All Read
                        </button>
                    )}

                    {totalNotifications > 0 && (
                        <button
                            type="button"
                            onClick={handleClearAll}
                            className="inline-flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/20"
                        >
                            <Trash2 size={16} />
                            Clear All
                        </button>
                    )}
                </div>
            </div>

            {/* STATUS */}

            {statusMessage && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                    <CheckCircle2 size={18} />
                    {statusMessage}
                </div>
            )}

            {/* SUMMARY */}

            <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-4">
                    <p className="text-xs uppercase tracking-wider text-slate-500">
                        Total
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                        {totalNotifications}
                    </p>
                </div>

                <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-4">
                    <p className="text-xs uppercase tracking-wider text-slate-500">
                        Unread
                    </p>

                    <p className="mt-2 text-2xl font-bold text-blue-400">
                        {unreadNotifications}
                    </p>
                </div>

                <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-4">
                    <p className="text-xs uppercase tracking-wider text-slate-500">
                        Read
                    </p>

                    <p className="mt-2 text-2xl font-bold text-emerald-400">
                        {readNotifications}
                    </p>
                </div>
            </div>

            {/* SEARCH + FILTER */}

            <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4">
                <div className="flex flex-col gap-4 md:flex-row">
                    <div className="relative flex-1">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
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
                            className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2.5 pl-10 pr-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-yellow-500"
                        />
                    </div>

                    <div className="flex rounded-lg border border-slate-700 bg-slate-800 p-1">
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
                                        ? "bg-yellow-600 text-white"
                                        : "text-slate-400 hover:text-white"
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* NOTIFICATIONS */}

            <div className="rounded-2xl border border-slate-700 bg-slate-900/80">
                <div className="border-b border-slate-700 p-5">
                    <h3 className="font-semibold">
                        Notifications
                    </h3>
                </div>

                <div className="p-4">
                    {filteredNotifications.length ===
                    0 ? (
                        <div className="py-16 text-center">
                            <Bell
                                size={38}
                                className="mx-auto mb-4 text-slate-600"
                            />

                            <h3 className="font-semibold text-slate-300">
                                No notifications
                            </h3>

                            <p className="mt-2 text-sm text-slate-500">
                                You don't have any notifications
                                matching the current filter.
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
                                                ? "border-slate-700 bg-slate-800/50"
                                                : "border-blue-500/30 bg-blue-500/5"
                                        }`}
                                    >
                                        <div className="flex items-start gap-4">
                                            {/* ICON */}

                                            <div
                                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                                                    notification.read
                                                        ? "bg-slate-700/60"
                                                        : "bg-blue-500/10"
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
                                                                        ? "text-slate-300"
                                                                        : "text-white"
                                                                }`}
                                                            >
                                                                {
                                                                    notification.title
                                                                }
                                                            </h4>

                                                            <span className="rounded-full bg-slate-700 px-2 py-0.5 text-[10px] uppercase tracking-wider text-slate-400">
                                                                {getTypeLabel(
                                                                    notification.type
                                                                )}
                                                            </span>

                                                            {!notification.read && (
                                                                <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-400">
                                                                    Unread
                                                                </span>
                                                            )}
                                                        </div>

                                                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-400">
                                                            {
                                                                notification.message
                                                            }
                                                        </p>

                                                        <div className="mt-3 flex items-center gap-1 text-xs text-slate-600">
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
                                                                className="inline-flex items-center gap-1.5 rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-xs font-medium text-blue-300 transition hover:bg-blue-500/20"
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
                                                            className="inline-flex items-center justify-center rounded-lg border border-red-500/20 bg-red-500/5 p-2 text-red-400 transition hover:bg-red-500/10"
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