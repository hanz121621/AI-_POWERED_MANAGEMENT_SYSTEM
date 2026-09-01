import { useMemo, useState } from "react";
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

const initialConversations = [
    {
        id: 1,
        name: "Manager",
        role: "Project Manager",
        department: "Software Development",
        status: "Online",
        lastMessage:
            "Please keep me updated about the Sprint 02 progress.",
        lastMessageTime: "10 min ago",
        unread: 2,
        messages: [
            {
                id: 1,
                sender: "manager",
                text: "How is the team progressing with Sprint 02?",
                time: "09:42 AM",
            },
            {
                id: 2,
                sender: "team-leader",
                text: "The team is progressing well. Two tasks are completed and three are currently in progress.",
                time: "09:47 AM",
            },
            {
                id: 3,
                sender: "manager",
                text: "Good. Please keep me updated about any blockers.",
                time: "09:51 AM",
            },
            {
                id: 4,
                sender: "team-leader",
                text: "Absolutely. I will report any blocker immediately.",
                time: "09:54 AM",
            },
            {
                id: 5,
                sender: "manager",
                text: "Please keep me updated about the Sprint 02 progress.",
                time: "10:02 AM",
            },
        ],
    },
];

function getInitials(name) {
    return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

export default function CommunicateWithManager() {
    const [conversations, setConversations] = useState(
        initialConversations
    );

    const [selectedConversationId, setSelectedConversationId] =
        useState(initialConversations[0]?.id ?? null);

    const [message, setMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const selectedConversation = useMemo(
        () =>
            conversations.find(
                (conversation) =>
                    conversation.id === selectedConversationId
            ),
        [conversations, selectedConversationId]
    );

    const filteredConversations = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();

        if (!term) {
            return conversations;
        }

        return conversations.filter(
            (conversation) =>
                conversation.name.toLowerCase().includes(term) ||
                conversation.role.toLowerCase().includes(term) ||
                conversation.lastMessage.toLowerCase().includes(term)
        );
    }, [conversations, searchTerm]);

    const clearMessages = () => {
        setSuccessMessage("");
        setErrorMessage("");
    };

    const handleSelectConversation = (conversationId) => {
        clearMessages();

        setSelectedConversationId(conversationId);

        setConversations((current) =>
            current.map((conversation) =>
                conversation.id === conversationId
                    ? {
                          ...conversation,
                          unread: 0,
                      }
                    : conversation
            )
        );
    };

    const handleSendMessage = async () => {
        clearMessages();

        const trimmedMessage = message.trim();

        if (!trimmedMessage) {
            setErrorMessage("Please enter a message before sending.");
            return;
        }

        if (!selectedConversation) {
            setErrorMessage("Please select a conversation first.");
            return;
        }

        setIsSending(true);

        try {
            /*
             * BACKEND INTEGRATION:
             *
             * Replace this local update with:
             *
             * await communicationService.sendMessage({
             *     receiverId: selectedConversation.userId,
             *     message: trimmedMessage
             * });
             *
             * The API can then return the created message.
             */

            const newMessage = {
                id: Date.now(),
                sender: "team-leader",
                text: trimmedMessage,
                time: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            };

            setConversations((current) =>
                current.map((conversation) =>
                    conversation.id === selectedConversation.id
                        ? {
                              ...conversation,
                              lastMessage: trimmedMessage,
                              lastMessageTime: "Just now",
                              messages: [
                                  ...conversation.messages,
                                  newMessage,
                              ],
                          }
                        : conversation
                )
            );

            setMessage("");
            setSuccessMessage("Message sent successfully.");
        } catch (error) {
            console.error("Failed to send message:", error);

            setErrorMessage(
                "Unable to send the message. Please try again."
            );
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    };

    const handleRefresh = async () => {
        clearMessages();

        /*
         * BACKEND INTEGRATION:
         *
         * Replace this with:
         *
         * const data =
         *     await communicationService.getManagerConversations();
         *
         * setConversations(data);
         */

        setSuccessMessage("Conversation list refreshed.");
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-6">
                {/* Header */}
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
                            Communicate directly with your project manager,
                            provide team updates, report blockers, and
                            coordinate project activities.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleRefresh}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Refresh
                    </button>
                </div>

                {/* Messages */}
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

                {/* Main Communication Card */}
                <div className="grid min-h-[680px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[320px_1fr]">
                    {/* Conversation Sidebar */}
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

                                <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                                    <MessageSquare className="h-4 w-4" />
                                </div>
                            </div>

                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(event) =>
                                        setSearchTerm(event.target.value)
                                    }
                                    placeholder="Search conversations..."
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>
                        </div>

                        <div className="max-h-[570px] overflow-y-auto p-2">
                            {filteredConversations.length === 0 ? (
                                <div className="px-4 py-10 text-center">
                                    <MessageSquare className="mx-auto h-8 w-8 text-slate-300" />

                                    <p className="mt-3 text-sm font-medium text-slate-600">
                                        No conversations found
                                    </p>

                                    <p className="mt-1 text-xs text-slate-400">
                                        Try another search term.
                                    </p>
                                </div>
                            ) : (
                                filteredConversations.map(
                                    (conversation) => {
                                        const isSelected =
                                            conversation.id ===
                                            selectedConversationId;

                                        return (
                                            <button
                                                key={conversation.id}
                                                type="button"
                                                onClick={() =>
                                                    handleSelectConversation(
                                                        conversation.id
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
                                                            conversation.name
                                                        )}

                                                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <p className="truncate text-sm font-semibold text-slate-900">
                                                                {
                                                                    conversation.name
                                                                }
                                                            </p>

                                                            <span className="shrink-0 text-[11px] text-slate-400">
                                                                {
                                                                    conversation.lastMessageTime
                                                                }
                                                            </span>
                                                        </div>

                                                        <p className="mt-0.5 text-xs text-indigo-600">
                                                            {
                                                                conversation.role
                                                            }
                                                        </p>

                                                        <div className="mt-1 flex items-center justify-between gap-2">
                                                            <p className="truncate text-xs text-slate-500">
                                                                {
                                                                    conversation.lastMessage
                                                                }
                                                            </p>

                                                            {conversation.unread >
                                                                0 && (
                                                                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1.5 text-[10px] font-bold text-white">
                                                                    {
                                                                        conversation.unread
                                                                    }
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    }
                                )
                            )}
                        </div>
                    </aside>

                    {/* Conversation */}
                    <section className="flex min-h-[680px] flex-col">
                        {selectedConversation ? (
                            <>
                                {/* Conversation Header */}
                                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 sm:px-6">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <button
                                            type="button"
                                            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
                                            onClick={() =>
                                                setSelectedConversationId(
                                                    null
                                                )
                                            }
                                        >
                                            <ArrowLeft className="h-5 w-5" />
                                        </button>

                                        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
                                            {getInitials(
                                                selectedConversation.name
                                            )}

                                            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                                        </div>

                                        <div className="min-w-0">
                                            <h2 className="truncate font-semibold text-slate-900">
                                                {
                                                    selectedConversation.name
                                                }
                                            </h2>

                                            <div className="flex items-center gap-2 text-xs">
                                                <span className="text-indigo-600">
                                                    {
                                                        selectedConversation.role
                                                    }
                                                </span>

                                                <span className="text-slate-300">
                                                    •
                                                </span>

                                                <span className="text-emerald-600">
                                                    Online
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="hidden items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500 sm:flex">
                                        <Clock3 className="h-4 w-4" />
                                        Project communication
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 space-y-5 overflow-y-auto bg-slate-50/60 p-4 sm:p-6">
                                    <div className="mx-auto max-w-3xl text-center">
                                        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium text-slate-500">
                                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                            Secure project communication
                                        </span>
                                    </div>

                                    {selectedConversation.messages.map(
                                        (item) => {
                                            const isMine =
                                                item.sender ===
                                                "team-leader";

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
                                                            {isMine ? (
                                                                <UserRound className="h-4 w-4" />
                                                            ) : (
                                                                <UserRound className="h-4 w-4" />
                                                            )}
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
                                                                {item.time}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>

                                {/* Message Composer */}
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
                                            title="Attach file"
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
                                            placeholder="Write a message to your manager..."
                                            className="min-h-[88px] flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
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
                            </>
                        ) : (
                            <div className="flex flex-1 items-center justify-center p-8">
                                <div className="max-w-sm text-center">
                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                                        <MessageSquare className="h-8 w-8" />
                                    </div>

                                    <h2 className="mt-4 text-lg font-semibold text-slate-900">
                                        Select a conversation
                                    </h2>

                                    <p className="mt-2 text-sm text-slate-500">
                                        Select a manager conversation from
                                        the left panel to start
                                        communicating.
                                    </p>
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}