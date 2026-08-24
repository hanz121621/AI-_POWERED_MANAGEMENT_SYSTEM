
import {
    CalendarDays,
    Clock3,
    UsersRound,
    UserRound,
    FolderKanban,
    ListChecks,
    Layers3,
    CheckCircle2,
    CircleDot,
} from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

// ============================================================
// PROJECT DETAILS DIALOG
//
// PROJ-001: View Project Details
//
// Displays:
// - Project Name
// - Description
// - Project Manager
// - Team Leader
// - Assigned Team
// - Project Status
// - Number of Sprints
// - Total Tasks
// - Active Tasks
// - Progress
// - Project Creation Date
// - Start Date
// - Deadline
// - Completion Information when applicable
// ============================================================

function ProjectDetailsDialog({
    open,
    project,
    onClose,
}) {
    // ========================================================
    // FORMAT DATE
    // ========================================================

    const formatDate = (dateValue) => {
        if (
            !dateValue ||
            dateValue === "Not available"
        ) {
            return "Not available";
        }

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return String(dateValue);
        }

        return date.toLocaleDateString(
            "en-US",
            {
                year: "numeric",
                month: "long",
                day: "numeric",
            }
        );
    };

    // ========================================================
    // SAFE VALUE HELPER
    // ========================================================

    const getValue = (...values) => {
        for (const value of values) {
            if (
                value !== undefined &&
                value !== null &&
                String(value).trim() !== ""
            ) {
                return value;
            }
        }

        return "Not available";
    };

    // ========================================================
    // PROJECT INFORMATION
    // ========================================================

    const projectName = getValue(
        project?.name,
        project?.projectName
    );

    const description = getValue(
        project?.description
    );

    const manager = getValue(
        project?.manager,
        project?.projectManager,
        project?.managerName
    );

    const teamLeader = getValue(
        project?.teamLeader,
        project?.teamleader,
        project?.team_leader,
        project?.leader,
        project?.teamLeaderName
    );

    const team = getValue(
        project?.team,
        project?.teamName,
        project?.assignedTeam
    );

    const status = getValue(
        project?.status,
        project?.projectStatus
    );

    // ========================================================
    // PROGRESS
    // ========================================================

    const progressValue = Number(
        project?.progress ?? 0
    );

    const progress = Number.isFinite(
        progressValue
    )
        ? Math.min(
              Math.max(
                  progressValue,
                  0
              ),
              100
          )
        : 0;

    // ========================================================
    // TASK INFORMATION
    // ========================================================

    const totalTasks = getValue(
        project?.tasks,
        project?.totalTasks,
        project?.taskCount
    );

    const activeTasks = getValue(
        project?.activeTasks,
        project?.activeTaskCount
    );

    // ========================================================
    // SPRINT COUNT
    //
    // This does NOT use:
    // let sprintCount = 0;
    //
    // It safely handles:
    // project.sprints as an array
    // project.sprintCount
    // project.numberOfSprints
    // project.totalSprints
    // ========================================================

    const sprintCount = Array.isArray(
        project?.sprints
    )
        ? project.sprints.length
        : Number(
              project?.sprintCount ??
                  project?.numberOfSprints ??
                  project?.totalSprints ??
                  0
          );

    // ========================================================
    // DATE INFORMATION
    // ========================================================

    const creationDate = getValue(
        project?.createdAt,
        project?.creationDate,
        project?.createdDate,
        project?.projectCreationDate
    );

    const startDate = getValue(
        project?.startDate,
        project?.start_date
    );

    const deadline = getValue(
        project?.deadline,
        project?.endDate,
        project?.completionDeadline
    );

    // ========================================================
    // COMPLETION INFORMATION
    // ========================================================

    const completionDate =
        project?.completedAt ??
        project?.completionDate ??
        project?.completedDate ??
        null;

    const completionNote =
        project?.completionNote ??
        project?.completionNotes ??
        project?.completionDescription ??
        project?.completionInformation ??
        "";

    const normalizedStatus =
        String(status).toLowerCase();

    const isCompleted =
        normalizedStatus ===
            "completed" ||
        normalizedStatus ===
            "complete" ||
        progress >= 100;

    // ========================================================
    // STATUS STYLE
    // ========================================================

    const getStatusClasses = () => {
        if (
            normalizedStatus ===
                "completed" ||
            normalizedStatus ===
                "complete"
        ) {
            return `
                border-green-500/30
                bg-green-500/10
                text-green-600
                dark:text-green-400
            `;
        }

        if (
            normalizedStatus ===
                "in progress" ||
            normalizedStatus ===
                "active"
        ) {
            return `
                border-blue-500/30
                bg-blue-500/10
                text-blue-600
                dark:text-blue-400
            `;
        }

        if (
            normalizedStatus ===
            "planning"
        ) {
            return `
                border-amber-500/30
                bg-amber-500/10
                text-amber-600
                dark:text-amber-400
            `;
        }

        if (
            normalizedStatus ===
            "on hold"
        ) {
            return `
                border-orange-500/30
                bg-orange-500/10
                text-orange-600
                dark:text-orange-400
            `;
        }

        return `
            border-slate-500/30
            bg-slate-500/10
            text-slate-600
            dark:text-slate-400
        `;
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                if (!isOpen) {
                    onClose?.();
                }
            }}
        >
            <DialogContent
                className="
                    max-h-[90vh]
                    overflow-y-auto
                    sm:max-w-2xl
                "
            >

                {/* ==================================================
                    HEADER
                ================================================== */}

                <DialogHeader>

                    <div
                        className="
                            flex
                            items-start
                            gap-3
                        "
                    >

                        <div
                            className="
                                flex
                                h-11
                                w-11
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-primary/10
                                text-primary
                            "
                        >
                            <FolderKanban
                                size={22}
                            />
                        </div>

                        <div
                            className="
                                min-w-0
                            "
                        >

                            <DialogTitle
                                className="
                                    text-xl
                                "
                            >
                                {projectName}
                            </DialogTitle>

                            <DialogDescription>
                                Complete project
                                overview and
                                current status.
                            </DialogDescription>

                        </div>

                    </div>

                </DialogHeader>

                {/* ==================================================
                    PROJECT INFORMATION
                ================================================== */}

                {project ? (
                    <div
                        className="
                            space-y-6
                        "
                    >

                        {/* ==================================================
                            BASIC PROJECT INFORMATION
                        ================================================== */}

                        <div
                            className="
                                rounded-xl
                                border
                                border-border
                                bg-muted/20
                                p-4
                            "
                        >

                            <div
                                className="
                                    mb-4
                                    flex
                                    items-center
                                    gap-2
                                "
                            >

                                <FolderKanban
                                    size={17}
                                    className="
                                        text-primary
                                    "
                                />

                                <h3
                                    className="
                                        text-sm
                                        font-semibold
                                    "
                                >
                                    Project Information
                                </h3>

                            </div>

                            <div
                                className="
                                    grid
                                    grid-cols-1
                                    gap-5
                                    md:grid-cols-2
                                "
                            >

                                {/* PROJECT NAME */}

                                <InfoItem
                                    icon={
                                        <FolderKanban
                                            size={15}
                                        />
                                    }
                                    label="Project Name"
                                    value={
                                        projectName
                                    }
                                />

                                {/* PROJECT MANAGER */}

                                <InfoItem
                                    icon={
                                        <UserRound
                                            size={15}
                                        />
                                    }
                                    label="Project Manager"
                                    value={
                                        manager
                                    }
                                />

                                {/* TEAM LEADER */}

                                <InfoItem
                                    icon={
                                        <UsersRound
                                            size={15}
                                        />
                                    }
                                    label="Team Leader"
                                    value={
                                        teamLeader
                                    }
                                />

                                {/* ASSIGNED TEAM */}

                                <InfoItem
                                    icon={
                                        <UsersRound
                                            size={15}
                                        />
                                    }
                                    label="Assigned Team"
                                    value={
                                        team
                                    }
                                />

                                {/* STATUS */}

                                <div>

                                    <p
                                        className="
                                            text-xs
                                            text-muted-foreground
                                        "
                                    >
                                        Project Status
                                    </p>

                                    <div
                                        className="
                                            mt-1.5
                                        "
                                    >

                                        <span
                                            className={`
                                                inline-flex
                                                items-center
                                                gap-1.5
                                                rounded-full
                                                border
                                                px-3
                                                py-1
                                                text-xs
                                                font-semibold
                                                ${getStatusClasses()}
                                            `}
                                        >

                                            <CircleDot
                                                size={13}
                                            />

                                            {status}

                                        </span>

                                    </div>

                                </div>

                                {/* CREATION DATE */}

                                <InfoItem
                                    icon={
                                        <CalendarDays
                                            size={15}
                                        />
                                    }
                                    label="Project Creation Date"
                                    value={
                                        formatDate(
                                            creationDate
                                        )
                                    }
                                />

                            </div>

                        </div>

                        {/* ==================================================
                            DESCRIPTION
                        ================================================== */}

                        <div>

                            <p
                                className="
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-muted-foreground
                                "
                            >
                                Description
                            </p>

                            <div
                                className="
                                    mt-2
                                    rounded-xl
                                    border
                                    border-border
                                    bg-background
                                    p-4
                                "
                            >

                                <p
                                    className="
                                        text-sm
                                        leading-6
                                        text-foreground
                                    "
                                >
                                    {description}
                                </p>

                            </div>

                        </div>

                        {/* ==================================================
                            PROJECT METRICS
                        ================================================== */}

                        <div>

                            <div
                                className="
                                    mb-3
                                    flex
                                    items-center
                                    gap-2
                                "
                            >

                                <ListChecks
                                    size={17}
                                    className="
                                        text-primary
                                    "
                                />

                                <h3
                                    className="
                                        text-sm
                                        font-semibold
                                    "
                                >
                                    Project Metrics
                                </h3>

                            </div>

                            <div
                                className="
                                    grid
                                    grid-cols-2
                                    gap-3
                                    md:grid-cols-4
                                "
                            >

                                {/* SPRINTS */}

                                <MetricCard
                                    icon={
                                        <Layers3
                                            size={18}
                                        />
                                    }
                                    label="Number of Sprints"
                                    value={
                                        sprintCount
                                    }
                                />

                                {/* TOTAL TASKS */}

                                <MetricCard
                                    icon={
                                        <ListChecks
                                            size={18}
                                        />
                                    }
                                    label="Total Tasks"
                                    value={
                                        totalTasks
                                    }
                                />

                                {/* ACTIVE TASKS */}

                                <MetricCard
                                    icon={
                                        <CircleDot
                                            size={18}
                                        />
                                    }
                                    label="Active Tasks"
                                    value={
                                        activeTasks
                                    }
                                />

                                {/* PROGRESS */}

                                <MetricCard
                                    icon={
                                        <CheckCircle2
                                            size={18}
                                        />
                                    }
                                    label="Progress"
                                    value={`${progress}%`}
                                />

                            </div>

                        </div>

                        {/* ==================================================
                            PROJECT TIMELINE
                        ================================================== */}

                        <div>

                            <div
                                className="
                                    mb-3
                                    flex
                                    items-center
                                    gap-2
                                "
                            >

                                <CalendarDays
                                    size={17}
                                    className="
                                        text-primary
                                    "
                                />

                                <h3
                                    className="
                                        text-sm
                                        font-semibold
                                    "
                                >
                                    Project Timeline
                                </h3>

                            </div>

                            <div
                                className="
                                    grid
                                    grid-cols-1
                                    gap-4
                                    md:grid-cols-3
                                "
                            >

                                {/* CREATED */}

                                <InfoItem
                                    icon={
                                        <CalendarDays
                                            size={15}
                                        />
                                    }
                                    label="Creation Date"
                                    value={
                                        formatDate(
                                            creationDate
                                        )
                                    }
                                />

                                {/* START DATE */}

                                <InfoItem
                                    icon={
                                        <Clock3
                                            size={15}
                                        />
                                    }
                                    label="Start Date"
                                    value={
                                        formatDate(
                                            startDate
                                        )
                                    }
                                />

                                {/* DEADLINE */}

                                <InfoItem
                                    icon={
                                        <CalendarDays
                                            size={15}
                                        />
                                    }
                                    label="Deadline"
                                    value={
                                        formatDate(
                                            deadline
                                        )
                                    }
                                />

                            </div>

                        </div>

                        {/* ==================================================
                            PROGRESS
                        ================================================== */}

                        <div
                            className="
                                rounded-xl
                                border
                                border-border
                                bg-muted/20
                                p-4
                            "
                        >

                            <div
                                className="
                                    mb-2
                                    flex
                                    items-center
                                    justify-between
                                "
                            >

                                <span
                                    className="
                                        text-xs
                                        font-semibold
                                        text-muted-foreground
                                    "
                                >
                                    Project Progress
                                </span>

                                <span
                                    className="
                                        text-sm
                                        font-bold
                                        text-primary
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
                                        bg-primary
                                        transition-all
                                        duration-500
                                    "
                                    style={{
                                        width:
                                            `${progress}%`,
                                    }}
                                />

                            </div>

                        </div>

                        {/* ==================================================
                            PROJECT COMPLETION INFORMATION
                        ================================================== */}

                        {isCompleted && (
                            <div
                                className="
                                    rounded-xl
                                    border
                                    border-green-500/30
                                    bg-green-500/10
                                    p-4
                                "
                            >

                                <div
                                    className="
                                        mb-4
                                        flex
                                        items-center
                                        gap-2
                                    "
                                >

                                    <CheckCircle2
                                        size={19}
                                        className="
                                            text-green-600
                                            dark:text-green-400
                                        "
                                    />

                                    <h3
                                        className="
                                            text-sm
                                            font-semibold
                                            text-green-700
                                            dark:text-green-400
                                        "
                                    >
                                        Project Completion
                                    </h3>

                                </div>

                                <div
                                    className="
                                        grid
                                        grid-cols-1
                                        gap-4
                                        md:grid-cols-2
                                    "
                                >

                                    {/* COMPLETION DATE */}

                                    <InfoItem
                                        icon={
                                            <CalendarDays
                                                size={15}
                                            />
                                        }
                                        label="Completion Date"
                                        value={
                                            completionDate
                                                ? formatDate(
                                                      completionDate
                                                  )
                                                : "Not recorded"
                                        }
                                    />

                                    {/* FINAL PROGRESS */}

                                    <InfoItem
                                        icon={
                                            <CheckCircle2
                                                size={15}
                                            />
                                        }
                                        label="Final Progress"
                                        value={`${progress}%`}
                                    />

                                </div>

                                {/* COMPLETION INFORMATION */}

                                {completionNote && (
                                    <div
                                        className="
                                            mt-4
                                        "
                                    >

                                        <p
                                            className="
                                                text-xs
                                                text-muted-foreground
                                            "
                                        >
                                            Completion Information
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                text-sm
                                                leading-6
                                            "
                                        >
                                            {
                                                completionNote
                                            }
                                        </p>

                                    </div>
                                )}

                            </div>
                        )}

                    </div>
                ) : (
                    <div
                        className="
                            rounded-xl
                            border
                            border-border
                            bg-muted/20
                            p-6
                            text-center
                            text-sm
                            text-muted-foreground
                        "
                    >
                        No project information
                        available.
                    </div>
                )}

                {/* ==================================================
                    FOOTER
                ================================================== */}

                <DialogFooter>

                    <Button
                        type="button"
                        onClick={onClose}
                    >
                        Close
                    </Button>

                </DialogFooter>

            </DialogContent>
        </Dialog>
    );
}

// ============================================================
// INFO ITEM
// ============================================================

function InfoItem({
    icon,
    label,
    value,
}) {
    return (
        <div>

            <p
                className="
                    flex
                    items-center
                    gap-1.5
                    text-xs
                    text-muted-foreground
                "
            >
                {icon}

                {label}
            </p>

            <p
                className="
                    mt-1.5
                    text-sm
                    font-semibold
                    text-foreground
                "
            >
                {value}
            </p>

        </div>
    );
}

// ============================================================
// METRIC CARD
// ============================================================

function MetricCard({
    icon,
    label,
    value,
}) {
    return (
        <div
            className="
                rounded-xl
                border
                border-border
                bg-background
                p-4
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:border-primary/40
                hover:shadow-md
            "
        >

            <div
                className="
                    flex
                    items-center
                    justify-between
                "
            >

                <span
                    className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-lg
                        bg-primary/10
                        text-primary
                    "
                >
                    {icon}
                </span>

            </div>

            <p
                className="
                    mt-3
                    text-xl
                    font-bold
                "
            >
                {value}
            </p>

            <p
                className="
                    mt-0.5
                    text-xs
                    text-muted-foreground
                "
            >
                {label}
            </p>

        </div>
    );
}

export default ProjectDetailsDialog;
