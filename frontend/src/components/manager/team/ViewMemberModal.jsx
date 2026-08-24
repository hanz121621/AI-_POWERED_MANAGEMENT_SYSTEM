import React, { useMemo, useState } from "react";
import {
    Users,
    UserRound,
    BriefcaseBusiness,
    Activity,
    Search,
    ChevronDown,
    ChevronUp,
    Mail,
    Phone,
    FolderKanban,
    Clock3,
    ShieldCheck,
    AlertCircle,
    RefreshCw,
} from "lucide-react";

const ViewTeamMembers = ({
    teams = [],
    loading = false,
    error = "",
    onRetry,
}) => {
    const [selectedTeamId, setSelectedTeamId] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMember, setSelectedMember] = useState(null);

    /*
    ============================================================
    DEMO TEAM DATA
    ============================================================
    This component is UI-ready.

    Later, teamService.js can provide the real database/API data.
    ============================================================
    */

    const defaultTeams = [
        {
            id: 1,
            name: "AI Development Team",
            description:
                "Team responsible for developing AI-powered project management features.",
            manager: "Manager",
            members: [
                {
                    id: 101,
                    name: "Abebe Kebede",
                    email: "abebe@africom.com",
                    phone: "+251 911 000 001",
                    role: "Developer",
                    status: "Active",
                    workload: 75,
                    assignedProjects: [
                        "AI-Powered Project Management System",
                    ],
                },
                {
                    id: 102,
                    name: "Hana Tesfaye",
                    email: "hana@africom.com",
                    phone: "+251 911 000 002",
                    role: "Contributor",
                    status: "Active",
                    workload: 60,
                    assignedProjects: [
                        "AI-Powered Project Management System",
                        "FieldSync",
                    ],
                },
                {
                    id: 103,
                    name: "Dawit Solomon",
                    email: "dawit@africom.com",
                    phone: "+251 911 000 003",
                    role: "Developer",
                    status: "Active",
                    workload: 85,
                    assignedProjects: [
                        "FieldSync",
                    ],
                },
            ],
        },
    ];

    const availableTeams =
        teams.length > 0 ? teams : defaultTeams;

    /*
    ============================================================
    SELECT FIRST TEAM
    ============================================================
    */

    React.useEffect(() => {
        if (
            !selectedTeamId &&
            availableTeams.length > 0
        ) {
            setSelectedTeamId(
                String(availableTeams[0].id)
            );
        }
    }, [availableTeams, selectedTeamId]);

    /*
    ============================================================
    CURRENT TEAM
    ============================================================
    */

    const selectedTeam = useMemo(() => {
        return availableTeams.find(
            (team) =>
                String(team.id) ===
                String(selectedTeamId)
        );
    }, [availableTeams, selectedTeamId]);

    /*
    ============================================================
    FILTER MEMBERS
    ============================================================
    */

    const filteredMembers = useMemo(() => {
        if (!selectedTeam?.members) {
            return [];
        }

        const search = searchTerm
            .trim()
            .toLowerCase();

        if (!search) {
            return selectedTeam.members;
        }

        return selectedTeam.members.filter(
            (member) =>
                member.name
                    ?.toLowerCase()
                    .includes(search) ||
                member.email
                    ?.toLowerCase()
                    .includes(search) ||
                member.role
                    ?.toLowerCase()
                    .includes(search)
        );
    }, [selectedTeam, searchTerm]);

    /*
    ============================================================
    TEAM STATISTICS
    ============================================================
    */

    const totalMembers =
        selectedTeam?.members?.length ?? 0;

    const activeMembers =
        selectedTeam?.members?.filter(
            (member) =>
                member.status === "Active"
        ).length ?? 0;

    const averageWorkload =
        totalMembers > 0
            ? Math.round(
                  selectedTeam.members.reduce(
                      (total, member) =>
                          total +
                          Number(
                              member.workload || 0
                          ),
                      0
                  ) / totalMembers
              )
            : 0;

    /*
    ============================================================
    NO TEAM ASSIGNED
    ============================================================
    */

    if (!loading && availableTeams.length === 0) {
        return (
            <div className="w-full">
                <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-10 text-center shadow-xl">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10">
                        <Users className="h-8 w-8 text-blue-400" />
                    </div>

                    <h2 className="text-xl font-semibold text-white">
                        No assigned team found
                    </h2>

                    <p className="mt-2 text-sm text-slate-400">
                        You currently do not have a team assigned
                        to your projects.
                    </p>
                </div>
            </div>
        );
    }

    /*
    ============================================================
    LOADING
    ============================================================
    */

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-slate-700 bg-slate-900/80">
                <div className="text-center">
                    <RefreshCw className="mx-auto h-8 w-8 animate-spin text-blue-400" />

                    <p className="mt-4 text-sm text-slate-400">
                        Loading team members...
                    </p>
                </div>
            </div>
        );
    }

    /*
    ============================================================
    ERROR
    ============================================================
    */

    if (error) {
        return (
            <div className="rounded-2xl border border-red-500/20 bg-slate-900/80 p-10 text-center">
                <AlertCircle className="mx-auto h-10 w-10 text-red-400" />

                <h2 className="mt-4 text-lg font-semibold text-white">
                    Unable to load team members
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                    {error ||
                        "Unable to load team members. Please try again."}
                </p>

                {onRetry && (
                    <button
                        type="button"
                        onClick={onRetry}
                        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Try Again
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="w-full space-y-6">
            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10">
                            <Users className="h-6 w-6 text-blue-400" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-white">
                                Team Management
                            </h1>

                            <p className="mt-1 text-sm text-slate-400">
                                View your assigned team members,
                                workload and project assignments.
                            </p>
                        </div>
                    </div>
                </div>

                {/* TEAM SELECTOR */}

                <div className="relative min-w-[240px]">
                    <select
                        value={selectedTeamId}
                        onChange={(event) => {
                            setSelectedTeamId(
                                event.target.value
                            );
                            setSelectedMember(null);
                            setSearchTerm("");
                        }}
                        className="w-full appearance-none rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 pr-10 text-sm font-medium text-white outline-none transition focus:border-blue-500"
                    >
                        {availableTeams.map((team) => (
                            <option
                                key={team.id}
                                value={team.id}
                            >
                                {team.name}
                            </option>
                        ))}
                    </select>

                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
            </div>

            {/* ==================================================
                TEAM INFORMATION
            ================================================== */}

            {selectedTeam && (
                <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-6 shadow-xl">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10">
                                    <BriefcaseBusiness className="h-6 w-6 text-indigo-400" />
                                </div>

                                <div>
                                    <h2 className="text-xl font-semibold text-white">
                                        {selectedTeam.name}
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-400">
                                        {selectedTeam.description ||
                                            "No team description available."}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2">
                            <ShieldCheck className="h-4 w-4 text-emerald-400" />

                            <span className="text-sm font-medium text-emerald-400">
                                Assigned Team
                            </span>
                        </div>
                    </div>

                    {/* TEAM STATS */}

                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="rounded-xl border border-slate-700 bg-slate-950/50 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-slate-500">
                                        Team Members
                                    </p>

                                    <p className="mt-2 text-2xl font-bold text-white">
                                        {totalMembers}
                                    </p>
                                </div>

                                <Users className="h-6 w-6 text-blue-400" />
                            </div>
                        </div>

                        <div className="rounded-xl border border-slate-700 bg-slate-950/50 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-slate-500">
                                        Active Members
                                    </p>

                                    <p className="mt-2 text-2xl font-bold text-white">
                                        {activeMembers}
                                    </p>
                                </div>

                                <Activity className="h-6 w-6 text-emerald-400" />
                            </div>
                        </div>

                        <div className="rounded-xl border border-slate-700 bg-slate-950/50 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-slate-500">
                                        Avg. Workload
                                    </p>

                                    <p className="mt-2 text-2xl font-bold text-white">
                                        {averageWorkload}%
                                    </p>
                                </div>

                                <Clock3 className="h-6 w-6 text-amber-400" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ==================================================
                SEARCH
            ================================================== */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-white">
                        Team Members
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                        Review members, roles, projects and
                        current workload.
                    </p>
                </div>

                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(event) =>
                            setSearchTerm(
                                event.target.value
                            )
                        }
                        placeholder="Search team members..."
                        className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-blue-500"
                    />
                </div>
            </div>

            {/* ==================================================
                NO MEMBERS
            ================================================== */}

            {filteredMembers.length === 0 ? (
                <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-10 text-center">
                    <Users className="mx-auto h-10 w-10 text-slate-600" />

                    <h3 className="mt-4 text-lg font-semibold text-white">
                        No team members available
                    </h3>

                    <p className="mt-2 text-sm text-slate-400">
                        No members match your current search.
                    </p>
                </div>
            ) : (
                /* ==================================================
                   MEMBER CARDS
                ================================================== */

                <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                    {filteredMembers.map((member) => {
                        const isSelected =
                            selectedMember?.id === member.id;

                        return (
                            <div
                                key={member.id}
                                className={`overflow-hidden rounded-2xl border bg-slate-900/80 shadow-lg transition ${
                                    isSelected
                                        ? "border-blue-500/60"
                                        : "border-slate-700 hover:border-slate-600"
                                }`}
                            >
                                <div className="p-5">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-lg font-bold text-white">
                                                {member.name
                                                    ?.charAt(0)
                                                    ?.toUpperCase() ||
                                                    "U"}
                                            </div>

                                            <div>
                                                <h3 className="font-semibold text-white">
                                                    {member.name}
                                                </h3>

                                                <p className="mt-1 text-sm text-slate-400">
                                                    {member.email}
                                                </p>
                                            </div>
                                        </div>

                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                member.status ===
                                                "Active"
                                                    ? "bg-emerald-500/10 text-emerald-400"
                                                    : "bg-slate-700 text-slate-300"
                                            }`}
                                        >
                                            {member.status ||
                                                "Unknown"}
                                        </span>
                                    </div>

                                    {/* ROLE */}

                                    <div className="mt-5 flex flex-wrap gap-2">
                                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-400">
                                            <UserRound className="h-3.5 w-3.5" />
                                            {member.role ||
                                                "Contributor"}
                                        </span>

                                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-slate-300">
                                            <BriefcaseBusiness className="h-3.5 w-3.5" />
                                            Team Member
                                        </span>
                                    </div>

                                    {/* WORKLOAD */}

                                    <div className="mt-5">
                                        <div className="mb-2 flex items-center justify-between">
                                            <span className="text-xs font-medium text-slate-400">
                                                Current Workload
                                            </span>

                                            <span className="text-xs font-semibold text-white">
                                                {member.workload ??
                                                    0}
                                                %
                                            </span>
                                        </div>

                                        <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                                            <div
                                                className={`h-full rounded-full transition-all ${
                                                    Number(
                                                        member.workload
                                                    ) >= 80
                                                        ? "bg-red-500"
                                                        : Number(
                                                              member.workload
                                                          ) >=
                                                          60
                                                        ? "bg-amber-500"
                                                        : "bg-emerald-500"
                                                }`}
                                                style={{
                                                    width: `${Math.min(
                                                        Math.max(
                                                            Number(
                                                                member.workload ||
                                                                    0
                                                            ),
                                                            0
                                                        ),
                                                        100
                                                    )}%`,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* PROJECTS */}

                                    <div className="mt-5">
                                        <div className="mb-2 flex items-center gap-2">
                                            <FolderKanban className="h-4 w-4 text-slate-500" />

                                            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                                Assigned Projects
                                            </span>
                                        </div>

                                        <div className="space-y-2">
                                            {member.assignedProjects
                                                ?.slice(0, 2)
                                                .map(
                                                    (
                                                        project,
                                                        index
                                                    ) => (
                                                        <div
                                                            key={
                                                                index
                                                            }
                                                            className="rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm text-slate-300"
                                                        >
                                                            {project}
                                                        </div>
                                                    )
                                                )}

                                            {(!member.assignedProjects ||
                                                member
                                                    .assignedProjects
                                                    .length ===
                                                    0) && (
                                                <p className="text-sm text-slate-500">
                                                    No projects assigned.
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* VIEW DETAILS */}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSelectedMember(
                                                isSelected
                                                    ? null
                                                    : member
                                            )
                                        }
                                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/70 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-blue-500/50 hover:bg-slate-800 hover:text-white"
                                    >
                                        {isSelected
                                            ? "Hide Details"
                                            : "View Member Details"}

                                        {isSelected ? (
                                            <ChevronUp className="h-4 w-4" />
                                        ) : (
                                            <ChevronDown className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>

                                {/* ==================================================
                                   MEMBER DETAILS
                                ================================================== */}

                                {isSelected && (
                                    <div className="border-t border-slate-700 bg-slate-950/60 p-5">
                                        <h4 className="mb-4 text-sm font-semibold text-white">
                                            Member Information
                                        </h4>

                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                            <div className="rounded-lg border border-slate-800 bg-slate-900 p-3">
                                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                                    <Mail className="h-3.5 w-3.5" />
                                                    Email
                                                </div>

                                                <p className="mt-1 text-sm text-slate-300">
                                                    {member.email ||
                                                        "Not provided"}
                                                </p>
                                            </div>

                                            <div className="rounded-lg border border-slate-800 bg-slate-900 p-3">
                                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                                    <Phone className="h-3.5 w-3.5" />
                                                    Phone
                                                </div>

                                                <p className="mt-1 text-sm text-slate-300">
                                                    {member.phone ||
                                                        "Not provided"}
                                                </p>
                                            </div>

                                            <div className="rounded-lg border border-slate-800 bg-slate-900 p-3">
                                                <div className="text-xs text-slate-500">
                                                    Role
                                                </div>

                                                <p className="mt-1 text-sm font-medium text-white">
                                                    {member.role ||
                                                        "Contributor"}
                                                </p>
                                            </div>

                                            <div className="rounded-lg border border-slate-800 bg-slate-900 p-3">
                                                <div className="text-xs text-slate-500">
                                                    Status
                                                </div>

                                                <p className="mt-1 text-sm font-medium text-emerald-400">
                                                    {member.status ||
                                                        "Unknown"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ViewTeamMembers;