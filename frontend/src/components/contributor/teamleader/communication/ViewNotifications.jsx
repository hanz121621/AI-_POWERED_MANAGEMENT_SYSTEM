import { useMemo, useState } from "react";
import {
    Bell,
    Check,
    CheckCheck,
    ChevronRight,
    Clock3,
    MessageSquare,
    RefreshCw,
    Search,
    ShieldAlert,
    Timer,
    UserRound,
} from "lucide-react";

const INITIAL_NOTIFICATIONS = [
    {
        id: 1,
        type: "task",
        title: "New task assigned",
        message:
            "The Manager assigned a new authentication task to your team.",
        date: "Sep 1, 2026",
        time: "10:15 AM",
        read: false,
        related: "Authentication Module",
    },
    {
        id: 2,
        type: "status",
        title: "Task status changed",
        message:
            "Abebe Kebede changed 'API Integration' from In Progress to Review.",
        date: "Sep 1, 2026",
        time: "09:45 AM",
        read: false,
        related: "API Integration",
    },
    {
        id: 3,
        type: "message",
        title: "New manager message",
        message:
            "You received a new message from the Project Manager about Sprint 3.",
        date: "Sep 1, 2026",
        time: "09:30 AM",
        read: true,
        related: "Sprint 3",
    },
    {
        id: 4,
        type: "mention",
        title: "You were mentioned",
        message:
            "Sara Mohammed mentioned you in a task discussion.",
        date: "Aug 31, 2026",
        time: "04:20 PM",
        read: true,
        related: "API Integration",
    },
    {
        id: 5,
        type: "sprint",
        title: "Sprint updated",
        message:
            "Sprint 3 has been updated with new priorities and deadlines.",
        date: "Aug 31, 2026",
        time: "02:00 PM",
        read: true,
        related: "Sprint 3",
    },
    {
        id: 6,
        type: "deadline",
        title: "Deadline reminder",
        message:
            "The Authentication API task is due tomorrow.",
        date: "Aug 31, 2026",
        time: "11:00 AM",
        read: false,
        related: "Authentication API",
    },
];

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

export default function ViewNotifications() {
    const [notifications, setNotifications] = useState(
        INITIAL_NOTIFICATIONS
    );
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");

    const unreadCount = notifications.filter(
        (notification) => !notification.read
    ).length;

    const filteredNotifications = useMemo(() => {
        return notifications.filter((notification) => {
            const matchesFilter =
                filter === "all" ||
                (filter === "unread" && !notification.read) ||
                (filter === "read" && notification.read);

            const matchesSearch =
                notification.title
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                notification.message
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                notification.related
                    .toLowerCase()
                    .includes(search.toLowerCase());

            return matchesFilter && matchesSearch;
        });
    }, [notifications, filter, search]);

    const markAsRead = (id) => {
        setNotifications((current) =>
            current.map((notification) =>
                notification.id === id
                    ? { ...notification, read: true }
                    : notification
            )
        );
    };

    const markAllAsRead = () => {
        setNotifications((current) =>
            current.map((notification) => ({
                ...notification,
                read: true,
            }))
        );
    };

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
                                Important project, task, sprint, and team
                                updates.
                            </p>
                        </div>
                    </div>

                    {unreadCount > 0 && (
                        <button
                            type="button"
                            onClick={markAllAsRead}
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            <CheckCheck className="h-4 w-4" />
                            Mark all as read
                        </button>
                    )}
                </div>

                <div className="mt-5 flex flex-col gap-3 md:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search notifications..."
                            className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div className="flex rounded-lg bg-slate-100 p-1">
                        {[
                            ["all", "All"],
                            ["unread", "Unread"],
                            ["read", "Read"],
                        ].map(([value, label]) => (
                            <button
                                key={value}
                                type="button"
                                onClick={() => setFilter(value)}
                                className={`rounded-md px-4 py-2 text-sm font-medium ${
                                    filter === value
                                        ? "bg-white text-slate-900 shadow-sm"
                                        : "text-slate-500 hover:text-slate-700"
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div>
                {filteredNotifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 text-center">
                        <div className="rounded-full bg-slate-100 p-4">
                            <Bell className="h-8 w-8 text-slate-300" />
                        </div>

                        <h3 className="mt-4 font-semibold text-slate-700">
                            No notifications available
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                            There are no notifications matching your current
                            filter.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {filteredNotifications.map((notification) => {
                            const config =
                                TYPE_CONFIG[notification.type] ||
                                TYPE_CONFIG.task;

                            const Icon = config.icon;

                            return (
                                <div
                                    key={notification.id}
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
                                                    {notification.title}
                                                </h3>

                                                {!notification.read && (
                                                    <span className="h-2 w-2 rounded-full bg-blue-600" />
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                                <Clock3 className="h-3.5 w-3.5" />
                                                {notification.date} ·{" "}
                                                {notification.time}
                                            </div>
                                        </div>

                                        <p className="mt-1 text-sm leading-6 text-slate-600">
                                            {notification.message}
                                        </p>

                                        <div className="mt-3 flex flex-wrap items-center gap-2">
                                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                                                {notification.related}
                                            </span>

                                            {!notification.read && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        markAsRead(
                                                            notification.id
                                                        )
                                                    }
                                                    className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50"
                                                >
                                                    <Check className="h-3.5 w-3.5" />
                                                    Mark as read
                                                </button>
                                            )}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    markAsRead(notification.id)
                                                }
                                                className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800"
                                            >
                                                Open
                                                <ChevronRight className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="border-t border-slate-200 bg-slate-50 px-5 py-3">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <ShieldAlert className="h-4 w-4" />
                    Notifications only display information the Team Leader is
                    authorized to access.
                </div>
            </div>
        </section>
    );
}