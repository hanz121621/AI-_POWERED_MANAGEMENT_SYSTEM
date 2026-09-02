
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
            description: "Receive and view messages from your team and manager.",
            icon: MessageSquare,
        },
        {
            id: "mentions",
            title: "Team Mentions",
            description: "View and manage mentions from team members.",
            icon: AtSign,
        },
        {
            id: "notifications",
            title: "Notifications",
            description: "View your latest project and task notifications.",
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
        <div className="min-h-screen bg-slate-50 p-4 md:p-6">

            {/* ==================================================
                PAGE HEADER
            ================================================== */}

            <div className="mb-6">

                <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                        <MessageSquare size={22} />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            Communication
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Communicate with your team, manager, and project members.
                        </p>
                    </div>

                </div>

            </div>

            {/* ==================================================
                QUICK INFORMATION
            ================================================== */}

            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">

                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                            <MessageSquare size={20} />
                        </div>

                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Messages
                            </p>

                            <p className="text-lg font-bold text-slate-900">
                                Team Communication
                            </p>
                        </div>

                    </div>

                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                            <AtSign size={20} />
                        </div>

                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Mentions
                            </p>

                            <p className="text-lg font-bold text-slate-900">
                                Team Members
                            </p>
                        </div>

                    </div>

                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                            <Bell size={20} />
                        </div>

                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Notifications
                            </p>

                            <p className="text-lg font-bold text-slate-900">
                                Project Updates
                            </p>
                        </div>

                    </div>

                </div>

            </div>

            {/* ==================================================
                COMMUNICATION NAVIGATION
            ================================================== */}

            <div className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

                <div className="border-b border-slate-200 p-3">

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
                                            ? "bg-blue-600 text-white shadow-sm"
                                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
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

                                <div className="mt-0.5 text-blue-600">
                                    <Icon size={19} />
                                </div>

                                <div>
                                    <h2 className="font-semibold text-slate-900">
                                        {section.title}
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
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

            <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4">

                <div className="flex items-start gap-3">

                    <Users
                        size={20}
                        className="mt-0.5 text-blue-600"
                    />

                    <div>

                        <h3 className="font-semibold text-blue-900">
                            Staff Communication
                        </h3>

                        <p className="mt-1 text-sm text-blue-700">
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
