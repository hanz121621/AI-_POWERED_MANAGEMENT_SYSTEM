import React, { useState } from "react";
import { X, Sparkles, CheckCircle2, AlertTriangle, Clock, Wrench, Loader2 } from "lucide-react";
import { getAiSubtaskBreakdown } from "@/services/taskService"; // Adjust path if needed

function AiSubtaskBreakdownModal({ subtask, onClose, onError }) {
  const [loading, setLoading] = useState(false);
  const [breakdown, setBreakdown] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    setBreakdown(null);
    try {
      const response = await getAiSubtaskBreakdown(subtask.id);
      if (response?.success) setBreakdown(response.data);
      else onError(response?.message || "Failed to generate breakdown.");
    } catch (error) {
      onError(error?.response?.data?.message || "AI service is currently unavailable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl max-h-[90vh] flex flex-col">
        
        {/* HEADER */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 px-6 py-5 text-white shrink-0">
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20 backdrop-blur-sm">
                <Sparkles size={22} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold">AI Technical Breakdown</h2>
                <p className="mt-0.5 text-sm text-white/80">{subtask?.title || subtask?.Title}</p>
              </div>
            </div>
            <button onClick={onClose} disabled={loading} className="rounded-lg p-2 text-white/80 transition hover:bg-white/10 hover:text-white">
              <X size={19} />
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 size={32} className="animate-spin text-indigo-500" />
              <p className="mt-4 text-sm font-medium text-slate-600">Analyzing technical requirements...</p>
              <p className="mt-1 text-xs text-slate-400">Generating implementation steps</p>
            </div>
          ) : breakdown ? (
            <div className="space-y-5">
              
              {/* STEPS */}
              <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
                <h3 className="text-sm font-bold text-indigo-900 mb-3 flex items-center gap-2">
                  <CheckCircle2 size={18} /> Technical Implementation Steps
                </h3>
                <ul className="space-y-2">
                  {breakdown.technicalSteps.map((step, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-indigo-800">
                      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-200 text-xs font-bold text-indigo-700">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* METRICS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-xs font-bold uppercase text-emerald-600 mb-1 flex items-center gap-1">
                    <Clock size={14} /> AI Estimated Effort
                  </p>
                  <p className="text-2xl font-bold text-emerald-900">{breakdown.estimatedHours} hrs</p>
                </div>
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-xs font-bold uppercase text-amber-600 mb-1 flex items-center gap-1">
                    <Wrench size={14} /> Recommended Tools
                  </p>
                  <p className="text-sm font-semibold text-amber-900">{breakdown.recommendedTools || "N/A"}</p>
                </div>
              </div>

              {/* RISKS */}
              <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="text-xs font-bold uppercase text-red-600 mb-1 flex items-center gap-1">
                  <AlertTriangle size={14} /> Potential Risks & Blockers
                </p>
                <p className="text-sm text-red-800">{breakdown.potentialRisks || "No major risks identified."}</p>
              </div>

            </div>
          ) : (
            <div className="text-center py-8">
              <Sparkles size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-600 mb-4">Click below to let AI break down this subtask into concrete technical steps and estimate effort.</p>
              <button onClick={handleGenerate} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:from-indigo-700 hover:to-blue-700">
                <Sparkles size={18} /> Generate AI Breakdown
              </button>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4 shrink-0">
          <button onClick={onClose} className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default AiSubtaskBreakdownModal;