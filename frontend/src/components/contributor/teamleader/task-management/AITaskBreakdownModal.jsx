import { useState, useEffect } from "react";
import { 
  Sparkles, Trash2, Plus, Loader2, Save, X, Clock, UserCog, RefreshCw, AlertCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import api from "@/services/api"; // 🌟 IMPORT YOUR API SERVICE

function AITaskBreakdownModal({ isOpen, onClose, parentTask, onSaveTasks }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [suggestedTasks, setSuggestedTasks] = useState([]);
  const [error, setError] = useState("");

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen && parentTask) {
      generateAITasks(false);
    } else {
      setSuggestedTasks([]);
      setError("");
    }
  }, [isOpen, parentTask]);

  // 🌟 REAL AI GENERATION CALL TO OLLAMA BACKEND
  const generateAITasks = async (isRegen = false) => {
    setIsLoading(true);
    setIsRegenerating(isRegen);
    setError("");

    try {
      const response = await api.post("/AITask/generate-task-breakdown", {
        sprintGoal: parentTask?.title || "General Sprint Goal",
        sprintDescription: parentTask?.description || "Break down this work into actionable tasks.",
      });

      if (response.data?.success && Array.isArray(response.data?.data)) {
        // Map backend response to frontend state
        const mappedTasks = response.data.data.map((task, index) => ({
          id: Date.now() + index, // Temporary ID for UI state
          title: task.title,
          description: task.description,
          estimatedHours: task.estimatedHours,
          recommendedRole: task.recommendedRole,
        }));
        setSuggestedTasks(mappedTasks);
      } else {
        throw new Error(response.data?.message || "AI returned an invalid response.");
      }
    } catch (err) {
      console.error("AI Generation Error:", err);
      setError(err.response?.data?.message || "Failed to generate AI suggestions. Please ensure Ollama is running.");
    } finally {
      setIsLoading(false);
      setIsRegenerating(false);
    }
  };

  // --- HANDLE INLINE EDITS ---
  const handleTaskChange = (id, field, value) => {
    setSuggestedTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, [field]: value } : task))
    );
  };

  const handleDeleteTask = (id) => {
    setSuggestedTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const handleAddManualTask = () => {
    setSuggestedTasks((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: "",
        description: "",
        estimatedHours: 1,
        recommendedRole: "Developer",
      },
    ]);
  };

  // --- HANDLE SAVE ---
  const handleSave = () => {
    const validTasks = suggestedTasks.filter((t) => t.title.trim() !== "");
    if (validTasks.length === 0) {
      setError("You must have at least one task with a title.");
      return;
    }
    
    if (onSaveTasks) {
      onSaveTasks(validTasks);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-slate-900">
        
        {/* HEADER */}
        <div className="flex items-center justify-between border-b px-6 py-4 bg-slate-50 dark:bg-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">AI Task Breakdown</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Reviewing suggestions for: <span className="font-medium text-slate-700 dark:text-slate-200">{parentTask?.title || "Current Sprint"}</span>
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} disabled={isLoading}>
            <X size={20} />
          </Button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle size={16} className="mt-0.5" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* ACTION BAR */}
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Suggested Subtasks ({suggestedTasks.length})
            </h3>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => generateAITasks(true)} 
                disabled={isLoading}
              >
                <RefreshCw size={14} className={`mr-2 ${isRegenerating ? 'animate-spin' : ''}`} />
                Regenerate
              </Button>
              <Button variant="outline" size="sm" onClick={handleAddManualTask} disabled={isLoading}>
                <Plus size={14} className="mr-2" /> Add Manual
              </Button>
            </div>
          </div>

          {/* LOADING STATE */}
          {isLoading && suggestedTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-500">
              <Loader2 size={40} className="mb-4 animate-spin text-indigo-500" />
              <p className="text-lg font-medium">AI is analyzing requirements...</p>
              <p className="text-sm">Generating optimal task breakdown via Ollama.</p>
            </div>
          ) : (
            /* TASKS LIST */
            <div className="space-y-4">
              {suggestedTasks.map((task, index) => (
                <Card key={task.id} className="border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                          Task {index + 1}
                        </Badge>
                        {task.recommendedRole && (
                          <Badge variant="outline" className="flex items-center gap-1 border-slate-300 dark:border-slate-600">
                            <UserCog size={12} /> {task.recommendedRole}
                          </Badge>
                        )}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <Input
                        placeholder="Task Title"
                        value={task.title}
                        onChange={(e) => handleTaskChange(task.id, "title", e.target.value)}
                        className="font-semibold text-base bg-white dark:bg-slate-900"
                      />
                      <Textarea
                        placeholder="Task Description"
                        value={task.description}
                        onChange={(e) => handleTaskChange(task.id, "description", e.target.value)}
                        rows={2}
                        className="bg-white dark:bg-slate-900"
                      />
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <Clock size={14} />
                        <span>Est. Effort:</span>
                        <Input
                          type="number"
                          value={task.estimatedHours}
                          onChange={(e) => handleTaskChange(task.id, "estimatedHours", e.target.value)}
                          className="w-20 h-7 bg-white dark:bg-slate-900"
                        />
                        <span>hours</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {suggestedTasks.length === 0 && !isLoading && (
                <div className="text-center py-8 text-slate-500 border-2 border-dashed rounded-lg">
                  No tasks generated yet. Click "Regenerate" to try again.
                </div>
              )}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 border-t bg-slate-50 px-6 py-4 dark:bg-slate-800">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading || suggestedTasks.length === 0} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Save size={16} className="mr-2" />
            Save {suggestedTasks.length} Tasks to Sprint
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AITaskBreakdownModal;