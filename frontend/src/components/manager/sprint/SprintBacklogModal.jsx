import React, { useMemo, useState } from "react";

import {
  X,
  ListTodo,
  Search,
  ArrowUpDown,
  User,
  CalendarDays,
  Clock3,
  BookOpen,
  AlertCircle,
  CheckCircle2,
  Circle,
  LoaderCircle,
} from "lucide-react";

function SprintBacklogModal({
  open,
  sprint,
  onClose,
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All");

  const [priorityFilter, setPriorityFilter] =
    useState("All");

  const [sortBy, setSortBy] =
    useState("deadline");

  const [sortDirection, setSortDirection] =
    useState("asc");

  /* =====================================================
     RESET FILTERS WHEN OPENING ANOTHER SPRINT
  ===================================================== */

  React.useEffect(() => {
    if (open) {
      setSearch("");
      setStatusFilter("All");
      setPriorityFilter("All");
      setSortBy("deadline");
      setSortDirection("asc");
    }
  }, [open, sprint?.id]);

  /* =====================================================
     BACKLOG DATA
  ===================================================== */

  const backlog = Array.isArray(
    sprint?.backlog
  )
    ? sprint.backlog
    : [];

  /* =====================================================
     FILTER + SORT
  ===================================================== */

  const filteredTasks = useMemo(() => {
    let result = [...backlog];

    /* SEARCH */

    if (search.trim()) {
      const query =
        search.toLowerCase();

      result = result.filter((task) => {
        return (
          String(task.name || "")
            .toLowerCase()
            .includes(query) ||
          String(task.description || "")
            .toLowerCase()
            .includes(query) ||
          String(task.contributor || "")
            .toLowerCase()
            .includes(query) ||
          String(task.userStory || "")
            .toLowerCase()
            .includes(query)
        );
      });
    }

    /* STATUS */

    if (statusFilter !== "All") {
      result = result.filter(
        (task) =>
          task.status === statusFilter
      );
    }

    /* PRIORITY */

    if (priorityFilter !== "All") {
      result = result.filter(
        (task) =>
          task.priority ===
          priorityFilter
      );
    }

    /* SORT */

    result.sort((a, b) => {
      let first;
      let second;

      if (sortBy === "deadline") {
        first = new Date(
          a.deadline || "9999-12-31"
        ).getTime();

        second = new Date(
          b.deadline || "9999-12-31"
        ).getTime();
      }

      if (sortBy === "effort") {
        first = Number(a.effort) || 0;
        second = Number(b.effort) || 0;
      }

      if (sortBy === "name") {
        first = String(
          a.name || ""
        ).toLowerCase();

        second = String(
          b.name || ""
        ).toLowerCase();
      }

      if (sortBy === "priority") {
        const priorityOrder = {
          High: 1,
          Medium: 2,
          Low: 3,
        };

        first =
          priorityOrder[a.priority] ||
          99;

        second =
          priorityOrder[b.priority] ||
          99;
      }

      if (first < second) {
        return sortDirection === "asc"
          ? -1
          : 1;
      }

      if (first > second) {
        return sortDirection === "asc"
          ? 1
          : -1;
      }

      return 0;
    });

    return result;
  }, [
    backlog,
    search,
    statusFilter,
    priorityFilter,
    sortBy,
    sortDirection,
  ]);

  /* =====================================================
     STATUS ICON
  ===================================================== */

  const getStatusIcon = (status) => {
    if (status === "Completed") {
      return (
        <CheckCircle2
          size={15}
          className="text-green-400"
        />
      );
    }

    if (status === "In Progress") {
      return (
        <LoaderCircle
          size={15}
          className="text-blue-400"
        />
      );
    }

    return (
      <Circle
        size={15}
        className="text-gray-500"
      />
    );
  };

  /* =====================================================
     STATUS STYLE
  ===================================================== */

  const getStatusStyle = (status) => {
    if (status === "Completed") {
      return "border-green-500/20 bg-green-500/10 text-green-400";
    }

    if (status === "In Progress") {
      return "border-blue-500/20 bg-blue-500/10 text-blue-400";
    }

    return "border-gray-700 bg-gray-800/60 text-gray-400";
  };

  /* =====================================================
     PRIORITY STYLE
  ===================================================== */

  const getPriorityStyle = (priority) => {
    if (priority === "High") {
      return "border-red-500/20 bg-red-500/10 text-red-400";
    }

    if (priority === "Medium") {
      return "border-yellow-500/20 bg-yellow-500/10 text-yellow-400";
    }

    return "border-green-500/20 bg-green-500/10 text-green-400";
  };

  /* =====================================================
     SORT TOGGLE
  ===================================================== */

  const handleSortChange = (event) => {
    const newSort = event.target.value;

    if (newSort === sortBy) {
      setSortDirection(
        sortDirection === "asc"
          ? "desc"
          : "asc"
      );
    } else {
      setSortBy(newSort);
      setSortDirection("asc");
    }
  };

  if (!open || !sprint) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[9999]
        flex
        items-center
        justify-center
        p-4
      "
    >
      {/* BACKDROP */}

      <div
        className="
          absolute
          inset-0
          bg-black/80
          backdrop-blur-sm
        "
        onClick={onClose}
      />

      {/* MODAL */}

      <div
        className="
          relative
          z-[10000]
          flex
          max-h-[92vh]
          w-full
          max-w-6xl
          flex-col
          overflow-hidden
          rounded-2xl
          border
          border-gray-800
          bg-[#0f172a]
          shadow-2xl
        "
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            flex
            shrink-0
            items-center
            justify-between
            border-b
            border-gray-800
            px-6
            py-5
          "
        >
          <div className="flex min-w-0 items-center gap-4">
            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-blue-500/10
                text-blue-400
              "
            >
              <ListTodo size={22} />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-xl font-bold text-white">
                {sprint.name} Backlog
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                {backlog.length}{" "}
                {backlog.length === 1
                  ? "task"
                  : "tasks"}{" "}
                in this sprint
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              text-gray-400
              transition
              hover:bg-gray-800
              hover:text-white
            "
          >
            <X size={20} />
          </button>
        </div>

        {/* =================================================
            FILTERS
        ================================================= */}

        <div
          className="
            shrink-0
            border-b
            border-gray-800
            bg-[#0b1220]
            px-6
            py-4
          "
        >
          <div
            className="
              grid
              grid-cols-1
              gap-3
              md:grid-cols-2
              lg:grid-cols-4
            "
          >
            {/* SEARCH */}

            <div className="relative">
              <Search
                size={17}
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-gray-500
                "
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
                className="
                  w-full
                  rounded-xl
                  border
                  border-gray-700
                  bg-[#020617]
                  py-2.5
                  pl-10
                  pr-4
                  text-sm
                  text-white
                  outline-none
                  placeholder:text-gray-600
                  focus:border-blue-500
                "
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
              className="
                rounded-xl
                border
                border-gray-700
                bg-[#020617]
                px-4
                py-2.5
                text-sm
                text-white
                outline-none
                focus:border-blue-500
              "
            >
              <option value="All">
                All Statuses
              </option>

              <option value="To Do">
                To Do
              </option>

              <option value="In Progress">
                In Progress
              </option>

              <option value="Completed">
                Completed
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
              className="
                rounded-xl
                border
                border-gray-700
                bg-[#020617]
                px-4
                py-2.5
                text-sm
                text-white
                outline-none
                focus:border-blue-500
              "
            >
              <option value="All">
                All Priorities
              </option>

              <option value="High">
                High
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="Low">
                Low
              </option>
            </select>

            {/* SORT */}

            <div className="relative">
              <ArrowUpDown
                size={16}
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-gray-500
                "
              />

              <select
                value={sortBy}
                onChange={
                  handleSortChange
                }
                className="
                  w-full
                  rounded-xl
                  border
                  border-gray-700
                  bg-[#020617]
                  py-2.5
                  pl-9
                  pr-4
                  text-sm
                  text-white
                  outline-none
                  focus:border-blue-500
                "
              >
                <option value="deadline">
                  Sort by Deadline
                </option>

                <option value="priority">
                  Sort by Priority
                </option>

                <option value="effort">
                  Sort by Effort
                </option>

                <option value="name">
                  Sort by Name
                </option>
              </select>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-300">
                {filteredTasks.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-300">
                {backlog.length}
              </span>{" "}
              tasks
            </p>

            {sortBy && (
              <span className="text-xs text-gray-500">
                {sortDirection === "asc"
                  ? "Ascending"
                  : "Descending"}
              </span>
            )}
          </div>
        </div>

        {/* =================================================
            TASK LIST
        ================================================= */}

        <div
          className="
            min-h-0
            flex-1
            overflow-y-auto
            p-6
          "
        >
          {filteredTasks.length === 0 ? (
            <div
              className="
                flex
                min-h-[300px]
                flex-col
                items-center
                justify-center
                rounded-2xl
                border
                border-dashed
                border-gray-700
                bg-[#020617]
                p-10
                text-center
              "
            >
              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-gray-800
                  text-gray-500
                "
              >
                <ListTodo size={26} />
              </div>

              <h3 className="mt-4 text-lg font-semibold text-white">
                No tasks available in this sprint backlog.
              </h3>

              <p className="mt-2 max-w-md text-sm text-gray-500">
                {backlog.length > 0
                  ? "Try changing your search or filters."
                  : "This sprint does not have any tasks assigned yet."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTasks.map(
                (task, index) => (
                  <div
                    key={
                      task.id ??
                      `${task.name}-${index}`
                    }
                    className="
                      rounded-2xl
                      border
                      border-gray-800
                      bg-[#020617]
                      p-5
                      transition
                      hover:border-gray-700
                      hover:bg-[#030b1a]
                    "
                  >
                    {/* TASK HEADER */}

                    <div
                      className="
                        flex
                        flex-col
                        gap-4
                        lg:flex-row
                        lg:items-start
                        lg:justify-between
                      "
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-bold text-white">
                            {task.name ||
                              "Untitled Task"}
                          </h3>

                          <span
                            className={`
                              inline-flex
                              items-center
                              gap-1.5
                              rounded-full
                              border
                              px-2.5
                              py-1
                              text-[11px]
                              font-semibold
                              ${getStatusStyle(
                                task.status
                              )}
                            `}
                          >
                            {getStatusIcon(
                              task.status
                            )}

                            {task.status ||
                              "To Do"}
                          </span>

                          <span
                            className={`
                              rounded-full
                              border
                              px-2.5
                              py-1
                              text-[11px]
                              font-semibold
                              ${getPriorityStyle(
                                task.priority
                              )}
                            `}
                          >
                            {task.priority ||
                              "Medium"}
                          </span>
                        </div>

                        {task.description && (
                          <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-400">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* TASK META */}

                    <div
                      className="
                        mt-5
                        grid
                        grid-cols-1
                        gap-3
                        sm:grid-cols-2
                        lg:grid-cols-4
                      "
                    >
                      <div
                        className="
                          flex
                          items-center
                          gap-3
                          rounded-xl
                          border
                          border-gray-800
                          bg-[#0f172a]
                          p-3
                        "
                      >
                        <div
                          className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-lg
                            bg-blue-500/10
                            text-blue-400
                          "
                        >
                          <User size={16} />
                        </div>

                        <div>
                          <p className="text-[11px] text-gray-500">
                            Contributor
                          </p>

                          <p className="text-sm font-semibold text-white">
                            {task.contributor ||
                              "Unassigned"}
                          </p>
                        </div>
                      </div>

                      <div
                        className="
                          flex
                          items-center
                          gap-3
                          rounded-xl
                          border
                          border-gray-800
                          bg-[#0f172a]
                          p-3
                        "
                      >
                        <div
                          className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-lg
                            bg-orange-500/10
                            text-orange-400
                          "
                        >
                          <CalendarDays size={16} />
                        </div>

                        <div>
                          <p className="text-[11px] text-gray-500">
                            Deadline
                          </p>

                          <p className="text-sm font-semibold text-white">
                            {task.deadline ||
                              "No deadline"}
                          </p>
                        </div>
                      </div>

                      <div
                        className="
                          flex
                          items-center
                          gap-3
                          rounded-xl
                          border
                          border-gray-800
                          bg-[#0f172a]
                          p-3
                        "
                      >
                        <div
                          className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-lg
                            bg-purple-500/10
                            text-purple-400
                          "
                        >
                          <Clock3 size={16} />
                        </div>

                        <div>
                          <p className="text-[11px] text-gray-500">
                            Effort
                          </p>

                          <p className="text-sm font-semibold text-white">
                            {task.effort ??
                              0}{" "}
                            points
                          </p>
                        </div>
                      </div>

                      <div
                        className="
                          flex
                          items-center
                          gap-3
                          rounded-xl
                          border
                          border-gray-800
                          bg-[#0f172a]
                          p-3
                        "
                      >
                        <div
                          className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-lg
                            bg-cyan-500/10
                            text-cyan-400
                          "
                        >
                          <BookOpen size={16} />
                        </div>

                        <div>
                          <p className="text-[11px] text-gray-500">
                            Task ID
                          </p>

                          <p className="text-sm font-semibold text-white">
                            #{task.id ?? "-"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* USER STORY */}

                    {task.userStory && (
                      <div
                        className="
                          mt-4
                          rounded-xl
                          border
                          border-blue-500/10
                          bg-blue-500/5
                          p-4
                        "
                      >
                        <div className="mb-2 flex items-center gap-2">
                          <BookOpen
                            size={15}
                            className="text-blue-400"
                          />

                          <span className="text-xs font-semibold uppercase tracking-wide text-blue-400">
                            User Story
                          </span>
                        </div>

                        <p className="text-sm leading-6 text-gray-300">
                          {task.userStory}
                        </p>
                      </div>
                    )}

                    {/* WARNING FOR IN PROGRESS */}

                    {task.status ===
                      "In Progress" && (
                      <div
                        className="
                          mt-4
                          flex
                          items-start
                          gap-3
                          rounded-xl
                          border
                          border-blue-500/10
                          bg-blue-500/5
                          p-3
                        "
                      >
                        <AlertCircle
                          size={17}
                          className="
                            mt-0.5
                            shrink-0
                            text-blue-400
                          "
                        />

                        <p className="text-xs leading-5 text-gray-400">
                          This task is currently
                          being worked on by{" "}
                          <span className="font-semibold text-gray-300">
                            {task.contributor ||
                              "the assigned contributor"}
                          </span>
                          .
                        </p>
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* =================================================
            FOOTER
        ================================================= */}

        <div
          className="
            flex
            shrink-0
            items-center
            justify-between
            border-t
            border-gray-800
            bg-[#0b1220]
            px-6
            py-4
          "
        >
          <div className="hidden items-center gap-2 sm:flex">
            <ListTodo
              size={16}
              className="text-gray-500"
            />

            <span className="text-xs text-gray-500">
              Sprint Backlog
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              ml-auto
              rounded-xl
              border
              border-gray-700
              bg-gray-800
              px-5
              py-2.5
              text-sm
              font-semibold
              text-gray-300
              transition
              hover:bg-gray-700
              hover:text-white
            "
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default SprintBacklogModal;