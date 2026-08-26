
import { useState } from "react";
import {
    MessageSquareText,
    Send,
    UserRound,
    AtSign,
    CheckCircle2,
    AlertCircle,
    Code2,
    UsersRound,
} from "lucide-react";

// ============================================================
// SAMPLE DEVELOPMENT TASKS
// Backend API will replace this data later.
// ============================================================

const DEVELOPMENT_TASKS = [
    {
        id: 1,
        title: "Implement Login API",
        project: "AI-PMS",
        status: "In Progress",
    },
    {
        id: 2,
        title: "Create Project Dashboard",
        project: "AI-PMS",
        status: "In Progress",
    },
    {
        id: 3,
        title: "Implement Task Management",
        project: "AI-PMS",
        status: "Review",
    },
];

// ============================================================
// COMMENT TYPES
// ============================================================

const COMMENT_TYPES = [
    "Implementation Details",
    "Technical Decision",
    "Dependency",
    "Error",
    "Testing Result",
    "Integration Issue",
    "Blocker",
    "Review Feedback",
];

// ============================================================
// USERS WHO CAN BE MENTIONED
// ============================================================

const MENTION_USERS = [
    {
        id: 1,
        name: "Team Leader",
        role: "Team Leader",
    },
    {
        id: 2,
        name: "Other Developer",
        role: "Developer",
    },
    {
        id: 3,
        name: "Staff Member",
        role: "Staff",
    },
    {
        id: 4,
        name: "Project Manager",
        role: "Manager",
    },
];

// ============================================================
// COMPONENT
// ============================================================

