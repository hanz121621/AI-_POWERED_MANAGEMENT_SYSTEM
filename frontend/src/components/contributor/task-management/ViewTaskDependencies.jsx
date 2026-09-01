import { useMemo, useState } from "react";
import {
    AlertCircle,
    ArrowRight,
    CheckCircle2,
    CircleUserRound,
    Clock3,
    GitBranch,
    Link2,
    Search,
    X,
} from "lucide-react";

// ============================================================
// CONT-TASK SUPPORT COMPONENT
// View Task Dependencies
// ============================================================

const CURRENT_CONTRIBUTOR = {
    id: "USER-003",
    name: "Hana Nigussie",
    role: "Contributor",
};

const INITIAL_TASKS = [
    {
        id: "TASK-001",
        title: "Implement Contributor Dashboard",
        projectName: "AI Powered Management System",
        assigneeId: "USER-003",
        status: "In Progress",
    },
    {
        id: "TASK-002",
        title: "Implement Project Participation",
        projectName: "AI Powered Management System",
        assigneeId: "USER-003",
        status: "In Progress",
    },
    {
        id: "TASK-004",
        title: "Database Integration",
        projectName: "AI Powered Management System",
        assigneeId: "USER-003",
        status: "Blocked",
    },
];

const INITIAL_DEPENDENCIES = [
    {
        id: "DEP-001",
        taskId: "TASK-001",
        dependencyTaskId: "TASK-004",
        dependencyTitle: "Database Integration",
        relationship: "Blocked By",
        status: "Blocked",
        description:
            "Contributor Dashboard requires the database integration to be available.",
    },
    {
        id: "DEP-002",
        taskId: "TASK-002",
        dependencyTaskId: "TASK-001",
        dependencyTitle: "Implement Contributor Dashboard",
        relationship: "Related To",
        status: "In Progress",
        description:
            "Project participation uses functionality provided by the contributor dashboard.",
    },
];

// ============================================================
// HELPERS
// ============================================================

