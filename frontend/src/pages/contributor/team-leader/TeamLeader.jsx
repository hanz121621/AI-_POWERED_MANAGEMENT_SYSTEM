
import React, { useEffect, useMemo, useState } from "react";
import {
    Users,
    ClipboardList,
    CheckCircle2,
    TrendingUp,
    FolderKanban,
    CalendarRange,
    ArrowUpRight,
    RefreshCw,
    AlertCircle,
} from "lucide-react";
import api from "@/services/api";

const extractData = (response) => {
    const data = response?.data;

    if (Array.isArray(data)) {
        return data;
    }

    return (
        data?.data ??
        data?.Data ??
        data?.projects ??
        data?.Projects ??
        data?.tasks ??
        data?.Tasks ??
        data ??
        []
    );
};

const extractTasks = (response) => {
    const data = response?.data;

    if (Array.isArray(data)) {
        return data;
    }

    return (
        data?.tasks ??
        data?.Tasks ??
        data?.data ??
        data?.Data ??
        data?.items ??
        data?.Items ??
        []
    );
};

const normalizeStatus = (value) => {
    if (typeof value === "number") {
        if (value === 1) return "Not Started";
        if (value === 2) return "In Progress";
        if (value === 3) return "In Review";
        if (value === 4) return "Completed";
        if (value === 5) return "Blocked";
    }

    const text = String(value ?? "").trim().toLowerCase();

    if (
        text === "completed" ||
        text === "complete" ||
        text === "done" ||
        text === "4"
    ) {
        return "Completed";
    }

    if (
        text === "in progress" ||
        text === "inprogress" ||
        text === "2"
    ) {
        return "In Progress";
    }

    if (
        text === "in review" ||
        text === "inreview" ||
        text === "review" ||
        text === "3"
    ) {
        return "In Review";
    }

    if (text === "blocked" || text === "5") {
        return "Blocked";
    }

    return "Not Started";
};

const normalizeProject = (project) => {
    const source = project?.project ?? project?.Project ?? project ?? {};

    const currentSprint =
        source?.currentSprint ??
        source?.CurrentSprint ??
        source?.activeSprint ??
        source?.ActiveSprint ??
        {};

    return {
        id:
            source?.id ??
            source?.Id ??
            source?.projectId ??
            source?.ProjectId ??
            null,

        name:
            source?.name ??
            source?.Name ??
            source?.projectName ??
            source?.ProjectName ??
            "Unnamed Project",

        status:
            source?.status ??
            source?.Status ??
            source?.projectStatus ??
            source?.ProjectStatus ??
            "Unknown",

        progress:
            Number(
                source?.progress ??
                    source?.Progress ??
                    source?.completionPercentage ??
                    source?.CompletionPercentage ??
                    source?.progressPercentage ??
                    source?.ProgressPercentage ??
                    0
            ) || 0,

        sprintId:
            source?.currentSprintId ??
            source?.CurrentSprintId ??
            source?.activeSprintId ??
            source?.ActiveSprintId ??
            currentSprint?.id ??
            currentSprint?.Id ??
            currentSprint?.sprintId ??
            currentSprint?.SprintId ??
            null,

        sprintName:
            source?.currentSprintName ??
            source?.CurrentSprintName ??
            source?.sprintName ??
            source?.SprintName ??
            currentSprint?.name ??
            currentSprint?.Name ??
            "Current Sprint",
    };
};

const normalizeTask = (task) => {
    const assignedContributor =
        task?.assignedContributor ??
        task?.AssignedContributor ??
        task?.assignedUser ??
        task?.AssignedUser ??
        task?.contributor ??
        task?.Contributor ??
        task?.user ??
        task?.User ??
        {};

    const contributorName =
        typeof assignedContributor === "string"
            ? assignedContributor
            : assignedContributor?.fullName ??
              assignedContributor?.FullName ??
              assignedContributor?.name ??
              assignedContributor?.Name ??
              task?.assignedContributorName ??
              task?.AssignedContributorName ??
              task?.assignedUserName ??
              task?.AssignedUserName ??
              task?.contributorName ??
              task?.ContributorName ??
              "Unassigned";

    return {
        id:
            task?.id ??
            task?.Id ??
            task?.taskId ??
            task?.TaskId ??
            crypto.randomUUID(),

        title:
            task?.title ??
            task?.Title ??
            task?.name ??
            task?.Name ??
            "Untitled Task",

        member: contributorName,

        assignedContributorId:
            task?.assignedContributorSDId ??
            task?.AssignedContributorSDId ??
            task?.assignedContributorId ??
            task?.AssignedContributorId ??
            task?.contributorId ??
            task?.ContributorId ??
            (typeof assignedContributor === "object"
                ? assignedContributor?.id ?? assignedContributor?.Id
                : assignedContributor),

        status: normalizeStatus(
            task?.status ??
                task?.Status ??
                task?.taskStatus ??
                task?.TaskStatus
        ),

        dueDate:
            task?.dueDate ??
            task?.DueDate ??
            null,

        createdAt:
            task?.createdAt ??
            task?.CreatedAt ??
            null,
    };
};

