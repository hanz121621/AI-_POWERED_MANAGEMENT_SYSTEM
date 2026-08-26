import { useMemo, useState } from "react";

import {
    BrainCircuit,
    CheckCircle2,
    Clock3,
    TrendingUp,
    AlertTriangle,
    RefreshCw,
    Target,
    CalendarClock,
    BarChart3,
} from "lucide-react";

import { Button } from "@/components/ui/button";

// ============================================================
// AI-005: PREDICT AI PROJECT PROGRESS
// ============================================================
//
// Use Case ID:
// AI-005
//
// Use Case Name:
// Predict Project Progress
//
// Primary Actor:
// Project Manager
//
// Supporting Actor:
// AI Service
//
// FRONTEND-ONLY IMPLEMENTATION
//
// Business Rules:
// 1. Prediction uses current/historical project data.
// 2. Predicted values are clearly separated from actual values.
// 3. Prediction never overwrites actual progress.
// 4. Prediction is recalculated when project data changes.
// 5. Results are intended for authorized project managers.
// 6. No predicted value is hard-coded.
//
// IMPORTANT:
// This frontend version calculates a projection from the
// available project and sprint data. It does not claim to be
// a real external AI model.
// ============================================================

function AIPredictProgress() {

    // ========================================================
    // AVAILABLE PROJECT DATA
    // ========================================================
    //
    // These values represent CURRENT / HISTORICAL DATA.
    //
    // The prediction itself is NOT stored here.
    // It is calculated dynamically below.
    // ========================================================

    const projects = [
        {
            id: 1,

            name:
                "AI-Powered Project Management System",

            description:
                "AI based project planning, monitoring and collaboration platform.",

            status:
                "Active",

            actualProgress:
                75,

            totalSprints:
                5,

            completedSprints:
                3,

            currentSprintProgress:
                68,

            historicalSprintProgress: [
                55,
                62,
                68,
            ],

            remainingSprints:
                2,

            deadline:
                "August 30, 2026",
        },

        {
            id: 2,

            name:
                "FieldSync",

            description:
                "Offline-first rural reporting and data synchronization system.",

            status:
                "Planning",

            actualProgress:
                40,

            totalSprints:
                4,

            completedSprints:
                1,

            currentSprintProgress:
                45,

            historicalSprintProgress: [
                35,
            ],

            remainingSprints:
                3,

            deadline:
                "October 15, 2026",
        },

        {
            id: 3,

            name:
                "Library Management System",

            description:
                "University library automation system.",

            status:
                "Completed",

            actualProgress:
                100,

            totalSprints:
                3,

            completedSprints:
                3,

            currentSprintProgress:
                100,

            historicalSprintProgress: [
                80,
                95,
                100,
            ],

            remainingSprints:
                0,

            deadline:
                "July 20, 2026",
        },
    ];

    // ========================================================
    // STATE
    // ========================================================

    const [
        selectedProjectId,
        setSelectedProjectId,
    ] = useState("");

    const [
        prediction,
        setPrediction,
    ] = useState(null);

    const [
        predictedAt,
        setPredictedAt,
    ] = useState(null);

    // ========================================================
    // SELECTED PROJECT
    // ========================================================

    const selectedProject = useMemo(() => {

        return projects.find(
            (project) =>
                String(project.id) ===
                String(selectedProjectId)
        );

    }, [selectedProjectId]);

    // ========================================================
    // CALCULATE HISTORICAL AVERAGE
    // ========================================================

    const calculateHistoricalAverage = (
        project
    ) => {

        if (
            !project ||
            !Array.isArray(
                project.historicalSprintProgress
            ) ||
            project.historicalSprintProgress.length === 0
        ) {
            return 0;
        }

        const validValues =
            project.historicalSprintProgress
                .map(Number)
                .filter(
                    (value) =>
                        Number.isFinite(value) &&
                        value >= 0 &&
                        value <= 100
                );

        if (
            validValues.length === 0
        ) {
            return 0;
        }

        const total =
            validValues.reduce(
                (sum, value) =>
                    sum + value,
                0
            );

        return Math.round(
            total /
            validValues.length
        );
    };

    // ========================================================
    // CALCULATE CURRENT VELOCITY
    // ========================================================
    //
    // Velocity is estimated from the difference between
    // current sprint progress and historical average.
    //
    // This is a calculated indicator, NOT actual future data.
    // ========================================================

    const calculateVelocity = (
        project,
        historicalAverage
    ) => {

        if (!project) {
            return 0;
        }

        const currentProgress =
            Number(
                project.currentSprintProgress || 0
            );

        return Math.round(
            currentProgress -
            historicalAverage
        );
    };

    // ========================================================
    // CALCULATE PROJECTED PROGRESS
    // ========================================================
    //
    // No prediction is hard-coded.
    //
    // Formula:
    //
    // historical average
    // +
    // current sprint performance
    // +
    // remaining sprint contribution
    //
    // The result is bounded between actual progress and 100.
    // ========================================================

    const calculatePrediction = (
        project
    ) => {

        if (!project) {
            return null;
        }

        const actualProgress =
            Math.min(
                Math.max(
                    Number(
                        project.actualProgress || 0
                    ),
                    0
                ),
                100
            );

        const currentSprintProgress =
            Math.min(
                Math.max(
                    Number(
                        project.currentSprintProgress ||
                        0
                    ),
                    0
                ),
                100
            );

        const historicalAverage =
            calculateHistoricalAverage(
                project
            );

        const velocity =
            calculateVelocity(
                project,
                historicalAverage
            );

        const completedSprints =
            Math.max(
                Number(
                    project.completedSprints || 0
                ),
                0
            );

        const totalSprints =
            Math.max(
                Number(
                    project.totalSprints || 0
                ),
                0
            );

        const remainingSprints =
            Math.max(
                totalSprints -
                completedSprints,
                0
            );

        // ----------------------------------------------------
        // COMPLETED PROJECT
        // ----------------------------------------------------

        if (
            actualProgress >= 100 ||
            remainingSprints === 0
        ) {

            return {
                actualProgress,
                predictedProgress: 100,
                historicalAverage,
                currentSprintProgress,
                velocity,
                remainingSprints,
                confidence: "High",
                status: "Completed",
                projectedChange:
                    Math.max(
                        100 -
                        actualProgress,
                        0
                    ),
            };
        }

        // ----------------------------------------------------
        // CALCULATED FUTURE PERFORMANCE
        // ----------------------------------------------------

        const trendAdjustedSprintProgress =
            Math.max(
                0,
                Math.min(
                    100,
                    historicalAverage +
                    velocity
                )
            );

        const remainingContribution =
            (
                trendAdjustedSprintProgress *
                remainingSprints
            ) /
            Math.max(
                totalSprints,
                1
            );

        const currentProgressContribution =
            actualProgress *
            (
                completedSprints /
                Math.max(
                    totalSprints,
                    1
                )
            );

        const rawPrediction =
            actualProgress +
            (
                remainingContribution *
                (
                    1 -
                    (
                        completedSprints /
                        Math.max(
                            totalSprints,
                            1
                        )
                    )
                )
            );

        // ----------------------------------------------------
        // STABILIZE PREDICTION
        // ----------------------------------------------------

        const predictedProgress =
            Math.round(
                Math.min(
                    100,
                    Math.max(
                        actualProgress,
                        rawPrediction
                    )
                )
            );

        // ----------------------------------------------------
        // CONFIDENCE
        // ----------------------------------------------------

        let confidence =
            "Low";

        if (
            project.historicalSprintProgress.length >=
            3
        ) {
            confidence = "High";
        } else if (
            project.historicalSprintProgress.length >=
            2
        ) {
            confidence = "Medium";
        }

        return {
            actualProgress,

            predictedProgress,

            historicalAverage,

            currentSprintProgress,

            velocity,

            remainingSprints,

            confidence,

            status:
                predictedProgress >= 80
                    ? "Positive Trend"
                    : predictedProgress >= 60
                        ? "Moderate Trend"
                        : "Needs Attention",

            projectedChange:
                Math.max(
                    predictedProgress -
                    actualProgress,
                    0
                ),
        };
    };

    // ========================================================
    // GENERATE PREDICTION
    // ========================================================

    const generatePrediction = (
        project
    ) => {

        if (!project) {

            setPrediction(null);

            return;
        }

        const result =
            calculatePrediction(
                project
            );

        setPrediction(
            result
        );

        setPredictedAt(
            new Date()
        );
    };

    // ========================================================
    // PROJECT CHANGE
    // ========================================================

    const handleProjectChange = (
        event
    ) => {

        const projectId =
            event.target.value;

        setSelectedProjectId(
            projectId
        );

        setPrediction(null);

        setPredictedAt(null);

        if (!projectId) {
            return;
        }

        const project =
            projects.find(
                (item) =>
                    String(item.id) ===
                    String(projectId)
            );

        generatePrediction(
            project
        );
    };

    // ========================================================
    // REFRESH / RECALCULATE
    // ========================================================

    const handleRefresh = () => {

        if (!selectedProject) {
            return;
        }

        generatePrediction(
            selectedProject
        );
    };

    // ========================================================
    // STATUS STYLES
    // ========================================================

    const getStatusStyles = (
        status
    ) => {

        switch (status) {

            case "Completed":

                return {
                    badge:
                        "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
                    icon:
                        "text-emerald-600",
                };

            case "Positive Trend":

                return {
                    badge:
                        "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
                    icon:
                        "text-emerald-600",
                };

            case "Moderate Trend":

                return {
                    badge:
                        "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
                    icon:
                        "text-amber-600",
                };

            default:

                return {
                    badge:
                        "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
                    icon:
                        "text-red-600",
                };
        }
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
                                bg-indigo-600
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
                                    text-slate-900
                                    dark:text-white
                                "
                            >
                                Predict AI Project Progress
                            </h1>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                Predict future project progress
                                using current and historical
                                project and sprint data.
                            </p>

                        </div>

                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        disabled={!selectedProject}
                        onClick={handleRefresh}
                        className="gap-2"
                    >

                        <RefreshCw
                            className="h-4 w-4"
                        />

                        Recalculate

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

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >

                        <Target
                            className="
                                h-6
                                w-6
                                text-indigo-600
                            "
                        />

                        <div>

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
                                Select a project to calculate
                                its expected future progress.
                            </p>

                        </div>

                    </div>

                    <select
                        value={selectedProjectId}
                        onChange={
                            handleProjectChange
                        }
                        className="
                            mt-4
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
                            focus:border-indigo-500
                            focus:ring-2
                            focus:ring-indigo-500/20
                            dark:border-slate-700
                            dark:bg-slate-800
                            dark:text-white
                        "
                    >

                        <option value="">
                            Select a project
                        </option>

                        {projects.map(
                            (project) => (

                                <option
                                    key={
                                        project.id
                                    }
                                    value={
                                        project.id
                                    }
                                >
                                    {project.name}
                                </option>

                            )
                        )}

                    </select>

                </div>


                {/* ==================================================
                    EMPTY STATE
                ================================================== */}

                {!selectedProject && (

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
                            Project Progress Prediction
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
                            Select a project to calculate
                            its predicted future progress
                            from available current and
                            historical data.
                        </p>

                    </div>

                )}


                {/* ==================================================
                    RESULTS
                ================================================== */}

                {selectedProject &&
                    prediction && (

                    <div className="space-y-6">

                        {/* ==================================================
                            PROJECT INFORMATION
                        ================================================== */}

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
                                    flex
                                    flex-col
                                    gap-5
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
                                        {
                                            selectedProject.name
                                        }
                                    </h2>

                                    <p
                                        className="
                                            mt-1
                                            text-sm
                                            text-slate-500
                                            dark:text-slate-400
                                        "
                                    >
                                        {
                                            selectedProject.description
                                        }
                                    </p>

                                    <div
                                        className="
                                            mt-3
                                            flex
                                            flex-wrap
                                            gap-2
                                        "
                                    >

                                        <span
                                            className="
                                                rounded-full
                                                bg-slate-100
                                                px-3
                                                py-1
                                                text-xs
                                                font-semibold
                                                text-slate-700
                                                dark:bg-slate-800
                                                dark:text-slate-300
                                            "
                                        >
                                            Status:{" "}
                                            {
                                                selectedProject.status
                                            }
                                        </span>

                                        <span
                                            className="
                                                rounded-full
                                                bg-indigo-100
                                                px-3
                                                py-1
                                                text-xs
                                                font-semibold
                                                text-indigo-700
                                                dark:bg-indigo-950
                                                dark:text-indigo-300
                                            "
                                        >
                                            Deadline:{" "}
                                            {
                                                selectedProject.deadline
                                            }
                                        </span>

                                    </div>

                                </div>

                                <div
                                    className="
                                        rounded-xl
                                        bg-slate-100
                                        px-5
                                        py-4
                                        dark:bg-slate-800
                                    "
                                >

                                    <p
                                        className="
                                            text-xs
                                            text-slate-500
                                            dark:text-slate-400
                                        "
                                    >
                                        Actual Progress
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-3xl
                                            font-bold
                                            text-slate-900
                                            dark:text-white
                                        "
                                    >
                                        {
                                            prediction.actualProgress
                                        }%
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-xs
                                            font-medium
                                            text-slate-400
                                        "
                                    >
                                        Current recorded value
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* ==================================================
                            ACTUAL VS PREDICTED
                        ================================================== */}

                        <div
                            className="
                                rounded-2xl
                                border
                                border-indigo-200
                                bg-white
                                p-6
                                shadow-sm
                                dark:border-indigo-900
                                dark:bg-slate-900
                            "
                        >

                            <div
                                className="
                                    mb-6
                                    flex
                                    items-center
                                    gap-3
                                "
                            >

                                <TrendingUp
                                    className="
                                        h-6
                                        w-6
                                        text-indigo-600
                                    "
                                />

                                <div>

                                    <h2
                                        className="
                                            text-xl
                                            font-bold
                                            text-slate-900
                                            dark:text-white
                                        "
                                    >
                                        Projected Future Progress
                                    </h2>

                                    <p
                                        className="
                                            mt-1
                                            text-sm
                                            text-slate-500
                                            dark:text-slate-400
                                        "
                                    >
                                        Predicted value is
                                        calculated separately
                                        from actual project
                                        progress.
                                    </p>

                                </div>

                            </div>


                            <div
                                className="
                                    grid
                                    grid-cols-1
                                    gap-5
                                    md:grid-cols-3
                                "
                            >

                                <ProgressCard
                                    title="Actual Progress"
                                    value={
                                        prediction.actualProgress
                                    }
                                    description="Recorded project progress"
                                    icon={BarChart3}
                                />

                                <ProgressCard
                                    title="Predicted Progress"
                                    value={
                                        prediction.predictedProgress
                                    }
                                    description="Calculated future projection"
                                    icon={TrendingUp}
                                    predicted
                                />

                                <ProgressCard
                                    title="Projected Increase"
                                    value={`+${prediction.projectedChange}%`}
                                    description="Expected change from actual"
                                    icon={Target}
                                    predicted
                                />

                            </div>


                            {/* PROGRESS BARS */}

                            <div className="mt-8 space-y-5">

                                <div>

                                    <div
                                        className="
                                            mb-2
                                            flex
                                            justify-between
                                        "
                                    >

                                        <span
                                            className="
                                                text-sm
                                                font-medium
                                                text-slate-700
                                                dark:text-slate-300
                                            "
                                        >
                                            Actual Progress
                                        </span>

                                        <span
                                            className="
                                                text-sm
                                                font-semibold
                                                text-slate-900
                                                dark:text-white
                                            "
                                        >
                                            {
                                                prediction.actualProgress
                                            }%
                                        </span>

                                    </div>

                                    <div
                                        className="
                                            h-3
                                            overflow-hidden
                                            rounded-full
                                            bg-slate-200
                                            dark:bg-slate-700
                                        "
                                    >

                                        <div
                                            className="
                                                h-full
                                                rounded-full
                                                bg-slate-500
                                            "
                                            style={{
                                                width:
                                                    `${prediction.actualProgress}%`,
                                            }}
                                        />

                                    </div>

                                </div>


                                <div>

                                    <div
                                        className="
                                            mb-2
                                            flex
                                            justify-between
                                        "
                                    >

                                        <span
                                            className="
                                                text-sm
                                                font-medium
                                                text-indigo-700
                                                dark:text-indigo-300
                                            "
                                        >
                                            Predicted Progress
                                        </span>

                                        <span
                                            className="
                                                text-sm
                                                font-semibold
                                                text-indigo-700
                                                dark:text-indigo-300
                                            "
                                        >
                                            {
                                                prediction.predictedProgress
                                            }%
                                        </span>

                                    </div>

                                    <div
                                        className="
                                            h-3
                                            overflow-hidden
                                            rounded-full
                                            bg-indigo-100
                                            dark:bg-indigo-950
                                        "
                                    >

                                        <div
                                            className="
                                                h-full
                                                rounded-full
                                                bg-indigo-600
                                            "
                                            style={{
                                                width:
                                                    `${prediction.predictedProgress}%`,
                                            }}
                                        />

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* ==================================================
                            CALCULATED METRICS
                        ================================================== */}

                        <div
                            className="
                                grid
                                grid-cols-1
                                gap-4
                                sm:grid-cols-2
                                lg:grid-cols-4
                            "
                        >

                            <MetricCard
                                title="Historical Average"
                                value={`${prediction.historicalAverage}%`}
                                icon={BarChart3}
                                description="Average recorded sprint progress"
                            />

                            <MetricCard
                                title="Current Sprint"
                                value={`${prediction.currentSprintProgress}%`}
                                icon={Clock3}
                                description="Current sprint progress"
                            />

                            <MetricCard
                                title="Remaining Sprints"
                                value={
                                    prediction.remainingSprints
                                }
                                icon={CalendarClock}
                                description="Calculated from sprint data"
                            />

                            <MetricCard
                                title="Prediction Confidence"
                                value={
                                    prediction.confidence
                                }
                                icon={CheckCircle2}
                                description="Based on available historical data"
                            />

                        </div>


                        {/* ==================================================
                            ANALYSIS
                        ================================================== */}

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
                                    mb-6
                                    flex
                                    items-center
                                    gap-3
                                "
                            >

                                <BrainCircuit
                                    className="
                                        h-6
                                        w-6
                                        text-indigo-600
                                    "
                                />

                                <div>

                                    <h2
                                        className="
                                            text-xl
                                            font-bold
                                            text-slate-900
                                            dark:text-white
                                        "
                                    >
                                        AI Progress Analysis
                                    </h2>

                                    <p
                                        className="
                                            mt-1
                                            text-sm
                                            text-slate-500
                                            dark:text-slate-400
                                        "
                                    >
                                        The prediction is derived
                                        from the project's available
                                        current and historical
                                        sprint data.
                                    </p>

                                </div>

                            </div>


                            <div className="space-y-4">

                                <AnalysisRow
                                    icon={BarChart3}
                                    title="Historical Performance"
                                    description={
                                        `The recorded historical sprint average is ${prediction.historicalAverage}%.`
                                    }
                                />

                                <AnalysisRow
                                    icon={Clock3}
                                    title="Current Sprint Performance"
                                    description={
                                        `The current sprint has recorded ${prediction.currentSprintProgress}% progress.`
                                    }
                                />

                                <AnalysisRow
                                    icon={TrendingUp}
                                    title="Calculated Trend"
                                    description={
                                        `The current sprint differs from the historical average by ${prediction.velocity} percentage points.`
                                    }
                                />

                                <AnalysisRow
                                    icon={Target}
                                    title="Future Projection"
                                    description={
                                        `Based on the available data, the calculated projected project progress is ${prediction.predictedProgress}%.`
                                    }
                                />

                            </div>

                        </div>


                        {/* ==================================================
                            ADVISORY NOTICE
                        ================================================== */}

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
                                    AI Prediction Notice
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
                                    The actual project progress
                                    remains unchanged. The predicted
                                    value is a separate calculated
                                    projection and is intended only
                                    to support Manager decision-making.
                                    It must not be treated as an actual
                                    project status.
                                </p>

                            </div>

                        </div>


                        {/* ==================================================
                            DATA SOURCE NOTICE
                        ================================================== */}

                        <div
                            className="
                                rounded-xl
                                border
                                border-slate-200
                                bg-slate-50
                                p-4
                                dark:border-slate-700
                                dark:bg-slate-800
                            "
                        >

                            <div
                                className="
                                    flex
                                    gap-3
                                "
                            >

                                <AlertTriangle
                                    className="
                                        mt-0.5
                                        h-5
                                        w-5
                                        shrink-0
                                        text-amber-500
                                    "
                                />

                                <div>

                                    <p
                                        className="
                                            text-sm
                                            font-semibold
                                            text-slate-700
                                            dark:text-slate-300
                                        "
                                    >
                                        Prediction Data Source
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-xs
                                            leading-5
                                            text-slate-500
                                            dark:text-slate-400
                                        "
                                    >
                                        This frontend implementation
                                        calculates the prediction from
                                        the currently available project
                                        progress, sprint progress,
                                        completed sprints, remaining
                                        sprints, and historical sprint
                                        progress. No predicted value is
                                        hard-coded.
                                    </p>

                                    {predictedAt && (

                                        <p
                                            className="
                                                mt-2
                                                text-xs
                                                text-slate-400
                                                dark:text-slate-500
                                            "
                                        >
                                            Prediction calculated:{" "}
                                            {predictedAt.toLocaleString()}
                                        </p>

                                    )}

                                </div>

                            </div>

                        </div>

                    </div>

                )}

            </div>

        </div>
    );
}


