
import { useEffect, useMemo, useState } from "react";
import {
    AlertCircle,
    CalendarDays,
    CheckCircle2,
    Eye,
    FolderKanban,
    Loader2,
    Search,
    UserRound,
    UsersRound,
    X,
} from "lucide-react";



const DEMO_PROJECTS = [
    {
        id: "PROJ-001",
        name: "AI-Powered Management System",
        description:
            "A project management platform for managing projects, teams, tasks, sprints, progress, and AI-powered recommendations.",
        status: "In Progress",
        manager: "Project Manager",
        team: "Development Team",
        contributorType: "Developer",
        specialization: "Full-Stack Development",
        currentSprint: "Sprint 4",
        progress: 68,
        startDate: "2026-07-01",
        expectedCompletionDate: "2026-09-30",
    },
    {
        id: "PROJ-002",
        name: "FieldSync",
        description:
            "An offline-first field data synchronization system with GPS tracking and centralized data synchronization.",
        status: "In Progress",
        manager: "Project Manager",
        team: "FieldSync Team",
        contributorType: "Staff",
        specialization: "System Support",
        currentSprint: "Sprint 3",
        progress: 52,
        startDate: "2026-06-15",
        expectedCompletionDate: "2026-10-15",
    },
];

// ============================================================
// HELPERS
// ============================================================

const formatDate = (date) => {
    if (!date) return "Not available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return date;
    }

    return parsedDate.toLocaleDateString();
};

const getStatusClasses = (status) => {
    switch (status) {
        case "Completed":
            return "bg-emerald-100 text-emerald-700";

        case "In Progress":
            return "bg-blue-100 text-blue-700";

        case "On Hold":
            return "bg-amber-100 text-amber-700";

        case "Cancelled":
            return "bg-red-100 text-red-700";

        default:
            return "bg-slate-100 text-slate-700";
    }
};

// ============================================================
// COMPONENT
// ============================================================

