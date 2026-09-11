
import { useEffect, useMemo, useState } from "react";

import {
    AlertCircle,
    Inbox,
    Loader2,
    MailOpen,
    MessageSquare,
    Search,
    Star,
    UserRound,
} from "lucide-react";

import api from "@/services/api";

function unwrapMessages(response) {
    const data = response?.data;

    if (Array.isArray(data)) {
        return data;
    }

    if (Array.isArray(data?.data)) {
        return data.data;
    }

    if (Array.isArray(data?.messages)) {
        return data.messages;
    }

    if (Array.isArray(data?.items)) {
        return data.items;
    }

    return [];
}

function normalizeMessage(message, index) {
    const id =
        message?.id ??
        message?.messageId ??
        message?.Id ??
        message?.MessageId ??
        `message-${index}`;

    const sender =
        message?.senderName ??
        message?.senderFullName ??
        message?.sender?.fullName ??
        message?.sender?.name ??
        message?.fromName ??
        message?.SenderName ??
        message?.SenderFullName ??
        message?.sender ??
        message?.Sender ??
        "Unknown Sender";

    const email =
        message?.senderEmail ??
        message?.sender?.email ??
        message?.fromEmail ??
        message?.SenderEmail ??
        message?.email ??
        message?.Email ??
        "";

    const subject =
        message?.subject ??
        message?.Subject ??
        "No subject";

    const content =
        message?.content ??
        message?.message ??
        message?.body ??
        message?.Content ??
        message?.Message ??
        message?.Body ??
        "";

    const project =
        message?.projectName ??
        message?.project?.name ??
        message?.ProjectName ??
        message?.Project?.Name ??
        "Project";

    const task =
        message?.taskTitle ??
        message?.task?.title ??
        message?.TaskTitle ??
        message?.Task?.Title ??
        "General";

    const rawDate =
        message?.createdAt ??
        message?.sentAt ??
        message?.date ??
        message?.CreatedAt ??
        message?.SentAt ??
        message?.Date;

    const parsedDate = rawDate
        ? new Date(rawDate)
        : null;

    const validDate =
        parsedDate &&
        !Number.isNaN(parsedDate.getTime());

    return {
        ...message,
        id,
        sender,
        email,
        subject,
        content,
        project,
        task,
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
        read:
            message?.isRead ??
            message?.read ??
            message?.IsRead ??
            message?.Read ??
            false,
        starred:
            message?.isStarred ??
            message?.starred ??
            message?.IsStarred ??
            message?.Starred ??
            false,
        rawCreatedAt: rawDate,
    };
}

