import { useEffect, useMemo, useState } from "react";

import {
    Save,
    X,
    UserRound,
    Mail,
    Phone,
    Shield,
    Building2,
    UsersRound,
    Loader2,
    AlertTriangle,
} from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/* =========================================================
   Helpers
========================================================= */

const normalizeValue = (value) =>
    String(value ?? "")
        .trim()
        .toLowerCase()
        .replace(/[_-]+/g, " ")
        .replace(/\s+/g, " ");

const getId = (item) => {
    if (item === null || item === undefined) {
        return "";
    }

    if (
        typeof item === "string" ||
        typeof item === "number"
    ) {
        return String(item);
    }

    return String(
        item.id ??
            item.value ??
            item.roleId ??
            item.contributorTypeId ??
            item.specializationId ??
            ""
    );
};

const getName = (item) => {
    if (item === null || item === undefined) {
        return "";
    }

    if (
        typeof item === "string" ||
        typeof item === "number"
    ) {
        return String(item);
    }

    return String(
        item.name ??
            item.label ??
            item.title ??
            item.displayName ??
            item.roleName ??
            item.contributorTypeName ??
            item.specializationName ??
            item.value ??
            ""
    );
};

const findByIdOrName = (
    items,
    id,
    name
) => {
    if (!Array.isArray(items)) {
        return null;
    }

    const normalizedName =
        normalizeValue(name);

    if (id !== "" && id !== null && id !== undefined) {
        const byId = items.find(
            (item) =>
                String(getId(item)) ===
                String(id)
        );

        if (byId) {
            return byId;
        }
    }

    if (normalizedName) {
        const byName = items.find(
            (item) =>
                normalizeValue(
                    getName(item)
                ) === normalizedName
        );

        if (byName) {
            return byName;
        }
    }

    return null;
};

const isContributor = (role) => {
    return (
        normalizeValue(
            getName(role)
        ) === "contributor"
    );
};

const isDeveloper = (type) => {
    return (
        normalizeValue(
            getName(type)
        ) === "developer"
    );
};

const isStaff = (type) => {
    return (
        normalizeValue(
            getName(type)
        ) === "staff"
    );
};

const isOther = (specialization) => {
    return (
        normalizeValue(
            getName(specialization)
        ) === "other"
    );
};

/* =========================================================
   EditUserDialog
========================================================= */

