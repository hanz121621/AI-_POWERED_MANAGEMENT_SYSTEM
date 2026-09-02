import { useMemo, useState } from "react";
import {
    ListTodo,
    Search,
    Filter,
    Clock3,
    CheckCircle2,
    AlertTriangle,
    CircleDot,
    UserRound,
    CalendarDays,
    Flag,
} from "lucide-react";

const initialTasks = [
    {
        id: 1,
        title: "Design Project Dashboard",
        assignee: "Developer 1",
        priority: "High",
        status: "In Progress",
        progress: 65,
        deadline: "Sep 02, 2026",
        type: "Development",
    },
    {
        id: 2,
        title: "Implement Authentication API",
        assignee: "Developer 2",
        priority: "High",
        status: "In Progress",
        progress: 50,
        deadline: "Sep 03, 2026",
        type: "Development",
    },
    {
        id: 3,
        title: "Create Sprint Management API",
        assignee: "Developer 2",
        priority: "Medium",
        status: "Completed",
        progress: 100,
        deadline: "Aug 30, 2026",
        type: "Backend",
    },
    {
        id: 4,
        title: "Build Team Management UI",
        assignee: "Developer 3",
        priority: "Medium",
        status: "In Progress",
        progress: 45,
        deadline: "Sep 04, 2026",
        type: "Frontend",
    },
    {
        id: 5,
        title: "Test Task Management Module",
        assignee: "Staff 1",
        priority: "Low",
        status: "Blocked",
        progress: 30,
        deadline: "Sep 05, 2026",
        type: "QA / Testing",
    },
];

function statusIcon(status) {
    if (status === "Completed") {
        return <CheckCircle2 className="h-4 w-4" />;
    }

    if (status === "Blocked") {
        return <AlertTriangle className="h-4 w-4" />;
    }

    return <CircleDot className="h-4 w-4" />;
}

function statusClass(status) {
    if (status === "Completed") {
        return "bg-emerald-50 text-emerald-700";
    }

    if (status === "Blocked") {
        return "bg-red-50 text-red-700";
    }

    return "bg-blue-50 text-blue-700";
}

function priorityClass(priority) {
    if (priority === "High") {
        return "bg-red-50 text-red-700";
    }

    if (priority === "Medium") {
        return "bg-amber-50 text-amber-700";
    }

    return "bg-slate-100 text-slate-600";
}

export default function ViewTeamTasks({
    tasks = initialTasks,
    onTaskSelect,
}) {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [priorityFilter, setPriorityFilter] = useState("All");

    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => {
            const matchesSearch =
                !search ||
                [
                    task.title,
                    task.assignee,
                    task.type,
                    task.status,
                ]
                    .join(" ")
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const matchesStatus =
                statusFilter === "All" || task.status === statusFilter;

            const matchesPriority =
                priorityFilter === "All" ||
                task.priority === priorityFilter;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesPriority
            );
        });
    }, [tasks, search, statusFilter, priorityFilter]);

    const completed = tasks.filter(
        (task) => task.status === "Completed"
    ).length;

    const inProgress = tasks.filter(
        (task) => task.status === "In Progress"
    ).length;

    const blocked = tasks.filter(
        (task) => task.status === "Blocked"
    ).length;

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-6">
                {/* Header */}
                <div>
                    <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
                        <ListTodo className="h-4 w-4" />
                        Team Management
                    </div>

                    <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                        Team Tasks
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Monitor tasks assigned to your team and track
                        their current execution status.
                    </p>
                </div>

                {/* Summary */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Total Tasks
                        </p>

                        <p className="mt-2 text-2xl font-bold text-slate-900">
                            {tasks.length}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                            Assigned to team
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">
                            In Progress
                        </p>

                        <p className="mt-2 text-2xl font-bold text-blue-700">
                            {inProgress}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                            Currently active
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Completed
                        </p>

                        <p className="mt-2 text-2xl font-bold text-emerald-700">
                            {completed}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                            Finished tasks
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Blocked
                        </p>

                        <p className="mt-2 text-2xl font-bold text-red-700">
                            {blocked}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                            Require attention
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex flex-col gap-3 lg:flex-row">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search tasks, members, or categories..."
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-slate-400 focus:bg-white"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-slate-400" />

                            <select
                                value={statusFilter}
                                onChange={(event) =>
                                    setStatusFilter(event.target.value)
                                }
                                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none"
                            >
                                <option value="All">All Statuses</option>
                                <option value="In Progress">
                                    In Progress
                                </option>
                                <option value="Completed">
                                    Completed
                                </option>
                                <option value="Blocked">
                                    Blocked
                                </option>
                            </select>

                            <select
                                value={priorityFilter}
                                onChange={(event) =>
                                    setPriorityFilter(event.target.value)
                                }
                                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none"
                            >
                                <option value="All">All Priorities</option>
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Task list */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 p-5">
                        <h2 className="font-bold text-slate-900">
                            Assigned Team Tasks
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            {filteredTasks.length} task
                            {filteredTasks.length !== 1 ? "s" : ""} shown
                        </p>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {filteredTasks.map((task) => (
                            <button
                                key={task.id}
                                type="button"
                                onClick={() =>
                                    onTaskSelect?.(task)
                                }
                                className="w-full p-5 text-left transition hover:bg-slate-50"
                            >
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="font-semibold text-slate-900">
                                                {task.title}
                                            </h3>

                                            <span
                                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(
                                                    task.status
                                                )}`}
                                            >
                                                {statusIcon(task.status)}
                                                {task.status}
                                            </span>

                                            <span
                                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${priorityClass(
                                                    task.priority
                                                )}`}
                                            >
                                                <Flag className="h-3 w-3" />
                                                {task.priority}
                                            </span>
                                        </div>

                                        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
                                            <span className="inline-flex items-center gap-1.5">
                                                <UserRound className="h-3.5 w-3.5" />
                                                {task.assignee}
                                            </span>

                                            <span className="inline-flex items-center gap-1.5">
                                                <CalendarDays className="h-3.5 w-3.5" />
                                                {task.deadline}
                                            </span>

                                            <span className="inline-flex items-center gap-1.5">
                                                <Clock3 className="h-3.5 w-3.5" />
                                                {task.type}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="w-full lg:w-64">
                                        <div className="mb-2 flex justify-between text-xs">
                                            <span className="font-medium text-slate-500">
                                                Progress
                                            </span>

                                            <span className="font-bold text-slate-900">
                                                {task.progress}%
                                            </span>
                                        </div>

                                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                            <div
                                                className="h-full rounded-full bg-slate-900 transition-all"
                                                style={{
                                                    width: `${task.progress}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {filteredTasks.length === 0 && (
                        <div className="p-12 text-center">
                            <ListTodo className="mx-auto h-9 w-9 text-slate-300" />

                            <p className="mt-3 font-medium text-slate-700">
                                No tasks found
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                                Try changing your search or filters.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}