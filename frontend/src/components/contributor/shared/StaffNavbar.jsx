import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Bell,
    ChevronDown,
    Menu,
    Search,
    ShieldCheck,
    X,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import ThemeToggle from "@/components/common/ThemeToggle";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

/* ============================================================
   STORAGE HELPERS
============================================================ */

const USER_STORAGE_KEYS = [
    "user",
    "aipms_user",
    "currentUser",
    "authUser",
];

/* ============================================================
   GET STORED USER
============================================================ */

function getStoredUser() {
    if (typeof window === "undefined") {
        return null;
    }

    for (const key of USER_STORAGE_KEYS) {
        try {
            const storedUser = localStorage.getItem(key);

            if (!storedUser) {
                continue;
            }

            const parsedUser = JSON.parse(storedUser);

            if (
                parsedUser &&
                typeof parsedUser === "object"
            ) {
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

/* ============================================================
   DEFAULT STAFF USER
============================================================ */

const DEFAULT_USER = {
    id: null,
    fullName: "Staff",
    name: "Staff",
    email: "staff@example.com",
    role: "Staff",
    accountCategory: "Staff",
    avatar: null,
};

/* ============================================================
   USER HELPERS
============================================================ */

function getUserName(user) {
    return (
        user?.fullName ||
        user?.name ||
        user?.username ||
        user?.displayName ||
        "Staff"
    );
}

function getInitials(name) {
    if (!name) {
        return "ST";
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

/* ============================================================
   STAFF NAVBAR
============================================================ */

function StaffNavbar({
    onMenuClick,
    sidebarOpen = false,
    onToggleSidebar,
}) {
    const navigate = useNavigate();

    /* ========================================================
       USER
    ======================================================== */

    const [user] = useState(
        () => getStoredUser() || DEFAULT_USER
    );

    /* ========================================================
       SEARCH
    ======================================================== */

    const [searchValue, setSearchValue] = useState("");
    const [mobileSearchOpen, setMobileSearchOpen] =
        useState(false);

    /* ========================================================
       NOTIFICATIONS
    ======================================================== */

    const [notificationsOpen, setNotificationsOpen] =
        useState(false);

    /* ========================================================
       USER INFORMATION
    ======================================================== */

    const userName = useMemo(
        () => getUserName(user),
        [user]
    );

    const initials = useMemo(
        () => getInitials(userName),
        [userName]
    );

    /* ========================================================
       SEARCH HANDLER
    ======================================================== */

    const handleSearchSubmit = (event) => {
        event.preventDefault();

        const query = searchValue.trim();

        if (!query) {
            return;
        }

        console.log("Staff search:", query);
    };

    /* ========================================================
       NOTIFICATIONS
    ======================================================== */

    const notifications = [
        {
            id: 1,
            title: "Task update",
            message:
                "You have new tasks or work updates to review.",
            time: "Recently",
            unread: true,
        },
        {
            id: 2,
            title: "Task reminder",
            message:
                "One of your assigned tasks is approaching its deadline.",
            time: "Today",
            unread: true,
        },
        {
            id: 3,
            title: "Project update",
            message:
                "There are project updates available for you.",
            time: "Today",
            unread: false,
        },
    ];

    const unreadNotificationCount =
        notifications.filter(
            (notification) => notification.unread
        ).length;

    /* ========================================================
       SIDEBAR HANDLER
    ======================================================== */

    const handleSidebarToggle = () => {
        if (onMenuClick) {
            onMenuClick();
            return;
        }

        if (onToggleSidebar) {
            onToggleSidebar();
        }
    };

    /* ========================================================
       RENDER
    ======================================================== */

    return (
        <>
            {/* ==================================================
                NAVBAR
            ================================================== */}

            <header
                className="
                    sticky
                    top-0
                    z-40
                    flex
                    h-20
                    items-center
                    justify-between
                    border-b
                    border-border
                    bg-background
                    px-6
                    text-foreground
                    lg:px-8
                "
            >
                {/* =================================================
                    LEFT SIDE
                ================================================== */}

                <div className="relative flex w-full max-w-md items-center">

                    {/* MOBILE MENU */}

                    <button
                        type="button"
                        onClick={handleSidebarToggle}
                        className="
                            mr-4
                            text-foreground
                            md:hidden
                        "
                        aria-label={
                            sidebarOpen
                                ? "Close sidebar"
                                : "Open sidebar"
                        }
                    >
                        {sidebarOpen ? (
                            <X size={24} />
                        ) : (
                            <Menu size={24} />
                        )}
                    </button>

                    {/* STAFF BRAND */}

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/staff")
                        }
                        className="
                            mr-4
                            hidden
                            shrink-0
                            items-center
                            gap-2
                            sm:flex
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
                                bg-primary
                                text-primary-foreground
                                shadow-sm
                            "
                        >
                            <ShieldCheck className="h-5 w-5" />
                        </div>

                        <div className="text-left">
                            <p
                                className="
                                    text-sm
                                    font-bold
                                    leading-tight
                                    text-foreground
                                "
                            >
                                AI-PMS
                            </p>

                            <p
                                className="
                                    text-[10px]
                                    font-medium
                                    text-muted-foreground
                                "
                            >
                                Staff Portal
                            </p>
                        </div>
                    </button>

                    {/* DESKTOP SEARCH */}

                    <div className="relative w-full">
                        <Search
                            className="
                                pointer-events-none
                                absolute
                                left-3
                                top-1/2
                                h-4
                                w-4
                                -translate-y-1/2
                                text-muted-foreground
                            "
                        />

                        <Input
                            type="text"
                            value={searchValue}
                            onChange={(event) =>
                                setSearchValue(
                                    event.target.value
                                )
                            }
                            onKeyDown={(event) => {
                                if (
                                    event.key ===
                                    "Enter"
                                ) {
                                    handleSearchSubmit(
                                        event
                                    );
                                }
                            }}
                            placeholder="Search tasks, projects..."
                            className="
                                hidden
                                h-10
                                w-full
                                border-border
                                bg-muted/50
                                pl-10
                                pr-4
                                text-sm
                                text-foreground
                                placeholder:text-muted-foreground
                                focus-visible:ring-2
                                focus-visible:ring-primary
                                md:block
                            "
                        />
                    </div>
                </div>

                {/* =================================================
                    RIGHT SIDE
                ================================================== */}

                <div className="ml-4 flex items-center gap-2">

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
                            h-10
                            w-10
                            rounded-full
                            text-foreground
                            transition-all
                            duration-200
                            hover:bg-muted
                            hover:text-primary
                            md:hidden
                        "
                        aria-label="Search"
                    >
                        <Search className="h-5 w-5" />
                    </Button>

                    {/* NOTIFICATIONS */}

                    <div className="relative">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                                setNotificationsOpen(
                                    (current) =>
                                        !current
                                )
                            }
                            className="
                                relative
                                h-10
                                w-10
                                rounded-full
                                text-foreground
                                transition-all
                                duration-200
                                hover:bg-muted
                                hover:text-primary
                            "
                            aria-label="Notifications"
                        >
                            <Bell className="h-5 w-5 text-muted-foreground" />

                            {unreadNotificationCount >
                                0 && (
                                <span
                                    className="
                                        absolute
                                        right-2
                                        top-2
                                        h-2
                                        w-2
                                        rounded-full
                                        bg-red-500
                                        ring-2
                                        ring-background
                                    "
                                />
                            )}
                        </Button>

                        {/* NOTIFICATION DROPDOWN */}

                        {notificationsOpen && (
                            <div
                                className="
                                    absolute
                                    right-0
                                    z-50
                                    mt-2
                                    w-[320px]
                                    overflow-hidden
                                    rounded-xl
                                    border
                                    border-border
                                    bg-background
                                    shadow-xl
                                "
                            >
                                {/* HEADER */}

                                <div
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        border-b
                                        border-border
                                        px-4
                                        py-3
                                    "
                                >
                                    <div>
                                        <p
                                            className="
                                                text-sm
                                                font-semibold
                                                text-foreground
                                            "
                                        >
                                            Notifications
                                        </p>

                                        <p
                                            className="
                                                mt-0.5
                                                text-xs
                                                text-muted-foreground
                                            "
                                        >
                                            Your work updates
                                        </p>
                                    </div>

                                    <span
                                        className="
                                            rounded-full
                                            bg-primary/10
                                            px-2
                                            py-1
                                            text-[10px]
                                            font-semibold
                                            text-primary
                                        "
                                    >
                                        {
                                            unreadNotificationCount
                                        }{" "}
                                        new
                                    </span>
                                </div>

                                {/* NOTIFICATION LIST */}

                                <div className="max-h-[350px] overflow-y-auto">
                                    {notifications.map(
                                        (
                                            notification
                                        ) => (
                                            <button
                                                type="button"
                                                key={
                                                    notification.id
                                                }
                                                className="
                                                    flex
                                                    w-full
                                                    gap-3
                                                    border-b
                                                    border-border
                                                    px-4
                                                    py-3
                                                    text-left
                                                    transition-colors
                                                    hover:bg-muted/50
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
                                                                ? "bg-primary"
                                                                : "bg-muted-foreground/30"
                                                        }
                                                    `}
                                                />

                                                <div className="min-w-0">
                                                    <p
                                                        className="
                                                            text-xs
                                                            font-semibold
                                                            text-foreground
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
                                                            text-muted-foreground
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
                                                            text-muted-foreground
                                                        "
                                                    >
                                                        {
                                                            notification.time
                                                        }
                                                    </p>
                                                </div>
                                            </button>
                                        )
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* THEME */}

                    <ThemeToggle />

                    {/* USER PROFILE */}

                    <Button
                        type="button"
                        variant="ghost"
                        className="
                            h-12
                            rounded-lg
                            px-2
                            text-foreground
                            transition-all
                            duration-200
                            hover:bg-muted
                        "
                    >
                        <div className="flex items-center gap-3">

                            {/* AVATAR */}

                            <Avatar className="h-10 w-10">
                                {user?.avatar && (
                                    <AvatarImage
                                        src={user.avatar}
                                        alt={userName}
                                    />
                                )}

                                <AvatarFallback
                                    className="
                                        bg-primary
                                        font-semibold
                                        text-primary-foreground
                                    "
                                >
                                    {initials}
                                </AvatarFallback>
                            </Avatar>

                            {/* USER INFO */}

                            <div
                                className="
                                    hidden
                                    flex-col
                                    items-start
                                    sm:flex
                                "
                            >
                                <span
                                    className="
                                        max-w-[130px]
                                        truncate
                                        text-sm
                                        font-semibold
                                        text-foreground
                                    "
                                >
                                    {userName}
                                </span>

                                <span
                                    className="
                                        max-w-[130px]
                                        truncate
                                        text-xs
                                        text-muted-foreground
                                    "
                                >
                                    Staff
                                </span>
                            </div>

                            {/* CHEVRON */}

                            <ChevronDown
                                className="
                                    hidden
                                    h-4
                                    w-4
                                    text-muted-foreground
                                    sm:block
                                "
                            />
                        </div>
                    </Button>
                </div>
            </header>

            {/* ==================================================
                MOBILE SEARCH
            ================================================== */}

            {mobileSearchOpen && (
                <div
                    className="
                        border-b
                        border-border
                        bg-background
                        px-4
                        py-3
                        md:hidden
                    "
                >
                    <form
                        onSubmit={handleSearchSubmit}
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
                                    text-muted-foreground
                                "
                            />

                            <Input
                                autoFocus
                                type="search"
                                value={searchValue}
                                onChange={(event) =>
                                    setSearchValue(
                                        event.target.value
                                    )
                                }
                                placeholder="Search tasks, projects..."
                                className="
                                    h-10
                                    w-full
                                    border-border
                                    bg-muted/50
                                    pl-10
                                    pr-4
                                    text-sm
                                    text-foreground
                                    placeholder:text-muted-foreground
                                    focus-visible:ring-2
                                    focus-visible:ring-primary
                                "
                            />
                        </div>
                    </form>
                </div>
            )}

            {/* ==================================================
                CLOSE NOTIFICATION DROPDOWN
            ================================================== */}

            {notificationsOpen && (
                <button
                    type="button"
                    aria-label="Close notifications"
                    onClick={() =>
                        setNotificationsOpen(false)
                    }
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

export default StaffNavbar;