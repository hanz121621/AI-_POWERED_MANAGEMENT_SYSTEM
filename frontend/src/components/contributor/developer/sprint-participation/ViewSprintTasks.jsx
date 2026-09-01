import { useMemo } from "react";
import {
    Target,
    CalendarDays,
    CheckCircle2,
    Clock3,
    AlertCircle,
    Eye,
    TrendingUp,
    ListTodo,
} from "lucide-react";

const SPRINT = {
    id: "SPR-001",
    name: "Sprint 1 - Core Development",
    goal: "Complete the core development tasks for the current project phase.",
    startDate: "2026-08-25",
    endDate: "2026-09-08",
    status: "Active",
};

const TASKS = [
    {
        id: "TASK-001",
        title: "Implement user authentication",
        status: "In Progress",
        priority: "High",
        progress: 70,
    },
    {
        id: "TASK-002",
        title: "Create dashboard interface",
        status: "To Do",
        priority: "High",
        progress: 0,
    },
    {
        id: "TASK-003",
        title: "Implement project management",
        status: "Review",
        priority: "Medium",
        progress: 90,
    },
    {
        id: "TASK-004",
        title: "Prepare technical documentation",
        status: "Completed",
        priority: "Low",
        progress: 100,
    },
];

function formatDate(date) {
    return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function getStatusClasses(status) {
    switch (status) {
        case "Completed":
            return "bg-green-100 text-green-700";
        case "In Progress":
            return "bg-blue-100 text-blue-700";
        case "Review":
            return "bg-purple-100 text-purple-700";
        case "Blocked":
            return "bg-red-100 text-red-700";
        default:
            return "bg-gray-100 text-gray-700";
    }
}

export default function ViewSprintProgress() {
    const statistics = useMemo(() => {
        const total = TASKS.length;

        const completed = TASKS.filter(
            (task) => task.status === "Completed"
        ).length;

        const inProgress = TASKS.filter(
            (task) => task.status === "In Progress"
        ).length;

        const blocked = TASKS.filter(
            (task) => task.status === "Blocked"
        ).length;

        const review = TASKS.filter(
            (task) => task.status === "Review"
        ).length;

        const averageProgress =
            total === 0
                ? 0
                : Math.round(
                      TASKS.reduce(
                          (totalProgress, task) =>
                              totalProgress + task.progress,
                          0
                      ) / total
                  );

        const remaining = total - completed;

        return {
            total,
            completed,
            inProgress,
            blocked,
            review,
            remaining,
            averageProgress,
        };
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="mx-auto max-w-7xl space-y-6">
                {/* Header */}
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <div className="mb-2 flex items-center gap-2 text-blue-600">
                                <TrendingUp className="h-5 w-5" />
                                <span className="text-sm font-semibold">
                                    Sprint Participation
                                </span>
                            </div>

                            <h1 className="text-2xl font-bold text-gray-900">
                                Sprint Goals & Progress
                            </h1>

                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                Monitor the current sprint objective, task
                                progress, remaining work, blocked activities,
                                and upcoming priorities.
                            </p>
                        </div>

                        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                            <span className="h-2 w-2 rounded-full bg-green-500" />
                            {SPRINT.status}
                        </span>
                    </div>
                </div>

                {/* Sprint details */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <div className="rounded-2xl bg-white p-5 shadow-sm lg:col-span-2">
                        <div className="flex items-start gap-4">
                            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                                <Target className="h-6 w-6" />
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                                    Sprint Goal
                                </p>

                                <h2 className="mt-1 text-xl font-bold text-gray-900">
                                    {SPRINT.name}
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-gray-600">
                                    {SPRINT.goal}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <div className="flex items-start gap-3">
                            <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
                                <CalendarDays className="h-5 w-5" />
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">
                                    Sprint Timeline
                                </p>

                                <p className="mt-1 text-sm font-semibold text-gray-900">
                                    {formatDate(SPRINT.startDate)}
                                </p>

                                <p className="text-xs text-gray-500">
                                    to {formatDate(SPRINT.endDate)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main progress */}
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold text-gray-700">
                                Sprint Completion
                            </p>

                            <p className="mt-1 text-4xl font-bold text-gray-900">
                                {statistics.averageProgress}%
                            </p>
                        </div>

                        <p className="text-sm text-gray-500">
                            Based on assigned sprint task progress
                        </p>
                    </div>

                    <div className="mt-5 h-4 overflow-hidden rounded-full bg-gray-200">
                        <div
                            className="h-full rounded-full bg-blue-600 transition-all"
                            style={{
                                width: `${statistics.averageProgress}%`,
                            }}
                        />
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <ListTodo className="h-5 w-5 text-gray-500" />
                            <span className="text-2xl font-bold text-gray-900">
                                {statistics.total}
                            </span>
                        </div>

                        <p className="mt-3 text-xs font-medium text-gray-500">
                            Total Tasks
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            <span className="text-2xl font-bold text-green-600">
                                {statistics.completed}
                            </span>
                        </div>

                        <p className="mt-3 text-xs font-medium text-gray-500">
                            Completed
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <Clock3 className="h-5 w-5 text-blue-600" />
                            <span className="text-2xl font-bold text-blue-600">
                                {statistics.inProgress}
                            </span>
                        </div>

                        <p className="mt-3 text-xs font-medium text-gray-500">
                            In Progress
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <Eye className="h-5 w-5 text-purple-600" />
                            <span className="text-2xl font-bold text-purple-600">
                                {statistics.review}
                            </span>
                        </div>

                        <p className="mt-3 text-xs font-medium text-gray-500">
                            Under Review
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <AlertCircle className="h-5 w-5 text-red-600" />
                            <span className="text-2xl font-bold text-red-600">
                                {statistics.blocked}
                            </span>
                        </div>

                        <p className="mt-3 text-xs font-medium text-gray-500">
                            Blocked
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <Target className="h-5 w-5 text-orange-600" />
                            <span className="text-2xl font-bold text-orange-600">
                                {statistics.remaining}
                            </span>
                        </div>

                        <p className="mt-3 text-xs font-medium text-gray-500">
                            Remaining
                        </p>
                    </div>
                </div>

                {/* Team progress summary */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <h2 className="font-bold text-gray-900">
                            Task Progress
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Progress of your assigned sprint tasks.
                        </p>

                        <div className="mt-5 space-y-5">
                            {TASKS.map((task) => (
                                <div key={task.id}>
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-gray-800">
                                                {task.title}
                                            </p>

                                            <p className="mt-1 text-xs text-gray-500">
                                                {task.id} · {task.priority} priority
                                            </p>
                                        </div>

                                        <span className="text-sm font-bold text-gray-700">
                                            {task.progress}%
                                        </span>
                                    </div>

                                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
                                        <div
                                            className="h-full rounded-full bg-blue-600"
                                            style={{
                                                width: `${task.progress}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Current priorities */}
                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <h2 className="font-bold text-gray-900">
                            Current Priorities
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Areas requiring attention during this sprint.
                        </p>

                        <div className="mt-5 space-y-3">
                            {statistics.blocked > 0 && (
                                <div className="flex gap-3 rounded-xl border border-red-100 bg-red-50 p-4">
                                    <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />

                                    <div>
                                        <p className="text-sm font-semibold text-red-800">
                                            Blocked work
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-red-700">
                                            Review blocked tasks and communicate
                                            blockers with your Team Leader.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {statistics.inProgress > 0 && (
                                <div className="flex gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
                                    <Clock3 className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />

                                    <div>
                                        <p className="text-sm font-semibold text-blue-800">
                                            Continue active work
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-blue-700">
                                            Focus on your in-progress tasks and
                                            keep their progress information
                                            updated.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {statistics.review > 0 && (
                                <div className="flex gap-3 rounded-xl border border-purple-100 bg-purple-50 p-4">
                                    <Eye className="mt-0.5 h-5 w-5 flex-shrink-0 text-purple-600" />

                                    <div>
                                        <p className="text-sm font-semibold text-purple-800">
                                            Tasks under review
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-purple-700">
                                            Monitor review results and respond
                                            to modification requests when
                                            necessary.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {statistics.remaining > 0 && (
                                <div className="flex gap-3 rounded-xl border border-orange-100 bg-orange-50 p-4">
                                    <Target className="mt-0.5 h-5 w-5 flex-shrink-0 text-orange-600" />

                                    <div>
                                        <p className="text-sm font-semibold text-orange-800">
                                            Remaining work
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-orange-700">
                                            Prioritize remaining tasks according
                                            to their priority and deadlines.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Task status table */}
                <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
                    <div className="border-b px-6 py-4">
                        <h2 className="font-bold text-gray-900">
                            Sprint Task Summary
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Overview of task status and progress.
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[700px]">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Task
                                    </th>

                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Priority
                                    </th>

                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Status
                                    </th>

                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Progress
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y">
                                {TASKS.map((task) => (
                                    <tr
                                        key={task.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {task.title}
                                                </p>

                                                <p className="mt-1 text-xs text-gray-500">
                                                    {task.id}
                                                </p>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-700">
                                                {task.priority}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                                                    task.status
                                                )}`}
                                            >
                                                {task.status}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-200">
                                                    <div
                                                        className="h-full rounded-full bg-blue-600"
                                                        style={{
                                                            width: `${task.progress}%`,
                                                        }}
                                                    />
                                                </div>

                                                <span className="text-xs font-semibold text-gray-700">
                                                    {task.progress}%
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}