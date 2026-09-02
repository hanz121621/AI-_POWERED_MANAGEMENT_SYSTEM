// ============================================================
// MANAGER PROFILE
//
// PM-PROFILE-001 — Update Profile
//
// Project Manager can:
//   - View their own profile
//   - Update full name
//   - Update email
//   - Update phone number
//   - Update profile picture
//   - Change password
//
// IMPORTANT
// ------------------------------------------------------------
// This component does NOT use:
//   - localStorage
//   - sessionStorage
//   - hard-coded user IDs
//   - hard-coded user information
//
// Authentication is supplied by the existing auth context.
//
// The backend is responsible for:
//   - authentication
//   - authorization
//   - identifying the current user
//   - email uniqueness
//   - password policy
//   - role/permission protection
// ============================================================

import { useEffect, useState } from "react";

import {
    User,
    Mail,
    Phone,
    ShieldCheck,
    Lock,
    Camera,
    Save,
    KeyRound,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Eye,
    EyeOff,
    UserRound,
} from "lucide-react";

import {
    getMyProfile,
    updateMyProfile,
    changeMyPassword,
    updateMyProfilePicture,
    validateProfileForm,
    validatePasswordForm,
} from "@/services/profileService";

// ============================================================
// AUTH CONTEXT
// ============================================================
//
// IMPORTANT:
// If your project uses a different auth context path/name,
// change ONLY this import.
//
// Expected context:
//
// {
//     accessToken
// }
//
// ============================================================

import { useAuth } from "@/contexts/AuthContext";

// ============================================================
// PROFILE PAGE
// ============================================================

