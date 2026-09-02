
import { useState } from "react";

import {
    MessageSquare,
    Bell,
    AtSign,
    Users,
} from "lucide-react";

import MentionTeamMembers from "@/components/contributor/staff/communication/MentionTeamMembers";
import ReceiveMessages from "@/components/contributor/staff/communication/ReceiveMessages";
import ViewNotifications from "@/components/contributor/staff/communication/ViewNotifications";

// ============================================================
// STAFF COMMUNICATION PAGE
// ============================================================

function Communication() {
    const [activeSection, setActiveSection] = useState("messages");

    // ============================================================
    // COMMUNICATION SECTIONS
    // ============================================================

    const sections = [
        {
            id: "messages",
            title: "Messages",
            description:
                "Receive and view messages from your team and manager.",
            icon: MessageSquare,
        },
        {
            id: "mentions",
            title: "Team Mentions",
            description:
                "View and manage mentions from team members.",
            icon: AtSign,
        },
        {
            id: "notifications",
            title: "Notifications",
            description:
                "View your latest project and task notifications.",
            icon: Bell,
        },
    ];

    // ============================================================
    // RENDER ACTIVE COMPONENT
    // ============================================================

    const renderActiveSection = () => {
        switch (activeSection) {
            case "messages":
                return <ReceiveMessages />;

            case "mentions":
                return <MentionTeamMembers />;

            case "notifications":
                return <ViewNotifications />;

            default:
                return <ReceiveMessages />;
        }
    };

    // ============================================================
    // PAGE
    // ============================================================

    return (
        <div className="w-full">

            {/* ==================================================
                PAGE HEADER
            ================================================== */}

            <div className="mb-6">

                <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm">
                        <MessageSquare size={22} />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-foreground">
                            Communication
                        </h1>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Communicate with your team, manager, and project
                            members.
                        </p>
                    </div>

                </div>

            </div>

            {/* ==================================================
                QUICK INFORMATION
            ================================================== */}

            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">

                {/* Messages */}

                <div className="rounded-xl border border-border bg-card p-4 shadow-sm">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <MessageSquare size={20} />
                        </div>

                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Messages
                            </p>

                            <p className="text-lg font-bold text-card-foreground">
                                Team Communication
                            </p>
                        </div>

                    </div>

                </div>

                {/* Mentions */}

                <div className="rounded-xl border border-border bg-card p-4 shadow-sm">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <AtSign size={20} />
                        </div>

                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Mentions
                            </p>

                            <p className="text-lg font-bold text-card-foreground">
                                Team Members
                            </p>
                        </div>

                    </div>

                </div>

                {/* Notifications */}

                <div className="rounded-xl border border-border bg-card p-4 shadow-sm">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Bell size={20} />
                        </div>

                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Notifications
                            </p>

                            <p className="text-lg font-bold text-card-foreground">
                                Project Updates
                            </p>
                        </div>

                    </div>

                </div>

            </div>

            {/* ==================================================
                COMMUNICATION NAVIGATION
            ================================================== */}

            <div className="mb-6 overflow-hidden rounded-xl border border-border bg-card shadow-sm">

                <div className="border-b border-border p-3">

                    <div className="flex flex-wrap gap-2">

                        {sections.map((section) => {

                            const Icon = section.icon;

                            const isActive =
                                activeSection === section.id;

                            return (
                                <button
                                    key={section.id}
                                    type="button"
                                    onClick={() =>
                                        setActiveSection(section.id)
                                    }
                                    className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                                        isActive
                                            ? "bg-primary text-primary-foreground shadow-sm"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    }`}
                                >
                                    <Icon size={18} />

                                    <span>
                                        {section.title}
                                    </span>
                                </button>
                            );
                        })}

                    </div>

                </div>

                {/* ==================================================
                    ACTIVE SECTION DESCRIPTION
                ================================================== */}

                <div className="px-5 py-4">

                    {sections.map((section) => {

                        if (section.id !== activeSection) {
                            return null;
                        }

                        const Icon = section.icon;

                        return (
                            <div
                                key={section.id}
                                className="flex items-start gap-3"
                            >

                                <div className="mt-0.5 text-primary">
                                    <Icon size={19} />
                                </div>

                                <div>

                                    <h2 className="font-semibold text-card-foreground">
                                        {section.title}
                                    </h2>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {section.description}
                                    </p>

                                </div>

                            </div>
                        );
                    })}

                </div>

            </div>

            {/* ==================================================
                ACTIVE COMMUNICATION COMPONENT
            ================================================== */}

            <div className="rounded-xl">

                {renderActiveSection()}

            </div>

            {/* ==================================================
                FOOTER INFORMATION
            ================================================== */}

            <div className="mt-6 rounded-xl border border-border bg-primary/10 p-4">

                <div className="flex items-start gap-3">

                    <Users
                        size={20}
                        className="mt-0.5 text-primary"
                    />

                    <div>

                        <h3 className="font-semibold text-foreground">
                            Staff Communication
                        </h3>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Use this section to communicate with team
                            members, receive messages, view mentions,
                            and stay updated with project notifications.
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Communication;
