using AI_PMS.Application.DTOs;
using AI_PMS.Application.Interfaces;

namespace AI_PMS.Application.Interface;

public class TaskAnalysisService : ITaskAnalysisService
{
    private readonly ITaskSizeDetectionService _taskSizeDetectionService;
    private readonly ITaskDecompositionService _taskDecompositionService;

    public TaskAnalysisService(
        ITaskSizeDetectionService taskSizeDetectionService,
        ITaskDecompositionService taskDecompositionService)
    {
        _taskSizeDetectionService = taskSizeDetectionService;
        _taskDecompositionService = taskDecompositionService;
    }

    public async Task<TaskAnalysisResponse> AnalyzeTaskAsync(
        TaskAnalysisRequest request)
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

        /*
         * Convert the combined request into
         * the request expected by Task Size Detection.
         */
        var decompositionRequest =
            new TaskDecompositionRequest
            {
                Title = request.Title,
                Description = request.Description
            };

        /*
         * STEP 1
         *
         * Detect task size.
         */
        var sizeResult =
            await _taskSizeDetectionService
                .DetectTaskSizeAsync(decompositionRequest);

        /*
         * STEP 2
         *
         * Decompose the task.
         *
         * The decomposition service will use
         * the detected size to determine the
         * appropriate strategy.
         */
        var decompositionResult =
            await _taskDecompositionService
                .DecomposeTaskAsync(
                    decompositionRequest,
                    sizeResult.Size);

        /*
         * STEP 3
         *
         * Return everything together.
         */
        return new TaskAnalysisResponse
        {
            Size = sizeResult.Size,
            Reason = sizeResult.Reason,
            Subtasks = decompositionResult.Subtasks
        };
    }
}