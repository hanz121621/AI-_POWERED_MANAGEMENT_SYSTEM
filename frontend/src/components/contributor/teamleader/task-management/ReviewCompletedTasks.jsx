// ============================================================
// AIPMS — TEAM LEADER REVIEW COMPLETED TASKS
//
// Use Case:
// TASK-009 — Review Completed Tasks
//
// Primary Actor:
// Team Leader
//
// Goal:
// Allow a Team Leader to review tasks marked as completed,
// inspect completion information, and approve or request
// changes when necessary.
//
// IMPORTANT:
// - Backend MUST enforce Team Leader authorization.
// - Backend MUST validate team/task relationships.
// - Review decisions MUST be persisted by the backend.
// - Review actions SHOULD be recorded in activity history.
// - Notifications SHOULD be handled by the backend.
// - No localStorage is used.
// ============================================================

import React, { useEffect, useMemo, useState } from "react";

// ============================================================
// REVIEW STATUS
// ============================================================

const REVIEW_OPTIONS = [
    {
        value: "Approved",
        description:
            "The completed task has been reviewed and accepted.",
    },
    {
        value: "Changes Requested",
        description:
            "The task requires additional work before it can be accepted.",
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

const getDescription = (task) => {
    return (
        task?.description ??
        task?.taskDescription ??
        task?.Description ??
        ""
    );
};

const getStatus = (task) => {
    return (
        task?.status ??
        task?.taskStatus ??
        task?.Status ??
        task?.TaskStatus ??
        "Completed"
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

const getPriority = (task) => {
    return (
        task?.priority ??
        task?.priorityName ??
        task?.Priority ??
        "Medium"
    );
};

const getDeadline = (task) => {
    return (
        task?.deadline ??
        task?.dueDate ??
        task?.Deadline ??
        task?.DueDate ??
        null
    );
};

const getCompletedAt = (task) => {
    return (
        task?.completedAt ??
        task?.completionDate ??
        task?.completedDate ??
        task?.CompletedAt ??
        task?.CompletedDate ??
        null
    );
};

const getProgress = (task) => {
    const value =
        task?.progress ??
        task?.progressPercentage ??
        task?.completionPercentage ??
        task?.Progress ??
        100;

    const number = Number(value);

    if (Number.isNaN(number)) {
        return 100;
    }

    return Math.max(
        0,
        Math.min(100, number)
    );
};

const getReviewStatus = (task) => {
    return (
        task?.reviewStatus ??
        task?.ReviewStatus ??
        task?.completionReviewStatus ??
        task?.CompletionReviewStatus ??
        "Pending Review"
    );
};

const isCompleted = (task) => {
    const status = String(
        getStatus(task)
    ).toLowerCase();

    return (
        status.includes("completed") ||
        status.includes("done")
    );
};

const isApproved = (task) => {
    const reviewStatus = String(
        getReviewStatus(task)
    ).toLowerCase();

    return reviewStatus ===
        "approved";
};

const formatDate = (value) => {
    if (!value) return "Not available";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Not available";
    }

    return date.toLocaleDateString(
        undefined,
        {
            year: "numeric",
            month: "short",
            day: "numeric",
        }
    );
};

const formatDateTime = (value) => {
    if (!value) return "Not available";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Not available";
    }

    return date.toLocaleString(
        undefined,
        {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }
    );
};

const normalizeTasks = (value) => {
    if (Array.isArray(value)) {
        return value;
    }

    if (Array.isArray(value?.items)) {
        return value.items;
    }

    if (Array.isArray(value?.data)) {
        return value.data;
    }

    if (Array.isArray(value?.tasks)) {
        return value.tasks;
    }

    return [];
};

// ============================================================
// BADGES
// ============================================================

function PriorityBadge({ priority }) {
    const value = String(
        priority || ""
    ).toLowerCase();

    let classes =
        "bg-gray-100 text-gray-700";

    if (value === "critical") {
        classes =
            "bg-red-100 text-red-700";
    } else if (value === "high") {
        classes =
            "bg-orange-100 text-orange-700";
    } else if (value === "medium") {
        classes =
            "bg-yellow-100 text-yellow-700";
    } else if (value === "low") {
        classes =
            "bg-green-100 text-green-700";
    }

    return (
        <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${classes}`}
        >
            {priority}
        </span>
    );
}

function ReviewBadge({ status }) {
    const value = String(
        status || ""
    ).toLowerCase();

    let classes =
        "bg-yellow-100 text-yellow-700";

    if (value.includes("approved")) {
        classes =
            "bg-green-100 text-green-700";
    } else if (
        value.includes("change") ||
        value.includes("rejected")
    ) {
        classes =
            "bg-red-100 text-red-700";
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

export default function ReviewCompletedTasks({
    tasks: initialTasks = [],

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

    // ========================================================
    // SYNC DATA
    // ========================================================

    useEffect(() => {
        setTasks(
            normalizeTasks(
                initialTasks
            )
        );
    }, [initialTasks]);

    // ========================================================
    // COMPLETED TASKS
    // ========================================================

    const completedTasks = useMemo(() => {
        return tasks.filter(
            (task) =>
                isCompleted(task)
        );
    }, [tasks]);

    // ========================================================
    // FILTER OPTIONS
    // ========================================================

    const projectOptions = useMemo(() => {
        return [
            ...new Set(
                completedTasks
                    .map(
                        getProjectName
                    )
                    .filter(
                        (value) =>
                            value !==
                            "No Project"
                    )
            ),
        ].sort();
    }, [completedTasks]);

    const sprintOptions = useMemo(() => {
        return [
            ...new Set(
                completedTasks
                    .map(
                        getSprintName
                    )
                    .filter(
                        (value) =>
                            value !==
                            "No Sprint"
                    )
            ),
        ].sort();
    }, [completedTasks]);

    // ========================================================
    // FILTERED TASKS
    // ========================================================

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

                const reviewStatus =
                    String(
                        getReviewStatus(
                            task
                        )
                    ).toLowerCase();

                const matchesSearch =
                    !search ||
                    title.includes(
                        search
                    ) ||
                    description.includes(
                        search
                    ) ||
                    project.includes(
                        search
                    ) ||
                    sprint.includes(
                        search
                    ) ||
                    assignee.includes(
                        search
                    );

                const matchesProject =
                    projectFilter ===
                        "all" ||
                    getProjectName(
                        task
                    ) === projectFilter;

                const matchesSprint =
                    sprintFilter ===
                        "all" ||
                    getSprintName(
                        task
                    ) === sprintFilter;

                const matchesReview =
                    reviewFilter ===
                        "all" ||
                    reviewStatus ===
                        reviewFilter.toLowerCase();

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

    // ========================================================
    // STATISTICS
    // ========================================================

    const statistics = useMemo(() => {
        const pending =
            completedTasks.filter(
                (task) =>
                    !isApproved(task) &&
                    !String(
                        getReviewStatus(
                            task
                        )
                    )
                        .toLowerCase()
                        .includes(
                            "change"
                        )
            ).length;

        const approved =
            completedTasks.filter(
                (task) =>
                    isApproved(task)
            ).length;

        const changesRequested =
            completedTasks.filter(
                (task) =>
                    String(
                        getReviewStatus(
                            task
                        )
                    )
                        .toLowerCase()
                        .includes(
                            "change"
                        )
            ).length;

        return {
            total:
                completedTasks.length,
            pending,
            approved,
            changesRequested,
        };
    }, [completedTasks]);

    // ========================================================
    // REFRESH
    // ========================================================

    const refreshTasks = async () => {
        setError("");
        setSuccess("");

        try {
            setIsLoading(true);

            if (loadTasks) {
                const result =
                    await Promise.resolve(
                        loadTasks()
                    );

                if (result) {
                    setTasks(
                        normalizeTasks(
                            result
                        )
                    );
                }
            }

            if (onRefresh) {
                const result =
                    await Promise.resolve(
                        onRefresh()
                    );

                if (result) {
                    setTasks(
                        normalizeTasks(
                            result
                        )
                    );
                }
            }

            setSuccess(
                "Completed tasks refreshed."
            );

            setTimeout(() => {
                setSuccess("");
            }, 2000);
        } catch (err) {
            console.error(
                "Review Completed Tasks Error:",
                err
            );

            setError(
                err?.response?.data?.message ??
                    err?.message ??
                    "Unable to load completed tasks."
            );
        } finally {
            setIsLoading(false);
        }
    };

    // ========================================================
    // OPEN DETAILS
    // ========================================================

    const handleViewTask = (
        task
    ) => {
        setSelectedTask(
            task
        );

        setShowDetails(
            true
        );

        if (onTaskSelect) {
            onTaskSelect(
                task
            );
        }
    };

    // ========================================================
    // OPEN REVIEW
    // ========================================================

    const handleOpenReview = (
        task
    ) => {
        setSelectedTask(
            task
        );

        setReviewDecision(
            isApproved(task)
                ? "Approved"
                : "Approved"
        );

        setReviewComment("");

        setError("");

        setShowReview(
            true
        );
    };

    // ========================================================
    // SUBMIT REVIEW
    // ========================================================

    const handleSubmitReview =
        async (event) => {
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
                getTaskId(
                    selectedTask
                );

            if (!taskId) {
                setError(
                    "The selected task does not have a valid task ID."
                );
                return;
            }

            if (
                !reviewDecision
            ) {
                setError(
                    "Please select a review decision."
                );
                return;
            }

            if (
                reviewComment.trim()
                    .length >
                2000
            ) {
                setError(
                    "The review comment cannot exceed 2000 characters."
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
                setIsSaving(
                    true
                );

                if (!onReview) {
                    throw new Error(
                        "No completed-task review handler was provided."
                    );
                }

                await Promise.resolve(
                    onReview(
                        selectedTask,
                        reviewDecision,
                        reviewPayload
                    )
                );

                setSuccess(
                    reviewDecision ===
                        "Approved"
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
                                    String(
                                        id
                                    ) !==
                                    String(
                                        taskId
                                    )
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
                                        reviewComment.trim() ||
                                        null,
                                };
                            }
                        )
                );

                setTimeout(() => {
                    setShowReview(
                        false
                    );
                    setSelectedTask(
                        null
                    );
                    setSuccess("");
                }, 700);
            } catch (err) {
                console.error(
                    "Submit Task Review Error:",
                    err
                );

                setError(
                    err?.response?.data
                        ?.message ??
                        err?.message ??
                        "Unable to save the task review."
                );
            } finally {
                setIsSaving(
                    false
                );
            }
        };

    // ========================================================
    // CLEAR FILTERS
    // ========================================================

    const clearFilters = () => {
        setSearchTerm("");
        setProjectFilter(
            "all"
        );
        setSprintFilter(
            "all"
        );
        setReviewFilter(
            "all"
        );
    };

    // ========================================================
    // ACCESS DENIED
    // ========================================================

    if (!canReview) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                <div className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 font-bold text-red-600">
                        !
                    </div>

                    <div>
                        <h2 className="font-semibold text-red-800">
                            Access Denied
                        </h2>

                        <p className="mt-1 text-sm text-red-700">
                            You are not authorized to
                            review completed team tasks.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // ========================================================
    // UI
    // ========================================================

    return (
        <div className="space-y-6">
            {/* =================================================
                HEADER
            ================================================= */}

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        Review Completed Tasks
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                        Review completed work submitted by
                        Developers and Staff on your team.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={
                        refreshTasks
                    }
                    disabled={
                        isLoading
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 ${
                            isLoading
                                ? "animate-spin"
                                : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 4v5h5M20 20v-5h-5M5.64 18.36A9 9 0 1018.36 5.64"
                        />
                    </svg>

                    {isLoading
                        ? "Refreshing..."
                        : "Refresh"}
                </button>
            </div>

            {/* =================================================
                ALERTS
            ================================================= */}

            {success && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                    <p className="text-sm font-medium text-green-700">
                        {success}
                    </p>
                </div>
            )}

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                    <p className="text-sm text-red-700">
                        {error}
                    </p>
                </div>
            )}

            {/* =================================================
                STATISTICS
            ================================================= */}

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Completed
                    </p>

                    <p className="mt-2 text-2xl font-bold text-gray-900">
                        {statistics.total}
                    </p>
                </div>

                <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-5 shadow-sm">
                    <p className="text-xs font-medium uppercase tracking-wide text-yellow-700">
                        Pending Review
                    </p>

                    <p className="mt-2 text-2xl font-bold text-yellow-700">
                        {statistics.pending}
                    </p>
                </div>

                <div className="rounded-xl border border-green-200 bg-green-50 p-5 shadow-sm">
                    <p className="text-xs font-medium uppercase tracking-wide text-green-700">
                        Approved
                    </p>

                    <p className="mt-2 text-2xl font-bold text-green-700">
                        {statistics.approved}
                    </p>
                </div>

                <div className="rounded-xl border border-red-200 bg-red-50 p-5 shadow-sm">
                    <p className="text-xs font-medium uppercase tracking-wide text-red-700">
                        Changes Requested
                    </p>

                    <p className="mt-2 text-2xl font-bold text-red-700">
                        {
                            statistics.changesRequested
                        }
                    </p>
                </div>
            </div>

            {/* =================================================
                FILTERS
            ================================================= */}

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* Search */}
                    <div className="lg:col-span-2">
                        <label
                            htmlFor="completed-task-search"
                            className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-500"
                        >
                            Search
                        </label>

                        <div className="relative">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>

                            <input
                                id="completed-task-search"
                                type="text"
                                value={
                                    searchTerm
                                }
                                onChange={(
                                    event
                                ) =>
                                    setSearchTerm(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                placeholder="Search completed tasks..."
                                className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>
                    </div>

                    {/* Project */}
                    <div>
                        <label
                            htmlFor="completed-project-filter"
                            className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-500"
                        >
                            Project
                        </label>

                        <select
                            id="completed-project-filter"
                            value={
                                projectFilter
                            }
                            onChange={(
                                event
                            ) =>
                                setProjectFilter(
                                    event
                                        .target
                                        .value
                                )
                            }
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="all">
                                All Projects
                            </option>

                            {projectOptions.map(
                                (project) => (
                                    <option
                                        key={
                                            project
                                        }
                                        value={
                                            project
                                        }
                                    >
                                        {project}
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    {/* Sprint */}
                    <div>
                        <label
                            htmlFor="completed-sprint-filter"
                            className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-500"
                        >
                            Sprint
                        </label>

                        <select
                            id="completed-sprint-filter"
                            value={
                                sprintFilter
                            }
                            onChange={(
                                event
                            ) =>
                                setSprintFilter(
                                    event
                                        .target
                                        .value
                                )
                            }
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="all">
                                All Sprints
                            </option>

                            {sprintOptions.map(
                                (sprint) => (
                                    <option
                                        key={
                                            sprint
                                        }
                                        value={
                                            sprint
                                        }
                                    >
                                        {sprint}
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    {/* Review status */}
                    <div>
                        <label
                            htmlFor="review-status-filter"
                            className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-500"
                        >
                            Review
                        </label>

                        <select
                            id="review-status-filter"
                            value={
                                reviewFilter
                            }
                            onChange={(
                                event
                            ) =>
                                setReviewFilter(
                                    event
                                        .target
                                        .value
                                )
                            }
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="all">
                                All Reviews
                            </option>

                            <option value="Pending Review">
                                Pending Review
                            </option>

                            <option value="Approved">
                                Approved
                            </option>

                            <option value="Changes Requested">
                                Changes Requested
                            </option>
                        </select>
                    </div>
                </div>

                <div className="mt-4">
                    <button
                        type="button"
                        onClick={
                            clearFilters
                        }
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* =================================================
                RESULT COUNT
            ================================================= */}

            <div>
                <p className="text-sm text-gray-600">
                    Showing{" "}
                    <strong className="text-gray-900">
                        {
                            filteredTasks.length
                        }
                    </strong>{" "}
                    completed task
                    {filteredTasks.length !==
                    1
                        ? "s"
                        : ""}
                </p>
            </div>

            {/* =================================================
                EMPTY STATE
            ================================================= */}

            {filteredTasks.length ===
            0 ? (
                <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-7 w-7"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12l2 2 4-4"
                            />

                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 5h14v14H5z"
                            />
                        </svg>
                    </div>

                    <h3 className="mt-4 text-lg font-semibold text-gray-900">
                        No completed tasks found
                    </h3>

                    <p className="mt-1 text-sm text-gray-600">
                        There are no completed tasks
                        matching the current filters.
                    </p>

                    <button
                        type="button"
                        onClick={
                            clearFilters
                        }
                        className="mt-5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Clear Filters
                    </button>
                </div>
            ) : (
                /* =================================================
                   TASK TABLE
                ================================================= */

                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="hidden overflow-x-auto lg:block">
                        <table className="w-full">
                            <thead className="border-b border-gray-200 bg-gray-50">
                                <tr>
                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Task
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Project / Sprint
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Contributor
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Priority
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Completed
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Review
                                    </th>

                                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
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
                                                className="transition hover:bg-gray-50"
                                            >
                                                <td className="px-5 py-4">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleViewTask(
                                                                task
                                                            )
                                                        }
                                                        className="text-left"
                                                    >
                                                        <p className="text-sm font-semibold text-gray-900 hover:text-blue-600">
                                                            {getTaskTitle(
                                                                task
                                                            )}
                                                        </p>

                                                        <p className="mt-1 max-w-xs truncate text-xs text-gray-500">
                                                            {getDescription(
                                                                task
                                                            ) ||
                                                                "No description"}
                                                        </p>
                                                    </button>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {getProjectName(
                                                            task
                                                        )}
                                                    </p>

                                                    <p className="mt-1 text-xs text-gray-500">
                                                        {getSprintName(
                                                            task
                                                        )}
                                                    </p>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {getAssigneeName(
                                                            task
                                                        )}
                                                    </p>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <PriorityBadge
                                                        priority={getPriority(
                                                            task
                                                        )}
                                                    />
                                                </td>

                                                <td className="px-5 py-4">
                                                    <p className="text-sm text-gray-900">
                                                        {formatDate(
                                                            getCompletedAt(
                                                                task
                                                            )
                                                        )}
                                                    </p>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <ReviewBadge
                                                        status={getReviewStatus(
                                                            task
                                                        )}
                                                    />
                                                </td>

                                                <td className="px-5 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleViewTask(
                                                                    task
                                                                )
                                                            }
                                                            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                                                        >
                                                            View
                                                        </button>

                                                        {!isApproved(
                                                            task
                                                        ) && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleOpenReview(
                                                                        task
                                                                    )
                                                                }
                                                                className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                                                            >
                                                                Review
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    }
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* =================================================
                        MOBILE
                    ================================================= */}

                    <div className="divide-y divide-gray-200 lg:hidden">
                        {filteredTasks.map(
                            (task) => (
                                <div
                                    key={getTaskId(
                                        task
                                    )}
                                    className="p-5"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleViewTask(
                                                        task
                                                    )
                                                }
                                                className="text-left text-sm font-semibold text-gray-900 hover:text-blue-600"
                                            >
                                                {getTaskTitle(
                                                    task
                                                )}
                                            </button>

                                            <p className="mt-1 text-xs text-gray-500">
                                                {getProjectName(
                                                    task
                                                )}{" "}
                                                /{" "}
                                                {getSprintName(
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

                                    <p className="mt-3 text-sm text-gray-600">
                                        {getDescription(
                                            task
                                        ) ||
                                            "No description available."}
                                    </p>

                                    <div className="mt-4 grid grid-cols-2 gap-3">
                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Contributor
                                            </p>

                                            <p className="mt-1 text-sm font-medium text-gray-900">
                                                {getAssigneeName(
                                                    task
                                                )}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Priority
                                            </p>

                                            <div className="mt-1">
                                                <PriorityBadge
                                                    priority={getPriority(
                                                        task
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Completed
                                            </p>

                                            <p className="mt-1 text-sm font-medium text-gray-900">
                                                {formatDate(
                                                    getCompletedAt(
                                                        task
                                                    )
                                                )}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Deadline
                                            </p>

                                            <p className="mt-1 text-sm font-medium text-gray-900">
                                                {formatDate(
                                                    getDeadline(
                                                        task
                                                    )
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-500">
                                                Completion
                                            </span>

                                            <span className="font-semibold text-gray-700">
                                                {getProgress(
                                                    task
                                                )}
                                                %
                                            </span>
                                        </div>

                                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
                                            <div
                                                className="h-full rounded-full bg-green-600"
                                                style={{
                                                    width: `${getProgress(
                                                        task
                                                    )}%`,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-4 flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleViewTask(
                                                    task
                                                )
                                            }
                                            className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                        >
                                            View
                                        </button>

                                        {!isApproved(
                                            task
                                        ) && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleOpenReview(
                                                        task
                                                    )
                                                }
                                                className="flex-1 rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                                            >
                                                Review
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>
            )}

            {/* =================================================
                DETAILS MODAL
            ================================================= */}

            {showDetails &&
                selectedTask && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                        <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-2xl">
                            <div className="flex items-start justify-between border-b border-gray-200 px-6 py-5">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        Completed Task
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Task ID:{" "}
                                        {getTaskId(
                                            selectedTask
                                        )}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowDetails(
                                            false
                                        );
                                        setSelectedTask(
                                            null
                                        );
                                    }}
                                    className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="space-y-6 p-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {getTaskTitle(
                                            selectedTask
                                        )}
                                    </h3>

                                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-600">
                                        {getDescription(
                                            selectedTask
                                        ) ||
                                            "No description available."}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="rounded-lg border border-gray-200 p-4">
                                        <p className="text-xs uppercase tracking-wide text-gray-500">
                                            Project
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-gray-900">
                                            {getProjectName(
                                                selectedTask
                                            )}
                                        </p>
                                    </div>

                                    <div className="rounded-lg border border-gray-200 p-4">
                                        <p className="text-xs uppercase tracking-wide text-gray-500">
                                            Sprint
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-gray-900">
                                            {getSprintName(
                                                selectedTask
                                            )}
                                        </p>
                                    </div>

                                    <div className="rounded-lg border border-gray-200 p-4">
                                        <p className="text-xs uppercase tracking-wide text-gray-500">
                                            Contributor
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-gray-900">
                                            {getAssigneeName(
                                                selectedTask
                                            )}
                                        </p>
                                    </div>

                                    <div className="rounded-lg border border-gray-200 p-4">
                                        <p className="text-xs uppercase tracking-wide text-gray-500">
                                            Priority
                                        </p>

                                        <div className="mt-2">
                                            <PriorityBadge
                                                priority={getPriority(
                                                    selectedTask
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className="rounded-lg border border-gray-200 p-4">
                                        <p className="text-xs uppercase tracking-wide text-gray-500">
                                            Completed At
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-gray-900">
                                            {formatDateTime(
                                                getCompletedAt(
                                                    selectedTask
                                                )
                                            )}
                                        </p>
                                    </div>

                                    <div className="rounded-lg border border-gray-200 p-4">
                                        <p className="text-xs uppercase tracking-wide text-gray-500">
                                            Deadline
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-gray-900">
                                            {formatDate(
                                                getDeadline(
                                                    selectedTask
                                                )
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between">
                                        <p className="text-sm font-semibold text-gray-900">
                                            Completion
                                        </p>

                                        <p className="text-sm font-semibold text-gray-700">
                                            {getProgress(
                                                selectedTask
                                            )}
                                            %
                                        </p>
                                    </div>

                                    <div className="mt-2 h-3 overflow-hidden rounded-full bg-gray-200">
                                        <div
                                            className="h-full rounded-full bg-green-600"
                                            style={{
                                                width: `${getProgress(
                                                    selectedTask
                                                )}%`,
                                            }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs uppercase tracking-wide text-gray-500">
                                        Review Status
                                    </p>

                                    <div className="mt-2">
                                        <ReviewBadge
                                            status={getReviewStatus(
                                                selectedTask
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 border-t border-gray-200 px-6 py-5">
                                {!isApproved(
                                    selectedTask
                                ) && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowDetails(
                                                false
                                            );
                                            handleOpenReview(
                                                selectedTask
                                            );
                                        }}
                                        className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                                    >
                                        Review Task
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowDetails(
                                            false
                                        );
                                        setSelectedTask(
                                            null
                                        );
                                    }}
                                    className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            {/* =================================================
                REVIEW MODAL
            ================================================= */}

            {showReview &&
                selectedTask && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                        <div className="w-full max-w-xl rounded-xl bg-white shadow-2xl">
                            <div className="flex items-start justify-between border-b border-gray-200 px-6 py-5">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        Review Completed Task
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-500">
                                        {
                                            getTaskTitle(
                                                selectedTask
                                            )
                                        }
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    disabled={
                                        isSaving
                                    }
                                    onClick={() => {
                                        setShowReview(
                                            false
                                        );
                                        setSelectedTask(
                                            null
                                        );
                                    }}
                                    className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
                                >
                                    ×
                                </button>
                            </div>

                            <form
                                onSubmit={
                                    handleSubmitReview
                                }
                                className="space-y-6 p-6"
                            >
                                {error && (
                                    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                                        <p className="text-sm text-red-700">
                                            {
                                                error
                                            }
                                        </p>
                                    </div>
                                )}

                                <div>
                                    <p className="mb-3 text-sm font-semibold text-gray-900">
                                        Review Decision
                                    </p>

                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        {REVIEW_OPTIONS.map(
                                            (
                                                option
                                            ) => {
                                                const selected =
                                                    reviewDecision ===
                                                    option.value;

                                                return (
                                                    <button
                                                        key={
                                                            option.value
                                                        }
                                                        type="button"
                                                        disabled={
                                                            isSaving
                                                        }
                                                        onClick={() =>
                                                            setReviewDecision(
                                                                option.value
                                                            )
                                                        }
                                                        className={`rounded-lg border p-4 text-left transition ${
                                                            selected
                                                                ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                                                                : "border-gray-200 hover:bg-gray-50"
                                                        }`}
                                                    >
                                                        <p className="text-sm font-semibold text-gray-900">
                                                            {
                                                                option.value
                                                            }
                                                        </p>

                                                        <p className="mt-1 text-xs leading-5 text-gray-500">
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

                                <div>
                                    <label
                                        htmlFor="review-comment"
                                        className="mb-2 block text-sm font-semibold text-gray-900"
                                    >
                                        Review Comment
                                    </label>

                                    <textarea
                                        id="review-comment"
                                        rows={5}
                                        maxLength={
                                            2000
                                        }
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
                                        disabled={
                                            isSaving
                                        }
                                        placeholder={
                                            reviewDecision ===
                                            "Approved"
                                                ? "Add an optional approval comment..."
                                                : "Explain what needs to be changed..."
                                        }
                                        className="w-full resize-none rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                                    />

                                    <div className="mt-1 flex justify-end">
                                        <span className="text-xs text-gray-400">
                                            {
                                                reviewComment.length
                                            }
                                            /2000
                                        </span>
                                    </div>
                                </div>

                                {reviewDecision ===
                                    "Changes Requested" && (
                                    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                                        <p className="text-sm font-medium text-red-800">
                                            Changes Requested
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-red-700">
                                            The contributor should
                                            receive clear feedback
                                            explaining what must be
                                            corrected before the task
                                            can be approved.
                                        </p>
                                    </div>
                                )}

                                {reviewDecision ===
                                    "Approved" && (
                                    <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                                        <p className="text-sm font-medium text-green-800">
                                            Approve Completed Task
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-green-700">
                                            The task will be recorded
                                            as reviewed and approved.
                                        </p>
                                    </div>
                                )}

                                <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end">
                                    <button
                                        type="button"
                                        disabled={
                                            isSaving
                                        }
                                        onClick={() => {
                                            setShowReview(
                                                false
                                            );
                                            setSelectedTask(
                                                null
                                            );
                                        }}
                                        className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={
                                            isSaving
                                        }
                                        className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 ${
                                            reviewDecision ===
                                            "Approved"
                                                ? "bg-green-600 hover:bg-green-700"
                                                : "bg-red-600 hover:bg-red-700"
                                        }`}
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
                                            ? "Saving..."
                                            : reviewDecision ===
                                              "Approved"
                                            ? "Approve Task"
                                            : "Request Changes"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
        </div>
    );
}