import React, { useEffect, useState } from "react";

import {
    User,
    Mail,
    Phone,
    Shield,
    Camera,
    Lock,
    Eye,
    EyeOff,
    Edit3,
    Save,
    X,
    CheckCircle,
    AlertCircle,
    Loader2,
    UserRound,
    RefreshCw,
    Building2,
    UsersRound,
    CalendarDays,
    Clock3,
} from "lucide-react";

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

import { Button } from "@/components/ui/button";

import {
    getMyProfile,
    updateMyProfile,
    changeMyPassword,
    validateProfileForm,
    validatePasswordForm,
} from "@/services/managerProfileService";


// ============================================================
// DEFAULT FORM VALUES
// ============================================================

const EMPTY_PROFILE_FORM = {
    fullName: "",
    email: "",
    phoneNumber: "",
    profilePicture: "",
};

const EMPTY_PASSWORD_FORM = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
};


// ============================================================
// HELPERS
// ============================================================

const formatDate = (value) => {
    if (!value) return "Not available";

    try {
        return new Date(value).toLocaleDateString();
    } catch {
        return "Not available";
    }
};

const formatDateTime = (value) => {
    if (!value) return "Not available";

    try {
        return new Date(value).toLocaleString();
    } catch {
        return "Not available";
    }
};

const getErrorMessage = (error, fallback = "Something went wrong.") => {
    return (
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.response?.data?.title ||
        error?.message ||
        fallback
    );
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
        <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-4 w-4" />
            </div>

            <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {label}
                </p>

                <p className="mt-1 break-words text-sm font-medium text-foreground">
                    {value || "Not available"}
                </p>
            </div>
        </div>
    );
}


// ============================================================
// SECTION HEADER
// ============================================================

