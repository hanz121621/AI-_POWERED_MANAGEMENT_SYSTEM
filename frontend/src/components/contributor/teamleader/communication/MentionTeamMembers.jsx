
import { useEffect, useMemo, useState } from "react";
import {
    AlertCircle,
    AtSign,
    CheckCircle2,
    Loader2,
    Send,
    UserRound,
    UsersRound,
} from "lucide-react";

import api from "@/services/api";

function getInitials(name = "") {
    return name
        .split(" ")
        .filter(Boolean)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

function unwrapData(response) {
    return (
        response?.data?.data ??
        response?.data?.users ??
        response?.data?.items ??
        response?.data ??
        []
    );
}

function normalizeMember(member, index) {
    const id =
        member?.id ??
        member?.userId ??
        member?.Id ??
        member?.UserId;

    const name =
        member?.fullName ??
        member?.name ??
        member?.userName ??
        member?.username ??
        member?.FullName ??
        member?.Name ??
        "Team Member";

    const username =
        member?.username ??
        member?.userName ??
        member?.Username ??
        member?.UserName ??
        name.toLowerCase().replace(/\s+/g, ".");

    const role =
        member?.role ??
        member?.contributorType ??
        member?.contributorTypeName ??
        member?.type ??
        member?.Role ??
        member?.ContributorType ??
        "Contributor";

    return {
        id: id ?? `member-${index}`,
        name,
        username,
        role,
        active:
            member?.isActive ??
            member?.active ??
            member?.IsActive ??
            true,
    };
}

function normalizeTask(task, index) {
    return {
        id:
            task?.id ??
            task?.taskId ??
            task?.Id ??
            task?.TaskId ??
            `task-${index}`,
        title:
            task?.title ??
            task?.name ??
            task?.Title ??
            task?.Name ??
            `Task ${index + 1}`,
    };
}

function extractCommentId(response) {
    const data = response?.data;

    const comment =
        data?.comment ??
        data?.Comment ??
        data?.data?.comment ??
        data?.data?.Comment ??
        data?.data ??
        data;

    return (
        comment?.id ??
        comment?.commentId ??
        comment?.Id ??
        comment?.CommentId ??
        null
    );
}

export default function MentionTeamMembers({
    taskId: providedTaskId = null,
    sprintId = null,
    tasks: providedTasks = [],
}) {
    const [text, setText] = useState("");
    const [members, setMembers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [selectedTaskId, setSelectedTaskId] =
        useState(providedTaskId);

    const [mentionedMembers, setMentionedMembers] = useState([]);

    const [isLoadingMembers, setIsLoadingMembers] = useState(true);
    const [isLoadingTasks, setIsLoadingTasks] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (providedTaskId) {
            setSelectedTaskId(providedTaskId);
        }
    }, [providedTaskId]);

    useEffect(() => {
        let cancelled = false;

        const loadMembers = async () => {
            setIsLoadingMembers(true);
            setErrorMessage("");

            try {
                const response =
                    await api.get("/tasks/assignable-users");

                const rawMembers = unwrapData(response);

                const normalized = Array.isArray(rawMembers)
                    ? rawMembers.map(normalizeMember)
                    : [];

                if (!cancelled) {
                    setMembers(
                        normalized.filter(
                            (member) => member.active
                        )
                    );
                }
            } catch (error) {
                console.error(
                    "Failed to load team members:",
                    error
                );

                if (!cancelled) {
                    setMembers([]);
                    setErrorMessage(
                        error?.response?.data?.message ??
                            "Unable to load team members."
                    );
                }
            } finally {
                if (!cancelled) {
                    setIsLoadingMembers(false);
                }
            }
        };

        loadMembers();

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (providedTasks?.length > 0) {
            const normalized = providedTasks
                .map(normalizeTask)
                .filter((task) => task.id);

            setTasks(normalized);

            if (
                !selectedTaskId &&
                normalized.length > 0
            ) {
                setSelectedTaskId(normalized[0].id);
            }

            return;
        }

        if (!sprintId || providedTaskId) {
            return;
        }

        let cancelled = false;

        const loadTasks = async () => {
            setIsLoadingTasks(true);

            try {
                const response = await api.get(
                    `/tasks/team-leader/sprint/${sprintId}`
                );

                const rawTasks =
                    response?.data?.data ??
                    response?.data?.tasks ??
                    response?.data ??
                    [];

                const normalized = Array.isArray(rawTasks)
                    ? rawTasks
                          .map(normalizeTask)
                          .filter((task) => task.id)
                    : [];

                if (!cancelled) {
                    setTasks(normalized);

                    if (
                        !selectedTaskId &&
                        normalized.length > 0
                    ) {
                        setSelectedTaskId(
                            normalized[0].id
                        );
                    }
                }
            } catch (error) {
                console.error(
                    "Failed to load tasks:",
                    error
                );

                if (!cancelled) {
                    setTasks([]);
                    setErrorMessage(
                        error?.response?.data?.message ??
                            "Unable to load tasks."
                    );
                }
            } finally {
                if (!cancelled) {
                    setIsLoadingTasks(false);
                }
            }
        };

        loadTasks();

        return () => {
            cancelled = true;
        };
    }, [providedTasks, sprintId, providedTaskId]);

    const mentionQuery = useMemo(() => {
        const match = text.match(/@([a-zA-Z0-9_]*)$/);
        return match ? match[1].toLowerCase() : null;
    }, [text]);

    const suggestions = useMemo(() => {
        if (mentionQuery === null) {
            return [];
        }

        return members.filter((member) => {
            const username =
                String(member.username ?? "").toLowerCase();

            const name =
                String(member.name ?? "").toLowerCase();

            return (
                username.includes(mentionQuery) ||
                name.includes(mentionQuery)
            );
        });
    }, [mentionQuery, members]);

    const clearMessages = () => {
        setMessage("");
        setErrorMessage("");
    };

    const handleSelectMember = (member) => {
        const currentWithoutMention = text.replace(
            /@[a-zA-Z0-9_]*$/,
            ""
        );

        setText(
            `${currentWithoutMention}@${member.username} `
        );

        if (
            !mentionedMembers.some(
                (item) => item.id === member.id
            )
        ) {
            setMentionedMembers((current) => [
                ...current,
                member,
            ]);
        };
    };

    const handleRemoveMention = (memberId) => {
        setMentionedMembers((current) =>
            current.filter(
                (member) => member.id !== memberId
            )
        );
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        clearMessages();

        const trimmedText = text.trim();

        if (!trimmedText) {
            setErrorMessage("Comment cannot be empty.");
            return;
        }

        if (!selectedTaskId) {
            setErrorMessage(
                "Please select a task before posting the comment."
            );
            return;
        }

        setIsSubmitting(true);

        try {
            const commentResponse = await api.post(
                `/tasks/${selectedTaskId}/comments`,
                {
                    content: trimmedText,
                }
            );

            const commentId =
                extractCommentId(commentResponse);

            if (
                mentionedMembers.length > 0 &&
                commentId
            ) {
                const mentionedUserIds =
                    mentionedMembers
                        .map((member) => member.id)
                        .filter(
                            (id) =>
                                typeof id === "string" &&
                                id.length > 0
                        );

                if (mentionedUserIds.length > 0) {
                    await api.post(
                        `/communication/mentions/task-comment/${commentId}`,
                        mentionedUserIds
                    );
                }
            }

            setMessage(
                mentionedMembers.length > 0
                    ? `Comment posted and ${mentionedMembers.length} team member${
                          mentionedMembers.length > 1
                              ? "s"
                              : ""
                      } notified.`
                    : "Comment posted successfully."
            );

            setText("");
            setMentionedMembers([]);
        } catch (error) {
            console.error(
                "Failed to post comment:",
                error
            );

            const backendMessage =
                error?.response?.data?.message ??
                error?.response?.data?.Message;

            setErrorMessage(
                backendMessage ??
                    "Unable to post the comment. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-5">
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-violet-100 p-3">
                        <AtSign className="h-5 w-5 text-violet-600" />
                    </div>

                    <div>
                        <h2 className="text-lg font-bold text-slate-900">
                            Mention Team Members
                        </h2>

                        <p className="text-sm text-slate-500">
                            Notify authorized team members directly from a
                            task discussion.
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-5">
                {message && (
                    <div className="mb-4 flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                        <CheckCircle2 className="h-4 w-4" />
                        {message}
                    </div>
                )}

                {errorMessage && (
                    <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                        <AlertCircle className="h-4 w-4" />
                        {errorMessage}
                    </div>
                )}

                <div className="mb-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-white p-2 shadow-sm">
                            <UsersRound className="h-5 w-5 text-slate-600" />
                        </div>

                        <div>
                            <p className="text-sm font-semibold text-slate-800">
                                Authorized Team Members
                            </p>

                            <p className="text-xs text-slate-500">
                                Active contributors available for task
                                discussions.
                            </p>
                        </div>
                    </div>

                    {isLoadingMembers && (
                        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            Loading team members...
                        </div>
                    )}

                    {!isLoadingMembers &&
                        members.length === 0 && (
                            <p className="mt-3 text-xs text-slate-400">
                                No active team members found.
                            </p>
                        )}
                </div>

                {tasks.length > 0 && !providedTaskId && (
                    <div className="mb-5">
                        <label className="mb-2 block text-sm font-semibold text-slate-800">
                            Task
                        </label>

                        <select
                            value={selectedTaskId ?? ""}
                            onChange={(event) => {
                                setSelectedTaskId(
                                    event.target.value || null
                                );
                                clearMessages();
                            }}
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                            disabled={isLoadingTasks}
                        >
                            <option value="">
                                Select a task
                            </option>

                            {tasks.map((task) => (
                                <option
                                    key={task.id}
                                    value={task.id}
                                >
                                    {task.title}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {isLoadingTasks && (
                    <div className="mb-5 flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading sprint tasks...
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">
                        Task Discussion
                    </label>

                    <div className="relative">
                        <textarea
                            value={text}
                            onChange={(event) =>
                                setText(event.target.value)
                            }
                            rows={5}
                            placeholder="Type @ to mention a team member..."
                            disabled={isSubmitting}
                            className="w-full resize-none rounded-xl border border-slate-200 p-4 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:bg-slate-50"
                        />

                        {suggestions.length > 0 && (
                            <div className="absolute left-3 right-3 top-full z-20 mt-1 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                                <div className="border-b border-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    Team members
                                </div>

                                {suggestions.map((member) => (
                                    <button
                                        key={member.id}
                                        type="button"
                                        onClick={() =>
                                            handleSelectMember(
                                                member
                                            )
                                        }
                                        className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-slate-50"
                                    >
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-600">
                                            {getInitials(
                                                member.name
                                            )}
                                        </div>

                                        <div>
                                            <p className="text-sm font-semibold text-slate-800">
                                                {member.name}
                                            </p>

                                            <p className="text-xs text-slate-400">
                                                @{member.username} ·{" "}
                                                {member.role}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {mentionedMembers.length > 0 && (
                        <div className="mt-4">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Members to notify
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {mentionedMembers.map(
                                    (member) => (
                                        <button
                                            key={member.id}
                                            type="button"
                                            onClick={() =>
                                                handleRemoveMention(
                                                    member.id
                                                )
                                            }
                                            className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 transition hover:bg-violet-100"
                                            title="Remove mention"
                                        >
                                            <AtSign className="h-3 w-3" />
                                            {member.username}
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    )}

                    <div className="mt-5 flex justify-end">
                        <button
                            type="submit"
                            disabled={
                                isSubmitting ||
                                !selectedTaskId
                            }
                            className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Posting...
                                </>
                            ) : (
                                <>
                                    <Send className="h-4 w-4" />
                                    Post Comment
                                </>
                            )}
                        </button>
                    </div>

                    <p className="mt-2 text-right text-[11px] text-slate-400">
                        Select a task and use @ to mention active team
                        members.
                    </p>
                </form>
            </div>
        </section>
    );
}
