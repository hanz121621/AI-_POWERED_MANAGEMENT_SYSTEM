import { useEffect, useState } from "react";

import {
    UserRound,
    Mail,
    Phone,
    Image as ImageIcon,
    FileText,
    ShieldCheck,
    UsersRound,
    FolderKanban,
    Code2,
    CalendarDays,
    Clock3,
    CircleCheck,
    CircleAlert,
    Save,
    X,
    RefreshCw,
    BriefcaseBusiness,
    Pencil,
} from "lucide-react";

import {
    getMyProfile,
    updateMyProfile,
} from "@/services/userService";

// ============================================================
// HELPERS
// ============================================================

const formatDate = (value) => {
    if (!value) {
        return "Not available";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Not available";
    }

    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(date);
};

const formatDateTime = (value) => {
    if (!value) {
        return "Not available";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Not available";
    }

    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(date);
};

const normalizeSkills = (skills) => {
    if (Array.isArray(skills)) {
        return skills
            .map((skill) => {
                if (typeof skill === "string") {
                    return skill;
                }

                return (
                    skill?.name ||
                    skill?.skillName ||
                    skill?.technicalSkillName ||
                    skill?.specializationName ||
                    ""
                );
            })
            .filter(Boolean);
    }

    if (typeof skills === "string") {
        return skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean);
    }

    return [];
};

const getFullName = (user) => {
    if (!user) {
        return "";
    }

    if (user.fullName) {
        return user.fullName;
    }

    if (user.name) {
        return user.name;
    }

    const firstName = user.firstName || "";
    const lastName = user.lastName || "";

    return `${firstName} ${lastName}`.trim();
};

const normalizeRole = (user) => {
    if (!user) {
        return "Developer";
    }

    const role = user.role ?? user.rawRole;

    if (
        role === 1 ||
        String(role).toLowerCase() === "1" ||
        String(role).toLowerCase() === "admin" ||
        String(role).toLowerCase() === "administrator"
    ) {
        return "Admin";
    }

    if (
        role === 2 ||
        String(role).toLowerCase() === "2" ||
        String(role).toLowerCase() === "manager"
    ) {
        return "Manager";
    }

    if (
        role === 3 ||
        String(role).toLowerCase() === "3" ||
        String(role).toLowerCase() === "developer" ||
        String(role).toLowerCase() === "contributor" ||
        String(role).toLowerCase() === "staff"
    ) {
        return "Developer";
    }

    return role || "Developer";
};

// ============================================================
// EMPTY PROFILE
// ============================================================

const EMPTY_PROFILE = {
    id: null,
    fullName: "",
    email: "",
    phone: "",
    bio: "",
    profilePicture: "",
    role: "Developer",
    team: "Not assigned",
    assignedProjects: [],
    technicalSkills: [],
    accountStatus: "Active",
    accountCreatedAt: null,
    lastLogin: null,
};

// ============================================================
// NORMALIZE BACKEND PROFILE
// ============================================================

const normalizeProfile = (user) => {
    if (!user) {
        return EMPTY_PROFILE;
    }

    const projects =
        user.assignedProjects ||
        user.projects ||
        user.projectAssignments ||
        [];

    const skills = normalizeSkills(
        user.technicalSkills ||
            user.skills ||
            user.specializations
    );

    return {
        id:
            user.id ||
            user.userId ||
            user.userID ||
            user.UserId ||
            null,

        fullName: getFullName(user),

        email:
            user.email ||
            user.emailAddress ||
            "",

        phone:
            user.phoneNumber ||
            user.phone ||
            "",

        bio:
            user.bio ||
            user.biography ||
            "",

        profilePicture:
            user.profileImage ||
            user.profilePicture ||
            user.avatar ||
            user.image ||
            "",

        role: normalizeRole(user),

        team:
            user.teamName ||
            user.team ||
            user.teamLeaderName ||
            "Not assigned",

        assignedProjects:
            Array.isArray(projects)
                ? projects
                : [],

        technicalSkills: skills,

        accountStatus:
            user.accountStatus ||
            user.status ||
            (user.isActive === false
                ? "Inactive"
                : "Active"),

        accountCreatedAt:
            user.accountCreatedAt ||
            user.createdAt ||
            user.creationDate ||
            user.createdDate ||
            null,

        lastLogin:
            user.lastLogin ||
            user.lastLoginAt ||
            user.lastLoginDate ||
            null,
    };
};

