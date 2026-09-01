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

const INITIAL_NOTIFICATIONS = [
    {
        id: 1,
        type: "task",
        title: "New task assigned",
        message: "You have been assigned a new development task.",
        related: "Implement Authentication API",
        date: "Sep 1, 2026 09:30 AM",
        read: false,
    },
    {
        id: 2,
        type: "status",
        title: "Task status updated",
        message: "Your task has been moved to Review.",
        related: "Developer Profile Management",
        date: "Sep 1, 2026 08:15 AM",
        read: false,
    },
    {
        id: 3,
        type: "message",
        title: "New Team Leader message",
        message: "Please review the latest sprint requirements.",
        related: "Sprint 4",
        date: "Aug 31, 2026 04:20 PM",
        read: true,
    },
    {
        id: 4,
        type: "mention",
        title: "You were mentioned",
        message: "Sara Ahmed mentioned you in a task comment.",
        related: "API Integration",
        date: "Aug 31, 2026 02:10 PM",
        read: false,
    },
    {
        id: 5,
        type: "deadline",
        title: "Deadline reminder",
        message: "A task deadline is approaching.",
        related: "Profile API",
        date: "Aug 31, 2026 10:00 AM",
        read: true,
    },
    {
        id: 6,
        type: "review",
        title: "Review result available",
        message: "Your submitted work has received review feedback.",
        related: "Authentication Module",
        date: "Aug 30, 2026 05:30 PM",
        read: true,
    },
];

function getNotificationIcon(type) {
    switch (type) {
        case "task":
            return <ClipboardCheck className="h-5 w-5" />;

        case "status":
            return <CheckCheck className="h-5 w-5" />;

        case "message":
            return <MessageSquare className="h-5 w-5" />;

        case "mention":
            return <UserRound className="h-5 w-5" />;

        case "deadline":
            return <Clock className="h-5 w-5" />;

        case "review":
            return <Check className="h-5 w-5" />;

        default:
            return <Bell className="h-5 w-5" />;
    }
}

function ViewNotifications() {
    const [notifications, setNotifications] = useState(
        INITIAL_NOTIFICATIONS
    );
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    const unreadCount = notifications.filter(
        (notification) => !notification.read
    ).length;

    const filteredNotifications = useMemo(() => {
        return notifications.filter((notification) => {
            const matchesFilter =
                filter === "all" ||
                (filter === "unread" && !notification.read) ||
                (filter === "read" && notification.read);

            const searchValue = search.toLowerCase();

            const matchesSearch =
                notification.title.toLowerCase().includes(searchValue) ||
                notification.message.toLowerCase().includes(searchValue) ||
                notification.related.toLowerCase().includes(searchValue);

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
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="mx-auto max-w-6xl">
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            Notifications
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            View task, project, sprint, communication, and work
                            notifications.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-white px-4 py-2 shadow-sm">
                            <span className="text-sm font-medium text-slate-700">
                                {unreadCount} unread
                            </span>
                        </div>

                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                            >
                                <CheckCheck className="h-4 w-4" />
                                Mark all read
                            </button>
                        )}
                    </div>
                </div>

                <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex flex-col gap-4 md:flex-row">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search notifications..."
                                className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                        >
                            <option value="all">All notifications</option>
                            <option value="unread">Unread</option>
                            <option value="read">Read</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-3">
                    {filteredNotifications.length === 0 ? (
                        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                            <Bell className="mx-auto mb-4 h-12 w-12 text-slate-300" />

                            <h2 className="font-semibold text-slate-700">
                                No new notifications available.
                            </h2>

                            <p className="mt-2 text-sm text-slate-500">
                                You are all caught up.
                            </p>
                        </div>
                    ) : (
                        filteredNotifications.map((notification) => (
                            <button
                                key={notification.id}
                                onClick={() =>
                                    markAsRead(notification.id)
                                }
                                className={`w-full rounded-xl border p-5 text-left shadow-sm transition hover:shadow-md ${
                                    notification.read
                                        ? "border-slate-200 bg-white"
                                        : "border-blue-200 bg-blue-50/50"
                                }`}
                            >
                                <div className="flex gap-4">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                        {getNotificationIcon(
                                            notification.type
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold text-slate-900">
                                                        {notification.title}
                                                    </h3>

                                                    {!notification.read && (
                                                        <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
                                                            New
                                                        </span>
                                                    )}
                                                </div>

                                                <p className="mt-1 text-sm leading-6 text-slate-600">
                                                    {notification.message}
                                                </p>
                                            </div>

                                            <span className="flex shrink-0 items-center gap-1 text-xs text-slate-400">
                                                <Clock className="h-3 w-3" />
                                                {notification.date}
                                            </span>
                                        </div>

                                        <div className="mt-4 flex flex-wrap gap-3">
                                            <span className="flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600">
                                                <FolderKanban className="h-3 w-3" />
                                                {notification.related}
                                            </span>

                                            {notification.read && (
                                                <span className="flex items-center gap-1 text-xs text-green-600">
                                                    <Check className="h-3 w-3" />
                                                    Read
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                </div>

                <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700">
                    <AlertCircle className="mr-2 inline h-4 w-4" />
                    Selecting a notification marks it as read. Related content
                    can later be connected to your backend routes.
                </div>
            </div>
        </div>
    );
}

export default ViewNotifications;
