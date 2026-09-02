
import { useMemo, useState } from "react";
import {
    MessageSquare,
    Search,
    RefreshCw,
    Mail,
    MailOpen,
    User,
    Clock,
    Inbox,
    CheckCircle2,
} from "lucide-react";

// ============================================================
// STORAGE
// ============================================================

const MESSAGES_STORAGE_KEY = "aipms_staff_messages";

// ============================================================
// SAMPLE MESSAGES
// ============================================================

const DEFAULT_MESSAGES = [
    {
        id: "message-001",
        senderName: "Project Manager",
        senderEmail: "manager@example.com",
        subject: "Project Update",
        message:
            "Please review the latest project updates and make sure your assigned tasks are progressing as planned.",
        createdAt: new Date().toISOString(),
        read: false,
        priority: "Normal",
    },
];

// ============================================================
// GET STORED MESSAGES
// ============================================================

function getStoredMessages() {
    try {
        const storedMessages = localStorage.getItem(
            MESSAGES_STORAGE_KEY
        );

        if (!storedMessages) {
            return DEFAULT_MESSAGES;
        }

        const parsedMessages = JSON.parse(storedMessages);

        return Array.isArray(parsedMessages)
            ? parsedMessages
            : DEFAULT_MESSAGES;
    } catch (error) {
        console.error(
            "Failed to load staff messages:",
            error
        );

        return DEFAULT_MESSAGES;
    }
}

// ============================================================
// DATE FORMATTER
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
// MAIN COMPONENT
// ============================================================

function ReceiveMessages() {
    const [messages, setMessages] = useState(
        getStoredMessages
    );

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMessage, setSelectedMessage] =
        useState(null);

    // ========================================================
    // FILTER MESSAGES
    // ========================================================

    const filteredMessages = useMemo(() => {
        const search = searchTerm.trim().toLowerCase();

        if (!search) {
            return messages;
        }

        return messages.filter((message) =>
            [
                message.senderName,
                message.senderEmail,
                message.subject,
                message.message,
                message.priority,
            ]
                .filter(Boolean)
                .some((value) =>
                    String(value)
                        .toLowerCase()
                        .includes(search)
                )
        );
    }, [messages, searchTerm]);

    // ========================================================
    // REFRESH
    // ========================================================

    const handleRefresh = () => {
        setMessages(getStoredMessages());
        setSelectedMessage(null);
    };

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
        setSelectedMessage({
            ...message,
            read: true,
        });

        localStorage.setItem(
            MESSAGES_STORAGE_KEY,
            JSON.stringify(updatedMessages)
        );
    };

    // ========================================================
    // UNREAD COUNT
    // ========================================================

    const unreadCount = messages.filter(
        (message) => !message.read
    ).length;

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400">
                        <MessageSquare size={22} />
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-white">
                            Receive Messages
                        </h2>

                        <p className="text-sm text-slate-400">
                            View messages received from managers
                            and team members.
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleRefresh}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
                >
                    <RefreshCw size={16} />
                    Refresh
                </button>
            </div>

            {/* Summary */}
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400">
                            <Inbox size={20} />
                        </div>

                        <div>
                            <p className="text-sm text-slate-400">
                                Total Messages
                            </p>

                            <p className="text-2xl font-bold text-white">
                                {messages.length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
                            <Mail size={20} />
                        </div>

                        <div>
                            <p className="text-sm text-slate-400">
                                Unread Messages
                            </p>

                            <p className="text-2xl font-bold text-white">
                                {unreadCount}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) =>
                        setSearchTerm(event.target.value)
                    }
                    placeholder="Search messages..."
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
                />
            </div>

            {/* Messages */}
            <div className="space-y-3">
                {filteredMessages.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/40 p-10 text-center">
                        <MailOpen
                            size={42}
                            className="mx-auto text-slate-600"
                        />

                        <h3 className="mt-4 font-semibold text-white">
                            No messages found
                        </h3>

                        <p className="mt-2 text-sm text-slate-400">
                            There are no messages matching your
                            search.
                        </p>
                    </div>
                ) : (
                    filteredMessages.map((message) => (
                        <button
                            key={message.id}
                            type="button"
                            onClick={() =>
                                handleOpenMessage(message)
                            }
                            className={`w-full rounded-xl border p-5 text-left transition ${
                                message.read
                                    ? "border-slate-700 bg-slate-900/50 hover:bg-slate-800/60"
                                    : "border-blue-500/40 bg-blue-500/10 hover:bg-blue-500/15"
                            }`}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex min-w-0 items-start gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-blue-400">
                                        {message.read ? (
                                            <MailOpen size={19} />
                                        ) : (
                                            <Mail size={19} />
                                        )}
                                    </div>

                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="font-semibold text-white">
                                                {message.subject ||
                                                    "No Subject"}
                                            </h3>

                                            {!message.read && (
                                                <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-medium text-white">
                                                    New
                                                </span>
                                            )}
                                        </div>

                                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                                            <span className="inline-flex items-center gap-1">
                                                <User size={13} />
                                                {message.senderName ||
                                                    "Unknown sender"}
                                            </span>

                                            <span className="inline-flex items-center gap-1">
                                                <Clock size={13} />
                                                {formatDate(
                                                    message.createdAt
                                                )}
                                            </span>
                                        </div>

                                        <p className="mt-3 line-clamp-2 text-sm text-slate-400">
                                            {message.message}
                                        </p>
                                    </div>
                                </div>

                                <span
                                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                                        message.priority ===
                                        "High"
                                            ? "bg-red-500/10 text-red-400"
                                            : "bg-slate-800 text-slate-400"
                                    }`}
                                >
                                    {message.priority ||
                                        "Normal"}
                                </span>
                            </div>
                        </button>
                    ))
                )}
            </div>

            {/* Selected Message */}
            {selectedMessage && (
                <div className="rounded-xl border border-blue-500/30 bg-slate-900 p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-white">
                                {selectedMessage.subject ||
                                    "No Subject"}
                            </h3>

                            <p className="mt-1 text-sm text-slate-400">
                                From:{" "}
                                {selectedMessage.senderName ||
                                    "Unknown sender"}
                            </p>

                            <p className="text-xs text-slate-500">
                                {formatDate(
                                    selectedMessage.createdAt
                                )}
                            </p>
                        </div>

                        <CheckCircle2
                            size={22}
                            className="text-emerald-400"
                        />
                    </div>

                    <div className="mt-5 rounded-lg border border-slate-700 bg-slate-950/50 p-4">
                        <p className="whitespace-pre-wrap text-sm leading-6 text-slate-300">
                            {selectedMessage.message}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ReceiveMessages;
