import React, { useEffect, useMemo, useState } from "react";

import {
    AlertCircle,
    CheckCircle2,
    Loader2,
    MessageCircle,
    RefreshCw,
    Send,
    UserRound,
    Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
    getManagerProjects,
    getProjectTeam,
    getTeamLeader,
    getTeamLeaderMessages,
    sendMessageToTeamLeader,
} from "@/services/communicationService";

// ============================================================
// COMM-002
// SEND MESSAGE TO TEAM LEADER
// ============================================================
//
// Purpose:
// Allow the Project Manager to send a direct message to the
// current Team Leader of an authorized project team.
//
// IMPORTANT:
// - Existing backend/service functionality is preserved.
// - Project IDs are loaded dynamically.
// - Team IDs are loaded dynamically.
// - Current Team Leader is loaded dynamically.
// - Conversation is loaded dynamically.
// - Message sending uses the existing service.
// - UI is styled to match the Communication / Notifications page.
// ============================================================

function SendMessageToTeamLeader() {
    // ========================================================
    // PROJECT STATE
    // ========================================================

    const [projects, setProjects] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState("");
    const [selectedProject, setSelectedProject] = useState(null);

    // ========================================================
    // TEAM STATE
    // ========================================================

    const [teams, setTeams] = useState([]);
    const [selectedTeamId, setSelectedTeamId] = useState("");
    const [selectedTeam, setSelectedTeam] = useState(null);

    // ========================================================
    // TEAM LEADER STATE
    // ========================================================

    const [teamLeader, setTeamLeader] = useState(null);

    // ========================================================
    // MESSAGE STATE
    // ========================================================

    const [messageText, setMessageText] = useState("");
    const [messages, setMessages] = useState([]);

    // ========================================================
    // LOADING STATE
    // ========================================================

    const [loadingProjects, setLoadingProjects] = useState(true);
    const [loadingTeams, setLoadingTeams] = useState(false);
    const [loadingLeader, setLoadingLeader] = useState(false);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [sending, setSending] = useState(false);

    // ========================================================
    // ERROR / SUCCESS
    // ========================================================

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // ========================================================
    // LOAD PROJECTS
    // ========================================================

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            setLoadingProjects(true);
            setError("");
            setSuccess("");

            const result = await getManagerProjects();

            const projectList = Array.isArray(result)
                ? result
                : result?.projects ||
                  result?.data ||
                  [];

            const validProjects = Array.isArray(projectList)
                ? projectList
                : [];

            setProjects(validProjects);

            // Automatically select the first project when
            // projects are available.
            if (validProjects.length > 0) {
                const firstProject = validProjects[0];
                const firstProjectId =
                    getProjectId(firstProject);

                if (
                    firstProjectId !== null &&
                    firstProjectId !== undefined
                ) {
                    setSelectedProjectId(
                        String(firstProjectId)
                    );
                    setSelectedProject(firstProject);

                    await loadProjectTeams(
                        firstProjectId,
                        firstProject
                    );
                }
            } else {
                setSelectedProjectId("");
                setSelectedProject(null);
                setTeams([]);
            }
        } catch (err) {
            console.error(
                "Failed to load manager projects:",
                err
            );

            setProjects([]);
            setSelectedProjectId("");
            setSelectedProject(null);
            setTeams([]);

            setError(
                err?.message ||
                    "Unable to load your assigned projects."
            );
        } finally {
            setLoadingProjects(false);
        }
    };

    // ========================================================
    // HELPERS
    // ========================================================

    const getProjectId = (project) => {
        if (!project) return null;

        return (
            project.id ??
            project.projectId ??
            project.projectID
        );
    };

    const getProjectName = (project) => {
        if (!project) return "Unnamed Project";

        return (
            project.name ||
            project.title ||
            project.projectName ||
            "Unnamed Project"
        );
    };

    const getTeamId = (team) => {
        if (!team) return null;

        return (
            team.id ??
            team.teamId ??
            team.teamID
        );
    };

    const getTeamName = (team) => {
        if (!team) return "Unnamed Team";

        return (
            team.name ||
            team.teamName ||
            team.title ||
            "Unnamed Team"
        );
    };

    const getUserId = (user) => {
        if (!user) return null;

        return (
            user.id ??
            user.userId ??
            user.userID
        );
    };

    const getUserName = (user) => {
        if (!user) return "Unknown User";

        return (
            user.name ||
            user.fullName ||
            user.userName ||
            user.username ||
            "Unknown User"
        );
    };

    const getUserEmail = (user) => {
        if (!user) return "";

        return user.email || "";
    };

    // ========================================================
    // NORMALIZE TEAMS
    // ========================================================

    const normalizeTeams = (result) => {
        if (Array.isArray(result)) {
            return result;
        }

        if (Array.isArray(result?.teams)) {
            return result.teams;
        }

        if (result?.team) {
            return [result.team];
        }

        if (result?.data) {
            if (Array.isArray(result.data)) {
                return result.data;
            }

            if (Array.isArray(result.data?.teams)) {
                return result.data.teams;
            }

            if (result.data?.team) {
                return [result.data.team];
            }
        }

        return [];
    };

    // ========================================================
    // NORMALIZE TEAM LEADER
    // ========================================================

    const normalizeTeamLeader = (result, team) => {
        if (!result && !team) {
            return null;
        }

        if (result?.teamLeader) {
            return result.teamLeader;
        }

        if (result?.leader) {
            return result.leader;
        }

        if (result?.manager) {
            return result.manager;
        }

        if (result?.user) {
            return result.user;
        }

        if (result?.data?.teamLeader) {
            return result.data.teamLeader;
        }

        if (result?.data?.leader) {
            return result.data.leader;
        }

        if (result?.data?.user) {
            return result.data.user;
        }

        if (team?.teamLeader) {
            return team.teamLeader;
        }

        if (team?.leader) {
            return team.leader;
        }

        if (team?.teamLeaderUser) {
            return team.teamLeaderUser;
        }

        return null;
    };

    // ========================================================
    // PROJECT CHANGE
    // ========================================================

    const handleProjectChange = async (event) => {
        const projectId = event.target.value;

        setSelectedProjectId(projectId);
        setSelectedProject(null);

        setTeams([]);
        setSelectedTeamId("");
        setSelectedTeam(null);

        setTeamLeader(null);
        setMessages([]);
        setMessageText("");

        setError("");
        setSuccess("");

        if (!projectId) {
            return;
        }

        const project =
            projects.find(
                (item) =>
                    String(getProjectId(item)) ===
                    String(projectId)
            ) || null;

        setSelectedProject(project);

        await loadProjectTeams(
            projectId,
            project
        );
    };

    // ========================================================
    // LOAD PROJECT TEAMS
    // ========================================================

    const loadProjectTeams = async (
        projectId,
        project = null
    ) => {
        try {
            setLoadingTeams(true);
            setError("");

            const result =
                await getProjectTeam(projectId);

            const teamList =
                normalizeTeams(result);

            setTeams(teamList);

            if (teamList.length === 1) {
                const firstTeam = teamList[0];
                const firstTeamId =
                    getTeamId(firstTeam);

                if (
                    firstTeamId !== null &&
                    firstTeamId !== undefined
                ) {
                    setSelectedTeamId(
                        String(firstTeamId)
                    );

                    setSelectedTeam(firstTeam);

                    await loadTeamLeader(
                        firstTeamId,
                        firstTeam,
                        project
                    );
                }
            }
        } catch (err) {
            console.error(
                "Failed to load project team:",
                err
            );

            setTeams([]);

            setError(
                err?.message ||
                    "Unable to load the Team assigned to this project."
            );
        } finally {
            setLoadingTeams(false);
        }
    };

    // ========================================================
    // TEAM CHANGE
    // ========================================================

    const handleTeamChange = async (event) => {
        const teamId = event.target.value;

        setSelectedTeamId(teamId);
        setSelectedTeam(null);
        setTeamLeader(null);

        setMessages([]);
        setMessageText("");

        setError("");
        setSuccess("");

        if (!teamId) {
            return;
        }

        const team =
            teams.find(
                (item) =>
                    String(getTeamId(item)) ===
                    String(teamId)
            ) || null;

        setSelectedTeam(team);

        await loadTeamLeader(
            teamId,
            team,
            selectedProject
        );
    };

    // ========================================================
    // LOAD TEAM LEADER
    // ========================================================

    const loadTeamLeader = async (
        teamId,
        team = null,
        project = null
    ) => {
        try {
            setLoadingLeader(true);
            setError("");

            const result =
                await getTeamLeader(teamId);

            const leader =
                normalizeTeamLeader(
                    result,
                    team
                );

            setTeamLeader(leader || null);

            if (leader) {
                await loadMessages(
                    leader,
                    teamId,
                    project
                );
            } else {
                setMessages([]);
            }
        } catch (err) {
            console.error(
                "Failed to load Team Leader:",
                err
            );

            setTeamLeader(null);
            setMessages([]);

            setError(
                err?.message ||
                    "Unable to retrieve the current Team Leader."
            );
        } finally {
            setLoadingLeader(false);
        }
    };

    // ========================================================
    // LOAD MESSAGES
    // ========================================================

    const loadMessages = async (
        leader,
        teamId,
        project = null
    ) => {
        try {
            setLoadingMessages(true);

            const leaderId =
                getUserId(leader);

            if (leaderId === null) {
                setMessages([]);
                return;
            }

            const projectId =
                getProjectId(project);

            const result =
                await getTeamLeaderMessages({
                    projectId,
                    teamId,
                    teamLeaderId: leaderId,
                });

            const messageList =
                Array.isArray(result)
                    ? result
                    : result?.messages ||
                      result?.data ||
                      [];

            setMessages(
                Array.isArray(messageList)
                    ? messageList
                    : []
            );
        } catch (err) {
            console.error(
                "Failed to load conversation:",
                err
            );

            setMessages([]);
        } finally {
            setLoadingMessages(false);
        }
    };

    // ========================================================
    // VALIDATION
    // ========================================================

    const validateMessage = () => {
        if (!selectedProjectId) {
            return "Please select a project.";
        }

        if (!selectedTeamId) {
            return "Please select a team.";
        }

        if (!teamLeader) {
            return "No Team Leader is currently assigned to this Team.";
        }

        if (!messageText.trim()) {
            return "Please enter a message.";
        }

        return "";
    };

    // ========================================================
    // SEND MESSAGE
    // ========================================================

    const handleSendMessage = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        const validationError =
            validateMessage();

        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setSending(true);

            const projectId =
                getProjectId(selectedProject);

            const teamId =
                getTeamId(selectedTeam);

            const teamLeaderId =
                getUserId(teamLeader);

            if (
                projectId === null ||
                teamId === null ||
                teamLeaderId === null
            ) {
                setError(
                    "Unable to determine the project, team, or Team Leader."
                );
                return;
            }

            const payload = {
                projectId,
                teamId,
                recipientId: teamLeaderId,
                message: messageText.trim(),
            };

            const result =
                await sendMessageToTeamLeader(
                    payload
                );

            const sentMessage =
                result?.message ||
                result?.data ||
                result;

            if (
                sentMessage &&
                typeof sentMessage ===
                    "object" &&
                !Array.isArray(sentMessage)
            ) {
                setMessages((previous) => [
                    ...previous,
                    sentMessage,
                ]);
            } else {
                await loadMessages(
                    teamLeader,
                    teamId,
                    selectedProject
                );
            }

            setMessageText("");

            setSuccess(
                "Message sent successfully."
            );
        } catch (err) {
            console.error(
                "Failed to send message:",
                err
            );

            setError(
                err?.message ||
                    "Unable to send the message. Please try again."
            );
        } finally {
            setSending(false);
        }
    };

    // ========================================================
    // REFRESH
    // ========================================================

    const handleRefresh = async () => {
        setError("");
        setSuccess("");

        if (
            selectedTeamId &&
            teamLeader
        ) {
            await loadMessages(
                teamLeader,
                selectedTeamId,
                selectedProject
            );

            return;
        }

        if (selectedProjectId) {
            await loadProjectTeams(
                selectedProjectId,
                selectedProject
            );

            return;
        }

        await loadProjects();
    };

    // ========================================================
    // FORMAT DATE
    // ========================================================

    const formatMessageDate = (value) => {
        if (!value) return "";

        const date = new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return String(value);
        }

        return date.toLocaleString();
    };

    // ========================================================
    // MESSAGE OWNER
    // ========================================================

    const isManagerMessage = (message) => {
        const senderRole =
            String(
                message?.senderRole ||
                    message?.role ||
                    ""
            ).toLowerCase();

        if (
            senderRole.includes("manager")
        ) {
            return true;
        }

        return (
            message?.isFromManager === true ||
            message?.senderType === "Manager"
        );
    };

    // ========================================================
    // OPTIONS
    // ========================================================

    const projectOptions = useMemo(
        () => projects,
        [projects]
    );

    const teamOptions = useMemo(
        () => teams,
        [teams]
    );

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="w-full space-y-6 text-foreground">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-foreground text-background">
                        <MessageCircle className="h-5 w-5" />
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-foreground">
                            Message Team Leader
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Send a direct message to the Team Leader of an authorized project team.
                        </p>
                    </div>

                </div>

                <Button
                    type="button"
                    variant="outline"
                    onClick={handleRefresh}
                    disabled={
                        loadingProjects ||
                        loadingTeams ||
                        loadingLeader ||
                        loadingMessages ||
                        sending
                    }
                    className="gap-2 border-input bg-background text-foreground hover:bg-muted"
                >
                    <RefreshCw
                        className={`h-4 w-4 ${
                            loadingProjects ||
                            loadingTeams ||
                            loadingLeader ||
                            loadingMessages
                                ? "animate-spin"
                                : ""
                        }`}
                    />

                    Refresh
                </Button>

            </div>

            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (
                <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">

                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

                    <span>{error}</span>

                </div>
            )}

            {/* ==================================================
                SUCCESS
            ================================================== */}

            {success && (
                <div className="flex items-start gap-3 rounded-lg border border-border bg-muted p-4 text-sm text-foreground">

                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                    <span>{success}</span>

                </div>
            )}

            {/* ==================================================
                PROJECT & TEAM
            ================================================== */}

            <div className="rounded-lg border border-border bg-card">

                <div className="border-b border-border px-5 py-4">

                    <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted text-foreground">
                            <Users className="h-5 w-5" />
                        </div>

                        <div>
                            <h3 className="font-semibold text-foreground">
                                Project & Team
                            </h3>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Select an authorized project and its assigned Team.
                            </p>
                        </div>

                    </div>

                </div>

                <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">

                    {/* PROJECT */}

                    <div>
                        <label
                            htmlFor="project"
                            className="mb-2 block text-sm font-medium text-foreground"
                        >
                            Project
                        </label>

                        <select
                            id="project"
                            value={selectedProjectId}
                            onChange={handleProjectChange}
                            disabled={
                                loadingProjects ||
                                sending
                            }
                            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="">
                                {loadingProjects
                                    ? "Loading assigned projects..."
                                    : projects.length === 0
                                    ? "No assigned projects found"
                                    : "Select project"}
                            </option>

                            {projectOptions.map(
                                (project) => {
                                    const id =
                                        getProjectId(
                                            project
                                        );

                                    return (
                                        <option
                                            key={id}
                                            value={id}
                                        >
                                            {getProjectName(
                                                project
                                            )}
                                        </option>
                                    );
                                }
                            )}
                        </select>
                    </div>

                    {/* TEAM */}

                    <div>
                        <label
                            htmlFor="team"
                            className="mb-2 block text-sm font-medium text-foreground"
                        >
                            Team
                        </label>

                        <select
                            id="team"
                            value={selectedTeamId}
                            onChange={handleTeamChange}
                            disabled={
                                !selectedProjectId ||
                                loadingTeams ||
                                sending
                            }
                            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="">
                                {!selectedProjectId
                                    ? "Select a project first"
                                    : loadingTeams
                                    ? "Loading team..."
                                    : teams.length === 0
                                    ? "No team assigned"
                                    : "Select team"}
                            </option>

                            {teamOptions.map(
                                (team) => {
                                    const id =
                                        getTeamId(
                                            team
                                        );

                                    return (
                                        <option
                                            key={id}
                                            value={id}
                                        >
                                            {getTeamName(
                                                team
                                            )}
                                        </option>
                                    );
                                }
                            )}
                        </select>
                    </div>

                </div>
            </div>

            {/* ==================================================
                NO TEAM
            ================================================== */}

            {selectedProjectId &&
                !loadingTeams &&
                teams.length === 0 && (
                    <div className="rounded-lg border border-border bg-muted p-5">

                        <div className="flex items-start gap-3">

                            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />

                            <div>
                                <h3 className="font-medium text-foreground">
                                    No Team assigned
                                </h3>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    This project does not currently have an assigned Team.
                                </p>
                            </div>

                        </div>

                    </div>
                )}

            {/* ==================================================
                TEAM LEADER
            ================================================== */}

            {selectedTeamId && (
                <div className="rounded-lg border border-border bg-card">

                    <div className="border-b border-border px-5 py-4">

                        <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted text-foreground">
                                <UserRound className="h-5 w-5" />
                            </div>

                            <div>
                                <h3 className="font-semibold text-foreground">
                                    Team Leader
                                </h3>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Current Team Leader retrieved from the Team relationship.
                                </p>
                            </div>

                        </div>

                    </div>

                    <div className="p-5">

                        {loadingLeader ? (
                            <div className="flex items-center gap-3 rounded-md border border-border bg-muted p-4">

                                <Loader2 className="h-5 w-5 animate-spin text-primary" />

                                <span className="text-sm text-muted-foreground">
                                    Loading current Team Leader...
                                </span>

                            </div>
                        ) : teamLeader ? (
                            <div className="flex flex-col gap-4 rounded-md border border-border bg-muted p-4 sm:flex-row sm:items-center sm:justify-between">

                                <div className="flex items-center gap-3">

                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background text-foreground">
                                        <UserRound className="h-5 w-5" />
                                    </div>

                                    <div>
                                        <h4 className="font-medium text-foreground">
                                            {getUserName(
                                                teamLeader
                                            )}
                                        </h4>

                                        {getUserEmail(
                                            teamLeader
                                        ) && (
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {getUserEmail(
                                                    teamLeader
                                                )}
                                            </p>
                                        )}
                                    </div>

                                </div>

                                <span className="inline-flex w-fit rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground">
                                    Team Leader
                                </span>

                            </div>
                        ) : (
                            <div className="rounded-md border border-border bg-muted p-4 text-sm text-muted-foreground">
                                No Team Leader is currently assigned to this Team.
                            </div>
                        )}

                    </div>
                </div>
            )}

            {/* ==================================================
                MAIN COMMUNICATION AREA
            ================================================== */}

            {selectedTeamId &&
                teamLeader && (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                        {/* ==================================================
                            MESSAGE COMPOSER
                        ================================================== */}

                        <div className="rounded-lg border border-border bg-card lg:col-span-1">

                            <div className="border-b border-border px-5 py-4">

                                <div className="flex items-center gap-3">

                                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted text-foreground">
                                        <Send className="h-4 w-4" />
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-foreground">
                                            New Message
                                        </h3>

                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Message{" "}
                                            <span className="font-medium text-foreground">
                                                {getUserName(
                                                    teamLeader
                                                )}
                                            </span>
                                        </p>
                                    </div>

                                </div>

                            </div>

                            <div className="p-5">

                                <form
                                    onSubmit={
                                        handleSendMessage
                                    }
                                >

                                    <label
                                        htmlFor="message"
                                        className="mb-2 block text-sm font-medium text-foreground"
                                    >
                                        Message
                                    </label>

                                    <textarea
                                        id="message"
                                        value={
                                            messageText
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setMessageText(
                                                event.target
                                                    .value
                                            )
                                        }
                                        disabled={
                                            sending
                                        }
                                        rows={8}
                                        maxLength={5000}
                                        placeholder="Enter your message..."
                                        className="w-full resize-none rounded-md border border-input bg-background px-3 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50"
                                    />

                                    <div className="mt-2 flex justify-between text-xs text-muted-foreground">

                                        <span>
                                            Messages are
                                            stored securely.
                                        </span>

                                        <span>
                                            {
                                                messageText.length
                                            }
                                            /5000
                                        </span>

                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={
                                            sending ||
                                            !messageText.trim()
                                        }
                                        className="mt-4 w-full gap-2"
                                    >
                                        {sending ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="h-4 w-4" />
                                                Send Message
                                            </>
                                        )}
                                    </Button>

                                </form>

                            </div>
                        </div>

                        {/* ==================================================
                            CONVERSATION
                        ================================================== */}

                        <div className="flex min-h-[500px] flex-col rounded-lg border border-border bg-card lg:col-span-2">

                            <div className="flex items-center justify-between border-b border-border px-5 py-4">

                                <div className="flex items-center gap-3">

                                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted text-foreground">
                                        <MessageCircle className="h-4 w-4" />
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-foreground">
                                            Conversation
                                        </h3>

                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {getUserName(
                                                teamLeader
                                            )}
                                        </p>
                                    </div>

                                </div>

                                {loadingMessages && (
                                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                )}

                            </div>

                            <div className="flex-1 space-y-4 overflow-y-auto p-5">

                                {!loadingMessages &&
                                    messages.length ===
                                        0 && (
                                        <div className="flex min-h-[350px] flex-col items-center justify-center text-center">

                                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-muted text-foreground">
                                                <MessageCircle className="h-6 w-6" />
                                            </div>

                                            <h4 className="font-medium text-foreground">
                                                No messages yet
                                            </h4>

                                            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                                                Start the conversation with the Team Leader.
                                            </p>

                                        </div>
                                    )}

                                {messages.map(
                                    (
                                        message,
                                        index
                                    ) => {
                                        const fromManager =
                                            isManagerMessage(
                                                message
                                            );

                                        const text =
                                            message?.message ||
                                            message?.content ||
                                            message?.text ||
                                            "";

                                        const sender =
                                            message?.sender ||
                                            message?.senderName ||
                                            (fromManager
                                                ? "You"
                                                : getUserName(
                                                      teamLeader
                                                  ));

                                        const date =
                                            message?.createdAt ||
                                            message?.sentAt ||
                                            message?.timestamp ||
                                            message?.date;

                                        return (
                                            <div
                                                key={
                                                    message?.id ||
                                                    message?.messageId ||
                                                    index
                                                }
                                                className={`flex ${
                                                    fromManager
                                                        ? "justify-end"
                                                        : "justify-start"
                                                }`}
                                            >

                                                <div
                                                    className={`max-w-[85%] rounded-lg border px-4 py-3 ${
                                                        fromManager
                                                            ? "border-foreground bg-foreground text-background"
                                                            : "border-border bg-muted text-foreground"
                                                    }`}
                                                >

                                                    <div className="mb-1 text-xs font-medium opacity-70">
                                                        {
                                                            sender
                                                        }
                                                    </div>

                                                    <p className="whitespace-pre-wrap text-sm leading-6">
                                                        {
                                                            text
                                                        }
                                                    </p>

                                                    {date && (
                                                        <div className="mt-2 text-[11px] opacity-60">
                                                            {formatMessageDate(
                                                                date
                                                            )}
                                                        </div>
                                                    )}

                                                </div>

                                            </div>
                                        );
                                    }
                                )}

                            </div>
                        </div>

                    </div>
                )}

            {/* ==================================================
                NO TEAM LEADER
            ================================================== */}

            {selectedTeamId &&
                !loadingLeader &&
                !teamLeader && (
                    <div className="rounded-lg border border-border bg-card p-10 text-center">

                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-muted text-foreground">
                            <UserRound className="h-6 w-6" />
                        </div>

                        <h3 className="font-semibold text-foreground">
                            No Team Leader Assigned
                        </h3>

                        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
                            No Team Leader is currently assigned to this Team.
                            The messaging interface is unavailable until a
                            current Team Leader is assigned.
                        </p>

                    </div>
                )}

            {/* ==================================================
                INITIAL STATE
            ================================================== */}

            {!selectedProjectId &&
                !loadingProjects &&
                !error && (
                    <div className="rounded-lg border border-border bg-card p-10 text-center">

                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-muted text-foreground">
                            <MessageCircle className="h-6 w-6" />
                        </div>

                        <h3 className="font-semibold text-foreground">
                            Message Team Leader
                        </h3>

                        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
                            Select an assigned project to find its current
                            Team Leader and start a conversation.
                        </p>

                    </div>
                )}

        </div>
    );
}

export default SendMessageToTeamLeader;