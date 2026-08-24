import { useMemo, useState } from "react";

import {
    UsersRound,
    UserRound,
    UserCog,
    UserPlus,
    UserMinus,
    UserRoundCog,
    FileText,
    X,
    Save,
    ShieldCheck,
    Code2,
    BriefcaseBusiness,
    RefreshCw,
} from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import {
    updateTeam,
    removeMemberFromTeam,
} from "@/services/teamService";

// ============================================================
// HELPERS
// ============================================================

const getMemberName = (member) => {
    if (!member) {
        return "Unknown user";
    }

    if (typeof member === "string") {
        return member;
    }

    return (
        member.name ||
        member.fullName ||
        member.full_name ||
        member.username ||
        member.userName ||
        member.displayName ||
        member.email ||
        "Unknown user"
    );
};

const getMemberId = (member) => {
    if (!member) {
        return null;
    }

    if (typeof member === "string") {
        return member;
    }

    return (
        member.id ??
        member.userId ??
        member.userID ??
        member.user_id ??
        member._id ??
        member.Id ??
        null
    );
};

const getMemberEmail = (member) => {
    if (!member || typeof member !== "object") {
        return "";
    }

    return (
        member.email ||
        member.emailAddress ||
        member.userEmail ||
        ""
    );
};

const getMemberRole = (member) => {
    if (!member || typeof member !== "object") {
        return "";
    }

    return String(
        member.role ||
            member.userRole ||
            member.type ||
            member.contributorType ||
            member.contributorTypeName ||
            ""
    )
        .trim()
        .toLowerCase();
};

const normalizeMembers = (members) => {
    if (!Array.isArray(members)) {
        return [];
    }

    return members;
};

// ============================================================
// GET TEAM MEMBERS
// ============================================================

const getInitialMembers = (team) => {
    if (!team) {
        return {
            developers: [],
            staff: [],
        };
    }

    const members = normalizeMembers(
        team.members ||
            team.teamMembers ||
            team.users
    );

    const developers = members.filter((member) => {
        const role = getMemberRole(member);

        return (
            role === "developer" ||
            role === "developers"
        );
    });

    const staff = members.filter((member) => {
        const role = getMemberRole(member);

        return (
            role === "staff" ||
            role === "support staff"
        );
    });

    return {
        developers,
        staff,
    };
};

// ============================================================
// GET INITIAL FORM DATA
// ============================================================

const getInitialFormData = (team) => {
    if (!team) {
        return {
            name: "",
            description: "",
            teamLeader: "",
        };
    }

    const teamLeaderName =
        team.teamLeaderName ||
        team.teamLeader?.name ||
        team.teamLeader?.fullName ||
        team.teamLeader?.username ||
        team.teamLeader?.displayName ||
        team.teamLeader ||
        "";

    return {
        name: team.name || "",
        description: team.description || "",
        teamLeader:
            teamLeaderName === "Not assigned"
                ? ""
                : teamLeaderName,
    };
};

// ============================================================
// GET TEAM ID
// ============================================================

const getTeamId = (team) => {
    if (!team) {
        return null;
    }

    return (
        team.id ??
        team.teamId ??
        team._id ??
        team.Id ??
        null
    );
};

// ============================================================
// GET MANAGER
// ============================================================

const getManager = (team) => {
    if (!team) {
        return null;
    }

    return (
        team.manager ||
        team.managerUser ||
        team.assignedManager ||
        null
    );
};

const getManagerId = (team) => {
    if (!team) {
        return null;
    }

    const manager = getManager(team);

    return (
        team.managerId ??
        team.managerID ??
        manager?.id ??
        manager?.userId ??
        manager?.userID ??
        manager?.user_id ??
        manager?._id ??
        null
    );
};

const getManagerName = (team) => {
    if (!team) {
        return "";
    }

    const manager = getManager(team);

    if (typeof manager === "string") {
        return manager;
    }

    return (
        team.managerName ||
        manager?.name ||
        manager?.fullName ||
        manager?.full_name ||
        manager?.username ||
        manager?.userName ||
        manager?.displayName ||
        manager?.email ||
        ""
    );
};

