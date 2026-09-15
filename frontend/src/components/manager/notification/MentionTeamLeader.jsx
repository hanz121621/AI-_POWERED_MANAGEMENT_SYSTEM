import React, { useEffect, useMemo, useState } from "react";

import {
    Activity,
    AlertCircle,
    AtSign,
    CheckCircle2,
    FileText,
    MessageSquare,
    RefreshCw,
    Send,
    User,
    Users,
    X,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
    getManagerProjects,
    getProjectTeams,
    getTeamLeader,
    mentionTeamLeader,
} from "@/services/communicationService";

// ============================================================
// AIPMS — COMM-003
// MENTION TEAM LEADER
//
// Purpose:
// Allow the Manager to mention the current Team Leader
// in an authorized project/team communication.
//
// UI:
// Matches Manager Notifications / Admin-style design.
//
// Functionality:
// - Load Manager projects
// - Select project
// - Load project teams
// - Select team
// - Load current Team Leader
// - Mention Team Leader
// - Validate active Team Leader
// - Refresh Team Leader
// - Reset form
// ============================================================

function MentionTeamLeader() {
    // ========================================================
    // STATE
    // ========================================================

    const [projects, setProjects] = useState([]);
    const [teams, setTeams] = useState([]);

    const [selectedProjectId, setSelectedProjectId] = useState("");
    const [selectedTeamId, setSelectedTeamId] = useState("");

    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedTeam, setSelectedTeam] = useState(null);

    const [teamLeader, setTeamLeader] = useState(null);

    const [message, setMessage] = useState("");

    // ========================================================
    // LOADING
    // ========================================================

    const [loadingProjects, setLoadingProjects] = useState(true);
    const [loadingTeams, setLoadingTeams] = useState(false);
    const [loadingLeader, setLoadingLeader] = useState(false);
    const [sending, setSending] = useState(false);

    // ========================================================
    // FEEDBACK
    // ========================================================

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // ========================================================
    // LOAD PROJECTS ON MOUNT
    // ========================================================

    useEffect(() => {
        loadProjects();
    }, []);

    // ========================================================
    // LOAD MANAGER PROJECTS
    // ========================================================

    const loadProjects = async () => {
        try {
            setLoadingProjects(true);
            setError("");
            setSuccessMessage("");

            const result = await getManagerProjects();

            const projectList = Array.isArray(result)
                ? result
                : result?.projects ||
                  result?.data ||
                  result?.items ||
                  [];

            const validProjects = Array.isArray(projectList)
                ? projectList
                : [];

            setProjects(validProjects);
        } catch (err) {
            console.error(
                "Mention Team Leader project loading error:",
                err
            );

            setProjects([]);

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
        if (!project) {
            return null;
        }

        return (
            project.id ??
            project.projectId ??
            project.projectID
        );
    };

    const getProjectName = (project) => {
        if (!project) {
            return "Unnamed Project";
        }

        return (
            project.name ||
            project.title ||
            project.projectName ||
            "Unnamed Project"
        );
    };

    const getTeamId = (team) => {
        if (!team) {
            return null;
        }

        return (
            team.id ??
            team.teamId ??
            team.teamID
        );
    };

    const getTeamName = (team) => {
        if (!team) {
            return "Unnamed Team";
        }

        return (
            team.name ||
            team.teamName ||
            team.title ||
            "Unnamed Team"
        );
    };

    const getUserId = (user) => {
        if (!user) {
            return null;
        }

        return (
            user.id ??
            user.userId ??
            user.userID
        );
    };

    const getUserName = (user) => {
        if (!user) {
            return "Unknown User";
        }

        return (
            user.fullName ||
            user.name ||
            user.userName ||
            user.username ||
            "Unknown User"
        );
    };

    const getUserEmail = (user) => {
        if (!user) {
            return "";
        }

        return (
            user.email ||
            user.userEmail ||
            ""
        );
    };

    // ========================================================
    // HANDLE PROJECT CHANGE
    // ========================================================

    const handleProjectChange = async (event) => {
        const projectId = event.target.value;

        setSelectedProjectId(projectId);

        setSelectedTeamId("");
        setSelectedTeam(null);
        setTeamLeader(null);

        setError("");
        setSuccessMessage("");

        if (!projectId) {
            setSelectedProject(null);
            setTeams([]);
            return;
        }

        const project =
            projects.find(
                (item) =>
                    String(getProjectId(item)) ===
                    String(projectId)
            ) || null;

        setSelectedProject(project);

        await loadTeams(projectId);
    };

    // ========================================================
    // LOAD PROJECT TEAMS
    // ========================================================

    const loadTeams = async (projectId) => {
        try {
            setLoadingTeams(true);
            setError("");

            const result =
                await getProjectTeams(projectId);

            const teamList = Array.isArray(result)
                ? result
                : result?.teams ||
                  result?.data ||
                  result?.items ||
                  [];

            const validTeams = Array.isArray(teamList)
                ? teamList
                : [];

            setTeams(validTeams);

            // Automatically select the only team
            if (validTeams.length === 1) {
                const firstTeam = validTeams[0];
                const firstTeamId =
                    getTeamId(firstTeam);

                if (firstTeamId !== null) {
                    setSelectedTeamId(
                        String(firstTeamId)
                    );

                    setSelectedTeam(firstTeam);

                    await loadTeamLeader(
                        firstTeamId
                    );
                }
            }
        } catch (err) {
            console.error(
                "Mention Team Leader team loading error:",
                err
            );

            setTeams([]);

            setError(
                err?.message ||
                    "Unable to load teams for the selected project."
            );
        } finally {
            setLoadingTeams(false);
        }
    };

    // ========================================================
    // HANDLE TEAM CHANGE
    // ========================================================

    const handleTeamChange = async (event) => {
        const teamId = event.target.value;

        setSelectedTeamId(teamId);
        setTeamLeader(null);

        setError("");
        setSuccessMessage("");

        if (!teamId) {
            setSelectedTeam(null);
            return;
        }

        const team =
            teams.find(
                (item) =>
                    String(getTeamId(item)) ===
                    String(teamId)
            ) || null;

        setSelectedTeam(team);

        if (!team) {
            setError(
                "Selected team could not be found."
            );
            return;
        }

        await loadTeamLeader(teamId);
    };

    // ========================================================
    // LOAD CURRENT TEAM LEADER
    // ========================================================

    const loadTeamLeader = async (teamId) => {
        try {
            setLoadingLeader(true);
            setError("");

            const result =
                await getTeamLeader(teamId);

            const leader =
                result?.teamLeader ||
                result?.leader ||
                result?.user ||
                result?.data?.teamLeader ||
                result?.data?.leader ||
                result?.data ||
                result ||
                null;

            if (!leader) {
                setTeamLeader(null);

                setError(
                    "No Team Leader is currently assigned to this Team."
                );

                return;
            }

            const leaderId =
                getUserId(leader);

            const inactive =
                leader.active === false ||
                leader.isActive === false ||
                String(
                    leader.status || ""
                ).toLowerCase() === "inactive";

            if (!leaderId || inactive) {
                setTeamLeader(null);

                setError(
                    "No active Team Leader is currently assigned to this Team."
                );

                return;
            }

            setTeamLeader(leader);
        } catch (err) {
            console.error(
                "Team Leader loading error:",
                err
            );

            setTeamLeader(null);

            if (
                err?.message
                    ?.toLowerCase()
                    .includes("not assigned")
            ) {
                setError(
                    "No Team Leader is currently assigned to this Team."
                );
            } else {
                setError(
                    err?.message ||
                        "Unable to retrieve the current Team Leader."
                );
            }
        } finally {
            setLoadingLeader(false);
        }
    };

    // ========================================================
    // TEAM LEADER AVAILABLE
    // ========================================================

    const leaderAvailable = useMemo(() => {
        if (!teamLeader) {
            return false;
        }

        const id = getUserId(teamLeader);

        const inactive =
            teamLeader.active === false ||
            teamLeader.isActive === false ||
            String(
                teamLeader.status || ""
            ).toLowerCase() === "inactive";

        return Boolean(id && !inactive);
    }, [teamLeader]);

    // ========================================================
    // MESSAGE CHARACTER COUNT
    // ========================================================

    const messageLength =
        message.trim().length;

    // ========================================================
    // VALIDATE FORM
    // ========================================================

    const validateForm = () => {
        if (!selectedProjectId) {
            setError(
                "Please select an authorized project."
            );

            return false;
        }

        if (!selectedTeamId) {
            setError(
                "Please select a team."
            );

            return false;
        }

        if (!leaderAvailable) {
            setError(
                "No Team Leader is currently assigned to this Team."
            );

            return false;
        }

        if (!message.trim()) {
            setError(
                "Please enter a message before mentioning the Team Leader."
            );

            return false;
        }

        if (messageLength < 2) {
            setError(
                "Message must contain at least 2 characters."
            );

            return false;
        }

        return true;
    };

    // ========================================================
    // SEND MENTION
    // ========================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccessMessage("");

        if (!validateForm()) {
            return;
        }

        try {
            setSending(true);

            // ----------------------------------------------
            // Re-check current Team Leader before sending
            // ----------------------------------------------

            const latestLeaderResult =
                await getTeamLeader(
                    selectedTeamId
                );

            const latestLeader =
                latestLeaderResult?.teamLeader ||
                latestLeaderResult?.leader ||
                latestLeaderResult?.user ||
                latestLeaderResult?.data?.teamLeader ||
                latestLeaderResult?.data?.leader ||
                latestLeaderResult?.data ||
                latestLeaderResult ||
                null;

            const latestLeaderId =
                getUserId(latestLeader);

            const latestLeaderInactive =
                latestLeader?.active === false ||
                latestLeader?.isActive === false ||
                String(
                    latestLeader?.status || ""
                ).toLowerCase() === "inactive";

            if (
                !latestLeader ||
                !latestLeaderId ||
                latestLeaderInactive
            ) {
                setTeamLeader(null);

                setError(
                    "The Team Leader is no longer assigned to this Team. Please refresh and try again."
                );

                return;
            }

            // ----------------------------------------------
            // Send mention
            // ----------------------------------------------

            await mentionTeamLeader({
                projectId: selectedProjectId,
                teamId: selectedTeamId,
                teamLeaderId: latestLeaderId,
                message: message.trim(),
            });

            setSuccessMessage(
                `Your message was sent and ${getUserName(
                    latestLeader
                )} was mentioned successfully.`
            );

            setMessage("");
            setTeamLeader(latestLeader);
        } catch (err) {
            console.error(
                "Mention Team Leader error:",
                err
            );

            setError(
                err?.message ||
                    "Unable to mention the Team Leader. Please try again."
            );
        } finally {
            setSending(false);
        }
    };

    // ========================================================
    // RESET
    // ========================================================

    const handleReset = () => {
        setSelectedProjectId("");
        setSelectedTeamId("");

        setSelectedProject(null);
        setSelectedTeam(null);

        setTeamLeader(null);

        setTeams([]);

        setMessage("");

        setError("");
        setSuccessMessage("");
    };

    // ========================================================
    // REFRESH
    // ========================================================

    const handleRefresh = async () => {
        setError("");
        setSuccessMessage("");

        if (selectedTeamId) {
            await loadTeamLeader(
                selectedTeamId
            );
            return;
        }

        if (selectedProjectId) {
            await loadTeams(
                selectedProjectId
            );
            return;
        }

        await loadProjects();
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="w-full space-y-6 text-foreground">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-foreground text-background">
                            <AtSign className="h-5 w-5" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight">
                                Mention Team Leader
                            </h1>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Mention the current Team Leader in an authorized project communication.
                            </p>
                        </div>

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
                        sending
                    }
                    className="gap-2 border-input bg-background text-foreground hover:bg-muted"
                >
                    <RefreshCw
                        className={`h-4 w-4 ${
                            loadingProjects ||
                            loadingTeams ||
                            loadingLeader
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

            {successMessage && (
                <div className="flex items-start gap-3 rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-700 dark:text-green-400">

                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

                    <span>{successMessage}</span>

                </div>
            )}

            {/* ==================================================
                PROJECT & TEAM
            ================================================== */}

            <div className="rounded-lg border border-border bg-card">

                <div className="border-b border-border p-5">

                    <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted text-foreground">
                            <FileText className="h-4 w-4" />
                        </div>

                        <div>
                            <h2 className="text-base font-semibold">
                                Communication Context
                            </h2>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Select an authorized project and its current Team.
                            </p>
                        </div>

                    </div>

                </div>

                <div className="grid gap-5 p-5 md:grid-cols-2">

                    {/* PROJECT */}

                    <div>
                        <label
                            htmlFor="mention-project"
                            className="mb-2 block text-sm font-medium text-foreground"
                        >
                            Project
                        </label>

                        <select
                            id="mention-project"
                            value={selectedProjectId}
                            onChange={handleProjectChange}
                            disabled={
                                loadingProjects ||
                                sending
                            }
                            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="">
                                {loadingProjects
                                    ? "Loading assigned projects..."
                                    : projects.length === 0
                                    ? "No assigned projects"
                                    : "Select project"}
                            </option>

                            {projects.map(
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
                            htmlFor="mention-team"
                            className="mb-2 block text-sm font-medium text-foreground"
                        >
                            Team
                        </label>

                        <select
                            id="mention-team"
                            value={selectedTeamId}
                            onChange={handleTeamChange}
                            disabled={
                                !selectedProjectId ||
                                loadingTeams ||
                                sending
                            }
                            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="">
                                {!selectedProjectId
                                    ? "Select a project first"
                                    : loadingTeams
                                    ? "Loading teams..."
                                    : teams.length === 0
                                    ? "No teams available"
                                    : "Select team"}
                            </option>

                            {teams.map(
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
                TEAM LEADER
            ================================================== */}

            {selectedTeamId && (
                <div className="rounded-lg border border-border bg-card">

                    <div className="flex items-center justify-between border-b border-border p-5">

                        <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted text-foreground">
                                <User className="h-4 w-4" />
                            </div>

                            <div>
                                <h2 className="text-base font-semibold">
                                    Team Leader
                                </h2>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Current Team Leader for the selected Team.
                                </p>
                            </div>

                        </div>

                        {loadingLeader && (
                            <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
                        )}

                    </div>

                    <div className="p-5">

                        {loadingLeader ? (
                            <div className="flex items-center gap-3 rounded-md border border-border bg-muted p-4">

                                <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />

                                <span className="text-sm text-muted-foreground">
                                    Checking the current Team Leader...
                                </span>

                            </div>
                        ) : leaderAvailable ? (
                            <div className="flex flex-col gap-4 rounded-md border border-border bg-muted p-4 sm:flex-row sm:items-center sm:justify-between">

                                <div className="flex items-center gap-3">

                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background text-foreground">
                                        <User className="h-5 w-5" />
                                    </div>

                                    <div>
                                        <p className="font-medium text-foreground">
                                            {getUserName(
                                                teamLeader
                                            )}
                                        </p>

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

                                <span className="inline-flex w-fit items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground">

                                    <CheckCircle2 className="h-3.5 w-3.5" />

                                    Current Team Leader

                                </span>

                            </div>
                        ) : (
                            <div className="flex items-start gap-3 rounded-md border border-border bg-muted p-4">

                                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />

                                <div>
                                    <p className="font-medium text-foreground">
                                        No Team Leader is currently assigned.
                                    </p>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Select another Team or refresh the current Team assignment.
                                    </p>
                                </div>

                            </div>
                        )}

                    </div>

                </div>
            )}

            {/* ==================================================
                MENTION FORM
            ================================================== */}

            <div className="rounded-lg border border-border bg-card">

                <div className="border-b border-border p-5">

                    <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted text-foreground">
                            <MessageSquare className="h-4 w-4" />
                        </div>

                        <div>
                            <h2 className="text-base font-semibold">
                                Mention Message
                            </h2>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Write the message that will mention the current Team Leader.
                            </p>
                        </div>

                    </div>

                </div>

                <div className="p-5">

                    <textarea
                        value={message}
                        onChange={(event) => {
                            setMessage(
                                event.target.value
                            );

                            setError("");
                            setSuccessMessage("");
                        }}
                        disabled={
                            !leaderAvailable ||
                            sending
                        }
                        maxLength={2000}
                        rows={7}
                        placeholder={
                            leaderAvailable
                                ? `Write a message for ${getUserName(
                                      teamLeader
                                  )}...`
                                : "Select a project and Team with an assigned Team Leader first."
                        }
                        className="w-full resize-none rounded-md border border-input bg-background px-3 py-3 text-sm leading-6 text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    />

                    <div className="mt-2 flex items-center justify-between">

                        <p className="text-xs text-muted-foreground">
                            The current Team Leader will be mentioned automatically.
                        </p>

                        <span
                            className={`text-xs font-medium ${
                                messageLength >= 2000
                                    ? "text-destructive"
                                    : "text-muted-foreground"
                            }`}
                        >
                            {messageLength}/2000
                        </span>

                    </div>

                    {/* ==================================================
                        MENTION PREVIEW
                    ================================================== */}

                    {leaderAvailable &&
                        message.trim() && (
                            <div className="mt-5 rounded-md border border-border bg-muted p-4">

                                <div className="flex items-start gap-3">

                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-background text-foreground">
                                        <AtSign className="h-4 w-4" />
                                    </div>

                                    <div className="min-w-0">

                                        <p className="text-sm font-semibold text-foreground">
                                            Mention Preview
                                        </p>

                                        <p className="mt-2 text-sm leading-6 text-muted-foreground">

                                            <span className="font-semibold text-foreground">
                                                @{getUserName(
                                                    teamLeader
                                                )}
                                            </span>

                                            {": "}

                                            {message.trim()}

                                        </p>

                                    </div>

                                </div>

                            </div>
                        )}

                    {/* ==================================================
                        ACTIONS
                    ================================================== */}

                    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleReset}
                            disabled={sending}
                            className="gap-2 border-input bg-background text-foreground hover:bg-muted"
                        >
                            <X className="h-4 w-4" />
                            Reset
                        </Button>

                        <Button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={
                                sending ||
                                loadingProjects ||
                                loadingTeams ||
                                loadingLeader ||
                                !leaderAvailable ||
                                !message.trim()
                            }
                            className="gap-2 bg-foreground text-background hover:bg-foreground/90"
                        >
                            {sending ? (
                                <>
                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send className="h-4 w-4" />
                                    Mention Team Leader
                                </>
                            )}
                        </Button>

                    </div>

                </div>

            </div>

            {/* ==================================================
                COMMUNICATION SCOPE
            ================================================== */}

            <div className="flex items-start gap-3 rounded-lg border border-border bg-muted p-4">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-background text-foreground">
                    <Activity className="h-4 w-4" />
                </div>

                <div>

                    <p className="text-sm font-medium text-foreground">
                        Communication scope
                    </p>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        Only projects and Teams authorized for the
                        authenticated Manager are available. The current
                        Team Leader is resolved from the Team relationship
                        before the mention is sent.
                    </p>

                </div>

            </div>

        </div>
    );
}

export default MentionTeamLeader;