
// ============================================================
// MANAGER PROFILE
// PM-PROFILE-001 — View Profile
//
// This page displays the currently authenticated manager's
// profile information.
//
// IMPORTANT
// ------------------------------------------------------------
// - No Update Profile button
// - No editable fields
// - No role editing
// - No permission editing
// - No organization editing
// - No team editing
// - No hard-coded user information
//
// Profile data is loaded from the authenticated user.
// ============================================================

import { useEffect, useState } from "react";

import {
    UserRound,
    Mail,
    Phone,
    ShieldCheck,
    Building2,
    UsersRound,
    CalendarDays,
    Clock3,
    CheckCircle2,
    LockKeyhole,
    AlertCircle,
} from "lucide-react";

import {
    getMyProfile,
} from "@/services/authService";

// ============================================================
// HELPERS
// ============================================================

const formatDate = (value) => {
    if (!value) {
        return "Not available";
    }

    try {
        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "Not available";
        }

        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    } catch {
        return "Not available";
    }
};

const formatDateTime = (value) => {
    if (!value) {
        return "Not available";
    }

    try {
        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "Not available";
        }

        return date.toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });
    } catch {
        return "Not available";
    }
};

// ============================================================
// INFO ITEM
// ============================================================

function InfoItem({
    icon: Icon,
    label,
    value,
}) {
    return (
        <div className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700">
                <Icon className="h-5 w-5 text-slate-600 dark:text-slate-300" />
            </div>

            <div className="min-w-0">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {label}
                </p>

                <p className="mt-1 break-words text-base font-semibold text-slate-900 dark:text-white">
                    {value || "Not provided"}
                </p>
            </div>
        </div>
    );
}

// ============================================================
// SECTION
// ============================================================

function ProfileSection({
    title,
    description,
    children,
}) {
    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-700">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    {title}
                </h2>

                {description && (
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {description}
                    </p>
                )}
            </div>

            <div className="p-6">
                {children}
            </div>
        </section>
    );
}

// ============================================================
// MANAGER PROFILE
// ============================================================

