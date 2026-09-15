import { useEffect, useState } from "react";

import {
    UserRound,
    Mail,
    Phone,
    Camera,
    Save,
    X,
    Loader2,
    AlertCircle,
    CheckCircle2,
} from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// ============================================================
// UPDATE PROFILE DIALOG
// PM-PROFILE-001 — Update Profile
//
// Editable:
// - Full name
// - Email
// - Phone number
// - Profile picture
//
// NOT editable:
// - Role
// - Permissions
// - Project relationships
// - Team relationships
//
// API operation is delegated to the parent/service layer.
// ============================================================


// ============================================================
// GET PROFILE VALUE
// ============================================================

const getProfileValue = (profile, ...keys) => {
    if (!profile) {
        return "";
    }

    for (const key of keys) {
        if (
            profile[key] !== undefined &&
            profile[key] !== null
        ) {
            return String(profile[key]);
        }
    }

    return "";
};


// ============================================================
// EXTRACT ERROR MESSAGE
// ============================================================

const extractErrorMessage = (error) => {
    if (!error) {
        return "Unable to update your profile.";
    }

    if (typeof error === "string") {
        return error;
    }

    // ========================================================
    // AXIOS RESPONSE
    // ========================================================

    const responseData = error?.response?.data;

    if (
        responseData?.message ||
        responseData?.Message
    ) {
        return (
            responseData.message ??
            responseData.Message
        );
    }

    // ========================================================
    // VALIDATION ERRORS
    // ========================================================

    if (responseData?.errors) {
        const validationErrors =
            responseData.errors;

        const messages = Object.values(
            validationErrors
        )
            .flat()
            .filter(Boolean);

        if (messages.length > 0) {
            return messages.join(" ");
        }
    }

    // ========================================================
    // PROBLEM DETAILS
    // ========================================================

    if (responseData?.title) {
        return responseData.title;
    }

    if (responseData?.detail) {
        return responseData.detail;
    }

    // ========================================================
    // NORMAL ERROR
    // ========================================================

    return (
        error?.message ||
        error?.error ||
        error?.detail ||
        error?.title ||
        "Unable to update your profile."
    );
};


// ============================================================
// MAIN COMPONENT
// ============================================================

