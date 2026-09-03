import React, { useEffect, useMemo, useState } from "react";
import {
    AlertCircle,
    BrainCircuit,
    CalendarDays,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Clock3,
    Code2,
    Loader2,
    Lock,
    RefreshCw,
    Sparkles,
    Target,
    UserRound,
    Wrench,
} from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import { getTaskSubtasks, updateAISubtaskStatus } from "@/services/subTaskService";


/* =========================================================
   STATUS HELPERS
========================================================= */

const normalizeStatus = (status) => {
    if (status === null || status === undefined) {
        return "To Do";
    }

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

    const value = String(status).trim().toLowerCase();

    switch (value) {
        case "todo":
        case "to do":
        case "pending":
            return "To Do";

        case "inprogress":
        case "in progress":
        case "in_progress":
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
};


const statusToNumber = (status) => {
    switch (normalizeStatus(status)) {
        case "To Do":
            return 1;

        case "In Progress":
            return 2;

        case "Review":
            return 3;

        case "Completed":
            return 4;

        case "Blocked":
            return 5;

        default:
            return 1;
    }
};


const normalizePriority = (priority) => {
    if (priority === null || priority === undefined) {
        return "Medium";
    }

    if (typeof priority === "number") {
        switch (priority) {
            case 1:
                return "Low";
            case 2:
                return "Medium";
            case 3:
                return "High";
            case 4:
                return "Critical";
            default:
                return "Medium";
        }
    }

    const value = String(priority).trim().toLowerCase();

    switch (value) {
        case "low":
            return "Low";

        case "medium":
        case "normal":
            return "Medium";

        case "high":
            return "High";

        case "critical":
        case "urgent":
            return "Critical";

        default:
            return "Medium";
    }
};


const normalizeProgress = (value) => {
    const progress = Number(value);

    if (Number.isNaN(progress)) {
        return 0;
    }

    return Math.min(100, Math.max(0, progress));
};


const formatDate = (dateValue) => {
    if (!dateValue) {
        return "Not specified";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "Not specified";
    }

    return date.toLocaleDateString();
};


const getErrorMessage = (error) => {
    if (!error) {
        return "Something went wrong.";
    }

    if (error.response?.data?.message) {
        return error.response.data.message;
    }

    if (error.response?.data?.title) {
        return error.response.data.title;
    }

    if (typeof error.response?.data === "string") {
        return error.response.data;
    }

    if (error.message) {
        return error.message;
    }

    return "Something went wrong.";
};


/* =========================================================
   SUBTASK MAPPER
========================================================= */

const mapSubtask = (subtask) => {
    if (!subtask) {
        return null;
    }

    return {
        id:
            subtask.id ??
            subtask.subTaskId ??
            subtask.subtaskId,

        taskId:
            subtask.taskId ??
            subtask.parentTaskId,

        title:
            subtask.title ??
            subtask.name ??
            "Untitled AI Subtask",

        description:
            subtask.description ??
            "",

        priority: normalizePriority(
            subtask.priority
        ),

        status: normalizeStatus(
            subtask.status
        ),

        progress: normalizeProgress(
            subtask.progress ??
            subtask.progressPercentage ??
            0
        ),

        estimatedHours:
            subtask.estimatedHours ??
            subtask.estimatedTime ??
            null,

        dueDate:
            subtask.dueDate ??
            null,

        dependencies:
            subtask.dependencies ??
            subtask.dependencyIds ??
            [],

        workType:
            subtask.workType ??
            subtask.type ??
            null,

        recommendedSpecialization:
            subtask.recommendedSpecialization ??
            subtask.specialization ??
            null,

        isAIGenerated:
            subtask.isAIGenerated !== false,

        aiRecommendation:
            subtask.aiRecommendation ??
            subtask.recommendation ??
            null,

        createdAt:
            subtask.createdAt ??
            null,

        updatedAt:
            subtask.updatedAt ??
            null,
    };
};


/* =========================================================
   COMPONENT
========================================================= */

const ViewAISubtasks = ({ task }) => {
    const [subtasks, setSubtasks] = useState([]);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [expandedId, setExpandedId] = useState(null);

    const [updatingId, setUpdatingId] = useState(null);

    const [updateError, setUpdateError] = useState("");

    /*
     * Local editing values.
     *
     * We keep these separate from the actual subtask object
     * so the UI can be edited before saving.
     */
    const [editingStatus, setEditingStatus] = useState({});

    const [editingProgress, setEditingProgress] = useState({});


    /* =====================================================
       LOAD AI SUBTASKS
    ===================================================== */

    const loadSubtasks = async () => {
        if (!task?.id) {
            setSubtasks([]);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await getTaskSubtasks(task.id);

            let data = response;

            /*
             * Support different API response wrappers.
             */
            if (Array.isArray(response)) {
                data = response;
            } else if (Array.isArray(response?.data)) {
                data = response.data;
            } else if (Array.isArray(response?.subtasks)) {
                data = response.subtasks;
            } else if (Array.isArray(response?.subTasks)) {
                data = response.subTasks;
            } else if (Array.isArray(response?.items)) {
                data = response.items;
            } else {
                data = [];
            }

            /*
             * Developer should only see AI-generated subtasks.
             */
            const aiSubtasks = data
                .filter(
                    (subtask) =>
                        subtask?.isAIGenerated !== false
                )
                .map(mapSubtask)
                .filter(Boolean);

            setSubtasks(aiSubtasks);

            /*
             * Initialize local controls from backend values.
             */
            const initialStatuses = {};
            const initialProgress = {};

            aiSubtasks.forEach((subtask) => {
                initialStatuses[subtask.id] = subtask.status;
                initialProgress[subtask.id] = subtask.progress;
            });

            setEditingStatus(initialStatuses);
            setEditingProgress(initialProgress);

        } catch (err) {
            console.error(
                "Failed to load AI subtasks:",
                err
            );

            setError(
                getErrorMessage(err) ||
                "Failed to load AI subtasks."
            );

            setSubtasks([]);

        } finally {
            setLoading(false);
        }
    };


    /* =====================================================
       LOAD WHEN TASK CHANGES
    ===================================================== */

    useEffect(() => {
        loadSubtasks();
    }, [task?.id]);


    /* =====================================================
       UPDATE AI SUBTASK STATUS / PROGRESS
    ===================================================== */

    const handleAISubtaskUpdate = async (subtask) => {
        if (!subtask?.id) {
            return;
        }

        const nextStatus =
            editingStatus[subtask.id] ??
            subtask.status;

        const nextProgress = normalizeProgress(
            editingProgress[subtask.id] ??
            subtask.progress
        );

        /*
         * Completed subtasks cannot be modified by backend.
         */
        if (subtask.status === "Completed") {
            setUpdateError(
                "Completed AI subtasks cannot be modified."
            );
            return;
        }

        try {
            setUpdatingId(subtask.id);
            setUpdateError("");

            const response =
                await updateAISubtaskStatus(
                    subtask.id,
                    statusToNumber(nextStatus),
                    nextProgress
                );

            /*
             * Backend response:
             *
             * {
             *   message: "...",
             *   subtask: {...}
             * }
             */
            const updatedBackendSubtask =
                response?.subtask ??
                response?.data?.subtask ??
                response?.data ??
                response;

            const mappedUpdatedSubtask =
                mapSubtask(updatedBackendSubtask);

            if (
                mappedUpdatedSubtask?.id
            ) {
                setSubtasks((current) =>
                    current.map((item) =>
                        item.id === subtask.id
                            ? mappedUpdatedSubtask
                            : item
                    )
                );

                setEditingStatus((current) => ({
                    ...current,
                    [subtask.id]:
                        mappedUpdatedSubtask.status,
                }));

                setEditingProgress((current) => ({
                    ...current,
                    [subtask.id]:
                        mappedUpdatedSubtask.progress,
                }));
            } else {
                /*
                 * If response format is different,
                 * reload from backend.
                 */
                await loadSubtasks();
            }

        } catch (err) {
            console.error(
                "Failed to update AI subtask:",
                err
            );

            setUpdateError(
                getErrorMessage(err) ||
                "Failed to update AI subtask."
            );

            /*
             * Restore current values from the actual
             * subtask if save failed.
             */
            setEditingStatus((current) => ({
                ...current,
                [subtask.id]: subtask.status,
            }));

            setEditingProgress((current) => ({
                ...current,
                [subtask.id]: subtask.progress,
            }));

        } finally {
            setUpdatingId(null);
        }
    };


    /* =====================================================
       STATUS CHANGE
    ===================================================== */

    const handleStatusChange = (
        subtaskId,
        status
    ) => {
        setEditingStatus((current) => ({
            ...current,
            [subtaskId]: status,
        }));

        setUpdateError("");
    };


    /* =====================================================
       PROGRESS CHANGE
    ===================================================== */

    const handleProgressChange = (
        subtaskId,
        value
    ) => {
        const progress = normalizeProgress(value);

        setEditingProgress((current) => ({
            ...current,
            [subtaskId]: progress,
        }));

        setUpdateError("");
    };


    /* =====================================================
       SUMMARY
    ===================================================== */

    const summary = useMemo(() => {
        const total = subtasks.length;

        const completed = subtasks.filter(
            (subtask) =>
                subtask.status === "Completed"
        ).length;

        const inProgress = subtasks.filter(
            (subtask) =>
                subtask.status === "In Progress"
        ).length;

        const averageProgress =
            total === 0
                ? 0
                : Math.round(
                    subtasks.reduce(
                        (sum, subtask) =>
                            sum +
                            normalizeProgress(
                                subtask.progress
                            ),
                        0
                    ) / total
                );

        return {
            total,
            completed,
            inProgress,
            averageProgress,
        };
    }, [subtasks]);


    /* =====================================================
       NO TASK
    ===================================================== */

    if (!task) {
        return (
            <Card className="border-border/70 shadow-sm">
                <CardContent className="py-12 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                        <Target className="h-6 w-6 text-muted-foreground" />
                    </div>

                    <h3 className="font-semibold text-foreground">
                        No task selected
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Select a task to view its AI-generated subtasks.
                    </p>
                </CardContent>
            </Card>
        );
    }


    /* =====================================================
       MAIN UI
    ===================================================== */

    return (
        <div className="space-y-6">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-background shadow-sm">

                <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-blue-500/10 blur-3xl" />

                <div className="pointer-events-none absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-cyan-500/10 blur-3xl" />

                <div className="relative p-6">

                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

                        <div className="flex items-start gap-4">

                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
                                <BrainCircuit className="h-6 w-6 text-blue-600" />
                            </div>

                            <div>
                                <div className="flex flex-wrap items-center gap-2">

                                    <h2 className="text-xl font-semibold text-foreground">
                                        AI Subtasks
                                    </h2>

                                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-600">
                                        <Sparkles className="h-3 w-3" />
                                        AI Generated
                                    </span>

                                </div>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    AI-generated work items for the selected task.
                                </p>

                                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">

                                    <span className="font-medium text-foreground">
                                        Parent task:
                                    </span>

                                    <span className="rounded-md bg-muted px-2 py-1 text-muted-foreground">
                                        {task.title ??
                                            task.name ??
                                            "Selected Task"}
                                    </span>

                                </div>
                            </div>

                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={loadSubtasks}
                            disabled={loading}
                            className="shrink-0"
                        >
                            {loading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <RefreshCw className="mr-2 h-4 w-4" />
                            )}

                            Refresh
                        </Button>

                    </div>

                </div>
            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
                <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">

                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

                    <div>
                        <p className="font-medium">
                            Unable to load AI subtasks
                        </p>

                        <p className="mt-1">
                            {error}
                        </p>
                    </div>

                </div>
            )}


            {/* =================================================
                UPDATE ERROR
            ================================================= */}

            {updateError && (
                <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">

                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

                    <div>
                        <p className="font-medium">
                            Update failed
                        </p>

                        <p className="mt-1">
                            {updateError}
                        </p>
                    </div>

                </div>
            )}


            {/* =================================================
                SUMMARY
            ================================================= */}

            {!loading && subtasks.length > 0 && (
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

                    <Card className="border-border/70 shadow-sm">
                        <CardContent className="p-4">

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                                    <Target className="h-5 w-5 text-blue-600" />
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Total
                                    </p>

                                    <p className="text-2xl font-bold">
                                        {summary.total}
                                    </p>
                                </div>

                            </div>

                        </CardContent>
                    </Card>


                    <Card className="border-border/70 shadow-sm">
                        <CardContent className="p-4">

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Completed
                                    </p>

                                    <p className="text-2xl font-bold">
                                        {summary.completed}
                                    </p>
                                </div>

                            </div>

                        </CardContent>
                    </Card>


                    <Card className="border-border/70 shadow-sm">
                        <CardContent className="p-4">

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                                    <Clock3 className="h-5 w-5 text-orange-600" />
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        In Progress
                                    </p>

                                    <p className="text-2xl font-bold">
                                        {summary.inProgress}
                                    </p>
                                </div>

                            </div>

                        </CardContent>
                    </Card>


                    <Card className="border-border/70 shadow-sm">
                        <CardContent className="p-4">

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10">
                                    <ActivityIcon />
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Avg. Progress
                                    </p>

                                    <p className="text-2xl font-bold">
                                        {summary.averageProgress}%
                                    </p>
                                </div>

                            </div>

                        </CardContent>
                    </Card>

                </div>
            )}


            {/* =================================================
                LOADING
            ================================================= */}

            {loading && (
                <Card className="border-border/70 shadow-sm">
                    <CardContent className="py-12 text-center">

                        <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />

                        <p className="mt-3 text-sm text-muted-foreground">
                            Loading AI subtasks...
                        </p>

                    </CardContent>
                </Card>
            )}


            {/* =================================================
                EMPTY
            ================================================= */}

            {!loading &&
                !error &&
                subtasks.length === 0 && (
                    <Card className="border-border/70 shadow-sm">
                        <CardContent className="py-12 text-center">

                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                                <BrainCircuit className="h-6 w-6 text-muted-foreground" />
                            </div>

                            <h3 className="font-semibold text-foreground">
                                No AI subtasks found
                            </h3>

                            <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
                                There are currently no AI-generated subtasks
                                available for this task.
                            </p>

                        </CardContent>
                    </Card>
                )}


            {/* =================================================
                SUBTASK LIST
            ================================================= */}

            {!loading && subtasks.length > 0 && (
                <div className="space-y-4">

                    {subtasks.map((subtask) => {

                        const isExpanded =
                            expandedId === subtask.id;

                        const isUpdating =
                            updatingId === subtask.id;

                        const currentStatus =
                            editingStatus[subtask.id] ??
                            subtask.status;

                        const currentProgress =
                            normalizeProgress(
                                editingProgress[subtask.id] ??
                                subtask.progress
                            );

                        const isCompleted =
                            subtask.status === "Completed";

                        const hasChanges =
                            normalizeStatus(
                                currentStatus
                            ) !==
                                normalizeStatus(
                                    subtask.status
                                ) ||
                            currentProgress !==
                                normalizeProgress(
                                    subtask.progress
                                );

                        return (
                            <Card
                                key={subtask.id}
                                className="overflow-hidden border-border/70 shadow-sm transition-all duration-200 hover:shadow-md"
                            >

                                {/* =========================================
                                    SUBTASK HEADER
                                ========================================= */}

                                <CardHeader className="pb-3">

                                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                                        <div className="flex min-w-0 gap-3">

                                            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
                                                <Sparkles className="h-5 w-5 text-blue-600" />
                                            </div>

                                            <div className="min-w-0">

                                                <div className="flex flex-wrap items-center gap-2">

                                                    <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[11px] font-medium text-blue-600">
                                                        AI
                                                    </span>

                                                    <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                                                        {subtask.priority}
                                                    </span>

                                                </div>

                                                <CardTitle className="mt-2 text-base leading-6">
                                                    {subtask.title}
                                                </CardTitle>

                                                {subtask.description && (
                                                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                                        {subtask.description}
                                                    </p>
                                                )}

                                            </div>

                                        </div>


                                        {/* Status */}
                                        <div className="flex shrink-0 items-center gap-2">

                                            <span className="text-xs font-medium text-muted-foreground">
                                                Status
                                            </span>

                                            <select
                                                value={currentStatus}
                                                disabled={
                                                    isUpdating ||
                                                    isCompleted
                                                }
                                                onChange={(event) =>
                                                    handleStatusChange(
                                                        subtask.id,
                                                        event.target.value
                                                    )
                                                }
                                                className="h-9 rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                <option value="To Do">
                                                    To Do
                                                </option>

                                                <option value="In Progress">
                                                    In Progress
                                                </option>

                                                <option value="Review">
                                                    Review
                                                </option>

                                                <option value="Completed">
                                                    Completed
                                                </option>

                                                <option value="Blocked">
                                                    Blocked
                                                </option>

                                            </select>

                                        </div>

                                    </div>

                                </CardHeader>


                                {/* =========================================
                                    CONTENT
                                ========================================= */}

                                <CardContent className="space-y-5">

                                    {/* -----------------------------------------
                                        METADATA
                                    ----------------------------------------- */}

                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

                                        <div className="rounded-lg border border-border/60 bg-muted/30 p-3">

                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Clock3 className="h-4 w-4" />
                                                Estimated Hours
                                            </div>

                                            <p className="mt-1 text-sm font-medium">
                                                {subtask.estimatedHours ??
                                                    "Not specified"}
                                            </p>

                                        </div>


                                        <div className="rounded-lg border border-border/60 bg-muted/30 p-3">

                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <CalendarDays className="h-4 w-4" />
                                                Due Date
                                            </div>

                                            <p className="mt-1 text-sm font-medium">
                                                {formatDate(
                                                    subtask.dueDate
                                                )}
                                            </p>

                                        </div>


                                        <div className="rounded-lg border border-border/60 bg-muted/30 p-3">

                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Wrench className="h-4 w-4" />
                                                Work Type
                                            </div>

                                            <p className="mt-1 text-sm font-medium">
                                                {subtask.workType ??
                                                    "Not specified"}
                                            </p>

                                        </div>


                                        <div className="rounded-lg border border-border/60 bg-muted/30 p-3">

                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Code2 className="h-4 w-4" />
                                                Specialization
                                            </div>

                                            <p className="mt-1 text-sm font-medium">
                                                {subtask.recommendedSpecialization ??
                                                    "Not specified"}
                                            </p>

                                        </div>

                                    </div>


                                    {/* -----------------------------------------
                                        PROGRESS
                                    ----------------------------------------- */}

                                    <div className="rounded-xl border border-border/60 bg-background p-4">

                                        <div className="flex items-center justify-between gap-3">

                                            <div>
                                                <p className="text-sm font-medium">
                                                    Progress
                                                </p>

                                                <p className="mt-0.5 text-xs text-muted-foreground">
                                                    Update your progress for this AI subtask.
                                                </p>
                                            </div>

                                            <span className="text-sm font-semibold">
                                                {currentProgress}%
                                            </span>

                                        </div>


                                        <div className="mt-3">
                                            <Progress
                                                value={currentProgress}
                                                className="h-2"
                                            />
                                        </div>


                                        <div className="mt-4 flex items-center gap-3">

                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                step="5"
                                                value={currentProgress}
                                                disabled={
                                                    isUpdating ||
                                                    isCompleted
                                                }
                                                onChange={(event) =>
                                                    handleProgressChange(
                                                        subtask.id,
                                                        Number(
                                                            event.target.value
                                                        )
                                                    )
                                                }
                                                className="w-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                                            />

                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={currentProgress}
                                                disabled={
                                                    isUpdating ||
                                                    isCompleted
                                                }
                                                onChange={(event) =>
                                                    handleProgressChange(
                                                        subtask.id,
                                                        Number(
                                                            event.target.value
                                                        )
                                                    )
                                                }
                                                className="h-9 w-20 rounded-md border border-border bg-background px-2 text-center text-sm outline-none focus:ring-2 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                                            />

                                        </div>


                                        {/* Save button */}

                                        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">

                                                <Lock className="h-3.5 w-3.5" />

                                                <span>
                                                    AI definition is read-only.
                                                </span>

                                            </div>


                                            <Button
                                                size="sm"
                                                onClick={() =>
                                                    handleAISubtaskUpdate(
                                                        subtask
                                                    )
                                                }
                                                disabled={
                                                    isUpdating ||
                                                    isCompleted ||
                                                    !hasChanges
                                                }
                                            >

                                                {isUpdating ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Saving...
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                                        Save Progress
                                                    </>
                                                )}

                                            </Button>

                                        </div>

                                    </div>


                                    {/* -----------------------------------------
                                        EXPAND DETAILS
                                    ----------------------------------------- */}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setExpandedId(
                                                isExpanded
                                                    ? null
                                                    : subtask.id
                                            )
                                        }
                                        className="flex w-full items-center justify-between rounded-lg border border-border/60 bg-muted/20 px-4 py-3 text-left text-sm transition-colors hover:bg-muted/40"
                                    >

                                        <span className="font-medium">
                                            Subtask Details
                                        </span>

                                        {isExpanded ? (
                                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                        )}

                                    </button>


                                    {/* -----------------------------------------
                                        EXPANDED DETAILS
                                    ----------------------------------------- */}

                                    {isExpanded && (
                                        <div className="space-y-4 rounded-xl border border-border/60 bg-muted/20 p-4">

                                            {/* Specialization */}

                                            <div>

                                                <div className="mb-1 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                                    <UserRound className="h-4 w-4" />
                                                    Recommended Specialization
                                                </div>

                                                <p className="text-sm">
                                                    {subtask.recommendedSpecialization ??
                                                        "Not specified"}
                                                </p>

                                            </div>


                                            {/* Work Type */}

                                            <div>

                                                <div className="mb-1 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                                    <Wrench className="h-4 w-4" />
                                                    Work Type
                                                </div>

                                                <p className="text-sm">
                                                    {subtask.workType ??
                                                        "Not specified"}
                                                </p>

                                            </div>


                                            {/* Dependencies */}

                                            <div>

                                                <div className="mb-1 text-xs font-medium text-muted-foreground">
                                                    Dependencies
                                                </div>

                                                {Array.isArray(
                                                    subtask.dependencies
                                                ) &&
                                                    subtask.dependencies.length >
                                                    0 ? (
                                                    <div className="flex flex-wrap gap-2">

                                                        {subtask.dependencies.map(
                                                            (
                                                                dependency,
                                                                index
                                                            ) => (
                                                                <span
                                                                    key={`${dependency}-${index}`}
                                                                    className="rounded-md bg-background px-2 py-1 text-xs"
                                                                >
                                                                    {typeof dependency ===
                                                                        "object"
                                                                        ? dependency.title ??
                                                                        dependency.id ??
                                                                        `Dependency ${index + 1}`
                                                                        : dependency}
                                                                </span>
                                                            )
                                                        )}

                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-muted-foreground">
                                                        No dependencies specified.
                                                    </p>
                                                )}

                                            </div>


                                            {/* AI Recommendation */}

                                            <div>

                                                <div className="mb-1 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                                    <Sparkles className="h-4 w-4" />
                                                    AI Recommendation
                                                </div>

                                                <p className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3 text-sm leading-6">
                                                    {subtask.aiRecommendation ??
                                                        "No additional AI recommendation available."}
                                                </p>

                                            </div>


                                            {/* IDs */}

                                            <div className="grid gap-3 sm:grid-cols-2">

                                                <div>
                                                    <p className="text-xs font-medium text-muted-foreground">
                                                        Subtask ID
                                                    </p>

                                                    <p className="mt-1 break-all font-mono text-xs">
                                                        {subtask.id}
                                                    </p>
                                                </div>


                                                <div>
                                                    <p className="text-xs font-medium text-muted-foreground">
                                                        Parent Task ID
                                                    </p>

                                                    <p className="mt-1 break-all font-mono text-xs">
                                                        {subtask.taskId ??
                                                            task.id}
                                                    </p>
                                                </div>

                                            </div>


                                            {/* Read-only notice */}

                                            <div className="flex items-start gap-2 rounded-lg border border-border/60 bg-background p-3">

                                                <Lock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

                                                <p className="text-xs leading-5 text-muted-foreground">
                                                    This subtask was generated by AI.
                                                    As a Contributor, you can update
                                                    its status and progress only.
                                                    The title, description,
                                                    assignment, AI recommendation,
                                                    and definition cannot be changed
                                                    from this view.
                                                </p>

                                            </div>

                                        </div>
                                    )}

                                </CardContent>

                            </Card>
                        );
                    })}

                </div>
            )}


            {/* =================================================
                PERMISSION NOTICE
            ================================================= */}

            {!loading && subtasks.length > 0 && (
                <div className="flex items-start gap-3 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">

                    <Lock className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

                    <div>

                        <p className="text-sm font-medium text-foreground">
                            Contributor permissions
                        </p>

                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                            You can update the status and progress of AI
                            subtasks assigned to you. AI-generated definitions,
                            assignments, deletion, regeneration, title, and
                            description remain read-only.
                        </p>

                    </div>

                </div>
            )}

        </div>
    );
};


/* =========================================================
   SMALL ACTIVITY ICON
========================================================= */

const ActivityIcon = () => {
    return (
        <div className="flex h-5 w-5 items-center justify-center">
            <div className="flex items-end gap-[2px]">
                <span className="h-2 w-1 rounded-sm bg-current" />
                <span className="h-4 w-1 rounded-sm bg-current" />
                <span className="h-3 w-1 rounded-sm bg-current" />
                <span className="h-5 w-1 rounded-sm bg-current" />
            </div>
        </div>
    );
};


export default ViewAISubtasks;