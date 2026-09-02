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

const initialProgress = {
    teamCompletion: 29,
    completedTasks: 2,
    remainingTasks: 5,
    blockedTasks: 1,

    sprint: {
        name: "Sprint 02",
        status: "Active",
        startDate: "August 18, 2026",
        endDate: "September 5, 2026",
        progress: 25,
    },

    members: [
        {
            id: 1,
            name: "Developer 1",
            role: "Developer",
            completed: 0,
            inProgress: 0,
            blocked: 0,
            progress: 0,
        },
        {
            id: 2,
            name: "Developer 2",
            role: "Developer",
            completed: 1,
            inProgress: 1,
            blocked: 0,
            progress: 50,
        },
        {
            id: 3,
            name: "Developer 3",
            role: "Developer",
            completed: 1,
            inProgress: 2,
            blocked: 0,
            progress: 40,
        },
        {
            id: 4,
            name: "Staff 1",
            role: "Staff",
            completed: 0,
            inProgress: 1,
            blocked: 1,
            progress: 25,
        },
    ],
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
    return (
        <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
            <div
                className="h-full rounded-full bg-slate-900 transition-all"
                style={{
                    width: `${Math.max(0, Math.min(100, value))}%`,
                }}
            />
        </div>
    );
}

export default function MonitorTeamProgress({
    progress = initialProgress,
}) {
    const sprint = progress?.sprint ?? initialProgress.sprint;
    const members = progress?.members ?? [];

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-6">
                {/* Header */}
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

                {/* Metrics */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <MetricCard
                        icon={TrendingUp}
                        title="Team Completion"
                        value={`${progress.teamCompletion}%`}
                        description="Overall team progress"
                    />

                    <MetricCard
                        icon={CheckCircle2}
                        title="Completed Tasks"
                        value={progress.completedTasks}
                        description="Tasks successfully completed"
                        iconClass="bg-emerald-50 text-emerald-700"
                    />

                    <MetricCard
                        icon={Clock3}
                        title="Remaining Tasks"
                        value={progress.remainingTasks}
                        description="Tasks still to complete"
                        iconClass="bg-blue-50 text-blue-700"
                    />

                    <MetricCard
                        icon={AlertTriangle}
                        title="Blocked Tasks"
                        value={progress.blockedTasks}
                        description="Tasks requiring attention"
                        iconClass="bg-red-50 text-red-700"
                    />
                </div>

                {/* Sprint progress */}
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
                                    {sprint.startDate}
                                </span>

                                <span>→</span>

                                <span>{sprint.endDate}</span>
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

                {/* Team progress */}
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

                    <div className="divide-y divide-slate-100">
                        {members.map((member) => (
                            <div
                                key={member.id}
                                className="p-5"
                            >
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                                    {/* Member */}
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

                                    {/* Stats */}
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

                                    {/* Progress */}
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
                </div>

                {/* Monitoring notice */}
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
                                low progress regularly. Backend integration
                                can later provide real-time task,
                                sprint, and workload information here.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}