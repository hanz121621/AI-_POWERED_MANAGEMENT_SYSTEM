using AI_PMS.Application.DTOs;
using AI_PMS.Application.Interfaces;

namespace AI_PMS.Infrastructure.AI.Services;

public class StaffAIService : IStaffAIService
{
    private readonly ITaskSizeDetectionService _taskSizeDetectionService;
    private readonly ITaskDecompositionService _taskDecompositionService;
    private readonly IRecommendationService _recommendationService;
    private readonly IRiskPredictionService _riskPredictionService;

    public StaffAIService(
        ITaskSizeDetectionService taskSizeDetectionService,
        ITaskDecompositionService taskDecompositionService,
        IRecommendationService recommendationService,
        IRiskPredictionService riskPredictionService)
    {
        _taskSizeDetectionService =
            taskSizeDetectionService;

        _taskDecompositionService =
            taskDecompositionService;

        _recommendationService =
            recommendationService;

        _riskPredictionService =
            riskPredictionService;
    }

    public async Task<StaffAIResponse> AnalyzeAsync(
        StaffAIRequest request)
    {
        if (request == null)
        {
            throw new ArgumentNullException(nameof(request));
        }

        if (string.IsNullOrWhiteSpace(request.Title))
        {
            throw new ArgumentException(
                "Task title is required.",
                nameof(request));
        }

        if (request.EstimatedHours <= 0)
        {
            throw new ArgumentException(
                "Estimated hours must be greater than zero.",
                nameof(request));
        }

        // =====================================================
        // 1. TASK SIZE
        // =====================================================

        var decompositionRequest =
            new TaskDecompositionRequest
            {
                Title = request.Title,
                Description = request.Description
            };

        var sizeResult =
            await _taskSizeDetectionService
                .DetectTaskSizeAsync(
                    decompositionRequest);

        // =====================================================
        // 2. TASK DECOMPOSITION
        // =====================================================

        var decompositionResult =
            await _taskDecompositionService
                .DecomposeTaskAsync(
                    decompositionRequest,
                    sizeResult.Size);

        // =====================================================
        // 3. AI RECOMMENDATIONS
        // =====================================================

        var recommendationRequest =
            new RecommendationRequest
            {
                Title = request.Title,
                Description = request.Description,
                Complexity = request.Complexity,
                EstimatedHours = request.EstimatedHours
            };

        var recommendationResult =
            await _recommendationService
                .GetRecommendationsAsync(
                    recommendationRequest);

        // =====================================================
        // 4. RISK PREDICTION
        // =====================================================

        var riskRequest =
            new RiskPredictionRequest
            {
                Title = request.Title,
                Description = request.Description,
                Complexity = request.Complexity,
                EstimatedHours = request.EstimatedHours
            };

        var riskResult =
            await _riskPredictionService
                .PredictRiskAsync(
                    riskRequest);

        // =====================================================
        // 5. RETURN STAFF AI RESULT
        // =====================================================

        return new StaffAIResponse
        {
            TaskSize = sizeResult.Size,

            TaskSizeReason =
                sizeResult.Reason,

            Subtasks =
                decompositionResult.Subtasks,

            Recommendations =
                recommendationResult.Recommendations,

            SuggestedActions =
                recommendationResult.SuggestedActions,

            RiskLevel =
                riskResult.RiskLevel,

            RiskScore =
                riskResult.RiskScore,

            Risks =
                riskResult.Risks
        };
    }
}