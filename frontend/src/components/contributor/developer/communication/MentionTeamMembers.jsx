import { useState } from "react";
import {
    AtSign,
    CheckCircle2,
    Send,
    UserRound,
    UsersRound,
} from "lucide-react";

const TEAM_MEMBERS = [
    {
        id: 1,
        name: "Abebe Kebede",
        username: "abebe",
        role: "Team Leader",
        active: true,
    },
    {
        id: 2,
        name: "Sara Ahmed",
        username: "sara",
        role: "Developer",
        active: true,
    },
    {
        id: 3,
        name: "Daniel Tadesse",
        username: "daniel",
        role: "Developer",
        active: true,
    },
    {
        id: 4,
        name: "Inactive User",
        username: "inactive",
        role: "Developer",
        active: false,
    },
];

function MentionTeamMembers() {
    const [comment, setComment] = useState("");
    const [selectedMember, setSelectedMember] = useState(null);
    const [success, setSuccess] = useState("");

    const handleSelect = (member) => {
        if (!member.active) {
            alert("Cannot mention an inactive user.");
            return;
        }

        setSelectedMember(member);

        setComment((current) => {
            if (current.includes(`@${member.username}`)) {
                return current;
            }

            return `${current}${current ? " " : ""}@${member.username}`;
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!comment.trim()) {
            alert("Comment cannot be empty.");
            return;
        }

        if (!selectedMember) {
            alert("Please select a team member to mention.");
            return;
        }

        setSuccess(
            `Comment posted successfully. ${selectedMember.name} has been notified.`
        );

        setTimeout(() => setSuccess(""), 4000);
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="mx-auto max-w-5xl">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-900">
                        Mention Team Members
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Mention authorized project team members in discussions.
                    </p>
                </div>

                {success && (
                    <div className="mb-6 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                        <CheckCircle2 className="h-5 w-5" />
                        {success}
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="mb-4 flex items-center gap-2">
                            <UsersRound className="h-5 w-5 text-blue-600" />

                            <h2 className="font-semibold text-slate-900">
                                Project Members
                            </h2>
                        </div>

                        <div className="space-y-2">
                            {TEAM_MEMBERS.map((member) => (
                                <button
                                    type="button"
                                    key={member.id}
                                    disabled={!member.active}
                                    onClick={() => handleSelect(member)}
                                    className={`flex w-full items-center gap-3 rounded-lg p-3 text-left transition ${
                                        member.active
                                            ? "hover:bg-slate-50"
                                            : "cursor-not-allowed opacity-50"
                                    } ${
                                        selectedMember?.id === member.id
                                            ? "bg-blue-50 ring-1 ring-blue-200"
                                            : ""
                                    }`}
                                >
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
                                        <UserRound className="h-4 w-4 text-blue-600" />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium text-slate-800">
                                            {member.name}
                                        </p>

                                        <p className="text-xs text-slate-400">
                                            @{member.username} · {member.role}
                                        </p>
                                    </div>

                                    <span
                                        className={`h-2 w-2 rounded-full ${
                                            member.active
                                                ? "bg-green-500"
                                                : "bg-slate-400"
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
                        <div className="mb-5">
                            <h2 className="font-semibold text-slate-900">
                                Project Discussion
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Select a member and write your message.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={8}
                                placeholder="Write your discussion..."
                                className="w-full resize-none rounded-lg border border-slate-300 p-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                            {selectedMember && (
                                <div className="mt-4 flex items-center gap-3 rounded-lg bg-blue-50 p-3">
                                    <AtSign className="h-5 w-5 text-blue-600" />

                                    <div>
                                        <p className="text-sm font-medium text-blue-900">
                                            Mentioning {selectedMember.name}
                                        </p>

                                        <p className="text-xs text-blue-600">
                                            @{selectedMember.username}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="mt-5 flex justify-end">
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                                >
                                    <Send className="h-4 w-4" />
                                    Post Comment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MentionTeamMembers;