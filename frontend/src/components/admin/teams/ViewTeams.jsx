import { useEffect, useMemo, useState } from "react";

import {
    UsersRound,
    UserRound,
    Building2,
    CalendarDays,
    ShieldCheck,
    X,
    UserMinus,
    FolderKanban,
    History,
    Clock3,
    AlertCircle,
    Loader2,
    RefreshCw,
} from "lucide-react";

import {
    getTeamById,
    removeMemberFromTeam,
    getTeamActivityLogs,
} from "@/services/teamService";

// ============================================================
// VIEW TEAMS
//
// TEAM USE CASES
// ------------------------------------------------------------
// TEAM-004 - View Team Details
// TEAM-007 - Remove Member From Team
//
// Responsibilities:
// - Display selected team details
// - Load latest team data
// - Display team members
// - Remove team members
// - Prevent removal when active tasks exist
// - Display team activity history
// - Refresh data after member removal
//
// Backend/service source of truth:
// teamService.js
// ============================================================

function ViewTeams({
    team,
    open,
    onClose,
    onRemoveMember,
}) {
    // ============================================================
    // STATE
    // ============================================================

    const [currentTeam, setCurrentTeam] = useState(team);

    const [activityHistory, setActivityHistory] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    const [isRefreshing, setIsRefreshing] = useState(false);

    const [isRemoving, setIsRemoving] = useState(false);

    const [removingMemberId, setRemovingMemberId] =
        useState(null);

    const [error, setError] = useState("");

    const [activityError, setActivityError] =
        useState("");

    // ============================================================
    // UPDATE LOCAL TEAM WHEN PARENT TEAM CHANGES
    // ============================================================

    useEffect(() => {
        setCurrentTeam(team || null);
        setError("");
        setActivityError("");
        setActivityHistory([]);
    }, [team]);

    // ============================================================
    // GET TEAM ID
    // ============================================================

    const teamId =
        currentTeam?.id ??
        currentTeam?.teamId ??
        currentTeam?._id ??
        null;

    // ============================================================
    // LOAD TEAM DETAILS
    //
    // Works with:
    // - synchronous local teamService
    // - asynchronous API-connected teamService
    // ============================================================

    const loadTeamDetails = async ({
        showLoader = true,
    } = {}) => {
        if (!teamId) {
            setError("Team ID is missing.");
            return;
        }

        if (showLoader) {
            setIsLoading(true);
        } else {
            setIsRefreshing(true);
        }

        setError("");

        try {
            const result = await Promise.resolve(
                getTeamById(teamId)
            );

            const backendTeam =
                result?.team ??
                result?.data ??
                result;

            if (!backendTeam) {
                setError(
                    "The selected team could not be found."
                );

                return;
            }

            setCurrentTeam(backendTeam);
        } catch (loadError) {
            console.error(
                "Unable to load team details:",
                loadError
            );

            const message =
                loadError?.response?.data?.message ||
                loadError?.response?.data?.error ||
                loadError?.message ||
                "Unable to load team details.";

            setError(message);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    // ============================================================
    // LOAD TEAM ACTIVITY
    //
    // TEAM activity is requested by team ID.
    // ============================================================

    const loadTeamActivity = async () => {
        if (!teamId) {
            setActivityHistory([]);
            return;
        }

        setActivityError("");

        try {
            const result = await Promise.resolve(
                getTeamActivityLogs(teamId)
            );

            const activities =
                result?.activities ??
                result?.data ??
                result;

            if (Array.isArray(activities)) {
                setActivityHistory(activities);
                return;
            }

            setActivityHistory([]);
        } catch (activityLoadError) {
            console.error(
                "Unable to load team activity:",
                activityLoadError
            );

            const message =
                activityLoadError?.response?.data
                    ?.message ||
                activityLoadError?.response?.data
                    ?.error ||
                activityLoadError?.message ||
                "Unable to load team activity history.";

            setActivityError(message);
            setActivityHistory([]);
        }
    };

    // ============================================================
    // LOAD DATA WHEN MODAL OPENS
    // ============================================================

    useEffect(() => {
        if (!open || !teamId) {
            return undefined;
        }

        let cancelled = false;

        const loadData = async () => {
            try {
                setIsLoading(true);
                setError("");

                // ------------------------------------------------
                // LOAD TEAM
                // ------------------------------------------------

                const result = await Promise.resolve(
                    getTeamById(teamId)
                );

                if (cancelled) {
                    return;
                }

                const latestTeam =
                    result?.team ??
                    result?.data ??
                    result;

                if (latestTeam) {
                    setCurrentTeam(latestTeam);
                }

                // ------------------------------------------------
                // LOAD ACTIVITY
                // ------------------------------------------------

                try {
                    const activityResult =
                        await Promise.resolve(
                            getTeamActivityLogs(teamId)
                        );

                    if (cancelled) {
                        return;
                    }

                    const activities =
                        activityResult?.activities ??
                        activityResult?.data ??
                        activityResult;

                    setActivityHistory(
                        Array.isArray(activities)
                            ? activities
                            : []
                    );
                } catch (activityLoadError) {
                    if (cancelled) {
                        return;
                    }

                    console.error(
                        "Unable to load team activity:",
                        activityLoadError
                    );

                    setActivityError(
                        activityLoadError?.message ||
                            "Unable to load team activity history."
                    );
                }
            } catch (loadError) {
                if (cancelled) {
                    return;
                }

                console.error(
                    "Unable to load team details:",
                    loadError
                );

                setError(
                    loadError?.response?.data?.message ||
                        loadError?.response?.data?.error ||
                        loadError?.message ||
                        "Unable to load team details."
                );
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        };

        loadData();

        return () => {
            cancelled = true;
        };
    }, [open, teamId]);

    // ============================================================
    // CLOSED
    // ============================================================

    if (!open) {
        return null;
    }

    // ============================================================
    // TEAM NOT FOUND
    // ============================================================

    if (!currentTeam) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
                <div className="w-full max-w-md rounded-2xl border border-red-500/30 bg-card p-6 shadow-2xl">
                    <div className="text-center">
                        <AlertCircle
                            size={48}
                            className="mx-auto mb-4 text-red-500"
                        />

                        <h2 className="text-xl font-bold text-foreground">
                            Team not found
                        </h2>

                        <p className="mt-2 text-sm text-muted-foreground">
                            {error ||
                                "The selected team could not be found."}
                        </p>

                        <button
                            type="button"
                            onClick={onClose}
                            className="
                                mt-6 rounded-lg border border-border
                                bg-muted px-5 py-2 text-sm font-semibold
                                text-foreground transition-all duration-200
                                hover:border-primary/50
                                hover:bg-primary/10
                                hover:text-primary
                            "
                        >
                            Back to Teams
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ============================================================
    // TEAM INFORMATION
    // ============================================================

    const teamName =
        currentTeam.name ||
        currentTeam.teamName ||
        "Unnamed Team";

    const description =
        currentTeam.description ||
        "No description available.";

    const manager =
        typeof currentTeam.manager === "object"
            ? currentTeam.manager?.name ||
              currentTeam.manager?.fullName ||
              currentTeam.manager?.username ||
              currentTeam.manager?.email ||
              "Not assigned"
            : currentTeam.manager ||
              currentTeam.managerName ||
              "Not assigned";

    const organization =
        typeof currentTeam.organization === "object"
            ? currentTeam.organization?.name ||
              "Not assigned"
            : currentTeam.organization ||
              currentTeam.organizationName ||
              "Not assigned";

    const status =
        currentTeam.status ||
        "Active";

    const createdDate =
        currentTeam.createdDate ||
        currentTeam.createdAt ||
        currentTeam.updatedAt ||
        null;

    // ============================================================
    // MEMBERS
    // ============================================================

    const members = Array.isArray(
        currentTeam.members
    )
        ? currentTeam.members
        : Array.isArray(
              currentTeam.teamMembers
          )
        ? currentTeam.teamMembers
        : [];

    // ============================================================
    // ACTIVE PROJECT COUNT
    // ============================================================

    const getActiveProjectCount = () => {
        if (
            typeof currentTeam.activeProjectCount ===
            "number"
        ) {
            return currentTeam.activeProjectCount;
        }

        if (
            typeof currentTeam.activeProjects ===
            "number"
        ) {
            return currentTeam.activeProjects;
        }

        if (
            Array.isArray(
                currentTeam.activeProjects
            )
        ) {
            return currentTeam.activeProjects.length;
        }

        if (
            Array.isArray(
                currentTeam.projects
            )
        ) {
            return currentTeam.projects.filter(
                (project) => {
                    const projectStatus =
                        String(
                            project?.status || ""
                        )
                            .trim()
                            .toLowerCase();

                    return (
                        projectStatus ===
                            "active" ||
                        projectStatus ===
                            "in progress"
                    );
                }
            ).length;
        }

        return Number(
            currentTeam.projectCount || 0
        );
    };

    const activeProjectCount =
        getActiveProjectCount();

    // ============================================================
    // MEMBER ID
    // ============================================================

    const getMemberId = (member) => {
        if (!member) {
            return null;
        }

        if (
            typeof member === "string" ||
            typeof member === "number"
        ) {
            return member;
        }

        return (
            member.userId ??
            member.UserId ??
            member.id ??
            member.Id ??
            member.memberId ??
            member.MemberId ??
            null
        );
    };

    // ============================================================
    // MEMBER NAME
    // ============================================================

    const getMemberName = (member) => {
        if (!member) {
            return "Unknown Member";
        }

        if (typeof member === "string") {
            return member;
        }

        if (typeof member === "number") {
            return `User ${member}`;
        }

        if (member.name) {
            return member.name;
        }

        if (member.fullName) {
            return member.fullName;
        }

        if (
            member.firstName ||
            member.lastName
        ) {
            return `${member.firstName || ""} ${
                member.lastName || ""
            }`.trim();
        }

        if (member.username) {
            return member.username;
        }

        if (member.email) {
            return member.email;
        }

        const id = getMemberId(member);

        if (
            id !== null &&
            id !== undefined
        ) {
            return `User ${id}`;
        }

        return "Unknown Member";
    };

    // ============================================================
    // MEMBER EMAIL
    // ============================================================

    const getMemberEmail = (member) => {
        if (
            member &&
            typeof member === "object"
        ) {
            return (
                member.email ||
                member.Email ||
                "Email not available"
            );
        }

        return "Email not available";
    };

    // ============================================================
    // MEMBER ROLE
    // ============================================================

    const getMemberRole = (member) => {
        if (!member) {
            return "Member";
        }

        if (
            typeof member === "object"
        ) {
            return (
                member.role ||
                member.Role ||
                member.userRole ||
                member.memberRole ||
                "Member"
            );
        }

        return "Member";
    };

    // ============================================================
    // MEMBER ADDED DATE
    // ============================================================

    const getMemberAddedDate = (
        member
    ) => {
        if (
            !member ||
            typeof member !== "object"
        ) {
            return "Date not available";
        }

        const dateValue =
            member.addedAt ||
            member.dateAdded ||
            member.joinedAt ||
            member.createdAt ||
            member.memberSince;

        if (!dateValue) {
            return "Date not available";
        }

        const date =
            new Date(dateValue);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return String(dateValue);
        }

        return date.toLocaleDateString(
            "en-US",
            {
                year: "numeric",
                month: "short",
                day: "numeric",
            }
        );
    };

    // ============================================================
    // MEMBER INITIAL
    // ============================================================

    const getMemberInitial = (
        member
    ) => {
        return getMemberName(member)
            .charAt(0)
            .toUpperCase();
    };

    // ============================================================
    // FORMAT DATE
    // ============================================================

    const formatDate = (
        dateValue
    ) => {
        if (!dateValue) {
            return "Not available";
        }

        const date =
            new Date(dateValue);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return String(dateValue);
        }

        return date.toLocaleDateString(
            "en-US",
            {
                year: "numeric",
                month: "short",
                day: "numeric",
            }
        );
    };

    // ============================================================
    // FORMAT DATE TIME
    // ============================================================

    const formatDateTime = (
        dateValue
    ) => {
        if (!dateValue) {
            return "Date not available";
        }

        const date =
            new Date(dateValue);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return String(dateValue);
        }

        return date.toLocaleString(
            "en-US",
            {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
            }
        );
    };

    // ============================================================
    // ACTIVITY DESCRIPTION
    // ============================================================

    const getActivityDescription = (
        activity
    ) => {
        if (!activity) {
            return "Team activity";
        }

        if (
            typeof activity === "string"
        ) {
            return activity;
        }

        return (
            activity.description ||
            activity.message ||
            activity.action ||
            activity.activity ||
            "Team activity"
        );
    };

    // ============================================================
    // ACTIVITY PERFORMER
    // ============================================================

    const getActivityPerformer = (
        activity
    ) => {
        if (
            !activity ||
            typeof activity !== "object"
        ) {
            return "System";
        }

        return (
            activity.performedBy ||
            activity.userName ||
            activity.username ||
            activity.user?.name ||
            activity.user?.fullName ||
            activity.user?.email ||
            "System"
        );
    };

    // ============================================================
    // ACTIVITY DATE
    // ============================================================

    const getActivityDate = (
        activity
    ) => {
        if (
            !activity ||
            typeof activity !== "object"
        ) {
            return null;
        }

        return (
            activity.createdAt ||
            activity.timestamp ||
            activity.date ||
            activity.updatedAt ||
            activity.performedAt
        );
    };

    // ============================================================
    // SORT ACTIVITY
    //
    // Newest activity first.
    // ============================================================

    const sortedActivityHistory =
        useMemo(() => {
            return [...activityHistory].sort(
                (a, b) => {
                    const dateA =
                        new Date(
                            getActivityDate(a) ||
                                0
                        ).getTime();

                    const dateB =
                        new Date(
                            getActivityDate(b) ||
                                0
                        ).getTime();

                    return dateB - dateA;
                }
            );
        }, [activityHistory]);

    // ============================================================
    // REFRESH
    // ============================================================

    const handleRefresh = async () => {
        if (!teamId || isRefreshing) {
            return;
        }

        await loadTeamDetails({
            showLoader: false,
        });

        await loadTeamActivity();
    };

    // ============================================================
    // REMOVE MEMBER
    //
    // TEAM-007
    // ============================================================

    const handleRemoveMember = async (
        member
    ) => {
        if (
            !member ||
            isRemoving
        ) {
            return;
        }

        const memberId =
            getMemberId(member);

        if (
            memberId === null ||
            memberId === undefined ||
            memberId === ""
        ) {
            window.alert(
                "Unable to identify this member."
            );

            return;
        }

        const memberName =
            getMemberName(member);

        const confirmed =
            window.confirm(
                `Are you sure you want to remove "${memberName}" from the "${teamName}" team?`
            );

        if (!confirmed) {
            return;
        }

        setIsRemoving(true);
        setRemovingMemberId(memberId);
        setError("");

        try {
            // --------------------------------------------------------
            // CALL SERVICE
            // --------------------------------------------------------

            const result =
                await Promise.resolve(
                    removeMemberFromTeam(
                        teamId,
                        memberId,
                        {
                            performedBy:
                                "Admin",
                        }
                    )
                );

            // --------------------------------------------------------
            // ACTIVE TASKS
            //
            // TEAM-007 alternative flow
            // --------------------------------------------------------

            if (
                result?.code ===
                "ACTIVE_TASKS_EXIST"
            ) {
                window.alert(
                    result.message ||
                        "This member has active tasks and cannot be removed."
                );

                return;
            }

            // --------------------------------------------------------
            // TEAM NOT FOUND
            // --------------------------------------------------------

            if (
                result?.code ===
                "TEAM_NOT_FOUND"
            ) {
                window.alert(
                    result.message ||
                        "The team could not be found."
                );

                return;
            }

            // --------------------------------------------------------
            // MEMBER NOT FOUND
            // --------------------------------------------------------

            if (
                result?.code ===
                    "USER_NOT_TEAM_MEMBER" ||
                result?.code ===
                    "USER_NOT_FOUND"
            ) {
                window.alert(
                    result.message ||
                        "This user is not a member of the selected team."
                );

                return;
            }

            // --------------------------------------------------------
            // FAILED
            // --------------------------------------------------------

            if (
                !result ||
                result.success === false
            ) {
                window.alert(
                    result?.message ||
                        "Unable to remove member."
                );

                return;
            }

            // --------------------------------------------------------
            // GET UPDATED TEAM
            // --------------------------------------------------------

            const updatedTeam =
                result?.team ??
                result?.data ??
                null;

            if (updatedTeam) {
                setCurrentTeam(
                    updatedTeam
                );
            } else {
                // ----------------------------------------------------
                // FALLBACK LOCAL UPDATE
                // ----------------------------------------------------

                setCurrentTeam(
                    (previousTeam) => ({
                        ...previousTeam,

                        members:
                            Array.isArray(
                                previousTeam?.members
                            )
                                ? previousTeam.members.filter(
                                      (item) =>
                                          String(
                                              getMemberId(
                                                  item
                                              )
                                          ) !==
                                          String(
                                              memberId
                                          )
                                  )
                                : [],
                    })
                );
            }

            // --------------------------------------------------------
            // REFRESH ACTIVITY
            // --------------------------------------------------------

            await loadTeamActivity();

            // --------------------------------------------------------
            // UPDATE PARENT
            // --------------------------------------------------------

            if (
                typeof onRemoveMember ===
                "function"
            ) {
                await onRemoveMember(
                    updatedTeam ||
                        currentTeam,
                    member
                );
            }

            // --------------------------------------------------------
            // SUCCESS
            // --------------------------------------------------------

            console.log(
                "Member removed successfully."
            );
        } catch (removeError) {
            console.error(
                "Unable to remove member:",
                removeError
            );

            const backendMessage =
                removeError?.response
                    ?.data?.message ||
                removeError?.response
                    ?.data?.error ||
                removeError?.message;

            window.alert(
                backendMessage ||
                    "Unable to remove member. Please try again."
            );
        } finally {
            setIsRemoving(false);
            setRemovingMemberId(null);
        }
    };

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <div
                className="
                    flex max-h-[92vh] w-full max-w-6xl flex-col
                    overflow-hidden rounded-2xl border border-border
                    bg-card shadow-2xl
                "
            >
                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="flex items-center justify-between border-b border-border bg-muted/50 px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div
                            className="
                                flex h-12 w-12 items-center justify-center
                                rounded-xl border border-primary/30
                                bg-primary/10 text-primary
                                transition-all duration-300
                                hover:border-primary/50
                                hover:bg-primary
                                hover:text-primary-foreground
                            "
                        >
                            <UsersRound size={24} />
                        </div>

                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-bold text-foreground">
                                    {teamName}
                                </h2>

                                {isLoading && (
                                    <Loader2
                                        size={17}
                                        className="animate-spin text-primary"
                                    />
                                )}
                            </div>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Team Details
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Refresh */}

                        <button
                            type="button"
                            onClick={
                                handleRefresh
                            }
                            disabled={
                                isRefreshing ||
                                isRemoving
                            }
                            className="
                                flex h-9 w-9 items-center justify-center
                                rounded-lg border border-border
                                bg-background text-muted-foreground
                                transition-all duration-200
                                hover:border-primary/50
                                hover:bg-primary/10
                                hover:text-primary
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                            aria-label="Refresh team"
                            title="Refresh team"
                        >
                            <RefreshCw
                                size={17}
                                className={
                                    isRefreshing
                                        ? "animate-spin"
                                        : ""
                                }
                            />
                        </button>

                        {/* Close */}

                        <button
                            type="button"
                            onClick={onClose}
                            className="
                                flex h-9 w-9 items-center justify-center
                                rounded-lg border border-border
                                bg-background text-muted-foreground
                                transition-all duration-200
                                hover:border-red-500/50
                                hover:bg-red-500/10
                                hover:text-red-500
                            "
                            aria-label="Close"
                            title="Close"
                        >
                            <X size={19} />
                        </button>
                    </div>
                </div>

                {/* ==================================================
                    CONTENT
                ================================================== */}

                <div className="overflow-y-auto p-6">
                    {/* Error */}

                    {error && (
                        <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
                            <AlertCircle
                                size={18}
                                className="mt-0.5 shrink-0 text-red-500"
                            />

                            <div>
                                <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                                    Unable to refresh team data
                                </p>

                                <p className="mt-1 text-xs text-red-600/80 dark:text-red-400/80">
                                    {error}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* ==================================================
                        TEAM SUMMARY
                    ================================================== */}

                    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {/* Manager */}

                        <div
                            className="
                                rounded-xl border border-border bg-background
                                p-4 transition-all duration-300
                                hover:-translate-y-1 hover:border-primary/40
                                hover:bg-accent/50
                            "
                        >
                            <div className="flex items-center gap-2 text-primary">
                                <UserRound size={17} />

                                <span className="text-xs font-semibold uppercase tracking-wide">
                                    Manager
                                </span>
                            </div>

                            <p className="mt-2 truncate text-sm font-semibold text-foreground">
                                {manager}
                            </p>
                        </div>

                        {/* Organization */}

                        <div
                            className="
                                rounded-xl border border-border bg-background
                                p-4 transition-all duration-300
                                hover:-translate-y-1 hover:border-blue-500/40
                                hover:bg-accent/50
                            "
                        >
                            <div className="flex items-center gap-2 text-blue-500 dark:text-blue-400">
                                <Building2 size={17} />

                                <span className="text-xs font-semibold uppercase tracking-wide">
                                    Organization
                                </span>
                            </div>

                            <p className="mt-2 truncate text-sm font-semibold text-foreground">
                                {organization}
                            </p>
                        </div>

                        {/* Active Projects */}

                        <div
                            className="
                                rounded-xl border border-border bg-background
                                p-4 transition-all duration-300
                                hover:-translate-y-1 hover:border-violet-500/40
                                hover:bg-accent/50
                            "
                        >
                            <div className="flex items-center gap-2 text-violet-500 dark:text-violet-400">
                                <FolderKanban size={17} />

                                <span className="text-xs font-semibold uppercase tracking-wide">
                                    Active Projects
                                </span>
                            </div>

                            <p className="mt-2 text-xl font-bold text-foreground">
                                {activeProjectCount}
                            </p>
                        </div>

                        {/* Status */}

                        <div
                            className="
                                rounded-xl border border-border bg-background
                                p-4 transition-all duration-300
                                hover:-translate-y-1 hover:border-emerald-500/40
                                hover:bg-accent/50
                            "
                        >
                            <div className="flex items-center gap-2 text-emerald-500 dark:text-emerald-400">
                                <ShieldCheck size={17} />

                                <span className="text-xs font-semibold uppercase tracking-wide">
                                    Status
                                </span>
                            </div>

                            <p className="mt-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                                {status}
                            </p>
                        </div>
                    </div>

                    {/* ==================================================
                        DESCRIPTION + CREATED
                    ================================================== */}

                    <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
                        <div className="rounded-xl border border-border bg-background p-4">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">
                                Description
                            </p>

                            <p className="text-sm leading-6 text-muted-foreground">
                                {description}
                            </p>
                        </div>

                        <div className="rounded-xl border border-border bg-background p-4">
                            <div className="flex items-center gap-2 text-amber-500 dark:text-amber-400">
                                <CalendarDays size={17} />

                                <span className="text-xs font-semibold uppercase tracking-wide">
                                    Created
                                </span>
                            </div>

                            <p className="mt-2 text-sm font-semibold text-foreground">
                                {formatDate(
                                    createdDate
                                )}
                            </p>
                        </div>
                    </div>

                    {/* ==================================================
                        TEAM MEMBERS
                    ================================================== */}

                    <div className="mb-6 overflow-hidden rounded-xl border border-border bg-background">
                        <div className="flex flex-col gap-3 border-b border-border bg-muted/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-2">
                                <UsersRound
                                    size={19}
                                    className="text-violet-500 dark:text-violet-400"
                                />

                                <h3 className="text-base font-bold text-foreground">
                                    Team Members
                                </h3>
                            </div>

                            <span
                                className="
                                    w-fit rounded-full border border-violet-500/30
                                    bg-violet-500/10 px-3 py-1
                                    text-xs font-bold text-violet-600
                                    dark:text-violet-400
                                "
                            >
                                {members.length}{" "}
                                {members.length === 1
                                    ? "Member"
                                    : "Members"}
                            </span>
                        </div>

                        {members.length > 0 ? (
                            <div>
                                {/* Desktop Header */}

                                <div
                                    className="
                                        hidden border-b border-border
                                        bg-muted/30 px-5 py-3
                                        md:grid md:grid-cols-[1.5fr_1.7fr_1fr_1fr_auto]
                                        md:gap-4
                                    "
                                >
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                                        Member
                                    </span>

                                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                                        Email
                                    </span>

                                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                                        Role
                                    </span>

                                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                                        Added Date
                                    </span>

                                    <span className="text-right text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                                        Action
                                    </span>
                                </div>

                                {/* Members */}

                                <div className="divide-y divide-border">
                                    {members.map(
                                        (
                                            member,
                                            index
                                        ) => {
                                            const memberName =
                                                getMemberName(
                                                    member
                                                );

                                            const email =
                                                getMemberEmail(
                                                    member
                                                );

                                            const role =
                                                getMemberRole(
                                                    member
                                                );

                                            const addedDate =
                                                getMemberAddedDate(
                                                    member
                                                );

                                            const memberId =
                                                getMemberId(
                                                    member
                                                );

                                            const isThisMemberRemoving =
                                                String(
                                                    removingMemberId
                                                ) ===
                                                String(
                                                    memberId
                                                );

                                            return (
                                                <div
                                                    key={
                                                        memberId ||
                                                        member?.email ||
                                                        `${memberName}-${index}`
                                                    }
                                                    className="
                                                        group px-5 py-4
                                                        transition-all duration-200
                                                        hover:bg-accent/50
                                                    "
                                                >
                                                    {/* Desktop */}

                                                    <div
                                                        className="
                                                            hidden md:grid
                                                            md:grid-cols-[1.5fr_1.7fr_1fr_1fr_auto]
                                                            md:items-center md:gap-4
                                                        "
                                                    >
                                                        <div className="flex min-w-0 items-center gap-3">
                                                            <div
                                                                className="
                                                                    flex h-10 w-10 shrink-0 items-center
                                                                    justify-center rounded-full
                                                                    border border-violet-500/30
                                                                    bg-violet-500/10
                                                                    text-sm font-bold
                                                                    text-violet-600
                                                                    dark:text-violet-400
                                                                    transition-all duration-200
                                                                    group-hover:border-violet-500/50
                                                                    group-hover:bg-violet-500
                                                                    group-hover:text-white
                                                                "
                                                            >
                                                                {getMemberInitial(
                                                                    member
                                                                )}
                                                            </div>

                                                            <p className="truncate text-sm font-semibold text-foreground">
                                                                {
                                                                    memberName
                                                                }
                                                            </p>
                                                        </div>

                                                        <p className="truncate text-sm text-muted-foreground">
                                                            {
                                                                email
                                                            }
                                                        </p>

                                                        <span
                                                            className="
                                                                w-fit rounded-full
                                                                border border-cyan-500/30
                                                                bg-cyan-500/10 px-2.5 py-1
                                                                text-xs font-semibold
                                                                text-cyan-600 dark:text-cyan-400
                                                            "
                                                        >
                                                            {
                                                                role
                                                            }
                                                        </span>

                                                        <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                                                            <CalendarDays
                                                                size={
                                                                    15
                                                                }
                                                            />

                                                            <span>
                                                                {
                                                                    addedDate
                                                                }
                                                            </span>
                                                        </div>

                                                        <button
                                                            type="button"
                                                            disabled={
                                                                isRemoving
                                                            }
                                                            onClick={() =>
                                                                handleRemoveMember(
                                                                    member
                                                                )
                                                            }
                                                            className="
                                                                inline-flex h-9 items-center
                                                                justify-center gap-2 rounded-lg
                                                                border border-red-500/30
                                                                bg-red-500/10 px-3
                                                                text-xs font-semibold
                                                                text-red-600 dark:text-red-400
                                                                transition-all duration-200
                                                                hover:-translate-y-0.5
                                                                hover:border-red-500
                                                                hover:bg-red-500
                                                                hover:text-white
                                                                disabled:cursor-not-allowed
                                                                disabled:opacity-50
                                                            "
                                                            title={`Remove ${memberName}`}
                                                        >
                                                            {isThisMemberRemoving ? (
                                                                <Loader2
                                                                    size={
                                                                        15
                                                                    }
                                                                    className="animate-spin"
                                                                />
                                                            ) : (
                                                                <UserMinus
                                                                    size={
                                                                        15
                                                                    }
                                                                />
                                                            )}

                                                            {isThisMemberRemoving
                                                                ? "Removing..."
                                                                : "Remove"}
                                                        </button>
                                                    </div>

                                                    {/* Mobile */}

                                                    <div className="flex items-start gap-3 md:hidden">
                                                        <div
                                                            className="
                                                                flex h-10 w-10 shrink-0
                                                                items-center justify-center
                                                                rounded-full border
                                                                border-violet-500/30
                                                                bg-violet-500/10
                                                                text-sm font-bold
                                                                text-violet-600
                                                                dark:text-violet-400
                                                            "
                                                        >
                                                            {getMemberInitial(
                                                                member
                                                            )}
                                                        </div>

                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-sm font-semibold text-foreground">
                                                                {
                                                                    memberName
                                                                }
                                                            </p>

                                                            <p className="mt-1 truncate text-xs text-muted-foreground">
                                                                {
                                                                    email
                                                                }
                                                            </p>

                                                            <span
                                                                className="
                                                                    mt-2 inline-flex rounded-full
                                                                    border border-cyan-500/30
                                                                    bg-cyan-500/10 px-2.5 py-1
                                                                    text-xs font-semibold
                                                                    text-cyan-600 dark:text-cyan-400
                                                                "
                                                            >
                                                                {
                                                                    role
                                                                }
                                                            </span>

                                                            <div className="mt-2 flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400">
                                                                <CalendarDays
                                                                    size={
                                                                        14
                                                                    }
                                                                />

                                                                <span>
                                                                    Added:{" "}
                                                                    {
                                                                        addedDate
                                                                    }
                                                                </span>
                                                            </div>

                                                            <button
                                                                type="button"
                                                                disabled={
                                                                    isRemoving
                                                                }
                                                                onClick={() =>
                                                                    handleRemoveMember(
                                                                        member
                                                                    )
                                                                }
                                                                className="
                                                                    mt-3 inline-flex h-9
                                                                    items-center justify-center
                                                                    gap-2 rounded-lg
                                                                    border border-red-500/30
                                                                    bg-red-500/10 px-3
                                                                    text-xs font-semibold
                                                                    text-red-600 dark:text-red-400
                                                                    transition-all duration-200
                                                                    hover:border-red-500
                                                                    hover:bg-red-500
                                                                    hover:text-white
                                                                    disabled:cursor-not-allowed
                                                                    disabled:opacity-50
                                                                "
                                                            >
                                                                {isThisMemberRemoving ? (
                                                                    <Loader2
                                                                        size={
                                                                            15
                                                                        }
                                                                        className="animate-spin"
                                                                    />
                                                                ) : (
                                                                    <UserMinus
                                                                        size={
                                                                            15
                                                                        }
                                                                    />
                                                                )}

                                                                {isThisMemberRemoving
                                                                    ? "Removing..."
                                                                    : "Remove"}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="px-5 py-12 text-center">
                                <UsersRound
                                    size={40}
                                    className="mx-auto mb-3 text-muted-foreground"
                                />

                                <p className="text-sm font-semibold text-foreground">
                                    No members assigned
                                </p>

                                <p className="mt-1 text-xs text-muted-foreground">
                                    Add members to this team to see them here.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* ==================================================
                        ACTIVITY HISTORY
                    ================================================== */}

                    <div className="overflow-hidden rounded-xl border border-border bg-background">
                        <div className="flex flex-col gap-3 border-b border-border bg-muted/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-2">
                                <History
                                    size={19}
                                    className="text-amber-500 dark:text-amber-400"
                                />

                                <h3 className="text-base font-bold text-foreground">
                                    Team Activity History
                                </h3>
                            </div>

                            <span
                                className="
                                    rounded-full border border-amber-500/30
                                    bg-amber-500/10 px-3 py-1
                                    text-xs font-bold text-amber-600
                                    dark:text-amber-400
                                "
                            >
                                {
                                    sortedActivityHistory.length
                                }{" "}
                                {sortedActivityHistory.length ===
                                1
                                    ? "Activity"
                                    : "Activities"}
                            </span>
                        </div>

                        {activityError && (
                            <div className="flex items-start gap-3 border-b border-red-500/20 bg-red-500/10 px-5 py-3">
                                <AlertCircle
                                    size={17}
                                    className="mt-0.5 shrink-0 text-red-500"
                                />

                                <p className="text-xs text-red-600 dark:text-red-400">
                                    {
                                        activityError
                                    }
                                </p>
                            </div>
                        )}

                        {sortedActivityHistory.length >
                        0 ? (
                            <div className="divide-y divide-border">
                                {sortedActivityHistory.map(
                                    (
                                        activity,
                                        index
                                    ) => (
                                        <div
                                            key={
                                                activity?.id ||
                                                activity?.activityId ||
                                                index
                                            }
                                            className="
                                                flex gap-4 px-5 py-4
                                                transition-all duration-200
                                                hover:bg-accent/50
                                            "
                                        >
                                            <div
                                                className="
                                                    mt-1 flex h-9 w-9 shrink-0
                                                    items-center justify-center
                                                    rounded-full border border-amber-500/30
                                                    bg-amber-500/10
                                                    text-amber-600
                                                    dark:text-amber-400
                                                "
                                            >
                                                <Clock3
                                                    size={
                                                        16
                                                    }
                                                />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-semibold text-foreground">
                                                    {getActivityDescription(
                                                        activity
                                                    )}
                                                </p>

                                                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                                    <span>
                                                        By:{" "}
                                                        {getActivityPerformer(
                                                            activity
                                                        )}
                                                    </span>

                                                    <span>
                                                        {formatDateTime(
                                                            getActivityDate(
                                                                activity
                                                            )
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        ) : (
                            <div className="px-5 py-10 text-center">
                                <History
                                    size={38}
                                    className="mx-auto mb-3 text-muted-foreground"
                                />

                                <p className="text-sm font-semibold text-foreground">
                                    No activity history
                                </p>

                                <p className="mt-1 text-xs text-muted-foreground">
                                    No recorded activity is available for this team.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ==================================================
                    FOOTER
                ================================================== */}

                <div className="flex justify-between border-t border-border bg-muted/50 px-6 py-4">
                    <div className="flex items-center">
                        {isLoading && (
                            <span className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Loader2
                                    size={14}
                                    className="animate-spin"
                                />

                                Loading latest team data...
                            </span>
                        )}

                        {!isLoading &&
                            isRefreshing && (
                                <span className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <RefreshCw
                                        size={14}
                                        className="animate-spin"
                                    />

                                    Refreshing team...
                                </span>
                            )}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="
                                inline-flex items-center gap-2
                                rounded-lg border border-border
                                bg-background px-5 py-2
                                text-sm font-semibold text-foreground
                                transition-all duration-200
                                hover:border-primary/50
                                hover:bg-primary/10
                                hover:text-primary
                            "
                        >
                            <X size={16} />

                            Back to Teams
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewTeams;