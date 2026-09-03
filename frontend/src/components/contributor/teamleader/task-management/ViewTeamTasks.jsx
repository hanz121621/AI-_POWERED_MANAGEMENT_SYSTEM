
import { useMemo, useState } from "react";
import {
    Search,
    ListChecks,
    Filter,
    CalendarDays,
    UserRound,
    Flag,
    CheckCircle2,
    Clock3,
    CircleDot,
    AlertTriangle,
    ChevronDown,
    Eye,
} from "lucide-react";

const SAMPLE_TASKS = [
    {
        id: "TASK-101",
        title: "Implement authentication module",
        description: "Complete login and authentication functionality.",
        contributor: "Abebe Kebede",
        role: "Developer",
        priority: "High",
        status: "In Progress",
        deadline: "2026-09-05",
        progress: 65,
    },
    {
        id: "TASK-102",
        title: "Prepare dashboard interface",
        description: "Build the team dashboard interface.",
        contributor: "Sara Ahmed",
        role: "Developer",
        priority: "Medium",
        status: "Review",
        deadline: "2026-09-04",
        progress: 90,
    },
    {
        id: "TASK-103",
        title: "Write project documentation",
        description: "Prepare technical documentation for the project.",
        contributor: "Daniel Tadesse",
        role: "Staff",
        priority: "Low",
        status: "To Do",
        deadline: "2026-09-07",
        progress: 0,
    },
    {
        id: "TASK-104",
        title: "Fix notification service",
        description: "Resolve notification delivery issues.",
        contributor: "Mekdes Tesfaye",
        role: "Developer",
        priority: "Critical",
        status: "Blocked",
        deadline: "2026-09-03",
        progress: 40,
    },
    {
        id: "TASK-105",
        title: "Complete API integration",
        description: "Connect frontend task module to backend APIs.",
        contributor: "Hana Worku",
        role: "Developer",
        priority: "High",
        status: "Completed",
        deadline: "2026-09-02",
        progress: 100,
    },
];

const STATUS_OPTIONS = [
    "All",
    "To Do",
    "In Progress",
    "Review",
    "Completed",
    "Blocked",
];

const PRIORITY_OPTIONS = [
    "All",
    "Low",
    "Medium",
    "High",
    "Critical",
];

function getStatusIcon(status) {
    switch (status) {
        case "Completed":
            return CheckCircle2;
        case "In Progress":
            return Clock3;
        case "Review":
            return CircleDot;
        case "Blocked":
            return AlertTriangle;
        default:
            return CircleDot;
    }
}

function getStatusClass(status) {
    switch (status) {
        case "Completed":
            return "bg-emerald-50 text-emerald-700";
        case "In Progress":
            return "bg-blue-50 text-blue-700";
        case "Review":
            return "bg-purple-50 text-purple-700";
        case "Blocked":
            return "bg-red-50 text-red-700";
        default:
            return "bg-slate-100 text-slate-600";
    }
}

function getPriorityClass(priority) {
    switch (priority) {
        case "Critical":
            return "bg-red-50 text-red-700";
        case "High":
            return "bg-orange-50 text-orange-700";
        case "Medium":
            return "bg-yellow-50 text-yellow-700";
        default:
            return "bg-slate-100 text-slate-600";
    }
}

