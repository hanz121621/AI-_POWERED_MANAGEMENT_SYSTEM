
import { useState } from "react";

import {
    Target,
    ListChecks,
    X,
    Eye,
} from "lucide-react";

import ViewSprintTasks
    from "@/components/contributor/staff/sprint-participation/ViewSprintTasks";

import ViewSprintProgress
    from "@/components/contributor/staff/sprint-participation/ViewSprintProgress";

// ============================================================
// STAFF - SPRINT PARTICIPATION
// ============================================================

function SprintParticipation() {
    const [selectedUseCase, setSelectedUseCase] = useState(null);

    // ============================================================
    // USE CASES
    // ============================================================

    const useCases = [
        {
            id: "STAFF-SPRINT-001",
            title: "View Sprint Tasks",
            description:
                "View tasks assigned to you within the current sprint.",
            icon: ListChecks,
            component: ViewSprintTasks,
        },
        {
            id: "STAFF-SPRINT-002",
            title: "View Sprint Goals & Progress",
            description:
                "View sprint goals, progress, and completion information.",
            icon: Target,
            component: ViewSprintProgress,
        },
    ];

    // ============================================================
    // SELECTED COMPONENT
    // ============================================================

    const SelectedComponent = selectedUseCase?.component;

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
    // RENDER
    // ============================================================

    return (
        <div className="w-full">
            <div className="mx-auto max-w-7xl">

                {/* ====================================================
                    HEADER
                ==================================================== */}

                <div className="mb-8">
                    <div className="flex items-start gap-4">

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
                            <Target
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
                                Sprint Participation
                            </h1>

                            <p
                                className="
                                    mt-1 max-w-2xl
                                    text-sm leading-6
                                    text-muted-foreground
                                    sm:text-base
                                "
                            >
                                Participate in sprints, view sprint tasks,
                                and monitor sprint progress.
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
                            Sprint Participation Use Cases
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

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                        {useCases.map((useCase) => {
                            const Icon = useCase.icon;

                            return (
                                <div
                                    key={useCase.id}
                                    className="
                                        group rounded-2xl
                                        border border-border
                                        bg-card
                                        p-6
                                        shadow-sm
                                        transition-all duration-200
                                        hover:-translate-y-1
                                        hover:border-primary/40
                                        hover:shadow-md
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
                                            "
                                        >
                                            <Icon
                                                size={25}
                                                className="text-primary"
                                            />
                                        </div>

                                        {/* Use Case ID */}

                                        <span
                                            className="
                                                rounded-full
                                                border border-border
                                                bg-muted
                                                px-3 py-1
                                                text-xs font-medium
                                                text-muted-foreground
                                            "
                                        >
                                            {useCase.id}
                                        </span>
                                    </div>

                                    {/* Title */}

                                    <h2
                                        className="
                                            text-xl font-semibold
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
                                            mt-2 min-h-[48px]
                                            text-sm leading-6
                                            text-muted-foreground
                                        "
                                    >
                                        {useCase.description}
                                    </p>

                                    {/* Open Button */}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            openUseCase(useCase)
                                        }
                                        className="
                                            mt-6 flex w-full
                                            items-center
                                            justify-center gap-2
                                            rounded-xl
                                            bg-primary
                                            px-4 py-3
                                            font-medium
                                            text-primary-foreground
                                            transition
                                            hover:opacity-90
                                            focus:outline-none
                                            focus:ring-2
                                            focus:ring-primary/40
                                        "
                                    >
                                        <Eye size={18} />

                                        <span>
                                            Open
                                        </span>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
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
                            max-h-[90vh]
                            w-full max-w-5xl
                            overflow-y-auto
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
                                sticky top-0 z-10
                                flex items-center
                                justify-between
                                border-b border-border
                                bg-card
                                px-5 py-4
                                sm:px-6
                            "
                        >
                            <div className="min-w-0">

                                <h2
                                    className="
                                        truncate text-xl
                                        font-bold
                                        text-foreground
                                    "
                                >
                                    {selectedUseCase.title}
                                </h2>

                                <p
                                    className="
                                        mt-1 text-xs
                                        text-muted-foreground
                                    "
                                >
                                    {selectedUseCase.id}
                                </p>
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
                                <X size={22} />
                            </button>
                        </div>

                        {/* ====================================================
                            CHILD COMPONENT
                        ==================================================== */}

                        <div
                            className="
                                bg-background
                                p-4
                                sm:p-6
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

export default SprintParticipation;
