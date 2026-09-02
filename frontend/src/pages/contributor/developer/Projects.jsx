
import {
    FolderKanban,
    BriefcaseBusiness,
    ClipboardList,
    ChevronRight,
    ShieldCheck,
} from "lucide-react";

import ViewAssignedProjects
    from "@/components/contributor/developer/project/ViewAssignedProjects";

import ViewProjectDetails
    from "@/components/contributor/developer/project/ViewProjectDetails";

// ============================================================
// DEVELOPER PROJECTS PAGE
// ============================================================

export default function Projects() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#071a2f]">

            <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

                {/* ==================================================
                    PAGE HEADER
                ================================================== */}

                <header className="mb-6">

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                        {/* TITLE */}

                        <div className="flex items-start gap-3">

                            <div
                                className="
                                    flex
                                    h-11
                                    w-11
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-indigo-100
                                    text-indigo-600
                                    dark:bg-indigo-950/60
                                    dark:text-indigo-400
                                "
                            >
                                <FolderKanban className="h-5 w-5" />
                            </div>

                            <div>

                                <div className="flex items-center gap-2">

                                    <h1
                                        className="
                                            text-xl
                                            font-bold
                                            tracking-tight
                                            text-slate-900
                                            sm:text-2xl
                                            dark:text-white
                                        "
                                    >
                                        My Projects
                                    </h1>

                                    <span
                                        className="
                                            hidden
                                            rounded-full
                                            bg-indigo-100
                                            px-2
                                            py-0.5
                                            text-[10px]
                                            font-semibold
                                            text-indigo-700
                                            sm:inline-flex
                                            dark:bg-indigo-950/60
                                            dark:text-indigo-300
                                        "
                                    >
                                        Developer
                                    </span>

                                </div>

                                <p
                                    className="
                                        mt-1
                                        max-w-2xl
                                        text-sm
                                        text-slate-500
                                        dark:text-slate-400
                                    "
                                >
                                    View projects assigned to you, monitor
                                    project information, and access project details.
                                </p>

                            </div>

                        </div>


                        {/* STATUS */}

                        <div
                            className="
                                hidden
                                items-center
                                gap-2
                                rounded-lg
                                border
                                border-slate-200
                                bg-white
                                px-3
                                py-2
                                shadow-sm
                                sm:flex
                                dark:border-blue-900/60
                                dark:bg-[#0b2340]
                            "
                        >

                            <ShieldCheck
                                className="
                                    h-4
                                    w-4
                                    text-emerald-500
                                "
                            />

                            <div>

                                <p
                                    className="
                                        text-[10px]
                                        font-medium
                                        text-slate-500
                                        dark:text-slate-400
                                    "
                                >
                                    Project Access
                                </p>

                                <p
                                    className="
                                        text-xs
                                        font-semibold
                                        text-slate-900
                                        dark:text-white
                                    "
                                >
                                    Developer Workspace
                                </p>

                            </div>

                        </div>

                    </div>

                </header>


                {/* ==================================================
                    BREADCRUMB
                ================================================== */}

                <div
                    className="
                        mb-6
                        flex
                        items-center
                        justify-between
                        rounded-lg
                        border
                        border-slate-200
                        bg-white
                        px-4
                        py-3
                        shadow-sm
                        dark:border-blue-900/60
                        dark:bg-[#0b2340]
                    "
                >

                    <div className="flex items-center gap-2">

                        <span
                            className="
                                text-xs
                                font-medium
                                text-slate-500
                                dark:text-slate-400
                            "
                        >
                            Developer
                        </span>

                        <ChevronRight
                            className="
                                h-3.5
                                w-3.5
                                text-slate-400
                            "
                        />

                        <span
                            className="
                                text-xs
                                font-semibold
                                text-slate-700
                                dark:text-slate-200
                            "
                        >
                            Projects
                        </span>

                    </div>


                    <div
                        className="
                            hidden
                            items-center
                            gap-1.5
                            rounded-full
                            bg-emerald-50
                            px-2.5
                            py-1
                            sm:flex
                            dark:bg-emerald-950/30
                        "
                    >

                        <span
                            className="
                                h-1.5
                                w-1.5
                                rounded-full
                                bg-emerald-500
                            "
                        />

                        <span
                            className="
                                text-[10px]
                                font-semibold
                                text-emerald-700
                                dark:text-emerald-400
                            "
                        >
                            Active Workspace
                        </span>

                    </div>

                </div>


                {/* ==================================================
                    PROJECT OVERVIEW CARDS
                ================================================== */}

                <div
                    className="
                        mb-6
                        grid
                        grid-cols-1
                        gap-4
                        sm:grid-cols-2
                        lg:grid-cols-3
                    "
                >

                    {/* ASSIGNED PROJECTS */}

                    <div
                        className="
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            p-4
                            shadow-sm
                            dark:border-blue-900/60
                            dark:bg-[#0b2340]
                        "
                    >

                        <div className="flex items-center gap-3">

                            <div
                                className="
                                    flex
                                    h-9
                                    w-9
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-indigo-100
                                    text-indigo-600
                                    dark:bg-indigo-950/60
                                    dark:text-indigo-400
                                "
                            >
                                <BriefcaseBusiness className="h-4 w-4" />
                            </div>

                            <div>

                                <p
                                    className="
                                        text-xs
                                        font-medium
                                        text-slate-500
                                        dark:text-slate-400
                                    "
                                >
                                    Workspace
                                </p>

                                <p
                                    className="
                                        mt-0.5
                                        text-sm
                                        font-semibold
                                        text-slate-900
                                        dark:text-white
                                    "
                                >
                                    Assigned Projects
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* PROJECT DETAILS */}

                    <div
                        className="
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            p-4
                            shadow-sm
                            dark:border-blue-900/60
                            dark:bg-[#0b2340]
                        "
                    >

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
                                    text-blue-600
                                    dark:bg-blue-950/60
                                    dark:text-blue-400
                                "
                            >
                                <ClipboardList className="h-4 w-4" />
                            </div>

                            <div>

                                <p
                                    className="
                                        text-xs
                                        font-medium
                                        text-slate-500
                                        dark:text-slate-400
                                    "
                                >
                                    Information
                                </p>

                                <p
                                    className="
                                        mt-0.5
                                        text-sm
                                        font-semibold
                                        text-slate-900
                                        dark:text-white
                                    "
                                >
                                    Project Details
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* DEVELOPER ACCESS */}

                    <div
                        className="
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            p-4
                            shadow-sm
                            dark:border-blue-900/60
                            dark:bg-[#0b2340]
                        "
                    >

                        <div className="flex items-center gap-3">

                            <div
                                className="
                                    flex
                                    h-9
                                    w-9
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-emerald-100
                                    text-emerald-600
                                    dark:bg-emerald-950/50
                                    dark:text-emerald-400
                                "
                            >
                                <ShieldCheck className="h-4 w-4" />
                            </div>

                            <div>

                                <p
                                    className="
                                        text-xs
                                        font-medium
                                        text-slate-500
                                        dark:text-slate-400
                                    "
                                >
                                    Access Level
                                </p>

                                <p
                                    className="
                                        mt-0.5
                                        text-sm
                                        font-semibold
                                        text-slate-900
                                        dark:text-white
                                    "
                                >
                                    Developer Access
                                </p>

                            </div>

                        </div>

                    </div>

                </div>


                {/* ==================================================
                    ASSIGNED PROJECTS SECTION
                ================================================== */}

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
                        dark:bg-[#0b2340]
                    "
                >

                    {/* SECTION HEADER */}

                    <div
                        className="
                            border-b
                            border-slate-200
                            px-5
                            py-4
                            sm:px-6
                            dark:border-blue-900/60
                        "
                    >

                        <div className="flex items-center gap-3">

                            <div
                                className="
                                    flex
                                    h-8
                                    w-8
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-indigo-100
                                    text-indigo-600
                                    dark:bg-indigo-950/60
                                    dark:text-indigo-400
                                "
                            >
                                <FolderKanban className="h-4 w-4" />
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
                                    Assigned Projects
                                </h2>

                                <p
                                    className="
                                        mt-0.5
                                        text-xs
                                        text-slate-500
                                        dark:text-slate-400
                                    "
                                >
                                    Projects currently assigned to your developer account.
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* PROJECT LIST */}

                    <div className="p-4 sm:p-6">

                        <ViewAssignedProjects />

                    </div>

                </section>


                {/* ==================================================
                    PROJECT DETAILS SECTION
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
                        dark:bg-[#0b2340]
                    "
                >

                    {/* SECTION HEADER */}

                    <div
                        className="
                            border-b
                            border-slate-200
                            px-5
                            py-4
                            sm:px-6
                            dark:border-blue-900/60
                        "
                    >

                        <div className="flex items-center gap-3">

                            <div
                                className="
                                    flex
                                    h-8
                                    w-8
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-blue-100
                                    text-blue-600
                                    dark:bg-blue-950/60
                                    dark:text-blue-400
                                "
                            >
                                <ClipboardList className="h-4 w-4" />
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
                                    Project Details
                                </h2>

                                <p
                                    className="
                                        mt-0.5
                                        text-xs
                                        text-slate-500
                                        dark:text-slate-400
                                    "
                                >
                                    Review detailed information about your assigned projects.
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* DETAILS */}

                    <div className="p-4 sm:p-6">

                        <ViewProjectDetails />

                    </div>

                </section>


                {/* ==================================================
                    FOOTER
                ================================================== */}

                <div
                    className="
                        mt-5
                        flex
                        flex-col
                        gap-2
                        text-center
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                        sm:text-left
                    "
                >

                    <p
                        className="
                            text-[11px]
                            text-slate-400
                            dark:text-slate-500
                        "
                    >
                        AI-PMS Developer Project Management
                    </p>

                    <p
                        className="
                            text-[11px]
                            text-slate-400
                            dark:text-slate-500
                        "
                    >
                        Project information is based on your assigned workspace.
                    </p>

                </div>

            </div>
        </div>
    );
}
