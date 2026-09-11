import { useEffect, useMemo, useState } from "react";
import {
    Target,
    CalendarDays,
    CheckCircle2,
    Clock3,
    AlertTriangle,
    ListChecks,
    Users,
    TrendingUp,
    RefreshCw,
} from "lucide-react";

import api from "@/services/api";

function getValue(source, ...keys) {
    for (const key of keys) {
        if (
            source &&
            source[key] !== undefined &&
            source[key] !== null
        ) {
            return source[key];
        }
    }

    return undefined;
}

function toNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
}

function formatDate(value) {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleDateString();
}

function normalizeProgressResponse(response) {
    const source =
        response?.data?.data ??
        response?.data?.progress ??
        response?.data ??
        response ??
        {};

    const contributorSource =
        getValue(
            source,
            "contributorProgress",
            "ContributorProgress",
            "contributors",
            "Contributors",
            "teamMembers",
            "TeamMembers"
        ) || [];

    const contributors = Array.isArray(contributorSource)
        ? contributorSource
        : [];

    const normalizedContributors = contributors.map((member, index) => {
        const name =
            getValue(
                member,
                "contributorName",
                "ContributorName",
                "userName",
                "UserName",
                "fullName",
                "FullName",
                "name",
                "Name"
            ) || `Contributor ${index + 1}`;

        const role =
            getValue(
                member,
                "role",
                "Role",
                "contributorType",
                "ContributorType",
                "contributorRole",
                "ContributorRole"
            ) || "Contributor";

        const assigned = toNumber(
            getValue(
                member,
                "assignedTasks",
                "AssignedTasks",
                "totalTasks",
                "TotalTasks",
                "taskCount",
                "TaskCount",
                "assigned"
            )
        );

        const completed = toNumber(
            getValue(
                member,
                "completedTasks",
                "CompletedTasks",
                "completed",
                "Completed"
            )
        );

        const progress = Math.max(
            0,
            Math.min(
                100,
                toNumber(
                    getValue(
                        member,
                        "completionPercentage",
                        "CompletionPercentage",
                        "completionPercent",
                        "CompletionPercent",
                        "progress",
                        "Progress"
                    ),
                    assigned > 0
                        ? Math.round((completed / assigned) * 100)
                        : 0
                )
            )
        );

        return {
            id:
                getValue(
                    member,
                    "contributorId",
                    "ContributorId",
                    "userId",
                    "UserId",
                    "id",
                    "Id"
                ) || `${name}-${index}`,
            name,
            role,
            assigned,
            completed,
            progress,
        };
    });

    return {
        name:
            getValue(
                source,
                "sprintName",
                "SprintName",
                "name",
                "Name"
            ) || "Current Sprint",

        goal:
            getValue(
                source,
                "sprintGoal",
                "SprintGoal",
                "goal",
                "Goal"
            ) || "Monitor sprint execution and team progress.",

        startDate: getValue(
            source,
            "startDate",
            "StartDate",
            "sprintStartDate",
            "SprintStartDate"
        ),

        endDate: getValue(
            source,
            "endDate",
            "EndDate",
            "sprintEndDate",
            "SprintEndDate"
        ),

        totalTasks: toNumber(
            getValue(
                source,
                "totalTasks",
                "TotalTasks",
                "taskCount",
                "TaskCount"
            )
        ),

        completed: toNumber(
            getValue(
                source,
                "completedTasks",
                "CompletedTasks",
                "completed",
                "Completed"
            )
        ),

        inProgress: toNumber(
            getValue(
                source,
                "inProgressTasks",
                "InProgressTasks",
                "inProgress",
                "InProgress",
                "activeTasks",
                "ActiveTasks"
            )
        ),

        remaining: toNumber(
            getValue(
                source,
                "remainingTasks",
                "RemainingTasks",
                "remaining",
                "Remaining"
            )
        ),

        blocked: toNumber(
            getValue(
                source,
                "blockedTasks",
                "BlockedTasks",
                "blocked",
                "Blocked"
            )
        ),

        progress: Math.max(
            0,
            Math.min(
                100,
                toNumber(
                    getValue(
                        source,
                        "completionPercentage",
                        "CompletionPercentage",
                        "completionPercent",
                        "CompletionPercent",
                        "progress",
                        "Progress"
                    )
                )
            )
        ),

        contributors: normalizedContributors,
    };
}

function ProgressCard({
    icon: Icon,
    title,
    value,
    description,
}) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-[#0d2747]">
            <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                    <Icon className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                </div>

                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                    {value}
                </span>
            </div>

            <p className="mt-4 text-sm font-semibold text-slate-800 dark:text-slate-200">
                {title}
            </p>

            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                {description}
            </p>
        </div>
    );
}

function InsightCard({
    icon: Icon,
    title,
    value,
    description,
}) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#0d2747]">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                <Icon className="h-5 w-5 text-slate-600 dark:text-slate-300" />
            </div>

            <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                {title}
            </p>

            <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                {value}
            </p>

            <p className="mt-2 text-xs leading-5 text-slate-400 dark:text-slate-500">
                {description}
            </p>
        </div>
    );
}

