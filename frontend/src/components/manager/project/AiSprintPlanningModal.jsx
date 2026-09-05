import React, { useState } from "react";
import { X, CalendarDays, AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import { getAiSprintPlanning } from "@/services/projectService";

function AiSprintPlanningModal({ project, currentManager, onClose, onError }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    setData(null);
    try {
      const response = await getAiSprintPlanning(project.id);
      if (response?.success) setData(response.data);
      else onError(response?.message || "Failed to generate sprint suggestions.");
    } catch (error) {
      onError(error?.response?.data?.message || "AI service unavailable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl max-h-[90vh] flex flex-col">
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-5 text-white shrink-0">
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20 backdrop-blur-sm">
                <CalendarDays size={22} />
              </div>
              <div>
                <h2 className="text-lg font-bold">AI Sprint Planning</h2>
                <p className="mt-0.5 text-sm text-white/80">{project?.name}</p>
              </div>
            </div>
            <button onClick={onClose} disabled={loading} className="rounded-lg p-2 text-white/80 transition hover:bg-white/10">
              <X size={19} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 size={32} className="animate-spin text-indigo-500" />
              <p className="mt-4 text-sm font-medium text-slate-600">Analyzing backlog and capacity...</p>
            </div>
          ) : data ? (
            <div className="space-y-4">
              <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 flex items-center gap-4">
                <CalendarDays size={32} className="text-indigo-600" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-indigo-600 opacity-75">Recommended Capacity</p>
                  <p className="text-xl font-bold text-indigo-900">{data.recommendedSprintCapacity}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase text-slate-500 mb-1">Priority Focus</p>
                  <p className="text-sm text-slate-800">{data.priorityFocus}</p>
                </div>
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-xs font-bold uppercase text-amber-600 mb-1">Potential Blockers</p>
                  <p className="text-sm text-amber-800">{data.potentialBlockers}</p>
                </div>
              </div>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-xs font-bold uppercase text-emerald-600 mb-1">Suggested Sprint Goal</p>
                <p className="text-sm font-semibold text-emerald-900">{data.sprintGoalSuggestion}</p>
              </div>
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 flex items-start gap-3">
                <ArrowRight size={20} className="mt-0.5 shrink-0 text-blue-600" />
                <div>
                  <p className="text-sm font-bold text-blue-900">Recommended Action</p>
                  <p className="text-sm text-blue-800 mt-1">{data.recommendedAction}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <CalendarDays size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-600 mb-4">Click below to let AI suggest an optimal sprint capacity and goals based on your backlog.</p>
              <button onClick={handleGenerate} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:from-indigo-700 hover:to-purple-700">
                <CalendarDays size={18} /> Generate Suggestions
              </button>
            </div>
          )}
        </div>
        <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4 shrink-0">
          <button onClick={onClose} className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100">Close</button>
        </div>
      </div>
    </div>
  );
}

export default AiSprintPlanningModal;