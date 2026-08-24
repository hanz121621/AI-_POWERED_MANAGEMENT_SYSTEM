import {
    Archive,
    ArchiveRestore,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Eye,
    FolderKanban,
    ListTodo,
    Pencil,
    Trash2,
    UsersRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";

// ============================================================
// PROJECT TABLE
//
// PROJ-001: View All Projects
// PROJ-002: Archive / Restore Projects
// PROJ-003: Create Project
// PROJ-004: Edit Project
// PROJ-005: Delete Project
//
// PROJECT OVERSIGHT INFORMATION:
// - Project name
// - Project description
// - Project manager
// - Assigned team
// - Team leader
// - Project status
// - Start date
// - Deadline
// - Progress percentage
// - Number of tasks
// - Number of sprints
// - Project creation date
// - Project completion information
// ============================================================

function ProjectTable({
    projects = [],
    onView,
    onEdit,
    onDelete,
    onArchive,
    onRestore,
}) {
    // ========================================================
    // STATUS BADGE STYLE
    // ========================================================

    const getStatusStyle = (status) => {
        switch (status) {
            case "Active":
                return `
                    border-emerald-500/30
                    bg-emerald-500/10
                    text-emerald-600
                    dark:text-emerald-400
                `;

            case "Planning":
                return `
                    border-blue-500/30
                    bg-blue-500/10
                    text-blue-600
                    dark:text-blue-400
                `;

            case "Completed":
                return `
                    border-violet-500/30
                    bg-violet-500/10
                    text-violet-600
                    dark:text-violet-400
                `;

            case "Archived":
                return `
                    border-slate-500/30
                    bg-slate-500/10
                    text-slate-600
                    dark:text-slate-400
                `;

            case "On Hold":
                return `
                    border-amber-500/30
                    bg-amber-500/10
                    text-amber-600
                    dark:text-amber-400
                `;

            default:
                return `
                    border-border
                    bg-muted
                    text-muted-foreground
                `;
        }
    };

    // ========================================================
    // SAFE DATE FORMATTER
    // ========================================================

    const formatDate = (date) => {
        if (!date) {
            return "Not set";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return date;
        }

        return parsedDate.toLocaleDateString();
    };

    // ========================================================
    // MAIN UI
    // ========================================================

    return (
        <div
            className="
                overflow-hidden
                rounded-2xl
                border
                border-border
                bg-card
                text-card-foreground
                shadow-sm
            "
        >
            <div className="overflow-x-auto">
                <table className="w-full min-w-[1700px]">

                    {/* ==================================================
                        TABLE HEADER
                    ================================================== */}

                    <thead
                        className="
                            border-b
                            border-border
                            bg-muted/40
                        "
                    >
                        <tr>

                            {/* PROJECT */}

                            <th
                                className="
                                    sticky
                                    left-0
                                    z-10
                                    min-w-[250px]
                                    bg-muted/40
                                    px-6
                                    py-4
                                    text-left
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wider
                                    text-muted-foreground
                                "
                            >
                                Project
                            </th>

                            {/* MANAGER */}

                            <th
                                className="
                                    min-w-[180px]
                                    px-6
                                    py-4
                                    text-left
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wider
                                    text-muted-foreground
                                "
                            >
                                Manager
                            </th>

                            {/* TEAM */}

                            <th
                                className="
                                    min-w-[170px]
                                    px-6
                                    py-4
                                    text-left
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wider
                                    text-muted-foreground
                                "
                            >
                                Assigned Team
                            </th>

                            {/* TEAM LEADER */}

                            <th
                                className="
                                    min-w-[180px]
                                    px-6
                                    py-4
                                    text-left
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wider
                                    text-muted-foreground
                                "
                            >
                                Team Leader
                            </th>

                            {/* STATUS */}

                            <th
                                className="
                                    min-w-[130px]
                                    px-6
                                    py-4
                                    text-left
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wider
                                    text-muted-foreground
                                "
                            >
                                Status
                            </th>

                            {/* START DATE */}

                            <th
                                className="
                                    min-w-[150px]
                                    px-6
                                    py-4
                                    text-left
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wider
                                    text-muted-foreground
                                "
                            >
                                Start Date
                            </th>

                            {/* DEADLINE */}

                            <th
                                className="
                                    min-w-[150px]
                                    px-6
                                    py-4
                                    text-left
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wider
                                    text-muted-foreground
                                "
                            >
                                Deadline
                            </th>

                            {/* PROGRESS */}

                            <th
                                className="
                                    min-w-[180px]
                                    px-6
                                    py-4
                                    text-left
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wider
                                    text-muted-foreground
                                "
                            >
                                Progress
                            </th>

                            {/* TASKS */}

                            <th
                                className="
                                    min-w-[120px]
                                    px-6
                                    py-4
                                    text-left
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wider
                                    text-muted-foreground
                                "
                            >
                                Tasks
                            </th>

                            {/* SPRINTS */}

                            <th
                                className="
                                    min-w-[120px]
                                    px-6
                                    py-4
                                    text-left
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wider
                                    text-muted-foreground
                                "
                            >
                                Sprints
                            </th>

                            {/* CREATED */}

                            <th
                                className="
                                    min-w-[160px]
                                    px-6
                                    py-4
                                    text-left
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wider
                                    text-muted-foreground
                                "
                            >
                                Created
                            </th>

                            {/* COMPLETION */}

                            <th
                                className="
                                    min-w-[190px]
                                    px-6
                                    py-4
                                    text-left
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wider
                                    text-muted-foreground
                                "
                            >
                                Completion
                            </th>

                            {/* ACTIONS */}

                            <th
                                className="
                                    sticky
                                    right-0
                                    z-10
                                    min-w-[420px]
                                    bg-muted/40
                                    px-6
                                    py-4
                                    text-right
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wider
                                    text-muted-foreground
                                "
                            >
                                Actions
                            </th>

                        </tr>
                    </thead>

                    {/* ==================================================
                        TABLE BODY
                    ================================================== */}

                    <tbody
                        className="
                            divide-y
                            divide-border
                        "
                    >

                        {projects.length > 0 ? (
                            projects.map((project) => {

                                // ==================================================
                                // SAFE PROJECT VALUES
                                // ==================================================

                                const sprintCount = Number(
                                    project.sprintCount ??
                                    project.sprints?.length ??
                                    0
                                );

                                const taskCount = Number(
                                    project.tasks ??
                                    project.taskCount ??
                                    0
                                );

                                const activeTaskCount = Number(
                                    project.activeTasks ??
                                    project.activeTaskCount ??
                                    0
                                );

                                const progress = Math.min(
                                    Math.max(
                                        Number(
                                            project.progress ?? 0
                                        ),
                                        0
                                    ),
                                    100
                                );

                                const teamLeader =
                                    project.teamLeader ||
                                    project.teamlead ||
                                    project.teamLead ||
                                    "Not assigned";

                                const createdAt =
                                    project.createdAt ||
                                    project.creationDate ||
                                    project.createdDate;

                                const completedAt =
                                    project.completedAt ||
                                    project.completionDate ||
                                    project.completedDate;

                                return (
                                    <tr
                                        key={project.id}
                                        className="
                                            group
                                            transition-colors
                                            hover:bg-muted/40
                                        "
                                    >

                                        {/* ==================================================
                                            PROJECT
                                        ================================================== */}

                                        <td
                                            className="
                                                sticky
                                                left-0
                                                z-[1]
                                                bg-card
                                                px-6
                                                py-5
                                                group-hover:bg-muted/40
                                            "
                                        >
                                            <div className="max-w-[250px]">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onView?.(
                                                            project
                                                        )
                                                    }
                                                    className="
                                                        flex
                                                        items-center
                                                        gap-2
                                                        text-left
                                                        font-semibold
                                                        text-foreground
                                                        transition-all
                                                        hover:text-cyan-600
                                                        dark:hover:text-cyan-400
                                                    "
                                                >
                                                    <FolderKanban
                                                        size={17}
                                                        className="
                                                            shrink-0
                                                            text-cyan-500
                                                        "
                                                    />

                                                    <span className="truncate">
                                                        {project.name ||
                                                            "Unnamed Project"}
                                                    </span>
                                                </button>

                                                <p
                                                    className="
                                                        mt-1
                                                        line-clamp-2
                                                        text-xs
                                                        leading-5
                                                        text-muted-foreground
                                                    "
                                                >
                                                    {project.description ||
                                                        "No description"}
                                                </p>

                                            </div>
                                        </td>

                                        {/* ==================================================
                                            MANAGER
                                        ================================================== */}

                                        <td className="px-6 py-5">
                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    gap-2
                                                "
                                            >
                                                <UsersRound
                                                    size={16}
                                                    className="
                                                        shrink-0
                                                        text-cyan-500
                                                    "
                                                />

                                                <span
                                                    className="
                                                        text-sm
                                                        font-medium
                                                        text-foreground
                                                    "
                                                >
                                                    {project.manager ||
                                                        "Not assigned"}
                                                </span>
                                            </div>
                                        </td>

                                        {/* ==================================================
                                            TEAM
                                        ================================================== */}

                                        <td className="px-6 py-5">
                                            <span
                                                className="
                                                    text-sm
                                                    font-medium
                                                    text-foreground
                                                "
                                            >
                                                {project.team ||
                                                    "No team"}
                                            </span>
                                        </td>

                                        {/* ==================================================
                                            TEAM LEADER
                                        ================================================== */}

                                        <td className="px-6 py-5">
                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    gap-2
                                                "
                                            >
                                                <UsersRound
                                                    size={15}
                                                    className="
                                                        shrink-0
                                                        text-blue-500
                                                    "
                                                />

                                                <span
                                                    className="
                                                        text-sm
                                                        text-foreground
                                                    "
                                                >
                                                    {teamLeader}
                                                </span>
                                            </div>
                                        </td>

                                        {/* ==================================================
                                            STATUS
                                        ================================================== */}

                                        <td className="px-6 py-5">
                                            <span
                                                className={`
                                                    inline-flex
                                                    items-center
                                                    rounded-full
                                                    border
                                                    px-3
                                                    py-1.5
                                                    text-xs
                                                    font-semibold
                                                    ${getStatusStyle(
                                                        project.status
                                                    )}
                                                `}
                                            >
                                                {project.status ||
                                                    "Planning"}
                                            </span>
                                        </td>

                                        {/* ==================================================
                                            START DATE
                                        ================================================== */}

                                        <td className="px-6 py-5">
                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    gap-2
                                                    text-sm
                                                    text-muted-foreground
                                                "
                                            >
                                                <Clock3
                                                    size={15}
                                                    className="text-cyan-500"
                                                />

                                                {formatDate(
                                                    project.startDate
                                                )}
                                            </div>
                                        </td>

                                        {/* ==================================================
                                            DEADLINE
                                        ================================================== */}

                                        <td className="px-6 py-5">
                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    gap-2
                                                    text-sm
                                                    text-muted-foreground
                                                "
                                            >
                                                <CalendarDays
                                                    size={15}
                                                    className="text-amber-500"
                                                />

                                                {formatDate(
                                                    project.deadline
                                                )}
                                            </div>
                                        </td>

                                        {/* ==================================================
                                            PROGRESS
                                        ================================================== */}

                                        <td className="px-6 py-5">
                                            <div className="w-[150px]">

                                                <div
                                                    className="
                                                        mb-2
                                                        flex
                                                        items-center
                                                        justify-between
                                                    "
                                                >
                                                    <div
                                                        className="
                                                            flex
                                                            items-center
                                                            gap-1.5
                                                        "
                                                    >
                                                        <CheckCircle2
                                                            size={14}
                                                            className="text-cyan-500"
                                                        />

                                                        <span
                                                            className="
                                                                text-xs
                                                                font-semibold
                                                                text-foreground
                                                            "
                                                        >
                                                            Progress
                                                        </span>
                                                    </div>

                                                    <span
                                                        className="
                                                            text-xs
                                                            font-bold
                                                            text-cyan-600
                                                            dark:text-cyan-400
                                                        "
                                                    >
                                                        {progress}%
                                                    </span>
                                                </div>

                                                <div
                                                    className="
                                                        h-2.5
                                                        overflow-hidden
                                                        rounded-full
                                                        bg-muted
                                                    "
                                                >
                                                    <div
                                                        className="
                                                            h-full
                                                            rounded-full
                                                            bg-cyan-500
                                                            transition-all
                                                            duration-500
                                                        "
                                                        style={{
                                                            width: `${progress}%`,
                                                        }}
                                                    />
                                                </div>

                                            </div>
                                        </td>

                                        {/* ==================================================
                                            TASKS
                                        ================================================== */}

                                        <td className="px-6 py-5">
                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    gap-2
                                                "
                                            >
                                                <ListTodo
                                                    size={16}
                                                    className="text-blue-500"
                                                />

                                                <div>
                                                    <p
                                                        className="
                                                            text-sm
                                                            font-semibold
                                                            text-foreground
                                                        "
                                                    >
                                                        {taskCount}
                                                    </p>

                                                    <p
                                                        className="
                                                            text-[11px]
                                                            text-muted-foreground
                                                        "
                                                    >
                                                        {activeTaskCount} active
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* ==================================================
                                            SPRINTS
                                        ================================================== */}

                                        <td className="px-6 py-5">
                                            <span
                                                className="
                                                    inline-flex
                                                    min-w-9
                                                    items-center
                                                    justify-center
                                                    rounded-lg
                                                    bg-primary/10
                                                    px-2.5
                                                    py-1.5
                                                    text-sm
                                                    font-bold
                                                    text-primary
                                                "
                                            >
                                                {sprintCount}
                                            </span>
                                        </td>

                                        {/* ==================================================
                                            CREATION DATE
                                        ================================================== */}

                                        <td className="px-6 py-5">
                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    gap-2
                                                    text-sm
                                                    text-muted-foreground
                                                "
                                            >
                                                <CalendarDays
                                                    size={15}
                                                    className="text-blue-500"
                                                />

                                                {formatDate(
                                                    createdAt
                                                )}
                                            </div>
                                        </td>

                                        {/* ==================================================
                                            COMPLETION INFORMATION
                                        ================================================== */}

                                        <td className="px-6 py-5">
                                            {project.status ===
                                                "Completed" ? (
                                                <div>
                                                    <div
                                                        className="
                                                            flex
                                                            items-center
                                                            gap-2
                                                            text-sm
                                                            font-medium
                                                            text-emerald-600
                                                            dark:text-emerald-400
                                                        "
                                                    >
                                                        <CheckCircle2
                                                            size={15}
                                                        />

                                                        Completed
                                                    </div>

                                                    {completedAt && (
                                                        <p
                                                            className="
                                                                mt-1
                                                                text-xs
                                                                text-muted-foreground
                                                            "
                                                        >
                                                            {formatDate(
                                                                completedAt
                                                            )}
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                <span
                                                    className="
                                                        text-sm
                                                        text-muted-foreground
                                                    "
                                                >
                                                    Not completed
                                                </span>
                                            )}
                                        </td>

                                        {/* ==================================================
                                            ACTIONS
                                        ================================================== */}

                                        <td
                                            className="
                                                sticky
                                                right-0
                                                z-[1]
                                                bg-card
                                                px-6
                                                py-5
                                                group-hover:bg-muted/40
                                            "
                                        >
                                            <div
                                                className="
                                                    flex
                                                    justify-end
                                                    gap-2
                                                "
                                            >

                                                {/* VIEW */}

                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        onView?.(
                                                            project
                                                        )
                                                    }
                                                    className="
                                                        gap-2
                                                        border-border
                                                        bg-background
                                                        text-foreground
                                                        transition-all
                                                        duration-300
                                                        hover:-translate-y-0.5
                                                        hover:border-cyan-400
                                                        hover:bg-cyan-500/10
                                                        hover:text-cyan-600
                                                        hover:shadow-md
                                                        dark:hover:text-cyan-400
                                                    "
                                                >
                                                    <Eye
                                                        size={15}
                                                    />

                                                    View
                                                </Button>

                                                {/* EDIT */}

                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        onEdit?.(
                                                            project
                                                        )
                                                    }
                                                    className="
                                                        gap-2
                                                        border-border
                                                        bg-background
                                                        text-foreground
                                                        transition-all
                                                        duration-300
                                                        hover:-translate-y-0.5
                                                        hover:border-blue-400
                                                        hover:bg-blue-500/10
                                                        hover:text-blue-600
                                                        hover:shadow-md
                                                        dark:hover:text-blue-400
                                                    "
                                                >
                                                    <Pencil
                                                        size={15}
                                                    />

                                                    Edit
                                                </Button>

                                                {/* DELETE */}

                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        onDelete?.(
                                                            project
                                                        )
                                                    }
                                                    className="
                                                        gap-2
                                                        border-red-500/40
                                                        bg-background
                                                        text-red-600
                                                        transition-all
                                                        duration-300
                                                        hover:-translate-y-0.5
                                                        hover:border-red-500
                                                        hover:bg-red-500/10
                                                        hover:text-red-600
                                                        hover:shadow-md
                                                        dark:text-red-400
                                                        dark:hover:text-red-300
                                                    "
                                                >
                                                    <Trash2
                                                        size={15}
                                                    />

                                                    Delete
                                                </Button>

                                                {/* ARCHIVE */}

                                                {project.status !==
                                                    "Archived" && (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            onArchive?.(
                                                                project
                                                            )
                                                        }
                                                        className="
                                                            gap-2
                                                            border-border
                                                            bg-background
                                                            text-foreground
                                                            transition-all
                                                            duration-300
                                                            hover:-translate-y-0.5
                                                            hover:border-amber-400
                                                            hover:bg-amber-500/10
                                                            hover:text-amber-600
                                                            hover:shadow-md
                                                            dark:hover:text-amber-400
                                                        "
                                                    >
                                                        <Archive
                                                            size={15}
                                                        />

                                                        Archive
                                                    </Button>
                                                )}

                                                {/* RESTORE */}

                                                {project.status ===
                                                    "Archived" && (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            onRestore?.(
                                                                project
                                                            )
                                                        }
                                                        className="
                                                            gap-2
                                                            border-border
                                                            bg-background
                                                            text-foreground
                                                            transition-all
                                                            duration-300
                                                            hover:-translate-y-0.5
                                                            hover:border-cyan-400
                                                            hover:bg-cyan-500/10
                                                            hover:text-cyan-600
                                                            hover:shadow-md
                                                            dark:hover:text-cyan-400
                                                        "
                                                    >
                                                        <ArchiveRestore
                                                            size={15}
                                                        />

                                                        Restore
                                                    </Button>
                                                )}

                                            </div>
                                        </td>

                                    </tr>
                                );
                            })
                        ) : (

                            /* ==================================================
                                EMPTY STATE
                            ================================================== */

                            <tr>
                                <td
                                    colSpan="14"
                                    className="
                                        px-6
                                        py-16
                                        text-center
                                    "
                                >
                                    <FolderKanban
                                        size={44}
                                        className="
                                            mx-auto
                                            text-muted-foreground
                                        "
                                    />

                                    <h3
                                        className="
                                            mt-4
                                            font-semibold
                                            text-foreground
                                        "
                                    >
                                        No projects found
                                    </h3>

                                    <p
                                        className="
                                            mt-1
                                            text-sm
                                            text-muted-foreground
                                        "
                                    >
                                        Try changing your
                                        search or status
                                        filter.
                                    </p>
                                </td>
                            </tr>
                        )}

                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ProjectTable;