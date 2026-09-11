
import React, { useEffect, useMemo, useState } from "react";

import {
    CalendarDays,
    CheckCircle2,
    ChevronRight,
    Clock3,
    FolderKanban,
    Search,
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

function normalizeProject(project) {
    const source =
        project?.project ||
        project?.Project ||
        project?.data ||
        project?.Data ||
        project ||
        {};

    const progressValue =
        source.progress ??
        source.Progress ??
        source.completionPercentage ??
        source.CompletionPercentage ??
        source.progressPercentage ??
        source.ProgressPercentage ??
        0;

    const numericProgress = Number(progressValue);

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

        progress: Math.max(
            0,
            Math.min(
                100,
                Number.isFinite(numericProgress)
                    ? numericProgress
                    : 0
            )
        ),

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

        currentSprint:
            source.currentSprintName ??
            source.CurrentSprintName ??
            source.sprintName ??
            source.SprintName ??
            source.currentSprint?.name ??
            source.currentSprint?.Name ??
            source.CurrentSprint?.Name ??
            "No active sprint",

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

        members:
            source.membersCount ??
            source.MembersCount ??
            source.memberCount ??
            source.MemberCount ??
            source.teamMemberCount ??
            source.TeamMemberCount ??
            source.members?.length ??
            source.Members?.length ??
            0,

        raw: source,
    };
}

function extractProjects(response) {
    const data = response?.data;

    if (Array.isArray(data)) {
        return data;
    }

    if (Array.isArray(data?.projects)) {
        return data.projects;
    }

    if (Array.isArray(data?.Projects)) {
        return data.Projects;
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

export default function ViewAssignedProjects({
    onSelectProject,
    projects: providedProjects,
    onRefresh,
}) {
    const [projects, setProjects] = useState(
        Array.isArray(providedProjects)
            ? providedProjects.map(normalizeProject)
            : []
    );

    const [loading, setLoading] = useState(
        !Array.isArray(providedProjects)
    );

    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const loadProjects = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/team-leader/projects");

            const backendProjects = extractProjects(response);

            const normalizedProjects =
                backendProjects.map(normalizeProject);

            setProjects(normalizedProjects);
        } catch (apiError) {
            console.error(
                "Failed to load assigned Team Leader projects:",
                apiError
            );

            setError(
                apiError?.response?.data?.message ||
                    apiError?.response?.data?.Message ||
                    "Failed to load assigned projects."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (Array.isArray(providedProjects)) {
            setProjects(providedProjects.map(normalizeProject));
            setLoading(false);
            return;
        }

        loadProjects();
    }, [providedProjects]);

    const handleRefresh = async () => {
        if (onRefresh) {
            await onRefresh();
            return;
        }

        await loadProjects();
    };

    const filteredProjects = useMemo(() => {
        const searchValue = search.trim().toLowerCase();

        return projects.filter((project) => {
            const matchesSearch =
                !searchValue ||
                project.name
                    .toLowerCase()
                    .includes(searchValue) ||
                project.description
                    .toLowerCase()
                    .includes(searchValue) ||
                project.status
                    .toLowerCase()
                    .includes(searchValue) ||
                project.manager
                    .toLowerCase()
                    .includes(searchValue);

            const matchesStatus =
                statusFilter === "All" ||
                project.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [projects, search, statusFilter]);

    if (loading) {
        return (
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-center px-6 py-16">
                    <div className="text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50">
                            <FolderKanban className="h-6 w-6 animate-pulse text-indigo-600" />
                        </div>

                        <p className="text-sm font-medium text-slate-700">
                            Loading assigned projects...
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    if (error && projects.length === 0) {
        return (
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="px-6 py-16 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                        <FolderKanban className="h-6 w-6 text-red-500" />
                    </div>

                    <h3 className="font-semibold text-slate-800">
                        Unable to load assigned projects
                    </h3>

                    <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={handleRefresh}
                        className="mt-5 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
                    >
                        Try Again
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
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

            {error && projects.length > 0 && (
                <div className="border-b border-amber-200 bg-amber-50 px-6 py-3 text-sm text-amber-700">
                    {error}
                </div>
            )}

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
                            {projects.length === 0
                                ? "There are currently no projects assigned to your Team Leader account."
                                : "Try changing your search or filter."}
                        </p>
                    </div>
                ) : (
                    filteredProjects.map((project) => (
                        <div
                            key={project.id}
                            className="group px-6 py-5 transition hover:bg-slate-50"
                        >
                            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
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
                                        {project.description ||
                                            "No project description available."}
                                    </p>

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
