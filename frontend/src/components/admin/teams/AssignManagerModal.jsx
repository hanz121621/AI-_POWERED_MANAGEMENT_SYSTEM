
import { useEffect, useMemo, useState } from "react";

import {
    UsersRound,
    UserRound,
    ShieldCheck,
    X,
    Save,
    AlertTriangle,
    CheckCircle2,
    UserCheck,
} from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import {
    assignManagerToTeam,
    getAvailableManagers,
} from "@/services/teamService";
function AssignManagerModal({
    open = false,
    team = null,
    onClose,
    onSuccess,
    performedBy = "Admin",
}) {
    // ============================================================
    // STATE
    // ============================================================

    const [managerId, setManagerId] = useState("");

    const [managers, setManagers] = useState([]);

    const [loadingManagers, setLoadingManagers] =
        useState(false);

    const [saving, setSaving] = useState(false);

    const [errors, setErrors] = useState({});

    const [successMessage, setSuccessMessage] =
        useState("");

    const [replaceConfirmation, setReplaceConfirmation] =
        useState(false);
    const getTeamId = (selectedTeam) => {
        return (
            selectedTeam?.id ??
            selectedTeam?.teamId ??
            selectedTeam?._id ??
            null
        );
    };

    const getManagerId = (manager) => {
        if (!manager) {
            return null;
        }

        if (typeof manager === "string") {
            return manager;
        }

        return (
            manager.id ??
            manager.userId ??
            manager.userID ??
            manager.Id ??
            manager.user_id ??
            null
        );
    };

    const getManagerName = (manager) => {
        if (!manager) {
            return "Current manager";
        }

        if (typeof manager === "string") {
            return manager;
        }

        return (
            manager.fullName ||
            manager.name ||
            manager.username ||
            manager.displayName ||
            manager.email ||
            "Current manager"
        );
    };

    // ============================================================
    // TEAM ID
    // ============================================================

    const teamId = useMemo(() => {
        return getTeamId(team);
    }, [team]);

    // ============================================================
    // CURRENT MANAGER
    // ============================================================

    const currentManager = useMemo(() => {
        if (!team) {
            return null;
        }

        if (!team.managerId) {
            return null;
        }

        return getManagerName(
            team.manager ||
                team.managerName ||
                team.managerEmail ||
                team.managerId
        );
    }, [team]);

    // ============================================================
    // LOAD AVAILABLE MANAGERS
    // ============================================================
    //
    // Important:
    // getAvailableManagers() may call the backend.
    //
    // Therefore it should NOT be executed directly inside
    // the render function.
    //
    // ============================================================

    useEffect(() => {
        let cancelled = false;

        const loadManagers = async () => {
            if (!open || !teamId) {
                setManagers([]);
                return;
            }

            setLoadingManagers(true);

            try {
                const result =
                    await getAvailableManagers(teamId);

                if (cancelled) {
                    return;
                }

                // ------------------------------------------------
                // Support different service response formats
                // ------------------------------------------------

                if (Array.isArray(result)) {
                    setManagers(result);
                    return;
                }

                if (Array.isArray(result?.data)) {
                    setManagers(result.data);
                    return;
                }

                if (Array.isArray(result?.managers)) {
                    setManagers(result.managers);
                    return;
                }

                setManagers([]);
            } catch (error) {
                if (cancelled) {
                    return;
                }

                console.error(
                    "Unable to load available managers:",
                    error
                );

                setManagers([]);

                setErrors({
                    general:
                        error?.message ||
                        "Unable to load available managers.",
                });
            } finally {
                if (!cancelled) {
                    setLoadingManagers(false);
                }
            }
        };

        loadManagers();

        return () => {
            cancelled = true;
        };
    }, [open, teamId]);

    // ============================================================
    // RESET WHEN MODAL OPENS
    // ============================================================

    useEffect(() => {
        if (!open) {
            return;
        }

        setManagerId("");
        setErrors({});
        setSuccessMessage("");
        setReplaceConfirmation(false);
    }, [open, teamId]);

    // ============================================================
    // CLOSE
    // ============================================================

    const handleClose = () => {
        if (saving) {
            return;
        }

        setManagerId("");
        setErrors({});
        setSuccessMessage("");
        setReplaceConfirmation(false);

        onClose?.();
    };

    // ============================================================
    // MANAGER CHANGE
    // ============================================================

    const handleManagerChange = (event) => {
        setManagerId(event.target.value);

        setErrors({});

        setSuccessMessage("");

        setReplaceConfirmation(false);
    };

    // ============================================================
    // VALIDATION
    // ============================================================

    const validateForm = () => {
        const newErrors = {};

        if (!teamId) {
            newErrors.general = "Team not found.";
        }

        if (!managerId) {
            newErrors.manager =
                "Please select a manager.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // ============================================================
    // SELECTED MANAGER
    // ============================================================

    const selectedManager = useMemo(() => {
        if (!managerId) {
            return null;
        }

        return (
            managers.find(
                (manager) =>
                    String(
                        getManagerId(manager)
                    ) === String(managerId)
            ) || null
        );
    }, [managerId, managers]);

    // ============================================================
    // SUBMIT
    // ============================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (saving) {
            return;
        }

        setErrors({});
        setSuccessMessage("");

        // --------------------------------------------------------
        // VALIDATION
        // --------------------------------------------------------

        if (!validateForm()) {
            return;
        }

        // --------------------------------------------------------
        // EXISTING MANAGER
        // --------------------------------------------------------

        const existingManagerId =
            team?.managerId ??
            team?.manager?.id ??
            team?.manager?.userId ??
            null;

        const hasExistingManager =
            Boolean(existingManagerId);

        const selectedIsCurrentManager =
            hasExistingManager &&
            String(existingManagerId) ===
                String(managerId);

        // --------------------------------------------------------
        // SAME MANAGER
        // --------------------------------------------------------
        //
        // If the selected manager is already the current manager,
        // there is nothing to replace.
        //
        // --------------------------------------------------------

        if (selectedIsCurrentManager) {
            setErrors({
                general:
                    "This manager is already assigned to this team.",
            });

            return;
        }

        // --------------------------------------------------------
        // REPLACEMENT CONFIRMATION
        // --------------------------------------------------------

        if (
            hasExistingManager &&
            !replaceConfirmation
        ) {
            setReplaceConfirmation(true);

            setErrors({
                general:
                    `Team "${team?.name || "this team"}" already has ` +
                    `${currentManager || "a manager"} assigned. ` +
                    `Click "Confirm Replacement" to continue.`,
            });

            return;
        }

        // --------------------------------------------------------
        // SAVE
        // --------------------------------------------------------

        setSaving(true);

        try {
            // ====================================================
            // BACKEND/SERVICE CALL
            // ====================================================

            const result =
                await assignManagerToTeam(
                    teamId,
                    managerId,
                    {
                        performedBy,
                        confirmReplace:
                            replaceConfirmation,
                    }
                );

            // ====================================================
            // TEAM NOT FOUND
            // ====================================================

            if (
                result?.code ===
                "TEAM_NOT_FOUND"
            ) {
                setErrors({
                    general:
                        "Team not found.",
                });

                return;
            }

            // ====================================================
            // MANAGER NOT FOUND
            // ====================================================

            if (
                result?.code ===
                "MANAGER_NOT_FOUND"
            ) {
                setErrors({
                    manager:
                        "Selected manager was not found.",
                });

                return;
            }

            // ====================================================
            // INVALID ROLE
            // ====================================================

            if (
                result?.code ===
                "INVALID_MANAGER_ROLE"
            ) {
                setErrors({
                    manager:
                        "Only users with the Manager role can be assigned.",
                });

                return;
            }

            // ====================================================
            // MANAGER ALREADY ASSIGNED ELSEWHERE
            // ====================================================

            if (
                result?.code ===
                "MANAGER_ALREADY_ASSIGNED_TO_ANOTHER_TEAM"
            ) {
                setErrors({
                    manager:
                        "This manager is already assigned to another team.",
                });

                return;
            }

            // ====================================================
            // EXISTING MANAGER REQUIRES CONFIRMATION
            // ====================================================

            if (
                result?.code ===
                    "MANAGER_ALREADY_ASSIGNED" &&
                result?.requiresConfirmation
            ) {
                const existingManager =
                    result?.existingManager;

                setReplaceConfirmation(true);

                setErrors({
                    general:
                        `Team "${team?.name || "this team"}" already has ` +
                        `${getManagerName(
                            existingManager
                        )} as manager. ` +
                        `Click "Confirm Replacement" to continue.`,
                });

                return;
            }

            // ====================================================
            // BACKEND ERROR
            // ====================================================

            if (!result?.success) {
                setErrors({
                    general:
                        result?.message ||
                        "Unable to assign manager. Please try again.",
                });

                return;
            }

            // ====================================================
            // SUCCESS
            // ====================================================

            setSuccessMessage(
                result?.message ||
                    "Manager assigned successfully."
            );

            // ----------------------------------------------------
            // UPDATED TEAM
            // ----------------------------------------------------

            const updatedTeam =
                result?.team || {
                    ...team,
                    managerId,
                    manager:
                        result?.manager ||
                        selectedManager,
                };

            // ----------------------------------------------------
            // SEND UPDATED TEAM TO PARENT
            // ----------------------------------------------------

            onSuccess?.(
                updatedTeam,
                result?.manager ||
                    selectedManager
            );

            // ----------------------------------------------------
            // RESET
            // ----------------------------------------------------

            setManagerId("");

            setErrors({});

            setReplaceConfirmation(false);

            // ----------------------------------------------------
            // CLOSE AFTER SUCCESS
            // ----------------------------------------------------

            onClose?.();
        } catch (error) {
            console.error(
                "Unable to assign manager:",
                error
            );

            // ----------------------------------------------------
            // Handle backend/API error structures
            // ----------------------------------------------------

            const backendCode =
                error?.response?.data?.code ||
                error?.code;

            const backendMessage =
                error?.response?.data?.message ||
                error?.message;

            if (
                backendCode ===
                "TEAM_NOT_FOUND"
            ) {
                setErrors({
                    general:
                        "Team not found.",
                });

                return;
            }

            if (
                backendCode ===
                "MANAGER_NOT_FOUND"
            ) {
                setErrors({
                    manager:
                        "Selected manager was not found.",
                });

                return;
            }

            if (
                backendCode ===
                "INVALID_MANAGER_ROLE"
            ) {
                setErrors({
                    manager:
                        "Only users with the Manager role can be assigned.",
                });

                return;
            }

            if (
                backendCode ===
                "MANAGER_ALREADY_ASSIGNED_TO_ANOTHER_TEAM"
            ) {
                setErrors({
                    manager:
                        "This manager is already assigned to another team.",
                });

                return;
            }

            if (
                backendCode ===
                    "MANAGER_ALREADY_ASSIGNED" &&
                error?.response?.data
                    ?.requiresConfirmation
            ) {
                setReplaceConfirmation(true);

                setErrors({
                    general:
                        "This team already has a manager. Please confirm the replacement.",
                });

                return;
            }

            setErrors({
                general:
                    backendMessage ||
                    "Unable to assign manager. Please try again.",
            });
        } finally {
            setSaving(false);
        }
    };

    // ============================================================
    // DO NOT RENDER WITHOUT TEAM
    // ============================================================

    if (!team) {
        return null;
    }

    // ============================================================
    // RENDER
    // ============================================================

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
                    w-[95%]
                    max-w-2xl
                    overflow-hidden
                    rounded-2xl
                    border
                    border-border
                    bg-card
                    p-0
                    text-card-foreground
                    shadow-2xl
                "
            >
                {/* ==================================================
                    HEADER
                ================================================== */}

                <DialogHeader
                    className="
                        border-b
                        border-border
                        bg-muted/40
                        px-6
                        py-5
                    "
                >
                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            gap-4
                        "
                    >
                        <div
                            className="
                                flex
                                items-center
                                gap-3
                            "
                        >
                            <div
                                className="
                                    flex
                                    h-12
                                    w-12
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    border
                                    border-primary/20
                                    bg-primary/10
                                    text-primary
                                    shadow-sm
                                    transition-all
                                    duration-300
                                    hover:-translate-y-0.5
                                    hover:border-primary/40
                                    hover:bg-primary/20
                                    hover:shadow-lg
                                "
                            >
                                <UserCheck size={23} />
                            </div>

                            <div>
                                <DialogTitle
                                    className="
                                        text-xl
                                        font-bold
                                        tracking-tight
                                        text-foreground
                                    "
                                >
                                    Assign Team Manager
                                </DialogTitle>

                                <DialogDescription
                                    className="
                                        mt-1
                                        text-sm
                                        text-muted-foreground
                                    "
                                >
                                    Select an existing user
                                    with the Manager role.
                                </DialogDescription>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={saving}
                            className="
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-border
                                bg-background
                                text-muted-foreground
                                transition-all
                                duration-200
                                hover:rotate-90
                                hover:border-red-500/40
                                hover:bg-red-500/10
                                hover:text-red-500
                                disabled:cursor-not-allowed
                                disabled:opacity-40
                            "
                            aria-label="Close"
                            title="Close"
                        >
                            <X size={19} />
                        </button>
                    </div>
                </DialogHeader>

                {/* ==================================================
                    FORM
                ================================================== */}

                <form onSubmit={handleSubmit}>
                    <div
                        className="
                            max-h-[70vh]
                            space-y-5
                            overflow-y-auto
                            bg-background
                            px-6
                            py-6
                        "
                    >
                        {/* ==================================================
                            TEAM INFORMATION
                        ================================================== */}

                        <div
                            className="
                                rounded-xl
                                border
                                border-border
                                bg-muted/40
                                p-4
                                transition-all
                                duration-300
                                hover:border-primary/40
                                hover:bg-muted/60
                                hover:shadow-md
                            "
                        >
                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                "
                            >
                                <div
                                    className="
                                        flex
                                        h-10
                                        w-10
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-lg
                                        bg-primary/10
                                        text-primary
                                    "
                                >
                                    <UsersRound size={20} />
                                </div>

                                <div className="min-w-0">
                                    <p
                                        className="
                                            text-xs
                                            font-semibold
                                            uppercase
                                            tracking-wider
                                            text-muted-foreground
                                        "
                                    >
                                        Team
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            truncate
                                            text-base
                                            font-bold
                                            text-foreground
                                        "
                                    >
                                        {team.name ||
                                            "Unnamed Team"}
                                    </p>
                                </div>
                            </div>

                            {team.description && (
                                <p
                                    className="
                                        mt-3
                                        border-t
                                        border-border
                                        pt-3
                                        text-sm
                                        leading-6
                                        text-muted-foreground
                                    "
                                >
                                    {team.description}
                                </p>
                            )}
                        </div>

                        {/* ==================================================
                            CURRENT MANAGER
                        ================================================== */}

                        {currentManager && (
                            <div
                                className="
                                    rounded-xl
                                    border
                                    border-amber-500/30
                                    bg-amber-500/10
                                    p-4
                                "
                            >
                                <div
                                    className="
                                        flex
                                        items-start
                                        gap-3
                                    "
                                >
                                    <AlertTriangle
                                        size={20}
                                        className="
                                            mt-0.5
                                            shrink-0
                                            text-amber-500
                                        "
                                    />

                                    <div>
                                        <p
                                            className="
                                                text-sm
                                                font-semibold
                                                text-amber-600
                                                dark:text-amber-400
                                            "
                                        >
                                            Current Manager
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                text-sm
                                                font-semibold
                                                text-foreground
                                            "
                                        >
                                            {currentManager}
                                        </p>

                                        <p
                                            className="
                                                mt-2
                                                text-xs
                                                leading-5
                                                text-muted-foreground
                                            "
                                        >
                                            Selecting another
                                            manager will replace
                                            the current manager
                                            after confirmation.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ==================================================
                            GENERAL ERROR
                        ================================================== */}

                        {errors.general && (
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
                                    text-red-600
                                    dark:text-red-400
                                "
                            >
                                <AlertTriangle
                                    size={18}
                                    className="
                                        mt-0.5
                                        shrink-0
                                    "
                                />

                                <span>
                                    {errors.general}
                                </span>
                            </div>
                        )}

                        {/* ==================================================
                            SUCCESS
                        ================================================== */}

                        {successMessage && (
                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                    rounded-xl
                                    border
                                    border-emerald-500/30
                                    bg-emerald-500/10
                                    px-4
                                    py-3
                                    text-sm
                                    font-medium
                                    text-emerald-600
                                    dark:text-emerald-400
                                "
                            >
                                <CheckCircle2 size={18} />

                                {successMessage}
                            </div>
                        )}

                        {/* ==================================================
                            MANAGER SELECT
                        ================================================== */}

                        <div
                            className="
                                rounded-xl
                                border
                                border-border
                                bg-card
                                p-4
                                shadow-sm
                                transition-all
                                duration-300
                                hover:border-primary/40
                                hover:shadow-md
                            "
                        >
                            <div className="space-y-2">
                                <label
                                    htmlFor="assign-team-manager"
                                    className="
                                        block
                                        text-sm
                                        font-semibold
                                        text-foreground
                                    "
                                >
                                    Select Manager

                                    <span
                                        className="
                                            ml-1
                                            text-red-500
                                        "
                                    >
                                        *
                                    </span>
                                </label>

                                <div className="relative">
                                    <UserRound
                                        size={18}
                                        className="
                                            pointer-events-none
                                            absolute
                                            left-3
                                            top-1/2
                                            z-10
                                            -translate-y-1/2
                                            text-primary
                                        "
                                    />

                                    <select
                                        id="assign-team-manager"
                                        value={managerId}
                                        onChange={
                                            handleManagerChange
                                        }
                                        disabled={
                                            saving ||
                                            loadingManagers
                                        }
                                        className={`
                                            w-full
                                            rounded-xl
                                            border
                                            bg-background
                                            py-3
                                            pl-10
                                            pr-4
                                            text-sm
                                            text-foreground
                                            outline-none
                                            transition-all
                                            duration-200
                                            hover:border-primary/50
                                            focus:border-primary
                                            focus:ring-2
                                            focus:ring-primary/20
                                            disabled:cursor-not-allowed
                                            disabled:opacity-60
                                            ${
                                                errors.manager
                                                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                                    : "border-border"
                                            }
                                        `}
                                    >
                                        <option value="">
                                            {loadingManagers
                                                ? "Loading managers..."
                                                : "Select a manager"}
                                        </option>

                                        {managers.map(
                                            (manager) => {
                                                const id =
                                                    getManagerId(
                                                        manager
                                                    );

                                                if (
                                                    id ===
                                                        null ||
                                                    id ===
                                                        undefined
                                                ) {
                                                    return null;
                                                }

                                                const name =
                                                    getManagerName(
                                                        manager
                                                    );

                                                return (
                                                    <option
                                                        key={
                                                            id
                                                        }
                                                        value={
                                                            id
                                                        }
                                                    >
                                                        {name}

                                                        {manager.email
                                                            ? ` — ${manager.email}`
                                                            : ""}
                                                    </option>
                                                );
                                            }
                                        )}
                                    </select>
                                </div>

                                {errors.manager && (
                                    <p
                                        className="
                                            text-xs
                                            font-medium
                                            text-red-500
                                        "
                                    >
                                        {errors.manager}
                                    </p>
                                )}
                            </div>

                            {/* ==================================================
                                LOADING
                            ================================================== */}

                            {loadingManagers && (
                                <div
                                    className="
                                        mt-4
                                        flex
                                        items-center
                                        gap-3
                                        rounded-lg
                                        border
                                        border-primary/20
                                        bg-primary/5
                                        px-3
                                        py-3
                                    "
                                >
                                    <span
                                        className="
                                            h-4
                                            w-4
                                            animate-spin
                                            rounded-full
                                            border-2
                                            border-primary/30
                                            border-t-primary
                                        "
                                    />

                                    <p
                                        className="
                                            text-xs
                                            font-medium
                                            text-muted-foreground
                                        "
                                    >
                                        Loading available
                                        managers...
                                    </p>
                                </div>
                            )}

                            {/* ==================================================
                                NO MANAGERS
                            ================================================== */}

                            {!loadingManagers &&
                                managers.length === 0 && (
                                    <div
                                        className="
                                            mt-4
                                            flex
                                            items-start
                                            gap-3
                                            rounded-lg
                                            border
                                            border-amber-500/20
                                            bg-amber-500/5
                                            px-3
                                            py-3
                                        "
                                    >
                                        <ShieldCheck
                                            size={17}
                                            className="
                                                mt-0.5
                                                shrink-0
                                                text-amber-500
                                            "
                                        />

                                        <div>
                                            <p
                                                className="
                                                    text-xs
                                                    font-semibold
                                                    text-amber-600
                                                    dark:text-amber-400
                                                "
                                            >
                                                No available
                                                managers
                                            </p>

                                            <p
                                                className="
                                                    mt-1
                                                    text-xs
                                                    leading-5
                                                    text-muted-foreground
                                                "
                                            >
                                                No available users
                                                with the Manager
                                                role were found.
                                            </p>
                                        </div>
                                    </div>
                                )}
                        </div>

                        {/* ==================================================
                            REPLACEMENT CONFIRMATION
                        ================================================== */}

                        {replaceConfirmation && (
                            <div
                                className="
                                    rounded-xl
                                    border
                                    border-amber-500/40
                                    bg-amber-500/10
                                    p-4
                                "
                            >
                                <div
                                    className="
                                        flex
                                        items-start
                                        gap-3
                                    "
                                >
                                    <AlertTriangle
                                        size={20}
                                        className="
                                            mt-0.5
                                            shrink-0
                                            text-amber-500
                                        "
                                    />

                                    <div>
                                        <p
                                            className="
                                                text-sm
                                                font-semibold
                                                text-amber-600
                                                dark:text-amber-400
                                            "
                                        >
                                            Replace Current
                                            Manager?
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                text-xs
                                                leading-5
                                                text-muted-foreground
                                            "
                                        >
                                            This team already
                                            has a manager.
                                            Click
                                            "Confirm Replacement"
                                            to replace them.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ==================================================
                        FOOTER
                    ================================================== */}

                    <div
                        className="
                            flex
                            flex-col-reverse
                            gap-3
                            border-t
                            border-border
                            bg-muted/40
                            px-6
                            py-4
                            sm:flex-row
                            sm:items-center
                            sm:justify-end
                        "
                    >
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={saving}
                            className="
                                rounded-xl
                                border-border
                                bg-background
                                px-5
                                text-foreground
                                transition-all
                                duration-200
                                hover:border-primary/40
                                hover:bg-primary/5
                                hover:text-foreground
                            "
                        >
                            <X
                                size={16}
                                className="mr-2"
                            />

                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={
                                saving ||
                                loadingManagers ||
                                !managerId
                            }
                            className="
                                rounded-xl
                                px-5
                                font-semibold
                                shadow-lg
                                transition-all
                                duration-200
                                hover:-translate-y-0.5
                                hover:shadow-xl
                                focus:ring-2
                                focus:ring-primary/30
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            {saving ? (
                                <>
                                    <span
                                        className="
                                            mr-2
                                            h-4
                                            w-4
                                            animate-spin
                                            rounded-full
                                            border-2
                                            border-current/30
                                            border-t-current
                                        "
                                    />

                                    Assigning...
                                </>
                            ) : (
                                <>
                                    <Save
                                        size={16}
                                        className="mr-2"
                                    />

                                    {replaceConfirmation
                                        ? "Confirm Replacement"
                                        : "Assign Manager"}
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default AssignManagerModal;