
import { useState } from "react";

import {
    UserRound,
    Pencil,
    ShieldCheck,
    BriefcaseBusiness,
    Settings2,
    ChevronRight,
} from "lucide-react";

import ViewDeveloperProfile from "@/components/contributor/developer/profile/ViewDeveloperProfile";
import UpdateDeveloperProfile from "@/components/contributor/developer/profile/UpdateDeveloperProfile";

// ============================================================
// DEVELOPER PROFILE MANAGEMENT
// ============================================================

export default function Profile() {
    const [editing, setEditing] = useState(false);

    // ==========================================================
    // HANDLERS
    // ==========================================================

    const handleEdit = () => {
        setEditing(true);
    };

    const handleCancel = () => {
        setEditing(false);
    };

    const handleSuccess = () => {
        setEditing(false);
    };

    // ==========================================================
    // RENDER
    // ==========================================================

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
                                    bg-blue-100
                                    text-blue-600
                                    dark:bg-blue-950/60
                                    dark:text-blue-400
                                "
                            >
                                <UserRound className="h-5 w-5" />
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
                                        Profile Management
                                    </h1>

                                    <span
                                        className="
                                            hidden
                                            rounded-full
                                            bg-blue-100
                                            px-2
                                            py-0.5
                                            text-[10px]
                                            font-semibold
                                            text-blue-700
                                            sm:inline-flex
                                            dark:bg-blue-950/60
                                            dark:text-blue-300
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
                                    View and manage your personal information,
                                    professional details, and account profile.
                                </p>
                            </div>

                        </div>


                        {/* EDIT BUTTON */}

                        <button
                            type="button"
                            onClick={() =>
                                setEditing((value) => !value)
                            }
                            className="
                                inline-flex
                                w-full
                                items-center
                                justify-center
                                gap-2
                                rounded-lg
                                bg-blue-600
                                px-4
                                py-2.5
                                text-sm
                                font-semibold
                                text-white
                                shadow-sm
                                transition
                                hover:bg-blue-700
                                focus:outline-none
                                focus:ring-2
                                focus:ring-blue-500
                                focus:ring-offset-2
                                sm:w-auto
                                dark:focus:ring-offset-[#071a2f]
                            "
                        >
                            {editing ? (
                                <>
                                    <UserRound className="h-4 w-4" />
                                    View Profile
                                </>
                            ) : (
                                <>
                                    <Pencil className="h-4 w-4" />
                                    Edit Profile
                                </>
                            )}
                        </button>

                    </div>
                </header>


                {/* ==================================================
                    BREADCRUMB / PAGE STATUS
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
                            Profile
                        </span>

                        {editing && (
                            <>
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
                                        text-blue-600
                                        dark:text-blue-400
                                    "
                                >
                                    Edit
                                </span>
                            </>
                        )}

                    </div>


                    {/* STATUS */}

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
                            Account Active
                        </span>
                    </div>

                </div>


                {/* ==================================================
                    PROFILE OVERVIEW CARDS
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

                    {/* PROFESSIONAL PROFILE */}

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
                                    Professional Profile
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
                                    Developer Information
                                </p>
                            </div>

                        </div>

                    </div>


                    {/* ACCOUNT SECURITY */}

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
                                    Account Status
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
                                    Secure & Active
                                </p>
                            </div>

                        </div>

                    </div>


                    {/* PROFILE SETTINGS */}

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
                                    bg-violet-100
                                    text-violet-600
                                    dark:bg-violet-950/50
                                    dark:text-violet-400
                                "
                            >
                                <Settings2 className="h-4 w-4" />
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
                                    Profile Mode
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
                                    {editing
                                        ? "Editing Profile"
                                        : "View Profile"}
                                </p>
                            </div>

                        </div>

                    </div>

                </div>


                {/* ==================================================
                    MAIN PROFILE CONTENT
                ================================================== */}

                <main
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

                    {/* CONTENT HEADER */}

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

                        <div
                            className="
                                flex
                                flex-col
                                gap-1
                                sm:flex-row
                                sm:items-center
                                sm:justify-between
                            "
                        >

                            <div>

                                <h2
                                    className="
                                        text-base
                                        font-bold
                                        text-slate-900
                                        dark:text-white
                                    "
                                >
                                    {editing
                                        ? "Edit Developer Profile"
                                        : "Developer Profile"}
                                </h2>

                                <p
                                    className="
                                        mt-0.5
                                        text-xs
                                        text-slate-500
                                        dark:text-slate-400
                                    "
                                >
                                    {editing
                                        ? "Update the information that is permitted for your account."
                                        : "Review your current developer profile information."}
                                </p>

                            </div>


                            {/* MODE INDICATOR */}

                            <div
                                className={`
                                    inline-flex
                                    w-fit
                                    items-center
                                    gap-1.5
                                    rounded-full
                                    px-2.5
                                    py-1
                                    text-[10px]
                                    font-semibold
                                    ${
                                        editing
                                            ? `
                                                bg-amber-50
                                                text-amber-700
                                                dark:bg-amber-950/30
                                                dark:text-amber-400
                                            `
                                            : `
                                                bg-blue-50
                                                text-blue-700
                                                dark:bg-blue-950/30
                                                dark:text-blue-400
                                            `
                                    }
                                `}
                            >

                                <span
                                    className={`
                                        h-1.5
                                        w-1.5
                                        rounded-full
                                        ${
                                            editing
                                                ? "bg-amber-500"
                                                : "bg-blue-500"
                                        }
                                    `}
                                />

                                {editing
                                    ? "Editing"
                                    : "View Mode"}

                            </div>

                        </div>

                    </div>


                    {/* ==================================================
                        EXISTING PROFILE COMPONENT
                    ================================================== */}

                    <div className="p-4 sm:p-6">

                        {editing ? (
                            <UpdateDeveloperProfile
                                onCancel={handleCancel}
                                onSuccess={handleSuccess}
                            />
                        ) : (
                            <ViewDeveloperProfile
                                onEdit={handleEdit}
                            />
                        )}

                    </div>

                </main>


                {/* ==================================================
                    FOOTER INFORMATION
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
                        AI-PMS Developer Profile Management
                    </p>

                    <p
                        className="
                            text-[11px]
                            text-slate-400
                            dark:text-slate-500
                        "
                    >
                        Keep your professional information up to date.
                    </p>

                </div>

            </div>
        </div>
    );
}
