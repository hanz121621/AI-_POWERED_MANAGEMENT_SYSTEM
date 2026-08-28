namespace AI_PMS.Infrastructure.AI.Configuration;

public class AIOptions
{
    public string ApiKey { get; set; } = string.Empty;

    public string Model { get; set; } = "llama3.2:1b";

    public string OllamaUrl { get; set; } = "http://localhost:11434";
}