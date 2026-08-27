
import { useEffect, useState } from "react";

import {
    X,
    UserRound,
    Mail,
    Phone,
    LockKeyhole,
    ShieldCheck,
    UsersRound,
    Code2,
    KeyRound,
    CheckCircle2,
    AlertCircle,
    Eye,
    EyeOff,
} from "lucide-react";

import api from "@/services/api";
import { createUser } from "@/services/userService";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";

import {
    Alert,
    AlertDescription,
} from "@/components/ui/alert";

// ============================================================
// ACCOUNT OPTIONS
// ============================================================

const ACCOUNT_CATEGORIES = [
    "Manager",
    "Contributor",
];

// Backend currently supports:
// IsActive = true  -> Active
// IsActive = false -> Inactive
const ACCOUNT_STATUSES = [
    "Active",
    "Inactive",
];

// ============================================================
// PERMISSIONS
// ============================================================

const PERMISSIONS = [
    {
        id: "dashboard.view",
        label: "View Dashboard",
    },
    {
        id: "users.view",
        label: "View Users",
    },
    {
        id: "users.create",
        label: "Create Users",
    },
    {
        id: "users.edit",
        label: "Edit Users",
    },
    {
        id: "users.delete",
        label: "Delete Users",
    },
    {
        id: "users.status",
        label: "Manage User Status",
    },
    {
        id: "activity.logs.view",
        label: "View Activity Logs",
    },
    {
        id: "roles.manage",
        label: "Manage Roles",
    },
    {
        id: "permissions.manage",
        label: "Manage Permissions",
    },
    {
        id: "projects.view",
        label: "View Projects",
    },
    {
        id: "projects.manage",
        label: "Manage Projects",
    },
    {
        id: "tasks.manage",
        label: "Manage Tasks",
    },
    {
        id: "reports.view",
        label: "View Reports",
    },
    {
        id: "reports.system.view",
        label: "View System Reports",
    },
    {
        id: "reports.export",
        label: "Export Reports",
    },
];

// ============================================================
// INITIAL FORM
// ============================================================

const initialForm = {
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",

    accountCategory: "",
    accountStatus: "Active",

    contributorType: "",
    contributorTypeId: "",

    contributorSubType: "",
    contributorSubTypeId: "",

    newContributorSubTypeName: "",

    permissions: [],
};

// ============================================================
// COMPONENT
// ============================================================

