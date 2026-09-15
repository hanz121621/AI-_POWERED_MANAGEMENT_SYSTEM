import { useEffect, useMemo, useState } from "react";

import {
    AtSign,
    Search,
    Send,
    RefreshCw,
    UserRound,
    Mail,
    CalendarDays,
    CheckCircle2,
    AlertCircle,
    FolderKanban,
    Loader2,
    Check,
} from "lucide-react";

import api from "../../../../services/api";

// ============================================================
// HELPERS
// ============================================================

function getId(item) {
    return (
        item?.id ??
        item?.Id ??
        item?.userId ??
        item?.UserId ??
        ""
    );
}

function getName(item) {
    return (
        item?.fullName ||
        item?.FullName ||
        item?.name ||
        item?.Name ||
        item?.userName ||
        item?.UserName ||
        "Unknown User"
    );
}

function getEmail(item) {
    return item?.email || item?.Email || "";
}

function getRole(item) {
    return (
        item?.role ||
        item?.Role ||
        item?.userRole ||
        item?.UserRole ||
        "Team Member"
    );
}

function formatDate(dateValue) {
    if (!dateValue) {
        return "Unknown date";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "Unknown date";
    }

    return date.toLocaleString();
}

function getApiMessage(error, fallback) {
    return (
        error?.response?.data?.message ||
        error?.response?.data?.title ||
        error?.message ||
        fallback
    );
}

// ============================================================
// RESPONSE DATA HELPERS
// ============================================================

function getResponseData(response) {
    return response?.data?.data ?? response?.data;
}

