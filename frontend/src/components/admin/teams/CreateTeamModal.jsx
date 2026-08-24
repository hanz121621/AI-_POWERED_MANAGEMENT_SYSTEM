
import { useEffect, useMemo, useState } from "react";

import {
    Users,
    UserPlus,
    ShieldCheck,
    Code2,
    BriefcaseBusiness,
    Trash2,
    Plus,
    Loader2,
    X,
    Save,
    AlertTriangle,
    CheckCircle2,
    UsersRound,
    Crown,
} from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { createTeam } from "@/services/teamService";

/* ============================================================
   CONTRIBUTOR TYPES
============================================================ */

const CONTRIBUTOR_TYPES = [
    {
        id: "team-leader",
        name: "Team Leader",
    },
    {
        id: "developer",
        name: "Developer",
    },
    {
        id: "staff",
        name: "Staff",
    },
];

/* ============================================================
   DEVELOPER SUB-TYPES
============================================================ */

const DEVELOPER_SUB_TYPES = [
    {
        id: "ux-ui-developer",
        name: "UX/UI Developer",
    },
    {
        id: "frontend-developer",
        name: "Frontend Developer",
    },
    {
        id: "backend-developer",
        name: "Backend Developer",
    },
    {
        id: "full-stack-developer",
        name: "Full-Stack Developer",
    },
    {
        id: "qa-tester",
        name: "QA/Tester",
    },
    {
        id: "devops-developer",
        name: "DevOps Developer",
    },
    {
        id: "mobile-developer",
        name: "Mobile Developer",
    },
    {
        id: "ai-ml-developer",
        name: "AI/ML Developer",
    },
    {
        id: "other-developer",
        name: "Other",
    },
];

/* ============================================================
   STAFF SUB-TYPES
============================================================ */

const STAFF_SUB_TYPES = [
    {
        id: "document-maker",
        name: "Document Maker",
    },
    {
        id: "project-assistant",
        name: "Project Assistant",
    },
    {
        id: "data-entry",
        name: "Data Entry",
    },
    {
        id: "administrative-staff",
        name: "Administrative Staff",
    },
    {
        id: "other-staff",
        name: "Other",
    },
];

/* ============================================================
   EMPTY MEMBER
============================================================ */

const createEmptyMember = () => ({
    id: `${Date.now()}-${Math.random()}`,
    userId: "",
    contributorType: "",
    contributorSubType: "",
});

/* ============================================================
   CREATE TEAM MODAL
============================================================ */

