import React from "react";
import {
    Users,
    ClipboardList,
    CheckCircle2,
    TrendingUp,
    FolderKanban,
    CalendarRange,
    ArrowUpRight,
} from "lucide-react";

const TeamLeader = () => {
    const stats = [
        {
            title: "Team Members",
            value: "8",
            subtitle: "Assigned to your team",
            icon: Users,
        },
        {
            title: "Active Tasks",
            value: "24",
            subtitle: "Currently assigned",
            icon: ClipboardList,
        },
        {
            title: "Completed",
            value: "18",
            subtitle: "Tasks completed",
            icon: CheckCircle2,
        },
        {
            title: "Team Progress",
            value: "82%",
            subtitle: "Overall completion",
            icon: TrendingUp,
        },
    ];

    const projects = [
        {
            name: "AI-Powered PMS",
            status: "Active",
            progress: 82,
        },
        {
            name: "FieldSync",
            status: "Active",
            progress: 68,
        },
        {
            name: "Library Management",
            status: "Planning",
            progress: 35,
        },
    ];

    const recentTasks = [
        {
            title: "Implement authentication",
            member: "John Doe",
            status: "In Progress",
        },
        {
            title: "Design dashboard",
            member: "Sara Ali",
            status: "Completed",
        },
        {
            title: "API integration",
            member: "Michael",
            status: "Pending",
        },
        {
            title: "Database optimization",
            member: "Daniel",
            status: "In Progress",
        },
    ];

    return (
        <div className="space-y-6">
            {/* ============================================================
                HEADER
            ============================================================ */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Team Leader Dashboard
                </h1>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Monitor your team, projects, tasks, and sprint progress.
                </p>
            </div>

            {/* ============================================================
                KPI CARDS
            ============================================================ */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                        <div
                            key={stat.title}
                            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm
                            dark:border-gray-700 dark:bg-gray-800"
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

            {/* ============================================================
                MAIN OVERVIEW
            ============================================================ */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

                {/* PROJECT OVERVIEW */}
                <section
                    className="rounded-xl border border-gray-200 bg-white shadow-sm
                    dark:border-gray-700 dark:bg-gray-800"
                >
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
                        {projects.map((project) => (
                            <div key={project.name}>
                                <div className="mb-2 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {project.name}
                                        </p>

                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {project.status}
                                        </p>
                                    </div>

                                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        {project.progress}%
                                    </span>
                                </div>

                                <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                                    <div
                                        className="h-full rounded-full bg-gray-800 dark:bg-gray-300"
                                        style={{
                                            width: `${project.progress}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* SPRINT OVERVIEW */}
                <section
                    className="rounded-xl border border-gray-200 bg-white shadow-sm
                    dark:border-gray-700 dark:bg-gray-800"
                >
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

                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                            Sprint 01
                        </span>
                    </div>

                    <div className="p-6">
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Sprint completion
                                </p>

                                <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
                                    75%
                                </p>
                            </div>

                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                18 of 24 tasks
                            </p>
                        </div>

                        <div className="mt-5 h-3 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                            <div
                                className="h-full rounded-full bg-gray-800 dark:bg-gray-300"
                                style={{ width: "75%" }}
                            />
                        </div>

                        <div className="mt-5 grid grid-cols-3 gap-4 text-center">
                            <div>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">
                                    18
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Completed
                                </p>
                            </div>

                            <div>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">
                                    4
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    In Progress
                                </p>
                            </div>

                            <div>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">
                                    2
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Pending
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* ============================================================
                BOTTOM OVERVIEW
            ============================================================ */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

                {/* RECENT TASKS */}
                <section
                    className="xl:col-span-2 rounded-xl border border-gray-200 bg-white shadow-sm
                    dark:border-gray-700 dark:bg-gray-800"
                >
                    <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                        <h2 className="font-semibold text-gray-900 dark:text-white">
                            Recent Team Tasks
                        </h2>

                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Latest task activity
                        </p>
                    </div>

                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        {recentTasks.map((task) => (
                            <div
                                key={task.title}
                                className="flex items-center justify-between px-6 py-4"
                            >
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {task.title}
                                    </p>

                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        Assigned to {task.member}
                                    </p>
                                </div>

                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                                    {task.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* PERFORMANCE */}
                <section
                    className="rounded-xl border border-gray-200 bg-white shadow-sm
                    dark:border-gray-700 dark:bg-gray-800"
                >
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
                                    82%
                                </span>
                            </div>

                            <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-700">
                                <div
                                    className="h-full rounded-full bg-gray-800 dark:bg-gray-300"
                                    style={{ width: "82%" }}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="mb-2 flex justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    Sprint Efficiency
                                </span>

                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                    76%
                                </span>
                            </div>

                            <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-700">
                                <div
                                    className="h-full rounded-full bg-gray-800 dark:bg-gray-300"
                                    style={{ width: "76%" }}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="mb-2 flex justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    On-Time Delivery
                                </span>

                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                    88%
                                </span>
                            </div>

                            <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-700">
                                <div
                                    className="h-full rounded-full bg-gray-800 dark:bg-gray-300"
                                    style={{ width: "88%" }}
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