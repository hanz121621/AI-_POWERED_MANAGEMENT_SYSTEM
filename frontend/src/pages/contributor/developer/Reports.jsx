
import {
    BarChart3,
    ClipboardCheck,
    Activity,
} from "lucide-react";

import ViewPersonalPerformance from "@/components/contributor/developer/reports/ViewPersonalPerformance";
import ViewTaskHistory from "@/components/contributor/developer/reports/ViewTaskHistory";

export default function Reports() {
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

                            {/* ICON */}

                            <div
                                className="
                                    flex
                                    h-12
                                    w-12
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-orange-100
                                    dark:bg-orange-950/50
                                "
                            >
                                <BarChart3
                                    className="
                                        h-6
                                        w-6
                                        text-orange-600
                                        dark:text-orange-400
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
                                        Reports & Monitoring
                                    </h1>

                                    <span
                                        className="
                                            hidden
                                            rounded-full
                                            bg-orange-100
                                            px-2.5
                                            py-1
                                            text-[10px]
                                            font-bold
                                            uppercase
                                            tracking-wide
                                            text-orange-700
                                            sm:inline-flex
                                            dark:bg-orange-950/60
                                            dark:text-orange-300
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
                                    Review your personal performance,
                                    completed work, and task history.
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
                        border-orange-200
                        bg-orange-50
                        p-5
                        dark:border-orange-900/60
                        dark:bg-orange-950/20
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
                                bg-orange-100
                                dark:bg-orange-950/60
                            "
                        >
                            <Activity
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
                                    text-sm
                                    font-bold
                                    text-orange-900
                                    dark:text-orange-300
                                "
                            >
                                Developer Performance Monitoring
                            </h2>

                            <p
                                className="
                                    mt-1
                                    text-xs
                                    leading-5
                                    text-orange-800
                                    dark:text-orange-400
                                "
                            >
                                Monitor your development performance and
                                review your historical task activity to
                                understand your progress and productivity.
                            </p>
                        </div>

                    </div>
                </section>


                {/* =====================================================
                    REPORTS SECTION
                ===================================================== */}

                <section>

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
                                <BarChart3
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
                                    Performance Reports
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
                                    View your development activity and
                                    performance information.
                                </p>
                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        PERSONAL PERFORMANCE
                    ================================================= */}

                    <section
                        className="
                            mb-6
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
                                    <BarChart3
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
                                        Personal Performance
                                    </h3>

                                    <p
                                        className="
                                            text-xs
                                            text-slate-500
                                            dark:text-slate-400
                                        "
                                    >
                                        Review your individual development
                                        performance.
                                    </p>
                                </div>

                            </div>
                        </div>

                        <div className="p-5">
                            <ViewPersonalPerformance />
                        </div>

                    </section>


                    {/* =================================================
                        TASK HISTORY
                    ================================================= */}

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
                                        bg-blue-100
                                        p-2
                                        dark:bg-blue-950/50
                                    "
                                >
                                    <ClipboardCheck
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
                                        Task History
                                    </h3>

                                    <p
                                        className="
                                            text-xs
                                            text-slate-500
                                            dark:text-slate-400
                                        "
                                    >
                                        Review your previous task activity
                                        and completed work.
                                    </p>
                                </div>

                            </div>
                        </div>

                        <div className="p-5">
                            <ViewTaskHistory />
                        </div>

                    </section>

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
                        border-orange-100
                        bg-orange-50
                        p-4
                        dark:border-orange-900/50
                        dark:bg-orange-950/20
                    "
                >

                    <Activity
                        className="
                            mt-0.5
                            h-4
                            w-4
                            shrink-0
                            text-orange-600
                            dark:text-orange-400
                        "
                    />

                    <p
                        className="
                            text-xs
                            leading-5
                            text-orange-700
                            dark:text-orange-300
                        "
                    >
                        Keep your task status and development activities
                        updated regularly. Accurate information helps provide
                        reliable performance reports and meaningful progress
                        monitoring.
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
                        Developer Reports & Monitoring
                    </p>
                </footer>

            </div>
        </div>
    );
}
