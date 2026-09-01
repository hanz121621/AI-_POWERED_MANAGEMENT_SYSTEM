
// ============================================================
// MANAGER NAVBAR
// AIPMS
//
// Features:
// - Project Search
// - Notifications
// - Manager Profile
//
// COMM-001 — View Notifications
//
// IMPORTANT:
// - Light theme only
// - No dark: classes
// - No dark background
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
                    "
                >

                    <Bell
                        size={24}
                        className="text-slate-700"
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
                            "
                        >
                            Manager
                        </p>

                        <p
                            className="
                                text-sm
                                text-slate-500
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

