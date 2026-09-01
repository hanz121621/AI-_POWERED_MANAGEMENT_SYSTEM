import React from "react";

import {
    FolderKanban,
    Users,
    CalendarDays,
    Clock,
    CheckCircle2,
    AlertCircle,
    Sparkles,
} from "lucide-react";

// ============================================================
// MANAGER — PROJECT CARD
//
// Design:
// - Light slate background compatible
// - White card
// - Colorful status accent
// - Violet / blue / cyan visual language
// - Matches Sprint Management page
// ============================================================

function ProjectCard({ project }) {
    if (!project) {
        return null;
    }

    // ========================================================
    // STATUS STYLES
    // ========================================================

    const statusStyles = {
        Active: {
            className:
                "bg-emerald-50 text-emerald-700 border-emerald-200",
            accent:
                "bg-gradient-to-r from-emerald-400 to-green-600",
            icon: CheckCircle2,
        },

        Planning: {
            className:
                "bg-amber-50 text-amber-700 border-amber-200",
            accent:
                "bg-gradient-to-r from-amber-400 to-orange-500",
            icon: Clock,
        },

        Completed: {
            className:
                "bg-blue-50 text-blue-700 border-blue-200",
            accent:
                "bg-gradient-to-r from-blue-400 to-cyan-600",
            icon: CheckCircle2,
        },

        OnHold: {
            className:
                "bg-yellow-50 text-yellow-700 border-yellow-200",
            accent:
                "bg-gradient-to-r from-yellow-400 to-amber-500",
            icon: AlertCircle,
        },

        Cancelled: {
            className:
                "bg-red-50 text-red-700 border-red-200",
            accent:
                "bg-gradient-to-r from-red-400 to-rose-600",
            icon: AlertCircle,
        },
    };

    const status =
        statusStyles[project.status] ||
        statusStyles.Planning;

    const StatusIcon = status.icon;

    // ========================================================
    // PROGRESS
    // ========================================================

    const progress = Math.max(
        0,
        Math.min(
            100,
            Number(project.progress) || 0
        )
    );

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">

            {/* ==================================================
                COLOR ACCENT
            ================================================== */}

            <div
                className={`absolute inset-x-0 top-0 h-1.5 ${status.accent}`}
            />

            {/* ==================================================
                CARD CONTENT
            ================================================== */}

            <div className="p-5">

                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="flex items-start justify-between gap-4">

                    <div className="flex min-w-0 items-start gap-3">

                        {/* PROJECT ICON */}

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-blue-100 text-violet-700 ring-1 ring-violet-100">

                            <FolderKanban size={22} />

                        </div>

                        {/* PROJECT NAME */}

                        <div className="min-w-0">

                            <div className="mb-1 flex items-center gap-2">

                                <Sparkles
                                    size={14}
                                    className="shrink-0 text-violet-500"
                                />

                                <span className="text-xs font-semibold uppercase tracking-wide text-violet-500">
                                    Project
                                </span>

                            </div>

                            <h3 className="truncate text-lg font-bold text-slate-900">
                                {project.name}
                            </h3>

                            <p className="mt-1 text-xs font-medium text-slate-500">
                                Project #{project.id}
                            </p>

                        </div>

                    </div>

                    {/* STATUS */}

                    <div
                        className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${status.className}`}
                    >

                        <StatusIcon size={14} />

                        {project.status}

                    </div>

                </div>

                {/* ==================================================
                    DESCRIPTION
                ================================================== */}

                <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-4">

                    <p className="text-sm leading-6 text-slate-600">

                        {project.description ||
                            "No project description available."}

                    </p>

                </div>

                {/* ==================================================
                    PROGRESS
                ================================================== */}

                <div className="mt-5">

                    <div className="mb-2 flex items-center justify-between">

                        <div className="flex items-center gap-2">

                            <div className="h-2 w-2 rounded-full bg-violet-500" />

                            <span className="text-sm font-semibold text-slate-600">
                                Project Progress
                            </span>

                        </div>

                        <span className="text-sm font-bold text-slate-900">
                            {progress}%
                        </span>

                    </div>

                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">

                        <div
                            className="h-full rounded-full bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-500 transition-all duration-300"
                            style={{
                                width: `${progress}%`,
                            }}
                        />

                    </div>

                </div>

                {/* ==================================================
                    PROJECT DETAILS
                ================================================== */}

                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">

                    {/* START DATE */}

                    <div className="rounded-xl border border-violet-100 bg-violet-50 p-3.5">

                        <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-violet-600 shadow-sm">

                                <CalendarDays size={18} />

                            </div>

                            <div className="min-w-0">

                                <p className="text-xs font-medium text-violet-600">
                                    Start Date
                                </p>

                                <p className="mt-0.5 truncate text-sm font-bold text-slate-800">

                                    {project.startDate ||
                                        "Not set"}

                                </p>

                            </div>

                        </div>

                    </div>

                    {/* DEADLINE */}

                    <div className="rounded-xl border border-blue-100 bg-blue-50 p-3.5">

                        <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">

                                <Clock size={18} />

                            </div>

                            <div className="min-w-0">

                                <p className="text-xs font-medium text-blue-600">
                                    Deadline
                                </p>

                                <p className="mt-0.5 truncate text-sm font-bold text-slate-800">

                                    {project.deadline ||
                                        "Not set"}

                                </p>

                            </div>

                        </div>

                    </div>

                    {/* TEAM */}

                    <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3.5">

                        <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-600 shadow-sm">

                                <Users size={18} />

                            </div>

                            <div className="min-w-0">

                                <p className="text-xs font-medium text-emerald-600">
                                    Team
                                </p>

                                <p className="mt-0.5 truncate text-sm font-bold text-slate-800">

                                    {project.teamName ||
                                        `${project.team || 0} members`}

                                </p>

                            </div>

                        </div>

                    </div>

                    {/* SPECIFICATION */}

                    <div className="rounded-xl border border-amber-100 bg-amber-50 p-3.5">

                        <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-amber-600 shadow-sm">

                                <FolderKanban size={18} />

                            </div>

                            <div className="min-w-0">

                                <p className="text-xs font-medium text-amber-600">
                                    Specification
                                </p>

                                <p className="mt-0.5 truncate text-sm font-bold text-slate-800">

                                    {project.hasSpecification
                                        ? "Available"
                                        : "Not created"}

                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default ProjectCard;