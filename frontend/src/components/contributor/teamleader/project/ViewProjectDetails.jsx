
import { useEffect, useState } from "react";
import {
    AlertCircle,
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    ClipboardList,
    FolderKanban,
    Loader2,
    UsersRound,
} from "lucide-react";


const DEMO_PROJECT = {
    id: "PROJ-001",

    name: "AI-Powered Management System",

    description:
        "An AI-powered project management system designed to help organizations manage projects, teams, tasks, sprints, progress, risks, and AI-powered recommendations.",

    status: "In Progress",

    manager: "Project Manager",

    team: {
        name: "Development Team",
        leader: "Team Leader",
        members: 8,
    },

    contributorType: "Developer",

    specialization: "Full-Stack Development",

    currentSprint: {
        name: "Sprint 4",
        goal: "Complete contributor work management and project participation features.",
        startDate: "2026-08-01",
        endDate: "2026-08-15",
        progress: 72,
    },

    progress: 68,

    isArchived: false,

    tasks: [
        {
            id: "TASK-001",
            title: "Implement Staff Work Management",
            assignee: "Staff Member",
            priority: "High",
            status: "Done",
            dueDate: "2026-08-10",
            progress: 100,
        },
        {
            id: "TASK-002",
            title: "Implement Developer Work Management",
            assignee: "Developer",
            priority: "High",
            status: "In Progress",
            dueDate: "2026-08-20",
            progress: 70,
        },
        {
            id: "TASK-003",
            title: "Implement Project Participation",
            assignee: "Developer",
            priority: "Medium",
            status: "In Progress",
            dueDate: "2026-08-25",
            progress: 55,
        },
    ],

    deadlines: [
        {
            title: "Contributor Module",
            date: "2026-08-25",
            type: "Feature",
        },
        {
            title: "Sprint Review",
            date: "2026-08-30",
            type: "Sprint",
        },
        {
            title: "Project Completion",
            date: "2026-09-30",
            type: "Project",
        },
    ],

    files: [
        {
            id: "FILE-001",
            name: "Project Requirements.pdf",
            type: "PDF",
            uploadedBy: "Project Manager",
            uploadDate: "2026-07-10",
        },
        {
            id: "FILE-002",
            name: "System Architecture.docx",
            type: "DOCX",
            uploadedBy: "Developer",
            uploadDate: "2026-07-20",
        },
        {
            id: "FILE-003",
            name: "Project Documentation.pdf",
            type: "PDF",
            uploadedBy: "Team Leader",
            uploadDate: "2026-08-01",
        },
    ],
};

// ============================================================
// HELPERS
// ============================================================

const formatDate = (date) => {
    if (!date) {
        return "Not available";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return date;
    }

    return parsedDate.toLocaleDateString();
};

const getStatusClasses = (status) => {
    switch (status) {
        case "Completed":
        case "Done":
            return "bg-emerald-100 text-emerald-700";

        case "In Progress":
            return "bg-blue-100 text-blue-700";

        case "Review":
            return "bg-purple-100 text-purple-700";

        case "Blocked":
            return "bg-red-100 text-red-700";

        case "On Hold":
            return "bg-amber-100 text-amber-700";

        case "Cancelled":
            return "bg-red-100 text-red-700";

        default:
            return "bg-slate-100 text-slate-700";
    }
};

const getPriorityClasses = (priority) => {
    switch (priority) {
        case "High":
            return "bg-red-100 text-red-700";

        case "Medium":
            return "bg-amber-100 text-amber-700";

        case "Low":
            return "bg-emerald-100 text-emerald-700";

        default:
            return "bg-slate-100 text-slate-700";
    }
};

// ============================================================
// COMPONENT
// ============================================================

