
import { useState } from "react";

import {
    ArrowLeft,
    CheckCircle2,
    ClipboardList,
    FileText,
    FolderKanban,
    HelpCircle,
    MessageSquare,
    UsersRound,
} from "lucide-react";

// ============================================================
// PROJECT USE CASE COMPONENTS
// ============================================================




// ============================================================
// PROJECT USE CASE COMPONENTS
// ============================================================

// CONT-PROJECT-001
import ViewAssignedProjects from "@/components/contributor/teamleader/project/ViewAssignedProjects";

// CONT-PROJECT-002
import ViewProjectDetails from "@/components/contributor/teamleader/project/ViewProjectDetails";

// CONT-PROJECT-003
import ViewProjectTeam from "@/components/contributor/teamleader/project/ViewProjectTeam";

// CONT-PROJECT-004
import ViewProjectTasks from "@/components/contributor/teamleader/project/ViewProjectTasks";

// CONT-PROJECT-005
import ViewProjectProgress from "@/components/contributor/teamleader/project/ViewProjectProgress";

// CONT-PROJECT-006
import ParticipateProjectCommunication from "@/components/contributor/teamleader/project/ParticipateProjectCommunication";

// CONT-PROJECT-007
import ViewProjectFiles from "@/components/contributor/teamleader/project/ViewProjectFiles";

// CONT-PROJECT-008
import RequestProjectAssistance from "@/components/contributor/teamleader/project/RequestProjectAssistance";

// ============================================================
// PAGE
// ============================================================

