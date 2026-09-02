
import { useMemo, useState } from "react";
import {
    FolderKanban,
    Search,
    RefreshCw,
    CalendarDays,
    UserRound,
    Building2,
    Eye,
    AlertCircle,
} from "lucide-react";

// ============================================================
// STAFF - VIEW ASSIGNED PROJECTS
// STAFF-PROJECT-001
// ============================================================

function getStoredProjects() {
    try {
        const storedProjects =
            localStorage.getItem("aipms_staff_projects") ||
            localStorage.getItem("staffProjects");

        if (!storedProjects) {
            return [];
        }

        const parsedProjects = JSON.parse(storedProjects);

        return Array.isArray(parsedProjects) ? parsedProjects : [];
    } catch (error) {
        console.error("Failed to load assigned projects:", error);
        return [];
    }
}

function ViewAssignedProjects() {
    const [projects, setProjects] = useState(getStoredProjects);
    const [searchTerm, setSearchTerm] = useState("");

    // ============================================================
    // REFRESH PROJECTS
    // ============================================================

    const loadProjects = () => {
        setProjects(getStoredProjects());
    };

    // ============================================================
    // SEARCH / FILTER
    // ============================================================

    const filteredProjects = useMemo(() => {
        const search = searchTerm.trim().toLowerCase();

        if (!search) {
            return projects;
        }

        return projects.filter((project) => {
            const projectName =
                project.name ||
                project.projectName ||
                "";

            const description =
                project.description ||
                "";

            const organization =
                project.organization ||
                project.organizationName ||
                "";

            const manager =
                project.manager ||
                project.managerName ||
                "";

            return (
                projectName.toLowerCase().includes(search) ||
                description.toLowerCase().includes(search) ||
                organization.toLowerCase().includes(search) ||
                manager.toLowerCase().includes(search)
            );
        });
    }, [searchTerm, projects]);

    // ============================================================
    // FORMAT DATE
    // ============================================================

    const formatDate = (dateValue) => {
        if (!dateValue) {
            return "Not specified";
        }

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return "Not specified";
        }

        return date.toLocaleDateString();
    };

    // ============================================================
    // VIEW PROJECT
    // ============================================================

    const handleViewProject = (project) => {
        localStorage.setItem(
            "aipms_selected_staff_project",
            JSON.stringify(project)
        );

        localStorage.setItem(
            "selectedProject",
            JSON.stringify(project)
        );

        alert(
            "Project selected. Open the View Project Details use case to see the project information."
        );
    };

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <div className="min-h-full bg-slate-950 p-6 text-white">
            {/* HEADER */}
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-blue-600/20 p-3">
                            <FolderKanban className="h-7 w-7 text-blue-400" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold">
                                Assigned Projects
                            </h1>

                            <p className="text-sm text-slate-400">
                                View projects assigned to you.
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={loadProjects}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium transition hover:bg-blue-700"
                >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                </button>
            </div>

            {/* SEARCH */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(event) =>
                            setSearchTerm(event.target.value)
                        }
                        placeholder="Search assigned projects..."
                        className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500"
                    />
                </div>
            </div>

            {/* PROJECT COUNT */}
            <div className="mb-4 text-sm text-slate-400">
                Showing{" "}
                <span className="font-semibold text-white">
                    {filteredProjects.length}
                </span>{" "}
                {filteredProjects.length === 1
                    ? "project"
                    : "projects"}
            </div>

            {/* EMPTY STATE */}
            {filteredProjects.length === 0 && (
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-800">
                        <AlertCircle className="h-7 w-7 text-slate-500" />
                    </div>

                    <h2 className="mb-2 text-lg font-semibold">
                        No Assigned Projects
                    </h2>

                    <p className="text-sm text-slate-400">
                        {searchTerm
                            ? "No projects match your search."
                            : "You currently have no assigned projects."}
                    </p>
                </div>
            )}

            {/* PROJECTS */}
            {filteredProjects.length > 0 && (
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    {filteredProjects.map((project, index) => {
                        const projectName =
                            project.name ||
                            project.projectName ||
                            `Project ${index + 1}`;

                        const description =
                            project.description ||
                            "No project description available.";

                        const manager =
                            project.manager ||
                            project.managerName ||
                            "Not assigned";

                        const organization =
                            project.organization ||
                            project.organizationName ||
                            "Not specified";

                        const startDate =
                            project.startDate ||
                            project.startDateTime;

                        const endDate =
                            project.endDate ||
                            project.endDateTime;

                        const projectStatus =
                            project.status ||
                            project.projectStatus ||
                            "Active";

                        return (
                            <div
                                key={
                                    project.id ||
                                    project.projectId ||
                                    index
                                }
                                className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg transition hover:border-blue-700/50"
                            >
                                {/* PROJECT HEADER */}
                                <div className="mb-4 flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-3">
                                        <div className="rounded-xl bg-blue-600/20 p-3">
                                            <FolderKanban className="h-6 w-6 text-blue-400" />
                                        </div>

                                        <div>
                                            <h2 className="font-semibold text-white">
                                                {projectName}
                                            </h2>

                                            <span className="mt-1 inline-block rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-400">
                                                {projectStatus}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* DESCRIPTION */}
                                <p className="mb-5 line-clamp-3 text-sm leading-6 text-slate-400">
                                    {description}
                                </p>

                                {/* PROJECT INFORMATION */}
                                <div className="space-y-3 border-t border-slate-800 pt-4">
                                    <div className="flex items-center gap-3 text-sm">
                                        <UserRound className="h-4 w-4 text-slate-500" />

                                        <span className="text-slate-400">
                                            Manager:
                                        </span>

                                        <span className="text-slate-200">
                                            {manager}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3 text-sm">
                                        <Building2 className="h-4 w-4 text-slate-500" />

                                        <span className="text-slate-400">
                                            Organization:
                                        </span>

                                        <span className="text-slate-200">
                                            {organization}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3 text-sm">
                                        <CalendarDays className="h-4 w-4 text-slate-500" />

                                        <span className="text-slate-400">
                                            Dates:
                                        </span>

                                        <span className="text-slate-200">
                                            {formatDate(startDate)}
                                            {" → "}
                                            {formatDate(endDate)}
                                        </span>
                                    </div>
                                </div>

                                {/* ACTION */}
                                <div className="mt-5">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleViewProject(project)
                                        }
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-blue-600/50 bg-blue-600/10 px-4 py-2.5 text-sm font-medium text-blue-400 transition hover:bg-blue-600 hover:text-white"
                                    >
                                        <Eye className="h-4 w-4" />
                                        View Project
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default ViewAssignedProjects;
