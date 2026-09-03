import { useMemo, useState } from "react";
import {
    AtSign,
    CheckCircle2,
    Send,
    UserRound,
    UsersRound,
    AlertCircle,
} from "lucide-react";

import {
    mentionTaskComment,
} from "../../../../services/communicationService";

// ============================================================
// COMPONENT
// ============================================================
//
// Props:
//
// taskCommentId
//   The actual TaskComment ID returned by the Task Comment API.
//
// teamMembers
//   Real project team members loaded from the backend.
//
// onSuccess
//   Optional callback after successful mention.
//
// ============================================================

export default function MentionTeamMembers({
    taskCommentId,
    teamMembers = [],
    onSuccess,
}) {
    const [comment, setComment] = useState("");

    const [selectedMembers, setSelectedMembers] =
        useState([]);

    const [success, setSuccess] = useState("");

    const [error, setError] = useState("");

    const [submitting, setSubmitting] =
        useState(false);

    // ========================================================
    // NORMALIZE MEMBERS
    // ========================================================

    const normalizedMembers = useMemo(() => {
        if (!Array.isArray(teamMembers)) {
            return [];
        }

        return teamMembers.map((member) => ({
            id:
                member?.id ??
                member?.userId ??
                member?.UserId ??
                member?.Id,

            name:
                member?.name ??
                member?.fullName ??
                member?.FullName ??
                member?.userName ??
                member?.UserName ??
                "Unknown User",

            username:
                member?.username ??
                member?.userName ??
                member?.UserName ??
                "",

            role:
                member?.role ??
                member?.Role ??
                member?.userType ??
                member?.UserType ??
                "Contributor",

            active:
                member?.active ??
                member?.isActive ??
                member?.IsActive ??
                true,
        }));
    }, [teamMembers]);

    // ========================================================
    // SELECT MEMBER
    // ========================================================

    const handleSelect = (member) => {
        setError("");
        setSuccess("");

        if (!member.active) {
            setError(
                "Cannot mention an inactive user."
            );
            return;
        }

        if (!member.id) {
            setError(
                "The selected team member does not have a valid user ID."
            );
            return;
        }

        const alreadySelected =
            selectedMembers.some(
                (item) =>
                    String(item.id) ===
                    String(member.id)
            );

        if (alreadySelected) {
            return;
        }

        setSelectedMembers((current) => [
            ...current,
            member,
        ]);

        setComment((current) => {
            const mention = member.username
                ? `@${member.username}`
                : `@${member.name}`;

            if (current.includes(mention)) {
                return current;
            }

            return `${current}${
                current ? " " : ""
            }${mention} `;
        });
    };

    // ========================================================
    // REMOVE MEMBER
    // ========================================================

    const removeMember = (memberId) => {
        setSelectedMembers((current) =>
            current.filter(
                (member) =>
                    String(member.id) !==
                    String(memberId)
            )
        );
    };

    // ========================================================
    // SUBMIT MENTIONS
    // ========================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        // ----------------------------------------------------
        // Task Comment ID is required by the backend
        // ----------------------------------------------------

        if (!taskCommentId) {
            setError(
                "A Task Comment ID is required before mentions can be saved."
            );
            return;
        }

        // ----------------------------------------------------
        // Comment validation
        // ----------------------------------------------------

        if (!comment.trim()) {
            setError(
                "Comment cannot be empty."
            );
            return;
        }

        // ----------------------------------------------------
        // Mention validation
        // ----------------------------------------------------

        if (
            selectedMembers.length === 0
        ) {
            setError(
                "Please select at least one team member to mention."
            );
            return;
        }

        try {
            setSubmitting(true);

            const mentionedUserIds =
                selectedMembers.map(
                    (member) => member.id
                );

            // ------------------------------------------------
            // Confirmed backend endpoint:
            //
            // POST
            // /api/communication/mentions/task-comment/{taskCommentId}
            //
            // Body:
            // [
            //   "user-guid-1",
            //   "user-guid-2"
            // ]
            // ------------------------------------------------

            await mentionTaskComment(
                taskCommentId,
                mentionedUserIds
            );

            setSuccess(
                "Team members mentioned successfully."
            );

            if (onSuccess) {
                onSuccess(selectedMembers);
            }
        } catch (err) {
            console.error(
                "Failed to mention team members:",
                err
            );

            const status =
                err?.response?.status;

            if (status === 400) {
                setError(
                    err?.response?.data?.message ||
                        "The mention request is invalid."
                );
            } else if (status === 401) {
                setError(
                    "Your session has expired. Please log in again."
                );
            } else if (status === 403) {
                setError(
                    "You do not have permission to mention these team members."
                );
            } else if (status === 404) {
                setError(
                    "The task comment or selected team member could not be found."
                );
            } else {
                setError(
                    err?.response?.data?.message ||
                        err?.message ||
                        "Unable to save the mentions. Please try again."
                );
            }
        } finally {
            setSubmitting(false);
        }
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm">
            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="border-b border-slate-200 bg-gradient-to-r from-white to-cyan-50/50 p-5 sm:p-6">
                <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
                        <AtSign className="h-5 w-5" />
                    </div>

                    <div>
                        <h2 className="text-lg font-bold text-slate-900">
                            Mention Team Members
                        </h2>

                        <p className="mt-1 text-sm leading-6 text-slate-600">
                            Mention authorized
                            project team members
                            in discussions.
                        </p>
                    </div>
                </div>
            </div>

            {/* ==================================================
                SUCCESS
            ================================================== */}

            {success && (
                <div className="mx-5 mt-5 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 sm:mx-6">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />

                    <span>{success}</span>
                </div>
            )}

            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (
                <div className="mx-5 mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:mx-6">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                    <span>{error}</span>
                </div>
            )}

            {/* ==================================================
                MAIN CONTENT
            ================================================== */}

            <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-3">

                {/* ==================================================
                    PROJECT MEMBERS
                ================================================== */}

                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                    <div className="mb-4 flex items-center gap-2">
                        <UsersRound className="h-5 w-5 text-blue-600" />

                        <h3 className="font-semibold text-slate-900">
                            Project Members
                        </h3>
                    </div>

                    {normalizedMembers.length ===
                    0 ? (
                        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center">
                            <UsersRound className="mx-auto mb-3 h-8 w-8 text-slate-300" />

                            <p className="text-sm font-medium text-slate-700">
                                No project members
                                available.
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                Members will
                                appear here when
                                loaded from the
                                backend.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {normalizedMembers.map(
                                (member) => {
                                    const selected =
                                        selectedMembers.some(
                                            (
                                                selectedMember
                                            ) =>
                                                String(
                                                    selectedMember.id
                                                ) ===
                                                String(
                                                    member.id
                                                )
                                        );

                                    return (
                                        <button
                                            type="button"
                                            key={
                                                member.id
                                            }
                                            disabled={
                                                !member.active ||
                                                submitting
                                            }
                                            onClick={() =>
                                                handleSelect(
                                                    member
                                                )
                                            }
                                            className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                                                member.active
                                                    ? "border-transparent bg-white hover:border-blue-200 hover:bg-blue-50"
                                                    : "cursor-not-allowed border-transparent bg-slate-100 opacity-50"
                                            } ${
                                                selected
                                                    ? "border-blue-300 bg-blue-50 ring-2 ring-blue-100"
                                                    : ""
                                            }`}
                                        >
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                                                <UserRound className="h-4 w-4" />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-semibold text-slate-900">
                                                    {
                                                        member.name
                                                    }
                                                </p>

                                                <p className="truncate text-xs text-slate-500">
                                                    {member.username
                                                        ? `@${member.username} · `
                                                        : ""}
                                                    {
                                                        member.role
                                                    }
                                                </p>
                                            </div>

                                            <span
                                                className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                                                    member.active
                                                        ? "bg-emerald-500"
                                                        : "bg-slate-400"
                                                }`}
                                            />
                                        </button>
                                    );
                                }
                            )}
                        </div>
                    )}
                </div>

                {/* ==================================================
                    DISCUSSION
                ================================================== */}

                <div className="rounded-xl border border-slate-200 bg-white lg:col-span-2">
                    <div className="border-b border-slate-200 p-5">
                        <h3 className="font-semibold text-slate-900">
                            Project Discussion
                        </h3>

                        <p className="mt-1 text-sm text-slate-600">
                            Select members and
                            associate the mentions
                            with the task comment.
                        </p>
                    </div>

                    <form
                        onSubmit={
                            handleSubmit
                        }
                        className="p-5"
                    >
                        <label
                            htmlFor="mention-comment"
                            className="mb-2 block text-sm font-semibold text-slate-800"
                        >
                            Discussion
                        </label>

                        <textarea
                            id="mention-comment"
                            value={comment}
                            onChange={(e) => {
                                setComment(
                                    e.target.value
                                );
                                setError("");
                                setSuccess("");
                            }}
                            rows={7}
                            disabled={
                                submitting
                            }
                            placeholder="Write your discussion and select the team members you want to mention..."
                            className="w-full resize-none rounded-xl border border-slate-300 bg-white p-4 text-sm text-slate-900 placeholder:text-slate-400 caret-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                        />

                        {/* ==================================================
                            SELECTED MEMBERS
                        ================================================== */}

                        {selectedMembers.length >
                            0 && (
                            <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4">
                                <div className="flex items-center gap-2">
                                    <AtSign className="h-4 w-4 text-blue-700" />

                                    <p className="text-sm font-semibold text-blue-900">
                                        Mentioned members
                                    </p>
                                </div>

                                <div className="mt-3 flex flex-wrap gap-2">
                                    {selectedMembers.map(
                                        (
                                            member
                                        ) => (
                                            <span
                                                key={
                                                    member.id
                                                }
                                                className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-blue-800 ring-1 ring-blue-200"
                                            >
                                                <AtSign className="h-3.5 w-3.5" />

                                                {member.username ||
                                                    member.name}

                                                <button
                                                    type="button"
                                                    disabled={
                                                        submitting
                                                    }
                                                    onClick={() =>
                                                        removeMember(
                                                            member.id
                                                        )
                                                    }
                                                    aria-label={`Remove ${member.name}`}
                                                    className="rounded-full p-0.5 text-blue-400 transition hover:bg-blue-100 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        )
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ==================================================
                            TASK COMMENT STATUS
                        ================================================== */}

                        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                            <p className="text-xs leading-5 text-slate-600">
                                {taskCommentId
                                    ? "This discussion is linked to the saved task comment. The selected members will be mentioned through the communication backend."
                                    : "Post the task comment first. A Task Comment ID is required before mentions can be saved."}
                            </p>
                        </div>

                        {/* ==================================================
                            SUBMIT
                        ================================================== */}

                        <div className="mt-5 flex justify-end">
                            <button
                                type="submit"
                                disabled={
                                    submitting ||
                                    !taskCommentId ||
                                    !comment.trim() ||
                                    selectedMembers.length ===
                                        0
                                }
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-4 focus:ring-blue-100"
                            >
                                {submitting ? (
                                    <>
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />

                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-4 w-4" />

                                        Save Mentions
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}