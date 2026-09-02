
import { useMemo, useRef, useState } from "react";

import {
    AlertCircle,
    AtSign,
    CheckCircle2,
    File,
    FileText,
    MessageSquare,
    Paperclip,
    Send,
    Trash2,
    UserRound,
    UsersRound,
    
} from "lucide-react";

// ============================================================
// STORAGE KEYS
// ============================================================

const TASKS_KEY = "aipms_tasks";
const COMMENTS_KEY = "aipms_task_comments";
const NOTIFICATIONS_KEY = "aipms_notifications";
const ACTIVITIES_KEY = "aipms_activities";
const USER_KEY = "user";

// ============================================================
// DEFAULT DATA
// ============================================================

const DEFAULT_TASKS = [
    {
        id: "task-001",
        title: "Implement authentication module",
        description:
            "Implement login, registration, password validation, and authentication flow.",
        projectName: "AI-Powered Management System",
        status: "In Progress",
        priority: "High",
        assignedTo: "Developer",
        assignedUserId: "developer-001",
    },
    {
        id: "task-002",
        title: "Create dashboard interface",
        description:
            "Develop the main dashboard interface for the management system.",
        projectName: "AI-Powered Management System",
        status: "Review",
        priority: "Medium",
        assignedTo: "Frontend Developer",
        assignedUserId: "developer-002",
    },
    {
        id: "task-003",
        title: "Fix project progress calculation",
        description:
            "Review project progress calculations and correct inaccurate values.",
        projectName: "AI-Powered Management System",
        status: "To Do",
        priority: "High",
        assignedTo: "Backend Developer",
        assignedUserId: "developer-003",
    },
];

const DEFAULT_TEAM_MEMBERS = [
    {
        id: "manager-001",
        name: "Project Manager",
        username: "manager",
        role: "Manager",
        active: true,
    },
    {
        id: "developer-001",
        name: "Frontend Developer",
        username: "frontenddev",
        role: "Developer",
        active: true,
    },
    {
        id: "developer-002",
        name: "Backend Developer",
        username: "backenddev",
        role: "Developer",
        active: true,
    },
    {
        id: "staff-001",
        name: "Project Staff",
        username: "projectstaff",
        role: "Staff",
        active: true,
    },
];

// ============================================================
// SAFE STORAGE HELPERS
// ============================================================

function readStorage(key, fallback = []) {
    try {
        const value = localStorage.getItem(key);

        if (!value) {
            return fallback;
        }

        const parsed = JSON.parse(value);

        return parsed ?? fallback;
    } catch {
        return fallback;
    }
}

function writeStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        // Ignore storage errors.
    }
}

// ============================================================
// ID HELPER
// ============================================================

function createId(prefix) {
    if (
        typeof crypto !== "undefined" &&
        typeof crypto.randomUUID === "function"
    ) {
        return `${prefix}-${crypto.randomUUID()}`;
    }

    return `${prefix}-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 9)}`;
}

// ============================================================
// CURRENT USER
// ============================================================

function getCurrentUser() {
    const storedUser = readStorage(USER_KEY, null);

    if (storedUser && typeof storedUser === "object") {
        return storedUser;
    }

    return {
        id: "team-leader-001",
        name: "Team Leader",
        fullName: "Team Leader",
        username: "teamleader",
        role: "Team Leader",
    };
}

// ============================================================
// ACTIVITY
// ============================================================

function saveActivity(activity) {
    const activities = readStorage(ACTIVITIES_KEY, []);

    activities.unshift(activity);

    writeStorage(ACTIVITIES_KEY, activities);
}

// ============================================================
// NOTIFICATION
// ============================================================

function saveNotification(notification) {
    const notifications = readStorage(NOTIFICATIONS_KEY, []);

    notifications.unshift(notification);

    writeStorage(NOTIFICATIONS_KEY, notifications);
}

// ============================================================
// COMMENTS
// ============================================================

