import { useEffect, useState } from "react";

import {
    UserRound,
    Mail,
    Phone,
    ShieldCheck,
    UsersRound,
    FolderKanban,
    Code2,
    CalendarDays,
    Clock3,
    CircleCheck,
    CircleAlert,
    Pencil,
    RefreshCw,
    BriefcaseBusiness,
} from "lucide-react";

import { getMyProfile } from "@/services/userService";

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
        return skills.filter(Boolean);
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
        return "Developer";
    }

    if (user.fullName) {
        return user.fullName;
    }

    if (user.name) {
        return user.name;
    }

    const firstName = user.firstName || "";
    const lastName = user.lastName || "";

    const fullName = `${firstName} ${lastName}`.trim();

    return fullName || "Developer";
};

const normalizeRole = (user) => {
    if (!user) {
        return "Developer";
    }

    const role = user.role || user.rawRole;

    if (typeof role === "number") {
        if (role === 1) {
            return "Admin";
        }

        if (role === 2) {
            return "Manager";
        }

        if (role === 3) {
            return "Developer";
        }
    }

    const normalizedRole = String(role || "")
        .trim()
        .toLowerCase();

    if (
        normalizedRole === "admin" ||
        normalizedRole === "administrator"
    ) {
        return "Admin";
    }

    if (normalizedRole === "manager") {
        return "Manager";
    }

    if (
        normalizedRole === "developer" ||
        normalizedRole === "contributor" ||
        normalizedRole === "staff"
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
// COMPONENT
// ============================================================

export default function ViewDeveloperProfile({ onEdit }) {
    const [profile, setProfile] = useState(EMPTY_PROFILE);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [lastLoaded, setLastLoaded] = useState(null);

    // ========================================================
    // LOAD PROFILE FROM BACKEND
    // ========================================================

    const loadProfile = async () => {
        setLoading(true);
        setError("");

        try {
            const user = await getMyProfile();

            if (!user) {
                setProfile(EMPTY_PROFILE);
                setError("Profile not found.");
                return;
            }

            // ------------------------------------------------
            // Assigned projects
            // ------------------------------------------------

            const projects =
                user.assignedProjects ||
                user.projects ||
                user.projectAssignments ||
                [];

            const normalizedProjects = Array.isArray(projects)
                ? projects
                : [];

            // ------------------------------------------------
            // Technical skills
            // ------------------------------------------------

            const skills = normalizeSkills(
                user.technicalSkills ||
                    user.skills ||
                    user.specializations
            );

            // ------------------------------------------------
            // Normalize backend profile
            // ------------------------------------------------

            const normalizedProfile = {
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

                assignedProjects: normalizedProjects,

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

            setProfile(normalizedProfile);
            setLastLoaded(new Date());
        } catch (loadError) {
            console.error(
                "LOAD DEVELOPER PROFILE ERROR:",
                loadError
            );

            setProfile(EMPTY_PROFILE);

            setError(
                loadError?.message ||
                    "Unable to load profile information. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // ========================================================
    // INITIAL BACKEND LOAD
    // ========================================================
    //
    // The initial request is performed asynchronously so the
    // effect itself does not synchronously invoke a function
    // containing setState().
    //
    // ========================================================

    useEffect(() => {
        let cancelled = false;

        const loadInitialProfile = async () => {
            setLoading(true);
            setError("");

            try {
                const user = await getMyProfile();

                if (cancelled) {
                    return;
                }

                if (!user) {
                    setProfile(EMPTY_PROFILE);
                    setError("Profile not found.");
                    return;
                }

                const projects =
                    user.assignedProjects ||
                    user.projects ||
                    user.projectAssignments ||
                    [];

                const normalizedProjects = Array.isArray(
                    projects
                )
                    ? projects
                    : [];

                const skills = normalizeSkills(
                    user.technicalSkills ||
                        user.skills ||
                        user.specializations
                );

                const normalizedProfile = {
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
                        normalizedProjects,

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

                setProfile(normalizedProfile);
                setLastLoaded(new Date());
            } catch (loadError) {
                if (cancelled) {
                    return;
                }

                console.error(
                    "INITIAL DEVELOPER PROFILE LOAD ERROR:",
                    loadError
                );

                setProfile(EMPTY_PROFILE);

                setError(
                    loadError?.message ||
                        "Unable to load profile information. Please try again."
                );
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadInitialProfile();

        return () => {
            cancelled = true;
        };
    }, []);

    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {
        return (
            <div className="min-h-100 w-full rounded-2xl bg-white p-8 shadow-sm dark:bg-slate-900">
                <div className="flex min-h-75 items-center justify-center">
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
    // ERROR
    // ========================================================

    if (error) {
        return (
            <div className="min-h-100 w-full rounded-2xl bg-white p-8 shadow-sm dark:bg-slate-900">
                <div className="flex min-h-75 flex-col items-center justify-center text-center">
                    <div className="mb-4 rounded-full bg-red-100 p-4 dark:bg-red-950/40">
                        <CircleAlert
                            size={34}
                            className="text-red-600 dark:text-red-400"
                        />
                    </div>

                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                        Profile not found
                    </h2>

                    <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={loadProfile}
                        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                        <RefreshCw size={16} />
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // ========================================================
    // MAIN PROFILE
    // ========================================================

    return (
        <div className="w-full space-y-6">
            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-blue-100 p-3 dark:bg-blue-950/50">
                                <UserRound
                                    size={25}
                                    className="text-blue-600 dark:text-blue-400"
                                />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                                    My Profile
                                </h1>

                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    View your personal and professional
                                    information.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={loadProfile}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                            <RefreshCw size={16} />
                            Refresh
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                if (
                                    typeof onEdit === "function"
                                ) {
                                    onEdit(profile);
                                }
                            }}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                        >
                            <Pencil size={16} />
                            Edit Profile
                        </button>
                    </div>
                </div>
            </div>

            {/* ==================================================
                PROFILE SUMMARY
            ================================================== */}

            <div className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-slate-900">
                <div className="bg-linear-to-r from-blue-700 to-indigo-700 px-6 py-8">
                    <div className="flex flex-col items-center gap-5 sm:flex-row">
                        {/* Profile picture */}

                        <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white/80 bg-white shadow-lg">
                            {profile.profilePicture ? (
                                <img
                                    src={profile.profilePicture}
                                    alt={profile.fullName}
                                    className="h-full w-full object-cover"
                                    onError={(event) => {
                                        event.currentTarget.style.display =
                                            "none";
                                    }}
                                />
                            ) : (
                                <span className="text-4xl font-bold text-blue-600">
                                    {profile.fullName
                                        .charAt(0)
                                        .toUpperCase()}
                                </span>
                            )}
                        </div>

                        <div className="text-center sm:text-left">
                            <h2 className="text-2xl font-bold text-white">
                                {profile.fullName}
                            </h2>

                            <p className="mt-1 text-blue-100">
                                {profile.role}
                            </p>

                            <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white">
                                    <CircleCheck size={14} />
                                    {profile.accountStatus}
                                </span>

                                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white">
                                    <UsersRound size={14} />
                                    {profile.team}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ==================================================
                    BASIC INFORMATION
                ================================================== */}

                <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2 xl:grid-cols-3">
                    <InfoItem
                        icon={<UserRound size={18} />}
                        label="Full Name"
                        value={profile.fullName}
                    />

                    <InfoItem
                        icon={<Mail size={18} />}
                        label="Email Address"
                        value={
                            profile.email || "Not available"
                        }
                    />

                    <InfoItem
                        icon={<Phone size={18} />}
                        label="Phone Number"
                        value={
                            profile.phone || "Not available"
                        }
                    />

                    <InfoItem
                        icon={<BriefcaseBusiness size={18} />}
                        label="Role"
                        value={profile.role}
                    />

                    <InfoItem
                        icon={<UsersRound size={18} />}
                        label="Team"
                        value={profile.team}
                    />

                    <InfoItem
                        icon={<ShieldCheck size={18} />}
                        label="Account Status"
                        value={profile.accountStatus}
                    />

                    <InfoItem
                        icon={<CalendarDays size={18} />}
                        label="Account Created"
                        value={formatDate(
                            profile.accountCreatedAt
                        )}
                    />

                    <InfoItem
                        icon={<Clock3 size={18} />}
                        label="Last Login"
                        value={formatDateTime(
                            profile.lastLogin
                        )}
                    />

                    <InfoItem
                        icon={<FolderKanban size={18} />}
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
                            Your registered technical skills and
                            specializations.
                        </p>
                    </div>
                </div>

                {profile.technicalSkills.length > 0 ? (
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
                            No technical skills have been added
                            yet.
                        </p>
                    </div>
                )}
            </div>

            {/* ==================================================
                ASSIGNED PROJECTS
            ================================================== */}

            <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900">
                <div className="mb-5 flex items-center gap-3">
                    <div className="rounded-lg bg-emerald-100 p-2.5 dark:bg-emerald-950/40">
                        <FolderKanban
                            size={20}
                            className="text-emerald-600 dark:text-emerald-400"
                        />
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                            Assigned Projects
                        </h2>

                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Projects currently assigned to you.
                        </p>
                    </div>
                </div>

                {profile.assignedProjects.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {profile.assignedProjects.map(
                            (project, index) => {
                                const projectName =
                                    typeof project ===
                                    "string"
                                        ? project
                                        : project?.name ||
                                          project?.projectName ||
                                          `Project ${
                                              index + 1
                                          }`;

                                const projectStatus =
                                    typeof project ===
                                    "object"
                                        ? project?.status ||
                                          project?.projectStatus ||
                                          "Assigned"
                                        : "Assigned";

                                return (
                                    <div
                                        key={
                                            project?.id ||
                                            project?.projectId ||
                                            index
                                        }
                                        className="rounded-xl border border-slate-200 p-4 transition hover:border-blue-300 hover:shadow-sm dark:border-slate-700 dark:hover:border-blue-700"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <h3 className="font-semibold text-slate-900 dark:text-white">
                                                    {
                                                        projectName
                                                    }
                                                </h3>

                                                {typeof project ===
                                                    "object" &&
                                                    project?.description && (
                                                        <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                                                            {
                                                                project.description
                                                            }
                                                        </p>
                                                    )}
                                            </div>

                                            <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                                                {
                                                    projectStatus
                                                }
                                            </span>
                                        </div>
                                    </div>
                                );
                            }
                        )}
                    </div>
                ) : (
                    <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
                        <FolderKanban
                            size={30}
                            className="mx-auto text-slate-400"
                        />

                        <p className="mt-3 font-medium text-slate-700 dark:text-slate-300">
                            No assigned projects available.
                        </p>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Projects assigned to you will
                            appear here.
                        </p>
                    </div>
                )}
            </div>

            {/* ==================================================
                FOOTER
            ================================================== */}

            <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm dark:border-slate-700 dark:bg-slate-800/50 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-slate-500 dark:text-slate-400">
                    Profile information is read-only from this
                    page.
                </span>

                {lastLoaded && (
                    <span className="text-xs text-slate-400">
                        Last refreshed:{" "}
                        {formatDateTime(lastLoaded)}
                    </span>
                )}
            </div>
        </div>
    );
}

// ============================================================
// INFO ITEM
// ============================================================

function InfoItem({ icon, label, value }) {
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