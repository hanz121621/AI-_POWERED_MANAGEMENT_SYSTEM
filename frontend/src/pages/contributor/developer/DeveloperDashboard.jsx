import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Activity,
    AlertCircle,
    ArrowRight,
    BrainCircuit,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Code2,
    FileText,
    FolderKanban,
    ListTodo,
    Loader2,
    RefreshCw,
    Sparkles,
    Target,
    TrendingUp,
    UserRound,
    XCircle,
    Zap,
} from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import {
    getMyWork,
    updateMyTaskStatus,
} from "@/services/taskService";

import {
    getTaskSubtasks,
    updateAISubtaskStatus,
} from "@/services/subTaskService";


// ---------------------------------------------------------
// STATUS HELPERS
// ---------------------------------------------------------

const STATUS = {
    TODO: 1,
    IN_PROGRESS: 2,
    IN_REVIEW: 3,
    COMPLETED: 4,
    BLOCKED: 5,
};

const STATUS_META = {
    1: {
        label: "To Do",
        className:
            "bg-slate-100 text-slate-700 border-slate-200",
    },
    2: {
        label: "In Progress",
        className:
            "bg-blue-50 text-blue-700 border-blue-200",
    },
    3: {
        label: "In Review",
        className:
            "bg-violet-50 text-violet-700 border-violet-200",
    },
    4: {
        label: "Completed",
        className:
            "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    5: {
        label: "Blocked",
        className:
            "bg-red-50 text-red-700 border-red-200",
    },
};

const PRIORITY_META = {
    1: {
        label: "Low",
        className: "text-slate-600",
    },
    2: {
        label: "Medium",
        className: "text-blue-600",
    },
    3: {
        label: "High",
        className: "text-orange-600",
    },
    4: {
        label: "Critical",
        className: "text-red-600",
    },
};


// ---------------------------------------------------------
// NORMALIZERS
// ---------------------------------------------------------

const getId = (item) =>
    item?.id ??
    item?.taskId ??
    item?.taskID ??
    item?.Id ??
    item?.TaskId;

const normalizeStatus = (value) => {
    if (typeof value === "number") {
        return value;
    }

    if (typeof value === "string") {
        const normalized = value.toLowerCase().replace(/\s+/g, "");

        switch (normalized) {
            case "todo":
            case "tobedone":
                return STATUS.TODO;

            case "inprogress":
                return STATUS.IN_PROGRESS;

            case "inreview":
            case "review":
                return STATUS.IN_REVIEW;

            case "completed":
            case "complete":
                return STATUS.COMPLETED;

            case "blocked":
                return STATUS.BLOCKED;

            default:
                return STATUS.TODO;
        }
    }

    return STATUS.TODO;
};

const normalizePriority = (value) => {
    if (typeof value === "number") {
        return value;
    }

    if (typeof value === "string") {
        const normalized = value.toLowerCase();

        if (normalized === "low") return 1;
        if (normalized === "medium") return 2;
        if (normalized === "high") return 3;
        if (normalized === "critical") return 4;
    }

    return 2;
};

const normalizeTask = (task) => {
    const status = normalizeStatus(
        task?.status ??
        task?.Status ??
        task?.taskStatus
    );

    const priority = normalizePriority(
        task?.priority ??
        task?.Priority
    );

    const progress = Number(
        task?.progress ??
        task?.progressPercentage ??
        task?.Progress ??
        0
    );

    return {
        ...task,

        id: getId(task),

        title:
            task?.title ??
            task?.name ??
            task?.taskName ??
            "Untitled Task",

        description:
            task?.description ??
            task?.details ??
            "",

        status,

        priority,

        progress: Math.min(
            100,
            Math.max(0, progress)
        ),

        projectName:
            task?.projectName ??
            task?.project?.name ??
            task?.project?.title ??
            "Project",

        sprintName:
            task?.sprintName ??
            task?.sprint?.name ??
            task?.sprint?.title ??
            null,

        dueDate:
            task?.dueDate ??
            task?.deadline ??
            task?.DueDate ??
            null,

        createdAt:
            task?.createdAt ??
            task?.CreatedAt ??
            null,

        updatedAt:
            task?.updatedAt ??
            task?.UpdatedAt ??
            null,
    };
};

const normalizeSubtask = (subtask) => {
    const status = normalizeStatus(
        subtask?.status ??
        subtask?.Status
    );

    const progress = Number(
        subtask?.progress ??
        subtask?.progressPercentage ??
        subtask?.Progress ??
        0
    );

    return {
        ...subtask,

        id:
            subtask?.id ??
            subtask?.subTaskId ??
            subtask?.subtaskId ??
            subtask?.Id,

        title:
            subtask?.title ??
            subtask?.name ??
            "Untitled Subtask",

        description:
            subtask?.description ??
            "",

        status,

        progress: Math.min(
            100,
            Math.max(0, progress)
        ),

        estimatedHours:
            subtask?.estimatedHours ??
            subtask?.EstimatedHours ??
            null,

        isAIGenerated:
            subtask?.isAIGenerated ??
            subtask?.IsAIGenerated ??
            true,

        aiRecommendation:
            subtask?.aiRecommendation ??
            subtask?.AIRecommendation ??
            null,
    };
};


// ---------------------------------------------------------
// DATE HELPERS
// ---------------------------------------------------------

