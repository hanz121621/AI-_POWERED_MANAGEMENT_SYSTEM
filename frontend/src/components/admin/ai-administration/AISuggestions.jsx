import { useState, useEffect, useMemo } from "react";
import { getAiSuggestions, viewAiSuggestion } from "@/services/aiService";
import { getProjects } from "@/services/projectService"; // Ensure this path matches your project
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Loader2, Eye, Lightbulb, AlertTriangle, TrendingUp, Calendar, Search, RefreshCw 
} from "lucide-react";

export default function AISuggestions({ projects: parentProjects = [] }) {
  const [suggestions, setSuggestions] = useState([]);
  const [localProjects, setLocalProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Filters
  const [filterType, setFilterType] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [searchProject, setSearchProject] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // View Modal State
  const [viewingSuggestion, setViewingSuggestion] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

  // ========================================================
  // FETCH DATA
  // ========================================================
  useEffect(() => {
    fetchSuggestions();
    if (!parentProjects || parentProjects.length === 0) {
      loadProjects();
    }
  }, [filterType, filterPriority, dateFrom, dateTo]);

  const loadProjects = async () => {
    try {
      const response = await getProjects();
      const projectList = response?.data || response || [];
      setLocalProjects(Array.isArray(projectList) ? projectList : []);
    } catch (err) {
      console.error("Failed to load projects for AI Suggestions:", err);
    }
  };

  const fetchSuggestions = async () => {
    setLoading(true);
    setError("");
    try {
      const filters = {};
      if (filterType !== "All") filters.type = filterType;
      if (filterPriority !== "All") filters.priority = filterPriority;
      if (dateFrom) filters.startDate = dateFrom;
      if (dateTo) filters.endDate = dateTo;
      
      const response = await getAiSuggestions(filters);
      if (response?.success) {
        setSuggestions(response.data || []);
      }
    } catch (err) {
      setError("Failed to load AI suggestions.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ========================================================
  // VIEW SUGGESTION
  // ========================================================
  const handleView = async (suggestion) => {
    setViewLoading(true);
    try {
      const response = await viewAiSuggestion(suggestion.id);
      if (response?.success) {
        setViewingSuggestion(response.data);
        fetchSuggestions(); 
      }
    } catch (err) {
      console.error("Failed to record view:", err);
      setViewingSuggestion(suggestion);
    } finally {
      setViewLoading(false);
    }
  };

  // ========================================================
  // HELPERS
  // ========================================================
  const getProjectName = (projectId) => {
    if (!projectId) return "Unknown Project";
    const projectsToSearch = localProjects.length > 0 ? localProjects : parentProjects;
    const project = projectsToSearch.find((p) => 
      String(p.id) === String(projectId) || 
      String(p.projectId) === String(projectId)
    );
    return project ? project.name : `Unknown Project (ID: ${String(projectId).slice(0, 8)}...)`;
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high": return "bg-red-500/10 text-red-600 border-red-500/30";
      case "medium": return "bg-amber-500/10 text-amber-600 border-amber-500/30";
      case "low": return "bg-emerald-500/10 text-emerald-600 border-emerald-500/30";
      default: return "bg-slate-500/10 text-slate-600 border-slate-500/30";
    }
  };

  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "risk": return <AlertTriangle size={14} className="mr-1.5" />;
      case "optimization": return <TrendingUp size={14} className="mr-1.5" />;
      case "timeline": return <Calendar size={14} className="mr-1.5" />;
      default: return <Lightbulb size={14} className="mr-1.5" />;
    }
  };

  // ========================================================
  // RENDER
  // ========================================================
  return (
    <div className="space-y-6">
      {/* FILTERS */}
      <Card className="border-border bg-card">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search project..." value={searchProject} onChange={(e) => setSearchProject(e.target.value)} className="pl-9" />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Date From</label>
              <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Date To</label>
              <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Types</SelectItem>
                <SelectItem value="Risk">Risk</SelectItem>
                <SelectItem value="Optimization">Optimization</SelectItem>
                <SelectItem value="Timeline">Timeline</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger><SelectValue placeholder="Priority" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Priorities</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={fetchSuggestions} variant="outline" size="sm" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Lightbulb className="h-5 w-5 text-violet-500" /> AI Suggestions Log</CardTitle>
          <CardDescription>View and track all AI-generated project insights.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-violet-500" /></div>
          ) : error ? (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-600">{error}</div>
          ) : suggestions.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-muted-foreground">
              <Lightbulb className="mb-2 h-10 w-10 opacity-20" />
              <p>No AI suggestions found matching your filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="pb-3 font-medium">Priority</th>
                    <th className="pb-3 font-medium">Type</th>
                    <th className="pb-3 font-medium">Title</th>
                    <th className="pb-3 font-medium">Project</th>
                    <th className="pb-3 font-medium">Generated</th>
                    <th className="pb-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {suggestions.filter(s => {
                    if (!searchProject.trim()) return true;
                    const projectName = getProjectName(s.projectId).toLowerCase();
                    return projectName.includes(searchProject.toLowerCase());
                  }).map((s) => (
                    <tr key={s.id} className="group hover:bg-muted/30">
                      <td className="py-3"><Badge variant="outline" className={getPriorityColor(s.priority)}>{s.priority}</Badge></td>
                      <td className="py-3"><div className="flex items-center text-foreground">{getTypeIcon(s.suggestionType)}{s.suggestionType}</div></td>
                      <td className="py-3 font-medium text-foreground">{s.title}</td>
                      <td className="py-3 text-muted-foreground">{getProjectName(s.projectId)}</td>
                      <td className="py-3 text-muted-foreground">{new Date(s.generatedAt).toLocaleDateString()}</td>
                      <td className="py-3 text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleView(s)} disabled={viewLoading} className="text-violet-600 hover:bg-violet-500/10 hover:text-violet-700">
                          {viewLoading && viewingSuggestion?.id === s.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Eye className="mr-2 h-4 w-4" />}
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* VIEW MODAL */}
      <Dialog open={!!viewingSuggestion} onOpenChange={() => setViewingSuggestion(null)}>
        <DialogContent className="max-w-2xl border-violet-500/30 bg-background">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-violet-500/10 p-2"><Lightbulb className="h-5 w-5 text-violet-600" /></div>
              <div>
                <DialogTitle className="text-xl">{viewingSuggestion?.title}</DialogTitle>
                <DialogDescription className="mt-1">Generated for: <span className="font-semibold text-foreground">{getProjectName(viewingSuggestion?.projectId)}</span></DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex gap-2">
              <Badge variant="outline" className={getPriorityColor(viewingSuggestion?.priority)}>{viewingSuggestion?.priority} Priority</Badge>
              <Badge variant="outline" className="border-violet-500/30 bg-violet-500/10 text-violet-600">{getTypeIcon(viewingSuggestion?.suggestionType)}{viewingSuggestion?.suggestionType}</Badge>
            </div>
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <p className="text-sm leading-7 text-foreground">{viewingSuggestion?.description}</p>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground border-t border-border pt-4">
              <span>Generated: {viewingSuggestion?.generatedAt ? new Date(viewingSuggestion.generatedAt).toLocaleString() : "N/A"}</span>
              <span>Viewed: {viewingSuggestion?.viewedAt ? new Date(viewingSuggestion.viewedAt).toLocaleString() : "Never"}</span>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setViewingSuggestion(null)} className="bg-violet-600 text-white hover:bg-violet-700">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}