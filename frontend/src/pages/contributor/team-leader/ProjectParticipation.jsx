
import { useState } from "react";

import {
    FolderKanban,
    FolderOpen,
    FileText,
    X,
    ArrowRight,
} from "lucide-react";

// ============================================================
// TEAM LEADER PROJECT PARTICIPATION COMPONENTS
// ============================================================

import ViewAssignedProjects from "@/components/contributor/teamleader/project-participation/ViewAssignedProjects";
import ViewProjectDetails from "@/components/contributor/teamleader/project-participation/ViewProjectDetails";

// ============================================================
// PROJECT PARTICIPATION USE CASES
// ============================================================

const PROJECT_PARTICIPATION_USE_CASES = [
    {
        id: "view-assigned-projects",
        title: "View Assigned Projects",
        description:
            "View the projects assigned to the team leader and monitor the projects the team is participating in.",
        useCase: "PROJECT-001",
        icon: FolderOpen,
        iconClass:
            "bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
        component: ViewAssignedProjects,
    },
    {
        id: "view-project-details",
        title: "View Project Details",
        description:
            "View detailed information about assigned projects, including project status, team, tasks, and progress.",
        useCase: "PROJECT-002",
        icon: FileText,
        iconClass:
            "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400",
        component: ViewProjectDetails,
    },
];

// ============================================================
// PROJECT PARTICIPATION CARD
// ============================================================

