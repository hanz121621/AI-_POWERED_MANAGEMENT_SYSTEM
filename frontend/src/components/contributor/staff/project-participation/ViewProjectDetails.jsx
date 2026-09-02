
import { useState } from "react";
import {
    FolderKanban,
    UserRound,
    Building2,
    CalendarDays,
    Target,
    UsersRound,
    RefreshCw,
    AlertCircle,
    CheckCircle2,
    Clock3,
    CircleCheck,
    FileText,
    Flag,
} from "lucide-react";

// ============================================================
// STORAGE KEYS
// ============================================================

const SELECTED_PROJECT_KEY =
    "aipms_selected_staff_project";

const OLD_SELECTED_PROJECT_KEY =
    "selectedProject";

// ============================================================
// HELPERS
// ============================================================

function getStoredProject() {
    try {
        const stored =
            localStorage.getItem(
                SELECTED_PROJECT_KEY
            ) ||
            localStorage.getItem(
                OLD_SELECTED_PROJECT_KEY
            );

        if (!stored) {
            return null;
        }

        return JSON.parse(stored);
    } catch {
        return null;
    }
}

function getProjectName(project) {
    return (
        project?.name ||
        project?.projectName ||
        project?.title ||
        project?.projectTitle ||
        "Untitled Project"
    );
}

function getProjectDescription(project) {
    return (
        project?.description ||
        project?.projectDescription ||
        "No project description available."
    );
}

function getProjectStatus(project) {
    return (
        project?.status ||
        project?.projectStatus ||
        "Not Started"
    );
}

function getProjectManager(project) {
    return (
        project?.managerName ||
        project?.manager ||
        project?.projectManager ||
        project?.ManagerName ||
        "Not assigned"
    );
}

function getOrganization(project) {
    return (
        project?.organizationName ||
        project?.organization ||
        project?.OrganizationName ||
        "Not assigned"
    );
}

function getProjectId(project) {
    return (
        project?.id ??
        project?.projectId ??
        project?.ProjectId ??
        project?.Id ??
        "N/A"
    );
}

function getStartDate(project) {
    return (
        project?.startDate ||
        project?.projectStartDate ||
        project?.StartDate ||
        null
    );
}

function getEndDate(project) {
    return (
        project?.endDate ||
        project?.projectEndDate ||
        project?.EndDate ||
        null
    );
}

function getProjectProgress(project) {
    const progress =
        project?.progress ??
        project?.completionPercentage ??
        project?.percentageComplete ??
        0;

    const numericProgress = Number(progress);

    if (Number.isNaN(numericProgress)) {
        return 0;
    }

    return Math.min(
        100,
        Math.max(0, numericProgress)
    );
}

function getProjectGoal(project) {
    return (
        project?.goal ||
        project?.projectGoal ||
        project?.objective ||
        project?.projectObjective ||
        "No project goal has been provided."
    );
}

function getProjectPriority(project) {
    return (
        project?.priority ||
        project?.projectPriority ||
        "Normal"
    );
}

function getTeamMembers(project) {
    const members =
        project?.teamMembers ||
        project?.members ||
        project?.team ||
        [];

    return Array.isArray(members) ? members : [];
}

function getMemberName(member) {
    if (typeof member === "string") {
        return member;
    }

    return (
        member?.fullName ||
        member?.name ||
        member?.userName ||
        member?.username ||
        "Team Member"
    );
}

function getMemberRole(member) {
    if (typeof member === "string") {
        return "Team Member";
    }

    return (
        member?.role ||
        member?.userRole ||
        "Team Member"
    );
}

function formatDate(dateValue) {
    if (!dateValue) {
        return "Not set";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "Not set";
    }

    return date.toLocaleDateString();
}

// ============================================================
// STATUS STYLE
// ============================================================

function getStatusStyle(status) {
    const normalized = String(status)
        .toLowerCase()
        .trim();

    if (
        normalized.includes("completed") ||
        normalized.includes("complete") ||
        normalized.includes("finished")
    ) {
        return {
            classes:
                "border-primary/30 bg-primary/10 text-primary",
            icon: CircleCheck,
        };
    }

    if (
        normalized.includes("progress") ||
        normalized.includes("active") ||
        normalized.includes("ongoing")
    ) {
        return {
            classes:
                "border-primary/30 bg-primary/10 text-primary",
            icon: Clock3,
        };
    }

    if (
        normalized.includes("blocked") ||
        normalized.includes("cancel")
    ) {
        return {
            classes:
                "border-border bg-muted text-muted-foreground",
            icon: AlertCircle,
        };
    }

    return {
        classes:
            "border-border bg-muted text-muted-foreground",
        icon: Clock3,
    };
}

// ============================================================
// MAIN COMPONENT
// ============================================================

