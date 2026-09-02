import React from "react";
import {
    Users,
    User,
    UserRound,
    BriefcaseBusiness,
    Activity,
    ListTodo,
    ShieldCheck,
    FolderKanban,
    AlertTriangle,
} from "lucide-react";

function ViewAssignedTeam({
    selectedTeam,
    selectedProject,
    loading = false,
    error = null,
}) {
    if (loading) {
        return (
            <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-10 text-center">
                <Activity className="mx-auto animate-pulse text-blue-400" size={32} />
                <p className="mt-3 text-sm text-slate-400">
                    Loading assigned team...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
                <div className="flex items-center gap-3">
                    <AlertTriangle className="text-red-400" size={20} />
                    <div>
                        <h3 className="font-semibold text-white">
                            Unable to load team
                        </h3>
                        <p className="mt-1 text-sm text-slate-400">
                            {error}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (!selectedTeam) {
        return (
            <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-10 text-center">
                <Users
                    size={42}
                    className="mx-auto text-slate-600"
                />

                <h3 className="mt-4 text-lg font-semibold text-white">
                    No Assigned Team
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                    No team is currently assigned to the selected project.
                </p>
            </div>
        );
    }

    const members = Array.isArray(selectedTeam.members)
        ? selectedTeam.members
        : [];

    const teamLeader =
        selectedTeam.teamLeader ||
        members.find(
            (member) =>
                member.isTeamLeader === true ||
                member.isLeader === true ||
                member.role === "Team Leader"
        ) ||
        null;

    const developers = members.filter((member) => {
        const classification = String(
            member.contributorType ||
                member.contributorClassification ||
                member.classification ||
                ""
        ).toLowerCase();

        return (
            classification.includes("developer") ||
            String(member.role || "").toLowerCase() === "developer"
        );
    });

    const staff = members.filter((member) => {
        const classification = String(
            member.contributorType ||
                member.contributorClassification ||
                member.classification ||
                ""
        ).toLowerCase();

        return (
            classification.includes("staff") ||
            String(member.role || "").toLowerCase() === "staff"
        );
    });

    const totalTasks = members.reduce(
        (total, member) =>
            total +
            (Array.isArray(member.tasks)
                ? member.tasks.length
                : 0),
        0
    );

    const averageWorkload =
        members.length > 0
            ? Math.round(
                  members.reduce(
                      (total, member) =>
                          total +
                          Math.min(
                              Math.max(
                                  Number(member.workload || 0),
                                  0
                              ),
                              100
                          ),
                      0
                  ) / members.length
              )
            : null;

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div>
                <h2 className="text-xl font-semibold text-white">
                    Assigned Team
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                    View the team assigned to your authorized project.
                </p>
            </div>

            {/* PROJECT / TEAM SUMMARY */}
            <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10">
                            <Users
                                size={26}
                                className="text-blue-400"
                            />
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-white">
                                {selectedTeam.name || "Unnamed Team"}
                            </h3>

                            {selectedProject && (
                                <p className="mt-1 flex items-center gap-2 text-sm text-slate-400">
                                    <FolderKanban size={14} />
                                    {selectedProject.name}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
                        <div className="flex items-center gap-2">
                            <ShieldCheck
                                size={16}
                                className="text-emerald-400"
                            />

                            <span className="text-sm text-emerald-400">
                                Authorized Team
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* TEAM STATS */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Team Members"
                    value={members.length}
                    icon={Users}
                />

                <StatCard
                    title="Developers"
                    value={developers.length}
                    icon={UserRound}
                />

                <StatCard
                    title="Staff"
                    value={staff.length}
                    icon={BriefcaseBusiness}
                />

                <StatCard
                    title="Assigned Work"
                    value={totalTasks}
                    icon={ListTodo}
                />
            </div>

            {/* TEAM LEADER */}
            <div className="rounded-2xl border border-indigo-500/20 bg-slate-900/80 p-6">
                <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10">
                        <ShieldCheck
                            size={20}
                            className="text-indigo-400"
                        />
                    </div>

                    <div>
                        <h3 className="font-semibold text-white">
                            Team Leader
                        </h3>

                        <p className="text-sm text-slate-500">
                            Current Team leadership relationship
                        </p>
                    </div>
                </div>

                {teamLeader ? (
                    <MemberCard member={teamLeader} leader />
                ) : (
                    <p className="text-sm text-slate-500">
                        No Team Leader is currently assigned.
                    </p>
                )}
            </div>

            {/* MEMBERS */}
            <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-6">
                <div className="mb-5">
                    <h3 className="font-semibold text-white">
                        Team Members
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                        Current developers, staff and contributor classifications.
                    </p>
                </div>

                {members.length === 0 ? (
                    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-8 text-center">
                        <Users
                            size={30}
                            className="mx-auto text-slate-600"
                        />

                        <p className="mt-3 text-sm text-slate-500">
                            No members are currently assigned to this team.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        {members.map((member) => (
                            <MemberCard
                                key={member.id}
                                member={member}
                                leader={
                                    member.id === teamLeader?.id
                                }
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* WORKLOAD */}
            <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-6">
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold text-white">
                            Current Workload
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                            Workload calculated from current assigned work.
                        </p>
                    </div>

                    <Activity className="text-blue-400" size={21} />
                </div>

                <div className="space-y-5">
                    {members.map((member) => {
                        const workload = Math.min(
                            Math.max(
                                Number(member.workload || 0),
                                0
                            ),
                            100
                        );

                        return (
                            <div key={member.id}>
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-sm font-medium text-white">
                                        {member.name || "Unnamed Member"}
                                    </span>

                                    <span className="text-sm text-slate-400">
                                        {workload}%
                                    </span>
                                </div>

                                <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                                    <div
                                        className={`h-full rounded-full ${
                                            workload >= 80
                                                ? "bg-red-500"
                                                : workload >= 60
                                                ? "bg-amber-500"
                                                : "bg-emerald-500"
                                        }`}
                                        style={{
                                            width: `${workload}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-6 border-t border-slate-800 pt-5">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">
                            Average Team Workload
                        </span>

                        <span className="font-semibold text-white">
                            {averageWorkload === null
                                ? "Unavailable"
                                : `${averageWorkload}%`}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MemberCard({ member, leader = false }) {
    const tasks = Array.isArray(member.tasks)
        ? member.tasks
        : [];

    const classification =
        member.contributorType ||
        member.contributorClassification ||
        member.classification ||
        "Not classified";

    return (
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 font-semibold text-blue-400">
                        {member.name
                            ?.charAt(0)
                            ?.toUpperCase() || (
                            <User size={18} />
                        )}
                    </div>

                    <div>
                        <h4 className="font-semibold text-white">
                            {member.name || "Unnamed Member"}
                        </h4>

                        <p className="text-xs text-slate-500">
                            {member.email || "No email available"}
                        </p>
                    </div>
                </div>

                {leader && (
                    <span className="rounded-full bg-indigo-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase text-indigo-400">
                        Team Leader
                    </span>
                )}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
                <InfoItem
                    label="Role"
                    value={member.role || "Not specified"}
                />

                <InfoItem
                    label="Classification"
                    value={classification}
                />

                <InfoItem
                    label="Workload"
                    value={`${Number(member.workload || 0)}%`}
                />

                <InfoItem
                    label="Assigned Work"
                    value={tasks.length}
                />
            </div>
        </div>
    );
}

function InfoItem({ label, value }) {
    return (
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-3">
            <p className="text-[10px] uppercase tracking-wide text-slate-600">
                {label}
            </p>

            <p className="mt-1 text-sm font-medium text-slate-300">
                {value}
            </p>
        </div>
    );
}

function StatCard({ title, value, icon: Icon }) {
    return (
        <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-5">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                        {title}
                    </p>

                    <p className="mt-2 text-2xl font-bold text-white">
                        {value}
                    </p>
                </div>

                <Icon
                    size={22}
                    className="text-blue-400"
                />
            </div>
        </div>
    );
}

export default ViewAssignedTeam;