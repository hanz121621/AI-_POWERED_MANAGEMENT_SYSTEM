
import { useMemo, useState } from "react";
import {
    UsersRound,
    UserRound,
    ShieldCheck,
    BriefcaseBusiness,
    Search,
    CircleDot,
    CheckCircle2,
    Clock3,
    UserPlus,
    X,
} from "lucide-react";

const initialTeam = {
    id: null,
    name: "Assigned Team",
    projectName: "AI-Powered Project Management System",
    members: [],
};

function StatCard({ icon: Icon, label, value, description }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">
                        {label}
                    </p>
                    <h3 className="mt-2 text-2xl font-bold text-slate-900">
                        {value}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                        {description}
                    </p>
                </div>

                <div className="rounded-xl bg-slate-100 p-3">
                    <Icon className="h-5 w-5 text-slate-700" />
                </div>
            </div>
        </div>
    );
}

function normalizeMember(member) {
    const name =
        member?.name ??
        member?.Name ??
        member?.fullName ??
        member?.FullName ??
        "Contributor";

    return {
        id:
            member?.id ??
            member?.Id ??
            member?.userId ??
            member?.UserId ??
            member?.contributorId ??
            member?.ContributorId,
        name,
        role:
            member?.role ??
            member?.Role ??
            member?.contributorType ??
            member?.ContributorType ??
            "Contributor",
        specialization:
            member?.specialization ??
            member?.Specialization ??
            member?.skill ??
            member?.Skill ??
            "Not specified",
        status:
            member?.status ??
            member?.Status ??
            "Active",
        workload: Number(
            member?.workload ??
                member?.Workload ??
                member?.activeTasks ??
                member?.ActiveTasks ??
                0
        ),
        avatar:
            member?.avatar ??
            member?.Avatar ??
            name
                .slice(0, 2)
                .toUpperCase(),
    };
}

function normalizeTeam(team) {
    const source = team?.data ?? team?.team ?? team ?? {};

    const rawMembers =
        source?.members ??
        source?.Members ??
        source?.teamMembers ??
        source?.TeamMembers ??
        [];

    return {
        id:
            source?.id ??
            source?.Id ??
            source?.teamId ??
            source?.TeamId ??
            null,
        name:
            source?.name ??
            source?.Name ??
            source?.teamName ??
            source?.TeamName ??
            "Assigned Team",
        projectName:
            source?.projectName ??
            source?.ProjectName ??
            source?.project?.name ??
            source?.Project?.Name ??
            "AI-Powered Project Management System",
        members: Array.isArray(rawMembers)
            ? rawMembers.map(normalizeMember)
            : [],
    };
}

export default function ViewAssignedTeam({
    team = initialTeam,
    onAddMember,
}) {
    const [search, setSearch] = useState("");
    const [selectedMember, setSelectedMember] = useState(null);

    const normalizedTeam = useMemo(
        () => normalizeTeam(team),
        [team]
    );

    const members = normalizedTeam.members ?? [];

    const filteredMembers = useMemo(() => {
        const term = search.trim().toLowerCase();

        if (!term) {
            return members;
        }

        return members.filter((member) =>
            [
                member.name,
                member.role,
                member.specialization,
                member.status,
            ]
                .join(" ")
                .toLowerCase()
                .includes(term)
        );
    }, [members, search]);

    const activeMembers = members.filter(
        (member) =>
            String(member.status).toLowerCase() === "active"
    ).length;

    const totalWorkload = members.reduce(
        (total, member) =>
            total + Number(member.workload || 0),
        0
    );

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
                            <UsersRound className="h-4 w-4" />
                            Team Management
                        </div>

                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                            Assigned Team
                        </h1>

                        <p className="mt-1 max-w-2xl text-sm text-slate-500">
                            View your assigned team, team members, roles,
                            specializations, and current workload.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onAddMember}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                    >
                        <UserPlus className="h-4 w-4" />
                        Request Add Member
                    </button>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-slate-100 p-3">
                            <BriefcaseBusiness className="h-5 w-5 text-slate-700" />
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Assigned Project
                            </p>

                            <h2 className="mt-1 font-semibold text-slate-900">
                                {normalizedTeam.projectName}
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        icon={UsersRound}
                        label="Team Members"
                        value={members.length}
                        description="Current team size"
                    />

                    <StatCard
                        icon={CheckCircle2}
                        label="Active Members"
                        value={activeMembers}
                        description="Currently participating"
                    />

                    <StatCard
                        icon={Clock3}
                        label="Current Workload"
                        value={totalWorkload}
                        description="Active assigned tasks"
                    />

                    <StatCard
                        icon={ShieldCheck}
                        label="Team Status"
                        value={members.length > 0 ? "Active" : "No Team"}
                        description="Current assignment"
                    />
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 p-5">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    {normalizedTeam.name}
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Team members and current contributor
                                    classifications.
                                </p>
                            </div>

                            <div className="relative w-full md:w-72">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Search team members..."
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-[850px] w-full">
                            <thead className="bg-slate-50">
                                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    <th className="px-5 py-4">
                                        Member
                                    </th>

                                    <th className="px-5 py-4">
                                        Type
                                    </th>

                                    <th className="px-5 py-4">
                                        Specialization
                                    </th>

                                    <th className="px-5 py-4">
                                        Workload
                                    </th>

                                    <th className="px-5 py-4">
                                        Status
                                    </th>

                                    <th className="px-5 py-4">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {filteredMembers.map((member) => (
                                    <tr
                                        key={member.id ?? member.name}
                                        className="transition hover:bg-slate-50"
                                    >
                                        <td className="px-5 py-4">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setSelectedMember(member)
                                                }
                                                className="flex items-center gap-3 text-left"
                                            >
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                                                    {member.avatar ||
                                                        member.name
                                                            .slice(0, 2)
                                                            .toUpperCase()}
                                                </div>

                                                <div>
                                                    <p className="font-semibold text-slate-900">
                                                        {member.name}
                                                    </p>

                                                    <p className="text-xs text-slate-500">
                                                        View member details
                                                    </p>
                                                </div>
                                            </button>
                                        </td>

                                        <td className="px-5 py-4 text-sm text-slate-600">
                                            {member.role}
                                        </td>

                                        <td className="px-5 py-4 text-sm text-slate-600">
                                            {member.specialization}
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className="font-semibold text-slate-900">
                                                {member.workload}
                                            </span>

                                            <span className="ml-1 text-xs text-slate-500">
                                                active
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                                <CircleDot className="h-3 w-3" />
                                                {member.status}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setSelectedMember(member)
                                                }
                                                className="text-sm font-semibold text-slate-700 hover:text-slate-950"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredMembers.length === 0 && (
                        <div className="p-10 text-center">
                            <UserRound className="mx-auto h-8 w-8 text-slate-300" />

                            <p className="mt-3 text-sm font-medium text-slate-700">
                                No team members found
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                No assigned contributors are currently
                                available.
                            </p>
                        </div>
                    )}
                </div>

                {selectedMember && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
                        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                                        {selectedMember.avatar}
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-slate-900">
                                            {selectedMember.name}
                                        </h3>

                                        <p className="text-sm text-slate-500">
                                            {selectedMember.role}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelectedMember(null)
                                    }
                                    className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-3">
                                <div className="rounded-xl bg-slate-50 p-4">
                                    <p className="text-xs text-slate-500">
                                        Specialization
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-slate-900">
                                        {selectedMember.specialization}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-slate-50 p-4">
                                    <p className="text-xs text-slate-500">
                                        Workload
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-slate-900">
                                        {selectedMember.workload} active tasks
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
