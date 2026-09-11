
import { useEffect, useState } from "react";
import {
    Activity,
    AlertTriangle,
    CheckCircle2,
    Clock3,
    TrendingUp,
    UsersRound,
    CircleDot,
    CalendarDays,
} from "lucide-react";
import api from "@/services/api";

const initialProgress = {
    teamCompletion: 0,
    completedTasks: 0,
    remainingTasks: 0,
    blockedTasks: 0,
    sprint: {
        name: "Current Sprint",
        status: "Active",
        startDate: "",
        endDate: "",
        progress: 0,
    },
    members: [],
};

function MetricCard({
    icon: Icon,
    title,
    value,
    description,
    iconClass = "bg-slate-100 text-slate-700",
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">
                        {title}
                    </p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">
                        {value}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                        {description}
                    </p>
                </div>

                <div className={`rounded-xl p-3 ${iconClass}`}>
                    <Icon className="h-5 w-5" />
                </div>
            </div>
        </div>
    );
}

function ProgressBar({ value }) {
    const safeValue = Number.isFinite(Number(value))
        ? Math.max(0, Math.min(100, Number(value)))
        : 0;

    return (
        <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
            <div
                className="h-full rounded-full bg-slate-900 transition-all"
                style={{
                    width: `${safeValue}%`,
                }}
            />
        </div>
    );
}

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

