import {
    X,
    UsersRound,
    UserRound,
    Mail,
    ShieldCheck,
    Trash2,
} from "lucide-react";

// ============================================================
// TEAM MEMBERS MODAL
// ============================================================
// Purpose:
// - Display all members belonging to a team
// - Show member name, email and role
// - Trigger backend-connected member removal through
//   onRemoveMember
//
// IMPORTANT:
// The API call remains in the parent/use-case layer.
// This component only triggers:
//     onRemoveMember(member, team)
//
// Supported backend field formats:
// Id / id
// UserId / userId
// Name / name
// FullName / fullName
// Username / username
// Email / email
// Role / role
// UserRole / userRole
// ============================================================


// ============================================================
// HELPERS
// ============================================================

const getMemberId = (member) => {
    if (!member) {
        return null;
    }

    if (typeof member === "string") {
        return member;
    }

    return (
        member.id ??
        member.Id ??
        member.userId ??
        member.UserId ??
        member.userID ??
        member.UserID ??
        member._id ??
        null
    );
};


const getMemberName = (member) => {
    if (!member) {
        return "Unknown User";
    }

    if (typeof member === "string") {
        return member;
    }

    return (
        member.name ||
        member.Name ||
        member.fullName ||
        member.FullName ||
        member.username ||
        member.Username ||
        member.userName ||
        member.UserName ||
        member.email ||
        member.Email ||
        "Unknown User"
    );
};


const getMemberEmail = (member) => {
    if (!member || typeof member !== "object") {
        return "";
    }

    return (
        member.email ||
        member.Email ||
        member.emailAddress ||
        member.EmailAddress ||
        member.userEmail ||
        member.UserEmail ||
        member.mail ||
        member.Mail ||
        ""
    );
};


const getMemberRole = (member) => {
    if (!member || typeof member !== "object") {
        return "Contributor";
    }

    const role =
        member.role ||
        member.Role ||
        member.userRole ||
        member.UserRole ||
        member.type ||
        member.Type ||
        member.contributorType ||
        member.ContributorType ||
        "Contributor";

    return String(role).trim() || "Contributor";
};


const getTeamId = (team) => {
    if (!team) {
        return null;
    }

    return (
        team.id ??
        team.Id ??
        team.teamId ??
        team.TeamId ??
        team._id ??
        null
    );
};


const getTeamName = (team) => {
    if (!team) {
        return "Unnamed Team";
    }

    return (
        team.name ||
        team.Name ||
        team.teamName ||
        team.TeamName ||
        "Unnamed Team"
    );
};


const normalizeMembers = (members) => {
    if (!Array.isArray(members)) {
        return [];
    }

    return members.filter(Boolean);
};


// ============================================================
// MAIN COMPONENT
// ============================================================

