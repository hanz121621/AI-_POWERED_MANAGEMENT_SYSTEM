import { useEffect, useState } from "react";
import {
    UserRound,
    Mail,
    Phone,
    Briefcase,
    UsersRound,
    BadgeCheck,
    RefreshCw,
    Code2,
    FileText,
    FolderKanban,
    AlertCircle,
} from "lucide-react";

import api from "../../../../services/api";

// ============================================================
// AIPMS — STAFF VIEW PROFILE
//
// Backend:
// GET /api/users/profile
//
// Source of truth:
// Backend / Database
//
// Authentication:
// Existing JWT handled by api.js
//
// Important:
// - Profile data is NOT read from localStorage.
// - The backend identifies the authenticated user from JWT.
// - Team and contributor classification come from UserDto.
// ============================================================

function ViewStaffProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =========================================================
    // LOAD PROFILE FROM BACKEND
    // =========================================================

    const loadProfile = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/users/profile");

            const user = response.data;

            setProfile({
                id: user.id,

                fullName:
                    user.fullName ||
                    "Staff Member",

                email:
                    user.email ||
                    "Not provided",

                phone:
                    user.phoneNumber ||
                    "Not provided",

                role:
                    formatRole(user.role),

                isActive:
                    user.isActive,

                team:
                    user.teamName ||
                    "Not assigned",

                contributorType:
                    user.contributorTypeName ||
                    "Not specified",

                contributorSubType:
                    user.contributorSubTypeName ||
                    "Not specified",

                technicalSkills:
                    user.technicalSkills ||
                    "Not provided",

                bio:
                    user.bio ||
                    "No bio provided",

                profileImage:
                    user.profileImage ||
                    null,

                assignedProjects:
                    Array.isArray(user.assignedProjects)
                        ? user.assignedProjects
                        : [],

                createdAt:
                    user.createdAt,

                updatedAt:
                    user.updatedAt,
            });
        } catch (err) {
            console.error(
                "Failed to load staff profile:",
                err
            );

            const message =
                err?.response?.data?.message ||
                err?.response?.data?.Message ||
                "Failed to load your profile. Please try again.";

            setError(message);
            setProfile(null);
        } finally {
            setLoading(false);
        }
    };

    // =========================================================
    // LOAD PROFILE WHEN COMPONENT MOUNTS
    // =========================================================

    useEffect(() => {
        loadProfile();
    }, []);

    // =========================================================
    // LOADING STATE
    // =========================================================

    if (loading) {
        return (
            <div className="flex min-h-[300px] items-center justify-center">
                <div className="flex items-center gap-3 text-blue-300">
                    <RefreshCw className="h-5 w-5 animate-spin" />

                    <span>
                        Loading profile...
                    </span>
                </div>
            </div>
        );
    }

    // =========================================================
    // ERROR STATE
    // =========================================================

    if (error) {
        return (
            <div className="w-full">

                {/* HEADER */}

                <div className="mb-6">
                    <div className="flex items-center gap-3">

                        <div className="rounded-xl bg-blue-600/20 p-3">
                            <UserRound className="h-6 w-6 text-blue-400" />
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-white">
                                My Profile
                            </h2>

                            <p className="text-sm text-slate-400">
                                View your staff profile information.
                            </p>
                        </div>

                    </div>
                </div>

                {/* ERROR CARD */}

                <div className="rounded-2xl border border-red-900/50 bg-[#071a2d] p-6">

                    <div className="flex items-start gap-3">

                        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />

                        <div>
                            <h3 className="font-medium text-red-300">
                                Unable to load profile
                            </h3>

                            <p className="mt-1 text-sm text-slate-400">
                                {error}
                            </p>
                        </div>

                    </div>

                    <div className="mt-5 flex justify-end">

                        <button
                            type="button"
                            onClick={loadProfile}
                            className="inline-flex items-center gap-2 rounded-lg border border-blue-800 bg-[#0b2038] px-4 py-2 text-sm font-medium text-blue-300 transition hover:bg-blue-900/40"
                        >
                            <RefreshCw className="h-4 w-4" />

                            Try Again
                        </button>

                    </div>

                </div>
            </div>
        );
    }

    // =========================================================
    // PROFILE
    // =========================================================

    return (
        <div className="w-full">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="mb-6">

                <div className="flex items-center gap-3">

                    <div className="rounded-xl bg-blue-600/20 p-3">
                        <UserRound className="h-6 w-6 text-blue-400" />
                    </div>

                    <div>

                        <h2 className="text-xl font-semibold text-white">
                            My Profile
                        </h2>

                        <p className="text-sm text-slate-400">
                            View your staff profile information.
                        </p>

                    </div>

                </div>

            </div>

            {/* =================================================
                MAIN PROFILE CARD
            ================================================= */}

            <div className="rounded-2xl border border-blue-900/60 bg-[#071a2d] p-6">

                {/* =================================================
                    PROFILE HEADER
                ================================================= */}

                <div className="mb-6 flex flex-col items-center gap-4 border-b border-blue-900/50 pb-6 sm:flex-row">

                    {/* PROFILE IMAGE */}

                    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-600/20">

                        {profile?.profileImage ? (
                            <img
                                src={profile.profileImage}
                                alt={profile.fullName}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <UserRound className="h-10 w-10 text-blue-400" />
                        )}

                    </div>

                    {/* NAME / ROLE */}

                    <div className="text-center sm:text-left">

                        <h3 className="text-xl font-semibold text-white">
                            {profile?.fullName}
                        </h3>

                        <div className="mt-1 flex flex-wrap items-center justify-center gap-2 text-sm text-blue-300 sm:justify-start">

                            <BadgeCheck className="h-4 w-4" />

                            <span>
                                {profile?.role}
                            </span>

                            <span className="text-slate-600">
                                •
                            </span>

                            <span
                                className={
                                    profile?.isActive
                                        ? "text-emerald-400"
                                        : "text-red-400"
                                }
                            >
                                {profile?.isActive
                                    ? "Active"
                                    : "Inactive"}
                            </span>

                        </div>

                    </div>

                </div>

                {/* =================================================
                    BASIC INFORMATION
                ================================================= */}

                <div className="mb-4">

                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                        Basic Information
                    </h3>

                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                    <ProfileItem
                        icon={UserRound}
                        label="Full Name"
                        value={profile?.fullName}
                    />

                    <ProfileItem
                        icon={Mail}
                        label="Email"
                        value={profile?.email}
                    />

                    <ProfileItem
                        icon={Phone}
                        label="Phone"
                        value={profile?.phone}
                    />

                    <ProfileItem
                        icon={BadgeCheck}
                        label="Role"
                        value={profile?.role}
                    />

                    <ProfileItem
                        icon={UsersRound}
                        label="Team"
                        value={profile?.team}
                    />

                    <ProfileItem
                        icon={Briefcase}
                        label="Contributor Type"
                        value={profile?.contributorType}
                    />

                    <ProfileItem
                        icon={Briefcase}
                        label="Contributor Sub Type"
                        value={profile?.contributorSubType}
                    />

                    <ProfileItem
                        icon={Code2}
                        label="Technical Skills"
                        value={profile?.technicalSkills}
                    />

                </div>

                {/* =================================================
                    BIO
                ================================================= */}

                <div className="mt-6">

                    <ProfileItem
                        icon={FileText}
                        label="Bio"
                        value={profile?.bio}
                    />

                </div>

                {/* =================================================
                    ASSIGNED PROJECTS
                ================================================= */}

                <div className="mt-6 border-t border-blue-900/50 pt-6">

                    <div className="mb-4 flex items-center gap-2">

                        <FolderKanban className="h-5 w-5 text-blue-400" />

                        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                            Assigned Projects
                        </h3>

                    </div>

                    {profile?.assignedProjects?.length > 0 ? (

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                            {profile.assignedProjects.map(
                                (project) => (
                                    <ProjectItem
                                        key={project.id}
                                        project={project}
                                    />
                                )
                            )}

                        </div>

                    ) : (

                        <div className="rounded-xl border border-blue-900/50 bg-[#0b2038] p-4 text-sm text-slate-400">
                            No projects are currently assigned to you.
                        </div>

                    )}

                </div>

                {/* =================================================
                    REFRESH
                ================================================= */}

                <div className="mt-6 flex justify-end">

                    <button
                        type="button"
                        onClick={loadProfile}
                        disabled={loading}
                        className="inline-flex items-center gap-2 rounded-lg border border-blue-800 bg-[#0b2038] px-4 py-2 text-sm font-medium text-blue-300 transition hover:bg-blue-900/40 disabled:cursor-not-allowed disabled:opacity-50"
                    >

                        <RefreshCw
                            className={`h-4 w-4 ${
                                loading
                                    ? "animate-spin"
                                    : ""
                            }`}
                        />

                        Refresh

                    </button>

                </div>

            </div>

        </div>
    );
}

