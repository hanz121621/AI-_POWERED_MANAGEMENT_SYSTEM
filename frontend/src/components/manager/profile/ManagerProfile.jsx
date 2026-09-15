// ============================================================
// MANAGER PROFILE MANAGEMENT
// PM-PROFILE-001 — View Profile
//
// Manager profile management page.
//
// IMPORTANT
// ------------------------------------------------------------
// - Loads authenticated manager profile from backend
// - View Profile tab displays profile information
// - Update Profile tab uses existing UpdateProfileDialog
// - No role editing
// - No permission editing
// - No organization editing
// - No team editing
// - No hard-coded user information
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
    RefreshCw,
    UserPen,
} from "lucide-react";

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

import { Button } from "@/components/ui/button";

import { getMyProfile } from "@/services/authService";

import UpdateProfileDialog from "./UpdateProfileDialog";

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

function InfoItem({ icon: Icon, label, value }) {
    return (
        <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
            </div>

            <div className="min-w-0">
                <p className="text-sm font-medium text-muted-foreground">
                    {label}
                </p>

                <p className="mt-1 break-words text-sm font-semibold text-foreground">
                    {value || "Not provided"}
                </p>
            </div>
        </div>
    );
}

// ============================================================
// PROFILE SECTION
// ============================================================

function ProfileSection({ title, description, children }) {
    return (
        <section className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
                <h2 className="text-base font-semibold text-foreground">
                    {title}
                </h2>

                {description && (
                    <p className="mt-1 text-sm text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>

            <div className="p-5">{children}</div>
        </section>
    );
}

// ============================================================
// MANAGER PROFILE
// ============================================================

export default function ManagerProfile() {
    // ========================================================
    // STATE
    // ========================================================

    const [profile, setProfile] = useState(null);

    const [loading, setLoading] = useState(true);

    const [refreshing, setRefreshing] = useState(false);

    const [error, setError] = useState("");

    const [activeTab, setActiveTab] = useState("profile");

    const [showUpdateProfile, setShowUpdateProfile] = useState(false);

    // ========================================================
    // LOAD PROFILE
    // ========================================================

    const loadProfile = async ({ isRefresh = false } = {}) => {
        if (isRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        setError("");

        try {
            const result = await getMyProfile();

            if (result) {
                setProfile(result);
            } else {
                setError("Unable to load your profile.");
            }
        } catch (err) {
            console.error(
                "MANAGER PROFILE LOAD ERROR:",
                err
            );

            setError(
                err?.message ||
                    "Unable to load your profile."
            );
        } finally {
            if (isRefresh) {
                setRefreshing(false);
            } else {
                setLoading(false);
            }
        }
    };

    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {
        let mounted = true;

        const loadInitialProfile = async () => {
            setLoading(true);
            setError("");

            try {
                const result = await getMyProfile();

                if (!mounted) {
                    return;
                }

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

        loadInitialProfile();

        return () => {
            mounted = false;
        };
    }, []);

    // ========================================================
    // REFRESH
    // ========================================================

    const handleRefresh = async () => {
        if (loading || refreshing) {
            return;
        }

        await loadProfile({
            isRefresh: true,
        });
    };

    // ========================================================
    // PROFILE UPDATED
    // ========================================================

    const handleProfileUpdated = (updatedProfile) => {
        if (updatedProfile) {
            setProfile(updatedProfile);
        }

        setShowUpdateProfile(false);
        setActiveTab("profile");
    };

    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {
        return (
            <div className="min-h-full p-4 md:p-6">
                <div className="mx-auto w-full max-w-[1800px]">
                    <div className="flex min-h-[500px] items-center justify-center rounded-2xl border border-border bg-card">
                        <div className="flex flex-col items-center gap-3">
                            <RefreshCw className="h-7 w-7 animate-spin text-primary" />

                            <p className="text-sm text-muted-foreground">
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
            <div className="min-h-full p-4 md:p-6">
                <div className="mx-auto w-full max-w-[1800px] space-y-6">

                    {/* PAGE HEADER */}

                    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                                <UserRound className="h-6 w-6" />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                    Profile Management
                                </h1>

                                <p className="text-sm text-muted-foreground">
                                    View and manage your personal profile information.
                                </p>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            onClick={handleRefresh}
                            disabled={refreshing}
                        >
                            <RefreshCw
                                className={`mr-2 h-4 w-4 ${
                                    refreshing
                                        ? "animate-spin"
                                        : ""
                                }`}
                            />

                            Refresh
                        </Button>
                    </div>

                    {/* ERROR CARD */}

                    <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />

                            <div>
                                <h2 className="font-semibold text-foreground">
                                    Unable to load profile
                                </h2>

                                <p className="mt-1 text-sm text-muted-foreground">
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
        (
            typeof profile.organization === "string"
                ? profile.organization
                : profile.organization?.name
        ) ||
        "Not assigned";

    const team =
        profile.teamName ||
        (
            typeof profile.team === "string"
                ? profile.team
                : profile.team?.name
        ) ||
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
    // MAIN PAGE
    // ========================================================

    return (
        <div className="min-h-full space-y-6 p-4 md:p-6">
            <div className="mx-auto w-full max-w-[1800px] space-y-6">

                {/* ==================================================
                    PAGE HEADER
                ================================================== */}

                <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm md:flex-row md:items-center md:justify-between">

                    <div className="flex items-center gap-4">

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                            <UserRound className="h-6 w-6" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                Profile Management
                            </h1>

                            <p className="text-sm text-muted-foreground">
                                View and manage your personal profile information.
                            </p>
                        </div>

                    </div>

                    {/* REFRESH */}

                    <Button
                        variant="outline"
                        onClick={handleRefresh}
                        disabled={refreshing}
                    >
                        <RefreshCw
                            className={`mr-2 h-4 w-4 ${
                                refreshing
                                    ? "animate-spin"
                                    : ""
                            }`}
                        />

                        Refresh
                    </Button>

                </div>

                {/* ==================================================
                    MAIN PROFILE CARD
                ================================================== */}

                <div className="rounded-2xl border border-border bg-card shadow-sm">

                    <Tabs
                        value={activeTab}
                        onValueChange={(value) => {
                            setActiveTab(value);

                            if (value === "profile") {
                                setShowUpdateProfile(false);
                            }

                            if (value === "update") {
                                setShowUpdateProfile(true);
                            }
                        }}
                        className="w-full"
                    >

                        {/* ==================================================
                            TABS
                        ================================================== */}

                        <div className="border-b border-border px-5 pt-5 md:px-6">

                            <TabsList className="grid w-full max-w-md grid-cols-2">

                                <TabsTrigger value="profile">
                                    View Profile
                                </TabsTrigger>

                                <TabsTrigger value="update">
                                    <UserPen className="mr-2 h-4 w-4" />
                                    Update Profile
                                </TabsTrigger>

                            </TabsList>

                        </div>

                        {/* ==================================================
                            VIEW PROFILE TAB
                        ================================================== */}

                        <TabsContent
                            value="profile"
                            className="mt-0 p-5 md:p-6"
                        >

                            <div className="space-y-6">

                                {/* PROFILE HEADER */}

                                <div className="flex flex-col gap-5 rounded-xl border border-border bg-muted/30 p-5 sm:flex-row sm:items-center">

                                    {/* PROFILE IMAGE */}

                                    <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted ring-4 ring-background">

                                        {profile.profileImage ? (
                                            <img
                                                src={profile.profileImage}
                                                alt={fullName}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <UserRound className="h-11 w-11 text-muted-foreground" />
                                        )}

                                    </div>

                                    {/* NAME */}

                                    <div className="min-w-0 flex-1">

                                        <h2 className="text-2xl font-bold text-foreground">
                                            {fullName}
                                        </h2>

                                        <p className="mt-1 break-words text-sm text-muted-foreground">
                                            {email}
                                        </p>

                                        <div className="mt-3 flex flex-wrap items-center gap-2">

                                            {/* ROLE */}

                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">

                                                <ShieldCheck className="h-4 w-4" />

                                                {role}

                                            </span>

                                            {/* STATUS */}

                                            <span
                                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${
                                                    isActive
                                                        ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                                                        : "bg-muted text-muted-foreground"
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

                                {/* PERSONAL INFORMATION */}

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

                                {/* ORGANIZATION & TEAM */}

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

                            </div>

                        </TabsContent>

                        {/* ==================================================
                            UPDATE PROFILE TAB
                        ================================================== */}

                        <TabsContent
                            value="update"
                            className="mt-0 p-5 md:p-6"
                        >

                            <div className="space-y-6">

                                <ProfileSection
                                    title="Update Profile"
                                    description="Update your personal profile information."
                                >

                                    <UpdateProfileDialog
                                        profile={profile}
                                        open={showUpdateProfile}
                                        onOpenChange={(open) => {
                                            setShowUpdateProfile(open);

                                            if (!open) {
                                                setActiveTab("profile");
                                            }
                                        }}
                                        onSuccess={handleProfileUpdated}
                                        embedded
                                    />

                                </ProfileSection>

                            </div>

                        </TabsContent>

                    </Tabs>

                </div>

                {/* ==================================================
                    BUSINESS RULE
                ================================================== */}

                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">

                    <div className="flex items-start gap-3">

                        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                        <div>

                            <h3 className="text-sm font-semibold text-foreground">
                                Profile Information
                            </h3>

                            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                Profile information is loaded from
                                the authenticated manager account.
                                Role, permissions, organization, and
                                team assignments are controlled by
                                the system.
                            </p>

                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}