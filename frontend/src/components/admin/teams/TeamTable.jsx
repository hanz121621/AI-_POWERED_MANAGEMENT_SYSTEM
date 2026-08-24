
import {
    UsersRound,
    UserRound,
    Edit,
    Trash2,
    UserPlus,
    Eye,
    UserCog,
} from "lucide-react";

// ============================================================
// TEAM TABLE
//
// RESPONSIBILITY
// ------------------------------------------------------------
// This component is responsible only for:
// - Displaying teams
// - Searching/filtering teams
// - Triggering parent callbacks
// - Displaying team information
//
// Backend/service operations remain in TeamManagement.jsx
// and teamService.js.
//
// Supported callbacks:
// - onViewDetails
// - onViewMembers
// - onAddMembers
// - onAssignManager
// - onEdit
// - onDelete
// ============================================================

// ============================================================
// HELPERS
// ============================================================

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

// ------------------------------------------------------------

const getTeamName = (team) => {
    if (!team) {
        return "Unnamed Team";
    }

    return (
        team.name ??
        team.Name ??
        team.teamName ??
        team.TeamName ??
        "Unnamed Team"
    );
};

// ------------------------------------------------------------

const getTeamDescription = (team) => {
    if (!team) {
        return "No description provided.";
    }

    return (
        team.description ??
        team.Description ??
        "No description provided."
    );
};

// ------------------------------------------------------------

const getManagerName = (team) => {
    if (!team) {
        return "Not assigned";
    }

    // Object manager
    if (
        typeof team.manager === "object" &&
        team.manager !== null
    ) {
        return (
            team.manager.name ??
            team.manager.fullName ??
            team.manager.username ??
            team.manager.email ??
            "Not assigned"
        );
    }

    if (
        typeof team.Manager === "object" &&
        team.Manager !== null
    ) {
        return (
            team.Manager.Name ??
            team.Manager.FullName ??
            team.Manager.Username ??
            team.Manager.Email ??
            "Not assigned"
        );
    }

    return (
        team.managerName ??
        team.ManagerName ??
        team.manager ??
        team.Manager ??
        "Not assigned"
    );
};

// ------------------------------------------------------------

const getManagerId = (team) => {
    if (!team) {
        return null;
    }

    return (
        team.managerId ??
        team.ManagerId ??
        team.manager?.id ??
        team.manager?.Id ??
        team.Manager?.id ??
        team.Manager?.Id ??
        null
    );
};

// ------------------------------------------------------------

const getIsActive = (team) => {
    if (!team) {
        return false;
    }

    if (typeof team.isActive === "boolean") {
        return team.isActive;
    }

    if (typeof team.IsActive === "boolean") {
        return team.IsActive;
    }

    const status = String(
        team.status ??
        team.Status ??
        ""
    )
        .trim()
        .toLowerCase();

    if (status === "active") {
        return true;
    }

    if (
        status === "inactive" ||
        status === "disabled" ||
        status === "archived"
    ) {
        return false;
    }

    return Boolean(
        team.isActive ??
        team.IsActive ??
        false
    );
};

// ------------------------------------------------------------

const getMembers = (team) => {
    if (!team) {
        return [];
    }

    if (Array.isArray(team.members)) {
        return team.members;
    }

    if (Array.isArray(team.Members)) {
        return team.Members;
    }

    return [];
};

// ------------------------------------------------------------

const getMemberCount = (team) => {
    if (!team) {
        return 0;
    }

    const backendCount =
        team.memberCount ??
        team.MemberCount;

    if (
        backendCount !== undefined &&
        backendCount !== null
    ) {
        const parsedCount = Number(
            backendCount
        );

        if (!Number.isNaN(parsedCount)) {
            return parsedCount;
        }
    }

    return getMembers(team).length;
};

// ------------------------------------------------------------

const getMemberRole = (member) => {
    if (!member || typeof member !== "object") {
        return "";
    }

    return String(
        member.role ??
        member.Role ??
        member.userRole ??
        member.UserRole ??
        member.type ??
        member.Type ??
        member.contributorType ??
        member.ContributorType ??
        ""
    )
        .trim()
        .toLowerCase();
};

// ------------------------------------------------------------

const getDeveloperCount = (team) => {
    if (!team) {
        return 0;
    }

    const backendCount =
        team.developerCount ??
        team.DeveloperCount;

    if (
        backendCount !== undefined &&
        backendCount !== null
    ) {
        const parsedCount = Number(
            backendCount
        );

        if (!Number.isNaN(parsedCount)) {
            return parsedCount;
        }
    }

    return getMembers(team).filter(
        (member) => {
            const role =
                getMemberRole(member);

            return (
                role === "developer" ||
                role === "developers"
            );
        }
    ).length;
};

