
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
// - Matches Admin / Manager design system
// - Uses semantic theme tokens
// - Supports light and dark mode
// - Keeps existing project information
// - Keeps status and progress visualization
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
                "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
            accent: "bg-emerald-500",
            icon: CheckCircle2,
        },

        Planning: {
            className:
                "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
            accent: "bg-amber-500",
            icon: Clock,
        },

        Completed: {
            className:
                "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400",
            accent: "bg-blue-500",
            icon: CheckCircle2,
        },

        OnHold: {
            className:
                "border-yellow-500/20 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
            accent: "bg-yellow-500",
            icon: AlertCircle,
        },

        Cancelled: {
            className:
                "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400",
            accent: "bg-red-500",
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
        Math.min(100, Number(project.progress) || 0)
    );

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="group relative overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">

            {/* ==================================================
                STATUS ACCENT
            ================================================== */}

            <div
                className={`absolute inset-x-0 top-0 h-1 ${status.accent}`}
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

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/10">
                            <FolderKanban size={21} />
                        </div>

                        {/* PROJECT NAME */}

                        <div className="min-w-0">

                            <div className="mb-1 flex items-center gap-2">

                                <Sparkles
                                    size={13}
                                    className="shrink-0 text-primary"
                                />

                                <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                                    Project
                                </span>

                            </div>

                            <h3 className="truncate text-lg font-semibold text-foreground">
                                {project.name}
                            </h3>

                            <p className="mt-1 text-xs text-muted-foreground">
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

                <div className="mt-5 rounded-lg border border-border bg-muted/50 p-4">

                    <p className="text-sm leading-6 text-muted-foreground">
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

                            <div className="h-2 w-2 rounded-full bg-primary" />

                            <span className="text-sm font-medium text-muted-foreground">
                                Project Progress
                            </span>

                        </div>

                        <span className="text-sm font-semibold text-foreground">
                            {progress}%
                        </span>

                    </div>

                    <div className="h-2.5 overflow-hidden rounded-full bg-muted">

                        <div
                            className="h-full rounded-full bg-primary transition-all duration-300"
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

                    <div className="rounded-lg border border-border bg-muted/40 p-3.5">

                        <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background text-primary ring-1 ring-border">
                                <CalendarDays size={18} />
                            </div>

                            <div className="min-w-0">

                                <p className="text-xs font-medium text-muted-foreground">
                                    Start Date
                                </p>

                                <p className="mt-0.5 truncate text-sm font-semibold text-foreground">
                                    {project.startDate ||
                                        "Not set"}
                                </p>

                            </div>

                        </div>

                    </div>

                    {/* DEADLINE */}

                    <div className="rounded-lg border border-border bg-muted/40 p-3.5">

                        <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background text-primary ring-1 ring-border">
                                <Clock size={18} />
                            </div>

                            <div className="min-w-0">

                                <p className="text-xs font-medium text-muted-foreground">
                                    Deadline
                                </p>

                                <p className="mt-0.5 truncate text-sm font-semibold text-foreground">
                                    {project.deadline ||
                                        "Not set"}
                                </p>

                            </div>

                        </div>

                    </div>

                    {/* TEAM */}

                    <div className="rounded-lg border border-border bg-muted/40 p-3.5">

                        <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background text-primary ring-1 ring-border">
                                <Users size={18} />
                            </div>

                            <div className="min-w-0">

                                <p className="text-xs font-medium text-muted-foreground">
                                    Team
                                </p>

                                <p className="mt-0.5 truncate text-sm font-semibold text-foreground">
                                    {project.teamName ||
                                        `${project.team || 0} members`}
                                </p>

                            </div>

                        </div>

                    </div>

                    {/* SPECIFICATION */}

                    <div className="rounded-lg border border-border bg-muted/40 p-3.5">

                        <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background text-primary ring-1 ring-border">
                                <FolderKanban size={18} />
                            </div>

                            <div className="min-w-0">

                                <p className="text-xs font-medium text-muted-foreground">
                                    Specification
                                </p>

                                <p className="mt-0.5 truncate text-sm font-semibold text-foreground">
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