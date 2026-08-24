import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    ArrowLeft,
    CheckCircle2,
    Eye,
    
    EyeOff,
    KeyRound,
    LockKeyhole,
    ShieldCheck,
    XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import api from "@/services/api";

// ============================================================
// PASSWORD REQUIREMENT COMPONENT
// IMPORTANT:
// Keep this component outside ChangePassword.
// ============================================================

const Requirement = ({ valid, children }) => (
    <div
        className={`flex items-center gap-2 text-xs ${
            valid
                ? "text-emerald-500"
                : "text-muted-foreground"
        }`}
    >
        {valid ? (
            <CheckCircle2 className="h-3.5 w-3.5" />
        ) : (
            <XCircle className="h-3.5 w-3.5" />
        )}

        <span>{children}</span>
    </div>
);

// ============================================================
// CHANGE PASSWORD
// ============================================================

function ChangePassword() {
    const navigate = useNavigate();

    // ========================================================
    // FORM STATE
    // ========================================================

    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    // ========================================================
    // VISIBILITY STATE
    // ========================================================

    const [showCurrentPassword, setShowCurrentPassword] =
        useState(false);

    const [showNewPassword, setShowNewPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    // ========================================================
    // MESSAGE
    // ========================================================

    const [message, setMessage] = useState(null);

    // ========================================================
    // LOADING
    // ========================================================

    const [isSubmitting, setIsSubmitting] = useState(false);

    // ========================================================
    // HANDLE INPUT CHANGE
    // ========================================================

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));

        setMessage(null);
    };

    // ========================================================
    // PASSWORD POLICY
    //
    // Minimum 8 characters
    // At least one uppercase
    // At least one lowercase
    // At least one number
    // At least one special character
    // ========================================================

    const validatePasswordPolicy = (password) => {
        return (
            password.length >= 8 &&
            /[A-Z]/.test(password) &&
            /[a-z]/.test(password) &&
            /[0-9]/.test(password) &&
            /[^A-Za-z0-9]/.test(password)
        );
    };

    // ========================================================
    // PASSWORD REQUIREMENTS
    // ========================================================

    const passwordChecks = {
        minLength:
            formData.newPassword.length >= 8,

        uppercase:
            /[A-Z]/.test(formData.newPassword),

        lowercase:
            /[a-z]/.test(formData.newPassword),

        number:
            /[0-9]/.test(formData.newPassword),

        special:
            /[^A-Za-z0-9]/.test(
                formData.newPassword
            ),
    };

    // ========================================================
    // PASSWORD STRENGTH
    // ========================================================

    const passwordStrength =
        Object.values(passwordChecks).filter(Boolean)
            .length;

    const getPasswordStrengthLabel = () => {
        if (!formData.newPassword) {
            return "Enter a new password";
        }

        if (passwordStrength <= 2) {
            return "Weak password";
        }

        if (passwordStrength <= 4) {
            return "Moderate password";
        }

        return "Strong password";
    };

    const getPasswordStrengthStyle = () => {
        if (!formData.newPassword) {
            return "text-muted-foreground";
        }

        if (passwordStrength <= 2) {
            return "text-red-500";
        }

        if (passwordStrength <= 4) {
            return "text-amber-500";
        }

        return "text-emerald-500";
    };

    // ========================================================
    // VALIDATE FORM
    // ========================================================

    const validateForm = () => {
        const currentPassword =
            formData.currentPassword.trim();

        const newPassword =
            formData.newPassword;

        const confirmPassword =
            formData.confirmPassword;

        // ----------------------------------------------------
        // REQUIRED FIELDS
        // ----------------------------------------------------

        if (
            !currentPassword ||
            !newPassword ||
            !confirmPassword
        ) {
            setMessage({
                type: "error",
                text:
                    "Please complete all required fields.",
            });

            return false;
        }

        // ----------------------------------------------------
        // PASSWORD CONFIRMATION
        // ----------------------------------------------------

        if (
            newPassword !==
            confirmPassword
        ) {
            setMessage({
                type: "error",
                text:
                    "Passwords do not match.",
            });

            return false;
        }

        // ----------------------------------------------------
        // PASSWORD POLICY
        // ----------------------------------------------------

        if (
            !validatePasswordPolicy(
                newPassword
            )
        ) {
            setMessage({
                type: "error",
                text:
                    "Password does not meet the security requirements.",
            });

            return false;
        }

        // ----------------------------------------------------
        // SAME PASSWORD
        // ----------------------------------------------------

        if (
            currentPassword ===
            newPassword
        ) {
            setMessage({
                type: "error",
                text:
                    "New password must be different from the current password.",
            });

            return false;
        }

        return true;
    };

    // ========================================================
    // HANDLE SUBMIT
    // ========================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (isSubmitting) {
            return;
        }

        setMessage(null);

        // ----------------------------------------------------
        // FRONTEND VALIDATION
        // ----------------------------------------------------

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // =================================================
            // SEND REQUEST TO .NET BACKEND
            //
            // POST:
            // /api/Auth/change-password
            //
            // The JWT access token should be attached by
            // your api.js interceptor.
            // =================================================

            const response = await api.post(
                "/Auth/change-password",
                {
                    currentPassword:
                        formData.currentPassword,

                    newPassword:
                        formData.newPassword,

                    confirmPassword:
                        formData.confirmPassword,
                }
            );

            const data = response.data;

            console.log(
                "CHANGE PASSWORD RESPONSE:",
                data
            );

            // =================================================
            // BACKEND RESPONSE
            // =================================================

            if (!data.success) {
                setMessage({
                    type: "error",
                    text:
                        data.message ||
                        "Unable to change password.",
                });

                return;
            }

            // =================================================
            // SUCCESS
            // =================================================

           setFormData({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
});

