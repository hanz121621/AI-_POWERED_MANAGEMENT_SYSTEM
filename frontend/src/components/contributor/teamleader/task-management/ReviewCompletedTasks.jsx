
import React, { useEffect, useMemo, useState } from "react";
import {
    AlertCircle,
    CheckCircle2,
    Eye,
    Filter,
    Loader2,
    MessageSquare,
    RefreshCw,
    Search,
    X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import api from "@/services/api";

const REVIEW_OPTIONS = [
    "Approved",
    "Changes Requested",
];

const normalizeValue = (value) => {
    if (value === null || value === undefined) {
        return "";
    }

    return String(value).trim();
};

const getTaskId = (task) =>
    task?.id ??
    task?.Id ??
    task?.taskId ??
    task?.TaskId ??
    "";

const getTaskTitle = (task) =>
    task?.title ??
    task?.Title ??
    task?.taskTitle ??
    task?.TaskTitle ??
    "Untitled Task";

const getDescription = (task) =>
    task?.description ??
    task?.Description ??
    "";

const getProjectName = (task) =>
    task?.projectName ??
    task?.ProjectName ??
    task?.project?.name ??
    task?.Project?.Name ??
    task?.project ??
    task?.Project ??
    "No Project";

const getSprintName = (task) =>
    task?.sprintName ??
    task?.SprintName ??
    task?.sprint?.name ??
    task?.Sprint?.Name ??
    task?.sprint ??
    task?.Sprint ??
    "No Sprint";

const getAssigneeName = (task) =>
    task?.assignedContributorName ??
    task?.AssignedContributorName ??
    task?.contributorName ??
    task?.ContributorName ??
    task?.assignedContributor?.fullName ??
    task?.AssignedContributor?.FullName ??
    task?.assignedContributor?.name ??
    task?.AssignedContributor?.Name ??
    "Unassigned";

const getPriority = (task) =>
    task?.priority ??
    task?.Priority ??
    "Medium";

const getDeadline = (task) =>
    task?.dueDate ??
    task?.DueDate ??
    task?.deadline ??
    task?.Deadline ??
    null;

const getCompletedAt = (task) =>
    task?.completedAt ??
    task?.CompletedAt ??
    task?.completionDate ??
    task?.CompletionDate ??
    task?.updatedAt ??
    task?.UpdatedAt ??
    null;

const getProgress = (task) => {
    const value =
        task?.progress ??
        task?.Progress ??
        task?.completionPercentage ??
        task?.CompletionPercentage ??
        100;

    const number = Number(value);

    if (Number.isNaN(number)) {
        return 100;
    }

    return Math.min(100, Math.max(0, number));
};

const getReviewStatus = (task) =>
    task?.reviewStatus ??
    task?.ReviewStatus ??
    "";

const getReviewComment = (task) =>
    task?.reviewComment ??
    task?.ReviewComment ??
    task?.comment ??
    task?.Comment ??
    "";

const getStatus = (task) =>
    task?.status ??
    task?.Status ??
    task?.taskStatus ??
    task?.TaskStatus ??
    "";

const isCompleted = (task) => {
    const status = getStatus(task);

    if (typeof status === "number") {
        return status === 4;
    }

    const normalized = normalizeValue(status).toLowerCase();

    return [
        "completed",
        "complete",
        "done",
        "4",
    ].includes(normalized);
};

const isApproved = (task) => {
    const status = normalizeValue(
        getReviewStatus(task)
    ).toLowerCase();

    return status === "approved";
};

const isChangesRequested = (task) => {
    const status = normalizeValue(
        getReviewStatus(task)
    ).toLowerCase();

    return (
        status === "changes requested" ||
        status === "changesrequested" ||
        status === "needs revision" ||
        status === "needsrevision" ||
        status === "rejected"
    );
};

const normalizeTasks = (value) => {
    if (Array.isArray(value)) {
        return value;
    }

    if (Array.isArray(value?.tasks)) {
        return value.tasks;
    }

    if (Array.isArray(value?.Tasks)) {
        return value.Tasks;
    }

    if (Array.isArray(value?.data)) {
        return value.data;
    }

    if (Array.isArray(value?.data?.tasks)) {
        return value.data.tasks;
    }

    if (Array.isArray(value?.data?.Tasks)) {
        return value.data.Tasks;
    }

    return [];
};

const formatDate = (value) => {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return normalizeValue(value);
    }

    return date.toLocaleDateString();
};

