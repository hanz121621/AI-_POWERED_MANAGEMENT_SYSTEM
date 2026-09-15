
// ============================================================
// AIPMS - MANAGER NAVBAR
// ============================================================

import {
    Menu,
    Search,
    Bell,
    ChevronDown,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { Input } from "@/components/ui/input";
import ThemeToggle from "@/components/common/ThemeToggle";

import {
    Avatar,
    AvatarFallback,
} from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

// ============================================================
// COMPONENT
// ============================================================

function ManagerNavbar({ onToggleSidebar }) {
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
            {/* ==================================================
                LEFT SIDE - SEARCH
            ================================================== */}

            <div className="relative flex w-full max-w-md items-center">

                {/* Mobile Menu */}
                <button
                    type="button"
                    onClick={onToggleSidebar}
                    className="mr-4 text-foreground md:hidden"
                    aria-label="Open sidebar"
                    title="Open sidebar"
                >
                    <Menu size={24} />
                </button>

                {/* Search */}
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
                        placeholder="Search projects, teams..."
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
            </div>

            {/* ==================================================
                RIGHT SIDE
            ================================================== */}

            <div className="ml-4 flex items-center gap-2">

                {/* Notifications */}
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleNotificationsClick}
                    aria-label="Open notifications"
                    title="Notifications"
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
                >
                    <Bell className="h-5 w-5 text-muted-foreground" />

                    {/* Notification indicator */}
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
                </Button>

                {/* Theme */}
                <ThemeToggle />

                {/* Manager Profile */}
                <Button
                    type="button"
                    variant="ghost"
                    onClick={handleProfileClick}
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

                        {/* Avatar */}
                        <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary font-semibold text-primary-foreground">
                                M
                            </AvatarFallback>
                        </Avatar>

                        {/* Manager Information */}
                        <div className="hidden flex-col items-start sm:flex">
                            <span className="text-sm font-semibold text-foreground">
                                Manager
                            </span>

                            <span className="text-xs text-muted-foreground">
                                Project Manager
                            </span>
                        </div>

                        {/* Dropdown indicator */}
                        <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />

                    </div>
                </Button>

            </div>
        </header>
    );
}

export default ManagerNavbar;