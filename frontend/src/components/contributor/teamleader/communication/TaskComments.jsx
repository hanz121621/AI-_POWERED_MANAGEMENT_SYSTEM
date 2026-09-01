import { useState } from "react";
import {
    AtSign,
    CheckCircle2,
    FileText,
    MessageCircle,
    Paperclip,
    Send,
    UserRound,
} from "lucide-react";

const INITIAL_COMMENTS = [
    {
        id: 1,
        author: "Abebe Kebede",
        role: "Developer",
        content:
            "The authentication API is ready for review. I have also attached the test results.",
        date: "Sep 1, 2026",
        time: "09:10 AM",
    },
    {
        id: 2,
        author: "Team Leader",
        role: "Team Leader",
        content:
            "Good progress. Please make sure the validation cases are covered before submitting it for review.",
        date: "Sep 1, 2026",
        time: "09:25 AM",
    },
];

export default function TaskComments() {
    const [comments, setComments] = useState(INITIAL_COMMENTS);
    const [comment, setComment] = useState("");
    const [attachedFile, setAttachedFile] = useState(null);
    const [message, setMessage] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!comment.trim()) {
            setMessage("Comment cannot be empty.");
            return;
        }

        const newComment = {
            id: Date.now(),
            author: "You",
            role: "Team Leader",
            content: comment.trim(),
            date: "Sep 1, 2026",
            time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
        };

        setComments((current) => [...current, newComment]);
        setComment("");
        setAttachedFile(null);
        setMessage("Comment posted successfully.");

        setTimeout(() => setMessage(""), 3000);
    };

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
                            Coordinate with your team through task comments.
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-5">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Current Task
                            </p>

                            <h3 className="mt-1 font-semibold text-slate-900">
                                Authentication API Integration
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                AI-Powered Management System · Sprint 3
                            </p>
                        </div>

                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            In Progress
                        </span>
                    </div>
                </div>

                <div className="mt-6 space-y-5">
                    {comments.map((item) => (
                        <div key={item.id} className="flex gap-3">
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

                                    <span className="text-xs text-slate-400">
                                        {item.date} · {item.time}
                                    </span>
                                </div>

                                <div className="mt-2 rounded-xl rounded-tl-none border border-slate-200 bg-white p-4">
                                    <p className="text-sm leading-6 text-slate-700">
                                        {item.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
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
                            onChange={(event) => setComment(event.target.value)}
                            rows={4}
                            placeholder="Write a progress update, question, or coordination message..."
                            className="w-full resize-none rounded-xl border-0 p-4 text-sm outline-none"
                        />

                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-3 py-3">
                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={() =>
                                        document
                                            .getElementById("task-comment-file")
                                            ?.click()
                                    }
                                    className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                                    title="Attach file"
                                >
                                    <Paperclip className="h-4 w-4" />
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setComment((current) => `${current}@`)
                                    }
                                    className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
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
                                            event.target.files?.[0] || null
                                        )
                                    }
                                />
                            </div>

                            <button
                                type="submit"
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                            >
                                <Send className="h-4 w-4" />
                                Post Comment
                            </button>
                        </div>
                    </div>

                    {attachedFile && (
                        <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                            <FileText className="h-4 w-4" />
                            {attachedFile.name}
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