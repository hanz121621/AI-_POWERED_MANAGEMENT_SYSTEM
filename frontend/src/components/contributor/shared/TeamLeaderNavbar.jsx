
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Bell,
    ChevronDown,
    LogOut,
    Menu,
    Moon,
    Search,
    Settings,
    ShieldCheck,
    Sun,
    UserRound,
    X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import api from "@/services/api";

// ============================================================
// STORAGE HELPERS
// ============================================================

const USER_STORAGE_KEYS = [
    "user",
    "aipms_user",
    "currentUser",
    "authUser",
];

function getStoredUser() {
    for (const key of USER_STORAGE_KEYS) {
        try {
            const storedUser = localStorage.getItem(key);

            if (!storedUser) {
                continue;
            }

            const parsedUser = JSON.parse(storedUser);

            if (parsedUser && typeof parsedUser === "object") {
                return parsedUser;
            }
        } catch (error) {
            console.error(
                `Unable to read ${key} from localStorage:`,
                error
            );
        }
    }

    return null;
}

// ============================================================
// DEFAULT USER
// ============================================================

const DEFAULT_USER = {
    id: null,
    fullName: "Team Leader",
    name: "Team Leader",
    email: "No email available",
    role: "Contributor",
    accountCategory: "Team Leader",
    avatar: null,
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function getUserName(user) {
    return (
        user?.fullName ||
        user?.name ||
        user?.username ||
        user?.displayName ||
        "Team Leader"
    );
}

function getUserEmail(user) {
    return (
        user?.email ||
        user?.emailAddress ||
        "No email available"
    );
}

function getUserRole(user) {
    return (
        user?.role ||
        user?.accountCategory ||
        user?.userRole ||
        "Contributor"
    );
}

function getInitials(name) {
    if (!name) {
        return "TL";
    }

    const parts = name
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (parts.length === 1) {
        return parts[0]
            .substring(0, 2)
            .toUpperCase();
    }

    return (
        parts[0].charAt(0) +
        parts[parts.length - 1].charAt(0)
    ).toUpperCase();
}

// ============================================================
// NOTIFICATION NORMALIZER
// ============================================================

function normalizeNotification(item, index) {
    if (!item || typeof item !== "object") {
        return null;
    }

    const id =
        item.id ??
        item.Id ??
        item.notificationId ??
        item.NotificationId ??
        index;

    const title =
        item.title ??
        item.Title ??
        item.subject ??
        item.Subject ??
        item.type ??
        item.Type ??
        "Notification";

    const message =
        item.message ??
        item.Message ??
        item.content ??
        item.Content ??
        item.description ??
        item.Description ??
        "You have a new notification.";

    const isRead =
        item.isRead ??
        item.IsRead ??
        item.read ??
        item.Read ??
        false;

    const createdAt =
        item.createdAt ??
        item.CreatedAt ??
        item.createdDate ??
        item.CreatedDate ??
        item.timestamp ??
        item.Timestamp;

    let time = "Recently";

    if (createdAt) {
        const date = new Date(createdAt);

        if (!Number.isNaN(date.getTime())) {
            time = date.toLocaleString([], {
                dateStyle: "short",
                timeStyle: "short",
            });
        }
    }

    return {
        id,
        title: String(title),
        message: String(message),
        time,
        unread: !Boolean(isRead),
        raw: item,
    };
}

function extractNotifications(response) {
    const responseData = response?.data;

    const candidates = [
        responseData?.data,
        responseData?.Data,
        responseData?.notifications,
        responseData?.Notifications,
        responseData,
    ];

    for (const candidate of candidates) {
        if (Array.isArray(candidate)) {
            return candidate;
        }
    }

    return [];
}

// ============================================================
// COMPONENT
// ============================================================

function TeamLeaderNavbar({
    onMenuClick,
    sidebarOpen = false,
    onToggleSidebar,
}) {
    const navigate = useNavigate();

    // ========================================================
    // USER
    // ========================================================

    const [user, setUser] = useState(
        () => getStoredUser() || DEFAULT_USER
    );

    const [searchValue, setSearchValue] = useState("");
    const [notificationsOpen, setNotificationsOpen] =
        useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] =
        useState(false);

    // ========================================================
    // NOTIFICATIONS
    // ========================================================

    const [notifications, setNotifications] = useState([]);
    const [notificationsLoading, setNotificationsLoading] =
        useState(false);
    const [notificationsError, setNotificationsError] =
        useState("");

    // ========================================================
    // THEME
    // ========================================================

    const [isDarkMode, setIsDarkMode] = useState(() => {
        try {
            return (
                localStorage.getItem("aipms_theme") ===
                "dark"
            );
        } catch {
            return false;
        }
    });

    // ========================================================
    // USER INFORMATION
    // ========================================================

    const userName = useMemo(
        () => getUserName(user),
        [user]
    );

    const userEmail = useMemo(
        () => getUserEmail(user),
        [user]
    );

    const userRole = useMemo(
        () => getUserRole(user),
        [user]
    );

    const initials = useMemo(
        () => getInitials(userName),
        [userName]
    );

    // ========================================================
    // LOAD USER FROM STORAGE
    // ========================================================

    useEffect(() => {
        const storedUser = getStoredUser();

        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    // ========================================================
    // LOAD NOTIFICATIONS
    // ========================================================

    const loadNotifications = async () => {
        try {
            setNotificationsLoading(true);
            setNotificationsError("");

            const response = await api.get(
                "/notifications"
            );

            const items = extractNotifications(response);

            const normalized = items
                .map(normalizeNotification)
                .filter(Boolean);

            setNotifications(normalized);
        } catch (error) {
            console.error(
                "Failed to load notifications:",
                error
            );

            setNotificationsError(
                error?.response?.data?.message ||
                    error?.response?.data?.Message ||
                    "Unable to load notifications."
            );
        } finally {
            setNotificationsLoading(false);
        }
    };

    // Load notifications when navbar mounts.
    useEffect(() => {
        loadNotifications();
    }, []);

    // ========================================================
    // UNREAD COUNT
    // ========================================================

    const unreadNotificationCount = useMemo(
        () =>
            notifications.filter(
                (notification) =>
                    notification.unread
            ).length,
        [notifications]
    );

    // ========================================================
    // NAVIGATION
    // ========================================================

    const handleProfile = () => {
        setProfileOpen(false);
        navigate("/profile");
    };

    const handleSettings = () => {
        setProfileOpen(false);
        navigate("/settings");
    };

    // ========================================================
    // LOGOUT
    // ========================================================

    const handleLogout = () => {
        const keysToRemove = [
            "user",
            "token",
            "refreshToken",
            "accessToken",
            "aipms_access_token",
            "aipms_user",
            "currentUser",
            "authUser",
        ];

        keysToRemove.forEach((key) => {
            try {
                localStorage.removeItem(key);
            } catch (error) {
                console.error(
                    `Unable to remove ${key}:`,
                    error
                );
            }
        });

        setUser(DEFAULT_USER);
        setProfileOpen(false);
        setNotificationsOpen(false);

        navigate("/login", {
            replace: true,
        });
    };

    // ========================================================
    // SEARCH
    // ========================================================

    const handleSearchSubmit = (event) => {
        event.preventDefault();

        const query = searchValue.trim();

        if (!query) {
            return;
        }

        console.log(
            "Team Leader search:",
            query
        );
    };

    // ========================================================
    // DARK MODE
    // ========================================================

    const handleThemeToggle = () => {
        const nextTheme = !isDarkMode;

        setIsDarkMode(nextTheme);

        try {
            localStorage.setItem(
                "aipms_theme",
                nextTheme ? "dark" : "light"
            );
        } catch (error) {
            console.error(
                "Unable to save theme:",
                error
            );
        }

        if (nextTheme) {
            document.documentElement.classList.add(
                "dark"
            );
        } else {
            document.documentElement.classList.remove(
                "dark"
            );
        }
    };

    // ========================================================
    // MARK NOTIFICATION AS READ
    // ========================================================

    const handleNotificationClick = async (
        notification
    ) => {
        if (!notification?.id) {
            return;
        }

        if (!notification.unread) {
            return;
        }

        try {
            await api.patch(
                `/notifications/${notification.id}/read`
            );

            setNotifications((current) =>
                current.map((item) =>
                    item.id === notification.id
                        ? {
                              ...item,
                              unread: false,
                          }
                        : item
                )
            );
        } catch (error) {
            console.error(
                "Failed to mark notification as read:",
                error
            );
        }
    };

    // ========================================================
    // OPEN NOTIFICATIONS
    // ========================================================

    const handleNotificationsToggle = () => {
        setNotificationsOpen((current) => !current);
        setProfileOpen(false);
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <>
            <header
                className="
                    sticky
                    top-0
                    z-40
                    border-b
                    border-slate-200
                    bg-white/95
                    backdrop-blur
                    dark:border-blue-900/70
                    dark:bg-[#0b1f3a]/95
                "
            >
                <div
                    className="
                        flex
                        h-16
                        items-center
                        gap-3
                        px-4
                        md:px-6
                    "
                >
                    {/* ==================================================
                        MOBILE SIDEBAR BUTTON
                    ================================================== */}

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={
                            onMenuClick ||
                            onToggleSidebar
                        }
                        className="
                            shrink-0
                            text-slate-700
                            hover:bg-slate-100
                            hover:text-slate-950
                            dark:text-slate-200
                            dark:hover:bg-blue-950/60
                            dark:hover:text-white
                            lg:hidden
                        "
                        aria-label={
                            sidebarOpen
                                ? "Close sidebar"
                                : "Open sidebar"
                        }
                    >
                        {sidebarOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </Button>

                    {/* ==================================================
                        BRAND
                    ================================================== */}

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/team-leader")
                        }
                        className="
                            flex
                            shrink-0
                            items-center
                            gap-2
                        "
                    >
                        <div
                            className="
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-lg
                                bg-blue-600
                                text-white
                                shadow-sm
                            "
                        >
                            <ShieldCheck className="h-5 w-5" />
                        </div>

                        <div className="hidden sm:block">
                            <p
                                className="
                                    text-sm
                                    font-bold
                                    leading-tight
                                    text-slate-900
                                    dark:text-white
                                "
                            >
                                AI-PMS
                            </p>

                            <p
                                className="
                                    text-[10px]
                                    font-medium
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                Team Leader Portal
                            </p>
                        </div>
                    </button>

                    {/* ==================================================
                        DESKTOP SEARCH
                    ================================================== */}

                    <form
                        onSubmit={handleSearchSubmit}
                        className="
                            ml-4
                            hidden
                            max-w-md
                            flex-1
                            md:block
                        "
                    >
                        <div className="relative">
                            <Search
                                className="
                                    pointer-events-none
                                    absolute
                                    left-3
                                    top-1/2
                                    h-4
                                    w-4
                                    -translate-y-1/2
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            />

                            <input
                                type="search"
                                value={searchValue}
                                onChange={(event) =>
                                    setSearchValue(
                                        event.target.value
                                    )
                                }
                                placeholder="Search tasks, projects, team members..."
                                className="
                                    h-10
                                    w-full
                                    rounded-lg
                                    border
                                    border-slate-200
                                    bg-slate-50
                                    pl-9
                                    pr-3
                                    text-sm
                                    text-slate-800
                                    outline-none
                                    transition
                                    placeholder:text-slate-400
                                    focus:border-blue-400
                                    focus:ring-2
                                    focus:ring-blue-100
                                    dark:border-blue-900/70
                                    dark:bg-[#132f52]
                                    dark:text-white
                                    dark:placeholder:text-slate-500
                                    dark:focus:border-blue-600
                                    dark:focus:ring-blue-950
                                "
                            />
                        </div>
                    </form>

                    {/* ==================================================
                        RIGHT SIDE
                    ================================================== */}

                    <div
                        className="
                            ml-auto
                            flex
                            items-center
                            gap-1
                        "
                    >
                        {/* MOBILE SEARCH */}

                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                                setMobileSearchOpen(
                                    (current) =>
                                        !current
                                )
                            }
                            className="
                                text-slate-700
                                hover:bg-slate-100
                                hover:text-slate-950
                                dark:text-slate-200
                                dark:hover:bg-blue-950/60
                                dark:hover:text-white
                                md:hidden
                            "
                            aria-label="Search"
                        >
                            <Search className="h-5 w-5" />
                        </Button>

                        {/* THEME */}

                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={
                                handleThemeToggle
                            }
                            className="
                                hidden
                                text-slate-700
                                hover:bg-slate-100
                                hover:text-slate-950
                                dark:text-slate-200
                                dark:hover:bg-blue-950/60
                                dark:hover:text-white
                                sm:inline-flex
                            "
                            aria-label={
                                isDarkMode
                                    ? "Switch to light mode"
                                    : "Switch to dark mode"
                            }
                        >
                            {isDarkMode ? (
                                <Sun className="h-5 w-5 text-amber-500" />
                            ) : (
                                <Moon className="h-5 w-5 text-slate-700 dark:text-slate-200" />
                            )}
                        </Button>

                        {/* ==================================================
                            NOTIFICATIONS
                        ================================================== */}

                        <div className="relative">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={
                                    handleNotificationsToggle
                                }
                                className="
                                    relative
                                    text-slate-700
                                    hover:bg-slate-100
                                    hover:text-slate-950
                                    dark:text-slate-200
                                    dark:hover:bg-blue-950/60
                                    dark:hover:text-white
                                "
                                aria-label="Notifications"
                            >
                                <Bell className="h-5 w-5 text-slate-700 dark:text-slate-200" />

                                {unreadNotificationCount >
                                    0 && (
                                    <span
                                        className="
                                            absolute
                                            right-1.5
                                            top-1.5
                                            flex
                                            h-4
                                            min-w-4
                                            items-center
                                            justify-center
                                            rounded-full
                                            bg-red-500
                                            px-1
                                            text-[9px]
                                            font-bold
                                            text-white
                                            ring-2
                                            ring-white
                                            dark:ring-[#0b1f3a]
                                        "
                                    >
                                        {
                                            unreadNotificationCount
                                        }
                                    </span>
                                )}
                            </Button>

                            {notificationsOpen && (
                                <div
                                    className="
                                        absolute
                                        right-0
                                        mt-2
                                        w-[320px]
                                        overflow-hidden
                                        rounded-xl
                                        border
                                        border-slate-200
                                        bg-white
                                        shadow-xl
                                        dark:border-blue-900/70
                                        dark:bg-[#0f2747]
                                    "
                                >
                                    {/* NOTIFICATION HEADER */}

                                    <div
                                        className="
                                            flex
                                            items-center
                                            justify-between
                                            border-b
                                            border-slate-200
                                            px-4
                                            py-3
                                            dark:border-blue-900/70
                                        "
                                    >
                                        <div>
                                            <p
                                                className="
                                                    text-sm
                                                    font-semibold
                                                    text-slate-900
                                                    dark:text-white
                                                "
                                            >
                                                Notifications
                                            </p>

                                            <p
                                                className="
                                                    mt-0.5
                                                    text-xs
                                                    text-slate-500
                                                    dark:text-slate-400
                                                "
                                            >
                                                Team and project
                                                updates
                                            </p>
                                        </div>

                                        <span
                                            className="
                                                rounded-full
                                                bg-blue-100
                                                px-2
                                                py-1
                                                text-[10px]
                                                font-semibold
                                                text-blue-700
                                                dark:bg-blue-950/50
                                                dark:text-blue-300
                                            "
                                        >
                                            {
                                                unreadNotificationCount
                                            }{" "}
                                            new
                                        </span>
                                    </div>

                                    {/* NOTIFICATION BODY */}

                                    <div className="max-h-[350px] overflow-y-auto">
                                        {notificationsLoading ? (
                                            <div
                                                className="
                                                    px-4
                                                    py-8
                                                    text-center
                                                    text-xs
                                                    text-slate-500
                                                    dark:text-slate-400
                                                "
                                            >
                                                Loading notifications...
                                            </div>
                                        ) : notificationsError ? (
                                            <div className="px-4 py-6">
                                                <p
                                                    className="
                                                        text-center
                                                        text-xs
                                                        text-red-500
                                                    "
                                                >
                                                    {
                                                        notificationsError
                                                    }
                                                </p>

                                                <button
                                                    type="button"
                                                    onClick={
                                                        loadNotifications
                                                    }
                                                    className="
                                                        mx-auto
                                                        mt-3
                                                        block
                                                        rounded-lg
                                                        bg-blue-600
                                                        px-3
                                                        py-2
                                                        text-xs
                                                        font-medium
                                                        text-white
                                                        hover:bg-blue-700
                                                    "
                                                >
                                                    Retry
                                                </button>
                                            </div>
                                        ) : notifications.length ===
                                          0 ? (
                                            <div
                                                className="
                                                    px-4
                                                    py-8
                                                    text-center
                                                "
                                            >
                                                <Bell
                                                    className="
                                                        mx-auto
                                                        mb-2
                                                        h-6
                                                        w-6
                                                        text-slate-400
                                                        dark:text-slate-500
                                                    "
                                                />

                                                <p
                                                    className="
                                                        text-xs
                                                        font-medium
                                                        text-slate-600
                                                        dark:text-slate-300
                                                    "
                                                >
                                                    No notifications
                                                </p>

                                                <p
                                                    className="
                                                        mt-1
                                                        text-[11px]
                                                        text-slate-400
                                                    "
                                                >
                                                    You're all caught up.
                                                </p>
                                            </div>
                                        ) : (
                                            notifications.map(
                                                (
                                                    notification
                                                ) => (
                                                    <button
                                                        type="button"
                                                        key={
                                                            notification.id
                                                        }
                                                        onClick={() =>
                                                            handleNotificationClick(
                                                                notification
                                                            )
                                                        }
                                                        className="
                                                            flex
                                                            w-full
                                                            gap-3
                                                            border-b
                                                            border-slate-100
                                                            px-4
                                                            py-3
                                                            text-left
                                                            transition
                                                            hover:bg-slate-50
                                                            dark:border-blue-900/40
                                                            dark:hover:bg-blue-950/30
                                                        "
                                                    >
                                                        <div
                                                            className={`
                                                                mt-1
                                                                h-2
                                                                w-2
                                                                shrink-0
                                                                rounded-full
                                                                ${
                                                                    notification.unread
                                                                        ? "bg-blue-500"
                                                                        : "bg-slate-300 dark:bg-slate-600"
                                                                }
                                                            `}
                                                        />

                                                        <div className="min-w-0">
                                                            <p
                                                                className="
                                                                    text-xs
                                                                    font-semibold
                                                                    text-slate-800
                                                                    dark:text-white
                                                                "
                                                            >
                                                                {
                                                                    notification.title
                                                                }
                                                            </p>

                                                            <p
                                                                className="
                                                                    mt-1
                                                                    text-xs
                                                                    leading-5
                                                                    text-slate-500
                                                                    dark:text-slate-400
                                                                "
                                                            >
                                                                {
                                                                    notification.message
                                                                }
                                                            </p>

                                                            <p
                                                                className="
                                                                    mt-1
                                                                    text-[10px]
                                                                    text-slate-400
                                                                    dark:text-slate-500
                                                                "
                                                            >
                                                                {
                                                                    notification.time
                                                                }
                                                            </p>
                                                        </div>
                                                    </button>
                                                )
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ==================================================
                            PROFILE
                        ================================================== */}

                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => {
                                    setProfileOpen(
                                        (current) =>
                                            !current
                                    );

                                    setNotificationsOpen(
                                        false
                                    );
                                }}
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    rounded-lg
                                    p-1.5
                                    transition
                                    hover:bg-slate-100
                                    dark:hover:bg-blue-950/60
                                "
                                aria-label="Open user menu"
                            >
                                {user?.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={userName}
                                        className="
                                            h-9
                                            w-9
                                            rounded-full
                                            object-cover
                                        "
                                    />
                                ) : (
                                    <div
                                        className="
                                            flex
                                            h-9
                                            w-9
                                            items-center
                                            justify-center
                                            rounded-full
                                            bg-blue-600
                                            text-xs
                                            font-bold
                                            text-white
                                        "
                                    >
                                        {initials}
                                    </div>
                                )}

                                <div className="hidden text-left lg:block">
                                    <p
                                        className="
                                            max-w-[130px]
                                            truncate
                                            text-xs
                                            font-semibold
                                            text-slate-800
                                            dark:text-white
                                        "
                                    >
                                        {userName}
                                    </p>

                                    <p
                                        className="
                                            max-w-[130px]
                                            truncate
                                            text-[10px]
                                            text-slate-500
                                            dark:text-slate-400
                                        "
                                    >
                                        Team Leader
                                    </p>
                                </div>

                                <ChevronDown
                                    className="
                                        hidden
                                        h-4
                                        w-4
                                        text-slate-500
                                        dark:text-slate-400
                                        lg:block
                                    "
                                />
                            </button>

                            {profileOpen && (
                                <div
                                    className="
                                        absolute
                                        right-0
                                        mt-2
                                        w-72
                                        overflow-hidden
                                        rounded-xl
                                        border
                                        border-slate-200
                                        bg-white
                                        shadow-xl
                                        dark:border-blue-900/70
                                        dark:bg-[#0f2747]
                                    "
                                >
                                    {/* USER HEADER */}

                                    <div
                                        className="
                                            border-b
                                            border-slate-200
                                            bg-slate-50
                                            px-4
                                            py-4
                                            dark:border-blue-900/70
                                            dark:bg-[#132f52]
                                        "
                                    >
                                        <div className="flex items-center gap-3">
                                            {user?.avatar ? (
                                                <img
                                                    src={user.avatar}
                                                    alt={
                                                        userName
                                                    }
                                                    className="
                                                        h-11
                                                        w-11
                                                        rounded-full
                                                        object-cover
                                                    "
                                                />
                                            ) : (
                                                <div
                                                    className="
                                                        flex
                                                        h-11
                                                        w-11
                                                        items-center
                                                        justify-center
                                                        rounded-full
                                                        bg-blue-600
                                                        text-sm
                                                        font-bold
                                                        text-white
                                                    "
                                                >
                                                    {initials}
                                                </div>
                                            )}

                                            <div className="min-w-0">
                                                <p
                                                    className="
                                                        truncate
                                                        text-sm
                                                        font-semibold
                                                        text-slate-900
                                                        dark:text-white
                                                    "
                                                >
                                                    {userName}
                                                </p>

                                                <p
                                                    className="
                                                        mt-0.5
                                                        truncate
                                                        text-xs
                                                        text-slate-500
                                                        dark:text-slate-400
                                                    "
                                                >
                                                    {userEmail}
                                                </p>
                                            </div>
                                        </div>

                                        <div
                                            className="
                                                mt-3
                                                flex
                                                flex-wrap
                                                gap-2
                                            "
                                        >
                                            <span
                                                className="
                                                    rounded-full
                                                    bg-blue-100
                                                    px-2.5
                                                    py-1
                                                    text-[10px]
                                                    font-semibold
                                                    text-blue-700
                                                    dark:bg-blue-950/50
                                                    dark:text-blue-300
                                                "
                                            >
                                                {userRole}
                                            </span>

                                            <span
                                                className="
                                                    rounded-full
                                                    bg-slate-100
                                                    px-2.5
                                                    py-1
                                                    text-[10px]
                                                    font-medium
                                                    text-slate-600
                                                    dark:bg-slate-800
                                                    dark:text-slate-300
                                                "
                                            >
                                                Team Leader
                                            </span>
                                        </div>
                                    </div>

                                    {/* MENU */}

                                    <div className="p-2">
                                        <button
                                            type="button"
                                            onClick={
                                                handleProfile
                                            }
                                            className="
                                                flex
                                                w-full
                                                items-center
                                                gap-3
                                                rounded-lg
                                                px-3
                                                py-2.5
                                                text-left
                                                text-sm
                                                text-slate-700
                                                hover:bg-slate-100
                                                dark:text-slate-200
                                                dark:hover:bg-blue-950/50
                                            "
                                        >
                                            <UserRound className="h-4 w-4 text-slate-600 dark:text-slate-300" />

                                            <span>
                                                My Profile
                                            </span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={
                                                handleSettings
                                            }
                                            className="
                                                flex
                                                w-full
                                                items-center
                                                gap-3
                                                rounded-lg
                                                px-3
                                                py-2.5
                                                text-left
                                                text-sm
                                                text-slate-700
                                                hover:bg-slate-100
                                                dark:text-slate-200
                                                dark:hover:bg-blue-950/50
                                            "
                                        >
                                            <Settings className="h-4 w-4 text-slate-600 dark:text-slate-300" />

                                            <span>
                                                Settings
                                            </span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={
                                                handleThemeToggle
                                            }
                                            className="
                                                flex
                                                w-full
                                                items-center
                                                gap-3
                                                rounded-lg
                                                px-3
                                                py-2.5
                                                text-left
                                                text-sm
                                                text-slate-700
                                                hover:bg-slate-100
                                                dark:text-slate-200
                                                dark:hover:bg-blue-950/50
                                                sm:hidden
                                            "
                                        >
                                            {isDarkMode ? (
                                                <Sun className="h-4 w-4 text-amber-500" />
                                            ) : (
                                                <Moon className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                                            )}

                                            <span>
                                                {isDarkMode
                                                    ? "Light Mode"
                                                    : "Dark Mode"}
                                            </span>
                                        </button>

                                        <div
                                            className="
                                                my-2
                                                border-t
                                                border-slate-200
                                                dark:border-blue-900/70
                                            "
                                        />

                                        <button
                                            type="button"
                                            onClick={
                                                handleLogout
                                            }
                                            className="
                                                flex
                                                w-full
                                                items-center
                                                gap-3
                                                rounded-lg
                                                px-3
                                                py-2.5
                                                text-left
                                                text-sm
                                                font-medium
                                                text-red-600
                                                hover:bg-red-50
                                                dark:text-red-400
                                                dark:hover:bg-red-950/30
                                            "
                                        >
                                            <LogOut className="h-4 w-4" />

                                            <span>
                                                Sign Out
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ========================================================
                    MOBILE SEARCH
                ======================================================== */}

                {mobileSearchOpen && (
                    <div
                        className="
                            border-t
                            border-slate-200
                            px-4
                            py-3
                            md:hidden
                            dark:border-blue-900/70
                        "
                    >
                        <form
                            onSubmit={
                                handleSearchSubmit
                            }
                        >
                            <div className="relative">
                                <Search
                                    className="
                                        pointer-events-none
                                        absolute
                                        left-3
                                        top-1/2
                                        h-4
                                        w-4
                                        -translate-y-1/2
                                        text-slate-500
                                        dark:text-slate-400
                                    "
                                />

                                <input
                                    autoFocus
                                    type="search"
                                    value={searchValue}
                                    onChange={(event) =>
                                        setSearchValue(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Search..."
                                    className="
                                        h-10
                                        w-full
                                        rounded-lg
                                        border
                                        border-slate-200
                                        bg-slate-50
                                        pl-9
                                        pr-3
                                        text-sm
                                        text-slate-800
                                        outline-none
                                        focus:border-blue-400
                                        focus:ring-2
                                        focus:ring-blue-100
                                        dark:border-blue-900/70
                                        dark:bg-[#132f52]
                                        dark:text-white
                                    "
                                />
                            </div>
                        </form>
                    </div>
                )}
            </header>

            {/* ========================================================
                BACKDROP FOR DROPDOWN MENUS
            ======================================================== */}

            {(notificationsOpen ||
                profileOpen) && (
                <button
                    type="button"
                    aria-label="Close menu"
                    onClick={() => {
                        setNotificationsOpen(
                            false
                        );

                        setProfileOpen(false);
                    }}
                    className="
                        fixed
                        inset-0
                        z-30
                        cursor-default
                        bg-transparent
                    "
                />
            )}
        </>
    );
}

export default TeamLeaderNavbar;