const getManagerEmail = (team) => {
    if (!team) {
        return "";
    }

    const manager = getManager(team);

    return (
        team.managerEmail ||
        manager?.email ||
        manager?.emailAddress ||
        ""
    );
};

// ============================================================
// MAIN MODAL
// ============================================================

function EditTeamModal({
    open = false,
    team = null,
    existingTeams = [],
    onClose,
    onSave,
    onAddMembers,
    onTeamUpdated,
    onAssignManager,
}) {
    const teamKey = team
        ? String(
              getTeamId(team) ||
                  team.name ||
                  "edit-team"
          )
        : "new-team";

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                if (!isOpen) {
                    onClose?.();
                }
            }}
        >
            <DialogContent
                className="
                    w-[95vw]
                    max-w-5xl
                    overflow-hidden
                    rounded-2xl
                    border
                    border-border
                    bg-background
                    p-0
                    text-foreground
                    shadow-2xl
                "
            >
                <TeamEditor
                    key={teamKey}
                    team={team}
                    existingTeams={existingTeams}
                    onClose={onClose}
                    onSave={onSave}
                    onAddMembers={onAddMembers}
                    onTeamUpdated={onTeamUpdated}
                    onAssignManager={onAssignManager}
                />
            </DialogContent>
        </Dialog>
    );
}

// ============================================================
// TEAM EDITOR
// ============================================================

