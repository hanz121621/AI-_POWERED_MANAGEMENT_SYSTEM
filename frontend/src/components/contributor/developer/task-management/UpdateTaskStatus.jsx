import { useEffect, useState } from "react";
import {
    CheckCircle2,
    Clock3,
    AlertTriangle,
    Send,
    X,
    Sparkles,  
    Loader2,
} from "lucide-react";

import api from "@/services/api";

const STATUS_OPTIONS = [
    "To Do",
    "In Progress",
    "Review",
    "Completed",
    "Blocked",
];

const BACKEND_STATUS_VALUES = {
    "To Do": 1,
    "In Progress": 2,
    Review: 3,
    Completed: 4,
    Blocked: 5,
};

function normalizeStatus(status) {
    if (typeof status === "number") {
        switch (status) {
            case 1:
                return "To Do";
            case 2:
                return "In Progress";
            case 3:
                return "Review";
            case 4:
                return "Completed";
            case 5:
                return "Blocked";
            default:
                return "To Do";
        }
    }

    if (typeof status === "string") {
        const value = status.trim().toLowerCase();

        switch (value) {
            case "todo":
            case "to do":
                return "To Do";

            case "inprogress":
            case "in progress":
                return "In Progress";

            case "inreview":
            case "in review":
            case "review":
                return "Review";

            case "completed":
            case "complete":
                return "Completed";

            case "blocked":
                return "Blocked";

            default:
                return "To Do";
        }
    }

    return "To Do";
}

function normalizeTask(task) {
    if (!task) {
        return null;
    }

    const estimatedHours = Number(
        task.estimatedHours ?? 0
    );

    const actualHours = Number(
        task.actualHours ?? 0
    );

    let progress = Number(task.progress);

    if (
        !Number.isFinite(progress) ||
        progress < 0 ||
        progress > 100
    ) {
        if (estimatedHours > 0) {
            progress = Math.min(
                100,
                Math.round(
                    (actualHours / estimatedHours) * 100
                )
            );
        } else {
            progress = 0;
        }
    }

    return {
        ...task,
        id: task.id,
        title: task.title || "Untitled Task",
        status: normalizeStatus(task.status),
        progress,
        progressNote:
            task.progressNote ||
            task.comment ||
            "",
    };
}

function getApiErrorMessage(error, fallback) {
    const responseData = error?.response?.data;

    if (typeof responseData === "string") {
        return responseData;
    }

    return (
        responseData?.message ||
        responseData?.error ||
        error?.message ||
        fallback
    );
}

