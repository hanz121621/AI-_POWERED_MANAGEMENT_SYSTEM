import { useState } from "react";
import {
    MessageSquare,
    Send,
    Paperclip,
    AtSign,
} from "lucide-react";

const INITIAL_COMMENTS = [
    {
        id: 1,
        author: "Team Leader",
        content:
            "Please make sure the authentication validation is completed before submission.",
        createdAt: "2026-08-31 10:30",
    },
    {
        id: 2,
        author: "Developer",
        content:
            "The login functionality is completed. I am working on protected routes.",
        createdAt: "2026-08-31 14:15",
    },
];

export default function AddTaskComment({
    task,
}) {
    const [comments, setComments] =
        useState(INITIAL_COMMENTS);

    const [comment, setComment] = useState("");
    const [mention, setMention] = useState("");
    const [attachment, setAttachment] =
        useState(null);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!task) {
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

        const newComment = {
            id: Date.now(),
            author: "Developer",
            content: finalComment,
            createdAt: new Date().toLocaleString(),
            attachment: attachment?.name || null,
        };

        setComments((current) => [
            ...current,
            newComment,
        ]);

        setComment("");
        setMention("");
        setAttachment(null);

        setSuccess("Comment added successfully.");
    };

    return (
        <div className="rounded-2xl border bg-white shadow-sm">

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

            <div className="max-h-96 space-y-4 overflow-y-auto p-5">
                {comments.map((item) => (
                    <div
                        key={item.id}
                        className="rounded-xl bg-slate-50 p-4"
                    >
                        <div className="flex items-center justify-between">
                            <p className="font-semibold text-slate-800">
                                {item.author}
                            </p>

                            <span className="text-xs text-slate-400">
                                {item.createdAt}
                            </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-600">
                            {item.content}
                        </p>

                        {item.attachment && (
                            <div className="mt-2 flex items-center gap-2 text-xs text-blue-600">
                                <Paperclip className="h-4 w-4" />
                                {item.attachment}
                            </div>
                        )}
                    </div>
                ))}
            </div>

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
                                setMention(e.target.value)
                            }
                            placeholder="Team member username"
                            className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-4 outline-none focus:border-blue-500"
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
                />

                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                    <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                        <Paperclip className="h-4 w-4" />

                        Attach File

                        <input
                            type="file"
                            className="hidden"
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
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
                    >
                        <Send className="h-4 w-4" />
                        Post Comment
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