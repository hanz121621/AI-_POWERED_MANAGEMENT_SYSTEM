
import { useEffect, useMemo, useState } from "react";

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

import api from "@/services/api";

function formatDate(date) {
    if (!date) return "Not set";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "Not set";
    }

    return parsedDate.toLocaleDateString("en-US", {
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

    if (status === "On Hold") {
        return "bg-slate-100 text-slate-700 ring-slate-200";
    }

    return "bg-amber-50 text-amber-700 ring-amber-200";
}

function normalizeStatus(value) {
    if (value === null || value === undefined) {
        return "Planning";
    }

    const normalized = String(value).trim().toLowerCase();

    if (
        normalized === "completed" ||
        normalized === "complete" ||
        normalized === "done" ||
        normalized === "4"
    ) {
        return "Completed";
    }

    if (
        normalized === "in progress" ||
        normalized === "inprogress" ||
        normalized === "active" ||
        normalized === "2"
    ) {
        return "In Progress";
    }

    if (
        normalized === "planning" ||
        normalized === "planned" ||
        normalized === "pending" ||
        normalized === "1"
    ) {
        return "Planning";
    }

    if (
        normalized === "on hold" ||
        normalized === "onhold" ||
        normalized === "hold"
    ) {
        return "On Hold";
    }

    return String(value);
}

function normalizeTaskStatus(value) {
    if (value === null || value === undefined) {
        return "Not Started";
    }

    const normalized = String(value).trim().toLowerCase();

    if (
        normalized === "completed" ||
        normalized === "complete" ||
        normalized === "done" ||
        normalized === "4"
    ) {
        return "Completed";
    }

    if (
        normalized === "in progress" ||
        normalized === "inprogress" ||
        normalized === "2"
    ) {
        return "In Progress";
    }

    if (
        normalized === "blocked" ||
        normalized === "5"
    ) {
        return "Blocked";
    }

    if (
        normalized === "in review" ||
        normalized === "inreview" ||
        normalized === "review" ||
        normalized === "3"
    ) {
        return "In Review";
    }

    return "Not Started";
}

function extractTasks(response) {
    const data = response?.data;

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

function normalizeProject(project) {
    const source =
        project?.project ||
        project?.Project ||
        project?.data ||
        project?.Data ||
        project ||
        {};

    const progress = Number(
        source.progress ??
            source.Progress ??
            source.completionPercentage ??
            source.CompletionPercentage ??
            source.progressPercentage ??
            source.ProgressPercentage ??
            0
    );

    const membersSource =
        source.members ??
        source.Members ??
        source.teamMembers ??
        source.TeamMembers ??
        [];

    const members = Array.isArray(membersSource)
        ? membersSource.map((member, index) => {
              const memberName =
                  member?.name ??
                  member?.Name ??
                  member?.fullName ??
                  member?.FullName ??
                  member?.user?.fullName ??
                  member?.user?.FullName ??
                  "Team Member";

              const initials = memberName
                  .split(" ")
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((part) => part.charAt(0).toUpperCase())
                  .join("");

              return {
                  id:
                      member?.id ??
                      member?.Id ??
                      member?.userId ??
                      member?.UserId ??
                      member?.contributorId ??
                      member?.ContributorId ??
                      index,

                  name: memberName,

                  role:
                      member?.role ??
                      member?.Role ??
                      member?.contributorTypeName ??
                      member?.ContributorTypeName ??
                      member?.contributorType ??
                      member?.ContributorType ??
                      "Contributor",

                  initials: initials || "TM",
              };
          })
        : [];

    const objectivesSource =
        source.objectives ??
        source.Objectives ??
        source.projectObjectives ??
        source.ProjectObjectives ??
        [];

    const activitiesSource =
        source.activities ??
        source.Activities ??
        source.recentActivities ??
        source.RecentActivities ??
        [];

    return {
        id:
            source.id ??
            source.Id ??
            source.projectId ??
            source.ProjectId,

        name:
            source.name ??
            source.Name ??
            source.projectName ??
            source.ProjectName ??
            "Unnamed Project",

        description:
            source.description ??
            source.Description ??
            "",

        status: normalizeStatus(
            source.status ??
                source.Status ??
                source.projectStatus ??
                source.ProjectStatus
        ),

        progress: Number.isFinite(progress)
            ? Math.max(0, Math.min(100, progress))
            : 0,

        role:
            source.role ??
            source.Role ??
            source.teamLeaderRole ??
            source.TeamLeaderRole ??
            "Team Leader",

        manager:
            source.managerName ??
            source.ManagerName ??
            source.manager?.fullName ??
            source.manager?.FullName ??
            source.Manager?.FullName ??
            source.projectManagerName ??
            source.ProjectManagerName ??
            "Project Manager",

        managerInitials:
            source.managerInitials ??
            source.ManagerInitials ??
            "PM",

        currentSprint:
            source.currentSprintName ??
            source.CurrentSprintName ??
            source.sprintName ??
            source.SprintName ??
            source.currentSprint?.name ??
            source.currentSprint?.Name ??
            source.CurrentSprint?.Name ??
            "No active sprint",

        sprintId:
            source.currentSprintId ??
            source.CurrentSprintId ??
            source.sprintId ??
            source.SprintId ??
            source.currentSprint?.id ??
            source.currentSprint?.Id,

        startDate:
            source.startDate ??
            source.StartDate ??
            source.projectStartDate ??
            source.ProjectStartDate,

        endDate:
            source.endDate ??
            source.EndDate ??
            source.projectEndDate ??
            source.ProjectEndDate,

        members,

        objectives: Array.isArray(objectivesSource)
            ? objectivesSource.map((objective) =>
                  typeof objective === "string"
                      ? objective
                      : objective?.title ??
                        objective?.Title ??
                        objective?.description ??
                        objective?.Description ??
                        ""
              ).filter(Boolean)
            : [],

        activities: Array.isArray(activitiesSource)
            ? activitiesSource
                  .map((activity, index) => ({
                      id:
                          activity?.id ??
                          activity?.Id ??
                          index,

                      title:
                          activity?.title ??
                          activity?.Title ??
                          activity?.action ??
                          activity?.Action ??
                          "Project activity",

                      description:
                          activity?.description ??
                          activity?.Description ??
                          "",

                      time:
                          activity?.time ??
                          activity?.Time ??
                          activity?.createdAt ??
                          activity?.CreatedAt ??
                          "",
                  }))
                  .filter((activity) => activity.title)
            : [],

        raw: source,
    };
}

export default function ViewProjectDetails({
    project,
    onBack,
}) {
    const [tasks, setTasks] = useState([]);
    const [tasksLoading, setTasksLoading] = useState(false);
    const [tasksError, setTasksError] = useState("");

    const normalizedProject = useMemo(
        () => normalizeProject(project),
        [project]
    );

    useEffect(() => {
        const loadTasks = async () => {
            if (!normalizedProject.sprintId) {
                setTasks([]);
                return;
            }

            try {
                setTasksLoading(true);
                setTasksError("");

                const response = await api.get(
                    `/tasks/team-leader/sprint/${normalizedProject.sprintId}`
                );

                setTasks(extractTasks(response));
            } catch (error) {
                console.error(
                    "Failed to load project sprint tasks:",
                    error
                );

                setTasksError(
                    error?.response?.data?.message ||
                        error?.response?.data?.Message ||
                        "Unable to load sprint task summary."
                );

                setTasks([]);
            } finally {
                setTasksLoading(false);
            }
        };

        loadTasks();
    }, [normalizedProject.sprintId]);

    const taskSummary = useMemo(() => {
        const summary = {
            total: tasks.length,
            completed: 0,
            inProgress: 0,
            blocked: 0,
            todo: 0,
        };

        tasks.forEach((task) => {
            const status = normalizeTaskStatus(
                task?.status ??
                    task?.Status
            );

            if (status === "Completed") {
                summary.completed += 1;
            } else if (status === "In Progress") {
                summary.inProgress += 1;
            } else if (status === "Blocked") {
                summary.blocked += 1;
            } else {
                summary.todo += 1;
            }
        });

        return summary;
    }, [tasks]);

    if (!project) {
        return (
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="px-6 py-16 text-center">
                    <FolderKanban className="mx-auto mb-4 h-10 w-10 text-slate-400" />

                    <h3 className="font-semibold text-slate-800">
                        Project Not Available
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                        Select an assigned project to view its details.
                    </p>

                    {onBack && (
                        <button
                            type="button"
                            onClick={onBack}
                            className="mt-5 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                        >
                            Back to Projects
                        </button>
                    )}
                </div>
            </section>
        );
    }

    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
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
                                    {normalizedProject.name}
                                </h2>

                                <span
                                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${getStatusStyle(
                                        normalizedProject.status
                                    )}`}
                                >
                                    {normalizedProject.status}
                                </span>
                            </div>

                            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                                {normalizedProject.description ||
                                    "No project description available."}
                            </p>
                        </div>
                    </div>

                    <div className="rounded-xl border border-indigo-100 bg-white px-4 py-3 shadow-sm">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Your Role
                        </p>

                        <p className="mt-1 text-sm font-semibold text-indigo-700">
                            {normalizedProject.role}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 border-b border-slate-200 p-6 sm:grid-cols-2 xl:grid-cols-4">
                <InfoCard
                    icon={Target}
                    label="Project Progress"
                    value={`${normalizedProject.progress}%`}
                />

                <InfoCard
                    icon={Clock3}
                    label="Current Sprint"
                    value={normalizedProject.currentSprint}
                />

                <InfoCard
                    icon={UsersRound}
                    label="Team Members"
                    value={normalizedProject.members.length}
                />

                <InfoCard
                    icon={CalendarDays}
                    label="Expected Completion"
                    value={formatDate(normalizedProject.endDate)}
                />
            </div>

            <div className="grid gap-6 p-6 xl:grid-cols-3">
                <div className="space-y-6 xl:col-span-2">
                    <div className="rounded-xl border border-slate-200 p-5">
                        <SectionTitle
                            icon={CalendarDays}
                            title="Project Timeline"
                        />

                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                            <TimelineCard
                                label="Start Date"
                                value={formatDate(
                                    normalizedProject.startDate
                                )}
                            />

                            <TimelineCard
                                label="Expected Completion"
                                value={formatDate(
                                    normalizedProject.endDate
                                )}
                            />
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 p-5">
                        <SectionTitle
                            icon={Target}
                            title="Project Objectives"
                        />

                        <div className="mt-4 space-y-3">
                            {normalizedProject.objectives.length > 0 ? (
                                normalizedProject.objectives.map(
                                    (objective, index) => (
                                        <div
                                            key={index}
                                            className="flex items-start gap-3 rounded-lg bg-slate-50 p-3"
                                        >
                                            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />

                                            <p className="text-sm leading-6 text-slate-600">
                                                {objective}
                                            </p>
                                        </div>
                                    )
                                )
                            ) : (
                                <EmptySection
                                    text="No project objectives are available."
                                />
                            )}
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 p-5">
                        <SectionTitle
                            icon={ClipboardList}
                            title="Team Task Summary"
                        />

                        {tasksLoading ? (
                            <div className="mt-5 rounded-lg bg-slate-50 p-6 text-center text-sm text-slate-500">
                                Loading sprint task summary...
                            </div>
                        ) : (
                            <>
                                {tasksError && (
                                    <p className="mt-4 text-xs text-amber-600">
                                        {tasksError}
                                    </p>
                                )}

                                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                                    <TaskStat
                                        label="Total"
                                        value={taskSummary.total}
                                    />

                                    <TaskStat
                                        label="Completed"
                                        value={taskSummary.completed}
                                        valueClass="text-emerald-600"
                                    />

                                    <TaskStat
                                        label="In Progress"
                                        value={taskSummary.inProgress}
                                        valueClass="text-blue-600"
                                    />

                                    <TaskStat
                                        label="Blocked"
                                        value={taskSummary.blocked}
                                        valueClass="text-red-600"
                                    />

                                    <TaskStat
                                        label="To Do"
                                        value={taskSummary.todo}
                                        valueClass="text-slate-700"
                                    />
                                </div>
                            </>
                        )}
                    </div>

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

                <div className="space-y-6">
                    <div className="rounded-xl border border-slate-200 p-5">
                        <SectionTitle
                            icon={UsersRound}
                            title="Project Manager"
                        />

                        <div className="mt-4 flex items-center gap-3 rounded-lg bg-slate-50 p-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                                {normalizedProject.managerInitials}
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-slate-800">
                                    {normalizedProject.manager}
                                </p>

                                <p className="text-xs text-slate-500">
                                    Project Manager
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 p-5">
                        <SectionTitle
                            icon={UsersRound}
                            title="Project Team"
                        />

                        <div className="mt-4 space-y-3">
                            {normalizedProject.members.length > 0 ? (
                                normalizedProject.members.map(
                                    (member) => (
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
                                    )
                                )
                            ) : (
                                <EmptySection
                                    text="No authorized team members are available."
                                />
                            )}
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 p-5">
                        <SectionTitle
                            icon={MessageSquare}
                            title="Recent Activities"
                        />

                        <div className="mt-4 space-y-4">
                            {normalizedProject.activities.length > 0 ? (
                                normalizedProject.activities.map(
                                    (activity) => (
                                        <div
                                            key={activity.id}
                                            className="border-l-2 border-indigo-200 pl-3"
                                        >
                                            <p className="text-sm font-medium text-slate-800">
                                                {activity.title}
                                            </p>

                                            {activity.description && (
                                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                                    {activity.description}
                                                </p>
                                            )}

                                            {activity.time && (
                                                <p className="mt-1 text-[11px] text-slate-400">
                                                    {formatActivityTime(
                                                        activity.time
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                    )
                                )
                            ) : (
                                <EmptySection
                                    text="No recent project activities are available."
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function formatActivityTime(value) {
    if (!value) return "";

    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
        return String(value);
    }

    return parsed.toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
    });
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
            <p className="text-xs font-medium text-slate-400">
                {label}
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-800">
                {value}
            </p>
        </div>
    );
}

function TaskStat({
    label,
    value,
    valueClass = "text-slate-900",
}) {
    return (
        <div className="rounded-lg bg-slate-50 p-4 text-center">
            <p className="text-xs font-medium text-slate-400">
                {label}
            </p>

            <p
                className={`mt-1 text-xl font-bold ${valueClass}`}
            >
                {value}
            </p>
        </div>
    );
}

function ActivityItem({
    icon: Icon,
    title,
    description,
}) {
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

function EmptySection({ text }) {
    return (
        <div className="rounded-lg bg-slate-50 p-4 text-center text-sm text-slate-500">
            {text}
        </div>
    );
}
