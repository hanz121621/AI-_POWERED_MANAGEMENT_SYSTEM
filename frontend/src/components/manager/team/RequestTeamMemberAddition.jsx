import React, { useMemo, useState } from "react";
import {
    UserPlus,
    Send,
    X,
    ShieldCheck,
    AlertTriangle,
    CheckCircle2,
} from "lucide-react";

function RequestTeamMemberAddition({
    open = false,
    onClose,
    team,
    project,
    users = [],
    currentManager,
    permissionRequests = [],
    onSubmit,
}) {
    const [selectedUserId, setSelectedUserId] = useState("");
    const [reason, setReason] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const members = Array.isArray(team?.members)
        ? team.members
        : [];

    const eligibleUsers = useMemo(() => {
        const memberIds = new Set(
            members.map((member) => String(member.id))
        );

        return users.filter((user) => {
            const active =
                user.active !== false &&
                user.status !== "Inactive";

            return active && !memberIds.has(String(user.id));
        });
    }, [users, members]);

    const selectedUser = eligibleUsers.find(
        (user) =>
            String(user.id) === String(selectedUserId)
    );

    const duplicatePending = permissionRequests.some(
        (request) =>
            request.type === "team-member-add" &&
            request.status === "Pending" &&
            String(request.teamId) === String(team?.id) &&
            String(request.userId) === String(selectedUserId)
    );

    const handleSubmit = async () => {
        setError("");

        if (!team?.id) {
            setError("No assigned Team was found.");
            return;
        }

        if (!project?.id) {
            setError("No authorized project was found.");
            return;
        }

        if (!selectedUserId) {
            setError("Please select a user.");
            return;
        }

        if (!selectedUser) {
            setError("The selected user no longer exists or is unavailable.");
            return;
        }

        if (duplicatePending) {
            setError(
                "A pending addition request already exists for this user and Team."
            );
            return;
        }

        if (!reason.trim()) {
            setError("Please provide a reason for the request.");
            return;
        }

        if (reason.trim().length > 500) {
            setError("The reason cannot exceed 500 characters.");
            return;
        }

        const request = {
            type: "team-member-add",
            status: "Pending",

            projectId: project.id,
            teamId: team.id,
            userId: selectedUser.id,

            requestedBy:
                currentManager?.id ||
                currentManager?.userId ||
                null,

            reason: reason.trim(),

            createdAt: new Date().toISOString(),
        };

        try {
            setSubmitting(true);

            if (typeof onSubmit !== "function") {
                throw new Error(
                    "Request submission handler is not configured."
                );
            }

            await onSubmit(request);

            setSelectedUserId("");
            setReason("");
            onClose?.();
        } catch (submitError) {
            setError(
                submitError?.message ||
                    "Unable to submit the team member addition request."
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-700 p-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10">
                            <UserPlus
                                size={21}
                                className="text-indigo-400"
                            />
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-white">
                                Request Team Member Addition
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Admin approval is required.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-5 p-5">
                    {project && (
                        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                            <p className="text-xs uppercase tracking-wide text-slate-600">
                                Project
                            </p>

                            <p className="mt-1 font-medium text-white">
                                {project.name}
                            </p>
                        </div>
                    )}

                    {team && (
                        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                            <p className="text-xs uppercase tracking-wide text-slate-600">
                                Team
                            </p>

                            <p className="mt-1 font-medium text-white">
                                {team.name}
                            </p>
                        </div>
                    )}

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-300">
                            Select User
                        </label>

                        <select
                            value={selectedUserId}
                            onChange={(event) => {
                                setSelectedUserId(
                                    event.target.value
                                );
                                setError("");
                            }}
                            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                        >
                            <option value="">
                                Select eligible user...
                            </option>

                            {eligibleUsers.map((user) => {
                                const pending =
                                    permissionRequests.some(
                                        (request) =>
                                            request.type ===
                                                "team-member-add" &&
                                            request.status ===
                                                "Pending" &&
                                            String(
                                                request.teamId
                                            ) ===
                                                String(team?.id) &&
                                            String(
                                                request.userId
                                            ) ===
                                                String(user.id)
                                    );

                                return (
                                    <option
                                        key={user.id}
                                        value={user.id}
                                        disabled={pending}
                                    >
                                        {user.name ||
                                            user.email ||
                                            "Unnamed User"}
                                        {pending
                                            ? " (Request pending)"
                                            : ""}
                                    </option>
                                );
                            })}
                        </select>

                        {eligibleUsers.length === 0 && (
                            <p className="mt-2 text-xs text-amber-400">
                                No eligible users are currently available.
                            </p>
                        )}
                    </div>

                    {selectedUser && (
                        <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 font-semibold text-indigo-400">
                                    {selectedUser.name
                                        ?.charAt(0)
                                        ?.toUpperCase()}
                                </div>

                                <div>
                                    <p className="font-semibold text-white">
                                        {selectedUser.name}
                                    </p>

                                    <p className="text-sm text-slate-500">
                                        {selectedUser.email}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-300">
                            Reason for Request
                        </label>

                        <textarea
                            value={reason}
                            onChange={(event) =>
                                setReason(event.target.value)
                            }
                            maxLength={500}
                            rows={5}
                            placeholder="Explain why this user should be added to the Team..."
                            className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-indigo-500"
                        />

                        <div className="mt-2 flex justify-end">
                            <span className="text-xs text-slate-600">
                                {reason.length}/500
                            </span>
                        </div>
                    </div>

                    {duplicatePending && (
                        <Notice
                            type="warning"
                            message="A pending addition request already exists for this user and Team."
                        />
                    )}

                    {error && (
                        <Notice
                            type="error"
                            message={error}
                        />
                    )}

                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                        <div className="flex gap-3">
                            <ShieldCheck
                                size={19}
                                className="mt-0.5 shrink-0 text-amber-400"
                            />

                            <div>
                                <p className="text-sm font-medium text-amber-300">
                                    Admin approval required
                                </p>

                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                    Submitting this form creates a Pending
                                    request only. The user will not be added
                                    to the Team until an authorized Admin
                                    approves the request.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={submitting}
                            className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-700 disabled:opacity-40"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={
                                submitting ||
                                !selectedUser ||
                                duplicatePending
                            }
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <Send size={17} />

                            {submitting
                                ? "Submitting..."
                                : "Send Request"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Notice({ type, message }) {
    const isError = type === "error";

    return (
        <div
            className={`rounded-xl border p-4 ${
                isError
                    ? "border-red-500/20 bg-red-500/5"
                    : "border-amber-500/20 bg-amber-500/5"
            }`}
        >
            <div className="flex gap-3">
                {isError ? (
                    <AlertTriangle
                        size={18}
                        className="shrink-0 text-red-400"
                    />
                ) : (
                    <CheckCircle2
                        size={18}
                        className="shrink-0 text-amber-400"
                    />
                )}

                <p className="text-sm text-slate-300">
                    {message}
                </p>
            </div>
        </div>
    );
}

export default RequestTeamMemberAddition;