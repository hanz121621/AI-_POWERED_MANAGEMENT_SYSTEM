import { useState, useEffect } from "react";
import { 
  BarChart3, CheckCircle2, XCircle, Clock, TrendingUp, 
  Filter, RefreshCw, Loader2, Eye, Bot, CalendarDays, FolderKanban 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import api from "@/services/api";

export default function AIUsageStatistics() {
  const [statistics, setStatistics] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [featureType, setFeatureType] = useState("");
  
  // Detail Modal
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    fetchStatistics();
  }, [startDate, endDate, featureType]);

  const fetchStatistics = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (featureType) params.featureType = featureType;

      const response = await api.get("/aiusage", { params });
      if (response.data?.success) {
        setStatistics(response.data.data);
        setRecentLogs(response.data.data.recentLogs || []);
      } else {
        setError("Failed to load AI usage statistics.");
      }
    } catch (err) {
      console.error("Failed to load AI usage statistics:", err);
      setError("Failed to load AI usage statistics from the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setStartDate("");
    setEndDate("");
    setFeatureType("");
  };

  if (loading && !statistics) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/30 bg-card">
        <CardContent className="flex items-start gap-3 p-4">
          <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          <p className="text-sm font-medium text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-violet-500/10 p-2">
                <BarChart3 className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <CardTitle className="text-lg">AI Usage Statistics</CardTitle>
                <CardDescription>Monitor AI feature usage and performance across the system.</CardDescription>
              </div>
            </div>
            <Badge variant="outline">AI-003</Badge>
          </div>
        </CardHeader>
      </Card>

      {/* FILTERS */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-base">Filters</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Feature Type</Label>
              <Select value={featureType} onValueChange={setFeatureType}>
                <SelectTrigger>
                  <SelectValue placeholder="All Features" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Features</SelectItem>
                  <SelectItem value="Suggestion">AI Suggestions</SelectItem>
                  <SelectItem value="Test">Connection Tests</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={fetchStatistics} className="flex-1 bg-violet-600 hover:bg-violet-700">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                Apply
              </Button>
              <Button onClick={handleResetFilters} variant="outline">
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SUMMARY CARDS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardDescription>Total AI Requests</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{statistics?.totalRequests || 0}</p>
            <p className="mt-1 text-xs text-muted-foreground">Within selected filters</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>Successful</CardDescription>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-emerald-600">{statistics?.successfulRequests || 0}</p>
            <p className="mt-1 text-xs text-emerald-600">
              {statistics?.totalRequests > 0 ? ((statistics.successfulRequests / statistics.totalRequests) * 100).toFixed(1) : 0}% success rate
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>Failed</CardDescription>
              <XCircle className="h-4 w-4 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">{statistics?.failedRequests || 0}</p>
            <p className="mt-1 text-xs text-red-600">
              {statistics?.totalRequests > 0 ? ((statistics.failedRequests / statistics.totalRequests) * 100).toFixed(1) : 0}% failure rate
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>Avg Response Time</CardDescription>
              <Clock className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">
              {statistics?.averageResponseTime ? Math.round(statistics.averageResponseTime) : 0}ms
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Per request</p>
          </CardContent>
        </Card>
      </div>

      {/* FEATURE BREAKDOWN */}
      {statistics?.featureBreakdown?.length > 0 && (
        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-base">Feature Usage Breakdown</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {statistics.featureBreakdown.map((feature) => (
                <div key={feature.feature} className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-violet-500/10 text-violet-600 border-violet-500/30">
                      {feature.feature}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{feature.count} requests</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{feature.successRate.toFixed(1)}% success</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* RECENT ACTIVITY TABLE */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base">Recent AI Activity</CardTitle>
          <CardDescription>Last 50 AI operations matching your filters</CardDescription>
        </CardHeader>
        <CardContent>
          {recentLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bot className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-sm font-medium text-foreground">No AI usage data found</p>
              <p className="mt-1 text-xs text-muted-foreground">Try adjusting your filters or generate some AI suggestions.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="pb-3 font-medium">Feature</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Model</th>
                    <th className="pb-3 font-medium">Response Time</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentLogs.map((log) => (
                    <tr key={log.id} className="group hover:bg-muted/30">
                      <td className="py-3 font-medium text-foreground">{log.featureType}</td>
                      <td className="py-3">
                        {log.status === "Success" ? (
                          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">Success</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30">Failed</Badge>
                        )}
                      </td>
                      <td className="py-3 text-muted-foreground">{log.modelUsed || "N/A"}</td>
                      <td className="py-3 text-muted-foreground">{log.responseTimeMs ? `${log.responseTimeMs}ms` : "N/A"}</td>
                      <td className="py-3 text-muted-foreground">{new Date(log.createdAt).toLocaleString()}</td>
                      <td className="py-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedLog(log)}
                          className="text-violet-600 hover:bg-violet-500/10 hover:text-violet-700"
                        >
                          <Eye className="mr-2 h-4 w-4" />
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

      {/* DETAIL MODAL */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="max-w-2xl border-violet-500/30 bg-background">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-violet-500/10 p-2">
                <Bot className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <DialogTitle className="text-xl">AI Usage Record Details</DialogTitle>
                <DialogDescription className="mt-1">
                  Operation ID: <span className="font-mono text-foreground">{selectedLog?.id}</span>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <p className="text-xs text-muted-foreground">Feature Type</p>
                <p className="mt-1 font-semibold text-foreground">{selectedLog?.featureType}</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <p className="text-xs text-muted-foreground">Status</p>
                <p className={`mt-1 font-semibold ${selectedLog?.status === "Success" ? "text-emerald-600" : "text-red-600"}`}>
                  {selectedLog?.status}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <p className="text-xs text-muted-foreground">Model Used</p>
                <p className="mt-1 font-semibold text-foreground">{selectedLog?.modelUsed || "N/A"}</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <p className="text-xs text-muted-foreground">Response Time</p>
                <p className="mt-1 font-semibold text-foreground">{selectedLog?.responseTimeMs ? `${selectedLog.responseTimeMs} ms` : "N/A"}</p>
              </div>
            </div>

            {selectedLog?.errorMessage && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                <p className="text-xs font-semibold text-red-600">Error Message</p>
                <p className="mt-1 text-sm text-red-700 dark:text-red-300 whitespace-pre-wrap">{selectedLog.errorMessage}</p>
              </div>
            )}

            <div className="flex justify-between text-xs text-muted-foreground border-t border-border pt-4">
              <span>Recorded: {selectedLog?.createdAt ? new Date(selectedLog.createdAt).toLocaleString() : "N/A"}</span>
            </div>
          </div>

          <div className="flex justify-end border-t border-border pt-4">
            <Button onClick={() => setSelectedLog(null)} className="bg-violet-600 text-white hover:bg-violet-700">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}