// ============================================================
// PROGRESS CARD
// ============================================================

function ProgressCard({
    title,
    value,
    description,
    icon: Icon,
    predicted = false,
}) {

    return (
        <div
            className={`
                rounded-2xl
                border
                p-5
                ${
                    predicted
                        ? "border-indigo-200 bg-indigo-50/50 dark:border-indigo-900 dark:bg-indigo-950/20"
                        : "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
                }
            `}
        >

            <div
                className="
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
                        bg-white
                        shadow-sm
                        dark:bg-slate-900
                    "
                >

                    <Icon
                        className={`
                            h-5
                            w-5
                            ${
                                predicted
                                    ? "text-indigo-600"
                                    : "text-slate-600"
                            }
                        `}
                    />

                </div>

                <div>

                    <p
                        className="
                            text-sm
                            font-medium
                            text-slate-500
                            dark:text-slate-400
                        "
                    >
                        {title}
                    </p>

                    <p
                        className="
                            mt-1
                            text-3xl
                            font-bold
                            text-slate-900
                            dark:text-white
                        "
                    >
                        {value}
                    </p>

                </div>

            </div>

            <p
                className="
                    mt-4
                    text-xs
                    text-slate-500
                    dark:text-slate-400
                "
            >
                {description}
            </p>

        </div>
    );
}


