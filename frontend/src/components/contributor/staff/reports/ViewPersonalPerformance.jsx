
import {
    TrendingUp,
    CheckCircle2,
    Clock3,
    AlertCircle,
} from "lucide-react";

// ============================================================
// VIEW PERSONAL PERFORMANCE
// ============================================================

function ViewPersonalPerformance() {
    return (
        <div className="p-6">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="mb-6 flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                    <TrendingUp size={22} />
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-slate-800">
                        Personal Performance
                    </h3>

                    <p className="text-sm text-slate-500">
                        Monitor your individual work performance.
                    </p>
                </div>

            </div>

            {/* ==================================================
                PERFORMANCE CARDS
            ================================================== */}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                {/* Completed Tasks */}

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
                            <CheckCircle2 size={20} />
                        </div>

                        <div>
                            <p className="text-sm text-slate-500">
                                Completed Tasks
                            </p>

                            <p className="text-2xl font-bold text-slate-800">
                                --
                            </p>
                        </div>

                    </div>

                </div>

                {/* Tasks In Progress */}

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                            <Clock3 size={20} />
                        </div>

                        <div>
                            <p className="text-sm text-slate-500">
                                Tasks In Progress
                            </p>

                            <p className="text-2xl font-bold text-slate-800">
                                --
                            </p>
                        </div>

                    </div>

                </div>

                {/* Performance Score */}

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                            <TrendingUp size={20} />
                        </div>

                        <div>
                            <p className="text-sm text-slate-500">
                                Performance Score
                            </p>

                            <p className="text-2xl font-bold text-slate-800">
                                --
                            </p>
                        </div>

                    </div>

                </div>

            </div>

            {/* ==================================================
                PERFORMANCE DETAILS
            ================================================== */}

            <div className="mt-6 rounded-lg border border-slate-200 bg-white p-5">

                <div className="flex items-start gap-3">

                    <AlertCircle
                        size={20}
                        className="mt-0.5 text-indigo-600"
                    />

                    <div>

                        <h4 className="font-semibold text-slate-800">
                            Performance Overview
                        </h4>

                        <p className="mt-1 text-sm leading-6 text-slate-500">
                            Your personal performance information will
                            appear here when task and project data is
                            connected to the backend.
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default ViewPersonalPerformance;
