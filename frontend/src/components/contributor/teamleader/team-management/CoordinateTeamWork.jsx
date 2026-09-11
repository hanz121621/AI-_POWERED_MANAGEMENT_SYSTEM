
import { useEffect, useMemo, useState } from "react";
import {
    UsersRound,
    UserRound,
    CheckCircle2,
    Clock3,
    AlertTriangle,
    MessageCircle,
    Send,
    Search,
    ArrowRight,
    CircleDot,
    ClipboardList,
} from "lucide-react";
import { api } from "@/services/api";

const initialMembers = [
    {
        id: 1,
        name: "Developer 1",
        role: "Developer",
        specialization: "Frontend Development",
        status: "Active",
        workload: 0,
        currentTask: "No active task",
    },
    {
        id: 2,
        name: "Developer 2",
        role: "Developer",
        specialization: "Backend Development",
        status: "Active",
        workload: 2,
        currentTask: "API Integration",
    },
    {
        id: 3,
        name: "Developer 3",
        role: "Developer",
        specialization: "Full Stack Development",
        status: "Active",
        workload: 2,
        currentTask: "Sprint Dashboard",
    },
    {
        id: 4,
        name: "Staff 1",
        role: "Staff",
        specialization: "QA / Testing",
        status: "Active",
        workload: 1,
        currentTask: "Test Management",
    },
];

const initialTasks = [];

function statusClasses(status) {
    switch (status) {
        case "Active":
            return "bg-emerald-50 text-emerald-700 border-emerald-200";
        case "Blocked":
            return "bg-red-50 text-red-700 border-red-200";
        case "In Progress":
            return "bg-blue-50 text-blue-700 border-blue-200";
        default:
            return "bg-slate-50 text-slate-600 border-slate-200";
    }
}

function priorityClasses(priority) {
    switch (priority) {
        case "High":
            return "bg-red-50 text-red-700";
        case "Medium":
            return "bg-amber-50 text-amber-700";
        case "Low":
            return "bg-slate-100 text-slate-600";
        case "Critical":
            return "bg-red-100 text-red-800";
        default:
            return "bg-slate-100 text-slate-600";
    }
}

function getTaskId(task) {
    return task?.id ?? task?.Id ?? task?.taskId ?? task?.TaskId;
}

function getTaskTitle(task) {
    return (
        task?.title ??
        task?.Title ??
        task?.name ??
        task?.Name ??
        "Untitled Task"
    );
}

function getTaskPriority(task) {
    const priority =
        task?.priority ??
        task?.Priority ??
        "Medium";

    if (typeof priority === "number") {
        const values = {
            1: "Low",
            2: "Medium",
            3: "High",
            4: "Critical",
        };

        return values[priority] ?? "Medium";
    }

    return String(priority);
}

function getTaskStatus(task) {
    const status =
        task?.status ??
        task?.Status ??
        "Not Started";

    if (typeof status === "number") {
        const values = {
            1: "Not Started",
            2: "In Progress",
            3: "In Review",
            4: "Completed",
            5: "Blocked",
        };

        return values[status] ?? "Not Started";
    }

    const normalized = String(status).toLowerCase();

    if (normalized === "todo") return "Not Started";
    if (normalized === "inprogress") return "In Progress";
    if (normalized === "in review" || normalized === "inreview") {
        return "In Review";
    }
    if (normalized === "completed" || normalized === "done") {
        return "Completed";
    }
    if (normalized === "blocked") return "Blocked";

    return String(status);
}

function getAssigneeId(task) {
    return (
        task?.assignedContributorSDId ??
        task?.AssignedContributorSDId ??
        task?.assignedContributorId ??
        task?.AssignedContributorId ??
        task?.contributorId ??
        task?.ContributorId ??
        null
    );
}

function getAssigneeName(task) {
    return (
        task?.assignedContributorName ??
        task?.AssignedContributorName ??
        task?.assigneeName ??
        task?.AssigneeName ??
        task?.assignedTo ??
        task?.AssignedTo ??
        task?.assignee ??
        task?.Assignee ??
        "Unassigned"
    );
}

