import { useMemo, useState } from "react";

import {
    Code2,
    ClipboardList,
    CheckCircle2,
    Clock3,
    AlertTriangle,
    Eye,
    MessageSquare,
    Target,
    TrendingUp,
    CalendarDays,
    Send,
    X,
    Search,
    Filter,
    
    Activity,
    ShieldCheck,
    GitBranch,
    Bug,
    Layers,
    PlayCircle,
    CircleDot,
} from "lucide-react";

// ============================================================
// SAMPLE DATA
// Replace later with API data from the .NET backend.
// ============================================================

const DEVELOPER_PROFILE = {
    id: 1,
    name: "Abebe Kebede",
    email: "abebe@example.com",
    role: "Developer",
    specialization: "Backend Development",
    project: "AI-PMS",
    status: "Available",
    avatar: "AK",
};

const DEVELOPER_TASKS = [
    {
        id: 1,
        title: "Implement Authentication API",
        description: "Develop login, registration, and authentication endpoints.",
        project: "AI-PMS",
        sprint: "Sprint 04",
        priority: "High",
        status: "In Progress",
        progress: 75,
        dueDate: "2026-08-28",
        type: "Backend",
    },
    {
        id: 2,
        title: "Database Integration",
        description: "Connect the authentication module with the database.",
        project: "AI-PMS",
        sprint: "Sprint 04",
        priority: "High",
        status: "Completed",
        progress: 100,
        dueDate: "2026-08-25",
        type: "Backend",
    },
    {
        id: 3,
        title: "Implement User Management API",
        description: "Create CRUD operations for system users.",
        project: "AI-PMS",
        sprint: "Sprint 04",
        priority: "High",
        status: "In Progress",
        progress: 60,
        dueDate: "2026-08-29",
        type: "Backend",
    },
    {
        id: 4,
        title: "Fix Refresh Token Validation",
        description: "Resolve refresh token validation and expiration issues.",
        project: "AI-PMS",
        sprint: "Sprint 04",
        priority: "Medium",
        status: "Review",
        progress: 90,
        dueDate: "2026-08-27",
        type: "Security",
    },
    {
        id: 5,
        title: "Write API Unit Tests",
        description: "Create unit tests for authentication and user services.",
        project: "AI-PMS",
        sprint: "Sprint 04",
        priority: "Medium",
        status: "Not Started",
        progress: 0,
        dueDate: "2026-08-30",
        type: "Testing",
    },
    {
        id: 6,
        title: "Resolve API Error Handling",
        description: "Improve exception handling and API response consistency.",
        project: "AI-PMS",
        sprint: "Sprint 04",
        priority: "Low",
        status: "Blocked",
        progress: 35,
        dueDate: "2026-08-31",
        type: "Backend",
    },
];

const RECENT_ACTIVITIES = [
    {
        id: 1,
        title: "Completed Database Integration",
        description: "Database connection and integration completed.",
        time: "2 hours ago",
        type: "success",
    },
    {
        id: 2,
        title: "Authentication API updated",
        description: "Authentication endpoints were updated.",
        time: "5 hours ago",
        type: "info",
    },
    {
        id: 3,
        title: "Refresh Token moved to Review",
        description: "Refresh token validation is ready for review.",
        time: "Yesterday",
        type: "review",
    },
    {
        id: 4,
        title: "API Error Handling blocked",
        description: "Waiting for required backend information.",
        time: "Yesterday",
        type: "warning",
    },
];

// ============================================================
// SMALL COMPONENTS
// ============================================================

