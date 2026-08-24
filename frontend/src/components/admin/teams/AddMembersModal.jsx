
import { useEffect, useMemo, useState } from "react";

import {
    X,
    UserRound,
    UsersRound,
    Code2,
    CheckCircle2,
    AlertCircle,
    Search,
    UserPlus,
} from "lucide-react";

import api from "@/services/api";
import { getUsers } from "@/services/userService";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
// ADD MEMBERS MODAL
//
// IMPORTANT:
//
// This component DOES NOT create a new User.
//
// It selects an existing User and adds that User to a Team.
//
// Flow:
//
// Existing User
//      ↓
// Select User
//      ↓
// Select Contributor Type
//      ↓
// Select Contributor Subtype
//      ↓
// POST /TeamMembers
//
// ============================================================


function AddMembersModal({
    open,
    onClose,
    teamId,
    teamName = "",
    onMemberAdded,
}) {
    // ========================================================
    // FORM
    // ========================================================

    const initialForm = {
        userId: "",
        contributorTypeId: "",
        contributorSubTypeId: "",
    };

    const [form, setForm] = useState(initialForm);

    // ========================================================
    // DATA
    // ========================================================

    const [users, setUsers] = useState([]);

    const [contributorTypes, setContributorTypes] =
        useState([]);

    const [contributorSubTypes, setContributorSubTypes] =
        useState([]);

    // ========================================================
    // SEARCH
    // ========================================================

    const [searchTerm, setSearchTerm] =
        useState("");

    // ========================================================
    // LOADING
    // ========================================================

    const [loadingUsers, setLoadingUsers] =
        useState(false);

    const [loadingTypes, setLoadingTypes] =
        useState(false);

    const [loadingSubTypes, setLoadingSubTypes] =
        useState(false);

    const [submitting, setSubmitting] =
        useState(false);

    // ========================================================
    // MESSAGES
    // ========================================================

    const [errors, setErrors] =
        useState({});

    const [successMessage, setSuccessMessage] =
        useState("");


    // ========================================================
    // LOAD DATA WHEN OPEN
    // ========================================================

    useEffect(() => {
        if (!open) {
            return;
        }

        loadUsers();
        loadContributorTypes();
    }, [open]);


    // ========================================================
    // LOAD EXISTING USERS
    // ========================================================

    const loadUsers = async () => {
        setLoadingUsers(true);

        try {
            const result = await getUsers();

            const loadedUsers =
                Array.isArray(result)
                    ? result
                    : [];

            // ------------------------------------------------
            // Normalize users.
            // ------------------------------------------------

            const normalizedUsers =
                loadedUsers
                    .map((user) => ({
                        id:
                            user?.id ??
                            user?.userId ??
                            user?.Id ??
                            user?.UserId,

                        fullName:
                            user?.fullName ??
                            user?.name ??
                            user?.userName ??
                            user?.username ??
                            "",

                        email:
                            user?.email ??
                            user?.Email ??
                            "",

                        role:
                            user?.role ??
                            user?.Role ??
                            "",

                        isActive:
                            user?.isActive ??
                            user?.IsActive ??
                            true,

                        contributorTypeId:
                            user?.contributorTypeId ??
                            user?.ContributorTypeId ??
                            user?.contributorType?.id ??
                            user?.ContributorType?.Id ??
                            null,

                        contributorSubTypeId:
                            user?.contributorSubTypeId ??
                            user?.ContributorSubTypeId ??
                            user?.contributorSubType?.id ??
                            user?.ContributorSubType?.Id ??
                            null,

                        contributorTypeName:
                            user?.contributorType?.name ??
                            user?.ContributorType?.Name ??
                            user?.contributorType ??
                            "",

                        contributorSubTypeName:
                            user?.contributorSubType?.name ??
                            user?.ContributorSubType?.Name ??
                            user?.contributorSubType ??
                            "",
                    }))
                    .filter(
                        (user) =>
                            user.id &&
                            user.fullName
                    );

            setUsers(normalizedUsers);
        } catch (error) {
            console.error(
                "LOAD USERS ERROR:",
                error
            );

            setUsers([]);

            setErrors((previous) => ({
                ...previous,

                form:
                    getErrorMessage(
                        error,
                        "Unable to load users."
                    ),
            }));
        } finally {
            setLoadingUsers(false);
        }
    };


    // ========================================================
    // LOAD CONTRIBUTOR TYPES
    // ========================================================

    const loadContributorTypes = async () => {
        setLoadingTypes(true);

        try {
            const response =
                await api.get(
                    "/ContributorTypes/active"
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
                    : [];

            const normalizedTypes =
                types
                    .map((type) => ({
                        id:
                            type?.id ??
                            type?.Id,

                        name:
                            type?.name ??
                            type?.Name ??
                            "",
                    }))
                    .filter(
                        (type) =>
                            type.id &&
                            type.name
                    );

            setContributorTypes(
                normalizedTypes
            );
        } catch (error) {
            console.error(
                "LOAD CONTRIBUTOR TYPES ERROR:",
                error
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
                const response =
                    await api.get(
                        `/ContributorSubTypes/type/${contributorTypeId}`
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
                                subType?.Id,

                            name:
                                subType?.name ??
                                subType?.Name ??
                                "",
                        }))
                        .filter(
                            (subType) =>
                                subType.id &&
                                subType.name
                        );

                setContributorSubTypes(
                    normalizedSubTypes
                );
            } catch (error) {
                console.error(
                    "LOAD CONTRIBUTOR SUBTYPES ERROR:",
                    error
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
    // FILTER USERS
    // ========================================================

    const filteredUsers =
        useMemo(() => {
            const term =
                searchTerm
                    .trim()
                    .toLowerCase();

            if (!term) {
                return users;
            }

            return users.filter(
                (user) =>
                    [
                        user.fullName,
                        user.email,
                        user.role,
                    ].some((value) =>
                        String(
                            value || ""
                        )
                            .toLowerCase()
                            .includes(term)
                    )
            );
        }, [
            users,
            searchTerm,
        ]);


    // ========================================================
    // SELECT USER
    // ========================================================

    const handleUserChange =
        async (userId) => {
            const selectedUser =
                users.find(
                    (user) =>
                        String(
                            user.id
                        ) ===
                        String(userId)
                );

            if (!selectedUser) {
                return;
            }

            // ------------------------------------------------
            // If the existing user already has contributor
            // classification, use it as the default.
            // ------------------------------------------------

            const contributorTypeId =
                selectedUser
                    .contributorTypeId ??
                "";

            const contributorSubTypeId =
                selectedUser
                    .contributorSubTypeId ??
                "";

            setForm((previous) => ({
                ...previous,

                userId,

                contributorTypeId,

                contributorSubTypeId,
            }));

            setErrors((previous) => ({
                ...previous,

                userId: "",

                contributorType: "",

                contributorSubType: "",

                form: "",
            }));

            if (contributorTypeId) {
                await loadContributorSubTypes(
                    contributorTypeId
                );
            } else {
                setContributorSubTypes([]);
            }
        };


    // ========================================================
    // CONTRIBUTOR TYPE CHANGE
    // ========================================================

    const handleContributorTypeChange =
        async (value) => {
            setForm((previous) => ({
                ...previous,

                contributorTypeId:
                    value,

                contributorSubTypeId:
                    "",
            }));

            setErrors((previous) => ({
                ...previous,

                contributorType: "",

                contributorSubType: "",
            }));

            await loadContributorSubTypes(
                value
            );
        };


    // ========================================================
    // CONTRIBUTOR SUBTYPE CHANGE
    // ========================================================

    const handleContributorSubTypeChange =
        (value) => {
            setForm((previous) => ({
                ...previous,

                contributorSubTypeId:
                    value,
            }));

            setErrors((previous) => ({
                ...previous,

                contributorSubType: "",
            }));
        };


    // ========================================================
    // VALIDATION
    // ========================================================

    const validate = () => {
        const newErrors = {};

        if (!teamId) {
            newErrors.form =
                "Team ID is required.";
        }

        if (!form.userId) {
            newErrors.userId =
                "Please select a user.";
        }

        if (
            form.contributorTypeId &&
            !form.contributorSubTypeId
        ) {
            newErrors.contributorSubType =
                "Please select a contributor subtype.";
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
            // =================================================
            // BACKEND TEAM MEMBER REQUEST
            //
            // This creates a TeamMember relationship.
            //
            // It DOES NOT create a User.
            // =================================================

            const requestData = {
                teamId,

                userId:
                    form.userId,

                contributorTypeId:
                    form.contributorTypeId ||
                    null,

                contributorSubTypeId:
                    form.contributorSubTypeId ||
                    null,
            };


            console.log(
                "========== ADD TEAM MEMBER =========="
            );

            console.log(
                "TEAM ID:",
                teamId
            );

            console.log(
                "TEAM NAME:",
                teamName
            );

            console.log(
                "USER ID:",
                form.userId
            );

            console.log(
                "CONTRIBUTOR TYPE ID:",
                form.contributorTypeId
            );

            console.log(
                "CONTRIBUTOR SUBTYPE ID:",
                form.contributorSubTypeId
            );

            console.log(
                "REQUEST:",
                requestData
            );


            // =================================================
            // ADD EXISTING USER TO TEAM
            // =================================================

            const response =
                await api.post(
                    "/TeamMembers",
                    requestData
                );


            console.log(
                "ADD TEAM MEMBER SUCCESS:",
                response?.data
            );


            const selectedUser =
                users.find(
                    (user) =>
                        String(
                            user.id
                        ) ===
                        String(
                            form.userId
                        )
                );


            setSuccessMessage(
                `${
                    selectedUser?.fullName ||
                    "User"
                } was added to the team successfully.`
            );


            // =================================================
            // CALLBACK
            // =================================================

            if (
                typeof onMemberAdded ===
                "function"
            ) {
                onMemberAdded(
                    response?.data ??
                    selectedUser
                );
            }


            // =================================================
            // CLOSE AFTER SUCCESS
            // =================================================

            setTimeout(() => {
                setSuccessMessage("");

                resetForm();

                if (
                    typeof onClose ===
                    "function"
                ) {
                    onClose();
                }
            }, 900);
        } catch (error) {
            console.error(
                "ADD TEAM MEMBER ERROR:",
                error
            );

            console.error(
                "STATUS:",
                error?.response?.status
            );

            console.error(
                "BACKEND RESPONSE:",
                error?.response?.data
            );


            setErrors({
                form:
                    getErrorMessage(
                        error,
                        "Unable to add the user to the team."
                    ),
            });
        } finally {
            setSubmitting(false);
        }
    };


    // ========================================================
    // RESET
    // ========================================================

    const resetForm = () => {
        setForm(initialForm);

        setErrors({});

        setSuccessMessage("");

        setSearchTerm("");

        setContributorSubTypes([]);
    };


    // ========================================================
    // CANCEL
    // ========================================================

    const handleCancel = () => {
        if (submitting) {
            return;
        }

        resetForm();

        if (
            typeof onClose ===
            "function"
        ) {
            onClose();
        }
    };


    // ========================================================
    // DO NOT RENDER
    // ========================================================

    if (!open) {
        return null;
    }


    // ========================================================
    // SELECTED USER
    // ========================================================

    const selectedUser =
        users.find(
            (user) =>
                String(
                    user.id
                ) ===
                String(
                    form.userId
                )
        );


    // ========================================================
    // SELECTED TYPE
    // ========================================================

    const selectedContributorType =
        contributorTypes.find(
            (type) =>
                String(
                    type.id
                ) ===
                String(
                    form.contributorTypeId
                )
        );


    // ========================================================
    // SELECTED SUBTYPE
    // ========================================================

    const selectedContributorSubType =
        contributorSubTypes.find(
            (subType) =>
                String(
                    subType.id
                ) ===
                String(
                    form.contributorSubTypeId
                )
        );


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
            <Card className="flex max-h-[95vh] w-full max-w-3xl flex-col overflow-hidden shadow-2xl">

                {/* =================================================
                    HEADER
                ================================================= */}

                <CardHeader className="flex shrink-0 flex-row items-center justify-between border-b px-6 py-5">

                    <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <UserPlus
                                size={22}
                            />
                        </div>

                        <div>

                            <CardTitle className="text-xl">
                                Add Team Member
                            </CardTitle>

                            <CardDescription className="mt-1">
                                Add an existing user to
                                {teamName
                                    ? ` ${teamName}`
                                    : " this team"}
                                .
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
                    FORM
                ================================================= */}

                <CardContent className="overflow-y-auto px-6 py-6">

                    <form
                        onSubmit={
                            handleSubmit
                        }
                    >

                        {/* =================================================
                            SUCCESS
                        ================================================= */}

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


                        {/* =================================================
                            ERROR
                        ================================================= */}

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
                            USER SELECTION
                        ================================================= */}

                        <SectionTitle
                            icon={
                                <UsersRound
                                    size={18}
                                />
                            }
                            title="Select Existing User"
                            description="Choose an existing AI-PMS user to add to this team."
                        />


                        {/* SEARCH */}

                        <div className="mb-4">

                            <Label className="mb-2 block">
                                Search Users
                            </Label>

                            <div className="relative">

                                <Search
                                    size={17}
                                    className="absolute left-3 top-1/2 z-10 -translate-y-1/2 text-muted-foreground"
                                />

                                <Input
                                    value={
                                        searchTerm
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setSearchTerm(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    placeholder="Search by name, email, or role..."
                                    className="pl-10"
                                    disabled={
                                        loadingUsers ||
                                        submitting
                                    }
                                />

                            </div>

                        </div>


                        {/* USER SELECT */}

                        <SelectField
                            label="User"
                            required
                            icon={
                                <UserRound
                                    size={17}
                                />
                            }
                            value={
                                form.userId
                            }
                            onChange={
                                handleUserChange
                            }
                            placeholder={
                                loadingUsers
                                    ? "Loading users..."
                                    : "Select an existing user"
                            }
                            options={filteredUsers
                                .filter(
                                    (user) =>
                                        user.isActive !==
                                        false
                                )
                                .map(
                                    (
                                        user
                                    ) => ({
                                        value:
                                            user.id,

                                        label:
                                            `${user.fullName} — ${user.email}`,
                                    })
                                )}
                            error={
                                errors.userId
                            }
                            disabled={
                                loadingUsers ||
                                submitting
                            }
                        />


                        {/* =================================================
                            SELECTED USER PREVIEW
                        ================================================= */}

                        {selectedUser && (
                            <Card className="mt-5 border-primary/20 bg-primary/5">

                                <CardContent className="p-4">

                                    <div className="flex items-center gap-3">

                                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">

                                            <UserRound
                                                size={20}
                                            />

                                        </div>


                                        <div className="min-w-0">

                                            <p className="font-semibold">
                                                {
                                                    selectedUser.fullName
                                                }
                                            </p>

                                            <p className="truncate text-sm text-muted-foreground">
                                                {
                                                    selectedUser.email
                                                }
                                            </p>

                                            <p className="mt-1 text-xs text-muted-foreground">
                                                Role:{" "}
                                                <span className="font-medium">
                                                    {
                                                        selectedUser.role ||
                                                        "Not specified"
                                                    }
                                                </span>
                                            </p>

                                        </div>

                                    </div>

                                </CardContent>

                            </Card>
                        )}


                        {/* =================================================
                            CONTRIBUTOR CLASSIFICATION
                        ================================================= */}

                        {selectedUser && (
                            <div className="mt-8">

                                <SectionTitle
                                    icon={
                                        <Code2
                                            size={18}
                                        />
                                    }
                                    title="Contributor Classification"
                                    description="Select the contributor type and specialization for this team member."
                                />


                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                                    {/* TYPE */}

                                    <SelectField
                                        label="Contributor Type"
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
                                            (
                                                type
                                            ) => ({
                                                value:
                                                    type.id,

                                                label:
                                                    type.name,
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


                                    {/* SUBTYPE */}

                                    <SelectField
                                        label="Contributor Subtype"
                                        icon={
                                            <Code2
                                                size={
                                                    17
                                                }
                                            />
                                        }
                                        value={
                                            form.contributorSubTypeId
                                        }
                                        onChange={
                                            handleContributorSubTypeChange
                                        }
                                        placeholder={
                                            !form.contributorTypeId
                                                ? "Select contributor type first"
                                                : loadingSubTypes
                                                ? "Loading subtypes..."
                                                : "Select contributor subtype"
                                        }
                                        options={contributorSubTypes.map(
                                            (
                                                subType
                                            ) => ({
                                                value:
                                                    subType.id,

                                                label:
                                                    subType.name,
                                            })
                                        )}
                                        error={
                                            errors.contributorSubType
                                        }
                                        disabled={
                                            !form.contributorTypeId ||
                                            loadingSubTypes ||
                                            submitting
                                        }
                                    />

                                </div>

                            </div>
                        )}


                        {/* =================================================
                            SUMMARY
                        ================================================= */}

                        {selectedUser && (
                            <Card className="mt-8 bg-muted/30">

                                <CardHeader>

                                    <CardTitle className="text-sm">
                                        Member Summary
                                    </CardTitle>

                                    <CardDescription>
                                        Review the member before adding them to the team.
                                    </CardDescription>

                                </CardHeader>


                                <CardContent>

                                    <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">

                                        <SummaryItem
                                            label="Team"
                                            value={
                                                teamName ||
                                                "Selected Team"
                                            }
                                        />

                                        <SummaryItem
                                            label="User"
                                            value={
                                                selectedUser.fullName
                                            }
                                        />

                                        <SummaryItem
                                            label="Email"
                                            value={
                                                selectedUser.email ||
                                                "Not provided"
                                            }
                                        />

                                        <SummaryItem
                                            label="Role"
                                            value={
                                                selectedUser.role ||
                                                "Not specified"
                                            }
                                        />

                                        <SummaryItem
                                            label="Contributor Type"
                                            value={
                                                selectedContributorType?.name ||
                                                "Not selected"
                                            }
                                        />

                                        <SummaryItem
                                            label="Contributor Subtype"
                                            value={
                                                selectedContributorSubType?.name ||
                                                "Not selected"
                                            }
                                        />

                                    </div>

                                </CardContent>

                            </Card>
                        )}


                        {/* =================================================
                            BUTTONS
                        ================================================= */}

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
                                    loadingUsers
                                }
                            >

                                {submitting ? (
                                    <>
                                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />

                                        Adding...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus
                                            size={
                                                17
                                            }
                                            className="mr-2"
                                        />

                                        Add Member
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

                        <SelectValue
                            placeholder={
                                placeholder
                            }
                        />

                    </div>

                </SelectTrigger>


                <SelectContent>

                    {options.length ===
                    0 ? (
                        <div className="px-3 py-2 text-sm text-muted-foreground">
                            No options available
                        </div>
                    ) : (
                        options.map(
                            (
                                option
                            ) => {
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
                        )
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
    fallback
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
            ([field, fieldMessages]) => {
                if (
                    Array.isArray(
                        fieldMessages
                    )
                ) {
                    fieldMessages.forEach(
                        (message) => {
                            messages.push(
                                `${field}: ${message}`
                            );
                        }
                    );
                } else if (
                    fieldMessages
                ) {
                    messages.push(
                        `${field}: ${fieldMessages}`
                    );
                }
            }
        );

        if (
            messages.length > 0
        ) {
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


export default AddMembersModal;