function CreateUserDialog({
    open,
    onClose,
    onUserCreated,
}) {
    const [form, setForm] =
        useState(initialForm);

    const [errors, setErrors] =
        useState({});

    const [showPassword, setShowPassword] =
        useState(false);

    const [submitting, setSubmitting] =
        useState(false);

    const [loadingTypes, setLoadingTypes] =
        useState(false);

    const [loadingSubTypes, setLoadingSubTypes] =
        useState(false);

    const [creatingSubType, setCreatingSubType] =
        useState(false);

    const [successMessage, setSuccessMessage] =
        useState("");

    const [contributorTypes, setContributorTypes] =
        useState([]);

    const [contributorSubTypes, setContributorSubTypes] =
        useState([]);

    // ========================================================
    // LOAD CONTRIBUTOR TYPES
    // ========================================================

    useEffect(() => {
        if (!open) {
            return;
        }

        loadContributorTypes();
    }, [open]);

    const loadContributorTypes = async () => {
        setLoadingTypes(true);

        try {
            console.log(
                "========== LOAD CONTRIBUTOR TYPES =========="
            );

            const response =
                await api.get(
                    "/ContributorTypes/active"
                );

            console.log(
    "========== RAW CONTRIBUTOR TYPES =========="
);

console.log(
    JSON.stringify(response.data, null, 2)
);

console.log(
    "==========================================="
);

            const data =
                response?.data;

            const types =
                Array.isArray(data)
                    ? data
                    : Array.isArray(data?.data)
                    ? data.data
                    : Array.isArray(data?.items)
                    ? data.items
                    : Array.isArray(data?.result)
                    ? data.result
                    : [];

                    console.log(
    "RAW CONTRIBUTOR TYPES:",
    JSON.stringify(types, null, 2)
);
           const normalizedTypes =
    types
        .map((type) => ({
            id:
                type?.id ??
                type?.Id ??
                type?.contributorTypeId ??
                type?.ContributorTypeId,

            name:
                type?.name ??
                type?.Name ??
                type?.typeName ??
                type?.TypeName ??
                type?.contributorTypeName ??
                type?.ContributorTypeName ??
                type?.displayName ??
                type?.DisplayName ??
                "",
        }))
        .filter(
            (type) =>
                type.id !== null &&
                type.id !== undefined &&
                String(type.name).trim() !== ""
        );

            console.log(
                "NORMALIZED CONTRIBUTOR TYPES:",
                normalizedTypes
            );

            setContributorTypes(
                normalizedTypes
            );

            setErrors((previous) => ({
                ...previous,
                contributorType: "",
            }));
        } catch (error) {
            console.error(
                "LOAD CONTRIBUTOR TYPES ERROR:",
                error
            );

            console.error(
                "STATUS:",
                error?.response?.status
            );

            console.error(
                "BACKEND:",
                error?.response?.data
            );

            setContributorTypes([]);

            setErrors((previous) => ({
                ...previous,
                contributorType:
                    getErrorMessage(
                        error,
                        "Unable to load contributor types."
                    ),
            }));
        } finally {
            setLoadingTypes(false);
        }
    };

    // ========================================================
    // LOAD CONTRIBUTOR SUBTYPES
    // ========================================================

    const loadContributorSubTypes =
        async (contributorTypeId) => {
            if (!contributorTypeId) {
                setContributorSubTypes([]);
                return;
            }

            setLoadingSubTypes(true);

            try {
                console.log(
                    "LOAD SUBTYPES FOR TYPE:",
                    contributorTypeId
                );

                const response =
                    await api.get(
                        `/ContributorSubTypes/type/${contributorTypeId}`
                    );

                console.log(
                    "SUBTYPES RESPONSE:",
                    response.data
                );

                const data =
                    response?.data;

                const subTypes =
                    Array.isArray(data)
                        ? data
                        : Array.isArray(data?.data)
                        ? data.data
                        : Array.isArray(data?.items)
                        ? data.items
                        : [];

              const normalizedSubTypes =
    subTypes
        .map((subType) => ({
            id:
                subType?.id ??
                subType?.Id ??
                subType?.contributorSubTypeId ??
                subType?.ContributorSubTypeId,

            name:
                subType?.name ??
                subType?.Name ??
                subType?.subTypeName ??
                subType?.SubTypeName ??
                subType?.contributorSubTypeName ??
                subType?.ContributorSubTypeName ??
                "",
        }))
        .filter(
            (subType) =>
                subType.id !== null &&
                subType.id !== undefined &&
                String(subType.name).trim() !== ""
        );

                console.log(
                    "NORMALIZED SUBTYPES:",
                    normalizedSubTypes
                );

                setContributorSubTypes(
                    normalizedSubTypes
                );

                setErrors((previous) => ({
                    ...previous,
                    contributorSubType: "",
                }));
            } catch (error) {
                console.error(
                    "LOAD CONTRIBUTOR SUBTYPES ERROR:",
                    error
                );

                console.error(
                    "STATUS:",
                    error?.response?.status
                );

                console.error(
                    "BACKEND:",
                    error?.response?.data
                );

                setContributorSubTypes([]);

                setErrors((previous) => ({
                    ...previous,
                    contributorSubType:
                        getErrorMessage(
                            error,
                            "Unable to load contributor subtypes."
                        ),
                }));
            } finally {
                setLoadingSubTypes(false);
            }
        };

    // ========================================================
    // FIELD UPDATE
    // ========================================================

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
            form: "",
        }));
    };

    // ========================================================
    // CATEGORY CHANGE
    // ========================================================

    const handleCategoryChange = (
        category
    ) => {
        setForm((previous) => ({
            ...previous,

            accountCategory:
                category,

            contributorType: "",
            contributorTypeId: "",

            contributorSubType: "",
            contributorSubTypeId: "",

            newContributorSubTypeName: "",
        }));

        setContributorSubTypes([]);

        setErrors((previous) => ({
            ...previous,
            accountCategory: "",
            contributorType: "",
            contributorSubType: "",
            newContributorSubTypeName: "",
        }));
    };

    // ========================================================
    // CONTRIBUTOR TYPE CHANGE
    // ========================================================

    const handleContributorTypeChange =
        async (value) => {
            console.log(
                "SELECTED CONTRIBUTOR TYPE:",
                value
            );

            const selectedType =
                contributorTypes.find(
                    (type) =>
                        String(type.id) ===
                        String(value)
                );

            if (!selectedType) {
                console.error(
                    "Contributor type not found:",
                    value
                );

                return;
            }

          const isTeamLeader =
    selectedType.name
        ?.trim()
        .toLowerCase() === "team leader";

setForm((previous) => ({
    ...previous,

    contributorType:
        selectedType.name,

    contributorTypeId:
        String(selectedType.id),

    contributorSubType:
        isTeamLeader
            ? ""
            : previous.contributorSubType,

    contributorSubTypeId:
        isTeamLeader
            ? ""
            : previous.contributorSubTypeId,

    newContributorSubTypeName:
        "",
}));

setContributorSubTypes([]);

if (!isTeamLeader) {
    await loadContributorSubTypes(
        selectedType.id
    );
}
        };

    // ========================================================
    // CONTRIBUTOR SUBTYPE CHANGE
    // ========================================================

    const handleContributorSubTypeChange =
        (value) => {
            const selectedSubType =
                contributorSubTypes.find(
                    (subType) =>
                        String(subType.id) ===
                        String(value)
                );

            const selectedId =
                selectedSubType?.id ??
                value;

            setForm((previous) => ({
                ...previous,

                contributorSubType:
                    selectedSubType?.name ??
                    "",

                contributorSubTypeId:
                    selectedId || "",

                newContributorSubTypeName:
                    selectedSubType?.name ===
                    "Other"
                        ? ""
                        : previous.newContributorSubTypeName,
            }));

            setErrors((previous) => ({
                ...previous,
                contributorSubType: "",
                newContributorSubTypeName: "",
            }));
        };

    // ========================================================
    // CREATE CUSTOM SUBTYPE
    // ========================================================

    const createCustomContributorSubType =
        async () => {
            const name =
                form.newContributorSubTypeName.trim();

            if (!name) {
                setErrors((previous) => ({
                    ...previous,
                    newContributorSubTypeName:
                        "Enter the new specialization name.",
                }));

                return null;
            }

            if (!form.contributorTypeId) {
                setErrors((previous) => ({
                    ...previous,
                    contributorType:
                        "Contributor type is required.",
                }));

                return null;
            }

            setCreatingSubType(true);

            try {
                const response =
                    await api.post(
                        "/ContributorSubTypes",
                        {
                            name,

                            description:
                                "Custom specialization created by an administrator.",

                            contributorTypeId:
                                form.contributorTypeId,
                        }
                    );

                console.log(
                    "CREATE SUBTYPE RESPONSE:",
                    response.data
                );

                const data =
                    response?.data;

                const createdSubType =
                    data?.data ??
                    data;

                const createdId =
                    createdSubType?.id ??
                    createdSubType?.Id ??
                    createdSubType?.contributorSubTypeId ??
                    createdSubType?.ContributorSubTypeId;

                if (!createdId) {
                    throw new Error(
                        "Backend did not return the created contributor subtype ID."
                    );
                }

                const normalizedSubType = {
                    id: createdId,

                    name:
                        createdSubType?.name ??
                        createdSubType?.Name ??
                        name,
                };

                setContributorSubTypes(
                    (previous) => [
                        ...previous,
                        normalizedSubType,
                    ]
                );

                setForm((previous) => ({
                    ...previous,

                    contributorSubType:
                        normalizedSubType.name,

                    contributorSubTypeId:
                        String(
                            normalizedSubType.id
                        ),

                    newContributorSubTypeName:
                        "",
                }));

                setErrors((previous) => ({
                    ...previous,
                    contributorSubType: "",
                    newContributorSubTypeName: "",
                    form: "",
                }));

                return normalizedSubType;
            } catch (error) {
                console.error(
                    "CREATE SUBTYPE ERROR:",
                    error
                );

                setErrors((previous) => ({
                    ...previous,
                    newContributorSubTypeName:
                        getErrorMessage(
                            error,
                            "Unable to create the specialization."
                        ),
                }));

                return null;
            } finally {
                setCreatingSubType(false);
            }
        };

    // ========================================================
    // PERMISSIONS
    // ========================================================

    const handlePermissionChange =
        (permissionId) => {
            setForm((previous) => {
                const current =
                    Array.isArray(
                        previous.permissions
                    )
                        ? previous.permissions
                        : [];

                const exists =
                    current.includes(
                        permissionId
                    );

                return {
                    ...previous,

                    permissions: exists
                        ? current.filter(
                              (permission) =>
                                  permission !==
                                  permissionId
                          )
                        : [
                              ...current,
                              permissionId,
                          ],
                };
            });

            setErrors((previous) => ({
                ...previous,
                permissions: "",
            }));
        };

    // ========================================================
    // VALIDATION
    // ========================================================

    const validate = () => {
        const newErrors = {};

        if (!form.fullName.trim()) {
            newErrors.fullName =
                "Full name is required.";
        } else if (
            form.fullName.trim().length < 2
        ) {
            newErrors.fullName =
                "Full name must contain at least 2 characters.";
        }

        if (!form.email.trim()) {
            newErrors.email =
                "Email address is required.";
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                form.email.trim()
            )
        ) {
            newErrors.email =
                "Enter a valid email address.";
        }

        if (
            form.phone.trim() &&
            !/^[0-9+\-\s()]{7,20}$/.test(
                form.phone.trim()
            )
        ) {
            newErrors.phone =
                "Enter a valid phone number.";
        }

        if (!form.password) {
            newErrors.password =
                "Password is required.";
        } else if (
            form.password.length < 8
        ) {
            newErrors.password =
                "Password must contain at least 8 characters.";
        }

        if (!form.confirmPassword) {
            newErrors.confirmPassword =
                "Please confirm the password.";
        } else if (
            form.password !==
            form.confirmPassword
        ) {
            newErrors.confirmPassword =
                "Passwords do not match.";
        }

        if (!form.accountCategory) {
            newErrors.accountCategory =
                "Account category is required.";
        }

        if (!form.accountStatus) {
            newErrors.accountStatus =
                "Account status is required.";
        }

        if (
            form.accountCategory ===
            "Contributor"
        ) {
            if (!form.contributorTypeId) {
                newErrors.contributorType =
                    "Please select a contributor type.";
            }

         const requiresSubtype =
    contributorSubTypes.length > 0;

if (
    requiresSubtype &&
    !form.contributorSubTypeId
) {
    newErrors.contributorSubType =
        "Please select a contributor subtype.";
}

            const selectedSubType =
                contributorSubTypes.find(
                    (subType) =>
                        String(subType.id) ===
                        String(
                            form.contributorSubTypeId
                        )
                );

            if (
                selectedSubType?.name ===
                    "Other" &&
                !form.newContributorSubTypeName.trim()
            ) {
                newErrors.newContributorSubTypeName =
                    "Enter the new specialization name.";
            }
        }

        return newErrors;
    };

    // ========================================================
    // SUBMIT
    // ========================================================

    const handleSubmit = async (
        event
    ) => {
        event.preventDefault();

        if (submitting) {
            return;
        }

        const validationErrors =
            validate();

        if (
            Object.keys(
                validationErrors
            ).length > 0
        ) {
            setErrors(
                validationErrors
            );

            return;
        }

        setSubmitting(true);
        setErrors({});
        setSuccessMessage("");

        try {
            // ==================================================
            // DETERMINE SUBTYPE
            // ==================================================

            let finalContributorSubTypeId =
                form.contributorSubTypeId;

            const selectedSubType =
                contributorSubTypes.find(
                    (subType) =>
                        String(subType.id) ===
                        String(
                            form.contributorSubTypeId
                        )
                );

            // ==================================================
            // CREATE CUSTOM "OTHER" SUBTYPE
            // ==================================================

            if (
                form.accountCategory ===
                    "Contributor" &&
                selectedSubType?.name ===
                    "Other"
            ) {
                const createdSubType =
                    await createCustomContributorSubType();

                if (!createdSubType) {
                    return;
                }

                finalContributorSubTypeId =
                    createdSubType.id;
            }

            // ==================================================
            // ROLE
            // ==================================================

            const role =
                form.accountCategory ===
                "Manager"
                    ? "Manager"
                    : "Contributor";

            // ==================================================
            // ACCOUNT STATUS
            //
            // Active   -> true
            // Inactive -> false
            // ==================================================

            const isActive =
                form.accountStatus ===
                "Active";

            // ==================================================
            // CONTRIBUTOR IDS
            //
            // Manager:
            // null / null
            //
            // Contributor:
            // selected type ID / subtype ID
            // ==================================================

            const contributorTypeId =
                form.accountCategory ===
                "Contributor"
                    ? form.contributorTypeId ||
                      null
                    : null;

            const contributorSubTypeId =
                form.accountCategory ===
                "Contributor"
                    ? finalContributorSubTypeId ||
                      null
                    : null;

            // ==================================================
            // REQUEST
            // ==================================================

            const userData = {
                fullName:
                    form.fullName.trim(),

                email:
                    form.email
                        .trim()
                        .toLowerCase(),

                password:
                    form.password,

                confirmPassword:
                    form.confirmPassword,

                role,

                contributorTypeId,

                contributorSubTypeId,

                phoneNumber:
                    form.phone.trim() ||
                    null,

                bio: null,

                isActive,

                permissions:
                    Array.isArray(
                        form.permissions
                    )
                        ? form.permissions
                        : [],
            };

            // ==================================================
            // DEBUG
            // ==================================================

            console.log(
                "========================================"
            );

            console.log(
                "CREATE USER REQUEST"
            );

            console.log(
                "FULL NAME:",
                userData.fullName
            );

            console.log(
                "EMAIL:",
                userData.email
            );

            console.log(
                "ROLE:",
                userData.role
            );

            console.log(
                "ACCOUNT STATUS:",
                form.accountStatus
            );

            console.log(
                "IS ACTIVE:",
                userData.isActive
            );

            console.log(
                "CONTRIBUTOR TYPE ID:",
                userData.contributorTypeId
            );

            console.log(
                "CONTRIBUTOR SUBTYPE ID:",
                userData.contributorSubTypeId
            );

            console.log(
                "PERMISSIONS:",
                userData.permissions
            );

            console.log(
                "COMPLETE REQUEST:",
                userData
            );

            console.log(
                "========================================"
            );

            // ==================================================
            // CREATE USER
            // ==================================================

            const createResult =
                await createUser(
                    userData
                );

            console.log(
                "CREATE USER RESULT:",
                createResult
            );

            // ==================================================
            // HANDLE FAILURE
            // ==================================================

            if (
                !createResult ||
                createResult.success !==
                    true
            ) {
                setErrors({
                    form:
                        createResult?.error ||
                        "Unable to create the user.",
                });

                return;
            }

            // ==================================================
            // CREATED USER
            // ==================================================

            const createdUser =
                createResult.user;

            console.log(
                "CREATED USER:",
                createdUser
            );

            // ==================================================
            // SUCCESS
            // ==================================================

            setSuccessMessage(
                `${form.fullName.trim()} was created successfully.`
            );

            if (
                typeof onUserCreated ===
                "function"
            ) {
                onUserCreated(
                    createdUser
                );
            }

            // ==================================================
            // CLOSE AFTER SUCCESS
            // ==================================================

            setTimeout(() => {
                setSuccessMessage("");

                setForm(
                    initialForm
                );

                setErrors({});

                setShowPassword(
                    false
                );

                setContributorSubTypes(
                    []
                );

                if (
                    typeof onClose ===
                    "function"
                ) {
                    onClose();
                }
            }, 900);
        } catch (error) {
            console.error(
                "CREATE USER DIALOG ERROR:",
                error
            );

            setErrors({
                form:
                    getErrorMessage(
                        error,
                        "Unable to create the user. Please try again."
                    ),
            });
        } finally {
            setSubmitting(false);
        }
    };

    // ========================================================
    // CANCEL
    // ========================================================

    const handleCancel = () => {
        if (submitting) {
            return;
        }

        setForm(
            initialForm
        );

        setErrors({});
        setSuccessMessage("");
        setShowPassword(false);
        setContributorSubTypes([]);

        if (
            typeof onClose ===
            "function"
        ) {
            onClose();
        }
    };

    // ========================================================
    // NOT OPEN
    // ========================================================

    if (!open) {
        return null;
    }

   // ========================================================
