import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    AlertCircle,
    CheckCircle2,
    Loader2,
    Plus,
    RefreshCw,
    UsersRound,
    X,
    UserPlus,
    UserMinus,
    Trash2,
} from "lucide-react";

import TeamTable from "@/components/admin/Teams/TeamTable";

import {
    addMemberToTeam,
    assignTeamManager,
    createTeam,
    deleteTeam,
    getTeamById,
    getTeamMembers,
    getTeams,
    removeMemberFromTeam,
    updateTeam,
} from "@/services/teamService";
import api from "@/services/api";
import {
    getAllUsers,
    getUsersByRole,
    USER_ROLES,
} from "@/services/userService";
function TeamManagement() {
    // ========================================================
    // TEAMS
    // ========================================================

    const [teams, setTeams] = useState([]);
    const [managers, setManagers] = useState([]);
    const [availableUsers, setAvailableUsers] = useState([]);
const [allUsers, setAllUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Page-level messages
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // ========================================================
    // CREATE TEAM
    // ========================================================

    const [createOpen, setCreateOpen] = useState(false);
    const [creating, setCreating] = useState(false);

    const [createError, setCreateError] = useState("");
    const [createSuccess, setCreateSuccess] = useState("");

    const [createForm, setCreateForm] = useState({
        name: "",
        description: "",
        managerId: "",
    });
    const [contributorTypes, setContributorTypes] = useState([]);
    const [contributorSubTypes, setContributorSubTypes] =
    useState([]);

const [
    isLoadingContributorSubTypes,
    setIsLoadingContributorSubTypes
] = useState(false);

    const [memberForm, setMemberForm] = useState({
        userId: "",
        contributorTypeId: "",
        contributorSubTypeId: "",
    });

    const [selectedMembers, setSelectedMembers] = useState([]);

    // ========================================================
    // EDIT
    // ========================================================

    const [editOpen, setEditOpen] = useState(false);
    const [editing, setEditing] = useState(false);
    const [editingTeam, setEditingTeam] = useState(null);

    const [editForm, setEditForm] = useState({
        name: "",
        description: "",
        managerId: "",
        isActive: true,
    });

    // ========================================================
    // DELETE
    // ========================================================

    const [deletingTeamId, setDeletingTeamId] = useState(null);

    // ========================================================
    // VIEW
    // ========================================================

    const [viewOpen, setViewOpen] = useState(false);
    const [viewingTeam, setViewingTeam] = useState(null);
    const [viewMembers, setViewMembers] = useState([]);
    const [loadingMembers, setLoadingMembers] = useState(false);

    // ========================================================
    // MANAGE MEMBERS
    // ========================================================

    const [membersOpen, setMembersOpen] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState(null);

    const [teamMembers, setTeamMembers] = useState([]);

    const [selectedUserId, setSelectedUserId] = useState("");
    const [selectedContributorTypeId, setSelectedContributorTypeId] =
        useState("");
    const [selectedContributorSubTypeId, setSelectedContributorSubTypeId] =
        useState("");

    const [addingMember, setAddingMember] = useState(false);
    const [removingMemberId, setRemovingMemberId] = useState(null);

    // ========================================================
    // HELPERS
    // ========================================================

    const getTeamId = (team) => {
        if (!team) return null;

        return (
            team.id ||
            team.teamId ||
            team.teamID ||
            team._id ||
            null
        );
    };

    const getUserId = (user) => {
        if (!user) return null;

        return (
            user.id ||
            user.userId ||
            user.userID ||
            null
        );
    };

    const getManagerId = (team) => {
        if (!team) return "";

        return (
            team.managerId ||
            team.managerID ||
            team.manager?.id ||
            team.manager?.userId ||
            team.manager?.userID ||
            ""
        );
    };

    const getUserName = (user) => {
        if (!user) return "Unknown user";

        return (
            user.fullName ||
            user.name ||
            user.userName ||
            user.email ||
            "Unknown user"
        );
    };

    const getErrorMessage = (err) => {
        const responseData = err?.response?.data;

        if (typeof responseData === "string") {
            return responseData;
        }

        if (responseData?.errors) {
            const errors = responseData.errors;

            return Object.entries(errors)
                .map(([field, messages]) => {
                    const messageList = Array.isArray(messages)
                        ? messages
                        : [messages];

                    return `${field}: ${messageList.join(", ")}`;
                })
                .join("\n");
        }

        return (
            responseData?.message ||
            responseData?.error ||
            err?.message ||
            "An unexpected error occurred."
        );
    };

    const clearPageMessages = () => {
        setError("");
        setSuccessMessage("");
    };

    const clearCreateMessages = () => {
        setCreateError("");
        setCreateSuccess("");
    };

    // ========================================================
    // LOAD TEAMS
    // ========================================================

    const loadTeams = useCallback(async () => {
        try {
            const result = await getTeams();

            console.log("GET TEAMS RESULT:", result);

            const data =
                Array.isArray(result)
                    ? result
                    : Array.isArray(result?.data)
                        ? result.data
                        : Array.isArray(result?.teams)
                            ? result.teams
                            : Array.isArray(result?.items)
                                ? result.items
                                : [];

            setTeams(data);

            return data;
        } catch (err) {
            console.error("LOAD TEAMS ERROR:", err);

            setTeams([]);

            throw err;
        }
    }, []);

    // ========================================================
    // LOAD MANAGERS
    // ========================================================

    const loadManagers = useCallback(async () => {
        try {
            const result = await getUsersByRole("Manager");

            const data =
                Array.isArray(result)
                    ? result
                    : Array.isArray(result?.data)
                        ? result.data
                        : Array.isArray(result?.users)
                            ? result.users
                            : [];

            setManagers(data);
        } catch (err) {
            console.error("LOAD MANAGERS ERROR:", err);

            setManagers([]);
        }
    }, []);

    // ========================================================
    // LOAD CONTRIBUTORS
    // ========================================================

  const loadAvailableUsers = useCallback(async () => {
    try {
        const users = await getAllUsers();

        console.log(
            "========== LOAD AVAILABLE USERS =========="
        );

        console.log(
            "ALL USERS FROM getAllUsers:",
            users
        );

        users.forEach((user, index) => {
            console.log(
                `USER ${index}:`,
                {
                    id: user?.id,
                    userId: user?.userId,
                    fullName: user?.fullName,
                    email: user?.email,
                    role: user?.role,
                    rawRole: user?.rawRole,
                    isActive: user?.isActive,
                }
            );
        });

        const activeContributors = users.filter(
            (user) =>
                user?.role === "Contributor" &&
                user?.isActive !== false
        );

        console.log(
            "ACTIVE CONTRIBUTORS:",
            activeContributors
        );

        setAvailableUsers(
            activeContributors
        );

        console.log(
            "=========================================="
        );
    } catch (err) {
        console.error(
            "LOAD AVAILABLE USERS ERROR:",
            err
        );

        setAvailableUsers([]);
    }
}, []);

    // ========================================================
    // LOAD CONTRIBUTOR TYPES
    //
    // IMPORTANT:
    // Replace this with your real API service if you already
    // have an endpoint for contributor types.
    // ========================================================

  const loadContributorTypes = useCallback(async () => {
    try {
        const response = await api.get(
            "/ContributorTypes/active"
        );

        console.log(
            "CONTRIBUTOR TYPES RESPONSE:",
            response.data
        );

        const types =
            Array.isArray(response.data)
                ? response.data
                : [];

        setContributorTypes(types);
    } catch (err) {
        console.error(
            "LOAD CONTRIBUTOR TYPES ERROR:",
            err
        );

        setContributorTypes([]);
    }
}, []);
const loadContributorSubTypes =
    useCallback(
        async (contributorTypeId) => {
            if (!contributorTypeId) {
                setContributorSubTypes([]);
                return;
            }

            try {
                setIsLoadingContributorSubTypes(
                    true
                );

                const response =
                    await api.get(
                        `/ContributorSubTypes/type/${contributorTypeId}`
                    );

                console.log(
                    "CONTRIBUTOR SUBTYPES RESPONSE:",
                    response.data
                );

                const subTypes =
                    Array.isArray(response.data)
                        ? response.data
                        : [];

                setContributorSubTypes(
                    subTypes
                );
            } catch (err) {
                console.error(
                    "LOAD CONTRIBUTOR SUBTYPES ERROR:",
                    err
                );

                setContributorSubTypes([]);
            } finally {
                setIsLoadingContributorSubTypes(
                    false
                );
            }
        },
        []
    );
    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {
        let mounted = true;

        const loadInitialData = async () => {
            try {
                setLoading(true);
                clearPageMessages();

                await Promise.all([
                    loadTeams(),
                    loadManagers(),
                    loadAvailableUsers(),
                    loadContributorTypes(),
                ]);
            } catch (err) {
                if (mounted) {
                    setError(
                        getErrorMessage(err) ||
                        "Unable to load team management data."
                    );
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        loadInitialData();

        return () => {
            mounted = false;
        };
    }, [
        loadTeams,
        loadManagers,
        loadAvailableUsers,
        loadContributorTypes,
    ]);

    // ========================================================
    // FILTER TEAMS
    // ========================================================

    const filteredTeams = useMemo(() => {
        const term = searchTerm
            .trim()
            .toLowerCase();

        if (!term) {
            return teams;
        }

        return teams.filter((team) => {
            const managerName =
                team.managerName ||
                team.manager?.fullName ||
                team.manager?.name ||
                team.manager?.email ||
                "";

            const status =
                team.isActive === false
                    ? "inactive"
                    : "active";

            return [
                team.name,
                team.description,
                managerName,
                status,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase()
                .includes(term);
        });
    }, [teams, searchTerm]);

    // ========================================================
    // REFRESH
    // ========================================================

    const handleRefresh = async () => {
        try {
            setRefreshing(true);
            clearPageMessages();

            await Promise.all([
                loadTeams(),
                loadManagers(),
                loadAvailableUsers(),
            ]);

            setSuccessMessage(
                "Teams refreshed successfully."
            );
        } catch (err) {
            console.error("REFRESH ERROR:", err);

            setError(
                getErrorMessage(err) ||
                "Unable to refresh teams."
            );
        } finally {
            setRefreshing(false);
        }
    };

    // ========================================================
    // CREATE FORM CHANGE
    // ========================================================

    const handleCreateChange = (event) => {
        const {
            name,
            value,
        } = event.target;

        setCreateForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // ========================================================
    // MEMBER FORM CHANGE
    // ========================================================

    const handleMemberFormChange = (event) => {
        const {
            name,
            value,
        } = event.target;

        setMemberForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // ========================================================
    // SELECTED MEMBER
    // ========================================================

    const handleAddSelectedMember = () => {
        clearCreateMessages();

        if (!memberForm.userId) {
            setCreateError(
                "Please select a team member."
            );
            return;
        }

        if (!memberForm.contributorTypeId) {
            setCreateError(
                "Please select a contributor type."
            );
            return;
        }

        /*
         * Developer / Staff subtypes are optional here.
         * Your backend can enforce whether they are required.
         */

        const alreadySelected = selectedMembers.some(
            (member) =>
                String(member.userId) ===
                String(memberForm.userId)
        );

        if (alreadySelected) {
            setCreateError(
                "This user is already selected."
            );
            return;
        }

        const user = availableUsers.find(
            (item) =>
                String(getUserId(item)) ===
                String(memberForm.userId)
        );

       const contributorType =
    contributorTypes.find((item) => {
        const typeId =
            item?.id ??
            item?.contributorTypeId ??
            item?.Id ??
            item?.ContributorTypeId;

        return (
            String(typeId) ===
            String(memberForm.contributorTypeId)
        );
    });

const contributorTypeId =
    contributorType?.id ??
    contributorType?.contributorTypeId ??
    contributorType?.Id ??
    contributorType?.ContributorTypeId ??
    memberForm.contributorTypeId;
       const contributorSubType =
    contributorSubTypes.find((item) => {
        const subTypeId =
            item?.id ??
            item?.contributorSubTypeId ??
            item?.Id ??
            item?.ContributorSubTypeId;

        return (
            String(subTypeId) ===
            String(memberForm.contributorSubTypeId)
        );
    });
    console.log("ADDING MEMBER:", {
    user: getUserName(user),
    memberFormContributorTypeId:
        memberForm.contributorTypeId,
    foundContributorType:
        contributorType,
    calculatedContributorTypeId:
        contributorTypeId,
});
      setSelectedMembers((previous) => [
    ...previous,
    {
        userId: memberForm.userId,
        user,

        // IMPORTANT: Store the real Contributor Type UUID/GUID
        contributorTypeId,

        // Display name only for the UI
        contributorTypeName:
            contributorType?.name ||
            contributorType?.displayName ||
            "Contributor",

        contributorSubTypeId:
            memberForm.contributorSubTypeId ||
            null,

        contributorSubTypeName:
            contributorSubType?.name ||
            contributorSubType?.displayName ||
            "",
    },
]);;

        setMemberForm({
            userId: "",
            contributorTypeId: "",
            contributorSubTypeId: "",
        });
    };

    // ========================================================
    // REMOVE SELECTED MEMBER
    // ========================================================

    const handleRemoveSelectedMember = (userId) => {
        setSelectedMembers((previous) =>
            previous.filter(
                (member) =>
                    String(member.userId) !==
                    String(userId)
            )
        );
    };

    // ========================================================
    // CREATE TEAM
    // ========================================================

    const handleCreateTeam = async (event) => {
        event.preventDefault();

        clearCreateMessages();

        const name = createForm.name.trim();
        const description =
            createForm.description.trim();

        if (!name) {
            setCreateError(
                "Team name is required."
            );
            return;
        }

        if (name.length > 100) {
            setCreateError(
                "Team name cannot exceed 100 characters."
            );
            return;
        }

        if (description.length > 500) {
            setCreateError(
                "Description cannot exceed 500 characters."
            );
            return;
        }
console.log(
    "SELECTED MEMBERS BEFORE CREATE:",
    JSON.stringify(selectedMembers, null, 2)
);
        /*
         * Validate contributor IDs before sending.
         *
         * A GUID normally looks like:
         *
         * xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
         */

       const guidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        for (const member of selectedMembers) {
            if (
                !guidRegex.test(
                    String(member.contributorTypeId)
                )
            ) {
                setCreateError(
                    `Invalid Contributor Type ID for ${getUserName(member.user)}. ` +
                    `The backend requires a valid UUID/GUID.`
                );

                return;
            }

            if (
                member.contributorSubTypeId &&
                !guidRegex.test(
                    String(member.contributorSubTypeId)
                )
            ) {
                setCreateError(
                    `Invalid Contributor Subtype ID for ${getUserName(member.user)}.`
                );

                return;
            }
        }

        try {
            setCreating(true);

            /*
             * THIS is the correct shape for the frontend
             * if your API endpoint accepts this DTO directly.
             */

            const payload = {
                name,
                description: description || null,
                managerId:
                    createForm.managerId || null,

                members: selectedMembers.map(
                    (member) => ({
                        userId: member.userId,

                        contributorTypeId:
                            member.contributorTypeId,

                        contributorSubTypeId:
                            member.contributorSubTypeId ||
                            null,
                    })
                ),
            };

            console.log(
                "CREATE TEAM PAYLOAD:",
                JSON.stringify(
                    payload,
                    null,
                    2
                )
            );

            const result =
                await createTeam(payload);

            console.log(
                "CREATE TEAM RESULT:",
                result
            );

            if (result?.success === false) {
                throw new Error(
                    result.error ||
                    result.message ||
                    "Unable to create team."
                );
            }

            /*
             * Reload backend data.
             */

            await loadTeams();

            /*
             * RESET FORM.
             */

            setCreateForm({
                name: "",
                description: "",
                managerId: "",
            });

            setSelectedMembers([]);

            setMemberForm({
                userId: "",
                contributorTypeId: "",
                contributorSubTypeId: "",
            });

            /*
             * IMPORTANT:
             *
             * Close the modal AFTER successful creation.
             */

            setCreateOpen(false);

            clearCreateMessages();

            /*
             * Show success OUTSIDE the modal after
             * the modal has successfully closed.
             */

            setSuccessMessage(
                result?.message ||
                "Team created successfully."
            );
        } catch (err) {
            console.error(
                "CREATE TEAM ERROR:",
                err
            );

            /*
             * IMPORTANT:
             *
             * Keep the modal open when there is
             * a validation/API error.
             */

            setCreateError(
                getErrorMessage(err) ||
                "Unable to create team."
            );
        } finally {
            setCreating(false);
        }
    };

    // ========================================================
    // OPEN CREATE MODAL
    // ========================================================

    const openCreateModal = () => {
        clearPageMessages();
        clearCreateMessages();

        setCreateForm({
            name: "",
            description: "",
            managerId: "",
        });

        setSelectedMembers([]);

        setMemberForm({
            userId: "",
            contributorTypeId: "",
            contributorSubTypeId: "",
        });

        setCreateOpen(true);
    };

    // ========================================================
    // CLOSE CREATE MODAL
    // ========================================================

    const closeCreateModal = () => {
        if (creating) return;

        setCreateOpen(false);

        clearCreateMessages();

        setCreateForm({
            name: "",
            description: "",
            managerId: "",
        });

        setSelectedMembers([]);

        setMemberForm({
            userId: "",
            contributorTypeId: "",
            contributorSubTypeId: "",
        });
    };

    // ========================================================
    // OPEN EDIT
    // ========================================================

    const handleEdit = async (team) => {
        if (!team) return;

        const teamId = getTeamId(team);

        if (!teamId) {
            setError("Team ID is missing.");
            return;
        }

        try {
            clearPageMessages();

            const result =
                await getTeamById(teamId);

            const currentTeam =
                result?.data ||
                result ||
                team;

            setEditingTeam(currentTeam);

            setEditForm({
                name: currentTeam.name || "",

                description:
                    currentTeam.description ||
                    "",

                managerId:
                    getManagerId(currentTeam),

                isActive:
                    currentTeam.isActive !== false,
            });

            setEditOpen(true);
        } catch (err) {
            console.error(
                "OPEN EDIT TEAM ERROR:",
                err
            );

            setError(
                getErrorMessage(err) ||
                "Unable to load team for editing."
            );
        }
    };

    // ========================================================
    // EDIT FORM
    // ========================================================

    const handleEditChange = (event) => {
        const {
            name,
            value,
            type,
            checked,
        } = event.target;

        setEditForm((previous) => ({
            ...previous,

            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));
    };

    // ========================================================
    // UPDATE TEAM
    // ========================================================

    const handleUpdateTeam = async (event) => {
        event.preventDefault();

        if (!editingTeam) return;

        const teamId =
            getTeamId(editingTeam);

        if (!teamId) {
            setError("Team ID is missing.");
            return;
        }

        const name =
            editForm.name.trim();

        const description =
            editForm.description.trim();

        clearPageMessages();

        if (!name) {
            setError(
                "Team name is required."
            );
            return;
        }

        if (name.length > 100) {
            setError(
                "Team name cannot exceed 100 characters."
            );
            return;
        }

        if (description.length > 500) {
            setError(
                "Description cannot exceed 500 characters."
            );
            return;
        }

        try {
            setEditing(true);

            const payload = {
                name,

                description:
                    description || null,

                managerId:
                    editForm.managerId ||
                    null,

                isActive:
                    editForm.isActive,
            };

            const result =
                await updateTeam(
                    teamId,
                    payload
                );

            console.log(
                "UPDATE TEAM RESULT:",
                result
            );

            if (
                result &&
                result.success === false
            ) {
                setError(
                    result.error ||
                    result.message ||
                    "Unable to update team."
                );

                return;
            }

            setEditOpen(false);
            setEditingTeam(null);

            await loadTeams();

            setSuccessMessage(
                result?.message ||
                "Team updated successfully."
            );
        } catch (err) {
            console.error(
                "UPDATE TEAM ERROR:",
                err
            );

            setError(
                getErrorMessage(err) ||
                "Unable to update team."
            );
        } finally {
            setEditing(false);
        }
    };

    // ========================================================
    // CLOSE EDIT
    // ========================================================

    const closeEditModal = () => {
        if (editing) return;

        setEditOpen(false);
        setEditingTeam(null);
    };

    // ========================================================
    // DELETE TEAM
    // ========================================================

    const handleDelete = async (team) => {
        if (!team) return;

        const teamId =
            getTeamId(team);

        if (!teamId) {
            setError("Team ID is missing.");
            return;
        }

        const confirmed =
            window.confirm(
                `Are you sure you want to delete "${team.name}"?`
            );

        if (!confirmed) return;

        try {
            setDeletingTeamId(teamId);
            clearPageMessages();

            const result =
                await deleteTeam(teamId);

            console.log(
                "DELETE TEAM RESULT:",
                result
            );

            if (
                result &&
                result.success === false
            ) {
                setError(
                    result.error ||
                    result.message ||
                    "Unable to delete team."
                );

                return;
            }

            setTeams((previous) =>
                previous.filter(
                    (item) =>
                        String(
                            getTeamId(item)
                        ) !==
                        String(teamId)
                )
            );

            setSuccessMessage(
                result?.message ||
                "Team deleted successfully."
            );

            await loadTeams();
        } catch (err) {
            console.error(
                "DELETE TEAM ERROR:",
                err
            );

            setError(
                getErrorMessage(err) ||
                "Unable to delete team."
            );
        } finally {
            setDeletingTeamId(null);
        }
    };

    // ========================================================
    // VIEW TEAM DETAILS
    // ========================================================

    const handleViewDetails = async (team) => {
        if (!team) return;

        const teamId =
            getTeamId(team);

        if (!teamId) {
            setError("Team ID is missing.");
            return;
        }

        try {
            clearPageMessages();

            setViewOpen(true);
            setViewingTeam(team);
            setViewMembers([]);
            setLoadingMembers(true);

            const [
                teamResult,
                membersResult,
            ] = await Promise.all([
                getTeamById(teamId),
                getTeamMembers(teamId),
            ]);

            const latestTeam =
                teamResult?.data ||
                teamResult ||
                team;

            const members =
                Array.isArray(membersResult)
                    ? membersResult
                    : Array.isArray(
                        membersResult?.data
                    )
                        ? membersResult.data
                        : Array.isArray(
                            membersResult?.members
                        )
                            ? membersResult.members
                            : [];

            setViewingTeam(
                latestTeam
            );

            setViewMembers(
                members
            );
        } catch (err) {
            console.error(
                "VIEW TEAM ERROR:",
                err
            );

            setError(
                getErrorMessage(err) ||
                "Unable to load team details."
            );
        } finally {
            setLoadingMembers(false);
        }
    };

    // ========================================================
    // VIEW MEMBERS
    // ========================================================

    const handleViewMembers = async (team) => {
        await handleViewDetails(team);
    };

    // ========================================================
    // CLOSE VIEW MODAL
    // ========================================================

    const closeViewModal = () => {
        setViewOpen(false);
        setViewingTeam(null);
        setViewMembers([]);
    };

    // ========================================================
    // MANAGE MEMBERS
    // ========================================================

    const handleAddMembers = async (team) => {
        if (!team) return;

        const teamId =
            getTeamId(team);

        if (!teamId) {
            setError("Team ID is missing.");
            return;
        }

        try {
            clearPageMessages();

            setSelectedTeam(team);

            setSelectedUserId("");
            setSelectedContributorTypeId("");
            setSelectedContributorSubTypeId("");

            setMembersOpen(true);
            setLoadingMembers(true);

            const result =
                await getTeamMembers(
                    teamId
                );

            const members =
                Array.isArray(result)
                    ? result
                    : Array.isArray(
                        result?.data
                    )
                        ? result.data
                        : Array.isArray(
                            result?.members
                        )
                            ? result.members
                            : [];

            setTeamMembers(
                members
            );
        } catch (err) {
            console.error(
                "LOAD TEAM MEMBERS ERROR:",
                err
            );

            setError(
                getErrorMessage(err) ||
                "Unable to load team members."
            );
        } finally {
            setLoadingMembers(false);
        }
    };

    // ========================================================
    // ADD MEMBER
    // ========================================================

    const handleAddMember = async (event) => {
        event.preventDefault();

        if (!selectedTeam) return;

        const teamId =
            getTeamId(selectedTeam);

        const userId =
            selectedUserId.trim();

        const contributorTypeId =
            selectedContributorTypeId.trim();

        const contributorSubTypeId =
            selectedContributorSubTypeId.trim();

        clearPageMessages();

        if (!teamId) {
            setError(
                "Team ID is missing."
            );
            return;
        }

        if (!userId) {
            setError(
                "User ID is required."
            );
            return;
        }

        if (!contributorTypeId) {
            setError(
                "Contributor Type ID is required."
            );
            return;
        }

        try {
            setAddingMember(true);

            const payload = {
                userId,

                contributorTypeId,

                contributorSubTypeId:
                    contributorSubTypeId ||
                    null,
            };

            const result =
                await addMemberToTeam(
                    teamId,
                    payload
                );

            console.log(
                "ADD MEMBER RESULT:",
                result
            );

            if (
                result &&
                result.success === false
            ) {
                setError(
                    result.error ||
                    result.message ||
                    "Unable to add member."
                );

                return;
            }

            setSelectedUserId("");
            setSelectedContributorTypeId("");
            setSelectedContributorSubTypeId("");

            const [
                membersResult,
            ] = await Promise.all([
                getTeamMembers(
                    teamId
                ),
                loadTeams(),
            ]);

            const members =
                Array.isArray(
                    membersResult
                )
                    ? membersResult
                    : Array.isArray(
                        membersResult?.data
                    )
                        ? membersResult.data
                        : Array.isArray(
                            membersResult?.members
                        )
                            ? membersResult.members
                            : [];

            setTeamMembers(
                members
            );

            setSuccessMessage(
                result?.message ||
                "Member added successfully."
            );
        } catch (err) {
            console.error(
                "ADD MEMBER ERROR:",
                err
            );

            setError(
                getErrorMessage(err) ||
                "Unable to add member."
            );
        } finally {
            setAddingMember(false);
        }
    };

    // ========================================================
    // REMOVE MEMBER
    // ========================================================

    const handleRemoveMember = async (member) => {
        if (
            !selectedTeam ||
            !member
        ) {
            return;
        }

        const teamId =
            getTeamId(selectedTeam);

        const userId =
            getUserId(member);

        if (!teamId) {
            setError(
                "Team ID is missing."
            );
            return;
        }

        if (!userId) {
            setError(
                "User ID is missing."
            );
            return;
        }

        const memberName =
            getUserName(member);

        const confirmed =
            window.confirm(
                `Remove ${memberName} from this team?`
            );

        if (!confirmed) return;

        try {
            setRemovingMemberId(
                userId
            );

            clearPageMessages();

            const result =
                await removeMemberFromTeam(
                    teamId,
                    userId
                );

            console.log(
                "REMOVE MEMBER RESULT:",
                result
            );

            if (
                result &&
                result.success === false
            ) {
                setError(
                    result.error ||
                    result.message ||
                    "Unable to remove member."
                );

                return;
            }

            const [
                membersResult,
            ] = await Promise.all([
                getTeamMembers(
                    teamId
                ),
                loadTeams(),
            ]);

            const members =
                Array.isArray(
                    membersResult
                )
                    ? membersResult
                    : Array.isArray(
                        membersResult?.data
                    )
                        ? membersResult.data
                        : Array.isArray(
                            membersResult?.members
                        )
                            ? membersResult.members
                            : [];

            setTeamMembers(
                members
            );

            setSuccessMessage(
                result?.message ||
                "Member removed successfully."
            );
        } catch (err) {
            console.error(
                "REMOVE MEMBER ERROR:",
                err
            );

            setError(
                getErrorMessage(err) ||
                "Unable to remove member."
            );
        } finally {
            setRemovingMemberId(
                null
            );
        }
    };

    // ========================================================
    // CLOSE MEMBERS MODAL
    // ========================================================

    const closeMembersModal = () => {
        if (addingMember) return;

        setMembersOpen(false);
        setSelectedTeam(null);
        setTeamMembers([]);

        setSelectedUserId("");
        setSelectedContributorTypeId("");
        setSelectedContributorSubTypeId("");
    };

    // ========================================================
    // ASSIGN MANAGER
    // ========================================================

    const handleAssignManager = async (team) => {
        if (!team) return;

        const teamId =
            getTeamId(team);

        const managerId =
            getManagerId(team);

        if (!teamId) {
            setError(
                "Team ID is missing."
            );
            return;
        }

        if (!managerId) {
            setError(
                "Please select a manager first."
            );
            return;
        }

        try {
            clearPageMessages();

            const result =
                await assignTeamManager(
                    teamId,
                    managerId
                );

            if (
                result &&
                result.success === false
            ) {
                setError(
                    result.error ||
                    result.message ||
                    "Unable to assign manager."
                );

                return;
            }

            await loadTeams();

            setSuccessMessage(
                result?.message ||
                "Manager assigned successfully."
            );
        } catch (err) {
            console.error(
                "ASSIGN MANAGER ERROR:",
                err
            );

            setError(
                getErrorMessage(err) ||
                "Unable to assign manager."
            );
        }
    };

    // ========================================================
    // CURRENT SELECTED CONTRIBUTOR TYPE
    // ========================================================

<<<<<<< HEAD
  // ========================================================
// CREATE TEAM CONTRIBUTOR TYPES
// Only Staff and Developer
// ========================================================
console.log(
    "ALL CONTRIBUTOR TYPES:",
    contributorTypes
);
console.log(
    "AVAILABLE USERS:",
    JSON.stringify(
        availableUsers,
        null,
        2
    )
);
console.log(
    "FIRST AVAILABLE USER:",
    availableUsers[0]
);
const createTeamContributorTypes =
    contributorTypes.filter(
        (type) => {
            const name =
=======
    const selectedContributorType =
        contributorTypes.find(
            (type) =>
                String(type.id) ===
>>>>>>> 606d42dc31509d908ee4323883fe5d4a3860427b
                String(
                    memberForm.contributorTypeId
                )
        );

    const currentSubTypes =
        selectedContributorType?.subTypes ||
        selectedContributorType?.contributorSubTypes ||
        [];

    // ========================================================
    // RENDER
    // ========================================================

<<<<<<< HEAD
const selectedContributorType =
    createTeamContributorTypes.find((type) => {
        const typeId =
            type?.id ??
            type?.contributorTypeId ??
            type?.Id ??
            type?.ContributorTypeId;

        return (
            String(typeId) ===
            String(memberForm.contributorTypeId)
        );
    });

// ========================================================
// CURRENT SUBTYPES
// ========================================================

const currentSubTypes =
    contributorSubTypes;
console.log(
    "CURRENT SUBTYPES:",
    currentSubTypes
);
// ========================================================
// FILTER USERS BY SELECTED CONTRIBUTOR TYPE + SUBTYPE
// ========================================================

const filteredAvailableUsers = availableUsers.filter((user) => {
    // No contributor type selected yet
    if (!memberForm.contributorTypeId) {
        return true;
    }

    const userTypeId =
        String(user?.contributorTypeId || "");

    const selectedTypeId =
        String(memberForm.contributorTypeId || "");

    // First filter by contributor type
    if (userTypeId !== selectedTypeId) {
        return false;
    }

    // If no subtype is selected, show all users
    // belonging to the selected contributor type.
    if (!memberForm.contributorSubTypeId) {
        return true;
    }

    const userSubTypeId =
        String(user?.contributorSubTypeId || "");

    const selectedSubTypeId =
        String(
            memberForm.contributorSubTypeId || ""
        );

    // Then filter by subtype
    return (
        userSubTypeId === selectedSubTypeId
    );
});
// ========================================================
// RENDER
// ========================================================

return (
=======
    return (
>>>>>>> 606d42dc31509d908ee4323883fe5d4a3860427b
        <div className="min-h-full bg-background p-4 text-foreground sm:p-6 lg:p-8">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary shadow-sm">
                        <UsersRound size={22} />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Team Management
                        </h1>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Manage teams, managers, and team members.
                        </p>
                    </div>

                </div>

                <div className="flex flex-wrap items-center gap-2">

                    <button
                        type="button"
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="
                            inline-flex cursor-pointer items-center gap-2
                            rounded-xl border border-border bg-card
                            px-4 py-2.5 text-sm font-semibold
                            shadow-sm transition-all duration-300
                            hover:-translate-y-0.5
                            hover:border-primary/40
                            hover:bg-muted hover:shadow-md
                            disabled:cursor-not-allowed disabled:opacity-60
                        "
                    >
                        {refreshing ? (
                            <Loader2
                                size={17}
                                className="animate-spin"
                            />
                        ) : (
                            <RefreshCw size={17} />
                        )}

                        Refresh
                    </button>

                    <button
                        type="button"
                        onClick={openCreateModal}
                        className="
                            inline-flex cursor-pointer items-center gap-2
                            rounded-xl bg-primary px-4 py-2.5
                            text-sm font-semibold text-primary-foreground
                            shadow-sm transition-all duration-300
                            hover:-translate-y-0.5
                            hover:bg-primary/90 hover:shadow-md
                        "
                    >
                        <Plus size={17} />
                        Create Team
                    </button>

                </div>
            </div>

            {/* ==================================================
                PAGE SUCCESS
            ================================================== */}

            {successMessage && (
                <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400">

                    <CheckCircle2
                        size={19}
                        className="mt-0.5 shrink-0"
                    />

                    <span className="whitespace-pre-line">
                        {successMessage}
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            setSuccessMessage("")
                        }
                        className="ml-auto cursor-pointer opacity-70 hover:opacity-100"
                    >
                        <X size={17} />
                    </button>

                </div>
            )}

            {/* ==================================================
                PAGE ERROR
            ================================================== */}

            {error && (
                <div className="mb-5 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">

                    <AlertCircle
                        size={19}
                        className="mt-0.5 shrink-0"
                    />

                    <span className="whitespace-pre-line">
                        {error}
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            setError("")
                        }
                        className="ml-auto cursor-pointer opacity-70 hover:opacity-100"
                    >
                        <X size={17} />
                    </button>

                </div>
            )}

            {/* ==================================================
                SEARCH
            ================================================== */}

            <div className="mb-5 rounded-2xl border border-border bg-card p-4 shadow-sm">

                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(event) =>
                            setSearchTerm(
                                event.target.value
                            )
                        }
                        placeholder="Search teams, managers, or status..."
                        className="
                            w-full rounded-xl border border-border
                            bg-background px-4 py-2.5 text-sm
                            outline-none transition-all
                            focus:border-primary
                            focus:ring-2 focus:ring-primary/20
                        "
                    />

                    <div className="whitespace-nowrap text-sm text-muted-foreground">

                        <span className="font-semibold text-foreground">
                            {filteredTeams.length}
                        </span>{" "}

                        {filteredTeams.length === 1
                            ? "team"
                            : "teams"}

                    </div>

                </div>

            </div>

            {/* ==================================================
                TEAM TABLE
            ================================================== */}

            {loading ? (
                <div className="flex min-h-[350px] items-center justify-center rounded-2xl border border-border bg-card shadow-sm">

                    <div className="flex flex-col items-center gap-3 text-muted-foreground">

                        <Loader2
                            size={35}
                            className="animate-spin text-primary"
                        />

                        <p className="text-sm font-medium">
                            Loading teams...
                        </p>

                    </div>

                </div>
            ) : (
                <TeamTable
                    teams={filteredTeams}
                    searchTerm={searchTerm}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onAddMembers={handleAddMembers}
                    onViewMembers={handleViewMembers}
                    onViewDetails={handleViewDetails}
                    onAssignManager={handleAssignManager}
                    deletingTeamId={deletingTeamId}
                />
            )}

            {/* ==================================================
                CREATE TEAM MODAL
            ================================================== */}

            {createOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">

                    <div className="max-h-[92vh] w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">

                        {/* MODAL HEADER */}

                        <div className="flex items-center justify-between border-b border-border px-5 py-4">

                            <div>
                                <h2 className="text-lg font-bold">
                                    Create Team
                                </h2>

                                <p className="mt-1 text-xs text-muted-foreground">
                                    Create a new team and assign members.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeCreateModal}
                                disabled={creating}
                                className="
                                    cursor-pointer rounded-lg p-2
                                    text-muted-foreground transition
                                    hover:bg-muted hover:text-foreground
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >
                                <X size={19} />
                            </button>

                        </div>

                        {/* MODAL CONTENT */}

                        <div className="max-h-[calc(92vh-75px)] overflow-y-auto">

                            <form
                                onSubmit={handleCreateTeam}
                                className="space-y-5 p-5"
                            >

                                {/* ==================================================
                                    CREATE ERROR - INSIDE MODAL
                                ================================================== */}

                                {createError && (
                                    <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">

                                        <AlertCircle
                                            size={18}
                                            className="mt-0.5 shrink-0"
                                        />

                                        <div className="min-w-0 flex-1">

                                            <p className="font-semibold">
                                                Unable to create team
                                            </p>

                                            <p className="mt-1 whitespace-pre-line break-words text-xs">
                                                {createError}
                                            </p>

                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setCreateError("")
                                            }
                                            className="cursor-pointer opacity-70 hover:opacity-100"
                                        >
                                            <X size={16} />
                                        </button>

                                    </div>
                                )}

                                {/* ==================================================
                                    CREATE SUCCESS - INSIDE MODAL
                                ================================================== */}

                                {createSuccess && (
                                    <div className="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400">

                                        <CheckCircle2
                                            size={18}
                                            className="mt-0.5 shrink-0"
                                        />

                                        <span>
                                            {createSuccess}
                                        </span>

                                    </div>
                                )}

                                {/* ==================================================
                                    TEAM NAME
                                ================================================== */}

                                <div>

                                    <label className="mb-2 block text-sm font-semibold">
                                        Team Name
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        value={createForm.name}
                                        onChange={handleCreateChange}
                                        placeholder="Enter team name"
                                        maxLength={100}
                                        disabled={creating}
                                        autoFocus
                                        className="
                                            w-full rounded-xl border border-border
                                            bg-background px-4 py-2.5 text-sm
                                            outline-none transition
                                            focus:border-primary
                                            focus:ring-2 focus:ring-primary/20
                                        "
                                    />

                                </div>

                                {/* ==================================================
                                    DESCRIPTION
                                ================================================== */}

                                <div>

                                    <label className="mb-2 block text-sm font-semibold">
                                        Description
                                    </label>

                                    <textarea
                                        name="description"
                                        value={createForm.description}
                                        onChange={handleCreateChange}
                                        placeholder="Enter team description"
                                        rows={4}
                                        maxLength={500}
                                        disabled={creating}
                                        className="
                                            w-full resize-none rounded-xl
                                            border border-border bg-background
                                            px-4 py-2.5 text-sm outline-none
                                            transition focus:border-primary
                                            focus:ring-2 focus:ring-primary/20
                                        "
                                    />

                                </div>

                                {/* ==================================================
                                    MANAGER
                                ================================================== */}

                                <div>

                                    <label className="mb-2 block text-sm font-semibold">
                                        Manager
                                    </label>

                                    <select
                                        name="managerId"
                                        value={createForm.managerId}
                                        onChange={handleCreateChange}
                                        disabled={creating}
                                        className="
                                            w-full rounded-xl border border-border
                                            bg-background px-4 py-2.5 text-sm
                                            outline-none transition
                                            focus:border-primary
                                            focus:ring-2 focus:ring-primary/20
                                        "
                                    >

                                        <option value="">
                                            No manager
                                        </option>

                                        {managers.map(
                                            (manager) => {
                                                const id =
                                                    getUserId(
                                                        manager
                                                    );

                                                if (!id) {
                                                    return null;
                                                }

                                                return (
                                                    <option
                                                        key={id}
                                                        value={id}
                                                    >
                                                        {getUserName(
                                                            manager
                                                        )}
                                                    </option>
                                                );
                                            }
                                        )}

                                    </select>

                                </div>

                                {/* ==================================================
                                    TEAM MEMBERS
                                ================================================== */}

                                <div className="border-t border-border pt-5">

                                    <div className="mb-4">

                                        <h3 className="text-sm font-bold">
                                            Team Members
                                        </h3>

                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Select a contributor and assign their type.
                                        </p>

                                    </div>

                                    {/* MEMBER */}

                                    <div className="mb-4">

                                        <label className="mb-2 block text-sm font-semibold">
                                            Member
                                        </label>

                                    <select
    name="userId"
    value={memberForm.userId}
    onChange={handleMemberFormChange}
    disabled={!memberForm.contributorTypeId}
    className="
        w-full rounded-xl
        border border-border
        bg-card
        px-4 py-3
        text-sm text-foreground
        shadow-sm
        outline-none
        transition-all duration-200
        focus:border-primary
        focus:ring-2 focus:ring-primary/20
        disabled:cursor-not-allowed
        disabled:opacity-60
    "
>
    <option
        value=""
        className="bg-card text-muted-foreground"
    >
        Select team member
    </option>

    {filteredAvailableUsers.map((user) => {
        const id = getUserId(user);

        if (!id) {
            return null;
        }

        return (
            <option
                key={id}
                value={id}
                className="bg-card text-foreground"
            >
                {getUserName(user)}
            </option>
        );
    })}
</select>

                                    </div>

                                    {/* CONTRIBUTOR TYPE */}

                                   <div className="mb-4">

    <label className="mb-2 block text-sm font-semibold">
        Contributor Type
    </label>

    <select
        name="contributorTypeId"
        value={
            memberForm.contributorTypeId
        }
        onChange={(
            event
        ) => {
            const contributorTypeId =
                event.target.value;

            setMemberForm(
                (previous) => ({
                    ...previous,

                    contributorTypeId,

                    contributorSubTypeId:
                        "",
                })
            );

<<<<<<< HEAD
            setContributorSubTypes([]);
=======
                                            {contributorTypes.map(
                                                (type) => (
                                                    <option
                                                        key={type.id}
                                                        value={type.id}
                                                    >
                                                        {type.name ||
                                                            type.displayName}
                                                    </option>
                                                )
                                            )}
>>>>>>> 606d42dc31509d908ee4323883fe5d4a3860427b

            if (contributorTypeId) {
                loadContributorSubTypes(
                    contributorTypeId
                );
            }
        }}
        disabled={creating}
        className="
            w-full rounded-xl border border-border
            bg-background px-4 py-2.5 text-sm
            outline-none transition
            focus:border-primary
            focus:ring-2 focus:ring-primary/20
        "
    >

        <option value="">
            Select contributor type
        </option>

       {createTeamContributorTypes.map((type) => {
    const typeId =
        type?.id ??
        type?.contributorTypeId ??
        type?.Id ??
        type?.ContributorTypeId;

    return (
        <option
            key={typeId}
            value={typeId}
        >
            {type.name ||
                type.displayName ||
                "Unnamed Type"}
        </option>
    );
})}

    </select>

    {contributorTypes.length === 0 && (
        <p className="mt-2 rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-400">
            Contributor types are not loaded from the backend yet.
        </p>
    )}

</div>

                                    {/* CONTRIBUTOR SUBTYPE */}

                                    {currentSubTypes.length > 0 && (

<div className="mb-4">

    <label className="mb-2 block text-sm font-semibold">
        Contributor Subtype
    </label>

    <select
        name="contributorSubTypeId"
        value={
            memberForm.contributorSubTypeId
        }
        onChange={
            handleMemberFormChange
        }
        disabled={
            creating ||
            !memberForm.contributorTypeId
        }
        className="
            w-full rounded-xl border border-border
            bg-background px-4 py-2.5 text-sm
            outline-none transition
            focus:border-primary
            focus:ring-2 focus:ring-primary/20
            disabled:cursor-not-allowed
            disabled:opacity-60
        "
    >

        <option value="">
            {memberForm.contributorTypeId
                ? currentSubTypes.length > 0
                    ? "Select subtype"
                    : "Loading or no subtypes available"
                : "Select contributor type first"}
        </option>

        {currentSubTypes.map(
            (subtype) => (
                <option
                    key={subtype.id}
                    value={subtype.id}
                >
                    {subtype.name ||
                        subtype.displayName}
                </option>
            )
        )}

    </select>

    {memberForm.contributorTypeId &&
        currentSubTypes.length === 0 && (
            <p className="mt-2 text-xs text-muted-foreground">
                No subtypes loaded yet.
            </p>
        )}

</div>
                                    )}

                                    {/* ADD MEMBER */}

                                    <button
                                        type="button"
                                        onClick={
                                            handleAddSelectedMember
                                        }
                                        disabled={
                                            creating ||
                                            !memberForm.userId ||
                                            !memberForm.contributorTypeId
                                        }
                                        className="
                                            inline-flex cursor-pointer items-center gap-2
                                            rounded-xl border border-primary/30
                                            bg-primary/10 px-4 py-2.5 text-sm
                                            font-semibold text-primary transition
                                            hover:bg-primary/20
                                            disabled:cursor-not-allowed
                                            disabled:opacity-50
                                        "
                                    >

                                        <UserPlus size={16} />

                                        Add Member

                                    </button>

                                    {/* SELECTED MEMBERS */}

                                    {selectedMembers.length > 0 && (
                                        <div className="mt-4 space-y-2">

                                            {selectedMembers.map(
                                                (
                                                    member
                                                ) => (
                                                    <div
                                                        key={
                                                            member.userId
                                                        }
                                                        className="
                                                            flex items-center justify-between
                                                            rounded-xl border border-border
                                                            bg-muted/30 p-3
                                                        "
                                                    >

                                                        <div className="min-w-0">

                                                            <p className="truncate text-sm font-semibold">
                                                                {getUserName(
                                                                    member.user
                                                                )}
                                                            </p>

                                                            <p className="text-xs text-muted-foreground">

                                                                {
                                                                    member.contributorTypeName
                                                                }

                                                                {member.contributorSubTypeName &&
                                                                    ` • ${member.contributorSubTypeName}`}

                                                            </p>

                                                        </div>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleRemoveSelectedMember(
                                                                    member.userId
                                                                )
                                                            }
                                                            disabled={
                                                                creating
                                                            }
                                                            className="
                                                                cursor-pointer rounded-lg
                                                                p-2 text-destructive
                                                                transition hover:bg-destructive/10
                                                                disabled:cursor-not-allowed
                                                                disabled:opacity-50
                                                            "
                                                        >
                                                            <Trash2 size={15} />
                                                        </button>

                                                    </div>
                                                )
                                            )}

                                        </div>
                                    )}

                                </div>

                                {/* ==================================================
                                    ACTIONS
                                ================================================== */}

                                <div className="flex justify-end gap-2 border-t border-border pt-4">

                                    <button
                                        type="button"
                                        onClick={
                                            closeCreateModal
                                        }
                                        disabled={creating}
                                        className="
                                            cursor-pointer rounded-xl
                                            border border-border bg-background
                                            px-4 py-2.5 text-sm font-semibold
                                            transition hover:bg-muted
                                            disabled:cursor-not-allowed
                                            disabled:opacity-60
                                        "
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={
                                            creating ||
                                            !createForm.name.trim()
                                        }
                                        className="
                                            inline-flex cursor-pointer
                                            items-center gap-2 rounded-xl
                                            bg-primary px-4 py-2.5 text-sm
                                            font-semibold text-primary-foreground
                                            transition hover:bg-primary/90
                                            disabled:cursor-not-allowed
                                            disabled:opacity-60
                                        "
                                    >

                                        {creating && (
                                            <Loader2
                                                size={16}
                                                className="animate-spin"
                                            />
                                        )}

                                        {creating
                                            ? "Creating..."
                                            : "Create Team"}

                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                </div>
            )}

            {/* ==================================================
                EDIT MODAL
            ================================================== */}

            {editOpen && editingTeam && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">

                    <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">

                        <div className="flex items-center justify-between border-b border-border px-5 py-4">

                            <div>
                                <h2 className="text-lg font-bold">
                                    Edit Team
                                </h2>

                                <p className="mt-1 text-xs text-muted-foreground">
                                    Update team information.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeEditModal}
                                className="cursor-pointer rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                            >
                                <X size={19} />
                            </button>

                        </div>

                        <form
                            onSubmit={
                                handleUpdateTeam
                            }
                            className="space-y-5 p-5"
                        >

                            {error && (
                                <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">

                                    <AlertCircle size={18} />

                                    <span className="whitespace-pre-line">
                                        {error}
                                    </span>

                                </div>
                            )}

                            <div>

                                <label className="mb-2 block text-sm font-semibold">
                                    Team Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={editForm.name}
                                    onChange={
                                        handleEditChange
                                    }
                                    maxLength={100}
                                    disabled={editing}
                                    className="
                                        w-full rounded-xl border border-border
                                        bg-background px-4 py-2.5 text-sm
                                        outline-none transition
                                        focus:border-primary
                                        focus:ring-2 focus:ring-primary/20
                                    "
                                />

                            </div>

                            <div>

                                <label className="mb-2 block text-sm font-semibold">
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={
                                        editForm.description
                                    }
                                    onChange={
                                        handleEditChange
                                    }
                                    rows={4}
                                    maxLength={500}
                                    disabled={editing}
                                    className="
                                        w-full resize-none rounded-xl
                                        border border-border bg-background
                                        px-4 py-2.5 text-sm outline-none
                                        transition focus:border-primary
                                        focus:ring-2 focus:ring-primary/20
                                    "
                                />

                            </div>

                            <div>

                                <label className="mb-2 block text-sm font-semibold">
                                    Manager
                                </label>

                                <select
                                    name="managerId"
                                    value={
                                        editForm.managerId
                                    }
                                    onChange={
                                        handleEditChange
                                    }
                                    disabled={editing}
                                    className="
                                        w-full rounded-xl border border-border
                                        bg-background px-4 py-2.5 text-sm
                                        outline-none transition
                                        focus:border-primary
                                        focus:ring-2 focus:ring-primary/20
                                    "
                                >

                                    <option value="">
                                        No manager
                                    </option>

                                    {managers.map(
                                        (
                                            manager
                                        ) => {
                                            const id =
                                                getUserId(
                                                    manager
                                                );

                                            if (!id) {
                                                return null;
                                            }

                                            return (
                                                <option
                                                    key={
                                                        id
                                                    }
                                                    value={
                                                        id
                                                    }
                                                >
                                                    {getUserName(
                                                        manager
                                                    )}
                                                </option>
                                            );
                                        }
                                    )}

                                </select>

                            </div>

                            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-muted/30 p-4">

                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={
                                        editForm.isActive
                                    }
                                    onChange={
                                        handleEditChange
                                    }
                                    disabled={editing}
                                    className="h-4 w-4 accent-primary"
                                />

                                <div>

                                    <p className="text-sm font-semibold">
                                        Active Team
                                    </p>

                                    <p className="text-xs text-muted-foreground">
                                        Keep this team active.
                                    </p>

                                </div>

                            </label>

                            <div className="flex justify-end gap-2 border-t border-border pt-4">

                                <button
                                    type="button"
                                    onClick={
                                        closeEditModal
                                    }
                                    disabled={editing}
                                    className="
                                        cursor-pointer rounded-xl
                                        border border-border bg-background
                                        px-4 py-2.5 text-sm font-semibold
                                        transition hover:bg-muted
                                        disabled:opacity-60
                                    "
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={editing}
                                    className="
                                        inline-flex cursor-pointer
                                        items-center gap-2 rounded-xl
                                        bg-primary px-4 py-2.5 text-sm
                                        font-semibold text-primary-foreground
                                        transition hover:bg-primary/90
                                        disabled:cursor-not-allowed
                                        disabled:opacity-60
                                    "
                                >

                                    {editing && (
                                        <Loader2
                                            size={16}
                                            className="animate-spin"
                                        />
                                    )}

                                    {editing
                                        ? "Saving..."
                                        : "Save Changes"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

            {/* ==================================================
                VIEW DETAILS MODAL
            ================================================== */}

            {viewOpen && viewingTeam && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">

                    <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">

                        <div className="flex items-center justify-between border-b border-border px-5 py-4">

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <UsersRound size={19} />
                                </div>

                                <div>

                                    <h2 className="text-lg font-bold">
                                        {viewingTeam.name}
                                    </h2>

                                    <p className="text-xs text-muted-foreground">
                                        Team details and members
                                    </p>

                                </div>

                            </div>

                            <button
                                type="button"
                                onClick={
                                    closeViewModal
                                }
                                className="cursor-pointer rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                            >
                                <X size={19} />
                            </button>

                        </div>

                        <div className="max-h-[calc(90vh-80px)] overflow-y-auto p-5">

                            <div className="mb-4 rounded-xl border border-border bg-muted/30 p-4">

                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    Description
                                </p>

                                <p className="mt-2 text-sm">
                                    {viewingTeam.description ||
                                        "No description provided."}
                                </p>

                            </div>

                            <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">

                                <div className="rounded-xl border border-border bg-muted/30 p-4">

                                    <p className="text-xs text-muted-foreground">
                                        Members
                                    </p>

                                    <p className="mt-1 text-xl font-bold">
                                        {viewingTeam.memberCount ??
                                            viewMembers.length}
                                    </p>

                                </div>

                                <div className="rounded-xl border border-border bg-muted/30 p-4">

                                    <p className="text-xs text-muted-foreground">
                                        Developers
                                    </p>

                                    <p className="mt-1 text-xl font-bold">
                                        {viewingTeam.developerCount ??
                                            0}
                                    </p>

                                </div>

                                <div className="rounded-xl border border-border bg-muted/30 p-4">

                                    <p className="text-xs text-muted-foreground">
                                        Staff
                                    </p>

                                    <p className="mt-1 text-xl font-bold">
                                        {viewingTeam.staffCount ??
                                            0}
                                    </p>

                                </div>

                            </div>

                            <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">

                                <div className="rounded-xl border border-border bg-muted/30 p-4">

                                    <p className="text-xs text-muted-foreground">
                                        Manager
                                    </p>

                                    <p className="mt-1 text-sm font-semibold">
                                        {viewingTeam.managerName ||
                                            viewingTeam.manager?.fullName ||
                                            viewingTeam.manager?.name ||
                                            viewingTeam.manager?.email ||
                                            "Not assigned"}
                                    </p>

                                </div>

                                <div className="rounded-xl border border-border bg-muted/30 p-4">

                                    <p className="text-xs text-muted-foreground">
                                        Status
                                    </p>

                                    <span
                                        className={
                                            viewingTeam.isActive !== false
                                                ? "mt-2 inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
                                                : "mt-2 inline-flex rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-600 dark:text-red-400"
                                        }
                                    >
                                        {viewingTeam.isActive !== false
                                            ? "Active"
                                            : "Inactive"}
                                    </span>

                                </div>

                            </div>

                            <div>

                                <div className="mb-3 flex items-center justify-between">

                                    <div>

                                        <p className="text-sm font-bold">
                                            Team Members
                                        </p>

                                        <p className="text-xs text-muted-foreground">
                                            {viewMembers.length}{" "}
                                            {viewMembers.length === 1
                                                ? "member"
                                                : "members"}
                                        </p>

                                    </div>

                                    <UsersRound
                                        size={19}
                                        className="text-primary"
                                    />

                                </div>

                                {loadingMembers ? (
                                    <div className="flex items-center justify-center rounded-xl border border-border bg-muted/20 py-10">

                                        <Loader2
                                            size={28}
                                            className="animate-spin text-primary"
                                        />

                                    </div>
                                ) : viewMembers.length > 0 ? (
                                    <div className="space-y-2">

                                        {viewMembers.map(
                                            (
                                                member,
                                                index
                                            ) => {
                                                const memberId =
                                                    getUserId(
                                                        member
                                                    ) ||
                                                    index;

                                                return (
                                                    <div
                                                        key={
                                                            memberId
                                                        }
                                                        className="rounded-xl border border-border bg-background p-3"
                                                    >

                                                        <div className="flex items-center gap-3">

                                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                                <UsersRound size={16} />
                                                            </div>

                                                            <div className="min-w-0">

                                                                <p className="truncate text-sm font-semibold">
                                                                    {getUserName(
                                                                        member
                                                                    )}
                                                                </p>

                                                                {member.email && (
                                                                    <p className="truncate text-xs text-muted-foreground">
                                                                        {member.email}
                                                                    </p>
                                                                )}

                                                                <div className="mt-2 flex flex-wrap gap-2">

                                                                    {member.contributorTypeName && (
                                                                        <span className="rounded-full bg-primary/10 px-2 py-1 text-[11px] font-medium text-primary">
                                                                            {
                                                                                member.contributorTypeName
                                                                            }
                                                                        </span>
                                                                    )}

                                                                    {member.contributorSubTypeName && (
                                                                        <span className="rounded-full bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground">
                                                                            {
                                                                                member.contributorSubTypeName
                                                                            }
                                                                        </span>
                                                                    )}

                                                                </div>

                                                            </div>

                                                        </div>

                                                    </div>
                                                );
                                            }
                                        )}

                                    </div>
                                ) : (
                                    <div className="rounded-xl border border-dashed border-border bg-muted/20 px-4 py-10 text-center">

                                        <UsersRound
                                            size={30}
                                            className="mx-auto mb-3 text-muted-foreground"
                                        />

                                        <p className="text-sm font-semibold">
                                            No members
                                        </p>

                                        <p className="mt-1 text-xs text-muted-foreground">
                                            This team currently has no members.
                                        </p>

                                    </div>
                                )}

                            </div>

                        </div>

                    </div>

                </div>
            )}

            {/* ==================================================
                MANAGE MEMBERS MODAL
            ================================================== */}

            {membersOpen && selectedTeam && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">

                    <div className="max-h-[90vh] w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">

                        <div className="flex items-center justify-between border-b border-border px-5 py-4">

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <UserPlus size={18} />
                                </div>

                                <div>

                                    <h2 className="text-lg font-bold">
                                        Manage Members
                                    </h2>

                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {selectedTeam.name}
                                    </p>

                                </div>

                            </div>

                            <button
                                type="button"
                                onClick={
                                    closeMembersModal
                                }
                                className="cursor-pointer rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                            >
                                <X size={19} />
                            </button>

                        </div>

                        <div className="max-h-[calc(90vh-80px)] space-y-5 overflow-y-auto p-5">

                            {/* CURRENT MEMBERS */}

                            <div>

                                <div className="mb-3 flex items-center justify-between">

                                    <p className="text-sm font-semibold">
                                        Current Members
                                    </p>

                                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                                        {teamMembers.length}
                                    </span>

                                </div>

                                {loadingMembers ? (
                                    <div className="flex items-center justify-center rounded-xl border border-border py-7">

                                        <Loader2
                                            size={24}
                                            className="animate-spin text-primary"
                                        />

                                    </div>
                                ) : teamMembers.length > 0 ? (
                                    <div className="max-h-48 space-y-2 overflow-y-auto">

                                        {teamMembers.map(
                                            (
                                                member,
                                                index
                                            ) => {

                                                const id =
                                                    getUserId(
                                                        member
                                                    ) ||
                                                    index;

                                                return (
                                                    <div
                                                        key={
                                                            id
                                                        }
                                                        className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/30 px-3 py-2.5"
                                                    >

                                                        <div className="flex min-w-0 items-center gap-3">

                                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                                <UsersRound size={14} />
                                                            </div>

                                                            <div className="min-w-0">

                                                                <p className="truncate text-sm font-medium">
                                                                    {getUserName(
                                                                        member
                                                                    )}
                                                                </p>

                                                                {member.email && (
                                                                    <p className="truncate text-xs text-muted-foreground">
                                                                        {
                                                                            member.email
                                                                        }
                                                                    </p>
                                                                )}

                                                            </div>

                                                        </div>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleRemoveMember(
                                                                    member
                                                                )
                                                            }
                                                            disabled={
                                                                removingMemberId ===
                                                                id
                                                            }
                                                            className="
                                                                inline-flex shrink-0 cursor-pointer
                                                                items-center gap-1.5 rounded-lg
                                                                border border-destructive/20
                                                                bg-destructive/10 px-2.5 py-1.5
                                                                text-xs font-semibold text-destructive
                                                                transition hover:bg-destructive/20
                                                                disabled:cursor-not-allowed
                                                                disabled:opacity-50
                                                            "
                                                        >

                                                            {removingMemberId ===
                                                            id ? (
                                                                <Loader2
                                                                    size={13}
                                                                    className="animate-spin"
                                                                />
                                                            ) : (
                                                                <UserMinus
                                                                    size={13}
                                                                />
                                                            )}

                                                            Remove

                                                        </button>

                                                    </div>
                                                );
                                            }
                                        )}

                                    </div>
                                ) : (
                                    <p className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-xs text-muted-foreground">
                                        No current members.
                                    </p>
                                )}

                            </div>

                            {/* ADD MEMBER */}

                            <form
                                onSubmit={
                                    handleAddMember
                                }
                                className="space-y-4 border-t border-border pt-5"
                            >

                                <div className="flex items-center gap-2">

                                    <UserPlus
                                        size={17}
                                        className="text-primary"
                                    />

                                    <p className="text-sm font-bold">
                                        Add New Member
                                    </p>

                                </div>

                                <div>

                                    <label className="mb-2 block text-sm font-semibold">
                                        User ID
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            selectedUserId
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setSelectedUserId(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        placeholder="Enter user's UUID"
                                        disabled={
                                            addingMember
                                        }
                                        className="
                                            w-full rounded-xl border border-border
                                            bg-background px-4 py-2.5 text-sm
                                            outline-none transition
                                            focus:border-primary
                                            focus:ring-2 focus:ring-primary/20
                                        "
                                    />

                                </div>

                                <div>

                                    <label className="mb-2 block text-sm font-semibold">
                                        Contributor Type ID
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            selectedContributorTypeId
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setSelectedContributorTypeId(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        placeholder="Enter contributor type UUID"
                                        disabled={
                                            addingMember
                                        }
                                        className="
                                            w-full rounded-xl border border-border
                                            bg-background px-4 py-2.5 text-sm
                                            outline-none transition
                                            focus:border-primary
                                            focus:ring-2 focus:ring-primary/20
                                        "
                                    />

                                </div>

                                <div>

                                    <label className="mb-2 block text-sm font-semibold">

                                        Contributor Subtype ID

                                        <span className="ml-1 font-normal text-muted-foreground">
                                            (Optional)
                                        </span>

                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            selectedContributorSubTypeId
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setSelectedContributorSubTypeId(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        placeholder="Enter contributor subtype UUID"
                                        disabled={
                                            addingMember
                                        }
                                        className="
                                            w-full rounded-xl border border-border
                                            bg-background px-4 py-2.5 text-sm
                                            outline-none transition
                                            focus:border-primary
                                            focus:ring-2 focus:ring-primary/20
                                        "
                                    />

                                </div>

                                <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">

                                    <p className="text-xs leading-5 text-muted-foreground">
                                        User ID and Contributor Type ID are required. Contributor Subtype ID is optional.
                                    </p>

                                </div>

                                <div className="flex justify-end gap-2">

                                    <button
                                        type="button"
                                        onClick={
                                            closeMembersModal
                                        }
                                        disabled={
                                            addingMember
                                        }
                                        className="
                                            cursor-pointer rounded-xl
                                            border border-border bg-background
                                            px-4 py-2.5 text-sm font-semibold
                                            transition hover:bg-muted
                                            disabled:opacity-60
                                        "
                                    >
                                        Close
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={
                                            addingMember ||
                                            !selectedUserId.trim() ||
                                            !selectedContributorTypeId.trim()
                                        }
                                        className="
                                            inline-flex cursor-pointer
                                            items-center gap-2 rounded-xl
                                            bg-primary px-4 py-2.5
                                            text-sm font-semibold
                                            text-primary-foreground
                                            transition hover:bg-primary/90
                                            disabled:cursor-not-allowed
                                            disabled:opacity-60
                                        "
                                    >

                                        {addingMember && (
                                            <Loader2
                                                size={16}
                                                className="animate-spin"
                                            />
                                        )}

                                        {addingMember
                                            ? "Adding..."
                                            : "Add Member"}

                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}

export default TeamManagement;