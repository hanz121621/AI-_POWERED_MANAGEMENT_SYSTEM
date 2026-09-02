
import {
    BarChart3,
    ClipboardList,
    TrendingUp,
    CheckCircle2,
    Clock3,
    AlertCircle,
    ArrowLeft,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import ViewPersonalPerformance from "@/components/contributor/staff/reports/ViewPersonalPerformance";
import ViewTaskHistory from "@/components/contributor/staff/reports/ViewTaskHistory";

// ============================================================
// STAFF REPORTS
// ============================================================

function Reports() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 p-6">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="mb-8">

                <button
                    type="button"
                    onClick={() => navigate("/staff/dashboard")}
                    className="mb-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-100"
                >
                    <ArrowLeft size={18} />
                    Back to Dashboard
                </button>

                <div className="flex items-center gap-4">

                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
                        <BarChart3 size={28} />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">
                            Reports & Monitoring
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            View your personal performance and task history.
                        </p>
                    </div>

                </div>

            </div>

            {/* ==================================================
                SUMMARY CARDS
            ================================================== */}

            <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">

                {/* Total Tasks */}

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Total Tasks
                            </p>

                            <h2 className="mt-2 text-3xl font-bold text-slate-800">
                                --
                            </h2>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                            <ClipboardList size={22} />
                        </div>

                    </div>

                </div>

                {/* Completed */}

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Completed
                            </p>

                            <h2 className="mt-2 text-3xl font-bold text-slate-800">
                                --
                            </h2>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-100 text-green-600">
                            <CheckCircle2 size={22} />
                        </div>

                    </div>

                </div>

                {/* In Progress */}

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                In Progress
                            </p>

                            <h2 className="mt-2 text-3xl font-bold text-slate-800">
                                --
                            </h2>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                            <Clock3 size={22} />
                        </div>

                    </div>

                </div>

                {/* Performance */}

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Performance
                            </p>

                            <h2 className="mt-2 text-3xl font-bold text-slate-800">
                                --
                            </h2>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                            <TrendingUp size={22} />
                        </div>

                    </div>

                </div>

            </div>

            {/* ==================================================
                REPORT INFORMATION
            ================================================== */}

            <div className="mb-8 rounded-xl border border-blue-200 bg-blue-50 p-5">

                <div className="flex items-start gap-3">

                    <div className="mt-0.5 text-blue-600">
                        <AlertCircle size={20} />
                    </div>

                    <div>

                        <h3 className="font-semibold text-blue-800">
                            Staff Performance Reports
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-blue-700">
                            Use the sections below to review your individual
                            performance and track your completed and assigned
                            work.
                        </p>

                    </div>

                </div>

            </div>

            {/* ==================================================
                PERSONAL PERFORMANCE
            ================================================== */}

            <section className="mb-8">

                <div className="mb-4 flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                        <TrendingUp size={20} />
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-slate-800">
                            Personal Performance
                        </h2>

                        <p className="text-sm text-slate-500">
                            Review your individual work performance.
                        </p>
                    </div>

                </div>

                <div className="rounded-xl border border-slate-200 bg-white shadow-sm">

                    <ViewPersonalPerformance />

                </div>

            </section>

            {/* ==================================================
                TASK HISTORY
            ================================================== */}

            <section>

                <div className="mb-4 flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                        <ClipboardList size={20} />
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-slate-800">
                            Task History
                        </h2>

                        <p className="text-sm text-slate-500">
                            Review your assigned and completed tasks.
                        </p>
                    </div>

                </div>

                <div className="rounded-xl border border-slate-200 bg-white shadow-sm">

                    <ViewTaskHistory />

                </div>

            </section>

        </div>
    );
}

export default Reports;