// ============================================================
// PROFILE ITEM
// ============================================================

function ProfileItem({
    icon: Icon,
    label,
    value,
}) {
    return (
        <div className="rounded-xl border border-blue-900/50 bg-[#0b2038] p-4">

            <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">

                <Icon className="h-4 w-4 text-blue-400" />

                <span>
                    {label}
                </span>

            </div>

            <p className="break-words whitespace-pre-wrap text-sm font-medium text-white">
                {value || "Not provided"}
            </p>

        </div>
    );
}

// ============================================================
// PROJECT ITEM
// ============================================================

function ProjectItem({ project }) {
    return (
        <div className="rounded-xl border border-blue-900/50 bg-[#0b2038] p-4">

            <div className="flex items-start justify-between gap-3">

                <div>

                    <h4 className="font-medium text-white">
                        {project.name || "Unnamed Project"}
                    </h4>

                    {project.description && (
                        <p className="mt-1 line-clamp-2 text-sm text-slate-400">
                            {project.description}
                        </p>
                    )}

                </div>

                <span className="shrink-0 rounded-full bg-blue-600/20 px-2.5 py-1 text-xs text-blue-300">
                    {formatPriority(project.priority)}
                </span>

            </div>

            <div className="mt-4">

                <div className="mb-1 flex items-center justify-between text-xs">

                    <span className="text-slate-400">
                        Progress
                    </span>

                    <span className="text-blue-300">
                        {Number(
                            project.progressPercentage || 0
                        ).toFixed(0)}
                        %
                    </span>

                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-800">

                    <div
                        className="h-full rounded-full bg-blue-500 transition-all"
                        style={{
                            width: `${Math.min(
                                Math.max(
                                    Number(
                                        project.progressPercentage || 0
                                    ),
                                    0
                                ),
                                100
                            )}%`,
                        }}
                    />

                </div>

            </div>

        </div>
    );
}

// ============================================================
// ROLE FORMATTER
// ============================================================

function formatRole(role) {
    if (
        role === null ||
        role === undefined
    ) {
        return "Staff";
    }

    if (typeof role === "string") {
        return role;
    }

    // Handles numeric C# enum values if the API
    // serializes Role as a number.
    const roles = {
        0: "Admin",
        1: "Manager",
        2: "Contributor",
        3: "Staff",
        4: "Developer",
        5: "Team Leader",
    };

    return roles[role] || "Staff";
}

// ============================================================
// PROJECT PRIORITY FORMATTER
// ============================================================

function formatPriority(priority) {
    if (
        priority === null ||
        priority === undefined
    ) {
        return "Priority";
    }

    if (typeof priority === "string") {
        return priority;
    }

    const priorities = {
        0: "Low",
        1: "Medium",
        2: "High",
    };

    return priorities[priority] || "Priority";
}

export default ViewStaffProfile;