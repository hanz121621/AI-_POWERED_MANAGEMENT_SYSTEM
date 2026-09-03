
// ============================================================
// AIPMS - MANAGER NAVBAR
// ============================================================

import React from "react";

import {
    Bell,
    Search,
} from "lucide-react";

import {
    useNavigate,
} from "react-router-dom";

// ============================================================
// COMPONENT
// ============================================================

function ManagerNavbar() {
    const navigate = useNavigate();

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
                z-30
                flex
                h-20
                w-full
                items-center
                justify-between
                border-b
                border-slate-200
                bg-white
                px-8
                transition-colors
                duration-200
                dark:border-slate-800
                dark:bg-slate-900
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
                        text-slate-400
                        dark:text-slate-500
                    "
                />

                <input
                    type="text"
                    placeholder="Search projects..."
                    className="
                        w-full
                        rounded-lg
                        border
                        border-slate-300
                        bg-slate-50
                        py-3
                        pl-10
                        pr-4
                        text-slate-800
                        placeholder:text-slate-400
                        outline-none
                        transition
                        focus:border-blue-500
                        focus:ring-2
                        focus:ring-blue-200
                        dark:border-slate-700
                        dark:bg-slate-800
                        dark:text-slate-100
                        dark:placeholder:text-slate-500
                        dark:focus:border-blue-500
                        dark:focus:ring-blue-900
                    "
                />

            </div>

            {/* ==================================================
                NOTIFICATION + PROFILE
            ================================================== */}

            <div className="flex items-center gap-6">

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
                        transition
                        hover:bg-slate-100
                        focus:outline-none
                        focus:ring-2
                        focus:ring-blue-500
                        focus:ring-offset-2
                        dark:hover:bg-slate-800
                        dark:focus:ring-offset-slate-900
                    "
                >

                    <Bell
                        size={24}
                        className="
                            text-slate-700
                            dark:text-slate-200
                        "
                    />

                    {/* ==================================================
                        NOTIFICATION INDICATOR
                    ================================================== */}

                    <span
                        className="
                            absolute
                            right-2
                            top-2
                            h-2
                            w-2
                            rounded-full
                            border-2
                            border-white
                            bg-red-600
                            dark:border-slate-900
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
                    className="
                        flex
                        items-center
                        gap-3
                        rounded-lg
                        p-1
                        transition
                        hover:bg-slate-100
                        focus:outline-none
                        focus:ring-2
                        focus:ring-blue-500
                        focus:ring-offset-2
                        dark:hover:bg-slate-800
                        dark:focus:ring-offset-slate-900
                    "
                >

                    {/* ==================================================
                        AVATAR
                    ================================================== */}

                    <div
                        className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-full
                            bg-blue-600
                            font-bold
                            text-white
                        "
                    >
                        M
                    </div>

                    {/* ==================================================
                        MANAGER INFORMATION
                    ================================================== */}

                    <div className="text-left">

                        <p
                            className="
                                font-semibold
                                text-slate-800
                                dark:text-slate-100
                            "
                        >
                            Manager
                        </p>

                        <p
                            className="
                                text-sm
                                text-slate-500
                                dark:text-slate-400
                            "
                        >
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