export default function ManagerProfile() {
    const [profile, setProfile] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    // ========================================================
    // LOAD CURRENT PROFILE
    // ========================================================

    useEffect(() => {
        let mounted = true;

        const loadProfile = async () => {
            setLoading(true);
            setError("");

            try {
                const result = await getMyProfile();

                if (!mounted) {
                    return;
                }

                /*
                 * authService.getMyProfile() returns the
                 * normalized authenticated user.
                 */
                if (result) {
                    setProfile(result);
                } else {
                    setError(
                        "Unable to load your profile."
                    );
                }
            } catch (err) {
                console.error(
                    "MANAGER PROFILE LOAD ERROR:",
                    err
                );

                if (!mounted) {
                    return;
                }

                setError(
                    err?.message ||
                    "Unable to load your profile."
                );
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        loadProfile();

        return () => {
            mounted = false;
        };
    }, []);

    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {
        return (
            <div className="min-h-full bg-slate-50 p-6 dark:bg-slate-950">
                <div className="mx-auto max-w-6xl">
                    <div className="flex min-h-[400px] items-center justify-center">
                        <div className="text-center">
                            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-slate-700 dark:border-slate-700 dark:border-t-white" />

                            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                                Loading profile...
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ========================================================
    // ERROR
    // ========================================================

    if (error || !profile) {
        return (
            <div className="min-h-full bg-slate-50 p-6 dark:bg-slate-950">
                <div className="mx-auto max-w-6xl">
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900/50 dark:bg-red-950/30">
                        <div className="flex items-start gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/40">
                                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                            </div>

                            <div>
                                <h2 className="font-semibold text-red-800 dark:text-red-300">
                                    Unable to load profile
                                </h2>

                                <p className="mt-1 text-sm text-red-700 dark:text-red-400">
                                    {error ||
                                        "Your profile information could not be loaded."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ========================================================
    // PROFILE VALUES
    // ========================================================

    const fullName =
        profile.fullName ||
        "Not provided";

    const email =
        profile.email ||
        "Not provided";

    const phoneNumber =
        profile.phoneNumber ||
        "Not provided";

    const role =
        profile.role ||
        "Not assigned";

    const organization =
        profile.organizationName ||
        profile.organization ||
        profile.organization?.name ||
        "Not assigned";

    const team =
        profile.teamName ||
        profile.team ||
        profile.team?.name ||
        "Not assigned";

    const accountCreated =
        profile.createdAt ||
        profile.accountCreatedAt ||
        null;

    const lastLogin =
        profile.lastLogin ||
        profile.lastLoginAt ||
        profile.lastLoggedInAt ||
        null;

    const isActive =
        profile.isActive !== false;

    // ========================================================
    // VIEW PROFILE
    // ========================================================

    return (
        <div className="min-h-full bg-slate-50 p-4 sm:p-6 dark:bg-slate-950">
            <div className="mx-auto max-w-6xl space-y-6">

                {/* ==================================================
                    PAGE HEADER
                ================================================== */}

                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                        Profile Management
                    </h1>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        View your personal account information
                        and profile details.
                    </p>
                </div>

                {/* ==================================================
                    PROFILE HEADER CARD
                ================================================== */}

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
                    <div className="p-6 sm:p-8">
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

                            {/* PROFILE IMAGE */}
                            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 ring-4 ring-slate-50 dark:bg-slate-700 dark:ring-slate-900">
                                {profile.profileImage ? (
                                    <img
                                        src={
                                            profile.profileImage
                                        }
                                        alt={fullName}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <UserRound className="h-11 w-11 text-slate-500 dark:text-slate-300" />
                                )}
                            </div>

                            {/* NAME / EMAIL / ROLE */}
                            <div className="min-w-0 flex-1">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {fullName}
                                </h2>

                                <p className="mt-1 break-words text-sm text-slate-500 dark:text-slate-400">
                                    {email}
                                </p>

                                <div className="mt-3 flex flex-wrap items-center gap-2">

                                    {/* ROLE */}
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                                        <ShieldCheck className="h-4 w-4" />
                                        {role}
                                    </span>

                                    {/* STATUS */}
                                    <span
                                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${
                                            isActive
                                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                        }`}
                                    >
                                        <CheckCircle2 className="h-4 w-4" />

                                        {isActive
                                            ? "Active"
                                            : "Inactive"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ==================================================
                    PERSONAL INFORMATION
                ================================================== */}

                <ProfileSection
                    title="Personal Information"
                    description="Your personal account information."
                >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                        <InfoItem
                            icon={UserRound}
                            label="Full Name"
                            value={fullName}
                        />

                        <InfoItem
                            icon={Mail}
                            label="Email Address"
                            value={email}
                        />

                        <InfoItem
                            icon={Phone}
                            label="Phone Number"
                            value={phoneNumber}
                        />

                        <InfoItem
                            icon={ShieldCheck}
                            label="Assigned Role"
                            value={role}
                        />

                    </div>
                </ProfileSection>

                {/* ==================================================
                    ORGANIZATION & TEAM
                ================================================== */}

                <ProfileSection
                    title="Organization & Team"
                    description="Your current organization and team assignment."
                >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                        <InfoItem
                            icon={Building2}
                            label="Organization"
                            value={organization}
                        />

                        <InfoItem
                            icon={UsersRound}
                            label="Team"
                            value={team}
                        />

                    </div>
                </ProfileSection>

                {/* ==================================================
                    ACCOUNT INFORMATION
                ================================================== */}

                <ProfileSection
                    title="Account Information"
                    description="Information about your AI-PMS account."
                >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                        <InfoItem
                            icon={CalendarDays}
                            label="Account Creation Date"
                            value={formatDate(
                                accountCreated
                            )}
                        />

                        <InfoItem
                            icon={Clock3}
                            label="Last Login"
                            value={formatDateTime(
                                lastLogin
                            )}
                        />

                        <InfoItem
                            icon={CheckCircle2}
                            label="Account Status"
                            value={
                                isActive
                                    ? "Active"
                                    : "Inactive"
                            }
                        />

                        <InfoItem
                            icon={ShieldCheck}
                            label="Assigned Role"
                            value={role}
                        />

                    </div>
                </ProfileSection>

                {/* ==================================================
                    PROFILE SECURITY
                ================================================== */}

                <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
                    <div className="flex items-start gap-4 p-6">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700">
                            <LockKeyhole className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                        </div>

                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                Profile Security
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                Your role, permissions, account
                                status, organization, and team
                                information are displayed for
                                review. Profile information is
                                read-only on this page.
                            </p>

                            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                Profile information is displayed
                                for review only. No profile data
                                is modified while viewing this
                                page.
                            </p>
                        </div>

                    </div>
                </section>

            </div>
        </div>
    );
}

