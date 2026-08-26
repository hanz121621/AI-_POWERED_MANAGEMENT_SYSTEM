
import { useEffect, useMemo, useState } from "react";
import {
    MessageSquare,
    Send,
    Users,
    UserRound,
    Clock3,
    AlertCircle,
    CheckCircle2,
    Search,
    X,
} from "lucide-react";



const DEMO_PROJECT = {
    id: "PROJ-001",
    name: "AI-Powered Management System",
};

const DEMO_DISCUSSIONS = [
    {
        id: "DISC-001",
        title: "Sprint Planning Discussion",
        description: "Discuss current sprint work and priorities.",
        participants: [
            {
                id: "USR-001",
                name: "Project Manager",
                role: "Manager",
            },
            {
                id: "USR-002",
                name: "Team Leader",
                role: "Team Leader",
            },
            {
                id: "USR-003",
                name: "Hana",
                role: "Developer",
            },
        ],
        messages: [
            {
                id: "MSG-001",
                senderId: "USR-002",
                senderName: "Team Leader",
                senderRole: "Team Leader",
                message:
                    "Please review the tasks assigned for the current sprint.",
                createdAt: "2026-08-25T09:15:00",
            },
            {
                id: "MSG-002",
                senderId: "USR-003",
                senderName: "Hana",
                senderRole: "Developer",
                message:
                    "I have reviewed my development tasks. I will start with the authentication module.",
                createdAt: "2026-08-25T09:30:00",
            },
        ],
    },
    {
        id: "DISC-002",
        title: "Task Coordination",
        description: "Coordinate work related to assigned project tasks.",
        participants: [
            {
                id: "USR-001",
                name: "Project Manager",
                role: "Manager",
            },
            {
                id: "USR-002",
                name: "Team Leader",
                role: "Team Leader",
            },
            {
                id: "USR-003",
                name: "Hana",
                role: "Developer",
            },
        ],
        messages: [],
    },
    {
        id: "DISC-003",
        title: "Project Technical Discussion",
        description: "Discuss technical implementation and project issues.",
        participants: [
            {
                id: "USR-003",
                name: "Hana",
                role: "Developer",
            },
            {
                id: "USR-004",
                name: "Staff Member",
                role: "Staff",
            },
        ],
        messages: [
            {
                id: "MSG-003",
                senderId: "USR-004",
                senderName: "Staff Member",
                senderRole: "Staff",
                message:
                    "The project requirements document has been updated.",
                createdAt: "2026-08-25T10:00:00",
            },
        ],
    },
];

// ============================================================
// CURRENT CONTRIBUTOR
// In the real system this should come from AuthContext.
// ============================================================

const CURRENT_USER = {
    id: "USR-003",
    name: "Hana",
    role: "Developer",
};

// ============================================================
// HELPERS
// ============================================================

