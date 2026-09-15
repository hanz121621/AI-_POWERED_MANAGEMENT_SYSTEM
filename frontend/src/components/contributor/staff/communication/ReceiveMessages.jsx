import { useEffect, useMemo, useState } from "react";

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
    AlertCircle,
} from "lucide-react";

import api from "../../../../services/api";

// ============================================================
// AIPMS — STAFF RECEIVE MESSAGES
//
// Backend endpoints:
//
// GET   /api/communication/messages/inbox
// GET   /api/communication/messages/inbox/{messageId}
// PATCH /api/communication/messages/inbox/{messageId}/read
//
// Backend MessageResponseDto:
//
// Id
// SenderId
// SenderName
// ReceiverId
// ReceiverName
// ProjectId
// TeamId
// TaskId
// Title
// Message
// IsRead
// ReadAt
// CreatedAt
//
// Important:
// - No localStorage is used for messages.
// - Messages come from the backend/database.
// - The backend identifies the authenticated user from JWT.
// - api.js handles the JWT Authorization header.
// ============================================================

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
    const [messages, setMessages] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");

    const [selectedMessage, setSelectedMessage] = useState(null);

    const [loading, setLoading] = useState(true);

    const [refreshing, setRefreshing] = useState(false);

    const [openingMessageId, setOpeningMessageId] = useState(null);

    const [error, setError] = useState("");

    // ========================================================
    // LOAD INBOX
    //
    // GET /api/communication/messages/inbox
    // ========================================================

    const loadMessages = async (showRefreshState = false) => {
        try {
            if (showRefreshState) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const response = await api.get(
                "/communication/messages/inbox"
            );

            const inboxMessages = Array.isArray(response.data)
                ? response.data
                : [];

            setMessages(inboxMessages);

            // Clear selected message when refreshing the inbox.
            setSelectedMessage(null);
        } catch (err) {
            console.error(
                "Failed to load staff messages:",
                err
            );

            const message =
                err?.response?.data?.message ||
                err?.response?.data?.Message ||
                "Unable to load your messages.";

            setError(message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // ========================================================
    // LOAD MESSAGES WHEN COMPONENT OPENS
    // ========================================================

    useEffect(() => {
        loadMessages();
    }, []);

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
                message.title,
                message.message,
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

    const handleRefresh = async () => {
        await loadMessages(true);
    };

    // ========================================================
    // OPEN MESSAGE
    //
    // 1. GET individual message
    // 2. PATCH message as read
    // ========================================================

    const handleOpenMessage = async (message) => {
        try {
            setOpeningMessageId(message.id);
            setError("");

            // -------------------------------------------------
            // Get the complete message from backend
            //
            // GET /api/communication/messages/inbox/{messageId}
            // -------------------------------------------------

            const response = await api.get(
                `/communication/messages/inbox/${message.id}`
            );

            let openedMessage = response.data;

            // -------------------------------------------------
            // Mark message as read if it is unread
            //
            // PATCH
            // /api/communication/messages/inbox/{messageId}/read
            // -------------------------------------------------

            if (!message.isRead) {
                try {
                    await api.patch(
                        `/communication/messages/inbox/${message.id}/read`
                    );

                    openedMessage = {
                        ...openedMessage,
                        isRead: true,
                    };

                    // -------------------------------------------------
                    // Update inbox state locally so the UI
                    // immediately reflects the database change.
                    // -------------------------------------------------

                    setMessages((previousMessages) =>
                        previousMessages.map((item) =>
                            item.id === message.id
                                ? {
                                      ...item,
                                      isRead: true,
                                  }
                                : item
                        )
                    );
                } catch (readError) {
                    console.error(
                        "Failed to mark message as read:",
                        readError
                    );

                    // Still show the message even if the
                    // read-status update fails.
                    openedMessage = {
                        ...openedMessage,
                        isRead: message.isRead,
                    };
                }
            }

            setSelectedMessage(openedMessage);
        } catch (err) {
            console.error(
                "Failed to open message:",
                err
            );

            const message =
                err?.response?.data?.message ||
                err?.response?.data?.Message ||
                "Unable to open this message.";

            setError(message);
        } finally {
            setOpeningMessageId(null);
        }
    };

    // ========================================================
    // UNREAD COUNT
    // ========================================================

    const unreadCount = messages.filter(
        (message) => !message.isRead
    ).length;

    // ========================================================
    // LOADING STATE
    // ========================================================

    if (loading) {
        return (
            <div className="w-full space-y-6 text-foreground">
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

                <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-border bg-card">
                    <div className="flex items-center gap-3 text-primary">
                        <RefreshCw
                            size={20}
                            className="animate-spin"
                        />

                        <span className="text-sm">
                            Loading messages...
                        </span>
                    </div>
                </div>
            </div>
        );
    }

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
                    disabled={refreshing}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <RefreshCw
                        size={16}
                        className={
                            refreshing
                                ? "animate-spin"
                                : ""
                        }
                    />

                    {refreshing
                        ? "Refreshing..."
                        : "Refresh"}
                </button>
            </div>

            {/* ==================================================
                ERROR MESSAGE
            ================================================== */}

            {error && (
                <div className="flex items-start gap-2 rounded-xl border border-red-800/60 bg-red-950/30 px-4 py-3 text-sm text-red-300">
                    <AlertCircle
                        size={18}
                        className="mt-0.5 shrink-0"
                    />

                    <span>{error}</span>
                </div>
            )}

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
                            {searchTerm
                                ? "No messages found"
                                : "No messages"}
                        </h3>

                        <p className="mt-2 text-sm text-muted-foreground">
                            {searchTerm
                                ? "There are no messages matching your search."
                                : "You currently have no received messages."}
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
                            disabled={
                                openingMessageId ===
                                message.id
                            }
                            className={`w-full rounded-xl border p-5 text-left transition disabled:cursor-wait disabled:opacity-70 ${
                                message.isRead
                                    ? "border-border bg-card hover:bg-muted"
                                    : "border-primary/30 bg-primary/10 hover:bg-primary/15"
                            }`}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex min-w-0 items-start gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-primary">
                                        {openingMessageId ===
                                        message.id ? (
                                            <RefreshCw
                                                size={19}
                                                className="animate-spin"
                                            />
                                        ) : message.isRead ? (
                                            <MailOpen size={19} />
                                        ) : (
                                            <Mail size={19} />
                                        )}
                                    </div>

                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="font-semibold text-foreground">
                                                {message.title ||
                                                    "No Subject"}
                                            </h3>

                                            {!message.isRead && (
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
                                            {message.message ||
                                                "No message content."}
                                        </p>
                                    </div>
                                </div>
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
                                {selectedMessage.title ||
                                    "No Subject"}
                            </h3>

                            <p className="mt-1 text-sm text-muted-foreground">
                                From:{" "}
                                {selectedMessage.senderName ||
                                    "Unknown sender"}
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
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
                            {selectedMessage.message ||
                                "No message content."}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ReceiveMessages;