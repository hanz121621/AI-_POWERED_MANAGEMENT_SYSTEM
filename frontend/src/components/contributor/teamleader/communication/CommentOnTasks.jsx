
import { useEffect, useMemo, useRef, useState } from "react";
import {
    AlertCircle,
    AtSign,
    CheckCircle2,
    File,
    FileText,
    Loader2,
    MessageSquare,
    Paperclip,
    Send,
    Trash2,
    UsersRound,
} from "lucide-react";

import api from "@/services/api";

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

    return undefined;
}

function getErrorMessage(error, fallback) {
    return (
        error?.response?.data?.message ||
        error?.response?.data?.Message ||
        error?.response?.data?.error ||
        error?.response?.data?.title ||
        fallback
    );
}

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

function normalizeTask(task) {
    return {
        id: getValue(task, "id", "Id"),
        title:
            getValue(task, "title", "Title") ||
            "Untitled Task",
        description:
            getValue(task, "description", "Description") ||
            "",
        projectName:
            getValue(
                task,
                "projectName",
                "ProjectName"
            ) || "",
        status:
            getValue(task, "status", "Status") ||
            "",
        priority:
            getValue(task, "priority", "Priority") ||
            "",
        assignedTo:
            getValue(
                task,
                "assignedTo",
                "AssignedTo",
                "assignedContributorName",
                "AssignedContributorName"
            ) || "",
        assignedUserId:
            getValue(
                task,
                "assignedUserId",
                "AssignedUserId",
                "assignedContributorSDId",
                "AssignedContributorSDId"
            ) || null,
    };
}

function normalizeComment(comment) {
    const author = getValue(
        comment,
        "author",
        "Author"
    );

    const authorName =
        getValue(
            comment,
            "authorName",
            "AuthorName",
            "userName",
            "UserName",
            "createdByName",
            "CreatedByName"
        ) ||
        getValue(author, "fullName", "FullName", "name", "Name") ||
        "User";

    const authorRole =
        getValue(
            comment,
            "authorRole",
            "AuthorRole",
            "role",
            "Role"
        ) ||
        getValue(author, "role", "Role") ||
        "";

    const content =
        getValue(
            comment,
            "content",
            "Content",
            "comment",
            "Comment",
            "text",
            "Text"
        ) || "";

    const createdAt =
        getValue(
            comment,
            "createdAt",
            "CreatedAt",
            "createdDate",
            "CreatedDate"
        );

    const id =
        getValue(comment, "id", "Id") ||
        `${createdAt || ""}-${content}`;

    return {
        ...comment,
        id,
        authorName,
        authorRole,
        content,
        createdAt,
        attachments:
            getValue(
                comment,
                "attachments",
                "Attachments"
            ) || [],
        mentions:
            getValue(
                comment,
                "mentions",
                "Mentions"
            ) || [],
    };
}

