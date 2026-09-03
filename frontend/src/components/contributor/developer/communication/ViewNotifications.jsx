import { useMemo, useState } from "react";
import {
    Bell,
    Check,
    CheckCheck,
    Clock,
    FolderKanban,
    MessageSquare,
    Search,
    UserRound,
    AlertCircle,
    ClipboardCheck,
} from "lucide-react";

// ============================================================
// ICON
// ============================================================

function getNotificationIcon(type) {
    switch (String(type).toLowerCase()) {
        case "task":
        case "taskassigned":
        case "assignment":
            return (
                <ClipboardCheck className="h-5 w-5" />
            );

        case "status":
        case "statusupdated":
            return (
                <CheckCheck className="h-5 w-5" />
            );

        case "message":
        case "communication":
            return (
                <MessageSquare className="h-5 w-5" />
            );

        case "mention":
            return (
                <UserRound className="h-5 w-5" />
            );

        case "deadline":
            return (
                <Clock className="h-5 w-5" />
            );

        case "review":
            return (
                <Check className="h-5 w-5" />
            );

        default:
            return (
                <Bell className="h-5 w-5" />
            );
    }
}

// ============================================================
// COMPONENT
// ============================================================

export default function ViewNotifications({
    notifications: backendNotifications = [],
    onMarkAsRead,
    onMarkAllAsRead,
    loading = false,
    error = "",
}) {
    const [search, setSearch] =
        useState("");

    const [filter, setFilter] =
        useState("all");

    // ========================================================
    // NORMALIZE BACKEND DATA
    // ========================================================

    const notifications =
        useMemo(() => {
            return backendNotifications.map(
                (notification, index) => ({
                    id:
                        notification?.id ??
                        notification?.notificationId ??
                        notification?.NotificationId ??
                        `notification-${index}`,

                    type:
                        notification?.type ??
                        notification?.notificationType ??
                        notification?.NotificationType ??
                        "general",

                    title:
                        notification?.title ??
                        notification?.Title ??
                        "Notification",

                    message:
                        notification?.message ??
                        notification?.Message ??
                        notification?.content ??
                        notification?.Content ??
                        "",

                    related:
                        notification?.related ??
                        notification?.relatedName ??
                        notification?.taskName ??
                        notification?.projectName ??
                        notification?.RelatedName ??
                        "",

                    date:
                        notification?.createdAt ??
                        notification?.CreatedAt ??
                        notification?.date ??
                        notification?.Date ??
                        null,

                    read: Boolean(
                        notification?.read ??
                            notification?.isRead ??
                            notification?.IsRead ??
                            false
                    ),
                })
            );
        }, [backendNotifications]);

    // ========================================================
    // COUNTS
    // ========================================================

    const unreadCount =
        notifications.filter(
            (notification) =>
                !notification.read
        ).length;

    // ========================================================
    // FILTER
    // ========================================================

    const filteredNotifications =
        useMemo(() => {
            const searchValue =
                search
                    .trim()
                    .toLowerCase();

            return notifications.filter(
                (notification) => {
                    const matchesFilter =
                        filter ===
                            "all" ||
                        (filter ===
                            "unread" &&
                            !notification.read) ||
                        (filter ===
                            "read" &&
                            notification.read);

                    const matchesSearch =
                        !searchValue ||
                        notification.title
                            .toLowerCase()
                            .includes(
                                searchValue
                            ) ||
                        notification.message
                            .toLowerCase()
                            .includes(
                                searchValue
                            ) ||
                        notification.related
                            .toLowerCase()
                            .includes(
                                searchValue
                            );

                    return (
                        matchesFilter &&
                        matchesSearch
                    );
                }
            );
        }, [
            notifications,
            filter,
            search,
        ]);

    // ========================================================
    // READ
    // ========================================================

    const markAsRead = async (
        id
    ) => {
        if (!id || !onMarkAsRead) {
            return;
        }

        try {
            await onMarkAsRead(id);
        } catch (err) {
            console.error(
                "Failed to mark notification as read:",
                err
            );
        }
    };

    const markAllAsRead = async () => {
        if (!onMarkAllAsRead) {
            return;
        }

        try {
            await onMarkAllAsRead();
        } catch (err) {
            console.error(
                "Failed to mark all notifications as read:",
                err
            );
        }
    };

    // ========================================================
    // UI
    // ========================================================

    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* HEADER */}

            <div className="border-b border-slate-200 bg-gradient-to-r from-white to-blue-50/50 p-5 sm:p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                            <Bell className="h-5 w-5" />
                        </div>

                        <div>
                            <h2 className="text-lg font-bold text-slate-900">
                                Notifications
                            </h2>

                            <p className="mt-1 text-sm leading-6 text-slate-600">
                                View task, project,
                                sprint,
                                communication,
                                and work
                                notifications.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="rounded-lg border border-slate-200 bg-white px-4 py-2">
                            <span className="text-sm font-semibold text-slate-700">
                                {unreadCount}{" "}
                                unread
                            </span>
                        </div>

                        {unreadCount >
                            0 &&
                            onMarkAllAsRead && (
                                <button
                                    type="button"
                                    onClick={
                                        markAllAsRead
                                    }
                                    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                                >
                                    <CheckCheck className="h-4 w-4" />

                                    <span className="hidden sm:inline">
                                        Mark all
                                        read
                                    </span>
                                </button>
                            )}
                    </div>
                </div>
            </div>

            {/* ERROR */}

            {error && (
                <div className="mx-5 mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:mx-6">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                    <p className="text-sm text-red-700">
                        {error}
                    </p>
                </div>
            )}

            {/* FILTERS */}

            <div className="border-b border-slate-200 bg-slate-50/60 p-4 sm:p-5">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <input
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target
                                        .value
                                )
                            }
                            placeholder="Search notifications..."
                            className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        />
                    </div>

                    <select
                        value={filter}
                        onChange={(e) =>
                            setFilter(
                                e.target
                                    .value
                            )
                        }
                        className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    >
                        <option
                            value="all"
                            className="bg-white text-slate-900"
                        >
                            All notifications
                        </option>

                        <option
                            value="unread"
                            className="bg-white text-slate-900"
                        >
                            Unread
                        </option>

                        <option
                            value="read"
                            className="bg-white text-slate-900"
                        >
                            Read
                        </option>
                    </select>
                </div>
            </div>

            {/* LIST */}

            <div className="p-4 sm:p-5">
                {loading ? (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-10 text-center">
                        <Bell className="mx-auto mb-4 h-10 w-10 animate-pulse text-blue-300" />

                        <p className="text-sm font-medium text-slate-600">
                            Loading notifications...
                        </p>
                    </div>
                ) : filteredNotifications.length ===
                  0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                        <Bell className="mx-auto mb-4 h-11 w-11 text-slate-300" />

                        <h3 className="font-semibold text-slate-800">
                            No notifications
                            found
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            Try changing your
                            search or
                            notification
                            filter.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredNotifications.map(
                            (
                                notification
                            ) => (
                                <button
                                    key={
                                        notification.id
                                    }
                                    type="button"
                                    onClick={() =>
                                        !notification.read &&
                                        markAsRead(
                                            notification.id
                                        )
                                    }
                                    className={`w-full rounded-xl border p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5 ${
                                        notification.read
                                            ? "border-slate-200 bg-white hover:border-slate-300"
                                            : "border-blue-200 bg-blue-50/60 hover:border-blue-300"
                                    }`}
                                >
                                    <div className="flex gap-4">
                                        <div
                                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                                                notification.read
                                                    ? "bg-slate-100 text-slate-500"
                                                    : "bg-blue-100 text-blue-700"
                                            }`}
                                        >
                                            {getNotificationIcon(
                                                notification.type
                                            )}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                                <div className="min-w-0">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <h3 className="font-semibold text-slate-900">
                                                            {
                                                                notification.title
                                                            }
                                                        </h3>

                                                        {!notification.read && (
                                                            <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                                                                New
                                                            </span>
                                                        )}
                                                    </div>

                                                    <p className="mt-1 text-sm leading-6 text-slate-700">
                                                        {
                                                            notification.message
                                                        }
                                                    </p>
                                                </div>

                                                <span className="flex shrink-0 items-center gap-1 text-xs text-slate-500">
                                                    <Clock className="h-3 w-3" />

                                                    {notification.date
                                                        ? new Date(
                                                              notification.date
                                                          ).toLocaleString()
                                                        : "Unknown date"}
                                                </span>
                                            </div>

                                            {notification.related && (
                                                <div className="mt-4 flex flex-wrap items-center gap-2">
                                                    <span className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
                                                        <FolderKanban className="h-3 w-3" />

                                                        {
                                                            notification.related
                                                        }
                                                    </span>

                                                    {notification.read && (
                                                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                                                            <Check className="h-3 w-3" />

                                                            Read
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            )
                        )}
                    </div>
                )}
            </div>

            {/* INFO */}

            <div className="border-t border-slate-200 p-4 sm:p-5">
                <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />

                    <p className="text-sm leading-6 text-blue-800">
                        Notifications are
                        supplied by the
                        Contributor
                        notification API.
                        Selecting an unread
                        notification marks it
                        as read through the
                        backend.
                    </p>
                </div>
            </div>
        </section>
    );
}