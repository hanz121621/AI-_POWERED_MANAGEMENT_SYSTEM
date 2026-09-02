
import {
    ClipboardList,
    CheckCircle2,
    Clock3,
    AlertCircle,
} from "lucide-react";

// ============================================================
// VIEW TASK HISTORY
// STAFF-REPORT-002
// ============================================================

function ViewTaskHistory() {
    return (
        <div className="p-6">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="mb-6 flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <ClipboardList size={22} />
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-slate-800">
                        Task History
                    </h3>

                    <p className="text-sm text-slate-500">
                        Review your assigned and completed tasks.
                    </p>
                </div>

            </div>

            {/* ==================================================
                SUMMARY
            ================================================== */}

            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">

                {/* Completed */}

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
                            <CheckCircle2 size={20} />
                        </div>

                        <div>
                            <p className="text-xs font-medium text-slate-500">
                                Completed
                            </p>

                            <p className="text-xl font-bold text-slate-800">
                                0
                            </p>
                        </div>

                    </div>

                </div>

                {/* In Progress */}

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                            <Clock3 size={20} />
                        </div>

                        <div>
                            <p className="text-xs font-medium text-slate-500">
                                In Progress
                            </p>

                            <p className="text-xl font-bold text-slate-800">
                                0
                            </p>
                        </div>

                    </div>

                </div>

                {/* Pending */}

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                            <AlertCircle size={20} />
                        </div>

                        <div>
                            <p className="text-xs font-medium text-slate-500">
                                Pending
                            </p>

                            <p className="text-xl font-bold text-slate-800">
                                0
                            </p>
                        </div>

                    </div>

                </div>

            </div>

            {/* ==================================================
                TASK HISTORY TABLE
            ================================================== */}

            <div className="overflow-hidden rounded-lg border border-slate-200">

                <div className="overflow-x-auto">

                    <table className="min-w-full">

                        <thead className="bg-slate-50">

                            <tr>

                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Task
                                </th>

                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Project
                                </th>

                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Status
                                </th>

                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Due Date
                                </th>

                            </tr>

                        </thead>

                        <tbody className="divide-y divide-slate-200 bg-white">

                            <tr>

                                <td
                                    colSpan="4"
                                    className="px-5 py-12 text-center"
                                >

                                    <div className="flex flex-col items-center">

                                        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                            <ClipboardList size={28} />
                                        </div>

                                        <p className="font-medium text-slate-600">
                                            No task history available
                                        </p>

                                        <p className="mt-1 max-w-md text-sm text-slate-400">
                                            Your assigned, completed, and
                                            previous tasks will appear here
                                            when task data is available.
                                        </p>

                                    </div>

                                </td>

                            </tr>

                        </tbody>

                    </table>

                </div>

            </div>

            {/* ==================================================
                INFORMATION
            ================================================== */}

            <div className="mt-5 rounded-lg border border-blue-200 bg-blue-50 p-4">

                <div className="flex items-start gap-3">

                    <AlertCircle
                        size={20}
                        className="mt-0.5 shrink-0 text-blue-600"
                    />

                    <div>

                        <h4 className="font-semibold text-blue-800">
                            Task History
                        </h4>

                        <p className="mt-1 text-sm leading-6 text-blue-700">
                            This section will display your task history
                            including task status, project information,
                            completion information, and due dates.
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default ViewTaskHistory;
