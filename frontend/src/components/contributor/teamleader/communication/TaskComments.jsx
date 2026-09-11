
import { useEffect, useState } from "react";

import {
    AlertCircle,
    AtSign,
    CheckCircle2,
    FileText,
    Loader2,
    MessageCircle,
    Paperclip,
    Send,
    UserRound,
} from "lucide-react";

import api from "@/services/api";

function normalizeComment(item, index) {
    const author =
        item?.authorName ??
        item?.authorFullName ??
        item?.userName ??
        item?.user?.fullName ??
        item?.user?.name ??
        item?.AuthorName ??
        item?.AuthorFullName ??
        item?.UserName ??
        item?.author ??
        item?.Author ??
        "User";

    const role =
        item?.authorRole ??
        item?.userRole ??
        item?.role ??
        item?.AuthorRole ??
        item?.UserRole ??
        item?.Role ??
        "Contributor";

    const content =
        item?.content ??
        item?.comment ??
        item?.text ??
        item?.Content ??
        item?.Comment ??
        item?.Text ??
        "";

    const rawDate =
        item?.createdAt ??
        item?.commentedAt ??
        item?.date ??
        item?.CreatedAt ??
        item?.CommentedAt ??
        item?.Date;

    const parsedDate = rawDate
        ? new Date(rawDate)
        : null;

    const validDate =
        parsedDate &&
        !Number.isNaN(parsedDate.getTime());

    return {
        ...item,
        id:
            item?.id ??
            item?.commentId ??
            item?.Id ??
            item?.CommentId ??
            `comment-${index}`,
        author,
        role,
        content,
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
    };
}

function unwrapComments(response) {
    const data = response?.data;

    if (Array.isArray(data)) {
        return data;
    }

    if (Array.isArray(data?.data)) {
        return data.data;
    }

    if (Array.isArray(data?.comments)) {
        return data.comments;
    }

    if (Array.isArray(data?.items)) {
        return data.items;
    }

    return [];
}

