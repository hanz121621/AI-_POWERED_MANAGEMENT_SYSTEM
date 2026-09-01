
import {
    Timer,
    Target,
    CheckCircle2,
    ListTodo,
    CalendarDays,
    TrendingUp,
    Flag,
    ArrowRight,
    Activity,
    Clock3,
} from "lucide-react";

import ViewSprintTasks from "@/components/contributor/sprint-participation/ViewSprintTasks";
import ViewSprintProgress from "@/components/contributor/sprint-participation/ViewSprintProgress";

// ============================================================
// SPRINT PARTICIPATION
// ============================================================

export default function SprintParticipation() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#071a33]">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

                {/* ==================================================
                    PAGE HEADER
                ================================================== */}

                <header className="mb-8">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                        {/* TITLE */}

                        <div className="flex items-start gap-4">

                            <div
                                className="
                                    flex h-14 w-14 shrink-0
                                    items-center justify-center
                                    rounded-2xl
                                    bg-purple-100
                                    shadow-sm
                                    dark:bg-purple-950/50
                                "
                            >
                                <Timer
                                    className="
                                        h-7 w-7
                                        text-purple-600
                                        dark:text-purple-400
                                    "
                                />
                            </div>

                            <div>
                                <div className="mb-1 flex flex-wrap items-center gap-2">

                                    <span
                                        className="
                                            rounded-full
                                            bg-purple-100
                                            px-2.5 py-1
                                            text-[10px]
                                            font-bold
                                            uppercase
                                            tracking-wider
                                            text-purple-700
                                            dark:bg-purple-950/50
                                            dark:text-purple-300
                                        "
                                    >
                                        Developer Workspace
                                    </span>

                                    <span
                                        className="
                                            rounded-full
                                            bg-emerald-100
                                            px-2.5 py-1
                                            text-[10px]
                                            font-bold
                                            text-emerald-700
                                            dark:bg-emerald-950/40
                                            dark:text-emerald-400
                                        "
                                    >
                                        Active
                                    </span>

                                </div>

                                <h1
                                    className="
                                        text-2xl
                                        font-bold
                                        tracking-tight
                                        text-slate-900
                                        sm:text-3xl
                                        dark:text-white
                                    "
                                >
                                    Sprint Participation
                                </h1>

                                <p
                                    className="
                                        mt-1.5
                                        max-w-2xl
                                        text-sm
                                        leading-6
                                        text-slate-500
                                        dark:text-slate-400
                                    "
                                >
                                    Monitor your sprint tasks, progress,
                                    deadlines, and current sprint objectives.
                                </p>
                            </div>
                        </div>

                        {/* SPRINT STATUS */}

                        <div
                            className="
                                flex w-fit
                                items-center gap-3
                                rounded-xl
                                border
                                border-emerald-200
                                bg-white
                                px-4 py-3
                                shadow-sm
                                dark:border-emerald-900/60
                                dark:bg-[#0b2344]
                            "
                        >
                            <div
                                className="
                                    flex h-9 w-9
                                    items-center justify-center
                                    rounded-lg
                                    bg-emerald-100
                                    dark:bg-emerald-950/50
                                "
                            >
                                <Activity
                                    className="
                                        h-4.5 w-4.5
                                        text-emerald-600
                                        dark:text-emerald-400
                                    "
                                />
                            </div>

                            <div>
                                <p
                                    className="
                                        text-[10px]
                                        font-semibold
                                        uppercase
                                        tracking-wide
                                        text-slate-400
                                        dark:text-slate-500
                                    "
                                >
                                    Sprint Status
                                </p>

                                <div className="mt-0.5 flex items-center gap-2">
                                    <span
                                        className="
                                            h-2 w-2
                                            rounded-full
                                            bg-emerald-500
                                        "
                                    />

                                    <span
                                        className="
                                            text-sm
                                            font-bold
                                            text-emerald-600
                                            dark:text-emerald-400
                                        "
                                    >
                                        Sprint Active
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>
                </header>


                {/* ==================================================
                    SUMMARY CARDS
                ================================================== */}

                <section className="mb-8">

                    <div className="mb-4">
                        <h2
                            className="
                                text-base
                                font-bold
                                text-slate-900
                                dark:text-white
                            "
                        >
                            Sprint Overview
                        </h2>

                        <p
                            className="
                                mt-1
                                text-xs
                                text-slate-500
                                dark:text-slate-400
                            "
                        >
                            Quick summary of your current sprint.
                        </p>
                    </div>


                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-4
                            sm:grid-cols-2
                            xl:grid-cols-4
                        "
                    >

                        {/* TASKS */}

                        <div
                            className="
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                p-5
                                shadow-sm
                                transition
                                hover:shadow-md
                                dark:border-blue-900/60
                                dark:bg-[#0b2344]
                            "
                        >
                            <div className="flex items-start justify-between">

                                <div>
                                    <p
                                        className="
                                            text-xs
                                            font-medium
                                            text-slate-500
                                            dark:text-slate-400
                                        "
                                    >
                                        Sprint Tasks
                                    </p>

                                    <p
                                        className="
                                            mt-2
                                            text-2xl
                                            font-bold
                                            text-slate-900
                                            dark:text-white
                                        "
                                    >
                                        —
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-[11px]
                                            text-slate-400
                                            dark:text-slate-500
                                        "
                                    >
                                        Assigned to you
                                    </p>
                                </div>

                                <div
                                    className="
                                        flex h-10 w-10
                                        items-center justify-center
                                        rounded-xl
                                        bg-blue-100
                                        dark:bg-blue-950/50
                                    "
                                >
                                    <ListTodo
                                        className="
                                            h-5 w-5
                                            text-blue-600
                                            dark:text-blue-400
                                        "
                                    />
                                </div>

                            </div>
                        </div>


                        {/* COMPLETED */}

                        <div
                            className="
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                p-5
                                shadow-sm
                                transition
                                hover:shadow-md
                                dark:border-blue-900/60
                                dark:bg-[#0b2344]
                            "
                        >
                            <div className="flex items-start justify-between">

                                <div>
                                    <p
                                        className="
                                            text-xs
                                            font-medium
                                            text-slate-500
                                            dark:text-slate-400
                                        "
                                    >
                                        Completed
                                    </p>

                                    <p
                                        className="
                                            mt-2
                                            text-2xl
                                            font-bold
                                            text-slate-900
                                            dark:text-white
                                        "
                                    >
                                        —
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-[11px]
                                            text-slate-400
                                            dark:text-slate-500
                                        "
                                    >
                                        Completed tasks
                                    </p>
                                </div>

                                <div
                                    className="
                                        flex h-10 w-10
                                        items-center justify-center
                                        rounded-xl
                                        bg-emerald-100
                                        dark:bg-emerald-950/50
                                    "
                                >
                                    <CheckCircle2
                                        className="
                                            h-5 w-5
                                            text-emerald-600
                                            dark:text-emerald-400
                                        "
                                    />
                                </div>

                            </div>
                        </div>


                        {/* PROGRESS */}

                        <div
                            className="
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                p-5
                                shadow-sm
                                transition
                                hover:shadow-md
                                dark:border-blue-900/60
                                dark:bg-[#0b2344]
                            "
                        >
                            <div className="flex items-start justify-between">

                                <div>
                                    <p
                                        className="
                                            text-xs
                                            font-medium
                                            text-slate-500
                                            dark:text-slate-400
                                        "
                                    >
                                        Sprint Progress
                                    </p>

                                    <p
                                        className="
                                            mt-2
                                            text-2xl
                                            font-bold
                                            text-slate-900
                                            dark:text-white
                                        "
                                    >
                                        —
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-[11px]
                                            text-slate-400
                                            dark:text-slate-500
                                        "
                                    >
                                        Overall completion
                                    </p>
                                </div>

                                <div
                                    className="
                                        flex h-10 w-10
                                        items-center justify-center
                                        rounded-xl
                                        bg-purple-100
                                        dark:bg-purple-950/50
                                    "
                                >
                                    <TrendingUp
                                        className="
                                            h-5 w-5
                                            text-purple-600
                                            dark:text-purple-400
                                        "
                                    />
                                </div>

                            </div>
                        </div>


                        {/* DEADLINE */}

                        <div
                            className="
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                p-5
                                shadow-sm
                                transition
                                hover:shadow-md
                                dark:border-blue-900/60
                                dark:bg-[#0b2344]
                            "
                        >
                            <div className="flex items-start justify-between">

                                <div>
                                    <p
                                        className="
                                            text-xs
                                            font-medium
                                            text-slate-500
                                            dark:text-slate-400
                                        "
                                    >
                                        Sprint Deadline
                                    </p>

                                    <p
                                        className="
                                            mt-2
                                            text-2xl
                                            font-bold
                                            text-slate-900
                                            dark:text-white
                                        "
                                    >
                                        —
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-[11px]
                                            text-slate-400
                                            dark:text-slate-500
                                        "
                                    >
                                        Current sprint deadline
                                    </p>
                                </div>

                                <div
                                    className="
                                        flex h-10 w-10
                                        items-center justify-center
                                        rounded-xl
                                        bg-orange-100
                                        dark:bg-orange-950/50
                                    "
                                >
                                    <CalendarDays
                                        className="
                                            h-5 w-5
                                            text-orange-600
                                            dark:text-orange-400
                                        "
                                    />
                                </div>

                            </div>
                        </div>

                    </div>
                </section>


                {/* ==================================================
                    CURRENT SPRINT
                ================================================== */}

                <section
                    className="
                        mb-8
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

                    {/* SECTION HEADER */}

                    <div
                        className="
                            flex
                            flex-col
                            gap-3
                            border-b
                            border-slate-200
                            px-5 py-4
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                            dark:border-blue-900/60
                        "
                    >

                        <div className="flex items-center gap-3">

                            <div
                                className="
                                    flex h-10 w-10
                                    items-center justify-center
                                    rounded-xl
                                    bg-purple-100
                                    dark:bg-purple-950/50
                                "
                            >
                                <Target
                                    className="
                                        h-5 w-5
                                        text-purple-600
                                        dark:text-purple-400
                                    "
                                />
                            </div>

                            <div>
                                <h2
                                    className="
                                        text-base
                                        font-bold
                                        text-slate-900
                                        dark:text-white
                                    "
                                >
                                    Current Sprint
                                </h2>

                                <p
                                    className="
                                        mt-0.5
                                        text-xs
                                        text-slate-500
                                        dark:text-slate-400
                                    "
                                >
                                    Current sprint assignment and objectives
                                </p>
                            </div>

                        </div>

                        <span
                            className="
                                inline-flex
                                w-fit
                                items-center
                                gap-2
                                rounded-full
                                bg-emerald-50
                                px-3 py-1.5
                                text-xs
                                font-semibold
                                text-emerald-700
                                dark:bg-emerald-950/30
                                dark:text-emerald-400
                            "
                        >
                            <span
                                className="
                                    h-1.5 w-1.5
                                    rounded-full
                                    bg-emerald-500
                                "
                            />
                            In Progress
                        </span>

                    </div>


                    {/* SPRINT INFORMATION */}

                    <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-3">

                        {/* SPRINT */}

                        <div
                            className="
                                rounded-xl
                                border
                                border-slate-200
                                bg-slate-50
                                p-4
                                dark:border-blue-900/50
                                dark:bg-[#081d38]
                            "
                        >
                            <div className="flex items-start gap-3">

                                <div
                                    className="
                                        flex h-9 w-9
                                        shrink-0
                                        items-center justify-center
                                        rounded-lg
                                        bg-purple-100
                                        dark:bg-purple-950/50
                                    "
                                >
                                    <Flag
                                        className="
                                            h-4 w-4
                                            text-purple-600
                                            dark:text-purple-400
                                        "
                                    />
                                </div>

                                <div>
                                    <p
                                        className="
                                            text-[10px]
                                            font-bold
                                            uppercase
                                            tracking-wider
                                            text-slate-400
                                            dark:text-slate-500
                                        "
                                    >
                                        Sprint
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-sm
                                            font-semibold
                                            text-slate-900
                                            dark:text-white
                                        "
                                    >
                                        Current Sprint
                                    </p>
                                </div>

                            </div>
                        </div>


                        {/* DURATION */}

                        <div
                            className="
                                rounded-xl
                                border
                                border-slate-200
                                bg-slate-50
                                p-4
                                dark:border-blue-900/50
                                dark:bg-[#081d38]
                            "
                        >
                            <div className="flex items-start gap-3">

                                <div
                                    className="
                                        flex h-9 w-9
                                        shrink-0
                                        items-center justify-center
                                        rounded-lg
                                        bg-blue-100
                                        dark:bg-blue-950/50
                                    "
                                >
                                    <Clock3
                                        className="
                                            h-4 w-4
                                            text-blue-600
                                            dark:text-blue-400
                                        "
                                    />
                                </div>

                                <div>
                                    <p
                                        className="
                                            text-[10px]
                                            font-bold
                                            uppercase
                                            tracking-wider
                                            text-slate-400
                                            dark:text-slate-500
                                        "
                                    >
                                        Duration
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-sm
                                            font-semibold
                                            text-slate-900
                                            dark:text-white
                                        "
                                    >
                                        Active Sprint
                                    </p>
                                </div>

                            </div>
                        </div>


                        {/* STATUS */}

                        <div
                            className="
                                rounded-xl
                                border
                                border-slate-200
                                bg-slate-50
                                p-4
                                dark:border-blue-900/50
                                dark:bg-[#081d38]
                            "
                        >
                            <div className="flex items-start gap-3">

                                <div
                                    className="
                                        flex h-9 w-9
                                        shrink-0
                                        items-center justify-center
                                        rounded-lg
                                        bg-emerald-100
                                        dark:bg-emerald-950/50
                                    "
                                >
                                    <TrendingUp
                                        className="
                                            h-4 w-4
                                            text-emerald-600
                                            dark:text-emerald-400
                                        "
                                    />
                                </div>

                                <div>
                                    <p
                                        className="
                                            text-[10px]
                                            font-bold
                                            uppercase
                                            tracking-wider
                                            text-slate-400
                                            dark:text-slate-500
                                        "
                                    >
                                        Status
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-sm
                                            font-semibold
                                            text-emerald-600
                                            dark:text-emerald-400
                                        "
                                    >
                                        In Progress
                                    </p>
                                </div>

                            </div>
                        </div>

                    </div>
                </section>


                {/* ==================================================
                    SPRINT WORKSPACE
                ================================================== */}

                <section className="mb-8">

                    <div className="mb-4 flex items-end justify-between gap-4">

                        <div>
                            <h2
                                className="
                                    text-lg
                                    font-bold
                                    text-slate-900
                                    dark:text-white
                                "
                            >
                                Sprint Workspace
                            </h2>

                            <p
                                className="
                                    mt-1
                                    text-xs
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                Manage your assigned sprint work and monitor
                                completion progress.
                            </p>
                        </div>

                    </div>


                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-6
                            xl:grid-cols-3
                        "
                    >

                        {/* ==================================================
                            SPRINT TASKS
                        ================================================== */}

                        <section
                            className="
                                overflow-hidden
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                shadow-sm
                                xl:col-span-2
                                dark:border-blue-900/60
                                dark:bg-[#0b2344]
                            "
                        >

                            {/* HEADER */}

                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                    border-b
                                    border-slate-200
                                    px-5 py-4
                                    dark:border-blue-900/60
                                "
                            >

                                <div className="flex items-center gap-3">

                                    <div
                                        className="
                                            flex h-10 w-10
                                            items-center justify-center
                                            rounded-xl
                                            bg-blue-100
                                            dark:bg-blue-950/50
                                        "
                                    >
                                        <ListTodo
                                            className="
                                                h-5 w-5
                                                text-blue-600
                                                dark:text-blue-400
                                            "
                                        />
                                    </div>

                                    <div>
                                        <h3
                                            className="
                                                text-sm
                                                font-bold
                                                text-slate-900
                                                dark:text-white
                                            "
                                        >
                                            Sprint Tasks
                                        </h3>

                                        <p
                                            className="
                                                mt-0.5
                                                text-[11px]
                                                text-slate-500
                                                dark:text-slate-400
                                            "
                                        >
                                            Tasks assigned to you
                                        </p>
                                    </div>

                                </div>

                                <span
                                    className="
                                        hidden
                                        items-center
                                        gap-1
                                        text-[11px]
                                        font-medium
                                        text-blue-600
                                        sm:flex
                                        dark:text-blue-400
                                    "
                                >
                                    View Tasks
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </span>

                            </div>


                            {/* TASK CONTENT */}

                            <div className="p-5">
                                <ViewSprintTasks />
                            </div>

                        </section>


                        {/* ==================================================
                            SPRINT PROGRESS
                        ================================================== */}

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

                            {/* HEADER */}

                            <div
                                className="
                                    border-b
                                    border-slate-200
                                    px-5 py-4
                                    dark:border-blue-900/60
                                "
                            >

                                <div className="flex items-center gap-3">

                                    <div
                                        className="
                                            flex h-10 w-10
                                            items-center justify-center
                                            rounded-xl
                                            bg-emerald-100
                                            dark:bg-emerald-950/50
                                        "
                                    >
                                        <TrendingUp
                                            className="
                                                h-5 w-5
                                                text-emerald-600
                                                dark:text-emerald-400
                                            "
                                        />
                                    </div>

                                    <div>
                                        <h3
                                            className="
                                                text-sm
                                                font-bold
                                                text-slate-900
                                                dark:text-white
                                            "
                                        >
                                            Sprint Progress
                                        </h3>

                                        <p
                                            className="
                                                mt-0.5
                                                text-[11px]
                                                text-slate-500
                                                dark:text-slate-400
                                            "
                                        >
                                            Track sprint completion
                                        </p>
                                    </div>

                                </div>

                            </div>


                            {/* PROGRESS CONTENT */}

                            <div className="p-5">
                                <ViewSprintProgress />
                            </div>

                        </section>

                    </div>
                </section>


                {/* ==================================================
                    SPRINT GUIDANCE
                ================================================== */}

                <section
                    className="
                        rounded-2xl
                        border
                        border-blue-200
                        bg-blue-50
                        p-5
                        dark:border-blue-900/50
                        dark:bg-blue-950/20
                    "
                >

                    <div className="flex items-start gap-3">

                        <div
                            className="
                                flex h-9 w-9
                                shrink-0
                                items-center justify-center
                                rounded-lg
                                bg-blue-100
                                dark:bg-blue-950/50
                            "
                        >
                            <Timer
                                className="
                                    h-4.5 w-4.5
                                    text-blue-600
                                    dark:text-blue-400
                                "
                            />
                        </div>

                        <div>
                            <h3
                                className="
                                    text-sm
                                    font-bold
                                    text-blue-900
                                    dark:text-blue-300
                                "
                            >
                                Sprint Participation Reminder
                            </h3>

                            <p
                                className="
                                    mt-1
                                    text-xs
                                    leading-5
                                    text-blue-700
                                    dark:text-blue-400
                                "
                            >
                                Keep your sprint tasks and progress updated
                                regularly. Accurate task information helps
                                the team monitor sprint performance and
                                identify blockers early.
                            </p>
                        </div>

                    </div>

                </section>


                {/* ==================================================
                    FOOTER
                ================================================== */}

                <footer
                    className="
                        mt-8
                        border-t
                        border-slate-200
                        pt-6
                        text-center
                        dark:border-blue-900/60
                    "
                >
                    <p
                        className="
                            text-[11px]
                            text-slate-400
                            dark:text-slate-500
                        "
                    >
                        Developer Sprint Participation
                    </p>
                </footer>

            </div>
        </div>
    );
}
