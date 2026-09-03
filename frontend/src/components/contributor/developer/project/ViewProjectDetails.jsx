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

export default function ViewProjectDetails({
    project,
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
                    No Project Selected
                </h2>

                <p className="mt-2 text-sm text-red-600">
                    Select a project from your assigned projects to view
                    its details.
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

    const progress = Math.min(
        100,
        Math.max(
            0,
            Number(
                project?.progressPercentage ??
                project?.progress ??
                0
            )
        )
    );

    const status =
        project?.statusName ||
        project?.status ||
        "Unknown";

    const manager =
        project?.managerName ||
        project?.manager ||
        "Not available";

    const teamLeader =
        project?.teamLeaderName ||
        project?.teamLeader ||
        "Not available";

    const assignedRole =
        project?.assignedRole ||
        project?.role ||
        "Developer";

    const startDate =
        formatDate(project?.startDate);

    const expectedCompletionDate =
        formatDate(
            project?.expectedCompletionDate ??
            project?.endDate ??
            project?.completionDate
        );

    const objectives = Array.isArray(project?.objectives)
        ? project.objectives
        : [];

    const teamMembers = Array.isArray(
        project?.teamMembers
    )
        ? project.teamMembers
        : [];

    const resources = Array.isArray(
        project?.resources
    )
        ? project.resources
        : [];

    const activities = Array.isArray(
        project?.activities
    )
        ? project.activities
        : [];

    const currentSprint =
        project?.currentSprint || null;

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
                            {project?.name ||
                                "Unnamed Project"}
                        </h1>

                        <p className="text-sm text-gray-500">
                            Project Details
                        </p>
                    </div>
                </div>

                <span className="w-fit rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
                    {status}
                </span>
            </div>

            {/* Project overview */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="max-w-3xl">
                        <p className="text-sm leading-7 text-gray-600">
                            {project?.description ||
                                "No project description available."}
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
                                            width: `${progress}%`,
                                        }}
                                    />
                                </div>

                                <span className="text-sm font-bold text-blue-600">
                                    {progress}%
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 lg:min-w-75">
                        <InfoBox
                            label="Assigned Role"
                            value={assignedRole}
                        />

                        <InfoBox
                            label="Manager"
                            value={manager}
                        />

                        <InfoBox
                            label="Team Leader"
                            value={teamLeader}
                        />

                        <InfoBox
                            label="Status"
                            value={status}
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
                            value={startDate}
                        />

                        <TimelineItem
                            label="Expected Completion"
                            value={
                                expectedCompletionDate
                            }
                        />
                    </div>
                </InfoCard>

                <InfoCard
                    icon={<Clock3 size={21} />}
                    title="Current Sprint"
                >
                    {currentSprint ? (
                        <div>
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900">
                                    {currentSprint?.name ||
                                        "Current Sprint"}
                                </h3>

                                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                                    {currentSprint?.status ||
                                        "Active"}
                                </span>
                            </div>

                            <p className="mt-2 text-sm text-gray-600">
                                {currentSprint?.goal ||
                                    "No sprint goal available."}
                            </p>

                            <div className="mt-4">
                                <div className="mb-2 flex justify-between text-xs">
                                    <span className="text-gray-500">
                                        Sprint Progress
                                    </span>

                                    <span className="font-semibold text-blue-600">
                                        {Number(
                                            currentSprint?.progress ??
                                            currentSprint?.progressPercentage ??
                                            0
                                        )}
                                        %
                                    </span>
                                </div>

                                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                                    <div
                                        className="h-full rounded-full bg-blue-600"
                                        style={{
                                            width: `${Math.min(
                                                100,
                                                Math.max(
                                                    0,
                                                    Number(
                                                        currentSprint?.progress ??
                                                        currentSprint?.progressPercentage ??
                                                        0
                                                    )
                                                )
                                            )}%`,
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
                                        {formatDate(
                                            currentSprint?.startDate
                                        )}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-400">
                                        End
                                    </p>

                                    <p className="mt-1 font-medium text-gray-700">
                                        {formatDate(
                                            currentSprint?.endDate
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <EmptySection
                            message="No current sprint information is available."
                        />
                    )}
                </InfoCard>
            </div>

            {/* Objectives */}
            <InfoCard
                icon={<CheckCircle2 size={21} />}
                title="Project Objectives"
            >
                {objectives.length > 0 ? (
                    <div className="space-y-3">
                        {objectives.map(
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
                                        {typeof objective ===
                                        "string"
                                            ? objective
                                            : objective?.description ||
                                              objective?.title ||
                                              "Objective"}
                                    </p>
                                </div>
                            )
                        )}
                    </div>
                ) : (
                    <EmptySection
                        message="No project objectives are available."
                    />
                )}
            </InfoCard>

            {/* Team */}
            <InfoCard
                icon={<UsersRound size={21} />}
                title="Authorized Team Members"
            >
                {teamMembers.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
                        {teamMembers.map(
                            (member, index) => (
                                <div
                                    key={
                                        member?.id ??
                                        index
                                    }
                                    className="rounded-lg border border-gray-200 p-4"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
                                            {(
                                                member?.name ||
                                                member?.fullName ||
                                                "U"
                                            )
                                                ?.charAt(0)
                                                ?.toUpperCase()}
                                        </div>

                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-gray-800">
                                                {member?.name ||
                                                    member?.fullName ||
                                                    "Unknown Member"}
                                            </p>

                                            <p className="text-xs text-gray-500">
                                                {member?.role ||
                                                    member?.roleName ||
                                                    "Team Member"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                ) : (
                    <EmptySection
                        message="No team member details are available."
                    />
                )}
            </InfoCard>

            {/* Authorized sections */}
            <InfoCard
                icon={<MessageSquare size={21} />}
                title="Authorized Project Activities"
            >
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
                    <ActivityButton title="Assigned Tasks" />
                    <ActivityButton title="Sprint Board" />
                    <ActivityButton title="Discussions" />
                    <ActivityButton title="Project Resources" />
                </div>
            </InfoCard>

            {/* Resources */}
            <InfoCard
                icon={<FileText size={21} />}
                title="Project Documents & Resources"
            >
                {resources.length > 0 ? (
                    <div className="space-y-3">
                        {resources.map(
                            (resource, index) => (
                                <div
                                    key={
                                        resource?.id ??
                                        index
                                    }
                                    className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-gray-100 p-2 text-gray-600">
                                            <FileText size={19} />
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium text-gray-800">
                                                {resource?.name ||
                                                    resource?.title ||
                                                    "Project Resource"}
                                            </p>

                                            <p className="text-xs text-gray-500">
                                                {resource?.type ||
                                                    "Document"}
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
                            )
                        )}
                    </div>
                ) : (
                    <EmptySection
                        message="No project documents or resources are available."
                    />
                )}
            </InfoCard>

            {/* Recent activities */}
            <InfoCard
                icon={<Clock3 size={21} />}
                title="Recent Project Activities"
            >
                {activities.length > 0 ? (
                    <div className="space-y-4">
                        {activities.map(
                            (activity, index) => (
                                <div
                                    key={
                                        activity?.id ??
                                        index
                                    }
                                    className="flex gap-4"
                                >
                                    <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-blue-600" />

                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">
                                            {activity?.title ||
                                                "Project Activity"}
                                        </p>

                                        <p className="mt-1 text-sm text-gray-500">
                                            {activity?.description ||
                                                "No activity description available."}
                                        </p>

                                        <p className="mt-1 text-xs text-gray-400">
                                            {formatDateTime(
                                                activity?.date ??
                                                activity?.createdAt
                                            )}
                                        </p>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                ) : (
                    <EmptySection
                        message="No recent project activities are available."
                    />
                )}
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
            <p className="text-xs text-gray-400">
                {label}
            </p>

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
                {value || "Not available"}
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

function EmptySection({ message }) {
    return (
        <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-5 text-center">
            <p className="text-sm text-gray-500">
                {message}
            </p>
        </div>
    );
}

function formatDate(date) {
    if (!date) {
        return "Not set";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "Not set";
    }

    return parsedDate.toLocaleDateString();
}

function formatDateTime(date) {
    if (!date) {
        return "Not available";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "Not available";
    }

    return parsedDate.toLocaleString();
}