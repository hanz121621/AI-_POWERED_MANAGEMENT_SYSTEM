// ============================================================
// AIPMS — TEAM LEADER SET TASK PRIORITY
//
// Use Case:
// TASK-005 — Set Task Priority
//
// Primary Actor:
// Team Leader
//
// Goal:
// Allow a Team Leader to set or change the priority of a task
// that belongs to the Team Leader's responsibility.
//
// Supported priorities:
// - Low
// - Medium
// - High
// - Critical
//
// IMPORTANT:
// - Backend MUST perform the final authorization check.
// - Backend MUST verify that the task belongs to the
//   Team Leader's responsibility.
// - Backend MUST validate the task/project/sprint relationship.
// - Priority changes should be recorded in activity history.
// - No localStorage is used.
// ============================================================

import React, { useEffect, useMemo, useState } from "react";

// ============================================================
// PRIORITY OPTIONS
// ============================================================

const PRIORITY_OPTIONS = [
    {
        value: "Low",
        label: "Low",
        description:
            "Task can be completed after higher-priority work.",
    },
    {
        value: "Medium",
        label: "Medium",
        description:
            "Normal priority for regular team work.",
    },
    {
        value: "High",
        label: "High",
        description:
            "Task requires attention before normal-priority work.",
    },
    {
        value: "Critical",
        label: "Critical",
        description:
            "Urgent task requiring immediate attention.",
    },
];

// ============================================================
// HELPERS
// ============================================================

const getTaskId = (task) => {
    if (!task) return null;

    return (
        task.id ??
        task.taskId ??
        task.Id ??
        task.TaskId ??
        null
    );
};

const getTaskTitle = (task) => {
    if (!task) return "Untitled Task";

    return (
        task.title ??
        task.taskTitle ??
        task.name ??
        task.Title ??
        "Untitled Task"
    );
};

const getTaskDescription = (task) => {
    if (!task) return "";

    return (
        task.description ??
        task.taskDescription ??
        task.Description ??
        ""
    );
};

const getTaskPriority = (task) => {
    if (!task) return "";

    return (
        task.priority ??
        task.priorityName ??
        task.Priority ??
        ""
    );
};

const getTaskStatus = (task) => {
    if (!task) return "Not specified";

    return (
        task.status ??
        task.taskStatus ??
        task.Status ??
        "Not specified"
    );
};

const getTaskSprint = (task) => {
    if (!task) return "Not specified";

    if (typeof task.sprint === "string") {
        return task.sprint;
    }

    if (task.sprint?.name) {
        return task.sprint.name;
    }

    if (task.sprint?.title) {
        return task.sprint.title;
    }

    return (
        task.sprintName ??
        task.sprintTitle ??
        "Not specified"
    );
};

const normalizePriority = (value) => {
    if (!value) return "";

    const normalized = String(value)
        .trim()
        .toLowerCase();

    const match = PRIORITY_OPTIONS.find(
        (option) =>
            option.value.toLowerCase() ===
            normalized
    );

    return match ? match.value : "";
};

// ============================================================
// COMPONENT
// ============================================================

