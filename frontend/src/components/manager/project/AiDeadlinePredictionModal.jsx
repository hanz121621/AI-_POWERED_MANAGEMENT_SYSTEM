import React, { useState } from "react";
import { X, CalendarClock, AlertTriangle, CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import { getAiDeadlinePrediction } from "@/services/projectService";

function AiDeadlinePredictionModal({ project, currentManager, onClose, onError }) {
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    setPrediction(null);
    try {
      const response = await getAiDeadlinePrediction(project.id);
      if (response?.success) setPrediction(response.data);
      else onError(response?.message || "Failed to predict deadline.");
    } catch (error) {
      onError(error?.response?.data?.message || "AI service is currently unavailable.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColors = (status) => {
    if (status === "Delayed") return "border-red-200 bg-red-50 text-red-700";
    if (status === "At Risk") return "border-amber-200 bg-amber-50 text-amber-700";
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl max-h-[90vh] flex flex-col">
        
        {/* HEADER */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 px-6 py-5 text-white shrink-0">
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20 backdrop-blur-sm">
                <CalendarClock size={22} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold">AI Deadline Prediction</h2>
                <p className="mt-0.5 text-sm text-white/80">{project?.name}</p>
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
              <Loader2 size={32} className="animate-spin text-blue-500" />
              <p className="mt-4 text-sm font-medium text-slate-600">Analyzing project velocity...</p>
              <p className="mt-1 text-xs text-slate-400">Calculating estimated completion date</p>
            </div>
          ) : prediction ? (
            <div className="space-y-5">
              
              {/* STATUS BANNER */}
              <div className={`rounded-xl border p-4 flex items-center gap-4 ${getStatusColors(prediction.predictedStatus)}`}>
                {prediction.predictedStatus === "Delayed" || prediction.predictedStatus === "At Risk" ? (
                  <AlertTriangle size={32} className="shrink-0" />
                ) : (
                  <CheckCircle size={32} className="shrink-0" />
                )}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide opacity-75">Predicted Status</p>
                  <p className="text-xl font-bold">{prediction.predictedStatus} ({prediction.riskLevel} Risk)</p>
                  <p className="text-sm font-medium mt-1">{prediction.daysVariance}</p>
                </div>
              </div>

              {/* WARNING MESSAGE */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-bold text-slate-900 mb-2">AI Assessment</p>
                <p className="text-sm leading-6 text-slate-700">{prediction.warningMessage}</p>
              </div>

              {/* DETAILS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-blue-600 mb-1">Estimated Completion</p>
                  <p className="text-lg font-bold text-blue-900">{prediction.estimatedCompletionDate}</p>
                </div>
                <div className="rounded-xl border border-violet-100 bg-violet-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-violet-600 mb-1">Contributing Factors</p>
                  <p className="text-sm leading-5 text-violet-900">{prediction.contributingFactors}</p>
                </div>
              </div>

              {/* RECOMMENDED ACTION */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex items-start gap-3">
                  <ArrowRight size={20} className="mt-0.5 shrink-0 text-emerald-600" />
                  <div>
                    <p className="text-sm font-bold text-emerald-900">Recommended Action</p>
                    <p className="text-sm leading-6 text-emerald-800 mt-1">{prediction.recommendedAction}</p>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-8">
              <CalendarClock size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-600 mb-4">Click below to let AI analyze your task completion rate and predict if you will meet your deadline.</p>
              <button onClick={handleGenerate} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:from-indigo-700 hover:to-blue-700">
                <CalendarClock size={18} />
                Predict Deadline
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

export default AiDeadlinePredictionModal;