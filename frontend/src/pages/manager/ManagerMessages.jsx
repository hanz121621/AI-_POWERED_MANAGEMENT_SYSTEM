import React, { useEffect, useMemo, useState } from "react";
import {
    MessageCircle,
    Send,
    UserRound,
    FolderKanban,
    UsersRound,
    CheckCircle2,
    AlertCircle,
    Clock3,
    Search,
} from "lucide-react";

import {
    getCurrentManager,
    getManagerProjects,
    getProjectTeamLeaders,
    getConversation,
    sendManagerMessage,
} from "@/services/managerMessageService";

function ManagerMessages() {
    const [currentManager, setCurrentManager] = useState(null);

    const [projects, setProjects] = useState([]);
    const [teamLeaders, setTeamLeaders] = useState([]);

    const [selectedProjectId, setSelectedProjectId] = useState("");
    const [selectedTeamLeaderId, setSelectedTeamLeaderId] =
        useState("");

    const [message, setMessage] = useState("");
    const [conversation, setConversation] = useState([]);

    const [loading, setLoading] = useState(true);
    const [loadingLeaders, setLoadingLeaders] = useState(false);
    const [sending, setSending] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const selectedProject = useMemo(() => {
        return projects.find(
            (project) =>
                String(project.id) ===
                String(selectedProjectId)
        );
    }, [projects, selectedProjectId]);

    const selectedLeader = useMemo(() => {
        return teamLeaders.find(
            (leader) =>
                String(leader.id) ===
                String(selectedTeamLeaderId)
        );
    }, [teamLeaders, selectedTeamLeaderId]);

    /* ============================================================
       LOAD CURRENT MANAGER + PROJECTS
    ============================================================ */

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = () => {
        try {
            setLoading(true);
            setError("");

            const manager = getCurrentManager();

            if (!manager) {
                setError(
                    "Manager authentication information could not be found."
                );
                return;
            }

            setCurrentManager(manager);

            const managerProjects =
                getManagerProjects(manager);

            setProjects(managerProjects);

            if (managerProjects.length === 0) {
                setSelectedProjectId("");
                setTeamLeaders([]);
                return;
            }

            const firstProject = managerProjects[0];

            setSelectedProjectId(
                String(firstProject.id)
            );
        } catch (err) {
            console.error(
                "Unable to load manager messages:",
                err
            );

            setError(
                err?.message ||
                    "Unable to load messaging information."
            );
        } finally {
            setLoading(false);
        }
    };

    /* ============================================================
       PROJECT CHANGE
    ============================================================ */

    useEffect(() => {
        if (!selectedProjectId) {
            setTeamLeaders([]);
            setSelectedTeamLeaderId("");
            setConversation([]);
            return;
        }

        loadTeamLeaders(selectedProjectId);
    }, [selectedProjectId]);

    const loadTeamLeaders = (projectId) => {
        try {
            setLoadingLeaders(true);
            setError("");
            setSuccess("");

            const leaders =
                getProjectTeamLeaders(projectId);

            setTeamLeaders(leaders);

            if (leaders.length > 0) {
                setSelectedTeamLeaderId(
                    String(leaders[0].id)
                );
            } else {
                setSelectedTeamLeaderId("");
                setConversation([]);
            }
        } catch (err) {
            console.error(
                "Unable to load Team Leaders:",
                err
            );

            setTeamLeaders([]);

            setError(
                err?.message ||
                    "Unable to load Team Leaders."
            );
        } finally {
            setLoadingLeaders(false);
        }
    };

    /* ============================================================
       LOAD CONVERSATION
    ============================================================ */

    useEffect(() => {
        if (
            !currentManager ||
            !selectedProjectId ||
            !selectedTeamLeaderId
        ) {
            setConversation([]);
            return;
        }

        const messages = getConversation({
            managerId: currentManager.id,
            teamLeaderId: selectedTeamLeaderId,
            projectId: selectedProjectId,
        });

        setConversation(messages);
    }, [
        currentManager,
        selectedProjectId,
        selectedTeamLeaderId,
    ]);

    /* ============================================================
       SEND MESSAGE
    ============================================================ */

    const handleSendMessage = (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!currentManager) {
            setError(
                "Manager authentication information could not be found."
            );
            return;
        }

        if (!selectedProject) {
            setError(
                "Please select a project."
            );
            return;
        }

        if (!selectedLeader) {
            setError(
                "No Team Leader is currently assigned to this Team."
            );
            return;
        }

        if (!message.trim()) {
            setError(
                "Please enter a message before sending."
            );
            return;
        }

        try {
            setSending(true);

            const savedMessage =
                sendManagerMessage({
                    manager: currentManager,
                    project: selectedProject,
                    teamLeader: selectedLeader,
                    message: message.trim(),
                });

            setConversation((previous) => [
                ...previous,
                savedMessage,
            ]);

            setMessage("");

            setSuccess(
                "Message sent successfully. The Team Leader has been notified."
            );

            window.setTimeout(() => {
                setSuccess("");
            }, 4000);
        } catch (err) {
            console.error(
                "Unable to send manager message:",
                err
            );

            setError(
                err?.message ||
                    "Unable to send message. Please try again."
            );
        } finally {
            setSending(false);
        }
    };

    /* ============================================================
       HELPERS
    ============================================================ */

    const getProjectName = (project) => {
        return (
            project?.name ||
            project?.projectName ||
            project?.title ||
            "Unnamed Project"
        );
    };

    const getLeaderName = (leader) => {
        return (
            leader?.fullName ||
            leader?.name ||
            leader?.userName ||
            leader?.email ||
            "Team Leader"
        );
    };

    const getLeaderEmail = (leader) => {
        return (
            leader?.email ||
            leader?.userEmail ||
            ""
        );
    };

    const formatDate = (date) => {
        if (!date) {
            return "";
        }

        const parsed = new Date(date);

        if (Number.isNaN(parsed.getTime())) {
            return "";
        }

        return parsed.toLocaleString();
    };

    /* ============================================================
       LOADING
    ============================================================ */

    if (loading) {
        return (
            <div className="min-h-full bg-slate-50 p-8">
                <div className="mx-auto max-w-7xl">
                    <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                        <Clock3
                            className="mx-auto mb-4 text-blue-600"
                            size={36}
                        />

                        <p className="text-slate-600">
                            Loading messages...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full bg-slate-50 p-6 md:p-8">
            <div className="mx-auto max-w-7xl">

                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="mb-8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                            <MessageCircle size={26} />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">
                                Messages
                            </h1>

                            <p className="mt-1 text-sm text-slate-500">
                                Communicate directly with Team Leaders assigned to your projects.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ==================================================
                    ERROR
                ================================================== */}

                {error && (
                    <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
                        <AlertCircle
                            size={20}
                            className="mt-0.5 shrink-0"
                        />

                        <div>
                            <p className="font-semibold">
                                Unable to continue
                            </p>

                            <p className="mt-1 text-sm">
                                {error}
                            </p>
                        </div>
                    </div>
                )}

                {/* ==================================================
                    SUCCESS
                ================================================== */}

                {success && (
                    <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700">
                        <CheckCircle2
                            size={20}
                            className="mt-0.5 shrink-0"
                        />

                        <p className="text-sm font-medium">
                            {success}
                        </p>
                    </div>
                )}

                {/* ==================================================
                    NO PROJECTS
                ================================================== */}

                {projects.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                        <FolderKanban
                            size={44}
                            className="mx-auto mb-4 text-slate-400"
                        />

                        <h2 className="text-lg font-semibold text-slate-800">
                            No projects available
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                            You currently have no projects assigned to your Manager account.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6 lg:grid-cols-3">

                        {/* ==================================================
                            LEFT SIDE
                        ================================================== */}

                        <div className="space-y-6">

                            {/* PROJECT */}

                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                                        <FolderKanban size={20} />
                                    </div>

                                    <div>
                                        <h2 className="font-semibold text-slate-900">
                                            Select Project
                                        </h2>

                                        <p className="text-xs text-slate-500">
                                            Choose an assigned project
                                        </p>
                                    </div>
                                </div>

                                <select
                                    value={selectedProjectId}
                                    onChange={(event) =>
                                        setSelectedProjectId(
                                            event.target.value
                                        )
                                    }
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                >
                                    <option value="">
                                        Select a project
                                    </option>

                                    {projects.map((project) => (
                                        <option
                                            key={project.id}
                                            value={String(
                                                project.id
                                            )}
                                        >
                                            {getProjectName(
                                                project
                                            )}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* TEAM LEADER */}

                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                                        <UsersRound size={20} />
                                    </div>

                                    <div>
                                        <h2 className="font-semibold text-slate-900">
                                            Team Leader
                                        </h2>

                                        <p className="text-xs text-slate-500">
                                            Select the Team Leader
                                        </p>
                                    </div>
                                </div>

                                {loadingLeaders ? (
                                    <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                                        Loading Team Leaders...
                                    </div>
                                ) : teamLeaders.length === 0 ? (
                                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                                        <p className="text-sm font-medium text-amber-800">
                                            No Team Leader is currently assigned to this Team.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {teamLeaders.map(
                                            (leader) => {
                                                const selected =
                                                    String(
                                                        leader.id
                                                    ) ===
                                                    String(
                                                        selectedTeamLeaderId
                                                    );

                                                return (
                                                    <button
                                                        type="button"
                                                        key={
                                                            leader.id
                                                        }
                                                        onClick={() =>
                                                            setSelectedTeamLeaderId(
                                                                String(
                                                                    leader.id
                                                                )
                                                            )
                                                        }
                                                        className={`w-full rounded-xl border p-4 text-left transition ${
                                                            selected
                                                                ? "border-blue-500 bg-blue-50"
                                                                : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50"
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
                                                                {getLeaderName(
                                                                    leader
                                                                )
                                                                    .charAt(
                                                                        0
                                                                    )
                                                                    .toUpperCase()}
                                                            </div>

                                                            <div className="min-w-0">
                                                                <p className="truncate font-semibold text-slate-800">
                                                                    {getLeaderName(
                                                                        leader
                                                                    )}
                                                                </p>

                                                                {getLeaderEmail(
                                                                    leader
                                                                ) && (
                                                                    <p className="truncate text-xs text-slate-500">
                                                                        {getLeaderEmail(
                                                                            leader
                                                                        )}
                                                                    </p>
                                                                )}
                                                            </div>
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
                            RIGHT SIDE — CONVERSATION
                        ================================================== */}

                        <div className="lg:col-span-2">
                            <div className="flex min-h-[650px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                                {/* Conversation header */}

                                <div className="border-b border-slate-200 p-5">
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <h2 className="font-bold text-slate-900">
                                                {selectedLeader
                                                    ? getLeaderName(
                                                          selectedLeader
                                                      )
                                                    : "No Team Leader selected"}
                                            </h2>

                                            <p className="mt-1 text-xs text-slate-500">
                                                {selectedProject
                                                    ? getProjectName(
                                                          selectedProject
                                                      )
                                                    : "Select a project"}
                                            </p>
                                        </div>

                                        <MessageCircle
                                            className="text-blue-600"
                                            size={24}
                                        />
                                    </div>
                                </div>

                                {/* Messages */}

                                <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-5">
                                    {conversation.length ===
                                    0 ? (
                                        <div className="flex h-full min-h-[400px] items-center justify-center">
                                            <div className="text-center">
                                                <Search
                                                    size={42}
                                                    className="mx-auto mb-4 text-slate-300"
                                                />

                                                <p className="font-medium text-slate-600">
                                                    No messages yet
                                                </p>

                                                <p className="mt-1 text-sm text-slate-400">
                                                    Start the conversation with the Team Leader.
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        conversation.map(
                                            (item) => {
                                                const fromManager =
                                                    String(
                                                        item.senderId
                                                    ) ===
                                                    String(
                                                        currentManager?.id
                                                    );

                                                return (
                                                    <div
                                                        key={
                                                            item.id
                                                        }
                                                        className={`flex ${
                                                            fromManager
                                                                ? "justify-end"
                                                                : "justify-start"
                                                        }`}
                                                    >
                                                        <div
                                                            className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                                                                fromManager
                                                                    ? "bg-blue-600 text-white"
                                                                    : "border border-slate-200 bg-white text-slate-800"
                                                            }`}
                                                        >
                                                            <div className="mb-1 flex items-center gap-2">
                                                                <UserRound
                                                                    size={
                                                                        14
                                                                    }
                                                                />

                                                                <span className="text-xs font-semibold">
                                                                    {fromManager
                                                                        ? "You"
                                                                        : getLeaderName(
                                                                              selectedLeader
                                                                          )}
                                                                </span>
                                                            </div>

                                                            <p className="whitespace-pre-wrap text-sm">
                                                                {
                                                                    item.message
                                                                }
                                                            </p>

                                                            <p
                                                                className={`mt-2 text-[10px] ${
                                                                    fromManager
                                                                        ? "text-blue-100"
                                                                        : "text-slate-400"
                                                                }`}
                                                            >
                                                                {formatDate(
                                                                    item.createdAt
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        )
                                    )}
                                </div>

                                {/* Message form */}

                                <form
                                    onSubmit={
                                        handleSendMessage
                                    }
                                    className="border-t border-slate-200 bg-white p-5"
                                >
                                    <textarea
                                        value={message}
                                        onChange={(event) =>
                                            setMessage(
                                                event.target.value
                                            )
                                        }
                                        disabled={
                                            sending ||
                                            !selectedLeader
                                        }
                                        placeholder={
                                            selectedLeader
                                                ? "Write your message to the Team Leader..."
                                                : "Select a Team Leader first..."
                                        }
                                        rows={4}
                                        className="w-full resize-none rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                                    />

                                    <div className="mt-3 flex items-center justify-between gap-4">
                                        <p className="text-xs text-slate-400">
                                            Messages are associated with the selected project and Team.
                                        </p>

                                        <button
                                            type="submit"
                                            disabled={
                                                sending ||
                                                !selectedLeader ||
                                                !message.trim()
                                            }
                                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <Send
                                                size={17}
                                            />

                                            {sending
                                                ? "Sending..."
                                                : "Send Message"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ManagerMessages;