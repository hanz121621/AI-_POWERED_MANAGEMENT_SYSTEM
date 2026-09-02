
import { useState } from "react";

import {
    UserRound,
    Pencil,
    Eye,
    X,
    UserCircle,
} from "lucide-react";

import ViewStaffProfile from "@/components/contributor/staff/profile/ViewStaffProfile";
import UpdateStaffProfile from "@/components/contributor/staff/profile/UpdateStaffProfile";

// ============================================================
// STAFF PROFILE MANAGEMENT
// ============================================================

function ProfileManagement() {
    const [selectedUseCase, setSelectedUseCase] = useState(null);

    // ============================================================
    // PROFILE MANAGEMENT USE CASES
    // ============================================================

    const useCases = [
        {
            id: "STAFF-PROFILE-001",
            title: "View Profile",
            description:
                "View your personal information, contact details, role, department, organization, and specialization.",
            icon: Eye,
            component: ViewStaffProfile,
        },
        {
            id: "STAFF-PROFILE-002",
            title: "Update Profile",
            description:
                "Update permitted personal information, contact details, and professional profile information.",
            icon: Pencil,
            component: UpdateStaffProfile,
        },
    ];

    // ============================================================
    // OPEN USE CASE
    // ============================================================

    const handleOpenUseCase = (useCase) => {
        setSelectedUseCase(useCase);
    };

    // ============================================================
    // CLOSE MODAL
    // ============================================================

    const handleCloseModal = () => {
        setSelectedUseCase(null);
    };

    // ============================================================
    // DYNAMIC COMPONENTS
    // ============================================================

    const SelectedComponent = selectedUseCase?.component;
    const SelectedIcon = selectedUseCase?.icon;

    // ============================================================
    // UI
    // ============================================================

    return (
        <div className="min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-8 text-white">
            <div className="mx-auto max-w-7xl">

                {/* ==================================================
                    PAGE HEADER
                ================================================== */}

                <div className="mb-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div className="flex items-start gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600/20 ring-1 ring-blue-500/30">
                                <UserCircle
                                    size={30}
                                    className="text-blue-400"
                                />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                                    Profile Management
                                </h1>

                                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                                    Manage and view your staff profile information,
                                    personal details, and professional information.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ==================================================
                    INFORMATION BANNER
                ================================================== */}

                <div className="mb-8 rounded-2xl border border-blue-500/20 bg-blue-950/30 p-5">
                    <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600/20">
                            <UserRound
                                size={20}
                                className="text-blue-400"
                            />
                        </div>

                        <div>
                            <h2 className="font-semibold text-white">
                                Staff Profile
                            </h2>

                            <p className="mt-1 text-sm leading-6 text-slate-400">
                                Use the options below to view your profile
                                information or update the information you are
                                permitted to change.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ==================================================
                    USE CASES
                ================================================== */}

                <div>
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-white">
                            Profile Management Use Cases
                        </h2>

                        <p className="mt-1 text-sm text-slate-400">
                            Select an action to continue.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                        {useCases.map((useCase) => {
                            const Icon = useCase.icon;

                            return (
                                <button
                                    key={useCase.id}
                                    type="button"
                                    onClick={() => handleOpenUseCase(useCase)}
                                    className="group rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-left shadow-lg shadow-black/10 transition duration-200 hover:-translate-y-1 hover:border-blue-500/40 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                >
                                    {/* Icon + Use Case ID */}

                                    <div className="mb-5 flex items-start justify-between gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/15 ring-1 ring-blue-500/20 transition group-hover:bg-blue-600/25">
                                            <Icon
                                                size={24}
                                                className="text-blue-400"
                                            />
                                        </div>

                                        <span className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs font-medium text-slate-400">
                                            {useCase.id}
                                        </span>
                                    </div>

                                    {/* Title */}

                                    <h3 className="text-lg font-semibold text-white transition group-hover:text-blue-300">
                                        {useCase.title}
                                    </h3>

                                    {/* Description */}

                                    <p className="mt-2 min-h-[48px] text-sm leading-6 text-slate-400">
                                        {useCase.description}
                                    </p>

                                    {/* Action */}

                                    <div className="mt-6 flex items-center gap-2 text-sm font-medium text-blue-400">
                                        <span>
                                            Open
                                        </span>

                                        <span className="transition-transform group-hover:translate-x-1">
                                            →
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ======================================================
                MODAL
            ====================================================== */}

            {selectedUseCase && SelectedComponent && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
                    onMouseDown={handleCloseModal}
                >
                    <div
                        className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl"
                        onMouseDown={(event) => event.stopPropagation()}
                    >
                        {/* ==================================================
                            MODAL HEADER
                        ================================================== */}

                        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-5 py-4 sm:px-6">
                            <div className="flex min-w-0 items-center gap-3">

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600/15">
                                    {SelectedIcon && (
                                        <SelectedIcon
                                            size={20}
                                            className="text-blue-400"
                                        />
                                    )}
                                </div>

                                <div className="min-w-0">
                                    <h2 className="truncate text-lg font-semibold text-white">
                                        {selectedUseCase.title}
                                    </h2>

                                    <p className="text-xs text-slate-500">
                                        {selectedUseCase.id}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleCloseModal}
                                className="ml-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-white"
                                aria-label="Close"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* ==================================================
                            MODAL CONTENT
                        ================================================== */}

                        <div className="overflow-y-auto p-4 sm:p-6">
                            <SelectedComponent />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProfileManagement;
