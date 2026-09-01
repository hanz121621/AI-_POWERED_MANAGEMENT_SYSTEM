import React, { useMemo, useState } from "react";
import {
  BrainCircuit,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  RefreshCw,
  Clock3,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";


// ============================================================
// AI-001: VIEW AI RECOMMENDATIONS
// ============================================================
//
// Primary Actor:
// Project Manager
//
// Supporting Actor:
// AI Service
//
// Goal:
// Allow the Project Manager to view AI-generated
// recommendations based on authorized project data.
//
// IMPORTANT:
// - No localStorage
// - No sessionStorage
// - No automatic project modification
// - Recommendations are generated from the data supplied
//   to this component
// - Manager makes the final decision
// - AI-generated information is clearly identified
//
// Expected API integration later:
//
// GET /api/ai/recommendations?projectId={projectId}
//
// The current component is prepared for API integration.
// ============================================================


// ============================================================
// RECOMMENDATION TYPES
// ============================================================

const RECOMMENDATION_TYPES = {
  RISK: "Risk",
  PRODUCTIVITY: "Productivity",
  SCHEDULE: "Schedule",
  TEAM: "Team",
  QUALITY: "Quality",
};


// ============================================================
// PRIORITY STYLES
// ============================================================

function getPriorityClasses(priority) {
  switch (String(priority || "").toLowerCase()) {
    case "high":
      return {
        badge:
          "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
        icon:
          "text-red-600 dark:text-red-400",
      };

    case "medium":
      return {
        badge:
          "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
        icon:
          "text-amber-600 dark:text-amber-400",
      };

    case "low":
      return {
        badge:
          "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
        icon:
          "text-emerald-600 dark:text-emerald-400",
      };

    default:
      return {
        badge:
          "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
        icon:
          "text-slate-600 dark:text-slate-400",
      };
  }
}


// ============================================================
// RECOMMENDATION ICON
// ============================================================

function getRecommendationIcon(type) {
  switch (type) {
    case RECOMMENDATION_TYPES.RISK:
      return AlertTriangle;

    case RECOMMENDATION_TYPES.PRODUCTIVITY:
      return Sparkles;

    case RECOMMENDATION_TYPES.SCHEDULE:
      return Clock3;

    case RECOMMENDATION_TYPES.TEAM:
      return ShieldCheck;

    case RECOMMENDATION_TYPES.QUALITY:
      return CheckCircle2;

    default:
      return Lightbulb;
  }
}


// ============================================================
// EMPTY STATE
// ============================================================

function EmptyRecommendations() {
  return (
    <div
      className="
        flex
        min-h-[280px]
        flex-col
        items-center
        justify-center
        rounded-2xl
        border
        border-dashed
        border-slate-300
        bg-slate-50
        px-6
        text-center

        dark:border-slate-700
        dark:bg-slate-950
      "
    >
      <div
        className="
          mb-4
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-2xl
          bg-blue-50

          dark:bg-blue-950
        "
      >
        <BrainCircuit
          className="
            h-7
            w-7
            text-blue-600

            dark:text-blue-400
          "
        />
      </div>

      <h3
        className="
          text-lg
          font-semibold
          text-slate-900

          dark:text-white
        "
      >
        No AI recommendations yet
      </h3>

      <p
        className="
          mt-2
          max-w-md
          text-sm
          leading-6
          text-slate-500

          dark:text-slate-400
        "
      >
        Select an assigned project and generate AI
        recommendations based on its current project data.
      </p>
    </div>
  );
}


// ============================================================
// RECOMMENDATION CARD
// ============================================================

function RecommendationCard({
  recommendation,
  expanded,
  onToggle,
}) {
  const Icon =
    getRecommendationIcon(
      recommendation.type
    );

  const priorityClasses =
    getPriorityClasses(
      recommendation.priority
    );

  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm
        transition-all
        duration-200

        dark:border-slate-700
        dark:bg-slate-900

        hover:shadow-md
      "
    >
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div
        className="
          flex
          items-start
          justify-between
          gap-4
        "
      >
        <div
          className="
            flex
            min-w-0
            items-start
            gap-3
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
              bg-blue-50

              dark:bg-blue-950
            "
          >
            <Icon
              className={`
                h-5
                w-5
                ${priorityClasses.icon}
              `}
            />
          </div>

          <div className="min-w-0">
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
                  text-base
                  font-semibold
                  text-slate-900

                  dark:text-white
                "
              >
                {recommendation.title}
              </h3>

              <span
                className={`
                  rounded-full
                  px-2.5
                  py-1
                  text-xs
                  font-semibold
                  ${priorityClasses.badge}
                `}
              >
                {recommendation.priority || "Normal"}
              </span>
            </div>

            <p
              className="
                mt-1
                text-xs
                font-medium
                text-slate-500

                dark:text-slate-400
              "
            >
              {recommendation.type || "Recommendation"}
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onToggle}
          aria-label={
            expanded
              ? "Collapse recommendation"
              : "Expand recommendation"
          }
        >
          {expanded ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </Button>
      </div>


      {/* ======================================================
          SUMMARY
      ====================================================== */}

      <p
        className="
          mt-4
          text-sm
          leading-6
          text-slate-600

          dark:text-slate-300
        "
      >
        {recommendation.summary}
      </p>


      {/* ======================================================
          EXPANDED CONTENT
      ====================================================== */}

      {expanded && (
        <div className="mt-5 space-y-4">
          {/* Reason */}

          {recommendation.reason && (
            <div
              className="
                rounded-xl
                bg-slate-50
                p-4

                dark:bg-slate-800
              "
            >
              <p
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide
                  text-slate-500

                  dark:text-slate-400
                "
              >
                AI Analysis
              </p>

              <p
                className="
                  mt-2
                  text-sm
                  leading-6
                  text-slate-700

                  dark:text-slate-300
                "
              >
                {recommendation.reason}
              </p>
            </div>
          )}


          {/* Suggested Action */}

          {recommendation.suggestedAction && (
            <div
              className="
                rounded-xl
                border
                border-blue-200
                bg-blue-50
                p-4

                dark:border-blue-900
                dark:bg-blue-950/40
              "
            >
              <div
                className="
                  flex
                  items-start
                  gap-3
                "
              >
                <Lightbulb
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
                      text-blue-900

                      dark:text-blue-200
                    "
                  >
                    Suggested Action
                  </p>

                  <p
                    className="
                      mt-1
                      text-sm
                      leading-6
                      text-blue-800

                      dark:text-blue-300
                    "
                  >
                    {recommendation.suggestedAction}
                  </p>
                </div>
              </div>
            </div>
          )}


          {/* AI Notice */}

          <div
            className="
              flex
              items-center
              gap-2
              text-xs
              text-slate-400

              dark:text-slate-500
            "
          >
            <BrainCircuit className="h-4 w-4" />

            <span>
              AI-generated recommendation. Manager
              decision is required before taking action.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}


// ============================================================
// MAIN COMPONENT
// ============================================================

function AIRecommendations({
  project = null,
  projectData = null,
  recommendations: externalRecommendations = null,
  loading: externalLoading = false,
  error: externalError = "",
  onRefresh,
}) {
  // ==========================================================
  // STATE
  // ==========================================================

  const [recommendations, setRecommendations] =
    useState(
      Array.isArray(externalRecommendations)
        ? externalRecommendations
        : []
    );

  const [isGenerating, setIsGenerating] =
    useState(false);

  const [error, setError] =
    useState("");

  const [expandedId, setExpandedId] =
    useState(null);


  // ==========================================================
  // SELECTED PROJECT
  // ==========================================================

  const selectedProject =
    project || null;


  // ==========================================================
  // PROJECT NAME
  // ==========================================================

  const projectName =
    selectedProject?.name ||
    selectedProject?.title ||
    selectedProject?.projectName ||
    "Selected Project";


  // ==========================================================
  // AUTHORIZED PROJECT DATA
  // ==========================================================
  //
  // Only data supplied by the parent component is used.
  //
  // No localStorage.
  // No sessionStorage.
  //
  // ==========================================================

  const authorizedData =
    useMemo(() => {
      return (
        projectData ||
        selectedProject ||
        null
      );
    }, [
      projectData,
      selectedProject,
    ]);


  // ==========================================================
  // UPDATE EXTERNAL RECOMMENDATIONS
  // ==========================================================

  React.useEffect(() => {
    if (
      Array.isArray(
        externalRecommendations
      )
    ) {
      setRecommendations(
        externalRecommendations
      );
    }
  }, [
    externalRecommendations,
  ]);


  // ==========================================================
  // GENERATE RECOMMENDATIONS
  // ==========================================================
  //
  // IMPORTANT:
  // This function is deliberately structured for API
  // integration.
  //
  // Replace the TODO section with your .NET API request.
  //
  // Example:
  //
  // const response = await axios.get(
  //   `/api/ai/recommendations/${selectedProject.id}`
  // );
  //
  // ==========================================================

  const generateRecommendations =
    async () => {

      if (!selectedProject) {
        setError(
          "Please select an assigned project first."
        );

        return;
      }


      if (!authorizedData) {
        setError(
          "Authorized project data is not available."
        );

        return;
      }


      setIsGenerating(true);
      setError("");


      try {

        // ====================================================
        // API INTEGRATION POINT
        // ====================================================
        //
        // DO NOT USE localStorage HERE.
        //
        // The backend AI service should:
        //
        // 1. Verify manager authorization
        // 2. Retrieve project data
        // 3. Analyze project data
        // 4. Generate recommendations
        // 5. Return recommendations
        //
        // ====================================================

        if (typeof onRefresh === "function") {

          const result =
            await onRefresh(
              selectedProject,
              authorizedData
            );


          if (Array.isArray(result)) {

            setRecommendations(
              result
            );

          }

        } else {

          // --------------------------------------------------
          // Temporary state-only demonstration.
          //
          // This is NOT stored anywhere.
          //
          // Replace this block with the real AI API call.
          // --------------------------------------------------

          const temporaryRecommendations = [
            {
              id: `ai-${Date.now()}-1`,
              type: RECOMMENDATION_TYPES.SCHEDULE,
              priority: "Medium",
              title: "Review Project Schedule",
              summary:
                "The current project schedule should be reviewed to identify tasks or milestones that may affect the planned completion date.",
              reason:
                "The AI service requires current project progress, sprint information, task status, and milestone data to identify possible schedule pressure.",
              suggestedAction:
                "Review upcoming milestones and prioritize work that could affect the project delivery date.",
            },
            {
              id: `ai-${Date.now()}-2`,
              type: RECOMMENDATION_TYPES.PRODUCTIVITY,
              priority: "Low",
              title: "Review Team Workload",
              summary:
                "Consider reviewing the current workload distribution across the project team.",
              reason:
                "Balanced workload distribution can help reduce bottlenecks and improve project execution.",
              suggestedAction:
                "Review team assignments and redistribute work if a member is overloaded.",
            },
          ];


          setRecommendations(
            temporaryRecommendations
          );
        }

      } catch (generationError) {

        console.error(
          "AI recommendation error:",
          generationError
        );

        setError(
          generationError?.message ||
          "Unable to generate AI recommendations."
        );

      } finally {

        setIsGenerating(false);

      }
    };


  // ==========================================================
  // LOADING
  // ==========================================================

  const loading =
    externalLoading ||
    isGenerating;


  // ==========================================================
  // ERROR
  // ==========================================================

  const displayError =
    externalError ||
    error;


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <section
      className="
        space-y-6
      "
    >
      {/* ======================================================
          HEADER
      ====================================================== */}

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
                h-11
                w-11
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
                AI-generated insights based on authorized
                project data.
              </p>
            </div>
          </div>
        </div>


        {/* Generate / Refresh */}

        <Button
          type="button"
          onClick={
            generateRecommendations
          }
          disabled={
            loading ||
            !selectedProject
          }
          className="gap-2"
        >
          <RefreshCw
            className={`
              h-4
              w-4
              ${loading ? "animate-spin" : ""}
            `}
          />

          {loading
            ? "Analyzing..."
            : recommendations.length > 0
            ? "Refresh Recommendations"
            : "Generate Recommendations"}
        </Button>
      </div>


      {/* ======================================================
          PROJECT INFORMATION
      ====================================================== */}

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
            flex-col
            gap-3

            md:flex-row
            md:items-center
            md:justify-between
          "
        >
          <div>
            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-wide
                text-slate-500

                dark:text-slate-400
              "
            >
              Selected Project
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
              {selectedProject
                ? projectName
                : "No project selected"}
            </h3>
          </div>


          <div
            className="
              inline-flex
              w-fit
              items-center
              gap-2
              rounded-full
              bg-blue-50
              px-3
              py-1.5
              text-xs
              font-semibold
              text-blue-700

              dark:bg-blue-950
              dark:text-blue-300
            "
          >
            <ShieldCheck
              className="h-4 w-4"
            />

            Authorized Project Data
          </div>
        </div>
      </div>


      {/* ======================================================
          AI NOTICE
      ====================================================== */}

      <div
        className="
          rounded-2xl
          border
          border-blue-200
          bg-blue-50
          p-5

          dark:border-blue-900
          dark:bg-blue-950/40
        "
      >
        <div
          className="
            flex
            items-start
            gap-3
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
                font-semibold
                text-blue-900

                dark:text-blue-200
              "
            >
              AI-generated information
            </p>

            <p
              className="
                mt-1
                text-sm
                leading-6
                text-blue-800

                dark:text-blue-300
              "
            >
              These recommendations are generated from
              authorized project information. They do not
              automatically change project data. The Project
              Manager makes the final decision.
            </p>
          </div>
        </div>
      </div>


      {/* ======================================================
          ERROR
      ====================================================== */}

      {displayError && (
        <div
          className="
            flex
            items-start
            gap-3
            rounded-xl
            border
            border-red-200
            bg-red-50
            p-4

            dark:border-red-900
            dark:bg-red-950/40
          "
        >
          <AlertTriangle
            className="
              mt-0.5
              h-5
              w-5
              shrink-0
              text-red-600

              dark:text-red-400
            "
          />

          <div>
            <p
              className="
                font-semibold
                text-red-800

                dark:text-red-300
              "
            >
              Unable to generate recommendations
            </p>

            <p
              className="
                mt-1
                text-sm
                text-red-700

                dark:text-red-400
              "
            >
              {displayError}
            </p>
          </div>
        </div>
      )}


      {/* ======================================================
          RECOMMENDATIONS
      ====================================================== */}

      {!loading &&
        recommendations.length === 0 && (
          <EmptyRecommendations />
        )}


      {!loading &&
        recommendations.length > 0 && (
          <div className="space-y-4">
            {recommendations.map(
              (recommendation, index) => {

                const recommendationId =
                  recommendation.id ||
                  `recommendation-${index}`;

                const isExpanded =
                  expandedId ===
                  recommendationId;

                return (
                  <RecommendationCard
                    key={
                      recommendationId
                    }
                    recommendation={
                      recommendation
                    }
                    expanded={
                      isExpanded
                    }
                    onToggle={() =>
                      setExpandedId(
                        isExpanded
                          ? null
                          : recommendationId
                      )
                    }
                  />
                );
              }
            )}
          </div>
        )}


      {/* ======================================================
          LOADING STATE
      ====================================================== */}

      {loading && (
        <div
          className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-10
            text-center
            shadow-sm

            dark:border-slate-700
            dark:bg-slate-900
          "
        >
          <div
            className="
              mx-auto
              mb-4
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-blue-50

              dark:bg-blue-950
            "
          >
            <BrainCircuit
              className="
                h-7
                w-7
                animate-pulse
                text-blue-600

                dark:text-blue-400
              "
            />
          </div>

          <h3
            className="
              text-lg
              font-semibold
              text-slate-900

              dark:text-white
            "
          >
            AI is analyzing the project
          </h3>

          <p
            className="
              mt-2
              text-sm
              text-slate-500

              dark:text-slate-400
            "
          >
            Reviewing authorized project information and
            generating recommendations...
          </p>
        </div>
      )}


      {/* ======================================================
          FINAL BUSINESS RULE NOTICE
      ====================================================== */}

      {recommendations.length > 0 &&
        !loading && (
          <div
            className="
              flex
              items-start
              gap-3
              rounded-xl
              border
              border-slate-200
              bg-slate-50
              p-4

              dark:border-slate-700
              dark:bg-slate-900
            "
          >
            <CheckCircle2
              className="
                mt-0.5
                h-5
                w-5
                shrink-0
                text-emerald-600

                dark:text-emerald-400
              "
            />

            <div>
              <p
                className="
                  text-sm
                  font-semibold
                  text-slate-800

                  dark:text-slate-200
                "
              >
                Manager decision required
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
                AI recommendations are advisory only.
                No project, sprint, team, or task data is
                automatically modified by this component.
              </p>
            </div>
          </div>
        )}
    </section>
  );
}


// ============================================================
// EXPORT
// ============================================================

export default AIRecommendations;