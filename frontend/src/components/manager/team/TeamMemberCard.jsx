import React from "react";

import {
    User,
    Mail,
    BriefcaseBusiness,
    Activity,
    FolderKanban,
    Eye,
    UserPlus,
    UserMinus,
    CheckCircle2,
    Clock3,
} from "lucide-react";

function TeamMemberCard({
    member,
    onView,
    onAssign,
    onRemove,
}) {
    if (!member) {
        return null;
    }

    const name =
        member.fullName ||
        member.name ||
        "Unknown Member";

    const role =
        member.teamRole ||
        member.memberRole ||
        member.role ||
        "Contributor";

    const isActive =
        member.active !== false &&
        member.status !== "Inactive";

    const projects = Array.isArray(
        member.assignedProjects
    )
        ? member.assignedProjects
        : [];

    const tasks = Array.isArray(member.tasks)
        ? member.tasks
        : [];

    const workload =
        typeof member.workload === "number"
            ? member.workload
            : Number(member.workload || 0);

    const safeWorkload = Math.min(
        Math.max(workload, 0),
        100
    );

    const workloadColor =
        safeWorkload >= 80
            ? "bg-red-500"
            : safeWorkload >= 60
            ? "bg-amber-500"
            : "bg-emerald-500";

    const workloadText =
        safeWorkload >= 80
            ? "text-red-400"
            : safeWorkload >= 60
            ? "text-amber-400"
            : "text-emerald-400";

    return (
        <div
            className="
                group
                overflow-hidden
                rounded-2xl
                border
                border-slate-700/70
                bg-slate-900/80
                shadow-lg
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-blue-500/50
                hover:shadow-blue-950/30
            "
        >
            {/* =====================================================
                CARD CONTENT
            ===================================================== */}

            <div className="p-5">

                {/* HEADER */}

                <div className="flex items-start justify-between gap-4">

                    <div className="flex min-w-0 items-center gap-3">

                        {/* Avatar */}

                        <div
                            className="
                                flex
                                h-12
                                w-12
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-gradient-to-br
                                from-blue-600/30
                                to-indigo-600/30
                                text-blue-400
                                ring-1
                                ring-blue-500/20
                            "
                        >
                            <User size={23} />
                        </div>

                        {/* Name */}

                        <div className="min-w-0">

                            <h3 className="truncate text-base font-semibold text-white">
                                {name}
                            </h3>

                            <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-400">

                                <Mail size={14} />

                                <span className="truncate">
                                    {member.email ||
                                        "No email"}
                                </span>

                            </div>

                        </div>

                    </div>

                    {/* STATUS */}

                    <span
                        className={`
                            shrink-0
                            rounded-full
                            px-3
                            py-1
                            text-xs
                            font-medium
                            ${
                                isActive
                                    ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20"
                                    : "bg-red-500/10 text-red-400 ring-1 ring-red-500/20"
                            }
                        `}
                    >
                        {isActive
                            ? "Active"
                            : "Inactive"}
                    </span>

                </div>

                {/* ROLE + WORKLOAD */}

                <div className="mt-5 grid grid-cols-2 gap-3">

                    {/* ROLE */}

                    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">

                        <div className="flex items-center gap-2 text-xs text-slate-500">

                            <BriefcaseBusiness size={14} />

                            Role

                        </div>

                        <p className="mt-1 text-sm font-medium text-slate-200">
                            {role}
                        </p>

                    </div>

                    {/* WORKLOAD */}

                    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">

                        <div className="flex items-center gap-2 text-xs text-slate-500">

                            <Activity size={14} />

                            Workload

                        </div>

                        <p
                            className={`mt-1 text-sm font-medium ${workloadText}`}
                        >
                            {safeWorkload}%
                        </p>

                    </div>

                </div>

                {/* WORKLOAD BAR */}

                <div className="mt-4">

                    <div className="mb-2 flex items-center justify-between text-xs">

                        <span className="text-slate-500">
                            Current workload
                        </span>

                        <span
                            className={`font-medium ${workloadText}`}
                        >
                            {safeWorkload}%
                        </span>

                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-800">

                        <div
                            className={`h-full rounded-full transition-all duration-500 ${workloadColor}`}
                            style={{
                                width: `${safeWorkload}%`,
                            }}
                        />

                    </div>

                    {safeWorkload >= 80 && (
                        <p className="mt-2 text-xs text-red-400">
                            High workload — assignment may not be recommended.
                        </p>
                    )}

                </div>

                {/* ASSIGNED PROJECTS */}

                <div className="mt-4">

                    <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">

                        <FolderKanban size={14} />

                        Assigned Projects

                    </div>

                    {projects.length > 0 ? (
                        <div className="flex flex-wrap gap-2">

                            {projects
                                .slice(0, 3)
                                .map(
                                    (
                                        project,
                                        index
                                    ) => (
                                        <span
                                            key={`${project}-${index}`}
                                            className="
                                                rounded-lg
                                                border
                                                border-slate-700
                                                bg-slate-800/70
                                                px-2.5
                                                py-1
                                                text-xs
                                                text-slate-300
                                            "
                                        >
                                            {typeof project ===
                                            "string"
                                                ? project
                                                : project.name ||
                                                  "Project"}
                                        </span>
                                    )
                                )}

                            {projects.length > 3 && (
                                <span className="rounded-lg border border-slate-700 bg-slate-800/70 px-2.5 py-1 text-xs text-slate-400">
                                    +
                                    {projects.length -
                                        3}{" "}
                                    more
                                </span>
                            )}

                        </div>
                    ) : (
                        <p className="text-sm text-slate-500">
                            No assigned projects.
                        </p>
                    )}

                </div>

                {/* TASK SUMMARY */}

                <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/50 px-3 py-2.5">

                    <div className="flex items-center gap-2">

                        <Clock3
                            size={15}
                            className="text-blue-400"
                        />

                        <span className="text-xs text-slate-400">
                            Assigned Tasks
                        </span>

                    </div>

                    <span className="text-sm font-semibold text-white">
                        {tasks.length}
                    </span>

                </div>

                {/* ACTION BUTTONS */}

                <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">

                    {/* VIEW */}

                    <button
                        type="button"
                        onClick={() =>
                            onView?.(member)
                        }
                        className="
                            flex
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border
                            border-slate-700
                            bg-slate-800/70
                            px-3
                            py-2.5
                            text-sm
                            font-medium
                            text-slate-200
                            transition
                            hover:border-blue-500/50
                            hover:bg-blue-600/10
                            hover:text-blue-400
                        "
                    >
                        <Eye size={16} />

                        View
                    </button>

                    {/* ASSIGN */}

                    <button
                        type="button"
                        disabled={!isActive}
                        onClick={() =>
                            onAssign?.(member)
                        }
                        className="
                            flex
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-blue-600
                            px-3
                            py-2.5
                            text-sm
                            font-medium
                            text-white
                            transition
                            hover:bg-blue-500
                            disabled:cursor-not-allowed
                            disabled:opacity-40
                        "
                    >
                        <UserPlus size={16} />

                        Assign
                    </button>

                    {/* REMOVE */}

                    <button
                        type="button"
                        disabled={
                            !isActive ||
                            tasks.length === 0
                        }
                        onClick={() =>
                            onRemove?.(member)
                        }
                        className="
                            flex
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border
                            border-red-500/30
                            bg-red-500/10
                            px-3
                            py-2.5
                            text-sm
                            font-medium
                            text-red-400
                            transition
                            hover:border-red-500/50
                            hover:bg-red-500/20
                            disabled:cursor-not-allowed
                            disabled:opacity-40
                        "
                    >
                        <UserMinus size={16} />

                        Remove
                    </button>

                </div>

            </div>

            {/* ACTIVE INDICATOR */}

            {isActive && (
                <div className="border-t border-slate-800 bg-slate-950/30 px-5 py-2">

                    <div className="flex items-center gap-2 text-xs text-emerald-400">

                        <CheckCircle2 size={13} />

                        Available for team management

                    </div>

                </div>
            )}

        </div>
    );
}

export default TeamMemberCard;