export default function ProjectParticipation() {
    // ========================================================
    // SELECTED PROJECT
    // ========================================================

    const [selectedProject, setSelectedProject] = useState(null);

    // ========================================================
    // ACTIVE USE CASE
    // ========================================================

    const [activeSection, setActiveSection] =
        useState("details");

    // ========================================================
    // OPEN PROJECT
    // CONT-PROJECT-001
    // ========================================================

    const handleProjectSelect = (project) => {
        setSelectedProject(project);
        setActiveSection("details");
    };

    // ========================================================
    // BACK TO PROJECTS
    // ========================================================

    const handleBackToProjects = () => {
        setSelectedProject(null);
        setActiveSection("details");
    };

    // ========================================================
    // NAVIGATION
    // ========================================================

    const navigationItems = [
        {
            id: "details",
            label: "Project Details",
            icon: <FolderKanban size={17} />,
            useCase: "CONT-PROJECT-002",
        },
        {
            id: "team",
            label: "Project Team",
            icon: <UsersRound size={17} />,
            useCase: "CONT-PROJECT-003",
        },
        {
            id: "tasks",
            label: "Tasks",
            icon: <ClipboardList size={17} />,
            useCase: "CONT-PROJECT-004",
        },
        {
            id: "progress",
            label: "Progress",
            icon: <CheckCircle2 size={17} />,
            useCase: "CONT-PROJECT-005",
        },
        {
            id: "communication",
            label: "Communication",
            icon: <MessageSquare size={17} />,
            useCase: "CONT-PROJECT-006",
        },
        {
            id: "files",
            label: "Project Files",
            icon: <FileText size={17} />,
            useCase: "CONT-PROJECT-007",
        },
        {
            id: "assistance",
            label: "Request Assistance",
            icon: <HelpCircle size={17} />,
            useCase: "CONT-PROJECT-008",
        },
    ];

    // ========================================================
    // PROJECT LIST
    // CONT-PROJECT-001
    // ========================================================

    if (!selectedProject) {
        return (
            <div className="min-h-full w-full bg-background text-foreground">
                <div className="mx-auto w-full max-w-7xl p-6">

                    {/* ==================================================
                        PAGE HEADER
                    ================================================== */}

                    <div className="mb-6">
                        <div className="flex items-center gap-3">

                            <div className="rounded-xl bg-primary/10 p-3 text-primary">
                                <FolderKanban size={25} />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold text-foreground">
                                    Project Participation
                                </h1>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    View your assigned projects and participate
                                    in project activities.
                                </p>
                            </div>

                        </div>
                    </div>

                    {/* ==================================================
                        CONT-PROJECT-001
                        VIEW ASSIGNED PROJECTS
                    ================================================== */}

                    <ViewAssignedProjects
                        onProjectSelect={handleProjectSelect}
                        onSelectProject={handleProjectSelect}
                    />

                </div>
            </div>
        );
    }

    // ============================================================
    // PROJECT DETAIL / PARTICIPATION VIEW
    // ============================================================

    return (
        <div className="min-h-full w-full bg-background text-foreground">

            <div className="mx-auto w-full max-w-7xl p-6">

                {/* ==================================================
                    PROJECT HEADER
                ================================================== */}

                <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                    <div className="flex items-center gap-3">

                        <button
                            type="button"
                            onClick={handleBackToProjects}
                            className="
                                inline-flex
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-border
                                bg-background
                                p-2.5
                                text-muted-foreground
                                transition
                                hover:bg-muted
                                hover:text-foreground
                            "
                            title="Back to assigned projects"
                        >
                            <ArrowLeft size={20} />
                        </button>

                        <div>
                            <h1 className="text-2xl font-bold text-foreground">
                                {selectedProject?.name ||
                                    selectedProject?.projectName ||
                                    "Project Participation"}
                            </h1>

                            <p className="mt-1 text-sm text-muted-foreground">
                                {selectedProject?.id ||
                                    selectedProject?.projectId ||
                                    "Project"}{" "}
                                · Contributor Project Participation
                            </p>
                        </div>

                    </div>

                </div>

                {/* ==================================================
                    PROJECT SUMMARY
                ================================================== */}

                <div className="mb-6 rounded-2xl border border-border bg-card p-6 shadow-sm">

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                        <div className="min-w-0 flex-1">

                            <div className="mb-3 flex flex-wrap items-center gap-2">

                                {selectedProject?.status && (
                                    <span className="
                                        rounded-full
                                        bg-primary/10
                                        px-3
                                        py-1
                                        text-xs
                                        font-semibold
                                        text-primary
                                    ">
                                        {selectedProject.status}
                                    </span>
                                )}

                                {selectedProject?.contributorRole && (
                                    <span className="
                                        rounded-full
                                        bg-muted
                                        px-3
                                        py-1
                                        text-xs
                                        font-semibold
                                        text-muted-foreground
                                    ">
                                        {selectedProject.contributorRole}
                                    </span>
                                )}

                            </div>

                            <h2 className="text-xl font-bold text-foreground">
                                {selectedProject?.name ||
                                    selectedProject?.projectName ||
                                    "Selected Project"}
                            </h2>

                            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                                {selectedProject?.description ||
                                    selectedProject?.projectDescription ||
                                    "Project information and participation activities."}
                            </p>

                        </div>

                        {/* PROJECT PROGRESS SUMMARY */}

                        {selectedProject?.progress !== undefined && (
                            <div className="w-full max-w-xs">

                                <div className="mb-2 flex items-center justify-between">

                                    <span className="text-sm font-medium text-muted-foreground">
                                        Project Progress
                                    </span>

                                    <span className="text-sm font-bold text-primary">
                                        {selectedProject.progress}%
                                    </span>

                                </div>

                                <div className="h-3 overflow-hidden rounded-full bg-muted">

                                    <div
                                        className="
                                            h-full
                                            rounded-full
                                            bg-primary
                                            transition-all
                                        "
                                        style={{
                                            width: `${Math.min(
                                                Math.max(
                                                    Number(
                                                        selectedProject.progress
                                                    ) || 0,
                                                    0
                                                ),
                                                100
                                            )}%`,
                                        }}
                                    />

                                </div>

                            </div>
                        )}

                    </div>

                </div>

                {/* ==================================================
                    USE CASE NAVIGATION
                ================================================== */}

                <div className="
                    mb-6
                    overflow-x-auto
                    rounded-2xl
                    border
                    border-border
                    bg-card
                    shadow-sm
                ">

                    <div className="flex min-w-max">

                        {navigationItems.map((item) => (

                            <button
                                key={item.id}
                                type="button"
                                onClick={() =>
                                    setActiveSection(item.id)
                                }
                                className={`
                                    flex
                                    items-center
                                    gap-2
                                    border-b-2
                                    px-5
                                    py-4
                                    text-sm
                                    font-semibold
                                    transition

                                    ${
                                        activeSection === item.id
                                            ? "border-primary text-primary"
                                            : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
                                    }
                                `}
                                title={item.useCase}
                            >
                                {item.icon}
                                {item.label}
                            </button>

                        ))}

                    </div>

                </div>

                {/* ==================================================
                    CONT-PROJECT-002
                    VIEW PROJECT DETAILS
                ================================================== */}

                {activeSection === "details" && (
                    <section>

                        <ViewProjectDetails
                            project={selectedProject}
                            selectedProject={selectedProject}
                        />

                    </section>
                )}

                {/* ==================================================
                    CONT-PROJECT-003
                    VIEW PROJECT TEAM
                ================================================== */}

                {activeSection === "team" && (
                    <section>

                        <ViewProjectTeam
                            project={selectedProject}
                            selectedProject={selectedProject}
                        />

                    </section>
                )}

                {/* ==================================================
                    CONT-PROJECT-004
                    VIEW PROJECT TASKS
                ================================================== */}

                {activeSection === "tasks" && (
                    <section>

                        <ViewProjectTasks
                            project={selectedProject}
                            selectedProject={selectedProject}
                        />

                    </section>
                )}

                {/* ==================================================
                    CONT-PROJECT-005
                    VIEW PROJECT PROGRESS
                ================================================== */}

                {activeSection === "progress" && (
                    <section>

                        <ViewProjectProgress
                            project={selectedProject}
                            selectedProject={selectedProject}
                        />

                    </section>
                )}

                {/* ==================================================
                    CONT-PROJECT-006
                    PARTICIPATE IN PROJECT COMMUNICATION
                ================================================== */}

                {activeSection === "communication" && (
                    <section>

                        <ParticipateProjectCommunication
                            project={selectedProject}
                            selectedProject={selectedProject}
                        />

                    </section>
                )}

                {/* ==================================================
                    CONT-PROJECT-007
                    VIEW PROJECT FILES
                ================================================== */}

                {activeSection === "files" && (
                    <section>

                        <ViewProjectFiles
                            project={selectedProject}
                            selectedProject={selectedProject}
                        />

                    </section>
                )}

                {/* ==================================================
                    CONT-PROJECT-008
                    REQUEST PROJECT ASSISTANCE
                ================================================== */}

                {activeSection === "assistance" && (
                    <section>

                        <RequestProjectAssistance
                            project={selectedProject}
                            selectedProject={selectedProject}
                        />

                    </section>
                )}

            </div>
        </div>
    );
}
