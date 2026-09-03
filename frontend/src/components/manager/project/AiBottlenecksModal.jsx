import React, { useState } from "react";
import { X, AlertTriangle, Loader2, ArrowRight } from "lucide-react";
import { getAiBottlenecks } from "@/services/projectService";

function AiBottlenecksModal({ project, currentManager, onClose, onError }) {
  const [loading, setLoading] = useState(false);
  const [bottlenecks, setBottlenecks] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    setBottlenecks(null);
    try {
      const response = await getAiBottlenecks(project.id);
      if (response?.success) setBottlenecks(response.data);
      else onError(response?.message || "Failed to detect bottlenecks.");
    } catch (error) {
      onError(error?.response?.data?.message || "AI service is currently unavailable.");
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    if (severity === "Critical") return "border-red-200 bg-red-50 text-red-700";
    if (severity === "High") return "border-orange-200 bg-orange-50 text-orange-700";
    return "border-amber-200 bg-amber-50 text-amber-700";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl max-h-[90vh] flex flex-col">
        <div className="relative overflow-hidden bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 px-6 py-5 text-white shrink-0">
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20 backdrop-blur-sm">
                <AlertTriangle size={22} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold">AI Bottleneck Detection</h2>
                <p className="mt-0.5 text-sm text-white/80">{project?.name}</p>
              </div>
            </div>
            <button onClick={onClose} disabled={loading} className="rounded-lg p-2 text-white/80 transition hover:bg-white/10 hover:text-white">
              <X size={19} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 size={32} className="animate-spin text-red-500" />
              <p className="mt-4 text-sm font-medium text-slate-600">Analyzing project blockers...</p>
            </div>
          ) : bottlenecks ? (
            <div className="space-y-4">
              {bottlenecks.map((bn, index) => (
                <div key={index} className={`rounded-xl border p-4 ${getSeverityColor(bn.severity)}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-white/60">{bn.severity} Severity</span>
                        <span className="text-xs font-semibold uppercase tracking-wide opacity-75">{bn.bottleneckType}</span>
                      </div>
                      <h3 className="text-base font-bold mb-1">Affected Area: {bn.affectedArea}</h3>
                      <p className="text-sm leading-6 mb-2 opacity-90"><strong>Why:</strong> {bn.contributingFactors}</p>
                      <p className="text-sm leading-6 mb-3 opacity-90"><strong>Impact:</strong> {bn.potentialImpact}</p>
                      <div className="flex items-start gap-2 bg-white/50 rounded-lg p-3">
                        <ArrowRight size={16} className="mt-1 shrink-0" />
                        <p className="text-sm font-semibold">Action: {bn.suggestedAction}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertTriangle size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-600 mb-4">Click below to let AI analyze your project data and detect active bottlenecks.</p>
              <button onClick={handleGenerate} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:from-red-600 hover:to-orange-600">
                <AlertTriangle size={18} />
                Detect Bottlenecks
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4 shrink-0">
          <button onClick={onClose} className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default AiBottlenecksModal;