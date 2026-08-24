import {
    Bell,
    ChevronRight,
    Settings,
    ShieldCheck,
    SlidersHorizontal,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import {
    Card,
    CardContent,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

// ============================================================
// SETTINGS COMPONENTS
// ============================================================

import NotificationSettings from "@/components/admin/system-administration/NotificationSettings.jsx";
import SecuritySettings from "@/components/admin/system-administration/SecuritySettings.jsx";
import SystemSettings from "@/components/admin/system-administration/SystemSettings.jsx";

// ============================================================
// SYSTEM ADMINISTRATION
// ============================================================

function SystemAdministration() {
    const navigate = useNavigate();

    // ============================================================
    // ADMINISTRATION MODULES
    // ============================================================

    const administrationItems = [
        {
            id: "system-settings",
            title: "System Settings",
            description:
                "Configure system name, language, date and time format, user registration, session timeout, file upload limits, and maintenance mode.",
            icon: Settings,
            path: "/admin/system/settings",
            status: "Available",
            useCase: "SYS-001",
            component: SystemSettings,
        },

        {
            id: "notification-settings",
            title: "Notification Settings",
            description:
                "Configure notification delivery channels, task alerts, project reminders, sprint updates, AI alerts, and user activity notifications.",
            icon: Bell,
            path: "/admin/system/notifications",
            status: "Available",
            useCase: "SYS-002",
            component: NotificationSettings,
        },

        {
            id: "security-settings",
            title: "Security Settings",
            description:
                "Configure password policies, login protection, account lockout, session security, two-factor authentication, and API security.",
            icon: ShieldCheck,
            path: "/admin/system/security",
            status: "Available",
            useCase: "SYS-003",
            component: SecuritySettings,
        },
    ];

    // ============================================================
    // OPEN CONFIGURATION PAGE
    // ============================================================

    const handleOpen = (path) => {
        navigate(path);
    };

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <div className="min-h-full space-y-6 p-4 md:p-6">

            {/* ====================================================
                PAGE HEADER
            ==================================================== */}

            <div
                className="
                    flex
                    flex-col
                    gap-4
                    rounded-2xl
                    border
                    border-border
                    bg-card
                    p-5
                    shadow-sm
                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                "
            >

                <div className="flex items-start gap-4">

                    {/* Page Icon */}

                    <div
                        className="
                            flex
                            h-12
                            w-12
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-primary
                            text-primary-foreground
                            shadow-sm
                        "
                    >
                        <SlidersHorizontal className="h-6 w-6" />
                    </div>

                    {/* Title */}

                    <div>

                        <h1
                            className="
                                text-2xl
                                font-bold
                                tracking-tight
                                text-foreground
                            "
                        >
                            System Administration
                        </h1>

                        <p
                            className="
                                mt-1
                                max-w-2xl
                                text-sm
                                leading-6
                                text-muted-foreground
                            "
                        >
                            Manage system configuration, notifications,
                            security, and administrative settings.
                        </p>

                    </div>

                </div>

                {/* Administrator Badge */}

                <Badge
                    variant="outline"
                    className="
                        w-fit
                        gap-1.5
                        px-3
                        py-1.5
                    "
                >
                    <ShieldCheck className="h-3.5 w-3.5" />

                    Administrator
                </Badge>

            </div>

            {/* ====================================================
                CONFIGURATION CENTER
            ==================================================== */}

            <Card
                className="
                    border-border
                    bg-card
                    shadow-sm
                "
            >

                <CardContent className="p-5">

                    <div className="flex items-start gap-4">

                        <div
                            className="
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                border
                                border-border
                                bg-muted
                            "
                        >
                            <Settings className="h-5 w-5 text-foreground" />
                        </div>

                        <div>

                            <h2
                                className="
                                    text-base
                                    font-semibold
                                    text-foreground
                                "
                            >
                                Configuration Center
                            </h2>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    leading-6
                                    text-muted-foreground
                                "
                            >
                                Manage the main configuration areas of
                                the AI-PMS. Select a module below to
                                configure its settings.
                            </p>

                        </div>

                    </div>

                </CardContent>

            </Card>

            {/* ====================================================
                ADMINISTRATION MODULES
            ==================================================== */}

            <section>

                <div className="mb-4">

                    <h2
                        className="
                            text-lg
                            font-semibold
                            text-foreground
                        "
                    >
                        Administration Modules
                    </h2>

                    <p
                        className="
                            mt-1
                            text-sm
                            text-muted-foreground
                        "
                    >
                        Select a configuration area to manage.
                    </p>

                </div>

                {/* Module Cards */}

                <div className="grid gap-5 lg:grid-cols-3">

                    {administrationItems.map((item) => {

                        const Icon = item.icon;

                        return (
                            <Card
                                key={item.id}
                                role="button"
                                tabIndex={0}
                                onClick={() =>
                                    handleOpen(item.path)
                                }
                                onKeyDown={(event) => {

                                    if (
                                        event.key === "Enter" ||
                                        event.key === " "
                                    ) {
                                        event.preventDefault();
                                        handleOpen(item.path);
                                    }

                                }}
                                className="
                                    group
                                    cursor-pointer
                                    border-border
                                    bg-card
                                    shadow-sm
                                    transition-all
                                    duration-200
                                    hover:-translate-y-1
                                    hover:border-primary/50
                                    hover:shadow-lg
                                    focus-visible:outline-none
                                    focus-visible:ring-2
                                    focus-visible:ring-primary
                                    focus-visible:ring-offset-2
                                "
                            >

                                <CardContent className="p-5">

                                    {/* Icon + Status */}

                                    <div
                                        className="
                                            flex
                                            items-start
                                            justify-between
                                            gap-3
                                        "
                                    >

                                        <div
                                            className="
                                                flex
                                                h-12
                                                w-12
                                                items-center
                                                justify-center
                                                rounded-xl
                                                border
                                                border-border
                                                bg-muted
                                                transition-all
                                                duration-200
                                                group-hover:border-primary/30
                                                group-hover:bg-primary/10
                                            "
                                        >
                                            <Icon
                                                className="
                                                    h-6
                                                    w-6
                                                    text-foreground
                                                    transition-transform
                                                    duration-200
                                                    group-hover:scale-110
                                                "
                                            />
                                        </div>

                                        <Badge
                                            variant="outline"
                                            className="
                                                border-green-500/30
                                                bg-green-500/5
                                                text-green-700
                                                dark:text-green-400
                                            "
                                        >
                                            {item.status}
                                        </Badge>

                                    </div>

                                    {/* Use Case */}

                                    <div className="mt-5">

                                        <Badge
                                            variant="secondary"
                                            className="text-xs"
                                        >
                                            {item.useCase}
                                        </Badge>

                                    </div>

                                    {/* Title */}

                                    <h3
                                        className="
                                            mt-3
                                            text-base
                                            font-semibold
                                            text-foreground
                                            transition-colors
                                            group-hover:text-primary
                                        "
                                    >
                                        {item.title}
                                    </h3>

                                    {/* Description */}

                                    <p
                                        className="
                                            mt-2
                                            min-h-[96px]
                                            text-sm
                                            leading-6
                                            text-muted-foreground
                                        "
                                    >
                                        {item.description}
                                    </p>

                                    {/* Configure */}

                                    <div
                                        className="
                                            mt-5
                                            flex
                                            items-center
                                            text-sm
                                            font-medium
                                            text-foreground
                                            transition-colors
                                            group-hover:text-primary
                                        "
                                    >
                                        Configure

                                        <ChevronRight
                                            className="
                                                ml-1
                                                h-4
                                                w-4
                                                transition-transform
                                                duration-200
                                                group-hover:translate-x-1
                                            "
                                        />
                                    </div>

                                </CardContent>

                            </Card>
                        );
                    })}

                </div>

            </section>

            {/* ====================================================
                CONFIGURATION RULES
            ==================================================== */}

            <Card
                className="
                    border-border
                    bg-card
                    shadow-sm
                "
            >

                <CardContent className="p-5">

                    <div className="flex items-start gap-4">

                        <div
                            className="
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                border
                                border-border
                                bg-muted
                            "
                        >
                            <ShieldCheck className="h-5 w-5 text-foreground" />
                        </div>

                        <div>

                            <h2
                                className="
                                    text-base
                                    font-semibold
                                    text-foreground
                                "
                            >
                                Configuration Rules
                            </h2>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    leading-6
                                    text-muted-foreground
                                "
                            >
                                Only authorized administrators can
                                modify system configuration. Changes
                                must be validated before application
                                and recorded in the audit log.
                            </p>

                        </div>

                    </div>

                </CardContent>

            </Card>

            {/* ====================================================
                USE CASE SUMMARY
            ==================================================== */}

            <section>

                <div className="mb-4">

                    <h2
                        className="
                            text-lg
                            font-semibold
                            text-foreground
                        "
                    >
                        Use Case Summary
                    </h2>

                    <p
                        className="
                            mt-1
                            text-sm
                            text-muted-foreground
                        "
                    >
                        System administration functions included
                        in the AI-PMS.
                    </p>

                </div>

                <div className="grid gap-4 md:grid-cols-3">

                    {/* SYS-001 */}

                    <Card
                        className="
                            border-border
                            bg-card
                            shadow-sm
                            transition-shadow
                            hover:shadow-md
                        "
                    >

                        <CardContent className="p-5">

                            <Badge
                                variant="secondary"
                                className="text-xs"
                            >
                                SYS-001
                            </Badge>

                            <h3
                                className="
                                    mt-3
                                    font-semibold
                                    text-foreground
                                "
                            >
                                Configure System Settings
                            </h3>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    leading-5
                                    text-muted-foreground
                                "
                            >
                                General system configuration.
                            </p>

                        </CardContent>

                    </Card>

                    {/* SYS-002 */}

                    <Card
                        className="
                            border-border
                            bg-card
                            shadow-sm
                            transition-shadow
                            hover:shadow-md
                        "
                    >

                        <CardContent className="p-5">

                            <Badge
                                variant="secondary"
                                className="text-xs"
                            >
                                SYS-002
                            </Badge>

                            <h3
                                className="
                                    mt-3
                                    font-semibold
                                    text-foreground
                                "
                            >
                                Manage Notification Settings
                            </h3>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    leading-5
                                    text-muted-foreground
                                "
                            >
                                Notification and delivery configuration.
                            </p>

                        </CardContent>

                    </Card>

                    {/* SYS-003 */}

                    <Card
                        className="
                            border-border
                            bg-card
                            shadow-sm
                            transition-shadow
                            hover:shadow-md
                        "
                    >

                        <CardContent className="p-5">

                            <Badge
                                variant="secondary"
                                className="text-xs"
                            >
                                SYS-003
                            </Badge>

                            <h3
                                className="
                                    mt-3
                                    font-semibold
                                    text-foreground
                                "
                            >
                                Manage Security Settings
                            </h3>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    leading-5
                                    text-muted-foreground
                                "
                            >
                                Security and access configuration.
                            </p>

                        </CardContent>

                    </Card>

                </div>

            </section>

        </div>
    );
}

export default SystemAdministration;