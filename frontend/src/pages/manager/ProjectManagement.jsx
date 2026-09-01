// ============================================================
// AIPMS — MANAGER PROJECT MANAGEMENT
//
// PM-001 — Create Project Specification
// PM-002 — Update Project Specification
// PM-003 — Delete Project Specification
// PM-004 — View Assigned Projects
// PM-005 — Update Project Timeline
// PM-006 — Set / Update Project Deadline
// PM-007 — Manage Project Status
//
// Colorful Professional UI
// ============================================================

import React, { useMemo, useState } from "react";

import {
    FolderKanban,
    CheckCircle,
    Clock,
    AlertTriangle,
    Eye,
    FilePlus2,
    FilePenLine,
    Trash2,
    CalendarRange,
    CalendarClock,
    CircleDot,
} from "lucide-react";

// ============================================================
// PROJECT COMPONENTS
// ============================================================

import ProjectStatsCard from "../../components/manager/project/ProjectStatsCard";
import ProjectCard from "../../components/manager/project/ProjectCard";

// ============================================================
// PROJECT USE CASE MODALS
// ============================================================

import CreateProjectSpecificationModal from "../../components/manager/project/CreateProjectSpecificationModal";
import UpdateProjectSpecificationModal from "../../components/manager/project/UpdateProjectSpecificationModal";
import DeleteProjectSpecificationModal from "../../components/manager/project/DeleteProjectSpecificationModal";
import ViewAssignedProjectModal from "../../components/manager/project/ViewAssignedProjectModal";
import UpdateTimelineProjectModal from "../../components/manager/project/UpdateTimelineProjectModal";
import SetUpdateProjectDeadlineModal from "../../components/manager/project/SetUpdateProjectDeadlineModal";
import ManageProjectStatusModal from "../../components/manager/project/ManageProjectStatusModal";

// ============================================================
// COMPONENT
// ============================================================

