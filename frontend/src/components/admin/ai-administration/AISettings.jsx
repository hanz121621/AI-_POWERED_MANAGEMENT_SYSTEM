import { useState, useEffect } from "react";
import { Save, Loader2, Brain, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import api from "@/services/api";

export default function AISettings() {
  const [settings, setSettings] = useState({
    isAiEnabled: true,
    modelName: "llama3.2",
    endpoint: "http://localhost:11434",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ========================================================
  // FETCH SETTINGS ON MOUNT
  // ========================================================
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const response = await api.get("/aisettings");
      if (response.data?.success && response.data?.data) {
        setSettings(response.data.data);
      }
    } catch (err) {
      console.error("Failed to load AI settings:", err);
      setError("Failed to load AI settings from the server.");
    } finally {
      setLoading(false);
    }
  };

  // ========================================================
  // UPDATE SETTING
  // ========================================================
  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setError("");
    setSuccess("");
  };

  // ========================================================
  // SAVE CHANGES TO BACKEND
  // ========================================================
  const handleSave = async () => {
    if (!settings.modelName.trim()) {
      setError("Model name is required.");
      return;
    }
    if (!settings.endpoint.trim()) {
      setError("Endpoint URL is required.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.put("/aisettings", settings);
      if (response.data?.success) {
        setSuccess("AI settings updated successfully!");
        setSettings(response.data.data); // Sync with backend response
      } else {
        setError(response.data?.message || "Failed to update settings.");
      }
    } catch (err) {
      console.error("Failed to save AI settings:", err);
      setError(err.response?.data?.message || "An unexpected error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  // ========================================================
  // RESET TO SAVED
  // ========================================================
  const handleReset = () => {
    fetchSettings();
  };

  // ========================================================
  // RENDER
  // ========================================================
  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <div className="rounded-xl border border-border bg-muted p-3">
                <Brain className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <CardTitle className="text-lg text-foreground">AI Settings</CardTitle>
                <CardDescription className="mt-1">
                  Configure and control the local AI services used by AI-PMS.
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline">AI-002</Badge>
          </div>
        </CardHeader>
      </Card>

      {/* ERROR MESSAGE */}
      {error && (
        <Card className="border-destructive/30 bg-card">
          <CardContent className="flex items-start gap-3 p-4">
            <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
            <p className="text-sm font-medium text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* SUCCESS MESSAGE */}
      {success && (
        <Card className="border-emerald-500/30 bg-card">
          <CardContent className="flex items-start gap-3 p-4">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{success}</p>
          </CardContent>
        </Card>
      )}

      {/* AI FEATURES TOGGLE */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-violet-500/10 p-2">
              <Brain className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <CardTitle className="text-base">Global AI Control</CardTitle>
              <CardDescription>Enable or disable all AI-powered functionality across the system.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-4">
            <div className="min-w-0">
              <Label className="text-sm font-medium">Enable AI Features</Label>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                When disabled, the system will block all AI suggestion and analysis requests.
              </p>
            </div>
            <Switch
              checked={settings.isAiEnabled}
              onCheckedChange={(value) => updateSetting("isAiEnabled", value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* AI MODEL CONFIGURATION */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-500/10 p-2">
              <Brain className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-base">Ollama Model Configuration</CardTitle>
              <CardDescription>Specify which local AI model and endpoint the system should use.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="modelName">Model Name</Label>
            <Input
              id="modelName"
              value={settings.modelName}
              onChange={(e) => updateSetting("modelName", e.target.value)}
              placeholder="e.g., llama3.2, mistral, llama3"
              disabled={!settings.isAiEnabled}
            />
            <p className="text-xs text-muted-foreground">
              The exact name of the model pulled in your local Ollama instance.
            </p>
            {!settings.modelName.trim() && (
              <p className="text-xs text-destructive">Model name is required.</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="endpoint">Ollama API Endpoint</Label>
            <Input
              id="endpoint"
              value={settings.endpoint}
              onChange={(e) => updateSetting("endpoint", e.target.value)}
              placeholder="http://localhost:11434"
              disabled={!settings.isAiEnabled}
            />
            <p className="text-xs text-muted-foreground">
              The URL where your Ollama server is running.
            </p>
            {!settings.endpoint.trim() && (
              <p className="text-xs text-destructive">Endpoint URL is required.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* SAVE ACTIONS */}
      <Card className="border-border bg-card">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-muted p-2">
              <RefreshCw className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Configuration changes</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Changes are saved to the database and take effect immediately for all new AI requests.
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={handleReset} disabled={saving}>
              Reset to Saved
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={saving || !settings.isAiEnabled}
              className="bg-violet-600 text-white hover:bg-violet-700"
            >
              {saving ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
              ) : (
                <><Save className="mr-2 h-4 w-4" /> Save Changes</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}