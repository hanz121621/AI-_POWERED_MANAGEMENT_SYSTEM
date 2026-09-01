import { useMemo, useState } from "react";
import {
    UsersRound,
    CheckCircle2,
    Clock3,
    AlertTriangle,
    TrendingUp,
    TrendingDown,
    Target,
    Award,
    BarChart3,
    Search,
    UserRound,
} from "lucide-react";

const performanceData = [
    {
        id: 1,
        name: "Developer 1",
        role: "Developer",
        specialization: "Frontend Development",
        completed: 3,
        total: 4,
        completion: 75,
        productivity: 82,
        onTime: 90,
        blocked: 0,
        trend: "up",
    },
    {
        id: 2,
        name: "Developer 2",
        role: "Developer",
        specialization: "Backend Development",
        completed: 2,
        total: 5,
        completion: 40,
        productivity: 68,
        onTime: 76,
        blocked: 1,
        trend: "down",
    },
    {
        id: 3,
        name: "Developer 3",
        role: "Developer",
        specialization: "Full Stack Development",
        completed: 3,
        total: 5,
        completion: 60,
        productivity: 79,
        onTime: 84,
        blocked: 0,
        trend: "up",
    },
    {
        id: 4,
        name: "Staff 1",
        role: "Staff",
        specialization: "QA / Testing",
        completed: 2,
        total: 3,
        completion: 67,
        productivity: 74,
        onTime: 88,
        blocked: 0,
        trend: "up",
    },
];

function performanceLevel(score) {
    if (score >= 80) {
        return {
            label: "Excellent",
            classes: "bg-emerald-50 text-emerald-700 border-emerald-200",
        };
    }

    if (score >= 60) {
        return {
            label: "Good",
            classes: "bg-blue-50 text-blue-700 border-blue-200",
        };
    }

    if (score >= 40) {
        return {
            label: "Needs Attention",
            classes: "bg-amber-50 text-amber-700 border-amber-200",
        };
    }

    return {
        label: "At Risk",
        classes: "bg-red-50 text-red-700 border-red-200",
    };
}

function ProgressBar({ value }) {
    return (
        <div className="w-full">
            <div className="mb-1 flex items-center justify-between">
                <span className="text-xs text-slate-500">Progress</span>
                <span className="text-xs font-semibold text-slate-700">
                    {value}%
                </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                    className="h-full rounded-full bg-blue-600 transition-all"
                    style={{ width: `${value}%` }}
                />
            </div>
        </div>
    );
}

