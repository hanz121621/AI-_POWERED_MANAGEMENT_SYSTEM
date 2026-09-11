import React, { useEffect, useMemo, useState } from "react";
import api from "@/services/api";

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
    if (!task) return "Not specified";

    return (
        task.priority ??
        task.priorityName ??
        task.Priority ??
        "Not specified"
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

const getContributorId = (contributor) => {
    if (!contributor) return null;

    return (
        contributor.id ??
        contributor.userId ??
        contributor.contributorId ??
        contributor.Id ??
        contributor.UserId ??
        null
    );
};

const getContributorName = (contributor) => {
    if (!contributor) return "Unknown Contributor";

    if (contributor.fullName) {
        return contributor.fullName;
    }

    if (contributor.name) {
        return contributor.name;
    }

    if (contributor.user?.fullName) {
        return contributor.user.fullName;
    }

    return contributor.email ?? "Unnamed Contributor";
};

const getContributorRole = (contributor) => {
    if (!contributor) return "";

    return (
        contributor.role ??
        contributor.contributorType ??
        contributor.contributorTypeName ??
        contributor.user?.role ??
        contributor.user?.contributorType ??
        ""
    );
};

export default function AssignTaskToContributor({
    task = null,
    teamMembers = [],
    contributors = [],
    isOpen = true,
    onClose,
    onAssign,
    onSuccess,
    canAssign = true,
}) {
    const [selectedContributorId, setSelectedContributorId] =
        useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isAssigning, setIsAssigning] = useState(false);

    const availableMembers = useMemo(() => {
        const source =
            Array.isArray(teamMembers) && teamMembers.length > 0
                ? teamMembers
                : contributors;

        if (!Array.isArray(source)) {
            return [];
        }

        return source.filter((member) => {
            const role = String(getContributorRole(member))
                .trim()
                .toLowerCase();

            return role === "developer" || role === "staff";
        });
    }, [teamMembers, contributors]);

    const existingAssigneeId = useMemo(() => {
        if (!task) return "";

        const assigned =
            task.assignedTo ??
            task.assignee ??
            task.assignedUser ??
            null;

        if (typeof assigned === "string") {
            return assigned;
        }

        if (assigned && typeof assigned === "object") {
            return String(getContributorId(assigned) ?? "");
        }

        return String(
            task.assignedToId ??
            task.assigneeId ??
            task.assignedUserId ??
            task.assignedContributorId ??
            task.assignedContributorSDId ??
            ""
        );
    }, [task]);

    useEffect(() => {
        setError("");
        setSuccess("");
        setIsAssigning(false);
        setSelectedContributorId(existingAssigneeId);
    }, [task, existingAssigneeId]);

    const handleAssign = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        const taskId = getTaskId(task);

        if (!taskId) {
            setError(
                "The selected task does not have a valid task ID."
            );
            return;
        }

        if (!canAssign) {
            setError(
                "You are not authorized to assign this task."
            );
            return;
        }

        if (!selectedContributorId) {
            setError(
                "Please select a Developer or Staff contributor."
            );
            return;
        }

        const contributor = availableMembers.find(
            (member) =>
                String(getContributorId(member)) ===
                String(selectedContributorId)
        );

        if (!contributor) {
            setError(
                "The selected contributor is not available in your team."
            );
            return;
        }

        const contributorId = getContributorId(contributor);

        if (!contributorId) {
            setError(
                "The selected contributor does not have a valid user ID."
            );
            return;
        }

        const contributorRole = String(
            getContributorRole(contributor)
        )
            .trim()
            .toLowerCase();

        if (
            contributorRole !== "developer" &&
            contributorRole !== "staff"
        ) {
            setError(
                "Only Developer and Staff contributors can be assigned to this task."
            );
            return;
        }

        try {
            setIsAssigning(true);

            const response = await api.put(
                `/tasks/team-leader/${taskId}/assign/${contributorId}`
            );

            const responseTask =
                response?.data?.task ??
                response?.data ??
                task;

            const assignment = {
                taskId,
                contributorId,
                contributorRole: getContributorRole(contributor),
                contributorName: getContributorName(contributor),
            };

            if (onAssign) {
                await Promise.resolve(
                    onAssign(
                        responseTask,
                        contributor,
                        assignment
                    )
                );
            }

            setSuccess(
                `Task assigned successfully to ${getContributorName(
                    contributor
                )}.`
            );

            if (onSuccess) {
                await Promise.resolve(
                    onSuccess(
                        responseTask,
                        contributor,
                        assignment
                    )
                );
            }

            if (onClose) {
                setTimeout(() => {
                    onClose();
                }, 700);
            }
        } catch (err) {
            console.error(
                "Assign Task To Contributor Error:",
                err
            );

            const responseMessage =
                err?.response?.data?.message ??
                err?.response?.data?.error ??
                err?.response?.data?.title ??
                err?.message;

            setError(
                responseMessage ||
                "Unable to assign the task. Please try again."
            );
        } finally {
            setIsAssigning(false);
        }
    };

    if (!isOpen) {
        return null;
    }

    if (!task) {
        return (
            <div className="w-full rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                        !
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            Assign Task
                        </h2>

                        <p className="mt-1 text-sm text-gray-600">
                            Select a task before assigning it
                            to a contributor.
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
    const taskDescription = getTaskDescription(task);
    const taskPriority = getTaskPriority(task);
    const taskStatus = getTaskStatus(task);
    const taskSprint = getTaskSprint(task);

    return (
        <div className="w-full rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-6 py-5">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
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
                                    d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"
                                />
                                <circle
                                    cx="9"
                                    cy="7"
                                    r="4"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M19 8v6m3-3h-6"
                                />
                            </svg>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Assign Task to Contributor
                            </h2>

                            <p className="mt-1 text-sm text-gray-600">
                                Assign this task to a Developer
                                or Staff member on your team.
                            </p>
                        </div>
                    </div>

                    {onClose && (
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isAssigning}
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

            <div className="px-6 pt-6">
                <div className="rounded-lg border border-gray-200 bg-gray-50">
                    <div className="border-b border-gray-200 px-5 py-4">
                        <h3 className="font-semibold text-gray-900">
                            Task Information
                        </h3>
                    </div>

                    <div className="space-y-4 p-5">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                Task
                            </p>

                            <p className="mt-1 text-base font-semibold text-gray-900">
                                {taskTitle}
                            </p>
                        </div>

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

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                    Priority
                                </p>

                                <p className="mt-1 text-sm font-medium text-gray-900">
                                    {taskPriority}
                                </p>
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

            <form
                onSubmit={handleAssign}
                className="px-6 py-6"
            >
                <div className="space-y-5">
                    <div>
                        <label
                            htmlFor="task-contributor"
                            className="mb-2 block text-sm font-medium text-gray-900"
                        >
                            Assign To
                            <span className="ml-1 text-red-500">
                                *
                            </span>
                        </label>

                        <select
                            id="task-contributor"
                            value={selectedContributorId}
                            onChange={(event) => {
                                setSelectedContributorId(
                                    event.target.value
                                );
                                setError("");
                                setSuccess("");
                            }}
                            disabled={
                                isAssigning ||
                                !canAssign ||
                                availableMembers.length === 0
                            }
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                        >
                            <option value="">
                                Select Developer or Staff
                            </option>

                            {availableMembers.map((member) => {
                                const memberId =
                                    getContributorId(member);

                                if (!memberId) {
                                    return null;
                                }

                                return (
                                    <option
                                        key={memberId}
                                        value={memberId}
                                    >
                                        {getContributorName(member)}{" "}
                                        —{" "}
                                        {getContributorRole(member)}
                                    </option>
                                );
                            })}
                        </select>

                        {availableMembers.length === 0 && (
                            <p className="mt-2 text-sm text-amber-600">
                                No eligible Developer or Staff
                                contributors are currently
                                available on your team.
                            </p>
                        )}

                        <p className="mt-2 text-xs text-gray-500">
                            Only Developers and Staff can be
                            assigned through this Team Leader
                            operation.
                        </p>
                    </div>

                    {selectedContributorId && (
                        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                            {(() => {
                                const selected =
                                    availableMembers.find(
                                        (member) =>
                                            String(
                                                getContributorId(
                                                    member
                                                )
                                            ) ===
                                            String(
                                                selectedContributorId
                                            )
                                    );

                                if (!selected) {
                                    return null;
                                }

                                return (
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                                            {getContributorName(
                                                selected
                                            )
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>

                                        <div>
                                            <p className="text-sm font-semibold text-blue-900">
                                                {getContributorName(
                                                    selected
                                                )}
                                            </p>

                                            <p className="text-xs text-blue-700">
                                                {getContributorRole(
                                                    selected
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    )}

                    {error && (
                        <div
                            role="alert"
                            className="rounded-lg border border-red-200 bg-red-50 p-4"
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
                </div>

                <div className="mt-6 flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end">
                    {onClose && (
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isAssigning}
                            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    )}

                    <button
                        type="submit"
                        disabled={
                            isAssigning ||
                            !selectedContributorId ||
                            !canAssign ||
                            !taskId ||
                            availableMembers.length === 0
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isAssigning ? (
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

                                Assigning...
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
                                        d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"
                                    />

                                    <circle
                                        cx="9"
                                        cy="7"
                                        r="4"
                                    />

                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19 8v6m3-3h-6"
                                    />
                                </svg>

                                Assign Task
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}