// ============================================================
// COMPONENT
// ============================================================

export default function UpdateDeveloperProfile({
    onCancel,
    onSuccess,
}) {
    const [profile, setProfile] =
        useState(EMPTY_PROFILE);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        bio: "",
        profileImage: "",
        technicalSkills: "",
    });

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [successMessage, setSuccessMessage] =
        useState("");

    // ========================================================
    // LOAD CURRENT PROFILE
    // ========================================================

    useEffect(() => {
        let isMounted = true;

        const fetchProfile = async () => {
            setLoading(true);
            setError("");
            setSuccessMessage("");

            try {
                const user = await getMyProfile();

                if (!isMounted) {
                    return;
                }

                if (!user) {
                    setProfile(EMPTY_PROFILE);

                    setFormData({
                        fullName: "",
                        email: "",
                        phoneNumber: "",
                        bio: "",
                        profileImage: "",
                        technicalSkills: "",
                    });

                    setError(
                        "Profile information could not be found."
                    );

                    return;
                }

                const normalizedProfile =
                    normalizeProfile(user);

                setProfile(normalizedProfile);

                setFormData({
                    fullName:
                        normalizedProfile.fullName || "",

                    // IMPORTANT:
                    // Email is loaded from the backend
                    // but is NOT editable by the developer.
                    email:
                        normalizedProfile.email || "",

                    phoneNumber:
                        normalizedProfile.phone || "",

                    bio:
                        normalizedProfile.bio || "",

                    profileImage:
                        normalizedProfile.profilePicture || "",

                    technicalSkills:
                        normalizedProfile.technicalSkills.join(
                            ", "
                        ),
                });
            } catch (loadError) {
                if (!isMounted) {
                    return;
                }

                console.error(
                    "UPDATE PROFILE LOAD ERROR:",
                    loadError
                );

                setError(
                    loadError?.message ||
                        "Unable to load your profile. Please try again."
                );
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchProfile();

        return () => {
            isMounted = false;
        };
    }, []);

    // ========================================================
    // REFRESH PROFILE
    // ========================================================

    const loadProfile = async () => {
        setLoading(true);
        setError("");
        setSuccessMessage("");

        try {
            const user = await getMyProfile();

            if (!user) {
                setProfile(EMPTY_PROFILE);

                setFormData({
                    fullName: "",
                    email: "",
                    phoneNumber: "",
                    bio: "",
                    profileImage: "",
                    technicalSkills: "",
                });

                setError(
                    "Profile information could not be found."
                );

                return;
            }

            const normalizedProfile =
                normalizeProfile(user);

            setProfile(normalizedProfile);

            setFormData({
                fullName:
                    normalizedProfile.fullName || "",

                // Email remains read-only.
                email:
                    normalizedProfile.email || "",

                phoneNumber:
                    normalizedProfile.phone || "",

                bio:
                    normalizedProfile.bio || "",

                profileImage:
                    normalizedProfile.profilePicture || "",

                technicalSkills:
                    normalizedProfile.technicalSkills.join(
                        ", "
                    ),
            });
        } catch (loadError) {
            console.error(
                "UPDATE PROFILE REFRESH ERROR:",
                loadError
            );

            setError(
                loadError?.message ||
                    "Unable to refresh your profile. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // ========================================================
    // HANDLE INPUT
    // ========================================================

    const handleChange = (event) => {
        const {
            name,
            value,
        } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));

        if (error) {
            setError("");
        }

        if (successMessage) {
            setSuccessMessage("");
        }
    };

    // ========================================================
    // SAVE PROFILE
    // ========================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccessMessage("");

        const fullName =
            formData.fullName.trim();

        if (!fullName) {
            setError(
                "Full name is required."
            );

            return;
        }

        /*
         * Email comes from the backend profile.
         *
         * The developer cannot edit it because
         * the email input is readOnly and has no
         * onChange handler.
         *
         * However, the backend UpdateProfileDto
         * requires Email, so we send the existing
         * email unchanged.
         */

        const email =
            formData.email.trim();

        if (!email) {
            setError(
                "Your existing email address could not be loaded. Please refresh the profile and try again."
            );

            return;
        }

        setSaving(true);

        try {
            const result =
                await updateMyProfile({
                    fullName,

                    // Existing email only.
                    // Developer cannot change this value.
                    email,

                    phoneNumber:
                        formData.phoneNumber.trim(),

                    bio:
                        formData.bio.trim(),

                    profileImage:
                        formData.profileImage.trim(),

                    technicalSkills:
                        formData.technicalSkills.trim(),
                });

            if (!result?.success) {
                setError(
                    result?.error ||
                        "Unable to update your profile."
                );

                return;
            }

            setSuccessMessage(
                result.message ||
                    "Profile updated successfully."
            );

            window.setTimeout(() => {
                if (
                    typeof onSuccess ===
                    "function"
                ) {
                    onSuccess();
                }
            }, 700);
        } catch (saveError) {
            console.error(
                "UPDATE DEVELOPER PROFILE ERROR:",
                saveError
            );

            setError(
                saveError?.message ||
                    "Unable to update your profile. Please try again."
            );
        } finally {
            setSaving(false);
        }
    };

    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {
        return (
            <div className="w-full rounded-2xl bg-white p-8 shadow-sm dark:bg-slate-900">
                <div className="flex min-h-100 items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <RefreshCw
                            size={28}
                            className="animate-spin text-blue-600"
                        />

                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Loading profile information...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // ========================================================
    // MAIN
    // ========================================================

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full space-y-6"
        >
            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-blue-100 p-3 dark:bg-blue-950/50">
                            <UserRound
                                size={25}
                                className="text-blue-600 dark:text-blue-400"
                            />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                                Edit My Profile
                            </h1>

                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Update your personal profile information.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={loadProfile}
                            disabled={loading || saving}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                            <RefreshCw
                                size={16}
                                className={
                                    loading
                                        ? "animate-spin"
                                        : ""
                                }
                            />
                            Refresh
                        </button>

                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={saving}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                            <X size={16} />
                            Cancel
                        </button>
                    </div>
                </div>
            </div>

            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 dark:border-red-900/50 dark:bg-red-950/30">
                    <CircleAlert
                        size={20}
                        className="mt-0.5 shrink-0 text-red-600 dark:text-red-400"
                    />

                    <div>
                        <p className="font-medium text-red-800 dark:text-red-300">
                            Unable to update profile
                        </p>

                        <p className="mt-1 text-sm text-red-700 dark:text-red-400">
                            {error}
                        </p>
                    </div>
                </div>
            )}

            {/* ==================================================
                SUCCESS
            ================================================== */}

            {successMessage && (
                <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 dark:border-emerald-900/50 dark:bg-emerald-950/30">
                    <CircleCheck
                        size={20}
                        className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400"
                    />

                    <div>
                        <p className="font-medium text-emerald-800 dark:text-emerald-300">
                            Profile updated
                        </p>

                        <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-400">
                            {successMessage}
                        </p>
                    </div>
                </div>
            )}

            {/* ==================================================
                PROFILE SUMMARY
            ================================================== */}

            <div className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-slate-900">
                <div className="bg-linear-to-r from-blue-700 to-indigo-700 px-6 py-8">
                    <div className="flex flex-col items-center gap-5 sm:flex-row">
                        <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white/80 bg-white shadow-lg">
                            {formData.profileImage ? (
                                <img
                                    src={
                                        formData.profileImage
                                    }
                                    alt={
                                        formData.fullName ||
                                        "Profile"
                                    }
                                    className="h-full w-full object-cover"
                                    onError={(event) => {
                                        event.currentTarget.style.display =
                                            "none";
                                    }}
                                />
                            ) : (
                                <span className="text-4xl font-bold text-blue-600">
                                    {(
                                        formData.fullName ||
                                        "D"
                                    )
                                        .charAt(0)
                                        .toUpperCase()}
                                </span>
                            )}
                        </div>

                        <div className="text-center sm:text-left">
                            <h2 className="text-2xl font-bold text-white">
                                {formData.fullName ||
                                    "Developer"}
                            </h2>

                            <p className="mt-1 text-blue-100">
                                {profile.role}
                            </p>

                            <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white">
                                    <CircleCheck
                                        size={14}
                                    />
                                    {
                                        profile.accountStatus
                                    }
                                </span>

                                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white">
                                    <UsersRound
                                        size={14}
                                    />
                                    {profile.team}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ==================================================
                EDITABLE INFORMATION
            ================================================== */}

            <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900">
                <div className="mb-6 flex items-center gap-3">
                    <div className="rounded-lg bg-blue-100 p-2.5 dark:bg-blue-950/40">
                        <PencilIcon />
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                            Personal Information
                        </h2>

                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Update the information you are allowed to change.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                    {/* Full Name */}

                    <div>
                        <label
                            htmlFor="fullName"
                            className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                        >
                            Full Name
                        </label>

                        <div className="relative">
                            <UserRound
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                value={
                                    formData.fullName
                                }
                                onChange={handleChange}
                                disabled={saving}
                                required
                                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:disabled:bg-slate-800"
                                placeholder="Enter your full name"
                            />
                        </div>
                    </div>

                    {/* Email - READ ONLY */}

                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                        >
                            Email Address
                        </label>

                        <div className="relative">
                            <Mail
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={
                                    formData.email
                                }
                                readOnly
                                aria-readonly="true"
                                className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 py-2.5 pl-10 pr-4 text-sm text-slate-500 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
                            />
                        </div>

                        <p className="mt-1.5 text-xs text-slate-400">
                            Email address cannot be changed from this page.
                        </p>
                    </div>

                    {/* Phone */}

                    <div>
                        <label
                            htmlFor="phoneNumber"
                            className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                        >
                            Phone Number
                        </label>

                        <div className="relative">
                            <Phone
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                id="phoneNumber"
                                name="phoneNumber"
                                type="tel"
                                value={
                                    formData.phoneNumber
                                }
                                onChange={handleChange}
                                disabled={saving}
                                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:disabled:bg-slate-800"
                                placeholder="Enter your phone number"
                            />
                        </div>
                    </div>

                    {/* Profile Image */}

                    <div>
                        <label
                            htmlFor="profileImage"
                            className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                        >
                            Profile Image URL
                        </label>

                        <div className="relative">
                            <ImageIcon
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                id="profileImage"
                                name="profileImage"
                                type="url"
                                value={
                                    formData.profileImage
                                }
                                onChange={handleChange}
                                disabled={saving}
                                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:disabled:bg-slate-800"
                                placeholder="https://example.com/profile.jpg"
                            />
                        </div>

                        <p className="mt-1.5 text-xs text-slate-400">
                            Enter a publicly accessible image URL.
                        </p>
                    </div>

                    {/* Bio */}

                    <div className="md:col-span-2">
                        <label
                            htmlFor="bio"
                            className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                        >
                            Bio
                        </label>

                        <div className="relative">
                            <FileText
                                size={18}
                                className="absolute left-3 top-3 text-slate-400"
                            />

                            <textarea
                                id="bio"
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                disabled={saving}
                                rows={5}
                                className="w-full resize-none rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:disabled:bg-slate-800"
                                placeholder="Tell us a little about yourself..."
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* ==================================================
                READ-ONLY PROFESSIONAL INFORMATION
            ================================================== */}

            <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900">
                <div className="mb-6 flex items-center gap-3">
                    <div className="rounded-lg bg-slate-100 p-2.5 dark:bg-slate-800">
                        <ShieldCheck
                            size={20}
                            className="text-slate-600 dark:text-slate-300"
                        />
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                            Account & Professional Information
                        </h2>

                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            These values are managed by the system.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    <InfoItem
                        icon={
                            <BriefcaseBusiness
                                size={18}
                            />
                        }
                        label="Role"
                        value={profile.role}
                    />

                    <InfoItem
                        icon={
                            <UsersRound size={18} />
                        }
                        label="Team"
                        value={profile.team}
                    />

                    <InfoItem
                        icon={
                            <ShieldCheck
                                size={18}
                            />
                        }
                        label="Account Status"
                        value={
                            profile.accountStatus
                        }
                    />

                    <InfoItem
                        icon={
                            <CalendarDays
                                size={18}
                            />
                        }
                        label="Account Created"
                        value={formatDate(
                            profile.accountCreatedAt
                        )}
                    />

                    <InfoItem
                        icon={
                            <Clock3 size={18} />
                        }
                        label="Last Login"
                        value={formatDateTime(
                            profile.lastLogin
                        )}
                    />

                    <InfoItem
                        icon={
                            <FolderKanban
                                size={18}
                            />
                        }
                        label="Assigned Projects"
                        value={`${profile.assignedProjects.length} project${
                            profile.assignedProjects.length ===
                            1
                                ? ""
                                : "s"
                        }`}
                    />
                </div>
            </div>

            {/* ==================================================
                TECHNICAL SKILLS
            ================================================== */}

            <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900">
                <div className="mb-5 flex items-center gap-3">
                    <div className="rounded-lg bg-purple-100 p-2.5 dark:bg-purple-950/40">
                        <Code2
                            size={20}
                            className="text-purple-600 dark:text-purple-400"
                        />
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                            Technical Skills
                        </h2>

                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Your registered technical skills and specializations.
                        </p>
                    </div>
                </div>

                {profile.technicalSkills.length >
                0 ? (
                    <div className="flex flex-wrap gap-2">
                        {profile.technicalSkills.map(
                            (skill, index) => (
                                <span
                                    key={`${skill}-${index}`}
                                    className="rounded-full bg-purple-50 px-4 py-2 text-sm font-medium text-purple-700 dark:bg-purple-950/40 dark:text-purple-300"
                                >
                                    {skill}
                                </span>
                            )
                        )}
                    </div>
                ) : (
                    <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center dark:border-slate-700">
                        <Code2
                            size={26}
                            className="mx-auto text-slate-400"
                        />

                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            No technical skills have been added yet.
                        </p>
                    </div>
                )}
            </div>

            {/* ==================================================
                SAVE / CANCEL
            ================================================== */}

            <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800/50 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Ready to save your changes?
                    </p>

                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Your changes will be saved to your account.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={saving}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                        <X size={16} />
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {saving ? (
                            <>
                                <RefreshCw
                                    size={16}
                                    className="animate-spin"
                                />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={16} />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
}

// ============================================================
// PENCIL ICON
// ============================================================

function PencilIcon() {
    return (
        <Pencil
            size={20}
            className="text-blue-600 dark:text-blue-400"
        />
    );
}

// ============================================================
// INFO ITEM
// ============================================================

function InfoItem({
    icon,
    label,
    value,
}) {
    return (
        <div className="flex items-start gap-3 rounded-xl border border-slate-100 p-4 dark:border-slate-800">
            <div className="mt-0.5 shrink-0 rounded-lg bg-slate-100 p-2 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {icon}
            </div>

            <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    {label}
                </p>

                <p className="mt-1 wrap-break-word text-sm font-medium text-slate-800 dark:text-slate-200">
                    {value}
                </p>
            </div>
        </div>
    );
}