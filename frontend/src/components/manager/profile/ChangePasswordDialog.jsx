import { useEffect, useState } from "react";
import {
    LockKeyhole,
    Eye,
    EyeOff,
    Save,
    X,
    Loader2,
    AlertCircle,
    CheckCircle2,
    ShieldCheck,
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
 * CHANGE PASSWORD DIALOG
 * PM-PROFILE-001 — Update Profile
 * ============================================================
 *
 * Password change requirements:
 * - Current password required
 * - New password required
 * - Confirm password required
 * - Current password is validated by backend
 * - New password policy is enforced by backend
 *
 * This component does NOT:
 * - store passwords
 * - use localStorage
 * - use sessionStorage
 * - modify role
 * - modify permissions
 * ============================================================
 */

const extractErrorMessage = (error) => {
    if (!error) {
        return "Unable to change your password.";
    }

    if (typeof error === "string") {
        return error;
    }

    return (
        error?.message ||
        error?.error ||
        error?.detail ||
        error?.title ||
        "Unable to change your password."
    );
};

export default function ChangePasswordDialog({
    open,
    onOpenChange,
    onSuccess,
    changePassword,
}) {
    const [form, setForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [showCurrentPassword, setShowCurrentPassword] =
        useState(false);

    const [showNewPassword, setShowNewPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

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
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });

        setErrors({});
        setServerError("");
        setSuccessMessage("");

        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
    }, [open]);

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
        setSuccessMessage("");
    };

    const validate = () => {
        const nextErrors = {};

        if (!form.currentPassword) {
            nextErrors.currentPassword =
                "Current password is required.";
        }

        if (!form.newPassword) {
            nextErrors.newPassword =
                "New password is required.";
        } else if (
            form.newPassword.length < 8
        ) {
            nextErrors.newPassword =
                "New password must contain at least 8 characters.";
        }

        if (!form.confirmPassword) {
            nextErrors.confirmPassword =
                "Please confirm your new password.";
        } else if (
            form.newPassword !==
            form.confirmPassword
        ) {
            nextErrors.confirmPassword =
                "Passwords do not match.";
        }

        if (
            form.currentPassword &&
            form.newPassword &&
            form.currentPassword ===
                form.newPassword
        ) {
            nextErrors.newPassword =
                "New password must be different from the current password.";
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
            typeof changePassword !==
            "function"
        ) {
            setServerError(
                "Password change service is not connected yet."
            );
            return;
        }

        setSaving(true);

        try {
            const payload = {
                currentPassword:
                    form.currentPassword,
                newPassword:
                    form.newPassword,
                confirmPassword:
                    form.confirmPassword,
            };

            const result =
                await changePassword(
                    payload
                );

            if (
                result?.success === false
            ) {
                throw result;
            }

            setSuccessMessage(
                "Your password was changed successfully."
            );

            setForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });

            if (
                typeof onSuccess ===
                "function"
            ) {
                onSuccess(result);
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
                    "current password"
                ) ||
                normalized.includes(
                    "incorrect password"
                ) ||
                normalized.includes(
                    "invalid password"
                ) ||
                normalized.includes(
                    "password is incorrect"
                )
            ) {
                setErrors(
                    (current) => ({
                        ...current,
                        currentPassword:
                            "The current password is incorrect.",
                    })
                );
            } else if (
                normalized.includes(
                    "password"
                )
            ) {
                setErrors(
                    (current) => ({
                        ...current,
                        newPassword:
                            message,
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
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[520px]">
                <DialogHeader>
                    <DialogTitle>
                        Change Password
                    </DialogTitle>

                    <DialogDescription>
                        Enter your current password and
                        choose a new secure password.
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
                        SECURITY NOTICE
                    ================================================= */}

                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                        <div className="flex items-start gap-3">
                            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-slate-600" />

                            <div>
                                <p className="text-sm font-medium text-slate-800">
                                    Password security
                                </p>

                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                    Your current password is
                                    required. The server will
                                    enforce the configured
                                    password policy.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* =================================================
                        CURRENT PASSWORD
                    ================================================= */}

                    <div className="space-y-2">
                        <label
                            htmlFor="manager-current-password"
                            className="text-sm font-medium text-slate-700"
                        >
                            Current Password{" "}
                            <span className="text-red-500">
                                *
                            </span>
                        </label>

                        <div className="relative">
                            <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                            <Input
                                id="manager-current-password"
                                name="currentPassword"
                                type={
                                    showCurrentPassword
                                        ? "text"
                                        : "password"
                                }
                                value={
                                    form.currentPassword
                                }
                                onChange={
                                    handleChange
                                }
                                disabled={
                                    saving
                                }
                                placeholder="Enter your current password"
                                className="pl-10 pr-10"
                                autoComplete="current-password"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowCurrentPassword(
                                        (value) =>
                                            !value
                                    )
                                }
                                disabled={
                                    saving
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                                aria-label={
                                    showCurrentPassword
                                        ? "Hide current password"
                                        : "Show current password"
                                }
                            >
                                {showCurrentPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>

                        {errors.currentPassword && (
                            <p className="text-sm text-red-600">
                                {
                                    errors.currentPassword
                                }
                            </p>
                        )}
                    </div>

                    {/* =================================================
                        NEW PASSWORD
                    ================================================= */}

                    <div className="space-y-2">
                        <label
                            htmlFor="manager-new-password"
                            className="text-sm font-medium text-slate-700"
                        >
                            New Password{" "}
                            <span className="text-red-500">
                                *
                            </span>
                        </label>

                        <div className="relative">
                            <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                            <Input
                                id="manager-new-password"
                                name="newPassword"
                                type={
                                    showNewPassword
                                        ? "text"
                                        : "password"
                                }
                                value={
                                    form.newPassword
                                }
                                onChange={
                                    handleChange
                                }
                                disabled={
                                    saving
                                }
                                placeholder="Enter your new password"
                                className="pl-10 pr-10"
                                autoComplete="new-password"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowNewPassword(
                                        (value) =>
                                            !value
                                    )
                                }
                                disabled={
                                    saving
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                                aria-label={
                                    showNewPassword
                                        ? "Hide new password"
                                        : "Show new password"
                                }
                            >
                                {showNewPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>

                        <p className="text-xs text-slate-500">
                            The server's configured password
                            policy is authoritative.
                        </p>

                        {errors.newPassword && (
                            <p className="text-sm text-red-600">
                                {
                                    errors.newPassword
                                }
                            </p>
                        )}
                    </div>

                    {/* =================================================
                        CONFIRM PASSWORD
                    ================================================= */}

                    <div className="space-y-2">
                        <label
                            htmlFor="manager-confirm-password"
                            className="text-sm font-medium text-slate-700"
                        >
                            Confirm New Password{" "}
                            <span className="text-red-500">
                                *
                            </span>
                        </label>

                        <div className="relative">
                            <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                            <Input
                                id="manager-confirm-password"
                                name="confirmPassword"
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                value={
                                    form.confirmPassword
                                }
                                onChange={
                                    handleChange
                                }
                                disabled={
                                    saving
                                }
                                placeholder="Confirm your new password"
                                className="pl-10 pr-10"
                                autoComplete="new-password"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        (value) =>
                                            !value
                                    )
                                }
                                disabled={
                                    saving
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                                aria-label={
                                    showConfirmPassword
                                        ? "Hide password confirmation"
                                        : "Show password confirmation"
                                }
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>

                        {errors.confirmPassword && (
                            <p className="text-sm text-red-600">
                                {
                                    errors.confirmPassword
                                }
                            </p>
                        )}
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
                                    Changing...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    Change Password
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}