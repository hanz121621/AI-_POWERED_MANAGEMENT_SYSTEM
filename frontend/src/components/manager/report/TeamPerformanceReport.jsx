import React, { useEffect, useMemo, useState } from "react";
import {
    AlertCircle,
    BarChart3,
    CheckCircle2,
    Clock3,
    UsersRound,
    UserRound,
    UserCheck,
    RefreshCw,
    Loader2,
    ShieldAlert,
    BriefcaseBusiness,
} from "lucide-react";
import axios from "axios";

// ============================================================
// REPORT-003
// VIEW TEAM PERFORMANCE REPORT
// ============================================================
//
// Primary Actor: Manager
//
// Report includes:
// - Team completion rate
// - Task distribution
// - Workload
// - Completed tasks
// - Delayed tasks
// - Blocked tasks
// - Team Leader progress
// - Developer contribution
// - Staff contribution
// - Configured Contributor classifications
//
// IMPORTANT:
// - No localStorage
// - No hard-coded project/team/task data
// - Data comes from the backend API
// - Contributor classifications come from API data
// ============================================================

// ============================================================
// API
// ============================================================

const API_URL = "/api/reports/team-performance";

// ============================================================
// SAFE ARRAY
// ============================================================

const toArray = (value) => {
    if (Array.isArray(value)) {
        return value;
    }

    if (value && typeof value === "object") {
        if (Array.isArray(value.data)) {
            return value.data;
        }

        if (Array.isArray(value.items)) {
            return value.items;
        }

        if (Array.isArray(value.records)) {
            return value.records;
        }

        if (Array.isArray(value.results)) {
            return value.results;
        }
    }

    return [];
};

// ============================================================
// NUMBER
// ============================================================

const toNumber = (value) => {
    const number = Number(value);

    return Number.isFinite(number) ? number : 0;
};

// ============================================================
// PERCENTAGE
// ============================================================

const calculatePercentage = (completed, total) => {
    const completedNumber = toNumber(completed);
    const totalNumber = toNumber(total);

    if (totalNumber <= 0) {
        return 0;
    }

    return Math.round((completedNumber / totalNumber) * 100);
};

// ============================================================
// DATE FORMATTER
// ============================================================

const formatDate = (value) => {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

// ============================================================
// DISPLAY VALUE
// ============================================================

const displayValue = (value, fallback = "—") => {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return fallback;
    }

    return value;
};

// ============================================================
// STATUS CLASS
// ============================================================

const getStatusClass = (status) => {
    const normalized = String(status ?? "")
        .trim()
        .toLowerCase();

    if (
        normalized.includes("complete") ||
        normalized.includes("done") ||
        normalized.includes("active")
    ) {
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    }

    if (
        normalized.includes("blocked") ||
        normalized.includes("delay")
    ) {
        return "bg-red-500/10 text-red-400 border-red-500/20";
    }

    if (normalized.includes("progress")) {
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    }

    if (
        normalized.includes("pending") ||
        normalized.includes("todo")
    ) {
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    }

    return "bg-slate-500/10 text-slate-300 border-slate-500/20";
};

// ============================================================
// CARD
// ============================================================

function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
}) {
    return (
        <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm text-slate-400">
                        {title}
                    </p>

                    <p className="mt-2 text-3xl font-bold text-white">
                        {value}
                    </p>

                    {subtitle && (
                        <p className="mt-1 text-xs text-slate-500">
                            {subtitle}
                        </p>
                    )}
                </div>

                <div className="rounded-lg bg-slate-800 p-3">
                    <Icon
                        size={21}
                        className="text-slate-300"
                    />
                </div>
            </div>
        </div>
    );
}

// ============================================================
// PROGRESS BAR
// ============================================================