export default function SetTaskPriority({
    task = null,

    isOpen = true,

    onClose,

    // Parent callback responsible for persistence.
    onPriorityChange,

    // Alternative callback name supported for flexibility.
    onUpdate,

    // Optional success callback.
    onSuccess,

    // Frontend authorization guard.
    canSetPriority = true,
}) {
    const [selectedPriority, setSelectedPriority] =
        useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    // --------------------------------------------------------
    // Determine current priority.
    // --------------------------------------------------------

    const currentPriority = useMemo(() => {
        return normalizePriority(
            getTaskPriority(task)
        );
    }, [task]);

    // --------------------------------------------------------
    // Reset when task changes.
    // --------------------------------------------------------

    useEffect(() => {
        setSelectedPriority(currentPriority);
        setError("");
        setSuccess("");
        setIsSaving(false);
    }, [currentPriority, task]);

    // ========================================================
    // CHANGE HANDLER
    // ========================================================

    const handlePriorityChange = (event) => {
        setSelectedPriority(event.target.value);
        setError("");
        setSuccess("");
    };

    // ========================================================
    // SAVE HANDLER
    // ========================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        const taskId = getTaskId(task);

        // ----------------------------------------------------
        // Validate task.
        // ----------------------------------------------------

        if (!taskId) {
            setError(
                "The selected task does not have a valid task ID."
            );
            return;
        }

        // ----------------------------------------------------
        // Validate authorization.
        // ----------------------------------------------------

        if (!canSetPriority) {
            setError(
                "You are not authorized to change this task's priority."
            );
            return;
        }

        // ----------------------------------------------------
        // Validate priority.
        // ----------------------------------------------------

        if (!selectedPriority) {
            setError(
                "Please select a task priority."
            );
            return;
        }

        const validPriority =
            PRIORITY_OPTIONS.some(
                (option) =>
                    option.value ===
                    selectedPriority
            );

        if (!validPriority) {
            setError(
                "The selected priority is invalid."
            );
            return;
        }

        // ----------------------------------------------------
        // Prevent unnecessary update.
        // ----------------------------------------------------

        if (
            currentPriority &&
            currentPriority === selectedPriority
        ) {
            setError(
                "The task already has this priority."
            );
            return;
        }

        const callback =
            onPriorityChange ?? onUpdate;

        if (!callback) {
            setError(
                "Task priority update is not connected to the task management service."
            );
            return;
        }

        // ----------------------------------------------------
        // Payload.
        // ----------------------------------------------------

        const priorityUpdate = {
            taskId,
            priority: selectedPriority,
            previousPriority:
                currentPriority || null,
        };

        // ----------------------------------------------------
        // Persist change.
        // ----------------------------------------------------

        try {
            setIsSaving(true);

            // The parent/backend should perform:
            //
            // 1. Authentication
            // 2. Team Leader authorization
            // 3. Task existence validation
            // 4. Project relationship validation
            // 5. Sprint relationship validation
            // 6. Team responsibility validation
            // 7. Priority validation
            // 8. Database update
            // 9. Activity/audit logging
            // 10. Notification where applicable

            await Promise.resolve(
                callback(
                    task,
                    selectedPriority,
                    priorityUpdate
                )
            );

            setSuccess(
                `Task priority updated to ${selectedPriority}.`
            );

            if (onSuccess) {
                await Promise.resolve(
                    onSuccess(
                        task,
                        selectedPriority,
                        priorityUpdate
                    )
                );
            }

            // Close after successful update.
            if (onClose) {
                setTimeout(() => {
                    onClose();
                }, 700);
            }
        } catch (err) {
            console.error(
                "Set Task Priority Error:",
                err
            );

            const responseMessage =
                err?.response?.data?.message ??
                err?.response?.data?.error ??
                err?.message;

            setError(
                responseMessage ||
                    "Unable to update task priority. Please try again."
            );
        } finally {
            setIsSaving(false);
        }
    };

    // ========================================================
    // CLOSED STATE
    // ========================================================

    if (!isOpen) {
        return null;
    }

    // ========================================================
    // NO TASK SELECTED
    // ========================================================

    if (!task) {
        return (
            <div className="w-full rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                        !
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            Set Task Priority
                        </h2>

                        <p className="mt-1 text-sm text-gray-600">
                            Select a task before changing
                            its priority.
                        </p>
                    </div>
                </div>

                {onClose && (
                    <div className="mt-6 flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                            Close
                        </button>
                    </div>
                )}
            </div>
        );
    }

    const taskId = getTaskId(task);
    const taskTitle = getTaskTitle(task);
    const taskDescription =
        getTaskDescription(task);
    const taskStatus = getTaskStatus(task);
    const taskSprint = getTaskSprint(task);

    // ========================================================
    // UI
    // ========================================================

    return (
        <div className="w-full rounded-xl border border-gray-200 bg-white shadow-sm">
            {/* =================================================
                HEADER
            ================================================= */}

            <div className="border-b border-gray-200 px-6 py-5">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3 7h18M3 12h18M3 17h18"
                                />
                            </svg>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Set Task Priority
                            </h2>

                            <p className="mt-1 text-sm text-gray-600">
                                Set the urgency level for
                                this team task.
                            </p>
                        </div>
                    </div>

                    {onClose && (
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSaving}
                            aria-label="Close"
                            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {/* =================================================
                TASK INFORMATION
            ================================================= */}

            <div className="px-6 pt-6">
                <div className="rounded-lg border border-gray-200 bg-gray-50">
                    <div className="border-b border-gray-200 px-5 py-4">
                        <h3 className="font-semibold text-gray-900">
                            Task Information
                        </h3>
                    </div>

                    <div className="space-y-4 p-5">
                        {/* Task title */}
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                Task
                            </p>

                            <p className="mt-1 text-base font-semibold text-gray-900">
                                {taskTitle}
                            </p>
                        </div>

                        {/* Description */}
                        {taskDescription && (
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                    Description
                                </p>

                                <p className="mt-1 line-clamp-3 text-sm text-gray-700">
                                    {taskDescription}
                                </p>
                            </div>
                        )}

                        {/* Metadata */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                    Current Priority
                                </p>

                                <div className="mt-1">
                                    {currentPriority ? (
                                        <span
                                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                currentPriority ===
                                                "Critical"
                                                    ? "bg-red-100 text-red-700"
                                                    : currentPriority ===
                                                        "High"
                                                      ? "bg-orange-100 text-orange-700"
                                                      : currentPriority ===
                                                          "Medium"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-gray-100 text-gray-700"
                                            }`}
                                        >
                                            {currentPriority}
                                        </span>
                                    ) : (
                                        <span className="text-sm text-gray-500">
                                            Not specified
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                    Status
                                </p>

                                <p className="mt-1 text-sm font-medium text-gray-900">
                                    {taskStatus}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                    Sprint
                                </p>

                                <p className="mt-1 text-sm font-medium text-gray-900">
                                    {taskSprint}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* =================================================
                FORM
            ================================================= */}

            <form
                onSubmit={handleSubmit}
                className="px-6 py-6"
            >
                <div>
                    <label
                        htmlFor="task-priority"
                        className="mb-2 block text-sm font-medium text-gray-900"
                    >
                        Task Priority
                        <span className="ml-1 text-red-500">
                            *
                        </span>
                    </label>

                    <select
                        id="task-priority"
                        value={selectedPriority}
                        onChange={handlePriorityChange}
                        disabled={
                            isSaving ||
                            !canSetPriority
                        }
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                    >
                        <option value="">
                            Select priority
                        </option>

                        {PRIORITY_OPTIONS.map(
                            (option) => (
                                <option
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </option>
                            )
                        )}
                    </select>
                </div>

                {/* =================================================
                    PRIORITY OPTIONS
                ================================================= */}

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {PRIORITY_OPTIONS.map(
                        (option) => {
                            const isSelected =
                                selectedPriority ===
                                option.value;

                            return (
                                <button
                                    key={
                                        option.value
                                    }
                                    type="button"
                                    onClick={() => {
                                        setSelectedPriority(
                                            option.value
                                        );
                                        setError("");
                                        setSuccess("");
                                    }}
                                    disabled={isSaving}
                                    className={`rounded-lg border p-4 text-left transition ${
                                        isSelected
                                            ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                                            : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                                    } disabled:cursor-not-allowed disabled:opacity-60`}
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <span
                                            className={`text-sm font-semibold ${
                                                option.value ===
                                                "Critical"
                                                    ? "text-red-700"
                                                    : option.value ===
                                                        "High"
                                                      ? "text-orange-700"
                                                      : option.value ===
                                                          "Medium"
                                                        ? "text-yellow-700"
                                                        : "text-gray-700"
                                            }`}
                                        >
                                            {option.label}
                                        </span>

                                        {isSelected && (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 text-blue-600"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        )}
                                    </div>

                                    <p className="mt-1 text-xs text-gray-500">
                                        {
                                            option.description
                                        }
                                    </p>
                                </button>
                            );
                        }
                    )}
                </div>

                {/* =================================================
                    CHANGE PREVIEW
                ================================================= */}

                {selectedPriority &&
                    selectedPriority !==
                        currentPriority && (
                        <div className="mt-5 rounded-lg border border-blue-200 bg-blue-50 p-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-blue-600">
                                Priority Change
                            </p>

                            <div className="mt-2 flex items-center gap-3">
                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                                    {currentPriority ||
                                        "Not set"}
                                </span>

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 text-blue-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5 12h14m-6-6l6 6-6 6"
                                    />
                                </svg>

                                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                                    {selectedPriority}
                                </span>
                            </div>
                        </div>
                    )}

                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (
                    <div
                        role="alert"
                        className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4"
                    >
                        <div className="flex gap-3">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 shrink-0 text-red-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>

                            <p className="text-sm text-red-700">
                                {error}
                            </p>
                        </div>
                    </div>
                )}

                {/* =================================================
                    SUCCESS
                ================================================= */}

                {success && (
                    <div
                        role="status"
                        className="mt-5 rounded-lg border border-green-200 bg-green-50 p-4"
                    >
                        <p className="text-sm font-medium text-green-700">
                            {success}
                        </p>
                    </div>
                )}

                {/* =================================================
                    ACTIONS
                ================================================= */}

                <div className="mt-6 flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end">
                    {onClose && (
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSaving}
                            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    )}

                    <button
                        type="submit"
                        disabled={
                            isSaving ||
                            !selectedPriority ||
                            !taskId ||
                            !canSetPriority ||
                            selectedPriority ===
                                currentPriority
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSaving ? (
                            <>
                                <svg
                                    className="h-4 w-4 animate-spin"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />

                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                    />
                                </svg>

                                Saving...
                            </>
                        ) : (
                            <>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>

                                Save Priority
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}