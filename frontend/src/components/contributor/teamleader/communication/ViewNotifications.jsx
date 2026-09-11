
import { useEffect, useMemo, useState } from "react";

import {
    AlertCircle,
    Bell,
    Check,
    CheckCheck,
    ChevronRight,
    Clock3,
    Loader2,
    MessageSquare,
    RefreshCw,
    Search,
    ShieldAlert,
    Timer,
    UserRound,
} from "lucide-react";

import api from "@/services/api";

const TYPE_CONFIG = {
    task: {
        label: "Task",
        icon: CheckCheck,
        className: "bg-blue-100 text-blue-600",
    },
    status: {
        label: "Status",
        icon: RefreshCw,
        className: "bg-emerald-100 text-emerald-600",
    },
    message: {
        label: "Message",
        icon: MessageSquare,
        className: "bg-violet-100 text-violet-600",
    },
    mention: {
        label: "Mention",
        icon: UserRound,
        className: "bg-pink-100 text-pink-600",
    },
    sprint: {
        label: "Sprint",
        icon: RefreshCw,
        className: "bg-indigo-100 text-indigo-600",
    },
    deadline: {
        label: "Deadline",
        icon: Timer,
        className: "bg-amber-100 text-amber-600",
    },
};

function detectNotificationType(item) {
    const rawType = String(
        item?.type ??
            item?.notificationType ??
            item?.NotificationType ??
            item?.category ??
            item?.Category ??
            ""
    ).toLowerCase();

    if (
        rawType.includes("mention")
    ) {
        return "mention";
    }

    if (
        rawType.includes("message") ||
        rawType.includes("communication")
    ) {
        return "message";
    }

    if (
        rawType.includes("deadline") ||
        rawType.includes("due")
    ) {
        return "deadline";
    }

    if (
        rawType.includes("sprint")
    ) {
        return "sprint";
    }

    if (
        rawType.includes("status")
    ) {
        return "status";
    }

    return "task";
}

function normalizeNotification(item, index) {
    const rawDate =
        item?.createdAt ??
        item?.notificationDate ??
        item?.date ??
        item?.CreatedAt ??
        item?.NotificationDate ??
        item?.Date;

    const parsedDate = rawDate
        ? new Date(rawDate)
        : null;

    const validDate =
        parsedDate &&
        !Number.isNaN(parsedDate.getTime());

    const read =
        item?.isRead ??
        item?.read ??
        item?.IsRead ??
        item?.Read ??
        false;

    return {
        ...item,

        id:
            item?.id ??
            item?.notificationId ??
            item?.Id ??
            item?.NotificationId ??
            `notification-${index}`,

        type: detectNotificationType(item),

        title:
            item?.title ??
            item?.Title ??
            "Notification",

        message:
            item?.message ??
            item?.Message ??
            item?.description ??
            item?.Description ??
            "",

        related:
            item?.relatedEntityName ??
            item?.related ??
            item?.referenceName ??
            item?.RelatedEntityName ??
            item?.Related ??
            item?.ReferenceName ??
            "",

        read: Boolean(read),

        date: validDate
            ? parsedDate.toLocaleDateString(
                  undefined,
                  {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                  }
              )
            : rawDate
              ? String(rawDate)
              : "",

        time: validDate
            ? parsedDate.toLocaleTimeString(
                  undefined,
                  {
                      hour: "2-digit",
                      minute: "2-digit",
                  }
              )
            : "",
    };
}

function unwrapNotifications(response) {
    const data = response?.data;

    if (Array.isArray(data)) {
        return data;
    }

    if (Array.isArray(data?.data)) {
        return data.data;
    }

    if (Array.isArray(data?.notifications)) {
        return data.notifications;
    }

    if (Array.isArray(data?.items)) {
        return data.items;
    }

    return [];
}

