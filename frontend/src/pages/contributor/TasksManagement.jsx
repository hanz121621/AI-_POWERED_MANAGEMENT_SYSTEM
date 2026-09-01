import { useState } from "react";

import {
    Activity,
    CheckCircle2,
    ClipboardList,
    Clock3,
    FileText,
    History,
    MessageSquare,
    Paperclip,
    Play,
    Search,
    Send,
    ShieldAlert,
    
    UserRound,
    X,
} from "lucide-react";

// ============================================================
// TASK MANAGEMENT COMPONENTS
// ============================================================

import ViewAssignedTasks from "@/components/contributor/task-management/ViewAssignedTasks";
import UpdateTaskStatus from "@/components/contributor/task-management/UpdateTaskStatus";
import UpdateTaskProgress from "@/components/contributor/task-management/UpdateTaskProgress";
import AddTaskComment from "@/components/contributor/task-management/AddTaskComment";
import UploadTaskAttachment from "@/components/contributor/task-management/UploadTaskAttachment";
import ReportTaskIssue from "@/components/contributor/task-management/ReportTaskIssue";
import SubmitTaskForReview from "@/components/contributor/task-management/SubmitTaskForReview";
import RespondReviewFeedback from "@/components/contributor/task-management/RespondReviewFeedback";
import ViewTaskHistory from "@/components/contributor/task-management/ViewTaskHistory";



const TASK_MODULES = [
    {
        id: "CONT-TASK-001",
        title: "View Assigned Tasks",
        description:
            "View tasks assigned to the logged-in contributor.",
        icon: ClipboardList,
        component: ViewAssignedTasks,
    },

    {
        id: "CONT-TASK-002",
        title: "Start Task",
        description:
            "Start an assigned task and move it into In Progress.",
        icon: Play,
        component: UpdateTaskStatus,
    },

    {
        id: "CONT-TASK-003",
        title: "Update Task Progress",
        description:
            "Keep the progress of an active task up to date.",
        icon: Activity,
        component: UpdateTaskProgress,
    },

    {
        id: "CONT-TASK-004",
        title: "Update Task Status",
        description:
            "Change the status of an assigned task according to the allowed workflow.",
        icon: CheckCircle2,
        component: UpdateTaskStatus,
    },

    {
        id: "CONT-TASK-005",
        title: "Add Task Comment",
        description:
            "Communicate task-related information with the project team.",
        icon: MessageSquare,
        component: AddTaskComment,
    },

    {
        id: "CONT-TASK-006",
        title: "Upload Task Attachment",
        description:
            "Upload work-related files and associate them with a task.",
        icon: Paperclip,
        component: UploadTaskAttachment,
    },

    {
        id: "CONT-TASK-007",
        title: "Report Blocked Task",
        description:
            "Report a blocker that prevents the contributor from continuing work.",
        icon: ShieldAlert,
        component: ReportTaskIssue,
    },

    {
        id: "CONT-TASK-008",
        title: "Submit Task for Review",
        description:
            "Submit completed work to the Manager or authorized reviewer.",
        icon: Send,
        component: SubmitTaskForReview,
    },

    {
        id: "CONT-TASK-009",
        title: "Respond to Review Feedback",
        description:
            "Address requested changes and respond to reviewer feedback.",
        icon: FileText,
        component: RespondReviewFeedback,
    },

    {
        id: "CONT-TASK-010",
        title: "View Task History",
        description:
            "Review status changes, progress updates, comments, attachments, submissions, and feedback.",
        icon: History,
        component: ViewTaskHistory,
    },
];

// ============================================================
// CURRENT CONTRIBUTOR
// ============================================================

const CURRENT_CONTRIBUTOR = {
    id: "USER-003",
    name: "Hana Nigussie",
    role: "Contributor",
};

// ============================================================
// MAIN PAGE
// ============================================================

