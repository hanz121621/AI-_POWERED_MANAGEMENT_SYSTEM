
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
        <div className="w-full space-y-6 text-foreground">
            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <MessageSquare size={22} />
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-foreground">
                            Receive Messages
                        </h2>

                        <p className="text-sm text-muted-foreground">
                            View messages received from managers
                            and team members.
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleRefresh}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
                >
                    <RefreshCw size={16} />
                    Refresh
                </button>
            </div>

            {/* ==================================================
                SUMMARY
            ================================================== */}

            <div className="grid gap-4 sm:grid-cols-2">
                {/* TOTAL MESSAGES */}

                <div className="rounded-xl border border-border bg-card p-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Inbox size={20} />
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Total Messages
                            </p>

                            <p className="text-2xl font-bold text-foreground">
                                {messages.length}
                            </p>
                        </div>
                    </div>
                </div>

                {/* UNREAD MESSAGES */}

                <div className="rounded-xl border border-border bg-card p-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Mail size={20} />
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Unread Messages
                            </p>

                            <p className="text-2xl font-bold text-foreground">
                                {unreadCount}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ==================================================
                SEARCH
            ================================================== */}

            <div className="relative">
                <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />

                <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) =>
                        setSearchTerm(event.target.value)
                    }
                    placeholder="Search messages..."
                    className="w-full rounded-lg border border-border bg-card py-3 pl-10 pr-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                />
            </div>

            {/* ==================================================
                MESSAGES
            ================================================== */}

            <div className="space-y-3">
                {filteredMessages.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
                        <MailOpen
                            size={42}
                            className="mx-auto text-muted-foreground"
                        />

                        <h3 className="mt-4 font-semibold text-foreground">
                            No messages found
                        </h3>

                        <p className="mt-2 text-sm text-muted-foreground">
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
                                    ? "border-border bg-card hover:bg-muted"
                                    : "border-primary/30 bg-primary/10 hover:bg-primary/15"
                            }`}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex min-w-0 items-start gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-primary">
                                        {message.read ? (
                                            <MailOpen size={19} />
                                        ) : (
                                            <Mail size={19} />
                                        )}
                                    </div>

                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="font-semibold text-foreground">
                                                {message.subject ||
                                                    "No Subject"}
                                            </h3>

                                            {!message.read && (
                                                <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                                                    New
                                                </span>
                                            )}
                                        </div>

                                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
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

                                        <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                                            {message.message}
                                        </p>
                                    </div>
                                </div>

                                <span
                                    className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium ${
                                        message.priority ===
                                        "High"
                                            ? "border-primary/30 bg-primary/10 text-primary"
                                            : "border-border bg-muted text-muted-foreground"
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

            {/* ==================================================
                SELECTED MESSAGE
            ================================================== */}

            {selectedMessage && (
                <div className="rounded-xl border border-primary/30 bg-card p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-foreground">
                                {selectedMessage.subject ||
                                    "No Subject"}
                            </h3>

                            <p className="mt-1 text-sm text-muted-foreground">
                                From:{" "}
                                {selectedMessage.senderName ||
                                    "Unknown sender"}
                            </p>

                            <p className="text-xs text-muted-foreground">
                                {formatDate(
                                    selectedMessage.createdAt
                                )}
                            </p>
                        </div>

                        <CheckCircle2
                            size={22}
                            className="text-primary"
                        />
                    </div>

                    <div className="mt-5 rounded-lg border border-border bg-muted p-4">
                        <p className="whitespace-pre-wrap text-sm leading-6 text-card-foreground">
                            {selectedMessage.message}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ReceiveMessages;