function ProgressBar({ percentage }) {
    const safePercentage = Math.min(
        100,
        Math.max(0, toNumber(percentage))
    );

    return (
        <div className="w-full">
            <div className="mb-1 flex justify-between text-xs">
                <span className="text-slate-400">
                    Progress
                </span>

                <span className="font-medium text-white">
                    {safePercentage}%
                </span>
            </div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-700">
                <div
                    className="h-full rounded-full bg-blue-500 transition-all duration-500"
                    style={{
                        width: `${safePercentage}%`,
                    }}
                />
            </div>
        </div>
    );
}

// ============================================================
// EMPTY STATE
// ============================================================

function EmptyState({ message }) {
    return (
        <div className="flex min-h-[160px] items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900/50 p-6 text-center">
            <div>
                <BarChart3
                    size={30}
                    className="mx-auto mb-3 text-slate-600"
                />

                <p className="text-sm text-slate-400">
                    {message}
                </p>
            </div>
        </div>
    );
}

// ============================================================
// ERROR STATE
// ============================================================

function ErrorState({
    message,
    onRetry,
}) {
    return (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
            <div className="flex items-start gap-3">
                <AlertCircle
                    size={22}
                    className="mt-0.5 shrink-0 text-red-400"
                />

                <div className="flex-1">
                    <h3 className="font-semibold text-red-300">
                        Unable to load team performance
                    </h3>

                    <p className="mt-1 text-sm text-red-400/80">
                        {message}
                    </p>

                    <button
                        type="button"
                        onClick={onRetry}
                        className="mt-4 inline-flex items-center gap-2 rounded-lg border border-red-500/30 px-4 py-2 text-sm text-red-300 transition hover:bg-red-500/10"
                    >
                        <RefreshCw size={15} />
                        Try again
                    </button>
                </div>
            </div>
        </div>
    );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function TeamPerformanceReport() {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    // ========================================================
    // LOAD REPORT
    // ========================================================

    const loadReport = async ({ refresh = false } = {}) => {
        try {
            setError("");

            if (refresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const response = await axios.get(API_URL);
            const responseData = response?.data;

            const data =
                responseData?.data ?? responseData;

            if (responseData?.success === false) {
                throw new Error(
                    responseData?.error ||
                        responseData?.message ||
                        "The server could not generate the team performance report."
                );
            }

            setReport(data ?? null);
        } catch (requestError) {
            console.error(
                "TeamPerformanceReport:",
                requestError
            );

            const status =
                requestError?.response?.status;

            if (status === 401) {
                setError(
                    "Your session has expired or you are not authenticated."
                );
            } else if (status === 403) {
                setError(
                    "You are not authorized to view this team performance report."
                );
            } else {
                setError(
                    requestError?.response?.data?.message ||
                        requestError?.response?.data?.error ||
                        requestError?.message ||
                        "Unable to load the team performance report."
                );
            }

            setReport(null);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {
        loadReport();
    }, []);

    // ========================================================
    // NORMALIZED REPORT DATA
    // ========================================================

    const normalized = useMemo(() => {
        if (!report) {
            return {
                teams: [],
                contributors: [],
                classifications: [],
                taskDistribution: [],
                totalTasks: 0,
                completedTasks: 0,
                delayedTasks: 0,
                blockedTasks: 0,
                workload: 0,
                completionRate: 0,
                teamLeaderProgress: [],
            };
        }

        const statistics =
            report.statistics ??
            report.taskStatistics ??
            report.summary ??
            {};

        const teams = toArray(
            report.teams ??
                report.teamPerformance ??
                report.teamReports
        );

        const contributors = toArray(
            report.contributors ??
                report.contributorPerformance ??
                report.memberPerformance
        );

        const classifications = toArray(
            report.contributorClassifications ??
                report.classifications ??
                report.contributorTypes ??
                report.contributorSubTypes
        );

        const taskDistribution = toArray(
            report.taskDistribution ??
                report.taskStatusDistribution
        );

        const teamLeaderProgress = toArray(
            report.teamLeaderProgress ??
                report.teamLeaders ??
                report.leaderProgress
        );

        const totalTasks = toNumber(
            statistics.totalTasks ??
                report.totalTasks
        );

        const completedTasks = toNumber(
            statistics.completedTasks ??
                report.completedTasks
        );

        const delayedTasks = toNumber(
            statistics.delayedTasks ??
                report.delayedTasks ??
                report.overdueTasks
        );

        const blockedTasks = toNumber(
            statistics.blockedTasks ??
                report.blockedTasks
        );

        const workload = toNumber(
            statistics.workload ??
                report.workload
        );

        const completionRate =
            report.completionRate ??
            statistics.completionRate ??
            calculatePercentage(
                completedTasks,
                totalTasks
            );

        return {
            teams,
            contributors,
            classifications,
            taskDistribution,
            totalTasks,
            completedTasks,
            delayedTasks,
            blockedTasks,
            workload,
            completionRate: toNumber(
                completionRate
            ),
            teamLeaderProgress,
        };
    }, [report]);

    // ========================================================
    // DERIVE CONTRIBUTORS BY CLASSIFICATION
    // ========================================================

    const contributorGroups = useMemo(() => {
        const groups = new Map();

        normalized.contributors.forEach(
            (contributor) => {
                const classification =
                    contributor?.contributorType ??
                    contributor?.contributorTypeName ??
                    contributor?.contributorSubType ??
                    contributor?.contributorSubTypeName ??
                    contributor?.classification ??
                    contributor?.classificationName ??
                    contributor?.type;

                if (
                    classification === null ||
                    classification === undefined ||
                    String(classification).trim() === ""
                ) {
                    return;
                }

                const key =
                    String(classification).trim();

                if (!groups.has(key)) {
                    groups.set(key, []);
                }

                groups
                    .get(key)
                    .push(contributor);
            }
        );

        return Array.from(groups.entries()).map(
            ([classification, members]) => ({
                classification,
                members,
            })
        );
    }, [normalized.contributors]);

    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {
        return (
            <div className="min-h-full bg-slate-950 p-6">
                <div className="flex min-h-[500px] items-center justify-center">
                    <div className="text-center">
                        <Loader2
                            size={36}
                            className="mx-auto animate-spin text-blue-400"
                        />

                        <p className="mt-4 text-sm text-slate-400">
                            Loading team performance report...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // ========================================================
    // ERROR
    // ========================================================

    if (error) {
        return (
            <div className="min-h-full bg-slate-950 p-6">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-white">
                            Team Performance Report
                        </h1>

                        <p className="mt-1 text-sm text-slate-400">
                            REPORT-003
                        </p>
                    </div>

                    <ErrorState
                        message={error}
                        onRetry={() => loadReport()}
                    />
                </div>
            </div>
        );
    }

    // ========================================================
    // MAIN UI
    // ========================================================

    return (
        <div className="min-h-full bg-slate-950 p-4 sm:p-6">
            <div className="mx-auto max-w-7xl">

                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-blue-500/10 p-2.5">
                                <UsersRound
                                    size={24}
                                    className="text-blue-400"
                                />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold text-white">
                                    Team Performance Report
                                </h1>

                                <p className="mt-1 text-sm text-slate-400">
                                    REPORT-003 · Team performance and contribution analysis
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            loadReport({
                                refresh: true,
                            })
                        }
                        disabled={refreshing}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <RefreshCw
                            size={16}
                            className={
                                refreshing
                                    ? "animate-spin"
                                    : ""
                            }
                        />

                        {refreshing
                            ? "Refreshing..."
                            : "Refresh"}
                    </button>
                </div>

                {/* ==================================================
                    REPORT META
                ================================================== */}

                {report && (
                    <div className="mb-6 rounded-xl border border-slate-700 bg-slate-900/70 p-4">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                            <div>
                                <p className="text-xs text-slate-500">
                                    Project
                                </p>

                                <p className="mt-1 font-medium text-white">
                                    {displayValue(
                                        report.project?.name ??
                                            report.projectName
                                    )}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-500">
                                    Team
                                </p>

                                <p className="mt-1 font-medium text-white">
                                    {displayValue(
                                        report.team?.name ??
                                            report.teamName
                                    )}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-500">
                                    Reporting Period
                                </p>

                                <p className="mt-1 font-medium text-white">
                                    {formatDate(
                                        report.startDate
                                    )}{" "}
                                    —{" "}
                                    {formatDate(
                                        report.endDate
                                    )}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-500">
                                    Last Updated
                                </p>

                                <p className="mt-1 font-medium text-white">
                                    {formatDate(
                                        report.updatedAt ??
                                            report.generatedAt
                                    )}
                                </p>
                            </div>

                        </div>
                    </div>
                )}

                {/* ==================================================
                    STATISTICS
                ================================================== */}

                <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">

                    <StatCard
                        title="Completion Rate"
                        value={`${normalized.completionRate}%`}
                        subtitle="Team task completion"
                        icon={CheckCircle2}
                    />

                    <StatCard
                        title="Total Tasks"
                        value={normalized.totalTasks}
                        subtitle="Tasks in report"
                        icon={BarChart3}
                    />

                    <StatCard
                        title="Completed"
                        value={normalized.completedTasks}
                        subtitle="Completed tasks"
                        icon={CheckCircle2}
                    />

                    <StatCard
                        title="Delayed"
                        value={normalized.delayedTasks}
                        subtitle="Delayed or overdue"
                        icon={Clock3}
                    />

                    <StatCard
                        title="Blocked"
                        value={normalized.blockedTasks}
                        subtitle="Blocked tasks"
                        icon={ShieldAlert}
                    />

                </div>

                {/* ==================================================
                    OVERALL PROGRESS
                ================================================== */}

                <div className="mb-6 rounded-xl border border-slate-700 bg-slate-900/80 p-5">
                    <div className="mb-4 flex items-center gap-3">
                        <BarChart3
                            size={20}
                            className="text-blue-400"
                        />

                        <h2 className="font-semibold text-white">
                            Team Completion Rate
                        </h2>
                    </div>

                    <ProgressBar
                        percentage={
                            normalized.completionRate
                        }
                    />
                </div>

                {/* ==================================================
                    TASK DISTRIBUTION
                ================================================== */}

                <section className="mb-6">
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-white">
                            Task Distribution
                        </h2>

                        <p className="mt-1 text-sm text-slate-400">
                            Distribution of tasks using the current system data.
                        </p>
                    </div>

                    {normalized.taskDistribution.length === 0 ? (
                        <EmptyState message="No task distribution data is available." />
                    ) : (
                        <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900/80">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[600px]">
                                    <thead className="border-b border-slate-700 bg-slate-900">
                                        <tr>
                                            <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                                                Status
                                            </th>

                                            <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-400">
                                                Tasks
                                            </th>

                                            <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-400">
                                                Percentage
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-slate-800">
                                        {normalized.taskDistribution.map(
                                            (item, index) => {
                                                const count =
                                                    toNumber(
                                                        item?.count ??
                                                            item?.taskCount ??
                                                            item?.total
                                                    );

                                                const percentage =
                                                    item?.percentage ??
                                                    calculatePercentage(
                                                        count,
                                                        normalized.totalTasks
                                                    );

                                                const status =
                                                    item?.status ??
                                                    item?.name;

                                                return (
                                                    <tr
                                                        key={
                                                            item?.id ??
                                                            status ??
                                                            index
                                                        }
                                                        className="transition hover:bg-slate-800/40"
                                                    >
                                                        <td className="px-5 py-4">
                                                            <span
                                                                className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClass(
                                                                    status
                                                                )}`}
                                                            >
                                                                {displayValue(
                                                                    status
                                                                )}
                                                            </span>
                                                        </td>

                                                        <td className="px-5 py-4 text-right text-sm font-medium text-white">
                                                            {count}
                                                        </td>

                                                        <td className="px-5 py-4 text-right text-sm text-slate-300">
                                                            {toNumber(
                                                                percentage
                                                            )}
                                                            %
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </section>

                {/* ==================================================
                    TEAM PERFORMANCE
                ================================================== */}

                <section className="mb-6">
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-white">
                            Team Performance
                        </h2>

                        <p className="mt-1 text-sm text-slate-400">
                            Completion and workload by authorized team.
                        </p>
                    </div>

                    {normalized.teams.length === 0 ? (
                        <EmptyState message="No team performance data is available." />
                    ) : (
                        <div className="grid gap-4 lg:grid-cols-2">
                            {normalized.teams.map(
                                (team, index) => {
                                    const total =
                                        toNumber(
                                            team?.totalTasks
                                        );

                                    const completed =
                                        toNumber(
                                            team?.completedTasks
                                        );

                                    const completion =
                                        team?.completionRate ??
                                        calculatePercentage(
                                            completed,
                                            total
                                        );

                                    return (
                                        <div
                                            key={
                                                team?.id ??
                                                team?.teamId ??
                                                index
                                            }
                                            className="rounded-xl border border-slate-700 bg-slate-900/80 p-5"
                                        >
                                            <div className="mb-5 flex items-start justify-between gap-4">
                                                <div>
                                                    <h3 className="font-semibold text-white">
                                                        {displayValue(
                                                            team?.name ??
                                                                team?.teamName
                                                        )}
                                                    </h3>

                                                    <p className="mt-1 text-xs text-slate-500">
                                                        {displayValue(
                                                            team?.description
                                                        )}
                                                    </p>
                                                </div>

                                                <UsersRound
                                                    size={20}
                                                    className="text-slate-500"
                                                />
                                            </div>

                                            <ProgressBar
                                                percentage={
                                                    completion
                                                }
                                            />

                                            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">

                                                <div className="rounded-lg bg-slate-800/70 p-3">
                                                    <p className="text-xs text-slate-500">
                                                        Tasks
                                                    </p>

                                                    <p className="mt-1 font-semibold text-white">
                                                        {total}
                                                    </p>
                                                </div>

                                                <div className="rounded-lg bg-slate-800/70 p-3">
                                                    <p className="text-xs text-slate-500">
                                                        Completed
                                                    </p>

                                                    <p className="mt-1 font-semibold text-emerald-400">
                                                        {completed}
                                                    </p>
                                                </div>

                                                <div className="rounded-lg bg-slate-800/70 p-3">
                                                    <p className="text-xs text-slate-500">
                                                        Delayed
                                                    </p>

                                                    <p className="mt-1 font-semibold text-yellow-400">
                                                        {toNumber(
                                                            team?.delayedTasks
                                                        )}
                                                    </p>
                                                </div>

                                                <div className="rounded-lg bg-slate-800/70 p-3">
                                                    <p className="text-xs text-slate-500">
                                                        Blocked
                                                    </p>

                                                    <p className="mt-1 font-semibold text-red-400">
                                                        {toNumber(
                                                            team?.blockedTasks
                                                        )}
                                                    </p>
                                                </div>

                                            </div>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    )}
                </section>

                {/* ==================================================
                    WORKLOAD
                ================================================== */}

                <section className="mb-6">
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-white">
                            Workload
                        </h2>

                        <p className="mt-1 text-sm text-slate-400">
                            Current task workload from actual report data.
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-5">
                        <div className="flex items-center gap-3">
                            <BriefcaseBusiness
                                size={21}
                                className="text-blue-400"
                            />

                            <div>
                                <p className="text-sm text-slate-400">
                                    Total Assigned Workload
                                </p>

                                <p className="mt-1 text-2xl font-bold text-white">
                                    {normalized.workload}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ==================================================
                    TEAM LEADER PROGRESS
                ================================================== */}

                <section className="mb-6">
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-white">
                            Team Leader Progress
                        </h2>

                        <p className="mt-1 text-sm text-slate-400">
                            Team Leader progress from configured team data.
                        </p>
                    </div>

                    {normalized.teamLeaderProgress.length === 0 ? (
                        <EmptyState message="No Team Leader progress data is available." />
                    ) : (
                        <div className="grid gap-4 lg:grid-cols-2">
                            {normalized.teamLeaderProgress.map(
                                (leader, index) => {
                                    const progress =
                                        leader?.progress ??
                                        leader?.completionRate ??
                                        calculatePercentage(
                                            leader?.completedTasks,
                                            leader?.totalTasks
                                        );

                                    return (
                                        <div
                                            key={
                                                leader?.id ??
                                                leader?.userId ??
                                                index
                                            }
                                            className="rounded-xl border border-slate-700 bg-slate-900/80 p-5"
                                        >
                                            <div className="mb-4 flex items-center gap-3">
                                                <div className="rounded-full bg-slate-800 p-2">
                                                    <UserCheck
                                                        size={19}
                                                        className="text-slate-300"
                                                    />
                                                </div>

                                                <div>
                                                    <p className="font-medium text-white">
                                                        {displayValue(
                                                            leader?.name ??
                                                                leader?.fullName ??
                                                                leader?.userName
                                                        )}
                                                    </p>

                                                    <p className="text-xs text-slate-500">
                                                        Team Leader
                                                    </p>
                                                </div>
                                            </div>

                                            <ProgressBar
                                                percentage={
                                                    progress
                                                }
                                            />

                                            <div className="mt-4 grid grid-cols-3 gap-3">

                                                <div>
                                                    <p className="text-xs text-slate-500">
                                                        Tasks
                                                    </p>

                                                    <p className="mt-1 text-sm font-medium text-white">
                                                        {toNumber(
                                                            leader?.totalTasks
                                                        )}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-xs text-slate-500">
                                                        Completed
                                                    </p>

                                                    <p className="mt-1 text-sm font-medium text-emerald-400">
                                                        {toNumber(
                                                            leader?.completedTasks
                                                        )}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-xs text-slate-500">
                                                        Progress
                                                    </p>

                                                    <p className="mt-1 text-sm font-medium text-white">
                                                        {toNumber(
                                                            progress
                                                        )}
                                                        %
                                                    </p>
                                                </div>

                                            </div>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    )}
                </section>

                {/* ==================================================
                    CONTRIBUTOR CLASSIFICATIONS
                ================================================== */}

                <section className="mb-6">
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-white">
                            Contributor Performance
                        </h2>

                        <p className="mt-1 text-sm text-slate-400">
                            Contributor classifications are loaded from configured system data.
                        </p>
                    </div>

                    {contributorGroups.length === 0 ? (
                        <EmptyState message="No contributor classification data is available." />
                    ) : (
                        <div className="grid gap-4 lg:grid-cols-2">
                            {contributorGroups.map(
                                ({
                                    classification,
                                    members,
                                }) => (
                                    <div
                                        key={classification}
                                        className="rounded-xl border border-slate-700 bg-slate-900/80 p-5"
                                    >
                                        <div className="mb-4 flex items-center gap-3">
                                            <div className="rounded-lg bg-slate-800 p-2">
                                                <UserRound
                                                    size={20}
                                                    className="text-slate-300"
                                                />
                                            </div>

                                            <div>
                                                <h3 className="font-semibold text-white">
                                                    {classification}
                                                </h3>

                                                <p className="text-xs text-slate-500">
                                                    Configured contributor classification
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            {members.map(
                                                (
                                                    member,
                                                    index
                                                ) => {
                                                    const progress =
                                                        member?.progress ??
                                                        member?.completionRate ??
                                                        calculatePercentage(
                                                            member?.completedTasks,
                                                            member?.totalTasks
                                                        );

                                                    return (
                                                        <div
                                                            key={
                                                                member?.id ??
                                                                member?.userId ??
                                                                index
                                                            }
                                                            className="rounded-lg border border-slate-800 bg-slate-950/60 p-4"
                                                        >
                                                            <div className="mb-3 flex items-center justify-between gap-4">
                                                                <div>
                                                                    <p className="text-sm font-medium text-white">
                                                                        {displayValue(
                                                                            member?.name ??
                                                                                member?.fullName ??
                                                                                member?.userName
                                                                        )}
                                                                    </p>

                                                                    <p className="mt-1 text-xs text-slate-500">
                                                                        {displayValue(
                                                                            member?.email
                                                                        )}
                                                                    </p>
                                                                </div>

                                                                <span className="text-sm font-semibold text-white">
                                                                    {toNumber(
                                                                        progress
                                                                    )}
                                                                    %
                                                                </span>
                                                            </div>

                                                            <ProgressBar
                                                                percentage={
                                                                    progress
                                                                }
                                                            />

                                                            {/* FIXED:
                                                                ProgressBar is now
                                                                correctly closed
                                                                before this div.
                                                            */}

                                                            <div className="mt-3 grid grid-cols-3 gap-3">

                                                                <div>
                                                                    <p className="text-xs text-slate-500">
                                                                        Assigned
                                                                    </p>

                                                                    <p className="mt-1 text-sm text-white">
                                                                        {toNumber(
                                                                            member?.totalTasks
                                                                        )}
                                                                    </p>
                                                                </div>

                                                                <div>
                                                                    <p className="text-xs text-slate-500">
                                                                        Completed
                                                                    </p>

                                                                    <p className="mt-1 text-sm text-emerald-400">
                                                                        {toNumber(
                                                                            member?.completedTasks
                                                                        )}
                                                                    </p>
                                                                </div>

                                                                <div>
                                                                    <p className="text-xs text-slate-500">
                                                                        Blocked
                                                                    </p>

                                                                    <p className="mt-1 text-sm text-red-400">
                                                                        {toNumber(
                                                                            member?.blockedTasks
                                                                        )}
                                                                    </p>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </section>

                {/* ==================================================
                    CONFIGURED CLASSIFICATIONS
                ================================================== */}

                <section className="mb-6">
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-white">
                            Configured Contributor Classifications
                        </h2>

                        <p className="mt-1 text-sm text-slate-400">
                            These values are supplied by the system configuration and are not hard-coded in the report.
                        </p>
                    </div>

                    {normalized.classifications.length === 0 ? (
                        <EmptyState message="No configured contributor classifications were returned by the server." />
                    ) : (
                        <div className="flex flex-wrap gap-3">
                            {normalized.classifications.map(
                                (
                                    classification,
                                    index
                                ) => {
                                    const name =
                                        typeof classification ===
                                        "string"
                                            ? classification
                                            : classification?.name ??
                                              classification?.displayName ??
                                              classification?.type ??
                                              classification?.label;

                                    return (
                                        <div
                                            key={
                                                classification?.id ??
                                                classification?.value ??
                                                index
                                            }
                                            className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-3"
                                        >
                                            <p className="text-sm font-medium text-white">
                                                {displayValue(
                                                    name
                                                )}
                                            </p>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    )}
                </section>

                {/* ==================================================
                    REPORT NOTICE
                ================================================== */}

                <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4">
                    <div className="flex items-start gap-3">
                        <AlertCircle
                            size={19}
                            className="mt-0.5 shrink-0 text-slate-500"
                        />

                        <div>
                            <p className="text-sm font-medium text-slate-300">
                                Report information
                            </p>

                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                This report displays information returned by the
                                authorized backend report service. Contributor
                                classifications are not created or assumed by
                                this frontend.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}