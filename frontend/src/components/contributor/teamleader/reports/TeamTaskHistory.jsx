
import { useEffect, useMemo, useState } from "react";

import {
    CalendarDays,
    CheckCircle2,
    ClipboardList,
    Clock3,
    Eye,
    Filter,
    History,
    Loader2,
    Search,
    UserRound,
} from "lucide-react";

import api from "@/services/api";

function formatDate(date) {
    if (!date) return "—";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return "—";

    return parsed.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function getStatusStyle(status) {
    switch (status) {
        case "Completed":
            return "bg-emerald-50 text-emerald-700 ring-emerald-200";
        case "In Progress":
            return "bg-blue-50 text-blue-700 ring-blue-200";
        case "Blocked":
            return "bg-red-50 text-red-700 ring-red-200";
        case "In Review":
            return "bg-violet-50 text-violet-700 ring-violet-200";
        case "Not Started":
            return "bg-slate-100 text-slate-700 ring-slate-200";
        default:
            return "bg-slate-50 text-slate-600 ring-slate-200";
    }
}

function getPriorityStyle(priority) {
    switch (priority) {
        case "Critical":
            return "text-red-600";
        case "High":
            return "text-orange-600";
        case "Medium":
            return "text-amber-600";
        case "Low":
            return "text-slate-500";
        default:
            return "text-slate-600";
    }
}

function normalizeStatus(status) {
    if (typeof status === "number") {
        switch (status) {
            case 1:
                return "Not Started";
            case 2:
                return "In Progress";
            case 3:
                return "In Review";
            case 4:
                return "Completed";
            case 5:
                return "Blocked";
            default:
                return "Not Started";
        }
    }

    const value = String(status ?? "")
        .trim()
        .toLowerCase();

    if (
        value === "completed" ||
        value === "complete" ||
        value === "done"
    ) {
        return "Completed";
    }

    if (
        value === "inprogress" ||
        value === "in progress"
    ) {
        return "In Progress";
    }

    if (
        value === "inreview" ||
        value === "in review" ||
        value === "review"
    ) {
        return "In Review";
    }

    if (value === "blocked") {
        return "Blocked";
    }

    return "Not Started";
}

function normalizePriority(priority) {
    if (typeof priority === "number") {
        switch (priority) {
            case 1:
                return "Low";
            case 2:
                return "Medium";
            case 3:
                return "High";
            case 4:
                return "Critical";
            default:
                return "Medium";
        }
    }

    const value = String(priority ?? "")
        .trim()
        .toLowerCase();

    if (value === "critical") return "Critical";
    if (value === "high") return "High";
    if (value === "low") return "Low";

    return "Medium";
}

function extractTasks(response) {
    const data = response?.data ?? response;

    if (Array.isArray(data)) {
        return data;
    }

    if (Array.isArray(data?.tasks)) {
        return data.tasks;
    }

    if (Array.isArray(data?.Tasks)) {
        return data.Tasks;
    }

    if (Array.isArray(data?.data)) {
        return data.data;
    }

    if (Array.isArray(data?.Data)) {
        return data.Data;
    }

    if (Array.isArray(data?.items)) {
        return data.items;
    }

    if (Array.isArray(data?.Items)) {
        return data.Items;
    }

    return [];
}

function normalizeTask(task, index) {
    const assignedContributor =
        task?.assignedContributor ??
        task?.AssignedContributor ??
        task?.contributor ??
        task?.Contributor ??
        task?.assignedUser ??
        task?.AssignedUser ??
        null;

    const member =
        task?.assignedContributorName ??
        task?.AssignedContributorName ??
        task?.contributorName ??
        task?.ContributorName ??
        task?.assignedUserName ??
        task?.AssignedUserName ??
        assignedContributor?.fullName ??
        assignedContributor?.FullName ??
        assignedContributor?.name ??
        assignedContributor?.Name ??
        task?.memberName ??
        task?.MemberName ??
        "Unassigned";

    const id =
        task?.id ??
        task?.Id ??
        task?.taskId ??
        task?.TaskId ??
        `TASK-${index + 1}`;

    const title =
        task?.title ??
        task?.Title ??
        task?.name ??
        task?.Name ??
        "Untitled Task";

    const project =
        task?.projectName ??
        task?.ProjectName ??
        task?.project?.name ??
        task?.project?.Name ??
        task?.Project?.Name ??
        "—";

    const sprint =
        task?.sprintName ??
        task?.SprintName ??
        task?.sprint?.name ??
        task?.sprint?.Name ??
        task?.Sprint?.Name ??
        "—";

    const status = normalizeStatus(
        task?.status ??
            task?.Status ??
            task?.taskStatus ??
            task?.TaskStatus
    );

    const priority = normalizePriority(
        task?.priority ??
            task?.Priority ??
            task?.taskPriority ??
            task?.TaskPriority
    );

    const assignmentDate =
        task?.assignmentDate ??
        task?.AssignmentDate ??
        task?.assignedAt ??
        task?.AssignedAt ??
        task?.createdAt ??
        task?.CreatedAt ??
        null;

    const completionDate =
        task?.completionDate ??
        task?.CompletionDate ??
        task?.completedAt ??
        task?.CompletedAt ??
        null;

    const comments =
        task?.commentsCount ??
        task?.CommentsCount ??
        task?.commentCount ??
        task?.CommentCount ??
        task?.comments ??
        task?.Comments ??
        0;

    const files =
        task?.filesCount ??
        task?.FilesCount ??
        task?.fileCount ??
        task?.FileCount ??
        task?.files ??
        task?.Files ??
        0;

    return {
        ...task,
        id: String(id),
        name: title,
        project,
        sprint,
        member,
        status,
        priority,
        assignmentDate,
        completionDate,
        comments: Number(comments) || 0,
        files: Number(files) || 0,
    };
}

export default function ViewTeamTaskHistory({
    sprintId,
    tasks: providedTasks,
    onRefresh,
}) {
    const [tasks, setTasks] = useState(
        Array.isArray(providedTasks)
            ? providedTasks.map(normalizeTask)
            : []
    );

    const [loading, setLoading] = useState(
        !Array.isArray(providedTasks) && Boolean(sprintId)
    );

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [memberFilter, setMemberFilter] = useState("All");
    const [projectFilter, setProjectFilter] = useState("All");
    const [sprintFilter, setSprintFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedTask, setSelectedTask] = useState(null);

    useEffect(() => {
        if (Array.isArray(providedTasks)) {
            setTasks(providedTasks.map(normalizeTask));
            setLoading(false);
            setError("");
            return;
        }

        if (!sprintId) {
            setTasks([]);
            setLoading(false);
            setError(
                "A sprint ID is required to load team task history."
            );
            return;
        }

        let cancelled = false;

        const loadTasks = async () => {
            setLoading(true);
            setError("");

            try {
                const response = await api.get(
                    `/tasks/team-leader/sprint/${sprintId}`
                );

                if (cancelled) return;

                const backendTasks = extractTasks(response);

                setTasks(
                    backendTasks.map((task, index) =>
                        normalizeTask(task, index)
                    )
                );
            } catch (requestError) {
                if (cancelled) return;

                console.error(
                    "Failed to load team task history:",
                    requestError
                );

                setTasks([]);

                setError(
                    requestError?.response?.data?.message ||
                        requestError?.response?.data?.Message ||
                        "Failed to load team task history."
                );
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadTasks();

        return () => {
            cancelled = true;
        };
    }, [sprintId, providedTasks]);

    const members = useMemo(() => {
        return [
            "All",
            ...new Set(
                tasks
                    .map((task) => task.member)
                    .filter(Boolean)
            ),
        ];
    }, [tasks]);

    const projects = useMemo(() => {
        return [
            "All",
            ...new Set(
                tasks
                    .map((task) => task.project)
                    .filter(Boolean)
            ),
        ];
    }, [tasks]);

    const sprints = useMemo(() => {
        return [
            "All",
            ...new Set(
                tasks
                    .map((task) => task.sprint)
                    .filter(Boolean)
            ),
        ];
    }, [tasks]);

    const filteredTasks = useMemo(() => {
        const searchText = search.trim().toLowerCase();

        return tasks.filter((task) => {
            const matchesSearch =
                !searchText ||
                task.name.toLowerCase().includes(searchText) ||
                task.id.toLowerCase().includes(searchText) ||
                task.member.toLowerCase().includes(searchText) ||
                task.project.toLowerCase().includes(searchText) ||
                task.sprint.toLowerCase().includes(searchText);

            const matchesMember =
                memberFilter === "All" ||
                task.member === memberFilter;

            const matchesProject =
                projectFilter === "All" ||
                task.project === projectFilter;

            const matchesSprint =
                sprintFilter === "All" ||
                task.sprint === sprintFilter;

            const matchesStatus =
                statusFilter === "All" ||
                task.status === statusFilter;

            return (
                matchesSearch &&
                matchesMember &&
                matchesProject &&
                matchesSprint &&
                matchesStatus
            );
        });
    }, [
        tasks,
        search,
        memberFilter,
        projectFilter,
        sprintFilter,
        statusFilter,
    ]);

    const handleRefresh = async () => {
        if (onRefresh) {
            await onRefresh();
            return;
        }

        if (!sprintId) return;

        setLoading(true);
        setError("");

        try {
            const response = await api.get(
                `/tasks/team-leader/sprint/${sprintId}`
            );

            const backendTasks = extractTasks(response);

            setTasks(
                backendTasks.map((task, index) =>
                    normalizeTask(task, index)
                )
            );
        } catch (requestError) {
            console.error(
                "Failed to refresh team task history:",
                requestError
            );

            setError(
                requestError?.response?.data?.message ||
                    requestError?.response?.data?.Message ||
                    "Failed to refresh team task history."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <History className="h-5 w-5 text-indigo-600" />

                            <h2 className="text-lg font-semibold text-slate-900">
                                Team Task History
                            </h2>
                        </div>

                        <p className="mt-1 text-sm text-slate-500">
                            Review team task assignments, current
                            statuses, priorities, and available task
                            activity information.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        {sprintId && (
                            <button
                                type="button"
                                onClick={handleRefresh}
                                disabled={loading}
                                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <History className="h-4 w-4" />
                                Refresh
                            </button>
                        )}

                        <div className="rounded-lg bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600">
                            {filteredTasks.length} Record
                            {filteredTasks.length !== 1
                                ? "s"
                                : ""}
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-b border-slate-200 bg-slate-50/70 px-6 py-4">
                <div className="mb-3 flex items-center gap-2">
                    <Filter className="h-4 w-4 text-slate-500" />

                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Filter Task History
                    </span>
                </div>

                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                    <div className="relative xl:col-span-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Search tasks..."
                            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                        />
                    </div>

                    <SelectFilter
                        value={memberFilter}
                        onChange={setMemberFilter}
                        options={members}
                        placeholder="Team Member"
                    />

                    <SelectFilter
                        value={projectFilter}
                        onChange={setProjectFilter}
                        options={projects}
                        placeholder="Project"
                    />

                    <SelectFilter
                        value={sprintFilter}
                        onChange={setSprintFilter}
                        options={sprints}
                        placeholder="Sprint"
                    />

                    <SelectFilter
                        value={statusFilter}
                        onChange={setStatusFilter}
                        options={[
                            "All",
                            "Not Started",
                            "In Progress",
                            "In Review",
                            "Completed",
                            "Blocked",
                        ]}
                        placeholder="Status"
                    />
                </div>
            </div>

            {error && (
                <div className="border-b border-red-100 bg-red-50 px-6 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="flex min-h-[280px] items-center justify-center">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Loading team task history...
                    </div>
                </div>
            ) : (
                <>
                    <div className="hidden overflow-x-auto lg:block">
                        {filteredTasks.length === 0 ? (
                            <EmptyState />
                        ) : (
                            <table className="w-full min-w-[1100px]">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-white">
                                        <TableHeader>
                                            Task
                                        </TableHeader>
                                        <TableHeader>
                                            Team Member
                                        </TableHeader>
                                        <TableHeader>
                                            Project
                                        </TableHeader>
                                        <TableHeader>
                                            Sprint
                                        </TableHeader>
                                        <TableHeader>
                                            Status
                                        </TableHeader>
                                        <TableHeader>
                                            Priority
                                        </TableHeader>
                                        <TableHeader>
                                            Assignment
                                        </TableHeader>
                                        <TableHeader>
                                            Completion
                                        </TableHeader>
                                        <TableHeader>
                                            Action
                                        </TableHeader>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredTasks.map((task) => (
                                        <tr
                                            key={task.id}
                                            className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                                        >
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-800">
                                                        {task.name}
                                                    </p>

                                                    <p className="mt-1 text-xs text-slate-400">
                                                        {task.id}
                                                    </p>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100">
                                                        <UserRound className="h-4 w-4 text-indigo-600" />
                                                    </div>

                                                    <span className="text-sm text-slate-700">
                                                        {task.member}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                {task.project}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                {task.sprint}
                                            </td>

                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${getStatusStyle(
                                                        task.status
                                                    )}`}
                                                >
                                                    {task.status}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span
                                                    className={`text-sm font-medium ${getPriorityStyle(
                                                        task.priority
                                                    )}`}
                                                >
                                                    {task.priority}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 text-xs text-slate-500">
                                                {formatDate(
                                                    task.assignmentDate
                                                )}
                                            </td>

                                            <td className="px-6 py-4 text-xs text-slate-500">
                                                {formatDate(
                                                    task.completionDate
                                                )}
                                            </td>

                                            <td className="px-6 py-4">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedTask(
                                                            task
                                                        )
                                                    }
                                                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    <div className="space-y-3 p-4 lg:hidden">
                        {filteredTasks.length === 0 ? (
                            <EmptyState />
                        ) : (
                            filteredTasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="rounded-xl border border-slate-200 p-4"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800">
                                                {task.name}
                                            </p>

                                            <p className="mt-1 text-xs text-slate-400">
                                                {task.id}
                                            </p>
                                        </div>

                                        <span
                                            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${getStatusStyle(
                                                task.status
                                            )}`}
                                        >
                                            {task.status}
                                        </span>
                                    </div>

                                    <div className="mt-4 grid grid-cols-2 gap-3">
                                        <DetailItem
                                            icon={UserRound}
                                            label="Member"
                                            value={task.member}
                                        />

                                        <DetailItem
                                            icon={ClipboardList}
                                            label="Sprint"
                                            value={task.sprint}
                                        />

                                        <DetailItem
                                            icon={CalendarDays}
                                            label="Assigned"
                                            value={formatDate(
                                                task.assignmentDate
                                            )}
                                        />

                                        <DetailItem
                                            icon={CheckCircle2}
                                            label="Completed"
                                            value={formatDate(
                                                task.completionDate
                                            )}
                                        />
                                    </div>

                                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                                        <span
                                            className={`text-xs font-semibold ${getPriorityStyle(
                                                task.priority
                                            )}`}
                                        >
                                            {task.priority} Priority
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setSelectedTask(task)
                                            }
                                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600"
                                        >
                                            <Eye className="h-4 w-4" />
                                            View History
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}

            {selectedTask && (
                <TaskHistoryModal
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                />
            )}
        </section>
    );
}

function SelectFilter({
    value,
    onChange,
    options,
    placeholder,
}) {
    return (
        <select
            value={value}
            onChange={(event) => onChange(event.target.value)}
            aria-label={placeholder}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        >
            {options.map((option) => (
                <option key={option} value={option}>
                    {option === "All"
                        ? `All ${placeholder}`
                        : option}
                </option>
            ))}
        </select>
    );
}

function TableHeader({ children }) {
    return (
        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            {children}
        </th>
    );
}

function DetailItem({ icon: Icon, label, value }) {
    return (
        <div className="rounded-lg bg-slate-50 p-3">
            <div className="flex items-center gap-1.5 text-slate-400">
                <Icon className="h-3.5 w-3.5" />

                <span className="text-[11px] font-medium">
                    {label}
                </span>
            </div>

            <p className="mt-1 text-xs font-medium text-slate-700">
                {value}
            </p>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="px-6 py-14 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <History className="h-5 w-5 text-slate-400" />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-slate-800">
                No task history found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
                Try changing your search or filter settings.
            </p>
        </div>
    );
}

function TaskHistoryModal({ task, onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
                <div className="flex items-start justify-between border-b border-slate-200 p-6">
                    <div>
                        <p className="text-xs font-medium text-slate-400">
                            {task.id}
                        </p>

                        <h3 className="mt-1 text-lg font-bold text-slate-900">
                            {task.name}
                        </h3>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    >
                        ×
                    </button>
                </div>

                <div className="space-y-6 p-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <ModalInfo
                            label="Team Member"
                            value={task.member}
                        />

                        <ModalInfo
                            label="Project"
                            value={task.project}
                        />

                        <ModalInfo
                            label="Sprint"
                            value={task.sprint}
                        />

                        <ModalInfo
                            label="Priority"
                            value={task.priority}
                        />

                        <ModalInfo
                            label="Status"
                            value={task.status}
                        />

                        <ModalInfo
                            label="Assignment Date"
                            value={formatDate(
                                task.assignmentDate
                            )}
                        />

                        <ModalInfo
                            label="Completion Date"
                            value={formatDate(
                                task.completionDate
                            )}
                        />
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-slate-800">
                            Activity Timeline
                        </h4>

                        <div className="mt-4 space-y-4">
                            <TimelineItem
                                title="Task assigned"
                                description={
                                    task.member === "Unassigned"
                                        ? "This task is currently unassigned."
                                        : `Task assigned to ${task.member}.`
                                }
                                date={formatDate(
                                    task.assignmentDate
                                )}
                            />

                            {task.status === "In Progress" && (
                                <TimelineItem
                                    title="Task in progress"
                                    description="The task is currently being worked on."
                                    date="Current status"
                                />
                            )}

                            {task.status === "In Review" && (
                                <TimelineItem
                                    title="Task in review"
                                    description="The task is currently under review."
                                    date="Current status"
                                />
                            )}

                            {task.status === "Blocked" && (
                                <TimelineItem
                                    title="Task blocked"
                                    description="The task currently requires attention."
                                    date="Current status"
                                />
                            )}

                            {task.status === "Completed" && (
                                <TimelineItem
                                    title="Task completed"
                                    description="The task is marked as completed."
                                    date={formatDate(
                                        task.completionDate
                                    )}
                                    completed
                                />
                            )}
                        </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-xl bg-slate-50 p-4">
                            <p className="text-xs text-slate-400">
                                Comments
                            </p>

                            <p className="mt-1 text-xl font-bold text-slate-800">
                                {task.comments}
                            </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-4">
                            <p className="text-xs text-slate-400">
                                Files Submitted
                            </p>

                            <p className="mt-1 text-xl font-bold text-slate-800">
                                {task.files}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

function ModalInfo({ label, value }) {
    return (
        <div className="rounded-lg border border-slate-200 p-4">
            <p className="text-xs text-slate-400">
                {label}
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-800">
                {value}
            </p>
        </div>
    );
}

function TimelineItem({
    title,
    description,
    date,
    completed = false,
}) {
    return (
        <div className="flex gap-3">
            <div
                className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    completed
                        ? "bg-emerald-100"
                        : "bg-indigo-100"
                }`}
            >
                {completed ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ) : (
                    <Clock3 className="h-4 w-4 text-indigo-600" />
                )}
            </div>

            <div>
                <p className="text-sm font-semibold text-slate-800">
                    {title}
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                    {description}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                    {date}
                </p>
            </div>
        </div>
    );
}
