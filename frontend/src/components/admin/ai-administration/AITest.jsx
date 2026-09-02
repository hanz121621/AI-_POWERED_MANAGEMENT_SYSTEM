import { useState } from "react";
import { generateAIResponse } from "@/services/aiService";

function AITest() {
    const [prompt, setPrompt] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const testAI = async () => {
        if (!prompt.trim()) {
            setError("Please enter a question.");
            return;
        }

        setLoading(true);
        setResponse("");
        setError("");

        try {
            const result = await generateAIResponse(
                prompt.trim()
            );

            console.log("AI RESPONSE:", result);

            if (result?.success) {
                setResponse(result.content);
            } else {
                setError(
                    result?.errorMessage ||
                    "AI request failed."
                );
            }
        } catch (err) {
            console.error("AI ERROR:", err);

            setError(
                err?.response?.data?.errorMessage ||
                err?.response?.data?.message ||
                err?.message ||
                "Could not connect to AI."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 p-6">

            <div>
                <h2 className="text-2xl font-bold">
                    AI Assistant
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                    Ask the AI anything about project management.
                </p>
            </div>

            <div className="space-y-3">

                <textarea
                    value={prompt}
                    onChange={(e) =>
                        setPrompt(e.target.value)
                    }
                    placeholder="Ask the AI something..."
                    rows={5}
                    disabled={loading}
                    className="w-full rounded-md border p-3 outline-none focus:ring-2"
                />

                <button
                    onClick={testAI}
                    disabled={loading || !prompt.trim()}
                    className="rounded-md border px-5 py-2 font-medium disabled:opacity-50"
                >
                    {loading
                        ? "Asking AI..."
                        : "Ask AI"}
                </button>

            </div>

            {error && (
                <div className="rounded-md border p-4 text-red-500">
                    {error}
                </div>
            )}

            {response && (
                <div className="rounded-md border p-5">

                    <h3 className="mb-3 font-semibold">
                        AI Response
                    </h3>

                    <div className="whitespace-pre-wrap leading-7">
                        {response}
                    </div>

                </div>
            )}

        </div>
    );
}

export default AITest;