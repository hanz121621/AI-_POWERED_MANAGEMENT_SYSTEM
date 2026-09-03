import { useCallback, useEffect, useState } from "react";
import {
    CheckCheck,
    Clock,
    Inbox,
    Loader2,
    MessageCircle,
    RefreshCw,
    UserRound,
} from "lucide-react";

import {
    getMyMessages,
    markMessageAsRead,
} from "@/services/communicationService";

function getMessageId(message) {
    return (
        message?.id ??
        message?.messageId ??
        message?.Id ??
        message?.MessageId
    );
}

function getSenderName(message) {
    return (
        message?.senderName ??
        message?.SenderName ??
        message?.sender?.name ??
        message?.Sender?.Name ??
        message?.fromName ??
        message?.FromName ??
        "User"
    );
}

function getMessageContent(message) {
    return (
        message?.message ??
        message?.Message ??
        message?.content ??
        message?.Content ??
        message?.text ??
        message?.Text ??
        ""
    );
}

function getCreatedAt(message) {
    return (
        message?.createdAt ??
        message?.CreatedAt ??
        message?.sentAt ??
        message?.SentAt
    );
}

function isMessageRead(message) {
    return Boolean(
        message?.isRead ??
        message?.IsRead ??
        false
    );
}

function formatDate(value) {
    if (!value) {
        return "Unknown time";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleString();
}

export default function ReceiveMessages() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const loadMessages = useCallback(async (isRefresh = false) => {
        try {
            setError("");

            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const result = await getMyMessages();

            setMessages(Array.isArray(result) ? result : []);
        } catch (err) {
            console.error("Unable to load messages:", err);

            setError(
                err?.message ||
                    "Unable to load messages. Please try again."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadMessages();
    }, [loadMessages]);

    const handleMarkRead = async (message) => {
        const messageId = getMessageId(message);

        if (!messageId || isMessageRead(message)) {
            return;
        }

        try {
            await markMessageAsRead(messageId);

            setMessages((current) =>
                current.map((item) => {
                    const id = getMessageId(item);

                    if (id !== messageId) {
                        return item;
                    }

                    return {
                        ...item,
                        isRead: true,
                        IsRead: true,
                    };
                })
            );
        } catch (err) {
            console.error("Unable to mark message as read:", err);

            setError(
                err?.message ||
                    "Unable to mark message as read."
            );
        }
    };

    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-200 bg-gradient-to-r from-white to-cyan-50/50 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
                        <Inbox className="h-5 w-5" />
                    </div>

                    <div>
                        <h2 className="text-lg font-bold text-slate-900">
                            Received Messages
                        </h2>

                        <p className="mt-1 text-sm leading-6 text-slate-600">
                            Messages sent to you by your project team.
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => loadMessages(true)}
                    disabled={refreshing}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {refreshing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <RefreshCw className="h-4 w-4" />
                    )}

                    Refresh
                </button>
            </div>

            {error && (
                <div className="m-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:m-6">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="flex items-center justify-center gap-3 p-10 text-sm text-slate-500">
                    <Loader2 className="h-5 w-5 animate-spin text-cyan-600" />
                    Loading messages...
                </div>
            ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-10 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                        <Inbox className="h-6 w-6" />
                    </div>

                    <h3 className="mt-4 text-sm font-semibold text-slate-900">
                        No messages available.
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                        New team messages will appear here.
                    </p>
                </div>
            ) : (
                <div className="divide-y divide-slate-200">
                    {messages.map((message) => {
                        const messageId = getMessageId(message);
                        const read = isMessageRead(message);

                        return (
                            <article
                                key={messageId}
                                className={`p-5 transition sm:p-6 ${
                                    read
                                        ? "bg-white"
                                        : "bg-cyan-50/40"
                                }`}
                            >
                                <div className="flex gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-cyan-700">
                                        <UserRound className="h-5 w-5" />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                                <span className="text-sm font-semibold text-slate-900">
                                                    {getSenderName(message)}
                                                </span>

                                                {!read && (
                                                    <span className="rounded-full bg-cyan-100 px-2 py-0.5 text-[11px] font-semibold text-cyan-700">
                                                        New
                                                    </span>
                                                )}
                                            </div>

                                            <span className="flex items-center gap-1 text-xs text-slate-500">
                                                <Clock className="h-3 w-3" />
                                                {formatDate(
                                                    getCreatedAt(message)
                                                )}
                                            </span>
                                        </div>

                                        <div className="mt-3 rounded-xl border border-slate-200 bg-white p-4">
                                            <div className="flex gap-2">
                                                <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-cyan-600" />

                                                <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                                                    {getMessageContent(
                                                        message
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        {!read && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleMarkRead(
                                                        message
                                                    )
                                                }
                                                className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-cyan-700 transition hover:text-cyan-900"
                                            >
                                                <CheckCheck className="h-4 w-4" />
                                                Mark as read
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </section>
    );
}