setMessage({
    type: "success",
    text:
        data.message ||
        "Password changed successfully.",
});

setTimeout(() => {
    navigate("/logout");
}, 1500);


        } catch (error) {
            console.error(
                "CHANGE PASSWORD ERROR:",
                error
            );

            // =================================================
            // BACKEND ERROR
            // =================================================

            if (error.response) {
                const status =
                    error.response.status;

                const responseData =
                    error.response.data;

                console.error(
                    "CHANGE PASSWORD BACKEND ERROR:",
                    responseData
                );

                // ---------------------------------------------
                // UNAUTHORIZED
                // ---------------------------------------------

                if (status === 401) {
                    setMessage({
                        type: "error",
                        text:
                            "Your session has expired. Please log in again.",
                    });

                    return;
                }

                // ---------------------------------------------
                // BAD REQUEST
                // ---------------------------------------------

                if (status === 400) {
                    setMessage({
                        type: "error",
                        text:
                            responseData?.message ||
                            responseData?.Message ||
                            "Unable to change password. Please check your information.",
                    });

                    return;
                }

                // ---------------------------------------------
                // FORBIDDEN
                // ---------------------------------------------

                if (status === 403) {
                    setMessage({
                        type: "error",
                        text:
                            "You are not authorized to change this password.",
                    });

                    return;
                }

                // ---------------------------------------------
                // SERVER ERROR
                // ---------------------------------------------

                if (status >= 500) {
                    setMessage({
                        type: "error",
                        text:
                            "A server error occurred. Please try again later.",
                    });

                    return;
                }

                // ---------------------------------------------
                // OTHER BACKEND ERROR
                // ---------------------------------------------

                setMessage({
                    type: "error",
                    text:
                        responseData?.message ||
                        responseData?.Message ||
                        "Unable to change password.",
                });

                return;
            }

            // =================================================
            // NETWORK ERROR
            // =================================================

            if (error.request) {
                setMessage({
                    type: "error",
                    text:
                        "Unable to connect to the AI-PMS server. Please make sure the backend is running.",
                });

                return;
            }

            // =================================================
            // UNKNOWN ERROR
            // =================================================

            setMessage({
                type: "error",
                text:
                    "Unable to change password. Please try again.",
            });

        } finally {
            setIsSubmitting(false);
        }
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div
            className="
                min-h-full
                bg-background
                px-4
                py-6
                text-foreground
                md:px-6
                md:py-8
            "
        >
            <div className="mx-auto w-full max-w-3xl">

                {/* ==================================================
                    BACK BUTTON
                ================================================== */}

                <Button
                    type="button"
                    variant="ghost"
                    onClick={() =>
                        navigate("/admin/profile")
                    }
                    className="
                        mb-5
                        gap-2
                        px-2
                        text-muted-foreground
                        hover:text-foreground
                    "
                >
                    <ArrowLeft className="h-4 w-4" />

                    Back to Profile
                </Button>

                {/* ==================================================
                    PAGE HEADER
                ================================================== */}

                <div
                    className="
                        mb-6
                        flex
                        items-start
                        gap-4
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
                            bg-blue-50
                            text-blue-600
                            ring-1
                            ring-blue-200
                            dark:bg-blue-500/10
                            dark:text-blue-400
                            dark:ring-blue-500/20
                        "
                    >
                        <KeyRound className="h-6 w-6" />
                    </div>

                    <div>
                        <h1
                            className="
                                text-2xl
                                font-bold
                                tracking-tight
                                md:text-3xl
                            "
                        >
                            Change Password
                        </h1>

                        <p
                            className="
                                mt-1
                                text-sm
                                leading-6
                                text-muted-foreground
                            "
                        >
                            Update your account password
                            and keep your AI-PMS account secure.
                        </p>
                    </div>
                </div>

                {/* ==================================================
                    MESSAGE
                ================================================== */}

                {message && (
                    <div
                        className={`
                            mb-5
                            flex
                            items-start
                            gap-3
                            rounded-xl
                            border
                            px-4
                            py-3
                            text-sm

                            ${
                                message.type ===
                                "success"
                                    ? `
                                        border-emerald-200
                                        bg-emerald-50
                                        text-emerald-700
                                        dark:border-emerald-500/20
                                        dark:bg-emerald-500/10
                                        dark:text-emerald-400
                                    `
                                    : `
                                        border-red-200
                                        bg-red-50
                                        text-red-700
                                        dark:border-red-500/20
                                        dark:bg-red-500/10
                                        dark:text-red-400
                                    `
                            }
                        `}
                    >
                        {message.type ===
                        "success" ? (
                            <CheckCircle2
                                className="
                                    mt-0.5
                                    h-5
                                    w-5
                                    shrink-0
                                "
                            />
                        ) : (
                            <XCircle
                                className="
                                    mt-0.5
                                    h-5
                                    w-5
                                    shrink-0
                                "
                            />
                        )}

                        <span>
                            {message.text}
                        </span>
                    </div>
                )}

                {/* ==================================================
                    MAIN CARD
                ================================================== */}

                <div
                    className="
                        rounded-2xl
                        border
                        border-border/70
                        bg-card
                        shadow-sm
                    "
                >

                    {/* ==================================================
                        CARD HEADER
                    ================================================== */}

                    <div
                        className="
                            border-b
                            border-border
                            px-5
                            py-5
                            md:px-6
                        "
                    >
                        <div
                            className="
                                flex
                                items-center
                                gap-3
                            "
                        >
                            <ShieldCheck
                                className="
                                    h-5
                                    w-5
                                    text-emerald-500
                                "
                            />

                            <div>
                                <h2
                                    className="
                                        font-semibold
                                    "
                                >
                                    Account Security
                                </h2>

                                <p
                                    className="
                                        mt-0.5
                                        text-xs
                                        text-muted-foreground
                                    "
                                >
                                    Enter your current password
                                    and choose a new secure password.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ==================================================
                        FORM
                    ================================================== */}

                    <form
                        onSubmit={handleSubmit}
                        className="
                            space-y-6
                            p-5
                            md:p-6
                        "
                    >

                        {/* ==================================================
                            CURRENT PASSWORD
                        ================================================== */}

                        <div className="space-y-2">
                            <label
                                htmlFor="currentPassword"
                                className="
                                    text-sm
                                    font-medium
                                "
                            >
                                Current Password

                                <span className="ml-1 text-red-500">
                                    *
                                </span>
                            </label>

                            <div className="relative">

                                <LockKeyhole
                                    className="
                                        pointer-events-none
                                        absolute
                                        left-3
                                        top-1/2
                                        h-4
                                        w-4
                                        -translate-y-1/2
                                        text-muted-foreground
                                    "
                                />

                                <Input
                                    id="currentPassword"
                                    name="currentPassword"
                                    type={
                                        showCurrentPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={
                                        formData.currentPassword
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    autoComplete="current-password"
                                    placeholder="Enter current password"
                                    disabled={isSubmitting}
                                    className="
                                        h-11
                                        pl-10
                                        pr-11
                                    "
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowCurrentPassword(
                                            (current) =>
                                                !current
                                        )
                                    }
                                    disabled={isSubmitting}
                                    className="
                                        absolute
                                        right-3
                                        top-1/2
                                        -translate-y-1/2
                                        text-muted-foreground
                                        hover:text-foreground
                                        disabled:pointer-events-none
                                        disabled:opacity-50
                                    "
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
                        </div>

                        {/* ==================================================
                            NEW PASSWORD
                        ================================================== */}

                        <div className="space-y-2">
                            <label
                                htmlFor="newPassword"
                                className="
                                    text-sm
                                    font-medium
                                "
                            >
                                New Password

                                <span className="ml-1 text-red-500">
                                    *
                                </span>
                            </label>

                            <div className="relative">

                                <LockKeyhole
                                    className="
                                        pointer-events-none
                                        absolute
                                        left-3
                                        top-1/2
                                        h-4
                                        w-4
                                        -translate-y-1/2
                                        text-muted-foreground
                                    "
                                />

                                <Input
                                    id="newPassword"
                                    name="newPassword"
                                    type={
                                        showNewPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={
                                        formData.newPassword
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    autoComplete="new-password"
                                    placeholder="Enter new password"
                                    disabled={isSubmitting}
                                    className="
                                        h-11
                                        pl-10
                                        pr-11
                                    "
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowNewPassword(
                                            (current) =>
                                                !current
                                        )
                                    }
                                    disabled={isSubmitting}
                                    className="
                                        absolute
                                        right-3
                                        top-1/2
                                        -translate-y-1/2
                                        text-muted-foreground
                                        hover:text-foreground
                                        disabled:pointer-events-none
                                        disabled:opacity-50
                                    "
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

                            {/* ==================================================
                                PASSWORD STRENGTH
                            ================================================== */}

                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                "
                            >
                                <span
                                    className={`
                                        text-xs
                                        font-medium
                                        ${getPasswordStrengthStyle()}
                                    `}
                                >
                                    {getPasswordStrengthLabel()}
                                </span>

                                <span className="text-xs text-muted-foreground">
                                    {passwordStrength} / 5 requirements
                                </span>
                            </div>

                            {/* ==================================================
                                PASSWORD REQUIREMENTS
                            ================================================== */}

                            <div
                                className="
                                    grid
                                    grid-cols-1
                                    gap-2
                                    rounded-xl
                                    border
                                    border-border
                                    bg-muted/30
                                    p-3
                                    sm:grid-cols-2
                                "
                            >
                                <Requirement
                                    valid={
                                        passwordChecks.minLength
                                    }
                                >
                                    At least 8 characters
                                </Requirement>

                                <Requirement
                                    valid={
                                        passwordChecks.uppercase
                                    }
                                >
                                    One uppercase letter
                                </Requirement>

                                <Requirement
                                    valid={
                                        passwordChecks.lowercase
                                    }
                                >
                                    One lowercase letter
                                </Requirement>

                                <Requirement
                                    valid={
                                        passwordChecks.number
                                    }
                                >
                                    One number
                                </Requirement>

                                <Requirement
                                    valid={
                                        passwordChecks.special
                                    }
                                >
                                    One special character
                                </Requirement>
                            </div>
                        </div>

                        {/* ==================================================
                            CONFIRM PASSWORD
                        ================================================== */}

                        <div className="space-y-2">
                            <label
                                htmlFor="confirmPassword"
                                className="
                                    text-sm
                                    font-medium
                                "
                            >
                                Confirm New Password

                                <span className="ml-1 text-red-500">
                                    *
                                </span>
                            </label>

                            <div className="relative">

                                <LockKeyhole
                                    className="
                                        pointer-events-none
                                        absolute
                                        left-3
                                        top-1/2
                                        h-4
                                        w-4
                                        -translate-y-1/2
                                        text-muted-foreground
                                    "
                                />

                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={
                                        formData.confirmPassword
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    autoComplete="new-password"
                                    placeholder="Confirm new password"
                                    disabled={isSubmitting}
                                    className="
                                        h-11
                                        pl-10
                                        pr-11
                                    "
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            (current) =>
                                                !current
                                        )
                                    }
                                    disabled={isSubmitting}
                                    className="
                                        absolute
                                        right-3
                                        top-1/2
                                        -translate-y-1/2
                                        text-muted-foreground
                                        hover:text-foreground
                                        disabled:pointer-events-none
                                        disabled:opacity-50
                                    "
                                    aria-label={
                                        showConfirmPassword
                                            ? "Hide confirmation password"
                                            : "Show confirmation password"
                                    }
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>

                            {/* PASSWORD MATCH */}

                            {formData.confirmPassword && (
                                <div
                                    className={`
                                        flex
                                        items-center
                                        gap-2
                                        text-xs
                                        ${
                                            formData.newPassword ===
                                            formData.confirmPassword
                                                ? "text-emerald-500"
                                                : "text-red-500"
                                        }
                                    `}
                                >
                                    {formData.newPassword ===
                                    formData.confirmPassword ? (
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                    ) : (
                                        <XCircle className="h-3.5 w-3.5" />
                                    )}

                                    {formData.newPassword ===
                                    formData.confirmPassword
                                        ? "Passwords match"
                                        : "Passwords do not match"}
                                </div>
                            )}
                        </div>

                        {/* ==================================================
                            SECURITY NOTICE
                        ================================================== */}

                        <div
                            className="
                                flex
                                items-start
                                gap-3
                                rounded-xl
                                border
                                border-blue-200/70
                                bg-blue-50/60
                                p-4
                                dark:border-blue-500/20
                                dark:bg-blue-500/[0.06]
                            "
                        >
                            <ShieldCheck
                                className="
                                    mt-0.5
                                    h-5
                                    w-5
                                    shrink-0
                                    text-blue-500
                                "
                            />

                            <div>
                                <p
                                    className="
                                        text-sm
                                        font-semibold
                                    "
                                >
                                    Security reminder
                                </p>

                                <p
                                    className="
                                        mt-1
                                        text-xs
                                        leading-5
                                        text-muted-foreground
                                    "
                                >
                                    Use a unique password
                                    that you do not reuse
                                    on other systems.
                                </p>
                            </div>
                        </div>

                        {/* ==================================================
                            ACTIONS
                        ================================================== */}

                        <div
                            className="
                                flex
                                flex-col-reverse
                                gap-3
                                border-t
                                border-border
                                pt-5
                                sm:flex-row
                                sm:justify-end
                            "
                        >
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                    navigate(
                                        "/admin/profile"
                                    )
                                }
                                disabled={isSubmitting}
                                className="rounded-xl"
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                disabled={
                                    isSubmitting
                                }
                                className="
                                    gap-2
                                    rounded-xl
                                    bg-blue-600
                                    text-white
                                    hover:bg-blue-700
                                    dark:bg-blue-500
                                    dark:hover:bg-blue-600
                                "
                            >
                                <KeyRound className="h-4 w-4" />

                                {isSubmitting
                                    ? "Changing Password..."
                                    : "Save Changes"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ChangePassword;