function AddTechnicalComments() {
    const [taskId, setTaskId] = useState("");

    const [commentType, setCommentType] = useState(
        "Implementation Details"
    );

    const [comment, setComment] = useState("");

    const [mention, setMention] = useState("");

    const [successMessage, setSuccessMessage] =
        useState("");

    const [errorMessage, setErrorMessage] =
        useState("");

    // ========================================================
    // SELECTED TASK
    // ========================================================

    const selectedTask = DEVELOPMENT_TASKS.find(
        (task) => String(task.id) === String(taskId)
    );

    // ========================================================
    // HANDLE COMMENT SUBMISSION
    // ========================================================

    const handleSubmit = (event) => {
        event.preventDefault();

        setSuccessMessage("");
        setErrorMessage("");

        // ----------------------------------------------------
        // Validate task
        // ----------------------------------------------------

        if (!taskId) {
            setErrorMessage(
                "Please select a task."
            );

            return;
        }

        // ----------------------------------------------------
        // Validate comment
        // ----------------------------------------------------

        if (!comment.trim()) {
            setErrorMessage(
                "Comment cannot be empty."
            );

            return;
        }

        // ----------------------------------------------------
        // Frontend demonstration
        // Backend API will be connected later.
        // ----------------------------------------------------

        const commentData = {
            taskId,
            taskTitle: selectedTask?.title,
            commentType,
            comment: comment.trim(),
            mentionedUser: mention || null,
            createdAt: new Date().toISOString(),
        };

        console.log(
            "TECHNICAL COMMENT SUBMITTED:",
            commentData
        );

        setSuccessMessage(
            "Technical comment added successfully."
        );

        // Clear comment after successful submission
        setComment("");
        setMention("");
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="space-y-6">
            {/* ==================================================
                HEADER
            ================================================== */}

            <div>
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                        <MessageSquareText size={22} />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Add Technical Comments
                        </h1>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Document technical information,
                            decisions, issues, and development
                            discussions.
                        </p>
                    </div>
                </div>
            </div>

            {/* ==================================================
                SUCCESS MESSAGE
            ================================================== */}

            {successMessage && (
                <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-400">
                    <CheckCircle2 size={20} />

                    <span className="text-sm font-medium">
                        {successMessage}
                    </span>
                </div>
            )}

            {/* ==================================================
                ERROR MESSAGE
            ================================================== */}

            {errorMessage && (
                <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400">
                    <AlertCircle size={20} />

                    <span className="text-sm font-medium">
                        {errorMessage}
                    </span>
                </div>
            )}

            {/* ==================================================
                COMMENT FORM
            ================================================== */}

            <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0d2340]"
            >
                {/* ==================================================
                    TASK
                ================================================== */}

                <div className="mb-5">
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                        <Code2 size={17} />

                        Development Task
                    </label>

                    <select
                        value={taskId}
                        onChange={(event) =>
                            setTaskId(event.target.value)
                        }
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-[#081b33] dark:text-white"
                    >
                        <option value="">
                            Select a development task
                        </option>

                        {DEVELOPMENT_TASKS.map(
                            (task) => (
                                <option
                                    key={task.id}
                                    value={task.id}
                                >
                                    {task.title} —{" "}
                                    {task.project}
                                </option>
                            )
                        )}
                    </select>
                </div>

                {/* ==================================================
                    SELECTED TASK INFORMATION
                ================================================== */}

                {selectedTask && (
                    <div className="mb-5 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/40 dark:bg-blue-950/20">
                        <div className="grid gap-4 sm:grid-cols-3">
                            <div>
                                <p className="text-xs text-blue-600 dark:text-blue-400">
                                    Task
                                </p>

                                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                                    {selectedTask.title}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-blue-600 dark:text-blue-400">
                                    Project
                                </p>

                                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                                    {selectedTask.project}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-blue-600 dark:text-blue-400">
                                    Status
                                </p>

                                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                                    {selectedTask.status}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* ==================================================
                    COMMENT TYPE
                ================================================== */}

                <div className="mb-5">
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Technical Information Type
                    </label>

                    <select
                        value={commentType}
                        onChange={(event) =>
                            setCommentType(
                                event.target.value
                            )
                        }
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-[#081b33] dark:text-white"
                    >
                        {COMMENT_TYPES.map(
                            (type) => (
                                <option
                                    key={type}
                                    value={type}
                                >
                                    {type}
                                </option>
                            )
                        )}
                    </select>
                </div>

                {/* ==================================================
                    COMMENT
                ================================================== */}

                <div className="mb-5">
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Technical Comment
                    </label>

                    <textarea
                        value={comment}
                        onChange={(event) =>
                            setComment(
                                event.target.value
                            )
                        }
                        rows={7}
                        placeholder="Enter implementation details, technical decisions, dependencies, errors, testing results, integration issues, blockers, or review feedback..."
                        className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-[#081b33] dark:text-white"
                    />

                    <div className="mt-2 flex justify-end">
                        <span className="text-xs text-slate-400">
                            {comment.length} characters
                        </span>
                    </div>
                </div>

                {/* ==================================================
                    MENTION USER
                ================================================== */}

                <div className="mb-6">
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                        <AtSign size={17} />

                        Mention Team Member
                    </label>

                    <select
                        value={mention}
                        onChange={(event) =>
                            setMention(
                                event.target.value
                            )
                        }
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-[#081b33] dark:text-white"
                    >
                        <option value="">
                            No mention
                        </option>

                        {MENTION_USERS.map(
                            (user) => (
                                <option
                                    key={user.id}
                                    value={user.id}
                                >
                                    {user.name} —{" "}
                                    {user.role}
                                </option>
                            )
                        )}
                    </select>

                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                        You can mention the Team Leader,
                        Developers, Staff members, or
                        Manager.
                    </p>
                </div>

                {/* ==================================================
                    SUBMIT
                ================================================== */}

                <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-[#0d2340]"
                >
                    <Send size={18} />

                    Post Technical Comment
                </button>
            </form>

            {/* ==================================================
                INFORMATION PANEL
            ================================================== */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0d2340]">
                <div className="mb-5 flex items-center gap-3">
                    <UsersRound
                        size={21}
                        className="text-blue-500"
                    />

                    <h2 className="font-semibold text-slate-900 dark:text-white">
                        Technical Communication
                    </h2>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl bg-slate-50 p-4 dark:bg-[#081b33]">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            Implementation
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                            Document how a feature or
                            solution was implemented.
                        </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4 dark:bg-[#081b33]">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            Dependencies
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                            Record libraries, services,
                            APIs, or other dependencies.
                        </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4 dark:bg-[#081b33]">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            Testing
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                            Record testing results and
                            discovered errors.
                        </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4 dark:bg-[#081b33]">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            Blockers
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                            Document technical blockers
                            affecting development.
                        </p>
                    </div>
                </div>
            </div>

            {/* ==================================================
                BUSINESS RULE
            ================================================== */}

            <div className="rounded-2xl border border-violet-200 bg-violet-50 p-5 dark:border-violet-900/40 dark:bg-violet-950/20">
                <div className="flex items-start gap-3">
                    <UserRound
                        size={20}
                        className="mt-0.5 shrink-0 text-violet-600 dark:text-violet-400"
                    />

                    <div>
                        <h2 className="font-semibold text-violet-900 dark:text-violet-300">
                            Developer Communication Rule
                        </h2>

                        <p className="mt-1 text-sm leading-6 text-violet-800 dark:text-violet-300/80">
                            Technical comments are attached
                            to the assigned task and can be
                            shared with relevant Team Leaders,
                            Developers, Staff members, and
                            Managers.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddTechnicalComments;
