import { useEffect, useMemo, useState } from "react";
import {
    Activity,
    AlertCircle,
    BarChart3,
    CheckCircle2,
    Clock3,
    FileCheck2,
    ListTodo,
    MessageSquare,
    RefreshCw,
    Target,
    TrendingUp,
    UserRound,
    XCircle,
} from "lucide-react";

const TASKS_KEY = "aipms_tasks";
const USER_KEY = "user";

function getStoredUser() {
    try {
        const user = localStorage.getItem(USER_KEY);
        return user ? JSON.parse(user) : null;
    } catch {
        return null;
    }
}

function getStoredTasks() {
    try {
        const tasks = localStorage.getItem(TASKS_KEY);
        return tasks ? JSON.parse(tasks) : [];
    } catch {
        return [];
    }
}

function getTaskStatus(task) {
    return String(
        task?.status ||
        task?.taskStatus ||
        "To Do"
    ).toLowerCase();
}

function isAssignedToUser(task, user) {
    if (!user) return false;

    const userId = user.id || user.userId || user.UserId;
    const userEmail = String(user.email || "").toLowerCase();
    const userName = String(
        user.name ||
        user.fullName ||
        user.username ||
        ""
    ).toLowerCase();

    const assignedId = task.assignedUserId || task.assigneeId;
    const assignedEmail = String(
        task.assignedUserEmail || task.assigneeEmail || ""
    ).toLowerCase();
    const assignedName = String(
        task.assignedUserName || task.assigneeName || ""
    ).toLowerCase();

    if (userId && assignedId && String(userId) === String(assignedId)) {
        return true;
    }

    if (userEmail && assignedEmail && userEmail === assignedEmail) {
        return true;
    }

    if (userName && assignedName && userName === assignedName) {
        return true;
    }

    return false;
}

function calculateAverageCompletionTime(tasks) {
    const completed = tasks.filter((task) => {
        const status = getTaskStatus(task);
        return (
            status.includes("completed") ||
            status.includes("complete") ||
            status === "done"
        );
    });

    if (!completed.length) return 0;

    let totalHours = 0;
    let validTasks = 0;

    completed.forEach((task) => {
        const start = task.startedAt || task.startDate || task.createdAt;
        const end =
            task.completedAt ||
            task.completionDate ||
            task.updatedAt;

        if (!start || !end) return;

        const startTime = new Date(start).getTime();
        const endTime = new Date(end).getTime();

        if (
            Number.isFinite(startTime) &&
            Number.isFinite(endTime) &&
            endTime >= startTime
        ) {
            totalHours += (endTime - startTime) / (1000 * 60 * 60);
            validTasks += 1;
        }
    });

    if (!validTasks) return 0;

    return Math.round(totalHours / validTasks);
}

function StatCard({
    title,
    value,
    icon: Icon,
    description,
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">
                        {title}
                    </p>

                    <h3 className="mt-2 text-3xl font-bold text-slate-900">
                        {value}
                    </h3>

                    {description && (
                        <p className="mt-1 text-xs text-slate-500">
                            {description}
                        </p>
                    )}
                </div>

                <div className="rounded-xl bg-slate-100 p-3">
                    <Icon className="h-5 w-5 text-slate-700" />
                </div>
            </div>
        </div>
    );
}

function ProgressBar({ value }) {
    const safeValue = Math.min(100, Math.max(0, Number(value) || 0));

    return (
        <div className="mt-3">
            <div className="mb-1 flex justify-between text-xs text-slate-500">
                <span>Completion rate</span>
                <span>{safeValue}%</span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                    className="h-full rounded-full bg-slate-800 transition-all"
                    style={{ width: `${safeValue}%` }}
                />
            </div>
        </div>
    );
}

