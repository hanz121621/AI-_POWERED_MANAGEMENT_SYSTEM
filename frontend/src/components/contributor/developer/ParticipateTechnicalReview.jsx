
import { useState } from "react";
import {
    MessageSquareText,
    CheckCircle2,
    AlertCircle,
    RefreshCw,
    Send,
    FileCheck2,
    UserRound,
    ClipboardCheck,
} from "lucide-react";

// ============================================================
// SAMPLE REVIEW TASKS
// Backend API will replace this data later.
// ============================================================

const REVIEW_TASKS = [
    {
        id: 1,
        title: "Implement Login API",
        project: "AI-PMS",
        status: "Review",
        reviewer: "Project Manager",
        feedback:
            "Please improve validation and handle invalid login attempts.",
    },
    {
        id: 2,
        title: "Create Project Dashboard",
        project: "AI-PMS",
        status: "Review",
        reviewer: "Team Leader",
        feedback:
            "Please improve the responsive layout on smaller screens.",
    },
];

// ============================================================
// COMPONENT
// ============================================================

function ParticipateTechnicalReview() {
    const [taskId, setTaskId] = useState("");

    const [response, setResponse] = useState("");

    const [changesMade, setChangesMade] = useState("");

    const [successMessage, setSuccessMessage] =
        useState("");

    const [errorMessage, setErrorMessage] =
        useState("");

    const [submitting, setSubmitting] = useState(false);

    // ========================================================
    // SELECTED TASK
    // ========================================================

    const selectedTask = REVIEW_TASKS.find(
        (task) => String(task.id) === String(taskId)
    );

    // ========================================================
    // HANDLE RESUBMISSION
    // ========================================================

    const handleResubmit = async (event) => {
        event.preventDefault();

        setSuccessMessage("");
        setErrorMessage("");

        // ----------------------------------------------------
        // Validate task
        // ----------------------------------------------------

        if (!taskId) {
            setErrorMessage(
                "Please select a task under technical review."
            );

            return;
        }

        // ----------------------------------------------------
        // Validate changes
        // ----------------------------------------------------

        if (!changesMade.trim()) {
            setErrorMessage(
                "Please describe the changes made before resubmitting."
            );

            return;
        }

        // ----------------------------------------------------
        // Validate response
        // ----------------------------------------------------

        if (!response.trim()) {
            setErrorMessage(
                "Please provide a response to the review feedback."
            );

            return;
        }

        try {
            setSubmitting(true);

            // ------------------------------------------------
            // Frontend demonstration.
            // Backend API will be connected later.
            // ------------------------------------------------

            const reviewData = {
                taskId,
                taskTitle: selectedTask?.title,
                reviewer: selectedTask?.reviewer,
                reviewerFeedback: selectedTask?.feedback,
                developerResponse: response.trim(),
                changesMade: changesMade.trim(),
                status: "Review",
                resubmittedAt:
                    new Date().toISOString(),
            };

            console.log(
                "TECHNICAL REVIEW RESUBMISSION:",
                reviewData
            );

            // Simulate successful request
            await new Promise((resolve) =>
                setTimeout(resolve, 500)
            );

            setSuccessMessage(
                "Updated development work has been resubmitted for review."
            );

            setResponse("");
            setChangesMade("");
        } catch (error) {
            console.error(
                "Review resubmission failed:",
                error
            );

            setErrorMessage(
                "Unable to resubmit the work. Please try again."
            );
        } finally {
            setSubmitting(false);
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

            <div>
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                        <ClipboardCheck size={22} />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Participate in Technical Review
                        </h1>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Review feedback, make requested
                            changes, respond to reviewers, and
                            resubmit your development work.
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
                REVIEW TASK SELECTION
            ================================================== */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0d2340]">
                <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                        <FileCheck2 size={20} />
                    </div>

                    <div>
                        <h2 className="font-semibold text-slate-900 dark:text-white">
                            Review Request
                        </h2>

                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Select development work that has
                            received review feedback.
                        </p>
                    </div>
                </div>

                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
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
                        Select a task
                    </option>

                    {REVIEW_TASKS.map((task) => (
                        <option
                            key={task.id}
                            value={task.id}
                        >
                            {task.title} — {task.project}
                        </option>
                    ))}
                </select>
            </div>

            {/* ==================================================
                REVIEW FEEDBACK
            ================================================== */}

            {selectedTask && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900/40 dark:bg-amber-950/20">
                    <div className="mb-5 flex items-center gap-3">
                        <MessageSquareText
                            size={21}
                            className="text-amber-600 dark:text-amber-400"
                        />

                        <div>
                            <h2 className="font-semibold text-amber-900 dark:text-amber-300">
                                Reviewer Feedback
                            </h2>

                            <p className="text-sm text-amber-800/70 dark:text-amber-300/70">
                                Feedback that must be reviewed
                                before resubmission.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-amber-700 dark:text-amber-400">
                                Reviewer
                            </p>

                            <div className="mt-2 flex items-center gap-2">
                                <UserRound
                                    size={17}
                                    className="text-amber-600"
                                />

                                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                    {selectedTask.reviewer}
                                </p>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-amber-700 dark:text-amber-400">
                                Task Status
                            </p>

                            <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">
                                {selectedTask.status}
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 rounded-xl border border-amber-200 bg-white p-4 dark:border-amber-900/40 dark:bg-[#081b33]">
                        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            Requested Changes
                        </p>

                        <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">
                            {selectedTask.feedback}
                        </p>
                    </div>
                </div>
            )}

            {/* ==================================================
                RESUBMISSION FORM
            ================================================== */}

            <form
                onSubmit={handleResubmit}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0d2340]"
            >
                <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                        <RefreshCw size={20} />
                    </div>

                    <div>
                        <h2 className="font-semibold text-slate-900 dark:text-white">
                            Address Review Feedback
                        </h2>

                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Explain the changes made and
                            respond to the reviewer.
                        </p>
                    </div>
                </div>

                {/* ==================================================
                    CHANGES MADE
                ================================================== */}

                <div className="mb-5">
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Changes Made
                    </label>

                    <textarea
                        value={changesMade}
                        onChange={(event) =>
                            setChangesMade(
                                event.target.value
                            )
                        }
                        rows={6}
                        placeholder="Describe the changes you made to address the review feedback..."
                        className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-slate-700 dark:bg-[#081b33] dark:text-white"
                    />
                </div>

                {/* ==================================================
                    REVIEW RESPONSE
                ================================================== */}

                <div className="mb-6">
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Response to Reviewer
                    </label>

                    <textarea
                        value={response}
                        onChange={(event) =>
                            setResponse(
                                event.target.value
                            )
                        }
                        rows={6}
                        placeholder="Respond to the review feedback or explain any technical decisions..."
                        className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-slate-700 dark:bg-[#081b33] dark:text-white"
                    />
                </div>

                {/* ==================================================
                    SUBMIT
                ================================================== */}

                <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:focus:ring-offset-[#0d2340]"
                >
                    {submitting ? (
                        <>
                            <RefreshCw
                                size={18}
                                className="animate-spin"
                            />

                            Resubmitting...
                        </>
                    ) : (
                        <>
                            <Send size={18} />

                            Resubmit for Review
                        </>
                    )}
                </button>
            </form>

            {/* ==================================================
                REVIEW WORKFLOW
            ================================================== */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0d2340]">
                <h2 className="mb-5 font-semibold text-slate-900 dark:text-white">
                    Technical Review Workflow
                </h2>

                <div className="grid gap-3 md:grid-cols-4">
                    <div className="rounded-xl bg-slate-50 p-4 text-center dark:bg-[#081b33]">
                        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                            1
                        </div>

                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            Receive Feedback
                        </p>

                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Review comments and requested
                            changes.
                        </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4 text-center dark:bg-[#081b33]">
                        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                            2
                        </div>

                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            Make Changes
                        </p>

                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Update the implementation as
                            requested.
                        </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4 text-center dark:bg-[#081b33]">
                        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                            3
                        </div>

                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            Respond
                        </p>

                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Explain the changes and technical
                            decisions.
                        </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4 text-center dark:bg-[#081b33]">
                        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                            4
                        </div>

                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            Resubmit
                        </p>

                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Send the updated work for another
                            review.
                        </p>
                    </div>
                </div>
            </div>

            {/* ==================================================
                BUSINESS RULE
            ================================================== */}

            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-900/40 dark:bg-blue-950/20">
                <div className="flex items-start gap-3">
                    <CheckCircle2
                        size={20}
                        className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400"
                    />

                    <div>
                        <h2 className="font-semibold text-blue-900 dark:text-blue-300">
                            Review Participation Rule
                        </h2>

                        <p className="mt-1 text-sm leading-6 text-blue-800 dark:text-blue-300/80">
                            The Developer can address review
                            feedback, modify their work, respond
                            to comments, and resubmit it. Final
                            approval remains with the appropriate
                            reviewer or Manager.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ParticipateTechnicalReview;
