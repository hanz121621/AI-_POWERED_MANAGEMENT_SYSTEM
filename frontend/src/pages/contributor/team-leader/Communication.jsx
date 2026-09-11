
import {
    AtSign,
    Bell,
    MessageCircle,
    MessagesSquare,
} from "lucide-react";

import ReceiveMessages from "@/components/contributor/teamleader/communication/ReceiveMessages";
import TaskComments from "@/components/contributor/teamleader/communication/TaskComments";
import MentionTeamMembers from "@/components/contributor/teamleader/communication/MentionTeamMembers";
import ViewNotifications from "@/components/contributor/teamleader/communication/ViewNotifications";

export default function Communication() {
    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="rounded-2xl bg-blue-100 p-3.5">
                                <MessagesSquare className="h-7 w-7 text-blue-600" />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                    Communication
                                </h1>

                                <p className="mt-1 text-sm text-slate-500">
                                    Manage team messages, task discussions,
                                    mentions, and notifications.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                            <Bell className="h-4 w-4 text-amber-500" />

                            <span className="text-sm font-medium text-slate-700">
                                Team communication center
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mb-8 grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-blue-100 p-2.5">
                                <MessageCircle className="h-5 w-5 text-blue-600" />
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Communication
                                </p>

                                <p className="text-lg font-bold text-slate-900">
                                    Team Messages
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-violet-100 p-2.5">
                                <AtSign className="h-5 w-5 text-violet-600" />
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Coordination
                                </p>

                                <p className="text-lg font-bold text-slate-900">
                                    Team Mentions
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-amber-100 p-2.5">
                                <Bell className="h-5 w-5 text-amber-600" />
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Updates
                                </p>

                                <p className="text-lg font-bold text-slate-900">
                                    Notifications
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <ReceiveMessages />
                </div>

                <div className="mb-8">
                    <TaskComments />
                </div>

                <div className="mb-8">
                    <MentionTeamMembers />
                </div>

                <div>
                    <ViewNotifications />
                </div>
            </div>
        </div>
    );
}