export default function UpdateProfileDialog({
    open,
    onOpenChange,
    profile,
    onSuccess,
    updateProfile,
}) {

    // ========================================================
    // FORM STATE
    // ========================================================

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        profileImage: "",
    });


    // ========================================================
    // VALIDATION STATE
    // ========================================================

    const [errors, setErrors] = useState({});


    // ========================================================
    // SERVER ERROR
    // ========================================================

    const [serverError, setServerError] = useState("");


    // ========================================================
    // SUCCESS MESSAGE
    // ========================================================

    const [successMessage, setSuccessMessage] =
        useState("");


    // ========================================================
    // SAVING STATE
    // ========================================================

    const [saving, setSaving] = useState(false);


    // ========================================================
    // LOAD PROFILE INTO FORM
    // ========================================================

    useEffect(() => {
        if (!open) {
            return;
        }

        setForm({
            fullName: getProfileValue(
                profile,
                "fullName",
                "name",
                "displayName"
            ),

            email: getProfileValue(
                profile,
                "email",
                "emailAddress"
            ),

            phoneNumber: getProfileValue(
                profile,
                "phoneNumber",
                "phone"
            ),

            profileImage: getProfileValue(
                profile,
                "profileImage",
                "profilePictureUrl",
                "profilePicture",
                "avatarUrl",
                "avatar"
            ),
        });

        setErrors({});
        setServerError("");
        setSuccessMessage("");
    }, [open, profile]);


    // ========================================================
    // HANDLE INPUT CHANGE
    // ========================================================

    const handleChange = (event) => {
        const {
            name,
            value,
        } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));

        setErrors((current) => ({
            ...current,
            [name]: "",
        }));

        setServerError("");
        setSuccessMessage("");
    };


    // ========================================================
    // VALIDATE FORM
    // ========================================================

    const validate = () => {
        const nextErrors = {};

        const fullName =
            form.fullName.trim();

        const email =
            form.email.trim();

        const phone =
            form.phoneNumber.trim();

        const profileImage =
            form.profileImage.trim();


        // ====================================================
        // FULL NAME
        // ====================================================

        if (!fullName) {
            nextErrors.fullName =
                "Full name is required.";
        } else if (fullName.length < 2) {
            nextErrors.fullName =
                "Full name must contain at least 2 characters.";
        } else if (fullName.length > 150) {
            nextErrors.fullName =
                "Full name cannot exceed 150 characters.";
        }


        // ====================================================
        // EMAIL
        // ====================================================

        if (!email) {
            nextErrors.email =
                "Email address is required.";
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                email
            )
        ) {
            nextErrors.email =
                "Enter a valid email address.";
        } else if (email.length > 150) {
            nextErrors.email =
                "Email address cannot exceed 150 characters.";
        }


        // ====================================================
        // PHONE
        // ====================================================

        if (
            phone &&
            !/^[+]?[0-9\s\-()]{7,20}$/.test(
                phone
            )
        ) {
            nextErrors.phoneNumber =
                "Please enter a valid phone number.";
        }


        // ====================================================
        // PROFILE IMAGE
        // ====================================================

        if (profileImage) {
            try {
                const url =
                    new URL(profileImage);

                if (
                    ![
                        "http:",
                        "https:",
                    ].includes(url.protocol)
                ) {
                    nextErrors.profileImage =
                        "Profile picture must use a valid HTTP or HTTPS URL.";
                }
            } catch {
                nextErrors.profileImage =
                    "Enter a valid profile picture URL.";
            }
        }


        setErrors(nextErrors);

        return (
            Object.keys(nextErrors).length === 0
        );
    };


    // ========================================================
    // HANDLE SUBMIT
    // ========================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        setServerError("");
        setSuccessMessage("");


        // ====================================================
        // CLIENT VALIDATION
        // ====================================================

        if (!validate()) {
            return;
        }


        // ====================================================
        // SERVICE CHECK
        // ====================================================

        if (
            typeof updateProfile !==
            "function"
        ) {
            setServerError(
                "Profile update service is not connected yet."
            );

            return;
        }


        setSaving(true);


        try {

            // ==================================================
            // BACKEND PAYLOAD
            //
            // Matches UpdateProfileDto:
            //
            // FullName
            // Email
            // PhoneNumber
            // ProfileImage
            // ==================================================

            const payload = {
                fullName:
                    form.fullName.trim(),

                email:
                    form.email.trim(),

                phoneNumber:
                    form.phoneNumber.trim() ||
                    null,

                profileImage:
                    form.profileImage.trim() ||
                    null,
            };


            console.log(
                "========== UPDATE PROFILE DIALOG =========="
            );

            console.log(
                "PROFILE UPDATE PAYLOAD:",
                {
                    ...payload,

                    profileImage:
                        payload.profileImage
                            ? "PROVIDED"
                            : null,
                }
            );


            // ==================================================
            // CALL PARENT / SERVICE
            // ==================================================

            const result =
                await updateProfile(
                    payload
                );


            // ==================================================
            // HANDLE EXPLICIT FAILURE
            // ==================================================

            if (
                result?.success === false
            ) {
                throw result;
            }


            // ==================================================
            // EXTRACT UPDATED PROFILE
            // ==================================================

            const updatedProfile =
                result?.profile ??
                result?.data?.profile ??
                result?.data?.Profile ??
                result?.data ??
                result;


            // ==================================================
            // SUCCESS
            // ==================================================

            setSuccessMessage(
                "Your profile was updated successfully."
            );

            setErrors({});


            // ==================================================
            // INFORM PARENT
            // ==================================================

            if (
                typeof onSuccess ===
                "function"
            ) {
                onSuccess(
                    updatedProfile
                );
            }

        } catch (error) {

            console.error(
                "UPDATE PROFILE DIALOG ERROR:",
                error
            );


            const message =
                extractErrorMessage(
                    error
                );

            const normalized =
                String(
                    message
                ).toLowerCase();


            // ==================================================
            // EMAIL DUPLICATE
            // ==================================================

            if (
                normalized.includes(
                    "email"
                ) &&
                (
                    normalized.includes(
                        "exist"
                    ) ||
                    normalized.includes(
                        "already"
                    ) ||
                    normalized.includes(
                        "duplicate"
                    ) ||
                    normalized.includes(
                        "unique"
                    )
                )
            ) {
                setErrors(
                    (current) => ({
                        ...current,

                        email:
                            "This email address is already associated with another account.",
                    })
                );

                return;
            }


            // ==================================================
            // FULL NAME ERROR
            // ==================================================

            if (
                normalized.includes(
                    "full name"
                )
            ) {
                setErrors(
                    (current) => ({
                        ...current,

                        fullName:
                            message,
                    })
                );

                return;
            }


            // ==================================================
            // PHONE ERROR
            // ==================================================

            if (
                normalized.includes(
                    "phone"
                )
            ) {
                setErrors(
                    (current) => ({
                        ...current,

                        phoneNumber:
                            message,
                    })
                );

                return;
            }


            // ==================================================
            // PROFILE IMAGE ERROR
            // ==================================================

            if (
                normalized.includes(
                    "profile image"
                ) ||
                normalized.includes(
                    "profile picture"
                )
            ) {
                setErrors(
                    (current) => ({
                        ...current,

                        profileImage:
                            message,
                    })
                );

                return;
            }


            // ==================================================
            // GENERAL SERVER ERROR
            // ==================================================

            setServerError(
                message
            );

        } finally {

            setSaving(false);
        }
    };


    // ========================================================
    // HANDLE CLOSE
    // ========================================================

    const handleClose = () => {
        if (saving) {
            return;
        }

        onOpenChange(false);
    };


    // ========================================================
    // RENDER
    // ========================================================

    return (
        <Dialog
            open={open}
            onOpenChange={handleClose}
        >

            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">

                {/* ==================================================
                    HEADER
                ================================================== */}

                <DialogHeader>

                    <DialogTitle className="text-xl font-semibold text-foreground">
                        Update Profile
                    </DialogTitle>

                    <DialogDescription>
                        Update your permitted personal and
                        account information.
                    </DialogDescription>

                </DialogHeader>


                {/* ==================================================
                    FORM
                ================================================== */}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    {/* ==================================================
                        SERVER ERROR
                    ================================================== */}

                    {serverError && (
                        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">

                            <div className="flex items-start gap-2">

                                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />

                                <p className="text-sm text-destructive">
                                    {serverError}
                                </p>

                            </div>

                        </div>
                    )}


                    {/* ==================================================
                        SUCCESS
                    ================================================== */}

                    {successMessage && (
                        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-900/50 dark:bg-emerald-950/30">

                            <div className="flex items-start gap-2">

                                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />

                                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                                    {successMessage}
                                </p>

                            </div>

                        </div>
                    )}


                    {/* ==================================================
                        FULL NAME
                    ================================================== */}

                    <div className="space-y-2">

                        <label
                            htmlFor="manager-full-name"
                            className="text-sm font-medium text-foreground"
                        >
                            Full Name{" "}
                            <span className="text-destructive">
                                *
                            </span>
                        </label>

                        <div className="relative">

                            <UserRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                            <Input
                                id="manager-full-name"
                                name="fullName"
                                value={
                                    form.fullName
                                }
                                onChange={
                                    handleChange
                                }
                                disabled={
                                    saving
                                }
                                placeholder="Enter your full name"
                                className={`pl-10 ${
                                    errors.fullName
                                        ? "border-destructive focus-visible:ring-destructive"
                                        : ""
                                }`}
                                autoComplete="name"
                            />

                        </div>

                        {errors.fullName && (
                            <p className="text-sm text-destructive">
                                {
                                    errors.fullName
                                }
                            </p>
                        )}

                    </div>


                    {/* ==================================================
                        EMAIL
                    ================================================== */}

                    <div className="space-y-2">

                        <label
                            htmlFor="manager-email"
                            className="text-sm font-medium text-foreground"
                        >
                            Email Address{" "}
                            <span className="text-destructive">
                                *
                            </span>
                        </label>

                        <div className="relative">

                            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                            <Input
                                id="manager-email"
                                name="email"
                                type="email"
                                value={
                                    form.email
                                }
                                onChange={
                                    handleChange
                                }
                                disabled={
                                    saving
                                }
                                placeholder="Enter your email address"
                                className={`pl-10 ${
                                    errors.email
                                        ? "border-destructive focus-visible:ring-destructive"
                                        : ""
                                }`}
                                autoComplete="email"
                            />

                        </div>

                        {errors.email && (
                            <p className="text-sm text-destructive">
                                {
                                    errors.email
                                }
                            </p>
                        )}

                        <p className="text-xs text-muted-foreground">
                            Your email address must be
                            unique across the system.
                        </p>

                    </div>


                    {/* ==================================================
                        PHONE
                    ================================================== */}

                    <div className="space-y-2">

                        <label
                            htmlFor="manager-phone"
                            className="text-sm font-medium text-foreground"
                        >
                            Phone Number
                        </label>

                        <div className="relative">

                            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                            <Input
                                id="manager-phone"
                                name="phoneNumber"
                                type="tel"
                                value={
                                    form.phoneNumber
                                }
                                onChange={
                                    handleChange
                                }
                                disabled={
                                    saving
                                }
                                placeholder="Enter your phone number"
                                className={`pl-10 ${
                                    errors.phoneNumber
                                        ? "border-destructive focus-visible:ring-destructive"
                                        : ""
                                }`}
                                autoComplete="tel"
                            />

                        </div>

                        {errors.phoneNumber && (
                            <p className="text-sm text-destructive">
                                {
                                    errors.phoneNumber
                                }
                            </p>
                        )}

                    </div>


                    {/* ==================================================
                        PROFILE PICTURE
                    ================================================== */}

                    <div className="space-y-2">

                        <label
                            htmlFor="manager-profile-image"
                            className="text-sm font-medium text-foreground"
                        >
                            Profile Picture URL
                        </label>

                        <div className="relative">

                            <Camera className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                            <Input
                                id="manager-profile-image"
                                name="profileImage"
                                type="url"
                                value={
                                    form.profileImage
                                }
                                onChange={
                                    handleChange
                                }
                                disabled={
                                    saving
                                }
                                placeholder="https://example.com/profile.jpg"
                                className={`pl-10 ${
                                    errors.profileImage
                                        ? "border-destructive focus-visible:ring-destructive"
                                        : ""
                                }`}
                            />

                        </div>

                        {errors.profileImage && (
                            <p className="text-sm text-destructive">
                                {
                                    errors.profileImage
                                }
                            </p>
                        )}

                    </div>


                    {/* ==================================================
                        PROFILE PREVIEW
                    ================================================== */}

                    {form.profileImage && (
                        <div className="rounded-lg border border-border bg-muted/40 p-4">

                            <p className="mb-3 text-sm font-medium text-foreground">
                                Profile Picture Preview
                            </p>

                            <div className="flex items-center gap-4">

                                <img
                                    src={
                                        form.profileImage
                                    }
                                    alt="Profile preview"
                                    className="h-16 w-16 rounded-full border border-border object-cover"
                                    onError={(event) => {
                                        event.currentTarget.style.display =
                                            "none";
                                    }}
                                />

                                <p className="text-xs text-muted-foreground">
                                    Preview of your
                                    profile picture.
                                </p>

                            </div>

                        </div>
                    )}


                    {/* ==================================================
                        NON-EDITABLE INFORMATION
                    ================================================== */}

                    <div className="rounded-lg border border-border bg-muted/40 p-4">

                        <p className="text-sm font-medium text-foreground">
                            Protected account information
                        </p>

                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                            Your system role, permissions,
                            project assignments, and team
                            relationships cannot be changed
                            from your profile page.
                        </p>

                    </div>


                    {/* ==================================================
                        BUTTONS
                    ================================================== */}

                    <div className="flex justify-end gap-3 border-t border-border pt-5">

                        <Button
                            type="button"
                            variant="outline"
                            onClick={
                                handleClose
                            }
                            disabled={
                                saving
                            }
                            className="gap-2"
                        >
                            <X className="h-4 w-4" />

                            Cancel
                        </Button>


                        <Button
                            type="submit"
                            disabled={
                                saving
                            }
                            className="gap-2"
                        >

                            {saving ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
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

                </form>

            </DialogContent>

        </Dialog>
    );
}