const Profile = () => {
    // ========================================================
    // AUTHENTICATION
    // ========================================================

    const {
        accessToken,
    } = useAuth();

    // ========================================================
    // PROFILE STATE
    // ========================================================

    const [
        profile,
        setProfile,
    ] = useState(null);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        saving,
        setSaving,
    ] = useState(false);

    const [
        profileError,
        setProfileError,
    ] = useState("");

    const [
        successMessage,
        setSuccessMessage,
    ] = useState("");

    // ========================================================
    // FORM STATE
    // ========================================================

    const [
        formData,
        setFormData,
    ] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        profilePicture: null,
    });

    const [
        formErrors,
        setFormErrors,
    ] = useState({});

    // ========================================================
    // PASSWORD STATE
    // ========================================================

    const [
        showCurrentPassword,
        setShowCurrentPassword,
    ] = useState(false);

    const [
        showNewPassword,
        setShowNewPassword,
    ] = useState(false);

    const [
        showConfirmPassword,
        setShowConfirmPassword,
    ] = useState(false);

    const [
        passwordForm,
        setPasswordForm,
    ] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [
        passwordErrors,
        setPasswordErrors,
    ] = useState({});

    const [
        changingPassword,
        setChangingPassword,
    ] = useState(false);

    const [
        passwordMessage,
        setPasswordMessage,
    ] = useState("");

    const [
        passwordError,
        setPasswordError,
    ] = useState("");

    // ========================================================
    // PROFILE PICTURE STATE
    // ========================================================

    const [
        uploadingPicture,
        setUploadingPicture,
    ] = useState(false);

    const [
        pictureInputKey,
        setPictureInputKey,
    ] = useState(0);

    // ========================================================
    // LOAD PROFILE
    // ========================================================

    useEffect(() => {
        let cancelled = false;

        const loadProfile = async () => {
            if (!accessToken) {
                setLoading(false);

                setProfileError(
                    "Authentication is required to load your profile."
                );

                return;
            }

            setLoading(true);
            setProfileError("");
            setSuccessMessage("");

            const result =
                await getMyProfile(
                    accessToken
                );

            if (cancelled) {
                return;
            }

            if (!result.success) {
                setProfileError(
                    result.message ||
                    "Unable to load your profile."
                );

                setLoading(false);

                return;
            }

            const currentProfile =
                result.profile ||
                result.data;

            setProfile(
                currentProfile
            );

            setFormData({
                fullName:
                    currentProfile?.fullName ||
                    "",

                email:
                    currentProfile?.email ||
                    "",

                phoneNumber:
                    currentProfile?.phoneNumber ||
                    "",

                profilePicture:
                    currentProfile?.profilePicture ||
                    null,
            });

            setLoading(false);
        };

        loadProfile();

        return () => {
            cancelled = true;
        };
    }, [accessToken]);

    // ========================================================
    // FORM CHANGE
    // ========================================================

    const handleChange = (
        event
    ) => {
        const {
            name,
            value,
        } = event.target;

        setFormData(
            (previous) => ({
                ...previous,
                [name]: value,
            })
        );

        setFormErrors(
            (previous) => ({
                ...previous,
                [name]: "",
            })
        );

        setSuccessMessage("");
        setProfileError("");
    };

    // ========================================================
    // PASSWORD CHANGE
    // ========================================================

    const handlePasswordChange = (
        event
    ) => {
        const {
            name,
            value,
        } = event.target;

        setPasswordForm(
            (previous) => ({
                ...previous,
                [name]: value,
            })
        );

        setPasswordErrors(
            (previous) => ({
                ...previous,
                [name]: "",
            })
        );

        setPasswordError("");
        setPasswordMessage("");
    };

    // ========================================================
    // UPDATE PROFILE
    // ========================================================

    const handleSubmit = async (
        event
    ) => {
        event.preventDefault();

        setSuccessMessage("");
        setProfileError("");

        // ----------------------------------------------------
        // FRONTEND VALIDATION
        // ----------------------------------------------------

        const validation =
            validateProfileForm(
                formData
            );

        if (!validation.valid) {
            setFormErrors(
                validation.errors
            );

            return;
        }

        if (!accessToken) {
            setProfileError(
                "Authentication is required."
            );

            return;
        }

        // ----------------------------------------------------
        // SAVE
        // ----------------------------------------------------

        setSaving(true);

        try {
            const result =
                await updateMyProfile(
                    formData,
                    accessToken
                );

            if (!result.success) {
                setProfileError(
                    result.message ||
                    "Unable to update your profile."
                );

                return;
            }

            const updatedProfile =
                result.profile ||
                result.data;

            if (updatedProfile) {
                setProfile(
                    updatedProfile
                );

                setFormData({
                    fullName:
                        updatedProfile.fullName ||
                        "",

                    email:
                        updatedProfile.email ||
                        "",

                    phoneNumber:
                        updatedProfile.phoneNumber ||
                        "",

                    profilePicture:
                        updatedProfile.profilePicture ||
                        null,
                });
            }

            setSuccessMessage(
                result.message ||
                "Profile updated successfully."
            );
        } catch (error) {
            console.error(
                "Profile update failed:",
                error
            );

            setProfileError(
                "Unable to update your profile."
            );
        } finally {
            setSaving(false);
        }
    };

    // ========================================================
    // CHANGE PASSWORD
    // ========================================================

    const handlePasswordSubmit = async (
        event
    ) => {
        event.preventDefault();

        setPasswordMessage("");
        setPasswordError("");

        // ----------------------------------------------------
        // FRONTEND VALIDATION
        // ----------------------------------------------------

        const validation =
            validatePasswordForm(
                passwordForm.currentPassword,
                passwordForm.newPassword,
                passwordForm.confirmPassword
            );

        if (!validation.valid) {
            setPasswordErrors(
                validation.errors
            );

            return;
        }

        if (!accessToken) {
            setPasswordError(
                "Authentication is required."
            );

            return;
        }

        // ----------------------------------------------------
        // CHANGE PASSWORD
        // ----------------------------------------------------

        setChangingPassword(true);

        try {
            const result =
                await changeMyPassword(
                    passwordForm.currentPassword,
                    passwordForm.newPassword,
                    accessToken
                );

            if (!result.success) {
                setPasswordError(
                    result.message ||
                    "Unable to change your password."
                );

                return;
            }

            setPasswordForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });

            setPasswordErrors({});

            setPasswordMessage(
                result.message ||
                "Password updated successfully."
            );
        } catch (error) {
            console.error(
                "Password change failed:",
                error
            );

            setPasswordError(
                "Unable to change your password."
            );
        } finally {
            setChangingPassword(false);
        }
    };

    // ========================================================
    // PROFILE PICTURE
    // ========================================================

    const handlePictureChange = async (
        event
    ) => {
        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }

        setProfileError("");
        setSuccessMessage("");

        // ----------------------------------------------------
        // BASIC FILE VALIDATION
        // ----------------------------------------------------

        if (
            !file.type.startsWith(
                "image/"
            )
        ) {
            setProfileError(
                "Please select a valid image file."
            );

            setPictureInputKey(
                (value) => value + 1
            );

            return;
        }

        // ----------------------------------------------------
        // FILE SIZE
        // ----------------------------------------------------

        const maxSize =
            5 * 1024 * 1024;

        if (file.size > maxSize) {
            setProfileError(
                "Profile picture must be smaller than 5 MB."
            );

            setPictureInputKey(
                (value) => value + 1
            );

            return;
        }

        // ----------------------------------------------------
        // CONVERT FILE TO DATA URL
        //
        // This does not store anything in localStorage.
        //
        // The backend should ideally provide a dedicated
        // multipart upload endpoint. This implementation
        // sends the resulting image value through the
        // profile-picture service.
        // ----------------------------------------------------

        const reader =
            new FileReader();

        reader.onload = async () => {
            try {
                setUploadingPicture(
                    true
                );

                const result =
                    await updateMyProfilePicture(
                        reader.result,
                        accessToken
                    );

                if (!result.success) {
                    setProfileError(
                        result.message ||
                        "Unable to update your profile picture."
                    );

                    return;
                }

                const updatedProfile =
                    result.profile ||
                    result.data;

                if (
                    updatedProfile
                ) {
                    setProfile(
                        updatedProfile
                    );

                    setFormData(
                        (previous) => ({
                            ...previous,

                            profilePicture:
                                updatedProfile.profilePicture ||
                                previous.profilePicture,
                        })
                    );
                }

                setSuccessMessage(
                    result.message ||
                    "Profile picture updated successfully."
                );
            } catch (error) {
                console.error(
                    "Profile picture update failed:",
                    error
                );

                setProfileError(
                    "Unable to update your profile picture."
                );
            } finally {
                setUploadingPicture(
                    false
                );

                setPictureInputKey(
                    (value) => value + 1
                );
            }
        };

        reader.onerror = () => {
            setProfileError(
                "Unable to read the selected image."
            );

            setUploadingPicture(
                false
            );

            setPictureInputKey(
                (value) => value + 1
            );
        };

        reader.readAsDataURL(file);
    };

    // ========================================================
    // PROFILE INITIALS
    // ========================================================

    const getInitials = (
        name
    ) => {
        if (!name) {
            return "U";
        }

        return name
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map(
                (part) =>
                    part
                        .charAt(0)
                        .toUpperCase()
            )
            .join("");
    };

    // ========================================================
    // LOADING STATE
    // ========================================================

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 text-white">
                <div className="flex min-h-screen items-center justify-center">
                    <div className="flex items-center gap-3 text-slate-300">
                        <Loader2
                            className="h-6 w-6 animate-spin"
                        />

                        <span>
                            Loading profile...
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    // ========================================================
    // ERROR WITHOUT PROFILE
    // ========================================================

    if (
        !profile &&
        profileError
    ) {
        return (
            <div className="min-h-screen bg-slate-950 p-6 text-white">
                <div className="mx-auto max-w-4xl">
                    <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="mt-0.5 h-5 w-5 text-red-400" />

                            <div>
                                <h2 className="font-semibold text-red-300">
                                    Unable to load profile
                                </h2>

                                <p className="mt-1 text-sm text-red-200/80">
                                    {profileError}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ========================================================
    // PROFILE PICTURE
    // ========================================================

    const profilePicture =
        formData.profilePicture;

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">

                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="mb-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10">
                            <UserRound className="h-6 w-6 text-blue-400" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold">
                                My Profile
                            </h1>

                            <p className="mt-1 text-sm text-slate-400">
                                View and update your personal account information.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ==================================================
                    GLOBAL SUCCESS MESSAGE
                ================================================== */}

                {successMessage && (
                    <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 text-emerald-400" />

                            <p className="text-sm text-emerald-300">
                                {successMessage}
                            </p>
                        </div>
                    </div>
                )}

                {/* ==================================================
                    GLOBAL ERROR MESSAGE
                ================================================== */}

                {profileError && (
                    <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="h-5 w-5 text-red-400" />

                            <p className="text-sm text-red-300">
                                {profileError}
                            </p>
                        </div>
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-[320px_1fr]">

                    {/* ==================================================
                        PROFILE SUMMARY
                    ================================================== */}

                    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">

                        <div className="flex flex-col items-center text-center">

                            {/* PROFILE IMAGE */}

                            <div className="relative">

                                {profilePicture ? (
                                    <img
                                        src={profilePicture}
                                        alt="Profile"
                                        className="h-32 w-32 rounded-full border-4 border-slate-800 object-cover"
                                    />
                                ) : (
                                    <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-slate-800 bg-slate-800 text-3xl font-bold text-slate-300">
                                        {getInitials(
                                            formData.fullName
                                        )}
                                    </div>
                                )}

                                <label
                                    htmlFor="profile-picture"
                                    className="absolute bottom-1 right-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-4 border-slate-900 bg-blue-600 text-white shadow-lg transition hover:bg-blue-500"
                                >
                                    {uploadingPicture ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Camera className="h-4 w-4" />
                                    )}
                                </label>

                                <input
                                    key={pictureInputKey}
                                    id="profile-picture"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={
                                        handlePictureChange
                                    }
                                    disabled={
                                        uploadingPicture
                                    }
                                />
                            </div>

                            {/* NAME */}

                            <h2 className="mt-5 text-xl font-semibold">
                                {formData.fullName ||
                                    "Manager"}
                            </h2>

                            {/* EMAIL */}

                            <p className="mt-1 break-all text-sm text-slate-400">
                                {formData.email ||
                                    "No email available"}
                            </p>

                            {/* ROLE */}

                            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2">
                                <ShieldCheck className="h-4 w-4 text-blue-400" />

                                <span className="text-sm font-medium text-blue-300">
                                    {profile?.role ||
                                        "Manager"}
                                </span>
                            </div>

                            {/* ROLE PROTECTION */}

                            <div className="mt-6 w-full rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-left">
                                <div className="flex items-start gap-3">
                                    <Lock className="mt-0.5 h-4 w-4 text-slate-500" />

                                    <div>
                                        <p className="text-sm font-medium text-slate-300">
                                            Role & permissions
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-slate-500">
                                            Your role and permissions are managed by the authorized administrative process and cannot be changed from your profile.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* PICTURE INFO */}

                            <p className="mt-4 text-xs text-slate-500">
                                Click the camera icon to update your profile picture.
                            </p>
                        </div>
                    </div>

                    {/* ==================================================
                        RIGHT SIDE
                    ================================================== */}

                    <div className="space-y-6">

                        {/* ==================================================
                            PERSONAL INFORMATION
                        ================================================== */}

                        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">

                            <div className="mb-6">
                                <h2 className="text-lg font-semibold">
                                    Personal Information
                                </h2>

                                <p className="mt-1 text-sm text-slate-400">
                                    Update the personal information associated with your account.
                                </p>
                            </div>

                            <form
                                onSubmit={
                                    handleSubmit
                                }
                            >
                                <div className="grid gap-5 md:grid-cols-2">

                                    {/* FULL NAME */}

                                    <div className="md:col-span-2">
                                        <label
                                            htmlFor="fullName"
                                            className="mb-2 block text-sm font-medium text-slate-300"
                                        >
                                            Full Name
                                        </label>

                                        <div className="relative">
                                            <User className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                                            <input
                                                id="fullName"
                                                name="fullName"
                                                type="text"
                                                value={
                                                    formData.fullName
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                className={`w-full rounded-xl border bg-slate-950 px-10 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 ${
                                                    formErrors.fullName
                                                        ? "border-red-500/70"
                                                        : "border-slate-700"
                                                }`}
                                                placeholder="Enter your full name"
                                                autoComplete="name"
                                            />
                                        </div>

                                        {formErrors.fullName && (
                                            <p className="mt-1.5 text-xs text-red-400">
                                                {
                                                    formErrors.fullName
                                                }
                                            </p>
                                        )}
                                    </div>

                                    {/* EMAIL */}

                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="mb-2 block text-sm font-medium text-slate-300"
                                        >
                                            Email Address
                                        </label>

                                        <div className="relative">
                                            <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={
                                                    formData.email
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                className={`w-full rounded-xl border bg-slate-950 px-10 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 ${
                                                    formErrors.email
                                                        ? "border-red-500/70"
                                                        : "border-slate-700"
                                                }`}
                                                placeholder="you@example.com"
                                                autoComplete="email"
                                            />
                                        </div>

                                        {formErrors.email && (
                                            <p className="mt-1.5 text-xs text-red-400">
                                                {
                                                    formErrors.email
                                                }
                                            </p>
                                        )}
                                    </div>

                                    {/* PHONE */}

                                    <div>
                                        <label
                                            htmlFor="phoneNumber"
                                            className="mb-2 block text-sm font-medium text-slate-300"
                                        >
                                            Phone Number
                                        </label>

                                        <div className="relative">
                                            <Phone className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                                            <input
                                                id="phoneNumber"
                                                name="phoneNumber"
                                                type="tel"
                                                value={
                                                    formData.phoneNumber
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                className={`w-full rounded-xl border bg-slate-950 px-10 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 ${
                                                    formErrors.phoneNumber
                                                        ? "border-red-500/70"
                                                        : "border-slate-700"
                                                }`}
                                                placeholder="Enter your phone number"
                                                autoComplete="tel"
                                            />
                                        </div>

                                        {formErrors.phoneNumber && (
                                            <p className="mt-1.5 text-xs text-red-400">
                                                {
                                                    formErrors.phoneNumber
                                                }
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* ROLE READ ONLY */}

                                <div className="mt-5">
                                    <label
                                        htmlFor="role"
                                        className="mb-2 block text-sm font-medium text-slate-300"
                                    >
                                        Role
                                    </label>

                                    <div className="relative">
                                        <ShieldCheck className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-600" />

                                        <input
                                            id="role"
                                            type="text"
                                            value={
                                                profile?.role ||
                                                "Manager"
                                            }
                                            disabled
                                            readOnly
                                            className="w-full cursor-not-allowed rounded-xl border border-slate-800 bg-slate-950/60 px-10 py-3 text-sm text-slate-500"
                                        />
                                    </div>

                                    <p className="mt-1.5 text-xs text-slate-500">
                                        Role changes are not allowed from the profile page.
                                    </p>
                                </div>

                                {/* SAVE */}

                                <div className="mt-6 flex justify-end border-t border-slate-800 pt-5">
                                    <button
                                        type="submit"
                                        disabled={
                                            saving
                                        }
                                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {saving ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />

                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-4 w-4" />

                                                Save Changes
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* ==================================================
                            CHANGE PASSWORD
                        ================================================== */}

                        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">

                            <div className="mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
                                        <KeyRound className="h-5 w-5 text-amber-400" />
                                    </div>

                                    <div>
                                        <h2 className="text-lg font-semibold">
                                            Change Password
                                        </h2>

                                        <p className="mt-1 text-sm text-slate-400">
                                            Update your account password securely.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* PASSWORD SUCCESS */}

                            {passwordMessage && (
                                <div className="mb-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />

                                        <p className="text-sm text-emerald-300">
                                            {
                                                passwordMessage
                                            }
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* PASSWORD ERROR */}

                            {passwordError && (
                                <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                                    <div className="flex items-center gap-3">
                                        <AlertCircle className="h-5 w-5 text-red-400" />

                                        <p className="text-sm text-red-300">
                                            {
                                                passwordError
                                            }
                                        </p>
                                    </div>
                                </div>
                            )}

                            <form
                                onSubmit={
                                    handlePasswordSubmit
                                }
                            >
                                <div className="space-y-5">

                                    {/* CURRENT PASSWORD */}

                                    <div>
                                        <label
                                            htmlFor="currentPassword"
                                            className="mb-2 block text-sm font-medium text-slate-300"
                                        >
                                            Current Password
                                        </label>

                                        <div className="relative">
                                            <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

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
                                                className={`w-full rounded-xl border bg-slate-950 px-10 py-3 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 ${
                                                    passwordErrors.currentPassword
                                                        ? "border-red-500/70"
                                                        : "border-slate-700"
                                                }`}
                                                placeholder="Enter current password"
                                                autoComplete="current-password"
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowCurrentPassword(
                                                        (value) =>
                                                            !value
                                                    )
                                                }
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-300"
                                                aria-label={
                                                    showCurrentPassword
                                                        ? "Hide current password"
                                                        : "Show current password"
                                                }
                                            >
                                                {showCurrentPassword ? (
                                                    <EyeOff className="h-5 w-5" />
                                                ) : (
                                                    <Eye className="h-5 w-5" />
                                                )}
                                            </button>
                                        </div>

                                        {passwordErrors.currentPassword && (
                                            <p className="mt-1.5 text-xs text-red-400">
                                                {
                                                    passwordErrors.currentPassword
                                                }
                                            </p>
                                        )}
                                    </div>

                                    {/* NEW PASSWORD */}

                                    <div>
                                        <label
                                            htmlFor="newPassword"
                                            className="mb-2 block text-sm font-medium text-slate-300"
                                        >
                                            New Password
                                        </label>

                                        <div className="relative">
                                            <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

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
                                                className={`w-full rounded-xl border bg-slate-950 px-10 py-3 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 ${
                                                    passwordErrors.newPassword
                                                        ? "border-red-500/70"
                                                        : "border-slate-700"
                                                }`}
                                                placeholder="Enter new password"
                                                autoComplete="new-password"
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowNewPassword(
                                                        (value) =>
                                                            !value
                                                    )
                                                }
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-300"
                                                aria-label={
                                                    showNewPassword
                                                        ? "Hide new password"
                                                        : "Show new password"
                                                }
                                            >
                                                {showNewPassword ? (
                                                    <EyeOff className="h-5 w-5" />
                                                ) : (
                                                    <Eye className="h-5 w-5" />
                                                )}
                                            </button>
                                        </div>

                                        {passwordErrors.newPassword && (
                                            <p className="mt-1.5 text-xs text-red-400">
                                                {
                                                    passwordErrors.newPassword
                                                }
                                            </p>
                                        )}
                                    </div>

                                    {/* CONFIRM PASSWORD */}

                                    <div>
                                        <label
                                            htmlFor="confirmPassword"
                                            className="mb-2 block text-sm font-medium text-slate-300"
                                        >
                                            Confirm New Password
                                        </label>

                                        <div className="relative">
                                            <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

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
                                                className={`w-full rounded-xl border bg-slate-950 px-10 py-3 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 ${
                                                    passwordErrors.confirmPassword
                                                        ? "border-red-500/70"
                                                        : "border-slate-700"
                                                }`}
                                                placeholder="Confirm new password"
                                                autoComplete="new-password"
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowConfirmPassword(
                                                        (value) =>
                                                            !value
                                                    )
                                                }
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-300"
                                                aria-label={
                                                    showConfirmPassword
                                                        ? "Hide password confirmation"
                                                        : "Show password confirmation"
                                                }
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff className="h-5 w-5" />
                                                ) : (
                                                    <Eye className="h-5 w-5" />
                                                )}
                                            </button>
                                        </div>

                                        {passwordErrors.confirmPassword && (
                                            <p className="mt-1.5 text-xs text-red-400">
                                                {
                                                    passwordErrors.confirmPassword
                                                }
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* PASSWORD POLICY NOTICE */}

                                <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                                    <div className="flex items-start gap-3">
                                        <ShieldCheck className="mt-0.5 h-5 w-5 text-slate-500" />

                                        <div>
                                            <p className="text-sm font-medium text-slate-300">
                                                Password security
                                            </p>

                                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                                Your new password must satisfy the password policy configured by the system. The server performs the final validation.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* PASSWORD BUTTON */}

                                <div className="mt-6 flex justify-end border-t border-slate-800 pt-5">
                                    <button
                                        type="submit"
                                        disabled={
                                            changingPassword
                                        }
                                        className="inline-flex items-center gap-2 rounded-xl bg-slate-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {changingPassword ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />

                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <KeyRound className="h-4 w-4" />

                                                Change Password
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;