const getProgressFromTasks = (tasks) => {
    if (!tasks.length) return 0;

    const completed = tasks.filter(
        (task) => task.status === "Completed"
    ).length;

    return Math.round((completed / tasks.length) * 100);
};

const TeamLeader = () => {
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [progressData, setProgressData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadDashboard = async () => {
        setLoading(true);
        setError("");

        try {
            const projectsResponse = await api.get(
                "/team-leader/projects"
            );

            const projectList = extractData(projectsResponse)
                .map(normalizeProject)
                .filter((project) => project.id);

            setProjects(projectList);

            if (!projectList.length) {
                setTasks([]);
                setProgressData(null);
                return;
            }

            const activeProject =
                projectList.find((project) => project.sprintId) ??
                projectList[0];

            if (!activeProject.sprintId) {
                setTasks([]);
                setProgressData(null);
                return;
            }

                       let tasksResponse = { data: [] };
            let progressResponse = { data: null };

            // 🌟 FIX: Fetch tasks independently so a 404 on progress doesn't crash the dashboard
            try {
                tasksResponse = await api.get(`/tasks/team-leader/sprint/${activeProject.sprintId}`);
            } catch (err) {
                console.error("Failed to load sprint tasks:", err);
            }

            try {
                progressResponse = await api.get(`/team-leader/sprints/${activeProject.sprintId}/progress`);
            } catch (err) {
                console.warn("Sprint progress endpoint not available yet (404):", err);
                // Progress data will remain null, and the UI will gracefully fall back to calculating from tasks
            }

            const sprintTasks = extractTasks(tasksResponse)
                .map(normalizeTask);

            setTasks(sprintTasks);

            const rawProgress =
                progressResponse?.data?.data ??
                progressResponse?.data?.Data ??
                progressResponse?.data ??
                null;

            setProgressData(rawProgress);
        } catch (err) {
            console.error("Failed to load Team Leader dashboard:", err);

            setProjects([]);
            setTasks([]);
            setProgressData(null);

            setError(
                err?.response?.data?.message ??
                    err?.response?.data?.Message ??
                    "Unable to load Team Leader dashboard. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    const activeProject = useMemo(() => {
        return (
            projects.find((project) => project.sprintId) ??
            projects[0] ??
            null
        );
    }, [projects]);

    const dashboardStats = useMemo(() => {
        const uniqueMembers = new Set(
            tasks
                .filter(
                    (task) =>
                        task.assignedContributorId &&
                        task.member !== "Unassigned"
                )
                .map((task) => String(task.assignedContributorId))
        );

        const completed = tasks.filter(
            (task) => task.status === "Completed"
        ).length;

        const activeTasks = tasks.filter(
            (task) =>
                task.status === "In Progress" ||
                task.status === "In Review"
        ).length;

        const blocked = tasks.filter(
            (task) => task.status === "Blocked"
        ).length;

        const completion = getProgressFromTasks(tasks);

        return {
            teamMembers: uniqueMembers.size,
            activeTasks,
            completed,
            completion,
            blocked,
        };
    }, [tasks]);

    const sprintStats = useMemo(() => {
        const total =
            progressData?.totalTasks ??
            progressData?.TotalTasks ??
            tasks.length;

        const completed =
            progressData?.completedTasks ??
            progressData?.CompletedTasks ??
            tasks.filter((task) => task.status === "Completed").length;

        const inProgress =
            progressData?.inProgressTasks ??
            progressData?.InProgressTasks ??
            tasks.filter(
                (task) => task.status === "In Progress"
            ).length;

        const blocked =
            progressData?.blockedTasks ??
            progressData?.BlockedTasks ??
            tasks.filter((task) => task.status === "Blocked").length;

        const pending =
            progressData?.pendingTasks ??
            progressData?.PendingTasks ??
            tasks.filter(
                (task) => task.status === "Not Started"
            ).length;

        const completion =
            Number(
                progressData?.completionPercentage ??
                    progressData?.CompletionPercentage ??
                    progressData?.progressPercentage ??
                    progressData?.ProgressPercentage
            ) || (total ? Math.round((completed / total) * 100) : 0);

        return {
            total,
            completed,
            inProgress,
            blocked,
            pending,
            completion: Math.min(100, Math.max(0, Math.round(completion))),
        };
    }, [progressData, tasks]);

    const performance = useMemo(() => {
        const total = tasks.length;

        if (!total) {
            return {
                completion: 0,
                efficiency: 0,
                onTime: 0,
            };
        }

        const completed = tasks.filter(
            (task) => task.status === "Completed"
        );

        const completion = Math.round(
            (completed.length / total) * 100
        );

        const blocked = tasks.filter(
            (task) => task.status === "Blocked"
        ).length;

        const efficiency = Math.max(
            0,
            Math.round(
                completion * 0.7 -
                    (blocked / total) * 30
            )
        );

        const now = new Date();

        const completedWithDeadline = completed.filter(
            (task) => task.dueDate
        );

        const onTime =
            completedWithDeadline.length > 0
                ? Math.round(
                      (completedWithDeadline.filter(
                          (task) =>
                              new Date(task.createdAt ?? now) <=
                              new Date(task.dueDate)
                      ).length /
                          completedWithDeadline.length) *
                          100
                  )
                : completion;

        return {
            completion,
            efficiency,
            onTime: Math.min(100, Math.max(0, onTime)),
        };
    }, [tasks]);

    const recentTasks = useMemo(() => {
        return [...tasks]
            .sort((a, b) => {
                const dateA = a.createdAt
                    ? new Date(a.createdAt).getTime()
                    : 0;

                const dateB = b.createdAt
                    ? new Date(b.createdAt).getTime()
                    : 0;

                return dateB - dateA;
            })
            .slice(0, 4);
    }, [tasks]);

    const statCards = [
        {
            title: "Team Members",
            value: dashboardStats.teamMembers,
            subtitle: "Assigned to your team",
            icon: Users,
        },
        {
            title: "Active Tasks",
            value: dashboardStats.activeTasks,
            subtitle: "Currently in progress",
            icon: ClipboardList,
        },
        {
            title: "Completed",
            value: dashboardStats.completed,
            subtitle: "Tasks completed",
            icon: CheckCircle2,
        },
        {
            title: "Team Progress",
            value: `${dashboardStats.completion}%`,
            subtitle: "Current sprint completion",
            icon: TrendingUp,
        },
    ];

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    Loading Team Leader dashboard...
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Team Leader Dashboard
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Monitor your team, projects, tasks, and sprint progress.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={loadDashboard}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                </button>
            </div>

            {error && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                    <div>
                        <p className="font-medium">
                            Dashboard data could not be loaded.
                        </p>
                        <p className="mt-1">{error}</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {statCards.map((stat) => {
                    const Icon = stat.icon;

                    return (
                        <div
                            key={stat.title}
                            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        {stat.title}
                                    </p>

                                    <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                                        {stat.value}
                                    </p>

                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        {stat.subtitle}
                                    </p>
                                </div>

                                <div className="rounded-lg bg-gray-100 p-3 dark:bg-gray-700">
                                    <Icon className="h-5 w-5 text-gray-700 dark:text-gray-200" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <section className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <FolderKanban className="h-5 w-5 text-gray-700 dark:text-gray-300" />

                            <div>
                                <h2 className="font-semibold text-gray-900 dark:text-white">
                                    Assigned Projects
                                </h2>

                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Current project progress
                                </p>
                            </div>
                        </div>

                        <ArrowUpRight className="h-4 w-4 text-gray-400" />
                    </div>

                    <div className="space-y-5 p-6">
                        {projects.length === 0 ? (
                            <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                                No assigned projects found.
                            </div>
                        ) : (
                            projects.slice(0, 5).map((project) => (
                                <div key={project.id}>
                                    <div className="mb-2 flex items-center justify-between gap-4">
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                                {project.name}
                                            </p>

                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {project.status}
                                            </p>
                                        </div>

                                        <span className="shrink-0 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            {Math.min(
                                                100,
                                                Math.max(
                                                    0,
                                                    Math.round(project.progress)
                                                )
                                            )}
                                            %
                                        </span>
                                    </div>

                                    <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                                        <div
                                            className="h-full rounded-full bg-gray-800 dark:bg-gray-300"
                                            style={{
                                                width: `${Math.min(
                                                    100,
                                                    Math.max(
                                                        0,
                                                        Math.round(project.progress)
                                                    )
                                                )}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                <section className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <CalendarRange className="h-5 w-5 text-gray-700 dark:text-gray-300" />

                            <div>
                                <h2 className="font-semibold text-gray-900 dark:text-white">
                                    Sprint Progress
                                </h2>

                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Current sprint overview
                                </p>
                            </div>
                        </div>

                        <span className="max-w-[180px] truncate rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                            {activeProject?.sprintName ?? "Current Sprint"}
                        </span>
                    </div>

                    <div className="p-6">
                        {!activeProject?.sprintId ? (
                            <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                                No active sprint is available.
                            </div>
                        ) : (
                            <>
                                <div className="flex items-end justify-between gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Sprint completion
                                        </p>

                                        <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
                                            {sprintStats.completion}%
                                        </p>
                                    </div>

                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {sprintStats.completed} of{" "}
                                        {sprintStats.total} tasks
                                    </p>
                                </div>

                                <div className="mt-5 h-3 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                                    <div
                                        className="h-full rounded-full bg-gray-800 dark:bg-gray-300"
                                        style={{
                                            width: `${sprintStats.completion}%`,
                                        }}
                                    />
                                </div>

                                <div className="mt-5 grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                                            {sprintStats.completed}
                                        </p>

                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Completed
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                                            {sprintStats.inProgress}
                                        </p>

                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            In Progress
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                                            {sprintStats.pending}
                                        </p>

                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Pending
                                        </p>
                                    </div>
                                </div>

                                {sprintStats.blocked > 0 && (
                                    <p className="mt-4 text-center text-xs text-red-500">
                                        {sprintStats.blocked} blocked task
                                        {sprintStats.blocked !== 1 ? "s" : ""}
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                </section>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <section className="xl:col-span-2 rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                        <h2 className="font-semibold text-gray-900 dark:text-white">
                            Recent Team Tasks
                        </h2>

                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Latest task activity from the current sprint
                        </p>
                    </div>

                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        {recentTasks.length === 0 ? (
                            <div className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                                No tasks found for the current sprint.
                            </div>
                        ) : (
                            recentTasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="flex items-center justify-between gap-4 px-6 py-4"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                            {task.title}
                                        </p>

                                        <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">
                                            Assigned to {task.member}
                                        </p>
                                    </div>

                                    <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                                        {task.status}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                <section className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                        <h2 className="font-semibold text-gray-900 dark:text-white">
                            Team Performance
                        </h2>

                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Current performance summary
                        </p>
                    </div>

                    <div className="space-y-6 p-6">
                        <div>
                            <div className="mb-2 flex justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    Task Completion
                                </span>

                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {performance.completion}%
                                </span>
                            </div>

                            <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-700">
                                <div
                                    className="h-full rounded-full bg-gray-800 dark:bg-gray-300"
                                    style={{
                                        width: `${performance.completion}%`,
                                    }}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="mb-2 flex justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    Sprint Efficiency
                                </span>

                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {performance.efficiency}%
                                </span>
                            </div>

                            <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-700">
                                <div
                                    className="h-full rounded-full bg-gray-800 dark:bg-gray-300"
                                    style={{
                                        width: `${performance.efficiency}%`,
                                    }}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="mb-2 flex justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    On-Time Delivery
                                </span>

                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {performance.onTime}%
                                </span>
                            </div>

                            <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-700">
                                <div
                                    className="h-full rounded-full bg-gray-800 dark:bg-gray-300"
                                    style={{
                                        width: `${performance.onTime}%`,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default TeamLeader;