function ProjectParticipationCard({
    projectUseCase,
    onClick,
}) {
    const Icon = projectUseCase.icon;

    return (
        <button
            type="button"
            onClick={() => onClick(projectUseCase)}
            className="
                group
                w-full
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                text-left
                shadow-sm
                transition-all
                duration-200

                hover:-translate-y-1
                hover:border-blue-300
                hover:shadow-lg

                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
                focus:ring-offset-2

                dark:border-blue-900/60
                dark:bg-[#0b2038]
                dark:hover:border-blue-700
                dark:hover:bg-[#0d2744]
                dark:focus:ring-offset-[#071a2d]
            "
        >
            {/* ==================================================
                CARD HEADER
            ================================================== */}

            <div className="flex items-start justify-between gap-4">
                <div
                    className={`
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        ${projectUseCase.iconClass}
                    `}
                >
                    <Icon className="h-5 w-5" />
                </div>

                <span
                    className="
                        rounded-full
                        bg-slate-100
                        px-2.5
                        py-1
                        text-[10px]
                        font-bold
                        text-slate-500

                        dark:bg-blue-950/50
                        dark:text-blue-300
                    "
                >
                    {projectUseCase.useCase}
                </span>
            </div>

            {/* ==================================================
                CARD CONTENT
            ================================================== */}

            <div className="mt-5">
                <h3
                    className="
                        text-sm
                        font-bold
                        text-slate-900
                        dark:text-white
                    "
                >
                    {projectUseCase.title}
                </h3>

                <p
                    className="
                        mt-2
                        min-h-[60px]
                        text-xs
                        leading-5
                        text-slate-500
                        dark:text-slate-400
                    "
                >
                    {projectUseCase.description}
                </p>

                {/* OPEN BUTTON */}

                <div className="mt-4 flex items-center gap-2">
                    <span
                        className="
                            text-[11px]
                            font-semibold
                            text-blue-600
                            dark:text-blue-400
                        "
                    >
                        Open Use Case
                    </span>

                    <ArrowRight
                        className="
                            h-3.5
                            w-3.5
                            text-blue-600
                            transition-transform
                            duration-200
                            group-hover:translate-x-1
                            dark:text-blue-400
                        "
                    />
                </div>
            </div>
        </button>
    );
}

// ============================================================
// PROJECT PARTICIPATION MODAL
// ============================================================

function ProjectParticipationModal({
    projectUseCase,
    onClose,
}) {
    if (!projectUseCase || !projectUseCase.component) {
        return null;
    }

    const Icon = projectUseCase.icon;
    const Component = projectUseCase.component;

    return (
        <div
            className="
                fixed
                inset-0
                z-[200]
                flex
                items-center
                justify-center
                bg-slate-950/70
                p-3
                backdrop-blur-sm
                sm:p-5
            "
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-participation-modal-title"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <div
                className="
                    flex
                    max-h-[94vh]
                    w-full
                    max-w-6xl
                    flex-col
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    shadow-2xl

                    dark:border-blue-900/70
                    dark:bg-[#081b33]
                "
            >
                {/* ==================================================
                    MODAL HEADER
                ================================================== */}

                <div
                    className="
                        flex
                        shrink-0
                        items-center
                        justify-between
                        gap-4
                        border-b
                        border-slate-200
                        bg-white
                        px-5
                        py-4

                        dark:border-blue-900/60
                        dark:bg-[#0b2038]
                    "
                >
                    {/* TITLE AREA */}

                    <div className="flex min-w-0 items-center gap-3">
                        <div
                            className={`
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                ${projectUseCase.iconClass}
                            `}
                        >
                            <Icon className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <h2
                                    id="project-participation-modal-title"
                                    className="
                                        text-base
                                        font-bold
                                        text-slate-900
                                        sm:text-lg
                                        dark:text-white
                                    "
                                >
                                    {projectUseCase.title}
                                </h2>

                                <span
                                    className="
                                        rounded-full
                                        bg-blue-50
                                        px-2
                                        py-0.5
                                        text-[10px]
                                        font-bold
                                        text-blue-600

                                        dark:bg-blue-950/50
                                        dark:text-blue-400
                                    "
                                >
                                    {projectUseCase.useCase}
                                </span>
                            </div>

                            <p
                                className="
                                    mt-0.5
                                    hidden
                                    text-xs
                                    text-slate-500
                                    sm:block
                                    dark:text-slate-400
                                "
                            >
                                {projectUseCase.description}
                            </p>
                        </div>
                    </div>

                    {/* CLOSE BUTTON */}

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close project participation"
                        className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            text-slate-500
                            transition

                            hover:bg-slate-100
                            hover:text-slate-700

                            dark:hover:bg-blue-950/60
                            dark:hover:text-white
                        "
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* ==================================================
                    MODAL BODY
                ================================================== */}

                <div
                    className="
                        min-h-0
                        flex-1
                        overflow-y-auto
                        bg-slate-50
                        p-4
                        sm:p-6

                        dark:bg-[#071a2d]
                    "
                >
                    <Component />
                </div>
            </div>
        </div>
    );
}

// ============================================================
// MAIN TEAM LEADER PROJECT PARTICIPATION PAGE
// ============================================================

function ProjectParticipation() {
    const [selectedProjectUseCase, setSelectedProjectUseCase] =
        useState(null);

    // ========================================================
    // OPEN USE CASE
    // ========================================================

    const openProjectUseCase = (projectUseCase) => {
        setSelectedProjectUseCase(projectUseCase);
    };

    // ========================================================
    // CLOSE USE CASE
    // ========================================================

    const closeProjectUseCase = () => {
        setSelectedProjectUseCase(null);
    };

    return (
        <div
            className="
                min-h-screen
                bg-slate-50
                px-4
                py-6
                sm:px-6
                lg:px-8

                dark:bg-[#071a2d]
            "
        >
            <div className="mx-auto max-w-7xl space-y-8">

                {/* ==================================================
                    PAGE HEADER
                ================================================== */}

                <header
                    className="
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-6
                        shadow-sm

                        dark:border-blue-900/60
                        dark:bg-[#0b2038]
                    "
                >
                    <div className="flex items-start gap-4">

                        {/* HEADER ICON */}

                        <div
                            className="
                                flex
                                h-14
                                w-14
                                shrink-0
                                items-center
                                justify-center
                                rounded-2xl
                                bg-blue-600
                                text-white
                                shadow-lg
                                shadow-blue-600/20
                            "
                        >
                            <FolderKanban className="h-7 w-7" />
                        </div>

                        {/* HEADER CONTENT */}

                        <div>
                            <span
                                className="
                                    inline-flex
                                    rounded-full
                                    bg-blue-50
                                    px-2.5
                                    py-1
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-wider
                                    text-blue-600

                                    dark:bg-blue-950/50
                                    dark:text-blue-400
                                "
                            >
                                Team Leader
                            </span>

                            <h1
                                className="
                                    mt-3
                                    text-2xl
                                    font-bold
                                    tracking-tight
                                    text-slate-900
                                    sm:text-3xl
                                    dark:text-white
                                "
                            >
                                Project Participation
                            </h1>

                            <p
                                className="
                                    mt-2
                                    max-w-3xl
                                    text-sm
                                    leading-6
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                View your assigned projects and access
                                detailed information about the projects
                                your team is participating in.
                            </p>
                        </div>
                    </div>
                </header>

                {/* ==================================================
                    INFORMATION PANEL
                ================================================== */}

                <section
                    className="
                        rounded-2xl
                        border
                        border-blue-200
                        bg-blue-50
                        p-5

                        dark:border-blue-900/60
                        dark:bg-blue-950/25
                    "
                >
                    <div className="flex items-start gap-3">

                        <FolderKanban
                            className="
                                mt-0.5
                                h-5
                                w-5
                                shrink-0
                                text-blue-600
                                dark:text-blue-400
                            "
                        />

                        <div>
                            <h2
                                className="
                                    text-sm
                                    font-bold
                                    text-blue-900
                                    dark:text-blue-300
                                "
                            >
                                Project Participation
                            </h2>

                            <p
                                className="
                                    mt-1
                                    text-xs
                                    leading-5
                                    text-blue-800
                                    dark:text-blue-400
                                "
                            >
                                Select a project participation use case
                                below to view and manage project-related
                                information.
                            </p>
                        </div>
                    </div>
                </section>

                {/* ==================================================
                    USE CASE SECTION
                ================================================== */}

                <section>

                    {/* SECTION HEADER */}

                    <div className="mb-5">
                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                gap-4
                            "
                        >
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
                                    Project Participation Use Cases
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
                                    Access all Team Leader project
                                    participation functions.
                                </p>
                            </div>

                            {/* USE CASE COUNT */}

                            <span
                                className="
                                    rounded-full
                                    bg-slate-100
                                    px-3
                                    py-1.5
                                    text-xs
                                    font-semibold
                                    text-slate-500

                                    dark:bg-blue-950/50
                                    dark:text-blue-300
                                "
                            >
                                {
                                    PROJECT_PARTICIPATION_USE_CASES.length
                                }{" "}
                                Use Cases
                            </span>
                        </div>
                    </div>

                    {/* ==================================================
                        CARDS
                    ================================================== */}

                    <div
                        className="
                            grid
                            gap-4
                            sm:grid-cols-2
                        "
                    >
                        {PROJECT_PARTICIPATION_USE_CASES.map(
                            (projectUseCase) => (
                                <ProjectParticipationCard
                                    key={projectUseCase.id}
                                    projectUseCase={projectUseCase}
                                    onClick={openProjectUseCase}
                                />
                            )
                        )}
                    </div>
                </section>

                {/* ==================================================
                    AVAILABLE FUNCTIONS
                ================================================== */}

                <section
                    className="
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-5
                        shadow-sm

                        dark:border-blue-900/60
                        dark:bg-[#0b2038]
                    "
                >
                    {/* SECTION TITLE */}

                    <div className="flex items-center gap-3">

                        <FolderOpen
                            className="
                                h-5
                                w-5
                                text-blue-600
                                dark:text-blue-400
                            "
                        />

                        <h2
                            className="
                                text-sm
                                font-bold
                                text-slate-900
                                dark:text-white
                            "
                        >
                            Available Project Functions
                        </h2>
                    </div>

                    {/* FUNCTIONS */}

                    <div
                        className="
                            mt-4
                            grid
                            gap-2
                            sm:grid-cols-2
                        "
                    >
                        {PROJECT_PARTICIPATION_USE_CASES.map(
                            (projectUseCase) => (
                                <button
                                    key={projectUseCase.id}
                                    type="button"
                                    onClick={() =>
                                        openProjectUseCase(
                                            projectUseCase
                                        )
                                    }
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                        rounded-xl
                                        border
                                        border-slate-200
                                        px-3
                                        py-3
                                        text-left
                                        transition

                                        hover:border-blue-300
                                        hover:bg-blue-50

                                        dark:border-blue-900/60
                                        dark:hover:border-blue-700
                                        dark:hover:bg-blue-950/30
                                    "
                                >
                                    {/* USE CASE ID */}

                                    <span
                                        className="
                                            rounded-lg
                                            bg-blue-100
                                            px-2
                                            py-1
                                            text-[9px]
                                            font-bold
                                            text-blue-600

                                            dark:bg-blue-950/50
                                            dark:text-blue-400
                                        "
                                    >
                                        {projectUseCase.useCase}
                                    </span>

                                    {/* FUNCTION NAME */}

                                    <span
                                        className="
                                            flex-1
                                            text-xs
                                            font-semibold
                                            text-slate-700
                                            dark:text-slate-300
                                        "
                                    >
                                        {projectUseCase.title}
                                    </span>

                                    <ArrowRight
                                        className="
                                            h-4
                                            w-4
                                            text-slate-400
                                            dark:text-slate-500
                                        "
                                    />
                                </button>
                            )
                        )}
                    </div>
                </section>

                {/* ==================================================
                    FOOTER
                ================================================== */}

                <footer
                    className="
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
                        Team Leader • Project Participation • 2 Use Cases
                    </p>
                </footer>
            </div>

            {/* ======================================================
                PROJECT PARTICIPATION MODAL
            ====================================================== */}

            <ProjectParticipationModal
                projectUseCase={selectedProjectUseCase}
                onClose={closeProjectUseCase}
            />
        </div>
    );
}

export default ProjectParticipation;