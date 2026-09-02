import { useMemo, useState } from "react";
import {
    AtSign,
    Search,
    Send,
    RefreshCw,
    UserRound,
    Mail,
    CalendarDays,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";

// ============================================================
// STORAGE KEYS
// ============================================================

const USERS_KEY = "users";
const OLD_USERS_KEY = "aipms_users";

const MENTIONS_KEY = "aipms_staff_mentions";

// ============================================================
// HELPERS
// ============================================================

function getStoredUsers() {
    try {
        const stored =
            localStorage.getItem(USERS_KEY) ||
            localStorage.getItem(OLD_USERS_KEY);

        if (!stored) {
            return [];
        }

        const parsed = JSON.parse(stored);

        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function getCurrentUser() {
    try {
        const user =
            localStorage.getItem("user") ||
            localStorage.getItem("aipms_user");

        return user ? JSON.parse(user) : null;
    } catch {
        return null;
    }
}

function getStoredMentions() {
    try {
        const stored =
            localStorage.getItem(MENTIONS_KEY);

        if (!stored) {
            return [];
        }

        const parsed = JSON.parse(stored);

        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function getUserId(user) {
    return (
        user?.id ??
        user?.userId ??
        user?.UserId ??
        user?.Id ??
        ""
    );
}

function getUserName(user) {
    return (
        user?.fullName ||
        user?.name ||
        user?.username ||
        user?.userName ||
        "Unknown User"
    );
}

function getUserEmail(user) {
    return user?.email || user?.Email || "";
}

function getUserRole(user) {
    return (
        user?.role ||
        user?.Role ||
        user?.userRole ||
        "Staff"
    );
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
// MAIN COMPONENT
// ============================================================

function MentionTeamMembers() {
    const [users, setUsers] = useState(getStoredUsers);
    const [mentions, setMentions] = useState(
        getStoredMentions
    );

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUserId, setSelectedUserId] =
        useState("");

    const [messageText, setMessageText] =
        useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const currentUser = getCurrentUser();

    // ========================================================
    // FILTER USERS
    // ========================================================

    const filteredUsers = useMemo(() => {
        const currentUserId = String(
            getUserId(currentUser)
        );

        const search = searchTerm
            .trim()
            .toLowerCase();

        return users.filter((user) => {
            const userId = String(getUserId(user));

            // Do not show the currently logged-in user.
            if (
                currentUserId &&
                userId &&
                currentUserId === userId
            ) {
                return false;
            }

            if (!search) {
                return true;
            }

            const name = getUserName(user).toLowerCase();
            const email = getUserEmail(user).toLowerCase();
            const role = getUserRole(user).toLowerCase();

            return (
                name.includes(search) ||
                email.includes(search) ||
                role.includes(search)
            );
        });
    }, [users, searchTerm, currentUser]);

    // ========================================================
    // SELECTED USER
    // ========================================================

    const selectedUser = useMemo(() => {
        return users.find(
            (user) =>
                String(getUserId(user)) ===
                String(selectedUserId)
        );
    }, [users, selectedUserId]);

    // ========================================================
    // REFRESH
    // ========================================================

    const handleRefresh = () => {
        setUsers(getStoredUsers());
        setMentions(getStoredMentions());

        setMessage("Team members refreshed.");
        setError("");

        setTimeout(() => {
            setMessage("");
        }, 2500);
    };

    // ========================================================
    // SEND MENTION
    // ========================================================

    const handleSendMention = () => {
        setMessage("");
        setError("");

        if (!selectedUserId) {
            setError("Please select a team member.");
            return;
        }

        if (!messageText.trim()) {
            setError("Please enter a message.");
            return;
        }

        if (!selectedUser) {
            setError("Selected team member was not found.");
            return;
        }

        const newMention = {
            id: `mention-${Date.now()}`,

            senderId:
                getUserId(currentUser) || null,

            sender:
                getUserName(currentUser),

            recipientId:
                getUserId(selectedUser),

            recipient:
                getUserName(selectedUser),

            message: messageText.trim(),

            createdAt: new Date().toISOString(),

            read: false,
        };

        const updatedMentions = [
            newMention,
            ...mentions,
        ];

        setMentions(updatedMentions);

        localStorage.setItem(
            MENTIONS_KEY,
            JSON.stringify(updatedMentions)
        );

        setMessageText("");
        setMessage("Message sent successfully.");

        setTimeout(() => {
            setMessage("");
        }, 2500);
    };

    // ========================================================
    // UI
    // ========================================================

    return (
        <div className="space-y-6 text-white">
            {/* HEADER */}

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-purple-500/10 p-3">
                        <AtSign
                            size={24}
                            className="text-purple-400"
                        />
                    </div>

                    <div>
                        <h2 className="text-xl font-bold">
                            Mention Team Members
                        </h2>

                        <p className="text-sm text-slate-400">
                            Mention and send messages to other
                            team members.
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

            {/* SUCCESS */}

            {message && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                    <CheckCircle2 size={18} />
                    {message}
                </div>
            )}

            {/* ERROR */}

            {error && (
                <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}

            {/* CONTENT */}

            <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
                {/* TEAM MEMBERS */}

                <div className="rounded-2xl border border-slate-700 bg-slate-900/80">
                    <div className="border-b border-slate-700 p-4">
                        <h3 className="mb-3 font-semibold">
                            Team Members
                        </h3>

                        <div className="relative">
                            <Search
                                size={17}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                            />

                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(event) =>
                                    setSearchTerm(
                                        event.target.value
                                    )
                                }
                                placeholder="Search members..."
                                className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2.5 pl-10 pr-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-purple-500"
                            />
                        </div>
                    </div>

                    <div className="max-h-[520px] overflow-y-auto p-3">
                        {filteredUsers.length === 0 ? (
                            <div className="py-10 text-center">
                                <UserRound
                                    size={32}
                                    className="mx-auto mb-3 text-slate-600"
                                />

                                <p className="text-sm text-slate-400">
                                    No team members found.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {filteredUsers.map((user) => {
                                    const userId =
                                        getUserId(user);

                                    const isSelected =
                                        String(userId) ===
                                        String(selectedUserId);

                                    return (
                                        <button
                                            key={String(userId)}
                                            type="button"
                                            onClick={() =>
                                                setSelectedUserId(
                                                    String(userId)
                                                )
                                            }
                                            className={`w-full rounded-xl border p-4 text-left transition ${
                                                isSelected
                                                    ? "border-purple-500 bg-purple-500/10"
                                                    : "border-slate-700 bg-slate-800/70 hover:border-slate-600"
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-500/10">
                                                    <UserRound
                                                        size={18}
                                                        className="text-purple-400"
                                                    />
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-semibold">
                                                        {getUserName(
                                                            user
                                                        )}
                                                    </p>

                                                    <p className="mt-1 truncate text-xs text-slate-400">
                                                        {getUserEmail(
                                                            user
                                                        ) ||
                                                            "No email"}
                                                    </p>

                                                    <span className="mt-1 inline-block text-xs text-purple-400">
                                                        {getUserRole(
                                                            user
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* MESSAGE AREA */}

                <div className="space-y-6">
                    <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-6">
                        {!selectedUser ? (
                            <div className="flex min-h-[400px] items-center justify-center text-center">
                                <div>
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/10">
                                        <AtSign
                                            size={30}
                                            className="text-purple-400"
                                        />
                                    </div>

                                    <h3 className="text-lg font-semibold">
                                        Select a team member
                                    </h3>

                                    <p className="mt-2 max-w-md text-sm text-slate-400">
                                        Select a team member from
                                        the list to send a message
                                        or mention them.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* RECIPIENT */}

                                <div className="mb-6 flex items-center gap-4 rounded-xl border border-slate-700 bg-slate-800/70 p-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10">
                                        <UserRound
                                            size={22}
                                            className="text-purple-400"
                                        />
                                    </div>

                                    <div>
                                        <p className="text-xs uppercase tracking-wider text-slate-500">
                                            Sending to
                                        </p>

                                        <h3 className="font-semibold">
                                            {getUserName(
                                                selectedUser
                                            )}
                                        </h3>

                                        <div className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                                            <Mail size={13} />
                                            {getUserEmail(
                                                selectedUser
                                            ) ||
                                                "No email available"}
                                        </div>
                                    </div>
                                </div>

                                {/* MESSAGE */}

                                <label className="mb-2 block text-sm font-medium text-slate-300">
                                    Message
                                </label>

                                <textarea
                                    value={messageText}
                                    onChange={(event) =>
                                        setMessageText(
                                            event.target.value
                                        )
                                    }
                                    placeholder={`Write a message to ${getUserName(
                                        selectedUser
                                    )}...`}
                                    rows={7}
                                    className="w-full resize-none rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-purple-500"
                                />

                                <div className="mt-4 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={handleSendMention}
                                        className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-500"
                                    >
                                        <Send size={16} />
                                        Send Message
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    {/* RECENT MENTIONS */}

                    <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-5">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold">
                                    Recent Mentions
                                </h3>

                                <p className="text-xs text-slate-500">
                                    Recent messages sent through
                                    team communication.
                                </p>
                            </div>

                            <AtSign
                                size={20}
                                className="text-purple-400"
                            />
                        </div>

                        {mentions.length === 0 ? (
                            <div className="py-8 text-center">
                                <p className="text-sm text-slate-500">
                                    No recent mentions.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {mentions
                                    .slice(0, 5)
                                    .map((mention) => (
                                        <div
                                            key={mention.id}
                                            className="rounded-xl border border-slate-700 bg-slate-800/60 p-4"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <p className="text-sm">
                                                        <span className="font-semibold text-purple-400">
                                                            {
                                                                mention.sender
                                                            }
                                                        </span>

                                                        <span className="text-slate-500">
                                                            {" "}
                                                            →{" "}
                                                        </span>

                                                        <span className="font-semibold text-white">
                                                            {
                                                                mention.recipient
                                                            }
                                                        </span>
                                                    </p>

                                                    <p className="mt-2 text-sm text-slate-300">
                                                        {
                                                            mention.message
                                                        }
                                                    </p>
                                                </div>

                                                <div className="flex shrink-0 items-center gap-1 text-xs text-slate-500">
                                                    <CalendarDays
                                                        size={13}
                                                    />

                                                    {formatDate(
                                                        mention.createdAt
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MentionTeamMembers;