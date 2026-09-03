import { useEffect, useState } from "react";
import {
    MessageSquare,
    Send,
    Paperclip,
    AtSign,
} from "lucide-react";

import api from "@/services/api";

export default function AddTaskComment({ task }) {
    const [comments, setComments] = useState([]);

    const [comment, setComment] = useState("");
    const [mention, setMention] = useState("");
    const [attachment, setAttachment] = useState(null);

    const [loading, setLoading] = useState(false);
    const [posting, setPosting] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // =========================================================
    // LOAD TASK COMMENTS
    // GET /api/tasks/{taskId}/comments
    // =========================================================
    useEffect(() => {
        let cancelled = false;

        const loadComments = async () => {
            if (!task?.id) {
                setComments([]);
                return;
            }

            setLoading(true);
            setError("");
            setSuccess("");

            try {
                const response = await api.get(
                    `/tasks/${task.id}/comments`
                );

                if (cancelled) {
                    return;
                }

                const data = Array.isArray(response.data)
                    ? response.data
                    : response.data?.data ||
                      response.data?.comments ||
                      [];

                setComments(Array.isArray(data) ? data : []);
            } catch (err) {
                if (cancelled) {
                    return;
                }

                console.error(
                    "GET TASK COMMENTS ERROR:",
                    err
                );

                const message =
                    err?.response?.data?.message ||
                    "Unable to load task comments.";

                setError(message);
                setComments([]);
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadComments();

        return () => {
            cancelled = true;
        };
    }, [task?.id]);

    // =========================================================
    // POST COMMENT
    // POST /api/tasks/{taskId}/comments
    // =========================================================
    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!task?.id) {
            setError("Task not found.");
            return;
        }

        if (!comment.trim()) {
            setError("Comment cannot be empty.");
            return;
        }

        const finalComment = mention.trim()
            ? `@${mention.trim()} ${comment.trim()}`
            : comment.trim();

        setPosting(true);

        try {
            const response = await api.post(
                `/tasks/${task.id}/comments`,
                {
                    taskId: task.id,
                    content: finalComment,
                }
            );

            const createdComment =
                response.data?.comment ||
                response.data?.data ||
                response.data;

            // Add the newly created comment immediately.
            if (
                createdComment &&
                typeof createdComment === "object"
            ) {
                setComments((current) => [
                    ...current,
                    createdComment,
                ]);
            } else {
                // If the API doesn't return the created
                // comment, reload the task comments.
                const commentsResponse = await api.get(
                    `/tasks/${task.id}/comments`
                );

                const data = Array.isArray(
                    commentsResponse.data
                )
                    ? commentsResponse.data
                    : commentsResponse.data?.data ||
                      commentsResponse.data?.comments ||
                      [];

                setComments(
                    Array.isArray(data) ? data : []
                );
            }

            setComment("");
            setMention("");
            setAttachment(null);

            setSuccess(
                response.data?.message ||
                    "Comment added successfully."
            );
        } catch (err) {
            console.error(
                "POST TASK COMMENT ERROR:",
                err
            );

            const message =
                err?.response?.data?.message ||
                "Unable to add comment.";

            setError(message);
        } finally {
            setPosting(false);
        }
    };

    // =========================================================
    // COMMENT DISPLAY HELPERS
    // =========================================================
    const getCommentAuthor = (item) => {
        return (
            item.authorName ||
            item.userName ||
            item.author ||
            item.createdByName ||
            "Developer"
        );
    };

    const getCommentContent = (item) => {
        return (
            item.content ||
            item.comment ||
            item.text ||
            ""
        );
    };

    const getCommentDate = (item) => {
        const date =
            item.createdAt ||
            item.createdDate ||
            item.createdOn;

        if (!date) {
            return "";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return date;
        }

        return parsedDate.toLocaleString();
    };

    return (
        <div className="rounded-2xl border bg-white shadow-sm">
            {/* =====================================================
                HEADER
            ====================================================== */}
            <div className="border-b p-5">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                        <MessageSquare className="h-5 w-5" />
                    </div>

                    <div>
                        <h2 className="font-bold text-slate-900">
                            Task Comments
                        </h2>

                        <p className="text-sm text-slate-500">
                            {task?.title || "Selected task"}
                        </p>
                    </div>
                </div>
            </div>

            {/* =====================================================
                COMMENTS
            ====================================================== */}
            <div className="max-h-96 space-y-4 overflow-y-auto p-5">
                {loading && (
                    <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                        Loading comments...
                    </div>
                )}

                {!loading &&
                    comments.length === 0 && (
                        <div className="rounded-xl bg-slate-50 p-4 text-center text-sm text-slate-500">
                            No comments yet.
                        </div>
                    )}

                {!loading &&
                    comments.map((item, index) => (
                        <div
                            key={
                                item.id ||
                                item.commentId ||
                                index
                            }
                            className="rounded-xl bg-slate-50 p-4"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <p className="font-semibold text-slate-800">
                                    {getCommentAuthor(item)}
                                </p>

                                <span className="text-xs text-slate-400">
                                    {getCommentDate(item)}
                                </span>
                            </div>

                            <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">
                                {getCommentContent(item)}
                            </p>

                            {item.attachment && (
                                <div className="mt-2 flex items-center gap-2 text-xs text-blue-600">
                                    <Paperclip className="h-4 w-4" />

                                    {typeof item.attachment ===
                                    "string"
                                        ? item.attachment
                                        : item.attachment
                                              .name ||
                                          "Attachment"}
                                </div>
                            )}
                        </div>
                    ))}
            </div>

            {/* =====================================================
                ADD COMMENT FORM
            ====================================================== */}
            <form
                onSubmit={handleSubmit}
                className="border-t p-5"
            >
                {error && (
                    <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                        {success}
                    </div>
                )}

                <div className="mb-3">
                    <label className="mb-2 block text-sm font-medium">
                        Mention Team Member
                    </label>

                    <div className="relative">
                        <AtSign className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

                        <input
                            value={mention}
                            onChange={(e) =>
                                setMention(
                                    e.target.value
                                )
                            }
                            placeholder="Team member username"
                            className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-4 outline-none focus:border-blue-500"
                            disabled={posting}
                        />
                    </div>
                </div>

                <textarea
                    value={comment}
                    onChange={(e) =>
                        setComment(e.target.value)
                    }
                    rows={4}
                    placeholder="Write your comment..."
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                    disabled={posting}
                />

                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <label
                        className={`inline-flex items-center gap-2 text-sm text-slate-600 ${
                            posting
                                ? "cursor-not-allowed opacity-50"
                                : "cursor-pointer"
                        }`}
                    >
                        <Paperclip className="h-4 w-4" />

                        Attach File

                        <input
                            type="file"
                            className="hidden"
                            disabled={posting}
                            onChange={(e) =>
                                setAttachment(
                                    e.target.files?.[0] ||
                                        null
                                )
                            }
                        />
                    </label>

                    <button
                        type="submit"
                        disabled={posting}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <Send className="h-4 w-4" />

                        {posting
                            ? "Posting..."
                            : "Post Comment"}
                    </button>
                </div>

                {attachment && (
                    <p className="mt-3 text-xs text-slate-500">
                        Selected: {attachment.name}
                    </p>
                )}
            </form>
        </div>
    );
}