import React, { useMemo } from "react";
import {
    ShieldCheck,
    ListTodo,
    CheckCircle2,
    Clock3,
    Ban,
    AlertTriangle,
    Activity,
    Users,
    Target,
    CalendarDays,
} from "lucide-react";

function MonitorTeamLeaderWork({
    selectedTeam,
    selectedProject,
    sprints = [],
    tasks = [],
    loading = false,
    error = null,
}) {
    if (loading) {
        return (
            <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-10 text-center">
                <Activity
                    size={32}
                    className="mx-auto animate-pulse text-blue-400"
                />

                <p className="mt-3 text-sm text-slate-400">
                    Loading Team Leader work...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
                <div className="flex gap-3">
                    <AlertTriangle
                        size={20}
                        className="text-red-400"
                    />

                    <p className="text-sm text-slate-300">
                        {error}
                    </p>
                </div>
            </div>
        );
    }

    if (!selectedTeam) {
        return (
            <EmptyState message="No assigned Team is available for monitoring." />
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
        );

    if (!teamLeader) {
        return (
            <EmptyState message="No Team Leader is currently assigned to this Team." />
        );
    }

    const teamId = selectedTeam.id;
    const projectId = selectedProject?.id;

    const teamSprints = useMemo(() => {
        return (Array.isArray(sprints) ? sprints : []).filter(
            (sprint) => {
                const matchesTeam =
                    sprint.teamId == null ||
                    String(sprint.teamId) === String(teamId);

                const matchesProject =
                    projectId == null ||
                    sprint.projectId == null ||
                    String(sprint.projectId) ===
                        String(projectId);

                return matchesTeam && matchesProject;
            }
        );
    }, [sprints, teamId, projectId]);

    const activeSprint =
        teamSprints.find(
            (sprint) =>
                String(sprint.status || "").toLowerCase() ===
                "active"
        ) ||
        teamSprints.find(
            (sprint) =>
                String(sprint.status || "").toLowerCase() ===
                "in progress"
        ) ||
        null;

    const leaderTasks = useMemo(() => {
        return (Array.isArray(tasks) ? tasks : []).filter(
            (task) => {
                const matchesTeam =
                    task.teamId == null ||
                    String(task.teamId) === String(teamId);

                const matchesProject =
                    projectId == null ||
                    task.projectId == null ||
                    String(task.projectId) ===
                        String(projectId);

                const matchesSprint =
                    !activeSprint ||
                    task.sprintId == null ||
                    String(task.sprintId) ===
                        String(activeSprint.id);

                return (
                    matchesTeam &&
                    matchesProject &&
                    matchesSprint
                );
            }
        );
    }, [tasks, teamId, projectId, activeSprint]);

    const stats = calculateTaskStats(leaderTasks);

    const teamWorkload = calculateTeamWorkload(members);

    const progress =
        leaderTasks.length > 0
            ? Math.round(
                  (stats.completed /
                      leaderTasks.length) *
                      100
              )
            : null;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-white">
                    Monitor Team Leader Work
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                    Monitor Sprint and task management without modifying
                    Team Leader assignments.
                </p>
            </div>

            {/* WORKFLOW NOTICE */}
            <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-5">
                <div className="flex gap-4">
                    <ShieldCheck
                        size={21}
                        className="mt-0.5 shrink-0 text-indigo-400"
                    />

                    <div>
                        <h3 className="font-semibold text-indigo-300">
                            Monitoring Access
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-slate-400">
                            Manager → Sprint → Team → Team Leader →
                            Tasks → Developer / Staff
                        </p>

                        <p className="mt-2 text-xs text-slate-500">
                            This interface is read-only. Task creation,
                            assignment and reassignment remain the
                            responsibility of the Team Leader.
                        </p>
                    </div>
                </div>
            </div>

            {/* LEADER */}
            <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-6">
                <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-lg font-bold text-indigo-400">
                        {teamLeader.name
                            ?.charAt(0)
                            ?.toUpperCase() || "?"}
                    </div>

                    <div>
                        <p className="text-xs uppercase tracking-wide text-slate-600">
                            Team Leader
                        </p>

                        <h3 className="mt-1 text-lg font-semibold text-white">
                            {teamLeader.name}
                        </h3>

                        <p className="text-sm text-slate-500">
                            {teamLeader.email}
                        </p>
                    </div>
                </div>
            </div>

            {/* SPRINT */}
            <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-6">
                <div className="flex items-center gap-3">
                    <CalendarDays
                        size={20}
                        className="text-blue-400"
                    />

                    <div>
                        <h3 className="font-semibold text-white">
                            Active Sprint
                        </h3>

                        <p className="text-sm text-slate-500">
                            Sprint currently assigned to the Team.
                        </p>
                    </div>
                </div>

                {activeSprint ? (
                    <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h4 className="font-semibold text-white">
                                    {activeSprint.name ||
                                        activeSprint.title}
                                </h4>

                                <p className="mt-1 text-sm text-slate-500">
                                    {activeSprint.startDate || "Start date unavailable"}
                                    {" → "}
                                    {activeSprint.endDate || "End date unavailable"}
                                </p>
                            </div>

                            <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
                                {activeSprint.status ||
                                    "Active"}
                            </span>
                        </div>
                    </div>
                ) : (
                    <p className="mt-5 text-sm text-slate-500">
                        No active Sprint is currently available.
                    </p>
                )}
            </div>

            {/* TASK STATS */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
                <MetricCard
                    title="Tasks"
                    value={leaderTasks.length}
                    icon={ListTodo}
                />

                <MetricCard
                    title="Completed"
                    value={stats.completed}
                    icon={CheckCircle2}
                />

                <MetricCard
                    title="In Progress"
                    value={stats.inProgress}
                    icon={Clock3}
                />

                <MetricCard
                    title="Blocked"
                    value={stats.blocked}
                    icon={Ban}
                />

                <MetricCard
                    title="Overdue"
                    value={stats.overdue}
                    icon={AlertTriangle}
                />
            </div>

            {/* PROGRESS */}
            <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold text-white">
                            Team Leader Progress
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                            Based on current Sprint and task records.
                        </p>
                    </div>

                    <Target className="text-indigo-400" />
                </div>

                <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm text-slate-400">
                            Completion
                        </span>

                        <span className="text-sm font-semibold text-white">
                            {progress === null
                                ? "Unavailable"
                                : `${progress}%`}
                        </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                        {progress !== null && (
                            <div
                                className="h-full rounded-full bg-indigo-500"
                                style={{
                                    width: `${progress}%`,
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* TEAM WORKLOAD */}
            <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-6">
                <div className="flex items-center gap-3">
                    <Users className="text-blue-400" size={21} />

                    <div>
                        <h3 className="font-semibold text-white">
                            Team Workload
                        </h3>

                        <p className="text-sm text-slate-500">
                            Current workload of Team members.
                        </p>
                    </div>
                </div>

                <div className="mt-5 space-y-4">
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
                                <div className="mb-2 flex justify-between">
                                    <span className="text-sm text-white">
                                        {member.name}
                                    </span>

                                    <span className="text-sm text-slate-400">
                                        {workload}%
                                    </span>
                                </div>

                                <div className="h-2 rounded-full bg-slate-800">
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

                <div className="mt-5 border-t border-slate-800 pt-4 text-sm text-slate-400">
                    Average workload:{" "}
                    <span className="font-semibold text-white">
                        {teamWorkload === null
                            ? "Unavailable"
                            : `${teamWorkload}%`}
                    </span>
                </div>
            </div>

            {/* TASK LIST */}
            <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-6">
                <div className="mb-5 flex items-center gap-3">
                    <ListTodo
                        size={21}
                        className="text-blue-400"
                    />

                    <div>
                        <h3 className="font-semibold text-white">
                            Team Leader Managed Tasks
                        </h3>

                        <p className="text-sm text-slate-500">
                            Current tasks within the authorized Team/Sprint.
                        </p>
                    </div>
                </div>

                {leaderTasks.length === 0 ? (
                    <p className="text-sm text-slate-500">
                        No task records are available for the selected
                        Team/Sprint.
                    </p>
                ) : (
                    <div className="space-y-3">
                        {leaderTasks.map((task) => (
                            <div
                                key={task.id}
                                className="rounded-xl border border-slate-800 bg-slate-950/60 p-4"
                            >
                                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                    <div>
                                        <p className="font-medium text-white">
                                            {task.title ||
                                                task.name ||
                                                "Untitled Task"}
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500">
                                            Assigned to:{" "}
                                            {task.assignedToName ||
                                                task.assigneeName ||
                                                task.assignedTo ||
                                                "Unassigned"}
                                        </p>
                                    </div>

                                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                                        {task.status ||
                                            "Status unavailable"}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function calculateTaskStats(tasks) {
    const now = new Date();

    return tasks.reduce(
        (stats, task) => {
            const status = String(
                task.status || ""
            ).toLowerCase();

            if (
                status === "completed" ||
                status === "done"
            ) {
                stats.completed += 1;
            }

            if (
                status === "in progress" ||
                status === "in-progress"
            ) {
                stats.inProgress += 1;
            }

            if (
                status === "blocked" ||
                status === "blocked"
            ) {
                stats.blocked += 1;
            }

            const deadline =
                task.dueDate ||
                task.deadline ||
                task.endDate;

            if (
                deadline &&
                ![
                    "completed",
                    "done",
                    "cancelled",
                    "canceled",
                ].includes(status) &&
                new Date(deadline) < now
            ) {
                stats.overdue += 1;
            }

            return stats;
        },
        {
            completed: 0,
            inProgress: 0,
            blocked: 0,
            overdue: 0,
        }
    );
}

function calculateTeamWorkload(members) {
    if (!members.length) {
        return null;
    }

    return Math.round(
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
    );
}

function MetricCard({ title, value, icon: Icon }) {
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

function EmptyState({ message }) {
    return (
        <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-10 text-center">
            <Users
                size={38}
                className="mx-auto text-slate-600"
            />

            <p className="mt-4 text-sm text-slate-400">
                {message}
            </p>
        </div>
    );
}

export default MonitorTeamLeaderWork;