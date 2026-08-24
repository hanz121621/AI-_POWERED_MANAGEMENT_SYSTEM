import { useState } from "react";

import {
    CalendarDays,
    FolderKanban,
    UsersRound,
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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// ============================================================
// EDIT PROJECT MODAL
//
// PROJ-004: Update Project Details
//
// Primary Actor: Admin
//
// Admin can update:
// - Project name
// - Project description
// - Project manager
// - Assigned team
// - Start date
// - Deadline
// - Project status
//
// Frontend/local data for now.
// Backend API and activity log will be connected later.
// ============================================================

function EditProjectModal({
    open,
    onClose,
    onSave,
    project,
    existingProjects = [],
    managers = [],
    teams = [],
}) {

    // ========================================================
    // FORM DATA
    // ========================================================

    const [formData, setFormData] = useState(() =>
        createFormData(project)
    );

    // ========================================================
    // ERROR
    // ========================================================

    const [error, setError] = useState("");

    // ========================================================
    // CREATE FORM DATA
    //
    // We use a helper instead of useEffect so we do not get
    // the react-hooks/set-state-in-effect ESLint error.
    // ========================================================

    function createFormData(currentProject) {
        return {
            name: currentProject?.name || "",
            description: currentProject?.description || "",
            manager: currentProject?.manager || "",
            team:
                currentProject?.team === "No team assigned"
                    ? ""
                    : currentProject?.team || "",
            startDate: currentProject?.startDate || "",
            deadline: currentProject?.deadline || "",
            status: currentProject?.status || "Planning",
        };
    }

    // ========================================================
    // OPEN PROJECT
    //
    // Parent can call this before opening the modal by passing
    // a different project. The actual synchronization is done
    // through the explicit reset button / open handler later.
    // ========================================================

    const handleOpenChange = (isOpen) => {

        if (!isOpen) {
            handleClose();
        }
    };

    // ========================================================
    // HANDLE INPUT
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
    // VALIDATION
    // PROJ-004
    // ========================================================

    const validateForm = () => {

        const name =
            formData.name.trim();

        const description =
            formData.description.trim();

        const manager =
            formData.manager.trim();

        const startDate =
            formData.startDate;

        const deadline =
            formData.deadline;

        // ----------------------------------------------------
        // A3: REQUIRED INFORMATION
        // ----------------------------------------------------

        if (
            !name ||
            !description ||
            !manager ||
            !startDate ||
            !deadline ||
            !formData.status
        ) {

            setError(
                "Please complete all required fields."
            );

            return false;
        }

        // ----------------------------------------------------
        // A1: PROJECT DOES NOT EXIST
        // ----------------------------------------------------

        if (!project) {

            setError(
                "Project not found."
            );

            return false;
        }

        // ----------------------------------------------------
        // A2: DUPLICATE PROJECT NAME
        //
        // Ignore the current project itself.
        // ----------------------------------------------------

        const projectExists =
            existingProjects.some(
                (item) => {

                    if (
                        String(item.id) ===
                        String(project.id)
                    ) {
                        return false;
                    }

                    return (
                        String(item.name || "")
                            .trim()
                            .toLowerCase() ===
                        name.toLowerCase()
                    );
                }
            );

        if (projectExists) {

            setError(
                "Project name already exists."
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
    // SAVE CHANGES
    // PROJ-004
    // ========================================================

    const handleSubmit = (event) => {

        event.preventDefault();

        setError("");

        // ----------------------------------------------------
        // VALIDATE
        // ----------------------------------------------------

        if (!validateForm()) {
            return;
        }

        // ----------------------------------------------------
        // UPDATED PROJECT
        // ----------------------------------------------------

        const updatedProject = {

            ...project,

            name:
                formData.name.trim(),

            description:
                formData.description.trim(),

            manager:
                formData.manager.trim(),

            team:
                formData.team.trim() ||
                "No team assigned",

            startDate:
                formData.startDate,

            deadline:
                formData.deadline,

            status:
                formData.status,
        };

        // ----------------------------------------------------
        // SEND UPDATED PROJECT TO PARENT
        // ----------------------------------------------------

        if (typeof onSave === "function") {

            onSave(updatedProject);
        }
    };

    // ========================================================
    // CLOSE
    // ========================================================

    const handleClose = () => {

        setError("");

        if (typeof onClose === "function") {
            onClose();
        }
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <Dialog
            open={open}
            onOpenChange={handleOpenChange}
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

                        Edit Project

                    </DialogTitle>

                    <DialogDescription
                        className="
                            text-blue-300
                        "
                    >
                        Update the project information
                        and save your changes.
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
                            htmlFor="edit-project-name"
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
                            id="edit-project-name"
                            name="name"
                            value={formData.name}
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
                            htmlFor="edit-project-description"
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
                            id="edit-project-description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
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
                        MANAGER + TEAM
                    ================================================== */}

                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-5
                            md:grid-cols-2
                        "
                    >

                        {/* MANAGER */}

                        <div className="space-y-2">

                            <label
                                htmlFor="edit-project-manager"
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
                                    className="text-cyan-400"
                                />

                                Project Manager

                                <span className="text-red-400">
                                    *
                                </span>

                            </label>

                            {Array.isArray(managers) &&
                            managers.length > 0 ? (

                                <select
                                    id="edit-project-manager"
                                    name="manager"
                                    value={formData.manager}
                                    onChange={handleChange}
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
                                        Select manager
                                    </option>

                                    {managers.map(
                                        (manager) => {

                                            const managerId =
                                                manager.id ??
                                                manager.userId;

                                            const managerName =
                                                manager.name ??
                                                manager.fullName ??
                                                manager.username;

                                            return (
                                                <option
                                                    key={
                                                        managerId ??
                                                        managerName
                                                    }
                                                    value={
                                                        managerId ??
                                                        managerName
                                                    }
                                                    className="bg-blue-950"
                                                >
                                                    {managerName}
                                                </option>
                                            );
                                        }
                                    )}

                                </select>

                            ) : (

                                <Input
                                    id="edit-project-manager"
                                    name="manager"
                                    value={formData.manager}
                                    onChange={handleChange}
                                    placeholder="Enter manager name"
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


                        {/* TEAM */}

                        <div className="space-y-2">

                            <label
                                htmlFor="edit-project-team"
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
                                    id="edit-project-team"
                                    name="team"
                                    value={formData.team}
                                    onChange={handleChange}
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
                                                    team.id
                                                }
                                                value={
                                                    team.name
                                                }
                                                className="bg-blue-950"
                                            >
                                                {
                                                    team.name
                                                }
                                            </option>

                                        )
                                    )}

                                </select>

                            ) : (

                                <Input
                                    id="edit-project-team"
                                    name="team"
                                    value={formData.team}
                                    onChange={handleChange}
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

                        {/* START DATE */}

                        <div className="space-y-2">

                            <label
                                htmlFor="edit-project-start-date"
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
                                id="edit-project-start-date"
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
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


                        {/* DEADLINE */}

                        <div className="space-y-2">

                            <label
                                htmlFor="edit-project-deadline"
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
                                id="edit-project-deadline"
                                type="date"
                                name="deadline"
                                value={formData.deadline}
                                onChange={handleChange}
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
                        STATUS
                    ================================================== */}

                    <div className="space-y-2">

                        <label
                            htmlFor="edit-project-status"
                            className="
                                text-sm
                                font-medium
                                text-blue-100
                            "
                        >
                            Project Status

                            <span className="ml-1 text-red-400">
                                *
                            </span>
                        </label>

                        <select
                            id="edit-project-status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
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
                                value="Planning"
                                className="bg-blue-950"
                            >
                                Planning
                            </option>

                            <option
                                value="Active"
                                className="bg-blue-950"
                            >
                                Active
                            </option>

                            <option
                                value="On Hold"
                                className="bg-blue-950"
                            >
                                On Hold
                            </option>

                            <option
                                value="Completed"
                                className="bg-blue-950"
                            >
                                Completed
                            </option>

                            <option
                                value="Archived"
                                className="bg-blue-950"
                            >
                                Archived
                            </option>

                        </select>

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
                            onClick={handleClose}
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

                            Save Changes

                        </Button>

                    </DialogFooter>

                </form>

            </DialogContent>

        </Dialog>
    );
}

export default EditProjectModal;