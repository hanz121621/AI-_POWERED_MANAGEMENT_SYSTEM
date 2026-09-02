import { useState } from "react";

import {
    Target,
    ListChecks,
    X,
    Eye,
} from "lucide-react";

import ViewSprintTasks from "@/components/contributor/staff/sprint-participation/ViewSprintTasks";
import ViewSprintProgress from "@/components/contributor/staff/sprint-participation/ViewSprintProgress";

// ============================================================
// STAFF - SPRINT PARTICIPATION
// ============================================================

function SprintParticipation() {
    const [selectedUseCase, setSelectedUseCase] = useState(null);

    const useCases = [
        {
            id: "STAFF-SPRINT-001",
            title: "View Sprint Tasks",
            description:
                "View tasks assigned to you within the current sprint.",
            icon: ListChecks,
            component: ViewSprintTasks,
        },
        {
            id: "STAFF-SPRINT-002",
            title: "View Sprint Goals & Progress",
            description:
                "View sprint goals, progress, and completion information.",
            icon: Target,
            component: ViewSprintProgress,
        },
    ];

    const SelectedComponent = selectedUseCase?.component;

    return (
        <div className="min-h-screen bg-slate-950 p-6 text-white">
            {/* HEADER */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">
                    Sprint Participation
                </h1>

                <p className="mt-2 text-slate-400">
                    Participate in sprints, view sprint tasks, and monitor
                    sprint progress.
                </p>
            </div>

            {/* USE CASE CARDS */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {useCases.map((useCase) => {
                    const Icon = useCase.icon;

                    return (
                        <div
                            key={useCase.id}
                            className="rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-lg transition hover:border-blue-500 hover:shadow-blue-950/30"
                        >
                            <div className="mb-5 flex items-start justify-between">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/20">
                                    <Icon
                                        size={25}
                                        className="text-blue-400"
                                    />
                                </div>

                                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
                                    {useCase.id}
                                </span>
                            </div>

                            <h2 className="text-xl font-semibold text-white">
                                {useCase.title}
                            </h2>

                            <p className="mt-2 min-h-[48px] text-sm leading-6 text-slate-400">
                                {useCase.description}
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedUseCase(useCase)
                                }
                                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-500"
                            >
                                <Eye size={18} />
                                Open
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* MODAL */}
            {selectedUseCase && SelectedComponent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                    <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
                        {/* MODAL HEADER */}
                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-700 bg-slate-900 px-6 py-4">
                            <div>
                                <h2 className="text-xl font-bold text-white">
                                    {selectedUseCase.title}
                                </h2>

                                <p className="mt-1 text-xs text-slate-400">
                                    {selectedUseCase.id}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setSelectedUseCase(null)}
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                            >
                                <X size={22} />
                            </button>
                        </div>

                        {/* CHILD COMPONENT */}
                        <div className="p-6">
                            <SelectedComponent />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SprintParticipation;