export default function ViewTeamTasks() {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");
    const [priority, setPriority] = useState("All");
    const [selectedTask, setSelectedTask] = useState(null);

    const filteredTasks = useMemo(() => {
        return SAMPLE_TASKS.filter((task) => {
            const searchValue = search.toLowerCase();

            const matchesSearch =
                task.title.toLowerCase().includes(searchValue) ||
                task.contributor.toLowerCase().includes(searchValue) ||
                task.id.toLowerCase().includes(searchValue);

            const matchesStatus =
                status === "All" || task.status === status;

            const matchesPriority =
                priority === "All" || task.priority === priority;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesPriority
            );
        });
    }, [search, status, priority]);

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* HEADER */}
            <div className="border-b border-slate-200 px-5 py-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                    <div>
                        <h3 className="text-base font-semibold text-slate-900">
                            Team Tasks
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                            View and monitor tasks assigned to your team members.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2">
                        <ListChecks className="h-4 w-4 text-blue-600" />

                        <span className="text-sm font-medium text-blue-700">
                            {filteredTasks.length} Tasks
                        </span>
                    </div>
                </div>
            </div>

            {/* FILTERS */}
            <div className="border-b border-slate-200 bg-slate-50/70 p-4">
                <div className="flex flex-col gap-3 lg:flex-row">

                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Search tasks or team members..."
                            className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div className="relative">
                        <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <select
                            value={status}
                            onChange={(event) =>
                                setStatus(event.target.value)
                            }
                            className="appearance-none rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-9 text-sm text-slate-700 outline-none focus:border-blue-500"
                        >
                            {STATUS_OPTIONS.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>

                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </div>

                    <div className="relative">
                        <Flag className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <select
                            value={priority}
                            onChange={(event) =>
                                setPriority(event.target.value)
                            }
                            className="appearance-none rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-9 text-sm text-slate-700 outline-none focus:border-blue-500"
                        >
                            {PRIORITY_OPTIONS.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>

                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </div>
                </div>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left">

                    <thead className="bg-slate-50">
                        <tr className="border-b border-slate-200">
                            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Task
                            </th>

                            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Contributor
                            </th>

                            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Priority
                            </th>

                            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Status
                            </th>

                            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Deadline
                            </th>

                            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Progress
                            </th>

                            <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">

                        {filteredTasks.length > 0 ? (
                            filteredTasks.map((task) => {
                                const StatusIcon = getStatusIcon(task.status);

                                return (
                                    <tr
                                        key={task.id}
                                        className="transition hover:bg-slate-50"
                                    >
                                        <td className="px-5 py-4">
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900">
                                                    {task.title}
                                                </p>

                                                <p className="mt-1 max-w-xs truncate text-xs text-slate-500">
                                                    {task.description}
                                                </p>

                                                <p className="mt-1 text-xs font-medium text-slate-400">
                                                    {task.id}
                                                </p>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">

                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                                                    <UserRound className="h-4 w-4 text-slate-500" />
                                                </div>

                                                <div>
                                                    <p className="text-sm font-medium text-slate-800">
                                                        {task.contributor}
                                                    </p>

                                                    <p className="text-xs text-slate-400">
                                                        {task.role}
                                                    </p>
                                                </div>

                                            </div>
                                        </td>

                                        <td className="px-5 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getPriorityClass(
                                                    task.priority
                                                )}`}
                                            >
                                                {task.priority}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <span
                                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
                                                    task.status
                                                )}`}
                                            >
                                                <StatusIcon className="h-3.5 w-3.5" />
                                                {task.status}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <CalendarDays className="h-4 w-4 text-slate-400" />
                                                {task.deadline}
                                            </div>
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="w-28">

                                                <div className="mb-1 flex items-center justify-between">
                                                    <span className="text-xs text-slate-400">
                                                        Progress
                                                    </span>

                                                    <span className="text-xs font-semibold text-slate-700">
                                                        {task.progress}%
                                                    </span>
                                                </div>

                                                <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                                                    <div
                                                        className="h-full rounded-full bg-blue-600"
                                                        style={{
                                                            width: `${task.progress}%`,
                                                        }}
                                                    />
                                                </div>

                                            </div>
                                        </td>

                                        <td className="px-5 py-4 text-right">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setSelectedTask(task)
                                                }
                                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                                            >
                                                <Eye className="h-3.5 w-3.5" />
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="px-5 py-12 text-center"
                                >
                                    <ListChecks className="mx-auto mb-3 h-8 w-8 text-slate-300" />

                                    <p className="text-sm font-medium text-slate-700">
                                        No team tasks found.
                                    </p>

                                    <p className="mt-1 text-xs text-slate-400">
                                        Try changing your search or filters.
                                    </p>
                                </td>
                            </tr>
                        )}

                    </tbody>
                </table>
            </div>

            {/* MODAL */}
            {selectedTask && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">

                    <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">

                        <div className="flex items-start justify-between border-b border-slate-200 p-5">

                            <div>
                                <p className="text-xs font-medium text-slate-400">
                                    {selectedTask.id}
                                </p>

                                <h3 className="mt-1 text-lg font-semibold text-slate-900">
                                    {selectedTask.title}
                                </h3>
                            </div>

                            <button
                                type="button"
                                onClick={() => setSelectedTask(null)}
                                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                            >
                                ×
                            </button>
                        </div>

                        <div className="space-y-5 p-5">

                            <p className="text-sm leading-6 text-slate-600">
                                {selectedTask.description}
                            </p>

                            <div className="grid gap-4 sm:grid-cols-2">

                                <DetailItem
                                    label="Contributor"
                                    value={selectedTask.contributor}
                                />

                                <DetailItem
                                    label="Role"
                                    value={selectedTask.role}
                                />

                                <DetailItem
                                    label="Priority"
                                    value={selectedTask.priority}
                                />

                                <DetailItem
                                    label="Status"
                                    value={selectedTask.status}
                                />

                                <DetailItem
                                    label="Deadline"
                                    value={selectedTask.deadline}
                                />

                                <DetailItem
                                    label="Progress"
                                    value={`${selectedTask.progress}%`}
                                />

                            </div>

                        </div>

                        <div className="flex justify-end border-t border-slate-200 p-5">

                            <button
                                type="button"
                                onClick={() => setSelectedTask(null)}
                                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
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

function DetailItem({ label, value }) {
    return (
        <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs text-slate-400">
                {label}
            </p>

            <p className="mt-1 text-sm font-medium text-slate-800">
                {value}
            </p>
        </div>
    );
}
