// ============================================================
// AIPMS — TEAM LEADER UPDATE TASK STATUS
//
// Use Case:
// TASK-008 — Update Task Status
//
// Primary Actor:
// Team Leader
//
// Goal:
// Allow a Team Leader to update the status of a task
// under their responsibility.
//
// Supported statuses:
// - Not Started
// - In Progress
// - Blocked
// - In Review
// - Completed
//
// IMPORTANT:
// - Backend MUST enforce Team Leader authorization.
// - Backend MUST validate task/team/project/sprint relationships.
// - Backend MUST persist the status change.
// - Backend SHOULD create an activity/audit record.
// - Backend SHOULD notify affected contributors where required.
// - No localStorage is used.
// ============================================================

import React, { useEffect, useMemo, useState } from "react";

// ============================================================
// STATUS OPTIONS
// ============================================================

const STATUS_OPTIONS = [
    {
        value: "Not Started",
        description:
            "The task has not started yet.",
    },
    {
        value: "In Progress",
        description:
            "The task is currently being worked on.",
    },
    {
        value: "Blocked",
        description:
            "Work cannot continue because of a blocker.",
    },
    {
        value: "In Review",
        description:
            "The task is ready for review.",
    },
    {
        value: "Completed",
        description:
            "The task has been completed.",
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
    return (
        task?.title ??
        task?.taskTitle ??
        task?.name ??
        task?.Title ??
        "Untitled Task"
    );
};

const getCurrentStatus = (task) => {
    return (
        task?.status ??
        task?.taskStatus ??
        task?.Status ??
        task?.TaskStatus ??
        "Not Started"
    );
};

const getProjectName = (task) => {
    if (!task) return "No Project";

    if (typeof task.project === "string") {
        return task.project;
    }

    if (task.project?.name) {
        return task.project.name;
    }

    if (task.project?.title) {
        return task.project.title;
    }

    return (
        task.projectName ??
        task.projectTitle ??
        "No Project"
    );
};

const getSprintName = (task) => {
    if (!task) return "No Sprint";

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
        "No Sprint"
    );
};

const getAssigneeName = (task) => {
    if (!task) return "Unassigned";

    if (typeof task.assignedTo === "string") {
        return task.assignedTo;
    }

    if (task.assignedTo?.fullName) {
        return task.assignedTo.fullName;
    }

    if (task.assignee?.fullName) {
        return task.assignee.fullName;
    }

    if (task.assignedUser?.fullName) {
        return task.assignedUser.fullName;
    }

    return (
        task.assignedToName ??
        task.assigneeName ??
        task.assignedUserName ??
        "Unassigned"
    );
};

const normalizeStatus = (status) => {
    if (!status) {
        return "Not Started";
    }

    const normalized = String(status)
        .trim()
        .toLowerCase();

    const match = STATUS_OPTIONS.find(
        (option) =>
            option.value.toLowerCase() ===
            normalized
    );

    return match
        ? match.value
        : String(status);
};

// ============================================================
// STATUS BADGE
// ============================================================

