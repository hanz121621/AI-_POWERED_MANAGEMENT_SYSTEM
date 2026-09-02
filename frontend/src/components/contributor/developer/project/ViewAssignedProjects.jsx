import { useEffect, useMemo, useState } from "react";
import {
    Bell,
    
    CheckCheck,
    Clock,
    Mail,
    MailOpen,
    MessageSquare,
    RefreshCw,
    Search,
    UserRound,
    X,
} from "lucide-react";

// ============================================================
// STORAGE
// ============================================================

const USER_STORAGE_KEYS = [
    "user",
    "currentUser",
    "aipms_user",
];

const MESSAGE_STORAGE_KEYS = [
    "aipms_messages",
    "messages",
];

// ============================================================
// HELPERS
// ============================================================

function getStoredUser() {
    for (const key of USER_STORAGE_KEYS) {
        try {
            const value = localStorage.getItem(key);

            if (value) {
                const parsed = JSON.parse(value);

                if (parsed) {
                    return parsed;
                }
            }
        } catch {
            // Ignore invalid localStorage values
        }
    }

    return null;
}

function getStoredMessages() {
    for (const key of MESSAGE_STORAGE_KEYS) {
        try {
            const value = localStorage.getItem(key);

            if (value) {
                const parsed = JSON.parse(value);

                if (Array.isArray(parsed)) {
                    return parsed;
                }
            }
        } catch {
            // Ignore invalid localStorage values
        }
    }

    return [];
}

function saveMessages(messages) {
    localStorage.setItem(
        "aipms_messages",
        JSON.stringify(messages)
    );
}

function getUserId(user) {
    return (
        user?.userId ??
        user?.id ??
        user?.UserId ??
        user?.Id ??
        user?.email ??
        user?.Email ??
        null
    );
}

function getUserEmail(user) {
    return (
        user?.email ??
        user?.Email ??
        ""
    )
        .toString()
        .toLowerCase();
}

function getUserName(user) {
    return (
        user?.fullName ??
        user?.name ??
        user?.username ??
        user?.UserName ??
        user?.FullName ??
        "Developer"
    );
}

function isMessageForUser(message, user) {
    if (!user || !message) {
        return false;
    }

    const currentUserId = getUserId(user);
    const currentUserEmail = getUserEmail(user);

    const recipientId =
        message.recipientId ??
        message.receiverId ??
        message.toUserId ??
        message.userId ??
        message.recipient?.id ??
        message.receiver?.id;

    const recipientEmail = (
        message.recipientEmail ??
        message.receiverEmail ??
        message.toEmail ??
        message.recipient?.email ??
        message.receiver?.email ??
        ""
    )
        .toString()
        .toLowerCase();

    if (
        currentUserId &&
        recipientId &&
        String(currentUserId) === String(recipientId)
    ) {
        return true;
    }

    if (
        currentUserEmail &&
        recipientEmail &&
        currentUserEmail === recipientEmail
    ) {
        return true;
    }

    return false;
}

