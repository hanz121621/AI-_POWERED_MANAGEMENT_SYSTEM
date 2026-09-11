
import { useState } from "react";

import {
    UserRound,
    Mail,
    Phone,
    BriefcaseBusiness,
    UsersRound,
    ShieldCheck,
    LockKeyhole,
    Save,
    X,
    Eye,
    EyeOff,
    AlertCircle,
    CheckCircle2,
} from "lucide-react";

import api from "@/services/api";

// ============================================================
// STORAGE
// ============================================================

const getStoredUser = () => {
    try {
        const user =
            localStorage.getItem("user") ||
            localStorage.getItem("currentUser");

        return user ? JSON.parse(user) : null;
    } catch {
        return null;
    }
};

// ============================================================
// INITIAL FORM DATA
// ============================================================

const getInitialFormData = () => {
    const user = getStoredUser();

    return {
        fullName: user?.fullName || user?.name || "",
        email: user?.email || "",
        phone:
            user?.phoneNumber ||
            user?.phone ||
            "",
        department:
            user?.department ||
            user?.Department ||
            "",
        team:
            user?.team ||
            user?.Team ||
            "",
        skills:
            user?.skills ||
            user?.Skills ||
            "",
        bio: user?.bio || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    };
};

// ============================================================
// RESPONSE USER EXTRACTION
// ============================================================

const extractUser = (response, fallbackUser) => {
    const data = response?.data;

    const candidate =
        data?.user ||
        data?.User ||
        data?.data ||
        data?.Data ||
        data;

    if (
        candidate &&
        typeof candidate === "object" &&
        !Array.isArray(candidate)
    ) {
        return {
            ...fallbackUser,
            ...candidate,
        };
    }

    return fallbackUser;
};

// ============================================================
// COMPONENT
// ============================================================