export default function TaskComments({
    taskId,
    task,
}) {
    const resolvedTaskId =
        taskId ??
        task?.id ??
        task?.taskId ??
        task?.Id ??
        task?.TaskId ??
        null;

    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");
    const [attachedFile, setAttachedFile] =
        useState(null);

    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] =
        useState("");

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const loadComments = async () => {
        if (!resolvedTaskId) {
            setIsLoading(false);
            setComments([]);
            return;
        }

        setIsLoading(true);
        setErrorMessage("");

        try {
            const response = await api.get(
                `/tasks/${resolvedTaskId}/comments`
            );

            const rawComments =
                unwrapComments(response);

            setComments(
                rawComments.map(normalizeComment)
            );
        } catch (error) {
            console.error(
                "Failed to load task comments:",
                error
            );

            setErrorMessage(
                error?.response?.data?.message ??
                    error?.response?.data?.Message ??
                    "Unable to load task comments."
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadComments();
    }, [resolvedTaskId]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!resolvedTaskId) {
            setMessage(
                "Select a task before posting a comment."
            );
            return;
        }

        if (!comment.trim()) {
            setMessage("Comment cannot be empty.");
            return;
        }

        setIsSubmitting(true);
        setMessage("");
        setErrorMessage("");

        try {
            const response = await api.post(
                `/tasks/${resolvedTaskId}/comments`,
                {
                    content: comment.trim(),
                }
            );

            const returnedComment =
                response?.data?.comment ??
                response?.data?.Comment ??
                response?.data?.data ??
                response?.data;

            if (returnedComment) {
                const normalizedComment =
                    normalizeComment(
                        returnedComment,
                        comments.length
                    );

                setComments((current) => [
                    ...current,
                    normalizedComment,
                ]);
            } else {
                await loadComments();
            }

            setComment("");
            setAttachedFile(null);

            const fileInput =
                document.getElementById(
                    "task-comment-file"
                );

            if (fileInput) {
                fileInput.value = "";
            }

            setMessage(
                "Comment posted successfully."
            );

            setTimeout(
                () => setMessage(""),
                3000
            );
        } catch (error) {
            console.error(
                "Failed to post task comment:",
                error
            );

            const backendMessage =
                error?.response?.data?.message ??
                error?.response?.data?.Message;

            if (
                backendMessage ===
                "Task not found."
            ) {
                setErrorMessage(
                    "The selected task could not be found."
                );
            } else if (
                backendMessage ===
                "Access denied."
            ) {
                setErrorMessage(
                    "You are not authorized to comment on this task."
                );
            } else if (
                backendMessage ===
                "Comment cannot be empty."
            ) {
                setMessage(
                    "Comment cannot be empty."
                );
            } else {
                setErrorMessage(
                    backendMessage ??
                        "Unable to post the comment."
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const taskTitle =
        task?.title ??
        task?.Title ??
        "Current Task";

    const projectName =
        task?.projectName ??
        task?.project?.name ??
        task?.ProjectName ??
        task?.Project?.Name ??
        "AI-Powered Management System";

    const sprintName =
        task?.sprintName ??
        task?.sprint?.name ??
        task?.SprintName ??
        task?.Sprint?.Name ??
        "Sprint";

    const taskStatus =
        task?.statusName ??
        task?.status ??
        task?.StatusName ??
        task?.Status ??
        "In Progress";

    return (
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-5">
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-indigo-100 p-3">
                        <MessageCircle className="h-5 w-5 text-indigo-600" />
                    </div>

                    <div>
                        <h2 className="text-lg font-bold text-slate-900">
                            Task Discussion
                        </h2>

                        <p className="text-sm text-slate-500">
                            Coordinate with your team through
                            task comments.
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-5">
                {!resolvedTaskId && (
                    <div className="mb-5 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        Select a task to view and post comments.
                    </div>
                )}

                {errorMessage && (
                    <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-red-700">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            {errorMessage}
                        </div>

                        {resolvedTaskId && (
                            <button
                                type="button"
                                onClick={loadComments}
                                className="mt-2 text-xs font-semibold text-red-700 underline"
                            >
                                Try again
                            </button>
                        )}
                    </div>
                )}

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Current Task
                            </p>

                            <h3 className="mt-1 font-semibold text-slate-900">
                                {taskTitle}
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                {projectName} · {sprintName}
                            </p>
                        </div>

                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            {String(taskStatus)}
                        </span>
                    </div>
                </div>

                <div className="mt-6 space-y-5">
                    {isLoading ? (
                        <div className="flex min-h-[180px] flex-col items-center justify-center text-center">
                            <Loader2 className="mb-3 h-8 w-8 animate-spin text-indigo-500" />

                            <h3 className="font-semibold text-slate-700">
                                Loading comments
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                Fetching the task discussion...
                            </p>
                        </div>
                    ) : comments.length === 0 ? (
                        <div className="flex min-h-[180px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                            <MessageCircle className="mb-3 h-9 w-9 text-slate-300" />

                            <h3 className="font-semibold text-slate-700">
                                No comments yet
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                Start the task discussion below.
                            </p>
                        </div>
                    ) : (
                        comments.map((item) => (
                            <div
                                key={item.id}
                                className="flex gap-3"
                            >
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100">
                                    <UserRound className="h-4 w-4 text-blue-600" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-sm font-semibold text-slate-900">
                                            {item.author}
                                        </span>

                                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                                            {item.role}
                                        </span>

                                        {(item.date ||
                                            item.time) && (
                                            <span className="text-xs text-slate-400">
                                                {item.date}
                                                {item.date &&
                                                    item.time &&
                                                    " · "}
                                                {item.time}
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-2 rounded-xl rounded-tl-none border border-slate-200 bg-white p-4">
                                        <p className="text-sm leading-6 text-slate-700">
                                            {item.content}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="mt-7 border-t border-slate-200 pt-5"
                >
                    <label className="mb-2 block text-sm font-semibold text-slate-800">
                        Add Comment
                    </label>

                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">
                        <textarea
                            value={comment}
                            onChange={(event) =>
                                setComment(
                                    event.target.value
                                )
                            }
                            rows={4}
                            disabled={
                                !resolvedTaskId ||
                                isSubmitting
                            }
                            placeholder={
                                resolvedTaskId
                                    ? "Write a progress update, question, or coordination message..."
                                    : "Select a task first..."
                            }
                            className="w-full resize-none rounded-xl border-0 p-4 text-sm outline-none disabled:cursor-not-allowed disabled:bg-slate-50"
                        />

                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-3 py-3">
                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    disabled={
                                        !resolvedTaskId ||
                                        isSubmitting
                                    }
                                    onClick={() =>
                                        document
                                            .getElementById(
                                                "task-comment-file"
                                            )
                                            ?.click()
                                    }
                                    className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    title="Attach file"
                                >
                                    <Paperclip className="h-4 w-4" />
                                </button>

                                <button
                                    type="button"
                                    disabled={
                                        !resolvedTaskId ||
                                        isSubmitting
                                    }
                                    onClick={() =>
                                        setComment(
                                            (current) =>
                                                `${current}@`
                                        )
                                    }
                                    className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    title="Mention team member"
                                >
                                    <AtSign className="h-4 w-4" />
                                </button>

                                <input
                                    id="task-comment-file"
                                    type="file"
                                    className="hidden"
                                    onChange={(event) =>
                                        setAttachedFile(
                                            event.target.files?.[0] ??
                                                null
                                        )
                                    }
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={
                                    !resolvedTaskId ||
                                    isSubmitting
                                }
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Send className="h-4 w-4" />
                                )}

                                {isSubmitting
                                    ? "Posting..."
                                    : "Post Comment"}
                            </button>
                        </div>
                    </div>

                    {attachedFile && (
                        <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                            <FileText className="h-4 w-4" />

                            <span className="truncate">
                                {attachedFile.name}
                            </span>
                        </div>
                    )}

                    {message && (
                        <p className="mt-3 text-sm font-medium text-blue-600">
                            {message}
                        </p>
                    )}
                </form>
            </div>
        </section>
    );
}
