import { useState } from "react";
import {
    BarChart3,
    History,
    TrendingUp,
    UsersRound,
} from "lucide-react";

import TeamPerformanceReport from "@/components/contributor/teamleader/reports/TeamPerformanceReport";
import TeamTaskHistory from "@/components/contributor/teamleader/reports/TeamTaskHistory";

const REPORT_TABS = {
    PERFORMANCE: "performance",
    HISTORY: "history",
};

export default function Reports() {
    const [activeTab, setActiveTab] = useState(
        REPORT_TABS.PERFORMANCE
    );

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                {/* =====================================================
                    PAGE HEADER
                ====================================================== */}
                <div className="mb-8">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100">
                                <BarChart3 className="h-6 w-6 text-indigo-600" />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                    Reports & Monitoring
                                </h1>

                                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                                    Monitor team performance, workload,
                                    productivity, task history, and previous
                                    team activities.
                                </p>
                            </div>
                        </div>

                        {/* Role */}
                        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50">
                                <UsersRound className="h-5 w-5 text-indigo-600" />
                            </div>

                            <div>
                                <p className="text-xs text-slate-400">
                                    Access Level
                                </p>

                                <p className="text-sm font-semibold text-slate-800">
                                    Team Leader
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* =====================================================
                    SUMMARY STRIP
                ====================================================== */}
                <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <SummaryCard
                        icon={TrendingUp}
                        title="Team Performance"
                        description="Monitor productivity and contribution."
                    />

                    <SummaryCard
                        icon={History}
                        title="Task History"
                        description="Review previous team task activities."
                    />

                    <SummaryCard
                        icon={UsersRound}
                        title="Team Monitoring"
                        description="Track workload and team progress."
                    />
                </div>

                {/* =====================================================
                    REPORT NAVIGATION
                ====================================================== */}
                <div className="mb-6 rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                        <ReportTab
                            active={
                                activeTab ===
                                REPORT_TABS.PERFORMANCE
                            }
                            icon={BarChart3}
                            title="Team Performance"
                            description="Performance and productivity"
                            onClick={() =>
                                setActiveTab(
                                    REPORT_TABS.PERFORMANCE
                                )
                            }
                        />

                        <ReportTab
                            active={
                                activeTab ===
                                REPORT_TABS.HISTORY
                            }
                            icon={History}
                            title="Team Task History"
                            description="Historical task activities"
                            onClick={() =>
                                setActiveTab(REPORT_TABS.HISTORY)
                            }
                        />
                    </div>
                </div>

                {/* =====================================================
                    REPORT CONTENT
                ====================================================== */}
                {activeTab === REPORT_TABS.PERFORMANCE ? (
                    <TeamPerformanceReport />
                ) : (
                    <TeamTaskHistory />
                )}
            </div>
        </div>
    );
}

function SummaryCard({
    icon: Icon,
    title,
    description,
}) {
    return (
        <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50">
                <Icon className="h-5 w-5 text-indigo-600" />
            </div>

            <div>
                <p className="text-sm font-semibold text-slate-800">
                    {title}
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                    {description}
                </p>
            </div>
        </div>
    );
}

function ReportTab({
    active,
    icon: Icon,
    title,
    description,
    onClick,
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-left transition ${
                active
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-50"
            }`}
        >
            <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                    active
                        ? "bg-white/15"
                        : "bg-slate-100"
                }`}
            >
                <Icon
                    className={`h-5 w-5 ${
                        active
                            ? "text-white"
                            : "text-indigo-600"
                    }`}
                />
            </div>

            <div className="min-w-0">
                <p
                    className={`text-sm font-semibold ${
                        active
                            ? "text-white"
                            : "text-slate-800"
                    }`}
                >
                    {title}
                </p>

                <p
                    className={`mt-0.5 text-xs ${
                        active
                            ? "text-indigo-100"
                            : "text-slate-400"
                    }`}
                >
                    {description}
                </p>
            </div>
        </button>
    );
}