function SectionHeader({
    icon: Icon,
    title,
    description,
}) {
    return (
        <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-4 w-4" />
            </div>

            <div>
                <h3 className="text-base font-semibold text-foreground">
                    {title}
                </h3>

                {description && (
                    <p className="text-xs text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}


// ============================================================
// MANAGER PROFILE PAGE
// ============================================================

export default function Profile() {
    // --------------------------------------------------------
    // PROFILE STATE
    // --------------------------------------------------------

    const [profile, setProfile] = useState(null);

    const [profileForm, setProfileForm] = useState(
        EMPTY_PROFILE_FORM
    );

    const [originalProfileForm, setOriginalProfileForm] =
        useState(EMPTY_PROFILE_FORM);

    // --------------------------------------------------------
    // PAGE STATE
    // --------------------------------------------------------

    const [activeTab, setActiveTab] = useState("profile");

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    // --------------------------------------------------------
    // MESSAGE STATE
    // --------------------------------------------------------

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});

    // --------------------------------------------------------
    // PASSWORD STATE
    // --------------------------------------------------------

    const [passwordForm, setPasswordForm] = useState(
        EMPTY_PASSWORD_FORM
    );

    const [showCurrentPassword, setShowCurrentPassword] =
        useState(false);

    const [showNewPassword, setShowNewPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [passwordSaving, setPasswordSaving] =
        useState(false);

    const [passwordError, setPasswordError] =
        useState("");

    const [passwordSuccess, setPasswordSuccess] =
        useState("");

    const [passwordErrors, setPasswordErrors] =
        useState({});


    // ========================================================
    // LOAD PROFILE
    // ========================================================

    const loadProfile = async ({
        showLoading = true,
        showRefreshing = false,
    } = {}) => {
        try {
            if (showLoading) {
                setLoading(true);
            }

            if (showRefreshing) {
                setRefreshing(true);
            }

            setError("");

            const response = await getMyProfile();

            const data = response?.data || response;

            if (!data) {
                throw new Error("Unable to load your profile.");
            }

            const normalizedProfile = {
                ...data,

                fullName:
                    data.fullName ||
                    data.name ||
                    "",

                email:
                    data.email ||
                    "",

                phoneNumber:
                    data.phoneNumber ||
                    data.phone ||
                    "",

                profilePicture:
                    data.profilePicture ||
                    data.profileImage ||
                    "",

                role:
                    data.role ||
                    data.roleName ||
                    "Manager",

                organization:
                    data.organization ||
                    data.organizationName ||
                    "",

                team:
                    data.team ||
                    data.teamName ||
                    "",

                isActive:
                    data.isActive ??
                    data.active ??
                    true,

                accountCreated:
                    data.accountCreated ||
                    data.createdAt ||
                    data.createdDate ||
                    "",

                lastLogin:
                    data.lastLogin ||
                    data.lastLoginAt ||
                    "",
            };

            setProfile(normalizedProfile);

            const newForm = {
                fullName: normalizedProfile.fullName,
                email: normalizedProfile.email,
                phoneNumber: normalizedProfile.phoneNumber,
                profilePicture: normalizedProfile.profilePicture,
            };

            setProfileForm(newForm);
            setOriginalProfileForm(newForm);

            setIsEditing(false);
            setActiveTab("profile");
        } catch (err) {
            setError(
                getErrorMessage(
                    err,
                    "Unable to load your profile."
                )
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };


    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {
        loadProfile();
    }, []);


    // ========================================================
    // REFRESH
    // ========================================================

    const handleRefresh = async () => {
        if (loading || refreshing || saving || passwordSaving) {
            return;
        }

        setSuccess("");
        setError("");
        setPasswordError("");
        setPasswordSuccess("");

        await loadProfile({
            showLoading: false,
            showRefreshing: true,
        });
    };


    // ========================================================
    // EDIT PROFILE
    // ========================================================

    const handleEdit = () => {
        setError("");
        setSuccess("");
        setFieldErrors({});

        setProfileForm({
            ...originalProfileForm,
        });

        setIsEditing(true);
        setActiveTab("edit");
    };


    // ========================================================
    // CANCEL EDIT
    // ========================================================

    const handleCancel = () => {
        setProfileForm({
            ...originalProfileForm,
        });

        setFieldErrors({});
        setError("");
        setSuccess("");

        setIsEditing(false);
        setActiveTab("profile");
    };


    // ========================================================
    // PROFILE INPUT
    // ========================================================

    const handleProfileChange = (event) => {
        const { name, value } = event.target;

        setProfileForm((previous) => ({
            ...previous,
            [name]: value,
        }));

        setFieldErrors((previous) => ({
            ...previous,
            [name]: "",
        }));

        setError("");
    };


    // ========================================================
    // SAVE PROFILE
    // ========================================================

    const handleSaveProfile = async (event) => {
        event.preventDefault();

        if (saving) return;

        setError("");
        setSuccess("");
        setFieldErrors({});

        try {
            const validation =
                validateProfileForm(profileForm);

            if (validation !== true) {
                if (
                    validation &&
                    typeof validation === "object"
                ) {
                    setFieldErrors(validation);
                } else {
                    setError(
                        typeof validation === "string"
                            ? validation
                            : "Please correct the highlighted fields."
                    );
                }

                return;
            }

            setSaving(true);

            const payload = {
                fullName: profileForm.fullName.trim(),
                email: profileForm.email.trim(),
                phoneNumber:
                    profileForm.phoneNumber?.trim() || "",
                profileImage:
                    profileForm.profilePicture || "",
            };

            const response =
                await updateMyProfile(payload);

            const updatedProfile =
                response?.data || response;

            const mergedProfile = {
                ...profile,
                ...(updatedProfile || {}),

                fullName:
                    updatedProfile?.fullName ||
                    profileForm.fullName,

                email:
                    updatedProfile?.email ||
                    profileForm.email,

                phoneNumber:
                    updatedProfile?.phoneNumber ??
                    profileForm.phoneNumber,

                profilePicture:
                    updatedProfile?.profilePicture ||
                    updatedProfile?.profileImage ||
                    profileForm.profilePicture,
            };

            setProfile(mergedProfile);

            const updatedForm = {
                fullName: mergedProfile.fullName || "",
                email: mergedProfile.email || "",
                phoneNumber:
                    mergedProfile.phoneNumber || "",
                profilePicture:
                    mergedProfile.profilePicture || "",
            };

            setProfileForm(updatedForm);
            setOriginalProfileForm(updatedForm);

            setIsEditing(false);
            setActiveTab("profile");

            setSuccess(
                "Your profile was updated successfully."
            );
        } catch (err) {
            const status = err?.response?.status;

            if (status === 409) {
                setError(
                    "The email address or another profile value is already in use."
                );
            } else if (status === 400) {
                setError(
                    getErrorMessage(
                        err,
                        "Please check your profile information."
                    )
                );
            } else {
                setError(
                    getErrorMessage(
                        err,
                        "Unable to update your profile."
                    )
                );
            }
        } finally {
            setSaving(false);
        }
    };


    // ========================================================
    // PROFILE PICTURE
    // ========================================================

    const handleProfilePictureChange = async (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError("Please select a valid image file.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("Profile image must be smaller than 5 MB.");
            return;
        }

        setError("");
        setSuccess("");

        try {
            const reader = new FileReader();

            reader.onload = async () => {
                const base64Image = reader.result;

                setProfileForm((previous) => ({
                    ...previous,
                    profilePicture: base64Image,
                }));

                try {
                    setSaving(true);

                    const payload = {
                        fullName: profileForm.fullName.trim(),
                        email: profileForm.email.trim(),
                        phoneNumber:
                            profileForm.phoneNumber?.trim() || "",
                        profileImage: base64Image,
                    };

                    const response =
                        await updateMyProfile(payload);

                    const updatedProfile =
                        response?.data || response;

                    const mergedProfile = {
                        ...profile,
                        ...(updatedProfile || {}),
                        profilePicture:
                            updatedProfile?.profilePicture ||
                            updatedProfile?.profileImage ||
                            base64Image,
                    };

                    setProfile(mergedProfile);

                    const updatedForm = {
                        fullName:
                            mergedProfile.fullName ||
                            profileForm.fullName,
                        email:
                            mergedProfile.email ||
                            profileForm.email,
                        phoneNumber:
                            mergedProfile.phoneNumber ||
                            profileForm.phoneNumber,
                        profilePicture:
                            mergedProfile.profilePicture ||
                            base64Image,
                    };

                    setProfileForm(updatedForm);
                    setOriginalProfileForm(updatedForm);

                    setSuccess(
                        "Your profile picture was updated successfully."
                    );
                } catch (err) {
                    setProfileForm((previous) => ({
                        ...previous,
                        profilePicture:
                            originalProfileForm.profilePicture,
                    }));

                    setError(
                        getErrorMessage(
                            err,
                            "Unable to update your profile picture."
                        )
                    );
                } finally {
                    setSaving(false);
                }
            };

            reader.onerror = () => {
                setError(
                    "Unable to read the selected image."
                );
            };

            reader.readAsDataURL(file);
        } catch (err) {
            setError(
                getErrorMessage(
                    err,
                    "Unable to process the profile picture."
                )
            );
        }
    };


    // ========================================================
    // PASSWORD INPUT
    // ========================================================

    const handlePasswordChange = (event) => {
        const { name, value } = event.target;

        setPasswordForm((previous) => ({
            ...previous,
            [name]: value,
        }));

        setPasswordErrors((previous) => ({
            ...previous,
            [name]: "",
        }));

        setPasswordError("");
        setPasswordSuccess("");
    };


    // ========================================================
    // CHANGE PASSWORD
    // ========================================================

    const handleChangePassword = async (event) => {
        event.preventDefault();

        if (passwordSaving) return;

        setPasswordError("");
        setPasswordSuccess("");
        setPasswordErrors({});

        try {
            const validation =
                validatePasswordForm(passwordForm);

            if (validation !== true) {
                if (
                    validation &&
                    typeof validation === "object"
                ) {
                    setPasswordErrors(validation);
                } else {
                    setPasswordError(
                        typeof validation === "string"
                            ? validation
                            : "Please correct the password fields."
                    );
                }

                return;
            }

            setPasswordSaving(true);

            const payload = {
                currentPassword:
                    passwordForm.currentPassword,

                newPassword:
                    passwordForm.newPassword,

                confirmPassword:
                    passwordForm.confirmPassword,
            };

            await changeMyPassword(payload);

            setPasswordForm(EMPTY_PASSWORD_FORM);

            setPasswordSuccess(
                "Your password was changed successfully."
            );
        } catch (err) {
            const status = err?.response?.status;

            if (status === 401) {
                setPasswordError(
                    "Your current password is incorrect."
                );
            } else if (status === 400) {
                setPasswordError(
                    getErrorMessage(
                        err,
                        "Please check your password information."
                    )
                );
            } else {
                setPasswordError(
                    getErrorMessage(
                        err,
                        "Unable to change your password."
                    )
                );
            }
        } finally {
            setPasswordSaving(false);
        }
    };


    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {
        return (
            <div className="min-h-full p-4 md:p-6">
                <div className="flex min-h-[500px] items-center justify-center rounded-2xl border border-border bg-card">
                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                        <Loader2 className="h-7 w-7 animate-spin text-primary" />

                        <p className="text-sm">
                            Loading profile...
                        </p>
                    </div>
                </div>
            </div>
        );
    }


    // ========================================================
    // NO PROFILE
    // ========================================================

    if (!profile) {
        return (
            <div className="min-h-full space-y-6 p-4 md:p-6">

                <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                            <UserRound className="h-6 w-6" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-foreground">
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

                <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="mt-0.5 h-5 w-5 text-destructive" />

                        <div>
                            <h2 className="font-semibold text-foreground">
                                Unable to load profile
                            </h2>

                            <p className="mt-1 text-sm text-muted-foreground">
                                {error ||
                                    "Your profile could not be loaded."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }


    // ========================================================
    // DISPLAY VALUES
    // ========================================================

    const displayName =
        profile.fullName ||
        profileForm.fullName ||
        "Manager";

    const displayEmail =
        profile.email ||
        profileForm.email ||
        "Not available";

    const displayPhone =
        profile.phoneNumber ||
        profileForm.phoneNumber ||
        "Not available";

    const displayRole =
        profile.role ||
        "Manager";

    const displayOrganization =
        profile.organization ||
        "Not available";

    const displayTeam =
        profile.team ||
        "Not available";

    const displayPicture =
        profileForm.profilePicture ||
        profile.profilePicture ||
        "";

    const isActive =
        profile.isActive !== false;


    // ========================================================
    // MAIN PAGE
    // ========================================================

    return (
        <div className="min-h-full space-y-6 p-4 md:p-6">

            {/* ==================================================
                PAGE HEADER
            ================================================== */}

            <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm md:flex-row md:items-center md:justify-between">

                <div className="flex items-center gap-4">

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                        <UserRound className="h-6 w-6" />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-foreground">
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
                    disabled={
                        refreshing ||
                        saving ||
                        passwordSaving
                    }
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
                GLOBAL MESSAGES
            ================================================== */}

            {error && (
                <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4">

                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />

                    <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground">
                            {error}
                        </p>
                    </div>

                </div>
            )}

            {success && (
                <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950/30">

                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />

                    <p className="text-sm font-medium text-green-700 dark:text-green-300">
                        {success}
                    </p>

                </div>
            )}


            {/* ==================================================
                MAIN PROFILE CARD
            ================================================== */}

            <div className="rounded-2xl border border-border bg-card shadow-sm">

                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                >

                    {/* ==================================================
                        TAB NAVIGATION
                    ================================================== */}

                    <div className="border-b border-border px-5 pt-5 md:px-6">

                        <TabsList className="grid w-full max-w-md grid-cols-2">

                            <TabsTrigger value="profile">
                                View Profile
                            </TabsTrigger>

                            <TabsTrigger value="edit">
                                Update Profile
                            </TabsTrigger>

                        </TabsList>

                    </div>


                    {/* ==================================================
                        VIEW PROFILE
                    ================================================== */}

                    <TabsContent
                        value="profile"
                        className="mt-0 p-5 md:p-6"
                    >

                        <div className="space-y-8">

                            {/* PROFILE HEADER */}

                            <div className="flex flex-col gap-5 rounded-xl border border-border bg-muted/20 p-5 md:flex-row md:items-center md:justify-between">

                                <div className="flex items-center gap-4">

                                    <div className="relative">

                                        {displayPicture ? (
                                            <img
                                                src={displayPicture}
                                                alt={displayName}
                                                className="h-20 w-20 rounded-full border-2 border-border object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                                                {displayName
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>
                                        )}

                                    </div>

                                    <div>

                                        <h2 className="text-xl font-semibold text-foreground">
                                            {displayName}
                                        </h2>

                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {displayEmail}
                                        </p>

                                        <div className="mt-2 flex flex-wrap items-center gap-2">

                                            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                                                {displayRole}
                                            </span>

                                            <span
                                                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                                                    isActive
                                                        ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                                                        : "bg-muted text-muted-foreground"
                                                }`}
                                            >
                                                {isActive
                                                    ? "Active"
                                                    : "Inactive"}
                                            </span>

                                        </div>

                                    </div>

                                </div>

                                <Button
                                    onClick={handleEdit}
                                >
                                    <Edit3 className="mr-2 h-4 w-4" />
                                    Edit Profile
                                </Button>

                            </div>


                            {/* PERSONAL INFORMATION */}

                            <section>

                                <SectionHeader
                                    icon={User}
                                    title="Personal Information"
                                    description="Your basic personal contact information."
                                />

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                                    <InfoItem
                                        icon={User}
                                        label="Full Name"
                                        value={displayName}
                                    />

                                    <InfoItem
                                        icon={Mail}
                                        label="Email"
                                        value={displayEmail}
                                    />

                                    <InfoItem
                                        icon={Phone}
                                        label="Phone Number"
                                        value={displayPhone}
                                    />

                                    <InfoItem
                                        icon={Shield}
                                        label="Role"
                                        value={displayRole}
                                    />

                                </div>

                            </section>


                            {/* ORGANIZATION AND TEAM */}

                            <section>

                                <SectionHeader
                                    icon={Building2}
                                    title="Organization & Team"
                                    description="Your current organization and team information."
                                />

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                                    <InfoItem
                                        icon={Building2}
                                        label="Organization"
                                        value={displayOrganization}
                                    />

                                    <InfoItem
                                        icon={UsersRound}
                                        label="Team"
                                        value={displayTeam}
                                    />

                                </div>

                            </section>


                            {/* ACCOUNT INFORMATION */}

                            <section>

                                <SectionHeader
                                    icon={Clock3}
                                    title="Account Information"
                                    description="Information about your account status and activity."
                                />

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                                    <InfoItem
                                        icon={Shield}
                                        label="Account Status"
                                        value={
                                            isActive
                                                ? "Active"
                                                : "Inactive"
                                        }
                                    />

                                    <InfoItem
                                        icon={CalendarDays}
                                        label="Account Created"
                                        value={formatDate(
                                            profile.accountCreated
                                        )}
                                    />

                                    <InfoItem
                                        icon={Clock3}
                                        label="Last Login"
                                        value={formatDateTime(
                                            profile.lastLogin
                                        )}
                                    />

                                </div>

                            </section>


                            {/* SECURITY */}

                            <section>

                                <SectionHeader
                                    icon={Lock}
                                    title="Profile Security"
                                    description="Manage your password and account security."
                                />

                                <div className="rounded-xl border border-border bg-muted/30 p-5">

                                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                                        <div>
                                            <p className="font-medium text-foreground">
                                                Password
                                            </p>

                                            <p className="mt-1 text-sm text-muted-foreground">
                                                Keep your account secure by using a strong password.
                                            </p>
                                        </div>

                                        <Button
                                            variant="outline"
                                            onClick={handleEdit}
                                        >
                                            <Lock className="mr-2 h-4 w-4" />
                                            Manage Security
                                        </Button>

                                    </div>

                                </div>

                            </section>

                        </div>

                    </TabsContent>


                    {/* ==================================================
                        UPDATE PROFILE
                    ================================================== */}

                    <TabsContent
                        value="edit"
                        className="mt-0 p-5 md:p-6"
                    >

                        <div className="space-y-8">

                            {/* UPDATE PROFILE HEADER */}

                            <div className="flex flex-col gap-4 border-b border-border pb-5 md:flex-row md:items-center md:justify-between">

                                <div>

                                    <h2 className="text-xl font-semibold text-foreground">
                                        Update Profile
                                    </h2>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Update your personal information and profile picture.
                                    </p>

                                </div>

                                <div className="flex items-center gap-2">

                                    <Button
                                        variant="outline"
                                        onClick={handleCancel}
                                        disabled={saving}
                                    >
                                        <X className="mr-2 h-4 w-4" />
                                        Cancel
                                    </Button>

                                    {!isEditing && (
                                        <Button
                                            onClick={() =>
                                                setIsEditing(true)
                                            }
                                        >
                                            <Edit3 className="mr-2 h-4 w-4" />
                                            Edit Profile
                                        </Button>
                                    )}

                                </div>

                            </div>


                            {/* PROFILE FORM */}

                            <form
                                onSubmit={handleSaveProfile}
                                className="space-y-6"
                            >

                                {/* PROFILE PICTURE */}

                                <section>

                                    <SectionHeader
                                        icon={Camera}
                                        title="Profile Picture"
                                        description="Choose an image to use as your profile picture."
                                    />

                                    <div className="flex flex-col gap-5 rounded-xl border border-border bg-muted/20 p-5 sm:flex-row sm:items-center">

                                        <div>

                                            {displayPicture ? (
                                                <img
                                                    src={displayPicture}
                                                    alt={displayName}
                                                    className="h-24 w-24 rounded-full border-2 border-border object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground">
                                                    {displayName
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>
                                            )}

                                        </div>

                                        <div>

                                            <label
                                                className={`inline-flex cursor-pointer items-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                                                    !isEditing ||
                                                    saving
                                                        ? "pointer-events-none opacity-50"
                                                        : ""
                                                }`}
                                            >

                                                <Camera className="mr-2 h-4 w-4" />

                                                Change Picture

                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    disabled={
                                                        !isEditing ||
                                                        saving
                                                    }
                                                    onChange={
                                                        handleProfilePictureChange
                                                    }
                                                />

                                            </label>

                                            <p className="mt-2 text-xs text-muted-foreground">
                                                Maximum file size: 5 MB.
                                            </p>

                                        </div>

                                    </div>

                                </section>


                                {/* PERSONAL INFORMATION */}

                                <section>

                                    <SectionHeader
                                        icon={User}
                                        title="Personal Information"
                                        description="Update your personal contact information."
                                    />

                                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                                        {/* FULL NAME */}

                                        <div className="space-y-2">

                                            <label
                                                htmlFor="fullName"
                                                className="text-sm font-medium text-foreground"
                                            >
                                                Full Name
                                            </label>

                                            <div className="relative">

                                                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                                                <input
                                                    id="fullName"
                                                    name="fullName"
                                                    value={
                                                        profileForm.fullName
                                                    }
                                                    onChange={
                                                        handleProfileChange
                                                    }
                                                    disabled={
                                                        !isEditing ||
                                                        saving
                                                    }
                                                    className="h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-60"
                                                    placeholder="Enter your full name"
                                                />

                                            </div>

                                            {fieldErrors.fullName && (
                                                <p className="text-xs text-destructive">
                                                    {
                                                        fieldErrors.fullName
                                                    }
                                                </p>
                                            )}

                                        </div>


                                        {/* EMAIL */}

                                        <div className="space-y-2">

                                            <label
                                                htmlFor="email"
                                                className="text-sm font-medium text-foreground"
                                            >
                                                Email
                                            </label>

                                            <div className="relative">

                                                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                                                <input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    value={
                                                        profileForm.email
                                                    }
                                                    onChange={
                                                        handleProfileChange
                                                    }
                                                    disabled={
                                                        !isEditing ||
                                                        saving
                                                    }
                                                    className="h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-60"
                                                    placeholder="Enter your email"
                                                />

                                            </div>

                                            {fieldErrors.email && (
                                                <p className="text-xs text-destructive">
                                                    {
                                                        fieldErrors.email
                                                    }
                                                </p>
                                            )}

                                        </div>


                                        {/* PHONE */}

                                        <div className="space-y-2">

                                            <label
                                                htmlFor="phoneNumber"
                                                className="text-sm font-medium text-foreground"
                                            >
                                                Phone Number
                                            </label>

                                            <div className="relative">

                                                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                                                <input
                                                    id="phoneNumber"
                                                    name="phoneNumber"
                                                    value={
                                                        profileForm.phoneNumber
                                                    }
                                                    onChange={
                                                        handleProfileChange
                                                    }
                                                    disabled={
                                                        !isEditing ||
                                                        saving
                                                    }
                                                    className="h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-60"
                                                    placeholder="Enter your phone number"
                                                />

                                            </div>

                                            {fieldErrors.phoneNumber && (
                                                <p className="text-xs text-destructive">
                                                    {
                                                        fieldErrors.phoneNumber
                                                    }
                                                </p>
                                            )}

                                        </div>

                                    </div>

                                </section>


                                {/* SAVE BUTTON */}

                                {isEditing && (
                                    <div className="flex justify-end border-t border-border pt-5">

                                        <Button
                                            type="submit"
                                            disabled={saving}
                                        >
                                            {saving ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="mr-2 h-4 w-4" />
                                                    Save Changes
                                                </>
                                            )}
                                        </Button>

                                    </div>
                                )}

                            </form>


                            {/* ==================================================
                                CHANGE PASSWORD
                            ================================================== */}

                            <section className="border-t border-border pt-8">

                                <SectionHeader
                                    icon={Lock}
                                    title="Change Password"
                                    description="Update your password to keep your account secure."
                                />

                                {passwordError && (
                                    <div className="mb-5 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4">

                                        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />

                                        <p className="text-sm text-foreground">
                                            {passwordError}
                                        </p>

                                    </div>
                                )}

                                {passwordSuccess && (
                                    <div className="mb-5 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950/30">

                                        <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />

                                        <p className="text-sm text-green-700 dark:text-green-300">
                                            {passwordSuccess}
                                        </p>

                                    </div>
                                )}

                                <form
                                    onSubmit={
                                        handleChangePassword
                                    }
                                    className="rounded-xl border border-border bg-muted/20 p-5"
                                >

                                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                                        {/* CURRENT PASSWORD */}

                                        <div className="space-y-2 md:col-span-2">

                                            <label
                                                htmlFor="currentPassword"
                                                className="text-sm font-medium text-foreground"
                                            >
                                                Current Password
                                            </label>

                                            <div className="relative">

                                                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                                                <input
                                                    id="currentPassword"
                                                    name="currentPassword"
                                                    type={
                                                        showCurrentPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    value={
                                                        passwordForm.currentPassword
                                                    }
                                                    onChange={
                                                        handlePasswordChange
                                                    }
                                                    disabled={
                                                        passwordSaving
                                                    }
                                                    className="h-10 w-full rounded-md border border-input bg-background pl-10 pr-10 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-60"
                                                    placeholder="Enter current password"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowCurrentPassword(
                                                            (value) =>
                                                                !value
                                                        )
                                                    }
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                    tabIndex={-1}
                                                >
                                                    {showCurrentPassword ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
                                                    )}
                                                </button>

                                            </div>

                                            {passwordErrors.currentPassword && (
                                                <p className="text-xs text-destructive">
                                                    {
                                                        passwordErrors.currentPassword
                                                    }
                                                </p>
                                            )}

                                        </div>


                                        {/* NEW PASSWORD */}

                                        <div className="space-y-2">

                                            <label
                                                htmlFor="newPassword"
                                                className="text-sm font-medium text-foreground"
                                            >
                                                New Password
                                            </label>

                                            <div className="relative">

                                                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                                                <input
                                                    id="newPassword"
                                                    name="newPassword"
                                                    type={
                                                        showNewPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    value={
                                                        passwordForm.newPassword
                                                    }
                                                    onChange={
                                                        handlePasswordChange
                                                    }
                                                    disabled={
                                                        passwordSaving
                                                    }
                                                    className="h-10 w-full rounded-md border border-input bg-background pl-10 pr-10 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-60"
                                                    placeholder="Enter new password"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowNewPassword(
                                                            (value) =>
                                                                !value
                                                        )
                                                    }
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                    tabIndex={-1}
                                                >
                                                    {showNewPassword ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
                                                    )}
                                                </button>

                                            </div>

                                            {passwordErrors.newPassword && (
                                                <p className="text-xs text-destructive">
                                                    {
                                                        passwordErrors.newPassword
                                                    }
                                                </p>
                                            )}

                                        </div>


                                        {/* CONFIRM PASSWORD */}

                                        <div className="space-y-2">

                                            <label
                                                htmlFor="confirmPassword"
                                                className="text-sm font-medium text-foreground"
                                            >
                                                Confirm Password
                                            </label>

                                            <div className="relative">

                                                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                                                <input
                                                    id="confirmPassword"
                                                    name="confirmPassword"
                                                    type={
                                                        showConfirmPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    value={
                                                        passwordForm.confirmPassword
                                                    }
                                                    onChange={
                                                        handlePasswordChange
                                                    }
                                                    disabled={
                                                        passwordSaving
                                                    }
                                                    className="h-10 w-full rounded-md border border-input bg-background pl-10 pr-10 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-60"
                                                    placeholder="Confirm new password"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowConfirmPassword(
                                                            (value) =>
                                                                !value
                                                        )
                                                    }
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                    tabIndex={-1}
                                                >
                                                    {showConfirmPassword ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
                                                    )}
                                                </button>

                                            </div>

                                            {passwordErrors.confirmPassword && (
                                                <p className="text-xs text-destructive">
                                                    {
                                                        passwordErrors.confirmPassword
                                                    }
                                                </p>
                                            )}

                                        </div>

                                    </div>


                                    <div className="mt-5 flex justify-end">

                                        <Button
                                            type="submit"
                                            disabled={passwordSaving}
                                        >
                                            {passwordSaving ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Changing...
                                                </>
                                            ) : (
                                                <>
                                                    <Lock className="mr-2 h-4 w-4" />
                                                    Change Password
                                                </>
                                            )}
                                        </Button>

                                    </div>

                                </form>

                            </section>

                        </div>

                    </TabsContent>

                </Tabs>

            </div>


            {/* ==================================================
                BUSINESS RULE INFORMATION
            ================================================== */}

            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/30">

                <div className="flex items-start gap-3">

                    <Shield className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />

                    <div>

                        <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-200">
                            Profile Information
                        </h3>

                        <p className="mt-1 text-sm text-blue-800 dark:text-blue-300">
                            Keep your profile information accurate so your team and project management activities remain up to date.
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}