function ProjectManagement() {
    // ========================================================
    // CURRENT MANAGER
    // ========================================================

    const currentManager = {
        id: "current-manager",
        name: "Current Manager",
    };

    // ========================================================
    // PROJECTS
    // ========================================================

    const [projects, setProjects] = useState([
        {
            id: 1,

            name: "AI-Powered Project Management System",

            description:
                "AI based project planning, monitoring and collaboration platform.",

            status: "Active",

            progress: 75,

            startDate: "August 1, 2026",

            deadline: "August 30, 2026",

            team: 12,

            teamName: "AIPMS Development Team",

            managerId: "current-manager",

            hasSpecification: true,

            specification: {
                objectives:
                    "Build an AI-powered project management platform.",

                scope:
                    "Project planning, task management, monitoring and reporting.",

                functionalRequirements:
                    "User management, projects, tasks, sprints and reports.",

                nonFunctionalRequirements:
                    "Security, reliability, scalability and usability.",

                deliverables:
                    "Working AIPMS web application.",

                technologyStack:
                    "React, Vite, Tailwind CSS, .NET and PostgreSQL.",

                assumptions:
                    "Users have valid accounts and authorized access.",

                constraints:
                    "Development time and available resources.",
            },

            hasActiveSprint: true,
        },

        {
            id: 2,

            name: "FieldSync",

            description:
                "Offline-first rural reporting and data synchronization system.",

            status: "Planning",

            progress: 40,

            startDate: "September 1, 2026",

            deadline: "October 15, 2026",

            team: 8,

            teamName: "FieldSync Team",

            managerId: "current-manager",

            hasSpecification: false,

            specification: null,

            hasActiveSprint: false,
        },

        {
            id: 3,

            name: "Library Management System",

            description:
                "University library automation system.",

            status: "Completed",

            progress: 100,

            startDate: "June 1, 2026",

            deadline: "July 20, 2026",

            team: 5,

            teamName: "Library System Team",

            managerId: "current-manager",

            hasSpecification: true,

            specification: {
                objectives:
                    "Automate university library operations.",

                scope:
                    "Books, members, borrowing and returns.",

                functionalRequirements:
                    "Book management and borrowing management.",

                nonFunctionalRequirements:
                    "Reliability and usability.",

                deliverables:
                    "Library management application.",

                technologyStack:
                    "Java and MySQL.",

                assumptions:
                    "Library staff have authorized accounts.",

                constraints:
                    "University infrastructure.",
            },

            hasActiveSprint: false,
        },
    ]);

    // ========================================================
    // MODAL STATE
    // ========================================================

    const [selectedProject, setSelectedProject] =
        useState(null);

    const [modalType, setModalType] =
        useState(null);

    // ========================================================
    // MESSAGES
    // ========================================================

    const [successMessage, setSuccessMessage] =
        useState("");

    const [errorMessage, setErrorMessage] =
        useState("");

    // ========================================================
    // ASSIGNED PROJECTS
    // ========================================================

    const assignedProjects = useMemo(() => {
        return projects.filter(
            (project) =>
                project.managerId === currentManager.id
        );
    }, [projects]);

    // ========================================================
    // PROJECT STATISTICS
    // ========================================================

    const projectStats = useMemo(() => {
        const total = assignedProjects.length;

        const active = assignedProjects.filter(
            (project) =>
                project.status === "Active"
        ).length;

        const completed = assignedProjects.filter(
            (project) =>
                project.status === "Completed"
        ).length;

        return [
            {
                title: "Total Projects",
                value: total,
                icon: FolderKanban,
            },
            {
                title: "Active Projects",
                value: active,
                icon: Clock,
            },
            {
                title: "Completed",
                value: completed,
                icon: CheckCircle,
            },
            {
                title: "AI Risks",
                value: 0,
                icon: AlertTriangle,
            },
        ];
    }, [assignedProjects]);

    // ========================================================
    // CLEAR MESSAGES
    // ========================================================

    const clearMessages = () => {
        setSuccessMessage("");
        setErrorMessage("");
    };

    // ========================================================
    // CLOSE MODAL
    // ========================================================

    const closeModal = () => {
        setSelectedProject(null);
        setModalType(null);
    };

    // ========================================================
    // ERROR HANDLER
    // ========================================================

    const handleProjectError = (message) => {
        setSuccessMessage("");
        setErrorMessage(
            message ||
                "An unexpected error occurred."
        );
    };

    // ========================================================
    // PM-001
    // CREATE PROJECT SPECIFICATION
    // ========================================================

    const handleCreateSpecification = (project) => {
        clearMessages();

        if (!project) {
            handleProjectError(
                "The selected project could not be found."
            );
            return;
        }

        if (
            project.managerId !==
            currentManager.id
        ) {
            handleProjectError(
                "You are not authorised to manage this project."
            );
            return;
        }

        if (
            project.hasSpecification ||
            project.specification
        ) {
            handleProjectError(
                "A project specification already exists. Please update it instead."
            );
            return;
        }

        setSelectedProject(project);
        setModalType("create");
    };

    // ========================================================
    // PM-002
    // UPDATE PROJECT SPECIFICATION
    // ========================================================

    const handleUpdateSpecification = (project) => {
        clearMessages();

        if (!project) {
            handleProjectError(
                "The selected project could not be found."
            );
            return;
        }

        if (
            project.managerId !==
            currentManager.id
        ) {
            handleProjectError(
                "You are not authorised to manage this project."
            );
            return;
        }

        if (
            !project.hasSpecification ||
            !project.specification
        ) {
            handleProjectError(
                "A project specification does not exist. Please create it first."
            );
            return;
        }

        setSelectedProject(project);
        setModalType("update");
    };

    // ========================================================
    // PM-003
    // DELETE PROJECT SPECIFICATION
    // ========================================================

    const handleDeleteSpecification = (project) => {
        clearMessages();

        if (!project) {
            handleProjectError(
                "The selected project could not be found."
            );
            return;
        }

        if (
            project.managerId !==
            currentManager.id
        ) {
            handleProjectError(
                "You are not authorised to manage this project."
            );
            return;
        }

        if (
            !project.hasSpecification ||
            !project.specification
        ) {
            handleProjectError(
                "A project specification does not exist."
            );
            return;
        }

        if (project.hasActiveSprint) {
            handleProjectError(
                "This project specification is currently being used by an active Sprint and cannot be deleted."
            );
            return;
        }

        setSelectedProject(project);
        setModalType("delete");
    };

    // ========================================================
    // PM-004
    // VIEW ASSIGNED PROJECT
    // ========================================================

    const handleViewProject = (project) => {
        clearMessages();

        if (!project) {
            handleProjectError(
                "The selected project could not be found."
            );
            return;
        }

        if (
            project.managerId !==
            currentManager.id
        ) {
            handleProjectError(
                "You are not authorised to view this project."
            );
            return;
        }

        setSelectedProject(project);
        setModalType("view");
    };

    // ========================================================
    // PM-005
    // UPDATE PROJECT TIMELINE
    // ========================================================

    const handleUpdateTimeline = (project) => {
        clearMessages();

        if (!project) {
            handleProjectError(
                "The selected project could not be found."
            );
            return;
        }

        if (
            project.managerId !==
            currentManager.id
        ) {
            handleProjectError(
                "You are not authorised to manage this project."
            );
            return;
        }

        setSelectedProject(project);
        setModalType("timeline");
    };

    // ========================================================
    // PM-006
    // SET / UPDATE PROJECT DEADLINE
    // ========================================================

    const handleUpdateDeadline = (project) => {
        clearMessages();

        if (!project) {
            handleProjectError(
                "The selected project could not be found."
            );
            return;
        }

        if (
            project.managerId !==
            currentManager.id
        ) {
            handleProjectError(
                "You are not authorised to manage this project."
            );
            return;
        }

        setSelectedProject(project);
        setModalType("deadline");
    };

    // ========================================================
    // PM-007
    // MANAGE PROJECT STATUS
    // ========================================================

    const handleManageStatus = (project) => {
        clearMessages();

        if (!project) {
            handleProjectError(
                "The selected project could not be found."
            );
            return;
        }

        if (
            project.managerId !==
            currentManager.id
        ) {
            handleProjectError(
                "You are not authorised to manage this project."
            );
            return;
        }

        setSelectedProject(project);
        setModalType("status");
    };

    // ========================================================
    // PM-001 SUCCESS
    // ========================================================

    const handleSpecificationCreated = (
        projectId,
        specification
    ) => {
        setProjects((previousProjects) =>
            previousProjects.map((project) => {
                if (project.id !== projectId) {
                    return project;
                }

                return {
                    ...project,
                    hasSpecification: true,
                    specification,
                };
            })
        );

        closeModal();

        setErrorMessage("");

        setSuccessMessage(
            "Project specification created successfully."
        );

        window.setTimeout(() => {
            setSuccessMessage("");
        }, 4000);
    };

    // ========================================================
    // PM-002 SUCCESS
    // ========================================================

    const handleSpecificationUpdated = (
        projectId,
        specification
    ) => {
        setProjects((previousProjects) =>
            previousProjects.map((project) => {
                if (project.id !== projectId) {
                    return project;
                }

                return {
                    ...project,
                    hasSpecification: true,
                    specification,
                };
            })
        );

        closeModal();

        setErrorMessage("");

        setSuccessMessage(
            "Project specification updated successfully."
        );

        window.setTimeout(() => {
            setSuccessMessage("");
        }, 4000);
    };

    // ========================================================
    // PM-003 SUCCESS
    // ========================================================

    const handleSpecificationDeleted = (
        projectId
    ) => {
        setProjects((previousProjects) =>
            previousProjects.map((project) => {
                if (project.id !== projectId) {
                    return project;
                }

                return {
                    ...project,
                    hasSpecification: false,
                    specification: null,
                };
            })
        );

        closeModal();

        setErrorMessage("");

        setSuccessMessage(
            "Project specification deleted successfully."
        );

        window.setTimeout(() => {
            setSuccessMessage("");
        }, 4000);
    };

    // ========================================================
    // PM-005 SUCCESS
    // ========================================================

    const handleTimelineUpdated = (
        projectId,
        timeline
    ) => {
        setProjects((previousProjects) =>
            previousProjects.map((project) => {
                if (project.id !== projectId) {
                    return project;
                }

                return {
                    ...project,
                    ...timeline,
                };
            })
        );

        closeModal();

        setErrorMessage("");

        setSuccessMessage(
            "Project timeline updated successfully."
        );

        window.setTimeout(() => {
            setSuccessMessage("");
        }, 4000);
    };

    // ========================================================
    // PM-006 SUCCESS
    // ========================================================

    const handleDeadlineUpdated = (
        projectId,
        deadline
    ) => {
        setProjects((previousProjects) =>
            previousProjects.map((project) => {
                if (project.id !== projectId) {
                    return project;
                }

                return {
                    ...project,
                    deadline,
                };
            })
        );

        closeModal();

        setErrorMessage("");

        setSuccessMessage(
            "Project deadline updated successfully."
        );

        window.setTimeout(() => {
            setSuccessMessage("");
        }, 4000);
    };

    // ========================================================
    // PM-007 SUCCESS
    // ========================================================

    const handleStatusUpdated = (
        projectId,
        status
    ) => {
        setProjects((previousProjects) =>
            previousProjects.map((project) => {
                if (project.id !== projectId) {
                    return project;
                }

                return {
                    ...project,
                    status,
                };
            })
        );

        closeModal();

        setErrorMessage("");

        setSuccessMessage(
            "Project status updated successfully."
        );

        window.setTimeout(() => {
            setSuccessMessage("");
        }, 4000);
    };

    // ========================================================
    // PROJECT STATUS STYLE
    // ========================================================

    const getStatusStyle = (status) => {
        switch (status) {
            case "Active":
                return {
                    badge:
                        "border-emerald-200 bg-emerald-50 text-emerald-700",
                    dot: "bg-emerald-500",
                };

            case "Planning":
                return {
                    badge:
                        "border-amber-200 bg-amber-50 text-amber-700",
                    dot: "bg-amber-500",
                };

            case "Completed":
                return {
                    badge:
                        "border-blue-200 bg-blue-50 text-blue-700",
                    dot: "bg-blue-500",
                };

            case "On Hold":
                return {
                    badge:
                        "border-orange-200 bg-orange-50 text-orange-700",
                    dot: "bg-orange-500",
                };

            case "Cancelled":
                return {
                    badge:
                        "border-red-200 bg-red-50 text-red-700",
                    dot: "bg-red-500",
                };

            default:
                return {
                    badge:
                        "border-slate-200 bg-slate-50 text-slate-600",
                    dot: "bg-slate-400",
                };
        }
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 text-slate-900">

            <main className="min-h-screen">

                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

                    {/* ==================================================
                        COLORFUL HEADER
                    ================================================== */}

                    <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-6 text-white shadow-xl shadow-blue-200/50">

                        <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-white/10" />

                        <div className="absolute -bottom-24 right-28 h-64 w-64 rounded-full bg-white/5" />

                        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                            <div className="flex items-center gap-4">

                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 shadow-lg ring-1 ring-white/20 backdrop-blur-sm">

                                    <FolderKanban
                                        size={28}
                                        className="text-white"
                                    />

                                </div>

                                <div>

                                    <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-blue-100">
                                        Manager Workspace
                                    </p>

                                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                        Project Management
                                    </h1>

                                    <p className="mt-1 max-w-2xl text-sm text-blue-100">
                                        Manage assigned projects,
                                        specifications, timelines,
                                        deadlines and project status.
                                    </p>

                                </div>

                            </div>

                            <div className="w-fit rounded-xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm">

                                <p className="text-xs font-medium text-blue-100">
                                    Assigned Projects
                                </p>

                                <p className="mt-1 text-2xl font-bold">
                                    {assignedProjects.length}
                                </p>

                            </div>

                        </div>

                    </div>

                    {/* ==================================================
                        SUCCESS MESSAGE
                    ================================================== */}

                    {successMessage && (

                        <div
                            role="status"
                            className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 px-4 py-4 text-sm font-semibold text-emerald-700 shadow-sm"
                        >

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100">

                                <CheckCircle
                                    size={19}
                                    className="text-emerald-600"
                                />

                            </div>

                            <span>{successMessage}</span>

                        </div>

                    )}

                    {/* ==================================================
                        ERROR MESSAGE
                    ================================================== */}

                    {errorMessage && (

                        <div
                            role="alert"
                            className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-gradient-to-r from-red-50 to-rose-50 px-4 py-4 text-sm font-semibold text-red-700 shadow-sm"
                        >

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100">

                                <AlertTriangle
                                    size={19}
                                    className="text-red-600"
                                />

                            </div>

                            <span>{errorMessage}</span>

                        </div>

                    )}

                    {/* ==================================================
                        PROJECT STATISTICS
                    ================================================== */}

                    <section className="mb-10">

                        <div className="mb-5 flex items-center justify-between">

                            <div>

                                <h2 className="text-lg font-bold text-slate-800">
                                    Project Overview
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Quick summary of your project portfolio.
                                </p>

                            </div>

                        </div>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

                            {projectStats.map((item, index) => {

                                const styles = [
                                    {
                                        border:
                                            "border-blue-200",
                                        bg:
                                            "bg-gradient-to-br from-blue-50 to-indigo-50",
                                        iconBg:
                                            "bg-blue-600",
                                        icon:
                                            "text-blue-600",
                                    },
                                    {
                                        border:
                                            "border-amber-200",
                                        bg:
                                            "bg-gradient-to-br from-amber-50 to-orange-50",
                                        iconBg:
                                            "bg-amber-500",
                                        icon:
                                            "text-amber-600",
                                    },
                                    {
                                        border:
                                            "border-emerald-200",
                                        bg:
                                            "bg-gradient-to-br from-emerald-50 to-green-50",
                                        iconBg:
                                            "bg-emerald-600",
                                        icon:
                                            "text-emerald-600",
                                    },
                                    {
                                        border:
                                            "border-violet-200",
                                        bg:
                                            "bg-gradient-to-br from-violet-50 to-purple-50",
                                        iconBg:
                                            "bg-violet-600",
                                        icon:
                                            "text-violet-600",
                                    },
                                ][index];

                                return (
                                    <div
                                        key={item.title}
                                        className={`overflow-hidden rounded-2xl border ${styles.border} ${styles.bg} shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg`}
                                    >

                                        <div className="h-1.5 bg-gradient-to-r from-current to-transparent opacity-70" />

                                        <div className="p-5">

                                            <div className="flex items-center justify-between">

                                                <div>

                                                    <p className="text-sm font-semibold text-slate-500">
                                                        {item.title}
                                                    </p>

                                                    <p className="mt-2 text-3xl font-extrabold text-slate-900">
                                                        {item.value}
                                                    </p>

                                                </div>

                                                <div
                                                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${styles.iconBg} shadow-md`}
                                                >

                                                    <item.icon
                                                        size={23}
                                                        className="text-white"
                                                    />

                                                </div>

                                            </div>

                                        </div>

                                    </div>
                                );
                            })}

                        </div>

                    </section>

                    {/* ==================================================
                        ASSIGNED PROJECTS
                    ================================================== */}

                    <section>

                        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                            <div>

                                <div className="flex items-center gap-2">

                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100">

                                        <FolderKanban
                                            size={19}
                                            className="text-indigo-600"
                                        />

                                    </div>

                                    <h2 className="text-xl font-bold text-slate-800">
                                        Assigned Projects
                                    </h2>

                                </div>

                                <p className="mt-2 text-sm text-slate-500">
                                    Projects currently assigned to you.
                                </p>

                            </div>

                            <div className="w-fit rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-blue-50 px-4 py-2.5 text-sm font-bold text-indigo-700 shadow-sm">

                                {assignedProjects.length}{" "}

                                {assignedProjects.length === 1
                                    ? "Project"
                                    : "Projects"}

                            </div>

                        </div>

                        {/* ==================================================
                            EMPTY STATE
                        ================================================== */}

                        {assignedProjects.length === 0 ? (

                            <div className="rounded-2xl border border-dashed border-indigo-200 bg-gradient-to-br from-white to-indigo-50 px-6 py-16 text-center shadow-sm">

                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100">

                                    <FolderKanban
                                        className="text-indigo-500"
                                        size={32}
                                    />

                                </div>

                                <h3 className="mt-5 text-lg font-bold text-slate-800">
                                    No Assigned Projects
                                </h3>

                                <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                                    You currently have no projects
                                    assigned to you.
                                </p>

                            </div>

                        ) : (

                            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

                                {assignedProjects.map((project, projectIndex) => {

                                    const statusStyle =
                                        getStatusStyle(
                                            project.status
                                        );

                                    const projectAccent =
                                        projectIndex % 3 === 0
                                            ? "from-blue-500 via-indigo-500 to-violet-500"
                                            : projectIndex % 3 === 1
                                            ? "from-emerald-500 via-teal-500 to-cyan-500"
                                            : "from-orange-500 via-amber-500 to-yellow-500";

                                    return (

                                        <div
                                            key={project.id}
                                            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl"
                                        >

                                            {/* ==================================================
                                                COLOR ACCENT
                                            ================================================== */}

                                            <div
                                                className={`h-2 bg-gradient-to-r ${projectAccent}`}
                                            />

                                            <div className="p-5">

                                                {/* ==================================================
                                                    PROJECT TOP
                                                ================================================== */}

                                                <div className="mb-5 flex items-start justify-between gap-4">

                                                    <div className="min-w-0">

                                                        <div className="mb-2 flex items-center gap-2">

                                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 shadow-sm">

                                                                <FolderKanban
                                                                    size={18}
                                                                    className="text-white"
                                                                />

                                                            </div>

                                                            <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">
                                                                Project
                                                            </span>

                                                        </div>

                                                        <h3 className="text-lg font-bold leading-snug text-slate-900">
                                                            {project.name}
                                                        </h3>

                                                    </div>

                                                    {/* STATUS */}

                                                    <div
                                                        className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${statusStyle.badge}`}
                                                    >

                                                        <span
                                                            className={`h-2 w-2 rounded-full ${statusStyle.dot}`}
                                                        />

                                                        {project.status}

                                                    </div>

                                                </div>

                                                {/* ==================================================
                                                    PROJECT CARD
                                                ================================================== */}

                                                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">

                                                    <ProjectCard
                                                        project={project}
                                                    />

                                                </div>

                                                {/* ==================================================
                                                    PROJECT PROGRESS
                                                ================================================== */}

                                                <div className="mt-5">

                                                    <div className="mb-2 flex items-center justify-between">

                                                        <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                                                            Project Progress
                                                        </span>

                                                        <span className="text-sm font-extrabold text-indigo-600">
                                                            {project.progress}%
                                                        </span>

                                                    </div>

                                                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">

                                                        <div
                                                            className={`h-full rounded-full bg-gradient-to-r ${projectAccent} transition-all duration-500`}
                                                            style={{
                                                                width: `${Math.min(
                                                                    Math.max(
                                                                        project.progress,
                                                                        0
                                                                    ),
                                                                    100
                                                                )}%`,
                                                            }}
                                                        />

                                                    </div>

                                                </div>

                                                {/* ==================================================
                                                    PROJECT INFORMATION
                                                ================================================== */}

                                                <div className="mt-5 grid grid-cols-2 gap-3">

                                                    <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">

                                                        <div className="flex items-center gap-2">

                                                            <CalendarRange
                                                                size={16}
                                                                className="text-blue-600"
                                                            />

                                                            <span className="text-xs font-semibold text-blue-700">
                                                                Start Date
                                                            </span>

                                                        </div>

                                                        <p className="mt-1 text-sm font-bold text-slate-800">
                                                            {project.startDate}
                                                        </p>

                                                    </div>

                                                    <div className="rounded-xl border border-orange-100 bg-orange-50 p-3">

                                                        <div className="flex items-center gap-2">

                                                            <CalendarClock
                                                                size={16}
                                                                className="text-orange-600"
                                                            />

                                                            <span className="text-xs font-semibold text-orange-700">
                                                                Deadline
                                                            </span>

                                                        </div>

                                                        <p className="mt-1 text-sm font-bold text-slate-800">
                                                            {project.deadline}
                                                        </p>

                                                    </div>

                                                </div>

                                                {/* ==================================================
                                                    ACTION SECTION
                                                ================================================== */}

                                                <div className="mt-6 border-t border-slate-100 pt-5">

                                                    <div className="mb-3 flex items-center gap-2">

                                                        <CircleDot
                                                            size={16}
                                                            className="text-indigo-500"
                                                        />

                                                        <span className="text-sm font-bold text-slate-700">
                                                            Project Actions
                                                        </span>

                                                    </div>

                                                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">

                                                        {/* PM-001 */}

                                                        {!project.hasSpecification && (

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleCreateSpecification(
                                                                        project
                                                                    )
                                                                }
                                                                className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 hover:shadow-md"
                                                            >

                                                                <FilePlus2
                                                                    size={17}
                                                                />

                                                                Create Project Specification

                                                            </button>

                                                        )}

                                                        {/* PM-002 */}

                                                        {project.hasSpecification && (

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleUpdateSpecification(
                                                                        project
                                                                    )
                                                                }
                                                                className="group flex items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-bold text-indigo-700 transition hover:-translate-y-0.5 hover:bg-indigo-100 hover:shadow-sm"
                                                            >

                                                                <FilePenLine
                                                                    size={17}
                                                                />

                                                                Update Project Specification

                                                            </button>

                                                        )}

                                                        {/* PM-003 */}

                                                        {project.hasSpecification && (

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleDeleteSpecification(
                                                                        project
                                                                    )
                                                                }
                                                                disabled={
                                                                    project.hasActiveSprint
                                                                }
                                                                className={
                                                                    project.hasActiveSprint
                                                                        ? "flex cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-bold text-slate-400"
                                                                        : "flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700 transition hover:-translate-y-0.5 hover:bg-red-100 hover:shadow-sm"
                                                                }
                                                            >

                                                                <Trash2
                                                                    size={17}
                                                                />

                                                                {project.hasActiveSprint
                                                                    ? "Specification In Use"
                                                                    : "Delete Project Specification"}

                                                            </button>

                                                        )}

                                                        {/* PM-004 */}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleViewProject(
                                                                    project
                                                                )
                                                            }
                                                            className="flex items-center justify-center gap-2 rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm font-bold text-cyan-700 transition hover:-translate-y-0.5 hover:bg-cyan-100 hover:shadow-sm"
                                                        >

                                                            <Eye
                                                                size={17}
                                                            />

                                                            View Assigned Project

                                                        </button>

                                                        {/* PM-005 */}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleUpdateTimeline(
                                                                    project
                                                                )
                                                            }
                                                            className="flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 transition hover:-translate-y-0.5 hover:bg-emerald-100 hover:shadow-sm"
                                                        >

                                                            <CalendarRange
                                                                size={17}
                                                            />

                                                            Update Project Timeline

                                                        </button>

                                                        {/* PM-006 */}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleUpdateDeadline(
                                                                    project
                                                                )
                                                            }
                                                            className="flex items-center justify-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700 transition hover:-translate-y-0.5 hover:bg-orange-100 hover:shadow-sm"
                                                        >

                                                            <CalendarClock
                                                                size={17}
                                                            />

                                                            Set / Update Project Deadline

                                                        </button>

                                                        {/* PM-007 */}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleManageStatus(
                                                                    project
                                                                )
                                                            }
                                                            className="flex items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm font-bold text-violet-700 transition hover:-translate-y-0.5 hover:bg-violet-100 hover:shadow-sm"
                                                        >

                                                            <CircleDot
                                                                size={17}
                                                            />

                                                            Manage Project Status

                                                        </button>

                                                    </div>

                                                </div>

                                            </div>

                                        </div>

                                    );
                                })}

                            </div>

                        )}

                    </section>

                </div>

            </main>

            {/* ============================================================
                PM-001 — CREATE SPECIFICATION
            ============================================================ */}

            {selectedProject &&
                modalType === "create" && (

                    <CreateProjectSpecificationModal
                        project={selectedProject}
                        currentManager={currentManager}
                        onClose={closeModal}
                        onCreated={
                            handleSpecificationCreated
                        }
                        onError={
                            handleProjectError
                        }
                    />

                )}

            {/* ============================================================
                PM-002 — UPDATE SPECIFICATION
            ============================================================ */}

            {selectedProject &&
                modalType === "update" && (

                    <UpdateProjectSpecificationModal
                        project={selectedProject}
                        currentManager={currentManager}
                        onClose={closeModal}
                        onUpdated={
                            handleSpecificationUpdated
                        }
                        onError={
                            handleProjectError
                        }
                    />

                )}

            {/* ============================================================
                PM-003 — DELETE SPECIFICATION
            ============================================================ */}

            {selectedProject &&
                modalType === "delete" && (

                    <DeleteProjectSpecificationModal
                        project={selectedProject}
                        currentManager={currentManager}
                        onClose={closeModal}
                        onDeleted={
                            handleSpecificationDeleted
                        }
                        onError={
                            handleProjectError
                        }
                    />

                )}

            {/* ============================================================
                PM-004 — VIEW ASSIGNED PROJECT
            ============================================================ */}

            {selectedProject &&
                modalType === "view" && (

                    <ViewAssignedProjectModal
                        project={selectedProject}
                        currentManager={currentManager}
                        onClose={closeModal}
                        onError={
                            handleProjectError
                        }
                    />

                )}

            {/* ============================================================
                PM-005 — UPDATE PROJECT TIMELINE
            ============================================================ */}

            {selectedProject &&
                modalType === "timeline" && (

                    <UpdateTimelineProjectModal
                        project={selectedProject}
                        currentManager={currentManager}
                        onClose={closeModal}
                        onUpdated={
                            handleTimelineUpdated
                        }
                        onError={
                            handleProjectError
                        }
                    />

                )}

            {/* ============================================================
                PM-006 — SET / UPDATE PROJECT DEADLINE
            ============================================================ */}

            {selectedProject &&
                modalType === "deadline" && (

                    <SetUpdateProjectDeadlineModal
                        project={selectedProject}
                        currentManager={currentManager}
                        onClose={closeModal}
                        onUpdated={
                            handleDeadlineUpdated
                        }
                        onError={
                            handleProjectError
                        }
                    />

                )}

            {/* ============================================================
                PM-007 — MANAGE PROJECT STATUS
            ============================================================ */}

            {selectedProject &&
                modalType === "status" && (

                    <ManageProjectStatusModal
                        project={selectedProject}
                        currentManager={currentManager}
                        onClose={closeModal}
                        onUpdated={
                            handleStatusUpdated
                        }
                        onError={
                            handleProjectError
                        }
                    />

                )}

        </div>
    );
}

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default ProjectManagement;