export default function ViewTeamPerformance() {
    const [search, setSearch] = useState("");
    const [period, setPeriod] = useState("Current Sprint");

    const filteredMembers = useMemo(() => {
        const value = search.toLowerCase().trim();

        if (!value) return performanceData;

        return performanceData.filter(
            (member) =>
                member.name.toLowerCase().includes(value) ||
                member.role.toLowerCase().includes(value) ||
                member.specialization.toLowerCase().includes(value)
        );
    }, [search]);

    const teamCompletion = Math.round(
        performanceData.reduce(
            (total, member) => total + member.completion,
            0
        ) / performanceData.length
    );

    const teamProductivity = Math.round(
        performanceData.reduce(
            (total, member) => total + member.productivity,
            0
        ) / performanceData.length
    );

    const onTimeRate = Math.round(
        performanceData.reduce(
            (total, member) => total + member.onTime,
            0
        ) / performanceData.length
    );

    const completedTasks = performanceData.reduce(
        (total, member) => total + member.completed,
        0
    );

    const totalTasks = performanceData.reduce(
        (total, member) => total + member.total,
        0
    );

    const blockedTasks = performanceData.reduce(
        (total, member) => total + member.blocked,
        0
    );

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-600">
                            <BarChart3 className="h-4 w-4" />
                            Team Management
                        </div>

                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            Team Performance
                        </h1>

                        <p className="mt-1 max-w-2xl text-sm text-slate-500">
                            Monitor team productivity, task completion,
                            delivery performance, and areas requiring
                            attention.
                        </p>
                    </div>

                    <select
                        value={period}
                        onChange={(event) => setPeriod(event.target.value)}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-blue-500"
                    >
                        <option>Current Sprint</option>
                        <option>Previous Sprint</option>
                        <option>Current Month</option>
                        <option>Last 3 Months</option>
                    </select>
                </div>

                {/* KPI cards */}
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="rounded-xl bg-blue-50 p-3">
                                <Target className="h-5 w-5 text-blue-600" />
                            </div>

                            <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                                <TrendingUp className="h-3.5 w-3.5" />
                                6%
                            </span>
                        </div>

                        <p className="mt-4 text-2xl font-bold text-slate-900">
                            {teamCompletion}%
                        </p>

                        <p className="text-sm text-slate-500">
                            Team completion
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="rounded-xl bg-emerald-50 p-3">
                                <TrendingUp className="h-5 w-5 text-emerald-600" />
                            </div>

                            <span className="text-xs font-medium text-slate-400">
                                KPI
                            </span>
                        </div>

                        <p className="mt-4 text-2xl font-bold text-slate-900">
                            {teamProductivity}%
                        </p>

                        <p className="text-sm text-slate-500">
                            Productivity score
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="rounded-xl bg-violet-50 p-3">
                                <CheckCircle2 className="h-5 w-5 text-violet-600" />
                            </div>

                            <span className="text-xs font-medium text-slate-400">
                                DELIVERY
                            </span>
                        </div>

                        <p className="mt-4 text-2xl font-bold text-slate-900">
                            {onTimeRate}%
                        </p>

                        <p className="text-sm text-slate-500">
                            On-time delivery
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="rounded-xl bg-red-50 p-3">
                                <AlertTriangle className="h-5 w-5 text-red-600" />
                            </div>

                            <span className="text-xs font-medium text-slate-400">
                                BLOCKERS
                            </span>
                        </div>

                        <p className="mt-4 text-2xl font-bold text-slate-900">
                            {blockedTasks}
                        </p>

                        <p className="text-sm text-slate-500">
                            Blocked tasks
                        </p>
                    </div>
                </div>

                {/* Overview */}
                <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">
                                    Team Overview
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    {period} performance summary.
                                </p>
                            </div>

                            <BarChart3 className="h-5 w-5 text-slate-400" />
                        </div>

                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                            <div className="rounded-xl bg-slate-50 p-4">
                                <UsersRound className="h-5 w-5 text-blue-600" />
                                <p className="mt-3 text-xl font-bold text-slate-900">
                                    {performanceData.length}
                                </p>
                                <p className="text-xs text-slate-500">
                                    Contributors
                                </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-4">
                                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                <p className="mt-3 text-xl font-bold text-slate-900">
                                    {completedTasks}
                                </p>
                                <p className="text-xs text-slate-500">
                                    Completed
                                </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-4">
                                <Clock3 className="h-5 w-5 text-amber-600" />
                                <p className="mt-3 text-xl font-bold text-slate-900">
                                    {totalTasks - completedTasks}
                                </p>
                                <p className="text-xs text-slate-500">
                                    Remaining
                                </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-4">
                                <Award className="h-5 w-5 text-violet-600" />
                                <p className="mt-3 text-xl font-bold text-slate-900">
                                    {teamProductivity}%
                                </p>
                                <p className="text-xs text-slate-500">
                                    Average KPI
                                </p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <ProgressBar value={teamCompletion} />
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-5">
                            <h2 className="text-lg font-semibold text-slate-900">
                                Performance Insight
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Team-level observation.
                            </p>
                        </div>

                        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                            <div className="flex gap-3">
                                <TrendingUp className="h-5 w-5 text-blue-600" />

                                <div>
                                    <p className="text-sm font-semibold text-blue-900">
                                        Team is progressing
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-blue-700">
                                        Most contributors are maintaining
                                        steady progress. Review blocked work
                                        and workload distribution regularly.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 p-4">
                            <div className="flex gap-3">
                                <AlertTriangle className="h-5 w-5 text-amber-600" />

                                <div>
                                    <p className="text-sm font-semibold text-amber-900">
                                        Attention required
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-amber-700">
                                        Contributors with lower productivity
                                        or blocked tasks should be reviewed by
                                        the Team Leader.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Member performance */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">
                                Member Performance
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Individual performance for the selected
                                period.
                            </p>
                        </div>

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                            <input
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search member..."
                                className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500 md:w-64"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        {filteredMembers.map((member) => {
                            const level = performanceLevel(
                                member.productivity
                            );

                            return (
                                <div
                                    key={member.id}
                                    className="rounded-xl border border-slate-100 p-5 transition hover:border-slate-200 hover:shadow-sm"
                                >
                                    <div className="flex flex-col gap-5 xl:flex-row xl:items-center">
                                        <div className="flex min-w-[240px] items-center gap-3">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                                                <UserRound className="h-5 w-5 text-blue-600" />
                                            </div>

                                            <div>
                                                <p className="text-sm font-semibold text-slate-900">
                                                    {member.name}
                                                </p>

                                                <p className="text-xs text-slate-500">
                                                    {member.role} ·{" "}
                                                    {member.specialization}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex-1">
                                            <ProgressBar
                                                value={member.completion}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 xl:min-w-[420px]">
                                            <div>
                                                <p className="text-xs text-slate-400">
                                                    Productivity
                                                </p>
                                                <p className="mt-1 text-sm font-bold text-slate-900">
                                                    {member.productivity}%
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-slate-400">
                                                    On Time
                                                </p>
                                                <p className="mt-1 text-sm font-bold text-slate-900">
                                                    {member.onTime}%
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-slate-400">
                                                    Completed
                                                </p>
                                                <p className="mt-1 text-sm font-bold text-slate-900">
                                                    {member.completed}/
                                                    {member.total}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {member.trend === "up" ? (
                                                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                                                ) : (
                                                    <TrendingDown className="h-4 w-4 text-red-500" />
                                                )}

                                                <span className="text-xs font-medium text-slate-600">
                                                    Trend
                                                </span>
                                            </div>
                                        </div>

                                        <span
                                            className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${level.classes}`}
                                        >
                                            {level.label}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer note */}
                <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-xs leading-5 text-slate-500">
                        Performance metrics shown here are currently
                        frontend-ready sample values. They can later be
                        populated from Team Leader performance, task, sprint,
                        and KPI APIs without changing the UI structure.
                    </p>
                </div>
            </div>
        </div>
    );
}