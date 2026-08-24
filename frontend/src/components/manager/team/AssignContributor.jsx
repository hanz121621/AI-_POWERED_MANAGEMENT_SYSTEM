import React, { useMemo, useState } from "react";

import {
  UserPlus,
  Users,
  CheckCircle2,
  AlertTriangle,
  Search,
  BriefcaseBusiness,
  ClipboardList,
  UserCheck,
  X,
  ShieldCheck,
  Activity,
  ChevronDown,
} from "lucide-react";

function AssignContributor() {
  // ============================================================
  // DEMO PROJECTS
  // ============================================================

  const projects = [
    {
      id: 1,
      name: "AI-Powered Project Management System",
      team: "AI-PMS Development Team",
    },
    {
      id: 2,
      name: "FieldSync",
      team: "FieldSync Development Team",
    },
    {
      id: 3,
      name: "Library Management System",
      team: "Library Development Team",
    },
  ];

  // ============================================================
  // DEMO TASKS
  // ============================================================

  const initialTasks = [
    {
      id: 101,
      projectId: 1,
      name: "Implement authentication",
      description:
        "Complete login, registration and authentication validation.",
      priority: "High",
      status: "To Do",
      assignedTo: null,
    },
    {
      id: 102,
      projectId: 1,
      name: "Build project dashboard",
      description:
        "Create the manager project dashboard interface.",
      priority: "High",
      status: "To Do",
      assignedTo: null,
    },
    {
      id: 103,
      projectId: 1,
      name: "Implement task management",
      description:
        "Create task creation, editing and tracking functionality.",
      priority: "Medium",
      status: "In Progress",
      assignedTo: 2,
    },
    {
      id: 104,
      projectId: 1,
      name: "AI risk detection",
      description:
        "Develop AI-powered project risk detection.",
      priority: "High",
      status: "To Do",
      assignedTo: null,
    },
    {
      id: 201,
      projectId: 2,
      name: "Offline registration",
      description:
        "Implement offline citizen registration.",
      priority: "High",
      status: "To Do",
      assignedTo: null,
    },
    {
      id: 202,
      projectId: 2,
      name: "Sync engine",
      description:
        "Implement batch synchronization when connectivity returns.",
      priority: "High",
      status: "To Do",
      assignedTo: null,
    },
    {
      id: 301,
      projectId: 3,
      name: "Book management",
      description:
        "Implement library book management.",
      priority: "Medium",
      status: "To Do",
      assignedTo: null,
    },
  ];

  // ============================================================
  // DEMO CONTRIBUTORS
  // ============================================================

  const contributors = [
    {
      id: 1,
      name: "Abebe",
      email: "abebe@aipms.com",
      role: "Frontend Developer",
      projectIds: [1, 2],
      active: true,
      workload: 6,
      workloadCapacity: 10,
      assignedTasks: 4,
      skills: ["React", "JavaScript", "Tailwind CSS"],
      sprintContribution: 82,
    },
    {
      id: 2,
      name: "Hana",
      email: "hana@aipms.com",
      role: "Backend Developer",
      projectIds: [1],
      active: true,
      workload: 8,
      workloadCapacity: 10,
      assignedTasks: 5,
      skills: [".NET", "C#", "PostgreSQL"],
      sprintContribution: 91,
    },
    {
      id: 3,
      name: "Kidist",
      email: "kidist@aipms.com",
      role: "Full Stack Developer",
      projectIds: [1, 3],
      active: true,
      workload: 4,
      workloadCapacity: 10,
      assignedTasks: 3,
      skills: ["React", ".NET", "REST API"],
      sprintContribution: 88,
    },
    {
      id: 4,
      name: "Eyerusalem",
      email: "eyerusalem@aipms.com",
      role: "QA Engineer",
      projectIds: [1, 2],
      active: true,
      workload: 3,
      workloadCapacity: 10,
      assignedTasks: 2,
      skills: ["Testing", "QA", "Automation"],
      sprintContribution: 76,
    },
    {
      id: 5,
      name: "Dawit",
      email: "dawit@aipms.com",
      role: "UI/UX Developer",
      projectIds: [2],
      active: true,
      workload: 9,
      workloadCapacity: 10,
      assignedTasks: 6,
      skills: ["Figma", "UI Design", "CSS"],
      sprintContribution: 69,
    },
    {
      id: 6,
      name: "Meron",
      email: "meron@aipms.com",
      role: "Developer",
      projectIds: [3],
      active: false,
      workload: 2,
      workloadCapacity: 10,
      assignedTasks: 1,
      skills: ["Java", "SQL"],
      sprintContribution: 61,
    },
  ];

  // ============================================================
  // STATE
  // ============================================================

  const [selectedProjectId, setSelectedProjectId] = useState(1);

  const [selectedTaskId, setSelectedTaskId] = useState("");

  const [selectedContributorId, setSelectedContributorId] =
    useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [tasks, setTasks] = useState(initialTasks);

  const [activityLog, setActivityLog] = useState([]);

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  // ============================================================
  // CURRENT PROJECT
  // ============================================================

  const selectedProject = useMemo(() => {
    return projects.find(
      (project) => project.id === Number(selectedProjectId)
    );
  }, [selectedProjectId]);

  // ============================================================
  // PROJECT TASKS
  // ============================================================

  const projectTasks = useMemo(() => {
    return tasks.filter(
      (task) =>
        task.projectId === Number(selectedProjectId)
    );
  }, [tasks, selectedProjectId]);

  // ============================================================
  // AVAILABLE CONTRIBUTORS
  // ============================================================

  const availableContributors = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return contributors.filter((contributor) => {
      const belongsToProject =
        contributor.projectIds.includes(
          Number(selectedProjectId)
        );

      const matchesSearch =
        !normalizedSearch ||
        contributor.name
          .toLowerCase()
          .includes(normalizedSearch) ||
        contributor.email
          .toLowerCase()
          .includes(normalizedSearch) ||
        contributor.role
          .toLowerCase()
          .includes(normalizedSearch) ||
        contributor.skills.some((skill) =>
          skill.toLowerCase().includes(normalizedSearch)
        );

      return belongsToProject && matchesSearch;
    });
  }, [selectedProjectId, searchTerm]);

  // ============================================================
  // SELECTED TASK
  // ============================================================

  const selectedTask = useMemo(() => {
    return tasks.find(
      (task) => task.id === Number(selectedTaskId)
    );
  }, [tasks, selectedTaskId]);

  // ============================================================
  // SELECTED CONTRIBUTOR
  // ============================================================

  const selectedContributor = useMemo(() => {
    return contributors.find(
      (contributor) =>
        contributor.id === selectedContributorId
    );
  }, [selectedContributorId]);

  // ============================================================
  // HELPERS
  // ============================================================

  const clearMessages = () => {
    setSuccessMessage("");
    setErrorMessage("");
  };

  const getWorkloadPercentage = (contributor) => {
    if (
      !contributor ||
      !contributor.workloadCapacity ||
      contributor.workloadCapacity <= 0
    ) {
      return 0;
    }

    return Math.min(
      Math.round(
        (contributor.workload /
          contributor.workloadCapacity) *
          100
      ),
      100
    );
  };

  const getWorkloadStatus = (contributor) => {
    const percentage =
      getWorkloadPercentage(contributor);

    if (percentage >= 90) {
      return {
        label: "High",
        className:
          "border-red-500/30 bg-red-500/10 text-red-400",
      };
    }

    if (percentage >= 70) {
      return {
        label: "Moderate",
        className:
          "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
      };
    }

    return {
      label: "Available",
      className:
        "border-green-500/30 bg-green-500/10 text-green-400",
    };
  };

  const getPriorityClass = (priority) => {
    if (priority === "High") {
      return "border-red-500/30 bg-red-500/10 text-red-400";
    }

    if (priority === "Medium") {
      return "border-yellow-500/30 bg-yellow-500/10 text-yellow-400";
    }

    return "border-green-500/30 bg-green-500/10 text-green-400";
  };

  // ============================================================
  // PROJECT CHANGE
  // ============================================================

  const handleProjectChange = (event) => {
    const projectId = Number(event.target.value);

    setSelectedProjectId(projectId);
    setSelectedTaskId("");
    setSelectedContributorId(null);
    setSearchTerm("");

    clearMessages();
  };

  // ============================================================
  // TASK CHANGE
  // ============================================================

  const handleTaskChange = (event) => {
    const taskId = event.target.value;

    setSelectedTaskId(taskId);
    setSelectedContributorId(null);

    clearMessages();
  };

  // ============================================================
  // CONTRIBUTOR SELECT
  // ============================================================

  const handleSelectContributor = (contributor) => {
    clearMessages();

    if (!selectedTask) {
      setErrorMessage(
        "Please select a task before selecting a contributor."
      );
      return;
    }

    if (!contributor) {
      setErrorMessage("Contributor not found.");
      return;
    }

    if (selectedTask.assignedTo) {
      setErrorMessage(
        "This task is already assigned to a contributor."
      );
      return;
    }

    if (!contributor.active) {
      setErrorMessage(
        "This contributor is currently inactive."
      );
      return;
    }

    if (
      !contributor.projectIds.includes(
        Number(selectedProjectId)
      )
    ) {
      setErrorMessage(
        "Contributor cannot be assigned to this project."
      );
      return;
    }

    if (
      contributor.workload >=
      contributor.workloadCapacity
    ) {
      setErrorMessage(
        "Contributor has exceeded workload capacity."
      );
      return;
    }

    setSelectedContributorId(contributor.id);
  };

  // ============================================================
  // OPEN CONFIRMATION
  // ============================================================

  const handleOpenConfirmation = () => {
    clearMessages();

    if (!selectedTask) {
      setErrorMessage(
        "Please select a task before assigning a contributor."
      );
      return;
    }

    if (!selectedContributor) {
      setErrorMessage(
        "Please select a contributor before assigning."
      );
      return;
    }

    if (selectedTask.assignedTo) {
      setErrorMessage(
        "This task is already assigned to a contributor."
      );
      return;
    }

    if (!selectedContributor.active) {
      setErrorMessage(
        "Contributor cannot be assigned because they are inactive."
      );
      return;
    }

    if (
      !selectedContributor.projectIds.includes(
        Number(selectedProjectId)
      )
    ) {
      setErrorMessage(
        "Contributor does not belong to this project."
      );
      return;
    }

    if (
      selectedContributor.workload >=
      selectedContributor.workloadCapacity
    ) {
      setErrorMessage(
        "Contributor has exceeded workload capacity."
      );
      return;
    }

    setShowConfirmModal(true);
  };

  // ============================================================
  // CLOSE CONFIRMATION
  // ============================================================

  const handleCloseConfirmation = () => {
    setShowConfirmModal(false);
  };

  // ============================================================
  // ASSIGN CONTRIBUTOR
  // ============================================================

  const handleAssignContributor = () => {
    clearMessages();

    if (!selectedTask) {
      setErrorMessage("Task not found.");
      setShowConfirmModal(false);
      return;
    }

    if (!selectedContributor) {
      setErrorMessage("Contributor not found.");
      setShowConfirmModal(false);
      return;
    }

    if (selectedTask.assignedTo) {
      setErrorMessage(
        "This task has already been assigned."
      );
      setShowConfirmModal(false);
      return;
    }

    if (!selectedContributor.active) {
      setErrorMessage(
        "Contributor cannot be assigned because they are inactive."
      );
      setShowConfirmModal(false);
      return;
    }

    if (
      !selectedContributor.projectIds.includes(
        Number(selectedProjectId)
      )
    ) {
      setErrorMessage(
        "Contributor cannot be assigned to this project."
      );
      setShowConfirmModal(false);
      return;
    }

    if (
      selectedContributor.workload >=
      selectedContributor.workloadCapacity
    ) {
      setErrorMessage(
        "Contributor has exceeded workload capacity."
      );
      setShowConfirmModal(false);
      return;
    }

    // ========================================================
    // UPDATE TASK
    // ========================================================

    setTasks((currentTasks) =>
      currentTasks.map((task) => {
        if (task.id !== selectedTask.id) {
          return task;
        }

        return {
          ...task,
          assignedTo: selectedContributor.id,
          assignedContributor:
            selectedContributor.name,
        };
      })
    );

    // ========================================================
    // ACTIVITY LOG
    // ========================================================

    const activity = {
      id: Date.now(),
      action: "CONTRIBUTOR_ASSIGNED",
      taskId: selectedTask.id,
      taskName: selectedTask.name,
      contributorId: selectedContributor.id,
      contributorName: selectedContributor.name,
      projectId: selectedProject?.id,
      projectName: selectedProject?.name,
      timestamp: new Date().toISOString(),
    };

    setActivityLog((currentLog) => [
      activity,
      ...currentLog,
    ]);

    // ========================================================
    // RESET
    // ========================================================

    setShowConfirmModal(false);

    setSuccessMessage(
      `${selectedContributor.name} has been assigned to "${selectedTask.name}".`
    );

    setSelectedContributorId(null);
    setSelectedTaskId("");

    // Automatically clear success message
    window.setTimeout(() => {
      setSuccessMessage("");
    }, 4000);
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="w-full space-y-6">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="rounded-2xl border border-gray-800 bg-[#0f172a] p-6 shadow-xl">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <UserPlus size={24} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-white">
                  Assign Contributors to Tasks
                </h1>

                <p className="mt-1 text-sm text-gray-400">
                  Assign available contributors based on
                  project requirements and workload.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-3">
            <ShieldCheck
              size={18}
              className="text-green-400"
            />

            <span className="text-sm text-green-400">
              Manager Access
            </span>
          </div>
        </div>
      </div>

      {/* ======================================================
          SUCCESS MESSAGE
      ====================================================== */}

      {successMessage && (
        <div className="flex items-center gap-3 rounded-xl border border-green-500/30 bg-green-500/10 px-5 py-4">
          <CheckCircle2
            size={21}
            className="text-green-400"
          />

          <div>
            <p className="text-sm font-semibold text-green-300">
              Assignment Successful
            </p>

            <p className="text-xs text-green-400/80">
              {successMessage}
            </p>
          </div>
        </div>
      )}

      {/* ======================================================
          ERROR MESSAGE
      ====================================================== */}

      {errorMessage && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4">
          <AlertTriangle
            size={21}
            className="shrink-0 text-red-400"
          />

          <div className="flex-1">
            <p className="text-sm font-semibold text-red-300">
              Assignment Error
            </p>

            <p className="text-xs text-red-400/80">
              {errorMessage}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setErrorMessage("")}
            aria-label="Close error message"
            className="rounded-lg p-1 text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* ======================================================
          PROJECT + TASK SELECTION
      ====================================================== */}

      <div className="rounded-2xl border border-gray-800 bg-[#0f172a] p-6 shadow-xl">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-white">
            Assignment Details
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Select the project and task that requires a
            contributor.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* PROJECT */}

          <div>
            <label
              htmlFor="project-select"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Project
            </label>

            <div className="relative">
              <BriefcaseBusiness
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <select
                id="project-select"
                value={selectedProjectId}
                onChange={handleProjectChange}
                className="w-full appearance-none rounded-xl border border-gray-700 bg-[#020617] py-3 pl-11 pr-10 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                {projects.map((project) => (
                  <option
                    key={project.id}
                    value={project.id}
                  >
                    {project.name}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={17}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              />
            </div>

            {selectedProject && (
              <p className="mt-2 text-xs text-gray-600">
                {selectedProject.team}
              </p>
            )}
          </div>

          {/* TASK */}

          <div>
            <label
              htmlFor="task-select"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Task
            </label>

            <div className="relative">
              <ClipboardList
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <select
                id="task-select"
                value={selectedTaskId}
                onChange={handleTaskChange}
                className="w-full appearance-none rounded-xl border border-gray-700 bg-[#020617] py-3 pl-11 pr-10 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">
                  Select a task
                </option>

                {projectTasks.map((task) => (
                  <option
                    key={task.id}
                    value={task.id}
                    disabled={Boolean(task.assignedTo)}
                  >
                    {task.name}
                    {task.assignedTo
                      ? " — Already Assigned"
                      : ""}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={17}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              />
            </div>
          </div>
        </div>

        {/* SELECTED TASK */}

        {selectedTask && (
          <div className="mt-5 rounded-xl border border-gray-800 bg-[#020617] p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  Selected Task
                </p>

                <h3 className="mt-1 text-base font-semibold text-white">
                  {selectedTask.name}
                </h3>

                <p className="mt-2 max-w-2xl text-sm text-gray-400">
                  {selectedTask.description}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${getPriorityClass(
                    selectedTask.priority
                  )}`}
                >
                  {selectedTask.priority}
                </span>

                <span className="rounded-full border border-gray-700 bg-gray-800/50 px-3 py-1 text-xs text-gray-300">
                  {selectedTask.status}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================
          CONTRIBUTORS
      ====================================================== */}

      <div className="rounded-2xl border border-gray-800 bg-[#0f172a] p-6 shadow-xl">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Users
                size={21}
                className="text-blue-400"
              />

              <h2 className="text-lg font-bold text-white">
                Available Contributors
              </h2>
            </div>

            <p className="mt-1 text-sm text-gray-400">
              Contributors belonging to the selected
              project.
            </p>
          </div>

          {/* SEARCH */}

          <div className="relative w-full lg:w-80">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              type="text"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search contributors..."
              aria-label="Search contributors"
              className="w-full rounded-xl border border-gray-700 bg-[#020617] py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* EMPTY STATE */}

        {availableContributors.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-700 bg-[#020617] px-6 py-12 text-center">
            <Users
              size={38}
              className="mx-auto text-gray-600"
            />

            <h3 className="mt-4 text-base font-semibold text-white">
              No contributors found
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Try another search or select another
              project.
            </p>
          </div>
        )}

        {/* CONTRIBUTOR GRID */}

        {availableContributors.length > 0 && (
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {availableContributors.map((contributor) => {
              const workloadStatus =
                getWorkloadStatus(contributor);

              const workloadPercentage =
                getWorkloadPercentage(contributor);

              const isSelected =
                selectedContributorId ===
                contributor.id;

              const isOverloaded =
                contributor.workload >=
                contributor.workloadCapacity;

              return (
                <div
                  key={contributor.id}
                  className={`rounded-2xl border bg-[#020617] p-5 transition-all ${
                    isSelected
                      ? "border-blue-500 shadow-lg shadow-blue-500/10"
                      : "border-gray-800 hover:border-gray-700"
                  }`}
                >
                  {/* TOP */}

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-500/10 font-bold text-blue-400">
                        {contributor.name
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>
                        <h3 className="font-semibold text-white">
                          {contributor.name}
                        </h3>

                        <p className="text-xs text-gray-500">
                          {contributor.email}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-medium ${workloadStatus.className}`}
                    >
                      {workloadStatus.label}
                    </span>
                  </div>

                  {/* ROLE */}

                  <div className="mt-5">
                    <p className="text-xs uppercase tracking-wider text-gray-600">
                      Role
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-300">
                      {contributor.role}
                    </p>
                  </div>

                  {/* WORKLOAD */}

                  <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Current Workload
                      </span>

                      <span className="text-xs font-semibold text-gray-300">
                        {contributor.workload}/
                        {contributor.workloadCapacity}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-gray-800">
                      <div
                        className={`h-full rounded-full transition-all ${
                          workloadPercentage >= 90
                            ? "bg-red-500"
                            : workloadPercentage >= 70
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                        style={{
                          width: `${workloadPercentage}%`,
                        }}
                      />
                    </div>

                    <p className="mt-2 text-xs text-gray-600">
                      {workloadPercentage}% capacity
                    </p>
                  </div>

                  {/* DETAILS */}

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-gray-800 bg-[#0f172a] p-3">
                      <p className="text-xs text-gray-500">
                        Assigned Tasks
                      </p>

                      <p className="mt-1 text-lg font-bold text-white">
                        {contributor.assignedTasks}
                      </p>
                    </div>

                    <div className="rounded-xl border border-gray-800 bg-[#0f172a] p-3">
                      <p className="text-xs text-gray-500">
                        Sprint Contribution
                      </p>

                      <p className="mt-1 text-lg font-bold text-white">
                        {contributor.sprintContribution}%
                      </p>
                    </div>
                  </div>

                  {/* SKILLS */}

                  <div className="mt-5">
                    <p className="mb-2 text-xs uppercase tracking-wider text-gray-600">
                      Skills
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {contributor.skills.map(
                        (skill) => (
                          <span
                            key={skill}
                            className="rounded-lg border border-gray-800 bg-[#0f172a] px-2.5 py-1 text-xs text-gray-400"
                          >
                            {skill}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  {/* SELECT BUTTON */}

                  <button
                    type="button"
                    disabled={
                      !contributor.active ||
                      isOverloaded ||
                      !selectedTask ||
                      Boolean(selectedTask?.assignedTo)
                    }
                    onClick={() =>
                      handleSelectContributor(
                        contributor
                      )
                    }
                    className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      isSelected
                        ? "bg-blue-600 text-white"
                        : !contributor.active ||
                          isOverloaded ||
                          !selectedTask ||
                          Boolean(selectedTask?.assignedTo)
                        ? "cursor-not-allowed bg-gray-800 text-gray-500"
                        : "bg-gray-800 text-gray-200 hover:bg-blue-600 hover:text-white"
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle2 size={17} />
                        Contributor Selected
                      </>
                    ) : !contributor.active ? (
                      <>
                        <AlertTriangle size={17} />
                        Inactive Contributor
                      </>
                    ) : isOverloaded ? (
                      <>
                        <AlertTriangle size={17} />
                        Workload Exceeded
                      </>
                    ) : !selectedTask ? (
                      <>
                        <ClipboardList size={17} />
                        Select a Task First
                      </>
                    ) : selectedTask.assignedTo ? (
                      <>
                        <AlertTriangle size={17} />
                        Task Already Assigned
                      </>
                    ) : (
                      <>
                        <UserCheck size={17} />
                        Select Contributor
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* ==================================================
            ASSIGN BUTTON
        ================================================== */}

        <div className="mt-6 flex flex-col gap-4 rounded-xl border border-gray-800 bg-[#020617] p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-white">
              Ready to assign?
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Select a task and an available contributor
              before confirming.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenConfirmation}
            disabled={
              !selectedTask || !selectedContributor
            }
            className={`flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition ${
              !selectedTask || !selectedContributor
                ? "cursor-not-allowed bg-gray-800 text-gray-500"
                : "bg-blue-600 text-white shadow-lg shadow-blue-500/10 hover:bg-blue-500 active:scale-[0.98]"
            }`}
          >
            <UserPlus size={18} />
            Assign Contributor
          </button>
        </div>
      </div>

      {/* ======================================================
          ACTIVITY LOG
      ====================================================== */}

      <div className="rounded-2xl border border-gray-800 bg-[#0f172a] p-6 shadow-xl">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
            <Activity size={20} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-white">
              Assignment Activity
            </h2>

            <p className="text-sm text-gray-500">
              Recent contributor assignment actions.
            </p>
          </div>
        </div>

        {activityLog.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-800 bg-[#020617] p-8 text-center">
            <Activity
              size={30}
              className="mx-auto text-gray-700"
            />

            <p className="mt-3 text-sm text-gray-500">
              No assignment activity yet.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {activityLog.map((activity) => (
              <div
                key={activity.id}
                className="flex flex-col gap-3 rounded-xl border border-gray-800 bg-[#020617] p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-green-400">
                    <UserPlus size={16} />
                  </div>

                  <div>
                    <p className="text-sm text-gray-300">
                      <span className="font-semibold text-white">
                        {activity.contributorName}
                      </span>{" "}
                      was assigned to{" "}
                      <span className="font-semibold text-white">
                        {activity.taskName}
                      </span>
                    </p>

                    <p className="mt-1 text-xs text-gray-600">
                      {activity.projectName}
                    </p>
                  </div>
                </div>

                <span className="text-xs text-gray-600">
                  {new Date(
                    activity.timestamp
                  ).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ======================================================
          CONFIRMATION MODAL
      ====================================================== */}

      {showConfirmModal && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="assignment-modal-title"
        >
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-gray-800 bg-[#0f172a] shadow-2xl">
            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-gray-800 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                  <UserPlus size={20} />
                </div>

                <div>
                  <h2
                    id="assignment-modal-title"
                    className="text-lg font-bold text-white"
                  >
                    Confirm Assignment
                  </h2>

                  <p className="text-xs text-gray-500">
                    Review the assignment before confirming.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseConfirmation}
                aria-label="Close confirmation modal"
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-800 hover:text-white"
              >
                <X size={19} />
              </button>
            </div>

            {/* MODAL BODY */}

            <div className="space-y-4 p-6">
              {/* PROJECT */}

              <div className="rounded-xl border border-gray-800 bg-[#020617] p-4">
                <p className="text-xs uppercase tracking-wider text-gray-600">
                  Project
                </p>

                <p className="mt-1 text-sm font-semibold text-white">
                  {selectedProject?.name}
                </p>
              </div>

              {/* TASK */}

              <div className="rounded-xl border border-gray-800 bg-[#020617] p-4">
                <p className="text-xs uppercase tracking-wider text-gray-600">
                  Task
                </p>

                <p className="mt-1 text-sm font-semibold text-white">
                  {selectedTask?.name}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {selectedTask?.description}
                </p>
              </div>

              {/* CONTRIBUTOR */}

              <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                <p className="text-xs uppercase tracking-wider text-blue-400/70">
                  Contributor
                </p>

                <div className="mt-2 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 font-bold text-blue-400">
                    {selectedContributor?.name
                      ?.charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      {selectedContributor?.name}
                    </p>

                    <p className="text-xs text-gray-500">
                      {selectedContributor?.role}
                    </p>
                  </div>
                </div>
              </div>

              {/* VALIDATION SUMMARY */}

              <div className="rounded-xl border border-gray-800 bg-[#020617] p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Validation
                </p>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-green-400">
                    <CheckCircle2 size={15} />
                    Contributor belongs to the project
                  </div>

                  <div className="flex items-center gap-2 text-xs text-green-400">
                    <CheckCircle2 size={15} />
                    Contributor is active
                  </div>

                  <div className="flex items-center gap-2 text-xs text-green-400">
                    <CheckCircle2 size={15} />
                    Workload is within acceptable capacity
                  </div>

                  <div className="flex items-center gap-2 text-xs text-green-400">
                    <CheckCircle2 size={15} />
                    Task is currently unassigned
                  </div>
                </div>
              </div>
            </div>

            {/* MODAL FOOTER */}

            <div className="flex flex-col-reverse gap-3 border-t border-gray-800 p-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleCloseConfirmation}
                className="rounded-xl border border-gray-700 px-5 py-3 text-sm font-semibold text-gray-300 transition hover:bg-gray-800 hover:text-white"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleAssignContributor}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                <UserPlus size={17} />
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AssignContributor;