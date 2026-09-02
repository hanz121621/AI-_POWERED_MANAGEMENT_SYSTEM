import { useMemo, useState } from "react";
import {
    CalendarDays,
    CheckCircle2,
    ChevronRight,
    Clock3,
    FolderKanban,
    Search,
    UsersRound,
} from "lucide-react";

const SAMPLE_PROJECTS = [
    {
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
        members: 8,
    },
    {
        id: 2,
        name: "FieldSync Platform",
        description:
            "An offline-first field management platform for tracking activities, synchronization, and project operations.",
        status: "In Progress",
        progress: 45,
        role: "Team Leader",
        manager: "Project Manager",
        currentSprint: "Sprint 2",
        startDate: "2026-08-15",
        endDate: "2026-11-01",
        members: 6,
    },
    {
        id: 3,
        name: "HR Management System",
        description:
            "A centralized human resource management system for managing employees, teams, activities, and reports.",
        status: "Planning",
        progress: 15,
        role: "Team Leader",
        manager: "Project Manager",
        currentSprint: "Sprint 1",
        startDate: "2026-09-01",
        endDate: "2026-12-10",
        members: 5,
    },
];

function formatDate(date) {
    if (!date) return "Not set";

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
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

        case "Planning":
            return "bg-amber-50 text-amber-700 ring-amber-200";

        case "On Hold":
            return "bg-slate-100 text-slate-700 ring-slate-200";

        default:
            return "bg-slate-50 text-slate-600 ring-slate-200";
    }
}

export default function ViewAssignedProjects({ onSelectProject }) {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const filteredProjects = useMemo(() => {
        return SAMPLE_PROJECTS.filter((project) => {
            const matchesSearch =
                project.name
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                project.description
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const matchesStatus =
                statusFilter === "All" ||
                project.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [search, statusFilter]);

    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Header */}
            <div className="border-b border-slate-200 px-6 py-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <FolderKanban className="h-5 w-5 text-indigo-600" />

                            <h2 className="text-lg font-semibold text-slate-900">
                                Assigned Projects
                            </h2>
                        </div>

                        <p className="mt-1 text-sm text-slate-500">
                            Projects assigned to you for team coordination
                            and project participation.
                        </p>
                    </div>

                    <div className="rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700">
                        {filteredProjects.length} Project
                        {filteredProjects.length !== 1 ? "s" : ""}
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="border-b border-slate-200 bg-slate-50/70 px-6 py-4">
                <div className="flex flex-col gap-3 md:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Search projects..."
                            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(event) =>
                            setStatusFilter(event.target.value)
                        }
                        className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Planning">Planning</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="On Hold">On Hold</option>
                    </select>
                </div>
            </div>

            {/* Project List */}
            <div className="divide-y divide-slate-100">
                {filteredProjects.length === 0 ? (
                    <div className="px-6 py-16 text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                            <FolderKanban className="h-6 w-6 text-slate-400" />
                        </div>

                        <h3 className="font-semibold text-slate-800">
                            No assigned projects found
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                            Try changing your search or filter.
                        </p>
                    </div>
                ) : (
                    filteredProjects.map((project) => (
                        <div
                            key={project.id}
                            className="group px-6 py-5 transition hover:bg-slate-50"
                        >
                            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                                {/* Main Info */}
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h3 className="text-base font-semibold text-slate-900">
                                            {project.name}
                                        </h3>

                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${getStatusStyle(
                                                project.status
                                            )}`}
                                        >
                                            {project.status}
                                        </span>
                                    </div>

                                    <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                                        {project.description}
                                    </p>

                                    {/* Metadata */}
                                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
                                        <div className="flex items-center gap-1.5">
                                            <UsersRound className="h-4 w-4" />
                                            {project.members} team members
                                        </div>

                                        <div className="flex items-center gap-1.5">
                                            <Clock3 className="h-4 w-4" />
                                            {project.currentSprint}
                                        </div>

                                        <div className="flex items-center gap-1.5">
                                            <CalendarDays className="h-4 w-4" />
                                            {formatDate(project.startDate)}
                                            {" – "}
                                            {formatDate(project.endDate)}
                                        </div>
                                    </div>
                                </div>

                                {/* Progress */}
                                <div className="w-full xl:max-w-xs">
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className="text-xs font-medium text-slate-500">
                                            Project Progress
                                        </span>

                                        <span className="text-sm font-semibold text-slate-900">
                                            {project.progress}%
                                        </span>
                                    </div>

                                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                        <div
                                            className="h-full rounded-full bg-indigo-600 transition-all"
                                            style={{
                                                width: `${project.progress}%`,
                                            }}
                                        />
                                    </div>

                                    <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                                        <span>
                                            Role: {project.role}
                                        </span>

                                        <span>
                                            Manager: {project.manager}
                                        </span>
                                    </div>
                                </div>

                                {/* Action */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        onSelectProject?.(project)
                                    }
                                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                                >
                                    View Details
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Footer */}
            {filteredProjects.length > 0 && (
                <div className="flex items-center gap-2 border-t border-slate-200 bg-slate-50 px-6 py-3 text-xs text-slate-500">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    Only projects assigned to your Team Leader account are
                    displayed.
                </div>
            )}
        </section>
    );
}