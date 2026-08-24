import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    ArrowLeft,
    CheckCircle2,
    Mail,
    Phone,
    Save,
    User,
    X,
    XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// ============================================================
// UPDATE PROFILE
// PROF-002: Update Profile
//
// Editable:
// - Full name
// - Email
// - Phone
//
// NOT editable:
// - Role
// - Permissions
// - Account status
// - Organization/team
//
// Uses GLOBAL light/dark theme.
// No hard-coded white page background.
// ============================================================


// ============================================================
// GET CURRENT USER
// ============================================================
function getCurrentUser() {
    try {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
            return null;
        }

        const parsedUser = JSON.parse(storedUser);

        if (
            !parsedUser ||
            typeof parsedUser !== "object"
        ) {
            return null;
        }

        return parsedUser;
    } catch (error) {
        console.error(
            "Unable to read current user:",
            error
        );

        return null;
    }
}


// ============================================================
// GET ALL USERS
// ============================================================
function getUsers() {
    try {
        const storedUsers =
            localStorage.getItem("users");

        if (!storedUsers) {
            return [];
        }

        const parsedUsers =
            JSON.parse(storedUsers);

        return Array.isArray(parsedUsers)
            ? parsedUsers
            : [];
    } catch (error) {
        console.error(
            "Unable to read users:",
            error
        );

        return [];
    }
}


// ============================================================
// SAVE USERS
// ============================================================
function saveUsers(users) {
    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );
}


// ============================================================
// FIND CURRENT USER
// ============================================================
function findCurrentUser(
    currentUser,
    users
) {
    if (!currentUser) {
        return null;
    }

    return users.find((storedUser) => {

        // Match by ID
        if (
            currentUser.id !== undefined &&
            currentUser.id !== null &&
            storedUser.id !== undefined &&
            storedUser.id !== null &&
            String(storedUser.id) ===
                String(currentUser.id)
        ) {
            return true;
        }

        // Match by userId
        if (
            currentUser.userId !== undefined &&
            currentUser.userId !== null &&
            storedUser.userId !== undefined &&
            storedUser.userId !== null &&
            String(storedUser.userId) ===
                String(currentUser.userId)
        ) {
            return true;
        }

        // Match by email
        if (
            currentUser.email &&
            storedUser.email &&
            String(storedUser.email)
                .trim()
                .toLowerCase() ===
                String(currentUser.email)
                    .trim()
                    .toLowerCase()
        ) {
            return true;
        }

        return false;
    });
}


// ============================================================
// ACTIVITY LOG
// ============================================================
function addActivityLog(
    user,
    action
) {
    try {
        const storedLogs =
            localStorage.getItem(
                "activityLogs"
            );

        let logs = [];

        if (storedLogs) {
            try {
                const parsedLogs =
                    JSON.parse(storedLogs);

                if (Array.isArray(parsedLogs)) {
                    logs = parsedLogs;
                }
            } catch {
                logs = [];
            }
        }

        const newLog = {
            id: Date.now(),

            action,

            userId:
                user?.id ??
                user?.userId ??
                null,

            userName:
                user?.fullName ||
                user?.name ||
                "Unknown User",

            userEmail:
                user?.email ||
                "",

            timestamp:
                new Date().toISOString(),
        };

        logs.unshift(newLog);

        localStorage.setItem(
            "activityLogs",
            JSON.stringify(logs)
        );
    } catch (error) {
        console.error(
            "Unable to record activity:",
            error
        );
    }
}


// ============================================================
// EMAIL VALIDATION
// ============================================================
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
    );
}


