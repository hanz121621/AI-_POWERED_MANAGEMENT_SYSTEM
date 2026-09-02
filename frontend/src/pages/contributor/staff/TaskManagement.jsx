
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

import ViewAssignedTasks
    from "@/components/contributor/staff/task-management/ViewAssignedTasks";

import UpdateTaskStatus
    from "@/components/contributor/staff/task-management/UpdateTaskStatus";

import AddTaskComment
    from "@/components/contributor/staff/task-management/AddTaskComment";

import UploadTaskFiles
    from "@/components/contributor/staff/task-management/UploadTaskFiles";

import SubmitCompletedWork
    from "@/components/contributor/staff/task-management/SubmitCompletedWork";

// ============================================================
// STAFF TASK MANAGEMENT
// ============================================================

function TaskManagement() {
    const [selectedUseCase, setSelectedUseCase] = useState(null);

    // ============================================================
    // USE CASES
    // ============================================================

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

    // ============================================================
    // OPEN USE CASE
    // ============================================================

    const openUseCase = (useCase) => {
        setSelectedUseCase(useCase);
    };

    // ============================================================
    // CLOSE MODAL
    // ============================================================

    const closeModal = () => {
        setSelectedUseCase(null);
    };

    // ============================================================
    // DYNAMIC COMPONENT
    // ============================================================

    const SelectedComponent = selectedUseCase?.component;

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <div className="w-full">
            <div className="mx-auto max-w-7xl">

                {/* ====================================================
                    HEADER
                ==================================================== */}

                <div
                    className="
                        mb-8 flex flex-col gap-4
                        md:flex-row md:items-center
                        md:justify-between
                    "
                >
                    <div>
                        <div className="flex items-center gap-4">

                            {/* Page Icon */}

                            <div
                                className="
                                    flex h-14 w-14 shrink-0
                                    items-center justify-center
                                    rounded-2xl
                                    bg-primary/10
                                    ring-1 ring-primary/20
                                "
                            >
                                <ClipboardList
                                    className="h-7 w-7 text-primary"
                                />
                            </div>

                            {/* Page Title */}

                            <div>
                                <h1
                                    className="
                                        text-2xl font-bold tracking-tight
                                        text-foreground
                                        sm:text-3xl
                                    "
                                >
                                    Task Management
                                </h1>

                                <p
                                    className="
                                        mt-1 text-sm
                                        text-muted-foreground
                                        sm:text-base
                                    "
                                >
                                    Manage and monitor your assigned tasks.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Staff Task Management Badge */}

                    <div
                        className="
                            flex items-center gap-2
                            rounded-xl
                            border border-border
                            bg-card
                            px-4 py-2.5
                            shadow-sm
                        "
                    >
                        <RefreshCw
                            className="h-4 w-4 text-primary"
                        />

                        <span
                            className="
                                text-sm font-medium
                                text-card-foreground
                            "
                        >
                            Staff Task Management
                        </span>
                    </div>
                </div>

                {/* ====================================================
                    USE CASE INFORMATION
                ==================================================== */}

                <div className="mb-6">
                    <p
                        className="
                            text-sm
                            text-muted-foreground
                        "
                    >
                        Select a task management function below.
                    </p>
                </div>

                {/* ====================================================
                    USE CASE CARDS
                ==================================================== */}

                <div
                    className="
                        grid grid-cols-1 gap-5
                        md:grid-cols-2
                        xl:grid-cols-3
                    "
                >
                    {useCases.map((useCase) => {
                        const Icon = useCase.icon;

                        return (
                            <div
                                key={useCase.id}
                                className="
                                    group rounded-2xl
                                    border border-border
                                    bg-card
                                    p-5
                                    shadow-sm
                                    transition-all duration-200
                                    hover:-translate-y-1
                                    hover:border-primary/40
                                    hover:shadow-md
                                "
                            >
                                {/* ==================================================
                                    ICON + USE CASE ID
                                ================================================== */}

                                <div
                                    className="
                                        mb-5 flex items-start
                                        justify-between gap-4
                                    "
                                >
                                    {/* Icon */}

                                    <div
                                        className="
                                            flex h-12 w-12
                                            items-center
                                            justify-center
                                            rounded-xl
                                            bg-primary/10
                                            ring-1 ring-primary/20
                                        "
                                    >
                                        <Icon
                                            className="h-6 w-6 text-primary"
                                        />
                                    </div>

                                    {/* ID */}

                                    <span
                                        className="
                                            rounded-full
                                            border border-border
                                            bg-muted
                                            px-2.5 py-1
                                            text-xs font-medium
                                            text-muted-foreground
                                        "
                                    >
                                        {useCase.id}
                                    </span>
                                </div>

                                {/* ==================================================
                                    TITLE
                                ================================================== */}

                                <h2
                                    className="
                                        mb-2 text-lg font-semibold
                                        text-card-foreground
                                        transition
                                        group-hover:text-primary
                                    "
                                >
                                    {useCase.title}
                                </h2>

                                {/* ==================================================
                                    DESCRIPTION
                                ================================================== */}

                                <p
                                    className="
                                        mb-6 min-h-[72px]
                                        text-sm leading-6
                                        text-muted-foreground
                                    "
                                >
                                    {useCase.description}
                                </p>

                                {/* ==================================================
                                    OPEN BUTTON
                                ================================================== */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        openUseCase(useCase)
                                    }
                                    className="
                                        flex w-full
                                        items-center
                                        justify-center gap-2
                                        rounded-xl
                                        bg-primary
                                        px-4 py-2.5
                                        text-sm font-medium
                                        text-primary-foreground
                                        transition
                                        hover:opacity-90
                                        focus:outline-none
                                        focus:ring-2
                                        focus:ring-primary/40
                                    "
                                >
                                    <Eye className="h-4 w-4" />

                                    <span>
                                        Open
                                    </span>
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ====================================================
                MODAL
            ==================================================== */}

            {selectedUseCase && SelectedComponent && (
                <div
                    className="
                        fixed inset-0 z-50
                        flex items-center justify-center
                        bg-black/50
                        p-4
                        backdrop-blur-sm
                    "
                    onMouseDown={closeModal}
                >
                    <div
                        className="
                            flex max-h-[90vh]
                            w-full max-w-6xl
                            flex-col overflow-hidden
                            rounded-2xl
                            border border-border
                            bg-background
                            shadow-2xl
                        "
                        onMouseDown={(event) =>
                            event.stopPropagation()
                        }
                    >

                        {/* ====================================================
                            MODAL HEADER
                        ==================================================== */}

                        <div
                            className="
                                flex items-center
                                justify-between
                                border-b border-border
                                bg-card
                                px-5 py-4
                                sm:px-6
                            "
                        >
                            <div
                                className="
                                    flex min-w-0
                                    items-center gap-3
                                "
                            >

                                {/* Selected Use Case Icon */}

                                <div
                                    className="
                                        flex h-10 w-10
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-primary/10
                                    "
                                >
                                    {(() => {
                                        const Icon =
                                            selectedUseCase.icon;

                                        return (
                                            <Icon
                                                className="
                                                    h-5 w-5
                                                    text-primary
                                                "
                                            />
                                        );
                                    })()}
                                </div>

                                {/* Modal Title */}

                                <div className="min-w-0">
                                    <h2
                                        className="
                                            truncate
                                            font-semibold
                                            text-foreground
                                        "
                                    >
                                        {selectedUseCase.title}
                                    </h2>

                                    <p
                                        className="
                                            text-xs
                                            text-muted-foreground
                                        "
                                    >
                                        {selectedUseCase.id}
                                    </p>
                                </div>
                            </div>

                            {/* Close Button */}

                            <button
                                type="button"
                                onClick={closeModal}
                                className="
                                    ml-4 flex h-9 w-9
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-lg
                                    text-muted-foreground
                                    transition
                                    hover:bg-muted
                                    hover:text-foreground
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-primary/40
                                "
                                aria-label="Close"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* ====================================================
                            MODAL CONTENT
                        ==================================================== */}

                        <div
                            className="
                                overflow-y-auto
                                bg-background
                            "
                        >
                            <SelectedComponent />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ============================================================
// EXPORT
// ============================================================

export default TaskManagement;
