
import { useEffect, useMemo, useState } from "react";

import {
    CalendarDays,
    FolderKanban,
    UsersRound,
    UserRound,
    X,
} from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    getAllUsers,
} from "@/services/userService";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
function CreateProjectModal({
    open,
    onClose,
    onSave,
    existingProjects = [],
    teams = [],
    managers = [],
}) {
    // ========================================================
    // INITIAL FORM DATA
    // ========================================================

   const initialFormData = {
    name: "",
    description: "",
    managerId: "", // 🌟 ADD THIS LINE
    team: "",
    teamId: "",
    teamLeader: "",
    teamLeaderId: "",
    startDate: "",
    deadline: "",
};

    // ========================================================
    // FORM DATA
    // ========================================================

    const [formData, setFormData] =
        useState(initialFormData);

  // ========================================================
// ERROR
// ========================================================

const [error, setError] = useState("");

// ========================================================
// USERS FROM DATABASE
// ========================================================

const [users, setUsers] = useState([]);

const [loadingUsers, setLoadingUsers] =
    useState(false);

const selectedTeam = useMemo(() => {
    if (!formData.team) {
        return null;
    }

    return teams.find(
        (team) =>
            team?.name === formData.team
    ) || null;
}, [teams, formData.team]);

// ========================================================
// FILTER TEAM LEADERS FROM DATABASE USERS
// ========================================================

const teamLeaders = useMemo(() => {
    return users.filter((user) => {
        const contributorType =
            String(
                user?.contributorType ||
                ""
            )
                .trim()
                .toLowerCase();

        return (
            user?.isActive !== false &&
            contributorType === "team leader"
        );
    });
}, [users]);
// ========================================================
// LOAD USERS FROM DATABASE
// ========================================================

useEffect(() => {
    if (!open) {
        return;
    }

    const loadUsers = async () => {
        try {
            setLoadingUsers(true);

            const result =
                await getAllUsers();

            console.log(
                "PROJECT MODAL USERS:",
                result
            );

            setUsers(
                Array.isArray(result)
                    ? result
                    : []
            );
        } catch (error) {
            console.error(
                "LOAD USERS ERROR:",
                error
            );

            setUsers([]);
        } finally {
            setLoadingUsers(false);
        }
    };

    loadUsers();
}, [open]);
    // ========================================================
    // HANDLE INPUT CHANGE
    // ========================================================

    const handleChange = (event) => {
        const {
            name,
            value,
        } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));

        setError("");
    };

    // ========================================================
    // VALIDATE FORM
    // ========================================================

    const validateForm = () => {
        const name =
            formData.name.trim();

        const description =
            formData.description.trim();

        const startDate =
            formData.startDate;

        const deadline =
            formData.deadline;

        // ----------------------------------------------------
        // REQUIRED FIELDS
        // ----------------------------------------------------

        if (
            !name ||
            !description ||
            !startDate ||
            !deadline
        ) {
            setError(
                "Please complete all required fields."
            );

            return false;
        }

        // ----------------------------------------------------
        // CHECK DUPLICATE PROJECT NAME
        // ----------------------------------------------------

        const projectExists =
            Array.isArray(existingProjects) &&
            existingProjects.some(
                (project) =>
                    String(
                        project?.name || ""
                    )
                        .trim()
                        .toLowerCase() ===
                    name.toLowerCase()
            );

        if (projectExists) {
            setError(
                "Project already exists."
            );

            return false;
        }

        // ----------------------------------------------------
        // DATE VALIDATION
        // ----------------------------------------------------

        if (
            startDate &&
            deadline &&
            deadline < startDate
        ) {
            setError(
                "Deadline cannot be earlier than the start date."
            );

            return false;
        }

        return true;
    };

    // ========================================================
    // SAVE PROJECT
    // ========================================================

    const handleSubmit = (event) => {
        event.preventDefault();

        setError("");

        // ----------------------------------------------------
        // VALIDATE FORM
        // ----------------------------------------------------

        if (!validateForm()) {
            return;
        }

        // ----------------------------------------------------
        // PROJECT CREATION DATE
        //
        // This is automatically generated when the project
        // is created.
        // ----------------------------------------------------

        const createdAt =
            new Date().toISOString();

        // ----------------------------------------------------
        // CREATE PROJECT OBJECT
        // ----------------------------------------------------

        const newProject = {
            // =================================================
            // BASIC PROJECT INFORMATION
            // =================================================

            id: Date.now(),

            name:
                formData.name.trim(),

            description:
                formData.description.trim(),
                managerId: formData.managerId || null,

            // =================================================
            // TEAM INFORMATION
            // =================================================

          team:
    formData.team.trim(),

teamId:
    formData.teamId || null,

teamLeader:
    formData.teamLeader.trim(),

teamLeaderId:
    formData.teamLeaderId || null,

            // =================================================
            // PROJECT DATES
            // =================================================

            startDate:
                formData.startDate,

            deadline:
                formData.deadline,

            createdAt:
                createdAt,

            // =================================================
            // PROJECT STATUS
            // =================================================

            status:
                "Planning",

            // =================================================
            // SPRINT INFORMATION
            //
            // New projects start with zero sprints.
            // This can be updated later when sprints are created.
            // =================================================

            sprintCount:
                0,

            // =================================================
            // PROJECT PROGRESS
            // =================================================

            progress:
                0,

            // =================================================
            // TASK INFORMATION
            // =================================================

            tasks:
                0,

            activeTasks:
                0,

            // =================================================
            // COMPLETION INFORMATION
            //
            // These values remain empty until the project
            // is completed.
            // =================================================

            completionDate:
                null,

            completionInformation:
                "",
        };

        // ----------------------------------------------------
        // SEND PROJECT TO PARENT
        // ----------------------------------------------------

        if (
            typeof onSave ===
            "function"
        ) {
            onSave(newProject);
        }

        // ----------------------------------------------------
        // RESET FORM
        // ----------------------------------------------------

        setFormData(
            initialFormData
        );

        setError("");
    };

    // ========================================================
    // CLOSE MODAL
    // ========================================================

    const handleClose = () => {
        setFormData(
            initialFormData
        );

        setError("");

        if (
            typeof onClose ===
            "function"
        ) {
            onClose();
        }
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                if (!isOpen) {
                    handleClose();
                }
            }}
        >
            <DialogContent
                className="
                    max-h-[90vh]
                    overflow-y-auto
                    border-blue-800
                    bg-blue-950
                    text-white
                    sm:max-w-2xl
                "
            >

                {/* ==================================================
                    HEADER
                ================================================== */}

                <DialogHeader>

                    <DialogTitle
                        className="
                            flex
                            items-center
                            gap-3
                            text-xl
                            text-white
                        "
                    >

                        <div
                            className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-cyan-400/30
                                bg-cyan-500/10
                                text-cyan-400
                            "
                        >
                            <FolderKanban
                                size={20}
                            />
                        </div>

                        Create Project

                    </DialogTitle>

                    <DialogDescription
                        className="
                            text-blue-300
                        "
                    >
                        Create a new project and
                        assign it to a team.
                    </DialogDescription>

                </DialogHeader>

                {/* ==================================================
                    ERROR MESSAGE
                ================================================== */}

                {error && (
                    <div
                        className="
                            flex
                            items-start
                            gap-3
                            rounded-xl
                            border
                            border-red-500/30
                            bg-red-500/10
                            px-4
                            py-3
                            text-sm
                            text-red-300
                        "
                    >

                        <X
                            size={18}
                            className="
                                mt-0.5
                                shrink-0
                            "
                        />

                        <span>
                            {error}
                        </span>

                    </div>
                )}

                {/* ==================================================
                    FORM
                ================================================== */}

                <form
                    onSubmit={handleSubmit}
                    className="
                        space-y-5
                    "
                >

                    {/* ==================================================
                        PROJECT NAME
                    ================================================== */}

                    <div className="space-y-2">

                        <label
                            htmlFor="project-name"
                            className="
                                text-sm
                                font-medium
                                text-blue-100
                            "
                        >
                            Project Name

                            <span className="ml-1 text-red-400">
                                *
                            </span>

                        </label>

                        <Input
                            id="project-name"
                            name="name"
                            value={
                                formData.name
                            }
                           onChange={handleChange}
                            placeholder="Enter project name"
                            className="
                                h-11
                                border-blue-700
                                bg-blue-900
                                text-white
                                placeholder:text-blue-400
                                transition-all
                                duration-300
                                hover:border-blue-400
                                hover:bg-blue-800
                                focus:border-cyan-300
                                focus:bg-blue-800
                                focus:ring-2
                                focus:ring-cyan-300/30
                            "
                        />

                    </div>

                    {/* ==================================================
                        DESCRIPTION
                    ================================================== */}

                    <div className="space-y-2">

                        <label
                            htmlFor="project-description"
                            className="
                                text-sm
                                font-medium
                                text-blue-100
                            "
                        >
                            Project Description

                            <span className="ml-1 text-red-400">
                                *
                            </span>

                        </label>

                        <textarea
                            id="project-description"
                            name="description"
                            value={
                                formData.description
                            }
                            onChange={
                                handleChange
                            }
                            rows={4}
                            placeholder="Describe the purpose and scope of the project..."
                            className="
                                w-full
                                resize-none
                                rounded-md
                                border
                                border-blue-700
                                bg-blue-900
                                px-3
                                py-2
                                text-sm
                                text-white
                                outline-none
                                placeholder:text-blue-400
                                transition-all
                                duration-300
                                hover:border-blue-400
                                hover:bg-blue-800
                                focus:border-cyan-300
                                focus:bg-blue-800
                                focus:ring-2
                                focus:ring-cyan-300/30
                            "
                        />

                    </div>
{/* ==================================================
    PROJECT MANAGER
================================================== */}
<div className="space-y-2">
    <label
        htmlFor="project-manager"
        className="flex items-center gap-2 text-sm font-medium text-blue-100"
    >
        <UserRound size={15} className="text-cyan-400" />
        Project Manager
        <span className="ml-1 text-red-400">*</span>
    </label>

    <select
        id="project-manager"
        name="managerId"
        value={formData.managerId || ""}
        onChange={handleChange}
        className="h-11 w-full rounded-md border border-blue-700 bg-blue-900 px-3 text-sm text-white outline-none transition-all duration-300 hover:border-blue-400 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30"
    >
        <option value="" className="bg-blue-950">
            Select Project Manager
        </option>
        {managers.map((manager) => (
            <option
                key={manager.id}
                value={manager.id} // 🌟 This sends the REAL database GUID!
                className="bg-blue-950"
            >
                {manager.name}
            </option>
        ))}
    </select>