export default function ReceiveMessages() {
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] =
        useState(null);

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    const [isLoading, setIsLoading] = useState(true);
    const [isOpening, setIsOpening] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");

    const loadMessages = async () => {
        setIsLoading(true);
        setErrorMessage("");

        try {
            const response = await api.get(
                "/communication/messages/inbox"
            );

            const rawMessages =
                unwrapMessages(response);

            const normalizedMessages =
                rawMessages.map(normalizeMessage);

            setMessages(normalizedMessages);

            if (selectedMessage) {
                const updatedSelected =
                    normalizedMessages.find(
                        (message) =>
                            String(message.id) ===
                            String(selectedMessage.id)
                    );

                if (updatedSelected) {
                    setSelectedMessage(
                        updatedSelected
                    );
                }
            }
        } catch (error) {
            console.error(
                "Failed to load messages:",
                error
            );

            setErrorMessage(
                error?.response?.data?.message ??
                    error?.response?.data?.Message ??
                    "Unable to load messages."
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadMessages();
    }, []);

    const filteredMessages = useMemo(() => {
        const query = search.trim().toLowerCase();

        return messages.filter((message) => {
            const matchesSearch =
                !query ||
                String(message.sender)
                    .toLowerCase()
                    .includes(query) ||
                String(message.subject)
                    .toLowerCase()
                    .includes(query) ||
                String(message.content)
                    .toLowerCase()
                    .includes(query);

            const matchesFilter =
                filter === "all" ||
                (filter === "unread" &&
                    !message.read) ||
                (filter === "read" &&
                    message.read) ||
                (filter === "starred" &&
                    message.starred);

            return matchesSearch && matchesFilter;
        });
    }, [messages, search, filter]);

    const unreadCount = useMemo(
        () =>
            messages.filter(
                (message) => !message.read
            ).length,
        [messages]
    );

    const openMessage = async (message) => {
        setSelectedMessage(message);

        if (message.read) {
            return;
        }

        setIsOpening(true);

        try {
            await api.patch(
                `/communication/messages/inbox/${message.id}/read`
            );

            setMessages((current) =>
                current.map((item) =>
                    String(item.id) ===
                    String(message.id)
                        ? {
                              ...item,
                              read: true,
                          }
                        : item
                )
            );

            setSelectedMessage((current) =>
                current
                    ? {
                          ...current,
                          read: true,
                      }
                    : current
            );
        } catch (error) {
            console.error(
                "Failed to mark message as read:",
                error
            );
        } finally {
            setIsOpening(false);
        }
    };

    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-blue-100 p-3">
                            <Inbox className="h-5 w-5 text-blue-600" />
                        </div>

                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-bold text-slate-900">
                                    Message Inbox
                                </h2>

                                {unreadCount > 0 && (
                                    <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                                        {unreadCount} unread
                                    </span>
                                )}
                            </div>

                            <p className="text-sm text-slate-500">
                                Messages from managers and
                                authorized project members.
                            </p>
                        </div>
                    </div>

                    <div className="relative w-full lg:w-72">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Search messages..."
                            className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                    {[
                        ["all", "All"],
                        ["unread", "Unread"],
                        ["read", "Read"],
                        ["starred", "Starred"],
                    ].map(([value, label]) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() =>
                                setFilter(value)
                            }
                            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                                filter === value
                                    ? "bg-blue-600 text-white"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {errorMessage && (
                <div className="border-b border-red-100 bg-red-50 px-5 py-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-red-700">
                        <AlertCircle className="h-4 w-4" />
                        {errorMessage}
                    </div>

                    <button
                        type="button"
                        onClick={loadMessages}
                        className="mt-2 text-xs font-semibold text-red-700 underline"
                    >
                        Try again
                    </button>
                </div>
            )}

            <div className="grid min-h-[480px] lg:grid-cols-[360px_1fr]">
                <div className="border-b border-slate-200 lg:border-b-0 lg:border-r">
                    {isLoading ? (
                        <div className="flex min-h-[300px] flex-col items-center justify-center p-6 text-center">
                            <Loader2 className="mb-3 h-8 w-8 animate-spin text-blue-500" />

                            <h3 className="font-semibold text-slate-700">
                                Loading messages
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                Fetching your inbox...
                            </p>
                        </div>
                    ) : filteredMessages.length === 0 ? (
                        <div className="flex h-full min-h-[300px] flex-col items-center justify-center p-6 text-center">
                            <MailOpen className="mb-3 h-10 w-10 text-slate-300" />

                            <h3 className="font-semibold text-slate-700">
                                No messages found
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                Try changing your search or
                                filter.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {filteredMessages.map(
                                (message) => (
                                    <button
                                        key={message.id}
                                        type="button"
                                        onClick={() =>
                                            openMessage(
                                                message
                                            )
                                        }
                                        className={`w-full p-4 text-left transition hover:bg-slate-50 ${
                                            selectedMessage?.id ===
                                            message.id
                                                ? "bg-blue-50"
                                                : ""
                                        }`}
                                    >
                                        <div className="flex gap-3">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100">
                                                <UserRound className="h-4 w-4 text-slate-500" />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center justify-between gap-2">
                                                    <span
                                                        className={`truncate text-sm ${
                                                            message.read
                                                                ? "font-medium text-slate-700"
                                                                : "font-bold text-slate-900"
                                                        }`}
                                                    >
                                                        {
                                                            message.sender
                                                        }
                                                    </span>

                                                    <span className="shrink-0 text-xs text-slate-400">
                                                        {
                                                            message.date
                                                        }
                                                    </span>
                                                </div>

                                                <p
                                                    className={`mt-1 truncate text-sm ${
                                                        message.read
                                                            ? "text-slate-600"
                                                            : "font-semibold text-slate-900"
                                                    }`}
                                                >
                                                    {
                                                        message.subject
                                                    }
                                                </p>

                                                <p className="mt-1 truncate text-xs text-slate-400">
                                                    {
                                                        message.content
                                                    }
                                                </p>

                                                <div className="mt-2 flex items-center justify-between">
                                                    <span className="text-xs text-slate-400">
                                                        {
                                                            message.time
                                                        }
                                                    </span>

                                                    {message.starred && (
                                                        <Star className="h-3.5 w-3.5 fill-current text-amber-400" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                )
                            )}
                        </div>
                    )}
                </div>

                <div className="bg-slate-50/60">
                    {!selectedMessage ? (
                        <div className="flex h-full min-h-[400px] flex-col items-center justify-center p-8 text-center">
                            <div className="rounded-full bg-blue-100 p-4">
                                <MessageSquare className="h-8 w-8 text-blue-600" />
                            </div>

                            <h3 className="mt-4 font-semibold text-slate-800">
                                Select a message
                            </h3>

                            <p className="mt-1 max-w-sm text-sm text-slate-500">
                                Select a message from the
                                inbox to view its details.
                            </p>
                        </div>
                    ) : (
                        <div className="h-full">
                            <div className="border-b border-slate-200 bg-white p-5">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900">
                                            {
                                                selectedMessage.subject
                                            }
                                        </h3>

                                        <div className="mt-3 flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                                                <UserRound className="h-5 w-5 text-blue-600" />
                                            </div>

                                            <div>
                                                <p className="text-sm font-semibold text-slate-800">
                                                    {
                                                        selectedMessage.sender
                                                    }
                                                </p>

                                                <p className="text-xs text-slate-400">
                                                    {
                                                        selectedMessage.email ||
                                                        "No email provided"
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {isOpening && (
                                            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                                        )}

                                        {selectedMessage.starred && (
                                            <Star className="h-4 w-4 fill-current text-amber-400" />
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="mb-5 flex flex-wrap gap-2">
                                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                                        {
                                            selectedMessage.project
                                        }
                                    </span>

                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                                        {
                                            selectedMessage.task
                                        }
                                    </span>
                                </div>

                                <p className="text-sm leading-7 text-slate-700">
                                    {
                                        selectedMessage.content
                                    }
                                </p>

                                <div className="mt-8 border-t border-slate-200 pt-4 text-xs text-slate-400">
                                    Received{" "}
                                    {
                                        selectedMessage.date
                                    }{" "}
                                    at{" "}
                                    {
                                        selectedMessage.time
                                    }
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
