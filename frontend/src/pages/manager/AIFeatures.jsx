import React, { useMemo, useState } from "react";
import {
  BrainCircuit,
  FolderKanban,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Users,
  Target,
  TrendingUp,
  Activity,
  RefreshCw,
  ShieldAlert,
  CalendarDays,
  ListTodo,
  XCircle,
} from "lucide-react";

function AIFeatures() {
  /*
  ============================================================
  DEMO PROJECT DATA
  ============================================================
  Replace this data later with projectService / AI API data.
  ============================================================
  */

  const projects = [
    {
      id: 1,
      name: "AI-Powered Project Management System",
      description:
        "AI-powered project management platform for planning, collaboration, sprint management and intelligent decision-making.",

      progress: 72,

      sprint: {
        name: "Sprint 04",
        status: "In Progress",
        progress: 68,
        daysRemaining: 5,
      },

      deadlines: {
        upcoming: 4,
        overdue: 1,
      },

      workload: 74,

      risks: 3,

      tasks: {
        total: 42,
        completed: 27,
        inProgress: 10,
        pending: 4,
        overdue: 1,
      },

      teamMembers: 8,
    },

    {
      id: 2,
      name: "FieldSync",
      description:
        "Offline-first rural reporting platform for registration, synchronization and field operations.",

      progress: 61,

      sprint: {
        name: "Sprint 03",
        status: "In Progress",
        progress: 54,
        daysRemaining: 8,
      },

      deadlines: {
        upcoming: 6,
        overdue: 0,
      },

      workload: 62,

      risks: 2,

      tasks: {
        total: 35,
        completed: 19,
        inProgress: 9,
        pending: 7,
        overdue: 0,
      },

      teamMembers: 6,
    },

    {
      id: 3,
      name: "Library Management System",
      description:
        "Digital library management platform for books, members, borrowing and reporting.",

      progress: 84,

      sprint: {
        name: "Sprint 06",
        status: "In Progress",
        progress: 86,
        daysRemaining: 3,
      },

      deadlines: {
        upcoming: 2,
        overdue: 0,
      },

      workload: 58,

      risks: 1,

      tasks: {
        total: 28,
        completed: 24,
        inProgress: 3,
        pending: 1,
        overdue: 0,
      },

      teamMembers: 5,
    },
  ];

  /*
  ============================================================
  STATE
  ============================================================
  */

  const [selectedProjectId, setSelectedProjectId] =
    useState(projects[0].id);

  const [recommendations, setRecommendations] =
    useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const [message, setMessage] = useState(null);

  /*
  ============================================================
  SELECTED PROJECT
  ============================================================
  */

  const selectedProject = useMemo(() => {
    return projects.find(
      (project) =>
        Number(project.id) ===
        Number(selectedProjectId)
    );
  }, [selectedProjectId]);

  /*
  ============================================================
  SHOW MESSAGE
  ============================================================
  */

  const showMessage = (type, text) => {
    setMessage({
      type,
      text,
    });

    setTimeout(() => {
      setMessage(null);
    }, 4000);
  };

  /*
  ============================================================
  GENERATE AI RECOMMENDATIONS
  ============================================================
  */

  const generateRecommendations = async () => {
    setError(null);
    setRecommendations(null);

    /*
    ----------------------------------------------------------
    A3: NO PROJECT
    ----------------------------------------------------------
    */

    if (!selectedProject) {
      setError(
        "No project available for AI analysis."
      );

      return;
    }

    /*
    ----------------------------------------------------------
    A1: NO PROJECT DATA
    ----------------------------------------------------------
    */

    if (
      !selectedProject.tasks ||
      selectedProject.tasks.total === 0
    ) {
      setError(
        "Not enough project data to generate recommendations."
      );

      return;
    }

    setLoading(true);

    /*
    ----------------------------------------------------------
    Simulate AI service processing.
    Replace this section later with:
    
    POST /api/ai/recommendations
    ----------------------------------------------------------
    */

    try {
      await new Promise((resolve) =>
        setTimeout(resolve, 1500)
      );

      const generatedRecommendations = [
        {
          id: 1,
          type: "priority",
          title:
            "Prioritize high-impact tasks",
          description:
            "Several important tasks are still in progress. Prioritize authentication, project risk analysis and critical backend tasks before starting lower-priority work.",
          priority: "High",
          icon: ListTodo,
        },

        {
          id: 2,
          type: "deadline",
          title:
            "Review upcoming deadlines",
          description:
            "The project has upcoming deadlines and one overdue task. Consider reviewing the overdue task and assigning additional support if necessary.",
          priority: "High",
          icon: CalendarDays,
        },

        {
          id: 3,
          type: "workload",
          title:
            "Balance team workload",
          description:
            `Current team workload is approximately ${selectedProject.workload}%. Consider redistributing tasks from highly loaded contributors to members with available capacity.`,
          priority: "Medium",
          icon: Users,
        },

        {
          id: 4,
          type: "sprint",
          title:
            "Improve sprint completion",
          description:
            `${selectedProject.sprint.name} is ${selectedProject.sprint.progress}% complete with ${selectedProject.sprint.daysRemaining} days remaining. Focus on completing in-progress tasks before adding new work.`,
          priority: "Medium",
          icon: Target,
        },

        {
          id: 5,
          type: "risk",
          title:
            "Monitor project bottlenecks",
          description:
            `The AI analysis identified ${selectedProject.risks} potential project risks. Review blocked tasks, overdue work and workload concentration to reduce delivery delays.`,
          priority: "High",
          icon: ShieldAlert,
        },
      ];

      setRecommendations(
        generatedRecommendations
      );

      /*
      ----------------------------------------------------------
      Activity Log
      ----------------------------------------------------------

      Later this can call:

      POST /api/activity-log

      ----------------------------------------------------------
      */

      showMessage(
        "success",
        "AI recommendations generated successfully."
      );
    } catch (err) {
      /*
      ----------------------------------------------------------
      A4: AI ANALYSIS FAILED
      ----------------------------------------------------------
      */

      setError(
        "Unable to generate recommendations. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  ============================================================
  RETRY
  ============================================================
  */

  const handleRetry = () => {
    generateRecommendations();
  };

  /*
  ============================================================
  PROJECT CHANGE
  ============================================================
  */

  const handleProjectChange = (event) => {
    setSelectedProjectId(
      Number(event.target.value)
    );

    setRecommendations(null);
    setError(null);
  };

  /*
  ============================================================
  RENDER
  ============================================================
  */

  return (
    <div className="min-h-screen w-full bg-slate-950 p-4 sm:p-6 lg:p-8">

      {/* ======================================================
          MESSAGE
      ====================================================== */}

      {message && (
        <div
          className={`
            fixed
            right-5
            top-5
            z-[100]
            flex
            max-w-md
            items-center
            gap-3
            rounded-xl
            border
            px-4
            py-3
            shadow-2xl
            ${
              message.type === "success"
                ? "border-emerald-500/30 bg-emerald-950/95 text-emerald-300"
                : "border-red-500/30 bg-red-950/95 text-red-300"
            }
          `}
        >
          {message.type === "success" ? (
            <CheckCircle2 size={20} />
          ) : (
            <AlertTriangle size={20} />
          )}

          <span className="text-sm font-medium">
            {message.text}
          </span>
        </div>
      )}

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="mb-7 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

        <div>
          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10">

              <BrainCircuit
                size={27}
                className="text-purple-400"
              />

            </div>

            <div>

              <div className="flex items-center gap-2">

                <h1 className="text-2xl font-bold text-white sm:text-3xl">
                  AI Features
                </h1>

                <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-2.5 py-1 text-xs font-medium text-purple-400">
                  AI-001
                </span>

              </div>

              <p className="mt-1 text-sm text-slate-400">
                Intelligent recommendations for
                project planning and decision-making.
              </p>

            </div>

          </div>
        </div>

        {/* PROJECT SELECTOR */}

        <div className="w-full xl:w-80">

          <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500">
            Select Project
          </label>

          <div className="relative">

            <FolderKanban
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <select
              value={selectedProjectId}
              onChange={handleProjectChange}
              className="
                w-full
                appearance-none
                rounded-xl
                border
                border-slate-700
                bg-slate-900
                px-4
                py-3
                pl-10
                text-sm
                font-medium
                text-white
                outline-none
                transition
                focus:border-purple-500
              "
            >

              {projects.map((project) => (
                <option
                  key={project.id}
                  value={project.id}
                >
                  {project.name}
                </option>
              ))}

            </select>

          </div>

        </div>

      </div>

      {/* ======================================================
          NO PROJECT AVAILABLE
      ====================================================== */}

      {projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No project available for AI analysis."
          description="You do not currently have an assigned project available for AI recommendations."
        />
      ) : (
        <>
          {/* ==================================================
              PROJECT OVERVIEW
          ================================================== */}

          {selectedProject && (
            <div className="mb-6 rounded-2xl border border-slate-700 bg-slate-900/80 p-5 shadow-xl sm:p-6">

              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                <div className="max-w-3xl">

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10">

                      <FolderKanban
                        size={22}
                        className="text-blue-400"
                      />

                    </div>

                    <div>

                      <h2 className="text-xl font-semibold text-white">
                        {selectedProject.name}
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        {selectedProject.description}
                      </p>

                    </div>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={generateRecommendations}
                  disabled={loading}
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-purple-600
                    px-5
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    shadow-lg
                    shadow-purple-900/20
                    transition
                    hover:bg-purple-500
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >

                  {loading ? (
                    <RefreshCw
                      size={18}
                      className="animate-spin"
                    />
                  ) : (
                    <Sparkles size={18} />
                  )}

                  {loading
                    ? "Analyzing Project..."
                    : "Generate AI Recommendations"}

                </button>

              </div>

            </div>
          )}

          {/* ==================================================
              PROJECT DATA ANALYSIS
          ================================================== */}

          {selectedProject && (
            <div className="mb-7">

              <div className="mb-4">

                <h2 className="text-lg font-semibold text-white">
                  Project Data Analysis
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  AI uses these project indicators to
                  generate recommendations.
                </p>

              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">

                <AIDataCard
                  title="Progress"
                  value={`${selectedProject.progress}%`}
                  icon={TrendingUp}
                  iconClass="text-blue-400"
                />

                <AIDataCard
                  title="Tasks"
                  value={selectedProject.tasks.total}
                  icon={ListTodo}
                  iconClass="text-indigo-400"
                />

                <AIDataCard
                  title="Sprint"
                  value={`${selectedProject.sprint.progress}%`}
                  icon={Activity}
                  iconClass="text-purple-400"
                />

                <AIDataCard
                  title="Deadlines"
                  value={
                    selectedProject.deadlines.upcoming
                  }
                  icon={CalendarDays}
                  iconClass="text-amber-400"
                />

                <AIDataCard
                  title="Workload"
                  value={`${selectedProject.workload}%`}
                  icon={Users}
                  iconClass="text-emerald-400"
                />

                <AIDataCard
                  title="Risks"
                  value={selectedProject.risks}
                  icon={ShieldAlert}
                  iconClass="text-red-400"
                />

              </div>

            </div>
          )}

          {/* ==================================================
              ERROR STATE
          ================================================== */}

          {error && (
            <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/5 p-6">

              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10">

                    <XCircle
                      size={23}
                      className="text-red-400"
                    />

                  </div>

                  <div>

                    <h3 className="font-semibold text-red-300">
                      AI Analysis Unavailable
                    </h3>

                    <p className="mt-1 text-sm text-red-400/80">
                      {error}
                    </p>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={handleRetry}
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-red-500/30
                    bg-red-500/10
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    text-red-300
                    transition
                    hover:bg-red-500/20
                  "
                >

                  <RefreshCw size={16} />

                  Try Again

                </button>

              </div>

            </div>
          )}

          {/* ==================================================
              AI RECOMMENDATION PANEL
          ================================================== */}

          {!recommendations && !loading && !error && (
            <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/5 via-slate-900/80 to-blue-500/5 p-8 shadow-xl sm:p-12">

              <div className="mx-auto max-w-2xl text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/10">

                  <BrainCircuit
                    size={34}
                    className="text-purple-400"
                  />

                </div>

                <h2 className="mt-5 text-2xl font-bold text-white">
                  AI Recommendation Panel
                </h2>

                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400">
                  Let AI analyze your project's
                  tasks, sprint progress, deadlines,
                  team workload and risks to provide
                  actionable recommendations.
                </p>

                <div className="mt-7 grid grid-cols-1 gap-3 text-left sm:grid-cols-2">

                  <AIAnalysisItem
                    icon={ListTodo}
                    text="Task priority recommendations"
                  />

                  <AIAnalysisItem
                    icon={AlertTriangle}
                    text="Deadline risk warnings"
                  />

                  <AIAnalysisItem
                    icon={Users}
                    text="Workload balancing suggestions"
                  />

                  <AIAnalysisItem
                    icon={Target}
                    text="Sprint improvement suggestions"
                  />

                  <AIAnalysisItem
                    icon={ShieldAlert}
                    text="Project bottleneck detection"
                  />

                  <AIAnalysisItem
                    icon={TrendingUp}
                    text="Project planning insights"
                  />

                </div>

                <button
                  type="button"
                  onClick={generateRecommendations}
                  className="
                    mt-8
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-purple-600
                    px-6
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    shadow-lg
                    shadow-purple-900/20
                    transition
                    hover:bg-purple-500
                  "
                >

                  <Sparkles size={18} />

                  Analyze Project with AI

                </button>

              </div>

            </div>
          )}

          {/* ==================================================
              LOADING STATE
          ================================================== */}

          {loading && (
            <div className="rounded-2xl border border-purple-500/20 bg-slate-900/80 p-10 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10">

                <BrainCircuit
                  size={30}
                  className="animate-pulse text-purple-400"
                />

              </div>

              <h3 className="mt-5 text-lg font-semibold text-white">
                AI is analyzing your project
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Reviewing tasks, sprint status,
                deadlines, workload and project risks...
              </p>

              <div className="mx-auto mt-6 h-2 max-w-md overflow-hidden rounded-full bg-slate-800">

                <div className="h-full w-2/3 animate-pulse rounded-full bg-purple-500" />

              </div>

            </div>
          )}

          {/* ==================================================
              RECOMMENDATIONS
          ================================================== */}

          {recommendations && !loading && (
            <div className="space-y-6">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <div className="flex items-center gap-2">

                    <Sparkles
                      size={21}
                      className="text-purple-400"
                    />

                    <h2 className="text-xl font-semibold text-white">
                      AI Recommendations
                    </h2>

                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    Intelligent suggestions based on
                    the current project data.
                  </p>

                </div>

                <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2">

                  <CheckCircle2
                    size={17}
                    className="text-emerald-400"
                  />

                  <span className="text-sm font-medium text-emerald-400">
                    AI Analysis Complete
                  </span>

                </div>

              </div>

              <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">

                {recommendations.map(
                  (recommendation) => {
                    const Icon =
                      recommendation.icon;

                    return (
                      <RecommendationCard
                        key={recommendation.id}
                        recommendation={
                          recommendation
                        }
                        Icon={Icon}
                      />
                    );
                  }
                )}

              </div>

              {/* ==================================================
                  AI SUMMARY
              ================================================== */}

              <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6">

                <div className="flex items-start gap-4">

                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-blue-500/10">

                    <BrainCircuit
                      size={22}
                      className="text-blue-400"
                    />

                  </div>

                  <div>

                    <h3 className="font-semibold text-white">
                      AI Decision Support Summary
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      The AI analysis suggests focusing
                      on high-priority work, monitoring
                      deadlines, balancing contributor
                      workload and addressing identified
                      project risks before expanding the
                      current sprint scope.
                    </p>

                    <p className="mt-3 text-xs text-slate-500">
                      Recommendations are decision-support
                      suggestions and should be reviewed by
                      the manager before taking action.
                    </p>

                  </div>

                </div>

              </div>

              {/* ==================================================
                  REFRESH
              ================================================== */}

              <div className="flex justify-end">

                <button
                  type="button"
                  onClick={generateRecommendations}
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-slate-700
                    bg-slate-900
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    text-slate-300
                    transition
                    hover:border-purple-500/40
                    hover:bg-slate-800
                    hover:text-white
                  "
                >

                  <RefreshCw size={16} />

                  Refresh AI Analysis

                </button>

              </div>

            </div>
          )}

        </>
      )}

    </div>
  );
}

/*
================================================================
AI DATA CARD
================================================================
*/

function AIDataCard({
  title,
  value,
  icon: Icon,
  iconClass,
}) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4 transition hover:border-slate-600">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-xs uppercase tracking-wide text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-xl font-bold text-white">
            {value}
          </p>

        </div>

        <Icon
          size={21}
          className={iconClass}
        />

      </div>

    </div>
  );
}