function getDependencyStatusClasses(status) {
    switch (status) {
        case "Completed":
        case "Done":
            return "bg-emerald-100 text-emerald-700";

        case "Blocked":
            return "bg-red-100 text-red-700";

        case "In Progress":
            return "bg-blue-100 text-blue-700";

        default:
            return "bg-slate-100 text-slate-700";
    }
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function ViewTaskDependencies() {
    const [tasks] = useState(INITIAL_TASKS);

    const [dependencies] = useState(
        INITIAL_DEPENDENCIES
    );

    const [selectedTask, setSelectedTask] =
        useState(null);

    const [search, setSearch] = useState("");

    const assignedTasks = useMemo(() => {
        return tasks.filter(
            (task) =>
                task.assigneeId ===
                CURRENT_CONTRIBUTOR.id
        );
    }, [tasks]);

    const filteredTasks = useMemo(() => {
        const value = search
            .trim()
            .toLowerCase();

        if (!value) {
            return assignedTasks;
        }

        return assignedTasks.filter(
            (task) =>
                task.id
                    .toLowerCase()
                    .includes(value) ||
                task.title
                    .toLowerCase()
                    .includes(value) ||
                task.projectName
                    .toLowerCase()
                    .includes(value)
        );
    }, [assignedTasks, search]);

    const selectedDependencies = useMemo(() => {
        if (!selectedTask) {
            return [];
        }

        return dependencies.filter(
            (dependency) =>
                dependency.taskId ===
                selectedTask.id
        );
    }, [dependencies, selectedTask]);

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="mx-auto max-w-6xl">

                {/* HEADER */}
                <div className="mb-6">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-purple-100 p-3 text-purple-700">
                            <GitBranch size={25} />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">
                                Task Dependencies
                            </h1>

                            <p className="text-sm text-slate-500">
                                View dependencies affecting your
                                assigned tasks.
                            </p>
                        </div>
                    </div>
                </div>

                {/* CONTRIBUTOR */}
                <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">
                    <div className="flex items-center gap-3">
                        <div className="rounded-full bg-white p-3 text-blue-600">
                            <CircleUserRound size={21} />
                        </div>

                        <div>
                            <p className="text-xs font-medium text-blue-600">
                                Contributor
                            </p>

                            <p className="font-semibold text-blue-900">
                                {CURRENT_CONTRIBUTOR.name}
                            </p>
                        </div>
                    </div>
                </div>

                {/* SEARCH */}
                <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="relative">
                        <Search
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Search assigned tasks..."
                            className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>
                </div>

                {/* TASKS */}
                <div className="grid gap-5 md:grid-cols-2">
                    {filteredTasks.map((task) => {
                        const count =
                            dependencies.filter(
                                (dependency) =>
                                    dependency.taskId ===
                                    task.id
                            ).length;

                        return (
                            <div
                                key={task.id}
                                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-xs font-semibold text-blue-600">
                                            {task.id}
                                        </p>

                                        <h2 className="mt-1 text-lg font-bold text-slate-900">
                                            {task.title}
                                        </h2>
                                    </div>

                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getDependencyStatusClasses(
                                            task.status
                                        )}`}
                                    >
                                        {task.status}
                                    </span>
                                </div>

                                <p className="mt-2 text-sm text-slate-500">
                                    {task.projectName}
                                </p>

                                <div className="mt-5 flex items-center justify-between rounded-xl bg-slate-50 p-4">
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Link2 size={17} />

                                        <span className="text-sm font-semibold">
                                            Dependencies
                                        </span>
                                    </div>

                                    <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-slate-700 shadow-sm">
                                        {count}
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelectedTask(
                                            task
                                        )
                                    }
                                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                >
                                    <GitBranch size={17} />
                                    View Dependencies
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* EMPTY */}
                {filteredTasks.length === 0 && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
                        <GitBranch
                            size={35}
                            className="mx-auto text-slate-300"
                        />

                        <h2 className="mt-4 font-semibold text-slate-800">
                            No tasks found
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            No assigned task matches your search.
                        </p>
                    </div>
                )}
            </div>

            {/* ====================================================
                DEPENDENCY MODAL
            ==================================================== */}

            {selectedTask && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
                    <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-xl">

                        <div className="flex items-start justify-between border-b border-slate-100 p-6">
                            <div>
                                <p className="text-xs font-semibold text-blue-600">
                                    {selectedTask.id}
                                </p>

                                <h2 className="mt-1 text-xl font-bold text-slate-900">
                                    {selectedTask.title}
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedTask(
                                        null
                                    )
                                }
                                className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
                            >
                                <X size={19} />
                            </button>
                        </div>

                        <div className="p-6">
                            {selectedDependencies.length ===
                            0 ? (
                                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
                                    <CheckCircle2
                                        size={30}
                                        className="mx-auto text-emerald-600"
                                    />

                                    <h3 className="mt-3 font-semibold text-emerald-800">
                                        No dependencies
                                    </h3>

                                    <p className="mt-1 text-sm text-emerald-700">
                                        This task currently has no
                                        recorded dependencies.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {selectedDependencies.map(
                                        (
                                            dependency
                                        ) => (
                                            <div
                                                key={
                                                    dependency.id
                                                }
                                                className="rounded-xl border border-slate-200 p-5"
                                            >
                                                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                                    <div>
                                                        <p className="text-xs font-semibold text-slate-400">
                                                            {
                                                                dependency.id
                                                            }
                                                        </p>

                                                        <h3 className="mt-1 font-bold text-slate-900">
                                                            {
                                                                dependency.dependencyTitle
                                                            }
                                                        </h3>

                                                        <p className="mt-1 text-sm text-slate-500">
                                                            {
                                                                dependency.description
                                                            }
                                                        </p>
                                                    </div>

                                                    <span
                                                        className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${getDependencyStatusClasses(
                                                            dependency.status
                                                        )}`}
                                                    >
                                                        {
                                                            dependency.status
                                                        }
                                                    </span>
                                                </div>

                                                <div className="mt-5 flex items-center gap-3 text-sm">
                                                    <span className="rounded-lg bg-blue-50 px-3 py-2 font-semibold text-blue-700">
                                                        {
                                                            selectedTask.id
                                                        }
                                                    </span>

                                                    <ArrowRight
                                                        size={18}
                                                        className="text-slate-400"
                                                    />

                                                    <span className="rounded-lg bg-slate-100 px-3 py-2 font-semibold text-slate-700">
                                                        {
                                                            dependency.dependencyTaskId
                                                        }
                                                    </span>
                                                </div>

                                                {dependency.status ===
                                                    "Blocked" && (
                                                    <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                                                        <AlertCircle
                                                            size={
                                                                18
                                                            }
                                                            className="mt-0.5 shrink-0 text-red-600"
                                                        />

                                                        <div>
                                                            <p className="text-sm font-semibold text-red-800">
                                                                Dependency is blocking
                                                                progress
                                                            </p>

                                                            <p className="mt-1 text-xs leading-5 text-red-700">
                                                                This
                                                                dependency
                                                                may need
                                                                to be
                                                                resolved
                                                                before
                                                                the task
                                                                can
                                                                continue.
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                                                    <Clock3
                                                        size={
                                                            14
                                                        }
                                                    />

                                                    Relationship:
                                                    {" "}
                                                    <span className="font-semibold text-slate-600">
                                                        {
                                                            dependency.relationship
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end border-t border-slate-100 p-6">
                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedTask(
                                        null
                                    )
                                }
                                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
