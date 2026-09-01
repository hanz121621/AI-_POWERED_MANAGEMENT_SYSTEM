
import React from "react";
import {
    X,
    FolderKanban,
    CalendarDays,
    Users,
    Activity,
    CheckCircle2,
    Clock,
    AlertCircle,
} from "lucide-react";

function ViewAssignedProjects({
    projects = [],
    currentManager,
    onClose,
    onSelectProject,
}) {
    const assignedProjects = projects.filter(
        (project) =>
            project.managerId === currentManager?.id
    );

    // ============================================================
    // STATUS STYLES
    // ============================================================

    const statusStyles = {
        Active: {
            className:
                "border-green-200 bg-green-50 text-green-700",
            icon: CheckCircle2,
        },

        Planning: {
            className:
                "border-blue-200 bg-blue-50 text-blue-700",
            icon: Clock,
        },

        Completed: {
            className:
                "border-slate-200 bg-slate-100 text-slate-700",
            icon: CheckCircle2,
        },

        OnHold: {
            className:
                "border-yellow-200 bg-yellow-50 text-yellow-700",
            icon: AlertCircle,
        },

        Cancelled: {
            className:
                "border-red-200 bg-red-50 text-red-700",
            icon: AlertCircle,
        },
    };

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">

            <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">

                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600">
                            <FolderKanban size={20} />
                        </div>

                        <div>

                            <h2 className="text-lg font-bold text-slate-900">
                                Assigned Projects
                            </h2>

                            <p className="mt-0.5 text-sm text-slate-500">
                                Projects currently assigned to you.
                            </p>

                        </div>

                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>

                </div>

                {/* ==================================================
                    CONTENT
                ================================================== */}

                <div className="overflow-y-auto bg-slate-50 px-6 py-6">

                    {/* PROJECT COUNT */}

                    <div className="mb-5 flex items-center justify-between">

                        <div>
                            <p className="text-sm font-semibold text-slate-900">
                                Your Projects
                            </p>

                            <p className="mt-0.5 text-xs text-slate-500">
                                {assignedProjects.length}{" "}
                                {assignedProjects.length === 1
                                    ? "project"
                                    : "projects"}{" "}
                                assigned
                            </p>
                        </div>

                    </div>

                    {/* ==================================================
                        EMPTY STATE
                    ================================================== */}

                    {assignedProjects.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">

                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                                <FolderKanban size={28} />
                            </div>

                            <h3 className="mt-4 text-base font-bold text-slate-900">
                                No Assigned Projects
                            </h3>

                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                                You currently have no projects assigned
                                to you. Projects assigned to you will
                                appear here.
                            </p>

                        </div>
                    ) : (

                        /* ==================================================
                            PROJECT GRID
                        ================================================== */

                        <div className="grid gap-4 md:grid-cols-2">

                            {assignedProjects.map(
                                (project) => {

                                    const status =
                                        statusStyles[
                                            project.status
                                        ] ||
                                        statusStyles.Planning;

                                    const StatusIcon =
                                        status.icon;

                                    const progress = Math.max(
                                        0,
                                        Math.min(
                                            100,
                                            Number(
                                                project.progress
                                            ) || 0
                                        )
                                    );

                                    return (
                                        <button
                                            key={project.id}
                                            type="button"
                                            onClick={() =>
                                                onSelectProject?.(
                                                    project
                                                )
                                            }
                                            className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-blue-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-100"
                                        >

                                            {/* PROJECT HEADER */}

                                            <div className="flex items-start justify-between gap-4">

                                                <div className="flex min-w-0 items-start gap-3">

                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-100">
                                                        <FolderKanban
                                                            size={20}
                                                        />
                                                    </div>

                                                    <div className="min-w-0">

                                                        <h3 className="truncate text-base font-bold text-slate-900">
                                                            {
                                                                project.name
                                                            }
                                                        </h3>

                                                        <p className="mt-1 text-xs text-slate-400">
                                                            Project #
                                                            {
                                                                project.id
                                                            }
                                                        </p>

                                                    </div>

                                                </div>

                                                {/* STATUS */}

                                                <div
                                                    className={`flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${status.className}`}
                                                >

                                                    <StatusIcon
                                                        size={13}
                                                    />

                                                    {
                                                        project.status ||
                                                        "Planning"
                                                    }

                                                </div>

                                            </div>

                                            {/* DESCRIPTION */}

                                            <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-500">
                                                {project.description ||
                                                    "No project description available."}
                                            </p>

                                            {/* PROGRESS */}

                                            <div className="mt-5">

                                                <div className="mb-2 flex items-center justify-between">

                                                    <span className="text-xs font-medium text-slate-500">
                                                        Progress
                                                    </span>

                                                    <span className="text-xs font-bold text-slate-900">
                                                        {progress}%
                                                    </span>

                                                </div>

                                                <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                                                    <div
                                                        className="h-full rounded-full bg-blue-600 transition-all duration-300"
                                                        style={{
                                                            width: `${progress}%`,
                                                        }}
                                                    />

                                                </div>

                                            </div>

                                            {/* PROJECT DETAILS */}

                                            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">

                                                {/* DEADLINE */}

                                                <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 p-3">

                                                    <CalendarDays
                                                        size={17}
                                                        className="shrink-0 text-slate-500"
                                                    />

                                                    <div className="min-w-0">

                                                        <p className="text-[11px] text-slate-400">
                                                            Deadline
                                                        </p>

                                                        <p className="truncate text-xs font-semibold text-slate-700">
                                                            {
                                                                project.deadline ||
                                                                "Not set"
                                                            }
                                                        </p>

                                                    </div>

                                                </div>

                                                {/* TEAM */}

                                                <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 p-3">

                                                    <Users
                                                        size={17}
                                                        className="shrink-0 text-slate-500"
                                                    />

                                                    <div className="min-w-0">

                                                        <p className="text-[11px] text-slate-400">
                                                            Team
                                                        </p>

                                                        <p className="truncate text-xs font-semibold text-slate-700">
                                                            {
                                                                project.teamName ||
                                                                "Not assigned"
                                                            }
                                                        </p>

                                                    </div>

                                                </div>

                                            </div>

                                            {/* ACTIVITY / FOOTER */}

                                            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">

                                                <div className="flex items-center gap-2 text-xs text-slate-500">

                                                    <Activity
                                                        size={15}
                                                    />

                                                    <span>
                                                        Project activity
                                                    </span>

                                                </div>

                                                <span className="text-xs font-semibold text-blue-600 transition group-hover:text-blue-700">
                                                    View →
                                                </span>

                                            </div>

                                        </button>
                                    );
                                }
                            )}

                        </div>
                    )}

                </div>

                {/* ==================================================
                    FOOTER
                ================================================== */}

                <div className="flex justify-end border-t border-slate-200 bg-white px-6 py-4">

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        Close
                    </button>

                </div>

            </div>

        </div>
    );
}

export default ViewAssignedProjects;

