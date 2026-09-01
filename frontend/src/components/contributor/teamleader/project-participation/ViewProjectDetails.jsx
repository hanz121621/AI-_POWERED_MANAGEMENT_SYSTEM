import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    ClipboardList,
    Clock3,
    FileText,
    FolderKanban,
    MessageSquare,
    Target,
    UsersRound,
} from "lucide-react";

const DEFAULT_PROJECT = {
    id: 1,
    name: "AI-Powered Management System",
    description:
        "A project management platform that helps organizations manage projects, tasks, teams, sprints, reports, and AI-powered insights.",
    status: "In Progress",
    progress: 68,
    role: "Team Leader",
    manager: "Project Manager",
    currentSprint: "Sprint 4",
    startDate: "2026-08-01",
    endDate: "2026-10-15",
    members: [
        {
            id: 1,
            name: "Team Leader",
            role: "Team Leader",
            initials: "TL",
        },
        {
            id: 2,
            name: "Developer One",
            role: "Developer",
            initials: "DO",
        },
        {
            id: 3,
            name: "Developer Two",
            role: "Developer",
            initials: "DT",
        },
        {
            id: 4,
            name: "Staff Member",
            role: "Staff",
            initials: "SM",
        },
    ],
    objectives: [
        "Deliver the core project management workflow.",
        "Coordinate development activities across the project team.",
        "Monitor sprint progress and team workload.",
        "Provide reliable project reporting and communication.",
    ],
    tasks: {
        total: 32,
        completed: 18,
        inProgress: 9,
        blocked: 2,
        todo: 3,
    },
    activities: [
        {
            id: 1,
            title: "Task status updated",
            description: "Developer One moved a task to In Progress.",
            time: "2 hours ago",
        },
        {
            id: 2,
            title: "Sprint progress updated",
            description: "Sprint 4 reached 72% completion.",
            time: "5 hours ago",
        },
        {
            id: 3,
            title: "Team assignment updated",
            description: "A new task was assigned to the development team.",
            time: "Yesterday",
        },
    ],
};