function StatusBadge({ status }) {
    const normalized = String(
        status || ""
    ).toLowerCase();

    let classes =
        "bg-gray-100 text-gray-700";

    if (
        normalized.includes("completed") ||
        normalized.includes("done")
    ) {
        classes =
            "bg-green-100 text-green-700";
    } else if (
        normalized.includes("progress")
    ) {
        classes =
            "bg-blue-100 text-blue-700";
    } else if (
        normalized.includes("blocked")
    ) {
        classes =
            "bg-red-100 text-red-700";
    } else if (
        normalized.includes("review")
    ) {
        classes =
            "bg-purple-100 text-purple-700";
    }

    return (
        <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${classes}`}
        >
            {status}
        </span>
    );
}

// ============================================================
// COMPONENT
// ============================================================

export default function UpdateTaskStatus({
    task,

    isOpen = true,

    onClose,

    // Preferred callback.
    onStatusChange,

    // Generic compatibility callback.
    onUpdate,

    // Optional success callback.
    onSuccess,

    // Authorization state supplied by parent.
    canUpdateStatus = true,
}) {
    const [selectedStatus, setSelectedStatus] =
        useState(
            normalizeStatus(
                getCurrentStatus(task)
            )
        );

    const [reason, setReason] =
        useState("");

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [isSaving, setIsSaving] =
        useState(false);

    // ========================================================
    // RESET WHEN TASK CHANGES
    // ========================================================

    useEffect(() => {
        if (!task) {
            setSelectedStatus(
                "Not Started"
            );
            setReason("");
            setError("");
            setSuccess("");
            return;
        }

        setSelectedStatus(
            normalizeStatus(
                getCurrentStatus(task)
            )
        );

        setReason("");
        setError("");
        setSuccess("");
    }, [task]);

    // ========================================================
    // CURRENT STATUS
    // ========================================================

    const currentStatus = useMemo(
        () =>
            normalizeStatus(
                getCurrentStatus(task)
            ),
        [task]
    );

    // ========================================================
    // VALIDATION
    // ========================================================

    const validate = () => {
        if (!task) {
            return "No task has been selected.";
        }

        const taskId =
            getTaskId(task);

        if (!taskId) {
            return "The selected task does not have a valid task ID.";
        }

        if (!canUpdateStatus) {
            return "You are not authorized to update this task status.";
        }

        if (!selectedStatus) {
            return "Please select a task status.";
        }

        const validStatus =
            STATUS_OPTIONS.some(
                (option) =>
                    option.value ===
                    selectedStatus
            );

        if (!validStatus) {
            return "Please select a valid task status.";
        }

        if (
            selectedStatus ===
                currentStatus &&
            !reason.trim()
        ) {
            return "Please select a different status.";
        }

        if (
            reason.trim().length >
            1000
        ) {
            return "The status change reason cannot exceed 1000 characters.";
        }

        return "";
    };

    // ========================================================
    // SAVE
    // ========================================================

    const handleSubmit = async (
        event
    ) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        const validationError =
            validate();

        if (validationError) {
            setError(
                validationError
            );
            return;
        }

        const taskId =
            getTaskId(task);

        const statusUpdate = {
            taskId,
            status: selectedStatus,
            previousStatus:
                currentStatus,
            reason:
                reason.trim() || null,
        };

        try {
            setIsSaving(true);

            // ------------------------------------------------
            // Preferred callback
            // ------------------------------------------------

            if (onStatusChange) {
                await Promise.resolve(
                    onStatusChange(
                        task,
                        selectedStatus,
                        statusUpdate
                    )
                );
            }
            // ------------------------------------------------
            // Generic compatibility callback
            // ------------------------------------------------
            else if (onUpdate) {
                await Promise.resolve(
                    onUpdate(
                        task,
                        statusUpdate
                    )
                );
            } else {
                throw new Error(
                    "No task status update handler was provided."
                );
            }

            setSuccess(
                `Task status changed to "${selectedStatus}".`
            );

            if (onSuccess) {
                await Promise.resolve(
                    onSuccess(
                        task,
                        statusUpdate
                    )
                );
            }

            setTimeout(() => {
                if (onClose) {
                    onClose();
                }
            }, 700);
        } catch (err) {
            console.error(
                "Update Task Status Error:",
                err
            );

            setError(
                err?.response?.data?.message ??
                    err?.message ??
                    "Unable to update the task status. Please try again."
            );
        } finally {
            setIsSaving(false);
        }
    };

    // ========================================================
    // CLOSE
    // ========================================================

    const handleClose = () => {
        if (isSaving) return;

        setError("");
        setSuccess("");
        setReason("");

        if (onClose) {
            onClose();
        }
    };

    // ========================================================
    // MODAL STATE
    // ========================================================

    if (!isOpen) {
        return null;
    }

    // ========================================================
    // NO TASK
    // ========================================================

    if (!task) {
        return (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Update Task Status
                    </h2>

                    {onClose && (
                        <button
                            type="button"
                            onClick={
                                handleClose
                            }
                            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                        >
                            ×
                        </button>
                    )}
                </div>

                <p className="mt-4 text-sm text-gray-600">
                    No task has been selected.
                </p>
            </div>
        );
    }

    // ========================================================
    // UI
    // ========================================================

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-2xl">
                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="flex items-start justify-between border-b border-gray-200 px-6 py-5">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            Update Task Status
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Change the current status of
                            this team task.
                        </p>
                    </div>

                    {onClose && (
                        <button
                            type="button"
                            onClick={
                                handleClose
                            }
                            disabled={
                                isSaving
                            }
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

                {/* =================================================
                    TASK INFORMATION
                ================================================= */}

                <div className="border-b border-gray-200 bg-gray-50 px-6 py-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                Task
                            </p>

                            <h3 className="mt-1 break-words text-lg font-semibold text-gray-900">
                                {getTaskTitle(
                                    task
                                )}
                            </h3>

                            <p className="mt-1 text-xs text-gray-500">
                                ID:{" "}
                                {getTaskId(
                                    task
                                )}
                            </p>
                        </div>

                        <div className="shrink-0">
                            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
                                Current Status
                            </p>

                            <StatusBadge
                                status={
                                    currentStatus
                                }
                            />
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div>
                            <p className="text-xs text-gray-500">
                                Project
                            </p>

                            <p className="mt-1 text-sm font-medium text-gray-900">
                                {getProjectName(
                                    task
                                )}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-gray-500">
                                Sprint
                            </p>

                            <p className="mt-1 text-sm font-medium text-gray-900">
                                {getSprintName(
                                    task
                                )}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-gray-500">
                                Assigned To
                            </p>

                            <p className="mt-1 text-sm font-medium text-gray-900">
                                {getAssigneeName(
                                    task
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                {/* =================================================
                    FORM
                ================================================= */}

                <form
                    onSubmit={
                        handleSubmit
                    }
                    className="space-y-6 p-6"
                >
                    {/* Authorization */}
                    {!canUpdateStatus && (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                            <p className="text-sm font-medium text-red-700">
                                You are not authorized to
                                update this task's status.
                            </p>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div
                            role="alert"
                            className="rounded-lg border border-red-200 bg-red-50 p-4"
                        >
                            <p className="text-sm text-red-700">
                                {error}
                            </p>
                        </div>
                    )}

                    {/* Success */}
                    {success && (
                        <div
                            role="status"
                            className="rounded-lg border border-green-200 bg-green-50 p-4"
                        >
                            <p className="text-sm font-medium text-green-700">
                                {success}
                            </p>
                        </div>
                    )}

                    {/* =================================================
                        STATUS SELECT
                    ================================================= */}

                    <div>
                        <label
                            htmlFor="task-status"
                            className="mb-2 block text-sm font-semibold text-gray-900"
                        >
                            New Status
                        </label>

                        <select
                            id="task-status"
                            value={
                                selectedStatus
                            }
                            onChange={(
                                event
                            ) => {
                                setSelectedStatus(
                                    event
                                        .target
                                        .value
                                );
                                setError("");
                            }}
                            disabled={
                                isSaving ||
                                !canUpdateStatus
                            }
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                        >
                            {STATUS_OPTIONS.map(
                                (option) => (
                                    <option
                                        key={
                                            option.value
                                        }
                                        value={
                                            option.value
                                        }
                                    >
                                        {
                                            option.value
                                        }
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    {/* =================================================
                        STATUS CARDS
                    ================================================= */}

                    <div>
                        <p className="mb-3 text-sm font-semibold text-gray-900">
                            Select Status
                        </p>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {STATUS_OPTIONS.map(
                                (option) => {
                                    const isSelected =
                                        selectedStatus ===
                                        option.value;

                                    return (
                                        <button
                                            key={
                                                option.value
                                            }
                                            type="button"
                                            disabled={
                                                isSaving ||
                                                !canUpdateStatus
                                            }
                                            onClick={() => {
                                                setSelectedStatus(
                                                    option.value
                                                );
                                                setError(
                                                    ""
                                                );
                                            }}
                                            className={`rounded-lg border p-4 text-left transition ${
                                                isSelected
                                                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                                                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                                            } disabled:cursor-not-allowed disabled:opacity-60`}
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <StatusBadge
                                                    status={
                                                        option.value
                                                    }
                                                />

                                                {isSelected && (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-5 w-5 text-blue-600"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        strokeWidth={
                                                            2
                                                        }
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M5 13l4 4L19 7"
                                                        />
                                                    </svg>
                                                )}
                                            </div>

                                            <p className="mt-2 text-xs leading-5 text-gray-500">
                                                {
                                                    option.description
                                                }
                                            </p>
                                        </button>
                                    );
                                }
                            )}
                        </div>
                    </div>

                    {/* =================================================
                        REASON
                    ================================================= */}

                    <div>
                        <label
                            htmlFor="status-reason"
                            className="mb-2 block text-sm font-semibold text-gray-900"
                        >
                            Reason
                            <span className="ml-1 font-normal text-gray-400">
                                (optional)
                            </span>
                        </label>

                        <textarea
                            id="status-reason"
                            rows={4}
                            value={reason}
                            onChange={(
                                event
                            ) =>
                                setReason(
                                    event
                                        .target
                                        .value
                                )
                            }
                            maxLength={1000}
                            disabled={
                                isSaving ||
                                !canUpdateStatus
                            }
                            placeholder="Add a reason or note about this status change..."
                            className="w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                        />

                        <div className="mt-1 flex justify-end">
                            <span className="text-xs text-gray-400">
                                {reason.length}
                                /1000
                            </span>
                        </div>
                    </div>

                    {/* =================================================
                        CHANGE PREVIEW
                    ================================================= */}

                    {selectedStatus !==
                        currentStatus && (
                        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                                Status Change
                            </p>

                            <div className="mt-3 flex flex-wrap items-center gap-3">
                                <StatusBadge
                                    status={
                                        currentStatus
                                    }
                                />

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 text-blue-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={
                                        2
                                    }
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M13 5l7 7-7 7M5 12h14"
                                    />
                                </svg>

                                <StatusBadge
                                    status={
                                        selectedStatus
                                    }
                                />
                            </div>
                        </div>
                    )}

                    {/* =================================================
                        ACTIONS
                    ================================================= */}

                    <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end">
                        {onClose && (
                            <button
                                type="button"
                                onClick={
                                    handleClose
                                }
                                disabled={
                                    isSaving
                                }
                                className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        )}

                        <button
                            type="submit"
                            disabled={
                                isSaving ||
                                !canUpdateStatus ||
                                selectedStatus ===
                                    currentStatus
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isSaving && (
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
                            )}

                            {isSaving
                                ? "Updating..."
                                : "Update Status"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}