const formatDate = (date) => {
    if (!date) return "No deadline";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
        return "No deadline";
    }

    return parsed.toLocaleDateString(
        undefined,
        {
            month: "short",
            day: "numeric",
            year: "numeric",
        }
    );
};

const formatRelativeTime = (date) => {
    if (!date) return "No recent activity";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
        return "No recent activity";
    }

    const now = new Date();
    const diff = now.getTime() - parsed.getTime();

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) {
        return "Just now";
    }

    if (minutes < 60) {
        return `${minutes}m ago`;
    }

    if (hours < 24) {
        return `${hours}h ago`;
    }

    if (days < 7) {
        return `${days}d ago`;
    }

    return formatDate(date);
};

const isOverdue = (task) => {
    if (!task?.dueDate) return false;

    if (task.status === STATUS.COMPLETED) {
        return false;
    }

    const deadline = new Date(task.dueDate);

    if (Number.isNaN(deadline.getTime())) {
        return false;
    }

    return deadline.getTime() < Date.now();
};


// ---------------------------------------------------------
// API RESPONSE NORMALIZATION
// ---------------------------------------------------------

const extractArray = (response) => {
    if (Array.isArray(response)) {
        return response;
    }

    if (Array.isArray(response?.data)) {
        return response.data;
    }

    if (Array.isArray(response?.tasks)) {
        return response.tasks;
    }

    if (Array.isArray(response?.items)) {
        return response.items;
    }

    if (Array.isArray(response?.subtasks)) {
        return response.subtasks;
    }

    if (Array.isArray(response?.subTasks)) {
        return response.subTasks;
    }

    return [];
};

const getApiErrorMessage = (error) => {
    return (
        error?.response?.data?.message ||
        error?.response?.data?.title ||
        error?.message ||
        "Unable to load dashboard data."
    );
};


// ---------------------------------------------------------
// COMPONENT
// ---------------------------------------------------------

