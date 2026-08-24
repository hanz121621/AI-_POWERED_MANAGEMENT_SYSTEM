import { useState } from "react";

import {
    AlertTriangle,
    UserRound,
    X,
    CheckCircle2,
    Loader2,
} from "lucide-react";

import { removeMemberFromTeam } from "@/services/teamService";

// ============================================================
// REMOVE MEMBER DIALOG
// ============================================================
// Team Member Management
//
// Responsibilities:
// - Show member information
// - Show team information
// - Confirm member removal
// - Call backend removeMemberFromTeam()
// - Handle backend errors
// - Prevent duplicate requests
// - Notify parent after successful removal
//
// Backend/service operation:
// removeMemberFromTeam(teamId, memberId)
//
// Existing backend contract:
// - TEAM_NOT_FOUND
// - MEMBER_NOT_FOUND
// - MEMBER_NOT_IN_TEAM
// - MEMBER_HAS_ACTIVE_TASKS
// - MEMBER_REMOVED
// ============================================================

function RemoveMemberDialog({
    open = false,
    member = null,
    team = null,

    // Called after backend removal succeeds.
    // Parent can use this to refresh/update its UI.
    onConfirm,

    // Called when user cancels.
    onCancel,

    // Optional external loading state.
    loading: externalLoading = false,
}) {
    // ========================================================
    // STATE
    // ========================================================

    const [removing, setRemoving] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // ========================================================
    // EFFECTIVE LOADING STATE
    // ========================================================

    const loading =
        removing || externalLoading;

    // ========================================================
    // DO NOT RENDER WHEN CLOSED
    // ========================================================

    if (!open || !member) {
        return null;
    }

    // ========================================================
    // HELPERS
    // ========================================================

    const getMemberId = (value) => {
        if (!value) {
            return null;
        }

        if (typeof value === "string") {
            return value;
        }

        return (
            value.id ??
            value.userId ??
            value.userID ??
            value.user_id ??
            value.memberId ??
            value.memberID ??
            value._id ??
            value.Id ??
            null
        );
    };

    const getTeamId = (value) => {
        if (!value) {
            return null;
        }

        if (typeof value === "string") {
            return value;
        }

        return (
            value.id ??
            value.teamId ??
            value.teamID ??
            value._id ??
            value.Id ??
            null
        );
    };

    // ========================================================
    // MEMBER INFORMATION
    // ========================================================

    const memberId = getMemberId(member);

    const memberName =
        member.name ||
        member.fullName ||
        member.full_name ||
        member.username ||
        member.userName ||
        member.displayName ||
        member.email ||
        "this member";

    const memberEmail =
        member.email ||
        member.mail ||
        member.emailAddress ||
        member.userEmail ||
        "";

    // ========================================================
    // TEAM INFORMATION
    // ========================================================

    const teamId = getTeamId(team);

    const teamName =
        team?.name ||
        team?.teamName ||
        "this team";

    // ========================================================
    // BACKEND ERROR MESSAGE
    // ========================================================

    const getBackendErrorMessage = (backendError) => {
        const responseData =
            backendError?.response?.data;

        const code =
            responseData?.code ||
            responseData?.errorCode ||
            backendError?.code ||
            "";

        // ----------------------------------------------------
        // TEAM NOT FOUND
        // ----------------------------------------------------

        if (
            code === "TEAM_NOT_FOUND"
        ) {
            return "This team could not be found. Please refresh the team list and try again.";
        }

        // ----------------------------------------------------
        // MEMBER NOT FOUND
        // ----------------------------------------------------

        if (
            code === "MEMBER_NOT_FOUND"
        ) {
            return "The selected member could not be found.";
        }

        // ----------------------------------------------------
        // MEMBER NOT IN TEAM
        // ----------------------------------------------------

        if (
            code === "MEMBER_NOT_IN_TEAM"
        ) {
            return `${memberName} is no longer a member of ${teamName}.`;
        }

        // ----------------------------------------------------
        // ACTIVE TASKS
        // ----------------------------------------------------

        if (
            code === "MEMBER_HAS_ACTIVE_TASKS"
        ) {
            return (
                `${memberName} has active assigned tasks. ` +
                "Reassign the active tasks before removing this member."
            );
        }

        // ----------------------------------------------------
        // PERMISSION ERROR
        // ----------------------------------------------------

        if (
            code === "FORBIDDEN" ||
            code === "UNAUTHORIZED" ||
            code === "INSUFFICIENT_PERMISSION"
        ) {
            return "You do not have permission to remove this team member.";
        }

        // ----------------------------------------------------
        // VALIDATION ERROR
        // ----------------------------------------------------

        if (
            code === "INVALID_TEAM_ID"
        ) {
            return "The team ID is invalid.";
        }

        if (
            code === "INVALID_MEMBER_ID"
        ) {
            return "The member ID is invalid.";
        }

        // ----------------------------------------------------
        // BACKEND MESSAGE
        // ----------------------------------------------------

        if (
            typeof responseData?.message ===
            "string" &&
            responseData.message.trim()
        ) {
            return responseData.message;
        }

        // ----------------------------------------------------
        // ERROR MESSAGE
        // ----------------------------------------------------

        if (
            typeof backendError?.message ===
            "string" &&
            backendError.message.trim()
        ) {
            return backendError.message;
        }

        // ----------------------------------------------------
        // DEFAULT
        // ----------------------------------------------------

        return (
            "Unable to remove the member from the team. " +
            "Please try again."
        );
    };

    // ========================================================
    // CONFIRM REMOVE
    // ========================================================

    const handleConfirm = async () => {
        // ----------------------------------------------------
        // PREVENT DUPLICATE REQUEST
        // ----------------------------------------------------

        if (loading) {
            return;
        }

        // ----------------------------------------------------
        // CLEAR PREVIOUS STATE
        // ----------------------------------------------------

        setError("");
        setSuccessMessage("");

        // ----------------------------------------------------
        // VALIDATE TEAM
        // ----------------------------------------------------

        if (!teamId) {
            setError(
                "Team ID is missing. Unable to remove member."
            );

            return;
        }

        // ----------------------------------------------------
        // VALIDATE MEMBER
        // ----------------------------------------------------

        if (!memberId) {
            setError(
                "Member ID is missing. Unable to remove member."
            );

            return;
        }

        // ----------------------------------------------------
        // START BACKEND REQUEST
        // ----------------------------------------------------

        try {
            setRemoving(true);

            // =================================================
            // BACKEND OPERATION
            // =================================================
            //
            // Existing teamService backend operation:
            //
            // removeMemberFromTeam(teamId, memberId)
            //
            // =================================================

            const result =
                await removeMemberFromTeam(
                    teamId,
                    memberId
                );

            // =================================================
            // HANDLE EXPLICIT FAILURE RESULT
            // =================================================
            //
            // Some service implementations return:
            //
            // {
            //     success: false,
            //     code: "...",
            //     message: "..."
            // }
            //
            // =================================================

            if (
                result &&
                result.success === false
            ) {
                const code =
                    result.code ||
                    result.errorCode ||
                    "";

                // ---------------------------------------------
                // ACTIVE TASKS
                // ---------------------------------------------

                if (
                    code ===
                    "MEMBER_HAS_ACTIVE_TASKS"
                ) {
                    setError(
                        `${memberName} has active assigned tasks. Reassign the active tasks before removing this member.`
                    );

                    return;
                }

                // ---------------------------------------------
                // MEMBER NOT IN TEAM
                // ---------------------------------------------

                if (
                    code ===
                    "MEMBER_NOT_IN_TEAM"
                ) {
                    setError(
                        `${memberName} is no longer a member of ${teamName}.`
                    );

                    return;
                }

                // ---------------------------------------------
                // GENERAL RESULT ERROR
                // ---------------------------------------------

                setError(
                    result.message ||
                        "Unable to remove the member from the team."
                );

                return;
            }

            // =================================================
            // SUCCESS
            // =================================================

            setSuccessMessage(
                result?.message ||
                    `${memberName} was removed from ${teamName} successfully.`
            );

            // -------------------------------------------------
            // NOTIFY PARENT
            // -------------------------------------------------
            //
            // IMPORTANT:
            // Backend removal has already succeeded.
            //
            // The parent should only update/refresh its UI.
            //
            // Do NOT call removeMemberFromTeam() again
            // inside the parent onConfirm.
            // -------------------------------------------------

            if (
                typeof onConfirm ===
                "function"
            ) {
                await onConfirm(
                    member,
                    team,
                    result
                );
            }

            // -------------------------------------------------
            // CLOSE AFTER SUCCESS
            // -------------------------------------------------

            // Small delay allows the success message to be
            // visible before the dialog closes.
            await new Promise(
                (resolve) => {
                    setTimeout(
                        resolve,
                        500
                    );
                }
            );

            if (
                typeof onCancel ===
                "function"
            ) {
                onCancel();
            }
        } catch (backendError) {
            console.error(
                "Unable to remove team member:",
                backendError
            );

            setError(
                getBackendErrorMessage(
                    backendError
                )
            );
        } finally {
            setRemoving(false);
        }
    };

    // ========================================================
    // CANCEL
    // ========================================================

    const handleCancel = () => {
        if (loading) {
            return;
        }

        setError("");
        setSuccessMessage("");

        if (
            typeof onCancel ===
            "function"
        ) {
            onCancel();
        }
    };

    // ========================================================
    // RETURN
    // ========================================================

    return (
        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-black/60
                p-4
                backdrop-blur-sm
            "
            role="dialog"
            aria-modal="true"
            aria-labelledby="remove-member-title"
            aria-describedby="remove-member-description"
        >
            <div
                className="
                    w-full
                    max-w-md
                    overflow-hidden
                    rounded-2xl
                    border
                    border-blue-800
                    bg-[#0f2747]
                    shadow-2xl
                    shadow-black/40
                "
            >
                {/* ==================================================
                    HEADER
                ================================================== */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        border-b
                        border-blue-800
                        bg-blue-950/70
                        px-5
                        py-4
                    "
                >
                    <div className="flex items-center gap-3">
                        <div
                            className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-red-500/30
                                bg-red-500/10
                                text-red-400
                            "
                        >
                            <AlertTriangle size={20} />
                        </div>

                        <div>
                            <h2
                                id="remove-member-title"
                                className="
                                    text-base
                                    font-bold
                                    text-white
                                "
                            >
                                Remove Member
                            </h2>

                            <p
                                className="
                                    mt-0.5
                                    text-xs
                                    text-blue-300
                                "
                            >
                                Confirm team membership removal
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={loading}
                        className="
                            rounded-lg
                            p-2
                            text-blue-300
                            transition-all
                            duration-200
                            hover:bg-blue-800
                            hover:text-white
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                        title="Close"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* ==================================================
                    BODY
                ================================================== */}

                <div className="p-5">
                    {/* ==================================================
                        SUCCESS
                    ================================================== */}

                    {successMessage && (
                        <div
                            className="
                                mb-4
                                flex
                                items-start
                                gap-3
                                rounded-xl
                                border
                                border-emerald-500/30
                                bg-emerald-500/10
                                px-4
                                py-3
                            "
                        >
                            <CheckCircle2
                                size={18}
                                className="
                                    mt-0.5
                                    shrink-0
                                    text-emerald-400
                                "
                            />

                            <p
                                className="
                                    text-xs
                                    leading-5
                                    text-emerald-200
                                "
                            >
                                {successMessage}
                            </p>
                        </div>
                    )}

                    {/* ==================================================
                        ERROR
                    ================================================== */}

                    {error && (
                        <div
                            className="
                                mb-4
                                flex
                                items-start
                                gap-3
                                rounded-xl
                                border
                                border-red-500/30
                                bg-red-500/10
                                px-4
                                py-3
                            "
                        >
                            <AlertTriangle
                                size={18}
                                className="
                                    mt-0.5
                                    shrink-0
                                    text-red-400
                                "
                            />

                            <p
                                className="
                                    text-xs
                                    leading-5
                                    text-red-200
                                "
                            >
                                {error}
                            </p>
                        </div>
                    )}

                    {/* ==================================================
                        MEMBER INFORMATION
                    ================================================== */}

                    <div
                        className="
                            mb-4
                            rounded-xl
                            border
                            border-blue-800/70
                            bg-blue-950/40
                            p-4
                        "
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className="
                                    flex
                                    h-11
                                    w-11
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-blue-800
                                    text-blue-200
                                "
                            >
                                <UserRound size={20} />
                            </div>

                            <div className="min-w-0">
                                <p
                                    className="
                                        truncate
                                        text-sm
                                        font-bold
                                        text-white
                                    "
                                >
                                    {memberName}
                                </p>

                                <p
                                    className="
                                        mt-1
                                        truncate
                                        text-xs
                                        text-blue-300
                                    "
                                >
                                    {memberEmail ||
                                        "Team member"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ==================================================
                        CONFIRMATION MESSAGE
                    ================================================== */}

                    <p
                        id="remove-member-description"
                        className="
                            text-sm
                            leading-6
                            text-blue-100
                        "
                    >
                        Are you sure you want to remove{" "}
                        <span className="font-bold text-white">
                            {memberName}
                        </span>{" "}
                        from{" "}
                        <span className="font-bold text-white">
                            {teamName}
                        </span>
                        ?
                    </p>

                    {/* ==================================================
                        WARNING
                    ================================================== */}

                    <div
                        className="
                            mt-4
                            rounded-xl
                            border
                            border-amber-500/30
                            bg-amber-500/10
                            px-4
                            py-3
                        "
                    >
                        <div className="flex items-start gap-2">
                            <AlertTriangle
                                size={16}
                                className="
                                    mt-0.5
                                    shrink-0
                                    text-amber-400
                                "
                            />

                            <p
                                className="
                                    text-xs
                                    leading-5
                                    text-amber-200
                                "
                            >
                                If this member has active
                                assigned tasks, those tasks
                                must be reassigned before the
                                member can be removed.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ==================================================
                    FOOTER
                ================================================== */}

                <div
                    className="
                        flex
                        flex-col-reverse
                        gap-2
                        border-t
                        border-blue-800
                        bg-blue-950/60
                        px-5
                        py-4
                        sm:flex-row
                        sm:justify-end
                    "
                >
                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={loading}
                        className="
                            rounded-lg
                            border
                            border-blue-700
                            bg-blue-900
                            px-4
                            py-2
                            text-xs
                            font-semibold
                            text-blue-200
                            transition-all
                            duration-200
                            hover:border-blue-400
                            hover:bg-blue-800
                            hover:text-white
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        <span className="inline-flex items-center">
                            <X
                                size={15}
                                className="mr-1.5"
                            />

                            Cancel
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={loading}
                        className="
                            rounded-lg
                            border
                            border-red-700
                            bg-red-950/60
                            px-4
                            py-2
                            text-xs
                            font-semibold
                            text-red-300
                            transition-all
                            duration-200
                            hover:border-red-400
                            hover:bg-red-800
                            hover:text-white
                            hover:shadow-lg
                            hover:shadow-red-500/20
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        <span className="inline-flex items-center">
                            {loading ? (
                                <>
                                    <Loader2
                                        size={15}
                                        className="
                                            mr-1.5
                                            animate-spin
                                        "
                                    />

                                    Removing...
                                </>
                            ) : (
                                <>
                                    <UserRound
                                        size={15}
                                        className="mr-1.5"
                                    />

                                    Remove Member
                                </>
                            )}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RemoveMemberDialog;