function ViewSprintProgress({
    sprintId,
    progress: providedProgress,
    onRefresh,
}) {
    const [progressData, setProgressData] = useState(
        providedProgress
            ? normalizeProgressResponse(providedProgress)
            : null
    );

    const [loading, setLoading] = useState(!providedProgress);
    const [error, setError] = useState("");

    const loadProgress = async () => {
        if (!sprintId) {
            setError("Sprint ID is required.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                `/team-leader/sprints/${sprintId}/progress`
            );

            const normalized = normalizeProgressResponse(response);

            setProgressData(normalized);
        } catch (err) {
            console.error(
                "Failed to load sprint progress:",
                err
            );

            setError(
                err?.response?.data?.message ||
                    err?.response?.data?.Message ||
                    "Failed to load sprint progress."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (providedProgress) {
            setProgressData(
                normalizeProgressResponse(providedProgress)
            );
            setLoading(false);
            return;
        }

        loadProgress();
    }, [sprintId, providedProgress]);

    const sprint = progressData || {
        name: "Current Sprint",
        goal: "Monitor sprint execution and team progress.",
        startDate: null,
        endDate: null,
        totalTasks: 0,
        completed: 0,
        inProgress: 0,
        remaining: 0,
        blocked: 0,
        progress: 0,
        contributors: [],
    };

    const teamMembers = useMemo(
        () => sprint.contributors || [],
        [sprint.contributors]
    );

    const handleRefresh = async () => {
        await loadProgress();

        if (onRefresh) {
            await onRefresh();
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[300px] items-center justify-center">
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Loading sprint progress...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900/50 dark:bg-red-950/20">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />

                    <div className="flex-1">
                        <h3 className="text-sm font-semibold text-red-800 dark:text-red-300">
                            Unable to load sprint progress
                        </h3>

                        <p className="mt-1 text-sm text-red-700 dark:text-red-400">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={loadProgress}
                            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 dark:border-red-900 dark:bg-[#0d2747] dark:text-red-300 dark:hover:bg-red-950/30"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-end">
                <button
                    type="button"
                    onClick={handleRefresh}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 dark:border-slate-700 dark:bg-[#0d2747] dark:text-slate-300 dark:hover:bg-slate-800"
                >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                </button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#0d2747]">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-950/40">
                            <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-purple-600 dark:text-purple-400">
                                Current Sprint
                            </p>

                            <h3 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                                {sprint.name}
                            </h3>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                                {sprint.goal}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">
                        <CalendarDays className="h-4 w-4 text-slate-500 dark:text-slate-400" />

                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                            {formatDate(sprint.startDate)} —{" "}
                            {formatDate(sprint.endDate)}
                        </span>
                    </div>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-6 dark:border-slate-700">
                    <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Sprint completion
                        </span>

                        <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                            {sprint.progress}%
                        </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                            className="h-full rounded-full bg-purple-600 transition-all"
                            style={{
                                width: `${sprint.progress}%`,
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <ProgressCard
                    icon={ListChecks}
                    title="Total Tasks"
                    value={sprint.totalTasks}
                    description="Sprint tasks"
                />

                <ProgressCard
                    icon={CheckCircle2}
                    title="Completed"
                    value={sprint.completed}
                    description="Finished tasks"
                />

                <ProgressCard
                    icon={Clock3}
                    title="In Progress"
                    value={sprint.inProgress}
                    description="Active tasks"
                />

                <ProgressCard
                    icon={TrendingUp}
                    title="Remaining"
                    value={sprint.remaining}
                    description="Tasks remaining"
                />

                <ProgressCard
                    icon={AlertTriangle}
                    title="Blocked"
                    value={sprint.blocked}
                    description="Needs attention"
                />
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-[#0d2747]">
                <div className="border-b border-slate-200 px-5 py-5 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950/40">
                            <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>

                        <div>
                            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                                Team Progress Summary
                            </h3>

                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Monitor individual contribution during the sprint.
                            </p>
                        </div>
                    </div>
                </div>

                {teamMembers.length === 0 ? (
                    <div className="p-8 text-center">
                        <Users className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-600" />

                        <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                            No contributor progress available
                        </p>

                        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                            Contributor progress will appear when sprint task data is available.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100 dark:divide-slate-700">
                        {teamMembers.map((member) => (
                            <div
                                key={member.id}
                                className="p-5"
                            >
                                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                                    <div className="flex min-w-[220px] items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                                            <Users className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                                        </div>

                                        <div>
                                            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                                {member.name}
                                            </p>

                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                {member.role}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-6 text-sm">
                                        <div>
                                            <p className="text-xs text-slate-400">
                                                Assigned
                                            </p>

                                            <p className="mt-1 font-semibold text-slate-800 dark:text-slate-200">
                                                {member.assigned}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-slate-400">
                                                Completed
                                            </p>

                                            <p className="mt-1 font-semibold text-emerald-600 dark:text-emerald-400">
                                                {member.completed}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex-1 md:ml-auto md:max-w-sm">
                                        <div className="mb-2 flex justify-between">
                                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                                Progress
                                            </span>

                                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                {member.progress}%
                                            </span>
                                        </div>

                                        <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                            <div
                                                className="h-full rounded-full bg-blue-600 transition-all"
                                                style={{
                                                    width: `${member.progress}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <InsightCard
                    icon={AlertTriangle}
                    title="Blocked Work"
                    value={`${sprint.blocked} tasks`}
                    description="Tasks may require attention or coordination."
                />

                <InsightCard
                    icon={Clock3}
                    title="Remaining Work"
                    value={`${sprint.remaining} tasks`}
                    description="Tasks still need to be completed in this sprint."
                />

                <InsightCard
                    icon={TrendingUp}
                    title="Sprint Progress"
                    value={`${sprint.progress}%`}
                    description="Current overall sprint completion."
                />
            </div>
        </div>
    );
}

export default ViewSprintProgress;