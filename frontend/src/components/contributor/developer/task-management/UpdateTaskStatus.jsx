import { useState } from "react";
import {
    CheckCircle2,
    Clock3,
    AlertTriangle,
    Send,
    X,
} from "lucide-react";

const STATUS_OPTIONS = [
    "To Do",
    "In Progress",
    "Review",
    "Completed",
    "Blocked",
];

export default function UpdateTaskStatus({
    task,
    onUpdated,
    onClose,
}) {
    const [status, setStatus] = useState(task?.status || "To Do");
    const [progress, setProgress] = useState(
        task?.progress || 0
    );
    const [note, setNote] = useState("");
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

        if (!STATUS_OPTIONS.includes(status)) {
            setError("This status change is not allowed.");
            return;
        }

        if (progress < 0 || progress > 100) {
            setError("Progress must be between 0 and 100.");
            return;
        }

        if (
            status === "Completed" &&
            progress < 100
        ) {
            setError(
                "A completed task must have 100% progress."
            );
            return;
        }

        const updatedTask = {
            ...task,
            status,
            progress: Number(progress),
            progressNote: note.trim(),
            updatedAt: new Date().toISOString(),
        };

        if (onUpdated) {
            onUpdated(updatedTask);
        }

        setSuccess(
            "Task status updated successfully."
        );
    };

    if (!task) {
        return (
            <div className="rounded-xl border bg-white p-6">
                <p className="text-red-600">
                    Unable to load task information.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border bg-white shadow-sm">

            <div className="flex items-center justify-between border-b p-5">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">
                        Update Task Status
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        {task.title}
                    </p>
                </div>

                {onClose && (
                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 hover:bg-slate-100"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-6 p-6"
            >
                {error && (
                    <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700">
                        {success}
                    </div>
                )}

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Task Status
                    </label>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {STATUS_OPTIONS.map((option) => (
                            <button
                                type="button"
                                key={option}
                                onClick={() =>
                                    setStatus(option)
                                }
                                className={`flex items-center gap-3 rounded-lg border p-3 text-left transition ${
                                    status === option
                                        ? "border-blue-600 bg-blue-50 text-blue-700"
                                        : "border-slate-200 hover:bg-slate-50"
                                }`}
                            >
                                {option === "Completed" && (
                                    <CheckCircle2 className="h-5 w-5" />
                                )}

                                {option === "In Progress" && (
                                    <Clock3 className="h-5 w-5" />
                                )}

                                {option === "Blocked" && (
                                    <AlertTriangle className="h-5 w-5" />
                                )}

                                {![
                                    "Completed",
                                    "In Progress",
                                    "Blocked",
                                ].includes(option) && (
                                    <Clock3 className="h-5 w-5" />
                                )}

                                {option}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <div className="mb-2 flex justify-between">
                        <label className="text-sm font-medium">
                            Progress
                        </label>

                        <span className="text-sm font-semibold">
                            {progress}%
                        </span>
                    </div>

                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={progress}
                        onChange={(e) =>
                            setProgress(e.target.value)
                        }
                        className="w-full"
                    />

                    <input
                        type="number"
                        min="0"
                        max="100"
                        value={progress}
                        onChange={(e) =>
                            setProgress(e.target.value)
                        }
                        className="mt-3 w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Progress Note
                    </label>

                    <textarea
                        value={note}
                        onChange={(e) =>
                            setNote(e.target.value)
                        }
                        rows={4}
                        placeholder="Add a progress note or explanation..."
                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700"
                >
                    <Send className="h-4 w-4" />
                    Update Status
                </button>
            </form>
        </div>
    );
}