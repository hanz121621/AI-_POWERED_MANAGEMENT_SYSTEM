
import { useEffect, useMemo, useState } from "react";
import {
    UsersRound,
    UserRound,
    Search,
    ShieldCheck,
    Code2,
    BriefcaseBusiness,
    AlertCircle,
    Loader2,
    Eye,
    X,
} from "lucide-react";


const DEMO_TEAM = [
    {
        id: 1,
        name: "Abebe Kebede",
        email: "abebe@example.com",
        contributorType: "Team Leader",
        specialization: "Project Management",
        responsibility: "Coordinates team work",
        status: "Active",
    },
    {
        id: 2,
        name: "Hana Nigusse",
        email: "hana@example.com",
        contributorType: "Developer",
        specialization: "Frontend Development",
        responsibility: "Frontend implementation",
        status: "Active",
    },
    {
        id: 3,
        name: "Meron Tesfaye",
        email: "meron@example.com",
        contributorType: "Developer",
        specialization: "Backend Development",
        responsibility: "Backend implementation",
        status: "Active",
    },
    {
        id: 4,
        name: "Sara Alemu",
        email: "sara@example.com",
        contributorType: "Staff",
        specialization: "Documentation",
        responsibility: "Project documentation",
        status: "Active",
    },
];

// ============================================================
// HELPERS
// ============================================================

function getRoleIcon(role) {
    switch (role) {
        case "Team Leader":
            return ShieldCheck;

        case "Developer":
            return Code2;

        case "Staff":
            return BriefcaseBusiness;

        default:
            return UserRound;
    }
}

function getRoleLabel(role) {
    return role || "Contributor";
}

// ============================================================
// COMPONENT
// ============================================================