function extractResponseData(response) {
    const data = response?.data;

    if (Array.isArray(data)) {
        return data;
    }

    return (
        data?.data ||
        data?.Data ||
        data?.tasks ||
        data?.Tasks ||
        data?.comments ||
        data?.Comments ||
        data
    );
}

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

                    {comment.attachments?.length > 0 && (
                        <div className="mt-3 space-y-2">
                            {comment.attachments.map(
                                (attachment, index) => {
                                    const attachmentId =
                                        getValue(
                                            attachment,
                                            "id",
                                            "Id"
                                        ) || index;

                                    const attachmentName =
                                        getValue(
                                            attachment,
                                            "name",
                                            "Name",
                                            "fileName",
                                            "FileName"
                                        ) ||
                                        "Attachment";

                                    return (
                                        <div
                                            key={attachmentId}
                                            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-blue-900/60 dark:bg-[#071a2d]"
                                        >
                                            <FileText className="h-4 w-4 text-blue-500" />

                                            <span className="truncate text-xs text-slate-600 dark:text-slate-300">
                                                {attachmentName}
                                            </span>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    )}

                    {comment.mentions?.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                            {comment.mentions.map(
                                (mention, index) => {
                                    const mentionId =
                                        getValue(
                                            mention,
                                            "id",
                                            "Id",
                                            "userId",
                                            "UserId"
                                        ) || index;

                                    const username =
                                        getValue(
                                            mention,
                                            "username",
                                            "Username",
                                            "userName",
                                            "UserName"
                                        ) || "user";

                                    return (
                                        <span
                                            key={mentionId}
                                            className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-1 text-[10px] font-semibold text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400"
                                        >
                                            <AtSign className="h-3 w-3" />
                                            {username}
                                        </span>
                                    );
                                }
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function CommentOnTasks({ tasks: providedTasks = [], sprintId }) {
    const fileInputRef = useRef(null);

    const [tasks, setTasks] = useState(() =>
        Array.isArray(providedTasks)
            ? providedTasks.map(normalizeTask)
            : []
    );

    const [selectedTaskId, setSelectedTaskId] = useState("");

    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");

    const [attachments, setAttachments] = useState([]);

    const [status, setStatus] = useState("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [loadingTasks, setLoadingTasks] = useState(false);
    const [loadingComments, setLoadingComments] = useState(false);
    const [posting, setPosting] = useState(false);

    useEffect(() => {
        if (Array.isArray(providedTasks) && providedTasks.length > 0) {
            const normalized = providedTasks.map(normalizeTask);

            setTasks(normalized);

            setSelectedTaskId((current) => {
                if (
                    current &&
                    normalized.some(
                        (task) =>
                            String(task.id) === String(current)
                    )
                ) {
                    return current;
                }

                return normalized[0]?.id || "";
            });

            return;
        }

        if (!sprintId) {
            setTasks([]);
            setSelectedTaskId("");
        }
    }, [providedTasks, sprintId]);

    useEffect(() => {
        if (
            Array.isArray(providedTasks) &&
            providedTasks.length > 0
        ) {
            return;
        }

        if (!sprintId) {
            return;
        }

        let cancelled = false;

        const loadTasks = async () => {
            setLoadingTasks(true);
            setErrorMessage("");

            try {
                const response = await api.get(
                    `/tasks/team-leader/sprint/${sprintId}`
                );

                const rawTasks = extractResponseData(response);

                const normalizedTasks = Array.isArray(rawTasks)
                    ? rawTasks.map(normalizeTask)
                    : [];

                if (!cancelled) {
                    setTasks(normalizedTasks);

                    setSelectedTaskId(
                        normalizedTasks[0]?.id || ""
                    );
                }
            } catch (error) {
                if (!cancelled) {
                    setTasks([]);
                    setSelectedTaskId("");
                    setStatus("error");
                    setErrorMessage(
                        getErrorMessage(
                            error,
                            "Unable to load tasks."
                        )
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoadingTasks(false);
                }
            }
        };

        loadTasks();

        return () => {
            cancelled = true;
        };
    }, [providedTasks, sprintId]);

    const selectedTask = useMemo(
        () =>
            tasks.find(
                (task) =>
                    String(task.id) ===
                    String(selectedTaskId)
            ) || null,
        [tasks, selectedTaskId]
    );

    useEffect(() => {
        if (!selectedTask?.id) {
            setComments([]);
            return;
        }

        let cancelled = false;

        const loadComments = async () => {
            setLoadingComments(true);
            setErrorMessage("");

            try {
                const response = await api.get(
                    `/tasks/${selectedTask.id}/comments`
                );

                const rawComments =
                    extractResponseData(response);

                const normalizedComments =
                    Array.isArray(rawComments)
                        ? rawComments
                              .map(normalizeComment)
                              .sort(
                                  (a, b) =>
                                      new Date(
                                          a.createdAt
                                      ).getTime() -
                                      new Date(
                                          b.createdAt
                                      ).getTime()
                              )
                        : [];

                if (!cancelled) {
                    setComments(normalizedComments);
                }
            } catch (error) {
                if (!cancelled) {
                    setComments([]);

                    setStatus("error");
                    setErrorMessage(
                        getErrorMessage(
                            error,
                            "Unable to load task comments."
                        )
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoadingComments(false);
                }
            }
        };

        loadComments();

        return () => {
            cancelled = true;
        };
    }, [selectedTask?.id]);

    const handleTaskChange = (event) => {
        setSelectedTaskId(event.target.value);
        setCommentText("");
        setAttachments([]);
        setErrorMessage("");
        setSuccessMessage("");
        setStatus("idle");
    };

    const handleCommentChange = (event) => {
        const value = event.target.value;

        setCommentText(value);
        setErrorMessage("");
        setSuccessMessage("");
        setStatus("idle");
    };

    const handleFileSelection = (event) => {
        const files = Array.from(
            event.target.files || []
        );

        if (files.length === 0) {
            return;
        }

        const mappedFiles = files.map((file) => ({
            id:
                typeof crypto !== "undefined" &&
                typeof crypto.randomUUID === "function"
                    ? crypto.randomUUID()
                    : `${Date.now()}-${Math.random()}`,
            name: file.name,
            size: file.size,
            type: file.type,
            file,
        }));

        setAttachments((current) => [
            ...current,
            ...mappedFiles,
        ]);

        event.target.value = "";
    };

    const removeAttachment = (attachmentId) => {
        setAttachments((current) =>
            current.filter(
                (attachment) =>
                    attachment.id !== attachmentId
            )
        );
    };

    const handlePostComment = async () => {
        setErrorMessage("");
        setSuccessMessage("");
        setStatus("idle");

        if (!commentText.trim()) {
            setStatus("error");
            setErrorMessage("Comment cannot be empty.");
            return;
        }

        if (!selectedTask) {
            setStatus("error");
            setErrorMessage("Task not found.");
            return;
        }

        if (commentText.trim().length > 5000) {
            setStatus("error");
            setErrorMessage(
                "Comment cannot contain more than 5000 characters."
            );
            return;
        }

        setPosting(true);

        try {
            const response = await api.post(
                `/tasks/${selectedTask.id}/comments`,
                {
                    content: commentText.trim(),
                }
            );

            const responseData = response?.data || {};

            const createdComment =
                responseData.comment ||
                responseData.Comment ||
                responseData.data ||
                responseData.Data;

            if (createdComment) {
                const normalizedComment =
                    normalizeComment(createdComment);

                setComments((current) => [
                    ...current,
                    normalizedComment,
                ]);
            } else {
                const refreshResponse = await api.get(
                    `/tasks/${selectedTask.id}/comments`
                );

                const refreshedComments =
                    extractResponseData(
                        refreshResponse
                    );

                setComments(
                    Array.isArray(refreshedComments)
                        ? refreshedComments
                              .map(normalizeComment)
                              .sort(
                                  (a, b) =>
                                      new Date(
                                          a.createdAt
                                      ).getTime() -
                                      new Date(
                                          b.createdAt
                                      ).getTime()
                              )
                        : []
                );
            }

            setCommentText("");
            setAttachments([]);
            setStatus("success");
            setSuccessMessage(
                "Comment posted successfully."
            );
        } catch (error) {
            const message = getErrorMessage(
                error,
                "Unable to post comment. Please try again."
            );

            setStatus("error");
            setErrorMessage(message);
        } finally {
            setPosting(false);
        }
    };

    const handleCommentKeyDown = (event) => {
        if (
            event.key === "Enter" &&
            (event.ctrlKey || event.metaKey)
        ) {
            event.preventDefault();
            handlePostComment();
        }
    };

    return (
        <div className="space-y-6">
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

            {status === "success" && successMessage && (
                <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/20">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />

                    <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                        {successMessage}
                    </p>
                </div>
            )}

            {status === "error" && errorMessage && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/60 dark:bg-red-950/20">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />

                    <p className="text-sm font-semibold text-red-800 dark:text-red-300">
                        {errorMessage}
                    </p>
                </div>
            )}

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

                {loadingTasks ? (
                    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500 dark:border-blue-900/60 dark:bg-[#071a2d] dark:text-slate-400">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading tasks...
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/60 dark:bg-amber-950/20">
                        <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                            No tasks found.
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

                {selectedTask && (
                    <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/70 p-4 dark:border-blue-900/60 dark:bg-blue-950/20">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <h3 className="text-sm font-bold text-blue-900 dark:text-blue-300">
                                    {selectedTask.title}
                                </h3>

                                {selectedTask.description && (
                                    <p className="mt-1 text-xs leading-5 text-blue-800 dark:text-blue-400">
                                        {selectedTask.description}
                                    </p>
                                )}
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
                            {comments.length}{" "}
                            {comments.length === 1
                                ? "Comment"
                                : "Comments"}
                        </span>
                    </div>

                    {loadingComments ? (
                        <div className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-500 dark:border-blue-900/70 dark:bg-[#0b2038] dark:text-slate-400">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Loading comments...
                        </div>
                    ) : comments.length === 0 ? (
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
                            {comments.map((comment) => (
                                <CommentCard
                                    key={comment.id}
                                    comment={comment}
                                />
                            ))}
                        </div>
                    )}
                </section>
            )}

            {selectedTask && (
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-blue-900/60 dark:bg-[#0b2038]">
                    <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                            <UsersRound className="h-5 w-5" />
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

                    <div>
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
                                Type @ to reference a member in your
                                comment.
                            </p>

                            <p className="text-[11px] text-slate-400">
                                {commentText.length}/5000
                            </p>
                        </div>
                    </div>

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

                            <p className="text-[11px] text-amber-600 dark:text-amber-400">
                                File uploads are not persisted by the
                                current Task Comments API.
                            </p>
                        </div>
                    )}

                    <div className="mt-5 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between dark:border-blue-900/60">
                        <p className="text-[11px] leading-5 text-slate-400">
                            Ctrl + Enter / Cmd + Enter to post
                            comment.
                        </p>

                        <button
                            type="button"
                            onClick={handlePostComment}
                            disabled={
                                posting ||
                                !commentText.trim()
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {posting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Send className="h-4 w-4" />
                            )}

                            {posting
                                ? "Posting..."
                                : "Post Comment"}
                        </button>
                    </div>
                </section>
            )}

            <section className="rounded-2xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-900/60 dark:bg-blue-950/20">
                <div className="flex items-start gap-3">
                    <MessageSquare className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />

                    <div>
                        <h2 className="text-sm font-bold text-blue-900 dark:text-blue-300">
                            TL-COMM-002 — Comment on Tasks
                        </h2>

                        <p className="mt-2 text-xs leading-5 text-blue-800 dark:text-blue-400">
                            The Team Leader can post task comments
                            and provide coordination or progress
                            updates. Comments are now loaded from
                            and saved to the backend Task Comments
                            API.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default CommentOnTasks;
