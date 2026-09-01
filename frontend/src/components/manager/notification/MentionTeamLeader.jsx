
import React, { useEffect, useMemo, useState } from "react";

import {
    AtSign,
    AlertCircle,
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
// COMM-003 — MENTION TEAM LEADER
// ============================================================
//
// Primary Actor:
// Project Manager
//
// Goal:
// Allow the Manager to mention the Team Leader in a project,
// sprint, or communication activity.
//
// IMPORTANT:
// - Project IDs are retrieved dynamically.
// - Team IDs are retrieved dynamically.
// - Team Leader is retrieved from the current Team relationship.
// - No hard-coded Team Leader ID.
// - Inactive/removed Team Leaders cannot be mentioned.
// - Mention creates a notification through the service.
// - Mention does not modify project/task information.
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

    const [loadingProjects, setLoadingProjects] = useState(true);
    const [loadingTeams, setLoadingTeams] = useState(false);
    const [loadingLeader, setLoadingLeader] = useState(false);
    const [sending, setSending] = useState(false);

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // ========================================================
    // LOAD PROJECTS
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
                  [];

            setProjects(projectList);
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
    // GET PROJECT ID
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

    // ========================================================
    // GET PROJECT NAME
    // ========================================================

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

    // ========================================================
    // GET TEAM ID
    // ========================================================

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

    // ========================================================
    // GET TEAM NAME
    // ========================================================

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

    // ========================================================
    // GET USER ID
    // ========================================================

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

    // ========================================================
    // GET USER NAME
    // ========================================================

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

    // ========================================================
    // GET USER EMAIL
    // ========================================================

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

        const project = projects.find(
            (item) =>
                String(getProjectId(item)) ===
                String(projectId)
        );

        setSelectedProject(project || null);

        await loadTeams(projectId);
    };

    // ========================================================
    // LOAD PROJECT TEAMS
    // ========================================================

    const loadTeams = async (projectId) => {
        try {
            setLoadingTeams(true);
            setError("");

            const result = await getProjectTeams(projectId);

            const teamList = Array.isArray(result)
                ? result
                : result?.teams ||
                  result?.data ||
                  [];

            setTeams(teamList);
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

        const team = teams.find(
            (item) =>
                String(getTeamId(item)) ===
                String(teamId)
        );

        setSelectedTeam(team || null);

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

            const result = await getTeamLeader(teamId);

            const leader =
                result?.teamLeader ||
                result?.leader ||
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

            // ----------------------------------------------
            // Validate current Team Leader
            // ----------------------------------------------

            const leaderId = getUserId(leader);

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

    const messageLength = message.trim().length;

    // ========================================================
    // VALIDATE MESSAGE
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

            // ------------------------------------------------
            // Re-resolve Team Leader immediately before sending.
            // ------------------------------------------------

            const latestLeaderResult =
                await getTeamLeader(
                    selectedTeamId
                );

            const latestLeader =
                latestLeaderResult?.teamLeader ||
                latestLeaderResult?.leader ||
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

            // ------------------------------------------------
            // Send mention through backend/service.
            // ------------------------------------------------

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
    // RESET FORM
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
    // REFRESH CURRENT TEAM LEADER
    // ========================================================

    const handleRefreshLeader = async () => {
        if (!selectedTeamId) {
            return;
        }

        setError("");
        setSuccessMessage("");

        await loadTeamLeader(selectedTeamId);
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="min-h-full bg-white p-4 md:p-6">
            <div className="mx-auto max-w-4xl">

                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-center gap-4">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white shadow-sm">
                            <AtSign className="h-6 w-6" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                Mention Team Leader
                            </h1>

                            <p className="mt-1 text-sm text-slate-500">
                                Mention the current Team Leader in a project communication.
                            </p>
                        </div>

                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleRefreshLeader}
                        disabled={
                            !selectedTeamId ||
                            loadingLeader ||
                            sending
                        }
                        className="gap-2 border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                    >
                        <RefreshCw
                            className={`h-4 w-4 ${
                                loadingLeader
                                    ? "animate-spin"
                                    : ""
                            }`}
                        />

                        Refresh
                    </Button>

                </div>

                {/* ==================================================
                    MAIN SHEET
                ================================================== */}

                <form
                    onSubmit={handleSubmit}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >

                    {/* ==================================================
                        COMMUNICATION CONTEXT
                    ================================================== */}

                    <div className="border-b border-slate-200 p-6">

                        <div className="mb-5">
                            <div className="flex items-center gap-2">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                                    <FileText className="h-5 w-5" />
                                </div>

                                <h2 className="text-lg font-bold text-slate-900">
                                    Communication Context
                                </h2>
                            </div>

                            <p className="mt-2 text-sm text-slate-500">
                                Select an authorized project and its current Team.
                            </p>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">

                            {/* PROJECT */}

                            <div>
                                <label
                                    htmlFor="mention-project"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Project
                                    <span className="ml-1 text-red-500">
                                        *
                                    </span>
                                </label>

                                <div className="relative">
                                    <FileText className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-500" />

                                    <select
                                        id="mention-project"
                                        value={selectedProjectId}
                                        onChange={
                                            handleProjectChange
                                        }
                                        disabled={
                                            loadingProjects ||
                                            sending
                                        }
                                        className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-70"
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
                            </div>

                            {/* TEAM */}

                            <div>
                                <label
                                    htmlFor="mention-team"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Team
                                    <span className="ml-1 text-red-500">
                                        *
                                    </span>
                                </label>

                                <div className="relative">
                                    <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-500" />

                                    <select
                                        id="mention-team"
                                        value={selectedTeamId}
                                        onChange={
                                            handleTeamChange
                                        }
                                        disabled={
                                            !selectedProjectId ||
                                            loadingTeams ||
                                            sending
                                        }
                                        className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-70"
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

                    </div>

                    {/* ==================================================
                        TEAM LEADER
                    ================================================== */}

                    <div className="border-b border-slate-200 p-6">

                        <div className="mb-4 flex items-center justify-between">

                            <div>
                                <div className="flex items-center gap-2">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                                        <User className="h-5 w-5" />
                                    </div>

                                    <h2 className="text-lg font-bold text-slate-900">
                                        Team Leader
                                    </h2>
                                </div>

                                <p className="mt-2 text-sm text-slate-500">
                                    The Team Leader is resolved from the current Team assignment.
                                </p>
                            </div>

                            {loadingLeader && (
                                <RefreshCw className="h-5 w-5 animate-spin text-emerald-600" />
                            )}

                        </div>

                        {loadingLeader ? (
                            <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
                                <div className="flex items-center gap-3">
                                    <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />

                                    <p className="text-sm text-blue-700">
                                        Checking the current Team Leader...
                                    </p>
                                </div>
                            </div>
                        ) : leaderAvailable ? (
                            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">

                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm">
                                        <User className="h-6 w-6" />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="font-semibold text-slate-900">
                                            {getUserName(
                                                teamLeader
                                            )}
                                        </p>

                                        {getUserEmail(
                                            teamLeader
                                        ) && (
                                            <p className="mt-1 text-sm text-slate-600">
                                                {getUserEmail(
                                                    teamLeader
                                                )}
                                            </p>
                                        )}
                                    </div>

                                    <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        Current Team Leader
                                    </span>

                                </div>

                            </div>
                        ) : (
                            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">

                                <div className="flex items-start gap-3">

                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                                        <AlertCircle className="h-5 w-5" />
                                    </div>

                                    <div>
                                        <p className="font-semibold text-amber-800">
                                            No Team Leader is currently assigned to this Team.
                                        </p>

                                        <p className="mt-1 text-sm text-amber-700">
                                            Select another Team or refresh the current Team assignment.
                                        </p>
                                    </div>

                                </div>

                            </div>
                        )}

                    </div>

                    {/* ==================================================
                        MESSAGE
                    ================================================== */}

                    <div className="p-6">

                        <div className="mb-4">
                            <div className="flex items-center gap-2">

                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                                    <MessageSquare className="h-5 w-5" />
                                </div>

                                <h2 className="text-lg font-bold text-slate-900">
                                    Message
                                </h2>

                            </div>

                            <p className="mt-2 text-sm text-slate-500">
                                Write the message that will include the Team Leader mention.
                            </p>
                        </div>

                        <div className="relative">

                            <MessageSquare className="pointer-events-none absolute left-4 top-4 h-5 w-5 text-purple-400" />

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
                                className="w-full resize-none rounded-xl border border-slate-300 bg-white py-3 pl-12 pr-4 text-sm leading-6 text-slate-900 outline-none placeholder:text-slate-400 transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-70"
                            />

                        </div>

                        <div className="mt-2 flex items-center justify-between">

                            <p className="text-xs text-slate-400">
                                The current Team Leader will be mentioned automatically.
                            </p>

                            <span
                                className={`text-xs font-medium ${
                                    messageLength >= 2000
                                        ? "text-red-500"
                                        : "text-slate-400"
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
                                <div className="mt-5 rounded-xl border border-purple-200 bg-purple-50 p-4">

                                    <div className="flex items-start gap-3">

                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                                            <AtSign className="h-5 w-5" />
                                        </div>

                                        <div className="min-w-0">

                                            <p className="text-sm font-semibold text-purple-800">
                                                Mention Preview
                                            </p>

                                            <p className="mt-2 text-sm leading-6 text-purple-700">
                                                <span className="font-semibold">
                                                    @
                                                    {getUserName(
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
                            ERROR
                        ================================================== */}

                        {error && (
                            <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">

                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
                                    <AlertCircle className="h-5 w-5" />
                                </div>

                                <p className="pt-1">
                                    {error}
                                </p>

                            </div>
                        )}

                        {/* ==================================================
                            SUCCESS
                        ================================================== */}

                        {successMessage && (
                            <div className="mt-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">

                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                                    <CheckCircle2 className="h-5 w-5" />
                                </div>

                                <p className="pt-1">
                                    {successMessage}
                                </p>

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
                                className="gap-2 border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                            >
                                <X className="h-4 w-4" />
                                Reset
                            </Button>

                            <Button
                                type="submit"
                                disabled={
                                    sending ||
                                    loadingProjects ||
                                    loadingTeams ||
                                    loadingLeader ||
                                    !leaderAvailable ||
                                    !message.trim()
                                }
                                className="gap-2 bg-purple-600 text-white hover:bg-purple-700"
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

                </form>

                {/* ==================================================
                    SECURITY / COMMUNICATION SCOPE
                ================================================== */}

                <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4">

                    <div className="flex items-start gap-3">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                            <AlertCircle className="h-5 w-5" />
                        </div>

                        <div>

                            <p className="text-sm font-semibold text-blue-800">
                                Communication scope
                            </p>

                            <p className="mt-1 text-xs leading-5 text-blue-700">
                                Only projects and Teams authorized for the authenticated Manager are available. The Team Leader is resolved from the current Team relationship immediately before the mention is sent.
                            </p>

                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}

export default MentionTeamLeader;

