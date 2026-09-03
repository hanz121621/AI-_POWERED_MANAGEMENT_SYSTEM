import { useEffect, useMemo, useState } from "react";
import {
    MessageSquare,
    Send,
    Paperclip,
    AtSign,
    X,
    CheckCircle2,
    AlertCircle,
    RefreshCw,
    ClipboardList,
} from "lucide-react";

import api from "../../../../services/api";
import { getMyWork } from "../../../../services/taskService";

// ============================================================
// HELPERS
// ============================================================

function getValue(object, keys, fallback = "") {
    for (const key of keys) {
        const value = key
            .split(".")
            .reduce(
                (current, part) => current?.[part],
                object
            );

        if (
            value !== undefined &&
            value !== null &&
            value !== ""
        ) {
            return value;
        }
    }

    return fallback;
}

function normalizeTask(task, index) {
    return {
        raw: task,

        id: getValue(
            task,
            [
                "id",
                "taskId",
                "TaskId",
                "Id",
            ],
            `task-${index}`
        ),

        name: getValue(
            task,
            [
                "name",
                "taskName",
                "TaskName",
                "title",
                "Title",
            ],
            "Untitled Task"
        ),

        projectId: getValue(
            task,
            [
                "projectId",
                "ProjectId",
                "project.id",
                "Project.Id",
            ],
            ""
        ),

        projectName: getValue(
            task,
            [
                "projectName",
                "ProjectName",
                "project.name",
                "Project.Name",
            ],
            "Project"
        ),

        status: getValue(
            task,
            [
                "status",
                "Status",
            ],
            ""
        ),

        description: getValue(
            task,
            [
                "description",
                "Description",
            ],
            ""
        ),
    };
}

function formatDate(dateValue) {
    if (!dateValue) {
        return "";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return String(dateValue);
    }

    return date.toLocaleString();
}

// ============================================================
// COMMENT HELPERS
// ============================================================

function getCommentId(comment, index) {
    return (
        comment?.id ||
        comment?.Id ||
        comment?.commentId ||
        comment?.CommentId ||
        `comment-${index}`
    );
}

function getCommentContent(comment) {
    return (
        comment?.content ||
        comment?.Content ||
        ""
    );
}

function getCommentAuthor(comment) {
    return (
        comment?.authorName ||
        comment?.userName ||
        comment?.createdByName ||
        comment?.author ||
        "You"
    );
}

function getCommentDate(comment) {
    return formatDate(
        comment?.createdAt ||
        comment?.CreatedAt
    );
}

// ============================================================
// COMPONENT
// ============================================================

