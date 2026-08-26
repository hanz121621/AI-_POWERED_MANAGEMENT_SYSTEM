import { useEffect, useState } from "react";

import {
    AlertTriangle,
    BrainCircuit,
    CheckCircle2,
    Info,
    Lightbulb,
    RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
    getManagerProjects,
    getAIRecommendations,
} from "@/services/aiService";


// ============================================================
// AI FEATURES
// ============================================================
//
// AI-001: View AI Recommendations
//
// Primary Actor:
// Project Manager
//
// Supporting Actor:
// AI Service
//
// IMPORTANT:
// - No localStorage
// - No hard-coded recommendations
// - No automatic project modification
// - Manager selects an assigned project
// - Backend verifies authorization
// - Backend retrieves project data
// - AI generates recommendations
// ============================================================


function AIFeatures() {

    // ========================================================
    // STATE
    // ========================================================

    const [projects, setProjects] =
        useState([]);

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

    const [error, setError] =
        useState("");

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

            const result =
                await getManagerProjects();

            const projectList =
                Array.isArray(result)
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

    const getProjectName = (
        project
    ) => {

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

    const getProjectId = (
        project
    ) => {

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

    const handleProjectChange = async (
        event
    ) => {

        const projectId =
            event.target.value;

        setSelectedProjectId(
            projectId
        );

        setSelectedProject(null);
        setRecommendations([]);
        setError("");
        setLastGeneratedAt(null);

        if (!projectId) {
            return;
        }


        // ----------------------------------------------------
        // Find selected project from backend result
        // ----------------------------------------------------

        const project =
            projects.find(
                (item) =>
                    String(
                        getProjectId(item)
                    ) ===
                    String(projectId)
            );

        setSelectedProject(
            project || null
        );


        // ----------------------------------------------------
        // AI-001
        // Generate recommendations
        // ----------------------------------------------------

        await loadRecommendations(
            projectId
        );
    };


    // ========================================================
    // LOAD AI RECOMMENDATIONS
    // ========================================================

    const loadRecommendations = async (
        projectId
    ) => {

        try {

            setLoadingRecommendations(
                true
            );

            setError("");
            setRecommendations([]);


            const result =
                await getAIRecommendations(
                    projectId
                );


            // ------------------------------------------------
            // Backend can return:
            //
            // [
            //   {...}
            // ]
            //
            // OR
            //
            // {
            //   recommendations: [...]
            // }
            // ------------------------------------------------

            const recommendationList =
                Array.isArray(result)
                    ? result
                    : result?.recommendations || [];


            setRecommendations(
                recommendationList
            );


            setLastGeneratedAt(
                new Date()
            );

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

            setLoadingRecommendations(
                false
            );
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

    const getRecommendationIcon = (
        type
    ) => {

        const normalizedType =
            String(
                type || ""
            )
                .trim()
                .toLowerCase();


        if (
            normalizedType.includes(
                "risk"
            )
        ) {

            return (
                <AlertTriangle
                    className="
                        h-5
                        w-5
                        text-amber-600
                        dark:text-amber-400
                    "
                />
            );
        }


        if (
            normalizedType.includes(
                "success"
            ) ||
            normalizedType.includes(
                "positive"
            )
        ) {

            return (
                <CheckCircle2
                    className="
                        h-5
                        w-5
                        text-emerald-600
                        dark:text-emerald-400
                    "
                />
            );
        }


        if (
            normalizedType.includes(
                "info"
            )
        ) {

            return (
                <Info
                    className="
                        h-5
                        w-5
                        text-blue-600
                        dark:text-blue-400
                    "
                />
            );
        }


        return (
            <Lightbulb
                className="
                    h-5
                    w-5
                    text-blue-600
                    dark:text-blue-400
                "
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

        <div
            className="
                min-h-full
                bg-slate-50
                p-4
                md:p-6

                dark:bg-slate-950
            "
        >

            <div
                className="
                    mx-auto
                    max-w-7xl
                "
            >

                {/* ==================================================
                    HEADER
                ================================================== */}

                <div
                    className="
                        mb-6
                        flex
                        flex-col
                        gap-4

                        md:flex-row
                        md:items-center
                        md:justify-between
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-4
                        "
                    >

                        <div
                            className="
                                flex
                                h-12
                                w-12
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-blue-600
                                text-white
                                shadow-sm
                            "
                        >

                            <BrainCircuit
                                className="
                                    h-6
                                    w-6
                                "
                            />

                        </div>


                        <div>

                            <h1
                                className="
                                    text-2xl
                                    font-bold
                                    tracking-tight
                                    text-slate-900

                                    dark:text-white
                                "
                            >
                                AI Features
                            </h1>


                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-slate-500

                                    dark:text-slate-400
                                "
                            >
                                View AI-generated recommendations
                                for your assigned projects.
                            </p>

                        </div>

                    </div>


                    {/* REFRESH */}

                    <Button
                        type="button"
                        variant="outline"
                        onClick={
                            handleRefresh
                        }
                        disabled={
                            loadingProjects ||
                            loadingRecommendations
                        }
                        className="
                            gap-2
                        "
                    >

                        <RefreshCw
                            className={`
                                h-4
                                w-4

                                ${
                                    loadingProjects ||
                                    loadingRecommendations
                                        ? "animate-spin"
                                        : ""
                                }
                            `}
                        />

                        Refresh

                    </Button>

                </div>


                {/* ==================================================
                    PROJECT SELECTOR
                ================================================== */}

                <div
                    className="
                        mb-6
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-6
                        shadow-sm

                        dark:border-slate-700
                        dark:bg-slate-900
                    "
                >

                    <div className="mb-4">

                        <h2
                            className="
                                text-lg
                                font-bold
                                text-slate-900

                                dark:text-white
                            "
                        >
                            Select Project
                        </h2>


                        <p
                            className="
                                mt-1
                                text-sm
                                text-slate-500

                                dark:text-slate-400
                            "
                        >
                            Select an assigned project to
                            view AI recommendations.
                        </p>

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
                        className="
                            w-full
                            rounded-lg
                            border
                            border-slate-300
                            bg-white
                            px-4
                            py-3
                            text-sm
                            text-slate-900
                            outline-none

                            focus:border-blue-500
                            focus:ring-2
                            focus:ring-blue-500/20

                            dark:border-slate-700
                            dark:bg-slate-800
                            dark:text-white
                        "
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

                </div>


                {/* ==================================================
                    ERROR
                ================================================== */}

                {error && (

                    <div
                        className="
                            mb-6
                            rounded-xl
                            border
                            border-red-200
                            bg-red-50
                            p-4
                            text-sm
                            text-red-700

                            dark:border-red-900
                            dark:bg-red-950/30
                            dark:text-red-300
                        "
                    >
                        {error}
                    </div>
                )}


                {/* ==================================================
                    SELECT PROJECT MESSAGE
                ================================================== */}

                {!selectedProjectId &&
                    !loadingProjects &&
                    !error && (

                        <div
                            className="
                                rounded-2xl
                                border
                                border-dashed
                                border-slate-300
                                bg-white
                                p-12
                                text-center

                                dark:border-slate-700
                                dark:bg-slate-900
                            "
                        >

                            <BrainCircuit
                                className="
                                    mx-auto
                                    mb-4
                                    h-12
                                    w-12
                                    text-slate-400
                                "
                            />


                            <h2
                                className="
                                    text-lg
                                    font-semibold
                                    text-slate-900

                                    dark:text-white
                                "
                            >
                                AI Recommendations
                            </h2>


                            <p
                                className="
                                    mx-auto
                                    mt-2
                                    max-w-lg
                                    text-sm
                                    leading-6
                                    text-slate-500

                                    dark:text-slate-400
                                "
                            >
                                Select one of your assigned
                                projects to allow the AI
                                service to analyze the
                                available project data.
                            </p>

                        </div>
                    )}


                {/* ==================================================
                    AI LOADING
                ================================================== */}

                {selectedProjectId &&
                    loadingRecommendations && (

                        <div
                            className="
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                p-12
                                text-center
                                shadow-sm

                                dark:border-slate-700
                                dark:bg-slate-900
                            "
                        >

                            <RefreshCw
                                className="
                                    mx-auto
                                    mb-4
                                    h-10
                                    w-10
                                    animate-spin
                                    text-blue-600
                                "
                            />


                            <h2
                                className="
                                    text-lg
                                    font-semibold
                                    text-slate-900

                                    dark:text-white
                                "
                            >
                                AI is analyzing project data...
                            </h2>


                            <p
                                className="
                                    mx-auto
                                    mt-2
                                    max-w-lg
                                    text-sm
                                    leading-6
                                    text-slate-500

                                    dark:text-slate-400
                                "
                            >
                                The AI service is analyzing
                                the authorized project data
                                and generating recommendations.
                            </p>

                        </div>
                    )}


                {/* ==================================================
                    RECOMMENDATIONS
                ================================================== */}

                {selectedProjectId &&
                    !loadingRecommendations &&
                    recommendations.length > 0 && (

                        <div
                            className="
                                space-y-4
                            "
                        >

                            {/* SECTION HEADER */}

                            <div
                                className="
                                    flex
                                    flex-col
                                    gap-3

                                    md:flex-row
                                    md:items-center
                                    md:justify-between
                                "
                            >

                                <div>

                                    <h2
                                        className="
                                            text-xl
                                            font-bold
                                            text-slate-900

                                            dark:text-white
                                        "
                                    >
                                        AI Recommendations
                                    </h2>


                                    <p
                                        className="
                                            mt-1
                                            text-sm
                                            text-slate-500

                                            dark:text-slate-400
                                        "
                                    >
                                        {selectedProject
                                            ? getProjectName(
                                                selectedProject
                                            )
                                            : "Selected Project"}
                                    </p>

                                </div>


                                {/* AI GENERATED */}

                                <span
                                    className="
                                        inline-flex
                                        w-fit
                                        items-center
                                        gap-2
                                        rounded-full
                                        bg-purple-50
                                        px-3
                                        py-1.5
                                        text-xs
                                        font-semibold
                                        text-purple-700

                                        dark:bg-purple-950
                                        dark:text-purple-300
                                    "
                                >

                                    <BrainCircuit
                                        className="
                                            h-4
                                            w-4
                                        "
                                    />

                                    AI Generated

                                </span>

                            </div>


                            {/* LAST GENERATED */}

                            {lastGeneratedAt && (

                                <p
                                    className="
                                        text-xs
                                        text-slate-400

                                        dark:text-slate-500
                                    "
                                >
                                    Generated{" "}
                                    {lastGeneratedAt.toLocaleString()}
                                </p>
                            )}


                            {/* CARDS */}

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

                                    return (

                                        <div
                                            key={
                                                recommendation.id ||
                                                recommendation.recommendationId ||
                                                index
                                            }
                                            className="
                                                rounded-2xl
                                                border
                                                border-slate-200
                                                bg-white
                                                p-6
                                                shadow-sm

                                                dark:border-slate-700
                                                dark:bg-slate-900
                                            "
                                        >

                                            <div
                                                className="
                                                    flex
                                                    gap-4
                                                "
                                            >

                                                {/* ICON */}

                                                <div
                                                    className="
                                                        flex
                                                        h-11
                                                        w-11
                                                        shrink-0
                                                        items-center
                                                        justify-center
                                                        rounded-xl
                                                        bg-slate-100

                                                        dark:bg-slate-800
                                                    "
                                                >

                                                    {getRecommendationIcon(
                                                        type
                                                    )}

                                                </div>


                                                <div
                                                    className="
                                                        min-w-0
                                                        flex-1
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            flex
                                                            flex-wrap
                                                            items-center
                                                            gap-2
                                                        "
                                                    >

                                                        <h3
                                                            className="
                                                                font-semibold
                                                                text-slate-900

                                                                dark:text-white
                                                            "
                                                        >
                                                            {title}
                                                        </h3>


                                                        <span
                                                            className="
                                                                rounded-full
                                                                bg-slate-100
                                                                px-2.5
                                                                py-1
                                                                text-xs
                                                                font-medium
                                                                text-slate-600

                                                                dark:bg-slate-800
                                                                dark:text-slate-300
                                                            "
                                                        >
                                                            {type}
                                                        </span>

                                                    </div>


                                                    <p
                                                        className="
                                                            mt-3
                                                            text-sm
                                                            leading-6
                                                            text-slate-600

                                                            dark:text-slate-300
                                                        "
                                                    >
                                                        {description}
                                                    </p>


                                                    {/* AI LABEL */}

                                                    <div
                                                        className="
                                                            mt-4
                                                            flex
                                                            items-center
                                                            gap-2
                                                            text-xs
                                                            font-medium
                                                            text-purple-600

                                                            dark:text-purple-400
                                                        "
                                                    >

                                                        <BrainCircuit
                                                            className="
                                                                h-4
                                                                w-4
                                                            "
                                                        />

                                                        AI-generated
                                                        recommendation

                                                    </div>

                                                </div>

                                            </div>

                                        </div>
                                    );
                                }
                            )}

                        </div>
                    )}


                {/* ==================================================
                    NO RECOMMENDATIONS
                ================================================== */}

                {selectedProjectId &&
                    !loadingRecommendations &&
                    !error &&
                    recommendations.length === 0 && (

                        <div
                            className="
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                p-12
                                text-center
                                shadow-sm

                                dark:border-slate-700
                                dark:bg-slate-900
                            "
                        >

                            <BrainCircuit
                                className="
                                    mx-auto
                                    mb-4
                                    h-12
                                    w-12
                                    text-slate-400
                                "
                            />


                            <h2
                                className="
                                    text-lg
                                    font-semibold
                                    text-slate-900

                                    dark:text-white
                                "
                            >
                                No Recommendations Available
                            </h2>


                            <p
                                className="
                                    mx-auto
                                    mt-2
                                    max-w-lg
                                    text-sm
                                    leading-6
                                    text-slate-500

                                    dark:text-slate-400
                                "
                            >
                                The AI service did not return
                                any recommendations for this
                                project.
                            </p>

                        </div>
                    )}

            </div>

        </div>
    );
}


export default AIFeatures;