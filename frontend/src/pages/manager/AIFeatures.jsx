
// ============================================================
// AIPMS — MANAGER AI FEATURES
//
// AI Use Case
// - View AI Recommendations
// - Select Assigned Project
// - Generate AI Recommendations
// - Refresh AI Recommendations
//
// IMPORTANT
// - No localStorage
// - No hard-coded recommendations
// - No automatic project modification
// - Manager selects an assigned project
// - Backend verifies authorization
// - Backend retrieves project data
// - AI generates recommendations
//
// Colorful Professional UI
// ============================================================

import { useEffect, useState } from "react";

import {
    AlertTriangle,
    BrainCircuit,
    CheckCircle2,
    Info,
    Lightbulb,
    RefreshCw,
    Sparkles,
    FolderKanban,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
    getManagerProjects,
    getAIRecommendations,
} from "@/services/aiService";

// ============================================================
// COMPONENT
// ============================================================

function AIFeatures() {
    // ========================================================
    // STATE
    // ========================================================

    const [projects, setProjects] = useState([]);

    const [selectedProjectId, setSelectedProjectId] =
        useState("");

    const [selectedProject, setSelectedProject] =
        useState(null);

    const [recommendations, setRecommendations] =
        useState([]);

    const [loadingProjects, setLoadingProjects] =
        useState(true);

    const [loadingRecommendations, setLoadingRecommendations] =
        useState(false);

    const [error, setError] = useState("");

    const [lastGeneratedAt, setLastGeneratedAt] =
        useState(null);

    // ========================================================
    // LOAD ASSIGNED PROJECTS
    // ========================================================

    useEffect(() => {
        loadProjects();
    }, []);

    // ========================================================
    // LOAD PROJECTS
    // ========================================================

    const loadProjects = async () => {
        try {
            setLoadingProjects(true);
            setError("");

            const result = await getManagerProjects();

            const projectList = Array.isArray(result)
                ? result
                : result?.projects || [];

            setProjects(projectList);
        } catch (error) {
            console.error(
                "Project loading error:",
                error
            );

            setError(
                error.message ||
                    "Unable to load assigned projects."
            );
        } finally {
            setLoadingProjects(false);
        }
    };

    // ========================================================
    // PROJECT NAME
    // ========================================================

    const getProjectName = (project) => {
        if (!project) {
            return "Unnamed Project";
        }

        return (
            project.name ||
            project.title ||
            project.projectName ||
            "Unnamed Project"
        );
    };

    // ========================================================
    // PROJECT ID
    // ========================================================

    const getProjectId = (project) => {
        if (!project) {
            return null;
        }

        return (
            project.id ??
            project.projectId ??
            project.projectID
        );
    };

    // ========================================================
    // HANDLE PROJECT SELECTION
    // ========================================================

    const handleProjectChange = async (event) => {
        const projectId = event.target.value;

        setSelectedProjectId(projectId);
        setSelectedProject(null);
        setRecommendations([]);
        setError("");
        setLastGeneratedAt(null);

        if (!projectId) {
            return;
        }

        const project = projects.find(
            (item) =>
                String(getProjectId(item)) ===
                String(projectId)
        );

        setSelectedProject(project || null);

        await loadRecommendations(projectId);
    };

    // ========================================================
    // LOAD AI RECOMMENDATIONS
    // ========================================================

    const loadRecommendations = async (projectId) => {
        try {
            setLoadingRecommendations(true);
            setError("");
            setRecommendations([]);

            const result =
                await getAIRecommendations(projectId);

            const recommendationList = Array.isArray(result)
                ? result
                : result?.recommendations || [];

            setRecommendations(recommendationList);

            setLastGeneratedAt(new Date());
        } catch (error) {
            console.error(
                "AI recommendation error:",
                error
            );

            setError(
                error.message ||
                    "Unable to generate AI recommendations."
            );
        } finally {
            setLoadingRecommendations(false);
        }
    };

    // ========================================================
    // REFRESH
    // ========================================================

    const handleRefresh = async () => {
        setError("");

        if (!selectedProjectId) {
            await loadProjects();
            return;
        }

        await loadRecommendations(
            selectedProjectId
        );
    };

    // ========================================================
    // RECOMMENDATION ICON
    // ========================================================

    const getRecommendationIcon = (type) => {
        const normalizedType = String(type || "")
            .trim()
            .toLowerCase();

        if (
            normalizedType.includes("risk") ||
            normalizedType.includes("warning")
        ) {
            return (
                <AlertTriangle
                    className="h-5 w-5 text-amber-600"
                />
            );
        }

        if (
            normalizedType.includes("success") ||
            normalizedType.includes("positive") ||
            normalizedType.includes("completed")
        ) {
            return (
                <CheckCircle2
                    className="h-5 w-5 text-emerald-600"
                />
            );
        }

        if (
            normalizedType.includes("info") ||
            normalizedType.includes("information")
        ) {
            return (
                <Info
                    className="h-5 w-5 text-sky-600"
                />
            );
        }

        return (
            <Lightbulb
                className="h-5 w-5 text-violet-600"
            />
        );
    };

    // ========================================================
    // RECOMMENDATION TITLE
    // ========================================================

    const getRecommendationTitle = (
        recommendation,
        index
    ) => {
        return (
            recommendation?.title ||
            recommendation?.name ||
            `Recommendation ${index + 1}`
        );
    };

    // ========================================================
    // RECOMMENDATION DESCRIPTION
    // ========================================================

    const getRecommendationDescription = (
        recommendation
    ) => {
        return (
            recommendation?.description ||
            recommendation?.message ||
            recommendation?.content ||
            recommendation?.recommendation ||
            "No recommendation details were provided."
        );
    };

    // ========================================================
    // RECOMMENDATION TYPE
    // ========================================================

    const getRecommendationType = (
        recommendation
    ) => {
        return (
            recommendation?.type ||
            recommendation?.category ||
            "Recommendation"
        );
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">

            <main className="min-h-screen">

                <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">

                    {/* ==================================================
                        COLORFUL HEADER
                    ================================================== */}

                    <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 p-7 text-white shadow-lg">

                        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10" />

                        <div className="absolute -bottom-20 right-24 h-44 w-44 rounded-full bg-white/10" />

                        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                            <div className="flex items-center gap-4">

                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20 backdrop-blur-sm">

                                    <BrainCircuit
                                        size={28}
                                        className="text-white"
                                    />

                                </div>

                                <div>

                                    <div className="mb-1 flex items-center gap-2">

                                        <Sparkles
                                            size={16}
                                            className="text-cyan-200"
                                        />

                                        <span className="text-xs font-semibold uppercase tracking-wider text-white/80">
                                            AI Workspace
                                        </span>

                                    </div>

                                    <h1 className="text-3xl font-bold tracking-tight">
                                        AI Features
                                    </h1>

                                    <p className="mt-1 max-w-2xl text-sm text-white/80">
                                        Analyze assigned projects and view AI-generated recommendations.
                                    </p>

                                </div>

                            </div>

                            {/* REFRESH */}

                            <Button
                                type="button"
                                onClick={handleRefresh}
                                disabled={
                                    loadingProjects ||
                                    loadingRecommendations
                                }
                                className="inline-flex items-center justify-center gap-2 rounded-xl border-0 bg-white px-5 py-3 text-sm font-bold text-violet-700 shadow-md transition hover:bg-slate-50 hover:shadow-lg disabled:opacity-60"
                            >

                                <RefreshCw
                                    className={`h-4 w-4 ${
                                        loadingProjects ||
                                        loadingRecommendations
                                            ? "animate-spin"
                                            : ""
                                    }`}
                                />

                                Refresh

                            </Button>

                        </div>

                    </div>

                    {/* ==================================================
                        ERROR
                    ================================================== */}

                    {error && (
                        <div
                            role="alert"
                            className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 shadow-sm"
                        >

                            <AlertTriangle
                                size={19}
                                className="mt-0.5 shrink-0 text-red-600"
                            />

                            <span>
                                {error}
                            </span>

                        </div>
                    )}

                    {/* ==================================================
                        PROJECT SELECTOR
                    ================================================== */}

                    <section className="mb-8">

                        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-500" />

                            <div className="p-6">

                                <div className="mb-5 flex items-center gap-3">

                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100">

                                        <FolderKanban
                                            size={21}
                                            className="text-violet-600"
                                        />

                                    </div>

                                    <div>

                                        <h2 className="text-lg font-bold text-slate-900">
                                            Select Project
                                        </h2>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Select an assigned project to view AI recommendations.
                                        </p>

                                    </div>

                                </div>

                                <select
                                    value={
                                        selectedProjectId
                                    }
                                    onChange={
                                        handleProjectChange
                                    }
                                    disabled={
                                        loadingProjects
                                    }
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                                >

                                    <option value="">

                                        {loadingProjects
                                            ? "Loading assigned projects..."
                                            : projects.length === 0
                                            ? "No assigned projects found"
                                            : "Select an assigned project"}

                                    </option>

                                    {projects.map(
                                        (project) => {

                                            const id =
                                                getProjectId(
                                                    project
                                                );

                                            return (
                                                <option
                                                    key={id}
                                                    value={id}
                                                >
                                                    {getProjectName(
                                                        project
                                                    )}
                                                </option>
                                            );
                                        }
                                    )}

                                </select>

                                {selectedProject && (
                                    <div className="mt-4 flex items-center gap-2 rounded-xl border border-violet-100 bg-violet-50 px-4 py-3">

                                        <CheckCircle2
                                            size={17}
                                            className="shrink-0 text-violet-600"
                                        />

                                        <p className="text-sm font-medium text-violet-700">

                                            Selected project:

                                            <span className="ml-1 font-bold">
                                                {getProjectName(
                                                    selectedProject
                                                )}
                                            </span>

                                        </p>

                                    </div>
                                )}

                            </div>

                        </div>

                    </section>

                    {/* ==================================================
                        NO PROJECT SELECTED
                    ================================================== */}

                    {!selectedProjectId &&
                        !loadingProjects &&
                        !error && (

                            <div className="rounded-2xl border border-dashed border-violet-300 bg-white px-6 py-16 text-center shadow-sm">

                                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100">

                                    <BrainCircuit
                                        size={32}
                                        className="text-violet-600"
                                    />

                                </div>

                                <h2 className="text-lg font-bold text-slate-900">
                                    AI Recommendations
                                </h2>

                                <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                                    Select one of your assigned projects to allow the AI service to analyze the available project data and generate recommendations.
                                </p>

                            </div>
                        )}

                    {/* ==================================================
                        AI LOADING
                    ================================================== */}

                    {selectedProjectId &&
                        loadingRecommendations && (

                            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">

                                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100">

                                    <RefreshCw
                                        size={30}
                                        className="animate-spin text-violet-600"
                                    />

                                </div>

                                <h2 className="text-lg font-bold text-slate-900">
                                    AI is analyzing project data...
                                </h2>

                                <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                                    The AI service is analyzing the authorized project data and generating recommendations.
                                </p>

                            </div>
                        )}

                    {/* ==================================================
                        RECOMMENDATIONS
                    ================================================== */}

                    {selectedProjectId &&
                        !loadingRecommendations &&
                        recommendations.length > 0 && (

                            <section className="space-y-6">

                                {/* SECTION HEADER */}

                                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

                                    <div>

                                        <div className="flex items-center gap-2">

                                            <div className="h-2.5 w-2.5 rounded-full bg-violet-500" />

                                            <h2 className="text-xl font-bold text-slate-900">
                                                AI Recommendations
                                            </h2>

                                        </div>

                                        <p className="mt-1 text-sm text-slate-500">
                                            {selectedProject
                                                ? getProjectName(
                                                      selectedProject
                                                  )
                                                : "Selected Project"}
                                        </p>

                                    </div>

                                    <div className="flex flex-wrap items-center gap-2">

                                        <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-xs font-bold text-violet-700">

                                            <BrainCircuit
                                                size={15}
                                            />

                                            AI Generated

                                        </span>

                                        <span className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700">

                                            {recommendations.length}

                                            {" "}

                                            {recommendations.length ===
                                            1
                                                ? "Recommendation"
                                                : "Recommendations"}

                                        </span>

                                    </div>

                                </div>

                                {/* LAST GENERATED */}

                                {lastGeneratedAt && (
                                    <p className="text-xs text-slate-400">
                                        Generated{" "}
                                        {lastGeneratedAt.toLocaleString()}
                                    </p>
                                )}

                                {/* RECOMMENDATION CARDS */}

                                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

                                    {recommendations.map(
                                        (
                                            recommendation,
                                            index
                                        ) => {

                                            const title =
                                                getRecommendationTitle(
                                                    recommendation,
                                                    index
                                                );

                                            const description =
                                                getRecommendationDescription(
                                                    recommendation
                                                );

                                            const type =
                                                getRecommendationType(
                                                    recommendation
                                                );

                                            const normalizedType =
                                                String(
                                                    type || ""
                                                )
                                                    .trim()
                                                    .toLowerCase();

                                            const isRisk =
                                                normalizedType.includes(
                                                    "risk"
                                                ) ||
                                                normalizedType.includes(
                                                    "warning"
                                                );

                                            const isSuccess =
                                                normalizedType.includes(
                                                    "success"
                                                ) ||
                                                normalizedType.includes(
                                                    "positive"
                                                );

                                            const isInfo =
                                                normalizedType.includes(
                                                    "info"
                                                );

                                            const accentClass =
                                                isRisk
                                                    ? "from-amber-400 to-orange-500"
                                                    : isSuccess
                                                    ? "from-emerald-400 to-green-600"
                                                    : isInfo
                                                    ? "from-sky-400 to-blue-600"
                                                    : "from-violet-500 to-indigo-600";

                                            const iconBgClass =
                                                isRisk
                                                    ? "bg-amber-100"
                                                    : isSuccess
                                                    ? "bg-emerald-100"
                                                    : isInfo
                                                    ? "bg-sky-100"
                                                    : "bg-violet-100";

                                            return (
                                                <div
                                                    key={
                                                        recommendation.id ||
                                                        recommendation.recommendationId ||
                                                        index
                                                    }
                                                    className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                                                >

                                                    {/* TOP ACCENT */}

                                                    <div
                                                        className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${accentClass}`}
                                                    />

                                                    <div className="p-6">

                                                        <div className="flex gap-4">

                                                            {/* ICON */}

                                                            <div
                                                                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconBgClass}`}
                                                            >

                                                                {getRecommendationIcon(
                                                                    type
                                                                )}

                                                            </div>

                                                            {/* CONTENT */}

                                                            <div className="min-w-0 flex-1">

                                                                <div className="flex flex-wrap items-start justify-between gap-2">

                                                                    <h3 className="font-bold leading-6 text-slate-900">
                                                                        {
                                                                            title
                                                                        }
                                                                    </h3>

                                                                    <span className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">
                                                                        {
                                                                            type
                                                                        }
                                                                    </span>

                                                                </div>

                                                                <p className="mt-3 text-sm leading-6 text-slate-600">
                                                                    {
                                                                        description
                                                                    }
                                                                </p>

                                                                <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs font-semibold text-violet-600">

                                                                    <BrainCircuit
                                                                        size={15}
                                                                    />

                                                                    AI-generated recommendation

                                                                </div>

                                                            </div>

                                                        </div>

                                                    </div>

                                                </div>
                                            );
                                        }
                                    )}

                                </div>

                            </section>
                        )}

                    {/* ==================================================
                        NO RECOMMENDATIONS
                    ================================================== */}

                    {selectedProjectId &&
                        !loadingRecommendations &&
                        !error &&
                        recommendations.length === 0 && (

                            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">

                                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">

                                    <BrainCircuit
                                        size={32}
                                        className="text-slate-400"
                                    />

                                </div>

                                <h2 className="text-lg font-bold text-slate-900">
                                    No Recommendations Available
                                </h2>

                                <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                                    The AI service did not return any recommendations for this project.
                                </p>

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={
                                        handleRefresh
                                    }
                                    className="mt-5 gap-2"
                                >

                                    <RefreshCw
                                        size={16}
                                    />

                                    Generate Again

                                </Button>

                            </div>
                        )}

                </div>

            </main>

        </div>
    );
}

export default AIFeatures;

