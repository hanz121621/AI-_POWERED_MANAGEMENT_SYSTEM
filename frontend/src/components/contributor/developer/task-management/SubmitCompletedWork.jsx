import { useState } from "react";
import {
    Send,
    FileText,
    Link as LinkIcon,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";

export default function SubmitCompletedWork({
    task,
    onSubmitted,
}) {
    const [completionNotes, setCompletionNotes] =
        useState("");

    const [workSummary, setWorkSummary] =
        useState("");

    const [relatedLink, setRelatedLink] =
        useState("");

    const [files, setFiles] = useState([]);

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

        if (!completionNotes.trim()) {
            setError(
                "Please provide required submission details."
            );
            return;
        }

        if (!workSummary.trim()) {
            setError(
                "Please provide a work summary."
            );
            return;
        }

        if (
            task.status === "Completed" ||
            task.status === "Closed"
        ) {
            setError(
                "This task cannot be submitted."
            );
            return;
        }

        const submission = {
            taskId: task.id,
            completionNotes:
                completionNotes.trim(),
            workSummary: workSummary.trim(),
            relatedLink: relatedLink.trim(),
            files,
            submittedAt:
                new Date().toISOString(),
            status: "Review",
        };

        if (onSubmitted) {
            onSubmitted(submission);
        }

        setSuccess(
            "Work submitted successfully for review."
        );
    };

    return (
        <div className="rounded-2xl border bg-white shadow-sm">

            <div className="border-b p-5">
                <h2 className="text-xl font-bold text-slate-900">
                    Submit Completed Work
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    Submit your completed work to the Team Leader for review.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-6 p-6"
            >
                {error && (
                    <div className="flex items-start gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-700">
                        <AlertCircle className="h-5 w-5" />
                        {error}
                    </div>
                )}

                {success && (
                    <div className="flex items-start gap-2 rounded-lg bg-green-50 p-4 text-sm text-green-700">
                        <CheckCircle2 className="h-5 w-5" />
                        {success}
                    </div>
                )}

                <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-500">
                        Task
                    </p>

                    <p className="mt-1 font-semibold text-slate-900">
                        {task?.title || "Selected task"}
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                        Current status:{" "}
                        {task?.status || "Unknown"}
                    </p>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Completion Notes *
                    </label>

                    <textarea
                        value={completionNotes}
                        onChange={(e) =>
                            setCompletionNotes(
                                e.target.value
                            )
                        }
                        rows={4}
                        placeholder="Describe what was completed..."
                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Work Summary *
                    </label>

                    <textarea
                        value={workSummary}
                        onChange={(e) =>
                            setWorkSummary(
                                e.target.value
                            )
                        }
                        rows={5}
                        placeholder="Provide a summary of your completed work..."
                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Related Link
                    </label>

                    <div className="relative">
                        <LinkIcon className="absolute left-3 top-3 h-5 w-5 text-slate-400" />

                        <input
                            type="url"
                            value={relatedLink}
                            onChange={(e) =>
                                setRelatedLink(
                                    e.target.value
                                )
                            }
                            placeholder="https://..."
                            className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Work Files
                    </label>

                    <label className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed border-slate-300 p-5 hover:bg-slate-50">
                        <FileText className="h-6 w-6 text-blue-600" />

                        <div>
                            <p className="text-sm font-medium">
                                Select work files
                            </p>

                            <p className="text-xs text-slate-500">
                                Upload documents or work results.
                            </p>
                        </div>

                        <input
                            type="file"
                            multiple
                            className="hidden"
                            onChange={(e) =>
                                setFiles(
                                    Array.from(
                                        e.target.files ||
                                            []
                                    )
                                )
                            }
                        />
                    </label>

                    {files.length > 0 && (
                        <div className="mt-3 space-y-2">
                            {files.map(
                                (file, index) => (
                                    <div
                                        key={`${file.name}-${index}`}
                                        className="rounded-lg bg-slate-50 px-3 py-2 text-sm"
                                    >
                                        {file.name}
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>

                <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-700">
                    After submission, the task will be sent to{" "}
                    <strong>Review</strong> and the Team Leader
                    will receive a review request.
                </div>

                <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700"
                >
                    <Send className="h-4 w-4" />
                    Submit Completed Work
                </button>
            </form>
        </div>
    );
}