
// ============================================================
// AIPMS - MANAGER REPORTS PAGE
// src/pages/manager/Reports.jsx
//
// Manager Reports & Monitoring
//
// Sprint-style UI:
// - Light slate page background
// - Gradient hero
// - Rounded 2xl cards
// - Colorful statistics
// - Modern report navigation
// - Clean filters
// ============================================================

import React, { useMemo, useState } from "react";

import {
    AlertCircle,
    BarChart3,
    Bot,
    CalendarDays,
    CheckCircle2,
    Download,
    FolderKanban,
    RefreshCw,
    Users,
    ChevronRight,
    FileText,
    Activity,
    ShieldAlert,
} from "lucide-react";

// ============================================================
// REPORT COMPONENTS
// ============================================================

import ViewProjectDashboard
    from "../../components/manager/report/ViewProjectDashboard";

import ProjectTimeline
    from "../../components/manager/report/ProjectTimeline";

import RiskIssues
    from "../../components/manager/report/RiskIssues";

import SprintProgressReport
    from "../../components/manager/report/SprintProgressReport";

import TeamPerformanceReport
    from "../../components/manager/report/TeamPerformanceReport";

import AIProjectSummary
    from "../../components/manager/report/AIProjectSummary";

// ============================================================
// REPORT NAVIGATION
// ============================================================

const REPORT_NAVIGATION = [
    {
        id: "overview",
        label: "Overview",
        shortLabel: "Overview",
        icon: BarChart3,
        description: "Overall project and team reporting overview.",
        gradient: "from-violet-500 to-indigo-500",
        light: "bg-violet-50",
        text: "text-violet-600",
    },
    {
        id: "aiProjectSummary",
        label: "AI Project Summary",
        shortLabel: "AI Summary",
        icon: Bot,
        description: "AI-powered summary of project performance.",
        gradient: "from-fuchsia-500 to-purple-500",
        light: "bg-fuchsia-50",
        text: "text-fuchsia-600",
    },
    {
        id: "projectTimeline",
        label: "Project Timeline",
        shortLabel: "Timeline",
        icon: CalendarDays,
        description: "Project milestones, deadlines, and timeline.",
        gradient: "from-cyan-500 to-blue-500",
        light: "bg-cyan-50",
        text: "text-cyan-600",
    },
    {
        id: "riskIssues",
        label: "Risks & Issues",
        shortLabel: "Risks",
        icon: AlertCircle,
        description: "Project risks, issues, and warnings.",
        gradient: "from-rose-500 to-orange-500",
        light: "bg-rose-50",
        text: "text-rose-600",
    },
    {
        id: "sprintProgress",
        label: "Sprint Progress Report",
        shortLabel: "Sprint Progress",
        icon: CheckCircle2,
        description: "Sprint progress, tasks, and completion.",
        gradient: "from-emerald-500 to-teal-500",
        light: "bg-emerald-50",
        text: "text-emerald-600",
    },
    {
        id: "teamPerformance",
        label: "Team Performance Report",
        shortLabel: "Team Performance",
        icon: Users,
        description: "Team productivity and contribution.",
        gradient: "from-blue-500 to-indigo-500",
        light: "bg-blue-50",
        text: "text-blue-600",
    },
    {
        id: "projectDashboard",
        label: "View Project Dashboard",
        shortLabel: "Project Dashboard",
        icon: FolderKanban,
        description: "Detailed project dashboard and statistics.",
        gradient: "from-amber-500 to-orange-500",
        light: "bg-amber-50",
        text: "text-amber-600",
    },
];

// ============================================================
// STAT CARD
// ============================================================

function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    gradient,
}) {
    return (
        <div
            className="
                group
                relative
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:shadow-lg
            "
        >
            {/* TOP COLOR STRIPE */}

            <div
                className={`
                    absolute
                    left-0
                    right-0
                    top-0
                    h-1
                    bg-gradient-to-r
                    ${gradient}
                `}
            />

            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-500">
                        {title}
                    </p>

                    <p
                        className="
                            mt-2
                            text-3xl
                            font-bold
                            tracking-tight
                            text-slate-900
                        "
                    >
                        {value}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                        {subtitle}
                    </p>
                </div>

                <div
                    className={`
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-gradient-to-br
                        ${gradient}
                        text-white
                        shadow-sm
                    `}
                >
                    <Icon size={21} />
                </div>
            </div>
        </div>
    );
}

