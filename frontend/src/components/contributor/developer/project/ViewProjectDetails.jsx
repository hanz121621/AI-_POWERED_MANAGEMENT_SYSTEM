import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    Clock3,
    FileText,
    FolderKanban,
    MessageSquare,
    UsersRound,
} from "lucide-react";

const DEFAULT_PROJECT = {
    id: 1,
    name: "AI-Powered Management System",
    description:
        "A web-based project management system that uses AI to support project planning, task management, monitoring, and decision making.",
    objectives: [
        "Improve project planning and monitoring.",
        "Provide centralized task and sprint management.",
        "Support communication between project team members.",
        "Provide AI-assisted project insights and recommendations.",
    ],
    status: "In Progress",
    progress: 68,
    startDate: "2026-08-01",
    expectedCompletionDate: "2026-10-15",
    currentSprint: {
        name: "Sprint 4",
        goal: "Complete contributor task management and communication features.",
        status: "Active",
        startDate: "2026-08-25",
        endDate: "2026-09-08",
        progress: 72,
    },
    manager: "Project Manager",
    teamLeader: "Team Leader",
    assignedRole: "Developer",
    teamMembers: [
        {
            id: 1,
            name: "Project Manager",
            role: "Manager",
        },
        {
            id: 2,
            name: "Team Leader",
            role: "Team Leader",
        },
        {
            id: 3,
            name: "Developer",
            role: "Developer",
        },
        {
            id: 4,
            name: "Developer 2",
            role: "Developer",
        },
    ],
    resources: [
        {
            id: 1,
            name: "Project Requirements",
            type: "Document",
        },
        {
            id: 2,
            name: "Technical Documentation",
            type: "Document",
        },
        {
            id: 3,
            name: "Development Guidelines",
            type: "Document",
        },
    ],
    activities: [
        {
            id: 1,
            title: "Sprint progress updated",
            description:
                "The current sprint progress was updated.",
            date: "2026-09-01 09:30",
        },
        {
            id: 2,
            title: "Task assigned",
            description:
                "A new development task was assigned to the team.",
            date: "2026-08-31 14:20",
        },
        {
            id: 3,
            title: "Project discussion",
            description:
                "The team discussed the current development priorities.",
            date: "2026-08-30 11:15",
        },
    ],
};

