import React, { useMemo, useState } from "react";

import {
  Plus,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  ListTodo,
  Search,
  Activity,
  Flag,
  CalendarDays,
  Eye,
  CheckCircle,
  RotateCcw,
} from "lucide-react";

import CreateTaskModal from "../../components/manager/task/CreateTaskModal";
import UpdateTaskModal from "../../components/manager/task/UpdateTaskModal";
import DeleteTaskModal from "../../components/manager/task/DeleteTaskModal";
import AssignContributorModal from "../../components/manager/task/AssignContributorModal";
import SetPriorityModal from "../../components/manager/task/SetPriorityModal";
import SetDeadlineModal from "../../components/manager/task/SetDeadlineModal";
import ViewTaskModal from "../../components/manager/task/ViewTaskModal";
import UpdateTaskStatusModal from "../../components/manager/task/UpdateTaskStatusModal";
import ReviewCompletedTaskModal from "../../components/manager/task/ReviewCompletedTaskModal";
import TaskCard from "../../components/manager/task/TaskCard";

function TaskManagement() {
  /* =====================================================
     PROJECT DATA
  ===================================================== */

  const [projects] = useState([
    {
      id: 1,
      name: "AI-Powered Project Management System",
    },
    {
      id: 2,
      name: "FieldSync",
    },
    {
      id: 3,
      name: "Library Management System",
    },
  ]);

  /* =====================================================
     SPRINT DATA
  ===================================================== */

  const [sprints] = useState([
    {
      id: 1,
      name: "Sprint 01",
      projectId: 1,
      startDate: "2026-08-01",
      endDate: "2026-08-07",
    },
    {
      id: 2,
      name: "Sprint 02",
      projectId: 1,
      startDate: "2026-08-08",
      endDate: "2026-08-16",
    },
    {
      id: 3,
      name: "Sprint 03",
      projectId: 1,
      startDate: "2026-08-17",
      endDate: "2026-08-23",
    },
    {
      id: 4,
      name: "FieldSync Sprint 01",
      projectId: 2,
      startDate: "2026-08-01",
      endDate: "2026-08-14",
    },
  ]);

  /* =====================================================
     CONTRIBUTOR DATA
  ===================================================== */

  const [contributors] = useState([
    {
      id: 1,
      name: "Abebe",
    },
    {
      id: 2,
      name: "Hana",
    },
    {
      id: 3,
      name: "Kidist",
    },
    {
      id: 4,
      name: "Eyerusalem",
    },
  ]);

  /* =====================================================
     TASK DATA
  ===================================================== */

  const [tasks, setTasks] = useState([
    {
      id: "TASK-001",
      title: "Project management dashboard",
      description:
        "Create the manager project dashboard and project overview interface.",
      type: "Development",
      priority: "High",
      contributor: 1,
      contributorName: "Abebe",
      effort: 8,
      deadline: "2026-08-12",
      deadlineTime: "",
      deadlineNotes: "",
      projectId: 1,
      project: "AI-Powered Project Management System",
      sprintId: 2,
      sprint: "Sprint 02",
      status: "Completed",
      progress: 100,
      dependencies: [],
      completedAt: "2026-08-09T08:00:00.000Z",
      completionDate: "2026-08-09",
      submittedWork:
        "Completed the manager dashboard interface, statistics cards, project overview and responsive layout.",
      reviewStatus: "",
      reviewFeedback: "",
      reviewedAt: "",
      createdAt: "2026-08-01T08:00:00.000Z",
    },

    {
      id: "TASK-002",
      title: "Task status tracking",
      description:
        "Implement task status and progress tracking functionality.",
      type: "Development",
      priority: "High",
      contributor: 4,
      contributorName: "Eyerusalem",
      effort: 7,
      deadline: "2026-08-14",
      deadlineTime: "",
      deadlineNotes: "",
      projectId: 1,
      project: "AI-Powered Project Management System",
      sprintId: 2,
      sprint: "Sprint 02",
      status: "In Progress",
      progress: 65,
      dependencies: ["TASK-001"],
      submittedWork: "",
      reviewStatus: "",
      reviewFeedback: "",
      reviewedAt: "",
      createdAt: "2026-08-02T08:00:00.000Z",
    },

    {
      id: "TASK-003",
      title: "AI project analysis",
      description:
        "Create the AI project analysis service for project health monitoring.",
      type: "Development",
      priority: "Critical",
      contributor: 1,
      contributorName: "Abebe",
      effort: 8,
      deadline: "2026-08-18",
      deadlineTime: "",
      deadlineNotes: "",
      projectId: 1,
      project: "AI-Powered Project Management System",
      sprintId: 3,
      sprint: "Sprint 03",
      status: "To Do",
      progress: 0,
      dependencies: [],
      submittedWork: "",
      reviewStatus: "",
      reviewFeedback: "",
      reviewedAt: "",
      createdAt: "2026-08-03T08:00:00.000Z",
    },

    {
      id: "TASK-004",
      title: "Risk detection",
      description:
        "Detect potential project risks using AI analysis.",
      type: "Research",
      priority: "High",
      contributor: 2,
      contributorName: "Hana",
      effort: 10,
      deadline: "2026-08-20",
      deadlineTime: "",
      deadlineNotes: "",
      projectId: 1,
      project: "AI-Powered Project Management System",
      sprintId: 3,
      sprint: "Sprint 03",
      status: "To Do",
      progress: 0,
      dependencies: ["TASK-003"],
      submittedWork: "",
      reviewStatus: "",
      reviewFeedback: "",
      reviewedAt: "",
      createdAt: "2026-08-04T08:00:00.000Z",
    },
  ]);

  /* =====================================================
     MODALS
  ===================================================== */

  const [createModalOpen, setCreateModalOpen] = useState(false);

  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [taskToUpdate, setTaskToUpdate] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [taskToView, setTaskToView] = useState(null);

  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [taskToAssign, setTaskToAssign] = useState(null);

  const [priorityModalOpen, setPriorityModalOpen] = useState(false);
  const [taskToSetPriority, setTaskToSetPriority] = useState(null);

  const [deadlineModalOpen, setDeadlineModalOpen] = useState(false);
  const [taskToSetDeadline, setTaskToSetDeadline] = useState(null);

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [taskToUpdateStatus, setTaskToUpdateStatus] = useState(null);

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [taskToReview, setTaskToReview] = useState(null);

  /* =====================================================
     FILTERS
  ===================================================== */

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [projectFilter, setProjectFilter] = useState("All");

  /* =====================================================
     SUCCESS MESSAGE
  ===================================================== */

  const [successMessage, setSuccessMessage] = useState("");

  const showMessage = (message) => {
    setSuccessMessage(message);

    setTimeout(() => {
      setSuccessMessage("");
    }, 4000);
  };

  /* =====================================================
     ACTIVITY LOG
  ===================================================== */

  const [activityLog, setActivityLog] = useState([]);

  /* =====================================================
     VIEW TASK
  ===================================================== */

  const openViewModal = (task) => {
    if (!task) {
      showMessage("Task not found.");
      return;
    }

    const currentTask = tasks.find(
      (item) => item.id === task.id
    );

    if (!currentTask) {
      showMessage("Task not found.");
      return;
    }

    setTaskToView(currentTask);
    setViewModalOpen(true);

    setActivityLog((currentLog) => [
      {
        action: "TASK_VIEWED",
        taskId: currentTask.id,
        taskTitle: currentTask.title,
        contributor:
          currentTask.contributorName || "Unassigned",
        project: currentTask.project,
        sprint: currentTask.sprint,
        timestamp: new Date().toISOString(),
      },
      ...currentLog,
    ]);
  };

  const closeViewModal = () => {
    setViewModalOpen(false);
    setTaskToView(null);
  };

  /* =====================================================
     OPEN UPDATE STATUS
  ===================================================== */

  const openUpdateStatusModal = (task) => {
    if (!task) {
      showMessage("Task not found.");
      return;
    }

    const currentTask = tasks.find(
      (item) => item.id === task.id
    );

    if (!currentTask) {
      showMessage("Task not found.");
      return;
    }

    setTaskToUpdateStatus(currentTask);
    setStatusModalOpen(true);
  };

  /* =====================================================
     UPDATE TASK STATUS
  ===================================================== */

  const handleUpdateTaskStatus = (task, statusData) => {
    try {
      if (!task) {
        showMessage("Task not found.");
        return;
      }

      const currentTask = tasks.find(
        (item) => item.id === task.id
      );

      if (!currentTask) {
        showMessage("Task not found.");
        return;
      }

      if (!statusData) {
        showMessage(
          "Unable to update task status. Please try again."
        );
        return;
      }

      const validStatuses = [
        "To Do",
        "In Progress",
        "Review",
        "Completed",
        "Blocked",
      ];

      const newStatus = statusData.status;

      if (!validStatuses.includes(newStatus)) {
        showMessage("This status change is not allowed.");
        return;
      }

      const oldStatus = currentTask.status;

      const allowedTransitions = {
        "To Do": ["To Do", "In Progress", "Blocked"],
        Assigned: ["Assigned", "In Progress", "Blocked"],
        "In Progress": [
          "In Progress",
          "Review",
          "Blocked",
          "To Do",
        ],
        Review: [
          "Review",
          "Completed",
          "In Progress",
          "Blocked",
        ],
        Completed: ["Completed", "Review"],
        Blocked: [
          "Blocked",
          "To Do",
          "In Progress",
        ],
        "Needs Revision": [
          "Needs Revision",
          "In Progress",
          "Review",
          "Blocked",
        ],
      };

      const allowed = allowedTransitions[oldStatus] || [];

      if (!allowed.includes(newStatus)) {
        showMessage("This status change is not allowed.");
        return;
      }

      let newProgress = statusData.progress;

      if (
        newProgress === undefined ||
        newProgress === null ||
        newProgress === ""
      ) {
        if (newStatus === "To Do") {
          newProgress = 0;
        } else if (newStatus === "In Progress") {
          newProgress =
            currentTask.progress > 0
              ? currentTask.progress
              : 50;
        } else if (newStatus === "Review") {
          newProgress = 90;
        } else if (newStatus === "Completed") {
          newProgress = 100;
        } else if (newStatus === "Blocked") {
          newProgress = currentTask.progress || 0;
        }
      }

      newProgress = Math.min(
        100,
        Math.max(0, Number(newProgress) || 0)
      );

      if (newStatus === "Completed") {
        newProgress = 100;
      }

      if (newStatus === "To Do") {
        newProgress = 0;
      }

      const completedAt =
        newStatus === "Completed"
          ? currentTask.completedAt ||
            new Date().toISOString()
          : currentTask.completedAt || "";

      const completionDate =
        newStatus === "Completed"
          ? currentTask.completionDate ||
            new Date().toISOString().split("T")[0]
          : currentTask.completionDate || "";

      const finalTask = {
        ...currentTask,
        status: newStatus,
        progress: newProgress,
        progressNote:
          statusData.progressNote || "",
        completedAt,
        completionDate,
      };

      setTasks((currentTasks) =>
        currentTasks.map((item) =>
          item.id === currentTask.id
            ? finalTask
            : item
        )
      );

      setActivityLog((currentLog) => [
        {
          action: "TASK_STATUS_UPDATED",
          taskId: currentTask.id,
          taskTitle: currentTask.title,
          contributor:
            currentTask.contributorName ||
            "Unassigned",
          project: currentTask.project,
          sprint: currentTask.sprint,
          oldStatus,
          newStatus,
          progress: newProgress,
          progressNote:
            statusData.progressNote || "",
          timestamp: new Date().toISOString(),
        },
        ...currentLog,
      ]);

      if (currentTask.contributorName) {
        console.log(
          `Notification sent to ${currentTask.contributorName}: ${currentTask.id} status changed from ${oldStatus} to ${newStatus}.`
        );
      }

      setStatusModalOpen(false);
      setTaskToUpdateStatus(null);

      showMessage(
        "Task status updated successfully."
      );
    } catch (error) {
      console.error(
        "Unable to update task status:",
        error
      );

      setStatusModalOpen(false);
      setTaskToUpdateStatus(null);

      showMessage(
        "Unable to update task status. Please try again."
      );
    }
  };

  /* =====================================================
     OPEN REVIEW MODAL
  ===================================================== */

  const openReviewModal = (task) => {
    if (!task) {
      showMessage("Task not found.");
      return;
    }

    const currentTask = tasks.find(
      (item) => item.id === task.id
    );

    if (!currentTask) {
      showMessage("Task not found.");
      return;
    }

    if (currentTask.status !== "Completed") {
      showMessage(
        "Only completed tasks can be reviewed."
      );
      return;
    }

    setTaskToReview(currentTask);
    setReviewModalOpen(true);

    setActivityLog((currentLog) => [
      {
        action: "TASK_REVIEW_OPENED",
        taskId: currentTask.id,
        taskTitle: currentTask.title,
        contributor:
          currentTask.contributorName ||
          "Unassigned",
        project: currentTask.project,
        sprint: currentTask.sprint,
        timestamp: new Date().toISOString(),
      },
      ...currentLog,
    ]);
  };

  /* =====================================================
     REVIEW COMPLETED TASK
  ===================================================== */

  const handleReviewCompletedTask = (
    task,
    reviewData
  ) => {
    try {
      if (!task) {
        showMessage("Task not found.");
        return;
      }

      const currentTask = tasks.find(
        (item) => item.id === task.id
      );

      if (!currentTask) {
        showMessage("Task not found.");
        return;
      }

      if (currentTask.status !== "Completed") {
        showMessage(
          "Only completed tasks can be reviewed."
        );
        return;
      }

      if (!reviewData) {
        showMessage(
          "Unable to review task. Please try again."
        );
        return;
      }

      const validReviewStatuses = [
        "Approved",
        "Needs Revision",
      ];

      if (
        !validReviewStatuses.includes(
          reviewData.reviewStatus
        )
      ) {
        showMessage(
          "Unable to review task. Please try again."
        );
        return;
      }

      const reviewStatus =
        reviewData.reviewStatus;

      const feedback =
        reviewData.feedback || "";

      if (
        reviewStatus === "Needs Revision" &&
        !feedback.trim()
      ) {
        showMessage(
          "Please provide feedback explaining what needs revision."
        );
        return;
      }

      const reviewedAt =
        new Date().toISOString();

      const newTaskStatus =
        reviewStatus === "Approved"
          ? "Completed"
          : "Needs Revision";

      const newProgress =
        reviewStatus === "Approved"
          ? 100
          : 90;

      const updatedTask = {
        ...currentTask,
        status: newTaskStatus,
        progress: newProgress,
        reviewStatus,
        reviewFeedback: feedback,
        reviewedAt,
        reviewHistory: [
          ...(Array.isArray(
            currentTask.reviewHistory
          )
            ? currentTask.reviewHistory
            : []),
          {
            status: reviewStatus,
            feedback,
            reviewedAt,
            reviewer: "Manager",
          },
        ],
      };

      setTasks((currentTasks) =>
        currentTasks.map((item) =>
          item.id === currentTask.id
            ? updatedTask
            : item
        )
      );

      setActivityLog((currentLog) => [
        {
          action: "TASK_REVIEW_COMPLETED",
          taskId: currentTask.id,
          taskTitle: currentTask.title,
          contributor:
            currentTask.contributorName ||
            "Unassigned",
          project: currentTask.project,
          sprint: currentTask.sprint,
          reviewStatus,
          feedback,
          oldStatus: currentTask.status,
          newStatus: newTaskStatus,
          timestamp: reviewedAt,
        },
        ...currentLog,
      ]);

      if (currentTask.contributorName) {
        if (reviewStatus === "Approved") {
          console.log(
            `Notification sent to ${currentTask.contributorName}: Task ${currentTask.id} was approved by the manager.`
          );
        } else {
          console.log(
            `Notification sent to ${currentTask.contributorName}: Task ${currentTask.id} needs revision. Feedback: ${feedback}`
          );
        }
      }

      setReviewModalOpen(false);
      setTaskToReview(null);

      showMessage(
        "Task review completed successfully."
      );
    } catch (error) {
      console.error(
        "Unable to review task:",
        error
      );

      setReviewModalOpen(false);
      setTaskToReview(null);

      showMessage(
        "Unable to review task. Please try again."
      );
    }
  };

  /* =====================================================
     CREATE TASK
  ===================================================== */

  const handleCreateTask = (taskData) => {
    if (!taskData) {
      return;
    }

    const contributorExists =
      contributors.some(
        (contributor) =>
          String(contributor.id) ===
          String(taskData.contributor)
      );

    if (!contributorExists) {
      showMessage("Contributor not found.");
      return;
    }

    const projectExists =
      projects.some(
        (project) =>
          String(project.id) ===
          String(taskData.projectId)
      );

    if (!projectExists) {
      showMessage("Project not found.");
      return;
    }

    const sprintExists =
      sprints.some(
        (sprint) =>
          String(sprint.id) ===
          String(taskData.sprintId)
      );

    if (!sprintExists) {
      showMessage("Sprint not found.");
      return;
    }

    const selectedProject =
      projects.find(
        (project) =>
          String(project.id) ===
          String(taskData.projectId)
      );

    const selectedSprint =
      sprints.find(
        (sprint) =>
          String(sprint.id) ===
          String(taskData.sprintId)
      );

    const selectedContributor =
      contributors.find(
        (contributor) =>
          String(contributor.id) ===
          String(taskData.contributor)
      );

    const existingTaskNumbers =
      tasks.map((task) => {
        const match = String(
          task.id
        ).match(/^TASK-(\d+)$/);

        return match
          ? Number(match[1])
          : 0;
      });

    const nextTaskNumber =
      existingTaskNumbers.length > 0
        ? Math.max(
            ...existingTaskNumbers
          ) + 1
        : 1;

    const newTask = {
      ...taskData,

      id: `TASK-${String(
        nextTaskNumber
      ).padStart(3, "0")}`,

      contributor:
        selectedContributor.id,

      contributorName:
        selectedContributor.name,

      projectId:
        selectedProject.id,

      project:
        selectedProject.name,

      sprintId:
        selectedSprint.id,

      sprint:
        selectedSprint.name,

      status: "To Do",

      progress: 0,

      priority:
        taskData.priority ||
        "Medium",

      deadline:
        taskData.deadline || "",

      deadlineTime:
        taskData.deadlineTime ||
        "",

      deadlineNotes:
        taskData.deadlineNotes ||
        "",

      dependencies:
        taskData.dependencies || [],

      submittedWork:
        taskData.submittedWork ||
        "",

      reviewStatus: "",

      reviewFeedback: "",

      reviewedAt: "",

      reviewHistory: [],

      createdAt:
        new Date().toISOString(),
    };

    setTasks((currentTasks) => [
      newTask,
      ...currentTasks,
    ]);

    setActivityLog((currentLog) => [
      {
        action: "TASK_CREATED",
        taskId: newTask.id,
        taskTitle: newTask.title,
        contributor:
          newTask.contributorName,
        project: newTask.project,
        sprint: newTask.sprint,
        timestamp:
          new Date().toISOString(),
      },
      ...currentLog,
    ]);

    console.log(
      "Notification sent to contributor:",
      newTask.contributorName
    );

    setCreateModalOpen(false);

    showMessage(
      "Task created successfully."
    );
  };

  /* =====================================================
     OPEN UPDATE MODAL
  ===================================================== */

  const openUpdateModal = (task) => {
    if (!task) {
      showMessage("Task not found.");
      return;
    }

    const currentTask = tasks.find(
      (item) => item.id === task.id
    );

    if (!currentTask) {
      showMessage("Task not found.");
      return;
    }

    setTaskToUpdate(currentTask);
    setUpdateModalOpen(true);
  };

  /* =====================================================
     UPDATE TASK
  ===================================================== */

  const handleUpdateTask = (
    updatedTask
  ) => {
    if (!updatedTask) {
      showMessage("Task not found.");
      return;
    }

    const currentTask = tasks.find(
      (item) => item.id === updatedTask.id
    );

    if (!currentTask) {
      showMessage("Task not found.");
      return;
    }

    try {
      const selectedProject =
        projects.find(
          (project) =>
            String(project.id) ===
            String(
              updatedTask.projectId
            )
        );

      const selectedSprint =
        sprints.find(
          (sprint) =>
            String(sprint.id) ===
            String(
              updatedTask.sprintId
            )
        );

      const selectedContributor =
        contributors.find(
          (contributor) =>
            String(contributor.id) ===
            String(
              updatedTask.contributor
            )
        );

      const finalTask = {
        ...currentTask,
        ...updatedTask,

        project:
          selectedProject?.name ||
          updatedTask.project ||
          currentTask.project,

        sprint:
          selectedSprint?.name ||
          updatedTask.sprint ||
          currentTask.sprint,

        contributorName:
          selectedContributor?.name ||
          updatedTask.contributorName ||
          currentTask.contributorName,

        priority:
          updatedTask.priority ||
          currentTask.priority ||
          "Medium",

        deadline:
          updatedTask.deadline ??
          currentTask.deadline ??
          "",

        deadlineTime:
          updatedTask.deadlineTime ??
          currentTask.deadlineTime ??
          "",

        deadlineNotes:
          updatedTask.deadlineNotes ??
          currentTask.deadlineNotes ??
          "",
      };

      setTasks((currentTasks) =>
        currentTasks.map((item) =>
          item.id === currentTask.id
            ? finalTask
            : item
        )
      );

      setActivityLog((currentLog) => [
        {
          action: "TASK_UPDATED",
          taskId: finalTask.id,
          taskTitle:
            finalTask.title,
          contributor:
            finalTask.contributorName,
          project:
            finalTask.project,
          sprint:
            finalTask.sprint,
          timestamp:
            new Date().toISOString(),
        },
        ...currentLog,
      ]);

      setUpdateModalOpen(false);
      setTaskToUpdate(null);

      showMessage(
        "Task updated successfully."
      );
    } catch (error) {
      console.error(
        "Unable to update task:",
        error
      );

      showMessage(
        "Unable to update task. Please try again."
      );
    }
  };

  /* =====================================================
     DELETE
  ===================================================== */

  const openDeleteModal = (task) => {
    if (!task) {
      showMessage("Task not found.");
      return;
    }

    const currentTask = tasks.find(
      (item) => item.id === task.id
    );

    if (!currentTask) {
      showMessage("Task not found.");
      return;
    }

    if (
      currentTask.status ===
      "Completed"
    ) {
      showMessage(
        "Completed tasks cannot be deleted. Archive the task instead."
      );

      return;
    }

    const hasDependents =
      tasks.some((item) => {
        if (
          item.id === currentTask.id
        ) {
          return false;
        }

        if (
          !Array.isArray(
            item.dependencies
          )
        ) {
          return false;
        }

        return item.dependencies.some(
          (dependency) =>
            String(dependency) ===
            String(currentTask.id)
        );
      });

    if (hasDependents) {
      showMessage(
        "This task cannot be deleted because other tasks depend on it."
      );

      return;
    }

    setSelectedTask(currentTask);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedTask(null);
  };

  const handleDeleteTask = (task) => {
    if (!task) {
      showMessage("Task not found.");
      return;
    }

    const currentTask = tasks.find(
      (item) => item.id === task.id
    );

    if (!currentTask) {
      closeDeleteModal();
      showMessage("Task not found.");
      return;
    }

    if (
      currentTask.status ===
      "Completed"
    ) {
      closeDeleteModal();

      showMessage(
        "Completed tasks cannot be deleted. Archive the task instead."
      );

      return;
    }

    const hasDependents =
      tasks.some((item) => {
        if (
          item.id === currentTask.id
        ) {
          return false;
        }

        if (
          !Array.isArray(
            item.dependencies
          )
        ) {
          return false;
        }

        return item.dependencies.some(
          (dependency) =>
            String(dependency) ===
            String(currentTask.id)
        );
      });

    if (hasDependents) {
      closeDeleteModal();

      showMessage(
        "This task cannot be deleted because other tasks depend on it."
      );

      return;
    }

    try {
      setTasks((currentTasks) =>
        currentTasks.filter(
          (item) =>
            item.id !==
            currentTask.id
        )
      );

      setActivityLog((currentLog) => [
        {
          action: "TASK_DELETED",
          taskId: currentTask.id,
          taskTitle:
            currentTask.title,
          contributor:
            currentTask.contributorName,
          project:
            currentTask.project,
          sprint:
            currentTask.sprint,
          timestamp:
            new Date().toISOString(),
        },
        ...currentLog,
      ]);

      closeDeleteModal();

      showMessage(
        "Task deleted successfully."
      );
    } catch (error) {
      console.error(
        "Unable to delete task:",
        error
      );

      closeDeleteModal();

      showMessage(
        "Unable to delete task. Please try again."
      );
    }
  };

  /* =====================================================
     ASSIGN
  ===================================================== */

  const openAssignModal = (task) => {
    if (!task) {
      showMessage("Task not found.");
      return;
    }

    const currentTask = tasks.find(
      (item) => item.id === task.id
    );

    if (!currentTask) {
      showMessage("Task not found.");
      return;
    }

    if (contributors.length === 0) {
      showMessage(
        "No available contributors found."
      );

      return;
    }

    setTaskToAssign(currentTask);
    setAssignModalOpen(true);
  };

  const handleAssignContributor = (
    task,
    contributor
  ) => {
    try {
      if (!task) {
        showMessage("Task not found.");
        return;
      }

      if (!contributor) {
        showMessage(
          "Contributor is not assigned to this team."
        );

        return;
      }

      const currentTask = tasks.find(
        (item) => item.id === task.id
      );

      if (!currentTask) {
        showMessage("Task not found.");
        return;
      }

      const selectedContributor =
        contributors.find(
          (item) =>
            String(item.id) ===
            String(contributor.id)
        );

      if (!selectedContributor) {
        showMessage(
          "Contributor is not assigned to this team."
        );

        return;
      }

      setTasks((currentTasks) =>
        currentTasks.map((item) => {
          if (
            item.id !==
            currentTask.id
          ) {
            return item;
          }

          return {
            ...item,

            contributor:
              selectedContributor.id,

            contributorName:
              selectedContributor.name,

            status:
              item.status ===
              "Unassigned"
                ? "Assigned"
                : item.status,
          };
        })
      );

      setActivityLog((currentLog) => [
        {
          action: "TASK_ASSIGNED",
          taskId: currentTask.id,
          taskTitle:
            currentTask.title,
          contributor:
            selectedContributor.name,
          project:
            currentTask.project,
          sprint:
            currentTask.sprint,
          timestamp:
            new Date().toISOString(),
        },
        ...currentLog,
      ]);

      console.log(
        "Notification sent to contributor:",
        selectedContributor.name
      );

      setAssignModalOpen(false);
      setTaskToAssign(null);

      showMessage(
        "Task assigned successfully."
      );
    } catch (error) {
      console.error(
        "Unable to assign task:",
        error
      );

      setAssignModalOpen(false);
      setTaskToAssign(null);

      showMessage(
        "Unable to assign task. Please try again."
      );
    }
  };

  /* =====================================================
     PRIORITY
  ===================================================== */

  const openPriorityModal = (task) => {
    if (!task) {
      showMessage("Task not found.");
      return;
    }

    const currentTask = tasks.find(
      (item) => item.id === task.id
    );

    if (!currentTask) {
      showMessage("Task not found.");
      return;
    }

    setTaskToSetPriority(currentTask);
    setPriorityModalOpen(true);
  };

  const closePriorityModal = () => {
    setPriorityModalOpen(false);
    setTaskToSetPriority(null);
  };

  const handleSetPriority = (
    task,
    newPriority
  ) => {
    try {
      if (!task) {
        closePriorityModal();
        showMessage("Task not found.");
        return;
      }

      const currentTask = tasks.find(
        (item) => item.id === task.id
      );

      if (!currentTask) {
        closePriorityModal();
        showMessage("Task not found.");
        return;
      }

      const validPriorities = [
        "Low",
        "Medium",
        "High",
        "Critical",
      ];

      if (
        !validPriorities.includes(
          newPriority
        )
      ) {
        showMessage(
          "Invalid priority value."
        );
        return;
      }

      setTasks((currentTasks) =>
        currentTasks.map((item) =>
          item.id === currentTask.id
            ? {
                ...item,
                priority:
                  newPriority,
              }
            : item
        )
      );

      setActivityLog((currentLog) => [
        {
          action:
            "TASK_PRIORITY_UPDATED",
          taskId: currentTask.id,
          taskTitle:
            currentTask.title,
          contributor:
            currentTask.contributorName ||
            "Unassigned",
          project:
            currentTask.project,
          sprint:
            currentTask.sprint,
          oldPriority:
            currentTask.priority,
          newPriority,
          timestamp:
            new Date().toISOString(),
        },
        ...currentLog,
      ]);

      closePriorityModal();

      showMessage(
        "Task priority updated successfully."
      );
    } catch (error) {
      console.error(
        "Unable to update task priority:",
        error
      );

      closePriorityModal();

      showMessage(
        "Unable to update task priority. Please try again."
      );
    }
  };

  /* =====================================================
     DEADLINE
  ===================================================== */

  const openDeadlineModal = (task) => {
    if (!task) {
      showMessage("Task not found.");
      return;
    }

    const currentTask = tasks.find(
      (item) => item.id === task.id
    );

    if (!currentTask) {
      showMessage("Task not found.");
      return;
    }

    setTaskToSetDeadline(currentTask);
    setDeadlineModalOpen(true);
  };

  const closeDeadlineModal = () => {
    setDeadlineModalOpen(false);
    setTaskToSetDeadline(null);
  };

  const handleSetDeadline = (
    task,
    deadlineData
  ) => {
    try {
      if (!task) {
        closeDeadlineModal();
        showMessage("Task not found.");
        return;
      }

      const currentTask = tasks.find(
        (item) => item.id === task.id
      );

      if (!currentTask) {
        closeDeadlineModal();
        showMessage("Task not found.");
        return;
      }

      if (
        !deadlineData ||
        !deadlineData.deadline
      ) {
        showMessage(
          "Invalid deadline date."
        );
        return;
      }

      const deadlineDate =
        deadlineData.deadline;

      const deadlineTime =
        deadlineData.deadlineTime ||
        "23:59";

      const selectedDeadline =
        new Date(
          `${deadlineDate}T${deadlineTime}`
        );

      if (
        Number.isNaN(
          selectedDeadline.getTime()
        )
      ) {
        showMessage(
          "Invalid deadline date."
        );
        return;
      }

      if (currentTask.createdAt) {
        const taskCreationDate =
          new Date(
            currentTask.createdAt
          );

        if (
          selectedDeadline <
          taskCreationDate
        ) {
          showMessage(
            "Invalid deadline date."
          );
          return;
        }
      }

      const currentSprint =
        sprints.find(
          (sprint) =>
            String(sprint.id) ===
            String(
              currentTask.sprintId
            )
        );

      if (currentSprint?.startDate) {
        const sprintStart =
          new Date(
            `${currentSprint.startDate}T00:00`
          );

        if (
          selectedDeadline <
          sprintStart
        ) {
          showMessage(
            "Task deadline conflicts with sprint schedule."
          );

          return;
        }
      }

      if (currentSprint?.endDate) {
        const sprintEnd =
          new Date(
            `${currentSprint.endDate}T23:59`
          );

        if (
          selectedDeadline >
          sprintEnd
        ) {
          showMessage(
            "Task deadline conflicts with sprint schedule."
          );

          return;
        }
      }

      setTasks((currentTasks) =>
        currentTasks.map((item) =>
          item.id === currentTask.id
            ? {
                ...item,
                deadline:
                  deadlineData.deadline,
                deadlineTime:
                  deadlineData.deadlineTime ||
                  "",
                deadlineNotes:
                  deadlineData.deadlineNotes ||
                  "",
              }
            : item
        )
      );

      setActivityLog((currentLog) => [
        {
          action:
            "TASK_DEADLINE_UPDATED",
          taskId: currentTask.id,
          taskTitle:
            currentTask.title,
          contributor:
            currentTask.contributorName ||
            "Unassigned",
          project:
            currentTask.project,
          sprint:
            currentTask.sprint,
          oldDeadline:
            currentTask.deadline ||
            "No deadline",
          newDeadline:
            deadlineData.deadline,
          deadlineTime:
            deadlineData.deadlineTime ||
            "",
          timestamp:
            new Date().toISOString(),
        },
        ...currentLog,
      ]);

      closeDeadlineModal();

      showMessage(
        "Task deadline updated successfully."
      );
    } catch (error) {
      console.error(
        "Unable to update task deadline:",
        error
      );

      closeDeadlineModal();

      showMessage(
        "Unable to update task deadline. Please try again."
      );
    }
  };

  /* =====================================================
     FILTER
  ===================================================== */

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const searchValue =
        search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        task.title
          ?.toLowerCase()
          .includes(searchValue) ||
        task.id
          ?.toLowerCase()
          .includes(searchValue) ||
        task.description
          ?.toLowerCase()
          .includes(searchValue) ||
        task.contributorName
          ?.toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        task.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" ||
        task.priority === priorityFilter;

      const matchesProject =
        projectFilter === "All" ||
        String(task.projectId) ===
          String(projectFilter);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesProject
      );
    });
  }, [
    tasks,
    search,
    statusFilter,
    priorityFilter,
    projectFilter,
  ]);

  /* =====================================================
     STATISTICS
  ===================================================== */

  const totalTasks = tasks.length;

  const completedTasks =
    tasks.filter(
      (task) =>
        task.status === "Completed"
    ).length;

  const activeTasks =
    tasks.filter(
      (task) =>
        task.status === "In Progress"
    ).length;

  const blockedTasks =
    tasks.filter(
      (task) =>
        task.status === "Blocked"
    ).length;

  const needsRevisionTasks =
    tasks.filter(
      (task) =>
        task.status === "Needs Revision"
    ).length;

  /* =====================================================
     ACTIVITY TEXT
  ===================================================== */

  const renderActivityText = (
    activity
  ) => {
    if (
      activity.action ===
      "TASK_CREATED"
    ) {
      return (
        <>
          Task{" "}
          <span className="font-semibold text-white">
            {activity.taskId}
          </span>{" "}
          was created and assigned to{" "}
          <span className="font-semibold text-purple-400">
            {activity.contributor}
          </span>
          .
        </>
      );
    }

    if (
      activity.action ===
      "TASK_VIEWED"
    ) {
      return (
        <>
          Task{" "}
          <span className="font-semibold text-white">
            {activity.taskId}
          </span>{" "}
          was viewed.
        </>
      );
    }

    if (
      activity.action ===
      "TASK_STATUS_UPDATED"
    ) {
      return (
        <>
          Status of{" "}
          <span className="font-semibold text-white">
            {activity.taskId}
          </span>{" "}
          changed from{" "}
          <span className="font-semibold text-gray-400">
            {activity.oldStatus}
          </span>{" "}
          to{" "}
          <span className="font-semibold text-blue-400">
            {activity.newStatus}
          </span>
          .
        </>
      );
    }

    if (
      activity.action ===
      "TASK_REVIEW_OPENED"
    ) {
      return (
        <>
          Completed task{" "}
          <span className="font-semibold text-white">
            {activity.taskId}
          </span>{" "}
          was opened for review.
        </>
      );
    }

    if (
      activity.action ===
      "TASK_REVIEW_COMPLETED"
    ) {
      return (
        <>
          Review of{" "}
          <span className="font-semibold text-white">
            {activity.taskId}
          </span>{" "}
          was completed with result{" "}
          <span
            className={`font-semibold ${
              activity.reviewStatus ===
              "Approved"
                ? "text-green-400"
                : "text-orange-400"
            }`}
          >
            {activity.reviewStatus}
          </span>
          .
        </>
      );
    }

    if (
      activity.action ===
      "TASK_DELETED"
    ) {
      return (
        <>
          Task{" "}
          <span className="font-semibold text-white">
            {activity.taskId}
          </span>{" "}
          was deleted.
        </>
      );
    }

    if (
      activity.action ===
      "TASK_UPDATED"
    ) {
      return (
        <>
          Task{" "}
          <span className="font-semibold text-white">
            {activity.taskId}
          </span>{" "}
          was updated.
        </>
      );
    }

    if (
      activity.action ===
      "TASK_ASSIGNED"
    ) {
      return (
        <>
          Task{" "}
          <span className="font-semibold text-white">
            {activity.taskId}
          </span>{" "}
          was assigned to{" "}
          <span className="font-semibold text-purple-400">
            {activity.contributor}
          </span>
          .
        </>
      );
    }

    if (
      activity.action ===
      "TASK_PRIORITY_UPDATED"
    ) {
      return (
        <>
          Priority of{" "}
          <span className="font-semibold text-white">
            {activity.taskId}
          </span>{" "}
          changed from{" "}
          <span className="font-semibold text-gray-400">
            {activity.oldPriority}
          </span>{" "}
          to{" "}
          <span className="font-semibold text-orange-400">
            {activity.newPriority}
          </span>
          .
        </>
      );
    }

    if (
      activity.action ===
      "TASK_DEADLINE_UPDATED"
    ) {
      return (
        <>
          Deadline of{" "}
          <span className="font-semibold text-white">
            {activity.taskId}
          </span>{" "}
          changed from{" "}
          <span className="font-semibold text-gray-400">
            {activity.oldDeadline}
          </span>{" "}
          to{" "}
          <span className="font-semibold text-blue-400">
            {activity.newDeadline}
          </span>
          .
        </>
      );
    }

    return (
      <>
        Task{" "}
        <span className="font-semibold text-white">
          {activity.taskId}
        </span>{" "}
        activity was recorded.
      </>
    );
  };

  /* =====================================================
     ACTIVITY ICON
  ===================================================== */

  const getActivityIcon = (
    activity
  ) => {
    if (
      activity.action ===
      "TASK_REVIEW_COMPLETED"
    ) {
      return activity.reviewStatus ===
        "Approved" ? (
        <CheckCircle
          size={17}
          className="text-green-400"
        />
      ) : (
        <RotateCcw
          size={17}
          className="text-orange-400"
        />
      );
    }

    if (
      activity.action ===
      "TASK_REVIEW_OPENED"
    ) {
      return (
        <Eye
          size={17}
          className="text-cyan-400"
        />
      );
    }

    if (
      activity.action ===
      "TASK_STATUS_UPDATED"
    ) {
      return (
        <Activity
          size={17}
          className="text-blue-400"
        />
      );
    }

    if (
      activity.action ===
      "TASK_DELETED"
    ) {
      return (
        <AlertTriangle
          size={17}
          className="text-red-400"
        />
      );
    }

    if (
      activity.action ===
      "TASK_PRIORITY_UPDATED"
    ) {
      return (
        <Flag
          size={17}
          className="text-orange-400"
        />
      );
    }

    if (
      activity.action ===
      "TASK_DEADLINE_UPDATED"
    ) {
      return (
        <CalendarDays
          size={17}
          className="text-blue-400"
        />
      );
    }

    return (
      <CheckCircle2
        size={17}
        className="text-green-400"
      />
    );
  };

  /* =====================================================
     RETURN
  ===================================================== */

  return (
    <div className="min-h-full bg-[#020617]">
      {/* SUCCESS MESSAGE */}

      {successMessage && (
        <div className="fixed right-6 top-24 z-[99999] flex max-w-sm items-center gap-3 rounded-xl border border-green-500/30 bg-[#0f172a] px-5 py-4 shadow-2xl">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-500/10">
            <CheckCircle2
              size={20}
              className="text-green-400"
            />
          </div>

          <div>
            <p className="text-sm font-semibold text-white">
              Success
            </p>

            <p className="text-xs text-gray-400">
              {successMessage}
            </p>
          </div>
        </div>
      )}

      {/* MAIN */}

      <div className="px-6 py-8 lg:px-8">
        {/* HEADER */}

        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/10 text-blue-400">
                <ListTodo size={23} />
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-white">
                Task Management
              </h1>
            </div>

            <p className="max-w-2xl text-sm leading-6 text-gray-400">
              Create, assign, prioritize,
              update, review and manage
              project tasks across sprints.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setCreateModalOpen(true)
            }
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-500"
          >
            <Plus size={18} />
            Create Task
          </button>
        </div>

        {/* =================================================
            STATISTICS WITH SPRINT DASHBOARD HOVER
        ================================================= */}

        <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">

          {/* TOTAL TASKS */}

          <div
            className="
              group
              rounded-2xl
              border border-gray-800
              bg-[#0f172a]
              p-5
              shadow-lg
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-blue-500/50
              hover:bg-[#111c31]
              hover:shadow-xl
              hover:shadow-blue-500/10
            "
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400 transition-colors duration-300 group-hover:text-blue-300">
                Total Tasks
              </p>

              <div
                className="
                  flex h-9 w-9
                  items-center justify-center
                  rounded-lg
                  bg-blue-500/10
                  text-blue-400
                  transition-all
                  duration-300
                  group-hover:scale-110
                  group-hover:bg-blue-500/20
                "
              >
                <ListTodo size={18} />
              </div>
            </div>

            <p className="mt-2 text-3xl font-bold text-white">
              {totalTasks}
            </p>

            <p className="mt-1 text-xs text-gray-500 transition-colors duration-300 group-hover:text-gray-400">
              All project tasks
            </p>
          </div>

          {/* IN PROGRESS */}

          <div
            className="
              group
              rounded-2xl
              border border-gray-800
              bg-[#0f172a]
              p-5
              shadow-lg
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-yellow-500/50
              hover:bg-[#111c31]
              hover:shadow-xl
              hover:shadow-yellow-500/10
            "
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400 transition-colors duration-300 group-hover:text-yellow-300">
                In Progress
              </p>

              <div
                className="
                  flex h-9 w-9
                  items-center justify-center
                  rounded-lg
                  bg-yellow-500/10
                  text-yellow-400
                  transition-all
                  duration-300
                  group-hover:scale-110
                  group-hover:bg-yellow-500/20
                "
              >
                <Clock3 size={18} />
              </div>
            </div>

            <p className="mt-2 text-3xl font-bold text-white">
              {activeTasks}
            </p>

            <p className="mt-1 text-xs text-gray-500 transition-colors duration-300 group-hover:text-gray-400">
              Currently active
            </p>
          </div>

          {/* COMPLETED */}

          <div
            className="
              group
              rounded-2xl
              border border-gray-800
              bg-[#0f172a]
              p-5
              shadow-lg
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-green-500/50
              hover:bg-[#111c31]
              hover:shadow-xl
              hover:shadow-green-500/10
            "
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400 transition-colors duration-300 group-hover:text-green-300">
                Completed
              </p>

              <div
                className="
                  flex h-9 w-9
                  items-center justify-center
                  rounded-lg
                  bg-green-500/10
                  text-green-400
                  transition-all
                  duration-300
                  group-hover:scale-110
                  group-hover:bg-green-500/20
                "
              >
                <CheckCircle2 size={18} />
              </div>
            </div>

            <p className="mt-2 text-3xl font-bold text-white">
              {completedTasks}
            </p>

            <p className="mt-1 text-xs text-gray-500 transition-colors duration-300 group-hover:text-gray-400">
              Ready for review
            </p>
          </div>

          {/* BLOCKED */}

          <div
            className="
              group
              rounded-2xl
              border border-gray-800
              bg-[#0f172a]
              p-5
              shadow-lg
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-red-500/50
              hover:bg-[#111c31]
              hover:shadow-xl
              hover:shadow-red-500/10
            "
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400 transition-colors duration-300 group-hover:text-red-300">
                Blocked
              </p>

              <div
                className="
                  flex h-9 w-9
                  items-center justify-center
                  rounded-lg
                  bg-red-500/10
                  text-red-400
                  transition-all
                  duration-300
                  group-hover:scale-110
                  group-hover:bg-red-500/20
                "
              >
                <AlertTriangle size={18} />
              </div>
            </div>

            <p className="mt-2 text-3xl font-bold text-white">
              {blockedTasks}
            </p>

            <p className="mt-1 text-xs text-gray-500 transition-colors duration-300 group-hover:text-gray-400">
              Need attention
            </p>
          </div>

          {/* NEEDS REVISION */}

          <div
            className="
              group
              rounded-2xl
              border border-gray-800
              bg-[#0f172a]
              p-5
              shadow-lg
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-orange-500/50
              hover:bg-[#111c31]
              hover:shadow-xl
              hover:shadow-orange-500/10
            "
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400 transition-colors duration-300 group-hover:text-orange-300">
                Needs Revision
              </p>

              <div
                className="
                  flex h-9 w-9
                  items-center justify-center
                  rounded-lg
                  bg-orange-500/10
                  text-orange-400
                  transition-all
                  duration-300
                  group-hover:scale-110
                  group-hover:bg-orange-500/20
                "
              >
                <RotateCcw size={18} />
              </div>
            </div>

            <p className="mt-2 text-3xl font-bold text-white">
              {needsRevisionTasks}
            </p>

            <p className="mt-1 text-xs text-gray-500 transition-colors duration-300 group-hover:text-gray-400">
              Returned by manager
            </p>
          </div>
        </div>

        {/* FILTER BAR */}

        <div className="mb-6 rounded-2xl border border-gray-800 bg-[#0f172a] p-4">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">

            {/* SEARCH */}

            <div className="relative lg:col-span-2">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search tasks..."
                className="w-full rounded-xl border border-gray-700 bg-[#020617] py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-gray-600 focus:border-blue-500"
              />
            </div>

            {/* STATUS */}

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
              className="rounded-xl border border-gray-700 bg-[#020617] px-4 py-3 text-sm text-gray-300 outline-none focus:border-blue-500"
            >
              <option value="All">
                All Status
              </option>

              <option value="To Do">
                To Do
              </option>

              <option value="Assigned">
                Assigned
              </option>

              <option value="In Progress">
                In Progress
              </option>

              <option value="Review">
                Review
              </option>

              <option value="Completed">
                Completed
              </option>

              <option value="Needs Revision">
                Needs Revision
              </option>

              <option value="Blocked">
                Blocked
              </option>
            </select>

            {/* PRIORITY */}

            <select
              value={priorityFilter}
              onChange={(event) =>
                setPriorityFilter(
                  event.target.value
                )
              }
              className="rounded-xl border border-gray-700 bg-[#020617] px-4 py-3 text-sm text-gray-300 outline-none focus:border-blue-500"
            >
              <option value="All">
                All Priority
              </option>

              <option value="Low">
                Low
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="High">
                High
              </option>

              <option value="Critical">
                Critical
              </option>
            </select>

            {/* PROJECT */}

            <select
              value={projectFilter}
              onChange={(event) =>
                setProjectFilter(
                  event.target.value
                )
              }
              className="rounded-xl border border-gray-700 bg-[#020617] px-4 py-3 text-sm text-gray-300 outline-none focus:border-blue-500"
            >
              <option value="All">
                All Projects
              </option>

              {projects.map(
                (project) => (
                  <option
                    key={project.id}
                    value={project.id}
                  >
                    {project.name}
                  </option>
                )
              )}
            </select>
          </div>
        </div>

        {/* TASK HEADER */}

        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Project Tasks
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              {filteredTasks.length} task
              {filteredTasks.length !== 1
                ? "s"
                : ""}{" "}
              displayed
            </p>
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-gray-700 bg-[#0f172a] px-4 py-2 text-xs text-gray-400 sm:flex">
            <Activity size={14} />
            Review tracking enabled
          </div>
        </div>

        {/* TASK CARDS */}

        {filteredTasks.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            {filteredTasks.map(
              (task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onView={openViewModal}
                  onEdit={openUpdateModal}
                  onDelete={openDeleteModal}
                  onAssign={openAssignModal}
                  onSetPriority={
                    openPriorityModal
                  }
                  onSetDeadline={
                    openDeadlineModal
                  }
                  onUpdateStatus={
                    openUpdateStatusModal
                  }
                  onReview={
                    openReviewModal
                  }
                />
              )
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-700 bg-[#0f172a] p-12 text-center">
            <ListTodo
              size={42}
              className="mx-auto text-gray-600"
            />

            <h3 className="mt-4 text-lg font-semibold text-white">
              No tasks found
            </h3>

            <p className="mt-2 text-sm text-gray-400">
              Try changing your filters
              or create a new task.
            </p>

            <button
              type="button"
              onClick={() =>
                setCreateModalOpen(true)
              }
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              <Plus size={18} />
              Create Task
            </button>
          </div>
        )}

        {/* ACTIVITY LOG */}

        {activityLog.length > 0 && (
          <div className="mt-10 rounded-2xl border border-gray-800 bg-[#0f172a] p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                <Activity size={19} />
              </div>

              <div>
                <h3 className="font-semibold text-white">
                  Recent Activity
                </h3>

                <p className="text-xs text-gray-500">
                  Task and review activity
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {activityLog
                .slice(0, 8)
                .map(
                  (
                    activity,
                    index
                  ) => (
                    <div
                      key={`${activity.taskId}-${activity.action}-${index}`}
                      className="rounded-xl border border-gray-800 bg-[#020617] p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {getActivityIcon(
                            activity
                          )}
                        </div>

                        <div>
                          <p className="text-sm text-gray-300">
                            {renderActivityText(
                              activity
                            )}
                          </p>

                          {activity.feedback && (
                            <p className="mt-2 rounded-lg border border-gray-800 bg-[#0f172a] p-2 text-xs text-gray-500">
                              Feedback:{" "}
                              {
                                activity.feedback
                              }
                            </p>
                          )}

                          <p className="mt-1 text-xs text-gray-600">
                            {new Date(
                              activity.timestamp
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                )}
            </div>
          </div>
        )}
      </div>

      {/* =================================================
          CREATE MODAL
      ================================================= */}

      <CreateTaskModal
        open={createModalOpen}
        onClose={() =>
          setCreateModalOpen(false)
        }
        onCreate={handleCreateTask}
        projects={projects}
        sprints={sprints}
        contributors={contributors}
      />

      {/* =================================================
          VIEW MODAL
      ================================================= */}

      <ViewTaskModal
        open={viewModalOpen}
        task={taskToView}
        onClose={closeViewModal}
      />

      {/* =================================================
          UPDATE MODAL
      ================================================= */}

      <UpdateTaskModal
        open={updateModalOpen}
        task={taskToUpdate}
        projects={projects}
        sprints={sprints}
        contributors={contributors}
        onClose={() => {
          setUpdateModalOpen(false);
          setTaskToUpdate(null);
        }}
        onUpdate={handleUpdateTask}
      />

      {/* =================================================
          DELETE MODAL
      ================================================= */}

      <DeleteTaskModal
        open={deleteModalOpen}
        task={selectedTask}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteTask}
      />

      {/* =================================================
          ASSIGN MODAL
      ================================================= */}

      <AssignContributorModal
        open={assignModalOpen}
        task={taskToAssign}
        contributors={contributors}
        onClose={() => {
          setAssignModalOpen(false);
          setTaskToAssign(null);
        }}
        onConfirm={
          handleAssignContributor
        }
      />

      {/* =================================================
          PRIORITY MODAL
      ================================================= */}

      <SetPriorityModal
        open={priorityModalOpen}
        task={taskToSetPriority}
        onClose={closePriorityModal}
        onConfirm={handleSetPriority}
      />

      {/* =================================================
          DEADLINE MODAL
      ================================================= */}

      <SetDeadlineModal
        open={deadlineModalOpen}
        task={taskToSetDeadline}
        sprints={sprints}
        onClose={closeDeadlineModal}
        onConfirm={handleSetDeadline}
      />

      {/* =================================================
          UPDATE STATUS MODAL
      ================================================= */}

      <UpdateTaskStatusModal
        open={statusModalOpen}
        task={taskToUpdateStatus}
        onClose={() => {
          setStatusModalOpen(false);
          setTaskToUpdateStatus(null);
        }}
        onUpdate={
          handleUpdateTaskStatus
        }
      />

      {/* =================================================
          REVIEW COMPLETED TASK MODAL
      ================================================= */}

      <ReviewCompletedTaskModal
        open={reviewModalOpen}
        task={taskToReview}
        onClose={() => {
          setReviewModalOpen(false);
          setTaskToReview(null);
        }}
        onReview={
          handleReviewCompletedTask
        }
      />
    </div>
  );
}

export default TaskManagement;