function ViewProjectDetails() {
    const [project, setProject] =
        useState(getStoredProject);

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");

    // ========================================================
    // REFRESH
    // ========================================================

    const handleRefresh = () => {
        const updatedProject =
            getStoredProject();

        setProject(updatedProject);

        setError("");

        if (updatedProject) {
            setMessage(
                "Project details refreshed."
            );
        } else {
            setMessage(
                "No project has been selected."
            );
        }

        setTimeout(() => {
            setMessage("");
        }, 2500);
    };

    // ========================================================
    // EMPTY STATE
    // ========================================================

    if (!project) {
        return (
            <div className="w-full space-y-6">

                {/* HEADER */}

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                    <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                            <FolderKanban
                                size={24}
                                className="text-primary"
                            />
                        </div>

                        <div>

                            <h2 className="text-xl font-bold text-foreground">
                                View Project Details
                            </h2>

                            <p className="text-sm text-muted-foreground">
                                View detailed information about
                                your assigned project.
                            </p>

                        </div>

                    </div>

                    <button
                        type="button"
                        onClick={handleRefresh}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
                    >
                        <RefreshCw size={16} />
                        Refresh
                    </button>

                </div>

                {/* ERROR */}

                {error && (
                    <div className="flex items-center gap-2 rounded-xl border border-border bg-muted px-4 py-3 text-sm text-muted-foreground">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                {/* EMPTY */}

                <div className="rounded-2xl border border-border bg-card p-12 text-center">

                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">

                        <FolderKanban
                            size={30}
                            className="text-primary"
                        />

                    </div>

                    <h3 className="text-lg font-semibold text-card-foreground">
                        No Project Selected
                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                        Please select a project from
                        "View Assigned Projects" first. The
                        selected project will appear here.
                    </p>

                </div>

            </div>
        );
    }

    // ========================================================
    // PROJECT DATA
    // ========================================================

    const projectId =
        getProjectId(project);

    const projectName =
        getProjectName(project);

    const projectDescription =
        getProjectDescription(project);

    const projectStatus =
        getProjectStatus(project);

    const projectManager =
        getProjectManager(project);

    const organization =
        getOrganization(project);

    const projectGoal =
        getProjectGoal(project);

    const projectPriority =
        getProjectPriority(project);

    const progress =
        getProjectProgress(project);

    const teamMembers =
        getTeamMembers(project);

    const statusStyle =
        getStatusStyle(projectStatus);

    const StatusIcon =
        statusStyle.icon;

    // ========================================================
    // UI
    // ========================================================

    return (
        <div className="w-full space-y-6">

            {/* HEADER */}

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                        <FolderKanban
                            size={24}
                            className="text-primary"
                        />
                    </div>

                    <div>

                        <h2 className="text-xl font-bold text-foreground">
                            View Project Details
                        </h2>

                        <p className="text-sm text-muted-foreground">
                            Detailed information about your
                            assigned project.
                        </p>

                    </div>

                </div>

                <button
                    type="button"
                    onClick={handleRefresh}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
                >
                    <RefreshCw size={16} />
                    Refresh
                </button>

            </div>

            {/* SUCCESS */}

            {message && (
                <div className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
                    <CheckCircle2 size={18} />
                    {message}
                </div>
            )}

            {/* ERROR */}

            {error && (
                <div className="flex items-center gap-2 rounded-xl border border-border bg-muted px-4 py-3 text-sm text-muted-foreground">
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}

            {/* PROJECT HERO */}

            <div className="rounded-2xl border border-border bg-card p-6">

                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                    <div className="flex items-start gap-4">

                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10">

                            <FolderKanban
                                size={26}
                                className="text-primary"
                            />

                        </div>

                        <div>

                            <div className="flex flex-wrap items-center gap-3">

                                <h2 className="text-2xl font-bold text-card-foreground">
                                    {projectName}
                                </h2>

                                <span
                                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${statusStyle.classes}`}
                                >
                                    <StatusIcon
                                        size={14}
                                    />

                                    {projectStatus}
                                </span>

                            </div>

                            <p className="mt-2 text-sm text-muted-foreground">
                                Project ID:{" "}
                                {String(projectId)}
                            </p>

                        </div>

                    </div>

                    <div className="flex items-center gap-2 rounded-lg border border-border bg-muted px-3 py-2">

                        <Flag
                            size={16}
                            className="text-primary"
                        />

                        <span className="text-xs text-muted-foreground">
                            Priority:
                        </span>

                        <span className="text-sm font-medium text-foreground">
                            {projectPriority}
                        </span>

                    </div>

                </div>

            </div>

            {/* OVERVIEW */}

            <div className="grid gap-6 lg:grid-cols-3">

                {/* DESCRIPTION */}

                <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-2">

                    <div className="mb-4 flex items-center gap-3">

                        <div className="rounded-lg bg-primary/10 p-2">

                            <FileText
                                size={19}
                                className="text-primary"
                            />

                        </div>

                        <h3 className="font-semibold text-card-foreground">
                            Project Overview
                        </h3>

                    </div>

                    <p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
                        {projectDescription}
                    </p>

                </div>

                {/* PROJECT INFO */}

                <div className="rounded-2xl border border-border bg-card p-6">

                    <h3 className="mb-5 font-semibold text-card-foreground">
                        Project Information
                    </h3>

                    <div className="space-y-5">

                        <div className="flex items-start gap-3">

                            <UserRound
                                size={18}
                                className="mt-0.5 text-muted-foreground"
                            />

                            <div>

                                <p className="text-xs text-muted-foreground">
                                    Project Manager
                                </p>

                                <p className="mt-1 text-sm font-medium text-card-foreground">
                                    {projectManager}
                                </p>

                            </div>

                        </div>

                        <div className="flex items-start gap-3">

                            <Building2
                                size={18}
                                className="mt-0.5 text-muted-foreground"
                            />

                            <div>

                                <p className="text-xs text-muted-foreground">
                                    Organization
                                </p>

                                <p className="mt-1 text-sm font-medium text-card-foreground">
                                    {organization}
                                </p>

                            </div>

                        </div>

                        <div className="flex items-start gap-3">

                            <CalendarDays
                                size={18}
                                className="mt-0.5 text-muted-foreground"
                            />

                            <div>

                                <p className="text-xs text-muted-foreground">
                                    Start Date
                                </p>

                                <p className="mt-1 text-sm font-medium text-card-foreground">
                                    {formatDate(
                                        getStartDate(
                                            project
                                        )
                                    )}
                                </p>

                            </div>

                        </div>

                        <div className="flex items-start gap-3">

                            <CalendarDays
                                size={18}
                                className="mt-0.5 text-muted-foreground"
                            />

                            <div>

                                <p className="text-xs text-muted-foreground">
                                    End Date
                                </p>

                                <p className="mt-1 text-sm font-medium text-card-foreground">
                                    {formatDate(
                                        getEndDate(
                                            project
                                        )
                                    )}
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

            {/* GOAL */}

            <div className="rounded-2xl border border-border bg-card p-6">

                <div className="mb-4 flex items-center gap-3">

                    <div className="rounded-lg bg-primary/10 p-2">

                        <Target
                            size={19}
                            className="text-primary"
                        />

                    </div>

                    <h3 className="font-semibold text-card-foreground">
                        Project Goal
                    </h3>

                </div>

                <p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
                    {projectGoal}
                </p>

            </div>

            {/* PROGRESS */}

            <div className="rounded-2xl border border-border bg-card p-6">

                <div className="mb-4 flex items-center justify-between">

                    <div>

                        <h3 className="font-semibold text-card-foreground">
                            Project Progress
                        </h3>

                        <p className="mt-1 text-xs text-muted-foreground">
                            Current project completion
                        </p>

                    </div>

                    <span className="text-xl font-bold text-primary">
                        {progress}%
                    </span>

                </div>

                <div className="h-3 overflow-hidden rounded-full bg-muted">

                    <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{
                            width: `${progress}%`,
                        }}
                    />

                </div>

            </div>

            {/* TEAM MEMBERS */}

            <div className="rounded-2xl border border-border bg-card p-6">

                <div className="mb-5 flex items-center gap-3">

                    <div className="rounded-lg bg-primary/10 p-2">

                        <UsersRound
                            size={19}
                            className="text-primary"
                        />

                    </div>

                    <div>

                        <h3 className="font-semibold text-card-foreground">
                            Team Members
                        </h3>

                        <p className="text-xs text-muted-foreground">
                            Members participating in this
                            project.
                        </p>

                    </div>

                </div>

                {teamMembers.length === 0 ? (

                    <div className="rounded-xl border border-dashed border-border bg-muted p-8 text-center">

                        <UsersRound
                            size={30}
                            className="mx-auto mb-3 text-muted-foreground"
                        />

                        <p className="text-sm text-muted-foreground">
                            No team members have been added
                            to this project yet.
                        </p>

                    </div>

                ) : (

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

                        {teamMembers.map(
                            (member, index) => (

                                <div
                                    key={`${getMemberName(
                                        member
                                    )}-${index}`}
                                    className="flex items-center gap-3 rounded-xl border border-border bg-muted p-4"
                                >

                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">

                                        <UserRound
                                            size={17}
                                            className="text-primary"
                                        />

                                    </div>

                                    <div className="min-w-0">

                                        <p className="truncate text-sm font-semibold text-card-foreground">
                                            {getMemberName(
                                                member
                                            )}
                                        </p>

                                        <p className="mt-1 truncate text-xs text-muted-foreground">
                                            {getMemberRole(
                                                member
                                            )}
                                        </p>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </div>

        </div>
    );
}

export default ViewProjectDetails;