export default function ViewProjectDetails({
    project = DEFAULT_PROJECT,
    onBack,
}) {
    if (!project) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
                <FolderKanban
                    size={45}
                    className="mx-auto mb-4 text-red-500"
                />

                <h2 className="text-lg font-semibold text-red-700">
                    Project not found.
                </h2>

                <p className="mt-2 text-sm text-red-600">
                    Unable to load project details.
                </p>

                {onBack && (
                    <button
                        type="button"
                        onClick={onBack}
                        className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white"
                    >
                        Back to Projects
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                    {onBack && (
                        <button
                            type="button"
                            onClick={onBack}
                            className="rounded-lg border border-gray-200 bg-white p-2 text-gray-600 transition hover:bg-gray-50"
                        >
                            <ArrowLeft size={20} />
                        </button>
                    )}

                    <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                        <FolderKanban size={25} />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {project.name}
                        </h1>

                        <p className="text-sm text-gray-500">
                            Project Details
                        </p>
                    </div>
                </div>

                <span className="w-fit rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
                    {project.status}
                </span>
            </div>

            {/* Project overview */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="max-w-3xl">
                        <p className="text-sm leading-7 text-gray-600">
                            {project.description}
                        </p>

                        <div className="mt-5">
                            <p className="mb-2 text-sm font-semibold text-gray-800">
                                Overall Project Progress
                            </p>

                            <div className="flex items-center gap-3">
                                <div className="h-3 flex-1 overflow-hidden rounded-full bg-gray-100">
                                    <div
                                        className="h-full rounded-full bg-blue-600"
                                        style={{
                                            width: `${project.progress}%`,
                                        }}
                                    />
                                </div>

                                <span className="text-sm font-bold text-blue-600">
                                    {project.progress}%
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 lg:min-w-[300px]">
                        <InfoBox
                            label="Assigned Role"
                            value={project.assignedRole}
                        />

                        <InfoBox
                            label="Manager"
                            value={project.manager}
                        />

                        <InfoBox
                            label="Team Leader"
                            value={project.teamLeader}
                        />

                        <InfoBox
                            label="Status"
                            value={project.status}
                        />
                    </div>
                </div>
            </div>

            {/* Timeline */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <InfoCard
                    icon={<CalendarDays size={21} />}
                    title="Project Timeline"
                >
                    <div className="space-y-4">
                        <TimelineItem
                            label="Start Date"
                            value={project.startDate}
                        />

                        <TimelineItem
                            label="Expected Completion"
                            value={
                                project.expectedCompletionDate
                            }
                        />
                    </div>
                </InfoCard>

                <InfoCard
                    icon={<Clock3 size={21} />}
                    title="Current Sprint"
                >
                    <div>
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">
                                {project.currentSprint.name}
                            </h3>

                            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                                {project.currentSprint.status}
                            </span>
                        </div>

                        <p className="mt-2 text-sm text-gray-600">
                            {project.currentSprint.goal}
                        </p>

                        <div className="mt-4">
                            <div className="mb-2 flex justify-between text-xs">
                                <span className="text-gray-500">
                                    Sprint Progress
                                </span>

                                <span className="font-semibold text-blue-600">
                                    {
                                        project.currentSprint
                                            .progress
                                    }
                                    %
                                </span>
                            </div>

                            <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                                <div
                                    className="h-full rounded-full bg-blue-600"
                                    style={{
                                        width: `${project.currentSprint.progress}%`,
                                    }}
                                />
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                            <div>
                                <p className="text-gray-400">
                                    Start
                                </p>

                                <p className="mt-1 font-medium text-gray-700">
                                    {
                                        project.currentSprint
                                            .startDate
                                    }
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-400">
                                    End
                                </p>

                                <p className="mt-1 font-medium text-gray-700">
                                    {
                                        project.currentSprint
                                            .endDate
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </InfoCard>
            </div>

            {/* Objectives */}
            <InfoCard
                icon={<CheckCircle2 size={21} />}
                title="Project Objectives"
            >
                <div className="space-y-3">
                    {project.objectives?.map(
                        (objective, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-3 rounded-lg bg-gray-50 p-3"
                            >
                                <CheckCircle2
                                    size={18}
                                    className="mt-0.5 shrink-0 text-green-600"
                                />

                                <p className="text-sm text-gray-700">
                                    {objective}
                                </p>
                            </div>
                        )
                    )}
                </div>
            </InfoCard>

            {/* Team */}
            <InfoCard
                icon={<UsersRound size={21} />}
                title="Authorized Team Members"
            >
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
                    {project.teamMembers?.map((member) => (
                        <div
                            key={member.id}
                            className="rounded-lg border border-gray-200 p-4"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
                                    {member.name
                                        ?.charAt(0)
                                        ?.toUpperCase()}
                                </div>

                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-gray-800">
                                        {member.name}
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        {member.role}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </InfoCard>

            {/* Authorized sections */}
            <InfoCard
                icon={<MessageSquare size={21} />}
                title="Authorized Project Activities"
            >
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
                    <ActivityButton
                        title="Assigned Tasks"
                    />

                    <ActivityButton
                        title="Sprint Board"
                    />

                    <ActivityButton
                        title="Discussions"
                    />

                    <ActivityButton
                        title="Project Resources"
                    />
                </div>
            </InfoCard>

            {/* Resources */}
            <InfoCard
                icon={<FileText size={21} />}
                title="Project Documents & Resources"
            >
                <div className="space-y-3">
                    {project.resources?.map((resource) => (
                        <div
                            key={resource.id}
                            className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
                        >
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-gray-100 p-2 text-gray-600">
                                    <FileText size={19} />
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-800">
                                        {resource.name}
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        {resource.type}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                            >
                                View
                            </button>
                        </div>
                    ))}
                </div>
            </InfoCard>

            {/* Recent activities */}
            <InfoCard
                icon={<Clock3 size={21} />}
                title="Recent Project Activities"
            >
                <div className="space-y-4">
                    {project.activities?.map((activity) => (
                        <div
                            key={activity.id}
                            className="flex gap-4"
                        >
                            <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-blue-600" />

                            <div>
                                <p className="text-sm font-semibold text-gray-800">
                                    {activity.title}
                                </p>

                                <p className="mt-1 text-sm text-gray-500">
                                    {activity.description}
                                </p>

                                <p className="mt-1 text-xs text-gray-400">
                                    {activity.date}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </InfoCard>

            {/* Bottom */}
            {onBack && (
                <div className="flex justify-start">
                    <button
                        type="button"
                        onClick={onBack}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        <ArrowLeft size={17} />
                        Back to Projects
                    </button>
                </div>
            )}
        </div>
    );
}

// ============================================================
// SMALL COMPONENTS
// ============================================================

function InfoBox({ label, value }) {
    return (
        <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-xs text-gray-400">{label}</p>

            <p className="mt-1 text-sm font-semibold text-gray-800">
                {value || "Not available"}
            </p>
        </div>
    );
}

function InfoCard({ icon, title, children }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
                <div className="rounded-lg bg-blue-50 p-2.5 text-blue-600">
                    {icon}
                </div>

                <h2 className="text-lg font-bold text-gray-900">
                    {title}
                </h2>
            </div>

            {children}
        </div>
    );
}

function TimelineItem({ label, value }) {
    return (
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0">
            <span className="text-sm text-gray-500">
                {label}
            </span>

            <span className="text-sm font-semibold text-gray-800">
                {value}
            </span>
        </div>
    );
}

function ActivityButton({ title }) {
    return (
        <button
            type="button"
            className="rounded-lg border border-gray-200 bg-white p-4 text-left text-sm font-medium text-gray-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
        >
            {title}
        </button>
    );
}