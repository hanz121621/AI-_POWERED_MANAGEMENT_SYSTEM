
import { useState } from "react";
import {
    ClipboardList,
    Plus,
    ListChecks,
    Clock3,
    CheckCircle2,
    UsersRound,
} from "lucide-react";

import ViewTeamTasks from "@/components/contributor/teamleader/task-management/ViewTeamTasks";
import CreateTeamTask from "@/components/contributor/teamleader/task-management/CreateTeamTask";
import UpdateTeamTask from "@/components/contributor/teamleader/task-management/UpdateTeamTask";
import DeleteTeamTask from "@/components/contributor/teamleader/task-management/DeleteTeamTask";
import AssignTaskToContributor from "@/components/contributor/teamleader/task-management/AssignTaskToContributor";
import SetTaskPriority from "@/components/contributor/teamleader/task-management/SetTaskPriority";
import SetTaskDeadline from "@/components/contributor/teamleader/task-management/SetTaskDeadline";
import UpdateTeamTaskStatus from "@/components/contributor/teamleader/task-management/UpdateTeamTaskStatus";
import ReviewCompletedTasks from "@/components/contributor/teamleader/task-management/ReviewCompletedTasks";

export default function Tasks() {
    const [activeAction, setActiveAction] = useState(null);

    const closeAction = () => {
        setActiveAction(null);
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
            <div className="mx-auto max-w-7xl">

                {/* =====================================================
                    PAGE HEADER
                ====================================================== */}
                <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100">
                                <ClipboardList className="h-6 w-6 text-blue-600" />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">
                                    Task Management
                                </h1>

                                <p className="mt-1 max-w-2xl text-sm text-slate-500">
                                    Create, assign, prioritize, monitor, and review tasks
                                    for your team.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setActiveAction("create")}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                        >
                            <Plus className="h-4 w-4" />
                            Create Task
                        </button>
                    </div>
                </div>

                {/* =====================================================
                    QUICK ACTIONS
                ====================================================== */}
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

                    <button
                        type="button"
                        onClick={() => setActiveAction("create")}
                        className="group rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
                    >
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                            <Plus className="h-5 w-5 text-blue-600" />
                        </div>

                        <h3 className="font-semibold text-slate-900">
                            Create Task
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                            Create a team task or subtask.
                        </p>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveAction("assign")}
                        className="group rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
                    >
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100">
                            <UsersRound className="h-5 w-5 text-indigo-600" />
                        </div>

                        <h3 className="font-semibold text-slate-900">
                            Assign Task
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                            Assign work to your contributors.
                        </p>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveAction("status")}
                        className="group rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md"
                    >
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                            <Clock3 className="h-5 w-5 text-amber-600" />
                        </div>

                        <h3 className="font-semibold text-slate-900">
                            Update Status
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                            Track the current task status.
                        </p>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveAction("review")}
                        className="group rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
                    >
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        </div>

                        <h3 className="font-semibold text-slate-900">
                            Review Completed
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                            Review submitted team work.
                        </p>
                    </button>
                </div>

                {/* =====================================================
                    TASK LIST
                ====================================================== */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 px-5 py-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                                <ListChecks className="h-5 w-5 text-slate-600" />
                            </div>

                            <div>
                                <h2 className="font-semibold text-slate-900">
                                    Team Tasks
                                </h2>

                                <p className="text-xs text-slate-500">
                                    Monitor tasks assigned to your team.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-5">
                        <ViewTeamTasks
                            onCreate={() => setActiveAction("create")}
                            onUpdate={() => setActiveAction("update")}
                            onDelete={() => setActiveAction("delete")}
                            onAssign={() => setActiveAction("assign")}
                            onPriority={() => setActiveAction("priority")}
                            onDeadline={() => setActiveAction("deadline")}
                            onStatus={() => setActiveAction("status")}
                        />
                    </div>
                </div>

                {/* =====================================================
                    COMPLETED TASK REVIEW
                ====================================================== */}
                <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 px-5 py-4">
                        <h2 className="font-semibold text-slate-900">
                            Completed Tasks Review
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                            Review completed work submitted by Staff and Developers.
                        </p>
                    </div>

                    <div className="p-5">
                        <ReviewCompletedTasks />
                    </div>
                </div>

                {/* =====================================================
                    MODALS / ACTION PANELS
                ====================================================== */}

                {activeAction === "create" && (
                    <CreateTeamTask onClose={closeAction} />
                )}

                {activeAction === "update" && (
                    <UpdateTeamTask onClose={closeAction} />
                )}

                {activeAction === "delete" && (
                    <DeleteTeamTask onClose={closeAction} />
                )}

                {activeAction === "assign" && (
                    <AssignTaskToContributor onClose={closeAction} />
                )}

                {activeAction === "priority" && (
                    <SetTaskPriority onClose={closeAction} />
                )}

                {activeAction === "deadline" && (
                    <SetTaskDeadline onClose={closeAction} />
                )}

                {activeAction === "status" && (
                    <UpdateTeamTaskStatus onClose={closeAction} />
                )}
            </div>
        </div>
    );
}
