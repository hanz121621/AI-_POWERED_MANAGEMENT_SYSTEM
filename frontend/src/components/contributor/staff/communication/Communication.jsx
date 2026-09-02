
import { useState } from "react";
import {
    MessageSquare,
    AtSign,
    Bell,
    MessageCircle,
    X,
    Eye,
} from "lucide-react";

import ReceiveMessages from "@/components/contributor/staff/communication/ReceiveMessages";
import CommentOnTasks from "@/components/contributor/staff/communication/Communication";
import MentionTeamMembers from "@/components/contributor/staff/communication/MentionTeamMembers";
import ViewNotifications from "@/components/contributor/staff/communication/ViewNotifications";

// ============================================================
// STAFF COMMUNICATION
// ============================================================

function Communication() {
    const [selectedUseCase, setSelectedUseCase] =
        useState(null);

    // ========================================================
    // COMMUNICATION USE CASES
    // ========================================================

    const useCases = [
        {
            id: "STAFF-COMM-001",
            title: "Receive Messages",
            description:
                "View messages received from managers and team members.",
            icon: MessageSquare,
            component: ReceiveMessages,
        },
        {
            id: "STAFF-COMM-002",
            title: "Comment on Tasks",
            description:
                "Add comments and communicate about assigned tasks.",
            icon: MessageCircle,
            component: CommentOnTasks,
        },
        {
            id: "STAFF-COMM-003",
            title: "Mention Team Members",
            description:
                "Mention and send messages to other team members.",
            icon: AtSign,
            component: MentionTeamMembers,
        },
        {
            id: "STAFF-COMM-004",
            title: "View Notifications",
            description:
                "View task, project, sprint, and system notifications.",
            icon: Bell,
            component: ViewNotifications,
        },
    ];

    // ========================================================
    // SELECTED COMPONENT
    // ========================================================

    const SelectedComponent =
        selectedUseCase?.component;

    const SelectedIcon =
        selectedUseCase?.icon;

    // ========================================================
    // OPEN USE CASE
    // ========================================================

    const handleOpenUseCase = (useCase) => {
        setSelectedUseCase(useCase);
    };

    // ========================================================
    // CLOSE USE CASE
    // ========================================================

    const handleCloseUseCase = () => {
        setSelectedUseCase(null);
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="min-h-screen bg-slate-950 p-4 text-white sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">

                {/* ==================================================
                    PAGE HEADER
                ================================================== */}

                <div className="mb-8">
                    <div className="flex items-center gap-3">

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400">
                            <MessageSquare size={25} />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-white sm:text-3xl">
                                Communication
                            </h1>

                            <p className="mt-1 text-sm text-slate-400 sm:text-base">
                                Communicate with managers and team
                                members and stay informed.
                            </p>
                        </div>

                    </div>
                </div>

                {/* ==================================================
                    USE CASE CARDS
                ================================================== */}

                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

                    {useCases.map((useCase) => {
                        const Icon = useCase.icon;

                        return (
                            <button
                                key={useCase.id}
                                type="button"
                                onClick={() =>
                                    handleOpenUseCase(
                                        useCase
                                    )
                                }
                                className="group rounded-2xl border border-slate-700 bg-slate-900/70 p-5 text-left transition duration-200 hover:-translate-y-1 hover:border-blue-500/50 hover:bg-slate-900"
                            >

                                {/* Card Top */}
                                <div className="flex items-start justify-between">

                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/15 text-blue-400 transition group-hover:bg-blue-600 group-hover:text-white">
                                        <Icon size={23} />
                                    </div>

                                    <Eye
                                        size={18}
                                        className="text-slate-600 transition group-hover:text-blue-400"
                                    />

                                </div>

                                {/* Use Case ID */}
                                <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-blue-400">
                                    {useCase.id}
                                </p>

                                {/* Title */}
                                <h2 className="mt-2 text-lg font-semibold text-white">
                                    {useCase.title}
                                </h2>

                                {/* Description */}
                                <p className="mt-2 text-sm leading-6 text-slate-400">
                                    {useCase.description}
                                </p>

                                {/* Open */}
                                <div className="mt-5 text-sm font-medium text-blue-400">
                                    Open →
                                </div>

                            </button>
                        );
                    })}

                </div>
            </div>

            {/* ======================================================
                USE CASE MODAL
            ====================================================== */}

            {selectedUseCase && SelectedComponent && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
                    onMouseDown={(event) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            handleCloseUseCase();
                        }
                    }}
                >

                    <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl">

                        {/* ==================================================
                            MODAL HEADER
                        ================================================== */}

                        <div className="flex items-center justify-between border-b border-slate-700 bg-slate-900 px-5 py-4 sm:px-6">

                            <div className="flex min-w-0 items-center gap-3">

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400">
                                    {SelectedIcon && (
                                        <SelectedIcon
                                            size={20}
                                        />
                                    )}
                                </div>

                                <div className="min-w-0">

                                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                                        {selectedUseCase.id}
                                    </p>

                                    <h2 className="truncate text-lg font-bold text-white">
                                        {selectedUseCase.title}
                                    </h2>

                                </div>

                            </div>

                            <button
                                type="button"
                                onClick={
                                    handleCloseUseCase
                                }
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-white"
                                aria-label="Close"
                            >
                                <X size={20} />
                            </button>

                        </div>

                        {/* ==================================================
                            MODAL CONTENT
                        ================================================== */}

                        <div className="overflow-y-auto p-5 sm:p-6">

                            <SelectedComponent />

                        </div>

                    </div>

                </div>
            )}
        </div>
    );
}

export default Communication;