export default function DeveloperDashboard() {
    const navigate = useNavigate();

    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);

    const [subtasks, setSubtasks] = useState([]);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [error, setError] = useState("");

    const [taskUpdatingId, setTaskUpdatingId] =
        useState(null);

    const [subtaskUpdatingId, setSubtaskUpdatingId] =
        useState(null);

    const [subtaskError, setSubtaskError] =
        useState("");

    const [loadingSubtasks, setLoadingSubtasks] =
        useState(false);

    const [showAllTasks, setShowAllTasks] =
        useState(false);


    // -------------------------------------------------------
    // LOAD MY TASKS
    // -------------------------------------------------------

    const loadTasks = async ({
        silent = false,
    } = {}) => {
        try {
            if (!silent) {
                setLoading(true);
            } else {
                setRefreshing(true);
            }

            setError("");

            const response = await getMyWork();

            const data = extractArray(response)
                .map(normalizeTask)
                .filter((task) => task.id);

            setTasks(data);

            if (
                selectedTask &&
                !data.some(
                    (task) => task.id === selectedTask.id
                )
            ) {
                setSelectedTask(null);
                setSubtasks([]);
            }
        } catch (err) {
            console.error(
                "Developer dashboard task loading error:",
                err
            );

            setError(
                getApiErrorMessage(err)
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };


    // -------------------------------------------------------
    // INITIAL LOAD
    // -------------------------------------------------------

    useEffect(() => {
        loadTasks();
    }, []);


    // -------------------------------------------------------
    // LOAD AI SUBTASKS
    // -------------------------------------------------------

    const loadSubtasks = async (task) => {
        if (!task?.id) {
            setSubtasks([]);
            return;
        }

        try {
            setLoadingSubtasks(true);
            setSubtaskError("");

            const response =
                await getTaskSubtasks(task.id);

            const data = extractArray(response)
                .map(normalizeSubtask)
                .filter(
                    (subtask) =>
                        subtask.isAIGenerated !== false
                );

            setSubtasks(data);
        } catch (err) {
            console.error(
                "AI subtask loading error:",
                err
            );

            setSubtaskError(
                getApiErrorMessage(err)
            );

            setSubtasks([]);
        } finally {
            setLoadingSubtasks(false);
        }
    };


    // -------------------------------------------------------
    // SELECT TASK
    // -------------------------------------------------------

    const handleSelectTask = async (task) => {
        setSelectedTask(task);

        await loadSubtasks(task);
    };


    // -------------------------------------------------------
    // TASK STATUS UPDATE
    // -------------------------------------------------------

    const handleTaskStatusChange = async (
        task,
        nextStatus
    ) => {
        if (!task?.id) return;

        if (
            task.status === STATUS.COMPLETED &&
            Number(nextStatus) !== STATUS.COMPLETED
        ) {
            return;
        }

        try {
            setTaskUpdatingId(task.id);
            setError("");

            const response =
                await updateMyTaskStatus(
                    task.id,
                    Number(nextStatus)
                );

            const returnedTask =
                response?.task ??
                response?.Task ??
                response;

            setTasks((currentTasks) =>
                currentTasks.map((item) => {
                    if (item.id !== task.id) {
                        return item;
                    }

                    return normalizeTask({
                        ...item,
                        ...(returnedTask || {}),
                        status: Number(nextStatus),
                    });
                })
            );

            setSelectedTask((current) => {
                if (!current || current.id !== task.id) {
                    return current;
                }

                return normalizeTask({
                    ...current,
                    ...(returnedTask || {}),
                    status: Number(nextStatus),
                });
            });

        } catch (err) {
            console.error(
                "Task status update error:",
                err
            );

            setError(
                getApiErrorMessage(err)
            );
        } finally {
            setTaskUpdatingId(null);
        }
    };


    // -------------------------------------------------------
    // AI SUBTASK UPDATE
    // -------------------------------------------------------

    const handleSubtaskUpdate = async (
        subtask,
        nextStatus,
        nextProgress
    ) => {
        if (!subtask?.id) return;

        if (
            subtask.status === STATUS.COMPLETED
        ) {
            return;
        }

        const progress = Math.min(
            100,
            Math.max(
                0,
                Number(nextProgress)
            )
        );

        try {
            setSubtaskUpdatingId(subtask.id);
            setSubtaskError("");

            const response =
                await updateAISubtaskStatus(
                    subtask.id,
                    Number(nextStatus),
                    progress
                );

            const returnedSubtask =
                response?.subtask ??
                response?.SubTask ??
                response;

            setSubtasks((current) =>
                current.map((item) => {
                    if (
                        item.id !== subtask.id
                    ) {
                        return item;
                    }

                    return normalizeSubtask({
                        ...item,
                        ...(returnedSubtask || {}),
                        status: Number(nextStatus),
                        progress,
                    });
                })
            );

        } catch (err) {
            console.error(
                "AI subtask update error:",
                err
            );

            setSubtaskError(
                getApiErrorMessage(err)
            );
        } finally {
            setSubtaskUpdatingId(null);
        }
    };


    // -------------------------------------------------------
    // STATISTICS
    // -------------------------------------------------------

    const statistics = useMemo(() => {
        const total = tasks.length;

        const todo = tasks.filter(
            (task) =>
                task.status === STATUS.TODO
        ).length;

        const inProgress = tasks.filter(
            (task) =>
                task.status === STATUS.IN_PROGRESS
        ).length;

        const review = tasks.filter(
            (task) =>
                task.status === STATUS.IN_REVIEW
        ).length;

        const completed = tasks.filter(
            (task) =>
                task.status === STATUS.COMPLETED
        ).length;

        const blocked = tasks.filter(
            (task) =>
                task.status === STATUS.BLOCKED
        ).length;

        const overdue = tasks.filter(
            isOverdue
        ).length;

        const progress =
            total > 0
                ? Math.round(
                    tasks.reduce(
                        (sum, task) =>
                            sum +
                            Number(
                                task.progress || 0
                            ),
                        0
                    ) / total
                )
                : 0;

        return {
            total,
            todo,
            inProgress,
            review,
            completed,
            blocked,
            overdue,
            progress,
        };
    }, [tasks]);


    // -------------------------------------------------------
    // TASK LIST
    // -------------------------------------------------------

    const visibleTasks = useMemo(() => {
        if (showAllTasks) {
            return tasks;
        }

        return tasks.slice(0, 6);
    }, [tasks, showAllTasks]);


    // -------------------------------------------------------
    // RECENT ACTIVITY
    // -------------------------------------------------------

    const recentActivity = useMemo(() => {
        return [...tasks]
            .sort((a, b) => {
                const aDate =
                    new Date(
                        a.updatedAt ||
                        a.createdAt ||
                        0
                    ).getTime();

                const bDate =
                    new Date(
                        b.updatedAt ||
                        b.createdAt ||
                        0
                    ).getTime();

                return bDate - aDate;
            })
            .slice(0, 5)
            .map((task) => ({
                id: task.id,
                title: task.title,
                status: task.status,
                time:
                    task.updatedAt ||
                    task.createdAt,
            }));
    }, [tasks]);


    // -------------------------------------------------------
    // SELECTED TASK AI SUBTASK STATS
    // -------------------------------------------------------

    const subtaskStats = useMemo(() => {
        const total = subtasks.length;

        const completed = subtasks.filter(
            (subtask) =>
                subtask.status === STATUS.COMPLETED
        ).length;

        const inProgress = subtasks.filter(
            (subtask) =>
                subtask.status === STATUS.IN_PROGRESS
        ).length;

        const blocked = subtasks.filter(
            (subtask) =>
                subtask.status === STATUS.BLOCKED
        ).length;

        const progress =
            total > 0
                ? Math.round(
                    subtasks.reduce(
                        (sum, subtask) =>
                            sum +
                            Number(
                                subtask.progress || 0
                            ),
                        0
                    ) / total
                )
                : 0;

        return {
            total,
            completed,
            inProgress,
            blocked,
            progress,
        };
    }, [subtasks]);


    // -------------------------------------------------------
    // RENDER
    // -------------------------------------------------------

    return (
        <div className="relative min-h-screen bg-background text-foreground overflow-hidden">

            {/* Background decorations */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-32 -right-32 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
                <div className="absolute top-1/3 -left-32 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
            </div>


            <div className="relative z-10 space-y-6 p-4 md:p-6 lg:p-8">

                {/* ------------------------------------------------ */}
                {/* HEADER */}
                {/* ------------------------------------------------ */}

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                    <div>
                        <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                            <Code2 className="h-4 w-4" />
                            <span>Developer Workspace</span>
                        </div>

                        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                            My Dashboard
                        </h1>

                        <p className="mt-1 text-sm text-muted-foreground">
                            View your assigned work, track progress,
                            and manage your AI-generated subtasks.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">

                        <Button
                            variant="outline"
                            className="rounded-xl"
                            onClick={() =>
                                loadTasks({
                                    silent: true,
                                })
                            }
                            disabled={
                                loading ||
                                refreshing
                            }
                        >
                            {refreshing ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <RefreshCw className="mr-2 h-4 w-4" />
                            )}

                            Refresh
                        </Button>

                    </div>
                </div>


                {/* ------------------------------------------------ */}
                {/* ERROR */}
                {/* ------------------------------------------------ */}

                {error && (
                    <Card className="rounded-xl border-red-200 bg-red-50/60">
                        <CardContent className="flex items-center gap-3 p-4">

                            <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />

                            <div className="flex-1">
                                <p className="text-sm font-medium text-red-700">
                                    {error}
                                </p>

                                <p className="mt-1 text-xs text-red-600">
                                    Make sure your account is authenticated
                                    as a Contributor and the backend is running.
                                </p>
                            </div>

                            <Button
                                size="sm"
                                variant="outline"
                                className="border-red-200"
                                onClick={() =>
                                    loadTasks()
                                }
                            >
                                Retry
                            </Button>

                        </CardContent>
                    </Card>
                )}


                {/* ------------------------------------------------ */}
                {/* STATISTICS */}
                {/* ------------------------------------------------ */}

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                    <Card className="rounded-xl border-border/70 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                        <CardContent className="p-5">

                            <div className="flex items-center justify-between">

                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Assigned Tasks
                                    </p>

                                    <p className="mt-2 text-3xl font-bold">
                                        {loading
                                            ? "—"
                                            : statistics.total}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                                    <ListTodo className="h-6 w-6" />
                                </div>

                            </div>

                            <p className="mt-3 text-xs text-muted-foreground">
                                Tasks currently assigned to you
                            </p>

                        </CardContent>
                    </Card>


                    <Card className="rounded-xl border-border/70 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                        <CardContent className="p-5">

                            <div className="flex items-center justify-between">

                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        In Progress
                                    </p>

                                    <p className="mt-2 text-3xl font-bold">
                                        {loading
                                            ? "—"
                                            : statistics.inProgress}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-cyan-50 p-3 text-cyan-600">
                                    <Activity className="h-6 w-6" />
                                </div>

                            </div>

                            <p className="mt-3 text-xs text-muted-foreground">
                                Work currently being executed
                            </p>

                        </CardContent>
                    </Card>


                    <Card className="rounded-xl border-border/70 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                        <CardContent className="p-5">

                            <div className="flex items-center justify-between">

                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Completed
                                    </p>

                                    <p className="mt-2 text-3xl font-bold">
                                        {loading
                                            ? "—"
                                            : statistics.completed}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                                    <CheckCircle2 className="h-6 w-6" />
                                </div>

                            </div>

                            <p className="mt-3 text-xs text-muted-foreground">
                                Tasks completed
                            </p>

                        </CardContent>
                    </Card>


                    <Card className="rounded-xl border-border/70 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                        <CardContent className="p-5">

                            <div className="flex items-center justify-between">

                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Overall Progress
                                    </p>

                                    <p className="mt-2 text-3xl font-bold">
                                        {loading
                                            ? "—"
                                            : `${statistics.progress}%`}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
                                    <TrendingUp className="h-6 w-6" />
                                </div>

                            </div>

                            <Progress
                                value={
                                    statistics.progress
                                }
                                className="mt-4 h-2"
                            />

                        </CardContent>
                    </Card>

                </div>


                {/* ------------------------------------------------ */}
                {/* MAIN GRID */}
                {/* ------------------------------------------------ */}

                <div className="grid gap-6 lg:grid-cols-3">

                    {/* -------------------------------------------- */}
                    {/* TASKS */}
                    {/* -------------------------------------------- */}

                    <Card className="rounded-xl border-border/70 shadow-sm lg:col-span-2">

                        <CardHeader className="flex flex-row items-center justify-between">

                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <FolderKanban className="h-5 w-5 text-blue-600" />
                                    My Assigned Tasks
                                </CardTitle>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Tasks assigned to your Contributor account.
                                </p>
                            </div>

                            {tasks.length > 6 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                        setShowAllTasks(
                                            (value) => !value
                                        )
                                    }
                                >
                                    {showAllTasks
                                        ? "Show Less"
                                        : "View All"}

                                    <ArrowRight className="ml-1 h-4 w-4" />
                                </Button>
                            )}

                        </CardHeader>


                        <CardContent>

                            {loading ? (
                                <div className="flex min-h-[280px] items-center justify-center">

                                    <div className="text-center">

                                        <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />

                                        <p className="mt-3 text-sm text-muted-foreground">
                                            Loading your tasks...
                                        </p>

                                    </div>

                                </div>
                            ) : visibleTasks.length === 0 ? (

                                <div className="flex min-h-[280px] flex-col items-center justify-center text-center">

                                    <div className="rounded-2xl bg-muted p-4">
                                        <CheckCircle2 className="h-8 w-8 text-muted-foreground" />
                                    </div>

                                    <h3 className="mt-4 font-semibold">
                                        No assigned tasks
                                    </h3>

                                    <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                                        You currently don't have any tasks
                                        assigned to your account.
                                    </p>

                                </div>

                            ) : (

                                <div className="space-y-3">

                                    {visibleTasks.map((task) => {

                                        const status =
                                            STATUS_META[
                                                task.status
                                            ] ||
                                            STATUS_META[
                                                STATUS.TODO
                                            ];

                                        const priority =
                                            PRIORITY_META[
                                                task.priority
                                            ] ||
                                            PRIORITY_META[2];

                                        const selected =
                                            selectedTask?.id ===
                                            task.id;

                                        const updating =
                                            taskUpdatingId ===
                                            task.id;

                                        return (
                                            <div
                                                key={task.id}
                                                className={[
                                                    "group rounded-xl border p-4 transition",
                                                    selected
                                                        ? "border-blue-300 bg-blue-50/40 shadow-sm"
                                                        : "border-border/70 hover:border-blue-200 hover:bg-muted/30",
                                                ].join(" ")}
                                            >

                                                <div className="flex flex-col gap-4">

                                                    <div className="flex items-start justify-between gap-4">

                                                        <button
                                                            type="button"
                                                            className="min-w-0 flex-1 text-left"
                                                            onClick={() =>
                                                                handleSelectTask(
                                                                    task
                                                                )
                                                            }
                                                        >
                                                            <div className="flex flex-wrap items-center gap-2">

                                                                <h3 className="font-semibold group-hover:text-blue-600">
                                                                    {task.title}
                                                                </h3>

                                                                <span
                                                                    className={[
                                                                        "rounded-full border px-2 py-0.5 text-[11px] font-medium",
                                                                        status.className,
                                                                    ].join(" ")}
                                                                >
                                                                    {status.label}
                                                                </span>

                                                            </div>

                                                            {task.description && (
                                                                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                                                                    {task.description}
                                                                </p>
                                                            )}

                                                        </button>


                                                        <span
                                                            className={`text-xs font-semibold ${priority.className}`}
                                                        >
                                                            {priority.label}
                                                        </span>

                                                    </div>


                                                    <div className="grid gap-3 sm:grid-cols-3">

                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                            <FolderKanban className="h-4 w-4" />

                                                            <span className="truncate">
                                                                {task.projectName}
                                                            </span>
                                                        </div>


                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                            <CalendarDays className="h-4 w-4" />

                                                            <span>
                                                                {formatDate(
                                                                    task.dueDate
                                                                )}
                                                            </span>

                                                            {isOverdue(
                                                                task
                                                            ) && (
                                                                <span className="font-medium text-red-600">
                                                                    Overdue
                                                                </span>
                                                            )}
                                                        </div>


                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                            <Target className="h-4 w-4" />

                                                            <span>
                                                                {task.progress}%
                                                            </span>
                                                        </div>

                                                    </div>


                                                    <div>

                                                        <div className="mb-1 flex items-center justify-between">

                                                            <span className="text-xs text-muted-foreground">
                                                                Progress
                                                            </span>

                                                            <span className="text-xs font-medium">
                                                                {task.progress}%
                                                            </span>

                                                        </div>

                                                        <Progress
                                                            value={
                                                                task.progress
                                                            }
                                                            className="h-1.5"
                                                        />

                                                    </div>


                                                    <div className="flex flex-wrap items-center justify-between gap-3">

                                                        <Button
                                                            size="sm"
                                                            variant={
                                                                selected
                                                                    ? "default"
                                                                    : "outline"
                                                            }
                                                            className="rounded-lg"
                                                            onClick={() =>
                                                                handleSelectTask(
                                                                    task
                                                                )
                                                            }
                                                        >
                                                            <BrainCircuit className="mr-2 h-4 w-4" />
                                                            AI Subtasks
                                                        </Button>


                                                        <div className="flex items-center gap-2">

                                                            <select
                                                                value={
                                                                    task.status
                                                                }
                                                                disabled={
                                                                    updating ||
                                                                    task.status ===
                                                                    STATUS.COMPLETED
                                                                }
                                                                onChange={(event) =>
                                                                    handleTaskStatusChange(
                                                                        task,
                                                                        event
                                                                            .target
                                                                            .value
                                                                    )
                                                                }
                                                                className="h-9 rounded-lg border border-border bg-background px-3 text-xs outline-none focus:ring-2 focus:ring-blue-500/20"
                                                            >

                                                                <option value={STATUS.TODO}>
                                                                    To Do
                                                                </option>

                                                                <option value={STATUS.IN_PROGRESS}>
                                                                    In Progress
                                                                </option>

                                                                <option value={STATUS.IN_REVIEW}>
                                                                    In Review
                                                                </option>

                                                                <option value={STATUS.COMPLETED}>
                                                                    Completed
                                                                </option>

                                                                <option value={STATUS.BLOCKED}>
                                                                    Blocked
                                                                </option>

                                                            </select>

                                                            {updating && (
                                                                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                                                            )}

                                                        </div>

                                                    </div>

                                                </div>

                                            </div>
                                        );
                                    })}

                                </div>
                            )}

                        </CardContent>

                    </Card>


                    {/* -------------------------------------------- */}
                    {/* PROFILE / WORK SUMMARY */}
                    {/* -------------------------------------------- */}

                    <Card className="rounded-xl border-border/70 shadow-sm">

                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UserRound className="h-5 w-5 text-blue-600" />
                                My Work Summary
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-5">

                            <div className="rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 p-5">

                                <div className="flex items-center gap-3">

                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                                        <Code2 className="h-6 w-6" />
                                    </div>

                                    <div>
                                        <p className="font-semibold">
                                            Contributor Workspace
                                        </p>

                                        <p className="text-xs text-muted-foreground">
                                            Developer / Staff
                                        </p>
                                    </div>

                                </div>

                                <p className="mt-4 text-sm text-muted-foreground">
                                    Your dashboard is connected to the
                                    authenticated Contributor account.
                                    Tasks displayed here come from your
                                    actual backend assignments.
                                </p>

                            </div>


                            <div className="space-y-3">

                                <div className="flex items-center justify-between rounded-lg border p-3">
                                    <div className="flex items-center gap-2">
                                        <ListTodo className="h-4 w-4 text-blue-600" />
                                        <span className="text-sm">
                                            To Do
                                        </span>
                                    </div>

                                    <span className="font-semibold">
                                        {statistics.todo}
                                    </span>
                                </div>


                                <div className="flex items-center justify-between rounded-lg border p-3">
                                    <div className="flex items-center gap-2">
                                        <Clock3 className="h-4 w-4 text-blue-600" />
                                        <span className="text-sm">
                                            In Progress
                                        </span>
                                    </div>

                                    <span className="font-semibold">
                                        {statistics.inProgress}
                                    </span>
                                </div>


                                <div className="flex items-center justify-between rounded-lg border p-3">
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-violet-600" />
                                        <span className="text-sm">
                                            In Review
                                        </span>
                                    </div>

                                    <span className="font-semibold">
                                        {statistics.review}
                                    </span>
                                </div>


                                <div className="flex items-center justify-between rounded-lg border p-3">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                        <span className="text-sm">
                                            Completed
                                        </span>
                                    </div>

                                    <span className="font-semibold">
                                        {statistics.completed}
                                    </span>
                                </div>


                                <div className="flex items-center justify-between rounded-lg border p-3">
                                    <div className="flex items-center gap-2">
                                        <XCircle className="h-4 w-4 text-red-600" />
                                        <span className="text-sm">
                                            Blocked
                                        </span>
                                    </div>

                                    <span className="font-semibold">
                                        {statistics.blocked}
                                    </span>
                                </div>

                            </div>


                            {statistics.overdue > 0 && (
                                <div className="rounded-xl border border-red-200 bg-red-50 p-4">

                                    <div className="flex items-center gap-2 text-red-700">

                                        <AlertCircle className="h-5 w-5" />

                                        <span className="font-semibold">
                                            {statistics.overdue} overdue{" "}
                                            {statistics.overdue === 1
                                                ? "task"
                                                : "tasks"}
                                        </span>

                                    </div>

                                    <p className="mt-1 text-xs text-red-600">
                                        Review your assigned tasks and
                                        update their status.
                                    </p>

                                </div>
                            )}

                        </CardContent>

                    </Card>

                </div>


                {/* ------------------------------------------------ */}
                {/* AI SUBTASK PANEL */}
                {/* ------------------------------------------------ */}

                {selectedTask && (
                    <Card className="rounded-xl border-blue-200/70 shadow-sm">

                        <CardHeader>

                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                                <div>

                                    <div className="flex flex-wrap items-center gap-2">

                                        <CardTitle className="flex items-center gap-2">

                                            <Sparkles className="h-5 w-5 text-blue-600" />

                                            AI-Generated Subtasks

                                        </CardTitle>

                                        <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700">
                                            AI Generated
                                        </span>

                                    </div>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {selectedTask.title}
                                    </p>

                                </div>


                                <div className="flex flex-wrap gap-2">

                                    <div className="rounded-lg bg-muted px-3 py-2 text-xs">
                                        <span className="text-muted-foreground">
                                            Subtasks:
                                        </span>{" "}
                                        <span className="font-semibold">
                                            {subtaskStats.total}
                                        </span>
                                    </div>

                                    <div className="rounded-lg bg-muted px-3 py-2 text-xs">
                                        <span className="text-muted-foreground">
                                            Progress:
                                        </span>{" "}
                                        <span className="font-semibold">
                                            {subtaskStats.progress}%
                                        </span>
                                    </div>

                                </div>

                            </div>

                        </CardHeader>


                        <CardContent>

                            {subtaskError && (
                                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4">

                                    <div className="flex items-center gap-2 text-red-700">

                                        <AlertCircle className="h-4 w-4" />

                                        <span className="text-sm font-medium">
                                            {subtaskError}
                                        </span>

                                    </div>

                                </div>
                            )}


                            {loadingSubtasks ? (

                                <div className="flex min-h-[180px] items-center justify-center">

                                    <div className="text-center">

                                        <Loader2 className="mx-auto h-7 w-7 animate-spin text-blue-600" />

                                        <p className="mt-3 text-sm text-muted-foreground">
                                            Loading AI subtasks...
                                        </p>

                                    </div>

                                </div>

                            ) : subtasks.length === 0 ? (

                                <div className="flex min-h-[180px] flex-col items-center justify-center text-center">

                                    <div className="rounded-2xl bg-blue-50 p-4 text-blue-600">
                                        <BrainCircuit className="h-8 w-8" />
                                    </div>

                                    <h3 className="mt-4 font-semibold">
                                        No AI subtasks found
                                    </h3>

                                    <p className="mt-1 max-w-md text-sm text-muted-foreground">
                                        This task does not currently have
                                        AI-generated subtasks available.
                                    </p>

                                </div>

                            ) : (

                                <div className="space-y-4">

                                    {subtasks.map((subtask, index) => {

                                        const status =
                                            STATUS_META[
                                                subtask.status
                                            ] ||
                                            STATUS_META[
                                                STATUS.TODO
                                            ];

                                        const updating =
                                            subtaskUpdatingId ===
                                            subtask.id;

                                        const completed =
                                            subtask.status ===
                                            STATUS.COMPLETED;

                                        return (
                                            <div
                                                key={
                                                    subtask.id ||
                                                    index
                                                }
                                                className="rounded-xl border border-border/70 bg-background p-4"
                                            >

                                                <div className="flex flex-col gap-4">

                                                    <div className="flex items-start gap-3">

                                                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                                            <Zap className="h-4 w-4" />
                                                        </div>

                                                        <div className="min-w-0 flex-1">

                                                            <div className="flex flex-wrap items-center gap-2">

                                                                <h3 className="font-semibold">
                                                                    {subtask.title}
                                                                </h3>

                                                                <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                                                                    AI
                                                                </span>

                                                                <span
                                                                    className={[
                                                                        "rounded-full border px-2 py-0.5 text-[10px] font-medium",
                                                                        status.className,
                                                                    ].join(" ")}
                                                                >
                                                                    {status.label}
                                                                </span>

                                                            </div>

                                                            {subtask.description && (
                                                                <p className="mt-1 text-sm text-muted-foreground">
                                                                    {subtask.description}
                                                                </p>
                                                            )}

                                                        </div>

                                                    </div>


                                                    <div>

                                                        <div className="mb-1 flex items-center justify-between">

                                                            <span className="text-xs text-muted-foreground">
                                                                Subtask Progress
                                                            </span>

                                                            <span className="text-xs font-semibold">
                                                                {subtask.progress}%
                                                            </span>

                                                        </div>

                                                        <Progress
                                                            value={
                                                                subtask.progress
                                                            }
                                                            className="h-2"
                                                        />

                                                    </div>


                                                    <div className="grid gap-4 md:grid-cols-2">

                                                        <div>

                                                            <label className="mb-2 block text-xs font-medium text-muted-foreground">
                                                                Status
                                                            </label>

                                                            <div className="flex items-center gap-2">

                                                                <select
                                                                    value={
                                                                        subtask.status
                                                                    }
                                                                    disabled={
                                                                        completed ||
                                                                        updating
                                                                    }
                                                                    onChange={(
                                                                        event
                                                                    ) =>
                                                                        handleSubtaskUpdate(
                                                                            subtask,
                                                                            event
                                                                                .target
                                                                                .value,
                                                                            subtask.progress
                                                                        )
                                                                    }
                                                                    className="h-9 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none focus:ring-2 focus:ring-blue-500/20"
                                                                >

                                                                    <option value={STATUS.TODO}>
                                                                        To Do
                                                                    </option>

                                                                    <option value={STATUS.IN_PROGRESS}>
                                                                        In Progress
                                                                    </option>

                                                                    <option value={STATUS.IN_REVIEW}>
                                                                        In Review
                                                                    </option>

                                                                    <option value={STATUS.COMPLETED}>
                                                                        Completed
                                                                    </option>

                                                                    <option value={STATUS.BLOCKED}>
                                                                        Blocked
                                                                    </option>

                                                                </select>

                                                                {updating && (
                                                                    <Loader2 className="h-4 w-4 shrink-0 animate-spin text-blue-600" />
                                                                )}

                                                            </div>

                                                        </div>


                                                        <div>

                                                            <label className="mb-2 block text-xs font-medium text-muted-foreground">
                                                                Progress
                                                            </label>

                                                            <div className="flex items-center gap-3">

                                                                <input
                                                                    type="range"
                                                                    min="0"
                                                                    max="100"
                                                                    step="5"
                                                                    value={
                                                                        subtask.progress
                                                                    }
                                                                    disabled={
                                                                        completed ||
                                                                        updating
                                                                    }
                                                                    onChange={(
                                                                        event
                                                                    ) =>
                                                                        setSubtasks(
                                                                            (
                                                                                current
                                                                            ) =>
                                                                                current.map(
                                                                                    (
                                                                                        item
                                                                                    ) =>
                                                                                        item.id ===
                                                                                        subtask.id
                                                                                            ? {
                                                                                                ...item,
                                                                                                progress:
                                                                                                    Number(
                                                                                                        event
                                                                                                            .target
                                                                                                            .value
                                                                                                    ),
                                                                                            }
                                                                                            : item
                                                                                )
                                                                        )
                                                                    }
                                                                    onMouseUp={(
                                                                        event
                                                                    ) =>
                                                                        handleSubtaskUpdate(
                                                                            subtask,
                                                                            subtask.status,
                                                                            Number(
                                                                                event
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        )
                                                                    }
                                                                    onTouchEnd={(
                                                                        event
                                                                    ) =>
                                                                        handleSubtaskUpdate(
                                                                            subtask,
                                                                            subtask.status,
                                                                            Number(
                                                                                event
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        )
                                                                    }
                                                                    className="w-full"
                                                                />

                                                                <span className="w-12 rounded-lg border px-2 py-1 text-center text-xs font-medium">
                                                                    {
                                                                        subtask.progress
                                                                    }%
                                                                </span>

                                                            </div>

                                                        </div>

                                                    </div>


                                                    {subtask.aiRecommendation && (
                                                        <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3">

                                                            <div className="flex items-start gap-2">

                                                                <BrainCircuit className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />

                                                                <div>

                                                                    <p className="text-xs font-semibold text-blue-700">
                                                                        AI Recommendation
                                                                    </p>

                                                                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                                                        {
                                                                            subtask.aiRecommendation
                                                                        }
                                                                    </p>

                                                                </div>

                                                            </div>

                                                        </div>
                                                    )}


                                                    {completed && (
                                                        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">

                                                            <CheckCircle2 className="h-4 w-4" />

                                                            Completed subtasks
                                                            are read-only.

                                                        </div>
                                                    )}

                                                </div>

                                            </div>
                                        );
                                    })}

                                </div>
                            )}

                        </CardContent>

                    </Card>
                )}


                {/* ------------------------------------------------ */}
                {/* BOTTOM GRID */}
                {/* ------------------------------------------------ */}

                <div className="grid gap-6 lg:grid-cols-2">

                    {/* Recent Activity */}

                    <Card className="rounded-xl border-border/70 shadow-sm">

                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5 text-blue-600" />
                                Recent Activity
                            </CardTitle>
                        </CardHeader>

                        <CardContent>

                            {recentActivity.length === 0 ? (

                                <div className="py-8 text-center text-sm text-muted-foreground">
                                    No recent task activity.
                                </div>

                            ) : (

                                <div className="space-y-4">

                                    {recentActivity.map(
                                        (activity) => {

                                            const status =
                                                STATUS_META[
                                                    activity.status
                                                ] ||
                                                STATUS_META[
                                                    STATUS.TODO
                                                ];

                                            return (
                                                <div
                                                    key={
                                                        activity.id
                                                    }
                                                    className="flex items-start gap-3"
                                                >

                                                    <div className="mt-0.5 rounded-lg bg-blue-50 p-2 text-blue-600">
                                                        <Activity className="h-4 w-4" />
                                                    </div>

                                                    <div className="min-w-0 flex-1">

                                                        <p className="text-sm font-medium">
                                                            {activity.title}
                                                        </p>

                                                        <div className="mt-1 flex flex-wrap items-center gap-2">

                                                            <span
                                                                className={[
                                                                    "rounded-full border px-2 py-0.5 text-[10px] font-medium",
                                                                    status.className,
                                                                ].join(" ")}
                                                            >
                                                                {
                                                                    status.label
                                                                }
                                                            </span>

                                                            <span className="text-xs text-muted-foreground">
                                                                {formatRelativeTime(
                                                                    activity.time
                                                                )}
                                                            </span>

                                                        </div>

                                                    </div>

                                                </div>
                                            );
                                        }
                                    )}

                                </div>
                            )}

                        </CardContent>

                    </Card>


                    {/* Work Health */}

                    <Card className="rounded-xl border-border/70 shadow-sm">

                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-blue-600" />
                                Work Health
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-5">

                            <div>

                                <div className="mb-2 flex items-center justify-between">

                                    <span className="text-sm text-muted-foreground">
                                        Overall task progress
                                    </span>

                                    <span className="text-sm font-semibold">
                                        {statistics.progress}%
                                    </span>

                                </div>

                                <Progress
                                    value={
                                        statistics.progress
                                    }
                                    className="h-2.5"
                                />

                            </div>


                            <div className="grid grid-cols-2 gap-3">

                                <div className="rounded-xl border p-4">

                                    <div className="flex items-center gap-2 text-emerald-600">

                                        <CheckCircle2 className="h-4 w-4" />

                                        <span className="text-xs font-medium">
                                            Completed
                                        </span>

                                    </div>

                                    <p className="mt-2 text-2xl font-bold">
                                        {
                                            statistics.completed
                                        }
                                    </p>

                                </div>


                                <div className="rounded-xl border p-4">

                                    <div className="flex items-center gap-2 text-red-600">

                                        <AlertCircle className="h-4 w-4" />

                                        <span className="text-xs font-medium">
                                            Blocked
                                        </span>

                                    </div>

                                    <p className="mt-2 text-2xl font-bold">
                                        {
                                            statistics.blocked
                                        }
                                    </p>

                                </div>

                            </div>


                            <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">

                                <div className="flex items-start gap-3">

                                    <div className="rounded-lg bg-white p-2 text-blue-600 shadow-sm">
                                        <Sparkles className="h-4 w-4" />
                                    </div>

                                    <div>

                                        <p className="text-sm font-semibold text-blue-700">
                                            AI-assisted execution
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                            AI-generated subtasks are available
                                            directly from your assigned tasks.
                                            You can update their status and
                                            progress, while their definition
                                            remains controlled by the Team Leader.
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </CardContent>

                    </Card>

                </div>

            </div>

        </div>
    );
}