/*
================================================================
AI ANALYSIS ITEM
================================================================
*/

function AIAnalysisItem({
  icon: Icon,
  text,
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3">

      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10">

        <Icon
          size={17}
          className="text-purple-400"
        />

      </div>

      <span className="text-sm text-slate-300">
        {text}
      </span>

    </div>
  );
}

/*
================================================================
RECOMMENDATION CARD
================================================================
*/

function RecommendationCard({
  recommendation,
  Icon,
}) {
  const priorityStyles = {
    High: {
      badge:
        "border-red-500/20 bg-red-500/10 text-red-400",
      icon:
        "bg-red-500/10 text-red-400",
    },

    Medium: {
      badge:
        "border-amber-500/20 bg-amber-500/10 text-amber-400",
      icon:
        "bg-amber-500/10 text-amber-400",
    },

    Low: {
      badge:
        "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
      icon:
        "bg-emerald-500/10 text-emerald-400",
    },
  };

  const style =
    priorityStyles[
      recommendation.priority
    ] || priorityStyles.Medium;

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-5 shadow-lg transition hover:border-purple-500/30">

      <div className="flex items-start justify-between gap-4">

        <div className="flex items-start gap-4">

          <div
            className={`
              flex
              h-11
              w-11
              flex-shrink-0
              items-center
              justify-center
              rounded-xl
              ${style.icon}
            `}
          >

            <Icon size={21} />

          </div>

          <div>

            <h3 className="font-semibold text-white">
              {recommendation.title}
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              {recommendation.description}
            </p>

          </div>

        </div>

        <span
          className={`
            flex-shrink-0
            rounded-full
            border
            px-2.5
            py-1
            text-[10px]
            font-semibold
            uppercase
            tracking-wide
            ${style.badge}
          `}
        >
          {recommendation.priority}
        </span>

      </div>

    </div>
  );
}

/*
================================================================
EMPTY STATE
================================================================
*/

function EmptyState({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-12 text-center">

      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800">

        <Icon
          size={28}
          className="text-slate-500"
        />

      </div>

      <h2 className="mt-5 text-lg font-semibold text-white">
        {title}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
        {description}
      </p>

    </div>
  );
}

export default AIFeatures;