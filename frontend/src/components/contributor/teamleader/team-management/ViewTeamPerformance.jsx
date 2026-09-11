
import { useEffect, useMemo, useState } from "react";
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
    Loader2,
} from "lucide-react";

import api from "@/services/api";

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
    const safeValue = Math.max(0, Math.min(100, Number(value) || 0));

    return (
        <div className="w-full">
            <div className="mb-1 flex items-center justify-between">
                <span className="text-xs text-slate-500">Progress</span>
                <span className="text-xs font-semibold text-slate-700">
                    {safeValue}%
                </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                    className="h-full rounded-full bg-blue-600 transition-all"
                    style={{ width: `${safeValue}%` }}
                />
            </div>
        </div>
    );
}

function getValue(object, ...keys) {
    for (const key of keys) {
        if (
            object &&
            object[key] !== undefined &&
            object[key] !== null
        ) {
            return object[key];
        }
    }

    return undefined;
}

function normalizeStatus(status) {
    if (status === undefined || status === null) {
        return "";
    }

    const value = String(status).toLowerCase().replace(/[\s_-]/g, "");

    if (
        value === "4" ||
        value === "completed" ||
        value === "done"
    ) {
        return "completed";
    }

    if (
        value === "5" ||
        value === "blocked"
    ) {
        return "blocked";
    }

    if (
        value === "3" ||
        value === "inreview" ||
        value === "codereview"
    ) {
        return "inreview";
    }

    if (
        value === "2" ||
        value === "inprogress"
    ) {
        return "inprogress";
    }

    if (
        value === "1" ||
        value === "todo" ||
        value === "backlog" ||
        value === "notstarted"
    ) {
        return "todo";
    }

    return value;
}

function getContributorId(task) {
    return getValue(
        task,
        "assignedContributorSDId",
        "AssignedContributorSDId",
        "assignedContributorId",
        "AssignedContributorId",
        "contributorId",
        "ContributorId",
        "userId",
        "UserId"
    );
}

function getContributorName(task) {
    const directName = getValue(
        task,
        "assignedContributorName",
        "AssignedContributorName",
        "contributorName",
        "ContributorName",
        "userName",
        "UserName",
        "fullName",
        "FullName"
    );

    if (directName) {
        return directName;
    }

    const contributor = getValue(
        task,
        "assignedContributor",
        "AssignedContributor",
        "contributor",
        "Contributor",
        "user",
        "User"
    );

    if (typeof contributor === "string") {
        return contributor;
    }

    if (contributor && typeof contributor === "object") {
        return (
            getValue(
                contributor,
                "fullName",
                "FullName",
                "name",
                "Name",
                "userName",
                "UserName"
            ) || "Contributor"
        );
    }

    return "Unassigned";
}

function getContributorRole(task) {
    return (
        getValue(
            task,
            "assignedContributorType",
            "AssignedContributorType",
            "contributorType",
            "ContributorType",
            "role",
            "Role"
        ) || "Contributor"
    );
}

function getSpecialization(task) {
    return (
        getValue(
            task,
            "specialization",
            "Specialization",
            "skill",
            "Skill"
        ) || "Team Member"
    );
}

function getTaskDueDate(task) {
    return getValue(
        task,
        "dueDate",
        "DueDate",
        "deadline",
        "Deadline"
    );
}

function getTaskUpdatedDate(task) {
    return getValue(
        task,
        "updatedAt",
        "UpdatedAt",
        "completedAt",
        "CompletedAt"
    );
}

function isOnTime(task) {
    const dueDate = getTaskDueDate(task);
    const completedDate = getTaskUpdatedDate(task);

    if (!dueDate || !completedDate) {
        return false;
    }

    const due = new Date(dueDate);
    const completed = new Date(completedDate);

    if (
        Number.isNaN(due.getTime()) ||
        Number.isNaN(completed.getTime())
    ) {
        return false;
    }

    return completed <= due;
}

