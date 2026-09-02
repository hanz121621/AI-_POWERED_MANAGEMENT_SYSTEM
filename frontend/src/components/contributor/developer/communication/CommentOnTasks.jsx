import { useMemo, useState } from "react";
import {
    MessageSquare,
    Send,
    Paperclip,
    UserRound,
    Clock,
    AtSign,
    X,
    CheckCircle2,
} from "lucide-react";

const TEAM_MEMBERS = [
    {
        id: 1,
        name: "Abebe Kebede",
        username: "abebe",
        role: "Team Leader",
    },
    {
        id: 2,
        name: "Sara Ahmed",
        username: "sara",
        role: "Developer",
    },
    {
        id: 3,
        name: "Daniel Tadesse",
        username: "daniel",
        role: "Developer",
    },
];

const INITIAL_COMMENTS = [
    {
        id: 1,
        author: "Team Leader",
        content:
            "Please provide an update when the API integration is completed.",
        date: "Sep 1, 2026 09:10 AM",
    },
    {
        id: 2,
        author: "Sara Ahmed",
        content:
            "I have completed the frontend integration and uploaded the latest files.",
        date: "Sep 1, 2026 10:25 AM",
    },
];

function CommentOnTasks() {
    const [comments, setComments] = useState(INITIAL_COMMENTS);
    const [comment, setComment] = useState("");
    const [file, setFile] = useState(null);
    const [showMentions, setShowMentions] = useState(false);
    const [success, setSuccess] = useState("");

    const mentionQuery = useMemo(() => {
        const match = comment.match(/@([a-zA-Z0-9_]*)$/);
        return match ? match[1].toLowerCase() : "";
    }, [comment]);

    const filteredMembers = TEAM_MEMBERS.filter((member) =>
        member.username.toLowerCase().includes(mentionQuery)
    );

    const handleCommentChange = (value) => {
        setComment(value);

        if (/@[a-zA-Z0-9_]*$/.test(value)) {
            setShowMentions(true);
        } else {
            setShowMentions(false);
        }
    };

    const insertMention = (member) => {
        const newComment = comment.replace(
            /@[a-zA-Z0-9_]*$/,
            `@${member.username} `
        );

        setComment(newComment);
        setShowMentions(false);
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files?.[0];

        if (!selectedFile) return;

        const maxSize = 10 * 1024 * 1024;

        if (selectedFile.size > maxSize) {
            alert("File size exceeds the allowed limit.");
            return;
        }

        setFile(selectedFile);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!comment.trim()) {
            alert("Comment cannot be empty.");
            return;
        }

        const newComment = {
            id: Date.now(),
            author: "You",
            content: comment.trim(),
            date: new Date().toLocaleString(),
        };

        setComments((current) => [...current, newComment]);
        setComment("");
        setFile(null);
        setSuccess("Comment posted successfully.");

        setTimeout(() => setSuccess(""), 3000);
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="mx-auto max-w-5xl">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-900">
                        Task Comments
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Communicate progress, technical information, questions,
                        and feedback.
                    </p>
                </div>

                {success && (
                    <div className="mb-6 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                        <CheckCircle2 className="h-5 w-5" />
                        {success}
                    </div>
                )}

                <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 p-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100">
                                <MessageSquare className="h-5 w-5 text-blue-600" />
                            </div>

                            <div>
                                <h2 className="font-semibold text-slate-900">
                                    API Integration Task
                                </h2>

                                <p className="text-sm text-slate-500">
                                    Project: AI-PMS
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-5 p-6">
                        {comments.map((item) => (
                            <div
                                key={item.id}
                                className="flex gap-3"
                            >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100">
                                    <UserRound className="h-5 w-5 text-slate-500" />
                                </div>

                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-sm font-semibold text-slate-900">
                                            {item.author}
                                        </span>

                                        <span className="flex items-center gap-1 text-xs text-slate-400">
                                            <Clock className="h-3 w-3" />
                                            {item.date}
                                        </span>
                                    </div>

                                    <div className="mt-2 rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                                        {item.content}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-slate-200 p-6">
                        <form onSubmit={handleSubmit}>
                            <div className="relative">
                                <textarea
                                    value={comment}
                                    onChange={(e) =>
                                        handleCommentChange(e.target.value)
                                    }
                                    placeholder="Write a comment... Use @ to mention a team member."
                                    rows={5}
                                    className="w-full resize-none rounded-lg border border-slate-300 p-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />

                                {showMentions &&
                                    filteredMembers.length > 0 && (
                                        <div className="absolute bottom-full left-0 mb-2 w-72 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
                                            <div className="border-b border-slate-100 px-3 py-2 text-xs font-semibold text-slate-500">
                                                Mention team member
                                            </div>

                                            {filteredMembers.map((member) => (
                                                <button
                                                    type="button"
                                                    key={member.id}
                                                    onClick={() =>
                                                        insertMention(member)
                                                    }
                                                    className="flex w-full items-center gap-3 px-3 py-3 text-left hover:bg-slate-50"
                                                >
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                                                        <UserRound className="h-4 w-4 text-blue-600" />
                                                    </div>

                                                    <div>
                                                        <p className="text-sm font-medium text-slate-800">
                                                            {member.name}
                                                        </p>
                                                        <p className="text-xs text-slate-400">
                                                            @{member.username} ·{" "}
                                                            {member.role}
                                                        </p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                            </div>

                            <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                <div className="flex items-center gap-2">
                                    <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
                                        <Paperclip className="h-4 w-4" />
                                        Attach File

                                        <input
                                            type="file"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                    </label>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setComment((value) => `${value}@`)
                                        }
                                        className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                                    >
                                        <AtSign className="h-4 w-4" />
                                        Mention
                                    </button>

                                    {file && (
                                        <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-600">
                                            <span className="max-w-[160px] truncate">
                                                {file.name}
                                            </span>

                                            <button
                                                type="button"
                                                onClick={() => setFile(null)}
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                                >
                                    <Send className="h-4 w-4" />
                                    Post Comment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CommentOnTasks;