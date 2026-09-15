import { useEffect, useState } from "react";
import {
    UserRound,
    Phone,
    Code2,
    FileText,
    Save,
    RefreshCw,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";

import api from "../../../../services/api";

// ============================================================
// AIPMS — STAFF UPDATE PROFILE
//
// Backend:
//
// GET  /api/users/profile
// PUT  /api/users/profile
//
// Backend DTO:
//
// UpdateProfileDto
// - FullName
// - PhoneNumber
// - Bio
// - ProfileImage
// - TechnicalSkills
//
// Important:
// - Profile data comes from backend/database.
// - No localStorage is used for profile data.
// - api.js handles JWT authentication.
// - Email is not editable because UpdateProfileDto does not
//   support Email.
// - Specialization is not editable because UpdateProfileDto
//   does not support Specialization.
// ============================================================

function UpdateStaffProfile() {
    const [formData, setFormData] = useState({
        fullName: "",
        phoneNumber: "",
        bio: "",
        technicalSkills: "",
        profileImage: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    // =========================================================
    // LOAD PROFILE FROM BACKEND
    // GET /api/users/profile
    // =========================================================
    const loadUserData = async () => {
        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const response = await api.get("/users/profile");

            const user = response.data;

            setFormData({
                fullName: user.fullName || "",
                phoneNumber: user.phoneNumber || "",
                bio: user.bio || "",
                technicalSkills: user.technicalSkills || "",
                profileImage: user.profileImage || "",
            });
        } catch (err) {
            console.error("Failed to load profile:", err);

            const message =
                err?.response?.data?.message ||
                err?.response?.data?.Message ||
                "Unable to load your profile information.";

            setError(message);
        } finally {
            setLoading(false);
        }
    };

    // =========================================================
    // LOAD PROFILE WHEN COMPONENT OPENS
    // =========================================================
    useEffect(() => {
        loadUserData();
    }, []);

    // =========================================================
    // HANDLE INPUT CHANGES
    // =========================================================
    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setSuccess("");
        setError("");
    };

    // =========================================================
    // UPDATE PROFILE
    // PUT /api/users/profile
    // =========================================================
    const handleSubmit = async (event) => {
        event.preventDefault();

        setSaving(true);
        setSuccess("");
        setError("");

        try {
            // Only send fields supported by UpdateProfileDto.
            const payload = {
                fullName: formData.fullName.trim(),
                phoneNumber: formData.phoneNumber.trim() || null,
                bio: formData.bio.trim() || null,
                technicalSkills:
                    formData.technicalSkills.trim() || null,
                profileImage:
                    formData.profileImage.trim() || null,
            };

            await api.put("/users/profile", payload);

            setSuccess("Profile updated successfully.");

            // Reload from backend so the form reflects
            // the actual saved database values.
            await loadUserData();
        } catch (err) {
            console.error("Failed to update profile:", err);

            const message =
                err?.response?.data?.message ||
                err?.response?.data?.Message ||
                "Unable to update your profile.";

            setError(message);
        } finally {
            setSaving(false);
        }
    };

    // =========================================================
    // LOADING STATE
    // =========================================================
    if (loading) {
        return (
            <div className="w-full">
                <div className="mb-6">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-blue-600/20 p-3">
                            <UserRound className="h-6 w-6 text-blue-400" />
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-white">
                                Update Profile
                            </h2>

                            <p className="text-sm text-slate-400">
                                Update your permitted personal and profile
                                information.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-blue-900/60 bg-[#071a2d]">
                    <div className="flex items-center gap-3 text-blue-300">
                        <RefreshCw className="h-5 w-5 animate-spin" />
                        <span>Loading profile...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* =====================================================
                HEADER
            ====================================================== */}
            <div className="mb-6">
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-blue-600/20 p-3">
                        <UserRound className="h-6 w-6 text-blue-400" />
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-white">
                            Update Profile
                        </h2>

                        <p className="text-sm text-slate-400">
                            Update your permitted personal and profile
                            information.
                        </p>
                    </div>
                </div>
            </div>

            {/* =====================================================
                SUCCESS MESSAGE
            ====================================================== */}
            {success && (
                <div className="mb-5 flex items-center gap-2 rounded-xl border border-green-800/60 bg-green-950/30 px-4 py-3 text-sm text-green-300">
                    <CheckCircle2 className="h-5 w-5 shrink-0" />

                    <span>{success}</span>
                </div>
            )}

            {/* =====================================================
                ERROR MESSAGE
            ====================================================== */}
            {error && (
                <div className="mb-5 flex items-start gap-2 rounded-xl border border-red-800/60 bg-red-950/30 px-4 py-3 text-sm text-red-300">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

                    <span>{error}</span>
                </div>
            )}

            {/* =====================================================
                FORM
            ====================================================== */}
            <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-blue-900/60 bg-[#071a2d] p-6"
            >
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {/* =================================================
                        FULL NAME
                    ================================================== */}
                    <FormInput
                        icon={UserRound}
                        label="Full Name"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        disabled={saving}
                    />

                    {/* =================================================
                        PHONE
                    ================================================== */}
                    <FormInput
                        icon={Phone}
                        label="Phone Number"
                        name="phoneNumber"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        disabled={saving}
                    />

                    {/* =================================================
                        TECHNICAL SKILLS
                    ================================================== */}
                    <FormInput
                        icon={Code2}
                        label="Technical Skills"
                        name="technicalSkills"
                        value={formData.technicalSkills}
                        onChange={handleChange}
                        disabled={saving}
                    />

                    {/* =================================================
                        PROFILE IMAGE
                    ================================================== */}
                    <FormInput
                        icon={UserRound}
                        label="Profile Image"
                        name="profileImage"
                        value={formData.profileImage}
                        onChange={handleChange}
                        placeholder="Image URL"
                        disabled={saving}
                    />
                </div>

                {/* =====================================================
                    BIO
                ====================================================== */}
                <div className="mt-5">
                    <FormTextarea
                        icon={FileText}
                        label="Bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        disabled={saving}
                    />
                </div>

                {/* =====================================================
                    ACTIONS
                ====================================================== */}
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                    {/* Reload */}
                    <button
                        type="button"
                        onClick={loadUserData}
                        disabled={saving || loading}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-800 bg-[#0b2038] px-5 py-2.5 text-sm font-medium text-blue-300 transition hover:bg-blue-900/40 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <RefreshCw
                            className={`h-4 w-4 ${
                                loading ? "animate-spin" : ""
                            }`}
                        />

                        Reload
                    </button>

                    {/* Save */}
                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {saving ? (
                            <>
                                <RefreshCw className="h-4 w-4 animate-spin" />
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
    );
}

// ============================================================
// FORM INPUT
// ============================================================
function FormInput({
    icon: Icon,
    label,
    name,
    type = "text",
    value,
    onChange,
    placeholder = "",
    required = false,
    disabled = false,
}) {
    return (
        <div>
            <label
                htmlFor={name}
                className="mb-2 block text-sm font-medium text-slate-300"
            >
                {label}
            </label>

            <div className="relative">
                <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-400" />

                <input
                    id={name}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    className="w-full rounded-lg border border-blue-900/60 bg-[#0b2038] py-2.5 pl-10 pr-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                />
            </div>
        </div>
    );
}

// ============================================================
// FORM TEXTAREA
// ============================================================
function FormTextarea({
    icon: Icon,
    label,
    name,
    value,
    onChange,
    disabled = false,
}) {
    return (
        <div>
            <label
                htmlFor={name}
                className="mb-2 block text-sm font-medium text-slate-300"
            >
                {label}
            </label>

            <div className="relative">
                <Icon className="absolute left-3 top-3 h-4 w-4 text-blue-400" />

                <textarea
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    rows={5}
                    disabled={disabled}
                    className="w-full resize-none rounded-lg border border-blue-900/60 bg-[#0b2038] py-2.5 pl-10 pr-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                />
            </div>
        </div>
    );
}

export default UpdateStaffProfile;