function normalizeMessage(message, index) {
    return {
        id:
            message?.id ??
            message?.messageId ??
            message?.MessageId ??
            `message-${index}`,

        senderName:
            message?.senderName ??
            message?.sender?.name ??
            message?.sender?.fullName ??
            message?.fromName ??
            message?.FromName ??
            "Unknown Sender",

        senderEmail:
            message?.senderEmail ??
            message?.sender?.email ??
            message?.fromEmail ??
            "",

        title:
            message?.title ??
            message?.subject ??
            message?.Subject ??
            "Message",

        content:
            message?.content ??
            message?.message ??
            message?.body ??
            message?.Message ??
            "",

        project:
            message?.projectName ??
            message?.project ??
            message?.ProjectName ??
            "General",

        task:
            message?.taskName ??
            message?.task ??
            "",

        createdAt:
            message?.createdAt ??
            message?.sentAt ??
            message?.date ??
            message?.Date ??
            new Date().toISOString(),

        read:
            Boolean(
                message?.read ??
                message?.isRead ??
                message?.IsRead ??
                false
            ),
    };
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

// ============================================================
// COMPONENT
// ============================================================

export default function ReceiveMessages() {
    const [user, setUser] = useState(null);
    const [messages, setMessages] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [showUnreadOnly, setShowUnreadOnly] = useState(false);

    // ========================================================
    // LOAD USER + MESSAGES
    // ========================================================

    useEffect(() => {
        let cancelled = false;

        const loadMessages = async () => {
            try {
                setLoading(true);
                setError("");

                // Allow React to complete the current render before
                // updating state. This avoids the synchronous
                // setState-in-effect ESLint warning.
                await Promise.resolve();

                if (cancelled) {
                    return;
                }

                const currentUser = getStoredUser();

                if (!currentUser) {
                    setUser(null);
                    setMessages([]);
                    setError("Profile not found.");
                    setLoading(false);
                    return;
                }

                const storedMessages = getStoredMessages();

                const normalizedMessages = storedMessages
                    .map(normalizeMessage)
                    .filter((message) =>
                        isMessageForUser(message, currentUser)
                    )
                    .sort(
                        (a, b) =>
                            new Date(b.createdAt) -
                            new Date(a.createdAt)
                    );

                if (cancelled) {
                    return;
                }

                setUser(currentUser);
                setMessages(normalizedMessages);
                setLoading(false);
            } catch {
                if (!cancelled) {
                    setMessages([]);
                    setError(
                        "Unable to load messages. Please try again."
                    );
                    setLoading(false);
                }
            }
        };

        loadMessages();

        return () => {
            cancelled = true;
        };
    }, []);

    // ========================================================
    // FILTER MESSAGES
    // ========================================================

    const filteredMessages = useMemo(() => {
        const search = searchTerm.trim().toLowerCase();

        return messages.filter((message) => {
            const matchesSearch =
                !search ||
                message.senderName
                    .toLowerCase()
                    .includes(search) ||
                message.title
                    .toLowerCase()
                    .includes(search) ||
                message.content
                    .toLowerCase()
                    .includes(search) ||
                message.project
                    .toLowerCase()
                    .includes(search);

            const matchesUnread =
                !showUnreadOnly || !message.read;

            return matchesSearch && matchesUnread;
        });
    }, [messages, searchTerm, showUnreadOnly]);

    // ========================================================
    // COUNTS
    // ========================================================

    const unreadCount = messages.filter(
        (message) => !message.read
    ).length;

    // ========================================================
    // OPEN MESSAGE
    // ========================================================

    const handleOpenMessage = (message) => {
        const updatedMessages = messages.map((item) =>
            item.id === message.id
                ? {
                      ...item,
                      read: true,
                  }
                : item
        );

        setMessages(updatedMessages);
        saveMessages(updatedMessages);

        setSelectedMessage({
            ...message,
            read: true,
        });
    };

    // ========================================================
    // MARK ALL READ
    // ========================================================

    const handleMarkAllRead = () => {
        const updatedMessages = messages.map((message) => ({
            ...message,
            read: true,
        }));

        setMessages(updatedMessages);
        saveMessages(updatedMessages);

        if (selectedMessage) {
            setSelectedMessage({
                ...selectedMessage,
                read: true,
            });
        }
    };

    // ========================================================
    // REFRESH
    // ========================================================

    const handleRefresh = () => {
        const currentUser = getStoredUser();
        const storedMessages = getStoredMessages();

        if (!currentUser) {
            setUser(null);
            setMessages([]);
            setError("Profile not found.");
            return;
        }

        const normalizedMessages = storedMessages
            .map(normalizeMessage)
            .filter((message) =>
                isMessageForUser(message, currentUser)
            )
            .sort(
                (a, b) =>
                    new Date(b.createdAt) -
                    new Date(a.createdAt)
            );

        setUser(currentUser);
        setMessages(normalizedMessages);
        setError("");
    };

    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <RefreshCw
                        size={32}
                        className="animate-spin text-blue-600"
                    />

                    <p className="text-sm text-gray-500">
                        Loading messages...
                    </p>
                </div>
            </div>
        );
    }

    // ========================================================
    // PROFILE NOT FOUND
    // ========================================================

    if (!user) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
                <UserRound
                    size={42}
                    className="mx-auto mb-4 text-red-500"
                />

                <h2 className="text-lg font-semibold text-red-700">
                    Profile not found.
                </h2>

                <p className="mt-2 text-sm text-red-600">
                    Unable to identify the currently logged-in
                    Developer.
                </p>
            </div>
        );
    }

    // ========================================================
    // MAIN UI
    // ========================================================

    return (
        <div className="space-y-6">
            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                            <MessageSquare size={24} />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Receive Messages
                            </h1>

                            <p className="text-sm text-gray-500">
                                View messages from authorized project
                                team members.
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleRefresh}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
                >
                    <RefreshCw size={17} />
                    Refresh
                </button>
            </div>

            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                    <X
                        size={20}
                        className="mt-0.5 text-red-500"
                    />

                    <div>
                        <p className="font-medium text-red-700">
                            {error}
                        </p>

                        <p className="mt-1 text-sm text-red-600">
                            Please try refreshing the page.
                        </p>
                    </div>
                </div>
            )}

            {/* ==================================================
                STATISTICS
            ================================================== */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">
                                Total Messages
                            </p>

                            <p className="mt-1 text-2xl font-bold text-gray-900">
                                {messages.length}
                            </p>
                        </div>

                        <Mail className="text-blue-600" size={26} />
                    </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">
                                Unread
                            </p>

                            <p className="mt-1 text-2xl font-bold text-gray-900">
                                {unreadCount}
                            </p>
                        </div>

                        <Bell className="text-orange-500" size={26} />
                    </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">
                                Read
                            </p>

                            <p className="mt-1 text-2xl font-bold text-gray-900">
                                {messages.length - unreadCount}
                            </p>
                        </div>

                        <CheckCheck
                            className="text-green-600"
                            size={26}
                        />
                    </div>
                </div>
            </div>

            {/* ==================================================
                TOOLBAR
            ================================================== */}

            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="relative flex-1">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(event) =>
                                setSearchTerm(event.target.value)
                            }
                            placeholder="Search messages..."
                            className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() =>
                                setShowUnreadOnly(false)
                            }
                            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                                !showUnreadOnly
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            All
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                setShowUnreadOnly(true)
                            }
                            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                                showUnreadOnly
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            Unread ({unreadCount})
                        </button>

                        {unreadCount > 0 && (
                            <button
                                type="button"
                                onClick={handleMarkAllRead}
                                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                            >
                                <CheckCheck size={16} />
                                Mark all read
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* ==================================================
                MESSAGE LIST
            ================================================== */}

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 px-5 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-semibold text-gray-900">
                                Message Inbox
                            </h2>

                            <p className="mt-1 text-xs text-gray-500">
                                Messages for {getUserName(user)}
                            </p>
                        </div>

                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                            {filteredMessages.length} message
                            {filteredMessages.length !== 1
                                ? "s"
                                : ""}
                        </span>
                    </div>
                </div>

                {filteredMessages.length === 0 ? (
                    <div className="px-6 py-16 text-center">
                        <MailOpen
                            size={46}
                            className="mx-auto mb-4 text-gray-300"
                        />

                        <h3 className="text-lg font-semibold text-gray-700">
                            No messages available.
                        </h3>

                        <p className="mt-2 text-sm text-gray-500">
                            You currently have no messages matching
                            your search.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filteredMessages.map((message) => (
                            <button
                                key={message.id}
                                type="button"
                                onClick={() =>
                                    handleOpenMessage(message)
                                }
                                className={`w-full px-5 py-4 text-left transition hover:bg-gray-50 ${
                                    !message.read
                                        ? "bg-blue-50/40"
                                        : "bg-white"
                                }`}
                            >
                                <div className="flex gap-4">
                                    <div
                                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                                            message.read
                                                ? "bg-gray-100 text-gray-500"
                                                : "bg-blue-100 text-blue-600"
                                        }`}
                                    >
                                        <UserRound size={20} />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                                            <div className="flex items-center gap-2">
                                                <h3
                                                    className={`truncate text-sm ${
                                                        message.read
                                                            ? "font-medium text-gray-800"
                                                            : "font-bold text-gray-900"
                                                    }`}
                                                >
                                                    {
                                                        message.senderName
                                                    }
                                                </h3>

                                                {!message.read && (
                                                    <span className="h-2 w-2 rounded-full bg-blue-600" />
                                                )}
                                            </div>

                                            <span className="flex shrink-0 items-center gap-1 text-xs text-gray-400">
                                                <Clock size={13} />

                                                {formatDate(
                                                    message.createdAt
                                                )}
                                            </span>
                                        </div>

                                        <p className="mt-1 text-sm font-semibold text-gray-800">
                                            {message.title}
                                        </p>

                                        <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                                            {message.content}
                                        </p>

                                        <div className="mt-3 flex flex-wrap items-center gap-2">
                                            {message.project && (
                                                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
                                                    Project:{" "}
                                                    {
                                                        message.project
                                                    }
                                                </span>
                                            )}

                                            {message.task && (
                                                <span className="rounded-full bg-purple-50 px-2.5 py-1 text-xs text-purple-600">
                                                    Task:{" "}
                                                    {message.task}
                                                </span>
                                            )}

                                            <span
                                                className={`rounded-full px-2.5 py-1 text-xs ${
                                                    message.read
                                                        ? "bg-green-50 text-green-600"
                                                        : "bg-blue-50 text-blue-600"
                                                }`}
                                            >
                                                {message.read
                                                    ? "Read"
                                                    : "Unread"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* ==================================================
                MESSAGE DETAILS MODAL
            ================================================== */}

            {selectedMessage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">
                                    Message Details
                                </h2>

                                <p className="mt-1 text-xs text-gray-500">
                                    Received message
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedMessage(null)
                                }
                                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="max-h-[70vh] overflow-y-auto px-6 py-6">
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                    <UserRound size={22} />
                                </div>

                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900">
                                        {
                                            selectedMessage.senderName
                                        }
                                    </h3>

                                    {selectedMessage.senderEmail && (
                                        <p className="text-sm text-gray-500">
                                            {
                                                selectedMessage.senderEmail
                                            }
                                        </p>
                                    )}

                                    <p className="mt-1 text-xs text-gray-400">
                                        {
                                            formatDate(
                                                selectedMessage.createdAt
                                            )
                                        }
                                    </p>
                                </div>

                                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
                                    Read
                                </span>
                            </div>

                            <div className="mt-6">
                                <h3 className="text-xl font-bold text-gray-900">
                                    {selectedMessage.title}
                                </h3>

                                <div className="mt-4 rounded-xl bg-gray-50 p-5">
                                    <p className="whitespace-pre-wrap text-sm leading-7 text-gray-700">
                                        {
                                            selectedMessage.content
                                        }
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div className="rounded-lg border border-gray-200 p-4">
                                    <p className="text-xs text-gray-400">
                                        Related Project
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-gray-800">
                                        {
                                            selectedMessage.project
                                        }
                                    </p>
                                </div>

                                <div className="rounded-lg border border-gray-200 p-4">
                                    <p className="text-xs text-gray-400">
                                        Related Task
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-gray-800">
                                        {selectedMessage.task ||
                                            "Not specified"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex justify-end border-t border-gray-200 px-6 py-4">
                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedMessage(null)
                                }
                                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}