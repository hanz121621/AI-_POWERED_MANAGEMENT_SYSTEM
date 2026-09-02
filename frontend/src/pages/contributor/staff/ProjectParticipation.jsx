
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
        <div className="min-h-screen bg-slate-950 p-6 text-white">

            {/* ====================================================
                HEADER
            ==================================================== */}

            <div className="mb-8">

                <div className="flex items-center gap-3">

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/20">

                        <FolderKanban
                            size={26}
                            className="text-blue-400"
                        />

                    </div>

                    <div>

                        <h1 className="text-2xl font-bold">
                            Project Participation
                        </h1>

                        <p className="text-sm text-slate-400">
                            View and manage your assigned project information.
                        </p>

                    </div>

                </div>

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
                            onClick={() => openUseCase(useCase)}
                            className="group rounded-2xl border border-slate-800 bg-slate-900 p-6 text-left transition hover:border-blue-500/50 hover:bg-slate-800"
                        >

                            <div className="mb-5 flex items-start justify-between">

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/20">

                                    <Icon
                                        size={24}
                                        className="text-blue-400"
                                    />

                                </div>

                                <Eye
                                    size={20}
                                    className="text-slate-600 transition group-hover:text-blue-400"
                                />

                            </div>

                            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-400">
                                {useCase.id}
                            </p>

                            <h2 className="mb-2 text-lg font-semibold">
                                {useCase.title}
                            </h2>

                            <p className="text-sm leading-6 text-slate-400">
                                {useCase.description}
                            </p>

                        </button>
                    );

                })}

            </div>

            {/* ====================================================
                MODAL
            ==================================================== */}

            {selectedUseCase && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">

                    <div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl">

                        {/* ====================================================
                            MODAL HEADER
                        ==================================================== */}

                        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">

                            <div className="flex items-center gap-3">

                                {SelectedIcon && (

                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/20">

                                        <SelectedIcon
                                            size={20}
                                            className="text-blue-400"
                                        />

                                    </div>

                                )}

                                <div>

                                    <h2 className="font-semibold text-white">
                                        {selectedUseCase.title}
                                    </h2>

                                    <p className="text-xs text-slate-500">
                                        {selectedUseCase.id}
                                    </p>

                                </div>

                            </div>

                            <button
                                type="button"
                                onClick={closeModal}
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                            >
                                <X size={20} />
                            </button>

                        </div>

                        {/* ====================================================
                            MODAL CONTENT
                        ==================================================== */}

                        <div className="overflow-y-auto p-6">

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