function ViewAssignedProjects() {
    const [projects, setProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedProject, setSelectedProject] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ========================================================
    // LOAD ASSIGNED PROJECTS
    // ========================================================

    useEffect(() => {
        let mounted = true;

        const loadAssignedProjects = async () => {
            try {
                setLoading(true);
                setError("");

               

                await new Promise((resolve) =>
                    setTimeout(resolve, 400)
                );

                if (mounted) {
                    setProjects(DEMO_PROJECTS);
                }
            } catch (err) {
                console.error(
                    "Failed to load assigned projects:",
                    err
                );

                if (mounted) {
                    setError(
                        "Unable to load project information. Please try again."
                    );
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        loadAssignedProjects();

        return () => {
            mounted = false;
        };
    }, []);

    // ========================================================
    // FILTER PROJECTS
    // ========================================================

    const filteredProjects = useMemo(() => {
        const search = searchTerm.trim().toLowerCase();

        return projects.filter((project) => {
            const matchesSearch =
                !search ||
                project.name?.toLowerCase().includes(search) ||
                project.description?.toLowerCase().includes(search) ||
                project.manager?.toLowerCase().includes(search) ||
                project.team?.toLowerCase().includes(search) ||
                project.contributorType
                    ?.toLowerCase()
                    .includes(search) ||
                project.specialization
                    ?.toLowerCase()
                    .includes(search);

            const matchesStatus =
                statusFilter === "All" ||
                project.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [projects, searchTerm, statusFilter]);

    // ========================================================
    // LOADING STATE
    // ========================================================

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-slate-500">
                    <Loader2 className="h-8 w-8 animate-spin" />

                    <p className="text-sm">
                        Loading assigned projects...
                    </p>
                </div>
            </div>
        );
    }

    // ========================================================
    // ERROR STATE
    // ========================================================

    if (error) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 text-red-600" />

                    <div>
                        <h2 className="font-semibold text-red-800">
                            Unable to Load Projects
                        </h2>

                        <p className="mt-1 text-sm text-red-700">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ========================================================
    // MAIN UI
    // ========================================================

    return (
        <div className="space-y-6">
            {/* ==================================================
                PAGE HEADER
            ================================================== */}

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-blue-100 p-3">
                            <FolderKanban className="h-6 w-6 text-blue-600" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">
                                My Projects
                            </h1>

                            <p className="mt-1 text-sm text-slate-500">
                                View projects assigned to you.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ==================================================
                SEARCH + FILTER
            ================================================== */}

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(event) =>
                                setSearchTerm(event.target.value)
                            }
                            placeholder="Search projects..."
                            className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    {/* Status filter */}
                    <select
                        value={statusFilter}
                        onChange={(event) =>
                            setStatusFilter(event.target.value)
                        }
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                        <option value="All">All Statuses</option>
                        <option value="In Progress">
                            In Progress
                        </option>
                        <option value="Completed">
                            Completed
                        </option>
                        <option value="On Hold">On Hold</option>
                        <option value="Cancelled">
                            Cancelled
                        </option>
                    </select>
                </div>
            </div>

            {/* ==================================================
                NO PROJECTS
            ================================================== */}

            {projects.length === 0 && (
                <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                    <FolderKanban className="mx-auto h-12 w-12 text-slate-300" />

                    <h2 className="mt-4 text-lg font-semibold text-slate-800">
                        No Assigned Projects
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        No projects are currently assigned to you.
                    </p>
                </div>
            )}

            {/* ==================================================
                NO SEARCH RESULTS
            ================================================== */}

            {projects.length > 0 &&
                filteredProjects.length === 0 && (
                    <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                        <Search className="mx-auto h-10 w-10 text-slate-300" />

                        <h2 className="mt-4 text-lg font-semibold text-slate-800">
                            No Projects Found
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                            Try changing your search or filter.
                        </p>
                    </div>
                )}

            {/* ==================================================
                PROJECT TABLE
            ================================================== */}

            {filteredProjects.length > 0 && (
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1100px]">
                            <thead className="bg-slate-50">
                                <tr className="border-b border-slate-200">
                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Project
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Manager
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Team
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Role / Type
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Sprint
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Progress
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Status
                                    </th>

                                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {filteredProjects.map((project) => (
                                    <tr
                                        key={project.id}
                                        className="transition hover:bg-slate-50"
                                    >
                                        {/* Project */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-start gap-3">
                                                <div className="rounded-lg bg-blue-50 p-2">
                                                    <FolderKanban className="h-5 w-5 text-blue-600" />
                                                </div>

                                                <div>
                                                    <p className="font-semibold text-slate-900">
                                                        {project.name}
                                                    </p>

                                                    <p className="mt-1 max-w-xs truncate text-xs text-slate-500">
                                                        {
                                                            project.description
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Manager */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2 text-sm text-slate-700">
                                                <UserRound className="h-4 w-4 text-slate-400" />

                                                {
                                                    project.manager
                                                }
                                            </div>
                                        </td>

                                        {/* Team */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2 text-sm text-slate-700">
                                                <UsersRound className="h-4 w-4 text-slate-400" />

                                                {project.team}
                                            </div>
                                        </td>

                                        {/* Contributor Type */}
                                        <td className="px-5 py-4">
                                            <div>
                                                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                                                    {
                                                        project.contributorType
                                                    }
                                                </span>

                                                {project.specialization && (
                                                    <p className="mt-2 text-xs text-slate-500">
                                                        {
                                                            project.specialization
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </td>

                                        {/* Sprint */}
                                        <td className="px-5 py-4 text-sm text-slate-700">
                                            {project.currentSprint ||
                                                "Not assigned"}
                                        </td>

                                        {/* Progress */}
                                        <td className="px-5 py-4">
                                            <div className="w-28">
                                                <div className="mb-1 flex items-center justify-between">
                                                    <span className="text-xs font-medium text-slate-600">
                                                        {
                                                            project.progress
                                                        }
                                                        %
                                                    </span>
                                                </div>

                                                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                                    <div
                                                        className="h-full rounded-full bg-blue-600 transition-all"
                                                        style={{
                                                            width: `${Math.min(
                                                                Math.max(
                                                                    project.progress ||
                                                                        0,
                                                                    0
                                                                ),
                                                                100
                                                            )}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </td>

                                        {/* Status */}
                                        <td className="px-5 py-4">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                                                    project.status
                                                )}`}
                                            >
                                                {project.status}
                                            </span>
                                        </td>

                                        {/* Action */}
                                        <td className="px-5 py-4 text-right">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setSelectedProject(
                                                        project
                                                    )
                                                }
                                                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700"
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
            )}

            {/* ==================================================
                PROJECT DETAILS MODAL
            ================================================== */}

            {selectedProject && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
                        {/* Modal Header */}
                        <div className="flex items-start justify-between border-b border-slate-200 p-6">
                            <div className="flex items-start gap-3">
                                <div className="rounded-xl bg-blue-100 p-3">
                                    <FolderKanban className="h-6 w-6 text-blue-600" />
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">
                                        {
                                            selectedProject.name
                                        }
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        {
                                            selectedProject.id
                                        }
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedProject(null)
                                }
                                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                                aria-label="Close project details"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="space-y-6 p-6">
                            {/* Description */}
                            <div>
                                <h3 className="mb-2 text-sm font-semibold text-slate-900">
                                    Project Description
                                </h3>

                                <p className="text-sm leading-6 text-slate-600">
                                    {
                                        selectedProject.description
                                    }
                                </p>
                            </div>

                            {/* Status */}
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                <div className="rounded-xl bg-slate-50 p-4">
                                    <p className="text-xs font-medium text-slate-500">
                                        Status
                                    </p>

                                    <span
                                        className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                                            selectedProject.status
                                        )}`}
                                    >
                                        {
                                            selectedProject.status
                                        }
                                    </span>
                                </div>

                                <div className="rounded-xl bg-slate-50 p-4">
                                    <p className="text-xs font-medium text-slate-500">
                                        Manager
                                    </p>

                                    <p className="mt-2 text-sm font-semibold text-slate-800">
                                        {
                                            selectedProject.manager
                                        }
                                    </p>
                                </div>

                                <div className="rounded-xl bg-slate-50 p-4">
                                    <p className="text-xs font-medium text-slate-500">
                                        Team
                                    </p>

                                    <p className="mt-2 text-sm font-semibold text-slate-800">
                                        {selectedProject.team}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-slate-50 p-4">
                                    <p className="text-xs font-medium text-slate-500">
                                        Contributor Type
                                    </p>

                                    <p className="mt-2 text-sm font-semibold text-slate-800">
                                        {
                                            selectedProject.contributorType
                                        }
                                    </p>
                                </div>

                                <div className="rounded-xl bg-slate-50 p-4">
                                    <p className="text-xs font-medium text-slate-500">
                                        Specialization
                                    </p>

                                    <p className="mt-2 text-sm font-semibold text-slate-800">
                                        {
                                            selectedProject.specialization ||
                                            "Not specified"
                                        }
                                    </p>
                                </div>

                                <div className="rounded-xl bg-slate-50 p-4">
                                    <p className="text-xs font-medium text-slate-500">
                                        Current Sprint
                                    </p>

                                    <p className="mt-2 text-sm font-semibold text-slate-800">
                                        {
                                            selectedProject.currentSprint ||
                                            "Not assigned"
                                        }
                                    </p>
                                </div>
                            </div>

                            {/* Progress */}
                            <div className="rounded-xl border border-slate-200 p-5">
                                <div className="mb-3 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-sm font-semibold text-slate-900">
                                            Project Progress
                                        </h3>

                                        <p className="mt-1 text-xs text-slate-500">
                                            Current overall progress
                                        </p>
                                    </div>

                                    <span className="text-lg font-bold text-blue-600">
                                        {
                                            selectedProject.progress
                                        }
                                        %
                                    </span>
                                </div>

                                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                                    <div
                                        className="h-full rounded-full bg-blue-600"
                                        style={{
                                            width: `${Math.min(
                                                Math.max(
                                                    selectedProject.progress ||
                                                        0,
                                                    0
                                                ),
                                                100
                                            )}%`,
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Dates */}
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
                                    <CalendarDays className="h-5 w-5 text-slate-400" />

                                    <div>
                                        <p className="text-xs text-slate-500">
                                            Start Date
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-slate-800">
                                            {formatDate(
                                                selectedProject.startDate
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
                                    <CheckCircle2 className="h-5 w-5 text-slate-400" />

                                    <div>
                                        <p className="text-xs text-slate-500">
                                            Expected Completion
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-slate-800">
                                            {formatDate(
                                                selectedProject.expectedCompletionDate
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex justify-end border-t border-slate-200 bg-slate-50 p-4">
                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedProject(null)
                                }
                                className="rounded-lg bg-slate-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-900"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ViewAssignedProjects;
