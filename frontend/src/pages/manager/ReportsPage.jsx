
// ============================================================
// AIPMS - MANAGER REPORTS PAGE
// src/pages/manager/Reports.jsx
//
// Manager Reports & Monitoring
//
// Admin-style UI:
// - Neutral theme-aware background
// - No gradients
// - Compact cards
// - Admin-style spacing and controls
// - Uses shadcn/theme tokens
// - Preserves existing report functionality
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

import ViewProjectDashboard from "../../components/manager/report/ViewProjectDashboard";
import ProjectTimeline from "../../components/manager/report/ProjectTimeline";
import RiskIssues from "../../components/manager/report/RiskIssues";
import SprintProgressReport from "../../components/manager/report/SprintProgressReport";
import TeamPerformanceReport from "../../components/manager/report/TeamPerformanceReport";
import AIProjectSummary from "../../components/manager/report/AIProjectSummary";

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
    },
    {
        id: "aiProjectSummary",
        label: "AI Project Summary",
        shortLabel: "AI Summary",
        icon: Bot,
        description: "AI-powered summary of project performance.",
    },
    {
        id: "projectTimeline",
        label: "Project Timeline",
        shortLabel: "Timeline",
        icon: CalendarDays,
        description: "Project milestones, deadlines, and timeline.",
    },
    {
        id: "riskIssues",
        label: "Risks & Issues",
        shortLabel: "Risks",
        icon: AlertCircle,
        description: "Project risks, issues, and warnings.",
    },
    {
        id: "sprintProgress",
        label: "Sprint Progress Report",
        shortLabel: "Sprint Progress",
        icon: CheckCircle2,
        description: "Sprint progress, tasks, and completion.",
    },
    {
        id: "teamPerformance",
        label: "Team Performance Report",
        shortLabel: "Team Performance",
        icon: Users,
        description: "Team productivity and contribution.",
    },
    {
        id: "projectDashboard",
        label: "View Project Dashboard",
        shortLabel: "Project Dashboard",
        icon: FolderKanban,
        description: "Detailed project dashboard and statistics.",
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
}) {
    return (
        <div
            className="
                rounded-lg
                border
                border-border
                bg-card
                p-4
                shadow-sm
                transition-colors
                hover:bg-accent/30
            "
        >
            <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-sm font-medium text-muted-foreground">
                        {title}
                    </p>

                    <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
                        {value}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                        {subtitle}
                    </p>
                </div>

                <div
                    className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-md
                        bg-primary/10
                        text-primary
                    "
                >
                    <Icon className="h-4 w-4" />
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
                    mb-1.5
                    block
                    text-xs
                    font-medium
                    text-muted-foreground
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
        <section className="rounded-lg border border-border bg-card shadow-sm">
            <div
                className="
                    flex
                    flex-col
                    gap-3
                    border-b
                    border-border
                    px-5
                    py-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >
                <div className="flex items-center gap-3">
                    <div
                        className="
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-md
                            bg-muted
                            text-muted-foreground
                        "
                    >
                        <Activity className="h-4 w-4" />
                    </div>

                    <div>
                        <h2 className="text-base font-semibold text-foreground">
                            Report Filters
                        </h2>

                        <p className="text-xs text-muted-foreground">
                            Narrow reports by date, project, team, or user.
                        </p>
                    </div>
                </div>

                <span
                    className="
                        inline-flex
                        w-fit
                        items-center
                        rounded-md
                        border
                        border-border
                        bg-muted
                        px-2.5
                        py-1
                        text-xs
                        font-medium
                        text-muted-foreground
                    "
                >
                    Current data
                </span>
            </div>

            <div className="p-5">
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
                                className="
                                    pointer-events-none
                                    absolute
                                    left-3
                                    top-1/2
                                    h-4
                                    w-4
                                    -translate-y-1/2
                                    text-muted-foreground
                                "
                            />

                            <input
                                type="date"
                                className="
                                    h-10
                                    w-full
                                    rounded-md
                                    border
                                    border-input
                                    bg-background
                                    py-2
                                    pl-9
                                    pr-3
                                    text-sm
                                    text-foreground
                                    outline-none
                                    transition-colors
                                    focus:border-ring
                                    focus:ring-2
                                    focus:ring-ring/20
                                "
                            />
                        </div>
                    </FilterField>

                    {/* TO DATE */}

                    <FilterField label="To Date">
                        <div className="relative">
                            <CalendarDays
                                className="
                                    pointer-events-none
                                    absolute
                                    left-3
                                    top-1/2
                                    h-4
                                    w-4
                                    -translate-y-1/2
                                    text-muted-foreground
                                "
                            />

                            <input
                                type="date"
                                className="
                                    h-10
                                    w-full
                                    rounded-md
                                    border
                                    border-input
                                    bg-background
                                    py-2
                                    pl-9
                                    pr-3
                                    text-sm
                                    text-foreground
                                    outline-none
                                    transition-colors
                                    focus:border-ring
                                    focus:ring-2
                                    focus:ring-ring/20
                                "
                            />
                        </div>
                    </FilterField>

                    {/* PROJECT */}

                    <FilterField label="Project">
                        <select
                            className="
                                h-10
                                w-full
                                rounded-md
                                border
                                border-input
                                bg-background
                                px-3
                                text-sm
                                text-foreground
                                outline-none
                                transition-colors
                                focus:border-ring
                                focus:ring-2
                                focus:ring-ring/20
                            "
                        >
                            <option>All projects</option>
                        </select>
                    </FilterField>

                    {/* TEAM */}

                    <FilterField label="Team">
                        <select
                            className="
                                h-10
                                w-full
                                rounded-md
                                border
                                border-input
                                bg-background
                                px-3
                                text-sm
                                text-foreground
                                outline-none
                                transition-colors
                                focus:border-ring
                                focus:ring-2
                                focus:ring-ring/20
                            "
                        >
                            <option>All teams</option>
                        </select>
                    </FilterField>

                    {/* USER */}

                    <FilterField label="User">
                        <select
                            className="
                                h-10
                                w-full
                                rounded-md
                                border
                                border-input
                                bg-background
                                px-3
                                text-sm
                                text-foreground
                                outline-none
                                transition-colors
                                focus:border-ring
                                focus:ring-2
                                focus:ring-ring/20
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
                        rounded-md
                        border
                        border-dashed
                        border-border
                        bg-muted/40
                        p-4
                    "
                >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

                    <div>
                        <p className="text-sm font-medium text-foreground">
                            No project, team, or user data is currently
                            available for filtering.
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                            Available data will appear here automatically.
                        </p>
                    </div>
                </div>
            </div>
        </section>
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
                    rounded-lg
                    border
                    border-border
                    bg-card
                    px-5
                    py-4
                    shadow-sm
                "
            >
                <div
                    className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-md
                        bg-primary/10
                        text-primary
                    "
                >
                    <BarChart3 className="h-4 w-4" />
                </div>

                <div>
                    <h2 className="text-base font-semibold text-foreground">
                        System Overview
                    </h2>

                    <p className="text-xs text-muted-foreground">
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
                />

                <StatCard
                    title="Teams"
                    value="0"
                    subtitle="Teams in the system"
                    icon={Users}
                />

                <StatCard
                    title="Task Completion"
                    value="0%"
                    subtitle="0 of 0 tasks completed"
                    icon={CheckCircle2}
                />

                <StatCard
                    title="AI Usage"
                    value="0"
                    subtitle="AI usage records"
                    icon={Bot}
                />
            </div>

            {/* SECONDARY STATISTICS */}

            <div
                className="
                    grid
                    grid-cols-1
                    gap-4
                    sm:grid-cols-2
                    xl:grid-cols-3
                "
            >
                <StatCard
                    title="Activity Records"
                    value="0"
                    subtitle="Recent activity records"
                    icon={Activity}
                />

                <StatCard
                    title="Active Projects"
                    value="0"
                    subtitle="Currently active"
                    icon={FolderKanban}
                />

                <StatCard
                    title="Project Risks"
                    value="0"
                    subtitle="Current risks and issues"
                    icon={ShieldAlert}
                />
            </div>

            {/* EMPTY STATE */}

            <div
                className="
                    rounded-lg
                    border
                    border-dashed
                    border-border
                    bg-card
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
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-md
                        bg-muted
                        text-muted-foreground
                    "
                >
                    <FileText className="h-5 w-5" />
                </div>

                <h3 className="mt-4 text-base font-semibold text-foreground">
                    Report data will appear here
                </h3>

                <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
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
        <section
            className="
                overflow-hidden
                rounded-lg
                border
                border-border
                bg-card
                shadow-sm
            "
        >
            {/* REPORT HEADER */}

            <div
                className="
                    border-b
                    border-border
                    bg-muted/30
                    px-5
                    py-4
                "
            >
                <div className="flex items-center gap-3">
                    <div
                        className="
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-md
                            bg-primary/10
                            text-primary
                        "
                    >
                        <FileText className="h-4 w-4" />
                    </div>

                    <div>
                        <h2 className="text-base font-semibold text-foreground">
                            {report.title}
                        </h2>

                        <p className="mt-0.5 text-xs text-muted-foreground">
                            {report.description}
                        </p>
                    </div>
                </div>
            </div>

            {/* REPORT CONTENT */}

            <div className="p-5">
                <ReportComponent />
            </div>
        </section>
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
        <section className="space-y-4">
            <div>
                <h2 className="text-base font-semibold text-foreground">
                    Reports
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
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
                    xl:grid-cols-4
                "
            >
                {REPORT_NAVIGATION.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeReport === item.id;

                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => setActiveReport(item.id)}
                            title={item.description}
                            className={`
                                group
                                relative
                                flex
                                min-h-[112px]
                                flex-col
                                rounded-lg
                                border
                                p-4
                                text-left
                                transition-colors
                                focus:outline-none
                                focus:ring-2
                                focus:ring-ring
                                ${
                                    isActive
                                        ? "border-primary/40 bg-primary/5 shadow-sm"
                                        : "border-border bg-card hover:bg-accent"
                                }
                            `}
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div
                                    className={`
                                        flex
                                        h-9
                                        w-9
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-md
                                        ${
                                            isActive
                                                ? "bg-primary/10 text-primary"
                                                : "bg-muted text-muted-foreground"
                                        }
                                    `}
                                >
                                    <Icon className="h-4 w-4" />
                                </div>

                                <ChevronRight
                                    className={`
                                        h-4
                                        w-4
                                        transition-transform
                                        ${
                                            isActive
                                                ? "text-primary"
                                                : "text-muted-foreground group-hover:translate-x-0.5"
                                        }
                                    `}
                                />
                            </div>

                            <div className="mt-3">
                                <p
                                    className={`
                                        text-sm
                                        font-medium
                                        ${
                                            isActive
                                                ? "text-foreground"
                                                : "text-foreground"
                                        }
                                    `}
                                >
                                    {item.label}
                                </p>

                                <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                                    {item.description}
                                </p>
                            </div>

                            {isActive && (
                                <div className="mt-auto pt-2">
                                    <span className="text-[11px] font-medium text-primary">
                                        Currently selected
                                    </span>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </section>
    );
}

// ============================================================
// MAIN REPORTS PAGE
// ============================================================

function ReportsPage() {
    const [activeReport, setActiveReport] = useState("overview");

    const [isRefreshing, setIsRefreshing] = useState(false);

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

    const activeNavigationItem = REPORT_NAVIGATION.find(
        (item) => item.id === activeReport
    );

    // ========================================================
    // REPORT CONTENT
    // ========================================================

    const reportContent = useMemo(() => {
        if (activeReport === "overview") {
            return <OverviewReport />;
        }

        return <DetailedReport type={activeReport} />;
    }, [activeReport]);

    // ========================================================
    // MAIN PAGE
    // ========================================================

    return (
        <div className="w-full space-y-6 text-foreground">
            {/* ==================================================
                PAGE HEADER
            ================================================== */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <div
                        className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-lg
                            bg-primary/10
                            text-primary
                        "
                    >
                        <BarChart3 className="h-5 w-5" />
                    </div>

                    <div>
                        <h1 className="text-xl font-semibold tracking-tight text-foreground">
                            Reports
                        </h1>

                        <p className="text-sm text-muted-foreground">
                            Monitor project, sprint, team, risk, and AI performance.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="
                            inline-flex
                            h-10
                            items-center
                            justify-center
                            gap-2
                            rounded-md
                            border
                            border-input
                            bg-background
                            px-4
                            text-sm
                            font-medium
                            text-foreground
                            shadow-sm
                            transition-colors
                            hover:bg-accent
                            hover:text-accent-foreground
                            disabled:pointer-events-none
                            disabled:opacity-50
                        "
                    >
                        <RefreshCw
                            className={`h-4 w-4 ${
                                isRefreshing ? "animate-spin" : ""
                            }`}
                        />

                        Refresh
                    </button>

                    <button
                        type="button"
                        onClick={handleExportPDF}
                        className="
                            inline-flex
                            h-10
                            items-center
                            justify-center
                            gap-2
                            rounded-md
                            bg-primary
                            px-4
                            text-sm
                            font-medium
                            text-primary-foreground
                            shadow-sm
                            transition-colors
                            hover:bg-primary/90
                        "
                    >
                        <Download className="h-4 w-4" />

                        Export PDF
                    </button>
                </div>
            </div>

            {/* ==================================================
                QUICK STATISTICS
            ================================================== */}

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
                />

                <StatCard
                    title="Teams"
                    value="0"
                    subtitle="Teams in the system"
                    icon={Users}
                />

                <StatCard
                    title="Task Completion"
                    value="0%"
                    subtitle="0 of 0 tasks completed"
                    icon={CheckCircle2}
                />

                <StatCard
                    title="Project Risks"
                    value="0"
                    subtitle="Current risks and issues"
                    icon={AlertCircle}
                />
            </div>

            {/* ==================================================
                FILTERS
            ================================================== */}

            <ReportFilters />

            {/* ==================================================
                REPORT NAVIGATION
            ================================================== */}

            <ReportNavigation
                activeReport={activeReport}
                setActiveReport={setActiveReport}
            />

            {/* ==================================================
                CURRENT REPORT INDICATOR
            ================================================== */}

            {activeNavigationItem && (
                <div
                    className="
                        flex
                        items-center
                        gap-3
                        rounded-lg
                        border
                        border-border
                        bg-card
                        px-5
                        py-4
                        shadow-sm
                    "
                >
                    <div
                        className="
                            flex
                            h-8
                            w-8
                            shrink-0
                            items-center
                            justify-center
                            rounded-md
                            bg-primary/10
                            text-primary
                        "
                    >
                        {React.createElement(
                            activeNavigationItem.icon,
                            {
                                className: "h-4 w-4",
                            }
                        )}
                    </div>

                    <div className="min-w-0">
                        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                            Active Report
                        </p>

                        <h2 className="mt-0.5 truncate text-sm font-semibold text-foreground">
                            {activeNavigationItem.label}
                        </h2>
                    </div>

                    <div className="ml-auto hidden sm:block">
                        <span
                            className="
                                inline-flex
                                items-center
                                rounded-md
                                border
                                border-border
                                bg-muted
                                px-2.5
                                py-1
                                text-xs
                                font-medium
                                text-muted-foreground
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

            <div>{reportContent}</div>

            {/* ==================================================
                PRINT STYLES
            ================================================== */}

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