function EditUserDialog({
    open,
    onOpenChange,
    user,
    onSave,

    roles = [],
    contributorTypes = [],

    developerSpecializations = [],
    staffSpecializations = [],
    specializations = [],

    organizations = [],
    departments = [],
    teams = [],

    canChangeRole = true,
}) {
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        profileInformation: "",

        roleId: "",
        role: "",

        contributorTypeId: "",
        contributorType: "",

        specializationId: "",
        specialization: "",

        otherSpecialization: "",

        organizationId: "",
        organization: "",

        departmentId: "",
        department: "",

        teamId: "",
        team: "",
    });

    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    /* =====================================================
       CLOSE HANDLER
    ===================================================== */

    const handleClose = () => {
        if (saving) {
            return;
        }

        setErrors({});
        onOpenChange(false);
    };

    /* =====================================================
       Load User
    ===================================================== */

    useEffect(() => {
        if (!open || !user) {
            return;
        }

        const roleId =
            user.roleId ??
            user.role?.id ??
            "";

        const roleName =
            user.roleName ??
            user.role?.name ??
            user.role?.label ??
            user.role ??
            "";

        const contributorTypeId =
            user.contributorTypeId ??
            user.contributorType?.id ??
            "";

        const contributorTypeName =
            user.contributorTypeName ??
            user.contributorType?.name ??
            user.contributorType?.label ??
            user.contributorType ??
            "";

        const specializationId =
            user.specializationId ??
            user.specialization?.id ??
            "";

        const specializationName =
            user.specializationName ??
            user.specialization?.name ??
            user.specialization?.label ??
            user.specialization ??
            "";

        const organizationId =
            user.organizationId ??
            user.organization?.id ??
            "";

        const organizationName =
            user.organizationName ??
            user.organization?.name ??
            user.organization?.label ??
            user.organization ??
            "";

        const departmentId =
            user.departmentId ??
            user.department?.id ??
            "";

        const departmentName =
            user.departmentName ??
            user.department?.name ??
            user.department?.label ??
            user.department ??
            "";

        const teamId =
            user.teamId ??
            user.team?.id ??
            "";

        const teamName =
            user.teamName ??
            user.team?.name ??
            user.team?.label ??
            user.team ??
            "";

        setForm({
            fullName:
                user.fullName ??
                user.name ??
                "",

            email:
                user.email ??
                "",

            phone:
                user.phone ??
                "",

            profileInformation:
                user.profileInformation ??
                user.profile ??
                user.bio ??
                "",

            roleId:
                roleId !== ""
                    ? String(roleId)
                    : "",

            role:
                getName(roleName),

            contributorTypeId:
                contributorTypeId !== ""
                    ? String(
                          contributorTypeId
                      )
                    : "",

            contributorType:
                getName(
                    contributorTypeName
                ),

            specializationId:
                specializationId !== ""
                    ? String(
                          specializationId
                      )
                    : "",

            specialization:
                getName(
                    specializationName
                ),

            otherSpecialization:
                user.otherSpecialization ??
                "",

            organizationId:
                organizationId !== ""
                    ? String(
                          organizationId
                      )
                    : "",

            organization:
                getName(
                    organizationName
                ),

            departmentId:
                departmentId !== ""
                    ? String(
                          departmentId
                      )
                    : "",

            department:
                getName(
                    departmentName
                ),

            teamId:
                teamId !== ""
                    ? String(teamId)
                    : "",

            team:
                getName(teamName),
        });

        setErrors({});
    }, [open, user]);

    /* =====================================================
       Resolve Missing IDs
    ===================================================== */

    useEffect(() => {
        if (!open) {
            return;
        }

        setForm((previous) => {
            const next = {
                ...previous,
            };

            let changed = false;

            if (
                !previous.roleId &&
                previous.role
            ) {
                const role =
                    findByIdOrName(
                        roles,
                        "",
                        previous.role
                    );

                if (role) {
                    next.roleId =
                        getId(role);

                    changed = true;
                }
            }

            if (
                !previous.contributorTypeId &&
                previous.contributorType
            ) {
                const type =
                    findByIdOrName(
                        contributorTypes,
                        "",
                        previous.contributorType
                    );

                if (type) {
                    next.contributorTypeId =
                        getId(type);

                    changed = true;
                }
            }

            if (
                !previous.organizationId &&
                previous.organization
            ) {
                const organization =
                    findByIdOrName(
                        organizations,
                        "",
                        previous.organization
                    );

                if (organization) {
                    next.organizationId =
                        getId(
                            organization
                        );

                    changed = true;
                }
            }

            if (
                !previous.departmentId &&
                previous.department
            ) {
                const department =
                    findByIdOrName(
                        departments,
                        "",
                        previous.department
                    );

                if (department) {
                    next.departmentId =
                        getId(department);

                    changed = true;
                }
            }

            if (
                !previous.teamId &&
                previous.team
            ) {
                const team =
                    findByIdOrName(
                        teams,
                        "",
                        previous.team
                    );

                if (team) {
                    next.teamId =
                        getId(team);

                    changed = true;
                }
            }

            return changed
                ? next
                : previous;
        });
    }, [
        open,
        roles,
        contributorTypes,
        organizations,
        departments,
        teams,
    ]);

    /* =====================================================
       Selected Role
    ===================================================== */

    const selectedRole = useMemo(() => {
        return findByIdOrName(
            roles,
            form.roleId,
            form.role
        );
    }, [
        roles,
        form.roleId,
        form.role,
    ]);

    const contributorSelected =
        isContributor(
            selectedRole
        ) ||
        normalizeValue(
            form.role
        ) === "contributor";

    /* =====================================================
       Selected Contributor Type
    ===================================================== */

    const selectedContributorType =
        useMemo(() => {
            return findByIdOrName(
                contributorTypes,
                form.contributorTypeId,
                form.contributorType
            );
        }, [
            contributorTypes,
            form.contributorTypeId,
            form.contributorType,
        ]);

    const developerSelected =
        isDeveloper(
            selectedContributorType
        ) ||
        normalizeValue(
            form.contributorType
        ) === "developer";

    const staffSelected =
        isStaff(
            selectedContributorType
        ) ||
        normalizeValue(
            form.contributorType
        ) === "staff";

    /* =====================================================
       Available Specializations
    ===================================================== */

    const availableSpecializations =
        useMemo(() => {
            let result = [];

            if (developerSelected) {
                if (
                    Array.isArray(
                        developerSpecializations
                    ) &&
                    developerSpecializations.length >
                        0
                ) {
                    result =
                        developerSpecializations;
                } else {
                    result =
                        Array.isArray(
                            specializations
                        )
                            ? specializations.filter(
                                  (item) => {
                                      const type =
                                          normalizeValue(
                                              item?.contributorType ??
                                                  item?.contributorTypeName ??
                                                  item?.type ??
                                                  item?.category ??
                                                  ""
                                          );

                                      return (
                                          type ===
                                          "developer"
                                      );
                                  }
                              )
                            : [];
                }
            }

            if (staffSelected) {
                if (
                    Array.isArray(
                        staffSpecializations
                    ) &&
                    staffSpecializations.length >
                        0
                ) {
                    result =
                        staffSpecializations;
                } else {
                    result =
                        Array.isArray(
                            specializations
                        )
                            ? specializations.filter(
                                  (item) => {
                                      const type =
                                          normalizeValue(
                                              item?.contributorType ??
                                                  item?.contributorTypeName ??
                                                  item?.type ??
                                                  item?.category ??
                                                  ""
                                          );

                                      return (
                                          type ===
                                          "staff"
                                      );
                                  }
                              )
                            : [];
                }
            }

            if (
                result.length === 0 &&
                contributorSelected &&
                Array.isArray(
                    specializations
                )
            ) {
                result =
                    specializations;
            }

            const unique = [];
            const seen = new Set();

            result.forEach((item) => {
                const key =
                    getId(item) ||
                    normalizeValue(
                        getName(item)
                    );

                if (
                    key &&
                    !seen.has(key)
                ) {
                    seen.add(key);
                    unique.push(item);
                }
            });

            return unique;
        }, [
            contributorSelected,
            developerSelected,
            staffSelected,
            developerSpecializations,
            staffSpecializations,
            specializations,
        ]);

    /* =====================================================
       Selected Specialization
    ===================================================== */

    const selectedSpecialization =
        useMemo(() => {
            return findByIdOrName(
                availableSpecializations,
                form.specializationId,
                form.specialization
            );
        }, [
            availableSpecializations,
            form.specializationId,
            form.specialization,
        ]);

    const otherSelected =
        isOther(
            selectedSpecialization
        ) ||
        normalizeValue(
            form.specialization
        ) === "other";

    /* =====================================================
       Generic Field Update
    ===================================================== */

    const updateField = (
        field,
        value
    ) => {
        setForm((previous) => ({
            ...previous,
            [field]: value,
        }));

        setErrors((previous) => ({
            ...previous,
            [field]: "",
            general: "",
        }));
    };

    /* =====================================================
       Role Change
    ===================================================== */

    const handleRoleChange = (
        event
    ) => {
        const value =
            event.target.value;

        const role =
            roles.find(
                (item) =>
                    String(
                        getId(item)
                    ) ===
                    String(value)
            ) || null;

        setForm((previous) => ({
            ...previous,

            roleId: value,

            role: getName(role),

            contributorTypeId: "",
            contributorType: "",

            specializationId: "",
            specialization: "",

            otherSpecialization: "",
        }));

        setErrors({});
    };

    /* =====================================================
       Contributor Type Change
    ===================================================== */

    const handleContributorTypeChange =
        (event) => {
            const value =
                event.target.value;

            const type =
                contributorTypes.find(
                    (item) =>
                        String(
                            getId(item)
                        ) ===
                        String(value)
                ) || null;

            setForm((previous) => ({
                ...previous,

                contributorTypeId:
                    value,

                contributorType:
                    getName(type),

                specializationId: "",
                specialization: "",

                otherSpecialization: "",
            }));

            setErrors({});
        };

    /* =====================================================
       Specialization Change
    ===================================================== */

    const handleSpecializationChange =
        (event) => {
            const value =
                event.target.value;

            const specialization =
                availableSpecializations.find(
                    (item) =>
                        String(
                            getId(item)
                        ) ===
                        String(value)
                ) || null;

            const name =
                getName(
                    specialization
                );

            setForm((previous) => ({
                ...previous,

                specializationId:
                    value,

                specialization:
                    name,

                otherSpecialization:
                    isOther(
                        specialization
                    )
                        ? previous.otherSpecialization
                        : "",
            }));

            setErrors({});
        };

    /* =====================================================
       Organization Change
    ===================================================== */

    const handleOrganizationChange =
        (event) => {
            const value =
                event.target.value;

            const organization =
                organizations.find(
                    (item) =>
                        String(
                            getId(item)
                        ) ===
                        String(value)
                ) || null;

            setForm((previous) => ({
                ...previous,

                organizationId:
                    value,

                organization:
                    getName(
                        organization
                    ),

                departmentId: "",
                department: "",

                teamId: "",
                team: "",
            }));

            setErrors({});
        };

    /* =====================================================
       Department Change
    ===================================================== */

    const handleDepartmentChange =
        (event) => {
            const value =
                event.target.value;

            const department =
                departments.find(
                    (item) =>
                        String(
                            getId(item)
                        ) ===
                        String(value)
                ) || null;

            setForm((previous) => ({
                ...previous,

                departmentId:
                    value,

                department:
                    getName(
                        department
                    ),

                teamId: "",
                team: "",
            }));

            setErrors({});
        };

    /* =====================================================
       Team Change
    ===================================================== */

    const handleTeamChange = (
        event
    ) => {
        const value =
            event.target.value;

        const team =
            teams.find(
                (item) =>
                    String(
                        getId(item)
                    ) ===
                    String(value)
            ) || null;

        setForm((previous) => ({
            ...previous,

            teamId: value,

            team: getName(team),
        }));

        setErrors({});
    };

    /* =====================================================
       Validation
    ===================================================== */

    const validate = () => {
        const nextErrors = {};

        if (
            !form.fullName.trim()
        ) {
            nextErrors.fullName =
                "Full name is required.";
        }

        if (
            !form.email.trim()
        ) {
            nextErrors.email =
                "Email address is required.";
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                form.email.trim()
            )
        ) {
            nextErrors.email =
                "Please enter a valid email address.";
        }

        if (
            !form.roleId &&
            !form.role
        ) {
            nextErrors.role =
                "Please select a role.";
        }

        /* =================================================
           Role authorization
        ================================================= */

        if (
            !canChangeRole &&
            user
        ) {
            const originalRoleId =
                user.roleId ??
                user.role?.id ??
                "";

            const originalRoleName =
                user.roleName ??
                user.role?.name ??
                user.role?.label ??
                user.role ??
                "";

            const idChanged =
                String(
                    originalRoleId
                ) !==
                String(
                    form.roleId
                );

            const nameChanged =
                normalizeValue(
                    originalRoleName
                ) !==
                normalizeValue(
                    form.role
                );

            if (
                idChanged ||
                nameChanged
            ) {
                nextErrors.role =
                    "You are not authorized to change this user's role.";
            }
        }

        /* =================================================
           Contributor validation
        ================================================= */

        if (contributorSelected) {
            if (
                !form.contributorTypeId &&
                !form.contributorType
            ) {
                nextErrors.contributorType =
                    "Please select a Contributor Type.";
            }

            if (
                developerSelected &&
                !form.specializationId &&
                !form.specialization
            ) {
                nextErrors.specialization =
                    "Please select a Developer specialization.";
            }

            if (
                staffSelected &&
                !form.specializationId &&
                !form.specialization
            ) {
                nextErrors.specialization =
                    "Please select a Staff specialization.";
            }

            if (
                otherSelected &&
                !form.otherSpecialization.trim()
            ) {
                nextErrors.otherSpecialization =
                    "Please specify the specialization.";
            }

            if (
                form.specializationId &&
                availableSpecializations.length >
                    0
            ) {
                const valid =
                    availableSpecializations.some(
                        (item) =>
                            String(
                                getId(item)
                            ) ===
                            String(
                                form.specializationId
                            )
                    );

                if (!valid) {
                    nextErrors.specialization =
                        "Invalid specialization selected.";
                }
            }
        } else {
            if (
                form.contributorTypeId ||
                form.contributorType ||
                form.specializationId ||
                form.specialization
            ) {
                nextErrors.contributorType =
                    "Contributor Type and Specialization are only available for Contributor users.";
            }
        }

        setErrors(nextErrors);

        return (
            Object.keys(
                nextErrors
            ).length === 0
        );
    };

    /* =====================================================
       Submit
    ===================================================== */

    const handleSubmit = async (
        event
    ) => {
        event.preventDefault();

        if (!user) {
            setErrors({
                general:
                    "User not found.",
            });

            return;
        }

        if (!validate()) {
            return;
        }

        if (
            typeof onSave !==
            "function"
        ) {
            setErrors({
                general:
                    "Update handler is not connected. Please check AdminUsers.jsx.",
            });

            return;
        }

        setSaving(true);

        try {
            const originalRoleId =
                user.roleId ??
                user.role?.id ??
                "";

            const originalRoleName =
                user.roleName ??
                user.role?.name ??
                user.role?.label ??
                user.role ??
                "";

            const newRoleId =
                form.roleId || "";

            const newRoleName =
                form.role || "";

            const roleChanged =
                String(
                    originalRoleId
                ) !==
                    String(
                        newRoleId
                    ) ||
                normalizeValue(
                    originalRoleName
                ) !==
                    normalizeValue(
                        newRoleName
                    );

            const finalSpecialization =
                contributorSelected
                    ? otherSelected
                        ? form.otherSpecialization.trim()
                        : form.specialization ||
                          null
                    : null;

            const payload = {
                ...user,

                id: user.id,

                fullName:
                    form.fullName.trim(),

                name:
                    form.fullName.trim(),

                email:
                    form.email.trim(),

                phone:
                    form.phone.trim(),

                profileInformation:
                    form.profileInformation.trim(),

                roleId:
                    form.roleId || null,

                role:
                    form.role || null,

                contributorTypeId:
                    contributorSelected
                        ? form.contributorTypeId ||
                          null
                        : null,

                contributorType:
                    contributorSelected
                        ? form.contributorType ||
                          null
                        : null,

                specializationId:
                    contributorSelected
                        ? form.specializationId ||
                          null
                        : null,

                specialization:
                    finalSpecialization,

                otherSpecialization:
                    contributorSelected &&
                    otherSelected
                        ? form.otherSpecialization.trim()
                        : null,

                organizationId:
                    form.organizationId ||
                    null,

                organization:
                    form.organization ||
                    null,

                departmentId:
                    form.departmentId ||
                    null,

                department:
                    form.department ||
                    null,

                teamId:
                    form.teamId ||
                    null,

                team:
                    form.team ||
                    null,

                updatedAt:
                    new Date().toISOString(),
            };

            const result =
                await onSave(
                    payload,
                    {
                        originalUser:
                            user,

                        roleChanged,

                        originalRoleId,

                        originalRoleName,

                        newRoleId,

                        newRoleName,
                    }
                );

            if (
                result !== false
            ) {
                setErrors({});
                onOpenChange(false);
            }
        } catch (error) {
            console.error(
                "Update user failed:",
                error
            );

            setErrors({
                general:
                    error?.message ||
                    "Unable to update user information. Please try again.",
            });
        } finally {
            setSaving(false);
        }
    };

    /* =====================================================
       Select Class
    ===================================================== */

    const selectClass =
        "h-10 w-full rounded-md border border-gray-700 bg-[#111827] px-3 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500";

    /* =====================================================
       Render
    ===================================================== */

    return (
        <Dialog
            open={open}
            onOpenChange={(value) => {
                if (!value) {
                    handleClose();
                    return;
                }

                if (!saving) {
                    onOpenChange(true);
                }
            }}
        >
            <DialogContent
                className="
                    max-h-[90vh]
                    max-w-4xl
                    overflow-y-auto
                    border-gray-700
                    bg-[#0f172a]
                    text-white
                "
            >
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <UserRound className="h-5 w-5" />
                        Edit User
                    </DialogTitle>

                    <DialogDescription className="text-gray-400">
                        Update the user's profile,
                        organization, team, role,
                        and applicable classification.
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
                    {/* Error */}

                    {errors.general && (
                        <div className="flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-300">
                            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />

                            <div>
                                <p className="font-medium">
                                    Update failed
                                </p>

                                <p className="text-sm">
                                    {
                                        errors.general
                                    }
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Basic Information */}

                    <section className="space-y-4">
                        <div>
                            <h3 className="flex items-center gap-2 text-base font-semibold">
                                <UserRound className="h-4 w-4" />
                                Basic Information
                            </h3>

                            <p className="text-sm text-gray-400">
                                Update the user's
                                account information.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {/* Full Name */}

                            <div className="space-y-2">
                                <Label>
                                    Full Name *
                                </Label>

                                <Input
                                    value={
                                        form.fullName
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        updateField(
                                            "fullName",
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter full name"
                                    className="border-gray-700 bg-[#111827] text-white"
                                />

                                {errors.fullName && (
                                    <p className="text-sm text-red-400">
                                        {
                                            errors.fullName
                                        }
                                    </p>
                                )}
                            </div>

                            {/* Email */}

                            <div className="space-y-2">
                                <Label>
                                    Email Address *
                                </Label>

                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />

                                    <Input
                                        type="email"
                                        value={
                                            form.email
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            updateField(
                                                "email",
                                                event.target.value
                                            )
                                        }
                                        placeholder="user@example.com"
                                        className="border-gray-700 bg-[#111827] pl-9 text-white"
                                    />
                                </div>

                                {errors.email && (
                                    <p className="text-sm text-red-400">
                                        {
                                            errors.email
                                        }
                                    </p>
                                )}
                            </div>

                            {/* Phone */}

                            <div className="space-y-2">
                                <Label>
                                    Phone Number
                                </Label>

                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />

                                    <Input
                                        value={
                                            form.phone
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            updateField(
                                                "phone",
                                                event.target.value
                                            )
                                        }
                                        placeholder="+251..."
                                        className="border-gray-700 bg-[#111827] pl-9 text-white"
                                    />
                                </div>
                            </div>

                            {/* Profile Information */}

                            <div className="space-y-2 md:col-span-2">
                                <Label>
                                    Profile Information
                                </Label>

                                <textarea
                                    value={
                                        form.profileInformation
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        updateField(
                                            "profileInformation",
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter profile information..."
                                    rows={4}
                                    className="
                                        w-full
                                        rounded-md
                                        border
                                        border-gray-700
                                        bg-[#111827]
                                        px-3
                                        py-2
                                        text-sm
                                        text-white
                                        outline-none
                                        placeholder:text-gray-500
                                        focus:border-blue-500
                                    "
                                />
                            </div>
                        </div>
                    </section>

                    {/* Role */}

                    <section className="space-y-4">
                        <div>
                            <h3 className="flex items-center gap-2 text-base font-semibold">
                                <Shield className="h-4 w-4" />
                                Role & User Type
                            </h3>

                            <p className="text-sm text-gray-400">
                                Configure the user's
                                role and Contributor
                                classification.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {/* Role */}

                            <div className="space-y-2">
                                <Label>
                                    Role *
                                </Label>

                                <select
                                    value={
                                        form.roleId
                                    }
                                    onChange={
                                        handleRoleChange
                                    }
                                    disabled={
                                        !canChangeRole
                                    }
                                    className={`${selectClass} ${
                                        !canChangeRole
                                            ? "cursor-not-allowed opacity-50"
                                            : ""
                                    }`}
                                >
                                    <option value="">
                                        Select Role
                                    </option>

                                    {roles.map(
                                        (
                                            role
                                        ) => (
                                            <option
                                                key={getId(
                                                    role
                                                )}
                                                value={getId(
                                                    role
                                                )}
                                            >
                                                {getName(
                                                    role
                                                )}
                                            </option>
                                        )
                                    )}
                                </select>

                                {!canChangeRole && (
                                    <p className="text-xs text-gray-500">
                                        You are not
                                        authorized to
                                        change this
                                        user's role.
                                    </p>
                                )}

                                {errors.role && (
                                    <p className="text-sm text-red-400">
                                        {
                                            errors.role
                                        }
                                    </p>
                                )}
                            </div>

                            {/* Contributor Type */}

                            {contributorSelected && (
                                <div className="space-y-2">
                                    <Label>
                                        Contributor Type *
                                    </Label>

                                    <select
                                        value={
                                            form.contributorTypeId
                                        }
                                        onChange={
                                            handleContributorTypeChange
                                        }
                                        className={
                                            selectClass
                                        }
                                    >
                                        <option value="">
                                            Select Contributor
                                            Type
                                        </option>

                                        {contributorTypes.map(
                                            (
                                                type
                                            ) => (
                                                <option
                                                    key={getId(
                                                        type
                                                    )}
                                                    value={getId(
                                                        type
                                                    )}
                                                >
                                                    {getName(
                                                        type
                                                    )}
                                                </option>
                                            )
                                        )}
                                    </select>

                                    {errors.contributorType && (
                                        <p className="text-sm text-red-400">
                                            {
                                                errors.contributorType
                                            }
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Specialization */}

                            {contributorSelected &&
                                (developerSelected ||
                                    staffSelected) && (
                                    <div className="space-y-2">
                                        <Label>
                                            {developerSelected
                                                ? "Developer Specialization *"
                                                : "Staff Specialization *"}
                                        </Label>

                                        <select
                                            value={
                                                form.specializationId
                                            }
                                            onChange={
                                                handleSpecializationChange
                                            }
                                            className={
                                                selectClass
                                            }
                                        >
                                            <option value="">
                                                Select
                                                Specialization
                                            </option>

                                            {availableSpecializations.map(
                                                (
                                                    specialization
                                                ) => (
                                                    <option
                                                        key={getId(
                                                            specialization
                                                        )}
                                                        value={getId(
                                                            specialization
                                                        )}
                                                    >
                                                        {getName(
                                                            specialization
                                                        )}
                                                    </option>
                                                )
                                            )}
                                        </select>

                                        {errors.specialization && (
                                            <p className="text-sm text-red-400">
                                                {
                                                    errors.specialization
                                                }
                                            </p>
                                        )}
                                    </div>
                                )}

                            {/* Other Specialization */}

                            {contributorSelected &&
                                otherSelected && (
                                    <div className="space-y-2 md:col-span-2">
                                        <Label>
                                            Specify
                                            Specialization *
                                        </Label>

                                        <Input
                                            value={
                                                form.otherSpecialization
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                updateField(
                                                    "otherSpecialization",
                                                    event.target.value
                                                )
                                            }
                                            placeholder="Enter specialization"
                                            className="border-gray-700 bg-[#111827] text-white"
                                        />

                                        {errors.otherSpecialization && (
                                            <p className="text-sm text-red-400">
                                                {
                                                    errors.otherSpecialization
                                                }
                                            </p>
                                        )}
                                    </div>
                                )}
                        </div>
                    </section>

                    {/* Organization */}

                    <section className="space-y-4">
                        <div>
                            <h3 className="flex items-center gap-2 text-base font-semibold">
                                <Building2 className="h-4 w-4" />
                                Organization & Assignment
                            </h3>

                            <p className="text-sm text-gray-400">
                                Assign the user to
                                an organization,
                                department, and team.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            {/* Organization */}

                            <div className="space-y-2">
                                <Label>
                                    Organization
                                </Label>

                                <select
                                    value={
                                        form.organizationId
                                    }
                                    onChange={
                                        handleOrganizationChange
                                    }
                                    className={
                                        selectClass
                                    }
                                >
                                    <option value="">
                                        Not assigned
                                    </option>

                                    {organizations.map(
                                        (
                                            organization
                                        ) => (
                                            <option
                                                key={getId(
                                                    organization
                                                )}
                                                value={getId(
                                                    organization
                                                )}
                                            >
                                                {getName(
                                                    organization
                                                )}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            {/* Department */}

                            <div className="space-y-2">
                                <Label>
                                    Department
                                </Label>

                                <select
                                    value={
                                        form.departmentId
                                    }
                                    onChange={
                                        handleDepartmentChange
                                    }
                                    className={
                                        selectClass
                                    }
                                >
                                    <option value="">
                                        Not assigned
                                    </option>

                                    {departments.map(
                                        (
                                            department
                                        ) => (
                                            <option
                                                key={getId(
                                                    department
                                                )}
                                                value={getId(
                                                    department
                                                )}
                                            >
                                                {getName(
                                                    department
                                                )}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            {/* Team */}

                            <div className="space-y-2">
                                <Label>
                                    Team
                                </Label>

                                <div className="relative">
                                    <UsersRound className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-gray-500" />

                                    <select
                                        value={
                                            form.teamId
                                        }
                                        onChange={
                                            handleTeamChange
                                        }
                                        className={`${selectClass} pl-9`}
                                    >
                                        <option value="">
                                            Not assigned
                                        </option>

                                        {teams.map(
                                            (
                                                team
                                            ) => (
                                                <option
                                                    key={getId(
                                                        team
                                                    )}
                                                    value={getId(
                                                        team
                                                    )}
                                                >
                                                    {getName(
                                                        team
                                                    )}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Footer */}

                    <DialogFooter className="border-t border-gray-700 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={
                                handleClose
                            }
                            disabled={
                                saving
                            }
                            className="
                                border-gray-600
                                bg-transparent
                                text-white
                                hover:bg-gray-800
                            "
                        >
                            <X className="mr-2 h-4 w-4" />
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={
                                saving
                            }
                            className="
                                bg-blue-600
                                text-white
                                hover:bg-blue-700
                            "
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default EditUserDialog;