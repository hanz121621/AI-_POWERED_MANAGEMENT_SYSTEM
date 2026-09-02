import { useState } from "react";
import { Bot, Send, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { testAiConnection } from "@/services/aiService"; // Make sure this import path is correct!

export default function AITest() {
  const [prompt, setPrompt] = useState("Hello AI, please confirm you are online and ready to assist with project management.");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTest = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setError("");
    setResponse("");

    try {
      const result = await testAiConnection(prompt);
      if (result?.success) {
        setResponse(result.response);
      } else {
        setError(result?.message || "AI returned an empty response.");
      }
    } catch (err) {
      setError("Failed to connect to the AI service. Is Ollama running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-violet-500/10 p-2">
            <Bot className="h-5 w-5 text-violet-600" />
          </div>
          <div>
            <CardTitle className="text-lg">AI Connection Test</CardTitle>
            <CardDescription>
              Send a custom prompt to the local Ollama AI model to verify the connection and test responses.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Custom Prompt</label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type a message for the AI..."
            rows={4}
            className="resize-none"
            disabled={loading}
          />
        </div>

        <Button 
          onClick={handleTest} 
          disabled={loading || !prompt.trim()}
          className="w-full bg-violet-600 hover:bg-violet-700 text-white"
        >
          {loading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
          ) : (
            <><Send className="mr-2 h-4 w-4" /> Test AI Connection</>
          )}
        </Button>

        {error && (
          <div className="flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-600">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {response && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
              AI Response:
            </div>
            <div className="rounded-lg border border-border bg-muted/50 p-4 text-sm text-foreground whitespace-pre-wrap">
              {response}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}