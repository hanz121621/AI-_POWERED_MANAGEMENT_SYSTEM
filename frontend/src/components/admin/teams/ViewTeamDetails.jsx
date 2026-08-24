import { useEffect, useMemo, useState } from "react";

import {
    X,
    UsersRound,
    UserRound,
    ShieldCheck,
    FolderKanban,
    CalendarDays,
    Activity,
    UserCog,
    UserPlus,
    UserMinus,
    Loader2,
    AlertCircle,
    RefreshCw,
} from "lucide-react";

import AddMembersModal from "@/components/admin/teams/AddMembersModal";

import {
    addMemberToTeam,
    removeMemberFromTeam,
    getTeams,
    getTeamActivityLogs,
} from "@/services/teamService";

// ============================================================
// VIEW TEAM DETAILS
//
// TEAM USE CASES
// ============================================================
//
// TEAM-001  Create Team
// TEAM-002  Update Team
// TEAM-003  Delete Team
// TEAM-004  View Teams
// TEAM-005  Assign Manager
// TEAM-006  Add Team Members
// TEAM-007  Remove Team Members
//
// This component is responsible for:
// - displaying team information
// - displaying team members
// - opening AddMembersModal
// - calling teamService for member operations
// - refreshing the selected team
// - displaying team activity
//
// Backend/business logic remains inside teamService.
// ============================================================

// ============================================================
// GENERIC HELPERS
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

const getTeamName = (team) => {
    if (!team) {
        return "Unnamed Team";
    }

    return (
        team.name ??
        team.Name ??
        "Unnamed Team"
    );
};

const getTeamDescription = (team) => {
    if (!team) {
        return "No description available.";
    }

    return (
        team.description ??
        team.Description ??
        "No description available."
    );
};

const getTeamStatus = (team) => {
    if (!team) {
        return "Inactive";
    }

    if (team.status || team.Status) {
        return team.status ?? team.Status;
    }

    const isActive =
        team.isActive ??
        team.IsActive;

    if (typeof isActive === "boolean") {
        return isActive
            ? "Active"
            : "Inactive";
    }

    return "Active";
};

const getTeamOrganization = (team) => {
    if (!team) {
        return "Not assigned";
    }

    const organization =
        team.organization ??
        team.Organization;

    if (
        organization &&
        typeof organization === "object"
    ) {
        return (
            organization.name ??
            organization.Name ??
            "Not assigned"
        );
    }

    return organization || "Not assigned";
};