function formatMessageTime(dateValue) {
    if (!dateValue) {
        return "";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleString([], {
        dateStyle: "short",
        timeStyle: "short",
    });
}

// ============================================================
// COMPONENT
// ============================================================

export default function ParticipateProjectCommunication({
    project = DEMO_PROJECT,
}) {
    const [discussions, setDiscussions] = useState(DEMO_DISCUSSIONS);

    const [selectedDiscussionId, setSelectedDiscussionId] =
        useState(DEMO_DISCUSSIONS[0]?.id ?? null);

    const [message, setMessage] = useState("");

    const [searchTerm, setSearchTerm] = useState("");

    const [mentionSearch, setMentionSearch] = useState("");

    const [selectedMentions, setSelectedMentions] = useState([]);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const [isSending, setIsSending] = useState(false);

    // ========================================================
    // SELECTED DISCUSSION
    // ========================================================

    const selectedDiscussion = useMemo(() => {
        return discussions.find(
            (discussion) => discussion.id === selectedDiscussionId
        );
    }, [discussions, selectedDiscussionId]);

    // ========================================================
    // FILTER DISCUSSIONS
    // ========================================================

    const filteredDiscussions = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase();

        if (!normalizedSearch) {
            return discussions;
        }

        return discussions.filter((discussion) => {
            return (
                discussion.title.toLowerCase().includes(normalizedSearch) ||
                discussion.description
                    .toLowerCase()
                    .includes(normalizedSearch)
            );
        });
    }, [discussions, searchTerm]);

    // ========================================================
    // AUTHORIZED PROJECT MEMBERS
    //
    // Only members belonging to the selected project discussion
    // can be mentioned.
    // ========================================================

    const authorizedMembers = useMemo(() => {
        if (!selectedDiscussion) {
            return [];
        }

        return selectedDiscussion.participants.filter(
            (member) => member.id !== CURRENT_USER.id
        );
    }, [selectedDiscussion]);

    // ========================================================
    // FILTER MEMBERS FOR MENTION
    // ========================================================

    const filteredMembers = useMemo(() => {
        const normalizedSearch = mentionSearch.trim().toLowerCase();

        if (!normalizedSearch) {
            return authorizedMembers;
        }

        return authorizedMembers.filter((member) => {
            return (
                member.name.toLowerCase().includes(normalizedSearch) ||
                member.role.toLowerCase().includes(normalizedSearch)
            );
        });
    }, [authorizedMembers, mentionSearch]);

    // ========================================================
    // CLEAR MESSAGES
    // ========================================================

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                setSuccess("");
            }, 4000);

            return () => clearTimeout(timer);
        }

        return undefined;
    }, [success]);

    // ========================================================
    // SELECT DISCUSSION
    // ========================================================

    const handleSelectDiscussion = (discussionId) => {
        setSelectedDiscussionId(discussionId);
        setMessage("");
        setSelectedMentions([]);
        setMentionSearch("");
        setError("");
        setSuccess("");
    };

    // ========================================================
    // MENTION USER
    // ========================================================

    const handleToggleMention = (member) => {
        setError("");

        const alreadySelected = selectedMentions.some(
            (item) => item.id === member.id
        );

        if (alreadySelected) {
            setSelectedMentions((previous) =>
                previous.filter((item) => item.id !== member.id)
            );

            return;
        }

        setSelectedMentions((previous) => [...previous, member]);
    };

    // ========================================================
    // REMOVE MENTION
    // ========================================================

    const handleRemoveMention = (memberId) => {
        setSelectedMentions((previous) =>
            previous.filter((member) => member.id !== memberId)
        );
    };

    // ========================================================
    // VALIDATE MESSAGE
    // ========================================================

    const validateMessage = () => {
        if (!selectedDiscussion) {
            return "Project communication discussion not found.";
        }

        if (!message.trim()) {
            return "Message cannot be empty.";
        }

        // ----------------------------------------------------
        // Verify current user belongs to this discussion.
        // ----------------------------------------------------

        const isAuthorizedParticipant =
            selectedDiscussion.participants.some(
                (member) => member.id === CURRENT_USER.id
            );

        if (!isAuthorizedParticipant) {
            return "You do not have permission to communicate in this discussion.";
        }

        // ----------------------------------------------------
        // Verify all selected mentions belong to the discussion.
        // ----------------------------------------------------

        const unauthorizedMention = selectedMentions.some((mention) => {
            return !selectedDiscussion.participants.some(
                (participant) => participant.id === mention.id
            );
        });

        if (unauthorizedMention) {
            return "You cannot communicate with this user through this project.";
        }

        return "";
    };

    // ========================================================
    // SEND MESSAGE
    // ========================================================

    const handleSendMessage = async () => {
        setError("");
        setSuccess("");

        const validationError = validateMessage();

        if (validationError) {
            setError(validationError);
            return;
        }

        setIsSending(true);

        try {
            // ==================================================
            // BACKEND INTEGRATION POINT
            //
            // Later this section will call something like:
            //
            // await projectCommunicationService.sendMessage(...)
            //
            // The backend should:
            // 1. Validate project membership.
            // 2. Validate recipient/mentions.
            // 3. Save the message.
            // 4. Create notifications.
            // 5. Record activity.
            // ==================================================

            await new Promise((resolve) => setTimeout(resolve, 500));

            const newMessage = {
                id: `MSG-${Date.now()}`,
                senderId: CURRENT_USER.id,
                senderName: CURRENT_USER.name,
                senderRole: CURRENT_USER.role,
                message: message.trim(),
                mentions: selectedMentions.map((member) => ({
                    id: member.id,
                    name: member.name,
                })),
                createdAt: new Date().toISOString(),
            };

            setDiscussions((previous) =>
                previous.map((discussion) => {
                    if (discussion.id !== selectedDiscussion.id) {
                        return discussion;
                    }

                    return {
                        ...discussion,
                        messages: [
                            ...discussion.messages,
                            newMessage,
                        ],
                    };
                })
            );

            // ==================================================
            // USE CASE STEPS COMPLETED
            //
            // 6. Validate message
            // 7. Store message
            // 8. Notify relevant users
            // 9. Record activity
            // ==================================================

            setMessage("");
            setSelectedMentions([]);
            setMentionSearch("");

            setSuccess("Message sent successfully.");
        } catch {
            setError("Unable to send message. Please try again.");
        } finally {
            setIsSending(false);
        }
    };

    // ========================================================
    // ENTER KEY
    // ========================================================

    const handleMessageKeyDown = (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-6">
            <div className="mx-auto max-w-7xl">
                {/* ==================================================
                    PAGE HEADER
                ================================================== */}

                <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <div className="mb-2 flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                                    <MessageSquare size={23} />
                                </div>

                                <div>
                                    <h1 className="text-2xl font-bold text-slate-900">
                                        Project Communication
                                    </h1>

                                    <p className="text-sm text-slate-500">
                                        Communicate with authorized project
                                        members.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                                <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
                                    {project.name}
                                </span>

                                <span className="rounded-full bg-blue-50 px-3 py-1 font-medium text-blue-700">
                                    {CURRENT_USER.role}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ==================================================
                    SUCCESS MESSAGE
                ================================================== */}

                {success && (
                    <div className="mb-4 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                        <CheckCircle2 size={19} />

                        <span>{success}</span>
                    </div>
                )}

                {/* ==================================================
                    ERROR MESSAGE
                ================================================== */}

                {error && (
                    <div className="mb-4 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        <AlertCircle size={19} />

                        <span>{error}</span>

                        <button
                            type="button"
                            onClick={() => setError("")}
                            className="ml-auto rounded-md p-1 hover:bg-red-100"
                            aria-label="Close error"
                        >
                            <X size={17} />
                        </button>
                    </div>
                )}

                {/* ==================================================
                    COMMUNICATION LAYOUT
                ================================================== */}

                <div className="grid min-h-[650px] grid-cols-1 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[320px_1fr]">
                    {/* ==================================================
                        DISCUSSION LIST
                    ================================================== */}

                    <aside className="border-b border-slate-200 bg-slate-50 lg:border-b-0 lg:border-r">
                        <div className="border-b border-slate-200 p-4">
                            <div className="mb-3 flex items-center gap-2">
                                <MessageSquare
                                    size={18}
                                    className="text-blue-600"
                                />

                                <h2 className="font-semibold text-slate-900">
                                    Discussions
                                </h2>
                            </div>

                            <div className="relative">
                                <Search
                                    size={17}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(event) =>
                                        setSearchTerm(event.target.value)
                                    }
                                    placeholder="Search discussions..."
                                    className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>
                        </div>

                        <div className="max-h-[560px] overflow-y-auto p-2">
                            {filteredDiscussions.length === 0 ? (
                                <div className="p-6 text-center text-sm text-slate-500">
                                    No discussions found.
                                </div>
                            ) : (
                                filteredDiscussions.map((discussion) => {
                                    const isSelected =
                                        discussion.id ===
                                        selectedDiscussionId;

                                    return (
                                        <button
                                            key={discussion.id}
                                            type="button"
                                            onClick={() =>
                                                handleSelectDiscussion(
                                                    discussion.id
                                                )
                                            }
                                            className={`mb-2 w-full rounded-xl p-4 text-left transition ${
                                                isSelected
                                                    ? "bg-blue-600 text-white shadow-sm"
                                                    : "bg-white text-slate-800 hover:bg-slate-100"
                                            }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div
                                                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                                                        isSelected
                                                            ? "bg-white/20"
                                                            : "bg-blue-50 text-blue-600"
                                                    }`}
                                                >
                                                    <MessageSquare
                                                        size={18}
                                                    />
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="truncate font-semibold">
                                                        {discussion.title}
                                                    </p>

                                                    <p
                                                        className={`mt-1 line-clamp-2 text-xs ${
                                                            isSelected
                                                                ? "text-blue-100"
                                                                : "text-slate-500"
                                                        }`}
                                                    >
                                                        {
                                                            discussion.description
                                                        }
                                                    </p>

                                                    <div
                                                        className={`mt-2 text-xs ${
                                                            isSelected
                                                                ? "text-blue-100"
                                                                : "text-slate-400"
                                                        }`}
                                                    >
                                                        {
                                                            discussion.messages
                                                                .length
                                                        }{" "}
                                                        message
                                                        {discussion.messages
                                                            .length === 1
                                                            ? ""
                                                            : "s"}
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </aside>

                    {/* ==================================================
                        MAIN COMMUNICATION AREA
                    ================================================== */}

                    <main className="flex min-w-0 flex-col">
                        {!selectedDiscussion ? (
                            <div className="flex flex-1 items-center justify-center p-8 text-center">
                                <div>
                                    <MessageSquare
                                        size={45}
                                        className="mx-auto mb-4 text-slate-300"
                                    />

                                    <h2 className="text-lg font-semibold text-slate-800">
                                        Select a discussion
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Choose an authorized project discussion
                                        to continue.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* ==================================================
                                    DISCUSSION HEADER
                                ================================================== */}

                                <div className="border-b border-slate-200 p-5">
                                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                        <div>
                                            <h2 className="text-lg font-bold text-slate-900">
                                                {selectedDiscussion.title}
                                            </h2>

                                            <p className="mt-1 text-sm text-slate-500">
                                                {
                                                    selectedDiscussion.description
                                                }
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-slate-500">
                                            <Users size={17} />

                                            <span>
                                                {
                                                    selectedDiscussion
                                                        .participants.length
                                                }{" "}
                                                authorized members
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* ==================================================
                                    MESSAGE HISTORY
                                ================================================== */}

                                <div className="flex-1 space-y-4 overflow-y-auto p-5">
                                    {selectedDiscussion.messages.length ===
                                    0 ? (
                                        <div className="flex min-h-[300px] items-center justify-center text-center">
                                            <div>
                                                <MessageSquare
                                                    size={42}
                                                    className="mx-auto mb-3 text-slate-300"
                                                />

                                                <h3 className="font-semibold text-slate-700">
                                                    No messages yet
                                                </h3>

                                                <p className="mt-1 text-sm text-slate-500">
                                                    Start the project discussion
                                                    by sending a message.
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        selectedDiscussion.messages.map(
                                            (item) => {
                                                const isCurrentUser =
                                                    item.senderId ===
                                                    CURRENT_USER.id;

                                                return (
                                                    <div
                                                        key={item.id}
                                                        className={`flex ${
                                                            isCurrentUser
                                                                ? "justify-end"
                                                                : "justify-start"
                                                        }`}
                                                    >
                                                        <div
                                                            className={`max-w-[85%] rounded-2xl px-4 py-3 md:max-w-[70%] ${
                                                                isCurrentUser
                                                                    ? "rounded-br-md bg-blue-600 text-white"
                                                                    : "rounded-bl-md bg-slate-100 text-slate-800"
                                                            }`}
                                                        >
                                                            <div className="mb-2 flex flex-wrap items-center gap-2">
                                                                <span className="font-semibold">
                                                                    {
                                                                        item.senderName
                                                                    }
                                                                </span>

                                                                <span
                                                                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                                                        isCurrentUser
                                                                            ? "bg-white/20 text-white"
                                                                            : "bg-white text-slate-600"
                                                                    }`}
                                                                >
                                                                    {
                                                                        item.senderRole
                                                                    }
                                                                </span>
                                                            </div>

                                                            <p className="whitespace-pre-wrap text-sm leading-6">
                                                                {item.message}
                                                            </p>

                                                            <div
                                                                className={`mt-2 flex items-center gap-1 text-[11px] ${
                                                                    isCurrentUser
                                                                        ? "text-blue-100"
                                                                        : "text-slate-400"
                                                                }`}
                                                            >
                                                                <Clock3
                                                                    size={12}
                                                                />

                                                                {formatMessageTime(
                                                                    item.createdAt
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        )
                                    )}
                                </div>

                                {/* ==================================================
                                    MENTION AREA
                                ================================================== */}

                                <div className="border-t border-slate-200 bg-slate-50 p-4">
                                    <div className="mb-3">
                                        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                                            <UserRound size={16} />

                                            <span>
                                                Mention project members
                                            </span>
                                        </div>

                                        <div className="relative">
                                            <Search
                                                size={16}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                            />

                                            <input
                                                type="text"
                                                value={mentionSearch}
                                                onChange={(event) =>
                                                    setMentionSearch(
                                                        event.target.value
                                                    )
                                                }
                                                placeholder="Search authorized members..."
                                                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                            />
                                        </div>

                                        {mentionSearch && (
                                            <div className="mt-2 max-h-36 overflow-y-auto rounded-lg border border-slate-200 bg-white">
                                                {filteredMembers.length ===
                                                0 ? (
                                                    <div className="p-3 text-sm text-slate-500">
                                                        No authorized members
                                                        found.
                                                    </div>
                                                ) : (
                                                    filteredMembers.map(
                                                        (member) => {
                                                            const selected =
                                                                selectedMentions.some(
                                                                    (
                                                                        item
                                                                    ) =>
                                                                        item.id ===
                                                                        member.id
                                                                );

                                                            return (
                                                                <button
                                                                    key={
                                                                        member.id
                                                                    }
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleToggleMention(
                                                                            member
                                                                        )
                                                                    }
                                                                    className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-slate-50 ${
                                                                        selected
                                                                            ? "bg-blue-50"
                                                                            : ""
                                                                    }`}
                                                                >
                                                                    <div>
                                                                        <p className="font-medium text-slate-800">
                                                                            {
                                                                                member.name
                                                                            }
                                                                        </p>

                                                                        <p className="text-xs text-slate-500">
                                                                            {
                                                                                member.role
                                                                            }
                                                                        </p>
                                                                    </div>

                                                                    {selected && (
                                                                        <CheckCircle2
                                                                            size={
                                                                                17
                                                                            }
                                                                            className="text-blue-600"
                                                                        />
                                                                    )}
                                                                </button>
                                                            );
                                                        }
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Selected mentions */}

                                    {selectedMentions.length > 0 && (
                                        <div className="mb-3 flex flex-wrap gap-2">
                                            {selectedMentions.map((member) => (
                                                <span
                                                    key={member.id}
                                                    className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700"
                                                >
                                                    @{member.name}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleRemoveMention(
                                                                member.id
                                                            )
                                                        }
                                                        className="rounded-full hover:bg-blue-200"
                                                        aria-label={`Remove ${member.name}`}
                                                    >
                                                        <X size={13} />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* ==================================================
                                        MESSAGE INPUT
                                    ================================================== */}

                                    <div className="flex flex-col gap-3 md:flex-row md:items-end">
                                        <textarea
                                            value={message}
                                            onChange={(event) =>
                                                setMessage(event.target.value)
                                            }
                                            onKeyDown={handleMessageKeyDown}
                                            placeholder="Write a project message..."
                                            rows={3}
                                            className="min-h-[90px] flex-1 resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />

                                        <button
                                            type="button"
                                            onClick={handleSendMessage}
                                            disabled={
                                                isSending || !message.trim()
                                            }
                                            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <Send size={17} />

                                            {isSending
                                                ? "Sending..."
                                                : "Send Message"}
                                        </button>
                                    </div>

                                    <p className="mt-2 text-xs text-slate-400">
                                        Press Enter to send. Use Shift + Enter
                                        for a new line.
                                    </p>
                                </div>
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