function calculatePerformance(tasks) {
    const members = new Map();

    tasks.forEach((task) => {
        const contributorId = getContributorId(task);

        if (!contributorId) {
            return;
        }

        const key = String(contributorId);

        if (!members.has(key)) {
            members.set(key, {
                id: contributorId,
                name: getContributorName(task),
                role: getContributorRole(task),
                specialization: getSpecialization(task),
                completed: 0,
                total: 0,
                onTimeCompleted: 0,
                completedWithDate: 0,
                blocked: 0,
            });
        }

        const member = members.get(key);
        const status = normalizeStatus(
            getValue(task, "status", "Status")
        );

        member.total += 1;

        if (status === "completed") {
            member.completed += 1;

            if (getTaskUpdatedDate(task)) {
                member.completedWithDate += 1;

                if (isOnTime(task)) {
                    member.onTimeCompleted += 1;
                }
            }
        }

        if (status === "blocked") {
            member.blocked += 1;
        }
    });

    return Array.from(members.values()).map((member) => {
        const completion =
            member.total > 0
                ? Math.round(
                      (member.completed / member.total) * 100
                  )
                : 0;

        const onTime =
            member.completedWithDate > 0
                ? Math.round(
                      (member.onTimeCompleted /
                          member.completedWithDate) *
                          100
                  )
                : completion;

        const blockedPenalty =
            member.total > 0
                ? Math.round(
                      (member.blocked / member.total) * 20
                  )
                : 0;

        const productivity = Math.max(
            0,
            Math.min(
                100,
                Math.round(
                    completion * 0.6 +
                        onTime * 0.4 -
                        blockedPenalty
                )
            )
        );

        return {
            id: member.id,
            name: member.name,
            role: member.role,
            specialization: member.specialization,
            completed: member.completed,
            total: member.total,
            completion,
            productivity,
            onTime,
            blocked: member.blocked,
            trend: productivity >= 70 ? "up" : "down",
        };
    });
}

