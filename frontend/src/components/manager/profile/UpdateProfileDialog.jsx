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

/**
 * ============================================================
 * UPDATE PROFILE DIALOG
 * PM-PROFILE-001 — Update Profile
 * ============================================================
 *
 * Editable:
 * - Full name
 * - Email
 * - Phone number
 * - Profile picture
 *
 * NOT editable:
 * - Role
 * - Permissions
 * - Project relationships
 * - Team relationships
 *
 * API operation is delegated to the parent/service layer.
 * ============================================================
 */

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

const extractErrorMessage = (error) => {
    if (!error) {
        return "Unable to update your profile.";
    }

    if (typeof error === "string") {
        return error;
    }

    return (
        error?.message ||
        error?.error ||
        error?.detail ||
        error?.title ||
        "Unable to update your profile."
    );
};

export default function UpdateProfileDialog({
    open,
    onOpenChange,
    profile,
    onSuccess,
    updateProfile,
}) {
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        profilePictureUrl: "",
    });

    const [errors, setErrors] = useState({});

    const [serverError, setServerError] =
        useState("");

    const [successMessage, setSuccessMessage] =
        useState("");

    const [saving, setSaving] = useState(false);

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
            profilePictureUrl: getProfileValue(
                profile,
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

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));

        setErrors((current) => ({
            ...current,
            [name]: "",
        }));

        setServerError("");
    };

    const validate = () => {
        const nextErrors = {};

        const fullName =
            form.fullName.trim();

        const email =
            form.email.trim();

        const phone =
            form.phoneNumber.trim();

        const profilePicture =
            form.profilePictureUrl.trim();

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
        }

        if (phone && phone.length > 30) {
            nextErrors.phoneNumber =
                "Phone number cannot exceed 30 characters.";
        }

        if (profilePicture) {
            try {
                const url = new URL(
                    profilePicture
                );

                if (
                    !["http:", "https:"].includes(
                        url.protocol
                    )
                ) {
                    nextErrors.profilePictureUrl =
                        "Profile picture must use a valid HTTP or HTTPS URL.";
                }
            } catch {
                nextErrors.profilePictureUrl =
                    "Enter a valid profile picture URL.";
            }
        }

        setErrors(nextErrors);

        return (
            Object.keys(nextErrors).length === 0
        );
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setServerError("");
        setSuccessMessage("");

        if (!validate()) {
            return;
        }

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
            const payload = {
                fullName: form.fullName.trim(),
                email: form.email.trim(),
                phoneNumber:
                    form.phoneNumber.trim() ||
                    null,
                profilePictureUrl:
                    form.profilePictureUrl.trim() ||
                    null,
            };

            const result =
                await updateProfile(payload);

            if (
                result?.success === false
            ) {
                throw result;
            }

            const updatedProfile =
                result?.data ??
                result?.profile ??
                result;

            setSuccessMessage(
                "Your profile was updated successfully."
            );

            if (
                typeof onSuccess ===
                "function"
            ) {
                onSuccess(
                    updatedProfile
                );
            }
        } catch (error) {
            const message =
                extractErrorMessage(
                    error
                );

            const normalized =
                message.toLowerCase();

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
            } else {
                setServerError(
                    message
                );
            }
        } finally {
            setSaving(false);
        }
    };

    const handleClose = () => {
        if (saving) {
            return;
        }

        onOpenChange(false);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={handleClose}
        >
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>
                        Update Profile
                    </DialogTitle>

                    <DialogDescription>
                        Update your permitted personal
                        and account information.
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >
                    {/* =================================================
                        SERVER ERROR
                    ================================================= */}

                    {serverError && (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                            <div className="flex items-start gap-2">
                                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                                <p className="text-sm text-red-700">
                                    {serverError}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* =================================================
                        SUCCESS
                    ================================================= */}

                    {successMessage && (
                        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                            <div className="flex items-start gap-2">
                                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

                                <p className="text-sm text-emerald-700">
                                    {successMessage}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* =================================================
                        FULL NAME
                    ================================================= */}

                    <div className="space-y-2">
                        <label
                            htmlFor="manager-full-name"
                            className="text-sm font-medium text-slate-700"
                        >
                            Full Name{" "}
                            <span className="text-red-500">
                                *
                            </span>
                        </label>

                        <div className="relative">
                            <UserRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

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
                                className="pl-10"
                                autoComplete="name"
                            />
                        </div>

                        {errors.fullName && (
                            <p className="text-sm text-red-600">
                                {
                                    errors.fullName
                                }
                            </p>
                        )}
                    </div>

                    {/* =================================================
                        EMAIL
                    ================================================= */}

                    <div className="space-y-2">
                        <label
                            htmlFor="manager-email"
                            className="text-sm font-medium text-slate-700"
                        >
                            Email Address{" "}
                            <span className="text-red-500">
                                *
                            </span>
                        </label>

                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

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
                                className="pl-10"
                                autoComplete="email"
                            />
                        </div>

                        {errors.email && (
                            <p className="text-sm text-red-600">
                                {
                                    errors.email
                                }
                            </p>
                        )}
                    </div>

                    {/* =================================================
                        PHONE
                    ================================================= */}

                    <div className="space-y-2">
                        <label
                            htmlFor="manager-phone"
                            className="text-sm font-medium text-slate-700"
                        >
                            Phone Number
                        </label>

                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

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
                                className="pl-10"
                                autoComplete="tel"
                            />
                        </div>

                        {errors.phoneNumber && (
                            <p className="text-sm text-red-600">
                                {
                                    errors.phoneNumber
                                }
                            </p>
                        )}
                    </div>

                    {/* =================================================
                        PROFILE PICTURE
                    ================================================= */}

                    <div className="space-y-2">
                        <label
                            htmlFor="manager-profile-picture"
                            className="text-sm font-medium text-slate-700"
                        >
                            Profile Picture URL
                        </label>

                        <div className="relative">
                            <Camera className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                            <Input
                                id="manager-profile-picture"
                                name="profilePictureUrl"
                                type="url"
                                value={
                                    form.profilePictureUrl
                                }
                                onChange={
                                    handleChange
                                }
                                disabled={
                                    saving
                                }
                                placeholder="https://example.com/profile.jpg"
                                className="pl-10"
                            />
                        </div>

                        {errors.profilePictureUrl && (
                            <p className="text-sm text-red-600">
                                {
                                    errors.profilePictureUrl
                                }
                            </p>
                        )}
                    </div>

                    {/* =================================================
                        NON-EDITABLE INFORMATION
                    ================================================= */}

                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm font-medium text-slate-700">
                            Protected account information
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                            Your system role, permissions,
                            project assignments, and team
                            relationships cannot be changed
                            from your profile page.
                        </p>
                    </div>

                    {/* =================================================
                        BUTTONS
                    ================================================= */}

                    <div className="flex justify-end gap-3 border-t pt-5">
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