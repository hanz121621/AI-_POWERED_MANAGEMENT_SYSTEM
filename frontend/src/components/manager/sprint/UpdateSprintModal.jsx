
import React, { useEffect, useState } from "react";
import {
  X,
  Save,
  CalendarDays,
  Target,
  FileText,
  Activity,
  Users,
  ListChecks,
} from "lucide-react";

function UpdateSprintModal({
  open,
  sprint,
  onClose,
  onUpdate,
}) {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    goal: "",
    description: "",
    status: "Planning",
    priority: "Medium",
    progress: 0,
    tasks: 0,
    completedTasks: 0,
    team: 0,
    startDate: "",
    endDate: "",
  });

  // Fill the form when a sprint is selected
  useEffect(() => {
    if (sprint) {
      setFormData({
        id: sprint.id || "",
        name: sprint.name || "",
        goal: sprint.goal || "",
        description: sprint.description || "",
        status: sprint.status || "Planning",
        priority: sprint.priority || "Medium",
        progress: Number(sprint.progress) || 0,
        tasks: Number(sprint.tasks) || 0,
        completedTasks: Number(sprint.completedTasks) || 0,
        team: Number(sprint.team) || 0,
        startDate: sprint.startDate || "",
        endDate: sprint.endDate || "",
      });
    }
  }, [sprint]);

  if (!open || !sprint) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: Number(value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedSprint = {
      ...formData,
      progress: Math.min(
        Math.max(Number(formData.progress) || 0, 0),
        100
      ),
      tasks: Math.max(Number(formData.tasks) || 0, 0),
      completedTasks: Math.max(
        Number(formData.completedTasks) || 0,
        0
      ),
      team: Math.max(Number(formData.team) || 0, 0),
    };

    onUpdate(updatedSprint);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div
        className="
          relative
          flex
          max-h-[90vh]
          w-full
          max-w-3xl
          flex-col
          overflow-hidden
          rounded-2xl
          border
          border-gray-800
          bg-[#0f172a]
          shadow-2xl
        "
      >

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="flex items-center justify-between border-b border-gray-800 px-6 py-5">

          <div>
            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <Activity size={20} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-white">
                  Update Sprint
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Edit sprint information and progress
                </p>
              </div>

            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              text-gray-400
              transition
              hover:bg-gray-800
              hover:text-white
            "
          >
            <X size={20} />
          </button>

        </div>

        {/* =====================================================
            FORM
        ===================================================== */}

        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto px-6 py-6"
        >

          <div className="space-y-6">

            {/* =================================================
                BASIC INFORMATION
            ================================================= */}

            <div>

              <div className="mb-4 flex items-center gap-2">
                <FileText
                  size={17}
                  className="text-blue-400"
                />

                <h3 className="text-sm font-semibold text-white">
                  Basic Information
                </h3>
              </div>

              <div className="grid gap-5 md:grid-cols-2">

                {/* Sprint Name */}

                <div className="md:col-span-2">

                  <label className="mb-2 block text-xs font-medium text-gray-400">
                    Sprint Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter sprint name"
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
                      transition
                      placeholder:text-gray-600
                      focus:border-blue-500
                      focus:ring-2
                      focus:ring-blue-500/10
                    "
                  />

                </div>

                {/* Goal */}

                <div className="md:col-span-2">

                  <label className="mb-2 block text-xs font-medium text-gray-400">
                    Sprint Goal
                  </label>

                  <div className="relative">

                    <Target
                      size={17}
                      className="absolute left-4 top-3.5 text-gray-500"
                    />

                    <input
                      type="text"
                      name="goal"
                      value={formData.goal}
                      onChange={handleChange}
                      placeholder="What should this sprint achieve?"
                      className="
                        w-full
                        rounded-xl
                        border
                        border-gray-700
                        bg-[#020617]
                        py-3
                        pl-11
                        pr-4
                        text-sm
                        text-white
                        outline-none
                        transition
                        placeholder:text-gray-600
                        focus:border-blue-500
                        focus:ring-2
                        focus:ring-blue-500/10
                      "
                    />

                  </div>

                </div>

                {/* Description */}

                <div className="md:col-span-2">

                  <label className="mb-2 block text-xs font-medium text-gray-400">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe the sprint..."
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
                      transition
                      placeholder:text-gray-600
                      focus:border-blue-500
                      focus:ring-2
                      focus:ring-blue-500/10
                    "
                  />

                </div>

              </div>

            </div>

            {/* =================================================
                STATUS & PRIORITY
            ================================================= */}

            <div>

              <div className="mb-4 flex items-center gap-2">
                <Activity
                  size={17}
                  className="text-purple-400"
                />

                <h3 className="text-sm font-semibold text-white">
                  Sprint Settings
                </h3>
              </div>

              <div className="grid gap-5 md:grid-cols-2">

                {/* Status */}

                <div>

                  <label className="mb-2 block text-xs font-medium text-gray-400">
                    Status
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
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
                    <option value="Planning">
                      Planning
                    </option>

                    <option value="Active">
                      Active
                    </option>

                    <option value="Completed">
                      Completed
                    </option>
                  </select>

                </div>

                {/* Priority */}

                <div>

                  <label className="mb-2 block text-xs font-medium text-gray-400">
                    Priority
                  </label>

                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
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

              </div>

            </div>

            {/* =================================================
                PROGRESS & TASKS
            ================================================= */}

            <div>

              <div className="mb-4 flex items-center gap-2">
                <ListChecks
                  size={17}
                  className="text-green-400"
                />

                <h3 className="text-sm font-semibold text-white">
                  Progress & Tasks
                </h3>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                {/* Progress */}

                <div>

                  <label className="mb-2 block text-xs font-medium text-gray-400">
                    Progress (%)
                  </label>

                  <input
                    type="number"
                    name="progress"
                    min="0"
                    max="100"
                    value={formData.progress}
                    onChange={handleNumberChange}
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

                {/* Tasks */}

                <div>

                  <label className="mb-2 block text-xs font-medium text-gray-400">
                    Total Tasks
                  </label>

                  <input
                    type="number"
                    name="tasks"
                    min="0"
                    value={formData.tasks}
                    onChange={handleNumberChange}
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

                {/* Completed Tasks */}

                <div>

                  <label className="mb-2 block text-xs font-medium text-gray-400">
                    Completed Tasks
                  </label>

                  <input
                    type="number"
                    name="completedTasks"
                    min="0"
                    value={formData.completedTasks}
                    onChange={handleNumberChange}
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

                {/* Team */}

                <div>

                  <label className="mb-2 block text-xs font-medium text-gray-400">
                    Team Members
                  </label>

                  <div className="relative">

                    <Users
                      size={16}
                      className="absolute left-3 top-3.5 text-gray-500"
                    />

                    <input
                      type="number"
                      name="team"
                      min="0"
                      value={formData.team}
                      onChange={handleNumberChange}
                      className="
                        w-full
                        rounded-xl
                        border
                        border-gray-700
                        bg-[#020617]
                        py-3
                        pl-9
                        pr-3
                        text-sm
                        text-white
                        outline-none
                        focus:border-blue-500
                      "
                    />

                  </div>

                </div>

              </div>

            </div>

            {/* =================================================
                DATES
            ================================================= */}

            <div>

              <div className="mb-4 flex items-center gap-2">
                <CalendarDays
                  size={17}
                  className="text-yellow-400"
                />

                <h3 className="text-sm font-semibold text-white">
                  Sprint Timeline
                </h3>
              </div>

              <div className="grid gap-5 md:grid-cols-2">

                {/* Start Date */}

                <div>

                  <label className="mb-2 block text-xs font-medium text-gray-400">
                    Start Date
                  </label>

                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
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

                {/* End Date */}

                <div>

                  <label className="mb-2 block text-xs font-medium text-gray-400">
                    End Date
                  </label>

                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
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

            </div>

          </div>

          {/* =====================================================
              FOOTER
          ===================================================== */}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-800 pt-5 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={onClose}
              className="
                rounded-xl
                border
                border-gray-700
                bg-gray-800/50
                px-6
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
                px-6
                py-3
                text-sm
                font-semibold
                text-white
                shadow-lg
                shadow-blue-600/10
                transition
                hover:bg-blue-500
                active:scale-[0.98]
              "
            >
              <Save size={17} />
              Save Changes
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

export default UpdateSprintModal;