// ============================================================
// MAIN COMPONENT
// ============================================================
function UpdateProfile({
    user: userProp,
    onCancel,
    onSuccess,
}) {
    const navigate = useNavigate();

    const [currentUser, setCurrentUser] =
        useState(null);

    const [originalProfile, setOriginalProfile] =
        useState(null);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
    });

    const [errors, setErrors] =
        useState({});

    const [message, setMessage] =
        useState({
            type: "",
            text: "",
        });

    const [isLoading, setIsLoading] =
        useState(true);

    const [isSaving, setIsSaving] =
        useState(false);


    // ========================================================
    // LOAD PROFILE
    // ========================================================
    useEffect(() => {
        let isMounted = true;

        const loadProfile = () => {
            try {
                setIsLoading(true);

                const loggedInUser =
                    userProp || getCurrentUser();

                if (!loggedInUser) {
                    if (isMounted) {
                        setMessage({
                            type: "error",
                            text:
                                "Unable to identify the current user. Please return to Profile Management.",
                        });

                        setIsLoading(false);
                    }

                    return;
                }

                const users = getUsers();

                let foundUser =
                    findCurrentUser(
                        loggedInUser,
                        users
                    );

                if (!foundUser) {
                    foundUser = loggedInUser;
                }

                // ==================================================
                // ADMIN CHECK
                // ==================================================
                if (
                    foundUser.role &&
                    String(foundUser.role)
                        .trim()
                        .toLowerCase() !==
                        "admin"
                ) {
                    if (isMounted) {
                        setMessage({
                            type: "error",
                            text:
                                "Access denied. Only administrators can update this profile.",

                        });

                        setIsLoading(false);
                    }

                    return;
                }

                const fullName =
                    foundUser.fullName ||
                    foundUser.name ||
                    `${foundUser.firstName || ""} ${
                        foundUser.lastName || ""
                    }`.trim();

                const profileData = {
                    fullName:
                        fullName || "",

                    email:
                        foundUser.email || "",

                    phone:
                        foundUser.phone ||
                        foundUser.phoneNumber ||
                        "",
                };

                if (!isMounted) {
                    return;
                }

                setCurrentUser(foundUser);

                setOriginalProfile(
                    profileData
                );

                setFormData(
                    profileData
                );

                setMessage({
                    type: "",
                    text: "",
                });

            } catch (error) {
                console.error(
                    "Unable to load profile:",
                    error
                );

                if (isMounted) {
                    setMessage({
                        type: "error",
                        text:
                            "Unable to load profile information. Please try again.",
                    });
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadProfile();

        return () => {
            isMounted = false;
        };
    }, [userProp]);


    // ========================================================
    // HANDLE INPUT CHANGE
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
        }));

        setMessage({
            type: "",
            text: "",
        });
    };


    // ========================================================
    // VALIDATE FORM
    // ========================================================
    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName =
                "Full name is required.";
        }

        if (!formData.email.trim()) {
            newErrors.email =
                "Email address is required.";
        } else if (
            !isValidEmail(
                formData.email.trim()
            )
        ) {
            newErrors.email =
                "Please enter a valid email address.";
        }

        if (
            formData.phone &&
            formData.phone.trim().length > 0 &&
            formData.phone.trim().length < 7
        ) {
            newErrors.phone =
                "Please enter a valid phone number.";
        }

        setErrors(newErrors);

        return (
            Object.keys(newErrors).length === 0
        );
    };


    // ========================================================
    // CHECK EMAIL UNIQUENESS
    // ========================================================
    const isEmailAlreadyUsed = (
        email,
        users
    ) => {
        const normalizedEmail =
            email.trim().toLowerCase();

        return users.some(
            (storedUser) => {

                const sameId =
                    currentUser?.id !==
                        undefined &&
                    currentUser?.id !==
                        null &&
                    storedUser.id !==
                        undefined &&
                    storedUser.id !==
                        null &&
                    String(
                        storedUser.id
                    ) ===
                        String(
                            currentUser.id
                        );

                const sameUserId =
                    currentUser?.userId !==
                        undefined &&
                    currentUser?.userId !==
                        null &&
                    storedUser.userId !==
                        undefined &&
                    storedUser.userId !==
                        null &&
                    String(
                        storedUser.userId
                    ) ===
                        String(
                            currentUser.userId
                        );

                if (
                    sameId ||
                    sameUserId
                ) {
                    return false;
                }

                return (
                    storedUser.email &&
                    String(
                        storedUser.email
                    )
                        .trim()
                        .toLowerCase() ===
                        normalizedEmail
                );
            }
        );
    };


    // ========================================================
    // SAVE PROFILE
    // ========================================================
    const handleSave = () => {

        setMessage({
            type: "",
            text: "",
        });

        if (!validateForm()) {
            setMessage({
                type: "error",
                text:
                    "Please complete all required fields.",
            });

            return;
        }

        if (!currentUser) {
            setMessage({
                type: "error",
                text:
                    "Profile not found.",
            });

            return;
        }

        try {
            setIsSaving(true);

            const users = getUsers();

            let currentIndex =
                users.findIndex(
                    (storedUser) => {

                        const sameId =
                            currentUser.id !==
                                undefined &&
                            currentUser.id !==
                                null &&
                            storedUser.id !==
                                undefined &&
                            storedUser.id !==
                                null &&
                            String(
                                storedUser.id
                            ) ===
                                String(
                                    currentUser.id
                                );

                        const sameUserId =
                            currentUser.userId !==
                                undefined &&
                            currentUser.userId !==
                                null &&
                            storedUser.userId !==
                                undefined &&
                            storedUser.userId !==
                                null &&
                            String(
                                storedUser.userId
                            ) ===
                                String(
                                    currentUser.userId
                                );

                        const sameEmail =
                            currentUser.email &&
                            storedUser.email &&
                            String(
                                storedUser.email
                            )
                                .trim()
                                .toLowerCase() ===
                                String(
                                    currentUser.email
                                )
                                    .trim()
                                    .toLowerCase();

                        return (
                            sameId ||
                            sameUserId ||
                            sameEmail
                        );
                    }
                );


            // ==================================================
            // FALLBACK
            // ==================================================
            if (currentIndex === -1) {
                users.push({
                    ...currentUser,
                });

                currentIndex =
                    users.length - 1;
            }


            // ==================================================
            // EMAIL UNIQUE
            // ==================================================
            if (
                isEmailAlreadyUsed(
                    formData.email,
                    users
                )
            ) {
                setErrors((previous) => ({
                    ...previous,

                    email:
                        "Email address is already in use.",
                }));

                setMessage({
                    type: "error",
                    text:
                        "Email address is already in use.",
                });

                return;
            }


            // ==================================================
            // UPDATE PERMITTED FIELDS ONLY
            // ==================================================
            const existingUser =
                users[currentIndex];

            const updatedUser = {
                ...existingUser,

                fullName:
                    formData.fullName.trim(),

                name:
                    formData.fullName.trim(),

                email:
                    formData.email.trim(),

                phone:
                    formData.phone.trim(),
            };


            // ==================================================
            // SAVE USERS
            // ==================================================
            const updatedUsers = [
                ...users,
            ];

            updatedUsers[currentIndex] =
                updatedUser;

            saveUsers(updatedUsers);


            // ==================================================
            // UPDATE AUTH USER
            // ==================================================
            localStorage.setItem(
                "user",
                JSON.stringify(
                    updatedUser
                )
            );


            // ==================================================
            // ACTIVITY LOG
            // ==================================================
            addActivityLog(
                updatedUser,
                "Updated profile information"
            );


            // ==================================================
            // UPDATE STATE
            // ==================================================
            setCurrentUser(
                updatedUser
            );

            const newProfile = {
                fullName:
                    updatedUser.fullName ||
                    updatedUser.name ||
                    "",

                email:
                    updatedUser.email ||
                    "",

                phone:
                    updatedUser.phone ||
                    updatedUser.phoneNumber ||
                    "",
            };

            setOriginalProfile(
                newProfile
            );

            setFormData(
                newProfile
            );

            setErrors({});


            // ==================================================
            // SUCCESS
            // ==================================================
            setMessage({
                type: "success",
                text:
                    "Profile updated successfully.",
            });


            if (
                typeof onSuccess ===
                "function"
            ) {
                onSuccess(
                    updatedUser
                );
            }

        } catch (error) {
            console.error(
                "Profile update error:",
                error
            );

            setMessage({
                type: "error",
                text:
                    "Unable to update profile. Please try again.",
            });
        } finally {
            setIsSaving(false);
        }
    };


    // ========================================================
    // CANCEL
    // ========================================================
    const handleCancel = () => {

        if (originalProfile) {
            setFormData({
                ...originalProfile,
            });
        }

        setErrors({});

        setMessage({
            type: "",
            text: "",
        });

        if (
            typeof onCancel ===
            "function"
        ) {
            onCancel();
            return;
        }

        navigate("/admin/profile");
    };


    // ========================================================
    // LOADING
    // ========================================================
    if (isLoading) {
        return (
            <div className="flex min-h-[500px] items-center justify-center bg-background text-foreground">
                <div className="text-center">

                    <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />

                    <p className="text-sm font-medium text-muted-foreground">
                        Loading profile...
                    </p>

                </div>
            </div>
        );
    }


    // ========================================================
    // RENDER
    // ========================================================
    return (
        <div className="min-h-screen bg-background text-foreground p-4 md:p-6">

            <div className="mx-auto max-w-4xl">

                {/* ==================================================
                    HEADER
                ================================================== */}
                <div className="mb-6">

                    <Button
                        variant="ghost"
                        onClick={handleCancel}
                        className="mb-4 -ml-2 gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />

                        Back to Profile
                    </Button>

                    <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                        Edit Profile
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Update your permitted personal
                        profile information.
                    </p>

                </div>


                {/* ==================================================
                    MESSAGE
                ================================================== */}
                {message.text && (
                    <div
                        className={`mb-6 flex items-start gap-3 rounded-xl border p-4 ${
                            message.type === "success"
                                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : "border-destructive/30 bg-destructive/10 text-destructive"
                        }`}
                    >

                        {message.type ===
                        "success" ? (
                            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                        ) : (
                            <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
                        )}

                        <p className="text-sm font-medium">
                            {message.text}
                        </p>

                    </div>
                )}


                {/* ==================================================
                    FORM CARD
                ================================================== */}
                <div className="overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-sm">

                    {/* Header */}
                    <div className="border-b border-border p-6">

                        <h2 className="text-lg font-bold text-card-foreground">
                            Personal Information
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Update the information that you are
                            authorized to change.
                        </p>

                    </div>


                    {/* Fields */}
                    <div className="space-y-6 p-6">

                        {/* FULL NAME */}
                        <div>

                            <label
                                htmlFor="fullName"
                                className="mb-2 block text-sm font-semibold text-foreground"
                            >
                                Full Name

                                <span className="ml-1 text-destructive">
                                    *
                                </span>
                            </label>

                            <div className="relative">

                                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                                <Input
                                    id="fullName"
                                    name="fullName"
                                    value={
                                        formData.fullName
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter your full name"
                                    className={`pl-10 ${
                                        errors.fullName
                                            ? "border-destructive focus-visible:ring-destructive"
                                            : ""
                                    }`}
                                />

                            </div>

                            {errors.fullName && (
                                <p className="mt-1.5 text-sm text-destructive">
                                    {errors.fullName}
                                </p>
                            )}

                        </div>


                        {/* EMAIL */}
                        <div>

                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-semibold text-foreground"
                            >
                                Email Address

                                <span className="ml-1 text-destructive">
                                    *
                                </span>
                            </label>

                            <div className="relative">

                                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={
                                        formData.email
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter your email address"
                                    className={`pl-10 ${
                                        errors.email
                                            ? "border-destructive focus-visible:ring-destructive"
                                            : ""
                                    }`}
                                />

                            </div>

                            {errors.email && (
                                <p className="mt-1.5 text-sm text-destructive">
                                    {errors.email}
                                </p>
                            )}

                            <p className="mt-1.5 text-xs text-muted-foreground">
                                Your email address must be unique
                                across the system.
                            </p>

                        </div>


                        {/* PHONE */}
                        <div>

                            <label
                                htmlFor="phone"
                                className="mb-2 block text-sm font-semibold text-foreground"
                            >
                                Phone Number
                            </label>

                            <div className="relative">

                                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={
                                        formData.phone
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter your phone number"
                                    className={`pl-10 ${
                                        errors.phone
                                            ? "border-destructive focus-visible:ring-destructive"
                                            : ""
                                    }`}
                                />

                            </div>

                            {errors.phone && (
                                <p className="mt-1.5 text-sm text-destructive">
                                    {errors.phone}
                                </p>
                            )}

                        </div>


                        {/* ==================================================
                            ADMINISTRATIVE INFORMATION
                        ================================================== */}
                        <div className="rounded-xl border border-border bg-muted/40 p-5">

                            <h3 className="mb-3 text-sm font-bold text-foreground">
                                Administrative Information
                            </h3>

                            <p className="mb-4 text-xs text-muted-foreground">
                                These properties cannot be changed
                                through normal profile editing.
                            </p>

                            <div className="grid gap-4 sm:grid-cols-3">

                                {/* ROLE */}
                                <div>

                                    <p className="text-xs font-medium text-muted-foreground">
                                        Role
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-foreground">
                                        {currentUser?.role ||
                                            "Not assigned"}
                                    </p>

                                </div>


                                {/* STATUS */}
                                <div>

                                    <p className="text-xs font-medium text-muted-foreground">
                                        Status
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-foreground">
                                        {currentUser?.status ||
                                            (
                                                currentUser?.isActive ===
                                                false
                                                    ? "Inactive"
                                                    : "Active"
                                            )}
                                    </p>

                                </div>


                                {/* ORGANIZATION */}
                                <div>

                                    <p className="text-xs font-medium text-muted-foreground">
                                        Organization
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-foreground">
                                        {currentUser?.organizationName ||
                                            currentUser?.organization ||
                                            "Not assigned"}
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* ==================================================
                        ACTIONS
                    ================================================== */}
                    <div className="flex flex-col-reverse gap-3 border-t border-border bg-muted/30 p-6 sm:flex-row sm:justify-end">

                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            disabled={isSaving}
                            className="gap-2"
                        >
                            <X className="h-4 w-4" />

                            Cancel
                        </Button>


                        <Button
                            type="button"
                            onClick={handleSave}
                            disabled={isSaving}
                            className="gap-2"
                        >
                            {isSaving ? (
                                <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />

                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />

                                    Save Changes
                                </>
                            )}
                        </Button>

                    </div>

                </div>


                {/* ==================================================
                    SECURITY NOTE
                ================================================== */}
                <div className="mt-6 rounded-xl border border-primary/20 bg-primary/10 p-4">

                    <div className="flex gap-3">

                        <User className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                        <div>

                            <p className="font-semibold text-foreground">
                                Profile Update Rules
                            </p>

                            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                You can update your name, email address,
                                and phone number. Role, permissions,
                                account status, and other administrative
                                properties are managed separately and
                                cannot be changed here.
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default UpdateProfile;