function TeamMembersModal({
    open = false,
    team = null,
    members = [],
    onClose,
    onRemoveMember,
    loading = false,
}) {
    // ========================================================
    // CLOSED STATE
    // ========================================================

    if (!open || !team) {
        return null;
    }

    // ========================================================
    // NORMALIZED DATA
    // ========================================================

    const teamName = getTeamName(team);

    const teamId = getTeamId(team);

    const safeMembers = normalizeMembers(members);

    // ========================================================
    // REMOVE MEMBER
    // ========================================================
    // The actual backend request remains in the parent.
    //
    // Expected parent flow:
    //
    // const handleRemoveMember = async (member, team) => {
    //     await removeMemberFromTeam(
    //         getTeamId(team),
    //         getMemberId(member)
    //     );
    //
    //     // refresh teams / members
    // };
    // ========================================================

    const handleRemoveMember = async (member) => {
        if (loading) {
            return;
        }

        if (!member) {
            return;
        }

        const memberId = getMemberId(member);

        if (!memberId) {
            console.error(
                "Unable to remove member: Member ID is missing.",
                member
            );

            return;
        }

        if (!teamId) {
            console.error(
                "Unable to remove member: Team ID is missing.",
                team
            );

            return;
        }

        if (typeof onRemoveMember !== "function") {
            console.error(
                "TeamMembersModal: onRemoveMember callback is not provided."
            );

            return;
        }

        await onRemoveMember(member, team);
    };

    // ========================================================
    // CLOSE
    // ========================================================

    const handleClose = () => {
        if (loading) {
            return;
        }

        if (typeof onClose === "function") {
            onClose();
        }
    };

    // ========================================================
    // KEYBOARD ACCESSIBILITY
    // ========================================================

    const handleBackdropClick = (event) => {
        if (event.target !== event.currentTarget) {
            return;
        }

        handleClose();
    };

    // ========================================================
    // RENDER
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
                bg-black/70
                p-4
                backdrop-blur-sm
            "
            role="dialog"
            aria-modal="true"
            aria-labelledby="team-members-title"
            onMouseDown={handleBackdropClick}
        >
            <div
                className="
                    flex
                    w-full
                    max-w-3xl
                    flex-col
                    overflow-hidden
                    rounded-2xl
                    border
                    border-border
                    bg-background
                    text-foreground
                    shadow-2xl
                "
                onMouseDown={(event) => {
                    event.stopPropagation();
                }}
            >
                {/* ====================================================
                    HEADER
                ==================================================== */}

                <div
                    className="
                        flex
                        shrink-0
                        items-center
                        justify-between
                        border-b
                        border-border
                        bg-card
                        px-6
                        py-5
                    "
                >
                    <div
                        className="
                            flex
                            min-w-0
                            items-center
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
                                border
                                border-primary/20
                                bg-primary/10
                                text-primary
                                shadow-sm
                            "
                        >
                            <UsersRound size={21} />
                        </div>

                        <div className="min-w-0">
                            <h2
                                id="team-members-title"
                                className="
                                    truncate
                                    text-lg
                                    font-bold
                                    text-foreground
                                "
                                title={teamName}
                            >
                                {teamName}
                            </h2>

                            <p
                                className="
                                    mt-1
                                    text-xs
                                    text-muted-foreground
                                "
                            >
                                Team Members
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={loading}
                        className="
                            rounded-lg
                            border
                            border-border
                            bg-background
                            p-2
                            text-muted-foreground
                            transition-all
                            duration-300
                            hover:border-primary/50
                            hover:bg-primary/10
                            hover:text-primary
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                        title="Close"
                        aria-label="Close team members"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* ====================================================
                    TEAM SUMMARY
                ==================================================== */}

                <div
                    className="
                        shrink-0
                        border-b
                        border-border
                        bg-muted/30
                        px-6
                        py-3
                    "
                >
                    <div
                        className="
                            flex
                            flex-wrap
                            items-center
                            justify-between
                            gap-3
                        "
                    >
                        <p
                            className="
                                text-sm
                                text-muted-foreground
                            "
                        >
                            <span
                                className="
                                    font-bold
                                    text-foreground
                                "
                            >
                                {safeMembers.length}
                            </span>{" "}
                            {safeMembers.length === 1
                                ? "member"
                                : "members"}
                        </p>

                        {teamId && (
                            <p
                                className="
                                    text-[11px]
                                    font-medium
                                    text-muted-foreground
                                "
                            >
                                Team ID:{" "}
                                <span className="font-semibold text-foreground">
                                    {String(teamId)}
                                </span>
                            </p>
                        )}
                    </div>
                </div>

                {/* ====================================================
                    MEMBERS LIST
                ==================================================== */}

                <div
                    className="
                        max-h-[55vh]
                        overflow-y-auto
                        bg-background
                        p-6
                    "
                >
                    {safeMembers.length > 0 ? (
                        <div className="space-y-3">
                            {safeMembers.map(
                                (member, index) => {
                                    const memberId =
                                        getMemberId(member);

                                    const memberName =
                                        getMemberName(member);

                                    const memberEmail =
                                        getMemberEmail(member);

                                    const memberRole =
                                        getMemberRole(member);

                                    const memberKey =
                                        memberId
                                            ? String(memberId)
                                            : `${memberName}-${index}`;

                                    return (
                                        <div
                                            key={memberKey}
                                            className="
                                                group
                                                flex
                                                flex-col
                                                gap-4
                                                rounded-xl
                                                border
                                                border-border
                                                bg-card
                                                p-4
                                                transition-all
                                                duration-300
                                                hover:-translate-y-0.5
                                                hover:border-primary/40
                                                hover:bg-muted/40
                                                hover:shadow-md
                                                sm:flex-row
                                                sm:items-center
                                                sm:justify-between
                                            "
                                        >
                                            {/* MEMBER INFORMATION */}

                                            <div
                                                className="
                                                    flex
                                                    min-w-0
                                                    items-center
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
                                                        rounded-full
                                                        border
                                                        border-primary/20
                                                        bg-primary/10
                                                        text-primary
                                                    "
                                                >
                                                    <UserRound
                                                        size={19}
                                                    />
                                                </div>

                                                <div className="min-w-0">
                                                    <p
                                                        className="
                                                            truncate
                                                            text-sm
                                                            font-bold
                                                            text-foreground
                                                        "
                                                        title={
                                                            memberName
                                                        }
                                                    >
                                                        {
                                                            memberName
                                                        }
                                                    </p>

                                                    {memberEmail ? (
                                                        <div
                                                            className="
                                                                mt-1
                                                                flex
                                                                min-w-0
                                                                items-center
                                                                gap-2
                                                            "
                                                        >
                                                            <Mail
                                                                size={
                                                                    12
                                                                }
                                                                className="
                                                                    shrink-0
                                                                    text-primary
                                                                "
                                                            />

                                                            <span
                                                                className="
                                                                    truncate
                                                                    text-xs
                                                                    text-muted-foreground
                                                                "
                                                                title={
                                                                    memberEmail
                                                                }
                                                            >
                                                                {
                                                                    memberEmail
                                                                }
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <p
                                                            className="
                                                                mt-1
                                                                text-xs
                                                                text-muted-foreground
                                                            "
                                                        >
                                                            No email
                                                            available
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* MEMBER ACTIONS */}

                                            <div
                                                className="
                                                    flex
                                                    shrink-0
                                                    flex-wrap
                                                    items-center
                                                    justify-end
                                                    gap-2
                                                "
                                            >
                                                <span
                                                    className="
                                                        inline-flex
                                                        items-center
                                                        gap-1.5
                                                        rounded-full
                                                        border
                                                        border-violet-500/30
                                                        bg-violet-500/10
                                                        px-3
                                                        py-1.5
                                                        text-xs
                                                        font-semibold
                                                        text-violet-600
                                                        dark:text-violet-400
                                                    "
                                                >
                                                    <ShieldCheck
                                                        size={13}
                                                    />

                                                    {
                                                        memberRole
                                                    }
                                                </span>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleRemoveMember(
                                                            member
                                                        )
                                                    }
                                                    disabled={
                                                        loading
                                                    }
                                                    className="
                                                        inline-flex
                                                        items-center
                                                        gap-1.5
                                                        rounded-lg
                                                        border
                                                        border-destructive/30
                                                        bg-destructive/10
                                                        px-3
                                                        py-2
                                                        text-xs
                                                        font-semibold
                                                        text-destructive
                                                        transition-all
                                                        duration-300
                                                        hover:-translate-y-0.5
                                                        hover:border-destructive/60
                                                        hover:bg-destructive/20
                                                        hover:shadow-md
                                                        disabled:cursor-not-allowed
                                                        disabled:opacity-50
                                                    "
                                                    title="Remove member"
                                                >
                                                    <Trash2
                                                        size={14}
                                                    />

                                                    {loading
                                                        ? "Removing..."
                                                        : "Remove"}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    ) : (
                        /* ==================================================
                            EMPTY STATE
                        ================================================== */

                        <div
                            className="
                                rounded-xl
                                border
                                border-dashed
                                border-border
                                bg-card
                                px-5
                                py-12
                                text-center
                            "
                        >
                            <UsersRound
                                size={40}
                                className="
                                    mx-auto
                                    mb-3
                                    text-muted-foreground
                                "
                            />

                            <p
                                className="
                                    text-sm
                                    font-bold
                                    text-foreground
                                "
                            >
                                No team members
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-xs
                                    text-muted-foreground
                                "
                            >
                                This team currently has
                                no members.
                            </p>
                        </div>
                    )}
                </div>

                {/* ====================================================
                    FOOTER
                ==================================================== */}

                <div
                    className="
                        flex
                        shrink-0
                        justify-end
                        border-t
                        border-border
                        bg-card
                        px-6
                        py-4
                    "
                >
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={loading}
                        className="
                            rounded-lg
                            border
                            border-border
                            bg-background
                            px-4
                            py-2
                            text-sm
                            font-semibold
                            text-muted-foreground
                            transition-all
                            duration-300
                            hover:border-primary/50
                            hover:bg-primary/10
                            hover:text-primary
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TeamMembersModal;