export default function TasksManagement() {
    const [activeModule, setActiveModule] = useState(
        "CONT-TASK-001"
    );

    const [search, setSearch] = useState("");

    const [showSidebar, setShowSidebar] = useState(true);

    // ========================================================
    // FILTER MODULES
    // ========================================================

    const filteredModules = TASK_MODULES.filter(
        (module) => {
            const value = search
                .trim()
                .toLowerCase();

            if (!value) {
                return true;
            }

            return (
                module.id
                    .toLowerCase()
                    .includes(value) ||
                module.title
                    .toLowerCase()
                    .includes(value) ||
                module.description
                    .toLowerCase()
                    .includes(value)
            );
        }
    );

    // ========================================================
    // ACTIVE MODULE
    // ========================================================

    const selectedModule =
        TASK_MODULES.find(
            (module) =>
                module.id === activeModule
        ) || TASK_MODULES[0];

    const ActiveComponent =
        selectedModule.component;

    // ========================================================
    // SELECT MODULE
    // ========================================================

    const handleSelectModule = (moduleId) => {
        setActiveModule(moduleId);
    };

    // ========================================================
    // CLOSE SIDEBAR
    // ========================================================

    const handleCloseSidebar = () => {
        setShowSidebar(false);
    };

    // ========================================================
    // OPEN SIDEBAR
    // ========================================================

    const handleOpenSidebar = () => {
        setShowSidebar(true);
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="min-h-screen bg-slate-50">

            {/* ==================================================
                PAGE HEADER
            ================================================== */}

            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8">

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                        {/* TITLE */}

                        <div className="flex items-center gap-4">

                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                                <ClipboardList size={25} />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">
                                    Task Management
                                </h1>

                                <p className="mt-1 text-sm text-slate-500">
                                    Manage and participate in your assigned tasks.
                                </p>
                            </div>

                        </div>

                        {/* CONTRIBUTOR */}

                        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                                <UserRound size={19} />
                            </div>

                            <div>
                                <p className="text-xs text-slate-400">
                                    Logged in as
                                </p>

                                <p className="text-sm font-semibold text-slate-800">
                                    {CURRENT_CONTRIBUTOR.name}
                                </p>

                                <p className="text-xs text-blue-600">
                                    {CURRENT_CONTRIBUTOR.role}
                                </p>
                            </div>

                        </div>

                    </div>

                </div>
            </header>

            {/* ==================================================
                MAIN CONTENT
            ================================================== */}

            <div className="mx-auto flex max-w-[1600px]">

                {/* ==================================================
                    LEFT SIDEBAR
                ================================================== */}

                {showSidebar && (
                    <aside className="w-full shrink-0 border-r border-slate-200 bg-white lg:w-80">

                        {/* SIDEBAR HEADER */}

                        <div className="border-b border-slate-200 p-5">

                            <div className="mb-4 flex items-center justify-between">

                                <div>
                                    <h2 className="font-bold text-slate-900">
                                        Task Actions
                                    </h2>

                                    <p className="mt-1 text-xs text-slate-500">
                                        Contributor permissions
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={
                                        handleCloseSidebar
                                    }
                                    className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 lg:hidden"
                                    aria-label="Close task actions"
                                >
                                    <X size={18} />
                                </button>

                            </div>

                            {/* SEARCH */}

                            <div className="relative">

                                <Search
                                    size={17}
                                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Search task actions..."
                                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                                />

                            </div>

                        </div>

                        {/* MODULE LIST */}

                        <div className="max-h-[calc(100vh-230px)] overflow-y-auto p-3">

                            {filteredModules.length === 0 ? (
                                <div className="px-4 py-8 text-center">

                                    <Search
                                        size={25}
                                        className="mx-auto text-slate-300"
                                    />

                                    <p className="mt-3 text-sm font-medium text-slate-600">
                                        No actions found
                                    </p>

                                    <p className="mt-1 text-xs text-slate-400">
                                        Try another search.
                                    </p>

                                </div>
                            ) : (
                                <div className="space-y-1.5">

                                    {filteredModules.map(
                                        (module) => {
                                            const Icon =
                                                module.icon;

                                            const isActive =
                                                activeModule ===
                                                module.id;

                                            return (
                                                <button
                                                    key={
                                                        module.id
                                                    }
                                                    type="button"
                                                    onClick={() =>
                                                        handleSelectModule(
                                                            module.id
                                                        )
                                                    }
                                                    className={`group w-full rounded-xl p-3 text-left transition ${
                                                        isActive
                                                            ? "bg-blue-50 text-blue-700 ring-1 ring-blue-100"
                                                            : "text-slate-700 hover:bg-slate-50"
                                                    }`}
                                                >

                                                    <div className="flex items-start gap-3">

                                                        <div
                                                            className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                                                                isActive
                                                                    ? "bg-blue-100 text-blue-700"
                                                                    : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                                                            }`}
                                                        >
                                                            <Icon
                                                                size={
                                                                    17
                                                                }
                                                            />
                                                        </div>

                                                        <div className="min-w-0 flex-1">

                                                            <div className="flex items-center justify-between gap-2">

                                                                <p
                                                                    className={`truncate text-sm font-semibold ${
                                                                        isActive
                                                                            ? "text-blue-800"
                                                                            : "text-slate-800"
                                                                    }`}
                                                                >
                                                                    {
                                                                        module.title
                                                                    }
                                                                </p>

                                                                {isActive && (
                                                                    <CheckCircle2
                                                                        size={
                                                                            15
                                                                        }
                                                                        className="shrink-0 text-blue-600"
                                                                    />
                                                                )}

                                                            </div>

                                                            <p className="mt-1 text-[11px] font-medium text-slate-400">
                                                                {
                                                                    module.id
                                                                }
                                                            </p>

                                                        </div>

                                                    </div>

                                                </button>
                                            );
                                        }
                                    )}

                                </div>
                            )}

                        </div>

                    </aside>
                )}

                {/* ==================================================
                    RIGHT CONTENT
                ================================================== */}

                <main className="min-w-0 flex-1">

                    {/* CONTENT TOOLBAR */}

                    <div className="border-b border-slate-200 bg-white">

                        <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">

                            <div className="flex min-w-0 items-center gap-3">

                                {!showSidebar && (
                                    <button
                                        type="button"
                                        onClick={
                                            handleOpenSidebar
                                        }
                                        className="flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                                    >
                                        <ClipboardList
                                            size={17}
                                        />

                                        Actions
                                    </button>
                                )}

                                <div className="min-w-0">

                                    <p className="text-xs font-semibold text-blue-600">
                                        {
                                            selectedModule.id
                                        }
                                    </p>

                                    <h2 className="truncate text-lg font-bold text-slate-900">
                                        {
                                            selectedModule.title
                                        }
                                    </h2>

                                </div>

                            </div>

                            <div className="hidden items-center gap-2 text-xs text-slate-400 sm:flex">

                                <Clock3 size={15} />

                                <span>
                                    Contributor Task Management
                                </span>

                            </div>

                        </div>

                    </div>

                    {/* ==================================================
                        ACTIVE COMPONENT
                    ================================================== */}

                    <section className="min-w-0">

                        <ActiveComponent />

                    </section>

                </main>

            </div>

        </div>
    );
}