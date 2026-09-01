import { useMemo, useState } from "react";

import {
    AlertCircle,
    Bell,
    CheckCircle2,
    Clock3,
    FileText,
    Flag,
    Loader2,
    Mail,
    MessageSquare,
    Paperclip,
    RefreshCw,
    Send,
    ShieldCheck,
    UserRound,
    Users,
    XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";

/* ============================================================
   CONT-LEADER-005
   COMMUNICATE WITH MANAGER

   Team Leader can:
   - Select assigned Manager
   - View Manager information
   - Report team progress
   - Report blockers
   - Report delays
   - Report dependencies
   - Send important team updates
   - Validate messages
   - View communication history
   - Retry failed messages

   Team Leader CANNOT:
   - Change project ownership
   - Assign users to teams
   - Change contributor types
   - Change specializations
   - Approve final work
   - Override Manager decisions
============================================================ */

/* ============================================================
   MESSAGE TYPES
============================================================ */

const MESSAGE_TYPES = {
    PROGRESS: "Team Progress",
    BLOCKER: "Blocker",
    DELAY: "Delay",
    DEPENDENCY: "Dependency",
    UPDATE: "Important Team Update",
};

/* ============================================================
   PRIORITY
============================================================ */

const PRIORITIES = {
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High",
    URGENT: "Urgent",
};

/* ============================================================
   DEMO MANAGER
   ------------------------------------------------------------
   Replace with:
   GET /api/teams/my-team/manager

   or your actual backend endpoint.
============================================================ */

const DEMO_MANAGER = {
    id: 101,
    userId: 101,
    fullName: "Project Manager",
    email: "manager@example.com",
    phone: "+251 900 000 100",
    role: "Manager",
    department: "Project Management",
    availabilityStatus: "Available",
};

/* ============================================================
   DEMO COMMUNICATION HISTORY
   ------------------------------------------------------------
   Replace with backend data later.
============================================================ */

const DEMO_MESSAGES = [
    {
        id: 1,
        type: MESSAGE_TYPES.PROGRESS,
        priority: PRIORITIES.MEDIUM,
        subject: "Team Progress Update",
        message:
            "The team has completed the current dashboard tasks and is continuing with the remaining sprint work.",
        sender: "Team Leader",
        recipient: "Project Manager",
        createdAt: "2026-08-24T09:30:00",
        status: "Delivered",
    },
    {
        id: 2,
        type: MESSAGE_TYPES.BLOCKER,
        priority: PRIORITIES.HIGH,
        subject: "Backend API Blocker",
        message:
            "The team is waiting for the required backend endpoint before completing the integration task.",
        sender: "Team Leader",
        recipient: "Project Manager",
        createdAt: "2026-08-23T14:15:00",
        status: "Delivered",
    },
];

/* ============================================================
   HELPERS
============================================================ */

function getInitials(name) {
    if (!name) {
        return "M";
    }

    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("");
}

function formatDateTime(value) {
    if (!value) {
        return "Not specified";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString();
}

function getPriorityClass(priority) {
    switch (priority) {
        case PRIORITIES.URGENT:
            return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400";

        case PRIORITIES.HIGH:
            return "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400";

        case PRIORITIES.MEDIUM:
            return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400";

        default:
            return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
    }
}

function getMessageTypeClass(type) {
    switch (type) {
        case MESSAGE_TYPES.BLOCKER:
            return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400";

        case MESSAGE_TYPES.DELAY:
            return "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400";

        case MESSAGE_TYPES.DEPENDENCY:
            return "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400";

        case MESSAGE_TYPES.PROGRESS:
            return "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400";

        default:
            return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400";
    }
}

function getMessageTypeIcon(type) {
    switch (type) {
        case MESSAGE_TYPES.BLOCKER:
            return <AlertCircle className="h-4 w-4" />;

        case MESSAGE_TYPES.DELAY:
            return <Clock3 className="h-4 w-4" />;

        case MESSAGE_TYPES.DEPENDENCY:
            return <Flag className="h-4 w-4" />;

        case MESSAGE_TYPES.PROGRESS:
            return <CheckCircle2 className="h-4 w-4" />;

        default:
            return <MessageSquare className="h-4 w-4" />;
    }
}

/* ============================================================
   COMPONENT
============================================================ */

function CommunicateWithManager({
    manager: managerProp = null,
    messages: messagesProp = null,
    loading: externalLoading = false,
    error: externalError = null,
    onSendMessage,
    onRetry,
}) {
    /* ========================================================
       MANAGER
    ======================================================== */

    const [manager] = useState(
        managerProp || DEMO_MANAGER
    );

    /* ========================================================
       MESSAGE HISTORY
    ======================================================== */

    const [messages, setMessages] = useState(
        messagesProp || DEMO_MESSAGES
    );

    /* ========================================================
       FORM STATE
    ======================================================== */

    const [messageType, setMessageType] = useState(
        MESSAGE_TYPES.PROGRESS
    );

    const [priority, setPriority] = useState(
        PRIORITIES.MEDIUM
    );

    const [subject, setSubject] = useState("");

    const [message, setMessage] = useState("");

    const [attachment, setAttachment] =
        useState(null);

    /* ========================================================
       UI STATE
    ======================================================== */

    const [isSending, setIsSending] =
        useState(false);

    const [isRetrying, setIsRetrying] =
        useState(false);

    const [error, setError] =
        useState(externalError);

    const [successMessage, setSuccessMessage] =
        useState("");

    const [validationError, setValidationError] =
        useState("");

    /* ========================================================
       CHARACTER COUNT
    ======================================================== */

    const characterCount = message.length;

    const remainingCharacters = 2000 - characterCount;

    /* ========================================================
       MESSAGE STATISTICS
    ======================================================== */

    const statistics = useMemo(() => {
        const history = messages || [];

        return {
            total: history.length,

            progress: history.filter(
                (item) =>
                    item.type ===
                    MESSAGE_TYPES.PROGRESS
            ).length,

            blockers: history.filter(
                (item) =>
                    item.type ===
                    MESSAGE_TYPES.BLOCKER
            ).length,

            delays: history.filter(
                (item) =>
                    item.type ===
                    MESSAGE_TYPES.DELAY
            ).length,

            dependencies: history.filter(
                (item) =>
                    item.type ===
                    MESSAGE_TYPES.DEPENDENCY
            ).length,
        };
    }, [messages]);

    /* ========================================================
       VALIDATE FORM
    ======================================================== */

    const validateForm = () => {
        setValidationError("");

        if (!manager) {
            setValidationError(
                "Manager information is unavailable."
            );

            return false;
        }

        if (!subject.trim()) {
            setValidationError(
                "Subject cannot be empty."
            );

            return false;
        }

        if (!message.trim()) {
            setValidationError(
                "Message cannot be empty."
            );

            return false;
        }

        if (message.trim().length < 5) {
            setValidationError(
                "Message must contain at least 5 characters."
            );

            return false;
        }

        if (message.length > 2000) {
            setValidationError(
                "Message cannot exceed 2000 characters."
            );

            return false;
        }

        return true;
    };

    /* ========================================================
       SEND MESSAGE
    ======================================================== */

    const handleSendMessage = async (event) => {
        event.preventDefault();

        setSuccessMessage("");
        setError("");

        if (!validateForm()) {
            return;
        }

        const newMessage = {
            id: Date.now(),

            managerId:
                manager.id || manager.userId,

            type: messageType,

            priority,

            subject: subject.trim(),

            message: message.trim(),

            sender: "Team Leader",

            recipient:
                manager.fullName ||
                manager.name ||
                "Project Manager",

            createdAt:
                new Date().toISOString(),

            status: "Sending",
        };

        try {
            setIsSending(true);

            /* =================================================
               BACKEND INTEGRATION POINT

               Later:

               const response =
                   await communicationService
                       .sendMessage(newMessage);

               setMessages((previous) => [
                   response.data,
                   ...previous,
               ]);
            ================================================= */

            if (onSendMessage) {
                const response =
                    await onSendMessage(
                        newMessage
                    );

                const savedMessage =
                    response?.data ||
                    response ||
                    {
                        ...newMessage,
                        status: "Delivered",
                    };

                setMessages((previous) => [
                    savedMessage,
                    ...previous,
                ]);
            } else {
                /* =============================================
                   FRONTEND DEVELOPMENT MODE
                ============================================= */

                await new Promise(
                    (resolve) =>
                        setTimeout(
                            resolve,
                            700
                        )
                );

                setMessages((previous) => [
                    {
                        ...newMessage,
                        status: "Delivered",
                    },
                    ...previous,
                ]);
            }

            /* =================================================
               SUCCESS
            ================================================= */

            setSubject("");

            setMessage("");

            setAttachment(null);

            setPriority(
                PRIORITIES.MEDIUM
            );

            setMessageType(
                MESSAGE_TYPES.PROGRESS
            );

            setSuccessMessage(
                "Message sent successfully to the Manager."
            );
        } catch (sendError) {
            console.error(
                "Unable to send message:",
                sendError
            );

            setError(
                "Unable to send message. Please try again."
            );
        } finally {
            setIsSending(false);
        }
    };

    /* ========================================================
       ATTACHMENT
    ======================================================== */

    const handleAttachment = (event) => {
        const file =
            event.target.files?.[0];

        if (!file) {
            setAttachment(null);
            return;
        }

        /*
         * Frontend validation.
         * Backend should perform final validation.
         */

        const maxSize =
            5 * 1024 * 1024;

        if (file.size > maxSize) {
            setValidationError(
                "Attachment must be smaller than 5 MB."
            );

            setAttachment(null);

            return;
        }

        setValidationError("");

        setAttachment(file);
    };

    /* ========================================================
       RETRY
    ======================================================== */

    const handleRetry = async () => {
        if (!onRetry) {
            setIsRetrying(true);

            setTimeout(() => {
                setError("");

                setIsRetrying(false);
            }, 500);

            return;
        }

        try {
            setIsRetrying(true);

            setError("");

            await onRetry();
        } catch (retryError) {
            console.error(
                "Unable to reload communication information:",
                retryError
            );

            setError(
                "Unable to load communication information. Please try again."
            );
        } finally {
            setIsRetrying(false);
        }
    };

    /* ========================================================
       EXTERNAL LOADING
    ======================================================== */

    if (externalLoading) {
        return (
            <LoadingState />
        );
    }

    /* ========================================================
       ERROR STATE
    ======================================================== */

    if (externalError && !manager) {
        return (
            <ErrorState
                message={externalError}
                onRetry={handleRetry}
                loading={isRetrying}
            />
        );
    }

    /* ========================================================
       NO MANAGER
    ======================================================== */

    if (!manager) {
        return (
            <div
                className="
                    rounded-xl
                    border
                    border-dashed
                    border-slate-300
                    bg-white
                    p-8
                    text-center
                    dark:border-blue-900/70
                    dark:bg-[#0f2747]
                "
            >
                <UserRound
                    className="
                        mx-auto
                        h-10
                        w-10
                        text-slate-400
                    "
                />

                <h3
                    className="
                        mt-4
                        text-base
                        font-semibold
                        text-slate-800
                        dark:text-white
                    "
                >
                    Manager Unavailable
                </h3>

                <p
                    className="
                        mx-auto
                        mt-1
                        max-w-md
                        text-sm
                        text-slate-500
                        dark:text-slate-400
                    "
                >
                    No Manager is currently available
                    for communication.
                </p>
            </div>
        );
    }

    /* ========================================================
       MAIN UI
    ======================================================== */

    return (
        <div className="space-y-5">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div
                className="
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    p-5
                    dark:border-blue-900/70
                    dark:bg-[#0f2747]
                "
            >
                <div
                    className="
                        flex
                        flex-col
                        gap-4
                        md:flex-row
                        md:items-center
                        md:justify-between
                    "
                >
                    <div className="flex items-center gap-3">
                        <div
                            className="
                                flex
                                h-11
                                w-11
                                items-center
                                justify-center
                                rounded-xl
                                bg-blue-100
                                text-blue-600
                                dark:bg-blue-950/60
                                dark:text-blue-400
                            "
                        >
                            <MessageSquare className="h-5 w-5" />
                        </div>

                        <div>
                            <h2
                                className="
                                    text-lg
                                    font-semibold
                                    text-slate-900
                                    dark:text-white
                                "
                            >
                                Communicate with Manager
                            </h2>

                            <p
                                className="
                                    mt-1
                                    text-xs
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                Send team progress, blockers,
                                delays, dependencies, and
                                important updates.
                            </p>
                        </div>
                    </div>

                    <div
                        className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            bg-green-100
                            px-3
                            py-1.5
                            text-xs
                            font-medium
                            text-green-700
                            dark:bg-green-950/40
                            dark:text-green-400
                        "
                    >
                        <ShieldCheck className="h-4 w-4" />
                        Team Leader Access
                    </div>
                </div>
            </div>

            {/* ==================================================
                MANAGER CARD
            ================================================== */}

            <div
                className="
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    p-5
                    dark:border-blue-900/70
                    dark:bg-[#0f2747]
                "
            >
                <div className="mb-4 flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />

                    <h3
                        className="
                            text-sm
                            font-semibold
                            text-slate-900
                            dark:text-white
                        "
                    >
                        Manager
                    </h3>
                </div>

                <div
                    className="
                        flex
                        flex-col
                        gap-4
                        rounded-xl
                        border
                        border-blue-100
                        bg-blue-50
                        p-4
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                        dark:border-blue-900/70
                        dark:bg-blue-950/20
                    "
                >
                    <div className="flex items-center gap-3">
                        <div
                            className="
                                flex
                                h-12
                                w-12
                                items-center
                                justify-center
                                rounded-full
                                bg-blue-100
                                text-sm
                                font-bold
                                text-blue-600
                                dark:bg-blue-950/70
                                dark:text-blue-400
                            "
                        >
                            {getInitials(
                                manager.fullName ||
                                    manager.name
                            )}
                        </div>

                        <div>
                            <p
                                className="
                                    text-sm
                                    font-semibold
                                    text-slate-900
                                    dark:text-white
                                "
                            >
                                {manager.fullName ||
                                    manager.name ||
                                    "Project Manager"}
                            </p>

                            <div
                                className="
                                    mt-1
                                    flex
                                    flex-wrap
                                    gap-x-4
                                    gap-y-1
                                    text-xs
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                <span className="inline-flex items-center gap-1">
                                    <Mail className="h-3.5 w-3.5" />
                                    {manager.email ||
                                        "No email"}
                                </span>

                                {manager.phone && (
                                    <span>
                                        {manager.phone}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div
                        className="
                            inline-flex
                            w-fit
                            items-center
                            gap-2
                            rounded-full
                            bg-green-100
                            px-3
                            py-1.5
                            text-xs
                            font-medium
                            text-green-700
                            dark:bg-green-950/40
                            dark:text-green-400
                        "
                    >
                        <span
                            className="
                                h-2
                                w-2
                                rounded-full
                                bg-green-500
                            "
                        />

                        {manager.availabilityStatus ||
                            "Available"}
                    </div>
                </div>
            </div>

            {/* ==================================================
                MESSAGE STATISTICS
            ================================================== */}

            <div
                className="
                    grid
                    grid-cols-2
                    gap-3
                    md:grid-cols-5
                "
            >
                <StatisticCard
                    label="Total"
                    value={statistics.total}
                    icon={
                        <MessageSquare className="h-4 w-4" />
                    }
                />

                <StatisticCard
                    label="Progress"
                    value={statistics.progress}
                    icon={
                        <CheckCircle2 className="h-4 w-4" />
                    }
                />

                <StatisticCard
                    label="Blockers"
                    value={statistics.blockers}
                    icon={
                        <AlertCircle className="h-4 w-4" />
                    }
                />

                <StatisticCard
                    label="Delays"
                    value={statistics.delays}
                    icon={
                        <Clock3 className="h-4 w-4" />
                    }
                />

                <StatisticCard
                    label="Dependencies"
                    value={statistics.dependencies}
                    icon={
                        <Flag className="h-4 w-4" />
                    }
                />
            </div>

            {/* ==================================================
                FORM
            ================================================== */}

            <form
                onSubmit={handleSendMessage}
                className="
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    p-5
                    dark:border-blue-900/70
                    dark:bg-[#0f2747]
                "
            >
                <div className="mb-5">
                    <h3
                        className="
                            text-base
                            font-semibold
                            text-slate-900
                            dark:text-white
                        "
                    >
                        Send Message
                    </h3>

                    <p
                        className="
                            mt-1
                            text-xs
                            text-slate-500
                            dark:text-slate-400
                        "
                    >
                        Communicate important team information
                        to the Manager.
                    </p>
                </div>

                {/* ==============================================
                    VALIDATION ERROR
                ============================================== */}

                {validationError && (
                    <FeedbackAlert
                        type="error"
                        message={validationError}
                    />
                )}

                {/* ==============================================
                    SEND ERROR
                ============================================== */}

                {error && (
                    <div className="mb-4">
                        <FeedbackAlert
                            type="error"
                            message={error}
                            onRetry={handleRetry}
                            loading={isRetrying}
                        />
                    </div>
                )}

                {/* ==============================================
                    SUCCESS
                ============================================== */}

                {successMessage && (
                    <div className="mb-4">
                        <FeedbackAlert
                            type="success"
                            message={successMessage}
                        />
                    </div>
                )}

                {/* ==============================================
                    MESSAGE TYPE + PRIORITY
                ============================================== */}

                <div
                    className="
                        grid
                        grid-cols-1
                        gap-4
                        md:grid-cols-2
                    "
                >
                    <div>
                        <label
                            htmlFor="messageType"
                            className="
                                mb-2
                                block
                                text-sm
                                font-medium
                                text-slate-700
                                dark:text-slate-200
                            "
                        >
                            Message Type
                        </label>

                        <select
                            id="messageType"
                            value={messageType}
                            onChange={(event) =>
                                setMessageType(
                                    event.target.value
                                )
                            }
                            className="
                                h-10
                                w-full
                                rounded-md
                                border
                                border-slate-200
                                bg-white
                                px-3
                                text-sm
                                text-slate-800
                                outline-none
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-500/20
                                dark:border-blue-900/70
                                dark:bg-[#132f52]
                                dark:text-white
                            "
                        >
                            {Object.values(
                                MESSAGE_TYPES
                            ).map((type) => (
                                <option
                                    key={type}
                                    value={type}
                                >
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="priority"
                            className="
                                mb-2
                                block
                                text-sm
                                font-medium
                                text-slate-700
                                dark:text-slate-200
                            "
                        >
                            Priority
                        </label>

                        <select
                            id="priority"
                            value={priority}
                            onChange={(event) =>
                                setPriority(
                                    event.target.value
                                )
                            }
                            className="
                                h-10
                                w-full
                                rounded-md
                                border
                                border-slate-200
                                bg-white
                                px-3
                                text-sm
                                text-slate-800
                                outline-none
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-500/20
                                dark:border-blue-900/70
                                dark:bg-[#132f52]
                                dark:text-white
                            "
                        >
                            {Object.values(
                                PRIORITIES
                            ).map((item) => (
                                <option
                                    key={item}
                                    value={item}
                                >
                                    {item}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* ==============================================
                    SUBJECT
                ============================================== */}

                <div className="mt-4">
                    <label
                        htmlFor="messageSubject"
                        className="
                            mb-2
                            block
                            text-sm
                            font-medium
                            text-slate-700
                            dark:text-slate-200
                        "
                    >
                        Subject
                    </label>

                    <input
                        id="messageSubject"
                        type="text"
                        value={subject}
                        maxLength={150}
                        onChange={(event) =>
                            setSubject(
                                event.target.value
                            )
                        }
                        placeholder="Enter message subject..."
                        className="
                            h-10
                            w-full
                            rounded-md
                            border
                            border-slate-200
                            bg-white
                            px-3
                            text-sm
                            text-slate-800
                            outline-none
                            placeholder:text-slate-400
                            focus:border-blue-500
                            focus:ring-2
                            focus:ring-blue-500/20
                            dark:border-blue-900/70
                            dark:bg-[#132f52]
                            dark:text-white
                        "
                    />

                    <p
                        className="
                            mt-1
                            text-right
                            text-[11px]
                            text-slate-400
                        "
                    >
                        {subject.length}/150
                    </p>
                </div>

                {/* ==============================================
                    MESSAGE
                ============================================== */}

                <div className="mt-3">
                    <label
                        htmlFor="managerMessage"
                        className="
                            mb-2
                            block
                            text-sm
                            font-medium
                            text-slate-700
                            dark:text-slate-200
                        "
                    >
                        Message
                    </label>

                    <textarea
                        id="managerMessage"
                        value={message}
                        maxLength={2000}
                        onChange={(event) =>
                            setMessage(
                                event.target.value
                            )
                        }
                        rows={7}
                        placeholder={
                            "Describe the team's progress, blockers, delays, dependencies, or important updates..."
                        }
                        className="
                            w-full
                            resize-y
                            rounded-md
                            border
                            border-slate-200
                            bg-white
                            px-3
                            py-2.5
                            text-sm
                            leading-6
                            text-slate-800
                            outline-none
                            placeholder:text-slate-400
                            focus:border-blue-500
                            focus:ring-2
                            focus:ring-blue-500/20
                            dark:border-blue-900/70
                            dark:bg-[#132f52]
                            dark:text-white
                        "
                    />

                    <div
                        className="
                            mt-1
                            flex
                            justify-between
                            text-[11px]
                            text-slate-400
                        "
                    >
                        <span>
                            Please provide clear and
                            work-related information.
                        </span>

                        <span>
                            {remainingCharacters} remaining
                        </span>
                    </div>
                </div>

                {/* ==============================================
                    ATTACHMENT
                ============================================== */}

                <div className="mt-4">
                    <label
                        htmlFor="messageAttachment"
                        className="
                            mb-2
                            block
                            text-sm
                            font-medium
                            text-slate-700
                            dark:text-slate-200
                        "
                    >
                        Attachment
                        <span
                            className="
                                ml-1
                                text-xs
                                font-normal
                                text-slate-400
                            "
                        >
                            (Optional)
                        </span>
                    </label>

                    <div
                        className="
                            rounded-lg
                            border
                            border-dashed
                            border-slate-300
                            p-4
                            dark:border-blue-900/70
                        "
                    >
                        <label
                            htmlFor="messageAttachment"
                            className="
                                flex
                                cursor-pointer
                                items-center
                                gap-3
                                text-sm
                                text-slate-600
                                hover:text-blue-600
                                dark:text-slate-300
                                dark:hover:text-blue-400
                            "
                        >
                            <Paperclip className="h-4 w-4" />

                            <span>
                                Choose a file
                            </span>

                            <input
                                id="messageAttachment"
                                type="file"
                                className="hidden"
                                onChange={
                                    handleAttachment
                                }
                            />
                        </label>

                        {attachment && (
                            <div
                                className="
                                    mt-3
                                    flex
                                    items-center
                                    justify-between
                                    rounded-md
                                    bg-slate-50
                                    px-3
                                    py-2
                                    dark:bg-[#132f52]
                                "
                            >
                                <div className="flex items-center gap-2">
                                    <FileText
                                        className="
                                            h-4
                                            w-4
                                            text-blue-500
                                        "
                                    />

                                    <span
                                        className="
                                            max-w-[220px]
                                            truncate
                                            text-xs
                                            text-slate-700
                                            dark:text-slate-300
                                        "
                                    >
                                        {attachment.name}
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setAttachment(
                                            null
                                        )
                                    }
                                    className="
                                        text-xs
                                        text-red-500
                                        hover:text-red-700
                                    "
                                >
                                    Remove
                                </button>
                            </div>
                        )}

                        <p
                            className="
                                mt-2
                                text-[11px]
                                text-slate-400
                            "
                        >
                            Maximum file size: 5 MB.
                        </p>
                    </div>
                </div>

                {/* ==============================================
                    SEND BUTTON
                ============================================== */}

                <div
                    className="
                        mt-5
                        flex
                        flex-col
                        gap-3
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
                >
                    <p
                        className="
                            text-xs
                            text-slate-500
                            dark:text-slate-400
                        "
                    >
                        Message will be sent to{" "}
                        <span className="font-medium">
                            {manager.fullName ||
                                manager.name ||
                                "Project Manager"}
                        </span>
                        .
                    </p>

                    <Button
                        type="submit"
                        disabled={isSending}
                        className="
                            bg-blue-600
                            hover:bg-blue-700
                            dark:bg-blue-600
                            dark:hover:bg-blue-700
                        "
                    >
                        {isSending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            <>
                                <Send className="mr-2 h-4 w-4" />
                                Send Message
                            </>
                        )}
                    </Button>
                </div>
            </form>

            {/* ==================================================
                COMMUNICATION HISTORY
            ================================================== */}

            <div
                className="
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    p-5
                    dark:border-blue-900/70
                    dark:bg-[#0f2747]
                "
            >
                <div
                    className="
                        mb-5
                        flex
                        flex-col
                        gap-2
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
                >
                    <div>
                        <h3
                            className="
                                text-base
                                font-semibold
                                text-slate-900
                                dark:text-white
                            "
                        >
                            Communication History
                        </h3>

                        <p
                            className="
                                mt-1
                                text-xs
                                text-slate-500
                                dark:text-slate-400
                            "
                        >
                            Previous communication with
                            the Manager.
                        </p>
                    </div>

                    <div
                        className="
                            inline-flex
                            items-center
                            gap-2
                            text-xs
                            text-slate-500
                            dark:text-slate-400
                        "
                    >
                        <Bell className="h-4 w-4" />

                        {messages.length} messages
                    </div>
                </div>

                {!messages.length ? (
                    <div
                        className="
                            rounded-lg
                            border
                            border-dashed
                            border-slate-300
                            px-5
                            py-8
                            text-center
                            dark:border-blue-900/70
                        "
                    >
                        <MessageSquare
                            className="
                                mx-auto
                                h-8
                                w-8
                                text-slate-400
                            "
                        />

                        <p
                            className="
                                mt-3
                                text-sm
                                font-medium
                                text-slate-700
                                dark:text-slate-300
                            "
                        >
                            No communication history
                        </p>

                        <p
                            className="
                                mt-1
                                text-xs
                                text-slate-400
                            "
                        >
                            Your messages to the Manager
                            will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {messages.map((item) => (
                            <CommunicationItem
                                key={item.id}
                                item={item}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* ==================================================
                AUTHORITY NOTICE
            ================================================== */}

            <div
                className="
                    rounded-xl
                    border
                    border-amber-200
                    bg-amber-50
                    p-4
                    dark:border-amber-900/60
                    dark:bg-amber-950/20
                "
            >
                <div className="flex items-start gap-3">
                    <ShieldCheck
                        className="
                            mt-0.5
                            h-5
                            w-5
                            shrink-0
                            text-amber-600
                            dark:text-amber-400
                        "
                    />

                    <div>
                        <h4
                            className="
                                text-sm
                                font-semibold
                                text-amber-800
                                dark:text-amber-300
                            "
                        >
                            Team Leader Authority
                        </h4>

                        <p
                            className="
                                mt-1
                                text-xs
                                leading-5
                                text-amber-700
                                dark:text-amber-400
                            "
                        >
                            This module is for team
                            coordination and communication.
                            It does not grant permission to
                            create projects, change project
                            ownership, assign people to teams,
                            change contributor types or
                            specializations, approve final work,
                            or override Manager decisions.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ============================================================
   COMMUNICATION ITEM
============================================================ */

function CommunicationItem({ item }) {
    return (
        <div
            className="
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                p-4
                dark:border-blue-900/70
                dark:bg-[#132f52]
            "
        >
            <div
                className="
                    flex
                    flex-col
                    gap-3
                    sm:flex-row
                    sm:items-start
                    sm:justify-between
                "
            >
                <div className="min-w-0">
                    <div
                        className="
                            flex
                            flex-wrap
                            items-center
                            gap-2
                        "
                    >
                        <span
                            className={`
                                inline-flex
                                items-center
                                gap-1.5
                                rounded-full
                                px-2.5
                                py-1
                                text-[11px]
                                font-medium
                                ${getMessageTypeClass(
                                    item.type
                                )}
                            `}
                        >
                            {getMessageTypeIcon(
                                item.type
                            )}

                            {item.type}
                        </span>

                        <span
                            className={`
                                rounded-full
                                px-2.5
                                py-1
                                text-[11px]
                                font-medium
                                ${getPriorityClass(
                                    item.priority
                                )}
                            `}
                        >
                            {item.priority}
                        </span>
                    </div>

                    <h4
                        className="
                            mt-3
                            text-sm
                            font-semibold
                            text-slate-900
                            dark:text-white
                        "
                    >
                        {item.subject ||
                            "No Subject"}
                    </h4>

                    <p
                        className="
                            mt-2
                            whitespace-pre-wrap
                            text-sm
                            leading-6
                            text-slate-600
                            dark:text-slate-300
                        "
                    >
                        {item.message}
                    </p>
                </div>

                <div
                    className="
                        shrink-0
                        text-xs
                        text-slate-400
                    "
                >
                    {formatDateTime(
                        item.createdAt
                    )}
                </div>
            </div>

            <div
                className="
                    mt-4
                    flex
                    flex-wrap
                    items-center
                    gap-x-4
                    gap-y-2
                    border-t
                    border-slate-200
                    pt-3
                    text-[11px]
                    text-slate-500
                    dark:border-blue-900/70
                    dark:text-slate-400
                "
            >
                <span>
                    From:{" "}
                    <span className="font-medium">
                        {item.sender ||
                            "Team Leader"}
                    </span>
                </span>

                <span>
                    To:{" "}
                    <span className="font-medium">
                        {item.recipient ||
                            "Project Manager"}
                    </span>
                </span>

                <span
                    className="
                        inline-flex
                        items-center
                        gap-1
                        text-green-600
                        dark:text-green-400
                    "
                >
                    <CheckCircle2 className="h-3.5 w-3.5" />

                    {item.status ||
                        "Delivered"}
                </span>
            </div>
        </div>
    );
}

/* ============================================================
   STATISTIC CARD
============================================================ */

function StatisticCard({
    label,
    value,
    icon,
}) {
    return (
        <div
            className="
                rounded-xl
                border
                border-slate-200
                bg-white
                p-3
                dark:border-blue-900/70
                dark:bg-[#0f2747]
            "
        >
            <div
                className="
                    flex
                    items-center
                    gap-2
                    text-blue-500
                "
            >
                {icon}

                <span
                    className="
                        text-xs
                        text-slate-500
                        dark:text-slate-400
                    "
                >
                    {label}
                </span>
            </div>

            <p
                className="
                    mt-2
                    text-xl
                    font-bold
                    text-slate-900
                    dark:text-white
                "
            >
                {value}
            </p>
        </div>
    );
}

/* ============================================================
   FEEDBACK ALERT
============================================================ */

function FeedbackAlert({
    type,
    message,
    onRetry,
    loading = false,
}) {
    const isSuccess =
        type === "success";

    return (
        <div
            className={`
                flex
                flex-col
                gap-3
                rounded-lg
                border
                p-3
                sm:flex-row
                sm:items-center
                sm:justify-between
                ${
                    isSuccess
                        ? "border-green-200 bg-green-50 dark:border-green-900/60 dark:bg-green-950/20"
                        : "border-red-200 bg-red-50 dark:border-red-900/60 dark:bg-red-950/20"
                }
            `}
        >
            <div className="flex items-start gap-2">
                {isSuccess ? (
                    <CheckCircle2
                        className="
                            mt-0.5
                            h-4
                            w-4
                            shrink-0
                            text-green-600
                            dark:text-green-400
                        "
                    />
                ) : (
                    <XCircle
                        className="
                            mt-0.5
                            h-4
                            w-4
                            shrink-0
                            text-red-600
                            dark:text-red-400
                        "
                    />
                )}

                <p
                    className={`
                        text-xs
                        leading-5
                        ${
                            isSuccess
                                ? "text-green-700 dark:text-green-400"
                                : "text-red-700 dark:text-red-400"
                        }
                    `}
                >
                    {message}
                </p>
            </div>

            {!isSuccess && onRetry && (
                <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={onRetry}
                    disabled={loading}
                    className="
                        shrink-0
                        border-red-200
                        text-red-600
                        hover:bg-red-100
                        dark:border-red-900/70
                        dark:text-red-400
                        dark:hover:bg-red-950/40
                    "
                >
                    {loading ? (
                        <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                    ) : (
                        <RefreshCw className="mr-2 h-3.5 w-3.5" />
                    )}

                    Try Again
                </Button>
            )}
        </div>
    );
}

/* ============================================================
   LOADING STATE
============================================================ */

function LoadingState() {
    return (
        <div
            className="
                flex
                min-h-[240px]
                items-center
                justify-center
                rounded-xl
                border
                border-slate-200
                bg-white
                dark:border-blue-900/70
                dark:bg-[#0f2747]
            "
        >
            <div className="text-center">
                <Loader2
                    className="
                        mx-auto
                        h-8
                        w-8
                        animate-spin
                        text-blue-500
                    "
                />

                <p
                    className="
                        mt-3
                        text-sm
                        font-medium
                        text-slate-700
                        dark:text-slate-200
                    "
                >
                    Loading communication information...
                </p>

                <p
                    className="
                        mt-1
                        text-xs
                        text-slate-500
                        dark:text-slate-400
                    "
                >
                    Please wait.
                </p>
            </div>
        </div>
    );
}

/* ============================================================
   ERROR STATE
============================================================ */

function ErrorState({
    message,
    onRetry,
    loading,
}) {
    return (
        <div
            className="
                rounded-xl
                border
                border-red-200
                bg-red-50
                p-8
                text-center
                dark:border-red-900/60
                dark:bg-red-950/20
            "
        >
            <AlertCircle
                className="
                    mx-auto
                    h-10
                    w-10
                    text-red-500
                "
            />

            <h3
                className="
                    mt-4
                    text-base
                    font-semibold
                    text-red-700
                    dark:text-red-400
                "
            >
                Unable to Load Communication
            </h3>

            <p
                className="
                    mx-auto
                    mt-1
                    max-w-md
                    text-sm
                    text-red-600
                    dark:text-red-400
                "
            >
                {message ||
                    "Unable to load communication information. Please try again."}
            </p>

            <Button
                type="button"
                variant="outline"
                onClick={onRetry}
                disabled={loading}
                className="
                    mt-4
                    border-red-200
                    text-red-600
                    hover:bg-red-100
                    dark:border-red-900/70
                    dark:text-red-400
                    dark:hover:bg-red-950/40
                "
            >
                {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <RefreshCw className="mr-2 h-4 w-4" />
                )}

                Try Again
            </Button>
        </div>
    );
}

export default CommunicateWithManager;