export default function ViewPersonalPerformanceReport() {
    const [user, setUser] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [lastUpdated, setLastUpdated] = useState(null);

    useEffect(() => {
        let active = true;

        const loadReport = () => {
            try {
                setLoading(true);
                setError("");

                const currentUser = getStoredUser();

                if (!currentUser) {
                    if (!active) return;

                    setError("Profile not found.");
                    setLoading(false);
                    return;
                }

                const allTasks = getStoredTasks();

                const developerTasks = allTasks.filter((task) =>
                    isAssignedToUser(task, currentUser)
                );

                if (!active) return;

                setUser(currentUser);
                setTasks(developerTasks);
                setLastUpdated(new Date());
                setLoading(false);
            } catch {
                if (!active) return;

                setError(
                    "Unable to generate performance report. Please try again."
                );
                setLoading(false);
            }
        };

        loadReport();

        return () => {
            active = false;
        };
    }, []);

    const report = useMemo(() => {
        const completed = tasks.filter((task) => {
            const status = getTaskStatus(task);
            return (
                status.includes("completed") ||
                status.includes("complete") ||
                status === "done"
            );
        });

        const inProgress = tasks.filter((task) => {
            const status = getTaskStatus(task);
            return status.includes("progress");
        });

        const blocked = tasks.filter((task) => {
            const status = getTaskStatus(task);
            return status.includes("blocked");
        });

        const review = tasks.filter((task) => {
            const status = getTaskStatus(task);
            return status.includes("review");
        });

        const submitted = tasks.filter(
            (task) =>
                task.submitted === true ||
                task.workSubmitted === true ||
                task.submissionStatus
        );

        const returned = tasks.filter(
            (task) =>
                task.returned === true ||
                task.workReturned === true ||
                String(task.reviewStatus || "")
                    .toLowerCase()
                    .includes("returned")
        );

        const comments = tasks.reduce((total, task) => {
            if (Array.isArray(task.comments)) {
                return total + task.comments.length;
            }

            if (Array.isArray(task.commentList)) {
                return total + task.commentList.length;
            }

            return total;
        }, 0);

        const completionRate = tasks.length
            ? Math.round((completed.length / tasks.length) * 100)
            : 0;

        const averageCompletionTime =
            calculateAverageCompletionTime(tasks);

        return {
            assigned: tasks.length,
            completed,
            inProgress,
            blocked,
            review,
            submitted,
            returned,
            comments,
            completionRate,
            averageCompletionTime,
        };
    }, [tasks]);

    const handleRefresh = () => {
        try {
            setLoading(true);
            setError("");

            const currentUser = getStoredUser();

            if (!currentUser) {
                setError("Profile not found.");
                setLoading(false);
                return;
            }

            const allTasks = getStoredTasks();

            const developerTasks = allTasks.filter((task) =>
                isAssignedToUser(task, currentUser)
            );

            setUser(currentUser);
            setTasks(developerTasks);
            setLastUpdated(new Date());
            setLoading(false);
        } catch {
            setError(
                "Unable to generate performance report. Please try again."
            );
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="mx-auto h-8 w-8 animate-spin text-slate-600" />
                    <p className="mt-3 text-sm text-slate-500">
                        Loading performance report...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 text-red-600" />

                    <div>
                        <h2 className="font-semibold text-red-800">
                            Unable to load report
                        </h2>

                        <p className="mt-1 text-sm text-red-700">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={handleRefresh}
                            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const displayName =
        user?.fullName ||
        user?.name ||
        user?.username ||
        "Developer";

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-slate-900 p-3">
                            <BarChart3 className="h-6 w-6 text-white" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">
                                Personal Performance Report
                            </h1>

                            <p className="text-sm text-slate-500">
                                Review your productivity, task completion,
                                sprint contribution, and work activity.
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleRefresh}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                </button>
            </div>

            {/* Developer information */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-slate-100">
                        {user?.profilePicture || user?.avatar ? (
                            <img
                                src={user.profilePicture || user.avatar}
                                alt={displayName}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <UserRound className="h-7 w-7 text-slate-500" />
                        )}
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                            {displayName}
                        </h2>

                        <p className="text-sm text-slate-500">
                            {user?.email || "Developer account"}
                        </p>

                        <div className="mt-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                            Developer
                        </div>
                    </div>
                </div>
            </div>

            {/* Main statistics */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Assigned Tasks"
                    value={report.assigned}
                    icon={ListTodo}
                    description="Tasks assigned to you"
                />

                <StatCard
                    title="Completed"
                    value={report.completed.length}
                    icon={CheckCircle2}
                    description="Successfully completed"
                />

                <StatCard
                    title="In Progress"
                    value={report.inProgress.length}
                    icon={Activity}
                    description="Currently being worked on"
                />

                <StatCard
                    title="Blocked"
                    value={report.blocked.length}
                    icon={XCircle}
                    description="Tasks requiring attention"
                />
            </div>

            {/* Completion */}
            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                        <TrendingUp className="h-5 w-5 text-slate-700" />

                        <h2 className="font-semibold text-slate-900">
                            Task Completion
                        </h2>
                    </div>

                    <div className="mt-5">
                        <div className="flex items-end justify-between">
                            <span className="text-4xl font-bold text-slate-900">
                                {report.completionRate}%
                            </span>

                            <span className="text-sm text-slate-500">
                                {report.completed.length} of{" "}
                                {report.assigned} tasks
                            </span>
                        </div>

                        <ProgressBar value={report.completionRate} />
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                        <Clock3 className="h-5 w-5 text-slate-700" />

                        <h2 className="font-semibold text-slate-900">
                            Average Completion Time
                        </h2>
                    </div>

                    <div className="mt-5">
                        <span className="text-4xl font-bold text-slate-900">
                            {report.averageCompletionTime}
                        </span>

                        <span className="ml-2 text-sm text-slate-500">
                            hours
                        </span>

                        <p className="mt-2 text-sm text-slate-500">
                            Based on available task start and completion
                            dates.
                        </p>
                    </div>
                </div>
            </div>

            {/* Work summary */}
            <div>
                <h2 className="mb-4 text-lg font-semibold text-slate-900">
                    Workload Summary
                </h2>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Under Review"
                        value={report.review.length}
                        icon={Target}
                    />

                    <StatCard
                        title="Submitted Work"
                        value={report.submitted.length}
                        icon={FileCheck2}
                    />

                    <StatCard
                        title="Returned Work"
                        value={report.returned.length}
                        icon={RefreshCw}
                    />

                    <StatCard
                        title="Comments"
                        value={report.comments}
                        icon={MessageSquare}
                    />
                </div>
            </div>

            {/* Task breakdown */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 p-6">
                    <h2 className="font-semibold text-slate-900">
                        Task Status Breakdown
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Current distribution of your assigned work.
                    </p>
                </div>

                <div className="divide-y divide-slate-100">
                    {[
                        ["Completed", report.completed.length],
                        ["In Progress", report.inProgress.length],
                        ["Under Review", report.review.length],
                        ["Blocked", report.blocked.length],
                    ].map(([label, value]) => {
                        const percentage = report.assigned
                            ? Math.round((value / report.assigned) * 100)
                            : 0;

                        return (
                            <div
                                key={label}
                                className="p-5"
                            >
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium text-slate-700">
                                        {label}
                                    </span>

                                    <span className="text-sm text-slate-500">
                                        {value} ({percentage}%)
                                    </span>
                                </div>

                                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                                    <div
                                        className="h-full rounded-full bg-slate-700"
                                        style={{
                                            width: `${percentage}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Empty state */}
            {report.assigned === 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                    <BarChart3 className="mx-auto h-10 w-10 text-slate-400" />

                    <h2 className="mt-4 text-lg font-semibold text-slate-900">
                        No performance data available.
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Your performance information will appear here when
                        tasks and work activity are available.
                    </p>
                </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-slate-400">
                <span>
                    Report access is recorded in the system activity history.
                </span>

                {lastUpdated && (
                    <span>
                        Updated{" "}
                        {lastUpdated.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </span>
                )}
            </div>
        </div>
    );
}