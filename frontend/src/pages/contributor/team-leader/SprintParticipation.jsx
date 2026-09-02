import {
    Timer,
    ListChecks,
    TrendingUp,
} from "lucide-react";

import ViewSprintProgress from "@/components/contributor/teamleader/sprint-participation/ViewSprintProgress";
import ViewSprintTasks from "@/components/contributor/teamleader/sprint-participation/ViewSprintTasks";

export default function SprintParticipation() {
    return (
        <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">

                {/* =====================================================
                    PAGE HEADER
                ====================================================== */}
                <div className="mb-8">
                    <div className="flex items-start gap-4">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-100">
                            <Timer className="h-6 w-6 text-purple-600" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                Sprint Participation
                            </h1>

                            <p className="mt-1 text-sm text-slate-500">
                                Monitor sprint tasks, goals, priorities,
                                workload, and team progress.
                            </p>
                        </div>
                    </div>
                </div>

                {/* =====================================================
                    SPRINT TASKS
                    TL-SPRINT-001
                ====================================================== */}
                <section className="mb-6">

                    <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100">
                            <ListChecks className="h-5 w-5 text-blue-600" />
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">
                                Sprint Tasks
                            </h2>

                            <p className="text-sm text-slate-500">
                                View and monitor tasks assigned to your team.
                            </p>
                        </div>
                    </div>

                    <ViewSprintTasks />
                </section>

                {/* =====================================================
                    SPRINT GOALS & PROGRESS
                    TL-SPRINT-002
                ====================================================== */}
                <section>

                    <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100">
                            <TrendingUp className="h-5 w-5 text-emerald-600" />
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">
                                Sprint Goals & Progress
                            </h2>

                            <p className="text-sm text-slate-500">
                                Track sprint objectives and team-level progress.
                            </p>
                        </div>
                    </div>

                    <ViewSprintProgress />
                </section>

            </div>
        </div>
    );
}