function formatDate(date) {
    if (!date) return "Not set";

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function getStatusStyle(status) {
    if (status === "Completed") {
        return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    }

    if (status === "In Progress") {
        return "bg-blue-50 text-blue-700 ring-blue-200";
    }

    return "bg-amber-50 text-amber-700 ring-amber-200";
}

export default function ViewProjectDetails({
    project = DEFAULT_PROJECT,
    onBack,
}) {
    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Header */}
            <div className="border-b border-slate-200 bg-gradient-to-r from-indigo-50 via-white to-white px-6 py-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex items-start gap-4">
                        {onBack && (
                            <button
                                type="button"
                                onClick={onBack}
                                className="mt-1 rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600"
                                title="Back to projects"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </button>
                        )}

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100">
                            <FolderKanban className="h-6 w-6 text-indigo-600" />
                        </div>

                        <div>
                            <div className="flex flex-wrap items-center gap-3">
                                <h2 className="text-xl font-bold text-slate-900">
                                    {project.name}
                                </h2>

                                <span
                                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${getStatusStyle(
                                        project.status
                                    )}`}
                                >
                                    {project.status}
                                </span>
                            </div>

                            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                                {project.description}
                            </p>
                        </div>
                    </div>

                    <div className="rounded-xl border border-indigo-100 bg-white px-4 py-3 shadow-sm">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Your Role
                        </p>

                        <p className="mt-1 text-sm font-semibold text-indigo-700">
                            {project.role}
                        </p>
                    </div>
                </div>
            </div>

            {/* Project Overview */}
            <div className="grid gap-4 border-b border-slate-200 p-6 sm:grid-cols-2 xl:grid-cols-4">
                <InfoCard
                    icon={Target}
                    label="Project Progress"
                    value={`${project.progress}%`}
                />

                <InfoCard
                    icon={Clock3}
                    label="Current Sprint"
                    value={project.currentSprint}
                />

                <InfoCard
                    icon={UsersRound}
                    label="Team Members"
                    value={project.members.length}
                />

                <InfoCard
                    icon={CalendarDays}
                    label="Expected Completion"
                    value={formatDate(project.endDate)}
                />
            </div>

            {/* Content */}
            <div className="grid gap-6 p-6 xl:grid-cols-3">
                {/* Left / Main */}
                <div className="space-y-6 xl:col-span-2">
                    {/* Timeline */}
                    <div className="rounded-xl border border-slate-200 p-5">
                        <SectionTitle
                            icon={CalendarDays}
                            title="Project Timeline"
                        />

                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                            <TimelineCard
                                label="Start Date"
                                value={formatDate(project.startDate)}
                            />

                            <TimelineCard
                                label="Expected Completion"
                                value={formatDate(project.endDate)}
                            />
                        </div>
                    </div>

                    {/* Objectives */}
                    <div className="rounded-xl border border-slate-200 p-5">
                        <SectionTitle
                            icon={Target}
                            title="Project Objectives"
                        />

                        <div className="mt-4 space-y-3">
                            {project.objectives.map((objective, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-3 rounded-lg bg-slate-50 p-3"
                                >
                                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />

                                    <p className="text-sm leading-6 text-slate-600">
                                        {objective}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Task Summary */}
                    <div className="rounded-xl border border-slate-200 p-5">
                        <SectionTitle
                            icon={ClipboardList}
                            title="Team Task Summary"
                        />

                        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                            <TaskStat
                                label="Total"
                                value={project.tasks.total}
                            />

                            <TaskStat
                                label="Completed"
                                value={project.tasks.completed}
                                valueClass="text-emerald-600"
                            />

                            <TaskStat
                                label="In Progress"
                                value={project.tasks.inProgress}
                                valueClass="text-blue-600"
                            />

                            <TaskStat
                                label="Blocked"
                                value={project.tasks.blocked}
                                valueClass="text-red-600"
                            />

                            <TaskStat
                                label="To Do"
                                value={project.tasks.todo}
                                valueClass="text-slate-700"
                            />
                        </div>
                    </div>

                    {/* Authorized Activities */}
                    <div className="rounded-xl border border-slate-200 p-5">
                        <SectionTitle
                            icon={FolderKanban}
                            title="Authorized Project Activities"
                        />

                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <ActivityItem
                                icon={ClipboardList}
                                title="Team Tasks"
                                description="View and monitor team tasks."
                            />

                            <ActivityItem
                                icon={UsersRound}
                                title="Team Members"
                                description="View authorized team information."
                            />

                            <ActivityItem
                                icon={Clock3}
                                title="Sprint Board"
                                description="View sprint information and progress."
                            />

                            <ActivityItem
                                icon={MessageSquare}
                                title="Discussions"
                                description="Participate in project discussions."
                            />

                            <ActivityItem
                                icon={FileText}
                                title="Reports"
                                description="Access reports based on permission."
                            />

                            <ActivityItem
                                icon={FileText}
                                title="Project Resources"
                                description="View authorized documents and resources."
                            />
                        </div>
                    </div>
                </div>

                {/* Right */}
                <div className="space-y-6">
                    {/* Manager */}
                    <div className="rounded-xl border border-slate-200 p-5">
                        <SectionTitle
                            icon={UsersRound}
                            title="Project Manager"
                        />

                        <div className="mt-4 flex items-center gap-3 rounded-lg bg-slate-50 p-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                                PM
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-slate-800">
                                    {project.manager}
                                </p>

                                <p className="text-xs text-slate-500">
                                    Project Manager
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Team */}
                    <div className="rounded-xl border border-slate-200 p-5">
                        <SectionTitle
                            icon={UsersRound}
                            title="Project Team"
                        />

                        <div className="mt-4 space-y-3">
                            {project.members.map((member) => (
                                <div
                                    key={member.id}
                                    className="flex items-center gap-3"
                                >
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                                        {member.initials}
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium text-slate-800">
                                            {member.name}
                                        </p>

                                        <p className="text-xs text-slate-500">
                                            {member.role}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="rounded-xl border border-slate-200 p-5">
                        <SectionTitle
                            icon={MessageSquare}
                            title="Recent Activities"
                        />

                        <div className="mt-4 space-y-4">
                            {project.activities.map((activity) => (
                                <div
                                    key={activity.id}
                                    className="border-l-2 border-indigo-200 pl-3"
                                >
                                    <p className="text-sm font-medium text-slate-800">
                                        {activity.title}
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-slate-500">
                                        {activity.description}
                                    </p>

                                    <p className="mt-1 text-[11px] text-slate-400">
                                        {activity.time}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function InfoCard({ icon: Icon, label, value }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
                    <Icon className="h-5 w-5 text-indigo-600" />
                </div>

                <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-400">
                        {label}
                    </p>

                    <p className="mt-1 truncate text-sm font-semibold text-slate-900">
                        {value}
                    </p>
                </div>
            </div>
        </div>
    );
}

function SectionTitle({ icon: Icon, title }) {
    return (
        <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-indigo-600" />

            <h3 className="text-sm font-semibold text-slate-900">
                {title}
            </h3>
        </div>
    );
}

function TimelineCard({ label, value }) {
    return (
        <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-400">{label}</p>

            <p className="mt-1 text-sm font-semibold text-slate-800">
                {value}
            </p>
        </div>
    );
}

function TaskStat({ label, value, valueClass = "text-slate-900" }) {
    return (
        <div className="rounded-lg bg-slate-50 p-4 text-center">
            <p className="text-xs font-medium text-slate-400">{label}</p>

            <p className={`mt-1 text-xl font-bold ${valueClass}`}>
                {value}
            </p>
        </div>
    );
}

function ActivityItem({ icon: Icon, title, description }) {
    return (
        <div className="flex gap-3 rounded-lg border border-slate-100 bg-slate-50 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-100">
                <Icon className="h-4 w-4 text-indigo-600" />
            </div>

            <div>
                <p className="text-sm font-semibold text-slate-800">
                    {title}
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                    {description}
                </p>
            </div>
        </div>
    );
}