</div>
                    {/* ==================================================
                        TEAM + TEAM LEADER
                    ================================================== */}

                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-5
                            md:grid-cols-2
                        "
                    >

                        {/* ==================================================
                            TEAM
                        ================================================== */}

                        <div className="space-y-2">

                            <label
                                htmlFor="project-team"
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    text-sm
                                    font-medium
                                    text-blue-100
                                "
                            >

                                <UsersRound
                                    size={15}
                                    className="text-blue-400"
                                />

                                Assigned Team

                                <span
                                    className="
                                        text-xs
                                        font-normal
                                        text-blue-400
                                    "
                                >
                                    (Optional)
                                </span>

                            </label>

                            {Array.isArray(teams) &&
                            teams.length > 0 ? (

                              <select
    id="project-team"
    name="team"
    value={formData.team}
 onChange={(event) => {
    const teamName =
        event.target.value;

    const selectedTeam =
        teams.find(
            (team) =>
                team?.name === teamName
        );

    setFormData((current) => ({
        ...current,

        team:
            teamName,

        teamId:
            selectedTeam?.id ??
            selectedTeam?.teamId ??
            "",

        // Reset team leader when team changes
        teamLeader:
            "",

        teamLeaderId:
            "",
    }));

    setError("");
}}
    className="
        h-11
        w-full
        rounded-md
        border
        border-blue-700
        bg-blue-900
        px-3
        text-sm
        text-white
        outline-none
        transition-all
        duration-300
        hover:border-blue-400
        focus:border-cyan-300
        focus:ring-2
        focus:ring-cyan-300/30
    "
>
                                    <option
                                        value=""
                                        className="bg-blue-950"
                                    >
                                        No team assigned
                                    </option>

                                    {teams.map(
                                        (team) => (
                                            <option
                                                key={
                                                    team?.id ??
                                                    team?.name
                                                }
                                                value={
                                                    team?.name || ""
                                                }
                                                className="bg-blue-950"
                                            >
                                                {
                                                    team?.name
                                                }
                                            </option>
                                        )
                                    )}

                                </select>

                            ) : (

                                <Input
                                    id="project-team"
                                    name="team"
                                    value={
                                        formData.team
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter team name (optional)"
                                    className="
                                        h-11
                                        border-blue-700
                                        bg-blue-900
                                        text-white
                                        placeholder:text-blue-400
                                        transition-all
                                        duration-300
                                        hover:border-blue-400
                                        hover:bg-blue-800
                                        focus:border-cyan-300
                                        focus:bg-blue-800
                                        focus:ring-2
                                        focus:ring-cyan-300/30
                                    "
                                />

                            )}

                        </div>

                        {/* ==================================================
                            TEAM LEADER
                        ================================================== */}

                        <div className="space-y-2">

                            <label
                                htmlFor="project-team-leader"
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    text-sm
                                    font-medium
                                    text-blue-100
                                "
                            >

                                <UserRound
                                    size={15}
                                    className="text-cyan-400"
                                />

                                Team Leader

                                <span
                                    className="
                                        text-xs
                                        font-normal
                                        text-blue-400
                                    "
                                >
                                    (Optional)
                                </span>

                            </label>
<select
    id="project-team-leader"
    name="teamLeader"
    value={formData.teamLeaderId}
    disabled={
        !formData.team ||
        loadingUsers ||
        teamLeaders.length === 0
    }
    onChange={(event) => {
        const leaderId =
            event.target.value;

        const selectedLeader =
            teamLeaders.find(
                (leader) =>
                    String(
                        leader?.userId ||
                        leader?.id
                    ) ===
                    String(leaderId)
            );

        setFormData((current) => ({
            ...current,

            teamLeader:
                selectedLeader?.fullName ||
                "",

            teamLeaderId:
                selectedLeader?.userId ||
                selectedLeader?.id ||
                "",
        }));

        setError("");
    }}
  className="
    w-full
    h-11
    rounded-md
    border
    border-blue-700
    bg-blue-900
    px-3
    text-sm
    text-white
    transition-all
    duration-300
    hover:border-blue-400
    hover:bg-blue-800
    focus:border-cyan-300
    focus:bg-blue-800
    focus:outline-none
    focus:ring-2
    focus:ring-cyan-300/30
    disabled:cursor-not-allowed
    disabled:opacity-60
    disabled:bg-blue-950
    disabled:border-blue-900
   
    "
>
    <option
    value=""
    className="bg-blue-950 text-white"
>
        {loadingUsers
            ? "Loading team leaders..."
            : !formData.team
                ? "Select a team first"
                : teamLeaders.length === 0
                    ? "No team leaders found"
                    : "Select team leader"}
    </option>

    {teamLeaders.map((leader) => {
        const leaderId =
            leader?.userId ||
            leader?.id;

        return (
            <option
                key={leaderId}
                value={leaderId}
            >
                {leader?.fullName ||
                    leader?.email ||
                    "Unknown User"}
            </option>
        );
    })}
</select>

                        </div>

                    </div>

                    {/* ==================================================
                        DATES
                    ================================================== */}

                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-5
                            md:grid-cols-2
                        "
                    >

                        {/* ==================================================
                            START DATE
                        ================================================== */}

                        <div className="space-y-2">

                            <label
                                htmlFor="project-start-date"
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    text-sm
                                    font-medium
                                    text-blue-100
                                "
                            >

                                <CalendarDays
                                    size={15}
                                    className="text-cyan-400"
                                />

                                Start Date

                                <span className="text-red-400">
                                    *
                                </span>

                            </label>

                            <Input
                                id="project-start-date"
                                type="date"
                                name="startDate"
                                value={
                                    formData.startDate
                                }
                                onChange={
                                    handleChange
                                }
                                className="
                                    h-11
                                    border-blue-700
                                    bg-blue-900
                                    text-white
                                    transition-all
                                    duration-300
                                    hover:border-blue-400
                                    hover:bg-blue-800
                                    focus:border-cyan-300
                                    focus:bg-blue-800
                                    focus:ring-2
                                    focus:ring-cyan-300/30
                                "
                            />

                        </div>

                        {/* ==================================================
                            DEADLINE
                        ================================================== */}

                        <div className="space-y-2">

                            <label
                                htmlFor="project-deadline"
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    text-sm
                                    font-medium
                                    text-blue-100
                                "
                            >

                                <CalendarDays
                                    size={15}
                                    className="text-amber-400"
                                />

                                Deadline

                                <span className="text-red-400">
                                    *
                                </span>

                            </label>

                            <Input
                                id="project-deadline"
                                type="date"
                                name="deadline"
                                value={
                                    formData.deadline
                                }
                                onChange={
                                    handleChange
                                }
                                min={
                                    formData.startDate ||
                                    undefined
                                }
                                className="
                                    h-11
                                    border-blue-700
                                    bg-blue-900
                                    text-white
                                    transition-all
                                    duration-300
                                    hover:border-blue-400
                                    hover:bg-blue-800
                                    focus:border-cyan-300
                                    focus:bg-blue-800
                                    focus:ring-2
                                    focus:ring-cyan-300/30
                                "
                            />

                        </div>

                    </div>

                    {/* ==================================================
                        INFORMATION NOTE
                    ================================================== */}

                    <div
                        className="
                            rounded-xl
                            border
                            border-blue-700/50
                            bg-blue-900/40
                            px-4
                            py-3
                            text-sm
                            text-blue-300
                        "
                    >

                        <p
                            className="
                                font-medium
                                text-blue-200
                            "
                        >
                            Project tracking information
                        </p>

                        <p className="mt-1">
                            The project will start with
                            Planning status, zero sprints,
                            zero tasks, and zero progress.
                            The creation date will be recorded
                            automatically. Completion information
                            will be added when the project is
                            completed.
                        </p>

                    </div>

                    {/* ==================================================
                        FOOTER
                    ================================================== */}

                    <DialogFooter
                        className="
                            gap-2
                            border-t
                            border-blue-800
                            pt-5
                        "
                    >

                        <Button
                            type="button"
                            variant="outline"
                            onClick={
                                handleClose
                            }
                            className="
                                border-blue-700
                                bg-blue-950
                                text-blue-200
                                transition-all
                                duration-300
                                hover:border-blue-400
                                hover:bg-blue-900
                                hover:text-white
                            "
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            className="
                                gap-2
                                border
                                border-cyan-400/30
                                bg-blue-700
                                text-white
                                shadow-md
                                transition-all
                                duration-300
                                hover:-translate-y-0.5
                                hover:border-cyan-300
                                hover:bg-cyan-600
                                hover:shadow-lg
                                hover:shadow-cyan-500/20
                            "
                        >

                            <FolderKanban
                                size={17}
                            />

                            Save Project

                        </Button>

                    </DialogFooter>

                </form>

            </DialogContent>

        </Dialog>
    );
}

export default CreateProjectModal;
