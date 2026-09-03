import { MessageSquare } from "lucide-react";

import ReceiveMessages from "@/components/contributor/developer/communication/ReceiveMessages";
import CommentOnTasks from "@/components/contributor/developer/communication/CommentOnTasks";
import MentionTeamMembers from "@/components/contributor/developer/communication/MentionTeamMembers";
import ViewNotifications from "@/components/contributor/developer/communication/ViewNotifications";

export default function Communication() {
    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="mx-auto max-w-7xl">

                <div className="mb-6 flex items-center gap-3">
                    <div className="rounded-xl bg-cyan-100 p-3">
                        <MessageSquare className="h-6 w-6 text-cyan-600" />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            Communication
                        </h1>

                        <p className="text-sm text-slate-500">
                            Messages, task discussions, mentions, and notifications.
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    <ReceiveMessages />

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <CommentOnTasks />
                        <MentionTeamMembers />
                    </div>

                    <ViewNotifications />
                </div>
            </div>
        </div>
    );
}