function CreateTeamModal({
    open = false,
    onOpenChange,
    onTeamCreated,

    /*
     * These must come from the backend.
     *
     * managers:
     * [
     *   {
     *      id: "...",
     *      name: "...",
     *      email: "...",
     *      role: "Manager"
     *   }
     * ]
     *
     * availableUsers:
     * [
     *   {
     *      id: "...",
     *      name: "...",
     *      email: "...",
     *      role: "Contributor"
     *   }
     * ]
     */
    managers = [],
    availableUsers = [],
}) {
    /* ========================================================
       TEAM FORM
    ======================================================== */

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        organization: "Africom Technology",
        managerId: "",
        teamLeaderId: "",
    });

    /* ========================================================
       TEAM MEMBERS
    ======================================================== */

    const [members, setMembers] = useState([]);

    /* ========================================================
       ERRORS
    ======================================================== */

    const [errors, setErrors] = useState({});

    /* ========================================================
       SAVING
    ======================================================== */

    const [isSaving, setIsSaving] = useState(false);

    const [successMessage, setSuccessMessage] = useState("");

    const [dialogOpen, setDialogOpen] = useState(Boolean(open));

    /* ========================================================
       SYNC OPEN STATE
    ======================================================== */

    useEffect(() => {
        setDialogOpen(Boolean(open));
    }, [open]);

    /* ========================================================
       RESET FORM
    ======================================================== */

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            organization: "Africom Technology",
            managerId: "",
            teamLeaderId: "",
        });

        setMembers([]);

        setErrors({});

        setSuccessMessage("");

        setIsSaving(false);
    };

    /* ========================================================
       CLOSE
    ======================================================== */

    const handleClose = () => {
        if (isSaving) {
            return;
        }

        resetForm();

        setDialogOpen(false);

        onOpenChange?.(false);
    };

    /* ========================================================
       BASIC INPUT CHANGE
    ======================================================== */

    const handleChange = (event) => {
        const {
            name,
            value,
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setErrors((previous) => ({
            ...previous,
            [name]: "",
            general: "",
            submit: "",
        }));

        setSuccessMessage("");
    };

    /* ========================================================
       USER DISPLAY NAME
    ======================================================== */

    const getUserName = (user) => {
        if (!user) {
            return "Unknown user";
        }

        if (user.name) {
            return user.name;
        }

        if (user.fullName) {
            return user.fullName;
        }

        const fullName =
            `${user.firstName || ""} ${
                user.lastName || ""
            }`.trim();

        return (
            fullName ||
            user.username ||
            user.email ||
            `User ${user.id}`
        );
    };

    /* ========================================================
       USER ID
    ======================================================== */

    const getUserId = (user) => {
        return (
            user?.id ??
            user?.userId ??
            user?.Id ??
            user?.UserId ??
            null
        );
    };

    /* ========================================================
       GET TEAM LEADER CANDIDATES
    ======================================================== */

    const teamLeaderCandidates = useMemo(() => {
        return availableUsers.filter((user) => {
            const role = String(
                user?.role ??
                    user?.Role ??
                    ""
            )
                .trim()
                .toLowerCase();

            return (
                role === "contributor" ||
                role === "developer"
            );
        });
    }, [availableUsers]);

    /* ========================================================
       GET MEMBER CANDIDATES
    ======================================================== */

    const memberCandidates = useMemo(() => {
        return availableUsers.filter((user) => {
            const userId = getUserId(user);

            if (
                userId === null ||
                userId === undefined
            ) {
                return false;
            }

            const role = String(
                user?.role ??
                    user?.Role ??
                    ""
            )
                .trim()
                .toLowerCase();

            return (
                role === "contributor" ||
                role === "developer"
            );
        });
    }, [availableUsers]);

    /* ========================================================
       ADD MEMBER
    ======================================================== */

    const handleAddMember = () => {
        setMembers((previous) => [
            ...previous,
            createEmptyMember(),
        ]);

        setErrors((previous) => ({
            ...previous,
            members: "",
            submit: "",
        }));
    };

    /* ========================================================
       REMOVE MEMBER
    ======================================================== */

    const handleRemoveMember = (memberId) => {
        setMembers((previous) =>
            previous.filter(
                (member) =>
                    member.id !== memberId
            )
        );

        setErrors((previous) => ({
            ...previous,
            [`member-${memberId}`]: "",
            members: "",
            submit: "",
        }));
    };

    /* ========================================================
       UPDATE MEMBER
    ======================================================== */

    const handleMemberChange = (
        memberId,
        field,
        value
    ) => {
        setMembers((previous) =>
            previous.map((member) => {
                if (
                    member.id !== memberId
                ) {
                    return member;
                }

                if (
                    field ===
                    "contributorType"
                ) {
                    return {
                        ...member,
                        contributorType:
                            value,
                        contributorSubType:
                            "",
                    };
                }

                return {
                    ...member,
                    [field]: value,
                };
            })
        );

        setErrors((previous) => ({
            ...previous,
            [`member-${memberId}`]: {},
            members: "",
            submit: "",
        }));

        setSuccessMessage("");
    };

    /* ========================================================
       GET MEMBER ERROR
    ======================================================== */

    const getMemberError = (memberId) => {
        return (
            errors[
                `member-${memberId}`
            ] || {}
        );
    };

    /* ========================================================
       TEAM NAME VALIDATION
       NOTE:
       We do NOT check localStorage or local teams.
       The backend is responsible for uniqueness.
    ======================================================== */

    const validateTeamName = () => {
        const teamName =
            formData.name.trim();

        if (!teamName) {
            return "Team name is required.";
        }

        if (teamName.length < 2) {
            return (
                "Team name must contain at least 2 characters."
            );
        }

        return "";
    };

    /* ========================================================
       VALIDATE FORM
    ======================================================== */

    const validateForm = () => {
        const newErrors = {};

        /* ----------------------------------------------------
           TEAM NAME
        ---------------------------------------------------- */

        const teamNameError =
            validateTeamName();

        if (teamNameError) {
            newErrors.name =
                teamNameError;
        }

        /* ----------------------------------------------------
           ORGANIZATION
        ---------------------------------------------------- */

        if (
            !formData.organization.trim()
        ) {
            newErrors.organization =
                "Organization is required.";
        }

        /* ----------------------------------------------------
           MANAGER
        ---------------------------------------------------- */

        if (formData.managerId) {
            const managerExists =
                managers.some(
                    (manager) =>
                        String(
                            getUserId(manager)
                        ) ===
                        String(
                            formData.managerId
                        )
                );

            if (!managerExists) {
                newErrors.managerId =
                    "Selected manager is not available.";
            }
        }

        /* ----------------------------------------------------
           TEAM LEADER
        ---------------------------------------------------- */

        if (formData.teamLeaderId) {
            const leaderExists =
                teamLeaderCandidates.some(
                    (user) =>
                        String(
                            getUserId(user)
                        ) ===
                        String(
                            formData.teamLeaderId
                        )
                );

            if (!leaderExists) {
                newErrors.teamLeaderId =
                    "Selected team leader is not available.";
            }
        }

        /* ----------------------------------------------------
           MEMBERS
        ---------------------------------------------------- */

        members.forEach((member) => {
            const memberError = {};

            /* USER */

            if (!member.userId) {
                memberError.userId =
                    "Team member is required.";
            } else {
                const userExists =
                    memberCandidates.some(
                        (user) =>
                            String(
                                getUserId(user)
                            ) ===
                            String(
                                member.userId
                            )
                    );

                if (!userExists) {
                    memberError.userId =
                        "Selected team member is not available.";
                }
            }

            /* CONTRIBUTOR TYPE */

            if (
                !member.contributorType
            ) {
                memberError.contributorType =
                    "Contributor type is required.";
            } else {
                const validType =
                    CONTRIBUTOR_TYPES.some(
                        (type) =>
                            type.id ===
                            member.contributorType
                    );

                if (!validType) {
                    memberError.contributorType =
                        "Invalid contributor type.";
                }
            }

            /* SUB-TYPE */

            const requiresSubType =
                member.contributorType ===
                    "developer" ||
                member.contributorType ===
                    "staff";

            if (
                requiresSubType &&
                !member.contributorSubType
            ) {
                memberError.contributorSubType =
                    "Contributor sub-type is required.";
            }

            /* DEVELOPER SUBTYPE */

            if (
                member.contributorType ===
                    "developer" &&
                member.contributorSubType
            ) {
                const validSubType =
                    DEVELOPER_SUB_TYPES.some(
                        (item) =>
                            item.id ===
                            member.contributorSubType
                    );

                if (!validSubType) {
                    memberError.contributorSubType =
                        "Invalid developer sub-type.";
                }
            }

            /* STAFF SUBTYPE */

            if (
                member.contributorType ===
                    "staff" &&
                member.contributorSubType
            ) {
                const validSubType =
                    STAFF_SUB_TYPES.some(
                        (item) =>
                            item.id ===
                            member.contributorSubType
                    );

                if (!validSubType) {
                    memberError.contributorSubType =
                        "Invalid staff sub-type.";
                }
            }

            /* TEAM LEADER */

            if (
                member.contributorType ===
                    "team-leader" &&
                member.contributorSubType
            ) {
                memberError.contributorSubType =
                    "Team Leader does not require a sub-type.";
            }

            /* DUPLICATE MEMBERS */

            const duplicateCount =
                members.filter(
                    (item) =>
                        item.userId &&
                        String(
                            item.userId
                        ) ===
                            String(
                                member.userId
                            )
                ).length;

            if (
                member.userId &&
                duplicateCount > 1
            ) {
                memberError.userId =
                    "This user is already added to the team.";
            }

            if (
                Object.keys(
                    memberError
                ).length > 0
            ) {
                newErrors[
                    `member-${member.id}`
                ] = memberError;
            }
        });

        setErrors(newErrors);

        return (
            Object.keys(newErrors)
                .length === 0
        );
    };

    /* ========================================================
       BUILD BACKEND PAYLOAD
       
       IMPORTANT:
       This is the object sent to POST /api/Team.
    ======================================================== */

    const buildTeamPayload = () => {
        return {
            name:
                formData.name.trim(),

            description:
                formData.description.trim(),

            organization:
                formData.organization.trim(),

            managerId:
                formData.managerId || null,

            teamLeaderId:
                formData.teamLeaderId ||
                null,

            members:
                members.map((member) => ({
                    userId:
                        member.userId,

                    contributorType:
                        member.contributorType,

                    contributorSubType:
                        member.contributorSubType ||
                        null,
                })),

            status: "Active",
        };
    };

    /* ========================================================
       HANDLE SUBMIT
    ======================================================== */

    const handleSubmit = async (
        event
    ) => {
        event.preventDefault();

        if (isSaving) {
            return;
        }

        setErrors({});
        setSuccessMessage("");

        /* ----------------------------------------------------
           FRONTEND VALIDATION
        ---------------------------------------------------- */

        if (!validateForm()) {
            return;
        }

        setIsSaving(true);

        try {
            /* ------------------------------------------------
               CREATE BACKEND PAYLOAD
            ------------------------------------------------ */

            const payload =
                buildTeamPayload();

            console.log(
                "POST /api/Team payload:",
                payload
            );

            /* ------------------------------------------------
               CALL BACKEND
            ------------------------------------------------ */

            const result =
                await createTeam(
                    payload
                );

            console.log(
                "Create team response:",
                result
            );

            /* ------------------------------------------------
               NORMALIZE RESPONSE
            ------------------------------------------------ */

            const responseData =
                result?.data ??
                result;

            /* ------------------------------------------------
               SUCCESS
            ------------------------------------------------ */

            const success =
                result?.success === true ||
                result?.status === 200 ||
                result?.status === 201 ||
                result?.statusCode === 200 ||
                result?.statusCode === 201;

            if (!success) {
                throw new Error(
                    responseData?.message ||
                        responseData?.title ||
                        "Unable to create team."
                );
            }

            /* ------------------------------------------------
               SUCCESS MESSAGE
            ------------------------------------------------ */

            setSuccessMessage(
                responseData?.message ||
                    "Team created successfully."
            );

            /* ------------------------------------------------
               RETURN CREATED TEAM
            ------------------------------------------------ */

            const createdTeam =
                responseData?.team ??
                responseData?.data ??
                responseData;

            onTeamCreated?.(
                createdTeam
            );

            /* ------------------------------------------------
               SHORT SUCCESS DISPLAY
            ------------------------------------------------ */

            await new Promise(
                (resolve) => {
                    setTimeout(
                        resolve,
                        700
                    );
                }
            );

            /* ------------------------------------------------
               RESET
            ------------------------------------------------ */

            resetForm();

            /* ------------------------------------------------
               CLOSE
            ------------------------------------------------ */

            setDialogOpen(false);

            onOpenChange?.(false);
        } catch (error) {
            console.error(
                "Unable to create team:",
                error
            );

            /* ------------------------------------------------
               AXIOS ERROR
            ------------------------------------------------ */

            const response =
                error?.response;

            const backendData =
                response?.data;

            const backendMessage =
                backendData?.message ||
                backendData?.title ||
                backendData?.error ||
                error?.message;

            /* ------------------------------------------------
               VALIDATION ERRORS FROM ASP.NET
               
               Handles:
               {
                   errors: {
                       Name: [...],
                       ManagerId: [...]
                   }
               }
            ------------------------------------------------ */

            const backendErrors =
                backendData?.errors;

            if (
                backendErrors &&
                typeof backendErrors ===
                    "object"
            ) {
                const mappedErrors = {};

                Object.entries(
                    backendErrors
                ).forEach(
                    ([
                        field,
                        messages,
                    ]) => {
                        const normalizedField =
                            field
                                .charAt(0)
                                .toLowerCase() +
                            field.slice(1);

                        mappedErrors[
                            normalizedField
                        ] = Array.isArray(
                            messages
                        )
                            ? messages.join(
                                  " "
                              )
                            : String(
                                  messages
                              );
                    }
                );

                setErrors({
                    ...mappedErrors,
                    submit:
                        backendMessage ||
                        "Please correct the highlighted fields.",
                });

                return;
            }

            /* ------------------------------------------------
               HTTP STATUS HANDLING
            ------------------------------------------------ */

            if (
                response?.status ===
                400
            ) {
                setErrors({
                    submit:
                        backendMessage ||
                        "The team data is invalid. Please check the form.",
                });

                return;
            }

            if (
                response?.status ===
                401
            ) {
                setErrors({
                    submit:
                        "You are not authorized to create a team.",
                });

                return;
            }

            if (
                response?.status ===
                403
            ) {
                setErrors({
                    submit:
                        "You do not have permission to create a team.",
                });

                return;
            }

            if (
                response?.status ===
                409
            ) {
                setErrors({
                    name:
                        backendMessage ||
                        "A team with this name already exists.",
                });

                return;
            }

            /* ------------------------------------------------
               GENERAL ERROR
            ------------------------------------------------ */

            setErrors({
                submit:
                    backendMessage ||
                    "Unable to create team. Please try again.",
            });
        } finally {
            setIsSaving(false);
        }
    };

    /* ========================================================
       RENDER
    ======================================================== */

    return (
        <Dialog
            open={dialogOpen}
            onOpenChange={(value) => {
                if (!value) {
                    handleClose();
                } else {
                    setDialogOpen(true);
                    onOpenChange?.(
                        true
                    );
                }
            }}
        >
            <DialogContent
                className="
                    w-[95%]
                    max-w-3xl
                    overflow-hidden
                    rounded-2xl
                    border
                    border-blue-900/60
                    bg-slate-950
                    p-0
                    text-white
                    shadow-2xl
                    shadow-blue-950/50
                "
            >
                {/* ==================================================
                    HEADER
                ================================================== */}

                <DialogHeader
                    className="
                        border-b
                        border-blue-900/70
                        bg-gradient-to-r
                        from-slate-950
                        via-blue-950
                        to-slate-900
                        px-6
                        py-5
                    "
                >
                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            gap-4
                        "
                    >
                        <div
                            className="
                                flex
                                items-center
                                gap-3
                            "
                        >
                            <div
                                className="
                                    flex
                                    h-12
                                    w-12
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    border
                                    border-blue-500/40
                                    bg-blue-500/10
                                    text-blue-300
                                    shadow-lg
                                    shadow-blue-950/30
                                    transition-all
                                    duration-300
                                    hover:-translate-y-0.5
                                    hover:border-cyan-400/60
                                    hover:bg-blue-500/20
                                    hover:text-cyan-300
                                    hover:shadow-cyan-500/10
                                "
                            >
                                <Users
                                    size={23}
                                />
                            </div>

                            <div>
                                <DialogTitle
                                    className="
                                        text-xl
                                        font-bold
                                        tracking-tight
                                        text-white
                                    "
                                >
                                    Create Team
                                </DialogTitle>

                                <DialogDescription
                                    className="
                                        mt-1
                                        text-sm
                                        text-blue-300
                                    "
                                >
                                    Create a team,
                                    assign its
                                    manager and
                                    team leader,
                                    and configure
                                    its members.
                                </DialogDescription>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={
                                handleClose
                            }
                            disabled={
                                isSaving
                            }
                            className="
                                rounded-xl
                                border
                                border-blue-800
                                bg-blue-950/60
                                p-2
                                text-blue-300
                                transition-all
                                duration-200
                                hover:rotate-90
                                hover:border-cyan-400/60
                                hover:bg-blue-900
                                hover:text-white
                                disabled:cursor-not-allowed
                                disabled:opacity-40
                            "
                            aria-label="Close"
                            title="Close"
                        >
                            <X
                                size={19}
                            />
                        </button>
                    </div>
                </DialogHeader>

                {/* ==================================================
                    FORM
                ================================================== */}

                <form
                    onSubmit={
                        handleSubmit
                    }
                >
                    <div
                        className="
                            max-h-[70vh]
                            space-y-6
                            overflow-y-auto
                            bg-slate-900
                            px-6
                            py-6
                        "
                    >
                        {/* ==================================================
                            TEAM INFORMATION
                        ================================================== */}

                        <section
                            className="
                                rounded-xl
                                border
                                border-blue-800/70
                                bg-blue-950/40
                                p-5
                                transition-all
                                duration-300
                                hover:border-blue-600
                                hover:bg-blue-950/60
                                hover:shadow-lg
                                hover:shadow-blue-950/30
                            "
                        >
                            <div
                                className="
                                    mb-4
                                    flex
                                    items-center
                                    gap-3
                                "
                            >
                                <div
                                    className="
                                        flex
                                        h-10
                                        w-10
                                        items-center
                                        justify-center
                                        rounded-lg
                                        bg-blue-500/10
                                        text-blue-300
                                    "
                                >
                                    <UsersRound
                                        size={20}
                                    />
                                </div>

                                <div>
                                    <p
                                        className="
                                            text-sm
                                            font-semibold
                                            text-white
                                        "
                                    >
                                        Team Information
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-xs
                                            text-blue-300/70
                                        "
                                    >
                                        Enter the
                                        basic
                                        information
                                        for the new
                                        team.
                                    </p>
                                </div>
                            </div>

                            {/* TEAM NAME */}

                            <div
                                className="
                                    space-y-2
                                "
                            >
                                <Label
                                    htmlFor="team-name"
                                    className="
                                        text-blue-100
                                    "
                                >
                                    Team Name

                                    <span
                                        className="
                                            ml-1
                                            text-red-400
                                        "
                                    >
                                        *
                                    </span>
                                </Label>

                                <Input
                                    id="team-name"
                                    name="name"
                                    value={
                                        formData.name
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        isSaving
                                    }
                                    placeholder="Enter team name"
                                    className={`
                                        border-blue-800
                                        bg-slate-900
                                        text-white
                                        placeholder:text-slate-500
                                        transition-all
                                        duration-200
                                        hover:border-blue-500
                                        hover:bg-blue-950
                                        focus:border-cyan-400
                                        focus:ring-2
                                        focus:ring-cyan-400/20
                                        ${
                                            errors.name
                                                ? "border-red-500 focus:border-red-500"
                                                : ""
                                        }
                                    `}
                                />

                                {errors.name && (
                                    <p
                                        className="
                                            text-xs
                                            font-medium
                                            text-red-400
                                        "
                                    >
                                        {
                                            errors.name
                                        }
                                    </p>
                                )}
                            </div>

                            {/* ORGANIZATION */}

                            <div
                                className="
                                    mt-4
                                    space-y-2
                                "
                            >
                                <Label
                                    htmlFor="organization"
                                    className="
                                        text-blue-100
                                    "
                                >
                                    Organization

                                    <span
                                        className="
                                            ml-1
                                            text-red-400
                                        "
                                    >
                                        *
                                    </span>
                                </Label>

                                <Input
                                    id="organization"
                                    name="organization"
                                    value={
                                        formData.organization
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        isSaving
                                    }
                                    placeholder="Enter organization"
                                    className={`
                                        border-blue-800
                                        bg-slate-900
                                        text-white
                                        placeholder:text-slate-500
                                        transition-all
                                        duration-200
                                        hover:border-blue-500
                                        hover:bg-blue-950
                                        focus:border-cyan-400
                                        focus:ring-2
                                        focus:ring-cyan-400/20
                                        ${
                                            errors.organization
                                                ? "border-red-500"
                                                : ""
                                        }
                                    `}
                                />

                                {errors.organization && (
                                    <p
                                        className="
                                            text-xs
                                            text-red-400
                                        "
                                    >
                                        {
                                            errors.organization
                                        }
                                    </p>
                                )}
                            </div>

                            {/* DESCRIPTION */}

                            <div
                                className="
                                    mt-4
                                    space-y-2
                                "
                            >
                                <Label
                                    htmlFor="description"
                                    className="
                                        text-blue-100
                                    "
                                >
                                    Team Description

                                    <span
                                        className="
                                            ml-2
                                            text-xs
                                            font-normal
                                            text-blue-400
                                        "
                                    >
                                        Optional
                                    </span>
                                </Label>

                                <Textarea
                                    id="description"
                                    name="description"
                                    value={
                                        formData.description
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        isSaving
                                    }
                                    placeholder="Describe the purpose of this team..."
                                    rows={3}
                                    className="
                                        resize-none
                                        border-blue-800
                                        bg-slate-900
                                        text-white
                                        placeholder:text-slate-500
                                        transition-all
                                        duration-200
                                        hover:border-blue-500
                                        hover:bg-blue-950
                                        focus:border-cyan-400
                                        focus:ring-2
                                        focus:ring-cyan-400/20
                                    "
                                />
                            </div>
                        </section>

                        {/* ==================================================
                            TEAM ASSIGNMENT
                        ================================================== */}

                        <section
                            className="
                                rounded-xl
                                border
                                border-blue-800/70
                                bg-slate-800/70
                                p-5
                                transition-all
                                duration-300
                                hover:border-blue-700
                                hover:bg-slate-800
                            "
                        >
                            <div
                                className="
                                    mb-5
                                    flex
                                    items-center
                                    gap-3
                                "
                            >
                                <div
                                    className="
                                        flex
                                        h-10
                                        w-10
                                        items-center
                                        justify-center
                                        rounded-lg
                                        bg-blue-500/10
                                        text-blue-300
                                    "
                                >
                                    <ShieldCheck
                                        size={20}
                                    />
                                </div>

                                <div>
                                    <p
                                        className="
                                            text-sm
                                            font-semibold
                                            text-white
                                        "
                                    >
                                        Team Assignment
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-xs
                                            text-blue-300/70
                                        "
                                    >
                                        Assign the
                                        manager and
                                        team leader.
                                    </p>
                                </div>
                            </div>

                            <div
                                className="
                                    grid
                                    gap-4
                                    md:grid-cols-2
                                "
                            >
                                {/* MANAGER */}

                                <div
                                    className="
                                        space-y-2
                                    "
                                >
                                    <Label
                                        htmlFor="managerId"
                                        className="
                                            text-blue-100
                                        "
                                    >
                                        Team Manager

                                        <span
                                            className="
                                                ml-2
                                                text-xs
                                                font-normal
                                                text-blue-400
                                            "
                                        >
                                            Optional
                                        </span>
                                    </Label>

                                    <select
                                        id="managerId"
                                        value={
                                            formData.managerId
                                        }
                                        onChange={(event) =>
                                            handleChange({
                                                target: {
                                                    name: "managerId",
                                                    value: event
                                                        .target
                                                        .value,
                                                },
                                            })
                                        }
                                        disabled={
                                            isSaving
                                        }
                                        className={`
                                            h-11
                                            w-full
                                            rounded-xl
                                            border
                                            bg-slate-900
                                            px-3
                                            text-sm
                                            text-white
                                            outline-none
                                            transition-all
                                            duration-200
                                            hover:border-blue-500
                                            hover:bg-blue-950
                                            focus:border-cyan-400
                                            focus:ring-2
                                            focus:ring-cyan-400/20
                                            ${
                                                errors.managerId
                                                    ? "border-red-500"
                                                    : "border-blue-800"
                                            }
                                        `}
                                    >
                                        <option
                                            value=""
                                            className="
                                                bg-slate-900
                                                text-slate-400
                                            "
                                        >
                                            No manager assigned
                                        </option>

                                        {managers.map(
                                            (
                                                manager
                                            ) => {
                                                const id =
                                                    getUserId(
                                                        manager
                                                    );

                                                return (
                                                    <option
                                                        key={
                                                            id
                                                        }
                                                        value={
                                                            id
                                                        }
                                                        className="
                                                            bg-slate-900
                                                            text-white
                                                        "
                                                    >
                                                        {
                                                            getUserName(
                                                                manager
                                                            )
                                                        }

                                                        {manager?.email
                                                            ? ` — ${manager.email}`
                                                            : ""}
                                                    </option>
                                                );
                                            }
                                        )}
                                    </select>

                                    {errors.managerId && (
                                        <p
                                            className="
                                                text-xs
                                                text-red-400
                                            "
                                        >
                                            {
                                                errors.managerId
                                            }
                                        </p>
                                    )}

                                    {managers.length ===
                                        0 && (
                                        <div
                                            className="
                                                flex
                                                items-start
                                                gap-3
                                                rounded-lg
                                                border
                                                border-amber-500/20
                                                bg-amber-500/5
                                                px-3
                                                py-3
                                            "
                                        >
                                            <AlertTriangle
                                                size={
                                                    17
                                                }
                                                className="
                                                    mt-0.5
                                                    shrink-0
                                                    text-amber-400
                                                "
                                            />

                                            <p
                                                className="
                                                    text-xs
                                                    leading-5
                                                    text-amber-200/70
                                                "
                                            >
                                                No managers
                                                were
                                                returned
                                                by the
                                                backend.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* TEAM LEADER */}

                                <div
                                    className="
                                        space-y-2
                                    "
                                >
                                    <Label
                                        htmlFor="teamLeaderId"
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                            text-blue-100
                                        "
                                    >
                                        <Crown
                                            size={
                                                16
                                            }
                                            className="
                                                text-cyan-400
                                            "
                                        />

                                        Team Leader

                                        <span
                                            className="
                                                text-xs
                                                font-normal
                                                text-blue-400
                                            "
                                        >
                                            Optional
                                        </span>
                                    </Label>

                                    <select
                                        id="teamLeaderId"
                                        value={
                                            formData.teamLeaderId
                                        }
                                        onChange={(event) =>
                                            handleChange({
                                                target: {
                                                    name: "teamLeaderId",
                                                    value: event
                                                        .target
                                                        .value,
                                                },
                                            })
                                        }
                                        disabled={
                                            isSaving
                                        }
                                        className={`
                                            h-11
                                            w-full
                                            rounded-xl
                                            border
                                            bg-slate-900
                                            px-3
                                            text-sm
                                            text-white
                                            outline-none
                                            transition-all
                                            duration-200
                                            hover:border-blue-500
                                            hover:bg-blue-950
                                            focus:border-cyan-400
                                            focus:ring-2
                                            focus:ring-cyan-400/20
                                            ${
                                                errors.teamLeaderId
                                                    ? "border-red-500"
                                                    : "border-blue-800"
                                            }
                                        `}
                                    >
                                        <option
                                            value=""
                                            className="
                                                bg-slate-900
                                                text-slate-400
                                            "
                                        >
                                            No team leader assigned
                                        </option>

                                        {teamLeaderCandidates.map(
                                            (
                                                user
                                            ) => {
                                                const id =
                                                    getUserId(
                                                        user
                                                    );

                                                return (
                                                    <option
                                                        key={
                                                            id
                                                        }
                                                        value={
                                                            id
                                                        }
                                                        className="
                                                            bg-slate-900
                                                            text-white
                                                        "
                                                    >
                                                        {
                                                            getUserName(
                                                                user
                                                            )
                                                        }

                                                        {user?.email
                                                            ? ` — ${user.email}`
                                                            : ""}
                                                    </option>
                                                );
                                            }
                                        )}
                                    </select>

                                    {errors.teamLeaderId && (
                                        <p
                                            className="
                                                text-xs
                                                text-red-400
                                            "
                                        >
                                            {
                                                errors.teamLeaderId
                                            }
                                        </p>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* ==================================================
                            TEAM MEMBERS
                        ================================================== */}

                        <section
                            className="
                                rounded-xl
                                border
                                border-blue-800/70
                                bg-slate-800/50
                                p-5
                            "
                        >
                            <div
                                className="
                                    mb-5
                                    flex
                                    flex-col
                                    gap-3
                                    sm:flex-row
                                    sm:items-center
                                    sm:justify-between
                                "
                            >
                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                    "
                                >
                                    <div
                                        className="
                                            flex
                                            h-10
                                            w-10
                                            items-center
                                            justify-center
                                            rounded-lg
                                            bg-blue-500/10
                                            text-blue-300
                                        "
                                    >
                                        <UserPlus
                                            size={20}
                                        />
                                    </div>

                                    <div>
                                        <p
                                            className="
                                                text-sm
                                                font-semibold
                                                text-white
                                            "
                                        >
                                            Team Members
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                text-xs
                                                text-blue-300/70
                                            "
                                        >
                                            Select the
                                            actual
                                            users and
                                            configure
                                            their
                                            contributor
                                            classification.
                                        </p>
                                    </div>
                                </div>

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={
                                        handleAddMember
                                    }
                                    disabled={
                                        isSaving
                                    }
                                    className="
                                        border-blue-700
                                        bg-blue-950/40
                                        text-blue-300
                                        transition-all
                                        duration-200
                                        hover:border-cyan-400
                                        hover:bg-blue-900
                                        hover:text-white
                                    "
                                >
                                    <Plus
                                        className="
                                            mr-2
                                            h-4
                                            w-4
                                        "
                                    />

                                    Add Member
                                </Button>
                            </div>

                            {/* NO MEMBERS */}

                            {members.length ===
                                0 && (
                                <div
                                    className="
                                        rounded-xl
                                        border
                                        border-dashed
                                        border-blue-800
                                        bg-blue-950/20
                                        px-5
                                        py-8
                                        text-center
                                    "
                                >
                                    <Users
                                        className="
                                            mx-auto
                                            mb-3
                                            h-9
                                            w-9
                                            text-blue-400/60
                                        "
                                    />

                                    <p
                                        className="
                                            text-sm
                                            font-medium
                                            text-blue-100
                                        "
                                    >
                                        No team
                                        members
                                        added
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-xs
                                            text-blue-300/60
                                        "
                                    >
                                        Click "Add
                                        Member" to
                                        select users.
                                    </p>
                                </div>
                            )}

                            {/* MEMBERS */}

                            <div
                                className="
                                    space-y-4
                                "
                            >
                                {members.map(
                                    (
                                        member,
                                        index
                                    ) => {
                                        const memberError =
                                            getMemberError(
                                                member.id
                                            );

                                        const currentSubTypes =
                                            member.contributorType ===
                                            "developer"
                                                ? DEVELOPER_SUB_TYPES
                                                : member.contributorType ===
                                                    "staff"
                                                  ? STAFF_SUB_TYPES
                                                  : [];

                                        return (
                                            <div
                                                key={
                                                    member.id
                                                }
                                                className="
                                                    rounded-xl
                                                    border
                                                    border-blue-800/70
                                                    bg-slate-900
                                                    p-4
                                                    shadow-sm
                                                    transition-all
                                                    duration-300
                                                    hover:border-blue-600
                                                    hover:bg-blue-950/40
                                                    hover:shadow-lg
                                                    hover:shadow-blue-950/20
                                                "
                                            >
                                                {/* MEMBER HEADER */}

                                                <div
                                                    className="
                                                        mb-4
                                                        flex
                                                        items-center
                                                        justify-between
                                                    "
                                                >
                                                    <div
                                                        className="
                                                            flex
                                                            items-center
                                                            gap-3
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
                                                                bg-blue-500/10
                                                                text-blue-300
                                                            "
                                                        >
                                                            <UserPlus
                                                                size={
                                                                    17
                                                                }
                                                            />
                                                        </div>

                                                        <div>
                                                            <p
                                                                className="
                                                                    text-sm
                                                                    font-semibold
                                                                    text-white
                                                                "
                                                            >
                                                                Member{" "}
                                                                {index +
                                                                    1}
                                                            </p>

                                                            <p
                                                                className="
                                                                    text-xs
                                                                    text-blue-300/60
                                                                "
                                                            >
                                                                Backend
                                                                user
                                                                assignment
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleRemoveMember(
                                                                member.id
                                                            )
                                                        }
                                                        disabled={
                                                            isSaving
                                                        }
                                                        className="
                                                            rounded-lg
                                                            border
                                                            border-transparent
                                                            p-2
                                                            text-slate-400
                                                            transition-all
                                                            duration-200
                                                            hover:border-red-500/30
                                                            hover:bg-red-500/10
                                                            hover:text-red-400
                                                            disabled:cursor-not-allowed
                                                            disabled:opacity-40
                                                        "
                                                        title="Remove member"
                                                    >
                                                        <Trash2
                                                            size={
                                                                17
                                                            }
                                                        />
                                                    </button>
                                                </div>

                                                {/* USER */}

                                                <div
                                                    className="
                                                        space-y-2
                                                    "
                                                >
                                                    <Label
                                                        className="
                                                            text-blue-100
                                                        "
                                                    >
                                                        Team Member

                                                        <span
                                                            className="
                                                                ml-1
                                                                text-red-400
                                                            "
                                                        >
                                                            *
                                                        </span>
                                                    </Label>

                                                    <select
                                                        value={
                                                            member.userId
                                                        }
                                                        onChange={(event) =>
                                                            handleMemberChange(
                                                                member.id,
                                                                "userId",
                                                                event
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                        disabled={
                                                            isSaving
                                                        }
                                                        className={`
                                                            h-11
                                                            w-full
                                                            rounded-xl
                                                            border
                                                            bg-slate-950
                                                            px-3
                                                            text-sm
                                                            text-white
                                                            outline-none
                                                            transition-all
                                                            duration-200
                                                            hover:border-blue-500
                                                            hover:bg-blue-950
                                                            focus:border-cyan-400
                                                            focus:ring-2
                                                            focus:ring-cyan-400/20
                                                            ${
                                                                memberError.userId
                                                                    ? "border-red-500"
                                                                    : "border-blue-800"
                                                            }
                                                        `}
                                                    >
                                                        <option
                                                            value=""
                                                            className="
                                                                bg-slate-950
                                                                text-slate-400
                                                            "
                                                        >
                                                            Select team member
                                                        </option>

                                                        {memberCandidates.map(
                                                            (
                                                                user
                                                            ) => {
                                                                const userId =
                                                                    getUserId(
                                                                        user
                                                                    );

                                                                return (
                                                                    <option
                                                                        key={
                                                                            userId
                                                                        }
                                                                        value={
                                                                            userId
                                                                        }
                                                                        className="
                                                                            bg-slate-950
                                                                            text-white
                                                                        "
                                                                    >
                                                                        {
                                                                            getUserName(
                                                                                user
                                                                            )
                                                                        }

                                                                        {user?.email
                                                                            ? ` — ${user.email}`
                                                                            : ""}
                                                                    </option>
                                                                );
                                                            }
                                                        )}
                                                    </select>

                                                    {memberError.userId && (
                                                        <p
                                                            className="
                                                                text-xs
                                                                text-red-400
                                                            "
                                                        >
                                                            {
                                                                memberError.userId
                                                            }
                                                        </p>
                                                    )}
                                                </div>

                                                {/* CONTRIBUTOR TYPE */}

                                                <div
                                                    className="
                                                        mt-4
                                                        space-y-2
                                                    "
                                                >
                                                    <Label
                                                        className="
                                                            text-blue-100
                                                        "
                                                    >
                                                        Contributor
                                                        Type

                                                        <span
                                                            className="
                                                                ml-1
                                                                text-red-400
                                                            "
                                                        >
                                                            *
                                                        </span>
                                                    </Label>

                                                    <select
                                                        value={
                                                            member.contributorType
                                                        }
                                                        onChange={(event) =>
                                                            handleMemberChange(
                                                                member.id,
                                                                "contributorType",
                                                                event
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                        disabled={
                                                            isSaving
                                                        }
                                                        className={`
                                                            h-11
                                                            w-full
                                                            rounded-xl
                                                            border
                                                            bg-slate-950
                                                            px-3
                                                            text-sm
                                                            text-white
                                                            outline-none
                                                            transition-all
                                                            duration-200
                                                            hover:border-blue-500
                                                            hover:bg-blue-950
                                                            focus:border-cyan-400
                                                            focus:ring-2
                                                            focus:ring-cyan-400/20
                                                            ${
                                                                memberError.contributorType
                                                                    ? "border-red-500"
                                                                    : "border-blue-800"
                                                            }
                                                        `}
                                                    >
                                                        <option
                                                            value=""
                                                            className="
                                                                bg-slate-950
                                                                text-slate-400
                                                            "
                                                        >
                                                            Select contributor type
                                                        </option>

                                                        {CONTRIBUTOR_TYPES.map(
                                                            (
                                                                type
                                                            ) => (
                                                                <option
                                                                    key={
                                                                        type.id
                                                                    }
                                                                    value={
                                                                        type.id
                                                                    }
                                                                    className="
                                                                        bg-slate-950
                                                                        text-white
                                                                    "
                                                                >
                                                                    {
                                                                        type.name
                                                                    }
                                                                </option>
                                                            )
                                                        )}
                                                    </select>

                                                    {memberError.contributorType && (
                                                        <p
                                                            className="
                                                                text-xs
                                                                text-red-400
                                                            "
                                                        >
                                                            {
                                                                memberError.contributorType
                                                            }
                                                        </p>
                                                    )}
                                                </div>

                                                {/* SUB-TYPE */}

                                                {(
                                                    member.contributorType ===
                                                        "developer" ||
                                                    member.contributorType ===
                                                        "staff"
                                                ) && (
                                                    <div
                                                        className="
                                                            mt-4
                                                            space-y-2
                                                        "
                                                    >
                                                        <Label
                                                            className="
                                                                flex
                                                                items-center
                                                                gap-2
                                                                text-blue-100
                                                            "
                                                        >
                                                            {member.contributorType ===
                                                            "developer" ? (
                                                                <Code2
                                                                    size={
                                                                        16
                                                                    }
                                                                    className="
                                                                        text-cyan-400
                                                                    "
                                                                />
                                                            ) : (
                                                                <BriefcaseBusiness
                                                                    size={
                                                                        16
                                                                    }
                                                                    className="
                                                                        text-cyan-400
                                                                    "
                                                                />
                                                            )}

                                                            {member.contributorType ===
                                                            "developer"
                                                                ? "Developer Sub-Type"
                                                                : "Staff Sub-Type"}

                                                            <span
                                                                className="
                                                                    text-red-400
                                                                "
                                                            >
                                                                *
                                                            </span>
                                                        </Label>

                                                        <select
                                                            value={
                                                                member.contributorSubType
                                                            }
                                                            onChange={(event) =>
                                                                handleMemberChange(
                                                                    member.id,
                                                                    "contributorSubType",
                                                                    event
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                            disabled={
                                                                isSaving
                                                            }
                                                            className={`
                                                                h-11
                                                                w-full
                                                                rounded-xl
                                                                border
                                                                bg-slate-950
                                                                px-3
                                                                text-sm
                                                                text-white
                                                                outline-none
                                                                transition-all
                                                                duration-200
                                                                hover:border-blue-500
                                                                hover:bg-blue-950
                                                                focus:border-cyan-400
                                                                focus:ring-2
                                                                focus:ring-cyan-400/20
                                                                ${
                                                                    memberError.contributorSubType
                                                                        ? "border-red-500"
                                                                        : "border-blue-800"
                                                                }
                                                            `}
                                                        >
                                                            <option
                                                                value=""
                                                                className="
                                                                    bg-slate-950
                                                                    text-slate-400
                                                                "
                                                            >
                                                                Select
                                                                {member.contributorType ===
                                                                "developer"
                                                                    ? " developer"
                                                                    : " staff"}{" "}
                                                                sub-type
                                                            </option>

                                                            {currentSubTypes.map(
                                                                (
                                                                    subtype
                                                                ) => (
                                                                    <option
                                                                        key={
                                                                            subtype.id
                                                                        }
                                                                        value={
                                                                            subtype.id
                                                                        }
                                                                        className="
                                                                            bg-slate-950
                                                                            text-white
                                                                        "
                                                                    >
                                                                        {
                                                                            subtype.name
                                                                        }
                                                                    </option>
                                                                )
                                                            )}
                                                        </select>

                                                        {memberError.contributorSubType && (
                                                            <p
                                                                className="
                                                                    text-xs
                                                                    text-red-400
                                                                "
                                                            >
                                                                {
                                                                    memberError.contributorSubType
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                )}

                                                {/* TEAM LEADER INFO */}

                                                {member.contributorType ===
                                                    "team-leader" && (
                                                    <div
                                                        className="
                                                            mt-4
                                                            flex
                                                            items-start
                                                            gap-3
                                                            rounded-xl
                                                            border
                                                            border-blue-700/50
                                                            bg-blue-950/30
                                                            p-4
                                                        "
                                                    >
                                                        <ShieldCheck
                                                            size={
                                                                20
                                                            }
                                                            className="
                                                                mt-0.5
                                                                shrink-0
                                                                text-cyan-400
                                                            "
                                                        />

                                                        <div>
                                                            <p
                                                                className="
                                                                    text-sm
                                                                    font-semibold
                                                                    text-blue-200
                                                                "
                                                            >
                                                                Team
                                                                Leader
                                                            </p>

                                                            <p
                                                                className="
                                                                    mt-1
                                                                    text-xs
                                                                    leading-5
                                                                    text-blue-300/70
                                                                "
                                                            >
                                                                No
                                                                contributor
                                                                sub-type
                                                                is
                                                                required
                                                                for
                                                                a Team
                                                                Leader.
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    }
                                )}
                            </div>

                            {availableUsers.length ===
                                0 && (
                                <div
                                    className="
                                        mt-4
                                        flex
                                        items-start
                                        gap-3
                                        rounded-xl
                                        border
                                        border-amber-500/20
                                        bg-amber-500/5
                                        px-4
                                        py-3
                                    "
                                >
                                    <AlertTriangle
                                        size={
                                            18
                                        }
                                        className="
                                            mt-0.5
                                            shrink-0
                                            text-amber-400
                                        "
                                    />

                                    <p
                                        className="
                                            text-xs
                                            leading-5
                                            text-amber-200/70
                                        "
                                    >
                                        No team-member
                                        users were
                                        returned by
                                        the backend.
                                        Load the
                                        available
                                        contributors
                                        before
                                        creating a
                                        team.
                                    </p>
                                </div>
                            )}
                        </section>

                        {/* ==================================================
                            INFORMATION
                        ================================================== */}

                        <div
                            className="
                                flex
                                items-start
                                gap-3
                                rounded-xl
                                border
                                border-blue-700/50
                                bg-blue-950/30
                                px-4
                                py-4
                            "
                        >
                            <ShieldCheck
                                size={19}
                                className="
                                    mt-0.5
                                    shrink-0
                                    text-cyan-400
                                "
                            />

                            <div>
                                <p
                                    className="
                                        text-sm
                                        font-semibold
                                        text-blue-200
                                    "
                                >
                                    Team Structure
                                </p>

                                <p
                                    className="
                                        mt-1
                                        text-xs
                                        leading-5
                                        text-blue-300/70
                                    "
                                >
                                    The team is
                                    connected to a
                                    backend user
                                    through
                                    <strong>
                                        {" "}
                                        userId
                                    </strong>
                                    . Developer and
                                    Staff members
                                    require a
                                    corresponding
                                    sub-type.
                                    Team Leaders do
                                    not require a
                                    sub-type.
                                </p>
                            </div>
                        </div>

                        {/* ==================================================
                            GENERAL ERROR
                        ================================================== */}

                        {errors.submit && (
                            <div
                                className="
                                    flex
                                    items-start
                                    gap-3
                                    rounded-xl
                                    border
                                    border-red-500/30
                                    bg-red-500/10
                                    px-4
                                    py-3
                                    text-sm
                                    text-red-300
                                "
                            >
                                <AlertTriangle
                                    size={
                                        18
                                    }
                                    className="
                                        mt-0.5
                                        shrink-0
                                    "
                                />

                                <span>
                                    {
                                        errors.submit
                                    }
                                </span>
                            </div>
                        )}

                        {/* ==================================================
                            SUCCESS
                        ================================================== */}

                        {successMessage && (
                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                    rounded-xl
                                    border
                                    border-emerald-500/30
                                    bg-emerald-500/10
                                    px-4
                                    py-3
                                    text-sm
                                    font-medium
                                    text-emerald-300
                                "
                            >
                                <CheckCircle2
                                    size={
                                        18
                                    }
                                />

                                {
                                    successMessage
                                }
                            </div>
                        )}
                    </div>

                    {/* ==================================================
                        FOOTER
                    ================================================== */}

                    <div
                        className="
                            flex
                            flex-col-reverse
                            gap-3
                            border-t
                            border-blue-900/70
                            bg-slate-950
                            px-6
                            py-4
                            sm:flex-row
                            sm:items-center
                            sm:justify-end
                        "
                    >
                        <Button
                            type="button"
                            variant="outline"
                            onClick={
                                handleClose
                            }
                            disabled={
                                isSaving
                            }
                            className="
                                border-slate-700
                                bg-slate-900
                                px-5
                                text-slate-200
                                transition-all
                                duration-200
                                hover:border-blue-500
                                hover:bg-blue-950
                                hover:text-white
                            "
                        >
                            <X
                                size={16}
                                className="
                                    mr-2
                                "
                            />

                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={
                                isSaving
                            }
                            className="
                                bg-gradient-to-r
                                from-blue-700
                                via-blue-600
                                to-cyan-600
                                px-5
                                text-white
                                shadow-lg
                                shadow-blue-950/40
                                transition-all
                                duration-200
                                hover:-translate-y-0.5
                                hover:from-blue-600
                                hover:via-blue-500
                                hover:to-cyan-500
                                hover:shadow-xl
                                hover:shadow-cyan-900/30
                                focus:ring-2
                                focus:ring-cyan-400/30
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            {isSaving ? (
                                <>
                                    <Loader2
                                        size={
                                            16
                                        }
                                        className="
                                            mr-2
                                            animate-spin
                                        "
                                    />

                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Save
                                        size={
                                            16
                                        }
                                        className="
                                            mr-2
                                        "
                                    />

                                    Create Team
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default CreateTeamModal;