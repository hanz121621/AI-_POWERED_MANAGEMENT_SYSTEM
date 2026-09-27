
import { useState } from "react";

import {
    Menu,
    Search,
    Bell,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import ThemeToggle from "@/components/common/ThemeToggle";

import {
    Avatar,
    AvatarFallback,
} from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

function DeveloperNavbar({ onToggleSidebar }) {
    const [searchValue, setSearchValue] = useState("");
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

    const handleSearchSubmit = (event) => {
        event.preventDefault();

        const query = searchValue.trim();

        if (!query) {
            return;
        }

        console.log("Developer search:", query);
    };

    const notifications = [
        {
            id: 1,
            title: "Task update",
            message:
                "You have new development tasks or work updates to review.",
            time: "Recently",
            unread: true,
        },
        {
            id: 2,
            title: "Code review",
            message:
                "A task or development work may require your review.",
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

    const unreadNotificationCount = notifications.filter(
        (notification) => notification.unread
    ).length;

    return (
        <>
            {/* =========================================================
                DEVELOPER NAVBAR
            ========================================================= */}
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
                {/* =====================================================
                    LEFT SIDE - MOBILE MENU + SEARCH
                ===================================================== */}
                <div className="relative flex w-full max-w-md items-center">
                    <button
                        type="button"
                        onClick={onToggleSidebar}
                        className="
                            mr-4
                            text-foreground
                            md:hidden
                        "
                        aria-label="Open developer sidebar"
                    >
                        <Menu size={24} />
                    </button>

                    {/* Desktop Search */}
                    <form
                        onSubmit={handleSearchSubmit}
                        className="relative w-full"
                    >
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
                                setSearchValue(event.target.value)
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
                    </form>
                </div>

                {/* =====================================================
                    RIGHT SIDE
                ===================================================== */}
                <div className="ml-4 flex items-center gap-2">

                    {/* Mobile Search Button */}
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                            setMobileSearchOpen(
                                (current) => !current
                            )
                        }
                        className="
                            text-foreground
                            hover:bg-muted
                            md:hidden
                        "
                        aria-label="Search"
                    >
                        <Search className="h-5 w-5" />
                    </Button>

                    {/* =================================================
                        NOTIFICATIONS
                    ================================================= */}
                    <div className="relative">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                                setNotificationsOpen(
                                    (current) => !current
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

                            {unreadNotificationCount > 0 && (
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

                        {/* Notification Dropdown */}
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
                                        <p className="text-sm font-semibold text-foreground">
                                            Notifications
                                        </p>

                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                            Development and project updates
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
                                        {unreadNotificationCount} new
                                    </span>
                                </div>

                                <div className="max-h-[350px] overflow-y-auto">
                                    {notifications.map(
                                        (notification) => (
                                            <button
                                                type="button"
                                                key={notification.id}
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
                                                    hover:bg-muted
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
                                                    <p className="text-xs font-semibold text-foreground">
                                                        {notification.title}
                                                    </p>

                                                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                                        {notification.message}
                                                    </p>

                                                    <p className="mt-1 text-[10px] text-muted-foreground">
                                                        {notification.time}
                                                    </p>
                                                </div>
                                            </button>
                                        )
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* =================================================
                        THEME TOGGLE
                    ================================================= */}
                    <ThemeToggle />

                    {/* =================================================
                        DEVELOPER USER DISPLAY
                        NO DROPDOWN
                    ================================================= */}
                    <div className="flex items-center gap-3 px-2">
                        <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary font-semibold text-primary-foreground">
                                NB
                            </AvatarFallback>
                        </Avatar>

                        <div className="hidden flex-col items-start sm:flex">
                            <span className="text-sm font-semibold text-foreground">
                                Nati Beletu
                            </span>

                            <span className="text-xs text-muted-foreground">
                                Developer
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* =========================================================
                MOBILE SEARCH
            ========================================================= */}
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
                    <form onSubmit={handleSearchSubmit}>
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
                                type="text"
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

            {/* =========================================================
                NOTIFICATION BACKDROP
            ========================================================= */}
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

export default DeveloperNavbar;


