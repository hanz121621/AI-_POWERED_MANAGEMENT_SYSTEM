
import { useState } from "react";

import {
    Bell,
    MessageCircle,
    AtSign,
    Activity,
    Megaphone,
    Sparkles,
} from "lucide-react";

import ViewNotification from "@/components/manager/notification/ViewNotification";
import SendMessageToTeamLeader from "@/components/manager/notification/SendMessageToTeamLeader";
import MentionTeamLeader from "@/components/manager/notification/MentionTeamLeader";
import ActivityFeed from "@/components/manager/notification/ActivityFeed";
import SendProjectAnnouncement from "@/components/manager/notification/SendProjectAnnouncement";

// ============================================================
// AIPMS — MANAGER NOTIFICATIONS & COMMUNICATION
//
// Communication Use Cases
// - COMM-001 — View Notifications
// - COMM-002 — Send Message to Team Leader
// - COMM-003 — Mention Team Leader
// - COMM-004 — View Activity Feed
// - COMM-005 — Send Project Announcement
//
// Design:
// - Same visual style as Manager Sprint Management
// - Slate page background
// - Colorful gradient header
// - White rounded cards
// - Colorful navigation cards
// - Responsive desktop/mobile layout
// ============================================================

function Notifications() {
    // ========================================================
    // STATE
    // ========================================================

    const [activeTab, setActiveTab] =
        useState("notifications");

    // ========================================================
    // COMMUNICATION TABS
    // ========================================================

    const communicationTabs = [
        {
            id: "notifications",
            label: "Notifications",
            description: "View your project notifications",
            icon: Bell,
            color: "from-violet-500 to-purple-600",
            iconBg: "bg-violet-100",
            iconColor: "text-violet-600",
            activeBg: "bg-violet-50",
            activeText: "text-violet-700",
        },
        {
            id: "message",
            label: "Message Team Leader",
            description: "Send a direct message",
            icon: MessageCircle,
            color: "from-blue-500 to-cyan-600",
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600",
            activeBg: "bg-blue-50",
            activeText: "text-blue-700",
        },
        {
            id: "mention",
            label: "Mention Team Leader",
            description: "Mention the team leader",
            icon: AtSign,
            color: "from-emerald-500 to-green-600",
            iconBg: "bg-emerald-100",
            iconColor: "text-emerald-600",
            activeBg: "bg-emerald-50",
            activeText: "text-emerald-700",
        },
        {
            id: "activity",
            label: "Activity Feed",
            description: "View project activities",
            icon: Activity,
            color: "from-amber-500 to-orange-600",
            iconBg: "bg-amber-100",
            iconColor: "text-amber-600",
            activeBg: "bg-amber-50",
            activeText: "text-amber-700",
        },
        {
            id: "announcement",
            label: "Project Announcement",
            description: "Send a project announcement",
            icon: Megaphone,
            color: "from-pink-500 to-rose-600",
            iconBg: "bg-pink-100",
            iconColor: "text-pink-600",
            activeBg: "bg-pink-50",
            activeText: "text-pink-700",
        },
    ];

    // ========================================================
    // RENDER ACTIVE COMPONENT
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
    // CURRENT ACTIVE TAB
    // ========================================================

    const activeSection =
        communicationTabs.find(
            (tab) => tab.id === activeTab
        ) || communicationTabs[0];

    const ActiveIcon = activeSection.icon;

    // ========================================================
    // MAIN RENDER
    // ========================================================

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">

            <main className="min-h-screen">

                <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">

                    {/* ==================================================
                        COLORFUL HEADER
                    ================================================== */}

                    <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 p-7 text-white shadow-lg">

                        {/* Decorative circles */}

                        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10" />

                        <div className="absolute -bottom-20 right-24 h-44 w-44 rounded-full bg-white/10" />

                        <div className="absolute -bottom-10 left-1/3 h-28 w-28 rounded-full bg-white/5" />

                        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                            {/* Header information */}

                            <div className="flex items-center gap-4">

                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20 backdrop-blur-sm">

                                    <Bell
                                        size={28}
                                        className="text-white"
                                    />

                                </div>

                                <div>

                                    <div className="mb-1 flex items-center gap-2">

                                        <Sparkles
                                            size={16}
                                            className="text-cyan-200"
                                        />

                                        <span className="text-xs font-semibold uppercase tracking-wider text-white/80">
                                            Communication Workspace
                                        </span>

                                    </div>

                                    <h1 className="text-3xl font-bold tracking-tight">
                                        Notifications & Communication
                                    </h1>

                                    <p className="mt-1 max-w-2xl text-sm text-white/80">
                                        Manage notifications, team communication,
                                        project activities, and announcements.
                                    </p>

                                </div>

                            </div>

                            {/* Current section badge */}

                            <div className="flex items-center gap-2 self-start rounded-xl bg-white/10 px-4 py-3 ring-1 ring-white/20 backdrop-blur-sm sm:self-auto">

                                <ActiveIcon
                                    size={18}
                                    className="text-white"
                                />

                                <span className="text-sm font-semibold text-white">
                                    {activeSection.label}
                                </span>

                            </div>

                        </div>

                    </div>

                    {/* ==================================================
                        COMMUNICATION SECTIONS
                    ================================================== */}

                    <section className="mb-10">

                        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

                            <div>

                                <div className="flex items-center gap-2">

                                    <div className="h-2.5 w-2.5 rounded-full bg-violet-500" />

                                    <h2 className="text-xl font-bold text-slate-900">
                                        Communication Center
                                    </h2>

                                </div>

                                <p className="mt-1 text-sm text-slate-500">
                                    Select a communication feature to manage
                                    project notifications and team collaboration.
                                </p>

                            </div>

                            <div className="rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-bold text-violet-700">

                                {communicationTabs.length}{" "}
                                Features

                            </div>

                        </div>

                        {/* ==================================================
                            DESKTOP NAVIGATION CARDS
                        ================================================== */}

                        <div className="hidden grid-cols-1 gap-5 md:grid md:grid-cols-2 xl:grid-cols-5">

                            {communicationTabs.map(
                                (tab) => {

                                    const Icon =
                                        tab.icon;

                                    const isActive =
                                        activeTab ===
                                        tab.id;

                                    return (
                                        <button
                                            key={
                                                tab.id
                                            }
                                            type="button"
                                            onClick={() =>
                                                setActiveTab(
                                                    tab.id
                                                )
                                            }
                                            className={`group relative overflow-hidden rounded-2xl border bg-white p-1 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg ${
                                                isActive
                                                    ? "border-violet-300 ring-2 ring-violet-100"
                                                    : "border-slate-200"
                                            }`}
                                        >

                                            {/* Color accent */}

                                            <div
                                                className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${tab.color}`}
                                            />

                                            <div className="rounded-xl bg-white p-4">

                                                <div className="flex items-start justify-between gap-3">

                                                    <div
                                                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tab.iconBg}`}
                                                    >

                                                        <Icon
                                                            size={
                                                                21
                                                            }
                                                            className={
                                                                tab.iconColor
                                                            }
                                                        />

                                                    </div>

                                                    {isActive && (
                                                        <span className="rounded-full bg-violet-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-violet-700">
                                                            Active
                                                        </span>
                                                    )}

                                                </div>

                                                <h3
                                                    className={`mt-4 text-sm font-bold ${
                                                        isActive
                                                            ? tab.activeText
                                                            : "text-slate-900"
                                                    }`}
                                                >
                                                    {
                                                        tab.label
                                                    }
                                                </h3>

                                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                                    {
                                                        tab.description
                                                    }
                                                </p>

                                                <div
                                                    className={`mt-4 h-1 w-12 rounded-full bg-gradient-to-r ${tab.color}`}
                                                />

                                            </div>

                                        </button>
                                    );
                                }
                            )}

                        </div>

                        {/* ==================================================
                            MOBILE SELECTOR
                        ================================================== */}

                        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:hidden">

                            <label
                                htmlFor="communication-section"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                Communication Section
                            </label>

                            <div className="relative">

                                <select
                                    id="communication-section"
                                    value={
                                        activeTab
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setActiveTab(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm font-semibold text-slate-800 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                                >
                                    {communicationTabs.map(
                                        (
                                            tab
                                        ) => (
                                            <option
                                                key={
                                                    tab.id
                                                }
                                                value={
                                                    tab.id
                                                }
                                            >
                                                {
                                                    tab.label
                                                }
                                            </option>
                                        )
                                    )}
                                </select>

                                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-violet-500">

                                    <svg
                                        className="h-4 w-4"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.51a.75.75 0 01-1.08 0l-4.25-4.51a.75.75 0 01.02-1.06z"
                                            clipRule="evenodd"
                                        />
                                    </svg>

                                </div>

                            </div>

                        </div>

                    </section>

                    {/* ==================================================
                        ACTIVE SECTION HEADER
                    ================================================== */}

                    <section>

                        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                            <div className="flex items-center gap-3">

                                <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${activeSection.iconBg}`}
                                >

                                    <ActiveIcon
                                        size={19}
                                        className={
                                            activeSection.iconColor
                                        }
                                    />

                                </div>

                                <div>

                                    <h2 className="text-xl font-bold text-slate-900">
                                        {
                                            activeSection.label
                                        }
                                    </h2>

                                    <p className="text-sm text-slate-500">
                                        {
                                            activeSection.description
                                        }
                                    </p>

                                </div>

                            </div>

                            <div
                                className={`rounded-full border px-4 py-2 text-sm font-bold ${activeSection.activeBg} ${activeSection.activeText}`}
                            >
                                Active Section
                            </div>

                        </div>

                        {/* ==================================================
                            ACTIVE COMPONENT
                        ================================================== */}

                        <div className="rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">

                            <div className="rounded-xl bg-white p-4 md:p-6">

                                {renderActiveComponent()}

                            </div>

                        </div>

                    </section>

                </div>

            </main>

        </div>
    );
}

export default Notifications;

