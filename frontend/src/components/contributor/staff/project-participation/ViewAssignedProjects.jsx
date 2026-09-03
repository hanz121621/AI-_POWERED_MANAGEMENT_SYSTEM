
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
        <div className="w-full">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div>

                    <div className="flex items-center gap-3">

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                            <FolderKanban className="h-7 w-7 text-primary" />
                        </div>

                        <div>

                            <h1 className="text-2xl font-bold text-foreground">
                                Assigned Projects
                            </h1>

                            <p className="text-sm text-muted-foreground">
                                View projects assigned to you.
                            </p>

                        </div>

                    </div>

                </div>

                <button
                    type="button"
                    onClick={loadProjects}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                </button>

            </div>

            {/* ==================================================
                SEARCH
            ================================================== */}

            <div className="mb-6">

                <div className="relative">

                    <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(event) =>
                            setSearchTerm(event.target.value)
                        }
                        placeholder="Search assigned projects..."
                        className="w-full rounded-xl border border-border bg-card py-3 pl-11 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20"
                    />

                </div>

            </div>

            {/* ==================================================
                PROJECT COUNT
            ================================================== */}

            <div className="mb-4 text-sm text-muted-foreground">

                Showing{" "}

                <span className="font-semibold text-foreground">
                    {filteredProjects.length}
                </span>{" "}

                {filteredProjects.length === 1
                    ? "project"
                    : "projects"}

            </div>

            {/* ==================================================
                EMPTY STATE
            ================================================== */}

            {filteredProjects.length === 0 && (
                <div className="rounded-2xl border border-border bg-card p-10 text-center">

                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">

                        <AlertCircle className="h-7 w-7 text-muted-foreground" />

                    </div>

                    <h2 className="mb-2 text-lg font-semibold text-card-foreground">
                        No Assigned Projects
                    </h2>

                    <p className="text-sm text-muted-foreground">
                        {searchTerm
                            ? "No projects match your search."
                            : "You currently have no assigned projects."}
                    </p>

                </div>
            )}

            {/* ==================================================
                PROJECTS
            ================================================== */}

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
                                className="rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:border-primary/50"
                            >

                                {/* PROJECT HEADER */}

                                <div className="mb-4 flex items-start justify-between gap-4">

                                    <div className="flex items-start gap-3">

                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">

                                            <FolderKanban className="h-6 w-6 text-primary" />

                                        </div>

                                        <div>

                                            <h2 className="font-semibold text-card-foreground">
                                                {projectName}
                                            </h2>

                                            <span className="mt-1 inline-block rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                                                {projectStatus}
                                            </span>

                                        </div>

                                    </div>

                                </div>

                                {/* DESCRIPTION */}

                                <p className="mb-5 line-clamp-3 text-sm leading-6 text-muted-foreground">
                                    {description}
                                </p>

                                {/* PROJECT INFORMATION */}

                                <div className="space-y-3 border-t border-border pt-4">

                                    <div className="flex items-center gap-3 text-sm">

                                        <UserRound className="h-4 w-4 text-muted-foreground" />

                                        <span className="text-muted-foreground">
                                            Manager:
                                        </span>

                                        <span className="text-card-foreground">
                                            {manager}
                                        </span>

                                    </div>

                                    <div className="flex items-center gap-3 text-sm">

                                        <Building2 className="h-4 w-4 text-muted-foreground" />

                                        <span className="text-muted-foreground">
                                            Organization:
                                        </span>

                                        <span className="text-card-foreground">
                                            {organization}
                                        </span>

                                    </div>

                                    <div className="flex items-center gap-3 text-sm">

                                        <CalendarDays className="h-4 w-4 text-muted-foreground" />

                                        <span className="text-muted-foreground">
                                            Dates:
                                        </span>

                                        <span className="text-card-foreground">
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
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-primary/50 bg-primary/10 px-4 py-2.5 text-sm font-medium text-primary transition hover:bg-primary hover:text-primary-foreground"
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
