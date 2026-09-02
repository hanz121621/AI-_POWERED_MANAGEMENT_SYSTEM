
import { useState } from "react";

import {
    FolderKanban,
    Eye,
    X,
} from "lucide-react";

import ViewAssignedProjects
    from "@/components/contributor/staff/project-participation/ViewAssignedProjects";

import ViewProjectDetails
    from "@/components/contributor/staff/project-participation/ViewProjectDetails";

// ============================================================
// STAFF PROJECT PARTICIPATION
// ============================================================

function ProjectParticipation() {
    const [selectedUseCase, setSelectedUseCase] = useState(null);

    // ============================================================
    // USE CASES
    // ============================================================

    const useCases = [
        {
            id: "STAFF-PROJECT-001",
            title: "View Assigned Projects",
            description:
                "View projects assigned to you and monitor your project participation.",
            icon: Eye,
            component: ViewAssignedProjects,
        },
        {
            id: "STAFF-PROJECT-002",
            title: "View Project Details",
            description:
                "View detailed information about your assigned projects.",
            icon: FolderKanban,
            component: ViewProjectDetails,
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
    // SELECTED COMPONENT
    // ============================================================

    const SelectedComponent = selectedUseCase?.component;
    const SelectedIcon = selectedUseCase?.icon;

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <div className="w-full">
            <div className="mx-auto max-w-7xl">

                {/* ====================================================
                    HEADER
                ==================================================== */}

                <div className="mb-8">
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
                            <FolderKanban
                                size={28}
                                className="text-primary"
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
                                Project Participation
                            </h1>

                            <p
                                className="
                                    mt-1 text-sm
                                    text-muted-foreground
                                    sm:text-base
                                "
                            >
                                View and manage your assigned project
                                information.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ====================================================
                    USE CASE SECTION
                ==================================================== */}

                <div>
                    <div className="mb-5">
                        <h2
                            className="
                                text-lg font-semibold
                                text-foreground
                            "
                        >
                            Project Participation Use Cases
                        </h2>

                        <p
                            className="
                                mt-1 text-sm
                                text-muted-foreground
                            "
                        >
                            Select an action to continue.
                        </p>
                    </div>

                    {/* ====================================================
                        USE CASE CARDS
                    ==================================================== */}

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                        {useCases.map((useCase) => {
                            const Icon = useCase.icon;

                            return (
                                <button
                                    key={useCase.id}
                                    type="button"
                                    onClick={() =>
                                        openUseCase(useCase)
                                    }
                                    className="
                                        group w-full rounded-2xl
                                        border border-border
                                        bg-card
                                        p-6 text-left
                                        shadow-sm
                                        transition-all duration-200
                                        hover:-translate-y-1
                                        hover:border-primary/40
                                        hover:shadow-md
                                        focus:outline-none
                                        focus:ring-2
                                        focus:ring-primary/40
                                    "
                                >

                                    {/* Card Header */}

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
                                                transition
                                                group-hover:bg-primary/15
                                            "
                                        >
                                            <Icon
                                                size={24}
                                                className="text-primary"
                                            />
                                        </div>

                                        {/* View Icon */}

                                        <div
                                            className="
                                                rounded-lg
                                                p-2
                                                text-muted-foreground
                                                transition
                                                group-hover:bg-muted
                                                group-hover:text-primary
                                            "
                                        >
                                            <Eye size={20} />
                                        </div>
                                    </div>

                                    {/* Use Case ID */}

                                    <p
                                        className="
                                            mb-2 text-xs
                                            font-semibold uppercase
                                            tracking-wider
                                            text-primary
                                        "
                                    >
                                        {useCase.id}
                                    </p>

                                    {/* Title */}

                                    <h2
                                        className="
                                            mb-2 text-lg
                                            font-semibold
                                            text-card-foreground
                                            transition
                                            group-hover:text-primary
                                        "
                                    >
                                        {useCase.title}
                                    </h2>

                                    {/* Description */}

                                    <p
                                        className="
                                            text-sm leading-6
                                            text-muted-foreground
                                        "
                                    >
                                        {useCase.description}
                                    </p>

                                    {/* Open Action */}

                                    <div
                                        className="
                                            mt-5 flex items-center
                                            gap-2 text-sm
                                            font-medium
                                            text-primary
                                        "
                                    >
                                        <span>
                                            Open
                                        </span>

                                        <span
                                            className="
                                                transition-transform
                                                group-hover:translate-x-1
                                            "
                                        >
                                            →
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ====================================================
                MODAL
            ==================================================== */}

            {selectedUseCase && (
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
                            w-full max-w-5xl
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

                                {/* Selected Icon */}

                                {SelectedIcon && (
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
                                        <SelectedIcon
                                            size={20}
                                            className="text-primary"
                                        />
                                    </div>
                                )}

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
                                    shrink-0 items-center
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
                                <X size={20} />
                            </button>
                        </div>

                        {/* ====================================================
                            MODAL CONTENT
                        ==================================================== */}

                        <div
                            className="
                                overflow-y-auto
                                bg-background
                                p-4
                                sm:p-6
                            "
                        >
                            {SelectedComponent && (
                                <SelectedComponent />
                            )}
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

export default ProjectParticipation;
