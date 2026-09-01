import React, { useMemo, useState } from "react";
import {
    UserMinus,
    Send,
    X,
    ShieldCheck,
    AlertTriangle,
} from "lucide-react";

function RequestTeamMemberRemoval({
    open = false,
    onClose,
    team,
    project,
    currentManager,
    permissionRequests = [],
    onSubmit,
}) {
    const [selectedMemberId, setSelectedMemberId] =
        useState("");

    const [reason, setReason] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const members = Array.isArray(team?.members)
        ? team.members
        : [];

    const removableMembers = useMemo(() => {
        return members.filter(
            (member) =>
                member.id !== team?.teamLeaderId &&
                member.isTeamLeader !== true &&
                member.isLeader !== true &&
                member.role !== "Team Leader"
        );
    }, [members, team]);

    const selectedMember = removableMembers.find(
        (member) =>
            String(member.id) ===
            String(selectedMemberId)
    );

    const duplicatePending = permissionRequests.some(
        (request) =>
            request.type === "team-member-remove" &&
            request.status === "Pending" &&
            String(request.teamId) === String(team?.id) &&
            String(request.userId) ===
                String(selectedMemberId)
    );

    const activeTasks = selectedMember
        ? Array.isArray(selectedMember.tasks)
            ? selectedMember.tasks.filter(
                  (task) =>
                      ![
                          "Completed",
                          "Done",
                          "Cancelled",
                      ].includes(task.status)
              )
            : []
        : [];

    const handleSubmit = async () => {
        setError("");

        if (!project?.id) {
            setError("No authorized project was found.");
            return;
        }

        if (!team?.id) {
            setError("No assigned Team was found.");
            return;
        }

        if (!selectedMember) {
            setError("Please select a current Team member.");
            return;
        }

        if (duplicatePending) {
            setError(
                "A pending removal request already exists for this Team member."
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
            type: "team-member-remove",
            status: "Pending",

            projectId: project.id,
            teamId: team.id,
            userId: selectedMember.id,

            requestedBy:
                currentManager?.id ||
                currentManager?.userId ||
                null,

            reason: reason.trim(),

            activeTaskCount: activeTasks.length,

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

            setSelectedMemberId("");
            setReason("");
            onClose?.();
        } catch (submitError) {
            setError(
                submitError?.message ||
                    "Unable to submit the removal request."
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
            <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-red-500/20 bg-slate-900 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-700 p-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10">
                            <UserMinus
                                size={21}
                                className="text-red-400"
                            />
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-white">
                                Request Team Member Removal
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
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-300">
                            Team Member
                        </label>

                        <select
                            value={selectedMemberId}
                            onChange={(event) => {
                                setSelectedMemberId(
                                    event.target.value
                                );
                                setError("");
                            }}
                            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-red-500"
                        >
                            <option value="">
                                Select Team member...
                            </option>

                            {removableMembers.map((member) => {
                                const pending =
                                    permissionRequests.some(
                                        (request) =>
                                            request.type ===
                                                "team-member-remove" &&
                                            request.status ===
                                                "Pending" &&
                                            String(
                                                request.teamId
                                            ) ===
                                                String(team?.id) &&
                                            String(
                                                request.userId
                                            ) ===
                                                String(member.id)
                                    );

                                return (
                                    <option
                                        key={member.id}
                                        value={member.id}
                                        disabled={pending}
                                    >
                                        {member.name ||
                                            member.email ||
                                            "Unnamed Member"}
                                        {pending
                                            ? " (Request pending)"
                                            : ""}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    {selectedMember && (
                        <>
                            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 font-semibold text-red-400">
                                        {selectedMember.name
                                            ?.charAt(0)
                                            ?.toUpperCase()}
                                    </div>

                                    <div>
                                        <p className="font-semibold text-white">
                                            {selectedMember.name}
                                        </p>

                                        <p className="text-sm text-slate-500">
                                            {selectedMember.email}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <InfoBox
                                    label="Role"
                                    value={
                                        selectedMember.role ||
                                        "Not specified"
                                    }
                                />

                                <InfoBox
                                    label="Assigned Tasks"
                                    value={
                                        Array.isArray(
                                            selectedMember.tasks
                                        )
                                            ? selectedMember.tasks
                                                  .length
                                            : 0
                                    }
                                />

                                <InfoBox
                                    label="Active Work"
                                    value={
                                        activeTasks.length
                                    }
                                />

                                <InfoBox
                                    label="Workload"
                                    value={`${Number(
                                        selectedMember.workload ||
                                            0
                                    )}%`}
                                />
                            </div>
                        </>
                    )}

                    {activeTasks.length > 0 && (
                        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                            <div className="flex gap-3">
                                <AlertTriangle
                                    size={19}
                                    className="mt-0.5 shrink-0 text-amber-400"
                                />

                                <div>
                                    <p className="text-sm font-medium text-amber-300">
                                        Active work detected
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-slate-500">
                                        This member currently has{" "}
                                        {activeTasks.length} active
                                        task
                                        {activeTasks.length !== 1
                                            ? "s"
                                            : ""}
                                        . An Admin must review the
                                        active work before approving
                                        the removal according to the
                                        configured project rules.
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
                            placeholder="Explain why this Team member should be removed..."
                            className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-red-500"
                        />

                        <div className="mt-2 flex justify-end">
                            <span className="text-xs text-slate-600">
                                {reason.length}/500
                            </span>
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                            <div className="flex gap-3">
                                <AlertTriangle
                                    size={18}
                                    className="shrink-0 text-red-400"
                                />

                                <p className="text-sm text-slate-300">
                                    {error}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                        <div className="flex gap-3">
                            <ShieldCheck
                                size={19}
                                className="mt-0.5 shrink-0 text-amber-400"
                            />

                            <div>
                                <p className="text-sm font-medium text-amber-300">
                                    Member will remain assigned
                                </p>

                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                    This request does not immediately
                                    remove the Team member. The member
                                    remains on the Team until an
                                    authorized Admin approves the
                                    request.
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
                                !selectedMember ||
                                duplicatePending
                            }
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-medium text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-40"
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

function InfoBox({ label, value }) {
    return (
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <p className="text-[10px] uppercase tracking-wide text-slate-600">
                {label}
            </p>

            <p className="mt-1 text-sm font-semibold text-white">
                {value}
            </p>
        </div>
    );
}

export default RequestTeamMemberRemoval;
