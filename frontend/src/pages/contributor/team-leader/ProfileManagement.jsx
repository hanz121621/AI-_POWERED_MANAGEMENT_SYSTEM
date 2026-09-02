
import { useState } from "react";

import {
    UserRound,
    Eye,
    Pencil,
    X,
    UserCog,
} from "lucide-react";

// ============================================================
// TEAM LEADER PROFILE MANAGEMENT USE CASE COMPONENTS
// ============================================================

import ViewTeamLeaderProfile from "@/components/contributor/teamleader/profile/ViewTeamLeaderProfile";
import UpdateTeamLeaderProfile from "@/components/contributor/teamleader/profile/UpdateTeamLeaderProfile";

// ============================================================
// PROFILE MANAGEMENT USE CASES
// ============================================================

const PROFILE_USE_CASES = [
    {
        id: "view-profile",
        title: "View Profile",
        description: "View your Team Leader profile and personal information.",
        useCase: "PROFILE-001",
        icon: Eye,
        iconClass:
            "bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
        component: ViewTeamLeaderProfile,
    },
    {
        id: "update-profile",
        title: "Update Profile",
        description: "Update permitted profile and personal information.",
        useCase: "PROFILE-002",
        icon: Pencil,
        iconClass:
            "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400",
        component: UpdateTeamLeaderProfile,
    },
];

// ============================================================
// PROFILE CARD
// ============================================================

function ProfileCard({ profile, onClick }) {
    const Icon = profile.icon;

    return (
        <button
            type="button"
            onClick={() => onClick(profile)}
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
            {/* CARD TOP */}

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
                        ${profile.iconClass}
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
                    {profile.useCase}
                </span>
            </div>

            {/* CARD CONTENT */}

            <div className="mt-5">
                <h3
                    className="
                        text-sm
                        font-bold
                        text-slate-900
                        dark:text-white
                    "
                >
                    {profile.title}
                </h3>

                <p
                    className="
                        mt-2
                        min-h-[40px]
                        text-xs
                        leading-5
                        text-slate-500
                        dark:text-slate-400
                    "
                >
                    {profile.description}
                </p>

                <div className="mt-4">
                    <span
                        className="
                            text-[11px]
                            font-semibold
                            text-blue-600
                            dark:text-blue-400
                        "
                    >
                        Open Use Case →
                    </span>
                </div>
            </div>
        </button>
    );
}

// ============================================================
// PROFILE MODAL
// ============================================================

function ProfileModal({ profile, onClose }) {
    if (!profile || !profile.component) {
        return null;
    }

    const Icon = profile.icon;
    const Component = profile.component;

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
            aria-labelledby="profile-management-modal-title"
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
                    max-w-5xl
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
                                ${profile.iconClass}
                            `}
                        >
                            <Icon className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <h2
                                    id="profile-management-modal-title"
                                    className="
                                        text-base
                                        font-bold
                                        text-slate-900
                                        sm:text-lg
                                        dark:text-white
                                    "
                                >
                                    {profile.title}
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
                                    {profile.useCase}
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
                                {profile.description}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close popup"
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
// MAIN PROFILE MANAGEMENT PAGE
// ============================================================

function ProfileManagement() {
    const [selectedProfile, setSelectedProfile] = useState(null);

    // ========================================================
    // OPEN USE CASE
    // ========================================================

    const openProfile = (profile) => {
        setSelectedProfile(profile);
    };

    // ========================================================
    // CLOSE USE CASE
    // ========================================================

    const closeProfile = () => {
        setSelectedProfile(null);
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
                            <UserCog className="h-7 w-7" />
                        </div>

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
                                Profile Management
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
                                View and manage your Team Leader profile
                                information and permitted personal details.
                            </p>
                        </div>
                    </div>
                </header>

                {/* ==================================================
                    INFORMATION
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
                        <UserRound
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
                                Team Leader Profile
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
                                Select a profile-management use case below
                                to open and use its corresponding component.
                            </p>
                        </div>
                    </div>
                </section>

                {/* ==================================================
                    USE CASE GRID
                ================================================== */}

                <section>
                    <div className="mb-5">
                        <div className="flex items-center justify-between gap-4">
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
                                    Profile Management Use Cases
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
                                    All Team Leader profile-management use
                                    cases are available.
                                </p>
                            </div>

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
                                {PROFILE_USE_CASES.length} Use Cases
                            </span>
                        </div>
                    </div>

                    <div
                        className="
                            grid
                            gap-4
                            sm:grid-cols-2
                        "
                    >
                        {PROFILE_USE_CASES.map((profile) => (
                            <ProfileCard
                                key={profile.id}
                                profile={profile}
                                onClick={openProfile}
                            />
                        ))}
                    </div>
                </section>

                {/* ==================================================
                    USE CASE LIST
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
                    <div className="flex items-center gap-3">
                        <UserRound
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
                            Available Use Cases
                        </h2>
                    </div>

                    <div
                        className="
                            mt-4
                            grid
                            gap-2
                            sm:grid-cols-2
                        "
                    >
                        {PROFILE_USE_CASES.map((profile) => (
                            <button
                                key={profile.id}
                                type="button"
                                onClick={() => openProfile(profile)}
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
                                    {profile.useCase}
                                </span>

                                <span
                                    className="
                                        text-xs
                                        font-semibold
                                        text-slate-700
                                        dark:text-slate-300
                                    "
                                >
                                    {profile.title}
                                </span>
                            </button>
                        ))}
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
                        Team Leader • Profile Management • 2 Use Cases
                    </p>
                </footer>
            </div>

            {/* ======================================================
                PROFILE MODAL
            ====================================================== */}

            <ProfileModal
                profile={selectedProfile}
                onClose={closeProfile}
            />
        </div>
    );
}

export default ProfileManagement;
