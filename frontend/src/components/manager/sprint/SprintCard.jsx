
// ============================================================
// AIPMS — MANAGER SPRINT CARD
//
// Sprint Management
// - View Sprint Backlog
// - Start Sprint
// - Complete Sprint
// - Update Sprint
// - Delete Sprint
// - Monitor Sprint Progress
// - Assign Sprint to Team
// ============================================================

import React from "react";

import {
    CalendarDays,
    UsersRound,
    ListTodo,
    Play,
    CheckCircle2,
    Pencil,
    Trash2,
    Activity,
    UserPlus,
    Target,
} from "lucide-react";

function SprintCard({
    sprint,
    onViewBacklog,
    onStart,
    onComplete,
    onUpdate,
    onDelete,
    onMonitorProgress,
    onAssignTeam,
}) {
    if (!sprint) {
        return null;
    }

    const {
        id,
        name = "Unnamed Sprint",
        goal = "No sprint goal provided.",
        status = "Planning",
        progress = 0,
        team = "Not assigned",
        startDate = "Not set",
        endDate = "Not set",
    } = sprint;

    // ============================================================
    // STATUS
    // ============================================================

    const normalizedStatus = String(status)
        .trim()
        .toLowerCase();

    const isPlanning = normalizedStatus === "planning";

    const isActive =
        normalizedStatus === "active" ||
        normalizedStatus === "in progress";

    const isCompleted =
        normalizedStatus === "completed";

    const safeProgress = Math.min(
        100,
        Math.max(0, Number(progress) || 0)
    );

    // ============================================================
    // BUTTON HANDLERS
    // ============================================================

    const handleViewBacklogClick = (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (typeof onViewBacklog === "function") {
            onViewBacklog(sprint);
        }
    };

    const handleStartClick = (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (typeof onStart === "function") {
            onStart(sprint);
        }
    };

    const handleCompleteClick = (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (typeof onComplete === "function") {
            onComplete(sprint);
        }
    };

    const handleUpdateClick = (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (typeof onUpdate === "function") {
            onUpdate(sprint);
        }
    };

    const handleDeleteClick = (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (typeof onDelete === "function") {
            onDelete(sprint);
        }
    };

    const handleMonitorClick = (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (typeof onMonitorProgress === "function") {
            onMonitorProgress(sprint);
        }
    };

    const handleAssignTeamClick = (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (typeof onAssignTeam === "function") {
            onAssignTeam(sprint);
        }
    };

    // ============================================================
    // STATUS STYLING
    //
    // Uses semantic/theme-compatible classes.
    // ============================================================

    const statusStyles = isPlanning
        ? {
              badge:
                  "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-400",
              accent:
                  "bg-amber-500",
              icon:
                  "border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-400",
              progress:
                  "bg-amber-500",
              progressText:
                  "text-amber-600 dark:text-amber-400",
          }
        : isActive
        ? {
              badge:
                  "border-primary/30 bg-primary/10 text-primary",
              accent:
                  "bg-primary",
              icon:
                  "border-primary/20 bg-primary/10 text-primary",
              progress:
                  "bg-primary",
              progressText:
                  "text-primary",
          }
        : isCompleted
        ? {
              badge:
                  "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400",
              accent:
                  "bg-emerald-500",
              icon:
                  "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400",
              progress:
                  "bg-emerald-500",
              progressText:
                  "text-emerald-600 dark:text-emerald-400",
          }
        : {
              badge:
                  "border-border bg-muted text-muted-foreground",
              accent:
                  "bg-muted-foreground",
              icon:
                  "border-border bg-muted text-muted-foreground",
              progress:
                  "bg-muted-foreground",
              progressText:
                  "text-muted-foreground",
          };

    return (
        <article
            data-sprint-id={id}
            className="
                group
                relative
                overflow-hidden
                rounded-xl
                border
                border-border
                bg-card
                text-card-foreground
                shadow-sm
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:shadow-md
            "
        >
            {/* ====================================================
                STATUS ACCENT
            ==================================================== */}

            <div
                className={`absolute inset-x-0 top-0 h-1 ${statusStyles.accent}`}
            />

            {/* ====================================================
                HEADER
            ==================================================== */}

            <div className="border-b border-border px-5 py-5">
                <div className="flex items-start justify-between gap-4">

                    <div className="flex min-w-0 items-start gap-3">

                        {/* SPRINT ICON */}

                        <div
                            className={`
                                flex
                                h-11
                                w-11
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                border
                                ${statusStyles.icon}
                            `}
                        >
                            <Target size={20} />
                        </div>

                        {/* SPRINT INFORMATION */}

                        <div className="min-w-0">

                            <h3 className="truncate text-lg font-bold text-foreground">
                                {name}
                            </h3>

                            <p className="mt-1 line-clamp-2 text-sm leading-5 text-muted-foreground">
                                {goal}
                            </p>

                        </div>
                    </div>

                    {/* STATUS */}

                    <span
                        className={`
                            shrink-0
                            rounded-full
                            border
                            px-3
                            py-1.5
                            text-xs
                            font-semibold
                            ${statusStyles.badge}
                        `}
                    >
                        {status}
                    </span>
                </div>
            </div>

            {/* ====================================================
                INFORMATION
            ==================================================== */}

            <div className="px-5 pt-5">

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

                    {/* TEAM */}

                    <div
                        className="
                            rounded-lg
                            border
                            border-border
                            bg-muted/40
                            p-3.5
                            transition-colors
                            hover:bg-muted
                        "
                    >
                        <div className="flex items-center gap-2 text-primary">

                            <UsersRound size={16} />

                            <span className="text-xs font-semibold">
                                Team
                            </span>

                        </div>

                        <p className="mt-1.5 truncate text-sm font-semibold text-foreground">
                            {team || "Not assigned"}
                        </p>
                    </div>

                    {/* START DATE */}

                    <div
                        className="
                            rounded-lg
                            border
                            border-border
                            bg-muted/40
                            p-3.5
                            transition-colors
                            hover:bg-muted
                        "
                    >
                        <div className="flex items-center gap-2 text-primary">

                            <CalendarDays size={16} />

                            <span className="text-xs font-semibold">
                                Start Date
                            </span>

                        </div>

                        <p className="mt-1.5 truncate text-sm font-semibold text-foreground">
                            {startDate}
                        </p>
                    </div>

                    {/* END DATE */}

                    <div
                        className="
                            rounded-lg
                            border
                            border-border
                            bg-muted/40
                            p-3.5
                            transition-colors
                            hover:bg-muted
                        "
                    >
                        <div className="flex items-center gap-2 text-primary">

                            <CalendarDays size={16} />

                            <span className="text-xs font-semibold">
                                End Date
                            </span>

                        </div>

                        <p className="mt-1.5 truncate text-sm font-semibold text-foreground">
                            {endDate}
                        </p>
                    </div>

                </div>
            </div>

            {/* ====================================================
                PROGRESS
            ==================================================== */}

            <div className="px-5 pt-5">

                <div className="mb-2 flex items-center justify-between">

                    <span className="text-sm font-semibold text-foreground">
                        Sprint Progress
                    </span>

                    <span
                        className={`
                            text-sm
                            font-bold
                            ${statusStyles.progressText}
                        `}
                    >
                        {safeProgress}%
                    </span>

                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-muted">

                    <div
                        className={`
                            h-full
                            rounded-full
                            transition-all
                            duration-500
                            ${statusStyles.progress}
                        `}
                        style={{
                            width: `${safeProgress}%`,
                        }}
                    />

                </div>
            </div>

            {/* ====================================================
                VIEW BACKLOG
            ==================================================== */}

            <div className="px-5 pt-5">

                <button
                    type="button"
                    onClick={handleViewBacklogClick}
                    className="
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-lg
                        border
                        border-border
                        bg-muted/40
                        px-4
                        py-2.5
                        text-sm
                        font-semibold
                        text-foreground
                        transition
                        hover:bg-muted
                        focus:outline-none
                        focus:ring-2
                        focus:ring-primary/30
                        focus:ring-offset-2
                        focus:ring-offset-background
                    "
                >
                    <ListTodo
                        size={17}
                        className="text-primary"
                    />

                    <span>
                        View Sprint Backlog
                    </span>
                </button>

            </div>

            {/* ====================================================
                ACTIONS
            ==================================================== */}

            <div className="grid grid-cols-1 gap-2 px-5 py-5 sm:grid-cols-2">

                {/* ==================================================
                    START
                ================================================== */}

                {isPlanning && (
                    <button
                        type="button"
                        onClick={handleStartClick}
                        className="
                            flex
                            items-center
                            justify-center
                            gap-2
                            rounded-lg
                            border
                            border-emerald-200
                            bg-emerald-50
                            px-4
                            py-2.5
                            text-sm
                            font-semibold
                            text-emerald-700
                            transition
                            hover:bg-emerald-100
                            focus:outline-none
                            focus:ring-2
                            focus:ring-emerald-300
                            focus:ring-offset-2
                            focus:ring-offset-background
                            dark:border-emerald-900/50
                            dark:bg-emerald-950/30
                            dark:text-emerald-400
                            dark:hover:bg-emerald-950/50
                        "
                    >
                        <Play size={17} />

                        <span>
                            Start Sprint
                        </span>
                    </button>
                )}

                {/* ==================================================
                    COMPLETE
                ================================================== */}

                {isActive && (
                    <button
                        type="button"
                        onClick={handleCompleteClick}
                        className="
                            flex
                            items-center
                            justify-center
                            gap-2
                            rounded-lg
                            border
                            border-emerald-200
                            bg-emerald-50
                            px-4
                            py-2.5
                            text-sm
                            font-semibold
                            text-emerald-700
                            transition
                            hover:bg-emerald-100
                            focus:outline-none
                            focus:ring-2
                            focus:ring-emerald-300
                            focus:ring-offset-2
                            focus:ring-offset-background
                            dark:border-emerald-900/50
                            dark:bg-emerald-950/30
                            dark:text-emerald-400
                            dark:hover:bg-emerald-950/50
                        "
                    >
                        <CheckCircle2 size={17} />

                        <span>
                            Complete Sprint
                        </span>
                    </button>
                )}

                {/* ==================================================
                    UPDATE
                ================================================== */}

                {!isCompleted && (
                    <button
                        type="button"
                        onClick={handleUpdateClick}
                        className="
                            flex
                            items-center
                            justify-center
                            gap-2
                            rounded-lg
                            border
                            border-border
                            bg-background
                            px-4
                            py-2.5
                            text-sm
                            font-semibold
                            text-foreground
                            transition
                            hover:bg-muted
                            focus:outline-none
                            focus:ring-2
                            focus:ring-primary/30
                            focus:ring-offset-2
                            focus:ring-offset-background
                        "
                    >
                        <Pencil
                            size={17}
                            className="text-primary"
                        />

                        <span>
                            Update Sprint
                        </span>
                    </button>
                )}

                {/* ==================================================
                    DELETE
                ================================================== */}

                {!isActive && (
                    <button
                        type="button"
                        onClick={handleDeleteClick}
                        className="
                            flex
                            items-center
                            justify-center
                            gap-2
                            rounded-lg
                            border
                            border-red-200
                            bg-red-50
                            px-4
                            py-2.5
                            text-sm
                            font-semibold
                            text-red-700
                            transition
                            hover:bg-red-100
                            focus:outline-none
                            focus:ring-2
                            focus:ring-red-300
                            focus:ring-offset-2
                            focus:ring-offset-background
                            dark:border-red-900/50
                            dark:bg-red-950/30
                            dark:text-red-400
                            dark:hover:bg-red-950/50
                        "
                    >
                        <Trash2 size={17} />

                        <span>
                            Delete Sprint
                        </span>
                    </button>
                )}

                {/* ==================================================
                    MONITOR
                ================================================== */}

                <button
                    type="button"
                    onClick={handleMonitorClick}
                    className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        rounded-lg
                        border
                        border-border
                        bg-background
                        px-4
                        py-2.5
                        text-sm
                        font-semibold
                        text-foreground
                        transition
                        hover:bg-muted
                        focus:outline-none
                        focus:ring-2
                        focus:ring-primary/30
                        focus:ring-offset-2
                        focus:ring-offset-background
                    "
                >
                    <Activity
                        size={17}
                        className="text-primary"
                    />

                    <span>
                        Monitor Progress
                    </span>
                </button>

                {/* ==================================================
                    ASSIGN TEAM
                ================================================== */}

                <button
                    type="button"
                    onClick={handleAssignTeamClick}
                    className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        rounded-lg
                        border
                        border-border
                        bg-background
                        px-4
                        py-2.5
                        text-sm
                        font-semibold
                        text-foreground
                        transition
                        hover:bg-muted
                        focus:outline-none
                        focus:ring-2
                        focus:ring-primary/30
                        focus:ring-offset-2
                        focus:ring-offset-background
                    "
                >
                    <UserPlus
                        size={17}
                        className="text-primary"
                    />

                    <span>
                        Assign to Team
                    </span>
                </button>

            </div>
        </article>
    );
}

export default SprintCard;