export default function ViewNotifications() {
    const [notifications, setNotifications] =
        useState([]);

    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");

    const [isLoading, setIsLoading] =
        useState(true);

    const [isRefreshing, setIsRefreshing] =
        useState(false);

    const [errorMessage, setErrorMessage] =
        useState("");

    const [processingIds, setProcessingIds] =
        useState([]);

    const loadNotifications = async (
        showLoader = true
    ) => {
        if (showLoader) {
            setIsLoading(true);
        } else {
            setIsRefreshing(true);
        }

        setErrorMessage("");

        try {
            const response = await api.get(
                "/notifications"
            );

            const rawNotifications =
                unwrapNotifications(response);

            setNotifications(
                rawNotifications.map(
                    normalizeNotification
                )
            );
        } catch (error) {
            console.error(
                "Failed to load notifications:",
                error
            );

            setErrorMessage(
                error?.response?.data?.message ??
                    error?.response?.data?.Message ??
                    "Unable to load notifications."
            );
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    const unreadCount =
        notifications.filter(
            (notification) =>
                !notification.read
        ).length;

    const filteredNotifications =
        useMemo(() => {
            const normalizedSearch =
                search.trim().toLowerCase();

            return notifications.filter(
                (notification) => {
                    const matchesFilter =
                        filter === "all" ||
                        (filter === "unread" &&
                            !notification.read) ||
                        (filter === "read" &&
                            notification.read);

                    const matchesSearch =
                        !normalizedSearch ||
                        notification.title
                            .toLowerCase()
                            .includes(
                                normalizedSearch
                            ) ||
                        notification.message
                            .toLowerCase()
                            .includes(
                                normalizedSearch
                            ) ||
                        notification.related
                            .toLowerCase()
                            .includes(
                                normalizedSearch
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

    const markAsRead = async (id) => {
        if (!id) {
            return;
        }

        const notification =
            notifications.find(
                (item) => item.id === id
            );

        if (!notification || notification.read) {
            return;
        }

        setProcessingIds((current) => [
            ...current,
            id,
        ]);

        try {
            await api.patch(
                `/notifications/${id}/read`
            );

            setNotifications((current) =>
                current.map(
                    (item) =>
                        item.id === id
                            ? {
                                  ...item,
                                  read: true,
                              }
                            : item
                )
            );
        } catch (error) {
            console.error(
                "Failed to mark notification as read:",
                error
            );

            setErrorMessage(
                error?.response?.data?.message ??
                    error?.response?.data?.Message ??
                    "Unable to mark notification as read."
            );
        } finally {
            setProcessingIds((current) =>
                current.filter(
                    (itemId) => itemId !== id
                )
            );
        }
    };

    const markAllAsRead = async () => {
        const unreadNotifications =
            notifications.filter(
                (notification) =>
                    !notification.read
            );

        if (
            unreadNotifications.length === 0
        ) {
            return;
        }

        setProcessingIds(
            unreadNotifications.map(
                (notification) =>
                    notification.id
            )
        );

        setErrorMessage("");

        try {
            await Promise.all(
                unreadNotifications.map(
                    (notification) =>
                        api.patch(
                            `/notifications/${notification.id}/read`
                        )
                )
            );

            setNotifications((current) =>
                current.map(
                    (notification) => ({
                        ...notification,
                        read: true,
                    })
                )
            );
        } catch (error) {
            console.error(
                "Failed to mark all notifications as read:",
                error
            );

            setErrorMessage(
                error?.response?.data?.message ??
                    error?.response?.data?.Message ??
                    "Unable to mark all notifications as read."
            );

            await loadNotifications(false);
        } finally {
            setProcessingIds([]);
        }
    };

    const isProcessing = (id) =>
        processingIds.includes(id);

    return (
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative rounded-xl bg-amber-100 p-3">
                            <Bell className="h-5 w-5 text-amber-600" />

                            {unreadCount > 0 && (
                                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                                    {unreadCount}
                                </span>
                            )}
                        </div>

                        <div>
                            <h2 className="text-lg font-bold text-slate-900">
                                Notification Center
                            </h2>

                            <p className="text-sm text-slate-500">
                                Important project, task,
                                sprint, and team updates.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() =>
                                loadNotifications(false)
                            }
                            disabled={isRefreshing}
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <RefreshCw
                                className={`h-4 w-4 ${
                                    isRefreshing
                                        ? "animate-spin"
                                        : ""
                                }`}
                            />

                            Refresh
                        </button>

                        {unreadCount > 0 && (
                            <button
                                type="button"
                                onClick={markAllAsRead}
                                disabled={
                                    processingIds.length >
                                    0
                                }
                                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <CheckCheck className="h-4 w-4" />
                                Mark all as read
                            </button>
                        )}
                    </div>
                </div>

                <div className="mt-5 flex flex-col gap-3 md:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Search notifications..."
                            className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div className="flex rounded-lg bg-slate-100 p-1">
                        {[
                            ["all", "All"],
                            ["unread", "Unread"],
                            ["read", "Read"],
                        ].map(
                            ([value, label]) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() =>
                                        setFilter(
                                            value
                                        )
                                    }
                                    className={`rounded-md px-4 py-2 text-sm font-medium ${
                                        filter ===
                                        value
                                            ? "bg-white text-slate-900 shadow-sm"
                                            : "text-slate-500 hover:text-slate-700"
                                    }`}
                                >
                                    {label}
                                </button>
                            )
                        )}
                    </div>
                </div>
            </div>

            {errorMessage && (
                <div className="border-b border-red-100 bg-red-50 px-5 py-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-red-700">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        {errorMessage}
                    </div>
                </div>
            )}

            <div>
                {isLoading ? (
                    <div className="flex min-h-[280px] flex-col items-center justify-center p-12 text-center">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />

                        <h3 className="mt-4 font-semibold text-slate-700">
                            Loading notifications
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                            Fetching your latest project
                            and team updates...
                        </p>
                    </div>
                ) : filteredNotifications.length ===
                  0 ? (
                    <div className="flex flex-col items-center justify-center p-12 text-center">
                        <div className="rounded-full bg-slate-100 p-4">
                            <Bell className="h-8 w-8 text-slate-300" />
                        </div>

                        <h3 className="mt-4 font-semibold text-slate-700">
                            No notifications available
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                            There are no notifications
                            matching your current
                            filter.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {filteredNotifications.map(
                            (notification) => {
                                const config =
                                    TYPE_CONFIG[
                                        notification.type
                                    ] ||
                                    TYPE_CONFIG.task;

                                const Icon =
                                    config.icon;

                                const processing =
                                    isProcessing(
                                        notification.id
                                    );

                                return (
                                    <div
                                        key={
                                            notification.id
                                        }
                                        className={`flex gap-4 p-5 transition hover:bg-slate-50 ${
                                            !notification.read
                                                ? "bg-blue-50/30"
                                                : ""
                                        }`}
                                    >
                                        <div
                                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.className}`}
                                        >
                                            <Icon className="h-5 w-5" />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                                <div className="flex items-center gap-2">
                                                    <h3
                                                        className={`text-sm ${
                                                            notification.read
                                                                ? "font-medium text-slate-700"
                                                                : "font-bold text-slate-900"
                                                        }`}
                                                    >
                                                        {
                                                            notification.title
                                                        }
                                                    </h3>

                                                    {!notification.read && (
                                                        <span className="h-2 w-2 rounded-full bg-blue-600" />
                                                    )}
                                                </div>

                                                {(notification.date ||
                                                    notification.time) && (
                                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                                        <Clock3 className="h-3.5 w-3.5" />

                                                        {notification.date}

                                                        {notification.date &&
                                                            notification.time &&
                                                            " · "}

                                                        {
                                                            notification.time
                                                        }
                                                    </div>
                                                )}
                                            </div>

                                            <p className="mt-1 text-sm leading-6 text-slate-600">
                                                {
                                                    notification.message
                                                }
                                            </p>

                                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                                {notification.related && (
                                                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                                                        {
                                                            notification.related
                                                        }
                                                    </span>
                                                )}

                                                {!notification.read && (
                                                    <button
                                                        type="button"
                                                        disabled={
                                                            processing
                                                        }
                                                        onClick={() =>
                                                            markAsRead(
                                                                notification.id
                                                            )
                                                        }
                                                        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        {processing ? (
                                                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                        ) : (
                                                            <Check className="h-3.5 w-3.5" />
                                                        )}

                                                        Mark as read
                                                    </button>
                                                )}

                                                <button
                                                    type="button"
                                                    disabled={
                                                        processing
                                                    }
                                                    onClick={() => {
                                                        if (
                                                            !notification.read
                                                        ) {
                                                            markAsRead(
                                                                notification.id
                                                            );
                                                        }
                                                    }}
                                                    className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800 disabled:cursor-not-allowed"
                                                >
                                                    Open
                                                    <ChevronRight className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                        )}
                    </div>
                )}
            </div>

            <div className="border-t border-slate-200 bg-slate-50 px-5 py-3">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <ShieldAlert className="h-4 w-4" />

                    Notifications only display information
                    the Team Leader is authorized to access.
                </div>
            </div>
        </section>
    );
}
