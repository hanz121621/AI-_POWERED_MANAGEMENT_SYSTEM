import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

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

import {
    getMyMessages,
    getMyMessageById,
    markMessageAsRead,
    getUnreadMessageCount,
} from "../../../../services/communicationService";

// ============================================================
// HELPERS
// ============================================================

function getValue(object, keys, fallback = "") {
    for (const key of keys) {
        const value = key
            .split(".")
            .reduce(
                (current, part) =>
                    current?.[part],
                object
            );

        if (
            value !== undefined &&
            value !== null &&
            value !== ""
        ) {
            return value;
        }
    }

    return fallback;
}

function normalizeMessage(message, index) {
    return {
        raw: message,

        id: getValue(
            message,
            ["id", "messageId", "MessageId"],
            `message-${index}`
        ),

        senderName: getValue(
            message,
            [
                "senderName",
                "SenderName",
                "sender.name",
                "sender.fullName",
                "Sender.Name",
                "Sender.FullName",
                "fromName",
                "FromName",
            ],
            "Unknown Sender"
        ),

        senderEmail: getValue(
            message,
            [
                "senderEmail",
                "SenderEmail",
                "sender.email",
                "Sender.Email",
                "fromEmail",
                "FromEmail",
            ],
            ""
        ),

        title: getValue(
            message,
            [
                "title",
                "Title",
                "subject",
                "Subject",
            ],
            "Message"
        ),

        content: getValue(
            message,
            [
                "content",
                "Content",
                "message",
                "Message",
                "body",
                "Body",
            ],
            ""
        ),

        project: getValue(
            message,
            [
                "projectName",
                "ProjectName",
                "project.name",
                "Project.Name",
                "project",
                "Project",
            ],
            "General"
        ),

        task: getValue(
            message,
            [
                "taskName",
                "TaskName",
                "task.name",
                "Task.Name",
                "task",
                "Task",
            ],
            ""
        ),

        createdAt: getValue(
            message,
            [
                "createdAt",
                "CreatedAt",
                "sentAt",
                "SentAt",
                "date",
                "Date",
            ],
            null
        ),

        read: Boolean(
            getValue(
                message,
                [
                    "read",
                    "Read",
                    "isRead",
                    "IsRead",
                ],
                false
            )
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
    const [messages, setMessages] = useState([]);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const [searchTerm, setSearchTerm] = useState("");
    const [showUnreadOnly, setShowUnreadOnly] =
        useState(false);

    const [selectedMessage, setSelectedMessage] =
        useState(null);

    // ========================================================
    // LOAD INBOX
    // ========================================================

    const loadMessages = useCallback(
        async (showLoading = true) => {
            try {
                if (showLoading) {
                    setLoading(true);
                } else {
                    setRefreshing(true);
                }

                setError("");

                const response = await getMyMessages();

                const normalized = response
                    .map(normalizeMessage)
                    .sort((a, b) => {
                        const first = a.createdAt
                            ? new Date(a.createdAt).getTime()
                            : 0;

                        const second = b.createdAt
                            ? new Date(b.createdAt).getTime()
                            : 0;

                        return second - first;
                    });

                setMessages(normalized);
            } catch (err) {
                console.error(
                    "Failed to load messages:",
                    err
                );

                if (
                    err?.response?.status === 401 ||
                    err?.response?.status === 403
                ) {
                    setError(
                        "Access denied. Please sign in again."
                    );
                } else {
                    setError(
                        "Unable to load messages. Please try again."
                    );
                }

                setMessages([]);
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        []
    );

    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {
        loadMessages(true);
    }, [loadMessages]);

    // ========================================================
    // FILTER
    // ========================================================

    const filteredMessages = useMemo(() => {
        const search =
            searchTerm.trim().toLowerCase();

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
                    .includes(search) ||
                message.task
                    .toLowerCase()
                    .includes(search);

            const matchesUnread =
                !showUnreadOnly || !message.read;

            return (
                matchesSearch &&
                matchesUnread
            );
        });
    }, [
        messages,
        searchTerm,
        showUnreadOnly,
    ]);

    // ========================================================
    // COUNTS
    // ========================================================

    const unreadCount = messages.filter(
        (message) => !message.read
    ).length;

    const readCount =
        messages.length - unreadCount;

    // ========================================================
    // OPEN MESSAGE
    // ========================================================

    const handleOpenMessage = async (message) => {
        try {
            let detail = message.raw;

            if (message.id) {
                try {
                    const response =
                        await getMyMessageById(
                            message.id
                        );

                    if (response) {
                        detail = response;
                    }
                } catch (detailError) {
                    console.warn(
                        "Could not load message details:",
                        detailError
                    );
                }
            }

            if (!message.read && message.id) {
                await markMessageAsRead(
                    message.id
                );
            }

            const normalizedDetail =
                normalizeMessage(
                    detail,
                    0
                );

            normalizedDetail.read = true;

            setMessages((current) =>
                current.map((item) =>
                    String(item.id) ===
                    String(message.id)
                        ? {
                              ...item,
                              ...normalizedDetail,
                              read: true,
                          }
                        : item
                )
            );

            setSelectedMessage(
                normalizedDetail
            );
        } catch (err) {
            console.error(
                "Failed to open message:",
                err
            );

            setError(
                "Unable to open this message. Please try again."
            );
        }
    };

    // ========================================================
    // MARK ALL READ
    // ========================================================
    //
    // Backend currently exposes only:
    // PATCH /communication/messages/inbox/{id}/read
    //
    // Therefore we call that endpoint for each unread
    // message rather than inventing a mark-all endpoint.
    // ========================================================

    const handleMarkAllRead = async () => {
        const unreadMessages =
            messages.filter(
                (message) =>
                    !message.read
            );

        if (!unreadMessages.length) {
            return;
        }

        try {
            setError("");

            await Promise.all(
                unreadMessages
                    .filter(
                        (message) =>
                            message.id
                    )
                    .map((message) =>
                        markMessageAsRead(
                            message.id
                        )
                    )
            );

            setMessages((current) =>
                current.map(
                    (message) => ({
                        ...message,
                        read: true,
                    })
                )
            );

            if (selectedMessage) {
                setSelectedMessage({
                    ...selectedMessage,
                    read: true,
                });
            }
        } catch (err) {
            console.error(
                "Failed to mark all messages read:",
                err
            );

            setError(
                "Unable to mark all messages as read."
            );
        }
    };

    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-slate-200 bg-white">
                <div className="flex flex-col items-center gap-3">
                    <RefreshCw
                        size={32}
                        className="animate-spin text-blue-600"
                    />

                    <p className="text-sm font-medium text-slate-600">
                        Loading messages...
                    </p>
                </div>
            </div>
        );
    }

    // ========================================================
    // MAIN UI
    // ========================================================

    return (
        <div className="space-y-6 text-slate-900">
            {/* HEADER */}

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                        <MessageSquare
                            size={24}
                        />
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                            Receive Messages
                        </h2>

                        <p className="text-sm text-slate-500">
                            View messages from
                            authorized project
                            team members.
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        loadMessages(false)
                    }
                    disabled={refreshing}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                    <RefreshCw
                        size={17}
                        className={
                            refreshing
                                ? "animate-spin"
                                : ""
                        }
                    />

                    Refresh
                </button>
            </div>

            {/* ERROR */}

            {error && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                    <X
                        size={20}
                        className="mt-0.5 shrink-0 text-red-500"
                    />

                    <div>
                        <p className="font-medium text-red-700">
                            {error}
                        </p>

                        <p className="mt-1 text-sm text-red-600">
                            Please try refreshing
                            the page.
                        </p>
                    </div>
                </div>
            )}

            {/* STATISTICS */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Total Messages
                            </p>

                            <p className="mt-1 text-2xl font-bold text-slate-900">
                                {
                                    messages.length
                                }
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                            <Mail
                                className="text-blue-600"
                                size={24}
                            />
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Unread
                            </p>

                            <p className="mt-1 text-2xl font-bold text-slate-900">
                                {
                                    unreadCount
                                }
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50">
                            <Bell
                                className="text-orange-500"
                                size={24}
                            />
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Read
                            </p>

                            <p className="mt-1 text-2xl font-bold text-slate-900">
                                {readCount}
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">
                            <CheckCheck
                                className="text-green-600"
                                size={24}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* TOOLBAR */}

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="relative flex-1">
                        <Search
                            size={18}
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(event) =>
                                setSearchTerm(
                                    event.target
                                        .value
                                )
                            }
                            placeholder="Search messages..."
                            aria-label="Search messages"
                            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-slate-900 caret-slate-900 outline-none placeholder:text-slate-400 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() =>
                                setShowUnreadOnly(
                                    false
                                )
                            }
                            className={`rounded-lg px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                                !showUnreadOnly
                                    ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                            }`}
                        >
                            All
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                setShowUnreadOnly(
                                    true
                                )
                            }
                            className={`rounded-lg px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                                showUnreadOnly
                                    ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                            }`}
                        >
                            Unread ({unreadCount})
                        </button>

                        {unreadCount > 0 && (
                            <button
                                type="button"
                                onClick={
                                    handleMarkAllRead
                                }
                                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700 focus:outline-none focus:ring-2 focus:ring-green-200"
                            >
                                <CheckCheck
                                    size={16}
                                />

                                Mark all read
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* MESSAGE LIST */}

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 bg-white px-5 py-4">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <h2 className="font-semibold text-slate-900">
                                Message Inbox
                            </h2>

                            <p className="mt-1 text-xs text-slate-500">
                                Messages received
                                from authorized
                                users
                            </p>
                        </div>

                        <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                            {
                                filteredMessages.length
                            }{" "}
                            message
                            {filteredMessages.length !==
                            1
                                ? "s"
                                : ""}
                        </span>
                    </div>
                </div>

                {filteredMessages.length ===
                0 ? (
                    <div className="bg-white px-6 py-16 text-center">
                        <MailOpen
                            size={46}
                            className="mx-auto mb-4 text-slate-300"
                        />

                        <h3 className="text-lg font-semibold text-slate-800">
                            No messages
                            available.
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            You currently have no
                            messages matching
                            your search.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {filteredMessages.map(
                            (message) => (
                                <button
                                    key={
                                        message.id
                                    }
                                    type="button"
                                    onClick={() =>
                                        handleOpenMessage(
                                            message
                                        )
                                    }
                                    className={`w-full px-5 py-4 text-left transition focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-300 ${
                                        !message.read
                                            ? "bg-blue-50/50 hover:bg-blue-50"
                                            : "bg-white hover:bg-slate-50"
                                    }`}
                                >
                                    <div className="flex gap-4">
                                        <div
                                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                                                message.read
                                                    ? "bg-slate-100 text-slate-500"
                                                    : "bg-blue-100 text-blue-600"
                                            }`}
                                        >
                                            <UserRound
                                                size={
                                                    20
                                                }
                                            />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                                                <div className="flex min-w-0 items-center gap-2">
                                                    <h3
                                                        className={`truncate text-sm ${
                                                            message.read
                                                                ? "font-medium text-slate-800"
                                                                : "font-bold text-slate-900"
                                                        }`}
                                                    >
                                                        {
                                                            message.senderName
                                                        }
                                                    </h3>

                                                    {!message.read && (
                                                        <span
                                                            className="h-2 w-2 shrink-0 rounded-full bg-blue-600"
                                                            aria-label="Unread"
                                                        />
                                                    )}
                                                </div>

                                                <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-slate-400">
                                                    <Clock
                                                        size={
                                                            13
                                                        }
                                                    />

                                                    {formatDate(
                                                        message.createdAt
                                                    )}
                                                </span>
                                            </div>

                                            <p className="mt-1 text-sm font-semibold text-slate-800">
                                                {
                                                    message.title
                                                }
                                            </p>

                                            <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">
                                                {
                                                    message.content
                                                }
                                            </p>

                                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                                {message.project && (
                                                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                                                        Project:{" "}
                                                        {
                                                            message.project
                                                        }
                                                    </span>
                                                )}

                                                {message.task && (
                                                    <span className="rounded-full bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700">
                                                        Task:{" "}
                                                        {
                                                            message.task
                                                        }
                                                    </span>
                                                )}

                                                <span
                                                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                                        message.read
                                                            ? "bg-green-50 text-green-700"
                                                            : "bg-blue-50 text-blue-700"
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
                            )
                        )}
                    </div>
                )}
            </div>

            {/* MESSAGE MODAL */}

            {selectedMessage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[2px]"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="message-details-title"
                >
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
                            <div>
                                <h2
                                    id="message-details-title"
                                    className="text-lg font-bold text-slate-900"
                                >
                                    Message Details
                                </h2>

                                <p className="mt-1 text-xs text-slate-500">
                                    Received message
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedMessage(
                                        null
                                    )
                                }
                                aria-label="Close message"
                                className="rounded-lg bg-white p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="max-h-[70vh] overflow-y-auto bg-white px-6 py-6">
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                    <UserRound
                                        size={22}
                                    />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <h3 className="font-semibold text-slate-900">
                                        {
                                            selectedMessage.senderName
                                        }
                                    </h3>

                                    {selectedMessage.senderEmail && (
                                        <p className="break-all text-sm text-slate-500">
                                            {
                                                selectedMessage.senderEmail
                                            }
                                        </p>
                                    )}

                                    <p className="mt-1 text-xs text-slate-400">
                                        {formatDate(
                                            selectedMessage.createdAt
                                        )}
                                    </p>
                                </div>

                                <span className="shrink-0 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                                    Read
                                </span>
                            </div>

                            <div className="mt-6">
                                <h3 className="text-xl font-bold text-slate-900">
                                    {
                                        selectedMessage.title
                                    }
                                </h3>

                                <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-5">
                                    <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                                        {
                                            selectedMessage.content
                                        }
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div className="rounded-lg border border-slate-200 bg-white p-4">
                                    <p className="text-xs font-medium text-slate-400">
                                        Related Project
                                    </p>

                                    <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                                        {selectedMessage.project ||
                                            "General"}
                                    </p>
                                </div>

                                <div className="rounded-lg border border-slate-200 bg-white p-4">
                                    <p className="text-xs font-medium text-slate-400">
                                        Related Task
                                    </p>

                                    <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                                        {selectedMessage.task ||
                                            "Not specified"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end border-t border-slate-200 bg-white px-6 py-4">
                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedMessage(
                                        null
                                    )
                                }
                                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
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