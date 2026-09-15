
import React, { useState, useEffect } from "react";
import {
    Sparkles,
    FileText,
    AlertTriangle,
    Lightbulb,
    Users,
    TrendingUp,
    CalendarDays,
    CalendarClock,
    ChevronDown,
    BrainCircuit,
} from "lucide-react";

import { getMyProjects } from "@/services/projectService";
import { getCurrentUser } from "@/services/authService";

// AI Modals
import AiProjectSummaryModal from "../../components/manager/project/AiProjectSummaryModal";
import AiRecommendationsModal from "../../components/manager/project/AiRecommendationsModal";
import AiBottlenecksModal from "../../components/manager/project/AiBottlenecksModal";
import AiTeamPerformanceModal from "../../components/manager/project/AiTeamPerformanceModal";
import AiProgressPredictionModal from "../../components/manager/project/AiProgressPredictionModal";
import AiDeadlinePredictionModal from "../../components/manager/project/AiDeadlinePredictionModal";
import AiSprintPlanningModal from "../../components/manager/project/AiSprintPlanningModal";

function AIFeatures() {
    const [projects, setProjects] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState("");
    const [currentManager, setCurrentManager] = useState(null);
    const [loading, setLoading] = useState(true);

    // Active modal
    const [activeModal, setActiveModal] = useState(null);

    useEffect(() => {
        const initialize = async () => {
            try {
                // ---------------------------------------------------------
                // 1. Load current manager
                // ---------------------------------------------------------
                const user = await getCurrentUser();

                if (user) {
                    setCurrentManager({
                        id: user.id,
                        name: user.fullName || user.name,
                    });
                }

                // ---------------------------------------------------------
                // 2. Load assigned projects
                // ---------------------------------------------------------
                const response = await getMyProjects();
                const data = response?.data || response || [];

                setProjects(data);

                if (data.length > 0) {
                    setSelectedProjectId(data[0].id);
                }
            } catch (error) {
                console.error("Failed to load AI Hub data:", error);
            } finally {
                setLoading(false);
            }
        };

        initialize();
    }, []);

    const selectedProject = projects.find(
        (project) => project.id === selectedProjectId
    );

    // -------------------------------------------------------------
    // AI FEATURES
    // -------------------------------------------------------------
    const aiFeatures = [
        {
            id: "summary",
            title: "Automated Project Summary",
            description:
                "Get a concise, AI-generated executive summary of the project's current health, risks, and next steps.",
            icon: FileText,
        },
        {
            id: "recommendations",
            title: "Project Recommendations",
            description:
                "Receive 3 actionable, data-driven recommendations to improve project performance and workflow.",
            icon: Lightbulb,
        },
        {
            id: "bottlenecks",
            title: "Detect Bottlenecks",
            description:
                "Identify active blockers, resource constraints, or process inefficiencies slowing down your project.",
            icon: AlertTriangle,
        },
        {
            id: "team",
            title: "Team Performance Analysis",
            description:
                "Analyze team workload, completion rates, and productivity trends based strictly on project metrics.",
            icon: Users,
        },
        {
            id: "progress",
            title: "Progress Prediction",
            description:
                "Forecast future project completion percentage and trajectory based on current velocity.",
            icon: TrendingUp,
        },
        {
            id: "deadline",
            title: "Deadline Prediction & Warning",
            description:
                "Predict if the project will meet its official deadline and get early warnings for potential delays.",
            icon: CalendarClock,
        },
        {
            id: "sprint",
            title: "Sprint Planning Suggestions",
            description:
                "Get AI advisory on optimal sprint capacity, priority focus, and potential blockers for the next sprint.",
            icon: CalendarDays,
        },
    ];

    // -------------------------------------------------------------
    // MODAL HANDLERS
    // -------------------------------------------------------------
    const handleOpenModal = (featureId) => {
        if (!selectedProject) return;

        setActiveModal(featureId);
    };

    const handleCloseModal = () => {
        setActiveModal(null);
    };

    const handleModalError = (msg) => {
        console.error("AI Modal Error:", msg);
        alert(msg);
        setActiveModal(null);
    };

    // -------------------------------------------------------------
    // LOADING
    // -------------------------------------------------------------
    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl border border-border bg-card shadow-sm">
                        <BrainCircuit
                            size={32}
                            className="animate-pulse text-primary"
                        />
                    </div>

                    <h2 className="mt-4 text-lg font-bold text-foreground">
                        Loading AI Hub...
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Preparing your project intelligence tools.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* =========================================================
                PAGE HEADER
            ========================================================= */}
            <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <BrainCircuit size={26} />
                        </div>

                        <div>
                            <div className="mb-1 flex items-center gap-2">
                                <Sparkles
                                    size={15}
                                    className="text-primary"
                                />

                                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    AI-Powered Intelligence
                                </span>
                            </div>

                            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                AI Features Hub
                            </h1>

                            <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">
                                Select a project to access AI-powered insights,
                                predictions, recommendations, and planning
                                assistance.
                            </p>
                        </div>
                    </div>

                    {/* Selected project indicator */}
                    {selectedProject && (
                        <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 lg:min-w-[240px]">
                            <p className="text-xs font-medium text-muted-foreground">
                                Currently analyzing
                            </p>

                            <p className="mt-1 truncate text-sm font-semibold text-foreground">
                                {selectedProject.name}
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* =========================================================
                PROJECT SELECTOR
            ========================================================= */}
            <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="max-w-xl">
                    <label
                        htmlFor="ai-project-selector"
                        className="mb-2 block text-sm font-semibold text-foreground"
                    >
                        Select a Project to Analyze
                    </label>

                    <div className="relative">
                        <select
                            id="ai-project-selector"
                            value={selectedProjectId}
                            onChange={(event) =>
                                setSelectedProjectId(event.target.value)
                            }
                            className="w-full appearance-none rounded-lg border border-input bg-background px-4 py-3 pr-10 text-sm font-medium text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                        >
                            {projects.length === 0 && (
                                <option value="">
                                    No projects assigned
                                </option>
                            )}

                            {projects.map((project) => (
                                <option
                                    key={project.id}
                                    value={project.id}
                                >
                                    {project.name}
                                </option>
                            ))}
                        </select>

                        <ChevronDown
                            size={18}
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        />
                    </div>
                </div>
            </section>

            {/* =========================================================
                AI FEATURES
            ========================================================= */}
            {selectedProject ? (
                <section>
                    <div className="mb-4">
                        <h2 className="text-lg font-bold text-foreground">
                            Available AI Tools
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Choose an AI capability to analyze{" "}
                            <span className="font-medium text-foreground">
                                {selectedProject.name}
                            </span>
                            .
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {aiFeatures.map((feature) => {
                            const Icon = feature.icon;

                            return (
                                <button
                                    key={feature.id}
                                    type="button"
                                    onClick={() =>
                                        handleOpenModal(feature.id)
                                    }
                                    className="group rounded-xl border border-border bg-card p-5 text-left shadow-sm transition hover:border-primary/40 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                            <Icon size={23} />
                                        </div>

                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition group-hover:bg-primary/10 group-hover:text-primary">
                                            <ChevronDown
                                                size={17}
                                                className="-rotate-90"
                                            />
                                        </div>
                                    </div>

                                    <h3 className="mt-4 text-base font-bold text-foreground">
                                        {feature.title}
                                    </h3>

                                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                        {feature.description}
                                    </p>

                                    <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-primary opacity-80 transition group-hover:opacity-100">
                                        <Sparkles size={13} />
                                        Analyze with AI
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </section>
            ) : (
                /* =====================================================
                   NO PROJECT
                ===================================================== */
                <section className="rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center shadow-sm">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                        <BrainCircuit size={30} />
                    </div>

                    <h3 className="mt-4 text-lg font-bold text-foreground">
                        No Project Selected
                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                        Please select a project from the dropdown above to view
                        and use the available AI insights.
                    </p>
                </section>
            )}

            {/* ============================================================
                AI MODALS
            ============================================================ */}

            {selectedProject &&
                currentManager &&
                activeModal === "summary" && (
                    <AiProjectSummaryModal
                        project={selectedProject}
                        currentManager={currentManager}
                        onClose={handleCloseModal}
                        onError={handleModalError}
                    />
                )}

            {selectedProject &&
                currentManager &&
                activeModal === "recommendations" && (
                    <AiRecommendationsModal
                        project={selectedProject}
                        currentManager={currentManager}
                        onClose={handleCloseModal}
                        onError={handleModalError}
                    />
                )}

            {selectedProject &&
                currentManager &&
                activeModal === "bottlenecks" && (
                    <AiBottlenecksModal
                        project={selectedProject}
                        currentManager={currentManager}
                        onClose={handleCloseModal}
                        onError={handleModalError}
                    />
                )}

            {selectedProject &&
                currentManager &&
                activeModal === "team" && (
                    <AiTeamPerformanceModal
                        project={selectedProject}
                        currentManager={currentManager}
                        onClose={handleCloseModal}
                        onError={handleModalError}
                    />
                )}

            {selectedProject &&
                currentManager &&
                activeModal === "progress" && (
                    <AiProgressPredictionModal
                        project={selectedProject}
                        currentManager={currentManager}
                        onClose={handleCloseModal}
                        onError={handleModalError}
                    />
                )}

            {selectedProject &&
                currentManager &&
                activeModal === "deadline" && (
                    <AiDeadlinePredictionModal
                        project={selectedProject}
                        currentManager={currentManager}
                        onClose={handleCloseModal}
                        onError={handleModalError}
                    />
                )}

            {selectedProject &&
                currentManager &&
                activeModal === "sprint" && (
                    <AiSprintPlanningModal
                        project={selectedProject}
                        currentManager={currentManager}
                        onClose={handleCloseModal}
                        onError={handleModalError}
                    />
                )}
        </div>
    );
}

export default AIFeatures;