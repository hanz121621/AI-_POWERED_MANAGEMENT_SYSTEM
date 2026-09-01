
import { useMemo, useRef, useState } from "react";
import {
    AlertCircle,
    CheckCircle2,
    CircleUserRound,
    File,
    MessageSquare,
    Paperclip,
    Send,
    ShieldAlert,
    UserRound,
    X,
} from "lucide-react";

// ============================================================
// CONT-TASK-005
// ADD TASK COMMENT
// ============================================================

const CURRENT_CONTRIBUTOR = {
    id: "USER-003",
    name: "Hana Nigussie",
    role: "Contributor",
};

// ============================================================
// AUTHORIZED TEAM MEMBERS
// ============================================================

const AUTHORIZED_TEAM_MEMBERS = [
    {
        id: "USER-001",
        name: "Admin User",
        role: "Admin",
    },
    {
        id: "USER-002",
        name: "Project Manager",
        role: "Manager",
    },
    {
        id: "USER-003",
        name: "Hana Nigussie",
        role: "Contributor",
    },
    {
        id: "USER-004",
        name: "Team Member",
        role: "Contributor",
    },
];

// ============================================================
// MOCK TASKS
// ============================================================

const INITIAL_TASKS = [
    {
        id: "TASK-001",
        title: "Implement Contributor Dashboard",
        projectId: "PROJ-001",
        projectName: "AI Powered Management System",
        status: "In Progress",
        assigneeId: "USER-003",
        assigneeName: "Hana Nigussie",
    },
    {
        id: "TASK-002",
        title: "Implement Project Participation",
        projectId: "PROJ-001",
        projectName: "AI Powered Management System",
        status: "In Progress",
        assigneeId: "USER-003",
        assigneeName: "Hana Nigussie",
    },
    {
        id: "TASK-003",
        title: "Prepare Project Documentation",
        projectId: "PROJ-001",
        projectName: "AI Powered Management System",
        status: "Backlog",
        assigneeId: "USER-004",
        assigneeName: "Team Member",
    },
    {
        id: "TASK-004",
        title: "Database Integration",
        projectId: "PROJ-001",
        projectName: "AI Powered Management System",
        status: "Blocked",
        assigneeId: "USER-003",
        assigneeName: "Hana Nigussie",
    },
    {
        id: "TASK-005",
        title: "Create FieldSync Reports",
        projectId: "PROJ-002",
        projectName: "FieldSync",
        status: "To Do",
        assigneeId: "USER-003",
        assigneeName: "Hana Nigussie",
    },
];

// ============================================================
// MOCK EXISTING COMMENTS
// ============================================================

const INITIAL_COMMENTS = [
    {
        id: "COMMENT-001",
        taskId: "TASK-001",
        authorId: "USER-002",
        authorName: "Project Manager",
        authorRole: "Manager",
        text: "Please make sure the dashboard works correctly on smaller screens.",
        createdAt: "2026-08-23T09:15:00",
        attachment: null,
        mentions: [],
    },
    {
        id: "COMMENT-002",
        taskId: "TASK-001",
        authorId: "USER-003",
        authorName: "Hana Nigussie",
        authorRole: "Contributor",
        text: "I have started working on the responsive layout.",
        createdAt: "2026-08-23T11:30:00",
        attachment: null,
        mentions: [],
    },
    {
        id: "COMMENT-003",
        taskId: "TASK-002",
        authorId: "USER-002",
        authorName: "Project Manager",
        text: "Please connect the project participation features with the task management flow.",
        createdAt: "2026-08-24T08:20:00",
        attachment: null,
        mentions: [],
    },
];

// ============================================================
// HELPERS
// ============================================================

