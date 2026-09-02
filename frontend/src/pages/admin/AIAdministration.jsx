import { useMemo, useState } from "react";

import {
  Bot,
  Lightbulb,
  Settings,
  BarChart3,
  RefreshCw,
  ShieldCheck,
  BrainCircuit,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import AISuggestions from "@/components/admin/ai-administration/AISuggestions";
import AISettings from "@/components/admin/ai-administration/AISettings";
import AIUsageStatistics from "@/components/admin/ai-administration/AIUsageStatistics";
import AITest from "@/components/admin/ai-administration/AITest";
// ============================================================
// AI ADMINISTRATION
//
// AI-001 → View AI Suggestions
// AI-002 → Configure AI Settings
// AI-003 → View AI Usage Statistics
// ============================================================

function AIAdministration({
  suggestions = [],
  aiSettings = null,
  aiUsage = [],
  users = [],
  projects = [],
  teams = [],
  loading = false,
  error = "",

  // Parent refresh function
  onRefresh,

  // Save AI settings
  onSaveSettings,

  // AI-003 activity logging
  onAccessAIUsage,
}) {
  // ============================================================
  // ACTIVE TAB
  // ============================================================

  const [activeTab, setActiveTab] = useState("suggestions");

  // ============================================================
  // SYSTEM COUNTS
  // ============================================================

  const summary = useMemo(() => {
    return {
      suggestions: Array.isArray(suggestions)
        ? suggestions.length
        : 0,

      usageRecords: Array.isArray(aiUsage)
        ? aiUsage.length
        : 0,

      projects: Array.isArray(projects)
        ? projects.length
        : 0,

      users: Array.isArray(users)
        ? users.length
        : 0,

      teams: Array.isArray(teams)
        ? teams.length
        : 0,
    };
  }, [
    suggestions,
    aiUsage,
    projects,
    users,
    teams,
  ]);

  // ============================================================
  // REFRESH
  //
  // If the parent provides onRefresh:
  //     use the parent's data refresh function.
  //
  // If not:
  //     reload the current page as a fallback.
  // ============================================================

  const handleRefresh = () => {
    if (typeof onRefresh === "function") {
      onRefresh();
      return;
    }

    // Fallback when parent does not provide refresh logic
    window.location.reload();
  };

  // ============================================================
  // SAVE AI SETTINGS
  // ============================================================

  const handleSaveSettings = (settings) => {
    if (typeof onSaveSettings === "function") {
      onSaveSettings(settings);
    }
  };

  // ============================================================
  // AI-003 ACCESS LOG
  //
  // When admin views AI usage information,
  // the parent can record the activity.
  // ============================================================

  const handleAIUsageAccess = (record) => {
    if (typeof onAccessAIUsage === "function") {
      onAccessAIUsage(record);
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="space-y-6 p-4 md:p-6">

      {/* ========================================================
          PAGE HEADER
      ========================================================= */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        {/* LEFT SIDE */}

        <div className="flex items-start gap-3">

          <div className="rounded-xl border border-border bg-muted p-3">
            <BrainCircuit className="h-6 w-6 text-foreground" />
          </div>

          <div>

            <div className="flex flex-wrap items-center gap-2">

              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                AI Administration
              </h1>

              <Badge variant="outline">
                <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
                Admin
              </Badge>

            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage AI suggestions, configure AI services,
              and monitor AI usage across the system.
            </p>

          </div>

        </div>

        {/* REFRESH */}

        <Button
          type="button"
          variant="outline"
          onClick={handleRefresh}
          disabled={loading}
        >

          <RefreshCw
            className={`mr-2 h-4 w-4 ${
              loading ? "animate-spin" : ""
            }`}
          />

          {loading ? "Refreshing..." : "Refresh"}

        </Button>

      </div>


      {/* ========================================================
          ERROR
      ========================================================= */}

      {error && (
        <Card className="border-destructive/30 bg-card">

          <CardContent className="flex items-start gap-3 p-4">

            <Bot className="mt-0.5 h-5 w-5 text-destructive" />

            <div>

              <p className="font-medium text-foreground">
                AI Administration unavailable
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {error}
              </p>

            </div>

          </CardContent>

        </Card>
      )}


      {/* ========================================================
          AI SYSTEM OVERVIEW
      ========================================================= */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {/* ======================================================
            AI SUGGESTIONS
        ====================================================== */}

        <Card className="border-border bg-card">

          <CardHeader className="pb-2">

            <div className="flex items-center justify-between">

              <CardDescription>
                AI Suggestions
              </CardDescription>

              <Lightbulb className="h-5 w-5 text-muted-foreground" />

            </div>

          </CardHeader>

          <CardContent>

            <p className="text-2xl font-bold text-foreground">
              {summary.suggestions}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Available AI-generated suggestions
            </p>

          </CardContent>

        </Card>


        {/* ======================================================
            AI USAGE
        ====================================================== */}

        <Card className="border-border bg-card">

          <CardHeader className="pb-2">

            <div className="flex items-center justify-between">

              <CardDescription>
                AI Usage
              </CardDescription>

              <BarChart3 className="h-5 w-5 text-muted-foreground" />

            </div>

          </CardHeader>

          <CardContent>

            <p className="text-2xl font-bold text-foreground">
              {summary.usageRecords}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Recorded AI operations
            </p>

          </CardContent>

        </Card>


        {/* ======================================================
            AI PROJECTS
        ====================================================== */}

        <Card className="border-border bg-card">

          <CardHeader className="pb-2">

            <div className="flex items-center justify-between">

              <CardDescription>
                AI Projects
              </CardDescription>

              <Bot className="h-5 w-5 text-muted-foreground" />

            </div>

          </CardHeader>

          <CardContent>

            <p className="text-2xl font-bold text-foreground">
              {summary.projects}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Projects available to AI services
            </p>

          </CardContent>

        </Card>


        {/* ======================================================
            AI USERS
        ====================================================== */}

        <Card className="border-border bg-card">

          <CardHeader className="pb-2">

            <div className="flex items-center justify-between">

              <CardDescription>
                AI Users
              </CardDescription>

              <Settings className="h-5 w-5 text-muted-foreground" />

            </div>

          </CardHeader>

          <CardContent>

            <p className="text-2xl font-bold text-foreground">
              {summary.users}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Users associated with the system
            </p>

          </CardContent>

        </Card>

      </div>


      {/* ========================================================
          AI ADMINISTRATION TABS
      ========================================================= */}

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >

        {/* ======================================================
            TAB BUTTONS
        ====================================================== */}

        <div className="overflow-x-auto">

          <TabsList className="inline-flex min-w-max">

            {/* ==================================================
                AI-001
            ================================================== */}

            <TabsTrigger value="suggestions">

              <Lightbulb className="mr-2 h-4 w-4" />

              AI Suggestions

            </TabsTrigger>


            {/* ==================================================
                AI-002
            ================================================== */}

            <TabsTrigger value="settings">

              <Settings className="mr-2 h-4 w-4" />

              AI Settings

            </TabsTrigger>


            {/* ==================================================
                AI-003
            ================================================== */}

            <TabsTrigger value="usage">

              <BarChart3 className="mr-2 h-4 w-4" />

              Usage Statistics

            </TabsTrigger>
            <TabsTrigger value="test">
  <Bot className="mr-2 h-4 w-4" />
  AI Connection Test
</TabsTrigger>

          </TabsList>

        </div>


        {/* ======================================================
            AI-001 — VIEW AI SUGGESTIONS
        ====================================================== */}

        <TabsContent
          value="suggestions"
          className="space-y-6"
        >

          <AISuggestions
            suggestions={suggestions}
            users={users}
            projects={projects}
            teams={teams}
            loading={loading}
          />

        </TabsContent>


        {/* ======================================================
            AI-002 — CONFIGURE AI SETTINGS
        ====================================================== */}

        <TabsContent
          value="settings"
          className="space-y-6"
        >

          <AISettings
            settings={aiSettings}
            loading={loading}
            onSave={handleSaveSettings}
          />

        </TabsContent>


        {/* ======================================================
            AI-003 — VIEW AI USAGE STATISTICS
        ====================================================== */}

        <TabsContent
          value="usage"
          className="space-y-6"
        >

          <AIUsageStatistics
            aiUsage={aiUsage}
            users={users}
            projects={projects}
            loading={loading}
            error={error}

            // AI-003 BR8
            onAccess={handleAIUsageAccess}

            // Refresh usage data
            onRefresh={handleRefresh}
          />

        </TabsContent>
<TabsContent
  value="test"
  className="space-y-6"
>
  <AITest />
</TabsContent>
      </Tabs>


      {/* ========================================================
          INFORMATION FOOTER
      ========================================================= */}

      <Card className="border-border bg-card">

        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            <div className="rounded-lg border border-border bg-muted p-2">

              <Bot className="h-4 w-4 text-foreground" />

            </div>

            <div>

              <p className="text-sm font-medium text-foreground">
                AI Administration
              </p>

              <p className="text-xs text-muted-foreground">
                AI information is read from configured system
                services and stored system records.
              </p>

            </div>

          </div>

          <Badge variant="outline">
            Controlled AI Management
          </Badge>

        </CardContent>

      </Card>

    </div>
  );
}

export default AIAdministration;