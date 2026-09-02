import { useMemo, useState } from "react";

import {
    AlertTriangle,
    BrainCircuit,
    CheckCircle2,
    Clock3,
    RefreshCw,
    Users,
    ListChecks,
    CalendarClock,
    Ban,
} from "lucide-react";

import { Button } from "@/components/ui/button";

// ============================================================
// AI-003: GENERATE PROJECT RECOMMENDATIONS
// ============================================================
//
// Primary Actor:
// Project Manager
//
// Supporting Actor:
// AI Service
//
// FRONTEND-ONLY IMPLEMENTATION
//
// Important:
// - Does not modify project data
// - Does not change project status
// - Manager reviews recommendations
// - Recommendations are based only on available frontend data
// - No unsupported project information is presented as fact
// ============================================================

function AIGenerateRecommendations() {

    // ========================================================
    // AVAILABLE FRONTEND PROJECT DATA
    // ========================================================

    const projects = [
        {
            id: 1,
            name: "AI-Powered Project Management System",
            description:
                "AI based project planning, monitoring and collaboration platform.",
            status: "Active",
            progress: 75,
            deadline: "August 30, 2026",
            team: 12,

            delayedTasks: 4,
            blockedTasks: 2,
            sprintProgress: 68,
            workload: "High",
            dependencies: 3,
            currentIssues: 2,
        },

        {
            id: 2,
            name: "FieldSync",
            description:
                "Offline-first rural reporting and data synchronization system.",
            status: "Planning",
            progress: 40,
            deadline: "October 15, 2026",
            team: 8,

            delayedTasks: 1,
            blockedTasks: 0,
            sprintProgress: 45,
            workload: "Medium",
            dependencies: 1,
            currentIssues: 1,
        },

        {
            id: 3,
            name: "Library Management System",
            description:
                "University library automation system.",
            status: "Completed",
            progress: 100,
            deadline: "July 20, 2026",
            team: 5,

            delayedTasks: 0,
            blockedTasks: 0,
            sprintProgress: 100,
            workload: "Low",
            dependencies: 0,
            currentIssues: 0,
        },
    ];

    // ========================================================
    // STATE
    // ========================================================

    const [selectedProjectId, setSelectedProjectId] =
        useState("");

    const [recommendations, setRecommendations] =
        useState([]);

    const [reviewedRecommendations, setReviewedRecommendations] =
        useState({});

    const [generatedAt, setGeneratedAt] =
        useState(null);

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
    // GENERATE RECOMMENDATIONS
    // ========================================================

    const generateRecommendations = (project) => {

        if (!project) {
            setRecommendations([]);
            return;
        }

        const generated = [];

        // ----------------------------------------------------
        // DELAYED TASKS
        // ----------------------------------------------------

        if (project.delayedTasks > 0) {

            generated.push({
                id: "delayed-tasks",
                type: "Task Management",
                title: "Review delayed tasks",
                description:
                    `${project.delayedTasks} delayed task(s) are currently available in the project data. Review their progress and identify actions needed to bring them back on schedule.`,
                priority:
                    project.delayedTasks >= 3
                        ? "High"
                        : "Medium",
                icon: Clock3,
            });
        }

        // ----------------------------------------------------
        // BLOCKED TASKS
        // ----------------------------------------------------

        if (project.blockedTasks > 0) {

            generated.push({
                id: "blocked-work",
                type: "Blocked Work",
                title: "Prioritize blocked work",
                description:
                    `${project.blockedTasks} blocked task(s) are currently recorded. Review blockers and determine whether dependencies, resources, or decisions are preventing progress.`,
                priority: "High",
                icon: Ban,
            });
        }

        // ----------------------------------------------------
        // SPRINT PROGRESS
        // ----------------------------------------------------

        if (project.sprintProgress < 70) {

            generated.push({
                id: "sprint-capacity",
                type: "Sprint",
                title: "Review Sprint capacity",
                description:
                    `Current sprint progress is ${project.sprintProgress}%. Review remaining work and sprint capacity before committing to additional work.`,
                priority:
                    project.sprintProgress < 50
                        ? "High"
                        : "Medium",
                icon: ListChecks,
            });
        }

        // ----------------------------------------------------
        // WORKLOAD
        // ----------------------------------------------------

        if (
            String(project.workload).toLowerCase() ===
            "high"
        ) {

            generated.push({
                id: "workload",
                type: "Resources",
                title: "Review team workload",
                description:
                    "The available project data indicates a high workload. Review task distribution and consider whether work should be redistributed.",
                priority: "High",
                icon: Users,
            });
        }

        // ----------------------------------------------------
        // DEADLINE
        // ----------------------------------------------------

        if (
            project.progress < 80 &&
            project.status === "Active"
        ) {

            generated.push({
                id: "deadline",
                type: "Deadline",
                title: "Review project deadline",
                description:
                    `Project progress is ${project.progress}% with the current deadline recorded as ${project.deadline}. Review remaining work and determine whether the existing schedule is realistic.`,
                priority: "Medium",
                icon: CalendarClock,
            });
        }

        // ----------------------------------------------------
        // DEPENDENCIES
        // ----------------------------------------------------

        if (project.dependencies > 0) {

            generated.push({
                id: "dependencies",
                type: "Dependencies",
                title: "Review project dependencies",
                description:
                    `${project.dependencies} project dependency item(s) are available in the current project data. Review dependency status to reduce potential delays.`,
                priority: "Medium",
                icon: AlertTriangle,
            });
        }

        // ----------------------------------------------------
        // CURRENT ISSUES
        // ----------------------------------------------------

        if (project.currentIssues > 0) {

            generated.push({
                id: "current-issues",
                type: "Issues",
                title: "Address current project issues",
                description:
                    `${project.currentIssues} current issue(s) are recorded in the available project data. Review their impact and determine appropriate corrective actions.`,
                priority: "Medium",
                icon: AlertTriangle,
            });
        }

        // ----------------------------------------------------
        // NO ISSUES
        // ----------------------------------------------------

        if (generated.length === 0) {

            generated.push({
                id: "no-action",
                type: "Project Health",
                title: "Continue monitoring project",
                description:
                    "No recommendation-triggering conditions were found in the currently available project data.",
                priority: "Low",
                icon: CheckCircle2,
            });
        }

        setRecommendations(generated);
        setGeneratedAt(new Date());
        setReviewedRecommendations({});
    };

    // ========================================================
    // PROJECT CHANGE
    // ========================================================

    const handleProjectChange = (event) => {

        const projectId =
            event.target.value;

        setSelectedProjectId(projectId);

        setRecommendations([]);
        setGeneratedAt(null);
        setReviewedRecommendations({});

        if (!projectId) {
            return;
        }

        const project =
            projects.find(
                (item) =>
                    String(item.id) ===
                    String(projectId)
            );

        generateRecommendations(project);
    };

    // ========================================================
    // REFRESH
    // ========================================================

    const handleRefresh = () => {

        if (!selectedProject) {
            return;
        }

        generateRecommendations(
            selectedProject
        );
    };

    // ========================================================
    // REVIEW RECOMMENDATION
    // ========================================================

    const handleReview = (recommendationId) => {

        setReviewedRecommendations(
            (previous) => ({
                ...previous,
                [recommendationId]:
                    !previous[recommendationId],
            })
        );
    };

    // ========================================================
    // PRIORITY STYLES
    // ========================================================

    const getPriorityStyles = (priority) => {

        switch (priority) {

            case "High":
                return {
                    badge:
                        "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
                    border:
                        "border-red-200 dark:border-red-900",
                };

            case "Medium":
                return {
                    badge:
                        "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
                    border:
                        "border-amber-200 dark:border-amber-900",
                };

            default:
                return {
                    badge:
                        "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
                    border:
                        "border-emerald-200 dark:border-emerald-900",
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

                    <div className="flex items-center gap-4">

                        <div
                            className="
                                flex
                                h-12
                                w-12
                                items-center
                                justify-center
                                rounded-xl
                                bg-blue-600
                                text-white
                                shadow-sm
                            "
                        >
                            <BrainCircuit
                                className="h-6 w-6"
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
                                Generate Project Recommendations
                            </h1>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                Use available project data to
                                identify actions that may improve
                                project performance.
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

                        Regenerate

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
                        Recommendations are generated only
                        from the project data currently available
                        in the frontend.
                    </p>

                    <select
                        value={selectedProjectId}
                        onChange={handleProjectChange}
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
                            focus:border-blue-500
                            focus:ring-2
                            focus:ring-blue-500/20
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
                                    key={project.id}
                                    value={project.id}
                                >
                                    {project.name}
                                </option>
                            )
                        )}

                    </select>

                </div>


                {/* ==================================================
                    NO PROJECT
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
                            Project Recommendations
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
                            Select a project to review
                            recommendations based on its
                            available project information.
                        </p>

                    </div>
                )}


                {/* ==================================================
                    RESULTS
                ================================================== */}

                {selectedProject && (

                    <div className="space-y-6">

                        {/* PROJECT INFORMATION */}

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
                                    gap-4
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
                                        {selectedProject.name}
                                    </h2>

                                    <p
                                        className="
                                            mt-1
                                            text-sm
                                            text-slate-500
                                            dark:text-slate-400
                                        "
                                    >
                                        {selectedProject.description}
                                    </p>

                                </div>


                                <div
                                    className="
                                        rounded-xl
                                        bg-slate-100
                                        px-4
                                        py-3
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
                                        Project Progress
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-xl
                                            font-bold
                                            text-slate-900
                                            dark:text-white
                                        "
                                    >
                                        {selectedProject.progress}%
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* RECOMMENDATIONS */}

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

                            <div className="mb-6">

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                    "
                                >

                                    <BrainCircuit
                                        className="
                                            h-6
                                            w-6
                                            text-blue-600
                                        "
                                    />

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

                                </div>

                                <p
                                    className="
                                        mt-2
                                        text-sm
                                        text-slate-500
                                        dark:text-slate-400
                                    "
                                >
                                    Suggested actions based on
                                    currently available project
                                    information.
                                </p>

                            </div>


                            <div className="space-y-4">

                                {recommendations.map(
                                    (recommendation) => {

                                        const styles =
                                            getPriorityStyles(
                                                recommendation.priority
                                            );

                                        const Icon =
                                            recommendation.icon;

                                        const reviewed =
                                            reviewedRecommendations[
                                                recommendation.id
                                            ];

                                        return (

                                            <div
                                                key={
                                                    recommendation.id
                                                }
                                                className={`
                                                    rounded-xl
                                                    border
                                                    p-5
                                                    transition
                                                    ${styles.border}
                                                    ${
                                                        reviewed
                                                            ? "opacity-60"
                                                            : ""
                                                    }
                                                `}
                                            >

                                                <div
                                                    className="
                                                        flex
                                                        gap-4
                                                    "
                                                >

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

                                                        <Icon
                                                            className="
                                                                h-5
                                                                w-5
                                                                text-blue-600
                                                            "
                                                        />

                                                    </div>


                                                    <div className="flex-1">

                                                        <div
                                                            className="
                                                                flex
                                                                flex-col
                                                                gap-2
                                                                sm:flex-row
                                                                sm:items-center
                                                                sm:justify-between
                                                            "
                                                        >

                                                            <div>

                                                                <p
                                                                    className="
                                                                        text-xs
                                                                        font-medium
                                                                        uppercase
                                                                        tracking-wide
                                                                        text-slate-500
                                                                        dark:text-slate-400
                                                                    "
                                                                >
                                                                    {
                                                                        recommendation.type
                                                                    }
                                                                </p>

                                                                <h3
                                                                    className="
                                                                        mt-1
                                                                        text-lg
                                                                        font-bold
                                                                        text-slate-900
                                                                        dark:text-white
                                                                    "
                                                                >
                                                                    {
                                                                        recommendation.title
                                                                    }
                                                                </h3>

                                                            </div>


                                                            <span
                                                                className={`
                                                                    inline-flex
                                                                    w-fit
                                                                    rounded-full
                                                                    px-3
                                                                    py-1
                                                                    text-xs
                                                                    font-semibold
                                                                    ${styles.badge}
                                                                `}
                                                            >
                                                                {
                                                                    recommendation.priority
                                                                }
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
                                                            {
                                                                recommendation.description
                                                            }
                                                        </p>


                                                        <div
                                                            className="
                                                                mt-4
                                                                flex
                                                                items-center
                                                                justify-between
                                                                gap-3
                                                            "
                                                        >

                                                            <span
                                                                className="
                                                                    text-xs
                                                                    text-slate-400
                                                                    dark:text-slate-500
                                                                "
                                                            >
                                                                Recommendation
                                                                only
                                                            </span>


                                                            <Button
                                                                type="button"
                                                                variant={
                                                                    reviewed
                                                                        ? "secondary"
                                                                        : "outline"
                                                                }
                                                                size="sm"
                                                                onClick={() =>
                                                                    handleReview(
                                                                        recommendation.id
                                                                    )
                                                                }
                                                                className="gap-2"
                                                            >

                                                                <CheckCircle2
                                                                    className="h-4 w-4"
                                                                />

                                                                {reviewed
                                                                    ? "Reviewed"
                                                                    : "Mark as Reviewed"}

                                                            </Button>

                                                        </div>

                                                    </div>

                                                </div>

                                            </div>
                                        );
                                    }
                                )}

                            </div>

                        </div>


                        {/* ==================================================
                            BUSINESS RULE NOTICE
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
                                    Recommendation Notice
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
                                    These recommendations do not
                                    automatically change project
                                    data, workload, deadlines,
                                    tasks, or project status.
                                    The Manager must review and
                                    approve any actual project
                                    change.
                                </p>

                            </div>

                        </div>


                        {/* ==================================================
                            FRONTEND DATA NOTICE
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

                            <p
                                className="
                                    text-xs
                                    leading-5
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                Current frontend implementation:
                                recommendations are generated
                                only from the project information
                                available in this interface. No
                                unsupported project information is
                                presented as fact.
                            </p>

                            {generatedAt && (

                                <p
                                    className="
                                        mt-2
                                        text-xs
                                        text-slate-400
                                        dark:text-slate-500
                                    "
                                >
                                    Generated at:{" "}
                                    {generatedAt.toLocaleString()}
                                </p>

                            )}

                        </div>

                    </div>
                )}

            </div>
        </div>
    );
}

export default AIGenerateRecommendations;