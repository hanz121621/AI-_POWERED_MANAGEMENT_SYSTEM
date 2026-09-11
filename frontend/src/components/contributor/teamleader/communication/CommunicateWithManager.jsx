
import { useEffect, useMemo, useState } from "react";

import {
    Send,
    Search,
    MessageSquare,
    UserRound,
    Clock3,
    CheckCircle2,
    AlertCircle,
    Paperclip,
    RefreshCw,
    ArrowLeft,
} from "lucide-react";

import api from "@/services/api";

function getInitials(name = "Manager") {
    return name
        .split(" ")
        .filter(Boolean)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

function getValue(object, ...keys) {
    for (const key of keys) {
        if (
            object &&
            object[key] !== undefined &&
            object[key] !== null
        ) {
            return object[key];
        }
    }

    return null;
}

function normalizeMessage(item) {
    const senderId = getValue(
        item,
        "senderId",
        "SenderId",
        "fromUserId",
        "FromUserId"
    );

    const receiverId = getValue(
        item,
        "receiverId",
        "ReceiverId",
        "toUserId",
        "ToUserId"
    );

    const senderName =
        getValue(
            item,
            "senderName",
            "SenderName",
            "fromUserName",
            "FromUserName"
        ) || "Manager";

    const text =
        getValue(
            item,
            "message",
            "Message",
            "content",
            "Content",
            "text",
            "Text",
            "body",
            "Body"
        ) || "";

    const createdAt =
        getValue(
            item,
            "createdAt",
            "CreatedAt",
            "sentAt",
            "SentAt",
            "date",
            "Date"
        );

    return {
        id:
            getValue(
                item,
                "id",
                "Id",
                "messageId",
                "MessageId"
            ) || crypto.randomUUID(),
        senderId,
        receiverId,
        senderName,
        text,
        createdAt,
        isRead:
            getValue(
                item,
                "isRead",
                "IsRead",
                "read",
                "Read"
            ) ?? false,
    };
}

function formatMessageTime(value) {
    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
}

function formatLastMessageTime(value) {
    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function extractList(response) {
    const payload = response?.data;

    if (Array.isArray(payload)) {
        return payload;
    }

    if (Array.isArray(payload?.data)) {
        return payload.data;
    }

    if (Array.isArray(payload?.Data)) {
        return payload.Data;
    }

    if (Array.isArray(payload?.messages)) {
        return payload.messages;
    }

    if (Array.isArray(payload?.Messages)) {
        return payload.Messages;
    }

    return [];
}

function extractSingle(response) {
    const payload = response?.data;

    return (
        payload?.message ??
        payload?.Message ??
        payload?.data ??
        payload?.Data ??
        payload
    );
}

export default function CommunicateWithManager() {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [selectedMessageId, setSelectedMessageId] = useState(null);

    const clearMessages = () => {
        setSuccessMessage("");
        setErrorMessage("");
    };

    const loadMessages = async (showSuccess = false) => {
        clearMessages();
        setIsLoading(true);

        try {
            const response = await api.get(
                "/communication/messages/inbox"
            );

            const data = extractList(response)
                .map(normalizeMessage)
                .filter((item) => item.text);

            setMessages(data);

            if (showSuccess) {
                setSuccessMessage("Messages refreshed successfully.");
            }
        } catch (error) {
            console.error(
                "Failed to load manager messages:",
                error
            );

            setErrorMessage(
                error?.response?.data?.message ||
                    error?.response?.data?.Message ||
                    "Unable to load messages. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadMessages();
    }, []);

    const managerMessages = useMemo(() => {
        return messages.filter((item) => {
            const senderName =
                item.senderName?.toLowerCase() || "";

            return (
                senderName.includes("manager") ||
                senderName.includes("project manager")
            );
        });
    }, [messages]);

    const filteredMessages = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();

        if (!term) {
            return messages;
        }

        return messages.filter((item) => {
            return (
                item.text.toLowerCase().includes(term) ||
                item.senderName.toLowerCase().includes(term)
            );
        });
    }, [messages, searchTerm]);

    const unreadCount = useMemo(() => {
        return messages.filter((item) => !item.isRead).length;
    }, [messages]);

    const selectedMessage = useMemo(() => {
        if (!selectedMessageId) {
            return null;
        }

        return messages.find(
            (item) => String(item.id) === String(selectedMessageId)
        );
    }, [messages, selectedMessageId]);

    const conversationMessages = useMemo(() => {
        return filteredMessages;
    }, [filteredMessages]);

    const managerName = useMemo(() => {
        if (selectedMessage?.senderName) {
            return selectedMessage.senderName;
        }

        if (managerMessages[0]?.senderName) {
            return managerMessages[0].senderName;
        }

        return "Project Manager";
    }, [selectedMessage, managerMessages]);

    const markAsRead = async (messageId) => {
        if (!messageId) {
            return;
        }

        try {
            await api.patch(
                `/communication/messages/inbox/${messageId}/read`
            );

            setMessages((current) =>
                current.map((item) =>
                    String(item.id) === String(messageId)
                        ? {
                              ...item,
                              isRead: true,
                          }
                        : item
                )
            );
        } catch (error) {
            console.error(
                "Failed to mark message as read:",
                error
            );
        }
    };

    const handleSelectMessage = async (item) => {
        clearMessages();

        setSelectedMessageId(item.id);

        if (!item.isRead) {
            await markAsRead(item.id);
        }
    };

    const handleSendMessage = async () => {
        clearMessages();

        const trimmedMessage = message.trim();

        if (!trimmedMessage) {
            setErrorMessage(
                "Please enter a message before sending."
            );
            return;
        }

        setIsSending(true);

        try {
            /*
             * The backend MessageController exposes:
             *
             * POST /api/communication/messages/team-leader
             *
             * The exact SendTeamLeaderMessageDto should be used here.
             * The backend controller receives the authenticated Manager
             * automatically, so the frontend must not send managerId.
             */

            const response = await api.post(
                "/communication/messages/team-leader",
                {
                    message: trimmedMessage,
                }
            );

            const createdMessage = normalizeMessage(
                extractSingle(response)
            );

            if (createdMessage?.text) {
                setMessages((current) => [
                    ...current,
                    {
                        ...createdMessage,
                        senderName: "You",
                    },
                ]);
            } else {
                await loadMessages();
            }

            setMessage("");
            setSuccessMessage(
                "Message sent successfully."
            );
        } catch (error) {
            console.error(
                "Failed to send message:",
                error
            );

            setErrorMessage(
                error?.response?.data?.message ||
                    error?.response?.data?.Message ||
                    "Unable to send the message. Please try again."
            );
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyDown = (event) => {
        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {
            event.preventDefault();
            handleSendMessage();
        }
    };

    const handleRefresh = async () => {
        await loadMessages(true);
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-indigo-600">
                            <MessageSquare className="h-4 w-4" />
                            Team Leader Communication
                        </div>

                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                            Communicate With Manager
                        </h1>

                        <p className="mt-1 max-w-2xl text-sm text-slate-500">
                            Communicate directly with your project
                            manager, provide team updates, report
                            blockers, and coordinate project
                            activities.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleRefresh}
                        disabled={isLoading}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <RefreshCw
                            className={`h-4 w-4 ${
                                isLoading
                                    ? "animate-spin"
                                    : ""
                            }`}
                        />
                        Refresh
                    </button>
                </div>

                {successMessage && (
                    <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        <CheckCircle2 className="h-5 w-5 shrink-0" />
                        <span>{successMessage}</span>
                    </div>
                )}

                {errorMessage && (
                    <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <span>{errorMessage}</span>
                    </div>
                )}

                <div className="grid min-h-[680px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[320px_1fr]">
                    <aside className="border-b border-slate-200 lg:border-b-0 lg:border-r">
                        <div className="border-b border-slate-200 p-4">
                            <div className="mb-3 flex items-center justify-between">
                                <div>
                                    <h2 className="font-semibold text-slate-900">
                                        Conversations
                                    </h2>

                                    <p className="text-xs text-slate-500">
                                        Project communication
                                    </p>
                                </div>

                                <div className="relative rounded-lg bg-indigo-50 p-2 text-indigo-600">
                                    <MessageSquare className="h-4 w-4" />

                                    {unreadCount > 0 && (
                                        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[9px] font-bold text-white">
                                            {unreadCount}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(event) =>
                                        setSearchTerm(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Search messages..."
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>
                        </div>

                        <div className="max-h-[570px] overflow-y-auto p-2">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
                                    <RefreshCw className="h-7 w-7 animate-spin text-indigo-500" />

                                    <p className="mt-3 text-sm font-medium text-slate-600">
                                        Loading messages...
                                    </p>
                                </div>
                            ) : conversationMessages.length === 0 ? (
                                <div className="px-4 py-10 text-center">
                                    <MessageSquare className="mx-auto h-8 w-8 text-slate-300" />

                                    <p className="mt-3 text-sm font-medium text-slate-600">
                                        No messages found
                                    </p>

                                    <p className="mt-1 text-xs text-slate-400">
                                        Your manager messages will
                                        appear here.
                                    </p>
                                </div>
                            ) : (
                                conversationMessages.map((item) => {
                                    const isSelected =
                                        String(item.id) ===
                                        String(selectedMessageId);

                                    return (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() =>
                                                handleSelectMessage(
                                                    item
                                                )
                                            }
                                            className={`mb-1 w-full rounded-xl p-3 text-left transition ${
                                                isSelected
                                                    ? "bg-indigo-50 ring-1 ring-indigo-100"
                                                    : "hover:bg-slate-50"
                                            }`}
                                        >
                                            <div className="flex gap-3">
                                                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                                                    {getInitials(
                                                        item.senderName
                                                    )}

                                                    {!item.isRead && (
                                                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-indigo-600" />
                                                    )}
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <p className="truncate text-sm font-semibold text-slate-900">
                                                            {
                                                                item.senderName
                                                            }
                                                        </p>

                                                        <span className="shrink-0 text-[11px] text-slate-400">
                                                            {formatLastMessageTime(
                                                                item.createdAt
                                                            )}
                                                        </span>
                                                    </div>

                                                    <p className="mt-0.5 text-xs text-indigo-600">
                                                        Project Manager
                                                    </p>

                                                    <p
                                                        className={`mt-1 truncate text-xs ${
                                                            item.isRead
                                                                ? "text-slate-500"
                                                                : "font-semibold text-slate-700"
                                                        }`}
                                                    >
                                                        {item.text}
                                                    </p>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </aside>

                    <section className="flex min-h-[680px] flex-col">
                        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 sm:px-6">
                            <div className="flex min-w-0 items-center gap-3">
                                <button
                                    type="button"
                                    className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
                                    onClick={() =>
                                        setSelectedMessageId(
                                            null
                                        )
                                    }
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </button>

                                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
                                    {getInitials(managerName)}

                                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                                </div>

                                <div className="min-w-0">
                                    <h2 className="truncate font-semibold text-slate-900">
                                        {managerName}
                                    </h2>

                                    <div className="flex items-center gap-2 text-xs">
                                        <span className="text-indigo-600">
                                            Project Manager
                                        </span>

                                        <span className="text-slate-300">
                                            •
                                        </span>

                                        <span className="text-emerald-600">
                                            Communication
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="hidden items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500 sm:flex">
                                <Clock3 className="h-4 w-4" />
                                Project communication
                            </div>
                        </div>

                        <div className="flex-1 space-y-5 overflow-y-auto bg-slate-50/60 p-4 sm:p-6">
                            <div className="mx-auto max-w-3xl text-center">
                                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium text-slate-500">
                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                    Secure project communication
                                </span>
                            </div>

                            {isLoading ? (
                                <div className="flex items-center justify-center py-20">
                                    <RefreshCw className="h-7 w-7 animate-spin text-indigo-500" />
                                </div>
                            ) : conversationMessages.length === 0 ? (
                                <div className="flex items-center justify-center py-20">
                                    <div className="max-w-sm text-center">
                                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                                            <MessageSquare className="h-8 w-8" />
                                        </div>

                                        <h2 className="mt-4 text-lg font-semibold text-slate-900">
                                            No messages yet
                                        </h2>

                                        <p className="mt-2 text-sm text-slate-500">
                                            Send a message to your project
                                            manager using the composer
                                            below.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                conversationMessages.map((item) => {
                                    const isMine =
                                        item.senderName ===
                                        "You";

                                    return (
                                        <div
                                            key={item.id}
                                            className={`flex ${
                                                isMine
                                                    ? "justify-end"
                                                    : "justify-start"
                                            }`}
                                        >
                                            <div
                                                className={`flex max-w-[85%] gap-2 sm:max-w-[70%] ${
                                                    isMine
                                                        ? "flex-row-reverse"
                                                        : ""
                                                }`}
                                            >
                                                <div
                                                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                                                        isMine
                                                            ? "bg-indigo-100 text-indigo-700"
                                                            : "bg-slate-200 text-slate-600"
                                                    }`}
                                                >
                                                    <UserRound className="h-4 w-4" />
                                                </div>

                                                <div>
                                                    <div
                                                        className={`rounded-2xl px-4 py-3 text-sm shadow-sm ${
                                                            isMine
                                                                ? "rounded-tr-md bg-indigo-600 text-white"
                                                                : "rounded-tl-md border border-slate-200 bg-white text-slate-700"
                                                        }`}
                                                    >
                                                        {item.text}
                                                    </div>

                                                    <div
                                                        className={`mt-1 flex items-center gap-1 text-[10px] text-slate-400 ${
                                                            isMine
                                                                ? "justify-end"
                                                                : ""
                                                        }`}
                                                    >
                                                        <Clock3 className="h-3 w-3" />

                                                        {formatMessageTime(
                                                            item.createdAt
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        <div className="border-t border-slate-200 bg-white p-4 sm:p-5">
                            <div className="mb-3 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-slate-800">
                                        Send a message
                                    </p>

                                    <p className="text-xs text-slate-400">
                                        Use this channel for team
                                        updates, blockers, and
                                        coordination.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                                    title="Attachments are not supported by the current message endpoint"
                                >
                                    <Paperclip className="h-4 w-4" />
                                </button>
                            </div>

                            <div className="flex items-end gap-3">
                                <textarea
                                    value={message}
                                    onChange={(event) =>
                                        setMessage(
                                            event.target.value
                                        )
                                    }
                                    onKeyDown={handleKeyDown}
                                    rows={3}
                                    disabled={isSending}
                                    placeholder="Write a message to your manager..."
                                    className="min-h-[88px] flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
                                />

                                <button
                                    type="button"
                                    disabled={isSending}
                                    onClick={handleSendMessage}
                                    className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isSending ? (
                                        <>
                                            <RefreshCw className="h-4 w-4 animate-spin" />
                                            Sending
                                        </>
                                    ) : (
                                        <>
                                            <Send className="h-4 w-4" />
                                            Send
                                        </>
                                    )}
                                </button>
                            </div>

                            <p className="mt-2 text-[11px] text-slate-400">
                                Press Enter to send • Shift + Enter
                                for a new line
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
