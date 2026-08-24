import React, { useState } from "react";

import {
  Plus,
  Layers3,
  Activity,
  CheckCircle2,
  Clock3,
} from "lucide-react";

import SprintCard from "../../components/manager/sprint/SprintCard";
import CompleteSprintModal from "../../components/manager/sprint/CompleteSprintModal";
import UpdateSprintModal from "../../components/manager/sprint/UpdateSprintModal";
import DeleteSprintModal from "../../components/manager/sprint/DeleteSprintModal";
import StartSprintModal from "../../components/manager/sprint/StartSprintModal";
import SprintBacklogModal from "../../components/manager/sprint/SprintBacklogModal";

function SprintManagement() {
  /* =====================================================
     SPRINT DATA
  ===================================================== */

  const [sprints, setSprints] = useState([
    {
      id: 1,
      name: "Sprint 01",
      goal:
        "Set up the core AI-PMS project structure and authentication.",
      description:
        "Build the initial project structure and authentication system.",
      status: "Completed",
      progress: 100,
      tasks: 4,
      completedTasks: 4,
      team: 6,
      teamPerformance: 94,
      startDate: "2026-07-01",
      endDate: "2026-07-14",
      priority: "High",

      backlog: [
        {
          id: 101,
          name: "Create project structure",
          description:
            "Set up the initial React and .NET project structure.",
          contributor: "Abebe",
          priority: "High",
          status: "Completed",
          effort: 6,
          deadline: "2026-07-03",
          userStory:
            "As a developer, I want a clean project structure.",
        },
        {
          id: 102,
          name: "Configure database",
          description:
            "Configure PostgreSQL and Entity Framework Core.",
          contributor: "Hana",
          priority: "High",
          status: "Completed",
          effort: 5,
          deadline: "2026-07-06",
          userStory:
            "As a developer, I want the database configured.",
        },
        {
          id: 103,
          name: "Implement authentication",
          description:
            "Implement login and registration functionality.",
          contributor: "Kidist",
          priority: "High",
          status: "Completed",
          effort: 8,
          deadline: "2026-07-10",
          userStory:
            "As a user, I want to securely log into the system.",
        },
        {
          id: 104,
          name: "Authentication testing",
          description:
            "Test login, registration and authentication validation.",
          contributor: "Eyerusalem",
          priority: "Medium",
          status: "Completed",
          effort: 4,
          deadline: "2026-07-13",
          userStory:
            "As a developer, I want authentication to be reliable.",
        },
      ],

      activityLog: [],
    },

    {
      id: 2,
      name: "Sprint 02",
      goal:
        "Develop the project management and task management modules.",
      description:
        "Implement project, task and team management functionality.",
      status: "Active",
      progress: 75,
      tasks: 5,
      completedTasks: 3,
      team: 8,
      teamPerformance: 91,
      startDate: "2026-07-15",
      endDate: "2026-07-28",
      priority: "High",

      backlog: [
        {
          id: 201,
          name: "Project management dashboard",
          description:
            "Create the manager project dashboard.",
          contributor: "Abebe",
          priority: "High",
          status: "Completed",
          effort: 8,
          deadline: "2026-07-18",
          userStory:
            "As a manager, I want to monitor my projects.",
        },
        {
          id: 202,
          name: "Task creation",
          description:
            "Implement task creation and editing.",
          contributor: "Hana",
          priority: "High",
          status: "Completed",
          effort: 6,
          deadline: "2026-07-21",
          userStory:
            "As a manager, I want to create project tasks.",
        },
        {
          id: 203,
          name: "Task assignment",
          description:
            "Allow managers to assign tasks to contributors.",
          contributor: "Kidist",
          priority: "Medium",
          status: "Completed",
          effort: 5,
          deadline: "2026-07-23",
          userStory:
            "As a manager, I want to assign work to contributors.",
        },
        {
          id: 204,
          name: "Task status tracking",
          description:
            "Implement task status and progress tracking.",
          contributor: "Eyerusalem",
          priority: "High",
          status: "In Progress",
          effort: 7,
          deadline: "2026-07-27",
          userStory:
            "As a manager, I want to track task progress.",
        },
        {
          id: 205,
          name: "Team management",
          description:
            "Implement contributor management.",
          contributor: "Abebe",
          priority: "Medium",
          status: "To Do",
          effort: 6,
          deadline: "2026-07-28",
          userStory:
            "As a manager, I want to manage project contributors.",
        },
      ],

      activityLog: [],
    },

    {
      id: 3,
      name: "Sprint 03",
      goal:
        "Implement AI-powered project analysis and risk detection.",
      description:
        "Develop AI features for project analysis and risk detection.",
      status: "Planning",
      progress: 0,
      tasks: 6,
      completedTasks: 0,
      team: 8,
      teamPerformance: 0,
      startDate: "2026-08-01",
      endDate: "2026-08-14",
      priority: "Medium",

      backlog: [
        {
          id: 301,
          name: "AI project analysis",
          description:
            "Create the AI project analysis service.",
          contributor: "Abebe",
          priority: "High",
          status: "To Do",
          effort: 8,
          deadline: "2026-08-04",
          userStory:
            "As a manager, I want AI to analyze project health.",
        },
        {
          id: 302,
          name: "Risk detection",
          description:
            "Detect potential project risks using AI.",
          contributor: "Hana",
          priority: "High",
          status: "To Do",
          effort: 10,
          deadline: "2026-08-07",
          userStory:
            "As a manager, I want AI to detect project risks.",
        },
        {
          id: 303,
          name: "AI risk dashboard",
          description:
            "Display AI-generated risks on the manager dashboard.",
          contributor: "Kidist",
          priority: "Medium",
          status: "To Do",
          effort: 6,
          deadline: "2026-08-09",
          userStory:
            "As a manager, I want to see identified risks.",
        },
        {
          id: 304,
          name: "AI recommendations",
          description:
            "Generate recommendations for project improvement.",
          contributor: "Eyerusalem",
          priority: "Medium",
          status: "To Do",
          effort: 7,
          deadline: "2026-08-11",
          userStory:
            "As a manager, I want AI recommendations.",
        },
        {
          id: 305,
          name: "AI notification system",
          description:
            "Notify managers when important AI alerts are generated.",
          contributor: "Abebe",
          priority: "Low",
          status: "To Do",
          effort: 4,
          deadline: "2026-08-13",
          userStory:
            "As a manager, I want notifications for important risks.",
        },
        {
          id: 306,
          name: "AI testing",
          description:
            "Test AI analysis and risk detection.",
          contributor: "Hana",
          priority: "Medium",
          status: "To Do",
          effort: 5,
          deadline: "2026-08-14",
          userStory:
            "As a developer, I want AI functionality tested.",
        },
      ],

      activityLog: [],
    },
  ]);

  /* =====================================================
     CREATE SPRINT
  ===================================================== */

  const [createModalOpen, setCreateModalOpen] =
    useState(false);

  const [createForm, setCreateForm] = useState({
    name: "",
    goal: "",
    description: "",
    startDate: "",
    endDate: "",
    priority: "Medium",
    tasks: "",
    team: "",
  });

  /* =====================================================
     START SPRINT
  ===================================================== */

  const [startModalOpen, setStartModalOpen] =
    useState(false);

  const [selectedStartSprint, setSelectedStartSprint] =
    useState(null);

  /* =====================================================
     COMPLETE SPRINT
  ===================================================== */

  const [completeModalOpen, setCompleteModalOpen] =
    useState(false);

  const [selectedSprint, setSelectedSprint] =
    useState(null);

  /* =====================================================
     UPDATE SPRINT
  ===================================================== */

  const [updateModalOpen, setUpdateModalOpen] =
    useState(false);

  const [selectedUpdateSprint, setSelectedUpdateSprint] =
    useState(null);

  /* =====================================================
     DELETE SPRINT
  ===================================================== */

  const [deleteModalOpen, setDeleteModalOpen] =
    useState(false);

  const [selectedDeleteSprint, setSelectedDeleteSprint] =
    useState(null);

  /* =====================================================
     BACKLOG
  ===================================================== */

  const [backlogModalOpen, setBacklogModalOpen] =
    useState(false);

  const [selectedBacklogSprint, setSelectedBacklogSprint] =
    useState(null);

  /* =====================================================
     SUCCESS MESSAGE
  ===================================================== */

  const [successMessage, setSuccessMessage] =
    useState("");

  const showMessage = (message) => {
    setSuccessMessage(message);

    setTimeout(() => {
      setSuccessMessage("");
    }, 4000);
  };

  /* =====================================================
     STATISTICS
  ===================================================== */

  const activeSprints = sprints.filter(
    (sprint) => sprint.status === "Active"
  );

  const completedSprints = sprints.filter(
    (sprint) => sprint.status === "Completed"
  );

  const plannedSprints = sprints.filter(
    (sprint) =>
      sprint.status === "Planning" ||
      sprint.status === "Planned"
  );

  /* =====================================================
     CREATE SPRINT
  ===================================================== */

  const openCreateModal = () => {
    setCreateForm({
      name: "",
      goal: "",
      description: "",
      startDate: "",
      endDate: "",
      priority: "Medium",
      tasks: "",
      team: "",
    });

    setCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setCreateModalOpen(false);
  };

  const handleCreateChange = (event) => {
    const { name, value } = event.target;

    setCreateForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleCreateSprint = (event) => {
    event.preventDefault();

    if (
      !createForm.name.trim() ||
      !createForm.goal.trim() ||
      !createForm.startDate ||
      !createForm.endDate
    ) {
      showMessage(
        "Please complete all required fields."
      );
      return;
    }

    if (
      new Date(createForm.endDate) <
      new Date(createForm.startDate)
    ) {
      showMessage(
        "End date cannot be before start date."
      );
      return;
    }

    const newStart = new Date(createForm.startDate);
    const newEnd = new Date(createForm.endDate);

    const hasConflict = sprints.some((sprint) => {
      if (
        !sprint.startDate ||
        !sprint.endDate
      ) {
        return false;
      }

      const existingStart = new Date(
        sprint.startDate
      );

      const existingEnd = new Date(
        sprint.endDate
      );

      return (
        newStart <= existingEnd &&
        newEnd >= existingStart
      );
    });

    if (hasConflict) {
      showMessage(
        "Sprint schedule conflict detected."
      );
      return;
    }

    const numberOfTasks =
      Number(createForm.tasks) || 0;

    const newSprint = {
      id: Date.now(),
      name: createForm.name.trim(),
      goal: createForm.goal.trim(),
      description:
        createForm.description.trim(),
      status: "Planning",
      progress: 0,
      tasks: numberOfTasks,
      completedTasks: 0,
      team: Number(createForm.team) || 0,
      teamPerformance: 0,
      startDate: createForm.startDate,
      endDate: createForm.endDate,
      priority: createForm.priority,
      backlog: [],
      activityLog: [
        {
          action: "SPRINT_CREATED",
          sprintName:
            createForm.name.trim(),
          timestamp:
            new Date().toISOString(),
        },
      ],
    };

    setSprints((currentSprints) => [
      ...currentSprints,
      newSprint,
    ]);

    closeCreateModal();

    showMessage(
      "Sprint created successfully."
    );
  };

  /* =====================================================
     START SPRINT
  ===================================================== */

  const openStartModal = (sprint) => {
    if (!sprint) {
      showMessage("Sprint not found.");
      return;
    }

    if (sprint.status === "Active") {
      showMessage(
        "Sprint is already started."
      );
      return;
    }

    if (
      sprint.status !== "Planning" &&
      sprint.status !== "Planned"
    ) {
      showMessage(
        "Only planned sprints can be started."
      );
      return;
    }

    if (Number(sprint.tasks) <= 0) {
      showMessage(
        "Cannot start sprint without assigned tasks."
      );
      return;
    }

    if (
      !sprint.startDate ||
      !sprint.endDate ||
      new Date(sprint.endDate) <
        new Date(sprint.startDate)
    ) {
      showMessage(
        "Invalid sprint schedule."
      );
      return;
    }

    setSelectedStartSprint({
      ...sprint,
    });

    setStartModalOpen(true);
  };

  const closeStartModal = () => {
    setStartModalOpen(false);
    setSelectedStartSprint(null);
  };

  const handleStartSprint = (sprint) => {
    if (!sprint) {
      showMessage("Sprint not found.");
      return;
    }

    const existingSprint = sprints.find(
      (item) => item.id === sprint.id
    );

    if (!existingSprint) {
      showMessage("Sprint not found.");
      return;
    }

    if (existingSprint.status === "Active") {
      showMessage(
        "Sprint is already started."
      );

      closeStartModal();
      return;
    }

    if (
      existingSprint.status !== "Planning" &&
      existingSprint.status !== "Planned"
    ) {
      showMessage(
        "Only planned sprints can be started."
      );
      return;
    }

    if (
      Number(existingSprint.tasks) <= 0
    ) {
      showMessage(
        "Cannot start sprint without assigned tasks."
      );
      return;
    }

    setSprints((currentSprints) =>
      currentSprints.map((item) => {
        if (item.id !== sprint.id) {
          return item;
        }

        return {
          ...item,
          status: "Active",
          progress:
            Number(item.progress) || 0,
          startedAt:
            new Date().toISOString(),

          activityLog: [
            ...(item.activityLog || []),
            {
              action: "SPRINT_STARTED",
              sprintId: item.id,
              sprintName: item.name,
              timestamp:
                new Date().toISOString(),
            },
          ],

          notificationsSent: true,
        };
      })
    );

    closeStartModal();

    showMessage(
      "Sprint started successfully."
    );
  };

  /* =====================================================
     COMPLETE SPRINT
  ===================================================== */

  const openCompleteModal = (sprint) => {
    if (!sprint) {
      return;
    }

    if (sprint.status !== "Active") {
      showMessage(
        "Only active sprints can be completed."
      );
      return;
    }

    setSelectedSprint(sprint);
    setCompleteModalOpen(true);
  };

  const closeCompleteModal = () => {
    setCompleteModalOpen(false);
    setSelectedSprint(null);
  };

  const handleCompleteSprint = ({
    sprintId,
    incompleteTaskAction,
  }) => {
    setSprints((currentSprints) =>
      currentSprints.map((sprint) => {
        if (sprint.id !== sprintId) {
          return sprint;
        }

        return {
          ...sprint,
          status: "Completed",
          progress: 100,
          completedTasks: sprint.tasks,
          incompleteTaskAction,
          completedAt:
            new Date().toISOString(),

          activityLog: [
            ...(sprint.activityLog || []),
            {
              action: "SPRINT_COMPLETED",
              sprintId: sprint.id,
              sprintName: sprint.name,
              timestamp:
                new Date().toISOString(),
            },
          ],
        };
      })
    );

    closeCompleteModal();

    showMessage(
      "Sprint completed successfully."
    );
  };

  /* =====================================================
     UPDATE SPRINT
  ===================================================== */

  const openUpdateModal = (sprint) => {
    if (!sprint) {
      return;
    }

    setSelectedUpdateSprint({
      ...sprint,
    });

    setUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setUpdateModalOpen(false);
    setSelectedUpdateSprint(null);
  };

  const handleUpdateSprint = (updatedSprint) => {
    if (!updatedSprint) {
      return;
    }

    if (
      !updatedSprint.name ||
      !updatedSprint.name.trim() ||
      !updatedSprint.goal ||
      !updatedSprint.goal.trim() ||
      !updatedSprint.startDate ||
      !updatedSprint.endDate
    ) {
      showMessage(
        "Please complete all required fields."
      );
      return;
    }

    if (
      new Date(updatedSprint.endDate) <
      new Date(updatedSprint.startDate)
    ) {
      showMessage(
        "End date cannot be before start date."
      );
      return;
    }

    const hasConflict = sprints.some(
      (sprint) => {
        if (
          sprint.id === updatedSprint.id
        ) {
          return false;
        }

        if (
          !sprint.startDate ||
          !sprint.endDate
        ) {
          return false;
        }

        const updatedStart =
          new Date(
            updatedSprint.startDate
          );

        const updatedEnd =
          new Date(
            updatedSprint.endDate
          );

        const existingStart =
          new Date(
            sprint.startDate
          );

        const existingEnd =
          new Date(
            sprint.endDate
          );

        return (
          updatedStart <= existingEnd &&
          updatedEnd >= existingStart
        );
      }
    );

    if (hasConflict) {
      showMessage(
        "Sprint schedule conflict detected."
      );
      return;
    }

    setSprints((currentSprints) =>
      currentSprints.map((sprint) => {
        if (
          sprint.id !==
          updatedSprint.id
        ) {
          return sprint;
        }

        return {
          ...sprint,
          ...updatedSprint,

          name:
            updatedSprint.name.trim(),

          goal:
            updatedSprint.goal.trim(),

          description:
            updatedSprint.description
              ? updatedSprint.description.trim()
              : "",

          progress: Math.min(
            Math.max(
              Number(
                updatedSprint.progress
              ) || 0,
              0
            ),
            100
          ),

          tasks: Math.max(
            Number(
              updatedSprint.tasks
            ) || 0,
            0
          ),

          completedTasks:
            Math.max(
              Number(
                updatedSprint.completedTasks
              ) || 0,
              0
            ),

          team: Math.max(
            Number(
              updatedSprint.team
            ) || 0,
            0
          ),

          priority:
            updatedSprint.priority ||
            sprint.priority ||
            "Medium",

          backlog:
            Array.isArray(
              updatedSprint.backlog
            )
              ? updatedSprint.backlog
              : sprint.backlog || [],

          activityLog: [
            ...(sprint.activityLog || []),
            {
              action: "SPRINT_UPDATED",
              sprintId: sprint.id,
              sprintName:
                updatedSprint.name.trim(),
              timestamp:
                new Date().toISOString(),
            },
          ],
        };
      })
    );

    closeUpdateModal();

    showMessage(
      "Sprint updated successfully."
    );
  };

  /* =====================================================
     DELETE SPRINT
  ===================================================== */

  const openDeleteModal = (sprint) => {
    if (!sprint) {
      showMessage("Sprint not found.");
      return;
    }

    setSelectedDeleteSprint({
      ...sprint,
    });

    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedDeleteSprint(null);
  };

  const handleDeleteSprint = (sprint) => {
    if (!sprint) {
      showMessage("Sprint not found.");
      return;
    }

    const sprintExists = sprints.some(
      (item) => item.id === sprint.id
    );

    if (!sprintExists) {
      showMessage("Sprint not found.");
      closeDeleteModal();
      return;
    }

    setSprints((currentSprints) =>
      currentSprints.filter(
        (item) => item.id !== sprint.id
      )
    );

    closeDeleteModal();

    showMessage(
      "Sprint deleted successfully."
    );
  };

  /* =====================================================
     VIEW SPRINT BACKLOG
  ===================================================== */

  const openBacklogModal = (sprint) => {
    if (!sprint) {
      showMessage("Sprint not found.");
      return;
    }

    // Get the latest sprint from state
    const currentSprint = sprints.find(
      (item) => item.id === sprint.id
    );

    if (!currentSprint) {
      showMessage("Sprint not found.");
      return;
    }

    // Open using latest state
    setSelectedBacklogSprint(currentSprint);
    setBacklogModalOpen(true);

    // Record backlog access
    setSprints((currentSprints) =>
      currentSprints.map((item) => {
        if (item.id !== sprint.id) {
          return item;
        }

        return {
          ...item,

          activityLog: [
            ...(item.activityLog || []),
            {
              action:
                "SPRINT_BACKLOG_VIEWED",
              sprintId: item.id,
              sprintName: item.name,
              timestamp:
                new Date().toISOString(),
            },
          ],
        };
      })
    );
  };

  const closeBacklogModal = () => {
    setBacklogModalOpen(false);
    setSelectedBacklogSprint(null);
  };

  /* =====================================================
     RETURN
  ===================================================== */

  return (
    <div className="min-h-full bg-[#020617]">
      {/* SUCCESS MESSAGE */}

      {successMessage && (
        <div
          className="
            fixed
            right-6
            top-24
            z-[200]
            flex
            max-w-sm
            items-center
            gap-3
            rounded-xl
            border
            border-green-500/30
            bg-[#0f172a]
            px-5
            py-4
            shadow-2xl
          "
        >
          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-green-500/10
            "
          >
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

      {/* MAIN CONTENT */}

      <div className="px-6 py-8 lg:px-8">
        {/* HEADER */}

        <div
          className="
            mb-8
            flex
            flex-col
            gap-5
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >
          <div>
            <div className="mb-2 flex items-center gap-3">
              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-blue-600/10
                  text-blue-400
                "
              >
                <Layers3 size={23} />
              </div>

              <h1
                className="
                  text-3xl
                  font-bold
                  tracking-tight
                  text-white
                "
              >
                Sprint Management
              </h1>
            </div>

            <p
              className="
                max-w-2xl
                text-sm
                leading-6
                text-gray-400
              "
            >
              Plan, start, monitor, update,
              complete and review project
              sprints and their backlogs.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="
              flex
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-blue-600
              px-5
              py-3
              text-sm
              font-semibold
              text-white
              shadow-lg
              transition-all
              duration-200
              hover:bg-blue-500
              hover:shadow-blue-500/20
              active:scale-[0.98]
            "
          >
            <Plus size={18} />
            Create Sprint
          </button>
        </div>

        {/* STATISTICS */}

        <div
          className="
            mb-10
            grid
            grid-cols-1
            gap-5
            sm:grid-cols-2
            xl:grid-cols-4
          "
        >
          {/* TOTAL */}

          <div
            className="
              group
              rounded-2xl
              border
              border-gray-800
              bg-[#0f172a]
              p-5
              shadow-lg
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-blue-500/50
              hover:bg-[#111c32]
              hover:shadow-xl
              hover:shadow-blue-500/10
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">
                  Total Sprints
                </p>

                <p className="mt-2 text-3xl font-bold text-white">
                  {sprints.length}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  All project sprints
                </p>
              </div>

              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  bg-blue-500/10
                  text-blue-400
                "
              >
                <Layers3 size={22} />
              </div>
            </div>
          </div>

          {/* ACTIVE */}

          <div
            className="
              group
              rounded-2xl
              border
              border-gray-800
              bg-[#0f172a]
              p-5
              shadow-lg
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-green-500/50
              hover:bg-[#111c32]
              hover:shadow-xl
              hover:shadow-green-500/10
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">
                  Active Sprints
                </p>

                <p className="mt-2 text-3xl font-bold text-white">
                  {activeSprints.length}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Currently in progress
                </p>
              </div>

              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  bg-green-500/10
                  text-green-400
                "
              >
                <Activity size={22} />
              </div>
            </div>
          </div>

          {/* COMPLETED */}

          <div
            className="
              group
              rounded-2xl
              border
              border-gray-800
              bg-[#0f172a]
              p-5
              shadow-lg
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-purple-500/50
              hover:bg-[#111c32]
              hover:shadow-xl
              hover:shadow-purple-500/10
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">
                  Completed
                </p>

                <p className="mt-2 text-3xl font-bold text-white">
                  {completedSprints.length}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Successfully finished
                </p>
              </div>

              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  bg-purple-500/10
                  text-purple-400
                "
              >
                <CheckCircle2 size={22} />
              </div>
            </div>
          </div>

          {/* PLANNING */}

          <div
            className="
              group
              rounded-2xl
              border
              border-gray-800
              bg-[#0f172a]
              p-5
              shadow-lg
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-yellow-500/50
              hover:bg-[#111c32]
              hover:shadow-xl
              hover:shadow-yellow-500/10
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">
                  Planning
                </p>

                <p className="mt-2 text-3xl font-bold text-white">
                  {plannedSprints.length}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Ready to start
                </p>
              </div>

              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  bg-yellow-500/10
                  text-yellow-400
                "
              >
                <Clock3 size={22} />
              </div>
            </div>
          </div>
        </div>

        {/* SPRINT LIST */}

        <section>
          <div
            className="
              mb-6
              flex
              items-end
              justify-between
            "
          >
            <div>
              <h2 className="text-2xl font-bold text-white">
                Project Sprints
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                Create, start, update, complete
                and view sprint backlogs.
              </p>
            </div>

            <span
              className="
                hidden
                rounded-full
                border
                border-gray-700
                bg-[#0f172a]
                px-4
                py-2
                text-sm
                text-gray-400
                sm:block
              "
            >
              {sprints.length} Sprints
            </span>
          </div>

          {sprints.length > 0 && (
            <div
              className="
                grid
                grid-cols-1
                gap-6
                xl:grid-cols-2
              "
            >
              {sprints.map((sprint) => (
                <SprintCard
                  key={sprint.id}
                  sprint={sprint}
                  onStart={openStartModal}
                  onUpdate={openUpdateModal}
                  onDelete={openDeleteModal}
                  onComplete={openCompleteModal}
                  onViewBacklog={
                    openBacklogModal
                  }
                />
              ))}
            </div>
          )}

          {sprints.length === 0 && (
            <div
              className="
                rounded-2xl
                border
                border-dashed
                border-gray-700
                bg-[#0f172a]
                p-12
                text-center
              "
            >
              <Layers3
                size={40}
                className="mx-auto text-gray-600"
              />

              <h3
                className="
                  mt-4
                  text-lg
                  font-semibold
                  text-white
                "
              >
                No sprints available
              </h3>

              <p className="mt-2 text-sm text-gray-400">
                Create a sprint to start
                managing project work.
              </p>

              <button
                type="button"
                onClick={openCreateModal}
                className="
                  mt-6
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-blue-600
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-blue-500
                "
              >
                <Plus size={18} />
                Create Sprint
              </button>
            </div>
          )}
        </section>
      </div>

      {/* =====================================================
          CREATE SPRINT MODAL
      ===================================================== */}

      {createModalOpen && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            p-4
          "
        >
          <div
            className="
              absolute
              inset-0
              bg-black/70
              backdrop-blur-sm
            "
            onClick={closeCreateModal}
          />

          <div
            className="
              relative
              z-10
              max-h-[90vh]
              w-full
              max-w-2xl
              overflow-y-auto
              rounded-2xl
              border
              border-gray-800
              bg-[#0f172a]
              shadow-2xl
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-gray-800
                p-6
              "
            >
              <div>
                <h2 className="text-xl font-bold text-white">
                  Create New Sprint
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                  Add the sprint information below.
                </p>
              </div>

              <button
                type="button"
                onClick={closeCreateModal}
                className="
                  rounded-lg
                  p-2
                  text-gray-400
                  transition
                  hover:bg-gray-800
                  hover:text-white
                "
              >
                ×
              </button>
            </div>

            <form
              onSubmit={handleCreateSprint}
              className="p-6"
            >
              <div className="mb-5">
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Sprint Name
                  <span className="text-red-400">
                    {" "}
                    *
                  </span>
                </label>

                <input
                  type="text"
                  name="name"
                  value={createForm.name}
                  onChange={handleCreateChange}
                  placeholder="Example: Sprint 04"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-gray-700
                    bg-[#020617]
                    px-4
                    py-3
                    text-sm
                    text-white
                    outline-none
                    placeholder:text-gray-600
                    focus:border-blue-500
                    focus:ring-1
                    focus:ring-blue-500
                  "
                  required
                />
              </div>

              <div className="mb-5">
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Sprint Goal
                  <span className="text-red-400">
                    {" "}
                    *
                  </span>
                </label>

                <textarea
                  name="goal"
                  value={createForm.goal}
                  onChange={handleCreateChange}
                  placeholder="Describe what this sprint should accomplish..."
                  rows={3}
                  className="
                    w-full
                    resize-none
                    rounded-xl
                    border
                    border-gray-700
                    bg-[#020617]
                    px-4
                    py-3
                    text-sm
                    text-white
                    outline-none
                    placeholder:text-gray-600
                    focus:border-blue-500
                    focus:ring-1
                    focus:ring-blue-500
                  "
                  required
                />
              </div>

              <div className="mb-5">
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Sprint Description
                </label>

                <textarea
                  name="description"
                  value={createForm.description}
                  onChange={handleCreateChange}
                  placeholder="Add more details about this sprint..."
                  rows={3}
                  className="
                    w-full
                    resize-none
                    rounded-xl
                    border
                    border-gray-700
                    bg-[#020617]
                    px-4
                    py-3
                    text-sm
                    text-white
                    outline-none
                    placeholder:text-gray-600
                    focus:border-blue-500
                    focus:ring-1
                    focus:ring-blue-500
                  "
                />
              </div>

              <div
                className="
                  mb-5
                  grid
                  grid-cols-1
                  gap-4
                  sm:grid-cols-2
                "
              >
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Start Date *
                  </label>

                  <input
                    type="date"
                    name="startDate"
                    value={
                      createForm.startDate
                    }
                    onChange={
                      handleCreateChange
                    }
                    className="
                      w-full
                      rounded-xl
                      border
                      border-gray-700
                      bg-[#020617]
                      px-4
                      py-3
                      text-sm
                      text-white
                      outline-none
                      focus:border-blue-500
                    "
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    End Date *
                  </label>

                  <input
                    type="date"
                    name="endDate"
                    value={
                      createForm.endDate
                    }
                    onChange={
                      handleCreateChange
                    }
                    className="
                      w-full
                      rounded-xl
                      border
                      border-gray-700
                      bg-[#020617]
                      px-4
                      py-3
                      text-sm
                      text-white
                      outline-none
                      focus:border-blue-500
                    "
                    required
                  />
                </div>
              </div>

              <div className="mb-5">
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Sprint Priority
                </label>

                <select
                  name="priority"
                  value={createForm.priority}
                  onChange={
                    handleCreateChange
                  }
                  className="
                    w-full
                    rounded-xl
                    border
                    border-gray-700
                    bg-[#020617]
                    px-4
                    py-3
                    text-sm
                    text-white
                    outline-none
                    focus:border-blue-500
                  "
                >
                  <option value="Low">
                    Low
                  </option>

                  <option value="Medium">
                    Medium
                  </option>

                  <option value="High">
                    High
                  </option>
                </select>
              </div>

              <div
                className="
                  mb-6
                  grid
                  grid-cols-1
                  gap-4
                  sm:grid-cols-2
                "
              >
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Number of Tasks
                  </label>

                  <input
                    type="number"
                    name="tasks"
                    value={createForm.tasks}
                    onChange={
                      handleCreateChange
                    }
                    min="0"
                    placeholder="0"
                    className="
                      w-full
                      rounded-xl
                      border
                      border-gray-700
                      bg-[#020617]
                      px-4
                      py-3
                      text-sm
                      text-white
                      outline-none
                      focus:border-blue-500
                    "
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Team Members
                  </label>

                  <input
                    type="number"
                    name="team"
                    value={createForm.team}
                    onChange={
                      handleCreateChange
                    }
                    min="0"
                    placeholder="0"
                    className="
                      w-full
                      rounded-xl
                      border
                      border-gray-700
                      bg-[#020617]
                      px-4
                      py-3
                      text-sm
                      text-white
                      outline-none
                      focus:border-blue-500
                    "
                  />
                </div>
              </div>

              <div
                className="
                  flex
                  flex-col-reverse
                  gap-3
                  sm:flex-row
                  sm:justify-end
                "
              >
                <button
                  type="button"
                  onClick={
                    closeCreateModal
                  }
                  className="
                    rounded-xl
                    border
                    border-gray-700
                    px-5
                    py-3
                    text-sm
                    font-semibold
                    text-gray-300
                    transition
                    hover:bg-gray-800
                    hover:text-white
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-blue-600
                    px-5
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:bg-blue-500
                  "
                >
                  <Plus size={18} />
                  Create Sprint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          START SPRINT
      ===================================================== */}

      <StartSprintModal
        open={startModalOpen}
        sprint={selectedStartSprint}
        onClose={closeStartModal}
        onConfirm={handleStartSprint}
      />

      {/* =====================================================
          UPDATE SPRINT
      ===================================================== */}

      <UpdateSprintModal
        open={updateModalOpen}
        sprint={selectedUpdateSprint}
        onClose={closeUpdateModal}
        onUpdate={handleUpdateSprint}
      />

      {/* =====================================================
          COMPLETE SPRINT
      ===================================================== */}

      <CompleteSprintModal
        open={completeModalOpen}
        sprint={selectedSprint}
        close={closeCompleteModal}
        onConfirm={handleCompleteSprint}
      />

      {/* =====================================================
          DELETE SPRINT
      ===================================================== */}

      <DeleteSprintModal
        open={deleteModalOpen}
        sprint={selectedDeleteSprint}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteSprint}
      />

      {/* =====================================================
          SPRINT BACKLOG
      ===================================================== */}

      <SprintBacklogModal
        open={backlogModalOpen}
        sprint={selectedBacklogSprint}
        onClose={closeBacklogModal}
      />
    </div>
  );
}

export default SprintManagement;