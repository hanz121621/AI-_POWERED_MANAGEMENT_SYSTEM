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
    // ============================================================

    const statusStyles = isPlanning
        ? {
              badge:
                  "border-amber-200 bg-amber-50 text-amber-700",
              header:
                  "from-amber-50 via-white to-orange-50",
              icon:
                  "border-amber-200 bg-amber-100 text-amber-600",
              progress:
                  "bg-amber-500",
          }
        : isActive
        ? {
              badge:
                  "border-blue-200 bg-blue-50 text-blue-700",
              header:
                  "from-blue-50 via-white to-indigo-50",
              icon:
                  "border-blue-200 bg-blue-100 text-blue-600",
              progress:
                  "bg-blue-500",
          }
        : isCompleted
        ? {
              badge:
                  "border-emerald-200 bg-emerald-50 text-emerald-700",
              header:
                  "from-emerald-50 via-white to-green-50",
              icon:
                  "border-emerald-200 bg-emerald-100 text-emerald-600",
              progress:
                  "bg-emerald-500",
          }
        : {
              badge:
                  "border-slate-200 bg-slate-50 text-slate-600",
              header:
                  "from-slate-50 via-white to-slate-100",
              icon:
                  "border-slate-200 bg-slate-100 text-slate-600",
              progress:
                  "bg-slate-500",
          };

    return (
        <article
            data-sprint-id={id}
            className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
        >
            {/* ====================================================
                HEADER
            ==================================================== */}

            <div
                className={`border-b border-slate-200 bg-gradient-to-r ${statusStyles.header} px-5 py-5`}
            >
                <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-3">
                        <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${statusStyles.icon}`}
                        >
                            <Target size={20} />
                        </div>

                        <div className="min-w-0">
                            <h3 className="truncate text-lg font-bold text-slate-900">
                                {name}
                            </h3>

                            <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-600">
                                {goal}
                            </p>
                        </div>
                    </div>

                    <span
                        className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-bold ${statusStyles.badge}`}
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

                    <div className="rounded-xl border border-violet-200 bg-violet-50 p-3.5 transition hover:bg-violet-100">
                        <div className="flex items-center gap-2 text-violet-600">
                            <UsersRound size={16} />

                            <span className="text-xs font-semibold">
                                Team
                            </span>
                        </div>

                        <p className="mt-1.5 text-sm font-bold text-violet-950">
                            {team || "Not assigned"}
                        </p>
                    </div>

                    <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-3.5 transition hover:bg-cyan-100">
                        <div className="flex items-center gap-2 text-cyan-600">
                            <CalendarDays size={16} />

                            <span className="text-xs font-semibold">
                                Start Date
                            </span>
                        </div>

                        <p className="mt-1.5 text-sm font-bold text-cyan-950">
                            {startDate}
                        </p>
                    </div>

                    <div className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 transition hover:bg-rose-100">
                        <div className="flex items-center gap-2 text-rose-600">
                            <CalendarDays size={16} />

                            <span className="text-xs font-semibold">
                                End Date
                            </span>
                        </div>

                        <p className="mt-1.5 text-sm font-bold text-rose-950">
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
                    <span className="text-sm font-semibold text-slate-700">
                        Sprint Progress
                    </span>

                    <span
                        className={`text-sm font-bold ${
                            isPlanning
                                ? "text-amber-600"
                                : isActive
                                ? "text-blue-600"
                                : isCompleted
                                ? "text-emerald-600"
                                : "text-slate-600"
                        }`}
                    >
                        {safeProgress}%
                    </span>
                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ${statusStyles.progress}`}
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
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-bold text-indigo-700 transition hover:border-indigo-300 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2"
                >
                    <ListTodo size={17} />

                    <span>
                        View Sprint Backlog
                    </span>
                </button>
            </div>

            {/* ====================================================
                ACTIONS
            ==================================================== */}

            <div className="grid grid-cols-1 gap-2 px-5 py-5 sm:grid-cols-2">

                {/* START */}

                {isPlanning && (
                    <button
                        type="button"
                        onClick={handleStartClick}
                        className="flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2"
                    >
                        <Play size={17} />

                        <span>
                            Start Sprint
                        </span>
                    </button>
                )}

                {/* COMPLETE */}

                {isActive && (
                    <button
                        type="button"
                        onClick={handleCompleteClick}
                        className="flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2"
                    >
                        <CheckCircle2 size={17} />

                        <span>
                            Complete Sprint
                        </span>
                    </button>
                )}

                {/* UPDATE */}

                {!isCompleted && (
                    <button
                        type="button"
                        onClick={handleUpdateClick}
                        className="flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-bold text-blue-700 transition hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
                    >
                        <Pencil size={17} />

                        <span>
                            Update Sprint
                        </span>
                    </button>
                )}

                {/* DELETE */}

                {!isActive && (
                    <button
                        type="button"
                        onClick={handleDeleteClick}
                        className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-700 transition hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2"
                    >
                        <Trash2 size={17} />

                        <span>
                            Delete Sprint
                        </span>
                    </button>
                )}

                {/* MONITOR */}

                <button
                    type="button"
                    onClick={handleMonitorClick}
                    className="flex items-center justify-center gap-2 rounded-xl border border-purple-200 bg-purple-50 px-4 py-2.5 text-sm font-bold text-purple-700 transition hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-2"
                >
                    <Activity size={17} />

                    <span>
                        Monitor Progress
                    </span>
                </button>

                {/* ASSIGN TEAM */}

                <button
                    type="button"
                    onClick={handleAssignTeamClick}
                    className="flex items-center justify-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-2.5 text-sm font-bold text-orange-700 transition hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2"
                >
                    <UserPlus size={17} />

                    <span>
                        Assign to Team
                    </span>
                </button>

            </div>
        </article>
    );
}

export default SprintCard;