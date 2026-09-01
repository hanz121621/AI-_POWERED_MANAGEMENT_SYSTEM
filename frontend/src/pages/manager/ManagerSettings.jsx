
// ============================================================
// AIPMS — MANAGER SETTINGS
//
// Settings Use Cases
// - View Manager Profile
// - Update Manager Profile
// - Theme Preferences
// - Notification Preferences
// - Account Preferences
//
// Colorful Professional UI
// Matches Manager Sprint Management UI
// ============================================================

import React, { useEffect, useState } from "react";

import {
    Settings as SettingsIcon,
    UserRound,
    Palette,
    Bell,
    ShieldCheck,
    Save,
    CheckCircle2,
    AlertTriangle,
    Sparkles,
    Mail,
    Moon,
    Sun,
    Monitor,
} from "lucide-react";

// ============================================================
// COMPONENT
// ============================================================

function ManagerSettings() {
    // ========================================================
    // CURRENT MANAGER
    // ========================================================

    const currentManager = {
        id: "current-manager",
        name: "Current Manager",
        email: "manager@aipms.com",
        phone: "+251 900 000 000",
        role: "Manager",
    };

    // ========================================================
    // PROFILE STATE
    // ========================================================

    const [profile, setProfile] = useState({
        name: currentManager.name,
        email: currentManager.email,
        phone: currentManager.phone,
    });

    // ========================================================
    // THEME STATE
    // Manager-only visual preference
    // ========================================================

    const [theme, setTheme] = useState(() => {
        return (
            localStorage.getItem(
                "aipms_manager_theme"
            ) || "light"
        );
    });

    // ========================================================
    // NOTIFICATION STATE
    // ========================================================

    const [notifications, setNotifications] =
        useState({
            email: true,
            sprintUpdates: true,
            taskUpdates: true,
            aiAlerts: true,
        });

    // ========================================================
    // MESSAGES
    // ========================================================

    const [successMessage, setSuccessMessage] =
        useState("");

    const [errorMessage, setErrorMessage] =
        useState("");

    // ========================================================
    // SAVE STATE
    // ========================================================

    const [isSaving, setIsSaving] =
        useState(false);

    // ========================================================
    // LOAD SAVED SETTINGS
    // ========================================================

    useEffect(() => {
        const savedProfile =
            localStorage.getItem(
                "aipms_manager_profile"
            );

        if (savedProfile) {
            try {
                const parsed =
                    JSON.parse(savedProfile);

                setProfile((previous) => ({
                    ...previous,
                    ...parsed,
                }));
            } catch {
                // Ignore invalid stored profile
            }
        }

        const savedNotifications =
            localStorage.getItem(
                "aipms_manager_notifications"
            );

        if (savedNotifications) {
            try {
                const parsed =
                    JSON.parse(
                        savedNotifications
                    );

                setNotifications((previous) => ({
                    ...previous,
                    ...parsed,
                }));
            } catch {
                // Ignore invalid stored settings
            }
        }
    }, []);

    // ========================================================
    // THEME CHANGE
    // ========================================================

    const handleThemeChange = (
        selectedTheme
    ) => {
        setTheme(selectedTheme);

        localStorage.setItem(
            "aipms_manager_theme",
            selectedTheme
        );

        setSuccessMessage(
            "Theme preference updated successfully."
        );

        setErrorMessage("");

        window.setTimeout(() => {
            setSuccessMessage("");
        }, 3000);
    };

    // ========================================================
    // PROFILE CHANGE
    // ========================================================

    const handleProfileChange = (
        field,
        value
    ) => {
        setProfile((previous) => ({
            ...previous,
            [field]: value,
        }));
    };

    // ========================================================
    // NOTIFICATION CHANGE
    // ========================================================

    const handleNotificationChange = (
        field
    ) => {
        setNotifications((previous) => ({
            ...previous,
            [field]: !previous[field],
        }));
    };

    // ========================================================
    // SAVE PROFILE
    // ========================================================

    const handleSaveProfile = () => {
        setSuccessMessage("");
        setErrorMessage("");

        const name =
            String(profile.name || "").trim();

        const email =
            String(profile.email || "").trim();

        const phone =
            String(profile.phone || "").trim();

        if (!name) {
            setErrorMessage(
                "Full name is required."
            );
            return;
        }

        if (!email) {
            setErrorMessage(
                "Email address is required."
            );
            return;
        }

        setIsSaving(true);

        window.setTimeout(() => {
            localStorage.setItem(
                "aipms_manager_profile",
                JSON.stringify({
                    name,
                    email,
                    phone,
                })
            );

            setProfile({
                name,
                email,
                phone,
            });

            setIsSaving(false);

            setSuccessMessage(
                "Profile settings saved successfully."
            );

            window.setTimeout(() => {
                setSuccessMessage("");
            }, 4000);
        }, 500);
    };

    // ========================================================
    // SAVE NOTIFICATIONS
    // ========================================================

    const handleSaveNotifications = () => {
        setSuccessMessage("");
        setErrorMessage("");

        localStorage.setItem(
            "aipms_manager_notifications",
            JSON.stringify(
                notifications
            )
        );

        setSuccessMessage(
            "Notification preferences saved successfully."
        );

        window.setTimeout(() => {
            setSuccessMessage("");
        }, 4000);
    };

    // ========================================================
    // THEME OPTIONS
    // ========================================================

    const themeOptions = [
        {
            id: "light",
            title: "Light",
            description:
                "Use the clean light manager interface.",
            icon: Sun,
            iconBg: "bg-amber-100",
            iconColor: "text-amber-600",
        },
        {
            id: "system",
            title: "System",
            description:
                "Follow your device appearance preference.",
            icon: Monitor,
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600",
        },
        {
            id: "dark",
            title: "Dark",
            description:
                "Use a darker appearance for the manager workspace.",
            icon: Moon,
            iconBg: "bg-violet-100",
            iconColor: "text-violet-600",
        },
    ];

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">

            <main className="min-h-screen">

                <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">

                    {/* ==================================================
                        COLORFUL HEADER
                    ================================================== */}

                    <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 p-7 text-white shadow-lg">

                        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10" />

                        <div className="absolute -bottom-20 right-24 h-44 w-44 rounded-full bg-white/10" />

                        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                            <div className="flex items-center gap-4">

                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20 backdrop-blur-sm">

                                    <SettingsIcon
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
                                            Manager Workspace
                                        </span>

                                    </div>

                                    <h1 className="text-3xl font-bold tracking-tight">
                                        Settings
                                    </h1>

                                    <p className="mt-1 max-w-2xl text-sm text-white/80">
                                        Manage your profile, appearance and workspace preferences.
                                    </p>

                                </div>

                            </div>

                            <div className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 ring-1 ring-white/20 backdrop-blur-sm">

                                <UserRound
                                    size={18}
                                    className="text-white"
                                />

                                <div>

                                    <p className="text-xs text-white/70">
                                        Signed in as
                                    </p>

                                    <p className="text-sm font-bold">
                                        {profile.name}
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* ==================================================
                        SUCCESS MESSAGE
                    ================================================== */}

                    {successMessage && (
                        <div
                            role="status"
                            className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 shadow-sm"
                        >

                            <CheckCircle2
                                size={19}
                                className="shrink-0 text-emerald-600"
                            />

                            <span>
                                {successMessage}
                            </span>

                        </div>
                    )}

                    {/* ==================================================
                        ERROR MESSAGE
                    ================================================== */}

                    {errorMessage && (
                        <div
                            role="alert"
                            className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 shadow-sm"
                        >

                            <AlertTriangle
                                size={19}
                                className="mt-0.5 shrink-0 text-red-600"
                            />

                            <span>
                                {errorMessage}
                            </span>

                        </div>
                    )}

                    {/* ==================================================
                        SETTINGS GRID
                    ================================================== */}

                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

                        {/* ==================================================
                            PROFILE
                        ================================================== */}

                        <section className="xl:col-span-2">

                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                                <div className="border-b border-slate-200 bg-gradient-to-r from-violet-50 to-blue-50 px-6 py-5">

                                    <div className="flex items-center gap-3">

                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100">

                                            <UserRound
                                                size={21}
                                                className="text-violet-600"
                                            />

                                        </div>

                                        <div>

                                            <h2 className="text-lg font-bold text-slate-900">
                                                Profile Information
                                            </h2>

                                            <p className="text-sm text-slate-500">
                                                Manage your manager account information.
                                            </p>

                                        </div>

                                    </div>

                                </div>

                                <div className="p-6">

                                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                                        {/* Full Name */}

                                        <div>

                                            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                                Full Name
                                            </label>

                                            <input
                                                type="text"
                                                value={
                                                    profile.name
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    handleProfileChange(
                                                        "name",
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                                                placeholder="Enter your full name"
                                            />

                                        </div>

                                        {/* Email */}

                                        <div>

                                            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                                Email Address
                                            </label>

                                            <div className="relative">

                                                <Mail
                                                    size={17}
                                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                                />

                                                <input
                                                    type="email"
                                                    value={
                                                        profile.email
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        handleProfileChange(
                                                            "email",
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                                    placeholder="manager@example.com"
                                                />

                                            </div>

                                        </div>

                                        {/* Phone */}

                                        <div>

                                            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                                Phone Number
                                            </label>

                                            <input
                                                type="tel"
                                                value={
                                                    profile.phone
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    handleProfileChange(
                                                        "phone",
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                                                placeholder="+251 ..."
                                            />

                                        </div>

                                        {/* Role */}

                                        <div>

                                            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                                Role
                                            </label>

                                            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">

                                                <ShieldCheck
                                                    size={18}
                                                    className="text-emerald-600"
                                                />

                                                <span className="text-sm font-semibold text-slate-700">
                                                    Manager
                                                </span>

                                                <span className="ml-auto rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
                                                    Active
                                                </span>

                                            </div>

                                        </div>

                                    </div>

                                    <div className="mt-6 flex justify-end border-t border-slate-200 pt-5">

                                        <button
                                            type="button"
                                            onClick={
                                                handleSaveProfile
                                            }
                                            disabled={
                                                isSaving
                                            }
                                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:from-violet-700 hover:to-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                                        >

                                            <Save
                                                size={17}
                                            />

                                            {isSaving
                                                ? "Saving..."
                                                : "Save Profile"}

                                        </button>

                                    </div>

                                </div>

                            </div>

                        </section>

                        {/* ==================================================
                            ACCOUNT SUMMARY
                        ================================================== */}

                        <section>

                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                                <div className="h-1.5 bg-gradient-to-r from-emerald-400 to-cyan-500" />

                                <div className="p-6">

                                    <div className="mb-5 flex items-center gap-3">

                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100">

                                            <ShieldCheck
                                                size={21}
                                                className="text-emerald-600"
                                            />

                                        </div>

                                        <div>

                                            <h2 className="font-bold text-slate-900">
                                                Account Status
                                            </h2>

                                            <p className="text-sm text-slate-500">
                                                Current account information
                                            </p>

                                        </div>

                                    </div>

                                    <div className="space-y-4">

                                        <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">

                                            <p className="text-xs font-semibold text-emerald-600">
                                                Account
                                            </p>

                                            <p className="mt-1 font-bold text-slate-900">
                                                Active
                                            </p>

                                        </div>

                                        <div className="rounded-xl border border-violet-100 bg-violet-50 p-4">

                                            <p className="text-xs font-semibold text-violet-600">
                                                Role
                                            </p>

                                            <p className="mt-1 font-bold text-slate-900">
                                                Manager
                                            </p>

                                        </div>

                                        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">

                                            <p className="text-xs font-semibold text-blue-600">
                                                Workspace
                                            </p>

                                            <p className="mt-1 font-bold text-slate-900">
                                                Manager Workspace
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </section>

                    </div>

                    {/* ==================================================
                        THEME PREFERENCES
                    ================================================== */}

                    <section className="mt-6">

                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                            <div className="border-b border-slate-200 bg-gradient-to-r from-violet-50 via-blue-50 to-cyan-50 px-6 py-5">

                                <div className="flex items-center gap-3">

                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">

                                        <Palette
                                            size={21}
                                            className="text-blue-600"
                                        />

                                    </div>

                                    <div>

                                        <h2 className="text-lg font-bold text-slate-900">
                                            Theme Preferences
                                        </h2>

                                        <p className="text-sm text-slate-500">
                                            Choose the appearance of your manager workspace.
                                        </p>

                                    </div>

                                </div>

                            </div>

                            <div className="p-6">

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                                    {themeOptions.map(
                                        (option) => {

                                            const Icon =
                                                option.icon;

                                            const isSelected =
                                                theme ===
                                                option.id;

                                            return (
                                                <button
                                                    key={
                                                        option.id
                                                    }
                                                    type="button"
                                                    onClick={() =>
                                                        handleThemeChange(
                                                            option.id
                                                        )
                                                    }
                                                    className={`relative rounded-2xl border p-5 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                                                        isSelected
                                                            ? "border-violet-400 bg-violet-50 ring-2 ring-violet-100"
                                                            : "border-slate-200 bg-white hover:border-slate-300"
                                                    }`}
                                                >

                                                    {isSelected && (
                                                        <div className="absolute right-4 top-4">

                                                            <CheckCircle2
                                                                size={
                                                                    20
                                                                }
                                                                className="text-violet-600"
                                                            />

                                                        </div>
                                                    )}

                                                    <div
                                                        className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${option.iconBg}`}
                                                    >

                                                        <Icon
                                                            size={
                                                                21
                                                            }
                                                            className={
                                                                option.iconColor
                                                            }
                                                        />

                                                    </div>

                                                    <h3 className="font-bold text-slate-900">
                                                        {
                                                            option.title
                                                        }
                                                    </h3>

                                                    <p className="mt-1 text-sm leading-5 text-slate-500">
                                                        {
                                                            option.description
                                                        }
                                                    </p>

                                                </button>
                                            );
                                        }
                                    )}

                                </div>

                            </div>

                        </div>

                    </section>

                    {/* ==================================================
                        NOTIFICATIONS
                    ================================================== */}

                    <section className="mt-6">

                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                            <div className="border-b border-slate-200 bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-5">

                                <div className="flex items-center gap-3">

                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100">

                                        <Bell
                                            size={21}
                                            className="text-amber-600"
                                        />

                                    </div>

                                    <div>

                                        <h2 className="text-lg font-bold text-slate-900">
                                            Notification Preferences
                                        </h2>

                                        <p className="text-sm text-slate-500">
                                            Control which manager workspace notifications you receive.
                                        </p>

                                    </div>

                                </div>

                            </div>

                            <div className="divide-y divide-slate-200">

                                {/* Email */}

                                <div className="flex items-center justify-between gap-5 px-6 py-5">

                                    <div>

                                        <p className="font-semibold text-slate-900">
                                            Email Notifications
                                        </p>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Receive important workspace notifications by email.
                                        </p>

                                    </div>

                                    <button
                                        type="button"
                                        role="switch"
                                        aria-checked={
                                            notifications.email
                                        }
                                        onClick={() =>
                                            handleNotificationChange(
                                                "email"
                                            )
                                        }
                                        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                                            notifications.email
                                                ? "bg-violet-600"
                                                : "bg-slate-300"
                                        }`}
                                    >

                                        <span
                                            className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                                                notifications.email
                                                    ? "left-6"
                                                    : "left-1"
                                            }`}
                                        />

                                    </button>

                                </div>

                                {/* Sprint Updates */}

                                <div className="flex items-center justify-between gap-5 px-6 py-5">

                                    <div>

                                        <p className="font-semibold text-slate-900">
                                            Sprint Updates
                                        </p>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Get notified about sprint status and progress changes.
                                        </p>

                                    </div>

                                    <button
                                        type="button"
                                        role="switch"
                                        aria-checked={
                                            notifications.sprintUpdates
                                        }
                                        onClick={() =>
                                            handleNotificationChange(
                                                "sprintUpdates"
                                            )
                                        }
                                        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                                            notifications.sprintUpdates
                                                ? "bg-emerald-500"
                                                : "bg-slate-300"
                                        }`}
                                    >

                                        <span
                                            className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                                                notifications.sprintUpdates
                                                    ? "left-6"
                                                    : "left-1"
                                            }`}
                                        />

                                    </button>

                                </div>

                                {/* Task Updates */}

                                <div className="flex items-center justify-between gap-5 px-6 py-5">

                                    <div>

                                        <p className="font-semibold text-slate-900">
                                            Task Updates
                                        </p>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Receive updates when tasks change or are assigned.
                                        </p>

                                    </div>

                                    <button
                                        type="button"
                                        role="switch"
                                        aria-checked={
                                            notifications.taskUpdates
                                        }
                                        onClick={() =>
                                            handleNotificationChange(
                                                "taskUpdates"
                                            )
                                        }
                                        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                                            notifications.taskUpdates
                                                ? "bg-blue-600"
                                                : "bg-slate-300"
                                        }`}
                                    >

                                        <span
                                            className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                                                notifications.taskUpdates
                                                    ? "left-6"
                                                    : "left-1"
                                            }`}
                                        />

                                    </button>

                                </div>

                                {/* AI Alerts */}

                                <div className="flex items-center justify-between gap-5 px-6 py-5">

                                    <div>

                                        <p className="font-semibold text-slate-900">
                                            AI Alerts
                                        </p>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Receive alerts about AI-detected risks and project issues.
                                        </p>

                                    </div>

                                    <button
                                        type="button"
                                        role="switch"
                                        aria-checked={
                                            notifications.aiAlerts
                                        }
                                        onClick={() =>
                                            handleNotificationChange(
                                                "aiAlerts"
                                            )
                                        }
                                        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                                            notifications.aiAlerts
                                                ? "bg-cyan-500"
                                                : "bg-slate-300"
                                        }`}
                                    >

                                        <span
                                            className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                                                notifications.aiAlerts
                                                    ? "left-6"
                                                    : "left-1"
                                            }`}
                                        />

                                    </button>

                                </div>

                            </div>

                            <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4">

                                <button
                                    type="button"
                                    onClick={
                                        handleSaveNotifications
                                    }
                                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:from-amber-600 hover:to-orange-700 hover:shadow-md"
                                >

                                    <Save
                                        size={17}
                                    />

                                    Save Notifications

                                </button>

                            </div>

                        </div>

                    </section>

                    {/* ==================================================
                        INFORMATION
                    ================================================== */}

                    <section className="mt-6">

                        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">

                            <div className="flex items-start gap-3">

                                <ShieldCheck
                                    size={20}
                                    className="mt-0.5 shrink-0 text-blue-600"
                                />

                                <div>

                                    <h3 className="font-bold text-blue-900">
                                        Manager Settings
                                    </h3>

                                    <p className="mt-1 text-sm leading-6 text-blue-700">
                                        These settings apply only to your manager workspace. Your changes do not modify project, team, or global system settings.
                                    </p>

                                </div>

                            </div>

                        </div>

                    </section>

                </div>

            </main>

        </div>
    );
}

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default ManagerSettings;

