import { useState } from "react";
import {
    Bell,
    MessageSquare,
    AtSign,
    Activity,
    Megaphone,
    RefreshCw,
} from "lucide-react";

import ViewNotification from "@/components/manager/notification/ViewNotification";
import SendMessageToTeamLeader from "@/components/manager/notification/SendMessageToTeamLeader";
import MentionTeamLeader from "@/components/manager/notification/MentionTeamLeader";
import ActivityFeed from "@/components/manager/notification/ActivityFeed";
import SendProjectAnnouncement from "@/components/manager/notification/SendProjectAnnouncement";

// ============================================================
// COMMUNICATION TABS
// ============================================================

const communicationTabs = [
    {
        id: "notifications",
        label: "Notifications",
        icon: Bell,
    },
    {
        id: "message",
        label: "Message",
        icon: MessageSquare,
    },
    {
        id: "mention",
        label: "Mention",
        icon: AtSign,
    },
    {
        id: "activity",
        label: "Activity Feed",
        icon: Activity,
    },
    {
        id: "announcement",
        label: "Announcement",
        icon: Megaphone,
    },
];

// ============================================================
// COMPONENT
// ============================================================

function Notifications() {
    const [activeTab, setActiveTab] = useState("notifications");
    const [refreshing, setRefreshing] = useState(false);
console.log("CURRENT ACTIVE TAB:", activeTab);
    // ========================================================
    // TAB CHANGE
    // ========================================================

    const handleTabChange = (tabId) => {
        console.log("Changing communication tab:", tabId);

        const exists = communicationTabs.some(
            (tab) => tab.id === tabId
        );

        if (!exists) {
            console.warn("Invalid communication tab:", tabId);
            return;
        }

        setActiveTab(tabId);
    };

    // ========================================================
    // REFRESH
    // ========================================================

    const handleRefresh = async () => {
        try {
            setRefreshing(true);

            // Small delay so the refresh button gives visual feedback.
            await new Promise((resolve) => setTimeout(resolve, 500));
        } finally {
            setRefreshing(false);
        }
    };

    // ========================================================
    // ACTIVE TAB
    // ========================================================

    const activeSection =
        communicationTabs.find(
            (tab) => tab.id === activeTab
        ) || communicationTabs[0];

    // ========================================================
    // ACTIVE COMPONENT
    // ========================================================

    const renderActiveComponent = () => {
        switch (activeTab) {
            case "notifications":
                return <ViewNotification />;

            case "message":
                return <SendMessageToTeamLeader />;

            case "mention":
                return <MentionTeamLeader />;

            case "activity":
                return <ActivityFeed />;

            case "announcement":
                return <SendProjectAnnouncement />;

            default:
                return <ViewNotification />;
        }
    };

    // ========================================================
    // UI
    // ========================================================

    return (
        <div className="w-full space-y-6 text-foreground">
            {/* ==================================================
                PAGE HEADER
            ================================================== */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Communication
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage notifications, messages, mentions,
                        activity, and project announcements.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-input bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <RefreshCw
                        className={`h-4 w-4 ${
                            refreshing ? "animate-spin" : ""
                        }`}
                    />

                    {refreshing ? "Refreshing..." : "Refresh"}
                </button>
            </div>

            {/* ==================================================
                DESKTOP TABS
            ================================================== */}
<div className="hidden w-full rounded-lg border border-border bg-card p-1 sm:flex">
    {communicationTabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
            <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex min-w-0 flex-1 items-center justify-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                        ? "bg-foreground text-background shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
            >
                <Icon className="h-4 w-4 shrink-0" />

                <span className="truncate">
                    {tab.label}
                </span>
            </button>
        );
    })}
</div>
            {/* ==================================================
                MOBILE TAB SELECT
            ================================================== */}

            <div className="sm:hidden">
                <label
                    htmlFor="communication-tab"
                    className="mb-2 block text-sm font-medium text-foreground"
                >
                    Communication section
                </label>

                <select
                    id="communication-tab"
                    value={activeTab}
                    onChange={(event) =>
                        handleTabChange(event.target.value)
                    }
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                >
                    {communicationTabs.map((tab) => (
                        <option key={tab.id} value={tab.id}>
                            {tab.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* ==================================================
                ACTIVE SECTION HEADER
            ================================================== */}

            <div className="flex items-center gap-3">
                {activeSection?.icon && (
                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <activeSection.icon className="h-5 w-5" />
                    </div>
                )}

                <div>
                    <h2 className="text-lg font-semibold text-foreground">
                        {activeSection.label}
                    </h2>

                    <p className="text-sm text-muted-foreground">
                        Select another section above to switch communication features.
                    </p>
                </div>
            </div>

            {/* ==================================================
                ACTIVE COMPONENT
            ================================================== */}

            <div className="min-w-0">
                {renderActiveComponent()}
            </div>
        </div>
    );
}

export default Notifications;