// ============================================================
// FILTER INPUT
// ============================================================

function FilterField({
    label,
    children,
}) {
    return (
        <div>
            <label
                className="
                    mb-2
                    block
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-slate-500
                "
            >
                {label}
            </label>

            {children}
        </div>
    );
}

// ============================================================
// REPORT FILTERS
// ============================================================

function ReportFilters() {
    return (
        <div
            className="
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                shadow-sm
            "
        >
            <div
                className="
                    flex
                    flex-col
                    gap-3
                    border-b
                    border-slate-200
                    px-5
                    py-5
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    sm:px-6
                "
            >
                <div className="flex items-center gap-3">
                    <div
                        className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            bg-slate-100
                            text-slate-600
                        "
                    >
                        <Activity size={20} />
                    </div>

                    <div>
                        <h2 className="text-base font-bold text-slate-900">
                            Report Filters
                        </h2>

                        <p className="text-sm text-slate-500">
                            Narrow reports by date, project, team, or user.
                        </p>
                    </div>
                </div>

                <span
                    className="
                        inline-flex
                        w-fit
                        items-center
                        rounded-full
                        bg-slate-100
                        px-3
                        py-1
                        text-xs
                        font-semibold
                        text-slate-500
                    "
                >
                    Current data
                </span>
            </div>

            <div className="p-5 sm:p-6">
                <div
                    className="
                        grid
                        grid-cols-1
                        gap-4
                        md:grid-cols-2
                        xl:grid-cols-5
                    "
                >
                    {/* FROM DATE */}

                    <FilterField label="From Date">
                        <div className="relative">
                            <CalendarDays
                                size={17}
                                className="
                                    pointer-events-none
                                    absolute
                                    left-3
                                    top-1/2
                                    -translate-y-1/2
                                    text-slate-400
                                "
                            />

                            <input
                                type="date"
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-slate-50
                                    py-2.5
                                    pl-10
                                    pr-3
                                    text-sm
                                    text-slate-700
                                    outline-none
                                    transition
                                    focus:border-violet-400
                                    focus:bg-white
                                    focus:ring-2
                                    focus:ring-violet-100
                                "
                            />
                        </div>
                    </FilterField>

                    {/* TO DATE */}

                    <FilterField label="To Date">
                        <div className="relative">
                            <CalendarDays
                                size={17}
                                className="
                                    pointer-events-none
                                    absolute
                                    left-3
                                    top-1/2
                                    -translate-y-1/2
                                    text-slate-400
                                "
                            />

                            <input
                                type="date"
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-slate-50
                                    py-2.5
                                    pl-10
                                    pr-3
                                    text-sm
                                    text-slate-700
                                    outline-none
                                    transition
                                    focus:border-violet-400
                                    focus:bg-white
                                    focus:ring-2
                                    focus:ring-violet-100
                                "
                            />
                        </div>
                    </FilterField>

                    {/* PROJECT */}

                    <FilterField label="Project">
                        <select
                            className="
                                w-full
                                rounded-xl
                                border
                                border-slate-200
                                bg-slate-50
                                px-3
                                py-2.5
                                text-sm
                                text-slate-700
                                outline-none
                                transition
                                focus:border-violet-400
                                focus:bg-white
                                focus:ring-2
                                focus:ring-violet-100
                            "
                        >
                            <option>All projects</option>
                        </select>
                    </FilterField>

                    {/* TEAM */}

                    <FilterField label="Team">
                        <select
                            className="
                                w-full
                                rounded-xl
                                border
                                border-slate-200
                                bg-slate-50
                                px-3
                                py-2.5
                                text-sm
                                text-slate-700
                                outline-none
                                transition
                                focus:border-violet-400
                                focus:bg-white
                                focus:ring-2
                                focus:ring-violet-100
                            "
                        >
                            <option>All teams</option>
                        </select>
                    </FilterField>

                    {/* USER */}

                    <FilterField label="User">
                        <select
                            className="
                                w-full
                                rounded-xl
                                border
                                border-slate-200
                                bg-slate-50
                                px-3
                                py-2.5
                                text-sm
                                text-slate-700
                                outline-none
                                transition
                                focus:border-violet-400
                                focus:bg-white
                                focus:ring-2
                                focus:ring-violet-100
                            "
                        >
                            <option>All users</option>
                        </select>
                    </FilterField>
                </div>

                <div
                    className="
                        mt-5
                        flex
                        items-start
                        gap-3
                        rounded-xl
                        border
                        border-dashed
                        border-slate-200
                        bg-slate-50
                        p-4
                    "
                >
                    <AlertCircle
                        size={18}
                        className="mt-0.5 shrink-0 text-slate-400"
                    />

                    <div>
                        <p className="text-sm font-medium text-slate-600">
                            No project, team, or user data is currently
                            available for filtering.
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                            Available data will appear here automatically.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================================
// OVERVIEW REPORT
// ============================================================

function OverviewReport() {
    return (
        <div className="space-y-6">
            {/* OVERVIEW HEADER */}

            <div
                className="
                    flex
                    items-center
                    gap-3
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    px-5
                    py-4
                    shadow-sm
                "
            >
                <div
                    className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        bg-gradient-to-br
                        from-violet-500
                        to-indigo-500
                        text-white
                    "
                >
                    <BarChart3 size={20} />
                </div>

                <div>
                    <h2 className="font-bold text-slate-900">
                        System Overview
                    </h2>

                    <p className="text-sm text-slate-500">
                        Overall project performance and operational information.
                    </p>
                </div>
            </div>

            {/* STATISTICS */}

            <div
                className="
                    grid
                    grid-cols-1
                    gap-4
                    sm:grid-cols-2
                    xl:grid-cols-4
                "
            >
                <StatCard
                    title="Total Projects"
                    value="0"
                    subtitle="Current projects"
                    icon={FolderKanban}
                    gradient="from-violet-500 to-indigo-500"
                />

                <StatCard
                    title="Teams"
                    value="0"
                    subtitle="Teams in the system"
                    icon={Users}
                    gradient="from-fuchsia-500 to-purple-500"
                />

                <StatCard
                    title="Task Completion"
                    value="0%"
                    subtitle="0 of 0 tasks completed"
                    icon={CheckCircle2}
                    gradient="from-emerald-500 to-teal-500"
                />

                <StatCard
                    title="AI Usage"
                    value="0"
                    subtitle="AI usage records"
                    icon={Bot}
                    gradient="from-amber-500 to-orange-500"
                />
            </div>

            {/* SECONDARY STATISTICS */}

            <div
                className="
                    grid
                    grid-cols-1
                    gap-4
                    sm:grid-cols-2
                    lg:grid-cols-3
                "
            >
                <StatCard
                    title="Activity Records"
                    value="0"
                    subtitle="Recent activity records"
                    icon={Activity}
                    gradient="from-blue-500 to-cyan-500"
                />

                <StatCard
                    title="Active Projects"
                    value="0"
                    subtitle="Currently active"
                    icon={FolderKanban}
                    gradient="from-cyan-500 to-blue-500"
                />

                <StatCard
                    title="Project Risks"
                    value="0"
                    subtitle="Current risks and issues"
                    icon={ShieldAlert}
                    gradient="from-rose-500 to-orange-500"
                />
            </div>

            {/* EMPTY STATE */}

            <div
                className="
                    rounded-2xl
                    border
                    border-dashed
                    border-slate-300
                    bg-white
                    px-6
                    py-10
                    text-center
                    shadow-sm
                "
            >
                <div
                    className="
                        mx-auto
                        flex
                        h-14
                        w-14
                        items-center
                        justify-center
                        rounded-2xl
                        bg-slate-100
                        text-slate-400
                    "
                >
                    <FileText size={25} />
                </div>

                <h3 className="mt-4 text-base font-bold text-slate-800">
                    Report data will appear here
                </h3>

                <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
                    Select a report above to view detailed project,
                    sprint, risk, AI, or team information.
                </p>
            </div>
        </div>
    );
}

// ============================================================
// DETAILED REPORT
// ============================================================

function DetailedReport({ type }) {
    const reports = {
        aiProjectSummary: {
            title: "AI Project Summary",
            description:
                "AI-powered analysis and summary of current project information.",
            component: AIProjectSummary,
        },

        projectTimeline: {
            title: "Project Timeline",
            description:
                "Project milestones, deadlines, and timeline information.",
            component: ProjectTimeline,
        },

        riskIssues: {
            title: "Risks & Issues",
            description:
                "Monitor current project risks, issues, and warnings.",
            component: RiskIssues,
        },

        sprintProgress: {
            title: "Sprint Progress Report",
            description:
                "Sprint progress, task completion, and sprint performance.",
            component: SprintProgressReport,
        },

        teamPerformance: {
            title: "Team Performance Report",
            description:
                "Team productivity, contribution, and performance.",
            component: TeamPerformanceReport,
        },

        projectDashboard: {
            title: "View Project Dashboard",
            description:
                "Detailed project overview, progress, and statistics.",
            component: ViewProjectDashboard,
        },
    };

    const report = reports[type];

    if (!report) {
        return null;
    }

    const ReportComponent = report.component;

    return (
        <div
            className="
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                shadow-sm
            "
        >
            {/* REPORT HEADER */}

            <div
                className="
                    border-b
                    border-slate-200
                    bg-slate-50
                    px-5
                    py-5
                    sm:px-6
                "
            >
                <div className="flex items-center gap-3">
                    <div
                        className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            bg-white
                            text-violet-600
                            shadow-sm
                        "
                    >
                        <FileText size={20} />
                    </div>

                    <div>
                        <h2 className="text-lg font-bold text-slate-900">
                            {report.title}
                        </h2>

                        <p className="mt-0.5 text-sm text-slate-500">
                            {report.description}
                        </p>
                    </div>
                </div>
            </div>

            {/* REPORT CONTENT */}

            <div className="p-5 sm:p-6">
                <ReportComponent />
            </div>
        </div>
    );
}

// ============================================================
// REPORT NAVIGATION
// ============================================================

function ReportNavigation({
    activeReport,
    setActiveReport,
}) {
    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-lg font-bold text-slate-900">
                    Reports
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    Select a report to view detailed information.
                </p>
            </div>

            <div
                className="
                    grid
                    grid-cols-1
                    gap-3
                    sm:grid-cols-2
                    lg:grid-cols-3
                    xl:grid-cols-7
                "
            >
                {REPORT_NAVIGATION.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeReport === item.id;

                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() =>
                                setActiveReport(item.id)
                            }
                            title={item.description}
                            className={`
                                group
                                relative
                                overflow-hidden
                                rounded-2xl
                                border
                                p-4
                                text-left
                                transition-all
                                duration-200
                                focus:outline-none
                                focus:ring-2
                                focus:ring-violet-400

                                ${
                                    isActive
                                        ? `
                                            border-violet-200
                                            bg-white
                                            shadow-lg
                                            shadow-violet-100
                                        `
                                        : `
                                            border-slate-200
                                            bg-white
                                            shadow-sm
                                            hover:-translate-y-0.5
                                            hover:border-slate-300
                                            hover:shadow-md
                                        `
                                }
                            `}
                        >
                            {/* ACTIVE TOP STRIPE */}

                            {isActive && (
                                <div
                                    className={`
                                        absolute
                                        left-0
                                        right-0
                                        top-0
                                        h-1
                                        bg-gradient-to-r
                                        ${item.gradient}
                                    `}
                                />
                            )}

                            <div className="flex items-start justify-between gap-3">
                                <div
                                    className={`
                                        flex
                                        h-10
                                        w-10
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-xl
                                        ${
                                            isActive
                                                ? `bg-gradient-to-br ${item.gradient} text-white`
                                                : `${item.light} ${item.text}`
                                        }
                                    `}
                                >
                                    <Icon size={19} />
                                </div>

                                <ChevronRight
                                    size={17}
                                    className={`
                                        mt-1
                                        transition-transform
                                        ${
                                            isActive
                                                ? "translate-x-0.5 text-violet-500"
                                                : "text-slate-300 group-hover:translate-x-0.5 group-hover:text-slate-500"
                                        }
                                    `}
                                />
                            </div>

                            <div className="mt-4">
                                <p
                                    className={`
                                        text-sm
                                        font-bold
                                        ${
                                            isActive
                                                ? "text-slate-900"
                                                : "text-slate-700"
                                        }
                                    `}
                                >
                                    {item.label}
                                </p>

                                <p
                                    className="
                                        mt-1
                                        line-clamp-2
                                        text-xs
                                        leading-5
                                        text-slate-500
                                    "
                                >
                                    {item.description}
                                </p>
                            </div>

                            {isActive && (
                                <div
                                    className="
                                        mt-3
                                        text-[11px]
                                        font-bold
                                        uppercase
                                        tracking-wide
                                        text-violet-600
                                    "
                                >
                                    Currently selected
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

// ============================================================
// MAIN REPORTS PAGE
// ============================================================

function ReportsPage() {
    const [activeReport, setActiveReport] =
        useState("overview");

    const [isRefreshing, setIsRefreshing] =
        useState(false);

    // ========================================================
    // REFRESH
    // ========================================================

    const handleRefresh = () => {
        setIsRefreshing(true);

        window.setTimeout(() => {
            window.location.reload();
        }, 500);
    };

    // ========================================================
    // EXPORT
    // ========================================================

    const handleExportPDF = () => {
        window.print();
    };

    // ========================================================
    // ACTIVE NAVIGATION
    // ========================================================

    const activeNavigationItem =
        REPORT_NAVIGATION.find(
            (item) => item.id === activeReport
        );

    // ========================================================
    // REPORT CONTENT
    // ========================================================

    const reportContent = useMemo(() => {
        if (activeReport === "overview") {
            return <OverviewReport />;
        }

        return (
            <DetailedReport
                type={activeReport}
            />
        );
    }, [activeReport]);

    // ========================================================
    // MAIN PAGE
    // ========================================================

    return (
        <div
            className="
                min-h-full
                w-full
                bg-slate-50
                text-slate-900
            "
        >
            <div
                className="
                    mx-auto
                    max-w-7xl
                    px-4
                    py-6
                    sm:px-6
                    sm:py-8
                    lg:px-8
                "
            >
                {/* ==================================================
                    HERO
                ================================================== */}

                <div
                    className="
                        relative
                        mb-6
                        overflow-hidden
                        rounded-2xl
                        bg-gradient-to-r
                        from-violet-600
                        via-blue-600
                        to-cyan-500
                        p-6
                        text-white
                        shadow-lg
                        sm:p-8
                    "
                >
                    {/* DECORATIVE CIRCLES */}

                    <div
                        className="
                            pointer-events-none
                            absolute
                            -right-16
                            -top-20
                            h-64
                            w-64
                            rounded-full
                            bg-white/10
                        "
                    />

                    <div
                        className="
                            pointer-events-none
                            absolute
                            -bottom-28
                            right-32
                            h-56
                            w-56
                            rounded-full
                            bg-white/5
                        "
                    />

                    <div
                        className="
                            relative
                            flex
                            flex-col
                            gap-6
                            lg:flex-row
                            lg:items-center
                            lg:justify-between
                        "
                    >
                        {/* HERO LEFT */}

                        <div className="flex items-start gap-4">
                            <div
                                className="
                                    flex
                                    h-14
                                    w-14
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    bg-white/15
                                    ring-1
                                    ring-white/20
                                    backdrop-blur-sm
                                "
                            >
                                <BarChart3 size={28} />
                            </div>

                            <div>
                                <div
                                    className="
                                        mb-2
                                        inline-flex
                                        items-center
                                        rounded-full
                                        bg-white/15
                                        px-3
                                        py-1
                                        text-xs
                                        font-semibold
                                        backdrop-blur-sm
                                    "
                                >
                                    Manager Workspace
                                </div>

                                <h1
                                    className="
                                        text-3xl
                                        font-bold
                                        tracking-tight
                                        sm:text-4xl
                                    "
                                >
                                    Reports
                                </h1>

                                <p
                                    className="
                                        mt-2
                                        max-w-2xl
                                        text-sm
                                        leading-6
                                        text-white/80
                                        sm:text-base
                                    "
                                >
                                    Monitor project performance,
                                    sprint progress, team productivity,
                                    risks, timelines, and AI-powered
                                    project insights.
                                </p>
                            </div>
                        </div>

                        {/* HERO ACTIONS */}

                        <div
                            className="
                                flex
                                w-full
                                gap-3
                                lg:w-auto
                            "
                        >
                            <button
                                type="button"
                                onClick={handleRefresh}
                                disabled={isRefreshing}
                                className="
                                    inline-flex
                                    flex-1
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    border
                                    border-white/25
                                    bg-white/10
                                    px-4
                                    py-2.5
                                    text-sm
                                    font-semibold
                                    text-white
                                    backdrop-blur-sm
                                    transition
                                    hover:bg-white/20
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                    lg:flex-none
                                "
                            >
                                <RefreshCw
                                    size={17}
                                    className={
                                        isRefreshing
                                            ? "animate-spin"
                                            : ""
                                    }
                                />

                                Refresh
                            </button>

                            <button
                                type="button"
                                onClick={handleExportPDF}
                                className="
                                    inline-flex
                                    flex-1
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    bg-white
                                    px-4
                                    py-2.5
                                    text-sm
                                    font-semibold
                                    text-violet-700
                                    shadow-sm
                                    transition
                                    hover:bg-slate-50
                                    lg:flex-none
                                "
                            >
                                <Download size={17} />

                                Export PDF
                            </button>
                        </div>
                    </div>
                </div>

                {/* ==================================================
                    QUICK STATISTICS
                ================================================== */}

                <div
                    className="
                        mb-6
                        grid
                        grid-cols-1
                        gap-4
                        sm:grid-cols-2
                        xl:grid-cols-4
                    "
                >
                    <StatCard
                        title="Total Projects"
                        value="0"
                        subtitle="Current projects"
                        icon={FolderKanban}
                        gradient="from-violet-500 to-indigo-500"
                    />

                    <StatCard
                        title="Teams"
                        value="0"
                        subtitle="Teams in the system"
                        icon={Users}
                        gradient="from-fuchsia-500 to-purple-500"
                    />

                    <StatCard
                        title="Task Completion"
                        value="0%"
                        subtitle="0 of 0 tasks completed"
                        icon={CheckCircle2}
                        gradient="from-emerald-500 to-teal-500"
                    />

                    <StatCard
                        title="Project Risks"
                        value="0"
                        subtitle="Current risks and issues"
                        icon={AlertCircle}
                        gradient="from-rose-500 to-orange-500"
                    />
                </div>

                {/* ==================================================
                    FILTERS
                ================================================== */}

                <div className="mb-6">
                    <ReportFilters />
                </div>

                {/* ==================================================
                    REPORT NAVIGATION
                ================================================== */}

                <div className="mb-6">
                    <ReportNavigation
                        activeReport={activeReport}
                        setActiveReport={setActiveReport}
                    />
                </div>

                {/* ==================================================
                    CURRENT REPORT INDICATOR
                ================================================== */}

                {activeNavigationItem && (
                    <div
                        className="
                            mb-6
                            flex
                            items-center
                            gap-3
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            px-5
                            py-4
                            shadow-sm
                        "
                    >
                        <div
                            className={`
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-gradient-to-br
                                ${activeNavigationItem.gradient}
                                text-white
                            `}
                        >
                            {React.createElement(
                                activeNavigationItem.icon,
                                {
                                    size: 19,
                                }
                            )}
                        </div>

                        <div className="min-w-0">
                            <p
                                className="
                                    text-[11px]
                                    font-bold
                                    uppercase
                                    tracking-wider
                                    text-violet-600
                                "
                            >
                                Active Report
                            </p>

                            <h2
                                className="
                                    mt-0.5
                                    truncate
                                    text-base
                                    font-bold
                                    text-slate-900
                                "
                            >
                                {activeNavigationItem.label}
                            </h2>
                        </div>

                        <div className="ml-auto hidden sm:block">
                            <span
                                className="
                                    inline-flex
                                    items-center
                                    rounded-full
                                    bg-emerald-50
                                    px-3
                                    py-1
                                    text-xs
                                    font-semibold
                                    text-emerald-600
                                "
                            >
                                Selected
                            </span>
                        </div>
                    </div>
                )}

                {/* ==================================================
                    ACTIVE REPORT
                ================================================== */}

                <div className="mb-6">
                    {reportContent}
                </div>
            </div>

            {/* ======================================================
                PRINT STYLES
            ====================================================== */}

            <style>
                {`
                    @media print {

                        body {
                            background: white !important;
                        }

                        nav,
                        aside,
                        header,
                        .no-print {
                            display: none !important;
                        }

                        body,
                        #root {
                            margin: 0 !important;
                            padding: 0 !important;
                            width: 100% !important;
                            background: white !important;
                        }

                        * {
                            print-color-adjust: exact !important;
                            -webkit-print-color-adjust: exact !important;
                        }

                        section,
                        div {
                            box-shadow: none !important;
                        }

                        button {
                            display: none !important;
                        }

                        .bg-slate-50 {
                            background: white !important;
                        }
                    }
                `}
            </style>
        </div>
    );
}

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default ReportsPage;