// SELECTED CONTRIBUTOR TYPE
// ========================================================

const selectedContributorType =
    contributorTypes.find(
        (type) =>
            String(type.id) ===
            String(form.contributorTypeId)
    );

const isTeamLeader =
    selectedContributorType?.name
        ?.trim()
        .toLowerCase() === "team leader";

// ========================================================
// SELECTED SUBTYPE
// ========================================================

const selectedSubType =
    contributorSubTypes.find(
        (subType) =>
            String(subType.id) ===
            String(form.contributorSubTypeId)
    );

const isOtherSubType =
    selectedSubType?.name === "Other";
    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
                if (
                    event.target ===
                    event.currentTarget
                ) {
                    handleCancel();
                }
            }}
        >
            <Card className="flex max-h-[95vh] w-full max-w-4xl flex-col overflow-hidden shadow-2xl">
                {/* =================================================
                    HEADER
                ================================================== */}

                <CardHeader className="flex shrink-0 flex-row items-center justify-between border-b px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <UserRound
                                size={22}
                            />
                        </div>

                        <div>
                            <CardTitle className="text-xl">
                                Create User
                            </CardTitle>

                            <CardDescription className="mt-1">
                                Create a new AI-PMS user account.
                            </CardDescription>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={
                            handleCancel
                        }
                        disabled={
                            submitting
                        }
                    >
                        <X size={21} />
                    </Button>
                </CardHeader>

                {/* =================================================
                    FORM CONTENT
                ================================================== */}

                <CardContent className="overflow-y-auto px-6 py-6">
                    <form
                        onSubmit={
                            handleSubmit
                        }
                    >
                        {/* SUCCESS */}

                        {successMessage && (
                            <Alert className="mb-5 border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400">
                                <CheckCircle2
                                    size={18}
                                />

                                <AlertDescription>
                                    {
                                        successMessage
                                    }
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* ERROR */}

                        {errors.form && (
                            <Alert
                                variant="destructive"
                                className="mb-5"
                            >
                                <AlertCircle
                                    size={18}
                                />

                                <AlertDescription>
                                    {
                                        errors.form
                                    }
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* =================================================
                            BASIC INFORMATION
                        ================================================== */}

                        <SectionTitle
                            icon={
                                <UserRound
                                    size={18}
                                />
                            }
                            title="Basic Information"
                            description="Enter the user's personal account information."
                        />

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <InputField
                                label="Full Name"
                                required
                                icon={
                                    <UserRound
                                        size={17}
                                    />
                                }
                                value={
                                    form.fullName
                                }
                                onChange={(
                                    value
                                ) =>
                                    updateField(
                                        "fullName",
                                        value
                                    )
                                }
                                placeholder="Enter full name"
                                error={
                                    errors.fullName
                                }
                            />

                            <InputField
                                label="Email Address"
                                required
                                type="email"
                                icon={
                                    <Mail
                                        size={17}
                                    />
                                }
                                value={
                                    form.email
                                }
                                onChange={(
                                    value
                                ) =>
                                    updateField(
                                        "email",
                                        value
                                    )
                                }
                                placeholder="user@example.com"
                                error={
                                    errors.email
                                }
                            />

                            <InputField
                                label="Phone Number"
                                icon={
                                    <Phone
                                        size={17}
                                    />
                                }
                                value={
                                    form.phone
                                }
                                onChange={(
                                    value
                                ) =>
                                    updateField(
                                        "phone",
                                        value
                                    )
                                }
                                placeholder="+251 9XX XXX XXX"
                                error={
                                    errors.phone
                                }
                            />

                            <PasswordField
                                label="Password"
                                required
                                value={
                                    form.password
                                }
                                onChange={(
                                    value
                                ) =>
                                    updateField(
                                        "password",
                                        value
                                    )
                                }
                                showPassword={
                                    showPassword
                                }
                                onToggle={() =>
                                    setShowPassword(
                                        (value) =>
                                            !value
                                    )
                                }
                                placeholder="Minimum 8 characters"
                                error={
                                    errors.password
                                }
                            />

                            <PasswordField
                                label="Confirm Password"
                                required
                                value={
                                    form.confirmPassword
                                }
                                onChange={(
                                    value
                                ) =>
                                    updateField(
                                        "confirmPassword",
                                        value
                                    )
                                }
                                showPassword={
                                    showPassword
                                }
                                onToggle={() =>
                                    setShowPassword(
                                        (value) =>
                                            !value
                                    )
                                }
                                placeholder="Confirm password"
                                error={
                                    errors.confirmPassword
                                }
                            />
                        </div>

                        {/* =================================================
                            ACCOUNT INFORMATION
                        ================================================== */}

                        <div className="mt-8">
                            <SectionTitle
                                icon={
                                    <ShieldCheck
                                        size={18}
                                    />
                                }
                                title="Account Information"
                                description="Define the user's account status and category."
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            {console.log(
    "ACCOUNT STATUS OPTIONS:",
    ACCOUNT_STATUSES
)}
                            <SelectField
                                label="Account Status"
                                required
                                icon={
                                    <ShieldCheck
                                        size={17}
                                    />
                                }
                                value={
                                    form.accountStatus
                                }
                                onChange={(
                                    value
                                ) =>
                                    updateField(
                                        "accountStatus",
                                        value
                                    )
                                }
                                placeholder="Select account status"
                                options={
                                    ACCOUNT_STATUSES
                                }
                                error={
                                    errors.accountStatus
                                }
                                disabled={
                                    submitting
                                }
                            />
                        </div>

                        {/* =================================================
                            CATEGORY
                        ================================================== */}

                        <div className="mt-6">
                            <Label className="mb-3 block">
                                Account Category{" "}
                                <span className="text-destructive">
                                    *
                                </span>
                            </Label>

                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                {ACCOUNT_CATEGORIES.map(
                                    (
                                        category
                                    ) => {
                                        const selected =
                                            form.accountCategory ===
                                            category;

                                        return (
                                            <Button
                                                key={
                                                    category
                                                }
                                                type="button"
                                                variant={
                                                    selected
                                                        ? "default"
                                                        : "outline"
                                                }
                                                onClick={() =>
                                                    handleCategoryChange(
                                                        category
                                                    )
                                                }
                                                className="h-auto justify-start p-4 text-left"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                                                            selected
                                                                ? "bg-primary-foreground/20"
                                                                : "bg-muted"
                                                        }`}
                                                    >
                                                        {category ===
                                                            "Manager" && (
                                                            <UsersRound
                                                                size={
                                                                    19
                                                                }
                                                            />
                                                        )}

                                                        {category ===
                                                            "Contributor" && (
                                                            <Code2
                                                                size={
                                                                    19
                                                                }
                                                            />
                                                        )}
                                                    </div>

                                                    <div>
                                                        <p className="font-medium">
                                                            {
                                                                category
                                                            }
                                                        </p>

                                                        <p
                                                            className={`text-xs ${
                                                                selected
                                                                    ? "text-primary-foreground/70"
                                                                    : "text-muted-foreground"
                                                            }`}
                                                        >
                                                            {category ===
                                                                "Manager" &&
                                                                "Team and project management"}

                                                            {category ===
                                                                "Contributor" &&
                                                                "Project contribution"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Button>
                                        );
                                    }
                                )}
                            </div>

                            {errors.accountCategory && (
                                <ErrorText
                                    text={
                                        errors.accountCategory
                                    }
                                />
                            )}
                        </div>

                        {/* =================================================
                            CONTRIBUTOR INFORMATION
                        ================================================== */}

                        {form.accountCategory ===
                            "Contributor" && (
                            <Card className="mt-8 bg-muted/20">
                                <CardHeader>
                                    <SectionTitle
                                        icon={
                                            <Code2
                                                size={18}
                                            />
                                        }
                                        title="Contributor Information"
                                        description="Select the contributor type and subtype."
                                    />
                                </CardHeader>

                                <CardContent>
                                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                        {console.log(
    "DROPDOWN OPTIONS:",
    contributorTypes.map((type) => ({
        value: type.id,
        label: type.name,
    }))
)}
                                        <SelectField
                                            label="Contributor Type"
                                            required
                                            icon={
                                                <UsersRound
                                                    size={
                                                        17
                                                    }
                                                />
                                            }
                                            value={
                                                form.contributorTypeId
                                            }
                                            onChange={
                                                handleContributorTypeChange
                                            }
                                            placeholder={
                                                loadingTypes
                                                    ? "Loading contributor types..."
                                                    : "Select contributor type"
                                            }
                                            options={contributorTypes.map(
    (type) => ({
        value: type.id,
        label: type.name,
    })
)}

                                            error={
                                                errors.contributorType
                                            }
                                            disabled={
                                                loadingTypes ||
                                                submitting
                                            }
                                        />

                               {form.contributorTypeId &&
    contributorSubTypes.length > 0 && (
    <SelectField
        label="Contributor Subtype"
        required
        icon={
            <Code2 size={17} />
        }
        value={
            form.contributorSubTypeId
        }
        onChange={
            handleContributorSubTypeChange
        }
        placeholder={
            loadingSubTypes
                ? "Loading subtypes..."
                : "Select contributor subtype"
        }
        options={contributorSubTypes.map(
            (subType) => ({
                value: subType.id,
                label: subType.name,
            })
        )}
        error={
            errors.contributorSubType
        }
        disabled={
            loadingSubTypes ||
            submitting
        }
    />
)}
                                    </div>

                                    {isOtherSubType && (
                                        <Card className="mt-5 border-primary/20 bg-primary/5">
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-sm">
                                                    Create New Specialization
                                                </CardTitle>

                                                <CardDescription>
                                                    Enter the specialization name.
                                                </CardDescription>
                                            </CardHeader>

                                            <CardContent>
                                                <div className="flex flex-col gap-3 md:flex-row md:items-end">
                                                    <div className="flex-1">
                                                        <InputField
                                                            label="New Specialization Name"
                                                            required
                                                            icon={
                                                                <Code2
                                                                    size={
                                                                        17
                                                                    }
                                                                />
                                                            }
                                                            value={
                                                                form.newContributorSubTypeName
                                                            }
                                                            onChange={(
                                                                value
                                                            ) =>
                                                                updateField(
                                                                    "newContributorSubTypeName",
                                                                    value
                                                                )
                                                            }
                                                            placeholder="e.g. DevOps Engineer"
                                                            error={
                                                                errors.newContributorSubTypeName
                                                            }
                                                        />
                                                    </div>

                                                    <Button
                                                        type="button"
                                                        disabled={
                                                            creatingSubType ||
                                                            submitting
                                                        }
                                                        onClick={
                                                            createCustomContributorSubType
                                                        }
                                                        className="h-11"
                                                    >
                                                        {creatingSubType
                                                            ? "Creating..."
                                                            : "Create Specialization"}
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* =================================================
                            PERMISSIONS
                        ================================================== */}

                        {form.accountCategory && (
                            <div className="mt-8">
                                <SectionTitle
                                    icon={
                                        <KeyRound
                                            size={18}
                                        />
                                    }
                                    title="Permissions"
                                    description="Assign the user's system permissions."
                                />

                                <div className="max-h-72 overflow-y-auto rounded-xl border bg-background p-3">
                                    <div className="grid grid-cols-1 gap-1 md:grid-cols-2">
                                        {PERMISSIONS.map(
                                            (
                                                permission
                                            ) => (
                                                <label
                                                    key={
                                                        permission.id
                                                    }
                                                    className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-muted"
                                                >
                                                    <Checkbox
                                                        checked={
                                                            form.permissions.includes(
                                                                permission.id
                                                            )
                                                        }
                                                        onCheckedChange={() =>
                                                            handlePermissionChange(
                                                                permission.id
                                                            )
                                                        }
                                                    />

                                                    <span className="text-sm">
                                                        {
                                                            permission.label
                                                        }
                                                    </span>
                                                </label>
                                            )
                                        )}
                                    </div>
                                </div>

                                {errors.permissions && (
                                    <ErrorText
                                        text={
                                            errors.permissions
                                        }
                                    />
                                )}
                            </div>
                        )}

                        {/* =================================================
                            SUMMARY
                        ================================================== */}

                        {form.accountCategory && (
                            <Card className="mt-8 bg-muted/30">
                                <CardHeader>
                                    <CardTitle className="text-sm">
                                        Account Summary
                                    </CardTitle>
                                </CardHeader>

                                <CardContent>
                                    <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
                                        <SummaryItem
                                            label="Name"
                                            value={
                                                form.fullName ||
                                                "Not provided"
                                            }
                                        />

                                        <SummaryItem
                                            label="Email"
                                            value={
                                                form.email ||
                                                "Not provided"
                                            }
                                        />

                                        <SummaryItem
                                            label="Category"
                                            value={
                                                form.accountCategory ||
                                                "Not selected"
                                            }
                                        />

                                        <SummaryItem
                                            label="Status"
                                            value={
                                                form.accountStatus ||
                                                "Not selected"
                                            }
                                        />

                                        {form.accountCategory ===
                                            "Contributor" && (
                                            <>
                                                <SummaryItem
                                                    label="Contributor Type"
                                                    value={
                                                        form.contributorType ||
                                                        "Not selected"
                                                    }
                                                />

                                                <SummaryItem
                                                    label="Contributor Subtype"
                                                    value={
                                                        isOtherSubType
                                                            ? form.newContributorSubTypeName ||
                                                              "New specialization"
                                                            : form.contributorSubType ||
                                                              "Not selected"
                                                    }
                                                />
                                            </>
                                        )}

                                        <SummaryItem
                                            label="Permissions"
                                            value={`${form.permissions.length} selected`}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* =================================================
                            BUTTONS
                        ================================================== */}

                        <div className="mt-8 flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={
                                    handleCancel
                                }
                                disabled={
                                    submitting
                                }
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                disabled={
                                    submitting ||
                                    creatingSubType
                                }
                            >
                                {submitting ? (
                                    <>
                                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <UserRound
                                            size={
                                                17
                                            }
                                            className="mr-2"
                                        />
                                        Create User
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

// ============================================================
// SECTION TITLE
// ============================================================

function SectionTitle({
    icon,
    title,
    description,
}) {
    return (
        <div className="mb-5 flex items-start gap-3">
            <div className="mt-0.5 text-primary">
                {icon}
            </div>

            <div>
                <h3 className="font-semibold">
                    {title}
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                    {description}
                </p>
            </div>
        </div>
    );
}

// ============================================================
// INPUT FIELD
// ============================================================

function InputField({
    label,
    required = false,
    icon,
    type = "text",
    value,
    onChange,
    placeholder,
    error,
}) {
    return (
        <div className="space-y-2">
            <Label>
                {label}{" "}
                {required && (
                    <span className="text-destructive">
                        *
                    </span>
                )}
            </Label>

            <div className="relative">
                <span className="absolute left-3 top-1/2 z-10 -translate-y-1/2 text-muted-foreground">
                    {icon}
                </span>

                <Input
                    type={type}
                    value={value ?? ""}
                    onChange={(event) =>
                        onChange(
                            event.target.value
                        )
                    }
                    placeholder={
                        placeholder
                    }
                    className={`pl-10 ${
                        error
                            ? "border-destructive focus-visible:ring-destructive"
                            : ""
                    }`}
                />
            </div>

            {error && (
                <ErrorText
                    text={error}
                />
            )}
        </div>
    );
}

// ============================================================
// PASSWORD FIELD
// ============================================================

function PasswordField({
    label,
    required = false,
    value,
    onChange,
    showPassword,
    onToggle,
    placeholder,
    error,
}) {
    return (
        <div className="space-y-2">
            <Label>
                {label}{" "}
                {required && (
                    <span className="text-destructive">
                        *
                    </span>
                )}
            </Label>

            <div className="relative">
                <LockKeyhole
                    size={17}
                    className="absolute left-3 top-1/2 z-10 -translate-y-1/2 text-muted-foreground"
                />

                <Input
                    type={
                        showPassword
                            ? "text"
                            : "password"
                    }
                    value={value ?? ""}
                    onChange={(event) =>
                        onChange(
                            event.target.value
                        )
                    }
                    placeholder={
                        placeholder
                    }
                    className={`pl-10 pr-11 ${
                        error
                            ? "border-destructive focus-visible:ring-destructive"
                            : ""
                    }`}
                />

                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={
                        onToggle
                    }
                    className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 text-muted-foreground"
                >
                    {showPassword ? (
                        <EyeOff
                            size={17}
                        />
                    ) : (
                        <Eye
                            size={17}
                        />
                    )}
                </Button>
            </div>

            {error && (
                <ErrorText
                    text={error}
                />
            )}
        </div>
    );
}

// ============================================================
// SELECT FIELD
// ============================================================

function SelectField({
    label,
    required = false,
    icon,
    value,
    onChange,
    placeholder = "Select an option",
    options = [],
    error,
    disabled = false,
}) {
    const selectedOption = options.find((option) => {
        const optionValue =
            typeof option === "object"
                ? option.value
                : option;

        return String(optionValue) === String(value);
    });

    const selectedLabel =
        typeof selectedOption === "object"
            ? selectedOption.label
            : selectedOption;

    return (
        <div className="space-y-2">
            <Label>
                {label}{" "}
                {required && (
                    <span className="text-destructive">
                        *
                    </span>
                )}
            </Label>

            <Select
                value={
                    value !== null &&
                    value !== undefined &&
                    value !== ""
                        ? String(value)
                        : ""
                }
                onValueChange={
                    onChange
                }
                disabled={
                    disabled
                }
            >
                <SelectTrigger
                    className={
                        error
                            ? "border-destructive focus:ring-destructive"
                            : ""
                    }
                >
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">
                            {icon}
                        </span>
<SelectValue placeholder={placeholder}>
    {selectedLabel}
</SelectValue>
                    </div>
                </SelectTrigger>

                <SelectContent>
                    {options.map(
                        (option) => {
                            const isObject =
                                typeof option ===
                                "object";

                            const optionValue =
                                isObject
                                    ? option.value
                                    : option;

                            const optionLabel =
                                isObject
                                    ? option.label
                                    : option;

                            return (
                                <SelectItem
                                    key={String(
                                        optionValue
                                    )}
                                    value={String(
                                        optionValue
                                    )}
                                >
                                    {
                                        optionLabel
                                    }
                                </SelectItem>
                            );
                        }
                    )}
                </SelectContent>
            </Select>

            {error && (
                <ErrorText
                    text={error}
                />
            )}
        </div>
    );
}

// ============================================================
// ERROR TEXT
// ============================================================

function ErrorText({
    text,
}) {
    return (
        <p className="flex items-center gap-1 text-xs text-destructive">
            <AlertCircle
                size={13}
            />
            {text}
        </p>
    );
}

// ============================================================
// SUMMARY ITEM
// ============================================================

function SummaryItem({
    label,
    value,
}) {
    return (
        <div className="rounded-lg border bg-background px-3 py-2.5">
            <p className="text-xs text-muted-foreground">
                {label}
            </p>

            <p className="mt-0.5 truncate font-medium">
                {value}
            </p>
        </div>
    );
}

// ============================================================
// ERROR MESSAGE
// ============================================================

function getErrorMessage(
    error,
    fallback = "Unable to complete the request."
) {
    const data =
        error?.response?.data;

    if (
        typeof data ===
        "string"
    ) {
        return data;
    }

    if (
        data?.errors &&
        typeof data.errors ===
            "object"
    ) {
        const messages = [];

        Object.entries(
            data.errors
        ).forEach(
            ([field, fieldErrors]) => {
                if (
                    Array.isArray(
                        fieldErrors
                    )
                ) {
                    fieldErrors.forEach(
                        (message) => {
                            messages.push(
                                `${field}: ${message}`
                            );
                        }
                    );
                }
            }
        );

        if (messages.length > 0) {
            return messages.join(
                "\n"
            );
        }
    }

    return (
        data?.message ||
        data?.detail ||
        data?.title ||
        error?.message ||
        fallback
    );
}

export default CreateUserDialog;