function getCommentsForTask(taskId) {
    const comments = readStorage(COMMENTS_KEY, []);

    return comments
        .filter((comment) => comment.taskId === taskId)
        .sort(
            (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
        );
}

function saveComment(comment) {
    const comments = readStorage(COMMENTS_KEY, []);

    comments.push(comment);

    writeStorage(COMMENTS_KEY, comments);
}

// ============================================================
// FORMAT DATE
// ============================================================

function formatDate(dateValue) {
    if (!dateValue) {
        return "";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleString();
}

// ============================================================
// INITIAL COMMENTS
// ============================================================

// ============================================================
// COMMENT CARD
// ============================================================

function CommentCard({ comment }) {
    const initials = comment.authorName
        ? comment.authorName
              .split(" ")
              .map((word) => word[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()
        : "U";

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-blue-900/60 dark:bg-[#0b2038]">
            <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                    {initials}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                            {comment.authorName}
                        </h4>

                        {comment.authorRole && (
                            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                                {comment.authorRole}
                            </span>
                        )}
                    </div>

                    <p className="mt-1 text-[11px] text-slate-400">
                        {formatDate(comment.createdAt)}
                    </p>

                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700 dark:text-slate-300">
                        {comment.content}
                    </p>

                    {/* ATTACHMENTS */}

                    {comment.attachments?.length > 0 && (
                        <div className="mt-3 space-y-2">
                            {comment.attachments.map((attachment) => (
                                <div
                                    key={attachment.id}
                                    className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-blue-900/60 dark:bg-[#071a2d]"
                                >
                                    <FileText className="h-4 w-4 text-blue-500" />

                                    <span className="truncate text-xs text-slate-600 dark:text-slate-300">
                                        {attachment.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* MENTIONS */}

                    {comment.mentions?.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                            {comment.mentions.map((mention) => (
                                <span
                                    key={mention.id}
                                    className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-1 text-[10px] font-semibold text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400"
                                >
                                    <AtSign className="h-3 w-3" />
                                    {mention.username}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

function CommentOnTasks() {
    const currentUser = useMemo(() => getCurrentUser(), []);

    const fileInputRef = useRef(null);

    const [tasks] = useState(() => {
        const storedTasks = readStorage(TASKS_KEY, []);

        return storedTasks.length > 0 ? storedTasks : DEFAULT_TASKS;
    });

    const [teamMembers] = useState(() => DEFAULT_TEAM_MEMBERS);

    const [selectedTaskId, setSelectedTaskId] = useState(
        tasks[0]?.id || ""
    );

    const [commentText, setCommentText] = useState("");

    const [commentsVersion, setCommentsVersion] = useState(0);

    const [attachments, setAttachments] = useState([]);

    const [mentionSearch, setMentionSearch] = useState("");

    const [showMentionList, setShowMentionList] = useState(false);

    const [status, setStatus] = useState("idle");

    const [errorMessage, setErrorMessage] = useState("");

    const [successMessage, setSuccessMessage] = useState("");

    const [loading, setLoading] = useState(false);

    // ========================================================
    // SELECTED TASK
    // ========================================================

    const selectedTask = useMemo(
        () =>
            tasks.find(
                (task) => String(task.id) === String(selectedTaskId)
            ) || null,
        [tasks, selectedTaskId]
    );

    // ========================================================
    // COMMENTS
    // ========================================================

    const selectedTaskComments = useMemo(() => {
        void commentsVersion;

        if (!selectedTask) {
            return [];
        }

        return getCommentsForTask(selectedTask.id);
    }, [selectedTask, commentsVersion]);

    // ========================================================
    // MENTION SEARCH
    // ========================================================

    const filteredMembers = useMemo(() => {
        const query = mentionSearch.trim().toLowerCase();

        if (!query) {
            return teamMembers;
        }

        return teamMembers.filter((member) => {
            return (
                member.name.toLowerCase().includes(query) ||
                member.username.toLowerCase().includes(query)
            );
        });
    }, [mentionSearch, teamMembers]);

    // ========================================================
    // EXTRACT MENTIONS
    // ========================================================

    const extractMentions = (text) => {
        const matches = text.match(/@([a-zA-Z0-9_.-]+)/g) || [];

        const uniqueUsernames = [
            ...new Set(
                matches.map((match) => match.substring(1).toLowerCase())
            ),
        ];

        return uniqueUsernames
            .map((username) =>
                teamMembers.find(
                    (member) =>
                        member.username.toLowerCase() === username
                )
            )
            .filter(Boolean);
    };

    // ========================================================
    // TASK SELECTION
    // ========================================================

    const handleTaskChange = (event) => {
        setSelectedTaskId(event.target.value);

        setCommentText("");

        setAttachments([]);

        setMentionSearch("");

        setShowMentionList(false);

        setErrorMessage("");

        setSuccessMessage("");
    };

    // ========================================================
    // COMMENT CHANGE
    // ========================================================

    const handleCommentChange = (event) => {
        const value = event.target.value;

        setCommentText(value);

        setErrorMessage("");

        setSuccessMessage("");

        const lastAtPosition = value.lastIndexOf("@");

        if (lastAtPosition >= 0) {
            const afterAt = value.slice(lastAtPosition + 1);

            if (
                !afterAt.includes(" ") &&
                !afterAt.includes("\n")
            ) {
                setMentionSearch(afterAt);

                setShowMentionList(true);

                return;
            }
        }

        setMentionSearch("");

        setShowMentionList(false);
    };

    // ========================================================
    // SELECT MENTION
    // ========================================================

    const handleMentionSelect = (member) => {
        const lastAtPosition = commentText.lastIndexOf("@");

        if (lastAtPosition === -1) {
            return;
        }

        const beforeAt = commentText.slice(0, lastAtPosition);

        const updatedText = `${beforeAt}@${member.username} `;

        setCommentText(updatedText);

        setMentionSearch("");

        setShowMentionList(false);

        setErrorMessage("");
    };

    // ========================================================
    // FILE SELECTION
    // ========================================================

    const handleFileSelection = (event) => {
        const files = Array.from(event.target.files || []);

        if (files.length === 0) {
            return;
        }

        const mappedFiles = files.map((file) => ({
            id: createId("attachment"),
            name: file.name,
            size: file.size,
            type: file.type,
        }));

        setAttachments((current) => [
            ...current,
            ...mappedFiles,
        ]);

        event.target.value = "";
    };

    // ========================================================
    // REMOVE ATTACHMENT
    // ========================================================

    const removeAttachment = (attachmentId) => {
        setAttachments((current) =>
            current.filter(
                (attachment) =>
                    attachment.id !== attachmentId
            )
        );
    };

    // ========================================================
    // POST COMMENT
    // ========================================================

    const handlePostComment = async () => {
        setErrorMessage("");

        setSuccessMessage("");

        // ----------------------------------------------------
        // A1: EMPTY COMMENT
        // ----------------------------------------------------

        if (!commentText.trim()) {
            setStatus("error");

            setErrorMessage("Comment cannot be empty.");

            return;
        }

        // ----------------------------------------------------
        // A2: TASK NOT FOUND
        // ----------------------------------------------------

        if (!selectedTask) {
            setStatus("error");

            setErrorMessage("Task not found.");

            return;
        }

        // ----------------------------------------------------
        // A3: ACCESS DENIED
        // ----------------------------------------------------

        if (
            selectedTask.accessDenied === true ||
            selectedTask.canComment === false
        ) {
            setStatus("error");

            setErrorMessage("Access denied.");

            return;
        }

        // ----------------------------------------------------
        // VALIDATION
        // ----------------------------------------------------

        if (commentText.trim().length > 5000) {
            setStatus("error");

            setErrorMessage(
                "Comment cannot contain more than 5000 characters."
            );

            return;
        }

        setLoading(true);

        try {
            const mentions = extractMentions(commentText);

            // ------------------------------------------------
            // CREATE COMMENT
            // ------------------------------------------------

            const comment = {
                id: createId("comment"),
                taskId: selectedTask.id,
                authorId:
                    currentUser.id ||
                    currentUser.userId ||
                    "team-leader-001",
                authorName:
                    currentUser.fullName ||
                    currentUser.name ||
                    "Team Leader",
                authorRole: "Team Leader",
                content: commentText.trim(),
                mentions,
                attachments,
                createdAt: new Date().toISOString(),
            };

            // ------------------------------------------------
            // SAVE COMMENT
            // ------------------------------------------------

            saveComment(comment);

            // ------------------------------------------------
            // NOTIFY MANAGER
            // ------------------------------------------------

            const manager = teamMembers.find(
                (member) =>
                    member.role === "Manager" &&
                    member.active === true
            );

            if (manager) {
                saveNotification({
                    id: createId("notification"),
                    userId: manager.id,
                    type: "TASK_COMMENT",
                    title: "New task comment",
                    message: `${comment.authorName} commented on "${selectedTask.title}".`,
                    taskId: selectedTask.id,
                    projectName: selectedTask.projectName,
                    read: false,
                    createdAt: new Date().toISOString(),
                });
            }

            // ------------------------------------------------
            // NOTIFY MENTIONED USERS
            // ------------------------------------------------

            mentions.forEach((member) => {
                if (!member.active) {
                    return;
                }

                saveNotification({
                    id: createId("notification"),
                    userId: member.id,
                    type: "TASK_MENTION",
                    title: "You were mentioned",
                    message: `${comment.authorName} mentioned you in a task comment.`,
                    taskId: selectedTask.id,
                    projectName: selectedTask.projectName,
                    commentId: comment.id,
                    read: false,
                    createdAt: new Date().toISOString(),
                });
            });

            // ------------------------------------------------
            // RECORD ACTIVITY
            // IMPORTANT:
            // ID is generated here, not during render.
            // ------------------------------------------------

            saveActivity({
                id: createId("activity"),
                type: "TASK_COMMENT_POSTED",
                action: "Comment posted",
                taskId: selectedTask.id,
                taskTitle: selectedTask.title,
                projectName: selectedTask.projectName,
                userId:
                    currentUser.id ||
                    currentUser.userId ||
                    "team-leader-001",
                userName:
                    currentUser.fullName ||
                    currentUser.name ||
                    "Team Leader",
                mentions: mentions.map(
                    (member) => member.username
                ),
                createdAt: new Date().toISOString(),
            });

            // ------------------------------------------------
            // SUCCESS
            // ------------------------------------------------

            setCommentText("");

            setAttachments([]);

            setMentionSearch("");

            setShowMentionList(false);

            setStatus("success");

            setSuccessMessage(
                "Comment posted successfully."
            );

            setCommentsVersion((current) => current + 1);
        } catch {
            // ------------------------------------------------
            // A4: SAVE FAILURE
            // ------------------------------------------------

            setStatus("error");

            setErrorMessage(
                "Unable to post comment. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // ========================================================
    // KEYBOARD SHORTCUT
    // ========================================================

    const handleCommentKeyDown = (event) => {
        if (
            event.key === "Enter" &&
            (event.ctrlKey || event.metaKey)
        ) {
            event.preventDefault();

            handlePostComment();
        }
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="space-y-6">
            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-blue-900/60 dark:bg-[#0b2038]">
                <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                        <MessageSquare className="h-6 w-6" />
                    </div>

                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                                TL-COMM-002
                            </span>

                            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                                Communication
                            </span>
                        </div>

                        <h1 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
                            Comment on Tasks
                        </h1>

                        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                            Communicate with the Manager, Staff,
                            and Developers through task discussions
                            and provide coordination or
                            progress-related information.
                        </p>
                    </div>
                </div>
            </div>

            {/* ==================================================
                SUCCESS MESSAGE
            ================================================== */}

            {status === "success" && successMessage && (
                <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/20">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />

                    <div>
                        <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                            {successMessage}
                        </p>
                    </div>
                </div>
            )}

            {/* ==================================================
                ERROR MESSAGE
            ================================================== */}

            {status === "error" && errorMessage && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/60 dark:bg-red-950/20">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />

                    <div>
                        <p className="text-sm font-semibold text-red-800 dark:text-red-300">
                            {errorMessage}
                        </p>
                    </div>
                </div>
            )}

            {/* ==================================================
                TASK SELECTOR
            ================================================== */}

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-blue-900/60 dark:bg-[#0b2038]">
                <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                        <FileText className="h-5 w-5" />
                    </div>

                    <div>
                        <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                            Task Details
                        </h2>

                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Select a task to view its discussion.
                        </p>
                    </div>
                </div>

                {tasks.length === 0 ? (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/60 dark:bg-amber-950/20">
                        <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                            Task not found.
                        </p>
                    </div>
                ) : (
                    <div>
                        <label
                            htmlFor="task-select"
                            className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-300"
                        >
                            Select Task
                        </label>

                        <select
                            id="task-select"
                            value={selectedTaskId}
                            onChange={handleTaskChange}
                            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-blue-900/70 dark:bg-[#071a2d] dark:text-white"
                        >
                            {tasks.map((task) => (
                                <option
                                    key={task.id}
                                    value={task.id}
                                >
                                    {task.title}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* SELECTED TASK SUMMARY */}

                {selectedTask && (
                    <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/70 p-4 dark:border-blue-900/60 dark:bg-blue-950/20">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <h3 className="text-sm font-bold text-blue-900 dark:text-blue-300">
                                    {selectedTask.title}
                                </h3>

                                <p className="mt-1 text-xs leading-5 text-blue-800 dark:text-blue-400">
                                    {selectedTask.description}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {selectedTask.status && (
                                    <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-600 dark:bg-[#0b2038] dark:text-slate-300">
                                        {selectedTask.status}
                                    </span>
                                )}

                                {selectedTask.priority && (
                                    <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-600 dark:bg-[#0b2038] dark:text-slate-300">
                                        {selectedTask.priority}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-4 text-[11px] text-blue-700 dark:text-blue-400">
                            {selectedTask.projectName && (
                                <span>
                                    Project:{" "}
                                    <strong>
                                        {selectedTask.projectName}
                                    </strong>
                                </span>
                            )}

                            {selectedTask.assignedTo && (
                                <span>
                                    Assigned to:{" "}
                                    <strong>
                                        {selectedTask.assignedTo}
                                    </strong>
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </section>

            {/* ==================================================
                PREVIOUS COMMENTS
            ================================================== */}

            {selectedTask && (
                <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-blue-900/60 dark:bg-[#071a2d]">
                    <div className="mb-5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                                <MessageSquare className="h-5 w-5" />
                            </div>

                            <div>
                                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                                    Comments
                                </h2>

                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Previous task discussion.
                                </p>
                            </div>
                        </div>

                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500 shadow-sm dark:bg-[#0b2038] dark:text-slate-400">
                            {selectedTaskComments.length}{" "}
                            {selectedTaskComments.length === 1
                                ? "Comment"
                                : "Comments"}
                        </span>
                    </div>

                    {selectedTaskComments.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center dark:border-blue-900/70 dark:bg-[#0b2038]">
                            <MessageSquare className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-600" />

                            <p className="mt-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
                                No comments yet.
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                                Start the task discussion below.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {selectedTaskComments.map(
                                (comment) => (
                                    <CommentCard
                                        key={comment.id}
                                        comment={comment}
                                    />
                                )
                            )}
                        </div>
                    )}
                </section>
            )}

            {/* ==================================================
                ADD COMMENT
            ================================================== */}

            {selectedTask && (
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-blue-900/60 dark:bg-[#0b2038]">
                    <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                            <UserRound className="h-5 w-5" />
                        </div>

                        <div>
                            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                                Add Comment
                            </h2>

                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Coordinate with authorized project
                                members.
                            </p>
                        </div>
                    </div>

                    {/* COMMENT TEXTAREA */}

                    <div className="relative">
                        <label
                            htmlFor="task-comment"
                            className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-300"
                        >
                            Comment
                        </label>

                        <textarea
                            id="task-comment"
                            value={commentText}
                            onChange={handleCommentChange}
                            onKeyDown={handleCommentKeyDown}
                            placeholder="Write a coordination or progress update..."
                            rows={6}
                            maxLength={5000}
                            className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-blue-900/70 dark:bg-[#071a2d] dark:text-white dark:placeholder:text-slate-500"
                        />

                        <div className="mt-2 flex items-center justify-between">
                            <p className="text-[11px] text-slate-400">
                                Type @ to mention a project
                                member.
                            </p>

                            <p className="text-[11px] text-slate-400">
                                {commentText.length}/5000
                            </p>
                        </div>

                        {/* MENTION DROPDOWN */}

                        {showMentionList && (
                            <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-blue-900/70 dark:bg-[#0b2038]">
                                <div className="mb-2 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    Project Members
                                </div>

                                {filteredMembers.length === 0 ? (
                                    <div className="rounded-lg px-3 py-3 text-xs text-slate-500">
                                        No matching project members.
                                    </div>
                                ) : (
                                    filteredMembers.map(
                                        (member) => (
                                            <button
                                                key={member.id}
                                                type="button"
                                                disabled={!member.active}
                                                onClick={() =>
                                                    handleMentionSelect(
                                                        member
                                                    )
                                                }
                                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-blue-950/60"
                                            >
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                                                    <UsersRound className="h-4 w-4" />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-xs font-semibold text-slate-800 dark:text-white">
                                                        {
                                                            member.name
                                                        }
                                                    </p>

                                                    <p className="truncate text-[10px] text-slate-400">
                                                        @
                                                        {
                                                            member.username
                                                        }{" "}
                                                        ·{" "}
                                                        {
                                                            member.role
                                                        }
                                                    </p>
                                                </div>

                                                {!member.active && (
                                                    <span className="text-[10px] text-red-400">
                                                        Inactive
                                                    </span>
                                                )}
                                            </button>
                                        )
                                    )
                                )}
                            </div>
                        )}
                    </div>

                    {/* ==================================================
                        ATTACHMENTS
                    ================================================== */}

                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleFileSelection}
                    />

                    <div className="mt-4">
                        <button
                            type="button"
                            onClick={() =>
                                fileInputRef.current?.click()
                            }
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 dark:border-blue-900/70 dark:bg-[#071a2d] dark:text-slate-300 dark:hover:bg-blue-950/50 dark:hover:text-blue-400"
                        >
                            <Paperclip className="h-4 w-4" />

                            Attach Files
                        </button>
                    </div>

                    {attachments.length > 0 && (
                        <div className="mt-3 space-y-2">
                            {attachments.map((attachment) => (
                                <div
                                    key={attachment.id}
                                    className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-blue-900/60 dark:bg-[#071a2d]"
                                >
                                    <File className="h-4 w-4 shrink-0 text-blue-500" />

                                    <span className="min-w-0 flex-1 truncate text-xs text-slate-600 dark:text-slate-300">
                                        {attachment.name}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeAttachment(
                                                attachment.id
                                            )
                                        }
                                        aria-label={`Remove ${attachment.name}`}
                                        className="rounded-md p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ==================================================
                        ACTIONS
                    ================================================== */}

                    <div className="mt-5 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between dark:border-blue-900/60">
                        <p className="text-[11px] leading-5 text-slate-400">
                            Ctrl + Enter / Cmd + Enter to post
                            comment.
                        </p>

                        <button
                            type="button"
                            onClick={handlePostComment}
                            disabled={
                                loading ||
                                !commentText.trim()
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Send className="h-4 w-4" />

                            {loading
                                ? "Posting..."
                                : "Post Comment"}
                        </button>
                    </div>
                </section>
            )}

            {/* ==================================================
                USE CASE INFORMATION
            ================================================== */}

            <section className="rounded-2xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-900/60 dark:bg-blue-950/20">
                <div className="flex items-start gap-3">
                    <MessageSquare className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />

                    <div>
                        <h2 className="text-sm font-bold text-blue-900 dark:text-blue-300">
                            TL-COMM-002 — Comment on Tasks
                        </h2>

                        <p className="mt-2 text-xs leading-5 text-blue-800 dark:text-blue-400">
                            The Team Leader can post task comments,
                            mention authorized team members, attach
                            files, and provide coordination or
                            progress updates. Comments are stored in
                            communication history and relevant users
                            receive notifications.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default CommentOnTasks;
