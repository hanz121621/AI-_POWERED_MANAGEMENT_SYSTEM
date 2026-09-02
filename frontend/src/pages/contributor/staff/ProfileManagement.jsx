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
        <div className="w-full">
            <div className="mx-auto max-w-7xl">

                {/* ==================================================
                    PAGE HEADER
                ================================================== */}

                <div className="mb-8">
                    <div className="flex items-start gap-4">

                        {/* Icon */}

                        <div
                            className="
                                flex h-14 w-14 shrink-0 items-center
                                justify-center rounded-2xl
                                bg-primary/10
                                ring-1 ring-primary/20
                            "
                        >
                            <UserCircle
                                size={30}
                                className="text-primary"
                            />
                        </div>

                        {/* Title */}

                        <div>
                            <h1
                                className="
                                    text-2xl font-bold tracking-tight
                                    text-foreground
                                    sm:text-3xl
                                "
                            >
                                Profile Management
                            </h1>

                            <p
                                className="
                                    mt-1 max-w-2xl text-sm leading-6
                                    text-muted-foreground
                                    sm:text-base
                                "
                            >
                                Manage and view your staff profile information,
                                personal details, and professional information.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ==================================================
                    INFORMATION BANNER
                ================================================== */}

                <div
                    className="
                        mb-8 rounded-2xl
                        border border-border
                        bg-card
                        p-5
                        shadow-sm
                    "
                >
                    <div className="flex items-start gap-4">

                        {/* Icon */}

                        <div
                            className="
                                flex h-10 w-10 shrink-0 items-center
                                justify-center rounded-xl
                                bg-primary/10
                            "
                        >
                            <UserRound
                                size={20}
                                className="text-primary"
                            />
                        </div>

                        {/* Information */}

                        <div>
                            <h2
                                className="
                                    font-semibold
                                    text-card-foreground
                                "
                            >
                                Staff Profile
                            </h2>

                            <p
                                className="
                                    mt-1 text-sm leading-6
                                    text-muted-foreground
                                "
                            >
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

                    {/* Section Header */}

                    <div className="mb-4">
                        <h2
                            className="
                                text-lg font-semibold
                                text-foreground
                            "
                        >
                            Profile Management Use Cases
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

                    {/* Use Case Cards */}

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                        {useCases.map((useCase) => {
                            const Icon = useCase.icon;

                            return (
                                <button
                                    key={useCase.id}
                                    type="button"
                                    onClick={() =>
                                        handleOpenUseCase(useCase)
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

                                    {/* ==================================================
                                        ICON + USE CASE ID
                                    ================================================== */}

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
                                                items-center justify-center
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

                                    {/* ==================================================
                                        TITLE
                                    ================================================== */}

                                    <h3
                                        className="
                                            text-lg font-semibold
                                            text-card-foreground
                                            transition
                                            group-hover:text-primary
                                        "
                                    >
                                        {useCase.title}
                                    </h3>

                                    {/* ==================================================
                                        DESCRIPTION
                                    ================================================== */}

                                    <p
                                        className="
                                            mt-2 min-h-[48px]
                                            text-sm leading-6
                                            text-muted-foreground
                                        "
                                    >
                                        {useCase.description}
                                    </p>

                                    {/* ==================================================
                                        ACTION
                                    ================================================== */}

                                    <div
                                        className="
                                            mt-6 flex items-center gap-2
                                            text-sm font-medium
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

            {/* ======================================================
                MODAL
            ====================================================== */}

            {selectedUseCase && SelectedComponent && (
                <div
                    className="
                        fixed inset-0 z-50 flex
                        items-center justify-center
                        bg-black/50
                        p-4
                        backdrop-blur-sm
                    "
                    onMouseDown={handleCloseModal}
                >
                    <div
                        className="
                            flex max-h-[90vh] w-full max-w-5xl
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

                        {/* ==================================================
                            MODAL HEADER
                        ================================================== */}

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

                                <div
                                    className="
                                        flex h-10 w-10 shrink-0
                                        items-center justify-center
                                        rounded-xl
                                        bg-primary/10
                                    "
                                >
                                    {SelectedIcon && (
                                        <SelectedIcon
                                            size={20}
                                            className="text-primary"
                                        />
                                    )}
                                </div>

                                {/* Title */}

                                <div className="min-w-0">
                                    <h2
                                        className="
                                            truncate text-lg
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

                            {/* Close */}

                            <button
                                type="button"
                                onClick={handleCloseModal}
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

                        {/* ==================================================
                            MODAL CONTENT
                        ================================================== */}

                        <div
                            className="
                                overflow-y-auto
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

export default ProfileManagement;