const formatDateTime = (value) => {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return normalizeValue(value);
    }

    return date.toLocaleString();
};

const getReviewBadgeClasses = (status) => {
    const value = normalizeValue(status).toLowerCase();

    if (value === "approved") {
        return "bg-green-100 text-green-700";
    }

    if (
        value.includes("change") ||
        value.includes("revision") ||
        value.includes("reject")
    ) {
        return "bg-red-100 text-red-700";
    }

    return "bg-yellow-100 text-yellow-700";
};

function ReviewBadge({ status }) {
    const value = normalizeValue(status);

    if (!value) {
        return (
            <span className="inline-flex rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-semibold text-yellow-700">
                Pending Review
            </span>
        );
    }

    return (
        <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getReviewBadgeClasses(
                value
            )}`}
        >
            {value}
        </span>
    );
}

export default function ReviewCompletedTasks({
    tasks: initialTasks = [],
    sprintId,
    loadTasks,
    onRefresh,
    onReview,
    onTaskSelect,
    canReview = true,
}) {
    const [tasks, setTasks] = useState(
        normalizeTasks(initialTasks)
    );

    const [searchTerm, setSearchTerm] =
        useState("");

    const [projectFilter, setProjectFilter] =
        useState("all");

    const [sprintFilter, setSprintFilter] =
        useState("all");

    const [reviewFilter, setReviewFilter] =
        useState("all");

    const [selectedTask, setSelectedTask] =
        useState(null);

    const [reviewDecision, setReviewDecision] =
        useState("Approved");

    const [reviewComment, setReviewComment] =
        useState("");

    const [showReview, setShowReview] =
        useState(false);

    const [showDetails, setShowDetails] =
        useState(false);

    const [isLoading, setIsLoading] =
        useState(false);

    const [isSaving, setIsSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    useEffect(() => {
        setTasks(
            normalizeTasks(initialTasks)
        );
    }, [initialTasks]);

    const refreshTasks = async () => {
        setError("");
        setSuccess("");

        try {
            setIsLoading(true);

            let result;

            if (loadTasks) {
                result = await Promise.resolve(
                    loadTasks()
                );
            } else if (sprintId) {
                const response = await api.get(
                    `/tasks/team-leader/sprint/${sprintId}`
                );

                result = response?.data;
            } else if (onRefresh) {
                result = await Promise.resolve(
                    onRefresh()
                );
            }

            if (result !== undefined) {
                setTasks(
                    normalizeTasks(result)
                );
            }

            setSuccess(
                "Completed tasks refreshed."
            );

            setTimeout(() => {
                setSuccess("");
            }, 2000);
        } catch (err) {
            setError(
                err?.response?.data?.message ??
                    err?.message ??
                    "Unable to load completed tasks."
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (sprintId && !loadTasks) {
            refreshTasks();
        }
    }, [sprintId]);

    const completedTasks = useMemo(() => {
        return tasks.filter(
            (task) => isCompleted(task)
        );
    }, [tasks]);

    const projectOptions = useMemo(() => {
        return [
            ...new Set(
                completedTasks
                    .map(getProjectName)
                    .filter(
                        (value) =>
                            value !== "No Project"
                    )
            ),
        ].sort();
    }, [completedTasks]);

    const sprintOptions = useMemo(() => {
        return [
            ...new Set(
                completedTasks
                    .map(getSprintName)
                    .filter(
                        (value) =>
                            value !== "No Sprint"
                    )
            ),
        ].sort();
    }, [completedTasks]);

    const filteredTasks = useMemo(() => {
        const search =
            searchTerm
                .trim()
                .toLowerCase();

        return completedTasks.filter(
            (task) => {
                const title =
                    getTaskTitle(
                        task
                    ).toLowerCase();

                const description =
                    getDescription(
                        task
                    ).toLowerCase();

                const project =
                    getProjectName(
                        task
                    ).toLowerCase();

                const sprint =
                    getSprintName(
                        task
                    ).toLowerCase();

                const assignee =
                    getAssigneeName(
                        task
                    ).toLowerCase();

                const matchesSearch =
                    !search ||
                    title.includes(search) ||
                    description.includes(search) ||
                    project.includes(search) ||
                    sprint.includes(search) ||
                    assignee.includes(search);

                const matchesProject =
                    projectFilter === "all" ||
                    getProjectName(task) ===
                        projectFilter;

                const matchesSprint =
                    sprintFilter === "all" ||
                    getSprintName(task) ===
                        sprintFilter;

                const reviewStatus =
                    getReviewStatus(
                        task
                    );

                const matchesReview =
                    reviewFilter === "all" ||
                    (reviewFilter === "pending" &&
                        !reviewStatus) ||
                    (reviewFilter === "approved" &&
                        isApproved(task)) ||
                    (reviewFilter === "changes" &&
                        isChangesRequested(task));

                return (
                    matchesSearch &&
                    matchesProject &&
                    matchesSprint &&
                    matchesReview
                );
            }
        );
    }, [
        completedTasks,
        searchTerm,
        projectFilter,
        sprintFilter,
        reviewFilter,
    ]);

    const statistics = useMemo(() => {
        const pending =
            completedTasks.filter(
                (task) =>
                    !getReviewStatus(task)
            ).length;

        const approved =
            completedTasks.filter(
                (task) =>
                    isApproved(task)
            ).length;

        const changesRequested =
            completedTasks.filter(
                (task) =>
                    isChangesRequested(task)
            ).length;

        return {
            total: completedTasks.length,
            pending,
            approved,
            changesRequested,
        };
    }, [completedTasks]);

    const handleViewTask = (task) => {
        setSelectedTask(task);
        setShowDetails(true);

        if (onTaskSelect) {
            onTaskSelect(task);
        }
    };

    const handleOpenReview = (task) => {
        if (!canReview) {
            setError(
                "You are not authorized to review completed tasks."
            );
            return;
        }

        setSelectedTask(task);

        setReviewDecision(
            isApproved(task)
                ? "Approved"
                : "Approved"
        );

        setReviewComment(
            getReviewComment(task)
        );

        setError("");
        setSuccess("");
        setShowReview(true);
    };

    const handleSubmitReview = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!canReview) {
            setError(
                "You are not authorized to review completed tasks."
            );
            return;
        }

        if (!selectedTask) {
            setError(
                "No completed task has been selected."
            );
            return;
        }

        const taskId =
            getTaskId(selectedTask);

        if (!taskId) {
            setError(
                "The selected task does not have a valid task ID."
            );
            return;
        }

        if (!reviewDecision) {
            setError(
                "Please select a review decision."
            );
            return;
        }

        if (
            reviewComment.trim().length >
            2000
        ) {
            setError(
                "The review comment cannot exceed 2000 characters."
            );
            return;
        }

        if (!onReview) {
            setError(
                "The review save operation is not connected yet."
            );
            return;
        }

        const reviewPayload = {
            taskId,
            reviewStatus:
                reviewDecision,
            comment:
                reviewComment.trim() ||
                null,
        };

        try {
            setIsSaving(true);

            await Promise.resolve(
                onReview(
                    selectedTask,
                    reviewDecision,
                    reviewPayload
                )
            );

            setSuccess(
                reviewDecision === "Approved"
                    ? "Task approved successfully."
                    : "Changes requested successfully."
            );

            setTasks(
                (currentTasks) =>
                    currentTasks.map(
                        (task) => {
                            const id =
                                getTaskId(
                                    task
                                );

                            if (
                                String(id) !==
                                String(taskId)
                            ) {
                                return task;
                            }

                            return {
                                ...task,
                                reviewStatus:
                                    reviewDecision,
                                ReviewStatus:
                                    reviewDecision,
                                reviewComment:
                                    reviewComment.trim(),
                                ReviewComment:
                                    reviewComment.trim(),
                            };
                        }
                    )
            );

            setSelectedTask(
                (currentTask) => ({
                    ...currentTask,
                    reviewStatus:
                        reviewDecision,
                    ReviewStatus:
                        reviewDecision,
                    reviewComment:
                        reviewComment.trim(),
                    ReviewComment:
                        reviewComment.trim(),
                })
            );

            setShowReview(false);

            setTimeout(() => {
                setSuccess("");
            }, 3000);
        } catch (err) {
            setError(
                err?.response?.data?.message ??
                    err?.message ??
                    "Unable to review task. Please try again."
            );
        } finally {
            setIsSaving(false);
        }
    };

    const clearFilters = () => {
        setSearchTerm("");
        setProjectFilter("all");
        setSprintFilter("all");
        setReviewFilter("all");
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 rounded-xl border border-border/70 bg-background p-5 shadow-sm md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-xl font-semibold tracking-tight">
                        Review Completed Tasks
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Review completed team tasks and provide approval or feedback.
                    </p>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    onClick={refreshTasks}
                    disabled={isLoading}
                    className="gap-2"
                >
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <RefreshCw className="h-4 w-4" />
                    )}
                    Refresh
                </Button>
            </div>

            {error && (
                <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {success && (
                <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                    <span>{success}</span>
                </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-border/70 bg-background p-5 shadow-sm transition-transform hover:-translate-y-0.5">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-muted-foreground">
                            Completed
                        </p>

                        <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                    </div>

                    <p className="mt-3 text-3xl font-bold">
                        {statistics.total}
                    </p>
                </div>

                <div className="rounded-xl border border-border/70 bg-background p-5 shadow-sm transition-transform hover:-translate-y-0.5">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-muted-foreground">
                            Pending Review
                        </p>

                        <AlertCircle className="h-5 w-5 text-muted-foreground" />
                    </div>

                    <p className="mt-3 text-3xl font-bold">
                        {statistics.pending}
                    </p>
                </div>

                <div className="rounded-xl border border-border/70 bg-background p-5 shadow-sm transition-transform hover:-translate-y-0.5">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-muted-foreground">
                            Approved
                        </p>

                        <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                    </div>

                    <p className="mt-3 text-3xl font-bold">
                        {statistics.approved}
                    </p>
                </div>

                <div className="rounded-xl border border-border/70 bg-background p-5 shadow-sm transition-transform hover:-translate-y-0.5">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-muted-foreground">
                            Changes Requested
                        </p>

                        <MessageSquare className="h-5 w-5 text-muted-foreground" />
                    </div>

                    <p className="mt-3 text-3xl font-bold">
                        {statistics.changesRequested}
                    </p>
                </div>
            </div>

            <div className="rounded-xl border border-border/70 bg-background p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                    <Filter className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-semibold">
                        Filters
                    </h3>
                </div>

                <div className="grid gap-4 lg:grid-cols-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                        <Input
                            value={searchTerm}
                            onChange={(event) =>
                                setSearchTerm(
                                    event.target.value
                                )
                            }
                            placeholder="Search tasks..."
                            className="pl-9"
                        />
                    </div>

                    <select
                        value={projectFilter}
                        onChange={(event) =>
                            setProjectFilter(
                                event.target.value
                            )
                        }
                        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                    >
                        <option value="all">
                            All Projects
                        </option>

                        {projectOptions.map(
                            (project) => (
                                <option
                                    key={project}
                                    value={project}
                                >
                                    {project}
                                </option>
                            )
                        )}
                    </select>

                    <select
                        value={sprintFilter}
                        onChange={(event) =>
                            setSprintFilter(
                                event.target.value
                            )
                        }
                        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                    >
                        <option value="all">
                            All Sprints
                        </option>

                        {sprintOptions.map(
                            (sprint) => (
                                <option
                                    key={sprint}
                                    value={sprint}
                                >
                                    {sprint}
                                </option>
                            )
                        )}
                    </select>

                    <select
                        value={reviewFilter}
                        onChange={(event) =>
                            setReviewFilter(
                                event.target.value
                            )
                        }
                        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                    >
                        <option value="all">
                            All Review Status
                        </option>

                        <option value="pending">
                            Pending Review
                        </option>

                        <option value="approved">
                            Approved
                        </option>

                        <option value="changes">
                            Changes Requested
                        </option>
                    </select>
                </div>

                {(searchTerm ||
                    projectFilter !== "all" ||
                    sprintFilter !== "all" ||
                    reviewFilter !== "all") && (
                    <div className="mt-4 flex justify-end">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={clearFilters}
                            className="gap-2"
                        >
                            <X className="h-4 w-4" />
                            Clear Filters
                        </Button>
                    </div>
                )}
            </div>

            <div className="rounded-xl border border-border/70 bg-background shadow-sm">
                <div className="border-b border-border/70 p-5">
                    <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h3 className="font-semibold">
                                Completed Tasks
                            </h3>

                            <p className="text-sm text-muted-foreground">
                                Showing{" "}
                                {filteredTasks.length}{" "}
                                of{" "}
                                {completedTasks.length}{" "}
                                completed tasks
                            </p>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex min-h-48 items-center justify-center">
                        <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
                    </div>
                ) : filteredTasks.length === 0 ? (
                    <div className="flex min-h-48 flex-col items-center justify-center px-6 text-center">
                        <CheckCircle2 className="mb-3 h-10 w-10 text-muted-foreground" />

                        <h4 className="font-semibold">
                            No completed tasks found
                        </h4>

                        <p className="mt-1 max-w-md text-sm text-muted-foreground">
                            There are no completed tasks matching the selected filters.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1000px] text-sm">
                            <thead>
                                <tr className="border-b border-border/70 bg-muted/30">
                                    <th className="px-5 py-3 text-left font-semibold">
                                        Task
                                    </th>

                                    <th className="px-5 py-3 text-left font-semibold">
                                        Project
                                    </th>

                                    <th className="px-5 py-3 text-left font-semibold">
                                        Sprint
                                    </th>

                                    <th className="px-5 py-3 text-left font-semibold">
                                        Contributor
                                    </th>

                                    <th className="px-5 py-3 text-left font-semibold">
                                        Completed
                                    </th>

                                    <th className="px-5 py-3 text-left font-semibold">
                                        Review
                                    </th>

                                    <th className="px-5 py-3 text-right font-semibold">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredTasks.map(
                                    (task) => {
                                        const taskId =
                                            getTaskId(
                                                task
                                            );

                                        return (
                                            <tr
                                                key={
                                                    taskId
                                                }
                                                className="border-b border-border/60 last:border-0 hover:bg-muted/20"
                                            >
                                                <td className="px-5 py-4">
                                                    <div className="max-w-[260px]">
                                                        <p className="font-medium">
                                                            {getTaskTitle(
                                                                task
                                                            )}
                                                        </p>

                                                        <p className="mt-1 truncate text-xs text-muted-foreground">
                                                            {getDescription(
                                                                task
                                                            ) ||
                                                                "No description"}
                                                        </p>
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4">
                                                    {getProjectName(
                                                        task
                                                    )}
                                                </td>

                                                <td className="px-5 py-4">
                                                    {getSprintName(
                                                        task
                                                    )}
                                                </td>

                                                <td className="px-5 py-4">
                                                    {getAssigneeName(
                                                        task
                                                    )}
                                                </td>

                                                <td className="px-5 py-4">
                                                    {formatDate(
                                                        getCompletedAt(
                                                            task
                                                        )
                                                    )}
                                                </td>

                                                <td className="px-5 py-4">
                                                    <ReviewBadge
                                                        status={getReviewStatus(
                                                            task
                                                        )}
                                                    />
                                                </td>

                                                <td className="px-5 py-4">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleViewTask(
                                                                    task
                                                                )
                                                            }
                                                            className="gap-2"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                            View
                                                        </Button>

                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleOpenReview(
                                                                    task
                                                                )
                                                            }
                                                            disabled={
                                                                !canReview
                                                            }
                                                            className="gap-2"
                                                        >
                                                            <CheckCircle2 className="h-4 w-4" />
                                                            Review
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    }
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="space-y-4 md:hidden">
                {filteredTasks.map(
                    (task) => {
                        const taskId =
                            getTaskId(task);

                        return (
                            <div
                                key={taskId}
                                className="rounded-xl border border-border/70 bg-background p-4 shadow-sm"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <h4 className="truncate font-semibold">
                                            {getTaskTitle(
                                                task
                                            )}
                                        </h4>

                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {getAssigneeName(
                                                task
                                            )}
                                        </p>
                                    </div>

                                    <ReviewBadge
                                        status={getReviewStatus(
                                            task
                                        )}
                                    />
                                </div>

                                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Project
                                        </p>

                                        <p className="mt-1 font-medium">
                                            {getProjectName(
                                                task
                                            )}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Sprint
                                        </p>

                                        <p className="mt-1 font-medium">
                                            {getSprintName(
                                                task
                                            )}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Completed
                                        </p>

                                        <p className="mt-1 font-medium">
                                            {formatDate(
                                                getCompletedAt(
                                                    task
                                                )
                                            )}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Progress
                                        </p>

                                        <p className="mt-1 font-medium">
                                            {getProgress(
                                                task
                                            )}
                                            %
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 flex gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            handleViewTask(
                                                task
                                            )
                                        }
                                        className="flex-1 gap-2"
                                    >
                                        <Eye className="h-4 w-4" />
                                        View
                                    </Button>

                                    <Button
                                        type="button"
                                        size="sm"
                                        onClick={() =>
                                            handleOpenReview(
                                                task
                                            )
                                        }
                                        disabled={
                                            !canReview
                                        }
                                        className="flex-1 gap-2"
                                    >
                                        <CheckCircle2 className="h-4 w-4" />
                                        Review
                                    </Button>
                                </div>
                            </div>
                        );
                    }
                )}
            </div>

            {showDetails &&
                selectedTask && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-border/70 bg-background shadow-xl">
                            <div className="flex items-center justify-between border-b border-border/70 p-5">
                                <div>
                                    <h3 className="text-lg font-semibold">
                                        Task Details
                                    </h3>

                                    <p className="text-sm text-muted-foreground">
                                        {getTaskTitle(
                                            selectedTask
                                        )}
                                    </p>
                                </div>

                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                        setShowDetails(
                                            false
                                        )
                                    }
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>

                            <div className="space-y-5 p-5">
                                <div>
                                    <Label>
                                        Description
                                    </Label>

                                    <p className="mt-2 rounded-lg bg-muted/30 p-3 text-sm">
                                        {getDescription(
                                            selectedTask
                                        ) ||
                                            "No description available."}
                                    </p>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <Label>
                                            Project
                                        </Label>

                                        <p className="mt-1 text-sm">
                                            {getProjectName(
                                                selectedTask
                                            )}
                                        </p>
                                    </div>

                                    <div>
                                        <Label>
                                            Sprint
                                        </Label>

                                        <p className="mt-1 text-sm">
                                            {getSprintName(
                                                selectedTask
                                            )}
                                        </p>
                                    </div>

                                    <div>
                                        <Label>
                                            Contributor
                                        </Label>

                                        <p className="mt-1 text-sm">
                                            {getAssigneeName(
                                                selectedTask
                                            )}
                                        </p>
                                    </div>

                                    <div>
                                        <Label>
                                            Priority
                                        </Label>

                                        <p className="mt-1 text-sm">
                                            {getPriority(
                                                selectedTask
                                            )}
                                        </p>
                                    </div>

                                    <div>
                                        <Label>
                                            Completed
                                        </Label>

                                        <p className="mt-1 text-sm">
                                            {formatDateTime(
                                                getCompletedAt(
                                                    selectedTask
                                                )
                                            )}
                                        </p>
                                    </div>

                                    <div>
                                        <Label>
                                            Deadline
                                        </Label>

                                        <p className="mt-1 text-sm">
                                            {formatDate(
                                                getDeadline(
                                                    selectedTask
                                                )
                                            )}
                                        </p>
                                    </div>

                                    <div>
                                        <Label>
                                            Progress
                                        </Label>

                                        <p className="mt-1 text-sm">
                                            {getProgress(
                                                selectedTask
                                            )}
                                            %
                                        </p>
                                    </div>

                                    <div>
                                        <Label>
                                            Review Status
                                        </Label>

                                        <div className="mt-1">
                                            <ReviewBadge
                                                status={getReviewStatus(
                                                    selectedTask
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {getReviewComment(
                                    selectedTask
                                ) && (
                                    <div>
                                        <Label>
                                            Review Comment
                                        </Label>

                                        <p className="mt-2 rounded-lg bg-muted/30 p-3 text-sm">
                                            {getReviewComment(
                                                selectedTask
                                            )}
                                        </p>
                                    </div>
                                )}

                                <div className="flex justify-end gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            setShowDetails(
                                                false
                                            )
                                        }
                                    >
                                        Close
                                    </Button>

                                    <Button
                                        type="button"
                                        onClick={() => {
                                            setShowDetails(
                                                false
                                            );
                                            handleOpenReview(
                                                selectedTask
                                            );
                                        }}
                                        disabled={
                                            !canReview
                                        }
                                    >
                                        Review Task
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            {showReview &&
                selectedTask && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <div className="w-full max-w-lg rounded-xl border border-border/70 bg-background shadow-xl">
                            <div className="flex items-center justify-between border-b border-border/70 p-5">
                                <div>
                                    <h3 className="text-lg font-semibold">
                                        Review Task
                                    </h3>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {getTaskTitle(
                                            selectedTask
                                        )}
                                    </p>
                                </div>

                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                        setShowReview(
                                            false
                                        )
                                    }
                                    disabled={
                                        isSaving
                                    }
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>

                            <form
                                onSubmit={
                                    handleSubmitReview
                                }
                                className="space-y-5 p-5"
                            >
                                <div>
                                    <Label htmlFor="reviewDecision">
                                        Review Decision
                                    </Label>

                                    <select
                                        id="reviewDecision"
                                        value={
                                            reviewDecision
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setReviewDecision(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        disabled={
                                            isSaving
                                        }
                                        className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                                    >
                                        {REVIEW_OPTIONS.map(
                                            (
                                                option
                                            ) => (
                                                <option
                                                    key={
                                                        option
                                                    }
                                                    value={
                                                        option
                                                    }
                                                >
                                                    {option}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>

                                <div>
                                    <Label htmlFor="reviewComment">
                                        Feedback
                                    </Label>

                                    <Textarea
                                        id="reviewComment"
                                        value={
                                            reviewComment
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setReviewComment(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        placeholder="Enter feedback for the contributor..."
                                        maxLength={2000}
                                        disabled={
                                            isSaving
                                        }
                                        className="mt-2 min-h-32"
                                    />

                                    <p className="mt-1 text-right text-xs text-muted-foreground">
                                        {
                                            reviewComment.length
                                        }{" "}
                                        / 2000
                                    </p>
                                </div>

                                {error && (
                                    <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                                        <span>
                                            {error}
                                        </span>
                                    </div>
                                )}

                                <div className="flex justify-end gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            setShowReview(
                                                false
                                            )
                                        }
                                        disabled={
                                            isSaving
                                        }
                                    >
                                        Cancel
                                    </Button>

                                    <Button
                                        type="submit"
                                        disabled={
                                            isSaving ||
                                            !canReview
                                        }
                                        className="gap-2"
                                    >
                                        {isSaving ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <CheckCircle2 className="h-4 w-4" />
                                        )}

                                        Submit Review
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
        </div>
    );
}
