import { useMemo, useState } from "react";
import {
 
    
    Inbox,
    
    MailOpen,
    MessageSquare,
    Search,
    Star,
    Trash2,
    UserRound,
} from "lucide-react";

const INITIAL_MESSAGES = [
    {
        id: 1,
        sender: "Project Manager",
        email: "manager@aipms.com",
        subject: "Sprint 3 Progress Update",
        content:
            "Please review the current Sprint 3 progress and make sure all blocked team tasks are addressed before the sprint review.",
        project: "AI-Powered Management System",
        task: "Sprint 3",
        date: "Sep 1, 2026",
        time: "09:30 AM",
        read: false,
        starred: true,
    },
    {
        id: 2,
        sender: "Abebe Kebede",
        email: "abebe@aipms.com",
        subject: "Task Status Update",
        content:
            "The authentication task has been completed and is ready for team review.",
        project: "AI-Powered Management System",
        task: "Authentication Module",
        date: "Aug 31, 2026",
        time: "04:15 PM",
        read: true,
        starred: false,
    },
    {
        id: 3,
        sender: "Sara Mohammed",
        email: "sara@aipms.com",
        subject: "Blocked Task",
        content:
            "I am currently blocked because I need clarification about the API requirements.",
        project: "AI-Powered Management System",
        task: "API Integration",
        date: "Aug 31, 2026",
        time: "02:40 PM",
        read: false,
        starred: false,
    },
];

export default function ReceiveMessages() {
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    const filteredMessages = useMemo(() => {
        return messages.filter((message) => {
            const matchesSearch =
                message.sender.toLowerCase().includes(search.toLowerCase()) ||
                message.subject.toLowerCase().includes(search.toLowerCase()) ||
                message.content.toLowerCase().includes(search.toLowerCase());

            const matchesFilter =
                filter === "all" ||
                (filter === "unread" && !message.read) ||
                (filter === "read" && message.read) ||
                (filter === "starred" && message.starred);

            return matchesSearch && matchesFilter;
        });
    }, [messages, search, filter]);

    const unreadCount = messages.filter((message) => !message.read).length;

    const openMessage = (message) => {
        setSelectedMessage(message);

        setMessages((current) =>
            current.map((item) =>
                item.id === message.id
                    ? { ...item, read: true }
                    : item
            )
        );
    };

    const toggleStar = (id) => {
        setMessages((current) =>
            current.map((message) =>
                message.id === id
                    ? { ...message, starred: !message.starred }
                    : message
            )
        );
    };

    const deleteMessage = (id) => {
        setMessages((current) =>
            current.filter((message) => message.id !== id)
        );

        if (selectedMessage?.id === id) {
            setSelectedMessage(null);
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
                                Messages from managers and authorized project members.
                            </p>
                        </div>
                    </div>

                    <div className="relative w-full lg:w-72">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
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
                            onClick={() => setFilter(value)}
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

            <div className="grid min-h-[480px] lg:grid-cols-[360px_1fr]">
                <div className="border-b border-slate-200 lg:border-b-0 lg:border-r">
                    {filteredMessages.length === 0 ? (
                        <div className="flex h-full min-h-[300px] flex-col items-center justify-center p-6 text-center">
                            <MailOpen className="mb-3 h-10 w-10 text-slate-300" />
                            <h3 className="font-semibold text-slate-700">
                                No messages found
                            </h3>
                            <p className="mt-1 text-sm text-slate-500">
                                Try changing your search or filter.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {filteredMessages.map((message) => (
                                <button
                                    key={message.id}
                                    type="button"
                                    onClick={() => openMessage(message)}
                                    className={`w-full p-4 text-left transition hover:bg-slate-50 ${
                                        selectedMessage?.id === message.id
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
                                                    {message.sender}
                                                </span>

                                                <span className="shrink-0 text-xs text-slate-400">
                                                    {message.date}
                                                </span>
                                            </div>

                                            <p
                                                className={`mt-1 truncate text-sm ${
                                                    message.read
                                                        ? "text-slate-600"
                                                        : "font-semibold text-slate-900"
                                                }`}
                                            >
                                                {message.subject}
                                            </p>

                                            <p className="mt-1 truncate text-xs text-slate-400">
                                                {message.content}
                                            </p>

                                            <div className="mt-2 flex items-center justify-between">
                                                <span className="text-xs text-slate-400">
                                                    {message.time}
                                                </span>

                                                {message.starred && (
                                                    <Star className="h-3.5 w-3.5 fill-current text-amber-400" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))}
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
                                Select a message from the inbox to view its
                                details.
                            </p>
                        </div>
                    ) : (
                        <div className="h-full">
                            <div className="border-b border-slate-200 bg-white p-5">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900">
                                            {selectedMessage.subject}
                                        </h3>

                                        <div className="mt-3 flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                                                <UserRound className="h-5 w-5 text-blue-600" />
                                            </div>

                                            <div>
                                                <p className="text-sm font-semibold text-slate-800">
                                                    {selectedMessage.sender}
                                                </p>

                                                <p className="text-xs text-slate-400">
                                                    {selectedMessage.email}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-1">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                toggleStar(selectedMessage.id)
                                            }
                                            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-amber-500"
                                        >
                                            <Star
                                                className={`h-4 w-4 ${
                                                    selectedMessage.starred
                                                        ? "fill-current text-amber-400"
                                                        : ""
                                                }`}
                                            />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                deleteMessage(selectedMessage.id)
                                            }
                                            className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="mb-5 flex flex-wrap gap-2">
                                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                                        {selectedMessage.project}
                                    </span>

                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                                        {selectedMessage.task}
                                    </span>
                                </div>

                                <p className="text-sm leading-7 text-slate-700">
                                    {selectedMessage.content}
                                </p>

                                <div className="mt-8 border-t border-slate-200 pt-4 text-xs text-slate-400">
                                    Received {selectedMessage.date} at{" "}
                                    {selectedMessage.time}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}