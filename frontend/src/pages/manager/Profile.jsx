
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
} from "lucide-react";

import {
    getMyProfile,
    updateMyProfile,
    changeMyPassword,
    validateProfileForm,
    validatePasswordForm,
} from "@/services/managerProfileService";

const Profile = () => {
    // ============================================================
    // PROFILE STATE
    // ============================================================

    const [profile, setProfile] = useState(null);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        profilePicture: "",
    });

    const [originalFormData, setOriginalFormData] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        profilePicture: "",
    });

    const [isEditing, setIsEditing] = useState(false);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [fieldErrors, setFieldErrors] = useState({});

    // ============================================================
    // PASSWORD STATE
    // ============================================================

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [showCurrentPassword, setShowCurrentPassword] =
        useState(false);

    const [showNewPassword, setShowNewPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [passwordSaving, setPasswordSaving] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [passwordSuccess, setPasswordSuccess] = useState("");
    const [passwordErrors, setPasswordErrors] = useState({});

    // ============================================================
    // LOAD PROFILE
    // ============================================================

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);
            setError("");
            setSuccess("");

            console.log(
                "========== LOAD MANAGER PROFILE =========="
            );

            const result = await getMyProfile();

            console.log(
                "PROFILE LOAD RESULT:",
                result
            );

            if (!result?.success) {
                throw new Error(
                    result?.message ||
                        "Failed to load your profile."
                );
            }

            const data =
                result?.profile ||
                result?.data ||
                result;

            const loadedData = {
                fullName:
                    data?.fullName ??
                    data?.FullName ??
                    "",

                email:
                    data?.email ??
                    data?.Email ??
                    "",

                phoneNumber:
                    data?.phoneNumber ??
                    data?.PhoneNumber ??
                    "",

                profilePicture:
                    data?.profilePicture ??
                    data?.ProfilePicture ??
                    data?.profileImage ??
                    data?.ProfileImage ??
                    "",
            };

            setProfile(data);

            setFormData(loadedData);

            setOriginalFormData(loadedData);
        } catch (err) {
            console.error(
                "MANAGER PROFILE LOAD ERROR:",
                err
            );

            const status =
                err?.response?.status ??
                err?.status;

            const backendMessage =
                err?.response?.data?.message ??
                err?.response?.data?.Message ??
                err?.response?.data?.detail ??
                err?.response?.data?.title ??
                err?.message;

            if (status === 401) {
                setError(
                    "Your session is not authorized. Please sign in again."
                );
            } else if (status === 403) {
                setError(
                    "You are not authorized to access your profile."
                );
            } else {
                setError(
                    backendMessage ||
                        "Unable to load your profile. Please try again."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    // ============================================================
    // PROFILE FORM CHANGE
    // ============================================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setFieldErrors((previous) => ({
            ...previous,
            [name]: "",
        }));

        setError("");
        setSuccess("");
    };

    // ============================================================
    // START EDITING
    // ============================================================

    const handleEdit = () => {
        setError("");
        setSuccess("");
        setFieldErrors({});

        setFormData({
            ...originalFormData,
        });

        setIsEditing(true);
    };

    // ============================================================
    // CANCEL EDITING
    // ============================================================

    const handleCancel = () => {
        setFormData({
            ...originalFormData,
        });

        setIsEditing(false);

        setError("");
        setSuccess("");
        setFieldErrors({});
    };

    // ============================================================
    // VALIDATE PROFILE
    // ============================================================

    const validateForm = () => {
        const validation =
            validateProfileForm(formData);

        if (!validation?.isValid) {
            setFieldErrors(
                validation?.errors || {}
            );

            return false;
        }

        setFieldErrors({});

        return true;
    };

    // ============================================================
    // SAVE PROFILE
    // ============================================================

    const handleSaveProfile = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!validateForm()) {
            return;
        }

        try {
            setSaving(true);

            /*
             * SECURITY:
             *
             * Only permitted personal information is sent.
             *
             * Do NOT send:
             * - userId
             * - role
             * - permissions
             * - organizationId
             * - teamId
             *
             * The backend identifies the authenticated
             * manager from the JWT.
             */

            const payload = {
                fullName: String(
                    formData?.fullName ?? ""
                ).trim(),

                email: String(
                    formData?.email ?? ""
                ).trim(),

                phoneNumber: String(
                    formData?.phoneNumber ?? ""
                ).trim(),

                /*
                 * ProfileImage is optional.
                 * Include the existing/selected image so the
                 * backend can preserve/update it.
                 */
                profileImage:
                    formData?.profilePicture || null,
            };

            console.log(
                "========== UPDATE MANAGER PROFILE =========="
            );

            console.log(
                "PROFILE PAYLOAD:",
                payload
            );

            const result =
                await updateMyProfile(payload);

            console.log(
                "PROFILE UPDATE RESULT:",
                result
            );

            if (!result?.success) {
                throw new Error(
                    result?.message ||
                        "Failed to update your profile."
                );
            }

            /*
             * PUT /Users/profile currently returns:
             *
             * {
             *   message: "Profile updated successfully."
             * }
             *
             * It does not necessarily return the updated
             * profile object.
             *
             * Therefore preserve the profile object and
             * update only the editable fields locally.
             */

            const updatedData = {
                fullName: payload.fullName,

                email: payload.email,

                phoneNumber: payload.phoneNumber,

                profilePicture:
                    formData?.profilePicture ||
                    originalFormData?.profilePicture ||
                    "",
            };

            setProfile((previous) => ({
                ...(previous || {}),
                fullName: updatedData.fullName,
                FullName: updatedData.fullName,

                email: updatedData.email,
                Email: updatedData.email,

                phoneNumber:
                    updatedData.phoneNumber,
                PhoneNumber:
                    updatedData.phoneNumber,

                profilePicture:
                    updatedData.profilePicture,
                ProfilePicture:
                    updatedData.profilePicture,

                profileImage:
                    updatedData.profilePicture,
                ProfileImage:
                    updatedData.profilePicture,
            }));

            setFormData(updatedData);

            setOriginalFormData(updatedData);

            setIsEditing(false);

            setFieldErrors({});

            setSuccess(
                "Profile updated successfully."
            );

            setTimeout(() => {
                setSuccess("");
            }, 4000);
        } catch (err) {
            console.error(
                "MANAGER PROFILE UPDATE ERROR:",
                err
            );

            const status =
                err?.response?.status ??
                err?.status;

            const backendMessage =
                err?.response?.data?.message ??
                err?.response?.data?.Message ??
                err?.response?.data?.detail ??
                err?.response?.data?.title ??
                err?.message;

            if (status === 400) {
                setError(
                    backendMessage ||
                        "The profile information is invalid."
                );
            } else if (status === 401) {
                setError(
                    "Your session is not authorized. Please sign in again."
                );
            } else if (status === 403) {
                setError(
                    "You are not authorized to update this profile."
                );
            } else if (status === 409) {
                setError(
                    backendMessage ||
                        "This email address or phone number is already associated with another account."
                );
            } else {
                setError(
                    backendMessage ||
                        "Failed to update your profile. Please try again."
                );
            }
        } finally {
            setSaving(false);
        }
    };

    // ============================================================
    // PROFILE PICTURE
    // ============================================================

    const handleProfilePictureChange = (e) => {
        if (!isEditing) {
            return;
        }

        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        setError("");
        setSuccess("");

        // --------------------------------------------------------
        // FILE TYPE
        // --------------------------------------------------------

        if (!file.type.startsWith("image/")) {
            setError(
                "Please select a valid image file."
            );

            e.target.value = "";

            return;
        }

        // --------------------------------------------------------
        // FILE SIZE
        // --------------------------------------------------------

        if (file.size > 5 * 1024 * 1024) {
            setError(
                "Profile picture must be smaller than 5MB."
            );

            e.target.value = "";

            return;
        }

        const reader = new FileReader();

        reader.onload = async () => {
            const imageData = reader.result;

            if (
                typeof imageData !== "string"
            ) {
                setError(
                    "Failed to process the selected image."
                );

                e.target.value = "";

                return;
            }

            /*
             * Show selected image immediately.
             */

            setFormData((previous) => ({
                ...previous,
                profilePicture: imageData,
            }));

            /*
             * Save the image through the existing
             * PUT /Users/profile endpoint.
             *
             * IMPORTANT:
             * The backend UpdateProfileDto requires
             * FullName and Email, so we must send the
             * complete profile payload rather than only
             * profileImage.
             */

            try {
                setSaving(true);

                console.log(
                    "========== UPDATE PROFILE PICTURE =========="
                );

                const payload = {
                    fullName: String(
                        formData?.fullName ?? ""
                    ).trim(),

                    email: String(
                        formData?.email ?? ""
                    ).trim(),

                    phoneNumber: String(
                        formData?.phoneNumber ?? ""
                    ).trim(),

                    profileImage: imageData,
                };

                console.log(
                    "PROFILE PICTURE PAYLOAD:",
                    payload
                );

                const result =
                    await updateMyProfile(
                        payload
                    );

                console.log(
                    "PROFILE PICTURE UPDATE RESULT:",
                    result
                );

                if (!result?.success) {
                    throw new Error(
                        result?.message ||
                            "Failed to update profile picture."
                    );
                }

                /*
                 * Backend returns a success message rather
                 * than a complete profile object.
                 */

                const updatedData = {
                    fullName:
                        payload.fullName,

                    email:
                        payload.email,

                    phoneNumber:
                        payload.phoneNumber,

                    profilePicture:
                        imageData,
                };

                setProfile((previous) => ({
                    ...(previous || {}),

                    fullName:
                        updatedData.fullName,

                    FullName:
                        updatedData.fullName,

                    email:
                        updatedData.email,

                    Email:
                        updatedData.email,

                    phoneNumber:
                        updatedData.phoneNumber,

                    PhoneNumber:
                        updatedData.phoneNumber,

                    profilePicture:
                        updatedData.profilePicture,

                    ProfilePicture:
                        updatedData.profilePicture,

                    profileImage:
                        updatedData.profilePicture,

                    ProfileImage:
                        updatedData.profilePicture,
                }));

                setFormData(updatedData);

                setOriginalFormData(updatedData);

                setSuccess(
                    "Profile picture updated successfully."
                );

                setTimeout(() => {
                    setSuccess("");
                }, 3000);
            } catch (err) {
                console.error(
                    "PROFILE PICTURE UPDATE ERROR:",
                    err
                );

                /*
                 * Restore previous picture if
                 * backend update failed.
                 */

                setFormData((previous) => ({
                    ...previous,
                    profilePicture:
                        originalFormData.profilePicture,
                }));

                const status =
                    err?.response?.status ??
                    err?.status;

                const backendMessage =
                    err?.response?.data?.message ??
                    err?.response?.data?.Message ??
                    err?.response?.data?.detail ??
                    err?.response?.data?.title ??
                    err?.message;

                if (status === 400) {
                    setError(
                        backendMessage ||
                            "The selected profile picture is invalid."
                    );
                } else if (status === 401) {
                    setError(
                        "Your session is not authorized. Please sign in again."
                    );
                } else if (status === 403) {
                    setError(
                        "You are not authorized to update your profile picture."
                    );
                } else if (status === 409) {
                    setError(
                        backendMessage ||
                            "The profile could not be updated because of a duplicate value."
                    );
                } else {
                    setError(
                        backendMessage ||
                            "Failed to update profile picture."
                    );
                }
            } finally {
                setSaving(false);

                /*
                 * Allow selecting the same file again.
                 */

                e.target.value = "";
            }
        };

        reader.onerror = () => {
            setError(
                "Failed to read the selected image."
            );

            e.target.value = "";
        };

        reader.readAsDataURL(file);
    };

    // ============================================================
    // PASSWORD FORM CHANGE
    // ============================================================

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;

        setPasswordData((previous) => ({
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

    // ============================================================
    // CHANGE PASSWORD
    // ============================================================

    const handleChangePassword = async (e) => {
        e.preventDefault();

        setPasswordError("");
        setPasswordSuccess("");

        const validation =
            validatePasswordForm(
                passwordData.currentPassword,
                passwordData.newPassword,
                passwordData.confirmPassword
            );

        if (!validation?.isValid) {
            setPasswordErrors(
                validation?.errors || {}
            );

            return;
        }

        setPasswordErrors({});

        try {
            setPasswordSaving(true);

            console.log(
                "========== CHANGE MANAGER PASSWORD =========="
            );

            /*
             * Backend endpoint:
             *
             * POST /api/Auth/change-password
             *
             * Required DTO:
             *
             * {
             *   currentPassword,
             *   newPassword,
             *   confirmPassword
             * }
             */

            const result =
                await changeMyPassword(
                    passwordData.currentPassword,
                    passwordData.newPassword,
                    passwordData.confirmPassword
                );

            console.log(
                "PASSWORD CHANGE RESULT:",
                result
            );

            if (!result?.success) {
                throw new Error(
                    result?.message ||
                        "Failed to change your password."
                );
            }

            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });

            setPasswordErrors({});

            setPasswordSuccess(
                "Password changed successfully."
            );

            setTimeout(() => {
                setPasswordSuccess("");
            }, 4000);
        } catch (err) {
            console.error(
                "CHANGE PASSWORD ERROR:",
                err
            );

            const status =
                err?.response?.status ??
                err?.status;

            const backendMessage =
                err?.response?.data?.message ??
                err?.response?.data?.Message ??
                err?.response?.data?.detail ??
                err?.response?.data?.title ??
                err?.message;

            if (status === 400) {
                setPasswordError(
                    backendMessage ||
                        "The current or new password is invalid."
                );
            } else if (status === 401) {
                setPasswordError(
                    "Your session is not authorized. Please sign in again."
                );
            } else if (status === 403) {
                setPasswordError(
                    "You are not authorized to change this password."
                );
            } else {
                setPasswordError(
                    backendMessage ||
                        "Failed to change password. Please try again."
                );
            }
        } finally {
            setPasswordSaving(false);
        }
    };

    // ============================================================
    // GET ROLE
    // ============================================================

    const getRole = () => {
        return (
            profile?.role ??
            profile?.Role ??
            profile?.userRole ??
            profile?.UserRole ??
            "Manager"
        );
    };

    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">

                    <Loader2 className="w-8 h-8 animate-spin text-slate-600" />

                    <p className="text-slate-600">
                        Loading your profile...
                    </p>

                </div>
            </div>
        );
    }

    // ============================================================
    // UI
    // ============================================================

    return (
        <div className="min-h-screen bg-slate-50 p-6">

            <div className="max-w-7xl mx-auto">

                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

                    <div>

                        <h1 className="text-3xl font-bold text-slate-900">
                            My Profile
                        </h1>

                        <p className="text-slate-500 mt-1">
                            View and manage your personal information.
                        </p>

                    </div>

                    {!isEditing ? (

                        <button
                            type="button"
                            onClick={handleEdit}
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition"
                        >
                            <Edit3 className="w-4 h-4" />

                            Edit Profile
                        </button>

                    ) : (

                        <div className="flex items-center gap-3">

                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={saving}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 transition disabled:opacity-50"
                            >
                                <X className="w-4 h-4" />

                                Cancel
                            </button>

                            <button
                                type="submit"
                                form="profile-form"
                                disabled={saving}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition disabled:opacity-50"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />

                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />

                                        Save Changes
                                    </>
                                )}
                            </button>

                        </div>
                    )}

                </div>

                {/* ==================================================
                    GLOBAL ERROR
                ================================================== */}

                {error && (

                    <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">

                        <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />

                        <span>
                            {error}
                        </span>

                    </div>

                )}

                {/* ==================================================
                    GLOBAL SUCCESS
                ================================================== */}

                {success && (

                    <div className="mb-6 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">

                        <CheckCircle className="w-5 h-5 mt-0.5 shrink-0" />

                        <span>
                            {success}
                        </span>

                    </div>

                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* ==================================================
                        PROFILE SUMMARY
                    ================================================== */}

                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">

                        <div className="flex flex-col items-center">

                            {/* PROFILE IMAGE */}

                            <div className="relative">

                                <div className="w-32 h-32 rounded-full bg-slate-100 border-4 border-white shadow-md overflow-hidden flex items-center justify-center">

                                    {formData.profilePicture ? (

                                        <img
                                            src={formData.profilePicture}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />

                                    ) : (

                                        <User className="w-16 h-16 text-slate-400" />

                                    )}

                                </div>

                                {isEditing && (

                                    <>

                                        <label
                                            htmlFor="profile-picture"
                                            className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center cursor-pointer hover:bg-slate-800 transition shadow-lg"
                                        >
                                            <Camera className="w-5 h-5" />
                                        </label>

                                        <input
                                            id="profile-picture"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={
                                                handleProfilePictureChange
                                            }
                                            disabled={saving}
                                        />

                                    </>

                                )}

                            </div>

                            {/* NAME */}

                            <h2 className="mt-5 text-xl font-bold text-slate-900 text-center">

                                {formData.fullName ||
                                    "Manager"}

                            </h2>

                            {/* EMAIL */}

                            <p className="text-slate-500 text-sm mt-1">

                                {formData.email}

                            </p>

                            {/* ROLE */}

                            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-sm font-medium">

                                <Shield className="w-4 h-4" />

                                {getRole()}

                            </div>

                        </div>

                        {/* ACCOUNT STATUS */}

                        <div className="mt-8 pt-6 border-t border-slate-200">

                            <div className="flex items-center gap-3 text-sm text-slate-600">

                                <CheckCircle className="w-4 h-4 text-green-600" />

                                Active Account

                            </div>

                            <div className="flex items-center gap-3 text-sm text-slate-600 mt-3">

                                <Shield className="w-4 h-4 text-slate-500" />

                                Role and permissions are managed separately

                            </div>

                        </div>

                    </div>

                    {/* ==================================================
                        RIGHT SIDE
                    ================================================== */}

                    <div className="lg:col-span-2 space-y-6">

                        {/* ==================================================
                            PERSONAL INFORMATION
                        ================================================== */}

                        <form
                            id="profile-form"
                            onSubmit={handleSaveProfile}
                            className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6"
                        >

                            <div className="mb-6">

                                <h2 className="text-xl font-bold text-slate-900">
                                    Personal Information
                                </h2>

                                <p className="text-sm text-slate-500 mt-1">
                                    Update your permitted personal and account information.
                                </p>

                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                {/* ==================================================
                                    FULL NAME
                                ================================================== */}

                                <div>

                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Full Name
                                    </label>

                                    <div className="relative">

                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            disabled={!isEditing || saving}
                                            autoComplete="name"
                                            className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                                                fieldErrors.fullName
                                                    ? "border-red-400"
                                                    : "border-slate-300"
                                            } ${
                                                isEditing
                                                    ? "bg-white"
                                                    : "bg-slate-50"
                                            } text-slate-900 outline-none focus:ring-2 focus:ring-slate-300 disabled:cursor-not-allowed`}
                                        />

                                    </div>

                                    {fieldErrors.fullName && (

                                        <p className="text-sm text-red-600 mt-1">
                                            {fieldErrors.fullName}
                                        </p>

                                    )}

                                </div>

                                {/* ==================================================
                                    EMAIL
                                ================================================== */}

                                <div>

                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Email Address
                                    </label>

                                    <div className="relative">

                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            disabled={!isEditing || saving}
                                            autoComplete="email"
                                            className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                                                fieldErrors.email
                                                    ? "border-red-400"
                                                    : "border-slate-300"
                                            } ${
                                                isEditing
                                                    ? "bg-white"
                                                    : "bg-slate-50"
                                            } text-slate-900 outline-none focus:ring-2 focus:ring-slate-300 disabled:cursor-not-allowed`}
                                        />

                                    </div>

                                    {fieldErrors.email && (

                                        <p className="text-sm text-red-600 mt-1">
                                            {fieldErrors.email}
                                        </p>

                                    )}

                                </div>

                                {/* ==================================================
                                    PHONE
                                ================================================== */}

                                <div>

                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Phone Number
                                    </label>

                                    <div className="relative">

                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

                                        <input
                                            type="tel"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleChange}
                                            disabled={!isEditing || saving}
                                            autoComplete="tel"
                                            className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                                                fieldErrors.phoneNumber
                                                    ? "border-red-400"
                                                    : "border-slate-300"
                                            } ${
                                                isEditing
                                                    ? "bg-white"
                                                    : "bg-slate-50"
                                            } text-slate-900 outline-none focus:ring-2 focus:ring-slate-300 disabled:cursor-not-allowed`}
                                        />

                                    </div>

                                    {fieldErrors.phoneNumber && (

                                        <p className="text-sm text-red-600 mt-1">
                                            {fieldErrors.phoneNumber}
                                        </p>

                                    )}

                                </div>

                                {/* ==================================================
                                    ROLE
                                ================================================== */}

                                <div>

                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Role
                                    </label>

                                    <div className="relative">

                                        <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

                                        <input
                                            type="text"
                                            value={getRole()}
                                            disabled
                                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 bg-slate-100 text-slate-600 cursor-not-allowed"
                                        />

                                    </div>

                                    <p className="text-xs text-slate-500 mt-1">
                                        Role cannot be changed from this page.
                                    </p>

                                </div>

                            </div>

                        </form>

                        {/* ==================================================
                            PASSWORD
                        ================================================== */}

                        <form
                            onSubmit={handleChangePassword}
                            className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6"
                        >

                            <div className="mb-6">

                                <h2 className="text-xl font-bold text-slate-900">
                                    Change Password
                                </h2>

                                <p className="text-sm text-slate-500 mt-1">
                                    Change your account password securely.
                                </p>

                            </div>

                            {/* PASSWORD ERROR */}

                            {passwordError && (

                                <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">

                                    <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />

                                    <span>
                                        {passwordError}
                                    </span>

                                </div>

                            )}

                            {/* PASSWORD SUCCESS */}

                            {passwordSuccess && (

                                <div className="mb-5 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">

                                    <CheckCircle className="w-5 h-5 mt-0.5 shrink-0" />

                                    <span>
                                        {passwordSuccess}
                                    </span>

                                </div>

                            )}

                            <div className="space-y-5">

                                {/* ==================================================
                                    CURRENT PASSWORD
                                ================================================== */}

                                <div>

                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Current Password
                                    </label>

                                    <div className="relative">

                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

                                        <input
                                            type={
                                                showCurrentPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="currentPassword"
                                            value={
                                                passwordData.currentPassword
                                            }
                                            onChange={
                                                handlePasswordChange
                                            }
                                            autoComplete="current-password"
                                            className={`w-full pl-10 pr-12 py-2.5 rounded-lg border ${
                                                passwordErrors.currentPassword
                                                    ? "border-red-400"
                                                    : "border-slate-300"
                                            } bg-white text-slate-900 outline-none focus:ring-2 focus:ring-slate-300`}
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowCurrentPassword(
                                                    (value) =>
                                                        !value
                                                )
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                            aria-label={
                                                showCurrentPassword
                                                    ? "Hide current password"
                                                    : "Show current password"
                                            }
                                        >
                                            {showCurrentPassword ? (
                                                <EyeOff className="w-5 h-5" />
                                            ) : (
                                                <Eye className="w-5 h-5" />
                                            )}
                                        </button>

                                    </div>

                                    {passwordErrors.currentPassword && (

                                        <p className="text-sm text-red-600 mt-1">
                                            {
                                                passwordErrors.currentPassword
                                            }
                                        </p>

                                    )}

                                </div>

                                {/* ==================================================
                                    NEW PASSWORD
                                ================================================== */}

                                <div>

                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        New Password
                                    </label>

                                    <div className="relative">

                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

                                        <input
                                            type={
                                                showNewPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="newPassword"
                                            value={
                                                passwordData.newPassword
                                            }
                                            onChange={
                                                handlePasswordChange
                                            }
                                            autoComplete="new-password"
                                            className={`w-full pl-10 pr-12 py-2.5 rounded-lg border ${
                                                passwordErrors.newPassword
                                                    ? "border-red-400"
                                                    : "border-slate-300"
                                            } bg-white text-slate-900 outline-none focus:ring-2 focus:ring-slate-300`}
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowNewPassword(
                                                    (value) =>
                                                        !value
                                                )
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                            aria-label={
                                                showNewPassword
                                                    ? "Hide new password"
                                                    : "Show new password"
                                            }
                                        >
                                            {showNewPassword ? (
                                                <EyeOff className="w-5 h-5" />
                                            ) : (
                                                <Eye className="w-5 h-5" />
                                            )}
                                        </button>

                                    </div>

                                    {passwordErrors.newPassword && (

                                        <p className="text-sm text-red-600 mt-1">
                                            {
                                                passwordErrors.newPassword
                                            }
                                        </p>

                                    )}

                                </div>

                                {/* ==================================================
                                    CONFIRM PASSWORD
                                ================================================== */}

                                <div>

                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Confirm New Password
                                    </label>

                                    <div className="relative">

                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

                                        <input
                                            type={
                                                showConfirmPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="confirmPassword"
                                            value={
                                                passwordData.confirmPassword
                                            }
                                            onChange={
                                                handlePasswordChange
                                            }
                                            autoComplete="new-password"
                                            className={`w-full pl-10 pr-12 py-2.5 rounded-lg border ${
                                                passwordErrors.confirmPassword
                                                    ? "border-red-400"
                                                    : "border-slate-300"
                                            } bg-white text-slate-900 outline-none focus:ring-2 focus:ring-slate-300`}
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    (value) =>
                                                        !value
                                                )
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                            aria-label={
                                                showConfirmPassword
                                                    ? "Hide password confirmation"
                                                    : "Show password confirmation"
                                            }
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="w-5 h-5" />
                                            ) : (
                                                <Eye className="w-5 h-5" />
                                            )}
                                        </button>

                                    </div>

                                    {passwordErrors.confirmPassword && (

                                        <p className="text-sm text-red-600 mt-1">
                                            {
                                                passwordErrors.confirmPassword
                                            }
                                        </p>

                                    )}

                                </div>

                            </div>

                            {/* CHANGE PASSWORD BUTTON */}

                            <div className="mt-6 flex justify-end">

                                <button
                                    type="submit"
                                    disabled={passwordSaving}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition disabled:opacity-50"
                                >

                                    {passwordSaving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />

                                            Changing...
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="w-4 h-4" />

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
    );
};

export default Profile;