export default function ViewProjectTeam({
    projectId,
    projectName = "My Project",
    team = DEMO_TEAM,
}) {
    const [members, setMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMember, setSelectedMember] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ========================================================
    // LOAD PROJECT TEAM
    // ========================================================

    useEffect(() => {
        let mounted = true;

        const loadTeam = async () => {
            try {
                setLoading(true);
                setError("");

                // ------------------------------------------------
                // BACKEND INTEGRATION PLACE
                // ------------------------------------------------
                //
                // Later replace this with:
                //
                // const response = await projectService
                //     .getProjectTeam(projectId);
                //
                // setMembers(response.data);
                //
                // ------------------------------------------------

                await new Promise((resolve) => setTimeout(resolve, 300));

                if (mounted) {
                    setMembers(Array.isArray(team) ? team : []);
                }
            } catch (err) {
                console.error("Unable to load project team:", err);

                if (mounted) {
                    setError(
                        "Project team information is currently unavailable."
                    );
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        loadTeam();

        return () => {
            mounted = false;
        };
    }, [projectId, team]);

    // ========================================================
    // SEARCH
    // ========================================================

    const filteredMembers = useMemo(() => {
        const value = searchTerm.trim().toLowerCase();

        if (!value) {
            return members;
        }

        return members.filter((member) => {
            return (
                member.name?.toLowerCase().includes(value) ||
                member.contributorType?.toLowerCase().includes(value) ||
                member.specialization?.toLowerCase().includes(value) ||
                member.responsibility?.toLowerCase().includes(value)
            );
        });
    }, [members, searchTerm]);

    // ========================================================
    // VIEW MEMBER
    // ========================================================

    const handleViewMember = (member) => {
        // Only permitted profile information is placed in
        // selectedMember.
        setSelectedMember({
            id: member.id,
            name: member.name,
            contributorType: member.contributorType,
            specialization: member.specialization,
            responsibility: member.responsibility,
            status: member.status,
        });
    };

    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {
        return (
            <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-slate-200 bg-white">
                <div className="flex items-center gap-3 text-slate-600">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Loading project team...</span>
                </div>
            </div>
        );
    }

    // ========================================================
    // ERROR
    // ========================================================

    if (error) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 text-red-600" />

                    <div>
                        <h3 className="font-semibold text-red-800">
                            Unable to load project team
                        </h3>

                        <p className="mt-1 text-sm text-red-700">
                            {error}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // ========================================================
    // MAIN UI
    // ========================================================

    return (
        <div className="space-y-6">
            {/* =================================================
                HEADER
            ================================================= */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                            <UsersRound className="h-6 w-6 text-blue-600" />
                        </div>

                        <div>
                            <h1 className="text-xl font-bold text-slate-900">
                                Project Team
                            </h1>

                            <p className="mt-1 text-sm text-slate-500">
                                {projectName}
                            </p>
                        </div>
                    </div>

                    <div className="rounded-lg bg-slate-50 px-4 py-2">
                        <span className="text-sm text-slate-500">
                            Team Members
                        </span>

                        <span className="ml-2 font-semibold text-slate-900">
                            {members.length}
                        </span>
                    </div>
                </div>
            </div>

            {/* =================================================
                SEARCH
            ================================================= */}

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(event) =>
                            setSearchTerm(event.target.value)
                        }
                        placeholder="Search team members..."
                        className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>
            </div>

            {/* =================================================
                NO TEAM
            ================================================= */}

            {members.length === 0 && (
                <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                    <UsersRound className="mx-auto h-10 w-10 text-slate-400" />

                    <h3 className="mt-4 font-semibold text-slate-800">
                        No team information available
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                        Project team information is currently unavailable.
                    </p>
                </div>
            )}

            {/* =================================================
                NO SEARCH RESULTS
            ================================================= */}

            {members.length > 0 && filteredMembers.length === 0 && (
                <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                    <Search className="mx-auto h-10 w-10 text-slate-400" />

                    <h3 className="mt-4 font-semibold text-slate-800">
                        No team members found
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                        Try another search term.
                    </p>
                </div>
            )}

            {/* =================================================
                TEAM TABLE
            ================================================= */}

            {filteredMembers.length > 0 && (
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[850px]">
                            <thead className="bg-slate-50">
                                <tr className="border-b border-slate-200">
                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Team Member
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Contributor Type
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Specialization
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Responsibility
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Status
                                    </th>

                                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {filteredMembers.map((member) => {
                                    const RoleIcon = getRoleIcon(
                                        member.contributorType
                                    );

                                    return (
                                        <tr
                                            key={member.id}
                                            className="transition hover:bg-slate-50"
                                        >
                                            {/* MEMBER */}

                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                                                        <UserRound className="h-5 w-5 text-blue-600" />
                                                    </div>

                                                    <div>
                                                        <p className="font-medium text-slate-900">
                                                            {member.name}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* TYPE */}

                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <RoleIcon className="h-4 w-4 text-slate-500" />

                                                    <span className="text-sm text-slate-700">
                                                        {getRoleLabel(
                                                            member.contributorType
                                                        )}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* SPECIALIZATION */}

                                            <td className="px-6 py-4">
                                                <span className="text-sm text-slate-700">
                                                    {member.specialization ||
                                                        "Not specified"}
                                                </span>
                                            </td>

                                            {/* RESPONSIBILITY */}

                                            <td className="px-6 py-4">
                                                <span className="text-sm text-slate-600">
                                                    {member.responsibility ||
                                                        "Not specified"}
                                                </span>
                                            </td>

                                            {/* STATUS */}

                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                                                        member.status ===
                                                        "Active"
                                                            ? "bg-green-50 text-green-700"
                                                            : "bg-slate-100 text-slate-600"
                                                    }`}
                                                >
                                                    {member.status ||
                                                        "Unknown"}
                                                </span>
                                            </td>

                                            {/* ACTION */}

                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleViewMember(
                                                            member
                                                        )
                                                    }
                                                    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* =================================================
                MEMBER DETAILS MODAL
            ================================================= */}

            {selectedMember && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
                        {/* MODAL HEADER */}

                        <div className="flex items-center justify-between border-b border-slate-200 p-5">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    Team Member Details
                                </h2>

                                <p className="text-sm text-slate-500">
                                    Authorized project information
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setSelectedMember(null)}
                                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                                aria-label="Close"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* MODAL CONTENT */}

                        <div className="space-y-5 p-6">
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
                                    <UserRound className="h-7 w-7 text-blue-600" />
                                </div>

                                <div>
                                    <h3 className="font-semibold text-slate-900">
                                        {selectedMember.name}
                                    </h3>

                                    <p className="text-sm text-slate-500">
                                        {selectedMember.contributorType}
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-lg bg-slate-50 p-4">
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                        Contributor Type
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-slate-900">
                                        {selectedMember.contributorType}
                                    </p>
                                </div>

                                <div className="rounded-lg bg-slate-50 p-4">
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                        Specialization
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-slate-900">
                                        {selectedMember.specialization ||
                                            "Not specified"}
                                    </p>
                                </div>

                                <div className="rounded-lg bg-slate-50 p-4 sm:col-span-2">
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                        Project Responsibility
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-slate-900">
                                        {selectedMember.responsibility ||
                                            "Not specified"}
                                    </p>
                                </div>

                                <div className="rounded-lg bg-slate-50 p-4 sm:col-span-2">
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                        Status
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-slate-900">
                                        {selectedMember.status || "Unknown"}
                                    </p>
                                </div>
                            </div>

                            {/* IMPORTANT:
                                Email and other private information are
                                intentionally not displayed here.
                            */}

                            <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                                <p className="text-sm text-blue-800">
                                    Only authorized project profile
                                    information is displayed. Restricted
                                    personal information remains protected.
                                </p>
                            </div>
                        </div>

                        {/* MODAL FOOTER */}

                        <div className="flex justify-end border-t border-slate-200 p-5">
                            <button
                                type="button"
                                onClick={() => setSelectedMember(null)}
                                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