function getProjectName(project) {
    return (
        project?.name ||
        project?.Name ||
        "Unnamed Project"
    );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

function MentionTeamMembers() {
    // ========================================================
    // DATA
    // ========================================================

    const [teams, setTeams] = useState([]);
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [mentions, setMentions] = useState([]);

    // ========================================================
    // SELECTION
    // ========================================================

    const [selectedTeamId, setSelectedTeamId] = useState("");
    const [selectedProjectId, setSelectedProjectId] =
        useState("");
    const [selectedUserId, setSelectedUserId] =
        useState("");

    // ========================================================
    // FORM
    // ========================================================

    const [title, setTitle] = useState("");
    const [messageText, setMessageText] = useState("");

    // ========================================================
    // UI STATE
    // ========================================================

    const [searchTerm, setSearchTerm] = useState("");

    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // ========================================================
    // LOAD TEAMS
    //
    // GET /api/Team/my-teams
    // ========================================================

    const loadTeams = async () => {
        try {
            console.log(
                "[MentionTeamMembers] Loading teams..."
            );

            const response = await api.get(
                "/Team/my-teams"
            );

            console.log(
                "[MentionTeamMembers] Teams response:",
                response.data
            );

            const teamData =
                response?.data?.data ??
                response?.data;

            setTeams(
                Array.isArray(teamData)
                    ? teamData
                    : []
            );

            return true;
        } catch (err) {
            console.error(
                "[MentionTeamMembers] Failed to load teams:",
                err
            );

            console.error(
                "[MentionTeamMembers] Team URL:",
                err?.config?.url
            );

            console.error(
                "[MentionTeamMembers] Team status:",
                err?.response?.status
            );

            console.error(
                "[MentionTeamMembers] Team response:",
                err?.response?.data
            );

            setTeams([]);

            setError(
                getApiMessage(
                    err,
                    "Failed to load your teams."
                )
            );

            return false;
        }
    };

    // ========================================================
    // LOAD PROJECTS
    //
    // IMPORTANT:
    // This endpoint must exist in your backend:
    //
    // GET /api/projects/my-developer-projects
    // ========================================================

    const loadProjects = async () => {
        try {
            console.log(
                "[MentionTeamMembers] Loading projects..."
            );

            const response = await api.get(
                "/projects/my-developer-projects"
            );

            console.log(
                "[MentionTeamMembers] Projects response:",
                response.data
            );

            const projectData =
                response?.data?.data ??
                response?.data;

            setProjects(
                Array.isArray(projectData)
                    ? projectData
                    : []
            );

            return true;
        } catch (err) {
            console.error(
                "[MentionTeamMembers] Failed to load projects:",
                err
            );

            console.error(
                "[MentionTeamMembers] Project URL:",
                err?.config?.url
            );

            console.error(
                "[MentionTeamMembers] Project status:",
                err?.response?.status
            );

            console.error(
                "[MentionTeamMembers] Project response:",
                err?.response?.data
            );

            setProjects([]);

            setError(
                getApiMessage(
                    err,
                    "Failed to load your projects."
                )
            );

            return false;
        }
    };

    // ========================================================
    // LOAD INBOX
    //
    // GET /api/communication/messages/inbox
    // ========================================================

    const loadInbox = async () => {
        try {
            console.log(
                "[MentionTeamMembers] Loading inbox..."
            );

            const response = await api.get(
                "/communication/messages/inbox"
            );

            console.log(
                "[MentionTeamMembers] Inbox response:",
                response.data
            );

            const inboxData =
                response?.data?.data ??
                response?.data;

            setMentions(
                Array.isArray(inboxData)
                    ? inboxData
                    : []
            );

            return true;
        } catch (err) {
            console.error(
                "[MentionTeamMembers] Failed to load inbox:",
                err
            );

            console.error(
                "[MentionTeamMembers] Inbox URL:",
                err?.config?.url
            );

            console.error(
                "[MentionTeamMembers] Inbox status:",
                err?.response?.status
            );

            console.error(
                "[MentionTeamMembers] Inbox response:",
                err?.response?.data
            );

            setMentions([]);

            setError(
                getApiMessage(
                    err,
                    "Failed to load team messages."
                )
            );

            return false;
        }
    };

    // ========================================================
    // LOAD ALL DATA
    // ========================================================

    const loadData = async () => {
        setError("");

        const results = await Promise.allSettled([
            loadTeams(),
            loadProjects(),
            loadInbox(),
        ]);

        const failedRequests = results.filter(
            (result) =>
                result.status === "rejected"
        );

        if (failedRequests.length > 0) {
            console.error(
                "[MentionTeamMembers] Failed requests:",
                failedRequests
            );
        }
    };

    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {
        const initialize = async () => {
            setLoading(true);

            await loadData();

            setLoading(false);
        };

        initialize();
    }, []);

    // ========================================================
    // LOAD TEAM MEMBERS
    //
    // GET /api/Team/{teamId}/members
    // ========================================================

    useEffect(() => {
        const loadTeamMembers = async () => {
            if (!selectedTeamId) {
                setUsers([]);
                setSelectedUserId("");
                return;
            }

            try {
                setError("");

                console.log(
                    "[MentionTeamMembers] Loading members for team:",
                    selectedTeamId
                );

                const response = await api.get(
                    `/Team/${selectedTeamId}/members`
                );

                console.log(
                    "[MentionTeamMembers] Members response:",
                    response.data
                );

                const memberData =
                    response?.data?.data ??
                    response?.data;

                const members =
                    Array.isArray(memberData)
                        ? memberData
                        : [];

                setUsers(members);

                const selectedStillExists =
                    members.some(
                        (member) =>
                            String(
                                getId(member)
                            ) ===
                            String(
                                selectedUserId
                            )
                    );

                if (!selectedStillExists) {
                    setSelectedUserId("");
                }
            } catch (err) {
                console.error(
                    "[MentionTeamMembers] Failed to load team members:",
                    err
                );

                console.error(
                    "[MentionTeamMembers] Member URL:",
                    err?.config?.url
                );

                console.error(
                    "[MentionTeamMembers] Member status:",
                    err?.response?.status
                );

                console.error(
                    "[MentionTeamMembers] Member response:",
                    err?.response?.data
                );

                setUsers([]);
                setSelectedUserId("");

                setError(
                    getApiMessage(
                        err,
                        "Failed to load team members."
                    )
                );
            }
        };

        loadTeamMembers();
    }, [selectedTeamId]);

    // ========================================================
    // FILTER TEAM MEMBERS
    // ========================================================

    const filteredUsers = useMemo(() => {
        const search =
            searchTerm
                .trim()
                .toLowerCase();

        return users.filter((user) => {
            if (!search) {
                return true;
            }

            const name =
                getName(user).toLowerCase();

            const email =
                getEmail(user).toLowerCase();

            const role =
                getRole(user).toLowerCase();

            return (
                name.includes(search) ||
                email.includes(search) ||
                role.includes(search)
            );
        });
    }, [users, searchTerm]);

    // ========================================================
    // SELECTED USER
    // ========================================================

    const selectedUser = useMemo(() => {
        return users.find(
            (user) =>
                String(
                    getId(user)
                ) ===
                String(
                    selectedUserId
                )
        );
    }, [users, selectedUserId]);

    // ========================================================
    // SELECTED PROJECT
    // ========================================================

    const selectedProject = useMemo(() => {
        return projects.find(
            (project) =>
                String(
                    getId(project)
                ) ===
                String(
                    selectedProjectId
                )
        );
    }, [projects, selectedProjectId]);

    // ========================================================
    // FILTER PROJECTS FOR SELECTED TEAM
    // ========================================================

    const availableProjects = useMemo(() => {
        if (!selectedTeamId) {
            return [];
        }

        const projectsWithTeam =
            projects.filter((project) => {
                const projectTeamId =
                    project?.teamId ??
                    project?.TeamId ??
                    project?.team?.id ??
                    project?.Team?.Id;

                return projectTeamId != null;
            });

        if (projectsWithTeam.length === 0) {
            return projects;
        }

        return projectsWithTeam.filter(
            (project) => {
                const projectTeamId =
                    project?.teamId ??
                    project?.TeamId ??
                    project?.team?.id ??
                    project?.Team?.Id;

                return (
                    String(projectTeamId) ===
                    String(selectedTeamId)
                );
            }
        );
    }, [projects, selectedTeamId]);

    // ========================================================
    // SELECT TEAM
    // ========================================================

    const handleTeamChange = (event) => {
        const teamId = event.target.value;

        setSelectedTeamId(teamId);
        setSelectedProjectId("");
        setSelectedUserId("");

        setSearchTerm("");
        setError("");
        setMessage("");
    };

    // ========================================================
    // SELECT PROJECT
    // ========================================================

    const handleProjectChange = (event) => {
        setSelectedProjectId(
            event.target.value
        );

        setError("");
        setMessage("");
    };

    // ========================================================
    // SELECT USER
    // ========================================================

    const handleSelectUser = (userId) => {
        setSelectedUserId(
            String(userId)
        );

        setError("");
        setMessage("");
    };

    // ========================================================
    // REFRESH
    // ========================================================

    const handleRefresh = async () => {
        setRefreshing(true);
        setError("");
        setMessage("");

        try {
            await loadData();

            setMessage(
                "Team communication data refreshed."
            );

            setTimeout(() => {
                setMessage("");
            }, 2500);
        } finally {
            setRefreshing(false);
        }
    };

    // ========================================================
    // SEND MESSAGE
    //
    // POST:
    // /api/communication/messages/team-member
    // ========================================================

    const handleSendMention = async () => {
        setMessage("");
        setError("");

        // ----------------------------------------------------
        // TEAM
        // ----------------------------------------------------

        if (!selectedTeamId) {
            setError(
                "Please select a team."
            );
            return;
        }

        // ----------------------------------------------------
        // PROJECT
        // ----------------------------------------------------

        if (!selectedProjectId) {
            setError(
                "Please select a project."
            );
            return;
        }

        // ----------------------------------------------------
        // RECIPIENT
        // ----------------------------------------------------

        if (!selectedUserId) {
            setError(
                "Please select a team member."
            );
            return;
        }

        if (!selectedUser) {
            setError(
                "Selected team member was not found."
            );
            return;
        }

        // ----------------------------------------------------
        // TITLE
        // ----------------------------------------------------

        if (!title.trim()) {
            setError(
                "Please enter a message title."
            );
            return;
        }

        if (title.trim().length > 200) {
            setError(
                "Message title cannot exceed 200 characters."
            );
            return;
        }

        // ----------------------------------------------------
        // MESSAGE
        // ----------------------------------------------------

        if (!messageText.trim()) {
            setError(
                "Please enter a message."
            );
            return;
        }

        if (messageText.trim().length > 5000) {
            setError(
                "Message cannot exceed 5000 characters."
            );
            return;
        }

        // ----------------------------------------------------
        // SEND
        // ----------------------------------------------------

        setSending(true);

        try {
            const response =
                await api.post(
                    "/communication/messages/team-member",
                    {
                        projectId:
                            selectedProjectId,

                        taskId: null,

                        receiverId:
                            selectedUserId,

                        title:
                            title.trim(),

                        message:
                            messageText.trim(),
                    }
                );

            console.log(
                "[MentionTeamMembers] Message sent:",
                response.data
            );

            // ------------------------------------------------
            // IMPORTANT
            //
            // The inbox endpoint contains RECEIVED messages.
            // A newly sent message is not necessarily part of
            // the current user's inbox.
            //
            // Therefore reload the real backend inbox instead
            // of pretending the sent message is an inbox item.
            // ------------------------------------------------

            await loadInbox();

            // ------------------------------------------------
            // CLEAR FORM
            // ------------------------------------------------

            setTitle("");
            setMessageText("");

            setMessage(
                "Message sent successfully."
            );

            setTimeout(() => {
                setMessage("");
            }, 2500);
        } catch (err) {
            console.error(
                "[MentionTeamMembers] Failed to send team member message:",
                err
            );

            console.error(
                "[MentionTeamMembers] Send URL:",
                err?.config?.url
            );

            console.error(
                "[MentionTeamMembers] Send status:",
                err?.response?.status
            );

            console.error(
                "[MentionTeamMembers] Send response:",
                err?.response?.data
            );

            setError(
                getApiMessage(
                    err,
                    "Failed to send message."
                )
            );
        } finally {
            setSending(false);
        }
    };

    // ========================================================
    // MARK MESSAGE AS READ
    //
    // PATCH:
    // /api/communication/messages/inbox/{messageId}/read
    // ========================================================

    const handleMarkAsRead = async (messageId) => {
        if (!messageId) {
            return;
        }

        try {
            await api.patch(
                `/communication/messages/inbox/${messageId}/read`
            );

            setMentions((previous) =>
                previous.map((item) =>
                    String(
                        getId(item)
                    ) ===
                    String(
                        messageId
                    )
                        ? {
                              ...item,
                              isRead: true,
                              IsRead: true,
                          }
                        : item
                )
            );
        } catch (err) {
            console.error(
                "[MentionTeamMembers] Failed to mark message as read:",
                err
            );

            setError(
                getApiMessage(
                    err,
                    "Failed to mark message as read."
                )
            );
        }
    };

    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center text-foreground">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Loader2
                        size={20}
                        className="animate-spin"
                    />

                    Loading team communication...
                </div>
            </div>
        );
    }

    // ========================================================
    // UI
    // ========================================================

    return (
        <div className="w-full space-y-6 text-foreground">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div className="flex items-center gap-3">

                    <div className="rounded-xl bg-primary/10 p-3">
                        <AtSign
                            size={24}
                            className="text-primary"
                        />
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-foreground">
                            Mention Team Members
                        </h2>

                        <p className="text-sm text-muted-foreground">
                            Mention and send messages to other
                            members of your team.
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <RefreshCw
                        size={16}
                        className={
                            refreshing
                                ? "animate-spin"
                                : ""
                        }
                    />

                    {refreshing
                        ? "Refreshing..."
                        : "Refresh"}
                </button>
            </div>

            {/* ==================================================
                SUCCESS MESSAGE
            ================================================== */}

            {message && (
                <div className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
                    <CheckCircle2 size={18} />
                    {message}
                </div>
            )}

            {/* ==================================================
                ERROR MESSAGE
            ================================================== */}

            {error && (
                <div className="flex items-center gap-2 rounded-xl border border-border bg-muted px-4 py-3 text-sm text-muted-foreground">
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}

            {/* ==================================================
                CONTENT
            ================================================== */}

            <div className="grid gap-6 lg:grid-cols-[360px_1fr]">

                {/* ==================================================
                    TEAM MEMBERS
                ================================================== */}

                <div className="rounded-2xl border border-border bg-card">

                    <div className="border-b border-border p-4">

                        <h3 className="mb-3 font-semibold text-card-foreground">
                            Team Members
                        </h3>

                        {/* TEAM */}

                        <label className="mb-2 block text-xs font-medium text-muted-foreground">
                            Team
                        </label>

                        <select
                            value={selectedTeamId}
                            onChange={handleTeamChange}
                            className="mb-4 w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        >
                            <option value="">
                                Select a team
                            </option>

                            {teams.map((team) => (
                                <option
                                    key={String(
                                        getId(team)
                                    )}
                                    value={String(
                                        getId(team)
                                    )}
                                >
                                    {getName(team)}
                                </option>
                            ))}
                        </select>

                        {/* SEARCH */}

                        <div className="relative">

                            <Search
                                size={17}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            />

                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(event) =>
                                    setSearchTerm(
                                        event.target.value
                                    )
                                }
                                disabled={!selectedTeamId}
                                placeholder={
                                    selectedTeamId
                                        ? "Search members..."
                                        : "Select a team first..."
                                }
                                className="w-full rounded-lg border border-border bg-muted py-2.5 pl-10 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
                            />
                        </div>
                    </div>

                    {/* MEMBER LIST */}

                    <div className="max-h-[520px] overflow-y-auto p-3">

                        {!selectedTeamId ? (
                            <div className="py-10 text-center">

                                <UserRound
                                    size={32}
                                    className="mx-auto mb-3 text-muted-foreground"
                                />

                                <p className="text-sm text-muted-foreground">
                                    Select a team to view members.
                                </p>
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="py-10 text-center">

                                <UserRound
                                    size={32}
                                    className="mx-auto mb-3 text-muted-foreground"
                                />

                                <p className="text-sm text-muted-foreground">
                                    No team members found.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2">

                                {filteredUsers.map(
                                    (user) => {
                                        const userId =
                                            getId(user);

                                        const isSelected =
                                            String(
                                                userId
                                            ) ===
                                            String(
                                                selectedUserId
                                            );

                                        return (
                                            <button
                                                key={String(
                                                    userId
                                                )}
                                                type="button"
                                                onClick={() =>
                                                    handleSelectUser(
                                                        userId
                                                    )
                                                }
                                                className={`w-full rounded-xl border p-4 text-left transition ${
                                                    isSelected
                                                        ? "border-primary bg-primary/10"
                                                        : "border-border bg-muted hover:border-primary/40 hover:bg-muted/80"
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">

                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                                        <UserRound
                                                            size={
                                                                18
                                                            }
                                                            className="text-primary"
                                                        />
                                                    </div>

                                                    <div className="min-w-0 flex-1">

                                                        <p className="truncate text-sm font-semibold text-foreground">
                                                            {getName(
                                                                user
                                                            )}
                                                        </p>

                                                        <p className="mt-1 truncate text-xs text-muted-foreground">
                                                            {getEmail(
                                                                user
                                                            ) ||
                                                                "No email"}
                                                        </p>

                                                        <span className="mt-1 inline-block text-xs text-primary">
                                                            {getRole(
                                                                user
                                                            )}
                                                        </span>
                                                    </div>

                                                    {isSelected && (
                                                        <Check
                                                            size={
                                                                18
                                                            }
                                                            className="shrink-0 text-primary"
                                                        />
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    }
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* ==================================================
                    MESSAGE AREA
                ================================================== */}

                <div className="space-y-6">

                    {/* ==================================================
                        MESSAGE COMPOSER
                    ================================================== */}

                    <div className="rounded-2xl border border-border bg-card p-6">

                        {!selectedUser ? (
                            <div className="flex min-h-[400px] items-center justify-center text-center">

                                <div>

                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                        <AtSign
                                            size={30}
                                            className="text-primary"
                                        />
                                    </div>

                                    <h3 className="text-lg font-semibold text-card-foreground">
                                        Select a team member
                                    </h3>

                                    <p className="mt-2 max-w-md text-sm text-muted-foreground">
                                        Select a team member from
                                        the list to send a message.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <>

                                {/* RECIPIENT */}

                                <div className="mb-6 flex items-center gap-4 rounded-xl border border-border bg-muted p-4">

                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                        <UserRound
                                            size={22}
                                            className="text-primary"
                                        />
                                    </div>

                                    <div>

                                        <p className="text-xs uppercase tracking-wider text-muted-foreground">
                                            Sending to
                                        </p>

                                        <h3 className="font-semibold text-card-foreground">
                                            {getName(
                                                selectedUser
                                            )}
                                        </h3>

                                        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                                            <Mail size={13} />

                                            {getEmail(
                                                selectedUser
                                            ) ||
                                                "No email available"}
                                        </div>
                                    </div>
                                </div>

                                {/* PROJECT */}

                                <label className="mb-2 block text-sm font-medium text-card-foreground">
                                    Project
                                </label>

                                <div className="relative mb-5">

                                    <FolderKanban
                                        size={17}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                    />

                                    <select
                                        value={
                                            selectedProjectId
                                        }
                                        onChange={
                                            handleProjectChange
                                        }
                                        className="w-full appearance-none rounded-xl border border-border bg-muted py-3 pl-10 pr-4 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                    >
                                        <option value="">
                                            Select a project
                                        </option>

                                        {availableProjects.map(
                                            (project) => (
                                                <option
                                                    key={String(
                                                        getId(
                                                            project
                                                        )
                                                    )}
                                                    value={String(
                                                        getId(
                                                            project
                                                        )
                                                    )}
                                                >
                                                    {getProjectName(
                                                        project
                                                    )}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>

                                {/* TITLE */}

                                <label className="mb-2 block text-sm font-medium text-card-foreground">
                                    Message Title
                                </label>

                                <input
                                    type="text"
                                    value={title}
                                    onChange={(event) =>
                                        setTitle(
                                            event.target.value
                                        )
                                    }
                                    maxLength={200}
                                    placeholder="Enter message title..."
                                    className="mb-5 w-full rounded-xl border border-border bg-muted px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                                />

                                {/* MESSAGE */}

                                <div className="mb-2 flex items-center justify-between">

                                    <label className="block text-sm font-medium text-card-foreground">
                                        Message
                                    </label>

                                    <span className="text-xs text-muted-foreground">
                                        {
                                            messageText.length
                                        }
                                        /5000
                                    </span>
                                </div>

                                <textarea
                                    value={messageText}
                                    onChange={(event) =>
                                        setMessageText(
                                            event.target.value
                                        )
                                    }
                                    maxLength={5000}
                                    placeholder={`Write a message to ${getName(
                                        selectedUser
                                    )}...`}
                                    rows={7}
                                    className="w-full resize-none rounded-xl border border-border bg-muted px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                                />

                                {/* SEND */}

                                <div className="mt-4 flex justify-end">

                                    <button
                                        type="button"
                                        onClick={
                                            handleSendMention
                                        }
                                        disabled={sending}
                                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {sending ? (
                                            <>
                                                <Loader2
                                                    size={
                                                        16
                                                    }
                                                    className="animate-spin"
                                                />

                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send
                                                    size={
                                                        16
                                                    }
                                                />

                                                Send Message
                                            </>
                                        )}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    {/* ==================================================
                        RECENT MESSAGES
                    ================================================== */}

                    <div className="rounded-2xl border border-border bg-card p-5">

                        <div className="mb-4 flex items-center justify-between">

                            <div>
                                <h3 className="font-semibold text-card-foreground">
                                    Recent Messages
                                </h3>

                                <p className="text-xs text-muted-foreground">
                                    Messages received through team
                                    communication.
                                </p>
                            </div>

                            <AtSign
                                size={20}
                                className="text-primary"
                            />
                        </div>

                        {mentions.length === 0 ? (
                            <div className="py-8 text-center">

                                <p className="text-sm text-muted-foreground">
                                    No recent messages.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">

                                {mentions
                                    .slice(0, 5)
                                    .map(
                                        (mention) => {
                                            const messageId =
                                                getId(
                                                    mention
                                                );

                                            const senderName =
                                                mention?.senderName ||
                                                mention?.SenderName ||
                                                "Unknown User";

                                            const receiverName =
                                                mention?.receiverName ||
                                                mention?.ReceiverName ||
                                                "Unknown User";

                                            const messageContent =
                                                mention?.message ||
                                                mention?.Message ||
                                                "";

                                            const messageTitle =
                                                mention?.title ||
                                                mention?.Title ||
                                                "Message";

                                            const createdAt =
                                                mention?.createdAt ||
                                                mention?.CreatedAt;

                                            const isRead =
                                                mention?.isRead ??
                                                mention?.IsRead ??
                                                false;

                                            return (
                                                <div
                                                    key={String(
                                                        messageId
                                                    )}
                                                    className={`rounded-xl border p-4 ${
                                                        isRead
                                                            ? "border-border bg-muted"
                                                            : "border-primary/30 bg-primary/5"
                                                    }`}
                                                >

                                                    <div className="flex items-start justify-between gap-4">

                                                        <div className="min-w-0">

                                                            <div className="flex flex-wrap items-center gap-2">

                                                                <p className="text-sm text-foreground">

                                                                    <span className="font-semibold text-primary">
                                                                        {
                                                                            senderName
                                                                        }
                                                                    </span>

                                                                    <span className="text-muted-foreground">
                                                                        {" "}
                                                                        →
                                                                        {" "}
                                                                    </span>

                                                                    <span className="font-semibold text-card-foreground">
                                                                        {
                                                                            receiverName
                                                                        }
                                                                    </span>
                                                                </p>

                                                                {!isRead && (
                                                                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                                                                        Unread
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <p className="mt-2 text-sm font-semibold text-card-foreground">
                                                                {
                                                                    messageTitle
                                                                }
                                                            </p>

                                                            <p className="mt-1 text-sm text-muted-foreground">
                                                                {
                                                                    messageContent
                                                                }
                                                            </p>
                                                        </div>

                                                        <div className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                                                            <CalendarDays
                                                                size={
                                                                    13
                                                                }
                                                            />

                                                            {formatDate(
                                                                createdAt
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* MARK AS READ */}

                                                    {!isRead &&
                                                        messageId && (
                                                            <div className="mt-3 flex justify-end">

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleMarkAsRead(
                                                                            messageId
                                                                        )
                                                                    }
                                                                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-muted"
                                                                >
                                                                    <Check
                                                                        size={
                                                                            14
                                                                        }
                                                                    />

                                                                    Mark as read
                                                                </button>
                                                            </div>
                                                        )}
                                                </div>
                                            );
                                        }
                                    )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MentionTeamMembers;