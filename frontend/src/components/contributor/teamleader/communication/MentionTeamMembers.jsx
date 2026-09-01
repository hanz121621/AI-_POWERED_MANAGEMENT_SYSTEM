import { useMemo, useState } from "react";
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
        role: "Developer",
        active: true,
    },
    {
        id: 2,
        name: "Sara Mohammed",
        username: "sara",
        role: "Developer",
        active: true,
    },
    {
        id: 3,
        name: "Dawit Tesfaye",
        username: "dawit",
        role: "Staff",
        active: true,
    },
    {
        id: 4,
        name: "Inactive User",
        username: "inactive",
        role: "Staff",
        active: false,
    },
];

export default function MentionTeamMembers() {
    const [text, setText] = useState("");
    const [mentionedMembers, setMentionedMembers] = useState([]);
    const [message, setMessage] = useState("");

    const mentionQuery = useMemo(() => {
        const match = text.match(/@([a-zA-Z0-9_]*)$/);
        return match ? match[1].toLowerCase() : null;
    }, [text]);

    const suggestions = useMemo(() => {
        if (mentionQuery === null) {
            return [];
        }

        return TEAM_MEMBERS.filter(
            (member) =>
                member.active &&
                (member.username.toLowerCase().includes(mentionQuery) ||
                    member.name.toLowerCase().includes(mentionQuery))
        );
    }, [mentionQuery]);

    const handleSelectMember = (member) => {
        const currentWithoutMention = text.replace(/@[a-zA-Z0-9_]*$/, "");

        setText(`${currentWithoutMention}@${member.username} `);

        if (!mentionedMembers.some((item) => item.id === member.id)) {
            setMentionedMembers((current) => [...current, member]);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!text.trim()) {
            setMessage("Comment cannot be empty.");
            return;
        }

        setMessage(
            mentionedMembers.length > 0
                ? `Comment posted and ${mentionedMembers.length} team member${
                      mentionedMembers.length > 1 ? "s" : ""
                  } notified.`
                : "Comment posted successfully."
        );

        setText("");
        setMentionedMembers([]);

        setTimeout(() => setMessage(""), 3500);
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
                                Only active members of your project team can be
                                mentioned.
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">
                        Task Discussion
                    </label>

                    <div className="relative">
                        <textarea
                            value={text}
                            onChange={(event) => setText(event.target.value)}
                            rows={5}
                            placeholder="Type @ to mention a team member..."
                            className="w-full resize-none rounded-xl border border-slate-200 p-4 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
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
                                            handleSelectMember(member)
                                        }
                                        className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-slate-50"
                                    >
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                                            <UserRound className="h-4 w-4 text-blue-600" />
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
                                {mentionedMembers.map((member) => (
                                    <span
                                        key={member.id}
                                        className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700"
                                    >
                                        <AtSign className="h-3 w-3" />
                                        {member.username}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-5 flex justify-end">
                        <button
                            type="submit"
                            className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
                        >
                            <Send className="h-4 w-4" />
                            Post Comment
                        </button>
                    </div>

                    {message && (
                        <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                            <CheckCircle2 className="h-4 w-4" />
                            {message}
                        </div>
                    )}
                </form>
            </div>
        </section>
    );
}