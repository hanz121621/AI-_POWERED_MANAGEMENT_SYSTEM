import { useMemo, useState } from "react";

import {
    UsersRound,
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
    ChevronRight,
    Activity,
    ShieldCheck,
} from "lucide-react";

// ============================================================
// SAMPLE DATA
// Replace this later with API data from the .NET backend.
// ============================================================

const TEAM_MEMBERS = [
    {
        id: 1,
        name: "Abebe Kebede",
        email: "abebe@example.com",
        type: "Developer",
        specialization: "Backend Development",
        project: "AI-PMS",
        tasks: 6,
        completed: 4,
        status: "Available",
        avatar: "AK",
    },
    {
        id: 2,
        name: "Sara Mohammed",
        email: "sara@example.com",
        type: "Staff",
        specialization: "Documentation",
        project: "AI-PMS",
        tasks: 5,
        completed: 3,
        status: "Available",
        avatar: "SM",
    },
    {
        id: 3,
        name: "Daniel Tesfaye",
        email: "daniel@example.com",
        type: "Developer",
        specialization: "Frontend Development",
        project: "AI-PMS",
        tasks: 7,
        completed: 5,
        status: "Busy",
        avatar: "DT",
    },
    {
        id: 4,
        name: "Marta Bekele",
        email: "marta@example.com",
        type: "Staff",
        specialization: "Requirements Analysis",
        project: "AI-PMS",
        tasks: 4,
        completed: 2,
        status: "Available",
        avatar: "MB",
    },
];

