import { useEffect, useState } from "react";

import {
    AlertTriangle,
    BrainCircuit,
    CheckCircle2,
    Clock3,
    Database,
    GitBranch,
    Loader2,
    RefreshCw,
    ShieldAlert,
    Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
    getManagerProjects,
    predictProjectRisk,
} from "@/services/aiService";

// ============================================================
// AI-002: PREDICT PROJECT RISK
// ============================================================
//
// Primary Actor:
// Project Manager
//
// Supporting Actor:
// AI Service
//
// Business Rules:
// 1. Risk predictions are based on available project data.
// 2. AI must not invent project information.
// 3. Risk level comes from the configured AI/risk model.
// 4. Prediction does not automatically modify project data.
// 5. Manager can review predicted risks.
// 6. Project authorization is enforced by backend.
// 7. Supporting factors are displayed when available.
//
// ============================================================

function AIPredictRisk() {

    // ========================================================
    // STATE
    // ========================================================

    const [projects, setProjects] = useState([]);

    const [selectedProjectId, setSelectedProjectId] =
        useState("");

    const [selectedProject, setSelectedProject] =
        useState(null);

    const [riskPrediction, setRiskPrediction] =
        useState(null);

    const [loadingProjects, setLoadingProjects] =
        useState(true);

    const [loadingRisk, setLoadingRisk] =
        useState(false);

    const [error, setError] = useState("");

    const [lastPredictedAt, setLastPredictedAt] =
        useState(null);


    // ========================================================
    // LOAD ASSIGNED PROJECTS ON MOUNT
    // ========================================================

    useEffect(() => {

        loadProjects();

    }, []);


    // ========================================================
    // LOAD ASSIGNED PROJECTS
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
    // GET PROJECT NAME
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
    // GET PROJECT ID
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

        const projectId =
            event.target.value;

        setSelectedProjectId(projectId);

        setSelectedProject(null);
        setRiskPrediction(null);
        setError("");
        setLastPredictedAt(null);

        if (!projectId) {
            return;
        }

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

        await predictRisk(projectId);
    };


    // ========================================================
    // AI-002: PREDICT PROJECT RISK
    // ========================================================

    const predictRisk = async (projectId) => {

        try {

            setLoadingRisk(true);
            setError("");
            setRiskPrediction(null);

            // IMPORTANT:
            // This function must exist in aiService.js.
            const result =
                await predictProjectRisk(
                    projectId
                );

            setRiskPrediction(result);

            setLastPredictedAt(
                new Date()
            );

        } catch (error) {

            console.error(
                "AI risk prediction error:",
                error
            );

            setError(
                error.message ||
                "Unable to predict project risk."
            );

        } finally {

            setLoadingRisk(false);
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

        await predictRisk(
            selectedProjectId
        );
    };


    // ========================================================
    // GET RISK LEVEL
    // ========================================================

    const getRiskLevel = () => {

        if (!riskPrediction) {
            return "Unknown";
        }

        return (
            riskPrediction.riskLevel ||
            riskPrediction.level ||
            riskPrediction.risk ||
            riskPrediction.prediction ||
            "Unknown"
        );
    };


    // ========================================================
    // RISK LEVEL STYLING
    // ========================================================

    const getRiskStyles = () => {

        const level =
            String(
                getRiskLevel()
            )
                .trim()
                .toLowerCase();

        if (level.includes("critical")) {

            return {
                container:
                    "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/30",

                badge:
                    "bg-red-600 text-white",

                icon:
                    "text-red-600 dark:text-red-400",

                label:
                    "Critical Risk",
            };
        }

        if (level.includes("high")) {

            return {
                container:
                    "border-orange-300 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/30",

                badge:
                    "bg-orange-500 text-white",

                icon:
                    "text-orange-600 dark:text-orange-400",

                label:
                    "High Risk",
            };
        }

        if (
            level.includes("medium") ||
            level.includes("moderate")
        ) {

            return {
                container:
                    "border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30",

                badge:
                    "bg-amber-500 text-white",

                icon:
                    "text-amber-600 dark:text-amber-400",

                label:
                    "Medium Risk",
            };
        }

        if (level.includes("low")) {

            return {
                container:
                    "border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30",

                badge:
                    "bg-emerald-600 text-white",

                icon:
                    "text-emerald-600 dark:text-emerald-400",

                label:
                    "Low Risk",
            };
        }

        return {
            container:
                "border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-900",

            badge:
                "bg-slate-600 text-white",

            icon:
                "text-slate-500",

            label:
                "Risk Level Unknown",
        };
    };


    // ========================================================
    // GET RISK SCORE
    // ========================================================

    const getRiskScore = () => {

        if (!riskPrediction) {
            return null;
        }

        return (
            riskPrediction.riskScore ??
            riskPrediction.score ??
            riskPrediction.probability ??
            null
        );
    };


    // ========================================================
    // GET RISK SUMMARY
    // ========================================================

    const getRiskSummary = () => {

        if (!riskPrediction) {
            return "";
        }

        return (
            riskPrediction.summary ||
            riskPrediction.description ||
            riskPrediction.explanation ||
            riskPrediction.message ||
            ""
        );
    };


    // ========================================================
    // GET SUPPORTING FACTORS
    // ========================================================

    const getSupportingFactors = () => {

        if (!riskPrediction) {
            return [];
        }

        const factors =
            riskPrediction.supportingFactors ||
            riskPrediction.factors ||
            riskPrediction.riskFactors ||
            riskPrediction.contributingFactors ||
            [];

        return Array.isArray(factors)
            ? factors
            : [];
    };


    // ========================================================
    // FACTOR ICON
    // ========================================================

    const getFactorIcon = (factor) => {

        const text =
            String(
                factor?.name ||
                factor?.title ||
                factor?.type ||
                factor ||
                ""
            )
                .toLowerCase();

        if (
            text.includes("task") ||
            text.includes("delay")
        ) {

            return (
                <Clock3
                    className="
                        h-5
                        w-5
                        text-orange-500
                    "
                />
            );
        }

        if (text.includes("sprint")) {

            return (
                <GitBranch
                    className="
                        h-5
                        w-5
                        text-blue-500
                    "
                />
            );
        }

        if (
            text.includes("workload") ||
            text.includes("team")
        ) {

            return (
                <Users
                    className="
                        h-5
                        w-5
                        text-purple-500
                    "
                />
            );
        }

        if (text.includes("depend")) {

            return (
                <GitBranch
                    className="
                        h-5
                        w-5
                        text-red-500
                    "
                />
            );
        }

        return (
            <Database
                className="
                    h-5
                    w-5
                    text-slate-500
                "
            />
        );
    };


    // ========================================================
    // FACTOR TITLE
    // ========================================================

    const getFactorTitle = (factor) => {

        if (typeof factor === "string") {
            return factor;
        }

        return (
            factor?.name ||
            factor?.title ||
            factor?.type ||
            "Supporting Factor"
        );
    };


    // ========================================================
    // FACTOR DESCRIPTION
    // ========================================================

    const getFactorDescription = (factor) => {

        if (typeof factor === "string") {
            return "";
        }

        return (
            factor?.description ||
            factor?.details ||
            factor?.message ||
            ""
        );
    };


    // ========================================================
    // DERIVED VALUES
    // ========================================================

    const riskStyles =
        getRiskStyles();

    const riskScore =
        getRiskScore();

    const supportingFactors =
        getSupportingFactors();


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
                                bg-red-600
                                text-white
                                shadow-sm
                            "
                        >

                            <ShieldAlert
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
                                Predict Project Risk
                            </h1>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                Use AI to identify potential
                                risks affecting project success.
                            </p>

                        </div>

                    </div>


                    {/* REFRESH */}

                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleRefresh}
                        disabled={
                            loadingProjects ||
                            loadingRisk
                        }
                        className="gap-2"
                    >

                        <RefreshCw
                            className={`
                                h-4
                                w-4
                                ${
                                    loadingProjects ||
                                    loadingRisk
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
                            predict its current risk.
                        </p>

                    </div>

                    <select
                        value={selectedProjectId}
                        onChange={handleProjectChange}
                        disabled={
                            loadingProjects ||
                            loadingRisk
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

                        {projects.map((project) => {

                            const id =
                                getProjectId(project);

                            return (
                                <option
                                    key={id}
                                    value={id}
                                >
                                    {getProjectName(project)}
                                </option>
                            );
                        })}

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
                    NO PROJECT SELECTED
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

                            <ShieldAlert
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
                                Project Risk Prediction
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
                                Select an assigned project.
                                The AI service will analyze
                                authorized project data and
                                predict potential risks.
                            </p>

                        </div>
                    )}


                {/* ==================================================
                    LOADING
                ================================================== */}

                {selectedProjectId &&
                    loadingRisk && (

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

                            <Loader2
                                className="
                                    mx-auto
                                    mb-4
                                    h-10
                                    w-10
                                    animate-spin
                                    text-red-600
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
                                AI is analyzing project risk...
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
                                project progress, workload,
                                deadlines, dependencies,
                                activity, and current issues.
                            </p>

                        </div>
                    )}


                {/* ==================================================
                    RISK RESULT
                ================================================== */}

                {selectedProjectId &&
                    !loadingRisk &&
                    riskPrediction &&
                    !error && (

                        <div className="space-y-6">

                            {/* PROJECT HEADER */}

                            <div>

                                <h2
                                    className="
                                        text-xl
                                        font-bold
                                        text-slate-900
                                        dark:text-white
                                    "
                                >
                                    Project Risk Analysis
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


                            {/* RISK SUMMARY */}

                            <div
                                className={`
                                    rounded-2xl
                                    border
                                    p-6
                                    shadow-sm
                                    ${riskStyles.container}
                                `}
                            >

                                <div
                                    className="
                                        flex
                                        flex-col
                                        gap-6
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

                                        <AlertTriangle
                                            className={`
                                                h-10
                                                w-10
                                                shrink-0
                                                ${riskStyles.icon}
                                            `}
                                        />

                                        <div>

                                            <p
                                                className="
                                                    text-sm
                                                    font-medium
                                                    text-slate-600
                                                    dark:text-slate-300
                                                "
                                            >
                                                Predicted Risk Level
                                            </p>

                                            <h3
                                                className="
                                                    mt-1
                                                    text-2xl
                                                    font-bold
                                                    text-slate-900
                                                    dark:text-white
                                                "
                                            >
                                                {riskStyles.label}
                                            </h3>

                                        </div>

                                    </div>


                                    <div
                                        className="
                                            flex
                                            flex-col
                                            items-start
                                            gap-2
                                            md:items-end
                                        "
                                    >

                                        <span
                                            className={`
                                                rounded-full
                                                px-4
                                                py-2
                                                text-sm
                                                font-bold
                                                ${riskStyles.badge}
                                            `}
                                        >
                                            {getRiskLevel()}
                                        </span>

                                        {riskScore !== null && (

                                            <span
                                                className="
                                                    text-sm
                                                    font-medium
                                                    text-slate-600
                                                    dark:text-slate-300
                                                "
                                            >
                                                Risk Score:{" "}
                                                {riskScore}
                                            </span>

                                        )}

                                    </div>

                                </div>


                                {/* SUMMARY */}

                                {getRiskSummary() && (

                                    <div
                                        className="
                                            mt-6
                                            border-t
                                            border-slate-200/70
                                            pt-5
                                            dark:border-slate-700
                                        "
                                    >

                                        <p
                                            className="
                                                text-sm
                                                leading-6
                                                text-slate-700
                                                dark:text-slate-300
                                            "
                                        >
                                            {getRiskSummary()}
                                        </p>

                                    </div>

                                )}

                            </div>


                            {/* SUPPORTING FACTORS */}

                            <div
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
                                        mb-5
                                        flex
                                        items-center
                                        gap-3
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            h-10
                                            w-10
                                            items-center
                                            justify-center
                                            rounded-xl
                                            bg-amber-100
                                            dark:bg-amber-950
                                        "
                                    >

                                        <BrainCircuit
                                            className="
                                                h-5
                                                w-5
                                                text-amber-600
                                                dark:text-amber-400
                                            "
                                        />

                                    </div>

                                    <div>

                                        <h3
                                            className="
                                                font-bold
                                                text-slate-900
                                                dark:text-white
                                            "
                                        >
                                            Supporting Factors
                                        </h3>

                                        <p
                                            className="
                                                text-sm
                                                text-slate-500
                                                dark:text-slate-400
                                            "
                                        >
                                            Project data contributing
                                            to the prediction.
                                        </p>

                                    </div>

                                </div>


                                {supportingFactors.length > 0 ? (

                                    <div className="space-y-3">

                                        {supportingFactors.map(
                                            (factor, index) => (

                                                <div
                                                    key={
                                                        factor?.id ||
                                                        factor?.factorId ||
                                                        index
                                                    }
                                                    className="
                                                        flex
                                                        gap-4
                                                        rounded-xl
                                                        border
                                                        border-slate-200
                                                        p-4
                                                        dark:border-slate-700
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            flex
                                                            h-10
                                                            w-10
                                                            shrink-0
                                                            items-center
                                                            justify-center
                                                            rounded-lg
                                                            bg-slate-100
                                                            dark:bg-slate-800
                                                        "
                                                    >
                                                        {getFactorIcon(
                                                            factor
                                                        )}
                                                    </div>

                                                    <div>

                                                        <h4
                                                            className="
                                                                font-semibold
                                                                text-slate-900
                                                                dark:text-white
                                                            "
                                                        >
                                                            {getFactorTitle(
                                                                factor
                                                            )}
                                                        </h4>

                                                        {getFactorDescription(
                                                            factor
                                                        ) && (

                                                            <p
                                                                className="
                                                                    mt-1
                                                                    text-sm
                                                                    leading-6
                                                                    text-slate-600
                                                                    dark:text-slate-300
                                                                "
                                                            >
                                                                {getFactorDescription(
                                                                    factor
                                                                )}
                                                            </p>

                                                        )}

                                                    </div>

                                                </div>

                                            )
                                        )}

                                    </div>

                                ) : (

                                    <div
                                        className="
                                            rounded-xl
                                            bg-slate-50
                                            p-6
                                            text-center
                                            dark:bg-slate-800
                                        "
                                    >

                                        <CheckCircle2
                                            className="
                                                mx-auto
                                                mb-2
                                                h-7
                                                w-7
                                                text-emerald-500
                                            "
                                        />

                                        <p
                                            className="
                                                text-sm
                                                text-slate-600
                                                dark:text-slate-300
                                            "
                                        >
                                            No specific supporting
                                            factors were returned
                                            by the AI service.
                                        </p>

                                    </div>

                                )}

                            </div>


                            {/* AI DISCLAIMER */}

                            <div
                                className="
                                    flex
                                    gap-3
                                    rounded-xl
                                    border
                                    border-blue-200
                                    bg-blue-50
                                    p-4
                                    dark:border-blue-900
                                    dark:bg-blue-950/30
                                "
                            >

                                <BrainCircuit
                                    className="
                                        mt-0.5
                                        h-5
                                        w-5
                                        shrink-0
                                        text-blue-600
                                        dark:text-blue-400
                                    "
                                />

                                <div>

                                    <p
                                        className="
                                            text-sm
                                            font-semibold
                                            text-blue-800
                                            dark:text-blue-300
                                        "
                                    >
                                        AI-generated risk prediction
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-xs
                                            leading-5
                                            text-blue-700
                                            dark:text-blue-400
                                        "
                                    >
                                        This prediction is based on
                                        available authorized project
                                        data. It is a recommendation
                                        only and does not automatically
                                        change the project status or
                                        project data. The Manager makes
                                        the final decision.
                                    </p>

                                </div>

                            </div>


                            {/* GENERATED TIME */}

                            {lastPredictedAt && (

                                <p
                                    className="
                                        text-xs
                                        text-slate-400
                                        dark:text-slate-500
                                    "
                                >
                                    Prediction generated{" "}
                                    {lastPredictedAt.toLocaleString()}
                                </p>

                            )}

                        </div>
                    )}

            </div>

        </div>
    );
}

export default AIPredictRisk;