export default function UpdateTaskStatus({
    task: externalTask,
    onUpdated,
    onClose,
}) {
    /*
     * null means the request is still loading.
     * [] means the request completed and there
     * are no assigned tasks.
     */
    const [tasks, setTasks] = useState(
        externalTask ? [] : null
    );

    const [selectedTaskId, setSelectedTaskId] =
        useState(externalTask?.id || "");

    const [status, setStatus] = useState(
        normalizeStatus(externalTask?.status)
    );

    const [progress, setProgress] = useState(
        externalTask?.progress ?? 0
    );

    const [note, setNote] = useState(
        externalTask?.progressNote ||
            externalTask?.comment ||
            ""
    );

    const [saving, setSaving] = useState(false);

      // ... existing state variables ...
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // 🌟 NEW: AI Enhancer State
    const [isEnhancing, setIsEnhancing] = useState(false);

    // 🌟 NEW: AI Enhancer Handler
    const handleAiEnhance = async () => {
        if (!note.trim()) {
            setError("Please type a brief note first (e.g., 'fixed the bug') so the AI can enhance it.");
            return;
        }

        setIsEnhancing(true);
        setError("");
        setSuccess("");

        try {
            const response = await api.post("/AITask/enhance-status-update", {
                taskTitle: activeTask?.title || "Task",
                currentStatus: status,
                briefNote: note
            });

            if (response.data?.success) {
                // 🌟 Replace the brief note with the AI-generated professional update
                // Note: Ensure 'generatedUpdate' matches the property name in your backend response
                const aiText = response.data.data?.generatedUpdate || response.data.data?.enhancedUpdate;
                if (aiText) {
                    setNote(aiText);
                    setSuccess("✨ AI has enhanced your note!");
                    setTimeout(() => setSuccess(""), 3000);
                }
            } else {
                setError(response.data?.message || "Failed to enhance note.");
            }
        } catch (requestError) {
            console.error("AI ENHANCE ERROR:", requestError);
            setError(getApiErrorMessage(requestError, "Failed to enhance note with AI."));
        } finally {
            setIsEnhancing(false);
        }
    };

    /*
     * Load the logged-in developer's assigned tasks
     * when the component is used without an external
     * task.
     */
    useEffect(() => {
        if (externalTask) {
            return undefined;
        }

        let cancelled = false;

        const loadTasks = async () => {
            try {
                const response = await api.get(
                    "/tasks/my-work"
                );

                if (cancelled) {
                    return;
                }

                /*
                 * The backend currently returns:
                 *
                 * Ok(tasks)
                 *
                 * but this also supports:
                 *
                 * { data: [...] }
                 */
                const data = Array.isArray(
                    response.data
                )
                    ? response.data
                    : Array.isArray(
                          response.data?.data
                      )
                      ? response.data.data
                      : [];

                const normalizedTasks = data
                    .map(normalizeTask)
                    .filter(Boolean);

                setTasks(normalizedTasks);

                if (normalizedTasks.length > 0) {
                    const firstTask =
                        normalizedTasks[0];

                    setSelectedTaskId(
                        firstTask.id
                    );

                    setStatus(
                        normalizeStatus(
                            firstTask.status
                        )
                    );

                    setProgress(
                        firstTask.progress ?? 0
                    );

                    setNote(
                        firstTask.progressNote ||
                            ""
                    );

                    setError("");
                }
            } catch (requestError) {
                if (cancelled) {
                    return;
                }

                console.error(
                    "UPDATE TASK STATUS - LOAD TASKS ERROR:",
                    requestError
                );

                setTasks([]);

                setError(
                    getApiErrorMessage(
                        requestError,
                        "Unable to load your assigned tasks."
                    )
                );
            }
        };

        loadTasks();

        return () => {
            cancelled = true;
        };
    }, [externalTask]);

    /*
     * Determine the task currently being edited.
     */
    const activeTask = externalTask
        ? normalizeTask(externalTask)
        : tasks?.find(
              (item) =>
                  item.id === selectedTaskId
          ) || tasks?.[0] || null;

    const loading =
        !externalTask && tasks === null;

    const handleTaskChange = (event) => {
        const taskId = event.target.value;

        setSelectedTaskId(taskId);
        setError("");
        setSuccess("");

        const selectedTask = tasks?.find(
            (item) => item.id === taskId
        );

        if (!selectedTask) {
            return;
        }

        setStatus(
            normalizeStatus(
                selectedTask.status
            )
        );

        setProgress(
            selectedTask.progress ?? 0
        );

        setNote(
            selectedTask.progressNote || ""
        );
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!activeTask) {
            setError(
                "There is no task assigned to you."
            );
            return;
        }

        if (!STATUS_OPTIONS.includes(status)) {
            setError(
                "This status change is not allowed."
            );
            return;
        }

        const numericProgress =
            Number(progress);

        if (
            !Number.isFinite(
                numericProgress
            ) ||
            numericProgress < 0 ||
            numericProgress > 100
        ) {
            setError(
                "Progress must be between 0 and 100."
            );
            return;
        }

        if (
            status === "Completed" &&
            numericProgress < 100
        ) {
            setError(
                "A completed task must have 100% progress."
            );
            return;
        }

        const backendStatus =
            BACKEND_STATUS_VALUES[status];

        if (!backendStatus) {
            setError(
                "Invalid task status."
            );
            return;
        }

        try {
            setSaving(true);

            const response = await api.put(
                `/tasks/${activeTask.id}/status`,
                {
                    status: backendStatus,
                    progressNote:
                        note.trim() || null,
                    comment:
                        note.trim() || null,
                }
            );

            const backendTask =
                response.data?.task ||
                response.data?.data ||
                response.data;

            const updatedTask =
                normalizeTask({
                    ...activeTask,
                    ...(backendTask || {}),
                    status,
                    progress:
                        numericProgress,
                    progressNote:
                        note.trim(),
                    updatedAt:
                        backendTask?.updatedAt ||
                        new Date().toISOString(),
                });

            setStatus(
                updatedTask.status
            );

            setProgress(
                updatedTask.progress
            );

            setNote(
                updatedTask.progressNote ||
                    ""
            );

            setTasks(
                (previousTasks) => {
                    if (!previousTasks) {
                        return previousTasks;
                    }

                    return previousTasks.map(
                        (item) =>
                            item.id ===
                            updatedTask.id
                                ? updatedTask
                                : item
                    );
                }
            );

            if (onUpdated) {
                onUpdated(updatedTask);
            }

            setSuccess(
                response.data?.message ||
                    "Task status updated successfully."
            );
        } catch (requestError) {
            console.error(
                "UPDATE TASK STATUS ERROR:",
                requestError
            );

            const statusCode =
                requestError?.response?.status;

            if (statusCode === 400) {
                setError(
                    getApiErrorMessage(
                        requestError,
                        "This status change is not allowed."
                    )
                );
            } else if (statusCode === 401) {
                setError(
                    "Your session has expired. Please log in again."
                );
            } else if (statusCode === 403) {
                setError(
                    "You cannot update this task."
                );
            } else if (statusCode === 404) {
                setError(
                    "Task not found."
                );
            } else if (statusCode === 409) {
                setError(
                    getApiErrorMessage(
                        requestError,
                        "This task cannot be modified."
                    )
                );
            } else {
                setError(
                    getApiErrorMessage(
                        requestError,
                        "Unable to update task status."
                    )
                );
            }
        } finally {
            setSaving(false);
        }
    };

    /*
     * Loading state
     */
    if (loading) {
        return (
            <div className="rounded-2xl border bg-white shadow-sm">
                <div className="border-b p-5">
                    <h2 className="text-xl font-bold text-slate-900">
                        Update Task Status
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Loading your assigned tasks...
                    </p>
                </div>

                <div className="p-6">
                    <div className="flex items-center gap-3 text-sm text-slate-500">
                        <Clock3 className="h-5 w-5 animate-pulse" />
                        Loading task information...
                    </div>
                </div>
            </div>
        );
    }

    /*
     * No assigned tasks or request failed.
     */
    if (!activeTask) {
        return (
            <div className="rounded-2xl border bg-white shadow-sm">
                <div className="border-b p-5">
                    <h2 className="text-xl font-bold text-slate-900">
                        Update Task Status
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Keep the current task status updated.
                    </p>
                </div>

                <div className="p-6">
                    <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
                        {error ||
                            "You currently have no assigned tasks."}
                    </div>
                </div>
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
                        {activeTask.title}
                    </p>
                </div>

                {onClose && (
                    <button
                        type="button"
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
                {tasks?.length > 1 &&
                    !externalTask && (
                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Select Task
                            </label>

                            <select
                                value={
                                    selectedTaskId ||
                                    tasks[0]?.id ||
                                    ""
                                }
                                onChange={
                                    handleTaskChange
                                }
                                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500"
                            >
                                {tasks.map(
                                    (item) => (
                                        <option
                                            key={
                                                item.id
                                            }
                                            value={
                                                item.id
                                            }
                                        >
                                            {
                                                item.title
                                            }
                                        </option>
                                    )
                                )}
                            </select>
                        </div>
                    )}

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
                        {STATUS_OPTIONS.map(
                            (option) => (
                                <button
                                    type="button"
                                    key={option}
                                    onClick={() =>
                                        setStatus(
                                            option
                                        )
                                    }
                                    disabled={
                                        saving
                                    }
                                    className={`flex items-center gap-3 rounded-lg border p-3 text-left transition ${
                                        status ===
                                        option
                                            ? "border-blue-600 bg-blue-50 text-blue-700"
                                            : "border-slate-200 hover:bg-slate-50"
                                    } ${
                                        saving
                                            ? "cursor-not-allowed opacity-60"
                                            : ""
                                    }`}
                                >
                                    {option ===
                                        "Completed" && (
                                        <CheckCircle2 className="h-5 w-5" />
                                    )}

                                    {option ===
                                        "In Progress" && (
                                        <Clock3 className="h-5 w-5" />
                                    )}

                                    {option ===
                                        "Blocked" && (
                                        <AlertTriangle className="h-5 w-5" />
                                    )}

                                    {[
                                        "To Do",
                                        "Review",
                                    ].includes(
                                        option
                                    ) && (
                                        <Clock3 className="h-5 w-5" />
                                    )}

                                    {option}
                                </button>
                            )
                        )}
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
                        onChange={(event) =>
                            setProgress(
                                event.target.value
                            )
                        }
                        disabled={saving}
                        className="w-full"
                    />

                    <input
                        type="number"
                        min="0"
                        max="100"
                        value={progress}
                        onChange={(event) =>
                            setProgress(
                                event.target.value
                            )
                        }
                        disabled={saving}
                        className="mt-3 w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500"
                    />
                </div>
                                               {/* ... (Previous code: Status buttons and Progress slider) ... */}

                               <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium">
                            Progress Note
                        </label>
                        
                        {/* 🌟 AI ENHANCE BUTTON (Available for ALL statuses) */}
                        <button
                            type="button"
                            onClick={handleAiEnhance}
                            disabled={isEnhancing || saving || !note.trim()}
                            className="flex items-center gap-1.5 text-xs font-semibold text-violet-600 hover:text-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isEnhancing ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                                <Sparkles className="h-3.5 w-3.5" />
                            )}
                            {isEnhancing ? "AI is writing..." : "✨ Enhance with AI"}
                        </button>
                    </div>

                    <textarea
                        value={note}
                        onChange={(event) => setNote(event.target.value)}
                        rows={4}
                        disabled={saving || isEnhancing}
                        placeholder="Add a brief note (e.g., 'fixed login bug') and click Enhance..."
                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 disabled:bg-slate-50"
                    />
                </div>

                {/* 🌟 AI BLOCKER ASSISTANT (Only shows when status is 'Blocked') */}
                {status === "Blocked" && (
                    <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/20">
                        <div className="mb-2 flex items-center justify-between">
                            <label className="text-sm font-bold text-red-700 dark:text-red-400">
                                🚨 Blocker Details & AI Help
                            </label>
                            
                            <button
                                type="button"
                                onClick={async () => {
                                    if (!note.trim()) {
                                        alert("Please describe your blocker in the note above first!");
                                        return;
                                    }
                                    try {
                                        const res = await api.post("/AITask/resolve-blocker", {
                                            taskTitle: activeTask?.title || "Task",
                                            taskDescription: activeTask?.description || "",
                                            blockerDescription: note
                                        });
                                        if (res.data?.success) {
                                            setNote(prev => prev + "\n\n--- AI TROUBLESHOOTING STEPS ---\n" + res.data.data.suggestions);
                                        }
                                    } catch (err) {
                                        console.error("AI Blocker Help Error:", err);
                                        alert("Failed to get AI help. Please try again.");
                                    }
                                }}
                                className="flex items-center gap-1.5 rounded-md bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700 transition-colors"
                            >
                                <Sparkles className="h-3.5 w-3.5" /> Get AI Help
                            </button>
                        </div>
                        <p className="text-xs text-red-600 dark:text-red-400">
                            Describe your error above, then click "Get AI Help" to get instant troubleshooting steps.
                        </p>
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={saving}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <Send className="h-4 w-4" />
                    {saving ? "Updating..." : "Update Status"}
                </button>
            </form>
        </div>
    );
}