function ViewProjectDetails({
    projectId = "PROJ-001",
    onBack,
}) {
    const [project, setProject] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    // ========================================================
    // LOAD PROJECT DETAILS
    // ========================================================

    useEffect(() => {
        let mounted = true;

        const loadProjectDetails = async () => {
            try {
                setLoading(true);
                setError("");

                // ------------------------------------------------
                // TEMPORARY FRONTEND DATA
                // ------------------------------------------------
                //
                // Later replace this with:
                //
                // const result =
                //     await projectService.getProjectDetails(projectId);
                //
                // setProject(result);
                // ------------------------------------------------

                await new Promise((resolve) =>
                    setTimeout(resolve, 400)
                );

                if (!mounted) {
                    return;
                }

                if (!projectId) {
                    setError("Unable to load project details.");
                    return;
                }

                // Simulate project lookup.
                if (projectId !== DEMO_PROJECT.id) {
                    setError(
                        "You do not have permission to view this project."
                    );
                    return;
                }

                setProject(DEMO_PROJECT);
            } catch (err) {
                console.error(
                    "Failed to load project details:",
                    err
                );

                if (mounted) {
                    setError(
                        "Unable to load project details."
                    );
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        loadProjectDetails();

        return () => {
            mounted = false;
        };
    }, [projectId]);

    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-slate-500">
                    <Loader2 className="h-8 w-8 animate-spin" />

                    <p className="text-sm">
                        Loading project details...
                    </p>
                </div>
            </div>
        );
    }

    // ========================================================
    // ERROR
    // ========================================================

    if (error || !project) {
        return (
            <div className="space-y-4">
                {onBack && (
                    <button
                        type="button"
                        onClick={onBack}
                        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                    >
                        <ArrowLeft className="h-4 w-4" />

                        Back to My Projects
                    </button>
                )}

                <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="mt-0.5 h-5 w-5 text-red-600" />

                        <div>
                            <h2 className="font-semibold text-red-800">
                                Unable to Load Project
                            </h2>

                            <p className="mt-1 text-sm text-red-700">
                                {error ||
                                    "Unable to load project details."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ========================================================
    // MAIN PAGE
    // ========================================================

    return (
        <div className="space-y-6">
            {/* ==================================================
                BACK BUTTON
            ================================================== */}

            {onBack && (
                <button
                    type="button"
                    onClick={onBack}
                    className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                >
                    <ArrowLeft className="h-4 w-4" />

                    Back to My Projects
                </button>
            )}

            {/* ==================================================
                PROJECT HEADER
            ================================================== */}

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 p-6">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex items-start gap-4">
                            <div className="rounded-xl bg-blue-100 p-3">
                                <FolderKanban className="h-7 w-7 text-blue-600" />
                            </div>

                            <div>
                                <div className="flex flex-wrap items-center gap-3">
                                    <h1 className="text-2xl font-bold text-slate-900">
                                        {project.name}
                                    </h1>

                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                                            project.status
                                        )}`}
                                    >
                                        {project.status}
                                    </span>

                                    {project.isArchived && (
                                        <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
                                            Archived
                                        </span>
                                    )}
                                </div>

                                <p className="mt-2 text-sm text-slate-500">
                                    Project ID: {project.id}
                                </p>
                            </div>
                        </div>

                        {/* VIEW ONLY NOTICE */}
                        <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
                            <p className="text-xs font-semibold text-blue-800">
                                Contributor Access
                            </p>

                            <p className="mt-1 text-xs text-blue-700">
                                You have authorized view access
                                to this project.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ==================================================
                    DESCRIPTION
                ================================================== */}

                <div className="p-6">
                    <h2 className="text-sm font-semibold text-slate-900">
                        Project Description
                    </h2>

                    <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
                        {project.description}
                    </p>
                </div>
            </div>

            {/* ==================================================
                PROJECT INFORMATION
            ================================================== */}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Manager */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Project Manager
                    </p>

                    <p className="mt-2 font-semibold text-slate-900">
                        {project.manager}
                    </p>
                </div>

                {/* Team */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-2">
                        <UsersRound className="h-4 w-4 text-slate-400" />

                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            Team
                        </p>
                    </div>

                    <p className="mt-2 font-semibold text-slate-900">
                        {project.team.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                        {project.team.members} members
                    </p>
                </div>

                {/* Contributor Type */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Your Type
                    </p>

                    <p className="mt-2 font-semibold text-slate-900">
                        {project.contributorType}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                        {project.specialization}
                    </p>
                </div>

                {/* Team Leader */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Team Leader
                    </p>

                    <p className="mt-2 font-semibold text-slate-900">
                        {project.team.leader}
                    </p>
                </div>
            </div>

            {/* ==================================================
                CURRENT SPRINT
            ================================================== */}

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <ClipboardList className="h-5 w-5 text-blue-600" />

                            <h2 className="text-lg font-semibold text-slate-900">
                                Current Sprint
                            </h2>
                        </div>

                        <p className="mt-2 text-sm font-medium text-slate-800">
                            {project.currentSprint.name}
                        </p>

                        <p className="mt-1 max-w-2xl text-sm text-slate-500">
                            {project.currentSprint.goal}
                        </p>
                    </div>

                    <div className="min-w-[180px]">
                        <div className="mb-2 flex justify-between">
                            <span className="text-xs text-slate-500">
                                Sprint Progress
                            </span>

                            <span className="text-sm font-bold text-blue-600">
                                {
                                    project.currentSprint
                                        .progress
                                }
                                %
                            </span>
                        </div>

                        <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                            <div
                                className="h-full rounded-full bg-blue-600"
                                style={{
                                    width: `${Math.min(
                                        Math.max(
                                            project
                                                .currentSprint
                                                .progress || 0,
                                            0
                                        ),
                                        100
                                    )}%`,
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-5 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2">
                    <div className="flex items-center gap-3">
                        <CalendarDays className="h-5 w-5 text-slate-400" />

                        <div>
                            <p className="text-xs text-slate-500">
                                Sprint Start
                            </p>

                            <p className="mt-1 text-sm font-semibold text-slate-800">
                                {formatDate(
                                    project.currentSprint
                                        .startDate
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <CalendarDays className="h-5 w-5 text-slate-400" />

                        <div>
                            <p className="text-xs text-slate-500">
                                Sprint End
                            </p>

                            <p className="mt-1 text-sm font-semibold text-slate-800">
                                {formatDate(
                                    project.currentSprint
                                        .endDate
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ==================================================
                PROJECT PROGRESS
            ================================================== */}

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                            Project Progress
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Overall progress of the project.
                        </p>
                    </div>

                    <span className="text-2xl font-bold text-blue-600">
                        {project.progress}%
                    </span>
                </div>

                <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                        className="h-full rounded-full bg-blue-600"
                        style={{
                            width: `${Math.min(
                                Math.max(project.progress || 0, 0),
                                100
                            )}%`,
                        }}
                    />
                </div>
            </div>

            {/* ==================================================
                ASSIGNED TASKS
            ================================================== */}

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 p-6">
                    <div className="flex items-center gap-2">
                        <ClipboardList className="h-5 w-5 text-blue-600" />

                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">
                                Assigned Tasks
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Tasks visible to you within this
                                project.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px]">
                        <thead className="bg-slate-50">
                            <tr className="border-b border-slate-200">
                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Task
                                </th>

                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Assignee
                                </th>

                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Priority
                                </th>

                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Status
                                </th>

                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Due Date
                                </th>

                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Progress
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            {project.tasks.map((task) => (
                                <tr
                                    key={task.id}
                                    className="transition hover:bg-slate-50"
                                >
                                    <td className="px-5 py-4">
                                        <p className="font-medium text-slate-900">
                                            {task.title}
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500">
                                            {task.id}
                                        </p>
                                    </td>

                                    <td className="px-5 py-4 text-sm text-slate-700">
                                        {task.assignee}
                                    </td>

                                    <td className="px-5 py-4">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getPriorityClasses(
                                                task.priority
                                            )}`}
                                        >
                                            {task.priority}
                                        </span>
                                    </td>

                                    <td className="px-5 py-4">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                                                task.status
                                            )}`}
                                        >
                                            {task.status}
                                        </span>
                                    </td>

                                    <td className="px-5 py-4 text-sm text-slate-700">
                                        {formatDate(
                                            task.dueDate
                                        )}
                                    </td>

                                    <td className="px-5 py-4">
                                        <div className="w-24">
                                            <div className="mb-1 flex justify-between">
                                                <span className="text-xs font-medium text-slate-600">
                                                    {
                                                        task.progress
                                                    }
                                                    %
                                                </span>
                                            </div>

                                            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                                <div
                                                    className="h-full rounded-full bg-blue-600"
                                                    style={{
                                                        width: `${Math.min(
                                                            Math.max(
                                                                task.progress ||
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
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ==================================================
                IMPORTANT DEADLINES
            ================================================== */}

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5 text-blue-600" />

                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                            Important Deadlines
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Important dates related to this project.
                        </p>
                    </div>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                    {project.deadlines.map((deadline) => (
                        <div
                            key={`${deadline.title}-${deadline.date}`}
                            className="rounded-xl border border-slate-200 p-4"
                        >
                            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                                {deadline.type}
                            </span>

                            <h3 className="mt-3 font-semibold text-slate-900">
                                {deadline.title}
                            </h3>

                            <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                                <CalendarDays className="h-4 w-4" />

                                {formatDate(deadline.date)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ==================================================
                PROJECT FILES
            ================================================== */}

            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 p-6">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Relevant Project Files
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Files authorized for your project
                        participation.
                    </p>
                </div>

                <div className="divide-y divide-slate-100">
                    {project.files.map((file) => (
                        <div
                            key={file.id}
                            className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-slate-100 p-2">
                                    <FolderKanban className="h-5 w-5 text-slate-500" />
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-slate-900">
                                        {file.name}
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        {file.type} • Uploaded by{" "}
                                        {file.uploadedBy}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="text-xs text-slate-500">
                                    {formatDate(
                                        file.uploadDate
                                    )}
                                </span>

                                {/* View-only action.
                                    Actual download/view API will
                                    be connected later. */}
                                <button
                                    type="button"
                                    className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700"
                                >
                                    View
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ==================================================
                ARCHIVED PROJECT NOTICE
            ================================================== */}

            {project.isArchived && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="mt-0.5 h-5 w-5 text-amber-600" />

                        <div>
                            <h3 className="font-semibold text-amber-800">
                                Archived Project
                            </h3>

                            <p className="mt-1 text-sm text-amber-700">
                                This project is archived. You can
                                view permitted historical
                                information, but modification of
                                archived project information is
                                not allowed.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* ==================================================
                VIEW-ONLY BUSINESS RULE
            ================================================== */}

            <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
                <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-blue-600" />

                    <div>
                        <h3 className="font-semibold text-blue-900">
                            Project Participation Access
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-blue-800">
                            As a Contributor, you can view the
                            project context needed to perform your
                            assigned work. Project creation,
                            deletion, archiving, ownership changes,
                            team changes, and contributor
                            assignment remain management-level
                            actions.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewProjectDetails;