function normalizeTasks(data) {
    const source =
        data?.tasks ??
        data?.Tasks ??
        data?.data ??
        data?.Data ??
        data;

    if (!Array.isArray(source)) {
        return [];
    }

    return source.map((task) => ({
        ...task,
        id: getTaskId(task),
        title: getTaskTitle(task),
        priority: getTaskPriority(task),
        status: getTaskStatus(task),
        assignee: getAssigneeName(task),
        assigneeId: getAssigneeId(task),
    }));
}

export default function CoordinateTeamWork({
    sprintId,
    loadTasks,
    onRefresh,
}) {
    const [members] = useState(initialMembers);
    const [tasks, setTasks] = useState(initialTasks);
    const [selectedMember, setSelectedMember] = useState("");
    const [selectedTask, setSelectedTask] = useState("");
    const [search, setSearch] = useState("");
    const [message, setMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchTasks = async () => {
        setLoading(true);
        setErrorMessage("");

        try {
            let result;

            if (loadTasks) {
                result = await loadTasks();
            } else if (sprintId) {
                const response = await api.get(
                    `/tasks/team-leader/sprint/${sprintId}`
                );

                result = normalizeTasks(response.data);
            } else {
                setTasks([]);
                return;
            }

            const normalized = normalizeTasks(result);

            setTasks(normalized);

            if (onRefresh) {
                await onRefresh(normalized);
            }
        } catch (error) {
            console.error("Failed to load team leader tasks:", error);

            setErrorMessage(
                error?.response?.data?.message ||
                    error?.response?.data?.error ||
                    "Failed to load sprint tasks."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (sprintId || loadTasks) {
            fetchTasks();
        }
    }, [sprintId, loadTasks]);

    const filteredMembers = useMemo(() => {
        const value = search.toLowerCase().trim();

        if (!value) {
            return members;
        }

        return members.filter(
            (member) =>
                member.name.toLowerCase().includes(value) ||
                member.role.toLowerCase().includes(value) ||
                member.specialization.toLowerCase().includes(value)
        );
    }, [members, search]);

    const activeTasks = tasks.filter(
        (task) => getTaskStatus(task) === "In Progress"
    ).length;

    const blockedTasks = tasks.filter(
        (task) => getTaskStatus(task) === "Blocked"
    ).length;

    const coordinateTask = async () => {
        if (!selectedTask || !selectedMember) {
            setSuccessMessage("");
            setMessage("Select both a task and a team member.");
            return;
        }

        const member = members.find(
            (item) => String(item.id) === String(selectedMember)
        );

        if (!member) {
            setSuccessMessage("");
            setMessage("Selected team member was not found.");
            return;
        }

        setLoading(true);
        setMessage("");
        setSuccessMessage("");
        setErrorMessage("");

        try {
            await api.put(
                `/tasks/team-leader/${selectedTask}/assign/${selectedMember}`
            );

            setTasks((currentTasks) =>
                currentTasks.map((task) =>
                    String(getTaskId(task)) === String(selectedTask)
                        ? {
                              ...task,
                              assignee: member.name,
                              assigneeId: member.id,
                              status: "In Progress",
                          }
                        : task
                )
            );

            setSuccessMessage(
                `Task successfully coordinated with ${member.name}.`
            );

            setSelectedTask("");
            setSelectedMember("");

            await fetchTasks();
        } catch (error) {
            console.error("Failed to coordinate task:", error);

            setErrorMessage(
                error?.response?.data?.message ||
                    error?.response?.data?.error ||
                    "Failed to assign the task to the selected contributor."
            );
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = () => {
        if (!message.trim()) {
            return;
        }

        setSuccessMessage(
            "Team coordination message prepared successfully."
        );

        setMessage("");
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-600">
                                <UsersRound className="h-4 w-4" />
                                Team Management
                            </div>

                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                Coordinate Team Work
                            </h1>

                            <p className="mt-1 text-sm text-slate-500">
                                Coordinate assignments, balance workload, and
                                keep your team aligned with sprint objectives.
                            </p>
                        </div>

                        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                            <CircleDot className="h-5 w-5 text-emerald-500" />

                            <div>
                                <p className="text-xs text-slate-500">
                                    Current Sprint
                                </p>

                                <p className="text-sm font-semibold text-slate-900">
                                    {sprintId ? sprintId : "No sprint selected"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {successMessage && (
                    <div className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        <CheckCircle2 className="h-5 w-5" />
                        {successMessage}
                    </div>
                )}

                {message && (
                    <div className="mb-5 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                        <AlertTriangle className="h-5 w-5" />
                        {message}
                    </div>
                )}

                {errorMessage && (
                    <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        <AlertTriangle className="h-5 w-5" />
                        {errorMessage}
                    </div>
                )}

                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="rounded-xl bg-blue-50 p-3">
                                <UsersRound className="h-5 w-5 text-blue-600" />
                            </div>

                            <span className="text-xs font-medium text-slate-400">
                                TEAM
                            </span>
                        </div>

                        <p className="mt-4 text-2xl font-bold text-slate-900">
                            {members.length}
                        </p>

                        <p className="text-sm text-slate-500">
                            Team members
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="rounded-xl bg-emerald-50 p-3">
                                <ClipboardList className="h-5 w-5 text-emerald-600" />
                            </div>

                            <span className="text-xs font-medium text-slate-400">
                                ACTIVE
                            </span>
                        </div>

                        <p className="mt-4 text-2xl font-bold text-slate-900">
                            {activeTasks}
                        </p>

                        <p className="text-sm text-slate-500">
                            Tasks in progress
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="rounded-xl bg-amber-50 p-3">
                                <Clock3 className="h-5 w-5 text-amber-600" />
                            </div>

                            <span className="text-xs font-medium text-slate-400">
                                WORKLOAD
                            </span>
                        </div>

                        <p className="mt-4 text-2xl font-bold text-slate-900">
                            {members.reduce(
                                (total, member) =>
                                    total + member.workload,
                                0
                            )}
                        </p>

                        <p className="text-sm text-slate-500">
                            Active assignments
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="rounded-xl bg-red-50 p-3">
                                <AlertTriangle className="h-5 w-5 text-red-600" />
                            </div>

                            <span className="text-xs font-medium text-slate-400">
                                ATTENTION
                            </span>
                        </div>

                        <p className="mt-4 text-2xl font-bold text-slate-900">
                            {blockedTasks}
                        </p>

                        <p className="text-sm text-slate-500">
                            Blocked tasks
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-1">
                        <div className="mb-5">
                            <h2 className="text-lg font-semibold text-slate-900">
                                Coordinate Assignment
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Assign or coordinate a sprint task with a
                                contributor.
                            </p>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Task
                                </label>

                                <select
                                    value={selectedTask}
                                    onChange={(event) =>
                                        setSelectedTask(event.target.value)
                                    }
                                    disabled={loading || tasks.length === 0}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                                >
                                    <option value="">
                                        {loading
                                            ? "Loading tasks..."
                                            : tasks.length === 0
                                            ? "No tasks available"
                                            : "Select a task"}
                                    </option>

                                    {tasks.map((task) => (
                                        <option
                                            key={getTaskId(task)}
                                            value={getTaskId(task)}
                                        >
                                            {getTaskTitle(task)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Team Member
                                </label>

                                <select
                                    value={selectedMember}
                                    onChange={(event) =>
                                        setSelectedMember(event.target.value)
                                    }
                                    disabled={loading}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                                >
                                    <option value="">
                                        Select a contributor
                                    </option>

                                    {members.map((member) => (
                                        <option
                                            key={member.id}
                                            value={member.id}
                                        >
                                            {member.name} —{" "}
                                            {member.specialization}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button
                                type="button"
                                onClick={coordinateTask}
                                disabled={loading}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <ArrowRight className="h-4 w-4" />
                                {loading
                                    ? "Processing..."
                                    : "Coordinate Work"}
                            </button>
                        </div>

                        <div className="mt-6 rounded-xl bg-slate-50 p-4">
                            <div className="flex gap-3">
                                <Clock3 className="mt-0.5 h-5 w-5 text-slate-500" />

                                <div>
                                    <p className="text-sm font-semibold text-slate-800">
                                        Coordination principle
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-slate-500">
                                        Consider current workload,
                                        specialization, task priority, and
                                        sprint deadline before assigning work.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
                        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">
                                    Team Workload
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Monitor contributor workload before
                                    coordinating work.
                                </p>
                            </div>

                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                <input
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Search member..."
                                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500 sm:w-64"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            {filteredMembers.map((member) => (
                                <div
                                    key={member.id}
                                    className="rounded-xl border border-slate-100 p-4 transition hover:border-slate-200 hover:shadow-sm"
                                >
                                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                                                <UserRound className="h-5 w-5 text-blue-600" />
                                            </div>

                                            <div>
                                                <p className="text-sm font-semibold text-slate-900">
                                                    {member.name}
                                                </p>

                                                <p className="text-xs text-slate-500">
                                                    {member.role} ·{" "}
                                                    {member.specialization}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-3">
                                            <span
                                                className={`rounded-full border px-3 py-1 text-xs font-medium ${statusClasses(
                                                    member.status
                                                )}`}
                                            >
                                                {member.status}
                                            </span>

                                            <div className="text-right">
                                                <p className="text-xs text-slate-400">
                                                    Active workload
                                                </p>

                                                <p className="text-sm font-bold text-slate-900">
                                                    {member.workload} tasks
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-3 flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                                        <span className="text-xs text-slate-500">
                                            Current work
                                        </span>

                                        <span className="text-xs font-medium text-slate-700">
                                            {member.currentTask}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-5">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Sprint Work Coordination
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Current task ownership and execution status.
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[750px] text-left">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                        Task
                                    </th>

                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                        Assignee
                                    </th>

                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                        Priority
                                    </th>

                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                        Status
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {tasks.map((task) => (
                                    <tr
                                        key={getTaskId(task)}
                                        className="border-b border-slate-50 last:border-0"
                                    >
                                        <td className="px-4 py-4">
                                            <p className="text-sm font-medium text-slate-900">
                                                {getTaskTitle(task)}
                                            </p>
                                        </td>

                                        <td className="px-4 py-4 text-sm text-slate-600">
                                            {getAssigneeName(task)}
                                        </td>

                                        <td className="px-4 py-4">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-medium ${priorityClasses(
                                                    getTaskPriority(task)
                                                )}`}
                                            >
                                                {getTaskPriority(task)}
                                            </span>
                                        </td>

                                        <td className="px-4 py-4">
                                            <span
                                                className={`rounded-full border px-3 py-1 text-xs font-medium ${statusClasses(
                                                    getTaskStatus(task)
                                                )}`}
                                            >
                                                {getTaskStatus(task)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}

                                {!loading && tasks.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-4 py-10 text-center text-sm text-slate-500"
                                        >
                                            {sprintId
                                                ? "No tasks found for this sprint."
                                                : "Select a sprint to load team tasks."}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-5 flex items-center gap-3">
                        <div className="rounded-xl bg-blue-50 p-3">
                            <MessageCircle className="h-5 w-5 text-blue-600" />
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">
                                Team Coordination Message
                            </h2>

                            <p className="text-sm text-slate-500">
                                Prepare a message for your team.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 md:flex-row">
                        <input
                            value={message}
                            onChange={(event) =>
                                setMessage(event.target.value)
                            }
                            placeholder="Write a coordination message..."
                            className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                        <button
                            type="button"
                            onClick={sendMessage}
                            className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                            <Send className="h-4 w-4" />
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