export default function CommentOnTasks() {
    const [tasks, setTasks] = useState([]);

    const [selectedTaskId, setSelectedTaskId] =
        useState("");

    const [comments, setComments] = useState([]);

    const [comment, setComment] = useState("");

    const [file, setFile] = useState(null);

    const [loading, setLoading] = useState(true);

    const [commentsLoading, setCommentsLoading] =
        useState(false);

    const [posting, setPosting] = useState(false);

    const [refreshing, setRefreshing] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    // ========================================================
    // LOAD CONTRIBUTOR TASKS
    // ========================================================

    const loadTasks = async (
        showInitialLoading = true
    ) => {
        try {
            if (showInitialLoading) {
                setLoading(true);
            } else {
                setRefreshing(true);
            }

            setError("");

            const response = await getMyWork();

            /*
             * Support all common response shapes:
             *
             * 1. getMyWork() returns an array
             * 2. getMyWork() returns { data: [...] }
             * 3. getMyWork() returns { data: { data: [...] } }
             * 4. getMyWork() returns { data: { tasks: [...] } }
             */

            const taskData = Array.isArray(response)
                ? response
                : Array.isArray(response?.data)
                    ? response.data
                    : Array.isArray(response?.data?.data)
                        ? response.data.data
                        : Array.isArray(response?.data?.tasks)
                            ? response.data.tasks
                            : [];

            const normalized =
                taskData.map(normalizeTask);

            console.log(
                "COMMENT PAGE - TASK RESPONSE:",
                response
            );

            console.log(
                "COMMENT PAGE - NORMALIZED TASKS:",
                normalized
            );

            setTasks(normalized);

            if (normalized.length === 0) {
                setSelectedTaskId("");
                setComments([]);
                return;
            }

            /*
             * Preserve currently selected task
             * when possible.
             */

            const currentStillExists =
                normalized.some(
                    (task) =>
                        String(task.id) ===
                        String(selectedTaskId)
                );

            if (!currentStillExists) {
                setSelectedTaskId(
                    String(normalized[0].id)
                );
            }
        } catch (err) {
            console.error(
                "FAILED TO LOAD CONTRIBUTOR TASKS:",
                err
            );

            const message =
                err?.response?.data?.message ||
                "Unable to load your assigned tasks. Please try again.";

            setError(message);
            setTasks([]);
            setSelectedTaskId("");
            setComments([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {
        loadTasks();
    }, []);

    // ========================================================
    // SELECTED TASK
    // ========================================================

    const selectedTask = useMemo(
        () =>
            tasks.find(
                (task) =>
                    String(task.id) ===
                    String(selectedTaskId)
            ) ?? null,
        [tasks, selectedTaskId]
    );

    // ========================================================
    // LOAD COMMENTS
    //
    // GET /api/tasks/{taskId}/comments
    // ========================================================

    const loadComments = async (taskId) => {
        if (!taskId) {
            setComments([]);
            return;
        }

        try {
            setCommentsLoading(true);
            setError("");

            console.log(
                "GET TASK COMMENTS:",
                taskId
            );

            const response = await api.get(
                `/tasks/${taskId}/comments`
            );

            console.log(
                "GET TASK COMMENTS RESPONSE:",
                response.data
            );

            const data = Array.isArray(response.data)
                ? response.data
                : Array.isArray(
                    response.data?.data
                )
                    ? response.data.data
                    : Array.isArray(
                        response.data?.comments
                    )
                        ? response.data.comments
                        : [];

            setComments(
                Array.isArray(data)
                    ? data
                    : []
            );
        } catch (err) {
            console.error(
                "GET TASK COMMENTS ERROR:",
                err
            );

            const status =
                err?.response?.status;

            let message =
                err?.response?.data?.message ||
                "Unable to load task comments.";

            if (status === 403) {
                message =
                    "You do not have permission to view comments for this task.";
            }

            if (status === 404) {
                message =
                    "Task not found.";
            }

            if (status === 401) {
                message =
                    "Your session has expired. Please log in again.";
            }

            setError(message);
            setComments([]);
        } finally {
            setCommentsLoading(false);
        }
    };

    // ========================================================
    // LOAD COMMENTS WHEN TASK CHANGES
    // ========================================================

    useEffect(() => {
        if (!selectedTaskId) {
            setComments([]);
            return;
        }

        setComment("");
        setFile(null);
        setSuccess("");
        setError("");

        loadComments(selectedTaskId);
    }, [selectedTaskId]);

    // ========================================================
    // COMMENT CHANGE
    // ========================================================

    const handleCommentChange = (value) => {
        setComment(value);
        setSuccess("");
        setError("");
    };

    // ========================================================
    // ATTACHMENT
    // ========================================================

    const handleFileChange = (event) => {
        const selectedFile =
            event.target.files?.[0];

        if (!selectedFile) {
            return;
        }

        const maxSize =
            10 * 1024 * 1024;

        if (selectedFile.size > maxSize) {
            setError(
                "File size exceeds the allowed 10 MB limit."
            );

            event.target.value = "";
            return;
        }

        /*
         * The current Task Comment backend
         * does not accept file uploads.
         *
         * We keep the file in the UI only.
         */

        setFile(selectedFile);
        setError("");
    };

    // ========================================================
    // MENTION
    // ========================================================

    const handleMention = () => {
        if (!selectedTask) {
            return;
        }

        setComment(
            (current) =>
                `${current}${current && !current.endsWith(" ")
                    ? " "
                    : ""
                }@`
        );
    };

    // ========================================================
    // SUBMIT COMMENT
    //
    // POST /api/tasks/{taskId}/comments
    // ========================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!selectedTask) {
            setError(
                "Please select a task first."
            );
            return;
        }

        const content =
            comment.trim();

        if (!content) {
            setError(
                "Comment cannot be empty."
            );
            return;
        }

        if (content.length > 2000) {
            setError(
                "Comment cannot exceed 2000 characters."
            );
            return;
        }

        try {
            setPosting(true);

            console.log(
                "POST TASK COMMENT:",
                {
                    taskId: selectedTask.id,
                    content,
                }
            );

            const response = await api.post(
                `/tasks/${selectedTask.id}/comments`,
                {
                    taskId: selectedTask.id,
                    content,
                }
            );

            console.log(
                "POST TASK COMMENT RESPONSE:",
                response.data
            );

            const createdComment =
                response.data?.comment;

            if (
                createdComment &&
                typeof createdComment ===
                    "object"
            ) {
                setComments(
                    (current) => [
                        ...current,
                        createdComment,
                    ]
                );
            } else {
                await loadComments(
                    selectedTask.id
                );
            }

            setComment("");
            setFile(null);

            setSuccess(
                response.data?.message ||
                "Comment added successfully."
            );
        } catch (err) {
            console.error(
                "POST TASK COMMENT ERROR:",
                err
            );

            const status =
                err?.response?.status;

            let message =
                err?.response?.data?.message ||
                "Unable to add comment.";

            if (status === 400) {
                message =
                    err?.response?.data?.message ||
                    "Comment cannot be empty.";
            }

            if (status === 403) {
                message =
                    "You can only comment on tasks assigned to you.";
            }

            if (status === 404) {
                message =
                    "Task not found.";
            }

            if (status === 401) {
                message =
                    "Your session has expired. Please log in again.";
            }

            setError(message);
        } finally {
            setPosting(false);
        }
    };

    // ========================================================
    // REFRESH
    // ========================================================

    const handleRefresh = async () => {
        const previousTaskId =
            selectedTaskId;

        await loadTasks(false);

        /*
         * If there was already a selected task,
         * reload its comments.
         */

        if (previousTaskId) {
            await loadComments(
                previousTaskId
            );
        }
    };

    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
                <div className="flex flex-col items-center gap-3">
                    <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />

                    <p className="text-sm font-medium text-slate-600">
                        Loading your tasks...
                    </p>
                </div>
            </div>
        );
    }

    // ========================================================
    // MAIN UI
    // ========================================================

    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* ==================================================
                HEADER
            =================================================== */}

            <div className="border-b border-slate-200 bg-gradient-to-r from-white to-blue-50/50 p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">

                    <div className="flex items-start gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                            <MessageSquare className="h-5 w-5" />
                        </div>

                        <div>
                            <h2 className="text-lg font-bold text-slate-900">
                                Task Comments
                            </h2>

                            <p className="mt-1 text-sm leading-6 text-slate-600">
                                Communicate progress,
                                technical information,
                                questions, and
                                feedback.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleRefresh}
                        disabled={
                            refreshing ||
                            commentsLoading ||
                            posting
                        }
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:opacity-50"
                    >
                        <RefreshCw
                            className={
                                refreshing
                                    ? "h-4 w-4 animate-spin"
                                    : "h-4 w-4"
                            }
                        />

                        Refresh
                    </button>
                </div>
            </div>

            {/* ==================================================
                ERROR
            =================================================== */}

            {error && (
                <div className="mx-5 mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 sm:mx-6">

                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                    <p className="text-sm text-red-700">
                        {error}
                    </p>
                </div>
            )}

            {/* ==================================================
                SUCCESS
            =================================================== */}

            {success && (
                <div className="mx-5 mt-5 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 sm:mx-6">

                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />

                    <span className="text-sm text-emerald-800">
                        {success}
                    </span>
                </div>
            )}

            {/* ==================================================
                TASK SELECTOR
            =================================================== */}

            <div className="border-b border-slate-200 p-5 sm:p-6">

                {tasks.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">

                        <ClipboardList className="mx-auto mb-4 h-10 w-10 text-slate-300" />

                        <h3 className="font-semibold text-slate-800">
                            No assigned tasks
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            You currently have
                            no tasks available
                            for discussion.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                loadTasks(false)
                            }
                            disabled={refreshing}
                            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                        >
                            <RefreshCw
                                className={
                                    refreshing
                                        ? "h-4 w-4 animate-spin"
                                        : "h-4 w-4"
                                }
                            />

                            Reload Tasks
                        </button>
                    </div>
                ) : (
                    <>
                        <label className="mb-2 block text-sm font-semibold text-slate-800">
                            Select Task
                        </label>

                        <select
                            value={selectedTaskId}
                            onChange={(event) => {
                                setSelectedTaskId(
                                    event.target.value
                                );
                            }}
                            disabled={posting}
                            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        >
                            {tasks.map(
                                (task) => (
                                    <option
                                        key={task.id}
                                        value={task.id}
                                        className="bg-white text-slate-900"
                                    >
                                        {task.name}
                                    </option>
                                )
                            )}
                        </select>

                        {selectedTask && (
                            <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/60 p-4">

                                <div className="flex items-center gap-3">

                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                                        <ClipboardList className="h-5 w-5" />
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-slate-900">
                                            {selectedTask.name}
                                        </h3>

                                        <p className="mt-0.5 text-sm text-slate-500">
                                            Project:{" "}
                                            {
                                                selectedTask.projectName
                                            }
                                        </p>
                                    </div>
                                </div>

                                {selectedTask.description && (
                                    <p className="mt-4 text-sm leading-6 text-slate-600">
                                        {
                                            selectedTask.description
                                        }
                                    </p>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* ==================================================
                COMMENTS
            =================================================== */}

            {selectedTask && (
                <div className="p-5 sm:p-6">

                    <div className="mb-4 flex items-center justify-between">

                        <div>
                            <h3 className="font-semibold text-slate-900">
                                Task discussion
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                Comments for this task
                            </p>
                        </div>

                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                            {comments.length}{" "}
                            {comments.length === 1
                                ? "comment"
                                : "comments"}
                        </span>
                    </div>

                    {commentsLoading ? (
                        <div className="flex min-h-[180px] items-center justify-center rounded-xl border border-slate-200 bg-slate-50">

                            <div className="flex items-center gap-3 text-sm text-slate-500">

                                <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />

                                Loading comments...
                            </div>
                        </div>
                    ) : comments.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">

                            <MessageSquare className="mx-auto mb-3 h-9 w-9 text-slate-300" />

                            <h3 className="font-semibold text-slate-800">
                                No comments yet
                            </h3>

                            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                                Be the first to
                                add a comment to
                                this task.
                            </p>
                        </div>
                    ) : (
                        <div className="max-h-[420px] space-y-4 overflow-y-auto pr-1">

                            {comments.map(
                                (
                                    item,
                                    index
                                ) => (
                                    <div
                                        key={getCommentId(
                                            item,
                                            index
                                        )}
                                        className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                                    >

                                        <div className="flex items-start justify-between gap-4">

                                            <div className="flex items-center gap-3">

                                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                                                    <MessageSquare className="h-4 w-4" />
                                                </div>

                                                <div>
                                                    <p className="font-semibold text-slate-800">
                                                        {getCommentAuthor(
                                                            item
                                                        )}
                                                    </p>

                                                    <p className="text-xs text-slate-400">
                                                        {getCommentDate(
                                                            item
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                                            {getCommentContent(
                                                item
                                            )}
                                        </p>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* ==================================================
                COMPOSER
            =================================================== */}

            <div className="border-t border-slate-200 bg-slate-50/60 p-5 sm:p-6">

                <form onSubmit={handleSubmit}>

                    <textarea
                        value={comment}
                        onChange={(e) =>
                            handleCommentChange(
                                e.target.value
                            )
                        }
                        placeholder={
                            selectedTask
                                ? "Write a comment... Use @ to mention a team member."
                                : "Select a task first."
                        }

                        /*
                         * IMPORTANT:
                         * We only disable while posting.
                         *
                         * Previously this was:
                         *
                         * disabled={!selectedTask || posting}
                         *
                         * which prevented typing whenever
                         * selectedTask was not resolved.
                         */
                        disabled={posting}

                        rows={5}
                        maxLength={2000}
                        className="w-full resize-none rounded-xl border border-slate-300 bg-white p-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                    />

                    <div className="mt-1 text-right text-xs text-slate-400">
                        {comment.length}/2000
                    </div>

                    <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div className="flex flex-wrap items-center gap-2">

                            {/* ATTACHMENT */}

                            <label
                                className={`flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition ${
                                    posting
                                        ? "cursor-not-allowed opacity-50"
                                        : "cursor-pointer hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                                }`}
                            >
                                <Paperclip className="h-4 w-4" />

                                Attach File

                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={
                                        handleFileChange
                                    }
                                    disabled={
                                        posting
                                    }
                                />
                            </label>

                            {/* MENTION */}

                            <button
                                type="button"
                                disabled={
                                    !selectedTask ||
                                    posting
                                }
                                onClick={
                                    handleMention
                                }
                                className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <AtSign className="h-4 w-4" />

                                Mention
                            </button>

                            {/* SELECTED FILE */}

                            {file && (
                                <div className="flex max-w-full items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700">

                                    <span className="max-w-[160px] truncate">
                                        {file.name}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setFile(
                                                null
                                            )
                                        }
                                        disabled={
                                            posting
                                        }
                                        className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* POST COMMENT */}

                        <button
                            type="submit"
                            disabled={
                                !selectedTask ||
                                !comment.trim() ||
                                posting
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-4 focus:ring-blue-100"
                        >
                            <Send className="h-4 w-4" />

                            {posting
                                ? "Posting..."
                                : "Post Comment"}
                        </button>
                    </div>

                    {file && (
                        <p className="mt-3 text-xs text-slate-500">
                            Selected:{" "}
                            {file.name}
                            {" — "}
                            attachments are not
                            uploaded by the current
                            Task Comment API.
                        </p>
                    )}
                </form>
            </div>
        </section>
    );
}