const getTeamMembers = (team) => {
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

// ============================================================
// MEMBER HELPERS
// ============================================================

const getMemberId = (member) => {
    if (!member) {
        return null;
    }

    if (typeof member === "string") {
        return member;
    }

    if (typeof member === "number") {
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
        member.email ??
        member.Email ??
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
        member.name ??
        member.Name ??
        member.fullName ??
        member.FullName ??
        `${member.firstName ?? ""} ${
            member.lastName ?? ""
        }`.trim() ||
        member.username ??
        member.Username ??
        member.email ??
        member.Email ??
        "Unknown User"
    );
};

const getMemberEmail = (member) => {
    if (!member || typeof member !== "object") {
        return "";
    }

    return (
        member.email ??
        member.Email ??
        ""
    );
};

const getSystemRole = (member) => {
    if (!member || typeof member !== "object") {
        return "Not specified";
    }

    return (
        member.role ??
        member.Role ??
        member.systemRole ??
        member.SystemRole ??
        member.userRole ??
        member.UserRole ??
        "Not specified"
    );
};

const getClassification = (member) => {
    if (!member || typeof member !== "object") {
        return "Not classified";
    }

    return (
        member.contributorType ??
        member.ContributorType ??
        member.classification ??
        member.Classification ??
        member.memberClassification ??
        member.MemberClassification ??
        member.contributorClassification ??
        member.ContributorClassification ??
        "Not classified"
    );
};

const getDeveloperSubtype = (member) => {
    if (!member || typeof member !== "object") {
        return null;
    }

    return (
        member.developerType ??
        member.DeveloperType ??
        member.developerSubtype ??
        member.DeveloperSubtype ??
        member.developerSubType ??
        member.DeveloperSubType ??
        null
    );
};

const getStaffSubtype = (member) => {
    if (!member || typeof member !== "object") {
        return null;
    }

    return (
        member.staffType ??
        member.StaffType ??
        member.staffSubtype ??
        member.StaffSubtype ??
        member.staffSubType ??
        member.StaffSubType ??
        null
    );
};

const getPermissions = (member) => {
    if (!member || typeof member !== "object") {
        return [];
    }

    const permissions =
        member.permissions ??
        member.Permissions;

    if (Array.isArray(permissions)) {
        return permissions;
    }

    if (
        permissions !== undefined &&
        permissions !== null &&
        permissions !== ""
    ) {
        return [permissions];
    }

    return [];
};

// ============================================================
// DATE HELPER
// ============================================================

const formatDate = (value) => {
    if (!value) {
        return "Not available";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleDateString();
};

const formatDateTime = (value) => {
    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleString();
};

// ============================================================
// NORMALIZE TEAM RESPONSE
// ============================================================

const extractTeams = (response) => {
    if (Array.isArray(response)) {
        return response;
    }

    if (Array.isArray(response?.data)) {
        return response.data;
    }

    if (Array.isArray(response?.teams)) {
        return response.teams;
    }

    if (Array.isArray(response?.data?.teams)) {
        return response.data.teams;
    }

    return [];
};

// ============================================================
// EXTRACT TEAM FROM SERVICE RESPONSE
// ============================================================

const extractTeamFromResponse = (response) => {
    if (!response) {
        return null;
    }

    if (response.team) {
        return response.team;
    }

    if (response.Team) {
        return response.Team;
    }

    if (response.data?.team) {
        return response.data.team;
    }

    if (response.data?.Team) {
        return response.data.Team;
    }

    return null;
};

// ============================================================
// CHECK SERVICE SUCCESS
// ============================================================

const isServiceSuccess = (response) => {
    if (!response) {
        return false;
    }

    if (response.success === true) {
        return true;
    }

    if (
        response.status === 200 ||
        response.status === 201 ||
        response.status === 204
    ) {
        return true;
    }

    return false;
};

// ============================================================
// COMPONENT
// ============================================================

function ViewTeamDetails({
    open = false,
    team = null,
    onClose,
    onTeamUpdated,
}) {
    // ========================================================
    // STATE
    // ========================================================

    const [currentTeam, setCurrentTeam] =
        useState(team || null);

    const [addMembersOpen, setAddMembersOpen] =
        useState(false);

    const [removingMemberId, setRemovingMemberId] =
        useState(null);

    const [refreshing, setRefreshing] =
        useState(false);

    const [addError, setAddError] =
        useState("");

    const [removeError, setRemoveError] =
        useState("");

    const [refreshError, setRefreshError] =
        useState("");

    const [activityHistory, setActivityHistory] =
        useState([]);

    const [activityLoading, setActivityLoading] =
        useState(false);

    // ========================================================
    // SYNC TEAM WITH PARENT
    // ========================================================

    useEffect(() => {
        setCurrentTeam(team || null);

        setAddError("");
        setRemoveError("");
        setRefreshError("");
    }, [team]);

    // ========================================================
    // ACTIVE TEAM
    // ========================================================

    const activeTeam =
        currentTeam || team || null;

    // ========================================================
    // TEAM ID
    // ========================================================

    const teamId = useMemo(
        () => getTeamId(activeTeam),
        [activeTeam]
    );

    // ========================================================
    // TEAM MEMBERS
    // ========================================================

    const members = useMemo(
        () => getTeamMembers(activeTeam),
        [activeTeam]
    );

    // ========================================================
    // LOAD ACTIVITY HISTORY
    // ========================================================

    const loadActivityHistory = async (
        selectedTeamId = teamId
    ) => {
        if (
            selectedTeamId === null ||
            selectedTeamId === undefined ||
            selectedTeamId === ""
        ) {
            setActivityHistory([]);
            return;
        }

        if (
            typeof getTeamActivityLogs !==
            "function"
        ) {
            const embeddedLogs =
                activeTeam?.activityHistory ??
                activeTeam?.ActivityHistory ??
                activeTeam?.activities ??
                activeTeam?.Activities ??
                [];

            setActivityHistory(
                Array.isArray(embeddedLogs)
                    ? embeddedLogs
                    : []
            );

            return;
        }

        setActivityLoading(true);

        try {
            const response =
                await getTeamActivityLogs(
                    selectedTeamId
                );

            const logs =
                Array.isArray(response)
                    ? response
                    : Array.isArray(
                          response?.data
                      )
                    ? response.data
                    : Array.isArray(
                          response?.logs
                      )
                    ? response.logs
                    : Array.isArray(
                          response?.activities
                      )
                    ? response.activities
                    : Array.isArray(
                          response?.data?.logs
                      )
                    ? response.data.logs
                    : [];

            setActivityHistory(logs);
        } catch (error) {
            console.error(
                "Unable to load team activity history:",
                error
            );

            const embeddedLogs =
                activeTeam?.activityHistory ??
                activeTeam?.ActivityHistory ??
                activeTeam?.activities ??
                activeTeam?.Activities ??
                [];

            setActivityHistory(
                Array.isArray(embeddedLogs)
                    ? embeddedLogs
                    : []
            );
        } finally {
            setActivityLoading(false);
        }
    };

    // ========================================================
    // LOAD ACTIVITY WHEN TEAM OPENS
    // ========================================================

    useEffect(() => {
        if (!open || !teamId) {
            return;
        }

        loadActivityHistory(teamId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, teamId]);

    // ========================================================
    // REFRESH TEAM
    //
    // Existing teamService:
    // getTeams()
    // ========================================================

    const refreshTeam = async () => {
        if (
            teamId === null ||
            teamId === undefined ||
            teamId === ""
        ) {
            return activeTeam;
        }

        setRefreshing(true);
        setRefreshError("");

        try {
            const response =
                await getTeams();

            const teams =
                extractTeams(response);

            const latestTeam =
                teams.find((item) => {
                    const itemId =
                        getTeamId(item);

                    return (
                        String(itemId) ===
                        String(teamId)
                    );
                });

            if (latestTeam) {
                setCurrentTeam(latestTeam);

                if (
                    typeof onTeamUpdated ===
                    "function"
                ) {
                    onTeamUpdated(latestTeam);
                }

                await loadActivityHistory(
                    getTeamId(latestTeam)
                );

                return latestTeam;
            }

            return activeTeam;
        } catch (error) {
            console.error(
                "Unable to refresh team:",
                error
            );

            setRefreshError(
                error?.response?.data?.message ||
                    error?.response?.data?.title ||
                    error?.message ||
                    "Unable to refresh team information."
            );

            return activeTeam;
        } finally {
            setRefreshing(false);
        }
    };

    // ========================================================
    // HANDLE TEAM RETURNED DIRECTLY BY SERVICE
    // ========================================================

    const applyUpdatedTeam = async (
        updatedTeam
    ) => {
        if (!updatedTeam) {
            return;
        }

        setCurrentTeam(updatedTeam);

        if (
            typeof onTeamUpdated ===
            "function"
        ) {
            onTeamUpdated(updatedTeam);
        }

        await loadActivityHistory(
            getTeamId(updatedTeam)
        );
    };

    // ========================================================
    // HANDLE ADD MEMBERS
    //
    // TEAM-006
    // ========================================================

    const handleAddMembers = async (
        selectedMembers
    ) => {
        if (
            !Array.isArray(selectedMembers) ||
            selectedMembers.length === 0
        ) {
            return;
        }

        if (
            teamId === null ||
            teamId === undefined ||
            teamId === ""
        ) {
            setAddError(
                "Unable to add members because the team ID is missing."
            );

            return;
        }

        setAddError("");
        setRemoveError("");

        let addedCount = 0;
        let failedCount = 0;

        let latestUpdatedTeam = null;

        for (
            const selectedMember of
            selectedMembers
        ) {
            try {
                let userId = null;
                let contributorTypeId;
                let contributorSubTypeId;

                // ====================================================
                // OBJECT SELECTION
                // ====================================================

                if (
                    selectedMember &&
                    typeof selectedMember ===
                        "object"
                ) {
                    userId =
                        selectedMember.userId ??
                        selectedMember.UserId ??
                        selectedMember.userID ??
                        selectedMember.UserID ??
                        selectedMember.id ??
                        selectedMember.Id ??
                        selectedMember._id ??
                        null;

                    contributorTypeId =
                        selectedMember.contributorTypeId ??
                        selectedMember.ContributorTypeId ??
                        selectedMember.contributorTypeID ??
                        selectedMember.ContributorTypeID;

                    contributorSubTypeId =
                        selectedMember.contributorSubTypeId ??
                        selectedMember.ContributorSubTypeId ??
                        selectedMember.contributorSubtypeId ??
                        selectedMember.ContributorSubtypeId ??
                        selectedMember.contributorSubTypeID ??
                        selectedMember.ContributorSubTypeID;
                } else {
                    userId =
                        selectedMember;
                }

                if (
                    userId === null ||
                    userId === undefined ||
                    userId === ""
                ) {
                    failedCount++;

                    console.error(
                        "Unable to add member: missing userId.",
                        selectedMember
                    );

                    continue;
                }

                // ====================================================
                // EXISTING SERVICE
                // ====================================================

                const result =
                    await addMemberToTeam(
                        teamId,
                        userId,
                        {
                            contributorTypeId,
                            contributorSubTypeId,
                            performedBy: "Admin",
                        }
                    );

                // ====================================================
                // SERVICE ERROR
                // ====================================================

                if (
                    result?.success === false
                ) {
                    failedCount++;

                    console.error(
                        "Unable to add member:",
                        result
                    );

                    continue;
                }

                // ====================================================
                // SUCCESS
                // ====================================================

                if (
                    isServiceSuccess(result)
                ) {
                    addedCount++;

                    const returnedTeam =
                        extractTeamFromResponse(
                            result
                        );

                    if (returnedTeam) {
                        latestUpdatedTeam =
                            returnedTeam;
                    }

                    continue;
                }

                // ====================================================
                // CREATED/UPDATED TEAM RETURNED DIRECTLY
                // ====================================================

                const returnedTeam =
                    extractTeamFromResponse(
                        result
                    );

                if (returnedTeam) {
                    addedCount++;

                    latestUpdatedTeam =
                        returnedTeam;

                    continue;
                }

                // ====================================================
                // UNKNOWN RESPONSE
                // ====================================================

                if (
                    result &&
                    !result.error &&
                    !result.errors &&
                    !result.message
                ) {
                    addedCount++;
                } else {
                    failedCount++;

                    console.error(
                        "Unable to add member:",
                        result
                    );
                }
            } catch (error) {
                failedCount++;

                console.error(
                    "Unable to add member:",
                    error
                );
            }
        }

        // ========================================================
        // APPLY RETURNED TEAM
        // ========================================================

        if (latestUpdatedTeam) {
            await applyUpdatedTeam(
                latestUpdatedTeam
            );
        } else if (addedCount > 0) {
            await refreshTeam();
        }

        // ========================================================
        // CLOSE ONLY WHEN AT LEAST ONE MEMBER WAS ADDED
        // ========================================================

        if (addedCount > 0) {
            setAddMembersOpen(false);
        }

        // ========================================================
        // DISPLAY PARTIAL FAILURE
        // ========================================================

        if (failedCount > 0) {
            setAddError(
                `${failedCount} member${
                    failedCount === 1
                        ? ""
                        : "s"
                } could not be added.`
            );
        }
    };

    // ========================================================
    // HANDLE REMOVE MEMBER
    //
    // TEAM-007
    // ========================================================

    const handleRemoveMember = async (
        member
    ) => {
        const memberId =
            getMemberId(member);

        if (
            memberId === null ||
            memberId === undefined ||
            memberId === ""
        ) {
            setRemoveError(
                "Unable to identify this member."
            );

            return;
        }

        if (
            teamId === null ||
            teamId === undefined ||
            teamId === ""
        ) {
            setRemoveError(
                "Unable to identify the team."
            );

            return;
        }

        const memberName =
            getMemberName(member);

        const confirmed =
            window.confirm(
                `Are you sure you want to remove "${memberName}" from "${getTeamName(
                    activeTeam
                )}"?`
            );

        if (!confirmed) {
            return;
        }

        setRemoveError("");
        setAddError("");
        setRemovingMemberId(memberId);

        try {
            const result =
                await removeMemberFromTeam(
                    teamId,
                    memberId,
                    {
                        performedBy: "Admin",
                    }
                );

            // ====================================================
            // BACKEND / SERVICE FAILURE
            // ====================================================

            if (
                result?.success === false
            ) {
                setRemoveError(
                    result?.message ||
                        result?.error ||
                        "Unable to remove member."
                );

                return;
            }

            // ====================================================
            // UPDATED TEAM RETURNED
            // ====================================================

            const updatedTeam =
                extractTeamFromResponse(
                    result
                );

            if (updatedTeam) {
                await applyUpdatedTeam(
                    updatedTeam
                );

                return;
            }

            // ====================================================
            // NORMAL SUCCESS
            // ====================================================

            if (
                isServiceSuccess(result)
            ) {
                await refreshTeam();

                return;
            }

            // ====================================================
            // UNKNOWN RESPONSE
            // ====================================================

            setRemoveError(
                result?.message ||
                    result?.error ||
                    "Unable to remove member."
            );
        } catch (error) {
            console.error(
                "Unable to remove member:",
                error
            );

            const backendMessage =
                error?.response?.data?.message ||
                error?.response?.data?.title ||
                error?.response?.data?.error ||
                error?.message;

            setRemoveError(
                backendMessage ||
                    "Unable to remove member. Please try again."
            );
        } finally {
            setRemovingMemberId(null);
        }
    };

    // ========================================================
    // CLOSE
    // ========================================================

    const handleClose = () => {
        if (refreshing) {
            return;
        }

        setAddMembersOpen(false);
        setAddError("");
        setRemoveError("");
        setRefreshError("");

        if (
            typeof onClose === "function"
        ) {
            onClose();
        }
    };

    // ========================================================
    // CLOSED STATE
    // ========================================================

    if (!open) {
        return null;
    }

    // ========================================================
    // TEAM NOT FOUND
    // ========================================================

    if (!activeTeam) {
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
            >
                <div
                    className="
                        w-full
                        max-w-md
                        rounded-2xl
                        border
                        border-border
                        bg-card
                        p-6
                        shadow-2xl
                    "
                >
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold">
                            Team not found
                        </h2>

                        <button
                            type="button"
                            onClick={handleClose}
                            className="
                                rounded-lg
                                p-2
                                text-muted-foreground
                                transition
                                hover:bg-muted
                                hover:text-foreground
                            "
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <p className="mt-4 text-sm text-muted-foreground">
                        The selected team could not be
                        found.
                    </p>
                </div>
            </div>
        );
    }

    // ========================================================
    // DISPLAY DATA
    // ========================================================

    const teamName =
        getTeamName(activeTeam);

    const description =
        getTeamDescription(activeTeam);

    const status =
        getTeamStatus(activeTeam);

    const organization =
        getTeamOrganization(activeTeam);

    const createdAt =
        activeTeam.createdAt ??
        activeTeam.CreatedAt ??
        activeTeam.createdDate ??
        activeTeam.CreatedDate ??
        activeTeam.creationDate ??
        activeTeam.CreationDate ??
        null;

    const manager =
        activeTeam.manager ??
        activeTeam.Manager ??
        activeTeam.managerName ??
        activeTeam.ManagerName ??
        activeTeam.assignedManager ??
        activeTeam.AssignedManager ??
        null;

    const teamLeader =
        activeTeam.teamLeader ??
        activeTeam.TeamLeader ??
        activeTeam.leader ??
        activeTeam.Leader ??
        activeTeam.teamLeaderName ??
        activeTeam.TeamLeaderName ??
        members.find(
            (member) => {
                const classification =
                    String(
                        getClassification(
                            member
                        )
                    )
                        .trim()
                        .toLowerCase();

                return (
                    classification ===
                    "team leader"
                );
            }
        ) ??
        null;

    // ========================================================
    // ACTIVE PROJECTS
    // ========================================================

    const activeProjects =
        activeTeam.activeProjects ??
        activeTeam.ActiveProjects ??
        (
            Array.isArray(
                activeTeam.projects ??
                    activeTeam.Projects
            )
                ? (
                      activeTeam.projects ??
                      activeTeam.Projects
                  ).filter(
                      (project) => {
                          const projectStatus =
                              String(
                                  project?.status ??
                                      project?.Status ??
                                      ""
                              )
                                  .trim()
                                  .toLowerCase();

                          return (
                              projectStatus ===
                              "active"
                          );
                      }
                  ).length
                : 0
        );

    // ========================================================
    // MEMBER COUNTS
    // ========================================================

    const developerCount =
        activeTeam.developerCount ??
        activeTeam.DeveloperCount ??
        members.filter(
            (member) => {
                const role =
                    String(
                        member?.role ??
                            member?.Role ??
                            member?.userRole ??
                            member?.UserRole ??
                            member?.type ??
                            member?.Type ??
                            ""
                    )
                        .trim()
                        .toLowerCase();

                return (
                    role ===
                        "developer" ||
                    role ===
                        "developers"
                );
            }
        ).length;

    const staffCount =
        activeTeam.staffCount ??
        activeTeam.StaffCount ??
        members.filter(
            (member) => {
                const role =
                    String(
                        member?.role ??
                            member?.Role ??
                            member?.userRole ??
                            member?.UserRole ??
                            member?.type ??
                            member?.Type ??
                            ""
                    )
                        .trim()
                        .toLowerCase();

                return (
                    role === "staff" ||
                    role ===
                        "support staff"
                );
            }
        ).length;

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <>
            {/* ====================================================
                OVERLAY
            ==================================================== */}

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
            >
                {/* =================================================
                    MODAL
                ================================================= */}

                <div
                    className="
                        flex
                        max-h-[92vh]
                        w-full
                        max-w-6xl
                        flex-col
                        overflow-hidden
                        rounded-2xl
                        border
                        border-border
                        bg-background
                        text-foreground
                        shadow-2xl
                    "
                >
                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            border-b
                            border-border
                            bg-card
                            px-6
                            py-5
                        "
                    >
                        <div className="flex min-w-0 items-center gap-3">
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
                                "
                            >
                                <UsersRound size={22} />
                            </div>

                            <div className="min-w-0">
                                <h2
                                    className="
                                        truncate
                                        text-xl
                                        font-bold
                                        text-foreground
                                    "
                                    title={teamName}
                                >
                                    {teamName}
                                </h2>

                                <p className="text-sm text-muted-foreground">
                                    Complete team information
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={refreshing}
                            className="
                                rounded-xl
                                p-2
                                text-muted-foreground
                                transition-all
                                duration-200
                                hover:bg-muted
                                hover:text-foreground
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                            aria-label="Close"
                        >
                            <X size={21} />
                        </button>
                    </div>

                    {/* =================================================
                        CONTENT
                    ================================================= */}

                    <div className="overflow-y-auto p-6">
                        {/* =============================================
                            REFRESH ERROR
                        ============================================= */}

                        {refreshError && (
                            <div
                                className="
                                    mb-5
                                    flex
                                    items-start
                                    gap-3
                                    rounded-xl
                                    border
                                    border-destructive/30
                                    bg-destructive/10
                                    p-4
                                    text-sm
                                    text-destructive
                                "
                            >
                                <AlertCircle
                                    size={18}
                                    className="mt-0.5 shrink-0"
                                />

                                <div>
                                    <p className="font-semibold">
                                        Refresh failed
                                    </p>

                                    <p className="mt-1">
                                        {refreshError}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* =============================================
                            BASIC INFORMATION
                        ============================================= */}

                        <div
                            className="
                                grid
                                grid-cols-1
                                gap-4
                                md:grid-cols-2
                            "
                        >
                            {/* TEAM NAME */}

                            <div
                                className="
                                    rounded-xl
                                    border
                                    border-border
                                    bg-card
                                    p-5
                                "
                            >
                                <p
                                    className="
                                        text-xs
                                        font-medium
                                        uppercase
                                        tracking-wide
                                        text-muted-foreground
                                    "
                                >
                                    Team Name
                                </p>

                                <p className="mt-2 text-base font-semibold">
                                    {teamName}
                                </p>
                            </div>

                            {/* STATUS */}

                            <div
                                className="
                                    rounded-xl
                                    border
                                    border-border
                                    bg-card
                                    p-5
                                "
                            >
                                <p
                                    className="
                                        text-xs
                                        font-medium
                                        uppercase
                                        tracking-wide
                                        text-muted-foreground
                                    "
                                >
                                    Status
                                </p>

                                <div className="mt-2">
                                    <span
                                        className={`
                                            inline-flex
                                            items-center
                                            gap-2
                                            rounded-full
                                            border
                                            px-3
                                            py-1.5
                                            text-xs
                                            font-semibold
                                            ${
                                                String(
                                                    status
                                                )
                                                    .toLowerCase() ===
                                                "active"
                                                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                                    : "border-muted-foreground/30 bg-muted text-muted-foreground"
                                            }
                                        `}
                                    >
                                        <span
                                            className={`
                                                h-1.5
                                                w-1.5
                                                rounded-full
                                                ${
                                                    String(
                                                        status
                                                    )
                                                        .toLowerCase() ===
                                                    "active"
                                                        ? "bg-emerald-500"
                                                        : "bg-muted-foreground"
                                                }
                                            `}
                                        />

                                        {status}
                                    </span>
                                </div>
                            </div>

                            {/* ORGANIZATION */}

                            <div
                                className="
                                    rounded-xl
                                    border
                                    border-border
                                    bg-card
                                    p-5
                                "
                            >
                                <p
                                    className="
                                        text-xs
                                        font-medium
                                        uppercase
                                        tracking-wide
                                        text-muted-foreground
                                    "
                                >
                                    Organization
                                </p>

                                <p className="mt-2 text-base font-semibold">
                                    {organization}
                                </p>
                            </div>

                            {/* CREATED */}

                            <div
                                className="
                                    rounded-xl
                                    border
                                    border-border
                                    bg-card
                                    p-5
                                "
                            >
                                <p
                                    className="
                                        text-xs
                                        font-medium
                                        uppercase
                                        tracking-wide
                                        text-muted-foreground
                                    "
                                >
                                    Created
                                </p>

                                <p className="mt-2 text-base font-semibold">
                                    {formatDate(
                                        createdAt
                                    )}
                                </p>
                            </div>

                            {/* DESCRIPTION */}

                            <div
                                className="
                                    rounded-xl
                                    border
                                    border-border
                                    bg-card
                                    p-5
                                    md:col-span-2
                                "
                            >
                                <p
                                    className="
                                        text-xs
                                        font-medium
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
                                        text-sm
                                        leading-6
                                        text-foreground
                                    "
                                >
                                    {description}
                                </p>
                            </div>
                        </div>

                        {/* =============================================
                            SUMMARY
                        ============================================= */}

                        <div
                            className="
                                mt-6
                                grid
                                grid-cols-1
                                gap-4
                                sm:grid-cols-2
                                lg:grid-cols-4
                            "
                        >
                            {/* MEMBERS */}

                            <div
                                className="
                                    rounded-xl
                                    border
                                    border-border
                                    bg-card
                                    p-4
                                "
                            >
                                <div className="flex items-center gap-3">
                                    <UsersRound
                                        size={20}
                                        className="text-primary"
                                    />

                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Members
                                        </p>

                                        <p className="text-xl font-bold">
                                            {
                                                members.length
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* DEVELOPERS */}

                            <div
                                className="
                                    rounded-xl
                                    border
                                    border-border
                                    bg-card
                                    p-4
                                "
                            >
                                <div className="flex items-center gap-3">
                                    <UserRound
                                        size={20}
                                        className="text-violet-500"
                                    />

                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Developers
                                        </p>

                                        <p className="text-xl font-bold">
                                            {
                                                developerCount
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* STAFF */}

                            <div
                                className="
                                    rounded-xl
                                    border
                                    border-border
                                    bg-card
                                    p-4
                                "
                            >
                                <div className="flex items-center gap-3">
                                    <UserCog
                                        size={20}
                                        className="text-emerald-500"
                                    />

                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Staff
                                        </p>

                                        <p className="text-xl font-bold">
                                            {
                                                staffCount
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* PROJECTS */}

                            <div
                                className="
                                    rounded-xl
                                    border
                                    border-border
                                    bg-card
                                    p-4
                                "
                            >
                                <div className="flex items-center gap-3">
                                    <FolderKanban
                                        size={20}
                                        className="text-blue-500"
                                    />

                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Active Projects
                                        </p>

                                        <p className="text-xl font-bold">
                                            {
                                                activeProjects
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* =============================================
                            MANAGER / TEAM LEADER
                        ============================================= */}

                        <div
                            className="
                                mt-6
                                grid
                                grid-cols-1
                                gap-4
                                md:grid-cols-2
                            "
                        >
                            {/* MANAGER */}

                            <div
                                className="
                                    rounded-xl
                                    border
                                    border-border
                                    bg-card
                                    p-5
                                "
                            >
                                <div className="flex items-center gap-3">
                                    <UserCog
                                        size={20}
                                        className="text-primary"
                                    />

                                    <div className="min-w-0">
                                        <p className="text-xs text-muted-foreground">
                                            Assigned Manager
                                        </p>

                                        <p className="mt-1 truncate font-semibold">
                                            {typeof manager ===
                                            "object"
                                                ? getMemberName(
                                                      manager
                                                  )
                                                : manager ||
                                                  "Not assigned"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* TEAM LEADER */}

                            <div
                                className="
                                    rounded-xl
                                    border
                                    border-border
                                    bg-card
                                    p-5
                                "
                            >
                                <div className="flex items-center gap-3">
                                    <ShieldCheck
                                        size={20}
                                        className="text-emerald-500"
                                    />

                                    <div className="min-w-0">
                                        <p className="text-xs text-muted-foreground">
                                            Team Leader
                                        </p>

                                        <p className="mt-1 truncate font-semibold">
                                            {typeof teamLeader ===
                                            "object"
                                                ? getMemberName(
                                                      teamLeader
                                                  )
                                                : teamLeader ||
                                                  "Not assigned"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* =============================================
                            TEAM MEMBERS
                        ============================================= */}

                        <div
                            className="
                                mt-6
                                overflow-hidden
                                rounded-xl
                                border
                                border-border
                                bg-card
                            "
                        >
                            {/* HEADER */}

                            <div
                                className="
                                    flex
                                    flex-col
                                    gap-3
                                    border-b
                                    border-border
                                    px-5
                                    py-4
                                    sm:flex-row
                                    sm:items-center
                                    sm:justify-between
                                "
                            >
                                <div>
                                    <div className="flex items-center gap-2">
                                        <UsersRound
                                            size={19}
                                            className="text-primary"
                                        />

                                        <h3 className="font-semibold">
                                            Team Members
                                        </h3>
                                    </div>

                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Member roles, permissions and
                                        classifications
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {/* REFRESH */}

                                    <button
                                        type="button"
                                        onClick={
                                            refreshTeam
                                        }
                                        disabled={
                                            refreshing ||
                                            activityLoading
                                        }
                                        className="
                                            inline-flex
                                            items-center
                                            justify-center
                                            gap-2
                                            rounded-xl
                                            border
                                            border-border
                                            bg-background
                                            px-3
                                            py-2.5
                                            text-sm
                                            font-semibold
                                            text-foreground
                                            transition-all
                                            duration-300
                                            hover:border-primary/50
                                            hover:bg-primary/10
                                            hover:text-primary
                                            disabled:cursor-not-allowed
                                            disabled:opacity-50
                                        "
                                        title="Refresh team"
                                    >
                                        <RefreshCw
                                            size={16}
                                            className={
                                                refreshing
                                                    ? "animate-spin"
                                                    : ""
                                            }
                                        />

                                        Refresh
                                    </button>

                                    {/* ADD */}

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setAddError(
                                                ""
                                            );

                                            setRemoveError(
                                                ""
                                            );

                                            setAddMembersOpen(
                                                true
                                            );
                                        }}
                                        disabled={
                                            refreshing
                                        }
                                        className="
                                            inline-flex
                                            items-center
                                            justify-center
                                            gap-2
                                            rounded-xl
                                            border
                                            border-emerald-500/30
                                            bg-emerald-500/10
                                            px-4
                                            py-2.5
                                            text-sm
                                            font-semibold
                                            text-emerald-600
                                            transition-all
                                            duration-300
                                            hover:-translate-y-0.5
                                            hover:border-emerald-500/50
                                            hover:bg-emerald-500/20
                                            disabled:cursor-not-allowed
                                            disabled:opacity-50
                                            dark:text-emerald-400
                                        "
                                    >
                                        <UserPlus size={17} />

                                        Add Members
                                    </button>
                                </div>
                            </div>

                            {/* ADD ERROR */}

                            {addError && (
                                <div
                                    className="
                                        border-b
                                        border-destructive/20
                                        bg-destructive/10
                                        px-5
                                        py-3
                                        text-sm
                                        text-destructive
                                    "
                                >
                                    {addError}
                                </div>
                            )}

                            {/* REMOVE ERROR */}

                            {removeError && (
                                <div
                                    className="
                                        border-b
                                        border-destructive/20
                                        bg-destructive/10
                                        px-5
                                        py-3
                                        text-sm
                                        text-destructive
                                    "
                                >
                                    {removeError}
                                </div>
                            )}

                            {/* REFRESH STATUS */}

                            {refreshing && (
                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        border-b
                                        border-border
                                        bg-muted/20
                                        px-5
                                        py-2.5
                                        text-xs
                                        text-muted-foreground
                                    "
                                >
                                    <Loader2
                                        size={14}
                                        className="animate-spin"
                                    />

                                    Refreshing team information...
                                </div>
                            )}

                            {/* MEMBERS */}

                            {members.length === 0 ? (
                                <div className="px-5 py-12 text-center">
                                    <UsersRound
                                        size={38}
                                        className="mx-auto text-muted-foreground"
                                    />

                                    <p className="mt-3 text-sm font-semibold">
                                        No team members
                                    </p>

                                    <p className="mt-1 text-xs text-muted-foreground">
                                        No members have been assigned
                                        to this team yet.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setAddError(
                                                ""
                                            );

                                            setAddMembersOpen(
                                                true
                                            );
                                        }}
                                        className="
                                            mt-5
                                            inline-flex
                                            items-center
                                            gap-2
                                            rounded-lg
                                            bg-primary
                                            px-4
                                            py-2
                                            text-sm
                                            font-semibold
                                            text-primary-foreground
                                            transition
                                            hover:opacity-90
                                        "
                                    >
                                        <UserPlus size={16} />

                                        Add First Member
                                    </button>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-muted/30">
                                            <tr className="border-b border-border text-left">
                                                <th className="px-5 py-3 font-semibold">
                                                    Member
                                                </th>

                                                <th className="px-5 py-3 font-semibold">
                                                    System Role
                                                </th>

                                                <th className="px-5 py-3 font-semibold">
                                                    Classification
                                                </th>

                                                <th className="px-5 py-3 font-semibold">
                                                    Sub-Type
                                                </th>

                                                <th className="px-5 py-3 font-semibold">
                                                    Permissions
                                                </th>

                                                <th className="px-5 py-3 text-right font-semibold">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {members.map(
                                                (
                                                    member,
                                                    index
                                                ) => {
                                                    const classification =
                                                        getClassification(
                                                            member
                                                        );

                                                    const classificationLower =
                                                        String(
                                                            classification
                                                        )
                                                            .trim()
                                                            .toLowerCase();

                                                    let subtype =
                                                        null;

                                                    if (
                                                        classificationLower.includes(
                                                            "developer"
                                                        )
                                                    ) {
                                                        subtype =
                                                            getDeveloperSubtype(
                                                                member
                                                            );
                                                    } else if (
                                                        classificationLower.includes(
                                                            "staff"
                                                        )
                                                    ) {
                                                        subtype =
                                                            getStaffSubtype(
                                                                member
                                                            );
                                                    }

                                                    const permissions =
                                                        getPermissions(
                                                            member
                                                        );

                                                    const memberId =
                                                        getMemberId(
                                                            member
                                                        );

                                                    const isRemoving =
                                                        String(
                                                            removingMemberId
                                                        ) ===
                                                        String(
                                                            memberId
                                                        );

                                                    const key =
                                                        memberId ??
                                                        `${getMemberName(
                                                            member
                                                        )}-${index}`;

                                                    return (
                                                        <tr
                                                            key={String(
                                                                key
                                                            )}
                                                            className="
                                                                border-b
                                                                border-border
                                                                last:border-0
                                                                transition-colors
                                                                hover:bg-muted/30
                                                            "
                                                        >
                                                            {/* MEMBER */}

                                                            <td className="px-5 py-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div
                                                                        className="
                                                                            flex
                                                                            h-9
                                                                            w-9
                                                                            shrink-0
                                                                            items-center
                                                                            justify-center
                                                                            rounded-full
                                                                            bg-primary/10
                                                                            text-primary
                                                                        "
                                                                    >
                                                                        <UserRound
                                                                            size={
                                                                                17
                                                                            }
                                                                        />
                                                                    </div>

                                                                    <div className="min-w-0">
                                                                        <p className="truncate font-medium">
                                                                            {getMemberName(
                                                                                member
                                                                            )}
                                                                        </p>

                                                                        {getMemberEmail(
                                                                            member
                                                                        ) && (
                                                                            <p className="truncate text-xs text-muted-foreground">
                                                                                {getMemberEmail(
                                                                                    member
                                                                                )}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </td>

                                                            {/* ROLE */}

                                                            <td className="px-5 py-4">
                                                                <span
                                                                    className="
                                                                        rounded-full
                                                                        border
                                                                        border-blue-500/20
                                                                        bg-blue-500/10
                                                                        px-2.5
                                                                        py-1
                                                                        text-xs
                                                                        font-medium
                                                                        text-blue-600
                                                                        dark:text-blue-400
                                                                    "
                                                                >
                                                                    {getSystemRole(
                                                                        member
                                                                    )}
                                                                </span>
                                                            </td>

                                                            {/* CLASSIFICATION */}

                                                            <td className="px-5 py-4">
                                                                <span
                                                                    className="
                                                                        rounded-full
                                                                        bg-primary/10
                                                                        px-2.5
                                                                        py-1
                                                                        text-xs
                                                                        font-medium
                                                                        text-primary
                                                                    "
                                                                >
                                                                    {
                                                                        classification
                                                                    }
                                                                </span>
                                                            </td>

                                                            {/* SUBTYPE */}

                                                            <td className="px-5 py-4">
                                                                {subtype ||
                                                                    "—"}
                                                            </td>

                                                            {/* PERMISSIONS */}

                                                            <td className="px-5 py-4">
                                                                {permissions.length >
                                                                0 ? (
                                                                    <div className="flex max-w-xs flex-wrap gap-1">
                                                                        {permissions.map(
                                                                            (
                                                                                permission,
                                                                                permissionIndex
                                                                            ) => (
                                                                                <span
                                                                                    key={`${String(
                                                                                        permission
                                                                                    )}-${permissionIndex}`}
                                                                                    className="
                                                                                        rounded-md
                                                                                        bg-muted
                                                                                        px-2
                                                                                        py-1
                                                                                        text-xs
                                                                                    "
                                                                                >
                                                                                    {typeof permission ===
                                                                                    "object"
                                                                                        ? permission.name ??
                                                                                          permission.Name ??
                                                                                          permission.code ??
                                                                                          permission.Code ??
                                                                                          JSON.stringify(
                                                                                              permission
                                                                                          )
                                                                                        : String(
                                                                                              permission
                                                                                          )}
                                                                                </span>
                                                                            )
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-muted-foreground">
                                                                        No permissions
                                                                        listed
                                                                    </span>
                                                                )}
                                                            </td>

                                                            {/* REMOVE */}

                                                            <td className="px-5 py-4 text-right">
                                                                <button
                                                                    type="button"
                                                                    disabled={
                                                                        isRemoving ||
                                                                        refreshing
                                                                    }
                                                                    onClick={() =>
                                                                        handleRemoveMember(
                                                                            member
                                                                        )
                                                                    }
                                                                    title="Remove member from team"
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
                                                                        hover:border-destructive/50
                                                                        hover:bg-destructive/20
                                                                        disabled:cursor-not-allowed
                                                                        disabled:opacity-50
                                                                    "
                                                                >
                                                                    {isRemoving ? (
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

                                                                    {isRemoving
                                                                        ? "Removing..."
                                                                        : "Remove"}
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                }
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* =============================================
                            ACTIVITY HISTORY
                        ============================================= */}

                        <div
                            className="
                                mt-6
                                overflow-hidden
                                rounded-xl
                                border
                                border-border
                                bg-card
                            "
                        >
                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                    border-b
                                    border-border
                                    px-5
                                    py-4
                                "
                            >
                                <div className="flex items-center gap-2">
                                    <Activity
                                        size={19}
                                        className="text-primary"
                                    />

                                    <div>
                                        <h3 className="font-semibold">
                                            Team Activity History
                                        </h3>

                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Team management activities
                                        </p>
                                    </div>
                                </div>

                                {activityLoading && (
                                    <Loader2
                                        size={17}
                                        className="animate-spin text-primary"
                                    />
                                )}
                            </div>

                            {activityLoading &&
                            activityHistory.length ===
                                0 ? (
                                <div className="px-5 py-8 text-center">
                                    <Loader2
                                        size={24}
                                        className="mx-auto animate-spin text-primary"
                                    />

                                    <p className="mt-3 text-sm text-muted-foreground">
                                        Loading activity history...
                                    </p>
                                </div>
                            ) : activityHistory.length ===
                              0 ? (
                                <div className="px-5 py-8 text-center">
                                    <p className="text-sm text-muted-foreground">
                                        No team activity history
                                        available.
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y divide-border">
                                    {activityHistory.map(
                                        (
                                            activity,
                                            index
                                        ) => {
                                            const action =
                                                activity?.action ??
                                                activity?.Action ??
                                                activity?.type ??
                                                activity?.Type ??
                                                "Team activity";

                                            const description =
                                                activity?.description ??
                                                activity?.Description ??
                                                activity?.message ??
                                                activity?.Message ??
                                                "";

                                            const performedBy =
                                                activity?.performedBy ??
                                                activity?.PerformedBy ??
                                                activity?.user ??
                                                activity?.User ??
                                                "";

                                            const createdAt =
                                                activity?.createdAt ??
                                                activity?.CreatedAt ??
                                                activity?.timestamp ??
                                                activity?.Timestamp ??
                                                null;

                                            return (
                                                <div
                                                    key={
                                                        activity?.id ??
                                                        activity?.Id ??
                                                        `${action}-${index}`
                                                    }
                                                    className="
                                                        px-5
                                                        py-4
                                                        transition-colors
                                                        hover:bg-muted/20
                                                    "
                                                >
                                                    <div className="flex gap-3">
                                                        <div
                                                            className="
                                                                mt-1
                                                                flex
                                                                h-8
                                                                w-8
                                                                shrink-0
                                                                items-center
                                                                justify-center
                                                                rounded-lg
                                                                bg-primary/10
                                                                text-primary
                                                            "
                                                        >
                                                            <Activity
                                                                size={
                                                                    15
                                                                }
                                                            />
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p className="text-sm font-semibold">
                                                                {
                                                                    action
                                                                }
                                                            </p>

                                                            {description && (
                                                                <p className="mt-1 text-sm text-muted-foreground">
                                                                    {
                                                                        description
                                                                    }
                                                                </p>
                                                            )}

                                                            {(performedBy ||
                                                                createdAt) && (
                                                                <p className="mt-2 text-xs text-muted-foreground">
                                                                    {performedBy
                                                                        ? `By ${performedBy}`
                                                                        : ""}

                                                                    {performedBy &&
                                                                    createdAt
                                                                        ? " • "
                                                                        : ""}

                                                                    {createdAt
                                                                        ? formatDateTime(
                                                                              createdAt
                                                                          )
                                                                        : ""}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* =================================================
                        FOOTER
                    ================================================= */}

                    <div
                        className="
                            flex
                            justify-between
                            gap-3
                            border-t
                            border-border
                            bg-card
                            px-6
                            py-4
                        "
                    >
                        <div className="flex items-center text-xs text-muted-foreground">
                            {teamId !== null &&
                            teamId !== undefined ? (
                                <>
                                    Team ID:
                                    <span className="ml-1 select-all font-semibold text-foreground">
                                        {String(
                                            teamId
                                        )}
                                    </span>
                                </>
                            ) : (
                                "Team ID unavailable"
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={refreshing}
                            className="
                                rounded-xl
                                border
                                border-border
                                bg-background
                                px-5
                                py-2.5
                                text-sm
                                font-semibold
                                text-foreground
                                transition-all
                                duration-200
                                hover:border-primary/50
                                hover:bg-primary/10
                                hover:text-primary
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            Back to Team List
                        </button>
                    </div>
                </div>
            </div>

            {/* ========================================================
                ADD MEMBERS MODAL
            ======================================================== */}

            <AddMembersModal
                open={addMembersOpen}
                team={activeTeam}
                onClose={() => {
                    setAddMembersOpen(false);
                    setAddError("");
                }}
                onSuccess={handleAddMembers}
                performedBy="Admin"
            />
        </>
    );
}

export default ViewTeamDetails;