function formatDateTime(date) {
    if (!date) {
        return "Not available";
    }

    return new Date(date).toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function getStatusClasses(status) {
    switch (status) {
        case "In Progress":
            return "bg-blue-100 text-blue-700";

        case "Completed":
        case "Done":
            return "bg-emerald-100 text-emerald-700";

        case "Blocked":
            return "bg-red-100 text-red-700";

        case "Review":
            return "bg-purple-100 text-purple-700";

        case "Backlog":
        case "To Do":
        case "Todo":
        case "Ready":
            return "bg-slate-100 text-slate-700";

        default:
            return "bg-slate-100 text-slate-700";
    }
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function AddTaskComment() {
    // ----------------------------------------------------------
    // TASKS
    // ----------------------------------------------------------

    const [tasks] = useState(INITIAL_TASKS);

    // ----------------------------------------------------------
    // SELECTED TASK
    // ----------------------------------------------------------

    const [selectedTask, setSelectedTask] = useState(null);

    // ----------------------------------------------------------
    // COMMENTS
    // ----------------------------------------------------------

    const [comments, setComments] =
        useState(INITIAL_COMMENTS);

    // ----------------------------------------------------------
    // COMMENT TEXT
    // ----------------------------------------------------------

    const [commentText, setCommentText] = useState("");

    // ----------------------------------------------------------
    // MENTIONED USERS
    // ----------------------------------------------------------

    const [mentionedUsers, setMentionedUsers] =
        useState([]);

    // ----------------------------------------------------------
    // MENTION MENU
    // ----------------------------------------------------------

    const [showMentionMenu, setShowMentionMenu] =
        useState(false);

    // ----------------------------------------------------------
    // ATTACHMENT
    // ----------------------------------------------------------

    const [attachment, setAttachment] = useState(null);

    const fileInputRef = useRef(null);

    // ----------------------------------------------------------
    // NOTIFICATION
    // ----------------------------------------------------------

    const [notification, setNotification] = useState(null);

    // ----------------------------------------------------------
    // SAVING
    // ----------------------------------------------------------

    const [isSaving, setIsSaving] = useState(false);

    // ============================================================
    // ASSIGNED TASKS
    // ============================================================

    const assignedTasks = useMemo(() => {
        return tasks.filter(
            (task) =>
                task.assigneeId ===
                CURRENT_CONTRIBUTOR.id
        );
    }, [tasks]);

    // ============================================================
    // TASK COMMENTS
    // ============================================================

    const selectedTaskComments = useMemo(() => {
        if (!selectedTask) {
            return [];
        }

        return comments.filter(
            (comment) =>
                comment.taskId === selectedTask.id
        );
    }, [comments, selectedTask]);

    // ============================================================
    // OPEN TASK
    //
    // MAIN SUCCESS SCENARIO - STEP 1
    // Contributor opens Task Details.
    // ============================================================

    const openTask = (task) => {
        setSelectedTask(task);
        setCommentText("");
        setMentionedUsers([]);
        setAttachment(null);
        setNotification(null);
    };

    // ============================================================
    // CLOSE TASK
    // ============================================================

    const closeTask = () => {
        setSelectedTask(null);
        setCommentText("");
        setMentionedUsers([]);
        setAttachment(null);
        setNotification(null);
    };

    // ============================================================
    // HANDLE FILE
    //
    // MAIN SUCCESS SCENARIO - STEP 6
    // Contributor can optionally attach a file.
    // ============================================================

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        setAttachment(file);
    };

    // ============================================================
    // REMOVE ATTACHMENT
    // ============================================================

    const removeAttachment = () => {
        setAttachment(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // ============================================================
    // TOGGLE MENTION
    //
    // MAIN SUCCESS SCENARIO - STEP 5
    // Contributor can mention authorized team members.
    // ============================================================

    const toggleMention = (user) => {
        const alreadyMentioned =
            mentionedUsers.some(
                (mentionedUser) =>
                    mentionedUser.id === user.id
            );

        if (alreadyMentioned) {
            setMentionedUsers((previous) =>
                previous.filter(
                    (mentionedUser) =>
                        mentionedUser.id !== user.id
                )
            );

            return;
        }

        setMentionedUsers((previous) => [
            ...previous,
            user,
        ]);
    };

    // ============================================================
    // RECORD ACTIVITY
    //
    // MAIN SUCCESS SCENARIO - STEP 11
    // System records the activity.
    // ============================================================

    const recordCommentActivity = (
        task,
        comment
    ) => {
        const activity = {
            id: `ACT-COMMENT-${crypto.randomUUID()}`,
            type: "TASK_COMMENT_ADDED",
            taskId: task.id,
            taskTitle: task.title,
            projectId: task.projectId,
            projectName: task.projectName,
            userId: CURRENT_CONTRIBUTOR.id,
            userName: CURRENT_CONTRIBUTOR.name,
            commentId: comment.id,
            timestamp: comment.createdAt,
            description: `Comment added to task "${task.title}".`,
        };

        const existingActivities =
            JSON.parse(
                localStorage.getItem(
                    "aipms_task_activities"
                ) || "[]"
            );

        localStorage.setItem(
            "aipms_task_activities",
            JSON.stringify([
                ...existingActivities,
                activity,
            ])
        );

        return activity;
    };

    // ============================================================
    // NOTIFY RELEVANT USERS
    //
    // MAIN SUCCESS SCENARIO - STEP 10
    // System notifies mentioned/relevant users.
    // ============================================================

    const notifyRelevantUsers = (
        task,
        comment
    ) => {
        const notifications =
            JSON.parse(
                localStorage.getItem(
                    "aipms_notifications"
                ) || "[]"
            );

        const recipients = [
            task.assigneeId,
            ...comment.mentions.map(
                (user) => user.id
            ),
        ].filter(
            (userId, index, array) =>
                array.indexOf(userId) === index
        );

        const newNotifications =
            recipients
                .filter(
                    (userId) =>
                        userId !==
                        CURRENT_CONTRIBUTOR.id
                )
                .map((userId) => ({
                    id: `NOTIF-${crypto.randomUUID()}`,
                    userId,
                    type: "TASK_COMMENT",
                    taskId: task.id,
                    taskTitle: task.title,
                    message: `${CURRENT_CONTRIBUTOR.name} added a comment to "${task.title}".`,
                    createdAt: comment.createdAt,
                    read: false,
                }));

        localStorage.setItem(
            "aipms_notifications",
            JSON.stringify([
                ...notifications,
                ...newNotifications,
            ])
        );
    };

    // ============================================================
    // VALIDATE MENTIONS
    //
    // ALTERNATIVE FLOW A2
    // Unauthorized mention.
    // ============================================================

    const validateMentions = () => {
        return mentionedUsers.every((mentionedUser) =>
            AUTHORIZED_TEAM_MEMBERS.some(
                (authorizedUser) =>
                    authorizedUser.id ===
                    mentionedUser.id
            )
        );
    };

    // ============================================================
    // POST COMMENT
    //
    // CONT-TASK-005
    //
    // MAIN SUCCESS SCENARIO:
    //
    // 1. Open Task Details
    // 2. Open Comments
    // 3. Display existing comments
    // 4. Enter comment
    // 5. Mention authorized users
    // 6. Optional attachment
    // 7. Post
    // 8. Validate
    // 9. Store comment
    // 10. Notify relevant users
    // 11. Record activity
    //
    // ALTERNATIVE:
    //
    // A1 Empty comment
    // A2 Unauthorized mention
    // A3 Comment fails to save
    // ============================================================

    const handlePostComment = async () => {
        // --------------------------------------------------------
        // STEP 8 / A1
        // Validate empty comment.
        // --------------------------------------------------------

        const trimmedComment =
            commentText.trim();

        if (!trimmedComment) {
            setNotification({
                type: "error",
                message: "Comment cannot be empty.",
            });

            return;
        }

        // --------------------------------------------------------
        // STEP 8 / A2
        // Validate mentioned users.
        // --------------------------------------------------------

        if (!validateMentions()) {
            setNotification({
                type: "error",
                message:
                    "You cannot mention this user.",
            });

            return;
        }

        if (!selectedTask) {
            return;
        }

        try {
            setIsSaving(true);
            setNotification(null);

            // ----------------------------------------------------
            // Generate a stable ID outside render.
            // ----------------------------------------------------

            const commentId =
                `COMMENT-${crypto.randomUUID()}`;

            const createdAt =
                new Date().toISOString();

            // ----------------------------------------------------
            // STEP 9
            // Store comment.
            // ----------------------------------------------------

            const newComment = {
                id: commentId,
                taskId: selectedTask.id,
                authorId:
                    CURRENT_CONTRIBUTOR.id,
                authorName:
                    CURRENT_CONTRIBUTOR.name,
                authorRole:
                    CURRENT_CONTRIBUTOR.role,
                text: trimmedComment,
                createdAt,
                attachment: attachment
                    ? {
                          name: attachment.name,
                          size: attachment.size,
                          type: attachment.type,
                      }
                    : null,
                mentions: mentionedUsers,
            };

            // ----------------------------------------------------
            // Simulate save request.
            //
            // Replace with:
            //
            // await taskService.addComment(
            //     selectedTask.id,
            //     newComment
            // );
            //
            // when backend integration is ready.
            // ----------------------------------------------------

            await new Promise((resolve) =>
                setTimeout(resolve, 500)
            );

            setComments((previousComments) => [
                ...previousComments,
                newComment,
            ]);

            // ----------------------------------------------------
            // Persist comments locally for now.
            // ----------------------------------------------------

            const existingStoredComments =
                JSON.parse(
                    localStorage.getItem(
                        "aipms_task_comments"
                    ) || "[]"
                );

            localStorage.setItem(
                "aipms_task_comments",
                JSON.stringify([
                    ...existingStoredComments,
                    newComment,
                ])
            );

            // ----------------------------------------------------
            // STEP 10
            // Notify relevant users.
            // ----------------------------------------------------

            notifyRelevantUsers(
                selectedTask,
                newComment
            );

            // ----------------------------------------------------
            // STEP 11
            // Record activity.
            // ----------------------------------------------------

            recordCommentActivity(
                selectedTask,
                newComment
            );

            // ----------------------------------------------------
            // Clear form.
            // ----------------------------------------------------

            setCommentText("");
            setMentionedUsers([]);
            setAttachment(null);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            // ----------------------------------------------------
            // SUCCESS
            // ----------------------------------------------------

            setNotification({
                type: "success",
                message:
                    "Comment posted successfully.",
            });
        } catch (error) {
            console.error(
                "Unable to post comment:",
                error
            );

            // ----------------------------------------------------
            // A3
            // Comment fails to save.
            // ----------------------------------------------------

            setNotification({
                type: "error",
                message:
                    "Unable to post comment.",
            });
        } finally {
            setIsSaving(false);
        }
    };

    // ============================================================
    // TASK LIST
    // ============================================================

    if (!selectedTask) {
        return (
            <div className="min-h-screen bg-slate-50 p-6">
                <div className="mx-auto max-w-7xl">

                    {/* HEADER */}
                    <div className="mb-6 flex items-center gap-3">
                        <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
                            <MessageSquare size={24} />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">
                                Add Task Comment
                            </h1>

                            <p className="text-sm text-slate-500">
                                Communicate with your project team
                                through task comments.
                            </p>
                        </div>
                    </div>

                    {/* NOTIFICATION */}
                    {notification && (
                        <Notification
                            notification={notification}
                            onClose={() =>
                                setNotification(null)
                            }
                        />
                    )}

                    {/* CONTRIBUTOR */}
                    <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-white p-3 text-blue-600">
                                <CircleUserRound
                                    size={21}
                                />
                            </div>

                            <div>
                                <p className="text-xs font-medium text-blue-600">
                                    Logged-in Contributor
                                </p>

                                <p className="font-semibold text-blue-900">
                                    {CURRENT_CONTRIBUTOR.name}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* TASKS */}
                    {assignedTasks.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <div className="grid gap-5 lg:grid-cols-2">
                            {assignedTasks.map(
                                (task) => (
                                    <TaskCard
                                        key={task.id}
                                        task={task}
                                        onOpen={() =>
                                            openTask(
                                                task
                                            )
                                        }
                                    />
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // ============================================================
    // TASK DETAILS / COMMENTS
    // ============================================================

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="mx-auto max-w-5xl">

                {/* TOP BAR */}
                <div className="mb-6 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={closeTask}
                        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                    >
                        <X size={18} />
                        Close
                    </button>

                    <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                            selectedTask.status
                        )}`}
                    >
                        {selectedTask.status}
                    </span>
                </div>

                {/* NOTIFICATION */}
                {notification && (
                    <Notification
                        notification={notification}
                        onClose={() =>
                            setNotification(null)
                        }
                    />
                )}

                {/* TASK DETAILS */}
                <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
                            <MessageSquare
                                size={22}
                            />
                        </div>

                        <div className="min-w-0">
                            <p className="text-xs font-semibold text-blue-600">
                                {selectedTask.id}
                            </p>

                            <h1 className="mt-1 text-2xl font-bold text-slate-900">
                                {selectedTask.title}
                            </h1>

                            <p className="mt-2 text-sm text-slate-500">
                                {selectedTask.projectName}
                            </p>
                        </div>
                    </div>
                </div>

                {/* COMMENTS SECTION */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

                    {/* COMMENTS HEADER */}
                    <div className="border-b border-slate-100 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    Comments
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Task communication history
                                </p>
                            </div>

                            <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                {
                                    selectedTaskComments.length
                                }{" "}
                                {selectedTaskComments.length ===
                                1
                                    ? "Comment"
                                    : "Comments"}
                            </div>
                        </div>
                    </div>

                    {/* EXISTING COMMENTS */}
                    <div className="max-h-[500px] space-y-4 overflow-y-auto p-6">

                        {selectedTaskComments.length ===
                        0 ? (
                            <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center">
                                <MessageSquare
                                    size={28}
                                    className="mx-auto text-slate-300"
                                />

                                <p className="mt-3 text-sm font-medium text-slate-600">
                                    No comments yet
                                </p>

                                <p className="mt-1 text-xs text-slate-400">
                                    Start the conversation by
                                    adding a comment.
                                </p>
                            </div>
                        ) : (
                            selectedTaskComments.map(
                                (comment) => (
                                    <CommentItem
                                        key={
                                            comment.id
                                        }
                                        comment={
                                            comment
                                        }
                                    />
                                )
                            )
                        )}
                    </div>

                    {/* COMMENT FORM */}
                    <div className="border-t border-slate-100 p-6">

                        {/* MENTIONED USERS */}
                        {mentionedUsers.length >
                            0 && (
                            <div className="mb-3 flex flex-wrap gap-2">
                                {mentionedUsers.map(
                                    (user) => (
                                        <span
                                            key={
                                                user.id
                                            }
                                            className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700"
                                        >
                                            @{user.name}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    toggleMention(
                                                        user
                                                    )
                                                }
                                                className="ml-1 rounded-full hover:bg-blue-200"
                                                aria-label={`Remove mention of ${user.name}`}
                                            >
                                                <X
                                                    size={
                                                        13
                                                    }
                                                />
                                            </button>
                                        </span>
                                    )
                                )}
                            </div>
                        )}

                        {/* TEXTAREA */}
                        <div className="relative">
                            <textarea
                                value={commentText}
                                onChange={(event) =>
                                    setCommentText(
                                        event.target
                                            .value
                                    )
                                }
                                placeholder="Write a task comment..."
                                rows={5}
                                className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        {/* ATTACHMENT */}
                        {attachment && (
                            <div className="mt-3 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="rounded-lg bg-white p-2 text-blue-600 shadow-sm">
                                        <File
                                            size={18}
                                        />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-slate-700">
                                            {
                                                attachment.name
                                            }
                                        </p>

                                        <p className="text-xs text-slate-400">
                                            {formatFileSize(
                                                attachment.size
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={
                                        removeAttachment
                                    }
                                    className="rounded-lg p-2 text-slate-500 hover:bg-slate-200 hover:text-red-600"
                                    aria-label="Remove attachment"
                                >
                                    <X size={17} />
                                </button>
                            </div>
                        )}

                        {/* ACTIONS */}
                        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                            <div className="flex flex-wrap gap-2">

                                {/* ATTACH */}
                                <input
                                    ref={
                                        fileInputRef
                                    }
                                    type="file"
                                    className="hidden"
                                    onChange={
                                        handleFileChange
                                    }
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    className="flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                    <Paperclip
                                        size={17}
                                    />
                                    Attach File
                                </button>

                                {/* MENTION */}
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowMentionMenu(
                                                (value) =>
                                                    !value
                                            )
                                        }
                                        className="flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                    >
                                        <UserRound
                                            size={
                                                17
                                            }
                                        />
                                        Mention
                                    </button>

                                    {showMentionMenu && (
                                        <MentionMenu
                                            mentionedUsers={
                                                mentionedUsers
                                            }
                                            onToggle={
                                                toggleMention
                                            }
                                        />
                                    )}
                                </div>
                            </div>

                            {/* POST */}
                            <button
                                type="button"
                                onClick={
                                    handlePostComment
                                }
                                disabled={isSaving}
                                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                            >
                                {isSaving ? (
                                    <>
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        Posting...
                                    </>
                                ) : (
                                    <>
                                        <Send
                                            size={17}
                                        />
                                        Post
                                    </>
                                )}
                            </button>
                        </div>

                        {/* VALIDATION HINT */}
                        <p className="mt-3 text-xs text-slate-400">
                            Comments are visible to authorized
                            project team members.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================================
// TASK CARD
// ============================================================

function TaskCard({ task, onOpen }) {
    const taskComments = INITIAL_COMMENTS.filter(
        (comment) =>
            comment.taskId === task.id
    ).length;

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md">

            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold text-blue-600">
                        {task.id}
                    </p>

                    <h2 className="mt-1 text-lg font-bold text-slate-900">
                        {task.title}
                    </h2>
                </div>

                <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                        task.status
                    )}`}
                >
                    {task.status}
                </span>
            </div>

            <div className="mt-4 space-y-2 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                    <File size={16} />
                    <span>
                        {task.projectName}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <MessageSquare
                        size={16}
                    />
                    <span>
                        {taskComments}{" "}
                        {taskComments === 1
                            ? "comment"
                            : "comments"}
                    </span>
                </div>
            </div>

            <div className="mt-5 border-t border-slate-100 pt-4">
                <button
                    type="button"
                    onClick={onOpen}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                    <MessageSquare
                        size={17}
                    />
                    Open Comments
                </button>
            </div>
        </div>
    );
}

// ============================================================
// COMMENT ITEM
// ============================================================

function CommentItem({ comment }) {
    const isCurrentUser =
        comment.authorId ===
        CURRENT_CONTRIBUTOR.id;

    return (
        <div
            className={`rounded-xl border p-4 ${
                isCurrentUser
                    ? "border-blue-100 bg-blue-50"
                    : "border-slate-200 bg-slate-50"
            }`}
        >
            <div className="flex items-start gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm">
                    <CircleUserRound
                        size={18}
                    />
                </div>

                <div className="min-w-0 flex-1">

                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-slate-800">
                            {comment.authorName}
                        </span>

                        <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                            {comment.authorRole}
                        </span>

                        <span className="text-xs text-slate-400">
                            {formatDateTime(
                                comment.createdAt
                            )}
                        </span>
                    </div>

                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                        {comment.text}
                    </p>

                    {/* MENTIONS */}
                    {comment.mentions?.length >
                        0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {comment.mentions.map(
                                (user) => (
                                    <span
                                        key={
                                            user.id
                                        }
                                        className="rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-semibold text-blue-700"
                                    >
                                        @{user.name}
                                    </span>
                                )
                            )}
                        </div>
                    )}

                    {/* ATTACHMENT */}
                    {comment.attachment && (
                        <div className="mt-3 flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-2.5">
                            <File
                                size={16}
                                className="text-blue-600"
                            />

                            <span className="truncate text-xs font-semibold text-slate-600">
                                {
                                    comment
                                        .attachment
                                        .name
                                }
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ============================================================
// MENTION MENU
// ============================================================

function MentionMenu({
    mentionedUsers,
    onToggle,
}) {
    const availableUsers =
        AUTHORIZED_TEAM_MEMBERS.filter(
            (user) =>
                user.id !==
                CURRENT_CONTRIBUTOR.id
        );

    return (
        <div className="absolute bottom-full left-0 z-20 mb-2 w-72 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">

            <div className="border-b border-slate-100 px-4 py-3">
                <p className="text-sm font-bold text-slate-800">
                    Mention Team Member
                </p>

                <p className="mt-1 text-xs text-slate-400">
                    Only authorized members can be mentioned.
                </p>
            </div>

            <div className="max-h-60 overflow-y-auto p-2">
                {availableUsers.map((user) => {
                    const selected =
                        mentionedUsers.some(
                            (mentionedUser) =>
                                mentionedUser.id ===
                                user.id
                        );

                    return (
                        <button
                            key={user.id}
                            type="button"
                            onClick={() =>
                                onToggle(user)
                            }
                            className={`flex w-full items-center gap-3 rounded-lg p-3 text-left transition ${
                                selected
                                    ? "bg-blue-50"
                                    : "hover:bg-slate-50"
                            }`}
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                                <CircleUserRound
                                    size={16}
                                />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-slate-700">
                                    {user.name}
                                </p>

                                <p className="text-xs text-slate-400">
                                    {user.role}
                                </p>
                            </div>

                            {selected && (
                                <CheckCircle2
                                    size={17}
                                    className="text-blue-600"
                                />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

// ============================================================
// NOTIFICATION
// ============================================================

function Notification({
    notification,
    onClose,
}) {
    const isSuccess =
        notification.type === "success";

    return (
        <div
            className={`mb-5 flex items-center justify-between gap-4 rounded-xl border p-4 ${
                isSuccess
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-red-200 bg-red-50 text-red-700"
            }`}
        >
            <div className="flex items-center gap-2">
                {isSuccess ? (
                    <CheckCircle2 size={19} />
                ) : (
                    <AlertCircle size={19} />
                )}

                <span className="text-sm font-medium">
                    {notification.message}
                </span>
            </div>

            <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1 hover:bg-black/5"
                aria-label="Close notification"
            >
                <X size={17} />
            </button>
        </div>
    );
}

// ============================================================
// EMPTY STATE
// ============================================================

function EmptyState() {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <ShieldAlert size={27} />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-slate-800">
                No assigned tasks
            </h2>

            <p className="mt-2 text-sm text-slate-500">
                There are currently no tasks assigned to you.
            </p>
        </div>
    );
}

// ============================================================
// FILE SIZE
// ============================================================

function formatFileSize(bytes) {
    if (!bytes) {
        return "0 Bytes";
    }

    const units = [
        "Bytes",
        "KB",
        "MB",
        "GB",
    ];

    const index = Math.floor(
        Math.log(bytes) / Math.log(1024)
    );

    return `${parseFloat(
        (bytes / Math.pow(1024, index)).toFixed(
            2
        )
    )} ${units[index]}`;
}