export default function ViewTeamPerformance({
    sprintId,
    tasks: providedTasks,
    onRefresh,
}) {
    const [search, setSearch] = useState("");
    const [period, setPeriod] = useState("Current Sprint");
    const [tasks, setTasks] = useState(providedTasks || []);
    const [loading, setLoading] = useState(!providedTasks);
    const [error, setError] = useState("");

    useEffect(() => {
        if (providedTasks) {
            setTasks(Array.isArray(providedTasks) ? providedTasks : []);
            setLoading(false);
            return;
        }

        if (!sprintId) {
            setTasks([]);
            setLoading(false);
            setError("Sprint ID is required to load team performance.");
            return;
        }

        let cancelled = false;

        const loadTasks = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get(
                    `/tasks/team-leader/sprint/${sprintId}`
                );

                const data =
                    response.data?.tasks ??
                    response.data?.Tasks ??
                    response.data?.data ??
                    response.data?.Data ??
                    response.data ??
                    [];

                if (!cancelled) {
                    setTasks(Array.isArray(data) ? data : []);
                }
            } catch (requestError) {
                if (!cancelled) {
                    setError(
                        requestError.response?.data?.message ||
                            requestError.response?.data?.Message ||
                            "Failed to load team performance data."
                    );
                    setTasks([]);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadTasks();

        return () => {
            cancelled = true;
        };
    }, [sprintId, providedTasks]);

    const performanceData = useMemo(
        () => calculatePerformance(tasks),
        [tasks]
    );

    const filteredMembers = useMemo(() => {
        const value = search.toLowerCase().trim();

        if (!value) {
            return performanceData;
        }

        return performanceData.filter((member) => {
            return (
                member.name.toLowerCase().includes(value) ||
                member.role.toLowerCase().includes(value) ||
                member.specialization.toLowerCase().includes(value)
            );
        });
    }, [performanceData, search]);

    const teamCompletion = useMemo(() => {
        if (!performanceData.length) {
            return 0;
        }

        return Math.round(
            performanceData.reduce(
                (total, member) => total + member.completion,
                0
            ) / performanceData.length
        );
    }, [performanceData]);

    const teamProductivity = useMemo(() => {
        if (!performanceData.length) {
            return 0;
        }

        return Math.round(
            performanceData.reduce(
                (total, member) => total + member.productivity,
                0
            ) / performanceData.length
        );
    }, [performanceData]);

    const onTimeRate = useMemo(() => {
        if (!performanceData.length) {
            return 0;
        }

        return Math.round(
            performanceData.reduce(
                (total, member) => total + member.onTime,
                0
            ) / performanceData.length
        );
    }, [performanceData]);

    const completedTasks = useMemo(() => {
        return performanceData.reduce(
            (total, member) => total + member.completed,
            0
        );
    }, [performanceData]);

    const totalTasks = useMemo(() => {
        return performanceData.reduce(
            (total, member) => total + member.total,
            0
        );
    }, [performanceData]);

    const blockedTasks = useMemo(() => {
        return performanceData.reduce(
            (total, member) => total + member.blocked,
            0
        );
    }, [performanceData]);

    const handleRefresh = async () => {
        if (typeof onRefresh === "function") {
            const refreshed = await onRefresh();

            if (Array.isArray(refreshed)) {
                setTasks(refreshed);
            }

            return;
        }

        if (!sprintId) {
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                `/tasks/team-leader/sprint/${sprintId}`
            );

            const data =
                response.data?.tasks ??
                response.data?.Tasks ??
                response.data?.data ??
                response.data?.Data ??
                response.data ??
                [];

            setTasks(Array.isArray(data) ? data : []);
        } catch (requestError) {
            setError(
                requestError.response?.data?.message ||
                    requestError.response?.data?.Message ||
                    "Failed to refresh team performance data."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
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
                        onChange={(event) =>
                            setPeriod(event.target.value)
                        }
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-blue-500"
                    >
                        <option>Current Sprint</option>
                        <option>Previous Sprint</option>
                        <option>Current Month</option>
                        <option>Last 3 Months</option>
                    </select>
                </div>

                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="rounded-xl bg-blue-50 p-3">
                                <Target className="h-5 w-5 text-blue-600" />
                            </div>

                            <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                                <TrendingUp className="h-3.5 w-3.5" />
                                Live
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
                                    {Math.max(
                                        0,
                                        totalTasks - completedTasks
                                    )}
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
                                        Team performance is calculated from
                                        the current sprint task activity.
                                        Review blocked work and workload
                                        distribution regularly.
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

                    {loading ? (
                        <div className="flex min-h-40 items-center justify-center">
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Loading team performance...
                            </div>
                        </div>
                    ) : filteredMembers.length === 0 ? (
                        <div className="flex min-h-40 items-center justify-center rounded-xl bg-slate-50">
                            <p className="text-sm text-slate-500">
                                No team performance data found.
                            </p>
                        </div>
                    ) : (
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
                                                    value={
                                                        member.completion
                                                    }
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 xl:min-w-[420px]">
                                                <div>
                                                    <p className="text-xs text-slate-400">
                                                        Productivity
                                                    </p>

                                                    <p className="mt-1 text-sm font-bold text-slate-900">
                                                        {
                                                            member.productivity
                                                        }
                                                        %
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
                                                    {member.trend ===
                                                    "up" ? (
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
                    )}
                </div>

                <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-xs leading-5 text-slate-500">
                        Performance metrics are calculated from the Team
                        Leader sprint task data returned by the backend.
                        Productivity is a derived team metric based on task
                        completion, delivery performance, and blocked work.
                    </p>
                </div>

                {typeof onRefresh === "function" && (
                    <button
                        type="button"
                        onClick={handleRefresh}
                        className="mt-4 hidden"
                    >
                        Refresh
                    </button>
                )}
            </div>
        </div>
    );
}