const TEAM_TASKS = [
    {
        id: 1,
        title: "Implement Authentication API",
        contributor: "Abebe Kebede",
        type: "Developer",
        specialization: "Backend Development",
        project: "AI-PMS",
        sprint: "Sprint 04",
        priority: "High",
        status: "In Progress",
        progress: 75,
        dueDate: "2026-08-28",
    },
    {
        id: 2,
        title: "Prepare User Documentation",
        contributor: "Sara Mohammed",
        type: "Staff",
        specialization: "Documentation",
        project: "AI-PMS",
        sprint: "Sprint 04",
        priority: "Medium",
        status: "In Progress",
        progress: 60,
        dueDate: "2026-08-29",
    },
    {
        id: 3,
        title: "Create Dashboard Components",
        contributor: "Daniel Tesfaye",
        type: "Developer",
        specialization: "Frontend Development",
        project: "AI-PMS",
        sprint: "Sprint 04",
        priority: "High",
        status: "In Progress",
        progress: 85,
        dueDate: "2026-08-27",
    },
    {
        id: 4,
        title: "Collect Project Requirements",
        contributor: "Marta Bekele",
        type: "Staff",
        specialization: "Requirements Analysis",
        project: "AI-PMS",
        sprint: "Sprint 04",
        priority: "Medium",
        status: "Blocked",
        progress: 40,
        dueDate: "2026-08-30",
    },
    {
        id: 5,
        title: "Database Integration",
        contributor: "Abebe Kebede",
        type: "Developer",
        specialization: "Backend Development",
        project: "AI-PMS",
        sprint: "Sprint 04",
        priority: "High",
        status: "Completed",
        progress: 100,
        dueDate: "2026-08-25",
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
// TEAM MEMBER MODAL
// ============================================================

function MemberDetailsModal({ member, onClose }) {
    if (!member) {
        return null;
    }

    const progress =
        member.tasks > 0
            ? Math.round((member.completed / member.tasks) * 100)
            : 0;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-blue-900/60 dark:bg-[#0b2038]">
                <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-blue-900/60">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                            Team Member Details
                        </h2>

                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Authorized team information
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

                <div className="space-y-5 p-5">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                            {member.avatar}
                        </div>

                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white">
                                {member.name}
                            </h3>

                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                {member.email}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl bg-slate-50 p-3 dark:bg-blue-950/30">
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Contributor Type
                            </p>
                            <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                                {member.type}
                            </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-3 dark:bg-blue-950/30">
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Specialization
                            </p>
                            <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                                {member.specialization}
                            </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-3 dark:bg-blue-950/30">
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Project
                            </p>
                            <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                                {member.project}
                            </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-3 dark:bg-blue-950/30">
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Availability
                            </p>
                            <div className="mt-1">
                                <StatusBadge status={member.status} />
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                Task Completion
                            </span>

                            <span className="text-sm font-bold text-blue-600">
                                {progress}%
                            </span>
                        </div>

                        <ProgressBar progress={progress} />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl border border-slate-200 p-4 dark:border-blue-900/60">
                            <p className="text-xs text-slate-500">
                                Assigned Tasks
                            </p>

                            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                                {member.tasks}
                            </p>
                        </div>

                        <div className="rounded-xl border border-slate-200 p-4 dark:border-blue-900/60">
                            <p className="text-xs text-slate-500">
                                Completed
                            </p>

                            <p className="mt-1 text-2xl font-bold text-emerald-600">
                                {member.completed}
                            </p>
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
                            Communicate with Manager
                        </h2>

                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Send team progress, blockers, delays, or risks.
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
                                The Manager has been notified.
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
                                placeholder="Write team progress, blockers, delays, dependencies, or important updates..."
                                className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-blue-900/60 dark:bg-[#071a2d] dark:text-white"
                            />

                            <button
                                type="button"
                                disabled={!message.trim()}
                                onClick={handleSend}
                                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Send className="h-4 w-4" />
                                Send to Manager
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

// ============================================================
// MAIN DASHBOARD
// ============================================================

function TeamLeaderDashboard() {
    const [selectedMember, setSelectedMember] = useState(null);
    const [communicationOpen, setCommunicationOpen] = useState(false);

    const [taskStatusFilter, setTaskStatusFilter] = useState("All");
    const [priorityFilter, setPriorityFilter] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");

    // ========================================================
    // TEAM STATISTICS
    // ========================================================

    const statistics = useMemo(() => {
        const totalTasks = TEAM_TASKS.length;

        const completedTasks = TEAM_TASKS.filter(
            (task) => task.status === "Completed"
        ).length;

        const inProgressTasks = TEAM_TASKS.filter(
            (task) => task.status === "In Progress"
        ).length;

        const blockedTasks = TEAM_TASKS.filter(
            (task) => task.status === "Blocked"
        ).length;

        const reviewTasks = TEAM_TASKS.filter(
            (task) => task.status === "Review"
        ).length;

        const overdueTasks = 1;

        const averageProgress =
            totalTasks > 0
                ? Math.round(
                      TEAM_TASKS.reduce(
                          (total, task) => total + task.progress,
                          0
                      ) / totalTasks
                  )
                : 0;

        return {
            totalTasks,
            completedTasks,
            inProgressTasks,
            blockedTasks,
            reviewTasks,
            overdueTasks,
            averageProgress,
        };
    }, []);

    // ========================================================
    // FILTER TASKS
    // ========================================================

    const filteredTasks = useMemo(() => {
        return TEAM_TASKS.filter((task) => {
            const matchesSearch =
                task.title
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                task.contributor
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());

            const matchesStatus =
                taskStatusFilter === "All" ||
                task.status === taskStatusFilter;

            const matchesPriority =
                priorityFilter === "All" ||
                task.priority === priorityFilter;

            return matchesSearch && matchesStatus && matchesPriority;
        });
    }, [searchTerm, taskStatusFilter, priorityFilter]);

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 dark:bg-[#071a2d]">
            <div className="mx-auto max-w-7xl space-y-6">

                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                    <div>
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-blue-600" />

                            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                                Contributor • Team Leader
                            </span>
                        </div>

                        <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
                            Team Leader Dashboard
                        </h1>

                        <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                            Monitor your assigned team, coordinate work,
                            identify blockers, and communicate important
                            updates to the Manager.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setCommunicationOpen(true)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                    >
                        <MessageSquare className="h-4 w-4" />
                        Communicate with Manager
                    </button>
                </div>

                {/* ==================================================
                    AUTHORITY NOTICE
                ================================================== */}

                <div className="flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/60 dark:bg-blue-950/30">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

                    <div>
                        <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                            Team Leader Authority
                        </p>

                        <p className="mt-1 text-xs leading-5 text-blue-800 dark:text-blue-400">
                            You can monitor and coordinate your assigned
                            team. Project creation, team assignment,
                            contributor-type changes, specialization changes,
                            final approval, and Manager-level decisions remain
                            restricted to authorized management users.
                        </p>
                    </div>
                </div>

                {/* ==================================================
                    STATISTICS
                ================================================== */}

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Team Members"
                        value={TEAM_MEMBERS.length}
                        description="Assigned to your team"
                        icon={UsersRound}
                        iconClass="bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                    />

                    <StatCard
                        title="Assigned Tasks"
                        value={statistics.totalTasks}
                        description="Current team workload"
                        icon={ClipboardList}
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

                    {/* Team Progress */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2 dark:border-blue-900/60 dark:bg-[#0b2038]">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="font-bold text-slate-900 dark:text-white">
                                    Team Progress
                                </h2>

                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    Current work progress across your team
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
                                overall team progress
                            </span>
                        </div>

                        <ProgressBar progress={statistics.averageProgress} />

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
                                    Blocked
                                </p>
                                <p className="mt-1 text-lg font-bold text-red-600">
                                    {statistics.blockedTasks}
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
                        </div>
                    </div>

                    {/* Sprint */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-blue-900/60 dark:bg-[#0b2038]">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="font-bold text-slate-900 dark:text-white">
                                    Active Sprint
                                </h2>

                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    Team sprint information
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
                                    Monitor blocked and approaching-deadline
                                    tasks and communicate risks to the
                                    Manager.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ==================================================
                    MY TEAM
                ================================================== */}

                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-blue-900/60 dark:bg-[#0b2038]">
                    <div className="flex flex-col justify-between gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center dark:border-blue-900/60">
                        <div>
                            <div className="flex items-center gap-2">
                                <UsersRound className="h-5 w-5 text-blue-600" />

                                <h2 className="font-bold text-slate-900 dark:text-white">
                                    My Team
                                </h2>
                            </div>

                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                View members, roles, workload, and current
                                availability.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-blue-900/60 dark:text-slate-200 dark:hover:bg-blue-950/30"
                        >
                            View Full Team
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[850px]">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50 text-left dark:border-blue-900/60 dark:bg-blue-950/20">
                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Member
                                    </th>

                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Type
                                    </th>

                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Specialization
                                    </th>

                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Tasks
                                    </th>

                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Status
                                    </th>

                                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {TEAM_MEMBERS.map((member) => (
                                    <tr
                                        key={member.id}
                                        className="border-b border-slate-100 last:border-0 dark:border-blue-900/40"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-950/50 dark:text-blue-400">
                                                    {member.avatar}
                                                </div>

                                                <div>
                                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                                        {member.name}
                                                    </p>

                                                    <p className="text-xs text-slate-500">
                                                        {member.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4 text-sm text-slate-700 dark:text-slate-300">
                                            {member.type}
                                        </td>

                                        <td className="px-5 py-4 text-sm text-slate-500 dark:text-slate-400">
                                            {member.specialization}
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                                {member.completed}/{member.tasks}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <StatusBadge
                                                status={member.status}
                                            />
                                        </td>

                                        <td className="px-5 py-4 text-right">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setSelectedMember(member)
                                                }
                                                className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                                            >
                                                <Eye className="h-4 w-4" />
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ==================================================
                    TEAM TASKS
                ================================================== */}

                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-blue-900/60 dark:bg-[#0b2038]">
                    <div className="border-b border-slate-200 p-5 dark:border-blue-900/60">
                        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                            <div>
                                <div className="flex items-center gap-2">
                                    <ClipboardList className="h-5 w-5 text-blue-600" />

                                    <h2 className="font-bold text-slate-900 dark:text-white">
                                        Team Tasks
                                    </h2>
                                </div>

                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    Monitor tasks assigned to your team
                                    members.
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
                                            setSearchTerm(event.target.value)
                                        }
                                        placeholder="Search tasks..."
                                        className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 sm:w-52 dark:border-blue-900/60 dark:bg-[#071a2d] dark:text-white"
                                    />
                                </div>

                                {/* Status */}

                                <select
                                    value={taskStatusFilter}
                                    onChange={(event) =>
                                        setTaskStatusFilter(event.target.value)
                                    }
                                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-blue-900/60 dark:bg-[#071a2d] dark:text-white"
                                >
                                    <option value="All">All Status</option>
                                    <option value="In Progress">
                                        In Progress
                                    </option>
                                    <option value="Completed">
                                        Completed
                                    </option>
                                    <option value="Blocked">Blocked</option>
                                    <option value="Review">Review</option>
                                </select>

                                {/* Priority */}

                                <select
                                    value={priorityFilter}
                                    onChange={(event) =>
                                        setPriorityFilter(event.target.value)
                                    }
                                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-blue-900/60 dark:bg-[#071a2d] dark:text-white"
                                >
                                    <option value="All">
                                        All Priority
                                    </option>
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1000px]">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50 text-left dark:border-blue-900/60 dark:bg-blue-950/20">
                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Task
                                    </th>

                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Contributor
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
                                </tr>
                            </thead>

                            <tbody>
                                {filteredTasks.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="px-5 py-12 text-center"
                                        >
                                            <Filter className="mx-auto h-8 w-8 text-slate-300" />

                                            <p className="mt-3 text-sm font-medium text-slate-500">
                                                No team tasks available.
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

                                                <p className="mt-1 text-xs text-slate-500">
                                                    {task.project}
                                                </p>
                                            </td>

                                            <td className="px-5 py-4">
                                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                                    {task.contributor}
                                                </p>

                                                <p className="text-xs text-slate-500">
                                                    {task.type}
                                                </p>
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
                                                    progress={task.progress}
                                                />
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                                    <CalendarDays className="h-4 w-4 text-slate-400" />

                                                    {task.dueDate}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ==================================================
                    PERFORMANCE + COORDINATION
                ================================================== */}

                <div className="grid gap-6 lg:grid-cols-2">

                    {/* Performance */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-blue-900/60 dark:bg-[#0b2038]">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                                <Activity className="h-5 w-5" />
                            </div>

                            <div>
                                <h2 className="font-bold text-slate-900 dark:text-white">
                                    Team Performance
                                </h2>

                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Current team performance indicators
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 space-y-5">
                            <div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">
                                        Completion Rate
                                    </span>

                                    <span className="font-bold text-slate-900 dark:text-white">
                                        71%
                                    </span>
                                </div>

                                <ProgressBar progress={71} />
                            </div>

                            <div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">
                                        Team Progress
                                    </span>

                                    <span className="font-bold text-slate-900 dark:text-white">
                                        {statistics.averageProgress}%
                                    </span>
                                </div>

                                <ProgressBar
                                    progress={statistics.averageProgress}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-xl border border-slate-200 p-4 dark:border-blue-900/60">
                                    <p className="text-xs text-slate-500">
                                        Overdue Tasks
                                    </p>

                                    <p className="mt-1 text-2xl font-bold text-red-600">
                                        {statistics.overdueTasks}
                                    </p>
                                </div>

                                <div className="rounded-xl border border-slate-200 p-4 dark:border-blue-900/60">
                                    <p className="text-xs text-slate-500">
                                        Awaiting Review
                                    </p>

                                    <p className="mt-1 text-2xl font-bold text-purple-600">
                                        {statistics.reviewTasks}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Coordination */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-blue-900/60 dark:bg-[#0b2038]">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                                <MessageSquare className="h-5 w-5" />
                            </div>

                            <div>
                                <h2 className="font-bold text-slate-900 dark:text-white">
                                    Coordination Center
                                </h2>

                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Team coordination and escalation
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 space-y-3">
                            <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/40 dark:bg-red-950/20">
                                <div className="flex gap-3">
                                    <AlertTriangle className="h-5 w-5 shrink-0 text-red-600" />

                                    <div>
                                        <p className="text-sm font-semibold text-red-700 dark:text-red-400">
                                            Blocker requires attention
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-red-600 dark:text-red-400">
                                            Marta's requirements task is
                                            blocked by missing project
                                            information.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
                                <div className="flex gap-3">
                                    <Clock3 className="h-5 w-5 shrink-0 text-amber-600" />

                                    <div>
                                        <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                                            Deadline approaching
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-amber-600 dark:text-amber-400">
                                            Dashboard components are due
                                            soon.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setCommunicationOpen(true)}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                            >
                                <Send className="h-4 w-4" />
                                Escalate Update to Manager
                            </button>
                        </div>
                    </div>
                </div>

                {/* ==================================================
                    QUICK ACTIONS
                ================================================== */}

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-blue-900/60 dark:bg-[#0b2038]">
                    <div className="mb-5">
                        <h2 className="font-bold text-slate-900 dark:text-white">
                            Team Leader Actions
                        </h2>

                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Actions available within your Team Leader
                            authority.
                        </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <button
                            type="button"
                            className="group rounded-xl border border-slate-200 p-4 text-left transition hover:border-blue-300 hover:bg-blue-50 dark:border-blue-900/60 dark:hover:bg-blue-950/30"
                        >
                            <UsersRound className="h-5 w-5 text-blue-600" />

                            <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
                                View My Team
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                Review team members and workload.
                            </p>
                        </button>

                        <button
                            type="button"
                            className="group rounded-xl border border-slate-200 p-4 text-left transition hover:border-blue-300 hover:bg-blue-50 dark:border-blue-900/60 dark:hover:bg-blue-950/30"
                        >
                            <ClipboardList className="h-5 w-5 text-purple-600" />

                            <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
                                Team Tasks
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                Monitor team task workload.
                            </p>
                        </button>

                        <button
                            type="button"
                            onClick={() => setCommunicationOpen(true)}
                            className="group rounded-xl border border-slate-200 p-4 text-left transition hover:border-blue-300 hover:bg-blue-50 dark:border-blue-900/60 dark:hover:bg-blue-950/30"
                        >
                            <MessageSquare className="h-5 w-5 text-emerald-600" />

                            <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
                                Contact Manager
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                Send progress or escalation updates.
                            </p>
                        </button>

                        <button
                            type="button"
                            className="group rounded-xl border border-slate-200 p-4 text-left transition hover:border-blue-300 hover:bg-blue-50 dark:border-blue-900/60 dark:hover:bg-blue-950/30"
                        >
                            <TrendingUp className="h-5 w-5 text-orange-600" />

                            <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
                                Team Performance
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                Review team performance indicators.
                            </p>
                        </button>
                    </div>
                </div>

                {/* ==================================================
                    FOOTER AUTHORITY
                ================================================== */}

                <div className="flex items-center justify-center gap-2 pb-4 text-xs text-slate-400">
                    <ShieldCheck className="h-4 w-4" />

                    Team Leader has team coordination authority.
                    Manager retains project-level authority.
                </div>
            </div>

            {/* ======================================================
                MODALS
            ====================================================== */}

            <MemberDetailsModal
                member={selectedMember}
                onClose={() => setSelectedMember(null)}
            />

            {communicationOpen && (
                <CommunicationModal
                    onClose={() => setCommunicationOpen(false)}
                />
            )}
        </div>
    );
}

export default TeamLeaderDashboard;