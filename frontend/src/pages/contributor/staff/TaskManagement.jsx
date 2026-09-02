
import { useState } from "react";
import {
    ClipboardList,
    RefreshCw,
    MessageSquare,
    Upload,
    CheckCircle2,
    X,
    Eye,
    Pencil,
} from "lucide-react";

import ViewAssignedTasks from "@/components/contributor/staff/task-management/ViewAssignedTasks";
import UpdateTaskStatus from "@/components/contributor/staff/task-management/UpdateTaskStatus";
import AddTaskComment from "@/components/contributor/staff/task-management/AddTaskComment";
import UploadTaskFiles from "@/components/contributor/staff/task-management/UploadTaskFiles";
import SubmitCompletedWork from "@/components/contributor/staff/task-management/SubmitCompletedWork";

// ============================================================
// STAFF TASK MANAGEMENT
// ============================================================

function TaskManagement() {
    const [selectedUseCase, setSelectedUseCase] = useState(null);

    const useCases = [
        {
            id: "STAFF-TASK-001",
            title: "View Assigned Tasks",
            description:
                "View tasks assigned to you, including task details, priority, status, deadlines, and project information.",
            icon: ClipboardList,
            component: ViewAssignedTasks,
        },
        {
            id: "STAFF-TASK-002",
            title: "Update Task Status",
            description:
                "Update the status of your assigned tasks as work progresses.",
            icon: Pencil,
            component: UpdateTaskStatus,
        },
        {
            id: "STAFF-TASK-003",
            title: "Add Task Comment",
            description:
                "Add comments and updates to tasks to communicate progress and information.",
            icon: MessageSquare,
            component: AddTaskComment,
        },
        {
            id: "STAFF-TASK-004",
            title: "Upload Task Files",
            description:
                "Upload documents, screenshots, and other files related to assigned tasks.",
            icon: Upload,
            component: UploadTaskFiles,
        },
        {
            id: "STAFF-TASK-005",
            title: "Submit Completed Work",
            description:
                "Submit completed task work for review by the responsible team member or manager.",
            icon: CheckCircle2,
            component: SubmitCompletedWork,
        },
    ];

    const openUseCase = (useCase) => {
        setSelectedUseCase(useCase);
    };

    const closeModal = () => {
        setSelectedUseCase(null);
    };

    return (
        <div className="min-h-screen bg-slate-950 p-6 text-white">
            {/* ========================================================
                HEADER
            ======================================================== */}

            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-blue-600/20 p-3">
                            <ClipboardList className="h-7 w-7 text-blue-400" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold">
                                Task Management
                            </h1>

                            <p className="mt-1 text-sm text-slate-400">
                                Manage and monitor your assigned tasks.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-4 py-2">
                    <RefreshCw className="h-4 w-4 text-blue-400" />

                    <span className="text-sm text-slate-300">
                        Staff Task Management
                    </span>
                </div>
            </div>

            {/* ========================================================
                USE CASE INFORMATION
            ======================================================== */}

            <div className="mb-6">
                <p className="text-sm text-slate-400">
                    Select a task management function below.
                </p>
            </div>

            {/* ========================================================
                USE CASE CARDS
            ======================================================== */}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {useCases.map((useCase) => {
                    const Icon = useCase.icon;

                    return (
                        <div
                            key={useCase.id}
                            className="group rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg transition hover:border-blue-600/50 hover:bg-slate-900/80"
                        >
                            {/* ICON */}
                            <div className="mb-5 flex items-start justify-between">
                                <div className="rounded-xl bg-blue-600/10 p-3">
                                    <Icon className="h-6 w-6 text-blue-400" />
                                </div>

                                <span className="rounded-full border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs font-medium text-slate-400">
                                    {useCase.id}
                                </span>
                            </div>

                            {/* TITLE */}
                            <h2 className="mb-2 text-lg font-semibold text-white">
                                {useCase.title}
                            </h2>

                            {/* DESCRIPTION */}
                            <p className="mb-6 min-h-[72px] text-sm leading-6 text-slate-400">
                                {useCase.description}
                            </p>

                            {/* BUTTON */}
                            <button
                                type="button"
                                onClick={() => openUseCase(useCase)}
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                            >
                                <Eye className="h-4 w-4" />
                                Open
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* ========================================================
                MODAL
            ======================================================== */}

            {selectedUseCase && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
                    <div className="flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl">
                        {/* MODAL HEADER */}
                        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-5 py-4">
                            <div>
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-blue-600/10 p-2">
                                        {(() => {
                                            const Icon = selectedUseCase.icon;

                                            return (
                                                <Icon className="h-5 w-5 text-blue-400" />
                                            );
                                        })()}
                                    </div>

                                    <div>
                                        <h2 className="font-semibold text-white">
                                            {selectedUseCase.title}
                                        </h2>

                                        <p className="text-xs text-slate-500">
                                            {selectedUseCase.id}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={closeModal}
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                                aria-label="Close"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* MODAL CONTENT */}
                        <div className="overflow-y-auto">
                            <selectedUseCase.component />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TaskManagement;
