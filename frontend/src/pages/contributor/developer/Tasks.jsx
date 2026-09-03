import { useState } from "react";

import {
    ListChecks,
    ClipboardList,
    Activity,
    MessageSquare,
    Upload,
    CheckCircle2,
    Bot,
    Sparkles,
} from "lucide-react";

import ViewAssignedTasks from "@/components/contributor/developer/task-management/ViewAssignedTasks";
import UpdateTaskStatus from "@/components/contributor/developer/task-management/UpdateTaskStatus";
import AddTaskComment from "@/components/contributor/developer/task-management/AddTaskComment";
import UploadTaskFiles from "@/components/contributor/developer/task-management/UploadTaskFiles";
import SubmitCompletedWork from "@/components/contributor/developer/task-management/SubmitCompletedWork";
import ViewAISubtasks from "@/components/contributor/developer/task-management/ViewAISubtasks";

export default function Tasks() {
    // =========================================================
    // SELECTED TASK
    // =========================================================
    // The selected task is owned by this parent so that all
    // task-management components can work with the same task.
    const [selectedTask, setSelectedTask] = useState(null);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#071a33]">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

                {/* =====================================================
                    PAGE HEADER
                ===================================================== */}
                <header className="mb-8">

                    <div
                        className="
                            flex
                            flex-col
                            gap-4
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                        "
                    >

                        <div className="flex items-center gap-4">

                            {/* HEADER ICON */}

                            <div
                                className="
                                    flex
                                    h-12
                                    w-12
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-emerald-100
                                    dark:bg-emerald-950/50
                                "
                            >
                                <ListChecks
                                    className="
                                        h-6
                                        w-6
                                        text-emerald-600
                                        dark:text-emerald-400
                                    "
                                />
                            </div>

                            {/* TITLE */}

                            <div>

                                <div className="flex items-center gap-2">

                                    <h1
                                        className="
                                            text-2xl
                                            font-bold
                                            tracking-tight
                                            text-slate-900
                                            dark:text-white
                                        "
                                    >
                                        Task Management
                                    </h1>

                                    <span
                                        className="
                                            hidden
                                            rounded-full
                                            bg-emerald-100
                                            px-2.5
                                            py-1
                                            text-[10px]
                                            font-bold
                                            uppercase
                                            tracking-wide
                                            text-emerald-700
                                            sm:inline-flex
                                            dark:bg-emerald-950/60
                                            dark:text-emerald-300
                                        "
                                    >
                                        Developer
                                    </span>

                                </div>

                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        text-slate-500
                                        dark:text-slate-400
                                    "
                                >
                                    Manage your assigned development tasks,
                                    progress, comments, files, and completed work.
                                </p>

                            </div>

                        </div>

                    </div>

                </header>


                {/* =====================================================
                    INFORMATION BANNER
                ===================================================== */}
                <section
                    className="
                        mb-8
                        rounded-2xl
                        border
                        border-emerald-200
                        bg-emerald-50
                        p-5
                        dark:border-emerald-900/60
                        dark:bg-emerald-950/20
                    "
                >

                    <div className="flex items-start gap-3">

                        <div
                            className="
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                bg-emerald-100
                                dark:bg-emerald-950/60
                            "
                        >
                            <Activity
                                className="
                                    h-4
                                    w-4
                                    text-emerald-600
                                    dark:text-emerald-400
                                "
                            />
                        </div>

                        <div>

                            <h2
                                className="
                                    text-sm
                                    font-bold
                                    text-emerald-900
                                    dark:text-emerald-300
                                "
                            >
                                Development Task Workspace
                            </h2>

                            <p
                                className="
                                    mt-1
                                    text-xs
                                    leading-5
                                    text-emerald-800
                                    dark:text-emerald-400
                                "
                            >
                                View your assigned tasks and keep task progress,
                                status, comments, files, and completed work
                                up to date.
                            </p>

                        </div>

                    </div>

                </section>


                {/* =====================================================
                    ASSIGNED TASKS
                ===================================================== */}
                <section className="mb-8">

                    {/* SECTION HEADER */}

                    <div className="mb-5">

                        <div className="flex items-center gap-3">

                            <div
                                className="
                                    flex
                                    h-9
                                    w-9
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-blue-100
                                    dark:bg-blue-950/50
                                "
                            >
                                <ClipboardList
                                    className="
                                        h-4
                                        w-4
                                        text-blue-600
                                        dark:text-blue-400
                                    "
                                />
                            </div>

                            <div>

                                <h2
                                    className="
                                        text-lg
                                        font-bold
                                        text-slate-900
                                        sm:text-xl
                                        dark:text-white
                                    "
                                >
                                    Assigned Tasks
                                </h2>

                                <p
                                    className="
                                        mt-1
                                        text-xs
                                        text-slate-500
                                        sm:text-sm
                                        dark:text-slate-400
                                    "
                                >
                                    View and manage tasks assigned to you.
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* TASK LIST CARD */}

                    <div
                        className="
                            overflow-hidden
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            shadow-sm
                            dark:border-blue-900/60
                            dark:bg-[#0b2344]
                        "
                    >

                        <div
                            className="
                                border-b
                                border-slate-200
                                px-5
                                py-4
                                dark:border-blue-900/60
                            "
                        >

                            <div className="flex items-center gap-3">

                                <div
                                    className="
                                        rounded-lg
                                        bg-blue-100
                                        p-2
                                        dark:bg-blue-950/50
                                    "
                                >
                                    <ListChecks
                                        className="
                                            h-5
                                            w-5
                                            text-blue-600
                                            dark:text-blue-400
                                        "
                                    />
                                </div>

                                <div>

                                    <h3
                                        className="
                                            text-base
                                            font-semibold
                                            text-slate-900
                                            dark:text-white
                                        "
                                    >
                                        My Assigned Tasks
                                    </h3>

                                    <p
                                        className="
                                            text-xs
                                            text-slate-500
                                            dark:text-slate-400
                                        "
                                    >
                                        Tasks currently assigned to you.
                                    </p>

                                </div>

                            </div>

                        </div>

                        <div className="p-5">
                            <ViewAssignedTasks
                                selectedTask={selectedTask}
                                onSelectTask={setSelectedTask}
                            />
                        </div>

                    </div>

                </section>


                <section className="mb-8">
    <div className="mb-5">
        <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-950/50">
                <Bot className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>

            <div>
                <h2 className="text-lg font-bold text-slate-900 sm:text-xl dark:text-white">
                    AI-Generated Subtasks
                </h2>

                <p className="mt-1 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
                    View AI-generated subtasks for your selected parent task.
                </p>
            </div>
        </div>
    </div>

    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-blue-900/60 dark:bg-[#0b2344]">

        <div className="border-b border-slate-200 px-5 py-4 dark:border-blue-900/60">
            <div className="flex items-center gap-3">

                <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-950/50">
                    <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>

                <div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                        AI Task Breakdown
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        AI-generated subtasks associated with the selected task.
                    </p>
                </div>

            </div>
        </div>

        <div className="p-5">
            <ViewAISubtasks task={selectedTask} />
        </div>

    </div>
</section>


                {/* =====================================================
                    TASK PROGRESS & COMMUNICATION
                ===================================================== */}
                <section className="mb-8">

                    {/* SECTION HEADER */}

                    <div className="mb-5">

                        <div className="flex items-center gap-3">

                            <div
                                className="
                                    flex
                                    h-9
                                    w-9
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-purple-100
                                    dark:bg-purple-950/50
                                "
                            >
                                <Activity
                                    className="
                                        h-4
                                        w-4
                                        text-purple-600
                                        dark:text-purple-400
                                    "
                                />
                            </div>

                            <div>

                                <h2
                                    className="
                                        text-lg
                                        font-bold
                                        text-slate-900
                                        sm:text-xl
                                        dark:text-white
                                    "
                                >
                                    Task Progress & Communication
                                </h2>

                                <p
                                    className="
                                        mt-1
                                        text-xs
                                        text-slate-500
                                        sm:text-sm
                                        dark:text-slate-400
                                    "
                                >
                                    Update task progress and communicate
                                    important information.
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* TWO COLUMN GRID */}

                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-6
                            lg:grid-cols-2
                        "
                    >

                        {/* UPDATE STATUS */}

                        <section
                            className="
                                overflow-hidden
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                shadow-sm
                                dark:border-blue-900/60
                                dark:bg-[#0b2344]
                            "
                        >

                            <div
                                className="
                                    border-b
                                    border-slate-200
                                    px-5
                                    py-4
                                    dark:border-blue-900/60
                                "
                            >

                                <div className="flex items-center gap-3">

                                    <div
                                        className="
                                            rounded-lg
                                            bg-yellow-100
                                            p-2
                                            dark:bg-yellow-950/50
                                        "
                                    >
                                        <Activity
                                            className="
                                                h-5
                                                w-5
                                                text-yellow-600
                                                dark:text-yellow-400
                                            "
                                        />
                                    </div>

                                    <div>

                                        <h3
                                            className="
                                                text-base
                                                font-semibold
                                                text-slate-900
                                                dark:text-white
                                            "
                                        >
                                            Update Task Status
                                        </h3>

                                        <p
                                            className="
                                                text-xs
                                                text-slate-500
                                                dark:text-slate-400
                                            "
                                        >
                                            Keep the current task status updated.
                                        </p>

                                    </div>

                                </div>

                            </div>

                            <div className="p-5">
                                <UpdateTaskStatus
                                    task={selectedTask}
                                />
                            </div>

                        </section>


                        {/* ADD COMMENT */}

                        <section
                            className="
                                overflow-hidden
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                shadow-sm
                                dark:border-blue-900/60
                                dark:bg-[#0b2344]
                            "
                        >

                            <div
                                className="
                                    border-b
                                    border-slate-200
                                    px-5
                                    py-4
                                    dark:border-blue-900/60
                                "
                            >

                                <div className="flex items-center gap-3">

                                    <div
                                        className="
                                            rounded-lg
                                            bg-indigo-100
                                            p-2
                                            dark:bg-indigo-950/50
                                        "
                                    >
                                        <MessageSquare
                                            className="
                                                h-5
                                                w-5
                                                text-indigo-600
                                                dark:text-indigo-400
                                            "
                                        />
                                    </div>

                                    <div>

                                        <h3
                                            className="
                                                text-base
                                                font-semibold
                                                text-slate-900
                                                dark:text-white
                                            "
                                        >
                                            Add Task Comment
                                        </h3>

                                        <p
                                            className="
                                                text-xs
                                                text-slate-500
                                                dark:text-slate-400
                                            "
                                        >
                                            Communicate updates and task notes.
                                        </p>

                                    </div>

                                </div>

                            </div>

                            <div className="p-5">
                                <AddTaskComment
                                    task={selectedTask}
                                />
                            </div>

                        </section>

                    </div>

                </section>


                {/* =====================================================
                    FILES & COMPLETION
                ===================================================== */}
                <section className="mb-8">

                    {/* SECTION HEADER */}

                    <div className="mb-5">

                        <div className="flex items-center gap-3">

                            <div
                                className="
                                    flex
                                    h-9
                                    w-9
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-orange-100
                                    dark:bg-orange-950/50
                                "
                            >
                                <Upload
                                    className="
                                        h-4
                                        w-4
                                        text-orange-600
                                        dark:text-orange-400
                                    "
                                />
                            </div>

                            <div>

                                <h2
                                    className="
                                        text-lg
                                        font-bold
                                        text-slate-900
                                        sm:text-xl
                                        dark:text-white
                                    "
                                >
                                    Task Files & Completion
                                </h2>

                                <p
                                    className="
                                        mt-1
                                        text-xs
                                        text-slate-500
                                        sm:text-sm
                                        dark:text-slate-400
                                    "
                                >
                                    Upload supporting files and submit
                                    completed development work.
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* TWO COLUMN GRID */}

                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-6
                            lg:grid-cols-2
                        "
                    >

                        {/* UPLOAD FILES */}

                        <section
                            className="
                                overflow-hidden
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                shadow-sm
                                dark:border-blue-900/60
                                dark:bg-[#0b2344]
                            "
                        >

                            <div
                                className="
                                    border-b
                                    border-slate-200
                                    px-5
                                    py-4
                                    dark:border-blue-900/60
                                "
                            >

                                <div className="flex items-center gap-3">

                                    <div
                                        className="
                                            rounded-lg
                                            bg-orange-100
                                            p-2
                                            dark:bg-orange-950/50
                                        "
                                    >
                                        <Upload
                                            className="
                                                h-5
                                                w-5
                                                text-orange-600
                                                dark:text-orange-400
                                            "
                                        />
                                    </div>

                                    <div>

                                        <h3
                                            className="
                                                text-base
                                                font-semibold
                                                text-slate-900
                                                dark:text-white
                                            "
                                        >
                                            Upload Task Files
                                        </h3>

                                        <p
                                            className="
                                                text-xs
                                                text-slate-500
                                                dark:text-slate-400
                                            "
                                        >
                                            Attach files related to your task.
                                        </p>

                                    </div>

                                </div>

                            </div>

                            <div className="p-5">
                                <UploadTaskFiles
                                    task={selectedTask}
                                />
                            </div>

                        </section>


                        {/* SUBMIT COMPLETED WORK */}

                        <section
                            className="
                                overflow-hidden
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                shadow-sm
                                dark:border-blue-900/60
                                dark:bg-[#0b2344]
                            "
                        >

                            <div
                                className="
                                    border-b
                                    border-slate-200
                                    px-5
                                    py-4
                                    dark:border-blue-900/60
                                "
                            >

                                <div className="flex items-center gap-3">

                                    <div
                                        className="
                                            rounded-lg
                                            bg-emerald-100
                                            p-2
                                            dark:bg-emerald-950/50
                                        "
                                    >
                                        <CheckCircle2
                                            className="
                                                h-5
                                                w-5
                                                text-emerald-600
                                                dark:text-emerald-400
                                            "
                                        />
                                    </div>

                                    <div>

                                        <h3
                                            className="
                                                text-base
                                                font-semibold
                                                text-slate-900
                                                dark:text-white
                                            "
                                        >
                                            Submit Completed Work
                                        </h3>

                                        <p
                                            className="
                                                text-xs
                                                text-slate-500
                                                dark:text-slate-400
                                            "
                                        >
                                            Submit your finished development work.
                                        </p>

                                    </div>

                                </div>

                            </div>

                            <div className="p-5">
                                <SubmitCompletedWork
                                    task={selectedTask}
                                />
                            </div>

                        </section>

                    </div>

                </section>


                {/* =====================================================
                    FOOTER INFORMATION
                ===================================================== */}
                <div
                    className="
                        mt-8
                        flex
                        items-start
                        gap-3
                        rounded-xl
                        border
                        border-emerald-100
                        bg-emerald-50
                        p-4
                        dark:border-emerald-900/50
                        dark:bg-emerald-950/20
                    "
                >

                    <Activity
                        className="
                            mt-0.5
                            h-4
                            w-4
                            shrink-0
                            text-emerald-600
                            dark:text-emerald-400
                        "
                    />

                    <p
                        className="
                            text-xs
                            leading-5
                            text-emerald-700
                            dark:text-emerald-300
                        "
                    >
                        Keep your task status, comments, files, and completed
                        work updated regularly. Accurate task information helps
                        the development team monitor progress and coordinate
                        work effectively.
                    </p>

                </div>


                {/* =====================================================
                    FOOTER
                ===================================================== */}
                <footer
                    className="
                        mt-8
                        border-t
                        border-slate-200
                        py-6
                        text-center
                        dark:border-blue-900/60
                    "
                >

                    <p
                        className="
                            text-xs
                            text-slate-500
                            dark:text-slate-400
                        "
                    >
                        Developer Task Management
                    </p>

                </footer>

            </div>
        </div>
    );
}