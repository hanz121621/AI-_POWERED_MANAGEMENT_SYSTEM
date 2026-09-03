import React, { useState } from "react";
import { X, FileText, AlertTriangle, CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import { generateProjectSummary } from "@/services/projectService";

function AiProjectSummaryModal({ project, currentManager, onClose, onError }) {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    setSummary(null);
    try {
      const response = await generateProjectSummary(project.id);
      if (response?.success) {
        setSummary(response.data);
      } else {
        onError(response?.message || "Failed to generate summary.");
      }
    } catch (error) {
      console.error("AI SUMMARY ERROR:", error);
      onError(error?.response?.data?.message || "AI service is currently unavailable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* HEADER */}
        <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 px-6 py-5 text-white">
          <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20 backdrop-blur-sm">
                <FileText size={22} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold">AI Project Summary</h2>
                <p className="mt-0.5 text-sm text-white/80">{project?.name}</p>
              </div>
            </div>
            <button type="button" onClick={onClose} disabled={loading} className="rounded-lg p-2 text-white/80 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50">
              <X size={19} />
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="max-h-[70vh] overflow-y-auto px-6 py-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 size={32} className="animate-spin text-violet-500" />
              <p className="mt-4 text-sm font-medium text-slate-600">Analyzing project data...</p>
              <p className="mt-1 text-xs text-slate-400">Generating executive summary</p>
            </div>
          ) : summary ? (
            <div className="space-y-6">
              {/* Overall Progress */}
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle size={18} className="text-blue-600" />
                  <h3 className="text-sm font-bold text-blue-900">Overall Progress</h3>
                </div>
                <p className="text-sm leading-6 text-blue-800">{summary.overallProgress}</p>
              </div>

              {/* Key Risks */}
              <div className="rounded-xl border border-red-100 bg-red-50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={18} className="text-red-600" />
                  <h3 className="text-sm font-bold text-red-900">Key Risks</h3>
                </div>
                <ul className="space-y-2">
                  {summary.keyRisks.map((risk, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-red-800">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recent Activities & Next Steps */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="text-sm font-bold text-slate-900 mb-2">Recent Focus</h3>
                  <p className="text-sm leading-6 text-slate-700">{summary.recentActivities}</p>
                </div>
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <h3 className="text-sm font-bold text-emerald-900 mb-2">Recommended Next Steps</h3>
                  <ul className="space-y-2">
                    {summary.nextSteps.map((step, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-emerald-800">
                        <ArrowRight size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-600 mb-4">Click the button below to generate an AI-powered summary of this project's current status, risks, and next steps.</p>
              <button 
                onClick={handleGenerate}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:from-violet-700 hover:to-blue-700 hover:shadow-md"
              >
                <FileText size={18} />
                Generate Summary
              </button>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button type="button" onClick={onClose} className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default AiProjectSummaryModal;