// ------------------------------------------------------------

const getStaffCount = (team) => {
    if (!team) {
        return 0;
    }

    const backendCount =
        team.staffCount ??
        team.StaffCount;

    if (
        backendCount !== undefined &&
        backendCount !== null
    ) {
        const parsedCount = Number(
            backendCount
        );

        if (!Number.isNaN(parsedCount)) {
            return parsedCount;
        }
    }

    return getMembers(team).filter(
        (member) => {
            const role =
                getMemberRole(member);

            return (
                role === "staff" ||
                role === "support staff"
            );
        }
    ).length;
};

// ------------------------------------------------------------

const getStatusLabel = (team) => {
    if (!team) {
        return "Inactive";
    }

    const status =
        team.status ??
        team.Status;

    if (status) {
        return String(status);
    }

    return getIsActive(team)
        ? "Active"
        : "Inactive";
};

// ============================================================
// TEAM TABLE
// ============================================================

function TeamTable({
    teams = [],
    searchTerm = "",

    // Existing actions
    onEdit,
    onDelete,
    onAddMembers,
    onViewMembers,
    onViewDetails,

    // Team management use case
    onAssignManager,

    // Parent-controlled loading state
    loading = false,
}) {
    // ========================================================
    // SEARCH TERM
    // ========================================================

    const search = String(
        searchTerm || ""
    )
        .toLowerCase()
        .trim();

    // ========================================================
    // FILTER TEAMS
    // ========================================================

    const safeTeams = Array.isArray(teams)
        ? teams
        : [];

    const filteredTeams = safeTeams.filter(
        (team) => {
            if (!team) {
                return false;
            }

            const teamName =
                getTeamName(team).toLowerCase();

            const managerName =
                getManagerName(team).toLowerCase();

            const description =
                getTeamDescription(team).toLowerCase();

            const status =
                getStatusLabel(team).toLowerCase();

            return (
                teamName.includes(search) ||
                managerName.includes(search) ||
                description.includes(search) ||
                status.includes(search)
            );
        }
    );

    // ========================================================
    // CALLBACK HANDLERS
    //
    // IMPORTANT:
    // No backend calls are made here.
    //
    // TeamManagement.jsx receives these callbacks and calls
    // the appropriate teamService operation.
    // ========================================================

    const handleViewDetails = (team) => {
        if (!team || loading) {
            return;
        }

        if (
            typeof onViewDetails ===
            "function"
        ) {
            onViewDetails(team);
            return;
        }

        // Backward-compatible fallback
        if (
            typeof onViewMembers ===
            "function"
        ) {
            onViewMembers(team);
        }
    };

    // --------------------------------------------------------

    const handleViewMembers = (team) => {
        if (!team || loading) {
            return;
        }

        if (
            typeof onViewMembers ===
            "function"
        ) {
            onViewMembers(team);
        }
    };

    // --------------------------------------------------------

    const handleAddMembers = (team) => {
        if (!team || loading) {
            return;
        }

        if (
            typeof onAddMembers ===
            "function"
        ) {
            onAddMembers(team);
        }
    };

    // --------------------------------------------------------

    const handleAssignManager = (team) => {
        if (!team || loading) {
            return;
        }

        if (
            typeof onAssignManager ===
            "function"
        ) {
            onAssignManager(team);
        }
    };

    // --------------------------------------------------------

    const handleEdit = (team) => {
        if (!team || loading) {
            return;
        }

        if (
            typeof onEdit ===
            "function"
        ) {
            onEdit(team);
        }
    };

    // --------------------------------------------------------

    const handleDelete = (team) => {
        if (!team || loading) {
            return;
        }

        if (
            typeof onDelete ===
            "function"
        ) {
            onDelete(team);
        }
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="bg-background p-5 text-foreground">
            {/* ====================================================
                LOADING STATE
            ==================================================== */}

            {loading && (
                <div
                    className="
                        mb-4
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        border
                        border-primary/20
                        bg-primary/5
                        px-4
                        py-3
                        text-sm
                        text-primary
                    "
                >
                    <div
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

                    <span>
                        Updating team information...
                    </span>
                </div>
            )}

            {/* ====================================================
                TEAMS
            ==================================================== */}

            {filteredTeams.length > 0 ? (
                <div
                    className="
                        grid
                        grid-cols-1
                        gap-5
                        lg:grid-cols-2
                        xl:grid-cols-3
                    "
                >
                    {filteredTeams.map(
                        (team, index) => {
                            // ==================================================
                            // TEAM DATA
                            // ==================================================

                            const teamId =
                                getTeamId(team);

                            const teamName =
                                getTeamName(team);

                            const description =
                                getTeamDescription(
                                    team
                                );

                            const managerName =
                                getManagerName(team);

                            const managerId =
                                getManagerId(team);

                            const memberCount =
                                getMemberCount(
                                    team
                                );

                            const developerCount =
                                getDeveloperCount(
                                    team
                                );

                            const staffCount =
                                getStaffCount(
                                    team
                                );

                            const isActive =
                                getIsActive(team);

                            const statusLabel =
                                getStatusLabel(
                                    team
                                );

                            const teamKey =
                                teamId ??
                                `${teamName}-${index}`;

                            return (
                                <div
                                    key={String(
                                        teamKey
                                    )}
                                    className="
                                        group
                                        overflow-hidden
                                        rounded-2xl
                                        border
                                        border-border
                                        bg-card
                                        text-card-foreground
                                        shadow-sm
                                        transition-all
                                        duration-300
                                        hover:-translate-y-1
                                        hover:border-primary/40
                                        hover:shadow-xl
                                    "
                                >
                                    {/* ==================================================
                                        HEADER
                                    ================================================== */}

                                    <div
                                        className="
                                            border-b
                                            border-border
                                            bg-muted/40
                                            px-5
                                            py-4
                                        "
                                    >
                                        <div
                                            className="
                                                flex
                                                items-start
                                                justify-between
                                                gap-3
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
                                                        transition-all
                                                        duration-300
                                                        group-hover:border-primary/50
                                                        group-hover:bg-primary/20
                                                        group-hover:shadow-md
                                                    "
                                                >
                                                    <UsersRound
                                                        size={
                                                            21
                                                        }
                                                    />
                                                </div>

                                                <div className="min-w-0">
                                                    <h3
                                                        className="
                                                            truncate
                                                            text-base
                                                            font-bold
                                                            text-foreground
                                                        "
                                                        title={
                                                            teamName
                                                        }
                                                    >
                                                        {
                                                            teamName
                                                        }
                                                    </h3>

                                                    <p
                                                        className="
                                                            mt-1
                                                            text-xs
                                                            text-muted-foreground
                                                        "
                                                    >
                                                        Team
                                                    </p>
                                                </div>
                                            </div>

                                            {/* STATUS */}

                                            {isActive ? (
                                                <span
                                                    className="
                                                        inline-flex
                                                        shrink-0
                                                        items-center
                                                        gap-1.5
                                                        rounded-full
                                                        border
                                                        border-emerald-500/30
                                                        bg-emerald-500/10
                                                        px-2.5
                                                        py-1
                                                        text-xs
                                                        font-semibold
                                                        text-emerald-600
                                                        dark:text-emerald-400
                                                    "
                                                >
                                                    <span
                                                        className="
                                                            h-1.5
                                                            w-1.5
                                                            rounded-full
                                                            bg-emerald-500
                                                        "
                                                    />

                                                    {
                                                        statusLabel
                                                    }
                                                </span>
                                            ) : (
                                                <span
                                                    className="
                                                        inline-flex
                                                        shrink-0
                                                        items-center
                                                        gap-1.5
                                                        rounded-full
                                                        border
                                                        border-muted-foreground/30
                                                        bg-muted
                                                        px-2.5
                                                        py-1
                                                        text-xs
                                                        font-semibold
                                                        text-muted-foreground
                                                    "
                                                >
                                                    <span
                                                        className="
                                                            h-1.5
                                                            w-1.5
                                                            rounded-full
                                                            bg-muted-foreground
                                                        "
                                                    />

                                                    {
                                                        statusLabel
                                                    }
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* ==================================================
                                        INFORMATION
                                    ================================================== */}

                                    <div className="p-5">
                                        {/* DESCRIPTION */}

                                        <div
                                            className="
                                                mb-4
                                                rounded-xl
                                                border
                                                border-border
                                                bg-muted/30
                                                p-4
                                                transition-all
                                                duration-300
                                                hover:border-primary/40
                                                hover:bg-muted/50
                                            "
                                        >
                                            <p
                                                className="
                                                    text-[11px]
                                                    font-semibold
                                                    uppercase
                                                    tracking-wide
                                                    text-muted-foreground
                                                "
                                            >
                                                Description
                                            </p>

                                            <p
                                                className="
                                                    mt-2
                                                    line-clamp-2
                                                    text-sm
                                                    text-foreground
                                                "
                                                title={
                                                    description
                                                }
                                            >
                                                {
                                                    description
                                                }
                                            </p>
                                        </div>

                                        {/* MANAGER + MEMBERS */}

                                        <div
                                            className="
                                                grid
                                                grid-cols-1
                                                gap-3
                                                sm:grid-cols-2
                                            "
                                        >
                                            {/* MANAGER */}

                                            <div
                                                className="
                                                    rounded-xl
                                                    border
                                                    border-border
                                                    bg-muted/30
                                                    p-4
                                                    transition-all
                                                    duration-300
                                                    hover:border-primary/40
                                                    hover:bg-muted/50
                                                "
                                            >
                                                <div
                                                    className="
                                                        flex
                                                        items-center
                                                        gap-2
                                                        text-primary
                                                    "
                                                >
                                                    <UserRound
                                                        size={
                                                            17
                                                        }
                                                    />

                                                    <span
                                                        className="
                                                            text-[11px]
                                                            font-semibold
                                                            uppercase
                                                            tracking-wide
                                                        "
                                                    >
                                                        Manager
                                                    </span>
                                                </div>

                                                <p
                                                    className="
                                                        mt-2
                                                        truncate
                                                        text-sm
                                                        font-semibold
                                                        text-foreground
                                                    "
                                                    title={
                                                        managerName
                                                    }
                                                >
                                                    {
                                                        managerName
                                                    }
                                                </p>

                                                {managerId && (
                                                    <p
                                                        className="
                                                            mt-1
                                                            truncate
                                                            text-[10px]
                                                            text-muted-foreground
                                                        "
                                                        title={String(
                                                            managerId
                                                        )}
                                                    >
                                                        Manager ID:{" "}
                                                        {String(
                                                            managerId
                                                        )}
                                                    </p>
                                                )}
                                            </div>

                                            {/* MEMBERS */}

                                            <div
                                                className="
                                                    rounded-xl
                                                    border
                                                    border-border
                                                    bg-muted/30
                                                    p-4
                                                    transition-all
                                                    duration-300
                                                    hover:border-violet-500/40
                                                    hover:bg-violet-500/5
                                                "
                                            >
                                                <div
                                                    className="
                                                        flex
                                                        items-center
                                                        gap-2
                                                        text-violet-600
                                                        dark:text-violet-400
                                                    "
                                                >
                                                    <UsersRound
                                                        size={
                                                            17
                                                        }
                                                    />

                                                    <span
                                                        className="
                                                            text-[11px]
                                                            font-semibold
                                                            uppercase
                                                            tracking-wide
                                                        "
                                                    >
                                                        Members
                                                    </span>
                                                </div>

                                                <p
                                                    className="
                                                        mt-2
                                                        text-sm
                                                        font-semibold
                                                        text-foreground
                                                    "
                                                >
                                                    {
                                                        memberCount
                                                    }{" "}
                                                    {memberCount ===
                                                    1
                                                        ? "member"
                                                        : "members"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* ==================================================
                                            BREAKDOWN
                                        ================================================== */}

                                        <div
                                            className="
                                                mt-3
                                                grid
                                                grid-cols-2
                                                gap-3
                                            "
                                        >
                                            {/* DEVELOPERS */}

                                            <div
                                                className="
                                                    rounded-xl
                                                    border
                                                    border-border
                                                    bg-background
                                                    px-4
                                                    py-3
                                                    transition-all
                                                    duration-300
                                                    hover:border-primary/40
                                                    hover:shadow-sm
                                                "
                                            >
                                                <p
                                                    className="
                                                        text-[10px]
                                                        font-semibold
                                                        uppercase
                                                        tracking-wide
                                                        text-muted-foreground
                                                    "
                                                >
                                                    Developers
                                                </p>

                                                <p
                                                    className="
                                                        mt-1
                                                        text-lg
                                                        font-bold
                                                        text-foreground
                                                    "
                                                >
                                                    {
                                                        developerCount
                                                    }
                                                </p>
                                            </div>

                                            {/* STAFF */}

                                            <div
                                                className="
                                                    rounded-xl
                                                    border
                                                    border-border
                                                    bg-background
                                                    px-4
                                                    py-3
                                                    transition-all
                                                    duration-300
                                                    hover:border-primary/40
                                                    hover:shadow-sm
                                                "
                                            >
                                                <p
                                                    className="
                                                        text-[10px]
                                                        font-semibold
                                                        uppercase
                                                        tracking-wide
                                                        text-muted-foreground
                                                    "
                                                >
                                                    Staff
                                                </p>

                                                <p
                                                    className="
                                                        mt-1
                                                        text-lg
                                                        font-bold
                                                        text-foreground
                                                    "
                                                >
                                                    {
                                                        staffCount
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ==================================================
                                        ACTIONS
                                    ================================================== */}

                                    <div
                                        className="
                                            border-t
                                            border-border
                                            bg-muted/30
                                            px-5
                                            py-3
                                        "
                                    >
                                        <div
                                            className="
                                                flex
                                                flex-wrap
                                                items-center
                                                justify-end
                                                gap-2
                                            "
                                        >
                                            {/* VIEW */}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleViewDetails(
                                                        team
                                                    )
                                                }
                                                disabled={
                                                    loading
                                                }
                                                title="View Team Details"
                                                className="
                                                    inline-flex
                                                    cursor-pointer
                                                    items-center
                                                    gap-1.5
                                                    rounded-lg
                                                    border
                                                    border-blue-500/30
                                                    bg-blue-500/10
                                                    px-3
                                                    py-2
                                                    text-xs
                                                    font-semibold
                                                    text-blue-600
                                                    shadow-sm
                                                    transition-all
                                                    duration-300
                                                    hover:-translate-y-0.5
                                                    hover:border-blue-500/60
                                                    hover:bg-blue-500/20
                                                    hover:shadow-md
                                                    disabled:cursor-not-allowed
                                                    disabled:opacity-50
                                                    dark:text-blue-400
                                                "
                                            >
                                                <Eye
                                                    size={
                                                        15
                                                    }
                                                />

                                                View
                                            </button>

                                            {/* MEMBERS */}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleViewMembers(
                                                        team
                                                    )
                                                }
                                                disabled={
                                                    loading
                                                }
                                                title="View Team Members"
                                                className="
                                                    inline-flex
                                                    cursor-pointer
                                                    items-center
                                                    gap-1.5
                                                    rounded-lg
                                                    border
                                                    border-violet-500/30
                                                    bg-violet-500/10
                                                    px-3
                                                    py-2
                                                    text-xs
                                                    font-semibold
                                                    text-violet-600
                                                    shadow-sm
                                                    transition-all
                                                    duration-300
                                                    hover:-translate-y-0.5
                                                    hover:border-violet-500/60
                                                    hover:bg-violet-500/20
                                                    hover:shadow-md
                                                    disabled:cursor-not-allowed
                                                    disabled:opacity-50
                                                    dark:text-violet-400
                                                "
                                            >
                                                <UsersRound
                                                    size={
                                                        15
                                                    }
                                                />

                                                Members
                                            </button>

                                            {/* ADD MEMBERS */}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleAddMembers(
                                                        team
                                                    )
                                                }
                                                disabled={
                                                    loading
                                                }
                                                title="Add Members"
                                                className="
                                                    inline-flex
                                                    cursor-pointer
                                                    items-center
                                                    gap-1.5
                                                    rounded-lg
                                                    border
                                                    border-emerald-500/30
                                                    bg-emerald-500/10
                                                    px-3
                                                    py-2
                                                    text-xs
                                                    font-semibold
                                                    text-emerald-600
                                                    shadow-sm
                                                    transition-all
                                                    duration-300
                                                    hover:-translate-y-0.5
                                                    hover:border-emerald-500/60
                                                    hover:bg-emerald-500/20
                                                    hover:shadow-md
                                                    disabled:cursor-not-allowed
                                                    disabled:opacity-50
                                                    dark:text-emerald-400
                                                "
                                            >
                                                <UserPlus
                                                    size={
                                                        15
                                                    }
                                                />

                                                Add Members
                                            </button>

                                            {/* ASSIGN MANAGER */}

                                            {typeof onAssignManager ===
                                                "function" && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleAssignManager(
                                                            team
                                                        )
                                                    }
                                                    disabled={
                                                        loading
                                                    }
                                                    title="Assign Manager"
                                                    className="
                                                        inline-flex
                                                        cursor-pointer
                                                        items-center
                                                        gap-1.5
                                                        rounded-lg
                                                        border
                                                        border-cyan-500/30
                                                        bg-cyan-500/10
                                                        px-3
                                                        py-2
                                                        text-xs
                                                        font-semibold
                                                        text-cyan-600
                                                        shadow-sm
                                                        transition-all
                                                        duration-300
                                                        hover:-translate-y-0.5
                                                        hover:border-cyan-500/60
                                                        hover:bg-cyan-500/20
                                                        hover:shadow-md
                                                        disabled:cursor-not-allowed
                                                        disabled:opacity-50
                                                        dark:text-cyan-400
                                                    "
                                                >
                                                    <UserCog
                                                        size={
                                                            15
                                                        }
                                                    />

                                                    Assign Manager
                                                </button>
                                            )}

                                            {/* EDIT */}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleEdit(
                                                        team
                                                    )
                                                }
                                                disabled={
                                                    loading
                                                }
                                                title="Edit Team"
                                                className="
                                                    inline-flex
                                                    cursor-pointer
                                                    items-center
                                                    gap-1.5
                                                    rounded-lg
                                                    border
                                                    border-primary/30
                                                    bg-primary/10
                                                    px-3
                                                    py-2
                                                    text-xs
                                                    font-semibold
                                                    text-primary
                                                    shadow-sm
                                                    transition-all
                                                    duration-300
                                                    hover:-translate-y-0.5
                                                    hover:border-primary/60
                                                    hover:bg-primary/20
                                                    hover:shadow-md
                                                    disabled:cursor-not-allowed
                                                    disabled:opacity-50
                                                "
                                            >
                                                <Edit
                                                    size={
                                                        15
                                                    }
                                                />

                                                Edit
                                            </button>

                                            {/* DELETE */}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDelete(
                                                        team
                                                    )
                                                }
                                                disabled={
                                                    loading
                                                }
                                                title="Delete Team"
                                                className="
                                                    inline-flex
                                                    cursor-pointer
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
                                                    shadow-sm
                                                    transition-all
                                                    duration-300
                                                    hover:-translate-y-0.5
                                                    hover:border-destructive/60
                                                    hover:bg-destructive/20
                                                    hover:shadow-md
                                                    disabled:cursor-not-allowed
                                                    disabled:opacity-50
                                                "
                                            >
                                                <Trash2
                                                    size={
                                                        15
                                                    }
                                                />

                                                Delete
                                            </button>
                                        </div>
                                    </div>

                                    {/* ==================================================
                                        TEAM ID
                                    ================================================== */}

                                    {teamId !==
                                        null &&
                                        teamId !==
                                            undefined && (
                                            <div
                                                className="
                                                    border-t
                                                    border-border
                                                    px-5
                                                    py-2.5
                                                    text-[10px]
                                                    text-muted-foreground
                                                "
                                            >
                                                <span className="font-semibold">
                                                    ID:
                                                </span>{" "}
                                                <span
                                                    className="select-all"
                                                    title={String(
                                                        teamId
                                                    )}
                                                >
                                                    {String(
                                                        teamId
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                </div>
                            );
                        }
                    )}
                </div>
            ) : (
                // ====================================================
                // EMPTY STATE
                // ====================================================

                <div
                    className="
                        rounded-2xl
                        border
                        border-border
                        bg-card
                        px-5
                        py-16
                        text-center
                        shadow-sm
                    "
                >
                    <UsersRound
                        size={45}
                        className="
                            mx-auto
                            mb-4
                            text-muted-foreground
                        "
                    />

                    <p
                        className="
                            text-base
                            font-bold
                            text-foreground
                        "
                    >
                        {searchTerm
                            ? "No matching teams found"
                            : "No teams found"}
                    </p>

                    <p
                        className="
                            mt-2
                            text-sm
                            text-muted-foreground
                        "
                    >
                        {searchTerm
                            ? "Try a different search term."
                            : "Create your first team to get started."}
                    </p>
                </div>
            )}

            {/* ====================================================
                FOOTER
            ==================================================== */}

            <div
                className="
                    mt-4
                    flex
                    flex-col
                    gap-2
                    rounded-xl
                    border
                    border-border
                    bg-card
                    px-5
                    py-3
                    text-xs
                    text-muted-foreground
                    shadow-sm
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >
                <span>
                    Showing{" "}
                    <span className="font-bold text-foreground">
                        {filteredTeams.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-bold text-foreground">
                        {safeTeams.length}
                    </span>{" "}
                    teams
                </span>

                {searchTerm && (
                    <span className="font-semibold text-primary">
                        Filtered
                    </span>
                )}
            </div>
        </div>
    );
}

export default TeamTable;
