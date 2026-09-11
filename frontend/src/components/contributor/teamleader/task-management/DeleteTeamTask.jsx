
import React, { useEffect, useState } from "react";
import {
    AlertCircle,
    CheckCircle2,
    CircleAlert,
    FileText,
    GitBranch,
    Loader2,
    MessageSquare,
    Paperclip,
    ShieldAlert,
    Trash2,
    Users,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
        task.name ??
        task.taskTitle ??
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

const getTaskAssignee = (task) => {
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

const getTaskDeadline = (task) => {
    if (!task) return null;

    return (
        task.deadline ??
        task.dueDate ??
        task.endDate ??
        null
    );
};

const formatDate = (value) => {
    if (!value) return "Not specified";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Not specified";
    }

    return date.toLocaleDateString();
};

const normalizeStatus = (status) => {
    if (!status) return "";

    return String(status)
        .trim()
        .toLowerCase()
        .replace(/[\s\_-]+/g, "");
};

const isCompletedOrLocked = (task) => {
    const status = normalizeStatus(
        task?.status ??
        task?.taskStatus ??
        task?.Status
    );

    return [
        "completed",
        "complete",
        "done",
        "closed",
        "locked",
        "archived",
    ].includes(status);
};

const getCollectionCount = (...values) => {
    for (const value of values) {
        if (Array.isArray(value)) {
            return value.length;
        }

        if (
            typeof value === "number" &&
            Number.isFinite(value)
        ) {
            return value;
        }
    }

    return 0;
};

const getTaskRelationshipInfo = (task) => {
    if (!task) {
        return {
            comments: 0,
            attachments: 0,
            subtasks: 0,
            dependencies: 0,
            dependentTasks: 0,
        };
    }

    return {
        comments: getCollectionCount(
            task.comments,
            task.commentCount,
            task.commentsCount,
            task.CommentsCount
        ),
        attachments: getCollectionCount(
            task.attachments,
            task.attachmentCount,
            task.attachmentsCount,
            task.AttachmentsCount
        ),
        subtasks: getCollectionCount(
            task.subtasks,
            task.subtaskCount,
            task.subtasksCount,
            task.SubtaskCount
        ),
        dependencies: getCollectionCount(
            task.dependencies,
            task.dependencyIds,
            task.dependencyCount,
            task.DependenciesCount
        ),
        dependentTasks: getCollectionCount(
            task.dependentTasks,
            task.dependents,
            task.dependentTaskCount,
            task.dependentsCount
        ),
    };
};

const getBackendErrorMessage = (error) => {
    return (
        error?.response?.data?.message ??
        error?.response?.data?.error ??
        error?.response?.data?.detail ??
        error?.response?.data?.title ??
        error?.message ??
        ""
    );
};

const mapDeleteError = (error) => {
    const status = error?.response?.status;
    const backendMessage = getBackendErrorMessage(error);
    const normalizedMessage = String(
        backendMessage
    ).toLowerCase();

    if (status === 404) {
        return "Task not found.";
    }

    if (status === 401 || status === 403) {
        return "You are not authorised to delete this task.";
    }

    if (
        normalizedMessage.includes("completed") ||
        normalizedMessage.includes("locked") ||
        normalizedMessage.includes("archive")
    ) {
        return "Completed tasks cannot be deleted. Archive the task instead.";
    }

    if (
        normalizedMessage.includes("depend") ||
        normalizedMessage.includes("dependent task")
    ) {
        return "This task cannot be deleted because other tasks depend on it.";
    }

    return (
        backendMessage ||
        "Unable to delete task. Please try again."
    );
};

export default function DeleteTeamTask({
    task = null,
    isOpen = true,
    onClose,
    onDelete,
    onSuccess,
    canDelete = true,
}) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        setIsDeleting(false);
        setError("");
        setSuccess("");
    }, [task]);

    if (!isOpen) {
        return null;
    }

    if (!task) {
        return (
            <div className="w-full rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 px-6 py-5">
                    <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                            <AlertCircle className="h-6 w-6" />
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Delete Task
                            </h2>

                            <p className="mt-1 text-sm text-gray-600">
                                Select a task before attempting to
                                delete it.
                            </p>
                        </div>
                    </div>
                </div>

                {onClose && (
                    <div className="flex justify-end border-t border-gray-200 px-6 py-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                        >
                            Close
                        </Button>
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
    const taskAssignee = getTaskAssignee(task);
    const taskDeadline = getTaskDeadline(task);
    const relationshipInfo =
        getTaskRelationshipInfo(task);

    const completedOrLocked =
        isCompletedOrLocked(task);

    const handleDelete = async () => {
        setError("");
        setSuccess("");

        if (!taskId) {
            setError("Task not found.");
            return;
        }

        if (completedOrLocked) {
            setError(
                "Completed tasks cannot be deleted. Archive the task instead."
            );
            return;
        }

        if (!canDelete) {
            setError(
                "You are not authorised to delete this task."
            );
            return;
        }

        try {
            setIsDeleting(true);

            const response = await api.delete(
                `/tasks/team-leader/${taskId}`
            );

            const message =
                response?.data?.message ??
                "Task deleted successfully.";

            setSuccess(message);

            if (onDelete) {
                await Promise.resolve(
                    onDelete(task, taskId)
                );
            }

            if (onSuccess) {
                await Promise.resolve(
                    onSuccess(task, taskId)
                );
            }

            if (onClose) {
                setTimeout(() => {
                    onClose();
                }, 700);
            }
        } catch (err) {
            console.error(
                "Delete Team Task Error:",
                err
            );

            setError(mapDeleteError(err));
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-task-title"
            className="w-full max-w-2xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
        >
            <div className="border-b border-gray-200 px-6 py-5">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                            <Trash2 className="h-5 w-5" />
                        </div>

                        <div>
                            <h2
                                id="delete-task-title"
                                className="text-xl font-semibold text-gray-900"
                            >
                                Delete Task
                            </h2>

                            <p className="mt-1 text-sm text-gray-600">
                                Confirm that you want to remove
                                this team-level task.
                            </p>
                        </div>
                    </div>

                    {onClose && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            disabled={isDeleting}
                            aria-label="Close delete task dialog"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    )}
                </div>
            </div>

            <div className="px-6 pt-6">
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                    <div className="flex gap-3">
                        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                        <div>
                            <p className="text-sm font-semibold text-red-800">
                                Are you sure you want to delete
                                this task?
                            </p>

                            <p className="mt-1 text-sm leading-6 text-red-700">
                                This action removes the task from
                                the active project and sprint
                                workflow. Related task information
                                will be validated by the system
                                before deletion.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-6 py-6">
                <div className="overflow-hidden rounded-lg border border-gray-200">
                    <div className="border-b border-gray-200 bg-gray-50 px-5 py-4">
                        <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-500" />

                            <h3 className="font-semibold text-gray-900">
                                Task Information
                            </h3>
                        </div>
                    </div>

                    <div className="space-y-5 p-5">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                Task Title
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

                                <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-gray-700">
                                    {taskDescription}
                                </p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="rounded-lg border border-gray-200 bg-white p-4">
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                    Priority
                                </p>

                                <p className="mt-1 text-sm font-semibold text-gray-900">
                                    {taskPriority}
                                </p>
                            </div>

                            <div className="rounded-lg border border-gray-200 bg-white p-4">
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                    Status
                                </p>

                                <p
                                    className={`mt-1 text-sm font-semibold ${
                                        completedOrLocked
                                            ? "text-red-600"
                                            : "text-gray-900"
                                    }`}
                                >
                                    {taskStatus}
                                </p>
                            </div>

                            <div className="rounded-lg border border-gray-200 bg-white p-4">
                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-gray-400" />

                                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                        Assigned To
                                    </p>
                                </div>

                                <p className="mt-1 text-sm font-semibold text-gray-900">
                                    {taskAssignee}
                                </p>
                            </div>

                            <div className="rounded-lg border border-gray-200 bg-white p-4">
                                <div className="flex items-center gap-2">
                                    <GitBranch className="h-4 w-4 text-gray-400" />

                                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                        Sprint
                                    </p>
                                </div>

                                <p className="mt-1 text-sm font-semibold text-gray-900">
                                    {taskSprint}
                                </p>
                            </div>

                            <div className="rounded-lg border border-gray-200 bg-white p-4">
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                    Deadline
                                </p>

                                <p className="mt-1 text-sm font-semibold text-gray-900">
                                    {formatDate(taskDeadline)}
                                </p>
                            </div>

                            <div className="rounded-lg border border-gray-200 bg-white p-4">
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                    Task ID
                                </p>

                                <p className="mt-1 break-all text-sm font-medium text-gray-700">
                                    {taskId}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-6 pb-6">
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <div className="mb-4 flex items-center gap-2">
                        <CircleAlert className="h-5 w-5 text-gray-500" />

                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">
                                Related Task Information
                            </h3>

                            <p className="text-xs text-gray-500">
                                The backend will perform the final
                                relationship checks before deletion.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <div className="rounded-lg border border-gray-200 bg-white p-3">
                            <div className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 text-gray-400" />

                                <span className="text-xs font-medium text-gray-500">
                                    Comments
                                </span>
                            </div>

                            <p className="mt-1 text-lg font-semibold text-gray-900">
                                {relationshipInfo.comments}
                            </p>
                        </div>

                        <div className="rounded-lg border border-gray-200 bg-white p-3">
                            <div className="flex items-center gap-2">
                                <Paperclip className="h-4 w-4 text-gray-400" />

                                <span className="text-xs font-medium text-gray-500">
                                    Attachments
                                </span>
                            </div>

                            <p className="mt-1 text-lg font-semibold text-gray-900">
                                {relationshipInfo.attachments}
                            </p>
                        </div>

                        <div className="rounded-lg border border-gray-200 bg-white p-3">
                            <div className="flex items-center gap-2">
                                <GitBranch className="h-4 w-4 text-gray-400" />

                                <span className="text-xs font-medium text-gray-500">
                                    Subtasks
                                </span>
                            </div>

                            <p className="mt-1 text-lg font-semibold text-gray-900">
                                {relationshipInfo.subtasks}
                            </p>
                        </div>

                        <div className="rounded-lg border border-gray-200 bg-white p-3">
                            <div className="flex items-center gap-2">
                                <GitBranch className="h-4 w-4 text-gray-400" />

                                <span className="text-xs font-medium text-gray-500">
                                    Dependencies
                                </span>
                            </div>

                            <p className="mt-1 text-lg font-semibold text-gray-900">
                                {relationshipInfo.dependencies}
                            </p>
                        </div>
                    </div>

                    {relationshipInfo.dependentTasks > 0 && (
                        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
                            <div className="flex gap-3">
                                <AlertCircle className="h-5 w-5 shrink-0 text-amber-600" />

                                <div>
                                    <p className="text-sm font-semibold text-amber-800">
                                        This task has dependent tasks.
                                    </p>

                                    <p className="mt-1 text-sm text-amber-700">
                                        {relationshipInfo.dependentTasks}{" "}
                                        task
                                        {relationshipInfo.dependentTasks !==
                                        1
                                            ? "s"
                                            : ""}{" "}
                                        depend on this task. The
                                        server may prevent deletion.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {completedOrLocked && (
                <div className="px-6 pb-6">
                    <div
                        role="alert"
                        className="rounded-lg border border-red-200 bg-red-50 p-4"
                    >
                        <div className="flex gap-3">
                            <ShieldAlert className="h-5 w-5 shrink-0 text-red-600" />

                            <div>
                                <p className="text-sm font-semibold text-red-800">
                                    Task cannot be deleted
                                </p>

                                <p className="mt-1 text-sm text-red-700">
                                    Completed tasks cannot be
                                    deleted. Archive the task
                                    instead.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {!canDelete && !completedOrLocked && (
                <div className="px-6 pb-6">
                    <div
                        role="alert"
                        className="rounded-lg border border-amber-200 bg-amber-50 p-4"
                    >
                        <div className="flex gap-3">
                            <ShieldAlert className="h-5 w-5 shrink-0 text-amber-600" />

                            <div>
                                <p className="text-sm font-semibold text-amber-800">
                                    Delete permission required
                                </p>

                                <p className="mt-1 text-sm text-amber-700">
                                    You are not authorised to
                                    delete this task.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <div className="px-6 pb-4">
                    <div
                        role="alert"
                        className="rounded-lg border border-red-200 bg-red-50 p-4"
                    >
                        <div className="flex gap-3">
                            <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />

                            <p className="text-sm leading-6 text-red-700">
                                {error}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {success && (
                <div className="px-6 pb-4">
                    <div
                        role="status"
                        className="rounded-lg border border-green-200 bg-green-50 p-4"
                    >
                        <div className="flex gap-3">
                            <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />

                            <p className="text-sm font-medium text-green-700">
                                {success}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col-reverse gap-3 border-t border-gray-200 bg-gray-50 px-6 py-5 sm:flex-row sm:justify-end">
                {onClose && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="min-w-24"
                    >
                        Cancel
                    </Button>
                )}

                <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={
                        isDeleting ||
                        !taskId ||
                        !canDelete ||
                        completedOrLocked ||
                        Boolean(success)
                    }
                    className="min-w-36"
                >
                    {isDeleting ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Deleting...
                        </>
                    ) : (
                        <>
                            <Trash2 className="h-4 w-4" />
                            Delete Task
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