// ============================================================
// METRIC CARD
// ============================================================

function MetricCard({
    title,
    value,
    icon: Icon,
    description,
}) {

    return (
        <div
            className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
                dark:border-slate-700
                dark:bg-slate-900
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
                    bg-indigo-100
                    dark:bg-indigo-950
                "
            >

                <Icon
                    className="
                        h-5
                        w-5
                        text-indigo-600
                        dark:text-indigo-400
                    "
                />

            </div>

            <p
                className="
                    mt-4
                    text-sm
                    font-medium
                    text-slate-500
                    dark:text-slate-400
                "
            >
                {title}
            </p>

            <p
                className="
                    mt-1
                    text-2xl
                    font-bold
                    text-slate-900
                    dark:text-white
                "
            >
                {value}
            </p>

            <p
                className="
                    mt-1
                    text-xs
                    text-slate-400
                    dark:text-slate-500
                "
            >
                {description}
            </p>

        </div>
    );
}


// ============================================================
// ANALYSIS ROW
// ============================================================

function AnalysisRow({
    icon: Icon,
    title,
    description,
}) {

    return (
        <div
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
                    rounded-xl
                    bg-indigo-100
                    dark:bg-indigo-950
                "
            >

                <Icon
                    className="
                        h-5
                        w-5
                        text-indigo-600
                        dark:text-indigo-400
                    "
                />

            </div>

            <div>

                <h3
                    className="
                        font-semibold
                        text-slate-900
                        dark:text-white
                    "
                >
                    {title}
                </h3>

                <p
                    className="
                        mt-1
                        text-sm
                        leading-6
                        text-slate-600
                        dark:text-slate-300
                    "
                >
                    {description}
                </p>

            </div>

        </div>
    );
}


export default AIPredictProgress;