function formatDate(value) {
    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

function normalizeMember(member) {
    const completed = Number(
        getValue(member, "completed", "Completed", "completedTasks", "CompletedTasks") ?? 0
    );

    const inProgress = Number(
        getValue(
            member,
            "inProgress",
            "InProgress",
            "inProgressTasks",
            "InProgressTasks"
        ) ?? 0
    );

    const blocked = Number(
        getValue(member, "blocked", "Blocked", "blockedTasks", "BlockedTasks") ?? 0
    );

    const progress = Number(
        getValue(
            member,
            "progress",
            "Progress",
            "completion",
            "Completion",
            "completionPercentage",
            "CompletionPercentage"
        ) ?? 0
    );

    return {
        id:
            getValue(
                member,
                "id",
                "Id",
                "contributorId",
                "ContributorId",
                "userId",
                "UserId"
            ) ?? crypto.randomUUID(),
        name:
            getValue(
                member,
                "name",
                "Name",
                "fullName",
                "FullName",
                "contributorName",
                "ContributorName"
            ) ?? "Contributor",
        role:
            getValue(
                member,
                "role",
                "Role",
                "contributorType",
                "ContributorType"
            ) ?? "Contributor",
        completed,
        inProgress,
        blocked,
        progress,
    };
}

function normalizeProgress(data) {
    const source = data?.data ?? data?.progress ?? data;

    const sprintSource =
        source?.sprint ??
        source?.Sprint ??
        source?.sprintInfo ??
        source?.SprintInfo ??
        {};

    const memberSource =
        source?.members ??
        source?.Members ??
        source?.contributors ??
        source?.Contributors ??
        source?.memberProgress ??
        source?.MemberProgress ??
        [];

    const teamCompletion = Number(
        getValue(
            source,
            "teamCompletion",
            "TeamCompletion",
            "completion",
            "Completion",
            "completionPercentage",
            "CompletionPercentage"
        ) ?? 0
    );

    const completedTasks = Number(
        getValue(
            source,
            "completedTasks",
            "CompletedTasks",
            "completedTaskCount",
            "CompletedTaskCount"
        ) ?? 0
    );

    const blockedTasks = Number(
        getValue(
            source,
            "blockedTasks",
            "BlockedTasks",
            "blockedTaskCount",
            "BlockedTaskCount"
        ) ?? 0
    );

    const totalTasks = Number(
        getValue(
            source,
            "totalTasks",
            "TotalTasks",
            "taskCount",
            "TaskCount"
        ) ?? 0
    );

    const remainingTasksValue = getValue(
        source,
        "remainingTasks",
        "RemainingTasks",
        "remainingTaskCount",
        "RemainingTaskCount"
    );

    const remainingTasks =
        remainingTasksValue !== undefined
            ? Number(remainingTasksValue)
            : Math.max(0, totalTasks - completedTasks);

    const sprintProgress = Number(
        getValue(
            sprintSource,
            "progress",
            "Progress",
            "completion",
            "Completion",
            "completionPercentage",
            "CompletionPercentage"
        ) ?? teamCompletion
    );

    return {
        teamCompletion,
        completedTasks,
        remainingTasks,
        blockedTasks,
        sprint: {
            name:
                getValue(
                    sprintSource,
                    "name",
                    "Name",
                    "sprintName",
                    "SprintName"
                ) ?? "Current Sprint",
            status:
                getValue(
                    sprintSource,
                    "status",
                    "Status"
                ) ?? "Active",
            startDate: formatDate(
                getValue(
                    sprintSource,
                    "startDate",
                    "StartDate",
                    "startAt",
                    "StartAt"
                )
            ),
            endDate: formatDate(
                getValue(
                    sprintSource,
                    "endDate",
                    "EndDate",
                    "endAt",
                    "EndAt"
                )
            ),
            progress: sprintProgress,
        },
        members: Array.isArray(memberSource)
            ? memberSource.map(normalizeMember)
            : [],
    };
}

export default function MonitorTeamProgress({
    sprintId,
    progress: providedProgress,
    onRefresh,
}) {
    const [progress, setProgress] = useState(
        providedProgress
            ? normalizeProgress(providedProgress)
            : initialProgress
    );
    const [loading, setLoading] = useState(!providedProgress);
    const [errorMessage, setErrorMessage] = useState("");

    const loadProgress = async () => {
        if (!sprintId) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setErrorMessage("");

            const response = await api.get(
                `/team-leader/sprints/${sprintId}/progress`
            );

            const normalizedProgress = normalizeProgress(response.data);

            setProgress(normalizedProgress);

            if (onRefresh) {
                onRefresh(normalizedProgress);
            }
        } catch (error) {
            console.error("Failed to load team progress:", error);

            setErrorMessage(
                error?.response?.data?.message ||
                    "Unable to load team progress."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (providedProgress) {
            setProgress(normalizeProgress(providedProgress));
            setLoading(false);
            return;
        }

        loadProgress();
    }, [sprintId]);

    const currentProgress = progress ?? initialProgress;
    const sprint = currentProgress.sprint ?? initialProgress.sprint;
    const members = currentProgress.members ?? [];

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-6">
                <div>
                    <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
                        <Activity className="h-4 w-4" />
                        Team Management
                    </div>

                    <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                        Monitor Team Progress
                    </h1>

                    <p className="mt-1 max-w-2xl text-sm text-slate-500">
                        Monitor team completion, sprint progress,
                        contributor workload, and blocked work.
                    </p>
                </div>

                {errorMessage && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {errorMessage}
                    </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <MetricCard
                        icon={TrendingUp}
                        title="Team Completion"
                        value={`${currentProgress.teamCompletion}%`}
                        description="Overall team progress"
                    />

                    <MetricCard
                        icon={CheckCircle2}
                        title="Completed Tasks"
                        value={currentProgress.completedTasks}
                        description="Tasks successfully completed"
                        iconClass="bg-emerald-50 text-emerald-700"
                    />

                    <MetricCard
                        icon={Clock3}
                        title="Remaining Tasks"
                        value={currentProgress.remainingTasks}
                        description="Tasks still to complete"
                        iconClass="bg-blue-50 text-blue-700"
                    />

                    <MetricCard
                        icon={AlertTriangle}
                        title="Blocked Tasks"
                        value={currentProgress.blockedTasks}
                        description="Tasks requiring attention"
                        iconClass="bg-red-50 text-red-700"
                    />
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <h2 className="text-lg font-bold text-slate-900">
                                    {sprint.name}
                                </h2>

                                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                    <CircleDot className="h-3 w-3" />
                                    {sprint.status}
                                </span>
                            </div>

                            <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-500">
                                <span className="inline-flex items-center gap-1.5">
                                    <CalendarDays className="h-3.5 w-3.5" />
                                    {sprint.startDate || "Start date unavailable"}
                                </span>

                                <span>→</span>

                                <span>
                                    {sprint.endDate || "End date unavailable"}
                                </span>
                            </div>
                        </div>

                        <div className="w-full lg:w-80">
                            <div className="mb-2 flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-500">
                                    Sprint Progress
                                </span>

                                <span className="text-lg font-bold text-slate-900">
                                    {sprint.progress}%
                                </span>
                            </div>

                            <ProgressBar value={sprint.progress} />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 p-5">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-slate-100 p-3">
                                <UsersRound className="h-5 w-5 text-slate-700" />
                            </div>

                            <div>
                                <h2 className="font-bold text-slate-900">
                                    Contributor Progress
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Individual workload and completion
                                    overview.
                                </p>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center text-sm text-slate-500">
                            Loading team progress...
                        </div>
                    ) : members.length === 0 ? (
                        <div className="p-8 text-center text-sm text-slate-500">
                            No contributor progress is available for this
                            sprint.
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {members.map((member) => (
                                <div
                                    key={member.id}
                                    className="p-5"
                                >
                                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                                        <div className="flex min-w-[220px] items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                                                {member.name
                                                    .slice(0, 2)
                                                    .toUpperCase()}
                                            </div>

                                            <div>
                                                <p className="font-semibold text-slate-900">
                                                    {member.name}
                                                </p>

                                                <p className="text-xs text-slate-500">
                                                    {member.role}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid flex-1 grid-cols-3 gap-3">
                                            <div className="rounded-xl bg-slate-50 p-3">
                                                <p className="text-xs text-slate-500">
                                                    Completed
                                                </p>

                                                <p className="mt-1 font-bold text-emerald-700">
                                                    {member.completed}
                                                </p>
                                            </div>

                                            <div className="rounded-xl bg-slate-50 p-3">
                                                <p className="text-xs text-slate-500">
                                                    In Progress
                                                </p>

                                                <p className="mt-1 font-bold text-blue-700">
                                                    {member.inProgress}
                                                </p>
                                            </div>

                                            <div className="rounded-xl bg-slate-50 p-3">
                                                <p className="text-xs text-slate-500">
                                                    Blocked
                                                </p>

                                                <p className="mt-1 font-bold text-red-700">
                                                    {member.blocked}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="w-full lg:w-56">
                                            <div className="mb-2 flex justify-between">
                                                <span className="text-xs font-medium text-slate-500">
                                                    Completion
                                                </span>

                                                <span className="text-xs font-bold text-slate-900">
                                                    {member.progress}%
                                                </span>
                                            </div>

                                            <ProgressBar
                                                value={member.progress}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex gap-3">
                        <div className="rounded-xl bg-amber-50 p-3">
                            <AlertTriangle className="h-5 w-5 text-amber-600" />
                        </div>

                        <div>
                            <h3 className="font-semibold text-slate-900">
                                Monitoring Summary
                            </h3>

                            <p className="mt-1 text-sm leading-6 text-slate-500">
                                Review blocked tasks and contributors with
                                low progress regularly. Team progress is
                                loaded from the current sprint data.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}