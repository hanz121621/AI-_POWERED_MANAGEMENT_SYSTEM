
// ============================================================
// AIPMS - MANAGER NAVBAR
// ============================================================

import React from "react";

import {
    Bell,
    Search,
    Sun,
    Moon,
} from "lucide-react";

import {
    useNavigate,
} from "react-router-dom";

import {
    useManagerTheme,
} from "@/contexts/useManagerTheme";

// ============================================================
// COMPONENT
// ============================================================

function ManagerNavbar() {
    const navigate = useNavigate();

    const {
        theme,
        toggleTheme,
    } = useManagerTheme();

    // ========================================================
    // OPEN NOTIFICATIONS
    // ========================================================

    const handleNotificationsClick = () => {
        navigate("/manager/notifications");
    };

    // ========================================================
    // OPEN PROFILE
    // ========================================================

    const handleProfileClick = () => {
        navigate("/manager/profile");
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <header
            className="
                sticky
                top-0
                z-40
                flex
                h-20
                w-full
                items-center
                justify-between
                border-b
                border-border
                bg-background
                px-8
                text-foreground
                transition-colors
                duration-300
            "
        >

            {/* ==================================================
                SEARCH
            ================================================== */}

            <div className="relative w-96">

                <Search
                    size={20}
                    className="
                        absolute
                        left-3
                        top-1/2
                        -translate-y-1/2
                        text-muted-foreground
                    "
                />

                <input
                    type="text"
                    placeholder="Search projects..."
                    className="
                        w-full
                        rounded-lg
                        border
                        border-border
                        bg-muted
                        py-3
                        pl-10
                        pr-4
                        text-foreground
                        outline-none
                        placeholder:text-muted-foreground
                        focus:ring-2
                        focus:ring-ring
                        transition-colors
                        duration-300
                    "
                />

            </div>

            {/* ==================================================
                RIGHT SIDE
            ================================================== */}

            <div className="flex items-center gap-5">

                {/* ==================================================
                    THEME TOGGLE
                ================================================== */}

                <button
                    type="button"
                    onClick={toggleTheme}
                    aria-label={
                        theme === "dark"
                            ? "Switch to light mode"
                            : "Switch to dark mode"
                    }
                    title={
                        theme === "dark"
                            ? "Switch to light mode"
                            : "Switch to dark mode"
                    }
                    className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-lg
                        border
                        border-border
                        bg-muted
                        text-foreground
                        transition-all
                        duration-300
                        hover:bg-accent
                        hover:text-accent-foreground
                        focus:outline-none
                        focus:ring-2
                        focus:ring-ring
                    "
                >
                    {theme === "dark" ? (
                        <Sun size={20} />
                    ) : (
                        <Moon size={20} />
                    )}
                </button>

                {/* ==================================================
                    NOTIFICATIONS
                ================================================== */}

                <button
                    type="button"
                    onClick={handleNotificationsClick}
                    aria-label="Open notifications"
                    title="Notifications"
                    className="
                        relative
                        rounded-full
                        p-3
                        text-muted-foreground
                        transition
                        hover:bg-accent
                        hover:text-accent-foreground
                        focus:outline-none
                        focus:ring-2
                        focus:ring-ring
                    "
                >

                    <Bell size={22} />

                    <span
                        className="
                            absolute
                            right-2
                            top-2
                            h-2
                            w-2
                            rounded-full
                            border-2
                            border-background
                            bg-red-500
                        "
                    />

                </button>

                {/* ==================================================
                    PROFILE
                ================================================== */}

                <button
                    type="button"
                    onClick={handleProfileClick}
                    aria-label="Open manager profile"
                    title="Manager Profile"
                    className="
                        flex
                        items-center
                        gap-3
                        rounded-lg
                        p-1
                        text-left
                        transition
                        hover:bg-accent
                        focus:outline-none
                        focus:ring-2
                        focus:ring-ring
                    "
                >

                    {/* AVATAR */}

                    <div
                        className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-full
                            bg-primary
                            font-bold
                            text-primary-foreground
                        "
                    >
                        M
                    </div>

                    {/* MANAGER INFORMATION */}

                    <div>

                        <p className="font-semibold text-foreground">
                            Manager
                        </p>

                        <p className="text-sm text-muted-foreground">
                            manager@email.com
                        </p>

                    </div>

                </button>

            </div>

        </header>
    );
}

// ============================================================
// EXPORT
// ============================================================

export default ManagerNavbar;
