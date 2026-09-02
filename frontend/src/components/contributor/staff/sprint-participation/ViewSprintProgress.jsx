import { useMemo, useState } from "react";

import {
    Target,
    RefreshCw,
    TrendingUp,
    CheckCircle2,
    Clock3,
    ListChecks,
} from "lucide-react";

// ============================================================
// STAFF - VIEW SPRINT GOALS AND PROGRESS
// ============================================================

const getStoredTasks = () => {
    try {
        const stored =
            localStorage.getItem("aipms_staff_tasks") ||
            localStorage.getItem("staffTasks");

        if (!stored) {
            return [];
        }

        const parsed = JSON.parse(stored);

        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error("Failed to load sprint data:", error);
        return [];
    }
};

const getStoredSprint = () => {
    try {
        const stored =
            localStorage.getItem("aipms_current_sprint") ||
            localStorage.getItem("currentSprint");

        if (!stored) {
            return null;
        }

        return JSON.parse(stored);
    } catch (error) {
        console.error("Failed to load sprint:", error);
        return null;
    }
};

function ViewSprintProgress() {
    const [tasks, setTasks] = useState(getStoredTasks);
    const [sprint, setSprint] = useState(getStoredSprint);

    const sprintTasks = useMemo(() => {
        if (!sprint) {
            return tasks;
        }

        const sprintId =
            sprint.id ||
            sprint.sprintId;

        if (!sprintId) {
            return tasks;
        }

        return tasks.filter((task) => {
            const taskSprintId =
                task.sprintId ||
                task.sprintID;

            return String(taskSprintId) === String(sprintId);
        });
    }, [tasks, sprint]);

    const totalTasks = sprintTasks.length;

    const completedTasks = sprintTasks.filter(
        (task) =>
            String(
                task.status ||
                    task.taskStatus ||
                    ""
            ).toLowerCase() === "completed"
    ).length;

    const inProgressTasks = sprintTasks.filter(
        (task) =>
            String(
                task.status ||
                    task.taskStatus ||
                    ""
            ).toLowerCase() === "in progress"
    ).length;

    const pendingTasks = sprintTasks.filter(
        (task) =>
            String(
                task.status ||
                    task.taskStatus ||
                    ""
            ).toLowerCase() === "pending"
    ).length;

    const progress =
        totalTasks > 0
            ? Math.round(
                  (completedTasks / totalTasks) * 100
              )
            : 0;

    const refresh = () => {
        setTasks(getStoredTasks());
        setSprint(getStoredSprint());
    };

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <div className="flex items-center gap-3">
                        <Target
                            size={26}
                            className="text-blue-400"
                        />

                        <h2 className="text-2xl font-bold text-white">
                            Sprint Goals & Progress
                        </h2>
                    </div>

                    <p className="mt-2 text-sm text-slate-400">
                        Monitor your sprint goals and task completion
                        progress.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={refresh}
                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white transition hover:bg-slate-700"
                >
                    <RefreshCw size={17} />
                    Refresh
                </button>
            </div>

            {/* SPRINT INFORMATION */}
            <div className="rounded-2xl border border-slate-700 bg-slate-950 p-6">
                <p className="text-sm text-slate-500">
                    Current Sprint
                </p>

                <h3 className="mt-2 text-2xl font-bold text-white">
                    {sprint?.name ||
                        sprint?.title ||
                        "Current Sprint"}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                    {sprint?.goal ||
                        sprint?.description ||
                        "Sprint goal information is not available yet."}
                </p>

                {(sprint?.startDate || sprint?.endDate) && (
                    <div className="mt-4 flex flex-wrap gap-5 text-sm text-slate-400">
                        {sprint?.startDate && (
                            <span>
                                Start:{" "}
                                <strong className="text-slate-300">
                                    {new Date(
                                        sprint.startDate
                                    ).toLocaleDateString()}
                                </strong>
                            </span>
                        )}

                        {sprint?.endDate && (
                            <span>
                                End:{" "}
                                <strong className="text-slate-300">
                                    {new Date(
                                        sprint.endDate
                                    ).toLocaleDateString()}
                                </strong>
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* PROGRESS */}
            <div className="rounded-2xl border border-slate-700 bg-slate-950 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-slate-400">
                            Overall Progress
                        </p>

                        <p className="mt-1 text-4xl font-bold text-white">
                            {progress}%
                        </p>
                    </div>

                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/10">
                        <TrendingUp
                            size={28}
                            className="text-blue-400"
                        />
                    </div>
                </div>

                <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-800">
                    <div
                        className="h-full rounded-full bg-blue-600 transition-all"
                        style={{
                            width: `${progress}%`,
                        }}
                    />
                </div>

                <p className="mt-3 text-sm text-slate-500">
                    {completedTasks} of {totalTasks} tasks completed.
                </p>
            </div>

            {/* STATISTICS */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-slate-700 bg-slate-950 p-5">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">
                            Total Tasks
                        </span>

                        <ListChecks
                            size={21}
                            className="text-blue-400"
                        />
                    </div>

                    <p className="mt-3 text-3xl font-bold text-white">
                        {totalTasks}
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-700 bg-slate-950 p-5">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">
                            Completed
                        </span>

                        <CheckCircle2
                            size={21}
                            className="text-green-400"
                        />
                    </div>

                    <p className="mt-3 text-3xl font-bold text-green-400">
                        {completedTasks}
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-700 bg-slate-950 p-5">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">
                            In Progress
                        </span>

                        <TrendingUp
                            size={21}
                            className="text-blue-400"
                        />
                    </div>

                    <p className="mt-3 text-3xl font-bold text-blue-400">
                        {inProgressTasks}
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-700 bg-slate-950 p-5">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">
                            Pending
                        </span>

                        <Clock3
                            size={21}
                            className="text-yellow-400"
                        />
                    </div>

                    <p className="mt-3 text-3xl font-bold text-yellow-400">
                        {pendingTasks}
                    </p>
                </div>
            </div>

            {/* GOAL */}
            <div className="rounded-2xl border border-blue-900/50 bg-blue-950/20 p-6">
                <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
                        <Target
                            size={23}
                            className="text-blue-400"
                        />
                    </div>

                    <div>
                        <h3 className="font-semibold text-white">
                            Sprint Goal
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-400">
                            {sprint?.goal ||
                                "No sprint goal has been defined yet."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewSprintProgress;