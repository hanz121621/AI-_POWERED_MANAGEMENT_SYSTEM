namespace AI_PMS.Application.DTOs.Hierarchy;

public class HierarchicalTaskDecompositionResponse
{
public string TaskTitle { get; set; } = string.Empty;


public string TaskSize { get; set; } = string.Empty;

public List<TaskModuleDto> Modules { get; set; } = new();

}

public class TaskModuleDto
{
public string Title { get; set; } = string.Empty;


public string Description { get; set; } = string.Empty;

public List<TaskSubtaskDto> Subtasks { get; set; } = new();

}

public class TaskSubtaskDto
{
public string Title { get; set; } = string.Empty;


public string Description { get; set; } = string.Empty;

public string Complexity { get; set; } = "Medium";

public double EstimatedHours { get; set; }

public List<string> Dependencies { get; set; } = new();

public List<ImplementationTaskDto> ImplementationTasks { get; set; } = new();


}

public class ImplementationTaskDto
{
public string Title { get; set; } = string.Empty;


public string Description { get; set; } = string.Empty;

public string Complexity { get; set; } = "Low";

public double EstimatedHours { get; set; }


}