function TeamEditor({
    team,
    existingTeams = [],
    onClose,
    onSave,
    onAddMembers,
    onTeamUpdated,
    onAssignManager,
}) {
    // ========================================================
    // INITIAL DATA
    // ========================================================

    const initialFormData = useMemo(
        () => getInitialFormData(team),
        [team]
    );

    const initialMembers = useMemo(
        () => getInitialMembers(team),
        [team]
    );

    // ========================================================
    // FORM STATE
    // ========================================================

    const [formData, setFormData] =
        useState(initialFormData);

    const [developers, setDevelopers] =
        useState(initialMembers.developers);

    const [staff, setStaff] =
        useState(initialMembers.staff);

    // ========================================================
    // STATUS
    // ========================================================

    const [errors, setErrors] = useState({});

    const [successMessage, setSuccessMessage] =
        useState("");

    const [saving, setSaving] =
        useState(false);

    const [removingMemberId, setRemovingMemberId] =
        useState(null);

    // ========================================================
    // FORM CHANGE
    // ========================================================

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
        }));

        setSuccessMessage("");
    };

    // ========================================================
    // VALIDATE FORM
    // ========================================================

    const validateForm = () => {
        const newErrors = {};

        const teamName =
            formData.name.trim();

        if (!teamName) {
            newErrors.name =
                "Team name is required.";
        }

        const currentTeamId =
            String(
                getTeamId(team) || ""
            );

        const duplicateTeam =
            existingTeams.some((item) => {
                const itemId =
                    String(
                        getTeamId(item) || ""
                    );

                const sameTeam =
                    itemId ===
                    currentTeamId;

                if (sameTeam) {
                    return false;
                }

                return (
                    item.name
                        ?.trim()
                        .toLowerCase() ===
                    teamName.toLowerCase()
                );
            });

        if (
            teamName &&
            duplicateTeam
        ) {
            newErrors.name =
                "Team name already exists.";
        }

        setErrors(newErrors);

        return (
            Object.keys(newErrors).length ===
            0
        );
    };

    // ========================================================
    // GET ALL MEMBER IDS
    // ========================================================

    const getMemberIds = () => {
        return [
            ...developers,
            ...staff,
        ]
            .map((member) =>
                getMemberId(member)
            )
            .filter(Boolean)
            .map((id) => String(id));
    };

    // ========================================================
    // BUILD UPDATE PAYLOAD
    // ========================================================

    const buildUpdatePayload = () => {
        return {
            name: formData.name.trim(),

            description:
                formData.description.trim(),

            isActive:
                team?.isActive ??
                true,

            members:
                getMemberIds(),
        };
    };

    // ========================================================
    // SAVE TEAM
    // ========================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        setSuccessMessage("");
        setErrors({});

        if (!team) {
            setErrors({
                general:
                    "Team not found.",
            });

            return;
        }

        if (!validateForm()) {
            return;
        }

        const teamId =
            getTeamId(team);

        if (!teamId) {
            setErrors({
                general:
                    "Team ID is missing.",
            });

            return;
        }

        try {
            setSaving(true);

            const payload =
                buildUpdatePayload();

            // =================================================
            // BACKEND TEAM UPDATE
            // =================================================

            const updatedTeam =
                await updateTeam(
                    teamId,
                    payload
                );

            const finalTeam =
                updatedTeam ||
                {
                    ...team,
                    ...payload,
                };

            // =================================================
            // UPDATE PARENT
            // =================================================

            if (onSave) {
                await onSave(
                    finalTeam
                );
            }

            if (onTeamUpdated) {
                onTeamUpdated(
                    finalTeam
                );
            }

            setSuccessMessage(
                "Team updated successfully."
            );

            setTimeout(() => {
                onClose?.();
            }, 700);
        } catch (error) {
            console.error(
                "Unable to update team:",
                error
            );

            setErrors({
                general:
                    error?.response?.data
                        ?.message ||
                    error?.response?.data
                        ?.error ||
                    error?.message ||
                    "Unable to update team. Please try again.",
            });
        } finally {
            setSaving(false);
        }
    };

    // ========================================================
    // REMOVE MEMBER
    // ========================================================

    const handleRemoveMember = async (
        member,
        memberType
    ) => {
        const memberId =
            getMemberId(member);

        const memberName =
            getMemberName(member);

        const teamId =
            getTeamId(team);

        if (!teamId) {
            setErrors({
                general:
                    "Team ID is missing.",
            });

            return;
        }

        if (!memberId) {
            setErrors({
                general:
                    "Member ID is missing.",
            });

            return;
        }

        const confirmed =
            window.confirm(
                `Are you sure you want to remove ${memberName} from this team?`
            );

        if (!confirmed) {
            return;
        }

        try {
            setRemovingMemberId(
                String(memberId)
            );

            setErrors({});
            setSuccessMessage("");

            // =================================================
            // BACKEND REMOVE
            // =================================================

            const result =
                await removeMemberFromTeam(
                    teamId,
                    memberId
                );

            // =================================================
            // UPDATE LOCAL UI
            // =================================================

            if (
                memberType ===
                "developer"
            ) {
                setDevelopers(
                    (previous) =>
                        previous.filter(
                            (item) =>
                                String(
                                    getMemberId(
                                        item
                                    )
                                ) !==
                                String(
                                    memberId
                                )
                        )
                );
            }

            if (
                memberType ===
                "staff"
            ) {
                setStaff(
                    (previous) =>
                        previous.filter(
                            (item) =>
                                String(
                                    getMemberId(
                                        item
                                    )
                                ) !==
                                String(
                                    memberId
                                )
                        )
                );
            }

            // =================================================
            // UPDATE PARENT IF SERVICE RETURNS TEAM
            // =================================================

            if (result?.team) {
                onTeamUpdated?.(
                    result.team
                );
            }

            setSuccessMessage(
                `${memberName} was removed from the team.`
            );
        } catch (error) {
            console.error(
                "Unable to remove team member:",
                error
            );

            setErrors({
                general:
                    error?.response?.data
                        ?.message ||
                    error?.response?.data
                        ?.error ||
                    error?.message ||
                    "Unable to remove team member.",
            });
        } finally {
            setRemovingMemberId(null);
        }
    };

    // ========================================================
    // ASSIGN / CHANGE MANAGER
    // ========================================================

    const handleAssignManager = () => {
        const teamId =
            getTeamId(team);

        if (!teamId) {
            setErrors({
                general:
                    "Team ID is missing.",
            });

            return;
        }

        setErrors({});
        setSuccessMessage("");

        /*
         * TEAM-005 is already implemented by
         * AssignManagerModal.
         *
         * We intentionally do not duplicate the
         * manager assignment API call here.
         *
         * The parent opens AssignManagerModal and
         * passes the selected team.
         */

        if (onAssignManager) {
            onAssignManager(team);

            return;
        }

        setErrors({
            general:
                "Manager assignment is not available. Please open the Assign Manager action.",
        });
    };

    // ========================================================
    // ADD MEMBERS
    // ========================================================

    const handleAddMembers = (
        memberType,
        options = {}
    ) => {
        if (onAddMembers) {
            onAddMembers(
                team,
                memberType,
                options
            );

            return;
        }

        setSuccessMessage(
            "Use Add Members to add users to this team."
        );
    };

    // ========================================================
    // CLOSE
    // ========================================================

    const handleClose = () => {
        if (
            saving ||
            removingMemberId
        ) {
            return;
        }

        setErrors({});
        setSuccessMessage("");

        onClose?.();
    };

    // ========================================================
    // MEMBER CARD
    // ========================================================

    const renderMemberCard = (
        member,
        memberType
    ) => {
        const memberName =
            getMemberName(member);

        const memberId =
            getMemberId(member);

        const email =
            getMemberEmail(member);

        const isRemoving =
            String(
                removingMemberId || ""
            ) ===
            String(memberId || "");

        return (
            <div
                key={String(
                    memberId ||
                        memberName
                )}
                className="
                    group
                    flex
                    flex-col
                    gap-3
                    rounded-xl
                    border
                    border-border
                    bg-background
                    p-4
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    hover:border-primary/40
                    hover:shadow-md
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >
                {/* MEMBER INFORMATION */}

                <div
                    className="
                        flex
                        min-w-0
                        items-center
                        gap-3
                    "
                >
                    <div
                        className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-primary/10
                            text-primary
                            ring-1
                            ring-primary/20
                        "
                    >
                        <UserRound
                            size={19}
                        />
                    </div>

                    <div className="min-w-0">
                        <p
                            className="
                                truncate
                                text-sm
                                font-semibold
                                text-foreground
                            "
                        >
                            {memberName}
                        </p>

                        {email && (
                            <p
                                className="
                                    truncate
                                    text-xs
                                    text-muted-foreground
                                "
                            >
                                {email}
                            </p>
                        )}

                        <span
                            className="
                                mt-1
                                inline-flex
                                rounded-full
                                bg-muted
                                px-2
                                py-0.5
                                text-[10px]
                                font-semibold
                                uppercase
                                tracking-wide
                                text-muted-foreground
                            "
                        >
                            {memberType}
                        </span>
                    </div>
                </div>

                {/* ACTIONS */}

                <div
                    className="
                        flex
                        shrink-0
                        items-center
                        gap-2
                    "
                >
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                            handleAddMembers(
                                memberType,
                                {
                                    mode: "change",
                                    member,
                                }
                            )
                        }
                        disabled={
                            Boolean(
                                removingMemberId
                            )
                        }
                        className="
                            h-9
                            border-primary/30
                            px-3
                            text-xs
                            font-semibold
                            text-primary
                            transition-all
                            duration-200
                            hover:border-primary
                            hover:bg-primary/10
                            hover:text-primary
                        "
                    >
                        <RefreshCw
                            size={14}
                            className="mr-1.5"
                        />

                        Change
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                            handleRemoveMember(
                                member,
                                memberType
                            )
                        }
                        disabled={
                            isRemoving
                        }
                        className="
                            h-9
                            border-red-500/30
                            px-3
                            text-xs
                            font-semibold
                            text-red-600
                            transition-all
                            duration-200
                            hover:border-red-500
                            hover:bg-red-500/10
                            hover:text-red-600
                            dark:text-red-400
                        "
                    >
                        <UserMinus
                            size={14}
                            className="mr-1.5"
                        />

                        {isRemoving
                            ? "Removing..."
                            : "Remove"}
                    </Button>
                </div>
            </div>
        );
    };

    // ========================================================
    // RETURN
    // ========================================================

    return (
        <>
            {/* ==================================================
                HEADER
            ================================================== */}

            <div
                className="
                    border-b
                    border-border
                    bg-card
                    px-6
                    py-5
                "
            >
                <DialogHeader>
                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            gap-3
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
                                    bg-primary/10
                                    text-primary
                                    ring-1
                                    ring-primary/20
                                    shadow-sm
                                "
                            >
                                <UsersRound
                                    size={23}
                                />
                            </div>

                            <div>
                                <DialogTitle
                                    className="
                                        text-xl
                                        font-bold
                                        text-foreground
                                    "
                                >
                                    Edit Team
                                </DialogTitle>

                                <DialogDescription
                                    className="
                                        mt-1
                                        text-sm
                                        text-muted-foreground
                                    "
                                >
                                    Update team
                                    information,
                                    leadership and
                                    team members.
                                </DialogDescription>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={
                                handleClose
                            }
                            disabled={
                                saving ||
                                Boolean(
                                    removingMemberId
                                )
                            }
                            className="
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-border
                                bg-background
                                text-muted-foreground
                                transition-all
                                duration-200
                                hover:rotate-90
                                hover:border-red-500/40
                                hover:bg-red-500/10
                                hover:text-red-500
                                disabled:cursor-not-allowed
                                disabled:opacity-40
                            "
                            aria-label="Close"
                            title="Close"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </DialogHeader>
            </div>

            {/* ==================================================
                FORM
            ================================================== */}

            <form
                onSubmit={
                    handleSubmit
                }
                className="
                    max-h-[78vh]
                    overflow-y-auto
                "
            >
                <div
                    className="
                        space-y-6
                        bg-background
                        px-6
                        py-6
                    "
                >
                    {/* GENERAL ERROR */}

                    {errors.general && (
                        <div
                            className="
                                rounded-xl
                                border
                                border-red-500/30
                                bg-red-500/10
                                px-4
                                py-3
                                text-sm
                                font-medium
                                text-red-600
                                dark:text-red-400
                            "
                        >
                            {errors.general}
                        </div>
                    )}

                    {/* SUCCESS */}

                    {successMessage && (
                        <div
                            className="
                                rounded-xl
                                border
                                border-emerald-500/30
                                bg-emerald-500/10
                                px-4
                                py-3
                                text-sm
                                font-medium
                                text-emerald-600
                                dark:text-emerald-400
                            "
                        >
                            {successMessage}
                        </div>
                    )}

                    {/* ==================================================
                        BASIC TEAM INFORMATION
                    ================================================== */}

                    <section
                        className="
                            rounded-2xl
                            border
                            border-border
                            bg-card
                            p-5
                            shadow-sm
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
                                    rounded-xl
                                    bg-primary/10
                                    text-primary
                                "
                            >
                                <UsersRound
                                    size={19}
                                />
                            </div>

                            <div>
                                <h3
                                    className="
                                        text-base
                                        font-bold
                                        text-foreground
                                    "
                                >
                                    Team Information
                                </h3>

                                <p
                                    className="
                                        text-xs
                                        text-muted-foreground
                                    "
                                >
                                    Update the basic
                                    information
                                    about this
                                    team.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            {/* TEAM NAME */}

                            <div className="space-y-2">
                                <Label
                                    htmlFor="edit-team-name"
                                    className="
                                        text-sm
                                        font-semibold
                                        text-foreground
                                    "
                                >
                                    Team Name

                                    <span className="ml-1 text-red-500">
                                        *
                                    </span>
                                </Label>

                                <Input
                                    id="edit-team-name"
                                    name="name"
                                    value={
                                        formData.name
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        saving
                                    }
                                    placeholder="Enter team name"
                                    className="
                                        h-11
                                        border-border
                                        bg-background
                                        text-foreground
                                        transition-all
                                        duration-200
                                        hover:border-primary/50
                                        focus:border-primary
                                        focus:ring-2
                                        focus:ring-primary/20
                                    "
                                />

                                {errors.name && (
                                    <p
                                        className="
                                            text-xs
                                            font-medium
                                            text-red-500
                                        "
                                    >
                                        {
                                            errors.name
                                        }
                                    </p>
                                )}
                            </div>

                            {/* DESCRIPTION */}

                            <div className="space-y-2">
                                <Label
                                    htmlFor="edit-team-description"
                                    className="
                                        text-sm
                                        font-semibold
                                        text-foreground
                                    "
                                >
                                    Team Description

                                    <span
                                        className="
                                            ml-2
                                            text-xs
                                            font-normal
                                            text-muted-foreground
                                        "
                                    >
                                        Optional
                                    </span>
                                </Label>

                                <div className="relative">
                                    <FileText
                                        size={18}
                                        className="
                                            absolute
                                            left-3
                                            top-3
                                            text-primary
                                        "
                                    />

                                    <Textarea
                                        id="edit-team-description"
                                        name="description"
                                        value={
                                            formData.description
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        disabled={
                                            saving
                                        }
                                        placeholder="Describe the purpose of this team..."
                                        rows={4}
                                        className="
                                            resize-none
                                            border-border
                                            bg-background
                                            pl-10
                                            text-sm
                                            text-foreground
                                            transition-all
                                            duration-200
                                            hover:border-primary/50
                                            focus:border-primary
                                            focus:ring-2
                                            focus:ring-primary/20
                                        "
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ==================================================
                        TEAM LEADERSHIP
                    ================================================== */}

                    <section
                        className="
                            rounded-2xl
                            border
                            border-border
                            bg-card
                            p-5
                            shadow-sm
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
                                    rounded-xl
                                    bg-primary/10
                                    text-primary
                                "
                            >
                                <ShieldCheck
                                    size={19}
                                />
                            </div>

                            <div>
                                <h3
                                    className="
                                        text-base
                                        font-bold
                                        text-foreground
                                    "
                                >
                                    Team Leadership
                                </h3>

                                <p
                                    className="
                                        text-xs
                                        text-muted-foreground
                                    "
                                >
                                    Manage team
                                    leadership
                                    through the
                                    appropriate
                                    management
                                    flow.
                                </p>
                            </div>
                        </div>

                        <div
                            className="
                                grid
                                grid-cols-1
                                gap-5
                                lg:grid-cols-2
                            "
                        >
                            {/* MANAGER */}

                            <div
                                className="
                                    rounded-xl
                                    border
                                    border-border
                                    bg-background
                                    p-4
                                "
                            >
                                <div
                                    className="
                                        flex
                                        items-start
                                        justify-between
                                        gap-4
                                    "
                                >
                                    <div className="min-w-0">
                                        <p
                                            className="
                                                text-xs
                                                font-semibold
                                                uppercase
                                                tracking-wide
                                                text-muted-foreground
                                            "
                                        >
                                            Team Manager
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                truncate
                                                text-base
                                                font-bold
                                                text-foreground
                                            "
                                        >
                                            {getManagerName(
                                                team
                                            ) ||
                                                "Not assigned"}
                                        </p>

                                        {getManagerEmail(
                                            team
                                        ) && (
                                            <p
                                                className="
                                                    mt-1
                                                    truncate
                                                    text-xs
                                                    text-muted-foreground
                                                "
                                            >
                                                {
                                                    getManagerEmail(
                                                        team
                                                    )
                                                }
                                            </p>
                                        )}
                                    </div>

                                    <UserCog
                                        size={20}
                                        className="shrink-0 text-primary"
                                    />
                                </div>

                                {/* MANAGER ID IS DISPLAY ONLY */}

                                {getManagerId(team) && (
                                    <div
                                        className="
                                            mt-3
                                            rounded-lg
                                            bg-muted/60
                                            px-3
                                            py-2
                                        "
                                    >
                                        <p
                                            className="
                                                text-[10px]
                                                font-semibold
                                                uppercase
                                                tracking-wide
                                                text-muted-foreground
                                            "
                                        >
                                            Manager ID
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                truncate
                                                font-mono
                                                text-xs
                                                text-foreground
                                            "
                                        >
                                            {
                                                getManagerId(
                                                    team
                                                )
                                            }
                                        </p>
                                    </div>
                                )}

                                <Button
                                    type="button"
                                    onClick={
                                        handleAssignManager
                                    }
                                    disabled={
                                        saving
                                    }
                                    className="
                                        mt-4
                                        h-10
                                        w-full
                                        rounded-xl
                                        text-sm
                                        font-semibold
                                        shadow-sm
                                        transition-all
                                        duration-200
                                        hover:-translate-y-0.5
                                        hover:shadow-md
                                    "
                                >
                                    <UserCog
                                        size={16}
                                        className="mr-2"
                                    />

                                    {getManagerId(
                                        team
                                    )
                                        ? "Change Manager"
                                        : "Assign Manager"}
                                </Button>

                                <p
                                    className="
                                        mt-2
                                        text-[11px]
                                        leading-5
                                        text-muted-foreground
                                    "
                                >
                                    Manager assignment
                                    uses the TEAM-005
                                    manager assignment
                                    flow and backend
                                    service.
                                </p>
                            </div>

                            {/* TEAM LEADER */}

                            <div
                                className="
                                    rounded-xl
                                    border
                                    border-border
                                    bg-background
                                    p-4
                                "
                            >
                                <div
                                    className="
                                        mb-3
                                        flex
                                        items-center
                                        justify-between
                                        gap-3
                                    "
                                >
                                    <div>
                                        <p
                                            className="
                                                text-xs
                                                font-semibold
                                                uppercase
                                                tracking-wide
                                                text-muted-foreground
                                            "
                                        >
                                            Team Leader
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                text-base
                                                font-bold
                                                text-foreground
                                            "
                                        >
                                            {formData.teamLeader ||
                                                "Not assigned"}
                                        </p>
                                    </div>

                                    <UserRoundCog
                                        size={20}
                                        className="text-primary"
                                    />
                                </div>

                                <Input
                                    name="teamLeader"
                                    value={
                                        formData.teamLeader
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        saving
                                    }
                                    placeholder="Enter team leader"
                                    className="
                                        h-10
                                        w-full
                                    "
                                />

                                <p
                                    className="
                                        mt-2
                                        text-[11px]
                                        leading-5
                                        text-muted-foreground
                                    "
                                >
                                    Team leader update
                                    will be handled
                                    through the member
                                    management flow.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* ==================================================
                        DEVELOPERS
                    ================================================== */}

                    <section
                        className="
                            rounded-2xl
                            border
                            border-border
                            bg-card
                            p-5
                            shadow-sm
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
                                        rounded-xl
                                        bg-blue-500/10
                                        text-blue-600
                                        dark:text-blue-400
                                    "
                                >
                                    <Code2
                                        size={20}
                                    />
                                </div>

                                <div>
                                    <h3
                                        className="
                                            text-base
                                            font-bold
                                            text-foreground
                                        "
                                    >
                                        Developers
                                    </h3>

                                    <p
                                        className="
                                            text-xs
                                            text-muted-foreground
                                        "
                                    >
                                        {
                                            developers.length
                                        }{" "}
                                        developer
                                        {developers.length !==
                                        1
                                            ? "s"
                                            : ""}
                                    </p>
                                </div>
                            </div>

                            <Button
                                type="button"
                                onClick={() =>
                                    handleAddMembers(
                                        "developer"
                                    )
                                }
                                disabled={
                                    saving
                                }
                                className="
                                    h-10
                                    rounded-xl
                                    px-4
                                    text-sm
                                    font-semibold
                                    shadow-sm
                                    transition-all
                                    duration-200
                                    hover:-translate-y-0.5
                                    hover:shadow-md
                                "
                            >
                                <UserPlus
                                    size={16}
                                    className="mr-2"
                                />

                                Add Member
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {developers.length >
                            0 ? (
                                developers.map(
                                    (member) =>
                                        renderMemberCard(
                                            member,
                                            "developer"
                                        )
                                )
                            ) : (
                                <div
                                    className="
                                        rounded-xl
                                        border
                                        border-dashed
                                        border-border
                                        px-5
                                        py-8
                                        text-center
                                    "
                                >
                                    <Code2
                                        size={28}
                                        className="
                                            mx-auto
                                            mb-2
                                            text-muted-foreground
                                        "
                                    />

                                    <p
                                        className="
                                            text-sm
                                            font-medium
                                            text-muted-foreground
                                        "
                                    >
                                        No developers
                                        assigned
                                    </p>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            handleAddMembers(
                                                "developer"
                                            )
                                        }
                                        disabled={
                                            saving
                                        }
                                        className="
                                            mt-3
                                            h-9
                                            text-xs
                                        "
                                    >
                                        <UserPlus
                                            size={14}
                                            className="mr-2"
                                        />

                                        Add Developer
                                    </Button>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* ==================================================
                        STAFF
                    ================================================== */}

                    <section
                        className="
                            rounded-2xl
                            border
                            border-border
                            bg-card
                            p-5
                            shadow-sm
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
                                        rounded-xl
                                        bg-violet-500/10
                                        text-violet-600
                                        dark:text-violet-400
                                    "
                                >
                                    <BriefcaseBusiness
                                        size={20}
                                    />
                                </div>

                                <div>
                                    <h3
                                        className="
                                            text-base
                                            font-bold
                                            text-foreground
                                        "
                                    >
                                        Staff
                                    </h3>

                                    <p
                                        className="
                                            text-xs
                                            text-muted-foreground
                                        "
                                    >
                                        {
                                            staff.length
                                        }{" "}
                                        staff member
                                        {staff.length !==
                                        1
                                            ? "s"
                                            : ""}
                                    </p>
                                </div>
                            </div>

                            <Button
                                type="button"
                                onClick={() =>
                                    handleAddMembers(
                                        "staff"
                                    )
                                }
                                disabled={
                                    saving
                                }
                                className="
                                    h-10
                                    rounded-xl
                                    px-4
                                    text-sm
                                    font-semibold
                                    shadow-sm
                                    transition-all
                                    duration-200
                                    hover:-translate-y-0.5
                                    hover:shadow-md
                                "
                            >
                                <UserPlus
                                    size={16}
                                    className="mr-2"
                                />

                                Add Member
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {staff.length > 0 ? (
                                staff.map(
                                    (member) =>
                                        renderMemberCard(
                                            member,
                                            "staff"
                                        )
                                )
                            ) : (
                                <div
                                    className="
                                        rounded-xl
                                        border
                                        border-dashed
                                        border-border
                                        px-5
                                        py-8
                                        text-center
                                    "
                                >
                                    <BriefcaseBusiness
                                        size={28}
                                        className="
                                            mx-auto
                                            mb-2
                                            text-muted-foreground
                                        "
                                    />

                                    <p
                                        className="
                                            text-sm
                                            font-medium
                                            text-muted-foreground
                                        "
                                    >
                                        No staff
                                        members
                                        assigned
                                    </p>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            handleAddMembers(
                                                "staff"
                                            )
                                        }
                                        disabled={
                                            saving
                                        }
                                        className="
                                            mt-3
                                            h-9
                                            text-xs
                                        "
                                    >
                                        <UserPlus
                                            size={14}
                                            className="mr-2"
                                        />

                                        Add Staff
                                    </Button>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* ==================================================
                    FOOTER
                ================================================== */}

                <div
                    className="
                        flex
                        items-center
                        justify-end
                        gap-3
                        border-t
                        border-border
                        bg-card
                        px-6
                        py-4
                    "
                >
                    <Button
                        type="button"
                        variant="outline"
                        onClick={
                            handleClose
                        }
                        disabled={
                            saving ||
                            Boolean(
                                removingMemberId
                            )
                        }
                        className="
                            h-10
                            border-border
                            px-5
                            transition-all
                            duration-200
                            hover:border-primary/50
                            hover:bg-primary/10
                        "
                    >
                        <X
                            size={16}
                            className="mr-2"
                        />

                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        disabled={
                            saving ||
                            !team ||
                            Boolean(
                                removingMemberId
                            )
                        }
                        className="
                            h-10
                            bg-primary
                            px-5
                            text-primary-foreground
                            shadow-sm
                            transition-all
                            duration-200
                            hover:-translate-y-0.5
                            hover:shadow-md
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        <Save
                            size={16}
                            className="mr-2"
                        />

                        {saving
                            ? "Saving..."
                            : "Save Changes"}
                    </Button>
                </div>
            </form>
        </>
    );
}

export default EditTeamModal;