import { useEffect, useMemo, useState } from "react";
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

import api from "../../../../services/api";

// ============================================================
// STAFF - VIEW ASSIGNED PROJECTS
// STAFF-PROJECT-001
//
// Backend:
// GET /api/projects/my-developer-projects
//
// Important:
// - Projects are loaded from the backend/database.
// - No localStorage is used for project data.
// - api.js supplies the authenticated JWT.
// - UI is intentionally kept unchanged.
// ============================================================

// ============================================================
// HELPERS
// ============================================================

function getValue(object, ...keys) {
    for (const key of keys) {
        if (
            object &&
            object[key] !== undefined &&
            object[key] !== null
        ) {
            return object[key];
        }
    }

    return "";
}

function normalizeProjects(responseData) {
    // Supports both:
    //
    // 1. Direct array:
    //    [...]
    //
    // 2. Wrapped response:
    //    { data: [...] }
    //
    // 3. Wrapped response:
    //    { projects: [...] }

    if (Array.isArray(responseData)) {
        return responseData;
    }

    if (Array.isArray(responseData?.data)) {
        return responseData.data;
    }

    if (Array.isArray(responseData?.projects)) {
        return responseData.projects;
    }

    return [];
}

// ============================================================
// COMPONENT
// ============================================================

function ViewAssignedProjects() {
    const [projects, setProjects] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");

    const [loading, setLoading] = useState(true);

    const [refreshing, setRefreshing] = useState(false);

    const [error, setError] = useState("");

    // ============================================================
    // LOAD ASSIGNED PROJECTS FROM BACKEND
    //
    // GET /api/projects/my-developer-projects
    // ============================================================

    const loadProjects = async (showRefreshState = false) => {
        try {
            if (showRefreshState) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const response = await api.get(
                "/projects/my-developer-projects"
            );

            const backendProjects = normalizeProjects(
                response.data
            );

            setProjects(backendProjects);
        } catch (error) {
            console.error(
                "Failed to load assigned projects:",
                error
            );

            const errorMessage =
                error?.response?.data?.message ||
                error?.response?.data?.Message ||
                "Unable to load your assigned projects.";

            setError(errorMessage);

            setProjects([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // ============================================================
    // LOAD PROJECTS WHEN COMPONENT OPENS
    // ============================================================

    useEffect(() => {
        loadProjects();
    }, []);

    // ============================================================
    // SEARCH / FILTER
    // ============================================================

    const filteredProjects = useMemo(() => {
        const search = searchTerm.trim().toLowerCase();

        if (!search) {
            return projects;
        }

        return projects.filter((project) => {
            const projectName = String(
                getValue(
                    project,
                    "name",
                    "projectName",
                    "Name",
                    "ProjectName"
                )
            );

            const description = String(
                getValue(
                    project,
                    "description",
                    "Description"
                )
            );

            const organization = String(
                getValue(
                    project,
                    "organization",
                    "organizationName",
                    "Organization",
                    "OrganizationName"
                )
            );

            const manager = String(
                getValue(
                    project,
                    "manager",
                    "managerName",
                    "Manager",
                    "ManagerName"
                )
            );

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
    //
    // No localStorage.
    //
    // The project object is passed to the selected-project
    // handler only if a parent later provides one.
    //
    // For now, preserve the existing user interaction.
    // ============================================================

    const handleViewProject = (project) => {
        console.log(
            "Selected staff project:",
            project
        );

        alert(
            "Project selected. Open the View Project Details use case to see the project information."
        );
    };

    // ============================================================
    // LOADING STATE
    // ============================================================

    if (loading) {
        return (
            <div className="w-full">
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
                </div>

                <div className="rounded-2xl border border-border bg-card p-10 text-center">
                    <RefreshCw className="mx-auto mb-4 h-7 w-7 animate-spin text-primary" />

                    <h2 className="mb-2 text-lg font-semibold text-card-foreground">
                        Loading Assigned Projects
                    </h2>

                    <p className="text-sm text-muted-foreground">
                        Loading your assigned projects from the
                        server...
                    </p>
                </div>
            </div>
        );
    }

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
                    onClick={() => loadProjects(true)}
                    disabled={refreshing}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <RefreshCw
                        className={`h-4 w-4 ${
                            refreshing
                                ? "animate-spin"
                                : ""
                        }`}
                    />

                    {refreshing
                        ? "Refreshing..."
                        : "Refresh"}
                </button>

            </div>

            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (
                <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-800/60 bg-red-950/30 p-4 text-sm text-red-300">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

                    <div>
                        <p className="font-medium">
                            Unable to load assigned projects
                        </p>

                        <p className="mt-1">
                            {error}
                        </p>
                    </div>
                </div>
            )}

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
                            setSearchTerm(
                                event.target.value
                            )
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

                    {filteredProjects.map(
                        (project, index) => {

                            const projectName =
                                getValue(
                                    project,
                                    "name",
                                    "projectName",
                                    "Name",
                                    "ProjectName"
                                ) ||
                                `Project ${index + 1}`;

                            const description =
                                getValue(
                                    project,
                                    "description",
                                    "Description"
                                ) ||
                                "No project description available.";

                            const manager =
                                getValue(
                                    project,
                                    "manager",
                                    "managerName",
                                    "Manager",
                                    "ManagerName"
                                ) ||
                                "Not assigned";

                            const organization =
                                getValue(
                                    project,
                                    "organization",
                                    "organizationName",
                                    "Organization",
                                    "OrganizationName"
                                ) ||
                                "Not specified";

                            const startDate =
                                getValue(
                                    project,
                                    "startDate",
                                    "startDateTime",
                                    "StartDate",
                                    "StartDateTime"
                                );

                            const endDate =
                                getValue(
                                    project,
                                    "endDate",
                                    "endDateTime",
                                    "EndDate",
                                    "EndDateTime"
                                );

                            const projectStatus =
                                getValue(
                                    project,
                                    "status",
                                    "projectStatus",
                                    "Status",
                                    "ProjectStatus"
                                ) ||
                                "Active";

                            const projectId =
                                getValue(
                                    project,
                                    "id",
                                    "projectId",
                                    "Id",
                                    "ProjectId"
                                );

                            return (
                                <div
                                    key={
                                        projectId ||
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
                                                {formatDate(
                                                    startDate
                                                )}

                                                {" → "}

                                                {formatDate(
                                                    endDate
                                                )}
                                            </span>

                                        </div>

                                    </div>

                                    {/* ACTION */}

                                    <div className="mt-5">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleViewProject(
                                                    project
                                                )
                                            }
                                            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-primary/50 bg-primary/10 px-4 py-2.5 text-sm font-medium text-primary transition hover:bg-primary hover:text-primary-foreground"
                                        >
                                            <Eye className="h-4 w-4" />

                                            View Project
                                        </button>

                                    </div>

                                </div>
                            );
                        }
                    )}

                </div>
            )}

        </div>
    );
}

export default ViewAssignedProjects;