function StatCard({
    title,
    value,
    description,
    icon: Icon,
    iconClass = "bg-blue-100 text-blue-600",
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-blue-900/60 dark:bg-[#0b2038]">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        {title}
                    </p>

                    <h3 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                        {value}
                    </h3>

                    {description && (
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            {description}
                        </p>
                    )}
                </div>

                <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
                >
                    <Icon className="h-5 w-5" />
                </div>
            </div>
        </div>
    );
}

function ProgressBar({ progress }) {
    return (
        <div className="mt-2">
            <div className="mb-1 flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                    Progress
                </span>

                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    {progress}%
                </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-blue-950">
                <div
                    className="h-full rounded-full bg-blue-600 transition-all"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}

function StatusBadge({ status }) {
    const styles = {
        Available:
            "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",

        Busy:
            "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",

        "In Progress":
            "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",

        Completed:
            "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",

        Blocked:
            "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400",

        Review:
            "bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400",

        "Not Started":
            "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
    };

    return (
        <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                styles[status] ||
                "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            }`}
        >
            {status}
        </span>
    );
}

function PriorityBadge({ priority }) {
    const styles = {
        High: "text-red-600 dark:text-red-400",
        Medium: "text-amber-600 dark:text-amber-400",
        Low: "text-emerald-600 dark:text-emerald-400",
    };

    return (
        <span
            className={`text-xs font-semibold ${
                styles[priority] || "text-slate-500"
            }`}
        >
            {priority}
        </span>
    );
}

// ============================================================
// TASK DETAILS MODAL
// ============================================================

function TaskDetailsModal({ task, onClose }) {
    if (!task) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-blue-900/60 dark:bg-[#0b2038]">
                {/* Header */}

                <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-blue-900/60">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                            Task Details
                        </h2>

                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Developer task information
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 dark:hover:bg-blue-950/50"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}

                <div className="space-y-5 p-5">
                    <div>
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                    {task.title}
                                </h3>

                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    {task.description}
                                </p>
                            </div>

                            <StatusBadge status={task.status} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl bg-slate-50 p-3 dark:bg-blue-950/30">
                            <p className="text-xs text-slate-500">
                                Project
                            </p>

                            <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                                {task.project}
                            </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-3 dark:bg-blue-950/30">
                            <p className="text-xs text-slate-500">
                                Sprint
                            </p>

                            <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                                {task.sprint}
                            </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-3 dark:bg-blue-950/30">
                            <p className="text-xs text-slate-500">
                                Task Type
                            </p>

                            <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                                {task.type}
                            </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-3 dark:bg-blue-950/30">
                            <p className="text-xs text-slate-500">
                                Priority
                            </p>

                            <div className="mt-1">
                                <PriorityBadge priority={task.priority} />
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                Task Progress
                            </span>

                            <span className="text-sm font-bold text-blue-600">
                                {task.progress}%
                            </span>
                        </div>

                        <ProgressBar progress={task.progress} />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl border border-slate-200 p-4 dark:border-blue-900/60">
                            <p className="text-xs text-slate-500">
                                Due Date
                            </p>

                            <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                                {task.dueDate}
                            </p>
                        </div>

                        <div className="rounded-xl border border-slate-200 p-4 dark:border-blue-900/60">
                            <p className="text-xs text-slate-500">
                                Status
                            </p>

                            <div className="mt-1">
                                <StatusBadge status={task.status} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================================
// COMMUNICATION MODAL
// ============================================================

function CommunicationModal({ onClose }) {
    const [message, setMessage] = useState("");
    const [sent, setSent] = useState(false);

    const handleSend = () => {
        if (!message.trim()) {
            return;
        }

        setSent(true);

        setTimeout(() => {
            onClose();
        }, 1000);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl dark:bg-[#0b2038]">
                <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-blue-900/60">
                    <div>
                        <h2 className="font-bold text-slate-900 dark:text-white">
                            Contact Team Leader / Manager
                        </h2>

                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Send progress updates, blockers, or technical
                            issues.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-blue-950/50"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-5">
                    {sent ? (
                        <div className="py-8 text-center">
                            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />

                            <h3 className="mt-3 font-bold text-slate-900 dark:text-white">
                                Message Sent
                            </h3>

                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Your message has been sent successfully.
                            </p>
                        </div>
                    ) : (
                        <>
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                Message
                            </label>

                            <textarea
                                value={message}
                                onChange={(event) =>
                                    setMessage(event.target.value)
                                }
                                rows={6}
                                placeholder="Write your progress, technical issue, blocker, dependency, or important update..."
                                className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-blue-900/60 dark:bg-[#071a2d] dark:text-white"
                            />

                            <button
                                type="button"
                                disabled={!message.trim()}
                                onClick={handleSend}
                                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Send className="h-4 w-4" />
                                Send Message
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

// ============================================================
// MAIN DEVELOPER DASHBOARD
// ============================================================

function DeveloperDashboard() {
    const [selectedTask, setSelectedTask] = useState(null);
    const [communicationOpen, setCommunicationOpen] = useState(false);

    const [statusFilter, setStatusFilter] = useState("All");
    const [priorityFilter, setPriorityFilter] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");

    // ========================================================
    // STATISTICS
    // ========================================================

    const statistics = useMemo(() => {
        const totalTasks = DEVELOPER_TASKS.length;

        const completedTasks = DEVELOPER_TASKS.filter(
            (task) => task.status === "Completed"
        ).length;

        const inProgressTasks = DEVELOPER_TASKS.filter(
            (task) => task.status === "In Progress"
        ).length;

        const blockedTasks = DEVELOPER_TASKS.filter(
            (task) => task.status === "Blocked"
        ).length;

        const reviewTasks = DEVELOPER_TASKS.filter(
            (task) => task.status === "Review"
        ).length;

        const notStartedTasks = DEVELOPER_TASKS.filter(
            (task) => task.status === "Not Started"
        ).length;

        const overdueTasks = 1;

        const averageProgress =
            totalTasks > 0
                ? Math.round(
                      DEVELOPER_TASKS.reduce(
                          (total, task) => total + task.progress,
                          0
                      ) / totalTasks
                  )
                : 0;

        const completionRate =
            totalTasks > 0
                ? Math.round((completedTasks / totalTasks) * 100)
                : 0;

        return {
            totalTasks,
            completedTasks,
            inProgressTasks,
            blockedTasks,
            reviewTasks,
            notStartedTasks,
            overdueTasks,
            averageProgress,
            completionRate,
        };
    }, []);

    // ========================================================
    // FILTER TASKS
    // ========================================================

    const filteredTasks = useMemo(() => {
        return DEVELOPER_TASKS.filter((task) => {
            const search = searchTerm.toLowerCase();

            const matchesSearch =
                task.title.toLowerCase().includes(search) ||
                task.description.toLowerCase().includes(search) ||
                task.project.toLowerCase().includes(search) ||
                task.type.toLowerCase().includes(search);

            const matchesStatus =
                statusFilter === "All" ||
                task.status === statusFilter;

            const matchesPriority =
                priorityFilter === "All" ||
                task.priority === priorityFilter;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesPriority
            );
        });
    }, [searchTerm, statusFilter, priorityFilter]);

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 dark:bg-[#071a2d]">
            <div className="mx-auto max-w-7xl space-y-6">

                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                    <div>
                        <div className="flex items-center gap-2">
                            <Code2 className="h-5 w-5 text-blue-600" />

                            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                                Contributor • Developer
                            </span>
                        </div>

                        <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
                            Developer Dashboard
                        </h1>

                        <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                            Manage your assigned development tasks, monitor
                            progress, track technical issues, and communicate
                            important updates to your Team Leader or Manager.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setCommunicationOpen(true)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                    >
                        <MessageSquare className="h-4 w-4" />
                        Contact Team Leader
                    </button>
                </div>

                {/* ==================================================
                    AUTHORITY NOTICE
                ================================================== */}

                <div className="flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/60 dark:bg-blue-950/30">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

                    <div>
                        <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                            Developer Access
                        </p>

                        <p className="mt-1 text-xs leading-5 text-blue-800 dark:text-blue-400">
                            You can manage and update your assigned development
                            work, monitor task progress, report technical
                            blockers, and communicate with authorized team
                            leaders or managers. Project creation, team
                            assignment, role changes, and final project
                            approval remain restricted to authorized users.
                        </p>
                    </div>
                </div>

                {/* ==================================================
                    DEVELOPER PROFILE
                ================================================== */}

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-blue-900/60 dark:bg-[#0b2038]">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 font-bold text-white shadow-lg shadow-blue-600/20">
                                {DEVELOPER_PROFILE.avatar}
                            </div>

                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                        {DEVELOPER_PROFILE.name}
                                    </h2>

                                    <StatusBadge
                                        status={DEVELOPER_PROFILE.status}
                                    />
                                </div>

                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    {DEVELOPER_PROFILE.email}
                                </p>

                                <div className="mt-2 flex flex-wrap gap-2">
                                    <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-400">
                                        {DEVELOPER_PROFILE.role}
                                    </span>

                                    <span className="rounded-lg bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700 dark:bg-purple-950/40 dark:text-purple-400">
                                        {DEVELOPER_PROFILE.specialization}
                                    </span>

                                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-blue-950/40 dark:text-slate-300">
                                        {DEVELOPER_PROFILE.project}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:w-72">
                            <div className="rounded-xl bg-slate-50 p-3 dark:bg-blue-950/30">
                                <p className="text-xs text-slate-500">
                                    Current Sprint
                                </p>

                                <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                                    Sprint 04
                                </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-3 dark:bg-blue-950/30">
                                <p className="text-xs text-slate-500">
                                    Workload
                                </p>

                                <p className="mt-1 text-sm font-bold text-blue-600">
                                    {statistics.inProgressTasks} Active
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ==================================================
                    STATISTICS
                ================================================== */}

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Assigned Tasks"
                        value={statistics.totalTasks}
                        description="Your current workload"
                        icon={ClipboardList}
                        iconClass="bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                    />

                    <StatCard
                        title="In Progress"
                        value={statistics.inProgressTasks}
                        description="Currently being developed"
                        icon={PlayCircle}
                        iconClass="bg-purple-100 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400"
                    />

                    <StatCard
                        title="Completed"
                        value={statistics.completedTasks}
                        description="Tasks completed"
                        icon={CheckCircle2}
                        iconClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                    />

                    <StatCard
                        title="Blocked"
                        value={statistics.blockedTasks}
                        description="Need attention"
                        icon={AlertTriangle}
                        iconClass="bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400"
                    />
                </div>

                {/* ==================================================
                    PROGRESS + SPRINT
                ================================================== */}

                <div className="grid gap-6 lg:grid-cols-3">

                    {/* Development Progress */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2 dark:border-blue-900/60 dark:bg-[#0b2038]">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="font-bold text-slate-900 dark:text-white">
                                    Development Progress
                                </h2>

                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    Current progress across your assigned
                                    development work
                                </p>
                            </div>

                            <div className="rounded-xl bg-blue-50 p-3 dark:bg-blue-950/30">
                                <TrendingUp className="h-5 w-5 text-blue-600" />
                            </div>
                        </div>

                        <div className="mt-6 flex items-end gap-3">
                            <span className="text-4xl font-bold text-slate-900 dark:text-white">
                                {statistics.averageProgress}%
                            </span>

                            <span className="mb-1 text-sm text-slate-500 dark:text-slate-400">
                                overall development progress
                            </span>
                        </div>

                        <ProgressBar
                            progress={statistics.averageProgress}
                        />

                        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                            <div className="rounded-xl bg-slate-50 p-3 dark:bg-blue-950/30">
                                <p className="text-xs text-slate-500">
                                    Completed
                                </p>

                                <p className="mt-1 text-lg font-bold text-emerald-600">
                                    {statistics.completedTasks}
                                </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-3 dark:bg-blue-950/30">
                                <p className="text-xs text-slate-500">
                                    In Progress
                                </p>

                                <p className="mt-1 text-lg font-bold text-blue-600">
                                    {statistics.inProgressTasks}
                                </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-3 dark:bg-blue-950/30">
                                <p className="text-xs text-slate-500">
                                    Review
                                </p>

                                <p className="mt-1 text-lg font-bold text-purple-600">
                                    {statistics.reviewTasks}
                                </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-3 dark:bg-blue-950/30">
                                <p className="text-xs text-slate-500">
                                    Blocked
                                </p>

                                <p className="mt-1 text-lg font-bold text-red-600">
                                    {statistics.blockedTasks}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Active Sprint */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-blue-900/60 dark:bg-[#0b2038]">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="font-bold text-slate-900 dark:text-white">
                                    Active Sprint
                                </h2>

                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    Current development sprint
                                </p>
                            </div>

                            <Target className="h-5 w-5 text-blue-600" />
                        </div>

                        <div className="mt-5">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                Sprint 04
                            </h3>

                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                AI-PMS Development Sprint
                            </p>
                        </div>

                        <div className="mt-5 space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">
                                    Status
                                </span>

                                <StatusBadge status="In Progress" />
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">
                                    Start Date
                                </span>

                                <span className="font-medium text-slate-900 dark:text-white">
                                    Aug 18, 2026
                                </span>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">
                                    End Date
                                </span>

                                <span className="font-medium text-slate-900 dark:text-white">
                                    Aug 30, 2026
                                </span>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">
                                    Remaining
                                </span>

                                <span className="font-semibold text-amber-600">
                                    5 days
                                </span>
                            </div>
                        </div>

                        <div className="mt-5 rounded-xl bg-amber-50 p-3 dark:bg-amber-950/20">
                            <div className="flex gap-2">
                                <Clock3 className="h-4 w-4 text-amber-600" />

                                <p className="text-xs leading-5 text-amber-700 dark:text-amber-400">
                                    Prioritize approaching deadlines and
                                    report blockers as early as possible.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ==================================================
                    MY DEVELOPMENT TASKS
                ================================================== */}

                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-blue-900/60 dark:bg-[#0b2038]">
                    <div className="border-b border-slate-200 p-5 dark:border-blue-900/60">
                        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                            <div>
                                <div className="flex items-center gap-2">
                                    <Code2 className="h-5 w-5 text-blue-600" />

                                    <h2 className="font-bold text-slate-900 dark:text-white">
                                        My Development Tasks
                                    </h2>
                                </div>

                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    View and monitor your assigned development
                                    tasks.
                                </p>
                            </div>

                            <div className="flex flex-col gap-2 sm:flex-row">

                                {/* Search */}

                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(event) =>
                                            setSearchTerm(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Search tasks..."
                                        className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 sm:w-56 dark:border-blue-900/60 dark:bg-[#071a2d] dark:text-white"
                                    />
                                </div>

                                {/* Status */}

                                <select
                                    value={statusFilter}
                                    onChange={(event) =>
                                        setStatusFilter(
                                            event.target.value
                                        )
                                    }
                                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-blue-900/60 dark:bg-[#071a2d] dark:text-white"
                                >
                                    <option value="All">
                                        All Status
                                    </option>

                                    <option value="Not Started">
                                        Not Started
                                    </option>

                                    <option value="In Progress">
                                        In Progress
                                    </option>

                                    <option value="Review">
                                        Review
                                    </option>

                                    <option value="Completed">
                                        Completed
                                    </option>

                                    <option value="Blocked">
                                        Blocked
                                    </option>
                                </select>

                                {/* Priority */}

                                <select
                                    value={priorityFilter}
                                    onChange={(event) =>
                                        setPriorityFilter(
                                            event.target.value
                                        )
                                    }
                                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-blue-900/60 dark:bg-[#071a2d] dark:text-white"
                                >
                                    <option value="All">
                                        All Priority
                                    </option>

                                    <option value="High">
                                        High
                                    </option>

                                    <option value="Medium">
                                        Medium
                                    </option>

                                    <option value="Low">
                                        Low
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1100px]">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50 text-left dark:border-blue-900/60 dark:bg-blue-950/20">
                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Task
                                    </th>

                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Type
                                    </th>

                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Sprint
                                    </th>

                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Priority
                                    </th>

                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Status
                                    </th>

                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Progress
                                    </th>

                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Due Date
                                    </th>

                                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredTasks.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="px-5 py-12 text-center"
                                        >
                                            <Filter className="mx-auto h-8 w-8 text-slate-300" />

                                            <p className="mt-3 text-sm font-medium text-slate-500">
                                                No tasks match your filters.
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredTasks.map((task) => (
                                        <tr
                                            key={task.id}
                                            className="border-b border-slate-100 last:border-0 dark:border-blue-900/40"
                                        >
                                            <td className="px-5 py-4">
                                                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                                    {task.title}
                                                </p>

                                                <p className="mt-1 max-w-xs truncate text-xs text-slate-500">
                                                    {task.description}
                                                </p>
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2">
                                                    {task.type === "Backend" ? (
                                                        <Code2 className="h-4 w-4 text-blue-600" />
                                                    ) : task.type ===
                                                      "Testing" ? (
                                                        <Bug className="h-4 w-4 text-purple-600" />
                                                    ) : (
                                                        <Layers className="h-4 w-4 text-slate-500" />
                                                    )}

                                                    <span className="text-sm text-slate-600 dark:text-slate-300">
                                                        {task.type}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300">
                                                {task.sprint}
                                            </td>

                                            <td className="px-5 py-4">
                                                <PriorityBadge
                                                    priority={task.priority}
                                                />
                                            </td>

                                            <td className="px-5 py-4">
                                                <StatusBadge
                                                    status={task.status}
                                                />
                                            </td>

                                            <td className="w-40 px-5 py-4">
                                                <ProgressBar
                                                    progress={
                                                        task.progress
                                                    }
                                                />
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                                    <CalendarDays className="h-4 w-4 text-slate-400" />

                                                    {task.dueDate}
                                                </div>
                                            </td>

                                            <td className="px-5 py-4 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedTask(
                                                            task
                                                        )
                                                    }
                                                    className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                                                >
                                                    <Eye className="h-4 w-4" />

                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ==================================================
                    DEVELOPMENT METRICS + TECHNICAL STATUS
                ================================================== */}

                <div className="grid gap-6 lg:grid-cols-2">

                    {/* Development Metrics */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-blue-900/60 dark:bg-[#0b2038]">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                                <Activity className="h-5 w-5" />
                            </div>

                            <div>
                                <h2 className="font-bold text-slate-900 dark:text-white">
                                    Development Metrics
                                </h2>

                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Current development performance
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 space-y-5">

                            {/* Completion Rate */}

                            <div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">
                                        Completion Rate
                                    </span>

                                    <span className="font-bold text-slate-900 dark:text-white">
                                        {statistics.completionRate}%
                                    </span>
                                </div>

                                <ProgressBar
                                    progress={
                                        statistics.completionRate
                                    }
                                />
                            </div>

                            {/* Development Progress */}

                            <div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">
                                        Development Progress
                                    </span>

                                    <span className="font-bold text-slate-900 dark:text-white">
                                        {statistics.averageProgress}%
                                    </span>
                                </div>

                                <ProgressBar
                                    progress={
                                        statistics.averageProgress
                                    }
                                />
                            </div>

                            {/* Metrics */}

                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-xl border border-slate-200 p-4 dark:border-blue-900/60">
                                    <p className="text-xs text-slate-500">
                                        Awaiting Review
                                    </p>

                                    <p className="mt-1 text-2xl font-bold text-purple-600">
                                        {statistics.reviewTasks}
                                    </p>
                                </div>

                                <div className="rounded-xl border border-slate-200 p-4 dark:border-blue-900/60">
                                    <p className="text-xs text-slate-500">
                                        Overdue
                                    </p>

                                    <p className="mt-1 text-2xl font-bold text-red-600">
                                        {statistics.overdueTasks}
                                    </p>
                                </div>

                                <div className="rounded-xl border border-slate-200 p-4 dark:border-blue-900/60">
                                    <p className="text-xs text-slate-500">
                                        Not Started
                                    </p>

                                    <p className="mt-1 text-2xl font-bold text-slate-600 dark:text-slate-300">
                                        {statistics.notStartedTasks}
                                    </p>
                                </div>

                                <div className="rounded-xl border border-slate-200 p-4 dark:border-blue-900/60">
                                    <p className="text-xs text-slate-500">
                                        Active Tasks
                                    </p>

                                    <p className="mt-1 text-2xl font-bold text-blue-600">
                                        {statistics.inProgressTasks}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Technical Status */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-blue-900/60 dark:bg-[#0b2038]">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                                <GitBranch className="h-5 w-5" />
                            </div>

                            <div>
                                <h2 className="font-bold text-slate-900 dark:text-white">
                                    Technical Status
                                </h2>

                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Development environment and work status
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 space-y-3">

                            {/* Current Branch */}

                            <div className="rounded-xl border border-slate-200 p-4 dark:border-blue-900/60">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <GitBranch className="h-4 w-4 text-blue-600" />

                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                            Current Branch
                                        </span>
                                    </div>

                                    <span className="rounded-lg bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-400">
                                        feature/auth-api
                                    </span>
                                </div>
                            </div>

                            {/* Code Status */}

                            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                                <div className="flex gap-3">
                                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />

                                    <div>
                                        <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                                            Code Integration Healthy
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-emerald-600 dark:text-emerald-400">
                                            Latest development changes are
                                            ready for review.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Review */}

                            <div className="rounded-xl border border-purple-200 bg-purple-50 p-4 dark:border-purple-900/40 dark:bg-purple-950/20">
                                <div className="flex gap-3">
                                    <CircleDot className="h-5 w-5 shrink-0 text-purple-600" />

                                    <div>
                                        <p className="text-sm font-semibold text-purple-700 dark:text-purple-400">
                                            Review Required
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-purple-600 dark:text-purple-400">
                                            Refresh token validation is
                                            waiting for review.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Bug */}

                            <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/40 dark:bg-red-950/20">
                                <div className="flex gap-3">
                                    <Bug className="h-5 w-5 shrink-0 text-red-600" />

                                    <div>
                                        <p className="text-sm font-semibold text-red-700 dark:text-red-400">
                                            Technical Blocker
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-red-600 dark:text-red-400">
                                            API error handling is blocked by
                                            a missing dependency.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setCommunicationOpen(true)
                                }
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                            >
                                <Send className="h-4 w-4" />

                                Report Technical Update
                            </button>
                        </div>
                    </div>
                </div>

                {/* ==================================================
                    RECENT ACTIVITY
                ================================================== */}

                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-blue-900/60 dark:bg-[#0b2038]">
                    <div className="border-b border-slate-200 p-5 dark:border-blue-900/60">
                        <div className="flex items-center gap-2">
                            <Activity className="h-5 w-5 text-blue-600" />

                            <h2 className="font-bold text-slate-900 dark:text-white">
                                Recent Development Activity
                            </h2>
                        </div>

                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Recent updates related to your development work.
                        </p>
                    </div>

                    <div className="divide-y divide-slate-100 dark:divide-blue-900/40">
                        {RECENT_ACTIVITIES.map((activity) => {
                            const activityStyles = {
                                success: {
                                    icon: CheckCircle2,
                                    wrapper:
                                        "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
                                },

                                info: {
                                    icon: Code2,
                                    wrapper:
                                        "bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
                                },

                                review: {
                                    icon: CircleDot,
                                    wrapper:
                                        "bg-purple-100 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400",
                                },

                                warning: {
                                    icon: AlertTriangle,
                                    wrapper:
                                        "bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
                                },
                            };

                            const config =
                                activityStyles[activity.type] ||
                                activityStyles.info;

                            const ActivityIcon = config.icon;

                            return (
                                <div
                                    key={activity.id}
                                    className="flex items-start gap-4 p-5"
                                >
                                    <div
                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.wrapper}`}
                                    >
                                        <ActivityIcon className="h-5 w-5" />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-col justify-between gap-1 sm:flex-row">
                                            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                                {activity.title}
                                            </p>

                                            <span className="text-xs text-slate-400">
                                                {activity.time}
                                            </span>
                                        </div>

                                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                            {activity.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ==================================================
                    QUICK ACTIONS
                ================================================== */}

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-blue-900/60 dark:bg-[#0b2038]">
                    <div className="mb-5">
                        <h2 className="font-bold text-slate-900 dark:text-white">
                            Developer Actions
                        </h2>

                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Actions available within your Developer authority.
                        </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

                        {/* My Tasks */}

                        <button
                            type="button"
                            className="group rounded-xl border border-slate-200 p-4 text-left transition hover:border-blue-300 hover:bg-blue-50 dark:border-blue-900/60 dark:hover:bg-blue-950/30"
                        >
                            <ClipboardList className="h-5 w-5 text-blue-600" />

                            <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
                                My Tasks
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                View and monitor assigned tasks.
                            </p>
                        </button>

                        {/* Development Work */}

                        <button
                            type="button"
                            className="group rounded-xl border border-slate-200 p-4 text-left transition hover:border-blue-300 hover:bg-blue-50 dark:border-blue-900/60 dark:hover:bg-blue-950/30"
                        >
                            <Code2 className="h-5 w-5 text-purple-600" />

                            <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
                                Development Work
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                Review your current development workload.
                            </p>
                        </button>

                        {/* Contact Team Leader */}

                        <button
                            type="button"
                            onClick={() =>
                                setCommunicationOpen(true)
                            }
                            className="group rounded-xl border border-slate-200 p-4 text-left transition hover:border-blue-300 hover:bg-blue-50 dark:border-blue-900/60 dark:hover:bg-blue-950/30"
                        >
                            <MessageSquare className="h-5 w-5 text-emerald-600" />

                            <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
                                Contact Team Leader
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                Report progress, blockers, or issues.
                            </p>
                        </button>

                        {/* Technical Status */}

                        <button
                            type="button"
                            className="group rounded-xl border border-slate-200 p-4 text-left transition hover:border-blue-300 hover:bg-blue-50 dark:border-blue-900/60 dark:hover:bg-blue-950/30"
                        >
                            <GitBranch className="h-5 w-5 text-orange-600" />

                            <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
                                Technical Status
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                Review development and technical status.
                            </p>
                        </button>
                    </div>
                </div>

                {/* ==================================================
                    FOOTER AUTHORITY
                ================================================== */}

                <div className="flex items-center justify-center gap-2 pb-4 text-xs text-slate-400">
                    <ShieldCheck className="h-4 w-4" />

                    Developer manages assigned development work.
                    Team Leader and Manager retain higher-level authority.
                </div>
            </div>

            {/* ======================================================
                MODALS
            ====================================================== */}

            <TaskDetailsModal
                task={selectedTask}
                onClose={() => setSelectedTask(null)}
            />

            {communicationOpen && (
                <CommunicationModal
                    onClose={() => setCommunicationOpen(false)}
                />
            )}
        </div>
    );
}

export default DeveloperDashboard;