export default function UpdateTeamLeaderProfile({
    onCancel,
    onSuccess,
}) {
    const initialUser = getStoredUser();

    const [formData, setFormData] = useState(getInitialFormData);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState(
        initialUser ? "" : "Profile not found."
    );

    const [success, setSuccess] = useState("");

    const [showCurrentPassword, setShowCurrentPassword] =
        useState(false);

    const [showNewPassword, setShowNewPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    // ============================================================
    // HANDLE INPUT
    // ============================================================

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setError("");
        setSuccess("");
    };

    // ============================================================
    // VALIDATION
    // ============================================================

    const validateForm = () => {
        if (!formData.fullName.trim()) {
            return "Please enter your full name.";
        }

        if (!formData.email.trim()) {
            return "Please enter your email address.";
        }

        if (formData.newPassword || formData.confirmPassword) {
            if (!formData.currentPassword) {
                return "Please enter your current password.";
            }

            if (formData.newPassword.length < 8) {
                return "Password must contain at least 8 characters.";
            }

            if (formData.newPassword !== formData.confirmPassword) {
                return "New password and confirmation password do not match.";
            }

            return "Password changes must be completed through the Change Password feature.";
        }

        return "";
    };

    // ============================================================
    // SAVE PROFILE
    // ============================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        const validationError = validateForm();

        if (validationError) {
            setError(validationError);
            return;
        }

        const storedUser = getStoredUser();

        if (!storedUser) {
            setError("Profile not found. Please log in again.");
            return;
        }

        setLoading(true);

        try {
            // ====================================================
            // BACKEND PROFILE DTO
            // ====================================================

            const payload = {
                fullName: formData.fullName.trim(),
                email: formData.email.trim(),
                phoneNumber: formData.phone.trim(),
                bio: formData.bio.trim(),
            };

            const response = await api.put(
                "/Users/profile",
                payload
            );

            // ====================================================
            // UPDATE LOCAL USER CACHE
            // ====================================================

            const backendUser = extractUser(
                response,
                storedUser
            );

            const updatedUser = {
                ...storedUser,
                ...backendUser,

                fullName:
                    backendUser.fullName ||
                    formData.fullName,

                name:
                    backendUser.fullName ||
                    formData.fullName,

                email:
                    backendUser.email ||
                    formData.email,

                phoneNumber:
                    backendUser.phoneNumber ||
                    formData.phone,

                phone:
                    backendUser.phoneNumber ||
                    backendUser.phone ||
                    formData.phone,

                bio:
                    backendUser.bio ??
                    formData.bio,

                updatedAt: new Date().toISOString(),
            };

            localStorage.setItem(
                "user",
                JSON.stringify(updatedUser)
            );

            // Keep currentUser synchronized if it exists.
            if (localStorage.getItem("currentUser")) {
                localStorage.setItem(
                    "currentUser",
                    JSON.stringify(updatedUser)
                );
            }

            // ====================================================
            // UPDATE USERS CACHE IF IT EXISTS
            // ====================================================

            try {
                const users = JSON.parse(
                    localStorage.getItem("users") || "[]"
                );

                if (Array.isArray(users)) {
                    const updatedUsers = users.map((user) => {
                        const sameUser =
                            user.id === storedUser.id ||
                            user.userId === storedUser.userId ||
                            user.email === storedUser.email;

                        if (!sameUser) {
                            return user;
                        }

                        return {
                            ...user,
                            ...updatedUser,
                        };
                    });

                    localStorage.setItem(
                        "users",
                        JSON.stringify(updatedUsers)
                    );
                }
            } catch {
                // Ignore local users-cache errors.
            }

            // ====================================================
            // UPDATE FORM WITH SAVED VALUES
            // ====================================================

            setFormData((previous) => ({
                ...previous,
                fullName:
                    updatedUser.fullName ||
                    formData.fullName,

                email:
                    updatedUser.email ||
                    formData.email,

                phone:
                    updatedUser.phoneNumber ||
                    formData.phone,

                bio:
                    updatedUser.bio ??
                    formData.bio,

                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            }));

            setSuccess(
                response?.data?.message ||
                response?.data?.Message ||
                "Profile updated successfully."
            );

            // ====================================================
            // NOTIFY PARENT
            // ====================================================

            if (onSuccess) {
                setTimeout(() => {
                    onSuccess(updatedUser);
                }, 700);
            }
        } catch (requestError) {
            const responseData = requestError?.response?.data;

            const backendMessage =
                responseData?.message ||
                responseData?.Message ||
                responseData?.error ||
                responseData?.title;

            if (
                responseData?.errors &&
                typeof responseData.errors === "object"
            ) {
                const validationMessages = Object.values(
                    responseData.errors
                )
                    .flat()
                    .filter(Boolean);

                if (validationMessages.length > 0) {
                    setError(validationMessages.join(" "));
                    return;
                }
            }

            setError(
                backendMessage ||
                "Failed to update your profile. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // ============================================================
    // INPUT COMPONENT
    // ============================================================

    const inputClass =
        "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";

    // ============================================================
    // NO PROFILE
    // ============================================================

    if (!initialUser) {
        return (
            <div className="rounded-2xl border border-red-200 bg-white p-8 shadow-sm">
                <div className="flex flex-col items-center justify-center text-center">
                    <div className="mb-4 rounded-full bg-red-100 p-4">
                        <AlertCircle className="h-8 w-8 text-red-600" />
                    </div>

                    <h2 className="text-lg font-semibold text-slate-900">
                        Profile Not Found
                    </h2>

                    <p className="mt-2 max-w-md text-sm text-slate-500">
                        We could not find your Team Leader profile.
                        Please log in again or contact the system
                        administrator.
                    </p>

                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="mt-6 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                        >
                            Go Back
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // ============================================================
    // MAIN UI
    // ============================================================

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6"
        >
            {/* ================================================== */}
            {/* HEADER */}
            {/* ================================================== */}

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-6 py-5">
                    <div className="flex items-center gap-4">
                        <div className="rounded-xl bg-blue-100 p-3">
                            <UserRound className="h-6 w-6 text-blue-600" />
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">
                                Personal Information
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Update your personal and professional
                                profile information.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 p-6 md:grid-cols-2">
                    {/* Full Name */}

                    <div>
                        <label
                            htmlFor="fullName"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Full Name
                        </label>

                        <div className="relative">
                            <UserRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                value={formData.fullName}
                                onChange={handleChange}
                                className={`${inputClass} pl-10`}
                                placeholder="Enter your full name"
                            />
                        </div>
                    </div>

                    {/* Email */}

                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Email Address
                        </label>

                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`${inputClass} pl-10`}
                                placeholder="Enter your email"
                            />
                        </div>
                    </div>

                    {/* Phone */}

                    <div>
                        <label
                            htmlFor="phone"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Phone Number
                        </label>

                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                className={`${inputClass} pl-10`}
                                placeholder="Enter your phone number"
                            />
                        </div>
                    </div>

                    {/* Department */}

                    <div>
                        <label
                            htmlFor="department"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Department
                        </label>

                        <div className="relative">
                            <BriefcaseBusiness className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                            <input
                                id="department"
                                name="department"
                                type="text"
                                value={formData.department}
                                onChange={handleChange}
                                className={`${inputClass} pl-10`}
                                placeholder="Enter department"
                            />
                        </div>
                    </div>

                    {/* Team */}

                    <div>
                        <label
                            htmlFor="team"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Team
                        </label>

                        <div className="relative">
                            <UsersRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                            <input
                                id="team"
                                name="team"
                                type="text"
                                value={formData.team}
                                onChange={handleChange}
                                className={`${inputClass} pl-10`}
                                placeholder="Enter team name"
                            />
                        </div>
                    </div>

                    {/* Role */}

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Role
                        </label>

                        <div className="relative">
                            <ShieldCheck className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                            <input
                                type="text"
                                value="Team Leader"
                                disabled
                                className={`${inputClass} cursor-not-allowed bg-slate-100 pl-10 text-slate-500`}
                            />
                        </div>

                        <p className="mt-1.5 text-xs text-slate-400">
                            Your role is managed by the system administrator.
                        </p>
                    </div>
                </div>
            </div>

            {/* ================================================== */}
            {/* PROFESSIONAL INFORMATION */}
            {/* ================================================== */}

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-6 py-5">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                            Professional Information
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Add information that helps your team understand
                            your professional background.
                        </p>
                    </div>
                </div>

                <div className="space-y-6 p-6">
                    {/* Skills */}

                    <div>
                        <label
                            htmlFor="skills"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Skills
                        </label>

                        <textarea
                            id="skills"
                            name="skills"
                            rows={3}
                            value={formData.skills}
                            onChange={handleChange}
                            className={`${inputClass} resize-none`}
                            placeholder="Example: React, JavaScript, .NET, Project Management"
                        />

                        <p className="mt-1.5 text-xs text-slate-400">
                            Separate multiple skills with commas.
                        </p>
                    </div>

                    {/* Bio */}

                    <div>
                        <label
                            htmlFor="bio"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Professional Bio
                        </label>

                        <textarea
                            id="bio"
                            name="bio"
                            rows={5}
                            value={formData.bio}
                            onChange={handleChange}
                            className={`${inputClass} resize-none`}
                            placeholder="Write a short professional description..."
                        />
                    </div>
                </div>
            </div>

            {/* ================================================== */}
            {/* SECURITY */}
            {/* ================================================== */}

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-6 py-5">
                    <div className="flex items-center gap-4">
                        <div className="rounded-xl bg-amber-100 p-3">
                            <LockKeyhole className="h-6 w-6 text-amber-600" />
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">
                                Account Security
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Change your password and keep your account
                                secure.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 p-6 md:grid-cols-3">
                    {/* Current Password */}

                    <div>
                        <label
                            htmlFor="currentPassword"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Current Password
                        </label>

                        <div className="relative">
                            <input
                                id="currentPassword"
                                name="currentPassword"
                                type={
                                    showCurrentPassword
                                        ? "text"
                                        : "password"
                                }
                                value={formData.currentPassword}
                                onChange={handleChange}
                                className={`${inputClass} pr-10`}
                                placeholder="Current password"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowCurrentPassword(
                                        (value) => !value
                                    )
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                {showCurrentPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* New Password */}

                    <div>
                        <label
                            htmlFor="newPassword"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            New Password
                        </label>

                        <div className="relative">
                            <input
                                id="newPassword"
                                name="newPassword"
                                type={
                                    showNewPassword
                                        ? "text"
                                        : "password"
                                }
                                value={formData.newPassword}
                                onChange={handleChange}
                                className={`${inputClass} pr-10`}
                                placeholder="New password"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowNewPassword(
                                        (value) => !value
                                    )
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                {showNewPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>

                        <p className="mt-1.5 text-xs text-slate-400">
                            Minimum 8 characters.
                        </p>
                    </div>

                    {/* Confirm Password */}

                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Confirm New Password
                        </label>

                        <div className="relative">
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`${inputClass} pr-10`}
                                placeholder="Confirm password"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        (value) => !value
                                    )
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ================================================== */}
            {/* MESSAGES */}
            {/* ================================================== */}

            {error && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {success && (
                <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                    <span>{success}</span>
                </div>
            )}

            {/* ================================================== */}
            {/* ACTIONS */}
            {/* ================================================== */}

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <X className="h-4 w-4" />
                        Cancel
                    </button>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <Save className="h-4 w-4" />

                    {loading
                        ? "Saving..."
                        : "Save Changes"}
                </button>
            </div>
        </form>
    );
}
