import {
    Target,
    CalendarDays,
    CheckCircle2,
    Clock3,
    AlertTriangle,
    ListChecks,
    Users,
    TrendingUp,
} from "lucide-react";

const sprint = {
    name: "Sprint 01",
    goal: "Complete the core project management functionality and prepare the first working release.",
    startDate: "2026-08-31",
    endDate: "2026-09-14",
    totalTasks: 25,
    completed: 10,
    inProgress: 8,
    remaining: 7,
    blocked: 2,
    progress: 68,
};

const teamMembers = [
    {
        name: "Abebe Kebede",
        role: "Developer",
        assigned: 6,
        completed: 4,
        progress: 72,
    },
    {
        name: "Sara Ahmed",
        role: "Developer",
        assigned: 5,
        completed: 4,
        progress: 82,
    },
    {
        name: "Daniel Tadesse",
        role: "Staff",
        assigned: 4,
        completed: 1,
        progress: 45,
    },
    {
        name: "Mekdes Tesfaye",
        role: "Developer",
        assigned: 5,
        completed: 1,
        progress: 52,
    },
];

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

function ViewSprintProgress() {
    return (
        <div className="space-y-6">

            {/* =====================================================
                SPRINT OVERVIEW
            ====================================================== */}

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
                            {sprint.startDate} — {sprint.endDate}
                        </span>
                    </div>
                </div>

                {/* Progress */}

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

            {/* =====================================================
                PROGRESS STATISTICS
            ====================================================== */}

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

            {/* =====================================================
                TEAM PROGRESS
            ====================================================== */}

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

                <div className="divide-y divide-slate-100 dark:divide-slate-700">

                    {teamMembers.map((member) => (
                        <div
                            key={member.name}
                            className="p-5"
                        >
                            <div className="flex flex-col gap-4 md:flex-row md:items-center">

                                {/* Member */}

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

                                {/* Tasks */}

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

                                {/* Progress */}

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
            </div>

            {/* =====================================================
                COORDINATION INSIGHTS
            ====================================================== */}

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