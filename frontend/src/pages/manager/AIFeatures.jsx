import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Sparkles, FileText, AlertTriangle, Lightbulb, 
  Users, TrendingUp, CalendarDays, CalendarClock, 
  ChevronDown, BrainCircuit 
} from "lucide-react";

import { getMyProjects } from "@/services/projectService";
import { getCurrentUser } from "@/services/authService";

// Import all the AI modals we built
import AiProjectSummaryModal from "../../components/manager/project/AiProjectSummaryModal";
import AiRecommendationsModal from "../../components/manager/project/AiRecommendationsModal";
import AiBottlenecksModal from "../../components/manager/project/AiBottlenecksModal";
import AiTeamPerformanceModal from "../../components/manager/project/AiTeamPerformanceModal";
import AiProgressPredictionModal from "../../components/manager/project/AiProgressPredictionModal";
import AiDeadlinePredictionModal from "../../components/manager/project/AiDeadlinePredictionModal";
import AiSprintPlanningModal from "../../components/manager/project/AiSprintPlanningModal";

function AIFeatures() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [currentManager, setCurrentManager] = useState(null);
  const [loading, setLoading] = useState(true);

  // Active modal state
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        // 1. Load current manager
        const user = await getCurrentUser();
        if (user) {
          setCurrentManager({ id: user.id, name: user.fullName || user.name });
        }

        // 2. Load assigned projects
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

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  const aiFeatures = [
    {
      id: "summary",
      title: "Automated Project Summary",
      description: "Get a concise, AI-generated executive summary of the project's current health, risks, and next steps.",
      icon: FileText,
      color: "from-violet-500 to-purple-600",
      bg: "bg-violet-50",
      border: "border-violet-200",
      text: "text-violet-700"
    },
    {
      id: "recommendations",
      title: "Project Recommendations",
      description: "Receive 3 actionable, data-driven recommendations to improve project performance and workflow.",
      icon: Lightbulb,
      color: "from-amber-500 to-orange-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-700"
    },
    {
      id: "bottlenecks",
      title: "Detect Bottlenecks",
      description: "Identify active blockers, resource constraints, or process inefficiencies slowing down your project.",
      icon: AlertTriangle,
      color: "from-red-500 to-rose-600",
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-700"
    },
    {
      id: "team",
      title: "Team Performance Analysis",
      description: "Analyze team workload, completion rates, and productivity trends based strictly on project metrics.",
      icon: Users,
      color: "from-blue-500 to-cyan-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-700"
    },
    {
      id: "progress",
      title: "Progress Prediction",
      description: "Forecast future project completion percentage and trajectory based on current velocity.",
      icon: TrendingUp,
      color: "from-emerald-500 to-green-600",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-700"
    },
    {
      id: "deadline",
      title: "Deadline Prediction & Warning",
      description: "Predict if the project will meet its official deadline and get early warnings for potential delays.",
      icon: CalendarClock,
      color: "from-indigo-500 to-blue-600",
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      text: "text-indigo-700"
    },
    {
      id: "sprint",
      title: "Sprint Planning Suggestions",
      description: "Get AI advisory on optimal sprint capacity, priority focus, and potential blockers for the next sprint.",
      icon: CalendarDays,
      color: "from-purple-500 to-pink-600",
      bg: "bg-purple-50",
      border: "border-purple-200",
      text: "text-purple-700"
    }
  ];

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

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 animate-spin items-center justify-center rounded-2xl bg-violet-100">
            <BrainCircuit size={32} className="text-violet-600" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-slate-800">Loading AI Hub...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      
      {/* HEADER */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 p-7 text-white shadow-lg">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-20 right-24 h-44 w-44 rounded-full bg-white/10" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20 backdrop-blur-sm">
              <BrainCircuit size={28} className="text-white" />
            </div>
            <div>
              <div className="mb-1 flex items-center gap-2">
                <Sparkles size={16} className="text-cyan-200" />
                <span className="text-xs font-semibold uppercase tracking-wider text-white/80">
                  AI-Powered Intelligence
                </span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight">AI Features Hub</h1>
              <p className="mt-1 max-w-2xl text-sm text-white/80">
                Select a project below to unlock real-time, data-driven AI insights, predictions, and recommendations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* PROJECT SELECTOR */}
      <div>
        <label className="mb-2 block text-sm font-bold text-slate-700">
          Select a Project to Analyze
        </label>
        <div className="relative max-w-md">
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 py-3 pr-10 text-sm font-medium text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          >
            {projects.length === 0 && <option value="">No projects assigned</option>}
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          <ChevronDown size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      {/* AI FEATURES GRID */}
      {selectedProject ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {aiFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <button
                key={feature.id}
                onClick={() => handleOpenModal(feature.id)}
                className={`group relative overflow-hidden rounded-2xl border ${feature.border} bg-white p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
              >
                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${feature.color}`} />
                <div className="flex items-start justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${feature.bg}`}>
                    <Icon size={24} className={feature.text} />
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition group-hover:bg-violet-100 group-hover:text-violet-600">
                    <ChevronDown size={18} className="-rotate-90" />
                  </div>
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{feature.description}</p>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
          <BrainCircuit size={48} className="mx-auto mb-4 text-slate-300" />
          <h3 className="text-lg font-bold text-slate-800">No Project Selected</h3>
          <p className="mt-2 text-sm text-slate-500">Please select a project from the dropdown above to view AI insights.</p>
        </div>
      )}

      {/* ============================================================
          MODALS RENDERING
      ============================================================ */}
      {selectedProject && currentManager && activeModal === "summary" && (
        <AiProjectSummaryModal project={selectedProject} currentManager={currentManager} onClose={handleCloseModal} onError={handleModalError} />
      )}
      {selectedProject && currentManager && activeModal === "recommendations" && (
        <AiRecommendationsModal project={selectedProject} currentManager={currentManager} onClose={handleCloseModal} onError={handleModalError} />
      )}
      {selectedProject && currentManager && activeModal === "bottlenecks" && (
        <AiBottlenecksModal project={selectedProject} currentManager={currentManager} onClose={handleCloseModal} onError={handleModalError} />
      )}
      {selectedProject && currentManager && activeModal === "team" && (
        <AiTeamPerformanceModal project={selectedProject} currentManager={currentManager} onClose={handleCloseModal} onError={handleModalError} />
      )}
      {selectedProject && currentManager && activeModal === "progress" && (
        <AiProgressPredictionModal project={selectedProject} currentManager={currentManager} onClose={handleCloseModal} onError={handleModalError} />
      )}
      {selectedProject && currentManager && activeModal === "deadline" && (
        <AiDeadlinePredictionModal project={selectedProject} currentManager={currentManager} onClose={handleCloseModal} onError={handleModalError} />
      )}
      {selectedProject && currentManager && activeModal === "sprint" && (
        <AiSprintPlanningModal project={selectedProject} currentManager={currentManager} onClose={handleCloseModal} onError={handleModalError} />
      )}

    </div>
  );
}

export default AIFeatures;